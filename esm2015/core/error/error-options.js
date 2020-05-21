import { __decorate } from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/** Error state matcher that matches when a control is invalid and dirty. */
let ShowOnDirtyErrorStateMatcher = /** @class */ (() => {
    let ShowOnDirtyErrorStateMatcher = class ShowOnDirtyErrorStateMatcher {
        isErrorState(control, form) {
            return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
        }
    };
    ShowOnDirtyErrorStateMatcher = __decorate([
        Injectable()
    ], ShowOnDirtyErrorStateMatcher);
    return ShowOnDirtyErrorStateMatcher;
})();
export { ShowOnDirtyErrorStateMatcher };
/** Provider that defines how form controls behave with regards to displaying error messages. */
let ErrorStateMatcher = /** @class */ (() => {
    let ErrorStateMatcher = class ErrorStateMatcher {
        isErrorState(control, form) {
            return !!(control && control.invalid && (control.touched || (form && form.submitted)));
        }
    };
    ErrorStateMatcher.ɵprov = i0.ɵɵdefineInjectable({ factory: function ErrorStateMatcher_Factory() { return new ErrorStateMatcher(); }, token: ErrorStateMatcher, providedIn: "root" });
    ErrorStateMatcher = __decorate([
        Injectable({ providedIn: 'root' })
    ], ErrorStateMatcher);
    return ErrorStateMatcher;
})();
export { ErrorStateMatcher };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3Itb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2Vycm9yL2Vycm9yLW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBR3pDLDRFQUE0RTtBQUU1RTtJQUFBLElBQWEsNEJBQTRCLEdBQXpDLE1BQWEsNEJBQTRCO1FBQ3ZDLFlBQVksQ0FBQyxPQUEyQixFQUFFLElBQXdDO1lBQ2hGLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkYsQ0FBQztLQUNGLENBQUE7SUFKWSw0QkFBNEI7UUFEeEMsVUFBVSxFQUFFO09BQ0EsNEJBQTRCLENBSXhDO0lBQUQsbUNBQUM7S0FBQTtTQUpZLDRCQUE0QjtBQU16QyxnR0FBZ0c7QUFFaEc7SUFBQSxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtRQUM1QixZQUFZLENBQUMsT0FBMkIsRUFBRSxJQUF3QztZQUNoRixPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLENBQUM7S0FDRixDQUFBOztJQUpZLGlCQUFpQjtRQUQ3QixVQUFVLENBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUM7T0FDcEIsaUJBQWlCLENBSTdCOzRCQXpCRDtLQXlCQztTQUpZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmUsIE5nRm9ybSwgRm9ybUNvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLyoqIEVycm9yIHN0YXRlIG1hdGNoZXIgdGhhdCBtYXRjaGVzIHdoZW4gYSBjb250cm9sIGlzIGludmFsaWQgYW5kIGRpcnR5LiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNob3dPbkRpcnR5RXJyb3JTdGF0ZU1hdGNoZXIgaW1wbGVtZW50cyBFcnJvclN0YXRlTWF0Y2hlciB7XG4gIGlzRXJyb3JTdGF0ZShjb250cm9sOiBGb3JtQ29udHJvbCB8IG51bGwsIGZvcm06IEZvcm1Hcm91cERpcmVjdGl2ZSB8IE5nRm9ybSB8IG51bGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEoY29udHJvbCAmJiBjb250cm9sLmludmFsaWQgJiYgKGNvbnRyb2wuZGlydHkgfHwgKGZvcm0gJiYgZm9ybS5zdWJtaXR0ZWQpKSk7XG4gIH1cbn1cblxuLyoqIFByb3ZpZGVyIHRoYXQgZGVmaW5lcyBob3cgZm9ybSBjb250cm9scyBiZWhhdmUgd2l0aCByZWdhcmRzIHRvIGRpc3BsYXlpbmcgZXJyb3IgbWVzc2FnZXMuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBFcnJvclN0YXRlTWF0Y2hlciB7XG4gIGlzRXJyb3JTdGF0ZShjb250cm9sOiBGb3JtQ29udHJvbCB8IG51bGwsIGZvcm06IEZvcm1Hcm91cERpcmVjdGl2ZSB8IE5nRm9ybSB8IG51bGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEoY29udHJvbCAmJiBjb250cm9sLmludmFsaWQgJiYgKGNvbnRyb2wudG91Y2hlZCB8fCAoZm9ybSAmJiBmb3JtLnN1Ym1pdHRlZCkpKTtcbiAgfVxufVxuIl19