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
import { Subject } from 'rxjs';
/**
 * \@docs-private
 * @record
 */
export function CanUpdateErrorState() { }
if (false) {
    /** @type {?} */
    CanUpdateErrorState.prototype.stateChanges;
    /** @type {?} */
    CanUpdateErrorState.prototype.errorState;
    /** @type {?} */
    CanUpdateErrorState.prototype.errorStateMatcher;
    /**
     * @return {?}
     */
    CanUpdateErrorState.prototype.updateErrorState = function () { };
}
/**
 * \@docs-private
 * @record
 */
export function HasErrorState() { }
if (false) {
    /** @type {?} */
    HasErrorState.prototype._parentFormGroup;
    /** @type {?} */
    HasErrorState.prototype._parentForm;
    /** @type {?} */
    HasErrorState.prototype._defaultErrorStateMatcher;
    /** @type {?} */
    HasErrorState.prototype.ngControl;
}
/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 * @template T
 * @param {?} base
 * @return {?}
 */
export function mixinErrorState(base) {
    return class extends base {
        /**
         * @param {...?} args
         */
        constructor(...args) {
            super(...args);
            /**
             * Whether the component is in an error state.
             */
            this.errorState = false;
            /**
             * Stream that emits whenever the state of the input changes such that the wrapping
             * `MatFormField` needs to run change detection.
             */
            this.stateChanges = new Subject();
        }
        /**
         * @return {?}
         */
        updateErrorState() {
            /** @type {?} */
            const oldState = this.errorState;
            /** @type {?} */
            const parent = this._parentFormGroup || this._parentForm;
            /** @type {?} */
            const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
            /** @type {?} */
            const control = this.ngControl ? (/** @type {?} */ (this.ngControl.control)) : null;
            /** @type {?} */
            const newState = matcher.isErrorState(control, parent);
            if (newState !== oldState) {
                this.errorState = newState;
                this.stateChanges.next();
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3Itc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2Vycm9yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBU0EsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFNN0IseUNBS0M7OztJQUhDLDJDQUFxQzs7SUFDckMseUNBQW9COztJQUNwQixnREFBcUM7Ozs7SUFIckMsaUVBQXlCOzs7Ozs7QUFVM0IsbUNBS0M7OztJQUpDLHlDQUFxQzs7SUFDckMsb0NBQW9COztJQUNwQixrREFBNkM7O0lBQzdDLGtDQUFxQjs7Ozs7Ozs7O0FBT3ZCLE1BQU0sVUFBVSxlQUFlLENBQXVDLElBQU87SUFFM0UsT0FBTyxLQUFNLFNBQVEsSUFBSTs7OztRQXlCdkIsWUFBWSxHQUFHLElBQVc7WUFDeEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Ozs7WUF4QmpCLGVBQVUsR0FBWSxLQUFLLENBQUM7Ozs7O1lBTW5CLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQW1CNUMsQ0FBQzs7OztRQWZELGdCQUFnQjs7a0JBQ1IsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVOztrQkFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsV0FBVzs7a0JBQ2xELE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLHlCQUF5Qjs7a0JBQ2xFLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJOztrQkFDdkUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUV0RCxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO2dCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzFCO1FBQ0gsQ0FBQztLQUtGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9ybUNvbnRyb2wsIEZvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyfSBmcm9tICcuLi9lcnJvci9lcnJvci1vcHRpb25zJztcbmltcG9ydCB7Q29uc3RydWN0b3J9IGZyb20gJy4vY29uc3RydWN0b3InO1xuXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgaW50ZXJmYWNlIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICB1cGRhdGVFcnJvclN0YXRlKCk6IHZvaWQ7XG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPjtcbiAgZXJyb3JTdGF0ZTogYm9vbGVhbjtcbiAgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IHR5cGUgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgPSBDb25zdHJ1Y3RvcjxDYW5VcGRhdGVFcnJvclN0YXRlPjtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGFzRXJyb3JTdGF0ZSB7XG4gIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZTtcbiAgX3BhcmVudEZvcm06IE5nRm9ybTtcbiAgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG4gIG5nQ29udHJvbDogTmdDb250cm9sO1xufVxuXG4vKipcbiAqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCB1cGRhdGVFcnJvclN0YXRlIG1ldGhvZC5cbiAqIEZvciBjb21wb25lbnQgd2l0aCBgZXJyb3JTdGF0ZWAgYW5kIG5lZWQgdG8gdXBkYXRlIGBlcnJvclN0YXRlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluRXJyb3JTdGF0ZTxUIGV4dGVuZHMgQ29uc3RydWN0b3I8SGFzRXJyb3JTdGF0ZT4+KGJhc2U6IFQpXG46IENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgVCB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgaW4gYW4gZXJyb3Igc3RhdGUuICovXG4gICAgZXJyb3JTdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZSBpbnB1dCBjaGFuZ2VzIHN1Y2ggdGhhdCB0aGUgd3JhcHBpbmdcbiAgICAgKiBgTWF0Rm9ybUZpZWxkYCBuZWVkcyB0byBydW4gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKi9cbiAgICByZWFkb25seSBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gICAgdXBkYXRlRXJyb3JTdGF0ZSgpIHtcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5lcnJvclN0YXRlO1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50Rm9ybUdyb3VwIHx8IHRoaXMuX3BhcmVudEZvcm07XG4gICAgICBjb25zdCBtYXRjaGVyID0gdGhpcy5lcnJvclN0YXRlTWF0Y2hlciB8fCB0aGlzLl9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI7XG4gICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC5jb250cm9sIGFzIEZvcm1Db250cm9sIDogbnVsbDtcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gbWF0Y2hlci5pc0Vycm9yU3RhdGUoY29udHJvbCwgcGFyZW50KTtcblxuICAgICAgaWYgKG5ld1N0YXRlICE9PSBvbGRTdGF0ZSkge1xuICAgICAgICB0aGlzLmVycm9yU3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG4gIH07XG59XG4iXX0=