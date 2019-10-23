/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { Directive, forwardRef, } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS, } from '@angular/forms';
export var MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MatSlideToggleRequiredValidator; }),
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
var MatSlideToggleRequiredValidator = /** @class */ (function (_super) {
    __extends(MatSlideToggleRequiredValidator, _super);
    function MatSlideToggleRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatSlideToggleRequiredValidator.decorators = [
        { type: Directive, args: [{
                    selector: "mat-slide-toggle[required][formControlName],\n             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]",
                    providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
                },] }
    ];
    return MatSlideToggleRequiredValidator;
}(CheckboxRequiredValidator));
export { MatSlideToggleRequiredValidator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixhQUFhLEdBQ2QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixNQUFNLENBQUMsSUFBTSxtQ0FBbUMsR0FBYTtJQUMzRCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSwrQkFBK0IsRUFBL0IsQ0FBK0IsQ0FBQztJQUM5RCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7Ozs7OztHQU9HO0FBQ0g7SUFLcUQsbURBQXlCO0lBTDlFOztJQUtnRixDQUFDOztnQkFMaEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx5SUFDOEU7b0JBQ3hGLFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO2lCQUNqRDs7SUFDK0Usc0NBQUM7Q0FBQSxBQUxqRixDQUtxRCx5QkFBeUIsR0FBRztTQUFwRSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBmb3J3YXJkUmVmLFxuICBQcm92aWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBOR19WQUxJREFUT1JTLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVfVE9HR0xFX1JFUVVJUkVEX1ZBTElEQVRPUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBWYWxpZGF0b3IgZm9yIE1hdGVyaWFsIHNsaWRlLXRvZ2dsZSBjb21wb25lbnRzIHdpdGggdGhlIHJlcXVpcmVkIGF0dHJpYnV0ZSBpbiBhXG4gKiB0ZW1wbGF0ZS1kcml2ZW4gZm9ybS4gVGhlIGRlZmF1bHQgdmFsaWRhdG9yIGZvciByZXF1aXJlZCBmb3JtIGNvbnRyb2xzIGFzc2VydHNcbiAqIHRoYXQgdGhlIGNvbnRyb2wgdmFsdWUgaXMgbm90IHVuZGVmaW5lZCBidXQgdGhhdCBpcyBub3QgYXBwcm9wcmlhdGUgZm9yIGEgc2xpZGUtdG9nZ2xlXG4gKiB3aGVyZSB0aGUgdmFsdWUgaXMgYWx3YXlzIGRlZmluZWQuXG4gKlxuICogUmVxdWlyZWQgc2xpZGUtdG9nZ2xlIGZvcm0gY29udHJvbHMgYXJlIHZhbGlkIHdoZW4gY2hlY2tlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LXNsaWRlLXRvZ2dsZVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxcbiAgICAgICAgICAgICBtYXQtc2xpZGUtdG9nZ2xlW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sIG1hdC1zbGlkZS10b2dnbGVbcmVxdWlyZWRdW25nTW9kZWxdYCxcbiAgcHJvdmlkZXJzOiBbTUFUX1NMSURFX1RPR0dMRV9SRVFVSVJFRF9WQUxJREFUT1JdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciB7fVxuIl19