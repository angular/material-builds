/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS, } from '@angular/forms';
import * as i0 from "@angular/core";
export const MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatSlideToggleRequiredValidator),
    multi: true
};
/**
 * Validator for Material slide-toggle components with the required attribute in a
 * template-driven form. The default validator for required form controls asserts
 * that the control value is not undefined but that is not appropriate for a slide-toggle
 * where the value is always defined.
 *
 * Required slide-toggle form controls are valid when checked.
 */
export class MatSlideToggleRequiredValidator extends CheckboxRequiredValidator {
}
MatSlideToggleRequiredValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSlideToggleRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatSlideToggleRequiredValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSlideToggleRequiredValidator, selector: "mat-slide-toggle[required][formControlName],\n             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]", providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSlideToggleRequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-slide-toggle[required][formControlName],
             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]`,
                    providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLGFBQWEsR0FDZCxNQUFNLGdCQUFnQixDQUFDOztBQUV4QixNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FBYTtJQUMzRCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLCtCQUErQixDQUFDO0lBQzlELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFNSCxNQUFNLE9BQU8sK0JBQWdDLFNBQVEseUJBQXlCOztvSUFBakUsK0JBQStCO3dIQUEvQiwrQkFBK0Isa0tBRi9CLENBQUMsbUNBQW1DLENBQUM7bUdBRXJDLCtCQUErQjtrQkFMM0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUU7MEZBQzhFO29CQUN4RixTQUFTLEVBQUUsQ0FBQyxtQ0FBbUMsQ0FBQztpQkFDakQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBmb3J3YXJkUmVmLFxuICBQcm92aWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBOR19WQUxJREFUT1JTLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVfVE9HR0xFX1JFUVVJUkVEX1ZBTElEQVRPUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBWYWxpZGF0b3IgZm9yIE1hdGVyaWFsIHNsaWRlLXRvZ2dsZSBjb21wb25lbnRzIHdpdGggdGhlIHJlcXVpcmVkIGF0dHJpYnV0ZSBpbiBhXG4gKiB0ZW1wbGF0ZS1kcml2ZW4gZm9ybS4gVGhlIGRlZmF1bHQgdmFsaWRhdG9yIGZvciByZXF1aXJlZCBmb3JtIGNvbnRyb2xzIGFzc2VydHNcbiAqIHRoYXQgdGhlIGNvbnRyb2wgdmFsdWUgaXMgbm90IHVuZGVmaW5lZCBidXQgdGhhdCBpcyBub3QgYXBwcm9wcmlhdGUgZm9yIGEgc2xpZGUtdG9nZ2xlXG4gKiB3aGVyZSB0aGUgdmFsdWUgaXMgYWx3YXlzIGRlZmluZWQuXG4gKlxuICogUmVxdWlyZWQgc2xpZGUtdG9nZ2xlIGZvcm0gY29udHJvbHMgYXJlIHZhbGlkIHdoZW4gY2hlY2tlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LXNsaWRlLXRvZ2dsZVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxcbiAgICAgICAgICAgICBtYXQtc2xpZGUtdG9nZ2xlW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sIG1hdC1zbGlkZS10b2dnbGVbcmVxdWlyZWRdW25nTW9kZWxdYCxcbiAgcHJvdmlkZXJzOiBbTUFUX1NMSURFX1RPR0dMRV9SRVFVSVJFRF9WQUxJREFUT1JdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciB7fVxuIl19