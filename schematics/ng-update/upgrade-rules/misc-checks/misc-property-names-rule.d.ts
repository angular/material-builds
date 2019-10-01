/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-property-names-rule" />
import { MigrationRule } from '@angular/cdk/schematics';
import * as ts from 'typescript';
/**
 * Rule that walks through every property access expression and and reports a failure if
 * a given property name no longer exists but cannot be automatically migrated.
 */
export declare class MiscPropertyNamesRule extends MigrationRule<null> {
    ruleEnabled: boolean;
    visitNode(node: ts.Node): void;
    private _visitPropertyAccessExpression;
}
