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
MatBottomSheetModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatBottomSheetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatBottomSheetModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatBottomSheetModule, declarations: [MatBottomSheetContainer], imports: [OverlayModule, MatCommonModule, PortalModule], exports: [MatBottomSheetContainer, MatCommonModule] });
MatBottomSheetModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatBottomSheetModule, imports: [[OverlayModule, MatCommonModule, PortalModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatBottomSheetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, MatCommonModule, PortalModule],
                    exports: [MatBottomSheetContainer, MatCommonModule],
                    declarations: [MatBottomSheetContainer],
                    entryComponents: [MatBottomSheetContainer],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQVFqRSxNQUFNLE9BQU8sb0JBQW9COztzSEFBcEIsb0JBQW9CO3VIQUFwQixvQkFBb0IsaUJBSGhCLHVCQUF1QixhQUY1QixhQUFhLEVBQUUsZUFBZSxFQUFFLFlBQVksYUFDNUMsdUJBQXVCLEVBQUUsZUFBZTt1SEFJdkMsb0JBQW9CLFlBTHRCLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsRUFDcEIsZUFBZTtnR0FJdkMsb0JBQW9CO2tCQU5oQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDO29CQUN2RCxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxlQUFlLENBQUM7b0JBQ25ELFlBQVksRUFBRSxDQUFDLHVCQUF1QixDQUFDO29CQUN2QyxlQUFlLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRDb250YWluZXJ9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbnRhaW5lcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtPdmVybGF5TW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIFBvcnRhbE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRCb3R0b21TaGVldENvbnRhaW5lciwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0Qm90dG9tU2hlZXRDb250YWluZXJdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtNYXRCb3R0b21TaGVldENvbnRhaW5lcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJvdHRvbVNoZWV0TW9kdWxlIHt9XG4iXX0=