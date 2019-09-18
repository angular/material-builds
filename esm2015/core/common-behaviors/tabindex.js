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
export function HasTabIndex() { }
if (false) {
    /**
     * Tabindex of the component.
     * @type {?}
     */
    HasTabIndex.prototype.tabIndex;
}
/**
 * Mixin to augment a directive with a `tabIndex` property.
 * @template T
 * @param {?} base
 * @param {?=} defaultTabIndex
 * @return {?}
 */
export function mixinTabIndex(base, defaultTabIndex = 0) {
    return class extends base {
        /**
         * @param {...?} args
         */
        constructor(...args) {
            super(...args);
            this._tabIndex = defaultTabIndex;
        }
        /**
         * @return {?}
         */
        get tabIndex() { return this.disabled ? -1 : this._tabIndex; }
        /**
         * @param {?} value
         * @return {?}
         */
        set tabIndex(value) {
            // If the specified tabIndex value is null or undefined, fall back to the default value.
            this._tabIndex = value != null ? value : defaultTabIndex;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL3RhYmluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWFBLGlDQUdDOzs7Ozs7SUFEQywrQkFBaUI7Ozs7Ozs7OztBQU9uQixNQUFNLFVBQVUsYUFBYSxDQUFvQyxJQUFPLEVBQUUsZUFBZSxHQUFHLENBQUM7SUFFM0YsT0FBTyxLQUFNLFNBQVEsSUFBSTs7OztRQVN2QixZQUFZLEdBQUcsSUFBVztZQUN4QixLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQVRULGNBQVMsR0FBVyxlQUFlLENBQUM7UUFVNUMsQ0FBQzs7OztRQVJELElBQUksUUFBUSxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7OztRQUN0RSxJQUFJLFFBQVEsQ0FBQyxLQUFhO1lBQ3hCLHdGQUF3RjtZQUN4RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBQzNELENBQUM7S0FLRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnN0cnVjdG9yfSBmcm9tICcuL2NvbnN0cnVjdG9yJztcbmltcG9ydCB7Q2FuRGlzYWJsZX0gZnJvbSAnLi9kaXNhYmxlZCc7XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGFzVGFiSW5kZXgge1xuICAvKiogVGFiaW5kZXggb2YgdGhlIGNvbXBvbmVudC4gKi9cbiAgdGFiSW5kZXg6IG51bWJlcjtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCB0eXBlIEhhc1RhYkluZGV4Q3RvciA9IENvbnN0cnVjdG9yPEhhc1RhYkluZGV4PjtcblxuLyoqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCBhIGB0YWJJbmRleGAgcHJvcGVydHkuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5UYWJJbmRleDxUIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2FuRGlzYWJsZT4+KGJhc2U6IFQsIGRlZmF1bHRUYWJJbmRleCA9IDApXG4gICAgOiBIYXNUYWJJbmRleEN0b3IgJiBUIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSB7XG4gICAgcHJpdmF0ZSBfdGFiSW5kZXg6IG51bWJlciA9IGRlZmF1bHRUYWJJbmRleDtcblxuICAgIGdldCB0YWJJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IC0xIDogdGhpcy5fdGFiSW5kZXg7IH1cbiAgICBzZXQgdGFiSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgICAgLy8gSWYgdGhlIHNwZWNpZmllZCB0YWJJbmRleCB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiBkZWZhdWx0VGFiSW5kZXg7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==