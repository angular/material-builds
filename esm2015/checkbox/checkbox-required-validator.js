/**
 * @fileoverview added by tsickle
 * Generated from: src/material/checkbox/checkbox-required-validator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
let MatCheckboxRequiredValidator = /** @class */ (() => {
    /**
     * Validator for Material checkbox's required attribute in template-driven checkbox.
     * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
     * work with `mat-checkbox`.
     */
    class MatCheckboxRequiredValidator extends CheckboxRequiredValidator {
    }
    MatCheckboxRequiredValidator.decorators = [
        { type: Directive, args: [{
                    selector: `mat-checkbox[required][formControlName],
             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]`,
                    providers: [MAT_CHECKBOX_REQUIRED_VALIDATOR],
                },] }
    ];
    return MatCheckboxRequiredValidator;
})();
export { MatCheckboxRequiredValidator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtcmVxdWlyZWQtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLGFBQWEsR0FDZCxNQUFNLGdCQUFnQixDQUFDOztBQUV4QixNQUFNLE9BQU8sK0JBQStCLEdBQWE7SUFDdkQsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVU7OztJQUFDLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixFQUFDO0lBQzNELEtBQUssRUFBRSxJQUFJO0NBQ1o7Ozs7OztBQU9EOzs7Ozs7SUFBQSxNQUthLDRCQUE2QixTQUFRLHlCQUF5Qjs7O2dCQUwxRSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFO2tGQUNzRTtvQkFDaEYsU0FBUyxFQUFFLENBQUMsK0JBQStCLENBQUM7aUJBQzdDOztJQUM0RSxtQ0FBQztLQUFBO1NBQWpFLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIGZvcndhcmRSZWYsXG4gIFByb3ZpZGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsXG4gIE5HX1ZBTElEQVRPUlMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IE1BVF9DSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogVmFsaWRhdG9yIGZvciBNYXRlcmlhbCBjaGVja2JveCdzIHJlcXVpcmVkIGF0dHJpYnV0ZSBpbiB0ZW1wbGF0ZS1kcml2ZW4gY2hlY2tib3guXG4gKiBDdXJyZW50IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3Igb25seSB3b3JrIHdpdGggYGlucHV0IHR5cGU9Y2hlY2tib3hgIGFuZCBkb2VzIG5vdFxuICogd29yayB3aXRoIGBtYXQtY2hlY2tib3hgLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2hlY2tib3hbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sXG4gICAgICAgICAgICAgbWF0LWNoZWNrYm94W3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sIG1hdC1jaGVja2JveFtyZXF1aXJlZF1bbmdNb2RlbF1gLFxuICBwcm92aWRlcnM6IFtNQVRfQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3Ige31cbiJdfQ==