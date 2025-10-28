import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';

class MatTabHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-tab';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label)).addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) == selected);
  }
  async getLabel() {
    return (await this.host()).text();
  }
  async getAriaLabel() {
    return (await this.host()).getAttribute('aria-label');
  }
  async getAriaLabelledby() {
    return (await this.host()).getAttribute('aria-labelledby');
  }
  async isSelected() {
    const hostEl = await this.host();
    return (await hostEl.getAttribute('aria-selected')) === 'true';
  }
  async isDisabled() {
    const hostEl = await this.host();
    return (await hostEl.getAttribute('aria-disabled')) === 'true';
  }
  async select() {
    await (await this.host()).click('center');
  }
  async getTextContent() {
    const contentId = await this._getContentId();
    const contentEl = await this.documentRootLocatorFactory().locatorFor(`#${contentId}`)();
    return contentEl.text();
  }
  async getRootHarnessLoader() {
    const contentId = await this._getContentId();
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
  }
  async _getContentId() {
    const hostEl = await this.host();
    return await hostEl.getAttribute('aria-controls');
  }
}

class MatTabGroupHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-tab-group';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('selectedTabLabel', options.selectedTabLabel, async (harness, label) => {
      const selectedTab = await harness.getSelectedTab();
      return HarnessPredicate.stringMatches(await selectedTab.getLabel(), label);
    });
  }
  async getTabs(filter = {}) {
    return this.locatorForAll(MatTabHarness.with(filter))();
  }
  async getSelectedTab() {
    const tabs = await this.getTabs();
    const isSelected = await parallel(() => tabs.map(t => t.isSelected()));
    for (let i = 0; i < tabs.length; i++) {
      if (isSelected[i]) {
        return tabs[i];
      }
    }
    throw new Error('No selected tab could be found.');
  }
  async selectTab(filter = {}) {
    const tabs = await this.getTabs(filter);
    if (!tabs.length) {
      throw Error(`Cannot find mat-tab matching filter ${JSON.stringify(filter)}`);
    }
    await tabs[0].select();
  }
}

class MatTabLinkHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-tab-link';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label));
  }
  async getLabel() {
    return (await this.host()).text();
  }
  async isActive() {
    const host = await this.host();
    return host.hasClass('mdc-tab--active');
  }
  async isDisabled() {
    const host = await this.host();
    return host.hasClass('mat-mdc-tab-disabled');
  }
  async click() {
    await (await this.host()).click();
  }
}

class MatTabNavPanelHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-tab-nav-panel';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async getTextContent() {
    return (await this.host()).text();
  }
}

class MatTabNavBarHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-tab-nav-bar';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async getLinks(filter = {}) {
    return this.locatorForAll(MatTabLinkHarness.with(filter))();
  }
  async getActiveLink() {
    const links = await this.getLinks();
    const isActive = await parallel(() => links.map(t => t.isActive()));
    for (let i = 0; i < links.length; i++) {
      if (isActive[i]) {
        return links[i];
      }
    }
    throw new Error('No active link could be found.');
  }
  async clickLink(filter = {}) {
    const tabs = await this.getLinks(filter);
    if (!tabs.length) {
      throw Error(`Cannot find mat-tab-link matching filter ${JSON.stringify(filter)}`);
    }
    await tabs[0].click();
  }
  async getPanel() {
    const link = await this.getActiveLink();
    const host = await link.host();
    const panelId = await host.getAttribute('aria-controls');
    if (!panelId) {
      throw Error('No panel is controlled by the nav bar.');
    }
    const filter = {
      selector: `#${panelId}`
    };
    return await this.documentRootLocatorFactory().locatorFor(MatTabNavPanelHarness.with(filter))();
  }
}

export { MatTabGroupHarness, MatTabHarness, MatTabLinkHarness, MatTabNavBarHarness };
//# sourceMappingURL=tabs-testing.mjs.map
