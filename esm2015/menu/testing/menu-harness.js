/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ContentContainerComponentHarness, HarnessPredicate, TestKey, } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class _MatMenuHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    // TODO: potentially extend MatButtonHarness
    /** Whether the menu is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Whether the menu is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._getMenuPanel());
        });
    }
    /** Gets the text of the menu's trigger element. */
    getTriggerText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Focuses the menu. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the menu. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the menu is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Opens the menu. */
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isOpen())) {
                return (yield this.host()).click();
            }
        });
    }
    /** Closes the menu. */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._getMenuPanel();
            if (panel) {
                return panel.sendKeys(TestKey.ESCAPE);
            }
        });
    }
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    getItems(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield this._getPanelId();
            if (panelId) {
                return this._documentRootLocator.locatorForAll(this._itemClass.with(Object.assign(Object.assign({}, (filters || {})), { ancestor: `#${panelId}` })))();
            }
            return [];
        });
    }
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    clickItem(itemFilter, ...subItemFilters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.open();
            const items = yield this.getItems(itemFilter);
            if (!items.length) {
                throw Error(`Could not find item matching ${JSON.stringify(itemFilter)}`);
            }
            if (!subItemFilters.length) {
                return yield items[0].click();
            }
            const menu = yield items[0].getSubmenu();
            if (!menu) {
                throw Error(`Item matching ${JSON.stringify(itemFilter)} does not have a submenu`);
            }
            return menu.clickItem(...subItemFilters);
        });
    }
    getRootHarnessLoader() {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield this._getPanelId();
            return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
        });
    }
    /** Gets the menu panel associated with this menu. */
    _getMenuPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield this._getPanelId();
            return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
        });
    }
    /** Gets the id of the menu panel associated with this menu. */
    _getPanelId() {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield (yield this.host()).getAttribute('aria-controls');
            return panelId || null;
        });
    }
}
export class _MatMenuItemHarnessBase extends ContentContainerComponentHarness {
    /** Whether the menu is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets the text of the menu item. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Focuses the menu item. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the menu item. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the menu item is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Clicks the menu item. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Whether this item has a submenu. */
    hasSubmenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).matchesSelector(this._menuClass.hostSelector);
        });
    }
    /** Gets the submenu associated with this menu item, or null if none. */
    getSubmenu() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.hasSubmenu()) {
                return new this._menuClass(this.locatorFactory);
            }
            return null;
        });
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
            .addOption('hasSubmenu', options.hasSubmenu, (harness, hasSubmenu) => __awaiter(this, void 0, void 0, function* () { return (yield harness.hasSubmenu()) === hasSubmenu; }));
    }
}
/** The selector for the host element of a `MatMenuItem` instance. */
MatMenuItemHarness.hostSelector = '.mat-menu-item';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFJTCxnQ0FBZ0MsRUFFaEMsZ0JBQWdCLEVBRWhCLE9BQU8sR0FDUixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzVELE1BQU0sT0FBZ0IsbUJBT3BCLFNBQVEsZ0NBQXdDO0lBUGxEOztRQVFVLHlCQUFvQixHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO0lBOEduRSxDQUFDO0lBM0dDLDRDQUE0QztJQUU1QyxvQ0FBb0M7SUFDOUIsVUFBVTs7WUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlELE9BQU8scUJBQXFCLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFRCxnQ0FBZ0M7SUFDMUIsTUFBTTs7WUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBRUQsbURBQW1EO0lBQzdDLGNBQWM7O1lBQ2xCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUVELHdCQUF3QjtJQUNsQixLQUFLOztZQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVELHNCQUFzQjtJQUNoQixJQUFJOztZ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LE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDOUUsU0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVSxFQUN2QyxDQUFPLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxnREFBQyxPQUFBLENBQUMsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxVQUFVLENBQUEsR0FBQSxDQUFDLENBQUM7SUFDdEYsQ0FBQzs7QUFoQkQscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzTG9hZGVyLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBUZXN0RWxlbWVudCxcbiAgVGVzdEtleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVycywgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0TWVudUhhcm5lc3NCYXNlPFxuICBJdGVtVHlwZSBleHRlbmRzIChDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8SXRlbT4gJiB7XG4gICAgd2l0aDogKG9wdGlvbnM/OiBJdGVtRmlsdGVycykgPT4gSGFybmVzc1ByZWRpY2F0ZTxJdGVtPn0pLFxuICBJdGVtIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyAmIHtcbiAgICBjbGljaygpOiBQcm9taXNlPHZvaWQ+LFxuICAgIGdldFN1Ym1lbnUoKTogUHJvbWlzZTxfTWF0TWVudUhhcm5lc3NCYXNlPEl0ZW1UeXBlLCBJdGVtLCBJdGVtRmlsdGVycz4gfCBudWxsPn0sXG4gIEl0ZW1GaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzXG4+IGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaXRlbUNsYXNzOiBJdGVtVHlwZTtcblxuICAvLyBUT0RPOiBwb3RlbnRpYWxseSBleHRlbmQgTWF0QnV0dG9uSGFybmVzc1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBtZW51J3MgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBhc3luYyBnZXRUcmlnZ2VyVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51LiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGFuZWwgPSBhd2FpdCB0aGlzLl9nZXRNZW51UGFuZWwoKTtcbiAgICBpZiAocGFuZWwpIHtcbiAgICAgIHJldHVybiBwYW5lbC5zZW5kS2V5cyhUZXN0S2V5LkVTQ0FQRSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGBNYXRNZW51SXRlbUhhcm5lc3NgIHJlcHJlc2VudGluZyB0aGUgaXRlbXMgaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBtZW51IGl0ZW1zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldEl0ZW1zKGZpbHRlcnM/OiBPbWl0PEl0ZW1GaWx0ZXJzLCAnYW5jZXN0b3InPik6IFByb21pc2U8SXRlbVtdPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICBpZiAocGFuZWxJZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbCh0aGlzLl9pdGVtQ2xhc3Mud2l0aCh7XG4gICAgICAgIC4uLihmaWx0ZXJzIHx8IHt9KSxcbiAgICAgICAgYW5jZXN0b3I6IGAjJHtwYW5lbElkfWBcbiAgICAgIH0gYXMgSXRlbUZpbHRlcnMpKSgpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2tzIGFuIGl0ZW0gaW4gdGhlIG1lbnUsIGFuZCBvcHRpb25hbGx5IGNvbnRpbnVlcyBjbGlja2luZyBpdGVtcyBpbiBzdWJzZXF1ZW50IHN1Yi1tZW51cy5cbiAgICogQHBhcmFtIGl0ZW1GaWx0ZXIgQSBmaWx0ZXIgdXNlZCB0byByZXByZXNlbnQgd2hpY2ggaXRlbSBpbiB0aGUgbWVudSBzaG91bGQgYmUgY2xpY2tlZC4gVGhlXG4gICAqICAgICBmaXJzdCBtYXRjaGluZyBtZW51IGl0ZW0gd2lsbCBiZSBjbGlja2VkLlxuICAgKiBAcGFyYW0gc3ViSXRlbUZpbHRlcnMgQSBsaXN0IG9mIGZpbHRlcnMgcmVwcmVzZW50aW5nIHRoZSBpdGVtcyB0byBjbGljayBpbiBhbnkgc3Vic2VxdWVudFxuICAgKiAgICAgc3ViLW1lbnVzLiBUaGUgZmlyc3QgaXRlbSBpbiB0aGUgc3ViLW1lbnUgbWF0Y2hpbmcgdGhlIGNvcnJlc3BvbmRpbmcgZmlsdGVyIGluXG4gICAqICAgICBgc3ViSXRlbUZpbHRlcnNgIHdpbGwgYmUgY2xpY2tlZC5cbiAgICovXG4gIGFzeW5jIGNsaWNrSXRlbShcbiAgICAgIGl0ZW1GaWx0ZXI6IE9taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+LFxuICAgICAgLi4uc3ViSXRlbUZpbHRlcnM6IE9taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0SXRlbXMoaXRlbUZpbHRlcik7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCBpdGVtIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoaXRlbUZpbHRlcil9YCk7XG4gICAgfVxuXG4gICAgaWYgKCFzdWJJdGVtRmlsdGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBhd2FpdCBpdGVtc1swXS5jbGljaygpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnUgPSBhd2FpdCBpdGVtc1swXS5nZXRTdWJtZW51KCk7XG4gICAgaWYgKCFtZW51KSB7XG4gICAgICB0aHJvdyBFcnJvcihgSXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGl0ZW1GaWx0ZXIpfSBkb2VzIG5vdCBoYXZlIGEgc3VibWVudWApO1xuICAgIH1cbiAgICByZXR1cm4gbWVudS5jbGlja0l0ZW0oLi4uc3ViSXRlbUZpbHRlcnMgYXMgW09taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+XSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgYXN5bmMgZ2V0Um9vdEhhcm5lc3NMb2FkZXIoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmhhcm5lc3NMb2FkZXJGb3IoYCMke3BhbmVsSWR9YCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWVudSBwYW5lbCBhc3NvY2lhdGVkIHdpdGggdGhpcyBtZW51LiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRNZW51UGFuZWwoKTogUHJvbWlzZTxUZXN0RWxlbWVudCB8IG51bGw+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgdGhpcy5fZ2V0UGFuZWxJZCgpO1xuICAgIHJldHVybiBwYW5lbElkID8gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYCMke3BhbmVsSWR9YCkoKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIG1lbnUgcGFuZWwgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0UGFuZWxJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcbiAgICByZXR1cm4gcGFuZWxJZCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0TWVudUl0ZW1IYXJuZXNzQmFzZTxcbiAgTWVudVR5cGUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8TWVudT4sXG4gIE1lbnUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzLFxuPiBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX21lbnVDbGFzczogTWVudVR5cGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGl0ZW0gaGFzIGEgc3VibWVudS4gKi9cbiAgYXN5bmMgaGFzU3VibWVudSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tYXRjaGVzU2VsZWN0b3IodGhpcy5fbWVudUNsYXNzLmhvc3RTZWxlY3Rvcik7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3VibWVudSBhc3NvY2lhdGVkIHdpdGggdGhpcyBtZW51IGl0ZW0sIG9yIG51bGwgaWYgbm9uZS4gKi9cbiAgYXN5bmMgZ2V0U3VibWVudSgpOiBQcm9taXNlPE1lbnUgfCBudWxsPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaGFzU3VibWVudSgpKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuX21lbnVDbGFzcyh0aGlzLmxvY2F0b3JGYWN0b3J5KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE1lbnVIYXJuZXNzIGV4dGVuZHMgX01hdE1lbnVIYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdE1lbnVJdGVtSGFybmVzcywgTWF0TWVudUl0ZW1IYXJuZXNzLCBNZW51SXRlbUhhcm5lc3NGaWx0ZXJzPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZW51LXRyaWdnZXInO1xuICBwcm90ZWN0ZWQgX2l0ZW1DbGFzcyA9IE1hdE1lbnVJdGVtSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0TWVudUhhcm5lc3NgIHRoYXQgbWVldHMgY2VydGFpblxuICAgKiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIG1lbnUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdE1lbnVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdE1lbnVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0cmlnZ2VyVGV4dCcsIG9wdGlvbnMudHJpZ2dlclRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VHJpZ2dlclRleHQoKSwgdGV4dCkpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW1lbnUtaXRlbSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SXRlbUhhcm5lc3MgZXh0ZW5kc1xuICBfTWF0TWVudUl0ZW1IYXJuZXNzQmFzZTx0eXBlb2YgTWF0TWVudUhhcm5lc3MsIE1hdE1lbnVIYXJuZXNzPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudUl0ZW1gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWVudS1pdGVtJztcbiAgcHJvdGVjdGVkIF9tZW51Q2xhc3MgPSBNYXRNZW51SGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0TWVudUl0ZW1IYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBtZW51IGl0ZW0gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2hhc1N1Ym1lbnUnLCBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzU3VibWVudSkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzU3VibWVudSgpKSA9PT0gaGFzU3VibWVudSk7XG4gIH1cbn1cbiJdfQ==