/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from './drawer';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from './sidenav';
import * as i0 from "@angular/core";
class MatSidenavModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSidenavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatSidenavModule, declarations: [MatDrawer,
            MatDrawerContainer,
            MatDrawerContent,
            MatSidenav,
            MatSidenavContainer,
            MatSidenavContent], imports: [CommonModule, MatCommonModule, CdkScrollableModule], exports: [CdkScrollableModule,
            MatCommonModule,
            MatDrawer,
            MatDrawerContainer,
            MatDrawerContent,
            MatSidenav,
            MatSidenavContainer,
            MatSidenavContent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSidenavModule, imports: [CommonModule, MatCommonModule, CdkScrollableModule, CdkScrollableModule,
            MatCommonModule] }); }
}
export { MatSidenavModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSidenavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, CdkScrollableModule],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9zaWRlbmF2LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6RSxPQUFPLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sV0FBVyxDQUFDOztBQUU3RSxNQXFCYSxnQkFBZ0I7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGlCQVJ6QixTQUFTO1lBQ1Qsa0JBQWtCO1lBQ2xCLGdCQUFnQjtZQUNoQixVQUFVO1lBQ1YsbUJBQW1CO1lBQ25CLGlCQUFpQixhQWpCVCxZQUFZLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixhQUUxRCxtQkFBbUI7WUFDbkIsZUFBZTtZQUNmLFNBQVM7WUFDVCxrQkFBa0I7WUFDbEIsZ0JBQWdCO1lBQ2hCLFVBQVU7WUFDVixtQkFBbUI7WUFDbkIsaUJBQWlCOytHQVdSLGdCQUFnQixZQXBCakIsWUFBWSxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFFMUQsbUJBQW1CO1lBQ25CLGVBQWU7O1NBaUJOLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQXJCNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixDQUFDO29CQUM3RCxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3dCQUNuQixlQUFlO3dCQUNmLFNBQVM7d0JBQ1Qsa0JBQWtCO3dCQUNsQixnQkFBZ0I7d0JBQ2hCLFVBQVU7d0JBQ1YsbUJBQW1CO3dCQUNuQixpQkFBaUI7cUJBQ2xCO29CQUNELFlBQVksRUFBRTt3QkFDWixTQUFTO3dCQUNULGtCQUFrQjt3QkFDbEIsZ0JBQWdCO3dCQUNoQixVQUFVO3dCQUNWLG1CQUFtQjt3QkFDbkIsaUJBQWlCO3FCQUNsQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdERyYXdlciwgTWF0RHJhd2VyQ29udGFpbmVyLCBNYXREcmF3ZXJDb250ZW50fSBmcm9tICcuL2RyYXdlcic7XG5pbXBvcnQge01hdFNpZGVuYXYsIE1hdFNpZGVuYXZDb250YWluZXIsIE1hdFNpZGVuYXZDb250ZW50fSBmcm9tICcuL3NpZGVuYXYnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIENka1Njcm9sbGFibGVNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0RHJhd2VyLFxuICAgIE1hdERyYXdlckNvbnRhaW5lcixcbiAgICBNYXREcmF3ZXJDb250ZW50LFxuICAgIE1hdFNpZGVuYXYsXG4gICAgTWF0U2lkZW5hdkNvbnRhaW5lcixcbiAgICBNYXRTaWRlbmF2Q29udGVudCxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0RHJhd2VyLFxuICAgIE1hdERyYXdlckNvbnRhaW5lcixcbiAgICBNYXREcmF3ZXJDb250ZW50LFxuICAgIE1hdFNpZGVuYXYsXG4gICAgTWF0U2lkZW5hdkNvbnRhaW5lcixcbiAgICBNYXRTaWRlbmF2Q29udGVudCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2lkZW5hdk1vZHVsZSB7fVxuIl19