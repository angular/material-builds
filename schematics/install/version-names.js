"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Name of the Material version that is shipped together with the schematics. */
exports.materialVersion = loadPackageVersionGracefully('@angular/cdk') ||
    loadPackageVersionGracefully('@angular/material');
/** Angular version that is needed for the Material version that comes with the schematics. */
exports.requiredAngularVersion = '>=6.0.0-beta.0 <7.0.0';
/** Loads the full version from the given Angular package gracefully. */
function loadPackageVersionGracefully(packageName) {
    try {
        return require(packageName).VERSION.full;
    }
    catch (_a) {
        return null;
    }
}
//# sourceMappingURL=version-names.js.map