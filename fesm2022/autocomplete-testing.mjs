import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptionHarness } from './_option-harness-chunk.mjs';
import { MatOptgroupHarness } from './core-testing.mjs';

class MatAutocompleteHarness extends ComponentHarness {
  _documentRootLocator = this.documentRootLocatorFactory();
  static hostSelector = '.mat-mdc-autocomplete-trigger';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value)).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async getValue() {
    return (await this.host()).getProperty('value');
  }
  async isDisabled() {
    const disabled = (await this.host()).getAttribute('disabled');
    return coerceBooleanProperty(await disabled);
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
  async enterText(value) {
    return (await this.host()).sendKeys(value);
  }
  async clear() {
    return (await this.host()).clear();
  }
  async getOptions(filters) {
    if (!(await this.isOpen())) {
      throw new Error('Unable to retrieve options for autocomplete. Autocomplete panel is closed.');
    }
    return this._documentRootLocator.locatorForAll(MatOptionHarness.with({
      ...(filters || {}),
      ancestor: await this._getPanelSelector()
    }))();
  }
  async getOptionGroups(filters) {
    if (!(await this.isOpen())) {
      throw new Error('Unable to retrieve option groups for autocomplete. Autocomplete panel is closed.');
    }
    return this._documentRootLocator.locatorForAll(MatOptgroupHarness.with({
      ...(filters || {}),
      ancestor: await this._getPanelSelector()
    }))();
  }
  async selectOption(filters) {
    await this.focus();
    const options = await this.getOptions(filters);
    if (!options.length) {
      throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
    }
    await options[0].click();
  }
  async isOpen() {
    const panel = await this._getPanel();
    return !!panel && (await panel.hasClass(`mat-mdc-autocomplete-visible`));
  }
  async _getPanel() {
    return this._documentRootLocator.locatorForOptional(await this._getPanelSelector())();
  }
  async _getPanelSelector() {
    return `#${await (await this.host()).getAttribute('aria-controls')}`;
  }
}

export { MatAutocompleteHarness };
//# sourceMappingURL=autocomplete-testing.mjs.map
