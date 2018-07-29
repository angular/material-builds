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
const attribute_selectors_1 = require("../material/data/attribute-selectors");
const literal_1 = require("../typescript/literal");
/**
 * Rule that walks through every string literal, which includes the outdated Material name and
 * is part of a call expression. Those string literals will be changed to the new name.
 */
class Rule extends tslint_1.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new SwitchStringLiteralAttributeSelectorsWalker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
class SwitchStringLiteralAttributeSelectorsWalker extends tslint_1.RuleWalker {
    visitStringLiteral(stringLiteral) {
        if (stringLiteral.parent && stringLiteral.parent.kind !== ts.SyntaxKind.CallExpression) {
            return;
        }
        let stringLiteralText = stringLiteral.getFullText();
        attribute_selectors_1.attributeSelectors.forEach(selector => {
            this.createReplacementsForOffsets(stringLiteral, selector, literal_1.findAll(stringLiteralText, selector.replace)).forEach(replacement => {
                this.addFailureAtNode(stringLiteral, `Found deprecated attribute selector "${chalk_1.red('[' + selector.replace + ']')}" which has` +
                    ` been renamed to "${chalk_1.green('[' + selector.replaceWith + ']')}"`, replacement);
            });
        });
    }
    createReplacementsForOffsets(node, update, offsets) {
        return offsets.map(offset => this.createReplacement(node.getStart() + offset, update.replace.length, update.replaceWith));
    }
}
exports.SwitchStringLiteralAttributeSelectorsWalker = SwitchStringLiteralAttributeSelectorsWalker;
//# sourceMappingURL=switchStringLiteralAttributeSelectorsRule.js.map