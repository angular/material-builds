/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-range-selection-strategy.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, InjectionToken } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from './date-selection-model';
/**
 * Injection token used to customize the date range selection behavior.
 * @type {?}
 */
export const MAT_DATE_RANGE_SELECTION_STRATEGY = new InjectionToken('MAT_DATE_RANGE_SELECTION_STRATEGY');
/**
 * Object that can be provided in order to customize the date range selection behavior.
 * @record
 * @template D
 */
export function MatDateRangeSelectionStrategy() { }
if (false) {
    /**
     * Called when the user has finished selecting a value.
     * @param {?} date Date that was selected. Will be null if the user cleared the selection.
     * @param {?} currentRange Range that is currently show in the calendar.
     * @param {?} event DOM event that triggered the selection. Currently only corresponds to a `click`
     *    event, but it may get expanded in the future.
     * @return {?}
     */
    MatDateRangeSelectionStrategy.prototype.selectionFinished = function (date, currentRange, event) { };
    /**
     * Called when the user has activated a new date (e.g. by hovering over
     * it or moving focus) and the calendar tries to display a date range.
     *
     * @param {?} activeDate Date that the user has activated. Will be null if the user moved
     *    focus to an element that's no a calendar cell.
     * @param {?} currentRange Range that is currently shown in the calendar.
     * @param {?} event DOM event that caused the preview to be changed. Will be either a
     *    `mouseenter`/`mouseleave` or `focus`/`blur` depending on how the user is navigating.
     * @return {?}
     */
    MatDateRangeSelectionStrategy.prototype.createPreview = function (activeDate, currentRange, event) { };
}
/**
 * Provides the default date range selection behavior.
 * @template D
 */
