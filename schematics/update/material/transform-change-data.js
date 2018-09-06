"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const index_1 = require("../index");
/**
 * Gets the changes for a given target version from the specified version changes object.
 *
 * For readability and a good overview of breaking changes, the version change data always
 * includes the related Pull Request link. Since this data is not needed when performing the
 * upgrade, this unused data can be removed and the changes data can be flattened into an
 * easy iterable array.
 */
function getChangesForTarget(target, data) {
    if (!data) {
        throw new Error(`No data could be found for target version: ${index_1.TargetVersion[target]}`);
    }
    if (!data[target]) {
        return [];
    }
    return data[target].reduce((result, prData) => result.concat(prData.changes), []);
}
exports.getChangesForTarget = getChangesForTarget;
//# sourceMappingURL=transform-change-data.js.map