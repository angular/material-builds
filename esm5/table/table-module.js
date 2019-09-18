/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatTable } from './table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef, MatHeaderCell, MatHeaderCellDef } from './cell';
import { MatFooterRow, MatFooterRowDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef } from './row';
import { MatTextColumn } from './text-column';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
var EXPORTED_DECLARATIONS = [
    // Table
    MatTable,
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
    MatTextColumn,
];
var MatTableModule = /** @class */ (function () {
    function MatTableModule() {
    }
    MatTableModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CdkTableModule,
                        CommonModule,
                        MatCommonModule,
                    ],
                    exports: EXPORTED_DECLARATIONS,
                    declarations: EXPORTED_DECLARATIONS,
                },] }
    ];
    return MatTableModule;
}());
export { MatTableModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3RhYmxlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixnQkFBZ0IsRUFDakIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUNMLFlBQVksRUFDWixlQUFlLEVBQ2YsWUFBWSxFQUNaLGVBQWUsRUFDZixNQUFNLEVBQ04sU0FBUyxFQUNWLE1BQU0sT0FBTyxDQUFDO0FBQ2YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXZELElBQU0scUJBQXFCLEdBQUc7SUFDNUIsUUFBUTtJQUNSLFFBQVE7SUFFUixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixZQUFZO0lBQ1osVUFBVTtJQUNWLFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsZUFBZTtJQUVmLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsT0FBTztJQUNQLGFBQWE7SUFFYixpQkFBaUI7SUFDakIsWUFBWTtJQUNaLE1BQU07SUFDTixZQUFZO0lBRVosYUFBYTtDQUNkLENBQUM7QUFFRjtJQUFBO0lBUzZCLENBQUM7O2dCQVQ3QixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGNBQWM7d0JBQ2QsWUFBWTt3QkFDWixlQUFlO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixZQUFZLEVBQUUscUJBQXFCO2lCQUNwQzs7SUFDNEIscUJBQUM7Q0FBQSxBQVQ5QixJQVM4QjtTQUFqQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRUYWJsZX0gZnJvbSAnLi90YWJsZSc7XG5pbXBvcnQge0Nka1RhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtcbiAgTWF0Q2VsbCxcbiAgTWF0Q2VsbERlZixcbiAgTWF0Q29sdW1uRGVmLFxuICBNYXRGb290ZXJDZWxsLFxuICBNYXRGb290ZXJDZWxsRGVmLFxuICBNYXRIZWFkZXJDZWxsLFxuICBNYXRIZWFkZXJDZWxsRGVmXG59IGZyb20gJy4vY2VsbCc7XG5pbXBvcnQge1xuICBNYXRGb290ZXJSb3csXG4gIE1hdEZvb3RlclJvd0RlZixcbiAgTWF0SGVhZGVyUm93LFxuICBNYXRIZWFkZXJSb3dEZWYsXG4gIE1hdFJvdyxcbiAgTWF0Um93RGVmXG59IGZyb20gJy4vcm93JztcbmltcG9ydCB7TWF0VGV4dENvbHVtbn0gZnJvbSAnLi90ZXh0LWNvbHVtbic7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuY29uc3QgRVhQT1JURURfREVDTEFSQVRJT05TID0gW1xuICAvLyBUYWJsZVxuICBNYXRUYWJsZSxcblxuICAvLyBUZW1wbGF0ZSBkZWZzXG4gIE1hdEhlYWRlckNlbGxEZWYsXG4gIE1hdEhlYWRlclJvd0RlZixcbiAgTWF0Q29sdW1uRGVmLFxuICBNYXRDZWxsRGVmLFxuICBNYXRSb3dEZWYsXG4gIE1hdEZvb3RlckNlbGxEZWYsXG4gIE1hdEZvb3RlclJvd0RlZixcblxuICAvLyBDZWxsIGRpcmVjdGl2ZXNcbiAgTWF0SGVhZGVyQ2VsbCxcbiAgTWF0Q2VsbCxcbiAgTWF0Rm9vdGVyQ2VsbCxcblxuICAvLyBSb3cgZGlyZWN0aXZlc1xuICBNYXRIZWFkZXJSb3csXG4gIE1hdFJvdyxcbiAgTWF0Rm9vdGVyUm93LFxuXG4gIE1hdFRleHRDb2x1bW4sXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ2RrVGFibGVNb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogRVhQT1JURURfREVDTEFSQVRJT05TLFxuICBkZWNsYXJhdGlvbnM6IEVYUE9SVEVEX0RFQ0xBUkFUSU9OUyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFibGVNb2R1bGUge31cbiJdfQ==