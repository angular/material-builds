import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a standard mat-progress-bar in tests. */
export declare class MatProgressBarHarness extends ComponentHarness {
    /** The selector for the host element of a `MatProgressBar` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which progress bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ProgressBarHarnessFilters): HarnessPredicate<MatProgressBarHarness>;
    /** Gets the progress bar's value. */
    getValue(): Promise<number | null>;
    /** Gets the progress bar's mode. */
    getMode(): Promise<string | null>;
}

/** A set of criteria that can be used to filter a list of `MatProgressBarHarness` instances. */
export declare interface ProgressBarHarnessFilters extends BaseHarnessFilters {
}

export { }
