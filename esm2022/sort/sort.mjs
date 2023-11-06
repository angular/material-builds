/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, Inject, InjectionToken, Input, Optional, Output, booleanAttribute, } from '@angular/core';
import { mixinInitialized } from '@angular/material/core';
import { Subject } from 'rxjs';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError, } from './sort-errors';
import * as i0 from "@angular/core";
/** Injection token to be used to override the default options for `mat-sort`. */
export const MAT_SORT_DEFAULT_OPTIONS = new InjectionToken('MAT_SORT_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to MatSort.
/** @docs-private */
const _MatSortBase = mixinInitialized(class {
});
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
export class MatSort extends _MatSortBase {
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
        /** Whether the sortable is disabled. */
        this.disabled = false;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatSort, deps: [{ token: MAT_SORT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.0-rc.2", type: MatSort, selector: "[matSort]", inputs: { active: ["matSortActive", "active"], start: ["matSortStart", "start"], direction: ["matSortDirection", "direction"], disableClear: ["matSortDisableClear", "disableClear", booleanAttribute], disabled: ["matSortDisabled", "disabled", booleanAttribute] }, outputs: { sortChange: "matSortChange" }, host: { classAttribute: "mat-sort" }, exportAs: ["matSort"], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatSort, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matSort]',
                    exportAs: 'matSort',
                    host: {
                        'class': 'mat-sort',
                    },
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_SORT_DEFAULT_OPTIONS]
                }] }], propDecorators: { active: [{
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
                args: [{ alias: 'matSortDisableClear', transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ alias: 'matSortDisabled', transform: booleanAttribute }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFpQixnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDOztBQWtDdkIsaUZBQWlGO0FBQ2pGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUN4RCwwQkFBMEIsQ0FDM0IsQ0FBQztBQUVGLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFFaEQsK0ZBQStGO0FBUS9GLE1BQU0sT0FBTyxPQUFRLFNBQVEsWUFBWTtJQWdCdkMsOERBQThEO0lBQzlELElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsU0FBd0I7UUFDcEMsSUFDRSxTQUFTO1lBQ1QsU0FBUyxLQUFLLEtBQUs7WUFDbkIsU0FBUyxLQUFLLE1BQU07WUFDcEIsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQy9DO1lBQ0EsTUFBTSw0QkFBNEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMvQztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlC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QjtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SGFzSW5pdGlhbGl6ZWQsIG1peGluSW5pdGlhbGl6ZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0LWRpcmVjdGlvbic7XG5pbXBvcnQge1xuICBnZXRTb3J0RHVwbGljYXRlU29ydGFibGVJZEVycm9yLFxuICBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IsXG4gIGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IsXG59IGZyb20gJy4vc29ydC1lcnJvcnMnO1xuXG4vKiogUG9zaXRpb24gb2YgdGhlIGFycm93IHRoYXQgZGlzcGxheXMgd2hlbiBzb3J0ZWQuICovXG5leHBvcnQgdHlwZSBTb3J0SGVhZGVyQXJyb3dQb3NpdGlvbiA9ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuLyoqIEludGVyZmFjZSBmb3IgYSBkaXJlY3RpdmUgdGhhdCBob2xkcyBzb3J0aW5nIHN0YXRlIGNvbnN1bWVkIGJ5IGBNYXRTb3J0SGVhZGVyYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydGFibGUge1xuICAvKiogVGhlIGlkIG9mIHRoZSBjb2x1bW4gYmVpbmcgc29ydGVkLiAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBTdGFydGluZyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc3RhcnQ6IFNvcnREaXJlY3Rpb247XG5cbiAgLyoqIFdoZXRoZXIgdG8gZGlzYWJsZSBjbGVhcmluZyB0aGUgc29ydGluZyBzdGF0ZS4gKi9cbiAgZGlzYWJsZUNsZWFyOiBib29sZWFuO1xufVxuXG4vKiogVGhlIGN1cnJlbnQgc29ydCBzdGF0ZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XG4gIC8qKiBUaGUgaWQgb2YgdGhlIGNvbHVtbiBiZWluZyBzb3J0ZWQuICovXG4gIGFjdGl2ZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24uICovXG4gIGRpcmVjdGlvbjogU29ydERpcmVjdGlvbjtcbn1cblxuLyoqIERlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zb3J0YC4gICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNvcnREZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBXaGV0aGVyIHRvIGRpc2FibGUgY2xlYXJpbmcgdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIGRpc2FibGVDbGVhcj86IGJvb2xlYW47XG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgYXJyb3cgdGhhdCBkaXNwbGF5cyB3aGVuIHNvcnRlZC4gKi9cbiAgYXJyb3dQb3NpdGlvbj86IFNvcnRIZWFkZXJBcnJvd1Bvc2l0aW9uO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1zb3J0YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU09SVF9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0U29ydERlZmF1bHRPcHRpb25zPihcbiAgJ01BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUycsXG4pO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNvcnQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFNvcnRCYXNlID0gbWl4aW5Jbml0aWFsaXplZChjbGFzcyB7fSk7XG5cbi8qKiBDb250YWluZXIgZm9yIE1hdFNvcnRhYmxlcyB0byBtYW5hZ2UgdGhlIHNvcnQgc3RhdGUgYW5kIHByb3ZpZGUgZGVmYXVsdCBzb3J0IHBhcmFtZXRlcnMuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0U29ydF0nLFxuICBleHBvcnRBczogJ21hdFNvcnQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zb3J0JyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U29ydCBleHRlbmRzIF9NYXRTb3J0QmFzZSBpbXBsZW1lbnRzIEhhc0luaXRpYWxpemVkLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgLyoqIENvbGxlY3Rpb24gb2YgYWxsIHJlZ2lzdGVyZWQgc29ydGFibGVzIHRoYXQgdGhpcyBkaXJlY3RpdmUgbWFuYWdlcy4gKi9cbiAgc29ydGFibGVzID0gbmV3IE1hcDxzdHJpbmcsIE1hdFNvcnRhYmxlPigpO1xuXG4gIC8qKiBVc2VkIHRvIG5vdGlmeSBhbnkgY2hpbGQgY29tcG9uZW50cyBsaXN0ZW5pbmcgdG8gc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBpZCBvZiB0aGUgbW9zdCByZWNlbnRseSBzb3J0ZWQgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydEFjdGl2ZScpIGFjdGl2ZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0aW9uIHRvIHNldCB3aGVuIGFuIE1hdFNvcnRhYmxlIGlzIGluaXRpYWxseSBzb3J0ZWQuXG4gICAqIE1heSBiZSBvdmVycmlkZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIHNvcnQgc3RhcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnRTdGFydCcpIHN0YXJ0OiBTb3J0RGlyZWN0aW9uID0gJ2FzYyc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbiBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCdtYXRTb3J0RGlyZWN0aW9uJylcbiAgZ2V0IGRpcmVjdGlvbigpOiBTb3J0RGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xuICB9XG4gIHNldCBkaXJlY3Rpb24oZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uKSB7XG4gICAgaWYgKFxuICAgICAgZGlyZWN0aW9uICYmXG4gICAgICBkaXJlY3Rpb24gIT09ICdhc2MnICYmXG4gICAgICBkaXJlY3Rpb24gIT09ICdkZXNjJyAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICApIHtcbiAgICAgIHRocm93IGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IoZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgdGhlIHVzZXIgZnJvbSBjbGVhcmluZyB0aGUgc29ydCBieSBmaW5pc2hpbmcgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGRlbiBieSB0aGUgTWF0U29ydGFibGUncyBkaXNhYmxlIGNsZWFyIGlucHV0LlxuICAgKi9cbiAgQElucHV0KHthbGlhczogJ21hdFNvcnREaXNhYmxlQ2xlYXInLCB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNvcnRhYmxlIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoe2FsaWFzOiAnbWF0U29ydERpc2FibGVkJywgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgZWl0aGVyIHRoZSBhY3RpdmUgc29ydCBvciBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgQE91dHB1dCgnbWF0U29ydENoYW5nZScpIHJlYWRvbmx5IHNvcnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxTb3J0PiA9IG5ldyBFdmVudEVtaXR0ZXI8U29ydD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX1NPUlRfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zPzogTWF0U29ydERlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYnkgdGhlIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuIEFkZHMgdGhlIE1hdFNvcnRhYmxlIHRvIHRoZVxuICAgKiBjb2xsZWN0aW9uIG9mIE1hdFNvcnRhYmxlcy5cbiAgICovXG4gIHJlZ2lzdGVyKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghc29ydGFibGUuaWQpIHtcbiAgICAgICAgdGhyb3cgZ2V0U29ydEhlYWRlck1pc3NpbmdJZEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlcy5oYXMoc29ydGFibGUuaWQpKSB7XG4gICAgICAgIHRocm93IGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3Ioc29ydGFibGUuaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc29ydGFibGVzLnNldChzb3J0YWJsZS5pZCwgc29ydGFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gUmVtb3ZlcyB0aGUgTWF0U29ydGFibGUgZnJvbSB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBjb250YWluZWQgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgZGVyZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICB0aGlzLnNvcnRhYmxlcy5kZWxldGUoc29ydGFibGUuaWQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBzb3J0IGlkIGFuZCBkZXRlcm1pbmVzIHRoZSBuZXcgc29ydCBkaXJlY3Rpb24uICovXG4gIHNvcnQoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlICE9IHNvcnRhYmxlLmlkKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHNvcnRhYmxlLmlkO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBzb3J0YWJsZS5zdGFydCA/IHNvcnRhYmxlLnN0YXJ0IDogdGhpcy5zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRDaGFuZ2UuZW1pdCh7YWN0aXZlOiB0aGlzLmFjdGl2ZSwgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbn0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGFjdGl2ZSBzb3J0YWJsZSwgY2hlY2tpbmcgZm9yIHBvdGVudGlhbCBvdmVycmlkZXMuICovXG4gIGdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IFNvcnREaXJlY3Rpb24ge1xuICAgIGlmICghc29ydGFibGUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHdpdGggdGhlIHBvdGVudGlhbCBzb3J0YWJsZSBvdmVycmlkZXMuXG4gICAgY29uc3QgZGlzYWJsZUNsZWFyID1cbiAgICAgIHNvcnRhYmxlPy5kaXNhYmxlQ2xlYXIgPz8gdGhpcy5kaXNhYmxlQ2xlYXIgPz8gISF0aGlzLl9kZWZhdWx0T3B0aW9ucz8uZGlzYWJsZUNsZWFyO1xuICAgIGxldCBzb3J0RGlyZWN0aW9uQ3ljbGUgPSBnZXRTb3J0RGlyZWN0aW9uQ3ljbGUoc29ydGFibGUuc3RhcnQgfHwgdGhpcy5zdGFydCwgZGlzYWJsZUNsZWFyKTtcblxuICAgIC8vIEdldCBhbmQgcmV0dXJuIHRoZSBuZXh0IGRpcmVjdGlvbiBpbiB0aGUgY3ljbGVcbiAgICBsZXQgbmV4dERpcmVjdGlvbkluZGV4ID0gc29ydERpcmVjdGlvbkN5Y2xlLmluZGV4T2YodGhpcy5kaXJlY3Rpb24pICsgMTtcbiAgICBpZiAobmV4dERpcmVjdGlvbkluZGV4ID49IHNvcnREaXJlY3Rpb25DeWNsZS5sZW5ndGgpIHtcbiAgICAgIG5leHREaXJlY3Rpb25JbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBzb3J0RGlyZWN0aW9uQ3ljbGVbbmV4dERpcmVjdGlvbkluZGV4XTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX21hcmtJbml0aWFsaXplZCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZSB0byB1c2UgZ2l2ZW4gdGhlIHByb3ZpZGVkIHBhcmFtZXRlcnMgb2Ygb3JkZXIgYW5kIGNsZWFyLiAqL1xuZnVuY3Rpb24gZ2V0U29ydERpcmVjdGlvbkN5Y2xlKHN0YXJ0OiBTb3J0RGlyZWN0aW9uLCBkaXNhYmxlQ2xlYXI6IGJvb2xlYW4pOiBTb3J0RGlyZWN0aW9uW10ge1xuICBsZXQgc29ydE9yZGVyOiBTb3J0RGlyZWN0aW9uW10gPSBbJ2FzYycsICdkZXNjJ107XG4gIGlmIChzdGFydCA9PSAnZGVzYycpIHtcbiAgICBzb3J0T3JkZXIucmV2ZXJzZSgpO1xuICB9XG4gIGlmICghZGlzYWJsZUNsZWFyKSB7XG4gICAgc29ydE9yZGVyLnB1c2goJycpO1xuICB9XG5cbiAgcmV0dXJuIHNvcnRPcmRlcjtcbn1cbiJdfQ==