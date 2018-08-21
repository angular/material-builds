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
const css_names_1 = require("../../material/data/css-names");
const component_walker_1 = require("../../tslint/component-walker");
const rule_failures_1 = require("../../tslint/rule-failures");
const literal_1 = require("../../typescript/literal");
/**
 * Rule that walks through every inline or external HTML template and updates outdated
 * CSS classes.
 */
class Rule extends tslint_1.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
class Walker extends component_walker_1.ComponentWalker {
    visitInlineTemplate(template) {
        this._createReplacementsForContent(template, template.getText())
            .forEach(data => rule_failures_1.addFailureAtReplacement(this, data.failureMessage, data.replacement));
    }
    visitExternalTemplate(template) {
        this._createReplacementsForContent(template, template.getFullText())
            .map(data => rule_failures_1.createExternalReplacementFailure(template, data.failureMessage, this.getRuleName(), data.replacement))
            .forEach(failure => this.addFailure(failure));
    }
    /**
     * Searches for outdated css names in the specified content and creates replacements
     * with the according messages that can be added to a rule failure.
     */
    _createReplacementsForContent(node, templateContent) {
        const replacements = [];
        css_names_1.cssNames.forEach(selector => {
            if (selector.whitelist && !selector.whitelist.html) {
                return;
            }
            const failureMessage = `Found deprecated CSS class "${chalk_1.red(selector.replace)}"` +
                ` which has been renamed to "${chalk_1.green(selector.replaceWith)}"`;
            literal_1.findAllSubstringIndices(templateContent, selector.replace)
                .map(offset => node.getStart() + offset)
                .map(start => new tslint_1.Replacement(start, selector.replace.length, selector.replaceWith))
                .forEach(replacement => replacements.push({ replacement, failureMessage }));
        });
        return replacements;
    }
}
exports.Walker = Walker;
//# sourceMappingURL=cssNamesTemplateRule.js.map