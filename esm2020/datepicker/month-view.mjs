/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, SPACE, ESCAPE, hasModifierKey, } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, ViewChild, } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatCalendarBody, MatCalendarCell, } from './calendar-body';
import { createMissingDateImplError } from './datepicker-errors';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { DateRange } from './date-selection-model';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/core";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "./calendar-body";
import * as i4 from "@angular/common";
const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export class MatMonthView {
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
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
        }
        this._activeDate = this._dateAdapter.today();
    }
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    get activeDate() { return this._activeDate; }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        const validDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
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
            this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        this._setRanges(this._selected);
    }
    /** The minimum selectable date. */
    get minDate() { return this._minDate; }
    set minDate(value) {
        this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() { return this._maxDate; }
    set maxDate(value) {
        this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    ngAfterContentInit() {
        this._rerenderSubscription = this._dateAdapter.localeChanges
            .pipe(startWith(null))
            .subscribe(() => this._init());
    }
    ngOnChanges(changes) {
        const comparisonChange = changes['comparisonStart'] || changes['comparisonEnd'];
        if (comparisonChange && !comparisonChange.firstChange) {
            this._setRanges(this.selected);
        }
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
        this._previewStart = this._previewEnd = null;
        this._changeDetectorRef.markForCheck();
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
                this._selectionKeyPressed = true;
                if (this._canSelect(this._activeDate)) {
                    // Prevent unexpected default actions such as form submission.
                    // Note that we only prevent the default action here while the selection happens in
                    // `keyup` below. We can't do the selection here, because it can cause the calendar to
                    // reopen if focus is restored immediately. We also can't call `preventDefault` on `keyup`
                    // because it's too late (see #23305).
                    event.preventDefault();
                }
                return;
            case ESCAPE:
                // Abort the current range selection if the user presses escape mid-selection.
                if (this._previewEnd != null && !hasModifierKey(event)) {
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
    /** Handles keyup events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeyup(event) {
        if (event.keyCode === SPACE || event.keyCode === ENTER) {
            if (this._selectionKeyPressed && this._canSelect(this._activeDate)) {
                this._dateSelected({ value: this._dateAdapter.getDate(this._activeDate), event });
            }
            this._selectionKeyPressed = false;
        }
    }
    /** Initializes this month view. */
    _init() {
        this._setRanges(this.selected);
        this._todayDate = this._getCellCompareValue(this._dateAdapter.today());
        this._monthLabel = this._dateFormats.display.monthLabel
            ? this._dateAdapter.format(this.activeDate, this._dateFormats.display.monthLabel)
            : this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
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
            const cellClasses = this.dateClass ? this.dateClass(date, 'month') : undefined;
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
    /** Gets whether a date can be selected in the month view. */
    _canSelect(date) {
        return !this.dateFilter || this.dateFilter(date);
    }
}
MatMonthView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatMonthView, deps: [{ token: i0.ChangeDetectorRef }, { token: MAT_DATE_FORMATS, optional: true }, { token: i1.DateAdapter, optional: true }, { token: i2.Directionality, optional: true }, { token: MAT_DATE_RANGE_SELECTION_STRATEGY, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatMonthView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatMonthView, selector: "mat-month-view", inputs: { activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", dateFilter: "dateFilter", dateClass: "dateClass", comparisonStart: "comparisonStart", comparisonEnd: "comparisonEnd" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection", activeDateChange: "activeDateChange" }, viewQueries: [{ propertyName: "_matCalendarBody", first: true, predicate: MatCalendarBody, descendants: true }], exportAs: ["matMonthView"], usesOnChanges: true, ngImport: i0, template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      <!-- For the day-of-the-week column header, we use an `<abbr>` element because VoiceOver\n           ignores the `aria-label`. ChromeVox, however, does not read the full name\n           for the `<abbr>`, so we still set `aria-label` on the header element. -->\n      <th scope=\"col\" *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">\n        <abbr class=\"mat-calendar-abbr\" [attr.title]=\"day.long\">{{day.narrow}}</abbr>\n      </th>\n    </tr>\n    <tr><th aria-hidden=\"true\" class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_monthLabel\"\n         [rows]=\"_weeks\"\n         [todayValue]=\"_todayDate!\"\n         [startValue]=\"_rangeStart!\"\n         [endValue]=\"_rangeEnd!\"\n         [comparisonStart]=\"_comparisonRangeStart\"\n         [comparisonEnd]=\"_comparisonRangeEnd\"\n         [previewStart]=\"_previewStart\"\n         [previewEnd]=\"_previewEnd\"\n         [isRange]=\"_isRange\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n", components: [{ type: i3.MatCalendarBody, selector: "[mat-calendar-body]", inputs: ["label", "rows", "todayValue", "startValue", "endValue", "labelMinRequiredCells", "numCols", "activeCell", "isRange", "cellAspectRatio", "comparisonStart", "comparisonEnd", "previewStart", "previewEnd"], outputs: ["selectedValueChange", "previewChange"], exportAs: ["matCalendarBody"] }], directives: [{ type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatMonthView, decorators: [{
            type: Component,
            args: [{ selector: 'mat-month-view', exportAs: 'matMonthView', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      <!-- For the day-of-the-week column header, we use an `<abbr>` element because VoiceOver\n           ignores the `aria-label`. ChromeVox, however, does not read the full name\n           for the `<abbr>`, so we still set `aria-label` on the header element. -->\n      <th scope=\"col\" *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">\n        <abbr class=\"mat-calendar-abbr\" [attr.title]=\"day.long\">{{day.narrow}}</abbr>\n      </th>\n    </tr>\n    <tr><th aria-hidden=\"true\" class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_monthLabel\"\n         [rows]=\"_weeks\"\n         [todayValue]=\"_todayDate!\"\n         [startValue]=\"_rangeStart!\"\n         [endValue]=\"_rangeEnd!\"\n         [comparisonStart]=\"_comparisonRangeStart\"\n         [comparisonEnd]=\"_comparisonRangeEnd\"\n         [previewStart]=\"_previewStart\"\n         [previewEnd]=\"_previewEnd\"\n         [isRange]=\"_isRange\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_FORMATS]
                }] }, { type: i1.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DATE_RANGE_SELECTION_STRATEGY]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], dateClass: [{
                type: Input
            }], comparisonStart: [{
                type: Input
            }], comparisonEnd: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], _matCalendarBody: [{
                type: ViewChild,
                args: [MatCalendarBody]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL21vbnRoLXZpZXcudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9tb250aC12aWV3Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBQ04sY0FBYyxHQUNmLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFNBQVMsR0FJVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFpQixNQUFNLHdCQUF3QixDQUFDO0FBQ3JGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsZUFBZSxFQUNmLGVBQWUsR0FHaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakQsT0FBTyxFQUVMLGlDQUFpQyxHQUNsQyxNQUFNLGlDQUFpQyxDQUFDOzs7Ozs7QUFHekMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBR3hCOzs7R0FHRztBQVFILE1BQU0sT0FBTyxZQUFZO0lBbUh2QixZQUFxQixrQkFBcUMsRUFDQSxZQUE0QixFQUN2RCxZQUE0QixFQUMzQixJQUFxQixFQUU3QixjQUFpRDtRQUxwRCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ0EsaUJBQVksR0FBWixZQUFZLENBQWdCO1FBQ3ZELGlCQUFZLEdBQVosWUFBWSxDQUFnQjtRQUMzQixTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUU3QixtQkFBYyxHQUFkLGNBQWMsQ0FBbUM7UUF2SGpFLDBCQUFxQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFpRW5ELHlDQUF5QztRQUN0QixtQkFBYyxHQUEyQixJQUFJLFlBQVksRUFBWSxDQUFDO1FBRXpGLHVDQUF1QztRQUNwQixtQkFBYyxHQUM3QixJQUFJLFlBQVksRUFBa0MsQ0FBQztRQUV2RCx3Q0FBd0M7UUFDckIscUJBQWdCLEdBQW9CLElBQUksWUFBWSxFQUFLLENBQUM7UUFnRDNFLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsRUFBRTtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsTUFBTSwwQkFBMEIsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNqRDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QixNQUFNLDBCQUEwQixDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDdEQ7U0FDRjtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBOUhEOztPQUVHO0lBQ0gsSUFDSSxVQUFVLEtBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFJLFVBQVUsQ0FBQyxLQUFRO1FBQ3JCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDdkMsTUFBTSxTQUFTLEdBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQ3JDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDL0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBR0QsbUNBQW1DO0lBQ25DLElBQ0ksUUFBUSxLQUE4QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLElBQUksUUFBUSxDQUFDLEtBQThCO1FBQ3pDLElBQUksS0FBSyxZQUFZLFNBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDN0Y7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBR0QsbUNBQW1DO0lBQ25DLElBQ0ksT0FBTyxLQUFlLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDakQsSUFBSSxPQUFPLENBQUMsS0FBZTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBR0QsbUNBQW1DO0lBQ25DLElBQ0ksT0FBTyxLQUFlLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDakQsSUFBSSxPQUFPLENBQUMsS0FBZTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBbUZELGtCQUFrQjtRQUNoQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhO2FBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFaEYsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRTtZQUNyRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsYUFBYSxDQUFDLEtBQW1DO1FBQy9DLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JGLElBQUksY0FBNkIsQ0FBQztRQUNsQyxJQUFJLFlBQTJCLENBQUM7UUFFaEMsSUFBSSxJQUFJLENBQUMsU0FBUyxZQUFZLFNBQVMsRUFBRTtZQUN2QyxjQUFjLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkUsWUFBWSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hFO2FBQU07WUFDTCxjQUFjLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDN0U7UUFFRCxJQUFJLGNBQWMsS0FBSyxJQUFJLElBQUksWUFBWSxLQUFLLElBQUksRUFBRTtZQUNwRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELGtGQUFrRjtJQUNsRiwwQkFBMEIsQ0FBQyxLQUFvQjtRQUM3Qyw2RkFBNkY7UUFDN0Ysd0ZBQXdGO1FBQ3hGLDRGQUE0RjtRQUU1RixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QixRQUFRLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDckIsS0FBSyxVQUFVO2dCQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEYsTUFBTTtZQUNSLEtBQUssV0FBVztnQkFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RGLE1BQU07WUFDUixLQUFLLFFBQVE7Z0JBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFFLE1BQU07WUFDUixLQUFLLFVBQVU7Z0JBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxNQUFNO1lBQ1IsS0FBSyxJQUFJO2dCQUNQLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFDaEUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFDaEUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3BELElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU07WUFDUixLQUFLLE9BQU87Z0JBQ1YsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFELElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekQsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNO1lBQ1IsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLEtBQUs7Z0JBQ1IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztnQkFFakMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDckMsOERBQThEO29CQUM5RCxtRkFBbUY7b0JBQ25GLHNGQUFzRjtvQkFDdEYsMEZBQTBGO29CQUMxRixzQ0FBc0M7b0JBQ3RDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztpQkFDeEI7Z0JBQ0QsT0FBTztZQUNULEtBQUssTUFBTTtnQkFDVCw4RUFBOEU7Z0JBQzlFLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3RELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7b0JBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDL0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxxQ0FBcUM7aUJBQy9EO2dCQUNELE9BQU87WUFDVDtnQkFDRSxzRkFBc0Y7Z0JBQ3RGLE9BQU87U0FDVjtRQUVELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztRQUVELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLDhEQUE4RDtRQUM5RCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELGdGQUFnRjtJQUNoRix3QkFBd0IsQ0FBQyxLQUFvQjtRQUMzQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO1lBQ3RELElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUNsRSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2FBQ2pGO1lBRUQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsS0FBSztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbkQsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ2pGLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2xGLGlCQUFpQixFQUFFLENBQUM7UUFFN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUN0RixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLGdCQUFnQjtZQUNqQixDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7Z0JBQzVELElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQztRQUU1RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsZ0JBQWdCLENBQUMsV0FBcUI7UUFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCx5RkFBeUY7SUFDekYsZUFBZSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQWtEO1FBQ25GLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QiwyREFBMkQ7WUFDM0Qsa0RBQWtEO1lBQ2xELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzNDLE1BQU0sWUFBWSxHQUNkLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRS9ELHFGQUFxRjtZQUNyRixxRkFBcUY7WUFDckYsa0ZBQWtGO1lBQ2xGLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ3hCLGFBQWE7UUFDbkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRSx3RkFBd0Y7UUFDeEYsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxPQUFPLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBRUQsNERBQTREO0lBQ3BELGdCQUFnQjtRQUN0QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDMUUsSUFBSSxJQUFJLElBQUksYUFBYSxFQUFFO2dCQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckIsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNWO1lBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDMUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFL0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLENBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQy9FLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQy9FO0lBQ0gsQ0FBQztJQUVELGdDQUFnQztJQUN4QixpQkFBaUIsQ0FBQyxJQUFPO1FBQy9CLE9BQU8sQ0FBQyxDQUFDLElBQUk7WUFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHNCQUFzQixDQUFDLElBQWM7UUFDM0MsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzdDLENBQUM7SUFFRCwrRkFBK0Y7SUFDdkYsb0JBQW9CLENBQUMsRUFBWSxFQUFFLEVBQVk7UUFDckQsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUM1RSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCwrREFBK0Q7SUFDdkQsb0JBQW9CLENBQUMsSUFBYztRQUN6QyxJQUFJLElBQUksRUFBRTtZQUNSLHNGQUFzRjtZQUN0Rix5RkFBeUY7WUFDekYsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzdDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0VBQWdFO0lBQ3hELE1BQU07UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDO0lBQ2hELENBQUM7SUFFRCxxREFBcUQ7SUFDN0MsVUFBVSxDQUFDLGFBQXNDO1FBQ3ZELElBQUksYUFBYSxZQUFZLFNBQVMsRUFBRTtZQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELDZEQUE2RDtJQUNyRCxVQUFVLENBQUMsSUFBTztRQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7O2lIQXJaVSxZQUFZLG1EQW9IUyxnQkFBZ0Isc0hBRzVCLGlDQUFpQztxR0F2SDFDLFlBQVkseWJBNkVaLGVBQWUsaUdDbko1QixtOENBK0JBO21HRHVDYSxZQUFZO2tCQVB4QixTQUFTOytCQUNFLGdCQUFnQixZQUVoQixjQUFjLGlCQUNULGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OzBCQXNIbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxnQkFBZ0I7OzBCQUNuQyxRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLGlDQUFpQzs7MEJBQUcsUUFBUTs0Q0E3RzVELFVBQVU7c0JBRGIsS0FBSztnQkFpQkYsUUFBUTtzQkFEWCxLQUFLO2dCQWVGLE9BQU87c0JBRFYsS0FBSztnQkFTRixPQUFPO3NCQURWLEtBQUs7Z0JBUUcsVUFBVTtzQkFBbEIsS0FBSztnQkFHRyxTQUFTO3NCQUFqQixLQUFLO2dCQUdHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBR0csYUFBYTtzQkFBckIsS0FBSztnQkFHYSxjQUFjO3NCQUFoQyxNQUFNO2dCQUdZLGNBQWM7c0JBQWhDLE1BQU07Z0JBSVksZ0JBQWdCO3NCQUFsQyxNQUFNO2dCQUdxQixnQkFBZ0I7c0JBQTNDLFNBQVM7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBIT01FLFxuICBMRUZUX0FSUk9XLFxuICBQQUdFX0RPV04sXG4gIFBBR0VfVVAsXG4gIFJJR0hUX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgU1BBQ0UsXG4gIEVTQ0FQRSxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld0NoaWxkLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9uQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyLCBNQVRfREFURV9GT1JNQVRTLCBNYXREYXRlRm9ybWF0c30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBNYXRDYWxlbmRhckJvZHksXG4gIE1hdENhbGVuZGFyQ2VsbCxcbiAgTWF0Q2FsZW5kYXJVc2VyRXZlbnQsXG4gIE1hdENhbGVuZGFyQ2VsbENsYXNzRnVuY3Rpb24sXG59IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0RhdGVSYW5nZX0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5pbXBvcnQge1xuICBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneSxcbiAgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZLFxufSBmcm9tICcuL2RhdGUtcmFuZ2Utc2VsZWN0aW9uLXN0cmF0ZWd5JztcblxuXG5jb25zdCBEQVlTX1BFUl9XRUVLID0gNztcblxuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgYSBzaW5nbGUgbW9udGggaW4gdGhlIGRhdGVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1tb250aC12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICdtb250aC12aWV3Lmh0bWwnLFxuICBleHBvcnRBczogJ21hdE1vbnRoVmlldycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1vbnRoVmlldzxEPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcmVyZW5kZXJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIEZsYWcgdXNlZCB0byBmaWx0ZXIgb3V0IHNwYWNlL2VudGVyIGtleXVwIGV2ZW50cyB0aGF0IG9yaWdpbmF0ZWQgb3V0c2lkZSBvZiB0aGUgdmlldy4gKi9cbiAgcHJpdmF0ZSBfc2VsZWN0aW9uS2V5UHJlc3NlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIG1vbnRoIHZpZXcgKGV2ZXJ5dGhpbmcgb3RoZXIgdGhhbiB0aGUgbW9udGggYW5kIHllYXIgaXMgaWdub3JlZCkuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHsgcmV0dXJuIHRoaXMuX2FjdGl2ZURhdGU7IH1cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgICBjb25zdCB2YWxpZERhdGUgPVxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSlcbiAgICAgICkgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIudG9kYXkoKTtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY2xhbXBEYXRlKHZhbGlkRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuICAgIGlmICghdGhpcy5faGFzU2FtZU1vbnRoQW5kWWVhcihvbGRBY3RpdmVEYXRlLCB0aGlzLl9hY3RpdmVEYXRlKSkge1xuICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZVJhbmdlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHRoaXMuX3NldFJhbmdlcyh0aGlzLl9zZWxlY3RlZCk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW5EYXRlKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21pbkRhdGU7IH1cbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21pbkRhdGU6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXhEYXRlKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21heERhdGU7IH1cbiAgc2V0IG1heERhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21heERhdGU6IEQgfCBudWxsO1xuXG4gIC8qKiBGdW5jdGlvbiB1c2VkIHRvIGZpbHRlciB3aGljaCBkYXRlcyBhcmUgc2VsZWN0YWJsZS4gKi9cbiAgQElucHV0KCkgZGF0ZUZpbHRlcjogKGRhdGU6IEQpID0+IGJvb2xlYW47XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIGN1c3RvbSBDU1MgY2xhc3NlcyB0byBkYXRlcy4gKi9cbiAgQElucHV0KCkgZGF0ZUNsYXNzOiBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9uPEQ+O1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uRW5kOiBEIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiBhIG5ldyBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEIHwgbnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQgfCBudWxsPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX3VzZXJTZWxlY3Rpb246IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIGFjdGl2YXRlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFjdGl2ZURhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogVGhlIGJvZHkgb2YgY2FsZW5kYXIgdGFibGUgKi9cbiAgQFZpZXdDaGlsZChNYXRDYWxlbmRhckJvZHkpIF9tYXRDYWxlbmRhckJvZHk6IE1hdENhbGVuZGFyQm9keTtcblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGlzIG1vbnRoIChlLmcuIFwiSmFudWFyeSAyMDE3XCIpLiAqL1xuICBfbW9udGhMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBHcmlkIG9mIGNhbGVuZGFyIGNlbGxzIHJlcHJlc2VudGluZyB0aGUgZGF0ZXMgb2YgdGhlIG1vbnRoLiAqL1xuICBfd2Vla3M6IE1hdENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgYmxhbmsgY2VsbHMgaW4gdGhlIGZpcnN0IHJvdyBiZWZvcmUgdGhlIDFzdCBvZiB0aGUgbW9udGguICovXG4gIF9maXJzdFdlZWtPZmZzZXQ6IG51bWJlcjtcblxuICAvKiogU3RhcnQgdmFsdWUgb2YgdGhlIGN1cnJlbnRseS1zaG93biBkYXRlIHJhbmdlLiAqL1xuICBfcmFuZ2VTdGFydDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogRW5kIHZhbHVlIG9mIHRoZSBjdXJyZW50bHktc2hvd24gZGF0ZSByYW5nZS4gKi9cbiAgX3JhbmdlRW5kOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTdGFydCB2YWx1ZSBvZiB0aGUgY3VycmVudGx5LXNob3duIGNvbXBhcmlzb24gZGF0ZSByYW5nZS4gKi9cbiAgX2NvbXBhcmlzb25SYW5nZVN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBFbmQgdmFsdWUgb2YgdGhlIGN1cnJlbnRseS1zaG93biBjb21wYXJpc29uIGRhdGUgcmFuZ2UuICovXG4gIF9jb21wYXJpc29uUmFuZ2VFbmQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfcHJldmlld1N0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIF9wcmV2aWV3RW5kOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBzZWxlY3RpbmcgYSByYW5nZSBvZiBkYXRlcy4gKi9cbiAgX2lzUmFuZ2U6IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBkYXRlIG9mIHRoZSBtb250aCB0aGF0IHRvZGF5IGZhbGxzIG9uLiBOdWxsIGlmIHRvZGF5IGlzIGluIGFub3RoZXIgbW9udGguICovXG4gIF90b2RheURhdGU6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFRoZSBuYW1lcyBvZiB0aGUgd2Vla2RheXMuICovXG4gIF93ZWVrZGF5czoge2xvbmc6IHN0cmluZywgbmFycm93OiBzdHJpbmd9W107XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBwcml2YXRlIF9kYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI/OiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1kpIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgICBwcml2YXRlIF9yYW5nZVN0cmF0ZWd5PzogTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4pIHtcblxuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XG4gICAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURV9GT1JNQVRTJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSB0aGlzLl9kYXRlQWRhcHRlci5sb2NhbGVDaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgobnVsbCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2luaXQoKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgY29tcGFyaXNvbkNoYW5nZSA9IGNoYW5nZXNbJ2NvbXBhcmlzb25TdGFydCddIHx8IGNoYW5nZXNbJ2NvbXBhcmlzb25FbmQnXTtcblxuICAgIGlmIChjb21wYXJpc29uQ2hhbmdlICYmICFjb21wYXJpc29uQ2hhbmdlLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLl9zZXRSYW5nZXModGhpcy5zZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHdoZW4gYSBuZXcgZGF0ZSBpcyBzZWxlY3RlZC4gKi9cbiAgX2RhdGVTZWxlY3RlZChldmVudDogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8bnVtYmVyPikge1xuICAgIGNvbnN0IGRhdGUgPSBldmVudC52YWx1ZTtcbiAgICBjb25zdCBzZWxlY3RlZFllYXIgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgY29uc3Qgc2VsZWN0ZWREYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShzZWxlY3RlZFllYXIsIHNlbGVjdGVkTW9udGgsIGRhdGUpO1xuICAgIGxldCByYW5nZVN0YXJ0RGF0ZTogbnVtYmVyIHwgbnVsbDtcbiAgICBsZXQgcmFuZ2VFbmREYXRlOiBudW1iZXIgfCBudWxsO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkIGluc3RhbmNlb2YgRGF0ZVJhbmdlKSB7XG4gICAgICByYW5nZVN0YXJ0RGF0ZSA9IHRoaXMuX2dldERhdGVJbkN1cnJlbnRNb250aCh0aGlzLl9zZWxlY3RlZC5zdGFydCk7XG4gICAgICByYW5nZUVuZERhdGUgPSB0aGlzLl9nZXREYXRlSW5DdXJyZW50TW9udGgodGhpcy5fc2VsZWN0ZWQuZW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFuZ2VTdGFydERhdGUgPSByYW5nZUVuZERhdGUgPSB0aGlzLl9nZXREYXRlSW5DdXJyZW50TW9udGgodGhpcy5fc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgIGlmIChyYW5nZVN0YXJ0RGF0ZSAhPT0gZGF0ZSB8fCByYW5nZUVuZERhdGUgIT09IGRhdGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChzZWxlY3RlZERhdGUpO1xuICAgIH1cblxuICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCh7dmFsdWU6IHNlbGVjdGVkRGF0ZSwgZXZlbnQ6IGV2ZW50LmV2ZW50fSk7XG4gICAgdGhpcy5fcHJldmlld1N0YXJ0ID0gdGhpcy5fcHJldmlld0VuZCA9IG51bGw7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIG1vbnRoIHZpZXcuICovXG4gIF9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgLy8gVE9ETyhtbWFsZXJiYSk6IFdlIGN1cnJlbnRseSBhbGxvdyBrZXlib2FyZCBuYXZpZ2F0aW9uIHRvIGRpc2FibGVkIGRhdGVzLCBidXQganVzdCBwcmV2ZW50XG4gICAgLy8gZGlzYWJsZWQgb25lcyBmcm9tIGJlaW5nIHNlbGVjdGVkLiBUaGlzIG1heSBub3QgYmUgaWRlYWwsIHdlIHNob3VsZCBsb29rIGludG8gd2hldGhlclxuICAgIC8vIG5hdmlnYXRpb24gc2hvdWxkIHNraXAgb3ZlciBkaXNhYmxlZCBkYXRlcywgYW5kIGlmIHNvLCBob3cgdG8gaW1wbGVtZW50IHRoYXQgZWZmaWNpZW50bHkuXG5cbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgICBjb25zdCBpc1J0bCA9IHRoaXMuX2lzUnRsKCk7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHRoaXMuX2FjdGl2ZURhdGUsIGlzUnRsID8gMSA6IC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCAtNyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgNyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAgIDEgLSB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKHRoaXMuX2FjdGl2ZURhdGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgICAodGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgodGhpcy5fYWN0aXZlRGF0ZSkgLVxuICAgICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKHRoaXMuX2FjdGl2ZURhdGUpKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSBldmVudC5hbHRLZXkgP1xuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAtMSkgOlxuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5fYWN0aXZlRGF0ZSwgLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSBldmVudC5hbHRLZXkgP1xuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAxKSA6XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uS2V5UHJlc3NlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX2NhblNlbGVjdCh0aGlzLl9hY3RpdmVEYXRlKSkge1xuICAgICAgICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHdlIG9ubHkgcHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gaGVyZSB3aGlsZSB0aGUgc2VsZWN0aW9uIGhhcHBlbnMgaW5cbiAgICAgICAgICAvLyBga2V5dXBgIGJlbG93LiBXZSBjYW4ndCBkbyB0aGUgc2VsZWN0aW9uIGhlcmUsIGJlY2F1c2UgaXQgY2FuIGNhdXNlIHRoZSBjYWxlbmRhciB0b1xuICAgICAgICAgIC8vIHJlb3BlbiBpZiBmb2N1cyBpcyByZXN0b3JlZCBpbW1lZGlhdGVseS4gV2UgYWxzbyBjYW4ndCBjYWxsIGBwcmV2ZW50RGVmYXVsdGAgb24gYGtleXVwYFxuICAgICAgICAgIC8vIGJlY2F1c2UgaXQncyB0b28gbGF0ZSAoc2VlICMyMzMwNSkuXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgLy8gQWJvcnQgdGhlIGN1cnJlbnQgcmFuZ2Ugc2VsZWN0aW9uIGlmIHRoZSB1c2VyIHByZXNzZXMgZXNjYXBlIG1pZC1zZWxlY3Rpb24uXG4gICAgICAgIGlmICh0aGlzLl9wcmV2aWV3RW5kICE9IG51bGwgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIHRoaXMuX3ByZXZpZXdTdGFydCA9IHRoaXMuX3ByZXZpZXdFbmQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChudWxsKTtcbiAgICAgICAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoe3ZhbHVlOiBudWxsLCBldmVudH0pO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIFByZXZlbnRzIHRoZSBvdmVybGF5IGZyb20gY2xvc2luZy5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEb24ndCBwcmV2ZW50IGRlZmF1bHQgb3IgZm9jdXMgYWN0aXZlIGNlbGwgb24ga2V5cyB0aGF0IHdlIGRvbid0IGV4cGxpY2l0bHkgaGFuZGxlLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKG9sZEFjdGl2ZURhdGUsIHRoaXMuYWN0aXZlRGF0ZSkpIHtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZUNoYW5nZS5lbWl0KHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsKCk7XG4gICAgLy8gUHJldmVudCB1bmV4cGVjdGVkIGRlZmF1bHQgYWN0aW9ucyBzdWNoIGFzIGZvcm0gc3VibWlzc2lvbi5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5dXAgZXZlbnRzIG9uIHRoZSBjYWxlbmRhciBib2R5IHdoZW4gY2FsZW5kYXIgaXMgaW4gbW9udGggdmlldy4gKi9cbiAgX2hhbmRsZUNhbGVuZGFyQm9keUtleXVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IFNQQUNFIHx8IGV2ZW50LmtleUNvZGUgPT09IEVOVEVSKSB7XG4gICAgICBpZiAodGhpcy5fc2VsZWN0aW9uS2V5UHJlc3NlZCAmJiB0aGlzLl9jYW5TZWxlY3QodGhpcy5fYWN0aXZlRGF0ZSkpIHtcbiAgICAgICAgdGhpcy5fZGF0ZVNlbGVjdGVkKHt2YWx1ZTogdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF0ZSh0aGlzLl9hY3RpdmVEYXRlKSwgZXZlbnR9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2VsZWN0aW9uS2V5UHJlc3NlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG1vbnRoIHZpZXcuICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuX3NldFJhbmdlcyh0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLl90b2RheURhdGUgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCkpO1xuICAgIHRoaXMuX21vbnRoTGFiZWwgPSB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5Lm1vbnRoTGFiZWxcbiAgICAgICAgPyB0aGlzLl9kYXRlQWRhcHRlci5mb3JtYXQodGhpcy5hY3RpdmVEYXRlLCB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5Lm1vbnRoTGFiZWwpXG4gICAgICAgIDogdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGhOYW1lcygnc2hvcnQnKVt0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpXVxuICAgICAgICAgICAgLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG5cbiAgICBsZXQgZmlyc3RPZk1vbnRoID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZSh0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksIDEpO1xuICAgIHRoaXMuX2ZpcnN0V2Vla09mZnNldCA9XG4gICAgICAgIChEQVlTX1BFUl9XRUVLICsgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF5T2ZXZWVrKGZpcnN0T2ZNb250aCkgLVxuICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0Rmlyc3REYXlPZldlZWsoKSkgJSBEQVlTX1BFUl9XRUVLO1xuXG4gICAgdGhpcy5faW5pdFdlZWtkYXlzKCk7XG4gICAgdGhpcy5fY3JlYXRlV2Vla0NlbGxzKCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldz86IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9tYXRDYWxlbmRhckJvZHkuX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldyk7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGFjdGl2YXRlZCBhIG5ldyBjZWxsIGFuZCB0aGUgcHJldmlldyBuZWVkcyB0byBiZSB1cGRhdGVkLiAqL1xuICBfcHJldmlld0NoYW5nZWQoe2V2ZW50LCB2YWx1ZTogY2VsbH06IE1hdENhbGVuZGFyVXNlckV2ZW50PE1hdENhbGVuZGFyQ2VsbDxEPiB8IG51bGw+KSB7XG4gICAgaWYgKHRoaXMuX3JhbmdlU3RyYXRlZ3kpIHtcbiAgICAgIC8vIFdlIGNhbiBhc3N1bWUgdGhhdCB0aGlzIHdpbGwgYmUgYSByYW5nZSwgYmVjYXVzZSBwcmV2aWV3XG4gICAgICAvLyBldmVudHMgYXJlbid0IGZpcmVkIGZvciBzaW5nbGUgZGF0ZSBzZWxlY3Rpb25zLlxuICAgICAgY29uc3QgdmFsdWUgPSBjZWxsID8gY2VsbC5yYXdWYWx1ZSEgOiBudWxsO1xuICAgICAgY29uc3QgcHJldmlld1JhbmdlID1cbiAgICAgICAgICB0aGlzLl9yYW5nZVN0cmF0ZWd5LmNyZWF0ZVByZXZpZXcodmFsdWUsIHRoaXMuc2VsZWN0ZWQgYXMgRGF0ZVJhbmdlPEQ+LCBldmVudCk7XG4gICAgICB0aGlzLl9wcmV2aWV3U3RhcnQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHByZXZpZXdSYW5nZS5zdGFydCk7XG4gICAgICB0aGlzLl9wcmV2aWV3RW5kID0gdGhpcy5fZ2V0Q2VsbENvbXBhcmVWYWx1ZShwcmV2aWV3UmFuZ2UuZW5kKTtcblxuICAgICAgLy8gTm90ZSB0aGF0IGhlcmUgd2UgbmVlZCB0byB1c2UgYGRldGVjdENoYW5nZXNgLCByYXRoZXIgdGhhbiBgbWFya0ZvckNoZWNrYCwgYmVjYXVzZVxuICAgICAgLy8gdGhlIHdheSBgX2ZvY3VzQWN0aXZlQ2VsbGAgaXMgc2V0IHVwIGF0IHRoZSBtb21lbnQgbWFrZXMgaXQgZmlyZSBhdCB0aGUgd3JvbmcgdGltZVxuICAgICAgLy8gd2hlbiBuYXZpZ2F0aW5nIG9uZSBtb250aCBiYWNrIHVzaW5nIHRoZSBrZXlib2FyZCB3aGljaCB3aWxsIGNhdXNlIHRoaXMgaGFuZGxlclxuICAgICAgLy8gdG8gdGhyb3cgYSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9yIHdoZW4gdXBkYXRpbmcgdGhlIHByZXZpZXcgc3RhdGUuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoZSB3ZWVrZGF5cy4gKi9cbiAgcHJpdmF0ZSBfaW5pdFdlZWtkYXlzKCkge1xuICAgIGNvbnN0IGZpcnN0RGF5T2ZXZWVrID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0Rmlyc3REYXlPZldlZWsoKTtcbiAgICBjb25zdCBuYXJyb3dXZWVrZGF5cyA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldERheU9mV2Vla05hbWVzKCduYXJyb3cnKTtcbiAgICBjb25zdCBsb25nV2Vla2RheXMgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXlPZldlZWtOYW1lcygnbG9uZycpO1xuXG4gICAgLy8gUm90YXRlIHRoZSBsYWJlbHMgZm9yIGRheXMgb2YgdGhlIHdlZWsgYmFzZWQgb24gdGhlIGNvbmZpZ3VyZWQgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgIGxldCB3ZWVrZGF5cyA9IGxvbmdXZWVrZGF5cy5tYXAoKGxvbmcsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIHtsb25nLCBuYXJyb3c6IG5hcnJvd1dlZWtkYXlzW2ldfTtcbiAgICB9KTtcbiAgICB0aGlzLl93ZWVrZGF5cyA9IHdlZWtkYXlzLnNsaWNlKGZpcnN0RGF5T2ZXZWVrKS5jb25jYXQod2Vla2RheXMuc2xpY2UoMCwgZmlyc3REYXlPZldlZWspKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIE1hdENhbGVuZGFyQ2VsbHMgZm9yIHRoZSBkYXRlcyBpbiB0aGlzIG1vbnRoLiAqL1xuICBwcml2YXRlIF9jcmVhdGVXZWVrQ2VsbHMoKSB7XG4gICAgY29uc3QgZGF5c0luTW9udGggPSB0aGlzLl9kYXRlQWRhcHRlci5nZXROdW1EYXlzSW5Nb250aCh0aGlzLmFjdGl2ZURhdGUpO1xuICAgIGNvbnN0IGRhdGVOYW1lcyA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGVOYW1lcygpO1xuICAgIHRoaXMuX3dlZWtzID0gW1tdXTtcbiAgICBmb3IgKGxldCBpID0gMCwgY2VsbCA9IHRoaXMuX2ZpcnN0V2Vla09mZnNldDsgaSA8IGRheXNJbk1vbnRoOyBpKyssIGNlbGwrKykge1xuICAgICAgaWYgKGNlbGwgPT0gREFZU19QRVJfV0VFSykge1xuICAgICAgICB0aGlzLl93ZWVrcy5wdXNoKFtdKTtcbiAgICAgICAgY2VsbCA9IDA7XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksIGkgKyAxKTtcbiAgICAgIGNvbnN0IGVuYWJsZWQgPSB0aGlzLl9zaG91bGRFbmFibGVEYXRlKGRhdGUpO1xuICAgICAgY29uc3QgYXJpYUxhYmVsID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZm9ybWF0KGRhdGUsIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkuZGF0ZUExMXlMYWJlbCk7XG4gICAgICBjb25zdCBjZWxsQ2xhc3NlcyA9IHRoaXMuZGF0ZUNsYXNzID8gdGhpcy5kYXRlQ2xhc3MoZGF0ZSwgJ21vbnRoJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMuX3dlZWtzW3RoaXMuX3dlZWtzLmxlbmd0aCAtIDFdLnB1c2gobmV3IE1hdENhbGVuZGFyQ2VsbDxEPihpICsgMSwgZGF0ZU5hbWVzW2ldLFxuICAgICAgICAgIGFyaWFMYWJlbCwgZW5hYmxlZCwgY2VsbENsYXNzZXMsIHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoZGF0ZSkhLCBkYXRlKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERhdGUgZmlsdGVyIGZvciB0aGUgbW9udGggKi9cbiAgcHJpdmF0ZSBfc2hvdWxkRW5hYmxlRGF0ZShkYXRlOiBEKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhZGF0ZSAmJlxuICAgICAgICAoIXRoaXMubWluRGF0ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShkYXRlLCB0aGlzLm1pbkRhdGUpID49IDApICYmXG4gICAgICAgICghdGhpcy5tYXhEYXRlIHx8IHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGRhdGUsIHRoaXMubWF4RGF0ZSkgPD0gMCkgJiZcbiAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRlIGluIHRoaXMgbW9udGggdGhhdCB0aGUgZ2l2ZW4gRGF0ZSBmYWxscyBvbi5cbiAgICogUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBEYXRlIGlzIGluIGFub3RoZXIgbW9udGguXG4gICAqL1xuICBwcml2YXRlIF9nZXREYXRlSW5DdXJyZW50TW9udGgoZGF0ZTogRCB8IG51bGwpOiBudW1iZXIgfCBudWxsIHtcbiAgICByZXR1cm4gZGF0ZSAmJiB0aGlzLl9oYXNTYW1lTW9udGhBbmRZZWFyKGRhdGUsIHRoaXMuYWN0aXZlRGF0ZSkgP1xuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKGRhdGUpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgMiBkYXRlcyBhcmUgbm9uLW51bGwgYW5kIGZhbGwgd2l0aGluIHRoZSBzYW1lIG1vbnRoIG9mIHRoZSBzYW1lIHllYXIuICovXG4gIHByaXZhdGUgX2hhc1NhbWVNb250aEFuZFllYXIoZDE6IEQgfCBudWxsLCBkMjogRCB8IG51bGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEoZDEgJiYgZDIgJiYgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZDEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKGQyKSAmJlxuICAgICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGQxKSA9PSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGQyKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIHVzZWQgdG8gb25lIGNlbGwgdG8gYW5vdGhlci4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2VsbENvbXBhcmVWYWx1ZShkYXRlOiBEIHwgbnVsbCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmIChkYXRlKSB7XG4gICAgICAvLyBXZSB1c2UgdGhlIHRpbWUgc2luY2UgdGhlIFVuaXggZXBvY2ggdG8gY29tcGFyZSBkYXRlcyBpbiB0aGlzIHZpZXcsIHJhdGhlciB0aGFuIHRoZVxuICAgICAgLy8gY2VsbCB2YWx1ZXMsIGJlY2F1c2Ugd2UgbmVlZCB0byBzdXBwb3J0IHJhbmdlcyB0aGF0IHNwYW4gYWNyb3NzIG11bHRpcGxlIG1vbnRocy95ZWFycy5cbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUpO1xuICAgICAgY29uc3QgbW9udGggPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aChkYXRlKTtcbiAgICAgIGNvbnN0IGRheSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGUoZGF0ZSk7XG4gICAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIGRheSkuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgdXNlciBoYXMgdGhlIFJUTCBsYXlvdXQgZGlyZWN0aW9uLiAqL1xuICBwcml2YXRlIF9pc1J0bCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCc7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCByYW5nZSBiYXNlZCBvbiBhIG1vZGVsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9zZXRSYW5nZXMoc2VsZWN0ZWRWYWx1ZTogRGF0ZVJhbmdlPEQ+IHwgRCB8IG51bGwpIHtcbiAgICBpZiAoc2VsZWN0ZWRWYWx1ZSBpbnN0YW5jZW9mIERhdGVSYW5nZSkge1xuICAgICAgdGhpcy5fcmFuZ2VTdGFydCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoc2VsZWN0ZWRWYWx1ZS5zdGFydCk7XG4gICAgICB0aGlzLl9yYW5nZUVuZCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoc2VsZWN0ZWRWYWx1ZS5lbmQpO1xuICAgICAgdGhpcy5faXNSYW5nZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JhbmdlU3RhcnQgPSB0aGlzLl9yYW5nZUVuZCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICB0aGlzLl9pc1JhbmdlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fY29tcGFyaXNvblJhbmdlU3RhcnQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuY29tcGFyaXNvblN0YXJ0KTtcbiAgICB0aGlzLl9jb21wYXJpc29uUmFuZ2VFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuY29tcGFyaXNvbkVuZCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgZGF0ZSBjYW4gYmUgc2VsZWN0ZWQgaW4gdGhlIG1vbnRoIHZpZXcuICovXG4gIHByaXZhdGUgX2NhblNlbGVjdChkYXRlOiBEKSB7XG4gICAgcmV0dXJuICF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUpO1xuICB9XG59XG4iLCI8dGFibGUgY2xhc3M9XCJtYXQtY2FsZW5kYXItdGFibGVcIiByb2xlPVwiZ3JpZFwiPlxuICA8dGhlYWQgY2xhc3M9XCJtYXQtY2FsZW5kYXItdGFibGUtaGVhZGVyXCI+XG4gICAgPHRyPlxuICAgICAgPCEtLSBGb3IgdGhlIGRheS1vZi10aGUtd2VlayBjb2x1bW4gaGVhZGVyLCB3ZSB1c2UgYW4gYDxhYmJyPmAgZWxlbWVudCBiZWNhdXNlIFZvaWNlT3ZlclxuICAgICAgICAgICBpZ25vcmVzIHRoZSBgYXJpYS1sYWJlbGAuIENocm9tZVZveCwgaG93ZXZlciwgZG9lcyBub3QgcmVhZCB0aGUgZnVsbCBuYW1lXG4gICAgICAgICAgIGZvciB0aGUgYDxhYmJyPmAsIHNvIHdlIHN0aWxsIHNldCBgYXJpYS1sYWJlbGAgb24gdGhlIGhlYWRlciBlbGVtZW50LiAtLT5cbiAgICAgIDx0aCBzY29wZT1cImNvbFwiICpuZ0Zvcj1cImxldCBkYXkgb2YgX3dlZWtkYXlzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJkYXkubG9uZ1wiPlxuICAgICAgICA8YWJiciBjbGFzcz1cIm1hdC1jYWxlbmRhci1hYmJyXCIgW2F0dHIudGl0bGVdPVwiZGF5LmxvbmdcIj57e2RheS5uYXJyb3d9fTwvYWJicj5cbiAgICAgIDwvdGg+XG4gICAgPC90cj5cbiAgICA8dHI+PHRoIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzPVwibWF0LWNhbGVuZGFyLXRhYmxlLWhlYWRlci1kaXZpZGVyXCIgY29sc3Bhbj1cIjdcIj48L3RoPjwvdHI+XG4gIDwvdGhlYWQ+XG4gIDx0Ym9keSBtYXQtY2FsZW5kYXItYm9keVxuICAgICAgICAgW2xhYmVsXT1cIl9tb250aExhYmVsXCJcbiAgICAgICAgIFtyb3dzXT1cIl93ZWVrc1wiXG4gICAgICAgICBbdG9kYXlWYWx1ZV09XCJfdG9kYXlEYXRlIVwiXG4gICAgICAgICBbc3RhcnRWYWx1ZV09XCJfcmFuZ2VTdGFydCFcIlxuICAgICAgICAgW2VuZFZhbHVlXT1cIl9yYW5nZUVuZCFcIlxuICAgICAgICAgW2NvbXBhcmlzb25TdGFydF09XCJfY29tcGFyaXNvblJhbmdlU3RhcnRcIlxuICAgICAgICAgW2NvbXBhcmlzb25FbmRdPVwiX2NvbXBhcmlzb25SYW5nZUVuZFwiXG4gICAgICAgICBbcHJldmlld1N0YXJ0XT1cIl9wcmV2aWV3U3RhcnRcIlxuICAgICAgICAgW3ByZXZpZXdFbmRdPVwiX3ByZXZpZXdFbmRcIlxuICAgICAgICAgW2lzUmFuZ2VdPVwiX2lzUmFuZ2VcIlxuICAgICAgICAgW2xhYmVsTWluUmVxdWlyZWRDZWxsc109XCIzXCJcbiAgICAgICAgIFthY3RpdmVDZWxsXT1cIl9kYXRlQWRhcHRlci5nZXREYXRlKGFjdGl2ZURhdGUpIC0gMVwiXG4gICAgICAgICAoc2VsZWN0ZWRWYWx1ZUNoYW5nZSk9XCJfZGF0ZVNlbGVjdGVkKCRldmVudClcIlxuICAgICAgICAgKHByZXZpZXdDaGFuZ2UpPVwiX3ByZXZpZXdDaGFuZ2VkKCRldmVudClcIlxuICAgICAgICAgKGtleXVwKT1cIl9oYW5kbGVDYWxlbmRhckJvZHlLZXl1cCgkZXZlbnQpXCJcbiAgICAgICAgIChrZXlkb3duKT1cIl9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duKCRldmVudClcIj5cbiAgPC90Ym9keT5cbjwvdGFibGU+XG4iXX0=