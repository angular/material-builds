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
import { getActiveOffset, isSameMultiYearView, MatMultiYearView, yearsPerPage, } from './multi-year-view';
import { MatYearView } from './year-view';
import { MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER, DateRange } from './date-selection-model';
import * as i0 from "@angular/core";
import * as i1 from "./datepicker-intl";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/common";
import * as i5 from "@angular/cdk/a11y";
import * as i6 from "@angular/cdk/portal";
import * as i7 from "./month-view";
import * as i8 from "./year-view";
import * as i9 from "./multi-year-view";
let calendarHeaderId = 1;
/** Default header for MatCalendar */
class MatCalendarHeader {
    constructor(_intl, calendar, _dateAdapter, _dateFormats, changeDetectorRef) {
        this._intl = _intl;
        this.calendar = calendar;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._id = `mat-calendar-header-${calendarHeaderId++}`;
        this._periodButtonLabelId = `${this._id}-period-label`;
        this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
    }
    /** The display text for the current calendar view. */
    get periodButtonText() {
        if (this.calendar.currentView == 'month') {
            return this._dateAdapter
                .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
                .toLocaleUpperCase();
        }
        if (this.calendar.currentView == 'year') {
            return this._dateAdapter.getYearName(this.calendar.activeDate);
        }
        return this._intl.formatYearRange(...this._formatMinAndMaxYearLabels());
    }
    /** The aria description for the current calendar view. */
    get periodButtonDescription() {
        if (this.calendar.currentView == 'month') {
            return this._dateAdapter
                .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
                .toLocaleUpperCase();
        }
        if (this.calendar.currentView == 'year') {
            return this._dateAdapter.getYearName(this.calendar.activeDate);
        }
        // Format a label for the window of years displayed in the multi-year calendar view. Use
        // `formatYearRangeLabel` because it is TTS friendly.
        return this._intl.formatYearRangeLabel(...this._formatMinAndMaxYearLabels());
    }
    /** The `aria-label` for changing the calendar view. */
    get periodButtonLabel() {
        return this.calendar.currentView == 'month'
            ? this._intl.switchToMultiYearViewLabel
            : this._intl.switchToMonthViewLabel;
    }
    /** The label for the previous button. */
    get prevButtonLabel() {
        return {
            'month': this._intl.prevMonthLabel,
            'year': this._intl.prevYearLabel,
            'multi-year': this._intl.prevMultiYearLabel,
        }[this.calendar.currentView];
    }
    /** The label for the next button. */
    get nextButtonLabel() {
        return {
            'month': this._intl.nextMonthLabel,
            'year': this._intl.nextYearLabel,
            'multi-year': this._intl.nextMultiYearLabel,
        }[this.calendar.currentView];
    }
    /** Handles user clicks on the period label. */
    currentPeriodClicked() {
        this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
    }
    /** Handles user clicks on the previous button. */
    previousClicked() {
        this.calendar.activeDate =
            this.calendar.currentView == 'month'
                ? this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1)
                : this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage);
    }
    /** Handles user clicks on the next button. */
    nextClicked() {
        this.calendar.activeDate =
            this.calendar.currentView == 'month'
                ? this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1)
                : this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? 1 : yearsPerPage);
    }
    /** Whether the previous period button is enabled. */
    previousEnabled() {
        if (!this.calendar.minDate) {
            return true;
        }
        return (!this.calendar.minDate || !this._isSameView(this.calendar.activeDate, this.calendar.minDate));
    }
    /** Whether the next period button is enabled. */
    nextEnabled() {
        return (!this.calendar.maxDate || !this._isSameView(this.calendar.activeDate, this.calendar.maxDate));
    }
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    _isSameView(date1, date2) {
        if (this.calendar.currentView == 'month') {
            return (this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2));
        }
        if (this.calendar.currentView == 'year') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
        }
        // Otherwise we are in 'multi-year' view.
        return isSameMultiYearView(this._dateAdapter, date1, date2, this.calendar.minDate, this.calendar.maxDate);
    }
    /**
     * Format two individual labels for the minimum year and maximum year available in the multi-year
     * calendar view. Returns an array of two strings where the first string is the formatted label
     * for the minimum year, and the second string is the formatted label for the maximum year.
     */
    _formatMinAndMaxYearLabels() {
        // The offset from the active year to the "slot" for the starting year is the
        // *actual* first rendered year in the multi-year view, and the last year is
        // just yearsPerPage - 1 away.
        const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
        const minYearOfPage = activeYear -
            getActiveOffset(this._dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
        const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
        const minYearLabel = this._dateAdapter.getYearName(this._dateAdapter.createDate(minYearOfPage, 0, 1));
        const maxYearLabel = this._dateAdapter.getYearName(this._dateAdapter.createDate(maxYearOfPage, 0, 1));
        return [minYearLabel, maxYearLabel];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCalendarHeader, deps: [{ token: i1.MatDatepickerIntl }, { token: forwardRef(() => MatCalendar) }, { token: i2.DateAdapter, optional: true }, { token: MAT_DATE_FORMATS, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatCalendarHeader, selector: "mat-calendar-header", exportAs: ["matCalendarHeader"], ngImport: i0, template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <button mat-button type=\"button\" class=\"mat-calendar-period-button\"\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\n            [attr.aria-describedby]=\"_periodButtonLabelId\" aria-live=\"polite\">\n      <span aria-hidden=\"true\">{{periodButtonText}}</span>\n      <svg class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"calendar.currentView !== 'month'\"\n           viewBox=\"0 0 10 5\" focusable=\"false\" aria-hidden=\"true\">\n           <polygon points=\"0,0 5,5 10,0\"/>\n      </svg>\n    </button>\n\n    <div class=\"mat-calendar-spacer\"></div>\n\n    <ng-content></ng-content>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-previous-button\"\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\n            [attr.aria-label]=\"prevButtonLabel\">\n    </button>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-next-button\"\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\n            [attr.aria-label]=\"nextButtonLabel\">\n    </button>\n  </div>\n</div>\n<label [id]=\"_periodButtonLabelId\" class=\"mat-calendar-hidden-label\">{{periodButtonDescription}}</label>\n", dependencies: [{ kind: "component", type: i3.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i3.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatCalendarHeader };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCalendarHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-calendar-header', exportAs: 'matCalendarHeader', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <button mat-button type=\"button\" class=\"mat-calendar-period-button\"\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\n            [attr.aria-describedby]=\"_periodButtonLabelId\" aria-live=\"polite\">\n      <span aria-hidden=\"true\">{{periodButtonText}}</span>\n      <svg class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"calendar.currentView !== 'month'\"\n           viewBox=\"0 0 10 5\" focusable=\"false\" aria-hidden=\"true\">\n           <polygon points=\"0,0 5,5 10,0\"/>\n      </svg>\n    </button>\n\n    <div class=\"mat-calendar-spacer\"></div>\n\n    <ng-content></ng-content>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-previous-button\"\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\n            [attr.aria-label]=\"prevButtonLabel\">\n    </button>\n\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-next-button\"\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\n            [attr.aria-label]=\"nextButtonLabel\">\n    </button>\n  </div>\n</div>\n<label [id]=\"_periodButtonLabelId\" class=\"mat-calendar-hidden-label\">{{periodButtonDescription}}</label>\n" }]
        }], ctorParameters: function () { return [{ type: i1.MatDatepickerIntl }, { type: MatCalendar, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatCalendar)]
                }] }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_FORMATS]
                }] }, { type: i0.ChangeDetectorRef }]; } });
