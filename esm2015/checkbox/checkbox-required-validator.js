/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { Directive, forwardRef, } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS, } from '@angular/forms';
export const MAT_CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatCheckboxRequiredValidator),
    multi: true
};
/**
 * Validator for Material checkbox's required attribute in template-driven checkbox.
 * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
 * work with `mat-checkbox`.
 */
let MatCheckboxRequiredValidator = /** @class */ (() => {
    let MatCheckboxRequiredValidator = class MatCheckboxRequiredValidator extends CheckboxRequiredValidator {
    };
    MatCheckboxRequiredValidator = __decorate([
        Directive({
            selector: `mat-checkbox[required][formControlName],
             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]`,
            providers: [MAT_CHECKBOX_REQUIRED_VALIDATOR],
        })
    ], MatCheckboxRequiredValidator);
    return MatCheckboxRequiredValidator;
})();
export { MatCheckboxRequiredValidator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtcmVxdWlyZWQtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixhQUFhLEdBQ2QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBYTtJQUN2RCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixDQUFDO0lBQzNELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7O0dBSUc7QUFNSDtJQUFBLElBQWEsNEJBQTRCLEdBQXpDLE1BQWEsNEJBQTZCLFNBQVEseUJBQXlCO0tBQUcsQ0FBQTtJQUFqRSw0QkFBNEI7UUFMeEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFO2tGQUNzRTtZQUNoRixTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztTQUM3QyxDQUFDO09BQ1csNEJBQTRCLENBQXFDO0lBQUQsbUNBQUM7S0FBQTtTQUFqRSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBmb3J3YXJkUmVmLFxuICBQcm92aWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBOR19WQUxJREFUT1JTLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBNQVRfQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SOiBQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFZhbGlkYXRvciBmb3IgTWF0ZXJpYWwgY2hlY2tib3gncyByZXF1aXJlZCBhdHRyaWJ1dGUgaW4gdGVtcGxhdGUtZHJpdmVuIGNoZWNrYm94LlxuICogQ3VycmVudCBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIG9ubHkgd29yayB3aXRoIGBpbnB1dCB0eXBlPWNoZWNrYm94YCBhbmQgZG9lcyBub3RcbiAqIHdvcmsgd2l0aCBgbWF0LWNoZWNrYm94YC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LWNoZWNrYm94W3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLFxuICAgICAgICAgICAgIG1hdC1jaGVja2JveFtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLCBtYXQtY2hlY2tib3hbcmVxdWlyZWRdW25nTW9kZWxdYCxcbiAgcHJvdmlkZXJzOiBbTUFUX0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIHt9XG4iXX0=