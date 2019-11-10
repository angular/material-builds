/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { CDK_ROW_TEMPLATE, CdkFooterRow, CdkFooterRowDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
var MatHeaderRowDef = /** @class */ (function (_super) {
    __extends(MatHeaderRowDef, _super);
    function MatHeaderRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatHeaderRowDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matHeaderRowDef]',
                    providers: [{ provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef }],
                    inputs: ['columns: matHeaderRowDef', 'sticky: matHeaderRowDefSticky'],
                },] }
    ];
    return MatHeaderRowDef;
}(CdkHeaderRowDef));
export { MatHeaderRowDef };
/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
var MatFooterRowDef = /** @class */ (function (_super) {
    __extends(MatFooterRowDef, _super);
    function MatFooterRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatFooterRowDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matFooterRowDef]',
                    providers: [{ provide: CdkFooterRowDef, useExisting: MatFooterRowDef }],
                    inputs: ['columns: matFooterRowDef', 'sticky: matFooterRowDefSticky'],
                },] }
    ];
    return MatFooterRowDef;
}(CdkFooterRowDef));
export { MatFooterRowDef };
/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
var MatRowDef = /** @class */ (function (_super) {
    __extends(MatRowDef, _super);
    function MatRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatRowDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matRowDef]',
                    providers: [{ provide: CdkRowDef, useExisting: MatRowDef }],
                    inputs: ['columns: matRowDefColumns', 'when: matRowDefWhen'],
                },] }
    ];
    return MatRowDef;
}(CdkRowDef));
export { MatRowDef };
/** Footer template container that contains the cell outlet. Adds the right class and role. */
var MatHeaderRow = /** @class */ (function (_super) {
    __extends(MatHeaderRow, _super);
    function MatHeaderRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatHeaderRow.decorators = [
        { type: Component, args: [{
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
                    providers: [{ provide: CdkHeaderRow, useExisting: MatHeaderRow }]
                }] }
    ];
    return MatHeaderRow;
}(CdkHeaderRow));
export { MatHeaderRow };
/** Footer template container that contains the cell outlet. Adds the right class and role. */
var MatFooterRow = /** @class */ (function (_super) {
    __extends(MatFooterRow, _super);
    function MatFooterRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatFooterRow.decorators = [
        { type: Component, args: [{
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
                    providers: [{ provide: CdkFooterRow, useExisting: MatFooterRow }]
                }] }
    ];
    return MatFooterRow;
}(CdkFooterRow));
export { MatFooterRow };
/** Data row template container that contains the cell outlet. Adds the right class and role. */
var MatRow = /** @class */ (function (_super) {
    __extends(MatRow, _super);
    function MatRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatRow.decorators = [
        { type: Component, args: [{
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
                    providers: [{ provide: CdkRow, useExisting: MatRow }]
                }] }
    ];
    return MatRow;
}(CdkRow));
export { MatRow };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3Jvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osZUFBZSxFQUNmLFlBQVksRUFDWixlQUFlLEVBQ2YsTUFBTSxFQUNOLFNBQVMsRUFDVixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9GOzs7R0FHRztBQUNIO0lBS3FDLG1DQUFlO0lBTHBEOztJQU9BLENBQUM7O2dCQVBBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDO29CQUNyRSxNQUFNLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSwrQkFBK0IsQ0FBQztpQkFDdEU7O0lBR0Qsc0JBQUM7Q0FBQSxBQVBELENBS3FDLGVBQWUsR0FFbkQ7U0FGWSxlQUFlO0FBSTVCOzs7R0FHRztBQUNIO0lBS3FDLG1DQUFlO0lBTHBEOztJQU9BLENBQUM7O2dCQVBBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDO29CQUNyRSxNQUFNLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSwrQkFBK0IsQ0FBQztpQkFDdEU7O0lBR0Qsc0JBQUM7Q0FBQSxBQVBELENBS3FDLGVBQWUsR0FFbkQ7U0FGWSxlQUFlO0FBSTVCOzs7O0dBSUc7QUFDSDtJQUtrQyw2QkFBWTtJQUw5Qzs7SUFNQSxDQUFDOztnQkFOQSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFDLENBQUM7b0JBQ3pELE1BQU0sRUFBRSxDQUFDLDJCQUEyQixFQUFFLHFCQUFxQixDQUFDO2lCQUM3RDs7SUFFRCxnQkFBQztDQUFBLEFBTkQsQ0FLa0MsU0FBUyxHQUMxQztTQURZLFNBQVM7QUFHdEIsOEZBQThGO0FBQzlGO0lBY2tDLGdDQUFZO0lBZDlDOztJQWVBLENBQUM7O2dCQWZBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsb0NBQW9DO29CQUM5QyxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdCQUFnQjt3QkFDekIsTUFBTSxFQUFFLEtBQUs7cUJBQ2Q7b0JBQ0QsK0ZBQStGO29CQUMvRiwrQ0FBK0M7b0JBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO29CQUNoRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDLENBQUM7aUJBQ2hFOztJQUVELG1CQUFDO0NBQUEsQUFmRCxDQWNrQyxZQUFZLEdBQzdDO1NBRFksWUFBWTtBQUd6Qiw4RkFBOEY7QUFDOUY7SUFja0MsZ0NBQVk7SUFkOUM7O0lBZUEsQ0FBQzs7Z0JBZkEsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsZ0JBQWdCO3dCQUN6QixNQUFNLEVBQUUsS0FBSztxQkFDZDtvQkFDRCwrRkFBK0Y7b0JBQy9GLCtDQUErQztvQkFDL0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87b0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUMsQ0FBQztpQkFDaEU7O0lBRUQsbUJBQUM7Q0FBQSxBQWZELENBY2tDLFlBQVksR0FDN0M7U0FEWSxZQUFZO0FBR3pCLGdHQUFnRztBQUNoRztJQWM0QiwwQkFBTTtJQWRsQzs7SUFlQSxDQUFDOztnQkFmQSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxTQUFTO3dCQUNsQixNQUFNLEVBQUUsS0FBSztxQkFDZDtvQkFDRCwrRkFBK0Y7b0JBQy9GLCtDQUErQztvQkFDL0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87b0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUMsQ0FBQztpQkFDcEQ7O0lBRUQsYUFBQztDQUFBLEFBZkQsQ0FjNEIsTUFBTSxHQUNqQztTQURZLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ0RLX1JPV19URU1QTEFURSxcbiAgQ2RrRm9vdGVyUm93LFxuICBDZGtGb290ZXJSb3dEZWYsXG4gIENka0hlYWRlclJvdyxcbiAgQ2RrSGVhZGVyUm93RGVmLFxuICBDZGtSb3csXG4gIENka1Jvd0RlZlxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBEaXJlY3RpdmUsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBIZWFkZXIgcm93IGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgaGVhZGVyIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciBoZWFkZXIgcHJvcGVydGllcyBzdWNoIGFzIHRoZSBjb2x1bW5zIHRvIGRpc3BsYXkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRIZWFkZXJSb3dEZWZdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlclJvd0RlZiwgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlclJvd0RlZn1dLFxuICBpbnB1dHM6IFsnY29sdW1uczogbWF0SGVhZGVyUm93RGVmJywgJ3N0aWNreTogbWF0SGVhZGVyUm93RGVmU3RpY2t5J10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEhlYWRlclJvd0RlZiBleHRlbmRzIENka0hlYWRlclJvd0RlZiB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zdGlja3k6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEZvb3RlciByb3cgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSBmb290ZXIgcm93J3MgdGVtcGxhdGUgYW5kIG90aGVyIGZvb3RlciBwcm9wZXJ0aWVzIHN1Y2ggYXMgdGhlIGNvbHVtbnMgdG8gZGlzcGxheS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEZvb3RlclJvd0RlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrRm9vdGVyUm93RGVmLCB1c2VFeGlzdGluZzogTWF0Rm9vdGVyUm93RGVmfV0sXG4gIGlucHV0czogWydjb2x1bW5zOiBtYXRGb290ZXJSb3dEZWYnLCAnc3RpY2t5OiBtYXRGb290ZXJSb3dEZWZTdGlja3knXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyUm93RGVmIGV4dGVuZHMgQ2RrRm9vdGVyUm93RGVmIHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0aWNreTogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRGF0YSByb3cgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSBkYXRhIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciBwcm9wZXJ0aWVzIHN1Y2ggYXMgdGhlIGNvbHVtbnMgdG8gZGlzcGxheSBhbmRcbiAqIGEgd2hlbiBwcmVkaWNhdGUgdGhhdCBkZXNjcmliZXMgd2hlbiB0aGlzIHJvdyBzaG91bGQgYmUgdXNlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFJvd0RlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrUm93RGVmLCB1c2VFeGlzdGluZzogTWF0Um93RGVmfV0sXG4gIGlucHV0czogWydjb2x1bW5zOiBtYXRSb3dEZWZDb2x1bW5zJywgJ3doZW46IG1hdFJvd0RlZldoZW4nXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Um93RGVmPFQ+IGV4dGVuZHMgQ2RrUm93RGVmPFQ+IHtcbn1cblxuLyoqIEZvb3RlciB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWhlYWRlci1yb3csIHRyW21hdC1oZWFkZXItcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1oZWFkZXItcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0SGVhZGVyUm93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlclJvdywgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlclJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJSb3cgZXh0ZW5kcyBDZGtIZWFkZXJSb3cge1xufVxuXG4vKiogRm9vdGVyIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBjZWxsIG91dGxldC4gQWRkcyB0aGUgcmlnaHQgY2xhc3MgYW5kIHJvbGUuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9vdGVyLXJvdywgdHJbbWF0LWZvb3Rlci1yb3ddJyxcbiAgdGVtcGxhdGU6IENES19ST1dfVEVNUExBVEUsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWZvb3Rlci1yb3cnLFxuICAgICdyb2xlJzogJ3JvdycsXG4gIH0sXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRGb290ZXJSb3cnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrRm9vdGVyUm93LCB1c2VFeGlzdGluZzogTWF0Rm9vdGVyUm93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvb3RlclJvdyBleHRlbmRzIENka0Zvb3RlclJvdyB7XG59XG5cbi8qKiBEYXRhIHJvdyB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXJvdywgdHJbbWF0LXJvd10nLFxuICB0ZW1wbGF0ZTogQ0RLX1JPV19URU1QTEFURSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0Um93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1JvdywgdXNlRXhpc3Rpbmc6IE1hdFJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSb3cgZXh0ZW5kcyBDZGtSb3cge1xufVxuIl19