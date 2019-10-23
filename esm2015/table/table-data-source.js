/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, combineLatest, merge, of as observableOf, Subscription, Subject, } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 * @type {?}
 */
const MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Data source that accepts a client-side data array and includes native support of filtering,
 * sorting (using MatSort), and pagination (using MatPaginator).
 *
 * Allows for sort customization by overriding sortingDataAccessor, which defines how data
 * properties are accessed. Also allows for filter customization by overriding filterTermAccessor,
 * which defines how row data is converted to a string for filter matching.
 *
 * **Note:** This class is meant to be a simple data source to help you get started. As such
 * it isn't equipped to handle some more advanced cases like robust i18n support or server-side
 * interactions. If your app needs to support more advanced use cases, consider implementing your
 * own `DataSource`.
 * @template T
 */
export class MatTableDataSource extends DataSource {
    /**
     * @param {?=} initialData
     */
    constructor(initialData = []) {
        super();
        /**
         * Stream emitting render data to the table (depends on ordered data changes).
         */
        this._renderData = new BehaviorSubject([]);
        /**
         * Stream that emits when a new filter string is set on the data source.
         */
        this._filter = new BehaviorSubject('');
        /**
         * Used to react to internal changes of the paginator that are made by the data source itself.
         */
        this._internalPageChanges = new Subject();
        /**
         * Subscription to the changes that should trigger an update to the table's rendered rows, such
         * as filtering, sorting, pagination, or base data changes.
         */
        this._renderChangesSubscription = Subscription.EMPTY;
        /**
         * Data accessor function that is used for accessing data properties for sorting through
         * the default sortData function.
         * This default function assumes that the sort header IDs (which defaults to the column name)
         * matches the data's properties (e.g. column Xyz represents data['Xyz']).
         * May be set to a custom function for different behavior.
         * @param data Data object that is being accessed.
         * @param sortHeaderId The name of the column that represents the data.
         */
        this.sortingDataAccessor = (/**
         * @param {?} data
         * @param {?} sortHeaderId
         * @return {?}
         */
        (data, sortHeaderId) => {
            /** @type {?} */
            const value = ((/** @type {?} */ (data)))[sortHeaderId];
            if (_isNumberValue(value)) {
                /** @type {?} */
                const numberValue = Number(value);
                // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
                // leave them as strings. For more info: https://goo.gl/y5vbSg
                return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
            }
            return value;
        });
        /**
         * Gets a sorted copy of the data array based on the state of the MatSort. Called
         * after changes are made to the filtered data or when sort changes are emitted from MatSort.
         * By default, the function retrieves the active sort and its direction and compares data
         * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
         * of data ordering.
         * @param data The array of data that should be sorted.
         * @param sort The connected MatSort that holds the current sort state.
         */
        this.sortData = (/**
         * @param {?} data
         * @param {?} sort
         * @return {?}
         */
        (data, sort) => {
            /** @type {?} */
            const active = sort.active;
            /** @type {?} */
            const direction = sort.direction;
            if (!active || direction == '') {
                return data;
            }
            return data.sort((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            (a, b) => {
                /** @type {?} */
                let valueA = this.sortingDataAccessor(a, active);
                /** @type {?} */
                let valueB = this.sortingDataAccessor(b, active);
                // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
                // one value exists while the other doesn't. In this case, existing value should come last.
                // This avoids inconsistent results when comparing values to undefined/null.
                // If neither value exists, return 0 (equal).
                /** @type {?} */
                let comparatorResult = 0;
                if (valueA != null && valueB != null) {
                    // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
                    if (valueA > valueB) {
                        comparatorResult = 1;
                    }
                    else if (valueA < valueB) {
                        comparatorResult = -1;
                    }
                }
                else if (valueA != null) {
                    comparatorResult = 1;
                }
                else if (valueB != null) {
                    comparatorResult = -1;
                }
                return comparatorResult * (direction == 'asc' ? 1 : -1);
            }));
        });
        /**
         * Checks if a data object matches the data source's filter string. By default, each data object
         * is converted to a string of its properties and returns true if the filter has
         * at least one occurrence in that string. By default, the filter string has its whitespace
         * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
         * filter matching.
         * @param data Data object used to check against the filter.
         * @param filter Filter string that has been set on the data source.
         * @return Whether the filter matches against the data
         */
        this.filterPredicate = (/**
         * @param {?} data
         * @param {?} filter
         * @return {?}
         */
        (data, filter) => {
            // Transform the data into a lowercase string of all property values.
            /** @type {?} */
            const dataStr = Object.keys(data).reduce((/**
             * @param {?} currentTerm
             * @param {?} key
             * @return {?}
             */
            (currentTerm, key) => {
                // Use an obscure Unicode character to delimit the words in the concatenated string.
                // This avoids matches where the values of two columns combined will match the user's query
                // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                // that has a very low chance of being typed in by somebody in a text field. This one in
                // particular is "White up-pointing triangle with dot" from
                // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                return currentTerm + ((/** @type {?} */ (data)))[key] + '◬';
            }), '').toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            /** @type {?} */
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        });
        this._data = new BehaviorSubject(initialData);
        this._updateChangeSubscription();
    }
    /**
     * Array of data that should be rendered by the table, where each object represents one row.
     * @return {?}
     */
    get data() { return this._data.value; }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) { this._data.next(data); }
    /**
     * Filter term that should be used to filter out objects from the data array. To override how
     * data objects match to this filter string, provide a custom function for filterPredicate.
     * @return {?}
     */
    get filter() { return this._filter.value; }
    /**
     * @param {?} filter
     * @return {?}
     */
    set filter(filter) { this._filter.next(filter); }
    /**
     * Instance of the MatSort directive used by the table to control its sorting. Sort changes
     * emitted by the MatSort will trigger an update to the table's rendered data.
     * @return {?}
     */
    get sort() { return this._sort; }
    /**
     * @param {?} sort
     * @return {?}
     */
    set sort(sort) {
        this._sort = sort;
        this._updateChangeSubscription();
    }
    /**
     * Instance of the MatPaginator component used by the table to control what page of the data is
     * displayed. Page changes emitted by the MatPaginator will trigger an update to the
     * table's rendered data.
     *
     * Note that the data source uses the paginator's properties to calculate which page of data
     * should be displayed. If the paginator receives its properties as template inputs,
     * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
     * initialized before assigning it to this data source.
     * @return {?}
     */
    get paginator() { return this._paginator; }
    /**
     * @param {?} paginator
     * @return {?}
     */
    set paginator(paginator) {
        this._paginator = paginator;
        this._updateChangeSubscription();
    }
    /**
     * Subscribe to changes that should trigger an update to the table's rendered rows. When the
     * changes occur, process the current state of the filter, sort, and pagination along with
     * the provided base data and send it to the table for rendering.
     * @return {?}
     */
    _updateChangeSubscription() {
        // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
        // The events should emit whenever the component emits a change or initializes, or if no
        // component is provided, a stream with just a null event should be provided.
        // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
        // pipeline can progress to the next step. Note that the value from these streams are not used,
        // they purely act as a signal to progress in the pipeline.
        /** @type {?} */
        const sortChange = this._sort ?
            (/** @type {?} */ (merge(this._sort.sortChange, this._sort.initialized))) :
            observableOf(null);
        /** @type {?} */
        const pageChange = this._paginator ?
            (/** @type {?} */ (merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized))) :
            observableOf(null);
        /** @type {?} */
        const dataStream = this._data;
        // Watch for base data or filter changes to provide a filtered set of data.
        /** @type {?} */
        const filteredData = combineLatest([dataStream, this._filter])
            .pipe(map((/**
         * @param {?} __0
         * @return {?}
         */
        ([data]) => this._filterData(data))));
        // Watch for filtered data or sort changes to provide an ordered set of data.
        /** @type {?} */
        const orderedData = combineLatest([filteredData, sortChange])
            .pipe(map((/**
         * @param {?} __0
         * @return {?}
         */
        ([data]) => this._orderData(data))));
        // Watch for ordered data or page changes to provide a paged set of data.
        /** @type {?} */
        const paginatedData = combineLatest([orderedData, pageChange])
            .pipe(map((/**
         * @param {?} __0
         * @return {?}
         */
        ([data]) => this._pageData(data))));
        // Watched for paged data changes and send the result to the table to render.
        this._renderChangesSubscription.unsubscribe();
        this._renderChangesSubscription = paginatedData.subscribe((/**
         * @param {?} data
         * @return {?}
         */
        data => this._renderData.next(data)));
    }
    /**
     * Returns a filtered data array where each filter object contains the filter string within
     * the result of the filterTermAccessor function. If no filter is set, returns the data array
     * as provided.
     * @param {?} data
     * @return {?}
     */
    _filterData(data) {
        // If there is a filter string, filter out data that does not contain it.
        // Each data object is converted to a string using the function defined by filterTermAccessor.
        // May be overridden for customization.
        this.filteredData =
            !this.filter ? data : data.filter((/**
             * @param {?} obj
             * @return {?}
             */
            obj => this.filterPredicate(obj, this.filter)));
        if (this.paginator) {
            this._updatePaginator(this.filteredData.length);
        }
        return this.filteredData;
    }
    /**
     * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
     * data array as provided. Uses the default data accessor for data lookup, unless a
     * sortDataAccessor function is defined.
     * @param {?} data
     * @return {?}
     */
    _orderData(data) {
        // If there is no active sort or direction, return the data without trying to sort.
        if (!this.sort) {
            return data;
        }
        return this.sortData(data.slice(), this.sort);
    }
    /**
     * Returns a paged slice of the provided data array according to the provided MatPaginator's page
     * index and length. If there is no paginator provided, returns the data array as provided.
     * @param {?} data
     * @return {?}
     */
    _pageData(data) {
        if (!this.paginator) {
            return data;
        }
        /** @type {?} */
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.slice(startIndex, startIndex + this.paginator.pageSize);
    }
    /**
     * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
     * index does not exceed the paginator's last page. Values are changed in a resolved promise to
     * guard against making property changes within a round of change detection.
     * @param {?} filteredDataLength
     * @return {?}
     */
    _updatePaginator(filteredDataLength) {
        Promise.resolve().then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const paginator = this.paginator;
            if (!paginator) {
                return;
            }
            paginator.length = filteredDataLength;
            // If the page index is set beyond the page, reduce it to the last page.
            if (paginator.pageIndex > 0) {
                /** @type {?} */
                const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
                /** @type {?} */
                const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
                if (newPageIndex !== paginator.pageIndex) {
                    paginator.pageIndex = newPageIndex;
                    // Since the paginator only emits after user-generated changes,
                    // we need our own stream so we know to should re-render the data.
                    this._internalPageChanges.next();
                }
            }
        }));
    }
    /**
     * Used by the MatTable. Called when it connects to the data source.
     * \@docs-private
     * @return {?}
     */
    connect() { return this._renderData; }
    /**
     * Used by the MatTable. Called when it is destroyed. No-op.
     * \@docs-private
     * @return {?}
     */
    disconnect() { }
}
if (false) {
    /**
     * Stream that emits when a new data array is set on the data source.
     * @type {?}
     * @private
     */
    MatTableDataSource.prototype._data;
    /**
     * Stream emitting render data to the table (depends on ordered data changes).
     * @type {?}
     * @private
     */
    MatTableDataSource.prototype._renderData;
    /**
     * Stream that emits when a new filter string is set on the data source.
     * @type {?}
     * @private
     */
    MatTableDataSource.prototype._filter;
    /**
     * Used to react to internal changes of the paginator that are made by the data source itself.
     * @type {?}
     * @private
     */
    MatTableDataSource.prototype._internalPageChanges;
    /**
     * Subscription to the changes that should trigger an update to the table's rendered rows, such
     * as filtering, sorting, pagination, or base data changes.
     * @type {?}
     */
    MatTableDataSource.prototype._renderChangesSubscription;
    /**
     * The filtered set of data that has been matched by the filter string, or all the data if there
     * is no filter. Useful for knowing the set of data the table represents.
     * For example, a 'selectAll()' function would likely want to select the set of filtered data
     * shown to the user rather than all the data.
     * @type {?}
     */
    MatTableDataSource.prototype.filteredData;
    /**
     * @type {?}
     * @private
     */
    MatTableDataSource.prototype._sort;
    /**
     * @type {?}
     * @private
     */
    MatTableDataSource.prototype._paginator;
    /**
     * Data accessor function that is used for accessing data properties for sorting through
     * the default sortData function.
     * This default function assumes that the sort header IDs (which defaults to the column name)
     * matches the data's properties (e.g. column Xyz represents data['Xyz']).
     * May be set to a custom function for different behavior.
     * \@param data Data object that is being accessed.
     * \@param sortHeaderId The name of the column that represents the data.
     * @type {?}
     */
    MatTableDataSource.prototype.sortingDataAccessor;
    /**
     * Gets a sorted copy of the data array based on the state of the MatSort. Called
     * after changes are made to the filtered data or when sort changes are emitted from MatSort.
     * By default, the function retrieves the active sort and its direction and compares data
     * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
     * of data ordering.
     * \@param data The array of data that should be sorted.
     * \@param sort The connected MatSort that holds the current sort state.
     * @type {?}
     */
    MatTableDataSource.prototype.sortData;
    /**
     * Checks if a data object matches the data source's filter string. By default, each data object
     * is converted to a string of its properties and returns true if the filter has
     * at least one occurrence in that string. By default, the filter string has its whitespace
     * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
     * filter matching.
     * \@param data Data object used to check against the filter.
     * \@param filter Filter string that has been set on the data source.
     * \@return Whether the filter matches against the data
     * @type {?}
     */
    MatTableDataSource.prototype.filterPredicate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFDTCxlQUFlLEVBQ2YsYUFBYSxFQUNiLEtBQUssRUFFTCxFQUFFLElBQUksWUFBWSxFQUNsQixZQUFZLEVBQ1osT0FBTyxHQUNSLE1BQU0sTUFBTSxDQUFDO0FBR2QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7TUFNN0IsZ0JBQWdCLEdBQUcsZ0JBQWdCOzs7Ozs7Ozs7Ozs7Ozs7QUFlekMsTUFBTSxPQUFPLGtCQUFzQixTQUFRLFVBQWE7Ozs7SUE4SnRELFlBQVksY0FBbUIsRUFBRTtRQUMvQixLQUFLLEVBQUUsQ0FBQzs7OztRQTFKTyxnQkFBVyxHQUFHLElBQUksZUFBZSxDQUFNLEVBQUUsQ0FBQyxDQUFDOzs7O1FBRzNDLFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQzs7OztRQUcxQyx5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7OztRQU01RCwrQkFBMEIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDOzs7Ozs7Ozs7O1FBMERoRCx3QkFBbUI7Ozs7O1FBQ2YsQ0FBQyxJQUFPLEVBQUUsWUFBb0IsRUFBaUIsRUFBRTs7a0JBQzdDLEtBQUssR0FBRyxDQUFDLG1CQUFBLElBQUksRUFBd0IsQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUUxRCxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7c0JBQ25CLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO2dC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Q3JCLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOztzQkFDekUsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7Z0JBRWpFLElBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQyxTQUFTLEVBQUU7b0JBQ3hDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO29CQUVuQywrREFBK0Q7b0JBQy9ELGtFQUFrRTtvQkFDbEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsQzthQUNGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7SUFNRCxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBTXRDLFVBQVUsS0FBSyxDQUFDO0NBQ2pCOzs7Ozs7O0lBdlJDLG1DQUE2Qzs7Ozs7O0lBRzdDLHlDQUE0RDs7Ozs7O0lBRzVELHFDQUEyRDs7Ozs7O0lBRzNELGtEQUE0RDs7Ozs7O0lBTTVELHdEQUFnRDs7Ozs7Ozs7SUFRaEQsMENBQWtCOzs7OztJQXNCbEIsbUNBQTRCOzs7OztJQWlCNUIsd0NBQXNDOzs7Ozs7Ozs7OztJQVd0QyxpREFhQzs7Ozs7Ozs7Ozs7SUFXRCxzQ0E2QkM7Ozs7Ozs7Ozs7OztJQVlELDZDQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge19pc051bWJlclZhbHVlfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtEYXRhU291cmNlfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtcbiAgQmVoYXZpb3JTdWJqZWN0LFxuICBjb21iaW5lTGF0ZXN0LFxuICBtZXJnZSxcbiAgT2JzZXJ2YWJsZSxcbiAgb2YgYXMgb2JzZXJ2YWJsZU9mLFxuICBTdWJzY3JpcHRpb24sXG4gIFN1YmplY3QsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRQYWdpbmF0b3IsIFBhZ2VFdmVudH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJztcbmltcG9ydCB7TWF0U29ydCwgU29ydH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIENvcnJlc3BvbmRzIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuIE1vdmVkIG91dCBpbnRvIGEgdmFyaWFibGUgaGVyZSBkdWUgdG9cbiAqIGZsYWt5IGJyb3dzZXIgc3VwcG9ydCBhbmQgdGhlIHZhbHVlIG5vdCBiZWluZyBkZWZpbmVkIGluIENsb3N1cmUncyB0eXBpbmdzLlxuICovXG5jb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBEYXRhIHNvdXJjZSB0aGF0IGFjY2VwdHMgYSBjbGllbnQtc2lkZSBkYXRhIGFycmF5IGFuZCBpbmNsdWRlcyBuYXRpdmUgc3VwcG9ydCBvZiBmaWx0ZXJpbmcsXG4gKiBzb3J0aW5nICh1c2luZyBNYXRTb3J0KSwgYW5kIHBhZ2luYXRpb24gKHVzaW5nIE1hdFBhZ2luYXRvcikuXG4gKlxuICogQWxsb3dzIGZvciBzb3J0IGN1c3RvbWl6YXRpb24gYnkgb3ZlcnJpZGluZyBzb3J0aW5nRGF0YUFjY2Vzc29yLCB3aGljaCBkZWZpbmVzIGhvdyBkYXRhXG4gKiBwcm9wZXJ0aWVzIGFyZSBhY2Nlc3NlZC4gQWxzbyBhbGxvd3MgZm9yIGZpbHRlciBjdXN0b21pemF0aW9uIGJ5IG92ZXJyaWRpbmcgZmlsdGVyVGVybUFjY2Vzc29yLFxuICogd2hpY2ggZGVmaW5lcyBob3cgcm93IGRhdGEgaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIGZvciBmaWx0ZXIgbWF0Y2hpbmcuXG4gKlxuICogKipOb3RlOioqIFRoaXMgY2xhc3MgaXMgbWVhbnQgdG8gYmUgYSBzaW1wbGUgZGF0YSBzb3VyY2UgdG8gaGVscCB5b3UgZ2V0IHN0YXJ0ZWQuIEFzIHN1Y2hcbiAqIGl0IGlzbid0IGVxdWlwcGVkIHRvIGhhbmRsZSBzb21lIG1vcmUgYWR2YW5jZWQgY2FzZXMgbGlrZSByb2J1c3QgaTE4biBzdXBwb3J0IG9yIHNlcnZlci1zaWRlXG4gKiBpbnRlcmFjdGlvbnMuIElmIHlvdXIgYXBwIG5lZWRzIHRvIHN1cHBvcnQgbW9yZSBhZHZhbmNlZCB1c2UgY2FzZXMsIGNvbnNpZGVyIGltcGxlbWVudGluZyB5b3VyXG4gKiBvd24gYERhdGFTb3VyY2VgLlxuICovXG5leHBvcnQgY2xhc3MgTWF0VGFibGVEYXRhU291cmNlPFQ+IGV4dGVuZHMgRGF0YVNvdXJjZTxUPiB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgbmV3IGRhdGEgYXJyYXkgaXMgc2V0IG9uIHRoZSBkYXRhIHNvdXJjZS4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGF0YTogQmVoYXZpb3JTdWJqZWN0PFRbXT47XG5cbiAgLyoqIFN0cmVhbSBlbWl0dGluZyByZW5kZXIgZGF0YSB0byB0aGUgdGFibGUgKGRlcGVuZHMgb24gb3JkZXJlZCBkYXRhIGNoYW5nZXMpLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9yZW5kZXJEYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KFtdKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiBhIG5ldyBmaWx0ZXIgc3RyaW5nIGlzIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2ZpbHRlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPignJyk7XG5cbiAgLyoqIFVzZWQgdG8gcmVhY3QgdG8gaW50ZXJuYWwgY2hhbmdlcyBvZiB0aGUgcGFnaW5hdG9yIHRoYXQgYXJlIG1hZGUgYnkgdGhlIGRhdGEgc291cmNlIGl0c2VsZi4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfaW50ZXJuYWxQYWdlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFN1YnNjcmlwdGlvbiB0byB0aGUgY2hhbmdlcyB0aGF0IHNob3VsZCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCByb3dzLCBzdWNoXG4gICAqIGFzIGZpbHRlcmluZywgc29ydGluZywgcGFnaW5hdGlvbiwgb3IgYmFzZSBkYXRhIGNoYW5nZXMuXG4gICAqL1xuICBfcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogVGhlIGZpbHRlcmVkIHNldCBvZiBkYXRhIHRoYXQgaGFzIGJlZW4gbWF0Y2hlZCBieSB0aGUgZmlsdGVyIHN0cmluZywgb3IgYWxsIHRoZSBkYXRhIGlmIHRoZXJlXG4gICAqIGlzIG5vIGZpbHRlci4gVXNlZnVsIGZvciBrbm93aW5nIHRoZSBzZXQgb2YgZGF0YSB0aGUgdGFibGUgcmVwcmVzZW50cy5cbiAgICogRm9yIGV4YW1wbGUsIGEgJ3NlbGVjdEFsbCgpJyBmdW5jdGlvbiB3b3VsZCBsaWtlbHkgd2FudCB0byBzZWxlY3QgdGhlIHNldCBvZiBmaWx0ZXJlZCBkYXRhXG4gICAqIHNob3duIHRvIHRoZSB1c2VyIHJhdGhlciB0aGFuIGFsbCB0aGUgZGF0YS5cbiAgICovXG4gIGZpbHRlcmVkRGF0YTogVFtdO1xuXG4gIC8qKiBBcnJheSBvZiBkYXRhIHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkIGJ5IHRoZSB0YWJsZSwgd2hlcmUgZWFjaCBvYmplY3QgcmVwcmVzZW50cyBvbmUgcm93LiAqL1xuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWU7IH1cbiAgc2V0IGRhdGEoZGF0YTogVFtdKSB7IHRoaXMuX2RhdGEubmV4dChkYXRhKTsgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXIgdGVybSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGZpbHRlciBvdXQgb2JqZWN0cyBmcm9tIHRoZSBkYXRhIGFycmF5LiBUbyBvdmVycmlkZSBob3dcbiAgICogZGF0YSBvYmplY3RzIG1hdGNoIHRvIHRoaXMgZmlsdGVyIHN0cmluZywgcHJvdmlkZSBhIGN1c3RvbSBmdW5jdGlvbiBmb3IgZmlsdGVyUHJlZGljYXRlLlxuICAgKi9cbiAgZ2V0IGZpbHRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyLnZhbHVlOyB9XG4gIHNldCBmaWx0ZXIoZmlsdGVyOiBzdHJpbmcpIHsgdGhpcy5fZmlsdGVyLm5leHQoZmlsdGVyKTsgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiB0aGUgTWF0U29ydCBkaXJlY3RpdmUgdXNlZCBieSB0aGUgdGFibGUgdG8gY29udHJvbCBpdHMgc29ydGluZy4gU29ydCBjaGFuZ2VzXG4gICAqIGVtaXR0ZWQgYnkgdGhlIE1hdFNvcnQgd2lsbCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCBkYXRhLlxuICAgKi9cbiAgZ2V0IHNvcnQoKTogTWF0U29ydCB8IG51bGwgeyByZXR1cm4gdGhpcy5fc29ydDsgfVxuICBzZXQgc29ydChzb3J0OiBNYXRTb3J0fG51bGwpIHtcbiAgICB0aGlzLl9zb3J0ID0gc29ydDtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuICBwcml2YXRlIF9zb3J0OiBNYXRTb3J0fG51bGw7XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIHRoZSBNYXRQYWdpbmF0b3IgY29tcG9uZW50IHVzZWQgYnkgdGhlIHRhYmxlIHRvIGNvbnRyb2wgd2hhdCBwYWdlIG9mIHRoZSBkYXRhIGlzXG4gICAqIGRpc3BsYXllZC4gUGFnZSBjaGFuZ2VzIGVtaXR0ZWQgYnkgdGhlIE1hdFBhZ2luYXRvciB3aWxsIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZVxuICAgKiB0YWJsZSdzIHJlbmRlcmVkIGRhdGEuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgZGF0YSBzb3VyY2UgdXNlcyB0aGUgcGFnaW5hdG9yJ3MgcHJvcGVydGllcyB0byBjYWxjdWxhdGUgd2hpY2ggcGFnZSBvZiBkYXRhXG4gICAqIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIHRoZSBwYWdpbmF0b3IgcmVjZWl2ZXMgaXRzIHByb3BlcnRpZXMgYXMgdGVtcGxhdGUgaW5wdXRzLFxuICAgKiBlLmcuIGBbcGFnZUxlbmd0aF09MTAwYCBvciBgW3BhZ2VJbmRleF09MWAsIHRoZW4gYmUgc3VyZSB0aGF0IHRoZSBwYWdpbmF0b3IncyB2aWV3IGhhcyBiZWVuXG4gICAqIGluaXRpYWxpemVkIGJlZm9yZSBhc3NpZ25pbmcgaXQgdG8gdGhpcyBkYXRhIHNvdXJjZS5cbiAgICovXG4gIGdldCBwYWdpbmF0b3IoKTogTWF0UGFnaW5hdG9yIHwgbnVsbCB7IHJldHVybiB0aGlzLl9wYWdpbmF0b3I7IH1cbiAgc2V0IHBhZ2luYXRvcihwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcnxudWxsKSB7XG4gICAgdGhpcy5fcGFnaW5hdG9yID0gcGFnaW5hdG9yO1xuICAgIHRoaXMuX3VwZGF0ZUNoYW5nZVN1YnNjcmlwdGlvbigpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2luYXRvcjogTWF0UGFnaW5hdG9yfG51bGw7XG5cbiAgLyoqXG4gICAqIERhdGEgYWNjZXNzb3IgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGZvciBhY2Nlc3NpbmcgZGF0YSBwcm9wZXJ0aWVzIGZvciBzb3J0aW5nIHRocm91Z2hcbiAgICogdGhlIGRlZmF1bHQgc29ydERhdGEgZnVuY3Rpb24uXG4gICAqIFRoaXMgZGVmYXVsdCBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIHNvcnQgaGVhZGVyIElEcyAod2hpY2ggZGVmYXVsdHMgdG8gdGhlIGNvbHVtbiBuYW1lKVxuICAgKiBtYXRjaGVzIHRoZSBkYXRhJ3MgcHJvcGVydGllcyAoZS5nLiBjb2x1bW4gWHl6IHJlcHJlc2VudHMgZGF0YVsnWHl6J10pLlxuICAgKiBNYXkgYmUgc2V0IHRvIGEgY3VzdG9tIGZ1bmN0aW9uIGZvciBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgb2JqZWN0IHRoYXQgaXMgYmVpbmcgYWNjZXNzZWQuXG4gICAqIEBwYXJhbSBzb3J0SGVhZGVySWQgVGhlIG5hbWUgb2YgdGhlIGNvbHVtbiB0aGF0IHJlcHJlc2VudHMgdGhlIGRhdGEuXG4gICAqL1xuICBzb3J0aW5nRGF0YUFjY2Vzc29yOiAoKGRhdGE6IFQsIHNvcnRIZWFkZXJJZDogc3RyaW5nKSA9PiBzdHJpbmd8bnVtYmVyKSA9XG4gICAgICAoZGF0YTogVCwgc29ydEhlYWRlcklkOiBzdHJpbmcpOiBzdHJpbmd8bnVtYmVyID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IChkYXRhIGFzIHtba2V5OiBzdHJpbmddOiBhbnl9KVtzb3J0SGVhZGVySWRdO1xuXG4gICAgaWYgKF9pc051bWJlclZhbHVlKHZhbHVlKSkge1xuICAgICAgY29uc3QgbnVtYmVyVmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuXG4gICAgICAvLyBOdW1iZXJzIGJleW9uZCBgTUFYX1NBRkVfSU5URUdFUmAgY2FuJ3QgYmUgY29tcGFyZWQgcmVsaWFibHkgc28gd2VcbiAgICAgIC8vIGxlYXZlIHRoZW0gYXMgc3RyaW5ncy4gRm9yIG1vcmUgaW5mbzogaHR0cHM6Ly9nb28uZ2wveTV2YlNnXG4gICAgICByZXR1cm4gbnVtYmVyVmFsdWUgPCBNQVhfU0FGRV9JTlRFR0VSID8gbnVtYmVyVmFsdWUgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhIGFycmF5IGJhc2VkIG9uIHRoZSBzdGF0ZSBvZiB0aGUgTWF0U29ydC4gQ2FsbGVkXG4gICAqIGFmdGVyIGNoYW5nZXMgYXJlIG1hZGUgdG8gdGhlIGZpbHRlcmVkIGRhdGEgb3Igd2hlbiBzb3J0IGNoYW5nZXMgYXJlIGVtaXR0ZWQgZnJvbSBNYXRTb3J0LlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgZnVuY3Rpb24gcmV0cmlldmVzIHRoZSBhY3RpdmUgc29ydCBhbmQgaXRzIGRpcmVjdGlvbiBhbmQgY29tcGFyZXMgZGF0YVxuICAgKiBieSByZXRyaWV2aW5nIGRhdGEgdXNpbmcgdGhlIHNvcnRpbmdEYXRhQWNjZXNzb3IuIE1heSBiZSBvdmVycmlkZGVuIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgKiBvZiBkYXRhIG9yZGVyaW5nLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgYXJyYXkgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSBzb3J0ZWQuXG4gICAqIEBwYXJhbSBzb3J0IFRoZSBjb25uZWN0ZWQgTWF0U29ydCB0aGF0IGhvbGRzIHRoZSBjdXJyZW50IHNvcnQgc3RhdGUuXG4gICAqL1xuICBzb3J0RGF0YTogKChkYXRhOiBUW10sIHNvcnQ6IE1hdFNvcnQpID0+IFRbXSkgPSAoZGF0YTogVFtdLCBzb3J0OiBNYXRTb3J0KTogVFtdID0+IHtcbiAgICBjb25zdCBhY3RpdmUgPSBzb3J0LmFjdGl2ZTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBzb3J0LmRpcmVjdGlvbjtcbiAgICBpZiAoIWFjdGl2ZSB8fCBkaXJlY3Rpb24gPT0gJycpIHsgcmV0dXJuIGRhdGE7IH1cblxuICAgIHJldHVybiBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGxldCB2YWx1ZUEgPSB0aGlzLnNvcnRpbmdEYXRhQWNjZXNzb3IoYSwgYWN0aXZlKTtcbiAgICAgIGxldCB2YWx1ZUIgPSB0aGlzLnNvcnRpbmdEYXRhQWNjZXNzb3IoYiwgYWN0aXZlKTtcblxuICAgICAgLy8gSWYgYm90aCB2YWx1ZUEgYW5kIHZhbHVlQiBleGlzdCAodHJ1dGh5KSwgdGhlbiBjb21wYXJlIHRoZSB0d28uIE90aGVyd2lzZSwgY2hlY2sgaWZcbiAgICAgIC8vIG9uZSB2YWx1ZSBleGlzdHMgd2hpbGUgdGhlIG90aGVyIGRvZXNuJ3QuIEluIHRoaXMgY2FzZSwgZXhpc3RpbmcgdmFsdWUgc2hvdWxkIGNvbWUgbGFzdC5cbiAgICAgIC8vIFRoaXMgYXZvaWRzIGluY29uc2lzdGVudCByZXN1bHRzIHdoZW4gY29tcGFyaW5nIHZhbHVlcyB0byB1bmRlZmluZWQvbnVsbC5cbiAgICAgIC8vIElmIG5laXRoZXIgdmFsdWUgZXhpc3RzLCByZXR1cm4gMCAoZXF1YWwpLlxuICAgICAgbGV0IGNvbXBhcmF0b3JSZXN1bHQgPSAwO1xuICAgICAgaWYgKHZhbHVlQSAhPSBudWxsICYmIHZhbHVlQiAhPSBudWxsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG9uZSB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gdGhlIG90aGVyOyBpZiBlcXVhbCwgY29tcGFyYXRvclJlc3VsdCBzaG91bGQgcmVtYWluIDAuXG4gICAgICAgIGlmICh2YWx1ZUEgPiB2YWx1ZUIpIHtcbiAgICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZUEgPCB2YWx1ZUIpIHtcbiAgICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gLTE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodmFsdWVBICE9IG51bGwpIHtcbiAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlQiAhPSBudWxsKSB7XG4gICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbXBhcmF0b3JSZXN1bHQgKiAoZGlyZWN0aW9uID09ICdhc2MnID8gMSA6IC0xKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBkYXRhIG9iamVjdCBtYXRjaGVzIHRoZSBkYXRhIHNvdXJjZSdzIGZpbHRlciBzdHJpbmcuIEJ5IGRlZmF1bHQsIGVhY2ggZGF0YSBvYmplY3RcbiAgICogaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIG9mIGl0cyBwcm9wZXJ0aWVzIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGZpbHRlciBoYXNcbiAgICogYXQgbGVhc3Qgb25lIG9jY3VycmVuY2UgaW4gdGhhdCBzdHJpbmcuIEJ5IGRlZmF1bHQsIHRoZSBmaWx0ZXIgc3RyaW5nIGhhcyBpdHMgd2hpdGVzcGFjZVxuICAgKiB0cmltbWVkIGFuZCB0aGUgbWF0Y2ggaXMgY2FzZS1pbnNlbnNpdGl2ZS4gTWF5IGJlIG92ZXJyaWRkZW4gZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uIG9mXG4gICAqIGZpbHRlciBtYXRjaGluZy5cbiAgICogQHBhcmFtIGRhdGEgRGF0YSBvYmplY3QgdXNlZCB0byBjaGVjayBhZ2FpbnN0IHRoZSBmaWx0ZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgRmlsdGVyIHN0cmluZyB0aGF0IGhhcyBiZWVuIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGZpbHRlciBtYXRjaGVzIGFnYWluc3QgdGhlIGRhdGFcbiAgICovXG4gIGZpbHRlclByZWRpY2F0ZTogKChkYXRhOiBULCBmaWx0ZXI6IHN0cmluZykgPT4gYm9vbGVhbikgPSAoZGF0YTogVCwgZmlsdGVyOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGRhdGEgaW50byBhIGxvd2VyY2FzZSBzdHJpbmcgb2YgYWxsIHByb3BlcnR5IHZhbHVlcy5cbiAgICBjb25zdCBkYXRhU3RyID0gT2JqZWN0LmtleXMoZGF0YSkucmVkdWNlKChjdXJyZW50VGVybTogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgLy8gVXNlIGFuIG9ic2N1cmUgVW5pY29kZSBjaGFyYWN0ZXIgdG8gZGVsaW1pdCB0aGUgd29yZHMgaW4gdGhlIGNvbmNhdGVuYXRlZCBzdHJpbmcuXG4gICAgICAvLyBUaGlzIGF2b2lkcyBtYXRjaGVzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgdHdvIGNvbHVtbnMgY29tYmluZWQgd2lsbCBtYXRjaCB0aGUgdXNlcidzIHF1ZXJ5XG4gICAgICAvLyAoZS5nLiBgRmx1dGVgIGFuZCBgU3RvcGAgd2lsbCBtYXRjaCBgVGVzdGApLiBUaGUgY2hhcmFjdGVyIGlzIGludGVuZGVkIHRvIGJlIHNvbWV0aGluZ1xuICAgICAgLy8gdGhhdCBoYXMgYSB2ZXJ5IGxvdyBjaGFuY2Ugb2YgYmVpbmcgdHlwZWQgaW4gYnkgc29tZWJvZHkgaW4gYSB0ZXh0IGZpZWxkLiBUaGlzIG9uZSBpblxuICAgICAgLy8gcGFydGljdWxhciBpcyBcIldoaXRlIHVwLXBvaW50aW5nIHRyaWFuZ2xlIHdpdGggZG90XCIgZnJvbVxuICAgICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9Vbmljb2RlX2NoYXJhY3RlcnNcbiAgICAgIHJldHVybiBjdXJyZW50VGVybSArIChkYXRhIGFzIHtba2V5OiBzdHJpbmddOiBhbnl9KVtrZXldICsgJ+KXrCc7XG4gICAgfSwgJycpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGZpbHRlciBieSBjb252ZXJ0aW5nIGl0IHRvIGxvd2VyY2FzZSBhbmQgcmVtb3Zpbmcgd2hpdGVzcGFjZS5cbiAgICBjb25zdCB0cmFuc2Zvcm1lZEZpbHRlciA9IGZpbHRlci50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiBkYXRhU3RyLmluZGV4T2YodHJhbnNmb3JtZWRGaWx0ZXIpICE9IC0xO1xuICB9XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbERhdGE6IFRbXSA9IFtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KGluaXRpYWxEYXRhKTtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gY2hhbmdlcyB0aGF0IHNob3VsZCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCByb3dzLiBXaGVuIHRoZVxuICAgKiBjaGFuZ2VzIG9jY3VyLCBwcm9jZXNzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBmaWx0ZXIsIHNvcnQsIGFuZCBwYWdpbmF0aW9uIGFsb25nIHdpdGhcbiAgICogdGhlIHByb3ZpZGVkIGJhc2UgZGF0YSBhbmQgc2VuZCBpdCB0byB0aGUgdGFibGUgZm9yIHJlbmRlcmluZy5cbiAgICovXG4gIF91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKSB7XG4gICAgLy8gU29ydGluZyBhbmQvb3IgcGFnaW5hdGlvbiBzaG91bGQgYmUgd2F0Y2hlZCBpZiBNYXRTb3J0IGFuZC9vciBNYXRQYWdpbmF0b3IgYXJlIHByb3ZpZGVkLlxuICAgIC8vIFRoZSBldmVudHMgc2hvdWxkIGVtaXQgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBlbWl0cyBhIGNoYW5nZSBvciBpbml0aWFsaXplcywgb3IgaWYgbm9cbiAgICAvLyBjb21wb25lbnQgaXMgcHJvdmlkZWQsIGEgc3RyZWFtIHdpdGgganVzdCBhIG51bGwgZXZlbnQgc2hvdWxkIGJlIHByb3ZpZGVkLlxuICAgIC8vIFRoZSBgc29ydENoYW5nZWAgYW5kIGBwYWdlQ2hhbmdlYCBhY3RzIGFzIGEgc2lnbmFsIHRvIHRoZSBjb21iaW5lTGF0ZXN0cyBiZWxvdyBzbyB0aGF0IHRoZVxuICAgIC8vIHBpcGVsaW5lIGNhbiBwcm9ncmVzcyB0byB0aGUgbmV4dCBzdGVwLiBOb3RlIHRoYXQgdGhlIHZhbHVlIGZyb20gdGhlc2Ugc3RyZWFtcyBhcmUgbm90IHVzZWQsXG4gICAgLy8gdGhleSBwdXJlbHkgYWN0IGFzIGEgc2lnbmFsIHRvIHByb2dyZXNzIGluIHRoZSBwaXBlbGluZS5cbiAgICBjb25zdCBzb3J0Q2hhbmdlOiBPYnNlcnZhYmxlPFNvcnR8bnVsbHx2b2lkPiA9IHRoaXMuX3NvcnQgP1xuICAgICAgICBtZXJnZSh0aGlzLl9zb3J0LnNvcnRDaGFuZ2UsIHRoaXMuX3NvcnQuaW5pdGlhbGl6ZWQpIGFzIE9ic2VydmFibGU8U29ydHx2b2lkPiA6XG4gICAgICAgIG9ic2VydmFibGVPZihudWxsKTtcbiAgICBjb25zdCBwYWdlQ2hhbmdlOiBPYnNlcnZhYmxlPFBhZ2VFdmVudHxudWxsfHZvaWQ+ID0gdGhpcy5fcGFnaW5hdG9yID9cbiAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgdGhpcy5fcGFnaW5hdG9yLnBhZ2UsXG4gICAgICAgICAgdGhpcy5faW50ZXJuYWxQYWdlQ2hhbmdlcyxcbiAgICAgICAgICB0aGlzLl9wYWdpbmF0b3IuaW5pdGlhbGl6ZWRcbiAgICAgICAgKSBhcyBPYnNlcnZhYmxlPFBhZ2VFdmVudHx2b2lkPiA6XG4gICAgICAgIG9ic2VydmFibGVPZihudWxsKTtcbiAgICBjb25zdCBkYXRhU3RyZWFtID0gdGhpcy5fZGF0YTtcbiAgICAvLyBXYXRjaCBmb3IgYmFzZSBkYXRhIG9yIGZpbHRlciBjaGFuZ2VzIHRvIHByb3ZpZGUgYSBmaWx0ZXJlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSBjb21iaW5lTGF0ZXN0KFtkYXRhU3RyZWFtLCB0aGlzLl9maWx0ZXJdKVxuICAgICAgLnBpcGUobWFwKChbZGF0YV0pID0+IHRoaXMuX2ZpbHRlckRhdGEoZGF0YSkpKTtcbiAgICAvLyBXYXRjaCBmb3IgZmlsdGVyZWQgZGF0YSBvciBzb3J0IGNoYW5nZXMgdG8gcHJvdmlkZSBhbiBvcmRlcmVkIHNldCBvZiBkYXRhLlxuICAgIGNvbnN0IG9yZGVyZWREYXRhID0gY29tYmluZUxhdGVzdChbZmlsdGVyZWREYXRhLCBzb3J0Q2hhbmdlXSlcbiAgICAgIC5waXBlKG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9vcmRlckRhdGEoZGF0YSkpKTtcbiAgICAvLyBXYXRjaCBmb3Igb3JkZXJlZCBkYXRhIG9yIHBhZ2UgY2hhbmdlcyB0byBwcm92aWRlIGEgcGFnZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3QgcGFnaW5hdGVkRGF0YSA9IGNvbWJpbmVMYXRlc3QoW29yZGVyZWREYXRhLCBwYWdlQ2hhbmdlXSlcbiAgICAgIC5waXBlKG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9wYWdlRGF0YShkYXRhKSkpO1xuICAgIC8vIFdhdGNoZWQgZm9yIHBhZ2VkIGRhdGEgY2hhbmdlcyBhbmQgc2VuZCB0aGUgcmVzdWx0IHRvIHRoZSB0YWJsZSB0byByZW5kZXIuXG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24gPSBwYWdpbmF0ZWREYXRhLnN1YnNjcmliZShkYXRhID0+IHRoaXMuX3JlbmRlckRhdGEubmV4dChkYXRhKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGZpbHRlcmVkIGRhdGEgYXJyYXkgd2hlcmUgZWFjaCBmaWx0ZXIgb2JqZWN0IGNvbnRhaW5zIHRoZSBmaWx0ZXIgc3RyaW5nIHdpdGhpblxuICAgKiB0aGUgcmVzdWx0IG9mIHRoZSBmaWx0ZXJUZXJtQWNjZXNzb3IgZnVuY3Rpb24uIElmIG5vIGZpbHRlciBpcyBzZXQsIHJldHVybnMgdGhlIGRhdGEgYXJyYXlcbiAgICogYXMgcHJvdmlkZWQuXG4gICAqL1xuICBfZmlsdGVyRGF0YShkYXRhOiBUW10pIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBhIGZpbHRlciBzdHJpbmcsIGZpbHRlciBvdXQgZGF0YSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gaXQuXG4gICAgLy8gRWFjaCBkYXRhIG9iamVjdCBpcyBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgdXNpbmcgdGhlIGZ1bmN0aW9uIGRlZmluZWQgYnkgZmlsdGVyVGVybUFjY2Vzc29yLlxuICAgIC8vIE1heSBiZSBvdmVycmlkZGVuIGZvciBjdXN0b21pemF0aW9uLlxuICAgIHRoaXMuZmlsdGVyZWREYXRhID1cbiAgICAgICAgIXRoaXMuZmlsdGVyID8gZGF0YSA6IGRhdGEuZmlsdGVyKG9iaiA9PiB0aGlzLmZpbHRlclByZWRpY2F0ZShvYmosIHRoaXMuZmlsdGVyKSk7XG5cbiAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHsgdGhpcy5fdXBkYXRlUGFnaW5hdG9yKHRoaXMuZmlsdGVyZWREYXRhLmxlbmd0aCk7IH1cblxuICAgIHJldHVybiB0aGlzLmZpbHRlcmVkRGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc29ydGVkIGNvcHkgb2YgdGhlIGRhdGEgaWYgTWF0U29ydCBoYXMgYSBzb3J0IGFwcGxpZWQsIG90aGVyd2lzZSBqdXN0IHJldHVybnMgdGhlXG4gICAqIGRhdGEgYXJyYXkgYXMgcHJvdmlkZWQuIFVzZXMgdGhlIGRlZmF1bHQgZGF0YSBhY2Nlc3NvciBmb3IgZGF0YSBsb29rdXAsIHVubGVzcyBhXG4gICAqIHNvcnREYXRhQWNjZXNzb3IgZnVuY3Rpb24gaXMgZGVmaW5lZC5cbiAgICovXG4gIF9vcmRlckRhdGEoZGF0YTogVFtdKTogVFtdIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBhY3RpdmUgc29ydCBvciBkaXJlY3Rpb24sIHJldHVybiB0aGUgZGF0YSB3aXRob3V0IHRyeWluZyB0byBzb3J0LlxuICAgIGlmICghdGhpcy5zb3J0KSB7IHJldHVybiBkYXRhOyB9XG5cbiAgICByZXR1cm4gdGhpcy5zb3J0RGF0YShkYXRhLnNsaWNlKCksIHRoaXMuc29ydCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHBhZ2VkIHNsaWNlIG9mIHRoZSBwcm92aWRlZCBkYXRhIGFycmF5IGFjY29yZGluZyB0byB0aGUgcHJvdmlkZWQgTWF0UGFnaW5hdG9yJ3MgcGFnZVxuICAgKiBpbmRleCBhbmQgbGVuZ3RoLiBJZiB0aGVyZSBpcyBubyBwYWdpbmF0b3IgcHJvdmlkZWQsIHJldHVybnMgdGhlIGRhdGEgYXJyYXkgYXMgcHJvdmlkZWQuXG4gICAqL1xuICBfcGFnZURhdGEoZGF0YTogVFtdKTogVFtdIHtcbiAgICBpZiAoIXRoaXMucGFnaW5hdG9yKSB7IHJldHVybiBkYXRhOyB9XG5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5wYWdpbmF0b3IucGFnZUluZGV4ICogdGhpcy5wYWdpbmF0b3IucGFnZVNpemU7XG4gICAgcmV0dXJuIGRhdGEuc2xpY2Uoc3RhcnRJbmRleCwgc3RhcnRJbmRleCArIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwYWdpbmF0b3IgdG8gcmVmbGVjdCB0aGUgbGVuZ3RoIG9mIHRoZSBmaWx0ZXJlZCBkYXRhLCBhbmQgbWFrZXMgc3VyZSB0aGF0IHRoZSBwYWdlXG4gICAqIGluZGV4IGRvZXMgbm90IGV4Y2VlZCB0aGUgcGFnaW5hdG9yJ3MgbGFzdCBwYWdlLiBWYWx1ZXMgYXJlIGNoYW5nZWQgaW4gYSByZXNvbHZlZCBwcm9taXNlIHRvXG4gICAqIGd1YXJkIGFnYWluc3QgbWFraW5nIHByb3BlcnR5IGNoYW5nZXMgd2l0aGluIGEgcm91bmQgb2YgY2hhbmdlIGRldGVjdGlvbi5cbiAgICovXG4gIF91cGRhdGVQYWdpbmF0b3IoZmlsdGVyZWREYXRhTGVuZ3RoOiBudW1iZXIpIHtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHRoaXMucGFnaW5hdG9yO1xuXG4gICAgICBpZiAoIXBhZ2luYXRvcikgeyByZXR1cm47IH1cblxuICAgICAgcGFnaW5hdG9yLmxlbmd0aCA9IGZpbHRlcmVkRGF0YUxlbmd0aDtcblxuICAgICAgLy8gSWYgdGhlIHBhZ2UgaW5kZXggaXMgc2V0IGJleW9uZCB0aGUgcGFnZSwgcmVkdWNlIGl0IHRvIHRoZSBsYXN0IHBhZ2UuXG4gICAgICBpZiAocGFnaW5hdG9yLnBhZ2VJbmRleCA+IDApIHtcbiAgICAgICAgY29uc3QgbGFzdFBhZ2VJbmRleCA9IE1hdGguY2VpbChwYWdpbmF0b3IubGVuZ3RoIC8gcGFnaW5hdG9yLnBhZ2VTaXplKSAtIDEgfHwgMDtcbiAgICAgICAgY29uc3QgbmV3UGFnZUluZGV4ID0gTWF0aC5taW4ocGFnaW5hdG9yLnBhZ2VJbmRleCwgbGFzdFBhZ2VJbmRleCk7XG5cbiAgICAgICAgaWYgKG5ld1BhZ2VJbmRleCAhPT0gcGFnaW5hdG9yLnBhZ2VJbmRleCkge1xuICAgICAgICAgIHBhZ2luYXRvci5wYWdlSW5kZXggPSBuZXdQYWdlSW5kZXg7XG5cbiAgICAgICAgICAvLyBTaW5jZSB0aGUgcGFnaW5hdG9yIG9ubHkgZW1pdHMgYWZ0ZXIgdXNlci1nZW5lcmF0ZWQgY2hhbmdlcyxcbiAgICAgICAgICAvLyB3ZSBuZWVkIG91ciBvd24gc3RyZWFtIHNvIHdlIGtub3cgdG8gc2hvdWxkIHJlLXJlbmRlciB0aGUgZGF0YS5cbiAgICAgICAgICB0aGlzLl9pbnRlcm5hbFBhZ2VDaGFuZ2VzLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIE1hdFRhYmxlLiBDYWxsZWQgd2hlbiBpdCBjb25uZWN0cyB0byB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoKSB7IHJldHVybiB0aGlzLl9yZW5kZXJEYXRhOyB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIE1hdFRhYmxlLiBDYWxsZWQgd2hlbiBpdCBpcyBkZXN0cm95ZWQuIE5vLW9wLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBkaXNjb25uZWN0KCkgeyB9XG59XG4iXX0=