/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatCheckbox } from './checkbox';
import { MatCheckboxRequiredValidator } from './checkbox-required-validator';
import * as i0 from "@angular/core";
/** This module is used by both original and MDC-based checkbox implementations. */
export class _MatCheckboxRequiredValidatorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, imports: [MatCheckboxRequiredValidator], exports: [MatCheckboxRequiredValidator] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatCheckboxRequiredValidatorModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCheckboxRequiredValidator],
                    exports: [MatCheckboxRequiredValidator],
                }]
        }] });
export class MatCheckboxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, imports: [MatCommonModule, MatRippleModule, _MatCheckboxRequiredValidatorModule, MatCheckbox], exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, imports: [MatCommonModule, MatRippleModule, _MatCheckboxRequiredValidatorModule, MatCommonModule, _MatCheckboxRequiredValidatorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatRippleModule, _MatCheckboxRequiredValidatorModule, MatCheckbox],
                    exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQzs7QUFFM0UsbUZBQW1GO0FBS25GLE1BQU0sT0FBTyxtQ0FBbUM7cUhBQW5DLG1DQUFtQztzSEFBbkMsbUNBQW1DLFlBSHBDLDRCQUE0QixhQUM1Qiw0QkFBNEI7c0hBRTNCLG1DQUFtQzs7a0dBQW5DLG1DQUFtQztrQkFKL0MsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLENBQUMsNEJBQTRCLENBQUM7aUJBQ3hDOztBQU9ELE1BQU0sT0FBTyxpQkFBaUI7cUhBQWpCLGlCQUFpQjtzSEFBakIsaUJBQWlCLFlBSGxCLGVBQWUsRUFBRSxlQUFlLEVBSC9CLG1DQUFtQyxFQUdtQyxXQUFXLGFBQ2xGLFdBQVcsRUFBRSxlQUFlLEVBSjNCLG1DQUFtQztzSEFNbkMsaUJBQWlCLFlBSGxCLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUNBQW1DLEVBQ3hELGVBQWUsRUFKM0IsbUNBQW1DOztrR0FNbkMsaUJBQWlCO2tCQUo3QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUNBQW1DLEVBQUUsV0FBVyxDQUFDO29CQUM3RixPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLG1DQUFtQyxDQUFDO2lCQUM3RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRDaGVja2JveH0gZnJvbSAnLi9jaGVja2JveCc7XG5pbXBvcnQge01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3J9IGZyb20gJy4vY2hlY2tib3gtcmVxdWlyZWQtdmFsaWRhdG9yJztcblxuLyoqIFRoaXMgbW9kdWxlIGlzIHVzZWQgYnkgYm90aCBvcmlnaW5hbCBhbmQgTURDLWJhc2VkIGNoZWNrYm94IGltcGxlbWVudGF0aW9ucy4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yXSxcbiAgZXhwb3J0czogW01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JdLFxufSlcbmV4cG9ydCBjbGFzcyBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGUsIF9NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlLCBNYXRDaGVja2JveF0sXG4gIGV4cG9ydHM6IFtNYXRDaGVja2JveCwgTWF0Q29tbW9uTW9kdWxlLCBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoZWNrYm94TW9kdWxlIHt9XG4iXX0=