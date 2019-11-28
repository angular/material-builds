/**
 * @fileoverview added by tsickle
 * Generated from: src/material/stepper/stepper-icon.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef } from '@angular/core';
/**
 * Template context available to an attached `matStepperIcon`.
 * @record
 */
export function MatStepperIconContext() { }
if (false) {
    /**
     * Index of the step.
     * @type {?}
     */
    MatStepperIconContext.prototype.index;
    /**
     * Whether the step is currently active.
     * @type {?}
     */
    MatStepperIconContext.prototype.active;
    /**
     * Whether the step is optional.
     * @type {?}
     */
    MatStepperIconContext.prototype.optional;
}
/**
 * Template to be used to override the icons inside the step header.
 */
export class MatStepperIcon {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
MatStepperIcon.decorators = [
    { type: Directive, args: [{
                selector: 'ng-template[matStepperIcon]',
            },] }
];
/** @nocollapse */
MatStepperIcon.ctorParameters = () => [
    { type: TemplateRef }
];
MatStepperIcon.propDecorators = {
    name: [{ type: Input, args: ['matStepperIcon',] }]
};
if (false) {
    /**
     * Name of the icon to be overridden.
     * @type {?}
     */
    MatStepperIcon.prototype.name;
    /** @type {?} */
    MatStepperIcon.prototype.templateRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFJNUQsMkNBT0M7Ozs7OztJQUxDLHNDQUFjOzs7OztJQUVkLHVDQUFnQjs7Ozs7SUFFaEIseUNBQWtCOzs7OztBQVNwQixNQUFNLE9BQU8sY0FBYzs7OztJQUl6QixZQUFtQixXQUErQztRQUEvQyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0M7SUFBRyxDQUFDOzs7WUFQdkUsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7YUFDeEM7Ozs7WUFsQnlCLFdBQVc7OzttQkFxQmxDLEtBQUssU0FBQyxnQkFBZ0I7Ozs7Ozs7SUFBdkIsOEJBQXlDOztJQUU3QixxQ0FBc0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N0ZXBTdGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuXG4vKiogVGVtcGxhdGUgY29udGV4dCBhdmFpbGFibGUgdG8gYW4gYXR0YWNoZWQgYG1hdFN0ZXBwZXJJY29uYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U3RlcHBlckljb25Db250ZXh0IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBzdGVwLiAqL1xuICBpbmRleDogbnVtYmVyO1xuICAvKiogV2hldGhlciB0aGUgc3RlcCBpcyBjdXJyZW50bHkgYWN0aXZlLiAqL1xuICBhY3RpdmU6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIG9wdGlvbmFsLiAqL1xuICBvcHRpb25hbDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUZW1wbGF0ZSB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBpY29ucyBpbnNpZGUgdGhlIHN0ZXAgaGVhZGVyLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRTdGVwcGVySWNvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVySWNvbiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBpY29uIHRvIGJlIG92ZXJyaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0U3RlcHBlckljb24nKSBuYW1lOiBTdGVwU3RhdGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+KSB7fVxufVxuIl19