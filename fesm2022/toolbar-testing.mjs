import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';

var MatToolbarSection;
(function (MatToolbarSection) {
  MatToolbarSection["ROW"] = ".mat-toolbar-row";
})(MatToolbarSection || (MatToolbarSection = {}));
class MatToolbarHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-toolbar';
  _getRows = this.locatorForAll(MatToolbarSection.ROW);
  static with(options = {}) {
    return new HarnessPredicate(MatToolbarHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness._getText(), text));
  }
  async hasMultipleRows() {
    return (await this.host()).hasClass('mat-toolbar-multiple-rows');
  }
  async _getText() {
    return (await this.host()).text();
  }
  async getRowsAsText() {
    const rows = await this._getRows();
    return parallel(() => rows.length ? rows.map(r => r.text()) : [this._getText()]);
  }
}

export { MatToolbarHarness, MatToolbarSection };
//# sourceMappingURL=toolbar-testing.mjs.map
