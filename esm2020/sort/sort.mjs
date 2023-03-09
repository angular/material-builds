/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, EventEmitter, Inject, InjectionToken, Input, Optional, Output, } from '@angular/core';
import { mixinDisabled, mixinInitialized } from '@angular/material/core';
import { Subject } from 'rxjs';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError, } from './sort-errors';
import * as i0 from "@angular/core";
/** Injection token to be used to override the default options for `mat-sort`. */
export const MAT_SORT_DEFAULT_OPTIONS = new InjectionToken('MAT_SORT_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to MatSort.
/** @docs-private */
const _MatSortBase = mixinInitialized(mixinDisabled(class {
}));
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
class MatSort extends _MatSortBase {
    /** The sort direction of the currently active MatSortable. */
    get direction() {
        return this._direction;
    }
    set direction(direction) {
        if (direction &&
            direction !== 'asc' &&
            direction !== 'desc' &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overridden by the MatSortable's disable clear input.
     */
    get disableClear() {
        return this._disableClear;
    }
    set disableClear(v) {
        this._disableClear = coerceBooleanProperty(v);
    }
    constructor(_defaultOptions) {
        super();
        this._defaultOptions = _defaultOptions;
        /** Collection of all registered sortables that this directive manages. */
        this.sortables = new Map();
        /** Used to notify any child components listening to state changes. */
        this._stateChanges = new Subject();
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overridden by the MatSortable's sort start.
         */
        this.start = 'asc';
        this._direction = '';
        /** Event emitted when the user changes either the active sort or sort direction. */
        this.sortChange = new EventEmitter();
    }
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
        const disableClear = sortable?.disableClear ?? this.disableClear ?? !!this._defaultOptions?.disableClear;
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
MatSort.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.2", ngImport: i0, type: MatSort, deps: [{ token: MAT_SORT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatSort.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.2", type: MatSort, selector: "[matSort]", inputs: { disabled: ["matSortDisabled", "disabled"], active: ["matSortActive", "active"], start: ["matSortStart", "start"], direction: ["matSortDirection", "direction"], disableClear: ["matSortDisableClear", "disableClear"] }, outputs: { sortChange: "matSortChange" }, host: { classAttribute: "mat-sort" }, exportAs: ["matSort"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
export { MatSort };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.2", ngImport: i0, type: MatSort, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matSort]',
                    exportAs: 'matSort',
                    host: { 'class': 'mat-sort' },
                    inputs: ['disabled: matSortDisabled'],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_SORT_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { active: [{
                type: Input,
                args: ['matSortActive']
            }], start: [{
                type: Input,
                args: ['matSortStart']
            }], direction: [{
                type: Input,
                args: ['matSortDirection']
            }], disableClear: [{
                type: Input,
                args: ['matSortDisableClear']
            }], sortChange: [{
                type: Output,
                args: ['matSortChange']
            }] } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ25HLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDOztBQWtDdkIsaUZBQWlGO0FBQ2pGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUN4RCwwQkFBMEIsQ0FDM0IsQ0FBQztBQUVGLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO0NBQVEsQ0FBQyxDQUFDLENBQUM7QUFFL0QsK0ZBQStGO0FBQy9GLE1BTWEsT0FDWCxTQUFRLFlBQVk7SUFrQnBCLDhEQUE4RDtJQUM5RCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLFNBQXdCO1FBQ3BDLElBQ0UsU0FBUztZQUNULFNBQVMsS0FBSyxLQUFLO1lBQ25CLFNBQVMsS0FBSyxNQUFNO1lBQ3BCLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUMvQztZQUNBLE1BQU0sNEJBQTRCLENBQUMsU0FBUyxDQUFD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QUFDLFlBQVksRUFBRTtRQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgSGFzSW5pdGlhbGl6ZWQsIG1peGluRGlzYWJsZWQsIG1peGluSW5pdGlhbGl6ZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0LWRpcmVjdGlvbic7XG5pbXBvcnQge1xuICBnZXRTb3J0RHVwbGljYXRlU29ydGFibGVJZEVycm9yLFxuICBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IsXG4gIGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IsXG59IGZyb20gJy4vc29ydC1lcnJvcnMnO1xuXG4vKiogUG9zaXRpb24gb2YgdGhlIGFycm93IHRoYXQgZGlzcGxheXMgd2hlbiBzb3J0ZWQuICovXG5leHBvcnQgdHlwZSBTb3J0SGVhZGVyQXJyb3dQb3NpdGlvbiA9ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuLyoqIEludGVyZmFjZSBmb3IgYSBkaXJlY3RpdmUgdGhhdCBob2xkcyBzb3J0aW5nIHN0YXRlIGNvbnN1bWVkIGJ5IGBNYXRTb3J0SGVhZGVyYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydGFibGUge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBTdGFydGluZyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc3RhcnQ6IFNvcnREaXJlY3Rpb247XG5cbiAgLyoqIFdoZXRoZXIgdG8gZGlzYWJsZSBjbGVhcmluZyB0aGUgc29ydGluZyBzdGF0ZS4gKi9cbiAgZGlzYWJsZUNsZWFyOiBib29sZWFuO1xufVxuXG4vKiogVGhlIGN1cnJlbnQgc29ydCBzdGF0ZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XG4gIC8qKiBUaGUgaWQgb2YgdGhlIGNvbHVtbiBiZWluZyBzb3J0ZWQuICovXG4gIGFjdGl2ZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24uICovXG4gIGRpcmVjdGlvbjogU29ydERpcmVjdGlvbjtcbn1cblxuLyoqIERlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zb3J0YC4gICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNvcnREZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBXaGV0aGVyIHRvIGRpc2FibGUgY2xlYXJpbmcgdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIGRpc2FibGVDbGVhcj86IGJvb2xlYW47XG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgYXJyb3cgdGhhdCBkaXNwbGF5cyB3aGVuIHNvcnRlZC4gKi9cbiAgYXJyb3dQb3NpdGlvbj86IFNvcnRIZWFkZXJBcnJvd1Bvc2l0aW9uO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zb3J0YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU09SVF9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0U29ydERlZmF1bHRPcHRpb25zPihcbiAgJ01BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUycsXG4pO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNvcnQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFNvcnRCYXNlID0gbWl4aW5Jbml0aWFsaXplZChtaXhpbkRpc2FibGVkKGNsYXNzIHt9KSk7XG5cbi8qKiBDb250YWluZXIgZm9yIE1hdFNvcnRhYmxlcyB0byBtYW5hZ2UgdGhlIHNvcnQgc3RhdGUgYW5kIHByb3ZpZGUgZGVmYXVsdCBzb3J0IHBhcmFtZXRlcnMuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0U29ydF0nLFxuICBleHBvcnRBczogJ21hdFNvcnQnLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1zb3J0J30sXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0U29ydERpc2FibGVkJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnRcbiAgZXh0ZW5kcyBfTWF0U29ydEJhc2VcbiAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdFxue1xuICAvKiogQ29sbGVjdGlvbiBvZiBhbGwgcmVnaXN0ZXJlZCBzb3J0YWJsZXMgdGhhdCB0aGlzIGRpcmVjdGl2ZSBtYW5hZ2VzLiAqL1xuICBzb3J0YWJsZXMgPSBuZXcgTWFwPHN0cmluZywgTWF0U29ydGFibGU+KCk7XG5cbiAgLyoqIFVzZWQgdG8gbm90aWZ5IGFueSBjaGlsZCBjb21wb25lbnRzIGxpc3RlbmluZyB0byBzdGF0ZSBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGlkIG9mIHRoZSBtb3N0IHJlY2VudGx5IHNvcnRlZCBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCdtYXRTb3J0QWN0aXZlJykgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rpb24gdG8gc2V0IHdoZW4gYW4gTWF0U29ydGFibGUgaXMgaW5pdGlhbGx5IHNvcnRlZC5cbiAgICogTWF5IGJlIG92ZXJyaWRkZW4gYnkgdGhlIE1hdFNvcnRhYmxlJ3Mgc29ydCBzdGFydC5cbiAgICovXG4gIEBJbnB1dCgnbWF0U29ydFN0YXJ0Jykgc3RhcnQ6IFNvcnREaXJlY3Rpb24gPSAnYXNjJztcblxuICAvKiogVGhlIHNvcnQgZGlyZWN0aW9uIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnREaXJlY3Rpb24nKVxuICBnZXQgZGlyZWN0aW9uKCk6IFNvcnREaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG4gIH1cbiAgc2V0IGRpcmVjdGlvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pIHtcbiAgICBpZiAoXG4gICAgICBkaXJlY3Rpb24gJiZcbiAgICAgIGRpcmVjdGlvbiAhPT0gJ2FzYycgJiZcbiAgICAgIGRpcmVjdGlvbiAhPT0gJ2Rlc2MnICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICkge1xuICAgICAgdGhyb3cgZ2V0U29ydEludmFsaWREaXJlY3Rpb25FcnJvcihkaXJlY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLl9kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gIH1cbiAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzYWJsZSB0aGUgdXNlciBmcm9tIGNsZWFyaW5nIHRoZSBzb3J0IGJ5IGZpbmlzaGluZyB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUuXG4gICAqIE1heSBiZSBvdmVycmlkZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIGRpc2FibGUgY2xlYXIgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnREaXNhYmxlQ2xlYXInKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQ2xlYXI7XG4gIH1cbiAgc2V0IGRpc2FibGVDbGVhcih2OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlQ2xlYXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsZWFyOiBib29sZWFuO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyBlaXRoZXIgdGhlIGFjdGl2ZSBzb3J0IG9yIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBAT3V0cHV0KCdtYXRTb3J0Q2hhbmdlJykgcmVhZG9ubHkgc29ydENoYW5nZTogRXZlbnRFbWl0dGVyPFNvcnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxTb3J0PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfU09SVF9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTb3J0RGVmYXVsdE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gQWRkcyB0aGUgTWF0U29ydGFibGUgdG8gdGhlXG4gICAqIGNvbGxlY3Rpb24gb2YgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgcmVnaXN0ZXIoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCFzb3J0YWJsZS5pZCkge1xuICAgICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc29ydGFibGVzLmhhcyhzb3J0YWJsZS5pZCkpIHtcbiAgICAgICAgdGhyb3cgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcihzb3J0YWJsZS5pZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zb3J0YWJsZXMuc2V0KHNvcnRhYmxlLmlkLCBzb3J0YWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogVW5yZWdpc3RlciBmdW5jdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBjb250YWluZWQgTWF0U29ydGFibGVzLiBSZW1vdmVzIHRoZSBNYXRTb3J0YWJsZSBmcm9tIHRoZVxuICAgKiBjb2xsZWN0aW9uIG9mIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuXG4gICAqL1xuICBkZXJlZ2lzdGVyKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIHRoaXMuc29ydGFibGVzLmRlbGV0ZShzb3J0YWJsZS5pZCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYWN0aXZlIHNvcnQgaWQgYW5kIGRldGVybWluZXMgdGhlIG5ldyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc29ydChzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmUgIT0gc29ydGFibGUuaWQpIHtcbiAgICAgIHRoaXMuYWN0aXZlID0gc29ydGFibGUuaWQ7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IHNvcnRhYmxlLnN0YXJ0ID8gc29ydGFibGUuc3RhcnQgOiB0aGlzLnN0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuZ2V0TmV4dFNvcnREaXJlY3Rpb24oc29ydGFibGUpO1xuICAgIH1cblxuICAgIHRoaXMuc29ydENoYW5nZS5lbWl0KHthY3RpdmU6IHRoaXMuYWN0aXZlLCBkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9ufSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgbmV4dCBzb3J0IGRpcmVjdGlvbiBvZiB0aGUgYWN0aXZlIHNvcnRhYmxlLCBjaGVja2luZyBmb3IgcG90ZW50aWFsIG92ZXJyaWRlcy4gKi9cbiAgZ2V0TmV4dFNvcnREaXJlY3Rpb24oc29ydGFibGU6IE1hdFNvcnRhYmxlKTogU29ydERpcmVjdGlvbiB7XG4gICAgaWYgKCFzb3J0YWJsZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUgd2l0aCB0aGUgcG90ZW50aWFsIHNvcnRhYmxlIG92ZXJyaWRlcy5cbiAgICBjb25zdCBkaXNhYmxlQ2xlYXIgPVxuICAgICAgc29ydGFibGU/LmRpc2FibGVDbGVhciA/PyB0aGlzLmRpc2FibGVDbGVhciA/PyAhIXRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlQ2xlYXI7XG4gICAgbGV0IHNvcnREaXJlY3Rpb25DeWNsZSA9IGdldFNvcnREaXJlY3Rpb25DeWNsZShzb3J0YWJsZS5zdGFydCB8fCB0aGlzLnN0YXJ0LCBkaXNhYmxlQ2xlYXIpO1xuXG4gICAgLy8gR2V0IGFuZCByZXR1cm4gdGhlIG5leHQgZGlyZWN0aW9uIGluIHRoZSBjeWNsZVxuICAgIGxldCBuZXh0RGlyZWN0aW9uSW5kZXggPSBzb3J0RGlyZWN0aW9uQ3ljbGUuaW5kZXhPZih0aGlzLmRpcmVjdGlvbikgKyAxO1xuICAgIGlmIChuZXh0RGlyZWN0aW9uSW5kZXggPj0gc29ydERpcmVjdGlvbkN5Y2xlLmxlbmd0aCkge1xuICAgICAgbmV4dERpcmVjdGlvbkluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnREaXJlY3Rpb25DeWNsZVtuZXh0RGlyZWN0aW9uSW5kZXhdO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cbn1cblxuLyoqIFJldHVybnMgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHRvIHVzZSBnaXZlbiB0aGUgcHJvdmlkZWQgcGFyYW1ldGVycyBvZiBvcmRlciBhbmQgY2xlYXIuICovXG5mdW5jdGlvbiBnZXRTb3J0RGlyZWN0aW9uQ3ljbGUoc3RhcnQ6IFNvcnREaXJlY3Rpb24sIGRpc2FibGVDbGVhcjogYm9vbGVhbik6IFNvcnREaXJlY3Rpb25bXSB7XG4gIGxldCBzb3J0T3JkZXI6IFNvcnREaXJlY3Rpb25bXSA9IFsnYXNjJywgJ2Rlc2MnXTtcbiAgaWYgKHN0YXJ0ID09ICdkZXNjJykge1xuICAgIHNvcnRPcmRlci5yZXZlcnNlKCk7XG4gIH1cbiAgaWYgKCFkaXNhYmxlQ2xlYXIpIHtcbiAgICBzb3J0T3JkZXIucHVzaCgnJyk7XG4gIH1cblxuICByZXR1cm4gc29ydE9yZGVyO1xufVxuIl19