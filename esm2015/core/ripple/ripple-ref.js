/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Reference to a previously launched ripple element.
 */
export class RippleRef {
    constructor(_renderer, 
    /** Reference to the ripple HTML element. */
    element, 
    /** Ripple configuration used for the ripple. */
    config) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
        /** Current state of the ripple. */
        this.state = 3 /* HIDDEN */;
    }
    /** Fades out the ripple element. */
    fadeOut() {
        this._renderer.fadeOutRipple(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3JpcHBsZS9yaXBwbGUtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQVNIOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFLcEIsWUFDVSxTQUF5QjtJQUNqQyw0Q0FBNEM7SUFDckMsT0FBb0I7SUFDM0IsZ0RBQWdEO0lBQ3pDLE1BQW9CO1FBSm5CLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBRTFCLFlBQU8sR0FBUCxPQUFPLENBQWE7UUFFcEIsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQVI3QixtQ0FBbUM7UUFDbkMsVUFBSyxrQkFBbUM7SUFReEMsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxPQUFPO1FBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UmlwcGxlQ29uZmlnLCBSaXBwbGVSZW5kZXJlcn0gZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuXG4vKiogUG9zc2libGUgc3RhdGVzIGZvciBhIHJpcHBsZSBlbGVtZW50LiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gUmlwcGxlU3RhdGUge1xuICBGQURJTkdfSU4sIFZJU0lCTEUsIEZBRElOR19PVVQsIEhJRERFTlxufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHByZXZpb3VzbHkgbGF1bmNoZWQgcmlwcGxlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZWYge1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSByaXBwbGUuICovXG4gIHN0YXRlOiBSaXBwbGVTdGF0ZSA9IFJpcHBsZVN0YXRlLkhJRERFTjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmlwcGxlUmVuZGVyZXIsXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIEhUTUwgZWxlbWVudC4gKi9cbiAgICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgLyoqIFJpcHBsZSBjb25maWd1cmF0aW9uIHVzZWQgZm9yIHRoZSByaXBwbGUuICovXG4gICAgcHVibGljIGNvbmZpZzogUmlwcGxlQ29uZmlnKSB7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IHRoZSByaXBwbGUgZWxlbWVudC4gKi9cbiAgZmFkZU91dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJlci5mYWRlT3V0UmlwcGxlKHRoaXMpO1xuICB9XG59XG4iXX0=