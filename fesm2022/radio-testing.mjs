import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatRadioGroupHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-radio-group';
  _buttonClass = MatRadioButtonHarness;
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('name', options.name, MatRadioGroupHarness._checkRadioGroupName);
  }
  async getName() {
    const hostName = await this._getGroupNameFromHost();
    if (hostName !== null) {
      return hostName;
    }
    const radioNames = await this._getNamesFromRadioButtons();
    if (!radioNames.length) {
      return null;
    }
    if (!this._checkRadioNamesInGroupEqual(radioNames)) {
      throw Error('Radio buttons in radio-group have mismatching names.');
    }
    return radioNames[0];
  }
  async getId() {
    return (await this.host()).getProperty('id');
  }
  async getCheckedRadioButton() {
    for (let radioButton of await this.getRadioButtons()) {
      if (await radioButton.isChecked()) {
        return radioButton;
      }
    }
    return null;
  }
  async getCheckedValue() {
    const checkedRadio = await this.getCheckedRadioButton();
    if (!checkedRadio) {
      return null;
    }
    return checkedRadio.getValue();
  }
  async getRadioButtons(filter) {
    return this.locatorForAll(this._buttonClass.with(filter))();
  }
  async checkRadioButton(filter) {
    const radioButtons = await this.getRadioButtons(filter);
    if (!radioButtons.length) {
      throw Error(`Could not find radio button matching ${JSON.stringify(filter)}`);
    }
    return radioButtons[0].check();
  }
  async _getGroupNameFromHost() {
    return (await this.host()).getAttribute('name');
  }
  async _getNamesFromRadioButtons() {
    const groupNames = [];
    for (let radio of await this.getRadioButtons()) {
      const radioName = await radio.getName();
      if (radioName !== null) {
        groupNames.push(radioName);
      }
    }
    return groupNames;
  }
  _checkRadioNamesInGroupEqual(radioNames) {
    let groupName = null;
    for (let radioName of radioNames) {
      if (groupName === null) {
        groupName = radioName;
      } else if (groupName !== radioName) {
        return false;
      }
    }
    return true;
  }
  static async _checkRadioGroupName(harness, name) {
    if ((await harness._getGroupNameFromHost()) === name) {
      return true;
    }
    const radioNames = await harness._getNamesFromRadioButtons();
    if (radioNames.indexOf(name) === -1) {
      return false;
    }
    if (!harness._checkRadioNamesInGroupEqual(radioNames)) {
      throw Error(`The locator found a radio-group with name "${name}", but some ` + `radio-button's within the group have mismatching names, which is invalid.`);
    }
    return true;
  }
}
class MatRadioButtonHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-radio-button';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label)).addOption('name', options.name, async (harness, name) => (await harness.getName()) === name).addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked);
  }
  _textLabel = this.locatorFor('label');
  _clickLabel = this._textLabel;
  _input = this.locatorFor('input');
  async isChecked() {
    const checked = (await this._input()).getProperty('checked');
    return coerceBooleanProperty(await checked);
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
    const required = (await this._input()).getAttribute('required');
    return coerceBooleanProperty(await required);
  }
  async getName() {
    return (await this._input()).getAttribute('name');
  }
  async getId() {
    return (await this.host()).getProperty('id');
  }
  async getValue() {
    return (await this._input()).getProperty('value');
  }
  async getLabelText() {
    return (await this._textLabel()).text();
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
  async check() {
    if (!(await this.isChecked())) {
      return (await this._clickLabel()).click();
    }
  }
}

export { MatRadioButtonHarness, MatRadioGroupHarness };
//# sourceMappingURL=radio-testing.mjs.map
