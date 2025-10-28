import { ComponentHarness, HarnessPredicate, ContentContainerComponentHarness, parallel } from '@angular/cdk/testing';
import { MatDividerHarness } from './divider-testing.mjs';

const iconSelector = '.mat-mdc-list-item-icon';
const avatarSelector = '.mat-mdc-list-item-avatar';
function getListItemPredicate(harnessType, options) {
  return new HarnessPredicate(harnessType, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('fullText', options.fullText, (harness, fullText) => HarnessPredicate.stringMatches(harness.getFullText(), fullText)).addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title)).addOption('secondaryText', options.secondaryText, (harness, secondaryText) => HarnessPredicate.stringMatches(harness.getSecondaryText(), secondaryText)).addOption('tertiaryText', options.tertiaryText, (harness, tertiaryText) => HarnessPredicate.stringMatches(harness.getTertiaryText(), tertiaryText));
}
class MatSubheaderHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-subheader';
  static with(options = {}) {
    return new HarnessPredicate(MatSubheaderHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
  }
  async getText() {
    return (await this.host()).text();
  }
}
var MatListItemSection;
(function (MatListItemSection) {
  MatListItemSection["CONTENT"] = ".mdc-list-item__content";
})(MatListItemSection || (MatListItemSection = {}));
var MatListItemType;
(function (MatListItemType) {
  MatListItemType[MatListItemType["ONE_LINE_ITEM"] = 0] = "ONE_LINE_ITEM";
  MatListItemType[MatListItemType["TWO_LINE_ITEM"] = 1] = "TWO_LINE_ITEM";
  MatListItemType[MatListItemType["THREE_LINE_ITEM"] = 2] = "THREE_LINE_ITEM";
})(MatListItemType || (MatListItemType = {}));
class MatListItemHarnessBase extends ContentContainerComponentHarness {
  _lines = this.locatorForAll('.mat-mdc-list-item-line');
  _primaryText = this.locatorFor('.mdc-list-item__primary-text');
  _avatar = this.locatorForOptional('.mat-mdc-list-item-avatar');
  _icon = this.locatorForOptional('.mat-mdc-list-item-icon');
  _unscopedTextContent = this.locatorFor('.mat-mdc-list-item-unscoped-content');
  async getType() {
    const host = await this.host();
    const [isOneLine, isTwoLine] = await parallel(() => [host.hasClass('mdc-list-item--with-one-line'), host.hasClass('mdc-list-item--with-two-lines')]);
    if (isOneLine) {
      return MatListItemType.ONE_LINE_ITEM;
    } else if (isTwoLine) {
      return MatListItemType.TWO_LINE_ITEM;
    } else {
      return MatListItemType.THREE_LINE_ITEM;
    }
  }
  async getText() {
    return this.getFullText();
  }
  async getFullText() {
    return (await this.host()).text({
      exclude: `${iconSelector}, ${avatarSelector}`
    });
  }
  async getTitle() {
    return (await this._primaryText()).text();
  }
  async isDisabled() {
    return (await this.host()).hasClass('mdc-list-item--disabled');
  }
  async getSecondaryText() {
    const type = await this.getType();
    if (type === MatListItemType.ONE_LINE_ITEM) {
      return null;
    }
    const [lines, unscopedTextContent] = await parallel(() => [this._lines(), this._unscopedTextContent()]);
    if (lines.length >= 1) {
      return lines[0].text();
    } else {
      return unscopedTextContent.text();
    }
  }
  async getTertiaryText() {
    const type = await this.getType();
    if (type !== MatListItemType.THREE_LINE_ITEM) {
      return null;
    }
    const [lines, unscopedTextContent] = await parallel(() => [this._lines(), this._unscopedTextContent()]);
    if (lines.length === 2) {
      return lines[1].text();
    } else if (lines.length === 1) {
      return unscopedTextContent.text();
    }
    return null;
  }
  async hasAvatar() {
    return !!(await this._avatar());
  }
  async hasIcon() {
    return !!(await this._icon());
  }
}

