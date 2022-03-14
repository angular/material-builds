"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTypographyClass = exports.addThemeToAppStyles = void 0;
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
        const themeName = options.theme || 'indigo-pink';
        return themeName === 'custom'
            ? insertCustomTheme(options.project, host, context.logger)
            : insertPrebuiltTheme(options.project, themeName, context.logger);
    };
}
exports.addThemeToAppStyles = addThemeToAppStyles;
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
exports.addTypographyClass = addTypographyClass;
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
    // Path needs to be always relative to the `package.json` or workspace root.
    const themePath = `./node_modules/@angular/material/prebuilt-themes/${theme}.css`;
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
        const styles = targetOptions.styles;
        if (!styles) {
            targetOptions.styles = [assetPath];
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
    const defaultBuilder = schematics_2.defaultTargetBuilders[targetName];
    const targetConfig = project.targets && project.targets.get(targetName);
    const isDefaultBuilder = targetConfig && targetConfig['builder'] === defaultBuilder;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQXdEO0FBRXhELDJEQU9vQztBQUNwQyx3REFPaUM7QUFDakMsK0RBQWdFO0FBQ2hFLHFFQUFvRjtBQUNwRiwrQkFBMEI7QUFFMUIsK0RBQXdEO0FBRXhELDhFQUE4RTtBQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0FBRXJFLG1FQUFtRTtBQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0FBRXZELDJEQUEyRDtBQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO0lBQ2pELE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDO1FBQ2pELE9BQU8sU0FBUyxLQUFLLFFBQVE7WUFDM0IsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDMUQsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsa0RBT0M7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZTtJQUNoRCxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMs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InNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge25vcm1hbGl6ZSwgbG9nZ2luZ30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtQcm9qZWN0RGVmaW5pdGlvbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL3dvcmtzcGFjZSc7XG5pbXBvcnQge1xuICBjaGFpbixcbiAgbm9vcCxcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkQm9keUNsYXNzLFxuICBkZWZhdWx0VGFyZ2V0QnVpbGRlcnMsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyxcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7SW5zZXJ0Q2hhbmdlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlLCB1cGRhdGVXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuLi9zY2hlbWEnO1xuaW1wb3J0IHtjcmVhdGVDdXN0b21UaGVtZX0gZnJvbSAnLi9jcmVhdGUtY3VzdG9tLXRoZW1lJztcblxuLyoqIFBhdGggc2VnbWVudCB0aGF0IGNhbiBiZSBmb3VuZCBpbiBwYXRocyB0aGF0IHJlZmVyIHRvIGEgcHJlYnVpbHQgdGhlbWUuICovXG5jb25zdCBwcmVidWlsdFRoZW1lUGF0aFNlZ21lbnQgPSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJlYnVpbHQtdGhlbWVzJztcblxuLyoqIERlZmF1bHQgZmlsZSBuYW1lIG9mIHRoZSBjdXN0b20gdGhlbWUgdGhhdCBjYW4gYmUgZ2VuZXJhdGVkLiAqL1xuY29uc3QgZGVmYXVsdEN1c3RvbVRoZW1lRmlsZW5hbWUgPSAnY3VzdG9tLXRoZW1lLnNjc3MnO1xuXG4vKiogQWRkIHByZS1idWlsdCBzdHlsZXMgdG8gdGhlIG1haW4gcHJvamVjdCBzdHlsZSBmaWxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFRoZW1lVG9BcHBTdHlsZXMob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHRoZW1lTmFtZSA9IG9wdGlvbnMudGhlbWUgfHwgJ2luZGlnby1waW5rJztcbiAgICByZXR1cm4gdGhlbWVOYW1lID09PSAnY3VzdG9tJ1xuICAgICAgPyBpbnNlcnRDdXN0b21UaGVtZShvcHRpb25zLnByb2plY3QsIGhvc3QsIGNvbnRleHQubG9nZ2VyKVxuICAgICAgOiBpbnNlcnRQcmVidWlsdFRoZW1lKG9wdGlvbnMucHJvamVjdCwgdGhlbWVOYW1lLCBjb250ZXh0LmxvZ2dlcik7XG4gIH07XG59XG5cbi8qKiBBZGRzIHRoZSBnbG9iYWwgdHlwb2dyYXBoeSBjbGFzcyB0byB0aGUgYm9keSBlbGVtZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR5cG9ncmFwaHlDbGFzcyhvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3QgcHJvamVjdEluZGV4RmlsZXMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyhwcm9qZWN0KTtcblxuICAgIGlmICghcHJvamVjdEluZGV4RmlsZXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignTm8gcHJvamVjdCBpbmRleCBIVE1MIGZpbGUgY291bGQgYmUgZm91bmQuJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudHlwb2dyYXBoeSkge1xuICAgICAgcHJvamVjdEluZGV4RmlsZXMuZm9yRWFjaChwYXRoID0+IGFkZEJvZHlDbGFzcyhob3N0LCBwYXRoLCAnbWF0LXR5cG9ncmFwaHknKSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEluc2VydCBhIGN1c3RvbSB0aGVtZSB0byBwcm9qZWN0IHN0eWxlIGZpbGUuIElmIG5vIHZhbGlkIHN0eWxlIGZpbGUgY291bGQgYmUgZm91bmQsIGEgbmV3XG4gKiBTY3NzIGZpbGUgZm9yIHRoZSBjdXN0b20gdGhlbWUgd2lsbCBiZSBjcmVhdGVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBpbnNlcnRDdXN0b21UaGVtZShcbiAgcHJvamVjdE5hbWU6IHN0cmluZyxcbiAgaG9zdDogVHJlZSxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbik6IFByb21pc2U8UnVsZT4ge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIHByb2plY3ROYW1lKTtcbiAgY29uc3Qgc3R5bGVzUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCwgJ3Njc3MnKTtcbiAgY29uc3QgdGhlbWVDb250ZW50ID0gY3JlYXRlQ3VzdG9tVGhlbWUocHJvamVjdE5hbWUpO1xuXG4gIGlmICghc3R5bGVzUGF0aCkge1xuICAgIGlmICghcHJvamVjdC5zb3VyY2VSb290KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgICAgYENvdWxkIG5vdCBmaW5kIHNvdXJjZSByb290IGZvciBwcm9qZWN0OiBcIiR7cHJvamVjdE5hbWV9XCIuIGAgK1xuICAgICAgICAgIGBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgdGhlIFwic291cmNlUm9vdFwiIHByb3BlcnR5IGlzIHNldCBpbiB0aGUgd29ya3NwYWNlIGNvbmZpZy5gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGggdGhyb3VnaCB0aGUgZGV2a2l0IHV0aWxpdGllcyBiZWNhdXNlIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nXG4gICAgLy8gdW5uZWNlc3NhcnkgcGF0aCBzZWdtZW50cyBhbmQgd2luZG93cyBiYWNrc2xhc2ggZGVsaW1pdGVycy5cbiAgICBjb25zdCBjdXN0b21UaGVtZVBhdGggPSBub3JtYWxpemUoam9pbihwcm9qZWN0LnNvdXJjZVJvb3QsIGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lKSk7XG5cbiAgICBpZiAoaG9zdC5leGlzdHMoY3VzdG9tVGhlbWVQYXRoKSkge1xuICAgICAgbG9nZ2VyLndhcm4oYENhbm5vdCBjcmVhdGUgYSBjdXN0b20gQW5ndWxhciBNYXRlcmlhbCB0aGVtZSBiZWNhdXNlXG4gICAgICAgICAgJHtjdXN0b21UaGVtZVBhdGh9IGFscmVhZHkgZXhpc3RzLiBTa2lwcGluZyBjdXN0b20gdGhlbWUgZ2VuZXJhdGlvbi5gKTtcbiAgICAgIHJldHVybiBub29wKCk7XG4gICAgfVxuXG4gICAgaG9zdC5jcmVhdGUoY3VzdG9tVGhlbWVQYXRoLCB0aGVtZUNvbnRlbnQpO1xuICAgIHJldHVybiBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdE5hbWUsICdidWlsZCcsIGN1c3RvbVRoZW1lUGF0aCwgbG9nZ2VyKTtcbiAgfVxuXG4gIGNvbnN0IGluc2VydGlvbiA9IG5ldyBJbnNlcnRDaGFuZ2Uoc3R5bGVzUGF0aCwgMCwgdGhlbWVDb250ZW50KTtcbiAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlc1BhdGgpO1xuXG4gIHJlY29yZGVyLmluc2VydExlZnQoaW5zZXJ0aW9uLnBvcywgaW5zZXJ0aW9uLnRvQWRkKTtcbiAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICByZXR1cm4gbm9vcCgpO1xufVxuXG4vKiogSW5zZXJ0IGEgcHJlLWJ1aWx0IHRoZW1lIGludG8gdGhlIGFuZ3VsYXIuanNvbiBmaWxlLiAqL1xuZnVuY3Rpb24gaW5zZXJ0UHJlYnVpbHRUaGVtZShwcm9qZWN0OiBzdHJpbmcsIHRoZW1lOiBzdHJpbmcsIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGkpOiBSdWxlIHtcbiAgLy8gUGF0aCBuZWVkcyB0byBiZSBhbHdheXMgcmVsYXRpdmUgdG8gdGhlIGBwYWNrYWdlLmpzb25gIG9yIHdvcmtzcGFjZSByb290LlxuICBjb25zdCB0aGVtZVBhdGggPSBgLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvbWF0ZXJpYWwvcHJlYnVpbHQtdGhlbWVzLyR7dGhlbWV9LmNzc2A7XG5cbiAgcmV0dXJuIGNoYWluKFtcbiAgICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ2J1aWxkJywgdGhlbWVQYXRoLCBsb2dnZXIpLFxuICAgIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAndGVzdCcsIHRoZW1lUGF0aCwgbG9nZ2VyKSxcbiAgXSk7XG59XG5cbi8qKiBBZGRzIGEgdGhlbWluZyBzdHlsZSBlbnRyeSB0byB0aGUgZ2l2ZW4gcHJvamVjdCB0YXJnZXQgb3B0aW9ucy4gKi9cbmZ1bmN0aW9uIGFkZFRoZW1lU3R5bGVUb1RhcmdldChcbiAgcHJvamVjdE5hbWU6IHN0cmluZyxcbiAgdGFyZ2V0TmFtZTogJ3Rlc3QnIHwgJ2J1aWxkJyxcbiAgYXNzZXRQYXRoOiBzdHJpbmcsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pOiBSdWxlIHtcbiAgcmV0dXJuIHVwZGF0ZVdvcmtzcGFjZSh3b3Jrc3BhY2UgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIHByb2plY3ROYW1lKTtcblxuICAgIC8vIERvIG5vdCB1cGRhdGUgdGhlIGJ1aWxkZXIgb3B0aW9ucyBpbiBjYXNlIHRoZSB0YXJnZXQgZG9lcyBub3QgdXNlIHRoZSBkZWZhdWx0IENMSSBidWlsZGVyLlxuICAgIGlmICghdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihwcm9qZWN0LCB0YXJnZXROYW1lLCBsb2dnZXIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0T3B0aW9ucyA9IGdldFByb2plY3RUYXJnZXRPcHRpb25zKHByb2plY3QsIHRhcmdldE5hbWUpO1xuICAgIGNvbnN0IHN0eWxlcyA9IHRhcmdldE9wdGlvbnMuc3R5bGVzIGFzIChzdHJpbmcgfCB7aW5wdXQ6IHN0cmluZ30pW107XG5cbiAgICBpZiAoIXN0eWxlcykge1xuICAgICAgdGFyZ2V0T3B0aW9ucy5zdHlsZXMgPSBbYXNzZXRQYXRoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhpc3RpbmdTdHlsZXMgPSBzdHlsZXMubWFwKHMgPT4gKHR5cGVvZiBzID09PSAnc3RyaW5nJyA/IHMgOiBzLmlucHV0KSk7XG5cbiAgICAgIGZvciAobGV0IFtpbmRleCwgc3R5bGVQYXRoXSBvZiBleGlzdGluZ1N0eWxlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgLy8gSWYgdGhlIGdpdmVuIGFzc2V0IGlzIGFscmVhZHkgc3BlY2lmaWVkIGluIHRoZSBzdHlsZXMsIHdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcuXG4gICAgICAgIGlmIChzdHlsZVBhdGggPT09IGFzc2V0UGF0aCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluIGNhc2UgYSBwcmVidWlsdCB0aGVtZSBpcyBhbHJlYWR5IHNldCB1cCwgd2UgY2FuIHNhZmVseSByZXBsYWNlIHRoZSB0aGVtZSB3aXRoIHRoZSBuZXdcbiAgICAgICAgLy8gdGhlbWUgZmlsZS4gSWYgYSBjdXN0b20gdGhlbWUgaXMgc2V0IHVwLCB3ZSBhcmUgbm90IGFibGUgdG8gc2FmZWx5IHJlcGxhY2UgdGhlIGN1c3RvbVxuICAgICAgICAvLyB0aGVtZSBiZWNhdXNlIHRoZXNlIGZpbGVzIGNhbiBjb250YWluIGN1c3RvbSBzdHlsZXMsIHdoaWxlIHByZWJ1aWx0IHRoZW1lcyBhcmVcbiAgICAgICAgLy8gYWx3YXlzIHBhY2thZ2VkIGFuZCBjb25zaWRlcmVkIHJlcGxhY2VhYmxlLlxuICAgICAgICBpZiAoc3R5bGVQYXRoLmluY2x1ZGVzKGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lKSkge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgIGBDb3VsZCBub3QgYWRkIHRoZSBzZWxlY3RlZCB0aGVtZSB0byB0aGUgQ0xJIHByb2plY3QgYCArXG4gICAgICAgICAgICAgIGBjb25maWd1cmF0aW9uIGJlY2F1c2UgdGhlcmUgaXMgYWxyZWFkeSBhIGN1c3RvbSB0aGVtZSBmaWxlIHJlZmVyZW5jZWQuYCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgYWRkIHRoZSBmb2xsb3dpbmcgc3R5bGUgZmlsZSB0byB5b3VyIGNvbmZpZ3VyYXRpb246YCk7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oYCAgICAke2Fzc2V0UGF0aH1gKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGVQYXRoLmluY2x1ZGVzKHByZWJ1aWx0VGhlbWVQYXRoU2VnbWVudCkpIHtcbiAgICAgICAgICBzdHlsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdHlsZXMudW5zaGlmdChhc3NldFBhdGgpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHRoYXQgdGhlIHNwZWNpZmllZCBwcm9qZWN0IHRhcmdldCBpcyBjb25maWd1cmVkIHdpdGggdGhlIGRlZmF1bHQgYnVpbGRlcnMgd2hpY2ggYXJlXG4gKiBwcm92aWRlZCBieSB0aGUgQW5ndWxhciBDTEkuIElmIHRoZSBjb25maWd1cmVkIGJ1aWxkZXIgZG9lcyBub3QgbWF0Y2ggdGhlIGRlZmF1bHQgYnVpbGRlcixcbiAqIHRoaXMgZnVuY3Rpb24gY2FuIGVpdGhlciB0aHJvdyBvciBqdXN0IHNob3cgYSB3YXJuaW5nLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZURlZmF1bHRUYXJnZXRCdWlsZGVyKFxuICBwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbixcbiAgdGFyZ2V0TmFtZTogJ2J1aWxkJyB8ICd0ZXN0JyxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbikge1xuICBjb25zdCBkZWZhdWx0QnVpbGRlciA9IGRlZmF1bHRUYXJnZXRCdWlsZGVyc1t0YXJnZXROYW1lXTtcbiAgY29uc3QgdGFyZ2V0Q29uZmlnID0gcHJvamVjdC50YXJnZXRzICYmIHByb2plY3QudGFyZ2V0cy5nZXQodGFyZ2V0TmFtZSk7XG4gIGNvbnN0IGlzRGVmYXVsdEJ1aWxkZXIgPSB0YXJnZXRDb25maWcgJiYgdGFyZ2V0Q29uZmlnWydidWlsZGVyJ10gPT09IGRlZmF1bHRCdWlsZGVyO1xuXG4gIC8vIEJlY2F1c2UgdGhlIGJ1aWxkIHNldHVwIGZvciB0aGUgQW5ndWxhciBDTEkgY2FuIGJlIGN1c3RvbWl6ZWQgYnkgZGV2ZWxvcGVycywgd2UgY2FuJ3Qga25vd1xuICAvLyB3aGVyZSB0byBwdXQgdGhlIHRoZW1lIGZpbGUgaW4gdGhlIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGlmIGN1c3RvbSBidWlsZGVycyBhcmUgYmVpbmdcbiAgLy8gdXNlZC4gSW4gY2FzZSB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkIGZvciB0aGUgXCJidWlsZFwiIHRhcmdldCwgd2UgdGhyb3cgYW4gZXJyb3IgYW5kXG4gIC8vIGV4aXQgYmVjYXVzZSBzZXR0aW5nIHVwIGEgdGhlbWUgaXMgYSBwcmltYXJ5IGdvYWwgb2YgYG5nLWFkZGAuIE90aGVyd2lzZSBpZiBqdXN0IHRoZSBcInRlc3RcIlxuICAvLyBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQsIHdlIHdhcm4gYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHNcbiAgLy8gd2l0aCBNYXRlcmlhbC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNDE3NlxuICBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIgJiYgdGFyZ2V0TmFtZSA9PT0gJ2J1aWxkJykge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgYFlvdXIgcHJvamVjdCBpcyBub3QgdXNpbmcgdGhlIGRlZmF1bHQgYnVpbGRlcnMgZm9yIGAgK1xuICAgICAgICBgXCIke3RhcmdldE5hbWV9XCIuIFRoZSBBbmd1bGFyIE1hdGVyaWFsIHNjaGVtYXRpY3MgY2Fubm90IGFkZCBhIHRoZW1lIHRvIHRoZSB3b3Jrc3BhY2UgYCArXG4gICAgICAgIGBjb25maWd1cmF0aW9uIGlmIHRoZSBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQuYCxcbiAgICApO1xuICB9IGVsc2UgaWYgKCFpc0RlZmF1bHRCdWlsZGVyKSB7XG4gICAgLy8gZm9yIG5vbi1idWlsZCB0YXJnZXRzIHdlIGdyYWNlZnVsbHkgcmVwb3J0IHRoZSBlcnJvciB3aXRob3V0IGFjdHVhbGx5IGFib3J0aW5nIHRoZVxuICAgIC8vIHNldHVwIHNjaGVtYXRpYy4gVGhpcyBpcyBiZWNhdXNlIGEgdGhlbWUgaXMgbm90IG1hbmRhdG9yeSBmb3IgcnVubmluZyB0ZXN0cy5cbiAgICBsb2dnZXIud2FybihcbiAgICAgIGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhpcyBgICtcbiAgICAgICAgYG1lYW5zIHRoYXQgd2UgY2Fubm90IGFkZCB0aGUgY29uZmlndXJlZCB0aGVtZSB0byB0aGUgXCIke3RhcmdldE5hbWV9XCIgdGFyZ2V0LmAsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBpc0RlZmF1bHRCdWlsZGVyO1xufVxuIl19