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
    // TODO: potentially extend MatLegacyButtonHarness
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
        if (!(await this.isOpen())) {
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
                ancestor: `#${panelId}`,
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
/** Harness for interacting with an MDC-based mat-menu in tests. */
class MatMenuHarness extends _MatMenuHarnessBase {
    constructor() {
        super(...arguments);
        this._itemClass = MatMenuItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('triggerText', options.triggerText, (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
    }
}
/** The selector for the host element of a `MatMenu` instance. */
MatMenuHarness.hostSelector = '.mat-mdc-menu-trigger';
export { MatMenuHarness };
/** Harness for interacting with an MDC-based mat-menu-item in tests. */
class MatMenuItemHarness extends _MatMenuItemHarnessBase {
    constructor() {
        super(...arguments);
        this._menuClass = MatMenuHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu item with specific attributes.
     * @param options Options for filtering which menu item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('hasSubmenu', options.hasSubmenu, async (harness, hasSubmenu) => (await harness.hasSubmenu()) === hasSubmenu);
    }
}
/** The selector for the host element of a `MatMenuItem` instance. */
MatMenuItemHarness.hostSelector = '.mat-mdc-menu-item';
export { MatMenuItemHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUlMLGdDQUFnQyxFQUVoQyxnQkFBZ0IsRUFFaEIsT0FBTyxHQUNSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHNUQsTUFBTSxPQUFnQixtQkFTcEIsU0FBUSxnQ0FBd0M7SUFUbEQ7O1FBVVUseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFpSG5FLENBQUM7SUE5R0Msa0RBQWtEO0lBRWxELG9DQUFvQztJQUNwQyxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsS0FBSyxDQUFDLE1BQU07UUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELHNCQUFz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QUFDLElBQUksQ0FFVCxVQUFrQyxFQUFFO1FBRXBDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNqRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUN4RDthQUNBLFNBQVMsQ0FDUixZQUFZLEVBQ1osT0FBTyxDQUFDLFVBQVUsRUFDbEIsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxVQUFVLENBQzNFLENBQUM7SUFDTixDQUFDOztBQXRCRCxxRUFBcUU7QUFDOUQsK0JBQVksR0FBRyxvQkFBb0IsQUFBdkIsQ0FBd0I7U0FMaEMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJhc2VIYXJuZXNzRmlsdGVycyxcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc0xvYWRlcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG4gIFRlc3RLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNZW51SGFybmVzc0ZpbHRlcnMsIE1lbnVJdGVtSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vbWVudS1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdE1lbnVIYXJuZXNzQmFzZTxcbiAgSXRlbVR5cGUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8SXRlbT4gJiB7XG4gICAgd2l0aDogKG9wdGlvbnM/OiBJdGVtRmlsdGVycykgPT4gSGFybmVzc1ByZWRpY2F0ZTxJdGVtPjtcbiAgfSxcbiAgSXRlbSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3MgJiB7XG4gICAgY2xpY2soKTogUHJvbWlzZTx2b2lkPjtcbiAgICBnZXRTdWJtZW51KCk6IFByb21pc2U8X01hdE1lbnVIYXJuZXNzQmFzZTxJdGVtVHlwZSwgSXRlbSwgSXRlbUZpbHRlcnM+IHwgbnVsbD47XG4gIH0sXG4gIEl0ZW1GaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuPiBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2l0ZW1DbGFzczogSXRlbVR5cGU7XG5cbiAgLy8gVE9ETzogcG90ZW50aWFsbHkgZXh0ZW5kIE1hdExlZ2FjeUJ1dHRvbkhhcm5lc3NcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLl9nZXRNZW51UGFuZWwoKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgbWVudSdzIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0VHJpZ2dlclRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIGFzeW5jIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc09wZW4oKSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGFuZWwgPSBhd2FpdCB0aGlzLl9nZXRNZW51UGFuZWwoKTtcbiAgICBpZiAocGFuZWwpIHtcbiAgICAgIHJldHVybiBwYW5lbC5zZW5kS2V5cyhUZXN0S2V5LkVTQ0FQRSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGBNYXRNZW51SXRlbUhhcm5lc3NgIHJlcHJlc2VudGluZyB0aGUgaXRlbXMgaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBtZW51IGl0ZW1zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldEl0ZW1zKGZpbHRlcnM/OiBPbWl0PEl0ZW1GaWx0ZXJzLCAnYW5jZXN0b3InPik6IFByb21pc2U8SXRlbVtdPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICBpZiAocGFuZWxJZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChcbiAgICAgICAgdGhpcy5faXRlbUNsYXNzLndpdGgoe1xuICAgICAgICAgIC4uLihmaWx0ZXJzIHx8IHt9KSxcbiAgICAgICAgICBhbmNlc3RvcjogYCMke3BhbmVsSWR9YCxcbiAgICAgICAgfSBhcyBJdGVtRmlsdGVycyksXG4gICAgICApKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGlja3MgYW4gaXRlbSBpbiB0aGUgbWVudSwgYW5kIG9wdGlvbmFsbHkgY29udGludWVzIGNsaWNraW5nIGl0ZW1zIGluIHN1YnNlcXVlbnQgc3ViLW1lbnVzLlxuICAgKiBAcGFyYW0gaXRlbUZpbHRlciBBIGZpbHRlciB1c2VkIHRvIHJlcHJlc2VudCB3aGljaCBpdGVtIGluIHRoZSBtZW51IHNob3VsZCBiZSBjbGlja2VkLiBUaGVcbiAgICogICAgIGZpcnN0IG1hdGNoaW5nIG1lbnUgaXRlbSB3aWxsIGJlIGNsaWNrZWQuXG4gICAqIEBwYXJhbSBzdWJJdGVtRmlsdGVycyBBIGxpc3Qgb2YgZmlsdGVycyByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIHRvIGNsaWNrIGluIGFueSBzdWJzZXF1ZW50XG4gICAqICAgICBzdWItbWVudXMuIFRoZSBmaXJzdCBpdGVtIGluIHRoZSBzdWItbWVudSBtYXRjaGluZyB0aGUgY29ycmVzcG9uZGluZyBmaWx0ZXIgaW5cbiAgICogICAgIGBzdWJJdGVtRmlsdGVyc2Agd2lsbCBiZSBjbGlja2VkLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tJdGVtKFxuICAgIGl0ZW1GaWx0ZXI6IE9taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+LFxuICAgIC4uLnN1Ykl0ZW1GaWx0ZXJzOiBPbWl0PEl0ZW1GaWx0ZXJzLCAnYW5jZXN0b3InPltdXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMub3BlbigpO1xuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRJdGVtcyhpdGVtRmlsdGVyKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGl0ZW0gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShpdGVtRmlsdGVyKX1gKTtcbiAgICB9XG5cbiAgICBpZiAoIXN1Ykl0ZW1GaWx0ZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGF3YWl0IGl0ZW1zWzBdLmNsaWNrKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVudSA9IGF3YWl0IGl0ZW1zWzBdLmdldFN1Ym1lbnUoKTtcbiAgICBpZiAoIW1lbnUpIHtcbiAgICAgIHRocm93IEVycm9yKGBJdGVtIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoaXRlbUZpbHRlcil9IGRvZXMgbm90IGhhdmUgYSBzdWJtZW51YCk7XG4gICAgfVxuICAgIHJldHVybiBtZW51LmNsaWNrSXRlbSguLi4oc3ViSXRlbUZpbHRlcnMgYXMgW09taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+XSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGFzeW5jIGdldFJvb3RIYXJuZXNzTG9hZGVyKCk6IFByb21pc2U8SGFybmVzc0xvYWRlcj4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5oYXJuZXNzTG9hZGVyRm9yKGAjJHtwYW5lbElkfWApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1lbnUgcGFuZWwgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TWVudVBhbmVsKCk6IFByb21pc2U8VGVzdEVsZW1lbnQgfCBudWxsPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICByZXR1cm4gcGFuZWxJZCA/IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvck9wdGlvbmFsKGAjJHtwYW5lbElkfWApKCkgOiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBtZW51IHBhbmVsIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhbmVsSWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gICAgcmV0dXJuIHBhbmVsSWQgfHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdE1lbnVJdGVtSGFybmVzc0Jhc2U8XG4gIE1lbnVUeXBlIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPE1lbnU+LFxuICBNZW51IGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyxcbj4gZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9tZW51Q2xhc3M6IE1lbnVUeXBlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBpdGVtIGhhcyBhIHN1Ym1lbnUuICovXG4gIGFzeW5jIGhhc1N1Ym1lbnUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkubWF0Y2hlc1NlbGVjdG9yKHRoaXMuX21lbnVDbGFzcy5ob3N0U2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN1Ym1lbnUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudSBpdGVtLCBvciBudWxsIGlmIG5vbmUuICovXG4gIGFzeW5jIGdldFN1Ym1lbnUoKTogUHJvbWlzZTxNZW51IHwgbnVsbD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmhhc1N1Ym1lbnUoKSkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLl9tZW51Q2xhc3ModGhpcy5sb2NhdG9yRmFjdG9yeSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGFuIE1EQy1iYXNlZCBtYXQtbWVudSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SGFybmVzcyBleHRlbmRzIF9NYXRNZW51SGFybmVzc0Jhc2U8XG4gIHR5cGVvZiBNYXRNZW51SXRlbUhhcm5lc3MsXG4gIE1hdE1lbnVJdGVtSGFybmVzcyxcbiAgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc1xuPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtbWVudS10cmlnZ2VyJztcbiAgcHJvdGVjdGVkIF9pdGVtQ2xhc3MgPSBNYXRNZW51SXRlbUhhcm5lc3M7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgbWVudSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBtZW51IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRNZW51SGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IE1lbnVIYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodGhpcywgb3B0aW9ucykuYWRkT3B0aW9uKFxuICAgICAgJ3RyaWdnZXJUZXh0JyxcbiAgICAgIG9wdGlvbnMudHJpZ2dlclRleHQsXG4gICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VHJpZ2dlclRleHQoKSwgdGV4dCksXG4gICAgKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhbiBNREMtYmFzZWQgbWF0LW1lbnUtaXRlbSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SXRlbUhhcm5lc3MgZXh0ZW5kcyBfTWF0TWVudUl0ZW1IYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdE1lbnVIYXJuZXNzLFxuICBNYXRNZW51SGFybmVzc1xuPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudUl0ZW1gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWRjLW1lbnUtaXRlbSc7XG4gIHByb3RlY3RlZCBfbWVudUNsYXNzID0gTWF0TWVudUhhcm5lc3M7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgbWVudSBpdGVtIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIG1lbnUgaXRlbSBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aDxUIGV4dGVuZHMgTWF0TWVudUl0ZW1IYXJuZXNzPihcbiAgICB0aGlzOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gICAgb3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodGhpcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ2hhc1N1Ym1lbnUnLFxuICAgICAgICBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgIGFzeW5jIChoYXJuZXNzLCBoYXNTdWJtZW51KSA9PiAoYXdhaXQgaGFybmVzcy5oYXNTdWJtZW51KCkpID09PSBoYXNTdWJtZW51LFxuICAgICAgKTtcbiAgfVxufVxuIl19