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
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog } from './dialog';
import { MatDialogContainer } from './dialog-container';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, } from './dialog-content-directives';
import * as i0 from "@angular/core";
export class MatDialogModule {
}
MatDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatDialogModule, declarations: [MatDialogContainer,
        MatDialogClose,
        MatDialogTitle,
        MatDialogActions,
        MatDialogContent], imports: [OverlayModule, PortalModule, MatCommonModule], exports: [MatDialogContainer,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatCommonModule] });
MatDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatDialogModule, providers: [MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER], imports: [[OverlayModule, PortalModule, MatCommonModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, PortalModule, MatCommonModule],
                    exports: [
                        MatDialogContainer,
                        MatDialogClose,
                        MatDialogTitle,
                        MatDialogContent,
                        MatDialogActions,
                        MatCommonModule,
                    ],
                    declarations: [
                        MatDialogContainer,
                        MatDialogClose,
                        MatDialogTitle,
                        MatDialogActions,
                        MatDialogContent,
                    ],
                    providers: [MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER],
                    entryComponents: [MatDialogContainer],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxtQ0FBbUMsRUFBRSxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDeEUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixjQUFjLEVBQ2QsZ0JBQWdCLEVBQ2hCLGNBQWMsR0FDZixNQUFNLDZCQUE2QixDQUFDOztBQXNCckMsTUFBTSxPQUFPLGVBQWU7O2lIQUFmLGVBQWU7a0hBQWYsZUFBZSxpQkFUeEIsa0JBQWtCO1FBQ2xCLGNBQWM7UUFDZCxjQUFjO1FBQ2QsZ0JBQWdCO1FBQ2hCLGdCQUFnQixhQWRSLGFBQWEsRUFBRSxZQUFZLEVBQUUsZUFBZSxhQUVwRCxrQkFBa0I7UUFDbEIsY0FBYztRQUNkLGNBQWM7UUFDZCxnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGVBQWU7a0hBWU4sZUFBZSxhQUhmLENBQUMsU0FBUyxFQUFFLG1DQUFtQyxDQUFDLFlBaEJsRCxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEVBT3JELGVBQWU7Z0dBWU4sZUFBZTtrQkFwQjNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3ZELE9BQU8sRUFBRTt3QkFDUCxrQkFBa0I7d0JBQ2xCLGNBQWM7d0JBQ2QsY0FBYzt3QkFDZCxnQkFBZ0I7d0JBQ2hCLGdCQUFnQjt3QkFDaEIsZUFBZTtxQkFDaEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGtCQUFrQjt3QkFDbEIsY0FBYzt3QkFDZCxjQUFjO3dCQUNkLGdCQUFnQjt3QkFDaEIsZ0JBQWdCO3FCQUNqQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxTQUFTLEVBQUUsbUNBQW1DLENBQUM7b0JBQzNELGVBQWUsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUN0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiwgTWF0RGlhbG9nfSBmcm9tICcuL2RpYWxvZyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbnRhaW5lcn0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7XG4gIE1hdERpYWxvZ0FjdGlvbnMsXG4gIE1hdERpYWxvZ0Nsb3NlLFxuICBNYXREaWFsb2dDb250ZW50LFxuICBNYXREaWFsb2dUaXRsZSxcbn0gZnJvbSAnLi9kaWFsb2ctY29udGVudC1kaXJlY3RpdmVzJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW092ZXJsYXlNb2R1bGUsIFBvcnRhbE1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdERpYWxvZ0NvbnRhaW5lcixcbiAgICBNYXREaWFsb2dDbG9zZSxcbiAgICBNYXREaWFsb2dUaXRsZSxcbiAgICBNYXREaWFsb2dDb250ZW50LFxuICAgIE1hdERpYWxvZ0FjdGlvbnMsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXREaWFsb2dDb250YWluZXIsXG4gICAgTWF0RGlhbG9nQ2xvc2UsXG4gICAgTWF0RGlhbG9nVGl0bGUsXG4gICAgTWF0RGlhbG9nQWN0aW9ucyxcbiAgICBNYXREaWFsb2dDb250ZW50LFxuICBdLFxuICBwcm92aWRlcnM6IFtNYXREaWFsb2csIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSXSxcbiAgZW50cnlDb21wb25lbnRzOiBbTWF0RGlhbG9nQ29udGFpbmVyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nTW9kdWxlIHt9XG4iXX0=