import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-optgroup` in tests. */
export declare class MatLegacyOptgroupHarness extends ComponentHarness {
    /** Selector used to locate option group instances. */
    static hostSelector: string;
    private _label;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptgroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: OptgroupHarnessFilters): HarnessPredicate<MatLegacyOptgroupHarness>;
    /** Gets the option group's label text. */
    getLabelText(): Promise<string>;
    /** Gets whether the option group is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    getOptions(filter?: OptionHarnessFilters): Promise<MatLegacyOptionHarness[]>;
}

/** Harness for interacting with a `mat-option` in tests. */
export declare class MatLegacyOptionHarness extends ComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector: string;
    /** Element containing the option's text. */
    private _text;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptionsHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: OptionHarnessFilters): HarnessPredicate<MatLegacyOptionHarness>;
    /** Clicks the option. */
    click(): Promise<void>;
    /** Gets the option's label text. */
    getText(): Promise<string>;
    /** Gets whether the option is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the option is selected. */
    isSelected(): Promise<boolean>;
    /** Gets whether the option is active. */
    isActive(): Promise<boolean>;
    /** Gets whether the option is in multiple selection mode. */
    isMultiple(): Promise<boolean>;
}

export declare interface OptgroupHarnessFilters extends BaseHarnessFilters {
    labelText?: string | RegExp;
}

export declare interface OptionHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
    isSelected?: boolean;
}

export { }
