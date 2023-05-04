/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_ROW_TEMPLATE, CdkFooterRow, CdkFooterRowDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef, CdkNoDataRow, } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
class MatHeaderRowDef extends CdkHeaderRowDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatHeaderRowDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatHeaderRowDef, selector: "[matHeaderRowDef]", inputs: { columns: ["matHeaderRowDef", "columns"], sticky: ["matHeaderRowDefSticky", "sticky"] }, providers: [{ provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef }], usesInheritance: true, ngImport: i0 }); }
}
export { MatHeaderRowDef };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatHeaderRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matHeaderRowDef]',
                    providers: [{ provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef }],
                    inputs: ['columns: matHeaderRowDef', 'sticky: matHeaderRowDefSticky'],
                }]
        }] });
/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
class MatFooterRowDef extends CdkFooterRowDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFooterRowDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatFooterRowDef, selector: "[matFooterRowDef]", inputs: { columns: ["matFooterRowDef", "columns"], sticky: ["matFooterRowDefSticky", "sticky"] }, providers: [{ provide: CdkFooterRowDef, useExisting: MatFooterRowDef }], usesInheritance: true, ngImport: i0 }); }
}
export { MatFooterRowDef };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFooterRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matFooterRowDef]',
                    providers: [{ provide: CdkFooterRowDef, useExisting: MatFooterRowDef }],
                    inputs: ['columns: matFooterRowDef', 'sticky: matFooterRowDefSticky'],
                }]
        }] });
/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
class MatRowDef extends CdkRowDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatRowDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatRowDef, selector: "[matRowDef]", inputs: { columns: ["matRowDefColumns", "columns"], when: ["matRowDefWhen", "when"] }, providers: [{ provide: CdkRowDef, useExisting: MatRowDef }], usesInheritance: true, ngImport: i0 }); }
}
export { MatRowDef };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matRowDef]',
                    providers: [{ provide: CdkRowDef, useExisting: MatRowDef }],
                    inputs: ['columns: matRowDefColumns', 'when: matRowDefWhen'],
                }]
        }] });
/** Footer template container that contains the cell outlet. Adds the right class and role. */
class MatHeaderRow extends CdkHeaderRow {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatHeaderRow, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatHeaderRow, selector: "mat-header-row, tr[mat-header-row]", host: { attributes: { "role": "row" }, classAttribute: "mat-mdc-header-row mdc-data-table__header-row" }, providers: [{ provide: CdkHeaderRow, useExisting: MatHeaderRow }], exportAs: ["matHeaderRow"], usesInheritance: true, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, dependencies: [{ kind: "directive", type: i1.CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatHeaderRow };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatHeaderRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-header-row, tr[mat-header-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-mdc-header-row mdc-data-table__header-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matHeaderRow',
                    providers: [{ provide: CdkHeaderRow, useExisting: MatHeaderRow }],
                }]
        }] });
/** Footer template container that contains the cell outlet. Adds the right class and role. */
class MatFooterRow extends CdkFooterRow {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFooterRow, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatFooterRow, selector: "mat-footer-row, tr[mat-footer-row]", host: { attributes: { "role": "row" }, classAttribute: "mat-mdc-footer-row mdc-data-table__row" }, providers: [{ provide: CdkFooterRow, useExisting: MatFooterRow }], exportAs: ["matFooterRow"], usesInheritance: true, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, dependencies: [{ kind: "directive", type: i1.CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatFooterRow };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFooterRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-footer-row, tr[mat-footer-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-mdc-footer-row mdc-data-table__row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matFooterRow',
                    providers: [{ provide: CdkFooterRow, useExisting: MatFooterRow }],
                }]
        }] });
