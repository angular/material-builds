/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatLegacySlideToggle } from './slide-toggle';
import { _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatSlideToggleModule` from `@angular/material/slide-toggle` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySlideToggleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySlideToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySlideToggleModule, declarations: [MatLegacySlideToggle], imports: [_MatSlideToggleRequiredValidatorModule,
            MatRippleModule,
            MatCommonModule,
            ObserversModule], exports: [_MatSlideToggleRequiredValidatorModule, MatLegacySlideToggle, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySlideToggleModule, imports: [_MatSlideToggleRequiredValidatorModule,
            MatRippleModule,
            MatCommonModule,
            ObserversModule, _MatSlideToggleRequiredValidatorModule, MatCommonModule] }); }
}
export { MatLegacySlideToggleModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySlideToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        _MatSlideToggleRequiredValidatorModule,
                        MatRippleModule,
                        MatCommonModule,
                        ObserversModule,
                    ],
                    exports: [_MatSlideToggleRequiredValidatorModule, MatLegacySlideToggle, MatCommonModule],
                    declarations: [MatLegacySlideToggle],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktc2xpZGUtdG9nZ2xlL3NsaWRlLXRvZ2dsZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsc0NBQXNDLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFFdEY7OztHQUdHO0FBQ0gsTUFVYSwwQkFBMEI7OEdBQTFCLDBCQUEwQjsrR0FBMUIsMEJBQTBCLGlCQUZ0QixvQkFBb0IsYUFOakMsc0NBQXNDO1lBQ3RDLGVBQWU7WUFDZixlQUFlO1lBQ2YsZUFBZSxhQUVQLHNDQUFzQyxFQUFFLG9CQUFvQixFQUFFLGVBQWU7K0dBRzVFLDBCQUEwQixZQVJuQyxzQ0FBc0M7WUFDdEMsZUFBZTtZQUNmLGVBQWU7WUFDZixlQUFlLEVBRVAsc0NBQXNDLEVBQXdCLGVBQWU7O1NBRzVFLDBCQUEwQjsyRkFBMUIsMEJBQTBCO2tCQVZ0QyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxzQ0FBc0M7d0JBQ3RDLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixlQUFlO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLENBQUM7b0JBQ3hGLFlBQVksRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lTbGlkZVRvZ2dsZX0gZnJvbSAnLi9zbGlkZS10b2dnbGUnO1xuaW1wb3J0IHtfTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2xpZGUtdG9nZ2xlJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFNsaWRlVG9nZ2xlTW9kdWxlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9zbGlkZS10b2dnbGVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIF9NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbX01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUsIE1hdExlZ2FjeVNsaWRlVG9nZ2xlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRMZWdhY3lTbGlkZVRvZ2dsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNsaWRlVG9nZ2xlTW9kdWxlIHt9XG4iXX0=