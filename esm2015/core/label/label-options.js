/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/label/label-options.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * InjectionToken that can be used to specify the global label options.
 * @deprecated Use `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token from
 *     `\@angular/material/form-field` instead.
 * \@breaking-change 11.0.0
 * @type {?}
 */
export const MAT_LABEL_GLOBAL_OPTIONS = new InjectionToken('mat-label-global-options');
/**
 * Configurable options for floating labels.
 * @deprecated Use `MatFormFieldDefaultOptions` from `\@angular/material/form-field` instead.
 * \@breaking-change 11.0.0
 * @record
 */
export function LabelOptions() { }
if (false) {
    /**
     * Whether the label should float `always`, `never`, or `auto` (only when necessary).
     * Default behavior is assumed to be `auto`.
     * @type {?|undefined}
     */
    LabelOptions.prototype.float;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwtb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2xhYmVsL2xhYmVsLW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7QUFRN0MsTUFBTSxPQUFPLHdCQUF3QixHQUNuQyxJQUFJLGNBQWMsQ0FBZSwwQkFBMEIsQ0FBQzs7Ozs7OztBQWM5RCxrQ0FNQzs7Ozs7OztJQURDLDZCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBJbmplY3Rpb25Ub2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGdsb2JhbCBsYWJlbCBvcHRpb25zLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlNgIGluamVjdGlvbiB0b2tlbiBmcm9tXG4gKiAgICAgYEBhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGRgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMFxuICovXG5leHBvcnQgY29uc3QgTUFUX0xBQkVMX0dMT0JBTF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPExhYmVsT3B0aW9ucz4oJ21hdC1sYWJlbC1nbG9iYWwtb3B0aW9ucycpO1xuXG4vKipcbiAqIFR5cGUgZm9yIHRoZSBhdmFpbGFibGUgZmxvYXRMYWJlbCB2YWx1ZXMuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYEZsb2F0TGFiZWxUeXBlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmxvYXRMYWJlbFR5cGUgPSAnYWx3YXlzJyB8ICduZXZlcicgfCAnYXV0byc7XG5cbi8qKlxuICogQ29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIGZsb2F0aW5nIGxhYmVscy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnNgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGRgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgZmxvYXQgYGFsd2F5c2AsIGBuZXZlcmAsIG9yIGBhdXRvYCAob25seSB3aGVuIG5lY2Vzc2FyeSkuXG4gICAqIERlZmF1bHQgYmVoYXZpb3IgaXMgYXNzdW1lZCB0byBiZSBgYXV0b2AuXG4gICAqL1xuICBmbG9hdD86IEZsb2F0TGFiZWxUeXBlO1xufVxuIl19