import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatOptionHarness, MatOptgroupHarness } from '@angular/material/core/testing';
import { MatFormFieldControlHarnessBase } from '@angular/material/form-field/testing/control';

class MatSelectHarness extends MatFormFieldControlHarnessBase {
  static hostSelector = '.mat-mdc-select';
  _prefix = 'mat-mdc';
  _optionClass = MatOptionHarness;
  _optionGroupClass = MatOptgroupHarness;
  _documentRootLocator = this.documentRootLocatorFactory();
  _backdrop = this._documentRootLocator.locatorFor('.cdk-overlay-backdrop');
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    }).addOption('label', options.label, (harness, label) => {
      return HarnessPredicate.stringMatches(harness.getLabel(), label);
    });
  }
  async isDisabled() {
    return (await this.host()).hasClass(`${this._prefix}-select-disabled`);
  }
  async isValid() {
    return !(await (await this.host()).hasClass('ng-invalid'));
  }
  async isRequired() {
    return (await this.host()).hasClass(`${this._prefix}-select-required`);
  }
  async isEmpty() {
    return (await this.host()).hasClass(`${this._prefix}-select-empty`);
  }
  async isMultiple() {
    return (await this.host()).hasClass(`${this._prefix}-select-multiple`);
  }
  async getValueText() {
    const value = await this.locatorFor(`.${this._prefix}-select-value`)();
    return value.text();
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
  async getOptions(filter) {
    return this._documentRootLocator.locatorForAll(this._optionClass.with({
      ...(filter || {}),
      ancestor: await this._getPanelSelector()
    }))();
  }
  async getOptionGroups(filter) {
    return this._documentRootLocator.locatorForAll(this._optionGroupClass.with({
      ...(filter || {}),
      ancestor: await this._getPanelSelector()
    }))();
  }
  async isOpen() {
    return !!(await this._documentRootLocator.locatorForOptional(await this._getPanelSelector())());
  }
  async open() {
    if (!(await this.isOpen())) {
      const trigger = await this.locatorFor(`.${this._prefix}-select-trigger`)();
      return trigger.click();
    }
  }
  async clickOptions(filter) {
    await this.open();
    const [isMultiple, options] = await parallel(() => [this.isMultiple(), this.getOptions(filter)]);
    if (options.length === 0) {
      throw Error('Select does not have options matching the specified filter');
    }
    if (isMultiple) {
      await parallel(() => options.map(option => option.click()));
    } else {
      await options[0].click();
    }
  }
  async close() {
    if (await this.isOpen()) {
      return (await this._backdrop()).click();
    }
  }
  async _getPanelSelector() {
    const id = await (await this.host()).getAttribute('id');
    return `#${id}-panel`;
  }
}

export { MatSelectHarness };
//# sourceMappingURL=select-testing.mjs.map
