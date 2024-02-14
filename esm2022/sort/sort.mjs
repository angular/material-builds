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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatSort, deps: [{ token: MAT_SORT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.2.0", type: MatSort, isStandalone: true, selector: "[matSort]", inputs: { active: ["matSortActive", "active"], start: ["matSortStart", "start"], direction: ["matSortDirection", "direction"], disableClear: ["matSortDisableClear", "disableClear", booleanAttribute], disabled: ["matSortDisabled", "disabled", booleanAttribute] }, outputs: { sortChange: "matSortChange" }, host: { classAttribute: "mat-sort" }, exportAs: ["matSort"], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatSort, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matSort]',
                    exportAs: 'matSort',
                    host: {
                        'class': 'mat-sort',
                    },
                    standalone: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFpQixnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUNMLCtCQUErQixFQUMvQiwyQkFBMkIsRUFDM0IsNEJBQTRCLEdBQzdCLE1BQU0sZUFBZSxDQUFDOztBQWtDdkIsaUZBQWlGO0FBQ2pGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUN4RCwwQkFBMEIsQ0FDM0IsQ0FBQztBQUVGLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFFaEQsK0ZBQStGO0FBUy9GLE1BQU0sT0FBTyxPQUFRLFNBQVEsWUFBWTtJQWdCdkMsOERBQThEO0lBQzlELElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsU0FBd0I7UUFDcEMsSUFDRSxTQUFTO1lBQ1QsU0FBUyxLQUFLLEtBQUs7WUFDbkIsU0FBUyxLQUFLLE1BQU07WUFDcEIsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQy9DLENBQUM7WUFDRCxNQUFNLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMs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UUFDcEIsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEIsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIYXNJbml0aWFsaXplZCwgbWl4aW5Jbml0aWFsaXplZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7XG4gIGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3IsXG4gIGdldFNvcnRIZWFkZXJNaXNzaW5nSWRFcnJvcixcbiAgZ2V0U29ydEludmFsaWREaXJlY3Rpb25FcnJvcixcbn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5cbi8qKiBQb3NpdGlvbiBvZiB0aGUgYXJyb3cgdGhhdCBkaXNwbGF5cyB3aGVuIHNvcnRlZC4gKi9cbmV4cG9ydCB0eXBlIFNvcnRIZWFkZXJBcnJvd1Bvc2l0aW9uID0gJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4vKiogSW50ZXJmYWNlIGZvciBhIGRpcmVjdGl2ZSB0aGF0IGhvbGRzIHNvcnRpbmcgc3RhdGUgY29uc3VtZWQgYnkgYE1hdFNvcnRIZWFkZXJgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTb3J0YWJsZSB7XG4gIC8qKiBUaGUgaWQgb2YgdGhlIGNvbHVtbiBiZWluZyBzb3J0ZWQuICovXG4gIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFN0YXJ0aW5nIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBzdGFydDogU29ydERpcmVjdGlvbjtcblxuICAvKiogV2hldGhlciB0byBkaXNhYmxlIGNsZWFyaW5nIHRoZSBzb3J0aW5nIHN0YXRlLiAqL1xuICBkaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG59XG5cbi8qKiBUaGUgY3VycmVudCBzb3J0IHN0YXRlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3J0IHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uO1xufVxuXG4vKiogRGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LXNvcnRgLiAgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U29ydERlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdG8gZGlzYWJsZSBjbGVhcmluZyB0aGUgc29ydGluZyBzdGF0ZS4gKi9cbiAgZGlzYWJsZUNsZWFyPzogYm9vbGVhbjtcbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBhcnJvdyB0aGF0IGRpc3BsYXlzIHdoZW4gc29ydGVkLiAqL1xuICBhcnJvd1Bvc2l0aW9uPzogU29ydEhlYWRlckFycm93UG9zaXRpb247XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LXNvcnRgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TT1JUX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTb3J0RGVmYXVsdE9wdGlvbnM+KFxuICAnTUFUX1NPUlRfREVGQVVMVF9PUFRJT05TJyxcbik7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U29ydC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U29ydEJhc2UgPSBtaXhpbkluaXRpYWxpemVkKGNsYXNzIHt9KTtcblxuLyoqIENvbnRhaW5lciBmb3IgTWF0U29ydGFibGVzIHRvIG1hbmFnZSB0aGUgc29ydCBzdGF0ZSBhbmQgcHJvdmlkZSBkZWZhdWx0IHNvcnQgcGFyYW1ldGVycy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRTb3J0XScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNvcnQnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0IGV4dGVuZHMgX01hdFNvcnRCYXNlIGltcGxlbWVudHMgSGFzSW5pdGlhbGl6ZWQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQge1xuICAvKiogQ29sbGVjdGlvbiBvZiBhbGwgcmVnaXN0ZXJlZCBzb3J0YWJsZXMgdGhhdCB0aGlzIGRpcmVjdGl2ZSBtYW5hZ2VzLiAqL1xuICBzb3J0YWJsZXMgPSBuZXcgTWFwPHN0cmluZywgTWF0U29ydGFibGU+KCk7XG5cbiAgLyoqIFVzZWQgdG8gbm90aWZ5IGFueSBjaGlsZCBjb21wb25lbnRzIGxpc3RlbmluZyB0byBzdGF0ZSBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGlkIG9mIHRoZSBtb3N0IHJlY2VudGx5IHNvcnRlZCBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCdtYXRTb3J0QWN0aXZlJykgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rpb24gdG8gc2V0IHdoZW4gYW4gTWF0U29ydGFibGUgaXMgaW5pdGlhbGx5IHNvcnRlZC5cbiAgICogTWF5IGJlIG92ZXJyaWRkZW4gYnkgdGhlIE1hdFNvcnRhYmxlJ3Mgc29ydCBzdGFydC5cbiAgICovXG4gIEBJbnB1dCgnbWF0U29ydFN0YXJ0Jykgc3RhcnQ6IFNvcnREaXJlY3Rpb24gPSAnYXNjJztcblxuICAvKiogVGhlIHNvcnQgZGlyZWN0aW9uIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnREaXJlY3Rpb24nKVxuICBnZXQgZGlyZWN0aW9uKCk6IFNvcnREaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG4gIH1cbiAgc2V0IGRpcmVjdGlvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pIHtcbiAgICBpZiAoXG4gICAgICBkaXJlY3Rpb24gJiZcbiAgICAgIGRpcmVjdGlvbiAhPT0gJ2FzYycgJiZcbiAgICAgIGRpcmVjdGlvbiAhPT0gJ2Rlc2MnICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICkge1xuICAgICAgdGhyb3cgZ2V0U29ydEludmFsaWREaXJlY3Rpb25FcnJvcihkaXJlY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLl9kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gIH1cbiAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzYWJsZSB0aGUgdXNlciBmcm9tIGNsZWFyaW5nIHRoZSBzb3J0IGJ5IGZpbmlzaGluZyB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUuXG4gICAqIE1heSBiZSBvdmVycmlkZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIGRpc2FibGUgY2xlYXIgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoe2FsaWFzOiAnbWF0U29ydERpc2FibGVDbGVhcicsIHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGRpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgc29ydGFibGUgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7YWxpYXM6ICdtYXRTb3J0RGlzYWJsZWQnLCB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyBlaXRoZXIgdGhlIGFjdGl2ZSBzb3J0IG9yIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBAT3V0cHV0KCdtYXRTb3J0Q2hhbmdlJykgcmVhZG9ubHkgc29ydENoYW5nZTogRXZlbnRFbWl0dGVyPFNvcnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxTb3J0PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfU09SVF9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTb3J0RGVmYXVsdE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gQWRkcyB0aGUgTWF0U29ydGFibGUgdG8gdGhlXG4gICAqIGNvbGxlY3Rpb24gb2YgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgcmVnaXN0ZXIoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCFzb3J0YWJsZS5pZCkge1xuICAgICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc29ydGFibGVzLmhhcyhzb3J0YWJsZS5pZCkpIHtcbiAgICAgICAgdGhyb3cgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcihzb3J0YWJsZS5pZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zb3J0YWJsZXMuc2V0KHNvcnRhYmxlLmlkLCBzb3J0YWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogVW5yZWdpc3RlciBmdW5jdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBjb250YWluZWQgTWF0U29ydGFibGVzLiBSZW1vdmVzIHRoZSBNYXRTb3J0YWJsZSBmcm9tIHRoZVxuICAgKiBjb2xsZWN0aW9uIG9mIGNvbnRhaW5lZCBNYXRTb3J0YWJsZXMuXG4gICAqL1xuICBkZXJlZ2lzdGVyKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IHZvaWQge1xuICAgIHRoaXMuc29ydGFibGVzLmRlbGV0ZShzb3J0YWJsZS5pZCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYWN0aXZlIHNvcnQgaWQgYW5kIGRldGVybWluZXMgdGhlIG5ldyBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgc29ydChzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmUgIT0gc29ydGFibGUuaWQpIHtcbiAgICAgIHRoaXMuYWN0aXZlID0gc29ydGFibGUuaWQ7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IHNvcnRhYmxlLnN0YXJ0ID8gc29ydGFibGUuc3RhcnQgOiB0aGlzLnN0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuZ2V0TmV4dFNvcnREaXJlY3Rpb24oc29ydGFibGUpO1xuICAgIH1cblxuICAgIHRoaXMuc29ydENoYW5nZS5lbWl0KHthY3RpdmU6IHRoaXMuYWN0aXZlLCBkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9ufSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgbmV4dCBzb3J0IGRpcmVjdGlvbiBvZiB0aGUgYWN0aXZlIHNvcnRhYmxlLCBjaGVja2luZyBmb3IgcG90ZW50aWFsIG92ZXJyaWRlcy4gKi9cbiAgZ2V0TmV4dFNvcnREaXJlY3Rpb24oc29ydGFibGU6IE1hdFNvcnRhYmxlKTogU29ydERpcmVjdGlvbiB7XG4gICAgaWYgKCFzb3J0YWJsZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgc29ydCBkaXJlY3Rpb24gY3ljbGUgd2l0aCB0aGUgcG90ZW50aWFsIHNvcnRhYmxlIG92ZXJyaWRlcy5cbiAgICBjb25zdCBkaXNhYmxlQ2xlYXIgPVxuICAgICAgc29ydGFibGU/LmRpc2FibGVDbGVhciA/PyB0aGlzLmRpc2FibGVDbGVhciA/PyAhIXRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlQ2xlYXI7XG4gICAgbGV0IHNvcnREaXJlY3Rpb25DeWNsZSA9IGdldFNvcnREaXJlY3Rpb25DeWNsZShzb3J0YWJsZS5zdGFydCB8fCB0aGlzLnN0YXJ0LCBkaXNhYmxlQ2xlYXIpO1xuXG4gICAgLy8gR2V0IGFuZCByZXR1cm4gdGhlIG5leHQgZGlyZWN0aW9uIGluIHRoZSBjeWNsZVxuICAgIGxldCBuZXh0RGlyZWN0aW9uSW5kZXggPSBzb3J0RGlyZWN0aW9uQ3ljbGUuaW5kZXhPZih0aGlzLmRpcmVjdGlvbikgKyAxO1xuICAgIGlmIChuZXh0RGlyZWN0aW9uSW5kZXggPj0gc29ydERpcmVjdGlvbkN5Y2xlLmxlbmd0aCkge1xuICAgICAgbmV4dERpcmVjdGlvbkluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnREaXJlY3Rpb25DeWNsZVtuZXh0RGlyZWN0aW9uSW5kZXhdO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cbn1cblxuLyoqIFJldHVybnMgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHRvIHVzZSBnaXZlbiB0aGUgcHJvdmlkZWQgcGFyYW1ldGVycyBvZiBvcmRlciBhbmQgY2xlYXIuICovXG5mdW5jdGlvbiBnZXRTb3J0RGlyZWN0aW9uQ3ljbGUoc3RhcnQ6IFNvcnREaXJlY3Rpb24sIGRpc2FibGVDbGVhcjogYm9vbGVhbik6IFNvcnREaXJlY3Rpb25bXSB7XG4gIGxldCBzb3J0T3JkZXI6IFNvcnREaXJlY3Rpb25bXSA9IFsnYXNjJywgJ2Rlc2MnXTtcbiAgaWYgKHN0YXJ0ID09ICdkZXNjJykge1xuICAgIHNvcnRPcmRlci5yZXZlcnNlKCk7XG4gIH1cbiAgaWYgKCFkaXNhYmxlQ2xlYXIpIHtcbiAgICBzb3J0T3JkZXIucHVzaCgnJyk7XG4gIH1cblxuICByZXR1cm4gc29ydE9yZGVyO1xufVxuIl19