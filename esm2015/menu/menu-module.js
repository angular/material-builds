/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
// tslint:disable-next-line:class-name
export class _MatMenuDirectivesModule {
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
export class MatMenuModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDdkQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLHlDQUF5QyxHQUMxQyxNQUFNLGdCQUFnQixDQUFDOzs7OztBQWtCeEIsc0NBQXNDO0FBQ3RDLE1BQU0sT0FBTyx3QkFBd0I7OztZQWJwQyxRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUM7Z0JBQzFELFlBQVksRUFBRTtvQkFDWixjQUFjO29CQUNkLGNBQWM7b0JBQ2QsNEVBQTRFO29CQUM1RSxPQUFPO29CQUNQLGlGQUFpRjtvQkFDakYsWUFBWTtpQkFDYjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQzthQUN2RDs7QUFnQkQsTUFBTSxPQUFPLGFBQWE7OztZQVp6QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixlQUFlO29CQUNmLGFBQWE7b0JBQ2Isd0JBQXdCO2lCQUN6QjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixDQUFDO2dCQUMxRCxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDO2dCQUNyQyxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQzthQUN2RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0TWVudUNvbnRlbnR9IGZyb20gJy4vbWVudS1jb250ZW50JztcbmltcG9ydCB7X01hdE1lbnUsIF9NYXRNZW51QmFzZSwgTWF0TWVudX0gZnJvbSAnLi9tZW51JztcbmltcG9ydCB7TWF0TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmltcG9ydCB7XG4gIE1hdE1lbnVUcmlnZ2VyLFxuICBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi9tZW51LXRyaWdnZXInO1xuXG4vKipcbiAqIFVzZWQgYnkgYm90aCB0aGUgY3VycmVudCBgTWF0TWVudU1vZHVsZWAgYW5kIHRoZSBNREMgYE1hdE1lbnVNb2R1bGVgXG4gKiB0byBkZWNsYXJlIHRoZSBtZW51LXJlbGF0ZWQgZGlyZWN0aXZlcy5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW01hdE1lbnVUcmlnZ2VyLCBNYXRNZW51Q29udGVudCwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0TWVudVRyaWdnZXIsXG4gICAgTWF0TWVudUNvbnRlbnQsXG4gICAgLy8gVE9ETyhkZXZ2ZXJzaW9uKTogcmVtb3ZlIHdoZW4gYE1hdE1lbnVgIGJlY29tZXMgYSBzZWxlY3Rvcmxlc3MgRGlyZWN0aXZlLlxuICAgIE1hdE1lbnUsXG4gICAgLy8gVE9ETyhkZXZ2ZXJzaW9uKTogcmVtb3ZlIHdoZW4gYF9NYXRNZW51QmFzZWAgYmVjb21lcyBhIHNlbGVjdG9ybGVzcyBEaXJlY3RpdmUuXG4gICAgX01hdE1lbnVCYXNlXG4gIF0sXG4gIHByb3ZpZGVyczogW01BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXVxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdE1lbnVEaXJlY3RpdmVzTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIF9NYXRNZW51RGlyZWN0aXZlc01vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW19NYXRNZW51LCBNYXRNZW51SXRlbSwgX01hdE1lbnVEaXJlY3RpdmVzTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbX01hdE1lbnUsIE1hdE1lbnVJdGVtXSxcbiAgcHJvdmlkZXJzOiBbTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVNb2R1bGUge31cbiJdfQ==