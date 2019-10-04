/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatMenuContent } from './menu-content';
import { _MatMenu, _MatMenuBase, MatMenu } from './menu';
import { MatMenuItem } from './menu-item';
import { MatMenuTrigger, MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './menu-trigger';
/**
 * Used by both the current `MatMenuModule` and the MDC `MatMenuModule`
 * to declare the menu-related directives.
 */
var _MatMenuDirectivesModule = /** @class */ (function () {
    function _MatMenuDirectivesModule() {
    }
    _MatMenuDirectivesModule.decorators = [
        { type: NgModule, args: [{
                    exports: [MatMenuTrigger, MatMenuContent, MatCommonModule],
                    declarations: [
                        MatMenuTrigger,
                        MatMenuContent,
                        // TODO(devversion): remove when `MatMenu` becomes a selectorless Directive.
                        MatMenu,
                        // TODO(devversion): remove when `_MatMenuBase` becomes a selectorless Directive.
                        _MatMenuBase
                    ],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
                },] }
    ];
    return _MatMenuDirectivesModule;
}());
export { _MatMenuDirectivesModule };
var MatMenuModule = /** @class */ (function () {
    function MatMenuModule() {
    }
    MatMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        MatCommonModule,
                        MatRippleModule,
                        OverlayModule,
                        _MatMenuDirectivesModule,
                    ],
                    exports: [_MatMenu, MatMenuItem, _MatMenuDirectivesModule],
                    declarations: [_MatMenu, MatMenuItem],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
                },] }
    ];
    return MatMenuModule;
}());
export { MatMenuModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUNMLGNBQWMsRUFDZCx5Q0FBeUMsR0FDMUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4Qjs7O0dBR0c7QUFDSDtJQUFBO0lBYXVDLENBQUM7O2dCQWJ2QyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUM7b0JBQzFELFlBQVksRUFBRTt3QkFDWixjQUFjO3dCQUNkLGNBQWM7d0JBQ2QsNEVBQTRFO3dCQUM1RSxPQUFPO3dCQUNQLGlGQUFpRjt3QkFDakYsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdkQ7O0lBRXNDLCtCQUFDO0NBQUEsQUFieEMsSUFhd0M7U0FBM0Isd0JBQXdCO0FBRXJDO0lBQUE7SUFZNEIsQ0FBQzs7Z0JBWjVCLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYix3QkFBd0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsd0JBQXdCLENBQUM7b0JBQzFELFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDLHlDQUF5QyxDQUFDO2lCQUN2RDs7SUFDMkIsb0JBQUM7Q0FBQSxBQVo3QixJQVk2QjtTQUFoQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtfTWF0TWVudSwgX01hdE1lbnVCYXNlLCBNYXRNZW51fSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtcbiAgTWF0TWVudVRyaWdnZXIsXG4gIE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLFxufSBmcm9tICcuL21lbnUtdHJpZ2dlcic7XG5cbi8qKlxuICogVXNlZCBieSBib3RoIHRoZSBjdXJyZW50IGBNYXRNZW51TW9kdWxlYCBhbmQgdGhlIE1EQyBgTWF0TWVudU1vZHVsZWBcbiAqIHRvIGRlY2xhcmUgdGhlIG1lbnUtcmVsYXRlZCBkaXJlY3RpdmVzLlxuICovXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbTWF0TWVudVRyaWdnZXIsIE1hdE1lbnVDb250ZW50LCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRNZW51VHJpZ2dlcixcbiAgICBNYXRNZW51Q29udGVudCxcbiAgICAvLyBUT0RPKGRldnZlcnNpb24pOiByZW1vdmUgd2hlbiBgTWF0TWVudWAgYmVjb21lcyBhIHNlbGVjdG9ybGVzcyBEaXJlY3RpdmUuXG4gICAgTWF0TWVudSxcbiAgICAvLyBUT0RPKGRldnZlcnNpb24pOiByZW1vdmUgd2hlbiBgX01hdE1lbnVCYXNlYCBiZWNvbWVzIGEgc2VsZWN0b3JsZXNzIERpcmVjdGl2ZS5cbiAgICBfTWF0TWVudUJhc2VcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0TWVudURpcmVjdGl2ZXNNb2R1bGUge31cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE92ZXJsYXlNb2R1bGUsXG4gICAgX01hdE1lbnVEaXJlY3RpdmVzTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbX01hdE1lbnUsIE1hdE1lbnVJdGVtLCBfTWF0TWVudURpcmVjdGl2ZXNNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtfTWF0TWVudSwgTWF0TWVudUl0ZW1dLFxuICBwcm92aWRlcnM6IFtNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl1cbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudU1vZHVsZSB7fVxuIl19