/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, TestKey, } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class _MatMenuHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    // TODO: potentially extend MatButtonHarness
    /** Whether the menu is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the menu is open. */
    async isOpen() {
        return !!(await this._getMenuPanel());
    }
    /** Gets the text of the menu's trigger element. */
    async getTriggerText() {
        return (await this.host()).text();
    }
    /** Focuses the menu. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the menu. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the menu is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Opens the menu. */
    async open() {
        if (!await this.isOpen()) {
            return (await this.host()).click();
        }
    }
    /** Closes the menu. */
    async close() {
        const panel = await this._getMenuPanel();
        if (panel) {
            return panel.sendKeys(TestKey.ESCAPE);
        }
    }
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    async getItems(filters) {
        const panelId = await this._getPanelId();
        if (panelId) {
            return this._documentRootLocator.locatorForAll(this._itemClass.with({
                ...(filters || {}),
                ancestor: `#${panelId}`
            }))();
        }
        return [];
    }
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    async clickItem(itemFilter, ...subItemFilters) {
        await this.open();
        const items = await this.getItems(itemFilter);
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
    async getRootHarnessLoader() {
        const panelId = await this._getPanelId();
        return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
    }
    /** Gets the menu panel associated with this menu. */
    async _getMenuPanel() {
        const panelId = await this._getPanelId();
        return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
    }
    /** Gets the id of the menu panel associated with this menu. */
    async _getPanelId() {
        const panelId = await (await this.host()).getAttribute('aria-controls');
        return panelId || null;
    }
}
export class _MatMenuItemHarnessBase extends ContentContainerComponentHarness {
    /** Whether the menu is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets the text of the menu item. */
    async getText() {
        return (await this.host()).text();
    }
    /** Focuses the menu item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the menu item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the menu item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Clicks the menu item. */
    async click() {
        return (await this.host()).click();
    }
    /** Whether this item has a submenu. */
    async hasSubmenu() {
        return (await this.host()).matchesSelector(this._menuClass.hostSelector);
    }
    /** Gets the submenu associated with this menu item, or null if none. */
    async getSubmenu() {
        if (await this.hasSubmenu()) {
            return new this._menuClass(this.locatorFactory);
        }
        return null;
    }
}
/** Harness for interacting with a standard mat-menu in tests. */
export class MatMenuHarness extends _MatMenuHarnessBase {
    constructor() {
        super(...arguments);
        this._itemClass = MatMenuItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuHarness` that meets certain
     * criteria.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatMenuHarness, options)
            .addOption('triggerText', options.triggerText, (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
    }
}
/** The selector for the host element of a `MatMenu` instance. */
MatMenuHarness.hostSelector = '.mat-menu-trigger';
/** Harness for interacting with a standard mat-menu-item in tests. */
export class MatMenuItemHarness extends _MatMenuItemHarnessBase {
    constructor() {
        super(...arguments);
        this._menuClass = MatMenuHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which menu item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatMenuItemHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('hasSubmenu', options.hasSubmenu, async (harness, hasSubmenu) => (await harness.hasSubmenu()) === hasSubmenu);
    }
}
/** The selector for the host element of a `MatMenuItem` instance. */
MatMenuItemHarness.hostSelector = '.mat-menu-item';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUlMLGdDQUFnQyxFQUVoQyxnQkFBZ0IsRUFFaEIsT0FBTyxHQUNSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHNUQsTUFBTSxPQUFnQixtQkFPcEIsU0FBUSxnQ0FBd0M7SUFQbEQ7O1FBUVUseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUE4R25FLENBQUM7SUEzR0MsNENBQTRDO0lBRTVDLG9DQUFvQztJQUNwQyxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsS0FBSyxDQUFDLE1BQU07UUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLEtBQUssQ0FBQyxJQUFJO1FBQ1IsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixLQUFLLENBQUMsS0FBSztRQUNULE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pDLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQXVDO1FBQ3BELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pDLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUNsRSxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztnQkFDbEIsUUFBUSxFQUFFLElBQUksT0FBTyxFQUFFO2FBQ1QsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUN0QjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsU0FBUyxDQUNYLFVBQXlDLEVBQ3pDLEdBQUcsY0FBK0M7UUFDcEQsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxDQUFDLGdDQUFnQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMzRTtRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQzFCLE9BQU8sTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDL0I7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsTUFBTSxLQUFLLENBQUMsaUJBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDcEY7UUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxjQUFpRCxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVrQixLQUFLLENBQUMsb0JBQW9CO1FBQzNDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxxREFBcUQ7SUFDN0MsS0FBSyxDQUFDLGFBQWE7UUFDekIsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekMsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hGLENBQUM7SUFFRCwrREFBK0Q7SUFDdkQsS0FBSyxDQUFDLFdBQVc7UUFDdkIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sT0FBTyxJQUFJLElBQUksQ0FBQztJQUN6QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQWdCLHVCQUdwQixTQUFRLGdDQUF3QztJQUdoRCxvQ0FBb0M7SUFDcEMsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELE9BQU8scUJBQXFCLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELDZCQUE2QjtJQUM3QixLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCwyQkFBMkI7SUFDM0IsS0FBSyxDQUFDLElBQUk7UUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELDRCQUE0QjtJQUM1QixLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsd0VBQXdFO0lBQ3hFLEtBQUssQ0FBQyxVQUFVO1FBQ2QsSUFBSSxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUMzQixPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDakQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQUdELGlFQUFpRTtBQUNqRSxNQUFNLE9BQU8sY0FBZSxTQUFRLG1CQUNvQztJQUR4RTs7UUFJWSxlQUFVLEdBQUcsa0JBQWtCLENBQUM7SUFhNUMsQ0FBQztJQVhDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2FBQy9DLFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFDekMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQzs7QUFkRCxpRUFBaUU7QUFDMUQsMkJBQVksR0FBRyxtQkFBbUIsQ0FBQztBQWdCNUMsc0VBQXNFO0FBQ3RFLE1BQU0sT0FBTyxrQkFBbUIsU0FDOUIsdUJBQThEO0lBRGhFOztRQUlZLGVBQVUsR0FBRyxjQUFjLENBQUM7SUFleEMsQ0FBQztJQWJDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUM7YUFDbkQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDOUUsU0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVSxFQUN2QyxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7O0FBaEJELHFFQUFxRTtBQUM5RCwrQkFBWSxHQUFHLGdCQUFnQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJhc2VIYXJuZXNzRmlsdGVycyxcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc0xvYWRlcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG4gIFRlc3RLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNZW51SGFybmVzc0ZpbHRlcnMsIE1lbnVJdGVtSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vbWVudS1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdE1lbnVIYXJuZXNzQmFzZTxcbiAgSXRlbVR5cGUgZXh0ZW5kcyAoQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPEl0ZW0+ICYge1xuICAgIHdpdGg6IChvcHRpb25zPzogSXRlbUZpbHRlcnMpID0+IEhhcm5lc3NQcmVkaWNhdGU8SXRlbT59KSxcbiAgSXRlbSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3MgJiB7XG4gICAgY2xpY2soKTogUHJvbWlzZTx2b2lkPixcbiAgICBnZXRTdWJtZW51KCk6IFByb21pc2U8X01hdE1lbnVIYXJuZXNzQmFzZTxJdGVtVHlwZSwgSXRlbSwgSXRlbUZpbHRlcnM+IHwgbnVsbD59LFxuICBJdGVtRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVyc1xuPiBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2l0ZW1DbGFzczogSXRlbVR5cGU7XG5cbiAgLy8gVE9ETzogcG90ZW50aWFsbHkgZXh0ZW5kIE1hdEJ1dHRvbkhhcm5lc3NcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLl9nZXRNZW51UGFuZWwoKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgbWVudSdzIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0VHJpZ2dlclRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIGFzeW5jIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG1lbnUuICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fZ2V0TWVudVBhbmVsKCk7XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICByZXR1cm4gcGFuZWwuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiBgTWF0TWVudUl0ZW1IYXJuZXNzYCByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIGluIHRoZSBtZW51LlxuICAgKiBAcGFyYW0gZmlsdGVycyBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggbWVudSBpdGVtcyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRJdGVtcyhmaWx0ZXJzPzogT21pdDxJdGVtRmlsdGVycywgJ2FuY2VzdG9yJz4pOiBQcm9taXNlPEl0ZW1bXT4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgaWYgKHBhbmVsSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwodGhpcy5faXRlbUNsYXNzLndpdGgoe1xuICAgICAgICAuLi4oZmlsdGVycyB8fCB7fSksXG4gICAgICAgIGFuY2VzdG9yOiBgIyR7cGFuZWxJZH1gXG4gICAgICB9IGFzIEl0ZW1GaWx0ZXJzKSkoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyBhbiBpdGVtIGluIHRoZSBtZW51LCBhbmQgb3B0aW9uYWxseSBjb250aW51ZXMgY2xpY2tpbmcgaXRlbXMgaW4gc3Vic2VxdWVudCBzdWItbWVudXMuXG4gICAqIEBwYXJhbSBpdGVtRmlsdGVyIEEgZmlsdGVyIHVzZWQgdG8gcmVwcmVzZW50IHdoaWNoIGl0ZW0gaW4gdGhlIG1lbnUgc2hvdWxkIGJlIGNsaWNrZWQuIFRoZVxuICAgKiAgICAgZmlyc3QgbWF0Y2hpbmcgbWVudSBpdGVtIHdpbGwgYmUgY2xpY2tlZC5cbiAgICogQHBhcmFtIHN1Ykl0ZW1GaWx0ZXJzIEEgbGlzdCBvZiBmaWx0ZXJzIHJlcHJlc2VudGluZyB0aGUgaXRlbXMgdG8gY2xpY2sgaW4gYW55IHN1YnNlcXVlbnRcbiAgICogICAgIHN1Yi1tZW51cy4gVGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHN1Yi1tZW51IG1hdGNoaW5nIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBpblxuICAgKiAgICAgYHN1Ykl0ZW1GaWx0ZXJzYCB3aWxsIGJlIGNsaWNrZWQuXG4gICAqL1xuICBhc3luYyBjbGlja0l0ZW0oXG4gICAgICBpdGVtRmlsdGVyOiBPbWl0PEl0ZW1GaWx0ZXJzLCAnYW5jZXN0b3InPixcbiAgICAgIC4uLnN1Ykl0ZW1GaWx0ZXJzOiBPbWl0PEl0ZW1GaWx0ZXJzLCAnYW5jZXN0b3InPltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5vcGVuKCk7XG4gICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEl0ZW1zKGl0ZW1GaWx0ZXIpO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgaXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGl0ZW1GaWx0ZXIpfWApO1xuICAgIH1cblxuICAgIGlmICghc3ViSXRlbUZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gYXdhaXQgaXRlbXNbMF0uY2xpY2soKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZW51ID0gYXdhaXQgaXRlbXNbMF0uZ2V0U3VibWVudSgpO1xuICAgIGlmICghbWVudSkge1xuICAgICAgdGhyb3cgRXJyb3IoYEl0ZW0gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShpdGVtRmlsdGVyKX0gZG9lcyBub3QgaGF2ZSBhIHN1Ym1lbnVgKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbnUuY2xpY2tJdGVtKC4uLnN1Ykl0ZW1GaWx0ZXJzIGFzIFtPbWl0PEl0ZW1GaWx0ZXJzLCAnYW5jZXN0b3InPl0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGFzeW5jIGdldFJvb3RIYXJuZXNzTG9hZGVyKCk6IFByb21pc2U8SGFybmVzc0xvYWRlcj4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5oYXJuZXNzTG9hZGVyRm9yKGAjJHtwYW5lbElkfWApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1lbnUgcGFuZWwgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TWVudVBhbmVsKCk6IFByb21pc2U8VGVzdEVsZW1lbnQgfCBudWxsPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICByZXR1cm4gcGFuZWxJZCA/IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvck9wdGlvbmFsKGAjJHtwYW5lbElkfWApKCkgOiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBtZW51IHBhbmVsIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhbmVsSWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gICAgcmV0dXJuIHBhbmVsSWQgfHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdE1lbnVJdGVtSGFybmVzc0Jhc2U8XG4gIE1lbnVUeXBlIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPE1lbnU+LFxuICBNZW51IGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyxcbj4gZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9tZW51Q2xhc3M6IE1lbnVUeXBlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBpdGVtIGhhcyBhIHN1Ym1lbnUuICovXG4gIGFzeW5jIGhhc1N1Ym1lbnUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkubWF0Y2hlc1NlbGVjdG9yKHRoaXMuX21lbnVDbGFzcy5ob3N0U2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN1Ym1lbnUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudSBpdGVtLCBvciBudWxsIGlmIG5vbmUuICovXG4gIGFzeW5jIGdldFN1Ym1lbnUoKTogUHJvbWlzZTxNZW51IHwgbnVsbD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmhhc1N1Ym1lbnUoKSkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLl9tZW51Q2xhc3ModGhpcy5sb2NhdG9yRmFjdG9yeSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtbWVudSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SGFybmVzcyBleHRlbmRzIF9NYXRNZW51SGFybmVzc0Jhc2U8XG4gIHR5cGVvZiBNYXRNZW51SXRlbUhhcm5lc3MsIE1hdE1lbnVJdGVtSGFybmVzcywgTWVudUl0ZW1IYXJuZXNzRmlsdGVycz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdE1lbnVgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWVudS10cmlnZ2VyJztcbiAgcHJvdGVjdGVkIF9pdGVtQ2xhc3MgPSBNYXRNZW51SXRlbUhhcm5lc3M7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdE1lbnVIYXJuZXNzYCB0aGF0IG1lZXRzIGNlcnRhaW5cbiAgICogY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBtZW51IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE1lbnVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRNZW51SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndHJpZ2dlclRleHQnLCBvcHRpb25zLnRyaWdnZXJUZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRyaWdnZXJUZXh0KCksIHRleHQpKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51LWl0ZW0gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1IYXJuZXNzIGV4dGVuZHNcbiAgX01hdE1lbnVJdGVtSGFybmVzc0Jhc2U8dHlwZW9mIE1hdE1lbnVIYXJuZXNzLCBNYXRNZW51SGFybmVzcz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdE1lbnVJdGVtYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1lbnUtaXRlbSc7XG4gIHByb3RlY3RlZCBfbWVudUNsYXNzID0gTWF0TWVudUhhcm5lc3M7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdE1lbnVJdGVtSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbWVudSBpdGVtIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TWVudUl0ZW1IYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdE1lbnVJdGVtSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKVxuICAgICAgICAuYWRkT3B0aW9uKCdoYXNTdWJtZW51Jywgb3B0aW9ucy5oYXNTdWJtZW51LFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGhhc1N1Ym1lbnUpID0+IChhd2FpdCBoYXJuZXNzLmhhc1N1Ym1lbnUoKSkgPT09IGhhc1N1Ym1lbnUpO1xuICB9XG59XG4iXX0=