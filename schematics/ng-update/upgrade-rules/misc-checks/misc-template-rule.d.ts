/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-template-rule" />
import { MigrationRule, ResolvedResource } from '@angular/cdk/schematics';
/**
 * Rule that walks through every inline or external template and reports if there
 * are outdated usages of the Angular Material API that needs to be updated manually.
 */
export declare class MiscTemplateRule extends MigrationRule<null> {
    ruleEnabled: boolean;
    visitTemplate(template: ResolvedResource): void;
}