/** A calendar that is used as part of the datepicker. */
class MatCalendar {
    /** A date representing the period (month or year) to start the calendar in. */
    get startAt() {
        return this._startAt;
    }
    set startAt(value) {
        this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        if (value instanceof DateRange) {
            this._selected = value;
        }
        else {
            this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    get activeDate() {
        return this._clampedActiveDate;
    }
    set activeDate(value) {
        this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        this.stateChanges.next();
        this._changeDetectorRef.markForCheck();
    }
    /** Whether the calendar is in month view. */
    get currentView() {
        return this._currentView;
    }
    set currentView(value) {
        const viewChangedResult = this._currentView !== value ? value : null;
        this._currentView = value;
        this._moveFocusOnNextTick = true;
        this._changeDetectorRef.markForCheck();
        if (viewChangedResult) {
            this.viewChanged.emit(viewChangedResult);
        }
    }
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
        /**
         * Emits when the current view changes.
         */
        this.viewChanged = new EventEmitter(true);
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /** Emits a new date range value when the user completes a drag drop operation. */
        this._userDragDrop = new EventEmitter();
        /** Origin of active drag, or null when dragging is not active. */
        this._activeDrag = null;
        /**
         * Emits whenever there is a state change that the header may need to respond to.
         */
        this.stateChanges = new Subject();
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
        }
        this._intlChanges = _intl.changes.subscribe(() => {
            _changeDetectorRef.markForCheck();
            this.stateChanges.next();
        });
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
        // Ignore date changes that are at a different time on the same day. This fixes issues where
        // the calendar re-renders when there is no meaningful change to [minDate] or [maxDate]
        // (#24435).
        const minDateChange = changes['minDate'] &&
            !this._dateAdapter.sameDate(changes['minDate'].previousValue, changes['minDate'].currentValue)
            ? changes['minDate']
            : undefined;
        const maxDateChange = changes['maxDate'] &&
            !this._dateAdapter.sameDate(changes['maxDate'].previousValue, changes['maxDate'].currentValue)
            ? changes['maxDate']
            : undefined;
        const change = minDateChange || maxDateChange || changes['dateFilter'];
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
    /** Focuses the active date. */
    focusActiveCell() {
        this._getCurrentViewComponent()._focusActiveCell(false);
    }
    /** Updates today's date after an update of the active date */
    updateTodaysDate() {
        this._getCurrentViewComponent()._init();
    }
    /** Handles date selection in the month view. */
    _dateSelected(event) {
        const date = event.value;
        if (this.selected instanceof DateRange ||
            (date && !this._dateAdapter.sameDate(date, this.selected))) {
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
    /** Called when the user starts dragging to change a date range. */
    _dragStarted(event) {
        this._activeDrag = event;
    }
    /**
     * Called when a drag completes. It may end in cancelation or in the selection
     * of a new range.
     */
    _dragEnded(event) {
        if (!this._activeDrag)
            return;
        if (event.value) {
            this._userDragDrop.emit(event);
        }
        this._activeDrag = null;
    }
    /** Returns the component instance that corresponds to the current calendar view. */
    _getCurrentViewComponent() {
        // The return type is explicitly written as a union to ensure that the Closure compiler does
        // not optimize calls to _init(). Without the explicit return type, TypeScript narrows it to
        // only the first component type. See https://github.com/angular/components/issues/22996.
        return this.monthView || this.yearView || this.multiYearView;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCalendar, deps: [{ token: i1.MatDatepickerIntl }, { token: i2.DateAdapter, optional: true }, { token: MAT_DATE_FORMATS, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatCalendar, selector: "mat-calendar", inputs: { headerComponent: "headerComponent", startAt: "startAt", startView: "startView", selected: "selected", minDate: "minDate", maxDate: "maxDate", dateFilter: "dateFilter", dateClass: "dateClass", comparisonStart: "comparisonStart", comparisonEnd: "comparisonEnd", startDateAccessibleName: "startDateAccessibleName", endDateAccessibleName: "endDateAccessibleName" }, outputs: { selectedChange: "selectedChange", yearSelected: "yearSelected", monthSelected: "monthSelected", viewChanged: "viewChanged", _userSelection: "_userSelection", _userDragDrop: "_userDragDrop" }, host: { classAttribute: "mat-calendar" }, providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER], viewQueries: [{ propertyName: "monthView", first: true, predicate: MatMonthView, descendants: true }, { propertyName: "yearView", first: true, predicate: MatYearView, descendants: true }, { propertyName: "multiYearView", first: true, predicate: MatMultiYearView, descendants: true }], exportAs: ["matCalendar"], usesOnChanges: true, ngImport: i0, template: "<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n\n<div class=\"mat-calendar-content\" [ngSwitch]=\"currentView\" cdkMonitorSubtreeFocus tabindex=\"-1\">\n  <mat-month-view\n      *ngSwitchCase=\"'month'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      [comparisonStart]=\"comparisonStart\"\n      [comparisonEnd]=\"comparisonEnd\"\n      [startDateAccessibleName]=\"startDateAccessibleName\"\n      [endDateAccessibleName]=\"endDateAccessibleName\"\n      (_userSelection)=\"_dateSelected($event)\"\n      (dragStarted)=\"_dragStarted($event)\"\n      (dragEnded)=\"_dragEnded($event)\"\n      [activeDrag]=\"_activeDrag\"\n      >\n  </mat-month-view>\n\n  <mat-year-view\n      *ngSwitchCase=\"'year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      (monthSelected)=\"_monthSelectedInYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'month')\">\n  </mat-year-view>\n\n  <mat-multi-year-view\n      *ngSwitchCase=\"'multi-year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'year')\">\n  </mat-multi-year-view>\n</div>\n", styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:none}.mat-calendar-controls{display:flex;align-items:center;margin:5% calc(4.7142857143% - 16px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0;margin:0 8px}.mat-calendar-arrow{display:inline-block;width:10px;height:5px;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.cdk-high-contrast-active .mat-calendar-arrow{fill:CanvasText}.mat-calendar-previous-button,.mat-calendar-next-button{position:relative}.mat-calendar-previous-button::after,.mat-calendar-next-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:\"\";margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-previous-button,[dir=rtl] .mat-calendar-next-button{transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:\"\";position:absolute;top:0;left:-8px;right:-8px;height:1px}.mat-calendar-body-cell-content::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1)}.mat-calendar-body-cell:focus .mat-focus-indicator::before{content:\"\"}.mat-calendar-hidden-label{display:none}"], dependencies: [{ kind: "directive", type: i4.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i4.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i5.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }, { kind: "directive", type: i6.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }, { kind: "component", type: i7.MatMonthView, selector: "mat-month-view", inputs: ["activeDate", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName", "activeDrag"], outputs: ["selectedChange", "_userSelection", "dragStarted", "dragEnded", "activeDateChange"], exportAs: ["matMonthView"] }, { kind: "component", type: i8.MatYearView, selector: "mat-year-view", inputs: ["activeDate", "selected", "minDate", "maxDate", "dateFilter", "dateClass"], outputs: ["selectedChange", "monthSelected", "activeDateChange"], exportAs: ["matYearView"] }, { kind: "component", type: i9.MatMultiYearView, selector: "mat-multi-year-view", inputs: ["activeDate", "selected", "minDate", "maxDate", "dateFilter", "dateClass"], outputs: ["selectedChange", "yearSelected", "activeDateChange"], exportAs: ["matMultiYearView"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatCalendar };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'mat-calendar', host: {
                        'class': 'mat-calendar',
                    }, exportAs: 'matCalendar', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER], template: "<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n\n<div class=\"mat-calendar-content\" [ngSwitch]=\"currentView\" cdkMonitorSubtreeFocus tabindex=\"-1\">\n  <mat-month-view\n      *ngSwitchCase=\"'month'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      [comparisonStart]=\"comparisonStart\"\n      [comparisonEnd]=\"comparisonEnd\"\n      [startDateAccessibleName]=\"startDateAccessibleName\"\n      [endDateAccessibleName]=\"endDateAccessibleName\"\n      (_userSelection)=\"_dateSelected($event)\"\n      (dragStarted)=\"_dragStarted($event)\"\n      (dragEnded)=\"_dragEnded($event)\"\n      [activeDrag]=\"_activeDrag\"\n      >\n  </mat-month-view>\n\n  <mat-year-view\n      *ngSwitchCase=\"'year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      (monthSelected)=\"_monthSelectedInYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'month')\">\n  </mat-year-view>\n\n  <mat-multi-year-view\n      *ngSwitchCase=\"'multi-year'\"\n      [(activeDate)]=\"activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"dateFilter\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      [dateClass]=\"dateClass\"\n      (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\n      (selectedChange)=\"_goToDateInView($event, 'year')\">\n  </mat-multi-year-view>\n</div>\n", styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:none}.mat-calendar-controls{display:flex;align-items:center;margin:5% calc(4.7142857143% - 16px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0;margin:0 8px}.mat-calendar-arrow{display:inline-block;width:10px;height:5px;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.cdk-high-contrast-active .mat-calendar-arrow{fill:CanvasText}.mat-calendar-previous-button,.mat-calendar-next-button{position:relative}.mat-calendar-previous-button::after,.mat-calendar-next-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:\"\";margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-previous-button,[dir=rtl] .mat-calendar-next-button{transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:\"\";position:absolute;top:0;left:-8px;right:-8px;height:1px}.mat-calendar-body-cell-content::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1)}.mat-calendar-body-cell:focus .mat-focus-indicator::before{content:\"\"}.mat-calendar-hidden-label{display:none}"] }]
        }], ctorParameters: function () { return [{ type: i1.MatDatepickerIntl }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_FORMATS]
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { headerComponent: [{
                type: Input
            }], startAt: [{
                type: Input
            }], startView: [{
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
            }], startDateAccessibleName: [{
                type: Input
            }], endDateAccessibleName: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], viewChanged: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], _userDragDrop: [{
                type: Output
            }], monthView: [{
                type: ViewChild,
                args: [MatMonthView]
            }], yearView: [{
                type: ViewChild,
                args: [MatYearView]
            }], multiYearView: [{
                type: ViewChild,
                args: [MatMultiYearView]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWhlYWRlci5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvY2FsZW5kYXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUF3QixNQUFNLHFCQUFxQixDQUFDO0FBQzNFLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFHTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sd0JBQXdCLENBQUM7QUFDckYsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUUzQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFDTCxlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQixZQUFZLEdBQ2IsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyx3Q0FBd0MsRUFBRSxTQUFTLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFFM0YsSUFBSSxnQkFB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TTtnQkFLWSxjQUFjO3NCQUFoQyxNQUFNO2dCQUlZLGFBQWE7c0JBQS9CLE1BQU07Z0JBR2tCLFNBQVM7c0JBQWpDLFNBQVM7dUJBQUMsWUFBWTtnQkFHQyxRQUFRO3NCQUEvQixTQUFTO3VCQUFDLFdBQVc7Z0JBR08sYUFBYTtzQkFBekMsU0FBUzt1QkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdDaGVja2VkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0ZPUk1BVFMsIE1hdERhdGVGb3JtYXRzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJVc2VyRXZlbnQsIE1hdENhbGVuZGFyQ2VsbENsYXNzRnVuY3Rpb259IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckludGx9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnRsJztcbmltcG9ydCB7TWF0TW9udGhWaWV3fSBmcm9tICcuL21vbnRoLXZpZXcnO1xuaW1wb3J0IHtcbiAgZ2V0QWN0aXZlT2Zmc2V0LFxuICBpc1NhbWVNdWx0aVllYXJWaWV3LFxuICBNYXRNdWx0aVllYXJWaWV3LFxuICB5ZWFyc1BlclBhZ2UsXG59IGZyb20gJy4vbXVsdGkteWVhci12aWV3JztcbmltcG9ydCB7TWF0WWVhclZpZXd9IGZyb20gJy4veWVhci12aWV3JztcbmltcG9ydCB7TUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9QUk9WSURFUiwgRGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxubGV0IGNhbGVuZGFySGVhZGVySWQgPSAxO1xuXG4vKipcbiAqIFBvc3NpYmxlIHZpZXdzIGZvciB0aGUgY2FsZW5kYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyVmlldyA9ICdtb250aCcgfCAneWVhcicgfCAnbXVsdGkteWVhcic7XG5cbi8qKiBEZWZhdWx0IGhlYWRlciBmb3IgTWF0Q2FsZW5kYXIgKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYWxlbmRhci1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWhlYWRlci5odG1sJyxcbiAgZXhwb3J0QXM6ICdtYXRDYWxlbmRhckhlYWRlcicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckhlYWRlcjxEPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2ludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRDYWxlbmRhcikpIHB1YmxpYyBjYWxlbmRhcjogTWF0Q2FsZW5kYXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgdGhpcy5jYWxlbmRhci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIC8qKiBUaGUgZGlzcGxheSB0ZXh0IGZvciB0aGUgY3VycmVudCBjYWxlbmRhciB2aWV3LiAqL1xuICBnZXQgcGVyaW9kQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlclxuICAgICAgICAuZm9ybWF0KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5tb250aFllYXJMYWJlbClcbiAgICAgICAgLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ludGwuZm9ybWF0WWVhclJhbmdlKC4uLnRoaXMuX2Zvcm1hdE1pbkFuZE1heFllYXJMYWJlbHMoKSk7XG4gIH1cblxuICAvKiogVGhlIGFyaWEgZGVzY3JpcHRpb24gZm9yIHRoZSBjdXJyZW50IGNhbGVuZGFyIHZpZXcuICovXG4gIGdldCBwZXJpb2RCdXR0b25EZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlclxuICAgICAgICAuZm9ybWF0KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5tb250aFllYXJMYWJlbClcbiAgICAgICAgLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IGEgbGFiZWwgZm9yIHRoZSB3aW5kb3cgb2YgeWVhcnMgZGlzcGxheWVkIGluIHRoZSBtdWx0aS15ZWFyIGNhbGVuZGFyIHZpZXcuIFVzZVxuICAgIC8vIGBmb3JtYXRZZWFyUmFuZ2VMYWJlbGAgYmVjYXVzZSBpdCBpcyBUVFMgZnJpZW5kbHkuXG4gICAgcmV0dXJuIHRoaXMuX2ludGwuZm9ybWF0WWVhclJhbmdlTGFiZWwoLi4udGhpcy5fZm9ybWF0TWluQW5kTWF4WWVhckxhYmVscygpKTtcbiAgfVxuXG4gIC8qKiBUaGUgYGFyaWEtbGFiZWxgIGZvciBjaGFuZ2luZyB0aGUgY2FsZW5kYXIgdmlldy4gKi9cbiAgZ2V0IHBlcmlvZEJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJ1xuICAgICAgPyB0aGlzLl9pbnRsLnN3aXRjaFRvTXVsdGlZZWFyVmlld0xhYmVsXG4gICAgICA6IHRoaXMuX2ludGwuc3dpdGNoVG9Nb250aFZpZXdMYWJlbDtcbiAgfVxuXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSBwcmV2aW91cyBidXR0b24uICovXG4gIGdldCBwcmV2QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ21vbnRoJzogdGhpcy5faW50bC5wcmV2TW9udGhMYWJlbCxcbiAgICAgICd5ZWFyJzogdGhpcy5faW50bC5wcmV2WWVhckxhYmVsLFxuICAgICAgJ211bHRpLXllYXInOiB0aGlzLl9pbnRsLnByZXZNdWx0aVllYXJMYWJlbCxcbiAgICB9W3RoaXMuY2FsZW5kYXIuY3VycmVudFZpZXddO1xuICB9XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIG5leHQgYnV0dG9uLiAqL1xuICBnZXQgbmV4dEJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdtb250aCc6IHRoaXMuX2ludGwubmV4dE1vbnRoTGFiZWwsXG4gICAgICAneWVhcic6IHRoaXMuX2ludGwubmV4dFllYXJMYWJlbCxcbiAgICAgICdtdWx0aS15ZWFyJzogdGhpcy5faW50bC5uZXh0TXVsdGlZZWFyTGFiZWwsXG4gICAgfVt0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3XTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBwZXJpb2QgbGFiZWwuICovXG4gIGN1cnJlbnRQZXJpb2RDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPSB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCcgPyAnbXVsdGkteWVhcicgOiAnbW9udGgnO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXNlciBjbGlja3Mgb24gdGhlIHByZXZpb3VzIGJ1dHRvbi4gKi9cbiAgcHJldmlvdXNDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSA9XG4gICAgICB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICdtb250aCdcbiAgICAgICAgPyB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsIC0xKVxuICAgICAgICA6IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsXG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJyA/IC0xIDogLXllYXJzUGVyUGFnZSxcbiAgICAgICAgICApO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXNlciBjbGlja3Mgb24gdGhlIG5leHQgYnV0dG9uLiAqL1xuICBuZXh0Q2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUgPVxuICAgICAgdGhpcy5jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnXG4gICAgICAgID8gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLCAxKVxuICAgICAgICA6IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmFjdGl2ZURhdGUsXG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmN1cnJlbnRWaWV3ID09ICd5ZWFyJyA/IDEgOiB5ZWFyc1BlclBhZ2UsXG4gICAgICAgICAgKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwcmV2aW91cyBwZXJpb2QgYnV0dG9uIGlzIGVuYWJsZWQuICovXG4gIHByZXZpb3VzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY2FsZW5kYXIubWluRGF0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5jYWxlbmRhci5taW5EYXRlIHx8ICF0aGlzLl9pc1NhbWVWaWV3KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5jYWxlbmRhci5taW5EYXRlKVxuICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbmV4dCBwZXJpb2QgYnV0dG9uIGlzIGVuYWJsZWQuICovXG4gIG5leHRFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5jYWxlbmRhci5tYXhEYXRlIHx8ICF0aGlzLl9pc1NhbWVWaWV3KHRoaXMuY2FsZW5kYXIuYWN0aXZlRGF0ZSwgdGhpcy5jYWxlbmRhci5tYXhEYXRlKVxuICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHdvIGRhdGVzIHJlcHJlc2VudCB0aGUgc2FtZSB2aWV3IGluIHRoZSBjdXJyZW50IHZpZXcgbW9kZSAobW9udGggb3IgeWVhcikuICovXG4gIHByaXZhdGUgX2lzU2FtZVZpZXcoZGF0ZTE6IEQsIGRhdGUyOiBEKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ21vbnRoJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMikgJiZcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZGF0ZTEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKGRhdGUyKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2FsZW5kYXIuY3VycmVudFZpZXcgPT0gJ3llYXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMik7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSB3ZSBhcmUgaW4gJ211bHRpLXllYXInIHZpZXcuXG4gICAgcmV0dXJuIGlzU2FtZU11bHRpWWVhclZpZXcoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlcixcbiAgICAgIGRhdGUxLFxuICAgICAgZGF0ZTIsXG4gICAgICB0aGlzLmNhbGVuZGFyLm1pbkRhdGUsXG4gICAgICB0aGlzLmNhbGVuZGFyLm1heERhdGUsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgdHdvIGluZGl2aWR1YWwgbGFiZWxzIGZvciB0aGUgbWluaW11bSB5ZWFyIGFuZCBtYXhpbXVtIHllYXIgYXZhaWxhYmxlIGluIHRoZSBtdWx0aS15ZWFyXG4gICAqIGNhbGVuZGFyIHZpZXcuIFJldHVybnMgYW4gYXJyYXkgb2YgdHdvIHN0cmluZ3Mgd2hlcmUgdGhlIGZpcnN0IHN0cmluZyBpcyB0aGUgZm9ybWF0dGVkIGxhYmVsXG4gICAqIGZvciB0aGUgbWluaW11bSB5ZWFyLCBhbmQgdGhlIHNlY29uZCBzdHJpbmcgaXMgdGhlIGZvcm1hdHRlZCBsYWJlbCBmb3IgdGhlIG1heGltdW0geWVhci5cbiAgICovXG4gIHByaXZhdGUgX2Zvcm1hdE1pbkFuZE1heFllYXJMYWJlbHMoKTogW21pblllYXJMYWJlbDogc3RyaW5nLCBtYXhZZWFyTGFiZWw6IHN0cmluZ10ge1xuICAgIC8vIFRoZSBvZmZzZXQgZnJvbSB0aGUgYWN0aXZlIHllYXIgdG8gdGhlIFwic2xvdFwiIGZvciB0aGUgc3RhcnRpbmcgeWVhciBpcyB0aGVcbiAgICAvLyAqYWN0dWFsKiBmaXJzdCByZW5kZXJlZCB5ZWFyIGluIHRoZSBtdWx0aS15ZWFyIHZpZXcsIGFuZCB0aGUgbGFzdCB5ZWFyIGlzXG4gICAgLy8ganVzdCB5ZWFyc1BlclBhZ2UgLSAxIGF3YXkuXG4gICAgY29uc3QgYWN0aXZlWWVhciA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlKTtcbiAgICBjb25zdCBtaW5ZZWFyT2ZQYWdlID1cbiAgICAgIGFjdGl2ZVllYXIgLVxuICAgICAgZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlcixcbiAgICAgICAgdGhpcy5jYWxlbmRhci5hY3RpdmVEYXRlLFxuICAgICAgICB0aGlzLmNhbGVuZGFyLm1pbkRhdGUsXG4gICAgICAgIHRoaXMuY2FsZW5kYXIubWF4RGF0ZSxcbiAgICAgICk7XG4gICAgY29uc3QgbWF4WWVhck9mUGFnZSA9IG1pblllYXJPZlBhZ2UgKyB5ZWFyc1BlclBhZ2UgLSAxO1xuICAgIGNvbnN0IG1pblllYXJMYWJlbCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShtaW5ZZWFyT2ZQYWdlLCAwLCAxKSxcbiAgICApO1xuICAgIGNvbnN0IG1heFllYXJMYWJlbCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXJOYW1lKFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShtYXhZZWFyT2ZQYWdlLCAwLCAxKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIFttaW5ZZWFyTGFiZWwsIG1heFllYXJMYWJlbF07XG4gIH1cblxuICBwcml2YXRlIF9pZCA9IGBtYXQtY2FsZW5kYXItaGVhZGVyLSR7Y2FsZW5kYXJIZWFkZXJJZCsrfWA7XG5cbiAgX3BlcmlvZEJ1dHRvbkxhYmVsSWQgPSBgJHt0aGlzLl9pZH0tcGVyaW9kLWxhYmVsYDtcbn1cblxuLyoqIEEgY2FsZW5kYXIgdGhhdCBpcyB1c2VkIGFzIHBhcnQgb2YgdGhlIGRhdGVwaWNrZXIuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhbGVuZGFyJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRDYWxlbmRhcicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXI8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIC8qKiBBbiBpbnB1dCBpbmRpY2F0aW5nIHRoZSB0eXBlIG9mIHRoZSBoZWFkZXIgY29tcG9uZW50LCBpZiBzZXQuICovXG4gIEBJbnB1dCgpIGhlYWRlckNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxhbnk+O1xuXG4gIC8qKiBBIHBvcnRhbCBjb250YWluaW5nIHRoZSBoZWFkZXIgY29tcG9uZW50IHR5cGUgZm9yIHRoaXMgY2FsZW5kYXIuICovXG4gIF9jYWxlbmRhckhlYWRlclBvcnRhbDogUG9ydGFsPGFueT47XG5cbiAgcHJpdmF0ZSBfaW50bENoYW5nZXM6IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogVXNlZCBmb3Igc2NoZWR1bGluZyB0aGF0IGZvY3VzIHNob3VsZCBiZSBtb3ZlZCB0byB0aGUgYWN0aXZlIGNlbGwgb24gdGhlIG5leHQgdGljay5cbiAgICogV2UgbmVlZCB0byBzY2hlZHVsZSBpdCwgcmF0aGVyIHRoYW4gZG8gaXQgaW1tZWRpYXRlbHksIGJlY2F1c2Ugd2UgaGF2ZSB0byB3YWl0XG4gICAqIGZvciBBbmd1bGFyIHRvIHJlLWV2YWx1YXRlIHRoZSB2aWV3IGNoaWxkcmVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfbW92ZUZvY3VzT25OZXh0VGljayA9IGZhbHNlO1xuXG4gIC8qKiBBIGRhdGUgcmVwcmVzZW50aW5nIHRoZSBwZXJpb2QgKG1vbnRoIG9yIHllYXIpIHRvIHN0YXJ0IHRoZSBjYWxlbmRhciBpbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zdGFydEF0O1xuICB9XG4gIHNldCBzdGFydEF0KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9zdGFydEF0OiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgc2hvdWxkIGJlIHN0YXJ0ZWQgaW4gbW9udGggb3IgeWVhciB2aWV3LiAqL1xuICBASW5wdXQoKSBzdGFydFZpZXc6IE1hdENhbGVuZGFyVmlldyA9ICdtb250aCc7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEYXRlUmFuZ2U8RD4gfCBEIHwgbnVsbCkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGVSYW5nZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IERhdGVSYW5nZTxEPiB8IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW5EYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWluRGF0ZTtcbiAgfVxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluRGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9tYXhEYXRlOiBEIHwgbnVsbDtcblxuICAvKiogRnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogTWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbjxEPjtcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdFN0YXJ0RGF0ZS8+YCAqL1xuICBASW5wdXQoKSBzdGFydERhdGVBY2Nlc3NpYmxlTmFtZTogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogQVJJQSBBY2Nlc3NpYmxlIG5hbWUgb2YgdGhlIGA8aW5wdXQgbWF0RW5kRGF0ZS8+YCAqL1xuICBASW5wdXQoKSBlbmREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPEQgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8RCB8IG51bGw+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSB5ZWFyIGNob3NlbiBpbiBtdWx0aXllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHllYXJTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgbW9udGggY2hvc2VuIGluIHllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1vbnRoU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgY3VycmVudCB2aWV3IGNoYW5nZXMuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmlld0NoYW5nZWQ6IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclZpZXc+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclZpZXc+KFxuICAgIHRydWUsXG4gICk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfdXNlclNlbGVjdGlvbjogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+PigpO1xuXG4gIC8qKiBFbWl0cyBhIG5ldyBkYXRlIHJhbmdlIHZhbHVlIHdoZW4gdGhlIHVzZXIgY29tcGxldGVzIGEgZHJhZyBkcm9wIG9wZXJhdGlvbi4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF91c2VyRHJhZ0Ryb3AgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PERhdGVSYW5nZTxEPj4+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBtb250aCB2aWV3IGNvbXBvbmVudC4gKi9cbiAgQFZpZXdDaGlsZChNYXRNb250aFZpZXcpIG1vbnRoVmlldzogTWF0TW9udGhWaWV3PEQ+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgeWVhciB2aWV3IGNvbXBvbmVudC4gKi9cbiAgQFZpZXdDaGlsZChNYXRZZWFyVmlldykgeWVhclZpZXc6IE1hdFllYXJWaWV3PEQ+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgbXVsdGkteWVhciB2aWV3IGNvbXBvbmVudC4gKi9cbiAgQFZpZXdDaGlsZChNYXRNdWx0aVllYXJWaWV3KSBtdWx0aVllYXJWaWV3OiBNYXRNdWx0aVllYXJWaWV3PEQ+O1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCBhY3RpdmUgZGF0ZS4gVGhpcyBkZXRlcm1pbmVzIHdoaWNoIHRpbWUgcGVyaW9kIGlzIHNob3duIGFuZCB3aGljaCBkYXRlIGlzXG4gICAqIGhpZ2hsaWdodGVkIHdoZW4gdXNpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAgICovXG4gIGdldCBhY3RpdmVEYXRlKCk6IEQge1xuICAgIHJldHVybiB0aGlzLl9jbGFtcGVkQWN0aXZlRGF0ZTtcbiAgfVxuICBzZXQgYWN0aXZlRGF0ZSh2YWx1ZTogRCkge1xuICAgIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY2xhbXBEYXRlKHZhbHVlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2NsYW1wZWRBY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBpcyBpbiBtb250aCB2aWV3LiAqL1xuICBnZXQgY3VycmVudFZpZXcoKTogTWF0Q2FsZW5kYXJWaWV3IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFZpZXc7XG4gIH1cbiAgc2V0IGN1cnJlbnRWaWV3KHZhbHVlOiBNYXRDYWxlbmRhclZpZXcpIHtcbiAgICBjb25zdCB2aWV3Q2hhbmdlZFJlc3VsdCA9IHRoaXMuX2N1cnJlbnRWaWV3ICE9PSB2YWx1ZSA/IHZhbHVlIDogbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50VmlldyA9IHZhbHVlO1xuICAgIHRoaXMuX21vdmVGb2N1c09uTmV4dFRpY2sgPSB0cnVlO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIGlmICh2aWV3Q2hhbmdlZFJlc3VsdCkge1xuICAgICAgdGhpcy52aWV3Q2hhbmdlZC5lbWl0KHZpZXdDaGFuZ2VkUmVzdWx0KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfY3VycmVudFZpZXc6IE1hdENhbGVuZGFyVmlldztcblxuICAvKiogT3JpZ2luIG9mIGFjdGl2ZSBkcmFnLCBvciBudWxsIHdoZW4gZHJhZ2dpbmcgaXMgbm90IGFjdGl2ZS4gKi9cbiAgcHJvdGVjdGVkIF9hY3RpdmVEcmFnOiBNYXRDYWxlbmRhclVzZXJFdmVudDxEPiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuZXZlciB0aGVyZSBpcyBhIHN0YXRlIGNoYW5nZSB0aGF0IHRoZSBoZWFkZXIgbWF5IG5lZWQgdG8gcmVzcG9uZCB0by5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgX2ludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIHByaXZhdGUgX2RhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cyxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ01BVF9EQVRFX0ZPUk1BVFMnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9pbnRsQ2hhbmdlcyA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIF9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jYWxlbmRhckhlYWRlclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwodGhpcy5oZWFkZXJDb21wb25lbnQgfHwgTWF0Q2FsZW5kYXJIZWFkZXIpO1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuc3RhcnRBdCB8fCB0aGlzLl9kYXRlQWRhcHRlci50b2RheSgpO1xuXG4gICAgLy8gQXNzaWduIHRvIHRoZSBwcml2YXRlIHByb3BlcnR5IHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gbW92ZSBmb2N1cyBvbiBpbml0LlxuICAgIHRoaXMuX2N1cnJlbnRWaWV3ID0gdGhpcy5zdGFydFZpZXc7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuX21vdmVGb2N1c09uTmV4dFRpY2spIHtcbiAgICAgIHRoaXMuX21vdmVGb2N1c09uTmV4dFRpY2sgPSBmYWxzZTtcbiAgICAgIHRoaXMuZm9jdXNBY3RpdmVDZWxsKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5faW50bENoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIElnbm9yZSBkYXRlIGNoYW5nZXMgdGhhdCBhcmUgYXQgYSBkaWZmZXJlbnQgdGltZSBvbiB0aGUgc2FtZSBkYXkuIFRoaXMgZml4ZXMgaXNzdWVzIHdoZXJlXG4gICAgLy8gdGhlIGNhbGVuZGFyIHJlLXJlbmRlcnMgd2hlbiB0aGVyZSBpcyBubyBtZWFuaW5nZnVsIGNoYW5nZSB0byBbbWluRGF0ZV0gb3IgW21heERhdGVdXG4gICAgLy8gKCMyNDQzNSkuXG4gICAgY29uc3QgbWluRGF0ZUNoYW5nZTogU2ltcGxlQ2hhbmdlIHwgdW5kZWZpbmVkID1cbiAgICAgIGNoYW5nZXNbJ21pbkRhdGUnXSAmJlxuICAgICAgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKGNoYW5nZXNbJ21pbkRhdGUnXS5wcmV2aW91c1ZhbHVlLCBjaGFuZ2VzWydtaW5EYXRlJ10uY3VycmVudFZhbHVlKVxuICAgICAgICA/IGNoYW5nZXNbJ21pbkRhdGUnXVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtYXhEYXRlQ2hhbmdlOiBTaW1wbGVDaGFuZ2UgfCB1bmRlZmluZWQgPVxuICAgICAgY2hhbmdlc1snbWF4RGF0ZSddICYmXG4gICAgICAhdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUoY2hhbmdlc1snbWF4RGF0ZSddLnByZXZpb3VzVmFsdWUsIGNoYW5nZXNbJ21heERhdGUnXS5jdXJyZW50VmFsdWUpXG4gICAgICAgID8gY2hhbmdlc1snbWF4RGF0ZSddXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgY2hhbmdlID0gbWluRGF0ZUNoYW5nZSB8fCBtYXhEYXRlQ2hhbmdlIHx8IGNoYW5nZXNbJ2RhdGVGaWx0ZXInXTtcblxuICAgIGlmIChjaGFuZ2UgJiYgIWNoYW5nZS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCk7XG5cbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gYGRldGVjdENoYW5nZXNgIG1hbnVhbGx5IGhlcmUsIGJlY2F1c2UgdGhlIGBtaW5EYXRlYCwgYG1heERhdGVgIGV0Yy4gYXJlXG4gICAgICAgIC8vIHBhc3NlZCBkb3duIHRvIHRoZSB2aWV3IHZpYSBkYXRhIGJpbmRpbmdzIHdoaWNoIHdvbid0IGJlIHVwLXRvLWRhdGUgd2hlbiB3ZSBjYWxsIGBfaW5pdGAuXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdmlldy5faW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhY3RpdmUgZGF0ZS4gKi9cbiAgZm9jdXNBY3RpdmVDZWxsKCkge1xuICAgIHRoaXMuX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCkuX2ZvY3VzQWN0aXZlQ2VsbChmYWxzZSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0b2RheSdzIGRhdGUgYWZ0ZXIgYW4gdXBkYXRlIG9mIHRoZSBhY3RpdmUgZGF0ZSAqL1xuICB1cGRhdGVUb2RheXNEYXRlKCkge1xuICAgIHRoaXMuX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCkuX2luaXQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGRhdGUgc2VsZWN0aW9uIGluIHRoZSBtb250aCB2aWV3LiAqL1xuICBfZGF0ZVNlbGVjdGVkKGV2ZW50OiBNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4pOiB2b2lkIHtcbiAgICBjb25zdCBkYXRlID0gZXZlbnQudmFsdWU7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGVkIGluc3RhbmNlb2YgRGF0ZVJhbmdlIHx8XG4gICAgICAoZGF0ZSAmJiAhdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUoZGF0ZSwgdGhpcy5zZWxlY3RlZCkpXG4gICAgKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoZGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXNlclNlbGVjdGlvbi5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHllYXIgc2VsZWN0aW9uIGluIHRoZSBtdWx0aXllYXIgdmlldy4gKi9cbiAgX3llYXJTZWxlY3RlZEluTXVsdGlZZWFyVmlldyhub3JtYWxpemVkWWVhcjogRCkge1xuICAgIHRoaXMueWVhclNlbGVjdGVkLmVtaXQobm9ybWFsaXplZFllYXIpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgbW9udGggc2VsZWN0aW9uIGluIHRoZSB5ZWFyIHZpZXcuICovXG4gIF9tb250aFNlbGVjdGVkSW5ZZWFyVmlldyhub3JtYWxpemVkTW9udGg6IEQpIHtcbiAgICB0aGlzLm1vbnRoU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkTW9udGgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgeWVhci9tb250aCBzZWxlY3Rpb24gaW4gdGhlIG11bHRpLXllYXIveWVhciB2aWV3cy4gKi9cbiAgX2dvVG9EYXRlSW5WaWV3KGRhdGU6IEQsIHZpZXc6ICdtb250aCcgfCAneWVhcicgfCAnbXVsdGkteWVhcicpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZURhdGUgPSBkYXRlO1xuICAgIHRoaXMuY3VycmVudFZpZXcgPSB2aWV3O1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmFnZ2luZyB0byBjaGFuZ2UgYSBkYXRlIHJhbmdlLiAqL1xuICBfZHJhZ1N0YXJ0ZWQoZXZlbnQ6IE1hdENhbGVuZGFyVXNlckV2ZW50PEQ+KSB7XG4gICAgdGhpcy5fYWN0aXZlRHJhZyA9IGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgZHJhZyBjb21wbGV0ZXMuIEl0IG1heSBlbmQgaW4gY2FuY2VsYXRpb24gb3IgaW4gdGhlIHNlbGVjdGlvblxuICAgKiBvZiBhIG5ldyByYW5nZS5cbiAgICovXG4gIF9kcmFnRW5kZWQoZXZlbnQ6IE1hdENhbGVuZGFyVXNlckV2ZW50PERhdGVSYW5nZTxEPiB8IG51bGw+KSB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmVEcmFnKSByZXR1cm47XG5cbiAgICBpZiAoZXZlbnQudmFsdWUpIHtcbiAgICAgIHRoaXMuX3VzZXJEcmFnRHJvcC5lbWl0KGV2ZW50IGFzIE1hdENhbGVuZGFyVXNlckV2ZW50PERhdGVSYW5nZTxEPj4pO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZURyYWcgPSBudWxsO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGNvbXBvbmVudCBpbnN0YW5jZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBjdXJyZW50IGNhbGVuZGFyIHZpZXcuICovXG4gIHByaXZhdGUgX2dldEN1cnJlbnRWaWV3Q29tcG9uZW50KCk6IE1hdE1vbnRoVmlldzxEPiB8IE1hdFllYXJWaWV3PEQ+IHwgTWF0TXVsdGlZZWFyVmlldzxEPiB7XG4gICAgLy8gVGhlIHJldHVybiB0eXBlIGlzIGV4cGxpY2l0bHkgd3JpdHRlbiBhcyBhIHVuaW9uIHRvIGVuc3VyZSB0aGF0IHRoZSBDbG9zdXJlIGNvbXBpbGVyIGRvZXNcbiAgICAvLyBub3Qgb3B0aW1pemUgY2FsbHMgdG8gX2luaXQoKS4gV2l0aG91dCB0aGUgZXhwbGljaXQgcmV0dXJuIHR5cGUsIFR5cGVTY3JpcHQgbmFycm93cyBpdCB0b1xuICAgIC8vIG9ubHkgdGhlIGZpcnN0IGNvbXBvbmVudCB0eXBlLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjI5OTYuXG4gICAgcmV0dXJuIHRoaXMubW9udGhWaWV3IHx8IHRoaXMueWVhclZpZXcgfHwgdGhpcy5tdWx0aVllYXJWaWV3O1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibWF0LWNhbGVuZGFyLWhlYWRlclwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LWNhbGVuZGFyLWNvbnRyb2xzXCI+XG4gICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm1hdC1jYWxlbmRhci1wZXJpb2QtYnV0dG9uXCJcbiAgICAgICAgICAgIChjbGljayk9XCJjdXJyZW50UGVyaW9kQ2xpY2tlZCgpXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJwZXJpb2RCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cIl9wZXJpb2RCdXR0b25MYWJlbElkXCIgYXJpYS1saXZlPVwicG9saXRlXCI+XG4gICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj57e3BlcmlvZEJ1dHRvblRleHR9fTwvc3Bhbj5cbiAgICAgIDxzdmcgY2xhc3M9XCJtYXQtY2FsZW5kYXItYXJyb3dcIiBbY2xhc3MubWF0LWNhbGVuZGFyLWludmVydF09XCJjYWxlbmRhci5jdXJyZW50VmlldyAhPT0gJ21vbnRoJ1wiXG4gICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAgNVwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjAsMCA1LDUgMTAsMFwiLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGRpdiBjbGFzcz1cIm1hdC1jYWxlbmRhci1zcGFjZXJcIj48L2Rpdj5cblxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cblxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm1hdC1jYWxlbmRhci1wcmV2aW91cy1idXR0b25cIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cIiFwcmV2aW91c0VuYWJsZWQoKVwiIChjbGljayk9XCJwcmV2aW91c0NsaWNrZWQoKVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInByZXZCdXR0b25MYWJlbFwiPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibWF0LWNhbGVuZGFyLW5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCIhbmV4dEVuYWJsZWQoKVwiIChjbGljayk9XCJuZXh0Q2xpY2tlZCgpXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwibmV4dEJ1dHRvbkxhYmVsXCI+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC9kaXY+XG48bGFiZWwgW2lkXT1cIl9wZXJpb2RCdXR0b25MYWJlbElkXCIgY2xhc3M9XCJtYXQtY2FsZW5kYXItaGlkZGVuLWxhYmVsXCI+e3twZXJpb2RCdXR0b25EZXNjcmlwdGlvbn19PC9sYWJlbD5cbiIsIjxuZy10ZW1wbGF0ZSBbY2RrUG9ydGFsT3V0bGV0XT1cIl9jYWxlbmRhckhlYWRlclBvcnRhbFwiPjwvbmctdGVtcGxhdGU+XG5cbjxkaXYgY2xhc3M9XCJtYXQtY2FsZW5kYXItY29udGVudFwiIFtuZ1N3aXRjaF09XCJjdXJyZW50Vmlld1wiIGNka01vbml0b3JTdWJ0cmVlRm9jdXMgdGFiaW5kZXg9XCItMVwiPlxuICA8bWF0LW1vbnRoLXZpZXdcbiAgICAgICpuZ1N3aXRjaENhc2U9XCInbW9udGgnXCJcbiAgICAgIFsoYWN0aXZlRGF0ZSldPVwiYWN0aXZlRGF0ZVwiXG4gICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICAgIFttaW5EYXRlXT1cIm1pbkRhdGVcIlxuICAgICAgW2RhdGVDbGFzc109XCJkYXRlQ2xhc3NcIlxuICAgICAgW2NvbXBhcmlzb25TdGFydF09XCJjb21wYXJpc29uU3RhcnRcIlxuICAgICAgW2NvbXBhcmlzb25FbmRdPVwiY29tcGFyaXNvbkVuZFwiXG4gICAgICBbc3RhcnREYXRlQWNjZXNzaWJsZU5hbWVdPVwic3RhcnREYXRlQWNjZXNzaWJsZU5hbWVcIlxuICAgICAgW2VuZERhdGVBY2Nlc3NpYmxlTmFtZV09XCJlbmREYXRlQWNjZXNzaWJsZU5hbWVcIlxuICAgICAgKF91c2VyU2VsZWN0aW9uKT1cIl9kYXRlU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAoZHJhZ1N0YXJ0ZWQpPVwiX2RyYWdTdGFydGVkKCRldmVudClcIlxuICAgICAgKGRyYWdFbmRlZCk9XCJfZHJhZ0VuZGVkKCRldmVudClcIlxuICAgICAgW2FjdGl2ZURyYWddPVwiX2FjdGl2ZURyYWdcIlxuICAgICAgPlxuICA8L21hdC1tb250aC12aWV3PlxuXG4gIDxtYXQteWVhci12aWV3XG4gICAgICAqbmdTd2l0Y2hDYXNlPVwiJ3llYXInXCJcbiAgICAgIFsoYWN0aXZlRGF0ZSldPVwiYWN0aXZlRGF0ZVwiXG4gICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICAgIFttaW5EYXRlXT1cIm1pbkRhdGVcIlxuICAgICAgW2RhdGVDbGFzc109XCJkYXRlQ2xhc3NcIlxuICAgICAgKG1vbnRoU2VsZWN0ZWQpPVwiX21vbnRoU2VsZWN0ZWRJblllYXJWaWV3KCRldmVudClcIlxuICAgICAgKHNlbGVjdGVkQ2hhbmdlKT1cIl9nb1RvRGF0ZUluVmlldygkZXZlbnQsICdtb250aCcpXCI+XG4gIDwvbWF0LXllYXItdmlldz5cblxuICA8bWF0LW11bHRpLXllYXItdmlld1xuICAgICAgKm5nU3dpdGNoQ2FzZT1cIidtdWx0aS15ZWFyJ1wiXG4gICAgICBbKGFjdGl2ZURhdGUpXT1cImFjdGl2ZURhdGVcIlxuICAgICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICAgIFtkYXRlRmlsdGVyXT1cImRhdGVGaWx0ZXJcIlxuICAgICAgW21heERhdGVdPVwibWF4RGF0ZVwiXG4gICAgICBbbWluRGF0ZV09XCJtaW5EYXRlXCJcbiAgICAgIFtkYXRlQ2xhc3NdPVwiZGF0ZUNsYXNzXCJcbiAgICAgICh5ZWFyU2VsZWN0ZWQpPVwiX3llYXJTZWxlY3RlZEluTXVsdGlZZWFyVmlldygkZXZlbnQpXCJcbiAgICAgIChzZWxlY3RlZENoYW5nZSk9XCJfZ29Ub0RhdGVJblZpZXcoJGV2ZW50LCAneWVhcicpXCI+XG4gIDwvbWF0LW11bHRpLXllYXItdmlldz5cbjwvZGl2PlxuIl19