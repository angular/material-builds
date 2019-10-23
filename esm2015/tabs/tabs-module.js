/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class MatTabsModule {
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
                    (/** @type {?} */ (
                    // TODO(crisbeto): these can be removed once they're turned into selector-less directives.
                    MatPaginatedTabHeader)),
                    (/** @type {?} */ (_MatTabGroupBase)),
                    (/** @type {?} */ (_MatTabNavBase)),
                    (/** @type {?} */ (_MatTabBodyBase)),
                    (/** @type {?} */ (_MatTabHeaderBase)),
                    (/** @type {?} */ (_MatTabLinkBase)),
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWJzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzdCLE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzdELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2pHLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBNEM3RCxNQUFNLE9BQU8sYUFBYTs7O1lBekN6QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixZQUFZO29CQUNaLGVBQWU7b0JBQ2YsZUFBZTtvQkFDZixVQUFVO2lCQUNYOztnQkFFRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZTtvQkFDZixXQUFXO29CQUNYLFdBQVc7b0JBQ1gsTUFBTTtvQkFDTixTQUFTO29CQUNULFVBQVU7b0JBQ1YsYUFBYTtpQkFDZDtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osV0FBVztvQkFDWCxXQUFXO29CQUNYLE1BQU07b0JBQ04sU0FBUztvQkFDVCxrQkFBa0I7b0JBQ2xCLFNBQVM7b0JBQ1QsVUFBVTtvQkFDVixVQUFVO29CQUNWLGdCQUFnQjtvQkFDaEIsWUFBWTtvQkFDWixhQUFhO29CQUdiO29CQURBLDBGQUEwRjtvQkFDMUYscUJBQXFCLEVBQU87b0JBQzVCLG1CQUFBLGdCQUFnQixFQUFPO29CQUN2QixtQkFBQSxjQUFjLEVBQU87b0JBQ3JCLG1CQUFBLGVBQWUsRUFBTztvQkFDdEIsbUJBQUEsaUJBQWlCLEVBQU87b0JBQ3hCLG1CQUFBLGVBQWUsRUFBTztpQkFDdkI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBMTF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuL2luay1iYXInO1xuaW1wb3J0IHtNYXRUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TWF0VGFiQm9keSwgTWF0VGFiQm9keVBvcnRhbCwgX01hdFRhYkJvZHlCYXNlfSBmcm9tICcuL3RhYi1ib2R5JztcbmltcG9ydCB7TWF0VGFiQ29udGVudH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01hdFRhYkdyb3VwLCBfTWF0VGFiR3JvdXBCYXNlfSBmcm9tICcuL3RhYi1ncm91cCc7XG5pbXBvcnQge01hdFRhYkhlYWRlciwgX01hdFRhYkhlYWRlckJhc2V9IGZyb20gJy4vdGFiLWhlYWRlcic7XG5pbXBvcnQge01hdFRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge01hdFRhYkxhYmVsV3JhcHBlcn0gZnJvbSAnLi90YWItbGFiZWwtd3JhcHBlcic7XG5pbXBvcnQge01hdFRhYkxpbmssIE1hdFRhYk5hdiwgX01hdFRhYk5hdkJhc2UsIF9NYXRUYWJMaW5rQmFzZX0gZnJvbSAnLi90YWItbmF2LWJhci90YWItbmF2LWJhcic7XG5pbXBvcnQge01hdFBhZ2luYXRlZFRhYkhlYWRlcn0gZnJvbSAnLi9wYWdpbmF0ZWQtdGFiLWhlYWRlcic7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgUG9ydGFsTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgICBPYnNlcnZlcnNNb2R1bGUsXG4gICAgQTExeU1vZHVsZSxcbiAgXSxcbiAgLy8gRG9uJ3QgZXhwb3J0IGFsbCBjb21wb25lbnRzIGJlY2F1c2Ugc29tZSBhcmUgb25seSB0byBiZSB1c2VkIGludGVybmFsbHkuXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0VGFiR3JvdXAsXG4gICAgTWF0VGFiTGFiZWwsXG4gICAgTWF0VGFiLFxuICAgIE1hdFRhYk5hdixcbiAgICBNYXRUYWJMaW5rLFxuICAgIE1hdFRhYkNvbnRlbnQsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdFRhYkdyb3VwLFxuICAgIE1hdFRhYkxhYmVsLFxuICAgIE1hdFRhYixcbiAgICBNYXRJbmtCYXIsXG4gICAgTWF0VGFiTGFiZWxXcmFwcGVyLFxuICAgIE1hdFRhYk5hdixcbiAgICBNYXRUYWJMaW5rLFxuICAgIE1hdFRhYkJvZHksXG4gICAgTWF0VGFiQm9keVBvcnRhbCxcbiAgICBNYXRUYWJIZWFkZXIsXG4gICAgTWF0VGFiQ29udGVudCxcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGVzZSBjYW4gYmUgcmVtb3ZlZCBvbmNlIHRoZXkncmUgdHVybmVkIGludG8gc2VsZWN0b3ItbGVzcyBkaXJlY3RpdmVzLlxuICAgIE1hdFBhZ2luYXRlZFRhYkhlYWRlciBhcyBhbnksXG4gICAgX01hdFRhYkdyb3VwQmFzZSBhcyBhbnksXG4gICAgX01hdFRhYk5hdkJhc2UgYXMgYW55LFxuICAgIF9NYXRUYWJCb2R5QmFzZSBhcyBhbnksXG4gICAgX01hdFRhYkhlYWRlckJhc2UgYXMgYW55LFxuICAgIF9NYXRUYWJMaW5rQmFzZSBhcyBhbnksXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYnNNb2R1bGUge31cbiJdfQ==