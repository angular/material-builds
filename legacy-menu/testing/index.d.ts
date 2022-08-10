import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatMenuHarnessBase } from '@angular/material/menu/testing';
import { _MatMenuItemHarnessBase } from '@angular/material/menu/testing';
import { MenuHarnessFilters } from '@angular/material/menu/testing';
import { MenuItemHarnessFilters } from '@angular/material/menu/testing';

/** Harness for interacting with a standard mat-menu in tests. */
export declare class MatLegacyMenuHarness extends _MatMenuHarnessBase<typeof MatLegacyMenuItemHarness, MatLegacyMenuItemHarness, MenuItemHarnessFilters> {
    /** The selector for the host element of a `MatMenu` instance. */
    static hostSelector: string;
    protected _itemClass: typeof MatLegacyMenuItemHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuHarness` that meets certain
     * criteria.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: MenuHarnessFilters): HarnessPredicate<MatLegacyMenuHarness>;
}

/** Harness for interacting with a standard mat-menu-item in tests. */
export declare class MatLegacyMenuItemHarness extends _MatMenuItemHarnessBase<typeof MatLegacyMenuHarness, MatLegacyMenuHarness> {
    /** The selector for the host element of a `MatMenuItem` instance. */
    static hostSelector: string;
    protected _menuClass: typeof MatLegacyMenuHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which menu item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: MenuItemHarnessFilters): HarnessPredicate<MatLegacyMenuItemHarness>;
}

export { MenuHarnessFilters }

export { MenuItemHarnessFilters }

export { }
