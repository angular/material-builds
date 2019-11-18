/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SnackBarHarnessFilters } from './snack-bar-harness-filters';
/** Harness for interacting with a standard mat-snack-bar in tests. */
export declare class MatSnackBarHarness extends ComponentHarness {
    static hostSelector: string;
    private _simpleSnackBar;
    private _simpleSnackBarMessage;
    private _simpleSnackBarActionButton;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a snack-bar with
     * specific attributes.
     * @param options Options for narrowing the search.
     *   - `selector` finds a snack-bar that matches the given selector. Note that the
     *                selector must match the snack-bar container element.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options?: SnackBarHarnessFilters): HarnessPredicate<MatSnackBarHarness>;
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     */
    getRole(): Promise<'alert' | 'status' | null>;
    /**
     * Gets whether the snack-bar has an action. Method cannot be
     * used for snack-bar's with custom content.
     */
    hasAction(): Promise<boolean>;
    /**
     * Gets the description of the snack-bar. Method cannot be
     * used for snack-bar's without action or with custom content.
     */
    getActionDescription(): Promise<string>;
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot
     * be used for snack-bar's without action or with custom content.
     */
    dismissWithAction(): Promise<void>;
    /**
     * Gets the message of the snack-bar. Method cannot be used for
     * snack-bar's with custom content.
     */
    getMessage(): Promise<string>;
    /**
     * Asserts that the current snack-bar does not use custom content. Throws if
     * custom content is used.
     */
    private _assertSimpleSnackBar;
    /**
     * Asserts that the current snack-bar does not use custom content and has
     * an action defined. Otherwise an error will be thrown.
     */
    private _assertSimpleSnackBarWithAction;
    /** Gets whether the snack-bar is using the default content template. */
    private _isSimpleSnackBar;
}
