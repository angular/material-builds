/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Datepicker data that requires internationalization. */
class MatDatepickerIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the calendar popup (used by screen readers). */
        this.calendarLabel = 'Calendar';
        /** A label for the button used to open the calendar popup (used by screen readers). */
        this.openCalendarLabel = 'Open calendar';
        /** Label for the button used to close the calendar popup. */
        this.closeCalendarLabel = 'Close calendar';
        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';
        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';
        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';
        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';
        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 24 years';
        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 24 years';
        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Choose date';
        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';
        /**
         * A label for the first date of a range of dates (used by screen readers).
         * @deprecated Provide your own internationalization string.
         * @breaking-change 17.0.0
         */
        this.startDateLabel = 'Start date';
        /**
         * A label for the last date of a range of dates (used by screen readers).
         * @deprecated Provide your own internationalization string.
         * @breaking-change 17.0.0
         */
        this.endDateLabel = 'End date';
    }
    /** Formats a range of years (used for visuals). */
    formatYearRange(start, end) {
        return `${start} \u2013 ${end}`;
    }
    /** Formats a label for a range of years (used by screen readers). */
    formatYearRangeLabel(start, end) {
        return `${start} to ${end}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatDatepickerIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatDatepickerIntl, providedIn: 'root' }); }
}
export { MatDatepickerIntl };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatDatepickerIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFFN0IsMERBQTBEO0FBQzFELE1BQ2EsaUJBQWlCO0lBRDlCO1FBRUU7OztXQUdHO1FBQ00sWUFBTyxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXRELCtEQUErRDtRQUMvRCxrQkFBYSxHQUFHLFVBQVUsQ0FBQztRQUUzQix1RkFBdUY7UUFDdkYsc0JBQWlCLEdBQUcsZUFBZSxDQUFDO1FBRXBDLDZEQUE2RDtRQUM3RCx1QkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUV0QyxzRUFBc0U7UUFDdEUsbUJBQWMsR0FBRyxnQkFBZ0IsQ0FBQztRQUVsQyxrRUFBa0U7UUFDbEUsbUJBQWMsR0FBRyxZQUFZLENBQUM7UUFFOUIscUVBQXFFO1FBQ3JFLGtCQUFhLEdBQUcsZUFBZSxDQUFDO1FBRWhDLGlFQUFpRTtRQUNqRSxrQkFBYSxHQUFHLFdBQVcsQ0FBQztRQUU1QiwyRUFBMkU7UUFDM0UsdUJBQWtCLEdBQUcsbUJBQW1CLENBQUM7UUFFekMsdUVBQXVFO1FBQ3ZFLHVCQUFrQixHQUFHLGVBQWUsQ0FBQztRQUVyQyw4RUFBOEU7UUFDOUUsMkJBQXNCLEdBQUcsYUFBYSxDQUFDO1FBRXZDLDZFQUE2RTtRQUM3RSwrQkFBMEIsR0FBRyx1QkFBdUIsQ0FBQztRQUVyRDs7OztXQUlHO1FBQ0gsbUJBQWMsR0FBRyxZQUFZLENBQUM7UUFFOUI7Ozs7V0FJRztRQUNILGlCQUFZLEdBQUcsVUFBVSxDQUFDO0tBVzNCO0lBVEMsbURBQW1EO0lBQ25ELGVBQWUsQ0FBQyxLQUFhLEVBQUUsR0FBVztRQUN4QyxPQUFPLEdBQUcsS0FBSyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxxRUFBcUU7SUFDckUsb0JBQW9CLENBQUMsS0FBYSxFQUFFLEdBQVc7UUFDN0MsT0FBTyxHQUFHLEtBQUssT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDOzhHQTlEVSxpQkFBaUI7a0hBQWpCLGlCQUFpQixjQURMLE1BQU07O1NBQ2xCLGlCQUFpQjsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIERhdGVwaWNrZXIgZGF0YSB0aGF0IHJlcXVpcmVzIGludGVybmF0aW9uYWxpemF0aW9uLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlckludGwge1xuICAvKipcbiAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGxhYmVscyBoZXJlIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnlcbiAgICogY29tcG9uZW50cyBpZiB0aGUgbGFiZWxzIGhhdmUgY2hhbmdlZCBhZnRlciBpbml0aWFsaXphdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgY2FsZW5kYXIgcG9wdXAgKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBjYWxlbmRhckxhYmVsID0gJ0NhbGVuZGFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB1c2VkIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHBvcHVwICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgb3BlbkNhbGVuZGFyTGFiZWwgPSAnT3BlbiBjYWxlbmRhcic7XG5cbiAgLyoqIExhYmVsIGZvciB0aGUgYnV0dG9uIHVzZWQgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIHBvcHVwLiAqL1xuICBjbG9zZUNhbGVuZGFyTGFiZWwgPSAnQ2xvc2UgY2FsZW5kYXInO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcHJldmlvdXMgbW9udGggYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgcHJldk1vbnRoTGFiZWwgPSAnUHJldmlvdXMgbW9udGgnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgbmV4dCBtb250aCBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBuZXh0TW9udGhMYWJlbCA9ICdOZXh0IG1vbnRoJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIHByZXZpb3VzIHllYXIgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgcHJldlllYXJMYWJlbCA9ICdQcmV2aW91cyB5ZWFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIG5leHQgeWVhciBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBuZXh0WWVhckxhYmVsID0gJ05leHQgeWVhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwcmV2aW91cyBtdWx0aS15ZWFyIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZNdWx0aVllYXJMYWJlbCA9ICdQcmV2aW91cyAyNCB5ZWFycyc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBuZXh0IG11bHRpLXllYXIgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgbmV4dE11bHRpWWVhckxhYmVsID0gJ05leHQgMjQgeWVhcnMnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgJ3N3aXRjaCB0byBtb250aCB2aWV3JyBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBzd2l0Y2hUb01vbnRoVmlld0xhYmVsID0gJ0Nob29zZSBkYXRlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlICdzd2l0Y2ggdG8geWVhciB2aWV3JyBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBzd2l0Y2hUb011bHRpWWVhclZpZXdMYWJlbCA9ICdDaG9vc2UgbW9udGggYW5kIHllYXInO1xuXG4gIC8qKlxuICAgKiBBIGxhYmVsIGZvciB0aGUgZmlyc3QgZGF0ZSBvZiBhIHJhbmdlIG9mIGRhdGVzICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS5cbiAgICogQGRlcHJlY2F0ZWQgUHJvdmlkZSB5b3VyIG93biBpbnRlcm5hdGlvbmFsaXphdGlvbiBzdHJpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBzdGFydERhdGVMYWJlbCA9ICdTdGFydCBkYXRlJztcblxuICAvKipcbiAgICogQSBsYWJlbCBmb3IgdGhlIGxhc3QgZGF0ZSBvZiBhIHJhbmdlIG9mIGRhdGVzICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS5cbiAgICogQGRlcHJlY2F0ZWQgUHJvdmlkZSB5b3VyIG93biBpbnRlcm5hdGlvbmFsaXphdGlvbiBzdHJpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBlbmREYXRlTGFiZWwgPSAnRW5kIGRhdGUnO1xuXG4gIC8qKiBGb3JtYXRzIGEgcmFuZ2Ugb2YgeWVhcnMgKHVzZWQgZm9yIHZpc3VhbHMpLiAqL1xuICBmb3JtYXRZZWFyUmFuZ2Uoc3RhcnQ6IHN0cmluZywgZW5kOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtzdGFydH0gXFx1MjAxMyAke2VuZH1gO1xuICB9XG5cbiAgLyoqIEZvcm1hdHMgYSBsYWJlbCBmb3IgYSByYW5nZSBvZiB5ZWFycyAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIGZvcm1hdFllYXJSYW5nZUxhYmVsKHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7c3RhcnR9IHRvICR7ZW5kfWA7XG4gIH1cbn1cbiJdfQ==