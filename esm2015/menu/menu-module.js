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
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { _MatMenu } from './menu';
import { MatMenuContent } from './menu-content';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, MatMenuTrigger } from './menu-trigger';
/**
 * Used by both the current `MatMenuModule` and the MDC `MatMenuModule`
 * to declare the menu-related directives.
 */
let _MatMenuDirectivesModule = /** @class */ (() => {
    let _MatMenuDirectivesModule = 
    // tslint:disable-next-line:class-name
    class _MatMenuDirectivesModule {
    };
    _MatMenuDirectivesModule = __decorate([
        NgModule({
            exports: [MatMenuTrigger, MatMenuContent, MatCommonModule],
            declarations: [
                MatMenuTrigger,
                MatMenuContent,
            ],
            providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
        })
        // tslint:disable-next-line:class-name
    ], _MatMenuDirectivesModule);
    return _MatMenuDirectivesModule;
})();
export { _MatMenuDirectivesModule };
let MatMenuModule = /** @class */ (() => {
    let MatMenuModule = class MatMenuModule {
    };
    MatMenuModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                MatCommonModule,
                MatRippleModule,
                OverlayModule,
                _MatMenuDirectivesModule,
            ],
            exports: [CdkScrollableModule, MatCommonModule, _MatMenu, MatMenuItem, _MatMenuDirectivesModule],
            declarations: [_MatMenu, MatMenuItem],
            providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
        })
    ], MatMenuModule);
    return MatMenuModule;
})();
export { MatMenuModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNoQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMseUNBQXlDLEVBQUUsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekY7OztHQUdHO0FBVUg7SUFBQSxJQUFhLHdCQUF3QjtJQURyQyxzQ0FBc0M7SUFDdEMsTUFBYSx3QkFBd0I7S0FBRyxDQUFBO0lBQTNCLHdCQUF3QjtRQVRwQyxRQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQztZQUMxRCxZQUFZLEVBQUU7Z0JBQ1osY0FBYztnQkFDZCxjQUFjO2FBQ2Y7WUFDRCxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQztTQUN2RCxDQUFDO1FBQ0Ysc0NBQXNDO09BQ3pCLHdCQUF3QixDQUFHO0lBQUQsK0JBQUM7S0FBQTtTQUEzQix3QkFBd0I7QUFjckM7SUFBQSxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0tBQUcsQ0FBQTtJQUFoQixhQUFhO1FBWnpCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRTtnQkFDUCxZQUFZO2dCQUNaLGVBQWU7Z0JBQ2YsZUFBZTtnQkFDZixhQUFhO2dCQUNiLHdCQUF3QjthQUN6QjtZQUNELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixDQUFDO1lBQ2hHLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7WUFDckMsU0FBUyxFQUFFLENBQUMseUNBQXlDLENBQUM7U0FDdkQsQ0FBQztPQUNXLGFBQWEsQ0FBRztJQUFELG9CQUFDO0tBQUE7U0FBaEIsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge19NYXRNZW51fSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IHtNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiwgTWF0TWVudVRyaWdnZXJ9IGZyb20gJy4vbWVudS10cmlnZ2VyJztcblxuLyoqXG4gKiBVc2VkIGJ5IGJvdGggdGhlIGN1cnJlbnQgYE1hdE1lbnVNb2R1bGVgIGFuZCB0aGUgTURDIGBNYXRNZW51TW9kdWxlYFxuICogdG8gZGVjbGFyZSB0aGUgbWVudS1yZWxhdGVkIGRpcmVjdGl2ZXMuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtNYXRNZW51VHJpZ2dlciwgTWF0TWVudUNvbnRlbnQsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdE1lbnVUcmlnZ2VyLFxuICAgIE1hdE1lbnVDb250ZW50LFxuICBdLFxuICBwcm92aWRlcnM6IFtNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl1cbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGNsYXNzIF9NYXRNZW51RGlyZWN0aXZlc01vZHVsZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRSaXBwbGVNb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBfTWF0TWVudURpcmVjdGl2ZXNNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtDZGtTY3JvbGxhYmxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIF9NYXRNZW51LCBNYXRNZW51SXRlbSwgX01hdE1lbnVEaXJlY3RpdmVzTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbX01hdE1lbnUsIE1hdE1lbnVJdGVtXSxcbiAgcHJvdmlkZXJzOiBbTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVNb2R1bGUge31cbiJdfQ==