/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelect, MatSelectTrigger } from './select';
let MatSelectModule = /** @class */ (() => {
    let MatSelectModule = class MatSelectModule {
    };
    MatSelectModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                OverlayModule,
                MatOptionModule,
                MatCommonModule,
            ],
            exports: [
                CdkScrollableModule,
                MatFormFieldModule,
                MatSelect,
                MatSelectTrigger,
                MatOptionModule,
                MatCommonModule
            ],
            declarations: [MatSelect, MatSelectTrigger],
            providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER]
        })
    ], MatSelectModule);
    return MatSelectModule;
})();
export { MatSelectModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zZWxlY3Qvc2VsZWN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLG1DQUFtQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQXFCMUY7SUFBQSxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0tBQUcsQ0FBQTtJQUFsQixlQUFlO1FBbEIzQixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsWUFBWTtnQkFDWixhQUFhO2dCQUNiLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxtQkFBbUI7Z0JBQ25CLGtCQUFrQjtnQkFDbEIsU0FBUztnQkFDVCxnQkFBZ0I7Z0JBQ2hCLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtZQUNELFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztZQUMzQyxTQUFTLEVBQUUsQ0FBQyxtQ0FBbUMsQ0FBQztTQUNqRCxDQUFDO09BQ1csZUFBZSxDQUFHO0lBQUQsc0JBQUM7S0FBQTtTQUFsQixlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRPcHRpb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7TUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVIsIE1hdFNlbGVjdCwgTWF0U2VsZWN0VHJpZ2dlcn0gZnJvbSAnLi9zZWxlY3QnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBNYXRPcHRpb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0U2VsZWN0LFxuICAgIE1hdFNlbGVjdFRyaWdnZXIsXG4gICAgTWF0T3B0aW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRTZWxlY3QsIE1hdFNlbGVjdFRyaWdnZXJdLFxuICBwcm92aWRlcnM6IFtNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl1cbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0TW9kdWxlIHt9XG4iXX0=