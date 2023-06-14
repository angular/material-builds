/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from './date-selection-model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/core";
/** Injection token used to customize the date range selection behavior. */
export const MAT_DATE_RANGE_SELECTION_STRATEGY = new InjectionToken('MAT_DATE_RANGE_SELECTION_STRATEGY');
/** Provides the default date range selection behavior. */
export class DefaultMatCalendarRangeStrategy {
    constructor(_dateAdapter) {
        this._dateAdapter = _dateAdapter;
    }
    selectionFinished(date, currentRange) {
        let { start, end } = currentRange;
        if (start == null) {
            start = date;
        }
        else if (end == null && date && this._dateAdapter.compareDate(date, start) >= 0) {
            end = date;
        }
        else {
            start = date;
            end = null;
        }
        return new DateRange(start, end);
    }
    createPreview(activeDate, currentRange) {
        let start = null;
        let end = null;
        if (currentRange.start && !currentRange.end && activeDate) {
            start = currentRange.start;
            end = activeDate;
        }
        return new DateRange(start, end);
    }
    createDrag(dragOrigin, originalRange, newDate) {
        let start = originalRange.start;
        let end = originalRange.end;
        if (!start || !end) {
            // Can't drag from an incomplete range.
            return null;
        }
        const adapter = this._dateAdapter;
        const isRange = adapter.compareDate(start, end) !== 0;
        const diffYears = adapter.getYear(newDate) - adapter.getYear(dragOrigin);
        const diffMonths = adapter.getMonth(newDate) - adapter.getMonth(dragOrigin);
        const diffDays = adapter.getDate(newDate) - adapter.getDate(dragOrigin);
        if (isRange && adapter.sameDate(dragOrigin, originalRange.start)) {
            start = newDate;
            if (adapter.compareDate(newDate, end) > 0) {
                end = adapter.addCalendarYears(end, diffYears);
                end = adapter.addCalendarMonths(end, diffMonths);
                end = adapter.addCalendarDays(end, diffDays);
            }
        }
        else if (isRange && adapter.sameDate(dragOrigin, originalRange.end)) {
            end = newDate;
            if (adapter.compareDate(newDate, start) < 0) {
                start = adapter.addCalendarYears(start, diffYears);
                start = adapter.addCalendarMonths(start, diffMonths);
                start = adapter.addCalendarDays(start, diffDays);
            }
        }
        else {
            start = adapter.addCalendarYears(start, diffYears);
            start = adapter.addCalendarMonths(start, diffMonths);
            start = adapter.addCalendarDays(start, diffDays);
            end = adapter.addCalendarYears(end, diffYears);
            end = adapter.addCalendarMonths(end, diffMonths);
            end = adapter.addCalendarDays(end, diffDays);
        }
        return new DateRange(start, end);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: DefaultMatCalendarRangeStrategy, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: DefaultMatCalendarRangeStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: DefaultMatCalendarRangeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DateAdapter }]; } });
/** @docs-private */
export function MAT_CALENDAR_RANGE_STRATEGY_PROVIDER_FACTORY(parent, adapter) {
    return parent || new DefaultMatCalendarRangeStrategy(adapter);
}
/** @docs-private */
export const MAT_CALENDAR_RANGE_STRATEGY_PROVIDER = {
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    deps: [[new Optional(), new SkipSelf(), MAT_DATE_RANGE_SELECTION_STRATEGY], DateAdapter],
    useFactory: MAT_CALENDAR_RANGE_STRATEGY_PROVIDER_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFrQixNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7QUFFakQsMkVBQTJFO0FBQzNFLE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHLElBQUksY0FBYyxDQUVqRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBMkN2QywwREFBMEQ7QUFFMUQsTUFBTSxPQUFPLCtCQUErQjtJQUMxQyxZQUFvQixZQUE0QjtRQUE1QixpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7SUFBRyxDQUFDO0lBRXBELGlCQUFpQixDQUFDLElBQU8sRUFBRSxZQUEwQjtRQUNuRCxJQUFJLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxHQUFHLFlBQVksQ0FBQztRQUVoQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDakIsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNkO2FBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pGLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDWjthQUFNO1lBQ0wsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDWjtRQUVELE9BQU8sSUFBSSxTQUFTLENBQUksS0FB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LENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqRCxHQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMvQyxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNqRCxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFJLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDOzhHQXRFVSwrQkFBK0I7a0hBQS9CLCtCQUErQjs7MkZBQS9CLCtCQUErQjtrQkFEM0MsVUFBVTs7QUEwRVgsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSw0Q0FBNEMsQ0FDMUQsTUFBOEMsRUFDOUMsT0FBNkI7SUFFN0IsT0FBTyxNQUFNLElBQUksSUFBSSwrQkFBK0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLG9DQUFvQyxHQUFvQjtJQUNuRSxPQUFPLEVBQUUsaUNBQWlDO0lBQzFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGlDQUFpQyxDQUFDLEVBQUUsV0FBVyxDQUFDO0lBQ3hGLFVBQVUsRUFBRSw0Q0FBNEM7Q0FDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCwgU2tpcFNlbGYsIEZhY3RvcnlQcm92aWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7RGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIGN1c3RvbWl6ZSB0aGUgZGF0ZSByYW5nZSBzZWxlY3Rpb24gYmVoYXZpb3IuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPFxuICBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxhbnk+XG4+KCdNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1knKTtcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSBwcm92aWRlZCBpbiBvcmRlciB0byBjdXN0b21pemUgdGhlIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uIGJlaGF2aW9yLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxEPiB7XG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgZmluaXNoZWQgc2VsZWN0aW5nIGEgdmFsdWUuXG4gICAqIEBwYXJhbSBkYXRlIERhdGUgdGhhdCB3YXMgc2VsZWN0ZWQuIFdpbGwgYmUgbnVsbCBpZiB0aGUgdXNlciBjbGVhcmVkIHRoZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSBjdXJyZW50UmFuZ2UgUmFuZ2UgdGhhdCBpcyBjdXJyZW50bHkgc2hvdyBpbiB0aGUgY2FsZW5kYXIuXG4gICAqIEBwYXJhbSBldmVudCBET00gZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHNlbGVjdGlvbi4gQ3VycmVudGx5IG9ubHkgY29ycmVzcG9uZHMgdG8gYSBgY2xpY2tgXG4gICAqICAgIGV2ZW50LCBidXQgaXQgbWF5IGdldCBleHBhbmRlZCBpbiB0aGUgZnV0dXJlLlxuICAgKi9cbiAgc2VsZWN0aW9uRmluaXNoZWQoZGF0ZTogRCB8IG51bGwsIGN1cnJlbnRSYW5nZTogRGF0ZVJhbmdlPEQ+LCBldmVudDogRXZlbnQpOiBEYXRlUmFuZ2U8RD47XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBhY3RpdmF0ZWQgYSBuZXcgZGF0ZSAoZS5nLiBieSBob3ZlcmluZyBvdmVyXG4gICAqIGl0IG9yIG1vdmluZyBmb2N1cykgYW5kIHRoZSBjYWxlbmRhciB0cmllcyB0byBkaXNwbGF5IGEgZGF0ZSByYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGFjdGl2ZURhdGUgRGF0ZSB0aGF0IHRoZSB1c2VyIGhhcyBhY3RpdmF0ZWQuIFdpbGwgYmUgbnVsbCBpZiB0aGUgdXNlciBtb3ZlZFxuICAgKiAgICBmb2N1cyB0byBhbiBlbGVtZW50IHRoYXQncyBubyBhIGNhbGVuZGFyIGNlbGwuXG4gICAqIEBwYXJhbSBjdXJyZW50UmFuZ2UgUmFuZ2UgdGhhdCBpcyBjdXJyZW50bHkgc2hvd24gaW4gdGhlIGNhbGVuZGFyLlxuICAgKiBAcGFyYW0gZXZlbnQgRE9NIGV2ZW50IHRoYXQgY2F1c2VkIHRoZSBwcmV2aWV3IHRvIGJlIGNoYW5nZWQuIFdpbGwgYmUgZWl0aGVyIGFcbiAgICogICAgYG1vdXNlZW50ZXJgL2Btb3VzZWxlYXZlYCBvciBgZm9jdXNgL2BibHVyYCBkZXBlbmRpbmcgb24gaG93IHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcuXG4gICAqL1xuICBjcmVhdGVQcmV2aWV3KGFjdGl2ZURhdGU6IEQgfCBudWxsLCBjdXJyZW50UmFuZ2U6IERhdGVSYW5nZTxEPiwgZXZlbnQ6IEV2ZW50KTogRGF0ZVJhbmdlPEQ+O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgZHJhZ2dlZCBhIGRhdGUgaW4gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByYW5nZSB0byBhbm90aGVyXG4gICAqIGRhdGUuIFJldHVybnMgdGhlIGRhdGUgdXBkYXRlZCByYW5nZSB0aGF0IHNob3VsZCByZXN1bHQgZnJvbSB0aGlzIGludGVyYWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0ZU9yaWdpbiBUaGUgZGF0ZSB0aGUgdXNlciBzdGFydGVkIGRyYWdnaW5nIGZyb20uXG4gICAqIEBwYXJhbSBvcmlnaW5hbFJhbmdlIFRoZSBvcmlnaW5hbGx5IHNlbGVjdGVkIGRhdGUgcmFuZ2UuXG4gICAqIEBwYXJhbSBuZXdEYXRlIFRoZSBjdXJyZW50bHkgdGFyZ2V0ZWQgZGF0ZSBpbiB0aGUgZHJhZyBvcGVyYXRpb24uXG4gICAqIEBwYXJhbSBldmVudCBET00gZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHVwZGF0ZWQgZHJhZyBzdGF0ZS4gV2lsbCBiZVxuICAgKiAgICAgYG1vdXNlZW50ZXJgL2Btb3VzZXVwYCBvciBgdG91Y2htb3ZlYC9gdG91Y2hlbmRgIGRlcGVuZGluZyBvbiB0aGUgZGV2aWNlIHR5cGUuXG4gICAqL1xuICBjcmVhdGVEcmFnPyhcbiAgICBkcmFnT3JpZ2luOiBELFxuICAgIG9yaWdpbmFsUmFuZ2U6IERhdGVSYW5nZTxEPixcbiAgICBuZXdEYXRlOiBELFxuICAgIGV2ZW50OiBFdmVudCxcbiAgKTogRGF0ZVJhbmdlPEQ+IHwgbnVsbDtcbn1cblxuLyoqIFByb3ZpZGVzIHRoZSBkZWZhdWx0IGRhdGUgcmFuZ2Ugc2VsZWN0aW9uIGJlaGF2aW9yLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRNYXRDYWxlbmRhclJhbmdlU3RyYXRlZ3k8RD4gaW1wbGVtZW50cyBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxEPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPikge31cblxuICBzZWxlY3Rpb25GaW5pc2hlZChkYXRlOiBELCBjdXJyZW50UmFuZ2U6IERhdGVSYW5nZTxEPikge1xuICAgIGxldCB7c3RhcnQsIGVuZH0gPSBjdXJyZW50UmFuZ2U7XG5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAoZW5kID09IG51bGwgJiYgZGF0ZSAmJiB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShkYXRlLCBzdGFydCkgPj0gMCkge1xuICAgICAgZW5kID0gZGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgICAgZW5kID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGVSYW5nZTxEPihzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGNyZWF0ZVByZXZpZXcoYWN0aXZlRGF0ZTogRCB8IG51bGwsIGN1cnJlbnRSYW5nZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgbGV0IHN0YXJ0OiBEIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGVuZDogRCB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKGN1cnJlbnRSYW5nZS5zdGFydCAmJiAhY3VycmVudFJhbmdlLmVuZCAmJiBhY3RpdmVEYXRlKSB7XG4gICAgICBzdGFydCA9IGN1cnJlbnRSYW5nZS5zdGFydDtcbiAgICAgIGVuZCA9IGFjdGl2ZURhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCk7XG4gIH1cblxuICBjcmVhdGVEcmFnKGRyYWdPcmlnaW46IEQsIG9yaWdpbmFsUmFuZ2U6IERhdGVSYW5nZTxEPiwgbmV3RGF0ZTogRCkge1xuICAgIGxldCBzdGFydCA9IG9yaWdpbmFsUmFuZ2Uuc3RhcnQ7XG4gICAgbGV0IGVuZCA9IG9yaWdpbmFsUmFuZ2UuZW5kO1xuXG4gICAgaWYgKCFzdGFydCB8fCAhZW5kKSB7XG4gICAgICAvLyBDYW4ndCBkcmFnIGZyb20gYW4gaW5jb21wbGV0ZSByYW5nZS5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLl9kYXRlQWRhcHRlcjtcblxuICAgIGNvbnN0IGlzUmFuZ2UgPSBhZGFwdGVyLmNvbXBhcmVEYXRlKHN0YXJ0LCBlbmQpICE9PSAwO1xuICAgIGNvbnN0IGRpZmZZZWFycyA9IGFkYXB0ZXIuZ2V0WWVhcihuZXdEYXRlKSAtIGFkYXB0ZXIuZ2V0WWVhcihkcmFnT3JpZ2luKTtcbiAgICBjb25zdCBkaWZmTW9udGhzID0gYWRhcHRlci5nZXRNb250aChuZXdEYXRlKSAtIGFkYXB0ZXIuZ2V0TW9udGgoZHJhZ09yaWdpbik7XG4gICAgY29uc3QgZGlmZkRheXMgPSBhZGFwdGVyLmdldERhdGUobmV3RGF0ZSkgLSBhZGFwdGVyLmdldERhdGUoZHJhZ09yaWdpbik7XG5cbiAgICBpZiAoaXNSYW5nZSAmJiBhZGFwdGVyLnNhbWVEYXRlKGRyYWdPcmlnaW4sIG9yaWdpbmFsUmFuZ2Uuc3RhcnQpKSB7XG4gICAgICBzdGFydCA9IG5ld0RhdGU7XG4gICAgICBpZiAoYWRhcHRlci5jb21wYXJlRGF0ZShuZXdEYXRlLCBlbmQpID4gMCkge1xuICAgICAgICBlbmQgPSBhZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoZW5kLCBkaWZmWWVhcnMpO1xuICAgICAgICBlbmQgPSBhZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKGVuZCwgZGlmZk1vbnRocyk7XG4gICAgICAgIGVuZCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKGVuZCwgZGlmZkRheXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNSYW5nZSAmJiBhZGFwdGVyLnNhbWVEYXRlKGRyYWdPcmlnaW4sIG9yaWdpbmFsUmFuZ2UuZW5kKSkge1xuICAgICAgZW5kID0gbmV3RGF0ZTtcbiAgICAgIGlmIChhZGFwdGVyLmNvbXBhcmVEYXRlKG5ld0RhdGUsIHN0YXJ0KSA8IDApIHtcbiAgICAgICAgc3RhcnQgPSBhZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoc3RhcnQsIGRpZmZZZWFycyk7XG4gICAgICAgIHN0YXJ0ID0gYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyhzdGFydCwgZGlmZk1vbnRocyk7XG4gICAgICAgIHN0YXJ0ID0gYWRhcHRlci5hZGRDYWxlbmRhckRheXMoc3RhcnQsIGRpZmZEYXlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSBhZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoc3RhcnQsIGRpZmZZZWFycyk7XG4gICAgICBzdGFydCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoc3RhcnQsIGRpZmZNb250aHMpO1xuICAgICAgc3RhcnQgPSBhZGFwdGVyLmFkZENhbGVuZGFyRGF5cyhzdGFydCwgZGlmZkRheXMpO1xuICAgICAgZW5kID0gYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKGVuZCwgZGlmZlllYXJzKTtcbiAgICAgIGVuZCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoZW5kLCBkaWZmTW9udGhzKTtcbiAgICAgIGVuZCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKGVuZCwgZGlmZkRheXMpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZVJhbmdlPEQ+KHN0YXJ0LCBlbmQpO1xuICB9XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0NBTEVOREFSX1JBTkdFX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkoXG4gIHBhcmVudDogTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8dW5rbm93bj4sXG4gIGFkYXB0ZXI6IERhdGVBZGFwdGVyPHVua25vd24+LFxuKSB7XG4gIHJldHVybiBwYXJlbnQgfHwgbmV3IERlZmF1bHRNYXRDYWxlbmRhclJhbmdlU3RyYXRlZ3koYWRhcHRlcik7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0NBTEVOREFSX1JBTkdFX1NUUkFURUdZX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWV0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX0NBTEVOREFSX1JBTkdFX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuIl19