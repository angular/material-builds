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
        const disableClear = sortable?.disableClear ??
            this.disableClear ?? !!this._defaultOptions?.disableClear;
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
MatSort.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSort, deps: [{ token: MAT_SORT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatSort.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSort, selector: "[matSort]", inputs: { disabled: ["matSortDisabled", "disabled"], active: ["matSortActive", "active"], start: ["matSortStart", "start"], direction: ["matSortDirection", "direction"], disableClear: ["matSortDisableClear", "disableClear"] }, outputs: { sortChange: "matSortChange" }, host: { classAttribute: "mat-sort" }, exportAs: ["matSort"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSort, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matSort]',
                    exportAs: 'matSort',
                    host: { 'class': 'mat-sort' },
                    inputs: ['disabled: matSortDisabled']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGdCQUFnQixHQUNqQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDOztBQTZCdkIsaUZBQWlGO0FBQ2pGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUNqQyxJQUFJLGNBQWMsQ0FBd0IsMEJBQTBCLENBQUMsQ0FBQztBQUcxRSw4Q0FBOEM7QUFDOUMsb0JBQW9CO0FBQ3BCLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQyxDQUFDO0FBRS9ELCtGQUErRjtBQU8vRixNQUFNLE9BQU8sT0FBUSxTQUFRLFlBQVk7SUF5Q3ZDLFlBQ29CLGVBQXVDO1FBQ3pELEtBQUssRUFBRSxDQUFDO1FBRFUsb0JBQWUsR0FBZixlQUFlLENBQXdCO1FBeEMzRCwwRUFBMEU7UUFDMUUsY0FBUyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1FBRTNDLHNFQUFzRTtRQUM3RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFLN0M7OztXQUdHO1FBQ29CLFVBQUssR0FBbUIsS0FBSyxDQUFDO1FBWTdDLGVBQVUsR0FBa0IsRUFBRSxD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LFlBQVksRUFBRTtRQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FBRTtJQUUxQyxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgSGFzSW5pdGlhbGl6ZWQsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluSW5pdGlhbGl6ZWQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0LWRpcmVjdGlvbic7XG5pbXBvcnQge1xuICBnZXRTb3J0RHVwbGljYXRlU29ydGFibGVJZEVycm9yLFxuICBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IsXG4gIGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IsXG59IGZyb20gJy4vc29ydC1lcnJvcnMnO1xuXG4vKiogSW50ZXJmYWNlIGZvciBhIGRpcmVjdGl2ZSB0aGF0IGhvbGRzIHNvcnRpbmcgc3RhdGUgY29uc3VtZWQgYnkgYE1hdFNvcnRIZWFkZXJgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTb3J0YWJsZSB7XG4gIC8qKiBUaGUgaWQgb2YgdGhlIGNvbHVtbiBiZWluZyBzb3J0ZWQuICovXG4gIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFN0YXJ0aW5nIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBzdGFydDogJ2FzYycgfCAnZGVzYyc7XG5cbiAgLyoqIFdoZXRoZXIgdG8gZGlzYWJsZSBjbGVhcmluZyB0aGUgc29ydGluZyBzdGF0ZS4gKi9cbiAgZGlzYWJsZUNsZWFyOiBib29sZWFuO1xufVxuXG4vKiogVGhlIGN1cnJlbnQgc29ydCBzdGF0ZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XG4gIC8qKiBUaGUgaWQgb2YgdGhlIGNvbHVtbiBiZWluZyBzb3J0ZWQuICovXG4gIGFjdGl2ZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24uICovXG4gIGRpcmVjdGlvbjogU29ydERpcmVjdGlvbjtcbn1cblxuLyoqIERlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zb3J0YC4gICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNvcnREZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBXaGV0aGVyIHRvIGRpc2FibGUgY2xlYXJpbmcgdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIGRpc2FibGVDbGVhcj86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LXNvcnRgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFNvcnREZWZhdWx0T3B0aW9ucz4oJ01BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUycpO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U29ydC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U29ydEJhc2UgPSBtaXhpbkluaXRpYWxpemVkKG1peGluRGlzYWJsZWQoY2xhc3Mge30pKTtcblxuLyoqIENvbnRhaW5lciBmb3IgTWF0U29ydGFibGVzIHRvIG1hbmFnZSB0aGUgc29ydCBzdGF0ZSBhbmQgcHJvdmlkZSBkZWZhdWx0IHNvcnQgcGFyYW1ldGVycy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRTb3J0XScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydCcsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LXNvcnQnfSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkOiBtYXRTb3J0RGlzYWJsZWQnXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0IGV4dGVuZHMgX01hdFNvcnRCYXNlXG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBDb2xsZWN0aW9uIG9mIGFsbCByZWdpc3RlcmVkIHNvcnRhYmxlcyB0aGF0IHRoaXMgZGlyZWN0aXZlIG1hbmFnZXMuICovXG4gIHNvcnRhYmxlcyA9IG5ldyBNYXA8c3RyaW5nLCBNYXRTb3J0YWJsZT4oKTtcblxuICAvKiogVXNlZCB0byBub3RpZnkgYW55IGNoaWxkIGNvbXBvbmVudHMgbGlzdGVuaW5nIHRvIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgaWQgb2YgdGhlIG1vc3QgcmVjZW50bHkgc29ydGVkIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnRBY3RpdmUnKSBhY3RpdmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRpcmVjdGlvbiB0byBzZXQgd2hlbiBhbiBNYXRTb3J0YWJsZSBpcyBpbml0aWFsbHkgc29ydGVkLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIHNvcnQgc3RhcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnRTdGFydCcpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJyA9ICdhc2MnO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydERpcmVjdGlvbicpXG4gIGdldCBkaXJlY3Rpb24oKTogU29ydERpcmVjdGlvbiB7IHJldHVybiB0aGlzLl9kaXJlY3Rpb247IH1cbiAgc2V0IGRpcmVjdGlvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uICYmIGRpcmVjdGlvbiAhPT0gJ2FzYycgJiYgZGlyZWN0aW9uICE9PSAnZGVzYycgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SW52YWxpZERpcmVjdGlvbkVycm9yKGRpcmVjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgfVxuICBwcml2YXRlIF9kaXJlY3Rpb246IFNvcnREaXJlY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNhYmxlIHRoZSB1c2VyIGZyb20gY2xlYXJpbmcgdGhlIHNvcnQgYnkgZmluaXNoaW5nIHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZS5cbiAgICogTWF5IGJlIG92ZXJyaWRlbiBieSB0aGUgTWF0U29ydGFibGUncyBkaXNhYmxlIGNsZWFyIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdtYXRTb3J0RGlzYWJsZUNsZWFyJylcbiAgZ2V0IGRpc2FibGVDbGVhcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbGVhcjsgfVxuICBzZXQgZGlzYWJsZUNsZWFyKHY6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgZWl0aGVyIHRoZSBhY3RpdmUgc29ydCBvciBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgQE91dHB1dCgnbWF0U29ydENoYW5nZScpIHJlYWRvbmx5IHNvcnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxTb3J0PiA9IG5ldyBFdmVudEVtaXR0ZXI8U29ydD4oKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTb3J0RGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYnkgdGhlIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuIEFkZHMgdGhlIE1hdFNvcnRhYmxlIHRvIHRoZVxuICAgKiBjb2xsZWN0aW9uIG9mIE1hdFNvcnRhYmxlcy5cbiAgICovXG4gIHJlZ2lzdGVyKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghc29ydGFibGUuaWQpIHtcbiAgICAgICAgdGhyb3cgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlcy5oYXMoc29ydGFibGUuaWQpKSB7XG4gICAgICAgIHRocm93IGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3Ioc29ydGFibGUuaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc29ydGFibGVzLnNldChzb3J0YWJsZS5pZCwgc29ydGFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gUmVtb3ZlcyB0aGUgTWF0U29ydGFibGUgZnJvbSB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBjb250YWluZWQgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgZGVyZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICB0aGlzLnNvcnRhYmxlcy5kZWxldGUoc29ydGFibGUuaWQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBzb3J0IGlkIGFuZCBkZXRlcm1pbmVzIHRoZSBuZXcgc29ydCBkaXJlY3Rpb24uICovXG4gIHNvcnQoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlICE9IHNvcnRhYmxlLmlkKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHNvcnRhYmxlLmlkO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBzb3J0YWJsZS5zdGFydCA/IHNvcnRhYmxlLnN0YXJ0IDogdGhpcy5zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRDaGFuZ2UuZW1pdCh7YWN0aXZlOiB0aGlzLmFjdGl2ZSwgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbn0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGFjdGl2ZSBzb3J0YWJsZSwgY2hlY2tpbmcgZm9yIHBvdGVudGlhbCBvdmVycmlkZXMuICovXG4gIGdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IFNvcnREaXJlY3Rpb24ge1xuICAgIGlmICghc29ydGFibGUpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAvLyBHZXQgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHdpdGggdGhlIHBvdGVudGlhbCBzb3J0YWJsZSBvdmVycmlkZXMuXG4gICAgY29uc3QgZGlzYWJsZUNsZWFyID0gc29ydGFibGU/LmRpc2FibGVDbGVhciA/P1xuICAgICAgICB0aGlzLmRpc2FibGVDbGVhciA/PyAhIXRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlQ2xlYXI7XG4gICAgbGV0IHNvcnREaXJlY3Rpb25DeWNsZSA9IGdldFNvcnREaXJlY3Rpb25DeWNsZShzb3J0YWJsZS5zdGFydCB8fCB0aGlzLnN0YXJ0LCBkaXNhYmxlQ2xlYXIpO1xuXG4gICAgLy8gR2V0IGFuZCByZXR1cm4gdGhlIG5leHQgZGlyZWN0aW9uIGluIHRoZSBjeWNsZVxuICAgIGxldCBuZXh0RGlyZWN0aW9uSW5kZXggPSBzb3J0RGlyZWN0aW9uQ3ljbGUuaW5kZXhPZih0aGlzLmRpcmVjdGlvbikgKyAxO1xuICAgIGlmIChuZXh0RGlyZWN0aW9uSW5kZXggPj0gc29ydERpcmVjdGlvbkN5Y2xlLmxlbmd0aCkgeyBuZXh0RGlyZWN0aW9uSW5kZXggPSAwOyB9XG4gICAgcmV0dXJuIHNvcnREaXJlY3Rpb25DeWNsZVtuZXh0RGlyZWN0aW9uSW5kZXhdO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsZWFyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKiogUmV0dXJucyB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUgdG8gdXNlIGdpdmVuIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzIG9mIG9yZGVyIGFuZCBjbGVhci4gKi9cbmZ1bmN0aW9uIGdldFNvcnREaXJlY3Rpb25DeWNsZShzdGFydDogJ2FzYycgfCAnZGVzYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUNsZWFyOiBib29sZWFuKTogU29ydERpcmVjdGlvbltdIHtcbiAgbGV0IHNvcnRPcmRlcjogU29ydERpcmVjdGlvbltdID0gWydhc2MnLCAnZGVzYyddO1xuICBpZiAoc3RhcnQgPT0gJ2Rlc2MnKSB7IHNvcnRPcmRlci5yZXZlcnNlKCk7IH1cbiAgaWYgKCFkaXNhYmxlQ2xlYXIpIHsgc29ydE9yZGVyLnB1c2goJycpOyB9XG5cbiAgcmV0dXJuIHNvcnRPcmRlcjtcbn1cbiJdfQ==