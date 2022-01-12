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
}
DefaultMatCalendarRangeStrategy.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0-next.2", ngImport: i0, type: DefaultMatCalendarRangeStrategy, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
DefaultMatCalendarRangeStrategy.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.0-next.2", ngImport: i0, type: DefaultMatCalendarRangeStrategy });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0-next.2", ngImport: i0, type: DefaultMatCalendarRangeStrategy, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFrQixNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7QUFFakQsMkVBQTJFO0FBQzNFLE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHLElBQUksY0FBYyxDQUVqRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBMEJ2QywwREFBMEQ7QUFFMUQsTUFBTSxPQUFPLCtCQUErQjtJQUMxQyxZQUFvQixZQUE0QjtRQUE1QixpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7SUFBRyxDQUFDO0lBRXBELGlCQUFpQixDQUFDLElBQU8sRUFBRSxZQUEwQjtRQUNuRCxJQUFJLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxHQUFHLFlBQVksQ0FBQztRQUVoQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDakIsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNkO2FBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pGLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDWjthQUFNO1lBQ0wsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDWjtRQUVELE9BQU8sSUFBSSxTQUFTLENBQUksS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxhQUFhLENBQUMsVUFBb0IsRUFBRSxZQUEwQjtRQUM1RCxJQUFJLEtBQUssR0FBYSxJQUFJLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQWEsSUFBSSxDQUFDO1FBRXpCLElBQUksWUFBWSxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksVUFBVSxFQUFFO1lBQ3pELEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQzNCLEdBQUcsR0FBRyxVQUFVLENBQUM7U0FDbEI7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFJLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDOzttSUE1QlUsK0JBQStCO3VJQUEvQiwrQkFBK0I7a0dBQS9CLCtCQUErQjtrQkFEM0MsVUFBVTs7QUFnQ1gsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSw0Q0FBNEMsQ0FDMUQsTUFBOEMsRUFDOUMsT0FBNkI7SUFFN0IsT0FBTyxNQUFNLElBQUksSUFBSSwrQkFBK0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLG9DQUFvQyxHQUFvQjtJQUNuRSxPQUFPLEVBQUUsaUNBQWlDO0lBQzFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGlDQUFpQyxDQUFDLEVBQUUsV0FBVyxDQUFDO0lBQ3hGLFVBQVUsRUFBRSw0Q0FBNEM7Q0FDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCwgU2tpcFNlbGYsIEZhY3RvcnlQcm92aWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7RGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIGN1c3RvbWl6ZSB0aGUgZGF0ZSByYW5nZSBzZWxlY3Rpb24gYmVoYXZpb3IuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPFxuICBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxhbnk+XG4+KCdNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1knKTtcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSBwcm92aWRlZCBpbiBvcmRlciB0byBjdXN0b21pemUgdGhlIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uIGJlaGF2aW9yLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxEPiB7XG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgZmluaXNoZWQgc2VsZWN0aW5nIGEgdmFsdWUuXG4gICAqIEBwYXJhbSBkYXRlIERhdGUgdGhhdCB3YXMgc2VsZWN0ZWQuIFdpbGwgYmUgbnVsbCBpZiB0aGUgdXNlciBjbGVhcmVkIHRoZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSBjdXJyZW50UmFuZ2UgUmFuZ2UgdGhhdCBpcyBjdXJyZW50bHkgc2hvdyBpbiB0aGUgY2FsZW5kYXIuXG4gICAqIEBwYXJhbSBldmVudCBET00gZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHNlbGVjdGlvbi4gQ3VycmVudGx5IG9ubHkgY29ycmVzcG9uZHMgdG8gYSBgY2xpY2tgXG4gICAqICAgIGV2ZW50LCBidXQgaXQgbWF5IGdldCBleHBhbmRlZCBpbiB0aGUgZnV0dXJlLlxuICAgKi9cbiAgc2VsZWN0aW9uRmluaXNoZWQoZGF0ZTogRCB8IG51bGwsIGN1cnJlbnRSYW5nZTogRGF0ZVJhbmdlPEQ+LCBldmVudDogRXZlbnQpOiBEYXRlUmFuZ2U8RD47XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBhY3RpdmF0ZWQgYSBuZXcgZGF0ZSAoZS5nLiBieSBob3ZlcmluZyBvdmVyXG4gICAqIGl0IG9yIG1vdmluZyBmb2N1cykgYW5kIHRoZSBjYWxlbmRhciB0cmllcyB0byBkaXNwbGF5IGEgZGF0ZSByYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGFjdGl2ZURhdGUgRGF0ZSB0aGF0IHRoZSB1c2VyIGhhcyBhY3RpdmF0ZWQuIFdpbGwgYmUgbnVsbCBpZiB0aGUgdXNlciBtb3ZlZFxuICAgKiAgICBmb2N1cyB0byBhbiBlbGVtZW50IHRoYXQncyBubyBhIGNhbGVuZGFyIGNlbGwuXG4gICAqIEBwYXJhbSBjdXJyZW50UmFuZ2UgUmFuZ2UgdGhhdCBpcyBjdXJyZW50bHkgc2hvd24gaW4gdGhlIGNhbGVuZGFyLlxuICAgKiBAcGFyYW0gZXZlbnQgRE9NIGV2ZW50IHRoYXQgY2F1c2VkIHRoZSBwcmV2aWV3IHRvIGJlIGNoYW5nZWQuIFdpbGwgYmUgZWl0aGVyIGFcbiAgICogICAgYG1vdXNlZW50ZXJgL2Btb3VzZWxlYXZlYCBvciBgZm9jdXNgL2BibHVyYCBkZXBlbmRpbmcgb24gaG93IHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcuXG4gICAqL1xuICBjcmVhdGVQcmV2aWV3KGFjdGl2ZURhdGU6IEQgfCBudWxsLCBjdXJyZW50UmFuZ2U6IERhdGVSYW5nZTxEPiwgZXZlbnQ6IEV2ZW50KTogRGF0ZVJhbmdlPEQ+O1xufVxuXG4vKiogUHJvdmlkZXMgdGhlIGRlZmF1bHQgZGF0ZSByYW5nZSBzZWxlY3Rpb24gYmVoYXZpb3IuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdE1hdENhbGVuZGFyUmFuZ2VTdHJhdGVneTxEPiBpbXBsZW1lbnRzIE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PEQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7fVxuXG4gIHNlbGVjdGlvbkZpbmlzaGVkKGRhdGU6IEQsIGN1cnJlbnRSYW5nZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgbGV0IHtzdGFydCwgZW5kfSA9IGN1cnJlbnRSYW5nZTtcblxuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBzdGFydCA9IGRhdGU7XG4gICAgfSBlbHNlIGlmIChlbmQgPT0gbnVsbCAmJiBkYXRlICYmIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGRhdGUsIHN0YXJ0KSA+PSAwKSB7XG4gICAgICBlbmQgPSBkYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IGRhdGU7XG4gICAgICBlbmQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZVJhbmdlPEQ+KHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgY3JlYXRlUHJldmlldyhhY3RpdmVEYXRlOiBEIHwgbnVsbCwgY3VycmVudFJhbmdlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICBsZXQgc3RhcnQ6IEQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgZW5kOiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgICBpZiAoY3VycmVudFJhbmdlLnN0YXJ0ICYmICFjdXJyZW50UmFuZ2UuZW5kICYmIGFjdGl2ZURhdGUpIHtcbiAgICAgIHN0YXJ0ID0gY3VycmVudFJhbmdlLnN0YXJ0O1xuICAgICAgZW5kID0gYWN0aXZlRGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGVSYW5nZTxEPihzdGFydCwgZW5kKTtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBwYXJlbnQ6IE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PHVua25vd24+LFxuICBhZGFwdGVyOiBEYXRlQWRhcHRlcjx1bmtub3duPixcbikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBEZWZhdWx0TWF0Q2FsZW5kYXJSYW5nZVN0cmF0ZWd5KGFkYXB0ZXIpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUjogRmFjdG9yeVByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ldLCBEYXRlQWRhcHRlcl0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcbiJdfQ==