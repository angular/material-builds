import { DatepickerTriggerHarnessBase } from './_date-range-input-harness-chunk.mjs';
export { CalendarView, MatCalendarCellHarness, MatCalendarHarness, MatDateRangeInputHarness, MatDatepickerInputHarness, MatEndDateHarness, MatStartDateHarness } from './_date-range-input-harness-chunk.mjs';
import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
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

class MatDatepickerActionsHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-datepicker-actions';
  _applyLocator = this.locatorForOptional('[matDatepickerApply], [matDateRangePickerApply]');
  _cancelLocator = this.locatorForOptional('[matDatepickerCancel], [matDateRangePickerCancel]');
  static with(options = {}) {
    return new HarnessPredicate(MatDatepickerActionsHarness, options);
  }
  apply() {
    return this._clickAction('apply', this._applyLocator);
  }
  cancel() {
    return this._clickAction('cancel', this._cancelLocator);
  }
  async _clickAction(name, locator) {
    const button = await locator();
    if (!button) {
      throw new Error(`MatDatepickerActions does not have ${name} button`);
    }
    await button.click();
  }
}

export { MatDatepickerActionsHarness, MatDatepickerToggleHarness };
//# sourceMappingURL=datepicker-testing.mjs.map
