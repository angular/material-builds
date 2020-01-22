/**
 * @fileoverview added by tsickle
 * Generated from: src/material/table/table-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { MatCommonModule } from '@angular/material/core';
/** @type {?} */
const EXPORTED_DECLARATIONS = [
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
export class MatTableModule {
}
MatTableModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CdkTableModule,
                    MatCommonModule,
                ],
                exports: EXPORTED_DECLARATIONS,
                declarations: EXPORTED_DECLARATIONS,
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3RhYmxlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixnQkFBZ0IsRUFDakIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUNMLFlBQVksRUFDWixlQUFlLEVBQ2YsWUFBWSxFQUNaLGVBQWUsRUFDZixNQUFNLEVBQ04sU0FBUyxFQUNWLE1BQU0sT0FBTyxDQUFDO0FBQ2YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7O01BRWpELHFCQUFxQixHQUFHO0lBQzVCLFFBQVE7SUFDUixRQUFRO0lBRVIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsWUFBWTtJQUNaLFVBQVU7SUFDVixTQUFTO0lBQ1QsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFFZixrQkFBa0I7SUFDbEIsYUFBYTtJQUNiLE9BQU87SUFDUCxhQUFhO0lBRWIsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWixNQUFNO0lBQ04sWUFBWTtJQUVaLGFBQWE7Q0FDZDtBQVVELE1BQU0sT0FBTyxjQUFjOzs7WUFSMUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxjQUFjO29CQUNkLGVBQWU7aUJBQ2hCO2dCQUNELE9BQU8sRUFBRSxxQkFBcUI7Z0JBQzlCLFlBQVksRUFBRSxxQkFBcUI7YUFDcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFRhYmxlfSBmcm9tICcuL3RhYmxlJztcbmltcG9ydCB7Q2RrVGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge1xuICBNYXRDZWxsLFxuICBNYXRDZWxsRGVmLFxuICBNYXRDb2x1bW5EZWYsXG4gIE1hdEZvb3RlckNlbGwsXG4gIE1hdEZvb3RlckNlbGxEZWYsXG4gIE1hdEhlYWRlckNlbGwsXG4gIE1hdEhlYWRlckNlbGxEZWZcbn0gZnJvbSAnLi9jZWxsJztcbmltcG9ydCB7XG4gIE1hdEZvb3RlclJvdyxcbiAgTWF0Rm9vdGVyUm93RGVmLFxuICBNYXRIZWFkZXJSb3csXG4gIE1hdEhlYWRlclJvd0RlZixcbiAgTWF0Um93LFxuICBNYXRSb3dEZWZcbn0gZnJvbSAnLi9yb3cnO1xuaW1wb3J0IHtNYXRUZXh0Q29sdW1ufSBmcm9tICcuL3RleHQtY29sdW1uJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuY29uc3QgRVhQT1JURURfREVDTEFSQVRJT05TID0gW1xuICAvLyBUYWJsZVxuICBNYXRUYWJsZSxcblxuICAvLyBUZW1wbGF0ZSBkZWZzXG4gIE1hdEhlYWRlckNlbGxEZWYsXG4gIE1hdEhlYWRlclJvd0RlZixcbiAgTWF0Q29sdW1uRGVmLFxuICBNYXRDZWxsRGVmLFxuICBNYXRSb3dEZWYsXG4gIE1hdEZvb3RlckNlbGxEZWYsXG4gIE1hdEZvb3RlclJvd0RlZixcblxuICAvLyBDZWxsIGRpcmVjdGl2ZXNcbiAgTWF0SGVhZGVyQ2VsbCxcbiAgTWF0Q2VsbCxcbiAgTWF0Rm9vdGVyQ2VsbCxcblxuICAvLyBSb3cgZGlyZWN0aXZlc1xuICBNYXRIZWFkZXJSb3csXG4gIE1hdFJvdyxcbiAgTWF0Rm9vdGVyUm93LFxuXG4gIE1hdFRleHRDb2x1bW4sXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ2RrVGFibGVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBFWFBPUlRFRF9ERUNMQVJBVElPTlMsXG4gIGRlY2xhcmF0aW9uczogRVhQT1JURURfREVDTEFSQVRJT05TLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJsZU1vZHVsZSB7fVxuIl19