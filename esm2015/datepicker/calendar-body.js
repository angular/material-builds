/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/calendar-body.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation, NgZone, } from '@angular/core';
import { take } from 'rxjs/operators';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * \@docs-private
 * @template D
 */
export class MatCalendarCell {
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
export function MatCalendarUserEvent() { }
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
let MatCalendarBody = /** @class */ (() => {
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
                    template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\n  <td class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"numCols\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n  <!--\n    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\n    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a\n    percentage of the width (a variant of the trick described here:\n    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\n      aria-hidden=\"true\"\n      class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"_firstRowOffset\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n  </td>\n  <td *ngFor=\"let item of row; let colIndex = index\"\n      role=\"gridcell\"\n      class=\"mat-calendar-body-cell\"\n      [ngClass]=\"item.cssClasses\"\n      [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n      [attr.data-mat-row]=\"rowIndex\"\n      [attr.data-mat-col]=\"colIndex\"\n      [class.mat-calendar-body-disabled]=\"!item.enabled\"\n      [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n      [class.mat-calendar-body-range-start]=\"_isRangeStart(item.compareValue)\"\n      [class.mat-calendar-body-range-end]=\"_isRangeEnd(item.compareValue)\"\n      [class.mat-calendar-body-in-range]=\"_isInRange(item.compareValue)\"\n      [class.mat-calendar-body-comparison-bridge-start]=\"_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)\"\n      [class.mat-calendar-body-comparison-bridge-end]=\"_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)\"\n      [class.mat-calendar-body-comparison-start]=\"_isComparisonStart(item.compareValue)\"\n      [class.mat-calendar-body-comparison-end]=\"_isComparisonEnd(item.compareValue)\"\n      [class.mat-calendar-body-in-comparison-range]=\"_isInComparisonRange(item.compareValue)\"\n      [class.mat-calendar-body-preview-start]=\"_isPreviewStart(item.compareValue)\"\n      [class.mat-calendar-body-preview-end]=\"_isPreviewEnd(item.compareValue)\"\n      [class.mat-calendar-body-in-preview]=\"_isInPreview(item.compareValue)\"\n      [attr.aria-label]=\"item.ariaLabel\"\n      [attr.aria-disabled]=\"!item.enabled || null\"\n      [attr.aria-selected]=\"_isSelected(item)\"\n      (click)=\"_cellClicked(item, $event)\"\n      [style.width]=\"_cellWidth\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n      <div class=\"mat-calendar-body-cell-content mat-focus-indicator\"\n        [class.mat-calendar-body-selected]=\"_isSelected(item)\"\n        [class.mat-calendar-body-today]=\"todayValue === item.compareValue\">\n        {{item.displayValue}}\n      </div>\n      <div class=\"mat-calendar-body-cell-preview\"></div>\n  </td>\n</tr>\n",
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
    return MatCalendarBody;
})();
export { MatCalendarBody };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEdBSVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7QUFXcEMsTUFBTSxPQUFPLGVBQWU7Ozs7Ozs7Ozs7SUFDMUIsWUFBbUIsS0FBYSxFQUNiLFlBQW9CLEVBQ3BCLFNBQWlCLEVBQ2pCLE9BQWdCLEVBQ2hCLGFBQXdDLEVBQUUsRUFDMUMsZUFBZSxLQUFLLEVBQ3BCLFFBQVk7UUFOWixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGVBQVUsR0FBVixVQUFVLENBQWdDO1FBQzFDLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQUk7SUFBRyxDQUFDO0NBQ3BDOzs7SUFQYSxnQ0FBb0I7O0lBQ3BCLHVDQUEyQjs7SUFDM0Isb0NBQXdCOztJQUN4QixrQ0FBdUI7O0lBQ3ZCLHFDQUFpRDs7SUFDakQsdUNBQTJCOztJQUMzQixtQ0FBbUI7Ozs7Ozs7QUFJakMsMENBR0M7OztJQUZDLHFDQUFTOztJQUNULHFDQUFhOzs7Ozs7QUFPZjs7Ozs7SUFBQSxNQWFhLGVBQWU7Ozs7O1FBb0UxQixZQUFvQixXQUFvQyxFQUFVLE9BQWU7WUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1lBQVUsWUFBTyxHQUFQLE9B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SSxLQUFLLEtBQUssR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLElBQUksS0FBSyxLQUFLLEtBQUssQ0FBQztBQUN6RSxDQUFDOzs7Ozs7OztBQUdELFNBQVMsS0FBSyxDQUFDLEtBQWEsRUFBRSxLQUFvQixFQUFFLEdBQWtCO0lBQ3BFLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssR0FBRyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxLQUFLLEdBQUcsQ0FBQztBQUM1RSxDQUFDOzs7Ozs7Ozs7QUFHRCxTQUFTLFNBQVMsQ0FBQyxLQUFhLEVBQ2IsS0FBb0IsRUFDcEIsR0FBa0IsRUFDbEIsWUFBcUI7SUFDdEMsT0FBTyxZQUFZLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHO1FBQy9ELEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogRXh0cmEgQ1NTIGNsYXNzZXMgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgY2FsZW5kYXIgY2VsbC5cbiAqL1xuZXhwb3J0IHR5cGUgTWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcyA9IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fTtcblxuLyoqXG4gKiBBbiBpbnRlcm5hbCBjbGFzcyB0aGF0IHJlcHJlc2VudHMgdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byBhIHNpbmdsZSBjYWxlbmRhciBjZWxsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXJDZWxsPEQgPSBhbnk+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBkaXNwbGF5VmFsdWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIGFyaWFMYWJlbDogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIGNzc0NsYXNzZXM6IE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMgPSB7fSxcbiAgICAgICAgICAgICAgcHVibGljIGNvbXBhcmVWYWx1ZSA9IHZhbHVlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmF3VmFsdWU/OiBEKSB7fVxufVxuXG4vKiogRXZlbnQgZW1pdHRlZCB3aGVuIGEgZGF0ZSBpbnNpZGUgdGhlIGNhbGVuZGFyIGlzIHRyaWdnZXJlZCBhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDYWxlbmRhclVzZXJFdmVudDxEPiB7XG4gIHZhbHVlOiBEO1xuICBldmVudDogRXZlbnQ7XG59XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHVzZWQgdG8gZGlzcGxheSBjYWxlbmRhciBkYXRhIGluIGEgdGFibGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FsZW5kYXItYm9keV0nLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWJvZHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjYWxlbmRhci1ib2R5LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYWxlbmRhci1ib2R5JyxcbiAgICAncm9sZSc6ICdncmlkJyxcbiAgICAnYXJpYS1yZWFkb25seSc6ICd0cnVlJ1xuICB9LFxuICBleHBvcnRBczogJ21hdENhbGVuZGFyQm9keScsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckJvZHkgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBVc2VkIHRvIHNraXAgdGhlIG5leHQgZm9jdXMgZXZlbnQgd2hlbiByZW5kZXJpbmcgdGhlIHByZXZpZXcgcmFuZ2UuXG4gICAqIFdlIG5lZWQgYSBmbGFnIGxpa2UgdGhpcywgYmVjYXVzZSBzb21lIGJyb3dzZXJzIGZpcmUgZm9jdXMgZXZlbnRzIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc2tpcE5leHRGb2N1czogYm9vbGVhbjtcblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgdGFibGUuIChlLmcuIFwiSmFuIDIwMTdcIikuICovXG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBjZWxscyB0byBkaXNwbGF5IGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgcm93czogTWF0Q2FsZW5kYXJDZWxsW11bXTtcblxuICAvKiogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRvZGF5LiAqL1xuICBASW5wdXQoKSB0b2RheVZhbHVlOiBudW1iZXI7XG5cbiAgLyoqIFN0YXJ0IHZhbHVlIG9mIHRoZSBzZWxlY3RlZCBkYXRlIHJhbmdlLiAqL1xuICBASW5wdXQoKSBzdGFydFZhbHVlOiBudW1iZXI7XG5cbiAgLyoqIEVuZCB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS4gKi9cbiAgQElucHV0KCkgZW5kVmFsdWU6IG51bWJlcjtcblxuICAvKiogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGZyZWUgY2VsbHMgbmVlZGVkIHRvIGZpdCB0aGUgbGFiZWwgaW4gdGhlIGZpcnN0IHJvdy4gKi9cbiAgQElucHV0KCkgbGFiZWxNaW5SZXF1aXJlZENlbGxzOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIG51bUNvbHM6IG51bWJlciA9IDc7XG5cbiAgLyoqIFRoZSBjZWxsIG51bWJlciBvZiB0aGUgYWN0aXZlIGNlbGwgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSBhY3RpdmVDZWxsOiBudW1iZXIgPSAwO1xuXG4gIC8qKiBXaGV0aGVyIGEgcmFuZ2UgaXMgYmVpbmcgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpIGlzUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGFzcGVjdCByYXRpbyAod2lkdGggLyBoZWlnaHQpIHRvIHVzZSBmb3IgdGhlIGNlbGxzIGluIHRoZSB0YWJsZS4gVGhpcyBhc3BlY3QgcmF0aW8gd2lsbCBiZVxuICAgKiBtYWludGFpbmVkIGV2ZW4gYXMgdGhlIHRhYmxlIHJlc2l6ZXMuXG4gICAqL1xuICBASW5wdXQoKSBjZWxsQXNwZWN0UmF0aW86IG51bWJlciA9IDE7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogU3RhcnQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIEBJbnB1dCgpIHByZXZpZXdTdGFydDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgQElucHV0KCkgcHJldmlld0VuZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgdmFsdWUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZFZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8bnVtYmVyPj4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxudW1iZXI+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBwcmV2aWV3IGhhcyBjaGFuZ2VkIGFzIGEgcmVzdWx0IG9mIGEgdXNlciBhY3Rpb24uICovXG4gIEBPdXRwdXQoKSBwcmV2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxNYXRDYWxlbmRhckNlbGwgfCBudWxsPj4oKTtcblxuICAvKiogVGhlIG51bWJlciBvZiBibGFuayBjZWxscyB0byBwdXQgYXQgdGhlIGJlZ2lubmluZyBmb3IgdGhlIGZpcnN0IHJvdy4gKi9cbiAgX2ZpcnN0Um93T2Zmc2V0OiBudW1iZXI7XG5cbiAgLyoqIFBhZGRpbmcgZm9yIHRoZSBpbmRpdmlkdWFsIGRhdGUgY2VsbHMuICovXG4gIF9jZWxsUGFkZGluZzogc3RyaW5nO1xuXG4gIC8qKiBXaWR0aCBvZiBhbiBpbmRpdmlkdWFsIGNlbGwuICovXG4gIF9jZWxsV2lkdGg6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICBfbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fZW50ZXJIYW5kbGVyLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5fbGVhdmVIYW5kbGVyLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gYSBjZWxsIGlzIGNsaWNrZWQuICovXG4gIF9jZWxsQ2xpY2tlZChjZWxsOiBNYXRDYWxlbmRhckNlbGwsIGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGNlbGwuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlQ2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsLnZhbHVlLCBldmVudH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgYSBjZWxsIHNob3VsZCBiZSBtYXJrZWQgYXMgc2VsZWN0ZWQuICovXG4gIF9pc1NlbGVjdGVkKGNlbGw6IE1hdENhbGVuZGFyQ2VsbCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0VmFsdWUgPT09IGNlbGwuY29tcGFyZVZhbHVlIHx8IHRoaXMuZW5kVmFsdWUgPT09IGNlbGwuY29tcGFyZVZhbHVlO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGNvbHVtbkNoYW5nZXMgPSBjaGFuZ2VzWydudW1Db2xzJ107XG4gICAgY29uc3Qge3Jvd3MsIG51bUNvbHN9ID0gdGhpcztcblxuICAgIGlmIChjaGFuZ2VzWydyb3dzJ10gfHwgY29sdW1uQ2hhbmdlcykge1xuICAgICAgdGhpcy5fZmlyc3RSb3dPZmZzZXQgPSByb3dzICYmIHJvd3MubGVuZ3RoICYmIHJvd3NbMF0ubGVuZ3RoID8gbnVtQ29scyAtIHJvd3NbMF0ubGVuZ3RoIDogMDtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1snY2VsbEFzcGVjdFJhdGlvJ10gfHwgY29sdW1uQ2hhbmdlcyB8fCAhdGhpcy5fY2VsbFBhZGRpbmcpIHtcbiAgICAgIHRoaXMuX2NlbGxQYWRkaW5nID0gYCR7NTAgKiB0aGlzLmNlbGxBc3BlY3RSYXRpbyAvIG51bUNvbHN9JWA7XG4gICAgfVxuXG4gICAgaWYgKGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxXaWR0aCkge1xuICAgICAgdGhpcy5fY2VsbFdpZHRoID0gYCR7MTAwIC8gbnVtQ29sc30lYDtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX2VudGVySGFuZGxlciwgdHJ1ZSk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX2VudGVySGFuZGxlciwgdHJ1ZSk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5fbGVhdmVIYW5kbGVyLCB0cnVlKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9sZWF2ZUhhbmRsZXIsIHRydWUpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgd2hldGhlciBhIGNlbGwgaXMgYWN0aXZlLiAqL1xuICBfaXNBY3RpdmVDZWxsKHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBsZXQgY2VsbE51bWJlciA9IHJvd0luZGV4ICogdGhpcy5udW1Db2xzICsgY29sSW5kZXg7XG5cbiAgICAvLyBBY2NvdW50IGZvciB0aGUgZmFjdCB0aGF0IHRoZSBmaXJzdCByb3cgbWF5IG5vdCBoYXZlIGFzIG1hbnkgY2VsbHMuXG4gICAgaWYgKHJvd0luZGV4KSB7XG4gICAgICBjZWxsTnVtYmVyIC09IHRoaXMuX2ZpcnN0Um93T2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiBjZWxsTnVtYmVyID09IHRoaXMuYWN0aXZlQ2VsbDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciB0aGUgbWljcm90YXNrIHF1ZXVlIGlzIGVtcHR5LiAqL1xuICBfZm9jdXNBY3RpdmVDZWxsKG1vdmVQcmV2aWV3ID0gdHJ1ZSkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3RpdmVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwgPVxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXQtY2FsZW5kYXItYm9keS1hY3RpdmUnKTtcblxuICAgICAgICBpZiAoYWN0aXZlQ2VsbCkge1xuICAgICAgICAgIGlmICghbW92ZVByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuX3NraXBOZXh0Rm9jdXMgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGl2ZUNlbGwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBtYWluIHJhbmdlLiAqL1xuICBfaXNSYW5nZVN0YXJ0KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNTdGFydCh2YWx1ZSwgdGhpcy5zdGFydFZhbHVlLCB0aGlzLmVuZFZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgZW5kIG9mIHRoZSBtYWluIHJhbmdlLiAqL1xuICBfaXNSYW5nZUVuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzRW5kKHZhbHVlLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuZW5kVmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHdpdGhpbiB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHJhbmdlLiAqL1xuICBfaXNJblJhbmdlKHZhbHVlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNJblJhbmdlKHZhbHVlLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuZW5kVmFsdWUsIHRoaXMuaXNSYW5nZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBfaXNDb21wYXJpc29uU3RhcnQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc1N0YXJ0KHZhbHVlLCB0aGlzLmNvbXBhcmlzb25TdGFydCwgdGhpcy5jb21wYXJpc29uRW5kKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIGEgc3RhcnQgYnJpZGdlIGNlbGwgYmV0d2VlbiB0aGUgbWFpbiBhbmQgY29tcGFyaXNvbiByYW5nZXMuICovXG4gIF9pc0NvbXBhcmlzb25CcmlkZ2VTdGFydCh2YWx1ZTogbnVtYmVyLCByb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLl9pc0NvbXBhcmlzb25TdGFydCh2YWx1ZSkgfHwgdGhpcy5faXNSYW5nZVN0YXJ0KHZhbHVlKSB8fCAhdGhpcy5faXNJblJhbmdlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBwcmV2aW91c0NlbGw6IE1hdENhbGVuZGFyQ2VsbCB8IHVuZGVmaW5lZCA9IHRoaXMucm93c1tyb3dJbmRleF1bY29sSW5kZXggLSAxXTtcblxuICAgIGlmICghcHJldmlvdXNDZWxsKSB7XG4gICAgICBjb25zdCBwcmV2aW91c1JvdyA9IHRoaXMucm93c1tyb3dJbmRleCAtIDFdO1xuICAgICAgcHJldmlvdXNDZWxsID0gcHJldmlvdXNSb3cgJiYgcHJldmlvdXNSb3dbcHJldmlvdXNSb3cubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZXZpb3VzQ2VsbCAmJiAhdGhpcy5faXNSYW5nZUVuZChwcmV2aW91c0NlbGwuY29tcGFyZVZhbHVlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIGFuIGVuZCBicmlkZ2UgY2VsbCBiZXR3ZWVuIHRoZSBtYWluIGFuZCBjb21wYXJpc29uIHJhbmdlcy4gKi9cbiAgX2lzQ29tcGFyaXNvbkJyaWRnZUVuZCh2YWx1ZTogbnVtYmVyLCByb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLl9pc0NvbXBhcmlzb25FbmQodmFsdWUpIHx8IHRoaXMuX2lzUmFuZ2VFbmQodmFsdWUpIHx8ICF0aGlzLl9pc0luUmFuZ2UodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IG5leHRDZWxsOiBNYXRDYWxlbmRhckNlbGwgfCB1bmRlZmluZWQgPSB0aGlzLnJvd3Nbcm93SW5kZXhdW2NvbEluZGV4ICsgMV07XG5cbiAgICBpZiAoIW5leHRDZWxsKSB7XG4gICAgICBjb25zdCBuZXh0Um93ID0gdGhpcy5yb3dzW3Jvd0luZGV4ICsgMV07XG4gICAgICBuZXh0Q2VsbCA9IG5leHRSb3cgJiYgbmV4dFJvd1swXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dENlbGwgJiYgIXRoaXMuX2lzUmFuZ2VTdGFydChuZXh0Q2VsbC5jb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIF9pc0NvbXBhcmlzb25FbmQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0VuZCh2YWx1ZSwgdGhpcy5jb21wYXJpc29uU3RhcnQsIHRoaXMuY29tcGFyaXNvbkVuZCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgd2l0aGluIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIF9pc0luQ29tcGFyaXNvblJhbmdlKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNJblJhbmdlKHZhbHVlLCB0aGlzLmNvbXBhcmlzb25TdGFydCwgdGhpcy5jb21wYXJpc29uRW5kLCB0aGlzLmlzUmFuZ2UpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzdGFydCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX2lzUHJldmlld1N0YXJ0KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNTdGFydCh2YWx1ZSwgdGhpcy5wcmV2aWV3U3RhcnQsIHRoaXMucHJldmlld0VuZCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX2lzUHJldmlld0VuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzRW5kKHZhbHVlLCB0aGlzLnByZXZpZXdTdGFydCwgdGhpcy5wcmV2aWV3RW5kKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyBpbnNpZGUgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIF9pc0luUHJldmlldyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzSW5SYW5nZSh2YWx1ZSwgdGhpcy5wcmV2aWV3U3RhcnQsIHRoaXMucHJldmlld0VuZCwgdGhpcy5pc1JhbmdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB1c2VyIGVudGVycyBhbiBlbGVtZW50XG4gICAqIGluc2lkZSB0aGUgY2FsZW5kYXIgYm9keSAoZS5nLiBieSBob3ZlcmluZyBpbiBvciBmb2N1cykuXG4gICAqL1xuICBwcml2YXRlIF9lbnRlckhhbmRsZXIgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX3NraXBOZXh0Rm9jdXMgJiYgZXZlbnQudHlwZSA9PT0gJ2ZvY3VzJykge1xuICAgICAgdGhpcy5fc2tpcE5leHRGb2N1cyA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIG9ubHkgbmVlZCB0byBoaXQgdGhlIHpvbmUgd2hlbiB3ZSdyZSBzZWxlY3RpbmcgYSByYW5nZS5cbiAgICBpZiAoZXZlbnQudGFyZ2V0ICYmIHRoaXMuaXNSYW5nZSkge1xuICAgICAgY29uc3QgY2VsbCA9IHRoaXMuX2dldENlbGxGcm9tRWxlbWVudChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuXG4gICAgICBpZiAoY2VsbCkge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMucHJldmlld0NoYW5nZS5lbWl0KHt2YWx1ZTogY2VsbC5lbmFibGVkID8gY2VsbCA6IG51bGwsIGV2ZW50fSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB1c2VyJ3MgcG9pbnRlciBsZWF2ZXMgYW4gZWxlbWVudFxuICAgKiBpbnNpZGUgdGhlIGNhbGVuZGFyIGJvZHkgKGUuZy4gYnkgaG92ZXJpbmcgb3V0IG9yIGJsdXJyaW5nKS5cbiAgICovXG4gIHByaXZhdGUgX2xlYXZlSGFuZGxlciA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gaGl0IHRoZSB6b25lIHdoZW4gd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgaWYgKHRoaXMucHJldmlld0VuZCAhPT0gbnVsbCAmJiB0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIC8vIE9ubHkgcmVzZXQgdGhlIHByZXZpZXcgZW5kIHZhbHVlIHdoZW4gbGVhdmluZyBjZWxscy4gVGhpcyBsb29rcyBiZXR0ZXIsIGJlY2F1c2VcbiAgICAgIC8vIHdlIGhhdmUgYSBnYXAgYmV0d2VlbiB0aGUgY2VsbHMgYW5kIHRoZSByb3dzIGFuZCB3ZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGVcbiAgICAgIC8vIHJhbmdlIGp1c3QgZm9yIGl0IHRvIHNob3cgdXAgYWdhaW4gd2hlbiB0aGUgdXNlciBtb3ZlcyBhIGZldyBwaXhlbHMgdG8gdGhlIHNpZGUuXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ICYmIGlzVGFibGVDZWxsKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7dmFsdWU6IG51bGwsIGV2ZW50fSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBGaW5kcyB0aGUgTWF0Q2FsZW5kYXJDZWxsIHRoYXQgY29ycmVzcG9uZHMgdG8gYSBET00gbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2VsbEZyb21FbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogTWF0Q2FsZW5kYXJDZWxsIHwgbnVsbCB7XG4gICAgbGV0IGNlbGw6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKGlzVGFibGVDZWxsKGVsZW1lbnQpKSB7XG4gICAgICBjZWxsID0gZWxlbWVudDtcbiAgICB9IGVsc2UgaWYgKGlzVGFibGVDZWxsKGVsZW1lbnQucGFyZW50Tm9kZSEpKSB7XG4gICAgICBjZWxsID0gZWxlbWVudC5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50O1xuICAgIH1cblxuICAgIGlmIChjZWxsKSB7XG4gICAgICBjb25zdCByb3cgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtcm93Jyk7XG4gICAgICBjb25zdCBjb2wgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtY29sJyk7XG5cbiAgICAgIGlmIChyb3cgJiYgY29sKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3NbcGFyc2VJbnQocm93KV1bcGFyc2VJbnQoY29sKV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSBub2RlIGlzIGEgdGFibGUgY2VsbCBlbGVtZW50LiAqL1xuZnVuY3Rpb24gaXNUYWJsZUNlbGwobm9kZTogTm9kZSk6IG5vZGUgaXMgSFRNTFRhYmxlQ2VsbEVsZW1lbnQge1xuICByZXR1cm4gbm9kZS5ub2RlTmFtZSA9PT0gJ1REJztcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIGEgcmFuZ2UuICovXG5mdW5jdGlvbiBpc1N0YXJ0KHZhbHVlOiBudW1iZXIsIHN0YXJ0OiBudW1iZXIgfCBudWxsLCBlbmQ6IG51bWJlciB8IG51bGwpOiBib29sZWFuIHtcbiAgcmV0dXJuIGVuZCAhPT0gbnVsbCAmJiBzdGFydCAhPT0gZW5kICYmIHZhbHVlIDwgZW5kICYmIHZhbHVlID09PSBzdGFydDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiBhIHJhbmdlLiAqL1xuZnVuY3Rpb24gaXNFbmQodmFsdWU6IG51bWJlciwgc3RhcnQ6IG51bWJlciB8IG51bGwsIGVuZDogbnVtYmVyIHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RhcnQgIT09IG51bGwgJiYgc3RhcnQgIT09IGVuZCAmJiB2YWx1ZSA+PSBzdGFydCAmJiB2YWx1ZSA9PT0gZW5kO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSB2YWx1ZSBpcyBpbnNpZGUgb2YgYSByYW5nZS4gKi9cbmZ1bmN0aW9uIGlzSW5SYW5nZSh2YWx1ZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBudW1iZXIgfCBudWxsLFxuICAgICAgICAgICAgICAgICAgIGVuZDogbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICByYW5nZUVuYWJsZWQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgcmV0dXJuIHJhbmdlRW5hYmxlZCAmJiBzdGFydCAhPT0gbnVsbCAmJiBlbmQgIT09IG51bGwgJiYgc3RhcnQgIT09IGVuZCAmJlxuICAgICAgICAgdmFsdWUgPj0gc3RhcnQgJiYgdmFsdWUgPD0gZW5kO1xufVxuIl19