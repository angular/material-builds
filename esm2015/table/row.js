/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { CDK_ROW_TEMPLATE, CdkFooterRow, CdkFooterRowDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef, CdkNoDataRow } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
let MatHeaderRowDef = /** @class */ (() => {
    var MatHeaderRowDef_1;
    let MatHeaderRowDef = MatHeaderRowDef_1 = class MatHeaderRowDef extends CdkHeaderRowDef {
    };
    MatHeaderRowDef = MatHeaderRowDef_1 = __decorate([
        Directive({
            selector: '[matHeaderRowDef]',
            providers: [{ provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef_1 }],
            inputs: ['columns: matHeaderRowDef', 'sticky: matHeaderRowDefSticky'],
        })
    ], MatHeaderRowDef);
    return MatHeaderRowDef;
})();
export { MatHeaderRowDef };
/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
let MatFooterRowDef = /** @class */ (() => {
    var MatFooterRowDef_1;
    let MatFooterRowDef = MatFooterRowDef_1 = class MatFooterRowDef extends CdkFooterRowDef {
    };
    MatFooterRowDef = MatFooterRowDef_1 = __decorate([
        Directive({
            selector: '[matFooterRowDef]',
            providers: [{ provide: CdkFooterRowDef, useExisting: MatFooterRowDef_1 }],
            inputs: ['columns: matFooterRowDef', 'sticky: matFooterRowDefSticky'],
        })
    ], MatFooterRowDef);
    return MatFooterRowDef;
})();
export { MatFooterRowDef };
/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
let MatRowDef = /** @class */ (() => {
    var MatRowDef_1;
    let MatRowDef = MatRowDef_1 = class MatRowDef extends CdkRowDef {
    };
    MatRowDef = MatRowDef_1 = __decorate([
        Directive({
            selector: '[matRowDef]',
            providers: [{ provide: CdkRowDef, useExisting: MatRowDef_1 }],
            inputs: ['columns: matRowDefColumns', 'when: matRowDefWhen'],
        })
    ], MatRowDef);
    return MatRowDef;
})();
export { MatRowDef };
/** Header template container that contains the cell outlet. Adds the right class and role. */
let MatHeaderRow = /** @class */ (() => {
    var MatHeaderRow_1;
    let MatHeaderRow = MatHeaderRow_1 = class MatHeaderRow extends CdkHeaderRow {
    };
    MatHeaderRow = MatHeaderRow_1 = __decorate([
        Component({
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
            providers: [{ provide: CdkHeaderRow, useExisting: MatHeaderRow_1 }]
        })
    ], MatHeaderRow);
    return MatHeaderRow;
})();
export { MatHeaderRow };
/** Footer template container that contains the cell outlet. Adds the right class and role. */
let MatFooterRow = /** @class */ (() => {
    var MatFooterRow_1;
    let MatFooterRow = MatFooterRow_1 = class MatFooterRow extends CdkFooterRow {
    };
    MatFooterRow = MatFooterRow_1 = __decorate([
        Component({
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
            providers: [{ provide: CdkFooterRow, useExisting: MatFooterRow_1 }]
        })
    ], MatFooterRow);
    return MatFooterRow;
})();
export { MatFooterRow };
/** Data row template container that contains the cell outlet. Adds the right class and role. */
let MatRow = /** @class */ (() => {
    var MatRow_1;
    let MatRow = MatRow_1 = class MatRow extends CdkRow {
    };
    MatRow = MatRow_1 = __decorate([
        Component({
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
            providers: [{ provide: CdkRow, useExisting: MatRow_1 }]
        })
    ], MatRow);
    return MatRow;
})();
export { MatRow };
/** Row that can be used to display a message when no data is shown in the table. */
let MatNoDataRow = /** @class */ (() => {
    var MatNoDataRow_1;
    let MatNoDataRow = MatNoDataRow_1 = class MatNoDataRow extends CdkNoDataRow {
    };
    MatNoDataRow = MatNoDataRow_1 = __decorate([
        Directive({
            selector: 'ng-template[matNoDataRow]',
            providers: [{ provide: CdkNoDataRow, useExisting: MatNoDataRow_1 }],
        })
    ], MatNoDataRow);
    return MatNoDataRow;
})();
export { MatNoDataRow };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3Jvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBR0gsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osZUFBZSxFQUNmLFlBQVksRUFDWixlQUFlLEVBQ2YsTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ2IsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUvRjs7O0dBR0c7QUFNSDs7SUFBQSxJQUFhLGVBQWUsdUJBQTVCLE1BQWEsZUFBZ0IsU0FBUSxlQUFlO0tBRW5ELENBQUE7SUFGWSxlQUFlO1FBTDNCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxpQkFBZSxFQUFDLENBQUM7WUFDckUsTUFBTSxFQUFFLENBQUMsMEJBQTBCLEVBQUUsK0JBQStCLENBQUM7U0FDdEUsQ0FBQztPQUNXLGVBQWUsQ0FFM0I7SUFBRCxzQkFBQztLQUFBO1NBRlksZUFBZTtBQUk1Qjs7O0dBR0c7QUFNSDs7SUFBQSxJQUFhLGVBQWUsdUJBQTVCLE1BQWEsZUFBZ0IsU0FBUSxlQUFlO0tBRW5ELENBQUE7SUFGWSxlQUFlO1FBTDNCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxpQkFBZSxFQUFDLENBQUM7WUFDckUsTUFBTSxFQUFFLENBQUMsMEJBQTBCLEVBQUUsK0JBQStCLENBQUM7U0FDdEUsQ0FBQztPQUNXLGVBQWUsQ0FFM0I7SUFBRCxzQkFBQztL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QUUsV0FBVyxFQUFFLGNBQVksRUFBQyxDQUFDO1NBQ2hFLENBQUM7T0FDVyxZQUFZLENBQ3hCO0lBQUQsbUJBQUM7S0FBQTtTQURZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDREtfUk9XX1RFTVBMQVRFLFxuICBDZGtGb290ZXJSb3csXG4gIENka0Zvb3RlclJvd0RlZixcbiAgQ2RrSGVhZGVyUm93LFxuICBDZGtIZWFkZXJSb3dEZWYsXG4gIENka1JvdyxcbiAgQ2RrUm93RGVmLFxuICBDZGtOb0RhdGFSb3dcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRGlyZWN0aXZlLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSGVhZGVyIHJvdyBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIGhlYWRlciByb3cncyB0ZW1wbGF0ZSBhbmQgb3RoZXIgaGVhZGVyIHByb3BlcnRpZXMgc3VjaCBhcyB0aGUgY29sdW1ucyB0byBkaXNwbGF5LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0SGVhZGVyUm93RGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtIZWFkZXJSb3dEZWYsIHVzZUV4aXN0aW5nOiBNYXRIZWFkZXJSb3dEZWZ9XSxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IG1hdEhlYWRlclJvd0RlZicsICdzdGlja3k6IG1hdEhlYWRlclJvd0RlZlN0aWNreSddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJSb3dEZWYgZXh0ZW5kcyBDZGtIZWFkZXJSb3dEZWYge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RpY2t5OiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogRm9vdGVyIHJvdyBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIGZvb3RlciByb3cncyB0ZW1wbGF0ZSBhbmQgb3RoZXIgZm9vdGVyIHByb3BlcnRpZXMgc3VjaCBhcyB0aGUgY29sdW1ucyB0byBkaXNwbGF5LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Rm9vdGVyUm93RGVmXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtGb290ZXJSb3dEZWYsIHVzZUV4aXN0aW5nOiBNYXRGb290ZXJSb3dEZWZ9XSxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IG1hdEZvb3RlclJvd0RlZicsICdzdGlja3k6IG1hdEZvb3RlclJvd0RlZlN0aWNreSddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJSb3dEZWYgZXh0ZW5kcyBDZGtGb290ZXJSb3dEZWYge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RpY2t5OiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogRGF0YSByb3cgZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIENhcHR1cmVzIHRoZSBkYXRhIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciBwcm9wZXJ0aWVzIHN1Y2ggYXMgdGhlIGNvbHVtbnMgdG8gZGlzcGxheSBhbmRcbiAqIGEgd2hlbiBwcmVkaWNhdGUgdGhhdCBkZXNjcmliZXMgd2hlbiB0aGlzIHJvdyBzaG91bGQgYmUgdXNlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFJvd0RlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrUm93RGVmLCB1c2VFeGlzdGluZzogTWF0Um93RGVmfV0sXG4gIGlucHV0czogWydjb2x1bW5zOiBtYXRSb3dEZWZDb2x1bW5zJywgJ3doZW46IG1hdFJvd0RlZldoZW4nXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Um93RGVmPFQ+IGV4dGVuZHMgQ2RrUm93RGVmPFQ+IHtcbn1cblxuLyoqIEhlYWRlciB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWhlYWRlci1yb3csIHRyW21hdC1oZWFkZXItcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1oZWFkZXItcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0SGVhZGVyUm93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka0hlYWRlclJvdywgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlclJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJSb3cgZXh0ZW5kcyBDZGtIZWFkZXJSb3cge1xufVxuXG4vKiogRm9vdGVyIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBjZWxsIG91dGxldC4gQWRkcyB0aGUgcmlnaHQgY2xhc3MgYW5kIHJvbGUuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9vdGVyLXJvdywgdHJbbWF0LWZvb3Rlci1yb3ddJyxcbiAgdGVtcGxhdGU6IENES19ST1dfVEVNUExBVEUsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWZvb3Rlci1yb3cnLFxuICAgICdyb2xlJzogJ3JvdycsXG4gIH0sXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRGb290ZXJSb3cnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrRm9vdGVyUm93LCB1c2VFeGlzdGluZzogTWF0Rm9vdGVyUm93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvb3RlclJvdyBleHRlbmRzIENka0Zvb3RlclJvdyB7XG59XG5cbi8qKiBEYXRhIHJvdyB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXJvdywgdHJbbWF0LXJvd10nLFxuICB0ZW1wbGF0ZTogQ0RLX1JPV19URU1QTEFURSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0Um93JyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1JvdywgdXNlRXhpc3Rpbmc6IE1hdFJvd31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSb3cgZXh0ZW5kcyBDZGtSb3cge1xufVxuXG4vKiogUm93IHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBhIG1lc3NhZ2Ugd2hlbiBubyBkYXRhIGlzIHNob3duIGluIHRoZSB0YWJsZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdE5vRGF0YVJvd10nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrTm9EYXRhUm93LCB1c2VFeGlzdGluZzogTWF0Tm9EYXRhUm93fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE5vRGF0YVJvdyBleHRlbmRzIENka05vRGF0YVJvdyB7XG59XG4iXX0=