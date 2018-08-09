"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslint_1 = require("tslint");
/**
 * Creates a standalone rule failure that can be used to apply a replacement for an
 * external resource from the custom ComponentWalker.
 */
function createExternalReplacementFailure(node, failureMessage, ruleName, replacement) {
    return new tslint_1.RuleFailure(node, replacement.start, replacement.end, failureMessage, ruleName, replacement);
}
exports.createExternalReplacementFailure = createExternalReplacementFailure;
/** Adds a failure to the given walker at the location of the specified replacement. */
function addFailureAtReplacement(walker, failureMessage, replacement) {
    walker.addFailureAt(replacement.start, replacement.end, failureMessage, replacement);
}
exports.addFailureAtReplacement = addFailureAtReplacement;
//# sourceMappingURL=rule-failures.js.map