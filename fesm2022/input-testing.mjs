export { MatInputHarness } from './_input-harness-chunk.mjs';
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessBase } from './form-field-testing-control.mjs';
import '@angular/material/form-field/testing/control';
import '@angular/cdk/coercion';

class MatNativeOptionHarness extends ComponentHarness {
  static hostSelector = 'select[matNativeControl] option';
  static with(options = {}) {
    return new HarnessPredicate(MatNativeOptionHarness, options).addOption('text', options.text, async (harness, title) => HarnessPredicate.stringMatches(await harness.getText(), title)).addOption('index', options.index, async (harness, index) => (await harness.getIndex()) === index).addOption('isSelected', options.isSelected, async (harness, isSelected) => (await harness.isSelected()) === isSelected);
  }
  async getText() {
    return (await this.host()).getProperty('label');
  }
  async getIndex() {
    return (await this.host()).getProperty('index');
  }
  async isDisabled() {
    return (await this.host()).getProperty('disabled');
  }
  async isSelected() {
    return (await this.host()).getProperty('selected');
  }
}

class MatNativeSelectHarness extends MatFormFieldControlHarnessBase {
  static hostSelector = 'select[matNativeControl]';
  static with(options = {}) {
    return new HarnessPredicate(MatNativeSelectHarness, options).addOption('label', options.label, (harness, label) => {
      return HarnessPredicate.stringMatches(harness.getLabel(), label);
    });
  }
  async isDisabled() {
    return (await this.host()).getProperty('disabled');
  }
  async isRequired() {
    return (await this.host()).getProperty('required');
  }
  async isMultiple() {
    return (await this.host()).getProperty('multiple');
  }
  async getName() {
    return await (await this.host()).getProperty('name');
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
  async getOptions(filter = {}) {
    return this.locatorForAll(MatNativeOptionHarness.with(filter))();
  }
  async selectOptions(filter = {}) {
    const [isMultiple, options] = await parallel(() => {
      return [this.isMultiple(), this.getOptions(filter)];
    });
    if (options.length === 0) {
      throw Error('Select does not have options matching the specified filter');
    }
    const [host, optionIndexes] = await parallel(() => [this.host(), parallel(() => options.slice(0, isMultiple ? undefined : 1).map(option => option.getIndex()))]);
    await host.selectOptions(...optionIndexes);
  }
}

export { MatNativeOptionHarness, MatNativeSelectHarness };
//# sourceMappingURL=input-testing.mjs.map
