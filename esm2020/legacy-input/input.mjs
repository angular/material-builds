/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, inject, InjectFlags } from '@angular/core';
import { MatInput as BaseMatInput } from '@angular/material/input';
import { MatLegacyFormFieldControl, MAT_FORM_FIELD, } from '@angular/material/legacy-form-field';
import * as i0 from "@angular/core";
/** Directive that allows a native input to work inside a `MatFormField`. */
export class MatLegacyInput extends BaseMatInput {
    constructor() {
        super(...arguments);
        this._legacyFormField = inject(MAT_FORM_FIELD, InjectFlags.Optional);
    }
    _getPlaceholder() {
        // If we're hiding the native placeholder, it should also be cleared from the DOM, otherwise
        // screen readers will read it out twice: once from the label and once from the attribute.
        // TODO: can be removed once we get rid of the `legacy` style for the form field, because it's
        // the only one that supports promoting the placeholder to a label.
        const formField = this._legacyFormField;
        return formField && formField.appearance === 'legacy' && !formField._hasLabel?.()
            ? null
            : this.placeholder;
    }
}
MatLegacyInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyInput, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", host: { properties: { "class.mat-input-server": "_isServer", "class.mat-mdc-input-element": "false", "class.mat-mdc-form-field-textarea-control": "false", "class.mat-mdc-form-field-input-control": "false", "class.mdc-text-field__input": "false", "class.mat-mdc-native-select-inline": "false", "attr.data-placeholder": "placeholder", "class.mat-native-select-inline": "_isInlineSelect()" }, classAttribute: "mat-input-element mat-form-field-autofill-control" }, providers: [{ provide: MatLegacyFormFieldControl, useExisting: MatLegacyInput }], exportAs: ["matInput"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyInput, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
                    exportAs: 'matInput',
                    host: {
                        /**
                         * @breaking-change 8.0.0 remove .mat-form-field-autofill-control in favor of AutofillMonitor.
                         */
                        'class': 'mat-input-element mat-form-field-autofill-control',
                        '[class.mat-input-server]': '_isServer',
                        // These classes are inherited from the base input class and need to be cleared.
                        '[class.mat-mdc-input-element]': 'false',
                        '[class.mat-mdc-form-field-textarea-control]': 'false',
                        '[class.mat-mdc-form-field-input-control]': 'false',
                        '[class.mdc-text-field__input]': 'false',
                        '[class.mat-mdc-native-select-inline]': 'false',
                        // At the time of writing, we have a lot of customer tests that look up the input based on its
                        // placeholder. Since we sometimes omit the placeholder attribute from the DOM to prevent screen
                        // readers from reading it twice, we have to keep it somewhere in the DOM for the lookup.
                        '[attr.data-placeholder]': 'placeholder',
                        '[class.mat-native-select-inline]': '_isInlineSelect()',
                    },
                    providers: [{ provide: MatLegacyFormFieldControl, useExisting: MatLegacyInput }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWlucHV0L2lucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsUUFBUSxJQUFJLFlBQVksRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFDTCx5QkFBeUIsRUFFekIsY0FBYyxHQUNmLE1BQU0scUNBQXFDLENBQUM7O0FBRTdDLDRFQUE0RTtBQXlCNUUsTUFBTSxPQUFPLGNBQWUsU0FBUSxZQUFZO0lBeEJoRDs7UUF5QlUscUJBQWdCLEdBQUcsTUFBTSxDQUFxQixjQUFjLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBWTdGO0lBVm9CLGVBQWU7UUFDaEMsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRiw4RkFBOEY7UUFDOUYsbUVBQW1FO1FBQ25FLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4QyxPQUFPLFNBQVMsSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUMvRSxDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7O2dIQVpVLGNBQWM7b0dBQWQsY0FBYyxpbUJBRmQsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7Z0dBRW5FLGNBQWM7a0JBeEIxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRTswREFDOEM7b0JBQ3hELFFBQVEsRUFBRSxVQUFVO29CQUNwQixJQUFJLEVBQUU7d0JBQ0o7OzJCQUVHO3dCQUNILE9BQU8sRUFBRSxtREFBbUQ7d0JBQzVELDBCQUEwQixFQUFFLFdBQVc7d0JBQ3ZDLGdGQUFnRjt3QkFDaEYsK0JBQStCLEVBQUUsT0FBTzt3QkFDeEMsNkNBQTZDLEVBQUUsT0FBTzt3QkFDdEQsMENBQTBDLEVBQUUsT0FBTzt3QkFDbkQsK0JBQStCLEVBQUUsT0FBTzt3QkFDeEMsc0NBQXNDLEVBQUUsT0FBTzt3QkFDL0MsOEZBQThGO3dCQUM5RixnR0FBZ0c7d0JBQ2hHLHlGQUF5Rjt3QkFDekYseUJBQXlCLEVBQUUsYUFBYTt3QkFDeEMsa0NBQWtDLEVBQUUsbUJBQW1CO3FCQUN4RDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLGdCQUFnQixFQUFDLENBQUM7aUJBQy9FIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBpbmplY3QsIEluamVjdEZsYWdzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0SW5wdXQgYXMgQmFzZU1hdElucHV0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQge1xuICBNYXRMZWdhY3lGb3JtRmllbGRDb250cm9sLFxuICBNYXRMZWdhY3lGb3JtRmllbGQsXG4gIE1BVF9GT1JNX0ZJRUxELFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9sZWdhY3ktZm9ybS1maWVsZCc7XG5cbi8qKiBEaXJlY3RpdmUgdGhhdCBhbGxvd3MgYSBuYXRpdmUgaW5wdXQgdG8gd29yayBpbnNpZGUgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdElucHV0XSwgdGV4dGFyZWFbbWF0SW5wdXRdLCBzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0sXG4gICAgICBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF1gLFxuICBleHBvcnRBczogJ21hdElucHV0JyxcbiAgaG9zdDoge1xuICAgIC8qKlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIC5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sIGluIGZhdm9yIG9mIEF1dG9maWxsTW9uaXRvci5cbiAgICAgKi9cbiAgICAnY2xhc3MnOiAnbWF0LWlucHV0LWVsZW1lbnQgbWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCcsXG4gICAgJ1tjbGFzcy5tYXQtaW5wdXQtc2VydmVyXSc6ICdfaXNTZXJ2ZXInLFxuICAgIC8vIFRoZXNlIGNsYXNzZXMgYXJlIGluaGVyaXRlZCBmcm9tIHRoZSBiYXNlIGlucHV0IGNsYXNzIGFuZCBuZWVkIHRvIGJlIGNsZWFyZWQuXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWlucHV0LWVsZW1lbnRdJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZm9ybS1maWVsZC10ZXh0YXJlYS1jb250cm9sXSc6ICdmYWxzZScsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWZvcm0tZmllbGQtaW5wdXQtY29udHJvbF0nOiAnZmFsc2UnLFxuICAgICdbY2xhc3MubWRjLXRleHQtZmllbGRfX2lucHV0XSc6ICdmYWxzZScsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW5hdGl2ZS1zZWxlY3QtaW5saW5lXSc6ICdmYWxzZScsXG4gICAgLy8gQXQgdGhlIHRpbWUgb2Ygd3JpdGluZywgd2UgaGF2ZSBhIGxvdCBvZiBjdXN0b21lciB0ZXN0cyB0aGF0IGxvb2sgdXAgdGhlIGlucHV0IGJhc2VkIG9uIGl0c1xuICAgIC8vIHBsYWNlaG9sZGVyLiBTaW5jZSB3ZSBzb21ldGltZXMgb21pdCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZyb20gdGhlIERPTSB0byBwcmV2ZW50IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgZnJvbSByZWFkaW5nIGl0IHR3aWNlLCB3ZSBoYXZlIHRvIGtlZXAgaXQgc29tZXdoZXJlIGluIHRoZSBET00gZm9yIHRoZSBsb29rdXAuXG4gICAgJ1thdHRyLmRhdGEtcGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyJyxcbiAgICAnW2NsYXNzLm1hdC1uYXRpdmUtc2VsZWN0LWlubGluZV0nOiAnX2lzSW5saW5lU2VsZWN0KCknLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0TGVnYWN5Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeUlucHV0fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUlucHV0IGV4dGVuZHMgQmFzZU1hdElucHV0IHtcbiAgcHJpdmF0ZSBfbGVnYWN5Rm9ybUZpZWxkID0gaW5qZWN0PE1hdExlZ2FjeUZvcm1GaWVsZD4oTUFUX0ZPUk1fRklFTEQsIEluamVjdEZsYWdzLk9wdGlvbmFsKTtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2dldFBsYWNlaG9sZGVyKCkge1xuICAgIC8vIElmIHdlJ3JlIGhpZGluZyB0aGUgbmF0aXZlIHBsYWNlaG9sZGVyLCBpdCBzaG91bGQgYWxzbyBiZSBjbGVhcmVkIGZyb20gdGhlIERPTSwgb3RoZXJ3aXNlXG4gICAgLy8gc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIGl0IG91dCB0d2ljZTogb25jZSBmcm9tIHRoZSBsYWJlbCBhbmQgb25jZSBmcm9tIHRoZSBhdHRyaWJ1dGUuXG4gICAgLy8gVE9ETzogY2FuIGJlIHJlbW92ZWQgb25jZSB3ZSBnZXQgcmlkIG9mIHRoZSBgbGVnYWN5YCBzdHlsZSBmb3IgdGhlIGZvcm0gZmllbGQsIGJlY2F1c2UgaXQnc1xuICAgIC8vIHRoZSBvbmx5IG9uZSB0aGF0IHN1cHBvcnRzIHByb21vdGluZyB0aGUgcGxhY2Vob2xkZXIgdG8gYSBsYWJlbC5cbiAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9sZWdhY3lGb3JtRmllbGQ7XG4gICAgcmV0dXJuIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgIWZvcm1GaWVsZC5faGFzTGFiZWw/LigpXG4gICAgICA/IG51bGxcbiAgICAgIDogdGhpcy5wbGFjZWhvbGRlcjtcbiAgfVxufVxuIl19