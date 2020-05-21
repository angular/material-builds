import { __decorate } from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from './drawer';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from './sidenav';
let MatSidenavModule = /** @class */ (() => {
    let MatSidenavModule = class MatSidenavModule {
    };
    MatSidenavModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                MatCommonModule,
                PlatformModule,
                CdkScrollableModule,
            ],
            exports: [
                CdkScrollableModule,
                MatCommonModule,
                MatDrawer,
                MatDrawerContainer,
                MatDrawerContent,
                MatSidenav,
                MatSidenavContainer,
                MatSidenavContent,
            ],
            declarations: [
                MatDrawer,
                MatDrawerContainer,
                MatDrawerContent,
                MatSidenav,
                MatSidenavContainer,
                MatSidenavContent,
            ],
        })
    ], MatSidenavModule);
    return MatSidenavModule;
})();
export { MatSidenavModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9zaWRlbmF2LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUE2QjdFO0lBQUEsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7S0FBRyxDQUFBO0lBQW5CLGdCQUFnQjtRQTFCNUIsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLFlBQVk7Z0JBQ1osZUFBZTtnQkFDZixjQUFjO2dCQUNkLG1CQUFtQjthQUNwQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxtQkFBbUI7Z0JBQ25CLGVBQWU7Z0JBQ2YsU0FBUztnQkFDVCxrQkFBa0I7Z0JBQ2xCLGdCQUFnQjtnQkFDaEIsVUFBVTtnQkFDVixtQkFBbUI7Z0JBQ25CLGlCQUFpQjthQUNsQjtZQUNELFlBQVksRUFBRTtnQkFDWixTQUFTO2dCQUNULGtCQUFrQjtnQkFDbEIsZ0JBQWdCO2dCQUNoQixVQUFVO2dCQUNWLG1CQUFtQjtnQkFDbkIsaUJBQWlCO2FBQ2xCO1NBQ0YsQ0FBQztPQUNXLGdCQUFnQixDQUFHO0lBQUQsdUJBQUM7S0FBQTtTQUFuQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7UGxhdGZvcm1Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0RHJhd2VyLCBNYXREcmF3ZXJDb250YWluZXIsIE1hdERyYXdlckNvbnRlbnR9IGZyb20gJy4vZHJhd2VyJztcbmltcG9ydCB7TWF0U2lkZW5hdiwgTWF0U2lkZW5hdkNvbnRhaW5lciwgTWF0U2lkZW5hdkNvbnRlbnR9IGZyb20gJy4vc2lkZW5hdic7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgUGxhdGZvcm1Nb2R1bGUsXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdERyYXdlcixcbiAgICBNYXREcmF3ZXJDb250YWluZXIsXG4gICAgTWF0RHJhd2VyQ29udGVudCxcbiAgICBNYXRTaWRlbmF2LFxuICAgIE1hdFNpZGVuYXZDb250YWluZXIsXG4gICAgTWF0U2lkZW5hdkNvbnRlbnQsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdERyYXdlcixcbiAgICBNYXREcmF3ZXJDb250YWluZXIsXG4gICAgTWF0RHJhd2VyQ29udGVudCxcbiAgICBNYXRTaWRlbmF2LFxuICAgIE1hdFNpZGVuYXZDb250YWluZXIsXG4gICAgTWF0U2lkZW5hdkNvbnRlbnQsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNpZGVuYXZNb2R1bGUge31cbiJdfQ==