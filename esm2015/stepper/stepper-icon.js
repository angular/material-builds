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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7OztBQUk1RCwyQ0FPQzs7Ozs7O0lBTEMsc0NBQWM7Ozs7O0lBRWQsdUNBQWdCOzs7OztJQUVoQix5Q0FBa0I7Ozs7O0FBU3BCLE1BQU0sT0FBTyxjQUFjOzs7O0lBSXpCLFlBQW1CLFdBQStDO1FBQS9DLGdCQUFXLEdBQVgsV0FBVyxDQUFvQztJQUFHLENBQUM7OztZQVB2RSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjthQUN4Qzs7OztZQWxCeUIsV0FBVzs7O21CQXFCbEMsS0FBSyxTQUFDLGdCQUFnQjs7Ozs7OztJQUF2Qiw4QkFBeUM7O0lBRTdCLHFDQUFzRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3RlcFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvc3RlcHBlcic7XG5cbi8qKiBUZW1wbGF0ZSBjb250ZXh0IGF2YWlsYWJsZSB0byBhbiBhdHRhY2hlZCBgbWF0U3RlcHBlckljb25gLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTdGVwcGVySWNvbkNvbnRleHQge1xuICAvKiogSW5kZXggb2YgdGhlIHN0ZXAuICovXG4gIGluZGV4OiBudW1iZXI7XG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIGN1cnJlbnRseSBhY3RpdmUuICovXG4gIGFjdGl2ZTogYm9vbGVhbjtcbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXAgaXMgb3B0aW9uYWwuICovXG4gIG9wdGlvbmFsOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRlbXBsYXRlIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGljb25zIGluc2lkZSB0aGUgc3RlcCBoZWFkZXIuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdFN0ZXBwZXJJY29uXScsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJJY29uIHtcbiAgLyoqIE5hbWUgb2YgdGhlIGljb24gdG8gYmUgb3ZlcnJpZGRlbi4gKi9cbiAgQElucHV0KCdtYXRTdGVwcGVySWNvbicpIG5hbWU6IFN0ZXBTdGF0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE1hdFN0ZXBwZXJJY29uQ29udGV4dD4pIHt9XG59XG4iXX0=