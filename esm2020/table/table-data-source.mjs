/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, combineLatest, merge, of as observableOf, Subject, } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
const MAX_SAFE_INTEGER = 9007199254740991;
/** Shared base class with MDC-based implementation. */
export class _MatTableDataSource extends DataSource {
    constructor(initialData = []) {
        super();
        /** Stream emitting render data to the table (depends on ordered data changes). */
        this._renderData = new BehaviorSubject([]);
        /** Stream that emits when a new filter string is set on the data source. */
        this._filter = new BehaviorSubject('');
        /** Used to react to internal changes of the paginator that are made by the data source itself. */
        this._internalPageChanges = new Subject();
        /**
         * Subscription to the changes that should trigger an update to the table's rendered rows, such
         * as filtering, sorting, pagination, or base data changes.
         */
        this._renderChangesSubscription = null;
        /**
         * Data accessor function that is used for accessing data properties for sorting through
         * the default sortData function.
         * This default function assumes that the sort header IDs (which defaults to the column name)
         * matches the data's properties (e.g. column Xyz represents data['Xyz']).
         * May be set to a custom function for different behavior.
         * @param data Data object that is being accessed.
         * @param sortHeaderId The name of the column that represents the data.
         */
        this.sortingDataAccessor = (data, sortHeaderId) => {
            const value = data[sortHeaderId];
            if (_isNumberValue(value)) {
                const numberValue = Number(value);
                // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
                // leave them as strings. For more info: https://goo.gl/y5vbSg
                return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
            }
            return value;
        };
        /**
         * Gets a sorted copy of the data array based on the state of the MatSort. Called
         * after changes are made to the filtered data or when sort changes are emitted from MatSort.
         * By default, the function retrieves the active sort and its direction and compares data
         * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
         * of data ordering.
         * @param data The array of data that should be sorted.
         * @param sort The connected MatSort that holds the current sort state.
         */
        this.sortData = (data, sort) => {
            const active = sort.active;
            const direction = sort.direction;
            if (!active || direction == '') {
                return data;
            }
            return data.sort((a, b) => {
                let valueA = this.sortingDataAccessor(a, active);
                let valueB = this.sortingDataAccessor(b, active);
                // If there are data in the column that can be converted to a number,
                // it must be ensured that the rest of the data
                // is of the same type so as not to order incorrectly.
                const valueAType = typeof valueA;
                const valueBType = typeof valueB;
                if (valueAType !== valueBType) {
                    if (valueAType === 'number') {
                        valueA += '';
                    }
                    if (valueBType === 'number') {
                        valueB += '';
                    }
                }
                // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
                // one value exists while the other doesn't. In this case, existing value should come last.
                // This avoids inconsistent results when comparing values to undefined/null.
                // If neither value exists, return 0 (equal).
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
            });
        };
        /**
         * Checks if a data object matches the data source's filter string. By default, each data object
         * is converted to a string of its properties and returns true if the filter has
         * at least one occurrence in that string. By default, the filter string has its whitespace
         * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
         * filter matching.
         * @param data Data object used to check against the filter.
         * @param filter Filter string that has been set on the data source.
         * @returns Whether the filter matches against the data
         */
        this.filterPredicate = (data, filter) => {
            // Transform the data into a lowercase string of all property values.
            const dataStr = Object.keys(data).reduce((currentTerm, key) => {
                // Use an obscure Unicode character to delimit the words in the concatenated string.
                // This avoids matches where the values of two columns combined will match the user's query
                // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                // that has a very low chance of being typed in by somebody in a text field. This one in
                // particular is "White up-pointing triangle with dot" from
                // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                return currentTerm + data[key] + '◬';
            }, '').toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        };
        this._data = new BehaviorSubject(initialData);
        this._updateChangeSubscription();
    }
    /** Array of data that should be rendered by the table, where each object represents one row. */
    get data() { return this._data.value; }
    set data(data) {
        this._data.next(data);
        // Normally the `filteredData` is updated by the re-render
        // subscription, but that won't happen if it's inactive.
        if (!this._renderChangesSubscription) {
            this._filterData(data);
        }
    }
    /**
     * Filter term that should be used to filter out objects from the data array. To override how
     * data objects match to this filter string, provide a custom function for filterPredicate.
     */
    get filter() { return this._filter.value; }
    set filter(filter) {
        this._filter.next(filter);
        // Normally the `filteredData` is updated by the re-render
        // subscription, but that won't happen if it's inactive.
        if (!this._renderChangesSubscription) {
            this._filterData(this.data);
        }
    }
    /**
     * Instance of the MatSort directive used by the table to control its sorting. Sort changes
     * emitted by the MatSort will trigger an update to the table's rendered data.
     */
    get sort() { return this._sort; }
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
     */
    get paginator() { return this._paginator; }
    set paginator(paginator) {
        this._paginator = paginator;
        this._updateChangeSubscription();
    }
    /**
     * Subscribe to changes that should trigger an update to the table's rendered rows. When the
     * changes occur, process the current state of the filter, sort, and pagination along with
     * the provided base data and send it to the table for rendering.
     */
    _updateChangeSubscription() {
        // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
        // The events should emit whenever the component emits a change or initializes, or if no
        // component is provided, a stream with just a null event should be provided.
        // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
        // pipeline can progress to the next step. Note that the value from these streams are not used,
        // they purely act as a signal to progress in the pipeline.
        const sortChange = this._sort ?
            merge(this._sort.sortChange, this._sort.initialized) :
            observableOf(null);
        const pageChange = this._paginator ?
            merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized) :
            observableOf(null);
        const dataStream = this._data;
        // Watch for base data or filter changes to provide a filtered set of data.
        const filteredData = combineLatest([dataStream, this._filter])
            .pipe(map(([data]) => this._filterData(data)));
        // Watch for filtered data or sort changes to provide an ordered set of data.
        const orderedData = combineLatest([filteredData, sortChange])
            .pipe(map(([data]) => this._orderData(data)));
        // Watch for ordered data or page changes to provide a paged set of data.
        const paginatedData = combineLatest([orderedData, pageChange])
            .pipe(map(([data]) => this._pageData(data)));
        // Watched for paged data changes and send the result to the table to render.
        this._renderChangesSubscription?.unsubscribe();
        this._renderChangesSubscription = paginatedData.subscribe(data => this._renderData.next(data));
    }
    /**
     * Returns a filtered data array where each filter object contains the filter string within
     * the result of the filterTermAccessor function. If no filter is set, returns the data array
     * as provided.
     */
    _filterData(data) {
        // If there is a filter string, filter out data that does not contain it.
        // Each data object is converted to a string using the function defined by filterTermAccessor.
        // May be overridden for customization.
        this.filteredData = (this.filter == null || this.filter === '') ? data :
            data.filter(obj => this.filterPredicate(obj, this.filter));
        if (this.paginator) {
            this._updatePaginator(this.filteredData.length);
        }
        return this.filteredData;
    }
    /**
     * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
     * data array as provided. Uses the default data accessor for data lookup, unless a
     * sortDataAccessor function is defined.
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
     */
    _pageData(data) {
        if (!this.paginator) {
            return data;
        }
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.slice(startIndex, startIndex + this.paginator.pageSize);
    }
    /**
     * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
     * index does not exceed the paginator's last page. Values are changed in a resolved promise to
     * guard against making property changes within a round of change detection.
     */
    _updatePaginator(filteredDataLength) {
        Promise.resolve().then(() => {
            const paginator = this.paginator;
            if (!paginator) {
                return;
            }
            paginator.length = filteredDataLength;
            // If the page index is set beyond the page, reduce it to the last page.
            if (paginator.pageIndex > 0) {
                const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
                const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
                if (newPageIndex !== paginator.pageIndex) {
                    paginator.pageIndex = newPageIndex;
                    // Since the paginator only emits after user-generated changes,
                    // we need our own stream so we know to should re-render the data.
                    this._internalPageChanges.next();
                }
            }
        });
    }
    /**
     * Used by the MatTable. Called when it connects to the data source.
     * @docs-private
     */
    connect() {
        if (!this._renderChangesSubscription) {
            this._updateChangeSubscription();
        }
        return this._renderData;
    }
    /**
     * Used by the MatTable. Called when it disconnects from the data source.
     * @docs-private
     */
    disconnect() {
        this._renderChangesSubscription?.unsubscribe();
        this._renderChangesSubscription = null;
    }
}
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
 */
