/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DialogModule } from '@angular/cdk/dialog';
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
MatDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.0", ngImport: i0, type: MatDialogModule, declarations: [MatDialogContainer,
        MatDialogClose,
        MatDialogTitle,
        MatDialogActions,
        MatDialogContent], imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule], exports: [MatDialogContainer,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatCommonModule] });
MatDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogModule, providers: [MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER], imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule],
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsbUNBQW1DLEVBQUUsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkLGdCQUFnQixFQUNoQixjQUFjLEdBQ2YsTUFBTSw2QkFBNkIsQ0FBQzs7QUFxQnJDLE1BQU0sT0FBTyxlQUFlOzs0R0FBZixlQUFlOzZHQUFmLGVBQWUsaUJBUnhCLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QsY0FBYztRQUNkLGdCQUFnQjtRQUNoQixnQkFBZ0IsYUFkUixZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLGFBRWxFLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QsY0FBYztRQUNkLGdCQUFnQjtRQUNoQixnQkFBZ0I7UUFDaEIsZUFBZTs2R0FXTixlQUFlLGFBRmYsQ0FBQyxTQUFTLEVBQUUsbUNBQW1DLENBQUMsWUFoQmpELFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFPbEUsZUFBZTsyRkFXTixlQUFlO2tCQW5CM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3JFLE9BQU8sRUFBRTt3QkFDUCxrQkFBa0I7d0JBQ2xCLGNBQWM7d0JBQ2QsY0FBYzt3QkFDZCxnQkFBZ0I7d0JBQ2hCLGdCQUFnQjt3QkFDaEIsZUFBZTtxQkFDaEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGtCQUFrQjt3QkFDbEIsY0FBYzt3QkFDZCxjQUFjO3dCQUNkLGdCQUFnQjt3QkFDaEIsZ0JBQWdCO3FCQUNqQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxTQUFTLEVBQUUsbUNBQW1DLENBQUM7aUJBQzVEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlhbG9nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvZGlhbG9nJztcbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtQb3J0YWxNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSLCBNYXREaWFsb2d9IGZyb20gJy4vZGlhbG9nJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuaW1wb3J0IHtcbiAgTWF0RGlhbG9nQWN0aW9ucyxcbiAgTWF0RGlhbG9nQ2xvc2UsXG4gIE1hdERpYWxvZ0NvbnRlbnQsXG4gIE1hdERpYWxvZ1RpdGxlLFxufSBmcm9tICcuL2RpYWxvZy1jb250ZW50LWRpcmVjdGl2ZXMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbRGlhbG9nTW9kdWxlLCBPdmVybGF5TW9kdWxlLCBQb3J0YWxNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXREaWFsb2dDb250YWluZXIsXG4gICAgTWF0RGlhbG9nQ2xvc2UsXG4gICAgTWF0RGlhbG9nVGl0bGUsXG4gICAgTWF0RGlhbG9nQ29udGVudCxcbiAgICBNYXREaWFsb2dBY3Rpb25zLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgIE1hdERpYWxvZ0Nsb3NlLFxuICAgIE1hdERpYWxvZ1RpdGxlLFxuICAgIE1hdERpYWxvZ0FjdGlvbnMsXG4gICAgTWF0RGlhbG9nQ29udGVudCxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTWF0RGlhbG9nLCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ01vZHVsZSB7fVxuIl19