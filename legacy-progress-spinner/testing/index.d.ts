import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { LegacyProgressSpinnerMode } from '@angular/material/legacy-progress-spinner';

/** A set of criteria that can be used to filter a list of `MatProgressSpinnerHarness` instances. */
export declare interface LegacyProgressSpinnerHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a standard mat-progress-spinner in tests. */
export declare class MatLegacyProgressSpinnerHarness extends ComponentHarness {
    /** The selector for the host element of a Progress Spinner instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressSpinnerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which progress spinner instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: LegacyProgressSpinnerHarnessFilters): HarnessPredicate<MatLegacyProgressSpinnerHarness>;
    /** Gets the progress spinner's value. */
    getValue(): Promise<number | null>;
    /** Gets the progress spinner's mode. */
    getMode(): Promise<LegacyProgressSpinnerMode>;
}

export { }
