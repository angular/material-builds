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
const change_1 = require("@schematics/angular/utility/change");
const config_1 = require("@schematics/angular/utility/config");
const path_1 = require("path");
const get_project_1 = require("../../utils/get-project");
const project_style_file_1 = require("../../utils/project-style-file");
const project_targets_1 = require("../../utils/project-targets");
const custom_theme_1 = require("./custom-theme");
/** Add pre-built styles to the main project style file. */
function addThemeToAppStyles(options) {
    return function (host) {
        const workspace = config_1.getWorkspace(host);
        const project = get_project_1.getProjectFromWorkspace(workspace, options.project);
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
    const stylesPath = project_style_file_1.getProjectStyleFile(project, 'scss');
    const themeContent = custom_theme_1.createCustomTheme(projectName);
    if (!stylesPath) {
        if (!project.sourceRoot) {
            throw new Error(`Could not find source root for project: "${projectName}". Please make ` +
                `sure that the "sourceRoot" property is set in the workspace config.`);
        }
        // Normalize the path through the devkit utilities because we want to avoid having
        // unnecessary path segments and windows backslash delimiters.
        const customThemePath = core_1.normalize(path_1.join(project.sourceRoot, 'custom-theme.scss'));
        host.create(customThemePath, themeContent);
        return addStyleToTarget(project, 'build', host, customThemePath, workspace);
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
    addStyleToTarget(project, 'build', host, themePath, workspace);
    addStyleToTarget(project, 'test', host, themePath, workspace);
}
/** Adds a style entry to the given project target. */
function addStyleToTarget(project, targetName, host, assetPath, workspace) {
    const targetOptions = project_targets_1.getProjectTargetOptions(project, targetName);
    if (!targetOptions.styles) {
        targetOptions.styles = [assetPath];
    }
    else {
        const existingStyles = targetOptions.styles.map(s => typeof s === 'string' ? s : s.input);
        const hasGivenTheme = existingStyles.find(s => s.includes(assetPath));
        const hasOtherTheme = existingStyles.find(s => s.includes('material/prebuilt'));
        if (!hasGivenTheme && !hasOtherTheme) {
            targetOptions.styles.unshift(assetPath);
        }
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