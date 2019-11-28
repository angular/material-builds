/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-errors.ts
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
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
export function getSortDuplicateSortableIdError(id) {
    return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
/**
 * \@docs-private
 * @return {?}
 */
export function getSortHeaderNotContainedWithinSortError() {
    return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
/**
 * \@docs-private
 * @return {?}
 */
export function getSortHeaderMissingIdError() {
    return Error(`MatSortHeader must be provided with a unique id.`);
}
/**
 * \@docs-private
 * @param {?} direction
 * @return {?}
 */
export function getSortInvalidDirectionError(direction) {
    return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLE1BQU0sVUFBVSwrQkFBK0IsQ0FBQyxFQUFVO0lBQ3hELE9BQU8sS0FBSyxDQUFDLGtEQUFrRCxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pFLENBQUM7Ozs7O0FBR0QsTUFBTSxVQUFVLHdDQUF3QztJQUN0RCxPQUFPLEtBQUssQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO0FBQ25HLENBQUM7Ozs7O0FBR0QsTUFBTSxVQUFVLDJCQUEyQjtJQUN6QyxPQUFPLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0FBQ25FLENBQUM7Ozs7OztBQUdELE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxTQUFpQjtJQUM1RCxPQUFPLEtBQUssQ0FBQyxHQUFHLFNBQVMsbURBQW1ELENBQUMsQ0FBQztBQUNoRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcihpZDogc3RyaW5nKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYENhbm5vdCBoYXZlIHR3byBNYXRTb3J0YWJsZXMgd2l0aCB0aGUgc2FtZSBpZCAoJHtpZH0pLmApO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRIZWFkZXJOb3RDb250YWluZWRXaXRoaW5Tb3J0RXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYE1hdFNvcnRIZWFkZXIgbXVzdCBiZSBwbGFjZWQgd2l0aGluIGEgcGFyZW50IGVsZW1lbnQgd2l0aCB0aGUgTWF0U29ydCBkaXJlY3RpdmUuYCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBNYXRTb3J0SGVhZGVyIG11c3QgYmUgcHJvdmlkZWQgd2l0aCBhIHVuaXF1ZSBpZC5gKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yKGRpcmVjdGlvbjogc3RyaW5nKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYCR7ZGlyZWN0aW9ufSBpcyBub3QgYSB2YWxpZCBzb3J0IGRpcmVjdGlvbiAoJ2FzYycgb3IgJ2Rlc2MnKS5gKTtcbn1cbiJdfQ==