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
var RippleRef = /** @class */ (function () {
    function RippleRef(_renderer, 
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
    RippleRef.prototype.fadeOut = function () {
        this._renderer.fadeOutRipple(this);
    };
    return RippleRef;
}());
export { RippleRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3JpcHBsZS9yaXBwbGUtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQVNIOztHQUVHO0FBQ0g7SUFLRSxtQkFDVSxTQUF5QjtJQUNqQyw0Q0FBNEM7SUFDckMsT0FBb0I7SUFDM0IsZ0RBQWdEO0lBQ3pDLE1BQW9CO1FBSm5CLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBRTFCLFlBQU8sR0FBUCxPQUFPLENBQWE7UUFFcEIsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQVI3QixtQ0FBbUM7UUFDbkMsVUFBSyxrQkFBbUM7SUFReEMsQ0FBQztJQUVELG9DQUFvQztJQUNwQywyQkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1JpcHBsZUNvbmZpZywgUmlwcGxlUmVuZGVyZXJ9IGZyb20gJy4vcmlwcGxlLXJlbmRlcmVyJztcblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBmb3IgYSByaXBwbGUgZWxlbWVudC4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFJpcHBsZVN0YXRlIHtcbiAgRkFESU5HX0lOLCBWSVNJQkxFLCBGQURJTkdfT1VULCBISURERU5cbn1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSBwcmV2aW91c2x5IGxhdW5jaGVkIHJpcHBsZSBlbGVtZW50LlxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVmIHtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcmlwcGxlLiAqL1xuICBzdGF0ZTogUmlwcGxlU3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyLFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBIVE1MIGVsZW1lbnQuICovXG4gICAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIC8qKiBSaXBwbGUgY29uZmlndXJhdGlvbiB1c2VkIGZvciB0aGUgcmlwcGxlLiAqL1xuICAgIHB1YmxpYyBjb25maWc6IFJpcHBsZUNvbmZpZykge1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCB0aGUgcmlwcGxlIGVsZW1lbnQuICovXG4gIGZhZGVPdXQoKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuZmFkZU91dFJpcHBsZSh0aGlzKTtcbiAgfVxufVxuIl19