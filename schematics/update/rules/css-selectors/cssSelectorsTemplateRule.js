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
const css_selectors_1 = require("../../material/data/css-selectors");
const transform_change_data_1 = require("../../material/transform-change-data");
const component_walker_1 = require("../../tslint/component-walker");
const rule_failures_1 = require("../../tslint/rule-failures");
const literal_1 = require("../../typescript/literal");
/**
 * Rule that walks through every inline or external HTML template and updates outdated
 * CSS selectors.
 */
class Rule extends tslint_1.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
class Walker extends component_walker_1.ComponentWalker {
    constructor() {
        super(...arguments);
        /** Change data that upgrades to the specified target version. */
        this.data = transform_change_data_1.getChangesForTarget(this.getOptions()[0], css_selectors_1.cssSelectors);
    }
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
     * Searches for outdated css selectors in the specified content and creates replacements
     * with the according messages that can be added to a rule failure.
     */
    _createReplacementsForContent(node, templateContent) {
        const replacements = [];
        this.data.forEach(data => {
            if (data.whitelist && !data.whitelist.html) {
                return;
            }
            const failureMessage = `Found deprecated CSS selector "${chalk_1.red(data.replace)}"` +
                ` which has been renamed to "${chalk_1.green(data.replaceWith)}"`;
            literal_1.findAllSubstringIndices(templateContent, data.replace)
                .map(offset => node.getStart() + offset)
                .map(start => new tslint_1.Replacement(start, data.replace.length, data.replaceWith))
                .forEach(replacement => replacements.push({ replacement, failureMessage }));
        });
        return replacements;
    }
}
exports.Walker = Walker;
//# sourceMappingURL=cssSelectorsTemplateRule.js.map