/**
 * @fileoverview added by tsickle
 * Generated from: src/material/slide-toggle/slide-toggle-config.ts
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
 * Default `mat-slide-toggle` options that can be overridden.
 * @record
 */
export function MatSlideToggleDefaultOptions() { }
if (false) {
    /**
     * Whether toggle action triggers value changes in slide toggle.
     * @type {?|undefined}
     */
    MatSlideToggleDefaultOptions.prototype.disableToggleValue;
    /**
     * Whether drag action triggers value changes in slide toggle.
     * @deprecated No longer being used.
     * \@breaking-change 10.0.0
     * @type {?|undefined}
     */
    MatSlideToggleDefaultOptions.prototype.disableDragValue;
}
/**
 * Injection token to be used to override the default options for `mat-slide-toggle`.
 * @type {?}
 */
export const MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS = new InjectionToken('mat-slide-toggle-default-options', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    () => ({ disableToggleValue: false }))
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7OztBQUk3QyxrREFTQzs7Ozs7O0lBUEMsMERBQTZCOzs7Ozs7O0lBTTdCLHdEQUEyQjs7Ozs7O0FBSTdCLE1BQU0sT0FBTyxnQ0FBZ0MsR0FDM0MsSUFBSSxjQUFjLENBQStCLGtDQUFrQyxFQUFFO0lBQ25GLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU87OztJQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO0NBQzdDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7SW5qZWN0aW9uVG9rZW59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5cbi8qKiBEZWZhdWx0IGBtYXQtc2xpZGUtdG9nZ2xlYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNsaWRlVG9nZ2xlRGVmYXVsdE9wdGlvbnMge1xuICAvKiogV2hldGhlciB0b2dnbGUgYWN0aW9uIHRyaWdnZXJzIHZhbHVlIGNoYW5nZXMgaW4gc2xpZGUgdG9nZ2xlLiAqL1xuICBkaXNhYmxlVG9nZ2xlVmFsdWU/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciBkcmFnIGFjdGlvbiB0cmlnZ2VycyB2YWx1ZSBjaGFuZ2VzIGluIHNsaWRlIHRvZ2dsZS5cbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBkaXNhYmxlRHJhZ1ZhbHVlPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtc2xpZGUtdG9nZ2xlYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVfVE9HR0xFX0RFRkFVTFRfT1BUSU9OUyA9XG4gIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTbGlkZVRvZ2dsZURlZmF1bHRPcHRpb25zPignbWF0LXNsaWRlLXRvZ2dsZS1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+ICh7ZGlzYWJsZVRvZ2dsZVZhbHVlOiBmYWxzZX0pXG4gIH0pO1xuIl19