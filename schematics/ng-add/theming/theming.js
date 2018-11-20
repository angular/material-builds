"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const change_1 = require("@schematics/angular/utility/change");
const config_1 = require("@schematics/angular/utility/config");
const path_1 = require("path");
const custom_theme_1 = require("./custom-theme");
const chalk_1 = require("chalk");
/** Path segment that can be found in paths that refer to a prebuilt theme. */
const prebuiltThemePathSegment = '@angular/material/prebuilt-themes';
/** Default file name of the custom theme that can be generated. */
const defaultCustomThemeFilename = 'custom-theme.scss';
/** Add pre-built styles to the main project style file. */
function addThemeToAppStyles(options) {
    return function (host) {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        const themeName = options.theme || 'indigo-pink';
        // Because the build setup for the Angular CLI can be changed so dramatically, we can't know
        // where to generate anything if the project is not using the default config for build and test.
        assertDefaultBuildersConfigured(project);
        if (themeName === 'custom') {
            insertCustomTheme(project, options.project, host, workspace);
        }
        else {
            insertPrebuiltTheme(project, host, themeName, workspace);
        }
        return host;
    };
}
exports.addThemeToAppStyles = addThemeToAppStyles;
/**
 * Insert a custom theme to project style file. If no valid style file could be found, a new
 * Scss file for the custom theme will be created.
 */
function insertCustomTheme(project, projectName, host, workspace) {
    const stylesPath = schematics_2.getProjectStyleFile(project, 'scss');
    const themeContent = custom_theme_1.createCustomTheme(projectName);
    if (!stylesPath) {
        if (!project.sourceRoot) {
            throw new Error(`Could not find source root for project: "${projectName}". Please make ` +
                `sure that the "sourceRoot" property is set in the workspace config.`);
        }
        // Normalize the path through the devkit utilities because we want to avoid having
        // unnecessary path segments and windows backslash delimiters.
        const customThemePath = core_1.normalize(path_1.join(project.sourceRoot, defaultCustomThemeFilename));
        if (host.exists(customThemePath)) {
            console.warn(chalk_1.yellow(`Cannot create a custom Angular Material theme because
          ${chalk_1.bold(customThemePath)} already exists. Skipping custom theme generation.`));
            return;
        }
        host.create(customThemePath, themeContent);
        addThemeStyleToTarget(project, 'build', host, customThemePath, workspace);
        return;
    }
    const insertion = new change_1.InsertChange(stylesPath, 0, themeContent);
    const recorder = host.beginUpdate(stylesPath);
    recorder.insertLeft(insertion.pos, insertion.toAdd);
    host.commitUpdate(recorder);
}
/** Insert a pre-built theme into the angular.json file. */
function insertPrebuiltTheme(project, host, theme, workspace) {
    // Path needs to be always relative to the `package.json` or workspace root.
    const themePath = `./node_modules/@angular/material/prebuilt-themes/${theme}.css`;
    addThemeStyleToTarget(project, 'build', host, themePath, workspace);
    addThemeStyleToTarget(project, 'test', host, themePath, workspace);
}
/** Adds a theming style entry to the given project target options. */
function addThemeStyleToTarget(project, targetName, host, assetPath, workspace) {
    const targetOptions = schematics_2.getProjectTargetOptions(project, targetName);
    if (!targetOptions.styles) {
        targetOptions.styles = [assetPath];
    }
    else {
        const existingStyles = targetOptions.styles.map(s => typeof s === 'string' ? s : s.input);
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
                console.warn(chalk_1.red(`Could not add the selected theme to the CLI project configuration ` +
                    `because there is already a custom theme file referenced.`));
                console.warn(chalk_1.red(`Please manually add the following style file to your configuration:`));
                console.warn(chalk_1.yellow(`    ${chalk_1.bold(assetPath)}`));
                return;
            }
            else if (stylePath.includes(prebuiltThemePathSegment)) {
                targetOptions.styles.splice(index, 1);
            }
        }
        targetOptions.styles.unshift(assetPath);
    }
    host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
/** Throws if the project is not using the default Angular devkit builders. */
function assertDefaultBuildersConfigured(project) {
    checkProjectTargetBuilder(project, 'build', '@angular-devkit/build-angular:browser');
    checkProjectTargetBuilder(project, 'test', '@angular-devkit/build-angular:karma');
}
/**
 * Checks if the specified project target is configured with the default builders which are
 * provided by the Angular CLI.
 */
function checkProjectTargetBuilder(project, targetName, defaultBuilder) {
    const targetConfig = project.architect && project.architect[targetName] ||
        project.targets && project.targets[targetName];
    if (!targetConfig || targetConfig['builder'] !== defaultBuilder) {
        throw new schematics_1.SchematicsException(`Your project is not using the default builders for "${targetName}". The Angular Material ` +
            'schematics can only be used if the original builders from the Angular CLI are configured.');
    }
}
//# sourceMappingURL=theming.js.map