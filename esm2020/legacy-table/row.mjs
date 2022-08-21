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
export class MatLegacyHeaderRowDef extends CdkHeaderRowDef {
}
MatLegacyHeaderRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyHeaderRowDef, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyHeaderRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyHeaderRowDef, selector: "[matHeaderRowDef]", inputs: { columns: ["matHeaderRowDef", "columns"], sticky: ["matHeaderRowDefSticky", "sticky"] }, providers: [{ provide: CdkHeaderRowDef, useExisting: MatLegacyHeaderRowDef }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyHeaderRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matHeaderRowDef]',
                    providers: [{ provide: CdkHeaderRowDef, useExisting: MatLegacyHeaderRowDef }],
                    inputs: ['columns: matHeaderRowDef', 'sticky: matHeaderRowDefSticky'],
                }]
        }] });
/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
export class MatLegacyFooterRowDef extends CdkFooterRowDef {
}
MatLegacyFooterRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyFooterRowDef, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyFooterRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyFooterRowDef, selector: "[matFooterRowDef]", inputs: { columns: ["matFooterRowDef", "columns"], sticky: ["matFooterRowDefSticky", "sticky"] }, providers: [{ provide: CdkFooterRowDef, useExisting: MatLegacyFooterRowDef }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyFooterRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matFooterRowDef]',
                    providers: [{ provide: CdkFooterRowDef, useExisting: MatLegacyFooterRowDef }],
                    inputs: ['columns: matFooterRowDef', 'sticky: matFooterRowDefSticky'],
                }]
        }] });
/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export class MatLegacyRowDef extends CdkRowDef {
}
MatLegacyRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyRowDef, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyRowDef, selector: "[matRowDef]", inputs: { columns: ["matRowDefColumns", "columns"], when: ["matRowDefWhen", "when"] }, providers: [{ provide: CdkRowDef, useExisting: MatLegacyRowDef }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matRowDef]',
                    providers: [{ provide: CdkRowDef, useExisting: MatLegacyRowDef }],
                    inputs: ['columns: matRowDefColumns', 'when: matRowDefWhen'],
                }]
        }] });
/** Header template container that contains the cell outlet. Adds the right class and role. */
export class MatLegacyHeaderRow extends CdkHeaderRow {
}
MatLegacyHeaderRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyHeaderRow, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatLegacyHeaderRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyHeaderRow, selector: "mat-header-row, tr[mat-header-row]", host: { attributes: { "role": "row" }, classAttribute: "mat-header-row" }, providers: [{ provide: CdkHeaderRow, useExisting: MatLegacyHeaderRow }], exportAs: ["matHeaderRow"], usesInheritance: true, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, dependencies: [{ kind: "directive", type: i1.CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyHeaderRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-header-row, tr[mat-header-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-header-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matHeaderRow',
                    providers: [{ provide: CdkHeaderRow, useExisting: MatLegacyHeaderRow }],
                }]
        }] });
/** Footer template container that contains the cell outlet. Adds the right class and role. */
export class MatLegacyFooterRow extends CdkFooterRow {
}
MatLegacyFooterRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyFooterRow, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatLegacyFooterRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyFooterRow, selector: "mat-footer-row, tr[mat-footer-row]", host: { attributes: { "role": "row" }, classAttribute: "mat-footer-row" }, providers: [{ provide: CdkFooterRow, useExisting: MatLegacyFooterRow }], exportAs: ["matFooterRow"], usesInheritance: true, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, dependencies: [{ kind: "directive", type: i1.CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyFooterRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-footer-row, tr[mat-footer-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-footer-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matFooterRow',
                    providers: [{ provide: CdkFooterRow, useExisting: MatLegacyFooterRow }],
                }]
        }] });
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export class MatLegacyRow extends CdkRow {
}
MatLegacyRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyRow, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatLegacyRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyRow, selector: "mat-row, tr[mat-row]", host: { attributes: { "role": "row" }, classAttribute: "mat-row" }, providers: [{ provide: CdkRow, useExisting: MatLegacyRow }], exportAs: ["matRow"], usesInheritance: true, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, dependencies: [{ kind: "directive", type: i1.CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-row, tr[mat-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matRow',
                    providers: [{ provide: CdkRow, useExisting: MatLegacyRow }],
                }]
        }] });
