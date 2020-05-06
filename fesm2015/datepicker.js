import { A11yModule } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, NgZone, Input, Output, Directive, Optional, SkipSelf, InjectionToken, ChangeDetectorRef, Inject, ViewChild, forwardRef, ViewContainerRef, Attribute, ContentChild, InjectFlags, Injector, Self, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { DateAdapter, MAT_DATE_FORMATS, mixinColor, ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import { Subject, Subscription, merge, of } from 'rxjs';
import { ESCAPE, SPACE, ENTER, PAGE_DOWN, PAGE_UP, END, HOME, DOWN_ARROW, UP_ARROW, RIGHT_ARROW, LEFT_ARROW, BACKSPACE } from '@angular/cdk/keycodes';
import { Directionality } from '@angular/cdk/bidi';
import { take, startWith, filter } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, NgControl, NgForm, FormGroupDirective, ControlContainer } from '@angular/forms';
import { MatFormField, MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-errors.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@docs-private
 * @param {?} provider
 * @return {?}
 */
function createMissingDateImplError(provider) {
    return Error(`MatDatepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a ` +
        `custom implementation.`);
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-intl.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Datepicker data that requires internationalization.
 */
class MatDatepickerIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * A label for the calendar popup (used by screen readers).
         */
        this.calendarLabel = 'Calendar';
        /**
         * A label for the button used to open the calendar popup (used by screen readers).
         */
        this.openCalendarLabel = 'Open calendar';
        /**
         * A label for the previous month button (used by screen readers).
         */
        this.prevMonthLabel = 'Previous month';
        /**
         * A label for the next month button (used by screen readers).
         */
        this.nextMonthLabel = 'Next month';
        /**
         * A label for the previous year button (used by screen readers).
         */
        this.prevYearLabel = 'Previous year';
        /**
         * A label for the next year button (used by screen readers).
         */
        this.nextYearLabel = 'Next year';
        /**
         * A label for the previous multi-year button (used by screen readers).
         */
        this.prevMultiYearLabel = 'Previous 20 years';
        /**
         * A label for the next multi-year button (used by screen readers).
         */
        this.nextMultiYearLabel = 'Next 20 years';
        /**
         * A label for the 'switch to month view' button (used by screen readers).
         */
        this.switchToMonthViewLabel = 'Choose date';
        /**
         * A label for the 'switch to year view' button (used by screen readers).
         */
        this.switchToMultiYearViewLabel = 'Choose month and year';
    }
    /**
     * Formats a range of years.
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    formatYearRange(start, end) {
        return `${start} \u2013 ${end}`;
    }
}
MatDatepickerIntl.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ MatDatepickerIntl.ɵprov = ɵɵdefineInjectable({ factory: function MatDatepickerIntl_Factory() { return new MatDatepickerIntl(); }, token: MatDatepickerIntl, providedIn: "root" });
if (false) {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     * @type {?}
     */
    MatDatepickerIntl.prototype.changes;
    /**
     * A label for the calendar popup (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.calendarLabel;
    /**
     * A label for the button used to open the calendar popup (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.openCalendarLabel;
    /**
     * A label for the previous month button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.prevMonthLabel;
    /**
     * A label for the next month button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.nextMonthLabel;
    /**
     * A label for the previous year button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.prevYearLabel;
    /**
     * A label for the next year button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.nextYearLabel;
    /**
     * A label for the previous multi-year button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.prevMultiYearLabel;
    /**
     * A label for the next multi-year button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.nextMultiYearLabel;
    /**
     * A label for the 'switch to month view' button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.switchToMonthViewLabel;
    /**
     * A label for the 'switch to year view' button (used by screen readers).
     * @type {?}
     */
    MatDatepickerIntl.prototype.switchToMultiYearViewLabel;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/calendar-body.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * \@docs-private
 * @template D
 */
class MatCalendarCell {
    /**
     * @param {?} value
     * @param {?} displayValue
     * @param {?} ariaLabel
     * @param {?} enabled
     * @param {?=} cssClasses
     * @param {?=} compareValue
     * @param {?=} rawValue
     */
    constructor(value, displayValue, ariaLabel, enabled, cssClasses = {}, compareValue = value, rawValue) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.cssClasses = cssClasses;
        this.compareValue = compareValue;
        this.rawValue = rawValue;
    }
}
if (false) {
    /** @type {?} */
    MatCalendarCell.prototype.value;
    /** @type {?} */
    MatCalendarCell.prototype.displayValue;
    /** @type {?} */
    MatCalendarCell.prototype.ariaLabel;
    /** @type {?} */
    MatCalendarCell.prototype.enabled;
    /** @type {?} */
    MatCalendarCell.prototype.cssClasses;
    /** @type {?} */
    MatCalendarCell.prototype.compareValue;
    /** @type {?} */
    MatCalendarCell.prototype.rawValue;
}
/**
 * Event emitted when a date inside the calendar is triggered as a result of a user action.
 * @record
 * @template D
 */
function MatCalendarUserEvent() { }
if (false) {
    /** @type {?} */
    MatCalendarUserEvent.prototype.value;
    /** @type {?} */
    MatCalendarUserEvent.prototype.event;
}
/**
 * An internal component used to display calendar data in a table.
 * \@docs-private
 */
class MatCalendarBody {
    /**
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    constructor(_elementRef, _ngZone) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /**
         * The number of columns in the table.
         */
        this.numCols = 7;
        /**
         * The cell number of the active cell in the table.
         */
        this.activeCell = 0;
        /**
         * Whether a range is being selected.
         */
        this.isRange = false;
        /**
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /**
         * Start of the preview range.
         */
        this.previewStart = null;
        /**
         * End of the preview range.
         */
        this.previewEnd = null;
        /**
         * Emits when a new value is selected.
         */
        this.selectedValueChange = new EventEmitter();
        /**
         * Emits when the preview has changed as a result of a user action.
         */
        this.previewChange = new EventEmitter();
        /**
         * Event handler for when the user enters an element
         * inside the calendar body (e.g. by hovering in or focus).
         */
        this._enterHandler = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (this._skipNextFocus && event.type === 'focus') {
                this._skipNextFocus = false;
                return;
            }
            // We only need to hit the zone when we're selecting a range.
            if (event.target && this.isRange) {
                /** @type {?} */
                const cell = this._getCellFromElement((/** @type {?} */ (event.target)));
                if (cell) {
                    this._ngZone.run((/**
                     * @return {?}
                     */
                    () => this.previewChange.emit({ value: cell.enabled ? cell : null, event })));
                }
            }
        });
        /**
         * Event handler for when the user's pointer leaves an element
         * inside the calendar body (e.g. by hovering out or blurring).
         */
        this._leaveHandler = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            // We only need to hit the zone when we're selecting a range.
            if (this.previewEnd !== null && this.isRange) {
                // Only reset the preview end value when leaving cells. This looks better, because
                // we have a gap between the cells and the rows and we don't want to remove the
                // range just for it to show up again when the user moves a few pixels to the side.
                if (event.target && isTableCell((/** @type {?} */ (event.target)))) {
                    this._ngZone.run((/**
                     * @return {?}
                     */
                    () => this.previewChange.emit({ value: null, event })));
                }
            }
        });
        _ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const element = _elementRef.nativeElement;
            element.addEventListener('mouseenter', this._enterHandler, true);
            element.addEventListener('focus', this._enterHandler, true);
            element.addEventListener('mouseleave', this._leaveHandler, true);
            element.addEventListener('blur', this._leaveHandler, true);
        }));
    }
    /**
     * Called when a cell is clicked.
     * @param {?} cell
     * @param {?} event
     * @return {?}
     */
    _cellClicked(cell, event) {
        if (cell.enabled) {
            this.selectedValueChange.emit({ value: cell.value, event });
        }
    }
    /**
     * Returns whether a cell should be marked as selected.
     * @param {?} cell
     * @return {?}
     */
    _isSelected(cell) {
        return this.startValue === cell.compareValue || this.endValue === cell.compareValue;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const columnChanges = changes['numCols'];
        const { rows, numCols } = this;
        if (changes['rows'] || columnChanges) {
            this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
        }
        if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
            this._cellPadding = `${50 * this.cellAspectRatio / numCols}%`;
        }
        if (columnChanges || !this._cellWidth) {
            this._cellWidth = `${100 / numCols}%`;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        element.removeEventListener('mouseenter', this._enterHandler, true);
        element.removeEventListener('focus', this._enterHandler, true);
        element.removeEventListener('mouseleave', this._leaveHandler, true);
        element.removeEventListener('blur', this._leaveHandler, true);
    }
    /**
     * Returns whether a cell is active.
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    _isActiveCell(rowIndex, colIndex) {
        /** @type {?} */
        let cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    }
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @param {?=} movePreview
     * @return {?}
     */
    _focusActiveCell(movePreview = true) {
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const activeCell = this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
                if (activeCell) {
                    if (!movePreview) {
                        this._skipNextFocus = true;
                    }
                    activeCell.focus();
                }
            }));
        }));
    }
    /**
     * Gets whether a value is the start of the main range.
     * @param {?} value
     * @return {?}
     */
    _isRangeStart(value) {
        return isStart(value, this.startValue, this.endValue);
    }
    /**
     * Gets whether a value is the end of the main range.
     * @param {?} value
     * @return {?}
     */
    _isRangeEnd(value) {
        return isEnd(value, this.startValue, this.endValue);
    }
    /**
     * Gets whether a value is within the currently-selected range.
     * @param {?} value
     * @return {?}
     */
    _isInRange(value) {
        return isInRange(value, this.startValue, this.endValue, this.isRange);
    }
    /**
     * Gets whether a value is the start of the comparison range.
     * @param {?} value
     * @return {?}
     */
    _isComparisonStart(value) {
        return isStart(value, this.comparisonStart, this.comparisonEnd);
    }
    /**
     * Whether the cell is a start bridge cell between the main and comparison ranges.
     * @param {?} value
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    _isComparisonBridgeStart(value, rowIndex, colIndex) {
        if (!this._isComparisonStart(value) || this._isRangeStart(value) || !this._isInRange(value)) {
            return false;
        }
        /** @type {?} */
        let previousCell = this.rows[rowIndex][colIndex - 1];
        if (!previousCell) {
            /** @type {?} */
            const previousRow = this.rows[rowIndex - 1];
            previousCell = previousRow && previousRow[previousRow.length - 1];
        }
        return previousCell && !this._isRangeEnd(previousCell.compareValue);
    }
    /**
     * Whether the cell is an end bridge cell between the main and comparison ranges.
     * @param {?} value
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    _isComparisonBridgeEnd(value, rowIndex, colIndex) {
        if (!this._isComparisonEnd(value) || this._isRangeEnd(value) || !this._isInRange(value)) {
            return false;
        }
        /** @type {?} */
        let nextCell = this.rows[rowIndex][colIndex + 1];
        if (!nextCell) {
            /** @type {?} */
            const nextRow = this.rows[rowIndex + 1];
            nextCell = nextRow && nextRow[0];
        }
        return nextCell && !this._isRangeStart(nextCell.compareValue);
    }
    /**
     * Gets whether a value is the end of the comparison range.
     * @param {?} value
     * @return {?}
     */
    _isComparisonEnd(value) {
        return isEnd(value, this.comparisonStart, this.comparisonEnd);
    }
    /**
     * Gets whether a value is within the current comparison range.
     * @param {?} value
     * @return {?}
     */
    _isInComparisonRange(value) {
        return isInRange(value, this.comparisonStart, this.comparisonEnd, this.isRange);
    }
    /**
     * Gets whether a value is the start of the preview range.
     * @param {?} value
     * @return {?}
     */
    _isPreviewStart(value) {
        return isStart(value, this.previewStart, this.previewEnd);
    }
    /**
     * Gets whether a value is the end of the preview range.
     * @param {?} value
     * @return {?}
     */
    _isPreviewEnd(value) {
        return isEnd(value, this.previewStart, this.previewEnd);
    }
    /**
     * Gets whether a value is inside the preview range.
     * @param {?} value
     * @return {?}
     */
    _isInPreview(value) {
        return isInRange(value, this.previewStart, this.previewEnd, this.isRange);
    }
    /**
     * Finds the MatCalendarCell that corresponds to a DOM node.
     * @private
     * @param {?} element
     * @return {?}
     */
    _getCellFromElement(element) {
        /** @type {?} */
        let cell;
        if (isTableCell(element)) {
            cell = element;
        }
        else if (isTableCell((/** @type {?} */ (element.parentNode)))) {
            cell = (/** @type {?} */ (element.parentNode));
        }
        if (cell) {
            /** @type {?} */
            const row = cell.getAttribute('data-mat-row');
            /** @type {?} */
            const col = cell.getAttribute('data-mat-col');
            if (row && col) {
                return this.rows[parseInt(row)][parseInt(col)];
            }
        }
        return null;
    }
}
MatCalendarBody.decorators = [
    { type: Component, args: [{
                selector: '[mat-calendar-body]',
                template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\n  <td class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"numCols\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n  <!--\n    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\n    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a\n    percentage of the width (a variant of the trick described here:\n    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\n      aria-hidden=\"true\"\n      class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"_firstRowOffset\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n  </td>\n  <td *ngFor=\"let item of row; let colIndex = index\"\n      role=\"gridcell\"\n      class=\"mat-calendar-body-cell mat-focus-indicator\"\n      [ngClass]=\"item.cssClasses\"\n      [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n      [attr.data-mat-row]=\"rowIndex\"\n      [attr.data-mat-col]=\"colIndex\"\n      [class.mat-calendar-body-disabled]=\"!item.enabled\"\n      [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n      [class.mat-calendar-body-range-start]=\"_isRangeStart(item.compareValue)\"\n      [class.mat-calendar-body-range-end]=\"_isRangeEnd(item.compareValue)\"\n      [class.mat-calendar-body-in-range]=\"_isInRange(item.compareValue)\"\n      [class.mat-calendar-body-comparison-bridge-start]=\"_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)\"\n      [class.mat-calendar-body-comparison-bridge-end]=\"_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)\"\n      [class.mat-calendar-body-comparison-start]=\"_isComparisonStart(item.compareValue)\"\n      [class.mat-calendar-body-comparison-end]=\"_isComparisonEnd(item.compareValue)\"\n      [class.mat-calendar-body-in-comparison-range]=\"_isInComparisonRange(item.compareValue)\"\n      [class.mat-calendar-body-preview-start]=\"_isPreviewStart(item.compareValue)\"\n      [class.mat-calendar-body-preview-end]=\"_isPreviewEnd(item.compareValue)\"\n      [class.mat-calendar-body-in-preview]=\"_isInPreview(item.compareValue)\"\n      [attr.aria-label]=\"item.ariaLabel\"\n      [attr.aria-disabled]=\"!item.enabled || null\"\n      [attr.aria-selected]=\"_isSelected(item)\"\n      (click)=\"_cellClicked(item, $event)\"\n      [style.width]=\"_cellWidth\"\n      [style.paddingTop]=\"_cellPadding\"\n      role=\"button\"\n      [style.paddingBottom]=\"_cellPadding\">\n      <div class=\"mat-calendar-body-cell-content\"\n        [class.mat-calendar-body-selected]=\"_isSelected(item)\"\n        [class.mat-calendar-body-today]=\"todayValue === item.compareValue\">\n        {{item.displayValue}}\n      </div>\n      <div class=\"mat-calendar-body-cell-preview\"></div>\n  </td>\n</tr>\n",
                host: {
                    'class': 'mat-calendar-body',
                    'role': 'grid',
                    'aria-readonly': 'true'
                },
                exportAs: 'matCalendarBody',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.7142857143%;padding-right:4.7142857143%}.mat-calendar-body-cell{position:relative;height:0;line-height:0;text-align:center;outline:none;cursor:pointer}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-cell-preview{content:\"\";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;height:90%;width:100%}.mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-start::after,.mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,.mat-calendar-body-comparison-start::after,.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,[dir=rtl] .mat-calendar-body-comparison-start::after,[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,.mat-calendar-body-comparison-end::after,.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,[dir=rtl] .mat-calendar-body-comparison-end::after,[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-comparison-bridge-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-bridge-end.mat-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end.mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-end.mat-calendar-body-range-start::after{width:90%}.mat-calendar-body-in-preview .mat-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{position:absolute;top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}.cdk-high-contrast-active .mat-calendar-body-cell-content{border:none}.cdk-high-contrast-active .mat-datepicker-popup:not(:empty),.cdk-high-contrast-active .mat-calendar-body-selected{outline:solid 1px}.cdk-high-contrast-active .mat-calendar-body-today{outline:dotted 1px}.cdk-high-contrast-active .cdk-keyboard-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected),.cdk-high-contrast-active .cdk-program-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected){outline:dotted 2px}[dir=rtl] .mat-calendar-body-label{text-align:right}@media(hover: none){.mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected){background-color:transparent}}\n"]
            }] }
];
/** @nocollapse */
MatCalendarBody.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
MatCalendarBody.propDecorators = {
    label: [{ type: Input }],
    rows: [{ type: Input }],
    todayValue: [{ type: Input }],
    startValue: [{ type: Input }],
    endValue: [{ type: Input }],
    labelMinRequiredCells: [{ type: Input }],
    numCols: [{ type: Input }],
    activeCell: [{ type: Input }],
    isRange: [{ type: Input }],
    cellAspectRatio: [{ type: Input }],
    comparisonStart: [{ type: Input }],
    comparisonEnd: [{ type: Input }],
    previewStart: [{ type: Input }],
    previewEnd: [{ type: Input }],
    selectedValueChange: [{ type: Output }],
    previewChange: [{ type: Output }]
};
if (false) {
    /**
     * Used to skip the next focus event when rendering the preview range.
     * We need a flag like this, because some browsers fire focus events asynchronously.
     * @type {?}
     * @private
     */
    MatCalendarBody.prototype._skipNextFocus;
    /**
     * The label for the table. (e.g. "Jan 2017").
     * @type {?}
     */
    MatCalendarBody.prototype.label;
    /**
     * The cells to display in the table.
     * @type {?}
     */
    MatCalendarBody.prototype.rows;
    /**
     * The value in the table that corresponds to today.
     * @type {?}
     */
    MatCalendarBody.prototype.todayValue;
    /**
     * Start value of the selected date range.
     * @type {?}
     */
    MatCalendarBody.prototype.startValue;
    /**
     * End value of the selected date range.
     * @type {?}
     */
    MatCalendarBody.prototype.endValue;
    /**
     * The minimum number of free cells needed to fit the label in the first row.
     * @type {?}
     */
    MatCalendarBody.prototype.labelMinRequiredCells;
    /**
     * The number of columns in the table.
     * @type {?}
     */
    MatCalendarBody.prototype.numCols;
    /**
     * The cell number of the active cell in the table.
     * @type {?}
     */
    MatCalendarBody.prototype.activeCell;
    /**
     * Whether a range is being selected.
     * @type {?}
     */
    MatCalendarBody.prototype.isRange;
    /**
     * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
     * maintained even as the table resizes.
     * @type {?}
     */
    MatCalendarBody.prototype.cellAspectRatio;
    /**
     * Start of the comparison range.
     * @type {?}
     */
    MatCalendarBody.prototype.comparisonStart;
    /**
     * End of the comparison range.
     * @type {?}
     */
    MatCalendarBody.prototype.comparisonEnd;
    /**
     * Start of the preview range.
     * @type {?}
     */
    MatCalendarBody.prototype.previewStart;
    /**
     * End of the preview range.
     * @type {?}
     */
    MatCalendarBody.prototype.previewEnd;
    /**
     * Emits when a new value is selected.
     * @type {?}
     */
    MatCalendarBody.prototype.selectedValueChange;
    /**
     * Emits when the preview has changed as a result of a user action.
     * @type {?}
     */
    MatCalendarBody.prototype.previewChange;
    /**
     * The number of blank cells to put at the beginning for the first row.
     * @type {?}
     */
    MatCalendarBody.prototype._firstRowOffset;
    /**
     * Padding for the individual date cells.
     * @type {?}
     */
    MatCalendarBody.prototype._cellPadding;
    /**
     * Width of an individual cell.
     * @type {?}
     */
    MatCalendarBody.prototype._cellWidth;
    /**
     * Event handler for when the user enters an element
     * inside the calendar body (e.g. by hovering in or focus).
     * @type {?}
     * @private
     */
    MatCalendarBody.prototype._enterHandler;
    /**
     * Event handler for when the user's pointer leaves an element
     * inside the calendar body (e.g. by hovering out or blurring).
     * @type {?}
     * @private
     */
    MatCalendarBody.prototype._leaveHandler;
    /**
     * @type {?}
     * @private
     */
    MatCalendarBody.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatCalendarBody.prototype._ngZone;
}
/**
 * Checks whether a node is a table cell element.
 * @param {?} node
 * @return {?}
 */
