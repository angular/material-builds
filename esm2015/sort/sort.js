/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, EventEmitter, Inject, InjectionToken, Input, Optional, Output, } from '@angular/core';
import { mixinDisabled, mixinInitialized, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError, } from './sort-errors';
/** Injection token to be used to override the default options for `mat-sort`. */
export const MAT_SORT_DEFAULT_OPTIONS = new InjectionToken('MAT_SORT_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to MatSort.
/** @docs-private */
class MatSortBase {
}
const _MatSortMixinBase = mixinInitialized(mixinDisabled(MatSortBase));
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
export class MatSort extends _MatSortMixinBase {
    constructor(_defaultOptions) {
        super();
        this._defaultOptions = _defaultOptions;
        /** Collection of all registered sortables that this directive manages. */
        this.sortables = new Map();
        /** Used to notify any child components listening to state changes. */
        this._stateChanges = new Subject();
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the MatSortable's sort start.
         */
        this.start = 'asc';
        this._direction = '';
        /** Event emitted when the user changes either the active sort or sort direction. */
        this.sortChange = new EventEmitter();
    }
    /** The sort direction of the currently active MatSortable. */
    get direction() { return this._direction; }
    set direction(direction) {
        if (direction && direction !== 'asc' && direction !== 'desc' &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     */
    get disableClear() { return this._disableClear; }
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     */
    register(sortable) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!sortable.id) {
                throw getSortHeaderMissingIdError();
            }
            if (this.sortables.has(sortable.id)) {
                throw getSortDuplicateSortableIdError(sortable.id);
            }
        }
        this.sortables.set(sortable.id, sortable);
    }
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     */
    deregister(sortable) {
        this.sortables.delete(sortable.id);
    }
    /** Sets the active sort id and determines the new sort direction. */
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
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable) {
        var _a, _b, _c;
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        const disableClear = (_b = (_a = sortable === null || sortable === void 0 ? void 0 : sortable.disableClear) !== null && _a !== void 0 ? _a : this.disableClear) !== null && _b !== void 0 ? _b : !!((_c = this._defaultOptions) === null || _c === void 0 ? void 0 : _c.disableClear);
        let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
    ngOnInit() {
        this._markInitialized();
    }
    ngOnChanges() {
        this._stateChanges.next();
    }
    ngOnDestroy() {
        this._stateChanges.complete();
    }
}
MatSort.decorators = [
    { type: Directive, args: [{
                selector: '[matSort]',
                exportAs: 'matSort',
                host: { 'class': 'mat-sort' },
                inputs: ['disabled: matSortDisabled']
            },] }
];
MatSort.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_SORT_DEFAULT_OPTIONS,] }] }
];
MatSort.propDecorators = {
    active: [{ type: Input, args: ['matSortActive',] }],
    start: [{ type: Input, args: ['matSortStart',] }],
    direction: [{ type: Input, args: ['matSortDirection',] }],
    disableClear: [{ type: Input, args: ['matSortDisableClear',] }],
    sortChange: [{ type: Output, args: ['matSortChange',] }]
};
/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start, disableClear) {
    let sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsYUFBYSxFQUNiLGdCQUFnQixHQUNqQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDO0FBNkJ2QixpRkFBaUY7QUFDakYsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQ2pDLElBQUksY0FBYyxDQUF3QiwwQkFBMEIsQ0FBQyxDQUFDO0FBRzFFLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxXQUFXO0NBQUc7QUFDcEIsTUFBTSxpQkFBaUIsR0FDbkIsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFFakQsK0ZBQStGO0FBTy9GLE1BQU0sT0FBTyxPQUFRLFNBQVEsaUJBQWlCO0lBeUM1QyxZQUNvQixlQUF1QztRQUN6RCxLQUFLLEVBQUUsQ0FBQztRQURVLG9CQUFlLEdBQWYsZUFBZSxDQUF3QjtRQXhDM0QsMEVBQTBFO1FBQzFFLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztRQUUzQyxzRUFBc0U7UUFDN0Qsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBSzdDOzs7V0FHRztRQUNvQixVQUFLLEdBQW1CLEtBQUssQ0FB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MUMsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVDdG9yLFxuICBIYXNJbml0aWFsaXplZCxcbiAgSGFzSW5pdGlhbGl6ZWRDdG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkluaXRpYWxpemVkLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJy4vc29ydC1kaXJlY3Rpb24nO1xuaW1wb3J0IHtcbiAgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcixcbiAgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yLFxuICBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yLFxufSBmcm9tICcuL3NvcnQtZXJyb3JzJztcblxuLyoqIEludGVyZmFjZSBmb3IgYSBkaXJlY3RpdmUgdGhhdCBob2xkcyBzb3J0aW5nIHN0YXRlIGNvbnN1bWVkIGJ5IGBNYXRTb3J0SGVhZGVyYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydGFibGUge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBTdGFydGluZyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGRpc2FibGUgY2xlYXJpbmcgdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIGRpc2FibGVDbGVhcjogYm9vbGVhbjtcbn1cblxuLyoqIFRoZSBjdXJyZW50IHNvcnQgc3RhdGUuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvcnQge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBhY3RpdmU6IHN0cmluZztcblxuICAvKiogVGhlIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBkaXJlY3Rpb246IFNvcnREaXJlY3Rpb247XG59XG5cbi8qKiBEZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtc29ydGAuICAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTb3J0RGVmYXVsdE9wdGlvbnMge1xuICAvKiogV2hldGhlciB0byBkaXNhYmxlIGNsZWFyaW5nIHRoZSBzb3J0aW5nIHN0YXRlLiAqL1xuICBkaXNhYmxlQ2xlYXI/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zb3J0YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU09SVF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTb3J0RGVmYXVsdE9wdGlvbnM+KCdNQVRfU09SVF9ERUZBVUxUX09QVElPTlMnKTtcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNvcnQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U29ydEJhc2Uge31cbmNvbnN0IF9NYXRTb3J0TWl4aW5CYXNlOiBIYXNJbml0aWFsaXplZEN0b3IgJiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRTb3J0QmFzZSA9XG4gICAgbWl4aW5Jbml0aWFsaXplZChtaXhpbkRpc2FibGVkKE1hdFNvcnRCYXNlKSk7XG5cbi8qKiBDb250YWluZXIgZm9yIE1hdFNvcnRhYmxlcyB0byBtYW5hZ2UgdGhlIHNvcnQgc3RhdGUgYW5kIHByb3ZpZGUgZGVmYXVsdCBzb3J0IHBhcmFtZXRlcnMuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0U29ydF0nLFxuICBleHBvcnRBczogJ21hdFNvcnQnLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1zb3J0J30sXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0U29ydERpc2FibGVkJ11cbn0pXG5leHBvcnQgY2xhc3MgTWF0U29ydCBleHRlbmRzIF9NYXRTb3J0TWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBDb2xsZWN0aW9uIG9mIGFsbCByZWdpc3RlcmVkIHNvcnRhYmxlcyB0aGF0IHRoaXMgZGlyZWN0aXZlIG1hbmFnZXMuICovXG4gIHNvcnRhYmxlcyA9IG5ldyBNYXA8c3RyaW5nLCBNYXRTb3J0YWJsZT4oKTtcblxuICAvKiogVXNlZCB0byBub3RpZnkgYW55IGNoaWxkIGNvbXBvbmVudHMgbGlzdGVuaW5nIHRvIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgaWQgb2YgdGhlIG1vc3QgcmVjZW50bHkgc29ydGVkIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnRBY3RpdmUnKSBhY3RpdmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRpcmVjdGlvbiB0byBzZXQgd2hlbiBhbiBNYXRTb3J0YWJsZSBpcyBpbml0aWFsbHkgc29ydGVkLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIHNvcnQgc3RhcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnRTdGFydCcpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJyA9ICdhc2MnO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydERpcmVjdGlvbicpXG4gIGdldCBkaXJlY3Rpb24oKTogU29ydERpcmVjdGlvbiB7IHJldHVybiB0aGlzLl9kaXJlY3Rpb247IH1cbiAgc2V0IGRpcmVjdGlvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uICYmIGRpcmVjdGlvbiAhPT0gJ2FzYycgJiYgZGlyZWN0aW9uICE9PSAnZGVzYycgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yKGRpcmVjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgfVxuICBwcml2YXRlIF9kaXJlY3Rpb246IFNvcnREaXJlY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNhYmxlIHRoZSB1c2VyIGZyb20gY2xlYXJpbmcgdGhlIHNvcnQgYnkgZmluaXNoaW5nIHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZS5cbiAgICogTWF5IGJlIG92ZXJyaWRlbiBieSB0aGUgTWF0U29ydGFibGUncyBkaXNhYmxlIGNsZWFyIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdtYXRTb3J0RGlzYWJsZUNsZWFyJylcbiAgZ2V0IGRpc2FibGVDbGVhcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbGVhcjsgfVxuICBzZXQgZGlzYWJsZUNsZWFyKHY6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgZWl0aGVyIHRoZSBhY3RpdmUgc29ydCBvciBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgQE91dHB1dCgnbWF0U29ydENoYW5nZScpIHJlYWRvbmx5IHNvcnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxTb3J0PiA9IG5ldyBFdmVudEVtaXR0ZXI8U29ydD4oKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTb3J0RGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYnkgdGhlIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuIEFkZHMgdGhlIE1hdFNvcnRhYmxlIHRvIHRoZVxuICAgKiBjb2xsZWN0aW9uIG9mIE1hdFNvcnRhYmxlcy5cbiAgICovXG4gIHJlZ2lzdGVyKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghc29ydGFibGUuaWQpIHtcbiAgICAgICAgdGhyb3cgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlcy5oYXMoc29ydGFibGUuaWQpKSB7XG4gICAgICAgIHRocm93IGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3Ioc29ydGFibGUuaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc29ydGFibGVzLnNldChzb3J0YWJsZS5pZCwgc29ydGFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gUmVtb3ZlcyB0aGUgTWF0U29ydGFibGUgZnJvbSB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBjb250YWluZWQgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgZGVyZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICB0aGlzLnNvcnRhYmxlcy5kZWxldGUoc29ydGFibGUuaWQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBzb3J0IGlkIGFuZCBkZXRlcm1pbmVzIHRoZSBuZXcgc29ydCBkaXJlY3Rpb24uICovXG4gIHNvcnQoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlICE9IHNvcnRhYmxlLmlkKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHNvcnRhYmxlLmlkO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBzb3J0YWJsZS5zdGFydCA/IHNvcnRhYmxlLnN0YXJ0IDogdGhpcy5zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRDaGFuZ2UuZW1pdCh7YWN0aXZlOiB0aGlzLmFjdGl2ZSwgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbn0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGFjdGl2ZSBzb3J0YWJsZSwgY2hlY2tpbmcgZm9yIHBvdGVudGlhbCBvdmVycmlkZXMuICovXG4gIGdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IFNvcnREaXJlY3Rpb24ge1xuICAgIGlmICghc29ydGFibGUpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAvLyBHZXQgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHdpdGggdGhlIHBvdGVudGlhbCBzb3J0YWJsZSBvdmVycmlkZXMuXG4gICAgY29uc3QgZGlzYWJsZUNsZWFyID0gc29ydGFibGU/LmRpc2FibGVDbGVhciA/P1xuICAgICAgICB0aGlzLmRpc2FibGVDbGVhciA/PyAhIXRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlQ2xlYXI7XG4gICAgbGV0IHNvcnREaXJlY3Rpb25DeWNsZSA9IGdldFNvcnREaXJlY3Rpb25DeWNsZShzb3J0YWJsZS5zdGFydCB8fCB0aGlzLnN0YXJ0LCBkaXNhYmxlQ2xlYXIpO1xuXG4gICAgLy8gR2V0IGFuZCByZXR1cm4gdGhlIG5leHQgZGlyZWN0aW9uIGluIHRoZSBjeWNsZVxuICAgIGxldCBuZXh0RGlyZWN0aW9uSW5kZXggPSBzb3J0RGlyZWN0aW9uQ3ljbGUuaW5kZXhPZih0aGlzLmRpcmVjdGlvbikgKyAxO1xuICAgIGlmIChuZXh0RGlyZWN0aW9uSW5kZXggPj0gc29ydERpcmVjdGlvbkN5Y2xlLmxlbmd0aCkgeyBuZXh0RGlyZWN0aW9uSW5kZXggPSAwOyB9XG4gICAgcmV0dXJuIHNvcnREaXJlY3Rpb25DeWNsZVtuZXh0RGlyZWN0aW9uSW5kZXhdO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsZWFyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKiogUmV0dXJucyB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUgdG8gdXNlIGdpdmVuIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzIG9mIG9yZGVyIGFuZCBjbGVhci4gKi9cbmZ1bmN0aW9uIGdldFNvcnREaXJlY3Rpb25DeWNsZShzdGFydDogJ2FzYycgfCAnZGVzYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUNsZWFyOiBib29sZWFuKTogU29ydERpcmVjdGlvbltdIHtcbiAgbGV0IHNvcnRPcmRlcjogU29ydERpcmVjdGlvbltdID0gWydhc2MnLCAnZGVzYyddO1xuICBpZiAoc3RhcnQgPT0gJ2Rlc2MnKSB7IHNvcnRPcmRlci5yZXZlcnNlKCk7IH1cbiAgaWYgKCFkaXNhYmxlQ2xlYXIpIHsgc29ydE9yZGVyLnB1c2goJycpOyB9XG5cbiAgcmV0dXJuIHNvcnRPcmRlcjtcbn1cbiJdfQ==