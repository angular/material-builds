/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatRecycleRows, MatTable } from './table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef, MatHeaderCell, MatHeaderCellDef, } from './cell';
import { MatFooterRow, MatFooterRowDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatNoDataRow } from './row';
import { MatTextColumn } from './text-column';
import { MatCommonModule } from '@angular/material/core';
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
export class MatTableModule {
}
MatTableModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatTableModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTableModule, declarations: [
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
        MatTextColumn], imports: [CdkTableModule,
        MatCommonModule], exports: [MatCommonModule, 
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
        MatTextColumn] });
MatTableModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTableModule, imports: [[
            CdkTableModule,
            MatCommonModule,
        ], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CdkTableModule,
                        MatCommonModule,
                    ],
                    exports: [MatCommonModule, EXPORTED_DECLARATIONS],
                    declarations: EXPORTED_DECLARATIONS,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3RhYmxlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxjQUFjLEVBQUUsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFDVixZQUFZLEVBQ1osYUFBYSxFQUNiLGdCQUFnQixFQUNoQixhQUFhLEVBQ2IsZ0JBQWdCLEdBQ2pCLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFDTCxZQUFZLEVBQ1osZUFBZSxFQUNmLFlBQVksRUFDWixlQUFlLEVBQ2YsTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ2IsTUFBTSxPQUFPLENBQUM7QUFDZixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFdkQsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixRQUFRO0lBQ1IsUUFBUTtJQUNSLGNBQWM7SUFFZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixZQUFZO0lBQ1osVUFBVTtJQUNWLFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsZUFBZTtJQUVmLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsT0FBTztJQUNQLGFBQWE7SUFFYixpQkFBaUI7SUFDakIsWUFBWTtJQUNaLE1BQU07SUFDTixZQUFZO0lBQ1osWUFBWTtJQUVaLGFBQWE7Q0FDZCxDQUFDO0FBVUYsTUFBTSxPQUFPLGNBQWM7O21IQUFkLGNBQWM7b0hBQWQsY0FBYztRQW5DekIsUUFBUTtRQUNSLFFBQVE7UUFDUixjQUFjO1FBRWQsZ0JBQWdCO1FBQ2hCLGdCQUFnQjtRQUNoQixlQUFlO1FBQ2YsWUFBWTtRQUNaLFVBQVU7UUFDVixTQUFTO1FBQ1QsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFFZixrQkFBa0I7UUFDbEIsYUFBYTtRQUNiLE9BQU87UUFDUCxhQUFhO1FBRWIsaUJBQWlCO1FBQ2pCLFlBQVk7UUFDWixNQUFNO1FBQ04sWUFBWTtRQUNaLFlBQVk7UUFFWixhQUFhLGFBS1gsY0FBYztRQUNkLGVBQWUsYUFFUCxlQUFlO1FBaEN6QixRQUFRO1FBQ1IsUUFBUTtRQUNSLGNBQWM7UUFFZCxnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFDZixZQUFZO1FBQ1osVUFBVTtRQUNWLFNBQVM7UUFDVCxnQkFBZ0I7UUFDaEIsZUFBZTtRQUVmLGtCQUFrQjtRQUNsQixhQUFhO1FBQ2IsT0FBTztRQUNQLGFBQWE7UUFFYixpQkFBaUI7UUFDakIsWUFBWTtRQUNaLE1BQU07UUFDTixZQUFZO1FBQ1osWUFBWTtRQUVaLGFBQWE7b0hBV0YsY0FBYyxZQVBoQjtZQUNQLGNBQWM7WUFDZCxlQUFlO1NBQ2hCLEVBQ1MsZUFBZTttR0FHZCxjQUFjO2tCQVIxQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxjQUFjO3dCQUNkLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQztvQkFDakQsWUFBWSxFQUFFLHFCQUFxQjtpQkFDcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFJlY3ljbGVSb3dzLCBNYXRUYWJsZX0gZnJvbSAnLi90YWJsZSc7XG5pbXBvcnQge0Nka1RhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtcbiAgTWF0Q2VsbCxcbiAgTWF0Q2VsbERlZixcbiAgTWF0Q29sdW1uRGVmLFxuICBNYXRGb290ZXJDZWxsLFxuICBNYXRGb290ZXJDZWxsRGVmLFxuICBNYXRIZWFkZXJDZWxsLFxuICBNYXRIZWFkZXJDZWxsRGVmLFxufSBmcm9tICcuL2NlbGwnO1xuaW1wb3J0IHtcbiAgTWF0Rm9vdGVyUm93LFxuICBNYXRGb290ZXJSb3dEZWYsXG4gIE1hdEhlYWRlclJvdyxcbiAgTWF0SGVhZGVyUm93RGVmLFxuICBNYXRSb3csXG4gIE1hdFJvd0RlZixcbiAgTWF0Tm9EYXRhUm93XG59IGZyb20gJy4vcm93JztcbmltcG9ydCB7TWF0VGV4dENvbHVtbn0gZnJvbSAnLi90ZXh0LWNvbHVtbic7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbmNvbnN0IEVYUE9SVEVEX0RFQ0xBUkFUSU9OUyA9IFtcbiAgLy8gVGFibGVcbiAgTWF0VGFibGUsXG4gIE1hdFJlY3ljbGVSb3dzLFxuXG4gIC8vIFRlbXBsYXRlIGRlZnNcbiAgTWF0SGVhZGVyQ2VsbERlZixcbiAgTWF0SGVhZGVyUm93RGVmLFxuICBNYXRDb2x1bW5EZWYsXG4gIE1hdENlbGxEZWYsXG4gIE1hdFJvd0RlZixcbiAgTWF0Rm9vdGVyQ2VsbERlZixcbiAgTWF0Rm9vdGVyUm93RGVmLFxuXG4gIC8vIENlbGwgZGlyZWN0aXZlc1xuICBNYXRIZWFkZXJDZWxsLFxuICBNYXRDZWxsLFxuICBNYXRGb290ZXJDZWxsLFxuXG4gIC8vIFJvdyBkaXJlY3RpdmVzXG4gIE1hdEhlYWRlclJvdyxcbiAgTWF0Um93LFxuICBNYXRGb290ZXJSb3csXG4gIE1hdE5vRGF0YVJvdyxcblxuICBNYXRUZXh0Q29sdW1uLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENka1RhYmxlTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW01hdENvbW1vbk1vZHVsZSwgRVhQT1JURURfREVDTEFSQVRJT05TXSxcbiAgZGVjbGFyYXRpb25zOiBFWFBPUlRFRF9ERUNMQVJBVElPTlMsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYmxlTW9kdWxlIHt9XG4iXX0=