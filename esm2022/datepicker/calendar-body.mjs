/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
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
/** Event options that can be used to bind an active, capturing event. */
const activeCapturingEventOptions = normalizePassiveListenerOptions({
    passive: false,
    capture: true,
});
/** Event options that can be used to bind a passive, capturing event. */
const passiveCapturingEventOptions = normalizePassiveListenerOptions({
    passive: true,
    capture: true,
});
/** Event options that can be used to bind a passive, non-capturing event. */
const passiveEventOptions = normalizePassiveListenerOptions({ passive: true });
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
            // `touchmove` is active since we need to call `preventDefault`.
            element.addEventListener('touchmove', this._touchmoveHandler, activeCapturingEventOptions);
            element.addEventListener('mouseenter', this._enterHandler, passiveCapturingEventOptions);
            element.addEventListener('focus', this._enterHandler, passiveCapturingEventOptions);
            element.addEventListener('mouseleave', this._leaveHandler, passiveCapturingEventOptions);
            element.addEventListener('blur', this._leaveHandler, passiveCapturingEventOptions);
            element.addEventListener('mousedown', this._mousedownHandler, passiveEventOptions);
            element.addEventListener('touchstart', this._mousedownHandler, passiveEventOptions);
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
        element.removeEventListener('touchmove', this._touchmoveHandler, activeCapturingEventOptions);
        element.removeEventListener('mouseenter', this._enterHandler, passiveCapturingEventOptions);
        element.removeEventListener('focus', this._enterHandler, passiveCapturingEventOptions);
        element.removeEventListener('mouseleave', this._leaveHandler, passiveCapturingEventOptions);
        element.removeEventListener('blur', this._leaveHandler, passiveCapturingEventOptions);
        element.removeEventListener('mousedown', this._mousedownHandler, passiveEventOptions);
        element.removeEventListener('touchstart', this._mousedownHandler, passiveEventOptions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci1ib2R5Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUtOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQVdwQzs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUNTLEtBQWEsRUFDYixZQUFvQixFQUNwQixTQUFpQixFQUNqQixPQUFnQixFQUNoQixhQUF3QyxFQUFFLEVBQzFDLGVBQWUsS0FBSyxFQUNwQixRQUFZO1FBTlosVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixlQUFVLEdBQVYsVUFBVSxDQUFnQztRQUMxQyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixhQUFRLEdBQVIsUUFBUSxDQUFJO0lBQ2xCLENBQUM7Q0FDTDtBQVFELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV2Qix5RUFBeUU7QUFDekUsTUFBTSwyQkFBMkIsR0FBRywrQkFBK0IsQ0FBQztJQUNsRSxPQUFPLEVBQUUsS0FBSztJQUNkLE9BQU8sRUFBRSxJQUFJ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O0FBQ25ELFNBQVMsU0FBUyxDQUNoQixLQUFhLEVBQ2IsS0FBb0IsRUFDcEIsR0FBa0IsRUFDbEIsWUFBcUI7SUFFckIsT0FBTyxDQUNMLFlBQVk7UUFDWixLQUFLLEtBQUssSUFBSTtRQUNkLEdBQUcsS0FBSyxJQUFJO1FBQ1osS0FBSyxLQUFLLEdBQUc7UUFDYixLQUFLLElBQUksS0FBSztRQUNkLEtBQUssSUFBSSxHQUFHLENBQ2IsQ0FBQztBQUNKLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLG9CQUFvQixDQUFDLEtBQWlCO0lBQzdDLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsT0FBTyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogRXh0cmEgQ1NTIGNsYXNzZXMgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgY2FsZW5kYXIgY2VsbC4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG5cbi8qKiBGdW5jdGlvbiB0aGF0IGNhbiBnZW5lcmF0ZSB0aGUgZXh0cmEgY2xhc3NlcyB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byBhIGNhbGVuZGFyIGNlbGwuICovXG5leHBvcnQgdHlwZSBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9uPEQ+ID0gKFxuICBkYXRlOiBELFxuICB2aWV3OiAnbW9udGgnIHwgJ3llYXInIHwgJ211bHRpLXllYXInLFxuKSA9PiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzO1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNsYXNzIHRoYXQgcmVwcmVzZW50cyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGEgc2luZ2xlIGNhbGVuZGFyIGNlbGwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckNlbGw8RCA9IGFueT4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlcixcbiAgICBwdWJsaWMgZGlzcGxheVZhbHVlOiBzdHJpbmcsXG4gICAgcHVibGljIGFyaWFMYWJlbDogc3RyaW5nLFxuICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuLFxuICAgIHB1YmxpYyBjc3NDbGFzc2VzOiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzID0ge30sXG4gICAgcHVibGljIGNvbXBhcmVWYWx1ZSA9IHZhbHVlLFxuICAgIHB1YmxpYyByYXdWYWx1ZT86IEQsXG4gICkge31cbn1cblxuLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGRhdGUgaW5zaWRlIHRoZSBjYWxlbmRhciBpcyB0cmlnZ2VyZWQgYXMgYSByZXN1bHQgb2YgYSB1c2VyIGFjdGlvbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RD4ge1xuICB2YWx1ZTogRDtcbiAgZXZlbnQ6IEV2ZW50O1xufVxuXG5sZXQgY2FsZW5kYXJCb2R5SWQgPSAxO1xuXG4vKiogRXZlbnQgb3B0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvIGJpbmQgYW4gYWN0aXZlLCBjYXB0dXJpbmcgZXZlbnQuICovXG5jb25zdCBhY3RpdmVDYXB0dXJpbmdFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtcbiAgcGFzc2l2ZTogZmFsc2UsXG4gIGNhcHR1cmU6IHRydWUsXG59KTtcblxuLyoqIEV2ZW50IG9wdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBiaW5kIGEgcGFzc2l2ZSwgY2FwdHVyaW5nIGV2ZW50LiAqL1xuY29uc3QgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe1xuICBwYXNzaXZlOiB0cnVlLFxuICBjYXB0dXJlOiB0cnVlLFxufSk7XG5cbi8qKiBFdmVudCBvcHRpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gYmluZCBhIHBhc3NpdmUsIG5vbi1jYXB0dXJpbmcgZXZlbnQuICovXG5jb25zdCBwYXNzaXZlRXZlbnRPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgY2FsZW5kYXIgZGF0YSBpbiBhIHRhYmxlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhbGVuZGFyLWJvZHldJyxcbiAgdGVtcGxhdGVVcmw6ICdjYWxlbmRhci1ib2R5Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXItYm9keS5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FsZW5kYXItYm9keScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0Q2FsZW5kYXJCb2R5JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyQm9keTxEID0gYW55PiBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdDaGVja2VkIHtcbiAgcHJpdmF0ZSBfcGxhdGZvcm0gPSBpbmplY3QoUGxhdGZvcm0pO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHNraXAgdGhlIG5leHQgZm9jdXMgZXZlbnQgd2hlbiByZW5kZXJpbmcgdGhlIHByZXZpZXcgcmFuZ2UuXG4gICAqIFdlIG5lZWQgYSBmbGFnIGxpa2UgdGhpcywgYmVjYXVzZSBzb21lIGJyb3dzZXJzIGZpcmUgZm9jdXMgZXZlbnRzIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc2tpcE5leHRGb2N1czogYm9vbGVhbjtcblxuICAvKipcbiAgICogVXNlZCB0byBmb2N1cyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgY2hhbmdlIGRldGVjdGlvbiBoYXMgcnVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSB0YWJsZS4gKGUuZy4gXCJKYW4gMjAxN1wiKS4gKi9cbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlIGNlbGxzIHRvIGRpc3BsYXkgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSByb3dzOiBNYXRDYWxlbmRhckNlbGxbXVtdO1xuXG4gIC8qKiBUaGUgdmFsdWUgaW4gdGhlIHRhYmxlIHRoYXQgY29ycmVzcG9uZHMgdG8gdG9kYXkuICovXG4gIEBJbnB1dCgpIHRvZGF5VmFsdWU6IG51bWJlcjtcblxuICAvKiogU3RhcnQgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuICovXG4gIEBJbnB1dCgpIHN0YXJ0VmFsdWU6IG51bWJlcjtcblxuICAvKiogRW5kIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCBkYXRlIHJhbmdlLiAqL1xuICBASW5wdXQoKSBlbmRWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgbWluaW11bSBudW1iZXIgb2YgZnJlZSBjZWxscyBuZWVkZWQgdG8gZml0IHRoZSBsYWJlbCBpbiB0aGUgZmlyc3Qgcm93LiAqL1xuICBASW5wdXQoKSBsYWJlbE1pblJlcXVpcmVkQ2VsbHM6IG51bWJlcjtcblxuICAvKiogVGhlIG51bWJlciBvZiBjb2x1bW5zIGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgbnVtQ29sczogbnVtYmVyID0gNztcblxuICAvKiogVGhlIGNlbGwgbnVtYmVyIG9mIHRoZSBhY3RpdmUgY2VsbCBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIGFjdGl2ZUNlbGw6IG51bWJlciA9IDA7XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLl9mb2N1c0FjdGl2ZUNlbGxBZnRlclZpZXdDaGVja2VkKSB7XG4gICAgICB0aGlzLl9mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgICAgIHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbEFmdGVyVmlld0NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciBhIHJhbmdlIGlzIGJlaW5nIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKSBpc1JhbmdlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBhc3BlY3QgcmF0aW8gKHdpZHRoIC8gaGVpZ2h0KSB0byB1c2UgZm9yIHRoZSBjZWxscyBpbiB0aGUgdGFibGUuIFRoaXMgYXNwZWN0IHJhdGlvIHdpbGwgYmVcbiAgICogbWFpbnRhaW5lZCBldmVuIGFzIHRoZSB0YWJsZSByZXNpemVzLlxuICAgKi9cbiAgQElucHV0KCkgY2VsbEFzcGVjdFJhdGlvOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvblN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBASW5wdXQoKSBwcmV2aWV3U3RhcnQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIEBJbnB1dCgpIHByZXZpZXdFbmQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBUklBIEFjY2Vzc2libGUgbmFtZSBvZiB0aGUgYDxpbnB1dCBtYXRTdGFydERhdGUvPmAgKi9cbiAgQElucHV0KCkgc3RhcnREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdEVuZERhdGUvPmAgKi9cbiAgQElucHV0KCkgZW5kRGF0ZUFjY2Vzc2libGVOYW1lOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IHZhbHVlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRWYWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8bnVtYmVyPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcHJldmlldyBoYXMgY2hhbmdlZCBhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcHJldmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8TWF0Q2FsZW5kYXJDZWxsIHwgbnVsbD5cbiAgPigpO1xuXG4gIEBPdXRwdXQoKSByZWFkb25seSBhY3RpdmVEYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxudW1iZXI+PigpO1xuXG4gIC8qKiBFbWl0cyB0aGUgZGF0ZSBhdCB0aGUgcG9zc2libGUgc3RhcnQgb2YgYSBkcmFnIGV2ZW50LiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ1N0YXJ0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PEQ+PigpO1xuXG4gIC8qKiBFbWl0cyB0aGUgZGF0ZSBhdCB0aGUgY29uY2x1c2lvbiBvZiBhIGRyYWcsIG9yIG51bGwgaWYgbW91c2Ugd2FzIG5vdCByZWxlYXNlZCBvbiBhIGRhdGUuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnRW5kZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPj4oKTtcblxuICAvKiogVGhlIG51bWJlciBvZiBibGFuayBjZWxscyB0byBwdXQgYXQgdGhlIGJlZ2lubmluZyBmb3IgdGhlIGZpcnN0IHJvdy4gKi9cbiAgX2ZpcnN0Um93T2Zmc2V0OiBudW1iZXI7XG5cbiAgLyoqIFBhZGRpbmcgZm9yIHRoZSBpbmRpdmlkdWFsIGRhdGUgY2VsbHMuICovXG4gIF9jZWxsUGFkZGluZzogc3RyaW5nO1xuXG4gIC8qKiBXaWR0aCBvZiBhbiBpbmRpdmlkdWFsIGNlbGwuICovXG4gIF9jZWxsV2lkdGg6IHN0cmluZztcblxuICBwcml2YXRlIF9kaWREcmFnU2luY2VNb3VzZURvd24gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICBfbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAvLyBgdG91Y2htb3ZlYCBpcyBhY3RpdmUgc2luY2Ugd2UgbmVlZCB0byBjYWxsIGBwcmV2ZW50RGVmYXVsdGAuXG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3RvdWNobW92ZUhhbmRsZXIsIGFjdGl2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyk7XG5cbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX2VudGVySGFuZGxlciwgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fZW50ZXJIYW5kbGVyLCBwYXNzaXZlQ2FwdHVyaW5nRXZlbnRPcHRpb25zKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuX2xlYXZlSGFuZGxlciwgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9sZWF2ZUhhbmRsZXIsIHBhc3NpdmVDYXB0dXJpbmdFdmVudE9wdGlvbnMpO1xuXG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX21vdXNlZG93bkhhbmRsZXIsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fbW91c2Vkb3duSGFuZGxlciwgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG5cbiAgICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9tb3VzZXVwSGFuZGxlcik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3RvdWNoZW5kSGFuZGxlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gYSBjZWxsIGlzIGNsaWNrZWQuICovXG4gIF9jZWxsQ2xpY2tlZChjZWxsOiBNYXRDYWxlbmRhckNlbGwsIGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgLy8gSWdub3JlIFwiY2xpY2tzXCIgdGhhdCBhcmUgYWN0dWFsbHkgY2FuY2VsZWQgZHJhZ3MgKGVnIHRoZSB1c2VyIGRyYWdnZWRcbiAgICAvLyBvZmYgYW5kIHRoZW4gd2VudCBiYWNrIHRvIHRoaXMgY2VsbCB0byB1bmRvKS5cbiAgICBpZiAodGhpcy5fZGlkRHJhZ1NpbmNlTW91c2VEb3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNlbGwuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlQ2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsLnZhbHVlLCBldmVudH0pO1xuICAgIH1cbiAgfVxuXG4gIF9lbWl0QWN0aXZlRGF0ZUNoYW5nZShjZWxsOiBNYXRDYWxlbmRhckNlbGwsIGV2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCB7XG4gICAgaWYgKGNlbGwuZW5hYmxlZCkge1xuICAgICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsLnZhbHVlLCBldmVudH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgYSBjZWxsIHNob3VsZCBiZSBtYXJrZWQgYXMgc2VsZWN0ZWQuICovXG4gIF9pc1NlbGVjdGVkKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFZhbHVlID09PSB2YWx1ZSB8fCB0aGlzLmVuZFZhbHVlID09PSB2YWx1ZTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjb2x1bW5DaGFuZ2VzID0gY2hhbmdlc1snbnVtQ29scyddO1xuICAgIGNvbnN0IHtyb3dzLCBudW1Db2xzfSA9IHRoaXM7XG5cbiAgICBpZiAoY2hhbmdlc1sncm93cyddIHx8IGNvbHVtbkNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2ZpcnN0Um93T2Zmc2V0ID0gcm93cyAmJiByb3dzLmxlbmd0aCAmJiByb3dzWzBdLmxlbmd0aCA/IG51bUNvbHMgLSByb3dzWzBdLmxlbmd0aCA6IDA7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ2NlbGxBc3BlY3RSYXRpbyddIHx8IGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxQYWRkaW5nKSB7XG4gICAgICB0aGlzLl9jZWxsUGFkZGluZyA9IGAkeyg1MCAqIHRoaXMuY2VsbEFzcGVjdFJhdGlvKSAvIG51bUNvbHN9JWA7XG4gICAgfVxuXG4gICAgaWYgKGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxXaWR0aCkge1xuICAgICAgdGhpcy5fY2VsbFdpZHRoID0gYCR7MTAwIC8gbnVtQ29sc30lYDtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaG1vdmVIYW5kbGVyLCBhY3RpdmVDYXB0dXJpbmdFdmVudE9wdGlvbnMpO1xuXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fZW50ZXJIYW5kbGVyLCBwYXNzaXZlQ2FwdHVyaW5nRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fZW50ZXJIYW5kbGVyLCBwYXNzaXZlQ2FwdHVyaW5nRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLl9sZWF2ZUhhbmRsZXIsIHBhc3NpdmVDYXB0dXJpbmdFdmVudE9wdGlvbnMpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX2xlYXZlSGFuZGxlciwgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyk7XG5cbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX21vdXNlZG93bkhhbmRsZXIsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX21vdXNlZG93bkhhbmRsZXIsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9tb3VzZXVwSGFuZGxlcik7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl90b3VjaGVuZEhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgYSBjZWxsIGlzIGFjdGl2ZS4gKi9cbiAgX2lzQWN0aXZlQ2VsbChyb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgbGV0IGNlbGxOdW1iZXIgPSByb3dJbmRleCAqIHRoaXMubnVtQ29scyArIGNvbEluZGV4O1xuXG4gICAgLy8gQWNjb3VudCBmb3IgdGhlIGZhY3QgdGhhdCB0aGUgZmlyc3Qgcm93IG1heSBub3QgaGF2ZSBhcyBtYW55IGNlbGxzLlxuICAgIGlmIChyb3dJbmRleCkge1xuICAgICAgY2VsbE51bWJlciAtPSB0aGlzLl9maXJzdFJvd09mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2VsbE51bWJlciA9PSB0aGlzLmFjdGl2ZUNlbGw7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS5cbiAgICpcbiAgICogQWRkaW5nIGEgMG1zIHNldFRpbWVvdXQgc2VlbXMgdG8gZml4IFZvaWNlb3ZlciBsb3NpbmcgZm9jdXMgd2hlbiBwcmVzc2luZyBQYWdlVXAvUGFnZURvd25cbiAgICogKGlzc3VlICMyNDMzMCkuXG4gICAqXG4gICAqIERldGVybWluZWQgYSAwbXMgYnkgZ3JhZHVhbGx5IGluY3JlYXNpbmcgZHVyYXRpb24gZnJvbSAwIGFuZCB0ZXN0aW5nIHR3byB1c2UgY2FzZXMgd2l0aCBzY3JlZW5cbiAgICogcmVhZGVyIGVuYWJsZWQ6XG4gICAqXG4gICAqIDEuIFByZXNzaW5nIFBhZ2VVcC9QYWdlRG93biByZXBlYXRlZGx5IHdpdGggcGF1c2luZyBiZXR3ZWVuIGVhY2gga2V5IHByZXNzLlxuICAgKiAyLiBQcmVzc2luZyBhbmQgaG9sZGluZyB0aGUgUGFnZURvd24ga2V5IHdpdGggcmVwZWF0ZWQga2V5cyBlbmFibGVkLlxuICAgKlxuICAgKiBUZXN0IDEgd29ya2VkIHJvdWdobHkgOTUtOTklIG9mIHRoZSB0aW1lIHdpdGggMG1zIGFuZCBnb3QgYSBsaXR0bGUgYml0IGJldHRlciBhcyB0aGUgZHVyYXRpb25cbiAgICogaW5jcmVhc2VkLiBUZXN0IDIgZ290IHNsaWdodGx5IGJldHRlciB1bnRpbCB0aGUgZHVyYXRpb24gd2FzIGxvbmcgZW5vdWdoIHRvIGludGVyZmVyZSB3aXRoXG4gICAqIHJlcGVhdGVkIGtleXMuIElmIHRoZSByZXBlYXRlZCBrZXkgc3BlZWQgd2FzIGZhc3RlciB0aGFuIHRoZSB0aW1lb3V0IGR1cmF0aW9uLCB0aGVuIHByZXNzaW5nXG4gICAqIGFuZCBob2xkaW5nIHBhZ2Vkb3duIGNhdXNlZCB0aGUgZW50aXJlIHBhZ2UgdG8gc2Nyb2xsLlxuICAgKlxuICAgKiBTaW5jZSByZXBlYXRlZCBrZXkgc3BlZWQgY2FuIHZlcmlmeSBhY3Jvc3MgbWFjaGluZXMsIGRldGVybWluZWQgdGhhdCBhbnkgZHVyYXRpb24gY291bGRcbiAgICogcG90ZW50aWFsbHkgaW50ZXJmZXJlIHdpdGggcmVwZWF0ZWQga2V5cy4gMG1zIHdvdWxkIGJlIGJlc3QgYmVjYXVzZSBpdCBhbG1vc3QgZW50aXJlbHlcbiAgICogZWxpbWluYXRlcyB0aGUgZm9jdXMgYmVpbmcgbG9zdCBpbiBWb2ljZW92ZXIgKCMyNDMzMCkgd2l0aG91dCBjYXVzaW5nIHVuaW50ZW5kZWQgc2lkZSBlZmZlY3RzLlxuICAgKiBBZGRpbmcgZGVsYXkgYWxzbyBjb21wbGljYXRlcyB3cml0aW5nIHRlc3RzLlxuICAgKi9cbiAgX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldyA9IHRydWUpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnLm1hdC1jYWxlbmRhci1ib2R5LWFjdGl2ZScsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChhY3RpdmVDZWxsKSB7XG4gICAgICAgICAgICBpZiAoIW1vdmVQcmV2aWV3KSB7XG4gICAgICAgICAgICAgIHRoaXMuX3NraXBOZXh0Rm9jdXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVDZWxsLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGFjdGl2ZSBjZWxsIGFmdGVyIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHJ1biBhbmQgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgX3NjaGVkdWxlRm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl9mb2N1c0FjdGl2ZUNlbGxBZnRlclZpZXdDaGVja2VkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgc3RhcnQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIF9pc1JhbmdlU3RhcnQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc1N0YXJ0KHZhbHVlLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuZW5kVmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIF9pc1JhbmdlRW5kKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNFbmQodmFsdWUsIHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy5lbmRWYWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgd2l0aGluIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgcmFuZ2UuICovXG4gIF9pc0luUmFuZ2UodmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0luUmFuZ2UodmFsdWUsIHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy5lbmRWYWx1ZSwgdGhpcy5pc1JhbmdlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgc3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIF9pc0NvbXBhcmlzb25TdGFydCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzU3RhcnQodmFsdWUsIHRoaXMuY29tcGFyaXNvblN0YXJ0LCB0aGlzLmNvbXBhcmlzb25FbmQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgYSBzdGFydCBicmlkZ2UgY2VsbCBiZXR3ZWVuIHRoZSBtYWluIGFuZCBjb21wYXJpc29uIHJhbmdlcy4gKi9cbiAgX2lzQ29tcGFyaXNvbkJyaWRnZVN0YXJ0KHZhbHVlOiBudW1iZXIsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29tcGFyaXNvblN0YXJ0KHZhbHVlKSB8fCB0aGlzLl9pc1JhbmdlU3RhcnQodmFsdWUpIHx8ICF0aGlzLl9pc0luUmFuZ2UodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHByZXZpb3VzQ2VsbDogTWF0Q2FsZW5kYXJDZWxsIHwgdW5kZWZpbmVkID0gdGhpcy5yb3dzW3Jvd0luZGV4XVtjb2xJbmRleCAtIDFdO1xuXG4gICAgaWYgKCFwcmV2aW91c0NlbGwpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzUm93ID0gdGhpcy5yb3dzW3Jvd0luZGV4IC0gMV07XG4gICAgICBwcmV2aW91c0NlbGwgPSBwcmV2aW91c1JvdyAmJiBwcmV2aW91c1Jvd1twcmV2aW91c1Jvdy5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJldmlvdXNDZWxsICYmICF0aGlzLl9pc1JhbmdlRW5kKHByZXZpb3VzQ2VsbC5jb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgYW4gZW5kIGJyaWRnZSBjZWxsIGJldHdlZW4gdGhlIG1haW4gYW5kIGNvbXBhcmlzb24gcmFuZ2VzLiAqL1xuICBfaXNDb21wYXJpc29uQnJpZGdlRW5kKHZhbHVlOiBudW1iZXIsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29tcGFyaXNvbkVuZCh2YWx1ZSkgfHwgdGhpcy5faXNSYW5nZUVuZCh2YWx1ZSkgfHwgIXRoaXMuX2lzSW5SYW5nZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgbmV4dENlbGw6IE1hdENhbGVuZGFyQ2VsbCB8IHVuZGVmaW5lZCA9IHRoaXMucm93c1tyb3dJbmRleF1bY29sSW5kZXggKyAxXTtcblxuICAgIGlmICghbmV4dENlbGwpIHtcbiAgICAgIGNvbnN0IG5leHRSb3cgPSB0aGlzLnJvd3Nbcm93SW5kZXggKyAxXTtcbiAgICAgIG5leHRDZWxsID0gbmV4dFJvdyAmJiBuZXh0Um93WzBdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0Q2VsbCAmJiAhdGhpcy5faXNSYW5nZVN0YXJ0KG5leHRDZWxsLmNvbXBhcmVWYWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgX2lzQ29tcGFyaXNvbkVuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzRW5kKHZhbHVlLCB0aGlzLmNvbXBhcmlzb25TdGFydCwgdGhpcy5jb21wYXJpc29uRW5kKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB3aXRoaW4gdGhlIGN1cnJlbnQgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgX2lzSW5Db21wYXJpc29uUmFuZ2UodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0luUmFuZ2UodmFsdWUsIHRoaXMuY29tcGFyaXNvblN0YXJ0LCB0aGlzLmNvbXBhcmlzb25FbmQsIHRoaXMuaXNSYW5nZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHNhbWUgYXMgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuXG4gICAqIEZvciBjb250ZXh0LCB0aGUgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIHRvIGRldGVybWluZSB3aGV0aGVyIHNvbWV0aGluZyBpcyB0aGUgc3RhcnQvZW5kIG9mXG4gICAqIGEgcmFuZ2UgZG9uJ3QgYWxsb3cgZm9yIHRoZSBzdGFydCBhbmQgZW5kIHRvIGJlIG9uIHRoZSBzYW1lIGRheSwgYmVjYXVzZSB3ZSdkIGhhdmUgdG8gdXNlXG4gICAqIG11Y2ggbW9yZSBzcGVjaWZpYyBDU1Mgc2VsZWN0b3JzIHRvIHN0eWxlIHRoZW0gY29ycmVjdGx5IGluIGFsbCBzY2VuYXJpb3MuIFRoaXMgaXMgZmluZSBmb3JcbiAgICogdGhlIHJlZ3VsYXIgcmFuZ2UsIGJlY2F1c2Ugd2hlbiBpdCBoYXBwZW5zLCB0aGUgc2VsZWN0ZWQgc3R5bGVzIHRha2Ugb3ZlciBhbmQgc3RpbGwgc2hvdyB3aGVyZVxuICAgKiB0aGUgcmFuZ2Ugd291bGQndmUgYmVlbiwgaG93ZXZlciB3ZSBkb24ndCBoYXZlIHRoZXNlIHNlbGVjdGVkIHN0eWxlcyBmb3IgYSBjb21wYXJpc29uIHJhbmdlLlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXBwbHkgYSBjbGFzcyB0aGF0IHNlcnZlcyB0aGUgc2FtZSBwdXJwb3NlIGFzIHRoZSBvbmUgZm9yIHNlbGVjdGVkXG4gICAqIGRhdGVzLCBidXQgaXQgb25seSBhcHBsaWVzIGluIHRoZSBjb250ZXh0IG9mIGEgY29tcGFyaXNvbiByYW5nZS5cbiAgICovXG4gIF9pc0NvbXBhcmlzb25JZGVudGljYWwodmFsdWU6IG51bWJlcikge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBuZWVkIHRvIG51bGwgY2hlY2sgdGhlIHN0YXJ0L2VuZFxuICAgIC8vIGhlcmUsIGJlY2F1c2UgdGhlIGB2YWx1ZWAgd2lsbCBhbHdheXMgYmUgZGVmaW5lZC5cbiAgICByZXR1cm4gdGhpcy5jb21wYXJpc29uU3RhcnQgPT09IHRoaXMuY29tcGFyaXNvbkVuZCAmJiB2YWx1ZSA9PT0gdGhpcy5jb21wYXJpc29uU3RhcnQ7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfaXNQcmV2aWV3U3RhcnQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc1N0YXJ0KHZhbHVlLCB0aGlzLnByZXZpZXdTdGFydCwgdGhpcy5wcmV2aWV3RW5kKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgZW5kIG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfaXNQcmV2aWV3RW5kKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNFbmQodmFsdWUsIHRoaXMucHJldmlld1N0YXJ0LCB0aGlzLnByZXZpZXdFbmQpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIGluc2lkZSB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX2lzSW5QcmV2aWV3KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNJblJhbmdlKHZhbHVlLCB0aGlzLnByZXZpZXdTdGFydCwgdGhpcy5wcmV2aWV3RW5kLCB0aGlzLmlzUmFuZ2UpO1xuICB9XG5cbiAgLyoqIEdldHMgaWRzIG9mIGFyaWEgZGVzY3JpcHRpb25zIGZvciB0aGUgc3RhcnQgYW5kIGVuZCBvZiBhIGRhdGUgcmFuZ2UuICovXG4gIF9nZXREZXNjcmliZWRieSh2YWx1ZTogbnVtYmVyKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXJ0VmFsdWUgPT09IHZhbHVlICYmIHRoaXMuZW5kVmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5fc3RhcnREYXRlTGFiZWxJZH0gJHt0aGlzLl9lbmREYXRlTGFiZWxJZH1gO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydFZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0RGF0ZUxhYmVsSWQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZFZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2VuZERhdGVMYWJlbElkO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB1c2VyIGVudGVycyBhbiBlbGVtZW50XG4gICAqIGluc2lkZSB0aGUgY2FsZW5kYXIgYm9keSAoZS5nLiBieSBob3ZlcmluZyBpbiBvciBmb2N1cykuXG4gICAqL1xuICBwcml2YXRlIF9lbnRlckhhbmRsZXIgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX3NraXBOZXh0Rm9jdXMgJiYgZXZlbnQudHlwZSA9PT0gJ2ZvY3VzJykge1xuICAgICAgdGhpcy5fc2tpcE5leHRGb2N1cyA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIG9ubHkgbmVlZCB0byBoaXQgdGhlIHpvbmUgd2hlbiB3ZSdyZSBzZWxlY3RpbmcgYSByYW5nZS5cbiAgICBpZiAoZXZlbnQudGFyZ2V0ICYmIHRoaXMuaXNSYW5nZSkge1xuICAgICAgY29uc3QgY2VsbCA9IHRoaXMuX2dldENlbGxGcm9tRWxlbWVudChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuXG4gICAgICBpZiAoY2VsbCkge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMucHJldmlld0NoYW5nZS5lbWl0KHt2YWx1ZTogY2VsbC5lbmFibGVkID8gY2VsbCA6IG51bGwsIGV2ZW50fSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIF90b3VjaG1vdmVIYW5kbGVyID0gKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLmlzUmFuZ2UpIHJldHVybjtcblxuICAgIGNvbnN0IHRhcmdldCA9IGdldEFjdHVhbFRvdWNoVGFyZ2V0KGV2ZW50KTtcbiAgICBjb25zdCBjZWxsID0gdGFyZ2V0ID8gdGhpcy5fZ2V0Q2VsbEZyb21FbGVtZW50KHRhcmdldCBhcyBIVE1MRWxlbWVudCkgOiBudWxsO1xuXG4gICAgaWYgKHRhcmdldCAhPT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICB0aGlzLl9kaWREcmFnU2luY2VNb3VzZURvd24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBpbml0aWFsIHRhcmdldCBvZiB0aGUgdG91Y2ggaXMgYSBkYXRlIGNlbGwsIHByZXZlbnQgZGVmYXVsdCBzb1xuICAgIC8vIHRoYXQgdGhlIG1vdmUgaXMgbm90IGhhbmRsZWQgYXMgYSBzY3JvbGwuXG4gICAgaWYgKGdldENlbGxFbGVtZW50KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7dmFsdWU6IGNlbGw/LmVuYWJsZWQgPyBjZWxsIDogbnVsbCwgZXZlbnR9KSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIHVzZXIncyBwb2ludGVyIGxlYXZlcyBhbiBlbGVtZW50XG4gICAqIGluc2lkZSB0aGUgY2FsZW5kYXIgYm9keSAoZS5nLiBieSBob3ZlcmluZyBvdXQgb3IgYmx1cnJpbmcpLlxuICAgKi9cbiAgcHJpdmF0ZSBfbGVhdmVIYW5kbGVyID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIC8vIFdlIG9ubHkgbmVlZCB0byBoaXQgdGhlIHpvbmUgd2hlbiB3ZSdyZSBzZWxlY3RpbmcgYSByYW5nZS5cbiAgICBpZiAodGhpcy5wcmV2aWV3RW5kICE9PSBudWxsICYmIHRoaXMuaXNSYW5nZSkge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgIT09ICdibHVyJykge1xuICAgICAgICB0aGlzLl9kaWREcmFnU2luY2VNb3VzZURvd24gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IHJlc2V0IHRoZSBwcmV2aWV3IGVuZCB2YWx1ZSB3aGVuIGxlYXZpbmcgY2VsbHMuIFRoaXMgbG9va3MgYmV0dGVyLCBiZWNhdXNlXG4gICAgICAvLyB3ZSBoYXZlIGEgZ2FwIGJldHdlZW4gdGhlIGNlbGxzIGFuZCB0aGUgcm93cyBhbmQgd2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlXG4gICAgICAvLyByYW5nZSBqdXN0IGZvciBpdCB0byBzaG93IHVwIGFnYWluIHdoZW4gdGhlIHVzZXIgbW92ZXMgYSBmZXcgcGl4ZWxzIHRvIHRoZSBzaWRlLlxuICAgICAgaWYgKFxuICAgICAgICBldmVudC50YXJnZXQgJiZcbiAgICAgICAgdGhpcy5fZ2V0Q2VsbEZyb21FbGVtZW50KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkgJiZcbiAgICAgICAgIShcbiAgICAgICAgICAoZXZlbnQgYXMgTW91c2VFdmVudCkucmVsYXRlZFRhcmdldCAmJlxuICAgICAgICAgIHRoaXMuX2dldENlbGxGcm9tRWxlbWVudCgoZXZlbnQgYXMgTW91c2VFdmVudCkucmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudClcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe3ZhbHVlOiBudWxsLCBldmVudH0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJlZCBvbiBtb3VzZWRvd24gb3IgdG91Y2hzdGFydCBvbiBhIGRhdGUgY2VsbC5cbiAgICogUmVzcHNvbnNpYmxlIGZvciBzdGFydGluZyBhIGRyYWcgc2VxdWVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9tb3VzZWRvd25IYW5kbGVyID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5pc1JhbmdlKSByZXR1cm47XG5cbiAgICB0aGlzLl9kaWREcmFnU2luY2VNb3VzZURvd24gPSBmYWxzZTtcbiAgICAvLyBCZWdpbiBhIGRyYWcgaWYgYSBjZWxsIHdpdGhpbiB0aGUgY3VycmVudCByYW5nZSB3YXMgdGFyZ2V0ZWQuXG4gICAgY29uc3QgY2VsbCA9IGV2ZW50LnRhcmdldCAmJiB0aGlzLl9nZXRDZWxsRnJvbUVsZW1lbnQoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcbiAgICBpZiAoIWNlbGwgfHwgIXRoaXMuX2lzSW5SYW5nZShjZWxsLnJhd1ZhbHVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5kcmFnU3RhcnRlZC5lbWl0KHtcbiAgICAgICAgdmFsdWU6IGNlbGwucmF3VmFsdWUsXG4gICAgICAgIGV2ZW50LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqIFRyaWdnZXJlZCBvbiBtb3VzZXVwIGFueXdoZXJlLiBSZXNwc29uc2libGUgZm9yIGVuZGluZyBhIGRyYWcgc2VxdWVuY2UuICovXG4gIHByaXZhdGUgX21vdXNldXBIYW5kbGVyID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5pc1JhbmdlKSByZXR1cm47XG5cbiAgICBjb25zdCBjZWxsRWxlbWVudCA9IGdldENlbGxFbGVtZW50KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7XG4gICAgaWYgKCFjZWxsRWxlbWVudCkge1xuICAgICAgLy8gTW91c2V1cCBoYXBwZW5lZCBvdXRzaWRlIG9mIGRhdGVwaWNrZXIuIENhbmNlbCBkcmFnLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuZHJhZ0VuZGVkLmVtaXQoe3ZhbHVlOiBudWxsLCBldmVudH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNlbGxFbGVtZW50LmNsb3Nlc3QoJy5tYXQtY2FsZW5kYXItYm9keScpICE9PSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIC8vIE1vdXNldXAgaGFwcGVuZWQgaW5zaWRlIGEgZGlmZmVyZW50IG1vbnRoIGluc3RhbmNlLlxuICAgICAgLy8gQWxsb3cgaXQgdG8gaGFuZGxlIHRoZSBldmVudC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLl9nZXRDZWxsRnJvbUVsZW1lbnQoY2VsbEVsZW1lbnQpO1xuICAgICAgdGhpcy5kcmFnRW5kZWQuZW1pdCh7dmFsdWU6IGNlbGw/LnJhd1ZhbHVlID8/IG51bGwsIGV2ZW50fSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqIFRyaWdnZXJlZCBvbiB0b3VjaGVuZCBhbnl3aGVyZS4gUmVzcHNvbnNpYmxlIGZvciBlbmRpbmcgYSBkcmFnIHNlcXVlbmNlLiAqL1xuICBwcml2YXRlIF90b3VjaGVuZEhhbmRsZXIgPSAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBnZXRBY3R1YWxUb3VjaFRhcmdldChldmVudCk7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0aGlzLl9tb3VzZXVwSGFuZGxlcih7dGFyZ2V0fSBhcyB1bmtub3duIGFzIEV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqIEZpbmRzIHRoZSBNYXRDYWxlbmRhckNlbGwgdGhhdCBjb3JyZXNwb25kcyB0byBhIERPTSBub2RlLiAqL1xuICBwcml2YXRlIF9nZXRDZWxsRnJvbUVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBNYXRDYWxlbmRhckNlbGwgfCBudWxsIHtcbiAgICBjb25zdCBjZWxsID0gZ2V0Q2VsbEVsZW1lbnQoZWxlbWVudCk7XG5cbiAgICBpZiAoY2VsbCkge1xuICAgICAgY29uc3Qgcm93ID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LXJvdycpO1xuICAgICAgY29uc3QgY29sID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWNvbCcpO1xuXG4gICAgICBpZiAocm93ICYmIGNvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzW3BhcnNlSW50KHJvdyldW3BhcnNlSW50KGNvbCldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfaWQgPSBgbWF0LWNhbGVuZGFyLWJvZHktJHtjYWxlbmRhckJvZHlJZCsrfWA7XG5cbiAgX3N0YXJ0RGF0ZUxhYmVsSWQgPSBgJHt0aGlzLl9pZH0tc3RhcnQtZGF0ZWA7XG5cbiAgX2VuZERhdGVMYWJlbElkID0gYCR7dGhpcy5faWR9LWVuZC1kYXRlYDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgbm9kZSBpcyBhIHRhYmxlIGNlbGwgZWxlbWVudC4gKi9cbmZ1bmN0aW9uIGlzVGFibGVDZWxsKG5vZGU6IE5vZGUgfCB1bmRlZmluZWQgfCBudWxsKTogbm9kZSBpcyBIVE1MVGFibGVDZWxsRWxlbWVudCB7XG4gIHJldHVybiBub2RlPy5ub2RlTmFtZSA9PT0gJ1REJztcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRlIHRhYmxlIGNlbGwgZWxlbWVudCB0aGF0IGlzIG9yIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAqIE9yIHJldHVybnMgbnVsbCBpZiBlbGVtZW50IGlzIG5vdCBwYXJ0IG9mIGEgZGF0ZSBjZWxsLlxuICovXG5mdW5jdGlvbiBnZXRDZWxsRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XG4gIGxldCBjZWxsOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgaWYgKGlzVGFibGVDZWxsKGVsZW1lbnQpKSB7XG4gICAgY2VsbCA9IGVsZW1lbnQ7XG4gIH0gZWxzZSBpZiAoaXNUYWJsZUNlbGwoZWxlbWVudC5wYXJlbnROb2RlKSkge1xuICAgIGNlbGwgPSBlbGVtZW50LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gIH0gZWxzZSBpZiAoaXNUYWJsZUNlbGwoZWxlbWVudC5wYXJlbnROb2RlPy5wYXJlbnROb2RlKSkge1xuICAgIGNlbGwgPSBlbGVtZW50LnBhcmVudE5vZGUhLnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gY2VsbD8uZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1yb3cnKSAhPSBudWxsID8gY2VsbCA6IG51bGw7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBzdGFydCBvZiBhIHJhbmdlLiAqL1xuZnVuY3Rpb24gaXNTdGFydCh2YWx1ZTogbnVtYmVyLCBzdGFydDogbnVtYmVyIHwgbnVsbCwgZW5kOiBudW1iZXIgfCBudWxsKTogYm9vbGVhbiB7XG4gIHJldHVybiBlbmQgIT09IG51bGwgJiYgc3RhcnQgIT09IGVuZCAmJiB2YWx1ZSA8IGVuZCAmJiB2YWx1ZSA9PT0gc3RhcnQ7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgYSByYW5nZS4gKi9cbmZ1bmN0aW9uIGlzRW5kKHZhbHVlOiBudW1iZXIsIHN0YXJ0OiBudW1iZXIgfCBudWxsLCBlbmQ6IG51bWJlciB8IG51bGwpOiBib29sZWFuIHtcbiAgcmV0dXJuIHN0YXJ0ICE9PSBudWxsICYmIHN0YXJ0ICE9PSBlbmQgJiYgdmFsdWUgPj0gc3RhcnQgJiYgdmFsdWUgPT09IGVuZDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgaW5zaWRlIG9mIGEgcmFuZ2UuICovXG5mdW5jdGlvbiBpc0luUmFuZ2UoXG4gIHZhbHVlOiBudW1iZXIsXG4gIHN0YXJ0OiBudW1iZXIgfCBudWxsLFxuICBlbmQ6IG51bWJlciB8IG51bGwsXG4gIHJhbmdlRW5hYmxlZDogYm9vbGVhbixcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIHJhbmdlRW5hYmxlZCAmJlxuICAgIHN0YXJ0ICE9PSBudWxsICYmXG4gICAgZW5kICE9PSBudWxsICYmXG4gICAgc3RhcnQgIT09IGVuZCAmJlxuICAgIHZhbHVlID49IHN0YXJ0ICYmXG4gICAgdmFsdWUgPD0gZW5kXG4gICk7XG59XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGVsZW1lbnQgdGhhdCBhY3R1YWxseSBjb3JyZXNwb25kcyB0byBhIHRvdWNoIGV2ZW50J3MgbG9jYXRpb25cbiAqIChyYXRoZXIgdGhhbiB0aGUgZWxlbWVudCB0aGF0IGluaXRpYXRlZCB0aGUgc2VxdWVuY2Ugb2YgdG91Y2ggZXZlbnRzKS5cbiAqL1xuZnVuY3Rpb24gZ2V0QWN0dWFsVG91Y2hUYXJnZXQoZXZlbnQ6IFRvdWNoRXZlbnQpOiBFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHRvdWNoTG9jYXRpb24gPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgcmV0dXJuIGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2hMb2NhdGlvbi5jbGllbnRYLCB0b3VjaExvY2F0aW9uLmNsaWVudFkpO1xufVxuIiwiPCEtLVxuICBJZiB0aGVyZSdzIG5vdCBlbm91Z2ggc3BhY2UgaW4gdGhlIGZpcnN0IHJvdywgY3JlYXRlIGEgc2VwYXJhdGUgbGFiZWwgcm93LiBXZSBtYXJrIHRoaXMgcm93IGFzXG4gIGFyaWEtaGlkZGVuIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBpdCB0byBiZSByZWFkIG91dCBhcyBvbmUgb2YgdGhlIHdlZWtzIGluIHRoZSBtb250aC5cbi0tPlxuPHRyICpuZ0lmPVwiX2ZpcnN0Um93T2Zmc2V0IDwgbGFiZWxNaW5SZXF1aXJlZENlbGxzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gIDx0ZCBjbGFzcz1cIm1hdC1jYWxlbmRhci1ib2R5LWxhYmVsXCJcbiAgICAgIFthdHRyLmNvbHNwYW5dPVwibnVtQ29sc1wiXG4gICAgICBbc3R5bGUucGFkZGluZ1RvcF09XCJfY2VsbFBhZGRpbmdcIlxuICAgICAgW3N0eWxlLnBhZGRpbmdCb3R0b21dPVwiX2NlbGxQYWRkaW5nXCI+XG4gICAge3tsYWJlbH19XG4gIDwvdGQ+XG48L3RyPlxuXG48IS0tIENyZWF0ZSB0aGUgZmlyc3Qgcm93IHNlcGFyYXRlbHkgc28gd2UgY2FuIGluY2x1ZGUgYSBzcGVjaWFsIHNwYWNlciBjZWxsLiAtLT5cbjx0ciAqbmdGb3I9XCJsZXQgcm93IG9mIHJvd3M7IGxldCByb3dJbmRleCA9IGluZGV4XCIgcm9sZT1cInJvd1wiPlxuICA8IS0tXG4gICAgVGhpcyBjZWxsIGlzIHB1cmVseSBkZWNvcmF0aXZlLCBidXQgd2UgY2FuJ3QgcHV0IGBhcmlhLWhpZGRlbmAgb3IgYHJvbGU9XCJwcmVzZW50YXRpb25cImAgb24gaXQsXG4gICAgYmVjYXVzZSBpdCB0aHJvd3Mgb2ZmIHRoZSB3ZWVrIGRheXMgZm9yIHRoZSByZXN0IG9mIHRoZSByb3cgb24gTlZEQS4gVGhlIGFzcGVjdCByYXRpbyBvZiB0aGVcbiAgICB0YWJsZSBjZWxscyBpcyBtYWludGFpbmVkIGJ5IHNldHRpbmcgdGhlIHRvcCBhbmQgYm90dG9tIHBhZGRpbmcgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aWR0aFxuICAgIChhIHZhcmlhbnQgb2YgdGhlIHRyaWNrIGRlc2NyaWJlZCBoZXJlOiBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL2hvd3RvL2hvd3RvX2Nzc19hc3BlY3RfcmF0aW8uYXNwKS5cbiAgLS0+XG4gIDx0ZCAqbmdJZj1cInJvd0luZGV4ID09PSAwICYmIF9maXJzdFJvd09mZnNldFwiXG4gICAgICBjbGFzcz1cIm1hdC1jYWxlbmRhci1ib2R5LWxhYmVsXCJcbiAgICAgIFthdHRyLmNvbHNwYW5dPVwiX2ZpcnN0Um93T2Zmc2V0XCJcbiAgICAgIFtzdHlsZS5wYWRkaW5nVG9wXT1cIl9jZWxsUGFkZGluZ1wiXG4gICAgICBbc3R5bGUucGFkZGluZ0JvdHRvbV09XCJfY2VsbFBhZGRpbmdcIj5cbiAgICB7e19maXJzdFJvd09mZnNldCA+PSBsYWJlbE1pblJlcXVpcmVkQ2VsbHMgPyBsYWJlbCA6ICcnfX1cbiAgPC90ZD5cbiAgPCEtLVxuICAgIEVhY2ggZ3JpZGNlbGwgaW4gdGhlIGNhbGVuZGFyIGNvbnRhaW5zIGEgYnV0dG9uLCB3aGljaCBzaWduYWxzIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHRoYXQgdGhlXG4gICAgY2VsbCBpcyBpbnRlcmFjdGFibGUsIGFzIHdlbGwgYXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSB2aWEgYGFyaWEtcHJlc3NlZGAuIFNlZSAjMjM0NzYgZm9yXG4gICAgYmFja2dyb3VuZC5cbiAgLS0+XG4gIDx0ZFxuICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIHJvdzsgbGV0IGNvbEluZGV4ID0gaW5kZXhcIlxuICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1jZWxsLWNvbnRhaW5lclwiXG4gICAgW3N0eWxlLndpZHRoXT1cIl9jZWxsV2lkdGhcIlxuICAgIFtzdHlsZS5wYWRkaW5nVG9wXT1cIl9jZWxsUGFkZGluZ1wiXG4gICAgW3N0eWxlLnBhZGRpbmdCb3R0b21dPVwiX2NlbGxQYWRkaW5nXCJcbiAgICBbYXR0ci5kYXRhLW1hdC1yb3ddPVwicm93SW5kZXhcIlxuICAgIFthdHRyLmRhdGEtbWF0LWNvbF09XCJjb2xJbmRleFwiXG4gID5cbiAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzcz1cIm1hdC1jYWxlbmRhci1ib2R5LWNlbGxcIlxuICAgICAgICBbbmdDbGFzc109XCJpdGVtLmNzc0NsYXNzZXNcIlxuICAgICAgICBbdGFiaW5kZXhdPVwiX2lzQWN0aXZlQ2VsbChyb3dJbmRleCwgY29sSW5kZXgpID8gMCA6IC0xXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWRcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktYWN0aXZlXT1cIl9pc0FjdGl2ZUNlbGwocm93SW5kZXgsIGNvbEluZGV4KVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1yYW5nZS1zdGFydF09XCJfaXNSYW5nZVN0YXJ0KGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1yYW5nZS1lbmRdPVwiX2lzUmFuZ2VFbmQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWluLXJhbmdlXT1cIl9pc0luUmFuZ2UoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWNvbXBhcmlzb24tYnJpZGdlLXN0YXJ0XT1cIl9pc0NvbXBhcmlzb25CcmlkZ2VTdGFydChpdGVtLmNvbXBhcmVWYWx1ZSwgcm93SW5kZXgsIGNvbEluZGV4KVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1jb21wYXJpc29uLWJyaWRnZS1lbmRdPVwiX2lzQ29tcGFyaXNvbkJyaWRnZUVuZChpdGVtLmNvbXBhcmVWYWx1ZSwgcm93SW5kZXgsIGNvbEluZGV4KVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1jb21wYXJpc29uLXN0YXJ0XT1cIl9pc0NvbXBhcmlzb25TdGFydChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktY29tcGFyaXNvbi1lbmRdPVwiX2lzQ29tcGFyaXNvbkVuZChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktaW4tY29tcGFyaXNvbi1yYW5nZV09XCJfaXNJbkNvbXBhcmlzb25SYW5nZShpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktcHJldmlldy1zdGFydF09XCJfaXNQcmV2aWV3U3RhcnQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LXByZXZpZXctZW5kXT1cIl9pc1ByZXZpZXdFbmQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWluLXByZXZpZXddPVwiX2lzSW5QcmV2aWV3KGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiaXRlbS5hcmlhTGFiZWxcIlxuICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWQgfHwgbnVsbFwiXG4gICAgICAgIFthdHRyLmFyaWEtcHJlc3NlZF09XCJfaXNTZWxlY3RlZChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbYXR0ci5hcmlhLWN1cnJlbnRdPVwidG9kYXlWYWx1ZSA9PT0gaXRlbS5jb21wYXJlVmFsdWUgPyAnZGF0ZScgOiBudWxsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJfZ2V0RGVzY3JpYmVkYnkoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgKGNsaWNrKT1cIl9jZWxsQ2xpY2tlZChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgKGZvY3VzKT1cIl9lbWl0QWN0aXZlRGF0ZUNoYW5nZShpdGVtLCAkZXZlbnQpXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktY2VsbC1jb250ZW50IG1hdC1mb2N1cy1pbmRpY2F0b3JcIlxuICAgICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1zZWxlY3RlZF09XCJfaXNTZWxlY3RlZChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1jb21wYXJpc29uLWlkZW50aWNhbF09XCJfaXNDb21wYXJpc29uSWRlbnRpY2FsKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LXRvZGF5XT1cInRvZGF5VmFsdWUgPT09IGl0ZW0uY29tcGFyZVZhbHVlXCI+XG4gICAgICAgICAge3tpdGVtLmRpc3BsYXlWYWx1ZX19XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1jZWxsLXByZXZpZXdcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIDwvdGQ+XG48L3RyPlxuXG48bGFiZWwgW2lkXT1cIl9zdGFydERhdGVMYWJlbElkXCIgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1oaWRkZW4tbGFiZWxcIj5cbiAge3tzdGFydERhdGVBY2Nlc3NpYmxlTmFtZX19XG48L2xhYmVsPlxuPGxhYmVsIFtpZF09XCJfZW5kRGF0ZUxhYmVsSWRcIiBjbGFzcz1cIm1hdC1jYWxlbmRhci1ib2R5LWhpZGRlbi1sYWJlbFwiPlxuICB7e2VuZERhdGVBY2Nlc3NpYmxlTmFtZX19XG48L2xhYmVsPlxuIl19