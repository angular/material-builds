/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
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
/**
 * A selection model containing a date selection.
 * @docs-private
 */
export class MatDateSelectionModel {
    constructor(
    /** The current selection. */
    selection, _adapter) {
        this.selection = selection;
        this._adapter = _adapter;
        this._selectionChanged = new Subject();
        /** Emits when the selection has changed. */
        this.selectionChanged = this._selectionChanged;
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
    /**
     * Clones the selection model.
     * @deprecated To be turned into an abstract method.
     * @breaking-change 12.0.0
     */
    clone() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw Error('Not implemented');
        }
        return null;
    }
}
MatDateSelectionModel.decorators = [
    { type: Injectable }
];
MatDateSelectionModel.ctorParameters = () => [
    { type: undefined },
    { type: DateAdapter }
];
/**
 * A selection model that contains a single date.
 * @docs-private
 */
export class MatSingleDateSelectionModel extends MatDateSelectionModel {
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
    /** Clones the selection model. */
    clone() {
        const clone = new MatSingleDateSelectionModel(this._adapter);
        clone.updateSelection(this.selection, this);
        return clone;
    }
}
MatSingleDateSelectionModel.decorators = [
    { type: Injectable }
];
MatSingleDateSelectionModel.ctorParameters = () => [
    { type: DateAdapter }
];
/**
 * A selection model that contains a date range.
 * @docs-private
 */
export class MatRangeDateSelectionModel extends MatDateSelectionModel {
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
    /** Clones the selection model. */
    clone() {
        const clone = new MatRangeDateSelectionModel(this._adapter);
        clone.updateSelection(this.selection, this);
        return clone;
    }
}
MatRangeDateSelectionModel.decorators = [
    { type: Injectable }
];
MatRangeDateSelectionModel.ctorParameters = () => [
    { type: DateAdapter }
];
/** @docs-private */
export function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatSingleDateSelectionModel(adapter);
}
/**
 * Used to provide a single selection model to a component.
 * @docs-private
 */
export const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/** @docs-private */
export function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatRangeDateSelectionModel(adapter);
}
/**
 * Used to provide a range selection model to a component.
 * @docs-private
 */
