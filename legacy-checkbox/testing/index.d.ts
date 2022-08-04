import { AsyncFactoryFn } from '@angular/cdk/testing';
import { CheckboxHarnessFilters } from '@angular/material/checkbox/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatCheckboxHarnessBase } from '@angular/material/checkbox/testing';
import { TestElement } from '@angular/cdk/testing';

export { CheckboxHarnessFilters }

/** Harness for interacting with a standard mat-checkbox in tests. */
export declare class MatLegacyCheckboxHarness extends _MatCheckboxHarnessBase {
    /** The selector for the host element of a checkbox instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a checkbox harness that meets
     * certain criteria.
     * @param options Options for filtering which checkbox instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CheckboxHarnessFilters): HarnessPredicate<MatLegacyCheckboxHarness>;
    protected _input: AsyncFactoryFn<TestElement>;
    protected _label: AsyncFactoryFn<TestElement>;
    private _inputContainer;
    toggle(): Promise<void>;
}

export { }
