import { AsyncFactoryFn } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatTooltipHarnessBase } from '@angular/material/tooltip/testing';
import { TestElement } from '@angular/cdk/testing';
import { TooltipHarnessFilters } from '@angular/material/tooltip/testing';

/** Harness for interacting with a standard mat-tooltip in tests. */
export declare class MatLegacyTooltipHarness extends _MatTooltipHarnessBase {
    protected _optionalPanel: AsyncFactoryFn<TestElement | null>;
    protected _hiddenClass: string;
    protected _showAnimationName: string;
    protected _hideAnimationName: string;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TooltipHarnessFilters): HarnessPredicate<MatLegacyTooltipHarness>;
}

export { TooltipHarnessFilters }

export { }
