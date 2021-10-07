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
import { MatOptionModule, MatCommonModule } from '@angular/material/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatAutocomplete } from './autocomplete';
import { MatAutocompleteTrigger, MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './autocomplete-trigger';
import { MatAutocompleteOrigin } from './autocomplete-origin';
import * as i0 from "@angular/core";
export class MatAutocompleteModule {
}
MatAutocompleteModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatAutocompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatAutocompleteModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatAutocompleteModule, declarations: [MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteOrigin], imports: [OverlayModule,
        MatOptionModule,
        MatCommonModule,
        CommonModule], exports: [MatAutocomplete,
        MatAutocompleteTrigger,
        MatAutocompleteOrigin,
        CdkScrollableModule,
        MatOptionModule,
        MatCommonModule] });
MatAutocompleteModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatAutocompleteModule, providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [[
            OverlayModule,
            MatOptionModule,
            MatCommonModule,
            CommonModule
        ], CdkScrollableModule,
        MatOptionModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatAutocompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        OverlayModule,
                        MatOptionModule,
                        MatCommonModule,
                        CommonModule
                    ],
                    exports: [
                        MatAutocomplete,
                        MatAutocompleteTrigger,
                        MatAutocompleteOrigin,
                        CdkScrollableModule,
                        MatOptionModule,
                        MatCommonModule,
                    ],
                    declarations: [MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteOrigin],
                    providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixpREFBaUQsR0FDbEQsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFxQjVELE1BQU0sT0FBTyxxQkFBcUI7OzBIQUFyQixxQkFBcUI7MkhBQXJCLHFCQUFxQixpQkFIakIsZUFBZSxFQUFFLHNCQUFzQixFQUFFLHFCQUFxQixhQWIzRSxhQUFhO1FBQ2IsZUFBZTtRQUNmLGVBQWU7UUFDZixZQUFZLGFBR1osZUFBZTtRQUNmLHNCQUFzQjtRQUN0QixxQkFBcUI7UUFDckIsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixlQUFlOzJIQUtOLHFCQUFxQixhQUZyQixDQUFDLGlEQUFpRCxDQUFDLFlBZnJEO1lBQ1AsYUFBYTtZQUNiLGVBQWU7WUFDZixlQUFlO1lBQ2YsWUFBWTtTQUNiLEVBS0MsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixlQUFlO21HQUtOLHFCQUFxQjtrQkFsQmpDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixlQUFlO3dCQUNmLFlBQVk7cUJBQ2I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2Ysc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLG1CQUFtQjt3QkFDbkIsZUFBZTt3QkFDZixlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCLENBQUM7b0JBQzlFLFNBQVMsRUFBRSxDQUFDLGlEQUFpRCxDQUFDO2lCQUMvRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge01hdE9wdGlvbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZX0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuaW1wb3J0IHtcbiAgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlcixcbiAgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtdHJpZ2dlcic7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZU9yaWdpbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBNYXRPcHRpb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0QXV0b2NvbXBsZXRlLFxuICAgIE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIsXG4gICAgTWF0QXV0b2NvbXBsZXRlT3JpZ2luLFxuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgTWF0T3B0aW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0QXV0b2NvbXBsZXRlLCBNYXRBdXRvY29tcGxldGVUcmlnZ2VyLCBNYXRBdXRvY29tcGxldGVPcmlnaW5dLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlTW9kdWxlIHt9XG4iXX0=