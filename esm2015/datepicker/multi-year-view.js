/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, SPACE, } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatCalendarBody, MatCalendarCell } from './calendar-body';
import { createMissingDateImplError } from './datepicker-errors';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { DateRange } from './date-selection-model';
export const yearsPerPage = 24;
export const yearsPerRow = 4;
/**
 * An internal component used to display a year selector in the datepicker.
 * @docs-private
 */
let MatMultiYearView = /** @class */ (() => {
    class MatMultiYearView {
        constructor(_changeDetectorRef, _dateAdapter, _dir) {
            this._changeDetectorRef = _changeDetectorRef;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            this._rerenderSubscription = Subscription.EMPTY;
            /** Emits when a new year is selected. */
            this.selectedChange = new EventEmitter();
            /** Emits the selected year. This doesn't imply a change on the selected date */
            this.yearSelected = new EventEmitter();
            /** Emits when any date is activated. */
            this.activeDateChange = new EventEmitter();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            this._activeDate = this._dateAdapter.today();
        }
        /** The date to display in this multi-year view (everything other than the year is ignored). */
        get activeDate() { return this._activeDate; }
        set activeDate(value) {
            let oldActiveDate = this._activeDate;
            const validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
            if (!isSameMultiYearView(this._dateAdapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
                this._init();
            }
        }
        /** The currently selected date. */
        get selected() { return this._selected; }
        set selected(value) {
            if (value instanceof DateRange) {
                this._selected = value;
            }
            else {
                this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            }
            this._setSelectedYear(value);
        }
        /** The minimum selectable date. */
        get minDate() { return this._minDate; }
        set minDate(value) {
            this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        /** The maximum selectable date. */
        get maxDate() { return this._maxDate; }
        set maxDate(value) {
            this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        ngAfterContentInit() {
            this._rerenderSubscription = this._dateAdapter.localeChanges
                .pipe(startWith(null))
                .subscribe(() => this._init());
        }
        ngOnDestroy() {
            this._rerenderSubscription.unsubscribe();
        }
        /** Initializes this multi-year view. */
        _init() {
            this._todayYear = this._dateAdapter.getYear(this._dateAdapter.today());
            // We want a range years such that we maximize the number of
            // enabled dates visible at once. This prevents issues where the minimum year
            // is the last item of a page OR the maximum year is the first item of a page.
            // The offset from the active year to the "slot" for the starting year is the
            // *actual* first rendered year in the multi-year view.
            const activeYear = this._dateAdapter.getYear(this._activeDate);
            const minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
            this._years = [];
            for (let i = 0, row = []; i < yearsPerPage; i++) {
                row.push(minYearOfPage + i);
                if (row.length == yearsPerRow) {
                    this._years.push(row.map(year => this._createCellForYear(year)));
                    row = [];
                }
            }
            this._changeDetectorRef.markForCheck();
        }
        /** Handles when a new year is selected. */
        _yearSelected(event) {
            const year = event.value;
            this.yearSelected.emit(this._dateAdapter.createDate(year, 0, 1));
            let month = this._dateAdapter.getMonth(this.activeDate);
            let daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(year, month, 1));
            this.selectedChange.emit(this._dateAdapter.createDate(year, month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
        }
        /** Handles keydown events on the calendar body when calendar is in multi-year view. */
        _handleCalendarBodyKeydown(event) {
            const oldActiveDate = this._activeDate;
            const isRtl = this._isRtl();
            switch (event.keyCode) {
                case LEFT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, isRtl ? 1 : -1);
                    break;
                case RIGHT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, isRtl ? -1 : 1);
                    break;
                case UP_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -yearsPerRow);
                    break;
                case DOWN_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerRow);
                    break;
                case HOME:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate));
                    break;
                case END:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerPage - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate) - 1);
                    break;
                case PAGE_UP:
                    this.activeDate =
                        this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
                    break;
                case PAGE_DOWN:
                    this.activeDate =
                        this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
                    break;
                case ENTER:
                case SPACE:
                    this._yearSelected({ value: this._dateAdapter.getYear(this._activeDate), event });
                    break;
                default:
                    // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                    return;
            }
            if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
                this.activeDateChange.emit(this.activeDate);
            }
            this._focusActiveCell();
            // Prevent unexpected default actions such as form submission.
            event.preventDefault();
        }
        _getActiveCell() {
            return getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
        }
        /** Focuses the active cell after the microtask queue is empty. */
        _focusActiveCell() {
            this._matCalendarBody._focusActiveCell();
        }
        /** Creates an MatCalendarCell for the given year. */
        _createCellForYear(year) {
            let yearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(year, 0, 1));
            return new MatCalendarCell(year, yearName, yearName, this._shouldEnableYear(year));
        }
        /** Whether the given year is enabled. */
        _shouldEnableYear(year) {
            // disable if the year is greater than maxDate lower than minDate
            if (year === undefined || year === null ||
                (this.maxDate && year > this._dateAdapter.getYear(this.maxDate)) ||
                (this.minDate && year < this._dateAdapter.getYear(this.minDate))) {
                return false;
            }
            // enable if it reaches here and there's no filter defined
            if (!this.dateFilter) {
                return true;
            }
            const firstOfYear = this._dateAdapter.createDate(year, 0, 1);
            // If any date in the year is enabled count the year as enabled.
            for (let date = firstOfYear; this._dateAdapter.getYear(date) == year; date = this._dateAdapter.addCalendarDays(date, 1)) {
                if (this.dateFilter(date)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        _getValidDateOrNull(obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        }
        /** Determines whether the user has the RTL layout direction. */
        _isRtl() {
            return this._dir && this._dir.value === 'rtl';
        }
        /** Sets the currently-highlighted year based on a model value. */
        _setSelectedYear(value) {
            this._selectedYear = null;
            if (value instanceof DateRange) {
                const displayValue = value.start || value.end;
                if (displayValue) {
                    this._selectedYear = this._dateAdapter.getYear(displayValue);
                }
            }
            else if (value) {
                this._selectedYear = this._dateAdapter.getYear(value);
            }
        }
    }
    MatMultiYearView.decorators = [
        { type: Component, args: [{
                    selector: 'mat-multi-year-view',
                    template: "<table class=\"mat-calendar-table\" role=\"presentation\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [rows]=\"_years\"\n         [todayValue]=\"_todayYear\"\n         [startValue]=\"_selectedYear!\"\n         [endValue]=\"_selectedYear!\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_getActiveCell()\"\n         (selectedValueChange)=\"_yearSelected($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
                    exportAs: 'matMultiYearView',
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    MatMultiYearView.ctorParameters = () => [
        { type: ChangeDetectorRef },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: Directionality, decorators: [{ type: Optional }] }
    ];
    MatMultiYearView.propDecorators = {
        activeDate: [{ type: Input }],
        selected: [{ type: Input }],
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        dateFilter: [{ type: Input }],
        selectedChange: [{ type: Output }],
        yearSelected: [{ type: Output }],
        activeDateChange: [{ type: Output }],
        _matCalendarBody: [{ type: ViewChild, args: [MatCalendarBody,] }]
    };
    return MatMultiYearView;
})();
export { MatMultiYearView };
export function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
    const year1 = dateAdapter.getYear(date1);
    const year2 = dateAdapter.getYear(date2);
    const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
    return Math.floor((year1 - startingYear) / yearsPerPage) ===
        Math.floor((year2 - startingYear) / yearsPerPage);
}
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 */
export function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
    const activeYear = dateAdapter.getYear(activeDate);
    return euclideanModulo((activeYear - getStartingYear(dateAdapter, minDate, maxDate)), yearsPerPage);
}
/**
 * We pick a "starting" year such that either the maximum year would be at the end
 * or the minimum year would be at the beginning of a page.
 */
function getStartingYear(dateAdapter, minDate, maxDate) {
    let startingYear = 0;
    if (maxDate) {
        const maxYear = dateAdapter.getYear(maxDate);
        startingYear = maxYear - yearsPerPage + 1;
    }
    else if (minDate) {
        startingYear = dateAdapter.getYear(minDate);
    }
    return startingYear;
}
/** Gets remainder that is non-negative, even if first number is negative */
function euclideanModulo(a, b) {
    return (a % b + b) % b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkteWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvbXVsdGkteWVhci12aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILEtBQUssRUFDTCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsRUFDUixLQUFLLEdBQ04sTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBdUIsTUFBTSxpQkFBaUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFakQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUUvQixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRTdCOzs7R0FHRztBQUNIO0lBQUEsTUFPYSxnQkFBZ0I7UUEwRTNCLFlBQW9CLGtCQUFxQyxFQUMxQixZQUE0QixFQUMzQixJ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aUIsRUFBRSxPQUFpQjtJQUNoRixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25ELE9BQU8sZUFBZSxDQUFDLENBQUMsVUFBVSxHQUFHLGVBQWUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQ2xGLFlBQVksQ0FBQyxDQUFDO0FBQ2xCLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGVBQWUsQ0FDdEIsV0FBMkIsRUFBRSxPQUFpQixFQUFFLE9BQWlCO0lBQ2pFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLE9BQU8sRUFBRTtRQUNYLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsWUFBWSxHQUFHLE9BQU8sR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0tBQzNDO1NBQU0sSUFBSSxPQUFPLEVBQUU7UUFDbEIsWUFBWSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBRUQsNEVBQTRFO0FBQzVFLFNBQVMsZUFBZSxDQUFFLENBQVMsRUFBRSxDQUFTO0lBQzVDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgRU5URVIsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxuICBTUEFDRSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge01hdENhbGVuZGFyQm9keSwgTWF0Q2FsZW5kYXJDZWxsLCBNYXRDYWxlbmRhclVzZXJFdmVudH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7Y3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3J9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7RGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuZXhwb3J0IGNvbnN0IHllYXJzUGVyUGFnZSA9IDI0O1xuXG5leHBvcnQgY29uc3QgeWVhcnNQZXJSb3cgPSA0O1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgYSB5ZWFyIHNlbGVjdG9yIGluIHRoZSBkYXRlcGlja2VyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbXVsdGkteWVhci12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICdtdWx0aS15ZWFyLXZpZXcuaHRtbCcsXG4gIGV4cG9ydEFzOiAnbWF0TXVsdGlZZWFyVmlldycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE1hdE11bHRpWWVhclZpZXc8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9yZXJlbmRlclN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIG11bHRpLXllYXIgdmlldyAoZXZlcnl0aGluZyBvdGhlciB0aGFuIHRoZSB5ZWFyIGlzIGlnbm9yZWQpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHsgcmV0dXJuIHRoaXMuX2FjdGl2ZURhdGU7IH1cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBsZXQgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgY29uc3QgdmFsaWREYXRlID1cbiAgICAgICAgdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSkgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIudG9kYXkoKTtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY2xhbXBEYXRlKHZhbGlkRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuXG4gICAgaWYgKCFpc1NhbWVNdWx0aVllYXJWaWV3KFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIsIG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKSkge1xuICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZVJhbmdlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHRoaXMuX3NldFNlbGVjdGVkWWVhcih2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsO1xuXG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbkRhdGUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluRGF0ZTsgfVxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluRGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWF4RGF0ZTsgfVxuICBzZXQgbWF4RGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXhEYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIEEgZnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IHllYXIgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhci4gVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB5ZWFyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBhY3RpdmF0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhY3RpdmVEYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIFRoZSBib2R5IG9mIGNhbGVuZGFyIHRhYmxlICovXG4gIEBWaWV3Q2hpbGQoTWF0Q2FsZW5kYXJCb2R5KSBfbWF0Q2FsZW5kYXJCb2R5OiBNYXRDYWxlbmRhckJvZHk7XG5cbiAgLyoqIEdyaWQgb2YgY2FsZW5kYXIgY2VsbHMgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIHllYXJzLiAqL1xuICBfeWVhcnM6IE1hdENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSB5ZWFyIHRoYXQgdG9kYXkgZmFsbHMgb24uICovXG4gIF90b2RheVllYXI6IG51bWJlcjtcblxuICAvKiogVGhlIHllYXIgb2YgdGhlIHNlbGVjdGVkIGRhdGUuIE51bGwgaWYgdGhlIHNlbGVjdGVkIGRhdGUgaXMgbnVsbC4gKi9cbiAgX3NlbGVjdGVkWWVhcjogbnVtYmVyIHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI/OiBEaXJlY3Rpb25hbGl0eSkge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci50b2RheSgpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5fZGF0ZUFkYXB0ZXIubG9jYWxlQ2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKG51bGwpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9pbml0KCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG11bHRpLXllYXIgdmlldy4gKi9cbiAgX2luaXQoKSB7XG4gICAgdGhpcy5fdG9kYXlZZWFyID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLl9kYXRlQWRhcHRlci50b2RheSgpKTtcblxuICAgIC8vIFdlIHdhbnQgYSByYW5nZSB5ZWFycyBzdWNoIHRoYXQgd2UgbWF4aW1pemUgdGhlIG51bWJlciBvZlxuICAgIC8vIGVuYWJsZWQgZGF0ZXMgdmlzaWJsZSBhdCBvbmNlLiBUaGlzIHByZXZlbnRzIGlzc3VlcyB3aGVyZSB0aGUgbWluaW11bSB5ZWFyXG4gICAgLy8gaXMgdGhlIGxhc3QgaXRlbSBvZiBhIHBhZ2UgT1IgdGhlIG1heGltdW0geWVhciBpcyB0aGUgZmlyc3QgaXRlbSBvZiBhIHBhZ2UuXG5cbiAgICAvLyBUaGUgb2Zmc2V0IGZyb20gdGhlIGFjdGl2ZSB5ZWFyIHRvIHRoZSBcInNsb3RcIiBmb3IgdGhlIHN0YXJ0aW5nIHllYXIgaXMgdGhlXG4gICAgLy8gKmFjdHVhbCogZmlyc3QgcmVuZGVyZWQgeWVhciBpbiB0aGUgbXVsdGkteWVhciB2aWV3LlxuICAgIGNvbnN0IGFjdGl2ZVllYXIgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgIGNvbnN0IG1pblllYXJPZlBhZ2UgPSBhY3RpdmVZZWFyIC0gZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIsIHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuXG4gICAgdGhpcy5feWVhcnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgcm93OiBudW1iZXJbXSA9IFtdOyBpIDwgeWVhcnNQZXJQYWdlOyBpKyspIHtcbiAgICAgIHJvdy5wdXNoKG1pblllYXJPZlBhZ2UgKyBpKTtcbiAgICAgIGlmIChyb3cubGVuZ3RoID09IHllYXJzUGVyUm93KSB7XG4gICAgICAgIHRoaXMuX3llYXJzLnB1c2gocm93Lm1hcCh5ZWFyID0+IHRoaXMuX2NyZWF0ZUNlbGxGb3JZZWFyKHllYXIpKSk7XG4gICAgICAgIHJvdyA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHdoZW4gYSBuZXcgeWVhciBpcyBzZWxlY3RlZC4gKi9cbiAgX3llYXJTZWxlY3RlZChldmVudDogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8bnVtYmVyPikge1xuICAgIGNvbnN0IHllYXIgPSBldmVudC52YWx1ZTtcbiAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KHRoaXMuX2RhdGVBZGFwdGVyLmNyZWF0ZURhdGUoeWVhciwgMCwgMSkpO1xuICAgIGxldCBtb250aCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgbGV0IGRheXNJbk1vbnRoID1cbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgodGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZSh5ZWFyLCBtb250aCwgMSkpO1xuICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKHllYXIsIG1vbnRoLFxuICAgICAgICBNYXRoLm1pbih0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksIGRheXNJbk1vbnRoKSkpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5ZG93biBldmVudHMgb24gdGhlIGNhbGVuZGFyIGJvZHkgd2hlbiBjYWxlbmRhciBpcyBpbiBtdWx0aS15ZWFyIHZpZXcuICovXG4gIF9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLl9pc1J0bCgpO1xuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgLXllYXJzUGVyUm93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgeWVhcnNQZXJSb3cpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIC1nZXRBY3RpdmVPZmZzZXQodGhpcy5fZGF0ZUFkYXB0ZXIsIHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIHllYXJzUGVyUGFnZSAtIGdldEFjdGl2ZU9mZnNldChcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLCB0aGlzLmFjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKSAtIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID1cbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSwgZXZlbnQuYWx0S2V5ID8gLXllYXJzUGVyUGFnZSAqIDEwIDogLXllYXJzUGVyUGFnZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsIGV2ZW50LmFsdEtleSA/IHllYXJzUGVyUGFnZSAqIDEwIDogeWVhcnNQZXJQYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgdGhpcy5feWVhclNlbGVjdGVkKHt2YWx1ZTogdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLl9hY3RpdmVEYXRlKSwgZXZlbnR9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEb24ndCBwcmV2ZW50IGRlZmF1bHQgb3IgZm9jdXMgYWN0aXZlIGNlbGwgb24ga2V5cyB0aGF0IHdlIGRvbid0IGV4cGxpY2l0bHkgaGFuZGxlLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShvbGRBY3RpdmVEYXRlLCB0aGlzLmFjdGl2ZURhdGUpKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGVDaGFuZ2UuZW1pdCh0aGlzLmFjdGl2ZURhdGUpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIF9nZXRBY3RpdmVDZWxsKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGdldEFjdGl2ZU9mZnNldCh0aGlzLl9kYXRlQWRhcHRlciwgdGhpcy5hY3RpdmVEYXRlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgX2ZvY3VzQWN0aXZlQ2VsbCgpIHtcbiAgICB0aGlzLl9tYXRDYWxlbmRhckJvZHkuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYW4gTWF0Q2FsZW5kYXJDZWxsIGZvciB0aGUgZ2l2ZW4geWVhci4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ2VsbEZvclllYXIoeWVhcjogbnVtYmVyKSB7XG4gICAgbGV0IHllYXJOYW1lID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZSh5ZWFyLCAwLCAxKSk7XG4gICAgcmV0dXJuIG5ldyBNYXRDYWxlbmRhckNlbGwoeWVhciwgeWVhck5hbWUsIHllYXJOYW1lLCB0aGlzLl9zaG91bGRFbmFibGVZZWFyKHllYXIpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiB5ZWFyIGlzIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX3Nob3VsZEVuYWJsZVllYXIoeWVhcjogbnVtYmVyKSB7XG4gICAgLy8gZGlzYWJsZSBpZiB0aGUgeWVhciBpcyBncmVhdGVyIHRoYW4gbWF4RGF0ZSBsb3dlciB0aGFuIG1pbkRhdGVcbiAgICBpZiAoeWVhciA9PT0gdW5kZWZpbmVkIHx8IHllYXIgPT09IG51bGwgfHxcbiAgICAgICAgKHRoaXMubWF4RGF0ZSAmJiB5ZWFyID4gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLm1heERhdGUpKSB8fFxuICAgICAgICAodGhpcy5taW5EYXRlICYmIHllYXIgPCB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMubWluRGF0ZSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gZW5hYmxlIGlmIGl0IHJlYWNoZXMgaGVyZSBhbmQgdGhlcmUncyBubyBmaWx0ZXIgZGVmaW5lZFxuICAgIGlmICghdGhpcy5kYXRlRmlsdGVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdE9mWWVhciA9IHRoaXMuX2RhdGVBZGFwdGVyLmNyZWF0ZURhdGUoeWVhciwgMCwgMSk7XG5cbiAgICAvLyBJZiBhbnkgZGF0ZSBpbiB0aGUgeWVhciBpcyBlbmFibGVkIGNvdW50IHRoZSB5ZWFyIGFzIGVuYWJsZWQuXG4gICAgZm9yIChsZXQgZGF0ZSA9IGZpcnN0T2ZZZWFyOyB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUpID09IHllYXI7XG4gICAgICBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKGRhdGUsIDEpKSB7XG4gICAgICBpZiAodGhpcy5kYXRlRmlsdGVyKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIFRoZSBnaXZlbiBvYmplY3QgaWYgaXQgaXMgYm90aCBhIGRhdGUgaW5zdGFuY2UgYW5kIHZhbGlkLCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHByaXZhdGUgX2dldFZhbGlkRGF0ZU9yTnVsbChvYmo6IGFueSk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX2RhdGVBZGFwdGVyLmlzRGF0ZUluc3RhbmNlKG9iaikgJiYgdGhpcy5fZGF0ZUFkYXB0ZXIuaXNWYWxpZChvYmopKSA/IG9iaiA6IG51bGw7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSB1c2VyIGhhcyB0aGUgUlRMIGxheW91dCBkaXJlY3Rpb24uICovXG4gIHByaXZhdGUgX2lzUnRsKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJztcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBjdXJyZW50bHktaGlnaGxpZ2h0ZWQgeWVhciBiYXNlZCBvbiBhIG1vZGVsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9zZXRTZWxlY3RlZFllYXIodmFsdWU6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRZZWFyID0gbnVsbDtcblxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGVSYW5nZSkge1xuICAgICAgY29uc3QgZGlzcGxheVZhbHVlID0gdmFsdWUuc3RhcnQgfHwgdmFsdWUuZW5kO1xuXG4gICAgICBpZiAoZGlzcGxheVZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkWWVhciA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGlzcGxheVZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZFllYXIgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2FtZU11bHRpWWVhclZpZXc8RD4oXG4gIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPiwgZGF0ZTE6IEQsIGRhdGUyOiBELCBtaW5EYXRlOiBEIHwgbnVsbCwgbWF4RGF0ZTogRCB8IG51bGwpOiBib29sZWFuIHtcbiAgY29uc3QgeWVhcjEgPSBkYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUxKTtcbiAgY29uc3QgeWVhcjIgPSBkYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUyKTtcbiAgY29uc3Qgc3RhcnRpbmdZZWFyID0gZ2V0U3RhcnRpbmdZZWFyKGRhdGVBZGFwdGVyLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKHllYXIxIC0gc3RhcnRpbmdZZWFyKSAvIHllYXJzUGVyUGFnZSkgPT09XG4gICAgICAgICAgTWF0aC5mbG9vcigoeWVhcjIgLSBzdGFydGluZ1llYXIpIC8geWVhcnNQZXJQYWdlKTtcbn1cblxuLyoqXG4gKiBXaGVuIHRoZSBtdWx0aS15ZWFyIHZpZXcgaXMgZmlyc3Qgb3BlbmVkLCB0aGUgYWN0aXZlIHllYXIgd2lsbCBiZSBpbiB2aWV3LlxuICogU28gd2UgY29tcHV0ZSBob3cgbWFueSB5ZWFycyBhcmUgYmV0d2VlbiB0aGUgYWN0aXZlIHllYXIgYW5kIHRoZSAqc2xvdCogd2hlcmUgb3VyXG4gKiBcInN0YXJ0aW5nWWVhclwiIHdpbGwgcmVuZGVyIHdoZW4gcGFnZWQgaW50byB2aWV3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aXZlT2Zmc2V0PEQ+KFxuICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sIGFjdGl2ZURhdGU6IEQsIG1pbkRhdGU6IEQgfCBudWxsLCBtYXhEYXRlOiBEIHwgbnVsbCk6IG51bWJlciB7XG4gIGNvbnN0IGFjdGl2ZVllYXIgPSBkYXRlQWRhcHRlci5nZXRZZWFyKGFjdGl2ZURhdGUpO1xuICByZXR1cm4gZXVjbGlkZWFuTW9kdWxvKChhY3RpdmVZZWFyIC0gZ2V0U3RhcnRpbmdZZWFyKGRhdGVBZGFwdGVyLCBtaW5EYXRlLCBtYXhEYXRlKSksXG4gICAgeWVhcnNQZXJQYWdlKTtcbn1cblxuLyoqXG4gKiBXZSBwaWNrIGEgXCJzdGFydGluZ1wiIHllYXIgc3VjaCB0aGF0IGVpdGhlciB0aGUgbWF4aW11bSB5ZWFyIHdvdWxkIGJlIGF0IHRoZSBlbmRcbiAqIG9yIHRoZSBtaW5pbXVtIHllYXIgd291bGQgYmUgYXQgdGhlIGJlZ2lubmluZyBvZiBhIHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIGdldFN0YXJ0aW5nWWVhcjxEPihcbiAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LCBtaW5EYXRlOiBEIHwgbnVsbCwgbWF4RGF0ZTogRCB8IG51bGwpOiBudW1iZXIge1xuICBsZXQgc3RhcnRpbmdZZWFyID0gMDtcbiAgaWYgKG1heERhdGUpIHtcbiAgICBjb25zdCBtYXhZZWFyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihtYXhEYXRlKTtcbiAgICBzdGFydGluZ1llYXIgPSBtYXhZZWFyIC0geWVhcnNQZXJQYWdlICsgMTtcbiAgfSBlbHNlIGlmIChtaW5EYXRlKSB7XG4gICAgc3RhcnRpbmdZZWFyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihtaW5EYXRlKTtcbiAgfVxuICByZXR1cm4gc3RhcnRpbmdZZWFyO1xufVxuXG4vKiogR2V0cyByZW1haW5kZXIgdGhhdCBpcyBub24tbmVnYXRpdmUsIGV2ZW4gaWYgZmlyc3QgbnVtYmVyIGlzIG5lZ2F0aXZlICovXG5mdW5jdGlvbiBldWNsaWRlYW5Nb2R1bG8gKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIChhICUgYiArIGIpICUgYjtcbn1cbiJdfQ==