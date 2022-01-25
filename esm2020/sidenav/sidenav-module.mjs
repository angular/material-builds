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
import * as i0 from "@angular/core";
export class MatSidenavModule {
}
MatSidenavModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: MatSidenavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSidenavModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: MatSidenavModule, declarations: [MatDrawer,
        MatDrawerContainer,
        MatDrawerContent,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent], imports: [CommonModule, MatCommonModule, PlatformModule, CdkScrollableModule], exports: [CdkScrollableModule,
        MatCommonModule,
        MatDrawer,
        MatDrawerContainer,
        MatDrawerContent,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent] });
MatSidenavModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: MatSidenavModule, imports: [[CommonModule, MatCommonModule, PlatformModule, CdkScrollableModule], CdkScrollableModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: MatSidenavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, PlatformModule, CdkScrollableModule],
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9zaWRlbmF2LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDekUsT0FBTyxFQUFDLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7QUF1QjdFLE1BQU0sT0FBTyxnQkFBZ0I7O2tIQUFoQixnQkFBZ0I7bUhBQWhCLGdCQUFnQixpQkFSekIsU0FBUztRQUNULGtCQUFrQjtRQUNsQixnQkFBZ0I7UUFDaEIsVUFBVTtRQUNWLG1CQUFtQjtRQUNuQixpQkFBaUIsYUFqQlQsWUFBWSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLGFBRTFFLG1CQUFtQjtRQUNuQixlQUFlO1FBQ2YsU0FBUztRQUNULGtCQUFrQjtRQUNsQixnQkFBZ0I7UUFDaEIsVUFBVTtRQUNWLG1CQUFtQjtRQUNuQixpQkFBaUI7bUhBV1IsZ0JBQWdCLFlBcEJsQixDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixDQUFDLEVBRTNFLG1CQUFtQjtRQUNuQixlQUFlO2dHQWlCTixnQkFBZ0I7a0JBckI1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixDQUFDO29CQUM3RSxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3dCQUNuQixlQUFlO3dCQUNmLFNBQVM7d0JBQ1Qsa0JBQWtCO3dCQUNsQixnQkFBZ0I7d0JBQ2hCLFVBQVU7d0JBQ1YsbUJBQW1CO3dCQUNuQixpQkFBaUI7cUJBQ2xCO29CQUNELFlBQVksRUFBRTt3QkFDWixTQUFTO3dCQUNULGtCQUFrQjt3QkFDbEIsZ0JBQWdCO3dCQUNoQixVQUFVO3dCQUNWLG1CQUFtQjt3QkFDbkIsaUJBQWlCO3FCQUNsQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtQbGF0Zm9ybU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXREcmF3ZXIsIE1hdERyYXdlckNvbnRhaW5lciwgTWF0RHJhd2VyQ29udGVudH0gZnJvbSAnLi9kcmF3ZXInO1xuaW1wb3J0IHtNYXRTaWRlbmF2LCBNYXRTaWRlbmF2Q29udGFpbmVyLCBNYXRTaWRlbmF2Q29udGVudH0gZnJvbSAnLi9zaWRlbmF2JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBQbGF0Zm9ybU1vZHVsZSwgQ2RrU2Nyb2xsYWJsZU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBDZGtTY3JvbGxhYmxlTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXREcmF3ZXIsXG4gICAgTWF0RHJhd2VyQ29udGFpbmVyLFxuICAgIE1hdERyYXdlckNvbnRlbnQsXG4gICAgTWF0U2lkZW5hdixcbiAgICBNYXRTaWRlbmF2Q29udGFpbmVyLFxuICAgIE1hdFNpZGVuYXZDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXREcmF3ZXIsXG4gICAgTWF0RHJhd2VyQ29udGFpbmVyLFxuICAgIE1hdERyYXdlckNvbnRlbnQsXG4gICAgTWF0U2lkZW5hdixcbiAgICBNYXRTaWRlbmF2Q29udGFpbmVyLFxuICAgIE1hdFNpZGVuYXZDb250ZW50LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2TW9kdWxlIHt9XG4iXX0=