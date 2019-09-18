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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBU0EsTUFBTSxVQUFVLCtCQUErQixDQUFDLEVBQVU7SUFDeEQsT0FBTyxLQUFLLENBQUMsa0RBQWtELEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekUsQ0FBQzs7Ozs7QUFHRCxNQUFNLFVBQVUsd0NBQXdDO0lBQ3RELE9BQU8sS0FBSyxDQUFDLGtGQUFrRixDQUFDLENBQUM7QUFDbkcsQ0FBQzs7Ozs7QUFHRCxNQUFNLFVBQVUsMkJBQTJCO0lBQ3pDLE9BQU8sS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDbkUsQ0FBQzs7Ozs7O0FBR0QsTUFBTSxVQUFVLDRCQUE0QixDQUFDLFNBQWlCO0lBQzVELE9BQU8sS0FBSyxDQUFDLEdBQUcsU0FBUyxtREFBbUQsQ0FBQyxDQUFDO0FBQ2hGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0RHVwbGljYXRlU29ydGFibGVJZEVycm9yKGlkOiBzdHJpbmcpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgQ2Fubm90IGhhdmUgdHdvIE1hdFNvcnRhYmxlcyB3aXRoIHRoZSBzYW1lIGlkICgke2lkfSkuYCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydEhlYWRlck5vdENvbnRhaW5lZFdpdGhpblNvcnRFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgTWF0U29ydEhlYWRlciBtdXN0IGJlIHBsYWNlZCB3aXRoaW4gYSBwYXJlbnQgZWxlbWVudCB3aXRoIHRoZSBNYXRTb3J0IGRpcmVjdGl2ZS5gKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYE1hdFNvcnRIZWFkZXIgbXVzdCBiZSBwcm92aWRlZCB3aXRoIGEgdW5pcXVlIGlkLmApO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IoZGlyZWN0aW9uOiBzdHJpbmcpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgJHtkaXJlY3Rpb259IGlzIG5vdCBhIHZhbGlkIHNvcnQgZGlyZWN0aW9uICgnYXNjJyBvciAnZGVzYycpLmApO1xufVxuIl19