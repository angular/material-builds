/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatRecycleRows, MatTable } from './table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef, MatHeaderCell, MatHeaderCellDef, } from './cell';
import { MatFooterRow, MatFooterRowDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatNoDataRow, } from './row';
import { MatTextColumn } from './text-column';
import * as i0 from "@angular/core";
const EXPORTED_DECLARATIONS = [
    // Table
    MatTable,
    MatRecycleRows,
    // Template defs
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatColumnDef,
    MatCellDef,
    MatRowDef,
    MatFooterCellDef,
    MatFooterRowDef,
    // Cell directives
    MatHeaderCell,
    MatCell,
    MatFooterCell,
    // Row directives
    MatHeaderRow,
    MatRow,
    MatFooterRow,
    MatNoDataRow,
    MatTextColumn,
];
class MatTableModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatTableModule, declarations: [
            // Table
            MatTable,
            MatRecycleRows,
            // Template defs
            MatHeaderCellDef,
            MatHeaderRowDef,
            MatColumnDef,
            MatCellDef,
            MatRowDef,
            MatFooterCellDef,
            MatFooterRowDef,
            // Cell directives
            MatHeaderCell,
            MatCell,
            MatFooterCell,
            // Row directives
            MatHeaderRow,
            MatRow,
            MatFooterRow,
            MatNoDataRow,
            MatTextColumn], imports: [MatCommonModule, CdkTableModule], exports: [MatCommonModule, 
            // Table
            MatTable,
            MatRecycleRows,
            // Template defs
            MatHeaderCellDef,
            MatHeaderRowDef,
            MatColumnDef,
            MatCellDef,
            MatRowDef,
            MatFooterCellDef,
            MatFooterRowDef,
            // Cell directives
            MatHeaderCell,
            MatCell,
            MatFooterCell,
            // Row directives
            MatHeaderRow,
            MatRow,
            MatFooterRow,
            MatNoDataRow,
            MatTextColumn] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTableModule, imports: [MatCommonModule, CdkTableModule, MatCommonModule] }); }
}
export { MatTableModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, CdkTableModule],
                    exports: [MatCommonModule, EXPORTED_DECLARATIONS],
                    declarations: EXPORTED_DECLARATIONS,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsY0FBYyxFQUFFLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNqRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBQ1YsWUFBWSxFQUNaLGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLGdCQUFnQixHQUNqQixNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQ0wsWUFBWSxFQUNaLGVBQWUsRUFDZixZQUFZLEVBQ1osZUFBZSxFQUNmLE1BQU0sRUFDTixTQUFTLEVBQ1QsWUFBWSxHQUNiLE1BQU0sT0FBTyxDQUFDO0FBQ2YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFNUMsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixRQUFRO0lBQ1IsUUFBUTtJQUNSLGNBQWM7SUFFZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixZQUFZO0lBQ1osVUFBVTtJQUNWLFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsZUFBZTtJQUVmLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsT0FBTztJQUNQLGFBQWE7SUFFYixpQkFBaUI7SUFDakIsWUFBWTtJQUNaLE1BQU07SUFDTixZQUFZO0lBQ1osWUFBWTtJQUVaLGFBQWE7Q0FDZCxDQUFDO0FBRUYsTUFLYSxjQUFjOzhHQUFkLGNBQWM7K0dBQWQsY0FBYztZQWhDekIsUUFBUTtZQUNSLFFBQVE7WUFDUixjQUFjO1lBRWQsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsWUFBWTtZQUNaLFVBQVU7WUFDVixTQUFTO1lBQ1QsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFFZixrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLE9BQU87WUFDUCxhQUFhO1lBRWIsaUJBQWlCO1lBQ2pCLFlBQVk7WUFDWixNQUFNO1lBQ04sWUFBWTtZQUNaLFlBQVk7WUFFWixhQUFhLGFBSUgsZUFBZSxFQUFFLGNBQWMsYUFDL0IsZUFBZTtZQTdCekIsUUFBUTtZQUNSLFFBQVE7WUFDUixjQUFjO1lBRWQsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsWUFBWTtZQUNaLFVBQVU7WUFDVixTQUFTO1lBQ1QsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFFZixrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLE9BQU87WUFDUCxhQUFhO1lBRWIsaUJBQWlCO1lBQ2pCLFlBQVk7WUFDWixNQUFNO1lBQ04sWUFBWTtZQUNaLFlBQVk7WUFFWixhQUFhOytHQVFGLGNBQWMsWUFKZixlQUFlLEVBQUUsY0FBYyxFQUMvQixlQUFlOztTQUdkLGNBQWM7MkZBQWQsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDO29CQUMxQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7b0JBQ2pELFlBQVksRUFBRSxxQkFBcUI7aUJBQ3BDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRSZWN5Y2xlUm93cywgTWF0VGFibGV9IGZyb20gJy4vdGFibGUnO1xuaW1wb3J0IHtDZGtUYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7XG4gIE1hdENlbGwsXG4gIE1hdENlbGxEZWYsXG4gIE1hdENvbHVtbkRlZixcbiAgTWF0Rm9vdGVyQ2VsbCxcbiAgTWF0Rm9vdGVyQ2VsbERlZixcbiAgTWF0SGVhZGVyQ2VsbCxcbiAgTWF0SGVhZGVyQ2VsbERlZixcbn0gZnJvbSAnLi9jZWxsJztcbmltcG9ydCB7XG4gIE1hdEZvb3RlclJvdyxcbiAgTWF0Rm9vdGVyUm93RGVmLFxuICBNYXRIZWFkZXJSb3csXG4gIE1hdEhlYWRlclJvd0RlZixcbiAgTWF0Um93LFxuICBNYXRSb3dEZWYsXG4gIE1hdE5vRGF0YVJvdyxcbn0gZnJvbSAnLi9yb3cnO1xuaW1wb3J0IHtNYXRUZXh0Q29sdW1ufSBmcm9tICcuL3RleHQtY29sdW1uJztcblxuY29uc3QgRVhQT1JURURfREVDTEFSQVRJT05TID0gW1xuICAvLyBUYWJsZVxuICBNYXRUYWJsZSxcbiAgTWF0UmVjeWNsZVJvd3MsXG5cbiAgLy8gVGVtcGxhdGUgZGVmc1xuICBNYXRIZWFkZXJDZWxsRGVmLFxuICBNYXRIZWFkZXJSb3dEZWYsXG4gIE1hdENvbHVtbkRlZixcbiAgTWF0Q2VsbERlZixcbiAgTWF0Um93RGVmLFxuICBNYXRGb290ZXJDZWxsRGVmLFxuICBNYXRGb290ZXJSb3dEZWYsXG5cbiAgLy8gQ2VsbCBkaXJlY3RpdmVzXG4gIE1hdEhlYWRlckNlbGwsXG4gIE1hdENlbGwsXG4gIE1hdEZvb3RlckNlbGwsXG5cbiAgLy8gUm93IGRpcmVjdGl2ZXNcbiAgTWF0SGVhZGVyUm93LFxuICBNYXRSb3csXG4gIE1hdEZvb3RlclJvdyxcbiAgTWF0Tm9EYXRhUm93LFxuXG4gIE1hdFRleHRDb2x1bW4sXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBDZGtUYWJsZU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIEVYUE9SVEVEX0RFQ0xBUkFUSU9OU10sXG4gIGRlY2xhcmF0aW9uczogRVhQT1JURURfREVDTEFSQVRJT05TLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJsZU1vZHVsZSB7fVxuIl19