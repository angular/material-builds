/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatTabHarness } from './tab-harness';
/** Harness for interacting with a standard mat-tab-group in tests. */
export class MatTabGroupHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabGroupHarness, options)
            .addOption('selectedTabLabel', options.selectedTabLabel, async (harness, label) => {
            const selectedTab = await harness.getSelectedTab();
            return HarnessPredicate.stringMatches(await selectedTab.getLabel(), label);
        });
    }
    /**
     * Gets the list of tabs in the tab group.
     * @param filter Optionally filters which tabs are included.
     */
    async getTabs(filter = {}) {
        return this.locatorForAll(MatTabHarness.with(filter))();
    }
    /** Gets the selected tab of the tab group. */
    async getSelectedTab() {
        const tabs = await this.getTabs();
        const isSelected = await parallel(() => tabs.map(t => t.isSelected()));
        for (let i = 0; i < tabs.length; i++) {
            if (isSelected[i]) {
                return tabs[i];
            }
        }
        throw new Error('No selected tab could be found.');
    }
    /**
     * Selects a tab in this tab group.
     * @param filter An optional filter to apply to the child tabs. The first tab matching the filter
     *     will be selected.
     */
    async selectTab(filter = {}) {
        const tabs = await this.getTabs(filter);
        if (!tabs.length) {
            throw Error(`Cannot find mat-tab matching filter ${JSON.stringify(filter)}`);
        }
        await tabs[0].select();
    }
}
/** The selector for the host element of a `MatTabGroup` instance. */
MatTabGroupHarness.hostSelector = '.mat-tab-group';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVDLHNFQUFzRTtBQUN0RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0JBQWdCO0lBSXREOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUM7YUFDbkQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2hGLE1BQU0sV0FBVyxHQUFHLE1BQU0sT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE1BQU0sV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBNEIsRUFBRTtRQUMxQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDMUQsQ0FBQztJQUVELDhDQUE4QztJQUM5QyxLQUFLLENBQUMsY0FBYztRQUNsQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEI7U0FDRjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBNEIsRUFBRTtRQUM1QyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsTUFBTSxLQUFLLENBQUMsdUNBQXVDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDekIsQ0FBQzs7QUFoREQscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtUYWJHcm91cEhhcm5lc3NGaWx0ZXJzLCBUYWJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90YWItaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0VGFiSGFybmVzc30gZnJvbSAnLi90YWItaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRhYi1ncm91cCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJHcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRUYWJHcm91cGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10YWItZ3JvdXAnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRUYWJHcm91cEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHRhYiBncm91cCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUYWJHcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRhYkdyb3VwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRUYWJHcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3NlbGVjdGVkVGFiTGFiZWwnLCBvcHRpb25zLnNlbGVjdGVkVGFiTGFiZWwsIGFzeW5jIChoYXJuZXNzLCBsYWJlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGFiID0gYXdhaXQgaGFybmVzcy5nZXRTZWxlY3RlZFRhYigpO1xuICAgICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgc2VsZWN0ZWRUYWIuZ2V0TGFiZWwoKSwgbGFiZWwpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsaXN0IG9mIHRhYnMgaW4gdGhlIHRhYiBncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggdGFicyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRUYWJzKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0VGFiSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRUYWJIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RlZCB0YWIgb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgZ2V0U2VsZWN0ZWRUYWIoKTogUHJvbWlzZTxNYXRUYWJIYXJuZXNzPiB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IHRoaXMuZ2V0VGFicygpO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiB0YWJzLm1hcCh0ID0+IHQuaXNTZWxlY3RlZCgpKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXNTZWxlY3RlZFtpXSkge1xuICAgICAgICByZXR1cm4gdGFic1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzZWxlY3RlZCB0YWIgY291bGQgYmUgZm91bmQuJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBhIHRhYiBpbiB0aGlzIHRhYiBncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBBbiBvcHRpb25hbCBmaWx0ZXIgdG8gYXBwbHkgdG8gdGhlIGNoaWxkIHRhYnMuIFRoZSBmaXJzdCB0YWIgbWF0Y2hpbmcgdGhlIGZpbHRlclxuICAgKiAgICAgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIHNlbGVjdFRhYihmaWx0ZXI6IFRhYkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB0YWJzID0gYXdhaXQgdGhpcy5nZXRUYWJzKGZpbHRlcik7XG4gICAgaWYgKCF0YWJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbm5vdCBmaW5kIG1hdC10YWIgbWF0Y2hpbmcgZmlsdGVyICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgdGFic1swXS5zZWxlY3QoKTtcbiAgfVxufVxuIl19