/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty } from '@angular/cdk/coercion';
export function mixinTabIndex(base, defaultTabIndex = 0) {
    return class extends base {
        constructor(...args) {
            super(...args);
            this._tabIndex = defaultTabIndex;
            this.defaultTabIndex = defaultTabIndex;
        }
        get tabIndex() { return this.disabled ? -1 : this._tabIndex; }
        set tabIndex(value) {
            // If the specified tabIndex value is null or undefined, fall back to the default value.
            this._tabIndex = value != null ? coerceNumberProperty(value) : this.defaultTabIndex;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL3RhYmluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBd0IzRCxNQUFNLFVBQVUsYUFBYSxDQUMzQixJQUFPLEVBQUUsZUFBZSxHQUFHLENBQUM7SUFDNUIsT0FBTyxLQUFNLFNBQVEsSUFBSTtRQVV2QixZQUFZLEdBQUcsSUFBVztZQUN4QixLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQVZULGNBQVMsR0FBVyxlQUFlLENBQUM7WUFDNUMsb0JBQWUsR0FBRyxlQUFlLENBQUM7UUFVbEMsQ0FBQztRQVJELElBQUksUUFBUSxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksUUFBUSxDQUFDLEtBQWE7WUFDeEIsd0ZBQXdGO1lBQ3hGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDdEYsQ0FBQztLQUtGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbnN0cnVjdG9yLCBBYnN0cmFjdENvbnN0cnVjdG9yfSBmcm9tICcuL2NvbnN0cnVjdG9yJztcbmltcG9ydCB7Q2FuRGlzYWJsZX0gZnJvbSAnLi9kaXNhYmxlZCc7XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGFzVGFiSW5kZXgge1xuICAvKiogVGFiaW5kZXggb2YgdGhlIGNvbXBvbmVudC4gKi9cbiAgdGFiSW5kZXg6IG51bWJlcjtcblxuICAvKiogVGFiaW5kZXggdG8gd2hpY2ggdG8gZmFsbCBiYWNrIHRvIGlmIG5vIHZhbHVlIGlzIHNldC4gKi9cbiAgZGVmYXVsdFRhYkluZGV4OiBudW1iZXI7XG59XG5cbi8qKlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIG5lY2Vzc2FyeSB0byBhcHBseSB0byBtaXhpbiBjbGFzc2VzLiBUbyBiZSBtYWRlIHByaXZhdGUuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDEzLjAuMFxuICovXG5leHBvcnQgdHlwZSBIYXNUYWJJbmRleEN0b3IgPSBDb25zdHJ1Y3RvcjxIYXNUYWJJbmRleD4gJiBBYnN0cmFjdENvbnN0cnVjdG9yPEhhc1RhYkluZGV4PjtcblxuLyoqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCBhIGB0YWJJbmRleGAgcHJvcGVydHkuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5UYWJJbmRleDxUIGV4dGVuZHMgQWJzdHJhY3RDb25zdHJ1Y3RvcjxDYW5EaXNhYmxlPj4oYmFzZTogVCxcbiAgZGVmYXVsdFRhYkluZGV4PzogbnVtYmVyKTogSGFzVGFiSW5kZXhDdG9yICYgVDtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpblRhYkluZGV4PFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDYW5EaXNhYmxlPj4oXG4gIGJhc2U6IFQsIGRlZmF1bHRUYWJJbmRleCA9IDApOiBIYXNUYWJJbmRleEN0b3IgJiBUIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSBpbXBsZW1lbnRzIEhhc1RhYkluZGV4IHtcbiAgICBwcml2YXRlIF90YWJJbmRleDogbnVtYmVyID0gZGVmYXVsdFRhYkluZGV4O1xuICAgIGRlZmF1bHRUYWJJbmRleCA9IGRlZmF1bHRUYWJJbmRleDtcblxuICAgIGdldCB0YWJJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IC0xIDogdGhpcy5fdGFiSW5kZXg7IH1cbiAgICBzZXQgdGFiSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgICAgLy8gSWYgdGhlIHNwZWNpZmllZCB0YWJJbmRleCB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZSAhPSBudWxsID8gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpIDogdGhpcy5kZWZhdWx0VGFiSW5kZXg7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==