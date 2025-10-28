import { HarnessPredicate, ComponentHarness, parallel, TestKey } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessBase } from '@angular/material/form-field/testing/control';

function getInputPredicate(type, options) {
  return new HarnessPredicate(type, options).addOption('value', options.value, (harness, value) => {
    return HarnessPredicate.stringMatches(harness.getValue(), value);
  }).addOption('placeholder', options.placeholder, (harness, placeholder) => {
    return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
  }).addOption('label', options.label, (harness, label) => {
    return HarnessPredicate.stringMatches(harness.getLabel(), label);
  });
}
class MatDatepickerInputHarnessBase extends MatFormFieldControlHarnessBase {
  async isDisabled() {
    return (await this.host()).getProperty('disabled');
  }
  async isRequired() {
    return (await this.host()).getProperty('required');
  }
  async getValue() {
    return await (await this.host()).getProperty('value');
  }
  async setValue(newValue) {
    const inputEl = await this.host();
    await inputEl.clear();
    if (newValue) {
      await inputEl.sendKeys(newValue);
    }
    await inputEl.dispatchEvent('change');
  }
  async getPlaceholder() {
    return await (await this.host()).getProperty('placeholder');
  }
  async focus() {
    return (await this.host()).focus();
  }
  async blur() {
    return (await this.host()).blur();
  }
  async isFocused() {
    return (await this.host()).isFocused();
  }
  async getMin() {
    return (await this.host()).getAttribute('min');
  }
  async getMax() {
    return (await this.host()).getAttribute('max');
  }
}

class MatCalendarCellHarness extends ComponentHarness {
  static hostSelector = '.mat-calendar-body-cell';
  _content = this.locatorFor('.mat-calendar-body-cell-content');
  static with(options = {}) {
    return new HarnessPredicate(MatCalendarCellHarness, options).addOption('text', options.text, (harness, text) => {
      return HarnessPredicate.stringMatches(harness.getText(), text);
    }).addOption('selected', options.selected, async (harness, selected) => {
      return (await harness.isSelected()) === selected;
    }).addOption('active', options.active, async (harness, active) => {
      return (await harness.isActive()) === active;
    }).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    }).addOption('today', options.today, async (harness, today) => {
      return (await harness.isToday()) === today;
    }).addOption('inRange', options.inRange, async (harness, inRange) => {
      return (await harness.isInRange()) === inRange;
    }).addOption('inComparisonRange', options.inComparisonRange, async (harness, inComparisonRange) => {
      return (await harness.isInComparisonRange()) === inComparisonRange;
    }).addOption('inPreviewRange', options.inPreviewRange, async (harness, inPreviewRange) => {
      return (await harness.isInPreviewRange()) === inPreviewRange;
    });
  }
  async getText() {
    return (await this._content()).text();
  }
  async getAriaLabel() {
    return (await this.host()).getAttribute('aria-label');
  }
  async isSelected() {
    const host = await this.host();
    return (await host.getAttribute('aria-pressed')) === 'true';
  }
  async isDisabled() {
    return this._hasState('disabled');
  }
  async isActive() {
    return this._hasState('active');
  }
  async isToday() {
    return (await this._content()).hasClass('mat-calendar-body-today');
  }
  async select() {
    return (await this.host()).click();
  }
  async hover() {
    return (await this.host()).hover();
  }
  async mouseAway() {
    return (await this.host()).mouseAway();
  }
  async focus() {
    return (await this.host()).focus();
  }
  async blur() {
    return (await this.host()).blur();
  }
  async isRangeStart() {
    return this._hasState('range-start');
  }
  async isRangeEnd() {
    return this._hasState('range-end');
  }
  async isInRange() {
    return this._hasState('in-range');
  }
  async isComparisonRangeStart() {
    return this._hasState('comparison-start');
  }
  async isComparisonRangeEnd() {
    return this._hasState('comparison-end');
  }
  async isInComparisonRange() {
    return this._hasState('in-comparison-range');
  }
  async isPreviewRangeStart() {
    return this._hasState('preview-start');
  }
  async isPreviewRangeEnd() {
    return this._hasState('preview-end');
  }
  async isInPreviewRange() {
    return this._hasState('in-preview');
  }
  async _hasState(name) {
    return (await this.host()).hasClass(`mat-calendar-body-${name}`);
  }
}

var CalendarView;
(function (CalendarView) {
  CalendarView[CalendarView["MONTH"] = 0] = "MONTH";
  CalendarView[CalendarView["YEAR"] = 1] = "YEAR";
  CalendarView[CalendarView["MULTI_YEAR"] = 2] = "MULTI_YEAR";
})(CalendarView || (CalendarView = {}));
class MatCalendarHarness extends ComponentHarness {
  static hostSelector = '.mat-calendar';
  _periodButton = this.locatorFor('.mat-calendar-period-button');
  static with(options = {}) {
    return new HarnessPredicate(MatCalendarHarness, options);
  }
  async getCells(filter = {}) {
    return this.locatorForAll(MatCalendarCellHarness.with(filter))();
  }
  async getCurrentView() {
    if (await this.locatorForOptional('mat-multi-year-view')()) {
      return CalendarView.MULTI_YEAR;
    }
    if (await this.locatorForOptional('mat-year-view')()) {
      return CalendarView.YEAR;
    }
    return CalendarView.MONTH;
  }
  async getCurrentViewLabel() {
    return (await this._periodButton()).text();
  }
  async changeView() {
    return (await this._periodButton()).click();
  }
  async next() {
    return (await this.locatorFor('.mat-calendar-next-button')()).click();
  }
  async previous() {
    return (await this.locatorFor('.mat-calendar-previous-button')()).click();
  }
  async selectCell(filter = {}) {
    const cells = await this.getCells(filter);
    if (!cells.length) {
      throw Error(`Cannot find calendar cell matching filter ${JSON.stringify(filter)}`);
    }
    await cells[0].select();
  }
}

