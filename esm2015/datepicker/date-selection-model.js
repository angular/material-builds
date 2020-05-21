/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Injectable, Optional, SkipSelf, Directive } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
/** A class representing a range of dates. */
export class DateRange {
    constructor(
    /** The start date of the range. */
    start, 
    /** The end date of the range. */
    end) {
        this.start = start;
        this.end = end;
    }
}
/** A selection model containing a date selection. */
let MatDateSelectionModel = /** @class */ (() => {
    let MatDateSelectionModel = class MatDateSelectionModel {
        constructor(
        /** The current selection. */
        selection, _adapter) {
            this.selection = selection;
            this._adapter = _adapter;
            this._selectionChanged = new Subject();
            /** Emits when the selection has changed. */
            this.selectionChanged = this._selectionChanged.asObservable();
            this.selection = selection;
        }
        /**
         * Updates the current selection in the model.
         * @param value New selection that should be assigned.
         * @param source Object that triggered the selection change.
         */
        updateSelection(value, source) {
            this.selection = value;
            this._selectionChanged.next({ selection: value, source });
        }
        ngOnDestroy() {
            this._selectionChanged.complete();
        }
        _isValidDateInstance(date) {
            return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
        }
    };
    MatDateSelectionModel = __decorate([
        Directive(),
        __metadata("design:paramtypes", [Object, DateAdapter])
    ], MatDateSelectionModel);
    return MatDateSelectionModel;
})();
export { MatDateSelectionModel };
/**  A selection model that contains a single date. */
let MatSingleDateSelectionModel = /** @class */ (() => {
    let MatSingleDateSelectionModel = class MatSingleDateSelectionModel extends MatDateSelectionModel {
        constructor(adapter) {
            super(null, adapter);
        }
        /**
         * Adds a date to the current selection. In the case of a single date selection, the added date
         * simply overwrites the previous selection
         */
        add(date) {
            super.updateSelection(date, this);
        }
        /** Checks whether the current selection is valid. */
        isValid() {
            return this.selection != null && this._isValidDateInstance(this.selection);
        }
        /**
         * Checks whether the current selection is complete. In the case of a single date selection, this
         * is true if the current selection is not null.
         */
        isComplete() {
            return this.selection != null;
        }
    };
    MatSingleDateSelectionModel = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DateAdapter])
    ], MatSingleDateSelectionModel);
    return MatSingleDateSelectionModel;
})();
export { MatSingleDateSelectionModel };
/**  A selection model that contains a date range. */
let MatRangeDateSelectionModel = /** @class */ (() => {
    let MatRangeDateSelectionModel = class MatRangeDateSelectionModel extends MatDateSelectionModel {
        constructor(adapter) {
            super(new DateRange(null, null), adapter);
        }
        /**
         * Adds a date to the current selection. In the case of a date range selection, the added date
         * fills in the next `null` value in the range. If both the start and the end already have a date,
         * the selection is reset so that the given date is the new `start` and the `end` is null.
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
        /** Checks whether the current selection is valid. */
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
         */
        isComplete() {
            return this.selection.start != null && this.selection.end != null;
        }
    };
    MatRangeDateSelectionModel = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DateAdapter])
    ], MatRangeDateSelectionModel);
    return MatRangeDateSelectionModel;
})();
export { MatRangeDateSelectionModel };
/** @docs-private */
export function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatSingleDateSelectionModel(adapter);
}
/** Used to provide a single selection model to a component. */
export const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/** @docs-private */
export function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatRangeDateSelectionModel(adapter);
}
/** Used to provide a range selection model to a component. */
export const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFrQixVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBYSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ25ELE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFekMsNkNBQTZDO0FBQzdDLE1BQU0sT0FBTyxTQUFTO0lBUXBCO0lBQ0UsbUNBQW1DO0lBQzFCLEtBQWU7SUFDeEIsaUNBQWlDO0lBQ3hCLEdBQWE7UUFGYixVQUFLLEdBQUwsS0FBSyxDQUFVO1FBRWYsUUFBRyxHQUFILEdBQUcsQ0FBVTtJQUFHLENBQUM7Q0FDN0I7QUFpQkQscURBQXFEO0FBRXJEO0lBQUEsSUFBc0IscUJBQXFCLEdBQTNDLE1BQXNCLHFCQUFxQjtRQU96QztRQUNFLDZCQUE2QjtRQUNwQixTQUFZLEVBQ1gsUUFBd0I7WUFEekIsY0FBUyxHQUFULFNBQVMsQ0FBRztZQUNYLGFBQVEsR0FBUixRQUFRLENBQWdCO1lBUjVCLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUErQixDQUFDO1lBRXZFLDRDQUE0QztZQUM1QyxxQkFBZ0IsR0FBNEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDO1lBTWhHLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzdCLENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsZUFBZSxDQUFDLEtBQVEsRUFBRSxNQUFlO1lBQ3RDLElBQXVCLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMs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QjtJQUN0RSxPQUFPLEVBQUUscUJBQXFCO0lBQzlCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLHFCQUFxQixDQUFDLEVBQUUsV0FBVyxDQUFDO0lBQzVFLFVBQVUsRUFBRSxzQ0FBc0M7Q0FDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZhY3RvcnlQcm92aWRlciwgSW5qZWN0YWJsZSwgT3B0aW9uYWwsIFNraXBTZWxmLCBPbkRlc3Ryb3ksIERpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBBIGNsYXNzIHJlcHJlc2VudGluZyBhIHJhbmdlIG9mIGRhdGVzLiAqL1xuZXhwb3J0IGNsYXNzIERhdGVSYW5nZTxEPiB7XG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoYXQgb2JqZWN0cyB3aXRoIGEgYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydHkgY2FuJ3QgYmUgYXNzaWduZWQgdG8gYSB2YXJpYWJsZSB0aGF0XG4gICAqIGV4cGVjdHMgYSBgRGF0ZVJhbmdlYFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC12YXJpYWJsZVxuICBwcml2YXRlIF9kaXNhYmxlU3RydWN0dXJhbEVxdWl2YWxlbmN5OiBuZXZlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIHN0YXJ0IGRhdGUgb2YgdGhlIHJhbmdlLiAqL1xuICAgIHJlYWRvbmx5IHN0YXJ0OiBEIHwgbnVsbCxcbiAgICAvKiogVGhlIGVuZCBkYXRlIG9mIHRoZSByYW5nZS4gKi9cbiAgICByZWFkb25seSBlbmQ6IEQgfCBudWxsKSB7fVxufVxuXG4vKipcbiAqIENvbmRpdGlvbmFsbHkgcGlja3MgdGhlIGRhdGUgdHlwZSwgaWYgYSBEYXRlUmFuZ2UgaXMgcGFzc2VkIGluLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFQ+ID0gVCBleHRlbmRzIERhdGVSYW5nZTxpbmZlciBEPiA/IEQgOiBOb25OdWxsYWJsZTxUPjtcblxuLyoqIEV2ZW50IGVtaXR0ZWQgYnkgdGhlIGRhdGUgc2VsZWN0aW9uIG1vZGVsIHdoZW4gaXRzIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8Uz4ge1xuICAvKiogTmV3IHZhbHVlIGZvciB0aGUgc2VsZWN0aW9uLiAqL1xuICBzZWxlY3Rpb246IFM7XG5cbiAgLyoqIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgY2hhbmdlLiAqL1xuICBzb3VyY2U6IHVua25vd247XG59XG5cbi8qKiBBIHNlbGVjdGlvbiBtb2RlbCBjb250YWluaW5nIGEgZGF0ZSBzZWxlY3Rpb24uICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+XG4gICAgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9zZWxlY3Rpb25DaGFuZ2VkID0gbmV3IFN1YmplY3Q8RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQuICovXG4gIHNlbGVjdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PiA9IHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gICAgcmVhZG9ubHkgc2VsZWN0aW9uOiBTLFxuICAgIHByb3RlY3RlZCBfYWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpbiB0aGUgbW9kZWwuXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgc2VsZWN0aW9uIHRoYXQgc2hvdWxkIGJlIGFzc2lnbmVkLlxuICAgKiBAcGFyYW0gc291cmNlIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgc2VsZWN0aW9uIGNoYW5nZS5cbiAgICovXG4gIHVwZGF0ZVNlbGVjdGlvbih2YWx1ZTogUywgc291cmNlOiB1bmtub3duKSB7XG4gICAgKHRoaXMgYXMge3NlbGVjdGlvbjogU30pLnNlbGVjdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQubmV4dCh7c2VsZWN0aW9uOiB2YWx1ZSwgc291cmNlfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2lzVmFsaWREYXRlSW5zdGFuY2UoZGF0ZTogRCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmlzRGF0ZUluc3RhbmNlKGRhdGUpICYmIHRoaXMuX2FkYXB0ZXIuaXNWYWxpZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gIGFic3RyYWN0IGFkZChkYXRlOiBEIHwgbnVsbCk6IHZvaWQ7XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgYWJzdHJhY3QgaXNWYWxpZCgpOiBib29sZWFuO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFic3RyYWN0IGlzQ29tcGxldGUoKTogYm9vbGVhbjtcbn1cblxuLyoqICBBIHNlbGVjdGlvbiBtb2RlbCB0aGF0IGNvbnRhaW5zIGEgc2luZ2xlIGRhdGUuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPEQgfCBudWxsLCBEPiB7XG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgc3VwZXIobnVsbCwgYWRhcHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiBJbiB0aGUgY2FzZSBvZiBhIHNpbmdsZSBkYXRlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogc2ltcGx5IG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHRoaXMuc2VsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuIEluIHRoZSBjYXNlIG9mIGEgc2luZ2xlIGRhdGUgc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vdCBudWxsLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbDtcbiAgfVxufVxuXG4vKiogIEEgc2VsZWN0aW9uIG1vZGVsIHRoYXQgY29udGFpbnMgYSBkYXRlIHJhbmdlLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdFJhbmdlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPiwgRD4ge1xuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBEYXRlQWRhcHRlcjxEPikge1xuICAgIHN1cGVyKG5ldyBEYXRlUmFuZ2U8RD4obnVsbCwgbnVsbCksIGFkYXB0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkYXRlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGlvbi4gSW4gdGhlIGNhc2Ugb2YgYSBkYXRlIHJhbmdlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogZmlsbHMgaW4gdGhlIG5leHQgYG51bGxgIHZhbHVlIGluIHRoZSByYW5nZS4gSWYgYm90aCB0aGUgc3RhcnQgYW5kIHRoZSBlbmQgYWxyZWFkeSBoYXZlIGEgZGF0ZSxcbiAgICogdGhlIHNlbGVjdGlvbiBpcyByZXNldCBzbyB0aGF0IHRoZSBnaXZlbiBkYXRlIGlzIHRoZSBuZXcgYHN0YXJ0YCBhbmQgdGhlIGBlbmRgIGlzIG51bGwuXG4gICAqL1xuICBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkIHtcbiAgICBsZXQge3N0YXJ0LCBlbmR9ID0gdGhpcy5zZWxlY3Rpb247XG5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGVuZCA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICAgIGVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKG5ldyBEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCksIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSB0aGlzLnNlbGVjdGlvbjtcblxuICAgIC8vIEVtcHR5IHJhbmdlcyBhcmUgdmFsaWQuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwgJiYgZW5kID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENvbXBsZXRlIHJhbmdlcyBhcmUgb25seSB2YWxpZCBpZiBib3RoIGRhdGVzIGFyZSB2YWxpZCBhbmQgdGhlIHN0YXJ0IGlzIGJlZm9yZSB0aGUgZW5kLlxuICAgIGlmIChzdGFydCAhPSBudWxsICYmIGVuZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShzdGFydCkgJiYgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShlbmQpICYmXG4gICAgICAgICAgICAgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwO1xuICAgIH1cblxuICAgIC8vIFBhcnRpYWwgcmFuZ2VzIGFyZSB2YWxpZCBpZiB0aGUgc3RhcnQvZW5kIGlzIHZhbGlkLlxuICAgIHJldHVybiAoc3RhcnQgPT0gbnVsbCB8fCB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHN0YXJ0KSkgJiZcbiAgICAgICAgICAgKGVuZCA9PSBudWxsIHx8IHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UoZW5kKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiBJbiB0aGUgY2FzZSBvZiBhIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGhhcyBhIG5vbi1udWxsIGBzdGFydGAgYW5kIGBlbmRgLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uc3RhcnQgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvbi5lbmQgIT0gbnVsbDtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWShcbiAgICBwYXJlbnQ6IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDx1bmtub3duPiwgYWRhcHRlcjogRGF0ZUFkYXB0ZXI8dW5rbm93bj4pIHtcbiAgcmV0dXJuIHBhcmVudCB8fCBuZXcgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsKGFkYXB0ZXIpO1xufVxuXG4vKiogVXNlZCB0byBwcm92aWRlIGEgc2luZ2xlIHNlbGVjdGlvbiBtb2RlbCB0byBhIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZLFxufTtcblxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZKFxuICAgIHBhcmVudDogTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPHVua25vd24+LCBhZGFwdGVyOiBEYXRlQWRhcHRlcjx1bmtub3duPikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqIFVzZWQgdG8gcHJvdmlkZSBhIHJhbmdlIHNlbGVjdGlvbiBtb2RlbCB0byBhIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVI6IEZhY3RvcnlQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsXSwgRGF0ZUFkYXB0ZXJdLFxuICB1c2VGYWN0b3J5OiBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSxcbn07XG4iXX0=