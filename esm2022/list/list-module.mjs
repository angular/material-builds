/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPseudoCheckboxModule, MatRippleModule, MatCommonModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatActionList } from './action-list';
import { MatList, MatListItem } from './list';
import { MatListOption } from './list-option';
import { MatListSubheaderCssMatStyler } from './subheader';
import { MatListItemLine, MatListItemTitle, MatListItemMeta, MatListItemAvatar, MatListItemIcon, } from './list-item-sections';
import { MatNavList } from './nav-list';
import { MatSelectionList } from './selection-list';
import { ObserversModule } from '@angular/cdk/observers';
import * as i0 from "@angular/core";
class MatListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatListModule, declarations: [MatList,
            MatActionList,
            MatNavList,
            MatSelectionList,
            MatListItem,
            MatListOption,
            MatListSubheaderCssMatStyler,
            MatListItemAvatar,
            MatListItemIcon,
            MatListItemLine,
            MatListItemTitle,
            MatListItemMeta], imports: [ObserversModule,
            CommonModule,
            MatCommonModule,
            MatRippleModule,
            MatPseudoCheckboxModule], exports: [MatList,
            MatActionList,
            MatNavList,
            MatSelectionList,
            MatListItem,
            MatListOption,
            MatListItemAvatar,
            MatListItemIcon,
            MatListSubheaderCssMatStyler,
            MatDividerModule,
            MatListItemLine,
            MatListItemTitle,
            MatListItemMeta] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListModule, imports: [ObserversModule,
            CommonModule,
            MatCommonModule,
            MatRippleModule,
            MatPseudoCheckboxModule, MatDividerModule] }); }
}
export { MatListModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        ObserversModule,
                        CommonModule,
                        MatCommonModule,
                        MatRippleModule,
                        MatPseudoCheckboxModule,
                    ],
                    exports: [
                        MatList,
                        MatActionList,
                        MatNavList,
                        MatSelectionList,
                        MatListItem,
                        MatListOption,
                        MatListItemAvatar,
                        MatListItemIcon,
                        MatListSubheaderCssMatStyler,
                        MatDividerModule,
                        MatListItemLine,
                        MatListItemTitle,
                        MatListItemMeta,
                    ],
                    declarations: [
                        MatList,
                        MatActionList,
                        MatNavList,
                        MatSelectionList,
                        MatListItem,
                        MatListOption,
                        MatListSubheaderCssMatStyler,
                        MatListItemAvatar,
                        MatListItemIcon,
                        MatListItemLine,
                        MatListItemTitle,
                        MatListItemMeta,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pHLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekQsT0FBTyxFQUNMLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixlQUFlLEdBQ2hCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBRXZELE1Bc0NhLGFBQWE7OEdBQWIsYUFBYTsrR0FBYixhQUFhLGlCQWR0QixPQUFPO1lBQ1AsYUFBYTtZQUNiLFVBQVU7WUFDVixnQkFBZ0I7WUFDaEIsV0FBVztZQUNYLGFBQWE7WUFDYiw0QkFBNEI7WUFDNUIsaUJBQWlCO1lBQ2pCLGVBQWU7WUFDZixlQUFlO1lBQ2YsZ0JBQWdCO1lBQ2hCLGVBQWUsYUFqQ2YsZUFBZTtZQUNmLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtZQUNmLHVCQUF1QixhQUd2QixPQUFPO1lBQ1AsYUFBYTtZQUNiLFVBQVU7WUFDVixnQkFBZ0I7WUFDaEIsV0FBVztZQUNYLGFBQWE7WUFDYixpQkFBaUI7WUFDakIsZUFBZTtZQUNmLDRCQUE0QjtZQUM1QixnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLGdCQUFnQjtZQUNoQixlQUFlOytHQWlCTixhQUFhLFlBcEN0QixlQUFlO1lBQ2YsWUFBWTtZQUNaLGVBQWU7WUFDZixlQUFlO1lBQ2YsdUJBQXVCLEVBWXZCLGdCQUFnQjs7U0FvQlAsYUFBYTsyRkFBYixhQUFhO2tCQXRDekIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZix1QkFBdUI7cUJBQ3hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxPQUFPO3dCQUNQLGFBQWE7d0JBQ2IsVUFBVTt3QkFDVixnQkFBZ0I7d0JBQ2hCLFdBQVc7d0JBQ1gsYUFBYTt3QkFDYixpQkFBaUI7d0JBQ2pCLGVBQWU7d0JBQ2YsNEJBQTRCO3dCQUM1QixnQkFBZ0I7d0JBQ2hCLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQixlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osT0FBTzt3QkFDUCxhQUFhO3dCQUNiLFVBQVU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixXQUFXO3dCQUNYLGFBQWE7d0JBQ2IsNEJBQTRCO3dCQUM1QixpQkFBaUI7d0JBQ2pCLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixnQkFBZ0I7d0JBQ2hCLGVBQWU7cUJBQ2hCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFBzZXVkb0NoZWNrYm94TW9kdWxlLCBNYXRSaXBwbGVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdERpdmlkZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpdmlkZXInO1xuaW1wb3J0IHtNYXRBY3Rpb25MaXN0fSBmcm9tICcuL2FjdGlvbi1saXN0JztcbmltcG9ydCB7TWF0TGlzdCwgTWF0TGlzdEl0ZW19IGZyb20gJy4vbGlzdCc7XG5pbXBvcnQge01hdExpc3RPcHRpb259IGZyb20gJy4vbGlzdC1vcHRpb24nO1xuaW1wb3J0IHtNYXRMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyfSBmcm9tICcuL3N1YmhlYWRlcic7XG5pbXBvcnQge1xuICBNYXRMaXN0SXRlbUxpbmUsXG4gIE1hdExpc3RJdGVtVGl0bGUsXG4gIE1hdExpc3RJdGVtTWV0YSxcbiAgTWF0TGlzdEl0ZW1BdmF0YXIsXG4gIE1hdExpc3RJdGVtSWNvbixcbn0gZnJvbSAnLi9saXN0LWl0ZW0tc2VjdGlvbnMnO1xuaW1wb3J0IHtNYXROYXZMaXN0fSBmcm9tICcuL25hdi1saXN0JztcbmltcG9ydCB7TWF0U2VsZWN0aW9uTGlzdH0gZnJvbSAnLi9zZWxlY3Rpb24tbGlzdCc7XG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBPYnNlcnZlcnNNb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRSaXBwbGVNb2R1bGUsXG4gICAgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRMaXN0LFxuICAgIE1hdEFjdGlvbkxpc3QsXG4gICAgTWF0TmF2TGlzdCxcbiAgICBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIE1hdExpc3RJdGVtLFxuICAgIE1hdExpc3RPcHRpb24sXG4gICAgTWF0TGlzdEl0ZW1BdmF0YXIsXG4gICAgTWF0TGlzdEl0ZW1JY29uLFxuICAgIE1hdExpc3RTdWJoZWFkZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0RGl2aWRlck1vZHVsZSxcbiAgICBNYXRMaXN0SXRlbUxpbmUsXG4gICAgTWF0TGlzdEl0ZW1UaXRsZSxcbiAgICBNYXRMaXN0SXRlbU1ldGEsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdExpc3QsXG4gICAgTWF0QWN0aW9uTGlzdCxcbiAgICBNYXROYXZMaXN0LFxuICAgIE1hdFNlbGVjdGlvbkxpc3QsXG4gICAgTWF0TGlzdEl0ZW0sXG4gICAgTWF0TGlzdE9wdGlvbixcbiAgICBNYXRMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdExpc3RJdGVtQXZhdGFyLFxuICAgIE1hdExpc3RJdGVtSWNvbixcbiAgICBNYXRMaXN0SXRlbUxpbmUsXG4gICAgTWF0TGlzdEl0ZW1UaXRsZSxcbiAgICBNYXRMaXN0SXRlbU1ldGEsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RNb2R1bGUge31cbiJdfQ==