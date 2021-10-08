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
        return themeName === 'custom' ?
            insertCustomTheme(options.project, host, context.logger) :
            insertPrebuiltTheme(options.project, themeName, context.logger);
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
        addThemeStyleToTarget(project, 'test', themePath, logger)
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
            const existingStyles = styles.map(s => typeof s === 'string' ? s : s.input);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQXdEO0FBRXhELDJEQU9vQztBQUNwQyx3REFPaUM7QUFDakMsK0RBQWdFO0FBQ2hFLHFFQUFvRjtBQUNwRiwrQkFBMEI7QUFFMUIsK0RBQXdEO0FBRXhELDhFQUE4RTtBQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0FBRXJFLG1FQUFtRTtBQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0FBRXZELDJEQUEyRDtBQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO0lBQ2pELE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDO1FBQ2pELE9BQU8sU0FBUyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQzdCLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFELG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwRSxDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsa0RBT0M7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZTtJQUNoRCxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMs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Ii8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge25vcm1hbGl6ZSwgbG9nZ2luZ30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtQcm9qZWN0RGVmaW5pdGlvbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL3dvcmtzcGFjZSc7XG5pbXBvcnQge1xuICBjaGFpbixcbiAgbm9vcCxcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkQm9keUNsYXNzLFxuICBkZWZhdWx0VGFyZ2V0QnVpbGRlcnMsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyxcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7SW5zZXJ0Q2hhbmdlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlLCB1cGRhdGVXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuLi9zY2hlbWEnO1xuaW1wb3J0IHtjcmVhdGVDdXN0b21UaGVtZX0gZnJvbSAnLi9jcmVhdGUtY3VzdG9tLXRoZW1lJztcblxuLyoqIFBhdGggc2VnbWVudCB0aGF0IGNhbiBiZSBmb3VuZCBpbiBwYXRocyB0aGF0IHJlZmVyIHRvIGEgcHJlYnVpbHQgdGhlbWUuICovXG5jb25zdCBwcmVidWlsdFRoZW1lUGF0aFNlZ21lbnQgPSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJlYnVpbHQtdGhlbWVzJztcblxuLyoqIERlZmF1bHQgZmlsZSBuYW1lIG9mIHRoZSBjdXN0b20gdGhlbWUgdGhhdCBjYW4gYmUgZ2VuZXJhdGVkLiAqL1xuY29uc3QgZGVmYXVsdEN1c3RvbVRoZW1lRmlsZW5hbWUgPSAnY3VzdG9tLXRoZW1lLnNjc3MnO1xuXG4vKiogQWRkIHByZS1idWlsdCBzdHlsZXMgdG8gdGhlIG1haW4gcHJvamVjdCBzdHlsZSBmaWxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFRoZW1lVG9BcHBTdHlsZXMob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHRoZW1lTmFtZSA9IG9wdGlvbnMudGhlbWUgfHwgJ2luZGlnby1waW5rJztcbiAgICByZXR1cm4gdGhlbWVOYW1lID09PSAnY3VzdG9tJyA/XG4gICAgICBpbnNlcnRDdXN0b21UaGVtZShvcHRpb25zLnByb2plY3QsIGhvc3QsIGNvbnRleHQubG9nZ2VyKSA6XG4gICAgICBpbnNlcnRQcmVidWlsdFRoZW1lKG9wdGlvbnMucHJvamVjdCwgdGhlbWVOYW1lLCBjb250ZXh0LmxvZ2dlcik7XG4gIH07XG59XG5cbi8qKiBBZGRzIHRoZSBnbG9iYWwgdHlwb2dyYXBoeSBjbGFzcyB0byB0aGUgYm9keSBlbGVtZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR5cG9ncmFwaHlDbGFzcyhvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3QgcHJvamVjdEluZGV4RmlsZXMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyhwcm9qZWN0KTtcblxuICAgIGlmICghcHJvamVjdEluZGV4RmlsZXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignTm8gcHJvamVjdCBpbmRleCBIVE1MIGZpbGUgY291bGQgYmUgZm91bmQuJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudHlwb2dyYXBoeSkge1xuICAgICAgcHJvamVjdEluZGV4RmlsZXMuZm9yRWFjaChwYXRoID0+IGFkZEJvZHlDbGFzcyhob3N0LCBwYXRoLCAnbWF0LXR5cG9ncmFwaHknKSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEluc2VydCBhIGN1c3RvbSB0aGVtZSB0byBwcm9qZWN0IHN0eWxlIGZpbGUuIElmIG5vIHZhbGlkIHN0eWxlIGZpbGUgY291bGQgYmUgZm91bmQsIGEgbmV3XG4gKiBTY3NzIGZpbGUgZm9yIHRoZSBjdXN0b20gdGhlbWUgd2lsbCBiZSBjcmVhdGVkLlxuICovXG5hc3luYyBmdW5jdGlvbiBpbnNlcnRDdXN0b21UaGVtZShwcm9qZWN0TmFtZTogc3RyaW5nLCBob3N0OiBUcmVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSk6IFByb21pc2U8UnVsZT4ge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIHByb2plY3ROYW1lKTtcbiAgY29uc3Qgc3R5bGVzUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCwgJ3Njc3MnKTtcbiAgY29uc3QgdGhlbWVDb250ZW50ID0gY3JlYXRlQ3VzdG9tVGhlbWUocHJvamVjdE5hbWUpO1xuXG4gIGlmICghc3R5bGVzUGF0aCkge1xuICAgIGlmICghcHJvamVjdC5zb3VyY2VSb290KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ291bGQgbm90IGZpbmQgc291cmNlIHJvb3QgZm9yIHByb2plY3Q6IFwiJHtwcm9qZWN0TmFtZX1cIi4gYCArXG4gICAgICAgIGBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgdGhlIFwic291cmNlUm9vdFwiIHByb3BlcnR5IGlzIHNldCBpbiB0aGUgd29ya3NwYWNlIGNvbmZpZy5gKTtcbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGggdGhyb3VnaCB0aGUgZGV2a2l0IHV0aWxpdGllcyBiZWNhdXNlIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nXG4gICAgLy8gdW5uZWNlc3NhcnkgcGF0aCBzZWdtZW50cyBhbmQgd2luZG93cyBiYWNrc2xhc2ggZGVsaW1pdGVycy5cbiAgICBjb25zdCBjdXN0b21UaGVtZVBhdGggPSBub3JtYWxpemUoam9pbihwcm9qZWN0LnNvdXJjZVJvb3QsIGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lKSk7XG5cbiAgICBpZiAoaG9zdC5leGlzdHMoY3VzdG9tVGhlbWVQYXRoKSkge1xuICAgICAgbG9nZ2VyLndhcm4oYENhbm5vdCBjcmVhdGUgYSBjdXN0b20gQW5ndWxhciBNYXRlcmlhbCB0aGVtZSBiZWNhdXNlXG4gICAgICAgICAgJHtjdXN0b21UaGVtZVBhdGh9IGFscmVhZHkgZXhpc3RzLiBTa2lwcGluZyBjdXN0b20gdGhlbWUgZ2VuZXJhdGlvbi5gKTtcbiAgICAgIHJldHVybiBub29wKCk7XG4gICAgfVxuXG4gICAgaG9zdC5jcmVhdGUoY3VzdG9tVGhlbWVQYXRoLCB0aGVtZUNvbnRlbnQpO1xuICAgIHJldHVybiBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdE5hbWUsICdidWlsZCcsIGN1c3RvbVRoZW1lUGF0aCwgbG9nZ2VyKTtcbiAgfVxuXG4gIGNvbnN0IGluc2VydGlvbiA9IG5ldyBJbnNlcnRDaGFuZ2Uoc3R5bGVzUGF0aCwgMCwgdGhlbWVDb250ZW50KTtcbiAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlc1BhdGgpO1xuXG4gIHJlY29yZGVyLmluc2VydExlZnQoaW5zZXJ0aW9uLnBvcywgaW5zZXJ0aW9uLnRvQWRkKTtcbiAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICByZXR1cm4gbm9vcCgpO1xufVxuXG4vKiogSW5zZXJ0IGEgcHJlLWJ1aWx0IHRoZW1lIGludG8gdGhlIGFuZ3VsYXIuanNvbiBmaWxlLiAqL1xuZnVuY3Rpb24gaW5zZXJ0UHJlYnVpbHRUaGVtZShwcm9qZWN0OiBzdHJpbmcsIHRoZW1lOiBzdHJpbmcsIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGkpOiBSdWxlIHtcbiAgLy8gUGF0aCBuZWVkcyB0byBiZSBhbHdheXMgcmVsYXRpdmUgdG8gdGhlIGBwYWNrYWdlLmpzb25gIG9yIHdvcmtzcGFjZSByb290LlxuICBjb25zdCB0aGVtZVBhdGggPSBgLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvbWF0ZXJpYWwvcHJlYnVpbHQtdGhlbWVzLyR7dGhlbWV9LmNzc2A7XG5cbiAgcmV0dXJuIGNoYWluKFtcbiAgICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ2J1aWxkJywgdGhlbWVQYXRoLCBsb2dnZXIpLFxuICAgIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAndGVzdCcsIHRoZW1lUGF0aCwgbG9nZ2VyKVxuICBdKTtcbn1cblxuLyoqIEFkZHMgYSB0aGVtaW5nIHN0eWxlIGVudHJ5IHRvIHRoZSBnaXZlbiBwcm9qZWN0IHRhcmdldCBvcHRpb25zLiAqL1xuZnVuY3Rpb24gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3ROYW1lOiBzdHJpbmcsIHRhcmdldE5hbWU6ICd0ZXN0JyB8ICdidWlsZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRQYXRoOiBzdHJpbmcsIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGkpOiBSdWxlIHtcbiAgcmV0dXJuIHVwZGF0ZVdvcmtzcGFjZSh3b3Jrc3BhY2UgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIHByb2plY3ROYW1lKTtcblxuICAgIC8vIERvIG5vdCB1cGRhdGUgdGhlIGJ1aWxkZXIgb3B0aW9ucyBpbiBjYXNlIHRoZSB0YXJnZXQgZG9lcyBub3QgdXNlIHRoZSBkZWZhdWx0IENMSSBidWlsZGVyLlxuICAgIGlmICghdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihwcm9qZWN0LCB0YXJnZXROYW1lLCBsb2dnZXIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0T3B0aW9ucyA9IGdldFByb2plY3RUYXJnZXRPcHRpb25zKHByb2plY3QsIHRhcmdldE5hbWUpO1xuICAgIGNvbnN0IHN0eWxlcyA9IHRhcmdldE9wdGlvbnMuc3R5bGVzIGFzIChzdHJpbmcgfCB7aW5wdXQ6IHN0cmluZ30pW107XG5cbiAgICBpZiAoIXN0eWxlcykge1xuICAgICAgdGFyZ2V0T3B0aW9ucy5zdHlsZXMgPSBbYXNzZXRQYXRoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhpc3RpbmdTdHlsZXMgPSBzdHlsZXMubWFwKHMgPT4gdHlwZW9mIHMgPT09ICdzdHJpbmcnID8gcyA6IHMuaW5wdXQpO1xuXG4gICAgICBmb3IgKGxldCBbaW5kZXgsIHN0eWxlUGF0aF0gb2YgZXhpc3RpbmdTdHlsZXMuZW50cmllcygpKSB7XG4gICAgICAgIC8vIElmIHRoZSBnaXZlbiBhc3NldCBpcyBhbHJlYWR5IHNwZWNpZmllZCBpbiB0aGUgc3R5bGVzLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLlxuICAgICAgICBpZiAoc3R5bGVQYXRoID09PSBhc3NldFBhdGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiBjYXNlIGEgcHJlYnVpbHQgdGhlbWUgaXMgYWxyZWFkeSBzZXQgdXAsIHdlIGNhbiBzYWZlbHkgcmVwbGFjZSB0aGUgdGhlbWUgd2l0aCB0aGUgbmV3XG4gICAgICAgIC8vIHRoZW1lIGZpbGUuIElmIGEgY3VzdG9tIHRoZW1lIGlzIHNldCB1cCwgd2UgYXJlIG5vdCBhYmxlIHRvIHNhZmVseSByZXBsYWNlIHRoZSBjdXN0b21cbiAgICAgICAgLy8gdGhlbWUgYmVjYXVzZSB0aGVzZSBmaWxlcyBjYW4gY29udGFpbiBjdXN0b20gc3R5bGVzLCB3aGlsZSBwcmVidWlsdCB0aGVtZXMgYXJlXG4gICAgICAgIC8vIGFsd2F5cyBwYWNrYWdlZCBhbmQgY29uc2lkZXJlZCByZXBsYWNlYWJsZS5cbiAgICAgICAgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoYENvdWxkIG5vdCBhZGQgdGhlIHNlbGVjdGVkIHRoZW1lIHRvIHRoZSBDTEkgcHJvamVjdCBgICtcbiAgICAgICAgICAgICAgYGNvbmZpZ3VyYXRpb24gYmVjYXVzZSB0aGVyZSBpcyBhbHJlYWR5IGEgY3VzdG9tIHRoZW1lIGZpbGUgcmVmZXJlbmNlZC5gKTtcbiAgICAgICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIG1hbnVhbGx5IGFkZCB0aGUgZm9sbG93aW5nIHN0eWxlIGZpbGUgdG8geW91ciBjb25maWd1cmF0aW9uOmApO1xuICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAgJHthc3NldFBhdGh9YCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhwcmVidWlsdFRoZW1lUGF0aFNlZ21lbnQpKSB7XG4gICAgICAgICAgc3R5bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3R5bGVzLnVuc2hpZnQoYXNzZXRQYXRoKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBzcGVjaWZpZWQgcHJvamVjdCB0YXJnZXQgaXMgY29uZmlndXJlZCB3aXRoIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIHdoaWNoIGFyZVxuICogcHJvdmlkZWQgYnkgdGhlIEFuZ3VsYXIgQ0xJLiBJZiB0aGUgY29uZmlndXJlZCBidWlsZGVyIGRvZXMgbm90IG1hdGNoIHRoZSBkZWZhdWx0IGJ1aWxkZXIsXG4gKiB0aGlzIGZ1bmN0aW9uIGNhbiBlaXRoZXIgdGhyb3cgb3IganVzdCBzaG93IGEgd2FybmluZy5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbiwgdGFyZ2V0TmFtZTogJ2J1aWxkJyB8ICd0ZXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSkge1xuICBjb25zdCBkZWZhdWx0QnVpbGRlciA9IGRlZmF1bHRUYXJnZXRCdWlsZGVyc1t0YXJnZXROYW1lXTtcbiAgY29uc3QgdGFyZ2V0Q29uZmlnID0gcHJvamVjdC50YXJnZXRzICYmIHByb2plY3QudGFyZ2V0cy5nZXQodGFyZ2V0TmFtZSk7XG4gIGNvbnN0IGlzRGVmYXVsdEJ1aWxkZXIgPSB0YXJnZXRDb25maWcgJiYgdGFyZ2V0Q29uZmlnWydidWlsZGVyJ10gPT09IGRlZmF1bHRCdWlsZGVyO1xuXG4gIC8vIEJlY2F1c2UgdGhlIGJ1aWxkIHNldHVwIGZvciB0aGUgQW5ndWxhciBDTEkgY2FuIGJlIGN1c3RvbWl6ZWQgYnkgZGV2ZWxvcGVycywgd2UgY2FuJ3Qga25vd1xuICAvLyB3aGVyZSB0byBwdXQgdGhlIHRoZW1lIGZpbGUgaW4gdGhlIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGlmIGN1c3RvbSBidWlsZGVycyBhcmUgYmVpbmdcbiAgLy8gdXNlZC4gSW4gY2FzZSB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkIGZvciB0aGUgXCJidWlsZFwiIHRhcmdldCwgd2UgdGhyb3cgYW4gZXJyb3IgYW5kXG4gIC8vIGV4aXQgYmVjYXVzZSBzZXR0aW5nIHVwIGEgdGhlbWUgaXMgYSBwcmltYXJ5IGdvYWwgb2YgYG5nLWFkZGAuIE90aGVyd2lzZSBpZiBqdXN0IHRoZSBcInRlc3RcIlxuICAvLyBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQsIHdlIHdhcm4gYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHNcbiAgLy8gd2l0aCBNYXRlcmlhbC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNDE3NlxuICBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIgJiYgdGFyZ2V0TmFtZSA9PT0gJ2J1aWxkJykge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBgICtcbiAgICAgIGBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBjYW5ub3QgYWRkIGEgdGhlbWUgdG8gdGhlIHdvcmtzcGFjZSBgICtcbiAgICAgIGBjb25maWd1cmF0aW9uIGlmIHRoZSBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQuYCk7XG4gIH0gZWxzZSBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIpIHtcbiAgICAvLyBmb3Igbm9uLWJ1aWxkIHRhcmdldHMgd2UgZ3JhY2VmdWxseSByZXBvcnQgdGhlIGVycm9yIHdpdGhvdXQgYWN0dWFsbHkgYWJvcnRpbmcgdGhlXG4gICAgLy8gc2V0dXAgc2NoZW1hdGljLiBUaGlzIGlzIGJlY2F1c2UgYSB0aGVtZSBpcyBub3QgbWFuZGF0b3J5IGZvciBydW5uaW5nIHRlc3RzLlxuICAgIGxvZ2dlci53YXJuKGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhpcyBgICtcbiAgICAgIGBtZWFucyB0aGF0IHdlIGNhbm5vdCBhZGQgdGhlIGNvbmZpZ3VyZWQgdGhlbWUgdG8gdGhlIFwiJHt0YXJnZXROYW1lfVwiIHRhcmdldC5gKTtcbiAgfVxuXG4gIHJldHVybiBpc0RlZmF1bHRCdWlsZGVyO1xufVxuIl19