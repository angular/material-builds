import { AsyncFactoryFn } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatLegacySelectHarness } from '@angular/material/legacy-select/testing';
import { _MatPaginatorHarnessBase } from '@angular/material/paginator/testing';
import { PaginatorHarnessFilters } from '@angular/material/paginator/testing';
import { TestElement } from '@angular/cdk/testing';

/** Harness for interacting with a standard mat-paginator in tests. */
export declare class MatLegacyPaginatorHarness extends _MatPaginatorHarnessBase {
    /** Selector used to find paginator instances. */
    static hostSelector: string;
    protected _nextButton: AsyncFactoryFn<TestElement>;
    protected _previousButton: AsyncFactoryFn<TestElement>;
    protected _firstPageButton: AsyncFactoryFn<TestElement | null>;
    protected _lastPageButton: AsyncFactoryFn<TestElement | null>;
    protected _select: AsyncFactoryFn<MatLegacySelectHarness | null>;
    protected _pageSizeFallback: AsyncFactoryFn<TestElement>;
    protected _rangeLabel: AsyncFactoryFn<TestElement>;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: PaginatorHarnessFilters): HarnessPredicate<MatLegacyPaginatorHarness>;
}

export { _MatPaginatorHarnessBase }

export { PaginatorHarnessFilters }

export { }
