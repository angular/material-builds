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
export const MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatSlideToggleRequiredValidator),
    multi: true,
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSlideToggleRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatSlideToggleRequiredValidator, isStandalone: true, selector: "mat-slide-toggle[required][formControlName],\n             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]", providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSlideToggleRequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-slide-toggle[required][formControlName],
             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]`,
                    providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBVyxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXhFLE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFhO0lBQzNELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsK0JBQStCLENBQUM7SUFDOUQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7Ozs7Ozs7R0FPRztBQU9ILE1BQU0sT0FBTywrQkFBZ0MsU0FBUSx5QkFBeUI7OEdBQWpFLCtCQUErQjtrR0FBL0IsK0JBQStCLHNMQUgvQixDQUFDLG1DQUFtQyxDQUFDOzsyRkFHckMsK0JBQStCO2tCQU4zQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRTswRkFDOEU7b0JBQ3hGLFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO29CQUNoRCxVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIGZvcndhcmRSZWYsIFByb3ZpZGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciwgTkdfVkFMSURBVE9SU30gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgY29uc3QgTUFUX1NMSURFX1RPR0dMRV9SRVFVSVJFRF9WQUxJREFUT1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIFZhbGlkYXRvciBmb3IgTWF0ZXJpYWwgc2xpZGUtdG9nZ2xlIGNvbXBvbmVudHMgd2l0aCB0aGUgcmVxdWlyZWQgYXR0cmlidXRlIGluIGFcbiAqIHRlbXBsYXRlLWRyaXZlbiBmb3JtLiBUaGUgZGVmYXVsdCB2YWxpZGF0b3IgZm9yIHJlcXVpcmVkIGZvcm0gY29udHJvbHMgYXNzZXJ0c1xuICogdGhhdCB0aGUgY29udHJvbCB2YWx1ZSBpcyBub3QgdW5kZWZpbmVkIGJ1dCB0aGF0IGlzIG5vdCBhcHByb3ByaWF0ZSBmb3IgYSBzbGlkZS10b2dnbGVcbiAqIHdoZXJlIHRoZSB2YWx1ZSBpcyBhbHdheXMgZGVmaW5lZC5cbiAqXG4gKiBSZXF1aXJlZCBzbGlkZS10b2dnbGUgZm9ybSBjb250cm9scyBhcmUgdmFsaWQgd2hlbiBjaGVja2VkLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtc2xpZGUtdG9nZ2xlW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLFxuICAgICAgICAgICAgIG1hdC1zbGlkZS10b2dnbGVbcmVxdWlyZWRdW2Zvcm1Db250cm9sXSwgbWF0LXNsaWRlLXRvZ2dsZVtyZXF1aXJlZF1bbmdNb2RlbF1gLFxuICBwcm92aWRlcnM6IFtNQVRfU0xJREVfVE9HR0xFX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIHt9XG4iXX0=