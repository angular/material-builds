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
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from './paginator';
import { MAT_PAGINATOR_INTL_PROVIDER } from './paginator-intl';
import * as i0 from "@angular/core";
export class MatPaginatorModule {
}
MatPaginatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatPaginatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatPaginatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatPaginatorModule, declarations: [MatPaginator], imports: [CommonModule, MatButtonModule, MatSelectModule, MatTooltipModule, MatCommonModule], exports: [MatPaginator] });
MatPaginatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatPaginatorModule, providers: [MAT_PAGINATOR_INTL_PROVIDER], imports: [CommonModule, MatButtonModule, MatSelectModule, MatTooltipModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatPaginatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatButtonModule, MatSelectModule, MatTooltipModule, MatCommonModule],
                    exports: [MatPaginator],
                    declarations: [MatPaginator],
                    providers: [MAT_PAGINATOR_INTL_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9wYWdpbmF0b3IvcGFnaW5hdG9yLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLGtCQUFrQixDQUFDOztBQVE3RCxNQUFNLE9BQU8sa0JBQWtCOztvSEFBbEIsa0JBQWtCO3FIQUFsQixrQkFBa0IsaUJBSGQsWUFBWSxhQUZqQixZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLGFBQ2pGLFlBQVk7cUhBSVgsa0JBQWtCLGFBRmxCLENBQUMsMkJBQTJCLENBQUMsWUFIOUIsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZTtnR0FLaEYsa0JBQWtCO2tCQU45QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztvQkFDNUYsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQzVCLFNBQVMsRUFBRSxDQUFDLDJCQUEyQixDQUFDO2lCQUN6QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRCdXR0b25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge01hdFNlbGVjdE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcbmltcG9ydCB7TWF0VG9vbHRpcE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcCc7XG5pbXBvcnQge01hdFBhZ2luYXRvcn0gZnJvbSAnLi9wYWdpbmF0b3InO1xuaW1wb3J0IHtNQVRfUEFHSU5BVE9SX0lOVExfUFJPVklERVJ9IGZyb20gJy4vcGFnaW5hdG9yLWludGwnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBNYXRCdXR0b25Nb2R1bGUsIE1hdFNlbGVjdE1vZHVsZSwgTWF0VG9vbHRpcE1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFBhZ2luYXRvcl0sXG4gIGRlY2xhcmF0aW9uczogW01hdFBhZ2luYXRvcl0sXG4gIHByb3ZpZGVyczogW01BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvck1vZHVsZSB7fVxuIl19