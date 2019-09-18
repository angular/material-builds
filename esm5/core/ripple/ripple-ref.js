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
        this.state = RippleState.HIDDEN;
    }
    /** Fades out the ripple element. */
    RippleRef.prototype.fadeOut = function () {
        this._renderer.fadeOutRipple(this);
    };
    return RippleRef;
}());
export { RippleRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3JpcHBsZS9yaXBwbGUtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILDRDQUE0QztBQUM1QyxNQUFNLENBQU4sSUFBWSxXQUVYO0FBRkQsV0FBWSxXQUFXO0lBQ3JCLHVEQUFTLENBQUE7SUFBRSxtREFBTyxDQUFBO0lBQUUseURBQVUsQ0FBQTtJQUFFLGlEQUFNLENBQUE7QUFDeEMsQ0FBQyxFQUZXLFdBQVcsS0FBWCxXQUFXLFFBRXRCO0FBRUQ7O0dBRUc7QUFDSDtJQUtFLG1CQUNVLFNBQXlCO0lBQ2pDLDRDQUE0QztJQUNyQyxPQUFvQjtJQUMzQixnREFBZ0Q7SUFDekMsTUFBb0I7UUFKbkIsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7UUFFMUIsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUVwQixXQUFNLEdBQU4sTUFBTSxDQUFjO1FBUjdCLG1DQUFtQztRQUNuQyxVQUFLLEdBQWdCLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFReEMsQ0FBQztJQUVELG9DQUFvQztJQUNwQywyQkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1JpcHBsZUNvbmZpZywgUmlwcGxlUmVuZGVyZXJ9IGZyb20gJy4vcmlwcGxlLXJlbmRlcmVyJztcblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBmb3IgYSByaXBwbGUgZWxlbWVudC4gKi9cbmV4cG9ydCBlbnVtIFJpcHBsZVN0YXRlIHtcbiAgRkFESU5HX0lOLCBWSVNJQkxFLCBGQURJTkdfT1VULCBISURERU5cbn1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSBwcmV2aW91c2x5IGxhdW5jaGVkIHJpcHBsZSBlbGVtZW50LlxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVmIHtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcmlwcGxlLiAqL1xuICBzdGF0ZTogUmlwcGxlU3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyLFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBIVE1MIGVsZW1lbnQuICovXG4gICAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIC8qKiBSaXBwbGUgY29uZmlndXJhdGlvbiB1c2VkIGZvciB0aGUgcmlwcGxlLiAqL1xuICAgIHB1YmxpYyBjb25maWc6IFJpcHBsZUNvbmZpZykge1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCB0aGUgcmlwcGxlIGVsZW1lbnQuICovXG4gIGZhZGVPdXQoKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuZmFkZU91dFJpcHBsZSh0aGlzKTtcbiAgfVxufVxuIl19