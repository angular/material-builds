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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0-next.1", ngImport: i0, type: DefaultMatCalendarRangeStrategy, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.0-next.1", ngImport: i0, type: DefaultMatCalendarRangeStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0-next.1", ngImport: i0, type: DefaultMatCalendarRangeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DateAdapter }] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFrQixNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7QUFFakQsMkVBQTJFO0FBQzNFLE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHLElBQUksY0FBYyxDQUVqRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBMkN2QywwREFBMEQ7QUFFMUQsTUFBTSxPQUFPLCtCQUErQjtJQUMxQyxZQUFvQixZQUE0QjtRQUE1QixpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7SUFBRyxDQUFDO0lBRXBELGlCQUFpQixDQUFDLElBQU8sRUFBRSxZQUEwQjtRQUNuRCxJQUFJLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxHQUFHLFlBQVksQ0FBQztRQUVoQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNsQixLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2YsQ0FBQzthQUFNLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xGLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDYixDQUFDO2FBQU0sQ0FBQztZQUNOLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDYixHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2IsQ0FB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UyxDQUFDLENBQUM7WUFDbkQsS0FBSyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckQsS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELEdBQUcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLEdBQUcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsT0FBTyxJQUFJLFNBQVMsQ0FBSSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsQ0FBQztxSEF0RVUsK0JBQStCO3lIQUEvQiwrQkFBK0I7O2tHQUEvQiwrQkFBK0I7a0JBRDNDLFVBQVU7O0FBMEVYLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsNENBQTRDLENBQzFELE1BQThDLEVBQzlDLE9BQTZCO0lBRTdCLE9BQU8sTUFBTSxJQUFJLElBQUksK0JBQStCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxvQ0FBb0MsR0FBb0I7SUFDbkUsT0FBTyxFQUFFLGlDQUFpQztJQUMxQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxpQ0FBaUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQztJQUN4RixVQUFVLEVBQUUsNENBQTRDO0NBQ3pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwsIFNraXBTZWxmLCBGYWN0b3J5UHJvdmlkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0RhdGVSYW5nZX0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdXNlZCB0byBjdXN0b21pemUgdGhlIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uIGJlaGF2aW9yLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxcbiAgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8YW55PlxuPignTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZJyk7XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgcHJvdmlkZWQgaW4gb3JkZXIgdG8gY3VzdG9taXplIHRoZSBkYXRlIHJhbmdlIHNlbGVjdGlvbiBiZWhhdmlvci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4ge1xuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGZpbmlzaGVkIHNlbGVjdGluZyBhIHZhbHVlLlxuICAgKiBAcGFyYW0gZGF0ZSBEYXRlIHRoYXQgd2FzIHNlbGVjdGVkLiBXaWxsIGJlIG51bGwgaWYgdGhlIHVzZXIgY2xlYXJlZCB0aGUgc2VsZWN0aW9uLlxuICAgKiBAcGFyYW0gY3VycmVudFJhbmdlIFJhbmdlIHRoYXQgaXMgY3VycmVudGx5IHNob3cgaW4gdGhlIGNhbGVuZGFyLlxuICAgKiBAcGFyYW0gZXZlbnQgRE9NIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBzZWxlY3Rpb24uIEN1cnJlbnRseSBvbmx5IGNvcnJlc3BvbmRzIHRvIGEgYGNsaWNrYFxuICAgKiAgICBldmVudCwgYnV0IGl0IG1heSBnZXQgZXhwYW5kZWQgaW4gdGhlIGZ1dHVyZS5cbiAgICovXG4gIHNlbGVjdGlvbkZpbmlzaGVkKGRhdGU6IEQgfCBudWxsLCBjdXJyZW50UmFuZ2U6IERhdGVSYW5nZTxEPiwgZXZlbnQ6IEV2ZW50KTogRGF0ZVJhbmdlPEQ+O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgYWN0aXZhdGVkIGEgbmV3IGRhdGUgKGUuZy4gYnkgaG92ZXJpbmcgb3ZlclxuICAgKiBpdCBvciBtb3ZpbmcgZm9jdXMpIGFuZCB0aGUgY2FsZW5kYXIgdHJpZXMgdG8gZGlzcGxheSBhIGRhdGUgcmFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBhY3RpdmVEYXRlIERhdGUgdGhhdCB0aGUgdXNlciBoYXMgYWN0aXZhdGVkLiBXaWxsIGJlIG51bGwgaWYgdGhlIHVzZXIgbW92ZWRcbiAgICogICAgZm9jdXMgdG8gYW4gZWxlbWVudCB0aGF0J3Mgbm8gYSBjYWxlbmRhciBjZWxsLlxuICAgKiBAcGFyYW0gY3VycmVudFJhbmdlIFJhbmdlIHRoYXQgaXMgY3VycmVudGx5IHNob3duIGluIHRoZSBjYWxlbmRhci5cbiAgICogQHBhcmFtIGV2ZW50IERPTSBldmVudCB0aGF0IGNhdXNlZCB0aGUgcHJldmlldyB0byBiZSBjaGFuZ2VkLiBXaWxsIGJlIGVpdGhlciBhXG4gICAqICAgIGBtb3VzZWVudGVyYC9gbW91c2VsZWF2ZWAgb3IgYGZvY3VzYC9gYmx1cmAgZGVwZW5kaW5nIG9uIGhvdyB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nLlxuICAgKi9cbiAgY3JlYXRlUHJldmlldyhhY3RpdmVEYXRlOiBEIHwgbnVsbCwgY3VycmVudFJhbmdlOiBEYXRlUmFuZ2U8RD4sIGV2ZW50OiBFdmVudCk6IERhdGVSYW5nZTxEPjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGRyYWdnZWQgYSBkYXRlIGluIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmFuZ2UgdG8gYW5vdGhlclxuICAgKiBkYXRlLiBSZXR1cm5zIHRoZSBkYXRlIHVwZGF0ZWQgcmFuZ2UgdGhhdCBzaG91bGQgcmVzdWx0IGZyb20gdGhpcyBpbnRlcmFjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGRhdGVPcmlnaW4gVGhlIGRhdGUgdGhlIHVzZXIgc3RhcnRlZCBkcmFnZ2luZyBmcm9tLlxuICAgKiBAcGFyYW0gb3JpZ2luYWxSYW5nZSBUaGUgb3JpZ2luYWxseSBzZWxlY3RlZCBkYXRlIHJhbmdlLlxuICAgKiBAcGFyYW0gbmV3RGF0ZSBUaGUgY3VycmVudGx5IHRhcmdldGVkIGRhdGUgaW4gdGhlIGRyYWcgb3BlcmF0aW9uLlxuICAgKiBAcGFyYW0gZXZlbnQgRE9NIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSB1cGRhdGVkIGRyYWcgc3RhdGUuIFdpbGwgYmVcbiAgICogICAgIGBtb3VzZWVudGVyYC9gbW91c2V1cGAgb3IgYHRvdWNobW92ZWAvYHRvdWNoZW5kYCBkZXBlbmRpbmcgb24gdGhlIGRldmljZSB0eXBlLlxuICAgKi9cbiAgY3JlYXRlRHJhZz8oXG4gICAgZHJhZ09yaWdpbjogRCxcbiAgICBvcmlnaW5hbFJhbmdlOiBEYXRlUmFuZ2U8RD4sXG4gICAgbmV3RGF0ZTogRCxcbiAgICBldmVudDogRXZlbnQsXG4gICk6IERhdGVSYW5nZTxEPiB8IG51bGw7XG59XG5cbi8qKiBQcm92aWRlcyB0aGUgZGVmYXVsdCBkYXRlIHJhbmdlIHNlbGVjdGlvbiBiZWhhdmlvci4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0TWF0Q2FsZW5kYXJSYW5nZVN0cmF0ZWd5PEQ+IGltcGxlbWVudHMgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHt9XG5cbiAgc2VsZWN0aW9uRmluaXNoZWQoZGF0ZTogRCwgY3VycmVudFJhbmdlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICBsZXQge3N0YXJ0LCBlbmR9ID0gY3VycmVudFJhbmdlO1xuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKGVuZCA9PSBudWxsICYmIGRhdGUgJiYgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoZGF0ZSwgc3RhcnQpID49IDApIHtcbiAgICAgIGVuZCA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICAgIGVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCk7XG4gIH1cblxuICBjcmVhdGVQcmV2aWV3KGFjdGl2ZURhdGU6IEQgfCBudWxsLCBjdXJyZW50UmFuZ2U6IERhdGVSYW5nZTxEPikge1xuICAgIGxldCBzdGFydDogRCB8IG51bGwgPSBudWxsO1xuICAgIGxldCBlbmQ6IEQgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChjdXJyZW50UmFuZ2Uuc3RhcnQgJiYgIWN1cnJlbnRSYW5nZS5lbmQgJiYgYWN0aXZlRGF0ZSkge1xuICAgICAgc3RhcnQgPSBjdXJyZW50UmFuZ2Uuc3RhcnQ7XG4gICAgICBlbmQgPSBhY3RpdmVEYXRlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZVJhbmdlPEQ+KHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgY3JlYXRlRHJhZyhkcmFnT3JpZ2luOiBELCBvcmlnaW5hbFJhbmdlOiBEYXRlUmFuZ2U8RD4sIG5ld0RhdGU6IEQpIHtcbiAgICBsZXQgc3RhcnQgPSBvcmlnaW5hbFJhbmdlLnN0YXJ0O1xuICAgIGxldCBlbmQgPSBvcmlnaW5hbFJhbmdlLmVuZDtcblxuICAgIGlmICghc3RhcnQgfHwgIWVuZCkge1xuICAgICAgLy8gQ2FuJ3QgZHJhZyBmcm9tIGFuIGluY29tcGxldGUgcmFuZ2UuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhZGFwdGVyID0gdGhpcy5fZGF0ZUFkYXB0ZXI7XG5cbiAgICBjb25zdCBpc1JhbmdlID0gYWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSAhPT0gMDtcbiAgICBjb25zdCBkaWZmWWVhcnMgPSBhZGFwdGVyLmdldFllYXIobmV3RGF0ZSkgLSBhZGFwdGVyLmdldFllYXIoZHJhZ09yaWdpbik7XG4gICAgY29uc3QgZGlmZk1vbnRocyA9IGFkYXB0ZXIuZ2V0TW9udGgobmV3RGF0ZSkgLSBhZGFwdGVyLmdldE1vbnRoKGRyYWdPcmlnaW4pO1xuICAgIGNvbnN0IGRpZmZEYXlzID0gYWRhcHRlci5nZXREYXRlKG5ld0RhdGUpIC0gYWRhcHRlci5nZXREYXRlKGRyYWdPcmlnaW4pO1xuXG4gICAgaWYgKGlzUmFuZ2UgJiYgYWRhcHRlci5zYW1lRGF0ZShkcmFnT3JpZ2luLCBvcmlnaW5hbFJhbmdlLnN0YXJ0KSkge1xuICAgICAgc3RhcnQgPSBuZXdEYXRlO1xuICAgICAgaWYgKGFkYXB0ZXIuY29tcGFyZURhdGUobmV3RGF0ZSwgZW5kKSA+IDApIHtcbiAgICAgICAgZW5kID0gYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKGVuZCwgZGlmZlllYXJzKTtcbiAgICAgICAgZW5kID0gYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyhlbmQsIGRpZmZNb250aHMpO1xuICAgICAgICBlbmQgPSBhZGFwdGVyLmFkZENhbGVuZGFyRGF5cyhlbmQsIGRpZmZEYXlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzUmFuZ2UgJiYgYWRhcHRlci5zYW1lRGF0ZShkcmFnT3JpZ2luLCBvcmlnaW5hbFJhbmdlLmVuZCkpIHtcbiAgICAgIGVuZCA9IG5ld0RhdGU7XG4gICAgICBpZiAoYWRhcHRlci5jb21wYXJlRGF0ZShuZXdEYXRlLCBzdGFydCkgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHN0YXJ0LCBkaWZmWWVhcnMpO1xuICAgICAgICBzdGFydCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoc3RhcnQsIGRpZmZNb250aHMpO1xuICAgICAgICBzdGFydCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHN0YXJ0LCBkaWZmRGF5cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHN0YXJ0LCBkaWZmWWVhcnMpO1xuICAgICAgc3RhcnQgPSBhZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHN0YXJ0LCBkaWZmTW9udGhzKTtcbiAgICAgIHN0YXJ0ID0gYWRhcHRlci5hZGRDYWxlbmRhckRheXMoc3RhcnQsIGRpZmZEYXlzKTtcbiAgICAgIGVuZCA9IGFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyhlbmQsIGRpZmZZZWFycyk7XG4gICAgICBlbmQgPSBhZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKGVuZCwgZGlmZk1vbnRocyk7XG4gICAgICBlbmQgPSBhZGFwdGVyLmFkZENhbGVuZGFyRGF5cyhlbmQsIGRpZmZEYXlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGVSYW5nZTxEPihzdGFydCwgZW5kKTtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBwYXJlbnQ6IE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PHVua25vd24+LFxuICBhZGFwdGVyOiBEYXRlQWRhcHRlcjx1bmtub3duPixcbikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBEZWZhdWx0TWF0Q2FsZW5kYXJSYW5nZVN0cmF0ZWd5KGFkYXB0ZXIpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUjogRmFjdG9yeVByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ldLCBEYXRlQWRhcHRlcl0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcbiJdfQ==