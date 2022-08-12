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
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatPaginator } from './paginator';
import { MAT_PAGINATOR_INTL_PROVIDER } from './paginator-intl';
import * as i0 from "@angular/core";
export class MatPaginatorModule {
}
MatPaginatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatPaginatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, declarations: [MatPaginator], imports: [CommonModule,
        MatLegacyButtonModule,
        MatLegacySelectModule,
        MatLegacyTooltipModule,
        MatCommonModule], exports: [MatPaginator] });
MatPaginatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, providers: [MAT_PAGINATOR_INTL_PROVIDER], imports: [CommonModule,
        MatLegacyButtonModule,
        MatLegacySelectModule,
        MatLegacyTooltipModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatLegacyButtonModule,
                        MatLegacySelectModule,
                        MatLegacyTooltipModule,
                        MatCommonModule,
                    ],
                    exports: [MatPaginator],
                    declarations: [MatPaginator],
                    providers: [MAT_PAGINATOR_INTL_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9wYWdpbmF0b3IvcGFnaW5hdG9yLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDdEUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDdEUsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDeEUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFjN0QsTUFBTSxPQUFPLGtCQUFrQjs7K0dBQWxCLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQUhkLFlBQVksYUFQekIsWUFBWTtRQUNaLHFCQUFxQjtRQUNyQixxQkFBcUI7UUFDckIsc0JBQXNCO1FBQ3RCLGVBQWUsYUFFUCxZQUFZO2dIQUlYLGtCQUFrQixhQUZsQixDQUFDLDJCQUEyQixDQUFDLFlBUnRDLFlBQVk7UUFDWixxQkFBcUI7UUFDckIscUJBQXFCO1FBQ3JCLHNCQUFzQjtRQUN0QixlQUFlOzJGQU1OLGtCQUFrQjtrQkFaOUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixxQkFBcUI7d0JBQ3JCLHFCQUFxQjt3QkFDckIsc0JBQXNCO3dCQUN0QixlQUFlO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDNUIsU0FBUyxFQUFFLENBQUMsMkJBQTJCLENBQUM7aUJBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdExlZ2FjeUJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWJ1dHRvbic7XG5pbXBvcnQge01hdExlZ2FjeVNlbGVjdE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LXNlbGVjdCc7XG5pbXBvcnQge01hdExlZ2FjeVRvb2x0aXBNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS10b29sdGlwJztcbmltcG9ydCB7TWF0UGFnaW5hdG9yfSBmcm9tICcuL3BhZ2luYXRvcic7XG5pbXBvcnQge01BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUn0gZnJvbSAnLi9wYWdpbmF0b3ItaW50bCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0TGVnYWN5QnV0dG9uTW9kdWxlLFxuICAgIE1hdExlZ2FjeVNlbGVjdE1vZHVsZSxcbiAgICBNYXRMZWdhY3lUb29sdGlwTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW01hdFBhZ2luYXRvcl0sXG4gIGRlY2xhcmF0aW9uczogW01hdFBhZ2luYXRvcl0sXG4gIHByb3ZpZGVyczogW01BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvck1vZHVsZSB7fVxuIl19