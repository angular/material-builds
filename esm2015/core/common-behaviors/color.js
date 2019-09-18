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
        /**
         * @param {...?} args
         */
        constructor(...args) {
            super(...args);
            // Set the default color that can be specified from the mixin.
            this.color = defaultColor;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQVlBLDhCQUdDOzs7Ozs7SUFEQyx5QkFBb0I7Ozs7OztBQU90QixtQ0FFQzs7O0lBREMsb0NBQXdCOzs7Ozs7Ozs7QUFPMUIsTUFBTSxVQUFVLFVBQVUsQ0FDdEIsSUFBTyxFQUFFLFlBQTJCO0lBQ3RDLE9BQU8sS0FBTSxTQUFRLElBQUk7Ozs7UUFHdkIsSUFBSSxLQUFLLEtBQW1CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Ozs7O1FBQ2pELElBQUksS0FBSyxDQUFDLEtBQW1COztrQkFDckIsWUFBWSxHQUFHLEtBQUssSUFBSSxZQUFZO1lBRTFDLElBQUksWUFBWSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDZixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQ3ZFO2dCQUNELElBQUksWUFBWSxFQUFFO29CQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sWUFBWSxFQUFFLENBQUMsQ0FBQztpQkFDckU7Z0JBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7YUFDNUI7UUFDSCxDQUFDOzs7O1FBRUQsWUFBWSxHQUFHLElBQVc7WUFDeEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFFZiw4REFBOEQ7WUFDOUQsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7UUFDNUIsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RydWN0b3J9IGZyb20gJy4vY29uc3RydWN0b3InO1xuaW1wb3J0IHtFbGVtZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FuQ29sb3Ige1xuICAvKiogVGhlbWUgY29sb3IgcGFsZXR0ZSBmb3IgdGhlIGNvbXBvbmVudC4gKi9cbiAgY29sb3I6IFRoZW1lUGFsZXR0ZTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCB0eXBlIENhbkNvbG9yQ3RvciA9IENvbnN0cnVjdG9yPENhbkNvbG9yPjtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGFzRWxlbWVudFJlZiB7XG4gIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmO1xufVxuXG4vKiogUG9zc2libGUgY29sb3IgcGFsZXR0ZSB2YWx1ZXMuICovXG5leHBvcnQgdHlwZSBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeScgfCAnYWNjZW50JyB8ICd3YXJuJyB8IHVuZGVmaW5lZDtcblxuLyoqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCBhIGBjb2xvcmAgcHJvcGVydHkuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5Db2xvcjxUIGV4dGVuZHMgQ29uc3RydWN0b3I8SGFzRWxlbWVudFJlZj4+KFxuICAgIGJhc2U6IFQsIGRlZmF1bHRDb2xvcj86IFRoZW1lUGFsZXR0ZSk6IENhbkNvbG9yQ3RvciAmIFQge1xuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBiYXNlIHtcbiAgICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gICAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9jb2xvcjsgfVxuICAgIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgICBjb25zdCBjb2xvclBhbGV0dGUgPSB2YWx1ZSB8fCBkZWZhdWx0Q29sb3I7XG5cbiAgICAgIGlmIChjb2xvclBhbGV0dGUgIT09IHRoaXMuX2NvbG9yKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb2xvcikge1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGBtYXQtJHt0aGlzLl9jb2xvcn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sb3JQYWxldHRlKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC0ke2NvbG9yUGFsZXR0ZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvbG9yID0gY29sb3JQYWxldHRlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcblxuICAgICAgLy8gU2V0IHRoZSBkZWZhdWx0IGNvbG9yIHRoYXQgY2FuIGJlIHNwZWNpZmllZCBmcm9tIHRoZSBtaXhpbi5cbiAgICAgIHRoaXMuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgfVxuICB9O1xufVxuXG4iXX0=