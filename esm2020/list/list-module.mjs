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
import { MatList, MatNavList, MatListAvatarCssMatStyler, MatListIconCssMatStyler, MatListItem, MatListSubheaderCssMatStyler, } from './list';
import { MatListOption, MatSelectionList } from './selection-list';
import { MatDividerModule } from '@angular/material/divider';
import * as i0 from "@angular/core";
export class MatListModule {
}
MatListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: MatListModule, declarations: [MatList,
        MatNavList,
        MatListItem,
        MatListAvatarCssMatStyler,
        MatListIconCssMatStyler,
        MatListSubheaderCssMatStyler,
        MatSelectionList,
        MatListOption], imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule], exports: [MatList,
        MatNavList,
        MatListItem,
        MatListAvatarCssMatStyler,
        MatLineModule,
        MatCommonModule,
        MatListIconCssMatStyler,
        MatListSubheaderCssMatStyler,
        MatPseudoCheckboxModule,
        MatSelectionList,
        MatListOption,
        MatDividerModule] });
MatListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatListModule, imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule, MatLineModule,
        MatCommonModule,
        MatPseudoCheckboxModule,
        MatDividerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule],
                    exports: [
                        MatList,
                        MatNavList,
                        MatListItem,
                        MatListAvatarCssMatStyler,
                        MatLineModule,
                        MatCommonModule,
                        MatListIconCssMatStyler,
                        MatListSubheaderCssMatStyler,
                        MatPseudoCheckboxModule,
                        MatSelectionList,
                        MatListOption,
                        MatDividerModule,
                    ],
                    declarations: [
                        MatList,
                        MatNavList,
                        MatListItem,
                        MatListAvatarCssMatStyler,
                        MatListIconCssMatStyler,
                        MatListSubheaderCssMatStyler,
                        MatSelectionList,
                        MatListOption,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYix1QkFBdUIsRUFDdkIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLHlCQUF5QixFQUN6Qix1QkFBdUIsRUFDdkIsV0FBVyxFQUNYLDRCQUE0QixHQUM3QixNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDakUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBNkIzRCxNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQVZ0QixPQUFPO1FBQ1AsVUFBVTtRQUNWLFdBQVc7UUFDWCx5QkFBeUI7UUFDekIsdUJBQXVCO1FBQ3ZCLDRCQUE0QjtRQUM1QixnQkFBZ0I7UUFDaEIsYUFBYSxhQXZCTCxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLGFBRTlGLE9BQU87UUFDUCxVQUFVO1FBQ1YsV0FBVztRQUNYLHlCQUF5QjtRQUN6QixhQUFhO1FBQ2IsZUFBZTtRQUNmLHVCQUF1QjtRQUN2Qiw0QkFBNEI7UUFDNUIsdUJBQXVCO1FBQ3ZCLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsZ0JBQWdCOzJHQWFQLGFBQWEsWUExQmQsYUFBYSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsdUJBQXVCLEVBQUUsWUFBWSxFQU05RixhQUFhO1FBQ2IsZUFBZTtRQUdmLHVCQUF1QjtRQUd2QixnQkFBZ0I7MkZBYVAsYUFBYTtrQkEzQnpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsdUJBQXVCLEVBQUUsWUFBWSxDQUFDO29CQUNqRyxPQUFPLEVBQUU7d0JBQ1AsT0FBTzt3QkFDUCxVQUFVO3dCQUNWLFdBQVc7d0JBQ1gseUJBQXlCO3dCQUN6QixhQUFhO3dCQUNiLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2Qiw0QkFBNEI7d0JBQzVCLHVCQUF1Qjt3QkFDdkIsZ0JBQWdCO3dCQUNoQixhQUFhO3dCQUNiLGdCQUFnQjtxQkFDakI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLE9BQU87d0JBQ1AsVUFBVTt3QkFDVixXQUFXO3dCQUNYLHlCQUF5Qjt3QkFDekIsdUJBQXVCO3dCQUN2Qiw0QkFBNEI7d0JBQzVCLGdCQUFnQjt3QkFDaEIsYUFBYTtxQkFDZDtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWF0Q29tbW9uTW9kdWxlLFxuICBNYXRMaW5lTW9kdWxlLFxuICBNYXRQc2V1ZG9DaGVja2JveE1vZHVsZSxcbiAgTWF0UmlwcGxlTW9kdWxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7XG4gIE1hdExpc3QsXG4gIE1hdE5hdkxpc3QsXG4gIE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsXG4gIE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyLFxuICBNYXRMaXN0SXRlbSxcbiAgTWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlcixcbn0gZnJvbSAnLi9saXN0JztcbmltcG9ydCB7TWF0TGlzdE9wdGlvbiwgTWF0U2VsZWN0aW9uTGlzdH0gZnJvbSAnLi9zZWxlY3Rpb24tbGlzdCc7XG5pbXBvcnQge01hdERpdmlkZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpdmlkZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0TGluZU1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0TGlzdCxcbiAgICBNYXROYXZMaXN0LFxuICAgIE1hdExpc3RJdGVtLFxuICAgIE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0TGluZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0TGlzdEljb25Dc3NNYXRTdHlsZXIsXG4gICAgTWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlcixcbiAgICBNYXRQc2V1ZG9DaGVja2JveE1vZHVsZSxcbiAgICBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIE1hdExpc3RPcHRpb24sXG4gICAgTWF0RGl2aWRlck1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0TGlzdCxcbiAgICBNYXROYXZMaXN0LFxuICAgIE1hdExpc3RJdGVtLFxuICAgIE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0TGlzdEljb25Dc3NNYXRTdHlsZXIsXG4gICAgTWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlcixcbiAgICBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIE1hdExpc3RPcHRpb24sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RNb2R1bGUge31cbiJdfQ==