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
 * Rule that checks for classes that extend Angular Material classes which
 * have changed their API.
 */
class MiscClassInheritanceRule extends schematics_1.MigrationRule {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isClassDeclaration(node)) {
            this._visitClassDeclaration(node);
        }
    }
    _visitClassDeclaration(node) {
        const baseTypes = schematics_1.determineBaseTypes(node);
        const className = node.name ? node.name.text : '{unknown-name}';
        if (!baseTypes) {
            return;
        }
        // Migration for: https://github.com/angular/components/pull/10293 (v6)
        if (baseTypes.includes('MatFormFieldControl')) {
            const hasFloatLabelMember = node.members.filter(member => member.name)
                .find(member => member.name.getText() === 'shouldLabelFloat');
            if (!hasFloatLabelMember) {
                this.createFailureAtNode(node, `Found class "${className}" which extends ` +
                    `"${'MatFormFieldControl'}". This class must define ` +
                    `"${'shouldLabelFloat'}" which is now a required property.`);
            }
        }
    }
}
exports.MiscClassInheritanceRule = MiscClassInheritanceRule;
//# sourceMappingURL=misc-class-inheritance-rule.js.map