/**
 * @fileoverview added by tsickle
 * Generated from: src/material/table/cell.ts
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
let MatCellDef = /** @class */ (() => {
    /**
     * Cell definition for the mat-table.
     * Captures the template of a column's data row cell as well as cell-specific properties.
     */
    class MatCellDef extends CdkCellDef {
    }
    MatCellDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matCellDef]',
                    providers: [{ provide: CdkCellDef, useExisting: MatCellDef }]
                },] }
    ];
    return MatCellDef;
})();
export { MatCellDef };
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
let MatHeaderCellDef = /** @class */ (() => {
    /**
     * Header cell definition for the mat-table.
     * Captures the template of a column's header cell and as well as cell-specific properties.
     */
    class MatHeaderCellDef extends CdkHeaderCellDef {
    }
    MatHeaderCellDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matHeaderCellDef]',
                    providers: [{ provide: CdkHeaderCellDef, useExisting: MatHeaderCellDef }]
                },] }
    ];
    return MatHeaderCellDef;
})();
export { MatHeaderCellDef };
/**
 * Footer cell definition for the mat-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
let MatFooterCellDef = /** @class */ (() => {
    /**
     * Footer cell definition for the mat-table.
     * Captures the template of a column's footer cell and as well as cell-specific properties.
     */
    class MatFooterCellDef extends CdkFooterCellDef {
    }
    MatFooterCellDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matFooterCellDef]',
                    providers: [{ provide: CdkFooterCellDef, useExisting: MatFooterCellDef }]
                },] }
    ];
    return MatFooterCellDef;
})();
export { MatFooterCellDef };
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
let MatColumnDef = /** @class */ (() => {
    /**
     * Column definition for the mat-table.
     * Defines a set of cells available for a table column.
     */
    class MatColumnDef extends CdkColumnDef {
    }
    MatColumnDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matColumnDef]',
                    inputs: ['sticky'],
                    providers: [
                        { provide: CdkColumnDef, useExisting: MatColumnDef },
                        { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: MatColumnDef }
                    ],
                },] }
    ];
    MatColumnDef.propDecorators = {
        name: [{ type: Input, args: ['matColumnDef',] }]
    };
    return MatColumnDef;
})();
export { MatColumnDef };
if (false) {
    /** @type {?} */
    MatColumnDef.ngAcceptInputType_sticky;
    /**
     * Unique name for this column.
     * @type {?}
     */
    MatColumnDef.prototype.name;
}
/**
 * Header cell template container that adds the right classes and role.
 */
