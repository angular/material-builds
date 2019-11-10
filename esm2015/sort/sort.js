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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsU0FBUyxFQUlULE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsYUFBYSxFQUNiLGdCQUFnQixHQUNqQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDOzs7OztBQUd2QixpQ0FTQzs7Ozs7O0lBUEMseUJBQVc7Ozs7O0lBR1gsNEJBQXNCOzs7OztJQUd0QixtQ0FBc0I7Ozs7OztBQUl4QiwwQkFNQzs7Ozs7O0lBSkMsc0JBQWU7Ozs7O0lBR2YseUJBQXlCOzs7Ozs7QUFLM0IsTUFBTSxXQUFXO0NBQUc7O01BQ2QsaUJBQWlCLEdBQ25CLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7OztBQVFoRCxNQUFNLE9BQU8sT0FBUSxTQUFRLGlCQUFpQjtJQUw5Qzs7Ozs7UUFRRSxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7Ozs7UUFHbEMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7OztRQVN0QixVQUFLLEdBQW1CLEtBQUssQ0FBQztRQVc3QyxlQUFVLEdBQWtCLEVBQUUsQ0FBQzs7OztRQVlMLGVBQVUsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztJQWlFOUYsQ0FBQzs7Ozs7SUFyRkMsSUFDSSxTQUFTLEtBQW9CLE9BQU8sSUFBSSxDQUFDLFVB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QUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzs7WUF4R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxXQUFXO2dCQUNyQixRQUFRLEVBQUUsU0FBUztnQkFDbkIsTUFBTSxFQUFFLENBQUMsMkJBQTJCLENBQUM7YUFDdEM7OztxQkFVRSxLQUFLLFNBQUMsZUFBZTtvQkFNckIsS0FBSyxTQUFDLGNBQWM7d0JBR3BCLEtBQUssU0FBQyxrQkFBa0I7MkJBY3hCLEtBQUssU0FBQyxxQkFBcUI7eUJBTTNCLE1BQU0sU0FBQyxlQUFlOzs7O0lBK0R2Qix1Q0FBMkU7O0lBQzNFLG1DQUF1RTs7Ozs7SUFuR3ZFLDRCQUEyQzs7Ozs7SUFHM0MsZ0NBQTZDOzs7OztJQUc3Qyx5QkFBdUM7Ozs7OztJQU12Qyx3QkFBcUQ7Ozs7O0lBV3JELDZCQUF1Qzs7Ozs7SUFTdkMsZ0NBQStCOzs7OztJQUcvQiw2QkFBNEY7Ozs7Ozs7O0FBb0U5RixTQUFTLHFCQUFxQixDQUFDLEtBQXFCLEVBQ3JCLFlBQXFCOztRQUM5QyxTQUFTLEdBQW9CLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztJQUNoRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUM3QyxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUFFO0lBRTFDLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIGlzRGV2TW9kZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVDdG9yLFxuICBIYXNJbml0aWFsaXplZCxcbiAgSGFzSW5pdGlhbGl6ZWRDdG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkluaXRpYWxpemVkLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJy4vc29ydC1kaXJlY3Rpb24nO1xuaW1wb3J0IHtcbiAgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcixcbiAgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yLFxuICBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yLFxufSBmcm9tICcuL3NvcnQtZXJyb3JzJztcblxuLyoqIEludGVyZmFjZSBmb3IgYSBkaXJlY3RpdmUgdGhhdCBob2xkcyBzb3J0aW5nIHN0YXRlIGNvbnN1bWVkIGJ5IGBNYXRTb3J0SGVhZGVyYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydGFibGUge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBTdGFydGluZyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGRpc2FibGUgY2xlYXJpbmcgdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIGRpc2FibGVDbGVhcjogYm9vbGVhbjtcbn1cblxuLyoqIFRoZSBjdXJyZW50IHNvcnQgc3RhdGUuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvcnQge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBhY3RpdmU6IHN0cmluZztcblxuICAvKiogVGhlIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBkaXJlY3Rpb246IFNvcnREaXJlY3Rpb247XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U29ydC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTb3J0QmFzZSB7fVxuY29uc3QgX01hdFNvcnRNaXhpbkJhc2U6IEhhc0luaXRpYWxpemVkQ3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFNvcnRCYXNlID1cbiAgICBtaXhpbkluaXRpYWxpemVkKG1peGluRGlzYWJsZWQoTWF0U29ydEJhc2UpKTtcblxuLyoqIENvbnRhaW5lciBmb3IgTWF0U29ydGFibGVzIHRvIG1hbmFnZSB0aGUgc29ydCBzdGF0ZSBhbmQgcHJvdmlkZSBkZWZhdWx0IHNvcnQgcGFyYW1ldGVycy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRTb3J0XScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydCcsXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0U29ydERpc2FibGVkJ11cbn0pXG5leHBvcnQgY2xhc3MgTWF0U29ydCBleHRlbmRzIF9NYXRTb3J0TWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBDb2xsZWN0aW9uIG9mIGFsbCByZWdpc3RlcmVkIHNvcnRhYmxlcyB0aGF0IHRoaXMgZGlyZWN0aXZlIG1hbmFnZXMuICovXG4gIHNvcnRhYmxlcyA9IG5ldyBNYXA8c3RyaW5nLCBNYXRTb3J0YWJsZT4oKTtcblxuICAvKiogVXNlZCB0byBub3RpZnkgYW55IGNoaWxkIGNvbXBvbmVudHMgbGlzdGVuaW5nIHRvIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgaWQgb2YgdGhlIG1vc3QgcmVjZW50bHkgc29ydGVkIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnRBY3RpdmUnKSBhY3RpdmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRpcmVjdGlvbiB0byBzZXQgd2hlbiBhbiBNYXRTb3J0YWJsZSBpcyBpbml0aWFsbHkgc29ydGVkLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIHNvcnQgc3RhcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnRTdGFydCcpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJyA9ICdhc2MnO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydERpcmVjdGlvbicpXG4gIGdldCBkaXJlY3Rpb24oKTogU29ydERpcmVjdGlvbiB7IHJldHVybiB0aGlzLl9kaXJlY3Rpb247IH1cbiAgc2V0IGRpcmVjdGlvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNEZXZNb2RlKCkgJiYgZGlyZWN0aW9uICYmIGRpcmVjdGlvbiAhPT0gJ2FzYycgJiYgZGlyZWN0aW9uICE9PSAnZGVzYycpIHtcbiAgICAgIHRocm93IGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IoZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgdGhlIHVzZXIgZnJvbSBjbGVhcmluZyB0aGUgc29ydCBieSBmaW5pc2hpbmcgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIGRpc2FibGUgY2xlYXIgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnREaXNhYmxlQ2xlYXInKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsZWFyOyB9XG4gIHNldCBkaXNhYmxlQ2xlYXIodjogYm9vbGVhbikgeyB0aGlzLl9kaXNhYmxlQ2xlYXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsZWFyOiBib29sZWFuO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyBlaXRoZXIgdGhlIGFjdGl2ZSBzb3J0IG9yIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBAT3V0cHV0KCdtYXRTb3J0Q2hhbmdlJykgcmVhZG9ubHkgc29ydENoYW5nZTogRXZlbnRFbWl0dGVyPFNvcnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxTb3J0PigpO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBmdW5jdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBjb250YWluZWQgTWF0U29ydGFibGVzLiBBZGRzIHRoZSBNYXRTb3J0YWJsZSB0byB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBNYXRTb3J0YWJsZXMuXG4gICAqL1xuICByZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICBpZiAoIXNvcnRhYmxlLmlkKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3J0YWJsZXMuaGFzKHNvcnRhYmxlLmlkKSkge1xuICAgICAgdGhyb3cgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcihzb3J0YWJsZS5pZCk7XG4gICAgfVxuICAgIHRoaXMuc29ydGFibGVzLnNldChzb3J0YWJsZS5pZCwgc29ydGFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gUmVtb3ZlcyB0aGUgTWF0U29ydGFibGUgZnJvbSB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBjb250YWluZWQgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgZGVyZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICB0aGlzLnNvcnRhYmxlcy5kZWxldGUoc29ydGFibGUuaWQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBzb3J0IGlkIGFuZCBkZXRlcm1pbmVzIHRoZSBuZXcgc29ydCBkaXJlY3Rpb24uICovXG4gIHNvcnQoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlICE9IHNvcnRhYmxlLmlkKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHNvcnRhYmxlLmlkO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBzb3J0YWJsZS5zdGFydCA/IHNvcnRhYmxlLnN0YXJ0IDogdGhpcy5zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRDaGFuZ2UuZW1pdCh7YWN0aXZlOiB0aGlzLmFjdGl2ZSwgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbn0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGFjdGl2ZSBzb3J0YWJsZSwgY2hlY2tpbmcgZm9yIHBvdGVudGlhbCBvdmVycmlkZXMuICovXG4gIGdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IFNvcnREaXJlY3Rpb24ge1xuICAgIGlmICghc29ydGFibGUpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAvLyBHZXQgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHdpdGggdGhlIHBvdGVudGlhbCBzb3J0YWJsZSBvdmVycmlkZXMuXG4gICAgY29uc3QgZGlzYWJsZUNsZWFyID0gc29ydGFibGUuZGlzYWJsZUNsZWFyICE9IG51bGwgPyBzb3J0YWJsZS5kaXNhYmxlQ2xlYXIgOiB0aGlzLmRpc2FibGVDbGVhcjtcbiAgICBsZXQgc29ydERpcmVjdGlvbkN5Y2xlID0gZ2V0U29ydERpcmVjdGlvbkN5Y2xlKHNvcnRhYmxlLnN0YXJ0IHx8IHRoaXMuc3RhcnQsIGRpc2FibGVDbGVhcik7XG5cbiAgICAvLyBHZXQgYW5kIHJldHVybiB0aGUgbmV4dCBkaXJlY3Rpb24gaW4gdGhlIGN5Y2xlXG4gICAgbGV0IG5leHREaXJlY3Rpb25JbmRleCA9IHNvcnREaXJlY3Rpb25DeWNsZS5pbmRleE9mKHRoaXMuZGlyZWN0aW9uKSArIDE7XG4gICAgaWYgKG5leHREaXJlY3Rpb25JbmRleCA+PSBzb3J0RGlyZWN0aW9uQ3ljbGUubGVuZ3RoKSB7IG5leHREaXJlY3Rpb25JbmRleCA9IDA7IH1cbiAgICByZXR1cm4gc29ydERpcmVjdGlvbkN5Y2xlW25leHREaXJlY3Rpb25JbmRleF07XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9tYXJrSW5pdGlhbGl6ZWQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQ2xlYXI6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuXG4vKiogUmV0dXJucyB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUgdG8gdXNlIGdpdmVuIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzIG9mIG9yZGVyIGFuZCBjbGVhci4gKi9cbmZ1bmN0aW9uIGdldFNvcnREaXJlY3Rpb25DeWNsZShzdGFydDogJ2FzYycgfCAnZGVzYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUNsZWFyOiBib29sZWFuKTogU29ydERpcmVjdGlvbltdIHtcbiAgbGV0IHNvcnRPcmRlcjogU29ydERpcmVjdGlvbltdID0gWydhc2MnLCAnZGVzYyddO1xuICBpZiAoc3RhcnQgPT0gJ2Rlc2MnKSB7IHNvcnRPcmRlci5yZXZlcnNlKCk7IH1cbiAgaWYgKCFkaXNhYmxlQ2xlYXIpIHsgc29ydE9yZGVyLnB1c2goJycpOyB9XG5cbiAgcmV0dXJuIHNvcnRPcmRlcjtcbn1cbiJdfQ==