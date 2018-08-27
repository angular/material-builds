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
const angular_1 = require("../html/angular");
const component_walker_1 = require("../tslint/component-walker");
const literal_1 = require("../typescript/literal");
/**
 * Rule that walks through every inline or external template and reports if there are outdated
 * usages of the Angular Material API that need to be updated manually.
 */
class Rule extends tslint_1.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
class Walker extends component_walker_1.ComponentWalker {
    visitInlineTemplate(template) {
        this._createFailuresForContent(template, template.getText())
            .forEach(data => this.addFailureFromStartToEnd(data.start, data.end, data.message));
    }
    visitExternalTemplate(template) {
        this._createFailuresForContent(template, template.getFullText()).forEach(data => {
            this.addFailure(new tslint_1.RuleFailure(template, data.start, data.end, data.message, this.getRuleName()));
        });
    }
    _createFailuresForContent(node, content) {
        const failures = [];
        literal_1.findAllSubstringIndices(content, 'cdk-focus-trap').forEach(offset => {
            failures.push({
                start: node.getStart() + offset,
                end: node.getStart() + offset + 'cdk-focus-trap'.length,
                message: `Found deprecated element selector "${chalk_1.red('cdk-focus-trap')}" which has been ` +
                    `changed to an attribute selector "${chalk_1.green('[cdkTrapFocus]')}".`
            });
        });
        angular_1.findOutputsOnElementWithTag(content, 'selectionChange', ['mat-list-option']).forEach(offset => {
            failures.push({
                start: node.getStart() + offset,
                end: node.getStart() + offset + 'selectionChange'.length,
                message: `Found deprecated @Output() "${chalk_1.red('selectionChange')}" on ` +
                    `"${chalk_1.bold('mat-list-option')}". Use "${chalk_1.green('selectionChange')}" on ` +
                    `"${chalk_1.bold('mat-selection-list')}" instead.`
            });
        });
        angular_1.findOutputsOnElementWithTag(content, 'selectedChanged', ['mat-datepicker']).forEach(offset => {
            failures.push({
                start: node.getStart() + offset,
                end: node.getStart() + offset + 'selectionChange'.length,
                message: `Found deprecated @Output() "${chalk_1.red('selectedChanged')}" on ` +
                    `"${chalk_1.bold('mat-datepicker')}". Use "${chalk_1.green('dateChange')}" or ` +
                    `"${chalk_1.green('dateInput')}" on "${chalk_1.bold('<input [matDatepicker]>')}" instead.`
            });
        });
        angular_1.findInputsOnElementWithTag(content, 'selected', ['mat-button-toggle-group']).forEach(offset => {
            failures.push({
                start: node.getStart() + offset,
                end: node.getStart() + offset + 'selected'.length,
                message: `Found deprecated @Input() "${chalk_1.red('selected')}" on ` +
                    `"${chalk_1.bold('mat-radio-button-group')}". Use "${chalk_1.green('value')}" instead.`
            });
        });
        return failures;
    }
}
exports.Walker = Walker;
//# sourceMappingURL=checkTemplateMiscRule.js.map