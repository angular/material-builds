"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addThemeToAppStyles = addThemeToAppStyles;
exports.addTypographyClass = addTypographyClass;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const change_1 = require("@schematics/angular/utility/change");
const workspace_1 = require("@schematics/angular/utility/workspace");
const path_1 = require("path");
const create_custom_theme_1 = require("./create-custom-theme");
/** Path segment that can be found in paths that refer to a prebuilt theme. */
const prebuiltThemePathSegment = '@angular/material/prebuilt-themes';
/** Default file name of the custom theme that can be generated. */
const defaultCustomThemeFilename = 'custom-theme.scss';
/** Add pre-built styles to the main project style file. */
function addThemeToAppStyles(options) {
    return (host, context) => {
        const themeName = options.theme || 'azure-blue';
        return themeName === 'custom'
            ? insertCustomTheme(options.project, host, context.logger)
            : insertPrebuiltTheme(options.project, themeName, context.logger);
    };
}
/** Adds the global typography class to the body element. */
function addTypographyClass(options) {
    return async (host) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        const projectIndexFiles = (0, schematics_2.getProjectIndexFiles)(project);
        if (!projectIndexFiles.length) {
            throw new schematics_1.SchematicsException('No project index HTML file could be found.');
        }
        if (options.typography) {
            projectIndexFiles.forEach(path => (0, schematics_2.addBodyClass)(host, path, 'mat-typography'));
        }
    };
}
/**
 * Insert a custom theme to project style file. If no valid style file could be found, a new
 * Scss file for the custom theme will be created.
 */
async function insertCustomTheme(projectName, host, logger) {
    const workspace = await (0, workspace_1.getWorkspace)(host);
    const project = (0, schematics_2.getProjectFromWorkspace)(workspace, projectName);
    const stylesPath = (0, schematics_2.getProjectStyleFile)(project, 'scss');
    const themeContent = (0, create_custom_theme_1.createCustomTheme)(projectName);
    if (!stylesPath) {
        if (!project.sourceRoot) {
            throw new schematics_1.SchematicsException(`Could not find source root for project: "${projectName}". ` +
                `Please make sure that the "sourceRoot" property is set in the workspace config.`);
        }
        // Normalize the path through the devkit utilities because we want to avoid having
        // unnecessary path segments and windows backslash delimiters.
        const customThemePath = (0, core_1.normalize)((0, path_1.join)(project.sourceRoot, defaultCustomThemeFilename));
        if (host.exists(customThemePath)) {
            logger.warn(`Cannot create a custom Angular Material theme because
          ${customThemePath} already exists. Skipping custom theme generation.`);
            return (0, schematics_1.noop)();
        }
        host.create(customThemePath, themeContent);
        return addThemeStyleToTarget(projectName, 'build', customThemePath, logger);
    }
    const insertion = new change_1.InsertChange(stylesPath, 0, themeContent);
    const recorder = host.beginUpdate(stylesPath);
    recorder.insertLeft(insertion.pos, insertion.toAdd);
    host.commitUpdate(recorder);
    return (0, schematics_1.noop)();
}
/** Insert a pre-built theme into the angular.json file. */
function insertPrebuiltTheme(project, theme, logger) {
    const themePath = `@angular/material/prebuilt-themes/${theme}.css`;
    return (0, schematics_1.chain)([
        addThemeStyleToTarget(project, 'build', themePath, logger),
        addThemeStyleToTarget(project, 'test', themePath, logger),
    ]);
}
/** Adds a theming style entry to the given project target options. */
function addThemeStyleToTarget(projectName, targetName, assetPath, logger) {
    return (0, workspace_1.updateWorkspace)(workspace => {
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, projectName);
        // Do not update the builder options in case the target does not use the default CLI builder.
        if (!validateDefaultTargetBuilder(project, targetName, logger)) {
            return;
        }
        const targetOptions = (0, schematics_2.getProjectTargetOptions)(project, targetName);
        const styles = targetOptions['styles'];
        if (!styles) {
            targetOptions['styles'] = [assetPath];
        }
        else {
            const existingStyles = styles.map(s => (typeof s === 'string' ? s : s.input));
            for (let [index, stylePath] of existingStyles.entries()) {
                // If the given asset is already specified in the styles, we don't need to do anything.
                if (stylePath === assetPath) {
                    return;
                }
                // In case a prebuilt theme is already set up, we can safely replace the theme with the new
                // theme file. If a custom theme is set up, we are not able to safely replace the custom
                // theme because these files can contain custom styles, while prebuilt themes are
                // always packaged and considered replaceable.
                if (stylePath.includes(defaultCustomThemeFilename)) {
                    logger.error(`Could not add the selected theme to the CLI project ` +
                        `configuration because there is already a custom theme file referenced.`);
                    logger.info(`Please manually add the following style file to your configuration:`);
                    logger.info(`    ${assetPath}`);
                    return;
                }
                else if (stylePath.includes(prebuiltThemePathSegment)) {
                    styles.splice(index, 1);
                }
            }
            styles.unshift(assetPath);
        }
    });
}
/**
 * Validates that the specified project target is configured with the default builders which are
 * provided by the Angular CLI. If the configured builder does not match the default builder,
 * this function can either throw or just show a warning.
 */
