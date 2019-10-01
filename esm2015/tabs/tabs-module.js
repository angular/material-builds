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
import { MatTabLink, MatTabNav, _MatTabNavBase } from './tab-nav-bar/tab-nav-bar';
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
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWJzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzdCLE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzdELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDaEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUEyQzdELE1BQU0sT0FBTyxhQUFhOzs7WUF4Q3pCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixlQUFlO29CQUNmLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixlQUFlO29CQUNmLFVBQVU7aUJBQ1g7O2dCQUVELE9BQU8sRUFBRTtvQkFDUCxlQUFlO29CQUNmLFdBQVc7b0JBQ1gsV0FBVztvQkFDWCxNQUFNO29CQUNOLFNBQVM7b0JBQ1QsVUFBVTtvQkFDVixhQUFhO2lCQUNkO2dCQUNELFlBQVksRUFBRTtvQkFDWixXQUFXO29CQUNYLFdBQVc7b0JBQ1gsTUFBTTtvQkFDTixTQUFTO29CQUNULGtCQUFrQjtvQkFDbEIsU0FBUztvQkFDVCxVQUFVO29CQUNWLFVBQVU7b0JBQ1YsZ0JBQWdCO29CQUNoQixZQUFZO29CQUNaLGFBQWE7b0JBR2I7b0JBREEsMEZBQTBGO29CQUMxRixxQkFBcUIsRUFBTztvQkFDNUIsbUJBQUEsZ0JBQWdCLEVBQU87b0JBQ3ZCLG1CQUFBLGNBQWMsRUFBTztvQkFDckIsbUJBQUEsZUFBZSxFQUFPO29CQUN0QixtQkFBQSxpQkFBaUIsRUFBTztpQkFDekI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBMTF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuL2luay1iYXInO1xuaW1wb3J0IHtNYXRUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TWF0VGFiQm9keSwgTWF0VGFiQm9keVBvcnRhbCwgX01hdFRhYkJvZHlCYXNlfSBmcm9tICcuL3RhYi1ib2R5JztcbmltcG9ydCB7TWF0VGFiQ29udGVudH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01hdFRhYkdyb3VwLCBfTWF0VGFiR3JvdXBCYXNlfSBmcm9tICcuL3RhYi1ncm91cCc7XG5pbXBvcnQge01hdFRhYkhlYWRlciwgX01hdFRhYkhlYWRlckJhc2V9IGZyb20gJy4vdGFiLWhlYWRlcic7XG5pbXBvcnQge01hdFRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge01hdFRhYkxhYmVsV3JhcHBlcn0gZnJvbSAnLi90YWItbGFiZWwtd3JhcHBlcic7XG5pbXBvcnQge01hdFRhYkxpbmssIE1hdFRhYk5hdiwgX01hdFRhYk5hdkJhc2V9IGZyb20gJy4vdGFiLW5hdi1iYXIvdGFiLW5hdi1iYXInO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXJ9IGZyb20gJy4vcGFnaW5hdGVkLXRhYi1oZWFkZXInO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBNYXRSaXBwbGVNb2R1bGUsXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICAgIEExMXlNb2R1bGUsXG4gIF0sXG4gIC8vIERvbid0IGV4cG9ydCBhbGwgY29tcG9uZW50cyBiZWNhdXNlIHNvbWUgYXJlIG9ubHkgdG8gYmUgdXNlZCBpbnRlcm5hbGx5LlxuICBleHBvcnRzOiBbXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdFRhYkdyb3VwLFxuICAgIE1hdFRhYkxhYmVsLFxuICAgIE1hdFRhYixcbiAgICBNYXRUYWJOYXYsXG4gICAgTWF0VGFiTGluayxcbiAgICBNYXRUYWJDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRUYWJHcm91cCxcbiAgICBNYXRUYWJMYWJlbCxcbiAgICBNYXRUYWIsXG4gICAgTWF0SW5rQmFyLFxuICAgIE1hdFRhYkxhYmVsV3JhcHBlcixcbiAgICBNYXRUYWJOYXYsXG4gICAgTWF0VGFiTGluayxcbiAgICBNYXRUYWJCb2R5LFxuICAgIE1hdFRhYkJvZHlQb3J0YWwsXG4gICAgTWF0VGFiSGVhZGVyLFxuICAgIE1hdFRhYkNvbnRlbnQsXG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhlc2UgY2FuIGJlIHJlbW92ZWQgb25jZSB0aGV5J3JlIHR1cm5lZCBpbnRvIHNlbGVjdG9yLWxlc3MgZGlyZWN0aXZlcy5cbiAgICBNYXRQYWdpbmF0ZWRUYWJIZWFkZXIgYXMgYW55LFxuICAgIF9NYXRUYWJHcm91cEJhc2UgYXMgYW55LFxuICAgIF9NYXRUYWJOYXZCYXNlIGFzIGFueSxcbiAgICBfTWF0VGFiQm9keUJhc2UgYXMgYW55LFxuICAgIF9NYXRUYWJIZWFkZXJCYXNlIGFzIGFueSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFic01vZHVsZSB7fVxuIl19