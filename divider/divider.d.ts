/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
export declare class MatDivider {
    /** Whether the divider is vertically aligned. */
    vertical: boolean;
    private _vertical;
    /** Whether the divider is an inset divider. */
    inset: boolean;
    private _inset;
    static ngAcceptInputType_vertical: BooleanInput;
    static ngAcceptInputType_inset: BooleanInput;
}
