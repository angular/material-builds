import { BaseHarnessFilters } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatAutocompleteHarnessBase } from '@angular/material/autocomplete/testing';
import { MatLegacyOptgroupHarness } from '@angular/material/legacy-core/testing';
import { MatLegacyOptionHarness } from '@angular/material/legacy-core/testing';
import { OptgroupHarnessFilters } from '@angular/material/legacy-core/testing';
import { OptionHarnessFilters } from '@angular/material/legacy-core/testing';

/** A set of criteria that can be used to filter a list of `MatAutocompleteHarness` instances. */
export declare interface LegacyAutocompleteHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose associated input element matches the given value. */
    value?: string | RegExp;
}

/** Harness for interacting with a standard mat-autocomplete in tests. */
export declare class MatLegacyAutocompleteHarness extends _MatAutocompleteHarnessBase<typeof MatLegacyOptionHarness, MatLegacyOptionHarness, OptionHarnessFilters, typeof MatLegacyOptgroupHarness, MatLegacyOptgroupHarness, OptgroupHarnessFilters> {
    protected _prefix: string;
    protected _optionClass: typeof MatLegacyOptionHarness;
    protected _optionGroupClass: typeof MatLegacyOptgroupHarness;
    /** The selector for the host element of a `MatAutocomplete` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: LegacyAutocompleteHarnessFilters): HarnessPredicate<MatLegacyAutocompleteHarness>;
}

export { }
