/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { AutocompleteHarnessFilters } from './autocomplete-harness-filters';
import { MatAutocompleteOptionGroupHarness, MatAutocompleteOptionHarness, OptionGroupHarnessFilters, OptionHarnessFilters } from './option-harness';
/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @dynamic
 */
export declare class MatAutocompleteHarness extends ComponentHarness {
    private _documentRootLocator;
    private _optionalPanel;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: AutocompleteHarnessFilters): HarnessPredicate<MatAutocompleteHarness>;
    /** Gets the value of the autocomplete input. */
    getValue(): Promise<string>;
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Focuses the input and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the input and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    /** Enters text into the autocomplete. */
    enterText(value: string): Promise<void>;
    /** Gets the options inside the autocomplete panel. */
    getOptions(filters?: OptionHarnessFilters): Promise<MatAutocompleteOptionHarness[]>;
    /** Gets the groups of options inside the panel. */
    getOptionGroups(filters?: OptionGroupHarnessFilters): Promise<MatAutocompleteOptionGroupHarness[]>;
    /** Selects the first option matching the given filters. */
    selectOption(filters: OptionHarnessFilters): Promise<void>;
    /** Gets whether the autocomplete is open. */
    isOpen(): Promise<boolean>;
}
