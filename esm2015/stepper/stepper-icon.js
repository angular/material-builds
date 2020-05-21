/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Directive, Input, TemplateRef } from '@angular/core';
/**
 * Template to be used to override the icons inside the step header.
 */
let MatStepperIcon = /** @class */ (() => {
    let MatStepperIcon = class MatStepperIcon {
        constructor(templateRef) {
            this.templateRef = templateRef;
        }
    };
    __decorate([
        Input('matStepperIcon'),
        __metadata("design:type", String)
    ], MatStepperIcon.prototype, "name", void 0);
    MatStepperIcon = __decorate([
        Directive({
            selector: 'ng-template[matStepperIcon]',
        }),
        __metadata("design:paramtypes", [TemplateRef])
    ], MatStepperIcon);
    return MatStepperIcon;
})();
export { MatStepperIcon };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFhNUQ7O0dBRUc7QUFJSDtJQUFBLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWM7UUFJekIsWUFBbUIsV0FBK0M7WUFBL0MsZ0JBQVcsR0FBWCxXQUFXLENBQW9DO1FBQUcsQ0FBQztLQUN2RSxDQUFBO0lBSDBCO1FBQXhCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQzs7Z0RBQWlCO0lBRjlCLGNBQWM7UUFIMUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDZCQUE2QjtTQUN4QyxDQUFDO3lDQUtnQyxXQUFXO09BSmhDLGNBQWMsQ0FLMUI7SUFBRCxxQkFBQztLQUFBO1NBTFksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3RlcFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvc3RlcHBlcic7XG5cbi8qKiBUZW1wbGF0ZSBjb250ZXh0IGF2YWlsYWJsZSB0byBhbiBhdHRhY2hlZCBgbWF0U3RlcHBlckljb25gLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTdGVwcGVySWNvbkNvbnRleHQge1xuICAvKiogSW5kZXggb2YgdGhlIHN0ZXAuICovXG4gIGluZGV4OiBudW1iZXI7XG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIGN1cnJlbnRseSBhY3RpdmUuICovXG4gIGFjdGl2ZTogYm9vbGVhbjtcbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXAgaXMgb3B0aW9uYWwuICovXG4gIG9wdGlvbmFsOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRlbXBsYXRlIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGljb25zIGluc2lkZSB0aGUgc3RlcCBoZWFkZXIuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdFN0ZXBwZXJJY29uXScsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJJY29uIHtcbiAgLyoqIE5hbWUgb2YgdGhlIGljb24gdG8gYmUgb3ZlcnJpZGRlbi4gKi9cbiAgQElucHV0KCdtYXRTdGVwcGVySWNvbicpIG5hbWU6IFN0ZXBTdGF0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE1hdFN0ZXBwZXJJY29uQ29udGV4dD4pIHt9XG59XG4iXX0=