/** Row that can be used to display a message when no data is shown in the table. */
export class MatLegacyNoDataRow extends CdkNoDataRow {
    constructor() {
        super(...arguments);
        this._contentClassName = 'mat-no-data-row';
    }
}
MatLegacyNoDataRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyNoDataRow, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyNoDataRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyNoDataRow, selector: "ng-template[matNoDataRow]", providers: [{ provide: CdkNoDataRow, useExisting: MatLegacyNoDataRow }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyNoDataRow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matNoDataRow]',
                    providers: [{ provide: CdkNoDataRow, useExisting: MatLegacyNoDataRow }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS10YWJsZS9yb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osZUFBZSxFQUNmLFlBQVksRUFDWixlQUFlLEVBQ2YsTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEdBQ2IsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBRS9GOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxlQUFlOzt1SEFBN0MscUJBQXFCOzJHQUFyQixxQkFBcUIsOElBSHJCLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxxQkFBcUIsRUFBQyxDQUFDO2dHQUdoRSxxQkFBcUI7a0JBTGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsdUJBQXVCLEVBQUMsQ0FBQztvQkFDM0UsTUFBTSxFQUFFLENBQUMsMEJBQTBCLEVBQUUsK0JBQStCLENBQUM7aUJBQ3RFOztBQUdEOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxlQUFlOzt1SEFBN0MscUJBQXFCOzJHQUFyQixxQkFBcUIsOElBSHJCLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxxQkFBcUIsRUFBQyxDQUFDO2dHQUdoRSxxQkFBcUI7a0JBTGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcs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b0ZBQW9GO0FBS3BGLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxZQUFZO0lBSnBEOztRQUtXLHNCQUFpQixHQUFHLGlCQUFpQixDQUFDO0tBQ2hEOztvSEFGWSxrQkFBa0I7d0dBQWxCLGtCQUFrQixvREFGbEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFDLENBQUM7Z0dBRTFELGtCQUFrQjtrQkFKOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxvQkFBb0IsRUFBQyxDQUFDO2lCQUN0RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDREtfUk9XX1RFTVBMQVRFLFxuICBDZGtGb290ZXJSb3csXG4gIENka0Zvb3RlclJvd0RlZixcbiAgQ2RrSGVhZGVyUm93LFxuICBDZGtIZWFkZXJSb3dEZWYsXG4gIENka1JvdyxcbiAgQ2RrUm93RGVmLFxuICBDZGtOb0RhdGFSb3csXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIERpcmVjdGl2ZSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEhlYWRlciByb3cgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSBoZWFkZXIgcm93J3MgdGVtcGxhdGUgYW5kIG90aGVyIGhlYWRlciBwcm9wZXJ0aWVzIHN1Y2ggYXMgdGhlIGNvbHVtbnMgdG8gZGlzcGxheS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEhlYWRlclJvd0RlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrSGVhZGVyUm93RGVmLCB1c2VFeGlzdGluZzogTWF0TGVnYWN5SGVhZGVyUm93RGVmfV0sXG4gIGlucHV0czogWydjb2x1bW5zOiBtYXRIZWFkZXJSb3dEZWYnLCAnc3RpY2t5OiBtYXRIZWFkZXJSb3dEZWZTdGlja3knXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5SGVhZGVyUm93RGVmIGV4dGVuZHMgQ2RrSGVhZGVyUm93RGVmIHt9XG5cbi8qKlxuICogRm9vdGVyIHJvdyBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIGZvb3RlciByb3cncyB0ZW1wbGF0ZSBhbmQgb3RoZXIgZm9vdGVyIHByb3BlcnRpZXMgc3VjaCBhcyB0aGUgY29sdW1ucyB0byBkaXNwbGF5LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Rm9vdGVyUm93RGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtGb290ZXJSb3dEZWYsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lGb290ZXJSb3dEZWZ9XSxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IG1hdEZvb3RlclJvd0RlZicsICdzdGlja3k6IG1hdEZvb3RlclJvd0RlZlN0aWNreSddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lGb290ZXJSb3dEZWYgZXh0ZW5kcyBDZGtGb290ZXJSb3dEZWYge31cblxuLyoqXG4gKiBEYXRhIHJvdyBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIGRhdGEgcm93J3MgdGVtcGxhdGUgYW5kIG90aGVyIHByb3BlcnRpZXMgc3VjaCBhcyB0aGUgY29sdW1ucyB0byBkaXNwbGF5IGFuZFxuICogYSB3aGVuIHByZWRpY2F0ZSB0aGF0IGRlc2NyaWJlcyB3aGVuIHRoaXMgcm93IHNob3VsZCBiZSB1c2VkLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Um93RGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtSb3dEZWYsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lSb3dEZWZ9XSxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IG1hdFJvd0RlZkNvbHVtbnMnLCAnd2hlbjogbWF0Um93RGVmV2hlbiddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lSb3dEZWY8VD4gZXh0ZW5kcyBDZGtSb3dEZWY8VD4ge31cblxuLyoqIEhlYWRlciB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWhlYWRlci1yb3csIHRyW21hdC1oZWFkZXItcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1oZWFkZXItcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0SGVhZGVyUm93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlclJvdywgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeUhlYWRlclJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lIZWFkZXJSb3cgZXh0ZW5kcyBDZGtIZWFkZXJSb3cge31cblxuLyoqIEZvb3RlciB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvb3Rlci1yb3csIHRyW21hdC1mb290ZXItcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb290ZXItcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0Rm9vdGVyUm93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0Zvb3RlclJvdywgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeUZvb3RlclJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lGb290ZXJSb3cgZXh0ZW5kcyBDZGtGb290ZXJSb3cge31cblxuLyoqIERhdGEgcm93IHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBjZWxsIG91dGxldC4gQWRkcyB0aGUgcmlnaHQgY2xhc3MgYW5kIHJvbGUuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcm93LCB0clttYXQtcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1yb3cnLFxuICAgICdyb2xlJzogJ3JvdycsXG4gIH0sXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRSb3cnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrUm93LCB1c2VFeGlzdGluZzogTWF0TGVnYWN5Um93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVJvdyBleHRlbmRzIENka1JvdyB7fVxuXG4vKiogUm93IHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBhIG1lc3NhZ2Ugd2hlbiBubyBkYXRhIGlzIHNob3duIGluIHRoZSB0YWJsZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdE5vRGF0YVJvd10nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrTm9EYXRhUm93LCB1c2VFeGlzdGluZzogTWF0TGVnYWN5Tm9EYXRhUm93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeU5vRGF0YVJvdyBleHRlbmRzIENka05vRGF0YVJvdyB7XG4gIG92ZXJyaWRlIF9jb250ZW50Q2xhc3NOYW1lID0gJ21hdC1uby1kYXRhLXJvdyc7XG59XG4iXX0=