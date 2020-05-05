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
 * @docs-private
 */
var MatCalendarCell = /** @class */ (function () {
    function MatCalendarCell(value, displayValue, ariaLabel, enabled, cssClasses, compareValue, rawValue) {
        if (cssClasses === void 0) { cssClasses = {}; }
        if (compareValue === void 0) { compareValue = value; }
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.cssClasses = cssClasses;
        this.compareValue = compareValue;
        this.rawValue = rawValue;
    }
    return MatCalendarCell;
}());
export { MatCalendarCell };
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
var MatCalendarBody = /** @class */ (function () {
    function MatCalendarBody(_elementRef, _ngZone) {
        var _this = this;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /** The number of columns in the table. */
        this.numCols = 7;
        /** The cell number of the active cell in the table. */
        this.activeCell = 0;
        /** Whether a range is being selected. */
        this.isRange = false;
        /**
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /** Start of the preview range. */
        this.previewStart = null;
        /** End of the preview range. */
        this.previewEnd = null;
        /** Emits when a new value is selected. */
        this.selectedValueChange = new EventEmitter();
        /** Emits when the preview has changed as a result of a user action. */
        this.previewChange = new EventEmitter();
        /**
         * Event handler for when the user enters an element
         * inside the calendar body (e.g. by hovering in or focus).
         */
        this._enterHandler = function (event) {
            if (_this._skipNextFocus && event.type === 'focus') {
                _this._skipNextFocus = false;
                return;
            }
            // We only need to hit the zone when we're selecting a range.
            if (event.target && _this.isRange) {
                var cell_1 = _this._getCellFromElement(event.target);
                if (cell_1) {
                    _this._ngZone.run(function () { return _this.previewChange.emit({ value: cell_1.enabled ? cell_1 : null, event: event }); });
                }
            }
        };
        /**
         * Event handler for when the user's pointer leaves an element
         * inside the calendar body (e.g. by hovering out or blurring).
         */
        this._leaveHandler = function (event) {
            // We only need to hit the zone when we're selecting a range.
            if (_this.previewEnd !== null && _this.isRange) {
                // Only reset the preview end value when leaving cells. This looks better, because
                // we have a gap between the cells and the rows and we don't want to remove the
                // range just for it to show up again when the user moves a few pixels to the side.
                if (event.target && isTableCell(event.target)) {
                    _this._ngZone.run(function () { return _this.previewChange.emit({ value: null, event: event }); });
                }
            }
        };
        _ngZone.runOutsideAngular(function () {
            var element = _elementRef.nativeElement;
            element.addEventListener('mouseenter', _this._enterHandler, true);
            element.addEventListener('focus', _this._enterHandler, true);
            element.addEventListener('mouseleave', _this._leaveHandler, true);
            element.addEventListener('blur', _this._leaveHandler, true);
        });
    }
    /** Called when a cell is clicked. */
    MatCalendarBody.prototype._cellClicked = function (cell, event) {
        if (cell.enabled) {
            this.selectedValueChange.emit({ value: cell.value, event: event });
        }
    };
    /** Returns whether a cell should be marked as selected. */
    MatCalendarBody.prototype._isSelected = function (cell) {
        return this.startValue === cell.compareValue || this.endValue === cell.compareValue;
    };
    MatCalendarBody.prototype.ngOnChanges = function (changes) {
        var columnChanges = changes['numCols'];
        var _a = this, rows = _a.rows, numCols = _a.numCols;
        if (changes['rows'] || columnChanges) {
            this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
        }
        if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
            this._cellPadding = 50 * this.cellAspectRatio / numCols + "%";
        }
        if (columnChanges || !this._cellWidth) {
            this._cellWidth = 100 / numCols + "%";
        }
    };
    MatCalendarBody.prototype.ngOnDestroy = function () {
        var element = this._elementRef.nativeElement;
        element.removeEventListener('mouseenter', this._enterHandler, true);
        element.removeEventListener('focus', this._enterHandler, true);
        element.removeEventListener('mouseleave', this._leaveHandler, true);
        element.removeEventListener('blur', this._leaveHandler, true);
    };
    /** Returns whether a cell is active. */
    MatCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    /** Focuses the active cell after the microtask queue is empty. */
    MatCalendarBody.prototype._focusActiveCell = function (movePreview) {
        var _this = this;
        if (movePreview === void 0) { movePreview = true; }
        this._ngZone.runOutsideAngular(function () {
            _this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(function () {
                var activeCell = _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
                if (activeCell) {
                    if (!movePreview) {
                        _this._skipNextFocus = true;
                    }
                    activeCell.focus();
                }
            });
        });
    };
    /** Gets whether a value is the start of the main range. */
    MatCalendarBody.prototype._isRangeStart = function (value) {
        return isStart(value, this.startValue, this.endValue);
    };
    /** Gets whether a value is the end of the main range. */
    MatCalendarBody.prototype._isRangeEnd = function (value) {
        return isEnd(value, this.startValue, this.endValue);
    };
    /** Gets whether a value is within the currently-selected range. */
    MatCalendarBody.prototype._isInRange = function (value) {
        return isInRange(value, this.startValue, this.endValue, this.isRange);
    };
    /** Gets whether a value is the start of the comparison range. */
    MatCalendarBody.prototype._isComparisonStart = function (value) {
        return isStart(value, this.comparisonStart, this.comparisonEnd);
    };
    /** Whether the cell is a start bridge cell between the main and comparison ranges. */
    MatCalendarBody.prototype._isComparisonBridgeStart = function (value, rowIndex, colIndex) {
        if (!this._isComparisonStart(value) || this._isRangeStart(value) || !this._isInRange(value)) {
            return false;
        }
        var previousCell = this.rows[rowIndex][colIndex - 1];
        if (!previousCell) {
            var previousRow = this.rows[rowIndex - 1];
            previousCell = previousRow && previousRow[previousRow.length - 1];
        }
        return previousCell && !this._isRangeEnd(previousCell.compareValue);
    };
    /** Whether the cell is an end bridge cell between the main and comparison ranges. */
    MatCalendarBody.prototype._isComparisonBridgeEnd = function (value, rowIndex, colIndex) {
        if (!this._isComparisonEnd(value) || this._isRangeEnd(value) || !this._isInRange(value)) {
            return false;
        }
        var nextCell = this.rows[rowIndex][colIndex + 1];
        if (!nextCell) {
            var nextRow = this.rows[rowIndex + 1];
            nextCell = nextRow && nextRow[0];
        }
        return nextCell && !this._isRangeStart(nextCell.compareValue);
    };
    /** Gets whether a value is the end of the comparison range. */
    MatCalendarBody.prototype._isComparisonEnd = function (value) {
        return isEnd(value, this.comparisonStart, this.comparisonEnd);
    };
    /** Gets whether a value is within the current comparison range. */
    MatCalendarBody.prototype._isInComparisonRange = function (value) {
        return isInRange(value, this.comparisonStart, this.comparisonEnd, this.isRange);
    };
    /** Gets whether a value is the start of the preview range. */
    MatCalendarBody.prototype._isPreviewStart = function (value) {
        return isStart(value, this.previewStart, this.previewEnd);
    };
    /** Gets whether a value is the end of the preview range. */
    MatCalendarBody.prototype._isPreviewEnd = function (value) {
        return isEnd(value, this.previewStart, this.previewEnd);
    };
    /** Gets whether a value is inside the preview range. */
    MatCalendarBody.prototype._isInPreview = function (value) {
        return isInRange(value, this.previewStart, this.previewEnd, this.isRange);
    };
    /** Finds the MatCalendarCell that corresponds to a DOM node. */
    MatCalendarBody.prototype._getCellFromElement = function (element) {
        var cell;
        if (isTableCell(element)) {
            cell = element;
        }
        else if (isTableCell(element.parentNode)) {
            cell = element.parentNode;
        }
        if (cell) {
            var row = cell.getAttribute('data-mat-row');
            var col = cell.getAttribute('data-mat-col');
            if (row && col) {
                return this.rows[parseInt(row)][parseInt(col)];
            }
        }
        return null;
    };
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
    MatCalendarBody.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
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
}());
export { MatCalendarBody };
/** Checks whether a node is a table cell element. */
function isTableCell(node) {
    return node.nodeName === 'TD';
}
/** Checks whether a value is the start of a range. */
function isStart(value, start, end) {
    return end !== null && start !== end && value < end && value === start;
}
/** Checks whether a value is the end of a range. */
function isEnd(value, start, end) {
    return start !== null && start !== end && value >= start && value === end;
}
/** Checks whether a value is inside of a range. */
function isInRange(value, start, end, rangeEnabled) {
    return rangeEnabled && start !== null && end !== null && start !== end &&
        value >= start && value <= end;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEdBSVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBT3BDOzs7R0FHRztBQUNIO0lBQ0UseUJBQW1CLEtBQWEsRUFDYixZQUFvQixFQUNwQixTQUFpQixFQUNqQixPQUFnQixFQUNoQixVQUEwQyxFQUMxQyxZQUFvQixFQUNwQixRQUFZO1FBRlosMkJBQUEsRUFBQSxlQUEwQztRQUMxQyw2QkFBQSxFQUFBLG9CQUFvQjtRQUxwQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGVBQVUsR0FBVixVQUFVLENBQWdDO1FBQzFDLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQUk7SUFBRyxDQUFDO0lBQ3JDLHNCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7O0FBUUQ7OztHQUdHO0FBQ0g7SUFpRkUseUJBQW9CLFdBQW9DLEVBQVUsT0FBZTtRQUFqRixpQkFRQztRQVJtQixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBM0NqRiwwQ0FBMEM7UUFDakMsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUU3Qix1REFBdUQ7UUFDOUMsZUFBVSxHQUFXLENBQUMs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a0I7SUFDcEUsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEtBQUssR0FBRyxDQUFDO0FBQzVFLENBQUM7QUFFRCxtREFBbUQ7QUFDbkQsU0FBUyxTQUFTLENBQUMsS0FBYSxFQUNiLEtBQW9CLEVBQ3BCLEdBQWtCLEVBQ2xCLFlBQXFCO0lBQ3RDLE9BQU8sWUFBWSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssR0FBRztRQUMvRCxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUM7QUFDeEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEV4dHJhIENTUyBjbGFzc2VzIHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIGNhbGVuZGFyIGNlbGwuXG4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY2xhc3MgdGhhdCByZXByZXNlbnRzIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gYSBzaW5nbGUgY2FsZW5kYXIgY2VsbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyQ2VsbDxEID0gYW55PiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgZGlzcGxheVZhbHVlOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBhcmlhTGFiZWw6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBjc3NDbGFzc2VzOiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzID0ge30sXG4gICAgICAgICAgICAgIHB1YmxpYyBjb21wYXJlVmFsdWUgPSB2YWx1ZSxcbiAgICAgICAgICAgICAgcHVibGljIHJhd1ZhbHVlPzogRCkge31cbn1cblxuLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGRhdGUgaW5zaWRlIHRoZSBjYWxlbmRhciBpcyB0cmlnZ2VyZWQgYXMgYSByZXN1bHQgb2YgYSB1c2VyIGFjdGlvbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RD4ge1xuICB2YWx1ZTogRDtcbiAgZXZlbnQ6IEV2ZW50O1xufVxuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgY2FsZW5kYXIgZGF0YSBpbiBhIHRhYmxlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhbGVuZGFyLWJvZHldJyxcbiAgdGVtcGxhdGVVcmw6ICdjYWxlbmRhci1ib2R5Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXItYm9keS5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FsZW5kYXItYm9keScsXG4gICAgJ3JvbGUnOiAnZ3JpZCcsXG4gICAgJ2FyaWEtcmVhZG9ubHknOiAndHJ1ZSdcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRDYWxlbmRhckJvZHknLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXJCb2R5IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVXNlZCB0byBza2lwIHRoZSBuZXh0IGZvY3VzIGV2ZW50IHdoZW4gcmVuZGVyaW5nIHRoZSBwcmV2aWV3IHJhbmdlLlxuICAgKiBXZSBuZWVkIGEgZmxhZyBsaWtlIHRoaXMsIGJlY2F1c2Ugc29tZSBicm93c2VycyBmaXJlIGZvY3VzIGV2ZW50cyBhc3luY2hyb25vdXNseS5cbiAgICovXG4gIHByaXZhdGUgX3NraXBOZXh0Rm9jdXM6IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIHRhYmxlLiAoZS5nLiBcIkphbiAyMDE3XCIpLiAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgY2VsbHMgdG8gZGlzcGxheSBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIHJvd3M6IE1hdENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBjb3JyZXNwb25kcyB0byB0b2RheS4gKi9cbiAgQElucHV0KCkgdG9kYXlWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBTdGFydCB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS4gKi9cbiAgQElucHV0KCkgc3RhcnRWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBFbmQgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuICovXG4gIEBJbnB1dCgpIGVuZFZhbHVlOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBmcmVlIGNlbGxzIG5lZWRlZCB0byBmaXQgdGhlIGxhYmVsIGluIHRoZSBmaXJzdCByb3cuICovXG4gIEBJbnB1dCgpIGxhYmVsTWluUmVxdWlyZWRDZWxsczogbnVtYmVyO1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSBudW1Db2xzOiBudW1iZXIgPSA3O1xuXG4gIC8qKiBUaGUgY2VsbCBudW1iZXIgb2YgdGhlIGFjdGl2ZSBjZWxsIGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgYWN0aXZlQ2VsbDogbnVtYmVyID0gMDtcblxuICAvKiogV2hldGhlciBhIHJhbmdlIGlzIGJlaW5nIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKSBpc1JhbmdlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBhc3BlY3QgcmF0aW8gKHdpZHRoIC8gaGVpZ2h0KSB0byB1c2UgZm9yIHRoZSBjZWxscyBpbiB0aGUgdGFibGUuIFRoaXMgYXNwZWN0IHJhdGlvIHdpbGwgYmVcbiAgICogbWFpbnRhaW5lZCBldmVuIGFzIHRoZSB0YWJsZSByZXNpemVzLlxuICAgKi9cbiAgQElucHV0KCkgY2VsbEFzcGVjdFJhdGlvOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvblN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBASW5wdXQoKSBwcmV2aWV3U3RhcnQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIEBJbnB1dCgpIHByZXZpZXdFbmQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IHZhbHVlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRWYWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PG51bWJlcj4+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8bnVtYmVyPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcHJldmlldyBoYXMgY2hhbmdlZCBhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuICBAT3V0cHV0KCkgcHJldmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8TWF0Q2FsZW5kYXJDZWxsIHwgbnVsbD4+KCk7XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgYmxhbmsgY2VsbHMgdG8gcHV0IGF0IHRoZSBiZWdpbm5pbmcgZm9yIHRoZSBmaXJzdCByb3cuICovXG4gIF9maXJzdFJvd09mZnNldDogbnVtYmVyO1xuXG4gIC8qKiBQYWRkaW5nIGZvciB0aGUgaW5kaXZpZHVhbCBkYXRlIGNlbGxzLiAqL1xuICBfY2VsbFBhZGRpbmc6IHN0cmluZztcblxuICAvKiogV2lkdGggb2YgYW4gaW5kaXZpZHVhbCBjZWxsLiAqL1xuICBfY2VsbFdpZHRoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7XG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX2VudGVySGFuZGxlciwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fZW50ZXJIYW5kbGVyLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9sZWF2ZUhhbmRsZXIsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIGEgY2VsbCBpcyBjbGlja2VkLiAqL1xuICBfY2VsbENsaWNrZWQoY2VsbDogTWF0Q2FsZW5kYXJDZWxsLCBldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmIChjZWxsLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRWYWx1ZUNoYW5nZS5lbWl0KHt2YWx1ZTogY2VsbC52YWx1ZSwgZXZlbnR9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGEgY2VsbCBzaG91bGQgYmUgbWFya2VkIGFzIHNlbGVjdGVkLiAqL1xuICBfaXNTZWxlY3RlZChjZWxsOiBNYXRDYWxlbmRhckNlbGwpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFZhbHVlID09PSBjZWxsLmNvbXBhcmVWYWx1ZSB8fCB0aGlzLmVuZFZhbHVlID09PSBjZWxsLmNvbXBhcmVWYWx1ZTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjb2x1bW5DaGFuZ2VzID0gY2hhbmdlc1snbnVtQ29scyddO1xuICAgIGNvbnN0IHtyb3dzLCBudW1Db2xzfSA9IHRoaXM7XG5cbiAgICBpZiAoY2hhbmdlc1sncm93cyddIHx8IGNvbHVtbkNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2ZpcnN0Um93T2Zmc2V0ID0gcm93cyAmJiByb3dzLmxlbmd0aCAmJiByb3dzWzBdLmxlbmd0aCA/IG51bUNvbHMgLSByb3dzWzBdLmxlbmd0aCA6IDA7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ2NlbGxBc3BlY3RSYXRpbyddIHx8IGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxQYWRkaW5nKSB7XG4gICAgICB0aGlzLl9jZWxsUGFkZGluZyA9IGAkezUwICogdGhpcy5jZWxsQXNwZWN0UmF0aW8gLyBudW1Db2xzfSVgO1xuICAgIH1cblxuICAgIGlmIChjb2x1bW5DaGFuZ2VzIHx8ICF0aGlzLl9jZWxsV2lkdGgpIHtcbiAgICAgIHRoaXMuX2NlbGxXaWR0aCA9IGAkezEwMCAvIG51bUNvbHN9JWA7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fbGVhdmVIYW5kbGVyLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgYSBjZWxsIGlzIGFjdGl2ZS4gKi9cbiAgX2lzQWN0aXZlQ2VsbChyb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgbGV0IGNlbGxOdW1iZXIgPSByb3dJbmRleCAqIHRoaXMubnVtQ29scyArIGNvbEluZGV4O1xuXG4gICAgLy8gQWNjb3VudCBmb3IgdGhlIGZhY3QgdGhhdCB0aGUgZmlyc3Qgcm93IG1heSBub3QgaGF2ZSBhcyBtYW55IGNlbGxzLlxuICAgIGlmIChyb3dJbmRleCkge1xuICAgICAgY2VsbE51bWJlciAtPSB0aGlzLl9maXJzdFJvd09mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2VsbE51bWJlciA9PSB0aGlzLmFjdGl2ZUNlbGw7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldyA9IHRydWUpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsID1cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWF0LWNhbGVuZGFyLWJvZHktYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUNlbGwpIHtcbiAgICAgICAgICBpZiAoIW1vdmVQcmV2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLl9za2lwTmV4dEZvY3VzID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhY3RpdmVDZWxsLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzdGFydCBvZiB0aGUgbWFpbiByYW5nZS4gKi9cbiAgX2lzUmFuZ2VTdGFydCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzU3RhcnQodmFsdWUsIHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy5lbmRWYWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiB0aGUgbWFpbiByYW5nZS4gKi9cbiAgX2lzUmFuZ2VFbmQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0VuZCh2YWx1ZSwgdGhpcy5zdGFydFZhbHVlLCB0aGlzLmVuZFZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB3aXRoaW4gdGhlIGN1cnJlbnRseS1zZWxlY3RlZCByYW5nZS4gKi9cbiAgX2lzSW5SYW5nZSh2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzSW5SYW5nZSh2YWx1ZSwgdGhpcy5zdGFydFZhbHVlLCB0aGlzLmVuZFZhbHVlLCB0aGlzLmlzUmFuZ2UpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgX2lzQ29tcGFyaXNvblN0YXJ0KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNTdGFydCh2YWx1ZSwgdGhpcy5jb21wYXJpc29uU3RhcnQsIHRoaXMuY29tcGFyaXNvbkVuZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBhIHN0YXJ0IGJyaWRnZSBjZWxsIGJldHdlZW4gdGhlIG1haW4gYW5kIGNvbXBhcmlzb24gcmFuZ2VzLiAqL1xuICBfaXNDb21wYXJpc29uQnJpZGdlU3RhcnQodmFsdWU6IG51bWJlciwgcm93SW5kZXg6IG51bWJlciwgY29sSW5kZXg6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5faXNDb21wYXJpc29uU3RhcnQodmFsdWUpIHx8IHRoaXMuX2lzUmFuZ2VTdGFydCh2YWx1ZSkgfHwgIXRoaXMuX2lzSW5SYW5nZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgcHJldmlvdXNDZWxsOiBNYXRDYWxlbmRhckNlbGwgfCB1bmRlZmluZWQgPSB0aGlzLnJvd3Nbcm93SW5kZXhdW2NvbEluZGV4IC0gMV07XG5cbiAgICBpZiAoIXByZXZpb3VzQ2VsbCkge1xuICAgICAgY29uc3QgcHJldmlvdXNSb3cgPSB0aGlzLnJvd3Nbcm93SW5kZXggLSAxXTtcbiAgICAgIHByZXZpb3VzQ2VsbCA9IHByZXZpb3VzUm93ICYmIHByZXZpb3VzUm93W3ByZXZpb3VzUm93Lmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIHJldHVybiBwcmV2aW91c0NlbGwgJiYgIXRoaXMuX2lzUmFuZ2VFbmQocHJldmlvdXNDZWxsLmNvbXBhcmVWYWx1ZSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBhbiBlbmQgYnJpZGdlIGNlbGwgYmV0d2VlbiB0aGUgbWFpbiBhbmQgY29tcGFyaXNvbiByYW5nZXMuICovXG4gIF9pc0NvbXBhcmlzb25CcmlkZ2VFbmQodmFsdWU6IG51bWJlciwgcm93SW5kZXg6IG51bWJlciwgY29sSW5kZXg6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5faXNDb21wYXJpc29uRW5kKHZhbHVlKSB8fCB0aGlzLl9pc1JhbmdlRW5kKHZhbHVlKSB8fCAhdGhpcy5faXNJblJhbmdlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBuZXh0Q2VsbDogTWF0Q2FsZW5kYXJDZWxsIHwgdW5kZWZpbmVkID0gdGhpcy5yb3dzW3Jvd0luZGV4XVtjb2xJbmRleCArIDFdO1xuXG4gICAgaWYgKCFuZXh0Q2VsbCkge1xuICAgICAgY29uc3QgbmV4dFJvdyA9IHRoaXMucm93c1tyb3dJbmRleCArIDFdO1xuICAgICAgbmV4dENlbGwgPSBuZXh0Um93ICYmIG5leHRSb3dbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRDZWxsICYmICF0aGlzLl9pc1JhbmdlU3RhcnQobmV4dENlbGwuY29tcGFyZVZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgZW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBfaXNDb21wYXJpc29uRW5kKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNFbmQodmFsdWUsIHRoaXMuY29tcGFyaXNvblN0YXJ0LCB0aGlzLmNvbXBhcmlzb25FbmQpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHdpdGhpbiB0aGUgY3VycmVudCBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBfaXNJbkNvbXBhcmlzb25SYW5nZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzSW5SYW5nZSh2YWx1ZSwgdGhpcy5jb21wYXJpc29uU3RhcnQsIHRoaXMuY29tcGFyaXNvbkVuZCwgdGhpcy5pc1JhbmdlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgc3RhcnQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIF9pc1ByZXZpZXdTdGFydCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzU3RhcnQodmFsdWUsIHRoaXMucHJldmlld1N0YXJ0LCB0aGlzLnByZXZpZXdFbmQpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIF9pc1ByZXZpZXdFbmQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0VuZCh2YWx1ZSwgdGhpcy5wcmV2aWV3U3RhcnQsIHRoaXMucHJldmlld0VuZCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgaW5zaWRlIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfaXNJblByZXZpZXcodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0luUmFuZ2UodmFsdWUsIHRoaXMucHJldmlld1N0YXJ0LCB0aGlzLnByZXZpZXdFbmQsIHRoaXMuaXNSYW5nZSk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgdXNlciBlbnRlcnMgYW4gZWxlbWVudFxuICAgKiBpbnNpZGUgdGhlIGNhbGVuZGFyIGJvZHkgKGUuZy4gYnkgaG92ZXJpbmcgaW4gb3IgZm9jdXMpLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW50ZXJIYW5kbGVyID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9za2lwTmV4dEZvY3VzICYmIGV2ZW50LnR5cGUgPT09ICdmb2N1cycpIHtcbiAgICAgIHRoaXMuX3NraXBOZXh0Rm9jdXMgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gaGl0IHRoZSB6b25lIHdoZW4gd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgaWYgKGV2ZW50LnRhcmdldCAmJiB0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLl9nZXRDZWxsRnJvbUVsZW1lbnQoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcblxuICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7dmFsdWU6IGNlbGwuZW5hYmxlZCA/IGNlbGwgOiBudWxsLCBldmVudH0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgdXNlcidzIHBvaW50ZXIgbGVhdmVzIGFuIGVsZW1lbnRcbiAgICogaW5zaWRlIHRoZSBjYWxlbmRhciBib2R5IChlLmcuIGJ5IGhvdmVyaW5nIG91dCBvciBibHVycmluZykuXG4gICAqL1xuICBwcml2YXRlIF9sZWF2ZUhhbmRsZXIgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgLy8gV2Ugb25seSBuZWVkIHRvIGhpdCB0aGUgem9uZSB3aGVuIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlLlxuICAgIGlmICh0aGlzLnByZXZpZXdFbmQgIT09IG51bGwgJiYgdGhpcy5pc1JhbmdlKSB7XG4gICAgICAvLyBPbmx5IHJlc2V0IHRoZSBwcmV2aWV3IGVuZCB2YWx1ZSB3aGVuIGxlYXZpbmcgY2VsbHMuIFRoaXMgbG9va3MgYmV0dGVyLCBiZWNhdXNlXG4gICAgICAvLyB3ZSBoYXZlIGEgZ2FwIGJldHdlZW4gdGhlIGNlbGxzIGFuZCB0aGUgcm93cyBhbmQgd2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlXG4gICAgICAvLyByYW5nZSBqdXN0IGZvciBpdCB0byBzaG93IHVwIGFnYWluIHdoZW4gdGhlIHVzZXIgbW92ZXMgYSBmZXcgcGl4ZWxzIHRvIHRoZSBzaWRlLlxuICAgICAgaWYgKGV2ZW50LnRhcmdldCAmJiBpc1RhYmxlQ2VsbChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe3ZhbHVlOiBudWxsLCBldmVudH0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRmluZHMgdGhlIE1hdENhbGVuZGFyQ2VsbCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEgRE9NIG5vZGUuICovXG4gIHByaXZhdGUgX2dldENlbGxGcm9tRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IE1hdENhbGVuZGFyQ2VsbCB8IG51bGwge1xuICAgIGxldCBjZWxsOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIGlmIChpc1RhYmxlQ2VsbChlbGVtZW50KSkge1xuICAgICAgY2VsbCA9IGVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChpc1RhYmxlQ2VsbChlbGVtZW50LnBhcmVudE5vZGUhKSkge1xuICAgICAgY2VsbCA9IGVsZW1lbnQucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoY2VsbCkge1xuICAgICAgY29uc3Qgcm93ID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LXJvdycpO1xuICAgICAgY29uc3QgY29sID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWNvbCcpO1xuXG4gICAgICBpZiAocm93ICYmIGNvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzW3BhcnNlSW50KHJvdyldW3BhcnNlSW50KGNvbCldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgbm9kZSBpcyBhIHRhYmxlIGNlbGwgZWxlbWVudC4gKi9cbmZ1bmN0aW9uIGlzVGFibGVDZWxsKG5vZGU6IE5vZGUpOiBub2RlIGlzIEhUTUxUYWJsZUNlbGxFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUubm9kZU5hbWUgPT09ICdURCc7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzdGFydCBvZiBhIHJhbmdlLiAqL1xuZnVuY3Rpb24gaXNTdGFydCh2YWx1ZTogbnVtYmVyLCBzdGFydDogbnVtYmVyIHwgbnVsbCwgZW5kOiBudW1iZXIgfCBudWxsKTogYm9vbGVhbiB7XG4gIHJldHVybiBlbmQgIT09IG51bGwgJiYgc3RhcnQgIT09IGVuZCAmJiB2YWx1ZSA8IGVuZCAmJiB2YWx1ZSA9PT0gc3RhcnQ7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgYSByYW5nZS4gKi9cbmZ1bmN0aW9uIGlzRW5kKHZhbHVlOiBudW1iZXIsIHN0YXJ0OiBudW1iZXIgfCBudWxsLCBlbmQ6IG51bWJlciB8IG51bGwpOiBib29sZWFuIHtcbiAgcmV0dXJuIHN0YXJ0ICE9PSBudWxsICYmIHN0YXJ0ICE9PSBlbmQgJiYgdmFsdWUgPj0gc3RhcnQgJiYgdmFsdWUgPT09IGVuZDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgaW5zaWRlIG9mIGEgcmFuZ2UuICovXG5mdW5jdGlvbiBpc0luUmFuZ2UodmFsdWU6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICBzdGFydDogbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBlbmQ6IG51bWJlciB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgcmFuZ2VFbmFibGVkOiBib29sZWFuKTogYm9vbGVhbiB7XG4gIHJldHVybiByYW5nZUVuYWJsZWQgJiYgc3RhcnQgIT09IG51bGwgJiYgZW5kICE9PSBudWxsICYmIHN0YXJ0ICE9PSBlbmQgJiZcbiAgICAgICAgIHZhbHVlID49IHN0YXJ0ICYmIHZhbHVlIDw9IGVuZDtcbn1cbiJdfQ==