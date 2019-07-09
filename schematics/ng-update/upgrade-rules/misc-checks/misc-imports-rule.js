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
 * Rule that detects import declarations that refer to outdated identifiers from
 * Angular Material which cannot be updated automatically.
 */
class MiscImportsRule extends schematics_1.MigrationRule {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isImportDeclaration(node)) {
            this._visitImportDeclaration(node);
        }
    }
    _visitImportDeclaration(node) {
        if (!schematics_1.isMaterialImportDeclaration(node) || !node.importClause ||
            !node.importClause.namedBindings) {
            return;
        }
        const namedBindings = node.importClause.namedBindings;
        if (ts.isNamedImports(namedBindings)) {
            // Migration for: https://github.com/angular/components/pull/10405 (v6)
            this._checkAnimationConstants(namedBindings);
        }
    }
    /**
     * Checks for named imports that refer to the deleted animation constants.
     * https://github.com/angular/components/commit/9f3bf274c4f15f0b0fbd8ab7dbf1a453076e66d9
     */
    _checkAnimationConstants(namedImports) {
        namedImports.elements.filter(element => ts.isIdentifier(element.name)).forEach(element => {
            const importName = element.name.text;
            if (importName === 'SHOW_ANIMATION' || importName === 'HIDE_ANIMATION') {
                this.createFailureAtNode(element, `Found deprecated symbol "${importName}" which has been removed`);
            }
        });
    }
}
exports.MiscImportsRule = MiscImportsRule;
//# sourceMappingURL=misc-imports-rule.js.map