function validateDefaultTargetBuilder(project, targetName, logger) {
    const targets = targetName === 'test' ? (0, schematics_2.getProjectTestTargets)(project) : (0, schematics_2.getProjectBuildTargets)(project);
    const isDefaultBuilder = targets.length > 0;
    // Because the build setup for the Angular CLI can be customized by developers, we can't know
    // where to put the theme file in the workspace configuration if custom builders are being
    // used. In case the builder has been changed for the "build" target, we throw an error and
    // exit because setting up a theme is a primary goal of `ng-add`. Otherwise if just the "test"
    // builder has been changed, we warn because a theme is not mandatory for running tests
    // with Material. See: https://github.com/angular/components/issues/14176
    if (!isDefaultBuilder && targetName === 'build') {
        throw new schematics_1.SchematicsException(`Your project is not using the default builders for ` +
            `"${targetName}". The Angular Material schematics cannot add a theme to the workspace ` +
            `configuration if the builder has been changed.`);
    }
    else if (!isDefaultBuilder) {
        // for non-build targets we gracefully report the error without actually aborting the
        // setup schematic. This is because a theme is not mandatory for running tests.
        logger.warn(`Your project is not using the default builders for "${targetName}". This ` +
            `means that we cannot add the configured theme to the "${targetName}" target.`);
    }
    return isDefaultBuilder;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFpQ0gsa0RBT0M7QUFHRCxnREFjQztBQXZERCwrQ0FBb0U7QUFDcEUsMkRBT29DO0FBQ3BDLHdEQVFpQztBQUNqQywrREFBZ0U7QUFDaEUscUVBQW9GO0FBQ3BGLCtCQUEwQjtBQUUxQiwrREFBd0Q7QUFFeEQsOEVBQThFO0FBQzlFLE1BQU0sd0JBQXdCLEdBQUcsbUNBQW1DLENBQUM7QUFFckUsbUVBQW1FO0FBQ25FLE1BQU0sMEJBQTBCLEdBQUcsbUJBQW1CLENBQUM7QUFFdkQsMkRBQTJEO0FBQzNELFNBQWdCLG1CQUFtQixDQUFDLE9BQWU7SUFDakQsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDL0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUM7UUFDaEQsT0FBTyxTQUFTLEtBQUssUUFBUTtZQUMzQixDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUMxRCxDQUFDLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZTtJQUNoRCxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1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LE1BQU0sQ0FBQyxJQUFJLENBQ1QsdURBQXVELFVBQVUsVUFBVTtZQUN6RSx5REFBeUQsVUFBVSxXQUFXLENBQ2pGLENBQUM7SUFDSixDQUFDO0lBRUQsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuZGV2L2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge25vcm1hbGl6ZSwgbG9nZ2luZywgd29ya3NwYWNlc30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgY2hhaW4sXG4gIG5vb3AsXG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZEJvZHlDbGFzcyxcbiAgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGdldFByb2plY3RUYXJnZXRPcHRpb25zLFxuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbiAgZ2V0UHJvamVjdFRlc3RUYXJnZXRzLFxuICBnZXRQcm9qZWN0QnVpbGRUYXJnZXRzLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZSwgdXBkYXRlV29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7Y3JlYXRlQ3VzdG9tVGhlbWV9IGZyb20gJy4vY3JlYXRlLWN1c3RvbS10aGVtZSc7XG5cbi8qKiBQYXRoIHNlZ21lbnQgdGhhdCBjYW4gYmUgZm91bmQgaW4gcGF0aHMgdGhhdCByZWZlciB0byBhIHByZWJ1aWx0IHRoZW1lLiAqL1xuY29uc3QgcHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50ID0gJ0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcyc7XG5cbi8qKiBEZWZhdWx0IGZpbGUgbmFtZSBvZiB0aGUgY3VzdG9tIHRoZW1lIHRoYXQgY2FuIGJlIGdlbmVyYXRlZC4gKi9cbmNvbnN0IGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lID0gJ2N1c3RvbS10aGVtZS5zY3NzJztcblxuLyoqIEFkZCBwcmUtYnVpbHQgc3R5bGVzIHRvIHRoZSBtYWluIHByb2plY3Qgc3R5bGUgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB0aGVtZU5hbWUgPSBvcHRpb25zLnRoZW1lIHx8ICdhenVyZS1ibHVlJztcbiAgICByZXR1cm4gdGhlbWVOYW1lID09PSAnY3VzdG9tJ1xuICAgICAgPyBpbnNlcnRDdXN0b21UaGVtZShvcHRpb25zLnByb2plY3QsIGhvc3QsIGNvbnRleHQubG9nZ2VyKVxuICAgICAgOiBpbnNlcnRQcmVidWlsdFRoZW1lKG9wdGlvbnMucHJvamVjdCwgdGhlbWVOYW1lLCBjb250ZXh0LmxvZ2dlcik7XG4gIH07XG59XG5cbi8qKiBBZGRzIHRoZSBnbG9iYWwgdHlwb2dyYXBoeSBjbGFzcyB0byB0aGUgYm9keSBlbGVtZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR5cG9ncmFwaHlDbGFzcyhvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3QgcHJvamVjdEluZGV4RmlsZXMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyhwcm9qZWN0KTtcblxuICAgIGlmICghcHJvamVjdEluZGV4RmlsZXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignTm8gcHJvamVjdCBpbmRleCBIVE1MIGZpbGUgY291bGQgYmUgZm91bmQuJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudHlwb2dyYXBoeSkge1xuICAgICAgcHJvamVjdEluZGV4RmlsZXMuZm9yRWFjaChwYXRoID0+IGFkZEJvZHlDbGFzcyhob3N0LCBwYXRoLCAnbWF0LXR5cG9ncmFwaHknKSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEluc2VydCBhIGN1c3RvbSB0aGVtZSB0byBwcm9qZWN0IHN0eWxlIGZpbGUuIElmIG5vIHZhbGlkIHN0eWxlIGZpbGUgY291bGQgYmUgZm91bmQsIGEgbmV3XG4gKiBTY3NzIGZpbGUgZm9yIHRoZSBjdXN0b20gdGhlbWUgd2lsbCBiZSBjcmVhdGVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBpbnNlcnRDdXN0b21UaGVtZShcbiAgcHJvamVjdE5hbWU6IHN0cmluZyxcbiAgaG9zdDogVHJlZSxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbik6IFByb21pc2U8UnVsZT4ge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIHByb2plY3ROYW1lKTtcbiAgY29uc3Qgc3R5bGVzUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCwgJ3Njc3MnKTtcbiAgY29uc3QgdGhlbWVDb250ZW50ID0gY3JlYXRlQ3VzdG9tVGhlbWUocHJvamVjdE5hbWUpO1xuXG4gIGlmICghc3R5bGVzUGF0aCkge1xuICAgIGlmICghcHJvamVjdC5zb3VyY2VSb290KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgICAgYENvdWxkIG5vdCBmaW5kIHNvdXJjZSByb290IGZvciBwcm9qZWN0OiBcIiR7cHJvamVjdE5hbWV9XCIuIGAgK1xuICAgICAgICAgIGBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgdGhlIFwic291cmNlUm9vdFwiIHByb3BlcnR5IGlzIHNldCBpbiB0aGUgd29ya3NwYWNlIGNvbmZpZy5gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGggdGhyb3VnaCB0aGUgZGV2a2l0IHV0aWxpdGllcyBiZWNhdXNlIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nXG4gICAgLy8gdW5uZWNlc3NhcnkgcGF0aCBzZWdtZW50cyBhbmQgd2luZG93cyBiYWNrc2xhc2ggZGVsaW1pdGVycy5cbiAgICBjb25zdCBjdXN0b21UaGVtZVBhdGggPSBub3JtYWxpemUoam9pbihwcm9qZWN0LnNvdXJjZVJvb3QsIGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lKSk7XG5cbiAgICBpZiAoaG9zdC5leGlzdHMoY3VzdG9tVGhlbWVQYXRoKSkge1xuICAgICAgbG9nZ2VyLndhcm4oYENhbm5vdCBjcmVhdGUgYSBjdXN0b20gQW5ndWxhciBNYXRlcmlhbCB0aGVtZSBiZWNhdXNlXG4gICAgICAgICAgJHtjdXN0b21UaGVtZVBhdGh9IGFscmVhZHkgZXhpc3RzLiBTa2lwcGluZyBjdXN0b20gdGhlbWUgZ2VuZXJhdGlvbi5gKTtcbiAgICAgIHJldHVybiBub29wKCk7XG4gICAgfVxuXG4gICAgaG9zdC5jcmVhdGUoY3VzdG9tVGhlbWVQYXRoLCB0aGVtZUNvbnRlbnQpO1xuICAgIHJldHVybiBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdE5hbWUsICdidWlsZCcsIGN1c3RvbVRoZW1lUGF0aCwgbG9nZ2VyKTtcbiAgfVxuXG4gIGNvbnN0IGluc2VydGlvbiA9IG5ldyBJbnNlcnRDaGFuZ2Uoc3R5bGVzUGF0aCwgMCwgdGhlbWVDb250ZW50KTtcbiAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlc1BhdGgpO1xuXG4gIHJlY29yZGVyLmluc2VydExlZnQoaW5zZXJ0aW9uLnBvcywgaW5zZXJ0aW9uLnRvQWRkKTtcbiAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICByZXR1cm4gbm9vcCgpO1xufVxuXG4vKiogSW5zZXJ0IGEgcHJlLWJ1aWx0IHRoZW1lIGludG8gdGhlIGFuZ3VsYXIuanNvbiBmaWxlLiAqL1xuZnVuY3Rpb24gaW5zZXJ0UHJlYnVpbHRUaGVtZShwcm9qZWN0OiBzdHJpbmcsIHRoZW1lOiBzdHJpbmcsIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGkpOiBSdWxlIHtcbiAgY29uc3QgdGhlbWVQYXRoID0gYEBhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcy8ke3RoZW1lfS5jc3NgO1xuXG4gIHJldHVybiBjaGFpbihbXG4gICAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICdidWlsZCcsIHRoZW1lUGF0aCwgbG9nZ2VyKSxcbiAgICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ3Rlc3QnLCB0aGVtZVBhdGgsIGxvZ2dlciksXG4gIF0pO1xufVxuXG4vKiogQWRkcyBhIHRoZW1pbmcgc3R5bGUgZW50cnkgdG8gdGhlIGdpdmVuIHByb2plY3QgdGFyZ2V0IG9wdGlvbnMuICovXG5mdW5jdGlvbiBhZGRUaGVtZVN0eWxlVG9UYXJnZXQoXG4gIHByb2plY3ROYW1lOiBzdHJpbmcsXG4gIHRhcmdldE5hbWU6ICd0ZXN0JyB8ICdidWlsZCcsXG4gIGFzc2V0UGF0aDogc3RyaW5nLFxuICBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyQXBpLFxuKTogUnVsZSB7XG4gIHJldHVybiB1cGRhdGVXb3Jrc3BhY2Uod29ya3NwYWNlID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBwcm9qZWN0TmFtZSk7XG5cbiAgICAvLyBEbyBub3QgdXBkYXRlIHRoZSBidWlsZGVyIG9wdGlvbnMgaW4gY2FzZSB0aGUgdGFyZ2V0IGRvZXMgbm90IHVzZSB0aGUgZGVmYXVsdCBDTEkgYnVpbGRlci5cbiAgICBpZiAoIXZhbGlkYXRlRGVmYXVsdFRhcmdldEJ1aWxkZXIocHJvamVjdCwgdGFyZ2V0TmFtZSwgbG9nZ2VyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldE9wdGlvbnMgPSBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyhwcm9qZWN0LCB0YXJnZXROYW1lKTtcbiAgICBjb25zdCBzdHlsZXMgPSB0YXJnZXRPcHRpb25zWydzdHlsZXMnXSBhcyAoc3RyaW5nIHwge2lucHV0OiBzdHJpbmd9KVtdO1xuXG4gICAgaWYgKCFzdHlsZXMpIHtcbiAgICAgIHRhcmdldE9wdGlvbnNbJ3N0eWxlcyddID0gW2Fzc2V0UGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nU3R5bGVzID0gc3R5bGVzLm1hcChzID0+ICh0eXBlb2YgcyA9PT0gJ3N0cmluZycgPyBzIDogcy5pbnB1dCkpO1xuXG4gICAgICBmb3IgKGxldCBbaW5kZXgsIHN0eWxlUGF0aF0gb2YgZXhpc3RpbmdTdHlsZXMuZW50cmllcygpKSB7XG4gICAgICAgIC8vIElmIHRoZSBnaXZlbiBhc3NldCBpcyBhbHJlYWR5IHNwZWNpZmllZCBpbiB0aGUgc3R5bGVzLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLlxuICAgICAgICBpZiAoc3R5bGVQYXRoID09PSBhc3NldFBhdGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiBjYXNlIGEgcHJlYnVpbHQgdGhlbWUgaXMgYWxyZWFkeSBzZXQgdXAsIHdlIGNhbiBzYWZlbHkgcmVwbGFjZSB0aGUgdGhlbWUgd2l0aCB0aGUgbmV3XG4gICAgICAgIC8vIHRoZW1lIGZpbGUuIElmIGEgY3VzdG9tIHRoZW1lIGlzIHNldCB1cCwgd2UgYXJlIG5vdCBhYmxlIHRvIHNhZmVseSByZXBsYWNlIHRoZSBjdXN0b21cbiAgICAgICAgLy8gdGhlbWUgYmVjYXVzZSB0aGVzZSBmaWxlcyBjYW4gY29udGFpbiBjdXN0b20gc3R5bGVzLCB3aGlsZSBwcmVidWlsdCB0aGVtZXMgYXJlXG4gICAgICAgIC8vIGFsd2F5cyBwYWNrYWdlZCBhbmQgY29uc2lkZXJlZCByZXBsYWNlYWJsZS5cbiAgICAgICAgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICBgQ291bGQgbm90IGFkZCB0aGUgc2VsZWN0ZWQgdGhlbWUgdG8gdGhlIENMSSBwcm9qZWN0IGAgK1xuICAgICAgICAgICAgICBgY29uZmlndXJhdGlvbiBiZWNhdXNlIHRoZXJlIGlzIGFscmVhZHkgYSBjdXN0b20gdGhlbWUgZmlsZSByZWZlcmVuY2VkLmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIG1hbnVhbGx5IGFkZCB0aGUgZm9sbG93aW5nIHN0eWxlIGZpbGUgdG8geW91ciBjb25maWd1cmF0aW9uOmApO1xuICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAgJHthc3NldFBhdGh9YCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhwcmVidWlsdFRoZW1lUGF0aFNlZ21lbnQpKSB7XG4gICAgICAgICAgc3R5bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3R5bGVzLnVuc2hpZnQoYXNzZXRQYXRoKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBzcGVjaWZpZWQgcHJvamVjdCB0YXJnZXQgaXMgY29uZmlndXJlZCB3aXRoIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIHdoaWNoIGFyZVxuICogcHJvdmlkZWQgYnkgdGhlIEFuZ3VsYXIgQ0xJLiBJZiB0aGUgY29uZmlndXJlZCBidWlsZGVyIGRvZXMgbm90IG1hdGNoIHRoZSBkZWZhdWx0IGJ1aWxkZXIsXG4gKiB0aGlzIGZ1bmN0aW9uIGNhbiBlaXRoZXIgdGhyb3cgb3IganVzdCBzaG93IGEgd2FybmluZy5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihcbiAgcHJvamVjdDogd29ya3NwYWNlcy5Qcm9qZWN0RGVmaW5pdGlvbixcbiAgdGFyZ2V0TmFtZTogJ2J1aWxkJyB8ICd0ZXN0JyxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbikge1xuICBjb25zdCB0YXJnZXRzID1cbiAgICB0YXJnZXROYW1lID09PSAndGVzdCcgPyBnZXRQcm9qZWN0VGVzdFRhcmdldHMocHJvamVjdCkgOiBnZXRQcm9qZWN0QnVpbGRUYXJnZXRzKHByb2plY3QpO1xuICBjb25zdCBpc0RlZmF1bHRCdWlsZGVyID0gdGFyZ2V0cy5sZW5ndGggPiAwO1xuXG4gIC8vIEJlY2F1c2UgdGhlIGJ1aWxkIHNldHVwIGZvciB0aGUgQW5ndWxhciBDTEkgY2FuIGJlIGN1c3RvbWl6ZWQgYnkgZGV2ZWxvcGVycywgd2UgY2FuJ3Qga25vd1xuICAvLyB3aGVyZSB0byBwdXQgdGhlIHRoZW1lIGZpbGUgaW4gdGhlIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGlmIGN1c3RvbSBidWlsZGVycyBhcmUgYmVpbmdcbiAgLy8gdXNlZC4gSW4gY2FzZSB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkIGZvciB0aGUgXCJidWlsZFwiIHRhcmdldCwgd2UgdGhyb3cgYW4gZXJyb3IgYW5kXG4gIC8vIGV4aXQgYmVjYXVzZSBzZXR0aW5nIHVwIGEgdGhlbWUgaXMgYSBwcmltYXJ5IGdvYWwgb2YgYG5nLWFkZGAuIE90aGVyd2lzZSBpZiBqdXN0IHRoZSBcInRlc3RcIlxuICAvLyBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQsIHdlIHdhcm4gYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHNcbiAgLy8gd2l0aCBNYXRlcmlhbC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNDE3NlxuICBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIgJiYgdGFyZ2V0TmFtZSA9PT0gJ2J1aWxkJykge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgYFlvdXIgcHJvamVjdCBpcyBub3QgdXNpbmcgdGhlIGRlZmF1bHQgYnVpbGRlcnMgZm9yIGAgK1xuICAgICAgICBgXCIke3RhcmdldE5hbWV9XCIuIFRoZSBBbmd1bGFyIE1hdGVyaWFsIHNjaGVtYXRpY3MgY2Fubm90IGFkZCBhIHRoZW1lIHRvIHRoZSB3b3Jrc3BhY2UgYCArXG4gICAgICAgIGBjb25maWd1cmF0aW9uIGlmIHRoZSBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQuYCxcbiAgICApO1xuICB9IGVsc2UgaWYgKCFpc0RlZmF1bHRCdWlsZGVyKSB7XG4gICAgLy8gZm9yIG5vbi1idWlsZCB0YXJnZXRzIHdlIGdyYWNlZnVsbHkgcmVwb3J0IHRoZSBlcnJvciB3aXRob3V0IGFjdHVhbGx5IGFib3J0aW5nIHRoZVxuICAgIC8vIHNldHVwIHNjaGVtYXRpYy4gVGhpcyBpcyBiZWNhdXNlIGEgdGhlbWUgaXMgbm90IG1hbmRhdG9yeSBmb3IgcnVubmluZyB0ZXN0cy5cbiAgICBsb2dnZXIud2FybihcbiAgICAgIGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhpcyBgICtcbiAgICAgICAgYG1lYW5zIHRoYXQgd2UgY2Fubm90IGFkZCB0aGUgY29uZmlndXJlZCB0aGVtZSB0byB0aGUgXCIke3RhcmdldE5hbWV9XCIgdGFyZ2V0LmAsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBpc0RlZmF1bHRCdWlsZGVyO1xufVxuIl19