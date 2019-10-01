/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef } from '@angular/core';
/**
 * Template to be used to override the icons inside the step header.
 */
var MatStepperIcon = /** @class */ (function () {
    function MatStepperIcon(templateRef) {
        this.templateRef = templateRef;
    }
    MatStepperIcon.decorators = [
        { type: Directive, args: [{
                    selector: 'ng-template[matStepperIcon]',
                },] }
    ];
    /** @nocollapse */
    MatStepperIcon.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    MatStepperIcon.propDecorators = {
        name: [{ type: Input, args: ['matStepperIcon',] }]
    };
    return MatStepperIcon;
}());
export { MatStepperIcon };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQWE1RDs7R0FFRztBQUNIO0lBT0Usd0JBQW1CLFdBQStDO1FBQS9DLGdCQUFXLEdBQVgsV0FBVyxDQUFvQztJQUFHLENBQUM7O2dCQVB2RSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtpQkFDeEM7Ozs7Z0JBbEJ5QixXQUFXOzs7dUJBcUJsQyxLQUFLLFNBQUMsZ0JBQWdCOztJQUd6QixxQkFBQztDQUFBLEFBUkQsSUFRQztTQUxZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N0ZXBTdGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuXG4vKiogVGVtcGxhdGUgY29udGV4dCBhdmFpbGFibGUgdG8gYW4gYXR0YWNoZWQgYG1hdFN0ZXBwZXJJY29uYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U3RlcHBlckljb25Db250ZXh0IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBzdGVwLiAqL1xuICBpbmRleDogbnVtYmVyO1xuICAvKiogV2hldGhlciB0aGUgc3RlcCBpcyBjdXJyZW50bHkgYWN0aXZlLiAqL1xuICBhY3RpdmU6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIG9wdGlvbmFsLiAqL1xuICBvcHRpb25hbDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUZW1wbGF0ZSB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBpY29ucyBpbnNpZGUgdGhlIHN0ZXAgaGVhZGVyLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRTdGVwcGVySWNvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVySWNvbiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBpY29uIHRvIGJlIG92ZXJyaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0U3RlcHBlckljb24nKSBuYW1lOiBTdGVwU3RhdGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+KSB7fVxufVxuIl19