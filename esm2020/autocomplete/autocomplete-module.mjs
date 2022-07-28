/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatCommonModule } from '@angular/material/core';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatAutocomplete } from './autocomplete';
import { MatAutocompleteTrigger, MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './autocomplete-trigger';
import { MatAutocompleteOrigin } from './autocomplete-origin';
import * as i0 from "@angular/core";
export class MatAutocompleteModule {
}
MatAutocompleteModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatAutocompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatAutocompleteModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: MatAutocompleteModule, declarations: [MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteOrigin], imports: [OverlayModule, MatLegacyOptionModule, MatCommonModule, CommonModule], exports: [MatAutocomplete,
        MatAutocompleteTrigger,
        MatAutocompleteOrigin,
        CdkScrollableModule,
        MatLegacyOptionModule,
        MatCommonModule] });
MatAutocompleteModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatAutocompleteModule, providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [OverlayModule, MatLegacyOptionModule, MatCommonModule, CommonModule, CdkScrollableModule,
        MatLegacyOptionModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatAutocompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, MatLegacyOptionModule, MatCommonModule, CommonModule],
                    exports: [
                        MatAutocomplete,
                        MatAutocompleteTrigger,
                        MatAutocompleteOrigin,
                        CdkScrollableModule,
                        MatLegacyOptionModule,
                        MatCommonModule,
                    ],
                    declarations: [MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteOrigin],
                    providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsc0JBQXNCLEVBQ3RCLGlEQUFpRCxHQUNsRCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQWU1RCxNQUFNLE9BQU8scUJBQXFCOztrSEFBckIscUJBQXFCO21IQUFyQixxQkFBcUIsaUJBSGpCLGVBQWUsRUFBRSxzQkFBc0IsRUFBRSxxQkFBcUIsYUFUbkUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxZQUFZLGFBRTNFLGVBQWU7UUFDZixzQkFBc0I7UUFDdEIscUJBQXFCO1FBQ3JCLG1CQUFtQjtRQUNuQixxQkFBcUI7UUFDckIsZUFBZTttSEFLTixxQkFBcUIsYUFGckIsQ0FBQyxpREFBaUQsQ0FBQyxZQVZwRCxhQUFhLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFLM0UsbUJBQW1CO1FBQ25CLHFCQUFxQjtRQUNyQixlQUFlOzJGQUtOLHFCQUFxQjtrQkFiakMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQztvQkFDOUUsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2Ysc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLG1CQUFtQjt3QkFDbkIscUJBQXFCO3dCQUNyQixlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCLENBQUM7b0JBQzlFLFNBQVMsRUFBRSxDQUFDLGlEQUFpRCxDQUFDO2lCQUMvRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdExlZ2FjeU9wdGlvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWNvcmUnO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7TWF0QXV0b2NvbXBsZXRlfSBmcm9tICcuL2F1dG9jb21wbGV0ZSc7XG5pbXBvcnQge1xuICBNYXRBdXRvY29tcGxldGVUcmlnZ2VyLFxuICBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLFxufSBmcm9tICcuL2F1dG9jb21wbGV0ZS10cmlnZ2VyJztcbmltcG9ydCB7TWF0QXV0b2NvbXBsZXRlT3JpZ2lufSBmcm9tICcuL2F1dG9jb21wbGV0ZS1vcmlnaW4nO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbT3ZlcmxheU1vZHVsZSwgTWF0TGVnYWN5T3B0aW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRBdXRvY29tcGxldGUsXG4gICAgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlcixcbiAgICBNYXRBdXRvY29tcGxldGVPcmlnaW4sXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRMZWdhY3lPcHRpb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRBdXRvY29tcGxldGUsIE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIsIE1hdEF1dG9jb21wbGV0ZU9yaWdpbl0sXG4gIHByb3ZpZGVyczogW01BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVNb2R1bGUge31cbiJdfQ==