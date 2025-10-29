import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatButtonToggleHarness extends ComponentHarness {
  static hostSelector = '.mat-button-toggle';
  _label = this.locatorFor('.mat-button-toggle-label-content');
  _button = this.locatorFor('.mat-button-toggle-button');
  static with(options = {}) {
    return new HarnessPredicate(MatButtonToggleHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name)).addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) === checked).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async isChecked() {
    const button = await this._button();
    const [checked, pressed] = await parallel(() => [button.getAttribute('aria-checked'), button.getAttribute('aria-pressed')]);
    return coerceBooleanProperty(checked) || coerceBooleanProperty(pressed);
  }
  async isDisabled() {
    const host = await this.host();
    return host.hasClass('mat-button-toggle-disabled');
  }
  async getName() {
    return (await this._button()).getAttribute('name');
  }
  async getAriaLabel() {
    return (await this._button()).getAttribute('aria-label');
  }
  async getAriaLabelledby() {
    return (await this._button()).getAttribute('aria-labelledby');
  }
  async getText() {
    return (await this._label()).text();
  }
  async getAppearance() {
    const host = await this.host();
    const className = 'mat-button-toggle-appearance-standard';
    return (await host.hasClass(className)) ? 'standard' : 'legacy';
  }
  async focus() {
    return (await this._button()).focus();
  }
  async blur() {
    return (await this._button()).blur();
  }
  async isFocused() {
    return (await this._button()).isFocused();
  }
  async toggle() {
    return (await this._button()).click();
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

class MatButtonToggleGroupHarness extends ComponentHarness {
  static hostSelector = '.mat-button-toggle-group';
  static with(options = {}) {
    return new HarnessPredicate(MatButtonToggleGroupHarness, options).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async getToggles(filter = {}) {
    return this.locatorForAll(MatButtonToggleHarness.with(filter))();
  }
  async isDisabled() {
    return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
  }
  async isVertical() {
    return (await this.host()).hasClass('mat-button-toggle-vertical');
  }
  async getAppearance() {
    const host = await this.host();
    const className = 'mat-button-toggle-group-appearance-standard';
    return (await host.hasClass(className)) ? 'standard' : 'legacy';
  }
}

export { MatButtonToggleGroupHarness, MatButtonToggleHarness };
//# sourceMappingURL=button-toggle-testing.mjs.map
