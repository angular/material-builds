/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, EventEmitter, Input, isDevMode, Output, } from '@angular/core';
import { mixinDisabled, mixinInitialized, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError, } from './sort-errors';
// Boilerplate for applying mixins to MatSort.
/** @docs-private */
class MatSortBase {
}
const _MatSortMixinBase = mixinInitialized(mixinDisabled(MatSortBase));
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
let MatSort = /** @class */ (() => {
    let MatSort = class MatSort extends _MatSortMixinBase {
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
            if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
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
    };
    __decorate([
        Input('matSortActive'),
        __metadata("design:type", String)
    ], MatSort.prototype, "active", void 0);
    __decorate([
        Input('matSortStart'),
        __metadata("design:type", String)
    ], MatSort.prototype, "start", void 0);
    __decorate([
        Input('matSortDirection'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatSort.prototype, "direction", null);
    __decorate([
        Input('matSortDisableClear'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatSort.prototype, "disableClear", null);
    __decorate([
        Output('matSortChange'),
        __metadata("design:type", EventEmitter)
    ], MatSort.prototype, "sortChange", void 0);
    MatSort = __decorate([
        Directive({
            selector: '[matSort]',
            exportAs: 'matSort',
            host: { 'class': 'mat-sort' },
            inputs: ['disabled: matSortDisabled']
        })
    ], MatSort);
    return MatSort;
})();
export { MatSort };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxTQUFTLEVBSVQsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCxhQUFhLEVBQ2IsZ0JBQWdCLEdBQ2pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU3QixPQUFPLEVBQ0wsK0JBQStCLEVBQy9CLDJCQUEyQixFQUMzQiw0QkFBNEIsR0FDN0IsTUFBTSxlQUFlLENBQUM7QUF1QnZCLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxXQUFXO0NBQUc7QUFDcEIsTUFBTSxpQkFBaUIsR0FDbkIsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFFakQsK0ZBQStGO0FBTy9GO0lBQUEsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBUSxTQUFRLGlCQUFpQjtRQUE5Qzs7WUFFRSwwRUFBMEU7WUFDMUUsY0FBUyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1lBRTNDLHNFQUFzRTtZQUM3RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7WUFLN0M7OztlQUdHO1lBQ29CLFVBQUssR0FBbUIsS0FBSyxDQUFDO1lBVzdDLGVBQVUsR0FBa0IsRUFBRSxDQUFDO1lBV3ZDLG9GQUFvRjtZQUNsRCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFpRTlGLENBQUM7UUF0RkMsOERBQThEO1FBRTlELElBQUksU0FBUyxLQUFvQixPQUFPLElBQUksQ0FBQyxVQUFV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QUFXO1lBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsQ0FBQztLQUlGLENBQUE7SUE5RnlCO1FBQXZCLEtBQUssQ0FBQyxlQUFlLENBQUM7OzJDQUFnQjtJQU1oQjtRQUF0QixLQUFLLENBQUMsY0FBYyxDQUFDOzswQ0FBK0I7SUFJckQ7UUFEQyxLQUFLLENBQUMsa0JBQWtCLENBQUM7Ozs0Q0FDZ0M7SUFjMUQ7UUFEQyxLQUFLLENBQUMscUJBQXFCLENBQUM7OzsrQ0FDNkI7SUFLakM7UUFBeEIsTUFBTSxDQUFDLGVBQWUsQ0FBQztrQ0FBc0IsWUFBWTsrQ0FBa0M7SUF0Q2pGLE9BQU87UUFObkIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQztZQUMzQixNQUFNLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztTQUN0QyxDQUFDO09BQ1csT0FBTyxDQXVHbkI7SUFBRCxjQUFDO0tBQUE7U0F2R1ksT0FBTztBQXlHcEIsZ0dBQWdHO0FBQ2hHLFNBQVMscUJBQXFCLENBQUMsS0FBcUIsRUFDckIsWUFBcUI7SUFDbEQsSUFBSSxTQUFTLEdBQW9CLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQzdDLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQUU7SUFFMUMsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBpc0Rldk1vZGUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgSGFzSW5pdGlhbGl6ZWQsXG4gIEhhc0luaXRpYWxpemVkQ3RvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5Jbml0aWFsaXplZCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7XG4gIGdldFNvcnREdXBsaWNhdGVTb3J0YWJsZUlkRXJyb3IsXG4gIGdldFNvcnRIZWFkZXJNaXNzaW5nSWRFcnJvcixcbiAgZ2V0U29ydEludmFsaWREaXJlY3Rpb25FcnJvcixcbn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5cbi8qKiBJbnRlcmZhY2UgZm9yIGEgZGlyZWN0aXZlIHRoYXQgaG9sZHMgc29ydGluZyBzdGF0ZSBjb25zdW1lZCBieSBgTWF0U29ydEhlYWRlcmAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNvcnRhYmxlIHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgaWQ6IHN0cmluZztcblxuICAvKiogU3RhcnRpbmcgc29ydCBkaXJlY3Rpb24uICovXG4gIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJztcblxuICAvKiogV2hldGhlciB0byBkaXNhYmxlIGNsZWFyaW5nIHRoZSBzb3J0aW5nIHN0YXRlLiAqL1xuICBkaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG59XG5cbi8qKiBUaGUgY3VycmVudCBzb3J0IHN0YXRlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3J0IHtcbiAgLyoqIFRoZSBpZCBvZiB0aGUgY29sdW1uIGJlaW5nIHNvcnRlZC4gKi9cbiAgYWN0aXZlOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBzb3J0IGRpcmVjdGlvbi4gKi9cbiAgZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNvcnQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U29ydEJhc2Uge31cbmNvbnN0IF9NYXRTb3J0TWl4aW5CYXNlOiBIYXNJbml0aWFsaXplZEN0b3IgJiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRTb3J0QmFzZSA9XG4gICAgbWl4aW5Jbml0aWFsaXplZChtaXhpbkRpc2FibGVkKE1hdFNvcnRCYXNlKSk7XG5cbi8qKiBDb250YWluZXIgZm9yIE1hdFNvcnRhYmxlcyB0byBtYW5hZ2UgdGhlIHNvcnQgc3RhdGUgYW5kIHByb3ZpZGUgZGVmYXVsdCBzb3J0IHBhcmFtZXRlcnMuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0U29ydF0nLFxuICBleHBvcnRBczogJ21hdFNvcnQnLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1zb3J0J30sXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0U29ydERpc2FibGVkJ11cbn0pXG5leHBvcnQgY2xhc3MgTWF0U29ydCBleHRlbmRzIF9NYXRTb3J0TWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBDb2xsZWN0aW9uIG9mIGFsbCByZWdpc3RlcmVkIHNvcnRhYmxlcyB0aGF0IHRoaXMgZGlyZWN0aXZlIG1hbmFnZXMuICovXG4gIHNvcnRhYmxlcyA9IG5ldyBNYXA8c3RyaW5nLCBNYXRTb3J0YWJsZT4oKTtcblxuICAvKiogVXNlZCB0byBub3RpZnkgYW55IGNoaWxkIGNvbXBvbmVudHMgbGlzdGVuaW5nIHRvIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgaWQgb2YgdGhlIG1vc3QgcmVjZW50bHkgc29ydGVkIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoJ21hdFNvcnRBY3RpdmUnKSBhY3RpdmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRpcmVjdGlvbiB0byBzZXQgd2hlbiBhbiBNYXRTb3J0YWJsZSBpcyBpbml0aWFsbHkgc29ydGVkLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIHNvcnQgc3RhcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnRTdGFydCcpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJyA9ICdhc2MnO1xuXG4gIC8qKiBUaGUgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgnbWF0U29ydERpcmVjdGlvbicpXG4gIGdldCBkaXJlY3Rpb24oKTogU29ydERpcmVjdGlvbiB7IHJldHVybiB0aGlzLl9kaXJlY3Rpb247IH1cbiAgc2V0IGRpcmVjdGlvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNEZXZNb2RlKCkgJiYgZGlyZWN0aW9uICYmIGRpcmVjdGlvbiAhPT0gJ2FzYycgJiYgZGlyZWN0aW9uICE9PSAnZGVzYycpIHtcbiAgICAgIHRocm93IGdldFNvcnRJbnZhbGlkRGlyZWN0aW9uRXJyb3IoZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgdGhlIHVzZXIgZnJvbSBjbGVhcmluZyB0aGUgc29ydCBieSBmaW5pc2hpbmcgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlLlxuICAgKiBNYXkgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBNYXRTb3J0YWJsZSdzIGRpc2FibGUgY2xlYXIgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ21hdFNvcnREaXNhYmxlQ2xlYXInKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsZWFyOyB9XG4gIHNldCBkaXNhYmxlQ2xlYXIodjogYm9vbGVhbikgeyB0aGlzLl9kaXNhYmxlQ2xlYXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsZWFyOiBib29sZWFuO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyBlaXRoZXIgdGhlIGFjdGl2ZSBzb3J0IG9yIHNvcnQgZGlyZWN0aW9uLiAqL1xuICBAT3V0cHV0KCdtYXRTb3J0Q2hhbmdlJykgcmVhZG9ubHkgc29ydENoYW5nZTogRXZlbnRFbWl0dGVyPFNvcnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxTb3J0PigpO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBmdW5jdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBjb250YWluZWQgTWF0U29ydGFibGVzLiBBZGRzIHRoZSBNYXRTb3J0YWJsZSB0byB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBNYXRTb3J0YWJsZXMuXG4gICAqL1xuICByZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICBpZiAoIXNvcnRhYmxlLmlkKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTWlzc2luZ0lkRXJyb3IoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3J0YWJsZXMuaGFzKHNvcnRhYmxlLmlkKSkge1xuICAgICAgdGhyb3cgZ2V0U29ydER1cGxpY2F0ZVNvcnRhYmxlSWRFcnJvcihzb3J0YWJsZS5pZCk7XG4gICAgfVxuICAgIHRoaXMuc29ydGFibGVzLnNldChzb3J0YWJsZS5pZCwgc29ydGFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXIgZnVuY3Rpb24gdG8gYmUgdXNlZCBieSB0aGUgY29udGFpbmVkIE1hdFNvcnRhYmxlcy4gUmVtb3ZlcyB0aGUgTWF0U29ydGFibGUgZnJvbSB0aGVcbiAgICogY29sbGVjdGlvbiBvZiBjb250YWluZWQgTWF0U29ydGFibGVzLlxuICAgKi9cbiAgZGVyZWdpc3Rlcihzb3J0YWJsZTogTWF0U29ydGFibGUpOiB2b2lkIHtcbiAgICB0aGlzLnNvcnRhYmxlcy5kZWxldGUoc29ydGFibGUuaWQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBzb3J0IGlkIGFuZCBkZXRlcm1pbmVzIHRoZSBuZXcgc29ydCBkaXJlY3Rpb24uICovXG4gIHNvcnQoc29ydGFibGU6IE1hdFNvcnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlICE9IHNvcnRhYmxlLmlkKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHNvcnRhYmxlLmlkO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBzb3J0YWJsZS5zdGFydCA/IHNvcnRhYmxlLnN0YXJ0IDogdGhpcy5zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRDaGFuZ2UuZW1pdCh7YWN0aXZlOiB0aGlzLmFjdGl2ZSwgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvbn0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gb2YgdGhlIGFjdGl2ZSBzb3J0YWJsZSwgY2hlY2tpbmcgZm9yIHBvdGVudGlhbCBvdmVycmlkZXMuICovXG4gIGdldE5leHRTb3J0RGlyZWN0aW9uKHNvcnRhYmxlOiBNYXRTb3J0YWJsZSk6IFNvcnREaXJlY3Rpb24ge1xuICAgIGlmICghc29ydGFibGUpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAvLyBHZXQgdGhlIHNvcnQgZGlyZWN0aW9uIGN5Y2xlIHdpdGggdGhlIHBvdGVudGlhbCBzb3J0YWJsZSBvdmVycmlkZXMuXG4gICAgY29uc3QgZGlzYWJsZUNsZWFyID0gc29ydGFibGUuZGlzYWJsZUNsZWFyICE9IG51bGwgPyBzb3J0YWJsZS5kaXNhYmxlQ2xlYXIgOiB0aGlzLmRpc2FibGVDbGVhcjtcbiAgICBsZXQgc29ydERpcmVjdGlvbkN5Y2xlID0gZ2V0U29ydERpcmVjdGlvbkN5Y2xlKHNvcnRhYmxlLnN0YXJ0IHx8IHRoaXMuc3RhcnQsIGRpc2FibGVDbGVhcik7XG5cbiAgICAvLyBHZXQgYW5kIHJldHVybiB0aGUgbmV4dCBkaXJlY3Rpb24gaW4gdGhlIGN5Y2xlXG4gICAgbGV0IG5leHREaXJlY3Rpb25JbmRleCA9IHNvcnREaXJlY3Rpb25DeWNsZS5pbmRleE9mKHRoaXMuZGlyZWN0aW9uKSArIDE7XG4gICAgaWYgKG5leHREaXJlY3Rpb25JbmRleCA+PSBzb3J0RGlyZWN0aW9uQ3ljbGUubGVuZ3RoKSB7IG5leHREaXJlY3Rpb25JbmRleCA9IDA7IH1cbiAgICByZXR1cm4gc29ydERpcmVjdGlvbkN5Y2xlW25leHREaXJlY3Rpb25JbmRleF07XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9tYXJrSW5pdGlhbGl6ZWQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQ2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBzb3J0IGRpcmVjdGlvbiBjeWNsZSB0byB1c2UgZ2l2ZW4gdGhlIHByb3ZpZGVkIHBhcmFtZXRlcnMgb2Ygb3JkZXIgYW5kIGNsZWFyLiAqL1xuZnVuY3Rpb24gZ2V0U29ydERpcmVjdGlvbkN5Y2xlKHN0YXJ0OiAnYXNjJyB8ICdkZXNjJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlQ2xlYXI6IGJvb2xlYW4pOiBTb3J0RGlyZWN0aW9uW10ge1xuICBsZXQgc29ydE9yZGVyOiBTb3J0RGlyZWN0aW9uW10gPSBbJ2FzYycsICdkZXNjJ107XG4gIGlmIChzdGFydCA9PSAnZGVzYycpIHsgc29ydE9yZGVyLnJldmVyc2UoKTsgfVxuICBpZiAoIWRpc2FibGVDbGVhcikgeyBzb3J0T3JkZXIucHVzaCgnJyk7IH1cblxuICByZXR1cm4gc29ydE9yZGVyO1xufVxuIl19