/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-names-rule" />
import { MigrationRule } from '@angular/cdk/schematics';
import * as ts from 'typescript';
/**
 * Rule that looks for class name identifiers that have been removed but
 * cannot be automatically migrated.
 */
export declare class MiscClassNamesRule extends MigrationRule<null> {
    ruleEnabled: boolean;
    visitNode(node: ts.Node): void;
    private _visitIdentifier;
}
