import { ComponentHarness } from '@angular/cdk/testing';
import { ComponentHarnessConstructor } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { LegacyProgressSpinnerMode } from '@angular/material/legacy-progress-spinner';
import { LegacyProgressSpinnerHarnessFilters as ProgressSpinnerHarnessFilters } from '@angular/material/legacy-progress-spinner/testing';

/** Harness for interacting with a MDC based mat-progress-spinner in tests. */
export declare class MatProgressSpinnerHarness extends ComponentHarness {
    /** The selector for the host element of a `MatProgressSpinner` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress spinnner with specific
     * attributes.
     * @param options Options for filtering which progress spinner instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatProgressSpinnerHarness>(this: ComponentHarnessConstructor<T>, options?: ProgressSpinnerHarnessFilters): HarnessPredicate<T>;
    /** Gets the progress spinner's value. */
    getValue(): Promise<number | null>;
    /** Gets the progress spinner's mode. */
    getMode(): Promise<LegacyProgressSpinnerMode>;
}

export { ProgressSpinnerHarnessFilters }

export { }
