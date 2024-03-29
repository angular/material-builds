/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Possible states for a ripple element. */
export var RippleState;
(function (RippleState) {
    RippleState[RippleState["FADING_IN"] = 0] = "FADING_IN";
    RippleState[RippleState["VISIBLE"] = 1] = "VISIBLE";
    RippleState[RippleState["FADING_OUT"] = 2] = "FADING_OUT";
    RippleState[RippleState["HIDDEN"] = 3] = "HIDDEN";
})(RippleState || (RippleState = {}));
/**
 * Reference to a previously launched ripple element.
 */
export class RippleRef {
    constructor(_renderer, 
    /** Reference to the ripple HTML element. */
    element, 
    /** Ripple configuration used for the ripple. */
    config, 
    /* Whether animations are forcibly disabled for ripples through CSS. */
    _animationForciblyDisabledThroughCss = false) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
        this._animationForciblyDisabledThroughCss = _animationForciblyDisabledThroughCss;
        /** Current state of the ripple. */
        this.state = RippleState.HIDDEN;
    }
    /** Fades out the ripple element. */
    fadeOut() {
        this._renderer.fadeOutRipple(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3JpcHBsZS9yaXBwbGUtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILDRDQUE0QztBQUM1QyxNQUFNLENBQU4sSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3JCLHVEQUFTLENBQUE7SUFDVCxtREFBTyxDQUFBO0lBQ1AseURBQVUsQ0FBQTtJQUNWLGlEQUFNLENBQUE7QUFDUixDQUFDLEVBTFcsV0FBVyxLQUFYLFdBQVcsUUFLdEI7QUFzQkQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQUlwQixZQUNVLFNBQWdEO0lBQ3hELDRDQUE0QztJQUNyQyxPQUFvQjtJQUMzQixnREFBZ0Q7SUFDekMsTUFBb0I7SUFDM0IsdUVBQXVFO0lBQ2hFLHVDQUF1QyxLQUFLO1FBTjNDLGNBQVMsR0FBVCxTQUFTLENBQXVDO1FBRWpELFlBQU8sR0FBUCxPQUFPLENBQWE7UUFFcEIsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQUVwQix5Q0FBb0MsR0FBcEMsb0NBQW9DLENBQVE7UUFWckQsbUNBQW1DO1FBQ25DLFVBQUssR0FBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQVVyQyxDQUFDO0lBRUosb0NBQW9DO0lBQ3BDLE9BQU87UUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBmb3IgYSByaXBwbGUgZWxlbWVudC4gKi9cbmV4cG9ydCBlbnVtIFJpcHBsZVN0YXRlIHtcbiAgRkFESU5HX0lOLFxuICBWSVNJQkxFLFxuICBGQURJTkdfT1VULFxuICBISURERU4sXG59XG5cbmV4cG9ydCB0eXBlIFJpcHBsZUNvbmZpZyA9IHtcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGNlbnRlcmVkPzogYm9vbGVhbjtcbiAgcmFkaXVzPzogbnVtYmVyO1xuICBwZXJzaXN0ZW50PzogYm9vbGVhbjtcbiAgYW5pbWF0aW9uPzogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuICB0ZXJtaW5hdGVPblBvaW50ZXJVcD86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIGFuaW1hdGlvbiBvZiBhIHJpcHBsZS5cbiAqIFRoZXJlIGFyZSB0d28gYW5pbWF0aW9uIHBoYXNlcyB3aXRoIGRpZmZlcmVudCBkdXJhdGlvbnMgZm9yIHRoZSByaXBwbGVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUFuaW1hdGlvbkNvbmZpZyB7XG4gIC8qKiBEdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBlbnRlciBhbmltYXRpb24gKGV4cGFuc2lvbiBmcm9tIHBvaW50IG9mIGNvbnRhY3QpLiAqL1xuICBlbnRlckR1cmF0aW9uPzogbnVtYmVyO1xuICAvKiogRHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgZXhpdCBhbmltYXRpb24gKGZhZGUtb3V0KS4gKi9cbiAgZXhpdER1cmF0aW9uPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHByZXZpb3VzbHkgbGF1bmNoZWQgcmlwcGxlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZWYge1xuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcmlwcGxlLiAqL1xuICBzdGF0ZTogUmlwcGxlU3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IHtmYWRlT3V0UmlwcGxlKHJlZjogUmlwcGxlUmVmKTogdm9pZH0sXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIEhUTUwgZWxlbWVudC4gKi9cbiAgICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgLyoqIFJpcHBsZSBjb25maWd1cmF0aW9uIHVzZWQgZm9yIHRoZSByaXBwbGUuICovXG4gICAgcHVibGljIGNvbmZpZzogUmlwcGxlQ29uZmlnLFxuICAgIC8qIFdoZXRoZXIgYW5pbWF0aW9ucyBhcmUgZm9yY2libHkgZGlzYWJsZWQgZm9yIHJpcHBsZXMgdGhyb3VnaCBDU1MuICovXG4gICAgcHVibGljIF9hbmltYXRpb25Gb3JjaWJseURpc2FibGVkVGhyb3VnaENzcyA9IGZhbHNlLFxuICApIHt9XG5cbiAgLyoqIEZhZGVzIG91dCB0aGUgcmlwcGxlIGVsZW1lbnQuICovXG4gIGZhZGVPdXQoKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuZmFkZU91dFJpcHBsZSh0aGlzKTtcbiAgfVxufVxuIl19