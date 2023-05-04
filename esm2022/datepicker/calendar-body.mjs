/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation, NgZone, inject, } from '@angular/core';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class MatCalendarCell {
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
let calendarBodyId = 1;
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
class MatCalendarBody {
    ngAfterViewChecked() {
        if (this._focusActiveCellAfterViewChecked) {
            this._focusActiveCell();
            this._focusActiveCellAfterViewChecked = false;
        }
    }
    constructor(_elementRef, _ngZone) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._platform = inject(Platform);
        /**
         * Used to focus the active cell after change detection has run.
         */
        this._focusActiveCellAfterViewChecked = false;
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
        this.activeDateChange = new EventEmitter();
        /** Emits the date at the possible start of a drag event. */
        this.dragStarted = new EventEmitter();
        /** Emits the date at the conclusion of a drag, or null if mouse was not released on a date. */
        this.dragEnded = new EventEmitter();
        this._didDragSinceMouseDown = false;
        /**
         * Event handler for when the user enters an element
         * inside the calendar body (e.g. by hovering in or focus).
         */
        this._enterHandler = (event) => {
            if (this._skipNextFocus && event.type === 'focus') {
                this._skipNextFocus = false;
                return;
            }
            // We only need to hit the zone when we're selecting a range.
            if (event.target && this.isRange) {
                const cell = this._getCellFromElement(event.target);
                if (cell) {
                    this._ngZone.run(() => this.previewChange.emit({ value: cell.enabled ? cell : null, event }));
                }
            }
        };
        this._touchmoveHandler = (event) => {
            if (!this.isRange)
                return;
            const target = getActualTouchTarget(event);
            const cell = target ? this._getCellFromElement(target) : null;
            if (target !== event.target) {
                this._didDragSinceMouseDown = true;
            }
            // If the initial target of the touch is a date cell, prevent default so
            // that the move is not handled as a scroll.
            if (getCellElement(event.target)) {
                event.preventDefault();
            }
            this._ngZone.run(() => this.previewChange.emit({ value: cell?.enabled ? cell : null, event }));
        };
        /**
         * Event handler for when the user's pointer leaves an element
         * inside the calendar body (e.g. by hovering out or blurring).
         */
        this._leaveHandler = (event) => {
            // We only need to hit the zone when we're selecting a range.
            if (this.previewEnd !== null && this.isRange) {
                if (event.type !== 'blur') {
                    this._didDragSinceMouseDown = true;
                }
                // Only reset the preview end value when leaving cells. This looks better, because
                // we have a gap between the cells and the rows and we don't want to remove the
                // range just for it to show up again when the user moves a few pixels to the side.
                if (event.target &&
                    this._getCellFromElement(event.target) &&
                    !(event.relatedTarget &&
                        this._getCellFromElement(event.relatedTarget))) {
                    this._ngZone.run(() => this.previewChange.emit({ value: null, event }));
                }
            }
        };
        /**
         * Triggered on mousedown or touchstart on a date cell.
         * Respsonsible for starting a drag sequence.
         */
        this._mousedownHandler = (event) => {
            if (!this.isRange)
                return;
            this._didDragSinceMouseDown = false;
            // Begin a drag if a cell within the current range was targeted.
            const cell = event.target && this._getCellFromElement(event.target);
            if (!cell || !this._isInRange(cell.rawValue)) {
                return;
            }
            this._ngZone.run(() => {
                this.dragStarted.emit({
                    value: cell.rawValue,
                    event,
                });
            });
        };
        /** Triggered on mouseup anywhere. Respsonsible for ending a drag sequence. */
        this._mouseupHandler = (event) => {
            if (!this.isRange)
                return;
            const cellElement = getCellElement(event.target);
            if (!cellElement) {
                // Mouseup happened outside of datepicker. Cancel drag.
                this._ngZone.run(() => {
                    this.dragEnded.emit({ value: null, event });
                });
                return;
            }
            if (cellElement.closest('.mat-calendar-body') !== this._elementRef.nativeElement) {
                // Mouseup happened inside a different month instance.
                // Allow it to handle the event.
                return;
            }
            this._ngZone.run(() => {
                const cell = this._getCellFromElement(cellElement);
                this.dragEnded.emit({ value: cell?.rawValue ?? null, event });
            });
        };
        /** Triggered on touchend anywhere. Respsonsible for ending a drag sequence. */
        this._touchendHandler = (event) => {
            const target = getActualTouchTarget(event);
            if (target) {
                this._mouseupHandler({ target });
            }
        };
        this._id = `mat-calendar-body-${calendarBodyId++}`;
        this._startDateLabelId = `${this._id}-start-date`;
        this._endDateLabelId = `${this._id}-end-date`;
        _ngZone.runOutsideAngular(() => {
            const element = _elementRef.nativeElement;
            element.addEventListener('mouseenter', this._enterHandler, true);
            element.addEventListener('touchmove', this._touchmoveHandler, true);
            element.addEventListener('focus', this._enterHandler, true);
            element.addEventListener('mouseleave', this._leaveHandler, true);
            element.addEventListener('blur', this._leaveHandler, true);
            element.addEventListener('mousedown', this._mousedownHandler);
            element.addEventListener('touchstart', this._mousedownHandler);
            if (this._platform.isBrowser) {
                window.addEventListener('mouseup', this._mouseupHandler);
                window.addEventListener('touchend', this._touchendHandler);
            }
        });
    }
    /** Called when a cell is clicked. */
    _cellClicked(cell, event) {
        // Ignore "clicks" that are actually canceled drags (eg the user dragged
        // off and then went back to this cell to undo).
        if (this._didDragSinceMouseDown) {
            return;
        }
        if (cell.enabled) {
            this.selectedValueChange.emit({ value: cell.value, event });
        }
    }
    _emitActiveDateChange(cell, event) {
        if (cell.enabled) {
            this.activeDateChange.emit({ value: cell.value, event });
        }
    }
    /** Returns whether a cell should be marked as selected. */
    _isSelected(value) {
        return this.startValue === value || this.endValue === value;
    }
    ngOnChanges(changes) {
        const columnChanges = changes['numCols'];
        const { rows, numCols } = this;
        if (changes['rows'] || columnChanges) {
            this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
        }
        if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
            this._cellPadding = `${(50 * this.cellAspectRatio) / numCols}%`;
        }
        if (columnChanges || !this._cellWidth) {
            this._cellWidth = `${100 / numCols}%`;
        }
    }
    ngOnDestroy() {
        const element = this._elementRef.nativeElement;
        element.removeEventListener('mouseenter', this._enterHandler, true);
        element.removeEventListener('touchmove', this._touchmoveHandler, true);
        element.removeEventListener('focus', this._enterHandler, true);
        element.removeEventListener('mouseleave', this._leaveHandler, true);
        element.removeEventListener('blur', this._leaveHandler, true);
        element.removeEventListener('mousedown', this._mousedownHandler);
        element.removeEventListener('touchstart', this._mousedownHandler);
        if (this._platform.isBrowser) {
            window.removeEventListener('mouseup', this._mouseupHandler);
            window.removeEventListener('touchend', this._touchendHandler);
        }
    }
    /** Returns whether a cell is active. */
    _isActiveCell(rowIndex, colIndex) {
        let cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    }
    /**
     * Focuses the active cell after the microtask queue is empty.
     *
     * Adding a 0ms setTimeout seems to fix Voiceover losing focus when pressing PageUp/PageDown
     * (issue #24330).
     *
     * Determined a 0ms by gradually increasing duration from 0 and testing two use cases with screen
     * reader enabled:
     *
     * 1. Pressing PageUp/PageDown repeatedly with pausing between each key press.
     * 2. Pressing and holding the PageDown key with repeated keys enabled.
     *
     * Test 1 worked roughly 95-99% of the time with 0ms and got a little bit better as the duration
     * increased. Test 2 got slightly better until the duration was long enough to interfere with
     * repeated keys. If the repeated key speed was faster than the timeout duration, then pressing
     * and holding pagedown caused the entire page to scroll.
     *
     * Since repeated key speed can verify across machines, determined that any duration could
     * potentially interfere with repeated keys. 0ms would be best because it almost entirely
     * eliminates the focus being lost in Voiceover (#24330) without causing unintended side effects.
     * Adding delay also complicates writing tests.
     */
    _focusActiveCell(movePreview = true) {
        this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                setTimeout(() => {
                    const activeCell = this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
                    if (activeCell) {
                        if (!movePreview) {
                            this._skipNextFocus = true;
                        }
                        activeCell.focus();
                    }
                });
            });
        });
    }
    /** Focuses the active cell after change detection has run and the microtask queue is empty. */
    _scheduleFocusActiveCellAfterViewChecked() {
        this._focusActiveCellAfterViewChecked = true;
    }
    /** Gets whether a value is the start of the main range. */
    _isRangeStart(value) {
        return isStart(value, this.startValue, this.endValue);
    }
    /** Gets whether a value is the end of the main range. */
    _isRangeEnd(value) {
        return isEnd(value, this.startValue, this.endValue);
    }
    /** Gets whether a value is within the currently-selected range. */
    _isInRange(value) {
        return isInRange(value, this.startValue, this.endValue, this.isRange);
    }
    /** Gets whether a value is the start of the comparison range. */
    _isComparisonStart(value) {
        return isStart(value, this.comparisonStart, this.comparisonEnd);
    }
    /** Whether the cell is a start bridge cell between the main and comparison ranges. */
    _isComparisonBridgeStart(value, rowIndex, colIndex) {
        if (!this._isComparisonStart(value) || this._isRangeStart(value) || !this._isInRange(value)) {
            return false;
        }
        let previousCell = this.rows[rowIndex][colIndex - 1];
        if (!previousCell) {
            const previousRow = this.rows[rowIndex - 1];
            previousCell = previousRow && previousRow[previousRow.length - 1];
        }
        return previousCell && !this._isRangeEnd(previousCell.compareValue);
    }
    /** Whether the cell is an end bridge cell between the main and comparison ranges. */
    _isComparisonBridgeEnd(value, rowIndex, colIndex) {
        if (!this._isComparisonEnd(value) || this._isRangeEnd(value) || !this._isInRange(value)) {
            return false;
        }
        let nextCell = this.rows[rowIndex][colIndex + 1];
        if (!nextCell) {
            const nextRow = this.rows[rowIndex + 1];
            nextCell = nextRow && nextRow[0];
        }
        return nextCell && !this._isRangeStart(nextCell.compareValue);
    }
    /** Gets whether a value is the end of the comparison range. */
    _isComparisonEnd(value) {
        return isEnd(value, this.comparisonStart, this.comparisonEnd);
    }
    /** Gets whether a value is within the current comparison range. */
    _isInComparisonRange(value) {
        return isInRange(value, this.comparisonStart, this.comparisonEnd, this.isRange);
    }
    /**
     * Gets whether a value is the same as the start and end of the comparison range.
     * For context, the functions that we use to determine whether something is the start/end of
     * a range don't allow for the start and end to be on the same day, because we'd have to use
     * much more specific CSS selectors to style them correctly in all scenarios. This is fine for
     * the regular range, because when it happens, the selected styles take over and still show where
     * the range would've been, however we don't have these selected styles for a comparison range.
     * This function is used to apply a class that serves the same purpose as the one for selected
     * dates, but it only applies in the context of a comparison range.
     */
    _isComparisonIdentical(value) {
        // Note that we don't need to null check the start/end
        // here, because the `value` will always be defined.
        return this.comparisonStart === this.comparisonEnd && value === this.comparisonStart;
    }
    /** Gets whether a value is the start of the preview range. */
    _isPreviewStart(value) {
        return isStart(value, this.previewStart, this.previewEnd);
    }
    /** Gets whether a value is the end of the preview range. */
    _isPreviewEnd(value) {
        return isEnd(value, this.previewStart, this.previewEnd);
    }
    /** Gets whether a value is inside the preview range. */
    _isInPreview(value) {
        return isInRange(value, this.previewStart, this.previewEnd, this.isRange);
    }
    /** Gets ids of aria descriptions for the start and end of a date range. */
    _getDescribedby(value) {
        if (!this.isRange) {
            return null;
        }
        if (this.startValue === value && this.endValue === value) {
            return `${this._startDateLabelId} ${this._endDateLabelId}`;
        }
        else if (this.startValue === value) {
            return this._startDateLabelId;
        }
        else if (this.endValue === value) {
            return this._endDateLabelId;
        }
        return null;
    }
    /** Finds the MatCalendarCell that corresponds to a DOM node. */
    _getCellFromElement(element) {
        const cell = getCellElement(element);
        if (cell) {
            const row = cell.getAttribute('data-mat-row');
            const col = cell.getAttribute('data-mat-col');
            if (row && col) {
                return this.rows[parseInt(row)][parseInt(col)];
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCalendarBody, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatCalendarBody, selector: "[mat-calendar-body]", inputs: { label: "label", rows: "rows", todayValue: "todayValue", startValue: "startValue", endValue: "endValue", labelMinRequiredCells: "labelMinRequiredCells", numCols: "numCols", activeCell: "activeCell", isRange: "isRange", cellAspectRatio: "cellAspectRatio", comparisonStart: "comparisonStart", comparisonEnd: "comparisonEnd", previewStart: "previewStart", previewEnd: "previewEnd", startDateAccessibleName: "startDateAccessibleName", endDateAccessibleName: "endDateAccessibleName" }, outputs: { selectedValueChange: "selectedValueChange", previewChange: "previewChange", activeDateChange: "activeDateChange", dragStarted: "dragStarted", dragEnded: "dragEnded" }, host: { classAttribute: "mat-calendar-body" }, exportAs: ["matCalendarBody"], usesOnChanges: true, ngImport: i0, template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\n  <td class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"numCols\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n  <!--\n    This cell is purely decorative, but we can't put `aria-hidden` or `role=\"presentation\"` on it,\n    because it throws off the week days for the rest of the row on NVDA. The aspect ratio of the\n    table cells is maintained by setting the top and bottom padding as a percentage of the width\n    (a variant of the trick described here: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\n      class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"_firstRowOffset\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n  </td>\n  <!--\n    Each gridcell in the calendar contains a button, which signals to assistive technology that the\n    cell is interactable, as well as the selection state via `aria-pressed`. See #23476 for\n    background.\n  -->\n  <td\n    *ngFor=\"let item of row; let colIndex = index\"\n    role=\"gridcell\"\n    class=\"mat-calendar-body-cell-container\"\n    [style.width]=\"_cellWidth\"\n    [style.paddingTop]=\"_cellPadding\"\n    [style.paddingBottom]=\"_cellPadding\"\n    [attr.data-mat-row]=\"rowIndex\"\n    [attr.data-mat-col]=\"colIndex\"\n  >\n    <button\n        type=\"button\"\n        class=\"mat-calendar-body-cell\"\n        [ngClass]=\"item.cssClasses\"\n        [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n        [class.mat-calendar-body-disabled]=\"!item.enabled\"\n        [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n        [class.mat-calendar-body-range-start]=\"_isRangeStart(item.compareValue)\"\n        [class.mat-calendar-body-range-end]=\"_isRangeEnd(item.compareValue)\"\n        [class.mat-calendar-body-in-range]=\"_isInRange(item.compareValue)\"\n        [class.mat-calendar-body-comparison-bridge-start]=\"_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)\"\n        [class.mat-calendar-body-comparison-bridge-end]=\"_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)\"\n        [class.mat-calendar-body-comparison-start]=\"_isComparisonStart(item.compareValue)\"\n        [class.mat-calendar-body-comparison-end]=\"_isComparisonEnd(item.compareValue)\"\n        [class.mat-calendar-body-in-comparison-range]=\"_isInComparisonRange(item.compareValue)\"\n        [class.mat-calendar-body-preview-start]=\"_isPreviewStart(item.compareValue)\"\n        [class.mat-calendar-body-preview-end]=\"_isPreviewEnd(item.compareValue)\"\n        [class.mat-calendar-body-in-preview]=\"_isInPreview(item.compareValue)\"\n        [attr.aria-label]=\"item.ariaLabel\"\n        [attr.aria-disabled]=\"!item.enabled || null\"\n        [attr.aria-pressed]=\"_isSelected(item.compareValue)\"\n        [attr.aria-current]=\"todayValue === item.compareValue ? 'date' : null\"\n        [attr.aria-describedby]=\"_getDescribedby(item.compareValue)\"\n        (click)=\"_cellClicked(item, $event)\"\n        (focus)=\"_emitActiveDateChange(item, $event)\">\n        <span class=\"mat-calendar-body-cell-content mat-focus-indicator\"\n          [class.mat-calendar-body-selected]=\"_isSelected(item.compareValue)\"\n          [class.mat-calendar-body-comparison-identical]=\"_isComparisonIdentical(item.compareValue)\"\n          [class.mat-calendar-body-today]=\"todayValue === item.compareValue\">\n          {{item.displayValue}}\n        </span>\n        <span class=\"mat-calendar-body-cell-preview\" aria-hidden=\"true\"></span>\n    </button>\n  </td>\n</tr>\n\n<label [id]=\"_startDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{startDateAccessibleName}}\n</label>\n<label [id]=\"_endDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{endDateAccessibleName}}\n</label>\n", styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.7142857143%;padding-right:4.7142857143%}.mat-calendar-body-hidden-label{display:none}.mat-calendar-body-cell-container{position:relative;height:0;line-height:0}.mat-calendar-body-cell{-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;top:0;left:0;width:100%;height:100%;background:none;text-align:center;outline:none;font-family:inherit;margin:0}.mat-calendar-body-cell::-moz-focus-inner{border:0}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-cell-preview{content:\"\";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;display:block;height:90%;width:100%}.mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-start::after,.mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,.mat-calendar-body-comparison-start::after,.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,[dir=rtl] .mat-calendar-body-comparison-start::after,[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,.mat-calendar-body-comparison-end::after,.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,[dir=rtl] .mat-calendar-body-comparison-end::after,[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-comparison-bridge-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-bridge-end.mat-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end.mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-end.mat-calendar-body-range-start::after{width:90%}.mat-calendar-body-in-preview .mat-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.mat-calendar-body-disabled{cursor:default}.cdk-high-contrast-active .mat-calendar-body-disabled{opacity:.5}.mat-calendar-body-cell-content{top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}.mat-calendar-body-cell-content.mat-focus-indicator{position:absolute}.cdk-high-contrast-active .mat-calendar-body-cell-content{border:none}.cdk-high-contrast-active .mat-datepicker-popup:not(:empty),.cdk-high-contrast-active .mat-calendar-body-cell:not(.mat-calendar-body-in-range) .mat-calendar-body-selected{outline:solid 1px}.cdk-high-contrast-active .mat-calendar-body-today{outline:dotted 1px}.cdk-high-contrast-active .mat-calendar-body-cell::before,.cdk-high-contrast-active .mat-calendar-body-cell::after,.cdk-high-contrast-active .mat-calendar-body-selected{background:none}.cdk-high-contrast-active .mat-calendar-body-in-range::before,.cdk-high-contrast-active .mat-calendar-body-comparison-bridge-start::before,.cdk-high-contrast-active .mat-calendar-body-comparison-bridge-end::before{border-top:solid 1px;border-bottom:solid 1px}.cdk-high-contrast-active .mat-calendar-body-range-start::before{border-left:solid 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-range-start::before{border-left:0;border-right:solid 1px}.cdk-high-contrast-active .mat-calendar-body-range-end::before{border-right:solid 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-range-end::before{border-right:0;border-left:solid 1px}.cdk-high-contrast-active .mat-calendar-body-in-comparison-range::before{border-top:dashed 1px;border-bottom:dashed 1px}.cdk-high-contrast-active .mat-calendar-body-comparison-start::before{border-left:dashed 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-comparison-start::before{border-left:0;border-right:dashed 1px}.cdk-high-contrast-active .mat-calendar-body-comparison-end::before{border-right:dashed 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-comparison-end::before{border-right:0;border-left:dashed 1px}[dir=rtl] .mat-calendar-body-label{text-align:right}"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatCalendarBody };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCalendarBody, decorators: [{
            type: Component,
            args: [{ selector: '[mat-calendar-body]', host: {
                        'class': 'mat-calendar-body',
                    }, exportAs: 'matCalendarBody', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\n  <td class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"numCols\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n  <!--\n    This cell is purely decorative, but we can't put `aria-hidden` or `role=\"presentation\"` on it,\n    because it throws off the week days for the rest of the row on NVDA. The aspect ratio of the\n    table cells is maintained by setting the top and bottom padding as a percentage of the width\n    (a variant of the trick described here: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\n      class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"_firstRowOffset\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n  </td>\n  <!--\n    Each gridcell in the calendar contains a button, which signals to assistive technology that the\n    cell is interactable, as well as the selection state via `aria-pressed`. See #23476 for\n    background.\n  -->\n  <td\n    *ngFor=\"let item of row; let colIndex = index\"\n    role=\"gridcell\"\n    class=\"mat-calendar-body-cell-container\"\n    [style.width]=\"_cellWidth\"\n    [style.paddingTop]=\"_cellPadding\"\n    [style.paddingBottom]=\"_cellPadding\"\n    [attr.data-mat-row]=\"rowIndex\"\n    [attr.data-mat-col]=\"colIndex\"\n  >\n    <button\n        type=\"button\"\n        class=\"mat-calendar-body-cell\"\n        [ngClass]=\"item.cssClasses\"\n        [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n        [class.mat-calendar-body-disabled]=\"!item.enabled\"\n        [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n        [class.mat-calendar-body-range-start]=\"_isRangeStart(item.compareValue)\"\n        [class.mat-calendar-body-range-end]=\"_isRangeEnd(item.compareValue)\"\n        [class.mat-calendar-body-in-range]=\"_isInRange(item.compareValue)\"\n        [class.mat-calendar-body-comparison-bridge-start]=\"_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)\"\n        [class.mat-calendar-body-comparison-bridge-end]=\"_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)\"\n        [class.mat-calendar-body-comparison-start]=\"_isComparisonStart(item.compareValue)\"\n        [class.mat-calendar-body-comparison-end]=\"_isComparisonEnd(item.compareValue)\"\n        [class.mat-calendar-body-in-comparison-range]=\"_isInComparisonRange(item.compareValue)\"\n        [class.mat-calendar-body-preview-start]=\"_isPreviewStart(item.compareValue)\"\n        [class.mat-calendar-body-preview-end]=\"_isPreviewEnd(item.compareValue)\"\n        [class.mat-calendar-body-in-preview]=\"_isInPreview(item.compareValue)\"\n        [attr.aria-label]=\"item.ariaLabel\"\n        [attr.aria-disabled]=\"!item.enabled || null\"\n        [attr.aria-pressed]=\"_isSelected(item.compareValue)\"\n        [attr.aria-current]=\"todayValue === item.compareValue ? 'date' : null\"\n        [attr.aria-describedby]=\"_getDescribedby(item.compareValue)\"\n        (click)=\"_cellClicked(item, $event)\"\n        (focus)=\"_emitActiveDateChange(item, $event)\">\n        <span class=\"mat-calendar-body-cell-content mat-focus-indicator\"\n          [class.mat-calendar-body-selected]=\"_isSelected(item.compareValue)\"\n          [class.mat-calendar-body-comparison-identical]=\"_isComparisonIdentical(item.compareValue)\"\n          [class.mat-calendar-body-today]=\"todayValue === item.compareValue\">\n          {{item.displayValue}}\n        </span>\n        <span class=\"mat-calendar-body-cell-preview\" aria-hidden=\"true\"></span>\n    </button>\n  </td>\n</tr>\n\n<label [id]=\"_startDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{startDateAccessibleName}}\n</label>\n<label [id]=\"_endDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{endDateAccessibleName}}\n</label>\n", styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.7142857143%;padding-right:4.7142857143%}.mat-calendar-body-hidden-label{display:none}.mat-calendar-body-cell-container{position:relative;height:0;line-height:0}.mat-calendar-body-cell{-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;top:0;left:0;width:100%;height:100%;background:none;text-align:center;outline:none;font-family:inherit;margin:0}.mat-calendar-body-cell::-moz-focus-inner{border:0}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-cell-preview{content:\"\";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;display:block;height:90%;width:100%}.mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-start::after,.mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,.mat-calendar-body-comparison-start::after,.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,[dir=rtl] .mat-calendar-body-comparison-start::after,[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,.mat-calendar-body-comparison-end::after,.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,[dir=rtl] .mat-calendar-body-comparison-end::after,[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-comparison-bridge-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-bridge-end.mat-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end.mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-end.mat-calendar-body-range-start::after{width:90%}.mat-calendar-body-in-preview .mat-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.mat-calendar-body-disabled{cursor:default}.cdk-high-contrast-active .mat-calendar-body-disabled{opacity:.5}.mat-calendar-body-cell-content{top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}.mat-calendar-body-cell-content.mat-focus-indicator{position:absolute}.cdk-high-contrast-active .mat-calendar-body-cell-content{border:none}.cdk-high-contrast-active .mat-datepicker-popup:not(:empty),.cdk-high-contrast-active .mat-calendar-body-cell:not(.mat-calendar-body-in-range) .mat-calendar-body-selected{outline:solid 1px}.cdk-high-contrast-active .mat-calendar-body-today{outline:dotted 1px}.cdk-high-contrast-active .mat-calendar-body-cell::before,.cdk-high-contrast-active .mat-calendar-body-cell::after,.cdk-high-contrast-active .mat-calendar-body-selected{background:none}.cdk-high-contrast-active .mat-calendar-body-in-range::before,.cdk-high-contrast-active .mat-calendar-body-comparison-bridge-start::before,.cdk-high-contrast-active .mat-calendar-body-comparison-bridge-end::before{border-top:solid 1px;border-bottom:solid 1px}.cdk-high-contrast-active .mat-calendar-body-range-start::before{border-left:solid 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-range-start::before{border-left:0;border-right:solid 1px}.cdk-high-contrast-active .mat-calendar-body-range-end::before{border-right:solid 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-range-end::before{border-right:0;border-left:solid 1px}.cdk-high-contrast-active .mat-calendar-body-in-comparison-range::before{border-top:dashed 1px;border-bottom:dashed 1px}.cdk-high-contrast-active .mat-calendar-body-comparison-start::before{border-left:dashed 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-comparison-start::before{border-left:0;border-right:dashed 1px}.cdk-high-contrast-active .mat-calendar-body-comparison-end::before{border-right:dashed 1px}[dir=rtl] .cdk-high-contrast-active .mat-calendar-body-comparison-end::before{border-right:0;border-left:dashed 1px}[dir=rtl] .mat-calendar-body-label{text-align:right}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { label: [{
                type: Input
            }], rows: [{
                type: Input
            }], todayValue: [{
                type: Input
            }], startValue: [{
                type: Input
            }], endValue: [{
                type: Input
            }], labelMinRequiredCells: [{
                type: Input
            }], numCols: [{
                type: Input
            }], activeCell: [{
                type: Input
            }], isRange: [{
                type: Input
            }], cellAspectRatio: [{
                type: Input
            }], comparisonStart: [{
                type: Input
            }], comparisonEnd: [{
                type: Input
            }], previewStart: [{
                type: Input
            }], previewEnd: [{
                type: Input
            }], startDateAccessibleName: [{
                type: Input
            }], endDateAccessibleName: [{
                type: Input
            }], selectedValueChange: [{
                type: Output
            }], previewChange: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }] } });
