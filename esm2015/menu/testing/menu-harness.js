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
export class MatMenuHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    // TODO: potentially extend MatButtonHarness
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a menu whose host element matches the given selector.
     *   - `label` finds a menu with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatMenuHarness, options)
            .addOption('triggerText', options.triggerText, (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
    }
    /** Gets a boolean promise indicating if the menu is disabled. */
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
    getTriggerText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isOpen())) {
                return (yield this.host()).click();
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._getMenuPanel();
            if (panel) {
                return panel.sendKeys(TestKey.ESCAPE);
            }
        });
    }
    getItems(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield this._getPanelId();
            if (panelId) {
                return this._documentRootLocator.locatorForAll(MatMenuItemHarness.with(Object.assign(Object.assign({}, filters), { ancestor: `#${panelId}` })))();
            }
            return [];
        });
    }
    clickItem(filter, ...filters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.open();
            const items = yield this.getItems(filter);
            if (!items.length) {
                throw Error(`Could not find item matching ${JSON.stringify(filter)}`);
            }
            if (!filters.length) {
                return yield items[0].click();
            }
            const menu = yield items[0].getSubmenu();
            if (!menu) {
                throw Error(`Item matching ${JSON.stringify(filter)} does not have a submenu`);
            }
            return menu.clickItem(...filters);
        });
    }
    _getMenuPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield this._getPanelId();
            return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
        });
    }
    _getPanelId() {
        return __awaiter(this, void 0, void 0, function* () {
            const panelId = yield (yield this.host()).getAttribute('aria-controls');
            return panelId || null;
        });
    }
}
MatMenuHarness.hostSelector = '.mat-menu-trigger';
/** Harness for interacting with a standard mat-menu-item in tests. */
export class MatMenuItemHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a menu item whose host element matches the given selector.
     *   - `label` finds a menu item with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatMenuItemHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('hasSubmenu', options.hasSubmenu, (harness, hasSubmenu) => __awaiter(this, void 0, void 0, function* () { return (yield harness.hasSubmenu()) === hasSubmenu; }));
    }
    /** Gets a boolean promise indicating if the menu is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
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
MatMenuItemHarness.hostSelector = '.mat-menu-item';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBZSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxpRUFBaUU7QUFDakUsTUFBTSxPQUFPLGNBQWUsU0FBUSxnQkFBZ0I7SUFBcEQ7O1FBR1UseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUE2Rm5FLENBQUM7SUEzRkMsNENBQTRDO0lBRTVDOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBOEIsRUFBRTtRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQzthQUMvQyxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQ3pDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCxpRUFBaUU7SUFDM0QsVUFBVTs7WUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlELE9BQU8scUJBQXFCLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFRCxnQ0FBZ0M7SUFDMUIsTUFBTTs7WUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEs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RkFBNEY7SUFDdEYsSUFBSTs7WUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRCw0QkFBNEI7SUFDdEIsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCx1Q0FBdUM7SUFDakMsVUFBVTs7WUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFFLENBQUM7S0FBQTtJQUVELHdFQUF3RTtJQUNsRSxVQUFVOztZQUNkLElBQUksTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQzNCLE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7O0FBckRNLCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0RWxlbWVudCwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVycywgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW1lbnUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1lbnUtdHJpZ2dlcic7XG5cbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcblxuICAvLyBUT0RPOiBwb3RlbnRpYWxseSBleHRlbmQgTWF0QnV0dG9uSGFybmVzc1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIG1lbnUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBtZW51IHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBsYWJlbGAgZmluZHMgYSBtZW51IHdpdGggc3BlY2lmaWMgbGFiZWwgdGV4dC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBNZW51SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TWVudUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RyaWdnZXJUZXh0Jywgb3B0aW9ucy50cmlnZ2VyVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUcmlnZ2VyVGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpKTtcbiAgfVxuXG4gIGFzeW5jIGdldFRyaWdnZXJUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICBhc3luYyBvcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYW5lbCA9IGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpO1xuICAgIGlmIChwYW5lbCkge1xuICAgICAgcmV0dXJuIHBhbmVsLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRJdGVtcyhmaWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRNZW51SXRlbUhhcm5lc3NbXT4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgaWYgKHBhbmVsSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICAgICAgTWF0TWVudUl0ZW1IYXJuZXNzLndpdGgoey4uLmZpbHRlcnMsIGFuY2VzdG9yOiBgIyR7cGFuZWxJZH1gfSkpKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGFzeW5jIGNsaWNrSXRlbShmaWx0ZXI6IE9taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz4sXG4gICAgICAgICAgICAgICAgICAuLi5maWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0SXRlbXMoZmlsdGVyKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGl0ZW0gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cblxuICAgIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBhd2FpdCBpdGVtc1swXS5jbGljaygpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnUgPSBhd2FpdCBpdGVtc1swXS5nZXRTdWJtZW51KCk7XG4gICAgaWYgKCFtZW51KSB7XG4gICAgICB0aHJvdyBFcnJvcihgSXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9IGRvZXMgbm90IGhhdmUgYSBzdWJtZW51YCk7XG4gICAgfVxuICAgIHJldHVybiBtZW51LmNsaWNrSXRlbSguLi5maWx0ZXJzIGFzIFtPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+XSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXRNZW51UGFuZWwoKTogUHJvbWlzZTxUZXN0RWxlbWVudCB8IG51bGw+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgdGhpcy5fZ2V0UGFuZWxJZCgpO1xuICAgIHJldHVybiBwYW5lbElkID8gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYCMke3BhbmVsSWR9YCkoKSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXRQYW5lbElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIHJldHVybiBwYW5lbElkIHx8IG51bGw7XG4gIH1cbn1cblxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51LWl0ZW0gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZW51LWl0ZW0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIG1lbnUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBtZW51IGl0ZW0gd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIG1lbnUgaXRlbSB3aXRoIHNwZWNpZmljIGxhYmVsIHRleHQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2hhc1N1Ym1lbnUnLCBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzU3VibWVudSkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzU3VibWVudSgpKSA9PT0gaGFzU3VibWVudSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGl0ZW0gaGFzIGEgc3VibWVudS4gKi9cbiAgYXN5bmMgaGFzU3VibWVudSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tYXRjaGVzU2VsZWN0b3IoTWF0TWVudUhhcm5lc3MuaG9zdFNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzdWJtZW51IGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUgaXRlbSwgb3IgbnVsbCBpZiBub25lLiAqL1xuICBhc3luYyBnZXRTdWJtZW51KCk6IFByb21pc2U8TWF0TWVudUhhcm5lc3MgfCBudWxsPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaGFzU3VibWVudSgpKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdE1lbnVIYXJuZXNzKHRoaXMubG9jYXRvckZhY3RvcnkpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19