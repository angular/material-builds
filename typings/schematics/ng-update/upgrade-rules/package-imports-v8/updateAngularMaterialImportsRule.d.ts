/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as Lint from 'tslint';
import * as ts from 'typescript';
/**
 * A TSLint rule correcting symbols imports to using Angular Material
 * subpackages (e.g. @angular/material/button) rather than the top level
 * package (e.g. @angular/material).
 */
export declare class Rule extends Lint.Rules.TypedRule {
    static metadata: Lint.IRuleMetadata;
    static ONLY_SUBPACKAGE_FAILURE_STR: string;
    static NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR: string;
    static SYMBOL_NOT_FOUND_FAILURE_STR: string;
    static SYMBOL_FILE_NOT_FOUND_FAILURE_STR: string;
    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[];
}
