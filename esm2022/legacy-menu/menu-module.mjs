/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/menu';
import { MatLegacyMenu } from './menu';
import { MatLegacyMenuContent } from './menu-content';
import { MatLegacyMenuItem } from './menu-item';
import { MatLegacyMenuTrigger } from './menu-trigger';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatMenuModule` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyMenuModule, declarations: [MatLegacyMenu, MatLegacyMenuItem, MatLegacyMenuTrigger, MatLegacyMenuContent], imports: [CommonModule, MatCommonModule, MatRippleModule, OverlayModule], exports: [CdkScrollableModule,
            MatCommonModule,
            MatLegacyMenu,
            MatLegacyMenuItem,
            MatLegacyMenuTrigger,
            MatLegacyMenuContent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyMenuModule, providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule, MatCommonModule, MatRippleModule, OverlayModule, CdkScrollableModule,
            MatCommonModule] }); }
}
export { MatLegacyMenuModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, MatRippleModule, OverlayModule],
                    exports: [
                        CdkScrollableModule,
                        MatCommonModule,
                        MatLegacyMenu,
                        MatLegacyMenuItem,
                        MatLegacyMenuTrigger,
                        MatLegacyMenuContent,
                    ],
                    declarations: [MatLegacyMenu, MatLegacyMenuItem, MatLegacyMenuTrigger, MatLegacyMenuContent],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LW1lbnUvbWVudS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLHlDQUF5QyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNyQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXBEOzs7R0FHRztBQUNILE1BYWEsbUJBQW1COzhHQUFuQixtQkFBbUI7K0dBQW5CLG1CQUFtQixpQkFIZixhQUFhLEVBQUUsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLGFBVGpGLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsYUFFckUsbUJBQW1CO1lBQ25CLGVBQWU7WUFDZixhQUFhO1lBQ2IsaUJBQWlCO1lBQ2pCLG9CQUFvQjtZQUNwQixvQkFBb0I7K0dBS1gsbUJBQW1CLGFBRm5CLENBQUMseUNBQXlDLENBQUMsWUFWNUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUVyRSxtQkFBbUI7WUFDbkIsZUFBZTs7U0FTTixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFiL0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUM7b0JBQ3hFLE9BQU8sRUFBRTt3QkFDUCxtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixpQkFBaUI7d0JBQ2pCLG9CQUFvQjt3QkFDcEIsb0JBQW9CO3FCQUNyQjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7b0JBQzVGLFNBQVMsRUFBRSxDQUFDLHlDQUF5QyxDQUFDO2lCQUN2RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcbmltcG9ydCB7TWF0TGVnYWN5TWVudX0gZnJvbSAnLi9tZW51JztcbmltcG9ydCB7TWF0TGVnYWN5TWVudUNvbnRlbnR9IGZyb20gJy4vbWVudS1jb250ZW50JztcbmltcG9ydCB7TWF0TGVnYWN5TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmltcG9ydCB7TWF0TGVnYWN5TWVudVRyaWdnZXJ9IGZyb20gJy4vbWVudS10cmlnZ2VyJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE1lbnVNb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL21lbnVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGUsIE92ZXJsYXlNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0TGVnYWN5TWVudSxcbiAgICBNYXRMZWdhY3lNZW51SXRlbSxcbiAgICBNYXRMZWdhY3lNZW51VHJpZ2dlcixcbiAgICBNYXRMZWdhY3lNZW51Q29udGVudCxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5TWVudSwgTWF0TGVnYWN5TWVudUl0ZW0sIE1hdExlZ2FjeU1lbnVUcmlnZ2VyLCBNYXRMZWdhY3lNZW51Q29udGVudF0sXG4gIHByb3ZpZGVyczogW01BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5TWVudU1vZHVsZSB7fVxuIl19