/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Template to be used to override the icons inside the step header.
 */
class MatStepperIcon {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperIcon, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatStepperIcon, selector: "ng-template[matStepperIcon]", inputs: { name: ["matStepperIcon", "name"] }, ngImport: i0 }); }
}
export { MatStepperIcon };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matStepperIcon]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { name: [{
                type: Input,
                args: ['matStepperIcon']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFhNUQ7O0dBRUc7QUFDSCxNQUdhLGNBQWM7SUFJekIsWUFBbUIsV0FBK0M7UUFBL0MsZ0JBQVcsR0FBWCxXQUFXLENBQW9DO0lBQUcsQ0FBQzs4R0FKM0QsY0FBYztrR0FBZCxjQUFjOztTQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFIMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO2lCQUN4QztrR0FHMEIsSUFBSTtzQkFBNUIsS0FBSzt1QkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N0ZXBTdGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuXG4vKiogVGVtcGxhdGUgY29udGV4dCBhdmFpbGFibGUgdG8gYW4gYXR0YWNoZWQgYG1hdFN0ZXBwZXJJY29uYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U3RlcHBlckljb25Db250ZXh0IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBzdGVwLiAqL1xuICBpbmRleDogbnVtYmVyO1xuICAvKiogV2hldGhlciB0aGUgc3RlcCBpcyBjdXJyZW50bHkgYWN0aXZlLiAqL1xuICBhY3RpdmU6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIG9wdGlvbmFsLiAqL1xuICBvcHRpb25hbDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUZW1wbGF0ZSB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBpY29ucyBpbnNpZGUgdGhlIHN0ZXAgaGVhZGVyLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRTdGVwcGVySWNvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVySWNvbiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBpY29uIHRvIGJlIG92ZXJyaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0U3RlcHBlckljb24nKSBuYW1lOiBTdGVwU3RhdGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+KSB7fVxufVxuIl19