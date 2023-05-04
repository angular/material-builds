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
import { MatCommonModule } from '@angular/material/core';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { MatLegacySelect, MatLegacySelectTrigger } from './select';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatSelectModule` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySelectModule, declarations: [MatLegacySelect, MatLegacySelectTrigger], imports: [CommonModule, OverlayModule, MatLegacyOptionModule, MatCommonModule], exports: [CdkScrollableModule,
            MatLegacyFormFieldModule,
            MatLegacySelect,
            MatLegacySelectTrigger,
            MatLegacyOptionModule,
            MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySelectModule, providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER], imports: [CommonModule, OverlayModule, MatLegacyOptionModule, MatCommonModule, CdkScrollableModule,
            MatLegacyFormFieldModule,
            MatLegacyOptionModule,
            MatCommonModule] }); }
}
export { MatLegacySelectModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, MatLegacyOptionModule, MatCommonModule],
                    exports: [
                        CdkScrollableModule,
                        MatLegacyFormFieldModule,
                        MatLegacySelect,
                        MatLegacySelectTrigger,
                        MatLegacyOptionModule,
                        MatCommonModule,
                    ],
                    declarations: [MatLegacySelect, MatLegacySelectTrigger],
                    providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktc2VsZWN0L3NlbGVjdC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsbUNBQW1DLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RSxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVqRTs7O0dBR0c7QUFDSCxNQWFhLHFCQUFxQjs4R0FBckIscUJBQXFCOytHQUFyQixxQkFBcUIsaUJBSGpCLGVBQWUsRUFBRSxzQkFBc0IsYUFUNUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLGFBRTNFLG1CQUFtQjtZQUNuQix3QkFBd0I7WUFDeEIsZUFBZTtZQUNmLHNCQUFzQjtZQUN0QixxQkFBcUI7WUFDckIsZUFBZTsrR0FLTixxQkFBcUIsYUFGckIsQ0FBQyxtQ0FBbUMsQ0FBQyxZQVZ0QyxZQUFZLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFFM0UsbUJBQW1CO1lBQ25CLHdCQUF3QjtZQUd4QixxQkFBcUI7WUFDckIsZUFBZTs7U0FLTixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFiakMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGVBQWUsQ0FBQztvQkFDOUUsT0FBTyxFQUFFO3dCQUNQLG1CQUFtQjt3QkFDbkIsd0JBQXdCO3dCQUN4QixlQUFlO3dCQUNmLHNCQUFzQjt3QkFDdEIscUJBQXFCO3dCQUNyQixlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUM7b0JBQ3ZELFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO2lCQUNqRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdExlZ2FjeU9wdGlvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWNvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1mb3JtLWZpZWxkJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QnO1xuaW1wb3J0IHtNYXRMZWdhY3lTZWxlY3QsIE1hdExlZ2FjeVNlbGVjdFRyaWdnZXJ9IGZyb20gJy4vc2VsZWN0JztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFNlbGVjdE1vZHVsZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE92ZXJsYXlNb2R1bGUsIE1hdExlZ2FjeU9wdGlvbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgTWF0TGVnYWN5Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdExlZ2FjeVNlbGVjdCxcbiAgICBNYXRMZWdhY3lTZWxlY3RUcmlnZ2VyLFxuICAgIE1hdExlZ2FjeU9wdGlvbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW01hdExlZ2FjeVNlbGVjdCwgTWF0TGVnYWN5U2VsZWN0VHJpZ2dlcl0sXG4gIHByb3ZpZGVyczogW01BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5U2VsZWN0TW9kdWxlIHt9XG4iXX0=