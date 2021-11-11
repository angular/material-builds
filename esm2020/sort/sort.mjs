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
export class MatSort extends _MatSortBase {
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
     * May be overriden by the MatSortable's disable clear input.
     */
    get disableClear() {
        return this._disableClear;
    }
    set disableClear(v) {
        this._disableClear = coerceBooleanProperty(v);
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
MatSort.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatSort, deps: [{ token: MAT_SORT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatSort.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatSort, selector: "[matSort]", inputs: { disabled: ["matSortDisabled", "disabled"], active: ["matSortActive", "active"], start: ["matSortStart", "start"], direction: ["matSortDirection", "direction"], disableClear: ["matSortDisableClear", "disableClear"] }, outputs: { sortChange: "matSortChange" }, host: { classAttribute: "mat-sort" }, exportAs: ["matSort"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatSort, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ25HLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDOztBQTZCdkIsaUZBQWlGO0FBQ2pGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUN4RCwwQkFBMEIsQ0FDM0IsQ0FBQztBQUVGLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO0NBQVEsQ0FBQyxDQUFDLENBQUM7QUFFL0QsK0ZBQStGO0FBTy9GLE1BQU0sT0FBTyxPQUNYLFNBQVEsWUFBWTtJQW9EcEIsWUFHVSxlQUF1QztRQUUvQyxLQUFLLEVBQUUsQ0FBQztRQUZBLG9CQUFlLEdBQWYsZUFBZSxDQUF3QjtRQXBEakQsMEVBQTBFO1FBQzFFLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztRQUUzQyxzRUFBc0U7UUFDN0Qsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBSzdDOzs7V0FHRztRQUNvQixVQUFLLEdBQW1CLEtBQUssQ0FBQztRQWtCN0MsZUFBVSxHQUFrQixFQUFFLENB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WUFBWSxFQUFFO1FBQ2pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEI7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCwgbWl4aW5EaXNhYmxlZCwgbWl4aW5Jbml0aWFsaXplZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7XG4gIGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3IsXG4gIGdldFNvcnRIZWFkZXJNaXNzaW5nSWRFcnJvcixcbiAgZ2V0U29ydEludmFsaWREaXJlY3Rpb25FcnJvcixcbn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5cbi8qKiBJbnRlcmZhY2UgZm9yIGEgZGlyZWN0aXZlIHRoYXQgaG9sZHMgc29ydGluZyBzdGF0ZSBjb25zdW1lZCBieSBgTWF0U29ydEhlYWRlcmAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNvcnRhYmxlIHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgaWQ6IHN0cmluZztcblxuICAvKiogU3RhcnRpbmcgc29ydCBkaXJlY3Rpb24uICovXG4gIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJztcblxuICAvKiogV2hldGhlciB0byBkaXNhYmxlIGNsZWFyaW5nIHRoZSBzb3J0aW5nIHN0YXRlLiAqL1xuICBkaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG59XG5cbi8qKiBUaGUgY3VycmVudCBzb3J0IHN0YXRlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3J0IHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uO1xufVxuXG4vKiogRGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LXNvcnRgLiAgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydERlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdG8gZGlzYWJsZSBjbGVhcmluZyB0aGUgc29ydGluZyBzdGF0ZS4gKi9cbiAgZGlzYWJsZUNsZWFyPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtc29ydGAuICovXG5leHBvcnQgY29uc3QgTUFUX1NPUlRfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdFNvcnREZWZhdWx0T3B0aW9ucz4oXG4gICdNQVRfU09SVF9ERUZBVUxUX09QVElPTlMnLFxuKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRTb3J0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRTb3J0QmFzZSA9IG1peGluSW5pdGlhbGl6ZWQobWl4aW5EaXNhYmxlZChjbGFzcyB7fSkpO1xuXG4vKiogQ29udGFpbmVyIGZvciBNYXRTb3J0YWJsZXMgdG8gbWFuYWdlIHRoZSBzb3J0IHN0YXRlIGFuZCBwcm92aWRlIGRlZmF1bHQgc29ydCBwYXJhbWV0ZXJzLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFNvcnRdJyxcbiAgZXhwb3J0QXM6ICdtYXRTb3J0JyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtc29ydCd9LFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IG1hdFNvcnREaXNhYmxlZCddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0XG4gIGV4dGVuZHMgX01hdFNvcnRCYXNlXG4gIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgSGFzSW5pdGlhbGl6ZWQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXRcbntcbiAgLyoqIENvbGxlY3Rpb24gb2YgYWxsIHJlZ2lzdGVyZWQgc29ydGFibGVzIHRoYXQgdGhpcyBkaXJlY3RpdmUgbWFuYWdlcy4gKi9cbiAgc29ydGFibGVzID0gbmV3IE1hcDxzdHJpbmcsIE1hdFNvcnRhYmxlPigpO1xuXG4gIC8qKiBVc2VkIHRvIG5vdGlmeSBhbnkgY2hpbGQgY29tcG9uZW50cyBsaXN0ZW5pbmcgdG8gc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBpZCBvZiB0aGUgbW9zdCByZWNlbnRseSBzb3J0ZWQgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydEFjdGl2ZScpIGFjdGl2ZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0aW9uIHRvIHNldCB3aGVuIGFuIE1hdFNvcnRhYmxlIGlzIGluaXRpYWxseSBzb3J0ZWQuXG4gICAqIE1heSBiZSBvdmVycmlkZW4gYnkgdGhlIE1hdFNvcnRhYmxlJ3Mgc29ydCBzdGFydC5cbiAgICovXG4gIEBJbnB1dCgnbWF0U29ydFN0YXJ0Jykgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnID0gJ2FzYyc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbiBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCdtYXRTb3J0RGlyZWN0aW9uJylcbiAgZ2V0IGRpcmVjdGlvbigpOiBTb3J0RGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xuICB9XG4gIHNldCBkaXJlY3Rpb24oZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uKSB7XG4gICAgaWYgKFxuICAgICAgZGlyZWN0aW9uICYmXG4gICAgICBkaXJlY3Rpb24gIT09ICdhc2MnICYmXG4gICAgICBkaXJlY3Rpb24gIT09ICdkZXNjJyAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICApIHtcbiAgICAgIHRocm93IGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IoZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgdGhlIHVzZXIgZnJvbSBjbGVhcmluZyB0aGUgc29ydCBieSBmaW5pc2hpbmcgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIGRpc2FibGUgY2xlYXIgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnREaXNhYmxlQ2xlYXInKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQ2xlYXI7XG4gIH1cbiAgc2V0IGRpc2FibGVDbGVhcih2OiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgZWl0aGVyIHRoZSBhY3RpdmUgc29ydCBvciBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgQE91dHB1dCgnbWF0U29ydENoYW5nZScpIHJlYWRvbmx5IHNvcnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxTb3J0PiA9IG5ldyBFdmVudEVtaXR0ZXI8U29ydD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX1NPUlRfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zPzogTWF0U29ydERlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYnkgdGhlIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuIEFkZHMgdGhlIE1hdFNvcnRhYmxlIHRvIHRoZVxuICAgKiBjb2xsZWN0aW9uIG9mIE1hdFNvcnRhYmxlcy5cbiAgICovXG4gIHJlZ2lzdGVyKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghc29ydGFibGUuaWQpIHtcbiAgICAgICAgdGhyb3cgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlcy5oYXMoc29ydGFibGUuaWQpKSB7XG4gICAgICAgIHRocm93IGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3Ioc29ydGFibGUuaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc29ydGFibGVzLnNldChzb3J0YWJsZS5pZCwgc29ydGFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gUmVtb3ZlcyB0aGUgTWF0U29ydGFibGUgZnJvbSB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBjb250YWluZWQgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgZGVyZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICB0aGlzLnNvcnRhYmxlcy5kZWxldGUoc29ydGFibGUuaWQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBzb3J0IGlkIGFuZCBkZXRlcm1pbmVzIHRoZSBuZXcgc29ydCBkaXJlY3Rpb24uICovXG4gIHNvcnQoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlICE9IHNvcnRhYmxlLmlkKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHNvcnRhYmxlLmlkO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBzb3J0YWJsZS5zdGFydCA/IHNvcnRhYmxlLnN0YXJ0IDogdGhpcy5zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRDaGFuZ2UuZW1pdCh7YWN0aXZlOiB0aGlzLmFjdGl2ZSwgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbn0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGFjdGl2ZSBzb3J0YWJsZSwgY2hlY2tpbmcgZm9yIHBvdGVudGlhbCBvdmVycmlkZXMuICovXG4gIGdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IFNvcnREaXJlY3Rpb24ge1xuICAgIGlmICghc29ydGFibGUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHdpdGggdGhlIHBvdGVudGlhbCBzb3J0YWJsZSBvdmVycmlkZXMuXG4gICAgY29uc3QgZGlzYWJsZUNsZWFyID1cbiAgICAgIHNvcnRhYmxlPy5kaXNhYmxlQ2xlYXIgPz8gdGhpcy5kaXNhYmxlQ2xlYXIgPz8gISF0aGlzLl9kZWZhdWx0T3B0aW9ucz8uZGlzYWJsZUNsZWFyO1xuICAgIGxldCBzb3J0RGlyZWN0aW9uQ3ljbGUgPSBnZXRTb3J0RGlyZWN0aW9uQ3ljbGUoc29ydGFibGUuc3RhcnQgfHwgdGhpcy5zdGFydCwgZGlzYWJsZUNsZWFyKTtcblxuICAgIC8vIEdldCBhbmQgcmV0dXJuIHRoZSBuZXh0IGRpcmVjdGlvbiBpbiB0aGUgY3ljbGVcbiAgICBsZXQgbmV4dERpcmVjdGlvbkluZGV4ID0gc29ydERpcmVjdGlvbkN5Y2xlLmluZGV4T2YodGhpcy5kaXJlY3Rpb24pICsgMTtcbiAgICBpZiAobmV4dERpcmVjdGlvbkluZGV4ID49IHNvcnREaXJlY3Rpb25DeWNsZS5sZW5ndGgpIHtcbiAgICAgIG5leHREaXJlY3Rpb25JbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBzb3J0RGlyZWN0aW9uQ3ljbGVbbmV4dERpcmVjdGlvbkluZGV4XTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX21hcmtJbml0aWFsaXplZCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVDbGVhcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqIFJldHVybnMgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHRvIHVzZSBnaXZlbiB0aGUgcHJvdmlkZWQgcGFyYW1ldGVycyBvZiBvcmRlciBhbmQgY2xlYXIuICovXG5mdW5jdGlvbiBnZXRTb3J0RGlyZWN0aW9uQ3ljbGUoc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnLCBkaXNhYmxlQ2xlYXI6IGJvb2xlYW4pOiBTb3J0RGlyZWN0aW9uW10ge1xuICBsZXQgc29ydE9yZGVyOiBTb3J0RGlyZWN0aW9uW10gPSBbJ2FzYycsICdkZXNjJ107XG4gIGlmIChzdGFydCA9PSAnZGVzYycpIHtcbiAgICBzb3J0T3JkZXIucmV2ZXJzZSgpO1xuICB9XG4gIGlmICghZGlzYWJsZUNsZWFyKSB7XG4gICAgc29ydE9yZGVyLnB1c2goJycpO1xuICB9XG5cbiAgcmV0dXJuIHNvcnRPcmRlcjtcbn1cbiJdfQ==