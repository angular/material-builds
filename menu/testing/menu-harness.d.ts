/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MenuHarnessFilters, MenuItemHarnessFilters } from './menu-harness-filters';
/** Harness for interacting with a standard mat-menu in tests. */
export declare class MatMenuHarness extends ComponentHarness {
    static hostSelector: string;
    private _documentRootLocator;
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
    /** Whether the menu is open. */
    isOpen(): Promise<boolean>;
    getTriggerText(): Promise<string>;
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    open(): Promise<void>;
    close(): Promise<void>;
    getItems(filters?: Omit<MenuItemHarnessFilters, 'ancestor'>): Promise<MatMenuItemHarness[]>;
    clickItem(filter: Omit<MenuItemHarnessFilters, 'ancestor'>, ...filters: Omit<MenuItemHarnessFilters, 'ancestor'>[]): Promise<void>;
    private _getMenuPanel;
    private _getPanelId;
}
/** Harness for interacting with a standard mat-menu-item in tests. */
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
    /** Clicks the menu item. */
    click(): Promise<void>;
    /** Whether this item has a submenu. */
    hasSubmenu(): Promise<boolean>;
    /** Gets the submenu associated with this menu item, or null if none. */
    getSubmenu(): Promise<MatMenuHarness | null>;
}
