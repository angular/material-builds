import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatSortHeaderHarness extends ComponentHarness {
  static hostSelector = '.mat-sort-header';
  _container = this.locatorFor('.mat-sort-header-container');
  static with(options = {}) {
    return new HarnessPredicate(MatSortHeaderHarness, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label)).addOption('sortDirection', options.sortDirection, (harness, sortDirection) => {
      return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
    });
  }
  async getLabel() {
    return (await this._container()).text();
  }
  async getSortDirection() {
    const host = await this.host();
    const ariaSort = await host.getAttribute('aria-sort');
    if (ariaSort === 'ascending') {
      return 'asc';
    } else if (ariaSort === 'descending') {
      return 'desc';
    }
    return '';
  }
  async isActive() {
    return !!(await this.getSortDirection());
  }
  async isDisabled() {
    return (await this.host()).hasClass('mat-sort-header-disabled');
  }
  async click() {
    return (await this.host()).click();
  }
}

class MatSortHarness extends ComponentHarness {
  static hostSelector = '.mat-sort';
  static with(options = {}) {
    return new HarnessPredicate(MatSortHarness, options);
  }
  async getSortHeaders(filter = {}) {
    return this.locatorForAll(MatSortHeaderHarness.with(filter))();
  }
  async getActiveHeader() {
    const headers = await this.getSortHeaders();
    for (let i = 0; i < headers.length; i++) {
      if (await headers[i].isActive()) {
        return headers[i];
      }
    }
    return null;
  }
}

export { MatSortHarness, MatSortHeaderHarness };
//# sourceMappingURL=sort-testing.mjs.map