class DatepickerTriggerHarnessBase extends ComponentHarness {
  async openCalendar() {
    const [isDisabled, hasCalendar] = await parallel(() => [this.isDisabled(), this.hasCalendar()]);
    if (!isDisabled && hasCalendar) {
      return this._openCalendar();
    }
  }
  async closeCalendar() {
    if (await this.isCalendarOpen()) {
      await closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
      await this.forceStabilize();
    }
  }
  async hasCalendar() {
    return (await getCalendarId(this.host())) != null;
  }
  async getCalendar(filter = {}) {
    return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
  }
}
async function getCalendarId(host) {
  return (await host).getAttribute('data-mat-calendar');
}
async function closeCalendar(calendarId, documentLocator) {
  const backdropSelector = `.${await calendarId}-backdrop`;
  return (await documentLocator.locatorFor(backdropSelector)()).click();
}
async function getCalendar(filter, host, documentLocator) {
  const calendarId = await getCalendarId(host);
  if (!calendarId) {
    throw Error(`Element is not associated with a calendar`);
  }
  return documentLocator.locatorFor(MatCalendarHarness.with({
    ...filter,
    selector: `#${calendarId}`
  }))();
}

class MatDatepickerInputHarness extends MatDatepickerInputHarnessBase {
  static hostSelector = '.mat-datepicker-input';
  static with(options = {}) {
    return getInputPredicate(MatDatepickerInputHarness, options);
  }
  async isCalendarOpen() {
    const host = await this.host();
    return (await host.getAttribute('aria-owns')) != null;
  }
  async openCalendar() {
    const [isDisabled, hasCalendar] = await parallel(() => [this.isDisabled(), this.hasCalendar()]);
    if (!isDisabled && hasCalendar) {
      const host = await this.host();
      return host.sendKeys({
        alt: true
      }, TestKey.DOWN_ARROW);
    }
  }
  async closeCalendar() {
    if (await this.isCalendarOpen()) {
      await closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
      await this.forceStabilize();
    }
  }
  async hasCalendar() {
    return (await getCalendarId(this.host())) != null;
  }
  async getCalendar(filter = {}) {
    return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
  }
}

class MatStartDateHarness extends MatDatepickerInputHarnessBase {
  static hostSelector = '.mat-start-date';
  static with(options = {}) {
    return getInputPredicate(MatStartDateHarness, options);
  }
}
class MatEndDateHarness extends MatDatepickerInputHarnessBase {
  static hostSelector = '.mat-end-date';
  static with(options = {}) {
    return getInputPredicate(MatEndDateHarness, options);
  }
}
class MatDateRangeInputHarness extends DatepickerTriggerHarnessBase {
  static hostSelector = '.mat-date-range-input';
  static with(options = {}) {
    return new HarnessPredicate(MatDateRangeInputHarness, options).addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value)).addOption('label', options.label, (harness, label) => {
      return HarnessPredicate.stringMatches(harness.getLabel(), label);
    });
  }
  async getValue() {
    const [start, end, separator] = await parallel(() => [this.getStartInput().then(input => input.getValue()), this.getEndInput().then(input => input.getValue()), this.getSeparator()]);
    return start + `${end ? ` ${separator} ${end}` : ''}`;
  }
  async getStartInput() {
    return this.locatorFor(MatStartDateHarness)();
  }
  async getEndInput() {
    return this.locatorFor(MatEndDateHarness)();
  }
  async getLabel() {
    const documentRootLocator = this.documentRootLocatorFactory();
    const labelId = await (await this.host()).getAttribute('aria-labelledby');
    const labelText = await (await this.host()).getAttribute('aria-label');
    const hostId = await (await this.host()).getAttribute('id');
    if (labelId) {
      const labelEl = await documentRootLocator.locatorForOptional(`[id="${labelId}"]`)();
      return labelEl ? labelEl.text() : null;
    } else if (labelText) {
      return labelText;
    } else if (hostId) {
      const labelEl = await documentRootLocator.locatorForOptional(`[for="${hostId}"]`)();
      return labelEl ? labelEl.text() : null;
    }
    return null;
  }
  async getSeparator() {
    return (await this.locatorFor('.mat-date-range-input-separator')()).text();
  }
  async isDisabled() {
    const [startDisabled, endDisabled] = await parallel(() => [this.getStartInput().then(input => input.isDisabled()), this.getEndInput().then(input => input.isDisabled())]);
    return startDisabled && endDisabled;
  }
  async isRequired() {
    return (await this.host()).hasClass('mat-date-range-input-required');
  }
  async isCalendarOpen() {
    const startHost = await (await this.getStartInput()).host();
    return (await startHost.getAttribute('aria-owns')) != null;
  }
  async _openCalendar() {
    const startHost = await (await this.getStartInput()).host();
    return startHost.sendKeys({
      alt: true
    }, TestKey.DOWN_ARROW);
  }
}

export { CalendarView, DatepickerTriggerHarnessBase, MatCalendarCellHarness, MatCalendarHarness, MatDateRangeInputHarness, MatDatepickerInputHarness, MatEndDateHarness, MatStartDateHarness };
//# sourceMappingURL=_date-range-input-harness-chunk.mjs.map
