/**
 * @fileoverview added by tsickle
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
 * @record
 */
export function CanColor() { }
if (false) {
    /**
     * Theme color palette for the component.
     * @type {?}
     */
    CanColor.prototype.color;
}
/**
 * \@docs-private
 * @record
 */
export function HasElementRef() { }
if (false) {
    /** @type {?} */
    HasElementRef.prototype._elementRef;
}
/**
 * Mixin to augment a directive with a `color` property.
 * @template T
 * @param {?} base
 * @param {?=} defaultColor
 * @return {?}
 */
export function mixinColor(base, defaultColor) {
    return class extends base {
        /**
         * @param {...?} args
         */
        constructor(...args) {
            super(...args);
            // Set the default color that can be specified from the mixin.
            this.color = defaultColor;
        }
        /**
         * @return {?}
         */
        get color() { return this._color; }
        /**
         * @param {?} value
         * @return {?}
         */
        set color(value) {
            /** @type {?} */
            const colorPalette = value || defaultColor;
            if (colorPalette !== this._color) {
                if (this._color) {
                    this._elementRef.nativeElement.classList.remove(`mat-${this._color}`);
                }
                if (colorPalette) {
                    this._elementRef.nativeElement.classList.add(`mat-${colorPalette}`);
                }
                this._color = colorPalette;
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQVlBLDhCQUdDOzs7Ozs7SUFEQyx5QkFBb0I7Ozs7OztBQU90QixtQ0FFQzs7O0lBREMsb0NBQXdCOzs7Ozs7Ozs7QUFPMUIsTUFBTSxVQUFVLFVBQVUsQ0FDdEIsSUFBTyxFQUFFLFlBQTJCO0lBQ3RDLE9BQU8sS0FBTSxTQUFRLElBQUk7Ozs7UUFtQnZCLFlBQVksR0FBRyxJQUFXO1lBQ3hCLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRWYsOERBQThEO1lBQzlELElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1FBQzVCLENBQUM7Ozs7UUFyQkQsSUFBSSxLQUFLLEtBQW1CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Ozs7O1FBQ2pELElBQUksS0FBSyxDQUFDLEtBQW1COztrQkFDckIsWUFBWSxHQUFHLEtBQUssSUFBSSxZQUFZO1lBRTFDLElBQUksWUFBWSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDZixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQ3ZFO2dCQUNELElBQUksWUFBWSxFQUFFO29CQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sWUFBWSxFQUFFLENBQUMsQ0FBQztpQkFDckU7Z0JBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7YUFDNUI7UUFDSCxDQUFDO0tBUUYsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25zdHJ1Y3Rvcn0gZnJvbSAnLi9jb25zdHJ1Y3Rvcic7XG5pbXBvcnQge0VsZW1lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGludGVyZmFjZSBDYW5Db2xvciB7XG4gIC8qKiBUaGVtZSBjb2xvciBwYWxldHRlIGZvciB0aGUgY29tcG9uZW50LiAqL1xuICBjb2xvcjogVGhlbWVQYWxldHRlO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IHR5cGUgQ2FuQ29sb3JDdG9yID0gQ29uc3RydWN0b3I8Q2FuQ29sb3I+O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGludGVyZmFjZSBIYXNFbGVtZW50UmVmIHtcbiAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG59XG5cbi8qKiBQb3NzaWJsZSBjb2xvciBwYWxldHRlIHZhbHVlcy4gKi9cbmV4cG9ydCB0eXBlIFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JyB8ICdhY2NlbnQnIHwgJ3dhcm4nIHwgdW5kZWZpbmVkO1xuXG4vKiogTWl4aW4gdG8gYXVnbWVudCBhIGRpcmVjdGl2ZSB3aXRoIGEgYGNvbG9yYCBwcm9wZXJ0eS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbkNvbG9yPFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIYXNFbGVtZW50UmVmPj4oXG4gICAgYmFzZTogVCwgZGVmYXVsdENvbG9yPzogVGhlbWVQYWxldHRlKTogQ2FuQ29sb3JDdG9yICYgVCB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2NvbG9yOyB9XG4gICAgc2V0IGNvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICAgIGNvbnN0IGNvbG9yUGFsZXR0ZSA9IHZhbHVlIHx8IGRlZmF1bHRDb2xvcjtcblxuICAgICAgaWYgKGNvbG9yUGFsZXR0ZSAhPT0gdGhpcy5fY29sb3IpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbG9yKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYG1hdC0ke3RoaXMuX2NvbG9yfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xvclBhbGV0dGUpIHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LSR7Y29sb3JQYWxldHRlfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29sb3IgPSBjb2xvclBhbGV0dGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgICAvLyBTZXQgdGhlIGRlZmF1bHQgY29sb3IgdGhhdCBjYW4gYmUgc3BlY2lmaWVkIGZyb20gdGhlIG1peGluLlxuICAgICAgdGhpcy5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICB9XG4gIH07XG59XG5cbiJdfQ==