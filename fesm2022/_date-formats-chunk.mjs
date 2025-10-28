import { InjectionToken, inject, LOCALE_ID } from '@angular/core';
import { Subject } from 'rxjs';

const MAT_DATE_LOCALE = new InjectionToken('MAT_DATE_LOCALE', {
  providedIn: 'root',
  factory: () => inject(LOCALE_ID)
});
const NOT_IMPLEMENTED = 'Method not implemented';
class DateAdapter {
  locale;
  _localeChanges = new Subject();
  localeChanges = this._localeChanges;
  setTime(target, hours, minutes, seconds) {
    throw new Error(NOT_IMPLEMENTED);
  }
  getHours(date) {
    throw new Error(NOT_IMPLEMENTED);
  }
  getMinutes(date) {
    throw new Error(NOT_IMPLEMENTED);
  }
  getSeconds(date) {
    throw new Error(NOT_IMPLEMENTED);
  }
  parseTime(value, parseFormat) {
    throw new Error(NOT_IMPLEMENTED);
  }
  addSeconds(date, amount) {
    throw new Error(NOT_IMPLEMENTED);
  }
  getValidDateOrNull(obj) {
    return this.isDateInstance(obj) && this.isValid(obj) ? obj : null;
  }
  deserialize(value) {
    if (value == null || this.isDateInstance(value) && this.isValid(value)) {
      return value;
    }
    return this.invalid();
  }
  setLocale(locale) {
    this.locale = locale;
    this._localeChanges.next();
  }
  compareDate(first, second) {
    return this.getYear(first) - this.getYear(second) || this.getMonth(first) - this.getMonth(second) || this.getDate(first) - this.getDate(second);
  }
  compareTime(first, second) {
    return this.getHours(first) - this.getHours(second) || this.getMinutes(first) - this.getMinutes(second) || this.getSeconds(first) - this.getSeconds(second);
  }
  sameDate(first, second) {
    if (first && second) {
      let firstValid = this.isValid(first);
      let secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareDate(first, second);
      }
      return firstValid == secondValid;
    }
    return first == second;
  }
  sameTime(first, second) {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareTime(first, second);
      }
      return firstValid == secondValid;
    }
    return first == second;
  }
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

const MAT_DATE_FORMATS = new InjectionToken('mat-date-formats');

export { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE };
//# sourceMappingURL=_date-formats-chunk.mjs.map
