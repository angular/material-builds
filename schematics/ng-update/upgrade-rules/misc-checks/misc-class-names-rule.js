"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Rule that looks for class name identifiers that have been removed but
 * cannot be automatically migrated.
 */
class MiscClassNamesRule extends schematics_1.MigrationRule {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isIdentifier(node)) {
            this._visitIdentifier(node);
        }
    }
    _visitIdentifier(identifier) {
        // Migration for: https://github.com/angular/components/pull/10279 (v6)
        if (identifier.getText() === 'MatDrawerToggleResult') {
            this.createFailureAtNode(identifier, `Found "MatDrawerToggleResult" which has changed from a class type to a string ` +
                `literal type. Your code may need to be updated.`);
        }
        // Migration for: https://github.com/angular/components/pull/10398 (v6)
        if (identifier.getText() === 'MatListOptionChange') {
            this.createFailureAtNode(identifier, `Found usage of "MatListOptionChange" which has been removed. Please listen for ` +
                `"selectionChange" on "MatSelectionList" instead.`);
        }
    }
}
exports.MiscClassNamesRule = MiscClassNamesRule;
//# sourceMappingURL=misc-class-names-rule.js.map