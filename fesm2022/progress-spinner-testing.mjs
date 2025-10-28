import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatProgressSpinnerHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-progress-spinner';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async getValue() {
    const host = await this.host();
    const ariaValue = await host.getAttribute('aria-valuenow');
    return ariaValue ? coerceNumberProperty(ariaValue) : null;
  }
  async getMode() {
    const modeAttr = (await this.host()).getAttribute('mode');
    return await modeAttr;
  }
}

export { MatProgressSpinnerHarness };
//# sourceMappingURL=progress-spinner-testing.mjs.map
