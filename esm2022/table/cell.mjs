/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
import { CdkCell, CdkCellDef, CdkColumnDef, CdkFooterCell, CdkFooterCellDef, CdkHeaderCell, CdkHeaderCellDef, } from '@angular/cdk/table';
import * as i0 from "@angular/core";
/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
export class MatCellDef extends CdkCellDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatCellDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatCellDef, isStandalone: true, selector: "[matCellDef]", providers: [{ provide: CdkCellDef, useExisting: MatCellDef }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatCellDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matCellDef]',
                    providers: [{ provide: CdkCellDef, useExisting: MatCellDef }],
                    standalone: true,
                }]
        }] });
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
export class MatHeaderCellDef extends CdkHeaderCellDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatHeaderCellDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatHeaderCellDef, isStandalone: true, selector: "[matHeaderCellDef]", providers: [{ provide: CdkHeaderCellDef, useExisting: MatHeaderCellDef }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatHeaderCellDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matHeaderCellDef]',
                    providers: [{ provide: CdkHeaderCellDef, useExisting: MatHeaderCellDef }],
                    standalone: true,
                }]
        }] });
/**
 * Footer cell definition for the mat-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
export class MatFooterCellDef extends CdkFooterCellDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatFooterCellDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatFooterCellDef, isStandalone: true, selector: "[matFooterCellDef]", providers: [{ provide: CdkFooterCellDef, useExisting: MatFooterCellDef }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatFooterCellDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matFooterCellDef]',
                    providers: [{ provide: CdkFooterCellDef, useExisting: MatFooterCellDef }],
                    standalone: true,
                }]
        }] });
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
export class MatColumnDef extends CdkColumnDef {
    /** Unique name for this column. */
    get name() {
        return this._name;
    }
    set name(name) {
        this._setNameInput(name);
    }
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatColumnDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatColumnDef, isStandalone: true, selector: "[matColumnDef]", inputs: { sticky: "sticky", name: ["matColumnDef", "name"] }, providers: [
            { provide: CdkColumnDef, useExisting: MatColumnDef },
            { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: MatColumnDef },
        ], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatColumnDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matColumnDef]',
                    inputs: ['sticky'],
                    providers: [
                        { provide: CdkColumnDef, useExisting: MatColumnDef },
                        { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: MatColumnDef },
                    ],
                    standalone: true,
                }]
        }], propDecorators: { name: [{
                type: Input,
                args: ['matColumnDef']
            }] } });
/** Header cell template container that adds the right classes and role. */
export class MatHeaderCell extends CdkHeaderCell {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatHeaderCell, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatHeaderCell, isStandalone: true, selector: "mat-header-cell, th[mat-header-cell]", host: { attributes: { "role": "columnheader" }, classAttribute: "mat-mdc-header-cell mdc-data-table__header-cell" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatHeaderCell, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-header-cell, th[mat-header-cell]',
                    host: {
                        'class': 'mat-mdc-header-cell mdc-data-table__header-cell',
                        'role': 'columnheader',
                    },
                    standalone: true,
                }]
        }] });
/** Footer cell template container that adds the right classes and role. */
export class MatFooterCell extends CdkFooterCell {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatFooterCell, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatFooterCell, isStandalone: true, selector: "mat-footer-cell, td[mat-footer-cell]", host: { classAttribute: "mat-mdc-footer-cell mdc-data-table__cell" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatFooterCell, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-footer-cell, td[mat-footer-cell]',
                    host: {
                        'class': 'mat-mdc-footer-cell mdc-data-table__cell',
                    },
                    standalone: true,
                }]
        }] });
