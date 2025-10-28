import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatSlideToggleHarness extends ComponentHarness {
  _label = this.locatorFor('label');
  _nativeElement = this.locatorFor('button');
  static hostSelector = '.mat-mdc-slide-toggle';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label)).addOption('name', options.name, async (harness, name) => (await harness.getName()) === name).addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked).addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) == disabled);
  }
  async toggle() {
    return (await this._nativeElement()).click();
  }
  async isChecked() {
    const checked = (await this._nativeElement()).getAttribute('aria-checked');
    return coerceBooleanProperty(await checked);
  }
  async isDisabled() {
    const nativeElement = await this._nativeElement();
    const disabled = await nativeElement.getAttribute('disabled');
    if (disabled !== null) {
      return coerceBooleanProperty(disabled);
    }
    return (await nativeElement.getAttribute('aria-disabled')) === 'true';
  }
  async isRequired() {
    const ariaRequired = await (await this._nativeElement()).getAttribute('aria-required');
    return ariaRequired === 'true';
  }
  async isValid() {
    const invalid = (await this.host()).hasClass('ng-invalid');
    return !(await invalid);
  }
  async getName() {
    return (await this._nativeElement()).getAttribute('name');
  }
  async getAriaLabel() {
    return (await this._nativeElement()).getAttribute('aria-label');
  }
  async getAriaLabelledby() {
    return (await this._nativeElement()).getAttribute('aria-labelledby');
  }
  async getLabelText() {
    return (await this._label()).text();
  }
  async focus() {
    return (await this._nativeElement()).focus();
  }
  async blur() {
    return (await this._nativeElement()).blur();
  }
  async isFocused() {
    return (await this._nativeElement()).isFocused();
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

export { MatSlideToggleHarness };
//# sourceMappingURL=slide-toggle-testing.mjs.map