/** Checks whether a node is a table cell element. */
function isTableCell(node) {
    return node?.nodeName === 'TD';
}
/**
 * Gets the date table cell element that is or contains the specified element.
 * Or returns null if element is not part of a date cell.
 */
function getCellElement(element) {
    let cell;
    if (isTableCell(element)) {
        cell = element;
    }
    else if (isTableCell(element.parentNode)) {
        cell = element.parentNode;
    }
    else if (isTableCell(element.parentNode?.parentNode)) {
        cell = element.parentNode.parentNode;
    }
    return cell?.getAttribute('data-mat-row') != null ? cell : null;
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
    return (rangeEnabled &&
        start !== null &&
        end !== null &&
        start !== end &&
        value >= start &&
        value <= end);
}
/**
 * Extracts the element that actually corresponds to a touch event's location
 * (rather than the element that initiated the sequence of touch events).
 */
function getActualTouchTarget(event) {
    const touchLocation = event.changedTouches[0];
    return document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci1ib2R5Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUtOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQVdwQzs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUNTLEtBQWEsRUFDYixZQUFvQixFQUNwQixTQUFpQixFQUNqQixPQUFnQixFQUNoQixhQUF3QyxFQUFFLEVBQzFDLGVBQWUsS0FBSyxFQUNwQixRQUFZO1FBTlosVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixlQUFVLEdBQVYsVUFBVSxDQUFnQztRQUMxQyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixhQUFRLEdBQVIsUUFBUSxDQUFJO0lBQ2xCLENBQUM7Q0FDTDtBQVFELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV2Qjs7O0dBR0c7QUFDSCxNQVdhLGVBQWU7SUFzQzFCLGtCQUFrQjtRQUNoQixJQUFJLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRTtZQUN6QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsZ0NBQWdDLEdBQUcsS0FBSyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQXdERCxZQUFvQixXQUFvQyxFQUFVLE9BQWU7UUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWxHekUsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQVFyQzs7V0FFRztRQUNLLHFDQUFnQyxHQUFHLEtBQUssQ0FBQztRQW9CakQsMENBQTBDO1FBQ2pDLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFFN0IsdURBQXVEO1FBQzlDLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFTaEMseUNBQXlDO1FBQ2hDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFFbEM7OztXQUdHO1FBQ00sb0JBQWUsR0FBVyxDQUFDLENBQUM7UUFRckMsa0NBQWtDO1FBQ3pCLGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUU1QyxnQ0FBZ0M7UUFDdkIsZUFBVSxHQUFrQixJQUFJLENBQUM7UUFRMUMsMENBQTBDO1FBQ3ZCLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFnQyxDQUFDO1FBRTFGLHVFQUF1RTtRQUNwRCxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUVoRCxDQUFDO1FBRWUscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQWdDLENBQUM7UUFFdkYsNERBQTREO1FBQ3pDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQTJCLENBQUM7UUFFN0UsK0ZBQStGO1FBQzVFLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBa0MsQ0FBQztRQVcxRSwyQkFBc0IsR0FBRyxLQUFLLENBQUM7UUFxUHZDOzs7V0FHRztRQUNLLGtCQUFhLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtZQUN2QyxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO2dCQUM1QixPQUFPO2FBQ1I7WUFFRCw2REFBNkQ7WUFDN0QsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsTUFBcUIsQ0FBQyxDQUFDO2dCQUVuRSxJQUFJLElBQUksRUFBRTtvQkFDUixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzdGO2FBQ0Y7UUFDSCxDQUFDLENBQUM7UUFFTSxzQkFBaUIsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUUxQixNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUU3RSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUMzQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO2FBQ3BDO1lBRUQsd0VBQXdFO1lBQ3hFLDRDQUE0QztZQUM1QyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBcUIsQ0FBQyxFQUFFO2dCQUMvQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDeEI7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0YsQ0FBQyxDQUFDO1FBRUY7OztXQUdHO1FBQ0ssa0JBQWEsR0FBRyxDQUFDLEtBQVksRUFBRSxFQUFFO1lBQ3ZDLDZEQUE2RDtZQUM3RCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQzVDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7aUJBQ3BDO2dCQUVELGtGQUFrRjtnQkFDbEYsK0VBQStFO2dCQUMvRSxtRkFBbUY7Z0JBQ25GLElBQ0UsS0FBSyxDQUFDLE1BQU07b0JBQ1osSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFxQixDQUFDO29CQUNyRCxDQUFDLENBQ0UsS0FBb0IsQ0FBQyxhQUFhO3dCQUNuQyxJQUFJLENBQUMsbUJBQW1CLENBQUUsS0FBb0IsQ0FBQyxhQUE0QixDQUFDLENBQzdFLEVBQ0Q7b0JBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkU7YUFDRjtRQUNILENBQUMsQ0FBQztRQUVGOzs7V0FHRztRQUNLLHNCQUFpQixHQUFHLENBQUMsS0FBWSxFQUFFLEVBQUU7WUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU87WUFFMUIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztZQUNwQyxnRUFBZ0U7WUFDaEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQXFCLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzVDLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDcEIsS0FBSztpQkFDTixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLDhFQUE4RTtRQUN0RSxvQkFBZSxHQUFHLENBQUMsS0FBWSxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU87WUFFMUIsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFxQixDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDaEIsdURBQXVEO2dCQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPO2FBQ1I7WUFFRCxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRTtnQkFDaEYsc0RBQXNEO2dCQUN0RCxnQ0FBZ0M7Z0JBQ2hDLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsK0VBQStFO1FBQ3ZFLHFCQUFnQixHQUFHLENBQUMsS0FBaUIsRUFBRSxFQUFFO1lBQy9DLE1BQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTNDLElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBQyxNQUFNLEVBQXFCLENBQUMsQ0FBQzthQUNwRDtRQUNILENBQUMsQ0FBQztRQWtCTSxRQUFHLEdBQUcscUJBQXFCLGNBQWMsRUFBRSxFQUFFLENBQUM7UUFFdEQsc0JBQWlCLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUM7UUFFN0Msb0JBQWUsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQWhZdkMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUM3QixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUQsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzlELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFL0QsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDNUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDNUQ7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsWUFBWSxDQUFDLElBQXFCLEVBQUUsS0FBaUI7UUFDbkQsd0VBQXdFO1FBQ3hFLGdEQUFnRDtRQUNoRCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0lBRUQscUJBQXFCLENBQUMsSUFBcUIsRUFBRSxLQUFpQjtRQUM1RCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0lBRUQsMkRBQTJEO0lBQzNELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUM7SUFDOUQsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekMsTUFBTSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFFN0IsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksYUFBYSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RjtRQUVELElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyRSxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDO1NBQ2pFO1FBRUQsSUFBSSxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBQy9DLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RSxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0QsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5RCxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFbEUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUM1QixNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQy9EO0lBQ0gsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxhQUFhLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUM5QyxJQUFJLFVBQVUsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFFcEQsc0VBQXNFO1FBQ3RFLElBQUksUUFBUSxFQUFFO1lBQ1osVUFBVSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDcEM7UUFFRCxPQUFPLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0gsZ0JBQWdCLENBQUMsV0FBVyxHQUFHLElBQUk7UUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2pELFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsTUFBTSxVQUFVLEdBQXVCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FDakYsMkJBQTJCLENBQzVCLENBQUM7b0JBRUYsSUFBSSxVQUFVLEVBQUU7d0JBQ2QsSUFBSSxDQUFDLFdBQVcsRUFBRTs0QkFDaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7eUJBQzVCO3dCQUVELFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDcEI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtGQUErRjtJQUMvRix3Q0FBd0M7UUFDdEMsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLElBQUksQ0FBQztJQUMvQyxDQUFDO0lBRUQsMkRBQTJEO0lBQzNELGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQseURBQXlEO0lBQ3pELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLFVBQVUsQ0FBQyxLQUFhO1FBQ3RCLE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxpRUFBaUU7SUFDakUsa0JBQWtCLENBQUMsS0FBYTtRQUM5QixPQUFPLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHNGQUFzRjtJQUN0Rix3QkFBd0IsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLFlBQVksR0FBZ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFbEYsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1QyxZQUFZLEdBQUcsV0FBVyxJQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsT0FBTyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQscUZBQXFGO0lBQ3JGLHNCQUFzQixDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCO1FBQ3RFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdkYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksUUFBUSxHQUFnQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUU5RSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEM7UUFFRCxPQUFPLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCwrREFBK0Q7SUFDL0QsZ0JBQWdCLENBQUMsS0FBYTtRQUM1QixPQUFPLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxvQkFBb0IsQ0FBQyxLQUFhO1FBQ2hDLE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxzQkFBc0IsQ0FBQyxLQUFhO1FBQ2xDLHNEQUFzRDtRQUN0RCxvREFBb0Q7UUFDcEQsT0FBTyxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDdkYsQ0FBQztJQUVELDhEQUE4RDtJQUM5RCxlQUFlLENBQUMsS0FBYTtRQUMzQixPQUFPLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxhQUFhLENBQUMsS0FBYTtRQUN6QixPQUFPLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELHdEQUF3RDtJQUN4RCxZQUFZLENBQUMsS0FBYTtRQUN4QixPQUFPLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLGVBQWUsQ0FBQyxLQUFhO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO1lBQ3hELE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzVEO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUssRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztTQUMvQjthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBNEhELGdFQUFnRTtJQUN4RCxtQkFBbUIsQ0FBQyxPQUFvQjtRQUM5QyxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFOUMsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO2dCQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoRDtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzhHQTlkVSxlQUFlO2tHQUFmLGVBQWUsMnpCQzFFNUIsdzBJQXFGQTs7U0RYYSxlQUFlOzJGQUFmLGVBQWU7a0JBWDNCLFNBQVM7K0JBQ0UscUJBQXFCLFFBR3pCO3dCQUNKLE9BQU8sRUFBRSxtQkFBbUI7cUJBQzdCLFlBQ1MsaUJBQWlCLGlCQUNaLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07c0hBaUJ0QyxLQUFLO3NCQUFiLEtBQUs7Z0JBR0csSUFBSTtzQkFBWixLQUFLO2dCQUdHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBR0csVUFBVTtzQkFBbEIsS0FBSztnQkFHRyxRQUFRO3NCQUFoQixLQUFLO2dCQUdHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFHRyxPQUFPO3NCQUFmLEtBQUs7Z0JBR0csVUFBVTtzQkFBbEIsS0FBSztnQkFVRyxPQUFPO3NCQUFmLEtBQUs7Z0JBTUcsZUFBZTtzQkFBdkIsS0FBSztnQkFHRyxlQUFlO3NCQUF2QixLQUFLO2dCQUdHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBR0csWUFBWTtzQkFBcEIsS0FBSztnQkFHRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdHLHVCQUF1QjtzQkFBL0IsS0FBSztnQkFHRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBR2EsbUJBQW1CO3NCQUFyQyxNQUFNO2dCQUdZLGFBQWE7c0JBQS9CLE1BQU07Z0JBSVksZ0JBQWdCO3NCQUFsQyxNQUFNO2dCQUdZLFdBQVc7c0JBQTdCLE1BQU07Z0JBR1ksU0FBUztzQkFBM0IsTUFBTTs7QUFpWlQscURBQXFEO0FBQ3JELFNBQVMsV0FBVyxDQUFDLElBQTZCO0lBQ2hELE9BQU8sSUFBSSxFQUFFLFFBQVEsS0FBSyxJQUFJLENBQUM7QUFDakMsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsY0FBYyxDQUFDLE9BQW9CO0lBQzFDLElBQUksSUFBNkIsQ0FBQztJQUNsQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDO0tBQ2hCO1NBQU0sSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzFDLElBQUksR0FBRyxPQUFPLENBQUMsVUFBeUIsQ0FBQztLQUMxQztTQUFNLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUU7UUFDdEQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFXLENBQUMsVUFBeUIsQ0FBQztLQUN0RDtJQUVELE9BQU8sSUFBSSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2xFLENBQUM7QUFFRCxzREFBc0Q7QUFDdEQsU0FBUyxPQUFPLENBQUMsS0FBYSxFQUFFLEtBQW9CLEVBQUUsR0FBa0I7SUFDdEUsT0FBTyxHQUFHLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxHQUFHLEdBQUcsSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDO0FBQ3pFLENBQUM7QUFFRCxvREFBb0Q7QUFDcEQsU0FBUyxLQUFLLENBQUMsS0FBYSxFQUFFLEtBQW9CLEVBQUUsR0FBa0I7SUFDcEUsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEtBQUssR0FBRyxDQUFDO0FBQzVFLENBQUM7QUFFRCxtREFBbUQ7QUFDbkQsU0FBUyxTQUFTLENBQ2hCLEtBQWEsRUFDYixLQUFvQixFQUNwQixHQUFrQixFQUNsQixZQUFxQjtJQUVyQixPQUFPLENBQ0wsWUFBWTtRQUNaLEtBQUssS0FBSyxJQUFJO1FBQ2QsR0FBRyxLQUFLLElBQUk7UUFDWixLQUFLLEtBQUssR0FBRztRQUNiLEtBQUssSUFBSSxLQUFLO1FBQ2QsS0FBSyxJQUFJLEdBQUcsQ0FDYixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsb0JBQW9CLENBQUMsS0FBaUI7SUFDN0MsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxPQUFPLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBBZnRlclZpZXdDaGVja2VkLFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKiBFeHRyYSBDU1MgY2xhc3NlcyB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBjYWxlbmRhciBjZWxsLiAqL1xuZXhwb3J0IHR5cGUgTWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcyA9IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fTtcblxuLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGdlbmVyYXRlIHRoZSBleHRyYSBjbGFzc2VzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIGEgY2FsZW5kYXIgY2VsbC4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyQ2VsbENsYXNzRnVuY3Rpb248RD4gPSAoXG4gIGRhdGU6IEQsXG4gIHZpZXc6ICdtb250aCcgfCAneWVhcicgfCAnbXVsdGkteWVhcicsXG4pID0+IE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXM7XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY2xhc3MgdGhhdCByZXByZXNlbnRzIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gYSBzaW5nbGUgY2FsZW5kYXIgY2VsbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyQ2VsbDxEID0gYW55PiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB2YWx1ZTogbnVtYmVyLFxuICAgIHB1YmxpYyBkaXNwbGF5VmFsdWU6IHN0cmluZyxcbiAgICBwdWJsaWMgYXJpYUxhYmVsOiBzdHJpbmcsXG4gICAgcHVibGljIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgcHVibGljIGNzc0NsYXNzZXM6IE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMgPSB7fSxcbiAgICBwdWJsaWMgY29tcGFyZVZhbHVlID0gdmFsdWUsXG4gICAgcHVibGljIHJhd1ZhbHVlPzogRCxcbiAgKSB7fVxufVxuXG4vKiogRXZlbnQgZW1pdHRlZCB3aGVuIGEgZGF0ZSBpbnNpZGUgdGhlIGNhbGVuZGFyIGlzIHRyaWdnZXJlZCBhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDYWxlbmRhclVzZXJFdmVudDxEPiB7XG4gIHZhbHVlOiBEO1xuICBldmVudDogRXZlbnQ7XG59XG5cbmxldCBjYWxlbmRhckJvZHlJZCA9IDE7XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHVzZWQgdG8gZGlzcGxheSBjYWxlbmRhciBkYXRhIGluIGEgdGFibGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FsZW5kYXItYm9keV0nLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWJvZHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjYWxlbmRhci1ib2R5LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYWxlbmRhci1ib2R5JyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRDYWxlbmRhckJvZHknLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXJCb2R5PEQgPSBhbnk+IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0NoZWNrZWQge1xuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc2tpcCB0aGUgbmV4dCBmb2N1cyBldmVudCB3aGVuIHJlbmRlcmluZyB0aGUgcHJldmlldyByYW5nZS5cbiAgICogV2UgbmVlZCBhIGZsYWcgbGlrZSB0aGlzLCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgZmlyZSBmb2N1cyBldmVudHMgYXN5bmNocm9ub3VzbHkuXG4gICAqL1xuICBwcml2YXRlIF9za2lwTmV4dEZvY3VzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGZvY3VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBydW4uXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0FjdGl2ZUNlbGxBZnRlclZpZXdDaGVja2VkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIHRhYmxlLiAoZS5nLiBcIkphbiAyMDE3XCIpLiAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgY2VsbHMgdG8gZGlzcGxheSBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIHJvd3M6IE1hdENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBjb3JyZXNwb25kcyB0byB0b2RheS4gKi9cbiAgQElucHV0KCkgdG9kYXlWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBTdGFydCB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS4gKi9cbiAgQElucHV0KCkgc3RhcnRWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBFbmQgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuICovXG4gIEBJbnB1dCgpIGVuZFZhbHVlOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBmcmVlIGNlbGxzIG5lZWRlZCB0byBmaXQgdGhlIGxhYmVsIGluIHRoZSBmaXJzdCByb3cuICovXG4gIEBJbnB1dCgpIGxhYmVsTWluUmVxdWlyZWRDZWxsczogbnVtYmVyO1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSBudW1Db2xzOiBudW1iZXIgPSA3O1xuXG4gIC8qKiBUaGUgY2VsbCBudW1iZXIgb2YgdGhlIGFjdGl2ZSBjZWxsIGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgYWN0aXZlQ2VsbDogbnVtYmVyID0gMDtcblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbEFmdGVyVmlld0NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIGEgcmFuZ2UgaXMgYmVpbmcgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpIGlzUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGFzcGVjdCByYXRpbyAod2lkdGggLyBoZWlnaHQpIHRvIHVzZSBmb3IgdGhlIGNlbGxzIGluIHRoZSB0YWJsZS4gVGhpcyBhc3BlY3QgcmF0aW8gd2lsbCBiZVxuICAgKiBtYWludGFpbmVkIGV2ZW4gYXMgdGhlIHRhYmxlIHJlc2l6ZXMuXG4gICAqL1xuICBASW5wdXQoKSBjZWxsQXNwZWN0UmF0aW86IG51bWJlciA9IDE7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogU3RhcnQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIEBJbnB1dCgpIHByZXZpZXdTdGFydDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgQElucHV0KCkgcHJldmlld0VuZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdFN0YXJ0RGF0ZS8+YCAqL1xuICBASW5wdXQoKSBzdGFydERhdGVBY2Nlc3NpYmxlTmFtZTogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogQVJJQSBBY2Nlc3NpYmxlIG5hbWUgb2YgdGhlIGA8aW5wdXQgbWF0RW5kRGF0ZS8+YCAqL1xuICBASW5wdXQoKSBlbmREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgdmFsdWUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZFZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxudW1iZXI+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBwcmV2aWV3IGhhcyBjaGFuZ2VkIGFzIGEgcmVzdWx0IG9mIGEgdXNlciBhY3Rpb24uICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwcmV2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBNYXRDYWxlbmRhclVzZXJFdmVudDxNYXRDYWxlbmRhckNlbGwgfCBudWxsPlxuICA+KCk7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFjdGl2ZURhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PG51bWJlcj4+KCk7XG5cbiAgLyoqIEVtaXRzIHRoZSBkYXRlIGF0IHRoZSBwb3NzaWJsZSBzdGFydCBvZiBhIGRyYWcgZXZlbnQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnU3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RD4+KCk7XG5cbiAgLyoqIEVtaXRzIHRoZSBkYXRlIGF0IHRoZSBjb25jbHVzaW9uIG9mIGEgZHJhZywgb3IgbnVsbCBpZiBtb3VzZSB3YXMgbm90IHJlbGVhc2VkIG9uIGEgZGF0ZS4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdFbmRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+PigpO1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGJsYW5rIGNlbGxzIHRvIHB1dCBhdCB0aGUgYmVnaW5uaW5nIGZvciB0aGUgZmlyc3Qgcm93LiAqL1xuICBfZmlyc3RSb3dPZmZzZXQ6IG51bWJlcjtcblxuICAvKiogUGFkZGluZyBmb3IgdGhlIGluZGl2aWR1YWwgZGF0ZSBjZWxscy4gKi9cbiAgX2NlbGxQYWRkaW5nOiBzdHJpbmc7XG5cbiAgLyoqIFdpZHRoIG9mIGFuIGluZGl2aWR1YWwgY2VsbC4gKi9cbiAgX2NlbGxXaWR0aDogc3RyaW5nO1xuXG4gIHByaXZhdGUgX2RpZERyYWdTaW5jZU1vdXNlRG93biA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge1xuICAgIF9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaG1vdmVIYW5kbGVyLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5fbGVhdmVIYW5kbGVyLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX21vdXNlZG93bkhhbmRsZXIpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fbW91c2Vkb3duSGFuZGxlcik7XG5cbiAgICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9tb3VzZXVwSGFuZGxlcik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3RvdWNoZW5kSGFuZGxlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gYSBjZWxsIGlzIGNsaWNrZWQuICovXG4gIF9jZWxsQ2xpY2tlZChjZWxsOiBNYXRDYWxlbmRhckNlbGwsIGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgLy8gSWdub3JlIFwiY2xpY2tzXCIgdGhhdCBhcmUgYWN0dWFsbHkgY2FuY2VsZWQgZHJhZ3MgKGVnIHRoZSB1c2VyIGRyYWdnZWRcbiAgICAvLyBvZmYgYW5kIHRoZW4gd2VudCBiYWNrIHRvIHRoaXMgY2VsbCB0byB1bmRvKS5cbiAgICBpZiAodGhpcy5fZGlkRHJhZ1NpbmNlTW91c2VEb3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNlbGwuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlQ2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsLnZhbHVlLCBldmVudH0pO1xuICAgIH1cbiAgfVxuXG4gIF9lbWl0QWN0aXZlRGF0ZUNoYW5nZShjZWxsOiBNYXRDYWxlbmRhckNlbGwsIGV2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCB7XG4gICAgaWYgKGNlbGwuZW5hYmxlZCkge1xuICAgICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsLnZhbHVlLCBldmVudH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgYSBjZWxsIHNob3VsZCBiZSBtYXJrZWQgYXMgc2VsZWN0ZWQuICovXG4gIF9pc1NlbGVjdGVkKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFZhbHVlID09PSB2YWx1ZSB8fCB0aGlzLmVuZFZhbHVlID09PSB2YWx1ZTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjb2x1bW5DaGFuZ2VzID0gY2hhbmdlc1snbnVtQ29scyddO1xuICAgIGNvbnN0IHtyb3dzLCBudW1Db2xzfSA9IHRoaXM7XG5cbiAgICBpZiAoY2hhbmdlc1sncm93cyddIHx8IGNvbHVtbkNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2ZpcnN0Um93T2Zmc2V0ID0gcm93cyAmJiByb3dzLmxlbmd0aCAmJiByb3dzWzBdLmxlbmd0aCA/IG51bUNvbHMgLSByb3dzWzBdLmxlbmd0aCA6IDA7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ2NlbGxBc3BlY3RSYXRpbyddIHx8IGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxQYWRkaW5nKSB7XG4gICAgICB0aGlzLl9jZWxsUGFkZGluZyA9IGAkeyg1MCAqIHRoaXMuY2VsbEFzcGVjdFJhdGlvKSAvIG51bUNvbHN9JWA7XG4gICAgfVxuXG4gICAgaWYgKGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxXaWR0aCkge1xuICAgICAgdGhpcy5fY2VsbFdpZHRoID0gYCR7MTAwIC8gbnVtQ29sc30lYDtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX2VudGVySGFuZGxlciwgdHJ1ZSk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaG1vdmVIYW5kbGVyLCB0cnVlKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fZW50ZXJIYW5kbGVyLCB0cnVlKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLl9sZWF2ZUhhbmRsZXIsIHRydWUpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9tb3VzZWRvd25IYW5kbGVyKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9tb3VzZWRvd25IYW5kbGVyKTtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fbW91c2V1cEhhbmRsZXIpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fdG91Y2hlbmRIYW5kbGVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGEgY2VsbCBpcyBhY3RpdmUuICovXG4gIF9pc0FjdGl2ZUNlbGwocm93SW5kZXg6IG51bWJlciwgY29sSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGxldCBjZWxsTnVtYmVyID0gcm93SW5kZXggKiB0aGlzLm51bUNvbHMgKyBjb2xJbmRleDtcblxuICAgIC8vIEFjY291bnQgZm9yIHRoZSBmYWN0IHRoYXQgdGhlIGZpcnN0IHJvdyBtYXkgbm90IGhhdmUgYXMgbWFueSBjZWxscy5cbiAgICBpZiAocm93SW5kZXgpIHtcbiAgICAgIGNlbGxOdW1iZXIgLT0gdGhpcy5fZmlyc3RSb3dPZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNlbGxOdW1iZXIgPT0gdGhpcy5hY3RpdmVDZWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGFjdGl2ZSBjZWxsIGFmdGVyIHRoZSBtaWNyb3Rhc2sgcXVldWUgaXMgZW1wdHkuXG4gICAqXG4gICAqIEFkZGluZyBhIDBtcyBzZXRUaW1lb3V0IHNlZW1zIHRvIGZpeCBWb2ljZW92ZXIgbG9zaW5nIGZvY3VzIHdoZW4gcHJlc3NpbmcgUGFnZVVwL1BhZ2VEb3duXG4gICAqIChpc3N1ZSAjMjQzMzApLlxuICAgKlxuICAgKiBEZXRlcm1pbmVkIGEgMG1zIGJ5IGdyYWR1YWxseSBpbmNyZWFzaW5nIGR1cmF0aW9uIGZyb20gMCBhbmQgdGVzdGluZyB0d28gdXNlIGNhc2VzIHdpdGggc2NyZWVuXG4gICAqIHJlYWRlciBlbmFibGVkOlxuICAgKlxuICAgKiAxLiBQcmVzc2luZyBQYWdlVXAvUGFnZURvd24gcmVwZWF0ZWRseSB3aXRoIHBhdXNpbmcgYmV0d2VlbiBlYWNoIGtleSBwcmVzcy5cbiAgICogMi4gUHJlc3NpbmcgYW5kIGhvbGRpbmcgdGhlIFBhZ2VEb3duIGtleSB3aXRoIHJlcGVhdGVkIGtleXMgZW5hYmxlZC5cbiAgICpcbiAgICogVGVzdCAxIHdvcmtlZCByb3VnaGx5IDk1LTk5JSBvZiB0aGUgdGltZSB3aXRoIDBtcyBhbmQgZ290IGEgbGl0dGxlIGJpdCBiZXR0ZXIgYXMgdGhlIGR1cmF0aW9uXG4gICAqIGluY3JlYXNlZC4gVGVzdCAyIGdvdCBzbGlnaHRseSBiZXR0ZXIgdW50aWwgdGhlIGR1cmF0aW9uIHdhcyBsb25nIGVub3VnaCB0byBpbnRlcmZlcmUgd2l0aFxuICAgKiByZXBlYXRlZCBrZXlzLiBJZiB0aGUgcmVwZWF0ZWQga2V5IHNwZWVkIHdhcyBmYXN0ZXIgdGhhbiB0aGUgdGltZW91dCBkdXJhdGlvbiwgdGhlbiBwcmVzc2luZ1xuICAgKiBhbmQgaG9sZGluZyBwYWdlZG93biBjYXVzZWQgdGhlIGVudGlyZSBwYWdlIHRvIHNjcm9sbC5cbiAgICpcbiAgICogU2luY2UgcmVwZWF0ZWQga2V5IHNwZWVkIGNhbiB2ZXJpZnkgYWNyb3NzIG1hY2hpbmVzLCBkZXRlcm1pbmVkIHRoYXQgYW55IGR1cmF0aW9uIGNvdWxkXG4gICAqIHBvdGVudGlhbGx5IGludGVyZmVyZSB3aXRoIHJlcGVhdGVkIGtleXMuIDBtcyB3b3VsZCBiZSBiZXN0IGJlY2F1c2UgaXQgYWxtb3N0IGVudGlyZWx5XG4gICAqIGVsaW1pbmF0ZXMgdGhlIGZvY3VzIGJlaW5nIGxvc3QgaW4gVm9pY2VvdmVyICgjMjQzMzApIHdpdGhvdXQgY2F1c2luZyB1bmludGVuZGVkIHNpZGUgZWZmZWN0cy5cbiAgICogQWRkaW5nIGRlbGF5IGFsc28gY29tcGxpY2F0ZXMgd3JpdGluZyB0ZXN0cy5cbiAgICovXG4gIF9mb2N1c0FjdGl2ZUNlbGwobW92ZVByZXZpZXcgPSB0cnVlKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgJy5tYXQtY2FsZW5kYXItYm9keS1hY3RpdmUnLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoYWN0aXZlQ2VsbCkge1xuICAgICAgICAgICAgaWYgKCFtb3ZlUHJldmlldykge1xuICAgICAgICAgICAgICB0aGlzLl9za2lwTmV4dEZvY3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWN0aXZlQ2VsbC5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBydW4gYW5kIHRoZSBtaWNyb3Rhc2sgcXVldWUgaXMgZW1wdHkuICovXG4gIF9zY2hlZHVsZUZvY3VzQWN0aXZlQ2VsbEFmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCA9IHRydWU7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBtYWluIHJhbmdlLiAqL1xuICBfaXNSYW5nZVN0YXJ0KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNTdGFydCh2YWx1ZSwgdGhpcy5zdGFydFZhbHVlLCB0aGlzLmVuZFZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgZW5kIG9mIHRoZSBtYWluIHJhbmdlLiAqL1xuICBfaXNSYW5nZUVuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzRW5kKHZhbHVlLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuZW5kVmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHdpdGhpbiB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHJhbmdlLiAqL1xuICBfaXNJblJhbmdlKHZhbHVlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNJblJhbmdlKHZhbHVlLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuZW5kVmFsdWUsIHRoaXMuaXNSYW5nZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBfaXNDb21wYXJpc29uU3RhcnQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc1N0YXJ0KHZhbHVlLCB0aGlzLmNvbXBhcmlzb25TdGFydCwgdGhpcy5jb21wYXJpc29uRW5kKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIGEgc3RhcnQgYnJpZGdlIGNlbGwgYmV0d2VlbiB0aGUgbWFpbiBhbmQgY29tcGFyaXNvbiByYW5nZXMuICovXG4gIF9pc0NvbXBhcmlzb25CcmlkZ2VTdGFydCh2YWx1ZTogbnVtYmVyLCByb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLl9pc0NvbXBhcmlzb25TdGFydCh2YWx1ZSkgfHwgdGhpcy5faXNSYW5nZVN0YXJ0KHZhbHVlKSB8fCAhdGhpcy5faXNJblJhbmdlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBwcmV2aW91c0NlbGw6IE1hdENhbGVuZGFyQ2VsbCB8IHVuZGVmaW5lZCA9IHRoaXMucm93c1tyb3dJbmRleF1bY29sSW5kZXggLSAxXTtcblxuICAgIGlmICghcHJldmlvdXNDZWxsKSB7XG4gICAgICBjb25zdCBwcmV2aW91c1JvdyA9IHRoaXMucm93c1tyb3dJbmRleCAtIDFdO1xuICAgICAgcHJldmlvdXNDZWxsID0gcHJldmlvdXNSb3cgJiYgcHJldmlvdXNSb3dbcHJldmlvdXNSb3cubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZXZpb3VzQ2VsbCAmJiAhdGhpcy5faXNSYW5nZUVuZChwcmV2aW91c0NlbGwuY29tcGFyZVZhbHVlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIGFuIGVuZCBicmlkZ2UgY2VsbCBiZXR3ZWVuIHRoZSBtYWluIGFuZCBjb21wYXJpc29uIHJhbmdlcy4gKi9cbiAgX2lzQ29tcGFyaXNvbkJyaWRnZUVuZCh2YWx1ZTogbnVtYmVyLCByb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLl9pc0NvbXBhcmlzb25FbmQodmFsdWUpIHx8IHRoaXMuX2lzUmFuZ2VFbmQodmFsdWUpIHx8ICF0aGlzLl9pc0luUmFuZ2UodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IG5leHRDZWxsOiBNYXRDYWxlbmRhckNlbGwgfCB1bmRlZmluZWQgPSB0aGlzLnJvd3Nbcm93SW5kZXhdW2NvbEluZGV4ICsgMV07XG5cbiAgICBpZiAoIW5leHRDZWxsKSB7XG4gICAgICBjb25zdCBuZXh0Um93ID0gdGhpcy5yb3dzW3Jvd0luZGV4ICsgMV07XG4gICAgICBuZXh0Q2VsbCA9IG5leHRSb3cgJiYgbmV4dFJvd1swXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dENlbGwgJiYgIXRoaXMuX2lzUmFuZ2VTdGFydChuZXh0Q2VsbC5jb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIF9pc0NvbXBhcmlzb25FbmQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0VuZCh2YWx1ZSwgdGhpcy5jb21wYXJpc29uU3RhcnQsIHRoaXMuY29tcGFyaXNvbkVuZCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgd2l0aGluIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIF9pc0luQ29tcGFyaXNvblJhbmdlKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNJblJhbmdlKHZhbHVlLCB0aGlzLmNvbXBhcmlzb25TdGFydCwgdGhpcy5jb21wYXJpc29uRW5kLCB0aGlzLmlzUmFuZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzYW1lIGFzIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLlxuICAgKiBGb3IgY29udGV4dCwgdGhlIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSB0byBkZXRlcm1pbmUgd2hldGhlciBzb21ldGhpbmcgaXMgdGhlIHN0YXJ0L2VuZCBvZlxuICAgKiBhIHJhbmdlIGRvbid0IGFsbG93IGZvciB0aGUgc3RhcnQgYW5kIGVuZCB0byBiZSBvbiB0aGUgc2FtZSBkYXksIGJlY2F1c2Ugd2UnZCBoYXZlIHRvIHVzZVxuICAgKiBtdWNoIG1vcmUgc3BlY2lmaWMgQ1NTIHNlbGVjdG9ycyB0byBzdHlsZSB0aGVtIGNvcnJlY3RseSBpbiBhbGwgc2NlbmFyaW9zLiBUaGlzIGlzIGZpbmUgZm9yXG4gICAqIHRoZSByZWd1bGFyIHJhbmdlLCBiZWNhdXNlIHdoZW4gaXQgaGFwcGVucywgdGhlIHNlbGVjdGVkIHN0eWxlcyB0YWtlIG92ZXIgYW5kIHN0aWxsIHNob3cgd2hlcmVcbiAgICogdGhlIHJhbmdlIHdvdWxkJ3ZlIGJlZW4sIGhvd2V2ZXIgd2UgZG9uJ3QgaGF2ZSB0aGVzZSBzZWxlY3RlZCBzdHlsZXMgZm9yIGEgY29tcGFyaXNvbiByYW5nZS5cbiAgICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGFwcGx5IGEgY2xhc3MgdGhhdCBzZXJ2ZXMgdGhlIHNhbWUgcHVycG9zZSBhcyB0aGUgb25lIGZvciBzZWxlY3RlZFxuICAgKiBkYXRlcywgYnV0IGl0IG9ubHkgYXBwbGllcyBpbiB0aGUgY29udGV4dCBvZiBhIGNvbXBhcmlzb24gcmFuZ2UuXG4gICAqL1xuICBfaXNDb21wYXJpc29uSWRlbnRpY2FsKHZhbHVlOiBudW1iZXIpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3QgbmVlZCB0byBudWxsIGNoZWNrIHRoZSBzdGFydC9lbmRcbiAgICAvLyBoZXJlLCBiZWNhdXNlIHRoZSBgdmFsdWVgIHdpbGwgYWx3YXlzIGJlIGRlZmluZWQuXG4gICAgcmV0dXJuIHRoaXMuY29tcGFyaXNvblN0YXJ0ID09PSB0aGlzLmNvbXBhcmlzb25FbmQgJiYgdmFsdWUgPT09IHRoaXMuY29tcGFyaXNvblN0YXJ0O1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzdGFydCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX2lzUHJldmlld1N0YXJ0KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNTdGFydCh2YWx1ZSwgdGhpcy5wcmV2aWV3U3RhcnQsIHRoaXMucHJldmlld0VuZCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX2lzUHJldmlld0VuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzRW5kKHZhbHVlLCB0aGlzLnByZXZpZXdTdGFydCwgdGhpcy5wcmV2aWV3RW5kKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyBpbnNpZGUgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIF9pc0luUHJldmlldyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzSW5SYW5nZSh2YWx1ZSwgdGhpcy5wcmV2aWV3U3RhcnQsIHRoaXMucHJldmlld0VuZCwgdGhpcy5pc1JhbmdlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGlkcyBvZiBhcmlhIGRlc2NyaXB0aW9ucyBmb3IgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgYSBkYXRlIHJhbmdlLiAqL1xuICBfZ2V0RGVzY3JpYmVkYnkodmFsdWU6IG51bWJlcik6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc1JhbmdlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGFydFZhbHVlID09PSB2YWx1ZSAmJiB0aGlzLmVuZFZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGAke3RoaXMuX3N0YXJ0RGF0ZUxhYmVsSWR9ICR7dGhpcy5fZW5kRGF0ZUxhYmVsSWR9YDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRWYWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFydERhdGVMYWJlbElkO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbmRWYWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbmREYXRlTGFiZWxJZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgdXNlciBlbnRlcnMgYW4gZWxlbWVudFxuICAgKiBpbnNpZGUgdGhlIGNhbGVuZGFyIGJvZHkgKGUuZy4gYnkgaG92ZXJpbmcgaW4gb3IgZm9jdXMpLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW50ZXJIYW5kbGVyID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9za2lwTmV4dEZvY3VzICYmIGV2ZW50LnR5cGUgPT09ICdmb2N1cycpIHtcbiAgICAgIHRoaXMuX3NraXBOZXh0Rm9jdXMgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gaGl0IHRoZSB6b25lIHdoZW4gd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgaWYgKGV2ZW50LnRhcmdldCAmJiB0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLl9nZXRDZWxsRnJvbUVsZW1lbnQoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcblxuICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7dmFsdWU6IGNlbGwuZW5hYmxlZCA/IGNlbGwgOiBudWxsLCBldmVudH0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBfdG91Y2htb3ZlSGFuZGxlciA9IChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5pc1JhbmdlKSByZXR1cm47XG5cbiAgICBjb25zdCB0YXJnZXQgPSBnZXRBY3R1YWxUb3VjaFRhcmdldChldmVudCk7XG4gICAgY29uc3QgY2VsbCA9IHRhcmdldCA/IHRoaXMuX2dldENlbGxGcm9tRWxlbWVudCh0YXJnZXQgYXMgSFRNTEVsZW1lbnQpIDogbnVsbDtcblxuICAgIGlmICh0YXJnZXQgIT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgdGhpcy5fZGlkRHJhZ1NpbmNlTW91c2VEb3duID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgaW5pdGlhbCB0YXJnZXQgb2YgdGhlIHRvdWNoIGlzIGEgZGF0ZSBjZWxsLCBwcmV2ZW50IGRlZmF1bHQgc29cbiAgICAvLyB0aGF0IHRoZSBtb3ZlIGlzIG5vdCBoYW5kbGVkIGFzIGEgc2Nyb2xsLlxuICAgIGlmIChnZXRDZWxsRWxlbWVudChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsPy5lbmFibGVkID8gY2VsbCA6IG51bGwsIGV2ZW50fSkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB1c2VyJ3MgcG9pbnRlciBsZWF2ZXMgYW4gZWxlbWVudFxuICAgKiBpbnNpZGUgdGhlIGNhbGVuZGFyIGJvZHkgKGUuZy4gYnkgaG92ZXJpbmcgb3V0IG9yIGJsdXJyaW5nKS5cbiAgICovXG4gIHByaXZhdGUgX2xlYXZlSGFuZGxlciA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gaGl0IHRoZSB6b25lIHdoZW4gd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgaWYgKHRoaXMucHJldmlld0VuZCAhPT0gbnVsbCAmJiB0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGlmIChldmVudC50eXBlICE9PSAnYmx1cicpIHtcbiAgICAgICAgdGhpcy5fZGlkRHJhZ1NpbmNlTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gT25seSByZXNldCB0aGUgcHJldmlldyBlbmQgdmFsdWUgd2hlbiBsZWF2aW5nIGNlbGxzLiBUaGlzIGxvb2tzIGJldHRlciwgYmVjYXVzZVxuICAgICAgLy8gd2UgaGF2ZSBhIGdhcCBiZXR3ZWVuIHRoZSBjZWxscyBhbmQgdGhlIHJvd3MgYW5kIHdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZVxuICAgICAgLy8gcmFuZ2UganVzdCBmb3IgaXQgdG8gc2hvdyB1cCBhZ2FpbiB3aGVuIHRoZSB1c2VyIG1vdmVzIGEgZmV3IHBpeGVscyB0byB0aGUgc2lkZS5cbiAgICAgIGlmIChcbiAgICAgICAgZXZlbnQudGFyZ2V0ICYmXG4gICAgICAgIHRoaXMuX2dldENlbGxGcm9tRWxlbWVudChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpICYmXG4gICAgICAgICEoXG4gICAgICAgICAgKGV2ZW50IGFzIE1vdXNlRXZlbnQpLnJlbGF0ZWRUYXJnZXQgJiZcbiAgICAgICAgICB0aGlzLl9nZXRDZWxsRnJvbUVsZW1lbnQoKGV2ZW50IGFzIE1vdXNlRXZlbnQpLnJlbGF0ZWRUYXJnZXQgYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMucHJldmlld0NoYW5nZS5lbWl0KHt2YWx1ZTogbnVsbCwgZXZlbnR9KSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBUcmlnZ2VyZWQgb24gbW91c2Vkb3duIG9yIHRvdWNoc3RhcnQgb24gYSBkYXRlIGNlbGwuXG4gICAqIFJlc3Bzb25zaWJsZSBmb3Igc3RhcnRpbmcgYSBkcmFnIHNlcXVlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfbW91c2Vkb3duSGFuZGxlciA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuaXNSYW5nZSkgcmV0dXJuO1xuXG4gICAgdGhpcy5fZGlkRHJhZ1NpbmNlTW91c2VEb3duID0gZmFsc2U7XG4gICAgLy8gQmVnaW4gYSBkcmFnIGlmIGEgY2VsbCB3aXRoaW4gdGhlIGN1cnJlbnQgcmFuZ2Ugd2FzIHRhcmdldGVkLlxuICAgIGNvbnN0IGNlbGwgPSBldmVudC50YXJnZXQgJiYgdGhpcy5fZ2V0Q2VsbEZyb21FbGVtZW50KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7XG4gICAgaWYgKCFjZWxsIHx8ICF0aGlzLl9pc0luUmFuZ2UoY2VsbC5yYXdWYWx1ZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0ZWQuZW1pdCh7XG4gICAgICAgIHZhbHVlOiBjZWxsLnJhd1ZhbHVlLFxuICAgICAgICBldmVudCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKiBUcmlnZ2VyZWQgb24gbW91c2V1cCBhbnl3aGVyZS4gUmVzcHNvbnNpYmxlIGZvciBlbmRpbmcgYSBkcmFnIHNlcXVlbmNlLiAqL1xuICBwcml2YXRlIF9tb3VzZXVwSGFuZGxlciA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuaXNSYW5nZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2VsbEVsZW1lbnQgPSBnZXRDZWxsRWxlbWVudChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIGlmICghY2VsbEVsZW1lbnQpIHtcbiAgICAgIC8vIE1vdXNldXAgaGFwcGVuZWQgb3V0c2lkZSBvZiBkYXRlcGlja2VyLiBDYW5jZWwgZHJhZy5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmRyYWdFbmRlZC5lbWl0KHt2YWx1ZTogbnVsbCwgZXZlbnR9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjZWxsRWxlbWVudC5jbG9zZXN0KCcubWF0LWNhbGVuZGFyLWJvZHknKSAhPT0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAvLyBNb3VzZXVwIGhhcHBlbmVkIGluc2lkZSBhIGRpZmZlcmVudCBtb250aCBpbnN0YW5jZS5cbiAgICAgIC8vIEFsbG93IGl0IHRvIGhhbmRsZSB0aGUgZXZlbnQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICBjb25zdCBjZWxsID0gdGhpcy5fZ2V0Q2VsbEZyb21FbGVtZW50KGNlbGxFbGVtZW50KTtcbiAgICAgIHRoaXMuZHJhZ0VuZGVkLmVtaXQoe3ZhbHVlOiBjZWxsPy5yYXdWYWx1ZSA/PyBudWxsLCBldmVudH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKiBUcmlnZ2VyZWQgb24gdG91Y2hlbmQgYW55d2hlcmUuIFJlc3Bzb25zaWJsZSBmb3IgZW5kaW5nIGEgZHJhZyBzZXF1ZW5jZS4gKi9cbiAgcHJpdmF0ZSBfdG91Y2hlbmRIYW5kbGVyID0gKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZ2V0QWN0dWFsVG91Y2hUYXJnZXQoZXZlbnQpO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5fbW91c2V1cEhhbmRsZXIoe3RhcmdldH0gYXMgdW5rbm93biBhcyBFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBGaW5kcyB0aGUgTWF0Q2FsZW5kYXJDZWxsIHRoYXQgY29ycmVzcG9uZHMgdG8gYSBET00gbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2VsbEZyb21FbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogTWF0Q2FsZW5kYXJDZWxsIHwgbnVsbCB7XG4gICAgY29uc3QgY2VsbCA9IGdldENlbGxFbGVtZW50KGVsZW1lbnQpO1xuXG4gICAgaWYgKGNlbGwpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1yb3cnKTtcbiAgICAgIGNvbnN0IGNvbCA9IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1jb2wnKTtcblxuICAgICAgaWYgKHJvdyAmJiBjb2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm93c1twYXJzZUludChyb3cpXVtwYXJzZUludChjb2wpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2lkID0gYG1hdC1jYWxlbmRhci1ib2R5LSR7Y2FsZW5kYXJCb2R5SWQrK31gO1xuXG4gIF9zdGFydERhdGVMYWJlbElkID0gYCR7dGhpcy5faWR9LXN0YXJ0LWRhdGVgO1xuXG4gIF9lbmREYXRlTGFiZWxJZCA9IGAke3RoaXMuX2lkfS1lbmQtZGF0ZWA7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIG5vZGUgaXMgYSB0YWJsZSBjZWxsIGVsZW1lbnQuICovXG5mdW5jdGlvbiBpc1RhYmxlQ2VsbChub2RlOiBOb2RlIHwgdW5kZWZpbmVkIHwgbnVsbCk6IG5vZGUgaXMgSFRNTFRhYmxlQ2VsbEVsZW1lbnQge1xuICByZXR1cm4gbm9kZT8ubm9kZU5hbWUgPT09ICdURCc7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0ZSB0YWJsZSBjZWxsIGVsZW1lbnQgdGhhdCBpcyBvciBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKiBPciByZXR1cm5zIG51bGwgaWYgZWxlbWVudCBpcyBub3QgcGFydCBvZiBhIGRhdGUgY2VsbC5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2VsbEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICBsZXQgY2VsbDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGlmIChpc1RhYmxlQ2VsbChlbGVtZW50KSkge1xuICAgIGNlbGwgPSBlbGVtZW50O1xuICB9IGVsc2UgaWYgKGlzVGFibGVDZWxsKGVsZW1lbnQucGFyZW50Tm9kZSkpIHtcbiAgICBjZWxsID0gZWxlbWVudC5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50O1xuICB9IGVsc2UgaWYgKGlzVGFibGVDZWxsKGVsZW1lbnQucGFyZW50Tm9kZT8ucGFyZW50Tm9kZSkpIHtcbiAgICBjZWxsID0gZWxlbWVudC5wYXJlbnROb2RlIS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIGNlbGw/LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtcm93JykgIT0gbnVsbCA/IGNlbGwgOiBudWxsO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgc3RhcnQgb2YgYSByYW5nZS4gKi9cbmZ1bmN0aW9uIGlzU3RhcnQodmFsdWU6IG51bWJlciwgc3RhcnQ6IG51bWJlciB8IG51bGwsIGVuZDogbnVtYmVyIHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZW5kICE9PSBudWxsICYmIHN0YXJ0ICE9PSBlbmQgJiYgdmFsdWUgPCBlbmQgJiYgdmFsdWUgPT09IHN0YXJ0O1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgZW5kIG9mIGEgcmFuZ2UuICovXG5mdW5jdGlvbiBpc0VuZCh2YWx1ZTogbnVtYmVyLCBzdGFydDogbnVtYmVyIHwgbnVsbCwgZW5kOiBudW1iZXIgfCBudWxsKTogYm9vbGVhbiB7XG4gIHJldHVybiBzdGFydCAhPT0gbnVsbCAmJiBzdGFydCAhPT0gZW5kICYmIHZhbHVlID49IHN0YXJ0ICYmIHZhbHVlID09PSBlbmQ7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIGluc2lkZSBvZiBhIHJhbmdlLiAqL1xuZnVuY3Rpb24gaXNJblJhbmdlKFxuICB2YWx1ZTogbnVtYmVyLFxuICBzdGFydDogbnVtYmVyIHwgbnVsbCxcbiAgZW5kOiBudW1iZXIgfCBudWxsLFxuICByYW5nZUVuYWJsZWQ6IGJvb2xlYW4sXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICByYW5nZUVuYWJsZWQgJiZcbiAgICBzdGFydCAhPT0gbnVsbCAmJlxuICAgIGVuZCAhPT0gbnVsbCAmJlxuICAgIHN0YXJ0ICE9PSBlbmQgJiZcbiAgICB2YWx1ZSA+PSBzdGFydCAmJlxuICAgIHZhbHVlIDw9IGVuZFxuICApO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBlbGVtZW50IHRoYXQgYWN0dWFsbHkgY29ycmVzcG9uZHMgdG8gYSB0b3VjaCBldmVudCdzIGxvY2F0aW9uXG4gKiAocmF0aGVyIHRoYW4gdGhlIGVsZW1lbnQgdGhhdCBpbml0aWF0ZWQgdGhlIHNlcXVlbmNlIG9mIHRvdWNoIGV2ZW50cykuXG4gKi9cbmZ1bmN0aW9uIGdldEFjdHVhbFRvdWNoVGFyZ2V0KGV2ZW50OiBUb3VjaEV2ZW50KTogRWxlbWVudCB8IG51bGwge1xuICBjb25zdCB0b3VjaExvY2F0aW9uID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gIHJldHVybiBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoTG9jYXRpb24uY2xpZW50WCwgdG91Y2hMb2NhdGlvbi5jbGllbnRZKTtcbn1cbiIsIjwhLS1cbiAgSWYgdGhlcmUncyBub3QgZW5vdWdoIHNwYWNlIGluIHRoZSBmaXJzdCByb3csIGNyZWF0ZSBhIHNlcGFyYXRlIGxhYmVsIHJvdy4gV2UgbWFyayB0aGlzIHJvdyBhc1xuICBhcmlhLWhpZGRlbiBiZWNhdXNlIHdlIGRvbid0IHdhbnQgaXQgdG8gYmUgcmVhZCBvdXQgYXMgb25lIG9mIHRoZSB3ZWVrcyBpbiB0aGUgbW9udGguXG4tLT5cbjx0ciAqbmdJZj1cIl9maXJzdFJvd09mZnNldCA8IGxhYmVsTWluUmVxdWlyZWRDZWxsc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICA8dGQgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1sYWJlbFwiXG4gICAgICBbYXR0ci5jb2xzcGFuXT1cIm51bUNvbHNcIlxuICAgICAgW3N0eWxlLnBhZGRpbmdUb3BdPVwiX2NlbGxQYWRkaW5nXCJcbiAgICAgIFtzdHlsZS5wYWRkaW5nQm90dG9tXT1cIl9jZWxsUGFkZGluZ1wiPlxuICAgIHt7bGFiZWx9fVxuICA8L3RkPlxuPC90cj5cblxuPCEtLSBDcmVhdGUgdGhlIGZpcnN0IHJvdyBzZXBhcmF0ZWx5IHNvIHdlIGNhbiBpbmNsdWRlIGEgc3BlY2lhbCBzcGFjZXIgY2VsbC4gLS0+XG48dHIgKm5nRm9yPVwibGV0IHJvdyBvZiByb3dzOyBsZXQgcm93SW5kZXggPSBpbmRleFwiIHJvbGU9XCJyb3dcIj5cbiAgPCEtLVxuICAgIFRoaXMgY2VsbCBpcyBwdXJlbHkgZGVjb3JhdGl2ZSwgYnV0IHdlIGNhbid0IHB1dCBgYXJpYS1oaWRkZW5gIG9yIGByb2xlPVwicHJlc2VudGF0aW9uXCJgIG9uIGl0LFxuICAgIGJlY2F1c2UgaXQgdGhyb3dzIG9mZiB0aGUgd2VlayBkYXlzIGZvciB0aGUgcmVzdCBvZiB0aGUgcm93IG9uIE5WREEuIFRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlXG4gICAgdGFibGUgY2VsbHMgaXMgbWFpbnRhaW5lZCBieSBzZXR0aW5nIHRoZSB0b3AgYW5kIGJvdHRvbSBwYWRkaW5nIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGhcbiAgICAoYSB2YXJpYW50IG9mIHRoZSB0cmljayBkZXNjcmliZWQgaGVyZTogaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS9ob3d0by9ob3d0b19jc3NfYXNwZWN0X3JhdGlvLmFzcCkuXG4gIC0tPlxuICA8dGQgKm5nSWY9XCJyb3dJbmRleCA9PT0gMCAmJiBfZmlyc3RSb3dPZmZzZXRcIlxuICAgICAgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1sYWJlbFwiXG4gICAgICBbYXR0ci5jb2xzcGFuXT1cIl9maXJzdFJvd09mZnNldFwiXG4gICAgICBbc3R5bGUucGFkZGluZ1RvcF09XCJfY2VsbFBhZGRpbmdcIlxuICAgICAgW3N0eWxlLnBhZGRpbmdCb3R0b21dPVwiX2NlbGxQYWRkaW5nXCI+XG4gICAge3tfZmlyc3RSb3dPZmZzZXQgPj0gbGFiZWxNaW5SZXF1aXJlZENlbGxzID8gbGFiZWwgOiAnJ319XG4gIDwvdGQ+XG4gIDwhLS1cbiAgICBFYWNoIGdyaWRjZWxsIGluIHRoZSBjYWxlbmRhciBjb250YWlucyBhIGJ1dHRvbiwgd2hpY2ggc2lnbmFscyB0byBhc3Npc3RpdmUgdGVjaG5vbG9neSB0aGF0IHRoZVxuICAgIGNlbGwgaXMgaW50ZXJhY3RhYmxlLCBhcyB3ZWxsIGFzIHRoZSBzZWxlY3Rpb24gc3RhdGUgdmlhIGBhcmlhLXByZXNzZWRgLiBTZWUgIzIzNDc2IGZvclxuICAgIGJhY2tncm91bmQuXG4gIC0tPlxuICA8dGRcbiAgICAqbmdGb3I9XCJsZXQgaXRlbSBvZiByb3c7IGxldCBjb2xJbmRleCA9IGluZGV4XCJcbiAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgIGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktY2VsbC1jb250YWluZXJcIlxuICAgIFtzdHlsZS53aWR0aF09XCJfY2VsbFdpZHRoXCJcbiAgICBbc3R5bGUucGFkZGluZ1RvcF09XCJfY2VsbFBhZGRpbmdcIlxuICAgIFtzdHlsZS5wYWRkaW5nQm90dG9tXT1cIl9jZWxsUGFkZGluZ1wiXG4gICAgW2F0dHIuZGF0YS1tYXQtcm93XT1cInJvd0luZGV4XCJcbiAgICBbYXR0ci5kYXRhLW1hdC1jb2xdPVwiY29sSW5kZXhcIlxuICA+XG4gICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1jZWxsXCJcbiAgICAgICAgW25nQ2xhc3NdPVwiaXRlbS5jc3NDbGFzc2VzXCJcbiAgICAgICAgW3RhYmluZGV4XT1cIl9pc0FjdGl2ZUNlbGwocm93SW5kZXgsIGNvbEluZGV4KSA/IDAgOiAtMVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWFjdGl2ZV09XCJfaXNBY3RpdmVDZWxsKHJvd0luZGV4LCBjb2xJbmRleClcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktcmFuZ2Utc3RhcnRdPVwiX2lzUmFuZ2VTdGFydChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktcmFuZ2UtZW5kXT1cIl9pc1JhbmdlRW5kKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1pbi1yYW5nZV09XCJfaXNJblJhbmdlKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1jb21wYXJpc29uLWJyaWRnZS1zdGFydF09XCJfaXNDb21wYXJpc29uQnJpZGdlU3RhcnQoaXRlbS5jb21wYXJlVmFsdWUsIHJvd0luZGV4LCBjb2xJbmRleClcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktY29tcGFyaXNvbi1icmlkZ2UtZW5kXT1cIl9pc0NvbXBhcmlzb25CcmlkZ2VFbmQoaXRlbS5jb21wYXJlVmFsdWUsIHJvd0luZGV4LCBjb2xJbmRleClcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktY29tcGFyaXNvbi1zdGFydF09XCJfaXNDb21wYXJpc29uU3RhcnQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWNvbXBhcmlzb24tZW5kXT1cIl9pc0NvbXBhcmlzb25FbmQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWluLWNvbXBhcmlzb24tcmFuZ2VdPVwiX2lzSW5Db21wYXJpc29uUmFuZ2UoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LXByZXZpZXctc3RhcnRdPVwiX2lzUHJldmlld1N0YXJ0KGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1wcmV2aWV3LWVuZF09XCJfaXNQcmV2aWV3RW5kKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1pbi1wcmV2aWV3XT1cIl9pc0luUHJldmlldyhpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIml0ZW0uYXJpYUxhYmVsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkIHx8IG51bGxcIlxuICAgICAgICBbYXR0ci5hcmlhLXByZXNzZWRdPVwiX2lzU2VsZWN0ZWQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1jdXJyZW50XT1cInRvZGF5VmFsdWUgPT09IGl0ZW0uY29tcGFyZVZhbHVlID8gJ2RhdGUnIDogbnVsbFwiXG4gICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiX2dldERlc2NyaWJlZGJ5KGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIChjbGljayk9XCJfY2VsbENsaWNrZWQoaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgIChmb2N1cyk9XCJfZW1pdEFjdGl2ZURhdGVDaGFuZ2UoaXRlbSwgJGV2ZW50KVwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdC1jYWxlbmRhci1ib2R5LWNlbGwtY29udGVudCBtYXQtZm9jdXMtaW5kaWNhdG9yXCJcbiAgICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktc2VsZWN0ZWRdPVwiX2lzU2VsZWN0ZWQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktY29tcGFyaXNvbi1pZGVudGljYWxdPVwiX2lzQ29tcGFyaXNvbklkZW50aWNhbChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS10b2RheV09XCJ0b2RheVZhbHVlID09PSBpdGVtLmNvbXBhcmVWYWx1ZVwiPlxuICAgICAgICAgIHt7aXRlbS5kaXNwbGF5VmFsdWV9fVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktY2VsbC1wcmV2aWV3XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICA8L3RkPlxuPC90cj5cblxuPGxhYmVsIFtpZF09XCJfc3RhcnREYXRlTGFiZWxJZFwiIGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktaGlkZGVuLWxhYmVsXCI+XG4gIHt7c3RhcnREYXRlQWNjZXNzaWJsZU5hbWV9fVxuPC9sYWJlbD5cbjxsYWJlbCBbaWRdPVwiX2VuZERhdGVMYWJlbElkXCIgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1oaWRkZW4tbGFiZWxcIj5cbiAge3tlbmREYXRlQWNjZXNzaWJsZU5hbWV9fVxuPC9sYWJlbD5cbiJdfQ==