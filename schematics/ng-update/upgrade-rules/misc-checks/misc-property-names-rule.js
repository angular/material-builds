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
 * Rule that walks through every property access expression and and reports a failure if
 * a given property name no longer exists but cannot be automatically migrated.
 */
class MiscPropertyNamesRule extends schematics_1.MigrationRule {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isPropertyAccessExpression(node)) {
            this._visitPropertyAccessExpression(node);
        }
    }
    _visitPropertyAccessExpression(node) {
        const hostType = this.typeChecker.getTypeAtLocation(node.expression);
        const typeName = hostType && hostType.symbol && hostType.symbol.getName();
        // Migration for: https://github.com/angular/components/pull/10398 (v6)
        if (typeName === 'MatListOption' && node.name.text === 'selectionChange') {
            this.createFailureAtNode(node, `Found deprecated property "selectionChange" of ` +
                `class "MatListOption". Use the "selectionChange" property on the ` +
                `parent "MatSelectionList" instead.`);
        }
        // Migration for: https://github.com/angular/components/pull/10413 (v6)
        if (typeName === 'MatDatepicker' && node.name.text === 'selectedChanged') {
            this.createFailureAtNode(node, `Found deprecated property "selectedChanged" of ` +
                `class "MatDatepicker". Use the "dateChange" or "dateInput" methods ` +
                `on "MatDatepickerInput" instead.`);
        }
    }
}
exports.MiscPropertyNamesRule = MiscPropertyNamesRule;
//# sourceMappingURL=misc-property-names-rule.js.map