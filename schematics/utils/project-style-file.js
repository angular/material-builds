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
/** Looks for the primary style file for a given project and returns its path. */
function getProjectStyleFile(project) {
    const buildTarget = project.architect['build'];
    if (buildTarget.options && buildTarget.options.styles && buildTarget.options.styles.length) {
        const styles = buildTarget.options.styles.map(s => typeof s === 'string' ? s : s.input);
        // First, see if any of the assets is called "styles.(le|sc|c)ss", which is the default
        // "main" style sheet.
        const defaultMainStylePath = styles.find(a => /styles\.(c|le|sc)ss/.test(a));
        if (defaultMainStylePath) {
            return core_1.normalize(defaultMainStylePath);
        }
        // If there was no obvious default file, use the first style asset.
        const fallbackStylePath = styles.find(a => /\.(c|le|sc)ss/.test(a));
        if (fallbackStylePath) {
            return core_1.normalize(fallbackStylePath);
        }
    }
    throw new schematics_1.SchematicsException('No style files could be found into which a theme could be added.');
}
exports.getProjectStyleFile = getProjectStyleFile;
//# sourceMappingURL=project-style-file.js.map