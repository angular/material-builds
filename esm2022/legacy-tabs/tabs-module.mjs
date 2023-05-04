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
import { MatLegacyInkBar } from './ink-bar';
import { MatLegacyTab } from './tab';
import { MatLegacyTabBody, MatLegacyTabBodyPortal } from './tab-body';
import { MatLegacyTabGroup } from './tab-group';
import { MatLegacyTabHeader } from './tab-header';
import { MatLegacyTabLink, MatLegacyTabNav, MatLegacyTabNavPanel } from './tab-nav-bar/tab-nav-bar';
import { MatLegacyTabLabel } from './tab-label';
import { MatLegacyTabContent } from './tab-content';
import { MatLegacyTabLabelWrapper } from './tab-label-wrapper';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatTabsModule` from `@angular/material/tabs` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTabsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabsModule, declarations: [MatLegacyTabGroup,
            MatLegacyTabLabel,
            MatLegacyTab,
            MatLegacyInkBar,
            MatLegacyTabLabelWrapper,
            MatLegacyTabNav,
            MatLegacyTabNavPanel,
            MatLegacyTabLink,
            MatLegacyTabBody,
            MatLegacyTabBodyPortal,
            MatLegacyTabHeader,
            MatLegacyTabContent], imports: [CommonModule,
            MatCommonModule,
            PortalModule,
            MatRippleModule,
            ObserversModule,
            A11yModule], exports: [MatCommonModule,
            MatLegacyTabGroup,
            MatLegacyTabLabel,
            MatLegacyTab,
            MatLegacyTabNav,
            MatLegacyTabNavPanel,
            MatLegacyTabLink,
            MatLegacyTabContent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabsModule, imports: [CommonModule,
            MatCommonModule,
            PortalModule,
            MatRippleModule,
            ObserversModule,
            A11yModule, MatCommonModule] }); }
}
export { MatLegacyTabsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabsModule, decorators: [{
            type: NgModule,
            args: [{
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
                        MatLegacyTabGroup,
                        MatLegacyTabLabel,
                        MatLegacyTab,
                        MatLegacyTabNav,
                        MatLegacyTabNavPanel,
                        MatLegacyTabLink,
                        MatLegacyTabContent,
                    ],
                    declarations: [
                        MatLegacyTabGroup,
                        MatLegacyTabLabel,
                        MatLegacyTab,
                        MatLegacyInkBar,
                        MatLegacyTabLabelWrapper,
                        MatLegacyTabNav,
                        MatLegacyTabNavPanel,
                        MatLegacyTabLink,
                        MatLegacyTabBody,
                        MatLegacyTabBodyPortal,
                        MatLegacyTabHeader,
                        MatLegacyTabContent,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYnMvdGFicy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDbkMsT0FBTyxFQUFDLGdCQUFnQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM5QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDaEQsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2xHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM5QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0scUJBQXFCLENBQUM7O0FBRTdEOzs7R0FHRztBQUNILE1BbUNhLG1CQUFtQjs4R0FBbkIsbUJBQW1COytHQUFuQixtQkFBbUIsaUJBZDVCLGlCQUFpQjtZQUNqQixpQkFBaUI7WUFDakIsWUFBWTtZQUNaLGVBQWU7WUFDZix3QkFBd0I7WUFDeEIsZUFBZTtZQUNmLG9CQUFvQjtZQUNwQixnQkFBZ0I7WUFDaEIsZ0JBQWdCO1lBQ2hCLHNCQUFzQjtZQUN0QixrQkFBa0I7WUFDbEIsbUJBQW1CLGFBOUJuQixZQUFZO1lBQ1osZUFBZTtZQUNmLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtZQUNmLFVBQVUsYUFJVixlQUFlO1lBQ2YsaUJBQWlCO1lBQ2pCLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osZUFBZTtZQUNmLG9CQUFvQjtZQUNwQixnQkFBZ0I7WUFDaEIsbUJBQW1COytHQWlCVixtQkFBbUIsWUFqQzVCLFlBQVk7WUFDWixlQUFlO1lBQ2YsWUFBWTtZQUNaLGVBQWU7WUFDZixlQUFlO1lBQ2YsVUFBVSxFQUlWLGVBQWU7O1NBd0JOLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQW5DL0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3dCQUNmLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixlQUFlO3dCQUNmLFVBQVU7cUJBQ1g7b0JBQ0QsMkVBQTJFO29CQUMzRSxPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsWUFBWTt3QkFDWixlQUFlO3dCQUNmLG9CQUFvQjt3QkFDcEIsZ0JBQWdCO3dCQUNoQixtQkFBbUI7cUJBQ3BCO29CQUNELFlBQVksRUFBRTt3QkFDWixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsWUFBWTt3QkFDWixlQUFlO3dCQUNmLHdCQUF3Qjt3QkFDeEIsZUFBZTt3QkFDZixvQkFBb0I7d0JBQ3BCLGdCQUFnQjt3QkFDaEIsZ0JBQWdCO3dCQUNoQixzQkFBc0I7d0JBQ3RCLGtCQUFrQjt3QkFDbEIsbUJBQW1CO3FCQUNwQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ExMXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0TGVnYWN5SW5rQmFyfSBmcm9tICcuL2luay1iYXInO1xuaW1wb3J0IHtNYXRMZWdhY3lUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TWF0TGVnYWN5VGFiQm9keSwgTWF0TGVnYWN5VGFiQm9keVBvcnRhbH0gZnJvbSAnLi90YWItYm9keSc7XG5pbXBvcnQge01hdExlZ2FjeVRhYkdyb3VwfSBmcm9tICcuL3RhYi1ncm91cCc7XG5pbXBvcnQge01hdExlZ2FjeVRhYkhlYWRlcn0gZnJvbSAnLi90YWItaGVhZGVyJztcbmltcG9ydCB7TWF0TGVnYWN5VGFiTGluaywgTWF0TGVnYWN5VGFiTmF2LCBNYXRMZWdhY3lUYWJOYXZQYW5lbH0gZnJvbSAnLi90YWItbmF2LWJhci90YWItbmF2LWJhcic7XG5pbXBvcnQge01hdExlZ2FjeVRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge01hdExlZ2FjeVRhYkNvbnRlbnR9IGZyb20gJy4vdGFiLWNvbnRlbnQnO1xuaW1wb3J0IHtNYXRMZWdhY3lUYWJMYWJlbFdyYXBwZXJ9IGZyb20gJy4vdGFiLWxhYmVsLXdyYXBwZXInO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0VGFic01vZHVsZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdGFic2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE9ic2VydmVyc01vZHVsZSxcbiAgICBBMTF5TW9kdWxlLFxuICBdLFxuICAvLyBEb24ndCBleHBvcnQgYWxsIGNvbXBvbmVudHMgYmVjYXVzZSBzb21lIGFyZSBvbmx5IHRvIGJlIHVzZWQgaW50ZXJuYWxseS5cbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRMZWdhY3lUYWJHcm91cCxcbiAgICBNYXRMZWdhY3lUYWJMYWJlbCxcbiAgICBNYXRMZWdhY3lUYWIsXG4gICAgTWF0TGVnYWN5VGFiTmF2LFxuICAgIE1hdExlZ2FjeVRhYk5hdlBhbmVsLFxuICAgIE1hdExlZ2FjeVRhYkxpbmssXG4gICAgTWF0TGVnYWN5VGFiQ29udGVudCxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0TGVnYWN5VGFiR3JvdXAsXG4gICAgTWF0TGVnYWN5VGFiTGFiZWwsXG4gICAgTWF0TGVnYWN5VGFiLFxuICAgIE1hdExlZ2FjeUlua0JhcixcbiAgICBNYXRMZWdhY3lUYWJMYWJlbFdyYXBwZXIsXG4gICAgTWF0TGVnYWN5VGFiTmF2LFxuICAgIE1hdExlZ2FjeVRhYk5hdlBhbmVsLFxuICAgIE1hdExlZ2FjeVRhYkxpbmssXG4gICAgTWF0TGVnYWN5VGFiQm9keSxcbiAgICBNYXRMZWdhY3lUYWJCb2R5UG9ydGFsLFxuICAgIE1hdExlZ2FjeVRhYkhlYWRlcixcbiAgICBNYXRMZWdhY3lUYWJDb250ZW50LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUYWJzTW9kdWxlIHt9XG4iXX0=