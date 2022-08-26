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
 */
export class MatLegacyOptgroup extends _MatOptgroupBase {
}
MatLegacyOptgroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyOptgroup, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatLegacyOptgroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: MatLegacyOptgroup, selector: "mat-optgroup", inputs: { disabled: "disabled" }, host: { properties: { "attr.role": "_inert ? null : \"group\"", "attr.aria-disabled": "_inert ? null : disabled.toString()", "attr.aria-labelledby": "_inert ? null : _labelId", "class.mat-optgroup-disabled": "disabled" }, classAttribute: "mat-optgroup" }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatLegacyOptgroup }], exportAs: ["matOptgroup"], usesInheritance: true, ngImport: i0, template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyOptgroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-optgroup', exportAs: 'matOptgroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], host: {
                        'class': 'mat-optgroup',
                        '[attr.role]': '_inert ? null : "group"',
                        '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
                        '[attr.aria-labelledby]': '_inert ? null : _labelId',
                        '[class.mat-optgroup-disabled]': 'disabled',
                    }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatLegacyOptgroup }], template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWNvcmUvb3B0aW9uL29wdGdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jb3JlL29wdGlvbi9vcHRncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEYsT0FBTyxFQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUV0RTs7R0FFRztBQWtCSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCOzs4R0FBMUMsaUJBQWlCO2tHQUFqQixpQkFBaUIseVVBRmpCLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDLDRFQzdCdEUseUxBRUE7MkZENkJhLGlCQUFpQjtrQkFqQjdCLFNBQVM7K0JBQ0UsY0FBYyxZQUNkLGFBQWEsaUJBRVIsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxVQUN2QyxDQUFDLFVBQVUsQ0FBQyxRQUVkO3dCQUNKLE9BQU8sRUFBRSxjQUFjO3dCQUN2QixhQUFhLEVBQUUseUJBQXlCO3dCQUN4QyxzQkFBc0IsRUFBRSxxQ0FBcUM7d0JBQzdELHdCQUF3QixFQUFFLDBCQUEwQjt3QkFDcEQsK0JBQStCLEVBQUUsVUFBVTtxQkFDNUMsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLG1CQUFtQixFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9PUFRHUk9VUCwgX01hdE9wdGdyb3VwQmFzZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgaXMgdXNlZCB0byBncm91cCBpbnN0YW5jZXMgb2YgYG1hdC1vcHRpb25gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0Z3JvdXAnLFxuICBleHBvcnRBczogJ21hdE9wdGdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICdvcHRncm91cC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBzdHlsZVVybHM6IFsnb3B0Z3JvdXAuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW9wdGdyb3VwJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2luZXJ0ID8gbnVsbCA6IFwiZ3JvdXBcIicsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ19pbmVydCA/IG51bGwgOiBkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfaW5lcnQgPyBudWxsIDogX2xhYmVsSWQnLFxuICAgICdbY2xhc3MubWF0LW9wdGdyb3VwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lPcHRncm91cH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lPcHRncm91cCBleHRlbmRzIF9NYXRPcHRncm91cEJhc2Uge31cbiIsIjxzcGFuIGNsYXNzPVwibWF0LW9wdGdyb3VwLWxhYmVsXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgW2lkXT1cIl9sYWJlbElkXCI+e3sgbGFiZWwgfX0gPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50Pjwvc3Bhbj5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1vcHRpb24sIG5nLWNvbnRhaW5lclwiPjwvbmctY29udGVudD5cbiJdfQ==