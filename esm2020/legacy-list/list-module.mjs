/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatLineModule, MatPseudoCheckboxModule, MatRippleModule, } from '@angular/material/core';
import { MatLegacyList, MatLegacyNavList, MatLegacyListAvatarCssMatStyler, MatLegacyListIconCssMatStyler, MatLegacyListItem, MatLegacyListSubheaderCssMatStyler, } from './list';
import { MatLegacyListOption, MatLegacySelectionList } from './selection-list';
import { MatDividerModule } from '@angular/material/divider';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatListModule` from `@angular/material/list` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyListModule {
}
MatLegacyListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatLegacyListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyListModule, declarations: [MatLegacyList,
        MatLegacyNavList,
        MatLegacyListItem,
        MatLegacyListAvatarCssMatStyler,
        MatLegacyListIconCssMatStyler,
        MatLegacyListSubheaderCssMatStyler,
        MatLegacySelectionList,
        MatLegacyListOption], imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule], exports: [MatLegacyList,
        MatLegacyNavList,
        MatLegacyListItem,
        MatLegacyListAvatarCssMatStyler,
        MatLineModule,
        MatCommonModule,
        MatLegacyListIconCssMatStyler,
        MatLegacyListSubheaderCssMatStyler,
        MatPseudoCheckboxModule,
        MatLegacySelectionList,
        MatLegacyListOption,
        MatDividerModule] });
MatLegacyListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyListModule, imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule, MatLineModule,
        MatCommonModule,
        MatPseudoCheckboxModule,
        MatDividerModule] });
export { MatLegacyListModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule],
                    exports: [
                        MatLegacyList,
                        MatLegacyNavList,
                        MatLegacyListItem,
                        MatLegacyListAvatarCssMatStyler,
                        MatLineModule,
                        MatCommonModule,
                        MatLegacyListIconCssMatStyler,
                        MatLegacyListSubheaderCssMatStyler,
                        MatPseudoCheckboxModule,
                        MatLegacySelectionList,
                        MatLegacyListOption,
                        MatDividerModule,
                    ],
                    declarations: [
                        MatLegacyList,
                        MatLegacyNavList,
                        MatLegacyListItem,
                        MatLegacyListAvatarCssMatStyler,
                        MatLegacyListIconCssMatStyler,
                        MatLegacyListSubheaderCssMatStyler,
                        MatLegacySelectionList,
                        MatLegacyListOption,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWxpc3QvbGlzdC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUNMLGVBQWUsRUFDZixhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLGVBQWUsR0FDaEIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQ0wsYUFBYSxFQUNiLGdCQUFnQixFQUNoQiwrQkFBK0IsRUFDL0IsNkJBQTZCLEVBQzdCLGlCQUFpQixFQUNqQixrQ0FBa0MsR0FDbkMsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUFDLG1CQUFtQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDN0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRTNEOzs7R0FHRztBQUNILE1BMkJhLG1CQUFtQjs7dUhBQW5CLG1CQUFtQjt3SEFBbkIsbUJBQW1CLGlCQVY1QixhQUFhO1FBQ2IsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQiwrQkFBK0I7UUFDL0IsNkJBQTZCO1FBQzdCLGtDQUFrQztRQUNsQyxzQkFBc0I7UUFDdEIsbUJBQW1CLGFBdkJYLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixFQUFFLFlBQVksYUFFOUYsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsK0JBQStCO1FBQy9CLGFBQWE7UUFDYixlQUFlO1FBQ2YsNkJBQTZCO1FBQzdCLGtDQUFrQztRQUNsQyx1QkFBdUI7UUFDdkIsc0JBQXNCO1FBQ3RCLG1CQUFtQjtRQUNuQixnQkFBZ0I7d0hBYVAsbUJBQW1CLFlBMUJwQixhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLEVBTTlGLGFBQWE7UUFDYixlQUFlO1FBR2YsdUJBQXVCO1FBR3ZCLGdCQUFnQjtTQWFQLG1CQUFtQjtrR0FBbkIsbUJBQW1CO2tCQTNCL0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLENBQUM7b0JBQ2pHLE9BQU8sRUFBRTt3QkFDUCxhQUFhO3dCQUNiLGdCQUFnQjt3QkFDaEIsaUJBQWlCO3dCQUNqQiwrQkFBK0I7d0JBQy9CLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZiw2QkFBNkI7d0JBQzdCLGtDQUFrQzt3QkFDbEMsdUJBQXVCO3dCQUN2QixzQkFBc0I7d0JBQ3RCLG1CQUFtQjt3QkFDbkIsZ0JBQWdCO3FCQUNqQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osYUFBYTt3QkFDYixnQkFBZ0I7d0JBQ2hCLGlCQUFpQjt3QkFDakIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLGtDQUFrQzt3QkFDbEMsc0JBQXNCO3dCQUN0QixtQkFBbUI7cUJBQ3BCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNYXRDb21tb25Nb2R1bGUsXG4gIE1hdExpbmVNb2R1bGUsXG4gIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlLFxuICBNYXRSaXBwbGVNb2R1bGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWF0TGVnYWN5TGlzdCxcbiAgTWF0TGVnYWN5TmF2TGlzdCxcbiAgTWF0TGVnYWN5TGlzdEF2YXRhckNzc01hdFN0eWxlcixcbiAgTWF0TGVnYWN5TGlzdEljb25Dc3NNYXRTdHlsZXIsXG4gIE1hdExlZ2FjeUxpc3RJdGVtLFxuICBNYXRMZWdhY3lMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyLFxufSBmcm9tICcuL2xpc3QnO1xuaW1wb3J0IHtNYXRMZWdhY3lMaXN0T3B0aW9uLCBNYXRMZWdhY3lTZWxlY3Rpb25MaXN0fSBmcm9tICcuL3NlbGVjdGlvbi1saXN0JztcbmltcG9ydCB7TWF0RGl2aWRlck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGl2aWRlcic7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRMaXN0TW9kdWxlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9saXN0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRMaW5lTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGUsIENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRMZWdhY3lMaXN0LFxuICAgIE1hdExlZ2FjeU5hdkxpc3QsXG4gICAgTWF0TGVnYWN5TGlzdEl0ZW0sXG4gICAgTWF0TGVnYWN5TGlzdEF2YXRhckNzc01hdFN0eWxlcixcbiAgICBNYXRMaW5lTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRMZWdhY3lMaXN0SWNvbkNzc01hdFN0eWxlcixcbiAgICBNYXRMZWdhY3lMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlLFxuICAgIE1hdExlZ2FjeVNlbGVjdGlvbkxpc3QsXG4gICAgTWF0TGVnYWN5TGlzdE9wdGlvbixcbiAgICBNYXREaXZpZGVyTW9kdWxlLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRMZWdhY3lMaXN0LFxuICAgIE1hdExlZ2FjeU5hdkxpc3QsXG4gICAgTWF0TGVnYWN5TGlzdEl0ZW0sXG4gICAgTWF0TGVnYWN5TGlzdEF2YXRhckNzc01hdFN0eWxlcixcbiAgICBNYXRMZWdhY3lMaXN0SWNvbkNzc01hdFN0eWxlcixcbiAgICBNYXRMZWdhY3lMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdExlZ2FjeVNlbGVjdGlvbkxpc3QsXG4gICAgTWF0TGVnYWN5TGlzdE9wdGlvbixcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5TGlzdE1vZHVsZSB7fVxuIl19