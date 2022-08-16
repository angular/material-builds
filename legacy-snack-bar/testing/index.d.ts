import { HarnessPredicate } from '@angular/cdk/testing';
import { SnackBarHarnessFilters as LegacySnackBarHarnessFilters } from '@angular/material/snack-bar/testing';
import { _MatSnackBarHarnessBase } from '@angular/material/snack-bar/testing';

export { LegacySnackBarHarnessFilters }

/** Harness for interacting with a standard mat-snack-bar in tests. */
export declare class MatLegacySnackBarHarness extends _MatSnackBarHarnessBase {
    /** The selector for the host element of a `MatSnackBar` instance. */
    static hostSelector: string;
    protected _messageSelector: string;
    protected _actionButtonSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a snack bar with specific attributes.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: LegacySnackBarHarnessFilters): HarnessPredicate<MatLegacySnackBarHarness>;
    protected _assertContentAnnotated(): Promise<void>;
    /** Whether the snack-bar is using the default content template. */
    private _isSimpleSnackBar;
}

export { }
