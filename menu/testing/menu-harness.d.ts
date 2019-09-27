/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MenuHarnessFilters } from './menu-harness-filters';
import { MatMenuItemHarness } from './menu-item-harness';
/**
 * Harness for interacting with a standard mat-menu in tests.
 * @dynamic
 */
export declare class MatMenuHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a menu whose host element matches the given selector.
     *   - `label` finds a menu with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: MenuHarnessFilters): HarnessPredicate<MatMenuHarness>;
    /** Gets a boolean promise indicating if the menu is disabled. */
    isDisabled(): Promise<boolean>;
    isOpen(): Promise<boolean>;
    getTriggerText(): Promise<string>;
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    open(): Promise<void>;
    close(): Promise<void>;
    getItems(): Promise<MatMenuItemHarness[]>;
    getItemLabels(): Promise<string[]>;
    getItemByLabel(): Promise<MatMenuItemHarness>;
    getItemByIndex(): Promise<MatMenuItemHarness>;
    getFocusedItem(): Promise<MatMenuItemHarness>;
}
