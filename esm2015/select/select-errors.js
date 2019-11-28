/**
 * @fileoverview added by tsickle
 * Generated from: src/material/select/select-errors.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Returns an exception to be thrown when attempting to change a select's `multiple` option
 * after initialization.
 * \@docs-private
 * @return {?}
 */
export function getMatSelectDynamicMultipleError() {
    return Error('Cannot change `multiple` mode of select after initialization.');
}
/**
 * Returns an exception to be thrown when attempting to assign a non-array value to a select
 * in `multiple` mode. Note that `undefined` and `null` are still valid values to allow for
 * resetting the value.
 * \@docs-private
 * @return {?}
 */
export function getMatSelectNonArrayValueError() {
    return Error('Value must be an array in multiple-selection mode.');
}
/**
 * Returns an exception to be thrown when assigning a non-function value to the comparator
 * used to determine if a value corresponds to an option. Note that whether the function
 * actually takes two values and returns a boolean is not checked.
 * @return {?}
 */
export function getMatSelectNonFunctionValueError() {
    return Error('`compareWith` must be a function.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zZWxlY3Qvc2VsZWN0LWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxNQUFNLFVBQVUsZ0NBQWdDO0lBQzlDLE9BQU8sS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7QUFDaEYsQ0FBQzs7Ozs7Ozs7QUFRRCxNQUFNLFVBQVUsOEJBQThCO0lBQzVDLE9BQU8sS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7QUFDckUsQ0FBQzs7Ozs7OztBQU9ELE1BQU0sVUFBVSxpQ0FBaUM7SUFDL0MsT0FBTyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUNwRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byBjaGFuZ2UgYSBzZWxlY3QncyBgbXVsdGlwbGVgIG9wdGlvblxuICogYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcignQ2Fubm90IGNoYW5nZSBgbXVsdGlwbGVgIG1vZGUgb2Ygc2VsZWN0IGFmdGVyIGluaXRpYWxpemF0aW9uLicpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGF0dGVtcHRpbmcgdG8gYXNzaWduIGEgbm9uLWFycmF5IHZhbHVlIHRvIGEgc2VsZWN0XG4gKiBpbiBgbXVsdGlwbGVgIG1vZGUuIE5vdGUgdGhhdCBgdW5kZWZpbmVkYCBhbmQgYG51bGxgIGFyZSBzdGlsbCB2YWxpZCB2YWx1ZXMgdG8gYWxsb3cgZm9yXG4gKiByZXNldHRpbmcgdGhlIHZhbHVlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKCdWYWx1ZSBtdXN0IGJlIGFuIGFycmF5IGluIG11bHRpcGxlLXNlbGVjdGlvbiBtb2RlLicpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGFzc2lnbmluZyBhIG5vbi1mdW5jdGlvbiB2YWx1ZSB0byB0aGUgY29tcGFyYXRvclxuICogdXNlZCB0byBkZXRlcm1pbmUgaWYgYSB2YWx1ZSBjb3JyZXNwb25kcyB0byBhbiBvcHRpb24uIE5vdGUgdGhhdCB3aGV0aGVyIHRoZSBmdW5jdGlvblxuICogYWN0dWFsbHkgdGFrZXMgdHdvIHZhbHVlcyBhbmQgcmV0dXJucyBhIGJvb2xlYW4gaXMgbm90IGNoZWNrZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoJ2Bjb21wYXJlV2l0aGAgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xufVxuIl19