import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatOptionHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-option';
  _text = this.locatorFor('.mdc-list-item__primary-text');
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('text', options.text, async (harness, title) => HarnessPredicate.stringMatches(await harness.getText(), title)).addOption('isSelected', options.isSelected, async (harness, isSelected) => (await harness.isSelected()) === isSelected);
  }
  async click() {
    return (await this.host()).click();
  }
  async getText() {
    return (await this._text()).text();
  }
  async isDisabled() {
    return (await this.host()).hasClass('mdc-list-item--disabled');
  }
  async isSelected() {
    return (await this.host()).hasClass('mdc-list-item--selected');
  }
  async isActive() {
    return (await this.host()).hasClass('mat-mdc-option-active');
  }
  async isMultiple() {
    return (await this.host()).hasClass('mat-mdc-option-multiple');
  }
}

export { MatOptionHarness };
//# sourceMappingURL=_option-harness-chunk.mjs.map
