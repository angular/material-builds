/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { DialogRole } from '@angular/material/dialog';
import { DialogHarnessFilters } from './dialog-harness-filters';
/**
 * Harness for interacting with a standard MatDialog in tests.
 * @dynamic
 */
export declare class MatDialogHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a dialog with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `id` finds a dialog with specific id.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DialogHarnessFilters): HarnessPredicate<MatDialogHarness>;
    /** Gets the id of the dialog. */
    getId(): Promise<string | null>;
    /** Gets the role of the dialog. */
    getRole(): Promise<DialogRole | null>;
    /** Gets the value of the dialog's "aria-label" attribute. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    getAriaDescribedby(): Promise<string | null>;
    /**
     * Closes the dialog by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true for the dialog.
     */
    close(): Promise<void>;
}
