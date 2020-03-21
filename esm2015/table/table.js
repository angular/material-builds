/**
 * @fileoverview added by tsickle
 * Generated from: src/material/table/table.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TABLE_TEMPLATE, CdkTable, CDK_TABLE } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
/**
 * Wrapper for the CdkTable with Material design styles.
 * @template T
 */
export class MatTable extends CdkTable {
    constructor() {
        super(...arguments);
        /**
         * Overrides the sticky CSS class set by the `CdkTable`.
         */
        this.stickyCssClass = 'mat-table-sticky';
    }
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
if (false) {
    /**
     * Overrides the sticky CSS class set by the `CdkTable`.
     * @type {?}
     * @protected
     */
    MatTable.prototype.stickyCssClass;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMzRSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDOzs7OztBQXNCcEYsTUFBTSxPQUFPLFFBQVksU0FBUSxRQUFXO0lBakI1Qzs7Ozs7UUFtQlksbUJBQWMsR0FBRyxrQkFBa0IsQ0FBQztJQUNoRCxDQUFDOzs7WUFwQkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsa0JBQWtCO2dCQUU1QixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLFdBQVc7aUJBQ3JCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztvQkFDMUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7aUJBQzVDO2dCQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzs7Z0JBR3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPOzthQUNqRDs7Ozs7Ozs7SUFHQyxrQ0FBOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDREtfVEFCTEVfVEVNUExBVEUsIENka1RhYmxlLCBDREtfVEFCTEV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVGFibGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdGFibGUsIHRhYmxlW21hdC10YWJsZV0nLFxuICBleHBvcnRBczogJ21hdFRhYmxlJyxcbiAgdGVtcGxhdGU6IENES19UQUJMRV9URU1QTEFURSxcbiAgc3R5bGVVcmxzOiBbJ3RhYmxlLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWJsZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtUYWJsZSwgdXNlRXhpc3Rpbmc6IE1hdFRhYmxlfSxcbiAgICB7cHJvdmlkZTogQ0RLX1RBQkxFLCB1c2VFeGlzdGluZzogTWF0VGFibGV9XG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFibGU8VD4gZXh0ZW5kcyBDZGtUYWJsZTxUPiB7XG4gIC8qKiBPdmVycmlkZXMgdGhlIHN0aWNreSBDU1MgY2xhc3Mgc2V0IGJ5IHRoZSBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgc3RpY2t5Q3NzQ2xhc3MgPSAnbWF0LXRhYmxlLXN0aWNreSc7XG59XG4iXX0=