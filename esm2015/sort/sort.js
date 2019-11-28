/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, EventEmitter, Input, isDevMode, Output, } from '@angular/core';
import { mixinDisabled, mixinInitialized, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError, } from './sort-errors';
/**
 * Interface for a directive that holds sorting state consumed by `MatSortHeader`.
 * @record
 */
export function MatSortable() { }
if (false) {
    /**
     * The id of the column being sorted.
     * @type {?}
     */
    MatSortable.prototype.id;
    /**
     * Starting sort direction.
     * @type {?}
     */
    MatSortable.prototype.start;
    /**
     * Whether to disable clearing the sorting state.
     * @type {?}
     */
    MatSortable.prototype.disableClear;
}
/**
 * The current sort state.
 * @record
 */
export function Sort() { }
if (false) {
    /**
     * The id of the column being sorted.
     * @type {?}
     */
    Sort.prototype.active;
    /**
     * The sort direction.
     * @type {?}
     */
    Sort.prototype.direction;
}
// Boilerplate for applying mixins to MatSort.
/**
 * \@docs-private
 */
class MatSortBase {
}
/** @type {?} */
const _MatSortMixinBase = mixinInitialized(mixinDisabled(MatSortBase));
/**
 * Container for MatSortables to manage the sort state and provide default sort parameters.
 */
