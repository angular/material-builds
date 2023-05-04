/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS } from '@angular/forms';
import * as i0 from "@angular/core";
export const MAT_CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatCheckboxRequiredValidator),
    multi: true,
};
/**
 * Validator for Material checkbox's required attribute in template-driven checkbox.
 * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
 * work with `mat-checkbox`.
 */
class MatCheckboxRequiredValidator extends CheckboxRequiredValidator {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCheckboxRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatCheckboxRequiredValidator, selector: "mat-checkbox[required][formControlName],\n             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]", providers: [MAT_CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { MatCheckboxRequiredValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCheckboxRequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-checkbox[required][formControlName],
             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]`,
                    providers: [MAT_CHECKBOX_REQUIRED_VALIDATOR],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtcmVxdWlyZWQtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBVyxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXhFLE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFhO0lBQ3ZELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsNEJBQTRCLENBQUM7SUFDM0QsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BS2EsNEJBQTZCLFNBQVEseUJBQXlCOzhHQUE5RCw0QkFBNEI7a0dBQTVCLDRCQUE0QixzSkFGNUIsQ0FBQywrQkFBK0IsQ0FBQzs7U0FFakMsNEJBQTRCOzJGQUE1Qiw0QkFBNEI7a0JBTHhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFO2tGQUNzRTtvQkFDaEYsU0FBUyxFQUFFLENBQUMsK0JBQStCLENBQUM7aUJBQzdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBQcm92aWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsIE5HX1ZBTElEQVRPUlN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IE1BVF9DSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIFZhbGlkYXRvciBmb3IgTWF0ZXJpYWwgY2hlY2tib3gncyByZXF1aXJlZCBhdHRyaWJ1dGUgaW4gdGVtcGxhdGUtZHJpdmVuIGNoZWNrYm94LlxuICogQ3VycmVudCBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIG9ubHkgd29yayB3aXRoIGBpbnB1dCB0eXBlPWNoZWNrYm94YCBhbmQgZG9lcyBub3RcbiAqIHdvcmsgd2l0aCBgbWF0LWNoZWNrYm94YC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LWNoZWNrYm94W3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLFxuICAgICAgICAgICAgIG1hdC1jaGVja2JveFtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLCBtYXQtY2hlY2tib3hbcmVxdWlyZWRdW25nTW9kZWxdYCxcbiAgcHJvdmlkZXJzOiBbTUFUX0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIHt9XG4iXX0=