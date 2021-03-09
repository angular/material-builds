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
        var _a;
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
        (_a = this._renderChangesSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
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
        var _a;
        (_a = this._renderChangesSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUc5QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYixLQUFLLEVBRUwsRUFBRSxJQUFJLFlBQVksRUFDbEIsT0FBTyxHQUVSLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DOzs7R0FHRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUFVMUMsdURBQXVEO0FBQ3ZELE1BQU0sT0FBTyxtQkFBNEMsU0FBUSxVQUFhO0lBdUw1RSxZQUFZLGNBQW1CLEVBQUU7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUFwTFYsa0ZBQWtGO1FBQ2pFLGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQU0sRUFBRSxDQUFDLENBQUM7UUFFNUQsNEVBQTRFO1FBQzNELFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzRCxrR0FBa0c7UUFDakYseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUU1RDs7O1dBR0c7UUFDSCwrQkFBMEIsR0FBc0IsSUFBSSxDQUFDO1FBK0RyRDs7Ozs7Ozs7V0FRRztRQUNILHdCQUFtQixHQUNmLENBQUMsSUFBTyxFQUFFLFlBQW9CLEVBQWlCLEVBQUU7WUFDbkQsTUFBTSxLQUFLLEdBQUksSUFBNkIsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUzRCxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekIsTUFBTSxX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QU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUVsRSxJQUFJLFlBQVksS0FBSyxTQUFTLENBQUMsU0FBUyxFQUFFO29CQUN4QyxTQUFTLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztvQkFFbkMsK0RBQStEO29CQUMvRCxrRUFBa0U7b0JBQ2xFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEM7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU87UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ3BDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVOztRQUNSLE1BQUEsSUFBSSxDQUFDLDBCQUEwQiwwQ0FBRSxXQUFXLEdBQUc7UUFDL0MsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLE9BQU8sa0JBQXNCLFNBQVEsbUJBQW9DO0NBQUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtfaXNOdW1iZXJWYWx1ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGF0YVNvdXJjZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7TWF0UGFnaW5hdG9yLCBQYWdlRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3BhZ2luYXRvcic7XG5pbXBvcnQge01hdFNvcnQsIFNvcnR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnO1xuaW1wb3J0IHtcbiAgQmVoYXZpb3JTdWJqZWN0LFxuICBjb21iaW5lTGF0ZXN0LFxuICBtZXJnZSxcbiAgT2JzZXJ2YWJsZSxcbiAgb2YgYXMgb2JzZXJ2YWJsZU9mLFxuICBTdWJqZWN0LFxuICBTdWJzY3JpcHRpb24sXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBDb3JyZXNwb25kcyB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLiBNb3ZlZCBvdXQgaW50byBhIHZhcmlhYmxlIGhlcmUgZHVlIHRvXG4gKiBmbGFreSBicm93c2VyIHN1cHBvcnQgYW5kIHRoZSB2YWx1ZSBub3QgYmVpbmcgZGVmaW5lZCBpbiBDbG9zdXJlJ3MgdHlwaW5ncy5cbiAqL1xuY29uc3QgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbmludGVyZmFjZSBQYWdpbmF0b3Ige1xuICBwYWdlOiBTdWJqZWN0PFBhZ2VFdmVudD47XG4gIHBhZ2VJbmRleDogbnVtYmVyO1xuICBpbml0aWFsaXplZDogT2JzZXJ2YWJsZTx2b2lkPjtcbiAgcGFnZVNpemU6IG51bWJlcjtcbiAgbGVuZ3RoOiBudW1iZXI7XG59XG5cbi8qKiBTaGFyZWQgYmFzZSBjbGFzcyB3aXRoIE1EQy1iYXNlZCBpbXBsZW1lbnRhdGlvbi4gKi9cbmV4cG9ydCBjbGFzcyBfTWF0VGFibGVEYXRhU291cmNlPFQsIFAgZXh0ZW5kcyBQYWdpbmF0b3I+IGV4dGVuZHMgRGF0YVNvdXJjZTxUPiB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgbmV3IGRhdGEgYXJyYXkgaXMgc2V0IG9uIHRoZSBkYXRhIHNvdXJjZS4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGF0YTogQmVoYXZpb3JTdWJqZWN0PFRbXT47XG5cbiAgLyoqIFN0cmVhbSBlbWl0dGluZyByZW5kZXIgZGF0YSB0byB0aGUgdGFibGUgKGRlcGVuZHMgb24gb3JkZXJlZCBkYXRhIGNoYW5nZXMpLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9yZW5kZXJEYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KFtdKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiBhIG5ldyBmaWx0ZXIgc3RyaW5nIGlzIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2ZpbHRlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPignJyk7XG5cbiAgLyoqIFVzZWQgdG8gcmVhY3QgdG8gaW50ZXJuYWwgY2hhbmdlcyBvZiB0aGUgcGFnaW5hdG9yIHRoYXQgYXJlIG1hZGUgYnkgdGhlIGRhdGEgc291cmNlIGl0c2VsZi4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfaW50ZXJuYWxQYWdlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFN1YnNjcmlwdGlvbiB0byB0aGUgY2hhbmdlcyB0aGF0IHNob3VsZCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCByb3dzLCBzdWNoXG4gICAqIGFzIGZpbHRlcmluZywgc29ydGluZywgcGFnaW5hdGlvbiwgb3IgYmFzZSBkYXRhIGNoYW5nZXMuXG4gICAqL1xuICBfcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9ufG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgZmlsdGVyZWQgc2V0IG9mIGRhdGEgdGhhdCBoYXMgYmVlbiBtYXRjaGVkIGJ5IHRoZSBmaWx0ZXIgc3RyaW5nLCBvciBhbGwgdGhlIGRhdGEgaWYgdGhlcmVcbiAgICogaXMgbm8gZmlsdGVyLiBVc2VmdWwgZm9yIGtub3dpbmcgdGhlIHNldCBvZiBkYXRhIHRoZSB0YWJsZSByZXByZXNlbnRzLlxuICAgKiBGb3IgZXhhbXBsZSwgYSAnc2VsZWN0QWxsKCknIGZ1bmN0aW9uIHdvdWxkIGxpa2VseSB3YW50IHRvIHNlbGVjdCB0aGUgc2V0IG9mIGZpbHRlcmVkIGRhdGFcbiAgICogc2hvd24gdG8gdGhlIHVzZXIgcmF0aGVyIHRoYW4gYWxsIHRoZSBkYXRhLlxuICAgKi9cbiAgZmlsdGVyZWREYXRhOiBUW107XG5cbiAgLyoqIEFycmF5IG9mIGRhdGEgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQgYnkgdGhlIHRhYmxlLCB3aGVyZSBlYWNoIG9iamVjdCByZXByZXNlbnRzIG9uZSByb3cuICovXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZTsgfVxuICBzZXQgZGF0YShkYXRhOiBUW10pIHtcbiAgICB0aGlzLl9kYXRhLm5leHQoZGF0YSk7XG4gICAgLy8gTm9ybWFsbHkgdGhlIGBmaWx0ZXJlZERhdGFgIGlzIHVwZGF0ZWQgYnkgdGhlIHJlLXJlbmRlclxuICAgIC8vIHN1YnNjcmlwdGlvbiwgYnV0IHRoYXQgd29uJ3QgaGFwcGVuIGlmIGl0J3MgaW5hY3RpdmUuXG4gICAgaWYgKCF0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9maWx0ZXJEYXRhKGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXIgdGVybSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGZpbHRlciBvdXQgb2JqZWN0cyBmcm9tIHRoZSBkYXRhIGFycmF5LiBUbyBvdmVycmlkZSBob3dcbiAgICogZGF0YSBvYmplY3RzIG1hdGNoIHRvIHRoaXMgZmlsdGVyIHN0cmluZywgcHJvdmlkZSBhIGN1c3RvbSBmdW5jdGlvbiBmb3IgZmlsdGVyUHJlZGljYXRlLlxuICAgKi9cbiAgZ2V0IGZpbHRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyLnZhbHVlOyB9XG4gIHNldCBmaWx0ZXIoZmlsdGVyOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9maWx0ZXIubmV4dChmaWx0ZXIpO1xuICAgIC8vIE5vcm1hbGx5IHRoZSBgZmlsdGVyZWREYXRhYCBpcyB1cGRhdGVkIGJ5IHRoZSByZS1yZW5kZXJcbiAgICAvLyBzdWJzY3JpcHRpb24sIGJ1dCB0aGF0IHdvbid0IGhhcHBlbiBpZiBpdCdzIGluYWN0aXZlLlxuICAgIGlmICghdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fZmlsdGVyRGF0YSh0aGlzLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiB0aGUgTWF0U29ydCBkaXJlY3RpdmUgdXNlZCBieSB0aGUgdGFibGUgdG8gY29udHJvbCBpdHMgc29ydGluZy4gU29ydCBjaGFuZ2VzXG4gICAqIGVtaXR0ZWQgYnkgdGhlIE1hdFNvcnQgd2lsbCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCBkYXRhLlxuICAgKi9cbiAgZ2V0IHNvcnQoKTogTWF0U29ydCB8IG51bGwgeyByZXR1cm4gdGhpcy5fc29ydDsgfVxuICBzZXQgc29ydChzb3J0OiBNYXRTb3J0fG51bGwpIHtcbiAgICB0aGlzLl9zb3J0ID0gc29ydDtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuICBwcml2YXRlIF9zb3J0OiBNYXRTb3J0fG51bGw7XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIHRoZSBNYXRQYWdpbmF0b3IgY29tcG9uZW50IHVzZWQgYnkgdGhlIHRhYmxlIHRvIGNvbnRyb2wgd2hhdCBwYWdlIG9mIHRoZSBkYXRhIGlzXG4gICAqIGRpc3BsYXllZC4gUGFnZSBjaGFuZ2VzIGVtaXR0ZWQgYnkgdGhlIE1hdFBhZ2luYXRvciB3aWxsIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZVxuICAgKiB0YWJsZSdzIHJlbmRlcmVkIGRhdGEuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgZGF0YSBzb3VyY2UgdXNlcyB0aGUgcGFnaW5hdG9yJ3MgcHJvcGVydGllcyB0byBjYWxjdWxhdGUgd2hpY2ggcGFnZSBvZiBkYXRhXG4gICAqIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIHRoZSBwYWdpbmF0b3IgcmVjZWl2ZXMgaXRzIHByb3BlcnRpZXMgYXMgdGVtcGxhdGUgaW5wdXRzLFxuICAgKiBlLmcuIGBbcGFnZUxlbmd0aF09MTAwYCBvciBgW3BhZ2VJbmRleF09MWAsIHRoZW4gYmUgc3VyZSB0aGF0IHRoZSBwYWdpbmF0b3IncyB2aWV3IGhhcyBiZWVuXG4gICAqIGluaXRpYWxpemVkIGJlZm9yZSBhc3NpZ25pbmcgaXQgdG8gdGhpcyBkYXRhIHNvdXJjZS5cbiAgICovXG4gIGdldCBwYWdpbmF0b3IoKTogUCB8IG51bGwgeyByZXR1cm4gdGhpcy5fcGFnaW5hdG9yOyB9XG4gIHNldCBwYWdpbmF0b3IocGFnaW5hdG9yOiBQIHwgbnVsbCkge1xuICAgIHRoaXMuX3BhZ2luYXRvciA9IHBhZ2luYXRvcjtcbiAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgfVxuICBwcml2YXRlIF9wYWdpbmF0b3I6IFAgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBEYXRhIGFjY2Vzc29yIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBmb3IgYWNjZXNzaW5nIGRhdGEgcHJvcGVydGllcyBmb3Igc29ydGluZyB0aHJvdWdoXG4gICAqIHRoZSBkZWZhdWx0IHNvcnREYXRhIGZ1bmN0aW9uLlxuICAgKiBUaGlzIGRlZmF1bHQgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IHRoZSBzb3J0IGhlYWRlciBJRHMgKHdoaWNoIGRlZmF1bHRzIHRvIHRoZSBjb2x1bW4gbmFtZSlcbiAgICogbWF0Y2hlcyB0aGUgZGF0YSdzIHByb3BlcnRpZXMgKGUuZy4gY29sdW1uIFh5eiByZXByZXNlbnRzIGRhdGFbJ1h5eiddKS5cbiAgICogTWF5IGJlIHNldCB0byBhIGN1c3RvbSBmdW5jdGlvbiBmb3IgZGlmZmVyZW50IGJlaGF2aW9yLlxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIG9iamVjdCB0aGF0IGlzIGJlaW5nIGFjY2Vzc2VkLlxuICAgKiBAcGFyYW0gc29ydEhlYWRlcklkIFRoZSBuYW1lIG9mIHRoZSBjb2x1bW4gdGhhdCByZXByZXNlbnRzIHRoZSBkYXRhLlxuICAgKi9cbiAgc29ydGluZ0RhdGFBY2Nlc3NvcjogKChkYXRhOiBULCBzb3J0SGVhZGVySWQ6IHN0cmluZykgPT4gc3RyaW5nfG51bWJlcikgPVxuICAgICAgKGRhdGE6IFQsIHNvcnRIZWFkZXJJZDogc3RyaW5nKTogc3RyaW5nfG51bWJlciA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZGF0YSBhcyB7W2tleTogc3RyaW5nXTogYW55fSlbc29ydEhlYWRlcklkXTtcblxuICAgIGlmIChfaXNOdW1iZXJWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG51bWJlclZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblxuICAgICAgLy8gTnVtYmVycyBiZXlvbmQgYE1BWF9TQUZFX0lOVEVHRVJgIGNhbid0IGJlIGNvbXBhcmVkIHJlbGlhYmx5IHNvIHdlXG4gICAgICAvLyBsZWF2ZSB0aGVtIGFzIHN0cmluZ3MuIEZvciBtb3JlIGluZm86IGh0dHBzOi8vZ29vLmdsL3k1dmJTZ1xuICAgICAgcmV0dXJuIG51bWJlclZhbHVlIDwgTUFYX1NBRkVfSU5URUdFUiA/IG51bWJlclZhbHVlIDogdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzb3J0ZWQgY29weSBvZiB0aGUgZGF0YSBhcnJheSBiYXNlZCBvbiB0aGUgc3RhdGUgb2YgdGhlIE1hdFNvcnQuIENhbGxlZFxuICAgKiBhZnRlciBjaGFuZ2VzIGFyZSBtYWRlIHRvIHRoZSBmaWx0ZXJlZCBkYXRhIG9yIHdoZW4gc29ydCBjaGFuZ2VzIGFyZSBlbWl0dGVkIGZyb20gTWF0U29ydC5cbiAgICogQnkgZGVmYXVsdCwgdGhlIGZ1bmN0aW9uIHJldHJpZXZlcyB0aGUgYWN0aXZlIHNvcnQgYW5kIGl0cyBkaXJlY3Rpb24gYW5kIGNvbXBhcmVzIGRhdGFcbiAgICogYnkgcmV0cmlldmluZyBkYXRhIHVzaW5nIHRoZSBzb3J0aW5nRGF0YUFjY2Vzc29yLiBNYXkgYmUgb3ZlcnJpZGRlbiBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb25cbiAgICogb2YgZGF0YSBvcmRlcmluZy5cbiAgICogQHBhcmFtIGRhdGEgVGhlIGFycmF5IG9mIGRhdGEgdGhhdCBzaG91bGQgYmUgc29ydGVkLlxuICAgKiBAcGFyYW0gc29ydCBUaGUgY29ubmVjdGVkIE1hdFNvcnQgdGhhdCBob2xkcyB0aGUgY3VycmVudCBzb3J0IHN0YXRlLlxuICAgKi9cbiAgc29ydERhdGE6ICgoZGF0YTogVFtdLCBzb3J0OiBNYXRTb3J0KSA9PiBUW10pID0gKGRhdGE6IFRbXSwgc29ydDogTWF0U29ydCk6IFRbXSA9PiB7XG4gICAgY29uc3QgYWN0aXZlID0gc29ydC5hY3RpdmU7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gc29ydC5kaXJlY3Rpb247XG4gICAgaWYgKCFhY3RpdmUgfHwgZGlyZWN0aW9uID09ICcnKSB7IHJldHVybiBkYXRhOyB9XG5cbiAgICByZXR1cm4gZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBsZXQgdmFsdWVBID0gdGhpcy5zb3J0aW5nRGF0YUFjY2Vzc29yKGEsIGFjdGl2ZSk7XG4gICAgICBsZXQgdmFsdWVCID0gdGhpcy5zb3J0aW5nRGF0YUFjY2Vzc29yKGIsIGFjdGl2ZSk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBkYXRhIGluIHRoZSBjb2x1bW4gdGhhdCBjYW4gYmUgY29udmVydGVkIHRvIGEgbnVtYmVyLFxuICAgICAgLy8gaXQgbXVzdCBiZSBlbnN1cmVkIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGFcbiAgICAgIC8vIGlzIG9mIHRoZSBzYW1lIHR5cGUgc28gYXMgbm90IHRvIG9yZGVyIGluY29ycmVjdGx5LlxuICAgICAgY29uc3QgdmFsdWVBVHlwZSA9IHR5cGVvZiB2YWx1ZUE7XG4gICAgICBjb25zdCB2YWx1ZUJUeXBlID0gdHlwZW9mIHZhbHVlQjtcblxuICAgICAgaWYgKHZhbHVlQVR5cGUgIT09IHZhbHVlQlR5cGUpIHtcbiAgICAgICAgaWYgKHZhbHVlQVR5cGUgPT09ICdudW1iZXInKSB7IHZhbHVlQSArPSAnJzsgfVxuICAgICAgICBpZiAodmFsdWVCVHlwZSA9PT0gJ251bWJlcicpIHsgdmFsdWVCICs9ICcnOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGJvdGggdmFsdWVBIGFuZCB2YWx1ZUIgZXhpc3QgKHRydXRoeSksIHRoZW4gY29tcGFyZSB0aGUgdHdvLiBPdGhlcndpc2UsIGNoZWNrIGlmXG4gICAgICAvLyBvbmUgdmFsdWUgZXhpc3RzIHdoaWxlIHRoZSBvdGhlciBkb2Vzbid0LiBJbiB0aGlzIGNhc2UsIGV4aXN0aW5nIHZhbHVlIHNob3VsZCBjb21lIGxhc3QuXG4gICAgICAvLyBUaGlzIGF2b2lkcyBpbmNvbnNpc3RlbnQgcmVzdWx0cyB3aGVuIGNvbXBhcmluZyB2YWx1ZXMgdG8gdW5kZWZpbmVkL251bGwuXG4gICAgICAvLyBJZiBuZWl0aGVyIHZhbHVlIGV4aXN0cywgcmV0dXJuIDAgKGVxdWFsKS5cbiAgICAgIGxldCBjb21wYXJhdG9yUmVzdWx0ID0gMDtcbiAgICAgIGlmICh2YWx1ZUEgIT0gbnVsbCAmJiB2YWx1ZUIgIT0gbnVsbCkge1xuICAgICAgICAvLyBDaGVjayBpZiBvbmUgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBvdGhlcjsgaWYgZXF1YWwsIGNvbXBhcmF0b3JSZXN1bHQgc2hvdWxkIHJlbWFpbiAwLlxuICAgICAgICBpZiAodmFsdWVBID4gdmFsdWVCKSB7XG4gICAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWVBIDwgdmFsdWVCKSB7XG4gICAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IC0xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlQSAhPSBudWxsKSB7XG4gICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAxO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZUIgIT0gbnVsbCkge1xuICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wYXJhdG9yUmVzdWx0ICogKGRpcmVjdGlvbiA9PSAnYXNjJyA/IDEgOiAtMSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgZGF0YSBvYmplY3QgbWF0Y2hlcyB0aGUgZGF0YSBzb3VyY2UncyBmaWx0ZXIgc3RyaW5nLiBCeSBkZWZhdWx0LCBlYWNoIGRhdGEgb2JqZWN0XG4gICAqIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBvZiBpdHMgcHJvcGVydGllcyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBmaWx0ZXIgaGFzXG4gICAqIGF0IGxlYXN0IG9uZSBvY2N1cnJlbmNlIGluIHRoYXQgc3RyaW5nLiBCeSBkZWZhdWx0LCB0aGUgZmlsdGVyIHN0cmluZyBoYXMgaXRzIHdoaXRlc3BhY2VcbiAgICogdHJpbW1lZCBhbmQgdGhlIG1hdGNoIGlzIGNhc2UtaW5zZW5zaXRpdmUuIE1heSBiZSBvdmVycmlkZGVuIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvbiBvZlxuICAgKiBmaWx0ZXIgbWF0Y2hpbmcuXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgb2JqZWN0IHVzZWQgdG8gY2hlY2sgYWdhaW5zdCB0aGUgZmlsdGVyLlxuICAgKiBAcGFyYW0gZmlsdGVyIEZpbHRlciBzdHJpbmcgdGhhdCBoYXMgYmVlbiBzZXQgb24gdGhlIGRhdGEgc291cmNlLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBmaWx0ZXIgbWF0Y2hlcyBhZ2FpbnN0IHRoZSBkYXRhXG4gICAqL1xuICBmaWx0ZXJQcmVkaWNhdGU6ICgoZGF0YTogVCwgZmlsdGVyOiBzdHJpbmcpID0+IGJvb2xlYW4pID0gKGRhdGE6IFQsIGZpbHRlcjogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgLy8gVHJhbnNmb3JtIHRoZSBkYXRhIGludG8gYSBsb3dlcmNhc2Ugc3RyaW5nIG9mIGFsbCBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgY29uc3QgZGF0YVN0ciA9IE9iamVjdC5rZXlzKGRhdGEpLnJlZHVjZSgoY3VycmVudFRlcm06IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIFVzZSBhbiBvYnNjdXJlIFVuaWNvZGUgY2hhcmFjdGVyIHRvIGRlbGltaXQgdGhlIHdvcmRzIGluIHRoZSBjb25jYXRlbmF0ZWQgc3RyaW5nLlxuICAgICAgLy8gVGhpcyBhdm9pZHMgbWF0Y2hlcyB3aGVyZSB0aGUgdmFsdWVzIG9mIHR3byBjb2x1bW5zIGNvbWJpbmVkIHdpbGwgbWF0Y2ggdGhlIHVzZXIncyBxdWVyeVxuICAgICAgLy8gKGUuZy4gYEZsdXRlYCBhbmQgYFN0b3BgIHdpbGwgbWF0Y2ggYFRlc3RgKS4gVGhlIGNoYXJhY3RlciBpcyBpbnRlbmRlZCB0byBiZSBzb21ldGhpbmdcbiAgICAgIC8vIHRoYXQgaGFzIGEgdmVyeSBsb3cgY2hhbmNlIG9mIGJlaW5nIHR5cGVkIGluIGJ5IHNvbWVib2R5IGluIGEgdGV4dCBmaWVsZC4gVGhpcyBvbmUgaW5cbiAgICAgIC8vIHBhcnRpY3VsYXIgaXMgXCJXaGl0ZSB1cC1wb2ludGluZyB0cmlhbmdsZSB3aXRoIGRvdFwiIGZyb21cbiAgICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfVW5pY29kZV9jaGFyYWN0ZXJzXG4gICAgICByZXR1cm4gY3VycmVudFRlcm0gKyAoZGF0YSBhcyB7W2tleTogc3RyaW5nXTogYW55fSlba2V5XSArICfil6wnO1xuICAgIH0sICcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHRoZSBmaWx0ZXIgYnkgY29udmVydGluZyBpdCB0byBsb3dlcmNhc2UgYW5kIHJlbW92aW5nIHdoaXRlc3BhY2UuXG4gICAgY29uc3QgdHJhbnNmb3JtZWRGaWx0ZXIgPSBmaWx0ZXIudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICByZXR1cm4gZGF0YVN0ci5pbmRleE9mKHRyYW5zZm9ybWVkRmlsdGVyKSAhPSAtMTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxEYXRhOiBUW10gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihpbml0aWFsRGF0YSk7XG4gICAgdGhpcy5fdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIGNoYW5nZXMgdGhhdCBzaG91bGQgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlIHRhYmxlJ3MgcmVuZGVyZWQgcm93cy4gV2hlbiB0aGVcbiAgICogY2hhbmdlcyBvY2N1ciwgcHJvY2VzcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZmlsdGVyLCBzb3J0LCBhbmQgcGFnaW5hdGlvbiBhbG9uZyB3aXRoXG4gICAqIHRoZSBwcm92aWRlZCBiYXNlIGRhdGEgYW5kIHNlbmQgaXQgdG8gdGhlIHRhYmxlIGZvciByZW5kZXJpbmcuXG4gICAqL1xuICBfdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCkge1xuICAgIC8vIFNvcnRpbmcgYW5kL29yIHBhZ2luYXRpb24gc2hvdWxkIGJlIHdhdGNoZWQgaWYgTWF0U29ydCBhbmQvb3IgTWF0UGFnaW5hdG9yIGFyZSBwcm92aWRlZC5cbiAgICAvLyBUaGUgZXZlbnRzIHNob3VsZCBlbWl0IHdoZW5ldmVyIHRoZSBjb21wb25lbnQgZW1pdHMgYSBjaGFuZ2Ugb3IgaW5pdGlhbGl6ZXMsIG9yIGlmIG5vXG4gICAgLy8gY29tcG9uZW50IGlzIHByb3ZpZGVkLCBhIHN0cmVhbSB3aXRoIGp1c3QgYSBudWxsIGV2ZW50IHNob3VsZCBiZSBwcm92aWRlZC5cbiAgICAvLyBUaGUgYHNvcnRDaGFuZ2VgIGFuZCBgcGFnZUNoYW5nZWAgYWN0cyBhcyBhIHNpZ25hbCB0byB0aGUgY29tYmluZUxhdGVzdHMgYmVsb3cgc28gdGhhdCB0aGVcbiAgICAvLyBwaXBlbGluZSBjYW4gcHJvZ3Jlc3MgdG8gdGhlIG5leHQgc3RlcC4gTm90ZSB0aGF0IHRoZSB2YWx1ZSBmcm9tIHRoZXNlIHN0cmVhbXMgYXJlIG5vdCB1c2VkLFxuICAgIC8vIHRoZXkgcHVyZWx5IGFjdCBhcyBhIHNpZ25hbCB0byBwcm9ncmVzcyBpbiB0aGUgcGlwZWxpbmUuXG4gICAgY29uc3Qgc29ydENoYW5nZTogT2JzZXJ2YWJsZTxTb3J0fG51bGx8dm9pZD4gPSB0aGlzLl9zb3J0ID9cbiAgICAgICAgbWVyZ2UodGhpcy5fc29ydC5zb3J0Q2hhbmdlLCB0aGlzLl9zb3J0LmluaXRpYWxpemVkKSBhcyBPYnNlcnZhYmxlPFNvcnR8dm9pZD4gOlxuICAgICAgICBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgY29uc3QgcGFnZUNoYW5nZTogT2JzZXJ2YWJsZTxQYWdlRXZlbnR8bnVsbHx2b2lkPiA9IHRoaXMuX3BhZ2luYXRvciA/XG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgIHRoaXMuX3BhZ2luYXRvci5wYWdlLFxuICAgICAgICAgIHRoaXMuX2ludGVybmFsUGFnZUNoYW5nZXMsXG4gICAgICAgICAgdGhpcy5fcGFnaW5hdG9yLmluaXRpYWxpemVkXG4gICAgICAgICkgYXMgT2JzZXJ2YWJsZTxQYWdlRXZlbnR8dm9pZD4gOlxuICAgICAgICBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgY29uc3QgZGF0YVN0cmVhbSA9IHRoaXMuX2RhdGE7XG4gICAgLy8gV2F0Y2ggZm9yIGJhc2UgZGF0YSBvciBmaWx0ZXIgY2hhbmdlcyB0byBwcm92aWRlIGEgZmlsdGVyZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3QgZmlsdGVyZWREYXRhID0gY29tYmluZUxhdGVzdChbZGF0YVN0cmVhbSwgdGhpcy5fZmlsdGVyXSlcbiAgICAgIC5waXBlKG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9maWx0ZXJEYXRhKGRhdGEpKSk7XG4gICAgLy8gV2F0Y2ggZm9yIGZpbHRlcmVkIGRhdGEgb3Igc29ydCBjaGFuZ2VzIHRvIHByb3ZpZGUgYW4gb3JkZXJlZCBzZXQgb2YgZGF0YS5cbiAgICBjb25zdCBvcmRlcmVkRGF0YSA9IGNvbWJpbmVMYXRlc3QoW2ZpbHRlcmVkRGF0YSwgc29ydENoYW5nZV0pXG4gICAgICAucGlwZShtYXAoKFtkYXRhXSkgPT4gdGhpcy5fb3JkZXJEYXRhKGRhdGEpKSk7XG4gICAgLy8gV2F0Y2ggZm9yIG9yZGVyZWQgZGF0YSBvciBwYWdlIGNoYW5nZXMgdG8gcHJvdmlkZSBhIHBhZ2VkIHNldCBvZiBkYXRhLlxuICAgIGNvbnN0IHBhZ2luYXRlZERhdGEgPSBjb21iaW5lTGF0ZXN0KFtvcmRlcmVkRGF0YSwgcGFnZUNoYW5nZV0pXG4gICAgICAucGlwZShtYXAoKFtkYXRhXSkgPT4gdGhpcy5fcGFnZURhdGEoZGF0YSkpKTtcbiAgICAvLyBXYXRjaGVkIGZvciBwYWdlZCBkYXRhIGNoYW5nZXMgYW5kIHNlbmQgdGhlIHJlc3VsdCB0byB0aGUgdGFibGUgdG8gcmVuZGVyLlxuICAgIHRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IHBhZ2luYXRlZERhdGEuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5fcmVuZGVyRGF0YS5uZXh0KGRhdGEpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZmlsdGVyZWQgZGF0YSBhcnJheSB3aGVyZSBlYWNoIGZpbHRlciBvYmplY3QgY29udGFpbnMgdGhlIGZpbHRlciBzdHJpbmcgd2l0aGluXG4gICAqIHRoZSByZXN1bHQgb2YgdGhlIGZpbHRlclRlcm1BY2Nlc3NvciBmdW5jdGlvbi4gSWYgbm8gZmlsdGVyIGlzIHNldCwgcmV0dXJucyB0aGUgZGF0YSBhcnJheVxuICAgKiBhcyBwcm92aWRlZC5cbiAgICovXG4gIF9maWx0ZXJEYXRhKGRhdGE6IFRbXSkge1xuICAgIC8vIElmIHRoZXJlIGlzIGEgZmlsdGVyIHN0cmluZywgZmlsdGVyIG91dCBkYXRhIHRoYXQgZG9lcyBub3QgY29udGFpbiBpdC5cbiAgICAvLyBFYWNoIGRhdGEgb2JqZWN0IGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyB1c2luZyB0aGUgZnVuY3Rpb24gZGVmaW5lZCBieSBmaWx0ZXJUZXJtQWNjZXNzb3IuXG4gICAgLy8gTWF5IGJlIG92ZXJyaWRkZW4gZm9yIGN1c3RvbWl6YXRpb24uXG4gICAgdGhpcy5maWx0ZXJlZERhdGEgPSAodGhpcy5maWx0ZXIgPT0gbnVsbCB8fCB0aGlzLmZpbHRlciA9PT0gJycpID8gZGF0YSA6XG4gICAgICAgIGRhdGEuZmlsdGVyKG9iaiA9PiB0aGlzLmZpbHRlclByZWRpY2F0ZShvYmosIHRoaXMuZmlsdGVyKSk7XG5cbiAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHsgdGhpcy5fdXBkYXRlUGFnaW5hdG9yKHRoaXMuZmlsdGVyZWREYXRhLmxlbmd0aCk7IH1cblxuICAgIHJldHVybiB0aGlzLmZpbHRlcmVkRGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc29ydGVkIGNvcHkgb2YgdGhlIGRhdGEgaWYgTWF0U29ydCBoYXMgYSBzb3J0IGFwcGxpZWQsIG90aGVyd2lzZSBqdXN0IHJldHVybnMgdGhlXG4gICAqIGRhdGEgYXJyYXkgYXMgcHJvdmlkZWQuIFVzZXMgdGhlIGRlZmF1bHQgZGF0YSBhY2Nlc3NvciBmb3IgZGF0YSBsb29rdXAsIHVubGVzcyBhXG4gICAqIHNvcnREYXRhQWNjZXNzb3IgZnVuY3Rpb24gaXMgZGVmaW5lZC5cbiAgICovXG4gIF9vcmRlckRhdGEoZGF0YTogVFtdKTogVFtdIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBhY3RpdmUgc29ydCBvciBkaXJlY3Rpb24sIHJldHVybiB0aGUgZGF0YSB3aXRob3V0IHRyeWluZyB0byBzb3J0LlxuICAgIGlmICghdGhpcy5zb3J0KSB7IHJldHVybiBkYXRhOyB9XG5cbiAgICByZXR1cm4gdGhpcy5zb3J0RGF0YShkYXRhLnNsaWNlKCksIHRoaXMuc29ydCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHBhZ2VkIHNsaWNlIG9mIHRoZSBwcm92aWRlZCBkYXRhIGFycmF5IGFjY29yZGluZyB0byB0aGUgcHJvdmlkZWQgTWF0UGFnaW5hdG9yJ3MgcGFnZVxuICAgKiBpbmRleCBhbmQgbGVuZ3RoLiBJZiB0aGVyZSBpcyBubyBwYWdpbmF0b3IgcHJvdmlkZWQsIHJldHVybnMgdGhlIGRhdGEgYXJyYXkgYXMgcHJvdmlkZWQuXG4gICAqL1xuICBfcGFnZURhdGEoZGF0YTogVFtdKTogVFtdIHtcbiAgICBpZiAoIXRoaXMucGFnaW5hdG9yKSB7IHJldHVybiBkYXRhOyB9XG5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5wYWdpbmF0b3IucGFnZUluZGV4ICogdGhpcy5wYWdpbmF0b3IucGFnZVNpemU7XG4gICAgcmV0dXJuIGRhdGEuc2xpY2Uoc3RhcnRJbmRleCwgc3RhcnRJbmRleCArIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwYWdpbmF0b3IgdG8gcmVmbGVjdCB0aGUgbGVuZ3RoIG9mIHRoZSBmaWx0ZXJlZCBkYXRhLCBhbmQgbWFrZXMgc3VyZSB0aGF0IHRoZSBwYWdlXG4gICAqIGluZGV4IGRvZXMgbm90IGV4Y2VlZCB0aGUgcGFnaW5hdG9yJ3MgbGFzdCBwYWdlLiBWYWx1ZXMgYXJlIGNoYW5nZWQgaW4gYSByZXNvbHZlZCBwcm9taXNlIHRvXG4gICAqIGd1YXJkIGFnYWluc3QgbWFraW5nIHByb3BlcnR5IGNoYW5nZXMgd2l0aGluIGEgcm91bmQgb2YgY2hhbmdlIGRldGVjdGlvbi5cbiAgICovXG4gIF91cGRhdGVQYWdpbmF0b3IoZmlsdGVyZWREYXRhTGVuZ3RoOiBudW1iZXIpIHtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHRoaXMucGFnaW5hdG9yO1xuXG4gICAgICBpZiAoIXBhZ2luYXRvcikgeyByZXR1cm47IH1cblxuICAgICAgcGFnaW5hdG9yLmxlbmd0aCA9IGZpbHRlcmVkRGF0YUxlbmd0aDtcblxuICAgICAgLy8gSWYgdGhlIHBhZ2UgaW5kZXggaXMgc2V0IGJleW9uZCB0aGUgcGFnZSwgcmVkdWNlIGl0IHRvIHRoZSBsYXN0IHBhZ2UuXG4gICAgICBpZiAocGFnaW5hdG9yLnBhZ2VJbmRleCA+IDApIHtcbiAgICAgICAgY29uc3QgbGFzdFBhZ2VJbmRleCA9IE1hdGguY2VpbChwYWdpbmF0b3IubGVuZ3RoIC8gcGFnaW5hdG9yLnBhZ2VTaXplKSAtIDEgfHwgMDtcbiAgICAgICAgY29uc3QgbmV3UGFnZUluZGV4ID0gTWF0aC5taW4ocGFnaW5hdG9yLnBhZ2VJbmRleCwgbGFzdFBhZ2VJbmRleCk7XG5cbiAgICAgICAgaWYgKG5ld1BhZ2VJbmRleCAhPT0gcGFnaW5hdG9yLnBhZ2VJbmRleCkge1xuICAgICAgICAgIHBhZ2luYXRvci5wYWdlSW5kZXggPSBuZXdQYWdlSW5kZXg7XG5cbiAgICAgICAgICAvLyBTaW5jZSB0aGUgcGFnaW5hdG9yIG9ubHkgZW1pdHMgYWZ0ZXIgdXNlci1nZW5lcmF0ZWQgY2hhbmdlcyxcbiAgICAgICAgICAvLyB3ZSBuZWVkIG91ciBvd24gc3RyZWFtIHNvIHdlIGtub3cgdG8gc2hvdWxkIHJlLXJlbmRlciB0aGUgZGF0YS5cbiAgICAgICAgICB0aGlzLl9pbnRlcm5hbFBhZ2VDaGFuZ2VzLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIE1hdFRhYmxlLiBDYWxsZWQgd2hlbiBpdCBjb25uZWN0cyB0byB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoKSB7XG4gICAgaWYgKCF0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyRGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IHRoZSBNYXRUYWJsZS4gQ2FsbGVkIHdoZW4gaXQgZGlzY29ubmVjdHMgZnJvbSB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIERhdGEgc291cmNlIHRoYXQgYWNjZXB0cyBhIGNsaWVudC1zaWRlIGRhdGEgYXJyYXkgYW5kIGluY2x1ZGVzIG5hdGl2ZSBzdXBwb3J0IG9mIGZpbHRlcmluZyxcbiAqIHNvcnRpbmcgKHVzaW5nIE1hdFNvcnQpLCBhbmQgcGFnaW5hdGlvbiAodXNpbmcgTWF0UGFnaW5hdG9yKS5cbiAqXG4gKiBBbGxvd3MgZm9yIHNvcnQgY3VzdG9taXphdGlvbiBieSBvdmVycmlkaW5nIHNvcnRpbmdEYXRhQWNjZXNzb3IsIHdoaWNoIGRlZmluZXMgaG93IGRhdGFcbiAqIHByb3BlcnRpZXMgYXJlIGFjY2Vzc2VkLiBBbHNvIGFsbG93cyBmb3IgZmlsdGVyIGN1c3RvbWl6YXRpb24gYnkgb3ZlcnJpZGluZyBmaWx0ZXJUZXJtQWNjZXNzb3IsXG4gKiB3aGljaCBkZWZpbmVzIGhvdyByb3cgZGF0YSBpcyBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgZm9yIGZpbHRlciBtYXRjaGluZy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBjbGFzcyBpcyBtZWFudCB0byBiZSBhIHNpbXBsZSBkYXRhIHNvdXJjZSB0byBoZWxwIHlvdSBnZXQgc3RhcnRlZC4gQXMgc3VjaFxuICogaXQgaXNuJ3QgZXF1aXBwZWQgdG8gaGFuZGxlIHNvbWUgbW9yZSBhZHZhbmNlZCBjYXNlcyBsaWtlIHJvYnVzdCBpMThuIHN1cHBvcnQgb3Igc2VydmVyLXNpZGVcbiAqIGludGVyYWN0aW9ucy4gSWYgeW91ciBhcHAgbmVlZHMgdG8gc3VwcG9ydCBtb3JlIGFkdmFuY2VkIHVzZSBjYXNlcywgY29uc2lkZXIgaW1wbGVtZW50aW5nIHlvdXJcbiAqIG93biBgRGF0YVNvdXJjZWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJsZURhdGFTb3VyY2U8VD4gZXh0ZW5kcyBfTWF0VGFibGVEYXRhU291cmNlPFQsIE1hdFBhZ2luYXRvcj4ge31cbiJdfQ==