let MatHeaderCell = /** @class */ (() => {
    /**
     * Header cell template container that adds the right classes and role.
     */
    class MatHeaderCell extends CdkHeaderCell {
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
    return MatHeaderCell;
})();
export { MatHeaderCell };
/**
 * Footer cell template container that adds the right classes and role.
 */
let MatFooterCell = /** @class */ (() => {
    /**
     * Footer cell template container that adds the right classes and role.
     */
    class MatFooterCell extends CdkFooterCell {
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
    return MatFooterCell;
})();
export { MatFooterCell };
/**
 * Cell template container that adds the right classes and role.
 */
let MatCell = /** @class */ (() => {
    /**
     * Cell template container that adds the right classes and role.
     */
    class MatCell extends CdkCell {
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
    return MatCell;
})();
export { MatCell };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS9jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVNBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFDVixZQUFZLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUM3QyxhQUFhLEVBQ2IsZ0JBQWdCLEdBQ2pCLE1BQU0sb0JBQW9CLENBQUM7Ozs7O0FBTTVCOzs7OztJQUFBLE1BSWEsVUFBVyxTQUFRLFVBQVU7OztnQkFKekMsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBQyxDQUFDO2lCQUM1RDs7SUFDMkMsaUJBQUM7S0FBQTtTQUFoQyxVQUFVOzs7OztBQU12Qjs7Ozs7SUFBQSxNQUlhLGdCQUFpQixTQUFRLGdCQUFnQjs7O2dCQUpyRCxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFDLENBQUM7aUJBQ3hFOztJQUN1RCx1QkFBQztLQUFBO1NBQTVDLGdCQUFnQjs7Ozs7QUFNN0I7Ozs7O0lBQUEsTUFJYSxnQkFBaUIsU0FBUSxnQkFBZ0I7OztnQkFKckQsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO2lCQUN4RTs7SUFDdUQsdUJBQUM7S0FBQTtTQUE1QyxnQkFBZ0I7Ozs7O0FBTTdCOzs7OztJQUFBLE1BUWEsWUFBYSxTQUFRLFlBQVk7OztnQkFSN0MsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFDbEIsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO3dCQUNsRCxFQUFDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO3FCQUNuRTtpQkFDRjs7O3VCQUdFLEtBQUssU0FBQyxjQUFjOztJQUd2QixtQkFBQztLQUFBO1NBTFksWUFBWTs7O0lBSXZCLHNDQUE4Qzs7Ozs7SUFGOUMsNEJBQW9DOzs7OztBQU10Qzs7OztJQUFBLE1BT2EsYUFBYyxTQUFRLGFBQWE7Ozs7O1FBQzlDLFlBQVksU0FBdUIsRUFDdkIsVUFBbUM7WUFDN0MsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM3QixVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxTQUFTLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLENBQUM7OztnQkFaRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNDQUFzQztvQkFDaEQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLE1BQU0sRUFBRSxjQUFjO3FCQUN2QjtpQkFDRjs7OztnQkE3REMsWUFBWTtnQkFKSyxVQUFVOztJQXdFN0Isb0JBQUM7S0FBQTtTQU5ZLGFBQWE7Ozs7QUFTMUI7Ozs7SUFBQSxNQU9hLGFBQWMsU0FBUSxhQUFhOzs7OztRQUM5QyxZQUFZLFNBQXVCLEVBQ3ZCLFVBQXNCO1lBQ2hDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDN0IsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUN6RixDQUFDOzs7Z0JBWkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQ0FBc0M7b0JBQ2hELElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixNQUFNLEVBQUUsVUFBVTtxQkFDbkI7aUJBQ0Y7Ozs7Z0JBN0VDLFlBQVk7Z0JBSkssVUFBVTs7SUF3RjdCLG9CQUFDO0tBQUE7U0FOWSxhQUFhOzs7O0FBUzFCOzs7O0lBQUEsTUFPYSxPQUFRLFNBQVEsT0FBTzs7Ozs7UUFDbEMsWUFBWSxTQUF1QixFQUN2QixVQUFtQztZQUM3QyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7UUFDekYsQ0FBQzs7O2dCQVpGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFVBQVU7d0JBQ25CLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRjs7OztnQkE3RkMsWUFBWTtnQkFKSyxVQUFVOztJQXdHN0IsY0FBQztLQUFBO1NBTlksT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDZGtDZWxsLFxuICBDZGtDZWxsRGVmLFxuICBDZGtDb2x1bW5EZWYsIENka0Zvb3RlckNlbGwsIENka0Zvb3RlckNlbGxEZWYsXG4gIENka0hlYWRlckNlbGwsXG4gIENka0hlYWRlckNlbGxEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5cbi8qKlxuICogQ2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgZGF0YSByb3cgY2VsbCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0NlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRDZWxsRGVmfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbERlZiBleHRlbmRzIENka0NlbGxEZWYge31cblxuLyoqXG4gKiBIZWFkZXIgY2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgaGVhZGVyIGNlbGwgYW5kIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0SGVhZGVyQ2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrSGVhZGVyQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlckNlbGxEZWZ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJDZWxsRGVmIGV4dGVuZHMgQ2RrSGVhZGVyQ2VsbERlZiB7fVxuXG4vKipcbiAqIEZvb3RlciBjZWxsIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgdGVtcGxhdGUgb2YgYSBjb2x1bW4ncyBmb290ZXIgY2VsbCBhbmQgYXMgd2VsbCBhcyBjZWxsLXNwZWNpZmljIHByb3BlcnRpZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRGb290ZXJDZWxsRGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtGb290ZXJDZWxsRGVmLCB1c2VFeGlzdGluZzogTWF0Rm9vdGVyQ2VsbERlZn1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvb3RlckNlbGxEZWYgZXh0ZW5kcyBDZGtGb290ZXJDZWxsRGVmIHt9XG5cbi8qKlxuICogQ29sdW1uIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBEZWZpbmVzIGEgc2V0IG9mIGNlbGxzIGF2YWlsYWJsZSBmb3IgYSB0YWJsZSBjb2x1bW4uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDb2x1bW5EZWZdJyxcbiAgaW5wdXRzOiBbJ3N0aWNreSddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrQ29sdW1uRGVmLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uRGVmfSxcbiAgICB7cHJvdmlkZTogJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJywgdXNlRXhpc3Rpbmc6IE1hdENvbHVtbkRlZn1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uRGVmIGV4dGVuZHMgQ2RrQ29sdW1uRGVmIHtcbiAgLyoqIFVuaXF1ZSBuYW1lIGZvciB0aGlzIGNvbHVtbi4gKi9cbiAgQElucHV0KCdtYXRDb2x1bW5EZWYnKSBuYW1lOiBzdHJpbmc7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0aWNreTogQm9vbGVhbklucHV0O1xufVxuXG4vKiogSGVhZGVyIGNlbGwgdGVtcGxhdGUgY29udGFpbmVyIHRoYXQgYWRkcyB0aGUgcmlnaHQgY2xhc3NlcyBhbmQgcm9sZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oZWFkZXItY2VsbCwgdGhbbWF0LWhlYWRlci1jZWxsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWhlYWRlci1jZWxsJyxcbiAgICAncm9sZSc6ICdjb2x1bW5oZWFkZXInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJDZWxsIGV4dGVuZHMgQ2RrSGVhZGVyQ2VsbCB7XG4gIGNvbnN0cnVjdG9yKGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHN1cGVyKGNvbHVtbkRlZiwgZWxlbWVudFJlZik7XG4gICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1jb2x1bW4tJHtjb2x1bW5EZWYuY3NzQ2xhc3NGcmllbmRseU5hbWV9YCk7XG4gIH1cbn1cblxuLyoqIEZvb3RlciBjZWxsIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGFkZHMgdGhlIHJpZ2h0IGNsYXNzZXMgYW5kIHJvbGUuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9vdGVyLWNlbGwsIHRkW21hdC1mb290ZXItY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb290ZXItY2VsbCcsXG4gICAgJ3JvbGUnOiAnZ3JpZGNlbGwnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJDZWxsIGV4dGVuZHMgQ2RrRm9vdGVyQ2VsbCB7XG4gIGNvbnN0cnVjdG9yKGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoY29sdW1uRGVmLCBlbGVtZW50UmVmKTtcbiAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWNvbHVtbi0ke2NvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZX1gKTtcbiAgfVxufVxuXG4vKiogQ2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNlbGwsIHRkW21hdC1jZWxsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNlbGwnLFxuICAgICdyb2xlJzogJ2dyaWRjZWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbCBleHRlbmRzIENka0NlbGwge1xuICBjb25zdHJ1Y3Rvcihjb2x1bW5EZWY6IENka0NvbHVtbkRlZixcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzdXBlcihjb2x1bW5EZWYsIGVsZW1lbnRSZWYpO1xuICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtY29sdW1uLSR7Y29sdW1uRGVmLmNzc0NsYXNzRnJpZW5kbHlOYW1lfWApO1xuICB9XG59XG4iXX0=