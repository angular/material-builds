/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { RadioButtonHarnessFilters, RadioGroupHarnessFilters } from './radio-harness-filters';
/**
 * Harness for interacting with a standard mat-radio-group in tests.
 * @dynamic
 */
export declare class MatRadioGroupHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-group with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a radio-group whose host element matches the given selector.
     *   - `name` finds a radio-group with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RadioGroupHarnessFilters): HarnessPredicate<MatRadioGroupHarness>;
    private _radioButtons;
    /** Gets the name of the radio-group. */
    getName(): Promise<string | null>;
    /** Gets the id of the radio-group. */
    getId(): Promise<string | null>;
    /** Gets the selected radio-button in a radio-group. */
    getSelectedRadioButton(): Promise<MatRadioButtonHarness | null>;
    /** Gets the selected value of the radio-group. */
    getSelectedValue(): Promise<string | null>;
    /** Gets all radio buttons which are part of the radio-group. */
    getRadioButtons(): Promise<MatRadioButtonHarness[]>;
    private _getGroupNameFromHost;
    private _getNamesFromRadioButtons;
    /** Checks if the specified radio names are all equal. */
    private _checkRadioNamesInGroupEqual;
    /**
     * Checks if a radio-group harness has the given name. Throws if a radio-group with
     * matching name could be found but has mismatching radio-button names.
     */
    private static _checkRadioGroupName;
}
/**
 * Harness for interacting with a standard mat-radio-button in tests.
 * @dynamic
 */
export declare class MatRadioButtonHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-button with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a radio-button whose host element matches the given selector.
     *   - `label` finds a radio-button with specific label text.
     *   - `name` finds a radio-button with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RadioButtonHarnessFilters): HarnessPredicate<MatRadioButtonHarness>;
    private _textLabel;
    private _clickLabel;
    private _input;
    /** Whether the radio-button is checked. */
    isChecked(): Promise<boolean>;
    /** Whether the radio-button is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the radio-button is required. */
    isRequired(): Promise<boolean>;
    /** Gets a promise for the radio-button's name. */
    getName(): Promise<string | null>;
    /** Gets a promise for the radio-button's id. */
    getId(): Promise<string | null>;
    /**
     * Gets the value of the radio-button. The radio-button value will be
     * converted to a string.
     *
     * Note that this means that radio-button's with objects as value will
     * intentionally have the `[object Object]` as return value.
     */
    getValue(): Promise<string | null>;
    /** Gets a promise for the radio-button's label text. */
    getLabelText(): Promise<string>;
    /**
     * Focuses the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
    focus(): Promise<void>;
    /**
     * Blurs the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
    blur(): Promise<void>;
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked. Returns a void promise that indicates when
     * the action is complete.
     */
    check(): Promise<void>;
}
