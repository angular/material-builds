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
export class MatListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.4", ngImport: i0, type: MatListModule, declarations: [MatList,
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
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListModule, imports: [ObserversModule,
            CommonModule,
            MatCommonModule,
            MatRippleModule,
            MatPseudoCheckboxModule, MatDividerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListModule, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pHLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekQsT0FBTyxFQUNMLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixlQUFlLEdBQ2hCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBd0N2RCxNQUFNLE9BQU8sYUFBYTs4R0FBYixhQUFhOytHQUFiLGFBQWEsaUJBZHRCLE9BQU87WUFDUCxhQUFhO1lBQ2IsVUFBVTtZQUNWLGdCQUFnQjtZQUNoQixXQUFXO1lBQ1gsYUFBYTtZQUNiLDRCQUE0QjtZQUM1QixpQkFBaUI7WUFDakIsZUFBZTtZQUNmLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsZUFBZSxhQWpDZixlQUFlO1lBQ2YsWUFBWTtZQUNaLGVBQWU7WUFDZixlQUFlO1lBQ2YsdUJBQXVCLGFBR3ZCLE9BQU87WUFDUCxhQUFhO1lBQ2IsVUFBVTtZQUNWLGdCQUFnQjtZQUNoQixXQUFXO1lBQ1gsYUFBYTtZQUNiLGlCQUFpQjtZQUNqQixlQUFlO1lBQ2YsNEJBQTRCO1lBQzVCLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsZ0JBQWdCO1lBQ2hCLGVBQWU7K0dBaUJOLGFBQWEsWUFwQ3RCLGVBQWU7WUFDZixZQUFZO1lBQ1osZUFBZTtZQUNmLGVBQWU7WUFDZix1QkFBdUIsRUFZdkIsZ0JBQWdCOzsyRkFvQlAsYUFBYTtrQkF0Q3pCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2YsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsdUJBQXVCO3FCQUN4QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsT0FBTzt3QkFDUCxhQUFhO3dCQUNiLFVBQVU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixXQUFXO3dCQUNYLGFBQWE7d0JBQ2IsaUJBQWlCO3dCQUNqQixlQUFlO3dCQUNmLDRCQUE0Qjt3QkFDNUIsZ0JBQWdCO3dCQUNoQixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIsZUFBZTtxQkFDaEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLE9BQU87d0JBQ1AsYUFBYTt3QkFDYixVQUFVO3dCQUNWLGdCQUFnQjt3QkFDaEIsV0FBVzt3QkFDWCxhQUFhO3dCQUNiLDRCQUE0Qjt3QkFDNUIsaUJBQWlCO3dCQUNqQixlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQixlQUFlO3FCQUNoQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRQc2V1ZG9DaGVja2JveE1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXREaXZpZGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaXZpZGVyJztcbmltcG9ydCB7TWF0QWN0aW9uTGlzdH0gZnJvbSAnLi9hY3Rpb24tbGlzdCc7XG5pbXBvcnQge01hdExpc3QsIE1hdExpc3RJdGVtfSBmcm9tICcuL2xpc3QnO1xuaW1wb3J0IHtNYXRMaXN0T3B0aW9ufSBmcm9tICcuL2xpc3Qtb3B0aW9uJztcbmltcG9ydCB7TWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlcn0gZnJvbSAnLi9zdWJoZWFkZXInO1xuaW1wb3J0IHtcbiAgTWF0TGlzdEl0ZW1MaW5lLFxuICBNYXRMaXN0SXRlbVRpdGxlLFxuICBNYXRMaXN0SXRlbU1ldGEsXG4gIE1hdExpc3RJdGVtQXZhdGFyLFxuICBNYXRMaXN0SXRlbUljb24sXG59IGZyb20gJy4vbGlzdC1pdGVtLXNlY3Rpb25zJztcbmltcG9ydCB7TWF0TmF2TGlzdH0gZnJvbSAnLi9uYXYtbGlzdCc7XG5pbXBvcnQge01hdFNlbGVjdGlvbkxpc3R9IGZyb20gJy4vc2VsZWN0aW9uLWxpc3QnO1xuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0TGlzdCxcbiAgICBNYXRBY3Rpb25MaXN0LFxuICAgIE1hdE5hdkxpc3QsXG4gICAgTWF0U2VsZWN0aW9uTGlzdCxcbiAgICBNYXRMaXN0SXRlbSxcbiAgICBNYXRMaXN0T3B0aW9uLFxuICAgIE1hdExpc3RJdGVtQXZhdGFyLFxuICAgIE1hdExpc3RJdGVtSWNvbixcbiAgICBNYXRMaXN0U3ViaGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdERpdmlkZXJNb2R1bGUsXG4gICAgTWF0TGlzdEl0ZW1MaW5lLFxuICAgIE1hdExpc3RJdGVtVGl0bGUsXG4gICAgTWF0TGlzdEl0ZW1NZXRhLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRMaXN0LFxuICAgIE1hdEFjdGlvbkxpc3QsXG4gICAgTWF0TmF2TGlzdCxcbiAgICBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIE1hdExpc3RJdGVtLFxuICAgIE1hdExpc3RPcHRpb24sXG4gICAgTWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlcixcbiAgICBNYXRMaXN0SXRlbUF2YXRhcixcbiAgICBNYXRMaXN0SXRlbUljb24sXG4gICAgTWF0TGlzdEl0ZW1MaW5lLFxuICAgIE1hdExpc3RJdGVtVGl0bGUsXG4gICAgTWF0TGlzdEl0ZW1NZXRhLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0TW9kdWxlIHt9XG4iXX0=