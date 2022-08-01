import { AsyncFactoryFn } from '@angular/cdk/testing';
import { FormFieldHarnessFilters } from '@angular/material/form-field/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { _MatFormFieldHarnessBase } from '@angular/material/form-field/testing';
import { MatLegacyInputHarness } from '@angular/material/legacy-input/testing';
import { MatLegacySelectHarness } from '@angular/material/legacy-select/testing';
import { TestElement } from '@angular/cdk/testing';

/** Possible harnesses of controls which can be bound to a form-field. */
export declare type FormFieldControlHarness = MatLegacyInputHarness | MatLegacySelectHarness | MatDatepickerInputHarness | MatDateRangeInputHarness;

export { FormFieldHarnessFilters }

export { MatFormFieldControlHarness }

/** Harness for interacting with a standard Material form-field's in tests. */
export declare class MatLegacyFormFieldHarness extends _MatFormFieldHarnessBase<FormFieldControlHarness> {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: FormFieldHarnessFilters): HarnessPredicate<MatLegacyFormFieldHarness>;
    protected _prefixContainer: AsyncFactoryFn<TestElement | null>;
    protected _suffixContainer: AsyncFactoryFn<TestElement | null>;
    protected _label: AsyncFactoryFn<TestElement | null>;
    protected _errors: AsyncFactoryFn<TestElement[]>;
    protected _hints: AsyncFactoryFn<TestElement[]>;
    protected _inputControl: AsyncFactoryFn<MatLegacyInputHarness | null>;
    protected _selectControl: AsyncFactoryFn<MatLegacySelectHarness | null>;
    protected _datepickerInputControl: AsyncFactoryFn<MatDatepickerInputHarness | null>;
    protected _dateRangeInputControl: AsyncFactoryFn<MatDateRangeInputHarness | null>;
    /** Gets the appearance of the form-field. */
    getAppearance(): Promise<'legacy' | 'standard' | 'fill' | 'outline'>;
    /** Whether the form-field has a label. */
    hasLabel(): Promise<boolean>;
    /** Whether the label is currently floating. */
    isLabelFloating(): Promise<boolean>;
}

export { }
