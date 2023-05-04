/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatLineModule, MatCommonModule } from '@angular/material/core';
import { MatGridTile, MatGridTileText, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler, MatGridAvatarCssMatStyler, } from './grid-tile';
import { MatGridList } from './grid-list';
import * as i0 from "@angular/core";
class MatGridListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatGridListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatGridListModule, declarations: [MatGridList,
            MatGridTile,
            MatGridTileText,
            MatGridTileHeaderCssMatStyler,
            MatGridTileFooterCssMatStyler,
            MatGridAvatarCssMatStyler], imports: [MatLineModule, MatCommonModule], exports: [MatGridList,
            MatGridTile,
            MatGridTileText,
            MatLineModule,
            MatCommonModule,
            MatGridTileHeaderCssMatStyler,
            MatGridTileFooterCssMatStyler,
            MatGridAvatarCssMatStyler] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatGridListModule, imports: [MatLineModule, MatCommonModule, MatLineModule,
            MatCommonModule] }); }
}
export { MatGridListModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatGridListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatLineModule, MatCommonModule],
                    exports: [
                        MatGridList,
                        MatGridTile,
                        MatGridTileText,
                        MatLineModule,
                        MatCommonModule,
                        MatGridTileHeaderCssMatStyler,
                        MatGridTileFooterCssMatStyler,
                        MatGridAvatarCssMatStyler,
                    ],
                    declarations: [
                        MatGridList,
                        MatGridTile,
                        MatGridTileText,
                        MatGridTileHeaderCssMatStyler,
                        MatGridTileFooterCssMatStyler,
                        MatGridAvatarCssMatStyler,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvZ3JpZC1saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEUsT0FBTyxFQUNMLFdBQVcsRUFDWCxlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLDZCQUE2QixFQUM3Qix5QkFBeUIsR0FDMUIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUFFeEMsTUFxQmEsaUJBQWlCOzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFSMUIsV0FBVztZQUNYLFdBQVc7WUFDWCxlQUFlO1lBQ2YsNkJBQTZCO1lBQzdCLDZCQUE2QjtZQUM3Qix5QkFBeUIsYUFqQmpCLGFBQWEsRUFBRSxlQUFlLGFBRXRDLFdBQVc7WUFDWCxXQUFXO1lBQ1gsZUFBZTtZQUNmLGFBQWE7WUFDYixlQUFlO1lBQ2YsNkJBQTZCO1lBQzdCLDZCQUE2QjtZQUM3Qix5QkFBeUI7K0dBV2hCLGlCQUFpQixZQXBCbEIsYUFBYSxFQUFFLGVBQWUsRUFLdEMsYUFBYTtZQUNiLGVBQWU7O1NBY04saUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBckI3QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUM7b0JBQ3pDLE9BQU8sRUFBRTt3QkFDUCxXQUFXO3dCQUNYLFdBQVc7d0JBQ1gsZUFBZTt3QkFDZixhQUFhO3dCQUNiLGVBQWU7d0JBQ2YsNkJBQTZCO3dCQUM3Qiw2QkFBNkI7d0JBQzdCLHlCQUF5QjtxQkFDMUI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFdBQVc7d0JBQ1gsV0FBVzt3QkFDWCxlQUFlO3dCQUNmLDZCQUE2Qjt3QkFDN0IsNkJBQTZCO3dCQUM3Qix5QkFBeUI7cUJBQzFCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMaW5lTW9kdWxlLCBNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWF0R3JpZFRpbGUsXG4gIE1hdEdyaWRUaWxlVGV4dCxcbiAgTWF0R3JpZFRpbGVGb290ZXJDc3NNYXRTdHlsZXIsXG4gIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICBNYXRHcmlkQXZhdGFyQ3NzTWF0U3R5bGVyLFxufSBmcm9tICcuL2dyaWQtdGlsZSc7XG5pbXBvcnQge01hdEdyaWRMaXN0fSBmcm9tICcuL2dyaWQtbGlzdCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRMaW5lTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0R3JpZExpc3QsXG4gICAgTWF0R3JpZFRpbGUsXG4gICAgTWF0R3JpZFRpbGVUZXh0LFxuICAgIE1hdExpbmVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXIsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdEdyaWRMaXN0LFxuICAgIE1hdEdyaWRUaWxlLFxuICAgIE1hdEdyaWRUaWxlVGV4dCxcbiAgICBNYXRHcmlkVGlsZUhlYWRlckNzc01hdFN0eWxlcixcbiAgICBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlcixcbiAgICBNYXRHcmlkQXZhdGFyQ3NzTWF0U3R5bGVyLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkTGlzdE1vZHVsZSB7fVxuIl19