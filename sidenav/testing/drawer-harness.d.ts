/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { DrawerHarnessFilters } from './drawer-harness-filters';
/**
 * Harness for interacting with a standard mat-drawer in tests.
 * @dynamic
 */
export declare class MatDrawerHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a drawer with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerHarnessFilters): HarnessPredicate<MatDrawerHarness>;
    /** Gets whether the drawer is open. */
    isOpen(): Promise<boolean>;
    /** Gets the position of the drawer inside its container. */
    getPosition(): Promise<'start' | 'end'>;
    /** Gets the mode that the drawer is in. */
    getMode(): Promise<'over' | 'push' | 'side'>;
}
