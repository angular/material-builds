"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const target_version_1 = require("./target-version");
const update_1 = require("./update");
/** Entry point for the migration schematics with target of Angular Material 6.0.0 */
function updateToV6() {
    return update_1.createUpdateRule(target_version_1.TargetVersion.V6);
}
exports.updateToV6 = updateToV6;
/** Entry point for the migration schematics with target of Angular Material 7.0.0 */
function updateToV7() {
    return update_1.createUpdateRule(target_version_1.TargetVersion.V7);
}
exports.updateToV7 = updateToV7;
/** Post-update schematic to be called when update is finished. */
function postUpdate() {
    return () => console.log('\nComplete! Please check the output above for any issues that were detected but could not' +
        ' be automatically fixed.');
}
exports.postUpdate = postUpdate;
//# sourceMappingURL=index.js.map