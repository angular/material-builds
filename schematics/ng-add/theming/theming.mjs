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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQW9FO0FBQ3BFLDJEQU9vQztBQUNwQyx3REFRaUM7QUFDakMsK0RBQWdFO0FBQ2hFLHFFQUFvRjtBQUNwRiwrQkFBMEI7QUFFMUIsK0RBQXdEO0FBRXhELDhFQUE4RTtBQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0FBRXJFLG1FQUFtRTtBQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0FBRXZELDJEQUEyRDtBQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO0lBQ2pELE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDO1FBQ2pELE9BQU8sU0FBUyxLQUFLLFFBQVE7WUFDM0IsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDMUQsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsa0RBT0M7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZTtJQUNoRCxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMs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QGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge25vcm1hbGl6ZSwgbG9nZ2luZywgd29ya3NwYWNlc30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgY2hhaW4sXG4gIG5vb3AsXG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZEJvZHlDbGFzcyxcbiAgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGdldFByb2plY3RUYXJnZXRPcHRpb25zLFxuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbiAgZ2V0UHJvamVjdFRlc3RUYXJnZXRzLFxuICBnZXRQcm9qZWN0QnVpbGRUYXJnZXRzLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZSwgdXBkYXRlV29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7Y3JlYXRlQ3VzdG9tVGhlbWV9IGZyb20gJy4vY3JlYXRlLWN1c3RvbS10aGVtZSc7XG5cbi8qKiBQYXRoIHNlZ21lbnQgdGhhdCBjYW4gYmUgZm91bmQgaW4gcGF0aHMgdGhhdCByZWZlciB0byBhIHByZWJ1aWx0IHRoZW1lLiAqL1xuY29uc3QgcHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50ID0gJ0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcyc7XG5cbi8qKiBEZWZhdWx0IGZpbGUgbmFtZSBvZiB0aGUgY3VzdG9tIHRoZW1lIHRoYXQgY2FuIGJlIGdlbmVyYXRlZC4gKi9cbmNvbnN0IGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lID0gJ2N1c3RvbS10aGVtZS5zY3NzJztcblxuLyoqIEFkZCBwcmUtYnVpbHQgc3R5bGVzIHRvIHRoZSBtYWluIHByb2plY3Qgc3R5bGUgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB0aGVtZU5hbWUgPSBvcHRpb25zLnRoZW1lIHx8ICdpbmRpZ28tcGluayc7XG4gICAgcmV0dXJuIHRoZW1lTmFtZSA9PT0gJ2N1c3RvbSdcbiAgICAgID8gaW5zZXJ0Q3VzdG9tVGhlbWUob3B0aW9ucy5wcm9qZWN0LCBob3N0LCBjb250ZXh0LmxvZ2dlcilcbiAgICAgIDogaW5zZXJ0UHJlYnVpbHRUaGVtZShvcHRpb25zLnByb2plY3QsIHRoZW1lTmFtZSwgY29udGV4dC5sb2dnZXIpO1xuICB9O1xufVxuXG4vKiogQWRkcyB0aGUgZ2xvYmFsIHR5cG9ncmFwaHkgY2xhc3MgdG8gdGhlIGJvZHkgZWxlbWVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUeXBvZ3JhcGh5Q2xhc3Mob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHByb2plY3RJbmRleEZpbGVzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG5cbiAgICBpZiAoIXByb2plY3RJbmRleEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ05vIHByb2plY3QgaW5kZXggSFRNTCBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnR5cG9ncmFwaHkpIHtcbiAgICAgIHByb2plY3RJbmRleEZpbGVzLmZvckVhY2gocGF0aCA9PiBhZGRCb2R5Q2xhc3MoaG9zdCwgcGF0aCwgJ21hdC10eXBvZ3JhcGh5JykpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBjdXN0b20gdGhlbWUgdG8gcHJvamVjdCBzdHlsZSBmaWxlLiBJZiBubyB2YWxpZCBzdHlsZSBmaWxlIGNvdWxkIGJlIGZvdW5kLCBhIG5ld1xuICogU2NzcyBmaWxlIGZvciB0aGUgY3VzdG9tIHRoZW1lIHdpbGwgYmUgY3JlYXRlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0Q3VzdG9tVGhlbWUoXG4gIHByb2plY3ROYW1lOiBzdHJpbmcsXG4gIGhvc3Q6IFRyZWUsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pOiBQcm9taXNlPFJ1bGU+IHtcbiAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBwcm9qZWN0TmFtZSk7XG4gIGNvbnN0IHN0eWxlc1BhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QsICdzY3NzJyk7XG4gIGNvbnN0IHRoZW1lQ29udGVudCA9IGNyZWF0ZUN1c3RvbVRoZW1lKHByb2plY3ROYW1lKTtcblxuICBpZiAoIXN0eWxlc1BhdGgpIHtcbiAgICBpZiAoIXByb2plY3Quc291cmNlUm9vdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgIGBDb3VsZCBub3QgZmluZCBzb3VyY2Ugcm9vdCBmb3IgcHJvamVjdDogXCIke3Byb2plY3ROYW1lfVwiLiBgICtcbiAgICAgICAgICBgUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBcInNvdXJjZVJvb3RcIiBwcm9wZXJ0eSBpcyBzZXQgaW4gdGhlIHdvcmtzcGFjZSBjb25maWcuYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoIHRocm91Z2ggdGhlIGRldmtpdCB1dGlsaXRpZXMgYmVjYXVzZSB3ZSB3YW50IHRvIGF2b2lkIGhhdmluZ1xuICAgIC8vIHVubmVjZXNzYXJ5IHBhdGggc2VnbWVudHMgYW5kIHdpbmRvd3MgYmFja3NsYXNoIGRlbGltaXRlcnMuXG4gICAgY29uc3QgY3VzdG9tVGhlbWVQYXRoID0gbm9ybWFsaXplKGpvaW4ocHJvamVjdC5zb3VyY2VSb290LCBkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpO1xuXG4gICAgaWYgKGhvc3QuZXhpc3RzKGN1c3RvbVRoZW1lUGF0aCkpIHtcbiAgICAgIGxvZ2dlci53YXJuKGBDYW5ub3QgY3JlYXRlIGEgY3VzdG9tIEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWUgYmVjYXVzZVxuICAgICAgICAgICR7Y3VzdG9tVGhlbWVQYXRofSBhbHJlYWR5IGV4aXN0cy4gU2tpcHBpbmcgY3VzdG9tIHRoZW1lIGdlbmVyYXRpb24uYCk7XG4gICAgICByZXR1cm4gbm9vcCgpO1xuICAgIH1cblxuICAgIGhvc3QuY3JlYXRlKGN1c3RvbVRoZW1lUGF0aCwgdGhlbWVDb250ZW50KTtcbiAgICByZXR1cm4gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3ROYW1lLCAnYnVpbGQnLCBjdXN0b21UaGVtZVBhdGgsIGxvZ2dlcik7XG4gIH1cblxuICBjb25zdCBpbnNlcnRpb24gPSBuZXcgSW5zZXJ0Q2hhbmdlKHN0eWxlc1BhdGgsIDAsIHRoZW1lQ29udGVudCk7XG4gIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZXNQYXRoKTtcblxuICByZWNvcmRlci5pbnNlcnRMZWZ0KGluc2VydGlvbi5wb3MsIGluc2VydGlvbi50b0FkZCk7XG4gIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgcmV0dXJuIG5vb3AoKTtcbn1cblxuLyoqIEluc2VydCBhIHByZS1idWlsdCB0aGVtZSBpbnRvIHRoZSBhbmd1bGFyLmpzb24gZmlsZS4gKi9cbmZ1bmN0aW9uIGluc2VydFByZWJ1aWx0VGhlbWUocHJvamVjdDogc3RyaW5nLCB0aGVtZTogc3RyaW5nLCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyQXBpKTogUnVsZSB7XG4gIGNvbnN0IHRoZW1lUGF0aCA9IGBAYW5ndWxhci9tYXRlcmlhbC9wcmVidWlsdC10aGVtZXMvJHt0aGVtZX0uY3NzYDtcblxuICByZXR1cm4gY2hhaW4oW1xuICAgIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAnYnVpbGQnLCB0aGVtZVBhdGgsIGxvZ2dlciksXG4gICAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICd0ZXN0JywgdGhlbWVQYXRoLCBsb2dnZXIpLFxuICBdKTtcbn1cblxuLyoqIEFkZHMgYSB0aGVtaW5nIHN0eWxlIGVudHJ5IHRvIHRoZSBnaXZlbiBwcm9qZWN0IHRhcmdldCBvcHRpb25zLiAqL1xuZnVuY3Rpb24gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KFxuICBwcm9qZWN0TmFtZTogc3RyaW5nLFxuICB0YXJnZXROYW1lOiAndGVzdCcgfCAnYnVpbGQnLFxuICBhc3NldFBhdGg6IHN0cmluZyxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbik6IFJ1bGUge1xuICByZXR1cm4gdXBkYXRlV29ya3NwYWNlKHdvcmtzcGFjZSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgcHJvamVjdE5hbWUpO1xuXG4gICAgLy8gRG8gbm90IHVwZGF0ZSB0aGUgYnVpbGRlciBvcHRpb25zIGluIGNhc2UgdGhlIHRhcmdldCBkb2VzIG5vdCB1c2UgdGhlIGRlZmF1bHQgQ0xJIGJ1aWxkZXIuXG4gICAgaWYgKCF2YWxpZGF0ZURlZmF1bHRUYXJnZXRCdWlsZGVyKHByb2plY3QsIHRhcmdldE5hbWUsIGxvZ2dlcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRPcHRpb25zID0gZ2V0UHJvamVjdFRhcmdldE9wdGlvbnMocHJvamVjdCwgdGFyZ2V0TmFtZSk7XG4gICAgY29uc3Qgc3R5bGVzID0gdGFyZ2V0T3B0aW9uc1snc3R5bGVzJ10gYXMgKHN0cmluZyB8IHtpbnB1dDogc3RyaW5nfSlbXTtcblxuICAgIGlmICghc3R5bGVzKSB7XG4gICAgICB0YXJnZXRPcHRpb25zWydzdHlsZXMnXSA9IFthc3NldFBhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGlzdGluZ1N0eWxlcyA9IHN0eWxlcy5tYXAocyA9PiAodHlwZW9mIHMgPT09ICdzdHJpbmcnID8gcyA6IHMuaW5wdXQpKTtcblxuICAgICAgZm9yIChsZXQgW2luZGV4LCBzdHlsZVBhdGhdIG9mIGV4aXN0aW5nU3R5bGVzLmVudHJpZXMoKSkge1xuICAgICAgICAvLyBJZiB0aGUgZ2l2ZW4gYXNzZXQgaXMgYWxyZWFkeSBzcGVjaWZpZWQgaW4gdGhlIHN0eWxlcywgd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZy5cbiAgICAgICAgaWYgKHN0eWxlUGF0aCA9PT0gYXNzZXRQYXRoKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gY2FzZSBhIHByZWJ1aWx0IHRoZW1lIGlzIGFscmVhZHkgc2V0IHVwLCB3ZSBjYW4gc2FmZWx5IHJlcGxhY2UgdGhlIHRoZW1lIHdpdGggdGhlIG5ld1xuICAgICAgICAvLyB0aGVtZSBmaWxlLiBJZiBhIGN1c3RvbSB0aGVtZSBpcyBzZXQgdXAsIHdlIGFyZSBub3QgYWJsZSB0byBzYWZlbHkgcmVwbGFjZSB0aGUgY3VzdG9tXG4gICAgICAgIC8vIHRoZW1lIGJlY2F1c2UgdGhlc2UgZmlsZXMgY2FuIGNvbnRhaW4gY3VzdG9tIHN0eWxlcywgd2hpbGUgcHJlYnVpbHQgdGhlbWVzIGFyZVxuICAgICAgICAvLyBhbHdheXMgcGFja2FnZWQgYW5kIGNvbnNpZGVyZWQgcmVwbGFjZWFibGUuXG4gICAgICAgIGlmIChzdHlsZVBhdGguaW5jbHVkZXMoZGVmYXVsdEN1c3RvbVRoZW1lRmlsZW5hbWUpKSB7XG4gICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgYENvdWxkIG5vdCBhZGQgdGhlIHNlbGVjdGVkIHRoZW1lIHRvIHRoZSBDTEkgcHJvamVjdCBgICtcbiAgICAgICAgICAgICAgYGNvbmZpZ3VyYXRpb24gYmVjYXVzZSB0aGVyZSBpcyBhbHJlYWR5IGEgY3VzdG9tIHRoZW1lIGZpbGUgcmVmZXJlbmNlZC5gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBhZGQgdGhlIGZvbGxvd2luZyBzdHlsZSBmaWxlIHRvIHlvdXIgY29uZmlndXJhdGlvbjpgKTtcbiAgICAgICAgICBsb2dnZXIuaW5mbyhgICAgICR7YXNzZXRQYXRofWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZVBhdGguaW5jbHVkZXMocHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50KSkge1xuICAgICAgICAgIHN0eWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0eWxlcy51bnNoaWZ0KGFzc2V0UGF0aCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgc3BlY2lmaWVkIHByb2plY3QgdGFyZ2V0IGlzIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZGVmYXVsdCBidWlsZGVycyB3aGljaCBhcmVcbiAqIHByb3ZpZGVkIGJ5IHRoZSBBbmd1bGFyIENMSS4gSWYgdGhlIGNvbmZpZ3VyZWQgYnVpbGRlciBkb2VzIG5vdCBtYXRjaCB0aGUgZGVmYXVsdCBidWlsZGVyLFxuICogdGhpcyBmdW5jdGlvbiBjYW4gZWl0aGVyIHRocm93IG9yIGp1c3Qgc2hvdyBhIHdhcm5pbmcuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRGVmYXVsdFRhcmdldEJ1aWxkZXIoXG4gIHByb2plY3Q6IHdvcmtzcGFjZXMuUHJvamVjdERlZmluaXRpb24sXG4gIHRhcmdldE5hbWU6ICdidWlsZCcgfCAndGVzdCcsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pIHtcbiAgY29uc3QgdGFyZ2V0cyA9XG4gICAgdGFyZ2V0TmFtZSA9PT0gJ3Rlc3QnID8gZ2V0UHJvamVjdFRlc3RUYXJnZXRzKHByb2plY3QpIDogZ2V0UHJvamVjdEJ1aWxkVGFyZ2V0cyhwcm9qZWN0KTtcbiAgY29uc3QgaXNEZWZhdWx0QnVpbGRlciA9IHRhcmdldHMubGVuZ3RoID4gMDtcblxuICAvLyBCZWNhdXNlIHRoZSBidWlsZCBzZXR1cCBmb3IgdGhlIEFuZ3VsYXIgQ0xJIGNhbiBiZSBjdXN0b21pemVkIGJ5IGRldmVsb3BlcnMsIHdlIGNhbid0IGtub3dcbiAgLy8gd2hlcmUgdG8gcHV0IHRoZSB0aGVtZSBmaWxlIGluIHRoZSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBpZiBjdXN0b20gYnVpbGRlcnMgYXJlIGJlaW5nXG4gIC8vIHVzZWQuIEluIGNhc2UgdGhlIGJ1aWxkZXIgaGFzIGJlZW4gY2hhbmdlZCBmb3IgdGhlIFwiYnVpbGRcIiB0YXJnZXQsIHdlIHRocm93IGFuIGVycm9yIGFuZFxuICAvLyBleGl0IGJlY2F1c2Ugc2V0dGluZyB1cCBhIHRoZW1lIGlzIGEgcHJpbWFyeSBnb2FsIG9mIGBuZy1hZGRgLiBPdGhlcndpc2UgaWYganVzdCB0aGUgXCJ0ZXN0XCJcbiAgLy8gYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLCB3ZSB3YXJuIGJlY2F1c2UgYSB0aGVtZSBpcyBub3QgbWFuZGF0b3J5IGZvciBydW5uaW5nIHRlc3RzXG4gIC8vIHdpdGggTWF0ZXJpYWwuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTQxNzZcbiAgaWYgKCFpc0RlZmF1bHRCdWlsZGVyICYmIHRhcmdldE5hbWUgPT09ICdidWlsZCcpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgIGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBgICtcbiAgICAgICAgYFwiJHt0YXJnZXROYW1lfVwiLiBUaGUgQW5ndWxhciBNYXRlcmlhbCBzY2hlbWF0aWNzIGNhbm5vdCBhZGQgYSB0aGVtZSB0byB0aGUgd29ya3NwYWNlIGAgK1xuICAgICAgICBgY29uZmlndXJhdGlvbiBpZiB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLmAsXG4gICAgKTtcbiAgfSBlbHNlIGlmICghaXNEZWZhdWx0QnVpbGRlcikge1xuICAgIC8vIGZvciBub24tYnVpbGQgdGFyZ2V0cyB3ZSBncmFjZWZ1bGx5IHJlcG9ydCB0aGUgZXJyb3Igd2l0aG91dCBhY3R1YWxseSBhYm9ydGluZyB0aGVcbiAgICAvLyBzZXR1cCBzY2hlbWF0aWMuIFRoaXMgaXMgYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHMuXG4gICAgbG9nZ2VyLndhcm4oXG4gICAgICBgWW91ciBwcm9qZWN0IGlzIG5vdCB1c2luZyB0aGUgZGVmYXVsdCBidWlsZGVycyBmb3IgXCIke3RhcmdldE5hbWV9XCIuIFRoaXMgYCArXG4gICAgICAgIGBtZWFucyB0aGF0IHdlIGNhbm5vdCBhZGQgdGhlIGNvbmZpZ3VyZWQgdGhlbWUgdG8gdGhlIFwiJHt0YXJnZXROYW1lfVwiIHRhcmdldC5gLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gaXNEZWZhdWx0QnVpbGRlcjtcbn1cbiJdfQ==