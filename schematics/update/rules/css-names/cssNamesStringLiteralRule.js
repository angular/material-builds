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
const css_names_1 = require("../../material/data/css-names");
const literal_1 = require("../../typescript/literal");
/**
 * Rule that walks through every string literal that is wrapped inside of a call expression.
 * All string literals which include an outdated CSS class name will be migrated.
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
        css_names_1.cssNames.forEach(name => {
            if (name.whitelist && !name.whitelist.strings) {
                return;
            }
            literal_1.findAllSubstringIndices(textContent, name.replace)
                .map(offset => node.getStart() + offset)
                .map(start => new tslint_1.Replacement(start, name.replace.length, name.replaceWith))
                .forEach(replacement => this._addFailureWithReplacement(node, replacement, name));
        });
    }
    /** Adds a css name failure with the given replacement at the specified node. */
    _addFailureWithReplacement(node, replacement, name) {
        this.addFailureAtNode(node, `Found deprecated CSS class "${chalk_1.red(name.replace)}" which has ` +
            `been renamed to "${chalk_1.green(name.replaceWith)}"`, replacement);
    }
}
exports.Walker = Walker;
//# sourceMappingURL=cssNamesStringLiteralRule.js.map