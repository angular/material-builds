/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, SPACE, ESCAPE, } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, ViewChild, } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatCalendarBody, MatCalendarCell, } from './calendar-body';
import { createMissingDateImplError } from './datepicker-errors';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { DateRange } from './date-selection-model';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
let MatMonthView = /** @class */ (() => {
    class MatMonthView {
        constructor(_changeDetectorRef, _dateFormats, _dateAdapter, _dir, _rangeStrategy) {
            this._changeDetectorRef = _changeDetectorRef;
            this._dateFormats = _dateFormats;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            this._rangeStrategy = _rangeStrategy;
            this._rerenderSubscription = Subscription.EMPTY;
            /** Emits when a new date is selected. */
            this.selectedChange = new EventEmitter();
            /** Emits when any date is selected. */
            this._userSelection = new EventEmitter();
            /** Emits when any date is activated. */
            this.activeDateChange = new EventEmitter();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
            this._activeDate = this._dateAdapter.today();
        }
        /**
         * The date to display in this month view (everything other than the month and year is ignored).
         */
        get activeDate() { return this._activeDate; }
        set activeDate(value) {
            const oldActiveDate = this._activeDate;
            const validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
            if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
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
            this._setRanges(this._selected);
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
        /** Handles when a new date is selected. */
        _dateSelected(event) {
            const date = event.value;
            const selectedYear = this._dateAdapter.getYear(this.activeDate);
            const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
            const selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);
            let rangeStartDate;
            let rangeEndDate;
            if (this._selected instanceof DateRange) {
                rangeStartDate = this._getDateInCurrentMonth(this._selected.start);
                rangeEndDate = this._getDateInCurrentMonth(this._selected.end);
            }
            else {
                rangeStartDate = rangeEndDate = this._getDateInCurrentMonth(this._selected);
            }
            if (rangeStartDate !== date || rangeEndDate !== date) {
                this.selectedChange.emit(selectedDate);
            }
            this._userSelection.emit({ value: selectedDate, event: event.event });
        }
        /** Handles keydown events on the calendar body when calendar is in month view. */
        _handleCalendarBodyKeydown(event) {
            // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
            // disabled ones from being selected. This may not be ideal, we should look into whether
            // navigation should skip over disabled dates, and if so, how to implement that efficiently.
            const oldActiveDate = this._activeDate;
            const isRtl = this._isRtl();
            switch (event.keyCode) {
                case LEFT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? 1 : -1);
                    break;
                case RIGHT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? -1 : 1);
                    break;
                case UP_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                    break;
                case DOWN_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                    break;
                case HOME:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                    break;
                case END:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                        this._dateAdapter.getDate(this._activeDate)));
                    break;
                case PAGE_UP:
                    this.activeDate = event.altKey ?
                        this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                        this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                    break;
                case PAGE_DOWN:
                    this.activeDate = event.altKey ?
                        this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                        this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                    break;
                case ENTER:
                case SPACE:
                    if (!this.dateFilter || this.dateFilter(this._activeDate)) {
                        this._dateSelected({ value: this._dateAdapter.getDate(this._activeDate), event });
                        // Prevent unexpected default actions such as form submission.
                        event.preventDefault();
                    }
                    return;
                case ESCAPE:
                    // Abort the current range selection if the user presses escape mid-selection.
                    if (this._previewEnd != null) {
                        this._previewStart = this._previewEnd = null;
                        this.selectedChange.emit(null);
                        this._userSelection.emit({ value: null, event });
                        event.preventDefault();
                        event.stopPropagation(); // Prevents the overlay from closing.
                    }
                    return;
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
        /** Initializes this month view. */
        _init() {
            this._setRanges(this.selected);
            this._todayDate = this._getCellCompareValue(this._dateAdapter.today());
            this._monthLabel =
                this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                    .toLocaleUpperCase();
            let firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
            this._firstWeekOffset =
                (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                    this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
            this._initWeekdays();
            this._createWeekCells();
            this._changeDetectorRef.markForCheck();
        }
        /** Focuses the active cell after the microtask queue is empty. */
        _focusActiveCell(movePreview) {
            this._matCalendarBody._focusActiveCell(movePreview);
        }
        /** Called when the user has activated a new cell and the preview needs to be updated. */
        _previewChanged({ event, value: cell }) {
            if (this._rangeStrategy) {
                // We can assume that this will be a range, because preview
                // events aren't fired for single date selections.
                const value = cell ? cell.rawValue : null;
                const previewRange = this._rangeStrategy.createPreview(value, this.selected, event);
                this._previewStart = this._getCellCompareValue(previewRange.start);
                this._previewEnd = this._getCellCompareValue(previewRange.end);
                // Note that here we need to use `detectChanges`, rather than `markForCheck`, because
                // the way `_focusActiveCell` is set up at the moment makes it fire at the wrong time
                // when navigating one month back using the keyboard which will cause this handler
                // to throw a "changed after checked" error when updating the preview state.
                this._changeDetectorRef.detectChanges();
            }
        }
        /** Initializes the weekdays. */
        _initWeekdays() {
            const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
            const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
            const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
            // Rotate the labels for days of the week based on the configured first day of the week.
            let weekdays = longWeekdays.map((long, i) => {
                return { long, narrow: narrowWeekdays[i] };
            });
            this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        }
        /** Creates MatCalendarCells for the dates in this month. */
        _createWeekCells() {
            const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
            const dateNames = this._dateAdapter.getDateNames();
            this._weeks = [[]];
            for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
                if (cell == DAYS_PER_WEEK) {
                    this._weeks.push([]);
                    cell = 0;
                }
                const date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
                const enabled = this._shouldEnableDate(date);
                const ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
                const cellClasses = this.dateClass ? this.dateClass(date) : undefined;
                this._weeks[this._weeks.length - 1].push(new MatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses, this._getCellCompareValue(date), date));
            }
        }
        /** Date filter for the month */
        _shouldEnableDate(date) {
            return !!date &&
                (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
                (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0) &&
                (!this.dateFilter || this.dateFilter(date));
        }
        /**
         * Gets the date in this month that the given Date falls on.
         * Returns null if the given Date is in another month.
         */
        _getDateInCurrentMonth(date) {
            return date && this._hasSameMonthAndYear(date, this.activeDate) ?
                this._dateAdapter.getDate(date) : null;
        }
        /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
        _hasSameMonthAndYear(d1, d2) {
            return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
                this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
        }
        /** Gets the value that will be used to one cell to another. */
        _getCellCompareValue(date) {
            if (date) {
                // We use the time since the Unix epoch to compare dates in this view, rather than the
                // cell values, because we need to support ranges that span across multiple months/years.
                const year = this._dateAdapter.getYear(date);
                const month = this._dateAdapter.getMonth(date);
                const day = this._dateAdapter.getDate(date);
                return new Date(year, month, day).getTime();
            }
            return null;
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
        /** Sets the current range based on a model value. */
        _setRanges(selectedValue) {
            if (selectedValue instanceof DateRange) {
                this._rangeStart = this._getCellCompareValue(selectedValue.start);
                this._rangeEnd = this._getCellCompareValue(selectedValue.end);
                this._isRange = true;
            }
            else {
                this._rangeStart = this._rangeEnd = this._getCellCompareValue(selectedValue);
                this._isRange = false;
            }
            this._comparisonRangeStart = this._getCellCompareValue(this.comparisonStart);
            this._comparisonRangeEnd = this._getCellCompareValue(this.comparisonEnd);
        }
    }
    MatMonthView.decorators = [
        { type: Component, args: [{
                    selector: 'mat-month-view',
                    template: "<table class=\"mat-calendar-table\" role=\"presentation\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      <th scope=\"col\" *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">{{day.narrow}}</th>\n    </tr>\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\" aria-hidden=\"true\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_monthLabel\"\n         [rows]=\"_weeks\"\n         [todayValue]=\"_todayDate!\"\n         [startValue]=\"_rangeStart!\"\n         [endValue]=\"_rangeEnd!\"\n         [comparisonStart]=\"_comparisonRangeStart\"\n         [comparisonEnd]=\"_comparisonRangeEnd\"\n         [previewStart]=\"_previewStart\"\n         [previewEnd]=\"_previewEnd\"\n         [isRange]=\"_isRange\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
                    exportAs: 'matMonthView',
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    MatMonthView.ctorParameters = () => [
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_SELECTION_STRATEGY,] }, { type: Optional }] }
    ];
    MatMonthView.propDecorators = {
        activeDate: [{ type: Input }],
        selected: [{ type: Input }],
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        dateFilter: [{ type: Input }],
        dateClass: [{ type: Input }],
        comparisonStart: [{ type: Input }],
        comparisonEnd: [{ type: Input }],
        selectedChange: [{ type: Output }],
        _userSelection: [{ type: Output }],
        activeDateChange: [{ type: Output }],
        _matCalendarBody: [{ type: ViewChild, args: [MatCalendarBody,] }]
    };
    return MatMonthView;
})();
export { MatMonthView };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL21vbnRoLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEdBQ1AsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsU0FBUyxHQUVWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sd0JBQXdCLENBQUM7QUFDckYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFDTCxlQUFlLEVBQ2YsZUFBZSxHQUdoQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRCxPQUFPLEVBRUwsaUNBQWlDLEdBQ2xDLE1BQU0saUNBQWlDLENBQUM7QUFHekMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBR3hCOzs7R0FHRztBQUNIO0lBQUEsTUFPYSxZQUFZO1FBOEd2QixZQUFvQixrQkFBcUMsRUFD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QkFDeEIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDs7OztnQkExQ0MsaUJBQWlCO2dEQTBKSixRQUFRLFlBQUksTUFBTSxTQUFDLGdCQUFnQjtnQkEvSTFDLFdBQVcsdUJBZ0pKLFFBQVE7Z0JBL0lmLGNBQWMsdUJBZ0pQLFFBQVE7Z0RBQ1IsTUFBTSxTQUFDLGlDQUFpQyxjQUFHLFFBQVE7Ozs2QkE1Ry9ELEtBQUs7MkJBY0wsS0FBSzswQkFjTCxLQUFLOzBCQVFMLEtBQUs7NkJBUUwsS0FBSzs0QkFHTCxLQUFLO2tDQUdMLEtBQUs7Z0NBR0wsS0FBSztpQ0FHTCxNQUFNO2lDQUdOLE1BQU07bUNBSU4sTUFBTTttQ0FHTixTQUFTLFNBQUMsZUFBZTs7SUE4UzVCLG1CQUFDO0tBQUE7U0F0WFksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBIT01FLFxuICBMRUZUX0FSUk9XLFxuICBQQUdFX0RPV04sXG4gIFBBR0VfVVAsXG4gIFJJR0hUX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgU1BBQ0UsXG4gIEVTQ0FQRSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBWaWV3Q2hpbGQsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyLCBNQVRfREFURV9GT1JNQVRTLCBNYXREYXRlRm9ybWF0c30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBNYXRDYWxlbmRhckJvZHksXG4gIE1hdENhbGVuZGFyQ2VsbCxcbiAgTWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcyxcbiAgTWF0Q2FsZW5kYXJVc2VyRXZlbnQsXG59IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0RhdGVSYW5nZX0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5pbXBvcnQge1xuICBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneSxcbiAgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZLFxufSBmcm9tICcuL2RhdGUtcmFuZ2Utc2VsZWN0aW9uLXN0cmF0ZWd5JztcblxuXG5jb25zdCBEQVlTX1BFUl9XRUVLID0gNztcblxuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgYSBzaW5nbGUgbW9udGggaW4gdGhlIGRhdGVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1tb250aC12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICdtb250aC12aWV3Lmh0bWwnLFxuICBleHBvcnRBczogJ21hdE1vbnRoVmlldycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1vbnRoVmlldzxEPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3JlcmVuZGVyU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0ZSB0byBkaXNwbGF5IGluIHRoaXMgbW9udGggdmlldyAoZXZlcnl0aGluZyBvdGhlciB0aGFuIHRoZSBtb250aCBhbmQgeWVhciBpcyBpZ25vcmVkKS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmVEYXRlKCk6IEQgeyByZXR1cm4gdGhpcy5fYWN0aXZlRGF0ZTsgfVxuICBzZXQgYWN0aXZlRGF0ZSh2YWx1ZTogRCkge1xuICAgIGNvbnN0IG9sZEFjdGl2ZURhdGUgPSB0aGlzLl9hY3RpdmVEYXRlO1xuICAgIGNvbnN0IHZhbGlkRGF0ZSA9XG4gICAgICAgIHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpIHx8IHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCk7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmNsYW1wRGF0ZSh2YWxpZERhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICBpZiAoIXRoaXMuX2hhc1NhbWVNb250aEFuZFllYXIob2xkQWN0aXZlRGF0ZSwgdGhpcy5fYWN0aXZlRGF0ZSkpIHtcbiAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfYWN0aXZlRGF0ZTogRDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRGF0ZVJhbmdlPEQ+IHwgRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7IH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbCkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGVSYW5nZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXRSYW5nZXModGhpcy5fc2VsZWN0ZWQpO1xuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluRGF0ZSgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9taW5EYXRlOyB9XG4gIHNldCBtaW5EYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21pbkRhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9taW5EYXRlOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4RGF0ZSgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXhEYXRlOyB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9tYXhEYXRlOiBEIHwgbnVsbDtcblxuICAvKiogRnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogKGRhdGU6IEQpID0+IE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXM7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPEQgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8RCB8IG51bGw+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfdXNlclNlbGVjdGlvbjogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPj4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgYWN0aXZhdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYWN0aXZlRGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBUaGUgYm9keSBvZiBjYWxlbmRhciB0YWJsZSAqL1xuICBAVmlld0NoaWxkKE1hdENhbGVuZGFyQm9keSkgX21hdENhbGVuZGFyQm9keTogTWF0Q2FsZW5kYXJCb2R5O1xuXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoaXMgbW9udGggKGUuZy4gXCJKYW51YXJ5IDIwMTdcIikuICovXG4gIF9tb250aExhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIEdyaWQgb2YgY2FsZW5kYXIgY2VsbHMgcmVwcmVzZW50aW5nIHRoZSBkYXRlcyBvZiB0aGUgbW9udGguICovXG4gIF93ZWVrczogTWF0Q2FsZW5kYXJDZWxsW11bXTtcblxuICAvKiogVGhlIG51bWJlciBvZiBibGFuayBjZWxscyBpbiB0aGUgZmlyc3Qgcm93IGJlZm9yZSB0aGUgMXN0IG9mIHRoZSBtb250aC4gKi9cbiAgX2ZpcnN0V2Vla09mZnNldDogbnVtYmVyO1xuXG4gIC8qKiBTdGFydCB2YWx1ZSBvZiB0aGUgY3VycmVudGx5LXNob3duIGRhdGUgcmFuZ2UuICovXG4gIF9yYW5nZVN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBFbmQgdmFsdWUgb2YgdGhlIGN1cnJlbnRseS1zaG93biBkYXRlIHJhbmdlLiAqL1xuICBfcmFuZ2VFbmQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFN0YXJ0IHZhbHVlIG9mIHRoZSBjdXJyZW50bHktc2hvd24gY29tcGFyaXNvbiBkYXRlIHJhbmdlLiAqL1xuICBfY29tcGFyaXNvblJhbmdlU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIEVuZCB2YWx1ZSBvZiB0aGUgY3VycmVudGx5LXNob3duIGNvbXBhcmlzb24gZGF0ZSByYW5nZS4gKi9cbiAgX2NvbXBhcmlzb25SYW5nZUVuZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogU3RhcnQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIF9wcmV2aWV3U3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX3ByZXZpZXdFbmQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgY3VycmVudGx5IHNlbGVjdGluZyBhIHJhbmdlIG9mIGRhdGVzLiAqL1xuICBfaXNSYW5nZTogYm9vbGVhbjtcblxuICAvKiogVGhlIGRhdGUgb2YgdGhlIG1vbnRoIHRoYXQgdG9kYXkgZmFsbHMgb24uIE51bGwgaWYgdG9kYXkgaXMgaW4gYW5vdGhlciBtb250aC4gKi9cbiAgX3RvZGF5RGF0ZTogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogVGhlIG5hbWVzIG9mIHRoZSB3ZWVrZGF5cy4gKi9cbiAgX3dlZWtkYXlzOiB7bG9uZzogc3RyaW5nLCBuYXJyb3c6IHN0cmluZ31bXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyPzogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZKSBAT3B0aW9uYWwoKVxuICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBfcmFuZ2VTdHJhdGVneT86IE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PEQ+KSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSB0aGlzLl9kYXRlQWRhcHRlci5sb2NhbGVDaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgobnVsbCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2luaXQoKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZXJlbmRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgd2hlbiBhIG5ldyBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBfZGF0ZVNlbGVjdGVkKGV2ZW50OiBNYXRDYWxlbmRhclVzZXJFdmVudDxudW1iZXI+KSB7XG4gICAgY29uc3QgZGF0ZSA9IGV2ZW50LnZhbHVlO1xuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKTtcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKTtcbiAgICBjb25zdCBzZWxlY3RlZERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKHNlbGVjdGVkWWVhciwgc2VsZWN0ZWRNb250aCwgZGF0ZSk7XG4gICAgbGV0IHJhbmdlU3RhcnREYXRlOiBudW1iZXIgfCBudWxsO1xuICAgIGxldCByYW5nZUVuZERhdGU6IG51bWJlciB8IG51bGw7XG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQgaW5zdGFuY2VvZiBEYXRlUmFuZ2UpIHtcbiAgICAgIHJhbmdlU3RhcnREYXRlID0gdGhpcy5fZ2V0RGF0ZUluQ3VycmVudE1vbnRoKHRoaXMuX3NlbGVjdGVkLnN0YXJ0KTtcbiAgICAgIHJhbmdlRW5kRGF0ZSA9IHRoaXMuX2dldERhdGVJbkN1cnJlbnRNb250aCh0aGlzLl9zZWxlY3RlZC5lbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRW5kRGF0ZSA9IHRoaXMuX2dldERhdGVJbkN1cnJlbnRNb250aCh0aGlzLl9zZWxlY3RlZCk7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlU3RhcnREYXRlICE9PSBkYXRlIHx8IHJhbmdlRW5kRGF0ZSAhPT0gZGF0ZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KHNlbGVjdGVkRGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXNlclNlbGVjdGlvbi5lbWl0KHt2YWx1ZTogc2VsZWN0ZWREYXRlLCBldmVudDogZXZlbnQuZXZlbnR9KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWRvd24gZXZlbnRzIG9uIHRoZSBjYWxlbmRhciBib2R5IHdoZW4gY2FsZW5kYXIgaXMgaW4gbW9udGggdmlldy4gKi9cbiAgX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBUT0RPKG1tYWxlcmJhKTogV2UgY3VycmVudGx5IGFsbG93IGtleWJvYXJkIG5hdmlnYXRpb24gdG8gZGlzYWJsZWQgZGF0ZXMsIGJ1dCBqdXN0IHByZXZlbnRcbiAgICAvLyBkaXNhYmxlZCBvbmVzIGZyb20gYmVpbmcgc2VsZWN0ZWQuIFRoaXMgbWF5IG5vdCBiZSBpZGVhbCwgd2Ugc2hvdWxkIGxvb2sgaW50byB3aGV0aGVyXG4gICAgLy8gbmF2aWdhdGlvbiBzaG91bGQgc2tpcCBvdmVyIGRpc2FibGVkIGRhdGVzLCBhbmQgaWYgc28sIGhvdyB0byBpbXBsZW1lbnQgdGhhdCBlZmZpY2llbnRseS5cblxuICAgIGNvbnN0IG9sZEFjdGl2ZURhdGUgPSB0aGlzLl9hY3RpdmVEYXRlO1xuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5faXNSdGwoKTtcblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCBpc1J0bCA/IC0xIDogMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHRoaXMuX2FjdGl2ZURhdGUsIC03KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCA3KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgICAgMSAtIHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGUodGhpcy5fYWN0aXZlRGF0ZSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAgICh0aGlzLl9kYXRlQWRhcHRlci5nZXROdW1EYXlzSW5Nb250aCh0aGlzLl9hY3RpdmVEYXRlKSAtXG4gICAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGUodGhpcy5fYWN0aXZlRGF0ZSkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfVVA6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGV2ZW50LmFsdEtleSA/XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIC0xKSA6XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGV2ZW50LmFsdEtleSA/XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIDEpIDpcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuX2FjdGl2ZURhdGUsIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICBpZiAoIXRoaXMuZGF0ZUZpbHRlciB8fCB0aGlzLmRhdGVGaWx0ZXIodGhpcy5fYWN0aXZlRGF0ZSkpIHtcbiAgICAgICAgICB0aGlzLl9kYXRlU2VsZWN0ZWQoe3ZhbHVlOiB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKHRoaXMuX2FjdGl2ZURhdGUpLCBldmVudH0pO1xuICAgICAgICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgLy8gQWJvcnQgdGhlIGN1cnJlbnQgcmFuZ2Ugc2VsZWN0aW9uIGlmIHRoZSB1c2VyIHByZXNzZXMgZXNjYXBlIG1pZC1zZWxlY3Rpb24uXG4gICAgICAgIGlmICh0aGlzLl9wcmV2aWV3RW5kICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9wcmV2aWV3U3RhcnQgPSB0aGlzLl9wcmV2aWV3RW5kID0gbnVsbDtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQobnVsbCk7XG4gICAgICAgICAgdGhpcy5fdXNlclNlbGVjdGlvbi5lbWl0KHt2YWx1ZTogbnVsbCwgZXZlbnR9KTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvLyBQcmV2ZW50cyB0aGUgb3ZlcmxheSBmcm9tIGNsb3NpbmcuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gRG9uJ3QgcHJldmVudCBkZWZhdWx0IG9yIGZvY3VzIGFjdGl2ZSBjZWxsIG9uIGtleXMgdGhhdCB3ZSBkb24ndCBleHBsaWNpdGx5IGhhbmRsZS5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShvbGRBY3RpdmVEYXRlLCB0aGlzLmFjdGl2ZURhdGUpKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGVDaGFuZ2UuZW1pdCh0aGlzLmFjdGl2ZURhdGUpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG1vbnRoIHZpZXcuICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuX3NldFJhbmdlcyh0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLl90b2RheURhdGUgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCkpO1xuICAgIHRoaXMuX21vbnRoTGFiZWwgPVxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aE5hbWVzKCdzaG9ydCcpW3RoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSldXG4gICAgICAgICAgICAudG9Mb2NhbGVVcHBlckNhc2UoKTtcblxuICAgIGxldCBmaXJzdE9mTW9udGggPSB0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSwgMSk7XG4gICAgdGhpcy5fZmlyc3RXZWVrT2Zmc2V0ID1cbiAgICAgICAgKERBWVNfUEVSX1dFRUsgKyB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXlPZldlZWsoZmlyc3RPZk1vbnRoKSAtXG4gICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRGaXJzdERheU9mV2VlaygpKSAlIERBWVNfUEVSX1dFRUs7XG5cbiAgICB0aGlzLl9pbml0V2Vla2RheXMoKTtcbiAgICB0aGlzLl9jcmVhdGVXZWVrQ2VsbHMoKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciB0aGUgbWljcm90YXNrIHF1ZXVlIGlzIGVtcHR5LiAqL1xuICBfZm9jdXNBY3RpdmVDZWxsKG1vdmVQcmV2aWV3PzogYm9vbGVhbikge1xuICAgIHRoaXMuX21hdENhbGVuZGFyQm9keS5fZm9jdXNBY3RpdmVDZWxsKG1vdmVQcmV2aWV3KTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgYWN0aXZhdGVkIGEgbmV3IGNlbGwgYW5kIHRoZSBwcmV2aWV3IG5lZWRzIHRvIGJlIHVwZGF0ZWQuICovXG4gIF9wcmV2aWV3Q2hhbmdlZCh7ZXZlbnQsIHZhbHVlOiBjZWxsfTogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8TWF0Q2FsZW5kYXJDZWxsPEQ+IHwgbnVsbD4pIHtcbiAgICBpZiAodGhpcy5fcmFuZ2VTdHJhdGVneSkge1xuICAgICAgLy8gV2UgY2FuIGFzc3VtZSB0aGF0IHRoaXMgd2lsbCBiZSBhIHJhbmdlLCBiZWNhdXNlIHByZXZpZXdcbiAgICAgIC8vIGV2ZW50cyBhcmVuJ3QgZmlyZWQgZm9yIHNpbmdsZSBkYXRlIHNlbGVjdGlvbnMuXG4gICAgICBjb25zdCB2YWx1ZSA9IGNlbGwgPyBjZWxsLnJhd1ZhbHVlISA6IG51bGw7XG4gICAgICBjb25zdCBwcmV2aWV3UmFuZ2UgPVxuICAgICAgICAgIHRoaXMuX3JhbmdlU3RyYXRlZ3kuY3JlYXRlUHJldmlldyh2YWx1ZSwgdGhpcy5zZWxlY3RlZCBhcyBEYXRlUmFuZ2U8RD4sIGV2ZW50KTtcbiAgICAgIHRoaXMuX3ByZXZpZXdTdGFydCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUocHJldmlld1JhbmdlLnN0YXJ0KTtcbiAgICAgIHRoaXMuX3ByZXZpZXdFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHByZXZpZXdSYW5nZS5lbmQpO1xuXG4gICAgICAvLyBOb3RlIHRoYXQgaGVyZSB3ZSBuZWVkIHRvIHVzZSBgZGV0ZWN0Q2hhbmdlc2AsIHJhdGhlciB0aGFuIGBtYXJrRm9yQ2hlY2tgLCBiZWNhdXNlXG4gICAgICAvLyB0aGUgd2F5IGBfZm9jdXNBY3RpdmVDZWxsYCBpcyBzZXQgdXAgYXQgdGhlIG1vbWVudCBtYWtlcyBpdCBmaXJlIGF0IHRoZSB3cm9uZyB0aW1lXG4gICAgICAvLyB3aGVuIG5hdmlnYXRpbmcgb25lIG1vbnRoIGJhY2sgdXNpbmcgdGhlIGtleWJvYXJkIHdoaWNoIHdpbGwgY2F1c2UgdGhpcyBoYW5kbGVyXG4gICAgICAvLyB0byB0aHJvdyBhIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3Igd2hlbiB1cGRhdGluZyB0aGUgcHJldmlldyBzdGF0ZS5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW5pdGlhbGl6ZXMgdGhlIHdlZWtkYXlzLiAqL1xuICBwcml2YXRlIF9pbml0V2Vla2RheXMoKSB7XG4gICAgY29uc3QgZmlyc3REYXlPZldlZWsgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRGaXJzdERheU9mV2VlaygpO1xuICAgIGNvbnN0IG5hcnJvd1dlZWtkYXlzID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF5T2ZXZWVrTmFtZXMoJ25hcnJvdycpO1xuICAgIGNvbnN0IGxvbmdXZWVrZGF5cyA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldERheU9mV2Vla05hbWVzKCdsb25nJyk7XG5cbiAgICAvLyBSb3RhdGUgdGhlIGxhYmVscyBmb3IgZGF5cyBvZiB0aGUgd2VlayBiYXNlZCBvbiB0aGUgY29uZmlndXJlZCBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgbGV0IHdlZWtkYXlzID0gbG9uZ1dlZWtkYXlzLm1hcCgobG9uZywgaSkgPT4ge1xuICAgICAgICByZXR1cm4ge2xvbmcsIG5hcnJvdzogbmFycm93V2Vla2RheXNbaV19O1xuICAgIH0pO1xuICAgIHRoaXMuX3dlZWtkYXlzID0gd2Vla2RheXMuc2xpY2UoZmlyc3REYXlPZldlZWspLmNvbmNhdCh3ZWVrZGF5cy5zbGljZSgwLCBmaXJzdERheU9mV2VlaykpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgTWF0Q2FsZW5kYXJDZWxscyBmb3IgdGhlIGRhdGVzIGluIHRoaXMgbW9udGguICovXG4gIHByaXZhdGUgX2NyZWF0ZVdlZWtDZWxscygpIHtcbiAgICBjb25zdCBkYXlzSW5Nb250aCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldE51bURheXNJbk1vbnRoKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgY29uc3QgZGF0ZU5hbWVzID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF0ZU5hbWVzKCk7XG4gICAgdGhpcy5fd2Vla3MgPSBbW11dO1xuICAgIGZvciAobGV0IGkgPSAwLCBjZWxsID0gdGhpcy5fZmlyc3RXZWVrT2Zmc2V0OyBpIDwgZGF5c0luTW9udGg7IGkrKywgY2VsbCsrKSB7XG4gICAgICBpZiAoY2VsbCA9PSBEQVlTX1BFUl9XRUVLKSB7XG4gICAgICAgIHRoaXMuX3dlZWtzLnB1c2goW10pO1xuICAgICAgICBjZWxsID0gMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKFxuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSwgaSArIDEpO1xuICAgICAgY29uc3QgZW5hYmxlZCA9IHRoaXMuX3Nob3VsZEVuYWJsZURhdGUoZGF0ZSk7XG4gICAgICBjb25zdCBhcmlhTGFiZWwgPSB0aGlzLl9kYXRlQWRhcHRlci5mb3JtYXQoZGF0ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5kYXRlQTExeUxhYmVsKTtcbiAgICAgIGNvbnN0IGNlbGxDbGFzc2VzID0gdGhpcy5kYXRlQ2xhc3MgPyB0aGlzLmRhdGVDbGFzcyhkYXRlKSA6IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy5fd2Vla3NbdGhpcy5fd2Vla3MubGVuZ3RoIC0gMV0ucHVzaChuZXcgTWF0Q2FsZW5kYXJDZWxsPEQ+KGkgKyAxLCBkYXRlTmFtZXNbaV0sXG4gICAgICAgICAgYXJpYUxhYmVsLCBlbmFibGVkLCBjZWxsQ2xhc3NlcywgdGhpcy5fZ2V0Q2VsbENvbXBhcmVWYWx1ZShkYXRlKSEsIGRhdGUpKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGF0ZSBmaWx0ZXIgZm9yIHRoZSBtb250aCAqL1xuICBwcml2YXRlIF9zaG91bGRFbmFibGVEYXRlKGRhdGU6IEQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISFkYXRlICYmXG4gICAgICAgICghdGhpcy5taW5EYXRlIHx8IHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGRhdGUsIHRoaXMubWluRGF0ZSkgPj0gMCkgJiZcbiAgICAgICAgKCF0aGlzLm1heERhdGUgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoZGF0ZSwgdGhpcy5tYXhEYXRlKSA8PSAwKSAmJlxuICAgICAgICAoIXRoaXMuZGF0ZUZpbHRlciB8fCB0aGlzLmRhdGVGaWx0ZXIoZGF0ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRhdGUgaW4gdGhpcyBtb250aCB0aGF0IHRoZSBnaXZlbiBEYXRlIGZhbGxzIG9uLlxuICAgKiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIERhdGUgaXMgaW4gYW5vdGhlciBtb250aC5cbiAgICovXG4gIHByaXZhdGUgX2dldERhdGVJbkN1cnJlbnRNb250aChkYXRlOiBEIHwgbnVsbCk6IG51bWJlciB8IG51bGwge1xuICAgIHJldHVybiBkYXRlICYmIHRoaXMuX2hhc1NhbWVNb250aEFuZFllYXIoZGF0ZSwgdGhpcy5hY3RpdmVEYXRlKSA/XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGUoZGF0ZSkgOiBudWxsO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSAyIGRhdGVzIGFyZSBub24tbnVsbCBhbmQgZmFsbCB3aXRoaW4gdGhlIHNhbWUgbW9udGggb2YgdGhlIHNhbWUgeWVhci4gKi9cbiAgcHJpdmF0ZSBfaGFzU2FtZU1vbnRoQW5kWWVhcihkMTogRCB8IG51bGwsIGQyOiBEIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIShkMSAmJiBkMiAmJiB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aChkMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZDIpICYmXG4gICAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZDEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZDIpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IHdpbGwgYmUgdXNlZCB0byBvbmUgY2VsbCB0byBhbm90aGVyLiAqL1xuICBwcml2YXRlIF9nZXRDZWxsQ29tcGFyZVZhbHVlKGRhdGU6IEQgfCBudWxsKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIC8vIFdlIHVzZSB0aGUgdGltZSBzaW5jZSB0aGUgVW5peCBlcG9jaCB0byBjb21wYXJlIGRhdGVzIGluIHRoaXMgdmlldywgcmF0aGVyIHRoYW4gdGhlXG4gICAgICAvLyBjZWxsIHZhbHVlcywgYmVjYXVzZSB3ZSBuZWVkIHRvIHN1cHBvcnQgcmFuZ2VzIHRoYXQgc3BhbiBhY3Jvc3MgbXVsdGlwbGUgbW9udGhzL3llYXJzLlxuICAgICAgY29uc3QgeWVhciA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGF0ZSk7XG4gICAgICBjb25zdCBtb250aCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKGRhdGUpO1xuICAgICAgY29uc3QgZGF5ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF0ZShkYXRlKTtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5KS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBUaGUgZ2l2ZW4gb2JqZWN0IGlmIGl0IGlzIGJvdGggYSBkYXRlIGluc3RhbmNlIGFuZCB2YWxpZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBwcml2YXRlIF9nZXRWYWxpZERhdGVPck51bGwob2JqOiBhbnkpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9kYXRlQWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQob2JqKSkgPyBvYmogOiBudWxsO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgdXNlciBoYXMgdGhlIFJUTCBsYXlvdXQgZGlyZWN0aW9uLiAqL1xuICBwcml2YXRlIF9pc1J0bCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCc7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCByYW5nZSBiYXNlZCBvbiBhIG1vZGVsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9zZXRSYW5nZXMoc2VsZWN0ZWRWYWx1ZTogRGF0ZVJhbmdlPEQ+IHwgRCB8IG51bGwpIHtcbiAgICBpZiAoc2VsZWN0ZWRWYWx1ZSBpbnN0YW5jZW9mIERhdGVSYW5nZSkge1xuICAgICAgdGhpcy5fcmFuZ2VTdGFydCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoc2VsZWN0ZWRWYWx1ZS5zdGFydCk7XG4gICAgICB0aGlzLl9yYW5nZUVuZCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoc2VsZWN0ZWRWYWx1ZS5lbmQpO1xuICAgICAgdGhpcy5faXNSYW5nZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JhbmdlU3RhcnQgPSB0aGlzLl9yYW5nZUVuZCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICB0aGlzLl9pc1JhbmdlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fY29tcGFyaXNvblJhbmdlU3RhcnQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuY29tcGFyaXNvblN0YXJ0KTtcbiAgICB0aGlzLl9jb21wYXJpc29uUmFuZ2VFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuY29tcGFyaXNvbkVuZCk7XG4gIH1cbn1cbiJdfQ==