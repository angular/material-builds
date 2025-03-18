import * as _angular_cdk_testing from '@angular/cdk/testing';
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { M as MatSelectHarness } from '../../select-harness.d-7441a7ac.js';
import '../../option-harness.d-3d33fc9a.js';
import '../../optgroup-harness.d-7f741f69.js';
import '../../form-field-control-harness.d-2d91f25a.js';

/** A set of criteria that can be used to filter a list of `MatPaginatorHarness` instances. */
interface PaginatorHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a mat-paginator in tests. */
declare class MatPaginatorHarness extends ComponentHarness {
    /** Selector used to find paginator instances. */
    static hostSelector: string;
    private _nextButton;
    private _previousButton;
    private _firstPageButton;
    private _lastPageButton;
    _select: _angular_cdk_testing.AsyncFactoryFn<MatSelectHarness | null>;
    private _pageSizeFallback;
    _rangeLabel: _angular_cdk_testing.AsyncFactoryFn<_angular_cdk_testing.TestElement>;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a paginator with specific attributes.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatPaginatorHarness>(this: ComponentHarnessConstructor<T>, options?: PaginatorHarnessFilters): HarnessPredicate<T>;
    /** Goes to the next page in the paginator. */
    goToNextPage(): Promise<void>;
    /** Returns whether or not the next page button is disabled. */
    isNextPageDisabled(): Promise<boolean>;
    isPreviousPageDisabled(): Promise<boolean>;
    /** Goes to the previous page in the paginator. */
    goToPreviousPage(): Promise<void>;
    /** Goes to the first page in the paginator. */
    goToFirstPage(): Promise<void>;
    /** Goes to the last page in the paginator. */
    goToLastPage(): Promise<void>;
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    setPageSize(size: number): Promise<void>;
    /** Gets the page size of the paginator. */
    getPageSize(): Promise<number>;
    /** Gets the text of the range label of the paginator. */
    getRangeLabel(): Promise<string>;
}

export { MatPaginatorHarness, type PaginatorHarnessFilters };
