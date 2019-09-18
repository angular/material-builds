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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zZWxlY3Qvc2VsZWN0LWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQWFBLE1BQU0sVUFBVSxnQ0FBZ0M7SUFDOUMsT0FBTyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUNoRixDQUFDOzs7Ozs7OztBQVFELE1BQU0sVUFBVSw4QkFBOEI7SUFDNUMsT0FBTyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztBQUNyRSxDQUFDOzs7Ozs7O0FBT0QsTUFBTSxVQUFVLGlDQUFpQztJQUMvQyxPQUFPLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3BELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIGNoYW5nZSBhIHNlbGVjdCdzIGBtdWx0aXBsZWAgb3B0aW9uXG4gKiBhZnRlciBpbml0aWFsaXphdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdFNlbGVjdER5bmFtaWNNdWx0aXBsZUVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKCdDYW5ub3QgY2hhbmdlIGBtdWx0aXBsZWAgbW9kZSBvZiBzZWxlY3QgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byBhc3NpZ24gYSBub24tYXJyYXkgdmFsdWUgdG8gYSBzZWxlY3RcbiAqIGluIGBtdWx0aXBsZWAgbW9kZS4gTm90ZSB0aGF0IGB1bmRlZmluZWRgIGFuZCBgbnVsbGAgYXJlIHN0aWxsIHZhbGlkIHZhbHVlcyB0byBhbGxvdyBmb3JcbiAqIHJlc2V0dGluZyB0aGUgdmFsdWUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRTZWxlY3ROb25BcnJheVZhbHVlRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoJ1ZhbHVlIG11c3QgYmUgYW4gYXJyYXkgaW4gbXVsdGlwbGUtc2VsZWN0aW9uIG1vZGUuJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gYXNzaWduaW5nIGEgbm9uLWZ1bmN0aW9uIHZhbHVlIHRvIHRoZSBjb21wYXJhdG9yXG4gKiB1c2VkIHRvIGRldGVybWluZSBpZiBhIHZhbHVlIGNvcnJlc3BvbmRzIHRvIGFuIG9wdGlvbi4gTm90ZSB0aGF0IHdoZXRoZXIgdGhlIGZ1bmN0aW9uXG4gKiBhY3R1YWxseSB0YWtlcyB0d28gdmFsdWVzIGFuZCByZXR1cm5zIGEgYm9vbGVhbiBpcyBub3QgY2hlY2tlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdFNlbGVjdE5vbkZ1bmN0aW9uVmFsdWVFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcignYGNvbXBhcmVXaXRoYCBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG59XG4iXX0=