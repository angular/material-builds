/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatTabHarness } from './tab-harness';
/**
 * Harness for interacting with a standard mat-tab-group in tests.
 * @dynamic
 */
export class MatTabGroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._tabs = this.locatorForAll(MatTabHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-button with
     * specific attributes.
     * @param options Options for narrowing the search
     *   - `selector` finds a tab-group whose host element matches the given selector.
     *   - `selectedTabLabel` finds a tab-group with a selected tab that matches the
     *      specified tab label.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabGroupHarness, options)
            .addOption('selectedTabLabel', options.selectedTabLabel, (harness, label) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const selectedTab = yield harness.getSelectedTab();
            return HarnessPredicate.stringMatches(yield selectedTab.getLabel(), label);
        }));
    }
    /** Gets all tabs of the tab group. */
    getTabs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._tabs();
        });
    }
    /** Gets the selected tab of the tab group. */
    getSelectedTab() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tabs = yield this.getTabs();
            const isSelected = yield Promise.all(tabs.map(t => t.isSelected()));
            for (let i = 0; i < tabs.length; i++) {
                if (isSelected[i]) {
                    return tabs[i];
                }
            }
            throw new Error('No selected tab could be found.');
        });
    }
}
MatTabGroupHarness.hostSelector = '.mat-tab-group';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVDOzs7R0FHRztBQUNILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFBeEQ7O1FBb0JVLFVBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBa0JwRCxDQUFDO0lBbkNDOzs7Ozs7OztPQVFHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUM7YUFDbkQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFPLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNoRixNQUFNLFdBQVcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxNQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUlELHNDQUFzQztJQUNoQyxPQUFPOztZQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUM7S0FBQTtJQUVELDhDQUE4QztJQUN4QyxjQUFjOztZQUNsQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQyxNQUFNLFVBQVUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNqQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEI7YUFDRjtZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7O0FBcENNLCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYkdyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdGFiLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdFRhYkhhcm5lc3N9IGZyb20gJy4vdGFiLWhhcm5lc3MnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtdGFiLWdyb3VwIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYkdyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtdGFiLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSByYWRpby1idXR0b24gd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIHRhYi1ncm91cCB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgc2VsZWN0ZWRUYWJMYWJlbGAgZmluZHMgYSB0YWItZ3JvdXAgd2l0aCBhIHNlbGVjdGVkIHRhYiB0aGF0IG1hdGNoZXMgdGhlXG4gICAqICAgICAgc3BlY2lmaWVkIHRhYiBsYWJlbC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUYWJHcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRhYkdyb3VwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRUYWJHcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3NlbGVjdGVkVGFiTGFiZWwnLCBvcHRpb25zLnNlbGVjdGVkVGFiTGFiZWwsIGFzeW5jIChoYXJuZXNzLCBsYWJlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGFiID0gYXdhaXQgaGFybmVzcy5nZXRTZWxlY3RlZFRhYigpO1xuICAgICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgc2VsZWN0ZWRUYWIuZ2V0TGFiZWwoKSwgbGFiZWwpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3RhYnMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0VGFiSGFybmVzcyk7XG5cbiAgLyoqIEdldHMgYWxsIHRhYnMgb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgZ2V0VGFicygpOiBQcm9taXNlPE1hdFRhYkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl90YWJzKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0ZWQgdGFiIG9mIHRoZSB0YWIgZ3JvdXAuICovXG4gIGFzeW5jIGdldFNlbGVjdGVkVGFiKCk6IFByb21pc2U8TWF0VGFiSGFybmVzcz4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0aGlzLmdldFRhYnMoKTtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gYXdhaXQgUHJvbWlzZS5hbGwodGFicy5tYXAodCA9PiB0LmlzU2VsZWN0ZWQoKSkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGlzU2VsZWN0ZWRbaV0pIHtcbiAgICAgICAgcmV0dXJuIHRhYnNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignTm8gc2VsZWN0ZWQgdGFiIGNvdWxkIGJlIGZvdW5kLicpO1xuICB9XG59XG4iXX0=