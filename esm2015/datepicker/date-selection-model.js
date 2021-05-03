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
        const oldValue = this.selection;
        this.selection = value;
        this._selectionChanged.next({ selection: value, source, oldValue });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWtCLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLDZDQUE2QztBQUM3QyxNQUFNLE9BQU8sU0FBUztJQVFwQjtJQUNFLG1DQUFtQztJQUMxQixLQUFlO0lBQ3hCLGlDQUFpQztJQUN4QixHQUFhO1FBRmIsVUFBSyxHQUFMLEtBQUssQ0FBVTtRQUVmLFFBQUcsR0FBSCxHQUFHLENBQVU7SUFBRyxDQUFDO0NBQzdCO0FBdUJEOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IscUJBQXFCO0lBT3pDO0lBQ0UsNkJBQTZCO0lBQ3BCLFNBQVksRUFDWCxRQUF3QjtRQUR6QixjQUFTLEdBQVQsU0FBUyxDQUFHO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFSNUIsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQStCLENBQUM7UUFFdkUsNENBQTRDO1FBQzVDLHFCQUFnQixHQUE0QyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFNakYsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsS0FBUSxFQUFFLE1BQWU7UUFDdkMsTUFBTSxRQUFRLEdBQUksSUFBdUIsQ0FBQyxTQUFTLENBQUM7UUFDbkQsSUFBdUIsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQzNDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJ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LEVBQUUsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLFdBQVcsQ0FBQztJQUM1RSxVQUFVLEVBQUUsdUNBQXVDO0NBQ3BELENBQUM7QUFHRixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLHNDQUFzQyxDQUNsRCxNQUE0QyxFQUFFLE9BQTZCO0lBQzdFLE9BQU8sTUFBTSxJQUFJLElBQUksMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHVDQUF1QyxHQUFvQjtJQUN0RSxPQUFPLEVBQUUscUJBQXFCO0lBQzlCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLHFCQUFxQixDQUFDLEVBQUUsV0FBVyxDQUFDO0lBQzVFLFVBQVUsRUFBRSxzQ0FBc0M7Q0FDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZhY3RvcnlQcm92aWRlciwgSW5qZWN0YWJsZSwgT3B0aW9uYWwsIFNraXBTZWxmLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKiogQSBjbGFzcyByZXByZXNlbnRpbmcgYSByYW5nZSBvZiBkYXRlcy4gKi9cbmV4cG9ydCBjbGFzcyBEYXRlUmFuZ2U8RD4ge1xuICAvKipcbiAgICogRW5zdXJlcyB0aGF0IG9iamVjdHMgd2l0aCBhIGBzdGFydGAgYW5kIGBlbmRgIHByb3BlcnR5IGNhbid0IGJlIGFzc2lnbmVkIHRvIGEgdmFyaWFibGUgdGhhdFxuICAgKiBleHBlY3RzIGEgYERhdGVSYW5nZWBcbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtdmFyaWFibGVcbiAgcHJpdmF0ZSBfZGlzYWJsZVN0cnVjdHVyYWxFcXVpdmFsZW5jeTogbmV2ZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBzdGFydCBkYXRlIG9mIHRoZSByYW5nZS4gKi9cbiAgICByZWFkb25seSBzdGFydDogRCB8IG51bGwsXG4gICAgLyoqIFRoZSBlbmQgZGF0ZSBvZiB0aGUgcmFuZ2UuICovXG4gICAgcmVhZG9ubHkgZW5kOiBEIHwgbnVsbCkge31cbn1cblxuLyoqXG4gKiBDb25kaXRpb25hbGx5IHBpY2tzIHRoZSBkYXRlIHR5cGUsIGlmIGEgRGF0ZVJhbmdlIGlzIHBhc3NlZCBpbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxUPiA9IFQgZXh0ZW5kcyBEYXRlUmFuZ2U8aW5mZXIgRD4gPyBEIDogTm9uTnVsbGFibGU8VD47XG5cbi8qKlxuICogRXZlbnQgZW1pdHRlZCBieSB0aGUgZGF0ZSBzZWxlY3Rpb24gbW9kZWwgd2hlbiBpdHMgc2VsZWN0aW9uIGNoYW5nZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+IHtcbiAgLyoqIE5ldyB2YWx1ZSBmb3IgdGhlIHNlbGVjdGlvbi4gKi9cbiAgc2VsZWN0aW9uOiBTO1xuXG4gIC8qKiBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIGNoYW5nZS4gKi9cbiAgc291cmNlOiB1bmtub3duO1xuXG4gIC8qKiBQcmV2aW91cyB2YWx1ZSAqL1xuICBvbGRWYWx1ZT86IFM7XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgY29udGFpbmluZyBhIGRhdGUgc2VsZWN0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICAgIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkLiAqL1xuICBzZWxlY3Rpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPj4gPSB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICAgIHJlYWRvbmx5IHNlbGVjdGlvbjogUyxcbiAgICBwcm90ZWN0ZWQgX2FkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzZWxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gaW4gdGhlIG1vZGVsLlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHNlbGVjdGlvbiB0aGF0IHNob3VsZCBiZSBhc3NpZ25lZC5cbiAgICogQHBhcmFtIHNvdXJjZSBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIHNlbGVjdGlvbiBjaGFuZ2UuXG4gICAqL1xuICB1cGRhdGVTZWxlY3Rpb24odmFsdWU6IFMsIHNvdXJjZTogdW5rbm93bikge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gKHRoaXMgYXMge3NlbGVjdGlvbjogU30pLnNlbGVjdGlvbjtcbiAgICAodGhpcyBhcyB7c2VsZWN0aW9uOiBTfSkuc2VsZWN0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5uZXh0KHtzZWxlY3Rpb246IHZhbHVlLCBzb3VyY2UsIG9sZFZhbHVlfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2lzVmFsaWREYXRlSW5zdGFuY2UoZGF0ZTogRCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmlzRGF0ZUluc3RhbmNlKGRhdGUpICYmIHRoaXMuX2FkYXB0ZXIuaXNWYWxpZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gIGFic3RyYWN0IGFkZChkYXRlOiBEIHwgbnVsbCk6IHZvaWQ7XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgYWJzdHJhY3QgaXNWYWxpZCgpOiBib29sZWFuO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFic3RyYWN0IGlzQ29tcGxldGUoKTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ2xvbmVzIHRoZSBzZWxlY3Rpb24gbW9kZWwuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGFuIGFic3RyYWN0IG1ldGhvZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICovXG4gIGNsb25lKCk6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPiB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsITtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2VsZWN0aW9uIG1vZGVsIHRoYXQgY29udGFpbnMgYSBzaW5nbGUgZGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDxEPiBleHRlbmRzIE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEIHwgbnVsbCwgRD4ge1xuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBEYXRlQWRhcHRlcjxEPikge1xuICAgIHN1cGVyKG51bGwsIGFkYXB0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkYXRlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGlvbi4gSW4gdGhlIGNhc2Ugb2YgYSBzaW5nbGUgZGF0ZSBzZWxlY3Rpb24sIHRoZSBhZGRlZCBkYXRlXG4gICAqIHNpbXBseSBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyBzZWxlY3Rpb25cbiAgICovXG4gIGFkZChkYXRlOiBEIHwgbnVsbCkge1xuICAgIHN1cGVyLnVwZGF0ZVNlbGVjdGlvbihkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uICE9IG51bGwgJiYgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZSh0aGlzLnNlbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiBJbiB0aGUgY2FzZSBvZiBhIHNpbmdsZSBkYXRlIHNlbGVjdGlvbiwgdGhpc1xuICAgKiBpcyB0cnVlIGlmIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBub3QgbnVsbC5cbiAgICovXG4gIGlzQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uICE9IG51bGw7XG4gIH1cblxuICAvKiogQ2xvbmVzIHRoZSBzZWxlY3Rpb24gbW9kZWwuICovXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDxEPih0aGlzLl9hZGFwdGVyKTtcbiAgICBjbG9uZS51cGRhdGVTZWxlY3Rpb24odGhpcy5zZWxlY3Rpb24sIHRoaXMpO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2VsZWN0aW9uIG1vZGVsIHRoYXQgY29udGFpbnMgYSBkYXRlIHJhbmdlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWF0UmFuZ2VEYXRlU2VsZWN0aW9uTW9kZWw8RD4gZXh0ZW5kcyBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+LCBEPiB7XG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgc3VwZXIobmV3IERhdGVSYW5nZTxEPihudWxsLCBudWxsKSwgYWRhcHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiBJbiB0aGUgY2FzZSBvZiBhIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uLCB0aGUgYWRkZWQgZGF0ZVxuICAgKiBmaWxscyBpbiB0aGUgbmV4dCBgbnVsbGAgdmFsdWUgaW4gdGhlIHJhbmdlLiBJZiBib3RoIHRoZSBzdGFydCBhbmQgdGhlIGVuZCBhbHJlYWR5IGhhdmUgYSBkYXRlLFxuICAgKiB0aGUgc2VsZWN0aW9uIGlzIHJlc2V0IHNvIHRoYXQgdGhlIGdpdmVuIGRhdGUgaXMgdGhlIG5ldyBgc3RhcnRgIGFuZCB0aGUgYGVuZGAgaXMgbnVsbC5cbiAgICovXG4gIGFkZChkYXRlOiBEIHwgbnVsbCk6IHZvaWQge1xuICAgIGxldCB7c3RhcnQsIGVuZH0gPSB0aGlzLnNlbGVjdGlvbjtcblxuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBzdGFydCA9IGRhdGU7XG4gICAgfSBlbHNlIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgZW5kID0gZGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgICAgZW5kID0gbnVsbDtcbiAgICB9XG5cbiAgICBzdXBlci51cGRhdGVTZWxlY3Rpb24obmV3IERhdGVSYW5nZTxEPihzdGFydCwgZW5kKSwgdGhpcyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHZhbGlkLiAqL1xuICBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHtzdGFydCwgZW5kfSA9IHRoaXMuc2VsZWN0aW9uO1xuXG4gICAgLy8gRW1wdHkgcmFuZ2VzIGFyZSB2YWxpZC5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCAmJiBlbmQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ29tcGxldGUgcmFuZ2VzIGFyZSBvbmx5IHZhbGlkIGlmIGJvdGggZGF0ZXMgYXJlIHZhbGlkIGFuZCB0aGUgc3RhcnQgaXMgYmVmb3JlIHRoZSBlbmQuXG4gICAgaWYgKHN0YXJ0ICE9IG51bGwgJiYgZW5kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHN0YXJ0KSAmJiB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKGVuZCkgJiZcbiAgICAgICAgICAgICB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRlKHN0YXJ0LCBlbmQpIDw9IDA7XG4gICAgfVxuXG4gICAgLy8gUGFydGlhbCByYW5nZXMgYXJlIHZhbGlkIGlmIHRoZSBzdGFydC9lbmQgaXMgdmFsaWQuXG4gICAgcmV0dXJuIChzdGFydCA9PSBudWxsIHx8IHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2Uoc3RhcnQpKSAmJlxuICAgICAgICAgICAoZW5kID09IG51bGwgfHwgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShlbmQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuIEluIHRoZSBjYXNlIG9mIGEgZGF0ZSByYW5nZSBzZWxlY3Rpb24sIHRoaXNcbiAgICogaXMgdHJ1ZSBpZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaGFzIGEgbm9uLW51bGwgYHN0YXJ0YCBhbmQgYGVuZGAuXG4gICAqL1xuICBpc0NvbXBsZXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5zdGFydCAhPSBudWxsICYmIHRoaXMuc2VsZWN0aW9uLmVuZCAhPSBudWxsO1xuICB9XG5cbiAgLyoqIENsb25lcyB0aGUgc2VsZWN0aW9uIG1vZGVsLiAqL1xuICBjbG9uZSgpIHtcbiAgICBjb25zdCBjbG9uZSA9IG5ldyBNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbDxEPih0aGlzLl9hZGFwdGVyKTtcbiAgICBjbG9uZS51cGRhdGVTZWxlY3Rpb24odGhpcy5zZWxlY3Rpb24sIHRoaXMpO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWShcbiAgICBwYXJlbnQ6IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDx1bmtub3duPiwgYWRhcHRlcjogRGF0ZUFkYXB0ZXI8dW5rbm93bj4pIHtcbiAgcmV0dXJuIHBhcmVudCB8fCBuZXcgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsKGFkYXB0ZXIpO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIHNpbmdsZSBzZWxlY3Rpb24gbW9kZWwgdG8gYSBjb21wb25lbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZLFxufTtcblxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZKFxuICAgIHBhcmVudDogTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPHVua25vd24+LCBhZGFwdGVyOiBEYXRlQWRhcHRlcjx1bmtub3duPikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSByYW5nZSBzZWxlY3Rpb24gbW9kZWwgdG8gYSBjb21wb25lbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVI6IEZhY3RvcnlQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsXSwgRGF0ZUFkYXB0ZXJdLFxuICB1c2VGYWN0b3J5OiBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSxcbn07XG4iXX0=