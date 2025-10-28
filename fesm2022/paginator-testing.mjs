import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MatSelectHarness } from './select-testing.mjs';
import '@angular/material/core/testing';
import '@angular/material/form-field/testing/control';

class MatPaginatorHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-paginator';
  _nextButton = this.locatorFor('.mat-mdc-paginator-navigation-next');
  _previousButton = this.locatorFor('.mat-mdc-paginator-navigation-previous');
  _firstPageButton = this.locatorForOptional('.mat-mdc-paginator-navigation-first');
  _lastPageButton = this.locatorForOptional('.mat-mdc-paginator-navigation-last');
  _select = this.locatorForOptional(MatSelectHarness.with({
    ancestor: '.mat-mdc-paginator-page-size'
  }));
  _pageSizeFallback = this.locatorFor('.mat-mdc-paginator-page-size-value');
  _rangeLabel = this.locatorFor('.mat-mdc-paginator-range-label');
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async goToNextPage() {
    return (await this._nextButton()).click();
  }
  async isNextPageDisabled() {
    const disabledValue = await (await this._nextButton()).getAttribute('aria-disabled');
    return disabledValue == 'true';
  }
  async isPreviousPageDisabled() {
    const disabledValue = await (await this._previousButton()).getAttribute('aria-disabled');
    return disabledValue == 'true';
  }
  async goToPreviousPage() {
    return (await this._previousButton()).click();
  }
  async goToFirstPage() {
    const button = await this._firstPageButton();
    if (!button) {
      throw Error('Could not find first page button inside paginator. ' + 'Make sure that `showFirstLastButtons` is enabled.');
    }
    return button.click();
  }
  async goToLastPage() {
    const button = await this._lastPageButton();
    if (!button) {
      throw Error('Could not find last page button inside paginator. ' + 'Make sure that `showFirstLastButtons` is enabled.');
    }
    return button.click();
  }
  async setPageSize(size) {
    const select = await this._select();
    if (!select) {
      throw Error('Cannot find page size selector in paginator. ' + 'Make sure that the `pageSizeOptions` have been configured.');
    }
    return select.clickOptions({
      text: `${size}`
    });
  }
  async getPageSize() {
    const select = await this._select();
    const value = select ? select.getValueText() : (await this._pageSizeFallback()).text();
    return coerceNumberProperty(await value);
  }
  async getRangeLabel() {
    return (await this._rangeLabel()).text();
  }
}

export { MatPaginatorHarness };
//# sourceMappingURL=paginator-testing.mjs.map
