/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Optional, SkipSelf, isDevMode } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '@angular/animations';
import '@angular/cdk/table';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/Subject';
import '@angular/material/core';
import '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
function getSortDuplicateSortableIdError(id) {
    return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderNotContainedWithinSortError() {
    return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderMissingIdError() {
    return Error(`MatSortHeader must be provided with a unique id.`);
}
/**
 * \@docs-private
 * @param {?} direction
 * @return {?}
 */
function getSortInvalidDirectionError(direction) {
    return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @record
 */

/**
 * @record
 */

/**
 * Container for MatSortables to manage the sort state and provide default sort parameters.
 */
class MatSort {
    /**
     * The sort direction of the currently active MatSortable.
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
     * @return {?}
     */
    get direction() { return this._direction; }
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
        this.sortChange.next({ active: this.active, direction: this.direction });
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
        const /** @type {?} */ disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        let /** @type {?} */ sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        let /** @type {?} */ nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
}
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    let /** @type {?} */ sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
class MatSortHeaderIntl {
}
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatSortHeaderIntl();
}
/**
 * \@docs-private
 */
const MAT_SORT_HEADER_INTL_PROVIDER = {
    // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
    provide: MatSortHeaderIntl,
    deps: [[new Optional(), new SkipSelf(), MatSortHeaderIntl]],
    useFactory: MAT_SORT_HEADER_INTL_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
class MatSortHeader {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     * @param {?} _sort
     * @param {?} _cdkColumnDef
     */
    constructor(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        this._intl = _intl;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
        if (!_sort) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._rerenderSubscription = merge(_sort.sortChange, _intl.changes).subscribe(() => {
            changeDetectorRef.markForCheck();
        });
    }
    /**
     * Overrides the disable clear value of the containing MatSort for this MatSortable.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.id && this._cdkColumnDef) {
            this.id = this._cdkColumnDef.name;
        }
        this._sort.register(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Whether this MatSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    _isSorted() {
        return this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatSortModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatSortModule, MatSortHeader, MatSortHeaderIntl, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY, MAT_SORT_HEADER_INTL_PROVIDER, MatSort };
//# sourceMappingURL=sort.js.map
