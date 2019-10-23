/**
 * @fileoverview added by tsickle
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7O0FBSTdDLGtEQVNDOzs7Ozs7SUFQQywwREFBNkI7Ozs7Ozs7SUFNN0Isd0RBQTJCOzs7Ozs7QUFJN0IsTUFBTSxPQUFPLGdDQUFnQyxHQUMzQyxJQUFJLGNBQWMsQ0FBK0Isa0NBQWtDLEVBQUU7SUFDbkYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTzs7O0lBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7Q0FDN0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuLyoqIERlZmF1bHQgYG1hdC1zbGlkZS10b2dnbGVgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U2xpZGVUb2dnbGVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBXaGV0aGVyIHRvZ2dsZSBhY3Rpb24gdHJpZ2dlcnMgdmFsdWUgY2hhbmdlcyBpbiBzbGlkZSB0b2dnbGUuICovXG4gIGRpc2FibGVUb2dnbGVWYWx1ZT86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIGRyYWcgYWN0aW9uIHRyaWdnZXJzIHZhbHVlIGNoYW5nZXMgaW4gc2xpZGUgdG9nZ2xlLlxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIGRpc2FibGVEcmFnVmFsdWU/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zbGlkZS10b2dnbGVgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERV9UT0dHTEVfREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdFNsaWRlVG9nZ2xlRGVmYXVsdE9wdGlvbnM+KCdtYXQtc2xpZGUtdG9nZ2xlLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogKCkgPT4gKHtkaXNhYmxlVG9nZ2xlVmFsdWU6IGZhbHNlfSlcbiAgfSk7XG4iXX0=