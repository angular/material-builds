import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatIconHarness } from '@angular/material/icon/testing';

class MatMenuHarness extends ContentContainerComponentHarness {
  _documentRootLocator = this.documentRootLocatorFactory();
  static hostSelector = '.mat-mdc-menu-trigger';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('triggerText', options.triggerText, (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text)).addOption('triggerIconName', options.triggerIconName, async (harness, triggerIconName) => {
      const result = await harness.locatorForOptional(MatIconHarness.with({
        name: triggerIconName
      }))();
      return result !== null;
    });
  }
  async isDisabled() {
    const disabled = (await this.host()).getAttribute('disabled');
    return coerceBooleanProperty(await disabled);
  }
  async isOpen() {
    return !!(await this._getMenuPanel());
  }
  async getTriggerText() {
    return (await this.host()).text();
  }
  async focus() {
    return (await this.host()).focus();
  }
  async blur() {
    return (await this.host()).blur();
  }
  async isFocused() {
    return (await this.host()).isFocused();
  }
  async open() {
    if (!(await this.isOpen())) {
      return (await this.host()).click();
    }
  }
  async close() {
    const panel = await this._getMenuPanel();
    if (panel) {
      return panel.click();
    }
  }
  async getItems(filters) {
    const panelId = await this._getPanelId();
    if (panelId) {
      return this._documentRootLocator.locatorForAll(MatMenuItemHarness.with({
        ...(filters || {}),
        ancestor: `#${panelId}`
      }))();
    }
    return [];
  }
  async clickItem(itemFilter, ...subItemFilters) {
    await this.open();
    return clickItemImplementation(await this.getItems(itemFilter), itemFilter, subItemFilters);
  }
  async getRootHarnessLoader() {
    const panelId = await this._getPanelId();
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
  }
  async _getMenuPanel() {
    const panelId = await this._getPanelId();
    return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
  }
  async _getPanelId() {
    const panelId = await (await this.host()).getAttribute('aria-controls');
    return panelId || null;
  }
}
class MatMenuItemHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-menu-item';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('hasSubmenu', options.hasSubmenu, async (harness, hasSubmenu) => (await harness.hasSubmenu()) === hasSubmenu);
  }
  async isDisabled() {
    const disabled = (await this.host()).getAttribute('disabled');
    return coerceBooleanProperty(await disabled);
  }
  async getText() {
    return (await this.host()).text();
  }
  async focus() {
    return (await this.host()).focus();
  }
  async blur() {
    return (await this.host()).blur();
  }
  async isFocused() {
    return (await this.host()).isFocused();
  }
  async click() {
    return (await this.host()).click();
  }
  async hasSubmenu() {
    return (await this.host()).matchesSelector(MatMenuHarness.hostSelector);
  }
  async getSubmenu() {
    if (await this.hasSubmenu()) {
      return new MatMenuHarness(this.locatorFactory);
    }
    return null;
  }
}
async function clickItemImplementation(items, itemFilter, subItemFilters) {
  if (!items.length) {
    throw Error(`Could not find item matching ${JSON.stringify(itemFilter)}`);
  }
  if (!subItemFilters.length) {
    return await items[0].click();
  }
  const menu = await items[0].getSubmenu();
  if (!menu) {
    throw Error(`Item matching ${JSON.stringify(itemFilter)} does not have a submenu`);
  }
  return menu.clickItem(...subItemFilters);
}

class MatContextMenuHarness extends ContentContainerComponentHarness {
  _documentRootLocator = this.documentRootLocatorFactory();
  static hostSelector = '.mat-context-menu-trigger';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async isOpen() {
    return !!(await this._getMenuPanel());
  }
  async open(relativeX = 0, relativeY = 0) {
    if (!(await this.isOpen())) {
      return (await this.host()).rightClick(relativeX, relativeY);
    }
  }
  async close() {
    const panel = await this._getMenuPanel();
    if (panel) {
      return panel.click();
    }
  }
  async isDisabled() {
    const host = await this.host();
    return host.hasClass('mat-context-menu-trigger-disabled');
  }
  async getItems(filters) {
    const panelId = await this._getPanelId();
    if (panelId) {
      return this._documentRootLocator.locatorForAll(MatMenuItemHarness.with({
        ...(filters || {}),
        ancestor: `#${panelId}`
      }))();
    }
    return [];
  }
  async clickItem(itemFilter, ...subItemFilters) {
    await this.open();
    return clickItemImplementation(await this.getItems(itemFilter), itemFilter, subItemFilters);
  }
  async getRootHarnessLoader() {
    const panelId = await this._getPanelId();
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
  }
  async _getMenuPanel() {
    const panelId = await this._getPanelId();
    return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
  }
  async _getPanelId() {
    const panelId = await (await this.host()).getAttribute('aria-controls');
    return panelId || null;
  }
}

export { MatContextMenuHarness, MatMenuHarness, MatMenuItemHarness };
//# sourceMappingURL=menu-testing.mjs.map
