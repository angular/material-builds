/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatPaginator } from './paginator';
import { MAT_PAGINATOR_INTL_PROVIDER } from './paginator-intl';
import * as i0 from "@angular/core";
export class MatPaginatorModule {
}
MatPaginatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatPaginatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, declarations: [MatPaginator], imports: [CommonModule,
        MatButtonModule,
        MatLegacySelectModule,
        MatLegacyTooltipModule,
        MatCommonModule], exports: [MatPaginator] });
MatPaginatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, providers: [MAT_PAGINATOR_INTL_PROVIDER], imports: [CommonModule,
        MatButtonModule,
        MatLegacySelectModule,
        MatLegacyTooltipModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatButtonModule,
                        MatLegacySelectModule,
                        MatLegacyTooltipModule,
                        MatCommonModule,
                    ],
                    exports: [MatPaginator],
                    declarations: [MatPaginator],
                    providers: [MAT_PAGINATOR_INTL_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9wYWdpbmF0b3IvcGFnaW5hdG9yLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7O0FBYzdELE1BQU0sT0FBTyxrQkFBa0I7OytHQUFsQixrQkFBa0I7Z0hBQWxCLGtCQUFrQixpQkFIZCxZQUFZLGFBUHpCLFlBQVk7UUFDWixlQUFlO1FBQ2YscUJBQXFCO1FBQ3JCLHNCQUFzQjtRQUN0QixlQUFlLGFBRVAsWUFBWTtnSEFJWCxrQkFBa0IsYUFGbEIsQ0FBQywyQkFBMkIsQ0FBQyxZQVJ0QyxZQUFZO1FBQ1osZUFBZTtRQUNmLHFCQUFxQjtRQUNyQixzQkFBc0I7UUFDdEIsZUFBZTsyRkFNTixrQkFBa0I7a0JBWjlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixxQkFBcUI7d0JBQ3JCLHNCQUFzQjt3QkFDdEIsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQzVCLFNBQVMsRUFBRSxDQUFDLDJCQUEyQixDQUFDO2lCQUN6QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRCdXR0b25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge01hdExlZ2FjeVNlbGVjdE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LXNlbGVjdCc7XG5pbXBvcnQge01hdExlZ2FjeVRvb2x0aXBNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS10b29sdGlwJztcbmltcG9ydCB7TWF0UGFnaW5hdG9yfSBmcm9tICcuL3BhZ2luYXRvcic7XG5pbXBvcnQge01BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUn0gZnJvbSAnLi9wYWdpbmF0b3ItaW50bCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE1hdExlZ2FjeVNlbGVjdE1vZHVsZSxcbiAgICBNYXRMZWdhY3lUb29sdGlwTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW01hdFBhZ2luYXRvcl0sXG4gIGRlY2xhcmF0aW9uczogW01hdFBhZ2luYXRvcl0sXG4gIHByb3ZpZGVyczogW01BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvck1vZHVsZSB7fVxuIl19