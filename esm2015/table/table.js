/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TABLE_TEMPLATE, CdkTable, CDK_TABLE, _CoalescedStyleScheduler } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { _DisposeViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export class MatTable extends CdkTable {
    constructor() {
        super(...arguments);
        /** Overrides the sticky CSS class set by the `CdkTable`. */
        this.stickyCssClass = 'mat-table-sticky';
        /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
        this.needsPositionStickyOnElement = false;
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
                    // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
                    //  is only included in the build if used.
                    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
                    { provide: CdkTable, useExisting: MatTable },
                    { provide: CDK_TABLE, useExisting: MatTable },
                    _CoalescedStyleScheduler,
                ],
                encapsulation: ViewEncapsulation.None,
                // See note on CdkTable for explanation on why this uses the default change detection strategy.
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                styles: ["mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-row::after,mat-header-row::after,mat-footer-row::after{display:inline-block;min-height:inherit;content:\"\"}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.mat-table{border-spacing:0}tr.mat-header-row{height:56px}tr.mat-row,tr.mat-footer-row{height:48px}th.mat-header-cell{text-align:left}[dir=rtl] th.mat-header-cell{text-align:right}th.mat-header-cell,td.mat-cell,td.mat-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.mat-header-cell:first-of-type,td.mat-cell:first-of-type,td.mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.mat-header-cell:last-of-type,td.mat-cell:last-of-type,td.mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.mat-table-sticky{position:-webkit-sticky;position:sticky}\n"]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixRQUFRLEVBQ1IsU0FBUyxFQUNULHdCQUF3QixFQUN6QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEYsT0FBTyxFQUFDLDRCQUE0QixFQUFFLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFL0Y7O0dBRUc7QUFzQkgsTUFBTSxPQUFPLFFBQVksU0FBUSxRQUFXO0lBckI1Qzs7UUFzQkUsNERBQTREO1FBQ2xELG1CQUFjLEdBQUcsa0JBQWtCLENBQUM7UUFFOUMsNkZBQTZGO1FBQ25GLGlDQUE0QixHQUFHLEtBQUssQ0FBQztJQUNqRCxDQUFDOzs7WUEzQkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsa0JBQWtCO2dCQUU1QixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLFdBQVc7aUJBQ3JCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxnR0FBZ0c7b0JBQ2hHLDBDQUEwQztvQkFDMUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDO29CQUMxRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztvQkFDMUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7b0JBQzNDLHdCQUF3QjtpQkFDekI7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLCtGQUErRjtnQkFDL0YsK0NBQStDO2dCQUMvQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTzs7YUFDakQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBDZGtUYWJsZSxcbiAgQ0RLX1RBQkxFLFxuICBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtfRGlzcG9zZVZpZXdSZXBlYXRlclN0cmF0ZWd5LCBfVklFV19SRVBFQVRFUl9TVFJBVEVHWX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVGFibGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdGFibGUsIHRhYmxlW21hdC10YWJsZV0nLFxuICBleHBvcnRBczogJ21hdFRhYmxlJyxcbiAgdGVtcGxhdGU6IENES19UQUJMRV9URU1QTEFURSxcbiAgc3R5bGVVcmxzOiBbJ3RhYmxlLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWJsZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIC8vIFRPRE8obWljaGFlbGphbWVzcGFyc29ucykgQWJzdHJhY3QgdGhlIHZpZXcgcmVwZWF0ZXIgc3RyYXRlZ3kgdG8gYSBkaXJlY3RpdmUgQVBJIHNvIHRoaXMgY29kZVxuICAgIC8vICBpcyBvbmx5IGluY2x1ZGVkIGluIHRoZSBidWlsZCBpZiB1c2VkLlxuICAgIHtwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlQ2xhc3M6IF9EaXNwb3NlVmlld1JlcGVhdGVyU3RyYXRlZ3l9LFxuICAgIHtwcm92aWRlOiBDZGtUYWJsZSwgdXNlRXhpc3Rpbmc6IE1hdFRhYmxlfSxcbiAgICB7cHJvdmlkZTogQ0RLX1RBQkxFLCB1c2VFeGlzdGluZzogTWF0VGFibGV9LFxuICAgIF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gU2VlIG5vdGUgb24gQ2RrVGFibGUgZm9yIGV4cGxhbmF0aW9uIG9uIHdoeSB0aGlzIHVzZXMgdGhlIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJsZTxUPiBleHRlbmRzIENka1RhYmxlPFQ+IHtcbiAgLyoqIE92ZXJyaWRlcyB0aGUgc3RpY2t5IENTUyBjbGFzcyBzZXQgYnkgdGhlIGBDZGtUYWJsZWAuICovXG4gIHByb3RlY3RlZCBzdGlja3lDc3NDbGFzcyA9ICdtYXQtdGFibGUtc3RpY2t5JztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBuZWVkIHRvIGFkZCBwb3NpdGlvbjogc3RpY2t5IG9uIGV2ZXJ5IHN0aWNreSBjZWxsIGVsZW1lbnQgaW4gYENka1RhYmxlYC4gKi9cbiAgcHJvdGVjdGVkIG5lZWRzUG9zaXRpb25TdGlja3lPbkVsZW1lbnQgPSBmYWxzZTtcbn1cbiJdfQ==