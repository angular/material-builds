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
const angular_1 = require("../../html/angular");
const input_names_1 = require("../../material/data/input-names");
const transform_change_data_1 = require("../../material/transform-change-data");
const component_walker_1 = require("../../tslint/component-walker");
const rule_failures_1 = require("../../tslint/rule-failures");
/**
 * Rule that walks through every inline or external HTML template and switches changed input
 * bindings to the proper new name.
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
        this.data = transform_change_data_1.getChangesForTarget(this.getOptions()[0], input_names_1.inputNames);
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
     * Searches for outdated input bindings in the specified content and creates
     * replacements with the according messages that can be added to a rule failure.
     */
    _createReplacementsForContent(node, templateContent) {
        const replacements = [];
        this.data.forEach(name => {
            const whitelist = name.whitelist;
            const relativeOffsets = [];
            const failureMessage = `Found deprecated @Input() "${chalk_1.red(name.replace)}"` +
                ` which has been renamed to "${chalk_1.green(name.replaceWith)}"`;
            if (whitelist.attributes) {
                relativeOffsets.push(...angular_1.findInputsOnElementWithAttr(templateContent, name.replace, whitelist.attributes));
            }
            if (whitelist.elements) {
                relativeOffsets.push(...angular_1.findInputsOnElementWithTag(templateContent, name.replace, whitelist.elements));
            }
            relativeOffsets
                .map(offset => node.getStart() + offset)
                .map(start => new tslint_1.Replacement(start, name.replace.length, name.replaceWith))
                .forEach(replacement => replacements.push({ replacement, failureMessage }));
        });
        return replacements;
    }
}
exports.Walker = Walker;
//# sourceMappingURL=inputNamesTemplateRule.js.map