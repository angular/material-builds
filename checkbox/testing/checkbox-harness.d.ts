/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { CheckboxHarnessFilters } from './checkbox-harness-filters';
/**
 * Harness for interacting with a standard mat-checkbox in tests.
 * @dynamic
 */
export declare class MatCheckboxHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a checkbox with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a checkbox whose host element matches the given selector.
     *   - `label` finds a checkbox with specific label text.
     *   - `name` finds a checkbox with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CheckboxHarnessFilters): HarnessPredicate<MatCheckboxHarness>;
    private _label;
    private _input;
    private _inputContainer;
    /** Gets a boolean promise indicating if the checkbox is checked. */
    isChecked(): Promise<boolean>;
    /** Gets a boolean promise indicating if the checkbox is in an indeterminate state. */
    isIndeterminate(): Promise<boolean>;
    /** Gets a boolean promise indicating if the checkbox is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a boolean promise indicating if the checkbox is required. */
    isRequired(): Promise<boolean>;
    /** Gets a boolean promise indicating if the checkbox is valid. */
    isValid(): Promise<boolean>;
    /** Gets a promise for the checkbox's name. */
    getName(): Promise<string | null>;
    /** Gets a promise for the checkbox's value. */
    getValue(): Promise<string | null>;
    /** Gets a promise for the checkbox's aria-label. */
    getAriaLabel(): Promise<string | null>;
    /** Gets a promise for the checkbox's aria-labelledby. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets a promise for the checkbox's label text. */
    getLabelText(): Promise<string>;
    /** Focuses the checkbox and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the checkbox and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    /**
     * Toggle the checked state of the checkbox and returns a void promise that indicates when the
     * action is complete.
     *
     * Note: This attempts to toggle the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_CLICK_ACTION` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    toggle(): Promise<void>;
    /**
     * Puts the checkbox in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked. Returns a void promise that indicates when the action is
     * complete.
     *
     * Note: This attempts to check the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_CLICK_ACTION` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    check(): Promise<void>;
    /**
     * Puts the checkbox in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked. Returns a void promise that indicates when the action is
     * complete.
     *
     * Note: This attempts to uncheck the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_CLICK_ACTION` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    uncheck(): Promise<void>;
}