class MatListHarnessBase extends ComponentHarness {
  _itemHarness;
  async getItems(filters) {
    return this.locatorForAll(this._itemHarness.with(filters))();
  }
  async getItemsGroupedBySubheader(filters) {
    const listSections = [];
    let currentSection = {
      items: []
    };
    const itemsAndSubheaders = await this.getItemsWithSubheadersAndDividers({
      item: filters,
      divider: false
    });
    for (const itemOrSubheader of itemsAndSubheaders) {
      if (itemOrSubheader instanceof MatSubheaderHarness) {
        if (currentSection.heading !== undefined || currentSection.items.length) {
          listSections.push(currentSection);
        }
        currentSection = {
          heading: itemOrSubheader.getText(),
          items: []
        };
      } else {
        currentSection.items.push(itemOrSubheader);
      }
    }
    if (currentSection.heading !== undefined || currentSection.items.length || !listSections.length) {
      listSections.push(currentSection);
    }
    return parallel(() => listSections.map(async s => ({
      items: s.items,
      heading: await s.heading
    })));
  }
  async getItemsGroupedByDividers(filters) {
    const listSections = [[]];
    const itemsAndDividers = await this.getItemsWithSubheadersAndDividers({
      item: filters,
      subheader: false
    });
    for (const itemOrDivider of itemsAndDividers) {
      if (itemOrDivider instanceof MatDividerHarness) {
        listSections.push([]);
      } else {
        listSections[listSections.length - 1].push(itemOrDivider);
      }
    }
    return listSections;
  }
  async getItemsWithSubheadersAndDividers(filters = {}) {
    const query = [];
    if (filters.item !== false) {
      query.push(this._itemHarness.with(filters.item || {}));
    }
    if (filters.subheader !== false) {
      query.push(MatSubheaderHarness.with(filters.subheader));
    }
    if (filters.divider !== false) {
      query.push(MatDividerHarness.with(filters.divider));
    }
    return this.locatorForAll(...query)();
  }
}

class MatActionListHarness extends MatListHarnessBase {
  static hostSelector = '.mat-mdc-action-list';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  _itemHarness = MatActionListItemHarness;
}
class MatActionListItemHarness extends MatListItemHarnessBase {
  static hostSelector = `${MatActionListHarness.hostSelector} .mat-mdc-list-item`;
  static with(options = {}) {
    return getListItemPredicate(this, options);
  }
  async click() {
    return (await this.host()).click();
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
}

class MatListHarness extends MatListHarnessBase {
  static hostSelector = '.mat-mdc-list';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  _itemHarness = MatListItemHarness;
}
class MatListItemHarness extends MatListItemHarnessBase {
  static hostSelector = `${MatListHarness.hostSelector} .mat-mdc-list-item`;
  static with(options = {}) {
    return getListItemPredicate(this, options);
  }
}

class MatNavListHarness extends MatListHarnessBase {
  static hostSelector = '.mat-mdc-nav-list';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  _itemHarness = MatNavListItemHarness;
}
class MatNavListItemHarness extends MatListItemHarnessBase {
  static hostSelector = `${MatNavListHarness.hostSelector} .mat-mdc-list-item`;
  static with(options = {}) {
    return getListItemPredicate(this, options).addOption('href', options.href, async (harness, href) => HarnessPredicate.stringMatches(harness.getHref(), href)).addOption('activated', options.activated, async (harness, activated) => (await harness.isActivated()) === activated);
  }
  async getHref() {
    return (await this.host()).getAttribute('href');
  }
  async click() {
    return (await this.host()).click();
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
  async isActivated() {
    return (await this.host()).hasClass('mdc-list-item--activated');
  }
}

class MatSelectionListHarness extends MatListHarnessBase {
  static hostSelector = '.mat-mdc-selection-list';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  _itemHarness = MatListOptionHarness;
  async isDisabled() {
    return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
  }
  async selectItems(...filters) {
    const items = await this._getItems(filters);
    await parallel(() => items.map(item => item.select()));
  }
  async deselectItems(...filters) {
    const items = await this._getItems(filters);
    await parallel(() => items.map(item => item.deselect()));
  }
  async _getItems(filters) {
    if (!filters.length) {
      return this.getItems();
    }
    const matches = await parallel(() => filters.map(filter => this.locatorForAll(MatListOptionHarness.with(filter))()));
    return matches.reduce((result, current) => [...result, ...current], []);
  }
}
class MatListOptionHarness extends MatListItemHarnessBase {
  static hostSelector = '.mat-mdc-list-option';
  static with(options = {}) {
    return getListItemPredicate(this, options).addOption('is selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
  }
  _beforeCheckbox = this.locatorForOptional('.mdc-list-item__start .mdc-checkbox');
  _beforeRadio = this.locatorForOptional('.mdc-list-item__start .mdc-radio');
  async getCheckboxPosition() {
    return (await this._beforeCheckbox()) !== null ? 'before' : 'after';
  }
  async getRadioPosition() {
    return (await this._beforeRadio()) !== null ? 'before' : 'after';
  }
  async isSelected() {
    return (await (await this.host()).getAttribute('aria-selected')) === 'true';
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
  async toggle() {
    return (await this.host()).click();
  }
  async select() {
    if (!(await this.isSelected())) {
      return this.toggle();
    }
  }
  async deselect() {
    if (await this.isSelected()) {
      return this.toggle();
    }
  }
}

export { MatActionListHarness, MatActionListItemHarness, MatListHarness, MatListItemHarness, MatListItemSection, MatListItemType, MatListOptionHarness, MatNavListHarness, MatNavListItemHarness, MatSelectionListHarness, MatSubheaderHarness };
//# sourceMappingURL=list-testing.mjs.map
