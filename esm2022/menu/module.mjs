/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatMenu } from './menu';
import { MatMenuItem } from './menu-item';
import { MatMenuContent } from './menu-content';
import { MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, MatMenuTrigger } from './menu-trigger';
import * as i0 from "@angular/core";
class MatMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatMenuModule, declarations: [MatMenu, MatMenuItem, MatMenuContent, MatMenuTrigger], imports: [CommonModule, MatRippleModule, MatCommonModule, OverlayModule], exports: [CdkScrollableModule,
            MatMenu,
            MatCommonModule,
            MatMenuItem,
            MatMenuContent,
            MatMenuTrigger] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuModule, providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule, MatRippleModule, MatCommonModule, OverlayModule, CdkScrollableModule,
            MatCommonModule] }); }
}
export { MatMenuModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatRippleModule, MatCommonModule, OverlayModule],
                    exports: [
                        CdkScrollableModule,
                        MatMenu,
                        MatCommonModule,
                        MatMenuItem,
                        MatMenuContent,
                        MatMenuTrigger,
                    ],
                    declarations: [MatMenu, MatMenuItem, MatMenuContent, MatMenuTrigger],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLHlDQUF5QyxFQUFFLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDOztBQUV6RixNQWFhLGFBQWE7OEdBQWIsYUFBYTsrR0FBYixhQUFhLGlCQUhULE9BQU8sRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLGNBQWMsYUFUekQsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxhQUVyRSxtQkFBbUI7WUFDbkIsT0FBTztZQUNQLGVBQWU7WUFDZixXQUFXO1lBQ1gsY0FBYztZQUNkLGNBQWM7K0dBS0wsYUFBYSxhQUZiLENBQUMseUNBQXlDLENBQUMsWUFWNUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUVyRSxtQkFBbUI7WUFFbkIsZUFBZTs7U0FRTixhQUFhOzJGQUFiLGFBQWE7a0JBYnpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxDQUFDO29CQUN4RSxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3dCQUNuQixPQUFPO3dCQUNQLGVBQWU7d0JBQ2YsV0FBVzt3QkFDWCxjQUFjO3dCQUNkLGNBQWM7cUJBQ2Y7b0JBQ0QsWUFBWSxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDO29CQUNwRSxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtNYXRNZW51fSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiwgTWF0TWVudVRyaWdnZXJ9IGZyb20gJy4vbWVudS10cmlnZ2VyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE92ZXJsYXlNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRNZW51LFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRNZW51SXRlbSxcbiAgICBNYXRNZW51Q29udGVudCxcbiAgICBNYXRNZW51VHJpZ2dlcixcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TWVudSwgTWF0TWVudUl0ZW0sIE1hdE1lbnVDb250ZW50LCBNYXRNZW51VHJpZ2dlcl0sXG4gIHByb3ZpZGVyczogW01BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudU1vZHVsZSB7fVxuIl19