/** Cell template container that adds the right classes and role. */
export class MatCell extends CdkCell {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatCell, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatCell, isStandalone: true, selector: "mat-cell, td[mat-cell]", host: { classAttribute: "mat-mdc-cell mdc-data-table__cell" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatCell, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-cell, td[mat-cell]',
                    host: {
                        'class': 'mat-mdc-cell mdc-data-table__cell',
                    },
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS9jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixnQkFBZ0IsR0FDakIsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFNUI7OztHQUdHO0FBTUgsTUFBTSxPQUFPLFVBQVcsU0FBUSxVQUFVOzhHQUE3QixVQUFVO2tHQUFWLFVBQVUsMkRBSFYsQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBQyxDQUFDOzsyRkFHaEQsVUFBVTtrQkFMdEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsWUFBWSxFQUFDLENBQUM7b0JBQzNELFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7QUFHRDs7O0dBR0c7QUFNSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCOzhHQUF6QyxnQkFBZ0I7a0dBQWhCLGdCQUFnQixpRUFIaEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzs7MkZBRzVELGdCQUFnQjtrQkFMNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLGtCQUFrQixFQUFDLENBQUM7b0JBQ3ZFLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7QUFHRDs7O0dBR0c7QUFNSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCOzhHQUF6QyxnQkFBZ0I7a0dBQWhCLGdCQUFnQixpRUFIaEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzs7MkZBRzVELGdCQUFnQjtrQkFMNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLGtCQUFrQixFQUFDLENBQUM7b0JBQ3ZFLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7QUFHRDs7O0dBR0c7QUFVSCxNQUFNLE9BQU8sWUFBYSxTQUFRLFlBQVk7SUFDNUMsbUNBQW1DO0lBQ25DLElBQ2EsSUFBSTtRQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBYSxJQUFJLENBQUMsSUFBWTtRQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNnQix5QkFBeUI7UUFDMUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLG1CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQzs4R0FuQlUsWUFBWTtrR0FBWixZQUFZLDJIQU5aO1lBQ1QsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUM7WUFDbEQsRUFBQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBQztTQUNuRTs7MkZBR1UsWUFBWTtrQkFUeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ2xCLFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxjQUFjLEVBQUM7d0JBQ2xELEVBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLFdBQVcsY0FBYyxFQUFDO3FCQUNuRTtvQkFDRCxVQUFVLEVBQUUsSUFBSTtpQkFDakI7OEJBSWMsSUFBSTtzQkFEaEIsS0FBSzt1QkFBQyxjQUFjOztBQW9CdkIsMkVBQTJFO0FBUzNFLE1BQU0sT0FBTyxhQUFjLFNBQVEsYUFBYTs4R0FBbkMsYUFBYTtrR0FBYixhQUFhOzsyRkFBYixhQUFhO2tCQVJ6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQ0FBc0M7b0JBQ2hELElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsaURBQWlEO3dCQUMxRCxNQUFNLEVBQUUsY0FBYztxQkFDdkI7b0JBQ0QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOztBQUdELDJFQUEyRTtBQVEzRSxNQUFNLE9BQU8sYUFBYyxTQUFRLGFBQWE7OEdBQW5DLGFBQWE7a0dBQWIsYUFBYTs7MkZBQWIsYUFBYTtrQkFQekIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0NBQXNDO29CQUNoRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLDBDQUEwQztxQkFDcEQ7b0JBQ0QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOztBQUdELG9FQUFvRTtBQVFwRSxNQUFNLE9BQU8sT0FBUSxTQUFRLE9BQU87OEdBQXZCLE9BQU87a0dBQVAsT0FBTzs7MkZBQVAsT0FBTztrQkFQbkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLG1DQUFtQztxQkFDN0M7b0JBQ0QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDZGtDZWxsLFxuICBDZGtDZWxsRGVmLFxuICBDZGtDb2x1bW5EZWYsXG4gIENka0Zvb3RlckNlbGwsXG4gIENka0Zvb3RlckNlbGxEZWYsXG4gIENka0hlYWRlckNlbGwsXG4gIENka0hlYWRlckNlbGxEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5cbi8qKlxuICogQ2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgZGF0YSByb3cgY2VsbCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0NlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRDZWxsRGVmfV0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENlbGxEZWYgZXh0ZW5kcyBDZGtDZWxsRGVmIHt9XG5cbi8qKlxuICogSGVhZGVyIGNlbGwgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSB0ZW1wbGF0ZSBvZiBhIGNvbHVtbidzIGhlYWRlciBjZWxsIGFuZCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEhlYWRlckNlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlckNlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRIZWFkZXJDZWxsRGVmfV0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEhlYWRlckNlbGxEZWYgZXh0ZW5kcyBDZGtIZWFkZXJDZWxsRGVmIHt9XG5cbi8qKlxuICogRm9vdGVyIGNlbGwgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSB0ZW1wbGF0ZSBvZiBhIGNvbHVtbidzIGZvb3RlciBjZWxsIGFuZCBhcyB3ZWxsIGFzIGNlbGwtc3BlY2lmaWMgcHJvcGVydGllcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEZvb3RlckNlbGxEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0Zvb3RlckNlbGxEZWYsIHVzZUV4aXN0aW5nOiBNYXRGb290ZXJDZWxsRGVmfV0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvb3RlckNlbGxEZWYgZXh0ZW5kcyBDZGtGb290ZXJDZWxsRGVmIHt9XG5cbi8qKlxuICogQ29sdW1uIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBEZWZpbmVzIGEgc2V0IG9mIGNlbGxzIGF2YWlsYWJsZSBmb3IgYSB0YWJsZSBjb2x1bW4uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDb2x1bW5EZWZdJyxcbiAgaW5wdXRzOiBbJ3N0aWNreSddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrQ29sdW1uRGVmLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uRGVmfSxcbiAgICB7cHJvdmlkZTogJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJywgdXNlRXhpc3Rpbmc6IE1hdENvbHVtbkRlZn0sXG4gIF0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbHVtbkRlZiBleHRlbmRzIENka0NvbHVtbkRlZiB7XG4gIC8qKiBVbmlxdWUgbmFtZSBmb3IgdGhpcyBjb2x1bW4uICovXG4gIEBJbnB1dCgnbWF0Q29sdW1uRGVmJylcbiAgb3ZlcnJpZGUgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuICBvdmVycmlkZSBzZXQgbmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zZXROYW1lSW5wdXQobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIFwibWF0LWNvbHVtbi1cIiBwcmVmaXggaW4gYWRkaXRpb24gdG8gXCJjZGstY29sdW1uLVwiIHByZWZpeC5cbiAgICogSW4gdGhlIGZ1dHVyZSwgdGhpcyB3aWxsIG9ubHkgYWRkIFwibWF0LWNvbHVtbi1cIiBhbmQgY29sdW1uQ3NzQ2xhc3NOYW1lXG4gICAqIHdpbGwgY2hhbmdlIGZyb20gdHlwZSBzdHJpbmdbXSB0byBzdHJpbmcuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfdXBkYXRlQ29sdW1uQ3NzQ2xhc3NOYW1lKCkge1xuICAgIHN1cGVyLl91cGRhdGVDb2x1bW5Dc3NDbGFzc05hbWUoKTtcbiAgICB0aGlzLl9jb2x1bW5Dc3NDbGFzc05hbWUhLnB1c2goYG1hdC1jb2x1bW4tJHt0aGlzLmNzc0NsYXNzRnJpZW5kbHlOYW1lfWApO1xuICB9XG59XG5cbi8qKiBIZWFkZXIgY2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWhlYWRlci1jZWxsLCB0aFttYXQtaGVhZGVyLWNlbGxdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWhlYWRlci1jZWxsIG1kYy1kYXRhLXRhYmxlX19oZWFkZXItY2VsbCcsXG4gICAgJ3JvbGUnOiAnY29sdW1uaGVhZGVyJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyQ2VsbCBleHRlbmRzIENka0hlYWRlckNlbGwge31cblxuLyoqIEZvb3RlciBjZWxsIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGFkZHMgdGhlIHJpZ2h0IGNsYXNzZXMgYW5kIHJvbGUuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9vdGVyLWNlbGwsIHRkW21hdC1mb290ZXItY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtZm9vdGVyLWNlbGwgbWRjLWRhdGEtdGFibGVfX2NlbGwnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJDZWxsIGV4dGVuZHMgQ2RrRm9vdGVyQ2VsbCB7fVxuXG4vKiogQ2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNlbGwsIHRkW21hdC1jZWxsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1jZWxsIG1kYy1kYXRhLXRhYmxlX19jZWxsJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbCBleHRlbmRzIENka0NlbGwge31cbiJdfQ==