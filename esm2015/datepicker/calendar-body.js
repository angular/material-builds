/**
 * @fileoverview added by tsickle
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
 */
export class MatCalendarCell {
    /**
     * @param {?} value
     * @param {?} displayValue
     * @param {?} ariaLabel
     * @param {?} enabled
     * @param {?=} cssClasses
     */
    constructor(value, displayValue, ariaLabel, enabled, cssClasses = {}) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.cssClasses = cssClasses;
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
}
/**
 * An internal component used to display calendar data in a table.
 * \@docs-private
 */
export class MatCalendarBody {
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
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /**
         * Emits when a new value is selected.
         */
        this.selectedValueChange = new EventEmitter();
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    _cellClicked(cell) {
        if (cell.enabled) {
            this.selectedValueChange.emit(cell.value);
        }
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
     * @return {?}
     */
    _focusActiveCell() {
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
                    activeCell.focus();
                }
            }));
        }));
    }
}
MatCalendarBody.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: '[mat-calendar-body]',
                template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\n  <td class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"numCols\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n  <!--\n    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\n    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a\n    percentage of the width (a variant of the trick described here:\n    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\n      aria-hidden=\"true\"\n      class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"_firstRowOffset\"\n      [style.paddingTop]=\"_cellPadding\"\n      [style.paddingBottom]=\"_cellPadding\">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n  </td>\n  <td *ngFor=\"let item of row; let colIndex = index\"\n      role=\"gridcell\"\n      class=\"mat-calendar-body-cell\"\n      [ngClass]=\"item.cssClasses\"\n      [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n      [class.mat-calendar-body-disabled]=\"!item.enabled\"\n      [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n      [attr.aria-label]=\"item.ariaLabel\"\n      [attr.aria-disabled]=\"!item.enabled || null\"\n      [attr.aria-selected]=\"selectedValue === item.value\"\n      (click)=\"_cellClicked(item)\"\n      [style.width]=\"_cellWidth\"\n      [style.paddingTop]=\"_cellPadding\"\n      role=\"button\"\n      [style.paddingBottom]=\"_cellPadding\">\n      <div class=\"mat-calendar-body-cell-content\"\n        [class.mat-calendar-body-selected]=\"selectedValue === item.value\"\n        [class.mat-calendar-body-today]=\"todayValue === item.value\">\n        {{item.displayValue}}\n      </div>\n  </td>\n</tr>\n",
                host: {
                    'class': 'mat-calendar-body',
                    'role': 'grid',
                    'aria-readonly': 'true'
                },
                exportAs: 'matCalendarBody',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.7142857143%;padding-right:4.7142857143%}.mat-calendar-body-cell{position:relative;height:0;line-height:0;text-align:center;outline:none;cursor:pointer}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}@media(-ms-high-contrast: active){.mat-calendar-body-cell-content{border:none}}@media(-ms-high-contrast: active){.mat-datepicker-popup:not(:empty),.mat-calendar-body-selected{outline:solid 1px}.mat-calendar-body-today{outline:dotted 1px}.cdk-keyboard-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected),.cdk-program-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected){outline:dotted 2px}}[dir=rtl] .mat-calendar-body-label{text-align:right}\n"]
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
    selectedValue: [{ type: Input }],
    labelMinRequiredCells: [{ type: Input }],
    numCols: [{ type: Input }],
    activeCell: [{ type: Input }],
    cellAspectRatio: [{ type: Input }],
    selectedValueChange: [{ type: Output }]
};
if (false) {
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
     * The value in the table that is currently selected.
     * @type {?}
     */
    MatCalendarBody.prototype.selectedValue;
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
     * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
     * maintained even as the table resizes.
     * @type {?}
     */
    MatCalendarBody.prototype.cellAspectRatio;
    /**
     * Emits when a new value is selected.
     * @type {?}
     */
    MatCalendarBody.prototype.selectedValueChange;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBV3BDLE1BQU0sT0FBTyxlQUFlOzs7Ozs7OztJQUMxQixZQUFtQixLQUFhLEVBQ2IsWUFBb0IsRUFDcEIsU0FBaUIsRUFDakIsT0FBZ0IsRUFDaEIsYUFBd0MsRUFBRTtRQUoxQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGVBQVUsR0FBVixVQUFVLENBQWdDO0lBQUcsQ0FBQztDQUNsRTs7O0lBTGEsZ0NBQW9COztJQUNwQix1Q0FBMkI7O0lBQzNCLG9DQUF3Qjs7SUFDeEIsa0NBQXVCOztJQUN2QixxQ0FBaUQ7Ozs7OztBQXNCL0QsTUFBTSxPQUFPLGVBQWU7Ozs7O0lBd0MxQixZQUFvQixXQUFvQyxFQUFVLE9BQWU7UUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTs7OztRQXZCeEUsWUFBTyxHQUFXLENBQUMsQ0FBQzs7OztRQUdwQixlQUFVLEdBQVcsQ0FBQyxDQUFDOzs7OztRQU12QixvQkFBZSxHQUFXLENBQUMsQ0FBQzs7OztRQUdsQix3QkFBbUIsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztJQVdMLENBQUM7Ozs7O0lB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Ozs7OztJQUc3QixxQ0FBZ0M7Ozs7OztJQU1oQywwQ0FBcUM7Ozs7O0lBR3JDLDhDQUEwRjs7Ozs7SUFHMUYsMENBQXdCOzs7OztJQUd4Qix1Q0FBcUI7Ozs7O0lBR3JCLHFDQUFtQjs7Ozs7SUFFUCxzQ0FBNEM7Ozs7O0lBQUUsa0NBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEV4dHJhIENTUyBjbGFzc2VzIHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIGNhbGVuZGFyIGNlbGwuXG4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY2xhc3MgdGhhdCByZXByZXNlbnRzIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gYSBzaW5nbGUgY2FsZW5kYXIgY2VsbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyQ2VsbCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgZGlzcGxheVZhbHVlOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBhcmlhTGFiZWw6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBjc3NDbGFzc2VzOiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzID0ge30pIHt9XG59XG5cblxuLyoqXG4gKiBBbiBpbnRlcm5hbCBjb21wb25lbnQgdXNlZCB0byBkaXNwbGF5IGNhbGVuZGFyIGRhdGEgaW4gYSB0YWJsZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnW21hdC1jYWxlbmRhci1ib2R5XScsXG4gIHRlbXBsYXRlVXJsOiAnY2FsZW5kYXItYm9keS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2NhbGVuZGFyLWJvZHkuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhbGVuZGFyLWJvZHknLFxuICAgICdyb2xlJzogJ2dyaWQnLFxuICAgICdhcmlhLXJlYWRvbmx5JzogJ3RydWUnXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0Q2FsZW5kYXJCb2R5JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyQm9keSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSB0YWJsZS4gKGUuZy4gXCJKYW4gMjAxN1wiKS4gKi9cbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlIGNlbGxzIHRvIGRpc3BsYXkgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSByb3dzOiBNYXRDYWxlbmRhckNlbGxbXVtdO1xuXG4gIC8qKiBUaGUgdmFsdWUgaW4gdGhlIHRhYmxlIHRoYXQgY29ycmVzcG9uZHMgdG8gdG9kYXkuICovXG4gIEBJbnB1dCgpIHRvZGF5VmFsdWU6IG51bWJlcjtcblxuICAvKiogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSB0aGF0IGlzIGN1cnJlbnRseSBzZWxlY3RlZC4gKi9cbiAgQElucHV0KCkgc2VsZWN0ZWRWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgbWluaW11bSBudW1iZXIgb2YgZnJlZSBjZWxscyBuZWVkZWQgdG8gZml0IHRoZSBsYWJlbCBpbiB0aGUgZmlyc3Qgcm93LiAqL1xuICBASW5wdXQoKSBsYWJlbE1pblJlcXVpcmVkQ2VsbHM6IG51bWJlcjtcblxuICAvKiogVGhlIG51bWJlciBvZiBjb2x1bW5zIGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgbnVtQ29sczogbnVtYmVyID0gNztcblxuICAvKiogVGhlIGNlbGwgbnVtYmVyIG9mIHRoZSBhY3RpdmUgY2VsbCBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIGFjdGl2ZUNlbGw6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFRoZSBhc3BlY3QgcmF0aW8gKHdpZHRoIC8gaGVpZ2h0KSB0byB1c2UgZm9yIHRoZSBjZWxscyBpbiB0aGUgdGFibGUuIFRoaXMgYXNwZWN0IHJhdGlvIHdpbGwgYmVcbiAgICogbWFpbnRhaW5lZCBldmVuIGFzIHRoZSB0YWJsZSByZXNpemVzLlxuICAgKi9cbiAgQElucHV0KCkgY2VsbEFzcGVjdFJhdGlvOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IHZhbHVlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRWYWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogVGhlIG51bWJlciBvZiBibGFuayBjZWxscyB0byBwdXQgYXQgdGhlIGJlZ2lubmluZyBmb3IgdGhlIGZpcnN0IHJvdy4gKi9cbiAgX2ZpcnN0Um93T2Zmc2V0OiBudW1iZXI7XG5cbiAgLyoqIFBhZGRpbmcgZm9yIHRoZSBpbmRpdmlkdWFsIGRhdGUgY2VsbHMuICovXG4gIF9jZWxsUGFkZGluZzogc3RyaW5nO1xuXG4gIC8qKiBXaWR0aCBvZiBhbiBpbmRpdmlkdWFsIGNlbGwuICovXG4gIF9jZWxsV2lkdGg6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHsgfVxuXG4gIF9jZWxsQ2xpY2tlZChjZWxsOiBNYXRDYWxlbmRhckNlbGwpOiB2b2lkIHtcbiAgICBpZiAoY2VsbC5lbmFibGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkVmFsdWVDaGFuZ2UuZW1pdChjZWxsLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgY29sdW1uQ2hhbmdlcyA9IGNoYW5nZXNbJ251bUNvbHMnXTtcbiAgICBjb25zdCB7cm93cywgbnVtQ29sc30gPSB0aGlzO1xuXG4gICAgaWYgKGNoYW5nZXNbJ3Jvd3MnXSB8fCBjb2x1bW5DaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9maXJzdFJvd09mZnNldCA9IHJvd3MgJiYgcm93cy5sZW5ndGggJiYgcm93c1swXS5sZW5ndGggPyBudW1Db2xzIC0gcm93c1swXS5sZW5ndGggOiAwO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydjZWxsQXNwZWN0UmF0aW8nXSB8fCBjb2x1bW5DaGFuZ2VzIHx8ICF0aGlzLl9jZWxsUGFkZGluZykge1xuICAgICAgdGhpcy5fY2VsbFBhZGRpbmcgPSBgJHs1MCAqIHRoaXMuY2VsbEFzcGVjdFJhdGlvIC8gbnVtQ29sc30lYDtcbiAgICB9XG5cbiAgICBpZiAoY29sdW1uQ2hhbmdlcyB8fCAhdGhpcy5fY2VsbFdpZHRoKSB7XG4gICAgICB0aGlzLl9jZWxsV2lkdGggPSBgJHsxMDAgLyBudW1Db2xzfSVgO1xuICAgIH1cbiAgfVxuXG4gIF9pc0FjdGl2ZUNlbGwocm93SW5kZXg6IG51bWJlciwgY29sSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGxldCBjZWxsTnVtYmVyID0gcm93SW5kZXggKiB0aGlzLm51bUNvbHMgKyBjb2xJbmRleDtcblxuICAgIC8vIEFjY291bnQgZm9yIHRoZSBmYWN0IHRoYXQgdGhlIGZpcnN0IHJvdyBtYXkgbm90IGhhdmUgYXMgbWFueSBjZWxscy5cbiAgICBpZiAocm93SW5kZXgpIHtcbiAgICAgIGNlbGxOdW1iZXIgLT0gdGhpcy5fZmlyc3RSb3dPZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNlbGxOdW1iZXIgPT0gdGhpcy5hY3RpdmVDZWxsO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGFjdGl2ZSBjZWxsIGFmdGVyIHRoZSBtaWNyb3Rhc2sgcXVldWUgaXMgZW1wdHkuICovXG4gIF9mb2N1c0FjdGl2ZUNlbGwoKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCA9XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1hdC1jYWxlbmRhci1ib2R5LWFjdGl2ZScpO1xuXG4gICAgICAgIGlmIChhY3RpdmVDZWxsKSB7XG4gICAgICAgICAgYWN0aXZlQ2VsbC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19