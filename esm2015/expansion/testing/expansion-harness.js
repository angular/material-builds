/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
const EXPANSION_PANEL_CONTENT_SELECTOR = '.mat-expansion-panel-content';
/** Harness for interacting with a standard mat-expansion-panel in tests. */
let MatExpansionPanelHarness = /** @class */ (() => {
    class MatExpansionPanelHarness extends ComponentHarness {
        constructor() {
            super(...arguments);
            this._header = this.locatorFor('.mat-expansion-panel-header');
            this._title = this.locatorForOptional('.mat-expansion-panel-header-title');
            this._description = this.locatorForOptional('.mat-expansion-panel-header-description');
            this._expansionIndicator = this.locatorForOptional('.mat-expansion-indicator');
            this._content = this.locatorFor(EXPANSION_PANEL_CONTENT_SELECTOR);
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for an expansion-panel
         * with specific attributes.
         * @param options Options for narrowing the search:
         *   - `title` finds an expansion-panel with a specific title text.
         *   - `description` finds an expansion-panel with a specific description text.
         *   - `expanded` finds an expansion-panel that is currently expanded.
         *   - `disabled` finds an expansion-panel that is disabled.
         * @return a `HarnessPredicate` configured with the given options.
         */
        static with(options = {}) {
            return new HarnessPredicate(MatExpansionPanelHarness, options)
                .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title))
                .addOption('description', options.description, (harness, description) => HarnessPredicate.stringMatches(harness.getDescription(), description))
                .addOption('content', options.content, (harness, content) => HarnessPredicate.stringMatches(harness.getTextContent(), content))
                .addOption('expanded', options.expanded, (harness, expanded) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isExpanded()) === expanded; }))
                .addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isDisabled()) === disabled; }));
        }
        /** Whether the panel is expanded. */
        isExpanded() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).hasClass('mat-expanded');
            });
        }
        /**
         * Gets the title text of the panel.
         * @returns Title text or `null` if no title is set up.
         */
        getTitle() {
            return __awaiter(this, void 0, void 0, function* () {
                const titleEl = yield this._title();
                return titleEl ? titleEl.text() : null;
            });
        }
        /**
         * Gets the description text of the panel.
         * @returns Description text or `null` if no description is set up.
         */
        getDescription() {
            return __awaiter(this, void 0, void 0, function* () {
                const descriptionEl = yield this._description();
                return descriptionEl ? descriptionEl.text() : null;
            });
        }
        /** Whether the panel is disabled. */
        isDisabled() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield (yield this._header()).getAttribute('aria-disabled')) === 'true';
            });
        }
        /**
         * Toggles the expanded state of the panel by clicking on the panel
         * header. This method will not work if the panel is disabled.
         */
        toggle() {
            return __awaiter(this, void 0, void 0, function* () {
                yield (yield this._header()).click();
            });
        }
        /** Expands the expansion panel if collapsed. */
        expand() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.isExpanded())) {
                    yield this.toggle();
                }
            });
        }
        /** Collapses the expansion panel if expanded. */
        collapse() {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield this.isExpanded()) {
                    yield this.toggle();
                }
            });
        }
        /** Gets the text content of the panel. */
        getTextContent() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._content()).text();
            });
        }
        /**
         * Gets a `HarnessLoader` that can be used to load harnesses for
         * components within the panel's content area.
         */
        getHarnessLoaderForContent() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.locatorFactory.harnessLoaderFor(EXPANSION_PANEL_CONTENT_SELECTOR);
            });
        }
        /** Focuses the panel. */
        focus() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._header()).focus();
            });
        }
        /** Blurs the panel. */
        blur() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._header()).blur();
            });
        }
        /** Whether the panel is focused. */
        isFocused() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._header()).isFocused();
            });
        }
        /** Whether the panel has a toggle indicator displayed. */
        hasToggleIndicator() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._expansionIndicator()) !== null;
            });
        }
        /** Gets the position of the toggle indicator. */
        getToggleIndicatorPosition() {
            return __awaiter(this, void 0, void 0, function* () {
                // By default the expansion indicator will show "after" the panel header content.
                if (yield (yield this._header()).hasClass('mat-expansion-toggle-indicator-before')) {
                    return 'before';
                }
                return 'after';
            });
        }
    }
    MatExpansionPanelHarness.hostSelector = '.mat-expansion-panel';
    return MatExpansionPanelHarness;
})();
export { MatExpansionPanelHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL3Rlc3RpbmcvZXhwYW5zaW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBaUIsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUd2RixNQUFNLGdDQUFnQyxHQUFHLDhCQUE4QixDQUFDO0FBRXhFLDRFQUE0RTtBQUM1RTtJQUFBLE1BQWEsd0JBQXlCLFNBQVEsZ0JBQWdCO1FBQTlEOztZQUdVLFlBQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDekQsV0FBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3RFLGlCQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHlDQUF5QyxDQUFDLENBQUM7WUFDbEYsd0JBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDMUUsYUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQTRIdkUsQ0FBQztRQTFIQzs7Ozs7Ozs7O1dBU0c7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXdDLEVBQUU7WUFFcEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQztpQkFDekQsU0FBUyxDQUNOLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUN0QixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ2pGLFNBQVMsQ0FDTixhQUFhLEVBQUUsT0FBTyxD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LENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN4QyxDQUFDO1NBQUE7UUFFRCx1QkFBdUI7UUFDakIsSUFBSTs7Z0JBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkMsQ0FBQztTQUFBO1FBRUQsb0NBQW9DO1FBQzlCLFNBQVM7O2dCQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzVDLENBQUM7U0FBQTtRQUVELDBEQUEwRDtRQUNwRCxrQkFBa0I7O2dCQUN0QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztZQUNyRCxDQUFDO1NBQUE7UUFFRCxpREFBaUQ7UUFDM0MsMEJBQTBCOztnQkFDOUIsaUZBQWlGO2dCQUNqRixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFO29CQUNsRixPQUFPLFFBQVEsQ0FBQztpQkFDakI7Z0JBQ0QsT0FBTyxPQUFPLENBQUM7WUFDakIsQ0FBQztTQUFBOztJQWpJTSxxQ0FBWSxHQUFHLHNCQUFzQixDQUFDO0lBa0kvQywrQkFBQztLQUFBO1NBbklZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NMb2FkZXIsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RXhwYW5zaW9uUGFuZWxIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9leHBhbnNpb24taGFybmVzcy1maWx0ZXJzJztcblxuY29uc3QgRVhQQU5TSU9OX1BBTkVMX0NPTlRFTlRfU0VMRUNUT1IgPSAnLm1hdC1leHBhbnNpb24tcGFuZWwtY29udGVudCc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWV4cGFuc2lvbi1wYW5lbCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWV4cGFuc2lvbi1wYW5lbCc7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXInKTtcbiAgcHJpdmF0ZSBfdGl0bGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLXRpdGxlJyk7XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbicpO1xuICBwcml2YXRlIF9leHBhbnNpb25JbmRpY2F0b3IgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1leHBhbnNpb24taW5kaWNhdG9yJyk7XG4gIHByaXZhdGUgX2NvbnRlbnQgPSB0aGlzLmxvY2F0b3JGb3IoRVhQQU5TSU9OX1BBTkVMX0NPTlRFTlRfU0VMRUNUT1IpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhbiBleHBhbnNpb24tcGFuZWxcbiAgICogd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGB0aXRsZWAgZmluZHMgYW4gZXhwYW5zaW9uLXBhbmVsIHdpdGggYSBzcGVjaWZpYyB0aXRsZSB0ZXh0LlxuICAgKiAgIC0gYGRlc2NyaXB0aW9uYCBmaW5kcyBhbiBleHBhbnNpb24tcGFuZWwgd2l0aCBhIHNwZWNpZmljIGRlc2NyaXB0aW9uIHRleHQuXG4gICAqICAgLSBgZXhwYW5kZWRgIGZpbmRzIGFuIGV4cGFuc2lvbi1wYW5lbCB0aGF0IGlzIGN1cnJlbnRseSBleHBhbmRlZC5cbiAgICogICAtIGBkaXNhYmxlZGAgZmluZHMgYW4gZXhwYW5zaW9uLXBhbmVsIHRoYXQgaXMgZGlzYWJsZWQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRXhwYW5zaW9uUGFuZWxIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0RXhwYW5zaW9uUGFuZWxIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEV4cGFuc2lvblBhbmVsSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICd0aXRsZScsIG9wdGlvbnMudGl0bGUsXG4gICAgICAgICAgICAoaGFybmVzcywgdGl0bGUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRpdGxlKCksIHRpdGxlKSlcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdkZXNjcmlwdGlvbicsIG9wdGlvbnMuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAoaGFybmVzcywgZGVzY3JpcHRpb24pID0+XG4gICAgICAgICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0RGVzY3JpcHRpb24oKSwgZGVzY3JpcHRpb24pKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ2NvbnRlbnQnLCBvcHRpb25zLmNvbnRlbnQsXG4gICAgICAgICAgICAoaGFybmVzcywgY29udGVudCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dENvbnRlbnQoKSwgY29udGVudCkpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnZXhwYW5kZWQnLCBvcHRpb25zLmV4cGFuZGVkLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGV4cGFuZGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0V4cGFuZGVkKCkpID09PSBleHBhbmRlZClcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdkaXNhYmxlZCcsIG9wdGlvbnMuZGlzYWJsZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgYXN5bmMgaXNFeHBhbmRlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWV4cGFuZGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdGl0bGUgdGV4dCBvZiB0aGUgcGFuZWwuXG4gICAqIEByZXR1cm5zIFRpdGxlIHRleHQgb3IgYG51bGxgIGlmIG5vIHRpdGxlIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGdldFRpdGxlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCB0aXRsZUVsID0gYXdhaXQgdGhpcy5fdGl0bGUoKTtcbiAgICByZXR1cm4gdGl0bGVFbCA/IHRpdGxlRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkZXNjcmlwdGlvbiB0ZXh0IG9mIHRoZSBwYW5lbC5cbiAgICogQHJldHVybnMgRGVzY3JpcHRpb24gdGV4dCBvciBgbnVsbGAgaWYgbm8gZGVzY3JpcHRpb24gaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgZ2V0RGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uRWwgPSBhd2FpdCB0aGlzLl9kZXNjcmlwdGlvbigpO1xuICAgIHJldHVybiBkZXNjcmlwdGlvbkVsID8gZGVzY3JpcHRpb25FbC50ZXh0KCkgOiBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBhbmVsIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIHBhbmVsIGJ5IGNsaWNraW5nIG9uIHRoZSBwYW5lbFxuICAgKiBoZWFkZXIuIFRoaXMgbWV0aG9kIHdpbGwgbm90IHdvcmsgaWYgdGhlIHBhbmVsIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLl9oZWFkZXIoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBFeHBhbmRzIHRoZSBleHBhbnNpb24gcGFuZWwgaWYgY29sbGFwc2VkLiAqL1xuICBhc3luYyBleHBhbmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzRXhwYW5kZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29sbGFwc2VzIHRoZSBleHBhbnNpb24gcGFuZWwgaWYgZXhwYW5kZWQuICovXG4gIGFzeW5jIGNvbGxhcHNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzRXhwYW5kZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0VGV4dENvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NvbnRlbnQoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc0xvYWRlcmAgdGhhdCBjYW4gYmUgdXNlZCB0byBsb2FkIGhhcm5lc3NlcyBmb3JcbiAgICogY29tcG9uZW50cyB3aXRoaW4gdGhlIHBhbmVsJ3MgY29udGVudCBhcmVhLlxuICAgKi9cbiAgYXN5bmMgZ2V0SGFybmVzc0xvYWRlckZvckNvbnRlbnQoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZhY3RvcnkuaGFybmVzc0xvYWRlckZvcihFWFBBTlNJT05fUEFORUxfQ09OVEVOVF9TRUxFQ1RPUik7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHBhbmVsLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9oZWFkZXIoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcGFuZWwgaGFzIGEgdG9nZ2xlIGluZGljYXRvciBkaXNwbGF5ZWQuICovXG4gIGFzeW5jIGhhc1RvZ2dsZUluZGljYXRvcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2V4cGFuc2lvbkluZGljYXRvcigpKSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgdG9nZ2xlIGluZGljYXRvci4gKi9cbiAgYXN5bmMgZ2V0VG9nZ2xlSW5kaWNhdG9yUG9zaXRpb24oKTogUHJvbWlzZTwnYmVmb3JlJ3wnYWZ0ZXInPiB7XG4gICAgLy8gQnkgZGVmYXVsdCB0aGUgZXhwYW5zaW9uIGluZGljYXRvciB3aWxsIHNob3cgXCJhZnRlclwiIHRoZSBwYW5lbCBoZWFkZXIgY29udGVudC5cbiAgICBpZiAoYXdhaXQgKGF3YWl0IHRoaXMuX2hlYWRlcigpKS5oYXNDbGFzcygnbWF0LWV4cGFuc2lvbi10b2dnbGUtaW5kaWNhdG9yLWJlZm9yZScpKSB7XG4gICAgICByZXR1cm4gJ2JlZm9yZSc7XG4gICAgfVxuICAgIHJldHVybiAnYWZ0ZXInO1xuICB9XG59XG4iXX0=