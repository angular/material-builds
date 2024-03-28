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
        const themeName = options.theme || 'azure-blue';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQW9FO0FBQ3BFLDJEQU9vQztBQUNwQyx3REFRaUM7QUFDakMsK0RBQWdFO0FBQ2hFLHFFQUFvRjtBQUNwRiwrQkFBMEI7QUFFMUIsK0RBQXdEO0FBRXhELDhFQUE4RTtBQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0FBRXJFLG1FQUFtRTtBQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0FBRXZELDJEQUEyRDtBQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO0lBQ2pELE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDO1FBQ2hELE9BQU8sU0FBUyxLQUFLLFFBQVE7WUFDM0IsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDMUQsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsa0RBT0M7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZTtJQUNoRCxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMs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TUFBTSxDQUFDLElBQUksQ0FDVCx1REFBdUQsVUFBVSxVQUFVO1lBQ3pFLHlEQUF5RCxVQUFVLFdBQVcsQ0FDakYsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtub3JtYWxpemUsIGxvZ2dpbmcsIHdvcmtzcGFjZXN9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIGNoYWluLFxuICBub29wLFxuICBSdWxlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxuICBUcmVlLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRCb2R5Q2xhc3MsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyxcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG4gIGdldFByb2plY3RUZXN0VGFyZ2V0cyxcbiAgZ2V0UHJvamVjdEJ1aWxkVGFyZ2V0cyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2UsIHVwZGF0ZVdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZSc7XG5pbXBvcnQge2pvaW59IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4uL3NjaGVtYSc7XG5pbXBvcnQge2NyZWF0ZUN1c3RvbVRoZW1lfSBmcm9tICcuL2NyZWF0ZS1jdXN0b20tdGhlbWUnO1xuXG4vKiogUGF0aCBzZWdtZW50IHRoYXQgY2FuIGJlIGZvdW5kIGluIHBhdGhzIHRoYXQgcmVmZXIgdG8gYSBwcmVidWlsdCB0aGVtZS4gKi9cbmNvbnN0IHByZWJ1aWx0VGhlbWVQYXRoU2VnbWVudCA9ICdAYW5ndWxhci9tYXRlcmlhbC9wcmVidWlsdC10aGVtZXMnO1xuXG4vKiogRGVmYXVsdCBmaWxlIG5hbWUgb2YgdGhlIGN1c3RvbSB0aGVtZSB0aGF0IGNhbiBiZSBnZW5lcmF0ZWQuICovXG5jb25zdCBkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSA9ICdjdXN0b20tdGhlbWUuc2Nzcyc7XG5cbi8qKiBBZGQgcHJlLWJ1aWx0IHN0eWxlcyB0byB0aGUgbWFpbiBwcm9qZWN0IHN0eWxlIGZpbGUuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgdGhlbWVOYW1lID0gb3B0aW9ucy50aGVtZSB8fCAnYXp1cmUtYmx1ZSc7XG4gICAgcmV0dXJuIHRoZW1lTmFtZSA9PT0gJ2N1c3RvbSdcbiAgICAgID8gaW5zZXJ0Q3VzdG9tVGhlbWUob3B0aW9ucy5wcm9qZWN0LCBob3N0LCBjb250ZXh0LmxvZ2dlcilcbiAgICAgIDogaW5zZXJ0UHJlYnVpbHRUaGVtZShvcHRpb25zLnByb2plY3QsIHRoZW1lTmFtZSwgY29udGV4dC5sb2dnZXIpO1xuICB9O1xufVxuXG4vKiogQWRkcyB0aGUgZ2xvYmFsIHR5cG9ncmFwaHkgY2xhc3MgdG8gdGhlIGJvZHkgZWxlbWVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUeXBvZ3JhcGh5Q2xhc3Mob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHByb2plY3RJbmRleEZpbGVzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG5cbiAgICBpZiAoIXByb2plY3RJbmRleEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ05vIHByb2plY3QgaW5kZXggSFRNTCBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnR5cG9ncmFwaHkpIHtcbiAgICAgIHByb2plY3RJbmRleEZpbGVzLmZvckVhY2gocGF0aCA9PiBhZGRCb2R5Q2xhc3MoaG9zdCwgcGF0aCwgJ21hdC10eXBvZ3JhcGh5JykpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBjdXN0b20gdGhlbWUgdG8gcHJvamVjdCBzdHlsZSBmaWxlLiBJZiBubyB2YWxpZCBzdHlsZSBmaWxlIGNvdWxkIGJlIGZvdW5kLCBhIG5ld1xuICogU2NzcyBmaWxlIGZvciB0aGUgY3VzdG9tIHRoZW1lIHdpbGwgYmUgY3JlYXRlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0Q3VzdG9tVGhlbWUoXG4gIHByb2plY3ROYW1lOiBzdHJpbmcsXG4gIGhvc3Q6IFRyZWUsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pOiBQcm9taXNlPFJ1bGU+IHtcbiAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBwcm9qZWN0TmFtZSk7XG4gIGNvbnN0IHN0eWxlc1BhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QsICdzY3NzJyk7XG4gIGNvbnN0IHRoZW1lQ29udGVudCA9IGNyZWF0ZUN1c3RvbVRoZW1lKHByb2plY3ROYW1lKTtcblxuICBpZiAoIXN0eWxlc1BhdGgpIHtcbiAgICBpZiAoIXByb2plY3Quc291cmNlUm9vdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgIGBDb3VsZCBub3QgZmluZCBzb3VyY2Ugcm9vdCBmb3IgcHJvamVjdDogXCIke3Byb2plY3ROYW1lfVwiLiBgICtcbiAgICAgICAgICBgUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBcInNvdXJjZVJvb3RcIiBwcm9wZXJ0eSBpcyBzZXQgaW4gdGhlIHdvcmtzcGFjZSBjb25maWcuYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoIHRocm91Z2ggdGhlIGRldmtpdCB1dGlsaXRpZXMgYmVjYXVzZSB3ZSB3YW50IHRvIGF2b2lkIGhhdmluZ1xuICAgIC8vIHVubmVjZXNzYXJ5IHBhdGggc2VnbWVudHMgYW5kIHdpbmRvd3MgYmFja3NsYXNoIGRlbGltaXRlcnMuXG4gICAgY29uc3QgY3VzdG9tVGhlbWVQYXRoID0gbm9ybWFsaXplKGpvaW4ocHJvamVjdC5zb3VyY2VSb290LCBkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpO1xuXG4gICAgaWYgKGhvc3QuZXhpc3RzKGN1c3RvbVRoZW1lUGF0aCkpIHtcbiAgICAgIGxvZ2dlci53YXJuKGBDYW5ub3QgY3JlYXRlIGEgY3VzdG9tIEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWUgYmVjYXVzZVxuICAgICAgICAgICR7Y3VzdG9tVGhlbWVQYXRofSBhbHJlYWR5IGV4aXN0cy4gU2tpcHBpbmcgY3VzdG9tIHRoZW1lIGdlbmVyYXRpb24uYCk7XG4gICAgICByZXR1cm4gbm9vcCgpO1xuICAgIH1cblxuICAgIGhvc3QuY3JlYXRlKGN1c3RvbVRoZW1lUGF0aCwgdGhlbWVDb250ZW50KTtcbiAgICByZXR1cm4gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3ROYW1lLCAnYnVpbGQnLCBjdXN0b21UaGVtZVBhdGgsIGxvZ2dlcik7XG4gIH1cblxuICBjb25zdCBpbnNlcnRpb24gPSBuZXcgSW5zZXJ0Q2hhbmdlKHN0eWxlc1BhdGgsIDAsIHRoZW1lQ29udGVudCk7XG4gIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZXNQYXRoKTtcblxuICByZWNvcmRlci5pbnNlcnRMZWZ0KGluc2VydGlvbi5wb3MsIGluc2VydGlvbi50b0FkZCk7XG4gIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgcmV0dXJuIG5vb3AoKTtcbn1cblxuLyoqIEluc2VydCBhIHByZS1idWlsdCB0aGVtZSBpbnRvIHRoZSBhbmd1bGFyLmpzb24gZmlsZS4gKi9cbmZ1bmN0aW9uIGluc2VydFByZWJ1aWx0VGhlbWUocHJvamVjdDogc3RyaW5nLCB0aGVtZTogc3RyaW5nLCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyQXBpKTogUnVsZSB7XG4gIGNvbnN0IHRoZW1lUGF0aCA9IGBAYW5ndWxhci9tYXRlcmlhbC9wcmVidWlsdC10aGVtZXMvJHt0aGVtZX0uY3NzYDtcblxuICByZXR1cm4gY2hhaW4oW1xuICAgIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAnYnVpbGQnLCB0aGVtZVBhdGgsIGxvZ2dlciksXG4gICAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICd0ZXN0JywgdGhlbWVQYXRoLCBsb2dnZXIpLFxuICBdKTtcbn1cblxuLyoqIEFkZHMgYSB0aGVtaW5nIHN0eWxlIGVudHJ5IHRvIHRoZSBnaXZlbiBwcm9qZWN0IHRhcmdldCBvcHRpb25zLiAqL1xuZnVuY3Rpb24gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KFxuICBwcm9qZWN0TmFtZTogc3RyaW5nLFxuICB0YXJnZXROYW1lOiAndGVzdCcgfCAnYnVpbGQnLFxuICBhc3NldFBhdGg6IHN0cmluZyxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbik6IFJ1bGUge1xuICByZXR1cm4gdXBkYXRlV29ya3NwYWNlKHdvcmtzcGFjZSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgcHJvamVjdE5hbWUpO1xuXG4gICAgLy8gRG8gbm90IHVwZGF0ZSB0aGUgYnVpbGRlciBvcHRpb25zIGluIGNhc2UgdGhlIHRhcmdldCBkb2VzIG5vdCB1c2UgdGhlIGRlZmF1bHQgQ0xJIGJ1aWxkZXIuXG4gICAgaWYgKCF2YWxpZGF0ZURlZmF1bHRUYXJnZXRCdWlsZGVyKHByb2plY3QsIHRhcmdldE5hbWUsIGxvZ2dlcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRPcHRpb25zID0gZ2V0UHJvamVjdFRhcmdldE9wdGlvbnMocHJvamVjdCwgdGFyZ2V0TmFtZSk7XG4gICAgY29uc3Qgc3R5bGVzID0gdGFyZ2V0T3B0aW9uc1snc3R5bGVzJ10gYXMgKHN0cmluZyB8IHtpbnB1dDogc3RyaW5nfSlbXTtcblxuICAgIGlmICghc3R5bGVzKSB7XG4gICAgICB0YXJnZXRPcHRpb25zWydzdHlsZXMnXSA9IFthc3NldFBhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGlzdGluZ1N0eWxlcyA9IHN0eWxlcy5tYXAocyA9PiAodHlwZW9mIHMgPT09ICdzdHJpbmcnID8gcyA6IHMuaW5wdXQpKTtcblxuICAgICAgZm9yIChsZXQgW2luZGV4LCBzdHlsZVBhdGhdIG9mIGV4aXN0aW5nU3R5bGVzLmVudHJpZXMoKSkge1xuICAgICAgICAvLyBJZiB0aGUgZ2l2ZW4gYXNzZXQgaXMgYWxyZWFkeSBzcGVjaWZpZWQgaW4gdGhlIHN0eWxlcywgd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZy5cbiAgICAgICAgaWYgKHN0eWxlUGF0aCA9PT0gYXNzZXRQYXRoKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gY2FzZSBhIHByZWJ1aWx0IHRoZW1lIGlzIGFscmVhZHkgc2V0IHVwLCB3ZSBjYW4gc2FmZWx5IHJlcGxhY2UgdGhlIHRoZW1lIHdpdGggdGhlIG5ld1xuICAgICAgICAvLyB0aGVtZSBmaWxlLiBJZiBhIGN1c3RvbSB0aGVtZSBpcyBzZXQgdXAsIHdlIGFyZSBub3QgYWJsZSB0byBzYWZlbHkgcmVwbGFjZSB0aGUgY3VzdG9tXG4gICAgICAgIC8vIHRoZW1lIGJlY2F1c2UgdGhlc2UgZmlsZXMgY2FuIGNvbnRhaW4gY3VzdG9tIHN0eWxlcywgd2hpbGUgcHJlYnVpbHQgdGhlbWVzIGFyZVxuICAgICAgICAvLyBhbHdheXMgcGFja2FnZWQgYW5kIGNvbnNpZGVyZWQgcmVwbGFjZWFibGUuXG4gICAgICAgIGlmIChzdHlsZVBhdGguaW5jbHVkZXMoZGVmYXVsdEN1c3RvbVRoZW1lRmlsZW5hbWUpKSB7XG4gICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgYENvdWxkIG5vdCBhZGQgdGhlIHNlbGVjdGVkIHRoZW1lIHRvIHRoZSBDTEkgcHJvamVjdCBgICtcbiAgICAgICAgICAgICAgYGNvbmZpZ3VyYXRpb24gYmVjYXVzZSB0aGVyZSBpcyBhbHJlYWR5IGEgY3VzdG9tIHRoZW1lIGZpbGUgcmVmZXJlbmNlZC5gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBhZGQgdGhlIGZvbGxvd2luZyBzdHlsZSBmaWxlIHRvIHlvdXIgY29uZmlndXJhdGlvbjpgKTtcbiAgICAgICAgICBsb2dnZXIuaW5mbyhgICAgICR7YXNzZXRQYXRofWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZVBhdGguaW5jbHVkZXMocHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50KSkge1xuICAgICAgICAgIHN0eWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0eWxlcy51bnNoaWZ0KGFzc2V0UGF0aCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgc3BlY2lmaWVkIHByb2plY3QgdGFyZ2V0IGlzIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZGVmYXVsdCBidWlsZGVycyB3aGljaCBhcmVcbiAqIHByb3ZpZGVkIGJ5IHRoZSBBbmd1bGFyIENMSS4gSWYgdGhlIGNvbmZpZ3VyZWQgYnVpbGRlciBkb2VzIG5vdCBtYXRjaCB0aGUgZGVmYXVsdCBidWlsZGVyLFxuICogdGhpcyBmdW5jdGlvbiBjYW4gZWl0aGVyIHRocm93IG9yIGp1c3Qgc2hvdyBhIHdhcm5pbmcuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRGVmYXVsdFRhcmdldEJ1aWxkZXIoXG4gIHByb2plY3Q6IHdvcmtzcGFjZXMuUHJvamVjdERlZmluaXRpb24sXG4gIHRhcmdldE5hbWU6ICdidWlsZCcgfCAndGVzdCcsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pIHtcbiAgY29uc3QgdGFyZ2V0cyA9XG4gICAgdGFyZ2V0TmFtZSA9PT0gJ3Rlc3QnID8gZ2V0UHJvamVjdFRlc3RUYXJnZXRzKHByb2plY3QpIDogZ2V0UHJvamVjdEJ1aWxkVGFyZ2V0cyhwcm9qZWN0KTtcbiAgY29uc3QgaXNEZWZhdWx0QnVpbGRlciA9IHRhcmdldHMubGVuZ3RoID4gMDtcblxuICAvLyBCZWNhdXNlIHRoZSBidWlsZCBzZXR1cCBmb3IgdGhlIEFuZ3VsYXIgQ0xJIGNhbiBiZSBjdXN0b21pemVkIGJ5IGRldmVsb3BlcnMsIHdlIGNhbid0IGtub3dcbiAgLy8gd2hlcmUgdG8gcHV0IHRoZSB0aGVtZSBmaWxlIGluIHRoZSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBpZiBjdXN0b20gYnVpbGRlcnMgYXJlIGJlaW5nXG4gIC8vIHVzZWQuIEluIGNhc2UgdGhlIGJ1aWxkZXIgaGFzIGJlZW4gY2hhbmdlZCBmb3IgdGhlIFwiYnVpbGRcIiB0YXJnZXQsIHdlIHRocm93IGFuIGVycm9yIGFuZFxuICAvLyBleGl0IGJlY2F1c2Ugc2V0dGluZyB1cCBhIHRoZW1lIGlzIGEgcHJpbWFyeSBnb2FsIG9mIGBuZy1hZGRgLiBPdGhlcndpc2UgaWYganVzdCB0aGUgXCJ0ZXN0XCJcbiAgLy8gYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLCB3ZSB3YXJuIGJlY2F1c2UgYSB0aGVtZSBpcyBub3QgbWFuZGF0b3J5IGZvciBydW5uaW5nIHRlc3RzXG4gIC8vIHdpdGggTWF0ZXJpYWwuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTQxNzZcbiAgaWYgKCFpc0RlZmF1bHRCdWlsZGVyICYmIHRhcmdldE5hbWUgPT09ICdidWlsZCcpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgIGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBgICtcbiAgICAgICAgYFwiJHt0YXJnZXROYW1lfVwiLiBUaGUgQW5ndWxhciBNYXRlcmlhbCBzY2hlbWF0aWNzIGNhbm5vdCBhZGQgYSB0aGVtZSB0byB0aGUgd29ya3NwYWNlIGAgK1xuICAgICAgICBgY29uZmlndXJhdGlvbiBpZiB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLmAsXG4gICAgKTtcbiAgfSBlbHNlIGlmICghaXNEZWZhdWx0QnVpbGRlcikge1xuICAgIC8vIGZvciBub24tYnVpbGQgdGFyZ2V0cyB3ZSBncmFjZWZ1bGx5IHJlcG9ydCB0aGUgZXJyb3Igd2l0aG91dCBhY3R1YWxseSBhYm9ydGluZyB0aGVcbiAgICAvLyBzZXR1cCBzY2hlbWF0aWMuIFRoaXMgaXMgYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHMuXG4gICAgbG9nZ2VyLndhcm4oXG4gICAgICBgWW91ciBwcm9qZWN0IGlzIG5vdCB1c2luZyB0aGUgZGVmYXVsdCBidWlsZGVycyBmb3IgXCIke3RhcmdldE5hbWV9XCIuIFRoaXMgYCArXG4gICAgICAgIGBtZWFucyB0aGF0IHdlIGNhbm5vdCBhZGQgdGhlIGNvbmZpZ3VyZWQgdGhlbWUgdG8gdGhlIFwiJHt0YXJnZXROYW1lfVwiIHRhcmdldC5gLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gaXNEZWZhdWx0QnVpbGRlcjtcbn1cbiJdfQ==