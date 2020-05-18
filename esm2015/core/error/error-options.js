/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/error/error-options.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Error state matcher that matches when a control is invalid and dirty.
 */
let ShowOnDirtyErrorStateMatcher = /** @class */ (() => {
    /**
     * Error state matcher that matches when a control is invalid and dirty.
     */
    class ShowOnDirtyErrorStateMatcher {
        /**
         * @param {?} control
         * @param {?} form
         * @return {?}
         */
        isErrorState(control, form) {
            return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
        }
    }
    ShowOnDirtyErrorStateMatcher.decorators = [
        { type: Injectable }
    ];
    return ShowOnDirtyErrorStateMatcher;
})();
export { ShowOnDirtyErrorStateMatcher };
/**
 * Provider that defines how form controls behave with regards to displaying error messages.
 */
let ErrorStateMatcher = /** @class */ (() => {
    /**
     * Provider that defines how form controls behave with regards to displaying error messages.
     */
    class ErrorStateMatcher {
        /**
         * @param {?} control
         * @param {?} form
         * @return {?}
         */
        isErrorState(control, form) {
            return !!(control && control.invalid && (control.touched || (form && form.submitted)));
        }
    }
    ErrorStateMatcher.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */ ErrorStateMatcher.ɵprov = i0.ɵɵdefineInjectable({ factory: function ErrorStateMatcher_Factory() { return new ErrorStateMatcher(); }, token: ErrorStateMatcher, providedIn: "root" });
    return ErrorStateMatcher;
})();
export { ErrorStateMatcher };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3Itb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2Vycm9yL2Vycm9yLW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFJekM7Ozs7SUFBQSxNQUNhLDRCQUE0Qjs7Ozs7O1FBQ3ZDLFlBQVksQ0FBQyxPQUEyQixFQUFFLElBQXdDO1lBQ2hGLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkYsQ0FBQzs7O2dCQUpGLFVBQVU7O0lBS1gsbUNBQUM7S0FBQTtTQUpZLDRCQUE0Qjs7OztBQU96Qzs7OztJQUFBLE1BQ2EsaUJBQWlCOzs7Ozs7UUFDNUIsWUFBWSxDQUFDLE9BQTJCLEVBQUUsSUFBd0M7WUFDaEYsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixDQUFDOzs7Z0JBSkYsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7OzRCQXBCaEM7S0F5QkM7U0FKWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0Zvcm0sIEZvcm1Db250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbi8qKiBFcnJvciBzdGF0ZSBtYXRjaGVyIHRoYXQgbWF0Y2hlcyB3aGVuIGEgY29udHJvbCBpcyBpbnZhbGlkIGFuZCBkaXJ0eS4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTaG93T25EaXJ0eUVycm9yU3RhdGVNYXRjaGVyIGltcGxlbWVudHMgRXJyb3JTdGF0ZU1hdGNoZXIge1xuICBpc0Vycm9yU3RhdGUoY29udHJvbDogRm9ybUNvbnRyb2wgfCBudWxsLCBmb3JtOiBGb3JtR3JvdXBEaXJlY3RpdmUgfCBOZ0Zvcm0gfCBudWxsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKGNvbnRyb2wgJiYgY29udHJvbC5pbnZhbGlkICYmIChjb250cm9sLmRpcnR5IHx8IChmb3JtICYmIGZvcm0uc3VibWl0dGVkKSkpO1xuICB9XG59XG5cbi8qKiBQcm92aWRlciB0aGF0IGRlZmluZXMgaG93IGZvcm0gY29udHJvbHMgYmVoYXZlIHdpdGggcmVnYXJkcyB0byBkaXNwbGF5aW5nIGVycm9yIG1lc3NhZ2VzLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgRXJyb3JTdGF0ZU1hdGNoZXIge1xuICBpc0Vycm9yU3RhdGUoY29udHJvbDogRm9ybUNvbnRyb2wgfCBudWxsLCBmb3JtOiBGb3JtR3JvdXBEaXJlY3RpdmUgfCBOZ0Zvcm0gfCBudWxsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKGNvbnRyb2wgJiYgY29udHJvbC5pbnZhbGlkICYmIChjb250cm9sLnRvdWNoZWQgfHwgKGZvcm0gJiYgZm9ybS5zdWJtaXR0ZWQpKSk7XG4gIH1cbn1cbiJdfQ==