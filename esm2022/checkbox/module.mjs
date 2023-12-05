/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatCheckbox } from './checkbox';
import { MatCheckboxRequiredValidator } from './checkbox-required-validator';
import * as i0 from "@angular/core";
/**
 * @deprecated No longer used, `MatCheckbox` implements required validation directly.
 * @breaking-change 19.0.0
 */
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
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, imports: [MatCheckbox, MatCommonModule], exports: [MatCheckbox, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, imports: [MatCommonModule, MatCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCheckbox, MatCommonModule],
                    exports: [MatCheckbox, MatCommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLCtCQUErQixDQUFDOztBQUUzRTs7O0dBR0c7QUFLSCxNQUFNLE9BQU8sbUNBQW1DO3FIQUFuQyxtQ0FBbUM7c0hBQW5DLG1DQUFtQyxZQUhwQyw0QkFBNEIsYUFDNUIsNEJBQTRCO3NIQUUzQixtQ0FBbUM7O2tHQUFuQyxtQ0FBbUM7a0JBSi9DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsNEJBQTRCLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDO2lCQUN4Qzs7QUFPRCxNQUFNLE9BQU8saUJBQWlCO3FIQUFqQixpQkFBaUI7c0hBQWpCLGlCQUFpQixZQUhsQixXQUFXLEVBQUUsZUFBZSxhQUM1QixXQUFXLEVBQUUsZUFBZTtzSEFFM0IsaUJBQWlCLFlBSEwsZUFBZSxFQUNmLGVBQWU7O2tHQUUzQixpQkFBaUI7a0JBSjdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQztpQkFDeEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdENoZWNrYm94fSBmcm9tICcuL2NoZWNrYm94JztcbmltcG9ydCB7TWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcn0gZnJvbSAnLi9jaGVja2JveC1yZXF1aXJlZC12YWxpZGF0b3InO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLCBgTWF0Q2hlY2tib3hgIGltcGxlbWVudHMgcmVxdWlyZWQgdmFsaWRhdGlvbiBkaXJlY3RseS5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTkuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yXSxcbiAgZXhwb3J0czogW01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JdLFxufSlcbmV4cG9ydCBjbGFzcyBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q2hlY2tib3gsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRDaGVja2JveCwgTWF0Q29tbW9uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hlY2tib3hNb2R1bGUge31cbiJdfQ==