let DefaultMatCalendarRangeStrategy = /** @class */ (() => {
    /**
     * Provides the default date range selection behavior.
     * @template D
     */
    class DefaultMatCalendarRangeStrategy {
        /**
         * @param {?} _dateAdapter
         */
        constructor(_dateAdapter) {
            this._dateAdapter = _dateAdapter;
        }
        /**
         * @param {?} date
         * @param {?} currentRange
         * @return {?}
         */
        selectionFinished(date, currentRange) {
            let { start, end } = currentRange;
            if (start == null) {
                start = date;
            }
            else if (end == null && date && this._dateAdapter.compareDate(date, start) >= 0) {
                end = date;
            }
            else {
                start = date;
                end = null;
            }
            return new DateRange(start, end);
        }
        /**
         * @param {?} activeDate
         * @param {?} currentRange
         * @return {?}
         */
        createPreview(activeDate, currentRange) {
            /** @type {?} */
            let start = null;
            /** @type {?} */
            let end = null;
            if (currentRange.start && !currentRange.end && activeDate) {
                start = currentRange.start;
                end = activeDate;
            }
            return new DateRange(start, end);
        }
    }
    DefaultMatCalendarRangeStrategy.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DefaultMatCalendarRangeStrategy.ctorParameters = () => [
        { type: DateAdapter }
    ];
    return DefaultMatCalendarRangeStrategy;
})();
export { DefaultMatCalendarRangeStrategy };
if (false) {
    /**
     * @type {?}
     * @private
     */
    DefaultMatCalendarRangeStrategy.prototype._dateAdapter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7OztBQUdqRCxNQUFNLE9BQU8saUNBQWlDLEdBQzFDLElBQUksY0FBYyxDQUFxQyxtQ0FBbUMsQ0FBQzs7Ozs7O0FBRy9GLG1EQXFCQzs7Ozs7Ozs7OztJQWJDLHFHQUEwRjs7Ozs7Ozs7Ozs7O0lBWTFGLHVHQUE0Rjs7Ozs7O0FBSTlGOzs7OztJQUFBLE1BQ2EsK0JBQStCOzs7O1FBQzFDLFlBQW9CLFlBQTRCO1lBQTVCLGlCQUFZLEdBQVosWUFBWSxDQUFnQjtRQUFHLENBQUM7Ozs7OztRQUVwRCxpQkFBaUIsQ0FBQyxJQUFPLEVBQUUsWUFBMEI7Z0JBQy9DLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxHQUFHLFlBQVk7WUFFL0IsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7aUJBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNqRixHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ1o7aUJBQU07Z0JBQ0wsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDYixHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ1o7WUFFRCxPQUFPLElBQUksU0FBUyxDQUFJLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxDQUFDOzs7Ozs7UUFFRCxhQUFhLENBQUMsVUFBb0IsRUFBRSxZQUEwQjs7Z0JBQ3hELEtBQUssR0FBYSxJQUFJOztnQkFDdEIsR0FBRyxHQUFhLElBQUk7WUFFeEIsSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxVQUFVLEVBQUU7Z0JBQ3pELEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO2dCQUMzQixHQUFHLEdBQUcsVUFBVSxDQUFDO2FBQ2xCO1lBRUQsT0FBTyxJQUFJLFNBQVMsQ0FBSSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQzs7O2dCQTdCRixVQUFVOzs7O2dCQWhDSCxXQUFXOztJQThEbkIsc0NBQUM7S0FBQTtTQTdCWSwrQkFBK0I7Ozs7OztJQUM5Qix1REFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7RGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIGN1c3RvbWl6ZSB0aGUgZGF0ZSByYW5nZSBzZWxlY3Rpb24gYmVoYXZpb3IuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8YW55Pj4oJ01BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWScpO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHByb3ZpZGVkIGluIG9yZGVyIHRvIGN1c3RvbWl6ZSB0aGUgZGF0ZSByYW5nZSBzZWxlY3Rpb24gYmVoYXZpb3IuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PEQ+IHtcbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBmaW5pc2hlZCBzZWxlY3RpbmcgYSB2YWx1ZS5cbiAgICogQHBhcmFtIGRhdGUgRGF0ZSB0aGF0IHdhcyBzZWxlY3RlZC4gV2lsbCBiZSBudWxsIGlmIHRoZSB1c2VyIGNsZWFyZWQgdGhlIHNlbGVjdGlvbi5cbiAgICogQHBhcmFtIGN1cnJlbnRSYW5nZSBSYW5nZSB0aGF0IGlzIGN1cnJlbnRseSBzaG93IGluIHRoZSBjYWxlbmRhci5cbiAgICogQHBhcmFtIGV2ZW50IERPTSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgc2VsZWN0aW9uLiBDdXJyZW50bHkgb25seSBjb3JyZXNwb25kcyB0byBhIGBjbGlja2BcbiAgICogICAgZXZlbnQsIGJ1dCBpdCBtYXkgZ2V0IGV4cGFuZGVkIGluIHRoZSBmdXR1cmUuXG4gICAqL1xuICBzZWxlY3Rpb25GaW5pc2hlZChkYXRlOiBEIHwgbnVsbCwgY3VycmVudFJhbmdlOiBEYXRlUmFuZ2U8RD4sIGV2ZW50OiBFdmVudCk6IERhdGVSYW5nZTxEPjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGFjdGl2YXRlZCBhIG5ldyBkYXRlIChlLmcuIGJ5IGhvdmVyaW5nIG92ZXJcbiAgICogaXQgb3IgbW92aW5nIGZvY3VzKSBhbmQgdGhlIGNhbGVuZGFyIHRyaWVzIHRvIGRpc3BsYXkgYSBkYXRlIHJhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gYWN0aXZlRGF0ZSBEYXRlIHRoYXQgdGhlIHVzZXIgaGFzIGFjdGl2YXRlZC4gV2lsbCBiZSBudWxsIGlmIHRoZSB1c2VyIG1vdmVkXG4gICAqICAgIGZvY3VzIHRvIGFuIGVsZW1lbnQgdGhhdCdzIG5vIGEgY2FsZW5kYXIgY2VsbC5cbiAgICogQHBhcmFtIGN1cnJlbnRSYW5nZSBSYW5nZSB0aGF0IGlzIGN1cnJlbnRseSBzaG93biBpbiB0aGUgY2FsZW5kYXIuXG4gICAqIEBwYXJhbSBldmVudCBET00gZXZlbnQgdGhhdCBjYXVzZWQgdGhlIHByZXZpZXcgdG8gYmUgY2hhbmdlZC4gV2lsbCBiZSBlaXRoZXIgYVxuICAgKiAgICBgbW91c2VlbnRlcmAvYG1vdXNlbGVhdmVgIG9yIGBmb2N1c2AvYGJsdXJgIGRlcGVuZGluZyBvbiBob3cgdGhlIHVzZXIgaXMgbmF2aWdhdGluZy5cbiAgICovXG4gIGNyZWF0ZVByZXZpZXcoYWN0aXZlRGF0ZTogRCB8IG51bGwsIGN1cnJlbnRSYW5nZTogRGF0ZVJhbmdlPEQ+LCBldmVudDogRXZlbnQpOiBEYXRlUmFuZ2U8RD47XG59XG5cbi8qKiBQcm92aWRlcyB0aGUgZGVmYXVsdCBkYXRlIHJhbmdlIHNlbGVjdGlvbiBiZWhhdmlvci4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0TWF0Q2FsZW5kYXJSYW5nZVN0cmF0ZWd5PEQ+IGltcGxlbWVudHMgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHt9XG5cbiAgc2VsZWN0aW9uRmluaXNoZWQoZGF0ZTogRCwgY3VycmVudFJhbmdlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICBsZXQge3N0YXJ0LCBlbmR9ID0gY3VycmVudFJhbmdlO1xuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKGVuZCA9PSBudWxsICYmIGRhdGUgJiYgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoZGF0ZSwgc3RhcnQpID49IDApIHtcbiAgICAgIGVuZCA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICAgIGVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCk7XG4gIH1cblxuICBjcmVhdGVQcmV2aWV3KGFjdGl2ZURhdGU6IEQgfCBudWxsLCBjdXJyZW50UmFuZ2U6IERhdGVSYW5nZTxEPikge1xuICAgIGxldCBzdGFydDogRCB8IG51bGwgPSBudWxsO1xuICAgIGxldCBlbmQ6IEQgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChjdXJyZW50UmFuZ2Uuc3RhcnQgJiYgIWN1cnJlbnRSYW5nZS5lbmQgJiYgYWN0aXZlRGF0ZSkge1xuICAgICAgc3RhcnQgPSBjdXJyZW50UmFuZ2Uuc3RhcnQ7XG4gICAgICBlbmQgPSBhY3RpdmVEYXRlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZVJhbmdlPEQ+KHN0YXJ0LCBlbmQpO1xuICB9XG59XG4iXX0=