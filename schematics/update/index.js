"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = require("./update");
/** Possible versions that can be automatically migrated by `ng update`. */
var TargetVersion;
(function (TargetVersion) {
    TargetVersion[TargetVersion["V6"] = 0] = "V6";
    TargetVersion[TargetVersion["V7"] = 1] = "V7";
})(TargetVersion = exports.TargetVersion || (exports.TargetVersion = {}));
/** Entry point for the migration schematics with target of Angular Material 6.0.0 */
function updateToV6() {
    return update_1.createUpdateRule(TargetVersion.V6);
}
exports.updateToV6 = updateToV6;
/** Entry point for the migration schematics with target of Angular Material 7.0.0 */
function updateToV7() {
    return update_1.createUpdateRule(TargetVersion.V7);
}
exports.updateToV7 = updateToV7;
/** Post-update schematic to be called when update is finished. */
function postUpdate() {
    return () => console.log('\nComplete! Please check the output above for any issues that were detected but could not' +
        ' be automatically fixed.');
}
exports.postUpdate = postUpdate;
//# sourceMappingURL=index.js.map