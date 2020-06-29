/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { getListItemPredicate, MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-nav-list in tests. */
let MatNavListHarness = /** @class */ (() => {
    class MatNavListHarness extends MatListHarnessBase {
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
    MatNavListHarness.hostSelector = 'mat-nav-list';
    return MatNavListHarness;
})();
export { MatNavListHarness };
/** Harness for interacting with a nav list item. */
let MatNavListItemHarness = /** @class */ (() => {
    class MatNavListItemHarness extends MatListItemHarnessBase {
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatNavListItemHarness` that
         * meets certain criteria.
         * @param options Options for filtering which nav list item instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        static with(options = {}) {
            return getListItemPredicate(MatNavListItemHarness, options)
                .addOption('href', options.href, (harness, href) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(harness.getHref(), href); }));
        }
        /** Gets the href for this nav list item. */
        getHref() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).getAttribute('href');
            });
        }
        /** Clicks on the nav list item. */
        click() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).click();
            });
        }
        /** Focuses the nav list item. */
        focus() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).focus();
            });
        }
        /** Blurs the nav list item. */
        blur() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).blur();
            });
        }
        /** Whether the nav list item is focused. */
        isFocused() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).isFocused();
            });
        }
    }
    /** The selector for the host element of a `MatListItem` instance. */
    MatNavListItemHarness.hostSelector = ['mat-list-item', 'a[mat-list-item]', 'button[mat-list-item]']
        .map(selector => `${MatNavListHarness.hostSelector} ${selector}`)
        .join(',');
    return MatNavListItemHarness;
})();
export { MatNavListItemHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWxpc3QtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbmF2LWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFdkQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFdEYscUVBQXFFO0FBQ3JFO0lBQUEsTUFBYSxpQkFBa0IsU0FBUSxrQkFDNEM7UUFEbkY7O1lBZUUsaUJBQVksR0FBRyxxQkFBcUIsQ0FBQztRQUN2QyxDQUFDO1FBWEM7Ozs7O1dBS0c7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWlDLEVBQUU7WUFDN0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFELENBQUM7O0lBWEQsb0VBQW9FO0lBQzdELDhCQUFZLEdBQUcsY0FBYyxDQUFDO0lBYXZDLHdCQUFDO0tBQUE7U0FoQlksaUJBQWlCO0FBa0I5QixvREFBb0Q7QUFDcEQ7SUFBQSxNQUFhLHFCQUFzQixTQUFRLHNCQUFzQjtRQU0vRDs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBcUMsRUFBRTtZQUNqRCxPQUFPLG9CQUFvQixDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQztpQkFDdEQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFPLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxnREFBQyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUEsR0FBQSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUVELDRDQUE0QztRQUN0QyxPQUFPOztnQkFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEQsQ0FBQztTQUFBO1FBRUQsbUNBQW1DO1FBQzdCLEtBQUs7O2dCQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLENBQUM7U0FBQTtRQUVELGlDQUFpQztRQUMzQixLQUFLOztnQkFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1NBQUE7UUFFRCwrQkFBK0I7UUFDekIsSUFBSTs7Z0JBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQztTQUFBO1FBRUQsNENBQTRDO1FBQ3RDLFNBQVM7O2dCQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pDLENBQUM7U0FBQTs7SUF4Q0QscUVBQXFFO0lBQzlELGtDQUFZLEdBQUcsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsdUJBQXVCLENBQUM7U0FDL0UsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLElBQUksUUFBUSxFQUFFLENBQUM7U0FDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBc0NqQiw0QkFBQztLQUFBO1NBMUNZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0TGlzdEhhcm5lc3NCYXNlfSBmcm9tICcuL2xpc3QtaGFybmVzcy1iYXNlJztcbmltcG9ydCB7TmF2TGlzdEhhcm5lc3NGaWx0ZXJzLCBOYXZMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7Z2V0TGlzdEl0ZW1QcmVkaWNhdGUsIE1hdExpc3RJdGVtSGFybmVzc0Jhc2V9IGZyb20gJy4vbGlzdC1pdGVtLWhhcm5lc3MtYmFzZSc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW5hdi1saXN0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE5hdkxpc3RIYXJuZXNzIGV4dGVuZHMgTWF0TGlzdEhhcm5lc3NCYXNlPFxuICAgIHR5cGVvZiBNYXROYXZMaXN0SXRlbUhhcm5lc3MsIE1hdE5hdkxpc3RJdGVtSGFybmVzcywgTmF2TGlzdEl0ZW1IYXJuZXNzRmlsdGVycz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdE5hdkxpc3RgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1uYXYtbGlzdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdE5hdkxpc3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBuYXYgbGlzdCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBOYXZMaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TmF2TGlzdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TmF2TGlzdEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgX2l0ZW1IYXJuZXNzID0gTWF0TmF2TGlzdEl0ZW1IYXJuZXNzO1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIG5hdiBsaXN0IGl0ZW0uICovXG5leHBvcnQgY2xhc3MgTWF0TmF2TGlzdEl0ZW1IYXJuZXNzIGV4dGVuZHMgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZSB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TGlzdEl0ZW1gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gWydtYXQtbGlzdC1pdGVtJywgJ2FbbWF0LWxpc3QtaXRlbV0nLCAnYnV0dG9uW21hdC1saXN0LWl0ZW1dJ11cbiAgICAgIC5tYXAoc2VsZWN0b3IgPT4gYCR7TWF0TmF2TGlzdEhhcm5lc3MuaG9zdFNlbGVjdG9yfSAke3NlbGVjdG9yfWApXG4gICAgICAuam9pbignLCcpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXROYXZMaXN0SXRlbUhhcm5lc3NgIHRoYXRcbiAgICogbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIG5hdiBsaXN0IGl0ZW0gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTmF2TGlzdEl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXROYXZMaXN0SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0TGlzdEl0ZW1QcmVkaWNhdGUoTWF0TmF2TGlzdEl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdocmVmJywgb3B0aW9ucy5ocmVmLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGhyZWYpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldEhyZWYoKSwgaHJlZikpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGhyZWYgZm9yIHRoaXMgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0SHJlZigpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgfVxuXG4gIC8qKiBDbGlja3Mgb24gdGhlIG5hdiBsaXN0IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbmF2IGxpc3QgaXRlbSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cbn1cbiJdfQ==