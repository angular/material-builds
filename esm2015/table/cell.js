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
import { Directive, ElementRef, Input } from '@angular/core';
import { CdkCell, CdkCellDef, CdkColumnDef, CdkFooterCell, CdkFooterCellDef, CdkHeaderCell, CdkHeaderCellDef, } from '@angular/cdk/table';
/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
export class MatCellDef extends CdkCellDef {
}
MatCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[matCellDef]',
                providers: [{ provide: CdkCellDef, useExisting: MatCellDef }]
            },] }
];
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
export class MatHeaderCellDef extends CdkHeaderCellDef {
}
MatHeaderCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[matHeaderCellDef]',
                providers: [{ provide: CdkHeaderCellDef, useExisting: MatHeaderCellDef }]
            },] }
];
/**
 * Footer cell definition for the mat-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
export class MatFooterCellDef extends CdkFooterCellDef {
}
MatFooterCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[matFooterCellDef]',
                providers: [{ provide: CdkFooterCellDef, useExisting: MatFooterCellDef }]
            },] }
];
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
export class MatColumnDef extends CdkColumnDef {
}
MatColumnDef.decorators = [
    { type: Directive, args: [{
                selector: '[matColumnDef]',
                providers: [
                    { provide: CdkColumnDef, useExisting: MatColumnDef },
                    { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: MatColumnDef }
                ],
            },] }
];
MatColumnDef.propDecorators = {
    name: [{ type: Input, args: ['matColumnDef',] }],
    sticky: [{ type: Input }],
    stickyEnd: [{ type: Input }]
};
if (false) {
    /**
     * Unique name for this column.
     * @type {?}
     */
    MatColumnDef.prototype.name;
    /**
     * Whether this column should be sticky positioned at the start of the row
     * @type {?}
     */
    MatColumnDef.prototype.sticky;
    /**
     * Whether this column should be sticky positioned on the end of the row
     * @type {?}
     */
    MatColumnDef.prototype.stickyEnd;
}
/**
 * Header cell template container that adds the right classes and role.
 */
export class MatHeaderCell extends CdkHeaderCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     */
    constructor(columnDef, elementRef) {
        super(columnDef, elementRef);
        elementRef.nativeElement.classList.add(`mat-column-${columnDef.cssClassFriendlyName}`);
    }
}
MatHeaderCell.decorators = [
    { type: Directive, args: [{
                selector: 'mat-header-cell, th[mat-header-cell]',
                host: {
                    'class': 'mat-header-cell',
                    'role': 'columnheader',
                },
            },] }
];
/** @nocollapse */
MatHeaderCell.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ElementRef }
];
/**
 * Footer cell template container that adds the right classes and role.
 */
export class MatFooterCell extends CdkFooterCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     */
    constructor(columnDef, elementRef) {
        super(columnDef, elementRef);
        elementRef.nativeElement.classList.add(`mat-column-${columnDef.cssClassFriendlyName}`);
    }
}
MatFooterCell.decorators = [
    { type: Directive, args: [{
                selector: 'mat-footer-cell, td[mat-footer-cell]',
                host: {
                    'class': 'mat-footer-cell',
                    'role': 'gridcell',
                },
            },] }
];
/** @nocollapse */
MatFooterCell.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ElementRef }
];
/**
 * Cell template container that adds the right classes and role.
 */
