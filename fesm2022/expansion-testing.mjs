import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

var MatExpansionPanelSection;
(function (MatExpansionPanelSection) {
  MatExpansionPanelSection["HEADER"] = ".mat-expansion-panel-header";
  MatExpansionPanelSection["TITLE"] = ".mat-expansion-panel-header-title";
  MatExpansionPanelSection["DESCRIPTION"] = ".mat-expansion-panel-header-description";
  MatExpansionPanelSection["CONTENT"] = ".mat-expansion-panel-content";
})(MatExpansionPanelSection || (MatExpansionPanelSection = {}));
class MatExpansionPanelHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-expansion-panel';
  _header = this.locatorFor(MatExpansionPanelSection.HEADER);
  _title = this.locatorForOptional(MatExpansionPanelSection.TITLE);
  _description = this.locatorForOptional(MatExpansionPanelSection.DESCRIPTION);
  _expansionIndicator = this.locatorForOptional('.mat-expansion-indicator');
  _content = this.locatorFor(MatExpansionPanelSection.CONTENT);
  static with(options = {}) {
    return new HarnessPredicate(MatExpansionPanelHarness, options).addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title)).addOption('description', options.description, (harness, description) => HarnessPredicate.stringMatches(harness.getDescription(), description)).addOption('content', options.content, (harness, content) => HarnessPredicate.stringMatches(harness.getTextContent(), content)).addOption('expanded', options.expanded, async (harness, expanded) => (await harness.isExpanded()) === expanded).addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
  }
  async isExpanded() {
    return (await this.host()).hasClass('mat-expanded');
  }
  async getTitle() {
    const titleEl = await this._title();
    return titleEl ? titleEl.text() : null;
  }
  async getDescription() {
    const descriptionEl = await this._description();
    return descriptionEl ? descriptionEl.text() : null;
  }
  async isDisabled() {
    return (await (await this._header()).getAttribute('aria-disabled')) === 'true';
  }
  async toggle() {
    await (await this._header()).click();
  }
  async expand() {
    if (!(await this.isExpanded())) {
      await this.toggle();
    }
  }
  async collapse() {
    if (await this.isExpanded()) {
      await this.toggle();
    }
  }
  async getTextContent() {
    return (await this._content()).text();
  }
  async getHarnessLoaderForContent() {
    return this.getChildLoader(MatExpansionPanelSection.CONTENT);
  }
  async focus() {
    return (await this._header()).focus();
  }
  async blur() {
    return (await this._header()).blur();
  }
  async isFocused() {
    return (await this._header()).isFocused();
  }
  async hasToggleIndicator() {
    return (await this._expansionIndicator()) !== null;
  }
  async getToggleIndicatorPosition() {
    if (await (await this._header()).hasClass('mat-expansion-toggle-indicator-before')) {
      return 'before';
    }
    return 'after';
  }
}

class MatAccordionHarness extends ComponentHarness {
  static hostSelector = '.mat-accordion';
  static with(options = {}) {
    return new HarnessPredicate(MatAccordionHarness, options);
  }
  async getExpansionPanels(filter = {}) {
    return this.locatorForAll(MatExpansionPanelHarness.with(filter))();
  }
  async isMulti() {
    return (await this.host()).hasClass('mat-accordion-multi');
  }
}

export { MatAccordionHarness, MatExpansionPanelHarness, MatExpansionPanelSection };
//# sourceMappingURL=expansion-testing.mjs.map
