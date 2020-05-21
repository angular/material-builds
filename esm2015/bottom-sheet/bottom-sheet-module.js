/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatBottomSheetContainer } from './bottom-sheet-container';
let MatBottomSheetModule = /** @class */ (() => {
    let MatBottomSheetModule = class MatBottomSheetModule {
    };
    MatBottomSheetModule = __decorate([
        NgModule({
            imports: [
                OverlayModule,
                MatCommonModule,
                PortalModule,
            ],
            exports: [MatBottomSheetContainer, MatCommonModule],
            declarations: [MatBottomSheetContainer],
            entryComponents: [MatBottomSheetContainer],
        })
    ], MatBottomSheetModule);
    return MatBottomSheetModule;
})();
export { MatBottomSheetModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQWFqRTtJQUFBLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0tBQUcsQ0FBQTtJQUF2QixvQkFBb0I7UUFWaEMsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLGFBQWE7Z0JBQ2IsZUFBZTtnQkFDZixZQUFZO2FBQ2I7WUFDRCxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxlQUFlLENBQUM7WUFDbkQsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDdkMsZUFBZSxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDM0MsQ0FBQztPQUNXLG9CQUFvQixDQUFHO0lBQUQsMkJBQUM7S0FBQTtTQUF2QixvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRDb250YWluZXJ9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbnRhaW5lcic7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE92ZXJsYXlNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW01hdEJvdHRvbVNoZWV0Q29udGFpbmVyLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRCb3R0b21TaGVldENvbnRhaW5lcl0sXG4gIGVudHJ5Q29tcG9uZW50czogW01hdEJvdHRvbVNoZWV0Q29udGFpbmVyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Qm90dG9tU2hlZXRNb2R1bGUge31cbiJdfQ==