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
const element_selectors_1 = require("../../material/data/element-selectors");
const literal_1 = require("../../typescript/literal");
/**
 * Rule that walks through every string literal that is wrapped inside of a call expression.
 * All string literals which include an outdated element selector will be migrated.
 */
class Rule extends tslint_1.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
class Walker extends tslint_1.RuleWalker {
    visitStringLiteral(node) {
        if (node.parent && node.parent.kind !== ts.SyntaxKind.CallExpression) {
            return;
        }
        const textContent = node.getFullText();
        element_selectors_1.elementSelectors.forEach(selector => {
            literal_1.findAllSubstringIndices(textContent, selector.replace)
                .map(offset => node.getStart() + offset)
                .map(start => new tslint_1.Replacement(start, selector.replace.length, selector.replaceWith))
                .forEach(replacement => this._addFailureWithReplacement(node, replacement, name));
        });
    }
    /** Adds an element selector failure with the given replacement at the specified node. */
    _addFailureWithReplacement(node, replacement, name) {
        this.addFailureAtNode(node, `Found deprecated element selector "${chalk_1.red(name.replace)}" which ` +
            `has been renamed to "${chalk_1.green(name.replaceWith)}"`, replacement);
    }
}
exports.Walker = Walker;
//# sourceMappingURL=elementSelectorsStringLiteralRule.js.map