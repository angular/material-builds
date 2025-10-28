import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatCheckboxHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-checkbox';
  _input = this.locatorFor('input');
  _label = this.locatorFor('label');
  _inputContainer = this.locatorFor('.mdc-checkbox');
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label)).addOption('name', options.name, async (harness, name) => (await harness.getName()) === name).addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async isChecked() {
    const checked = (await this._input()).getProperty('checked');
    return coerceBooleanProperty(await checked);
  }
  async isIndeterminate() {
    const indeterminate = (await this._input()).getProperty('indeterminate');
    return coerceBooleanProperty(await indeterminate);
  }
  async isDisabled() {
    const input = await this._input();
    const disabled = await input.getAttribute('disabled');
    if (disabled !== null) {
      return coerceBooleanProperty(disabled);
    }
    return (await input.getAttribute('aria-disabled')) === 'true';
  }
  async isRequired() {
    const required = (await this._input()).getProperty('required');
    return coerceBooleanProperty(await required);
  }
  async isValid() {
    const invalid = (await this.host()).hasClass('ng-invalid');
    return !(await invalid);
  }
  async getName() {
    return (await this._input()).getAttribute('name');
  }
  async getValue() {
    return (await this._input()).getProperty('value');
  }
  async getAriaLabel() {
    return (await this._input()).getAttribute('aria-label');
  }
  async getAriaLabelledby() {
    return (await this._input()).getAttribute('aria-labelledby');
  }
  async getLabelText() {
    return (await this._label()).text();
  }
  async focus() {
    return (await this._input()).focus();
  }
  async blur() {
    return (await this._input()).blur();
  }
  async isFocused() {
    return (await this._input()).isFocused();
  }
  async toggle() {
    const elToClick = await ((await this.isDisabled()) ? this._inputContainer() : this._input());
    return elToClick.click();
  }
  async check() {
    if (!(await this.isChecked())) {
      await this.toggle();
    }
  }
  async uncheck() {
    if (await this.isChecked()) {
      await this.toggle();
    }
  }
}

export { MatCheckboxHarness };
//# sourceMappingURL=checkbox-testing.mjs.map
