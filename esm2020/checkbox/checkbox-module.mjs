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
import { MatCheckbox } from './checkbox';
import { MatCheckboxRequiredValidator } from './checkbox-required-validator';
import * as i0 from "@angular/core";
/** This module is used by both original and MDC-based checkbox implementations. */
export class _MatCheckboxRequiredValidatorModule {
}
_MatCheckboxRequiredValidatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
_MatCheckboxRequiredValidatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.0-rc.1", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, declarations: [MatCheckboxRequiredValidator], exports: [MatCheckboxRequiredValidator] });
_MatCheckboxRequiredValidatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: _MatCheckboxRequiredValidatorModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [MatCheckboxRequiredValidator],
                    declarations: [MatCheckboxRequiredValidator],
                }]
        }] });
export class MatCheckboxModule {
}
MatCheckboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatCheckboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatCheckboxModule, declarations: [MatCheckbox], imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule], exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule] });
MatCheckboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatCheckboxModule, imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule, MatCommonModule, _MatCheckboxRequiredValidatorModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule],
                    exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule],
                    declarations: [MatCheckbox],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdkMsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sK0JBQStCLENBQUM7O0FBRTNFLG1GQUFtRjtBQUtuRixNQUFNLE9BQU8sbUNBQW1DOztxSUFBbkMsbUNBQW1DO3NJQUFuQyxtQ0FBbUMsaUJBRi9CLDRCQUE0QixhQURqQyw0QkFBNEI7c0lBRzNCLG1DQUFtQztnR0FBbkMsbUNBQW1DO2tCQUovQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDO29CQUN2QyxZQUFZLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztpQkFDN0M7O0FBUUQsTUFBTSxPQUFPLGlCQUFpQjs7bUhBQWpCLGlCQUFpQjtvSEFBakIsaUJBQWlCLGlCQUZiLFdBQVcsYUFGaEIsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBSGhELG1DQUFtQyxhQUlwQyxXQUFXLEVBQUUsZUFBZSxFQUozQixtQ0FBbUM7b0hBT25DLGlCQUFpQixZQUpsQixlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxtQ0FBbUMsRUFDekUsZUFBZSxFQUozQixtQ0FBbUM7Z0dBT25DLGlCQUFpQjtrQkFMN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxtQ0FBbUMsQ0FBQztvQkFDakcsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxtQ0FBbUMsQ0FBQztvQkFDNUUsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRDaGVja2JveH0gZnJvbSAnLi9jaGVja2JveCc7XG5pbXBvcnQge01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3J9IGZyb20gJy4vY2hlY2tib3gtcmVxdWlyZWQtdmFsaWRhdG9yJztcblxuLyoqIFRoaXMgbW9kdWxlIGlzIHVzZWQgYnkgYm90aCBvcmlnaW5hbCBhbmQgTURDLWJhc2VkIGNoZWNrYm94IGltcGxlbWVudGF0aW9ucy4gKi9cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcl0sXG59KVxuZXhwb3J0IGNsYXNzIF9NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRSaXBwbGVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgT2JzZXJ2ZXJzTW9kdWxlLCBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRDaGVja2JveCwgTWF0Q29tbW9uTW9kdWxlLCBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdENoZWNrYm94XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hlY2tib3hNb2R1bGUge31cbiJdfQ==