/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, BaseHarnessFilters } from '@angular/cdk/testing';
/**
 * A set of criteria that can be used to filter a list of `MatAutocompleteOptionHarness` instances
 */
export interface OptionHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
}
/**
 * A set of criteria that can be used to filter a list of `MatAutocompleteOptionGroupHarness`
 * instances.
 */
export interface OptionGroupHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose label text matches the given value. */
    labelText?: string | RegExp;
}
/** Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests. */
export declare class MatAutocompleteOptionHarness extends ComponentHarness {
    /** The selector for the host element of an autocomplete `MatOption` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: OptionHarnessFilters): HarnessPredicate<MatAutocompleteOptionHarness>;
    /** Clicks the option. */
    select(): Promise<void>;
    /** Gets the option's label text. */
    getText(): Promise<string>;
}
/** Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests. */
export declare class MatAutocompleteOptionGroupHarness extends ComponentHarness {
    private _label;
    /** The selector for the host element of an autocomplete `MatOptionGroup` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteOptionGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which option group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: OptionGroupHarnessFilters): HarnessPredicate<MatAutocompleteOptionGroupHarness>;
    /** Gets the option group's label text. */
    getLabelText(): Promise<string>;
}
