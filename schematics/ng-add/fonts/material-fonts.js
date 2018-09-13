"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@schematics/angular/utility/config");
const get_project_1 = require("../../utils/get-project");
const head_element_1 = require("./head-element");
/** Adds the Material Design fonts to the index HTML file. */
function addFontsToIndex(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = get_project_1.getProjectFromWorkspace(workspace, options.project);
        const fonts = [
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
        ];
        fonts.forEach(f => head_element_1.appendElementToHead(host, project, `<link href="${f}" rel="stylesheet">`));
        return host;
    };
}
exports.addFontsToIndex = addFontsToIndex;
//# sourceMappingURL=material-fonts.js.map