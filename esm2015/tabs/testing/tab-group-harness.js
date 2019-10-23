/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatTabHarness } from './tab-harness';
/**
 * Harness for interacting with a standard mat-tab-group in tests.
 * @dynamic
 */
export class MatTabGroupHarness extends ComponentHarness {
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
            .addOption('selectedTabLabel', options.selectedTabLabel, (harness, label) => __awaiter(this, void 0, void 0, function* () {
            const selectedTab = yield harness.getSelectedTab();
            return HarnessPredicate.stringMatches(yield selectedTab.getLabel(), label);
        }));
    }
    /** Gets all tabs of the tab group. */
    getTabs(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatTabHarness.with(filter))();
        });
    }
    /** Gets the selected tab of the tab group. */
    getSelectedTab() {
        return __awaiter(this, void 0, void 0, function* () {
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
    /** Selects a tab in this tab group. */
    selectTab(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const tabs = yield this.getTabs(filter);
            if (!tabs.length) {
                throw Error(`Cannot find mat-tab matching filter ${JSON.stringify(filter)}`);
            }
            yield tabs[0].select();
        });
    }
}
MatTabGroupHarness.hostSelector = '.mat-tab-group';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVDOzs7R0FHRztBQUNILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFHdEQ7Ozs7Ozs7O09BUUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQzthQUNuRCxTQUFTLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQU8sT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2hGLE1BQU0sV0FBVyxHQUFHLE1BQU0sT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE1BQU0sV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQsc0NBQXNDO0lBQ2hDLE9BQU8sQ0FBQyxTQUE0QixFQUFFOztZQUMxQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRUQsOENBQThDO0lBQ3hDLGNBQWM7O1lBQ2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLE1BQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoQjthQUNGO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtJQUVELHVDQUF1QztJQUNqQyxTQUFTLENBQUMsU0FBNEIsRUFBRTs7WUFDNUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNoQixNQUFNLEtBQUssQ0FBQyx1Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDOUU7WUFDRCxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixDQUFDO0tBQUE7O0FBM0NNLCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYkdyb3VwSGFybmVzc0ZpbHRlcnMsIFRhYkhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RhYi1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRUYWJIYXJuZXNzfSBmcm9tICcuL3RhYi1oYXJuZXNzJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRhYi1ncm91cCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJHcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRhYi1ncm91cCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tYnV0dG9uIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSB0YWItZ3JvdXAgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYHNlbGVjdGVkVGFiTGFiZWxgIGZpbmRzIGEgdGFiLWdyb3VwIHdpdGggYSBzZWxlY3RlZCB0YWIgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiAgICAgIHNwZWNpZmllZCB0YWIgbGFiZWwuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVGFiR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJHcm91cEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VGFiR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdzZWxlY3RlZFRhYkxhYmVsJywgb3B0aW9ucy5zZWxlY3RlZFRhYkxhYmVsLCBhc3luYyAoaGFybmVzcywgbGFiZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZFRhYiA9IGF3YWl0IGhhcm5lc3MuZ2V0U2VsZWN0ZWRUYWIoKTtcbiAgICAgICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IHNlbGVjdGVkVGFiLmdldExhYmVsKCksIGxhYmVsKTtcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgdGFicyBvZiB0aGUgdGFiIGdyb3VwLiAqL1xuICBhc3luYyBnZXRUYWJzKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0VGFiSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRUYWJIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RlZCB0YWIgb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgZ2V0U2VsZWN0ZWRUYWIoKTogUHJvbWlzZTxNYXRUYWJIYXJuZXNzPiB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IHRoaXMuZ2V0VGFicygpO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBhd2FpdCBQcm9taXNlLmFsbCh0YWJzLm1hcCh0ID0+IHQuaXNTZWxlY3RlZCgpKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXNTZWxlY3RlZFtpXSkge1xuICAgICAgICByZXR1cm4gdGFic1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzZWxlY3RlZCB0YWIgY291bGQgYmUgZm91bmQuJyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhIHRhYiBpbiB0aGlzIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgc2VsZWN0VGFiKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0aGlzLmdldFRhYnMoZmlsdGVyKTtcbiAgICBpZiAoIXRhYnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LXRhYiBtYXRjaGluZyBmaWx0ZXIgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICBhd2FpdCB0YWJzWzBdLnNlbGVjdCgpO1xuICB9XG59XG4iXX0=