export const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWtCLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLDZDQUE2QztBQUM3QyxNQUFNLE9BQU8sU0FBUztJQVFwQjtJQUNFLG1DQUFtQztJQUMxQixLQUFlO0lBQ3hCLGlDQUFpQztJQUN4QixHQUFhO1FBRmIsVUFBSyxHQUFMLEtBQUssQ0FBVTtRQUVmLFFBQUcsR0FBSCxHQUFHLENBQVU7SUFBRyxDQUFDO0NBQzdCO0FBb0JEOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IscUJBQXFCO0lBT3pDO0lBQ0UsNkJBQTZCO0lBQ3BCLFNBQVksRUFDWCxRQUF3QjtRQUR6QixjQUFTLEdBQVQsU0FBUyxDQUFHO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFSNUIsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQStCLENBQUM7UUFFdkUsNENBQTRDO1FBQzVDLHFCQUFnQixHQUE0QyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFNakYsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsS0FBUSxFQUFFLE1BQWU7UUFDdEMsSUFBdUIsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQzNDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxD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RSx1Q0FBdUM7Q0FDcEQsQ0FBQztBQUdGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsc0NBQXNDLENBQ2xELE1BQTRDLEVBQUUsT0FBNkI7SUFDN0UsT0FBTyxNQUFNLElBQUksSUFBSSwwQkFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUNBQXVDLEdBQW9CO0lBQ3RFLE9BQU8sRUFBRSxxQkFBcUI7SUFDOUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUscUJBQXFCLENBQUMsRUFBRSxXQUFXLENBQUM7SUFDNUUsVUFBVSxFQUFFLHNDQUFzQztDQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RmFjdG9yeVByb3ZpZGVyLCBJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGYsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBBIGNsYXNzIHJlcHJlc2VudGluZyBhIHJhbmdlIG9mIGRhdGVzLiAqL1xuZXhwb3J0IGNsYXNzIERhdGVSYW5nZTxEPiB7XG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoYXQgb2JqZWN0cyB3aXRoIGEgYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydHkgY2FuJ3QgYmUgYXNzaWduZWQgdG8gYSB2YXJpYWJsZSB0aGF0XG4gICAqIGV4cGVjdHMgYSBgRGF0ZVJhbmdlYFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC12YXJpYWJsZVxuICBwcml2YXRlIF9kaXNhYmxlU3RydWN0dXJhbEVxdWl2YWxlbmN5OiBuZXZlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIHN0YXJ0IGRhdGUgb2YgdGhlIHJhbmdlLiAqL1xuICAgIHJlYWRvbmx5IHN0YXJ0OiBEIHwgbnVsbCxcbiAgICAvKiogVGhlIGVuZCBkYXRlIG9mIHRoZSByYW5nZS4gKi9cbiAgICByZWFkb25seSBlbmQ6IEQgfCBudWxsKSB7fVxufVxuXG4vKipcbiAqIENvbmRpdGlvbmFsbHkgcGlja3MgdGhlIGRhdGUgdHlwZSwgaWYgYSBEYXRlUmFuZ2UgaXMgcGFzc2VkIGluLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFQ+ID0gVCBleHRlbmRzIERhdGVSYW5nZTxpbmZlciBEPiA/IEQgOiBOb25OdWxsYWJsZTxUPjtcblxuLyoqXG4gKiBFdmVudCBlbWl0dGVkIGJ5IHRoZSBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aGVuIGl0cyBzZWxlY3Rpb24gY2hhbmdlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8Uz4ge1xuICAvKiogTmV3IHZhbHVlIGZvciB0aGUgc2VsZWN0aW9uLiAqL1xuICBzZWxlY3Rpb246IFM7XG5cbiAgLyoqIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgY2hhbmdlLiAqL1xuICBzb3VyY2U6IHVua25vd247XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgY29udGFpbmluZyBhIGRhdGUgc2VsZWN0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICAgIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkLiAqL1xuICBzZWxlY3Rpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPj4gPSB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICAgIHJlYWRvbmx5IHNlbGVjdGlvbjogUyxcbiAgICBwcm90ZWN0ZWQgX2FkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzZWxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gaW4gdGhlIG1vZGVsLlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHNlbGVjdGlvbiB0aGF0IHNob3VsZCBiZSBhc3NpZ25lZC5cbiAgICogQHBhcmFtIHNvdXJjZSBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIHNlbGVjdGlvbiBjaGFuZ2UuXG4gICAqL1xuICB1cGRhdGVTZWxlY3Rpb24odmFsdWU6IFMsIHNvdXJjZTogdW5rbm93bikge1xuICAgICh0aGlzIGFzIHtzZWxlY3Rpb246IFN9KS5zZWxlY3Rpb24gPSB2YWx1ZTtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLm5leHQoe3NlbGVjdGlvbjogdmFsdWUsIHNvdXJjZX0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pc1ZhbGlkRGF0ZUluc3RhbmNlKGRhdGU6IEQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5pc0RhdGVJbnN0YW5jZShkYXRlKSAmJiB0aGlzLl9hZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XG4gIH1cblxuICAvKiogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICBhYnN0cmFjdCBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGFic3RyYWN0IGlzVmFsaWQoKTogYm9vbGVhbjtcblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBpc0NvbXBsZXRlKCk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENsb25lcyB0aGUgc2VsZWN0aW9uIG1vZGVsLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhbiBhYnN0cmFjdCBtZXRob2QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wXG4gICAqL1xuICBjbG9uZSgpOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIHRocm93IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbCE7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNlbGVjdGlvbiBtb2RlbCB0aGF0IGNvbnRhaW5zIGEgc2luZ2xlIGRhdGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRTaW5nbGVEYXRlU2VsZWN0aW9uTW9kZWw8RD4gZXh0ZW5kcyBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RCB8IG51bGwsIEQ+IHtcbiAgY29uc3RydWN0b3IoYWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHtcbiAgICBzdXBlcihudWxsLCBhZGFwdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uIEluIHRoZSBjYXNlIG9mIGEgc2luZ2xlIGRhdGUgc2VsZWN0aW9uLCB0aGUgYWRkZWQgZGF0ZVxuICAgKiBzaW1wbHkgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgc2VsZWN0aW9uXG4gICAqL1xuICBhZGQoZGF0ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci51cGRhdGVTZWxlY3Rpb24oZGF0ZSwgdGhpcyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHZhbGlkLiAqL1xuICBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbiAhPSBudWxsICYmIHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UodGhpcy5zZWxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBjb21wbGV0ZS4gSW4gdGhlIGNhc2Ugb2YgYSBzaW5nbGUgZGF0ZSBzZWxlY3Rpb24sIHRoaXNcbiAgICogaXMgdHJ1ZSBpZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm90IG51bGwuXG4gICAqL1xuICBpc0NvbXBsZXRlKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbiAhPSBudWxsO1xuICB9XG5cbiAgLyoqIENsb25lcyB0aGUgc2VsZWN0aW9uIG1vZGVsLiAqL1xuICBjbG9uZSgpIHtcbiAgICBjb25zdCBjbG9uZSA9IG5ldyBNYXRTaW5nbGVEYXRlU2VsZWN0aW9uTW9kZWw8RD4odGhpcy5fYWRhcHRlcik7XG4gICAgY2xvbmUudXBkYXRlU2VsZWN0aW9uKHRoaXMuc2VsZWN0aW9uLCB0aGlzKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNlbGVjdGlvbiBtb2RlbCB0aGF0IGNvbnRhaW5zIGEgZGF0ZSByYW5nZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdFJhbmdlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPiwgRD4ge1xuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBEYXRlQWRhcHRlcjxEPikge1xuICAgIHN1cGVyKG5ldyBEYXRlUmFuZ2U8RD4obnVsbCwgbnVsbCksIGFkYXB0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkYXRlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGlvbi4gSW4gdGhlIGNhc2Ugb2YgYSBkYXRlIHJhbmdlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogZmlsbHMgaW4gdGhlIG5leHQgYG51bGxgIHZhbHVlIGluIHRoZSByYW5nZS4gSWYgYm90aCB0aGUgc3RhcnQgYW5kIHRoZSBlbmQgYWxyZWFkeSBoYXZlIGEgZGF0ZSxcbiAgICogdGhlIHNlbGVjdGlvbiBpcyByZXNldCBzbyB0aGF0IHRoZSBnaXZlbiBkYXRlIGlzIHRoZSBuZXcgYHN0YXJ0YCBhbmQgdGhlIGBlbmRgIGlzIG51bGwuXG4gICAqL1xuICBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkIHtcbiAgICBsZXQge3N0YXJ0LCBlbmR9ID0gdGhpcy5zZWxlY3Rpb247XG5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGVuZCA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICAgIGVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKG5ldyBEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCksIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSB0aGlzLnNlbGVjdGlvbjtcblxuICAgIC8vIEVtcHR5IHJhbmdlcyBhcmUgdmFsaWQuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwgJiYgZW5kID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENvbXBsZXRlIHJhbmdlcyBhcmUgb25seSB2YWxpZCBpZiBib3RoIGRhdGVzIGFyZSB2YWxpZCBhbmQgdGhlIHN0YXJ0IGlzIGJlZm9yZSB0aGUgZW5kLlxuICAgIGlmIChzdGFydCAhPSBudWxsICYmIGVuZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShzdGFydCkgJiYgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShlbmQpICYmXG4gICAgICAgICAgICAgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwO1xuICAgIH1cblxuICAgIC8vIFBhcnRpYWwgcmFuZ2VzIGFyZSB2YWxpZCBpZiB0aGUgc3RhcnQvZW5kIGlzIHZhbGlkLlxuICAgIHJldHVybiAoc3RhcnQgPT0gbnVsbCB8fCB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHN0YXJ0KSkgJiZcbiAgICAgICAgICAgKGVuZCA9PSBudWxsIHx8IHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UoZW5kKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiBJbiB0aGUgY2FzZSBvZiBhIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGhhcyBhIG5vbi1udWxsIGBzdGFydGAgYW5kIGBlbmRgLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uc3RhcnQgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvbi5lbmQgIT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBDbG9uZXMgdGhlIHNlbGVjdGlvbiBtb2RlbC4gKi9cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY2xvbmUgPSBuZXcgTWF0UmFuZ2VEYXRlU2VsZWN0aW9uTW9kZWw8RD4odGhpcy5fYWRhcHRlcik7XG4gICAgY2xvbmUudXBkYXRlU2VsZWN0aW9uKHRoaXMuc2VsZWN0aW9uLCB0aGlzKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlkoXG4gICAgcGFyZW50OiBNYXRTaW5nbGVEYXRlU2VsZWN0aW9uTW9kZWw8dW5rbm93bj4sIGFkYXB0ZXI6IERhdGVBZGFwdGVyPHVua25vd24+KSB7XG4gIHJldHVybiBwYXJlbnQgfHwgbmV3IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBzaW5nbGUgc2VsZWN0aW9uIG1vZGVsIHRvIGEgY29tcG9uZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9QUk9WSURFUjogRmFjdG9yeVByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBNYXREYXRlU2VsZWN0aW9uTW9kZWwsXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXREYXRlU2VsZWN0aW9uTW9kZWxdLCBEYXRlQWRhcHRlcl0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSxcbn07XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWShcbiAgICBwYXJlbnQ6IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDx1bmtub3duPiwgYWRhcHRlcjogRGF0ZUFkYXB0ZXI8dW5rbm93bj4pIHtcbiAgcmV0dXJuIHBhcmVudCB8fCBuZXcgTWF0UmFuZ2VEYXRlU2VsZWN0aW9uTW9kZWwoYWRhcHRlcik7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgcmFuZ2Ugc2VsZWN0aW9uIG1vZGVsIHRvIGEgY29tcG9uZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlksXG59O1xuIl19