/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/ripple/ripple-ref.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @enum {number} */
const RippleState = {
    FADING_IN: 0, VISIBLE: 1, FADING_OUT: 2, HIDDEN: 3,
};
export { RippleState };
/**
 * Reference to a previously launched ripple element.
 */
export class RippleRef {
    /**
     * @param {?} _renderer
     * @param {?} element
     * @param {?} config
     */
    constructor(_renderer, element, config) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
        /**
         * Current state of the ripple.
         */
        this.state = 3 /* HIDDEN */;
    }
    /**
     * Fades out the ripple element.
     * @return {?}
     */
    fadeOut() {
        this._renderer.fadeOutRipple(this);
    }
}
if (false) {
    /**
     * Current state of the ripple.
     * @type {?}
     */
    RippleRef.prototype.state;
    /**
     * @type {?}
     * @private
     */
    RippleRef.prototype._renderer;
    /**
     * Reference to the ripple HTML element.
     * @type {?}
     */
    RippleRef.prototype.element;
    /**
     * Ripple configuration used for the ripple.
     * @type {?}
     */
    RippleRef.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3JpcHBsZS9yaXBwbGUtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFXQSxNQUFrQixXQUFXO0lBQzNCLFNBQVMsR0FBQSxFQUFFLE9BQU8sR0FBQSxFQUFFLFVBQVUsR0FBQSxFQUFFLE1BQU0sR0FBQTtFQUN2Qzs7Ozs7QUFLRCxNQUFNLE9BQU8sU0FBUzs7Ozs7O0lBS3BCLFlBQ1UsU0FBeUIsRUFFMUIsT0FBb0IsRUFFcEIsTUFBb0I7UUFKbkIsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7UUFFMUIsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUVwQixXQUFNLEdBQU4sTUFBTSxDQUFjOzs7O1FBUDdCLFVBQUssa0JBQW1DO0lBUXhDLENBQUM7Ozs7O0lBR0QsT0FBTztRQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDRjs7Ozs7O0lBZEMsMEJBQXdDOzs7OztJQUd0Qyw4QkFBaUM7Ozs7O0lBRWpDLDRCQUEyQjs7Ozs7SUFFM0IsMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UmlwcGxlQ29uZmlnLCBSaXBwbGVSZW5kZXJlcn0gZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuXG4vKiogUG9zc2libGUgc3RhdGVzIGZvciBhIHJpcHBsZSBlbGVtZW50LiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gUmlwcGxlU3RhdGUge1xuICBGQURJTkdfSU4sIFZJU0lCTEUsIEZBRElOR19PVVQsIEhJRERFTlxufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHByZXZpb3VzbHkgbGF1bmNoZWQgcmlwcGxlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZWYge1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSByaXBwbGUuICovXG4gIHN0YXRlOiBSaXBwbGVTdGF0ZSA9IFJpcHBsZVN0YXRlLkhJRERFTjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmlwcGxlUmVuZGVyZXIsXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIEhUTUwgZWxlbWVudC4gKi9cbiAgICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgLyoqIFJpcHBsZSBjb25maWd1cmF0aW9uIHVzZWQgZm9yIHRoZSByaXBwbGUuICovXG4gICAgcHVibGljIGNvbmZpZzogUmlwcGxlQ29uZmlnKSB7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IHRoZSByaXBwbGUgZWxlbWVudC4gKi9cbiAgZmFkZU91dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJlci5mYWRlT3V0UmlwcGxlKHRoaXMpO1xuICB9XG59XG4iXX0=