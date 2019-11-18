/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ButtonHarnessFilters } from './button-harness-filters';
/** Harness for interacting with a standard mat-button in tests. */
export declare class MatButtonHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a button with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a button whose host element matches the given selector.
     *   - `text` finds a button with specific text content.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ButtonHarnessFilters): HarnessPredicate<MatButtonHarness>;
    /** Clicks the button. */
    click(): Promise<void>;
    /** Gets a boolean promise indicating if the button is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a promise for the button's label text. */
    getText(): Promise<string>;
    /** Focuses the button and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the button and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
}
