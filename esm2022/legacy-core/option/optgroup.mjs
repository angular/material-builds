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
class MatLegacyOptgroup extends _MatOptgroupBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyOptgroup, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyOptgroup, selector: "mat-optgroup", inputs: { disabled: "disabled" }, host: { properties: { "attr.role": "_inert ? null : \"group\"", "attr.aria-disabled": "_inert ? null : disabled.toString()", "attr.aria-labelledby": "_inert ? null : _labelId", "class.mat-optgroup-disabled": "disabled" }, classAttribute: "mat-optgroup" }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatLegacyOptgroup }], exportAs: ["matOptgroup"], usesInheritance: true, ngImport: i0, template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyOptgroup };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyOptgroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-optgroup', exportAs: 'matOptgroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], host: {
                        'class': 'mat-optgroup',
                        '[attr.role]': '_inert ? null : "group"',
                        '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
                        '[attr.aria-labelledby]': '_inert ? null : _labelId',
                        '[class.mat-optgroup-disabled]': 'disabled',
                    }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatLegacyOptgroup }], template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWNvcmUvb3B0aW9uL29wdGdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jb3JlL29wdGlvbi9vcHRncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEYsT0FBTyxFQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUV0RTs7OztHQUlHO0FBQ0gsTUFpQmEsaUJBQWtCLFNBQVEsZ0JBQWdCOzhHQUExQyxpQkFBaUI7a0dBQWpCLGlCQUFpQix5VUFGakIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDLENBQUMsNEVDL0J0RSx5TEFFQTs7U0QrQmEsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBakI3QixTQUFTOytCQUNFLGNBQWMsWUFDZCxhQUFhLGlCQUVSLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sVUFDdkMsQ0FBQyxVQUFVLENBQUMsUUFFZDt3QkFDSixPQUFPLEVBQUUsY0FBYzt3QkFDdkIsYUFBYSxFQUFFLHlCQUF5Qjt3QkFDeEMsc0JBQXNCLEVBQUUscUNBQXFDO3dCQUM3RCx3QkFBd0IsRUFBRSwwQkFBMEI7d0JBQ3BELCtCQUErQixFQUFFLFVBQVU7cUJBQzVDLGFBQ1UsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxtQkFBbUIsRUFBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNQVRfT1BUR1JPVVAsIF9NYXRPcHRncm91cEJhc2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGlzIHVzZWQgdG8gZ3JvdXAgaW5zdGFuY2VzIG9mIGBtYXQtb3B0aW9uYC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0T3B0Z3JvdXBgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NvcmVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW9wdGdyb3VwJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnb3B0Z3JvdXAuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgc3R5bGVVcmxzOiBbJ29wdGdyb3VwLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1vcHRncm91cCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19pbmVydCA/IG51bGwgOiBcImdyb3VwXCInLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdfaW5lcnQgPyBudWxsIDogZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2luZXJ0ID8gbnVsbCA6IF9sYWJlbElkJyxcbiAgICAnW2NsYXNzLm1hdC1vcHRncm91cC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX09QVEdST1VQLCB1c2VFeGlzdGluZzogTWF0TGVnYWN5T3B0Z3JvdXB9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5T3B0Z3JvdXAgZXh0ZW5kcyBfTWF0T3B0Z3JvdXBCYXNlIHt9XG4iLCI8c3BhbiBjbGFzcz1cIm1hdC1vcHRncm91cC1sYWJlbFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIFtpZF09XCJfbGFiZWxJZFwiPnt7IGxhYmVsIH19IDxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtb3B0aW9uLCBuZy1jb250YWluZXJcIj48L25nLWNvbnRlbnQ+XG4iXX0=