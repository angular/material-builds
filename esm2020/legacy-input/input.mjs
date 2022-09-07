/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, inject, InjectFlags } from '@angular/core';
import { MatInput as BaseMatInput } from '@angular/material/input';
import { MatLegacyFormFieldControl, MAT_LEGACY_FORM_FIELD, } from '@angular/material/legacy-form-field';
import * as i0 from "@angular/core";
/**
 * Directive that allows a native input to work inside a `MatFormField`.
 * @deprecated Use `MatInput` from `@angular/material/input` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyInput extends BaseMatInput {
    constructor() {
        super(...arguments);
        this._legacyFormField = inject(MAT_LEGACY_FORM_FIELD, InjectFlags.Optional);
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
MatLegacyInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyInput, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: MatLegacyInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", host: { properties: { "class.mat-input-server": "_isServer", "class.mat-mdc-input-element": "false", "class.mat-mdc-form-field-textarea-control": "false", "class.mat-mdc-form-field-input-control": "false", "class.mdc-text-field__input": "false", "class.mat-mdc-native-select-inline": "false", "attr.data-placeholder": "placeholder", "class.mat-native-select-inline": "_isInlineSelect()" }, classAttribute: "mat-input-element mat-form-field-autofill-control" }, providers: [{ provide: MatLegacyFormFieldControl, useExisting: MatLegacyInput }], exportAs: ["matInput"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyInput, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWlucHV0L2lucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsUUFBUSxJQUFJLFlBQVksRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFDTCx5QkFBeUIsRUFFekIscUJBQXFCLEdBQ3RCLE1BQU0scUNBQXFDLENBQUM7O0FBRTdDOzs7O0dBSUc7QUF5QkgsTUFBTSxPQUFPLGNBQWUsU0FBUSxZQUFZO0lBeEJoRDs7UUF5QlUscUJBQWdCLEdBQUcsTUFBTSxDQUMvQixxQkFBcUIsRUFDckIsV0FBVyxDQUFDLFFBQVEsQ0FDckIsQ0FBQztLQVlIO0lBVm9CLGVBQWU7UUFDaEMsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRiw4RkFBOEY7UUFDOUYsbUVBQW1FO1FBQ25FLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4QyxPQUFPLFNBQVMsSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUMvRSxDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7OzJHQWZVLGNBQWM7K0ZBQWQsY0FBYyxpbUJBRmQsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7MkZBRW5FLGNBQWM7a0JBeEIxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRTswREFDOEM7b0JBQ3hELFFBQVEsRUFBRSxVQUFVO29CQUNwQixJQUFJLEVBQUU7d0JBQ0o7OzJCQUVHO3dCQUNILE9BQU8sRUFBRSxtREFBbUQ7d0JBQzVELDBCQUEwQixFQUFFLFdBQVc7d0JBQ3ZDLGdGQUFnRjt3QkFDaEYsK0JBQStCLEVBQUUsT0FBTzt3QkFDeEMsNkNBQTZDLEVBQUUsT0FBTzt3QkFDdEQsMENBQTBDLEVBQUUsT0FBTzt3QkFDbkQsK0JBQStCLEVBQUUsT0FBTzt3QkFDeEMsc0NBQXNDLEVBQUUsT0FBTzt3QkFDL0MsOEZBQThGO3dCQUM5RixnR0FBZ0c7d0JBQ2hHLHlGQUF5Rjt3QkFDekYseUJBQXlCLEVBQUUsYUFBYTt3QkFDeEMsa0NBQWtDLEVBQUUsbUJBQW1CO3FCQUN4RDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLGdCQUFnQixFQUFDLENBQUM7aUJBQy9FIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBpbmplY3QsIEluamVjdEZsYWdzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0SW5wdXQgYXMgQmFzZU1hdElucHV0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQge1xuICBNYXRMZWdhY3lGb3JtRmllbGRDb250cm9sLFxuICBNYXRMZWdhY3lGb3JtRmllbGQsXG4gIE1BVF9MRUdBQ1lfRk9STV9GSUVMRCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWZvcm0tZmllbGQnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGFsbG93cyBhIG5hdGl2ZSBpbnB1dCB0byB3b3JrIGluc2lkZSBhIGBNYXRGb3JtRmllbGRgLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRJbnB1dGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXRgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgaW5wdXRbbWF0SW5wdXRdLCB0ZXh0YXJlYVttYXRJbnB1dF0sIHNlbGVjdFttYXROYXRpdmVDb250cm9sXSxcbiAgICAgIGlucHV0W21hdE5hdGl2ZUNvbnRyb2xdLCB0ZXh0YXJlYVttYXROYXRpdmVDb250cm9sXWAsXG4gIGV4cG9ydEFzOiAnbWF0SW5wdXQnLFxuICBob3N0OiB7XG4gICAgLyoqXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCByZW1vdmUgLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2wgaW4gZmF2b3Igb2YgQXV0b2ZpbGxNb25pdG9yLlxuICAgICAqL1xuICAgICdjbGFzcyc6ICdtYXQtaW5wdXQtZWxlbWVudCBtYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sJyxcbiAgICAnW2NsYXNzLm1hdC1pbnB1dC1zZXJ2ZXJdJzogJ19pc1NlcnZlcicsXG4gICAgLy8gVGhlc2UgY2xhc3NlcyBhcmUgaW5oZXJpdGVkIGZyb20gdGhlIGJhc2UgaW5wdXQgY2xhc3MgYW5kIG5lZWQgdG8gYmUgY2xlYXJlZC5cbiAgICAnW2NsYXNzLm1hdC1tZGMtaW5wdXQtZWxlbWVudF0nOiAnZmFsc2UnLFxuICAgICdbY2xhc3MubWF0LW1kYy1mb3JtLWZpZWxkLXRleHRhcmVhLWNvbnRyb2xdJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZm9ybS1maWVsZC1pbnB1dC1jb250cm9sXSc6ICdmYWxzZScsXG4gICAgJ1tjbGFzcy5tZGMtdGV4dC1maWVsZF9faW5wdXRdJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtbmF0aXZlLXNlbGVjdC1pbmxpbmVdJzogJ2ZhbHNlJyxcbiAgICAvLyBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCB3ZSBoYXZlIGEgbG90IG9mIGN1c3RvbWVyIHRlc3RzIHRoYXQgbG9vayB1cCB0aGUgaW5wdXQgYmFzZWQgb24gaXRzXG4gICAgLy8gcGxhY2Vob2xkZXIuIFNpbmNlIHdlIHNvbWV0aW1lcyBvbWl0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZnJvbSB0aGUgRE9NIHRvIHByZXZlbnQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyBmcm9tIHJlYWRpbmcgaXQgdHdpY2UsIHdlIGhhdmUgdG8ga2VlcCBpdCBzb21ld2hlcmUgaW4gdGhlIERPTSBmb3IgdGhlIGxvb2t1cC5cbiAgICAnW2F0dHIuZGF0YS1wbGFjZWhvbGRlcl0nOiAncGxhY2Vob2xkZXInLFxuICAgICdbY2xhc3MubWF0LW5hdGl2ZS1zZWxlY3QtaW5saW5lXSc6ICdfaXNJbmxpbmVTZWxlY3QoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRMZWdhY3lGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0TGVnYWN5SW5wdXR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5SW5wdXQgZXh0ZW5kcyBCYXNlTWF0SW5wdXQge1xuICBwcml2YXRlIF9sZWdhY3lGb3JtRmllbGQgPSBpbmplY3Q8TWF0TGVnYWN5Rm9ybUZpZWxkPihcbiAgICBNQVRfTEVHQUNZX0ZPUk1fRklFTEQsXG4gICAgSW5qZWN0RmxhZ3MuT3B0aW9uYWwsXG4gICk7XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9nZXRQbGFjZWhvbGRlcigpIHtcbiAgICAvLyBJZiB3ZSdyZSBoaWRpbmcgdGhlIG5hdGl2ZSBwbGFjZWhvbGRlciwgaXQgc2hvdWxkIGFsc28gYmUgY2xlYXJlZCBmcm9tIHRoZSBET00sIG90aGVyd2lzZVxuICAgIC8vIHNjcmVlbiByZWFkZXJzIHdpbGwgcmVhZCBpdCBvdXQgdHdpY2U6IG9uY2UgZnJvbSB0aGUgbGFiZWwgYW5kIG9uY2UgZnJvbSB0aGUgYXR0cmlidXRlLlxuICAgIC8vIFRPRE86IGNhbiBiZSByZW1vdmVkIG9uY2Ugd2UgZ2V0IHJpZCBvZiB0aGUgYGxlZ2FjeWAgc3R5bGUgZm9yIHRoZSBmb3JtIGZpZWxkLCBiZWNhdXNlIGl0J3NcbiAgICAvLyB0aGUgb25seSBvbmUgdGhhdCBzdXBwb3J0cyBwcm9tb3RpbmcgdGhlIHBsYWNlaG9sZGVyIHRvIGEgbGFiZWwuXG4gICAgY29uc3QgZm9ybUZpZWxkID0gdGhpcy5fbGVnYWN5Rm9ybUZpZWxkO1xuICAgIHJldHVybiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLmFwcGVhcmFuY2UgPT09ICdsZWdhY3knICYmICFmb3JtRmllbGQuX2hhc0xhYmVsPy4oKVxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMucGxhY2Vob2xkZXI7XG4gIH1cbn1cbiJdfQ==