export { MatFormFieldControlHarness } from './form-field-testing-control.mjs';
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatInputHarness } from './_input-harness-chunk.mjs';
import { MatSelectHarness } from './select-testing.mjs';
import { MatDatepickerInputHarness, MatDateRangeInputHarness } from './_date-range-input-harness-chunk.mjs';
import '@angular/material/form-field/testing/control';
import '@angular/cdk/coercion';
import '@angular/material/core/testing';

class MatErrorHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-form-field-error';
  static with(options = {}) {
    return MatErrorHarness._getErrorPredicate(this, options);
  }
  static _getErrorPredicate(type, options) {
    return new HarnessPredicate(type, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
  }
  async getText() {
    return (await this.host()).text();
  }
}

class MatFormFieldHarness extends ComponentHarness {
  _prefixContainer = this.locatorForOptional('.mat-mdc-form-field-text-prefix');
  _suffixContainer = this.locatorForOptional('.mat-mdc-form-field-text-suffix');
  _label = this.locatorForOptional('.mdc-floating-label');
  _hints = this.locatorForAll('.mat-mdc-form-field-hint');
  _inputControl = this.locatorForOptional(MatInputHarness);
  _selectControl = this.locatorForOptional(MatSelectHarness);
  _datepickerInputControl = this.locatorForOptional(MatDatepickerInputHarness);
  _dateRangeInputControl = this.locatorForOptional(MatDateRangeInputHarness);
  _textField = this.locatorFor('.mat-mdc-text-field-wrapper');
  _errorHarness = MatErrorHarness;
  static hostSelector = '.mat-mdc-form-field';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('floatingLabelText', options.floatingLabelText, async (harness, text) => HarnessPredicate.stringMatches(await harness.getLabel(), text)).addOption('hasErrors', options.hasErrors, async (harness, hasErrors) => (await harness.hasErrors()) === hasErrors).addOption('isValid', options.isValid, async (harness, isValid) => (await harness.isControlValid()) === isValid);
  }
  async getAppearance() {
    const textFieldEl = await this._textField();
    if (await textFieldEl.hasClass('mdc-text-field--outlined')) {
      return 'outline';
    }
    return 'fill';
  }
  async hasLabel() {
    return (await this._label()) !== null;
  }
  async isLabelFloating() {
    const labelEl = await this._label();
    return labelEl !== null ? await labelEl.hasClass('mdc-floating-label--float-above') : false;
  }
  async getLabel() {
    const labelEl = await this._label();
    return labelEl ? labelEl.text() : null;
  }
  async hasErrors() {
    return (await this.getTextErrors()).length > 0;
  }
  async isDisabled() {
    return (await this.host()).hasClass('mat-form-field-disabled');
  }
  async isAutofilled() {
    return (await this.host()).hasClass('mat-form-field-autofilled');
  }
  async getControl(type) {
    if (type) {
      return this.locatorForOptional(type)();
    }
    const [select, input, datepickerInput, dateRangeInput] = await parallel(() => [this._selectControl(), this._inputControl(), this._datepickerInputControl(), this._dateRangeInputControl()]);
    return datepickerInput || dateRangeInput || select || input;
  }
  async getThemeColor() {
    const hostEl = await this.host();
    const [isAccent, isWarn] = await parallel(() => {
      return [hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')];
    });
    if (isAccent) {
      return 'accent';
    } else if (isWarn) {
      return 'warn';
    }
    return 'primary';
  }
  async getTextErrors() {
    const errors = await this.getErrors();
    return parallel(() => errors.map(e => e.getText()));
  }
  async getErrors(filter = {}) {
    return this.locatorForAll(this._errorHarness.with(filter))();
  }
  async getTextHints() {
    const hints = await this._hints();
    return parallel(() => hints.map(e => e.text()));
  }
  async getPrefixText() {
    const prefix = await this._prefixContainer();
    return prefix ? prefix.text() : '';
  }
  async getSuffixText() {
    const suffix = await this._suffixContainer();
    return suffix ? suffix.text() : '';
  }
  async isControlTouched() {
    if (!(await this._hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-touched');
  }
  async isControlDirty() {
    if (!(await this._hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-dirty');
  }
  async isControlValid() {
    if (!(await this._hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-valid');
  }
  async isControlPending() {
    if (!(await this._hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-pending');
  }
  async _hasFormControl() {
    const hostEl = await this.host();
    const [isTouched, isUntouched] = await parallel(() => [hostEl.hasClass('ng-touched'), hostEl.hasClass('ng-untouched')]);
    return isTouched || isUntouched;
  }
}

export { MatErrorHarness, MatFormFieldHarness };
//# sourceMappingURL=form-field-testing.mjs.map
