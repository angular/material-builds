/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tabs/tabs-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatInkBar } from './ink-bar';
import { MatTab } from './tab';
import { MatTabBody, MatTabBodyPortal } from './tab-body';
import { MatTabContent } from './tab-content';
import { MatTabGroup } from './tab-group';
import { MatTabHeader } from './tab-header';
import { MatTabLabel } from './tab-label';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { MatTabLink, MatTabNav } from './tab-nav-bar/tab-nav-bar';
let MatTabsModule = /** @class */ (() => {
    class MatTabsModule {
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
                    ],
                },] }
    ];
    return MatTabsModule;
})();
export { MatTabsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWJzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM3QixPQUFPLEVBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUdoRTtJQUFBLE1BaUNhLGFBQWE7OztnQkFqQ3pCLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3dCQUNmLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixlQUFlO3dCQUNmLFVBQVU7cUJBQ1g7O29CQUVELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLFdBQVc7d0JBQ1gsV0FBVzt3QkFDWCxNQUFNO3dCQUNOLFNBQVM7d0JBQ1QsVUFBVTt3QkFDVixhQUFhO3FCQUNkO29CQUNELFlBQVksRUFBRTt3QkFDWixXQUFXO3dCQUNYLFdBQVc7d0JBQ1gsTUFBTTt3QkFDTixTQUFTO3dCQUNULGtCQUFrQjt3QkFDbEIsU0FBUzt3QkFDVCxVQUFVO3dCQUNWLFVBQVU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixZQUFZO3dCQUNaLGFBQWE7cUJBQ2Q7aUJBQ0Y7O0lBQzJCLG9CQUFDO0tBQUE7U0FBaEIsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ExMXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuL2luay1iYXInO1xuaW1wb3J0IHtNYXRUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TWF0VGFiQm9keSwgTWF0VGFiQm9keVBvcnRhbH0gZnJvbSAnLi90YWItYm9keSc7XG5pbXBvcnQge01hdFRhYkNvbnRlbnR9IGZyb20gJy4vdGFiLWNvbnRlbnQnO1xuaW1wb3J0IHtNYXRUYWJHcm91cH0gZnJvbSAnLi90YWItZ3JvdXAnO1xuaW1wb3J0IHtNYXRUYWJIZWFkZXJ9IGZyb20gJy4vdGFiLWhlYWRlcic7XG5pbXBvcnQge01hdFRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge01hdFRhYkxhYmVsV3JhcHBlcn0gZnJvbSAnLi90YWItbGFiZWwtd3JhcHBlcic7XG5pbXBvcnQge01hdFRhYkxpbmssIE1hdFRhYk5hdn0gZnJvbSAnLi90YWItbmF2LWJhci90YWItbmF2LWJhcic7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgUG9ydGFsTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgICBPYnNlcnZlcnNNb2R1bGUsXG4gICAgQTExeU1vZHVsZSxcbiAgXSxcbiAgLy8gRG9uJ3QgZXhwb3J0IGFsbCBjb21wb25lbnRzIGJlY2F1c2Ugc29tZSBhcmUgb25seSB0byBiZSB1c2VkIGludGVybmFsbHkuXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0VGFiR3JvdXAsXG4gICAgTWF0VGFiTGFiZWwsXG4gICAgTWF0VGFiLFxuICAgIE1hdFRhYk5hdixcbiAgICBNYXRUYWJMaW5rLFxuICAgIE1hdFRhYkNvbnRlbnQsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdFRhYkdyb3VwLFxuICAgIE1hdFRhYkxhYmVsLFxuICAgIE1hdFRhYixcbiAgICBNYXRJbmtCYXIsXG4gICAgTWF0VGFiTGFiZWxXcmFwcGVyLFxuICAgIE1hdFRhYk5hdixcbiAgICBNYXRUYWJMaW5rLFxuICAgIE1hdFRhYkJvZHksXG4gICAgTWF0VGFiQm9keVBvcnRhbCxcbiAgICBNYXRUYWJIZWFkZXIsXG4gICAgTWF0VGFiQ29udGVudCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFic01vZHVsZSB7fVxuIl19