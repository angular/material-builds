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
    function MatCalendarCell(value, displayValue, ariaLabel, enabled, cssClasses) {
        if (cssClasses === void 0) { cssClasses = {}; }
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.cssClasses = cssClasses;
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
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /** The number of columns in the table. */
        this.numCols = 7;
        /** The cell number of the active cell in the table. */
        this.activeCell = 0;
        /**
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /** Emits when a new value is selected. */
        this.selectedValueChange = new EventEmitter();
    }
    MatCalendarBody.prototype._cellClicked = function (cell) {
        if (cell.enabled) {
            this.selectedValueChange.emit(cell.value);
        }
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
    MatCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    /** Focuses the active cell after the microtask queue is empty. */
    MatCalendarBody.prototype._focusActiveCell = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(function () {
                var activeCell = _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
                if (activeCell) {
                    activeCell.focus();
                }
            });
        });
    };
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
    MatCalendarBody.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
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
    return MatCalendarBody;
}());
export { MatCalendarBody };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEdBR1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBT3BDOzs7R0FHRztBQUNIO0lBQ0UseUJBQW1CLEtBQWEsRUFDYixZQUFvQixFQUNwQixTQUFpQixFQUNqQixPQUFnQixFQUNoQixVQUEwQztRQUExQywyQkFBQSxFQUFBLGVBQTBDO1FBSjFDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsZUFBVSxHQUFWLFVBQVUsQ0FBZ0M7SUFBRyxDQUFDO0lBQ25FLHNCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7O0FBR0Q7OztHQUdHO0FBQ0g7SUFzREUseUJBQW9CLFdBQW9DLEVBQVUsT0FBZTtRQUE3RCxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBeEJqRiwwQ0FBMEM7UUFDakMsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUU3Qix1REFBdUQ7UUFDOUMsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUVoQzs7O1dBR0c7UUFDTSxvQkFBZSxHQUFXLENBQUMsQ0FBQztRQUVyQywwQ0FBMEM7UUFDdkIsd0JBQW1CLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7SUFXTCxDQUFDO0lBRXRG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Y2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBFeHRyYSBDU1MgY2xhc3NlcyB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBjYWxlbmRhciBjZWxsLlxuICovXG5leHBvcnQgdHlwZSBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzID0gc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNsYXNzIHRoYXQgcmVwcmVzZW50cyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGEgc2luZ2xlIGNhbGVuZGFyIGNlbGwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckNlbGwge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIGRpc3BsYXlWYWx1ZTogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgYXJpYUxhYmVsOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgY3NzQ2xhc3NlczogTWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcyA9IHt9KSB7fVxufVxuXG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHVzZWQgdG8gZGlzcGxheSBjYWxlbmRhciBkYXRhIGluIGEgdGFibGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ1ttYXQtY2FsZW5kYXItYm9keV0nLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWJvZHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjYWxlbmRhci1ib2R5LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYWxlbmRhci1ib2R5JyxcbiAgICAncm9sZSc6ICdncmlkJyxcbiAgICAnYXJpYS1yZWFkb25seSc6ICd0cnVlJ1xuICB9LFxuICBleHBvcnRBczogJ21hdENhbGVuZGFyQm9keScsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckJvZHkgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgdGFibGUuIChlLmcuIFwiSmFuIDIwMTdcIikuICovXG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBjZWxscyB0byBkaXNwbGF5IGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgcm93czogTWF0Q2FsZW5kYXJDZWxsW11bXTtcblxuICAvKiogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRvZGF5LiAqL1xuICBASW5wdXQoKSB0b2RheVZhbHVlOiBudW1iZXI7XG5cbiAgLyoqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBpcyBjdXJyZW50bHkgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpIHNlbGVjdGVkVmFsdWU6IG51bWJlcjtcblxuICAvKiogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGZyZWUgY2VsbHMgbmVlZGVkIHRvIGZpdCB0aGUgbGFiZWwgaW4gdGhlIGZpcnN0IHJvdy4gKi9cbiAgQElucHV0KCkgbGFiZWxNaW5SZXF1aXJlZENlbGxzOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIG51bUNvbHM6IG51bWJlciA9IDc7XG5cbiAgLyoqIFRoZSBjZWxsIG51bWJlciBvZiB0aGUgYWN0aXZlIGNlbGwgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSBhY3RpdmVDZWxsOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBUaGUgYXNwZWN0IHJhdGlvICh3aWR0aCAvIGhlaWdodCkgdG8gdXNlIGZvciB0aGUgY2VsbHMgaW4gdGhlIHRhYmxlLiBUaGlzIGFzcGVjdCByYXRpbyB3aWxsIGJlXG4gICAqIG1haW50YWluZWQgZXZlbiBhcyB0aGUgdGFibGUgcmVzaXplcy5cbiAgICovXG4gIEBJbnB1dCgpIGNlbGxBc3BlY3RSYXRpbzogbnVtYmVyID0gMTtcblxuICAvKiogRW1pdHMgd2hlbiBhIG5ldyB2YWx1ZSBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkVmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgYmxhbmsgY2VsbHMgdG8gcHV0IGF0IHRoZSBiZWdpbm5pbmcgZm9yIHRoZSBmaXJzdCByb3cuICovXG4gIF9maXJzdFJvd09mZnNldDogbnVtYmVyO1xuXG4gIC8qKiBQYWRkaW5nIGZvciB0aGUgaW5kaXZpZHVhbCBkYXRlIGNlbGxzLiAqL1xuICBfY2VsbFBhZGRpbmc6IHN0cmluZztcblxuICAvKiogV2lkdGggb2YgYW4gaW5kaXZpZHVhbCBjZWxsLiAqL1xuICBfY2VsbFdpZHRoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7IH1cblxuICBfY2VsbENsaWNrZWQoY2VsbDogTWF0Q2FsZW5kYXJDZWxsKTogdm9pZCB7XG4gICAgaWYgKGNlbGwuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlQ2hhbmdlLmVtaXQoY2VsbC52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGNvbHVtbkNoYW5nZXMgPSBjaGFuZ2VzWydudW1Db2xzJ107XG4gICAgY29uc3Qge3Jvd3MsIG51bUNvbHN9ID0gdGhpcztcblxuICAgIGlmIChjaGFuZ2VzWydyb3dzJ10gfHwgY29sdW1uQ2hhbmdlcykge1xuICAgICAgdGhpcy5fZmlyc3RSb3dPZmZzZXQgPSByb3dzICYmIHJvd3MubGVuZ3RoICYmIHJvd3NbMF0ubGVuZ3RoID8gbnVtQ29scyAtIHJvd3NbMF0ubGVuZ3RoIDogMDtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1snY2VsbEFzcGVjdFJhdGlvJ10gfHwgY29sdW1uQ2hhbmdlcyB8fCAhdGhpcy5fY2VsbFBhZGRpbmcpIHtcbiAgICAgIHRoaXMuX2NlbGxQYWRkaW5nID0gYCR7NTAgKiB0aGlzLmNlbGxBc3BlY3RSYXRpbyAvIG51bUNvbHN9JWA7XG4gICAgfVxuXG4gICAgaWYgKGNvbHVtbkNoYW5nZXMgfHwgIXRoaXMuX2NlbGxXaWR0aCkge1xuICAgICAgdGhpcy5fY2VsbFdpZHRoID0gYCR7MTAwIC8gbnVtQ29sc30lYDtcbiAgICB9XG4gIH1cblxuICBfaXNBY3RpdmVDZWxsKHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBsZXQgY2VsbE51bWJlciA9IHJvd0luZGV4ICogdGhpcy5udW1Db2xzICsgY29sSW5kZXg7XG5cbiAgICAvLyBBY2NvdW50IGZvciB0aGUgZmFjdCB0aGF0IHRoZSBmaXJzdCByb3cgbWF5IG5vdCBoYXZlIGFzIG1hbnkgY2VsbHMuXG4gICAgaWYgKHJvd0luZGV4KSB7XG4gICAgICBjZWxsTnVtYmVyIC09IHRoaXMuX2ZpcnN0Um93T2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiBjZWxsTnVtYmVyID09IHRoaXMuYWN0aXZlQ2VsbDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciB0aGUgbWljcm90YXNrIHF1ZXVlIGlzIGVtcHR5LiAqL1xuICBfZm9jdXNBY3RpdmVDZWxsKCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3RpdmVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwgPVxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXQtY2FsZW5kYXItYm9keS1hY3RpdmUnKTtcblxuICAgICAgICBpZiAoYWN0aXZlQ2VsbCkge1xuICAgICAgICAgIGFjdGl2ZUNlbGwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==