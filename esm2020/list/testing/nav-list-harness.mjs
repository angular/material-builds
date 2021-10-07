/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { getListItemPredicate, MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-nav-list in tests. */
export class MatNavListHarness extends MatListHarnessBase {
    constructor() {
        super(...arguments);
        this._itemHarness = MatNavListItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which nav list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNavListHarness, options);
    }
}
/** The selector for the host element of a `MatNavList` instance. */
MatNavListHarness.hostSelector = '.mat-nav-list';
/** Harness for interacting with a nav list item. */
export class MatNavListItemHarness extends MatListItemHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which nav list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(MatNavListItemHarness, options)
            .addOption('href', options.href, async (harness, href) => HarnessPredicate.stringMatches(harness.getHref(), href));
    }
    /** Gets the href for this nav list item. */
    async getHref() {
        return (await this.host()).getAttribute('href');
    }
    /** Clicks on the nav list item. */
    async click() {
        return (await this.host()).click();
    }
    /** Focuses the nav list item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the nav list item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the nav list item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
}
/** The selector for the host element of a `MatListItem` instance. */
MatNavListItemHarness.hostSelector = `${MatNavListHarness.hostSelector} .mat-list-item`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWxpc3QtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbmF2LWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RixxRUFBcUU7QUFDckUsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGtCQUM0QztJQURuRjs7UUFlVyxpQkFBWSxHQUFHLHFCQUFxQixDQUFDO0lBQ2hELENBQUM7SUFYQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBaUMsRUFBRTtRQUM3QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7QUFYRCxvRUFBb0U7QUFDN0QsOEJBQVksR0FBRyxlQUFlLENBQUM7QUFleEMsb0RBQW9EO0FBQ3BELE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxzQkFBc0I7SUFJL0Q7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXFDLEVBQUU7UUFDakQsT0FBTyxvQkFBb0IsQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLENBQUM7YUFDdEQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRCw0Q0FBNEM7SUFDNUMsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLEtBQUs7UUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsK0JBQStCO0lBQy9CLEtBQUssQ0FBQyxJQUFJO1FBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxLQUFLLENBQUMsU0FBUztRQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3pDLENBQUM7O0FBdENELHFFQUFxRTtBQUM5RCxrQ0FBWSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxpQkFBaUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0TGlzdEhhcm5lc3NCYXNlfSBmcm9tICcuL2xpc3QtaGFybmVzcy1iYXNlJztcbmltcG9ydCB7TmF2TGlzdEhhcm5lc3NGaWx0ZXJzLCBOYXZMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7Z2V0TGlzdEl0ZW1QcmVkaWNhdGUsIE1hdExpc3RJdGVtSGFybmVzc0Jhc2V9IGZyb20gJy4vbGlzdC1pdGVtLWhhcm5lc3MtYmFzZSc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW5hdi1saXN0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE5hdkxpc3RIYXJuZXNzIGV4dGVuZHMgTWF0TGlzdEhhcm5lc3NCYXNlPFxuICAgIHR5cGVvZiBNYXROYXZMaXN0SXRlbUhhcm5lc3MsIE1hdE5hdkxpc3RJdGVtSGFybmVzcywgTmF2TGlzdEl0ZW1IYXJuZXNzRmlsdGVycz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdE5hdkxpc3RgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbmF2LWxpc3QnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXROYXZMaXN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbmF2IGxpc3QgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTmF2TGlzdEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdE5hdkxpc3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdE5hdkxpc3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9pdGVtSGFybmVzcyA9IE1hdE5hdkxpc3RJdGVtSGFybmVzcztcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBuYXYgbGlzdCBpdGVtLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE5hdkxpc3RJdGVtSGFybmVzcyBleHRlbmRzIE1hdExpc3RJdGVtSGFybmVzc0Jhc2Uge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdExpc3RJdGVtYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9IGAke01hdE5hdkxpc3RIYXJuZXNzLmhvc3RTZWxlY3Rvcn0gLm1hdC1saXN0LWl0ZW1gO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXROYXZMaXN0SXRlbUhhcm5lc3NgIHRoYXRcbiAgICogbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIG5hdiBsaXN0IGl0ZW0gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTmF2TGlzdEl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXROYXZMaXN0SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0TGlzdEl0ZW1QcmVkaWNhdGUoTWF0TmF2TGlzdEl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdocmVmJywgb3B0aW9ucy5ocmVmLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGhyZWYpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldEhyZWYoKSwgaHJlZikpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGhyZWYgZm9yIHRoaXMgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0SHJlZigpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgfVxuXG4gIC8qKiBDbGlja3Mgb24gdGhlIG5hdiBsaXN0IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbmF2IGxpc3QgaXRlbSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cbn1cbiJdfQ==