/** Data row template container that contains the cell outlet. Adds the right class and role. */
class MatRow extends CdkRow {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatRow, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatRow, selector: "mat-row, tr[mat-row]", host: { attributes: { "role": "row" }, classAttribute: "mat-mdc-row mdc-data-table__row" }, providers: [{ provide: CdkRow, useExisting: MatRow }], exportAs: ["matRow"], usesInheritance: true, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, dependencies: [{ kind: "directive", type: i1.CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatRow };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-row, tr[mat-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-mdc-row mdc-data-table__row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matRow',
                    providers: [{ provide: CdkRow, useExisting: MatRow }],
                }]
        }] });
/** Row that can be used to display a message when no data is shown in the table. */
class MatNoDataRow extends CdkNoDataRow {
    constructor() {
        super(...arguments);
        this._contentClassName = 'mat-mdc-no-data-row';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatNoDataRow, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatNoDataRow, selector: "ng-template[matNoDataRow]", providers: [{ provide: CdkNoDataRow, useExisting: MatNoDataRow }], usesInheritance: true, ngImport: i0 }); }
}
export { MatNoDataRow };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatNoDataRow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matNoDataRow]',
                    providers: [{ provide: CdkNoDataRow, useExisting: MatNoDataRow }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3Jvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLFlBQVksRUFDWixlQUFlLEVBQ2YsWUFBWSxFQUNaLGVBQWUsRUFDZixNQUFNLEVBQ04sU0FBUyxFQUNULFlBQVksR0FDYixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDOzs7QUFFL0Y7OztHQUdHO0FBQ0gsTUFLYSxlQUFnQixTQUFRLGVBQWU7OEdBQXZDLGVBQWU7a0dBQWYsZUFBZSw4SUFIZixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFDLENBQUM7O1NBRzFELGVBQWU7MkZBQWYsZUFBZTtrQkFMM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxpQkFBaUIsRUFBQyxDQUFDO29CQUNyRSxNQUFNLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSwrQkFBK0IsQ0FBQztpQkFDdEU7O0FBR0Q7OztHQUdHO0FBQ0gsTUFLYSxlQUFnQixTQUFRLGVBQWU7OEdBQXZDLGVBQWU7a0dBQWYsZUFBZSw4SUFIZixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFDLENBQUM7O1NBRzFELGVBQWU7MkZBQWYsZUFBZTtrQkFMM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxpQkFBaUIsRUFBQyxDQUFDO29C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WUFBWTtJQUo5Qzs7UUFLVyxzQkFBaUIsR0FBRyxxQkFBcUIsQ0FBQztLQUNwRDs4R0FGWSxZQUFZO2tHQUFaLFlBQVksb0RBRlosQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBQyxDQUFDOztTQUVwRCxZQUFZOzJGQUFaLFlBQVk7a0JBSnhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsY0FBYyxFQUFDLENBQUM7aUJBQ2hFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENES19ST1dfVEVNUExBVEUsXG4gIENka0Zvb3RlclJvdyxcbiAgQ2RrRm9vdGVyUm93RGVmLFxuICBDZGtIZWFkZXJSb3csXG4gIENka0hlYWRlclJvd0RlZixcbiAgQ2RrUm93LFxuICBDZGtSb3dEZWYsXG4gIENka05vRGF0YVJvdyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRGlyZWN0aXZlLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSGVhZGVyIHJvdyBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIGhlYWRlciByb3cncyB0ZW1wbGF0ZSBhbmQgb3RoZXIgaGVhZGVyIHByb3BlcnRpZXMgc3VjaCBhcyB0aGUgY29sdW1ucyB0byBkaXNwbGF5LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0SGVhZGVyUm93RGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtIZWFkZXJSb3dEZWYsIHVzZUV4aXN0aW5nOiBNYXRIZWFkZXJSb3dEZWZ9XSxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IG1hdEhlYWRlclJvd0RlZicsICdzdGlja3k6IG1hdEhlYWRlclJvd0RlZlN0aWNreSddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJSb3dEZWYgZXh0ZW5kcyBDZGtIZWFkZXJSb3dEZWYge31cblxuLyoqXG4gKiBGb290ZXIgcm93IGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgZm9vdGVyIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciBmb290ZXIgcHJvcGVydGllcyBzdWNoIGFzIHRoZSBjb2x1bW5zIHRvIGRpc3BsYXkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRGb290ZXJSb3dEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0Zvb3RlclJvd0RlZiwgdXNlRXhpc3Rpbmc6IE1hdEZvb3RlclJvd0RlZn1dLFxuICBpbnB1dHM6IFsnY29sdW1uczogbWF0Rm9vdGVyUm93RGVmJywgJ3N0aWNreTogbWF0Rm9vdGVyUm93RGVmU3RpY2t5J10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvb3RlclJvd0RlZiBleHRlbmRzIENka0Zvb3RlclJvd0RlZiB7fVxuXG4vKipcbiAqIERhdGEgcm93IGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgZGF0YSByb3cncyB0ZW1wbGF0ZSBhbmQgb3RoZXIgcHJvcGVydGllcyBzdWNoIGFzIHRoZSBjb2x1bW5zIHRvIGRpc3BsYXkgYW5kXG4gKiBhIHdoZW4gcHJlZGljYXRlIHRoYXQgZGVzY3JpYmVzIHdoZW4gdGhpcyByb3cgc2hvdWxkIGJlIHVzZWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRSb3dEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1Jvd0RlZiwgdXNlRXhpc3Rpbmc6IE1hdFJvd0RlZn1dLFxuICBpbnB1dHM6IFsnY29sdW1uczogbWF0Um93RGVmQ29sdW1ucycsICd3aGVuOiBtYXRSb3dEZWZXaGVuJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJvd0RlZjxUPiBleHRlbmRzIENka1Jvd0RlZjxUPiB7fVxuXG4vKiogRm9vdGVyIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBjZWxsIG91dGxldC4gQWRkcyB0aGUgcmlnaHQgY2xhc3MgYW5kIHJvbGUuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtaGVhZGVyLXJvdywgdHJbbWF0LWhlYWRlci1yb3ddJyxcbiAgdGVtcGxhdGU6IENES19ST1dfVEVNUExBVEUsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1oZWFkZXItcm93IG1kYy1kYXRhLXRhYmxlX19oZWFkZXItcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0SGVhZGVyUm93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlclJvdywgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlclJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJSb3cgZXh0ZW5kcyBDZGtIZWFkZXJSb3cge31cblxuLyoqIEZvb3RlciB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvb3Rlci1yb3csIHRyW21hdC1mb290ZXItcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtZm9vdGVyLXJvdyBtZGMtZGF0YS10YWJsZV9fcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0Rm9vdGVyUm93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0Zvb3RlclJvdywgdXNlRXhpc3Rpbmc6IE1hdEZvb3RlclJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJSb3cgZXh0ZW5kcyBDZGtGb290ZXJSb3cge31cblxuLyoqIERhdGEgcm93IHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBjZWxsIG91dGxldC4gQWRkcyB0aGUgcmlnaHQgY2xhc3MgYW5kIHJvbGUuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcm93LCB0clttYXQtcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtcm93IG1kYy1kYXRhLXRhYmxlX19yb3cnLFxuICAgICdyb2xlJzogJ3JvdycsXG4gIH0sXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRSb3cnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrUm93LCB1c2VFeGlzdGluZzogTWF0Um93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJvdyBleHRlbmRzIENka1JvdyB7fVxuXG4vKiogUm93IHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBhIG1lc3NhZ2Ugd2hlbiBubyBkYXRhIGlzIHNob3duIGluIHRoZSB0YWJsZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdE5vRGF0YVJvd10nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrTm9EYXRhUm93LCB1c2VFeGlzdGluZzogTWF0Tm9EYXRhUm93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE5vRGF0YVJvdyBleHRlbmRzIENka05vRGF0YVJvdyB7XG4gIG92ZXJyaWRlIF9jb250ZW50Q2xhc3NOYW1lID0gJ21hdC1tZGMtbm8tZGF0YS1yb3cnO1xufVxuIl19