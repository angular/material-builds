/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SlideToggleHarnessFilters } from './slide-toggle-harness-filters';
/**
 * Harness for interacting with a standard mat-slide-toggle in tests.
 * @dynamic
 */
export declare class MatSlideToggleHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a slide-toggle w/ specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a slide-toggle whose host element matches the given selector.
     *   - `label` finds a slide-toggle with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SlideToggleHarnessFilters): HarnessPredicate<MatSlideToggleHarness>;
    private _label;
    private _input;
    private _inputContainer;
    /** Gets a boolean promise indicating if the slide-toggle is checked. */
    isChecked(): Promise<boolean>;
    /** Gets a boolean promise indicating if the slide-toggle is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a boolean promise indicating if the slide-toggle is required. */
    isRequired(): Promise<boolean>;
    /** Gets a boolean promise indicating if the slide-toggle is valid. */
    isValid(): Promise<boolean>;
    /** Gets a promise for the slide-toggle's name. */
    getName(): Promise<string | null>;
    /** Gets a promise for the slide-toggle's aria-label. */
    getAriaLabel(): Promise<string | null>;
    /** Gets a promise for the slide-toggle's aria-labelledby. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets a promise for the slide-toggle's label text. */
    getLabelText(): Promise<string>;
    /** Focuses the slide-toggle and returns a void promise that indicates action completion. */
    focus(): Promise<void>;
    /** Blurs the slide-toggle and returns a void promise that indicates action completion. */
    blur(): Promise<void>;
    /**
     * Toggle the checked state of the slide-toggle and returns a void promise that indicates when the
     * action is complete.
     *
     * Note: This toggles the slide-toggle as a user would, by clicking it.
     */
    toggle(): Promise<void>;
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked. Returns a void promise that indicates when the action is
     * complete.
     *
     * Note: This attempts to check the slide-toggle as a user would, by clicking it.
     */
    check(): Promise<void>;
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked. Returns a void promise that indicates when the action is
     * complete.
     *
     * Note: This toggles the slide-toggle as a user would, by clicking it.
     */
    uncheck(): Promise<void>;
}
