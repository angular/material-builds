/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { inject, InjectionToken, LOCALE_ID } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * InjectionToken for datepicker that can be used to override default locale code.
 * @type {?}
 */
export const MAT_DATE_LOCALE = new InjectionToken('MAT_DATE_LOCALE', {
    providedIn: 'root',
    factory: MAT_DATE_LOCALE_FACTORY,
});
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_DATE_LOCALE_FACTORY() {
    return inject(LOCALE_ID);
}
/**
 * No longer needed since MAT_DATE_LOCALE has been changed to a scoped injectable.
 * If you are importing and providing this in your code you can simply remove it.
 * @deprecated
 * \@breaking-change 8.0.0
 * @type {?}
 */
export const MAT_DATE_LOCALE_PROVIDER = { provide: MAT_DATE_LOCALE, useExisting: LOCALE_ID };
/**
 * Adapts type `D` to be usable as a date by cdk-based components that work with dates.
 * @abstract
 * @template D
 */
export class DateAdapter {
    constructor() {
        this._localeChanges = new Subject();
    }
    /**
     * A stream that emits when the locale changes.
     * @return {?}
     */
    get localeChanges() { return this._localeChanges; }
    /**
     * Attempts to deserialize a value to a valid date object. This is different from parsing in that
     * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
     * string). The default implementation does not allow any deserialization, it simply checks that
     * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
     * method on all of its `\@Input()` properties that accept dates. It is therefore possible to
     * support passing values from your backend directly to these properties by overriding this method
     * to also deserialize the format used by your backend.
     * @param {?} value The value to be deserialized into a date object.
     * @return {?} The deserialized date object, either a valid date, null if the value can be
     *     deserialized into a null date (e.g. the empty string), or an invalid date.
     */
    deserialize(value) {
        if (value == null || this.isDateInstance(value) && this.isValid(value)) {
            return value;
        }
        return this.invalid();
    }
    /**
     * Sets the locale used for all dates.
     * @param {?} locale The new locale.
     * @return {?}
     */
    setLocale(locale) {
        this.locale = locale;
        this._localeChanges.next();
    }
    /**
     * Compares two dates.
     * @param {?} first The first date to compare.
     * @param {?} second The second date to compare.
     * @return {?} 0 if the dates are equal, a number less than 0 if the first date is earlier,
     *     a number greater than 0 if the first date is later.
     */
    compareDate(first, second) {
        return this.getYear(first) - this.getYear(second) ||
            this.getMonth(first) - this.getMonth(second) ||
            this.getDate(first) - this.getDate(second);
    }
    /**
     * Checks if two dates are equal.
     * @param {?} first The first date to check.
     * @param {?} second The second date to check.
     * @return {?} Whether the two dates are equal.
     *     Null dates are considered equal to other null dates.
     */
    sameDate(first, second) {
        if (first && second) {
            /** @type {?} */
            let firstValid = this.isValid(first);
            /** @type {?} */
            let secondValid = this.isValid(second);
            if (firstValid && secondValid) {
                return !this.compareDate(first, second);
            }
            return firstValid == secondValid;
        }
        return first == second;
    }
    /**
     * Clamp the given date between min and max dates.
     * @param {?} date The date to clamp.
     * @param {?=} min The minimum value to allow. If null or omitted no min is enforced.
     * @param {?=} max The maximum value to allow. If null or omitted no max is enforced.
     * @return {?} `min` if `date` is less than `min`, `max` if date is greater than `max`,
     *     otherwise `date`.
     */
    clampDate(date, min, max) {
        if (min && this.compareDate(date, min) < 0) {
            return min;
        }
        if (max && this.compareDate(date, max) > 0) {
            return max;
        }
        return date;
    }
}
if (false) {
    /**
     * The locale to use for all dates.
     * @type {?}
     * @protected
     */
    DateAdapter.prototype.locale;
    /**
     * @type {?}
     * @protected
     */
    DateAdapter.prototype._localeChanges;
    /**
     * Gets the year component of the given date.
     * @abstract
     * @param {?} date The date to extract the year from.
     * @return {?} The year component.
     */
    DateAdapter.prototype.getYear = function (date) { };
    /**
     * Gets the month component of the given date.
     * @abstract
     * @param {?} date The date to extract the month from.
     * @return {?} The month component (0-indexed, 0 = January).
     */
    DateAdapter.prototype.getMonth = function (date) { };
    /**
     * Gets the date of the month component of the given date.
     * @abstract
     * @param {?} date The date to extract the date of the month from.
     * @return {?} The month component (1-indexed, 1 = first of month).
     */
    DateAdapter.prototype.getDate = function (date) { };
    /**
     * Gets the day of the week component of the given date.
     * @abstract
     * @param {?} date The date to extract the day of the week from.
     * @return {?} The month component (0-indexed, 0 = Sunday).
     */
    DateAdapter.prototype.getDayOfWeek = function (date) { };
    /**
     * Gets a list of names for the months.
     * @abstract
     * @param {?} style The naming style (e.g. long = 'January', short = 'Jan', narrow = 'J').
     * @return {?} An ordered list of all month names, starting with January.
     */
    DateAdapter.prototype.getMonthNames = function (style) { };
    /**
     * Gets a list of names for the dates of the month.
     * @abstract
     * @return {?} An ordered list of all date of the month names, starting with '1'.
     */
    DateAdapter.prototype.getDateNames = function () { };
    /**
     * Gets a list of names for the days of the week.
     * @abstract
     * @param {?} style The naming style (e.g. long = 'Sunday', short = 'Sun', narrow = 'S').
     * @return {?} An ordered list of all weekday names, starting with Sunday.
     */
    DateAdapter.prototype.getDayOfWeekNames = function (style) { };
    /**
     * Gets the name for the year of the given date.
     * @abstract
     * @param {?} date The date to get the year name for.
     * @return {?} The name of the given year (e.g. '2017').
     */
    DateAdapter.prototype.getYearName = function (date) { };
    /**
     * Gets the first day of the week.
     * @abstract
     * @return {?} The first day of the week (0-indexed, 0 = Sunday).
     */
    DateAdapter.prototype.getFirstDayOfWeek = function () { };
    /**
     * Gets the number of days in the month of the given date.
     * @abstract
     * @param {?} date The date whose month should be checked.
     * @return {?} The number of days in the month of the given date.
     */
    DateAdapter.prototype.getNumDaysInMonth = function (date) { };
    /**
     * Clones the given date.
     * @abstract
     * @param {?} date The date to clone
     * @return {?} A new date equal to the given date.
     */
    DateAdapter.prototype.clone = function (date) { };
    /**
     * Creates a date with the given year, month, and date. Does not allow over/under-flow of the
     * month and date.
     * @abstract
     * @param {?} year The full year of the date. (e.g. 89 means the year 89, not the year 1989).
     * @param {?} month The month of the date (0-indexed, 0 = January). Must be an integer 0 - 11.
     * @param {?} date The date of month of the date. Must be an integer 1 - length of the given month.
     * @return {?} The new date, or null if invalid.
     */
    DateAdapter.prototype.createDate = function (year, month, date) { };
    /**
     * Gets today's date.
     * @abstract
     * @return {?} Today's date.
     */
    DateAdapter.prototype.today = function () { };
    /**
     * Parses a date from a user-provided value.
     * @abstract
     * @param {?} value The value to parse.
     * @param {?} parseFormat The expected format of the value being parsed
     *     (type is implementation-dependent).
     * @return {?} The parsed date.
     */
    DateAdapter.prototype.parse = function (value, parseFormat) { };
    /**
     * Formats a date as a string according to the given format.
     * @abstract
     * @param {?} date The value to format.
     * @param {?} displayFormat The format to use to display the date as a string.
     * @return {?} The formatted date string.
     */
    DateAdapter.prototype.format = function (date, displayFormat) { };
    /**
     * Adds the given number of years to the date. Years are counted as if flipping 12 pages on the
     * calendar for each year and then finding the closest date in the new month. For example when
     * adding 1 year to Feb 29, 2016, the resulting date will be Feb 28, 2017.
     * @abstract
     * @param {?} date The date to add years to.
     * @param {?} years The number of years to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of years added.
     */
    DateAdapter.prototype.addCalendarYears = function (date, years) { };
    /**
     * Adds the given number of months to the date. Months are counted as if flipping a page on the
     * calendar for each month and then finding the closest date in the new month. For example when
     * adding 1 month to Jan 31, 2017, the resulting date will be Feb 28, 2017.
     * @abstract
     * @param {?} date The date to add months to.
     * @param {?} months The number of months to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of months added.
     */
    DateAdapter.prototype.addCalendarMonths = function (date, months) { };
    /**
     * Adds the given number of days to the date. Days are counted as if moving one cell on the
     * calendar for each day.
     * @abstract
     * @param {?} date The date to add days to.
     * @param {?} days The number of days to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of days added.
     */
    DateAdapter.prototype.addCalendarDays = function (date, days) { };
    /**
     * Gets the RFC 3339 compatible string (https://tools.ietf.org/html/rfc3339) for the given date.
     * This method is used to generate date strings that are compatible with native HTML attributes
     * such as the `min` or `max` attribute of an `<input>`.
     * @abstract
     * @param {?} date The date to get the ISO date string for.
     * @return {?} The ISO date string date string.
     */
    DateAdapter.prototype.toIso8601 = function (date) { };
    /**
     * Checks whether the given object is considered a date instance by this DateAdapter.
     * @abstract
     * @param {?} obj The object to check
     * @return {?} Whether the object is a date instance.
     */
    DateAdapter.prototype.isDateInstance = function (obj) { };
    /**
     * Checks whether the given date is valid.
     * @abstract
     * @param {?} date The date to check.
     * @return {?} Whether the date is valid.
     */
    DateAdapter.prototype.isValid = function (date) { };
    /**
     * Gets date instance that is not valid.
     * @abstract
     * @return {?} An invalid date.
     */
    DateAdapter.prototype.invalid = function () { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvZGF0ZXRpbWUvZGF0ZS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hFLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBR3pDLE1BQU0sT0FBTyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQVMsaUJBQWlCLEVBQUU7SUFDM0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLHVCQUF1QjtDQUNqQyxDQUFDOzs7OztBQUdGLE1BQU0sVUFBVSx1QkFBdUI7SUFDckMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0IsQ0FBQzs7Ozs7Ozs7QUFRRCxNQUFNLE9BQU8sd0JBQXdCLEdBQUcsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUM7Ozs7OztBQUcxRixNQUFNLE9BQWdCLFdBQVc7SUFBakM7UUFNWSxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFxUGpELENBQUM7Ozs7O0lBdFBDLElBQUksYUFBYSxLQUF1QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0lBcUxyRSxXQUFXLENBQUMsS0FBVTtRQUNwQixJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3RFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7Ozs7SUFNRCxTQUFTLENBQUMsTUFBVztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7Ozs7O0lBU0QsV0FBVyxDQUFDLEtBQVEsRUFBRSxNQUFTO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7OztJQVNELFFBQVEsQ0FBQyxLQUFlLEVBQUUsTUFBZ0I7UUFDeEMsSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFOztnQkFDZixVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7O2dCQUNoQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDdEMsSUFBSSxVQUFVLElBQUksV0FBVyxFQUFFO2dCQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDekM7WUFDRCxPQUFPLFVBQVUsSUFBSSxXQUFXLENBQUM7U0FDbEM7UUFDRCxPQUFPLEtBQUssSUFBSSxNQUFNLENBQUM7SUFDekIsQ0FBQzs7Ozs7Ozs7O0lBVUQsU0FBUyxDQUFDLElBQU8sRUFBRSxHQUFjLEVBQUUsR0FBYztRQUMvQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUMsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMxQyxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7Ozs7Ozs7SUF6UEMsNkJBQXNCOzs7OztJQUl0QixxQ0FBK0M7Ozs7Ozs7SUFPL0Msb0RBQWtDOzs7Ozs7O0lBT2xDLHFEQUFtQzs7Ozs7OztJQU9uQyxvREFBa0M7Ozs7Ozs7SUFPbEMseURBQXVDOzs7Ozs7O0lBT3ZDLDJEQUFxRTs7Ozs7O0lBTXJFLHFEQUFrQzs7Ozs7OztJQU9sQywrREFBeUU7Ozs7Ozs7SUFPekUsd0RBQXNDOzs7Ozs7SUFNdEMsMERBQXFDOzs7Ozs7O0lBT3JDLDhEQUE0Qzs7Ozs7OztJQU81QyxrREFBMkI7Ozs7Ozs7Ozs7SUFVM0Isb0VBQWtFOzs7Ozs7SUFNbEUsOENBQW9COzs7Ozs7Ozs7SUFTcEIsZ0VBQXVEOzs7Ozs7OztJQVF2RCxrRUFBcUQ7Ozs7Ozs7Ozs7SUFVckQsb0VBQXFEOzs7Ozs7Ozs7O0lBVXJELHNFQUF1RDs7Ozs7Ozs7O0lBU3ZELGtFQUFtRDs7Ozs7Ozs7O0lBU25ELHNEQUFvQzs7Ozs7OztJQU9wQywwREFBMkM7Ozs7Ozs7SUFPM0Msb0RBQW1DOzs7Ozs7SUFNbkMsZ0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgTE9DQUxFX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBJbmplY3Rpb25Ub2tlbiBmb3IgZGF0ZXBpY2tlciB0aGF0IGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIGRlZmF1bHQgbG9jYWxlIGNvZGUuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfTE9DQUxFID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ01BVF9EQVRFX0xPQ0FMRScsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiBNQVRfREFURV9MT0NBTEVfRkFDVE9SWSxcbn0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9EQVRFX0xPQ0FMRV9GQUNUT1JZKCk6IHN0cmluZyB7XG4gIHJldHVybiBpbmplY3QoTE9DQUxFX0lEKTtcbn1cblxuLyoqXG4gKiBObyBsb25nZXIgbmVlZGVkIHNpbmNlIE1BVF9EQVRFX0xPQ0FMRSBoYXMgYmVlbiBjaGFuZ2VkIHRvIGEgc2NvcGVkIGluamVjdGFibGUuXG4gKiBJZiB5b3UgYXJlIGltcG9ydGluZyBhbmQgcHJvdmlkaW5nIHRoaXMgaW4geW91ciBjb2RlIHlvdSBjYW4gc2ltcGx5IHJlbW92ZSBpdC5cbiAqIEBkZXByZWNhdGVkXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURV9MT0NBTEVfUFJPVklERVIgPSB7cHJvdmlkZTogTUFUX0RBVEVfTE9DQUxFLCB1c2VFeGlzdGluZzogTE9DQUxFX0lEfTtcblxuLyoqIEFkYXB0cyB0eXBlIGBEYCB0byBiZSB1c2FibGUgYXMgYSBkYXRlIGJ5IGNkay1iYXNlZCBjb21wb25lbnRzIHRoYXQgd29yayB3aXRoIGRhdGVzLiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERhdGVBZGFwdGVyPEQ+IHtcbiAgLyoqIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBhbGwgZGF0ZXMuICovXG4gIHByb3RlY3RlZCBsb2NhbGU6IGFueTtcblxuICAvKiogQSBzdHJlYW0gdGhhdCBlbWl0cyB3aGVuIHRoZSBsb2NhbGUgY2hhbmdlcy4gKi9cbiAgZ2V0IGxvY2FsZUNoYW5nZXMoKTogT2JzZXJ2YWJsZTx2b2lkPiB7IHJldHVybiB0aGlzLl9sb2NhbGVDaGFuZ2VzOyB9XG4gIHByb3RlY3RlZCBfbG9jYWxlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHllYXIgY29tcG9uZW50IG9mIHRoZSBnaXZlbiBkYXRlLlxuICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB0byBleHRyYWN0IHRoZSB5ZWFyIGZyb20uXG4gICAqIEByZXR1cm5zIFRoZSB5ZWFyIGNvbXBvbmVudC5cbiAgICovXG4gIGFic3RyYWN0IGdldFllYXIoZGF0ZTogRCk6IG51bWJlcjtcblxuICAvKipcbiAgICogR2V0cyB0aGUgbW9udGggY29tcG9uZW50IG9mIHRoZSBnaXZlbiBkYXRlLlxuICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB0byBleHRyYWN0IHRoZSBtb250aCBmcm9tLlxuICAgKiBAcmV0dXJucyBUaGUgbW9udGggY29tcG9uZW50ICgwLWluZGV4ZWQsIDAgPSBKYW51YXJ5KS5cbiAgICovXG4gIGFic3RyYWN0IGdldE1vbnRoKGRhdGU6IEQpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRhdGUgb2YgdGhlIG1vbnRoIGNvbXBvbmVudCBvZiB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICogQHBhcmFtIGRhdGUgVGhlIGRhdGUgdG8gZXh0cmFjdCB0aGUgZGF0ZSBvZiB0aGUgbW9udGggZnJvbS5cbiAgICogQHJldHVybnMgVGhlIG1vbnRoIGNvbXBvbmVudCAoMS1pbmRleGVkLCAxID0gZmlyc3Qgb2YgbW9udGgpLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0RGF0ZShkYXRlOiBEKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXkgb2YgdGhlIHdlZWsgY29tcG9uZW50IG9mIHRoZSBnaXZlbiBkYXRlLlxuICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB0byBleHRyYWN0IHRoZSBkYXkgb2YgdGhlIHdlZWsgZnJvbS5cbiAgICogQHJldHVybnMgVGhlIG1vbnRoIGNvbXBvbmVudCAoMC1pbmRleGVkLCAwID0gU3VuZGF5KS5cbiAgICovXG4gIGFic3RyYWN0IGdldERheU9mV2VlayhkYXRlOiBEKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiBuYW1lcyBmb3IgdGhlIG1vbnRocy5cbiAgICogQHBhcmFtIHN0eWxlIFRoZSBuYW1pbmcgc3R5bGUgKGUuZy4gbG9uZyA9ICdKYW51YXJ5Jywgc2hvcnQgPSAnSmFuJywgbmFycm93ID0gJ0onKS5cbiAgICogQHJldHVybnMgQW4gb3JkZXJlZCBsaXN0IG9mIGFsbCBtb250aCBuYW1lcywgc3RhcnRpbmcgd2l0aCBKYW51YXJ5LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0TW9udGhOYW1lcyhzdHlsZTogJ2xvbmcnIHwgJ3Nob3J0JyB8ICduYXJyb3cnKTogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIG5hbWVzIGZvciB0aGUgZGF0ZXMgb2YgdGhlIG1vbnRoLlxuICAgKiBAcmV0dXJucyBBbiBvcmRlcmVkIGxpc3Qgb2YgYWxsIGRhdGUgb2YgdGhlIG1vbnRoIG5hbWVzLCBzdGFydGluZyB3aXRoICcxJy5cbiAgICovXG4gIGFic3RyYWN0IGdldERhdGVOYW1lcygpOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgbmFtZXMgZm9yIHRoZSBkYXlzIG9mIHRoZSB3ZWVrLlxuICAgKiBAcGFyYW0gc3R5bGUgVGhlIG5hbWluZyBzdHlsZSAoZS5nLiBsb25nID0gJ1N1bmRheScsIHNob3J0ID0gJ1N1bicsIG5hcnJvdyA9ICdTJykuXG4gICAqIEByZXR1cm5zIEFuIG9yZGVyZWQgbGlzdCBvZiBhbGwgd2Vla2RheSBuYW1lcywgc3RhcnRpbmcgd2l0aCBTdW5kYXkuXG4gICAqL1xuICBhYnN0cmFjdCBnZXREYXlPZldlZWtOYW1lcyhzdHlsZTogJ2xvbmcnIHwgJ3Nob3J0JyB8ICduYXJyb3cnKTogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG5hbWUgZm9yIHRoZSB5ZWFyIG9mIHRoZSBnaXZlbiBkYXRlLlxuICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB0byBnZXQgdGhlIHllYXIgbmFtZSBmb3IuXG4gICAqIEByZXR1cm5zIFRoZSBuYW1lIG9mIHRoZSBnaXZlbiB5ZWFyIChlLmcuICcyMDE3JykuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRZZWFyTmFtZShkYXRlOiBEKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAqIEByZXR1cm5zIFRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgKDAtaW5kZXhlZCwgMCA9IFN1bmRheSkuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRGaXJzdERheU9mV2VlaygpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG51bWJlciBvZiBkYXlzIGluIHRoZSBtb250aCBvZiB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICogQHBhcmFtIGRhdGUgVGhlIGRhdGUgd2hvc2UgbW9udGggc2hvdWxkIGJlIGNoZWNrZWQuXG4gICAqIEByZXR1cm5zIFRoZSBudW1iZXIgb2YgZGF5cyBpbiB0aGUgbW9udGggb2YgdGhlIGdpdmVuIGRhdGUuXG4gICAqL1xuICBhYnN0cmFjdCBnZXROdW1EYXlzSW5Nb250aChkYXRlOiBEKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDbG9uZXMgdGhlIGdpdmVuIGRhdGUuXG4gICAqIEBwYXJhbSBkYXRlIFRoZSBkYXRlIHRvIGNsb25lXG4gICAqIEByZXR1cm5zIEEgbmV3IGRhdGUgZXF1YWwgdG8gdGhlIGdpdmVuIGRhdGUuXG4gICAqL1xuICBhYnN0cmFjdCBjbG9uZShkYXRlOiBEKTogRDtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGRhdGUgd2l0aCB0aGUgZ2l2ZW4geWVhciwgbW9udGgsIGFuZCBkYXRlLiBEb2VzIG5vdCBhbGxvdyBvdmVyL3VuZGVyLWZsb3cgb2YgdGhlXG4gICAqIG1vbnRoIGFuZCBkYXRlLlxuICAgKiBAcGFyYW0geWVhciBUaGUgZnVsbCB5ZWFyIG9mIHRoZSBkYXRlLiAoZS5nLiA4OSBtZWFucyB0aGUgeWVhciA4OSwgbm90IHRoZSB5ZWFyIDE5ODkpLlxuICAgKiBAcGFyYW0gbW9udGggVGhlIG1vbnRoIG9mIHRoZSBkYXRlICgwLWluZGV4ZWQsIDAgPSBKYW51YXJ5KS4gTXVzdCBiZSBhbiBpbnRlZ2VyIDAgLSAxMS5cbiAgICogQHBhcmFtIGRhdGUgVGhlIGRhdGUgb2YgbW9udGggb2YgdGhlIGRhdGUuIE11c3QgYmUgYW4gaW50ZWdlciAxIC0gbGVuZ3RoIG9mIHRoZSBnaXZlbiBtb250aC5cbiAgICogQHJldHVybnMgVGhlIG5ldyBkYXRlLCBvciBudWxsIGlmIGludmFsaWQuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVEYXRlKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF0ZTogbnVtYmVyKTogRDtcblxuICAvKipcbiAgICogR2V0cyB0b2RheSdzIGRhdGUuXG4gICAqIEByZXR1cm5zIFRvZGF5J3MgZGF0ZS5cbiAgICovXG4gIGFic3RyYWN0IHRvZGF5KCk6IEQ7XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhIGRhdGUgZnJvbSBhIHVzZXItcHJvdmlkZWQgdmFsdWUuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gcGFyc2UuXG4gICAqIEBwYXJhbSBwYXJzZUZvcm1hdCBUaGUgZXhwZWN0ZWQgZm9ybWF0IG9mIHRoZSB2YWx1ZSBiZWluZyBwYXJzZWRcbiAgICogICAgICh0eXBlIGlzIGltcGxlbWVudGF0aW9uLWRlcGVuZGVudCkuXG4gICAqIEByZXR1cm5zIFRoZSBwYXJzZWQgZGF0ZS5cbiAgICovXG4gIGFic3RyYWN0IHBhcnNlKHZhbHVlOiBhbnksIHBhcnNlRm9ybWF0OiBhbnkpOiBEIHwgbnVsbDtcblxuICAvKipcbiAgICogRm9ybWF0cyBhIGRhdGUgYXMgYSBzdHJpbmcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBmb3JtYXQuXG4gICAqIEBwYXJhbSBkYXRlIFRoZSB2YWx1ZSB0byBmb3JtYXQuXG4gICAqIEBwYXJhbSBkaXNwbGF5Rm9ybWF0IFRoZSBmb3JtYXQgdG8gdXNlIHRvIGRpc3BsYXkgdGhlIGRhdGUgYXMgYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIFRoZSBmb3JtYXR0ZWQgZGF0ZSBzdHJpbmcuXG4gICAqL1xuICBhYnN0cmFjdCBmb3JtYXQoZGF0ZTogRCwgZGlzcGxheUZvcm1hdDogYW55KTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBnaXZlbiBudW1iZXIgb2YgeWVhcnMgdG8gdGhlIGRhdGUuIFllYXJzIGFyZSBjb3VudGVkIGFzIGlmIGZsaXBwaW5nIDEyIHBhZ2VzIG9uIHRoZVxuICAgKiBjYWxlbmRhciBmb3IgZWFjaCB5ZWFyIGFuZCB0aGVuIGZpbmRpbmcgdGhlIGNsb3Nlc3QgZGF0ZSBpbiB0aGUgbmV3IG1vbnRoLiBGb3IgZXhhbXBsZSB3aGVuXG4gICAqIGFkZGluZyAxIHllYXIgdG8gRmViIDI5LCAyMDE2LCB0aGUgcmVzdWx0aW5nIGRhdGUgd2lsbCBiZSBGZWIgMjgsIDIwMTcuXG4gICAqIEBwYXJhbSBkYXRlIFRoZSBkYXRlIHRvIGFkZCB5ZWFycyB0by5cbiAgICogQHBhcmFtIHllYXJzIFRoZSBudW1iZXIgb2YgeWVhcnMgdG8gYWRkIChtYXkgYmUgbmVnYXRpdmUpLlxuICAgKiBAcmV0dXJucyBBIG5ldyBkYXRlIGVxdWFsIHRvIHRoZSBnaXZlbiBvbmUgd2l0aCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiB5ZWFycyBhZGRlZC5cbiAgICovXG4gIGFic3RyYWN0IGFkZENhbGVuZGFyWWVhcnMoZGF0ZTogRCwgeWVhcnM6IG51bWJlcik6IEQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIGdpdmVuIG51bWJlciBvZiBtb250aHMgdG8gdGhlIGRhdGUuIE1vbnRocyBhcmUgY291bnRlZCBhcyBpZiBmbGlwcGluZyBhIHBhZ2Ugb24gdGhlXG4gICAqIGNhbGVuZGFyIGZvciBlYWNoIG1vbnRoIGFuZCB0aGVuIGZpbmRpbmcgdGhlIGNsb3Nlc3QgZGF0ZSBpbiB0aGUgbmV3IG1vbnRoLiBGb3IgZXhhbXBsZSB3aGVuXG4gICAqIGFkZGluZyAxIG1vbnRoIHRvIEphbiAzMSwgMjAxNywgdGhlIHJlc3VsdGluZyBkYXRlIHdpbGwgYmUgRmViIDI4LCAyMDE3LlxuICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB0byBhZGQgbW9udGhzIHRvLlxuICAgKiBAcGFyYW0gbW9udGhzIFRoZSBudW1iZXIgb2YgbW9udGhzIHRvIGFkZCAobWF5IGJlIG5lZ2F0aXZlKS5cbiAgICogQHJldHVybnMgQSBuZXcgZGF0ZSBlcXVhbCB0byB0aGUgZ2l2ZW4gb25lIHdpdGggdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIGFkZGVkLlxuICAgKi9cbiAgYWJzdHJhY3QgYWRkQ2FsZW5kYXJNb250aHMoZGF0ZTogRCwgbW9udGhzOiBudW1iZXIpOiBEO1xuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBnaXZlbiBudW1iZXIgb2YgZGF5cyB0byB0aGUgZGF0ZS4gRGF5cyBhcmUgY291bnRlZCBhcyBpZiBtb3Zpbmcgb25lIGNlbGwgb24gdGhlXG4gICAqIGNhbGVuZGFyIGZvciBlYWNoIGRheS5cbiAgICogQHBhcmFtIGRhdGUgVGhlIGRhdGUgdG8gYWRkIGRheXMgdG8uXG4gICAqIEBwYXJhbSBkYXlzIFRoZSBudW1iZXIgb2YgZGF5cyB0byBhZGQgKG1heSBiZSBuZWdhdGl2ZSkuXG4gICAqIEByZXR1cm5zIEEgbmV3IGRhdGUgZXF1YWwgdG8gdGhlIGdpdmVuIG9uZSB3aXRoIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIGRheXMgYWRkZWQuXG4gICAqL1xuICBhYnN0cmFjdCBhZGRDYWxlbmRhckRheXMoZGF0ZTogRCwgZGF5czogbnVtYmVyKTogRDtcblxuICAvKipcbiAgICogR2V0cyB0aGUgUkZDIDMzMzkgY29tcGF0aWJsZSBzdHJpbmcgKGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzMzM5KSBmb3IgdGhlIGdpdmVuIGRhdGUuXG4gICAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gZ2VuZXJhdGUgZGF0ZSBzdHJpbmdzIHRoYXQgYXJlIGNvbXBhdGlibGUgd2l0aCBuYXRpdmUgSFRNTCBhdHRyaWJ1dGVzXG4gICAqIHN1Y2ggYXMgdGhlIGBtaW5gIG9yIGBtYXhgIGF0dHJpYnV0ZSBvZiBhbiBgPGlucHV0PmAuXG4gICAqIEBwYXJhbSBkYXRlIFRoZSBkYXRlIHRvIGdldCB0aGUgSVNPIGRhdGUgc3RyaW5nIGZvci5cbiAgICogQHJldHVybnMgVGhlIElTTyBkYXRlIHN0cmluZyBkYXRlIHN0cmluZy5cbiAgICovXG4gIGFic3RyYWN0IHRvSXNvODYwMShkYXRlOiBEKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGNvbnNpZGVyZWQgYSBkYXRlIGluc3RhbmNlIGJ5IHRoaXMgRGF0ZUFkYXB0ZXIuXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVja1xuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBvYmplY3QgaXMgYSBkYXRlIGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgaXNEYXRlSW5zdGFuY2Uob2JqOiBhbnkpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gZGF0ZSBpcyB2YWxpZC5cbiAgICogQHBhcmFtIGRhdGUgVGhlIGRhdGUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGRhdGUgaXMgdmFsaWQuXG4gICAqL1xuICBhYnN0cmFjdCBpc1ZhbGlkKGRhdGU6IEQpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBHZXRzIGRhdGUgaW5zdGFuY2UgdGhhdCBpcyBub3QgdmFsaWQuXG4gICAqIEByZXR1cm5zIEFuIGludmFsaWQgZGF0ZS5cbiAgICovXG4gIGFic3RyYWN0IGludmFsaWQoKTogRDtcblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gZGVzZXJpYWxpemUgYSB2YWx1ZSB0byBhIHZhbGlkIGRhdGUgb2JqZWN0LiBUaGlzIGlzIGRpZmZlcmVudCBmcm9tIHBhcnNpbmcgaW4gdGhhdFxuICAgKiBkZXNlcmlhbGl6ZSBzaG91bGQgb25seSBhY2NlcHQgbm9uLWFtYmlndW91cywgbG9jYWxlLWluZGVwZW5kZW50IGZvcm1hdHMgKGUuZy4gYSBJU08gODYwMVxuICAgKiBzdHJpbmcpLiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBhbGxvdyBhbnkgZGVzZXJpYWxpemF0aW9uLCBpdCBzaW1wbHkgY2hlY2tzIHRoYXRcbiAgICogdGhlIGdpdmVuIHZhbHVlIGlzIGFscmVhZHkgYSB2YWxpZCBkYXRlIG9iamVjdCBvciBudWxsLiBUaGUgYDxtYXQtZGF0ZXBpY2tlcj5gIHdpbGwgY2FsbCB0aGlzXG4gICAqIG1ldGhvZCBvbiBhbGwgb2YgaXRzIGBASW5wdXQoKWAgcHJvcGVydGllcyB0aGF0IGFjY2VwdCBkYXRlcy4gSXQgaXMgdGhlcmVmb3JlIHBvc3NpYmxlIHRvXG4gICAqIHN1cHBvcnQgcGFzc2luZyB2YWx1ZXMgZnJvbSB5b3VyIGJhY2tlbmQgZGlyZWN0bHkgdG8gdGhlc2UgcHJvcGVydGllcyBieSBvdmVycmlkaW5nIHRoaXMgbWV0aG9kXG4gICAqIHRvIGFsc28gZGVzZXJpYWxpemUgdGhlIGZvcm1hdCB1c2VkIGJ5IHlvdXIgYmFja2VuZC5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBiZSBkZXNlcmlhbGl6ZWQgaW50byBhIGRhdGUgb2JqZWN0LlxuICAgKiBAcmV0dXJucyBUaGUgZGVzZXJpYWxpemVkIGRhdGUgb2JqZWN0LCBlaXRoZXIgYSB2YWxpZCBkYXRlLCBudWxsIGlmIHRoZSB2YWx1ZSBjYW4gYmVcbiAgICogICAgIGRlc2VyaWFsaXplZCBpbnRvIGEgbnVsbCBkYXRlIChlLmcuIHRoZSBlbXB0eSBzdHJpbmcpLCBvciBhbiBpbnZhbGlkIGRhdGUuXG4gICAqL1xuICBkZXNlcmlhbGl6ZSh2YWx1ZTogYW55KTogRCB8IG51bGwge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHRoaXMuaXNEYXRlSW5zdGFuY2UodmFsdWUpICYmIHRoaXMuaXNWYWxpZCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxvY2FsZSB1c2VkIGZvciBhbGwgZGF0ZXMuXG4gICAqIEBwYXJhbSBsb2NhbGUgVGhlIG5ldyBsb2NhbGUuXG4gICAqL1xuICBzZXRMb2NhbGUobG9jYWxlOiBhbnkpIHtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgICB0aGlzLl9sb2NhbGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0d28gZGF0ZXMuXG4gICAqIEBwYXJhbSBmaXJzdCBUaGUgZmlyc3QgZGF0ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0gc2Vjb25kIFRoZSBzZWNvbmQgZGF0ZSB0byBjb21wYXJlLlxuICAgKiBAcmV0dXJucyAwIGlmIHRoZSBkYXRlcyBhcmUgZXF1YWwsIGEgbnVtYmVyIGxlc3MgdGhhbiAwIGlmIHRoZSBmaXJzdCBkYXRlIGlzIGVhcmxpZXIsXG4gICAqICAgICBhIG51bWJlciBncmVhdGVyIHRoYW4gMCBpZiB0aGUgZmlyc3QgZGF0ZSBpcyBsYXRlci5cbiAgICovXG4gIGNvbXBhcmVEYXRlKGZpcnN0OiBELCBzZWNvbmQ6IEQpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmdldFllYXIoZmlyc3QpIC0gdGhpcy5nZXRZZWFyKHNlY29uZCkgfHxcbiAgICAgICAgdGhpcy5nZXRNb250aChmaXJzdCkgLSB0aGlzLmdldE1vbnRoKHNlY29uZCkgfHxcbiAgICAgICAgdGhpcy5nZXREYXRlKGZpcnN0KSAtIHRoaXMuZ2V0RGF0ZShzZWNvbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0d28gZGF0ZXMgYXJlIGVxdWFsLlxuICAgKiBAcGFyYW0gZmlyc3QgVGhlIGZpcnN0IGRhdGUgdG8gY2hlY2suXG4gICAqIEBwYXJhbSBzZWNvbmQgVGhlIHNlY29uZCBkYXRlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSB0d28gZGF0ZXMgYXJlIGVxdWFsLlxuICAgKiAgICAgTnVsbCBkYXRlcyBhcmUgY29uc2lkZXJlZCBlcXVhbCB0byBvdGhlciBudWxsIGRhdGVzLlxuICAgKi9cbiAgc2FtZURhdGUoZmlyc3Q6IEQgfCBudWxsLCBzZWNvbmQ6IEQgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKGZpcnN0ICYmIHNlY29uZCkge1xuICAgICAgbGV0IGZpcnN0VmFsaWQgPSB0aGlzLmlzVmFsaWQoZmlyc3QpO1xuICAgICAgbGV0IHNlY29uZFZhbGlkID0gdGhpcy5pc1ZhbGlkKHNlY29uZCk7XG4gICAgICBpZiAoZmlyc3RWYWxpZCAmJiBzZWNvbmRWYWxpZCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY29tcGFyZURhdGUoZmlyc3QsIHNlY29uZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlyc3RWYWxpZCA9PSBzZWNvbmRWYWxpZDtcbiAgICB9XG4gICAgcmV0dXJuIGZpcnN0ID09IHNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGFtcCB0aGUgZ2l2ZW4gZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4IGRhdGVzLlxuICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB0byBjbGFtcC5cbiAgICogQHBhcmFtIG1pbiBUaGUgbWluaW11bSB2YWx1ZSB0byBhbGxvdy4gSWYgbnVsbCBvciBvbWl0dGVkIG5vIG1pbiBpcyBlbmZvcmNlZC5cbiAgICogQHBhcmFtIG1heCBUaGUgbWF4aW11bSB2YWx1ZSB0byBhbGxvdy4gSWYgbnVsbCBvciBvbWl0dGVkIG5vIG1heCBpcyBlbmZvcmNlZC5cbiAgICogQHJldHVybnMgYG1pbmAgaWYgYGRhdGVgIGlzIGxlc3MgdGhhbiBgbWluYCwgYG1heGAgaWYgZGF0ZSBpcyBncmVhdGVyIHRoYW4gYG1heGAsXG4gICAqICAgICBvdGhlcndpc2UgYGRhdGVgLlxuICAgKi9cbiAgY2xhbXBEYXRlKGRhdGU6IEQsIG1pbj86IEQgfCBudWxsLCBtYXg/OiBEIHwgbnVsbCk6IEQge1xuICAgIGlmIChtaW4gJiYgdGhpcy5jb21wYXJlRGF0ZShkYXRlLCBtaW4pIDwgMCkge1xuICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgaWYgKG1heCAmJiB0aGlzLmNvbXBhcmVEYXRlKGRhdGUsIG1heCkgPiAwKSB7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxufVxuIl19