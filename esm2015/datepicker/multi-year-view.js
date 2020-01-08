/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/multi-year-view.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @type {?} */
export const yearsPerPage = 24;
/** @type {?} */
export const yearsPerRow = 4;
/**
 * An internal component used to display a year selector in the datepicker.
 * \@docs-private
 * @template D
 */
export class MatMultiYearView {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _dateAdapter
     * @param {?=} _dir
     */
    constructor(_changeDetectorRef, _dateAdapter, _dir) {
        this._changeDetectorRef = _changeDetectorRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._rerenderSubscription = Subscription.EMPTY;
        /**
         * Emits when a new year is selected.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits the selected year. This doesn't imply a change on the selected date
         */
        this.yearSelected = new EventEmitter();
        /**
         * Emits when any date is activated.
         */
        this.activeDateChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._activeDate = this._dateAdapter.today();
    }
    /**
     * The date to display in this multi-year view (everything other than the year is ignored).
     * @return {?}
     */
    get activeDate() { return this._activeDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        /** @type {?} */
        let oldActiveDate = this._activeDate;
        /** @type {?} */
        const validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
        this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
        if (!isSameMultiYearView(this._dateAdapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
            this._init();
        }
    }
    /**
     * The currently selected date.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._selectedYear = this._selected && this._dateAdapter.getYear(this._selected);
    }
    /**
     * The minimum selectable date.
     * @return {?}
     */
    get minDate() { return this._minDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set minDate(value) {
        this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The maximum selectable date.
     * @return {?}
     */
    get maxDate() { return this._maxDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set maxDate(value) {
        this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._rerenderSubscription = this._dateAdapter.localeChanges
            .pipe(startWith(null))
            .subscribe((/**
         * @return {?}
         */
        () => this._init()));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Initializes this multi-year view.
     * @return {?}
     */
    _init() {
        this._todayYear = this._dateAdapter.getYear(this._dateAdapter.today());
        // We want a range years such that we maximize the number of
        // enabled dates visible at once. This prevents issues where the minimum year
        // is the last item of a page OR the maximum year is the first item of a page.
        // The offset from the active year to the "slot" for the starting year is the
        // *actual* first rendered year in the multi-year view.
        /** @type {?} */
        const activeYear = this._dateAdapter.getYear(this._activeDate);
        /** @type {?} */
        const minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
        this._years = [];
        for (let i = 0, row = []; i < yearsPerPage; i++) {
            row.push(minYearOfPage + i);
            if (row.length == yearsPerRow) {
                this._years.push(row.map((/**
                 * @param {?} year
                 * @return {?}
                 */
                year => this._createCellForYear(year))));
                row = [];
            }
        }
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Handles when a new year is selected.
     * @param {?} year
     * @return {?}
     */
    _yearSelected(year) {
        this.yearSelected.emit(this._dateAdapter.createDate(year, 0, 1));
        /** @type {?} */
        let month = this._dateAdapter.getMonth(this.activeDate);
        /** @type {?} */
        let daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(year, month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(year, month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    }
    /**
     * Handles keydown events on the calendar body when calendar is in multi-year view.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydown(event) {
        /** @type {?} */
        const oldActiveDate = this._activeDate;
        /** @type {?} */
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
                this._yearSelected(this._dateAdapter.getYear(this._activeDate));
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
    /**
     * @return {?}
     */
    _getActiveCell() {
        return getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
    }
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    _focusActiveCell() {
        this._matCalendarBody._focusActiveCell();
    }
    /**
     * Creates an MatCalendarCell for the given year.
     * @private
     * @param {?} year
     * @return {?}
     */
    _createCellForYear(year) {
        /** @type {?} */
        let yearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(year, 0, 1));
        return new MatCalendarCell(year, yearName, yearName, this._shouldEnableYear(year));
    }
    /**
     * Whether the given year is enabled.
     * @private
     * @param {?} year
     * @return {?}
     */
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
        /** @type {?} */
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
     * @private
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
    /**
     * Determines whether the user has the RTL layout direction.
     * @private
     * @return {?}
     */
    _isRtl() {
        return this._dir && this._dir.value === 'rtl';
    }
}
MatMultiYearView.decorators = [
    { type: Component, args: [{
                selector: 'mat-multi-year-view',
                template: "<table class=\"mat-calendar-table\" role=\"presentation\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [rows]=\"_years\"\n         [todayValue]=\"_todayYear\"\n         [selectedValue]=\"_selectedYear!\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_getActiveCell()\"\n         (selectedValueChange)=\"_yearSelected($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._rerenderSubscription;
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._activeDate;
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._selected;
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._minDate;
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._maxDate;
    /**
     * A function used to filter which dates are selectable.
     * @type {?}
     */
    MatMultiYearView.prototype.dateFilter;
    /**
     * Emits when a new year is selected.
     * @type {?}
     */
    MatMultiYearView.prototype.selectedChange;
    /**
     * Emits the selected year. This doesn't imply a change on the selected date
     * @type {?}
     */
    MatMultiYearView.prototype.yearSelected;
    /**
     * Emits when any date is activated.
     * @type {?}
     */
    MatMultiYearView.prototype.activeDateChange;
    /**
     * The body of calendar table
     * @type {?}
     */
    MatMultiYearView.prototype._matCalendarBody;
    /**
     * Grid of calendar cells representing the currently displayed years.
     * @type {?}
     */
    MatMultiYearView.prototype._years;
    /**
     * The year that today falls on.
     * @type {?}
     */
    MatMultiYearView.prototype._todayYear;
    /**
     * The year of the selected date. Null if the selected date is null.
     * @type {?}
     */
    MatMultiYearView.prototype._selectedYear;
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._changeDetectorRef;
    /** @type {?} */
    MatMultiYearView.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatMultiYearView.prototype._dir;
}
/**
 * @template D
 * @param {?} dateAdapter
 * @param {?} date1
 * @param {?} date2
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
export function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
    /** @type {?} */
    const year1 = dateAdapter.getYear(date1);
    /** @type {?} */
    const year2 = dateAdapter.getYear(date2);
    /** @type {?} */
    const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
    return Math.floor((year1 - startingYear) / yearsPerPage) ===
        Math.floor((year2 - startingYear) / yearsPerPage);
}
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 * @template D
 * @param {?} dateAdapter
 * @param {?} activeDate
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
export function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
    /** @type {?} */
    const activeYear = dateAdapter.getYear(activeDate);
    return euclideanModulo((activeYear - getStartingYear(dateAdapter, minDate, maxDate)), yearsPerPage);
}
/**
 * We pick a "starting" year such that either the maximum year would be at the end
 * or the minimum year would be at the beginning of a page.
 * @template D
 * @param {?} dateAdapter
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function getStartingYear(dateAdapter, minDate, maxDate) {
    /** @type {?} */
    let startingYear = 0;
    if (maxDate) {
        /** @type {?} */
        const maxYear = dateAdapter.getYear(maxDate);
        startingYear = maxYear - yearsPerPage + 1;
    }
    else if (minDate) {
        startingYear = dateAdapter.getYear(minDate);
    }
    return startingYear;
}
/**
 * Gets remainder that is non-negative, even if first number is negative
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function euclideanModulo(a, b) {
    return (a % b + b) % b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkteWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvbXVsdGkteWVhci12aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILEtBQUssRUFDTCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsRUFDUixLQUFLLEdBQ04sTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDOztBQUV6QyxNQUFNLE9BQU8sWUFBWSxHQUFHLEVBQUU7O0FBRTlCLE1BQU0sT0FBTyxXQUFXLEdBQUcsQ0FBQzs7Ozs7O0FBYTVCLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7OztJQW9FM0IsWUFBb0Isa0JBQXFDLEVBQzFCLFlBQTRCLEVBQzNCLElBQXFCO1FBRmpDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDMUIsaUJBQVksR0FBWixZQUFZLENBQWdCO1FB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b250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBIT01FLFxuICBMRUZUX0FSUk9XLFxuICBQQUdFX0RPV04sXG4gIFBBR0VfVVAsXG4gIFJJR0hUX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgU1BBQ0UsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtNYXRDYWxlbmRhckJvZHksIE1hdENhbGVuZGFyQ2VsbH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7Y3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3J9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGNvbnN0IHllYXJzUGVyUGFnZSA9IDI0O1xuXG5leHBvcnQgY29uc3QgeWVhcnNQZXJSb3cgPSA0O1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgYSB5ZWFyIHNlbGVjdG9yIGluIHRoZSBkYXRlcGlja2VyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbXVsdGkteWVhci12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICdtdWx0aS15ZWFyLXZpZXcuaHRtbCcsXG4gIGV4cG9ydEFzOiAnbWF0TXVsdGlZZWFyVmlldycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE1hdE11bHRpWWVhclZpZXc8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9yZXJlbmRlclN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIG11bHRpLXllYXIgdmlldyAoZXZlcnl0aGluZyBvdGhlciB0aGFuIHRoZSB5ZWFyIGlzIGlnbm9yZWQpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHsgcmV0dXJuIHRoaXMuX2FjdGl2ZURhdGU7IH1cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBsZXQgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgY29uc3QgdmFsaWREYXRlID1cbiAgICAgICAgdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSkgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIudG9kYXkoKTtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY2xhbXBEYXRlKHZhbGlkRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuXG4gICAgaWYgKCFpc1NhbWVNdWx0aVllYXJWaWV3KFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIsIG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKSkge1xuICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl9zZWxlY3RlZFllYXIgPSB0aGlzLl9zZWxlY3RlZCAmJiB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuX3NlbGVjdGVkKTtcbiAgfVxuICBwcml2YXRlIF9zZWxlY3RlZDogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbkRhdGUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluRGF0ZTsgfVxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluRGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWF4RGF0ZTsgfVxuICBzZXQgbWF4RGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXhEYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIEEgZnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IHllYXIgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhci4gVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB5ZWFyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBhY3RpdmF0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhY3RpdmVEYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIFRoZSBib2R5IG9mIGNhbGVuZGFyIHRhYmxlICovXG4gIEBWaWV3Q2hpbGQoTWF0Q2FsZW5kYXJCb2R5KSBfbWF0Q2FsZW5kYXJCb2R5OiBNYXRDYWxlbmRhckJvZHk7XG5cbiAgLyoqIEdyaWQgb2YgY2FsZW5kYXIgY2VsbHMgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIHllYXJzLiAqL1xuICBfeWVhcnM6IE1hdENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSB5ZWFyIHRoYXQgdG9kYXkgZmFsbHMgb24uICovXG4gIF90b2RheVllYXI6IG51bWJlcjtcblxuICAvKiogVGhlIHllYXIgb2YgdGhlIHNlbGVjdGVkIGRhdGUuIE51bGwgaWYgdGhlIHNlbGVjdGVkIGRhdGUgaXMgbnVsbC4gKi9cbiAgX3NlbGVjdGVkWWVhcjogbnVtYmVyIHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI/OiBEaXJlY3Rpb25hbGl0eSkge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci50b2RheSgpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5fZGF0ZUFkYXB0ZXIubG9jYWxlQ2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKG51bGwpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9pbml0KCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG11bHRpLXllYXIgdmlldy4gKi9cbiAgX2luaXQoKSB7XG4gICAgdGhpcy5fdG9kYXlZZWFyID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLl9kYXRlQWRhcHRlci50b2RheSgpKTtcblxuICAgIC8vIFdlIHdhbnQgYSByYW5nZSB5ZWFycyBzdWNoIHRoYXQgd2UgbWF4aW1pemUgdGhlIG51bWJlciBvZlxuICAgIC8vIGVuYWJsZWQgZGF0ZXMgdmlzaWJsZSBhdCBvbmNlLiBUaGlzIHByZXZlbnRzIGlzc3VlcyB3aGVyZSB0aGUgbWluaW11bSB5ZWFyXG4gICAgLy8gaXMgdGhlIGxhc3QgaXRlbSBvZiBhIHBhZ2UgT1IgdGhlIG1heGltdW0geWVhciBpcyB0aGUgZmlyc3QgaXRlbSBvZiBhIHBhZ2UuXG5cbiAgICAvLyBUaGUgb2Zmc2V0IGZyb20gdGhlIGFjdGl2ZSB5ZWFyIHRvIHRoZSBcInNsb3RcIiBmb3IgdGhlIHN0YXJ0aW5nIHllYXIgaXMgdGhlXG4gICAgLy8gKmFjdHVhbCogZmlyc3QgcmVuZGVyZWQgeWVhciBpbiB0aGUgbXVsdGkteWVhciB2aWV3LlxuICAgIGNvbnN0IGFjdGl2ZVllYXIgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgIGNvbnN0IG1pblllYXJPZlBhZ2UgPSBhY3RpdmVZZWFyIC0gZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIsIHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuXG4gICAgdGhpcy5feWVhcnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgcm93OiBudW1iZXJbXSA9IFtdOyBpIDwgeWVhcnNQZXJQYWdlOyBpKyspIHtcbiAgICAgIHJvdy5wdXNoKG1pblllYXJPZlBhZ2UgKyBpKTtcbiAgICAgIGlmIChyb3cubGVuZ3RoID09IHllYXJzUGVyUm93KSB7XG4gICAgICAgIHRoaXMuX3llYXJzLnB1c2gocm93Lm1hcCh5ZWFyID0+IHRoaXMuX2NyZWF0ZUNlbGxGb3JZZWFyKHllYXIpKSk7XG4gICAgICAgIHJvdyA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHdoZW4gYSBuZXcgeWVhciBpcyBzZWxlY3RlZC4gKi9cbiAgX3llYXJTZWxlY3RlZCh5ZWFyOiBudW1iZXIpIHtcbiAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KHRoaXMuX2RhdGVBZGFwdGVyLmNyZWF0ZURhdGUoeWVhciwgMCwgMSkpO1xuICAgIGxldCBtb250aCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgbGV0IGRheXNJbk1vbnRoID1cbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgodGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZSh5ZWFyLCBtb250aCwgMSkpO1xuICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKHllYXIsIG1vbnRoLFxuICAgICAgICBNYXRoLm1pbih0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksIGRheXNJbk1vbnRoKSkpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5ZG93biBldmVudHMgb24gdGhlIGNhbGVuZGFyIGJvZHkgd2hlbiBjYWxlbmRhciBpcyBpbiBtdWx0aS15ZWFyIHZpZXcuICovXG4gIF9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLl9pc1J0bCgpO1xuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgLXllYXJzUGVyUm93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgeWVhcnNQZXJSb3cpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIC1nZXRBY3RpdmVPZmZzZXQodGhpcy5fZGF0ZUFkYXB0ZXIsIHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIHllYXJzUGVyUGFnZSAtIGdldEFjdGl2ZU9mZnNldChcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLCB0aGlzLmFjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKSAtIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID1cbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSwgZXZlbnQuYWx0S2V5ID8gLXllYXJzUGVyUGFnZSAqIDEwIDogLXllYXJzUGVyUGFnZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsIGV2ZW50LmFsdEtleSA/IHllYXJzUGVyUGFnZSAqIDEwIDogeWVhcnNQZXJQYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgdGhpcy5feWVhclNlbGVjdGVkKHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5fYWN0aXZlRGF0ZSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvbid0IHByZXZlbnQgZGVmYXVsdCBvciBmb2N1cyBhY3RpdmUgY2VsbCBvbiBrZXlzIHRoYXQgd2UgZG9uJ3QgZXhwbGljaXRseSBoYW5kbGUuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKG9sZEFjdGl2ZURhdGUsIHRoaXMuYWN0aXZlRGF0ZSkpIHtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZUNoYW5nZS5lbWl0KHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsKCk7XG4gICAgLy8gUHJldmVudCB1bmV4cGVjdGVkIGRlZmF1bHQgYWN0aW9ucyBzdWNoIGFzIGZvcm0gc3VibWlzc2lvbi5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgX2dldEFjdGl2ZUNlbGwoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZ2V0QWN0aXZlT2Zmc2V0KHRoaXMuX2RhdGVBZGFwdGVyLCB0aGlzLmFjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciB0aGUgbWljcm90YXNrIHF1ZXVlIGlzIGVtcHR5LiAqL1xuICBfZm9jdXNBY3RpdmVDZWxsKCkge1xuICAgIHRoaXMuX21hdENhbGVuZGFyQm9keS5fZm9jdXNBY3RpdmVDZWxsKCk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhbiBNYXRDYWxlbmRhckNlbGwgZm9yIHRoZSBnaXZlbiB5ZWFyLiAqL1xuICBwcml2YXRlIF9jcmVhdGVDZWxsRm9yWWVhcih5ZWFyOiBudW1iZXIpIHtcbiAgICBsZXQgeWVhck5hbWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKHllYXIsIDAsIDEpKTtcbiAgICByZXR1cm4gbmV3IE1hdENhbGVuZGFyQ2VsbCh5ZWFyLCB5ZWFyTmFtZSwgeWVhck5hbWUsIHRoaXMuX3Nob3VsZEVuYWJsZVllYXIoeWVhcikpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHllYXIgaXMgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfc2hvdWxkRW5hYmxlWWVhcih5ZWFyOiBudW1iZXIpIHtcbiAgICAvLyBkaXNhYmxlIGlmIHRoZSB5ZWFyIGlzIGdyZWF0ZXIgdGhhbiBtYXhEYXRlIGxvd2VyIHRoYW4gbWluRGF0ZVxuICAgIGlmICh5ZWFyID09PSB1bmRlZmluZWQgfHwgeWVhciA9PT0gbnVsbCB8fFxuICAgICAgICAodGhpcy5tYXhEYXRlICYmIHllYXIgPiB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMubWF4RGF0ZSkpIHx8XG4gICAgICAgICh0aGlzLm1pbkRhdGUgJiYgeWVhciA8IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5taW5EYXRlKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBlbmFibGUgaWYgaXQgcmVhY2hlcyBoZXJlIGFuZCB0aGVyZSdzIG5vIGZpbHRlciBkZWZpbmVkXG4gICAgaWYgKCF0aGlzLmRhdGVGaWx0ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0T2ZZZWFyID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZSh5ZWFyLCAwLCAxKTtcblxuICAgIC8vIElmIGFueSBkYXRlIGluIHRoZSB5ZWFyIGlzIGVuYWJsZWQgY291bnQgdGhlIHllYXIgYXMgZW5hYmxlZC5cbiAgICBmb3IgKGxldCBkYXRlID0gZmlyc3RPZlllYXI7IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGF0ZSkgPT0geWVhcjtcbiAgICAgIGRhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXMoZGF0ZSwgMSkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGVGaWx0ZXIoZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VmFsaWREYXRlT3JOdWxsKG9iajogYW55KTogRCB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5fZGF0ZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJiB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKG9iaikpID8gb2JqIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHVzZXIgaGFzIHRoZSBSVEwgbGF5b3V0IGRpcmVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaXNSdGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVNdWx0aVllYXJWaWV3PEQ+KFxuICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sIGRhdGUxOiBELCBkYXRlMjogRCwgbWluRGF0ZTogRCB8IG51bGwsIG1heERhdGU6IEQgfCBudWxsKTogYm9vbGVhbiB7XG4gIGNvbnN0IHllYXIxID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMSk7XG4gIGNvbnN0IHllYXIyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMik7XG4gIGNvbnN0IHN0YXJ0aW5nWWVhciA9IGdldFN0YXJ0aW5nWWVhcihkYXRlQWRhcHRlciwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIHJldHVybiBNYXRoLmZsb29yKCh5ZWFyMSAtIHN0YXJ0aW5nWWVhcikgLyB5ZWFyc1BlclBhZ2UpID09PVxuICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIyIC0gc3RhcnRpbmdZZWFyKSAvIHllYXJzUGVyUGFnZSk7XG59XG5cbi8qKlxuICogV2hlbiB0aGUgbXVsdGkteWVhciB2aWV3IGlzIGZpcnN0IG9wZW5lZCwgdGhlIGFjdGl2ZSB5ZWFyIHdpbGwgYmUgaW4gdmlldy5cbiAqIFNvIHdlIGNvbXB1dGUgaG93IG1hbnkgeWVhcnMgYXJlIGJldHdlZW4gdGhlIGFjdGl2ZSB5ZWFyIGFuZCB0aGUgKnNsb3QqIHdoZXJlIG91clxuICogXCJzdGFydGluZ1llYXJcIiB3aWxsIHJlbmRlciB3aGVuIHBhZ2VkIGludG8gdmlldy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZU9mZnNldDxEPihcbiAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LCBhY3RpdmVEYXRlOiBELCBtaW5EYXRlOiBEIHwgbnVsbCwgbWF4RGF0ZTogRCB8IG51bGwpOiBudW1iZXIge1xuICBjb25zdCBhY3RpdmVZZWFyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihhY3RpdmVEYXRlKTtcbiAgcmV0dXJuIGV1Y2xpZGVhbk1vZHVsbygoYWN0aXZlWWVhciAtIGdldFN0YXJ0aW5nWWVhcihkYXRlQWRhcHRlciwgbWluRGF0ZSwgbWF4RGF0ZSkpLFxuICAgIHllYXJzUGVyUGFnZSk7XG59XG5cbi8qKlxuICogV2UgcGljayBhIFwic3RhcnRpbmdcIiB5ZWFyIHN1Y2ggdGhhdCBlaXRoZXIgdGhlIG1heGltdW0geWVhciB3b3VsZCBiZSBhdCB0aGUgZW5kXG4gKiBvciB0aGUgbWluaW11bSB5ZWFyIHdvdWxkIGJlIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBwYWdlLlxuICovXG5mdW5jdGlvbiBnZXRTdGFydGluZ1llYXI8RD4oXG4gIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPiwgbWluRGF0ZTogRCB8IG51bGwsIG1heERhdGU6IEQgfCBudWxsKTogbnVtYmVyIHtcbiAgbGV0IHN0YXJ0aW5nWWVhciA9IDA7XG4gIGlmIChtYXhEYXRlKSB7XG4gICAgY29uc3QgbWF4WWVhciA9IGRhdGVBZGFwdGVyLmdldFllYXIobWF4RGF0ZSk7XG4gICAgc3RhcnRpbmdZZWFyID0gbWF4WWVhciAtIHllYXJzUGVyUGFnZSArIDE7XG4gIH0gZWxzZSBpZiAobWluRGF0ZSkge1xuICAgIHN0YXJ0aW5nWWVhciA9IGRhdGVBZGFwdGVyLmdldFllYXIobWluRGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHN0YXJ0aW5nWWVhcjtcbn1cblxuLyoqIEdldHMgcmVtYWluZGVyIHRoYXQgaXMgbm9uLW5lZ2F0aXZlLCBldmVuIGlmIGZpcnN0IG51bWJlciBpcyBuZWdhdGl2ZSAqL1xuZnVuY3Rpb24gZXVjbGlkZWFuTW9kdWxvIChhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiAoYSAlIGIgKyBiKSAlIGI7XG59XG4iXX0=