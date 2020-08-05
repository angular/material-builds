/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
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
    /**
     * Add "mat-column-" prefix in addition to "cdk-column-" prefix.
     * In the future, this will only add "mat-column-" and columnCssClassName
     * will change from type string[] to string.
     * @docs-private
     */
    _updateColumnCssClassName() {
        super._updateColumnCssClassName();
        this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`);
    }
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
/** Header cell template container that adds the right classes and role. */
export class MatHeaderCell extends CdkHeaderCell {
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
/** Footer cell template container that adds the right classes and role. */
export class MatFooterCell extends CdkFooterCell {
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
/** Cell template container that adds the right classes and role. */
export class MatCell extends CdkCell {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS9jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQzdDLGFBQWEsRUFDYixnQkFBZ0IsR0FDakIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1Qjs7O0dBR0c7QUFLSCxNQUFNLE9BQU8sVUFBVyxTQUFRLFVBQVU7OztZQUp6QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUM7YUFDNUQ7O0FBR0Q7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUFnQjs7O1lBSnJELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzthQUN4RTs7QUFHRDs7O0dBR0c7QUFLSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCOzs7WUFKckQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO2FBQ3hFOztBQUdEOzs7R0FHRztBQVNILE1BQU0sT0FBTyxZQUFhLFNBQVEsWUFBWTtJQUk1Qzs7Ozs7T0FLRztJQUNPLHlCQUF5QjtRQUNqQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsbUJBQW9CLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztJQUM1RSxDQUFDOzs7WUFyQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDbEIsU0FBUyxFQUFFO29CQUNULEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO29CQUNsRCxFQUFDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO2lCQUNuRTthQUNGOzs7bUJBR0UsS0FBSyxTQUFDLGNBQWM7O0FBZ0J2QiwyRUFBMkU7QUFRM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxhQUFhOzs7WUFQL0MsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQ0FBc0M7Z0JBQ2hELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjs7QUFHRCwyRUFBMkU7QUFRM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxhQUFhOzs7WUFQL0MsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQ0FBc0M7Z0JBQ2hELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixNQUFNLEVBQUUsVUFBVTtpQkFDbkI7YUFDRjs7QUFHRCxvRUFBb0U7QUFRcEUsTUFBTSxPQUFPLE9BQVEsU0FBUSxPQUFPOzs7WUFQbkMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsVUFBVTtvQkFDbkIsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2RrQ2VsbCxcbiAgQ2RrQ2VsbERlZixcbiAgQ2RrQ29sdW1uRGVmLCBDZGtGb290ZXJDZWxsLCBDZGtGb290ZXJDZWxsRGVmLFxuICBDZGtIZWFkZXJDZWxsLFxuICBDZGtIZWFkZXJDZWxsRGVmLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuXG4vKipcbiAqIENlbGwgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSB0ZW1wbGF0ZSBvZiBhIGNvbHVtbidzIGRhdGEgcm93IGNlbGwgYXMgd2VsbCBhcyBjZWxsLXNwZWNpZmljIHByb3BlcnRpZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDZWxsRGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtDZWxsRGVmLCB1c2VFeGlzdGluZzogTWF0Q2VsbERlZn1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdENlbGxEZWYgZXh0ZW5kcyBDZGtDZWxsRGVmIHt9XG5cbi8qKlxuICogSGVhZGVyIGNlbGwgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSB0ZW1wbGF0ZSBvZiBhIGNvbHVtbidzIGhlYWRlciBjZWxsIGFuZCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEhlYWRlckNlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlckNlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRIZWFkZXJDZWxsRGVmfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyQ2VsbERlZiBleHRlbmRzIENka0hlYWRlckNlbGxEZWYge31cblxuLyoqXG4gKiBGb290ZXIgY2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgZm9vdGVyIGNlbGwgYW5kIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Rm9vdGVyQ2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrRm9vdGVyQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdEZvb3RlckNlbGxEZWZ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJDZWxsRGVmIGV4dGVuZHMgQ2RrRm9vdGVyQ2VsbERlZiB7fVxuXG4vKipcbiAqIENvbHVtbiBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogRGVmaW5lcyBhIHNldCBvZiBjZWxscyBhdmFpbGFibGUgZm9yIGEgdGFibGUgY29sdW1uLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Q29sdW1uRGVmXScsXG4gIGlucHV0czogWydzdGlja3knXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IENka0NvbHVtbkRlZiwgdXNlRXhpc3Rpbmc6IE1hdENvbHVtbkRlZn0sXG4gICAge3Byb3ZpZGU6ICdNQVRfU09SVF9IRUFERVJfQ09MVU1OX0RFRicsIHVzZUV4aXN0aW5nOiBNYXRDb2x1bW5EZWZ9XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbHVtbkRlZiBleHRlbmRzIENka0NvbHVtbkRlZiB7XG4gIC8qKiBVbmlxdWUgbmFtZSBmb3IgdGhpcyBjb2x1bW4uICovXG4gIEBJbnB1dCgnbWF0Q29sdW1uRGVmJykgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGQgXCJtYXQtY29sdW1uLVwiIHByZWZpeCBpbiBhZGRpdGlvbiB0byBcImNkay1jb2x1bW4tXCIgcHJlZml4LlxuICAgKiBJbiB0aGUgZnV0dXJlLCB0aGlzIHdpbGwgb25seSBhZGQgXCJtYXQtY29sdW1uLVwiIGFuZCBjb2x1bW5Dc3NDbGFzc05hbWVcbiAgICogd2lsbCBjaGFuZ2UgZnJvbSB0eXBlIHN0cmluZ1tdIHRvIHN0cmluZy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcHJvdGVjdGVkIF91cGRhdGVDb2x1bW5Dc3NDbGFzc05hbWUoKSB7XG4gICAgc3VwZXIuX3VwZGF0ZUNvbHVtbkNzc0NsYXNzTmFtZSgpO1xuICAgIHRoaXMuX2NvbHVtbkNzc0NsYXNzTmFtZSEucHVzaChgbWF0LWNvbHVtbi0ke3RoaXMuY3NzQ2xhc3NGcmllbmRseU5hbWV9YCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RpY2t5OiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKiBIZWFkZXIgY2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWhlYWRlci1jZWxsLCB0aFttYXQtaGVhZGVyLWNlbGxdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtaGVhZGVyLWNlbGwnLFxuICAgICdyb2xlJzogJ2NvbHVtbmhlYWRlcicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEhlYWRlckNlbGwgZXh0ZW5kcyBDZGtIZWFkZXJDZWxsIHt9XG5cbi8qKiBGb290ZXIgY2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvb3Rlci1jZWxsLCB0ZFttYXQtZm9vdGVyLWNlbGxdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZm9vdGVyLWNlbGwnLFxuICAgICdyb2xlJzogJ2dyaWRjZWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyQ2VsbCBleHRlbmRzIENka0Zvb3RlckNlbGwge31cblxuLyoqIENlbGwgdGVtcGxhdGUgY29udGFpbmVyIHRoYXQgYWRkcyB0aGUgcmlnaHQgY2xhc3NlcyBhbmQgcm9sZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jZWxsLCB0ZFttYXQtY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jZWxsJyxcbiAgICAncm9sZSc6ICdncmlkY2VsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENlbGwgZXh0ZW5kcyBDZGtDZWxsIHt9XG4iXX0=