import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatProgressBarHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-progress-bar';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async getValue() {
    const host = await this.host();
    const ariaValue = await host.getAttribute('aria-valuenow');
    return ariaValue ? coerceNumberProperty(ariaValue) : null;
  }
  async getMode() {
    return (await this.host()).getAttribute('mode');
  }
}

export { MatProgressBarHarness };
//# sourceMappingURL=progress-bar-testing.mjs.map
