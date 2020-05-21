/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef, Input } from '@angular/core';
import { CdkCell, CdkCellDef, CdkColumnDef, CdkFooterCell, CdkFooterCellDef, CdkHeaderCell, CdkHeaderCellDef, } from '@angular/cdk/table';
/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
let MatCellDef = /** @class */ (() => {
    var MatCellDef_1;
    let MatCellDef = MatCellDef_1 = class MatCellDef extends CdkCellDef {
    };
    MatCellDef = MatCellDef_1 = __decorate([
        Directive({
            selector: '[matCellDef]',
            providers: [{ provide: CdkCellDef, useExisting: MatCellDef_1 }]
        })
    ], MatCellDef);
    return MatCellDef;
})();
export { MatCellDef };
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
let MatHeaderCellDef = /** @class */ (() => {
    var MatHeaderCellDef_1;
    let MatHeaderCellDef = MatHeaderCellDef_1 = class MatHeaderCellDef extends CdkHeaderCellDef {
    };
    MatHeaderCellDef = MatHeaderCellDef_1 = __decorate([
        Directive({
            selector: '[matHeaderCellDef]',
            providers: [{ provide: CdkHeaderCellDef, useExisting: MatHeaderCellDef_1 }]
        })
    ], MatHeaderCellDef);
    return MatHeaderCellDef;
})();
export { MatHeaderCellDef };
/**
 * Footer cell definition for the mat-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
let MatFooterCellDef = /** @class */ (() => {
    var MatFooterCellDef_1;
    let MatFooterCellDef = MatFooterCellDef_1 = class MatFooterCellDef extends CdkFooterCellDef {
    };
    MatFooterCellDef = MatFooterCellDef_1 = __decorate([
        Directive({
            selector: '[matFooterCellDef]',
            providers: [{ provide: CdkFooterCellDef, useExisting: MatFooterCellDef_1 }]
        })
    ], MatFooterCellDef);
    return MatFooterCellDef;
})();
export { MatFooterCellDef };
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
let MatColumnDef = /** @class */ (() => {
    var MatColumnDef_1;
    let MatColumnDef = MatColumnDef_1 = class MatColumnDef extends CdkColumnDef {
    };
    __decorate([
        Input('matColumnDef'),
        __metadata("design:type", String)
    ], MatColumnDef.prototype, "name", void 0);
    MatColumnDef = MatColumnDef_1 = __decorate([
        Directive({
            selector: '[matColumnDef]',
            inputs: ['sticky'],
            providers: [
                { provide: CdkColumnDef, useExisting: MatColumnDef_1 },
                { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: MatColumnDef_1 }
            ],
        })
    ], MatColumnDef);
    return MatColumnDef;
})();
export { MatColumnDef };
/** Header cell template container that adds the right classes and role. */
let MatHeaderCell = /** @class */ (() => {
    let MatHeaderCell = class MatHeaderCell extends CdkHeaderCell {
        constructor(columnDef, elementRef) {
            super(columnDef, elementRef);
            elementRef.nativeElement.classList.add(`mat-column-${columnDef.cssClassFriendlyName}`);
        }
    };
    MatHeaderCell = __decorate([
        Directive({
            selector: 'mat-header-cell, th[mat-header-cell]',
            host: {
                'class': 'mat-header-cell',
                'role': 'columnheader',
            },
        }),
        __metadata("design:paramtypes", [CdkColumnDef,
            ElementRef])
    ], MatHeaderCell);
    return MatHeaderCell;
})();
export { MatHeaderCell };
/** Footer cell template container that adds the right classes and role. */
let MatFooterCell = /** @class */ (() => {
    let MatFooterCell = class MatFooterCell extends CdkFooterCell {
        constructor(columnDef, elementRef) {
            super(columnDef, elementRef);
            elementRef.nativeElement.classList.add(`mat-column-${columnDef.cssClassFriendlyName}`);
        }
    };
    MatFooterCell = __decorate([
        Directive({
            selector: 'mat-footer-cell, td[mat-footer-cell]',
            host: {
                'class': 'mat-footer-cell',
                'role': 'gridcell',
            },
        }),
        __metadata("design:paramtypes", [CdkColumnDef,
            ElementRef])
    ], MatFooterCell);
    return MatFooterCell;
})();
export { MatFooterCell };
/** Cell template container that adds the right classes and role. */
let MatCell = /** @class */ (() => {
    let MatCell = class MatCell extends CdkCell {
        constructor(columnDef, elementRef) {
            super(columnDef, elementRef);
            elementRef.nativeElement.classList.add(`mat-column-${columnDef.cssClassFriendlyName}`);
        }
    };
    MatCell = __decorate([
        Directive({
            selector: 'mat-cell, td[mat-cell]',
            host: {
                'class': 'mat-cell',
                'role': 'gridcell',
            },
        }),
        __metadata("design:paramtypes", [CdkColumnDef,
            ElementRef])
    ], MatCell);
    return MatCell;
})();
export { MatCell };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS9jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFHSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBQ1YsWUFBWSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFDN0MsYUFBYSxFQUNiLGdCQUFnQixHQUNqQixNQUFNLG9CQUFvQixDQUFDO0FBRTVCOzs7R0FHRztBQUtIOztJQUFBLElBQWEsVUFBVSxrQkFBdkIsTUFBYSxVQUFXLFNBQVEsVUFBVTtLQUFHLENBQUE7SUFBaEMsVUFBVTtRQUp0QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFlBQVUsRUFBQyxDQUFDO1NBQzVELENBQUM7T0FDVyxVQUFVLENBQXNCO0lBQUQsaUJBQUM7S0FBQTtTQUFoQyxVQUFVO0FBRXZCOzs7R0FHRztBQUtIOztJQUFBLElBQWEsZ0JBQWdCLHdCQUE3QixNQUFhLGdCQUFpQixTQUFRLGdCQUFnQjtLQUFHLENBQUE7SUFBNUMsZ0JBQWdCO1FBSjVCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFnQixFQUFDLENBQUM7U0FDeEUsQ0FBQztPQUNXLGdCQUFnQixDQUE0QjtJQUFELHVCQUFDO0tBQUE7U0FBNUMsZ0JBQWdCO0FBRTdCOzs7R0FHRztBQUtIOztJQUFBLElBQWEsZ0JBQWdCLHdCQUE3QixNQUFhLGdCQUFpQixTQUFRLGdCQUFnQjtLQUFHLENBQUE7SUFBNUMs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QztLQUFBO1NBTlksT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDZGtDZWxsLFxuICBDZGtDZWxsRGVmLFxuICBDZGtDb2x1bW5EZWYsIENka0Zvb3RlckNlbGwsIENka0Zvb3RlckNlbGxEZWYsXG4gIENka0hlYWRlckNlbGwsXG4gIENka0hlYWRlckNlbGxEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5cbi8qKlxuICogQ2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgZGF0YSByb3cgY2VsbCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0NlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRDZWxsRGVmfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbERlZiBleHRlbmRzIENka0NlbGxEZWYge31cblxuLyoqXG4gKiBIZWFkZXIgY2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgaGVhZGVyIGNlbGwgYW5kIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0SGVhZGVyQ2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrSGVhZGVyQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlckNlbGxEZWZ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJDZWxsRGVmIGV4dGVuZHMgQ2RrSGVhZGVyQ2VsbERlZiB7fVxuXG4vKipcbiAqIEZvb3RlciBjZWxsIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgdGVtcGxhdGUgb2YgYSBjb2x1bW4ncyBmb290ZXIgY2VsbCBhbmQgYXMgd2VsbCBhcyBjZWxsLXNwZWNpZmljIHByb3BlcnRpZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRGb290ZXJDZWxsRGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtGb290ZXJDZWxsRGVmLCB1c2VFeGlzdGluZzogTWF0Rm9vdGVyQ2VsbERlZn1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvb3RlckNlbGxEZWYgZXh0ZW5kcyBDZGtGb290ZXJDZWxsRGVmIHt9XG5cbi8qKlxuICogQ29sdW1uIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBEZWZpbmVzIGEgc2V0IG9mIGNlbGxzIGF2YWlsYWJsZSBmb3IgYSB0YWJsZSBjb2x1bW4uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDb2x1bW5EZWZdJyxcbiAgaW5wdXRzOiBbJ3N0aWNreSddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrQ29sdW1uRGVmLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uRGVmfSxcbiAgICB7cHJvdmlkZTogJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJywgdXNlRXhpc3Rpbmc6IE1hdENvbHVtbkRlZn1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uRGVmIGV4dGVuZHMgQ2RrQ29sdW1uRGVmIHtcbiAgLyoqIFVuaXF1ZSBuYW1lIGZvciB0aGlzIGNvbHVtbi4gKi9cbiAgQElucHV0KCdtYXRDb2x1bW5EZWYnKSBuYW1lOiBzdHJpbmc7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0aWNreTogQm9vbGVhbklucHV0O1xufVxuXG4vKiogSGVhZGVyIGNlbGwgdGVtcGxhdGUgY29udGFpbmVyIHRoYXQgYWRkcyB0aGUgcmlnaHQgY2xhc3NlcyBhbmQgcm9sZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oZWFkZXItY2VsbCwgdGhbbWF0LWhlYWRlci1jZWxsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWhlYWRlci1jZWxsJyxcbiAgICAncm9sZSc6ICdjb2x1bW5oZWFkZXInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJDZWxsIGV4dGVuZHMgQ2RrSGVhZGVyQ2VsbCB7XG4gIGNvbnN0cnVjdG9yKGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHN1cGVyKGNvbHVtbkRlZiwgZWxlbWVudFJlZik7XG4gICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1jb2x1bW4tJHtjb2x1bW5EZWYuY3NzQ2xhc3NGcmllbmRseU5hbWV9YCk7XG4gIH1cbn1cblxuLyoqIEZvb3RlciBjZWxsIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGFkZHMgdGhlIHJpZ2h0IGNsYXNzZXMgYW5kIHJvbGUuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9vdGVyLWNlbGwsIHRkW21hdC1mb290ZXItY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb290ZXItY2VsbCcsXG4gICAgJ3JvbGUnOiAnZ3JpZGNlbGwnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJDZWxsIGV4dGVuZHMgQ2RrRm9vdGVyQ2VsbCB7XG4gIGNvbnN0cnVjdG9yKGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoY29sdW1uRGVmLCBlbGVtZW50UmVmKTtcbiAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWNvbHVtbi0ke2NvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZX1gKTtcbiAgfVxufVxuXG4vKiogQ2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNlbGwsIHRkW21hdC1jZWxsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNlbGwnLFxuICAgICdyb2xlJzogJ2dyaWRjZWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbCBleHRlbmRzIENka0NlbGwge1xuICBjb25zdHJ1Y3Rvcihjb2x1bW5EZWY6IENka0NvbHVtbkRlZixcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzdXBlcihjb2x1bW5EZWYsIGVsZW1lbnRSZWYpO1xuICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtY29sdW1uLSR7Y29sdW1uRGVmLmNzc0NsYXNzRnJpZW5kbHlOYW1lfWApO1xuICB9XG59XG4iXX0=