import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';

class MatBottomSheetHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-bottom-sheet-container:not([mat-exit])';
  static with(options = {}) {
    return new HarnessPredicate(MatBottomSheetHarness, options);
  }
  async getAriaLabel() {
    return (await this.host()).getAttribute('aria-label');
  }
  async dismiss() {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }
}

export { MatBottomSheetHarness };
//# sourceMappingURL=bottom-sheet-testing.mjs.map
