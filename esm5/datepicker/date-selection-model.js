/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
/** A class representing a range of dates. */
var DateRange = /** @class */ (function () {
    function DateRange(
    /** The start date of the range. */
    start, 
    /** The end date of the range. */
    end) {
        this.start = start;
        this.end = end;
    }
    return DateRange;
}());
export { DateRange };
/** A selection model containing a date selection. */
var MatDateSelectionModel = /** @class */ (function () {
    function MatDateSelectionModel(
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
    MatDateSelectionModel.prototype.updateSelection = function (value, source) {
        this.selection = value;
        this._selectionChanged.next({ selection: value, source: source });
    };
    MatDateSelectionModel.prototype.ngOnDestroy = function () {
        this._selectionChanged.complete();
    };
    MatDateSelectionModel.prototype._isValidDateInstance = function (date) {
        return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
    };
    return MatDateSelectionModel;
}());
export { MatDateSelectionModel };
/**  A selection model that contains a single date. */
var MatSingleDateSelectionModel = /** @class */ (function (_super) {
    __extends(MatSingleDateSelectionModel, _super);
    function MatSingleDateSelectionModel(adapter) {
        return _super.call(this, null, adapter) || this;
    }
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     */
    MatSingleDateSelectionModel.prototype.add = function (date) {
        _super.prototype.updateSelection.call(this, date, this);
    };
    /** Checks whether the current selection is valid. */
    MatSingleDateSelectionModel.prototype.isValid = function () {
        return this.selection != null && this._isValidDateInstance(this.selection);
    };
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     */
    MatSingleDateSelectionModel.prototype.isComplete = function () {
        return this.selection != null;
    };
    MatSingleDateSelectionModel.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MatSingleDateSelectionModel.ctorParameters = function () { return [
        { type: DateAdapter }
    ]; };
    return MatSingleDateSelectionModel;
}(MatDateSelectionModel));
export { MatSingleDateSelectionModel };
/**  A selection model that contains a date range. */
var MatRangeDateSelectionModel = /** @class */ (function (_super) {
    __extends(MatRangeDateSelectionModel, _super);
    function MatRangeDateSelectionModel(adapter) {
        return _super.call(this, new DateRange(null, null), adapter) || this;
    }
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     */
    MatRangeDateSelectionModel.prototype.add = function (date) {
        var _a = this.selection, start = _a.start, end = _a.end;
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
        _super.prototype.updateSelection.call(this, new DateRange(start, end), this);
    };
    /** Checks whether the current selection is valid. */
    MatRangeDateSelectionModel.prototype.isValid = function () {
        var _a = this.selection, start = _a.start, end = _a.end;
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
    };
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     */
    MatRangeDateSelectionModel.prototype.isComplete = function () {
        return this.selection.start != null && this.selection.end != null;
    };
    MatRangeDateSelectionModel.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MatRangeDateSelectionModel.ctorParameters = function () { return [
        { type: DateAdapter }
    ]; };
    return MatRangeDateSelectionModel;
}(MatDateSelectionModel));
export { MatRangeDateSelectionModel };
/** @docs-private */
export function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatSingleDateSelectionModel(adapter);
}
/** Used to provide a single selection model to a component. */
export var MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/** @docs-private */
export function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatRangeDateSelectionModel(adapter);
}
/** Used to provide a range selection model to a component. */
export var MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFrQixVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUV6Qyw2Q0FBNkM7QUFDN0M7SUFRRTtJQUNFLG1DQUFtQztJQUMxQixLQUFlO0lBQ3hCLGlDQUFpQztJQUN4QixHQUFhO1FBRmIsVUFBSyxHQUFMLEtBQUssQ0FBVTtRQUVmLFFBQUcsR0FBSCxHQUFHLENBQVU7SUFBRyxDQUFDO0lBQzlCLGdCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7O0FBaUJELHFEQUFxRDtBQUNyRDtJQU9FO0lBQ0UsNkJBQTZCO0lBQ3BCLFNBQVksRUFDWCxRQUF3QjtRQUR6QixjQUFTLEdBQVQsU0FBUyxDQUFHO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFSNUIsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQStCLENBQUM7UUFFdkUsNENBQTRDO1FBQzVDLHFCQUFnQixHQUE0QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFNaEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCwrQ0FBZSxHQUFmLFVBQWdCLEtBQVEsRUFBRSxNQUFlO1FBQ3RDLElBQXVCLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELDJDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVTLG9EQUFvQixHQUE5QixVQUErQixJQUFPO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQVVILDRCQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQzs7QUFFRCxzREFBc0Q7QUFDdEQ7SUFDb0QsK0NBQWtDO0lBQ3BGLHFDQUFZLE9BQXVCO2VBQ2pDLGtCQUFNLElBQUksRUFBRSxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILHlDQUFHLEdBQUgsVUFBSSxJQUFjO1FBQ2hCLGlCQUFNLGVBQWUsWUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELHFEQUFxRDtJQUNyRCw2Q0FBTyxHQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxnREFBVSxHQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztJQUNoQyxDQUFDOztnQkF6QkYsVUFBVTs7OztnQkE5RUgsV0FBVzs7SUF3R25CLGtDQUFDO0NBQUEsQUExQkQsQ0FDb0QscUJBQXFCLEdBeUJ4RTtTQXpCWSwyQkFBMkI7QUEyQnhDLHFEQUFxRDtBQUNyRDtJQUNtRCw4Q0FBc0M7SUFDdkYsb0NBQVksT0FBdUI7ZUFDakMsa0JBQU0sSUFBSSxTQUFTLENBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHdDQUFHLEdBQUgsVUFBSSxJQUFjO1FBQ1osSUFBQSxtQkFBNkIsRUFBNUIsZ0JBQUssRUFBRSxZQUFxQixDQUFDO1FBRWxDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtZQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ2Q7YUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNaO2FBQU07WUFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2IsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNaO1FBRUQsaUJBQU0sZUFBZSxZQUFDLElBQUksU0FBUyxDQUFJLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQscURBQXFEO0lBQ3JELDRDQUFPLEdBQVA7UUFDUSxJQUFBLG1CQUE2QixFQUE1QixnQkFBSyxFQUFFLFlBQXFCLENBQUM7UUFFcEMsMEJBQTBCO1FBQzFCLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCwwRkFBMEY7UUFDMUYsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUVELHNEQUFzRDtRQUN0RCxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7O09BR0c7SUFDSCwrQ0FBVSxHQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO0lBQ3BFLENBQUM7O2dCQXBERixVQUFVOzs7O2dCQTNHSCxXQUFXOztJQWdLbkIsaUNBQUM7Q0FBQSxBQXJERCxDQUNtRCxxQkFBcUIsR0FvRHZFO1NBcERZLDBCQUEwQjtBQXNEdkMsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSx1Q0FBdUMsQ0FDbkQsTUFBNEMsRUFBRSxPQUE2QjtJQUM3RSxPQUFPLE1BQU0sSUFBSSxJQUFJLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFFRCwrREFBK0Q7QUFDL0QsTUFBTSxDQUFDLElBQU0sd0NBQXdDLEdBQW9CO0lBQ3ZFLE9BQU8sRUFBRSxxQkFBcUI7SUFDOUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUscUJBQXFCLENBQUMsRUFBRSxXQUFXLENBQUM7SUFDNUUsVUFBVSxFQUFFLHVDQUF1QztDQUNwRCxDQUFDO0FBR0Ysb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxzQ0FBc0MsQ0FDbEQsTUFBNEMsRUFBRSxPQUE2QjtJQUM3RSxPQUFPLE1BQU0sSUFBSSxJQUFJLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCw4REFBOEQ7QUFDOUQsTUFBTSxDQUFDLElBQU0sdUNBQXVDLEdBQW9CO0lBQ3RFLE9BQU8sRUFBRSxxQkFBcUI7SUFDOUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUscUJBQXFCLENBQUMsRUFBRSxXQUFXLENBQUM7SUFDNUUsVUFBVSxFQUFFLHNDQUFzQztDQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RmFjdG9yeVByb3ZpZGVyLCBJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGYsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBBIGNsYXNzIHJlcHJlc2VudGluZyBhIHJhbmdlIG9mIGRhdGVzLiAqL1xuZXhwb3J0IGNsYXNzIERhdGVSYW5nZTxEPiB7XG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoYXQgb2JqZWN0cyB3aXRoIGEgYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydHkgY2FuJ3QgYmUgYXNzaWduZWQgdG8gYSB2YXJpYWJsZSB0aGF0XG4gICAqIGV4cGVjdHMgYSBgRGF0ZVJhbmdlYFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC12YXJpYWJsZVxuICBwcml2YXRlIF9kaXNhYmxlU3RydWN0dXJhbEVxdWl2YWxlbmN5OiBuZXZlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIHN0YXJ0IGRhdGUgb2YgdGhlIHJhbmdlLiAqL1xuICAgIHJlYWRvbmx5IHN0YXJ0OiBEIHwgbnVsbCxcbiAgICAvKiogVGhlIGVuZCBkYXRlIG9mIHRoZSByYW5nZS4gKi9cbiAgICByZWFkb25seSBlbmQ6IEQgfCBudWxsKSB7fVxufVxuXG4vKipcbiAqIENvbmRpdGlvbmFsbHkgcGlja3MgdGhlIGRhdGUgdHlwZSwgaWYgYSBEYXRlUmFuZ2UgaXMgcGFzc2VkIGluLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFQ+ID0gVCBleHRlbmRzIERhdGVSYW5nZTxpbmZlciBEPiA/IEQgOiBOb25OdWxsYWJsZTxUPjtcblxuLyoqIEV2ZW50IGVtaXR0ZWQgYnkgdGhlIGRhdGUgc2VsZWN0aW9uIG1vZGVsIHdoZW4gaXRzIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8Uz4ge1xuICAvKiogTmV3IHZhbHVlIGZvciB0aGUgc2VsZWN0aW9uLiAqL1xuICBzZWxlY3Rpb246IFM7XG5cbiAgLyoqIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgY2hhbmdlLiAqL1xuICBzb3VyY2U6IHVua25vd247XG59XG5cbi8qKiBBIHNlbGVjdGlvbiBtb2RlbCBjb250YWluaW5nIGEgZGF0ZSBzZWxlY3Rpb24uICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICAgIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkLiAqL1xuICBzZWxlY3Rpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPj4gPSB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICAgIHJlYWRvbmx5IHNlbGVjdGlvbjogUyxcbiAgICBwcm90ZWN0ZWQgX2FkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzZWxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gaW4gdGhlIG1vZGVsLlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHNlbGVjdGlvbiB0aGF0IHNob3VsZCBiZSBhc3NpZ25lZC5cbiAgICogQHBhcmFtIHNvdXJjZSBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIHNlbGVjdGlvbiBjaGFuZ2UuXG4gICAqL1xuICB1cGRhdGVTZWxlY3Rpb24odmFsdWU6IFMsIHNvdXJjZTogdW5rbm93bikge1xuICAgICh0aGlzIGFzIHtzZWxlY3Rpb246IFN9KS5zZWxlY3Rpb24gPSB2YWx1ZTtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLm5leHQoe3NlbGVjdGlvbjogdmFsdWUsIHNvdXJjZX0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pc1ZhbGlkRGF0ZUluc3RhbmNlKGRhdGU6IEQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5pc0RhdGVJbnN0YW5jZShkYXRlKSAmJiB0aGlzLl9hZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XG4gIH1cblxuICAvKiogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICBhYnN0cmFjdCBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGFic3RyYWN0IGlzVmFsaWQoKTogYm9vbGVhbjtcblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBpc0NvbXBsZXRlKCk6IGJvb2xlYW47XG59XG5cbi8qKiAgQSBzZWxlY3Rpb24gbW9kZWwgdGhhdCBjb250YWlucyBhIHNpbmdsZSBkYXRlLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDxEPiBleHRlbmRzIE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEIHwgbnVsbCwgRD4ge1xuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBEYXRlQWRhcHRlcjxEPikge1xuICAgIHN1cGVyKG51bGwsIGFkYXB0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkYXRlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGlvbi4gSW4gdGhlIGNhc2Ugb2YgYSBzaW5nbGUgZGF0ZSBzZWxlY3Rpb24sIHRoZSBhZGRlZCBkYXRlXG4gICAqIHNpbXBseSBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyBzZWxlY3Rpb25cbiAgICovXG4gIGFkZChkYXRlOiBEIHwgbnVsbCkge1xuICAgIHN1cGVyLnVwZGF0ZVNlbGVjdGlvbihkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uICE9IG51bGwgJiYgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZSh0aGlzLnNlbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiBJbiB0aGUgY2FzZSBvZiBhIHNpbmdsZSBkYXRlIHNlbGVjdGlvbiwgdGhpc1xuICAgKiBpcyB0cnVlIGlmIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBub3QgbnVsbC5cbiAgICovXG4gIGlzQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uICE9IG51bGw7XG4gIH1cbn1cblxuLyoqICBBIHNlbGVjdGlvbiBtb2RlbCB0aGF0IGNvbnRhaW5zIGEgZGF0ZSByYW5nZS4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbDxEPiBleHRlbmRzIE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEYXRlUmFuZ2U8RD4sIEQ+IHtcbiAgY29uc3RydWN0b3IoYWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHtcbiAgICBzdXBlcihuZXcgRGF0ZVJhbmdlPEQ+KG51bGwsIG51bGwpLCBhZGFwdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uIEluIHRoZSBjYXNlIG9mIGEgZGF0ZSByYW5nZSBzZWxlY3Rpb24sIHRoZSBhZGRlZCBkYXRlXG4gICAqIGZpbGxzIGluIHRoZSBuZXh0IGBudWxsYCB2YWx1ZSBpbiB0aGUgcmFuZ2UuIElmIGJvdGggdGhlIHN0YXJ0IGFuZCB0aGUgZW5kIGFscmVhZHkgaGF2ZSBhIGRhdGUsXG4gICAqIHRoZSBzZWxlY3Rpb24gaXMgcmVzZXQgc28gdGhhdCB0aGUgZ2l2ZW4gZGF0ZSBpcyB0aGUgbmV3IGBzdGFydGAgYW5kIHRoZSBgZW5kYCBpcyBudWxsLlxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKTogdm9pZCB7XG4gICAgbGV0IHtzdGFydCwgZW5kfSA9IHRoaXMuc2VsZWN0aW9uO1xuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBlbmQgPSBkYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IGRhdGU7XG4gICAgICBlbmQgPSBudWxsO1xuICAgIH1cblxuICAgIHN1cGVyLnVwZGF0ZVNlbGVjdGlvbihuZXcgRGF0ZVJhbmdlPEQ+KHN0YXJ0LCBlbmQpLCB0aGlzKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gdGhpcy5zZWxlY3Rpb247XG5cbiAgICAvLyBFbXB0eSByYW5nZXMgYXJlIHZhbGlkLlxuICAgIGlmIChzdGFydCA9PSBudWxsICYmIGVuZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDb21wbGV0ZSByYW5nZXMgYXJlIG9ubHkgdmFsaWQgaWYgYm90aCBkYXRlcyBhcmUgdmFsaWQgYW5kIHRoZSBzdGFydCBpcyBiZWZvcmUgdGhlIGVuZC5cbiAgICBpZiAoc3RhcnQgIT0gbnVsbCAmJiBlbmQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2Uoc3RhcnQpICYmIHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UoZW5kKSAmJlxuICAgICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGUoc3RhcnQsIGVuZCkgPD0gMDtcbiAgICB9XG5cbiAgICAvLyBQYXJ0aWFsIHJhbmdlcyBhcmUgdmFsaWQgaWYgdGhlIHN0YXJ0L2VuZCBpcyB2YWxpZC5cbiAgICByZXR1cm4gKHN0YXJ0ID09IG51bGwgfHwgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShzdGFydCkpICYmXG4gICAgICAgICAgIChlbmQgPT0gbnVsbCB8fCB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKGVuZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBjb21wbGV0ZS4gSW4gdGhlIGNhc2Ugb2YgYSBkYXRlIHJhbmdlIHNlbGVjdGlvbiwgdGhpc1xuICAgKiBpcyB0cnVlIGlmIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBoYXMgYSBub24tbnVsbCBgc3RhcnRgIGFuZCBgZW5kYC5cbiAgICovXG4gIGlzQ29tcGxldGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLnN0YXJ0ICE9IG51bGwgJiYgdGhpcy5zZWxlY3Rpb24uZW5kICE9IG51bGw7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlkoXG4gICAgcGFyZW50OiBNYXRTaW5nbGVEYXRlU2VsZWN0aW9uTW9kZWw8dW5rbm93bj4sIGFkYXB0ZXI6IERhdGVBZGFwdGVyPHVua25vd24+KSB7XG4gIHJldHVybiBwYXJlbnQgfHwgbmV3IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqIFVzZWQgdG8gcHJvdmlkZSBhIHNpbmdsZSBzZWxlY3Rpb24gbW9kZWwgdG8gYSBjb21wb25lbnQuICovXG5leHBvcnQgY29uc3QgTUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9QUk9WSURFUjogRmFjdG9yeVByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBNYXREYXRlU2VsZWN0aW9uTW9kZWwsXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXREYXRlU2VsZWN0aW9uTW9kZWxdLCBEYXRlQWRhcHRlcl0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSxcbn07XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWShcbiAgICBwYXJlbnQ6IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDx1bmtub3duPiwgYWRhcHRlcjogRGF0ZUFkYXB0ZXI8dW5rbm93bj4pIHtcbiAgcmV0dXJuIHBhcmVudCB8fCBuZXcgTWF0UmFuZ2VEYXRlU2VsZWN0aW9uTW9kZWwoYWRhcHRlcik7XG59XG5cbi8qKiBVc2VkIHRvIHByb3ZpZGUgYSByYW5nZSBzZWxlY3Rpb24gbW9kZWwgdG8gYSBjb21wb25lbnQuICovXG5leHBvcnQgY29uc3QgTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlksXG59O1xuIl19