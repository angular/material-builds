/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatLegacyRecycleRows, MatLegacyTable } from './table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatLegacyCell, MatLegacyCellDef, MatLegacyColumnDef, MatLegacyFooterCell, MatLegacyFooterCellDef, MatLegacyHeaderCell, MatLegacyHeaderCellDef, } from './cell';
import { MatLegacyFooterRow, MatLegacyFooterRowDef, MatLegacyHeaderRow, MatLegacyHeaderRowDef, MatLegacyRow, MatLegacyRowDef, MatLegacyNoDataRow, } from './row';
import { MatLegacyTextColumn } from './text-column';
import { MatCommonModule } from '@angular/material/core';
import * as i0 from "@angular/core";
const EXPORTED_DECLARATIONS = [
    // Table
    MatLegacyTable,
    MatLegacyRecycleRows,
    // Template defs
    MatLegacyHeaderCellDef,
    MatLegacyHeaderRowDef,
    MatLegacyColumnDef,
    MatLegacyCellDef,
    MatLegacyRowDef,
    MatLegacyFooterCellDef,
    MatLegacyFooterRowDef,
    // Cell directives
    MatLegacyHeaderCell,
    MatLegacyCell,
    MatLegacyFooterCell,
    // Row directives
    MatLegacyHeaderRow,
    MatLegacyRow,
    MatLegacyFooterRow,
    MatLegacyNoDataRow,
    MatLegacyTextColumn,
];
/**
 * @deprecated Use `MatTableModule` from `@angular/material/table` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTableModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTableModule, declarations: [
            // Table
            MatLegacyTable,
            MatLegacyRecycleRows,
            // Template defs
            MatLegacyHeaderCellDef,
            MatLegacyHeaderRowDef,
            MatLegacyColumnDef,
            MatLegacyCellDef,
            MatLegacyRowDef,
            MatLegacyFooterCellDef,
            MatLegacyFooterRowDef,
            // Cell directives
            MatLegacyHeaderCell,
            MatLegacyCell,
            MatLegacyFooterCell,
            // Row directives
            MatLegacyHeaderRow,
            MatLegacyRow,
            MatLegacyFooterRow,
            MatLegacyNoDataRow,
            MatLegacyTextColumn], imports: [CdkTableModule, MatCommonModule], exports: [MatCommonModule, 
            // Table
            MatLegacyTable,
            MatLegacyRecycleRows,
            // Template defs
            MatLegacyHeaderCellDef,
            MatLegacyHeaderRowDef,
            MatLegacyColumnDef,
            MatLegacyCellDef,
            MatLegacyRowDef,
            MatLegacyFooterCellDef,
            MatLegacyFooterRowDef,
            // Cell directives
            MatLegacyHeaderCell,
            MatLegacyCell,
            MatLegacyFooterCell,
            // Row directives
            MatLegacyHeaderRow,
            MatLegacyRow,
            MatLegacyFooterRow,
            MatLegacyNoDataRow,
            MatLegacyTextColumn] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTableModule, imports: [CdkTableModule, MatCommonModule, MatCommonModule] }); }
}
export { MatLegacyTableModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CdkTableModule, MatCommonModule],
                    exports: [MatCommonModule, EXPORTED_DECLARATIONS],
                    declarations: EXPORTED_DECLARATIONS,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS10YWJsZS90YWJsZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsY0FBYyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzdELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsbUJBQW1CLEVBQ25CLHNCQUFzQixFQUN0QixtQkFBbUIsRUFDbkIsc0JBQXNCLEdBQ3ZCLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIscUJBQXFCLEVBQ3JCLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsWUFBWSxFQUNaLGVBQWUsRUFDZixrQkFBa0IsR0FDbkIsTUFBTSxPQUFPLENBQUM7QUFDZixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUV2RCxNQUFNLHFCQUFxQixHQUFHO0lBQzVCLFFBQVE7SUFDUixjQUFjO0lBQ2Qsb0JBQW9CO0lBRXBCLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLHNCQUFzQjtJQUN0QixxQkFBcUI7SUFFckIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixhQUFhO0lBQ2IsbUJBQW1CO0lBRW5CLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFFbEIsbUJBQW1CO0NBQ3BCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUthLG9CQUFvQjs4R0FBcEIsb0JBQW9COytHQUFwQixvQkFBb0I7WUFwQy9CLFFBQVE7WUFDUixjQUFjO1lBQ2Qsb0JBQW9CO1lBRXBCLGdCQUFnQjtZQUNoQixzQkFBc0I7WUFDdEIscUJBQXFCO1lBQ3JCLGtCQUFrQjtZQUNsQixnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLHNCQUFzQjtZQUN0QixxQkFBcUI7WUFFckIsa0JBQWtCO1lBQ2xCLG1CQUFtQjtZQUNuQixhQUFhO1lBQ2IsbUJBQW1CO1lBRW5CLGlCQUFpQjtZQUNqQixrQkFBa0I7WUFDbEIsWUFBWTtZQUNaLGtCQUFrQjtZQUNsQixrQkFBa0I7WUFFbEIsbUJBQW1CLGFBUVQsY0FBYyxFQUFFLGVBQWUsYUFDL0IsZUFBZTtZQWpDekIsUUFBUTtZQUNSLGNBQWM7WUFDZCxvQkFBb0I7WUFFcEIsZ0JBQWdCO1lBQ2hCLHNCQUFzQjtZQUN0QixxQkFBcUI7WUFDckIsa0JBQWtCO1lBQ2xCLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2Ysc0JBQXNCO1lBQ3RCLHFCQUFxQjtZQUVyQixrQkFBa0I7WUFDbEIsbUJBQW1CO1lBQ25CLGFBQWE7WUFDYixtQkFBbUI7WUFFbkIsaUJBQWlCO1lBQ2pCLGtCQUFrQjtZQUNsQixZQUFZO1lBQ1osa0JBQWtCO1lBQ2xCLGtCQUFrQjtZQUVsQixtQkFBbUI7K0dBWVIsb0JBQW9CLFlBSnJCLGNBQWMsRUFBRSxlQUFlLEVBQy9CLGVBQWU7O1NBR2Qsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBTGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLHFCQUFxQixDQUFDO29CQUNqRCxZQUFZLEVBQUUscUJBQXFCO2lCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0TGVnYWN5UmVjeWNsZVJvd3MsIE1hdExlZ2FjeVRhYmxlfSBmcm9tICcuL3RhYmxlJztcbmltcG9ydCB7Q2RrVGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge1xuICBNYXRMZWdhY3lDZWxsLFxuICBNYXRMZWdhY3lDZWxsRGVmLFxuICBNYXRMZWdhY3lDb2x1bW5EZWYsXG4gIE1hdExlZ2FjeUZvb3RlckNlbGwsXG4gIE1hdExlZ2FjeUZvb3RlckNlbGxEZWYsXG4gIE1hdExlZ2FjeUhlYWRlckNlbGwsXG4gIE1hdExlZ2FjeUhlYWRlckNlbGxEZWYsXG59IGZyb20gJy4vY2VsbCc7XG5pbXBvcnQge1xuICBNYXRMZWdhY3lGb290ZXJSb3csXG4gIE1hdExlZ2FjeUZvb3RlclJvd0RlZixcbiAgTWF0TGVnYWN5SGVhZGVyUm93LFxuICBNYXRMZWdhY3lIZWFkZXJSb3dEZWYsXG4gIE1hdExlZ2FjeVJvdyxcbiAgTWF0TGVnYWN5Um93RGVmLFxuICBNYXRMZWdhY3lOb0RhdGFSb3csXG59IGZyb20gJy4vcm93JztcbmltcG9ydCB7TWF0TGVnYWN5VGV4dENvbHVtbn0gZnJvbSAnLi90ZXh0LWNvbHVtbic7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbmNvbnN0IEVYUE9SVEVEX0RFQ0xBUkFUSU9OUyA9IFtcbiAgLy8gVGFibGVcbiAgTWF0TGVnYWN5VGFibGUsXG4gIE1hdExlZ2FjeVJlY3ljbGVSb3dzLFxuXG4gIC8vIFRlbXBsYXRlIGRlZnNcbiAgTWF0TGVnYWN5SGVhZGVyQ2VsbERlZixcbiAgTWF0TGVnYWN5SGVhZGVyUm93RGVmLFxuICBNYXRMZWdhY3lDb2x1bW5EZWYsXG4gIE1hdExlZ2FjeUNlbGxEZWYsXG4gIE1hdExlZ2FjeVJvd0RlZixcbiAgTWF0TGVnYWN5Rm9vdGVyQ2VsbERlZixcbiAgTWF0TGVnYWN5Rm9vdGVyUm93RGVmLFxuXG4gIC8vIENlbGwgZGlyZWN0aXZlc1xuICBNYXRMZWdhY3lIZWFkZXJDZWxsLFxuICBNYXRMZWdhY3lDZWxsLFxuICBNYXRMZWdhY3lGb290ZXJDZWxsLFxuXG4gIC8vIFJvdyBkaXJlY3RpdmVzXG4gIE1hdExlZ2FjeUhlYWRlclJvdyxcbiAgTWF0TGVnYWN5Um93LFxuICBNYXRMZWdhY3lGb290ZXJSb3csXG4gIE1hdExlZ2FjeU5vRGF0YVJvdyxcblxuICBNYXRMZWdhY3lUZXh0Q29sdW1uLFxuXTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFRhYmxlTW9kdWxlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC90YWJsZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ2RrVGFibGVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIEVYUE9SVEVEX0RFQ0xBUkFUSU9OU10sXG4gIGRlY2xhcmF0aW9uczogRVhQT1JURURfREVDTEFSQVRJT05TLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUYWJsZU1vZHVsZSB7fVxuIl19