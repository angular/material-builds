import { booleanAttribute } from '@angular/core';
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

class MatButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = `.mat-mdc-button-base, [matButton], [mat-button], [matIconButton],
    [matFab], [matMiniFab], [mat-raised-button], [mat-flat-button], [mat-icon-button],
    [mat-stroked-button], [mat-fab], [mat-mini-fab]`;
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('variant', options.variant, (harness, variant) => HarnessPredicate.stringMatches(harness.getVariant(), variant)).addOption('appearance', options.appearance, (harness, appearance) => HarnessPredicate.stringMatches(harness.getAppearance(), appearance)).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    }).addOption('buttonType', options.buttonType, (harness, buttonType) => HarnessPredicate.stringMatches(harness.getType(), buttonType)).addOption('iconName', options.iconName, async (harness, iconName) => {
      const result = await harness.locatorForOptional(MatIconHarness.with({
        name: iconName
      }))();
      return result !== null;
    });
  }
  async click(...args) {
    return (await this.host()).click(...args);
  }
  async isDisabled() {
    const host = await this.host();
    return booleanAttribute(await host.getAttribute('disabled')) || (await host.hasClass('mat-mdc-button-disabled'));
  }
  async getText() {
    return (await this.host()).text();
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
  async getVariant() {
    const host = await this.host();
    if ((await host.hasClass('mat-mdc-icon-button')) || (await host.getAttribute('mat-icon-button')) != null) {
      return 'icon';
    }
    if ((await host.hasClass('mat-mdc-mini-fab')) || (await host.getAttribute('mat-mini-fab')) != null) {
      return 'mini-fab';
    }
    if ((await host.hasClass('mat-mdc-fab')) || (await host.getAttribute('mat-fab')) != null) {
      return 'fab';
    }
    return 'basic';
  }
  async getAppearance() {
    const host = await this.host();
    if (await host.hasClass('mat-mdc-outlined-button')) {
      return 'outlined';
    }
    if (await host.hasClass('mat-mdc-raised-button')) {
      return 'elevated';
    }
    if (await host.hasClass('mat-mdc-unelevated-button')) {
      return 'filled';
    }
    if (await host.hasClass('mat-mdc-button')) {
      return 'text';
    }
    if (await host.hasClass('mat-tonal-button')) {
      return 'tonal';
    }
    return null;
  }
  async getType() {
    const host = await this.host();
    const buttonType = await host.getAttribute('type');
    if (buttonType === 'button' || buttonType === 'submit' || buttonType === 'reset') {
      return buttonType;
    }
    return null;
  }
}

export { MatButtonHarness };
//# sourceMappingURL=button-testing.mjs.map
