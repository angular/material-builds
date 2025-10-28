import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatBadgeHarness extends ComponentHarness {
  static hostSelector = '.mat-badge';
  static with(options = {}) {
    return new HarnessPredicate(MatBadgeHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
  }
  _badgeElement = this.locatorFor('.mat-badge-content');
  async getText() {
    return (await this._badgeElement()).text();
  }
  async isOverlapping() {
    return (await this.host()).hasClass('mat-badge-overlap');
  }
  async getPosition() {
    const host = await this.host();
    let result = '';
    if (await host.hasClass('mat-badge-above')) {
      result += 'above';
    } else if (await host.hasClass('mat-badge-below')) {
      result += 'below';
    }
    if (await host.hasClass('mat-badge-before')) {
      result += ' before';
    } else if (await host.hasClass('mat-badge-after')) {
      result += ' after';
    }
    return result.trim();
  }
  async getSize() {
    const host = await this.host();
    if (await host.hasClass('mat-badge-small')) {
      return 'small';
    } else if (await host.hasClass('mat-badge-large')) {
      return 'large';
    }
    return 'medium';
  }
  async isHidden() {
    return (await this.host()).hasClass('mat-badge-hidden');
  }
  async isDisabled() {
    return (await this.host()).hasClass('mat-badge-disabled');
  }
}

export { MatBadgeHarness };
//# sourceMappingURL=badge-testing.mjs.map
