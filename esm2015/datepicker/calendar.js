/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatMonthView } from './month-view';
import { getActiveOffset, isSameMultiYearView, MatMultiYearView, yearsPerPage } from './multi-year-view';
import { MatYearView } from './year-view';
import { MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER, DateRange } from './date-selection-model';
/** Default header for MatCalendar */
let MatCalendarHeader = /** @class */ (() => {
    class MatCalendarHeader {
        constructor(_intl, calendar, _dateAdapter, _dateFormats, changeDetectorRef) {
            this._intl = _intl;
            this.calendar = calendar;
            this._dateAdapter = _dateAdapter;
            this._dateFormats = _dateFormats;
            this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
        }
        /** The label for the current calendar view. */
        get periodButtonText() {
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
            const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
            const minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
            const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
            const minYearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(minYearOfPage, 0, 1));
            const maxYearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(maxYearOfPage, 0, 1));
            return this._intl.formatYearRange(minYearName, maxYearName);
        }
        get periodButtonLabel() {
            return this.calendar.currentView == 'month' ?
                this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
        }
        /** The label for the previous button. */
        get prevButtonLabel() {
            return {
                'month': this._intl.prevMonthLabel,
                'year': this._intl.prevYearLabel,
                'multi-year': this._intl.prevMultiYearLabel
            }[this.calendar.currentView];
        }
        /** The label for the next button. */
        get nextButtonLabel() {
            return {
                'month': this._intl.nextMonthLabel,
                'year': this._intl.nextYearLabel,
                'multi-year': this._intl.nextMultiYearLabel
            }[this.calendar.currentView];
        }
        /** Handles user clicks on the period label. */
        currentPeriodClicked() {
            this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
        }
        /** Handles user clicks on the previous button. */
        previousClicked() {
            this.calendar.activeDate = this.calendar.currentView == 'month' ?
                this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
                this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage);
        }
        /** Handles user clicks on the next button. */
        nextClicked() {
            this.calendar.activeDate = this.calendar.currentView == 'month' ?
                this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
                this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? 1 : yearsPerPage);
        }
        /** Whether the previous period button is enabled. */
        previousEnabled() {
            if (!this.calendar.minDate) {
                return true;
            }
            return !this.calendar.minDate ||
                !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
        }
        /** Whether the next period button is enabled. */
        nextEnabled() {
            return !this.calendar.maxDate ||
                !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
        }
        /** Whether the two dates represent the same view in the current view mode (month or year). */
        _isSameView(date1, date2) {
            if (this.calendar.currentView == 'month') {
                return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                    this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
            }
            if (this.calendar.currentView == 'year') {
                return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
            }
            // Otherwise we are in 'multi-year' view.
            return isSameMultiYearView(this._dateAdapter, date1, date2, this.calendar.minDate, this.calendar.maxDate);
        }
    }
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
    MatCalendarHeader.ctorParameters = () => [
        { type: MatDatepickerIntl },
        { type: MatCalendar, decorators: [{ type: Inject, args: [forwardRef(() => MatCalendar),] }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: ChangeDetectorRef }
    ];
    return MatCalendarHeader;
})();
export { MatCalendarHeader };
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
let MatCalendar = /** @class */ (() => {
    class MatCalendar {
        constructor(_intl, _dateAdapter, _dateFormats, _changeDetectorRef) {
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
            /**
             * Emits when the currently selected date changes.
             * @breaking-change 11.0.0 Emitted value to change to `D | null`.
             */
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
            this._intlChanges = _intl.changes.subscribe(() => {
                _changeDetectorRef.markForCheck();
                this.stateChanges.next();
            });
        }
        /** A date representing the period (month or year) to start the calendar in. */
        get startAt() { return this._startAt; }
        set startAt(value) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
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
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         */
        get activeDate() { return this._clampedActiveDate; }
        set activeDate(value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
            this.stateChanges.next();
            this._changeDetectorRef.markForCheck();
        }
        /** Whether the calendar is in month view. */
        get currentView() { return this._currentView; }
        set currentView(value) {
            this._currentView = value;
            this._moveFocusOnNextTick = true;
            this._changeDetectorRef.markForCheck();
        }
        ngAfterContentInit() {
            this._calendarHeaderPortal = new ComponentPortal(this.headerComponent || MatCalendarHeader);
            this.activeDate = this.startAt || this._dateAdapter.today();
            // Assign to the private property since we don't want to move focus on init.
            this._currentView = this.startView;
        }
        ngAfterViewChecked() {
            if (this._moveFocusOnNextTick) {
                this._moveFocusOnNextTick = false;
                this.focusActiveCell();
            }
        }
        ngOnDestroy() {
            this._intlChanges.unsubscribe();
            this.stateChanges.complete();
        }
        ngOnChanges(changes) {
            const change = changes['minDate'] || changes['maxDate'] || changes['dateFilter'];
            if (change && !change.firstChange) {
                const view = this._getCurrentViewComponent();
                if (view) {
                    // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
                    // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
                    this._changeDetectorRef.detectChanges();
                    view._init();
                }
            }
            this.stateChanges.next();
        }
        focusActiveCell() {
            this._getCurrentViewComponent()._focusActiveCell(false);
        }
        /** Updates today's date after an update of the active date */
        updateTodaysDate() {
            const currentView = this.currentView;
            let view;
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
        }
        /** Handles date selection in the month view. */
        _dateSelected(event) {
            const date = event.value;
            if (this.selected instanceof DateRange ||
                (date && !this._dateAdapter.sameDate(date, this.selected))) {
                // @breaking-change 11.0.0 remove non-null assertion
                // once the `selectedChange` is allowed to be null.
                this.selectedChange.emit(date);
            }
            this._userSelection.emit(event);
        }
        /** Handles year selection in the multiyear view. */
        _yearSelectedInMultiYearView(normalizedYear) {
            this.yearSelected.emit(normalizedYear);
        }
        /** Handles month selection in the year view. */
        _monthSelectedInYearView(normalizedMonth) {
            this.monthSelected.emit(normalizedMonth);
        }
        /** Handles year/month selection in the multi-year/year views. */
        _goToDateInView(date, view) {
            this.activeDate = date;
            this.currentView = view;
        }
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        _getValidDateOrNull(obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        }
        /** Returns the component instance that corresponds to the current calendar view. */
        _getCurrentViewComponent() {
            return this.monthView || this.yearView || this.multiYearView;
        }
    }
    MatCalendar.decorators = [
        { type: Component, args: [{
                    selector: 'mat-calendar',
                    template: "<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n\n<div class=\"mat-calendar-content\" [ngSwitch]=\"currentView\" cdkMonitorSubtreeFocus tabindex=\"-1\">\n  <mat-month-view\n      *ngSwitchCase=\"'month'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      [comparisonStart]=\"comparisonStart\"\n      [comparisonEnd]=\"comparisonEnd\"\n      (_userSelection)=\"_dateSelected($event)\">\n  </mat-month-view>\n\n  <mat-year-view\n      *ngSwitchCase=\"'year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      (monthSelected)=\"_monthSelectedInYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'month')\">\n  </mat-year-view>\n\n  <mat-multi-year-view\n      *ngSwitchCase=\"'multi-year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'year')\">\n  </mat-multi-year-view>\n</div>\n",
                    host: {
                        'class': 'mat-calendar',
                    },
                    exportAs: 'matCalendar',
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER],
                    styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:none}.mat-calendar-controls{display:flex;margin:5% calc(33% / 7 - 16px)}.mat-calendar-controls .mat-icon-button:hover .mat-button-focus-overlay{opacity:.04}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-previous-button,.mat-calendar-next-button{position:relative}.mat-calendar-previous-button::after,.mat-calendar-next-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:\"\";margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-previous-button,[dir=rtl] .mat-calendar-next-button{transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:\"\";position:absolute;top:0;left:-8px;right:-8px;height:1px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatCalendar.ctorParameters = () => [
        { type: MatDatepickerIntl },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: ChangeDetectorRef }
    ];
    MatCalendar.propDecorators = {
        headerComponent: [{ type: Input }],
        startAt: [{ type: Input }],
        startView: [{ type: Input }],
        selected: [{ type: Input }],
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        dateFilter: [{ type: Input }],
        dateClass: [{ type: Input }],
        comparisonStart: [{ type: Input }],
        comparisonEnd: [{ type: Input }],
        selectedChange: [{ type: Output }],
        yearSelected: [{ type: Output }],
        monthSelected: [{ type: Output }],
        _userSelection: [{ type: Output }],
        monthView: [{ type: ViewChild, args: [MatMonthView,] }],
        yearView: [{ type: ViewChild, args: [MatYearView,] }],
        multiYearView: [{ type: ViewChild, args: [MatMultiYearView,] }]
    };
    return MatCalendar;
})();
export { MatCalendar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUF3QixNQUFNLHFCQUFxQixDQUFDO0FBQzNFLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEdBRWpCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUUzQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFDTCxlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQixZQUFZLEVBQ2IsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyx3Q0FBd0MsRUFBRSxTQUFTLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQVEzRixxQ0FBcUM7QUFDckM7SUFBQSxNQU9hLGlCQUFpQjtRQUM1QixZQUFvQixLQUF3QixFQUNjLFFBQXdCLEVBQ2xELFlBQTRCLEVBQ0YsWUFBNEIsRUFDMUUsaUJBQW9DO1lBSjVCLFVBQUssR0FBTCxLQUFLLENBQW1CO1lBQ2MsYUFBUSxHQUFSLFFBQVEs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Q0FNTCxNQUFNOytCQU1OLE1BQU07Z0NBTU4sTUFBTTtpQ0FHTixNQUFNOzRCQUlOLFNBQVMsU0FBQyxZQUFZOzJCQUd0QixTQUFTLFNBQUMsV0FBVztnQ0FHckIsU0FBUyxTQUFDLGdCQUFnQjs7SUFtSjdCLGtCQUFDO0tBQUE7U0FuUFksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIERhdGVBZGFwdGVyLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBNYXREYXRlRm9ybWF0cyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMsIE1hdENhbGVuZGFyVXNlckV2ZW50fSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnRsfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5pbXBvcnQge01hdE1vbnRoVmlld30gZnJvbSAnLi9tb250aC12aWV3JztcbmltcG9ydCB7XG4gIGdldEFjdGl2ZU9mZnNldCxcbiAgaXNTYW1lTXVsdGlZZWFyVmlldyxcbiAgTWF0TXVsdGlZZWFyVmlldyxcbiAgeWVhcnNQZXJQYWdlXG59IGZyb20gJy4vbXVsdGkteWVhci12aWV3JztcbmltcG9ydCB7TWF0WWVhclZpZXd9IGZyb20gJy4veWVhci12aWV3JztcbmltcG9ydCB7TUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9QUk9WSURFUiwgRGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqXG4gKiBQb3NzaWJsZSB2aWV3cyBmb3IgdGhlIGNhbGVuZGFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBNYXRDYWxlbmRhclZpZXcgPSAnbW9udGgnIHwgJ3llYXInIHwgJ211bHRpLXllYXInO1xuXG4vKiogRGVmYXVsdCBoZWFkZXIgZm9yIE1hdENhbGVuZGFyICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FsZW5kYXItaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdjYWxlbmRhci1oZWFkZXIuaHRtbCcsXG4gIGV4cG9ydEFzOiAnbWF0Q2FsZW5kYXJIZWFkZXInLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXJIZWFkZXI8RD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9pbnRsOiBNYXREYXRlcGlja2VySW50bCxcbiAgICAgICAgICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdENhbGVuZGFyKSkgcHVibGljIGNhbGVuZGFyOiBNYXRDYWxlbmRhcjxEPixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIHByaXZhdGUgX2RhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cyxcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG5cbiAgICB0aGlzLmNhbGVuZGFyLnN0YXRlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICB9XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIGN1cnJlbnQgY2FsZW5kYXIgdmlldy4gKi9cbiAgZ2V0IHBlcmlvZEJ1dHRvblRleHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGF0ZUFkYXB0ZXJcbiAgICAgICAgICAuZm9ybWF0KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5tb250aFllYXJMYWJlbClcbiAgICAgICAgICAgICAgLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG4gICAgLy8gVGhlIG9mZnNldCBmcm9tIHRoZSBhY3RpdmUgeWVhciB0byB0aGUgXCJzbG90XCIgZm9yIHRoZSBzdGFydGluZyB5ZWFyIGlzIHRoZVxuICAgIC8vICphY3R1YWwqIGZpcnN0IHJlbmRlcmVkIHllYXIgaW4gdGhlIG11bHRpLXllYXIgdmlldywgYW5kIHRoZSBsYXN0IHllYXIgaXNcbiAgICAvLyBqdXN0IHllYXJzUGVyUGFnZSAtIDEgYXdheS5cbiAgICBjb25zdCBhY3RpdmVZZWFyID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUpO1xuICAgIGNvbnN0IG1pblllYXJPZlBhZ2UgPSBhY3RpdmVZZWFyIC0gZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIsIHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5jYWxlbmRhci5taW5EYXRlLCB0aGlzLmNhbGVuZGFyLm1heERhdGUpO1xuICAgIGNvbnN0IG1heFllYXJPZlBhZ2UgPSBtaW5ZZWFyT2ZQYWdlICsgeWVhcnNQZXJQYWdlIC0gMTtcbiAgICBjb25zdCBtaW5ZZWFyTmFtZSA9XG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKG1pblllYXJPZlBhZ2UsIDAsIDEpKTtcbiAgICBjb25zdCBtYXhZZWFyTmFtZSA9XG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLl9kYXRlQWRhcHRlci5jcmVhdGVEYXRlKG1heFllYXJPZlBhZ2UsIDAsIDEpKTtcbiAgICByZXR1cm4gdGhpcy5faW50bC5mb3JtYXRZZWFyUmFuZ2UobWluWWVhck5hbWUsIG1heFllYXJOYW1lKTtcbiAgfVxuXG4gIGdldCBwZXJpb2RCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcgP1xuICAgICAgICB0aGlzLl9pbnRsLnN3aXRjaFRvTXVsdGlZZWFyVmlld0xhYmVsIDogdGhpcy5faW50bC5zd2l0Y2hUb01vbnRoVmlld0xhYmVsO1xuICB9XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIHByZXZpb3VzIGJ1dHRvbi4gKi9cbiAgZ2V0IHByZXZCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB7XG4gICAgICAnbW9udGgnOiB0aGlzLl9pbnRsLnByZXZNb250aExhYmVsLFxuICAgICAgJ3llYXInOiB0aGlzLl9pbnRsLnByZXZZZWFyTGFiZWwsXG4gICAgICAnbXVsdGkteWVhcic6IHRoaXMuX2ludGwucHJldk11bHRpWWVhckxhYmVsXG4gICAgfVt0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3XTtcbiAgfVxuXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSBuZXh0IGJ1dHRvbi4gKi9cbiAgZ2V0IG5leHRCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB7XG4gICAgICAnbW9udGgnOiB0aGlzLl9pbnRsLm5leHRNb250aExhYmVsLFxuICAgICAgJ3llYXInOiB0aGlzLl9pbnRsLm5leHRZZWFyTGFiZWwsXG4gICAgICAnbXVsdGkteWVhcic6IHRoaXMuX2ludGwubmV4dE11bHRpWWVhckxhYmVsXG4gICAgfVt0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3XTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBwZXJpb2QgbGFiZWwuICovXG4gIGN1cnJlbnRQZXJpb2RDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPSB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcgPyAnbXVsdGkteWVhcicgOiAnbW9udGgnO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXNlciBjbGlja3Mgb24gdGhlIHByZXZpb3VzIGJ1dHRvbi4gKi9cbiAgcHJldmlvdXNDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSA9IHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJyA/XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgLTEpIDpcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJyA/IC0xIDogLXllYXJzUGVyUGFnZVxuICAgICAgICAgICAgKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBuZXh0IGJ1dHRvbi4gKi9cbiAgbmV4dENsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlID0gdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnID9cbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCAxKSA6XG4gICAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAneWVhcicgPyAxIDogeWVhcnNQZXJQYWdlXG4gICAgICAgICAgICApO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHByZXZpb3VzIHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC4gKi9cbiAgcHJldmlvdXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5jYWxlbmRhci5taW5EYXRlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLmNhbGVuZGFyLm1pbkRhdGUgfHxcbiAgICAgICAgIXRoaXMuX2lzU2FtZVZpZXcodGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCB0aGlzLmNhbGVuZGFyLm1pbkRhdGUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG5leHQgcGVyaW9kIGJ1dHRvbiBpcyBlbmFibGVkLiAqL1xuICBuZXh0RW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuY2FsZW5kYXIubWF4RGF0ZSB8fFxuICAgICAgICAhdGhpcy5faXNTYW1lVmlldyh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIHRoaXMuY2FsZW5kYXIubWF4RGF0ZSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHdvIGRhdGVzIHJlcHJlc2VudCB0aGUgc2FtZSB2aWV3IGluIHRoZSBjdXJyZW50IHZpZXcgbW9kZSAobW9udGggb3IgeWVhcikuICovXG4gIHByaXZhdGUgX2lzU2FtZVZpZXcoZGF0ZTE6IEQsIGRhdGUyOiBEKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTIpICYmXG4gICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZGF0ZTEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKGRhdGUyKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ3llYXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMik7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSB3ZSBhcmUgaW4gJ211bHRpLXllYXInIHZpZXcuXG4gICAgcmV0dXJuIGlzU2FtZU11bHRpWWVhclZpZXcoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlciwgZGF0ZTEsIGRhdGUyLCB0aGlzLmNhbGVuZGFyLm1pbkRhdGUsIHRoaXMuY2FsZW5kYXIubWF4RGF0ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNhbGVuZGFyIHRoYXQgaXMgdXNlZCBhcyBwYXJ0IG9mIHRoZSBkYXRlcGlja2VyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhbGVuZGFyJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRDYWxlbmRhcicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhcjxEPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgLyoqIEFuIGlucHV0IGluZGljYXRpbmcgdGhlIHR5cGUgb2YgdGhlIGhlYWRlciBjb21wb25lbnQsIGlmIHNldC4gKi9cbiAgQElucHV0KCkgaGVhZGVyQ29tcG9uZW50OiBDb21wb25lbnRUeXBlPGFueT47XG5cbiAgLyoqIEEgcG9ydGFsIGNvbnRhaW5pbmcgdGhlIGhlYWRlciBjb21wb25lbnQgdHlwZSBmb3IgdGhpcyBjYWxlbmRhci4gKi9cbiAgX2NhbGVuZGFySGVhZGVyUG9ydGFsOiBQb3J0YWw8YW55PjtcblxuICBwcml2YXRlIF9pbnRsQ2hhbmdlczogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBVc2VkIGZvciBzY2hlZHVsaW5nIHRoYXQgZm9jdXMgc2hvdWxkIGJlIG1vdmVkIHRvIHRoZSBhY3RpdmUgY2VsbCBvbiB0aGUgbmV4dCB0aWNrLlxuICAgKiBXZSBuZWVkIHRvIHNjaGVkdWxlIGl0LCByYXRoZXIgdGhhbiBkbyBpdCBpbW1lZGlhdGVseSwgYmVjYXVzZSB3ZSBoYXZlIHRvIHdhaXRcbiAgICogZm9yIEFuZ3VsYXIgdG8gcmUtZXZhbHVhdGUgdGhlIHZpZXcgY2hpbGRyZW4uXG4gICAqL1xuICBwcml2YXRlIF9tb3ZlRm9jdXNPbk5leHRUaWNrID0gZmFsc2U7XG5cbiAgLyoqIEEgZGF0ZSByZXByZXNlbnRpbmcgdGhlIHBlcmlvZCAobW9udGggb3IgeWVhcikgdG8gc3RhcnQgdGhlIGNhbGVuZGFyIGluLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zdGFydEF0OyB9XG4gIHNldCBzdGFydEF0KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9zdGFydEF0OiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgc2hvdWxkIGJlIHN0YXJ0ZWQgaW4gbW9udGggb3IgeWVhciB2aWV3LiAqL1xuICBASW5wdXQoKSBzdGFydFZpZXc6IE1hdENhbGVuZGFyVmlldyA9ICdtb250aCc7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkOyB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogRGF0ZVJhbmdlPEQ+IHwgRCB8IG51bGwpIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlUmFuZ2UpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluRGF0ZSgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9taW5EYXRlOyB9XG4gIHNldCBtaW5EYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21pbkRhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9taW5EYXRlOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4RGF0ZSgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXhEYXRlOyB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9tYXhEYXRlOiBEIHwgbnVsbDtcblxuICAvKiogRnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogKGRhdGU6IEQpID0+IE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXM7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBFbWl0dGVkIHZhbHVlIHRvIGNoYW5nZSB0byBgRCB8IG51bGxgLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSB5ZWFyIGNob3NlbiBpbiBtdWx0aXllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHllYXJTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgbW9udGggY2hvc2VuIGluIHllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1vbnRoU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF91c2VyU2VsZWN0aW9uOiBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+PiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPj4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IG1vbnRoIHZpZXcgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdE1vbnRoVmlldykgbW9udGhWaWV3OiBNYXRNb250aFZpZXc8RD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCB5ZWFyIHZpZXcgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdFllYXJWaWV3KSB5ZWFyVmlldzogTWF0WWVhclZpZXc8RD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBtdWx0aS15ZWFyIHZpZXcgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdE11bHRpWWVhclZpZXcpIG11bHRpWWVhclZpZXc6IE1hdE11bHRpWWVhclZpZXc8RD47XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IGFjdGl2ZSBkYXRlLiBUaGlzIGRldGVybWluZXMgd2hpY2ggdGltZSBwZXJpb2QgaXMgc2hvd24gYW5kIHdoaWNoIGRhdGUgaXNcbiAgICogaGlnaGxpZ2h0ZWQgd2hlbiB1c2luZyBrZXlib2FyZCBuYXZpZ2F0aW9uLlxuICAgKi9cbiAgZ2V0IGFjdGl2ZURhdGUoKTogRCB7IHJldHVybiB0aGlzLl9jbGFtcGVkQWN0aXZlRGF0ZTsgfVxuICBzZXQgYWN0aXZlRGF0ZSh2YWx1ZTogRCkge1xuICAgIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY2xhbXBEYXRlKHZhbHVlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2NsYW1wZWRBY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBpcyBpbiBtb250aCB2aWV3LiAqL1xuICBnZXQgY3VycmVudFZpZXcoKTogTWF0Q2FsZW5kYXJWaWV3IHsgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3OyB9XG4gIHNldCBjdXJyZW50Vmlldyh2YWx1ZTogTWF0Q2FsZW5kYXJWaWV3KSB7XG4gICAgdGhpcy5fY3VycmVudFZpZXcgPSB2YWx1ZTtcbiAgICB0aGlzLl9tb3ZlRm9jdXNPbk5leHRUaWNrID0gdHJ1ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9jdXJyZW50VmlldzogTWF0Q2FsZW5kYXJWaWV3O1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuZXZlciB0aGVyZSBpcyBhIHN0YXRlIGNoYW5nZSB0aGF0IHRoZSBoZWFkZXIgbWF5IG5lZWQgdG8gcmVzcG9uZCB0by5cbiAgICovXG4gIHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoX2ludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgdGhpcy5faW50bENoYW5nZXMgPSBfaW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBfY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY2FsZW5kYXJIZWFkZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKHRoaXMuaGVhZGVyQ29tcG9uZW50IHx8IE1hdENhbGVuZGFySGVhZGVyKTtcbiAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLnN0YXJ0QXQgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIudG9kYXkoKTtcblxuICAgIC8vIEFzc2lnbiB0byB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBzaW5jZSB3ZSBkb24ndCB3YW50IHRvIG1vdmUgZm9jdXMgb24gaW5pdC5cbiAgICB0aGlzLl9jdXJyZW50VmlldyA9IHRoaXMuc3RhcnRWaWV3O1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLl9tb3ZlRm9jdXNPbk5leHRUaWNrKSB7XG4gICAgICB0aGlzLl9tb3ZlRm9jdXNPbk5leHRUaWNrID0gZmFsc2U7XG4gICAgICB0aGlzLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjaGFuZ2UgPVxuICAgICAgICBjaGFuZ2VzWydtaW5EYXRlJ10gfHwgY2hhbmdlc1snbWF4RGF0ZSddIHx8IGNoYW5nZXNbJ2RhdGVGaWx0ZXInXTtcblxuICAgIGlmIChjaGFuZ2UgJiYgIWNoYW5nZS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCk7XG5cbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gYGRldGVjdENoYW5nZXNgIG1hbnVhbGx5IGhlcmUsIGJlY2F1c2UgdGhlIGBtaW5EYXRlYCwgYG1heERhdGVgIGV0Yy4gYXJlXG4gICAgICAgIC8vIHBhc3NlZCBkb3duIHRvIHRoZSB2aWV3IHZpYSBkYXRhIGJpbmRpbmdzIHdoaWNoIHdvbid0IGJlIHVwLXRvLWRhdGUgd2hlbiB3ZSBjYWxsIGBfaW5pdGAuXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdmlldy5faW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIGZvY3VzQWN0aXZlQ2VsbCgpIHtcbiAgICB0aGlzLl9nZXRDdXJyZW50Vmlld0NvbXBvbmVudCgpLl9mb2N1c0FjdGl2ZUNlbGwoZmFsc2UpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdG9kYXkncyBkYXRlIGFmdGVyIGFuIHVwZGF0ZSBvZiB0aGUgYWN0aXZlIGRhdGUgKi9cbiAgdXBkYXRlVG9kYXlzRGF0ZSgpIHtcbiAgICBjb25zdCBjdXJyZW50VmlldyA9IHRoaXMuY3VycmVudFZpZXc7XG4gICAgbGV0IHZpZXc6IE1hdE1vbnRoVmlldzxEPiB8IE1hdFllYXJWaWV3PEQ+IHwgTWF0TXVsdGlZZWFyVmlldzxEPjtcblxuICAgIGlmIChjdXJyZW50VmlldyA9PT0gJ21vbnRoJykge1xuICAgICAgdmlldyA9IHRoaXMubW9udGhWaWV3O1xuICAgIH0gZWxzZSBpZiAoY3VycmVudFZpZXcgPT09ICd5ZWFyJykge1xuICAgICAgdmlldyA9IHRoaXMueWVhclZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcgPSB0aGlzLm11bHRpWWVhclZpZXc7XG4gICAgfVxuXG4gICAgdmlldy5faW5pdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgZGF0ZSBzZWxlY3Rpb24gaW4gdGhlIG1vbnRoIHZpZXcuICovXG4gIF9kYXRlU2VsZWN0ZWQoZXZlbnQ6IE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPik6IHZvaWQge1xuICAgIGNvbnN0IGRhdGUgPSBldmVudC52YWx1ZTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGVkIGluc3RhbmNlb2YgRGF0ZVJhbmdlIHx8XG4gICAgICAgIChkYXRlICYmICF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZShkYXRlLCB0aGlzLnNlbGVjdGVkKSkpIHtcbiAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIHJlbW92ZSBub24tbnVsbCBhc3NlcnRpb25cbiAgICAgIC8vIG9uY2UgdGhlIGBzZWxlY3RlZENoYW5nZWAgaXMgYWxsb3dlZCB0byBiZSBudWxsLlxuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KGRhdGUhKTtcbiAgICB9XG5cbiAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgeWVhciBzZWxlY3Rpb24gaW4gdGhlIG11bHRpeWVhciB2aWV3LiAqL1xuICBfeWVhclNlbGVjdGVkSW5NdWx0aVllYXJWaWV3KG5vcm1hbGl6ZWRZZWFyOiBEKSB7XG4gICAgdGhpcy55ZWFyU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkWWVhcik7XG4gIH1cblxuICAvKiogSGFuZGxlcyBtb250aCBzZWxlY3Rpb24gaW4gdGhlIHllYXIgdmlldy4gKi9cbiAgX21vbnRoU2VsZWN0ZWRJblllYXJWaWV3KG5vcm1hbGl6ZWRNb250aDogRCkge1xuICAgIHRoaXMubW9udGhTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRNb250aCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB5ZWFyL21vbnRoIHNlbGVjdGlvbiBpbiB0aGUgbXVsdGkteWVhci95ZWFyIHZpZXdzLiAqL1xuICBfZ29Ub0RhdGVJblZpZXcoZGF0ZTogRCwgdmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGU7XG4gICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXc7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBUaGUgZ2l2ZW4gb2JqZWN0IGlmIGl0IGlzIGJvdGggYSBkYXRlIGluc3RhbmNlIGFuZCB2YWxpZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBwcml2YXRlIF9nZXRWYWxpZERhdGVPck51bGwob2JqOiBhbnkpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9kYXRlQWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQob2JqKSkgPyBvYmogOiBudWxsO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGNvbXBvbmVudCBpbnN0YW5jZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBjdXJyZW50IGNhbGVuZGFyIHZpZXcuICovXG4gIHByaXZhdGUgX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCkge1xuICAgIHJldHVybiB0aGlzLm1vbnRoVmlldyB8fCB0aGlzLnllYXJWaWV3IHx8IHRoaXMubXVsdGlZZWFyVmlldztcbiAgfVxufVxuIl19