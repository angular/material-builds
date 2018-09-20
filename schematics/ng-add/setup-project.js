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
const schematics_2 = require("@angular/cdk/schematics");
const config_1 = require("@schematics/angular/utility/config");
const parse5 = require("parse5");
const material_fonts_1 = require("./fonts/material-fonts");
const hammerjs_import_1 = require("./gestures/hammerjs-import");
const theming_1 = require("./theming/theming");
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
        options && options.gestures ? hammerjs_import_1.addHammerJsToMain(options) : schematics_1.noop(),
        theming_1.addThemeToAppStyles(options),
        addAnimationRootConfig(options),
        material_fonts_1.addFontsToIndex(options),
        addMaterialAppStyles(options),
    ]);
}
exports.default = default_1;
/** Add browser animation module to the app module file. */
function addAnimationRootConfig(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        schematics_2.addModuleImportToRootModule(host, 'BrowserAnimationsModule', '@angular/platform-browser/animations', project);
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
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        const styleFilePath = schematics_2.getProjectStyleFile(project);
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
//# sourceMappingURL=setup-project.js.map