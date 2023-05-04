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
import { MatLegacyCheckbox } from './checkbox';
import { _MatCheckboxRequiredValidatorModule } from '@angular/material/checkbox';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatCheckboxModule` from `@angular/material/checkbox` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCheckboxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCheckboxModule, declarations: [MatLegacyCheckbox], imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule], exports: [MatLegacyCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCheckboxModule, imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule, MatCommonModule, _MatCheckboxRequiredValidatorModule] }); }
}
export { MatLegacyCheckboxModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule],
                    exports: [MatLegacyCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule],
                    declarations: [MatLegacyCheckbox],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jaGVja2JveC9jaGVja2JveC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDN0MsT0FBTyxFQUFDLG1DQUFtQyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7O0FBRS9FOzs7R0FHRztBQUNILE1BS2EsdUJBQXVCOzhHQUF2Qix1QkFBdUI7K0dBQXZCLHVCQUF1QixpQkFGbkIsaUJBQWlCLGFBRnRCLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLG1DQUFtQyxhQUN0RixpQkFBaUIsRUFBRSxlQUFlLEVBQUUsbUNBQW1DOytHQUd0RSx1QkFBdUIsWUFKeEIsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUNBQW1DLEVBQ25FLGVBQWUsRUFBRSxtQ0FBbUM7O1NBR3RFLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQUxuQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLG1DQUFtQyxDQUFDO29CQUNqRyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsbUNBQW1DLENBQUM7b0JBQ2xGLFlBQVksRUFBRSxDQUFDLGlCQUFpQixDQUFDO2lCQUNsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lDaGVja2JveH0gZnJvbSAnLi9jaGVja2JveCc7XG5pbXBvcnQge19NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDaGVja2JveE1vZHVsZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2hlY2tib3hgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFJpcHBsZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBPYnNlcnZlcnNNb2R1bGUsIF9NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdExlZ2FjeUNoZWNrYm94LCBNYXRDb21tb25Nb2R1bGUsIF9NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5Q2hlY2tib3hdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDaGVja2JveE1vZHVsZSB7fVxuIl19