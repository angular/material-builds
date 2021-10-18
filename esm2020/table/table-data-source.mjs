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
            const dataStr = Object.keys(data)
                .reduce((currentTerm, key) => {
                // Use an obscure Unicode character to delimit the words in the concatenated string.
                // This avoids matches where the values of two columns combined will match the user's query
                // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                // that has a very low chance of being typed in by somebody in a text field. This one in
                // particular is "White up-pointing triangle with dot" from
                // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                return currentTerm + data[key] + '◬';
            }, '')
                .toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        };
        this._data = new BehaviorSubject(initialData);
        this._updateChangeSubscription();
    }
    /** Array of data that should be rendered by the table, where each object represents one row. */
    get data() {
        return this._data.value;
    }
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
    get filter() {
        return this._filter.value;
    }
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
    get sort() {
        return this._sort;
    }
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
    get paginator() {
        return this._paginator;
    }
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
        const sortChange = this._sort
            ? merge(this._sort.sortChange, this._sort.initialized)
            : observableOf(null);
        const pageChange = this._paginator
            ? merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized)
            : observableOf(null);
        const dataStream = this._data;
        // Watch for base data or filter changes to provide a filtered set of data.
        const filteredData = combineLatest([dataStream, this._filter]).pipe(map(([data]) => this._filterData(data)));
        // Watch for filtered data or sort changes to provide an ordered set of data.
        const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
        // Watch for ordered data or page changes to provide a paged set of data.
        const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this._pageData(data)));
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
        this.filteredData =
            this.filter == null || this.filter === ''
                ? data
                : data.filter(obj => this.filterPredicate(obj, this.filter));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUc5QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYixLQUFLLEVBRUwsRUFBRSxJQUFJLFlBQVksRUFDbEIsT0FBTyxHQUVSLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DOzs7R0FHRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUF3QjFDLHVEQUF1RDtBQUN2RCxNQUFNLE9BQU8sbUJBR1gsU0FBUSxVQUFhO0lBeU1yQixZQUFZLGNBQW1CLEVBQUU7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUF0TVYsa0ZBQWtGO1FBQ2pFLGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQU0sRUFBRSxDQUFDLENBQUM7UUFFNUQsNEVBQTRFO1FBQzNELFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzRCxrR0FBa0c7UUFDakYseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUU1RDs7O1dBR0c7UUFDSCwrQkFBMEIsR0FBd0IsSUFBSSxDQUFDO1FBdUV2RDs7Ozs7Ozs7V0FRRztRQUNILHdCQUFtQixHQUF1RCxDQUN4RSxJQUFPLEVBQ1AsWUFBb0IsRUFDSCxFQUFFO1lBQ25CLE1BQU0sS0FBSyxHQUFJLElBQTZCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFM0QsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3pCLE1BQU0s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LEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBRWxFLElBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQyxTQUFTLEVBQUU7b0JBQ3hDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO29CQUVuQywrREFBK0Q7b0JBQy9ELGtFQUFrRTtvQkFDbEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsQzthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7WUFDcEMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDbEM7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFVBQVU7UUFDUixJQUFJLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLE9BQU8sa0JBQXNCLFNBQVEsbUJBQW9DO0NBQUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtfaXNOdW1iZXJWYWx1ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGF0YVNvdXJjZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7TWF0UGFnaW5hdG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wYWdpbmF0b3InO1xuaW1wb3J0IHtNYXRTb3J0LCBTb3J0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zb3J0JztcbmltcG9ydCB7XG4gIEJlaGF2aW9yU3ViamVjdCxcbiAgY29tYmluZUxhdGVzdCxcbiAgbWVyZ2UsXG4gIE9ic2VydmFibGUsXG4gIG9mIGFzIG9ic2VydmFibGVPZixcbiAgU3ViamVjdCxcbiAgU3Vic2NyaXB0aW9uLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogQ29ycmVzcG9uZHMgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC4gTW92ZWQgb3V0IGludG8gYSB2YXJpYWJsZSBoZXJlIGR1ZSB0b1xuICogZmxha3kgYnJvd3NlciBzdXBwb3J0IGFuZCB0aGUgdmFsdWUgbm90IGJlaW5nIGRlZmluZWQgaW4gQ2xvc3VyZSdzIHR5cGluZ3MuXG4gKi9cbmNvbnN0IE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IG1hdGNoZXMgdGhlIHJlcXVpcmVkIEFQSSBwYXJ0cyBmb3IgdGhlIE1hdFBhZ2luYXRvcidzIFBhZ2VFdmVudC5cbiAqIERlY291cGxlZCBzbyB0aGF0IHVzZXJzIGNhbiBkZXBlbmQgb24gZWl0aGVyIHRoZSBsZWdhY3kgb3IgTURDLWJhc2VkIHBhZ2luYXRvci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRUYWJsZURhdGFTb3VyY2VQYWdlRXZlbnQge1xuICBwYWdlSW5kZXg6IG51bWJlcjtcbiAgcGFnZVNpemU6IG51bWJlcjtcbiAgbGVuZ3RoOiBudW1iZXI7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgbWF0Y2hlcyB0aGUgcmVxdWlyZWQgQVBJIHBhcnRzIG9mIHRoZSBNYXRQYWdpbmF0b3IuXG4gKiBEZWNvdXBsZWQgc28gdGhhdCB1c2VycyBjYW4gZGVwZW5kIG9uIGVpdGhlciB0aGUgbGVnYWN5IG9yIE1EQy1iYXNlZCBwYWdpbmF0b3IuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VGFibGVEYXRhU291cmNlUGFnaW5hdG9yIHtcbiAgcGFnZTogU3ViamVjdDxNYXRUYWJsZURhdGFTb3VyY2VQYWdlRXZlbnQ+O1xuICBwYWdlSW5kZXg6IG51bWJlcjtcbiAgaW5pdGlhbGl6ZWQ6IE9ic2VydmFibGU8dm9pZD47XG4gIHBhZ2VTaXplOiBudW1iZXI7XG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG4vKiogU2hhcmVkIGJhc2UgY2xhc3Mgd2l0aCBNREMtYmFzZWQgaW1wbGVtZW50YXRpb24uICovXG5leHBvcnQgY2xhc3MgX01hdFRhYmxlRGF0YVNvdXJjZTxcbiAgVCxcbiAgUCBleHRlbmRzIE1hdFRhYmxlRGF0YVNvdXJjZVBhZ2luYXRvciA9IE1hdFRhYmxlRGF0YVNvdXJjZVBhZ2luYXRvcixcbj4gZXh0ZW5kcyBEYXRhU291cmNlPFQ+IHtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBuZXcgZGF0YSBhcnJheSBpcyBzZXQgb24gdGhlIGRhdGEgc291cmNlLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kYXRhOiBCZWhhdmlvclN1YmplY3Q8VFtdPjtcblxuICAvKiogU3RyZWFtIGVtaXR0aW5nIHJlbmRlciBkYXRhIHRvIHRoZSB0YWJsZSAoZGVwZW5kcyBvbiBvcmRlcmVkIGRhdGEgY2hhbmdlcykuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX3JlbmRlckRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFRbXT4oW10pO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgbmV3IGZpbHRlciBzdHJpbmcgaXMgc2V0IG9uIHRoZSBkYXRhIHNvdXJjZS4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZmlsdGVyID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KCcnKTtcblxuICAvKiogVXNlZCB0byByZWFjdCB0byBpbnRlcm5hbCBjaGFuZ2VzIG9mIHRoZSBwYWdpbmF0b3IgdGhhdCBhcmUgbWFkZSBieSB0aGUgZGF0YSBzb3VyY2UgaXRzZWxmLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcm5hbFBhZ2VDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9uIHRvIHRoZSBjaGFuZ2VzIHRoYXQgc2hvdWxkIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZSB0YWJsZSdzIHJlbmRlcmVkIHJvd3MsIHN1Y2hcbiAgICogYXMgZmlsdGVyaW5nLCBzb3J0aW5nLCBwYWdpbmF0aW9uLCBvciBiYXNlIGRhdGEgY2hhbmdlcy5cbiAgICovXG4gIF9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogVGhlIGZpbHRlcmVkIHNldCBvZiBkYXRhIHRoYXQgaGFzIGJlZW4gbWF0Y2hlZCBieSB0aGUgZmlsdGVyIHN0cmluZywgb3IgYWxsIHRoZSBkYXRhIGlmIHRoZXJlXG4gICAqIGlzIG5vIGZpbHRlci4gVXNlZnVsIGZvciBrbm93aW5nIHRoZSBzZXQgb2YgZGF0YSB0aGUgdGFibGUgcmVwcmVzZW50cy5cbiAgICogRm9yIGV4YW1wbGUsIGEgJ3NlbGVjdEFsbCgpJyBmdW5jdGlvbiB3b3VsZCBsaWtlbHkgd2FudCB0byBzZWxlY3QgdGhlIHNldCBvZiBmaWx0ZXJlZCBkYXRhXG4gICAqIHNob3duIHRvIHRoZSB1c2VyIHJhdGhlciB0aGFuIGFsbCB0aGUgZGF0YS5cbiAgICovXG4gIGZpbHRlcmVkRGF0YTogVFtdO1xuXG4gIC8qKiBBcnJheSBvZiBkYXRhIHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkIGJ5IHRoZSB0YWJsZSwgd2hlcmUgZWFjaCBvYmplY3QgcmVwcmVzZW50cyBvbmUgcm93LiAqL1xuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZTtcbiAgfVxuICBzZXQgZGF0YShkYXRhOiBUW10pIHtcbiAgICB0aGlzLl9kYXRhLm5leHQoZGF0YSk7XG4gICAgLy8gTm9ybWFsbHkgdGhlIGBmaWx0ZXJlZERhdGFgIGlzIHVwZGF0ZWQgYnkgdGhlIHJlLXJlbmRlclxuICAgIC8vIHN1YnNjcmlwdGlvbiwgYnV0IHRoYXQgd29uJ3QgaGFwcGVuIGlmIGl0J3MgaW5hY3RpdmUuXG4gICAgaWYgKCF0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9maWx0ZXJEYXRhKGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXIgdGVybSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGZpbHRlciBvdXQgb2JqZWN0cyBmcm9tIHRoZSBkYXRhIGFycmF5LiBUbyBvdmVycmlkZSBob3dcbiAgICogZGF0YSBvYmplY3RzIG1hdGNoIHRvIHRoaXMgZmlsdGVyIHN0cmluZywgcHJvdmlkZSBhIGN1c3RvbSBmdW5jdGlvbiBmb3IgZmlsdGVyUHJlZGljYXRlLlxuICAgKi9cbiAgZ2V0IGZpbHRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9maWx0ZXIudmFsdWU7XG4gIH1cbiAgc2V0IGZpbHRlcihmaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX2ZpbHRlci5uZXh0KGZpbHRlcik7XG4gICAgLy8gTm9ybWFsbHkgdGhlIGBmaWx0ZXJlZERhdGFgIGlzIHVwZGF0ZWQgYnkgdGhlIHJlLXJlbmRlclxuICAgIC8vIHN1YnNjcmlwdGlvbiwgYnV0IHRoYXQgd29uJ3QgaGFwcGVuIGlmIGl0J3MgaW5hY3RpdmUuXG4gICAgaWYgKCF0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9maWx0ZXJEYXRhKHRoaXMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIHRoZSBNYXRTb3J0IGRpcmVjdGl2ZSB1c2VkIGJ5IHRoZSB0YWJsZSB0byBjb250cm9sIGl0cyBzb3J0aW5nLiBTb3J0IGNoYW5nZXNcbiAgICogZW1pdHRlZCBieSB0aGUgTWF0U29ydCB3aWxsIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZSB0YWJsZSdzIHJlbmRlcmVkIGRhdGEuXG4gICAqL1xuICBnZXQgc29ydCgpOiBNYXRTb3J0IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQ7XG4gIH1cbiAgc2V0IHNvcnQoc29ydDogTWF0U29ydCB8IG51bGwpIHtcbiAgICB0aGlzLl9zb3J0ID0gc29ydDtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuICBwcml2YXRlIF9zb3J0OiBNYXRTb3J0IHwgbnVsbDtcblxuICAvKipcbiAgICogSW5zdGFuY2Ugb2YgdGhlIE1hdFBhZ2luYXRvciBjb21wb25lbnQgdXNlZCBieSB0aGUgdGFibGUgdG8gY29udHJvbCB3aGF0IHBhZ2Ugb2YgdGhlIGRhdGEgaXNcbiAgICogZGlzcGxheWVkLiBQYWdlIGNoYW5nZXMgZW1pdHRlZCBieSB0aGUgTWF0UGFnaW5hdG9yIHdpbGwgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlXG4gICAqIHRhYmxlJ3MgcmVuZGVyZWQgZGF0YS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBkYXRhIHNvdXJjZSB1c2VzIHRoZSBwYWdpbmF0b3IncyBwcm9wZXJ0aWVzIHRvIGNhbGN1bGF0ZSB3aGljaCBwYWdlIG9mIGRhdGFcbiAgICogc2hvdWxkIGJlIGRpc3BsYXllZC4gSWYgdGhlIHBhZ2luYXRvciByZWNlaXZlcyBpdHMgcHJvcGVydGllcyBhcyB0ZW1wbGF0ZSBpbnB1dHMsXG4gICAqIGUuZy4gYFtwYWdlTGVuZ3RoXT0xMDBgIG9yIGBbcGFnZUluZGV4XT0xYCwgdGhlbiBiZSBzdXJlIHRoYXQgdGhlIHBhZ2luYXRvcidzIHZpZXcgaGFzIGJlZW5cbiAgICogaW5pdGlhbGl6ZWQgYmVmb3JlIGFzc2lnbmluZyBpdCB0byB0aGlzIGRhdGEgc291cmNlLlxuICAgKi9cbiAgZ2V0IHBhZ2luYXRvcigpOiBQIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2luYXRvcjtcbiAgfVxuICBzZXQgcGFnaW5hdG9yKHBhZ2luYXRvcjogUCB8IG51bGwpIHtcbiAgICB0aGlzLl9wYWdpbmF0b3IgPSBwYWdpbmF0b3I7XG4gICAgdGhpcy5fdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnaW5hdG9yOiBQIHwgbnVsbDtcblxuICAvKipcbiAgICogRGF0YSBhY2Nlc3NvciBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgZm9yIGFjY2Vzc2luZyBkYXRhIHByb3BlcnRpZXMgZm9yIHNvcnRpbmcgdGhyb3VnaFxuICAgKiB0aGUgZGVmYXVsdCBzb3J0RGF0YSBmdW5jdGlvbi5cbiAgICogVGhpcyBkZWZhdWx0IGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCB0aGUgc29ydCBoZWFkZXIgSURzICh3aGljaCBkZWZhdWx0cyB0byB0aGUgY29sdW1uIG5hbWUpXG4gICAqIG1hdGNoZXMgdGhlIGRhdGEncyBwcm9wZXJ0aWVzIChlLmcuIGNvbHVtbiBYeXogcmVwcmVzZW50cyBkYXRhWydYeXonXSkuXG4gICAqIE1heSBiZSBzZXQgdG8gYSBjdXN0b20gZnVuY3Rpb24gZm9yIGRpZmZlcmVudCBiZWhhdmlvci5cbiAgICogQHBhcmFtIGRhdGEgRGF0YSBvYmplY3QgdGhhdCBpcyBiZWluZyBhY2Nlc3NlZC5cbiAgICogQHBhcmFtIHNvcnRIZWFkZXJJZCBUaGUgbmFtZSBvZiB0aGUgY29sdW1uIHRoYXQgcmVwcmVzZW50cyB0aGUgZGF0YS5cbiAgICovXG4gIHNvcnRpbmdEYXRhQWNjZXNzb3I6IChkYXRhOiBULCBzb3J0SGVhZGVySWQ6IHN0cmluZykgPT4gc3RyaW5nIHwgbnVtYmVyID0gKFxuICAgIGRhdGE6IFQsXG4gICAgc29ydEhlYWRlcklkOiBzdHJpbmcsXG4gICk6IHN0cmluZyB8IG51bWJlciA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZGF0YSBhcyB7W2tleTogc3RyaW5nXTogYW55fSlbc29ydEhlYWRlcklkXTtcblxuICAgIGlmIChfaXNOdW1iZXJWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG51bWJlclZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblxuICAgICAgLy8gTnVtYmVycyBiZXlvbmQgYE1BWF9TQUZFX0lOVEVHRVJgIGNhbid0IGJlIGNvbXBhcmVkIHJlbGlhYmx5IHNvIHdlXG4gICAgICAvLyBsZWF2ZSB0aGVtIGFzIHN0cmluZ3MuIEZvciBtb3JlIGluZm86IGh0dHBzOi8vZ29vLmdsL3k1dmJTZ1xuICAgICAgcmV0dXJuIG51bWJlclZhbHVlIDwgTUFYX1NBRkVfSU5URUdFUiA/IG51bWJlclZhbHVlIDogdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgc29ydGVkIGNvcHkgb2YgdGhlIGRhdGEgYXJyYXkgYmFzZWQgb24gdGhlIHN0YXRlIG9mIHRoZSBNYXRTb3J0LiBDYWxsZWRcbiAgICogYWZ0ZXIgY2hhbmdlcyBhcmUgbWFkZSB0byB0aGUgZmlsdGVyZWQgZGF0YSBvciB3aGVuIHNvcnQgY2hhbmdlcyBhcmUgZW1pdHRlZCBmcm9tIE1hdFNvcnQuXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBmdW5jdGlvbiByZXRyaWV2ZXMgdGhlIGFjdGl2ZSBzb3J0IGFuZCBpdHMgZGlyZWN0aW9uIGFuZCBjb21wYXJlcyBkYXRhXG4gICAqIGJ5IHJldHJpZXZpbmcgZGF0YSB1c2luZyB0aGUgc29ydGluZ0RhdGFBY2Nlc3Nvci4gTWF5IGJlIG92ZXJyaWRkZW4gZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4gICAqIG9mIGRhdGEgb3JkZXJpbmcuXG4gICAqIEBwYXJhbSBkYXRhIFRoZSBhcnJheSBvZiBkYXRhIHRoYXQgc2hvdWxkIGJlIHNvcnRlZC5cbiAgICogQHBhcmFtIHNvcnQgVGhlIGNvbm5lY3RlZCBNYXRTb3J0IHRoYXQgaG9sZHMgdGhlIGN1cnJlbnQgc29ydCBzdGF0ZS5cbiAgICovXG4gIHNvcnREYXRhOiAoZGF0YTogVFtdLCBzb3J0OiBNYXRTb3J0KSA9PiBUW10gPSAoZGF0YTogVFtdLCBzb3J0OiBNYXRTb3J0KTogVFtdID0+IHtcbiAgICBjb25zdCBhY3RpdmUgPSBzb3J0LmFjdGl2ZTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBzb3J0LmRpcmVjdGlvbjtcbiAgICBpZiAoIWFjdGl2ZSB8fCBkaXJlY3Rpb24gPT0gJycpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGxldCB2YWx1ZUEgPSB0aGlzLnNvcnRpbmdEYXRhQWNjZXNzb3IoYSwgYWN0aXZlKTtcbiAgICAgIGxldCB2YWx1ZUIgPSB0aGlzLnNvcnRpbmdEYXRhQWNjZXNzb3IoYiwgYWN0aXZlKTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIGRhdGEgaW4gdGhlIGNvbHVtbiB0aGF0IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSBudW1iZXIsXG4gICAgICAvLyBpdCBtdXN0IGJlIGVuc3VyZWQgdGhhdCB0aGUgcmVzdCBvZiB0aGUgZGF0YVxuICAgICAgLy8gaXMgb2YgdGhlIHNhbWUgdHlwZSBzbyBhcyBub3QgdG8gb3JkZXIgaW5jb3JyZWN0bHkuXG4gICAgICBjb25zdCB2YWx1ZUFUeXBlID0gdHlwZW9mIHZhbHVlQTtcbiAgICAgIGNvbnN0IHZhbHVlQlR5cGUgPSB0eXBlb2YgdmFsdWVCO1xuXG4gICAgICBpZiAodmFsdWVBVHlwZSAhPT0gdmFsdWVCVHlwZSkge1xuICAgICAgICBpZiAodmFsdWVBVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICB2YWx1ZUEgKz0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlQlR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdmFsdWVCICs9ICcnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGJvdGggdmFsdWVBIGFuZCB2YWx1ZUIgZXhpc3QgKHRydXRoeSksIHRoZW4gY29tcGFyZSB0aGUgdHdvLiBPdGhlcndpc2UsIGNoZWNrIGlmXG4gICAgICAvLyBvbmUgdmFsdWUgZXhpc3RzIHdoaWxlIHRoZSBvdGhlciBkb2Vzbid0LiBJbiB0aGlzIGNhc2UsIGV4aXN0aW5nIHZhbHVlIHNob3VsZCBjb21lIGxhc3QuXG4gICAgICAvLyBUaGlzIGF2b2lkcyBpbmNvbnNpc3RlbnQgcmVzdWx0cyB3aGVuIGNvbXBhcmluZyB2YWx1ZXMgdG8gdW5kZWZpbmVkL251bGwuXG4gICAgICAvLyBJZiBuZWl0aGVyIHZhbHVlIGV4aXN0cywgcmV0dXJuIDAgKGVxdWFsKS5cbiAgICAgIGxldCBjb21wYXJhdG9yUmVzdWx0ID0gMDtcbiAgICAgIGlmICh2YWx1ZUEgIT0gbnVsbCAmJiB2YWx1ZUIgIT0gbnVsbCkge1xuICAgICAgICAvLyBDaGVjayBpZiBvbmUgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBvdGhlcjsgaWYgZXF1YWwsIGNvbXBhcmF0b3JSZXN1bHQgc2hvdWxkIHJlbWFpbiAwLlxuICAgICAgICBpZiAodmFsdWVBID4gdmFsdWVCKSB7XG4gICAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWVBIDwgdmFsdWVCKSB7XG4gICAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IC0xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlQSAhPSBudWxsKSB7XG4gICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAxO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZUIgIT0gbnVsbCkge1xuICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wYXJhdG9yUmVzdWx0ICogKGRpcmVjdGlvbiA9PSAnYXNjJyA/IDEgOiAtMSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGRhdGEgb2JqZWN0IG1hdGNoZXMgdGhlIGRhdGEgc291cmNlJ3MgZmlsdGVyIHN0cmluZy4gQnkgZGVmYXVsdCwgZWFjaCBkYXRhIG9iamVjdFxuICAgKiBpcyBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgb2YgaXRzIHByb3BlcnRpZXMgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZmlsdGVyIGhhc1xuICAgKiBhdCBsZWFzdCBvbmUgb2NjdXJyZW5jZSBpbiB0aGF0IHN0cmluZy4gQnkgZGVmYXVsdCwgdGhlIGZpbHRlciBzdHJpbmcgaGFzIGl0cyB3aGl0ZXNwYWNlXG4gICAqIHRyaW1tZWQgYW5kIHRoZSBtYXRjaCBpcyBjYXNlLWluc2Vuc2l0aXZlLiBNYXkgYmUgb3ZlcnJpZGRlbiBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb24gb2ZcbiAgICogZmlsdGVyIG1hdGNoaW5nLlxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIG9iamVjdCB1c2VkIHRvIGNoZWNrIGFnYWluc3QgdGhlIGZpbHRlci5cbiAgICogQHBhcmFtIGZpbHRlciBGaWx0ZXIgc3RyaW5nIHRoYXQgaGFzIGJlZW4gc2V0IG9uIHRoZSBkYXRhIHNvdXJjZS5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZmlsdGVyIG1hdGNoZXMgYWdhaW5zdCB0aGUgZGF0YVxuICAgKi9cbiAgZmlsdGVyUHJlZGljYXRlOiAoZGF0YTogVCwgZmlsdGVyOiBzdHJpbmcpID0+IGJvb2xlYW4gPSAoZGF0YTogVCwgZmlsdGVyOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGRhdGEgaW50byBhIGxvd2VyY2FzZSBzdHJpbmcgb2YgYWxsIHByb3BlcnR5IHZhbHVlcy5cbiAgICBjb25zdCBkYXRhU3RyID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICAgIC5yZWR1Y2UoKGN1cnJlbnRUZXJtOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIFVzZSBhbiBvYnNjdXJlIFVuaWNvZGUgY2hhcmFjdGVyIHRvIGRlbGltaXQgdGhlIHdvcmRzIGluIHRoZSBjb25jYXRlbmF0ZWQgc3RyaW5nLlxuICAgICAgICAvLyBUaGlzIGF2b2lkcyBtYXRjaGVzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgdHdvIGNvbHVtbnMgY29tYmluZWQgd2lsbCBtYXRjaCB0aGUgdXNlcidzIHF1ZXJ5XG4gICAgICAgIC8vIChlLmcuIGBGbHV0ZWAgYW5kIGBTdG9wYCB3aWxsIG1hdGNoIGBUZXN0YCkuIFRoZSBjaGFyYWN0ZXIgaXMgaW50ZW5kZWQgdG8gYmUgc29tZXRoaW5nXG4gICAgICAgIC8vIHRoYXQgaGFzIGEgdmVyeSBsb3cgY2hhbmNlIG9mIGJlaW5nIHR5cGVkIGluIGJ5IHNvbWVib2R5IGluIGEgdGV4dCBmaWVsZC4gVGhpcyBvbmUgaW5cbiAgICAgICAgLy8gcGFydGljdWxhciBpcyBcIldoaXRlIHVwLXBvaW50aW5nIHRyaWFuZ2xlIHdpdGggZG90XCIgZnJvbVxuICAgICAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX1VuaWNvZGVfY2hhcmFjdGVyc1xuICAgICAgICByZXR1cm4gY3VycmVudFRlcm0gKyAoZGF0YSBhcyB7W2tleTogc3RyaW5nXTogYW55fSlba2V5XSArICfil6wnO1xuICAgICAgfSwgJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIFRyYW5zZm9ybSB0aGUgZmlsdGVyIGJ5IGNvbnZlcnRpbmcgaXQgdG8gbG93ZXJjYXNlIGFuZCByZW1vdmluZyB3aGl0ZXNwYWNlLlxuICAgIGNvbnN0IHRyYW5zZm9ybWVkRmlsdGVyID0gZmlsdGVyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgcmV0dXJuIGRhdGFTdHIuaW5kZXhPZih0cmFuc2Zvcm1lZEZpbHRlcikgIT0gLTE7XG4gIH07XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbERhdGE6IFRbXSA9IFtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KGluaXRpYWxEYXRhKTtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gY2hhbmdlcyB0aGF0IHNob3VsZCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCByb3dzLiBXaGVuIHRoZVxuICAgKiBjaGFuZ2VzIG9jY3VyLCBwcm9jZXNzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBmaWx0ZXIsIHNvcnQsIGFuZCBwYWdpbmF0aW9uIGFsb25nIHdpdGhcbiAgICogdGhlIHByb3ZpZGVkIGJhc2UgZGF0YSBhbmQgc2VuZCBpdCB0byB0aGUgdGFibGUgZm9yIHJlbmRlcmluZy5cbiAgICovXG4gIF91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKSB7XG4gICAgLy8gU29ydGluZyBhbmQvb3IgcGFnaW5hdGlvbiBzaG91bGQgYmUgd2F0Y2hlZCBpZiBNYXRTb3J0IGFuZC9vciBNYXRQYWdpbmF0b3IgYXJlIHByb3ZpZGVkLlxuICAgIC8vIFRoZSBldmVudHMgc2hvdWxkIGVtaXQgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBlbWl0cyBhIGNoYW5nZSBvciBpbml0aWFsaXplcywgb3IgaWYgbm9cbiAgICAvLyBjb21wb25lbnQgaXMgcHJvdmlkZWQsIGEgc3RyZWFtIHdpdGgganVzdCBhIG51bGwgZXZlbnQgc2hvdWxkIGJlIHByb3ZpZGVkLlxuICAgIC8vIFRoZSBgc29ydENoYW5nZWAgYW5kIGBwYWdlQ2hhbmdlYCBhY3RzIGFzIGEgc2lnbmFsIHRvIHRoZSBjb21iaW5lTGF0ZXN0cyBiZWxvdyBzbyB0aGF0IHRoZVxuICAgIC8vIHBpcGVsaW5lIGNhbiBwcm9ncmVzcyB0byB0aGUgbmV4dCBzdGVwLiBOb3RlIHRoYXQgdGhlIHZhbHVlIGZyb20gdGhlc2Ugc3RyZWFtcyBhcmUgbm90IHVzZWQsXG4gICAgLy8gdGhleSBwdXJlbHkgYWN0IGFzIGEgc2lnbmFsIHRvIHByb2dyZXNzIGluIHRoZSBwaXBlbGluZS5cbiAgICBjb25zdCBzb3J0Q2hhbmdlOiBPYnNlcnZhYmxlPFNvcnQgfCBudWxsIHwgdm9pZD4gPSB0aGlzLl9zb3J0XG4gICAgICA/IChtZXJnZSh0aGlzLl9zb3J0LnNvcnRDaGFuZ2UsIHRoaXMuX3NvcnQuaW5pdGlhbGl6ZWQpIGFzIE9ic2VydmFibGU8U29ydCB8IHZvaWQ+KVxuICAgICAgOiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgY29uc3QgcGFnZUNoYW5nZTogT2JzZXJ2YWJsZTxNYXRUYWJsZURhdGFTb3VyY2VQYWdlRXZlbnQgfCBudWxsIHwgdm9pZD4gPSB0aGlzLl9wYWdpbmF0b3JcbiAgICAgID8gKG1lcmdlKFxuICAgICAgICAgIHRoaXMuX3BhZ2luYXRvci5wYWdlLFxuICAgICAgICAgIHRoaXMuX2ludGVybmFsUGFnZUNoYW5nZXMsXG4gICAgICAgICAgdGhpcy5fcGFnaW5hdG9yLmluaXRpYWxpemVkLFxuICAgICAgICApIGFzIE9ic2VydmFibGU8TWF0VGFibGVEYXRhU291cmNlUGFnZUV2ZW50IHwgdm9pZD4pXG4gICAgICA6IG9ic2VydmFibGVPZihudWxsKTtcbiAgICBjb25zdCBkYXRhU3RyZWFtID0gdGhpcy5fZGF0YTtcbiAgICAvLyBXYXRjaCBmb3IgYmFzZSBkYXRhIG9yIGZpbHRlciBjaGFuZ2VzIHRvIHByb3ZpZGUgYSBmaWx0ZXJlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSBjb21iaW5lTGF0ZXN0KFtkYXRhU3RyZWFtLCB0aGlzLl9maWx0ZXJdKS5waXBlKFxuICAgICAgbWFwKChbZGF0YV0pID0+IHRoaXMuX2ZpbHRlckRhdGEoZGF0YSkpLFxuICAgICk7XG4gICAgLy8gV2F0Y2ggZm9yIGZpbHRlcmVkIGRhdGEgb3Igc29ydCBjaGFuZ2VzIHRvIHByb3ZpZGUgYW4gb3JkZXJlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBvcmRlcmVkRGF0YSA9IGNvbWJpbmVMYXRlc3QoW2ZpbHRlcmVkRGF0YSwgc29ydENoYW5nZV0pLnBpcGUoXG4gICAgICBtYXAoKFtkYXRhXSkgPT4gdGhpcy5fb3JkZXJEYXRhKGRhdGEpKSxcbiAgICApO1xuICAgIC8vIFdhdGNoIGZvciBvcmRlcmVkIGRhdGEgb3IgcGFnZSBjaGFuZ2VzIHRvIHByb3ZpZGUgYSBwYWdlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBwYWdpbmF0ZWREYXRhID0gY29tYmluZUxhdGVzdChbb3JkZXJlZERhdGEsIHBhZ2VDaGFuZ2VdKS5waXBlKFxuICAgICAgbWFwKChbZGF0YV0pID0+IHRoaXMuX3BhZ2VEYXRhKGRhdGEpKSxcbiAgICApO1xuICAgIC8vIFdhdGNoZWQgZm9yIHBhZ2VkIGRhdGEgY2hhbmdlcyBhbmQgc2VuZCB0aGUgcmVzdWx0IHRvIHRoZSB0YWJsZSB0byByZW5kZXIuXG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uID0gcGFnaW5hdGVkRGF0YS5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLl9yZW5kZXJEYXRhLm5leHQoZGF0YSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmaWx0ZXJlZCBkYXRhIGFycmF5IHdoZXJlIGVhY2ggZmlsdGVyIG9iamVjdCBjb250YWlucyB0aGUgZmlsdGVyIHN0cmluZyB3aXRoaW5cbiAgICogdGhlIHJlc3VsdCBvZiB0aGUgZmlsdGVyVGVybUFjY2Vzc29yIGZ1bmN0aW9uLiBJZiBubyBmaWx0ZXIgaXMgc2V0LCByZXR1cm5zIHRoZSBkYXRhIGFycmF5XG4gICAqIGFzIHByb3ZpZGVkLlxuICAgKi9cbiAgX2ZpbHRlckRhdGEoZGF0YTogVFtdKSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgYSBmaWx0ZXIgc3RyaW5nLCBmaWx0ZXIgb3V0IGRhdGEgdGhhdCBkb2VzIG5vdCBjb250YWluIGl0LlxuICAgIC8vIEVhY2ggZGF0YSBvYmplY3QgaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIHVzaW5nIHRoZSBmdW5jdGlvbiBkZWZpbmVkIGJ5IGZpbHRlclRlcm1BY2Nlc3Nvci5cbiAgICAvLyBNYXkgYmUgb3ZlcnJpZGRlbiBmb3IgY3VzdG9taXphdGlvbi5cbiAgICB0aGlzLmZpbHRlcmVkRGF0YSA9XG4gICAgICB0aGlzLmZpbHRlciA9PSBudWxsIHx8IHRoaXMuZmlsdGVyID09PSAnJ1xuICAgICAgICA/IGRhdGFcbiAgICAgICAgOiBkYXRhLmZpbHRlcihvYmogPT4gdGhpcy5maWx0ZXJQcmVkaWNhdGUob2JqLCB0aGlzLmZpbHRlcikpO1xuXG4gICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICB0aGlzLl91cGRhdGVQYWdpbmF0b3IodGhpcy5maWx0ZXJlZERhdGEubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5maWx0ZXJlZERhdGE7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhIGlmIE1hdFNvcnQgaGFzIGEgc29ydCBhcHBsaWVkLCBvdGhlcndpc2UganVzdCByZXR1cm5zIHRoZVxuICAgKiBkYXRhIGFycmF5IGFzIHByb3ZpZGVkLiBVc2VzIHRoZSBkZWZhdWx0IGRhdGEgYWNjZXNzb3IgZm9yIGRhdGEgbG9va3VwLCB1bmxlc3MgYVxuICAgKiBzb3J0RGF0YUFjY2Vzc29yIGZ1bmN0aW9uIGlzIGRlZmluZWQuXG4gICAqL1xuICBfb3JkZXJEYXRhKGRhdGE6IFRbXSk6IFRbXSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gYWN0aXZlIHNvcnQgb3IgZGlyZWN0aW9uLCByZXR1cm4gdGhlIGRhdGEgd2l0aG91dCB0cnlpbmcgdG8gc29ydC5cbiAgICBpZiAoIXRoaXMuc29ydCkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc29ydERhdGEoZGF0YS5zbGljZSgpLCB0aGlzLnNvcnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwYWdlZCBzbGljZSBvZiB0aGUgcHJvdmlkZWQgZGF0YSBhcnJheSBhY2NvcmRpbmcgdG8gdGhlIHByb3ZpZGVkIE1hdFBhZ2luYXRvcidzIHBhZ2VcbiAgICogaW5kZXggYW5kIGxlbmd0aC4gSWYgdGhlcmUgaXMgbm8gcGFnaW5hdG9yIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBkYXRhIGFycmF5IGFzIHByb3ZpZGVkLlxuICAgKi9cbiAgX3BhZ2VEYXRhKGRhdGE6IFRbXSk6IFRbXSB7XG4gICAgaWYgKCF0aGlzLnBhZ2luYXRvcikge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCAqIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplO1xuICAgIHJldHVybiBkYXRhLnNsaWNlKHN0YXJ0SW5kZXgsIHN0YXJ0SW5kZXggKyB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcGFnaW5hdG9yIHRvIHJlZmxlY3QgdGhlIGxlbmd0aCBvZiB0aGUgZmlsdGVyZWQgZGF0YSwgYW5kIG1ha2VzIHN1cmUgdGhhdCB0aGUgcGFnZVxuICAgKiBpbmRleCBkb2VzIG5vdCBleGNlZWQgdGhlIHBhZ2luYXRvcidzIGxhc3QgcGFnZS4gVmFsdWVzIGFyZSBjaGFuZ2VkIGluIGEgcmVzb2x2ZWQgcHJvbWlzZSB0b1xuICAgKiBndWFyZCBhZ2FpbnN0IG1ha2luZyBwcm9wZXJ0eSBjaGFuZ2VzIHdpdGhpbiBhIHJvdW5kIG9mIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqL1xuICBfdXBkYXRlUGFnaW5hdG9yKGZpbHRlcmVkRGF0YUxlbmd0aDogbnVtYmVyKSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBwYWdpbmF0b3IgPSB0aGlzLnBhZ2luYXRvcjtcblxuICAgICAgaWYgKCFwYWdpbmF0b3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBwYWdpbmF0b3IubGVuZ3RoID0gZmlsdGVyZWREYXRhTGVuZ3RoO1xuXG4gICAgICAvLyBJZiB0aGUgcGFnZSBpbmRleCBpcyBzZXQgYmV5b25kIHRoZSBwYWdlLCByZWR1Y2UgaXQgdG8gdGhlIGxhc3QgcGFnZS5cbiAgICAgIGlmIChwYWdpbmF0b3IucGFnZUluZGV4ID4gMCkge1xuICAgICAgICBjb25zdCBsYXN0UGFnZUluZGV4ID0gTWF0aC5jZWlsKHBhZ2luYXRvci5sZW5ndGggLyBwYWdpbmF0b3IucGFnZVNpemUpIC0gMSB8fCAwO1xuICAgICAgICBjb25zdCBuZXdQYWdlSW5kZXggPSBNYXRoLm1pbihwYWdpbmF0b3IucGFnZUluZGV4LCBsYXN0UGFnZUluZGV4KTtcblxuICAgICAgICBpZiAobmV3UGFnZUluZGV4ICE9PSBwYWdpbmF0b3IucGFnZUluZGV4KSB7XG4gICAgICAgICAgcGFnaW5hdG9yLnBhZ2VJbmRleCA9IG5ld1BhZ2VJbmRleDtcblxuICAgICAgICAgIC8vIFNpbmNlIHRoZSBwYWdpbmF0b3Igb25seSBlbWl0cyBhZnRlciB1c2VyLWdlbmVyYXRlZCBjaGFuZ2VzLFxuICAgICAgICAgIC8vIHdlIG5lZWQgb3VyIG93biBzdHJlYW0gc28gd2Uga25vdyB0byBzaG91bGQgcmUtcmVuZGVyIHRoZSBkYXRhLlxuICAgICAgICAgIHRoaXMuX2ludGVybmFsUGFnZUNoYW5nZXMubmV4dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSB0aGUgTWF0VGFibGUuIENhbGxlZCB3aGVuIGl0IGNvbm5lY3RzIHRvIHRoZSBkYXRhIHNvdXJjZS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdCgpIHtcbiAgICBpZiAoIXRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUNoYW5nZVN1YnNjcmlwdGlvbigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9yZW5kZXJEYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIE1hdFRhYmxlLiBDYWxsZWQgd2hlbiBpdCBkaXNjb25uZWN0cyBmcm9tIHRoZSBkYXRhIHNvdXJjZS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24gPSBudWxsO1xuICB9XG59XG5cbi8qKlxuICogRGF0YSBzb3VyY2UgdGhhdCBhY2NlcHRzIGEgY2xpZW50LXNpZGUgZGF0YSBhcnJheSBhbmQgaW5jbHVkZXMgbmF0aXZlIHN1cHBvcnQgb2YgZmlsdGVyaW5nLFxuICogc29ydGluZyAodXNpbmcgTWF0U29ydCksIGFuZCBwYWdpbmF0aW9uICh1c2luZyBNYXRQYWdpbmF0b3IpLlxuICpcbiAqIEFsbG93cyBmb3Igc29ydCBjdXN0b21pemF0aW9uIGJ5IG92ZXJyaWRpbmcgc29ydGluZ0RhdGFBY2Nlc3Nvciwgd2hpY2ggZGVmaW5lcyBob3cgZGF0YVxuICogcHJvcGVydGllcyBhcmUgYWNjZXNzZWQuIEFsc28gYWxsb3dzIGZvciBmaWx0ZXIgY3VzdG9taXphdGlvbiBieSBvdmVycmlkaW5nIGZpbHRlclRlcm1BY2Nlc3NvcixcbiAqIHdoaWNoIGRlZmluZXMgaG93IHJvdyBkYXRhIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBmb3IgZmlsdGVyIG1hdGNoaW5nLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGNsYXNzIGlzIG1lYW50IHRvIGJlIGEgc2ltcGxlIGRhdGEgc291cmNlIHRvIGhlbHAgeW91IGdldCBzdGFydGVkLiBBcyBzdWNoXG4gKiBpdCBpc24ndCBlcXVpcHBlZCB0byBoYW5kbGUgc29tZSBtb3JlIGFkdmFuY2VkIGNhc2VzIGxpa2Ugcm9idXN0IGkxOG4gc3VwcG9ydCBvciBzZXJ2ZXItc2lkZVxuICogaW50ZXJhY3Rpb25zLiBJZiB5b3VyIGFwcCBuZWVkcyB0byBzdXBwb3J0IG1vcmUgYWR2YW5jZWQgdXNlIGNhc2VzLCBjb25zaWRlciBpbXBsZW1lbnRpbmcgeW91clxuICogb3duIGBEYXRhU291cmNlYC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYmxlRGF0YVNvdXJjZTxUPiBleHRlbmRzIF9NYXRUYWJsZURhdGFTb3VyY2U8VCwgTWF0UGFnaW5hdG9yPiB7fVxuIl19