function isTableCell(node) {
    return node.nodeName === 'TD';
}
/**
 * Checks whether a value is the start of a range.
 * @param {?} value
 * @param {?} start
 * @param {?} end
 * @return {?}
 */
function isStart(value, start, end) {
    return end !== null && start !== end && value < end && value === start;
}
/**
 * Checks whether a value is the end of a range.
 * @param {?} value
 * @param {?} start
 * @param {?} end
 * @return {?}
 */
function isEnd(value, start, end) {
    return start !== null && start !== end && value >= start && value === end;
}
/**
 * Checks whether a value is inside of a range.
 * @param {?} value
 * @param {?} start
 * @param {?} end
 * @param {?} rangeEnabled
 * @return {?}
 */
function isInRange(value, start, end, rangeEnabled) {
    return rangeEnabled && start !== null && end !== null && start !== end &&
        value >= start && value <= end;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-selection-model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * A class representing a range of dates.
 * @template D
 */
class DateRange {
    /**
     * @param {?} start
     * @param {?} end
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
if (false) {
    /**
     * Ensures that objects with a `start` and `end` property can't be assigned to a variable that
     * expects a `DateRange`
     * @type {?}
     * @private
     */
    DateRange.prototype._disableStructuralEquivalency;
    /**
     * The start date of the range.
     * @type {?}
     */
    DateRange.prototype.start;
    /**
     * The end date of the range.
     * @type {?}
     */
    DateRange.prototype.end;
}
/**
 * Event emitted by the date selection model when its selection changes.
 * @record
 * @template S
 */
function DateSelectionModelChange() { }
if (false) {
    /**
     * New value for the selection.
     * @type {?}
     */
    DateSelectionModelChange.prototype.selection;
    /**
     * Object that triggered the change.
     * @type {?}
     */
    DateSelectionModelChange.prototype.source;
}
/**
 * A selection model containing a date selection.
 * @abstract
 * @template S, D
 */
class MatDateSelectionModel {
    /**
     * @protected
     * @param {?} selection
     * @param {?} _adapter
     */
    constructor(selection, _adapter) {
        this.selection = selection;
        this._adapter = _adapter;
        this._selectionChanged = new Subject();
        /**
         * Emits when the selection has changed.
         */
        this.selectionChanged = this._selectionChanged.asObservable();
        this.selection = selection;
    }
    /**
     * Updates the current selection in the model.
     * @param {?} value New selection that should be assigned.
     * @param {?} source Object that triggered the selection change.
     * @return {?}
     */
    updateSelection(value, source) {
        ((/** @type {?} */ (this))).selection = value;
        this._selectionChanged.next({ selection: value, source });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._selectionChanged.complete();
    }
    /**
     * @protected
     * @param {?} date
     * @return {?}
     */
    _isValidDateInstance(date) {
        return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
    }
}
MatDateSelectionModel.decorators = [
    { type: Directive }
];
/** @nocollapse */
MatDateSelectionModel.ctorParameters = () => [
    { type: undefined },
    { type: DateAdapter }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatDateSelectionModel.prototype._selectionChanged;
    /**
     * Emits when the selection has changed.
     * @type {?}
     */
    MatDateSelectionModel.prototype.selectionChanged;
    /**
     * The current selection.
     * @type {?}
     */
    MatDateSelectionModel.prototype.selection;
    /**
     * @type {?}
     * @protected
     */
    MatDateSelectionModel.prototype._adapter;
    /**
     * Adds a date to the current selection.
     * @abstract
     * @param {?} date
     * @return {?}
     */
    MatDateSelectionModel.prototype.add = function (date) { };
    /**
     * Checks whether the current selection is valid.
     * @abstract
     * @return {?}
     */
    MatDateSelectionModel.prototype.isValid = function () { };
    /**
     * Checks whether the current selection is complete.
     * @abstract
     * @return {?}
     */
    MatDateSelectionModel.prototype.isComplete = function () { };
}
/**
 * A selection model that contains a single date.
 * @template D
 */
class MatSingleDateSelectionModel extends MatDateSelectionModel {
    /**
     * @param {?} adapter
     */
    constructor(adapter) {
        super(null, adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     * @param {?} date
     * @return {?}
     */
    add(date) {
        super.updateSelection(date, this);
    }
    /**
     * Checks whether the current selection is valid.
     * @return {?}
     */
    isValid() {
        return this.selection != null && this._isValidDateInstance(this.selection);
    }
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     * @return {?}
     */
    isComplete() {
        return this.selection != null;
    }
}
MatSingleDateSelectionModel.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatSingleDateSelectionModel.ctorParameters = () => [
    { type: DateAdapter }
];
/**
 * A selection model that contains a date range.
 * @template D
 */
class MatRangeDateSelectionModel extends MatDateSelectionModel {
    /**
     * @param {?} adapter
     */
    constructor(adapter) {
        super(new DateRange(null, null), adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     * @param {?} date
     * @return {?}
     */
    add(date) {
        let { start, end } = this.selection;
        if (start == null) {
            start = date;
        }
        else if (end == null) {
            end = date;
        }
        else {
            start = date;
            end = null;
        }
        super.updateSelection(new DateRange(start, end), this);
    }
    /**
     * Checks whether the current selection is valid.
     * @return {?}
     */
    isValid() {
        const { start, end } = this.selection;
        // Empty ranges are valid.
        if (start == null && end == null) {
            return true;
        }
        // Complete ranges are only valid if both dates are valid and the start is before the end.
        if (start != null && end != null) {
            return this._isValidDateInstance(start) && this._isValidDateInstance(end) &&
                this._adapter.compareDate(start, end) <= 0;
        }
        // Partial ranges are valid if the start/end is valid.
        return (start == null || this._isValidDateInstance(start)) &&
            (end == null || this._isValidDateInstance(end));
    }
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     * @return {?}
     */
    isComplete() {
        return this.selection.start != null && this.selection.end != null;
    }
}
MatRangeDateSelectionModel.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatRangeDateSelectionModel.ctorParameters = () => [
    { type: DateAdapter }
];
/**
 * \@docs-private
 * @param {?} parent
 * @param {?} adapter
 * @return {?}
 */
function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatSingleDateSelectionModel(adapter);
}
/**
 * Used to provide a single selection model to a component.
 * @type {?}
 */
const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/**
 * \@docs-private
 * @param {?} parent
 * @param {?} adapter
 * @return {?}
 */
function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatRangeDateSelectionModel(adapter);
}
/**
 * Used to provide a range selection model to a component.
 * @type {?}
 */
const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-range-selection-strategy.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Injection token used to customize the date range selection behavior.
 * @type {?}
 */
const MAT_DATE_RANGE_SELECTION_STRATEGY = new InjectionToken('MAT_DATE_RANGE_SELECTION_STRATEGY');
/**
 * Object that can be provided in order to customize the date range selection behavior.
 * @record
 * @template D
 */
function MatDateRangeSelectionStrategy() { }
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    DefaultMatCalendarRangeStrategy.prototype._dateAdapter;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/month-view.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * \@docs-private
 * @template D
 */
class MatMonthView {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _dateFormats
     * @param {?} _dateAdapter
     * @param {?=} _dir
     * @param {?=} _rangeStrategy
     */
    constructor(_changeDetectorRef, _dateFormats, _dateAdapter, _dir, _rangeStrategy) {
        this._changeDetectorRef = _changeDetectorRef;
        this._dateFormats = _dateFormats;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._rangeStrategy = _rangeStrategy;
        this._rerenderSubscription = Subscription.EMPTY;
        /**
         * Emits when a new date is selected.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits when any date is selected.
         */
        this._userSelection = new EventEmitter();
        /**
         * Emits when any date is activated.
         */
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
     * @return {?}
     */
    get activeDate() { return this._activeDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        /** @type {?} */
        const oldActiveDate = this._activeDate;
        /** @type {?} */
        const validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
        this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
        if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
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
        if (value instanceof DateRange) {
            this._selected = value;
        }
        else {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        this._setRanges(this._selected);
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
     * Handles when a new date is selected.
     * @param {?} event
     * @return {?}
     */
    _dateSelected(event) {
        /** @type {?} */
        const date = event.value;
        /** @type {?} */
        const selectedYear = this._dateAdapter.getYear(this.activeDate);
        /** @type {?} */
        const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
        /** @type {?} */
        const selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);
        /** @type {?} */
        let rangeStartDate;
        /** @type {?} */
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
    /**
     * Handles keydown events on the calendar body when calendar is in month view.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydown(event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        /** @type {?} */
        const oldActiveDate = this._activeDate;
        /** @type {?} */
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
    /**
     * Initializes this month view.
     * @return {?}
     */
    _init() {
        this._setRanges(this.selected);
        this._todayDate = this._getCellCompareValue(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        /** @type {?} */
        let firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._initWeekdays();
        this._createWeekCells();
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @param {?=} movePreview
     * @return {?}
     */
    _focusActiveCell(movePreview) {
        this._matCalendarBody._focusActiveCell(movePreview);
    }
    /**
     * Called when the user has activated a new cell and the preview needs to be updated.
     * @param {?} __0
     * @return {?}
     */
    _previewChanged({ event, value: cell }) {
        if (this._rangeStrategy) {
            // We can assume that this will be a range, because preview
            // events aren't fired for single date selections.
            /** @type {?} */
            const value = cell ? (/** @type {?} */ (cell.rawValue)) : null;
            /** @type {?} */
            const previewRange = this._rangeStrategy.createPreview(value, (/** @type {?} */ (this.selected)), event);
            this._previewStart = this._getCellCompareValue(previewRange.start);
            this._previewEnd = this._getCellCompareValue(previewRange.end);
            // Note that here we need to use `detectChanges`, rather than `markForCheck`, because
            // the way `_focusActiveCell` is set up at the moment makes it fire at the wrong time
            // when navigating one month back using the keyboard which will cause this handler
            // to throw a "changed after checked" error when updating the preview state.
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Initializes the weekdays.
     * @private
     * @return {?}
     */
    _initWeekdays() {
        /** @type {?} */
        const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        /** @type {?} */
        const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        /** @type {?} */
        const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        /** @type {?} */
        let weekdays = longWeekdays.map((/**
         * @param {?} long
         * @param {?} i
         * @return {?}
         */
        (long, i) => {
            return { long, narrow: narrowWeekdays[i] };
        }));
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
    }
    /**
     * Creates MatCalendarCells for the dates in this month.
     * @private
     * @return {?}
     */
    _createWeekCells() {
        /** @type {?} */
        const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        /** @type {?} */
        const dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            /** @type {?} */
            const date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            /** @type {?} */
            const enabled = this._shouldEnableDate(date);
            /** @type {?} */
            const ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            /** @type {?} */
            const cellClasses = this.dateClass ? this.dateClass(date) : undefined;
            this._weeks[this._weeks.length - 1].push(new MatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses, (/** @type {?} */ (this._getCellCompareValue(date))), date));
        }
    }
    /**
     * Date filter for the month
     * @private
     * @param {?} date
     * @return {?}
     */
    _shouldEnableDate(date) {
        return !!date &&
            (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
            (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0) &&
            (!this.dateFilter || this.dateFilter(date));
    }
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     * @private
     * @param {?} date
     * @return {?}
     */
    _getDateInCurrentMonth(date) {
        return date && this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    }
    /**
     * Checks whether the 2 dates are non-null and fall within the same month of the same year.
     * @private
     * @param {?} d1
     * @param {?} d2
     * @return {?}
     */
    _hasSameMonthAndYear(d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    }
    /**
     * Gets the value that will be used to one cell to another.
     * @private
     * @param {?} date
     * @return {?}
     */
    _getCellCompareValue(date) {
        if (date) {
            // We use the time since the Unix epoch to compare dates in this view, rather than the
            // cell values, because we need to support ranges that span across multiple months/years.
            /** @type {?} */
            const year = this._dateAdapter.getYear(date);
            /** @type {?} */
            const month = this._dateAdapter.getMonth(date);
            /** @type {?} */
            const day = this._dateAdapter.getDate(date);
            return new Date(year, month, day).getTime();
        }
        return null;
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
    /**
     * Sets the current range based on a model value.
     * @private
     * @param {?} selectedValue
     * @return {?}
     */
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._rerenderSubscription;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._activeDate;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._selected;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._minDate;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._maxDate;
    /**
     * Function used to filter which dates are selectable.
     * @type {?}
     */
    MatMonthView.prototype.dateFilter;
    /**
     * Function that can be used to add custom CSS classes to dates.
     * @type {?}
     */
    MatMonthView.prototype.dateClass;
    /**
     * Start of the comparison range.
     * @type {?}
     */
    MatMonthView.prototype.comparisonStart;
    /**
     * End of the comparison range.
     * @type {?}
     */
    MatMonthView.prototype.comparisonEnd;
    /**
     * Emits when a new date is selected.
     * @type {?}
     */
    MatMonthView.prototype.selectedChange;
    /**
     * Emits when any date is selected.
     * @type {?}
     */
    MatMonthView.prototype._userSelection;
    /**
     * Emits when any date is activated.
     * @type {?}
     */
    MatMonthView.prototype.activeDateChange;
    /**
     * The body of calendar table
     * @type {?}
     */
    MatMonthView.prototype._matCalendarBody;
    /**
     * The label for this month (e.g. "January 2017").
     * @type {?}
     */
    MatMonthView.prototype._monthLabel;
    /**
     * Grid of calendar cells representing the dates of the month.
     * @type {?}
     */
    MatMonthView.prototype._weeks;
    /**
     * The number of blank cells in the first row before the 1st of the month.
     * @type {?}
     */
    MatMonthView.prototype._firstWeekOffset;
    /**
     * Start value of the currently-shown date range.
     * @type {?}
     */
    MatMonthView.prototype._rangeStart;
    /**
     * End value of the currently-shown date range.
     * @type {?}
     */
    MatMonthView.prototype._rangeEnd;
    /**
     * Start value of the currently-shown comparison date range.
     * @type {?}
     */
    MatMonthView.prototype._comparisonRangeStart;
    /**
     * End value of the currently-shown comparison date range.
     * @type {?}
     */
    MatMonthView.prototype._comparisonRangeEnd;
    /**
     * Start of the preview range.
     * @type {?}
     */
    MatMonthView.prototype._previewStart;
    /**
     * End of the preview range.
     * @type {?}
     */
    MatMonthView.prototype._previewEnd;
    /**
     * Whether the user is currently selecting a range of dates.
     * @type {?}
     */
    MatMonthView.prototype._isRange;
    /**
     * The date of the month that today falls on. Null if today is in another month.
     * @type {?}
     */
    MatMonthView.prototype._todayDate;
    /**
     * The names of the weekdays.
     * @type {?}
     */
    MatMonthView.prototype._weekdays;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._dateFormats;
    /** @type {?} */
    MatMonthView.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatMonthView.prototype._rangeStrategy;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/multi-year-view.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const yearsPerPage = 24;
/** @type {?} */
const yearsPerRow = 4;
/**
 * An internal component used to display a year selector in the datepicker.
 * \@docs-private
 * @template D
 */
class MatMultiYearView {
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
        if (value instanceof DateRange) {
            this._selected = value;
        }
        else {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        this._setSelectedYear(value);
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
     * @param {?} event
     * @return {?}
     */
    _yearSelected(event) {
        /** @type {?} */
        const year = event.value;
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
    /**
     * Sets the currently-highlighted year based on a model value.
     * @private
     * @param {?} value
     * @return {?}
     */
    _setSelectedYear(value) {
        this._selectedYear = null;
        if (value instanceof DateRange) {
            /** @type {?} */
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
function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
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
function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
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

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/year-view.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * An internal component used to display a single year in the datepicker.
 * \@docs-private
 * @template D
 */
class MatYearView {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _dateFormats
     * @param {?} _dateAdapter
     * @param {?=} _dir
     */
    constructor(_changeDetectorRef, _dateFormats, _dateAdapter, _dir) {
        this._changeDetectorRef = _changeDetectorRef;
        this._dateFormats = _dateFormats;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._rerenderSubscription = Subscription.EMPTY;
        /**
         * Emits when a new month is selected.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits the selected month. This doesn't imply a change on the selected date
         */
        this.monthSelected = new EventEmitter();
        /**
         * Emits when any date is activated.
         */
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
     * The date to display in this year view (everything other than the year is ignored).
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
        if (this._dateAdapter.getYear(oldActiveDate) !== this._dateAdapter.getYear(this._activeDate)) {
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
        if (value instanceof DateRange) {
            this._selected = value;
        }
        else {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        this._setSelectedMonth(value);
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
     * Handles when a new month is selected.
     * @param {?} event
     * @return {?}
     */
    _monthSelected(event) {
        /** @type {?} */
        const month = event.value;
        /** @type {?} */
        const normalizedDate = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        this.monthSelected.emit(normalizedDate);
        /** @type {?} */
        const daysInMonth = this._dateAdapter.getNumDaysInMonth(normalizedDate);
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    }
    /**
     * Handles keydown events on the calendar body when calendar is in year view.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydown(event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        /** @type {?} */
        const oldActiveDate = this._activeDate;
        /** @type {?} */
        const isRtl = this._isRtl();
        switch (event.keyCode) {
            case LEFT_ARROW:
                this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, isRtl ? 1 : -1);
                break;
            case RIGHT_ARROW:
                this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, isRtl ? -1 : 1);
                break;
            case UP_ARROW:
                this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -4);
                break;
            case DOWN_ARROW:
                this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 4);
                break;
            case HOME:
                this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case END:
                this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this.activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this.activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
            case SPACE:
                this._monthSelected({ value: this._dateAdapter.getMonth(this._activeDate), event });
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
     * Initializes this year view.
     * @return {?}
     */
    _init() {
        this._setSelectedMonth(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        /** @type {?} */
        let monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map((/**
         * @param {?} row
         * @return {?}
         */
        row => row.map((/**
         * @param {?} month
         * @return {?}
         */
        month => this._createCellForMonth(month, monthNames[month])))));
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    _focusActiveCell() {
        this._matCalendarBody._focusActiveCell();
    }
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @private
     * @param {?} date
     * @return {?}
     */
    _getMonthInCurrentYear(date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    }
    /**
     * Creates an MatCalendarCell for the given month.
     * @private
     * @param {?} month
     * @param {?} monthName
     * @return {?}
     */
    _createCellForMonth(month, monthName) {
        /** @type {?} */
        let ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MatCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._shouldEnableMonth(month));
    }
    /**
     * Whether the given month is enabled.
     * @private
     * @param {?} month
     * @return {?}
     */
    _shouldEnableMonth(month) {
        /** @type {?} */
        const activeYear = this._dateAdapter.getYear(this.activeDate);
        if (month === undefined || month === null ||
            this._isYearAndMonthAfterMaxDate(activeYear, month) ||
            this._isYearAndMonthBeforeMinDate(activeYear, month)) {
            return false;
        }
        if (!this.dateFilter) {
            return true;
        }
        /** @type {?} */
        const firstOfMonth = this._dateAdapter.createDate(activeYear, month, 1);
        // If any date in the month is enabled count the month as enabled.
        for (let date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Tests whether the combination month/year is after this.maxDate, considering
     * just the month and year of this.maxDate
     * @private
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    _isYearAndMonthAfterMaxDate(year, month) {
        if (this.maxDate) {
            /** @type {?} */
            const maxYear = this._dateAdapter.getYear(this.maxDate);
            /** @type {?} */
            const maxMonth = this._dateAdapter.getMonth(this.maxDate);
            return year > maxYear || (year === maxYear && month > maxMonth);
        }
        return false;
    }
    /**
     * Tests whether the combination month/year is before this.minDate, considering
     * just the month and year of this.minDate
     * @private
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    _isYearAndMonthBeforeMinDate(year, month) {
        if (this.minDate) {
            /** @type {?} */
            const minYear = this._dateAdapter.getYear(this.minDate);
            /** @type {?} */
            const minMonth = this._dateAdapter.getMonth(this.minDate);
            return year < minYear || (year === minYear && month < minMonth);
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
    /**
     * Sets the currently-selected month based on a model value.
     * @private
     * @param {?} value
     * @return {?}
     */
    _setSelectedMonth(value) {
        if (value instanceof DateRange) {
            this._selectedMonth = this._getMonthInCurrentYear(value.start) ||
                this._getMonthInCurrentYear(value.end);
        }
        else {
            this._selectedMonth = this._getMonthInCurrentYear(value);
        }
    }
}
MatYearView.decorators = [
    { type: Component, args: [{
                selector: 'mat-year-view',
                template: "<table class=\"mat-calendar-table\" role=\"presentation\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_yearLabel\"\n         [rows]=\"_months\"\n         [todayValue]=\"_todayMonth!\"\n         [startValue]=\"_selectedMonth!\"\n         [endValue]=\"_selectedMonth!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_dateAdapter.getMonth(activeDate)\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
                exportAs: 'matYearView',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
MatYearView.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: Directionality, decorators: [{ type: Optional }] }
];
MatYearView.propDecorators = {
    activeDate: [{ type: Input }],
    selected: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    dateFilter: [{ type: Input }],
    selectedChange: [{ type: Output }],
    monthSelected: [{ type: Output }],
    activeDateChange: [{ type: Output }],
    _matCalendarBody: [{ type: ViewChild, args: [MatCalendarBody,] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._rerenderSubscription;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._activeDate;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._selected;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._minDate;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._maxDate;
    /**
     * A function used to filter which dates are selectable.
     * @type {?}
     */
    MatYearView.prototype.dateFilter;
    /**
     * Emits when a new month is selected.
     * @type {?}
     */
    MatYearView.prototype.selectedChange;
    /**
     * Emits the selected month. This doesn't imply a change on the selected date
     * @type {?}
     */
    MatYearView.prototype.monthSelected;
    /**
     * Emits when any date is activated.
     * @type {?}
     */
    MatYearView.prototype.activeDateChange;
    /**
     * The body of calendar table
     * @type {?}
     */
    MatYearView.prototype._matCalendarBody;
    /**
     * Grid of calendar cells representing the months of the year.
     * @type {?}
     */
    MatYearView.prototype._months;
    /**
     * The label for this year (e.g. "2017").
     * @type {?}
     */
    MatYearView.prototype._yearLabel;
    /**
     * The month in this year that today falls on. Null if today is in a different year.
     * @type {?}
     */
    MatYearView.prototype._todayMonth;
    /**
     * The month in this year that the selected Date falls on.
     * Null if the selected Date is in a different year.
     * @type {?}
     */
    MatYearView.prototype._selectedMonth;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._dateFormats;
    /** @type {?} */
    MatYearView.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatYearView.prototype._dir;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/calendar.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Default header for MatCalendar
 * @template D
 */
class MatCalendarHeader {
    /**
     * @param {?} _intl
     * @param {?} calendar
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} changeDetectorRef
     */
    constructor(_intl, calendar, _dateAdapter, _dateFormats, changeDetectorRef) {
        this._intl = _intl;
        this.calendar = calendar;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this.calendar.stateChanges.subscribe((/**
         * @return {?}
         */
        () => changeDetectorRef.markForCheck()));
    }
    /**
     * The label for the current calendar view.
     * @return {?}
     */
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
        /** @type {?} */
        const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
        /** @type {?} */
        const minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
        /** @type {?} */
        const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
        /** @type {?} */
        const minYearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(minYearOfPage, 0, 1));
        /** @type {?} */
        const maxYearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(maxYearOfPage, 0, 1));
        return this._intl.formatYearRange(minYearName, maxYearName);
    }
    /**
     * @return {?}
     */
    get periodButtonLabel() {
        return this.calendar.currentView == 'month' ?
            this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
    }
    /**
     * The label for the previous button.
     * @return {?}
     */
    get prevButtonLabel() {
        return {
            'month': this._intl.prevMonthLabel,
            'year': this._intl.prevYearLabel,
            'multi-year': this._intl.prevMultiYearLabel
        }[this.calendar.currentView];
    }
    /**
     * The label for the next button.
     * @return {?}
     */
    get nextButtonLabel() {
        return {
            'month': this._intl.nextMonthLabel,
            'year': this._intl.nextYearLabel,
            'multi-year': this._intl.nextMultiYearLabel
        }[this.calendar.currentView];
    }
    /**
     * Handles user clicks on the period label.
     * @return {?}
     */
    currentPeriodClicked() {
        this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
    }
    /**
     * Handles user clicks on the previous button.
     * @return {?}
     */
    previousClicked() {
        this.calendar.activeDate = this.calendar.currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
            this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage);
    }
    /**
     * Handles user clicks on the next button.
     * @return {?}
     */
    nextClicked() {
        this.calendar.activeDate = this.calendar.currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
            this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? 1 : yearsPerPage);
    }
    /**
     * Whether the previous period button is enabled.
     * @return {?}
     */
    previousEnabled() {
        if (!this.calendar.minDate) {
            return true;
        }
        return !this.calendar.minDate ||
            !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
    }
    /**
     * Whether the next period button is enabled.
     * @return {?}
     */
    nextEnabled() {
        return !this.calendar.maxDate ||
            !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
    }
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @private
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
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
    { type: MatCalendar, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatCalendar)),] }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
    { type: ChangeDetectorRef }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatCalendarHeader.prototype._intl;
    /** @type {?} */
    MatCalendarHeader.prototype.calendar;
    /**
     * @type {?}
     * @private
     */
    MatCalendarHeader.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatCalendarHeader.prototype._dateFormats;
}
/**
 * A calendar that is used as part of the datepicker.
 * \@docs-private
 * @template D
 */
class MatCalendar {
    /**
     * @param {?} _intl
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} _changeDetectorRef
     */
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
        /**
         * Whether the calendar should be started in month or year view.
         */
        this.startView = 'month';
        /**
         * Emits when the currently selected date changes.
         * \@breaking-change 11.0.0 Emitted value to change to `D | null`.
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
        /**
         * Emits when any date is selected.
         */
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
        this._intlChanges = _intl.changes.subscribe((/**
         * @return {?}
         */
        () => {
            _changeDetectorRef.markForCheck();
            this.stateChanges.next();
        }));
    }
    /**
     * A date representing the period (month or year) to start the calendar in.
     * @return {?}
     */
    get startAt() { return this._startAt; }
    /**
     * @param {?} value
     * @return {?}
     */
    set startAt(value) {
        this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
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
        if (value instanceof DateRange) {
            this._selected = value;
        }
        else {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
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
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     * @return {?}
     */
    get activeDate() { return this._clampedActiveDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        this.stateChanges.next();
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Whether the calendar is in month view.
     * @return {?}
     */
    get currentView() { return this._currentView; }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentView(value) {
        this._currentView = value;
        this._moveFocusOnNextTick = true;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._calendarHeaderPortal = new ComponentPortal(this.headerComponent || MatCalendarHeader);
        this.activeDate = this.startAt || this._dateAdapter.today();
        // Assign to the private property since we don't want to move focus on init.
        this._currentView = this.startView;
    }
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        if (this._moveFocusOnNextTick) {
            this._moveFocusOnNextTick = false;
            this.focusActiveCell();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
        this.stateChanges.complete();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const change = changes['minDate'] || changes['maxDate'] || changes['dateFilter'];
        if (change && !change.firstChange) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    focusActiveCell() {
        this._getCurrentViewComponent()._focusActiveCell(false);
    }
    /**
     * Updates today's date after an update of the active date
     * @return {?}
     */
    updateTodaysDate() {
        /** @type {?} */
        const currentView = this.currentView;
        /** @type {?} */
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
    /**
     * Handles date selection in the month view.
     * @param {?} event
     * @return {?}
     */
    _dateSelected(event) {
        /** @type {?} */
        const date = event.value;
        if (this.selected instanceof DateRange ||
            (date && !this._dateAdapter.sameDate(date, this.selected))) {
            // @breaking-change 11.0.0 remove non-null assertion
            // once the `selectedChange` is allowed to be null.
            this.selectedChange.emit((/** @type {?} */ (date)));
        }
        this._userSelection.emit(event);
    }
    /**
     * Handles year selection in the multiyear view.
     * @param {?} normalizedYear
     * @return {?}
     */
    _yearSelectedInMultiYearView(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    /**
     * Handles month selection in the year view.
     * @param {?} normalizedMonth
     * @return {?}
     */
    _monthSelectedInYearView(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /**
     * Handles year/month selection in the multi-year/year views.
     * @param {?} date
     * @param {?} view
     * @return {?}
     */
    _goToDateInView(date, view) {
        this.activeDate = date;
        this.currentView = view;
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
     * Returns the component instance that corresponds to the current calendar view.
     * @private
     * @return {?}
     */
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
if (false) {
    /**
     * An input indicating the type of the header component, if set.
     * @type {?}
     */
    MatCalendar.prototype.headerComponent;
    /**
     * A portal containing the header component type for this calendar.
     * @type {?}
     */
    MatCalendar.prototype._calendarHeaderPortal;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._intlChanges;
    /**
     * Used for scheduling that focus should be moved to the active cell on the next tick.
     * We need to schedule it, rather than do it immediately, because we have to wait
     * for Angular to re-evaluate the view children.
     * @type {?}
     * @private
     */
    MatCalendar.prototype._moveFocusOnNextTick;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._startAt;
    /**
     * Whether the calendar should be started in month or year view.
     * @type {?}
     */
    MatCalendar.prototype.startView;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._selected;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._minDate;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._maxDate;
    /**
     * Function used to filter which dates are selectable.
     * @type {?}
     */
    MatCalendar.prototype.dateFilter;
    /**
     * Function that can be used to add custom CSS classes to dates.
     * @type {?}
     */
    MatCalendar.prototype.dateClass;
    /**
     * Start of the comparison range.
     * @type {?}
     */
    MatCalendar.prototype.comparisonStart;
    /**
     * End of the comparison range.
     * @type {?}
     */
    MatCalendar.prototype.comparisonEnd;
    /**
     * Emits when the currently selected date changes.
     * \@breaking-change 11.0.0 Emitted value to change to `D | null`.
     * @type {?}
     */
    MatCalendar.prototype.selectedChange;
    /**
     * Emits the year chosen in multiyear view.
     * This doesn't imply a change on the selected date.
     * @type {?}
     */
    MatCalendar.prototype.yearSelected;
    /**
     * Emits the month chosen in year view.
     * This doesn't imply a change on the selected date.
     * @type {?}
     */
    MatCalendar.prototype.monthSelected;
    /**
     * Emits when any date is selected.
     * @type {?}
     */
    MatCalendar.prototype._userSelection;
    /**
     * Reference to the current month view component.
     * @type {?}
     */
    MatCalendar.prototype.monthView;
    /**
     * Reference to the current year view component.
     * @type {?}
     */
    MatCalendar.prototype.yearView;
    /**
     * Reference to the current multi-year view component.
     * @type {?}
     */
    MatCalendar.prototype.multiYearView;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._clampedActiveDate;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._currentView;
    /**
     * Emits whenever there is a state change that the header may need to respond to.
     * @type {?}
     */
    MatCalendar.prototype.stateChanges;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._dateFormats;
    /**
     * @type {?}
     * @private
     */
    MatCalendar.prototype._changeDetectorRef;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Animations used by the Material datepicker.
 * \@docs-private
 * @type {?}
 */
const matDatepickerAnimations = {
    /**
     * Transforms the height of the datepicker's calendar.
     */
    transformPanel: trigger('transformPanel', [
        state('void', style({
            opacity: 0,
            transform: 'scale(1, 0.8)'
        })),
        transition('void => enter', animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({
            opacity: 1,
            transform: 'scale(1, 1)'
        }))),
        transition('* => void', animate('100ms linear', style({ opacity: 0 })))
    ]),
    /**
     * Fades in the content of the calendar.
     */
    fadeInCalendar: trigger('fadeInCalendar', [
        state('void', style({ opacity: 0 })),
        state('enter', style({ opacity: 1 })),
        // TODO(crisbeto): this animation should be removed since it isn't quite on spec, but we
        // need to keep it until #12440 gets in, otherwise the exit animation will look glitchy.
        transition('void => *', animate('120ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
};

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Used to generate a unique ID for each datepicker instance.
 * @type {?}
 */
let datepickerUid = 0;
/**
 * Injection token that determines the scroll handling while the calendar is open.
 * @type {?}
 */
const MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('mat-datepicker-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return (/**
     * @return {?}
     */
    () => overlay.scrollStrategies.reposition());
}
/**
 * \@docs-private
 * @type {?}
 */
const MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MatDatepickerContent.
/**
 * \@docs-private
 */
class MatDatepickerContentBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatDatepickerContentBase.prototype._elementRef;
}
/** @type {?} */
const _MatDatepickerContentMixinBase = mixinColor(MatDatepickerContentBase);
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * \@docs-private
 * @template S, D
 */
class MatDatepickerContent extends _MatDatepickerContentMixinBase {
    /**
     * @param {?} elementRef
     * @param {?=} _changeDetectorRef
     * @param {?=} _model
     * @param {?=} _dateAdapter
     * @param {?=} _rangeSelectionStrategy
     */
    constructor(elementRef, _changeDetectorRef, _model, _dateAdapter, _rangeSelectionStrategy) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._model = _model;
        this._dateAdapter = _dateAdapter;
        this._rangeSelectionStrategy = _rangeSelectionStrategy;
        /**
         * Current state of the animation.
         */
        this._animationState = 'enter';
        /**
         * Emits when an animation has finished.
         */
        this._animationDone = new Subject();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._calendar.focusActiveCell();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._animationDone.complete();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleUserSelection(event) {
        // @breaking-change 11.0.0 Remove null checks for _model,
        // _rangeSelectionStrategy and _dateAdapter.
        if (this._model && this._dateAdapter) {
            /** @type {?} */
            const selection = this._model.selection;
            /** @type {?} */
            const value = event.value;
            /** @type {?} */
            const isRange = selection instanceof DateRange;
            // If we're selecting a range and we have a selection strategy, always pass the value through
            // there. Otherwise don't assign null values to the model, unless we're selecting a range.
            // A null value when picking a range means that the user cancelled the selection (e.g. by
            // pressing escape), whereas when selecting a single value it means that the value didn't
            // change. This isn't very intuitive, but it's here for backwards-compatibility.
            if (isRange && this._rangeSelectionStrategy) {
                /** @type {?} */
                const newSelection = this._rangeSelectionStrategy.selectionFinished(value, (/** @type {?} */ ((/** @type {?} */ (selection)))), event.event);
                this._model.updateSelection((/** @type {?} */ ((/** @type {?} */ (newSelection)))), this);
            }
            else if (value && (isRange ||
                !this._dateAdapter.sameDate(value, (/** @type {?} */ ((/** @type {?} */ (selection))))))) {
                this._model.add(value);
            }
        }
        if (!this._model || this._model.isComplete()) {
            this.datepicker.close();
        }
    }
    /**
     * @return {?}
     */
    _startExitAnimation() {
        this._animationState = 'void';
        // @breaking-change 11.0.0 Remove null check for `_changeDetectorRef`.
        if (this._changeDetectorRef) {
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    _getSelected() {
        // @breaking-change 11.0.0 Remove null check for `_model`.
        return this._model ? (/** @type {?} */ ((/** @type {?} */ (this._model.selection)))) : null;
    }
}
MatDatepickerContent.decorators = [
    { type: Component, args: [{
                selector: 'mat-datepicker-content',
                template: "<mat-calendar cdkTrapFocus\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._minDate\"\n    [maxDate]=\"datepicker._maxDate\"\n    [dateFilter]=\"datepicker._dateFilter\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\">\n</mat-calendar>\n",
                host: {
                    'class': 'mat-datepicker-content',
                    '[@transformPanel]': '_animationState',
                    '(@transformPanel.done)': '_animationDone.next()',
                    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                },
                animations: [
                    matDatepickerAnimations.transformPanel,
                    matDatepickerAnimations.fadeInCalendar,
                ],
                exportAs: 'matDatepickerContent',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['color'],
                styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content-touch{display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}\n"]
            }] }
];
/** @nocollapse */
MatDatepickerContent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatDateSelectionModel },
    { type: DateAdapter },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_RANGE_SELECTION_STRATEGY,] }] }
];
MatDatepickerContent.propDecorators = {
    _calendar: [{ type: ViewChild, args: [MatCalendar,] }]
};
if (false) {
    /**
     * Reference to the internal calendar component.
     * @type {?}
     */
    MatDatepickerContent.prototype._calendar;
    /**
     * Reference to the datepicker that created the overlay.
     * @type {?}
     */
    MatDatepickerContent.prototype.datepicker;
    /**
     * Start of the comparison range.
     * @type {?}
     */
    MatDatepickerContent.prototype.comparisonStart;
    /**
     * End of the comparison range.
     * @type {?}
     */
    MatDatepickerContent.prototype.comparisonEnd;
    /**
     * Whether the datepicker is above or below the input.
     * @type {?}
     */
    MatDatepickerContent.prototype._isAbove;
    /**
     * Current state of the animation.
     * @type {?}
     */
    MatDatepickerContent.prototype._animationState;
    /**
     * Emits when an animation has finished.
     * @type {?}
     */
    MatDatepickerContent.prototype._animationDone;
    /**
     * @deprecated `_changeDetectorRef`, `_model` and `_rangeSelectionStrategy`
     * parameters to become required.
     * \@breaking-change 11.0.0
     * @type {?}
     * @private
     */
    MatDatepickerContent.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerContent.prototype._model;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerContent.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerContent.prototype._rangeSelectionStrategy;
}
/**
 * Form control that can be associated with a datepicker.
 * @record
 * @template D
 */
function MatDatepickerControl() { }
if (false) {
    /** @type {?} */
    MatDatepickerControl.prototype.min;
    /** @type {?} */
    MatDatepickerControl.prototype.max;
    /** @type {?} */
    MatDatepickerControl.prototype.disabled;
    /** @type {?} */
    MatDatepickerControl.prototype.dateFilter;
    /** @type {?} */
    MatDatepickerControl.prototype._disabledChange;
    /**
     * @return {?}
     */
    MatDatepickerControl.prototype.getStartValue = function () { };
    /**
     * @return {?}
     */
    MatDatepickerControl.prototype.getThemePalette = function () { };
    /**
     * @return {?}
     */
    MatDatepickerControl.prototype.getConnectedOverlayOrigin = function () { };
}
/**
 * Base class for a datepicker.
 * @abstract
 * @template C, S, D
 */
class MatDatepickerBase {
    /**
     * @param {?} _dialog
     * @param {?} _overlay
     * @param {?} _ngZone
     * @param {?} _viewContainerRef
     * @param {?} scrollStrategy
     * @param {?} _dateAdapter
     * @param {?} _dir
     * @param {?} _document
     * @param {?} _model
     */
    constructor(_dialog, _overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _document, _model) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        this._model = _model;
        /**
         * The view that the calendar should start in.
         */
        this.startView = 'month';
        this._touchUi = false;
        /**
         * Preferred position of the datepicker in the X axis.
         */
        this.xPosition = 'start';
        /**
         * Preferred position of the datepicker in the Y axis.
         */
        this.yPosition = 'below';
        /**
         * Emits selected year in multiyear view.
         * This doesn't imply a change on the selected date.
         */
        this.yearSelected = new EventEmitter();
        /**
         * Emits selected month in year view.
         * This doesn't imply a change on the selected date.
         */
        this.monthSelected = new EventEmitter();
        /**
         * Emits when the datepicker has been opened.
         */
        this.openedStream = new EventEmitter();
        /**
         * Emits when the datepicker has been closed.
         */
        this.closedStream = new EventEmitter();
        this._opened = false;
        /**
         * The id for the datepicker calendar.
         */
        this.id = `mat-datepicker-${datepickerUid++}`;
        /**
         * The element that was focused before the datepicker was opened.
         */
        this._focusedElementBeforeOpen = null;
        /**
         * Emits when the datepicker is disabled.
         */
        this._disabledChange = new Subject();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._scrollStrategy = scrollStrategy;
    }
    /**
     * The date to open the calendar to initially.
     * @return {?}
     */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this._startAt || (this._datepickerInput ? this._datepickerInput.getStartValue() : null);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set startAt(value) {
        this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * Color palette to use on the datepicker's calendar.
     * @return {?}
     */
    get color() {
        return this._color ||
            (this._datepickerInput ? this._datepickerInput.getThemePalette() : undefined);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set color(value) {
        this._color = value;
    }
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a popup and elements have more padding to allow for bigger touch targets.
     * @return {?}
     */
    get touchUi() { return this._touchUi; }
    /**
     * @param {?} value
     * @return {?}
     */
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    /**
     * Whether the datepicker pop-up should be disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled === undefined && this._datepickerInput ?
            this._datepickerInput.disabled : !!this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._disabledChange.next(newValue);
        }
    }
    /**
     * Whether the calendar is open.
     * @return {?}
     */
    get opened() { return this._opened; }
    /**
     * @param {?} value
     * @return {?}
     */
    set opened(value) { value ? this.open() : this.close(); }
    /**
     * The minimum selectable date.
     * @return {?}
     */
    get _minDate() {
        return this._datepickerInput && this._datepickerInput.min;
    }
    /**
     * The maximum selectable date.
     * @return {?}
     */
    get _maxDate() {
        return this._datepickerInput && this._datepickerInput.max;
    }
    /**
     * @return {?}
     */
    get _dateFilter() {
        return this._datepickerInput && this._datepickerInput.dateFilter;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const positionChange = changes['xPosition'] || changes['yPosition'];
        if (positionChange && !positionChange.firstChange && this._popupRef) {
            this._setConnectedPositions((/** @type {?} */ (this._popupRef.getConfig().positionStrategy)));
            if (this.opened) {
                this._popupRef.updatePosition();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyPopup();
        this.close();
        this._disabledChange.complete();
    }
    /**
     * Selects the given date
     * @param {?} date
     * @return {?}
     */
    select(date) {
        this._model.add(date);
    }
    /**
     * Emits the selected year in multiyear view
     * @param {?} normalizedYear
     * @return {?}
     */
    _selectYear(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    /**
     * Emits selected month in year view
     * @param {?} normalizedMonth
     * @return {?}
     */
    _selectMonth(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /**
     * Register an input with this datepicker.
     * @param {?} input The datepicker input to register with this datepicker.
     * @return {?} Selection model that the input should hook itself up to.
     */
    _registerInput(input) {
        if (this._datepickerInput) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input;
        return this._model;
    }
    /**
     * Open the calendar.
     * @return {?}
     */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this._datepickerInput) {
            throw Error('Attempted to open an MatDatepicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this._opened = true;
        this.openedStream.emit();
    }
    /**
     * Close the calendar.
     * @return {?}
     */
    close() {
        if (!this._opened) {
            return;
        }
        if (this._popupComponentRef && this._popupRef) {
            /** @type {?} */
            const instance = this._popupComponentRef.instance;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe((/**
             * @return {?}
             */
            () => this._destroyPopup()));
        }
        if (this._dialogRef) {
            this._dialogRef.close();
            this._dialogRef = null;
        }
        /** @type {?} */
        const completeClose = (/**
         * @return {?}
         */
        () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
                this._focusedElementBeforeOpen = null;
            }
        });
        if (this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            this._focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /**
     * Open the calendar as a dialog.
     * @private
     * @return {?}
     */
    _openAsDialog() {
        // Usually this would be handled by `open` which ensures that we can only have one overlay
        // open at a time, however since we reset the variables in async handlers some overlays
        // may slip through if the user opens and closes multiple times in quick succession (e.g.
        // by holding down the enter key).
        if (this._dialogRef) {
            this._dialogRef.close();
        }
        this._dialogRef = this._dialog.open(MatDatepickerContent, {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
            panelClass: 'mat-datepicker-dialog',
            // These values are all the same as the defaults, but we set them explicitly so that the
            // datepicker dialog behaves consistently even if the user changed the defaults.
            hasBackdrop: true,
            disableClose: false,
            width: '',
            height: '',
            minWidth: '',
            minHeight: '',
            maxWidth: '80vw',
            maxHeight: '',
            position: {},
            autoFocus: true,
            // `MatDialog` has focus restoration built in, however we want to disable it since the
            // datepicker also has focus restoration for dropdown mode. We want to do this, in order
            // to ensure that the timing is consistent between dropdown and dialog modes since `MatDialog`
            // restores focus when the animation is finished, but the datepicker does it immediately.
            // Furthermore, this avoids any conflicts where the datepicker consumer might move focus
            // inside the `closed` event which is dispatched immediately.
            restoreFocus: false
        });
        this._dialogRef.afterClosed().subscribe((/**
         * @return {?}
         */
        () => this.close()));
        this._forwardContentValues(this._dialogRef.componentInstance);
    }
    /**
     * Open the calendar as a popup.
     * @private
     * @return {?}
     */
    _openAsPopup() {
        /** @type {?} */
        const portal = new ComponentPortal(MatDatepickerContent, this._viewContainerRef);
        this._destroyPopup();
        this._createPopup();
        this._popupComponentRef = (/** @type {?} */ (this._popupRef)).attach(portal);
        this._forwardContentValues(this._popupComponentRef.instance);
        // Update the position once the calendar has rendered.
        this._ngZone.onStable.asObservable().pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => {
            (/** @type {?} */ (this._popupRef)).updatePosition();
        }));
    }
    /**
     * Forwards relevant values from the datepicker to the datepicker content inside the overlay.
     * @protected
     * @param {?} instance
     * @return {?}
     */
    _forwardContentValues(instance) {
        instance.datepicker = this;
        instance.color = this.color;
    }
    /**
     * Create the popup.
     * @private
     * @return {?}
     */
    _createPopup() {
        /** @type {?} */
        const positionStrategy = this._overlay.position()
            .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mat-datepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        /** @type {?} */
        const overlayConfig = new OverlayConfig({
            positionStrategy: this._setConnectedPositions(positionStrategy),
            hasBackdrop: true,
            backdropClass: 'mat-overlay-transparent-backdrop',
            direction: this._dir,
            scrollStrategy: this._scrollStrategy(),
            panelClass: 'mat-datepicker-popup',
        });
        this._popupRef = this._overlay.create(overlayConfig);
        this._popupRef.overlayElement.setAttribute('role', 'dialog');
        merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            // Closing on alt + up is only valid when there's an input associated with the datepicker.
            return event.keyCode === ESCAPE ||
                (this._datepickerInput && event.altKey && event.keyCode === UP_ARROW);
        })))).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        }));
    }
    /**
     * Destroys the current popup overlay.
     * @private
     * @return {?}
     */
    _destroyPopup() {
        if (this._popupRef) {
            this._popupRef.dispose();
            this._popupRef = this._popupComponentRef = null;
        }
    }
    /**
     * Sets the positions of the datepicker in dropdown mode based on the current configuration.
     * @private
     * @param {?} strategy
     * @return {?}
     */
    _setConnectedPositions(strategy) {
        /** @type {?} */
        const primaryX = this.xPosition === 'end' ? 'end' : 'start';
        /** @type {?} */
        const secondaryX = primaryX === 'start' ? 'end' : 'start';
        /** @type {?} */
        const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
        /** @type {?} */
        const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
        return strategy.withPositions([
            {
                originX: primaryX,
                originY: secondaryY,
                overlayX: primaryX,
                overlayY: primaryY
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY
            }
        ]);
    }
    /**
     * @private
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatDatepickerBase.decorators = [
    { type: Directive }
];
/** @nocollapse */
MatDatepickerBase.ctorParameters = () => [
    { type: MatDialog },
    { type: Overlay },
    { type: NgZone },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DATEPICKER_SCROLL_STRATEGY,] }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatDateSelectionModel }
];
MatDatepickerBase.propDecorators = {
    calendarHeaderComponent: [{ type: Input }],
    startAt: [{ type: Input }],
    startView: [{ type: Input }],
    color: [{ type: Input }],
    touchUi: [{ type: Input }],
    disabled: [{ type: Input }],
    xPosition: [{ type: Input }],
    yPosition: [{ type: Input }],
    yearSelected: [{ type: Output }],
    monthSelected: [{ type: Output }],
    panelClass: [{ type: Input }],
    dateClass: [{ type: Input }],
    openedStream: [{ type: Output, args: ['opened',] }],
    closedStream: [{ type: Output, args: ['closed',] }],
    opened: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatDatepickerBase.ngAcceptInputType_disabled;
    /** @type {?} */
    MatDatepickerBase.ngAcceptInputType_touchUi;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._scrollStrategy;
    /**
     * An input indicating the type of the custom header component for the calendar, if set.
     * @type {?}
     */
    MatDatepickerBase.prototype.calendarHeaderComponent;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._startAt;
    /**
     * The view that the calendar should start in.
     * @type {?}
     */
    MatDatepickerBase.prototype.startView;
    /** @type {?} */
    MatDatepickerBase.prototype._color;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._touchUi;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._disabled;
    /**
     * Preferred position of the datepicker in the X axis.
     * @type {?}
     */
    MatDatepickerBase.prototype.xPosition;
    /**
     * Preferred position of the datepicker in the Y axis.
     * @type {?}
     */
    MatDatepickerBase.prototype.yPosition;
    /**
     * Emits selected year in multiyear view.
     * This doesn't imply a change on the selected date.
     * @type {?}
     */
    MatDatepickerBase.prototype.yearSelected;
    /**
     * Emits selected month in year view.
     * This doesn't imply a change on the selected date.
     * @type {?}
     */
    MatDatepickerBase.prototype.monthSelected;
    /**
     * Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`.
     * @type {?}
     */
    MatDatepickerBase.prototype.panelClass;
    /**
     * Function that can be used to add custom CSS classes to dates.
     * @type {?}
     */
    MatDatepickerBase.prototype.dateClass;
    /**
     * Emits when the datepicker has been opened.
     * @type {?}
     */
    MatDatepickerBase.prototype.openedStream;
    /**
     * Emits when the datepicker has been closed.
     * @type {?}
     */
    MatDatepickerBase.prototype.closedStream;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._opened;
    /**
     * The id for the datepicker calendar.
     * @type {?}
     */
    MatDatepickerBase.prototype.id;
    /**
     * A reference to the overlay when the calendar is opened as a popup.
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._popupRef;
    /**
     * A reference to the dialog when the calendar is opened as a dialog.
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._dialogRef;
    /**
     * Reference to the component instantiated in popup mode.
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._popupComponentRef;
    /**
     * The element that was focused before the datepicker was opened.
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._focusedElementBeforeOpen;
    /**
     * The input element this datepicker is associated with.
     * @type {?}
     */
    MatDatepickerBase.prototype._datepickerInput;
    /**
     * Emits when the datepicker is disabled.
     * @type {?}
     */
    MatDatepickerBase.prototype._disabledChange;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._dialog;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._viewContainerRef;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._document;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerBase.prototype._model;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/**
 * Component responsible for managing the datepicker popup/dialog.
 * @template D
 */
class MatDatepicker extends MatDatepickerBase {
}
MatDatepicker.decorators = [
    { type: Component, args: [{
                selector: 'mat-datepicker',
                template: '',
                exportAs: 'matDatepicker',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER]
            }] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-input-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 * @template D, S
 */
class MatDatepickerInputEvent {
    /**
     * @param {?} target
     * @param {?} targetElement
     */
    constructor(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
if (false) {
    /**
     * The new value for the target datepicker input.
     * @type {?}
     */
    MatDatepickerInputEvent.prototype.value;
    /**
     * Reference to the datepicker input component that emitted the event.
     * @type {?}
     */
    MatDatepickerInputEvent.prototype.target;
    /**
     * Reference to the native input element associated with the datepicker input.
     * @type {?}
     */
    MatDatepickerInputEvent.prototype.targetElement;
}
/**
 * Base class for datepicker inputs.
 * @abstract
 * @template S, D
 */
class MatDatepickerInputBase {
    /**
     * @param {?} _elementRef
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     */
    constructor(_elementRef, _dateAdapter, _dateFormats) {
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Emits when a `change` event is fired on this `<input>`.
         */
        this.dateChange = new EventEmitter();
        /**
         * Emits when an `input` event is fired on this `<input>`.
         */
        this.dateInput = new EventEmitter();
        /**
         * Emits when the value changes (either due to user input or programmatic change).
         */
        this._valueChange = new EventEmitter();
        /**
         * Emits when the disabled state has changed
         */
        this._disabledChange = new EventEmitter();
        this._onTouched = (/**
         * @return {?}
         */
        () => { });
        this._validatorOnChange = (/**
         * @return {?}
         */
        () => { });
        this._cvaOnChange = (/**
         * @return {?}
         */
        () => { });
        this._valueChangesSubscription = Subscription.EMPTY;
        this._localeSubscription = Subscription.EMPTY;
        /**
         * The form control validator for whether the input parses.
         */
        this._parseValidator = (/**
         * @return {?}
         */
        () => {
            return this._lastValueValid ?
                null : { 'matDatepickerParse': { 'text': this._elementRef.nativeElement.value } };
        });
        /**
         * The form control validator for the date filter.
         */
        this._filterValidator = (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            /** @type {?} */
            const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            /** @type {?} */
            const dateFilter = this._getDateFilter();
            return !dateFilter || !controlValue || dateFilter(controlValue) ?
                null : { 'matDatepickerFilter': true };
        });
        /**
         * The form control validator for the min date.
         */
        this._minValidator = (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            /** @type {?} */
            const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            /** @type {?} */
            const min = this._getMinDate();
            return (!min || !controlValue ||
                this._dateAdapter.compareDate(min, controlValue) <= 0) ?
                null : { 'matDatepickerMin': { 'min': min, 'actual': controlValue } };
        });
        /**
         * The form control validator for the max date.
         */
        this._maxValidator = (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            /** @type {?} */
            const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            /** @type {?} */
            const max = this._getMaxDate();
            return (!max || !controlValue ||
                this._dateAdapter.compareDate(max, controlValue) >= 0) ?
                null : { 'matDatepickerMax': { 'max': max, 'actual': controlValue } };
        });
        /**
         * Whether the last value set on the input was valid.
         */
        this._lastValueValid = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe((/**
         * @return {?}
         */
        () => {
            this.value = this.value;
        }));
    }
    /**
     * The value of the input.
     * @return {?}
     */
    get value() {
        return this._model ? this._getValueFromModel(this._model.selection) : this._pendingValue;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        value = this._dateAdapter.deserialize(value);
        this._lastValueValid = !value || this._dateAdapter.isValid(value);
        value = this._getValidDateOrNull(value);
        /** @type {?} */
        const oldDate = this.value;
        this._assignValue(value);
        this._formatValue(value);
        if (!this._dateAdapter.sameDate(oldDate, value)) {
            this._valueChange.emit(value);
        }
    }
    /**
     * Whether the datepicker-input is disabled.
     * @return {?}
     */
    get disabled() { return !!this._disabled || this._parentDisabled(); }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        if (this._disabled !== newValue) {
            this._disabled = newValue;
            this._disabledChange.emit(newValue);
        }
        // We need to null check the `blur` method, because it's undefined during SSR.
        // In Ivy static bindings are invoked earlier, before the element is attached to the DOM.
        // This can cause an error to be thrown in some browsers (IE/Edge) which assert that the
        // element has been inserted.
        if (newValue && this._isInitialized && element.blur) {
            // Normally, native input elements automatically blur if they turn disabled. This behavior
            // is problematic, because it would mean that it triggers another change detection cycle,
            // which then causes a changed after checked error if the input element was focused before.
            element.blur();
        }
    }
    /**
     * Gets the base validator functions.
     * @protected
     * @return {?}
     */
    _getValidators() {
        return [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator];
    }
    /**
     * Registers a date selection model with the input.
     * @param {?} model
     * @return {?}
     */
    _registerModel(model) {
        this._model = model;
        this._valueChangesSubscription.unsubscribe();
        if (this._pendingValue) {
            this._assignValue(this._pendingValue);
        }
        this._valueChangesSubscription = this._model.selectionChanged.subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event.source !== this) {
                /** @type {?} */
                const value = this._getValueFromModel(event.selection);
                this._cvaOnChange(value);
                this._onTouched();
                this._formatValue(value);
                this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
                this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
                if (this._outsideValueChanged) {
                    this._outsideValueChanged();
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._isInitialized = true;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._valueChangesSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    }
    /**
     * \@docs-private
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    /**
     * \@docs-private
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this._validator ? this._validator(c) : null;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._cvaOnChange = fn;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onKeydown(event) {
        /** @type {?} */
        const isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;
        if (isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
            this._openPopup();
            event.preventDefault();
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _onInput(value) {
        /** @type {?} */
        const lastValueWasValid = this._lastValueValid;
        /** @type {?} */
        let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._getValidDateOrNull(date);
        if (!this._dateAdapter.sameDate(date, this.value)) {
            this._assignValue(date);
            this._cvaOnChange(date);
            this._valueChange.emit(date);
            this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
        }
        else if (lastValueWasValid !== this._lastValueValid) {
            this._validatorOnChange();
        }
    }
    /**
     * @return {?}
     */
    _onChange() {
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    }
    /**
     * Handles blur events on the input.
     * @return {?}
     */
    _onBlur() {
        // Reformat the input only if we have a valid value.
        if (this.value) {
            this._formatValue(this.value);
        }
        this._onTouched();
    }
    /**
     * Formats a value and sets it on the input element.
     * @protected
     * @param {?} value
     * @return {?}
     */
    _formatValue(value) {
        this._elementRef.nativeElement.value =
            value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
    }
    /**
     * @protected
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
    /**
     * Assigns a value to the model.
     * @private
     * @param {?} value
     * @return {?}
     */
    _assignValue(value) {
        // We may get some incoming values before the model was
        // assigned. Save the value so that we can assign it later.
        if (this._model) {
            this._assignValueToModel(value);
            this._pendingValue = null;
        }
        else {
            this._pendingValue = value;
        }
    }
    /**
     * Checks whether a parent control is disabled. This is in place so that it can be overridden
     * by inputs extending this one which can be placed inside of a group that can be disabled.
     * @protected
     * @return {?}
     */
    _parentDisabled() {
        return false;
    }
}
MatDatepickerInputBase.decorators = [
    { type: Directive }
];
/** @nocollapse */
MatDatepickerInputBase.ctorParameters = () => [
    { type: ElementRef },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
];
MatDatepickerInputBase.propDecorators = {
    value: [{ type: Input }],
    disabled: [{ type: Input }],
    dateChange: [{ type: Output }],
    dateInput: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    MatDatepickerInputBase.ngAcceptInputType_value;
    /** @type {?} */
    MatDatepickerInputBase.ngAcceptInputType_disabled;
    /**
     * Whether the component has been initialized.
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._isInitialized;
    /**
     * @type {?}
     * @protected
     */
    MatDatepickerInputBase.prototype._model;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._disabled;
    /**
     * Emits when a `change` event is fired on this `<input>`.
     * @type {?}
     */
    MatDatepickerInputBase.prototype.dateChange;
    /**
     * Emits when an `input` event is fired on this `<input>`.
     * @type {?}
     */
    MatDatepickerInputBase.prototype.dateInput;
    /**
     * Emits when the value changes (either due to user input or programmatic change).
     * @type {?}
     */
    MatDatepickerInputBase.prototype._valueChange;
    /**
     * Emits when the disabled state has changed
     * @type {?}
     */
    MatDatepickerInputBase.prototype._disabledChange;
    /** @type {?} */
    MatDatepickerInputBase.prototype._onTouched;
    /** @type {?} */
    MatDatepickerInputBase.prototype._validatorOnChange;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._cvaOnChange;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._valueChangesSubscription;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._localeSubscription;
    /**
     * Since the value is kept on the model which is assigned in an Input,
     * we might get a value before we have a model. This property keeps track
     * of the value until we have somewhere to assign it.
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._pendingValue;
    /**
     * The form control validator for whether the input parses.
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._parseValidator;
    /**
     * The form control validator for the date filter.
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._filterValidator;
    /**
     * The form control validator for the min date.
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._minValidator;
    /**
     * The form control validator for the max date.
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._maxValidator;
    /**
     * Combined form control validator for this input.
     * @type {?}
     * @protected
     */
    MatDatepickerInputBase.prototype._validator;
    /**
     * Callback that'll be invoked when the selection model is changed
     * from somewhere that's not the current datepicker input.
     * @type {?}
     * @protected
     */
    MatDatepickerInputBase.prototype._outsideValueChanged;
    /**
     * Whether the last value set on the input was valid.
     * @type {?}
     * @protected
     */
    MatDatepickerInputBase.prototype._lastValueValid;
    /**
     * @type {?}
     * @protected
     */
    MatDatepickerInputBase.prototype._elementRef;
    /** @type {?} */
    MatDatepickerInputBase.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInputBase.prototype._dateFormats;
    /**
     * Gets the minimum date for the input. Used for validation.
     * @abstract
     * @protected
     * @return {?}
     */
    MatDatepickerInputBase.prototype._getMinDate = function () { };
    /**
     * Gets the maximum date for the input. Used for validation.
     * @abstract
     * @protected
     * @return {?}
     */
    MatDatepickerInputBase.prototype._getMaxDate = function () { };
    /**
     * Gets the date filter function. Used for validation.
     * @abstract
     * @protected
     * @return {?}
     */
    MatDatepickerInputBase.prototype._getDateFilter = function () { };
    /**
     * Opens the popup associated with the input.
     * @abstract
     * @protected
     * @return {?}
     */
    MatDatepickerInputBase.prototype._openPopup = function () { };
    /**
     * Assigns a value to the input's model.
     * @abstract
     * @protected
     * @param {?} model
     * @return {?}
     */
    MatDatepickerInputBase.prototype._assignValueToModel = function (model) { };
    /**
     * Converts a value from the model into a native value for the input.
     * @abstract
     * @protected
     * @param {?} modelValue
     * @return {?}
     */
    MatDatepickerInputBase.prototype._getValueFromModel = function (modelValue) { };
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-input.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * \@docs-private
 * @type {?}
 */
const MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatDatepickerInput)),
    multi: true
};
/**
 * \@docs-private
 * @type {?}
 */
const MAT_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatDatepickerInput)),
    multi: true
};
/**
 * Directive used to connect an input to a MatDatepicker.
 * @template D
 */
class MatDatepickerInput extends MatDatepickerInputBase {
    /**
     * @param {?} elementRef
     * @param {?} dateAdapter
     * @param {?} dateFormats
     * @param {?} _formField
     */
    constructor(elementRef, dateAdapter, dateFormats, _formField) {
        super(elementRef, dateAdapter, dateFormats);
        this._formField = _formField;
        this._validator = Validators.compose(super._getValidators());
    }
    /**
     * The datepicker that this input is associated with.
     * @param {?} datepicker
     * @return {?}
     */
    set matDatepicker(datepicker) {
        if (datepicker) {
            this._datepicker = datepicker;
            this._registerModel(datepicker._registerInput(this));
        }
    }
    /**
     * The minimum valid date.
     * @return {?}
     */
    get min() { return this._min; }
    /**
     * @param {?} value
     * @return {?}
     */
    set min(value) {
        this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /**
     * The maximum valid date.
     * @return {?}
     */
    get max() { return this._max; }
    /**
     * @param {?} value
     * @return {?}
     */
    set max(value) {
        this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /**
     * Function that can be used to filter out dates within the datepicker.
     * @return {?}
     */
    get dateFilter() { return this._dateFilter; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dateFilter(value) {
        this._dateFilter = value;
        this._validatorOnChange();
    }
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return {?} The element to connect the popup to.
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /**
     * Returns the palette used by the input's form field, if any.
     * @return {?}
     */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
    /**
     * Gets the value at which the calendar should start.
     * @return {?}
     */
    getStartValue() {
        return this.value;
    }
    /**
     * @deprecated
     * \@breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
     * @return {?}
     */
    getPopupConnectionElementRef() {
        return this.getConnectedOverlayOrigin();
    }
    /**
     * Opens the associated datepicker.
     * @protected
     * @return {?}
     */
    _openPopup() {
        if (this._datepicker) {
            this._datepicker.open();
        }
    }
    /**
     * @protected
     * @param {?} modelValue
     * @return {?}
     */
    _getValueFromModel(modelValue) {
        return modelValue;
    }
    /**
     * @protected
     * @param {?} value
     * @return {?}
     */
    _assignValueToModel(value) {
        if (this._model) {
            this._model.updateSelection(value, this);
        }
    }
    /**
     * Gets the input's minimum date.
     * @protected
     * @return {?}
     */
    _getMinDate() {
        return this._min;
    }
    /**
     * Gets the input's maximum date.
     * @protected
     * @return {?}
     */
    _getMaxDate() {
        return this._max;
    }
    /**
     * Gets the input's date filtering function.
     * @protected
     * @return {?}
     */
    _getDateFilter() {
        return this._dateFilter;
    }
}
MatDatepickerInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[matDatepicker]',
                providers: [
                    MAT_DATEPICKER_VALUE_ACCESSOR,
                    MAT_DATEPICKER_VALIDATORS,
                    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatepickerInput },
                ],
                host: {
                    '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
                    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
                    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(blur)': '_onBlur()',
                    '(keydown)': '_onKeydown($event)',
                },
                exportAs: 'matDatepickerInput',
            },] }
];
/** @nocollapse */
MatDatepickerInput.ctorParameters = () => [
    { type: ElementRef },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }] }
];
MatDatepickerInput.propDecorators = {
    matDatepicker: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    dateFilter: [{ type: Input, args: ['matDatepickerFilter',] }]
};
if (false) {
    /** @type {?} */
    MatDatepickerInput.ngAcceptInputType_value;
    /** @type {?} */
    MatDatepickerInput.prototype._datepicker;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInput.prototype._min;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInput.prototype._max;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInput.prototype._dateFilter;
    /**
     * The combined form control validator for this input.
     * @type {?}
     * @protected
     */
    MatDatepickerInput.prototype._validator;
    /**
     * @type {?}
     * @protected
     */
    MatDatepickerInput.prototype._outsideValueChanged;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerInput.prototype._formField;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-toggle.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Can be used to override the icon of a `matDatepickerToggle`.
 */
class MatDatepickerToggleIcon {
}
MatDatepickerToggleIcon.decorators = [
    { type: Directive, args: [{
                selector: '[matDatepickerToggleIcon]'
            },] }
];
/**
 * @template D
 */
class MatDatepickerToggle {
    /**
     * @param {?} _intl
     * @param {?} _changeDetectorRef
     * @param {?} defaultTabIndex
     */
    constructor(_intl, _changeDetectorRef, defaultTabIndex) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
        /** @type {?} */
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
    }
    /**
     * Whether the toggle button is disabled.
     * @return {?}
     */
    get disabled() {
        if (this._disabled === undefined && this.datepicker) {
            return this.datepicker.disabled;
        }
        return !!this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['datepicker']) {
            this._watchStateChanges();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.unsubscribe();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._watchStateChanges();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _open(event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    }
    /**
     * @private
     * @return {?}
     */
    _watchStateChanges() {
        /** @type {?} */
        const datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : of();
        /** @type {?} */
        const inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
            this.datepicker._datepickerInput._disabledChange : of();
        /** @type {?} */
        const datepickerToggled = this.datepicker ?
            merge(this.datepicker.openedStream, this.datepicker.closedStream) :
            of();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(this._intl.changes, datepickerDisabled, inputDisabled, datepickerToggled).subscribe((/**
         * @return {?}
         */
        () => this._changeDetectorRef.markForCheck()));
    }
}
MatDatepickerToggle.decorators = [
    { type: Component, args: [{
                selector: 'mat-datepicker-toggle',
                template: "<button\n  #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"_intl.openCalendarLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\"\n  (click)=\"_open($event)\">\n\n  <svg\n    *ngIf=\"!_customIcon\"\n    class=\"mat-datepicker-toggle-default-icon\"\n    viewBox=\"0 0 24 24\"\n    width=\"24px\"\n    height=\"24px\"\n    fill=\"currentColor\"\n    focusable=\"false\">\n    <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n  </svg>\n\n  <ng-content select=\"[matDatepickerToggleIcon]\"></ng-content>\n</button>\n",
                host: {
                    'class': 'mat-datepicker-toggle',
                    // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
                    // consumer may have provided, while still being able to receive focus.
                    '[attr.tabindex]': 'disabled ? null : -1',
                    '[class.mat-datepicker-toggle-active]': 'datepicker && datepicker.opened',
                    '[class.mat-accent]': 'datepicker && datepicker.color === "accent"',
                    '[class.mat-warn]': 'datepicker && datepicker.color === "warn"',
                    '(focus)': '_button.focus()',
                },
                exportAs: 'matDatepickerToggle',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-form-field-appearance-legacy .mat-form-field-prefix .mat-datepicker-toggle-default-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-datepicker-toggle-default-icon{width:1em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-datepicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-datepicker-toggle-default-icon{display:block;width:1.5em;height:1.5em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-datepicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-datepicker-toggle-default-icon{margin:auto}\n"]
            }] }
];
/** @nocollapse */
MatDatepickerToggle.ctorParameters = () => [
    { type: MatDatepickerIntl },
    { type: ChangeDetectorRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
MatDatepickerToggle.propDecorators = {
    datepicker: [{ type: Input, args: ['for',] }],
    tabIndex: [{ type: Input }],
    disabled: [{ type: Input }],
    disableRipple: [{ type: Input }],
    _customIcon: [{ type: ContentChild, args: [MatDatepickerToggleIcon,] }],
    _button: [{ type: ViewChild, args: ['button',] }]
};
if (false) {
    /** @type {?} */
    MatDatepickerToggle.ngAcceptInputType_disabled;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerToggle.prototype._stateChanges;
    /**
     * Datepicker instance that the button will toggle.
     * @type {?}
     */
    MatDatepickerToggle.prototype.datepicker;
    /**
     * Tabindex for the toggle.
     * @type {?}
     */
    MatDatepickerToggle.prototype.tabIndex;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerToggle.prototype._disabled;
    /**
     * Whether ripples on the toggle should be disabled.
     * @type {?}
     */
    MatDatepickerToggle.prototype.disableRipple;
    /**
     * Custom icon set by the consumer.
     * @type {?}
     */
    MatDatepickerToggle.prototype._customIcon;
    /**
     * Underlying button element.
     * @type {?}
     */
    MatDatepickerToggle.prototype._button;
    /** @type {?} */
    MatDatepickerToggle.prototype._intl;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerToggle.prototype._changeDetectorRef;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-range-input-parts.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Parent component that should be wrapped around `MatStartDate` and `MatEndDate`.
 * @record
 * @template D
 */
function MatDateRangeInputParent() { }
if (false) {
    /** @type {?} */
    MatDateRangeInputParent.prototype.id;
    /** @type {?} */
    MatDateRangeInputParent.prototype.min;
    /** @type {?} */
    MatDateRangeInputParent.prototype.max;
    /** @type {?} */
    MatDateRangeInputParent.prototype.dateFilter;
    /** @type {?} */
    MatDateRangeInputParent.prototype._startInput;
    /** @type {?} */
    MatDateRangeInputParent.prototype._endInput;
    /** @type {?} */
    MatDateRangeInputParent.prototype._groupDisabled;
    /** @type {?} */
    MatDateRangeInputParent.prototype._ariaDescribedBy;
    /** @type {?} */
    MatDateRangeInputParent.prototype._ariaLabelledBy;
    /** @type {?} */
    MatDateRangeInputParent.prototype._handleChildValueChange;
    /** @type {?} */
    MatDateRangeInputParent.prototype._openDatepicker;
}
/**
 * Used to provide the date range input wrapper component
 * to the parts without circular dependencies.
 * @type {?}
 */
const MAT_DATE_RANGE_INPUT_PARENT = new InjectionToken('MAT_DATE_RANGE_INPUT_PARENT');
/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 * @abstract
 * @template D
 */
class MatDateRangeInputPartBase extends MatDatepickerInputBase {
    /**
     * @param {?} _rangeInput
     * @param {?} elementRef
     * @param {?} _defaultErrorStateMatcher
     * @param {?} _injector
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} dateAdapter
     * @param {?} dateFormats
     */
    constructor(_rangeInput, elementRef, _defaultErrorStateMatcher, _injector, _parentForm, _parentFormGroup, dateAdapter, dateFormats) {
        super(elementRef, dateAdapter, dateFormats);
        this._rangeInput = _rangeInput;
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._injector = _injector;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this._outsideValueChanged = (/**
         * @return {?}
         */
        () => {
            // Whenever the value changes outside the input we need to revalidate, because
            // the validation state of each of the inputs depends on the other one.
            this._validatorOnChange();
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // We need the date input to provide itself as a `ControlValueAccessor` and a `Validator`, while
        // injecting its `NgControl` so that the error state is handled correctly. This introduces a
        // circular dependency, because both `ControlValueAccessor` and `Validator` depend on the input
        // itself. Usually we can work around it for the CVA, but there's no API to do it for the
        // validator. We work around it here by injecting the `NgControl` in `ngOnInit`, after
        // everything has been resolved.
        /** @type {?} */
        const ngControl = this._injector.get(NgControl, null, InjectFlags.Self);
        if (ngControl) {
            this.ngControl = ngControl;
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
        }
    }
    /**
     * Gets whether the input is empty.
     * @return {?}
     */
    isEmpty() {
        return this._elementRef.nativeElement.value.length === 0;
    }
    /**
     * Focuses the input.
     * @return {?}
     */
    focus() {
        this._elementRef.nativeElement.focus();
    }
    /**
     * Handles `input` events on the input element.
     * @param {?} value
     * @return {?}
     */
    _onInput(value) {
        super._onInput(value);
        this._rangeInput._handleChildValueChange();
    }
    /**
     * Opens the datepicker associated with the input.
     * @protected
     * @return {?}
     */
    _openPopup() {
        this._rangeInput._openDatepicker();
    }
    /**
     * Gets the minimum date from the range input.
     * @protected
     * @return {?}
     */
    _getMinDate() {
        return this._rangeInput.min;
    }
    /**
     * Gets the maximum date from the range input.
     * @protected
     * @return {?}
     */
    _getMaxDate() {
        return this._rangeInput.max;
    }
    /**
     * Gets the date filter function from the range input.
     * @protected
     * @return {?}
     */
    _getDateFilter() {
        return this._rangeInput.dateFilter;
    }
    /**
     * @protected
     * @return {?}
     */
    _parentDisabled() {
        return this._rangeInput._groupDisabled;
    }
    /**
     * @param {?} model
     * @return {?}
     */
    _registerModel(model) {
        // The very first time the range inputs write their values, they don't know about the value
        // of the opposite input. When this is combined with the fact that `NgModel` defers writing
        // its value with a `Promise.resolve`, we can get into a situation where the first input
        // resets the value of the second. We work around it by deferring the registration of
        // the model, allowing the input enough time to assign the initial value.
        Promise.resolve().then((/**
         * @return {?}
         */
        () => super._registerModel(model)));
    }
}
MatDateRangeInputPartBase.decorators = [
    { type: Directive }
];
/** @nocollapse */
MatDateRangeInputPartBase.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_INPUT_PARENT,] }] },
    { type: ElementRef },
    { type: ErrorStateMatcher },
    { type: Injector },
    { type: NgForm, decorators: [{ type: Optional }] },
    { type: FormGroupDirective, decorators: [{ type: Optional }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
];
if (false) {
    /**
     * \@docs-private
     * @type {?}
     */
    MatDateRangeInputPartBase.prototype.ngControl;
    /**
     * @type {?}
     * @protected
     */
    MatDateRangeInputPartBase.prototype._validator;
    /**
     * @type {?}
     * @protected
     */
    MatDateRangeInputPartBase.prototype._outsideValueChanged;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._rangeInput;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._defaultErrorStateMatcher;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInputPartBase.prototype._injector;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._parentForm;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._parentFormGroup;
    /**
     * \@docs-private
     * @abstract
     * @return {?}
     */
    MatDateRangeInputPartBase.prototype.updateErrorState = function () { };
    /**
     * @abstract
     * @protected
     * @param {?} value
     * @return {?}
     */
    MatDateRangeInputPartBase.prototype._assignValueToModel = function (value) { };
    /**
     * @abstract
     * @protected
     * @param {?} modelValue
     * @return {?}
     */
    MatDateRangeInputPartBase.prototype._getValueFromModel = function (modelValue) { };
}
/** @type {?} */
const _MatDateRangeInputBase = 
// Needs to be `as any`, because the base class is abstract.
mixinErrorState((/** @type {?} */ (MatDateRangeInputPartBase)));
/**
 * Input for entering the start date in a `mat-date-range-input`.
 * @template D
 */
class MatStartDate extends _MatDateRangeInputBase {
    /**
     * @param {?} rangeInput
     * @param {?} elementRef
     * @param {?} defaultErrorStateMatcher
     * @param {?} injector
     * @param {?} parentForm
     * @param {?} parentFormGroup
     * @param {?} dateAdapter
     * @param {?} dateFormats
     */
    constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
        // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
        // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
        // constructor once ViewEngine is removed.
        super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
        /**
         * Validator that checks that the start date isn't after the end date.
         */
        this._startValidator = (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            /** @type {?} */
            const start = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            /** @type {?} */
            const end = this._model ? this._model.selection.end : null;
            return (!start || !end ||
                this._dateAdapter.compareDate(start, end) <= 0) ?
                null : { 'matStartDateInvalid': { 'end': end, 'actual': start } };
        });
        this._validator = Validators.compose([...super._getValidators(), this._startValidator]);
    }
    /**
     * @protected
     * @param {?} modelValue
     * @return {?}
     */
    _getValueFromModel(modelValue) {
        return modelValue.start;
    }
    /**
     * @protected
     * @param {?} value
     * @return {?}
     */
    _assignValueToModel(value) {
        if (this._model) {
            /** @type {?} */
            const range = new DateRange(value, this._model.selection.end);
            this._model.updateSelection(range, this);
        }
    }
    /**
     * @protected
     * @param {?} value
     * @return {?}
     */
    _formatValue(value) {
        super._formatValue(value);
        // Any time the input value is reformatted we need to tell the parent.
        this._rangeInput._handleChildValueChange();
    }
    /**
     * Gets the value that should be used when mirroring the input's size.
     * @return {?}
     */
    getMirrorValue() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        const value = element.value;
        return value.length > 0 ? value : element.placeholder;
    }
}
MatStartDate.decorators = [
    { type: Directive, args: [{
                selector: 'input[matStartDate]',
                host: {
                    'class': 'mat-date-range-input-inner',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(keydown)': '_onKeydown($event)',
                    '[attr.id]': '_rangeInput.id',
                    '[attr.aria-labelledby]': '_rangeInput._ariaLabelledBy',
                    '[attr.aria-describedby]': '_rangeInput._ariaDescribedBy',
                    '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
                    '[attr.aria-owns]': '(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null',
                    '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
                    '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
                    '(blur)': '_onBlur()',
                    'type': 'text',
                },
                providers: [
                    { provide: NG_VALUE_ACCESSOR, useExisting: MatStartDate, multi: true },
                    { provide: NG_VALIDATORS, useExisting: MatStartDate, multi: true }
                ]
            },] }
];
/** @nocollapse */
MatStartDate.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_INPUT_PARENT,] }] },
    { type: ElementRef },
    { type: ErrorStateMatcher },
    { type: Injector },
    { type: NgForm, decorators: [{ type: Optional }] },
    { type: FormGroupDirective, decorators: [{ type: Optional }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
];
if (false) {
    /** @type {?} */
    MatStartDate.ngAcceptInputType_disabled;
    /**
     * Validator that checks that the start date isn't after the end date.
     * @type {?}
     * @private
     */
    MatStartDate.prototype._startValidator;
    /**
     * @type {?}
     * @protected
     */
    MatStartDate.prototype._validator;
}
/**
 * Input for entering the end date in a `mat-date-range-input`.
 * @template D
 */
class MatEndDate extends _MatDateRangeInputBase {
    /**
     * @param {?} rangeInput
     * @param {?} elementRef
     * @param {?} defaultErrorStateMatcher
     * @param {?} injector
     * @param {?} parentForm
     * @param {?} parentFormGroup
     * @param {?} dateAdapter
     * @param {?} dateFormats
     */
    constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
        // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
        // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
        // constructor once ViewEngine is removed.
        super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
        /**
         * Validator that checks that the end date isn't before the start date.
         */
        this._endValidator = (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            /** @type {?} */
            const end = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            /** @type {?} */
            const start = this._model ? this._model.selection.start : null;
            return (!end || !start ||
                this._dateAdapter.compareDate(end, start) >= 0) ?
                null : { 'matEndDateInvalid': { 'start': start, 'actual': end } };
        });
        this._validator = Validators.compose([...super._getValidators(), this._endValidator]);
    }
    /**
     * @protected
     * @param {?} modelValue
     * @return {?}
     */
    _getValueFromModel(modelValue) {
        return modelValue.end;
    }
    /**
     * @protected
     * @param {?} value
     * @return {?}
     */
    _assignValueToModel(value) {
        if (this._model) {
            /** @type {?} */
            const range = new DateRange(this._model.selection.start, value);
            this._model.updateSelection(range, this);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onKeydown(event) {
        // If the user is pressing backspace on an empty end input, focus focus back to the start.
        if (event.keyCode === BACKSPACE && !this._elementRef.nativeElement.value) {
            this._rangeInput._startInput.focus();
        }
        super._onKeydown(event);
    }
}
MatEndDate.decorators = [
    { type: Directive, args: [{
                selector: 'input[matEndDate]',
                host: {
                    'class': 'mat-date-range-input-inner',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(keydown)': '_onKeydown($event)',
                    '[attr.aria-labelledby]': '_rangeInput._ariaLabelledBy',
                    '[attr.aria-describedby]': '_rangeInput._ariaDescribedBy',
                    '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
                    '[attr.aria-owns]': '(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null',
                    '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
                    '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
                    '(blur)': '_onBlur()',
                    'type': 'text',
                },
                providers: [
                    { provide: NG_VALUE_ACCESSOR, useExisting: MatEndDate, multi: true },
                    { provide: NG_VALIDATORS, useExisting: MatEndDate, multi: true }
                ]
            },] }
];
/** @nocollapse */
MatEndDate.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_INPUT_PARENT,] }] },
    { type: ElementRef },
    { type: ErrorStateMatcher },
    { type: Injector },
    { type: NgForm, decorators: [{ type: Optional }] },
    { type: FormGroupDirective, decorators: [{ type: Optional }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
];
if (false) {
    /** @type {?} */
    MatEndDate.ngAcceptInputType_disabled;
    /**
     * Validator that checks that the end date isn't before the start date.
     * @type {?}
     * @private
     */
    MatEndDate.prototype._endValidator;
    /**
     * @type {?}
     * @protected
     */
    MatEndDate.prototype._validator;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-range-picker.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDateRangePicker"). We can change this to a
// directive if angular adds support for `exportAs: '$implicit'` on directives.
/**
 * Component responsible for managing the date range picker popup/dialog.
 * @template D
 */
class MatDateRangePicker extends MatDatepickerBase {
    /**
     * @protected
     * @param {?} instance
     * @return {?}
     */
    _forwardContentValues(instance) {
        super._forwardContentValues(instance);
        /** @type {?} */
        const input = this._datepickerInput;
        if (input) {
            instance.comparisonStart = input.comparisonStart;
            instance.comparisonEnd = input.comparisonEnd;
        }
    }
}
MatDateRangePicker.decorators = [
    { type: Component, args: [{
                selector: 'mat-date-range-picker',
                template: '',
                exportAs: 'matDateRangePicker',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER]
            }] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-range-input.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
let nextUniqueId = 0;
/**
 * @template D
 */
class MatDateRangeInput {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _elementRef
     * @param {?} control
     * @param {?} _dateAdapter
     * @param {?=} _formField
     */
    constructor(_changeDetectorRef, _elementRef, control, _dateAdapter, _formField) {
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._formField = _formField;
        /**
         * Emits when the input's state has changed.
         */
        this.stateChanges = new Subject();
        /**
         * Unique ID for the input.
         */
        this.id = `mat-date-range-input-${nextUniqueId++}`;
        /**
         * Whether the control is focused.
         */
        this.focused = false;
        /**
         * Name of the form control.
         */
        this.controlType = 'mat-date-range-input';
        this._groupDisabled = false;
        /**
         * Value for the `aria-describedby` attribute of the inputs.
         */
        this._ariaDescribedBy = null;
        /**
         * Value for the `aria-labelledby` attribute of the inputs.
         */
        this._ariaLabelledBy = null;
        /**
         * Separator text to be shown between the inputs.
         */
        this.separator = '–';
        /**
         * Start of the comparison range that should be shown in the calendar.
         */
        this.comparisonStart = null;
        /**
         * End of the comparison range that should be shown in the calendar.
         */
        this.comparisonEnd = null;
        /**
         * Emits when the input's disabled state changes.
         */
        this._disabledChange = new Subject();
        if (!_dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        // TODO(crisbeto): remove `as any` after #18206 lands.
        this.ngControl = (/** @type {?} */ (control));
        this._ariaLabelledBy = _formField ? _formField._labelId : null;
    }
    /**
     * Current value of the range input.
     * @return {?}
     */
    get value() {
        return this._model ? this._model.selection : null;
    }
    /**
     * Whether the control's label should float.
     * @return {?}
     */
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    /**
     * The range picker that this input is associated with.
     * @return {?}
     */
    get rangePicker() { return this._rangePicker; }
    /**
     * @param {?} rangePicker
     * @return {?}
     */
    set rangePicker(rangePicker) {
        if (rangePicker) {
            this._model = rangePicker._registerInput(this);
            this._rangePicker = rangePicker;
            this._registerModel((/** @type {?} */ (this._model)));
        }
    }
    /**
     * Whether the input is required.
     * @return {?}
     */
    get required() { return !!this._required; }
    /**
     * @param {?} value
     * @return {?}
     */
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /**
     * Function that can be used to filter out dates within the date range picker.
     * @return {?}
     */
    get dateFilter() { return this._dateFilter; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dateFilter(value) {
        this._dateFilter = value;
        this._revalidate();
    }
    /**
     * The minimum valid date.
     * @return {?}
     */
    get min() { return this._min; }
    /**
     * @param {?} value
     * @return {?}
     */
    set min(value) {
        this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._revalidate();
    }
    /**
     * The maximum valid date.
     * @return {?}
     */
    get max() { return this._max; }
    /**
     * @param {?} value
     * @return {?}
     */
    set max(value) {
        this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._revalidate();
    }
    /**
     * Whether the input is disabled.
     * @return {?}
     */
    get disabled() {
        return (this._startInput && this._endInput) ?
            (this._startInput.disabled && this._endInput.disabled) :
            this._groupDisabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._groupDisabled) {
            this._groupDisabled = newValue;
            this._disabledChange.next(this.disabled);
        }
    }
    /**
     * Whether the input is in an error state.
     * @return {?}
     */
    get errorState() {
        if (this._startInput && this._endInput) {
            return this._startInput.errorState || this._endInput.errorState;
        }
        return false;
    }
    /**
     * Whether the datepicker input is empty.
     * @return {?}
     */
    get empty() {
        /** @type {?} */
        const startEmpty = this._startInput ? this._startInput.isEmpty() : false;
        /** @type {?} */
        const endEmpty = this._endInput ? this._endInput.isEmpty() : false;
        return startEmpty && endEmpty;
    }
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * \@docs-private
     * @param {?} ids
     * @return {?}
     */
    setDescribedByIds(ids) {
        this._ariaDescribedBy = ids.length ? ids.join(' ') : null;
    }
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * \@docs-private
     * @return {?}
     */
    onContainerClick() {
        if (!this.focused && !this.disabled) {
            if (!this._model || !this._model.selection.start) {
                this._startInput.focus();
            }
            else {
                this._endInput.focus();
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (!this._startInput) {
            throw Error('mat-date-range-input must contain a matStartDate input');
        }
        if (!this._endInput) {
            throw Error('mat-date-range-input must contain a matEndDate input');
        }
        if (this._model) {
            this._registerModel(this._model);
        }
        // We don't need to unsubscribe from this, because we
        // know that the input streams will be completed on destroy.
        merge(this._startInput._disabledChange, this._endInput._disabledChange).subscribe((/**
         * @return {?}
         */
        () => {
            this._disabledChange.next(this.disabled);
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.stateChanges.complete();
        this._disabledChange.unsubscribe();
    }
    /**
     * Gets the date at which the calendar should start.
     * @return {?}
     */
    getStartValue() {
        return this.value ? this.value.start : null;
    }
    /**
     * Gets the input's theme palette.
     * @return {?}
     */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
    /**
     * Gets the element to which the calendar overlay should be attached.
     * @return {?}
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /**
     * Gets the value that is used to mirror the state input.
     * @return {?}
     */
    _getInputMirrorValue() {
        return this._startInput ? this._startInput.getMirrorValue() : '';
    }
    /**
     * Whether the input placeholders should be hidden.
     * @return {?}
     */
    _shouldHidePlaceholders() {
        return this._startInput ? !this._startInput.isEmpty() : false;
    }
    /**
     * Handles the value in one of the child inputs changing.
     * @return {?}
     */
    _handleChildValueChange() {
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Opens the date range picker associated with the input.
     * @return {?}
     */
    _openDatepicker() {
        if (this._rangePicker) {
            this._rangePicker.open();
        }
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
     * Re-runs the validators on the start/end inputs.
     * @private
     * @return {?}
     */
    _revalidate() {
        if (this._startInput) {
            this._startInput._validatorOnChange();
        }
        if (this._endInput) {
            this._endInput._validatorOnChange();
        }
    }
    /**
     * Registers the current date selection model with the start/end inputs.
     * @private
     * @param {?} model
     * @return {?}
     */
    _registerModel(model) {
        if (this._startInput) {
            this._startInput._registerModel(model);
        }
        if (this._endInput) {
            this._endInput._registerModel(model);
        }
    }
}
MatDateRangeInput.decorators = [
    { type: Component, args: [{
                selector: 'mat-date-range-input',
                template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"focused = $event !== null\">\n  <div class=\"mat-date-range-input-start-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue()}}</span>\n  </div>\n\n  <span class=\"mat-date-range-input-separator\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n  </div>\n</div>\n\n",
                exportAs: 'matDateRangeInput',
                host: {
                    'class': 'mat-date-range-input',
                    '[class.mat-date-range-input-hide-placeholders]': '_shouldHidePlaceholders()',
                    '[attr.id]': 'null',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [
                    { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
                    { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
                ],
                styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{margin:0 4px;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-separator{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner::-ms-clear,.mat-date-range-input-inner::-ms-reveal{display:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"]
            }] }
];
/** @nocollapse */
MatDateRangeInput.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Self }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: MatFormField, decorators: [{ type: Optional }] }
];
MatDateRangeInput.propDecorators = {
    rangePicker: [{ type: Input }],
    required: [{ type: Input }],
    dateFilter: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    disabled: [{ type: Input }],
    separator: [{ type: Input }],
    comparisonStart: [{ type: Input }],
    comparisonEnd: [{ type: Input }],
    _startInput: [{ type: ContentChild, args: [MatStartDate,] }],
    _endInput: [{ type: ContentChild, args: [MatEndDate,] }]
};
if (false) {
    /** @type {?} */
    MatDateRangeInput.ngAcceptInputType_required;
    /** @type {?} */
    MatDateRangeInput.ngAcceptInputType_disabled;
    /**
     * Emits when the input's state has changed.
     * @type {?}
     */
    MatDateRangeInput.prototype.stateChanges;
    /**
     * Unique ID for the input.
     * @type {?}
     */
    MatDateRangeInput.prototype.id;
    /**
     * Whether the control is focused.
     * @type {?}
     */
    MatDateRangeInput.prototype.focused;
    /**
     * Name of the form control.
     * @type {?}
     */
    MatDateRangeInput.prototype.controlType;
    /**
     * Implemented as a part of `MatFormFieldControl`, but not used.
     * Set the placeholder attribute on `matStartDate` and `matEndDate`.
     * \@docs-private
     * @type {?}
     */
    MatDateRangeInput.prototype.placeholder;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._rangePicker;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._required;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._dateFilter;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._min;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._max;
    /** @type {?} */
    MatDateRangeInput.prototype._groupDisabled;
    /**
     * Value for the `aria-describedby` attribute of the inputs.
     * @type {?}
     */
    MatDateRangeInput.prototype._ariaDescribedBy;
    /**
     * Value for the `aria-labelledby` attribute of the inputs.
     * @type {?}
     */
    MatDateRangeInput.prototype._ariaLabelledBy;
    /**
     * Date selection model currently registered with the input.
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._model;
    /**
     * Separator text to be shown between the inputs.
     * @type {?}
     */
    MatDateRangeInput.prototype.separator;
    /**
     * Start of the comparison range that should be shown in the calendar.
     * @type {?}
     */
    MatDateRangeInput.prototype.comparisonStart;
    /**
     * End of the comparison range that should be shown in the calendar.
     * @type {?}
     */
    MatDateRangeInput.prototype.comparisonEnd;
    /** @type {?} */
    MatDateRangeInput.prototype._startInput;
    /** @type {?} */
    MatDateRangeInput.prototype._endInput;
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * TODO(crisbeto): change type to `AbstractControlDirective` after #18206 lands.
     * \@docs-private
     * @type {?}
     */
    MatDateRangeInput.prototype.ngControl;
    /**
     * Emits when the input's disabled state changes.
     * @type {?}
     */
    MatDateRangeInput.prototype._disabledChange;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._dateAdapter;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInput.prototype._formField;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MatDatepickerModule {
}
MatDatepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MatButtonModule,
                    MatDialogModule,
                    OverlayModule,
                    A11yModule,
                    PortalModule,
                ],
                exports: [
                    CdkScrollableModule,
                    MatCalendar,
                    MatCalendarBody,
                    MatDatepicker,
                    MatDatepickerContent,
                    MatDatepickerInput,
                    MatDatepickerToggle,
                    MatDatepickerToggleIcon,
                    MatMonthView,
                    MatYearView,
                    MatMultiYearView,
                    MatCalendarHeader,
                    MatDateRangeInput,
                    MatStartDate,
                    MatEndDate,
                    MatDateRangePicker,
                ],
                declarations: [
                    MatCalendar,
                    MatCalendarBody,
                    MatDatepicker,
                    MatDatepickerContent,
                    MatDatepickerInput,
                    MatDatepickerToggle,
                    MatDatepickerToggleIcon,
                    MatMonthView,
                    MatYearView,
                    MatMultiYearView,
                    MatCalendarHeader,
                    MatDateRangeInput,
                    MatStartDate,
                    MatEndDate,
                    MatDateRangePicker,
                ],
                providers: [
                    MatDatepickerIntl,
                    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
                    {
                        provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
                        useClass: DefaultMatCalendarRangeStrategy
                    }
                ],
                entryComponents: [
                    MatDatepickerContent,
                    MatCalendarHeader,
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DateRange, DefaultMatCalendarRangeStrategy, MAT_DATEPICKER_SCROLL_STRATEGY, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, MAT_DATEPICKER_VALIDATORS, MAT_DATEPICKER_VALUE_ACCESSOR, MAT_DATE_RANGE_SELECTION_STRATEGY, MAT_RANGE_DATE_SELECTION_MODEL_FACTORY, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER, MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY, MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER, MatCalendar, MatCalendarBody, MatCalendarCell, MatCalendarHeader, MatDateRangeInput, MatDateRangePicker, MatDateSelectionModel, MatDatepicker, MatDatepickerContent, MatDatepickerInput, MatDatepickerInputEvent, MatDatepickerIntl, MatDatepickerModule, MatDatepickerToggle, MatDatepickerToggleIcon, MatEndDate, MatMonthView, MatMultiYearView, MatRangeDateSelectionModel, MatSingleDateSelectionModel, MatStartDate, MatYearView, matDatepickerAnimations, yearsPerPage, yearsPerRow, MatDatepickerBase as ɵangular_material_src_material_datepicker_datepicker_a, MatDatepickerInputBase as ɵangular_material_src_material_datepicker_datepicker_b, MAT_DATE_RANGE_INPUT_PARENT as ɵangular_material_src_material_datepicker_datepicker_c };
//# sourceMappingURL=datepicker.js.map
