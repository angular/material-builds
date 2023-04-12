/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { MatCalendarCellHarness } from './calendar-cell-harness';
/** Harness for interacting with a standard Material calendar in tests. */
class MatCalendarHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /** Queries for the calendar's period toggle button. */
        this._periodButton = this.locatorFor('.mat-calendar-period-button');
    }
    static { this.hostSelector = '.mat-calendar'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarHarness`
     * that meets certain criteria.
     * @param options Options for filtering which calendar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCalendarHarness, options);
    }
    /**
     * Gets a list of cells inside the calendar.
     * @param filter Optionally filters which cells are included.
     */
    async getCells(filter = {}) {
        return this.locatorForAll(MatCalendarCellHarness.with(filter))();
    }
    /** Gets the current view that is being shown inside the calendar. */
    async getCurrentView() {
        if (await this.locatorForOptional('mat-multi-year-view')()) {
            return 2 /* CalendarView.MULTI_YEAR */;
        }
        if (await this.locatorForOptional('mat-year-view')()) {
            return 1 /* CalendarView.YEAR */;
        }
        return 0 /* CalendarView.MONTH */;
    }
    /** Gets the label of the current calendar view. */
    async getCurrentViewLabel() {
        return (await this._periodButton()).text();
    }
    /** Changes the calendar view by clicking on the view toggle button. */
    async changeView() {
        return (await this._periodButton()).click();
    }
    /** Goes to the next page of the current view (e.g. next month when inside the month view). */
    async next() {
        return (await this.locatorFor('.mat-calendar-next-button')()).click();
    }
    /**
     * Goes to the previous page of the current view
     * (e.g. previous month when inside the month view).
     */
    async previous() {
        return (await this.locatorFor('.mat-calendar-previous-button')()).click();
    }
    /**
     * Selects a cell in the current calendar view.
     * @param filter An optional filter to apply to the cells. The first cell matching the filter
     *     will be selected.
     */
    async selectCell(filter = {}) {
        const cells = await this.getCells(filter);
        if (!cells.length) {
            throw Error(`Cannot find calendar cell matching filter ${JSON.stringify(filter)}`);
        }
        await cells[0].select();
    }
}
export { MatCalendarHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL3Rlc3RpbmcvY2FsZW5kYXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQVMvRCwwRUFBMEU7QUFDMUUsTUFBYSxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFBeEQ7O1FBR0UsdURBQXVEO1FBQy9DLGtCQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBb0V6RSxDQUFDO2FBdkVRLGlCQUFZLEdBQUcsZUFBZSxBQUFsQixDQUFtQjtJQUt0Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBa0MsRUFBRTtRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBcUMsRUFBRTtRQUNwRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuRSxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLEtBQUssQ0FBQyxjQUFjO1FBQ2xCLElBQUksTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsRUFBRSxFQUFFO1lBQzFELHVDQUErQjtTQUNoQztRQUVELElBQUksTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxpQ0FBeUI7U0FDMUI7UUFFRCxrQ0FBMEI7SUFDNUIsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsbUJBQW1CO1FBQ3ZCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCx1RUFBdUU7SUFDdkUsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsOEZBQThGO0lBQzlGLEtBQUssQ0FBQyxJQUFJO1FBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLCtCQUErQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzVFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFxQyxFQUFFO1FBQ3RELE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixNQUFNLEtBQUssQ0FBQyw2Q0FBNkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEY7UUFDRCxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQixDQUFDOztTQXZFVSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlLCBDb21wb25lbnRIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NhbGVuZGFySGFybmVzc0ZpbHRlcnMsIENhbGVuZGFyQ2VsbEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RhdGVwaWNrZXItaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJDZWxsSGFybmVzc30gZnJvbSAnLi9jYWxlbmRhci1jZWxsLWhhcm5lc3MnO1xuXG4vKiogUG9zc2libGUgdmlld3Mgb2YgYSBgTWF0Q2FsZW5kYXJIYXJuZXNzYC4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIENhbGVuZGFyVmlldyB7XG4gIE1PTlRILFxuICBZRUFSLFxuICBNVUxUSV9ZRUFSLFxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGNhbGVuZGFyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtY2FsZW5kYXInO1xuXG4gIC8qKiBRdWVyaWVzIGZvciB0aGUgY2FsZW5kYXIncyBwZXJpb2QgdG9nZ2xlIGJ1dHRvbi4gKi9cbiAgcHJpdmF0ZSBfcGVyaW9kQnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWNhbGVuZGFyLXBlcmlvZC1idXR0b24nKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2FsZW5kYXJIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBjYWxlbmRhciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDYWxlbmRhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdENhbGVuZGFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRDYWxlbmRhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGNlbGxzIGluc2lkZSB0aGUgY2FsZW5kYXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIGNlbGxzIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldENlbGxzKGZpbHRlcjogQ2FsZW5kYXJDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0Q2FsZW5kYXJDZWxsSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRDYWxlbmRhckNlbGxIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHZpZXcgdGhhdCBpcyBiZWluZyBzaG93biBpbnNpZGUgdGhlIGNhbGVuZGFyLiAqL1xuICBhc3luYyBnZXRDdXJyZW50VmlldygpOiBQcm9taXNlPENhbGVuZGFyVmlldz4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnbWF0LW11bHRpLXllYXItdmlldycpKCkpIHtcbiAgICAgIHJldHVybiBDYWxlbmRhclZpZXcuTVVMVElfWUVBUjtcbiAgICB9XG5cbiAgICBpZiAoYXdhaXQgdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJ21hdC15ZWFyLXZpZXcnKSgpKSB7XG4gICAgICByZXR1cm4gQ2FsZW5kYXJWaWV3LllFQVI7XG4gICAgfVxuXG4gICAgcmV0dXJuIENhbGVuZGFyVmlldy5NT05USDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgY3VycmVudCBjYWxlbmRhciB2aWV3LiAqL1xuICBhc3luYyBnZXRDdXJyZW50Vmlld0xhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9wZXJpb2RCdXR0b24oKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIENoYW5nZXMgdGhlIGNhbGVuZGFyIHZpZXcgYnkgY2xpY2tpbmcgb24gdGhlIHZpZXcgdG9nZ2xlIGJ1dHRvbi4gKi9cbiAgYXN5bmMgY2hhbmdlVmlldygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3BlcmlvZEJ1dHRvbigpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdvZXMgdG8gdGhlIG5leHQgcGFnZSBvZiB0aGUgY3VycmVudCB2aWV3IChlLmcuIG5leHQgbW9udGggd2hlbiBpbnNpZGUgdGhlIG1vbnRoIHZpZXcpLiAqL1xuICBhc3luYyBuZXh0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRm9yKCcubWF0LWNhbGVuZGFyLW5leHQtYnV0dG9uJykoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHb2VzIHRvIHRoZSBwcmV2aW91cyBwYWdlIG9mIHRoZSBjdXJyZW50IHZpZXdcbiAgICogKGUuZy4gcHJldmlvdXMgbW9udGggd2hlbiBpbnNpZGUgdGhlIG1vbnRoIHZpZXcpLlxuICAgKi9cbiAgYXN5bmMgcHJldmlvdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtY2FsZW5kYXItcHJldmlvdXMtYnV0dG9uJykoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGEgY2VsbCBpbiB0aGUgY3VycmVudCBjYWxlbmRhciB2aWV3LlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2VsbHMuIFRoZSBmaXJzdCBjZWxsIG1hdGNoaW5nIHRoZSBmaWx0ZXJcbiAgICogICAgIHdpbGwgYmUgc2VsZWN0ZWQuXG4gICAqL1xuICBhc3luYyBzZWxlY3RDZWxsKGZpbHRlcjogQ2FsZW5kYXJDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNlbGxzID0gYXdhaXQgdGhpcy5nZXRDZWxscyhmaWx0ZXIpO1xuICAgIGlmICghY2VsbHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgY2FsZW5kYXIgY2VsbCBtYXRjaGluZyBmaWx0ZXIgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICBhd2FpdCBjZWxsc1swXS5zZWxlY3QoKTtcbiAgfVxufVxuIl19