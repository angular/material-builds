import { MatOptionHarness } from './_option-harness-chunk.mjs';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatOptgroupHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-optgroup';
  _label = this.locatorFor('.mat-mdc-optgroup-label');
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('labelText', options.labelText, async (harness, title) => HarnessPredicate.stringMatches(await harness.getLabelText(), title));
  }
  async getLabelText() {
    return (await this._label()).text();
  }
  async isDisabled() {
    return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
  }
  async getOptions(filter = {}) {
    return this.locatorForAll(MatOptionHarness.with(filter))();
  }
}

export { MatOptgroupHarness, MatOptionHarness };
//# sourceMappingURL=core-testing.mjs.map
