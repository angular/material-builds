/**
 * @fileoverview added by tsickle
 * Generated from: src/material/table/table-data-source.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYixLQUFLLEVBRUwsRUFBRSxJQUFJLFlBQVksRUFDbEIsWUFBWSxFQUNaLE9BQU8sR0FDUixNQUFNLE1BQU0sQ0FBQztBQUdkLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O01BTTdCLGdCQUFnQixHQUFHLGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7O0FBZXpDLE1BQU0sT0FBTyxrQkFBc0IsU0FBUSxVQUFhOzs7O0lBOEp0RCxZQUFZLGNBQW1CLEVBQUU7UUFDL0IsS0FBSyxFQUFFLENBQUM7Ozs7UUExSk8sZ0JBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBTSxFQUFFLENBQUMsQ0FBQzs7OztRQUczQyxZQUFPLEdBQUcsSUFBSSxlQUFlLENBQVMsRUFBRSxDQUFDLENBQUM7Ozs7UUFHMUMseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7Ozs7UUFNNUQsK0JBQTBCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQzs7Ozs7Ozs7OztRQTBEaEQsd0JBQW1COzs7OztRQUNmLENBQUMsSUFBTyxFQUFFLFlBQW9CLEVBQWlCLEVBQUU7O2tCQUM3QyxLQUFLLEdBQUcsQ0FBQyxtQkFBQSxJQUFJLEVBQXdCLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFFMUQsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7O3NCQUNuQixXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztn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QUNyQixhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQzs7c0JBQ3pFLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO2dCQUVqRSxJQUFJLFlBQVksS0FBSyxTQUFTLENBQUMsU0FBUyxFQUFFO29CQUN4QyxTQUFTLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztvQkFFbkMsK0RBQStEO29CQUMvRCxrRUFBa0U7b0JBQ2xFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEM7YUFDRjtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7O0lBTUQsT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Ozs7OztJQU10QyxVQUFVLEtBQUssQ0FBQztDQUNqQjs7Ozs7OztJQXZSQyxtQ0FBNkM7Ozs7OztJQUc3Qyx5Q0FBNEQ7Ozs7OztJQUc1RCxxQ0FBMkQ7Ozs7OztJQUczRCxrREFBNEQ7Ozs7OztJQU01RCx3REFBZ0Q7Ozs7Ozs7O0lBUWhELDBDQUFrQjs7Ozs7SUFzQmxCLG1DQUE0Qjs7Ozs7SUFpQjVCLHdDQUFzQzs7Ozs7Ozs7Ozs7SUFXdEMsaURBYUM7Ozs7Ozs7Ozs7O0lBV0Qsc0NBNkJDOzs7Ozs7Ozs7Ozs7SUFZRCw2Q0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtfaXNOdW1iZXJWYWx1ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGF0YVNvdXJjZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7XG4gIEJlaGF2aW9yU3ViamVjdCxcbiAgY29tYmluZUxhdGVzdCxcbiAgbWVyZ2UsXG4gIE9ic2VydmFibGUsXG4gIG9mIGFzIG9ic2VydmFibGVPZixcbiAgU3Vic2NyaXB0aW9uLFxuICBTdWJqZWN0LFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0UGFnaW5hdG9yLCBQYWdlRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3BhZ2luYXRvcic7XG5pbXBvcnQge01hdFNvcnQsIFNvcnR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBDb3JyZXNwb25kcyB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLiBNb3ZlZCBvdXQgaW50byBhIHZhcmlhYmxlIGhlcmUgZHVlIHRvXG4gKiBmbGFreSBicm93c2VyIHN1cHBvcnQgYW5kIHRoZSB2YWx1ZSBub3QgYmVpbmcgZGVmaW5lZCBpbiBDbG9zdXJlJ3MgdHlwaW5ncy5cbiAqL1xuY29uc3QgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogRGF0YSBzb3VyY2UgdGhhdCBhY2NlcHRzIGEgY2xpZW50LXNpZGUgZGF0YSBhcnJheSBhbmQgaW5jbHVkZXMgbmF0aXZlIHN1cHBvcnQgb2YgZmlsdGVyaW5nLFxuICogc29ydGluZyAodXNpbmcgTWF0U29ydCksIGFuZCBwYWdpbmF0aW9uICh1c2luZyBNYXRQYWdpbmF0b3IpLlxuICpcbiAqIEFsbG93cyBmb3Igc29ydCBjdXN0b21pemF0aW9uIGJ5IG92ZXJyaWRpbmcgc29ydGluZ0RhdGFBY2Nlc3Nvciwgd2hpY2ggZGVmaW5lcyBob3cgZGF0YVxuICogcHJvcGVydGllcyBhcmUgYWNjZXNzZWQuIEFsc28gYWxsb3dzIGZvciBmaWx0ZXIgY3VzdG9taXphdGlvbiBieSBvdmVycmlkaW5nIGZpbHRlclRlcm1BY2Nlc3NvcixcbiAqIHdoaWNoIGRlZmluZXMgaG93IHJvdyBkYXRhIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBmb3IgZmlsdGVyIG1hdGNoaW5nLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGNsYXNzIGlzIG1lYW50IHRvIGJlIGEgc2ltcGxlIGRhdGEgc291cmNlIHRvIGhlbHAgeW91IGdldCBzdGFydGVkLiBBcyBzdWNoXG4gKiBpdCBpc24ndCBlcXVpcHBlZCB0byBoYW5kbGUgc29tZSBtb3JlIGFkdmFuY2VkIGNhc2VzIGxpa2Ugcm9idXN0IGkxOG4gc3VwcG9ydCBvciBzZXJ2ZXItc2lkZVxuICogaW50ZXJhY3Rpb25zLiBJZiB5b3VyIGFwcCBuZWVkcyB0byBzdXBwb3J0IG1vcmUgYWR2YW5jZWQgdXNlIGNhc2VzLCBjb25zaWRlciBpbXBsZW1lbnRpbmcgeW91clxuICogb3duIGBEYXRhU291cmNlYC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYmxlRGF0YVNvdXJjZTxUPiBleHRlbmRzIERhdGFTb3VyY2U8VD4ge1xuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiBhIG5ldyBkYXRhIGFycmF5IGlzIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2RhdGE6IEJlaGF2aW9yU3ViamVjdDxUW10+O1xuXG4gIC8qKiBTdHJlYW0gZW1pdHRpbmcgcmVuZGVyIGRhdGEgdG8gdGhlIHRhYmxlIChkZXBlbmRzIG9uIG9yZGVyZWQgZGF0YSBjaGFuZ2VzKS4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfcmVuZGVyRGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihbXSk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBuZXcgZmlsdGVyIHN0cmluZyBpcyBzZXQgb24gdGhlIGRhdGEgc291cmNlLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9maWx0ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4oJycpO1xuXG4gIC8qKiBVc2VkIHRvIHJlYWN0IHRvIGludGVybmFsIGNoYW5nZXMgb2YgdGhlIHBhZ2luYXRvciB0aGF0IGFyZSBtYWRlIGJ5IHRoZSBkYXRhIHNvdXJjZSBpdHNlbGYuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2ludGVybmFsUGFnZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpcHRpb24gdG8gdGhlIGNoYW5nZXMgdGhhdCBzaG91bGQgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlIHRhYmxlJ3MgcmVuZGVyZWQgcm93cywgc3VjaFxuICAgKiBhcyBmaWx0ZXJpbmcsIHNvcnRpbmcsIHBhZ2luYXRpb24sIG9yIGJhc2UgZGF0YSBjaGFuZ2VzLlxuICAgKi9cbiAgX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIFRoZSBmaWx0ZXJlZCBzZXQgb2YgZGF0YSB0aGF0IGhhcyBiZWVuIG1hdGNoZWQgYnkgdGhlIGZpbHRlciBzdHJpbmcsIG9yIGFsbCB0aGUgZGF0YSBpZiB0aGVyZVxuICAgKiBpcyBubyBmaWx0ZXIuIFVzZWZ1bCBmb3Iga25vd2luZyB0aGUgc2V0IG9mIGRhdGEgdGhlIHRhYmxlIHJlcHJlc2VudHMuXG4gICAqIEZvciBleGFtcGxlLCBhICdzZWxlY3RBbGwoKScgZnVuY3Rpb24gd291bGQgbGlrZWx5IHdhbnQgdG8gc2VsZWN0IHRoZSBzZXQgb2YgZmlsdGVyZWQgZGF0YVxuICAgKiBzaG93biB0byB0aGUgdXNlciByYXRoZXIgdGhhbiBhbGwgdGhlIGRhdGEuXG4gICAqL1xuICBmaWx0ZXJlZERhdGE6IFRbXTtcblxuICAvKiogQXJyYXkgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSByZW5kZXJlZCBieSB0aGUgdGFibGUsIHdoZXJlIGVhY2ggb2JqZWN0IHJlcHJlc2VudHMgb25lIHJvdy4gKi9cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhLnZhbHVlOyB9XG4gIHNldCBkYXRhKGRhdGE6IFRbXSkgeyB0aGlzLl9kYXRhLm5leHQoZGF0YSk7IH1cblxuICAvKipcbiAgICogRmlsdGVyIHRlcm0gdGhhdCBzaG91bGQgYmUgdXNlZCB0byBmaWx0ZXIgb3V0IG9iamVjdHMgZnJvbSB0aGUgZGF0YSBhcnJheS4gVG8gb3ZlcnJpZGUgaG93XG4gICAqIGRhdGEgb2JqZWN0cyBtYXRjaCB0byB0aGlzIGZpbHRlciBzdHJpbmcsIHByb3ZpZGUgYSBjdXN0b20gZnVuY3Rpb24gZm9yIGZpbHRlclByZWRpY2F0ZS5cbiAgICovXG4gIGdldCBmaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlci52YWx1ZTsgfVxuICBzZXQgZmlsdGVyKGZpbHRlcjogc3RyaW5nKSB7IHRoaXMuX2ZpbHRlci5uZXh0KGZpbHRlcik7IH1cblxuICAvKipcbiAgICogSW5zdGFuY2Ugb2YgdGhlIE1hdFNvcnQgZGlyZWN0aXZlIHVzZWQgYnkgdGhlIHRhYmxlIHRvIGNvbnRyb2wgaXRzIHNvcnRpbmcuIFNvcnQgY2hhbmdlc1xuICAgKiBlbWl0dGVkIGJ5IHRoZSBNYXRTb3J0IHdpbGwgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlIHRhYmxlJ3MgcmVuZGVyZWQgZGF0YS5cbiAgICovXG4gIGdldCBzb3J0KCk6IE1hdFNvcnQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX3NvcnQ7IH1cbiAgc2V0IHNvcnQoc29ydDogTWF0U29ydHxudWxsKSB7XG4gICAgdGhpcy5fc29ydCA9IHNvcnQ7XG4gICAgdGhpcy5fdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCk7XG4gIH1cbiAgcHJpdmF0ZSBfc29ydDogTWF0U29ydHxudWxsO1xuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiB0aGUgTWF0UGFnaW5hdG9yIGNvbXBvbmVudCB1c2VkIGJ5IHRoZSB0YWJsZSB0byBjb250cm9sIHdoYXQgcGFnZSBvZiB0aGUgZGF0YSBpc1xuICAgKiBkaXNwbGF5ZWQuIFBhZ2UgY2hhbmdlcyBlbWl0dGVkIGJ5IHRoZSBNYXRQYWdpbmF0b3Igd2lsbCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGVcbiAgICogdGFibGUncyByZW5kZXJlZCBkYXRhLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGRhdGEgc291cmNlIHVzZXMgdGhlIHBhZ2luYXRvcidzIHByb3BlcnRpZXMgdG8gY2FsY3VsYXRlIHdoaWNoIHBhZ2Ugb2YgZGF0YVxuICAgKiBzaG91bGQgYmUgZGlzcGxheWVkLiBJZiB0aGUgcGFnaW5hdG9yIHJlY2VpdmVzIGl0cyBwcm9wZXJ0aWVzIGFzIHRlbXBsYXRlIGlucHV0cyxcbiAgICogZS5nLiBgW3BhZ2VMZW5ndGhdPTEwMGAgb3IgYFtwYWdlSW5kZXhdPTFgLCB0aGVuIGJlIHN1cmUgdGhhdCB0aGUgcGFnaW5hdG9yJ3MgdmlldyBoYXMgYmVlblxuICAgKiBpbml0aWFsaXplZCBiZWZvcmUgYXNzaWduaW5nIGl0IHRvIHRoaXMgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBnZXQgcGFnaW5hdG9yKCk6IE1hdFBhZ2luYXRvciB8IG51bGwgeyByZXR1cm4gdGhpcy5fcGFnaW5hdG9yOyB9XG4gIHNldCBwYWdpbmF0b3IocGFnaW5hdG9yOiBNYXRQYWdpbmF0b3J8bnVsbCkge1xuICAgIHRoaXMuX3BhZ2luYXRvciA9IHBhZ2luYXRvcjtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuICBwcml2YXRlIF9wYWdpbmF0b3I6IE1hdFBhZ2luYXRvcnxudWxsO1xuXG4gIC8qKlxuICAgKiBEYXRhIGFjY2Vzc29yIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBmb3IgYWNjZXNzaW5nIGRhdGEgcHJvcGVydGllcyBmb3Igc29ydGluZyB0aHJvdWdoXG4gICAqIHRoZSBkZWZhdWx0IHNvcnREYXRhIGZ1bmN0aW9uLlxuICAgKiBUaGlzIGRlZmF1bHQgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IHRoZSBzb3J0IGhlYWRlciBJRHMgKHdoaWNoIGRlZmF1bHRzIHRvIHRoZSBjb2x1bW4gbmFtZSlcbiAgICogbWF0Y2hlcyB0aGUgZGF0YSdzIHByb3BlcnRpZXMgKGUuZy4gY29sdW1uIFh5eiByZXByZXNlbnRzIGRhdGFbJ1h5eiddKS5cbiAgICogTWF5IGJlIHNldCB0byBhIGN1c3RvbSBmdW5jdGlvbiBmb3IgZGlmZmVyZW50IGJlaGF2aW9yLlxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIG9iamVjdCB0aGF0IGlzIGJlaW5nIGFjY2Vzc2VkLlxuICAgKiBAcGFyYW0gc29ydEhlYWRlcklkIFRoZSBuYW1lIG9mIHRoZSBjb2x1bW4gdGhhdCByZXByZXNlbnRzIHRoZSBkYXRhLlxuICAgKi9cbiAgc29ydGluZ0RhdGFBY2Nlc3NvcjogKChkYXRhOiBULCBzb3J0SGVhZGVySWQ6IHN0cmluZykgPT4gc3RyaW5nfG51bWJlcikgPVxuICAgICAgKGRhdGE6IFQsIHNvcnRIZWFkZXJJZDogc3RyaW5nKTogc3RyaW5nfG51bWJlciA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZGF0YSBhcyB7W2tleTogc3RyaW5nXTogYW55fSlbc29ydEhlYWRlcklkXTtcblxuICAgIGlmIChfaXNOdW1iZXJWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG51bWJlclZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblxuICAgICAgLy8gTnVtYmVycyBiZXlvbmQgYE1BWF9TQUZFX0lOVEVHRVJgIGNhbid0IGJlIGNvbXBhcmVkIHJlbGlhYmx5IHNvIHdlXG4gICAgICAvLyBsZWF2ZSB0aGVtIGFzIHN0cmluZ3MuIEZvciBtb3JlIGluZm86IGh0dHBzOi8vZ29vLmdsL3k1dmJTZ1xuICAgICAgcmV0dXJuIG51bWJlclZhbHVlIDwgTUFYX1NBRkVfSU5URUdFUiA/IG51bWJlclZhbHVlIDogdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzb3J0ZWQgY29weSBvZiB0aGUgZGF0YSBhcnJheSBiYXNlZCBvbiB0aGUgc3RhdGUgb2YgdGhlIE1hdFNvcnQuIENhbGxlZFxuICAgKiBhZnRlciBjaGFuZ2VzIGFyZSBtYWRlIHRvIHRoZSBmaWx0ZXJlZCBkYXRhIG9yIHdoZW4gc29ydCBjaGFuZ2VzIGFyZSBlbWl0dGVkIGZyb20gTWF0U29ydC5cbiAgICogQnkgZGVmYXVsdCwgdGhlIGZ1bmN0aW9uIHJldHJpZXZlcyB0aGUgYWN0aXZlIHNvcnQgYW5kIGl0cyBkaXJlY3Rpb24gYW5kIGNvbXBhcmVzIGRhdGFcbiAgICogYnkgcmV0cmlldmluZyBkYXRhIHVzaW5nIHRoZSBzb3J0aW5nRGF0YUFjY2Vzc29yLiBNYXkgYmUgb3ZlcnJpZGRlbiBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb25cbiAgICogb2YgZGF0YSBvcmRlcmluZy5cbiAgICogQHBhcmFtIGRhdGEgVGhlIGFycmF5IG9mIGRhdGEgdGhhdCBzaG91bGQgYmUgc29ydGVkLlxuICAgKiBAcGFyYW0gc29ydCBUaGUgY29ubmVjdGVkIE1hdFNvcnQgdGhhdCBob2xkcyB0aGUgY3VycmVudCBzb3J0IHN0YXRlLlxuICAgKi9cbiAgc29ydERhdGE6ICgoZGF0YTogVFtdLCBzb3J0OiBNYXRTb3J0KSA9PiBUW10pID0gKGRhdGE6IFRbXSwgc29ydDogTWF0U29ydCk6IFRbXSA9PiB7XG4gICAgY29uc3QgYWN0aXZlID0gc29ydC5hY3RpdmU7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gc29ydC5kaXJlY3Rpb247XG4gICAgaWYgKCFhY3RpdmUgfHwgZGlyZWN0aW9uID09ICcnKSB7IHJldHVybiBkYXRhOyB9XG5cbiAgICByZXR1cm4gZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBsZXQgdmFsdWVBID0gdGhpcy5zb3J0aW5nRGF0YUFjY2Vzc29yKGEsIGFjdGl2ZSk7XG4gICAgICBsZXQgdmFsdWVCID0gdGhpcy5zb3J0aW5nRGF0YUFjY2Vzc29yKGIsIGFjdGl2ZSk7XG5cbiAgICAgIC8vIElmIGJvdGggdmFsdWVBIGFuZCB2YWx1ZUIgZXhpc3QgKHRydXRoeSksIHRoZW4gY29tcGFyZSB0aGUgdHdvLiBPdGhlcndpc2UsIGNoZWNrIGlmXG4gICAgICAvLyBvbmUgdmFsdWUgZXhpc3RzIHdoaWxlIHRoZSBvdGhlciBkb2Vzbid0LiBJbiB0aGlzIGNhc2UsIGV4aXN0aW5nIHZhbHVlIHNob3VsZCBjb21lIGxhc3QuXG4gICAgICAvLyBUaGlzIGF2b2lkcyBpbmNvbnNpc3RlbnQgcmVzdWx0cyB3aGVuIGNvbXBhcmluZyB2YWx1ZXMgdG8gdW5kZWZpbmVkL251bGwuXG4gICAgICAvLyBJZiBuZWl0aGVyIHZhbHVlIGV4aXN0cywgcmV0dXJuIDAgKGVxdWFsKS5cbiAgICAgIGxldCBjb21wYXJhdG9yUmVzdWx0ID0gMDtcbiAgICAgIGlmICh2YWx1ZUEgIT0gbnVsbCAmJiB2YWx1ZUIgIT0gbnVsbCkge1xuICAgICAgICAvLyBDaGVjayBpZiBvbmUgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBvdGhlcjsgaWYgZXF1YWwsIGNvbXBhcmF0b3JSZXN1bHQgc2hvdWxkIHJlbWFpbiAwLlxuICAgICAgICBpZiAodmFsdWVBID4gdmFsdWVCKSB7XG4gICAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWVBIDwgdmFsdWVCKSB7XG4gICAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IC0xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlQSAhPSBudWxsKSB7XG4gICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAxO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZUIgIT0gbnVsbCkge1xuICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wYXJhdG9yUmVzdWx0ICogKGRpcmVjdGlvbiA9PSAnYXNjJyA/IDEgOiAtMSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgZGF0YSBvYmplY3QgbWF0Y2hlcyB0aGUgZGF0YSBzb3VyY2UncyBmaWx0ZXIgc3RyaW5nLiBCeSBkZWZhdWx0LCBlYWNoIGRhdGEgb2JqZWN0XG4gICAqIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBvZiBpdHMgcHJvcGVydGllcyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBmaWx0ZXIgaGFzXG4gICAqIGF0IGxlYXN0IG9uZSBvY2N1cnJlbmNlIGluIHRoYXQgc3RyaW5nLiBCeSBkZWZhdWx0LCB0aGUgZmlsdGVyIHN0cmluZyBoYXMgaXRzIHdoaXRlc3BhY2VcbiAgICogdHJpbW1lZCBhbmQgdGhlIG1hdGNoIGlzIGNhc2UtaW5zZW5zaXRpdmUuIE1heSBiZSBvdmVycmlkZGVuIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvbiBvZlxuICAgKiBmaWx0ZXIgbWF0Y2hpbmcuXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgb2JqZWN0IHVzZWQgdG8gY2hlY2sgYWdhaW5zdCB0aGUgZmlsdGVyLlxuICAgKiBAcGFyYW0gZmlsdGVyIEZpbHRlciBzdHJpbmcgdGhhdCBoYXMgYmVlbiBzZXQgb24gdGhlIGRhdGEgc291cmNlLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBmaWx0ZXIgbWF0Y2hlcyBhZ2FpbnN0IHRoZSBkYXRhXG4gICAqL1xuICBmaWx0ZXJQcmVkaWNhdGU6ICgoZGF0YTogVCwgZmlsdGVyOiBzdHJpbmcpID0+IGJvb2xlYW4pID0gKGRhdGE6IFQsIGZpbHRlcjogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgLy8gVHJhbnNmb3JtIHRoZSBkYXRhIGludG8gYSBsb3dlcmNhc2Ugc3RyaW5nIG9mIGFsbCBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgY29uc3QgZGF0YVN0ciA9IE9iamVjdC5rZXlzKGRhdGEpLnJlZHVjZSgoY3VycmVudFRlcm06IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIFVzZSBhbiBvYnNjdXJlIFVuaWNvZGUgY2hhcmFjdGVyIHRvIGRlbGltaXQgdGhlIHdvcmRzIGluIHRoZSBjb25jYXRlbmF0ZWQgc3RyaW5nLlxuICAgICAgLy8gVGhpcyBhdm9pZHMgbWF0Y2hlcyB3aGVyZSB0aGUgdmFsdWVzIG9mIHR3byBjb2x1bW5zIGNvbWJpbmVkIHdpbGwgbWF0Y2ggdGhlIHVzZXIncyBxdWVyeVxuICAgICAgLy8gKGUuZy4gYEZsdXRlYCBhbmQgYFN0b3BgIHdpbGwgbWF0Y2ggYFRlc3RgKS4gVGhlIGNoYXJhY3RlciBpcyBpbnRlbmRlZCB0byBiZSBzb21ldGhpbmdcbiAgICAgIC8vIHRoYXQgaGFzIGEgdmVyeSBsb3cgY2hhbmNlIG9mIGJlaW5nIHR5cGVkIGluIGJ5IHNvbWVib2R5IGluIGEgdGV4dCBmaWVsZC4gVGhpcyBvbmUgaW5cbiAgICAgIC8vIHBhcnRpY3VsYXIgaXMgXCJXaGl0ZSB1cC1wb2ludGluZyB0cmlhbmdsZSB3aXRoIGRvdFwiIGZyb21cbiAgICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfVW5pY29kZV9jaGFyYWN0ZXJzXG4gICAgICByZXR1cm4gY3VycmVudFRlcm0gKyAoZGF0YSBhcyB7W2tleTogc3RyaW5nXTogYW55fSlba2V5XSArICfil6wnO1xuICAgIH0sICcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHRoZSBmaWx0ZXIgYnkgY29udmVydGluZyBpdCB0byBsb3dlcmNhc2UgYW5kIHJlbW92aW5nIHdoaXRlc3BhY2UuXG4gICAgY29uc3QgdHJhbnNmb3JtZWRGaWx0ZXIgPSBmaWx0ZXIudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICByZXR1cm4gZGF0YVN0ci5pbmRleE9mKHRyYW5zZm9ybWVkRmlsdGVyKSAhPSAtMTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxEYXRhOiBUW10gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihpbml0aWFsRGF0YSk7XG4gICAgdGhpcy5fdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIGNoYW5nZXMgdGhhdCBzaG91bGQgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlIHRhYmxlJ3MgcmVuZGVyZWQgcm93cy4gV2hlbiB0aGVcbiAgICogY2hhbmdlcyBvY2N1ciwgcHJvY2VzcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZmlsdGVyLCBzb3J0LCBhbmQgcGFnaW5hdGlvbiBhbG9uZyB3aXRoXG4gICAqIHRoZSBwcm92aWRlZCBiYXNlIGRhdGEgYW5kIHNlbmQgaXQgdG8gdGhlIHRhYmxlIGZvciByZW5kZXJpbmcuXG4gICAqL1xuICBfdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCkge1xuICAgIC8vIFNvcnRpbmcgYW5kL29yIHBhZ2luYXRpb24gc2hvdWxkIGJlIHdhdGNoZWQgaWYgTWF0U29ydCBhbmQvb3IgTWF0UGFnaW5hdG9yIGFyZSBwcm92aWRlZC5cbiAgICAvLyBUaGUgZXZlbnRzIHNob3VsZCBlbWl0IHdoZW5ldmVyIHRoZSBjb21wb25lbnQgZW1pdHMgYSBjaGFuZ2Ugb3IgaW5pdGlhbGl6ZXMsIG9yIGlmIG5vXG4gICAgLy8gY29tcG9uZW50IGlzIHByb3ZpZGVkLCBhIHN0cmVhbSB3aXRoIGp1c3QgYSBudWxsIGV2ZW50IHNob3VsZCBiZSBwcm92aWRlZC5cbiAgICAvLyBUaGUgYHNvcnRDaGFuZ2VgIGFuZCBgcGFnZUNoYW5nZWAgYWN0cyBhcyBhIHNpZ25hbCB0byB0aGUgY29tYmluZUxhdGVzdHMgYmVsb3cgc28gdGhhdCB0aGVcbiAgICAvLyBwaXBlbGluZSBjYW4gcHJvZ3Jlc3MgdG8gdGhlIG5leHQgc3RlcC4gTm90ZSB0aGF0IHRoZSB2YWx1ZSBmcm9tIHRoZXNlIHN0cmVhbXMgYXJlIG5vdCB1c2VkLFxuICAgIC8vIHRoZXkgcHVyZWx5IGFjdCBhcyBhIHNpZ25hbCB0byBwcm9ncmVzcyBpbiB0aGUgcGlwZWxpbmUuXG4gICAgY29uc3Qgc29ydENoYW5nZTogT2JzZXJ2YWJsZTxTb3J0fG51bGx8dm9pZD4gPSB0aGlzLl9zb3J0ID9cbiAgICAgICAgbWVyZ2UodGhpcy5fc29ydC5zb3J0Q2hhbmdlLCB0aGlzLl9zb3J0LmluaXRpYWxpemVkKSBhcyBPYnNlcnZhYmxlPFNvcnR8dm9pZD4gOlxuICAgICAgICBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgY29uc3QgcGFnZUNoYW5nZTogT2JzZXJ2YWJsZTxQYWdlRXZlbnR8bnVsbHx2b2lkPiA9IHRoaXMuX3BhZ2luYXRvciA/XG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgIHRoaXMuX3BhZ2luYXRvci5wYWdlLFxuICAgICAgICAgIHRoaXMuX2ludGVybmFsUGFnZUNoYW5nZXMsXG4gICAgICAgICAgdGhpcy5fcGFnaW5hdG9yLmluaXRpYWxpemVkXG4gICAgICAgICkgYXMgT2JzZXJ2YWJsZTxQYWdlRXZlbnR8dm9pZD4gOlxuICAgICAgICBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgY29uc3QgZGF0YVN0cmVhbSA9IHRoaXMuX2RhdGE7XG4gICAgLy8gV2F0Y2ggZm9yIGJhc2UgZGF0YSBvciBmaWx0ZXIgY2hhbmdlcyB0byBwcm92aWRlIGEgZmlsdGVyZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3QgZmlsdGVyZWREYXRhID0gY29tYmluZUxhdGVzdChbZGF0YVN0cmVhbSwgdGhpcy5fZmlsdGVyXSlcbiAgICAgIC5waXBlKG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9maWx0ZXJEYXRhKGRhdGEpKSk7XG4gICAgLy8gV2F0Y2ggZm9yIGZpbHRlcmVkIGRhdGEgb3Igc29ydCBjaGFuZ2VzIHRvIHByb3ZpZGUgYW4gb3JkZXJlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBvcmRlcmVkRGF0YSA9IGNvbWJpbmVMYXRlc3QoW2ZpbHRlcmVkRGF0YSwgc29ydENoYW5nZV0pXG4gICAgICAucGlwZShtYXAoKFtkYXRhXSkgPT4gdGhpcy5fb3JkZXJEYXRhKGRhdGEpKSk7XG4gICAgLy8gV2F0Y2ggZm9yIG9yZGVyZWQgZGF0YSBvciBwYWdlIGNoYW5nZXMgdG8gcHJvdmlkZSBhIHBhZ2VkIHNldCBvZiBkYXRhLlxuICAgIGNvbnN0IHBhZ2luYXRlZERhdGEgPSBjb21iaW5lTGF0ZXN0KFtvcmRlcmVkRGF0YSwgcGFnZUNoYW5nZV0pXG4gICAgICAucGlwZShtYXAoKFtkYXRhXSkgPT4gdGhpcy5fcGFnZURhdGEoZGF0YSkpKTtcbiAgICAvLyBXYXRjaGVkIGZvciBwYWdlZCBkYXRhIGNoYW5nZXMgYW5kIHNlbmQgdGhlIHJlc3VsdCB0byB0aGUgdGFibGUgdG8gcmVuZGVyLlxuICAgIHRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uID0gcGFnaW5hdGVkRGF0YS5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLl9yZW5kZXJEYXRhLm5leHQoZGF0YSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmaWx0ZXJlZCBkYXRhIGFycmF5IHdoZXJlIGVhY2ggZmlsdGVyIG9iamVjdCBjb250YWlucyB0aGUgZmlsdGVyIHN0cmluZyB3aXRoaW5cbiAgICogdGhlIHJlc3VsdCBvZiB0aGUgZmlsdGVyVGVybUFjY2Vzc29yIGZ1bmN0aW9uLiBJZiBubyBmaWx0ZXIgaXMgc2V0LCByZXR1cm5zIHRoZSBkYXRhIGFycmF5XG4gICAqIGFzIHByb3ZpZGVkLlxuICAgKi9cbiAgX2ZpbHRlckRhdGEoZGF0YTogVFtdKSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgYSBmaWx0ZXIgc3RyaW5nLCBmaWx0ZXIgb3V0IGRhdGEgdGhhdCBkb2VzIG5vdCBjb250YWluIGl0LlxuICAgIC8vIEVhY2ggZGF0YSBvYmplY3QgaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIHVzaW5nIHRoZSBmdW5jdGlvbiBkZWZpbmVkIGJ5IGZpbHRlclRlcm1BY2Nlc3Nvci5cbiAgICAvLyBNYXkgYmUgb3ZlcnJpZGRlbiBmb3IgY3VzdG9taXphdGlvbi5cbiAgICB0aGlzLmZpbHRlcmVkRGF0YSA9XG4gICAgICAgICF0aGlzLmZpbHRlciA/IGRhdGEgOiBkYXRhLmZpbHRlcihvYmogPT4gdGhpcy5maWx0ZXJQcmVkaWNhdGUob2JqLCB0aGlzLmZpbHRlcikpO1xuXG4gICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7IHRoaXMuX3VwZGF0ZVBhZ2luYXRvcih0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGgpOyB9XG5cbiAgICByZXR1cm4gdGhpcy5maWx0ZXJlZERhdGE7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhIGlmIE1hdFNvcnQgaGFzIGEgc29ydCBhcHBsaWVkLCBvdGhlcndpc2UganVzdCByZXR1cm5zIHRoZVxuICAgKiBkYXRhIGFycmF5IGFzIHByb3ZpZGVkLiBVc2VzIHRoZSBkZWZhdWx0IGRhdGEgYWNjZXNzb3IgZm9yIGRhdGEgbG9va3VwLCB1bmxlc3MgYVxuICAgKiBzb3J0RGF0YUFjY2Vzc29yIGZ1bmN0aW9uIGlzIGRlZmluZWQuXG4gICAqL1xuICBfb3JkZXJEYXRhKGRhdGE6IFRbXSk6IFRbXSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gYWN0aXZlIHNvcnQgb3IgZGlyZWN0aW9uLCByZXR1cm4gdGhlIGRhdGEgd2l0aG91dCB0cnlpbmcgdG8gc29ydC5cbiAgICBpZiAoIXRoaXMuc29ydCkgeyByZXR1cm4gZGF0YTsgfVxuXG4gICAgcmV0dXJuIHRoaXMuc29ydERhdGEoZGF0YS5zbGljZSgpLCB0aGlzLnNvcnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwYWdlZCBzbGljZSBvZiB0aGUgcHJvdmlkZWQgZGF0YSBhcnJheSBhY2NvcmRpbmcgdG8gdGhlIHByb3ZpZGVkIE1hdFBhZ2luYXRvcidzIHBhZ2VcbiAgICogaW5kZXggYW5kIGxlbmd0aC4gSWYgdGhlcmUgaXMgbm8gcGFnaW5hdG9yIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBkYXRhIGFycmF5IGFzIHByb3ZpZGVkLlxuICAgKi9cbiAgX3BhZ2VEYXRhKGRhdGE6IFRbXSk6IFRbXSB7XG4gICAgaWYgKCF0aGlzLnBhZ2luYXRvcikgeyByZXR1cm4gZGF0YTsgfVxuXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCAqIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplO1xuICAgIHJldHVybiBkYXRhLnNsaWNlKHN0YXJ0SW5kZXgsIHN0YXJ0SW5kZXggKyB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcGFnaW5hdG9yIHRvIHJlZmxlY3QgdGhlIGxlbmd0aCBvZiB0aGUgZmlsdGVyZWQgZGF0YSwgYW5kIG1ha2VzIHN1cmUgdGhhdCB0aGUgcGFnZVxuICAgKiBpbmRleCBkb2VzIG5vdCBleGNlZWQgdGhlIHBhZ2luYXRvcidzIGxhc3QgcGFnZS4gVmFsdWVzIGFyZSBjaGFuZ2VkIGluIGEgcmVzb2x2ZWQgcHJvbWlzZSB0b1xuICAgKiBndWFyZCBhZ2FpbnN0IG1ha2luZyBwcm9wZXJ0eSBjaGFuZ2VzIHdpdGhpbiBhIHJvdW5kIG9mIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqL1xuICBfdXBkYXRlUGFnaW5hdG9yKGZpbHRlcmVkRGF0YUxlbmd0aDogbnVtYmVyKSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBwYWdpbmF0b3IgPSB0aGlzLnBhZ2luYXRvcjtcblxuICAgICAgaWYgKCFwYWdpbmF0b3IpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHBhZ2luYXRvci5sZW5ndGggPSBmaWx0ZXJlZERhdGFMZW5ndGg7XG5cbiAgICAgIC8vIElmIHRoZSBwYWdlIGluZGV4IGlzIHNldCBiZXlvbmQgdGhlIHBhZ2UsIHJlZHVjZSBpdCB0byB0aGUgbGFzdCBwYWdlLlxuICAgICAgaWYgKHBhZ2luYXRvci5wYWdlSW5kZXggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxhc3RQYWdlSW5kZXggPSBNYXRoLmNlaWwocGFnaW5hdG9yLmxlbmd0aCAvIHBhZ2luYXRvci5wYWdlU2l6ZSkgLSAxIHx8IDA7XG4gICAgICAgIGNvbnN0IG5ld1BhZ2VJbmRleCA9IE1hdGgubWluKHBhZ2luYXRvci5wYWdlSW5kZXgsIGxhc3RQYWdlSW5kZXgpO1xuXG4gICAgICAgIGlmIChuZXdQYWdlSW5kZXggIT09IHBhZ2luYXRvci5wYWdlSW5kZXgpIHtcbiAgICAgICAgICBwYWdpbmF0b3IucGFnZUluZGV4ID0gbmV3UGFnZUluZGV4O1xuXG4gICAgICAgICAgLy8gU2luY2UgdGhlIHBhZ2luYXRvciBvbmx5IGVtaXRzIGFmdGVyIHVzZXItZ2VuZXJhdGVkIGNoYW5nZXMsXG4gICAgICAgICAgLy8gd2UgbmVlZCBvdXIgb3duIHN0cmVhbSBzbyB3ZSBrbm93IHRvIHNob3VsZCByZS1yZW5kZXIgdGhlIGRhdGEuXG4gICAgICAgICAgdGhpcy5faW50ZXJuYWxQYWdlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IHRoZSBNYXRUYWJsZS4gQ2FsbGVkIHdoZW4gaXQgY29ubmVjdHMgdG8gdGhlIGRhdGEgc291cmNlLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb25uZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVuZGVyRGF0YTsgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IHRoZSBNYXRUYWJsZS4gQ2FsbGVkIHdoZW4gaXQgaXMgZGVzdHJveWVkLiBOby1vcC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdCgpIHsgfVxufVxuIl19