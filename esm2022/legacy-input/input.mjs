/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, inject } from '@angular/core';
import { MatInput as BaseMatInput } from '@angular/material/input';
import { MatLegacyFormFieldControl, MAT_LEGACY_FORM_FIELD, } from '@angular/material/legacy-form-field';
import * as i0 from "@angular/core";
/**
 * Directive that allows a native input to work inside a `MatFormField`.
 * @deprecated Use `MatInput` from `@angular/material/input` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyInput extends BaseMatInput {
    constructor() {
        super(...arguments);
        this._legacyFormField = inject(MAT_LEGACY_FORM_FIELD, { optional: true });
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", host: { properties: { "class.mat-input-server": "_isServer", "class.mat-mdc-input-element": "false", "class.mat-mdc-form-field-textarea-control": "false", "class.mat-mdc-form-field-input-control": "false", "class.mdc-text-field__input": "false", "class.mat-mdc-native-select-inline": "false", "attr.data-placeholder": "placeholder", "class.mat-native-select-inline": "_isInlineSelect()" }, classAttribute: "mat-input-element mat-form-field-autofill-control" }, providers: [{ provide: MatLegacyFormFieldControl, useExisting: MatLegacyInput }], exportAs: ["matInput"], usesInheritance: true, ngImport: i0 }); }
}
export { MatLegacyInput };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInput, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWlucHV0L2lucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxRQUFRLElBQUksWUFBWSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDakUsT0FBTyxFQUNMLHlCQUF5QixFQUV6QixxQkFBcUIsR0FDdEIsTUFBTSxxQ0FBcUMsQ0FBQzs7QUFFN0M7Ozs7R0FJRztBQUNILE1Bd0JhLGNBQWUsU0FBUSxZQUFZO0lBeEJoRDs7UUF5QlUscUJBQWdCLEdBQUcsTUFBTSxDQUFxQixxQkFBcUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0tBWWhHO0lBVm9CLGVBQWU7UUFDaEMsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRiw4RkFBOEY7UUFDOUYsbUVBQW1FO1FBQ25FLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4QyxPQUFPLFNBQVMsSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUMvRSxDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7OEdBWlUsY0FBYztrR0FBZCxjQUFjLGltQkFGZCxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUMsQ0FBQzs7U0FFbkUsY0FBYzsyRkFBZCxjQUFjO2tCQXhCMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUU7MERBQzhDO29CQUN4RCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsSUFBSSxFQUFFO3dCQUNKOzsyQkFFRzt3QkFDSCxPQUFPLEVBQUUsbURBQW1EO3dCQUM1RCwwQkFBMEIsRUFBRSxXQUFXO3dCQUN2QyxnRkFBZ0Y7d0JBQ2hGLCtCQUErQixFQUFFLE9BQU87d0JBQ3hDLDZDQUE2QyxFQUFFLE9BQU87d0JBQ3RELDBDQUEwQyxFQUFFLE9BQU87d0JBQ25ELCtCQUErQixFQUFFLE9BQU87d0JBQ3hDLHNDQUFzQyxFQUFFLE9BQU87d0JBQy9DLDhGQUE4Rjt3QkFDOUYsZ0dBQWdHO3dCQUNoRyx5RkFBeUY7d0JBQ3pGLHlCQUF5QixFQUFFLGFBQWE7d0JBQ3hDLGtDQUFrQyxFQUFFLG1CQUFtQjtxQkFDeEQ7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsV0FBVyxnQkFBZ0IsRUFBQyxDQUFDO2lCQUMvRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgaW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0SW5wdXQgYXMgQmFzZU1hdElucHV0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQge1xuICBNYXRMZWdhY3lGb3JtRmllbGRDb250cm9sLFxuICBNYXRMZWdhY3lGb3JtRmllbGQsXG4gIE1BVF9MRUdBQ1lfRk9STV9GSUVMRCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWZvcm0tZmllbGQnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGFsbG93cyBhIG5hdGl2ZSBpbnB1dCB0byB3b3JrIGluc2lkZSBhIGBNYXRGb3JtRmllbGRgLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRJbnB1dGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXRgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgaW5wdXRbbWF0SW5wdXRdLCB0ZXh0YXJlYVttYXRJbnB1dF0sIHNlbGVjdFttYXROYXRpdmVDb250cm9sXSxcbiAgICAgIGlucHV0W21hdE5hdGl2ZUNvbnRyb2xdLCB0ZXh0YXJlYVttYXROYXRpdmVDb250cm9sXWAsXG4gIGV4cG9ydEFzOiAnbWF0SW5wdXQnLFxuICBob3N0OiB7XG4gICAgLyoqXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCByZW1vdmUgLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2wgaW4gZmF2b3Igb2YgQXV0b2ZpbGxNb25pdG9yLlxuICAgICAqL1xuICAgICdjbGFzcyc6ICdtYXQtaW5wdXQtZWxlbWVudCBtYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sJyxcbiAgICAnW2NsYXNzLm1hdC1pbnB1dC1zZXJ2ZXJdJzogJ19pc1NlcnZlcicsXG4gICAgLy8gVGhlc2UgY2xhc3NlcyBhcmUgaW5oZXJpdGVkIGZyb20gdGhlIGJhc2UgaW5wdXQgY2xhc3MgYW5kIG5lZWQgdG8gYmUgY2xlYXJlZC5cbiAgICAnW2NsYXNzLm1hdC1tZGMtaW5wdXQtZWxlbWVudF0nOiAnZmFsc2UnLFxuICAgICdbY2xhc3MubWF0LW1kYy1mb3JtLWZpZWxkLXRleHRhcmVhLWNvbnRyb2xdJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZm9ybS1maWVsZC1pbnB1dC1jb250cm9sXSc6ICdmYWxzZScsXG4gICAgJ1tjbGFzcy5tZGMtdGV4dC1maWVsZF9faW5wdXRdJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtbmF0aXZlLXNlbGVjdC1pbmxpbmVdJzogJ2ZhbHNlJyxcbiAgICAvLyBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCB3ZSBoYXZlIGEgbG90IG9mIGN1c3RvbWVyIHRlc3RzIHRoYXQgbG9vayB1cCB0aGUgaW5wdXQgYmFzZWQgb24gaXRzXG4gICAgLy8gcGxhY2Vob2xkZXIuIFNpbmNlIHdlIHNvbWV0aW1lcyBvbWl0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZnJvbSB0aGUgRE9NIHRvIHByZXZlbnQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyBmcm9tIHJlYWRpbmcgaXQgdHdpY2UsIHdlIGhhdmUgdG8ga2VlcCBpdCBzb21ld2hlcmUgaW4gdGhlIERPTSBmb3IgdGhlIGxvb2t1cC5cbiAgICAnW2F0dHIuZGF0YS1wbGFjZWhvbGRlcl0nOiAncGxhY2Vob2xkZXInLFxuICAgICdbY2xhc3MubWF0LW5hdGl2ZS1zZWxlY3QtaW5saW5lXSc6ICdfaXNJbmxpbmVTZWxlY3QoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRMZWdhY3lGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0TGVnYWN5SW5wdXR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5SW5wdXQgZXh0ZW5kcyBCYXNlTWF0SW5wdXQge1xuICBwcml2YXRlIF9sZWdhY3lGb3JtRmllbGQgPSBpbmplY3Q8TWF0TGVnYWN5Rm9ybUZpZWxkPihNQVRfTEVHQUNZX0ZPUk1fRklFTEQsIHtvcHRpb25hbDogdHJ1ZX0pO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZ2V0UGxhY2Vob2xkZXIoKSB7XG4gICAgLy8gSWYgd2UncmUgaGlkaW5nIHRoZSBuYXRpdmUgcGxhY2Vob2xkZXIsIGl0IHNob3VsZCBhbHNvIGJlIGNsZWFyZWQgZnJvbSB0aGUgRE9NLCBvdGhlcndpc2VcbiAgICAvLyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgaXQgb3V0IHR3aWNlOiBvbmNlIGZyb20gdGhlIGxhYmVsIGFuZCBvbmNlIGZyb20gdGhlIGF0dHJpYnV0ZS5cbiAgICAvLyBUT0RPOiBjYW4gYmUgcmVtb3ZlZCBvbmNlIHdlIGdldCByaWQgb2YgdGhlIGBsZWdhY3lgIHN0eWxlIGZvciB0aGUgZm9ybSBmaWVsZCwgYmVjYXVzZSBpdCdzXG4gICAgLy8gdGhlIG9ubHkgb25lIHRoYXQgc3VwcG9ydHMgcHJvbW90aW5nIHRoZSBwbGFjZWhvbGRlciB0byBhIGxhYmVsLlxuICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2xlZ2FjeUZvcm1GaWVsZDtcbiAgICByZXR1cm4gZm9ybUZpZWxkICYmIGZvcm1GaWVsZC5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiAhZm9ybUZpZWxkLl9oYXNMYWJlbD8uKClcbiAgICAgID8gbnVsbFxuICAgICAgOiB0aGlzLnBsYWNlaG9sZGVyO1xuICB9XG59XG4iXX0=