"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const config_1 = require("@schematics/angular/utility/config");
const parse5 = require("parse5");
const ast_1 = require("../utils/ast");
const get_project_1 = require("../utils/get-project");
const package_json_1 = require("../utils/package-json");
const project_style_file_1 = require("../utils/project-style-file");
const material_fonts_1 = require("./fonts/material-fonts");
const hammerjs_import_1 = require("./gestures/hammerjs-import");
const theming_1 = require("./theming/theming");
const version_names_1 = require("./version-names");
/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add Packages to package.json
 *  - Adds pre-built themes to styles.ext
 *  - Adds Browser Animation to app.module
 */
function default_1(options) {
    if (!parse5) {
        throw new schematics_1.SchematicsException('Parse5 is required but could not be found! Please install ' +
            '"parse5" manually in order to continue.');
    }
    return schematics_1.chain([
        options && options.skipPackageJson ? schematics_1.noop() : addMaterialToPackageJson(options),
        options && options.gestures ? hammerjs_import_1.addHammerJsToMain(options) : schematics_1.noop(),
        theming_1.addThemeToAppStyles(options),
        addAnimationRootConfig(options),
        material_fonts_1.addFontsToIndex(options),
        addMaterialAppStyles(options),
    ]);
}
exports.default = default_1;
/** Add material, cdk, animations to package.json if not already present. */
function addMaterialToPackageJson(options) {
    return (host, context) => {
        // Version tag of the `@angular/core` dependency that has been loaded from the `package.json`
        // of the CLI project. This tag should be preferred because all Angular dependencies should
        // have the same version tag if possible.
        const ngCoreVersionTag = package_json_1.getPackageVersionFromPackageJson(host, '@angular/core');
        package_json_1.addPackageToPackageJson(host, '@angular/cdk', `^${version_names_1.materialVersion}`);
        package_json_1.addPackageToPackageJson(host, '@angular/material', `^${version_names_1.materialVersion}`);
        package_json_1.addPackageToPackageJson(host, '@angular/animations', ngCoreVersionTag || version_names_1.requiredAngularVersionRange);
        if (options.gestures) {
            package_json_1.addPackageToPackageJson(host, 'hammerjs', version_names_1.hammerjsVersion);
        }
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
/** Add browser animation module to the app module file. */
function addAnimationRootConfig(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = get_project_1.getProjectFromWorkspace(workspace, options.project);
        ast_1.addModuleImportToRootModule(host, 'BrowserAnimationsModule', '@angular/platform-browser/animations', project);
        return host;
    };
}
/**
 * Adds custom Material styles to the project style file. The custom CSS sets up the Roboto font
 * and reset the default browser body margin.
 */
function addMaterialAppStyles(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = get_project_1.getProjectFromWorkspace(workspace, options.project);
        const styleFilePath = project_style_file_1.getProjectStyleFile(project);
        const buffer = host.read(styleFilePath);
        if (!styleFilePath || !buffer) {
            return console.warn(`Could not find styles file: "${styleFilePath}". Skipping styles ` +
                `generation. Please consider manually adding the "Roboto" font and resetting the ` +
                `body margin.`);
        }
        const htmlContent = buffer.toString();
        const insertion = '\n' +
            `html, body { height: 100%; }\n` +
            `body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }\n`;
        if (htmlContent.includes(insertion)) {
            return;
        }
        const recorder = host.beginUpdate(styleFilePath);
        recorder.insertLeft(htmlContent.length, insertion);
        host.commitUpdate(recorder);
    };
}
//# sourceMappingURL=index.js.map