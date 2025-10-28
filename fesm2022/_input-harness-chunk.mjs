import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessBase } from '@angular/material/form-field/testing/control';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatInputHarness extends MatFormFieldControlHarnessBase {
  static hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';
  static with(options = {}) {
    return new HarnessPredicate(MatInputHarness, options).addOption('value', options.value, (harness, value) => {
      return HarnessPredicate.stringMatches(harness.getValue(), value);
    }).addOption('placeholder', options.placeholder, (harness, placeholder) => {
      return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
    }).addOption('label', options.label, (harness, label) => {
      return HarnessPredicate.stringMatches(harness.getLabel(), label);
    });
  }
  async isDisabled() {
    const host = await this.host();
    const disabled = await host.getAttribute('disabled');
    if (disabled !== null) {
      return coerceBooleanProperty(disabled);
    }
    return (await host.getAttribute('aria-disabled')) === 'true';
  }
  async isRequired() {
    return (await this.host()).getProperty('required');
  }
  async isReadonly() {
    return (await this.host()).getProperty('readOnly');
  }
  async getValue() {
    return await (await this.host()).getProperty('value');
  }
  async getName() {
    return await (await this.host()).getProperty('name');
  }
  async getType() {
    return await (await this.host()).getProperty('type');
  }
  async getPlaceholder() {
    const host = await this.host();
    const [nativePlaceholder, fallback] = await parallel(() => [host.getProperty('placeholder'), host.getAttribute('data-placeholder')]);
    return nativePlaceholder || fallback || '';
  }
  async getId() {
    return await (await this.host()).getProperty('id');
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
  async setValue(newValue) {
    const inputEl = await this.host();
    await inputEl.clear();
    if (newValue) {
      await inputEl.sendKeys(newValue);
    }
    await inputEl.setInputValue(newValue);
  }
}

export { MatInputHarness };
//# sourceMappingURL=_input-harness-chunk.mjs.map
