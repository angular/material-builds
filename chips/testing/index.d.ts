import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { ContentContainerComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { TestKey } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatChipAvatarHarness` instances. */
export declare interface ChipAvatarHarnessFilters extends BaseHarnessFilters {
}

/** A set of criteria that can be used to filter a list of chip instances. */
export declare interface ChipHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /**
     * Only find chip instances whose selected state matches the given value.
     * @deprecated Use `MatChipOptionHarness` together with `ChipOptionHarnessFilters`.
     * @breaking-change 12.0.0
     */
    selected?: boolean;
}

/** A set of criteria that can be used to filter a list of `MatChipListInputHarness` instances. */
export declare interface ChipInputHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the value of the input. */
    value?: string | RegExp;
    /** Filters based on the placeholder text of the input. */
    placeholder?: string | RegExp;
}

/** A set of criteria that can be used to filter selectable chip list instances. */
export declare interface ChipListboxHarnessFilters extends BaseHarnessFilters {
}

/** A set of criteria that can be used to filter chip list instances. */
export declare interface ChipListHarnessFilters extends BaseHarnessFilters {
}

/** A set of criteria that can be used to filter a list of selectable chip instances. */
export declare interface ChipOptionHarnessFilters extends ChipHarnessFilters {
    /** Only find chip instances whose selected state matches the given value. */
    selected?: boolean;
}

/** A set of criteria that can be used to filter a list of `MatChipRemoveHarness` instances. */
export declare interface ChipRemoveHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a standard Material chip avatar in tests. */
declare class MatChipAvatarHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipAvatarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipAvatarHarnessFilters): HarnessPredicate<MatChipAvatarHarness>;
}

/** Harness for interacting with a standard selectable Angular Material chip in tests. */
export declare class MatChipHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatChip` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipHarnessFilters): HarnessPredicate<MatChipHarness>;
    /** Gets the text of the chip. */
    getText(): Promise<string>;
    /**
     * Whether the chip is selected.
     * @deprecated Use `MatChipOptionHarness.isSelected` instead.
     * @breaking-change 12.0.0
     */
    isSelected(): Promise<boolean>;
    /** Whether the chip is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Selects the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.select` instead.
     * @breaking-change 12.0.0
     */
    select(): Promise<void>;
    /**
     * Deselects the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.deselect` instead.
     * @breaking-change 12.0.0
     */
    deselect(): Promise<void>;
    /**
     * Toggles the selected state of the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.toggle` instead.
     * @breaking-change 12.0.0
     */
    toggle(): Promise<void>;
    /** Removes the given chip. Only applies if it's removable. */
    remove(): Promise<void>;
    /**
     * Gets the remove button inside of a chip.
     * @param filter Optionally filters which remove buttons are included.
     */
    getRemoveButton(filter?: ChipRemoveHarnessFilters): Promise<MatChipRemoveHarness>;
    /**
     * Gets the avatar inside a chip.
     * @param filter Optionally filters which avatars are included.
     */
    getAvatar(filter?: ChipAvatarHarnessFilters): Promise<MatChipAvatarHarness | null>;
}

/** Harness for interacting with a standard Material chip inputs in tests. */
export declare class MatChipInputHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipInputHarnessFilters): HarnessPredicate<MatChipInputHarness>;
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
    /** Gets the placeholder of the input. */
    getPlaceholder(): Promise<string>;
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus(): Promise<void>;
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur(): Promise<void>;
    /** Whether the input is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
    /** Sends a chip separator key to the input element. */
    sendSeparatorKey(key: TestKey | string): Promise<void>;
}

/** Harness for interacting with a standard selectable chip list in tests. */
export declare class MatChipListboxHarness extends _MatChipListHarnessBase {
    /** The selector for the host element of a `MatChipList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipListboxHarnessFilters): HarnessPredicate<MatChipListboxHarness>;
    /**
     * Gets the list of chips inside the chip list.
     * @param filter Optionally filters which chips are included.
     */
    getChips(filter?: ChipOptionHarnessFilters): Promise<MatChipOptionHarness[]>;
    /**
     * Selects a chip inside the chip list.
     * @param filter An optional filter to apply to the child chips.
     *    All the chips matching the filter will be selected.
     */
    selectChips(filter?: ChipOptionHarnessFilters): Promise<void>;
}

/** Harness for interacting with a standard chip list in tests. */
export declare class MatChipListHarness extends _MatChipListHarnessBase {
    /** The selector for the host element of a `MatChipList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipListHarnessFilters): HarnessPredicate<MatChipListHarness>;
    /**
     * Gets the list of chips inside the chip list.
     * @param filter Optionally filters which chips are included.
     */
    getChips(filter?: ChipHarnessFilters): Promise<MatChipHarness[]>;
    /**
     * Selects a chip inside the chip list.
     * @param filter An optional filter to apply to the child chips.
     *    All the chips matching the filter will be selected.
     * @deprecated Use `MatChipListboxHarness.selectChips` instead.
     * @breaking-change 12.0.0
     */
    selectChips(filter?: ChipHarnessFilters): Promise<void>;
    /**
     * Gets the `MatChipInput` inside the chip list.
     * @param filter Optionally filters which chip input is included.
     */
    getInput(filter?: ChipInputHarnessFilters): Promise<MatChipInputHarness>;
}

/** Base class for chip list harnesses. */
declare abstract class _MatChipListHarnessBase extends ComponentHarness {
    /** Gets whether the chip list is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the chip list is required. */
    isRequired(): Promise<boolean>;
    /** Gets whether the chip list is invalid. */
    isInvalid(): Promise<boolean>;
    /** Gets whether the chip list is in multi selection mode. */
    isMultiple(): Promise<boolean>;
    /** Gets whether the orientation of the chip list. */
    getOrientation(): Promise<'horizontal' | 'vertical'>;
}

export declare class MatChipOptionHarness extends MatChipHarness {
    /** The selector for the host element of a selectable chip instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipOptionHarness`
     * that meets certain criteria.
     * @param options Options for filtering which chip instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipOptionHarnessFilters): HarnessPredicate<MatChipOptionHarness>;
    /** Whether the chip is selected. */
    isSelected(): Promise<boolean>;
    /** Selects the given chip. Only applies if it's selectable. */
    select(): Promise<void>;
    /** Deselects the given chip. Only applies if it's selectable. */
    deselect(): Promise<void>;
    /** Toggles the selected state of the given chip. */
    toggle(): Promise<void>;
}

/** Harness for interacting with a standard Material chip remove button in tests. */
export declare class MatChipRemoveHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipRemoveHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipRemoveHarnessFilters): HarnessPredicate<MatChipRemoveHarness>;
    /** Clicks the remove button. */
    click(): Promise<void>;
}

export { }
