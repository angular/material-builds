/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/a11y'), require('@angular/cdk/overlay'), require('@angular/common'), require('@angular/core'), require('@angular/material/button'), require('@angular/material/dialog'), require('@angular/material/icon'), require('@angular/cdk/keycodes'), require('@angular/material/core'), require('rxjs/operators/first'), require('rxjs/Subject'), require('@angular/cdk/bidi'), require('@angular/cdk/coercion'), require('@angular/cdk/portal'), require('@angular/platform-browser'), require('rxjs/Subscription'), require('@angular/forms'), require('@angular/material/form-field'), require('@angular/material/input'), require('rxjs/observable/merge'), require('rxjs/observable/of')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/cdk/a11y', '@angular/cdk/overlay', '@angular/common', '@angular/core', '@angular/material/button', '@angular/material/dialog', '@angular/material/icon', '@angular/cdk/keycodes', '@angular/material/core', 'rxjs/operators/first', 'rxjs/Subject', '@angular/cdk/bidi', '@angular/cdk/coercion', '@angular/cdk/portal', '@angular/platform-browser', 'rxjs/Subscription', '@angular/forms', '@angular/material/form-field', '@angular/material/input', 'rxjs/observable/merge', 'rxjs/observable/of'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.datepicker = global.ng.material.datepicker || {}),global.ng.cdk.a11y,global.ng.cdk.overlay,global.ng.common,global.ng.core,global.ng.material.button,global.ng.material.dialog,global.ng.material.icon,global.ng.cdk.keycodes,global.ng.material.core,global.Rx.Observable,global.Rx,global.ng.cdk.bidi,global.ng.cdk.coercion,global.ng.cdk.portal,global.ng.platformBrowser,global.Rx,global.ng.forms,global.ng.material.formField,global.ng.material.input,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,_angular_cdk_a11y,_angular_cdk_overlay,_angular_common,_angular_core,_angular_material_button,_angular_material_dialog,_angular_material_icon,_angular_cdk_keycodes,_angular_material_core,rxjs_operators_first,rxjs_Subject,_angular_cdk_bidi,_angular_cdk_coercion,_angular_cdk_portal,_angular_platformBrowser,rxjs_Subscription,_angular_forms,_angular_material_formField,_angular_material_input,rxjs_observable_merge,rxjs_observable_of) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * \@docs-private
 * @param {?} provider
 * @return {?}
 */
