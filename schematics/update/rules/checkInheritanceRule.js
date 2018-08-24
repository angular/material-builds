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
const ts = require("typescript");
const property_names_1 = require("../material/data/property-names");
/**
 * Map of classes that have been updated. Each class name maps to the according property change
 * data.
 */
const changedClassesMap = new Map();
property_names_1.propertyNames.filter(data => data.whitelist && data.whitelist.classes).forEach(data => {
    data.whitelist.classes.forEach(name => changedClassesMap.set(name, data));
});
/**
 * Rule that identifies class declarations that extend CDK or Material classes and had
 * a public property change.
 */
class Rule extends tslint_1.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}
exports.Rule = Rule;
class Walker extends tslint_1.ProgramAwareRuleWalker {
    visitClassDeclaration(node) {
        const baseTypes = this._determineBaseTypes(node);
        if (!baseTypes) {
            return;
        }
        baseTypes.forEach(typeName => {
            const data = changedClassesMap.get(typeName);
            if (data) {
                this.addFailureAtNode(node, `Found class "${chalk_1.bold(node.name.text)}" which extends class ` +
                    `"${chalk_1.bold(typeName)}". Please note that the base class property ` +
                    `"${chalk_1.red(data.replace)}" has changed to "${chalk_1.green(data.replaceWith)}". ` +
                    `You may need to update your class as well`);
            }
        });
    }
    _determineBaseTypes(node) {
        if (!node.heritageClauses) {
            return null;
        }
        return node.heritageClauses
            .reduce((types, clause) => types.concat(clause.types), [])
            .map(typeExpression => typeExpression.expression)
            .filter(expression => expression && ts.isIdentifier(expression))
            .map(identifier => identifier.text);
    }
}
exports.Walker = Walker;
//# sourceMappingURL=checkInheritanceRule.js.map