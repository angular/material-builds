/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MAT_OPTGROUP, _MatOptgroupBase } from '@angular/material/core';
import * as i0 from "@angular/core";
/**
 * Component that is used to group instances of `mat-option`.
 * @deprecated Use `MatOptgroup` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyOptgroup extends _MatOptgroupBase {
}
MatLegacyOptgroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatLegacyOptgroup, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatLegacyOptgroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: MatLegacyOptgroup, selector: "mat-optgroup", inputs: { disabled: "disabled" }, host: { properties: { "attr.role": "_inert ? null : \"group\"", "attr.aria-disabled": "_inert ? null : disabled.toString()", "attr.aria-labelledby": "_inert ? null : _labelId", "class.mat-optgroup-disabled": "disabled" }, classAttribute: "mat-optgroup" }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatLegacyOptgroup }], exportAs: ["matOptgroup"], usesInheritance: true, ngImport: i0, template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatLegacyOptgroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-optgroup', exportAs: 'matOptgroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], host: {
                        'class': 'mat-optgroup',
                        '[attr.role]': '_inert ? null : "group"',
                        '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
                        '[attr.aria-labelledby]': '_inert ? null : _labelId',
                        '[class.mat-optgroup-disabled]': 'disabled',
                    }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatLegacyOptgroup }], template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWNvcmUvb3B0aW9uL29wdGdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jb3JlL29wdGlvbi9vcHRncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEYsT0FBTyxFQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUV0RTs7OztHQUlHO0FBa0JILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxnQkFBZ0I7OzhHQUExQyxpQkFBaUI7a0dBQWpCLGlCQUFpQix5VUFGakIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDLENBQUMsNEVDL0J0RSx5TEFFQTsyRkQrQmEsaUJBQWlCO2tCQWpCN0IsU0FBUzsrQkFDRSxjQUFjLFlBQ2QsYUFBYSxpQkFFUixpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLFVBQ3ZDLENBQUMsVUFBVSxDQUFDLFFBRWQ7d0JBQ0osT0FBTyxFQUFFLGNBQWM7d0JBQ3ZCLGFBQWEsRUFBRSx5QkFBeUI7d0JBQ3hDLHNCQUFzQixFQUFFLHFDQUFxQzt3QkFDN0Qsd0JBQXdCLEVBQUUsMEJBQTBCO3dCQUNwRCwrQkFBK0IsRUFBRSxVQUFVO3FCQUM1QyxhQUNVLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsbUJBQW1CLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX09QVEdST1VQLCBfTWF0T3B0Z3JvdXBCYXNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBpcyB1c2VkIHRvIGdyb3VwIGluc3RhbmNlcyBvZiBgbWF0LW9wdGlvbmAuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE9wdGdyb3VwYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jb3JlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1vcHRncm91cCcsXG4gIGV4cG9ydEFzOiAnbWF0T3B0Z3JvdXAnLFxuICB0ZW1wbGF0ZVVybDogJ29wdGdyb3VwLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIHN0eWxlVXJsczogWydvcHRncm91cC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtb3B0Z3JvdXAnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdfaW5lcnQgPyBudWxsIDogXCJncm91cFwiJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnX2luZXJ0ID8gbnVsbCA6IGRpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19pbmVydCA/IG51bGwgOiBfbGFiZWxJZCcsXG4gICAgJ1tjbGFzcy5tYXQtb3B0Z3JvdXAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9PUFRHUk9VUCwgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeU9wdGdyb3VwfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeU9wdGdyb3VwIGV4dGVuZHMgX01hdE9wdGdyb3VwQmFzZSB7fVxuIiwiPHNwYW4gY2xhc3M9XCJtYXQtb3B0Z3JvdXAtbGFiZWxcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBbaWRdPVwiX2xhYmVsSWRcIj57eyBsYWJlbCB9fSA8bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9zcGFuPlxuPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LW9wdGlvbiwgbmctY29udGFpbmVyXCI+PC9uZy1jb250ZW50PlxuIl19