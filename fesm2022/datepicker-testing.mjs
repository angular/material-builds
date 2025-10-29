import { DatepickerTriggerHarnessBase } from './_date-range-input-harness-chunk.mjs';
export { CalendarView, MatCalendarCellHarness, MatCalendarHarness, MatDateRangeInputHarness, MatDatepickerInputHarness, MatEndDateHarness, MatStartDateHarness } from './_date-range-input-harness-chunk.mjs';
import { HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '@angular/material/form-field/testing/control';

class MatDatepickerToggleHarness extends DatepickerTriggerHarnessBase {
  static hostSelector = '.mat-datepicker-toggle';
  _button = this.locatorFor('button');
  static with(options = {}) {
    return new HarnessPredicate(MatDatepickerToggleHarness, options);
  }
  async isCalendarOpen() {
    return (await this.host()).hasClass('mat-datepicker-toggle-active');
  }
  async isDisabled() {
    const button = await this._button();
    return coerceBooleanProperty(await button.getAttribute('disabled'));
  }
  async _openCalendar() {
    return (await this._button()).click();
  }
}

export { MatDatepickerToggleHarness };
//# sourceMappingURL=datepicker-testing.mjs.map
