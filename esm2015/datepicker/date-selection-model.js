/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-selection-model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Optional, SkipSelf, Directive } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
/**
 * A class representing a range of dates.
 * @template D
 */
export class DateRange {
    /**
     * @param {?} start
     * @param {?} end
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
if (false) {
    /**
     * Ensures that objects with a `start` and `end` property can't be assigned to a variable that
     * expects a `DateRange`
     * @type {?}
     * @private
     */
    DateRange.prototype._disableStructuralEquivalency;
    /**
     * The start date of the range.
     * @type {?}
     */
    DateRange.prototype.start;
    /**
     * The end date of the range.
     * @type {?}
     */
    DateRange.prototype.end;
}
/**
 * Event emitted by the date selection model when its selection changes.
 * @record
 * @template S
 */
export function DateSelectionModelChange() { }
if (false) {
    /**
     * New value for the selection.
     * @type {?}
     */
    DateSelectionModelChange.prototype.selection;
    /**
     * Object that triggered the change.
     * @type {?}
     */
    DateSelectionModelChange.prototype.source;
}
/**
 * A selection model containing a date selection.
 * @abstract
 * @template S, D
 */
export class MatDateSelectionModel {
    /**
     * @protected
     * @param {?} selection
     * @param {?} _adapter
     */
    constructor(selection, _adapter) {
        this.selection = selection;
        this._adapter = _adapter;
        this._selectionChanged = new Subject();
        /**
         * Emits when the selection has changed.
         */
        this.selectionChanged = this._selectionChanged.asObservable();
        this.selection = selection;
    }
    /**
     * Updates the current selection in the model.
     * @param {?} value New selection that should be assigned.
     * @param {?} source Object that triggered the selection change.
     * @return {?}
     */
    updateSelection(value, source) {
        ((/** @type {?} */ (this))).selection = value;
        this._selectionChanged.next({ selection: value, source });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._selectionChanged.complete();
    }
    /**
     * @protected
     * @param {?} date
     * @return {?}
     */
    _isValidDateInstance(date) {
        return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
    }
}
MatDateSelectionModel.decorators = [
    { type: Directive }
];
/** @nocollapse */
MatDateSelectionModel.ctorParameters = () => [
    { type: undefined },
    { type: DateAdapter }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatDateSelectionModel.prototype._selectionChanged;
    /**
     * Emits when the selection has changed.
     * @type {?}
     */
    MatDateSelectionModel.prototype.selectionChanged;
    /**
     * The current selection.
     * @type {?}
     */
    MatDateSelectionModel.prototype.selection;
    /**
     * @type {?}
     * @protected
     */
    MatDateSelectionModel.prototype._adapter;
    /**
     * Adds a date to the current selection.
     * @abstract
     * @param {?} date
     * @return {?}
     */
    MatDateSelectionModel.prototype.add = function (date) { };
    /**
     * Checks whether the current selection is valid.
     * @abstract
     * @return {?}
     */
    MatDateSelectionModel.prototype.isValid = function () { };
    /**
     * Checks whether the current selection is complete.
     * @abstract
     * @return {?}
     */
    MatDateSelectionModel.prototype.isComplete = function () { };
}
/**
 * A selection model that contains a single date.
 * @template D
 */
