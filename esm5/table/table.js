/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { CDK_TABLE_TEMPLATE, CdkTable, CDK_TABLE } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
var MatTable = /** @class */ (function (_super) {
    __extends(MatTable, _super);
    function MatTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Overrides the sticky CSS class set by the `CdkTable`. */
        _this.stickyCssClass = 'mat-table-sticky';
        return _this;
    }
    MatTable.decorators = [
        { type: Component, args: [{
                    selector: 'mat-table, table[mat-table]',
                    exportAs: 'matTable',
                    template: CDK_TABLE_TEMPLATE,
                    host: {
                        'class': 'mat-table',
                    },
                    providers: [
                        { provide: CdkTable, useExisting: MatTable },
                        { provide: CDK_TABLE, useExisting: MatTable }
                    ],
                    encapsulation: ViewEncapsulation.None,
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    styles: ["mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-row::after,mat-header-row::after,mat-footer-row::after{display:inline-block;min-height:inherit;content:\"\"}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type,[dir=rtl] mat-header-cell:first-of-type,[dir=rtl] mat-footer-cell:first-of-type{padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type,[dir=rtl] mat-header-cell:last-of-type,[dir=rtl] mat-footer-cell:last-of-type{padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.mat-table{border-spacing:0}tr.mat-header-row{height:56px}tr.mat-row,tr.mat-footer-row{height:48px}th.mat-header-cell{text-align:left}[dir=rtl] th.mat-header-cell{text-align:right}th.mat-header-cell,td.mat-cell,td.mat-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.mat-header-cell:first-of-type,td.mat-cell:first-of-type,td.mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.mat-header-cell:first-of-type,[dir=rtl] td.mat-cell:first-of-type,[dir=rtl] td.mat-footer-cell:first-of-type{padding-left:0;padding-right:24px}th.mat-header-cell:last-of-type,td.mat-cell:last-of-type,td.mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.mat-header-cell:last-of-type,[dir=rtl] td.mat-cell:last-of-type,[dir=rtl] td.mat-footer-cell:last-of-type{padding-right:0;padding-left:24px}\n"]
                }] }
    ];
    return MatTable;
}(CdkTable));
export { MatTable };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDM0UsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVwRjs7R0FFRztBQUNIO0lBaUJpQyw0QkFBVztJQWpCNUM7UUFBQSxxRUFvQkM7UUFGQyw0REFBNEQ7UUFDbEQsb0JBQWMsR0FBRyxrQkFBa0IsQ0FBQzs7SUFDaEQsQ0FBQzs7Z0JBcEJBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsUUFBUSxFQUFFLGtCQUFrQjtvQkFFNUIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxXQUFXO3FCQUNyQjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7d0JBQzFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFDO3FCQUM1QztvQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsK0ZBQStGO29CQUMvRiwrQ0FBK0M7b0JBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPOztpQkFDakQ7O0lBSUQsZUFBQztDQUFBLEFBcEJELENBaUJpQyxRQUFRLEdBR3hDO1NBSFksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NES19UQUJMRV9URU1QTEFURSwgQ2RrVGFibGUsIENES19UQUJMRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUYWJsZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWJsZSwgdGFibGVbbWF0LXRhYmxlXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFibGUnLFxuICB0ZW1wbGF0ZTogQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBzdHlsZVVybHM6IFsndGFibGUuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYmxlJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IENka1RhYmxlLCB1c2VFeGlzdGluZzogTWF0VGFibGV9LFxuICAgIHtwcm92aWRlOiBDREtfVEFCTEUsIHVzZUV4aXN0aW5nOiBNYXRUYWJsZX1cbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gU2VlIG5vdGUgb24gQ2RrVGFibGUgZm9yIGV4cGxhbmF0aW9uIG9uIHdoeSB0aGlzIHVzZXMgdGhlIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJsZTxUPiBleHRlbmRzIENka1RhYmxlPFQ+IHtcbiAgLyoqIE92ZXJyaWRlcyB0aGUgc3RpY2t5IENTUyBjbGFzcyBzZXQgYnkgdGhlIGBDZGtUYWJsZWAuICovXG4gIHByb3RlY3RlZCBzdGlja3lDc3NDbGFzcyA9ICdtYXQtdGFibGUtc3RpY2t5Jztcbn1cbiJdfQ==