/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { Inject, Injectable, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from './date-adapter';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings an with out of bounds month, date, etc.
 */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;
/** Creates an array and fills it with values. */
function range(length, valueFunction) {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
/** Adapts the native JS Date for use with cdk-based components that work with dates. */
export class NativeDateAdapter extends DateAdapter {
    constructor(matDateLocale, 
    /**
     * @deprecated No longer being used. To be removed.
     * @breaking-change 14.0.0
     */
    _platform) {
        super();
        /**
         * @deprecated No longer being used. To be removed.
         * @breaking-change 14.0.0
         */
        this.useUtcForDisplay = false;
        super.setLocale(matDateLocale);
    }
    getYear(date) {
        return date.getFullYear();
    }
    getMonth(date) {
        return date.getMonth();
    }
    getDate(date) {
        return date.getDate();
    }
    getDayOfWeek(date) {
        return date.getDay();
    }
    getMonthNames(style) {
        const dtf = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
        return range(12, i => this._format(dtf, new Date(2017, i, 1)));
    }
    getDateNames() {
        const dtf = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
        return range(31, i => this._format(dtf, new Date(2017, 0, i + 1)));
    }
    getDayOfWeekNames(style) {
        const dtf = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'utc' });
        return range(7, i => this._format(dtf, new Date(2017, 0, i + 1)));
    }
    getYearName(date) {
        const dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: 'utc' });
        return this._format(dtf, date);
    }
    getFirstDayOfWeek() {
        // We can't tell using native JS Date what the first day of the week is, we default to Sunday.
        return 0;
    }
    getNumDaysInMonth(date) {
        return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
    }
    clone(date) {
        return new Date(date.getTime());
    }
    createDate(year, month, date) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            // Check for invalid month and date (except upper bound on date which we have to check after
            // creating the Date).
            if (month < 0 || month > 11) {
                throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
            }
            if (date < 1) {
                throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
            }
        }
        let result = this._createDateWithOverflow(year, month, date);
        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        if (result.getMonth() != month && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }
        return result;
    }
    today() {
        return new Date();
    }
    parse(value) {
        // We have no way using the native JS Date to set the parse format or locale, so we ignore these
        // parameters.
        if (typeof value == 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    }
    format(date, displayFormat) {
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot format invalid date.');
        }
        const dtf = new Intl.DateTimeFormat(this.locale, { ...displayFormat, timeZone: 'utc' });
        return this._format(dtf, date);
    }
    addCalendarYears(date, years) {
        return this.addCalendarMonths(date, years * 12);
    }
    addCalendarMonths(date, months) {
        let newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
        // guarantee this.
        if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) {
            newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
        }
        return newDate;
    }
    addCalendarDays(date, days) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
    }
    toIso8601(date) {
        return [
            date.getUTCFullYear(),
            this._2digit(date.getUTCMonth() + 1),
            this._2digit(date.getUTCDate())
        ].join('-');
    }
    /**
     * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
     * invalid date for all other values.
     */
    deserialize(value) {
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
            // string is the right format first.
            if (ISO_8601_REGEX.test(value)) {
                let date = new Date(value);
                if (this.isValid(date)) {
                    return date;
                }
            }
        }
        return super.deserialize(value);
    }
    isDateInstance(obj) {
        return obj instanceof Date;
    }
    isValid(date) {
        return !isNaN(date.getTime());
    }
    invalid() {
        return new Date(NaN);
    }
    /** Creates a date but allows the month and date to overflow. */
    _createDateWithOverflow(year, month, date) {
        // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
        // To work around this we use `setFullYear` and `setHours` instead.
        const d = new Date();
        d.setFullYear(year, month, date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    _2digit(n) {
        return ('00' + n).slice(-2);
    }
    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     * @param dtf Intl.DateTimeFormat object, containg the desired string format. It must have
     *    timeZone set to 'utc' to work fine.
     * @param date Date from which we want to get the string representation according to dtf
     * @returns A Date object with its UTC representation based on the passed in date info
     */
    _format(dtf, date) {
        // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
        // To work around this we use `setUTCFullYear` and `setUTCHours` instead.
        const d = new Date();
        d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        d.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        return dtf.format(d);
    }
}
NativeDateAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: NativeDateAdapter, deps: [{ token: MAT_DATE_LOCALE, optional: true }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
NativeDateAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: NativeDateAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: NativeDateAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_LOCALE]
                }] }, { type: i1.Platform }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlLWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2RhdGV0aW1lL25hdGl2ZS1kYXRlLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQUMsV0FBVyxFQUFFLGVBQWUsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7QUFFNUQ7Ozs7R0FJRztBQUNILE1BQU0sY0FBYyxHQUNoQixvRkFBb0YsQ0FBQztBQUd6RixpREFBaUQ7QUFDakQsU0FBUyxLQUFLLENBQUksTUFBYyxFQUFFLGFBQW1DO0lBQ25FLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9CLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQsd0ZBQXdGO0FBRXhGLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxXQUFpQjtJQU90RCxZQUFpRCxhQUFxQjtJQUNwRTs7O09BR0c7SUFDSCxTQUFvQjtRQUNwQixLQUFLLEVBQUUsQ0FBQztRQVpWOzs7V0FHRztRQUNILHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQVNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBVTtRQUNoQixPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUs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QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlciwgTUFUX0RBVEVfTE9DQUxFfSBmcm9tICcuL2RhdGUtYWRhcHRlcic7XG5cbi8qKlxuICogTWF0Y2hlcyBzdHJpbmdzIHRoYXQgaGF2ZSB0aGUgZm9ybSBvZiBhIHZhbGlkIFJGQyAzMzM5IHN0cmluZ1xuICogKGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzMzM5KS4gTm90ZSB0aGF0IHRoZSBzdHJpbmcgbWF5IG5vdCBhY3R1YWxseSBiZSBhIHZhbGlkIGRhdGVcbiAqIGJlY2F1c2UgdGhlIHJlZ2V4IHdpbGwgbWF0Y2ggc3RyaW5ncyBhbiB3aXRoIG91dCBvZiBib3VuZHMgbW9udGgsIGRhdGUsIGV0Yy5cbiAqL1xuY29uc3QgSVNPXzg2MDFfUkVHRVggPVxuICAgIC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0oPzpUXFxkezJ9OlxcZHsyfTpcXGR7Mn0oPzpcXC5cXGQrKT8oPzpafCg/Oig/OlxcK3wtKVxcZHsyfTpcXGR7Mn0pKT8pPyQvO1xuXG5cbi8qKiBDcmVhdGVzIGFuIGFycmF5IGFuZCBmaWxscyBpdCB3aXRoIHZhbHVlcy4gKi9cbmZ1bmN0aW9uIHJhbmdlPFQ+KGxlbmd0aDogbnVtYmVyLCB2YWx1ZUZ1bmN0aW9uOiAoaW5kZXg6IG51bWJlcikgPT4gVCk6IFRbXSB7XG4gIGNvbnN0IHZhbHVlc0FycmF5ID0gQXJyYXkobGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhbHVlc0FycmF5W2ldID0gdmFsdWVGdW5jdGlvbihpKTtcbiAgfVxuICByZXR1cm4gdmFsdWVzQXJyYXk7XG59XG5cbi8qKiBBZGFwdHMgdGhlIG5hdGl2ZSBKUyBEYXRlIGZvciB1c2Ugd2l0aCBjZGstYmFzZWQgY29tcG9uZW50cyB0aGF0IHdvcmsgd2l0aCBkYXRlcy4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOYXRpdmVEYXRlQWRhcHRlciBleHRlbmRzIERhdGVBZGFwdGVyPERhdGU+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgKi9cbiAgdXNlVXRjRm9yRGlzcGxheTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfTE9DQUxFKSBtYXREYXRlTG9jYWxlOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjBcbiAgICAgKi9cbiAgICBfcGxhdGZvcm0/OiBQbGF0Zm9ybSkge1xuICAgIHN1cGVyKCk7XG4gICAgc3VwZXIuc2V0TG9jYWxlKG1hdERhdGVMb2NhbGUpO1xuICB9XG5cbiAgZ2V0WWVhcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICB9XG5cbiAgZ2V0TW9udGgoZGF0ZTogRGF0ZSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0TW9udGgoKTtcbiAgfVxuXG4gIGdldERhdGUoZGF0ZTogRGF0ZSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF0ZSgpO1xuICB9XG5cbiAgZ2V0RGF5T2ZXZWVrKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICAgIHJldHVybiBkYXRlLmdldERheSgpO1xuICB9XG5cbiAgZ2V0TW9udGhOYW1lcyhzdHlsZTogJ2xvbmcnIHwgJ3Nob3J0JyB8ICduYXJyb3cnKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGR0ZiA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMubG9jYWxlLCB7bW9udGg6IHN0eWxlLCB0aW1lWm9uZTogJ3V0Yyd9KTtcbiAgICByZXR1cm4gcmFuZ2UoMTIsIGkgPT4gdGhpcy5fZm9ybWF0KGR0ZiwgbmV3IERhdGUoMjAxNywgaSwgMSkpKTtcbiAgfVxuXG4gIGdldERhdGVOYW1lcygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZHRmID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5sb2NhbGUsIHtkYXk6ICdudW1lcmljJywgdGltZVpvbmU6ICd1dGMnfSk7XG4gICAgcmV0dXJuIHJhbmdlKDMxLCBpID0+IHRoaXMuX2Zvcm1hdChkdGYsIG5ldyBEYXRlKDIwMTcsIDAsIGkgKyAxKSkpO1xuICB9XG5cbiAgZ2V0RGF5T2ZXZWVrTmFtZXMoc3R5bGU6ICdsb25nJyB8ICdzaG9ydCcgfCAnbmFycm93Jyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBkdGYgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLmxvY2FsZSwge3dlZWtkYXk6IHN0eWxlLCB0aW1lWm9uZTogJ3V0Yyd9KTtcbiAgICByZXR1cm4gcmFuZ2UoNywgaSA9PiB0aGlzLl9mb3JtYXQoZHRmLCBuZXcgRGF0ZSgyMDE3LCAwLCBpICsgMSkpKTtcbiAgfVxuXG4gIGdldFllYXJOYW1lKGRhdGU6IERhdGUpOiBzdHJpbmcge1xuICAgIGNvbnN0IGR0ZiA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMubG9jYWxlLCB7eWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ3V0Yyd9KTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybWF0KGR0ZiwgZGF0ZSk7XG4gIH1cblxuICBnZXRGaXJzdERheU9mV2VlaygpOiBudW1iZXIge1xuICAgIC8vIFdlIGNhbid0IHRlbGwgdXNpbmcgbmF0aXZlIEpTIERhdGUgd2hhdCB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrIGlzLCB3ZSBkZWZhdWx0IHRvIFN1bmRheS5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGdldE51bURheXNJbk1vbnRoKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmdldERhdGUodGhpcy5fY3JlYXRlRGF0ZVdpdGhPdmVyZmxvdyhcbiAgICAgICAgdGhpcy5nZXRZZWFyKGRhdGUpLCB0aGlzLmdldE1vbnRoKGRhdGUpICsgMSwgMCkpO1xuICB9XG5cbiAgY2xvbmUoZGF0ZTogRGF0ZSk6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XG4gIH1cblxuICBjcmVhdGVEYXRlKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF0ZTogbnVtYmVyKTogRGF0ZSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgLy8gQ2hlY2sgZm9yIGludmFsaWQgbW9udGggYW5kIGRhdGUgKGV4Y2VwdCB1cHBlciBib3VuZCBvbiBkYXRlIHdoaWNoIHdlIGhhdmUgdG8gY2hlY2sgYWZ0ZXJcbiAgICAgIC8vIGNyZWF0aW5nIHRoZSBEYXRlKS5cbiAgICAgIGlmIChtb250aCA8IDAgfHwgbW9udGggPiAxMSkge1xuICAgICAgICB0aHJvdyBFcnJvcihgSW52YWxpZCBtb250aCBpbmRleCBcIiR7bW9udGh9XCIuIE1vbnRoIGluZGV4IGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDExLmApO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0ZSA8IDEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgZGF0ZSBcIiR7ZGF0ZX1cIi4gRGF0ZSBoYXMgdG8gYmUgZ3JlYXRlciB0aGFuIDAuYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuX2NyZWF0ZURhdGVXaXRoT3ZlcmZsb3coeWVhciwgbW9udGgsIGRhdGUpO1xuICAgIC8vIENoZWNrIHRoYXQgdGhlIGRhdGUgd2Fzbid0IGFib3ZlIHRoZSB1cHBlciBib3VuZCBmb3IgdGhlIG1vbnRoLCBjYXVzaW5nIHRoZSBtb250aCB0byBvdmVyZmxvd1xuICAgIGlmIChyZXN1bHQuZ2V0TW9udGgoKSAhPSBtb250aCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgZGF0ZSBcIiR7ZGF0ZX1cIiBmb3IgbW9udGggd2l0aCBpbmRleCBcIiR7bW9udGh9XCIuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHRvZGF5KCk6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICB9XG5cbiAgcGFyc2UodmFsdWU6IGFueSk6IERhdGUgfCBudWxsIHtcbiAgICAvLyBXZSBoYXZlIG5vIHdheSB1c2luZyB0aGUgbmF0aXZlIEpTIERhdGUgdG8gc2V0IHRoZSBwYXJzZSBmb3JtYXQgb3IgbG9jYWxlLCBzbyB3ZSBpZ25vcmUgdGhlc2VcbiAgICAvLyBwYXJhbWV0ZXJzLlxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZSA/IG5ldyBEYXRlKERhdGUucGFyc2UodmFsdWUpKSA6IG51bGw7XG4gIH1cblxuICBmb3JtYXQoZGF0ZTogRGF0ZSwgZGlzcGxheUZvcm1hdDogT2JqZWN0KTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZChkYXRlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ05hdGl2ZURhdGVBZGFwdGVyOiBDYW5ub3QgZm9ybWF0IGludmFsaWQgZGF0ZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBkdGYgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLmxvY2FsZSwgey4uLmRpc3BsYXlGb3JtYXQsIHRpbWVab25lOiAndXRjJ30pO1xuICAgIHJldHVybiB0aGlzLl9mb3JtYXQoZHRmLCBkYXRlKTtcbiAgfVxuXG4gIGFkZENhbGVuZGFyWWVhcnMoZGF0ZTogRGF0ZSwgeWVhcnM6IG51bWJlcik6IERhdGUge1xuICAgIHJldHVybiB0aGlzLmFkZENhbGVuZGFyTW9udGhzKGRhdGUsIHllYXJzICogMTIpO1xuICB9XG5cbiAgYWRkQ2FsZW5kYXJNb250aHMoZGF0ZTogRGF0ZSwgbW9udGhzOiBudW1iZXIpOiBEYXRlIHtcbiAgICBsZXQgbmV3RGF0ZSA9IHRoaXMuX2NyZWF0ZURhdGVXaXRoT3ZlcmZsb3coXG4gICAgICAgIHRoaXMuZ2V0WWVhcihkYXRlKSwgdGhpcy5nZXRNb250aChkYXRlKSArIG1vbnRocywgdGhpcy5nZXREYXRlKGRhdGUpKTtcblxuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gd2luZCB1cCBpbiB0aGUgd3JvbmcgbW9udGggaWYgdGhlIG9yaWdpbmFsIG1vbnRoIGhhcyBtb3JlIGRheXMgdGhhbiB0aGUgbmV3XG4gICAgLy8gbW9udGguIEluIHRoaXMgY2FzZSB3ZSB3YW50IHRvIGdvIHRvIHRoZSBsYXN0IGRheSBvZiB0aGUgZGVzaXJlZCBtb250aC5cbiAgICAvLyBOb3RlOiB0aGUgYWRkaXRpb25hbCArIDEyICUgMTIgZW5zdXJlcyB3ZSBlbmQgdXAgd2l0aCBhIHBvc2l0aXZlIG51bWJlciwgc2luY2UgSlMgJSBkb2Vzbid0XG4gICAgLy8gZ3VhcmFudGVlIHRoaXMuXG4gICAgaWYgKHRoaXMuZ2V0TW9udGgobmV3RGF0ZSkgIT0gKCh0aGlzLmdldE1vbnRoKGRhdGUpICsgbW9udGhzKSAlIDEyICsgMTIpICUgMTIpIHtcbiAgICAgIG5ld0RhdGUgPSB0aGlzLl9jcmVhdGVEYXRlV2l0aE92ZXJmbG93KHRoaXMuZ2V0WWVhcihuZXdEYXRlKSwgdGhpcy5nZXRNb250aChuZXdEYXRlKSwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0RhdGU7XG4gIH1cblxuICBhZGRDYWxlbmRhckRheXMoZGF0ZTogRGF0ZSwgZGF5czogbnVtYmVyKTogRGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZURhdGVXaXRoT3ZlcmZsb3coXG4gICAgICAgIHRoaXMuZ2V0WWVhcihkYXRlKSwgdGhpcy5nZXRNb250aChkYXRlKSwgdGhpcy5nZXREYXRlKGRhdGUpICsgZGF5cyk7XG4gIH1cblxuICB0b0lzbzg2MDEoZGF0ZTogRGF0ZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGRhdGUuZ2V0VVRDRnVsbFllYXIoKSxcbiAgICAgIHRoaXMuXzJkaWdpdChkYXRlLmdldFVUQ01vbnRoKCkgKyAxKSxcbiAgICAgIHRoaXMuXzJkaWdpdChkYXRlLmdldFVUQ0RhdGUoKSlcbiAgICBdLmpvaW4oJy0nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBnaXZlbiB2YWx1ZSBpZiBnaXZlbiBhIHZhbGlkIERhdGUgb3IgbnVsbC4gRGVzZXJpYWxpemVzIHZhbGlkIElTTyA4NjAxIHN0cmluZ3NcbiAgICogKGh0dHBzOi8vd3d3LmlldGYub3JnL3JmYy9yZmMzMzM5LnR4dCkgaW50byB2YWxpZCBEYXRlcyBhbmQgZW1wdHkgc3RyaW5nIGludG8gbnVsbC4gUmV0dXJucyBhblxuICAgKiBpbnZhbGlkIGRhdGUgZm9yIGFsbCBvdGhlciB2YWx1ZXMuXG4gICAqL1xuICBvdmVycmlkZSBkZXNlcmlhbGl6ZSh2YWx1ZTogYW55KTogRGF0ZSB8IG51bGwge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgLy8gVGhlIGBEYXRlYCBjb25zdHJ1Y3RvciBhY2NlcHRzIGZvcm1hdHMgb3RoZXIgdGhhbiBJU08gODYwMSwgc28gd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlXG4gICAgICAvLyBzdHJpbmcgaXMgdGhlIHJpZ2h0IGZvcm1hdCBmaXJzdC5cbiAgICAgIGlmIChJU09fODYwMV9SRUdFWC50ZXN0KHZhbHVlKSkge1xuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZChkYXRlKSkge1xuICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gIH1cblxuICBpc0RhdGVJbnN0YW5jZShvYmo6IGFueSkge1xuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICB9XG5cbiAgaXNWYWxpZChkYXRlOiBEYXRlKSB7XG4gICAgcmV0dXJuICFpc05hTihkYXRlLmdldFRpbWUoKSk7XG4gIH1cblxuICBpbnZhbGlkKCk6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZShOYU4pO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBkYXRlIGJ1dCBhbGxvd3MgdGhlIG1vbnRoIGFuZCBkYXRlIHRvIG92ZXJmbG93LiAqL1xuICBwcml2YXRlIF9jcmVhdGVEYXRlV2l0aE92ZXJmbG93KHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF0ZTogbnVtYmVyKSB7XG4gICAgLy8gUGFzc2luZyB0aGUgeWVhciB0byB0aGUgY29uc3RydWN0b3IgY2F1c2VzIHllYXIgbnVtYmVycyA8MTAwIHRvIGJlIGNvbnZlcnRlZCB0byAxOXh4LlxuICAgIC8vIFRvIHdvcmsgYXJvdW5kIHRoaXMgd2UgdXNlIGBzZXRGdWxsWWVhcmAgYW5kIGBzZXRIb3Vyc2AgaW5zdGVhZC5cbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICBkLnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCBkYXRlKTtcbiAgICBkLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhZHMgYSBudW1iZXIgdG8gbWFrZSBpdCB0d28gZGlnaXRzLlxuICAgKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHBhZC5cbiAgICogQHJldHVybnMgVGhlIHBhZGRlZCBudW1iZXIuXG4gICAqL1xuICBwcml2YXRlIF8yZGlnaXQobjogbnVtYmVyKSB7XG4gICAgcmV0dXJuICgnMDAnICsgbikuc2xpY2UoLTIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gY29udmVydGluZyBEYXRlIG9iamVjdCB0byBzdHJpbmcsIGphdmFzY3JpcHQgYnVpbHQtaW4gZnVuY3Rpb25zIG1heSByZXR1cm4gd3JvbmdcbiAgICogcmVzdWx0cyBiZWNhdXNlIGl0IGFwcGxpZXMgaXRzIGludGVybmFsIERTVCBydWxlcy4gVGhlIERTVCBydWxlcyBhcm91bmQgdGhlIHdvcmxkIGNoYW5nZVxuICAgKiB2ZXJ5IGZyZXF1ZW50bHksIGFuZCB0aGUgY3VycmVudCB2YWxpZCBydWxlIGlzIG5vdCBhbHdheXMgdmFsaWQgaW4gcHJldmlvdXMgeWVhcnMgdGhvdWdoLlxuICAgKiBXZSB3b3JrIGFyb3VuZCB0aGlzIHByb2JsZW0gYnVpbGRpbmcgYSBuZXcgRGF0ZSBvYmplY3Qgd2hpY2ggaGFzIGl0cyBpbnRlcm5hbCBVVENcbiAgICogcmVwcmVzZW50YXRpb24gd2l0aCB0aGUgbG9jYWwgZGF0ZSBhbmQgdGltZS5cbiAgICogQHBhcmFtIGR0ZiBJbnRsLkRhdGVUaW1lRm9ybWF0IG9iamVjdCwgY29udGFpbmcgdGhlIGRlc2lyZWQgc3RyaW5nIGZvcm1hdC4gSXQgbXVzdCBoYXZlXG4gICAqICAgIHRpbWVab25lIHNldCB0byAndXRjJyB0byB3b3JrIGZpbmUuXG4gICAqIEBwYXJhbSBkYXRlIERhdGUgZnJvbSB3aGljaCB3ZSB3YW50IHRvIGdldCB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGFjY29yZGluZyB0byBkdGZcbiAgICogQHJldHVybnMgQSBEYXRlIG9iamVjdCB3aXRoIGl0cyBVVEMgcmVwcmVzZW50YXRpb24gYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBkYXRlIGluZm9cbiAgICovXG4gIHByaXZhdGUgX2Zvcm1hdChkdGY6IEludGwuRGF0ZVRpbWVGb3JtYXQsIGRhdGU6IERhdGUpIHtcbiAgICAvLyBQYXNzaW5nIHRoZSB5ZWFyIHRvIHRoZSBjb25zdHJ1Y3RvciBjYXVzZXMgeWVhciBudW1iZXJzIDwxMDAgdG8gYmUgY29udmVydGVkIHRvIDE5eHguXG4gICAgLy8gVG8gd29yayBhcm91bmQgdGhpcyB3ZSB1c2UgYHNldFVUQ0Z1bGxZZWFyYCBhbmQgYHNldFVUQ0hvdXJzYCBpbnN0ZWFkLlxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGQuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICBkLnNldFVUQ0hvdXJzKGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpLCBkYXRlLmdldE1pbGxpc2Vjb25kcygpKTtcbiAgICByZXR1cm4gZHRmLmZvcm1hdChkKTtcbiAgfVxufVxuIl19