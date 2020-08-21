/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, EventEmitter, Input, Output, } from '@angular/core';
import { mixinDisabled, mixinInitialized, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError, } from './sort-errors';
// Boilerplate for applying mixins to MatSort.
/** @docs-private */
class MatSortBase {
}
const _MatSortMixinBase = mixinInitialized(mixinDisabled(MatSortBase));
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
export class MatSort extends _MatSortMixinBase {
    constructor() {
        super(...arguments);
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
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        const disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsYUFBYSxFQUNiLGdCQUFnQixHQUNqQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDO0FBdUJ2Qiw4Q0FBOEM7QUFDOUMsb0JBQW9CO0FBQ3BCLE1BQU0sV0FBVztDQUFHO0FBQ3BCLE1BQU0saUJBQWlCLEdBQ25CLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRWpELCtGQUErRjtBQU8vRixNQUFNLE9BQU8sT0FBUSxTQUFRLGlCQUFpQjtJQU45Qzs7UUFRRSwwRUFBMEU7UUFDMUUsY0FBUyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1FBRTNDLHNFQUFzRTtRQUM3RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFLN0M7OztXQUdHO1FBQ29CLFVBQUssR0FBbUIsS0FBSyxDQUFDO1FBWTdDLGVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBV3ZDLG9GQUFvRjtRQUNsRCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7SUFvRTlGLENBQUM7SUExRkMsOERBQThEO0lBQzlELElBQ0ksU0FBUyxLQUFvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUks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QUNOLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7O1lBN0dGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUM7Z0JBQzNCLE1BQU0sRUFBRSxDQUFDLDJCQUEyQixDQUFDO2FBQ3RDOzs7cUJBVUUsS0FBSyxTQUFDLGVBQWU7b0JBTXJCLEtBQUssU0FBQyxjQUFjO3dCQUdwQixLQUFLLFNBQUMsa0JBQWtCOzJCQWV4QixLQUFLLFNBQUMscUJBQXFCO3lCQU0zQixNQUFNLFNBQUMsZUFBZTs7QUFzRXpCLGdHQUFnRztBQUNoRyxTQUFTLHFCQUFxQixDQUFDLEtBQXFCLEVBQ3JCLFlBQXFCO0lBQ2xELElBQUksU0FBUyxHQUFvQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUM3QyxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUFFO0lBRTFDLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVDdG9yLFxuICBIYXNJbml0aWFsaXplZCxcbiAgSGFzSW5pdGlhbGl6ZWRDdG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkluaXRpYWxpemVkLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJy4vc29ydC1kaXJlY3Rpb24nO1xuaW1wb3J0IHtcbiAgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcixcbiAgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yLFxuICBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yLFxufSBmcm9tICcuL3NvcnQtZXJyb3JzJztcblxuLyoqIEludGVyZmFjZSBmb3IgYSBkaXJlY3RpdmUgdGhhdCBob2xkcyBzb3J0aW5nIHN0YXRlIGNvbnN1bWVkIGJ5IGBNYXRTb3J0SGVhZGVyYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydGFibGUge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBTdGFydGluZyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGRpc2FibGUgY2xlYXJpbmcgdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIGRpc2FibGVDbGVhcjogYm9vbGVhbjtcbn1cblxuLyoqIFRoZSBjdXJyZW50IHNvcnQgc3RhdGUuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvcnQge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBhY3RpdmU6IHN0cmluZztcblxuICAvKiogVGhlIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBkaXJlY3Rpb246IFNvcnREaXJlY3Rpb247XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U29ydC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTb3J0QmFzZSB7fVxuY29uc3QgX01hdFNvcnRNaXhpbkJhc2U6IEhhc0luaXRpYWxpemVkQ3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFNvcnRCYXNlID1cbiAgICBtaXhpbkluaXRpYWxpemVkKG1peGluRGlzYWJsZWQoTWF0U29ydEJhc2UpKTtcblxuLyoqIENvbnRhaW5lciBmb3IgTWF0U29ydGFibGVzIHRvIG1hbmFnZSB0aGUgc29ydCBzdGF0ZSBhbmQgcHJvdmlkZSBkZWZhdWx0IHNvcnQgcGFyYW1ldGVycy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRTb3J0XScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydCcsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LXNvcnQnfSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkOiBtYXRTb3J0RGlzYWJsZWQnXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0IGV4dGVuZHMgX01hdFNvcnRNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIEhhc0luaXRpYWxpemVkLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgLyoqIENvbGxlY3Rpb24gb2YgYWxsIHJlZ2lzdGVyZWQgc29ydGFibGVzIHRoYXQgdGhpcyBkaXJlY3RpdmUgbWFuYWdlcy4gKi9cbiAgc29ydGFibGVzID0gbmV3IE1hcDxzdHJpbmcsIE1hdFNvcnRhYmxlPigpO1xuXG4gIC8qKiBVc2VkIHRvIG5vdGlmeSBhbnkgY2hpbGQgY29tcG9uZW50cyBsaXN0ZW5pbmcgdG8gc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBpZCBvZiB0aGUgbW9zdCByZWNlbnRseSBzb3J0ZWQgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydEFjdGl2ZScpIGFjdGl2ZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0aW9uIHRvIHNldCB3aGVuIGFuIE1hdFNvcnRhYmxlIGlzIGluaXRpYWxseSBzb3J0ZWQuXG4gICAqIE1heSBiZSBvdmVycmlkZW4gYnkgdGhlIE1hdFNvcnRhYmxlJ3Mgc29ydCBzdGFydC5cbiAgICovXG4gIEBJbnB1dCgnbWF0U29ydFN0YXJ0Jykgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnID0gJ2FzYyc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbiBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCdtYXRTb3J0RGlyZWN0aW9uJylcbiAgZ2V0IGRpcmVjdGlvbigpOiBTb3J0RGlyZWN0aW9uIHsgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjsgfVxuICBzZXQgZGlyZWN0aW9uKGRpcmVjdGlvbjogU29ydERpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gJiYgZGlyZWN0aW9uICE9PSAnYXNjJyAmJiBkaXJlY3Rpb24gIT09ICdkZXNjJyAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IoZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgdGhlIHVzZXIgZnJvbSBjbGVhcmluZyB0aGUgc29ydCBieSBmaW5pc2hpbmcgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIGRpc2FibGUgY2xlYXIgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnREaXNhYmxlQ2xlYXInKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsZWFyOyB9XG4gIHNldCBkaXNhYmxlQ2xlYXIodjogYm9vbGVhbikgeyB0aGlzLl9kaXNhYmxlQ2xlYXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsZWFyOiBib29sZWFuO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyBlaXRoZXIgdGhlIGFjdGl2ZSBzb3J0IG9yIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBAT3V0cHV0KCdtYXRTb3J0Q2hhbmdlJykgcmVhZG9ubHkgc29ydENoYW5nZTogRXZlbnRFbWl0dGVyPFNvcnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxTb3J0PigpO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBmdW5jdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBjb250YWluZWQgTWF0U29ydGFibGVzLiBBZGRzIHRoZSBNYXRTb3J0YWJsZSB0byB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBNYXRTb3J0YWJsZXMuXG4gICAqL1xuICByZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXNvcnRhYmxlLmlkKSB7XG4gICAgICAgIHRocm93IGdldFNvcnRIZWFkZXJNaXNzaW5nSWRFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zb3J0YWJsZXMuaGFzKHNvcnRhYmxlLmlkKSkge1xuICAgICAgICB0aHJvdyBnZXRTb3J0RHVwbGljYXRlU29ydGFibGVJZEVycm9yKHNvcnRhYmxlLmlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNvcnRhYmxlcy5zZXQoc29ydGFibGUuaWQsIHNvcnRhYmxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnJlZ2lzdGVyIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYnkgdGhlIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuIFJlbW92ZXMgdGhlIE1hdFNvcnRhYmxlIGZyb20gdGhlXG4gICAqIGNvbGxlY3Rpb24gb2YgY29udGFpbmVkIE1hdFNvcnRhYmxlcy5cbiAgICovXG4gIGRlcmVnaXN0ZXIoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgdGhpcy5zb3J0YWJsZXMuZGVsZXRlKHNvcnRhYmxlLmlkKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhY3RpdmUgc29ydCBpZCBhbmQgZGV0ZXJtaW5lcyB0aGUgbmV3IHNvcnQgZGlyZWN0aW9uLiAqL1xuICBzb3J0KHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZSAhPSBzb3J0YWJsZS5pZCkge1xuICAgICAgdGhpcy5hY3RpdmUgPSBzb3J0YWJsZS5pZDtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gc29ydGFibGUuc3RhcnQgPyBzb3J0YWJsZS5zdGFydCA6IHRoaXMuc3RhcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5nZXROZXh0U29ydERpcmVjdGlvbihzb3J0YWJsZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zb3J0Q2hhbmdlLmVtaXQoe2FjdGl2ZTogdGhpcy5hY3RpdmUsIGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb259KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBuZXh0IHNvcnQgZGlyZWN0aW9uIG9mIHRoZSBhY3RpdmUgc29ydGFibGUsIGNoZWNraW5nIGZvciBwb3RlbnRpYWwgb3ZlcnJpZGVzLiAqL1xuICBnZXROZXh0U29ydERpcmVjdGlvbihzb3J0YWJsZTogTWF0U29ydGFibGUpOiBTb3J0RGlyZWN0aW9uIHtcbiAgICBpZiAoIXNvcnRhYmxlKSB7IHJldHVybiAnJzsgfVxuXG4gICAgLy8gR2V0IHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZSB3aXRoIHRoZSBwb3RlbnRpYWwgc29ydGFibGUgb3ZlcnJpZGVzLlxuICAgIGNvbnN0IGRpc2FibGVDbGVhciA9IHNvcnRhYmxlLmRpc2FibGVDbGVhciAhPSBudWxsID8gc29ydGFibGUuZGlzYWJsZUNsZWFyIDogdGhpcy5kaXNhYmxlQ2xlYXI7XG4gICAgbGV0IHNvcnREaXJlY3Rpb25DeWNsZSA9IGdldFNvcnREaXJlY3Rpb25DeWNsZShzb3J0YWJsZS5zdGFydCB8fCB0aGlzLnN0YXJ0LCBkaXNhYmxlQ2xlYXIpO1xuXG4gICAgLy8gR2V0IGFuZCByZXR1cm4gdGhlIG5leHQgZGlyZWN0aW9uIGluIHRoZSBjeWNsZVxuICAgIGxldCBuZXh0RGlyZWN0aW9uSW5kZXggPSBzb3J0RGlyZWN0aW9uQ3ljbGUuaW5kZXhPZih0aGlzLmRpcmVjdGlvbikgKyAxO1xuICAgIGlmIChuZXh0RGlyZWN0aW9uSW5kZXggPj0gc29ydERpcmVjdGlvbkN5Y2xlLmxlbmd0aCkgeyBuZXh0RGlyZWN0aW9uSW5kZXggPSAwOyB9XG4gICAgcmV0dXJuIHNvcnREaXJlY3Rpb25DeWNsZVtuZXh0RGlyZWN0aW9uSW5kZXhdO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsZWFyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKiogUmV0dXJucyB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUgdG8gdXNlIGdpdmVuIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzIG9mIG9yZGVyIGFuZCBjbGVhci4gKi9cbmZ1bmN0aW9uIGdldFNvcnREaXJlY3Rpb25DeWNsZShzdGFydDogJ2FzYycgfCAnZGVzYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUNsZWFyOiBib29sZWFuKTogU29ydERpcmVjdGlvbltdIHtcbiAgbGV0IHNvcnRPcmRlcjogU29ydERpcmVjdGlvbltdID0gWydhc2MnLCAnZGVzYyddO1xuICBpZiAoc3RhcnQgPT0gJ2Rlc2MnKSB7IHNvcnRPcmRlci5yZXZlcnNlKCk7IH1cbiAgaWYgKCFkaXNhYmxlQ2xlYXIpIHsgc29ydE9yZGVyLnB1c2goJycpOyB9XG5cbiAgcmV0dXJuIHNvcnRPcmRlcjtcbn1cbiJdfQ==