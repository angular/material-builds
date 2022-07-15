/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Migration } from '@angular/cdk/schematics';
import * as ts from 'typescript';
export declare class LegacyComponentsMigration extends Migration<null> {
    enabled: boolean;
    visitNode(node: ts.Node): void;
    /** Handles updating the named bindings of awaited @angular/material import expressions. */
    private _handleDestructuredAsyncImport;
    /** Handles updating the module specifier of @angular/material imports. */
    private _handleImportDeclaration;
    /** Handles updating the module specifier of @angular/material import expressions. */
    private _handleImportExpression;
    /** Handles updating the named bindings of @angular/material imports. */
    private _handleNamedImportBindings;
    /**
     * Returns true if the given node is a variable declaration assigns
     * the awaited result of an import expression using an object binding.
     */
    private _isDestructuredAsyncImport;
    /** Gets whether the specified node is an import expression. */
    private _isImportCallExpression;
    /** Updates the source file of the given node with the given replacements. */
    private _replaceAt;
}
