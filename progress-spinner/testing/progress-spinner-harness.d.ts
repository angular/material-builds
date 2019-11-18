/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ProgressSpinnerHarnessFilters } from './progress-spinner-harness-filters';
/** Harness for interacting with a standard mat-progress-spinner in tests. */
export declare class MatProgressSpinnerHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     */
    static with(options?: ProgressSpinnerHarnessFilters): HarnessPredicate<MatProgressSpinnerHarness>;
    /** Gets a promise for the progress spinner's value. */
    getValue(): Promise<number | null>;
    /** Gets a promise for the progress spinner's mode. */
    getMode(): Promise<ProgressSpinnerMode>;
}