export class MatSingleDateSelectionModel extends MatDateSelectionModel {
    /**
     * @param {?} adapter
     */
    constructor(adapter) {
        super(null, adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     * @param {?} date
     * @return {?}
     */
    add(date) {
        super.updateSelection(date, this);
    }
    /**
     * Checks whether the current selection is valid.
     * @return {?}
     */
    isValid() {
        return this.selection != null && this._isValidDateInstance(this.selection);
    }
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     * @return {?}
     */
    isComplete() {
        return this.selection != null;
    }
}
MatSingleDateSelectionModel.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatSingleDateSelectionModel.ctorParameters = () => [
    { type: DateAdapter }
];
/**
 * A selection model that contains a date range.
 * @template D
 */
export class MatRangeDateSelectionModel extends MatDateSelectionModel {
    /**
     * @param {?} adapter
     */
    constructor(adapter) {
        super(new DateRange(null, null), adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     * @param {?} date
     * @return {?}
     */
    add(date) {
        let { start, end } = this.selection;
        if (start == null) {
            start = date;
        }
        else if (end == null) {
            end = date;
        }
        else {
            start = date;
            end = null;
        }
        super.updateSelection(new DateRange(start, end), this);
    }
    /**
     * Checks whether the current selection is valid.
     * @return {?}
     */
    isValid() {
        const { start, end } = this.selection;
        // Empty ranges are valid.
        if (start == null && end == null) {
            return true;
        }
        // Complete ranges are only valid if both dates are valid and the start is before the end.
        if (start != null && end != null) {
            return this._isValidDateInstance(start) && this._isValidDateInstance(end) &&
                this._adapter.compareDate(start, end) <= 0;
        }
        // Partial ranges are valid if the start/end is valid.
        return (start == null || this._isValidDateInstance(start)) &&
            (end == null || this._isValidDateInstance(end));
    }
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     * @return {?}
     */
    isComplete() {
        return this.selection.start != null && this.selection.end != null;
    }
}
MatRangeDateSelectionModel.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatRangeDateSelectionModel.ctorParameters = () => [
    { type: DateAdapter }
];
/**
 * \@docs-private
 * @param {?} parent
 * @param {?} adapter
 * @return {?}
 */
export function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatSingleDateSelectionModel(adapter);
}
/**
 * Used to provide a single selection model to a component.
 * @type {?}
 */
export const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/**
 * \@docs-private
 * @param {?} parent
 * @param {?} adapter
 * @return {?}
 */
export function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatRangeDateSelectionModel(adapter);
}
/**
 * Used to provide a range selection model to a component.
 * @type {?}
 */
export const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQWtCLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFhLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFHekMsTUFBTSxPQUFPLFNBQVM7Ozs7O0lBUXBCLFlBRVcsS0FBZSxFQUVmLEdBQWE7UUFGYixVQUFLLEdBQUwsS0FBSyxDQUFVO1FBRWYsUUFBRyxHQUFILEdBQUcsQ0FBVTtJQUFHLENBQUM7Q0FDN0I7Ozs7Ozs7O0lBUEMsa0RBQTZDOzs7OztJQUkzQywwQkFBd0I7Ozs7O0lBRXhCLHdCQUFzQjs7Ozs7OztBQVUxQiw4Q0FNQzs7Ozs7O0lBSkMsNkNBQWE7Ozs7O0lBR2IsMENBQWdCOzs7Ozs7O0FBS2xCLE1BQU0sT0FBZ0IscUJBQXFCOzs7Ozs7SUFPekMsWUFFVyxTQUFZLEVBQ1gsUUFBd0I7UUFEekIsY0FBUyxHQUFULFNBQVMsQ0FBRztRQUNYLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBUjVCLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUErQixDQUFDOzs7O1FBR3ZFLHFCQUFnQixHQUE0QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFNaEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQzs7Ozs7OztJQU9ELGVBQWUsQ0FBQyxLQUFRLEVBQUUsTUFBZTtRQUN2QyxDQUFDLG1CQUFBLElBQUksRUFBa0IsQ0FBQyxDQUFDLFNBQVMsR0FBRyxL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bCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZhY3RvcnlQcm92aWRlciwgSW5qZWN0YWJsZSwgT3B0aW9uYWwsIFNraXBTZWxmLCBPbkRlc3Ryb3ksIERpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBBIGNsYXNzIHJlcHJlc2VudGluZyBhIHJhbmdlIG9mIGRhdGVzLiAqL1xuZXhwb3J0IGNsYXNzIERhdGVSYW5nZTxEPiB7XG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoYXQgb2JqZWN0cyB3aXRoIGEgYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydHkgY2FuJ3QgYmUgYXNzaWduZWQgdG8gYSB2YXJpYWJsZSB0aGF0XG4gICAqIGV4cGVjdHMgYSBgRGF0ZVJhbmdlYFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC12YXJpYWJsZVxuICBwcml2YXRlIF9kaXNhYmxlU3RydWN0dXJhbEVxdWl2YWxlbmN5OiBuZXZlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIHN0YXJ0IGRhdGUgb2YgdGhlIHJhbmdlLiAqL1xuICAgIHJlYWRvbmx5IHN0YXJ0OiBEIHwgbnVsbCxcbiAgICAvKiogVGhlIGVuZCBkYXRlIG9mIHRoZSByYW5nZS4gKi9cbiAgICByZWFkb25seSBlbmQ6IEQgfCBudWxsKSB7fVxufVxuXG4vKipcbiAqIENvbmRpdGlvbmFsbHkgcGlja3MgdGhlIGRhdGUgdHlwZSwgaWYgYSBEYXRlUmFuZ2UgaXMgcGFzc2VkIGluLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFQ+ID0gVCBleHRlbmRzIERhdGVSYW5nZTxpbmZlciBEPiA/IEQgOiBOb25OdWxsYWJsZTxUPjtcblxuLyoqIEV2ZW50IGVtaXR0ZWQgYnkgdGhlIGRhdGUgc2VsZWN0aW9uIG1vZGVsIHdoZW4gaXRzIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8Uz4ge1xuICAvKiogTmV3IHZhbHVlIGZvciB0aGUgc2VsZWN0aW9uLiAqL1xuICBzZWxlY3Rpb246IFM7XG5cbiAgLyoqIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgY2hhbmdlLiAqL1xuICBzb3VyY2U6IHVua25vd247XG59XG5cbi8qKiBBIHNlbGVjdGlvbiBtb2RlbCBjb250YWluaW5nIGEgZGF0ZSBzZWxlY3Rpb24uICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+XG4gICAgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9zZWxlY3Rpb25DaGFuZ2VkID0gbmV3IFN1YmplY3Q8RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQuICovXG4gIHNlbGVjdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PiA9IHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gICAgcmVhZG9ubHkgc2VsZWN0aW9uOiBTLFxuICAgIHByb3RlY3RlZCBfYWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpbiB0aGUgbW9kZWwuXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgc2VsZWN0aW9uIHRoYXQgc2hvdWxkIGJlIGFzc2lnbmVkLlxuICAgKiBAcGFyYW0gc291cmNlIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgc2VsZWN0aW9uIGNoYW5nZS5cbiAgICovXG4gIHVwZGF0ZVNlbGVjdGlvbih2YWx1ZTogUywgc291cmNlOiB1bmtub3duKSB7XG4gICAgKHRoaXMgYXMge3NlbGVjdGlvbjogU30pLnNlbGVjdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQubmV4dCh7c2VsZWN0aW9uOiB2YWx1ZSwgc291cmNlfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2lzVmFsaWREYXRlSW5zdGFuY2UoZGF0ZTogRCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmlzRGF0ZUluc3RhbmNlKGRhdGUpICYmIHRoaXMuX2FkYXB0ZXIuaXNWYWxpZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gIGFic3RyYWN0IGFkZChkYXRlOiBEIHwgbnVsbCk6IHZvaWQ7XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgYWJzdHJhY3QgaXNWYWxpZCgpOiBib29sZWFuO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFic3RyYWN0IGlzQ29tcGxldGUoKTogYm9vbGVhbjtcbn1cblxuLyoqICBBIHNlbGVjdGlvbiBtb2RlbCB0aGF0IGNvbnRhaW5zIGEgc2luZ2xlIGRhdGUuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPEQgfCBudWxsLCBEPiB7XG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgc3VwZXIobnVsbCwgYWRhcHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiBJbiB0aGUgY2FzZSBvZiBhIHNpbmdsZSBkYXRlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogc2ltcGx5IG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHRoaXMuc2VsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuIEluIHRoZSBjYXNlIG9mIGEgc2luZ2xlIGRhdGUgc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vdCBudWxsLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbDtcbiAgfVxufVxuXG4vKiogIEEgc2VsZWN0aW9uIG1vZGVsIHRoYXQgY29udGFpbnMgYSBkYXRlIHJhbmdlLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdFJhbmdlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPiwgRD4ge1xuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBEYXRlQWRhcHRlcjxEPikge1xuICAgIHN1cGVyKG5ldyBEYXRlUmFuZ2U8RD4obnVsbCwgbnVsbCksIGFkYXB0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkYXRlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGlvbi4gSW4gdGhlIGNhc2Ugb2YgYSBkYXRlIHJhbmdlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogZmlsbHMgaW4gdGhlIG5leHQgYG51bGxgIHZhbHVlIGluIHRoZSByYW5nZS4gSWYgYm90aCB0aGUgc3RhcnQgYW5kIHRoZSBlbmQgYWxyZWFkeSBoYXZlIGEgZGF0ZSxcbiAgICogdGhlIHNlbGVjdGlvbiBpcyByZXNldCBzbyB0aGF0IHRoZSBnaXZlbiBkYXRlIGlzIHRoZSBuZXcgYHN0YXJ0YCBhbmQgdGhlIGBlbmRgIGlzIG51bGwuXG4gICAqL1xuICBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkIHtcbiAgICBsZXQge3N0YXJ0LCBlbmR9ID0gdGhpcy5zZWxlY3Rpb247XG5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGVuZCA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICAgIGVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKG5ldyBEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCksIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSB0aGlzLnNlbGVjdGlvbjtcblxuICAgIC8vIEVtcHR5IHJhbmdlcyBhcmUgdmFsaWQuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwgJiYgZW5kID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENvbXBsZXRlIHJhbmdlcyBhcmUgb25seSB2YWxpZCBpZiBib3RoIGRhdGVzIGFyZSB2YWxpZCBhbmQgdGhlIHN0YXJ0IGlzIGJlZm9yZSB0aGUgZW5kLlxuICAgIGlmIChzdGFydCAhPSBudWxsICYmIGVuZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShzdGFydCkgJiYgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShlbmQpICYmXG4gICAgICAgICAgICAgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwO1xuICAgIH1cblxuICAgIC8vIFBhcnRpYWwgcmFuZ2VzIGFyZSB2YWxpZCBpZiB0aGUgc3RhcnQvZW5kIGlzIHZhbGlkLlxuICAgIHJldHVybiAoc3RhcnQgPT0gbnVsbCB8fCB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHN0YXJ0KSkgJiZcbiAgICAgICAgICAgKGVuZCA9PSBudWxsIHx8IHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UoZW5kKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiBJbiB0aGUgY2FzZSBvZiBhIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGhhcyBhIG5vbi1udWxsIGBzdGFydGAgYW5kIGBlbmRgLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uc3RhcnQgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvbi5lbmQgIT0gbnVsbDtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWShcbiAgICBwYXJlbnQ6IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDx1bmtub3duPiwgYWRhcHRlcjogRGF0ZUFkYXB0ZXI8dW5rbm93bj4pIHtcbiAgcmV0dXJuIHBhcmVudCB8fCBuZXcgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsKGFkYXB0ZXIpO1xufVxuXG4vKiogVXNlZCB0byBwcm92aWRlIGEgc2luZ2xlIHNlbGVjdGlvbiBtb2RlbCB0byBhIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZLFxufTtcblxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZKFxuICAgIHBhcmVudDogTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPHVua25vd24+LCBhZGFwdGVyOiBEYXRlQWRhcHRlcjx1bmtub3duPikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqIFVzZWQgdG8gcHJvdmlkZSBhIHJhbmdlIHNlbGVjdGlvbiBtb2RlbCB0byBhIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVI6IEZhY3RvcnlQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsXSwgRGF0ZUFkYXB0ZXJdLFxuICB1c2VGYWN0b3J5OiBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSxcbn07XG4iXX0=