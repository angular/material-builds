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
RippleState[RippleState.FADING_IN] = 'FADING_IN';
RippleState[RippleState.VISIBLE] = 'VISIBLE';
RippleState[RippleState.FADING_OUT] = 'FADING_OUT';
RippleState[RippleState.HIDDEN] = 'HIDDEN';
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
        this.state = RippleState.HIDDEN;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3JpcHBsZS9yaXBwbGUtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFXQSxNQUFZLFdBQVc7SUFDckIsU0FBUyxHQUFBLEVBQUUsT0FBTyxHQUFBLEVBQUUsVUFBVSxHQUFBLEVBQUUsTUFBTSxHQUFBO0VBQ3ZDOzs7Ozs7Ozs7QUFLRCxNQUFNLE9BQU8sU0FBUzs7Ozs7O0lBS3BCLFlBQ1UsU0FBeUIsRUFFMUIsT0FBb0IsRUFFcEIsTUFBb0I7UUFKbkIsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7UUFFMUIsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUVwQixXQUFNLEdBQU4sTUFBTSxDQUFjOzs7O1FBUDdCLFVBQUssR0FBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQVF4QyxDQUFDOzs7OztJQUdELE9BQU87UUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Y7Ozs7OztJQWRDLDBCQUF3Qzs7Ozs7SUFHdEMsOEJBQWlDOzs7OztJQUVqQyw0QkFBMkI7Ozs7O0lBRTNCLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1JpcHBsZUNvbmZpZywgUmlwcGxlUmVuZGVyZXJ9IGZyb20gJy4vcmlwcGxlLXJlbmRlcmVyJztcblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBmb3IgYSByaXBwbGUgZWxlbWVudC4gKi9cbmV4cG9ydCBlbnVtIFJpcHBsZVN0YXRlIHtcbiAgRkFESU5HX0lOLCBWSVNJQkxFLCBGQURJTkdfT1VULCBISURERU5cbn1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSBwcmV2aW91c2x5IGxhdW5jaGVkIHJpcHBsZSBlbGVtZW50LlxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVmIHtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcmlwcGxlLiAqL1xuICBzdGF0ZTogUmlwcGxlU3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyLFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBIVE1MIGVsZW1lbnQuICovXG4gICAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIC8qKiBSaXBwbGUgY29uZmlndXJhdGlvbiB1c2VkIGZvciB0aGUgcmlwcGxlLiAqL1xuICAgIHB1YmxpYyBjb25maWc6IFJpcHBsZUNvbmZpZykge1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCB0aGUgcmlwcGxlIGVsZW1lbnQuICovXG4gIGZhZGVPdXQoKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuZmFkZU91dFJpcHBsZSh0aGlzKTtcbiAgfVxufVxuIl19