/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel, } from '@angular/cdk/testing';
import { MatTabHarness } from './tab-harness';
/** Harness for interacting with a mat-tab-group in tests. */
export class MatTabGroupHarness extends ComponentHarness {
    /** The selector for the host element of a `MatTabGroup` instance. */
    static { this.hostSelector = '.mat-mdc-tab-group'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tab group with specific attributes.
     * @param options Options for filtering which tab group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('selectedTabLabel', options.selectedTabLabel, async (harness, label) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBQ2hCLFFBQVEsR0FDVCxNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUMsNkRBQTZEO0FBQzdELE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFDdEQscUVBQXFFO2FBQzlELGlCQUFZLEdBQUcsb0JBQW9CLENBQUM7SUFFM0M7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBa0MsRUFBRTtRQUVwQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDbEQsa0JBQWtCLEVBQ2xCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFDeEIsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN2QixNQUFNLFdBQVcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxNQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQTRCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFELENBQUM7SUFFRCw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNsQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBNEIsRUFBRTtRQUM1QyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQixNQUFNLEtBQUssQ0FBQyx1Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUNELE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBwYXJhbGxlbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtUYWJHcm91cEhhcm5lc3NGaWx0ZXJzLCBUYWJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90YWItaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0VGFiSGFybmVzc30gZnJvbSAnLi90YWItaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbWF0LXRhYi1ncm91cCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJHcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRUYWJHcm91cGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtdGFiLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWIgZ3JvdXAgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggdGFiIGdyb3VwIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRUYWJHcm91cEhhcm5lc3M+KFxuICAgIHRoaXM6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgICBvcHRpb25zOiBUYWJHcm91cEhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8VD4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0aGlzLCBvcHRpb25zKS5hZGRPcHRpb24oXG4gICAgICAnc2VsZWN0ZWRUYWJMYWJlbCcsXG4gICAgICBvcHRpb25zLnNlbGVjdGVkVGFiTGFiZWwsXG4gICAgICBhc3luYyAoaGFybmVzcywgbGFiZWwpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRUYWIgPSBhd2FpdCBoYXJuZXNzLmdldFNlbGVjdGVkVGFiKCk7XG4gICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgc2VsZWN0ZWRUYWIuZ2V0TGFiZWwoKSwgbGFiZWwpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxpc3Qgb2YgdGFicyBpbiB0aGUgdGFiIGdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCB0YWJzIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldFRhYnMoZmlsdGVyOiBUYWJIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRUYWJIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFRhYkhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNlbGVjdGVkIHRhYiBvZiB0aGUgdGFiIGdyb3VwLiAqL1xuICBhc3luYyBnZXRTZWxlY3RlZFRhYigpOiBQcm9taXNlPE1hdFRhYkhhcm5lc3M+IHtcbiAgICBjb25zdCB0YWJzID0gYXdhaXQgdGhpcy5nZXRUYWJzKCk7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IHRhYnMubWFwKHQgPT4gdC5pc1NlbGVjdGVkKCkpKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpc1NlbGVjdGVkW2ldKSB7XG4gICAgICAgIHJldHVybiB0YWJzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNlbGVjdGVkIHRhYiBjb3VsZCBiZSBmb3VuZC4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGEgdGFiIGluIHRoaXMgdGFiIGdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2hpbGQgdGFicy4gVGhlIGZpcnN0IHRhYiBtYXRjaGluZyB0aGUgZmlsdGVyXG4gICAqICAgICB3aWxsIGJlIHNlbGVjdGVkLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0VGFiKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0aGlzLmdldFRhYnMoZmlsdGVyKTtcbiAgICBpZiAoIXRhYnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LXRhYiBtYXRjaGluZyBmaWx0ZXIgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICBhd2FpdCB0YWJzWzBdLnNlbGVjdCgpO1xuICB9XG59XG4iXX0=