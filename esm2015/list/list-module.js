/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatLineModule, MatPseudoCheckboxModule, MatRippleModule, } from '@angular/material/core';
import { MatList, MatNavList, MatListAvatarCssMatStyler, MatListIconCssMatStyler, MatListItem, MatListSubheaderCssMatStyler, } from './list';
import { MatListOption, MatSelectionList } from './selection-list';
import { MatDividerModule } from '@angular/material/divider';
let MatListModule = /** @class */ (() => {
    let MatListModule = class MatListModule {
    };
    MatListModule = __decorate([
        NgModule({
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
                MatDividerModule
            ],
            declarations: [
                MatList,
                MatNavList,
                MatListItem,
                MatListAvatarCssMatStyler,
                MatListIconCssMatStyler,
                MatListSubheaderCssMatStyler,
                MatSelectionList,
                MatListOption
            ],
        })
    ], MatListModule);
    return MatListModule;
})();
export { MatListModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUNMLGVBQWUsRUFDZixhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLGVBQWUsR0FDaEIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFDVix5QkFBeUIsRUFDekIsdUJBQXVCLEVBQ3ZCLFdBQVcsRUFDWCw0QkFBNEIsR0FDN0IsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBOEIzRDtJQUFBLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7S0FBRyxDQUFBO0lBQWhCLGFBQWE7UUEzQnpCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixFQUFFLFlBQVksQ0FBQztZQUNqRyxPQUFPLEVBQUU7Z0JBQ1AsT0FBTztnQkFDUCxVQUFVO2dCQUNWLFdBQVc7Z0JBQ1gseUJBQXlCO2dCQUN6QixhQUFhO2dCQUNiLGVBQWU7Z0JBQ2YsdUJBQXVCO2dCQUN2Qiw0QkFBNEI7Z0JBQzVCLHVCQUF1QjtnQkFDdkIsZ0JBQWdCO2dCQUNoQixhQUFhO2dCQUNiLGdCQUFnQjthQUNqQjtZQUNELFlBQVksRUFBRTtnQkFDWixPQUFPO2dCQUNQLFVBQVU7Z0JBQ1YsV0FBVztnQkFDWCx5QkFBeUI7Z0JBQ3pCLHVCQUF1QjtnQkFDdkIsNEJBQTRCO2dCQUM1QixnQkFBZ0I7Z0JBQ2hCLGFBQWE7YUFDZDtTQUNGLENBQUM7T0FDVyxhQUFhLENBQUc7SUFBRCxvQkFBQztLQUFBO1NBQWhCLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1hdENvbW1vbk1vZHVsZSxcbiAgTWF0TGluZU1vZHVsZSxcbiAgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGUsXG4gIE1hdFJpcHBsZU1vZHVsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBNYXRMaXN0LFxuICBNYXROYXZMaXN0LFxuICBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLFxuICBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcixcbiAgTWF0TGlzdEl0ZW0sXG4gIE1hdExpc3RTdWJoZWFkZXJDc3NNYXRTdHlsZXIsXG59IGZyb20gJy4vbGlzdCc7XG5pbXBvcnQge01hdExpc3RPcHRpb24sIE1hdFNlbGVjdGlvbkxpc3R9IGZyb20gJy4vc2VsZWN0aW9uLWxpc3QnO1xuaW1wb3J0IHtNYXREaXZpZGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaXZpZGVyJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0TGluZU1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0TGlzdCxcbiAgICBNYXROYXZMaXN0LFxuICAgIE1hdExpc3RJdGVtLFxuICAgIE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0TGluZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0TGlzdEljb25Dc3NNYXRTdHlsZXIsXG4gICAgTWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlcixcbiAgICBNYXRQc2V1ZG9DaGVja2JveE1vZHVsZSxcbiAgICBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIE1hdExpc3RPcHRpb24sXG4gICAgTWF0RGl2aWRlck1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRMaXN0LFxuICAgIE1hdE5hdkxpc3QsXG4gICAgTWF0TGlzdEl0ZW0sXG4gICAgTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcixcbiAgICBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcixcbiAgICBNYXRMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdFNlbGVjdGlvbkxpc3QsXG4gICAgTWF0TGlzdE9wdGlvblxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0TW9kdWxlIHt9XG4iXX0=