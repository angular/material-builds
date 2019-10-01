/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MenuItemHarnessFilters } from './menu-harness-filters';
/**
 * Harness for interacting with a standard mat-menu in tests.
 * @dynamic
 */
export declare class MatMenuItemHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a menu item whose host element matches the given selector.
     *   - `label` finds a menu item with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: MenuItemHarnessFilters): HarnessPredicate<MatMenuItemHarness>;
    /** Gets a boolean promise indicating if the menu is disabled. */
    isDisabled(): Promise<boolean>;
    getText(): Promise<string>;
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
}
