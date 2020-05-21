/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
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
    let MatCalendarHeader = class MatCalendarHeader {
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
    };
    MatCalendarHeader = __decorate([
        Component({
            selector: 'mat-calendar-header',
            template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <button mat-button type=\"button\" class=\"mat-calendar-period-button\"\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\n            cdkAriaLive=\"polite\">\n      {{periodButtonText}}\n      <div class=\"mat-calendar-arrow\"\n           [class.mat-calendar-invert]=\"calendar.currentView != 'month'\"></div>\n    </button>\n\n    <div class=\"mat-calendar-spacer\"></div>\n\n    <ng-content></ng-content>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-previous-button\"\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\n            [attr.aria-label]=\"prevButtonLabel\">\n    </button>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-next-button\"\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\n            [attr.aria-label]=\"nextButtonLabel\">\n    </button>\n  </div>\n</div>\n",
            exportAs: 'matCalendarHeader',
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __param(1, Inject(forwardRef(() => MatCalendar))),
        __param(2, Optional()),
        __param(3, Optional()), __param(3, Inject(MAT_DATE_FORMATS)),
        __metadata("design:paramtypes", [MatDatepickerIntl,
            MatCalendar,
            DateAdapter, Object, ChangeDetectorRef])
    ], MatCalendarHeader);
    return MatCalendarHeader;
})();
export { MatCalendarHeader };
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
let MatCalendar = /** @class */ (() => {
    let MatCalendar = class MatCalendar {
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatCalendar.prototype, "headerComponent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatCalendar.prototype, "startAt", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatCalendar.prototype, "startView", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatCalendar.prototype, "selected", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatCalendar.prototype, "minDate", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatCalendar.prototype, "maxDate", null);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], MatCalendar.prototype, "dateFilter", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], MatCalendar.prototype, "dateClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatCalendar.prototype, "comparisonStart", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatCalendar.prototype, "comparisonEnd", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatCalendar.prototype, "selectedChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatCalendar.prototype, "yearSelected", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatCalendar.prototype, "monthSelected", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatCalendar.prototype, "_userSelection", void 0);
    __decorate([
        ViewChild(MatMonthView),
        __metadata("design:type", MatMonthView)
    ], MatCalendar.prototype, "monthView", void 0);
    __decorate([
        ViewChild(MatYearView),
        __metadata("design:type", MatYearView)
    ], MatCalendar.prototype, "yearView", void 0);
    __decorate([
        ViewChild(MatMultiYearView),
        __metadata("design:type", MatMultiYearView)
    ], MatCalendar.prototype, "multiYearView", void 0);
    MatCalendar = __decorate([
        Component({
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
        }),
        __param(1, Optional()),
        __param(2, Optional()), __param(2, Inject(MAT_DATE_FORMATS)),
        __metadata("design:paramtypes", [MatDatepickerIntl,
            DateAdapter, Object, ChangeDetectorRef])
    ], MatCalendar);
    return MatCalendar;
})();
export { MatCalendar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBd0IsTUFBTSxxQkFBcUIsQ0FBQztBQUMzRSxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsV0FBVyxFQUNYLGdCQUFnQixHQUVqQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDL0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQ0wsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNiLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsd0NBQXdDLEVBQUUsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFRM0YscUNBQXFDO0FBUXJDO0lBQUEsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7UUFDNUIsWUFBb0IsS0FBd0IsRUFDYyxRQUF3QixFQUNsRCxZQUE0QixFQUNGLFlBQTRCLEVBQzFFLGlCQUFvQztZQUo1QixVQUFLLEdBQUwsS0FBSyxDQUFtQjtZ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QUFNLEVBQUU7a0NBQTBCLFlBQVk7dURBQTRCO0lBTWpFO1FBQVQsTUFBTSxFQUFFO2tDQUF3QixZQUFZO3FEQUE0QjtJQU0vRDtRQUFULE1BQU0sRUFBRTtrQ0FBeUIsWUFBWTtzREFBNEI7SUFHaEU7UUFBVCxNQUFNLEVBQUU7a0NBQTBCLFlBQVk7dURBQ1E7SUFHOUI7UUFBeEIsU0FBUyxDQUFDLFlBQVksQ0FBQztrQ0FBWSxZQUFZO2tEQUFJO0lBRzVCO1FBQXZCLFNBQVMsQ0FBQyxXQUFXLENBQUM7a0NBQVcsV0FBVztpREFBSTtJQUdwQjtRQUE1QixTQUFTLENBQUMsZ0JBQWdCLENBQUM7a0NBQWdCLGdCQUFnQjtzREFBSTtJQWhHckQsV0FBVztRQVp2QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixxekNBQTRCO1lBRTVCLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsY0FBYzthQUN4QjtZQUNELFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1lBQy9DLFNBQVMsRUFBRSxDQUFDLHdDQUF3QyxDQUFDOztTQUN0RCxDQUFDO1FBOEhhLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTt5Q0FGOUIsaUJBQWlCO1lBQ1UsV0FBVyxVQUVqQixpQkFBaUI7T0EvSDlDLFdBQVcsQ0FtUHZCO0lBQUQsa0JBQUM7S0FBQTtTQW5QWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlLCBQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgRGF0ZUFkYXB0ZXIsXG4gIE1BVF9EQVRFX0ZPUk1BVFMsXG4gIE1hdERhdGVGb3JtYXRzLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcywgTWF0Q2FsZW5kYXJVc2VyRXZlbnR9IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckludGx9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnRsJztcbmltcG9ydCB7TWF0TW9udGhWaWV3fSBmcm9tICcuL21vbnRoLXZpZXcnO1xuaW1wb3J0IHtcbiAgZ2V0QWN0aXZlT2Zmc2V0LFxuICBpc1NhbWVNdWx0aVllYXJWaWV3LFxuICBNYXRNdWx0aVllYXJWaWV3LFxuICB5ZWFyc1BlclBhZ2Vcbn0gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xuaW1wb3J0IHtNYXRZZWFyVmlld30gZnJvbSAnLi95ZWFyLXZpZXcnO1xuaW1wb3J0IHtNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSLCBEYXRlUmFuZ2V9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuXG4vKipcbiAqIFBvc3NpYmxlIHZpZXdzIGZvciB0aGUgY2FsZW5kYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyVmlldyA9ICdtb250aCcgfCAneWVhcicgfCAnbXVsdGkteWVhcic7XG5cbi8qKiBEZWZhdWx0IGhlYWRlciBmb3IgTWF0Q2FsZW5kYXIgKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYWxlbmRhci1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWhlYWRlci5odG1sJyxcbiAgZXhwb3J0QXM6ICdtYXRDYWxlbmRhckhlYWRlcicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckhlYWRlcjxEPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2ludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxuICAgICAgICAgICAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0Q2FsZW5kYXIpKSBwdWJsaWMgY2FsZW5kYXI6IE1hdENhbGVuZGFyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcblxuICAgIHRoaXMuY2FsZW5kYXIuc3RhdGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiBjaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgY3VycmVudCBjYWxlbmRhciB2aWV3LiAqL1xuICBnZXQgcGVyaW9kQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlclxuICAgICAgICAgIC5mb3JtYXQodGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5Lm1vbnRoWWVhckxhYmVsKVxuICAgICAgICAgICAgICAudG9Mb2NhbGVVcHBlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ3llYXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgb2Zmc2V0IGZyb20gdGhlIGFjdGl2ZSB5ZWFyIHRvIHRoZSBcInNsb3RcIiBmb3IgdGhlIHN0YXJ0aW5nIHllYXIgaXMgdGhlXG4gICAgLy8gKmFjdHVhbCogZmlyc3QgcmVuZGVyZWQgeWVhciBpbiB0aGUgbXVsdGkteWVhciB2aWV3LCBhbmQgdGhlIGxhc3QgeWVhciBpc1xuICAgIC8vIGp1c3QgeWVhcnNQZXJQYWdlIC0gMSBhd2F5LlxuICAgIGNvbnN0IGFjdGl2ZVllYXIgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSk7XG4gICAgY29uc3QgbWluWWVhck9mUGFnZSA9IGFjdGl2ZVllYXIgLSBnZXRBY3RpdmVPZmZzZXQoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlciwgdGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCB0aGlzLmNhbGVuZGFyLm1pbkRhdGUsIHRoaXMuY2FsZW5kYXIubWF4RGF0ZSk7XG4gICAgY29uc3QgbWF4WWVhck9mUGFnZSA9IG1pblllYXJPZlBhZ2UgKyB5ZWFyc1BlclBhZ2UgLSAxO1xuICAgIGNvbnN0IG1pblllYXJOYW1lID1cbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuX2RhdGVBZGFwdGVyLmNyZWF0ZURhdGUobWluWWVhck9mUGFnZSwgMCwgMSkpO1xuICAgIGNvbnN0IG1heFllYXJOYW1lID1cbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuX2RhdGVBZGFwdGVyLmNyZWF0ZURhdGUobWF4WWVhck9mUGFnZSwgMCwgMSkpO1xuICAgIHJldHVybiB0aGlzLl9pbnRsLmZvcm1hdFllYXJSYW5nZShtaW5ZZWFyTmFtZSwgbWF4WWVhck5hbWUpO1xuICB9XG5cbiAgZ2V0IHBlcmlvZEJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJyA/XG4gICAgICAgIHRoaXMuX2ludGwuc3dpdGNoVG9NdWx0aVllYXJWaWV3TGFiZWwgOiB0aGlzLl9pbnRsLnN3aXRjaFRvTW9udGhWaWV3TGFiZWw7XG4gIH1cblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgcHJldmlvdXMgYnV0dG9uLiAqL1xuICBnZXQgcHJldkJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdtb250aCc6IHRoaXMuX2ludGwucHJldk1vbnRoTGFiZWwsXG4gICAgICAneWVhcic6IHRoaXMuX2ludGwucHJldlllYXJMYWJlbCxcbiAgICAgICdtdWx0aS15ZWFyJzogdGhpcy5faW50bC5wcmV2TXVsdGlZZWFyTGFiZWxcbiAgICB9W3RoaXMuY2FsZW5kYXIuY3VycmVudFZpZXddO1xuICB9XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIG5leHQgYnV0dG9uLiAqL1xuICBnZXQgbmV4dEJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdtb250aCc6IHRoaXMuX2ludGwubmV4dE1vbnRoTGFiZWwsXG4gICAgICAneWVhcic6IHRoaXMuX2ludGwubmV4dFllYXJMYWJlbCxcbiAgICAgICdtdWx0aS15ZWFyJzogdGhpcy5faW50bC5uZXh0TXVsdGlZZWFyTGFiZWxcbiAgICB9W3RoaXMuY2FsZW5kYXIuY3VycmVudFZpZXddO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXNlciBjbGlja3Mgb24gdGhlIHBlcmlvZCBsYWJlbC4gKi9cbiAgY3VycmVudFBlcmlvZENsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9IHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJyA/ICdtdWx0aS15ZWFyJyA6ICdtb250aCc7XG4gIH1cblxuICAvKiogSGFuZGxlcyB1c2VyIGNsaWNrcyBvbiB0aGUgcHJldmlvdXMgYnV0dG9uLiAqL1xuICBwcmV2aW91c0NsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlID0gdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnID9cbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCAtMSkgOlxuICAgICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyhcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ3llYXInID8gLTEgOiAteWVhcnNQZXJQYWdlXG4gICAgICAgICAgICApO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXNlciBjbGlja3Mgb24gdGhlIG5leHQgYnV0dG9uLiAqL1xuICBuZXh0Q2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUgPSB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcgP1xuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIDEpIDpcbiAgICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJyA/IDEgOiB5ZWFyc1BlclBhZ2VcbiAgICAgICAgICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcHJldmlvdXMgcGVyaW9kIGJ1dHRvbiBpcyBlbmFibGVkLiAqL1xuICBwcmV2aW91c0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmNhbGVuZGFyLm1pbkRhdGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMuY2FsZW5kYXIubWluRGF0ZSB8fFxuICAgICAgICAhdGhpcy5faXNTYW1lVmlldyh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIHRoaXMuY2FsZW5kYXIubWluRGF0ZSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbmV4dCBwZXJpb2QgYnV0dG9uIGlzIGVuYWJsZWQuICovXG4gIG5leHRFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5jYWxlbmRhci5tYXhEYXRlIHx8XG4gICAgICAgICF0aGlzLl9pc1NhbWVWaWV3KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5jYWxlbmRhci5tYXhEYXRlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0d28gZGF0ZXMgcmVwcmVzZW50IHRoZSBzYW1lIHZpZXcgaW4gdGhlIGN1cnJlbnQgdmlldyBtb2RlIChtb250aCBvciB5ZWFyKS4gKi9cbiAgcHJpdmF0ZSBfaXNTYW1lVmlldyhkYXRlMTogRCwgZGF0ZTI6IEQpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMikgJiZcbiAgICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aChkYXRlMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZGF0ZTIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAneWVhcicpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUxKSA9PSB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUyKTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIHdlIGFyZSBpbiAnbXVsdGkteWVhcicgdmlldy5cbiAgICByZXR1cm4gaXNTYW1lTXVsdGlZZWFyVmlldyhcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLCBkYXRlMSwgZGF0ZTIsIHRoaXMuY2FsZW5kYXIubWluRGF0ZSwgdGhpcy5jYWxlbmRhci5tYXhEYXRlKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY2FsZW5kYXIgdGhhdCBpcyB1c2VkIGFzIHBhcnQgb2YgdGhlIGRhdGVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnY2FsZW5kYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjYWxlbmRhci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FsZW5kYXInLFxuICB9LFxuICBleHBvcnRBczogJ21hdENhbGVuZGFyJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW01BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVJdXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyPEQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICAvKiogQW4gaW5wdXQgaW5kaWNhdGluZyB0aGUgdHlwZSBvZiB0aGUgaGVhZGVyIGNvbXBvbmVudCwgaWYgc2V0LiAqL1xuICBASW5wdXQoKSBoZWFkZXJDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8YW55PjtcblxuICAvKiogQSBwb3J0YWwgY29udGFpbmluZyB0aGUgaGVhZGVyIGNvbXBvbmVudCB0eXBlIGZvciB0aGlzIGNhbGVuZGFyLiAqL1xuICBfY2FsZW5kYXJIZWFkZXJQb3J0YWw6IFBvcnRhbDxhbnk+O1xuXG4gIHByaXZhdGUgX2ludGxDaGFuZ2VzOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIFVzZWQgZm9yIHNjaGVkdWxpbmcgdGhhdCBmb2N1cyBzaG91bGQgYmUgbW92ZWQgdG8gdGhlIGFjdGl2ZSBjZWxsIG9uIHRoZSBuZXh0IHRpY2suXG4gICAqIFdlIG5lZWQgdG8gc2NoZWR1bGUgaXQsIHJhdGhlciB0aGFuIGRvIGl0IGltbWVkaWF0ZWx5LCBiZWNhdXNlIHdlIGhhdmUgdG8gd2FpdFxuICAgKiBmb3IgQW5ndWxhciB0byByZS1ldmFsdWF0ZSB0aGUgdmlldyBjaGlsZHJlbi5cbiAgICovXG4gIHByaXZhdGUgX21vdmVGb2N1c09uTmV4dFRpY2sgPSBmYWxzZTtcblxuICAvKiogQSBkYXRlIHJlcHJlc2VudGluZyB0aGUgcGVyaW9kIChtb250aCBvciB5ZWFyKSB0byBzdGFydCB0aGUgY2FsZW5kYXIgaW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGFydEF0KCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX3N0YXJ0QXQ7IH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBzaG91bGQgYmUgc3RhcnRlZCBpbiBtb250aCBvciB5ZWFyIHZpZXcuICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogTWF0Q2FsZW5kYXJWaWV3ID0gJ21vbnRoJztcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRGF0ZVJhbmdlPEQ+IHwgRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7IH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbCkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGVSYW5nZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW5EYXRlKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21pbkRhdGU7IH1cbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21pbkRhdGU6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXhEYXRlKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21heERhdGU7IH1cbiAgc2V0IG1heERhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21heERhdGU6IEQgfCBudWxsO1xuXG4gIC8qKiBGdW5jdGlvbiB1c2VkIHRvIGZpbHRlciB3aGljaCBkYXRlcyBhcmUgc2VsZWN0YWJsZS4gKi9cbiAgQElucHV0KCkgZGF0ZUZpbHRlcjogKGRhdGU6IEQpID0+IGJvb2xlYW47XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIGN1c3RvbSBDU1MgY2xhc3NlcyB0byBkYXRlcy4gKi9cbiAgQElucHV0KCkgZGF0ZUNsYXNzOiAoZGF0ZTogRCkgPT4gTWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcztcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlIGNoYW5nZXMuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIEVtaXR0ZWQgdmFsdWUgdG8gY2hhbmdlIHRvIGBEIHwgbnVsbGAuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIHllYXIgY2hvc2VuIGluIG11bHRpeWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgeWVhclNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBtb250aCBjaG9zZW4gaW4geWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbW9udGhTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX3VzZXJTZWxlY3Rpb246IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+PigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgbW9udGggdmlldyBjb21wb25lbnQuICovXG4gIEBWaWV3Q2hpbGQoTWF0TW9udGhWaWV3KSBtb250aFZpZXc6IE1hdE1vbnRoVmlldzxEPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IHllYXIgdmlldyBjb21wb25lbnQuICovXG4gIEBWaWV3Q2hpbGQoTWF0WWVhclZpZXcpIHllYXJWaWV3OiBNYXRZZWFyVmlldzxEPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IG11bHRpLXllYXIgdmlldyBjb21wb25lbnQuICovXG4gIEBWaWV3Q2hpbGQoTWF0TXVsdGlZZWFyVmlldykgbXVsdGlZZWFyVmlldzogTWF0TXVsdGlZZWFyVmlldzxEPjtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgYWN0aXZlIGRhdGUuIFRoaXMgZGV0ZXJtaW5lcyB3aGljaCB0aW1lIHBlcmlvZCBpcyBzaG93biBhbmQgd2hpY2ggZGF0ZSBpc1xuICAgKiBoaWdobGlnaHRlZCB3aGVuIHVzaW5nIGtleWJvYXJkIG5hdmlnYXRpb24uXG4gICAqL1xuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHsgcmV0dXJuIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlOyB9XG4gIHNldCBhY3RpdmVEYXRlKHZhbHVlOiBEKSB7XG4gICAgdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jbGFtcERhdGUodmFsdWUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfY2xhbXBlZEFjdGl2ZURhdGU6IEQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIGluIG1vbnRoIHZpZXcuICovXG4gIGdldCBjdXJyZW50VmlldygpOiBNYXRDYWxlbmRhclZpZXcgeyByZXR1cm4gdGhpcy5fY3VycmVudFZpZXc7IH1cbiAgc2V0IGN1cnJlbnRWaWV3KHZhbHVlOiBNYXRDYWxlbmRhclZpZXcpIHtcbiAgICB0aGlzLl9jdXJyZW50VmlldyA9IHZhbHVlO1xuICAgIHRoaXMuX21vdmVGb2N1c09uTmV4dFRpY2sgPSB0cnVlO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2N1cnJlbnRWaWV3OiBNYXRDYWxlbmRhclZpZXc7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW5ldmVyIHRoZXJlIGlzIGEgc3RhdGUgY2hhbmdlIHRoYXQgdGhlIGhlYWRlciBtYXkgbmVlZCB0byByZXNwb25kIHRvLlxuICAgKi9cbiAgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihfaW50bDogTWF0RGF0ZXBpY2tlckludGwsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBwcml2YXRlIF9kYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9kYXRlRm9ybWF0cykge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ01BVF9EQVRFX0ZPUk1BVFMnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pbnRsQ2hhbmdlcyA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIF9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jYWxlbmRhckhlYWRlclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwodGhpcy5oZWFkZXJDb21wb25lbnQgfHwgTWF0Q2FsZW5kYXJIZWFkZXIpO1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuc3RhcnRBdCB8fCB0aGlzLl9kYXRlQWRhcHRlci50b2RheSgpO1xuXG4gICAgLy8gQXNzaWduIHRvIHRoZSBwcml2YXRlIHByb3BlcnR5IHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gbW92ZSBmb2N1cyBvbiBpbml0LlxuICAgIHRoaXMuX2N1cnJlbnRWaWV3ID0gdGhpcy5zdGFydFZpZXc7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuX21vdmVGb2N1c09uTmV4dFRpY2spIHtcbiAgICAgIHRoaXMuX21vdmVGb2N1c09uTmV4dFRpY2sgPSBmYWxzZTtcbiAgICAgIHRoaXMuZm9jdXNBY3RpdmVDZWxsKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5faW50bENoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGNoYW5nZSA9XG4gICAgICAgIGNoYW5nZXNbJ21pbkRhdGUnXSB8fCBjaGFuZ2VzWydtYXhEYXRlJ10gfHwgY2hhbmdlc1snZGF0ZUZpbHRlciddO1xuXG4gICAgaWYgKGNoYW5nZSAmJiAhY2hhbmdlLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5fZ2V0Q3VycmVudFZpZXdDb21wb25lbnQoKTtcblxuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBgZGV0ZWN0Q2hhbmdlc2AgbWFudWFsbHkgaGVyZSwgYmVjYXVzZSB0aGUgYG1pbkRhdGVgLCBgbWF4RGF0ZWAgZXRjLiBhcmVcbiAgICAgICAgLy8gcGFzc2VkIGRvd24gdG8gdGhlIHZpZXcgdmlhIGRhdGEgYmluZGluZ3Mgd2hpY2ggd29uJ3QgYmUgdXAtdG8tZGF0ZSB3aGVuIHdlIGNhbGwgYF9pbml0YC5cbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB2aWV3Ll9pbml0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgZm9jdXNBY3RpdmVDZWxsKCkge1xuICAgIHRoaXMuX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCkuX2ZvY3VzQWN0aXZlQ2VsbChmYWxzZSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0b2RheSdzIGRhdGUgYWZ0ZXIgYW4gdXBkYXRlIG9mIHRoZSBhY3RpdmUgZGF0ZSAqL1xuICB1cGRhdGVUb2RheXNEYXRlKCkge1xuICAgIGNvbnN0IGN1cnJlbnRWaWV3ID0gdGhpcy5jdXJyZW50VmlldztcbiAgICBsZXQgdmlldzogTWF0TW9udGhWaWV3PEQ+IHwgTWF0WWVhclZpZXc8RD4gfCBNYXRNdWx0aVllYXJWaWV3PEQ+O1xuXG4gICAgaWYgKGN1cnJlbnRWaWV3ID09PSAnbW9udGgnKSB7XG4gICAgICB2aWV3ID0gdGhpcy5tb250aFZpZXc7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50VmlldyA9PT0gJ3llYXInKSB7XG4gICAgICB2aWV3ID0gdGhpcy55ZWFyVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdmlldyA9IHRoaXMubXVsdGlZZWFyVmlldztcbiAgICB9XG5cbiAgICB2aWV3Ll9pbml0KCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBkYXRlIHNlbGVjdGlvbiBpbiB0aGUgbW9udGggdmlldy4gKi9cbiAgX2RhdGVTZWxlY3RlZChldmVudDogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+KTogdm9pZCB7XG4gICAgY29uc3QgZGF0ZSA9IGV2ZW50LnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQgaW5zdGFuY2VvZiBEYXRlUmFuZ2UgfHxcbiAgICAgICAgKGRhdGUgJiYgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKGRhdGUsIHRoaXMuc2VsZWN0ZWQpKSkge1xuICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgcmVtb3ZlIG5vbi1udWxsIGFzc2VydGlvblxuICAgICAgLy8gb25jZSB0aGUgYHNlbGVjdGVkQ2hhbmdlYCBpcyBhbGxvd2VkIHRvIGJlIG51bGwuXG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoZGF0ZSEpO1xuICAgIH1cblxuICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdChldmVudCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB5ZWFyIHNlbGVjdGlvbiBpbiB0aGUgbXVsdGl5ZWFyIHZpZXcuICovXG4gIF95ZWFyU2VsZWN0ZWRJbk11bHRpWWVhclZpZXcobm9ybWFsaXplZFllYXI6IEQpIHtcbiAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRZZWFyKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vbnRoIHNlbGVjdGlvbiBpbiB0aGUgeWVhciB2aWV3LiAqL1xuICBfbW9udGhTZWxlY3RlZEluWWVhclZpZXcobm9ybWFsaXplZE1vbnRoOiBEKSB7XG4gICAgdGhpcy5tb250aFNlbGVjdGVkLmVtaXQobm9ybWFsaXplZE1vbnRoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHllYXIvbW9udGggc2VsZWN0aW9uIGluIHRoZSBtdWx0aS15ZWFyL3llYXIgdmlld3MuICovXG4gIF9nb1RvRGF0ZUluVmlldyhkYXRlOiBELCB2aWV3OiAnbW9udGgnIHwgJ3llYXInIHwgJ211bHRpLXllYXInKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmVEYXRlID0gZGF0ZTtcbiAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIFRoZSBnaXZlbiBvYmplY3QgaWYgaXQgaXMgYm90aCBhIGRhdGUgaW5zdGFuY2UgYW5kIHZhbGlkLCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHByaXZhdGUgX2dldFZhbGlkRGF0ZU9yTnVsbChvYmo6IGFueSk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX2RhdGVBZGFwdGVyLmlzRGF0ZUluc3RhbmNlKG9iaikgJiYgdGhpcy5fZGF0ZUFkYXB0ZXIuaXNWYWxpZChvYmopKSA/IG9iaiA6IG51bGw7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgY29tcG9uZW50IGluc3RhbmNlIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGN1cnJlbnQgY2FsZW5kYXIgdmlldy4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q3VycmVudFZpZXdDb21wb25lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9udGhWaWV3IHx8IHRoaXMueWVhclZpZXcgfHwgdGhpcy5tdWx0aVllYXJWaWV3O1xuICB9XG59XG4iXX0=