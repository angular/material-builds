/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard mat-menu in tests. */
let MatMenuHarness = /** @class */ (() => {
    class MatMenuHarness extends ComponentHarness {
        constructor() {
            super(...arguments);
            this._documentRootLocator = this.documentRootLocatorFactory();
        }
        // TODO: potentially extend MatButtonHarness
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
        getItems(filters = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                const panelId = yield this._getPanelId();
                if (panelId) {
                    return this._documentRootLocator.locatorForAll(MatMenuItemHarness.with(Object.assign(Object.assign({}, filters), { ancestor: `#${panelId}` })))();
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
    /** The selector for the host element of a `MatMenu` instance. */
    MatMenuHarness.hostSelector = '.mat-menu-trigger';
    return MatMenuHarness;
})();
export { MatMenuHarness };
/** Harness for interacting with a standard mat-menu-item in tests. */
let MatMenuItemHarness = /** @class */ (() => {
    class MatMenuItemHarness extends ComponentHarness {
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
                return (yield this.host()).matchesSelector(MatMenuHarness.hostSelector);
            });
        }
        /** Gets the submenu associated with this menu item, or null if none. */
        getSubmenu() {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield this.hasSubmenu()) {
                    return new MatMenuHarness(this.locatorFactory);
                }
                return null;
            });
        }
    }
    /** The selector for the host element of a `MatMenuItem` instance. */
    MatMenuItemHarness.hostSelector = '.mat-menu-item';
    return MatMenuItemHarness;
})();
export { MatMenuItemHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBZSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxpRUFBaUU7QUFDakU7SUFBQSxNQUFhLGNBQWUsU0FBUSxnQkFBZ0I7UUFBcEQ7O1lBSVUseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFtSG5FLENBQUM7UUFqSEMsNENBQTRDO1FBRTVDOzs7OztXQUtHO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1lBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2lCQUMvQyxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQ3pDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdGLENBQUM7UUFFRCxvQ0FBb0M7UUFDOUIsVUFBVTs7Z0JBQ2QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLENBQUM7U0FBQTtRQUVELGdDQUFnQztRQUMxQixNQUFNOztnQkFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFB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SUFDOUQsK0JBQVksR0FBRyxnQkFBZ0IsQ0FBQztJQTJEekMseUJBQUM7S0FBQTtTQTdEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0RWxlbWVudCwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVycywgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW1lbnUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRNZW51YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1lbnUtdHJpZ2dlcic7XG5cbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcblxuICAvLyBUT0RPOiBwb3RlbnRpYWxseSBleHRlbmQgTWF0QnV0dG9uSGFybmVzc1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRNZW51SGFybmVzc2AgdGhhdCBtZWV0cyBjZXJ0YWluXG4gICAqIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbWVudSBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBNZW51SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TWVudUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RyaWdnZXJUZXh0Jywgb3B0aW9ucy50cmlnZ2VyVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUcmlnZ2VyVGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLl9nZXRNZW51UGFuZWwoKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgbWVudSdzIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0VHJpZ2dlclRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIGFzeW5jIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG1lbnUuICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fZ2V0TWVudVBhbmVsKCk7XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICByZXR1cm4gcGFuZWwuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiBgTWF0TWVudUl0ZW1IYXJuZXNzYCByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIGluIHRoZSBtZW51LlxuICAgKiBAcGFyYW0gZmlsdGVycyBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggbWVudSBpdGVtcyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRJdGVtcyhmaWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRNZW51SXRlbUhhcm5lc3NbXT4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgaWYgKHBhbmVsSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICAgICAgTWF0TWVudUl0ZW1IYXJuZXNzLndpdGgoey4uLmZpbHRlcnMsIGFuY2VzdG9yOiBgIyR7cGFuZWxJZH1gfSkpKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGlja3MgYW4gaXRlbSBpbiB0aGUgbWVudSwgYW5kIG9wdGlvbmFsbHkgY29udGludWVzIGNsaWNraW5nIGl0ZW1zIGluIHN1YnNlcXVlbnQgc3ViLW1lbnVzLlxuICAgKiBAcGFyYW0gaXRlbUZpbHRlciBBIGZpbHRlciB1c2VkIHRvIHJlcHJlc2VudCB3aGljaCBpdGVtIGluIHRoZSBtZW51IHNob3VsZCBiZSBjbGlja2VkLiBUaGVcbiAgICogICAgIGZpcnN0IG1hdGNoaW5nIG1lbnUgaXRlbSB3aWxsIGJlIGNsaWNrZWQuXG4gICAqIEBwYXJhbSBzdWJJdGVtRmlsdGVycyBBIGxpc3Qgb2YgZmlsdGVycyByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIHRvIGNsaWNrIGluIGFueSBzdWJzZXF1ZW50XG4gICAqICAgICBzdWItbWVudXMuIFRoZSBmaXJzdCBpdGVtIGluIHRoZSBzdWItbWVudSBtYXRjaGluZyB0aGUgY29ycmVzcG9uZGluZyBmaWx0ZXIgaW5cbiAgICogICAgIGBzdWJJdGVtRmlsdGVyc2Agd2lsbCBiZSBjbGlja2VkLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tJdGVtKFxuICAgICAgaXRlbUZpbHRlcjogT21pdDxNZW51SXRlbUhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPixcbiAgICAgIC4uLnN1Ykl0ZW1GaWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0SXRlbXMoaXRlbUZpbHRlcik7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCBpdGVtIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoaXRlbUZpbHRlcil9YCk7XG4gICAgfVxuXG4gICAgaWYgKCFzdWJJdGVtRmlsdGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBhd2FpdCBpdGVtc1swXS5jbGljaygpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnUgPSBhd2FpdCBpdGVtc1swXS5nZXRTdWJtZW51KCk7XG4gICAgaWYgKCFtZW51KSB7XG4gICAgICB0aHJvdyBFcnJvcihgSXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGl0ZW1GaWx0ZXIpfSBkb2VzIG5vdCBoYXZlIGEgc3VibWVudWApO1xuICAgIH1cbiAgICByZXR1cm4gbWVudS5jbGlja0l0ZW0oLi4uc3ViSXRlbUZpbHRlcnMgYXMgW09taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz5dKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtZW51IHBhbmVsIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldE1lbnVQYW5lbCgpOiBQcm9taXNlPFRlc3RFbGVtZW50IHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgcmV0dXJuIHBhbmVsSWQgPyB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChgIyR7cGFuZWxJZH1gKSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpZCBvZiB0aGUgbWVudSBwYW5lbCBhc3NvY2lhdGVkIHdpdGggdGhpcyBtZW51LiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRQYW5lbElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIHJldHVybiBwYW5lbElkIHx8IG51bGw7XG4gIH1cbn1cblxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51LWl0ZW0gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudUl0ZW1gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWVudS1pdGVtJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0TWVudUl0ZW1IYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBtZW51IGl0ZW0gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2hhc1N1Ym1lbnUnLCBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzU3VibWVudSkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzU3VibWVudSgpKSA9PT0gaGFzU3VibWVudSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgb2YgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBDbGlja3MgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgY2xpY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaXRlbSBoYXMgYSBzdWJtZW51LiAqL1xuICBhc3luYyBoYXNTdWJtZW51KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLm1hdGNoZXNTZWxlY3RvcihNYXRNZW51SGFybmVzcy5ob3N0U2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN1Ym1lbnUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudSBpdGVtLCBvciBudWxsIGlmIG5vbmUuICovXG4gIGFzeW5jIGdldFN1Ym1lbnUoKTogUHJvbWlzZTxNYXRNZW51SGFybmVzcyB8IG51bGw+IHtcbiAgICBpZiAoYXdhaXQgdGhpcy5oYXNTdWJtZW51KCkpIHtcbiAgICAgIHJldHVybiBuZXcgTWF0TWVudUhhcm5lc3ModGhpcy5sb2NhdG9yRmFjdG9yeSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=