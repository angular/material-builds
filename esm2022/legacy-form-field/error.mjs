/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, Directive, ElementRef, Input } from '@angular/core';
import { MAT_ERROR } from '@angular/material/form-field';
import * as i0 from "@angular/core";
let nextUniqueId = 0;
/**
 * Single error message to be shown underneath the form field.
 * @deprecated Use `MatError` from `@angular/material/form-field` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyError {
    constructor(ariaLive, elementRef) {
        this.id = `mat-error-${nextUniqueId++}`;
        // If no aria-live value is set add 'polite' as a default. This is preferred over setting
        // role='alert' so that screen readers do not interrupt the current task to read this aloud.
        if (!ariaLive) {
            elementRef.nativeElement.setAttribute('aria-live', 'polite');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyError, deps: [{ token: 'aria-live', attribute: true }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyError, selector: "mat-error", inputs: { id: "id" }, host: { attributes: { "aria-atomic": "true" }, properties: { "attr.id": "id" }, classAttribute: "mat-error" }, providers: [{ provide: MAT_ERROR, useExisting: MatLegacyError }], ngImport: i0 }); }
}
export { MatLegacyError };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyError, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-error',
                    host: {
                        'class': 'mat-error',
                        '[attr.id]': 'id',
                        'aria-atomic': 'true',
                    },
                    providers: [{ provide: MAT_ERROR, useExisting: MatLegacyError }],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-live']
                }] }, { type: i0.ElementRef }]; }, propDecorators: { id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWZvcm0tZmllbGQvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0RSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sOEJBQThCLENBQUM7O0FBRXZELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjs7OztHQUlHO0FBQ0gsTUFTYSxjQUFjO0lBR3pCLFlBQW9DLFFBQWdCLEVBQUUsVUFBc0I7UUFGbkUsT0FBRSxHQUFXLGFBQWEsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQUdsRCx5RkFBeUY7UUFDekYsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUQ7SUFDSCxDQUFDOzhHQVRVLGNBQWMsa0JBR0YsV0FBVztrR0FIdkIsY0FBYyx5S0FGZCxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7O1NBRW5ELGNBQWM7MkZBQWQsY0FBYztrQkFUMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxXQUFXO3dCQUNwQixXQUFXLEVBQUUsSUFBSTt3QkFDakIsYUFBYSxFQUFFLE1BQU07cUJBQ3RCO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLGdCQUFnQixFQUFDLENBQUM7aUJBQy9EOzswQkFJYyxTQUFTOzJCQUFDLFdBQVc7cUVBRnpCLEVBQUU7c0JBQVYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0F0dHJpYnV0ZSwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9FUlJPUn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIFNpbmdsZSBlcnJvciBtZXNzYWdlIHRvIGJlIHNob3duIHVuZGVybmVhdGggdGhlIGZvcm0gZmllbGQuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdEVycm9yYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1lcnJvcicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWVycm9yJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnYXJpYS1hdG9taWMnOiAndHJ1ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfRVJST1IsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lFcnJvcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lFcnJvciB7XG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LWVycm9yLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihAQXR0cmlidXRlKCdhcmlhLWxpdmUnKSBhcmlhTGl2ZTogc3RyaW5nLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgLy8gSWYgbm8gYXJpYS1saXZlIHZhbHVlIGlzIHNldCBhZGQgJ3BvbGl0ZScgYXMgYSBkZWZhdWx0LiBUaGlzIGlzIHByZWZlcnJlZCBvdmVyIHNldHRpbmdcbiAgICAvLyByb2xlPSdhbGVydCcgc28gdGhhdCBzY3JlZW4gcmVhZGVycyBkbyBub3QgaW50ZXJydXB0IHRoZSBjdXJyZW50IHRhc2sgdG8gcmVhZCB0aGlzIGFsb3VkLlxuICAgIGlmICghYXJpYUxpdmUpIHtcbiAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==