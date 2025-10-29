import { ComponentHarness, HarnessPredicate, ContentContainerComponentHarness, TestKey, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatChipAvatarHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-avatar';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
}

class MatChipEditHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-edit';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async click() {
    return (await this.host()).click();
  }
}

class MatChipRemoveHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-remove';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async click() {
    return (await this.host()).click();
  }
}

class MatChipHarness extends ContentContainerComponentHarness {
  _primaryAction = this.locatorFor('.mdc-evolution-chip__action--primary');
  static hostSelector = '.mat-mdc-basic-chip, .mat-mdc-chip';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('text', options.text, (harness, label) => {
      return HarnessPredicate.stringMatches(harness.getText(), label);
    }).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async getText() {
    return (await this.host()).text({
      exclude: '.mat-mdc-chip-avatar, .mat-mdc-chip-trailing-icon, .mat-icon'
    });
  }
  async isDisabled() {
    return (await this.host()).hasClass('mat-mdc-chip-disabled');
  }
  async remove() {
    const hostEl = await this.host();
    await hostEl.sendKeys(TestKey.DELETE);
  }
  async geEditButton(filter = {}) {
    return this.locatorFor(MatChipEditHarness.with(filter))();
  }
  async getRemoveButton(filter = {}) {
    return this.locatorFor(MatChipRemoveHarness.with(filter))();
  }
  async getAvatar(filter = {}) {
    return this.locatorForOptional(MatChipAvatarHarness.with(filter))();
  }
}

class MatChipInputHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-input';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('value', options.value, async (harness, value) => {
      return (await harness.getValue()) === value;
    }).addOption('placeholder', options.placeholder, async (harness, placeholder) => {
      return (await harness.getPlaceholder()) === placeholder;
    }).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
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
  async getValue() {
    return await (await this.host()).getProperty('value');
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
  async setValue(newValue) {
    const inputEl = await this.host();
    await inputEl.clear();
    if (newValue) {
      await inputEl.sendKeys(newValue);
    }
  }
  async sendSeparatorKey(key) {
    const inputEl = await this.host();
    return inputEl.sendKeys(key);
  }
}

class MatChipOptionHarness extends MatChipHarness {
  static hostSelector = '.mat-mdc-chip-option';
  static with(options = {}) {
    return new HarnessPredicate(MatChipOptionHarness, options).addOption('text', options.text, (harness, label) => HarnessPredicate.stringMatches(harness.getText(), label)).addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
  }
  async isSelected() {
    return (await this.host()).hasClass('mat-mdc-chip-selected');
  }
  async select() {
    if (!(await this.isSelected())) {
      await this.toggle();
    }
  }
  async deselect() {
    if (await this.isSelected()) {
      await this.toggle();
    }
  }
  async toggle() {
    return (await this._primaryAction()).click();
  }
}

class MatChipListboxHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-listbox';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async isDisabled() {
    return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
  }
  async isRequired() {
    return (await (await this.host()).getAttribute('aria-required')) === 'true';
  }
  async isMultiple() {
    return (await (await this.host()).getAttribute('aria-multiselectable')) === 'true';
  }
  async getOrientation() {
    const orientation = await (await this.host()).getAttribute('aria-orientation');
    return orientation === 'vertical' ? 'vertical' : 'horizontal';
  }
  async getChips(filter = {}) {
    return this.locatorForAll(MatChipOptionHarness.with(filter))();
  }
  async selectChips(filter = {}) {
    const chips = await this.getChips(filter);
    if (!chips.length) {
      throw Error(`Cannot find chip matching filter ${JSON.stringify(filter)}`);
    }
    await parallel(() => chips.map(chip => chip.select()));
  }
}

class MatChipEditInputHarness extends ComponentHarness {
  static hostSelector = '.mat-chip-edit-input';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async setValue(value) {
    const host = await this.host();
    return host.setContenteditableValue(value);
  }
}

class MatChipRowHarness extends MatChipHarness {
  static hostSelector = '.mat-mdc-chip-row';
  async isEditable() {
    return (await this.host()).hasClass('mat-mdc-chip-editable');
  }
  async isEditing() {
    return (await this.host()).hasClass('mat-mdc-chip-editing');
  }
  async startEditing() {
    if (!(await this.isEditable())) {
      throw new Error('Cannot begin editing a chip that is not editable.');
    }
    return (await this.host()).dispatchEvent('dblclick');
  }
  async finishEditing() {
    if (await this.isEditing()) {
      await (await this.host()).sendKeys(TestKey.ENTER);
    }
  }
  async getEditInput(filter = {}) {
    return this.locatorFor(MatChipEditInputHarness.with(filter))();
  }
}

class MatChipGridHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-grid';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async isDisabled() {
    return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
  }
  async isRequired() {
    return await (await this.host()).hasClass('mat-mdc-chip-list-required');
  }
  async isInvalid() {
    return (await (await this.host()).getAttribute('aria-invalid')) === 'true';
  }
  getRows(filter = {}) {
    return this.locatorForAll(MatChipRowHarness.with(filter))();
  }
  getInput(filter = {}) {
    return this.locatorFor(MatChipInputHarness.with(filter))();
  }
}

class MatChipSetHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-chip-set';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async getChips(filter = {}) {
    return await this.locatorForAll(MatChipHarness.with(filter))();
  }
}

export { MatChipAvatarHarness, MatChipEditHarness, MatChipEditInputHarness, MatChipGridHarness, MatChipHarness, MatChipInputHarness, MatChipListboxHarness, MatChipOptionHarness, MatChipRemoveHarness, MatChipRowHarness, MatChipSetHarness };
//# sourceMappingURL=chips-testing.mjs.map
