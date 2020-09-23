/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatTreeNodeHarness } from './node-harness';
import { TreeHarnessFilters, TreeNodeHarnessFilters } from './tree-harness-filters';
/** Harness for interacting with a standard mat-tree in tests. */
export declare class MatTreeHarness extends ComponentHarness {
    /** The selector for the host element of a `MatTableHarness` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TreeHarnessFilters): HarnessPredicate<MatTreeHarness>;
    /** Gets all of the nodes in the tree. */
    getNodes(filter?: TreeNodeHarnessFilters): Promise<MatTreeNodeHarness[]>;
}
