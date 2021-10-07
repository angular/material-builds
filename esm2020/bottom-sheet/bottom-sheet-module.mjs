/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatBottomSheetContainer } from './bottom-sheet-container';
import * as i0 from "@angular/core";
export class MatBottomSheetModule {
}
MatBottomSheetModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBottomSheetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatBottomSheetModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBottomSheetModule, declarations: [MatBottomSheetContainer], imports: [OverlayModule,
        MatCommonModule,
        PortalModule], exports: [MatBottomSheetContainer, MatCommonModule] });
MatBottomSheetModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBottomSheetModule, imports: [[
            OverlayModule,
            MatCommonModule,
            PortalModule,
        ], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBottomSheetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        OverlayModule,
                        MatCommonModule,
                        PortalModule,
                    ],
                    exports: [MatBottomSheetContainer, MatCommonModule],
                    declarations: [MatBottomSheetContainer],
                    entryComponents: [MatBottomSheetContainer],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQWFqRSxNQUFNLE9BQU8sb0JBQW9COzt5SEFBcEIsb0JBQW9COzBIQUFwQixvQkFBb0IsaUJBSGhCLHVCQUF1QixhQUxwQyxhQUFhO1FBQ2IsZUFBZTtRQUNmLFlBQVksYUFFSix1QkFBdUIsRUFBRSxlQUFlOzBIQUl2QyxvQkFBb0IsWUFUdEI7WUFDUCxhQUFhO1lBQ2IsZUFBZTtZQUNmLFlBQVk7U0FDYixFQUNrQyxlQUFlO21HQUl2QyxvQkFBb0I7a0JBVmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixZQUFZO3FCQUNiO29CQUNELE9BQU8sRUFBRSxDQUFDLHVCQUF1QixFQUFFLGVBQWUsQ0FBQztvQkFDbkQsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ3ZDLGVBQWUsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUMzQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldENvbnRhaW5lcn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29udGFpbmVyJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgUG9ydGFsTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbTWF0Qm90dG9tU2hlZXRDb250YWluZXIsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdEJvdHRvbVNoZWV0Q29udGFpbmVyXSxcbiAgZW50cnlDb21wb25lbnRzOiBbTWF0Qm90dG9tU2hlZXRDb250YWluZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldE1vZHVsZSB7fVxuIl19