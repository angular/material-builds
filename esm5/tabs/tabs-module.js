/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatInkBar } from './ink-bar';
import { MatTab } from './tab';
import { MatTabBody, MatTabBodyPortal, _MatTabBodyBase } from './tab-body';
import { MatTabContent } from './tab-content';
import { MatTabGroup, _MatTabGroupBase } from './tab-group';
import { MatTabHeader, _MatTabHeaderBase } from './tab-header';
import { MatTabLabel } from './tab-label';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { MatTabLink, MatTabNav, _MatTabNavBase, _MatTabLinkBase } from './tab-nav-bar/tab-nav-bar';
import { MatPaginatedTabHeader } from './paginated-tab-header';
var MatTabsModule = /** @class */ (function () {
    function MatTabsModule() {
    }
    MatTabsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        MatCommonModule,
                        PortalModule,
                        MatRippleModule,
                        ObserversModule,
                        A11yModule,
                    ],
                    // Don't export all components because some are only to be used internally.
                    exports: [
                        MatCommonModule,
                        MatTabGroup,
                        MatTabLabel,
                        MatTab,
                        MatTabNav,
                        MatTabLink,
                        MatTabContent,
                    ],
                    declarations: [
                        MatTabGroup,
                        MatTabLabel,
                        MatTab,
                        MatInkBar,
                        MatTabLabelWrapper,
                        MatTabNav,
                        MatTabLink,
                        MatTabBody,
                        MatTabBodyPortal,
                        MatTabHeader,
                        MatTabContent,
                        // TODO(crisbeto): these can be removed once they're turned into selector-less directives.
                        MatPaginatedTabHeader,
                        _MatTabGroupBase,
                        _MatTabNavBase,
                        _MatTabBodyBase,
                        _MatTabHeaderBase,
                        _MatTabLinkBase,
                    ],
                },] }
    ];
    return MatTabsModule;
}());
export { MatTabsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWJzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM3QixPQUFPLEVBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN6RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM3RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNqRyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUc3RDtJQUFBO0lBeUM0QixDQUFDOztnQkF6QzVCLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3dCQUNmLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixlQUFlO3dCQUNmLFVBQVU7cUJBQ1g7b0JBQ0QsMkVBQTJFO29CQUMzRSxPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixXQUFXO3dCQUNYLFdBQVc7d0JBQ1gsTUFBTTt3QkFDTixTQUFTO3dCQUNULFVBQVU7d0JBQ1YsYUFBYTtxQkFDZDtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osV0FBVzt3QkFDWCxXQUFXO3dCQUNYLE1BQU07d0JBQ04sU0FBUzt3QkFDVCxrQkFBa0I7d0JBQ2xCLFNBQVM7d0JBQ1QsVUFBVTt3QkFDVixVQUFVO3dCQUNWLGdCQUFnQjt3QkFDaEIsWUFBWTt3QkFDWixhQUFhO3dCQUViLDBGQUEwRjt3QkFDMUYscUJBQTRCO3dCQUM1QixnQkFBdUI7d0JBQ3ZCLGNBQXFCO3dCQUNyQixlQUFzQjt3QkFDdEIsaUJBQXdCO3dCQUN4QixlQUFzQjtxQkFDdkI7aUJBQ0Y7O0lBQzJCLG9CQUFDO0NBQUEsQUF6QzdCLElBeUM2QjtTQUFoQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0ExMXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRJbmtCYXJ9IGZyb20gJy4vaW5rLWJhcic7XG5pbXBvcnQge01hdFRhYn0gZnJvbSAnLi90YWInO1xuaW1wb3J0IHtNYXRUYWJCb2R5LCBNYXRUYWJCb2R5UG9ydGFsLCBfTWF0VGFiQm9keUJhc2V9IGZyb20gJy4vdGFiLWJvZHknO1xuaW1wb3J0IHtNYXRUYWJDb250ZW50fSBmcm9tICcuL3RhYi1jb250ZW50JztcbmltcG9ydCB7TWF0VGFiR3JvdXAsIF9NYXRUYWJHcm91cEJhc2V9IGZyb20gJy4vdGFiLWdyb3VwJztcbmltcG9ydCB7TWF0VGFiSGVhZGVyLCBfTWF0VGFiSGVhZGVyQmFzZX0gZnJvbSAnLi90YWItaGVhZGVyJztcbmltcG9ydCB7TWF0VGFiTGFiZWx9IGZyb20gJy4vdGFiLWxhYmVsJztcbmltcG9ydCB7TWF0VGFiTGFiZWxXcmFwcGVyfSBmcm9tICcuL3RhYi1sYWJlbC13cmFwcGVyJztcbmltcG9ydCB7TWF0VGFiTGluaywgTWF0VGFiTmF2LCBfTWF0VGFiTmF2QmFzZSwgX01hdFRhYkxpbmtCYXNlfSBmcm9tICcuL3RhYi1uYXYtYmFyL3RhYi1uYXYtYmFyJztcbmltcG9ydCB7TWF0UGFnaW5hdGVkVGFiSGVhZGVyfSBmcm9tICcuL3BhZ2luYXRlZC10YWItaGVhZGVyJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE9ic2VydmVyc01vZHVsZSxcbiAgICBBMTF5TW9kdWxlLFxuICBdLFxuICAvLyBEb24ndCBleHBvcnQgYWxsIGNvbXBvbmVudHMgYmVjYXVzZSBzb21lIGFyZSBvbmx5IHRvIGJlIHVzZWQgaW50ZXJuYWxseS5cbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRUYWJHcm91cCxcbiAgICBNYXRUYWJMYWJlbCxcbiAgICBNYXRUYWIsXG4gICAgTWF0VGFiTmF2LFxuICAgIE1hdFRhYkxpbmssXG4gICAgTWF0VGFiQ29udGVudCxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0VGFiR3JvdXAsXG4gICAgTWF0VGFiTGFiZWwsXG4gICAgTWF0VGFiLFxuICAgIE1hdElua0JhcixcbiAgICBNYXRUYWJMYWJlbFdyYXBwZXIsXG4gICAgTWF0VGFiTmF2LFxuICAgIE1hdFRhYkxpbmssXG4gICAgTWF0VGFiQm9keSxcbiAgICBNYXRUYWJCb2R5UG9ydGFsLFxuICAgIE1hdFRhYkhlYWRlcixcbiAgICBNYXRUYWJDb250ZW50LFxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoZXNlIGNhbiBiZSByZW1vdmVkIG9uY2UgdGhleSdyZSB0dXJuZWQgaW50byBzZWxlY3Rvci1sZXNzIGRpcmVjdGl2ZXMuXG4gICAgTWF0UGFnaW5hdGVkVGFiSGVhZGVyIGFzIGFueSxcbiAgICBfTWF0VGFiR3JvdXBCYXNlIGFzIGFueSxcbiAgICBfTWF0VGFiTmF2QmFzZSBhcyBhbnksXG4gICAgX01hdFRhYkJvZHlCYXNlIGFzIGFueSxcbiAgICBfTWF0VGFiSGVhZGVyQmFzZSBhcyBhbnksXG4gICAgX01hdFRhYkxpbmtCYXNlIGFzIGFueSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFic01vZHVsZSB7fVxuIl19