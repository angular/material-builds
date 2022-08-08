import { AsyncFactoryFn } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatRadioButtonHarnessBase } from '@angular/material/radio/testing';
import { _MatRadioGroupHarnessBase } from '@angular/material/radio/testing';
import { RadioButtonHarnessFilters } from '@angular/material/radio/testing';
import { RadioGroupHarnessFilters } from '@angular/material/radio/testing';
import { TestElement } from '@angular/cdk/testing';

/** Harness for interacting with a standard mat-radio-button in tests. */
export declare class MatLegacyRadioButtonHarness extends _MatRadioButtonHarnessBase {
    /** The selector for the host element of a `MatRadioButton` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioButtonHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio button instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RadioButtonHarnessFilters): HarnessPredicate<MatLegacyRadioButtonHarness>;
    protected _textLabel: AsyncFactoryFn<TestElement>;
    protected _clickLabel: AsyncFactoryFn<TestElement>;
}

/** Harness for interacting with a standard mat-radio-group in tests. */
export declare class MatLegacyRadioGroupHarness extends _MatRadioGroupHarnessBase<typeof MatLegacyRadioButtonHarness, MatLegacyRadioButtonHarness, RadioButtonHarnessFilters> {
    /** The selector for the host element of a `MatRadioGroup` instance. */
    static hostSelector: string;
    protected _buttonClass: typeof MatLegacyRadioButtonHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RadioGroupHarnessFilters): HarnessPredicate<MatLegacyRadioGroupHarness>;
}

export { RadioButtonHarnessFilters }

export { RadioGroupHarnessFilters }

export { }
