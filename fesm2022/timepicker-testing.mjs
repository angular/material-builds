import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import { MatOptionHarness } from './_option-harness-chunk.mjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatTimepickerHarness extends ComponentHarness {
  _documentRootLocator = this.documentRootLocatorFactory();
  static hostSelector = 'mat-timepicker';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async isOpen() {
    const selector = await this._getPanelSelector();
    const panel = await this._documentRootLocator.locatorForOptional(selector)();
    return panel !== null;
  }
  async getOptions(filters) {
    if (!(await this.isOpen())) {
      throw new Error('Unable to retrieve options for timepicker. Timepicker panel is closed.');
    }
    return this._documentRootLocator.locatorForAll(MatOptionHarness.with({
      ...(filters || {}),
      ancestor: await this._getPanelSelector()
    }))();
  }
  async selectOption(filters) {
    const options = await this.getOptions(filters);
    if (!options.length) {
      throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
    }
    await options[0].click();
  }
  async _getPanelSelector() {
    return `#${await (await this.host()).getAttribute('mat-timepicker-panel-id')}`;
  }
}

class MatTimepickerInputHarness extends ComponentHarness {
  _documentRootLocator = this.documentRootLocatorFactory();
  static hostSelector = '.mat-timepicker-input';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('value', options.value, (harness, value) => {
      return HarnessPredicate.stringMatches(harness.getValue(), value);
    }).addOption('placeholder', options.placeholder, (harness, placeholder) => {
      return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
    });
  }
  async isTimepickerOpen() {
    const host = await this.host();
    return (await host.getAttribute('aria-expanded')) === 'true';
  }
  async openTimepicker() {
    if (!(await this.isDisabled())) {
      const host = await this.host();
      await host.sendKeys(TestKey.DOWN_ARROW);
    }
    return this.getTimepicker();
  }
  async closeTimepicker() {
    await this._documentRootLocator.rootElement.click();
    await this.forceStabilize();
  }
  async getTimepicker(filter = {}) {
    const host = await this.host();
    const timepickerId = await host.getAttribute('mat-timepicker-id');
    if (!timepickerId) {
      throw Error('Element is not associated with a timepicker');
    }
    return this._documentRootLocator.locatorFor(MatTimepickerHarness.with({
      ...filter,
      selector: `[mat-timepicker-panel-id="${timepickerId}"]`
    }))();
  }
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
}

class MatTimepickerToggleHarness extends ComponentHarness {
  static hostSelector = '.mat-timepicker-toggle';
  _button = this.locatorFor('button');
  static with(options = {}) {
    return new HarnessPredicate(MatTimepickerToggleHarness, options);
  }
  async openTimepicker() {
    const isOpen = await this.isTimepickerOpen();
    if (!isOpen) {
      const button = await this._button();
      await button.click();
    }
  }
  async isTimepickerOpen() {
    const button = await this._button();
    const ariaExpanded = await button.getAttribute('aria-expanded');
    return ariaExpanded === 'true';
  }
  async isDisabled() {
    const button = await this._button();
    return coerceBooleanProperty(await button.getAttribute('disabled'));
  }
}

export { MatTimepickerHarness, MatTimepickerInputHarness, MatTimepickerToggleHarness };
//# sourceMappingURL=timepicker-testing.mjs.map
