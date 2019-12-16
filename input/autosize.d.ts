/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
/**
 * Directive to automatically resize a textarea to fit its content.
 * @deprecated Use `cdkTextareaAutosize` from `@angular/cdk/text-field` instead.
 * @breaking-change 8.0.0
 */
export declare class MatTextareaAutosize extends CdkTextareaAutosize {
    matAutosizeMinRows: number;
    matAutosizeMaxRows: number;
    matAutosize: boolean;
    matTextareaAutosize: boolean;
    static ngAcceptInputType_minRows: NumberInput;
    static ngAcceptInputType_maxRows: NumberInput;
    static ngAcceptInputType_enabled: BooleanInput;
}
