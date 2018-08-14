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
/** Looks for the index HTML file in the given project and returns its path. */
function getIndexHtmlPath(project) {
    const buildTarget = project.architect.build.options;
    if (buildTarget.index && buildTarget.index.endsWith('index.html')) {
        return buildTarget.index;
    }
    throw new schematics_1.SchematicsException('No index.html file was found.');
}
exports.getIndexHtmlPath = getIndexHtmlPath;
//# sourceMappingURL=project-index-html.js.map