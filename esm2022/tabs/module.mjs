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
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { A11yModule } from '@angular/cdk/a11y';
import { MatTabBody, MatTabBodyPortal } from './tab-body';
import { MatTabContent } from './tab-content';
import { MatTabLabel } from './tab-label';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { MatTab } from './tab';
import { MatTabHeader } from './tab-header';
import { MatTabGroup } from './tab-group';
import { MatTabNav, MatTabNavPanel, MatTabLink } from './tab-nav-bar/tab-nav-bar';
import * as i0 from "@angular/core";
class MatTabsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatTabsModule, declarations: [MatTabContent,
            MatTabLabel,
            MatTab,
            MatTabGroup,
            MatTabNav,
            MatTabNavPanel,
            MatTabLink,
            // Private directives, should not be exported.
            MatTabBody,
            MatTabBodyPortal,
            MatTabLabelWrapper,
            MatTabHeader], imports: [CommonModule,
            MatCommonModule,
            PortalModule,
            MatRippleModule,
            ObserversModule,
            A11yModule], exports: [MatCommonModule,
            MatTabContent,
            MatTabLabel,
            MatTab,
            MatTabGroup,
            MatTabNav,
            MatTabNavPanel,
            MatTabLink] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTabsModule, imports: [CommonModule,
            MatCommonModule,
            PortalModule,
            MatRippleModule,
            ObserversModule,
            A11yModule, MatCommonModule] }); }
}
export { MatTabsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTabsModule, decorators: [{
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
                    exports: [
                        MatCommonModule,
                        MatTabContent,
                        MatTabLabel,
                        MatTab,
                        MatTabGroup,
                        MatTabNav,
                        MatTabNavPanel,
                        MatTabLink,
                    ],
                    declarations: [
                        MatTabContent,
                        MatTabLabel,
                        MatTab,
                        MatTabGroup,
                        MatTabNav,
                        MatTabNavPanel,
                        MatTabLink,
                        // Private directives, should not be exported.
                        MatTabBody,
                        MatTabBodyPortal,
                        MatTabLabelWrapper,
                        MatTabHeader,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN4RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM3QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRWhGLE1BbUNhLGFBQWE7OEdBQWIsYUFBYTsrR0FBYixhQUFhLGlCQWZ0QixhQUFhO1lBQ2IsV0FBVztZQUNYLE1BQU07WUFDTixXQUFXO1lBQ1gsU0FBUztZQUNULGNBQWM7WUFDZCxVQUFVO1lBRVYsOENBQThDO1lBQzlDLFVBQVU7WUFDVixnQkFBZ0I7WUFDaEIsa0JBQWtCO1lBQ2xCLFlBQVksYUE5QlosWUFBWTtZQUNaLGVBQWU7WUFDZixZQUFZO1lBQ1osZUFBZTtZQUNmLGVBQWU7WUFDZixVQUFVLGFBR1YsZUFBZTtZQUNmLGFBQWE7WUFDYixXQUFXO1lBQ1gsTUFBTTtZQUNOLFdBQVc7WUFDWCxTQUFTO1lBQ1QsY0FBYztZQUNkLFVBQVU7K0dBa0JELGFBQWEsWUFqQ3RCLFlBQVk7WUFDWixlQUFlO1lBQ2YsWUFBWTtZQUNaLGVBQWU7WUFDZixlQUFlO1lBQ2YsVUFBVSxFQUdWLGVBQWU7O1NBeUJOLGFBQWE7MkZBQWIsYUFBYTtrQkFuQ3pCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixVQUFVO3FCQUNYO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxNQUFNO3dCQUNOLFdBQVc7d0JBQ1gsU0FBUzt3QkFDVCxjQUFjO3dCQUNkLFVBQVU7cUJBQ1g7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxNQUFNO3dCQUNOLFdBQVc7d0JBQ1gsU0FBUzt3QkFDVCxjQUFjO3dCQUNkLFVBQVU7d0JBRVYsOENBQThDO3dCQUM5QyxVQUFVO3dCQUNWLGdCQUFnQjt3QkFDaEIsa0JBQWtCO3dCQUNsQixZQUFZO3FCQUNiO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7QTExeU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtNYXRUYWJCb2R5LCBNYXRUYWJCb2R5UG9ydGFsfSBmcm9tICcuL3RhYi1ib2R5JztcbmltcG9ydCB7TWF0VGFiQ29udGVudH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01hdFRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge01hdFRhYkxhYmVsV3JhcHBlcn0gZnJvbSAnLi90YWItbGFiZWwtd3JhcHBlcic7XG5pbXBvcnQge01hdFRhYn0gZnJvbSAnLi90YWInO1xuaW1wb3J0IHtNYXRUYWJIZWFkZXJ9IGZyb20gJy4vdGFiLWhlYWRlcic7XG5pbXBvcnQge01hdFRhYkdyb3VwfSBmcm9tICcuL3RhYi1ncm91cCc7XG5pbXBvcnQge01hdFRhYk5hdiwgTWF0VGFiTmF2UGFuZWwsIE1hdFRhYkxpbmt9IGZyb20gJy4vdGFiLW5hdi1iYXIvdGFiLW5hdi1iYXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE9ic2VydmVyc01vZHVsZSxcbiAgICBBMTF5TW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdFRhYkNvbnRlbnQsXG4gICAgTWF0VGFiTGFiZWwsXG4gICAgTWF0VGFiLFxuICAgIE1hdFRhYkdyb3VwLFxuICAgIE1hdFRhYk5hdixcbiAgICBNYXRUYWJOYXZQYW5lbCxcbiAgICBNYXRUYWJMaW5rLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRUYWJDb250ZW50LFxuICAgIE1hdFRhYkxhYmVsLFxuICAgIE1hdFRhYixcbiAgICBNYXRUYWJHcm91cCxcbiAgICBNYXRUYWJOYXYsXG4gICAgTWF0VGFiTmF2UGFuZWwsXG4gICAgTWF0VGFiTGluayxcblxuICAgIC8vIFByaXZhdGUgZGlyZWN0aXZlcywgc2hvdWxkIG5vdCBiZSBleHBvcnRlZC5cbiAgICBNYXRUYWJCb2R5LFxuICAgIE1hdFRhYkJvZHlQb3J0YWwsXG4gICAgTWF0VGFiTGFiZWxXcmFwcGVyLFxuICAgIE1hdFRhYkhlYWRlcixcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFic01vZHVsZSB7fVxuIl19