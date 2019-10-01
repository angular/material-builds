/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS, } from '@angular/forms';
/** @type {?} */
export const MAT_CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatCheckboxRequiredValidator)),
    multi: true
};
/**
 * Validator for Material checkbox's required attribute in template-driven checkbox.
 * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
 * work with `mat-checkbox`.
 */
export class MatCheckboxRequiredValidator extends CheckboxRequiredValidator {
}
MatCheckboxRequiredValidator.decorators = [
    { type: Directive, args: [{
                selector: `mat-checkbox[required][formControlName],
             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]`,
                providers: [MAT_CHECKBOX_REQUIRED_VALIDATOR],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtcmVxdWlyZWQtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxHQUVYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsYUFBYSxHQUNkLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXhCLE1BQU0sT0FBTywrQkFBK0IsR0FBYTtJQUN2RCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVTs7O0lBQUMsR0FBRyxFQUFFLENBQUMsNEJBQTRCLEVBQUM7SUFDM0QsS0FBSyxFQUFFLElBQUk7Q0FDWjs7Ozs7O0FBWUQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLHlCQUF5Qjs7O1lBTDFFLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUU7a0ZBQ3NFO2dCQUNoRixTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQzthQUM3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIGZvcndhcmRSZWYsXG4gIFByb3ZpZGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsXG4gIE5HX1ZBTElEQVRPUlMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IE1BVF9DSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogVmFsaWRhdG9yIGZvciBNYXRlcmlhbCBjaGVja2JveCdzIHJlcXVpcmVkIGF0dHJpYnV0ZSBpbiB0ZW1wbGF0ZS1kcml2ZW4gY2hlY2tib3guXG4gKiBDdXJyZW50IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3Igb25seSB3b3JrIHdpdGggYGlucHV0IHR5cGU9Y2hlY2tib3hgIGFuZCBkb2VzIG5vdFxuICogd29yayB3aXRoIGBtYXQtY2hlY2tib3hgLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2hlY2tib3hbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sXG4gICAgICAgICAgICAgbWF0LWNoZWNrYm94W3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sIG1hdC1jaGVja2JveFtyZXF1aXJlZF1bbmdNb2RlbF1gLFxuICBwcm92aWRlcnM6IFtNQVRfQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3Ige31cbiJdfQ==