export class MatCell extends CdkCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     */
    constructor(columnDef, elementRef) {
        super(columnDef, elementRef);
        elementRef.nativeElement.classList.add(`mat-column-${columnDef.cssClassFriendlyName}`);
    }
}
MatCell.decorators = [
    { type: Directive, args: [{
                selector: 'mat-cell, td[mat-cell]',
                host: {
                    'class': 'mat-cell',
                    'role': 'gridcell',
                },
            },] }
];
/** @nocollapse */
MatCell.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS9jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQzdDLGFBQWEsRUFDYixnQkFBZ0IsR0FDakIsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7QUFVNUIsTUFBTSxPQUFPLFVBQVcsU0FBUSxVQUFVOzs7WUFKekMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBQyxDQUFDO2FBQzVEOzs7Ozs7QUFXRCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCOzs7WUFKckQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO2FBQ3hFOzs7Ozs7QUFXRCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCOzs7WUFKckQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO2FBQ3hFOzs7Ozs7QUFjRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFlBQVk7OztZQVA3QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsU0FBUyxFQUFFO29CQUNULEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO29CQUNsRCxFQUFDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO2lCQUNuRTthQUNGOzs7bUJBR0UsS0FBSyxTQUFDLGNBQWM7cUJBR3BCLEtBQUs7d0JBR0wsS0FBSzs7Ozs7OztJQU5OLDRCQUFvQzs7Ozs7SUFHcEMsOEJBQXlCOzs7OztJQUd6QixpQ0FBNEI7Ozs7O0FBVzlCLE1BQU0sT0FBTyxhQUFjLFNBQVEsYUFBYTs7Ozs7SUFDOUMsWUFBWSxTQUF1QixFQUN2QixVQUFtQztRQUM3QyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDekYsQ0FBQzs7O1lBWkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQ0FBc0M7Z0JBQ2hELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjs7OztZQWhFQyxZQUFZO1lBSkssVUFBVTs7Ozs7QUFxRjdCLE1BQU0sT0FBTyxhQUFjLFNBQVEsYUFBYTs7Ozs7SUFDOUMsWUFBWSxTQUF1QixFQUN2QixVQUFzQjtRQUNoQyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDekYsQ0FBQzs7O1lBWkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQ0FBc0M7Z0JBQ2hELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixNQUFNLEVBQUUsVUFBVTtpQkFDbkI7YUFDRjs7OztZQWhGQyxZQUFZO1lBSkssVUFBVTs7Ozs7QUFxRzdCLE1BQU0sT0FBTyxPQUFRLFNBQVEsT0FBTzs7Ozs7SUFDbEMsWUFBWSxTQUF1QixFQUN2QixVQUFtQztRQUM3QyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDekYsQ0FBQzs7O1lBWkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsVUFBVTtvQkFDbkIsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0Y7Ozs7WUFoR0MsWUFBWTtZQUpLLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENka0NlbGwsXG4gIENka0NlbGxEZWYsXG4gIENka0NvbHVtbkRlZiwgQ2RrRm9vdGVyQ2VsbCwgQ2RrRm9vdGVyQ2VsbERlZixcbiAgQ2RrSGVhZGVyQ2VsbCxcbiAgQ2RrSGVhZGVyQ2VsbERlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcblxuLyoqXG4gKiBDZWxsIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgdGVtcGxhdGUgb2YgYSBjb2x1bW4ncyBkYXRhIHJvdyBjZWxsIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Q2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdENlbGxEZWZ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDZWxsRGVmIGV4dGVuZHMgQ2RrQ2VsbERlZiB7fVxuXG4vKipcbiAqIEhlYWRlciBjZWxsIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgdGVtcGxhdGUgb2YgYSBjb2x1bW4ncyBoZWFkZXIgY2VsbCBhbmQgYXMgd2VsbCBhcyBjZWxsLXNwZWNpZmljIHByb3BlcnRpZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRIZWFkZXJDZWxsRGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtIZWFkZXJDZWxsRGVmLCB1c2VFeGlzdGluZzogTWF0SGVhZGVyQ2VsbERlZn1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdEhlYWRlckNlbGxEZWYgZXh0ZW5kcyBDZGtIZWFkZXJDZWxsRGVmIHt9XG5cbi8qKlxuICogRm9vdGVyIGNlbGwgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSB0ZW1wbGF0ZSBvZiBhIGNvbHVtbidzIGZvb3RlciBjZWxsIGFuZCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEZvb3RlckNlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0Zvb3RlckNlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRGb290ZXJDZWxsRGVmfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyQ2VsbERlZiBleHRlbmRzIENka0Zvb3RlckNlbGxEZWYge31cblxuLyoqXG4gKiBDb2x1bW4gZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIERlZmluZXMgYSBzZXQgb2YgY2VsbHMgYXZhaWxhYmxlIGZvciBhIHRhYmxlIGNvbHVtbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENvbHVtbkRlZl0nLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrQ29sdW1uRGVmLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uRGVmfSxcbiAgICB7cHJvdmlkZTogJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJywgdXNlRXhpc3Rpbmc6IE1hdENvbHVtbkRlZn1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uRGVmIGV4dGVuZHMgQ2RrQ29sdW1uRGVmIHtcbiAgLyoqIFVuaXF1ZSBuYW1lIGZvciB0aGlzIGNvbHVtbi4gKi9cbiAgQElucHV0KCdtYXRDb2x1bW5EZWYnKSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBjb2x1bW4gc2hvdWxkIGJlIHN0aWNreSBwb3NpdGlvbmVkIGF0IHRoZSBzdGFydCBvZiB0aGUgcm93ICovXG4gIEBJbnB1dCgpIHN0aWNreTogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGlzIGNvbHVtbiBzaG91bGQgYmUgc3RpY2t5IHBvc2l0aW9uZWQgb24gdGhlIGVuZCBvZiB0aGUgcm93ICovXG4gIEBJbnB1dCgpIHN0aWNreUVuZDogYm9vbGVhbjtcbn1cblxuLyoqIEhlYWRlciBjZWxsIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGFkZHMgdGhlIHJpZ2h0IGNsYXNzZXMgYW5kIHJvbGUuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtaGVhZGVyLWNlbGwsIHRoW21hdC1oZWFkZXItY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1oZWFkZXItY2VsbCcsXG4gICAgJ3JvbGUnOiAnY29sdW1uaGVhZGVyJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyQ2VsbCBleHRlbmRzIENka0hlYWRlckNlbGwge1xuICBjb25zdHJ1Y3Rvcihjb2x1bW5EZWY6IENka0NvbHVtbkRlZixcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzdXBlcihjb2x1bW5EZWYsIGVsZW1lbnRSZWYpO1xuICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtY29sdW1uLSR7Y29sdW1uRGVmLmNzc0NsYXNzRnJpZW5kbHlOYW1lfWApO1xuICB9XG59XG5cbi8qKiBGb290ZXIgY2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvb3Rlci1jZWxsLCB0ZFttYXQtZm9vdGVyLWNlbGxdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZm9vdGVyLWNlbGwnLFxuICAgICdyb2xlJzogJ2dyaWRjZWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyQ2VsbCBleHRlbmRzIENka0Zvb3RlckNlbGwge1xuICBjb25zdHJ1Y3Rvcihjb2x1bW5EZWY6IENka0NvbHVtbkRlZixcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKGNvbHVtbkRlZiwgZWxlbWVudFJlZik7XG4gICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1jb2x1bW4tJHtjb2x1bW5EZWYuY3NzQ2xhc3NGcmllbmRseU5hbWV9YCk7XG4gIH1cbn1cblxuLyoqIENlbGwgdGVtcGxhdGUgY29udGFpbmVyIHRoYXQgYWRkcyB0aGUgcmlnaHQgY2xhc3NlcyBhbmQgcm9sZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jZWxsLCB0ZFttYXQtY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jZWxsJyxcbiAgICAncm9sZSc6ICdncmlkY2VsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENlbGwgZXh0ZW5kcyBDZGtDZWxsIHtcbiAgY29uc3RydWN0b3IoY29sdW1uRGVmOiBDZGtDb2x1bW5EZWYsXG4gICAgICAgICAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgc3VwZXIoY29sdW1uRGVmLCBlbGVtZW50UmVmKTtcbiAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWNvbHVtbi0ke2NvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZX1gKTtcbiAgfVxufVxuIl19