export class MatSort extends _MatSortMixinBase {
    constructor() {
        super(...arguments);
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * Used to notify any child components listening to state changes.
         */
        this._stateChanges = new Subject();
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the MatSortable's sort start.
         */
        this.start = 'asc';
        this._direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.sortChange = new EventEmitter();
    }
    /**
     * The sort direction of the currently active MatSortable.
     * @return {?}
     */
    get direction() { return this._direction; }
    /**
     * @param {?} direction
     * @return {?}
     */
    set direction(direction) {
        if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    register(sortable) {
        if (!sortable.id) {
            throw getSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getSortDuplicateSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    }
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    deregister(sortable) {
        this.sortables.delete(sortable.id);
    }
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    sort(sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.sortChange.emit({ active: this.active, direction: this.direction });
    }
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    getNextSortDirection(sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        /** @type {?} */
        const disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        /** @type {?} */
        let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        /** @type {?} */
        let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._markInitialized();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this._stateChanges.next();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.complete();
    }
}
MatSort.decorators = [
    { type: Directive, args: [{
                selector: '[matSort]',
                exportAs: 'matSort',
                inputs: ['disabled: matSortDisabled']
            },] }
];
MatSort.propDecorators = {
    active: [{ type: Input, args: ['matSortActive',] }],
    start: [{ type: Input, args: ['matSortStart',] }],
    direction: [{ type: Input, args: ['matSortDirection',] }],
    disableClear: [{ type: Input, args: ['matSortDisableClear',] }],
    sortChange: [{ type: Output, args: ['matSortChange',] }]
};
if (false) {
    /** @type {?} */
    MatSort.ngAcceptInputType_disableClear;
    /** @type {?} */
    MatSort.ngAcceptInputType_disabled;
    /**
     * Collection of all registered sortables that this directive manages.
     * @type {?}
     */
    MatSort.prototype.sortables;
    /**
     * Used to notify any child components listening to state changes.
     * @type {?}
     */
    MatSort.prototype._stateChanges;
    /**
     * The id of the most recently sorted MatSortable.
     * @type {?}
     */
    MatSort.prototype.active;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overriden by the MatSortable's sort start.
     * @type {?}
     */
    MatSort.prototype.start;
    /**
     * @type {?}
     * @private
     */
    MatSort.prototype._direction;
    /**
     * @type {?}
     * @private
     */
    MatSort.prototype._disableClear;
    /**
     * Event emitted when the user changes either the active sort or sort direction.
     * @type {?}
     */
    MatSort.prototype.sortChange;
}
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    /** @type {?} */
    let sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLFNBQVMsRUFJVCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUtMLGFBQWEsRUFDYixnQkFBZ0IsR0FDakIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTdCLE9BQU8sRUFDTCwrQkFBK0IsRUFDL0IsMkJBQTJCLEVBQzNCLDRCQUE0QixHQUM3QixNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFHdkIsaUNBU0M7Ozs7OztJQVBDLHlCQUFXOzs7OztJQUdYLDRCQUFzQjs7Ozs7SUFHdEIsbUNBQXNCOzs7Ozs7QUFJeEIsMEJBTUM7Ozs7OztJQUpDLHNCQUFlOzs7OztJQUdmLHlCQUF5Qjs7Ozs7O0FBSzNCLE1BQU0sV0FBVztDQUFHOztNQUNkLGlCQUFpQixHQUNuQixnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7QUFRaEQsTUFBTSxPQUFPLE9BQVEsU0FBUSxpQkFBaUI7SUFMOUM7Ozs7O1FBUUUsY0FBUyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDOzs7O1FBR2xDLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7Ozs7UUFTdEIsVUFBSyxHQUFtQixLQUFLLENBQUM7UUFXN0MsZUFBVSxHQUFrQixFQUFFLENBQUM7Ozs7UUFZTCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7SUFpRTlGLENBQUM7Ozs7O0lBckZDLElBQ0ksU0FBUyxLQUFvQixPQUFPLElBQUksQ0FBQyxV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Q0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7O1lBeEdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE1BQU0sRUFBRSxDQUFDLDJCQUEyQixDQUFDO2FBQ3RDOzs7cUJBVUUsS0FBSyxTQUFDLGVBQWU7b0JBTXJCLEtBQUssU0FBQyxjQUFjO3dCQUdwQixLQUFLLFNBQUMsa0JBQWtCOzJCQWN4QixLQUFLLFNBQUMscUJBQXFCO3lCQU0zQixNQUFNLFNBQUMsZUFBZTs7OztJQStEdkIsdUNBQTJFOztJQUMzRSxtQ0FBdUU7Ozs7O0lBbkd2RSw0QkFBMkM7Ozs7O0lBRzNDLGdDQUE2Qzs7Ozs7SUFHN0MseUJBQXVDOzs7Ozs7SUFNdkMsd0JBQXFEOzs7OztJQVdyRCw2QkFBdUM7Ozs7O0lBU3ZDLGdDQUErQjs7Ozs7SUFHL0IsNkJBQTRGOzs7Ozs7OztBQW9FOUYsU0FBUyxxQkFBcUIsQ0FBQyxLQUFxQixFQUNyQixZQUFxQjs7UUFDOUMsU0FBUyxHQUFvQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7SUFDaEQsSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO1FBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDN0MsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FBRTtJQUUxQyxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBpc0Rldk1vZGUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgSGFzSW5pdGlhbGl6ZWQsXG4gIEhhc0luaXRpYWxpemVkQ3RvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5Jbml0aWFsaXplZCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7XG4gIGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3IsXG4gIGdldFNvcnRIZWFkZXJNaXNzaW5nSWRFcnJvcixcbiAgZ2V0U29ydEludmFsaWREaXJlY3Rpb25FcnJvcixcbn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5cbi8qKiBJbnRlcmZhY2UgZm9yIGEgZGlyZWN0aXZlIHRoYXQgaG9sZHMgc29ydGluZyBzdGF0ZSBjb25zdW1lZCBieSBgTWF0U29ydEhlYWRlcmAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNvcnRhYmxlIHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgaWQ6IHN0cmluZztcblxuICAvKiogU3RhcnRpbmcgc29ydCBkaXJlY3Rpb24uICovXG4gIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJztcblxuICAvKiogV2hldGhlciB0byBkaXNhYmxlIGNsZWFyaW5nIHRoZSBzb3J0aW5nIHN0YXRlLiAqL1xuICBkaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG59XG5cbi8qKiBUaGUgY3VycmVudCBzb3J0IHN0YXRlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3J0IHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNvcnQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U29ydEJhc2Uge31cbmNvbnN0IF9NYXRTb3J0TWl4aW5CYXNlOiBIYXNJbml0aWFsaXplZEN0b3IgJiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRTb3J0QmFzZSA9XG4gICAgbWl4aW5Jbml0aWFsaXplZChtaXhpbkRpc2FibGVkKE1hdFNvcnRCYXNlKSk7XG5cbi8qKiBDb250YWluZXIgZm9yIE1hdFNvcnRhYmxlcyB0byBtYW5hZ2UgdGhlIHNvcnQgc3RhdGUgYW5kIHByb3ZpZGUgZGVmYXVsdCBzb3J0IHBhcmFtZXRlcnMuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0U29ydF0nLFxuICBleHBvcnRBczogJ21hdFNvcnQnLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IG1hdFNvcnREaXNhYmxlZCddXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnQgZXh0ZW5kcyBfTWF0U29ydE1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgSGFzSW5pdGlhbGl6ZWQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQge1xuICAvKiogQ29sbGVjdGlvbiBvZiBhbGwgcmVnaXN0ZXJlZCBzb3J0YWJsZXMgdGhhdCB0aGlzIGRpcmVjdGl2ZSBtYW5hZ2VzLiAqL1xuICBzb3J0YWJsZXMgPSBuZXcgTWFwPHN0cmluZywgTWF0U29ydGFibGU+KCk7XG5cbiAgLyoqIFVzZWQgdG8gbm90aWZ5IGFueSBjaGlsZCBjb21wb25lbnRzIGxpc3RlbmluZyB0byBzdGF0ZSBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGlkIG9mIHRoZSBtb3N0IHJlY2VudGx5IHNvcnRlZCBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCdtYXRTb3J0QWN0aXZlJykgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rpb24gdG8gc2V0IHdoZW4gYW4gTWF0U29ydGFibGUgaXMgaW5pdGlhbGx5IHNvcnRlZC5cbiAgICogTWF5IGJlIG92ZXJyaWRlbiBieSB0aGUgTWF0U29ydGFibGUncyBzb3J0IHN0YXJ0LlxuICAgKi9cbiAgQElucHV0KCdtYXRTb3J0U3RhcnQnKSBzdGFydDogJ2FzYycgfCAnZGVzYycgPSAnYXNjJztcblxuICAvKiogVGhlIHNvcnQgZGlyZWN0aW9uIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnREaXJlY3Rpb24nKVxuICBnZXQgZGlyZWN0aW9uKCk6IFNvcnREaXJlY3Rpb24geyByZXR1cm4gdGhpcy5fZGlyZWN0aW9uOyB9XG4gIHNldCBkaXJlY3Rpb24oZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uKSB7XG4gICAgaWYgKGlzRGV2TW9kZSgpICYmIGRpcmVjdGlvbiAmJiBkaXJlY3Rpb24gIT09ICdhc2MnICYmIGRpcmVjdGlvbiAhPT0gJ2Rlc2MnKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yKGRpcmVjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgfVxuICBwcml2YXRlIF9kaXJlY3Rpb246IFNvcnREaXJlY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNhYmxlIHRoZSB1c2VyIGZyb20gY2xlYXJpbmcgdGhlIHNvcnQgYnkgZmluaXNoaW5nIHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZS5cbiAgICogTWF5IGJlIG92ZXJyaWRlbiBieSB0aGUgTWF0U29ydGFibGUncyBkaXNhYmxlIGNsZWFyIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdtYXRTb3J0RGlzYWJsZUNsZWFyJylcbiAgZ2V0IGRpc2FibGVDbGVhcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbGVhcjsgfVxuICBzZXQgZGlzYWJsZUNsZWFyKHY6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgZWl0aGVyIHRoZSBhY3RpdmUgc29ydCBvciBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgQE91dHB1dCgnbWF0U29ydENoYW5nZScpIHJlYWRvbmx5IHNvcnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxTb3J0PiA9IG5ldyBFdmVudEVtaXR0ZXI8U29ydD4oKTtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gQWRkcyB0aGUgTWF0U29ydGFibGUgdG8gdGhlXG4gICAqIGNvbGxlY3Rpb24gb2YgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgcmVnaXN0ZXIoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKCFzb3J0YWJsZS5pZCkge1xuICAgICAgdGhyb3cgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc29ydGFibGVzLmhhcyhzb3J0YWJsZS5pZCkpIHtcbiAgICAgIHRocm93IGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3Ioc29ydGFibGUuaWQpO1xuICAgIH1cbiAgICB0aGlzLnNvcnRhYmxlcy5zZXQoc29ydGFibGUuaWQsIHNvcnRhYmxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnJlZ2lzdGVyIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYnkgdGhlIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuIFJlbW92ZXMgdGhlIE1hdFNvcnRhYmxlIGZyb20gdGhlXG4gICAqIGNvbGxlY3Rpb24gb2YgY29udGFpbmVkIE1hdFNvcnRhYmxlcy5cbiAgICovXG4gIGRlcmVnaXN0ZXIoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgdGhpcy5zb3J0YWJsZXMuZGVsZXRlKHNvcnRhYmxlLmlkKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhY3RpdmUgc29ydCBpZCBhbmQgZGV0ZXJtaW5lcyB0aGUgbmV3IHNvcnQgZGlyZWN0aW9uLiAqL1xuICBzb3J0KHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZSAhPSBzb3J0YWJsZS5pZCkge1xuICAgICAgdGhpcy5hY3RpdmUgPSBzb3J0YWJsZS5pZDtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gc29ydGFibGUuc3RhcnQgPyBzb3J0YWJsZS5zdGFydCA6IHRoaXMuc3RhcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5nZXROZXh0U29ydERpcmVjdGlvbihzb3J0YWJsZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zb3J0Q2hhbmdlLmVtaXQoe2FjdGl2ZTogdGhpcy5hY3RpdmUsIGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb259KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBuZXh0IHNvcnQgZGlyZWN0aW9uIG9mIHRoZSBhY3RpdmUgc29ydGFibGUsIGNoZWNraW5nIGZvciBwb3RlbnRpYWwgb3ZlcnJpZGVzLiAqL1xuICBnZXROZXh0U29ydERpcmVjdGlvbihzb3J0YWJsZTogTWF0U29ydGFibGUpOiBTb3J0RGlyZWN0aW9uIHtcbiAgICBpZiAoIXNvcnRhYmxlKSB7IHJldHVybiAnJzsgfVxuXG4gICAgLy8gR2V0IHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZSB3aXRoIHRoZSBwb3RlbnRpYWwgc29ydGFibGUgb3ZlcnJpZGVzLlxuICAgIGNvbnN0IGRpc2FibGVDbGVhciA9IHNvcnRhYmxlLmRpc2FibGVDbGVhciAhPSBudWxsID8gc29ydGFibGUuZGlzYWJsZUNsZWFyIDogdGhpcy5kaXNhYmxlQ2xlYXI7XG4gICAgbGV0IHNvcnREaXJlY3Rpb25DeWNsZSA9IGdldFNvcnREaXJlY3Rpb25DeWNsZShzb3J0YWJsZS5zdGFydCB8fCB0aGlzLnN0YXJ0LCBkaXNhYmxlQ2xlYXIpO1xuXG4gICAgLy8gR2V0IGFuZCByZXR1cm4gdGhlIG5leHQgZGlyZWN0aW9uIGluIHRoZSBjeWNsZVxuICAgIGxldCBuZXh0RGlyZWN0aW9uSW5kZXggPSBzb3J0RGlyZWN0aW9uQ3ljbGUuaW5kZXhPZih0aGlzLmRpcmVjdGlvbikgKyAxO1xuICAgIGlmIChuZXh0RGlyZWN0aW9uSW5kZXggPj0gc29ydERpcmVjdGlvbkN5Y2xlLmxlbmd0aCkgeyBuZXh0RGlyZWN0aW9uSW5kZXggPSAwOyB9XG4gICAgcmV0dXJuIHNvcnREaXJlY3Rpb25DeWNsZVtuZXh0RGlyZWN0aW9uSW5kZXhdO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsZWFyOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cblxuLyoqIFJldHVybnMgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHRvIHVzZSBnaXZlbiB0aGUgcHJvdmlkZWQgcGFyYW1ldGVycyBvZiBvcmRlciBhbmQgY2xlYXIuICovXG5mdW5jdGlvbiBnZXRTb3J0RGlyZWN0aW9uQ3ljbGUoc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVDbGVhcjogYm9vbGVhbik6IFNvcnREaXJlY3Rpb25bXSB7XG4gIGxldCBzb3J0T3JkZXI6IFNvcnREaXJlY3Rpb25bXSA9IFsnYXNjJywgJ2Rlc2MnXTtcbiAgaWYgKHN0YXJ0ID09ICdkZXNjJykgeyBzb3J0T3JkZXIucmV2ZXJzZSgpOyB9XG4gIGlmICghZGlzYWJsZUNsZWFyKSB7IHNvcnRPcmRlci5wdXNoKCcnKTsgfVxuXG4gIHJldHVybiBzb3J0T3JkZXI7XG59XG4iXX0=