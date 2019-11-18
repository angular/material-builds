/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, BaseHarnessFilters } from '@angular/cdk/testing';
export interface OptionHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
}
export interface OptionGroupHarnessFilters extends BaseHarnessFilters {
    labelText?: string | RegExp;
}
/** Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests. */
export declare class MatAutocompleteOptionHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: OptionHarnessFilters): HarnessPredicate<MatAutocompleteOptionHarness>;
    /** Clicks the option. */
    select(): Promise<void>;
    /** Gets a promise for the option's label text. */
    getText(): Promise<string>;
}
/** Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests. */
export declare class MatAutocompleteOptionGroupHarness extends ComponentHarness {
    private _label;
    static hostSelector: string;
    static with(options?: OptionGroupHarnessFilters): HarnessPredicate<MatAutocompleteOptionGroupHarness>;
    /** Gets a promise for the option group's label text. */
    getLabelText(): Promise<string>;
}
