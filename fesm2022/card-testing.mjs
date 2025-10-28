import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

var MatCardSection;
(function (MatCardSection) {
  MatCardSection["HEADER"] = ".mat-mdc-card-header";
  MatCardSection["CONTENT"] = ".mat-mdc-card-content";
  MatCardSection["ACTIONS"] = ".mat-mdc-card-actions";
  MatCardSection["FOOTER"] = ".mat-mdc-card-footer";
})(MatCardSection || (MatCardSection = {}));
class MatCardHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-card';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitleText(), title)).addOption('subtitle', options.subtitle, (harness, subtitle) => HarnessPredicate.stringMatches(harness.getSubtitleText(), subtitle));
  }
  _title = this.locatorForOptional('.mat-mdc-card-title');
  _subtitle = this.locatorForOptional('.mat-mdc-card-subtitle');
  async getText() {
    return (await this.host()).text();
  }
  async getTitleText() {
    return (await this._title())?.text() ?? '';
  }
  async getSubtitleText() {
    return (await this._subtitle())?.text() ?? '';
  }
}

export { MatCardHarness, MatCardSection };
//# sourceMappingURL=card-testing.mjs.map