export class MatTableDataSource extends _MatTableDataSource {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUc5QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYixLQUFLLEVBRUwsRUFBRSxJQUFJLFlBQVksRUFDbEIsT0FBTyxHQUVSLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DOzs7R0FHRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUF3QjFDLHVEQUF1RDtBQUN2RCxNQUFNLE9BQU8sbUJBRVQsU0FBUSxVQUFhO0lBdUx2QixZQUFZLGNBQW1CLEVBQUU7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUFwTFYsa0ZBQWtGO1FBQ2pFLGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQU0sRUFBRSxDQUFDLENBQUM7UUFFNUQsNEVBQTRFO1FBQzNELFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzRCxrR0FBa0c7UUFDakYseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUU1RDs7O1dBR0c7UUFDSCwrQkFBMEIsR0FBc0IsSUFBSSxDQUFDO1FBK0RyRDs7Ozs7Ozs7V0FRRztRQUNILHdCQUFtQixHQUNmLENBQUMsSUFBTyxFQUFFLFlBQW9CLEVBQWlCLEVBQUU7WUFDbkQsTUFBTSxLQUFLLEdBQUksSUFBNkIsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUzRCxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekIsTUFBTSxX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TSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBRWxFLElBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQyxTQUFTLEVBQUU7b0JBQ3hDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO29CQUVuQywrREFBK0Q7b0JBQy9ELGtFQUFrRTtvQkFDbEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsQzthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7WUFDcEMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDbEM7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFVBQVU7UUFDUixJQUFJLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLE9BQU8sa0JBQXNCLFNBQVEsbUJBQW9DO0NBQUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtfaXNOdW1iZXJWYWx1ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGF0YVNvdXJjZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7TWF0UGFnaW5hdG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wYWdpbmF0b3InO1xuaW1wb3J0IHtNYXRTb3J0LCBTb3J0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zb3J0JztcbmltcG9ydCB7XG4gIEJlaGF2aW9yU3ViamVjdCxcbiAgY29tYmluZUxhdGVzdCxcbiAgbWVyZ2UsXG4gIE9ic2VydmFibGUsXG4gIG9mIGFzIG9ic2VydmFibGVPZixcbiAgU3ViamVjdCxcbiAgU3Vic2NyaXB0aW9uLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogQ29ycmVzcG9uZHMgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC4gTW92ZWQgb3V0IGludG8gYSB2YXJpYWJsZSBoZXJlIGR1ZSB0b1xuICogZmxha3kgYnJvd3NlciBzdXBwb3J0IGFuZCB0aGUgdmFsdWUgbm90IGJlaW5nIGRlZmluZWQgaW4gQ2xvc3VyZSdzIHR5cGluZ3MuXG4gKi9cbmNvbnN0IE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IG1hdGNoZXMgdGhlIHJlcXVpcmVkIEFQSSBwYXJ0cyBmb3IgdGhlIE1hdFBhZ2luYXRvcidzIFBhZ2VFdmVudC5cbiAqIERlY291cGxlZCBzbyB0aGF0IHVzZXJzIGNhbiBkZXBlbmQgb24gZWl0aGVyIHRoZSBsZWdhY3kgb3IgTURDLWJhc2VkIHBhZ2luYXRvci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRUYWJsZURhdGFTb3VyY2VQYWdlRXZlbnQge1xuICBwYWdlSW5kZXg6IG51bWJlcjtcbiAgcGFnZVNpemU6IG51bWJlcjtcbiAgbGVuZ3RoOiBudW1iZXI7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgbWF0Y2hlcyB0aGUgcmVxdWlyZWQgQVBJIHBhcnRzIG9mIHRoZSBNYXRQYWdpbmF0b3IuXG4gKiBEZWNvdXBsZWQgc28gdGhhdCB1c2VycyBjYW4gZGVwZW5kIG9uIGVpdGhlciB0aGUgbGVnYWN5IG9yIE1EQy1iYXNlZCBwYWdpbmF0b3IuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VGFibGVEYXRhU291cmNlUGFnaW5hdG9yIHtcbiAgcGFnZTogU3ViamVjdDxNYXRUYWJsZURhdGFTb3VyY2VQYWdlRXZlbnQ+O1xuICBwYWdlSW5kZXg6IG51bWJlcjtcbiAgaW5pdGlhbGl6ZWQ6IE9ic2VydmFibGU8dm9pZD47XG4gIHBhZ2VTaXplOiBudW1iZXI7XG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG4vKiogU2hhcmVkIGJhc2UgY2xhc3Mgd2l0aCBNREMtYmFzZWQgaW1wbGVtZW50YXRpb24uICovXG5leHBvcnQgY2xhc3MgX01hdFRhYmxlRGF0YVNvdXJjZTxULFxuICAgIFAgZXh0ZW5kcyBNYXRUYWJsZURhdGFTb3VyY2VQYWdpbmF0b3IgPSBNYXRUYWJsZURhdGFTb3VyY2VQYWdpbmF0b3I+XG4gICAgZXh0ZW5kcyBEYXRhU291cmNlPFQ+IHtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBuZXcgZGF0YSBhcnJheSBpcyBzZXQgb24gdGhlIGRhdGEgc291cmNlLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kYXRhOiBCZWhhdmlvclN1YmplY3Q8VFtdPjtcblxuICAvKiogU3RyZWFtIGVtaXR0aW5nIHJlbmRlciBkYXRhIHRvIHRoZSB0YWJsZSAoZGVwZW5kcyBvbiBvcmRlcmVkIGRhdGEgY2hhbmdlcykuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX3JlbmRlckRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFRbXT4oW10pO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgbmV3IGZpbHRlciBzdHJpbmcgaXMgc2V0IG9uIHRoZSBkYXRhIHNvdXJjZS4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZmlsdGVyID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KCcnKTtcblxuICAvKiogVXNlZCB0byByZWFjdCB0byBpbnRlcm5hbCBjaGFuZ2VzIG9mIHRoZSBwYWdpbmF0b3IgdGhhdCBhcmUgbWFkZSBieSB0aGUgZGF0YSBzb3VyY2UgaXRzZWxmLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcm5hbFBhZ2VDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9uIHRvIHRoZSBjaGFuZ2VzIHRoYXQgc2hvdWxkIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZSB0YWJsZSdzIHJlbmRlcmVkIHJvd3MsIHN1Y2hcbiAgICogYXMgZmlsdGVyaW5nLCBzb3J0aW5nLCBwYWdpbmF0aW9uLCBvciBiYXNlIGRhdGEgY2hhbmdlcy5cbiAgICovXG4gIF9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb258bnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBmaWx0ZXJlZCBzZXQgb2YgZGF0YSB0aGF0IGhhcyBiZWVuIG1hdGNoZWQgYnkgdGhlIGZpbHRlciBzdHJpbmcsIG9yIGFsbCB0aGUgZGF0YSBpZiB0aGVyZVxuICAgKiBpcyBubyBmaWx0ZXIuIFVzZWZ1bCBmb3Iga25vd2luZyB0aGUgc2V0IG9mIGRhdGEgdGhlIHRhYmxlIHJlcHJlc2VudHMuXG4gICAqIEZvciBleGFtcGxlLCBhICdzZWxlY3RBbGwoKScgZnVuY3Rpb24gd291bGQgbGlrZWx5IHdhbnQgdG8gc2VsZWN0IHRoZSBzZXQgb2YgZmlsdGVyZWQgZGF0YVxuICAgKiBzaG93biB0byB0aGUgdXNlciByYXRoZXIgdGhhbiBhbGwgdGhlIGRhdGEuXG4gICAqL1xuICBmaWx0ZXJlZERhdGE6IFRbXTtcblxuICAvKiogQXJyYXkgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSByZW5kZXJlZCBieSB0aGUgdGFibGUsIHdoZXJlIGVhY2ggb2JqZWN0IHJlcHJlc2VudHMgb25lIHJvdy4gKi9cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhLnZhbHVlOyB9XG4gIHNldCBkYXRhKGRhdGE6IFRbXSkge1xuICAgIHRoaXMuX2RhdGEubmV4dChkYXRhKTtcbiAgICAvLyBOb3JtYWxseSB0aGUgYGZpbHRlcmVkRGF0YWAgaXMgdXBkYXRlZCBieSB0aGUgcmUtcmVuZGVyXG4gICAgLy8gc3Vic2NyaXB0aW9uLCBidXQgdGhhdCB3b24ndCBoYXBwZW4gaWYgaXQncyBpbmFjdGl2ZS5cbiAgICBpZiAoIXRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2ZpbHRlckRhdGEoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlciB0ZXJtIHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBvYmplY3RzIGZyb20gdGhlIGRhdGEgYXJyYXkuIFRvIG92ZXJyaWRlIGhvd1xuICAgKiBkYXRhIG9iamVjdHMgbWF0Y2ggdG8gdGhpcyBmaWx0ZXIgc3RyaW5nLCBwcm92aWRlIGEgY3VzdG9tIGZ1bmN0aW9uIGZvciBmaWx0ZXJQcmVkaWNhdGUuXG4gICAqL1xuICBnZXQgZmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIudmFsdWU7IH1cbiAgc2V0IGZpbHRlcihmaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX2ZpbHRlci5uZXh0KGZpbHRlcik7XG4gICAgLy8gTm9ybWFsbHkgdGhlIGBmaWx0ZXJlZERhdGFgIGlzIHVwZGF0ZWQgYnkgdGhlIHJlLXJlbmRlclxuICAgIC8vIHN1YnNjcmlwdGlvbiwgYnV0IHRoYXQgd29uJ3QgaGFwcGVuIGlmIGl0J3MgaW5hY3RpdmUuXG4gICAgaWYgKCF0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9maWx0ZXJEYXRhKHRoaXMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIHRoZSBNYXRTb3J0IGRpcmVjdGl2ZSB1c2VkIGJ5IHRoZSB0YWJsZSB0byBjb250cm9sIGl0cyBzb3J0aW5nLiBTb3J0IGNoYW5nZXNcbiAgICogZW1pdHRlZCBieSB0aGUgTWF0U29ydCB3aWxsIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZSB0YWJsZSdzIHJlbmRlcmVkIGRhdGEuXG4gICAqL1xuICBnZXQgc29ydCgpOiBNYXRTb3J0IHwgbnVsbCB7IHJldHVybiB0aGlzLl9zb3J0OyB9XG4gIHNldCBzb3J0KHNvcnQ6IE1hdFNvcnR8bnVsbCkge1xuICAgIHRoaXMuX3NvcnQgPSBzb3J0O1xuICAgIHRoaXMuX3VwZGF0ZUNoYW5nZVN1YnNjcmlwdGlvbigpO1xuICB9XG4gIHByaXZhdGUgX3NvcnQ6IE1hdFNvcnR8bnVsbDtcblxuICAvKipcbiAgICogSW5zdGFuY2Ugb2YgdGhlIE1hdFBhZ2luYXRvciBjb21wb25lbnQgdXNlZCBieSB0aGUgdGFibGUgdG8gY29udHJvbCB3aGF0IHBhZ2Ugb2YgdGhlIGRhdGEgaXNcbiAgICogZGlzcGxheWVkLiBQYWdlIGNoYW5nZXMgZW1pdHRlZCBieSB0aGUgTWF0UGFnaW5hdG9yIHdpbGwgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlXG4gICAqIHRhYmxlJ3MgcmVuZGVyZWQgZGF0YS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBkYXRhIHNvdXJjZSB1c2VzIHRoZSBwYWdpbmF0b3IncyBwcm9wZXJ0aWVzIHRvIGNhbGN1bGF0ZSB3aGljaCBwYWdlIG9mIGRhdGFcbiAgICogc2hvdWxkIGJlIGRpc3BsYXllZC4gSWYgdGhlIHBhZ2luYXRvciByZWNlaXZlcyBpdHMgcHJvcGVydGllcyBhcyB0ZW1wbGF0ZSBpbnB1dHMsXG4gICAqIGUuZy4gYFtwYWdlTGVuZ3RoXT0xMDBgIG9yIGBbcGFnZUluZGV4XT0xYCwgdGhlbiBiZSBzdXJlIHRoYXQgdGhlIHBhZ2luYXRvcidzIHZpZXcgaGFzIGJlZW5cbiAgICogaW5pdGlhbGl6ZWQgYmVmb3JlIGFzc2lnbmluZyBpdCB0byB0aGlzIGRhdGEgc291cmNlLlxuICAgKi9cbiAgZ2V0IHBhZ2luYXRvcigpOiBQIHwgbnVsbCB7IHJldHVybiB0aGlzLl9wYWdpbmF0b3I7IH1cbiAgc2V0IHBhZ2luYXRvcihwYWdpbmF0b3I6IFAgfCBudWxsKSB7XG4gICAgdGhpcy5fcGFnaW5hdG9yID0gcGFnaW5hdG9yO1xuICAgIHRoaXMuX3VwZGF0ZUNoYW5nZVN1YnNjcmlwdGlvbigpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2luYXRvcjogUCB8IG51bGw7XG5cbiAgLyoqXG4gICAqIERhdGEgYWNjZXNzb3IgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGZvciBhY2Nlc3NpbmcgZGF0YSBwcm9wZXJ0aWVzIGZvciBzb3J0aW5nIHRocm91Z2hcbiAgICogdGhlIGRlZmF1bHQgc29ydERhdGEgZnVuY3Rpb24uXG4gICAqIFRoaXMgZGVmYXVsdCBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIHNvcnQgaGVhZGVyIElEcyAod2hpY2ggZGVmYXVsdHMgdG8gdGhlIGNvbHVtbiBuYW1lKVxuICAgKiBtYXRjaGVzIHRoZSBkYXRhJ3MgcHJvcGVydGllcyAoZS5nLiBjb2x1bW4gWHl6IHJlcHJlc2VudHMgZGF0YVsnWHl6J10pLlxuICAgKiBNYXkgYmUgc2V0IHRvIGEgY3VzdG9tIGZ1bmN0aW9uIGZvciBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgb2JqZWN0IHRoYXQgaXMgYmVpbmcgYWNjZXNzZWQuXG4gICAqIEBwYXJhbSBzb3J0SGVhZGVySWQgVGhlIG5hbWUgb2YgdGhlIGNvbHVtbiB0aGF0IHJlcHJlc2VudHMgdGhlIGRhdGEuXG4gICAqL1xuICBzb3J0aW5nRGF0YUFjY2Vzc29yOiAoKGRhdGE6IFQsIHNvcnRIZWFkZXJJZDogc3RyaW5nKSA9PiBzdHJpbmd8bnVtYmVyKSA9XG4gICAgICAoZGF0YTogVCwgc29ydEhlYWRlcklkOiBzdHJpbmcpOiBzdHJpbmd8bnVtYmVyID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IChkYXRhIGFzIHtba2V5OiBzdHJpbmddOiBhbnl9KVtzb3J0SGVhZGVySWRdO1xuXG4gICAgaWYgKF9pc051bWJlclZhbHVlKHZhbHVlKSkge1xuICAgICAgY29uc3QgbnVtYmVyVmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuXG4gICAgICAvLyBOdW1iZXJzIGJleW9uZCBgTUFYX1NBRkVfSU5URUdFUmAgY2FuJ3QgYmUgY29tcGFyZWQgcmVsaWFibHkgc28gd2VcbiAgICAgIC8vIGxlYXZlIHRoZW0gYXMgc3RyaW5ncy4gRm9yIG1vcmUgaW5mbzogaHR0cHM6Ly9nb28uZ2wveTV2YlNnXG4gICAgICByZXR1cm4gbnVtYmVyVmFsdWUgPCBNQVhfU0FGRV9JTlRFR0VSID8gbnVtYmVyVmFsdWUgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhIGFycmF5IGJhc2VkIG9uIHRoZSBzdGF0ZSBvZiB0aGUgTWF0U29ydC4gQ2FsbGVkXG4gICAqIGFmdGVyIGNoYW5nZXMgYXJlIG1hZGUgdG8gdGhlIGZpbHRlcmVkIGRhdGEgb3Igd2hlbiBzb3J0IGNoYW5nZXMgYXJlIGVtaXR0ZWQgZnJvbSBNYXRTb3J0LlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgZnVuY3Rpb24gcmV0cmlldmVzIHRoZSBhY3RpdmUgc29ydCBhbmQgaXRzIGRpcmVjdGlvbiBhbmQgY29tcGFyZXMgZGF0YVxuICAgKiBieSByZXRyaWV2aW5nIGRhdGEgdXNpbmcgdGhlIHNvcnRpbmdEYXRhQWNjZXNzb3IuIE1heSBiZSBvdmVycmlkZGVuIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgKiBvZiBkYXRhIG9yZGVyaW5nLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgYXJyYXkgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSBzb3J0ZWQuXG4gICAqIEBwYXJhbSBzb3J0IFRoZSBjb25uZWN0ZWQgTWF0U29ydCB0aGF0IGhvbGRzIHRoZSBjdXJyZW50IHNvcnQgc3RhdGUuXG4gICAqL1xuICBzb3J0RGF0YTogKChkYXRhOiBUW10sIHNvcnQ6IE1hdFNvcnQpID0+IFRbXSkgPSAoZGF0YTogVFtdLCBzb3J0OiBNYXRTb3J0KTogVFtdID0+IHtcbiAgICBjb25zdCBhY3RpdmUgPSBzb3J0LmFjdGl2ZTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBzb3J0LmRpcmVjdGlvbjtcbiAgICBpZiAoIWFjdGl2ZSB8fCBkaXJlY3Rpb24gPT0gJycpIHsgcmV0dXJuIGRhdGE7IH1cblxuICAgIHJldHVybiBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGxldCB2YWx1ZUEgPSB0aGlzLnNvcnRpbmdEYXRhQWNjZXNzb3IoYSwgYWN0aXZlKTtcbiAgICAgIGxldCB2YWx1ZUIgPSB0aGlzLnNvcnRpbmdEYXRhQWNjZXNzb3IoYiwgYWN0aXZlKTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIGRhdGEgaW4gdGhlIGNvbHVtbiB0aGF0IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSBudW1iZXIsXG4gICAgICAvLyBpdCBtdXN0IGJlIGVuc3VyZWQgdGhhdCB0aGUgcmVzdCBvZiB0aGUgZGF0YVxuICAgICAgLy8gaXMgb2YgdGhlIHNhbWUgdHlwZSBzbyBhcyBub3QgdG8gb3JkZXIgaW5jb3JyZWN0bHkuXG4gICAgICBjb25zdCB2YWx1ZUFUeXBlID0gdHlwZW9mIHZhbHVlQTtcbiAgICAgIGNvbnN0IHZhbHVlQlR5cGUgPSB0eXBlb2YgdmFsdWVCO1xuXG4gICAgICBpZiAodmFsdWVBVHlwZSAhPT0gdmFsdWVCVHlwZSkge1xuICAgICAgICBpZiAodmFsdWVBVHlwZSA9PT0gJ251bWJlcicpIHsgdmFsdWVBICs9ICcnOyB9XG4gICAgICAgIGlmICh2YWx1ZUJUeXBlID09PSAnbnVtYmVyJykgeyB2YWx1ZUIgKz0gJyc7IH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgYm90aCB2YWx1ZUEgYW5kIHZhbHVlQiBleGlzdCAodHJ1dGh5KSwgdGhlbiBjb21wYXJlIHRoZSB0d28uIE90aGVyd2lzZSwgY2hlY2sgaWZcbiAgICAgIC8vIG9uZSB2YWx1ZSBleGlzdHMgd2hpbGUgdGhlIG90aGVyIGRvZXNuJ3QuIEluIHRoaXMgY2FzZSwgZXhpc3RpbmcgdmFsdWUgc2hvdWxkIGNvbWUgbGFzdC5cbiAgICAgIC8vIFRoaXMgYXZvaWRzIGluY29uc2lzdGVudCByZXN1bHRzIHdoZW4gY29tcGFyaW5nIHZhbHVlcyB0byB1bmRlZmluZWQvbnVsbC5cbiAgICAgIC8vIElmIG5laXRoZXIgdmFsdWUgZXhpc3RzLCByZXR1cm4gMCAoZXF1YWwpLlxuICAgICAgbGV0IGNvbXBhcmF0b3JSZXN1bHQgPSAwO1xuICAgICAgaWYgKHZhbHVlQSAhPSBudWxsICYmIHZhbHVlQiAhPSBudWxsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG9uZSB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gdGhlIG90aGVyOyBpZiBlcXVhbCwgY29tcGFyYXRvclJlc3VsdCBzaG91bGQgcmVtYWluIDAuXG4gICAgICAgIGlmICh2YWx1ZUEgPiB2YWx1ZUIpIHtcbiAgICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZUEgPCB2YWx1ZUIpIHtcbiAgICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gLTE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodmFsdWVBICE9IG51bGwpIHtcbiAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlQiAhPSBudWxsKSB7XG4gICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbXBhcmF0b3JSZXN1bHQgKiAoZGlyZWN0aW9uID09ICdhc2MnID8gMSA6IC0xKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBkYXRhIG9iamVjdCBtYXRjaGVzIHRoZSBkYXRhIHNvdXJjZSdzIGZpbHRlciBzdHJpbmcuIEJ5IGRlZmF1bHQsIGVhY2ggZGF0YSBvYmplY3RcbiAgICogaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIG9mIGl0cyBwcm9wZXJ0aWVzIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGZpbHRlciBoYXNcbiAgICogYXQgbGVhc3Qgb25lIG9jY3VycmVuY2UgaW4gdGhhdCBzdHJpbmcuIEJ5IGRlZmF1bHQsIHRoZSBmaWx0ZXIgc3RyaW5nIGhhcyBpdHMgd2hpdGVzcGFjZVxuICAgKiB0cmltbWVkIGFuZCB0aGUgbWF0Y2ggaXMgY2FzZS1pbnNlbnNpdGl2ZS4gTWF5IGJlIG92ZXJyaWRkZW4gZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uIG9mXG4gICAqIGZpbHRlciBtYXRjaGluZy5cbiAgICogQHBhcmFtIGRhdGEgRGF0YSBvYmplY3QgdXNlZCB0byBjaGVjayBhZ2FpbnN0IHRoZSBmaWx0ZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgRmlsdGVyIHN0cmluZyB0aGF0IGhhcyBiZWVuIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGZpbHRlciBtYXRjaGVzIGFnYWluc3QgdGhlIGRhdGFcbiAgICovXG4gIGZpbHRlclByZWRpY2F0ZTogKChkYXRhOiBULCBmaWx0ZXI6IHN0cmluZykgPT4gYm9vbGVhbikgPSAoZGF0YTogVCwgZmlsdGVyOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGRhdGEgaW50byBhIGxvd2VyY2FzZSBzdHJpbmcgb2YgYWxsIHByb3BlcnR5IHZhbHVlcy5cbiAgICBjb25zdCBkYXRhU3RyID0gT2JqZWN0LmtleXMoZGF0YSkucmVkdWNlKChjdXJyZW50VGVybTogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgLy8gVXNlIGFuIG9ic2N1cmUgVW5pY29kZSBjaGFyYWN0ZXIgdG8gZGVsaW1pdCB0aGUgd29yZHMgaW4gdGhlIGNvbmNhdGVuYXRlZCBzdHJpbmcuXG4gICAgICAvLyBUaGlzIGF2b2lkcyBtYXRjaGVzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgdHdvIGNvbHVtbnMgY29tYmluZWQgd2lsbCBtYXRjaCB0aGUgdXNlcidzIHF1ZXJ5XG4gICAgICAvLyAoZS5nLiBgRmx1dGVgIGFuZCBgU3RvcGAgd2lsbCBtYXRjaCBgVGVzdGApLiBUaGUgY2hhcmFjdGVyIGlzIGludGVuZGVkIHRvIGJlIHNvbWV0aGluZ1xuICAgICAgLy8gdGhhdCBoYXMgYSB2ZXJ5IGxvdyBjaGFuY2Ugb2YgYmVpbmcgdHlwZWQgaW4gYnkgc29tZWJvZHkgaW4gYSB0ZXh0IGZpZWxkLiBUaGlzIG9uZSBpblxuICAgICAgLy8gcGFydGljdWxhciBpcyBcIldoaXRlIHVwLXBvaW50aW5nIHRyaWFuZ2xlIHdpdGggZG90XCIgZnJvbVxuICAgICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9Vbmljb2RlX2NoYXJhY3RlcnNcbiAgICAgIHJldHVybiBjdXJyZW50VGVybSArIChkYXRhIGFzIHtba2V5OiBzdHJpbmddOiBhbnl9KVtrZXldICsgJ+KXrCc7XG4gICAgfSwgJycpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGZpbHRlciBieSBjb252ZXJ0aW5nIGl0IHRvIGxvd2VyY2FzZSBhbmQgcmVtb3Zpbmcgd2hpdGVzcGFjZS5cbiAgICBjb25zdCB0cmFuc2Zvcm1lZEZpbHRlciA9IGZpbHRlci50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiBkYXRhU3RyLmluZGV4T2YodHJhbnNmb3JtZWRGaWx0ZXIpICE9IC0xO1xuICB9XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbERhdGE6IFRbXSA9IFtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KGluaXRpYWxEYXRhKTtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gY2hhbmdlcyB0aGF0IHNob3VsZCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCByb3dzLiBXaGVuIHRoZVxuICAgKiBjaGFuZ2VzIG9jY3VyLCBwcm9jZXNzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBmaWx0ZXIsIHNvcnQsIGFuZCBwYWdpbmF0aW9uIGFsb25nIHdpdGhcbiAgICogdGhlIHByb3ZpZGVkIGJhc2UgZGF0YSBhbmQgc2VuZCBpdCB0byB0aGUgdGFibGUgZm9yIHJlbmRlcmluZy5cbiAgICovXG4gIF91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKSB7XG4gICAgLy8gU29ydGluZyBhbmQvb3IgcGFnaW5hdGlvbiBzaG91bGQgYmUgd2F0Y2hlZCBpZiBNYXRTb3J0IGFuZC9vciBNYXRQYWdpbmF0b3IgYXJlIHByb3ZpZGVkLlxuICAgIC8vIFRoZSBldmVudHMgc2hvdWxkIGVtaXQgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBlbWl0cyBhIGNoYW5nZSBvciBpbml0aWFsaXplcywgb3IgaWYgbm9cbiAgICAvLyBjb21wb25lbnQgaXMgcHJvdmlkZWQsIGEgc3RyZWFtIHdpdGgganVzdCBhIG51bGwgZXZlbnQgc2hvdWxkIGJlIHByb3ZpZGVkLlxuICAgIC8vIFRoZSBgc29ydENoYW5nZWAgYW5kIGBwYWdlQ2hhbmdlYCBhY3RzIGFzIGEgc2lnbmFsIHRvIHRoZSBjb21iaW5lTGF0ZXN0cyBiZWxvdyBzbyB0aGF0IHRoZVxuICAgIC8vIHBpcGVsaW5lIGNhbiBwcm9ncmVzcyB0byB0aGUgbmV4dCBzdGVwLiBOb3RlIHRoYXQgdGhlIHZhbHVlIGZyb20gdGhlc2Ugc3RyZWFtcyBhcmUgbm90IHVzZWQsXG4gICAgLy8gdGhleSBwdXJlbHkgYWN0IGFzIGEgc2lnbmFsIHRvIHByb2dyZXNzIGluIHRoZSBwaXBlbGluZS5cbiAgICBjb25zdCBzb3J0Q2hhbmdlOiBPYnNlcnZhYmxlPFNvcnR8bnVsbHx2b2lkPiA9IHRoaXMuX3NvcnQgP1xuICAgICAgICBtZXJnZSh0aGlzLl9zb3J0LnNvcnRDaGFuZ2UsIHRoaXMuX3NvcnQuaW5pdGlhbGl6ZWQpIGFzIE9ic2VydmFibGU8U29ydHx2b2lkPiA6XG4gICAgICAgIG9ic2VydmFibGVPZihudWxsKTtcbiAgICBjb25zdCBwYWdlQ2hhbmdlOiBPYnNlcnZhYmxlPE1hdFRhYmxlRGF0YVNvdXJjZVBhZ2VFdmVudHxudWxsfHZvaWQ+ID0gdGhpcy5fcGFnaW5hdG9yID9cbiAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgdGhpcy5fcGFnaW5hdG9yLnBhZ2UsXG4gICAgICAgICAgdGhpcy5faW50ZXJuYWxQYWdlQ2hhbmdlcyxcbiAgICAgICAgICB0aGlzLl9wYWdpbmF0b3IuaW5pdGlhbGl6ZWRcbiAgICAgICAgKSBhcyBPYnNlcnZhYmxlPE1hdFRhYmxlRGF0YVNvdXJjZVBhZ2VFdmVudHx2b2lkPiA6XG4gICAgICAgIG9ic2VydmFibGVPZihudWxsKTtcbiAgICBjb25zdCBkYXRhU3RyZWFtID0gdGhpcy5fZGF0YTtcbiAgICAvLyBXYXRjaCBmb3IgYmFzZSBkYXRhIG9yIGZpbHRlciBjaGFuZ2VzIHRvIHByb3ZpZGUgYSBmaWx0ZXJlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSBjb21iaW5lTGF0ZXN0KFtkYXRhU3RyZWFtLCB0aGlzLl9maWx0ZXJdKVxuICAgICAgLnBpcGUobWFwKChbZGF0YV0pID0+IHRoaXMuX2ZpbHRlckRhdGEoZGF0YSkpKTtcbiAgICAvLyBXYXRjaCBmb3IgZmlsdGVyZWQgZGF0YSBvciBzb3J0IGNoYW5nZXMgdG8gcHJvdmlkZSBhbiBvcmRlcmVkIHNldCBvZiBkYXRhLlxuICAgIGNvbnN0IG9yZGVyZWREYXRhID0gY29tYmluZUxhdGVzdChbZmlsdGVyZWREYXRhLCBzb3J0Q2hhbmdlXSlcbiAgICAgIC5waXBlKG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9vcmRlckRhdGEoZGF0YSkpKTtcbiAgICAvLyBXYXRjaCBmb3Igb3JkZXJlZCBkYXRhIG9yIHBhZ2UgY2hhbmdlcyB0byBwcm92aWRlIGEgcGFnZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3QgcGFnaW5hdGVkRGF0YSA9IGNvbWJpbmVMYXRlc3QoW29yZGVyZWREYXRhLCBwYWdlQ2hhbmdlXSlcbiAgICAgIC5waXBlKG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9wYWdlRGF0YShkYXRhKSkpO1xuICAgIC8vIFdhdGNoZWQgZm9yIHBhZ2VkIGRhdGEgY2hhbmdlcyBhbmQgc2VuZCB0aGUgcmVzdWx0IHRvIHRoZSB0YWJsZSB0byByZW5kZXIuXG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uID0gcGFnaW5hdGVkRGF0YS5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLl9yZW5kZXJEYXRhLm5leHQoZGF0YSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmaWx0ZXJlZCBkYXRhIGFycmF5IHdoZXJlIGVhY2ggZmlsdGVyIG9iamVjdCBjb250YWlucyB0aGUgZmlsdGVyIHN0cmluZyB3aXRoaW5cbiAgICogdGhlIHJlc3VsdCBvZiB0aGUgZmlsdGVyVGVybUFjY2Vzc29yIGZ1bmN0aW9uLiBJZiBubyBmaWx0ZXIgaXMgc2V0LCByZXR1cm5zIHRoZSBkYXRhIGFycmF5XG4gICAqIGFzIHByb3ZpZGVkLlxuICAgKi9cbiAgX2ZpbHRlckRhdGEoZGF0YTogVFtdKSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgYSBmaWx0ZXIgc3RyaW5nLCBmaWx0ZXIgb3V0IGRhdGEgdGhhdCBkb2VzIG5vdCBjb250YWluIGl0LlxuICAgIC8vIEVhY2ggZGF0YSBvYmplY3QgaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIHVzaW5nIHRoZSBmdW5jdGlvbiBkZWZpbmVkIGJ5IGZpbHRlclRlcm1BY2Nlc3Nvci5cbiAgICAvLyBNYXkgYmUgb3ZlcnJpZGRlbiBmb3IgY3VzdG9taXphdGlvbi5cbiAgICB0aGlzLmZpbHRlcmVkRGF0YSA9ICh0aGlzLmZpbHRlciA9PSBudWxsIHx8IHRoaXMuZmlsdGVyID09PSAnJykgPyBkYXRhIDpcbiAgICAgICAgZGF0YS5maWx0ZXIob2JqID0+IHRoaXMuZmlsdGVyUHJlZGljYXRlKG9iaiwgdGhpcy5maWx0ZXIpKTtcblxuICAgIGlmICh0aGlzLnBhZ2luYXRvcikgeyB0aGlzLl91cGRhdGVQYWdpbmF0b3IodGhpcy5maWx0ZXJlZERhdGEubGVuZ3RoKTsgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyZWREYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzb3J0ZWQgY29weSBvZiB0aGUgZGF0YSBpZiBNYXRTb3J0IGhhcyBhIHNvcnQgYXBwbGllZCwgb3RoZXJ3aXNlIGp1c3QgcmV0dXJucyB0aGVcbiAgICogZGF0YSBhcnJheSBhcyBwcm92aWRlZC4gVXNlcyB0aGUgZGVmYXVsdCBkYXRhIGFjY2Vzc29yIGZvciBkYXRhIGxvb2t1cCwgdW5sZXNzIGFcbiAgICogc29ydERhdGFBY2Nlc3NvciBmdW5jdGlvbiBpcyBkZWZpbmVkLlxuICAgKi9cbiAgX29yZGVyRGF0YShkYXRhOiBUW10pOiBUW10ge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGFjdGl2ZSBzb3J0IG9yIGRpcmVjdGlvbiwgcmV0dXJuIHRoZSBkYXRhIHdpdGhvdXQgdHJ5aW5nIHRvIHNvcnQuXG4gICAgaWYgKCF0aGlzLnNvcnQpIHsgcmV0dXJuIGRhdGE7IH1cblxuICAgIHJldHVybiB0aGlzLnNvcnREYXRhKGRhdGEuc2xpY2UoKSwgdGhpcy5zb3J0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcGFnZWQgc2xpY2Ugb2YgdGhlIHByb3ZpZGVkIGRhdGEgYXJyYXkgYWNjb3JkaW5nIHRvIHRoZSBwcm92aWRlZCBNYXRQYWdpbmF0b3IncyBwYWdlXG4gICAqIGluZGV4IGFuZCBsZW5ndGguIElmIHRoZXJlIGlzIG5vIHBhZ2luYXRvciBwcm92aWRlZCwgcmV0dXJucyB0aGUgZGF0YSBhcnJheSBhcyBwcm92aWRlZC5cbiAgICovXG4gIF9wYWdlRGF0YShkYXRhOiBUW10pOiBUW10ge1xuICAgIGlmICghdGhpcy5wYWdpbmF0b3IpIHsgcmV0dXJuIGRhdGE7IH1cblxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggKiB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZTtcbiAgICByZXR1cm4gZGF0YS5zbGljZShzdGFydEluZGV4LCBzdGFydEluZGV4ICsgdGhpcy5wYWdpbmF0b3IucGFnZVNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBhZ2luYXRvciB0byByZWZsZWN0IHRoZSBsZW5ndGggb2YgdGhlIGZpbHRlcmVkIGRhdGEsIGFuZCBtYWtlcyBzdXJlIHRoYXQgdGhlIHBhZ2VcbiAgICogaW5kZXggZG9lcyBub3QgZXhjZWVkIHRoZSBwYWdpbmF0b3IncyBsYXN0IHBhZ2UuIFZhbHVlcyBhcmUgY2hhbmdlZCBpbiBhIHJlc29sdmVkIHByb21pc2UgdG9cbiAgICogZ3VhcmQgYWdhaW5zdCBtYWtpbmcgcHJvcGVydHkgY2hhbmdlcyB3aXRoaW4gYSByb3VuZCBvZiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKi9cbiAgX3VwZGF0ZVBhZ2luYXRvcihmaWx0ZXJlZERhdGFMZW5ndGg6IG51bWJlcikge1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgcGFnaW5hdG9yID0gdGhpcy5wYWdpbmF0b3I7XG5cbiAgICAgIGlmICghcGFnaW5hdG9yKSB7IHJldHVybjsgfVxuXG4gICAgICBwYWdpbmF0b3IubGVuZ3RoID0gZmlsdGVyZWREYXRhTGVuZ3RoO1xuXG4gICAgICAvLyBJZiB0aGUgcGFnZSBpbmRleCBpcyBzZXQgYmV5b25kIHRoZSBwYWdlLCByZWR1Y2UgaXQgdG8gdGhlIGxhc3QgcGFnZS5cbiAgICAgIGlmIChwYWdpbmF0b3IucGFnZUluZGV4ID4gMCkge1xuICAgICAgICBjb25zdCBsYXN0UGFnZUluZGV4ID0gTWF0aC5jZWlsKHBhZ2luYXRvci5sZW5ndGggLyBwYWdpbmF0b3IucGFnZVNpemUpIC0gMSB8fCAwO1xuICAgICAgICBjb25zdCBuZXdQYWdlSW5kZXggPSBNYXRoLm1pbihwYWdpbmF0b3IucGFnZUluZGV4LCBsYXN0UGFnZUluZGV4KTtcblxuICAgICAgICBpZiAobmV3UGFnZUluZGV4ICE9PSBwYWdpbmF0b3IucGFnZUluZGV4KSB7XG4gICAgICAgICAgcGFnaW5hdG9yLnBhZ2VJbmRleCA9IG5ld1BhZ2VJbmRleDtcblxuICAgICAgICAgIC8vIFNpbmNlIHRoZSBwYWdpbmF0b3Igb25seSBlbWl0cyBhZnRlciB1c2VyLWdlbmVyYXRlZCBjaGFuZ2VzLFxuICAgICAgICAgIC8vIHdlIG5lZWQgb3VyIG93biBzdHJlYW0gc28gd2Uga25vdyB0byBzaG91bGQgcmUtcmVuZGVyIHRoZSBkYXRhLlxuICAgICAgICAgIHRoaXMuX2ludGVybmFsUGFnZUNoYW5nZXMubmV4dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSB0aGUgTWF0VGFibGUuIENhbGxlZCB3aGVuIGl0IGNvbm5lY3RzIHRvIHRoZSBkYXRhIHNvdXJjZS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdCgpIHtcbiAgICBpZiAoIXRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUNoYW5nZVN1YnNjcmlwdGlvbigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9yZW5kZXJEYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIE1hdFRhYmxlLiBDYWxsZWQgd2hlbiBpdCBkaXNjb25uZWN0cyBmcm9tIHRoZSBkYXRhIHNvdXJjZS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24gPSBudWxsO1xuICB9XG59XG5cbi8qKlxuICogRGF0YSBzb3VyY2UgdGhhdCBhY2NlcHRzIGEgY2xpZW50LXNpZGUgZGF0YSBhcnJheSBhbmQgaW5jbHVkZXMgbmF0aXZlIHN1cHBvcnQgb2YgZmlsdGVyaW5nLFxuICogc29ydGluZyAodXNpbmcgTWF0U29ydCksIGFuZCBwYWdpbmF0aW9uICh1c2luZyBNYXRQYWdpbmF0b3IpLlxuICpcbiAqIEFsbG93cyBmb3Igc29ydCBjdXN0b21pemF0aW9uIGJ5IG92ZXJyaWRpbmcgc29ydGluZ0RhdGFBY2Nlc3Nvciwgd2hpY2ggZGVmaW5lcyBob3cgZGF0YVxuICogcHJvcGVydGllcyBhcmUgYWNjZXNzZWQuIEFsc28gYWxsb3dzIGZvciBmaWx0ZXIgY3VzdG9taXphdGlvbiBieSBvdmVycmlkaW5nIGZpbHRlclRlcm1BY2Nlc3NvcixcbiAqIHdoaWNoIGRlZmluZXMgaG93IHJvdyBkYXRhIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBmb3IgZmlsdGVyIG1hdGNoaW5nLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGNsYXNzIGlzIG1lYW50IHRvIGJlIGEgc2ltcGxlIGRhdGEgc291cmNlIHRvIGhlbHAgeW91IGdldCBzdGFydGVkLiBBcyBzdWNoXG4gKiBpdCBpc24ndCBlcXVpcHBlZCB0byBoYW5kbGUgc29tZSBtb3JlIGFkdmFuY2VkIGNhc2VzIGxpa2Ugcm9idXN0IGkxOG4gc3VwcG9ydCBvciBzZXJ2ZXItc2lkZVxuICogaW50ZXJhY3Rpb25zLiBJZiB5b3VyIGFwcCBuZWVkcyB0byBzdXBwb3J0IG1vcmUgYWR2YW5jZWQgdXNlIGNhc2VzLCBjb25zaWRlciBpbXBsZW1lbnRpbmcgeW91clxuICogb3duIGBEYXRhU291cmNlYC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYmxlRGF0YVNvdXJjZTxUPiBleHRlbmRzIF9NYXRUYWJsZURhdGFTb3VyY2U8VCwgTWF0UGFnaW5hdG9yPiB7fVxuIl19