function createMissingDateImplError(provider) {
    return Error("MatDatepicker: No provider found for " + provider + ". You must import one of the following " +
        "modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a " +
        "custom implementation.");
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Datepicker data that requires internationalization.
 */
var MatDatepickerIntl = /** @class */ (function () {
    function MatDatepickerIntl() {
    }
    return MatDatepickerIntl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * \@docs-private
 */
var MatCalendarCell = /** @class */ (function () {
    function MatCalendarCell(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
    return MatCalendarCell;
}());
/**
 * An internal component used to display calendar data in a table.
 * \@docs-private
 */
var MatCalendarBody = /** @class */ (function () {
    function MatCalendarBody() {
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    MatCalendarBody.prototype._cellClicked = /**
     * @param {?} cell
     * @return {?}
     */
    function (cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    };
    Object.defineProperty(MatCalendarBody.prototype, "_firstRowOffset", {
        /** The number of blank cells to put at the beginning for the first row. */
        get: /**
         * The number of blank cells to put at the beginning for the first row.
         * @return {?}
         */
        function () {
            return this.rows && this.rows.length && this.rows[0].length ?
                this.numCols - this.rows[0].length : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    MatCalendarBody.prototype._isActiveCell = /**
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    function (rowIndex, colIndex) {
        var /** @type {?} */ cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    return MatCalendarBody;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * \@docs-private
 */
var MatMonthView = /** @class */ (function () {
    function MatMonthView(_dateAdapter, _dateFormats, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        var /** @type {?} */ firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        var /** @type {?} */ narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        var /** @type {?} */ longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        var /** @type {?} */ weekdays = longWeekdays.map(function (long, i) {
            return { long: long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MatMonthView.prototype, "activeDate", {
        get: /**
         * The date to display in this month view (everything other than the month and year is ignored).
         * @return {?}
         */
        function () { return this._activeDate; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var /** @type {?} */ oldActiveDate = this._activeDate;
            this._activeDate =
                this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMonthView.prototype, "selected", {
        get: /**
         * The currently selected date.
         * @return {?}
         */
        function () { return this._selected; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._selectedDate = this._getDateInCurrentMonth(this._selected);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatMonthView.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this._init();
    };
    /** Handles when a new date is selected. */
    /**
     * Handles when a new date is selected.
     * @param {?} date
     * @return {?}
     */
    MatMonthView.prototype._dateSelected = /**
     * Handles when a new date is selected.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        if (this._selectedDate != date) {
            var /** @type {?} */ selectedYear = this._dateAdapter.getYear(this.activeDate);
            var /** @type {?} */ selectedMonth = this._dateAdapter.getMonth(this.activeDate);
            var /** @type {?} */ selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);
            this.selectedChange.emit(selectedDate);
        }
        this._userSelection.emit();
    };
    /** Initializes this month view. */
    /**
     * Initializes this month view.
     * @return {?}
     */
    MatMonthView.prototype._init = /**
     * Initializes this month view.
     * @return {?}
     */
    function () {
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        var /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Creates MatCalendarCells for the dates in this month.
     * @return {?}
     */
    MatMonthView.prototype._createWeekCells = /**
     * Creates MatCalendarCells for the dates in this month.
     * @return {?}
     */
    function () {
        var /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        var /** @type {?} */ dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (var /** @type {?} */ i = 0, /** @type {?} */ cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            var /** @type {?} */ date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            var /** @type {?} */ enabled = !this.dateFilter ||
                this.dateFilter(date);
            var /** @type {?} */ ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1]
                .push(new MatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    };
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     * @param {?} date
     * @return {?}
     */
    MatMonthView.prototype._getDateInCurrentMonth = /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return date && this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    };
    /**
     * Checks whether the 2 dates are non-null and fall within the same month of the same year.
     * @param {?} d1
     * @param {?} d2
     * @return {?}
     */
    MatMonthView.prototype._hasSameMonthAndYear = /**
     * Checks whether the 2 dates are non-null and fall within the same month of the same year.
     * @param {?} d1
     * @param {?} d2
     * @return {?}
     */
    function (d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    };
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    MatMonthView.prototype._getValidDateOrNull = /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatMonthView;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * An internal component used to display a single year in the datepicker.
 * \@docs-private
 */
var MatYearView = /** @class */ (function () {
    function MatYearView(_dateAdapter, _dateFormats, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MatYearView.prototype, "activeDate", {
        get: /**
         * The date to display in this year view (everything other than the year is ignored).
         * @return {?}
         */
        function () { return this._activeDate; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var /** @type {?} */ oldActiveDate = this._activeDate;
            this._activeDate =
                this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatYearView.prototype, "selected", {
        get: /**
         * The currently selected date.
         * @return {?}
         */
        function () { return this._selected; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._selectedMonth = this._getMonthInCurrentYear(this._selected);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatYearView.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this._init();
    };
    /** Handles when a new month is selected. */
    /**
     * Handles when a new month is selected.
     * @param {?} month
     * @return {?}
     */
    MatYearView.prototype._monthSelected = /**
     * Handles when a new month is selected.
     * @param {?} month
     * @return {?}
     */
    function (month) {
        var /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    };
    /** Initializes this month view. */
    /**
     * Initializes this month view.
     * @return {?}
     */
    MatYearView.prototype._init = /**
     * Initializes this month view.
     * @return {?}
     */
    function () {
        var _this = this;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        var /** @type {?} */ monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(function (row) {
            return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); });
        });
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @param {?} date
     * @return {?}
     */
    MatYearView.prototype._getMonthInCurrentYear = /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    };
    /**
     * Creates an MatCalendarCell for the given month.
     * @param {?} month
     * @param {?} monthName
     * @return {?}
     */
    MatYearView.prototype._createCellForMonth = /**
     * Creates an MatCalendarCell for the given month.
     * @param {?} month
     * @param {?} monthName
     * @return {?}
     */
    function (month, monthName) {
        var /** @type {?} */ ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MatCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    };
    /**
     * Whether the given month is enabled.
     * @param {?} month
     * @return {?}
     */
    MatYearView.prototype._isMonthEnabled = /**
     * Whether the given month is enabled.
     * @param {?} month
     * @return {?}
     */
    function (month) {
        if (!this.dateFilter) {
            return true;
        }
        var /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        // If any date in the month is enabled count the month as enabled.
        for (var /** @type {?} */ date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    MatYearView.prototype._getValidDateOrNull = /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatYearView;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * A calendar that is used as part of the datepicker.
 * \@docs-private
 */
var MatCalendar = /** @class */ (function () {
    function MatCalendar(_elementRef, _intl, _ngZone, _dateAdapter, _dateFormats, changeDetectorRef) {
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MatCalendar.prototype, "startAt", {
        get: /**
         * A date representing the period (month or year) to start the calendar in.
         * @return {?}
         */
        function () { return this._startAt; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "selected", {
        get: /**
         * The currently selected date.
         * @return {?}
         */
        function () { return this._selected; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "minDate", {
        get: /**
         * The minimum selectable date.
         * @return {?}
         */
        function () { return this._minDate; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "maxDate", {
        get: /**
         * The maximum selectable date.
         * @return {?}
         */
        function () { return this._maxDate; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_activeDate", {
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         */
        get: /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         * @return {?}
         */
        function () { return this._clampedActiveDate; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_periodButtonText", {
        /** The label for the current calendar view. */
        get: /**
         * The label for the current calendar view.
         * @return {?}
         */
        function () {
            return this._monthView ?
                this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase() :
                this._dateAdapter.getYearName(this._activeDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_periodButtonLabel", {
        get: /**
         * @return {?}
         */
        function () {
            return this._monthView ? this._intl.switchToYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_prevButtonLabel", {
        /** The label for the the previous button. */
        get: /**
         * The label for the the previous button.
         * @return {?}
         */
        function () {
            return this._monthView ? this._intl.prevMonthLabel : this._intl.prevYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_nextButtonLabel", {
        /** The label for the the next button. */
        get: /**
         * The label for the the next button.
         * @return {?}
         */
        function () {
            return this._monthView ? this._intl.nextMonthLabel : this._intl.nextYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatCalendar.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this._activeDate = this.startAt || this._dateAdapter.today();
        this._focusActiveCell();
        this._monthView = this.startView != 'year';
    };
    /**
     * @return {?}
     */
    MatCalendar.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._intlChanges.unsubscribe();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MatCalendar.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var /** @type {?} */ change = changes["minDate"] || changes["maxDate"] || changes["dateFilter"];
        if (change && !change.firstChange) {
            var /** @type {?} */ view = this.monthView || this.yearView;
            if (view) {
                view._init();
            }
        }
    };
    /** Handles date selection in the month view. */
    /**
     * Handles date selection in the month view.
     * @param {?} date
     * @return {?}
     */
    MatCalendar.prototype._dateSelected = /**
     * Handles date selection in the month view.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    };
    /**
     * @return {?}
     */
    MatCalendar.prototype._userSelected = /**
     * @return {?}
     */
    function () {
        this._userSelection.emit();
    };
    /** Handles month selection in the year view. */
    /**
     * Handles month selection in the year view.
     * @param {?} month
     * @return {?}
     */
    MatCalendar.prototype._monthSelected = /**
     * Handles month selection in the year view.
     * @param {?} month
     * @return {?}
     */
    function (month) {
        this._activeDate = month;
        this._monthView = true;
    };
    /** Handles user clicks on the period label. */
    /**
     * Handles user clicks on the period label.
     * @return {?}
     */
    MatCalendar.prototype._currentPeriodClicked = /**
     * Handles user clicks on the period label.
     * @return {?}
     */
    function () {
        this._monthView = !this._monthView;
    };
    /** Handles user clicks on the previous button. */
    /**
     * Handles user clicks on the previous button.
     * @return {?}
     */
    MatCalendar.prototype._previousClicked = /**
     * Handles user clicks on the previous button.
     * @return {?}
     */
    function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, -1);
    };
    /** Handles user clicks on the next button. */
    /**
     * Handles user clicks on the next button.
     * @return {?}
     */
    MatCalendar.prototype._nextClicked = /**
     * Handles user clicks on the next button.
     * @return {?}
     */
    function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, 1);
    };
    /** Whether the previous period button is enabled. */
    /**
     * Whether the previous period button is enabled.
     * @return {?}
     */
    MatCalendar.prototype._previousEnabled = /**
     * Whether the previous period button is enabled.
     * @return {?}
     */
    function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    };
    /** Whether the next period button is enabled. */
    /**
     * Whether the next period button is enabled.
     * @return {?}
     */
    MatCalendar.prototype._nextEnabled = /**
     * Whether the next period button is enabled.
     * @return {?}
     */
    function () {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    };
    /** Handles keydown events on the calendar body. */
    /**
     * Handles keydown events on the calendar body.
     * @param {?} event
     * @return {?}
     */
    MatCalendar.prototype._handleCalendarBodyKeydown = /**
     * Handles keydown events on the calendar body.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this._monthView) {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else {
            this._handleCalendarBodyKeydownInYearView(event);
        }
    };
    /** Focuses the active cell after the microtask queue is empty. */
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    MatCalendar.prototype._focusActiveCell = /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._ngZone.onStable.asObservable().pipe(rxjs_operators_first.first()).subscribe(function () {
                _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active').focus();
            });
        });
    };
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
    MatCalendar.prototype._isSameView = /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
    function (date1, date2) {
        return this._monthView ?
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2) :
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
    };
    /**
     * Handles keydown events on the calendar body when calendar is in month view.
     * @param {?} event
     * @return {?}
     */
    MatCalendar.prototype._handleCalendarBodyKeydownInMonthView = /**
     * Handles keydown events on the calendar body when calendar is in month view.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        switch (event.keyCode) {
            case _angular_cdk_keycodes.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case _angular_cdk_keycodes.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case _angular_cdk_keycodes.UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case _angular_cdk_keycodes.DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case _angular_cdk_keycodes.HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case _angular_cdk_keycodes.END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case _angular_cdk_keycodes.PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case _angular_cdk_keycodes.PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case _angular_cdk_keycodes.ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Handles keydown events on the calendar body when calendar is in year view.
     * @param {?} event
     * @return {?}
     */
    MatCalendar.prototype._handleCalendarBodyKeydownInYearView = /**
     * Handles keydown events on the calendar body when calendar is in year view.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        switch (event.keyCode) {
            case _angular_cdk_keycodes.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case _angular_cdk_keycodes.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case _angular_cdk_keycodes.UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case _angular_cdk_keycodes.DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case _angular_cdk_keycodes.HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case _angular_cdk_keycodes.END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case _angular_cdk_keycodes.PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case _angular_cdk_keycodes.PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case _angular_cdk_keycodes.ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    MatCalendar.prototype._prevMonthInSameCol = /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var /** @type {?} */ increment = this._dateAdapter.getMonth(date) <= 4 ? -5 :
            (this._dateAdapter.getMonth(date) >= 7 ? -7 : -12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    MatCalendar.prototype._nextMonthInSameCol = /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var /** @type {?} */ increment = this._dateAdapter.getMonth(date) <= 4 ? 7 :
            (this._dateAdapter.getMonth(date) >= 7 ? 5 : 12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    MatCalendar.prototype._getValidDateOrNull = /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatCalendar;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Injection token that determines the scroll handling while the calendar is open.
 */
var MAT_DATEPICKER_SCROLL_STRATEGY = new _angular_core.InjectionToken('mat-datepicker-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [_angular_cdk_overlay.Overlay],
    useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * \@docs-private
 */
var MatDatepickerContent = /** @class */ (function () {
    function MatDatepickerContent() {
    }
    /**
     * @return {?}
     */
    MatDatepickerContent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this._calendar._focusActiveCell();
    };
    /**
     * Handles keydown event on datepicker content.
     * @param event The event.
     */
    /**
     * Handles keydown event on datepicker content.
     * @param {?} event The event.
     * @return {?}
     */
    MatDatepickerContent.prototype._handleKeydown = /**
     * Handles keydown event on datepicker content.
     * @param {?} event The event.
     * @return {?}
     */
    function (event) {
        if (event.keyCode === _angular_cdk_keycodes.ESCAPE) {
            this.datepicker.close();
            event.preventDefault();
            event.stopPropagation();
        }
    };
    return MatDatepickerContent;
}());
/**
 * Component responsible for managing the datepicker popup/dialog.
 */
var MatDatepicker = /** @class */ (function () {
    function MatDatepicker(_dialog, _overlay, _ngZone, _viewContainerRef, _scrollStrategy, _dateAdapter, _dir, _document) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    Object.defineProperty(MatDatepicker.prototype, "startAt", {
        get: /**
         * The date to open the calendar to initially.
         * @return {?}
         */
        function () {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
        },
        set: /**
         * @param {?} date
         * @return {?}
         */
        function (date) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "touchUi", {
        get: /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         * @return {?}
         */
        function () {
            return this._touchUi;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._touchUi = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "disabled", {
        get: /**
         * Whether the datepicker pop-up should be disabled.
         * @return {?}
         */
        function () {
            return this._disabled === undefined && this._datepickerInput ?
                this._datepickerInput.disabled : !!this._disabled;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var /** @type {?} */ newValue = _angular_cdk_coercion.coerceBooleanProperty(value);
            if (newValue !== this._disabled) {
                this._disabled = newValue;
                this._disabledChange.next(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_selected", {
        /** The currently selected date. */
        get: /**
         * The currently selected date.
         * @return {?}
         */
        function () { return this._validSelected; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._validSelected = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_minDate", {
        /** The minimum selectable date. */
        get: /**
         * The minimum selectable date.
         * @return {?}
         */
        function () {
            return this._datepickerInput && this._datepickerInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_maxDate", {
        /** The maximum selectable date. */
        get: /**
         * The maximum selectable date.
         * @return {?}
         */
        function () {
            return this._datepickerInput && this._datepickerInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_dateFilter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._datepickerInput && this._datepickerInput._dateFilter;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatDatepicker.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.close();
        this._inputSubscription.unsubscribe();
        this._disabledChange.complete();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
    };
    /** Selects the given date */
    /**
     * Selects the given date
     * @param {?} date
     * @return {?}
     */
    MatDatepicker.prototype._select = /**
     * Selects the given date
     * @param {?} date
     * @return {?}
     */
    function (date) {
        var /** @type {?} */ oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
    };
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     */
    /**
     * Register an input with this datepicker.
     * @param {?} input The datepicker input to register with this datepicker.
     * @return {?}
     */
    MatDatepicker.prototype._registerInput = /**
     * Register an input with this datepicker.
     * @param {?} input The datepicker input to register with this datepicker.
     * @return {?}
     */
    function (input) {
        var _this = this;
        if (this._datepickerInput) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input;
        this._inputSubscription =
            this._datepickerInput._valueChange.subscribe(function (value) { return _this._selected = value; });
    };
    /** Open the calendar. */
    /**
     * Open the calendar.
     * @return {?}
     */
    MatDatepicker.prototype.open = /**
     * Open the calendar.
     * @return {?}
     */
    function () {
        if (this.opened || this.disabled) {
            return;
        }
        if (!this._datepickerInput) {
            throw Error('Attempted to open an MatDatepicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this.opened = true;
        this.openedStream.emit();
    };
    /** Close the calendar. */
    /**
     * Close the calendar.
     * @return {?}
     */
    MatDatepicker.prototype.close = /**
     * Close the calendar.
     * @return {?}
     */
    function () {
        if (!this.opened) {
            return;
        }
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        if (this._dialogRef) {
            this._dialogRef.close();
            this._dialogRef = null;
        }
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
        if (this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            this._focusedElementBeforeOpen.focus();
            this._focusedElementBeforeOpen = null;
        }
        this.opened = false;
        this.closedStream.emit();
    };
    /**
     * Open the calendar as a dialog.
     * @return {?}
     */
    MatDatepicker.prototype._openAsDialog = /**
     * Open the calendar as a dialog.
     * @return {?}
     */
    function () {
        var _this = this;
        this._dialogRef = this._dialog.open(MatDatepickerContent, {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
            panelClass: 'mat-datepicker-dialog',
        });
        this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
        this._dialogRef.componentInstance.datepicker = this;
    };
    /**
     * Open the calendar as a popup.
     * @return {?}
     */
    MatDatepicker.prototype._openAsPopup = /**
     * Open the calendar as a popup.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new _angular_cdk_portal.ComponentPortal(MatDatepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            var /** @type {?} */ componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datepicker = this;
            // Update the position once the calendar has rendered.
            this._ngZone.onStable.asObservable().pipe(rxjs_operators_first.first()).subscribe(function () {
                _this._popupRef.updatePosition();
            });
        }
        this._popupRef.backdropClick().subscribe(function () { return _this.close(); });
    };
    /**
     * Create the popup.
     * @return {?}
     */
    MatDatepicker.prototype._createPopup = /**
     * Create the popup.
     * @return {?}
     */
    function () {
        var /** @type {?} */ overlayConfig = new _angular_cdk_overlay.OverlayConfig({
            positionStrategy: this._createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: 'mat-overlay-transparent-backdrop',
            direction: this._dir ? this._dir.value : 'ltr',
            scrollStrategy: this._scrollStrategy(),
            panelClass: 'mat-datepicker-popup',
        });
        this._popupRef = this._overlay.create(overlayConfig);
    };
    /**
     * Create the popup PositionStrategy.
     * @return {?}
     */
    MatDatepicker.prototype._createPopupPositionStrategy = /**
     * Create the popup PositionStrategy.
     * @return {?}
     */
    function () {
        return this._overlay.position()
            .connectedTo(this._datepickerInput.getPopupConnectionElementRef(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' });
    };
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    MatDatepicker.prototype._getValidDateOrNull = /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatDatepicker;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MatDatepickerInput; }),
    multi: true
};
var MAT_DATEPICKER_VALIDATORS = {
    provide: _angular_forms.NG_VALIDATORS,
    useExisting: _angular_core.forwardRef(function () { return MatDatepickerInput; }),
    multi: true
};
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
var MatDatepickerInputEvent = /** @class */ (function () {
    function MatDatepickerInputEvent(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
    return MatDatepickerInputEvent;
}());
/**
 * Directive used to connect an input to a MatDatepicker.
 */
var MatDatepickerInput = /** @class */ (function () {
    function MatDatepickerInput(_elementRef, _renderer, _dateAdapter, _dateFormats, _formField) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._formField = _formField;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(function () {
            _this.value = _this.value;
        });
    }
    Object.defineProperty(MatDatepickerInput.prototype, "matDatepicker", {
        set: /**
         * The datepicker that this input is associated with.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.registerDatepicker(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} value
     * @return {?}
     */
    MatDatepickerInput.prototype.registerDatepicker = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value) {
            this._datepicker = value;
            this._datepicker._registerInput(this);
        }
    };
    Object.defineProperty(MatDatepickerInput.prototype, "matDatepickerFilter", {
        set: /**
         * @param {?} filter
         * @return {?}
         */
        function (filter) {
            this._dateFilter = filter;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "value", {
        get: /**
         * The value of the input.
         * @return {?}
         */
        function () {
            return this._value;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            value = this._dateAdapter.deserialize(value);
            this._lastValueValid = !value || this._dateAdapter.isValid(value);
            value = this._getValidDateOrNull(value);
            var /** @type {?} */ oldDate = this.value;
            this._value = value;
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '');
            if (!this._dateAdapter.sameDate(oldDate, value)) {
                this._valueChange.emit(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "min", {
        get: /**
         * The minimum valid date.
         * @return {?}
         */
        function () { return this._min; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "max", {
        get: /**
         * The maximum valid date.
         * @return {?}
         */
        function () { return this._max; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "disabled", {
        get: /**
         * Whether the datepicker-input is disabled.
         * @return {?}
         */
        function () { return !!this._disabled; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var /** @type {?} */ newValue = _angular_cdk_coercion.coerceBooleanProperty(value);
            if (this._disabled !== newValue) {
                this._disabled = newValue;
                this._disabledChange.emit(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatDatepickerInput.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._datepicker) {
            this._datepickerSubscription =
                this._datepicker.selectedChanged.subscribe(function (selected) {
                    _this.value = selected;
                    _this._cvaOnChange(selected);
                    _this._onTouched();
                    _this.dateInput.emit(new MatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                    _this.dateChange.emit(new MatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                });
        }
    };
    /**
     * @return {?}
     */
    MatDatepickerInput.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._datepickerSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MatDatepickerInput.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this._validatorOnChange = fn;
    };
    /**
     * @param {?} c
     * @return {?}
     */
    MatDatepickerInput.prototype.validate = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        return this._validator ? this._validator(c) : null;
    };
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return {?} The element to connect the popup to.
     */
    MatDatepickerInput.prototype.getPopupConnectionElementRef = /**
     * Gets the element that the datepicker popup should be connected to.
     * @return {?} The element to connect the popup to.
     */
    function () {
        return this._formField ? this._formField.underlineRef : this._elementRef;
    };
    // Implemented as part of ControlValueAccessor
    /**
     * @param {?} value
     * @return {?}
     */
    MatDatepickerInput.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.value = value;
    };
    // Implemented as part of ControlValueAccessor
    /**
     * @param {?} fn
     * @return {?}
     */
    MatDatepickerInput.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this._cvaOnChange = fn;
    };
    // Implemented as part of ControlValueAccessor
    /**
     * @param {?} fn
     * @return {?}
     */
    MatDatepickerInput.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this._onTouched = fn;
    };
    // Implemented as part of ControlValueAccessor
    /**
     * @param {?} disabled
     * @return {?}
     */
    MatDatepickerInput.prototype.setDisabledState = /**
     * @param {?} disabled
     * @return {?}
     */
    function (disabled) {
        this.disabled = disabled;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatDatepickerInput.prototype._onKeydown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.altKey && event.keyCode === _angular_cdk_keycodes.DOWN_ARROW) {
            this._datepicker.open();
            event.preventDefault();
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MatDatepickerInput.prototype._onInput = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var /** @type {?} */ date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._getValidDateOrNull(date);
        this._value = date;
        this._cvaOnChange(date);
        this._valueChange.emit(date);
        this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    };
    /**
     * @return {?}
     */
    MatDatepickerInput.prototype._onChange = /**
     * @return {?}
     */
    function () {
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    };
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    MatDatepickerInput.prototype._getValidDateOrNull = /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatDatepickerInput;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatDatepickerToggle = /** @class */ (function () {
    function MatDatepickerToggle(_intl, _changeDetectorRef) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
    }
    Object.defineProperty(MatDatepickerToggle.prototype, "disabled", {
        get: /**
         * Whether the toggle button is disabled.
         * @return {?}
         */
        function () {
            return this._disabled === undefined ? this.datepicker.disabled : !!this._disabled;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._disabled = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MatDatepickerToggle.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes["datepicker"]) {
            this._watchStateChanges();
        }
    };
    /**
     * @return {?}
     */
    MatDatepickerToggle.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._stateChanges.unsubscribe();
    };
    /**
     * @return {?}
     */
    MatDatepickerToggle.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this._watchStateChanges();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatDatepickerToggle.prototype._open = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    };
    /**
     * @return {?}
     */
    MatDatepickerToggle.prototype._watchStateChanges = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : rxjs_observable_of.of();
        var /** @type {?} */ inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
            this.datepicker._datepickerInput._disabledChange : rxjs_observable_of.of();
        this._stateChanges.unsubscribe();
        this._stateChanges = rxjs_observable_merge.merge(this._intl.changes, datepickerDisabled, inputDisabled)
            .subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
    };
    return MatDatepickerToggle;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatDatepickerModule = /** @class */ (function () {
    function MatDatepickerModule() {
    }
    return MatDatepickerModule;
}());

exports.MatDatepickerModule = MatDatepickerModule;
exports.MatCalendar = MatCalendar;
exports.MatCalendarCell = MatCalendarCell;
exports.MatCalendarBody = MatCalendarBody;
exports.MAT_DATEPICKER_SCROLL_STRATEGY = MAT_DATEPICKER_SCROLL_STRATEGY;
exports.MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY = MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY;
exports.MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER = MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER;
exports.MatDatepickerContent = MatDatepickerContent;
exports.MatDatepicker = MatDatepicker;
exports.MAT_DATEPICKER_VALUE_ACCESSOR = MAT_DATEPICKER_VALUE_ACCESSOR;
exports.MAT_DATEPICKER_VALIDATORS = MAT_DATEPICKER_VALIDATORS;
exports.MatDatepickerInputEvent = MatDatepickerInputEvent;
exports.MatDatepickerInput = MatDatepickerInput;
exports.MatDatepickerIntl = MatDatepickerIntl;
exports.MatDatepickerToggle = MatDatepickerToggle;
exports.MatMonthView = MatMonthView;
exports.MatYearView = MatYearView;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-datepicker.umd.js.map
