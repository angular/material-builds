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
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MatLegacyAutocomplete } from './autocomplete';
import { MatLegacyAutocompleteTrigger } from './autocomplete-trigger';
import { MatLegacyAutocompleteOrigin } from './autocomplete-origin';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatAutocompleteModule` from `@angular/material/autocomplete` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyAutocompleteModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyAutocompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyAutocompleteModule, declarations: [MatLegacyAutocomplete, MatLegacyAutocompleteTrigger, MatLegacyAutocompleteOrigin], imports: [OverlayModule, MatLegacyOptionModule, MatCommonModule, CommonModule], exports: [MatLegacyAutocomplete,
            MatLegacyAutocompleteTrigger,
            MatLegacyAutocompleteOrigin,
            CdkScrollableModule,
            MatLegacyOptionModule,
            MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyAutocompleteModule, providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [OverlayModule, MatLegacyOptionModule, MatCommonModule, CommonModule, CdkScrollableModule,
            MatLegacyOptionModule,
            MatCommonModule] }); }
}
export { MatLegacyAutocompleteModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyAutocompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, MatLegacyOptionModule, MatCommonModule, CommonModule],
                    exports: [
                        MatLegacyAutocomplete,
                        MatLegacyAutocompleteTrigger,
                        MatLegacyAutocompleteOrigin,
                        CdkScrollableModule,
                        MatLegacyOptionModule,
                        MatCommonModule,
                    ],
                    declarations: [MatLegacyAutocomplete, MatLegacyAutocompleteTrigger, MatLegacyAutocompleteOrigin],
                    providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsaURBQWlELEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFbEU7OztHQUdHO0FBQ0gsTUFhYSwyQkFBMkI7OEdBQTNCLDJCQUEyQjsrR0FBM0IsMkJBQTJCLGlCQUh2QixxQkFBcUIsRUFBRSw0QkFBNEIsRUFBRSwyQkFBMkIsYUFUckYsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxZQUFZLGFBRTNFLHFCQUFxQjtZQUNyQiw0QkFBNEI7WUFDNUIsMkJBQTJCO1lBQzNCLG1CQUFtQjtZQUNuQixxQkFBcUI7WUFDckIsZUFBZTsrR0FLTiwyQkFBMkIsYUFGM0IsQ0FBQyxpREFBaUQsQ0FBQyxZQVZwRCxhQUFhLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFLM0UsbUJBQW1CO1lBQ25CLHFCQUFxQjtZQUNyQixlQUFlOztTQUtOLDJCQUEyQjsyRkFBM0IsMkJBQTJCO2tCQWJ2QyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDO29CQUM5RSxPQUFPLEVBQUU7d0JBQ1AscUJBQXFCO3dCQUNyQiw0QkFBNEI7d0JBQzVCLDJCQUEyQjt3QkFDM0IsbUJBQW1CO3dCQUNuQixxQkFBcUI7d0JBQ3JCLGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRSxDQUFDLHFCQUFxQixFQUFFLDRCQUE0QixFQUFFLDJCQUEyQixDQUFDO29CQUNoRyxTQUFTLEVBQUUsQ0FBQyxpREFBaUQsQ0FBQztpQkFDL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lPcHRpb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2F1dG9jb21wbGV0ZSc7XG5pbXBvcnQge01hdExlZ2FjeUF1dG9jb21wbGV0ZX0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuaW1wb3J0IHtNYXRMZWdhY3lBdXRvY29tcGxldGVUcmlnZ2VyfSBmcm9tICcuL2F1dG9jb21wbGV0ZS10cmlnZ2VyJztcbmltcG9ydCB7TWF0TGVnYWN5QXV0b2NvbXBsZXRlT3JpZ2lufSBmcm9tICcuL2F1dG9jb21wbGV0ZS1vcmlnaW4nO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0QXV0b2NvbXBsZXRlTW9kdWxlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9hdXRvY29tcGxldGVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW092ZXJsYXlNb2R1bGUsIE1hdExlZ2FjeU9wdGlvbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0TGVnYWN5QXV0b2NvbXBsZXRlLFxuICAgIE1hdExlZ2FjeUF1dG9jb21wbGV0ZVRyaWdnZXIsXG4gICAgTWF0TGVnYWN5QXV0b2NvbXBsZXRlT3JpZ2luLFxuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgTWF0TGVnYWN5T3B0aW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5QXV0b2NvbXBsZXRlLCBNYXRMZWdhY3lBdXRvY29tcGxldGVUcmlnZ2VyLCBNYXRMZWdhY3lBdXRvY29tcGxldGVPcmlnaW5dLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5QXV0b2NvbXBsZXRlTW9kdWxlIHt9XG4iXX0=