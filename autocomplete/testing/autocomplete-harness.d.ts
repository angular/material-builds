/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { AutocompleteHarnessFilters } from './autocomplete-harness-filters';
import { MatAutocompleteOptionHarness, MatAutocompleteOptionGroupHarness } from './option-harness';
/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @dynamic
 */
export declare class MatAutocompleteHarness extends ComponentHarness {
    private _documentRootLocator;
    private _panel;
    private _optionalPanel;
    private _options;
    private _groups;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: AutocompleteHarnessFilters): HarnessPredicate<MatAutocompleteHarness>;
    getAttribute(attributeName: string): Promise<string | null>;
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a promise for the autocomplete's text. */
    getText(): Promise<string>;
    /** Focuses the input and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the input and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    /** Enters text into the autocomplete. */
    enterText(value: string): Promise<void>;
    /** Gets the autocomplete panel. */
    getPanel(): Promise<TestElement>;
    /** Gets the options inside the autocomplete panel. */
    getOptions(): Promise<MatAutocompleteOptionHarness[]>;
    /** Gets the groups of options inside the panel. */
    getOptionGroups(): Promise<MatAutocompleteOptionGroupHarness[]>;
    /** Gets whether the autocomplete panel is visible. */
    isPanelVisible(): Promise<boolean>;
    /** Gets whether the autocomplete is open. */
    isOpen(): Promise<boolean>;
}
