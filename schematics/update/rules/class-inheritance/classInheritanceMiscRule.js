"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const tslint_1 = require("tslint");
const base_types_1 = require("../../typescript/base-types");
/**
 * Rule that checks for classes that extend Angular Material or CDK classes which have
 * changed their API.
 */
class Rule extends tslint_1.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}
exports.Rule = Rule;
class Walker extends tslint_1.ProgramAwareRuleWalker {
    visitClassDeclaration(node) {
        const baseTypes = base_types_1.determineBaseTypes(node);
        if (!baseTypes) {
            return;
        }
        if (baseTypes.includes('MatFormFieldControl')) {
            const hasFloatLabelMember = node.members
                .find(member => member.name && member.name.getText() === 'shouldFloatLabel');
            if (!hasFloatLabelMember) {
                this.addFailureAtNode(node, `Found class "${chalk_1.bold(node.name.text)}" which extends ` +
                    `"${chalk_1.bold('MatFormFieldControl')}". This class must define ` +
                    `"${chalk_1.green('shouldLabelFloat')}" which is now a required property.`);
            }
        }
    }
}
exports.Walker = Walker;
//# sourceMappingURL=classInheritanceMiscRule.js.map