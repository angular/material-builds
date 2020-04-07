/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subject } from 'rxjs';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatMonthView } from './month-view';
import { getActiveOffset, isSameMultiYearView, MatMultiYearView, yearsPerPage } from './multi-year-view';
import { MatYearView } from './year-view';
/** Default header for MatCalendar */
var MatCalendarHeader = /** @class */ (function () {
    function MatCalendarHeader(_intl, calendar, _dateAdapter, _dateFormats, changeDetectorRef) {
        this._intl = _intl;
        this.calendar = calendar;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this.calendar.stateChanges.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MatCalendarHeader.prototype, "periodButtonText", {
        /** The label for the current calendar view. */
        get: function () {
            if (this.calendar.currentView == 'month') {
                return this._dateAdapter
                    .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase();
            }
            if (this.calendar.currentView == 'year') {
                return this._dateAdapter.getYearName(this.calendar.activeDate);
            }
            // The offset from the active year to the "slot" for the starting year is the
            // *actual* first rendered year in the multi-year view, and the last year is
            // just yearsPerPage - 1 away.
            var activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
            var minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
            var maxYearOfPage = minYearOfPage + yearsPerPage - 1;
            var minYearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(minYearOfPage, 0, 1));
            var maxYearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(maxYearOfPage, 0, 1));
            return this._intl.formatYearRange(minYearName, maxYearName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendarHeader.prototype, "periodButtonLabel", {
        get: function () {
            return this.calendar.currentView == 'month' ?
                this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendarHeader.prototype, "prevButtonLabel", {
        /** The label for the previous button. */
        get: function () {
            return {
                'month': this._intl.prevMonthLabel,
                'year': this._intl.prevYearLabel,
                'multi-year': this._intl.prevMultiYearLabel
            }[this.calendar.currentView];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendarHeader.prototype, "nextButtonLabel", {
        /** The label for the next button. */
        get: function () {
            return {
                'month': this._intl.nextMonthLabel,
                'year': this._intl.nextYearLabel,
                'multi-year': this._intl.nextMultiYearLabel
            }[this.calendar.currentView];
        },
        enumerable: true,
        configurable: true
    });
    /** Handles user clicks on the period label. */
    MatCalendarHeader.prototype.currentPeriodClicked = function () {
        this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
    };
    /** Handles user clicks on the previous button. */
    MatCalendarHeader.prototype.previousClicked = function () {
        this.calendar.activeDate = this.calendar.currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
            this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage);
    };
    /** Handles user clicks on the next button. */
    MatCalendarHeader.prototype.nextClicked = function () {
        this.calendar.activeDate = this.calendar.currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
            this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? 1 : yearsPerPage);
    };
    /** Whether the previous period button is enabled. */
    MatCalendarHeader.prototype.previousEnabled = function () {
        if (!this.calendar.minDate) {
            return true;
        }
        return !this.calendar.minDate ||
            !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
    };
    /** Whether the next period button is enabled. */
    MatCalendarHeader.prototype.nextEnabled = function () {
        return !this.calendar.maxDate ||
            !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
    };
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    MatCalendarHeader.prototype._isSameView = function (date1, date2) {
        if (this.calendar.currentView == 'month') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
        }
        if (this.calendar.currentView == 'year') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
        }
        // Otherwise we are in 'multi-year' view.
        return isSameMultiYearView(this._dateAdapter, date1, date2, this.calendar.minDate, this.calendar.maxDate);
    };
    MatCalendarHeader.decorators = [
        { type: Component, args: [{
                    selector: 'mat-calendar-header',
                    template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <button mat-button type=\"button\" class=\"mat-calendar-period-button\"\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\n            cdkAriaLive=\"polite\">\n      {{periodButtonText}}\n      <div class=\"mat-calendar-arrow\"\n           [class.mat-calendar-invert]=\"calendar.currentView != 'month'\"></div>\n    </button>\n\n    <div class=\"mat-calendar-spacer\"></div>\n\n    <ng-content></ng-content>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-previous-button\"\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\n            [attr.aria-label]=\"prevButtonLabel\">\n    </button>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-next-button\"\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\n            [attr.aria-label]=\"nextButtonLabel\">\n    </button>\n  </div>\n</div>\n",
                    exportAs: 'matCalendarHeader',
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    MatCalendarHeader.ctorParameters = function () { return [
        { type: MatDatepickerIntl },
        { type: MatCalendar, decorators: [{ type: Inject, args: [forwardRef(function () { return MatCalendar; }),] }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: ChangeDetectorRef }
    ]; };
    return MatCalendarHeader;
}());
export { MatCalendarHeader };
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
var MatCalendar = /** @class */ (function () {
    function MatCalendar(_intl, _dateAdapter, _dateFormats, _changeDetectorRef) {
        var _this = this;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Used for scheduling that focus should be moved to the active cell on the next tick.
         * We need to schedule it, rather than do it immediately, because we have to wait
         * for Angular to re-evaluate the view children.
         */
        this._moveFocusOnNextTick = false;
        /** Whether the calendar should be started in month or year view. */
        this.startView = 'month';
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /**
         * Emits the year chosen in multiyear view.
         * This doesn't imply a change on the selected date.
         */
        this.yearSelected = new EventEmitter();
        /**
         * Emits the month chosen in year view.
         * This doesn't imply a change on the selected date.
         */
        this.monthSelected = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /**
         * Emits whenever there is a state change that the header may need to respond to.
         */
        this.stateChanges = new Subject();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(function () {
            _changeDetectorRef.markForCheck();
            _this.stateChanges.next();
        });
    }
    Object.defineProperty(MatCalendar.prototype, "startAt", {
        /** A date representing the period (month or year) to start the calendar in. */
        get: function () { return this._startAt; },
        set: function (value) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "selected", {
        /** The currently selected date. */
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "minDate", {
        /** The minimum selectable date. */
        get: function () { return this._minDate; },
        set: function (value) {
            this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "maxDate", {
        /** The maximum selectable date. */
        get: function () { return this._maxDate; },
        set: function (value) {
            this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "activeDate", {
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         */
        get: function () { return this._clampedActiveDate; },
        set: function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
            this.stateChanges.next();
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "currentView", {
        /** Whether the calendar is in month view. */
        get: function () { return this._currentView; },
        set: function (value) {
            this._currentView = value;
            this._moveFocusOnNextTick = true;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    MatCalendar.prototype.ngAfterContentInit = function () {
        this._calendarHeaderPortal = new ComponentPortal(this.headerComponent || MatCalendarHeader);
        this.activeDate = this.startAt || this._dateAdapter.today();
        // Assign to the private property since we don't want to move focus on init.
        this._currentView = this.startView;
    };
    MatCalendar.prototype.ngAfterViewChecked = function () {
        if (this._moveFocusOnNextTick) {
            this._moveFocusOnNextTick = false;
            this.focusActiveCell();
        }
    };
    MatCalendar.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
        this.stateChanges.complete();
    };
    MatCalendar.prototype.ngOnChanges = function (changes) {
        var change = changes['minDate'] || changes['maxDate'] || changes['dateFilter'];
        if (change && !change.firstChange) {
            var view = this._getCurrentViewComponent();
            if (view) {
                // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
                // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
                this._changeDetectorRef.detectChanges();
                view._init();
            }
        }
        this.stateChanges.next();
    };
    MatCalendar.prototype.focusActiveCell = function () {
        this._getCurrentViewComponent()._focusActiveCell();
    };
    /** Updates today's date after an update of the active date */
    MatCalendar.prototype.updateTodaysDate = function () {
        var currentView = this.currentView;
        var view;
        if (currentView === 'month') {
            view = this.monthView;
        }
        else if (currentView === 'year') {
            view = this.yearView;
        }
        else {
            view = this.multiYearView;
        }
        view._init();
    };
    /** Handles date selection in the month view. */
    MatCalendar.prototype._dateSelected = function (date) {
        if (date && !this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    };
    /** Handles year selection in the multiyear view. */
    MatCalendar.prototype._yearSelectedInMultiYearView = function (normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    };
    /** Handles month selection in the year view. */
    MatCalendar.prototype._monthSelectedInYearView = function (normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    };
    MatCalendar.prototype._userSelected = function () {
        this._userSelection.emit();
    };
    /** Handles year/month selection in the multi-year/year views. */
    MatCalendar.prototype._goToDateInView = function (date, view) {
        this.activeDate = date;
        this.currentView = view;
    };
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    MatCalendar.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    /** Returns the component instance that corresponds to the current calendar view. */
    MatCalendar.prototype._getCurrentViewComponent = function () {
        return this.monthView || this.yearView || this.multiYearView;
    };
    MatCalendar.decorators = [
        { type: Component, args: [{
                    selector: 'mat-calendar',
                    template: "\n<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n\n<div class=\"mat-calendar-content\" [ngSwitch]=\"currentView\" cdkMonitorSubtreeFocus tabindex=\"-1\">\n  <mat-month-view\n      *ngSwitchCase=\"'month'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      (selectedChange)=\"_dateSelected($event)\"\n      (_userSelection)=\"_userSelected()\">\n  </mat-month-view>\n\n  <mat-year-view\n      *ngSwitchCase=\"'year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      (monthSelected)=\"_monthSelectedInYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'month')\">\n  </mat-year-view>\n\n  <mat-multi-year-view\n      *ngSwitchCase=\"'multi-year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'year')\">\n  </mat-multi-year-view>\n</div>\n",
                    host: {
                        'class': 'mat-calendar',
                    },
                    exportAs: 'matCalendar',
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:none}.mat-calendar-controls{display:flex;margin:5% calc(33% / 7 - 16px)}.mat-calendar-controls .mat-icon-button:hover .mat-button-focus-overlay{opacity:.04}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-previous-button,.mat-calendar-next-button{position:relative}.mat-calendar-previous-button::after,.mat-calendar-next-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:\"\";margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-previous-button,[dir=rtl] .mat-calendar-next-button{transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:\"\";position:absolute;top:0;left:-8px;right:-8px;height:1px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatCalendar.ctorParameters = function () { return [
        { type: MatDatepickerIntl },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: ChangeDetectorRef }
    ]; };
    MatCalendar.propDecorators = {
        headerComponent: [{ type: Input }],
        startAt: [{ type: Input }],
        startView: [{ type: Input }],
        selected: [{ type: Input }],
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        dateFilter: [{ type: Input }],
        dateClass: [{ type: Input }],
        selectedChange: [{ type: Output }],
        yearSelected: [{ type: Output }],
        monthSelected: [{ type: Output }],
        _userSelection: [{ type: Output }],
        monthView: [{ type: ViewChild, args: [MatMonthView,] }],
        yearView: [{ type: ViewChild, args: [MatYearView,] }],
        multiYearView: [{ type: ViewChild, args: [MatMultiYearView,] }]
    };
    return MatCalendar;
}());
export { MatCalendar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUF3QixNQUFNLHFCQUFxQixDQUFDO0FBQzNFLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sd0JBQXdCLENBQUM7QUFDckYsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUUzQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFDTCxlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQixZQUFZLEVBQ2IsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBUXhDLHFDQUFxQztBQUNyQztJQVFFLDJCQUFvQixLQUF3QixFQUNjLFFBQXdCLEVBQ2xELFlBQTRCLEVBQ0YsWUFBNEIsRUFDMUUsaUJBQW9DO1FBSjVCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ2MsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFDbEQsaUJBQVksR0FBWixZQUFZLENBQWdCO1FBQ0YsaUJBQVksR0FBWixZQUFZLENBQWdC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LGtCQUFDO0NBQUEsQUE3T0QsSUE2T0M7U0FsT1ksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0ZPUk1BVFMsIE1hdERhdGVGb3JtYXRzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3Nlc30gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7Y3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3J9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuaW1wb3J0IHtNYXRNb250aFZpZXd9IGZyb20gJy4vbW9udGgtdmlldyc7XG5pbXBvcnQge1xuICBnZXRBY3RpdmVPZmZzZXQsXG4gIGlzU2FtZU11bHRpWWVhclZpZXcsXG4gIE1hdE11bHRpWWVhclZpZXcsXG4gIHllYXJzUGVyUGFnZVxufSBmcm9tICcuL211bHRpLXllYXItdmlldyc7XG5pbXBvcnQge01hdFllYXJWaWV3fSBmcm9tICcuL3llYXItdmlldyc7XG5cbi8qKlxuICogUG9zc2libGUgdmlld3MgZm9yIHRoZSBjYWxlbmRhci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgTWF0Q2FsZW5kYXJWaWV3ID0gJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJztcblxuLyoqIERlZmF1bHQgaGVhZGVyIGZvciBNYXRDYWxlbmRhciAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhbGVuZGFyLWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnY2FsZW5kYXItaGVhZGVyLmh0bWwnLFxuICBleHBvcnRBczogJ21hdENhbGVuZGFySGVhZGVyJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFySGVhZGVyPEQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaW50bDogTWF0RGF0ZXBpY2tlckludGwsXG4gICAgICAgICAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRDYWxlbmRhcikpIHB1YmxpYyBjYWxlbmRhcjogTWF0Q2FsZW5kYXI8RD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBwcml2YXRlIF9kYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuXG4gICAgdGhpcy5jYWxlbmRhci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSBjdXJyZW50IGNhbGVuZGFyIHZpZXcuICovXG4gIGdldCBwZXJpb2RCdXR0b25UZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyXG4gICAgICAgICAgLmZvcm1hdCh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkubW9udGhZZWFyTGFiZWwpXG4gICAgICAgICAgICAgIC50b0xvY2FsZVVwcGVyQ2FzZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAneWVhcicpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUpO1xuICAgIH1cblxuICAgIC8vIFRoZSBvZmZzZXQgZnJvbSB0aGUgYWN0aXZlIHllYXIgdG8gdGhlIFwic2xvdFwiIGZvciB0aGUgc3RhcnRpbmcgeWVhciBpcyB0aGVcbiAgICAvLyAqYWN0dWFsKiBmaXJzdCByZW5kZXJlZCB5ZWFyIGluIHRoZSBtdWx0aS15ZWFyIHZpZXcsIGFuZCB0aGUgbGFzdCB5ZWFyIGlzXG4gICAgLy8ganVzdCB5ZWFyc1BlclBhZ2UgLSAxIGF3YXkuXG4gICAgY29uc3QgYWN0aXZlWWVhciA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlKTtcbiAgICBjb25zdCBtaW5ZZWFyT2ZQYWdlID0gYWN0aXZlWWVhciAtIGdldEFjdGl2ZU9mZnNldChcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLCB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIHRoaXMuY2FsZW5kYXIubWluRGF0ZSwgdGhpcy5jYWxlbmRhci5tYXhEYXRlKTtcbiAgICBjb25zdCBtYXhZZWFyT2ZQYWdlID0gbWluWWVhck9mUGFnZSArIHllYXJzUGVyUGFnZSAtIDE7XG4gICAgY29uc3QgbWluWWVhck5hbWUgPVxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShtaW5ZZWFyT2ZQYWdlLCAwLCAxKSk7XG4gICAgY29uc3QgbWF4WWVhck5hbWUgPVxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShtYXhZZWFyT2ZQYWdlLCAwLCAxKSk7XG4gICAgcmV0dXJuIHRoaXMuX2ludGwuZm9ybWF0WWVhclJhbmdlKG1pblllYXJOYW1lLCBtYXhZZWFyTmFtZSk7XG4gIH1cblxuICBnZXQgcGVyaW9kQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnID9cbiAgICAgICAgdGhpcy5faW50bC5zd2l0Y2hUb011bHRpWWVhclZpZXdMYWJlbCA6IHRoaXMuX2ludGwuc3dpdGNoVG9Nb250aFZpZXdMYWJlbDtcbiAgfVxuXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSBwcmV2aW91cyBidXR0b24uICovXG4gIGdldCBwcmV2QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ21vbnRoJzogdGhpcy5faW50bC5wcmV2TW9udGhMYWJlbCxcbiAgICAgICd5ZWFyJzogdGhpcy5faW50bC5wcmV2WWVhckxhYmVsLFxuICAgICAgJ211bHRpLXllYXInOiB0aGlzLl9pbnRsLnByZXZNdWx0aVllYXJMYWJlbFxuICAgIH1bdGhpcy5jYWxlbmRhci5jdXJyZW50Vmlld107XG4gIH1cblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgbmV4dCBidXR0b24uICovXG4gIGdldCBuZXh0QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ21vbnRoJzogdGhpcy5faW50bC5uZXh0TW9udGhMYWJlbCxcbiAgICAgICd5ZWFyJzogdGhpcy5faW50bC5uZXh0WWVhckxhYmVsLFxuICAgICAgJ211bHRpLXllYXInOiB0aGlzLl9pbnRsLm5leHRNdWx0aVllYXJMYWJlbFxuICAgIH1bdGhpcy5jYWxlbmRhci5jdXJyZW50Vmlld107XG4gIH1cblxuICAvKiogSGFuZGxlcyB1c2VyIGNsaWNrcyBvbiB0aGUgcGVyaW9kIGxhYmVsLiAqL1xuICBjdXJyZW50UGVyaW9kQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID0gdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnID8gJ211bHRpLXllYXInIDogJ21vbnRoJztcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBwcmV2aW91cyBidXR0b24uICovXG4gIHByZXZpb3VzQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUgPSB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcgP1xuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIC0xKSA6XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAneWVhcicgPyAtMSA6IC15ZWFyc1BlclBhZ2VcbiAgICAgICAgICAgICk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB1c2VyIGNsaWNrcyBvbiB0aGUgbmV4dCBidXR0b24uICovXG4gIG5leHRDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSA9IHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJyA/XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgMSkgOlxuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyhcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ3llYXInID8gMSA6IHllYXJzUGVyUGFnZVxuICAgICAgICAgICAgKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwcmV2aW91cyBwZXJpb2QgYnV0dG9uIGlzIGVuYWJsZWQuICovXG4gIHByZXZpb3VzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY2FsZW5kYXIubWluRGF0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiAhdGhpcy5jYWxlbmRhci5taW5EYXRlIHx8XG4gICAgICAgICF0aGlzLl9pc1NhbWVWaWV3KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5jYWxlbmRhci5taW5EYXRlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBuZXh0IHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC4gKi9cbiAgbmV4dEVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmNhbGVuZGFyLm1heERhdGUgfHxcbiAgICAgICAgIXRoaXMuX2lzU2FtZVZpZXcodGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCB0aGlzLmNhbGVuZGFyLm1heERhdGUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHR3byBkYXRlcyByZXByZXNlbnQgdGhlIHNhbWUgdmlldyBpbiB0aGUgY3VycmVudCB2aWV3IG1vZGUgKG1vbnRoIG9yIHllYXIpLiAqL1xuICBwcml2YXRlIF9pc1NhbWVWaWV3KGRhdGUxOiBELCBkYXRlMjogRCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUxKSA9PSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUyKSAmJlxuICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKGRhdGUxKSA9PSB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aChkYXRlMik7XG4gICAgfVxuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTIpO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2Ugd2UgYXJlIGluICdtdWx0aS15ZWFyJyB2aWV3LlxuICAgIHJldHVybiBpc1NhbWVNdWx0aVllYXJWaWV3KFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIsIGRhdGUxLCBkYXRlMiwgdGhpcy5jYWxlbmRhci5taW5EYXRlLCB0aGlzLmNhbGVuZGFyLm1heERhdGUpO1xuICB9XG59XG5cbi8qKlxuICogQSBjYWxlbmRhciB0aGF0IGlzIHVzZWQgYXMgcGFydCBvZiB0aGUgZGF0ZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhbGVuZGFyJyxcbiAgdGVtcGxhdGVVcmw6ICdjYWxlbmRhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2NhbGVuZGFyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYWxlbmRhcicsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0Q2FsZW5kYXInLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXI8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIC8qKiBBbiBpbnB1dCBpbmRpY2F0aW5nIHRoZSB0eXBlIG9mIHRoZSBoZWFkZXIgY29tcG9uZW50LCBpZiBzZXQuICovXG4gIEBJbnB1dCgpIGhlYWRlckNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxhbnk+O1xuXG4gIC8qKiBBIHBvcnRhbCBjb250YWluaW5nIHRoZSBoZWFkZXIgY29tcG9uZW50IHR5cGUgZm9yIHRoaXMgY2FsZW5kYXIuICovXG4gIF9jYWxlbmRhckhlYWRlclBvcnRhbDogUG9ydGFsPGFueT47XG5cbiAgcHJpdmF0ZSBfaW50bENoYW5nZXM6IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogVXNlZCBmb3Igc2NoZWR1bGluZyB0aGF0IGZvY3VzIHNob3VsZCBiZSBtb3ZlZCB0byB0aGUgYWN0aXZlIGNlbGwgb24gdGhlIG5leHQgdGljay5cbiAgICogV2UgbmVlZCB0byBzY2hlZHVsZSBpdCwgcmF0aGVyIHRoYW4gZG8gaXQgaW1tZWRpYXRlbHksIGJlY2F1c2Ugd2UgaGF2ZSB0byB3YWl0XG4gICAqIGZvciBBbmd1bGFyIHRvIHJlLWV2YWx1YXRlIHRoZSB2aWV3IGNoaWxkcmVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfbW92ZUZvY3VzT25OZXh0VGljayA9IGZhbHNlO1xuXG4gIC8qKiBBIGRhdGUgcmVwcmVzZW50aW5nIHRoZSBwZXJpb2QgKG1vbnRoIG9yIHllYXIpIHRvIHN0YXJ0IHRoZSBjYWxlbmRhciBpbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fc3RhcnRBdDsgfVxuICBzZXQgc3RhcnRBdCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9zdGFydEF0ID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RhcnRBdDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIHNob3VsZCBiZSBzdGFydGVkIGluIG1vbnRoIG9yIHllYXIgdmlldy4gKi9cbiAgQElucHV0KCkgc3RhcnRWaWV3OiBNYXRDYWxlbmRhclZpZXcgPSAnbW9udGgnO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9zZWxlY3RlZDogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbkRhdGUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluRGF0ZTsgfVxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluRGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWF4RGF0ZTsgfVxuICBzZXQgbWF4RGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXhEYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIEZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xuICBASW5wdXQoKSBkYXRlRmlsdGVyOiAoZGF0ZTogRCkgPT4gYm9vbGVhbjtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgY3VzdG9tIENTUyBjbGFzc2VzIHRvIGRhdGVzLiAqL1xuICBASW5wdXQoKSBkYXRlQ2xhc3M6IChkYXRlOiBEKSA9PiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIHllYXIgY2hvc2VuIGluIG11bHRpeWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgeWVhclNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBtb250aCBjaG9zZW4gaW4geWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbW9udGhTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX3VzZXJTZWxlY3Rpb246IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IG1vbnRoIHZpZXcgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdE1vbnRoVmlldykgbW9udGhWaWV3OiBNYXRNb250aFZpZXc8RD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCB5ZWFyIHZpZXcgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdFllYXJWaWV3KSB5ZWFyVmlldzogTWF0WWVhclZpZXc8RD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBtdWx0aS15ZWFyIHZpZXcgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdE11bHRpWWVhclZpZXcpIG11bHRpWWVhclZpZXc6IE1hdE11bHRpWWVhclZpZXc8RD47XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IGFjdGl2ZSBkYXRlLiBUaGlzIGRldGVybWluZXMgd2hpY2ggdGltZSBwZXJpb2QgaXMgc2hvd24gYW5kIHdoaWNoIGRhdGUgaXNcbiAgICogaGlnaGxpZ2h0ZWQgd2hlbiB1c2luZyBrZXlib2FyZCBuYXZpZ2F0aW9uLlxuICAgKi9cbiAgZ2V0IGFjdGl2ZURhdGUoKTogRCB7IHJldHVybiB0aGlzLl9jbGFtcGVkQWN0aXZlRGF0ZTsgfVxuICBzZXQgYWN0aXZlRGF0ZSh2YWx1ZTogRCkge1xuICAgIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY2xhbXBEYXRlKHZhbHVlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2NsYW1wZWRBY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBpcyBpbiBtb250aCB2aWV3LiAqL1xuICBnZXQgY3VycmVudFZpZXcoKTogTWF0Q2FsZW5kYXJWaWV3IHsgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3OyB9XG4gIHNldCBjdXJyZW50Vmlldyh2YWx1ZTogTWF0Q2FsZW5kYXJWaWV3KSB7XG4gICAgdGhpcy5fY3VycmVudFZpZXcgPSB2YWx1ZTtcbiAgICB0aGlzLl9tb3ZlRm9jdXNPbk5leHRUaWNrID0gdHJ1ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9jdXJyZW50VmlldzogTWF0Q2FsZW5kYXJWaWV3O1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuZXZlciB0aGVyZSBpcyBhIHN0YXRlIGNoYW5nZSB0aGF0IHRoZSBoZWFkZXIgbWF5IG5lZWQgdG8gcmVzcG9uZCB0by5cbiAgICovXG4gIHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoX2ludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgdGhpcy5faW50bENoYW5nZXMgPSBfaW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBfY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY2FsZW5kYXJIZWFkZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKHRoaXMuaGVhZGVyQ29tcG9uZW50IHx8IE1hdENhbGVuZGFySGVhZGVyKTtcbiAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLnN0YXJ0QXQgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIudG9kYXkoKTtcblxuICAgIC8vIEFzc2lnbiB0byB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBzaW5jZSB3ZSBkb24ndCB3YW50IHRvIG1vdmUgZm9jdXMgb24gaW5pdC5cbiAgICB0aGlzLl9jdXJyZW50VmlldyA9IHRoaXMuc3RhcnRWaWV3O1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLl9tb3ZlRm9jdXNPbk5leHRUaWNrKSB7XG4gICAgICB0aGlzLl9tb3ZlRm9jdXNPbk5leHRUaWNrID0gZmFsc2U7XG4gICAgICB0aGlzLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjaGFuZ2UgPVxuICAgICAgICBjaGFuZ2VzWydtaW5EYXRlJ10gfHwgY2hhbmdlc1snbWF4RGF0ZSddIHx8IGNoYW5nZXNbJ2RhdGVGaWx0ZXInXTtcblxuICAgIGlmIChjaGFuZ2UgJiYgIWNoYW5nZS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCk7XG5cbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gYGRldGVjdENoYW5nZXNgIG1hbnVhbGx5IGhlcmUsIGJlY2F1c2UgdGhlIGBtaW5EYXRlYCwgYG1heERhdGVgIGV0Yy4gYXJlXG4gICAgICAgIC8vIHBhc3NlZCBkb3duIHRvIHRoZSB2aWV3IHZpYSBkYXRhIGJpbmRpbmdzIHdoaWNoIHdvbid0IGJlIHVwLXRvLWRhdGUgd2hlbiB3ZSBjYWxsIGBfaW5pdGAuXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdmlldy5faW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIGZvY3VzQWN0aXZlQ2VsbCgpIHtcbiAgICB0aGlzLl9nZXRDdXJyZW50Vmlld0NvbXBvbmVudCgpLl9mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRvZGF5J3MgZGF0ZSBhZnRlciBhbiB1cGRhdGUgb2YgdGhlIGFjdGl2ZSBkYXRlICovXG4gIHVwZGF0ZVRvZGF5c0RhdGUoKSB7XG4gICAgY29uc3QgY3VycmVudFZpZXcgPSB0aGlzLmN1cnJlbnRWaWV3O1xuICAgIGxldCB2aWV3OiBNYXRNb250aFZpZXc8RD4gfCBNYXRZZWFyVmlldzxEPiB8IE1hdE11bHRpWWVhclZpZXc8RD47XG5cbiAgICBpZiAoY3VycmVudFZpZXcgPT09ICdtb250aCcpIHtcbiAgICAgIHZpZXcgPSB0aGlzLm1vbnRoVmlldztcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRWaWV3ID09PSAneWVhcicpIHtcbiAgICAgIHZpZXcgPSB0aGlzLnllYXJWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWV3ID0gdGhpcy5tdWx0aVllYXJWaWV3O1xuICAgIH1cblxuICAgIHZpZXcuX2luaXQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGRhdGUgc2VsZWN0aW9uIGluIHRoZSBtb250aCB2aWV3LiAqL1xuICBfZGF0ZVNlbGVjdGVkKGRhdGU6IEQgfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKGRhdGUgJiYgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKGRhdGUsIHRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoZGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgeWVhciBzZWxlY3Rpb24gaW4gdGhlIG11bHRpeWVhciB2aWV3LiAqL1xuICBfeWVhclNlbGVjdGVkSW5NdWx0aVllYXJWaWV3KG5vcm1hbGl6ZWRZZWFyOiBEKSB7XG4gICAgdGhpcy55ZWFyU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkWWVhcik7XG4gIH1cblxuICAvKiogSGFuZGxlcyBtb250aCBzZWxlY3Rpb24gaW4gdGhlIHllYXIgdmlldy4gKi9cbiAgX21vbnRoU2VsZWN0ZWRJblllYXJWaWV3KG5vcm1hbGl6ZWRNb250aDogRCkge1xuICAgIHRoaXMubW9udGhTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRNb250aCk7XG4gIH1cblxuICBfdXNlclNlbGVjdGVkKCk6IHZvaWQge1xuICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgeWVhci9tb250aCBzZWxlY3Rpb24gaW4gdGhlIG11bHRpLXllYXIveWVhciB2aWV3cy4gKi9cbiAgX2dvVG9EYXRlSW5WaWV3KGRhdGU6IEQsIHZpZXc6ICdtb250aCcgfCAneWVhcicgfCAnbXVsdGkteWVhcicpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZURhdGUgPSBkYXRlO1xuICAgIHRoaXMuY3VycmVudFZpZXcgPSB2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VmFsaWREYXRlT3JOdWxsKG9iajogYW55KTogRCB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5fZGF0ZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJiB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKG9iaikpID8gb2JqIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgY3VycmVudCBjYWxlbmRhciB2aWV3LiAqL1xuICBwcml2YXRlIF9nZXRDdXJyZW50Vmlld0NvbXBvbmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5tb250aFZpZXcgfHwgdGhpcy55ZWFyVmlldyB8fCB0aGlzLm11bHRpWWVhclZpZXc7XG4gIH1cbn1cbiJdfQ==