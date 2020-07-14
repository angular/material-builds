/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material sort header in tests. */
export class MatSortHeaderHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._container = this.locatorFor('.mat-sort-header-container');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHeaderHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('sortDirection', options.sortDirection, (harness, sortDirection) => {
            return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
        });
    }
    /** Gets the label of the sort header. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._container()).text();
        });
    }
    /** Gets the sorting direction of the header. */
    getSortDirection() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const ariaSort = yield host.getAttribute('aria-sort');
            if (ariaSort === 'ascending') {
                return 'asc';
            }
            else if (ariaSort === 'descending') {
                return 'desc';
            }
            return '';
        });
    }
    /**
     * Gets the aria-label of the sort header.
     * @deprecated The sort header no longer has an `aria-label`. This method will be removed.
     * @breaking-change 11.0.0
     */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._container()).getAttribute('aria-label');
        });
    }
    /** Gets whether the sort header is currently being sorted by. */
    isActive() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.getSortDirection());
        });
    }
    /** Whether the sort header is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-sort-header-disabled');
        });
    }
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
}
MatSortHeaderHarness.hostSelector = '.mat-sort-header';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3Rlc3Rpbmcvc29ydC1oZWFkZXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFJeEUscUZBQXFGO0FBQ3JGLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxnQkFBZ0I7SUFBMUQ7O1FBRVUsZUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQXlEckUsQ0FBQztJQXZEQzs7O09BR0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQW9DLEVBQUU7UUFDaEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQzthQUNyRCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNqRixTQUFTLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUU7WUFDNUUsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQseUNBQXlDO0lBQ25DLFFBQVE7O1lBQ1osT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUMsQ0FBQztLQUFBO0lBRUQsZ0RBQWdEO0lBQzFDLGdCQUFnQjs7WUFDcEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXRELElBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtnQkFDNUIsT0FBTyxLQUFLLENBQUM7YUFDZDtpQkFBTSxJQUFJLFFBQVEsS0FBSyxZQUFZLEVBQUU7Z0JBQ3BDLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFFRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDRyxZQUFZOztZQUNoQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUQsQ0FBQztLQUFBO0lBRUQsaUVBQWlFO0lBQzNELFFBQVE7O1lBQ1osT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBRUQsMkNBQTJDO0lBQ3JDLFVBQVU7O1lBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDbEUsQ0FBQztLQUFBO0lBRUQsOEZBQThGO0lBQ3hGLEtBQUs7O1lBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsQ0FBQztLQUFBOztBQXpETSxpQ0FBWSxHQUFHLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zb3J0JztcbmltcG9ydCB7U29ydEhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NvcnQtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHNvcnQgaGVhZGVyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zb3J0LWhlYWRlcic7XG4gIHByaXZhdGUgX2NvbnRhaW5lciA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zb3J0LWhlYWRlci1jb250YWluZXInKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvXG4gICAqIHNlYXJjaCBmb3IgYSBzb3J0IGhlYWRlciB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTb3J0SGVhZGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U29ydEhlYWRlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U29ydEhlYWRlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWwoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKCdzb3J0RGlyZWN0aW9uJywgb3B0aW9ucy5zb3J0RGlyZWN0aW9uLCAoaGFybmVzcywgc29ydERpcmVjdGlvbikgPT4ge1xuICAgICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRTb3J0RGlyZWN0aW9uKCksIHNvcnREaXJlY3Rpb24pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgc29ydCBoZWFkZXIuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9jb250YWluZXIoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNvcnRpbmcgZGlyZWN0aW9uIG9mIHRoZSBoZWFkZXIuICovXG4gIGFzeW5jIGdldFNvcnREaXJlY3Rpb24oKTogUHJvbWlzZTxTb3J0RGlyZWN0aW9uPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IGFyaWFTb3J0ID0gYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc29ydCcpO1xuXG4gICAgaWYgKGFyaWFTb3J0ID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgcmV0dXJuICdhc2MnO1xuICAgIH0gZWxzZSBpZiAoYXJpYVNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgcmV0dXJuICdkZXNjJztcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYXJpYS1sYWJlbCBvZiB0aGUgc29ydCBoZWFkZXIuXG4gICAqIEBkZXByZWNhdGVkIFRoZSBzb3J0IGhlYWRlciBubyBsb25nZXIgaGFzIGFuIGBhcmlhLWxhYmVsYC4gVGhpcyBtZXRob2Qgd2lsbCBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMFxuICAgKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NvbnRhaW5lcigpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNvcnQgaGVhZGVyIGlzIGN1cnJlbnRseSBiZWluZyBzb3J0ZWQgYnkuICovXG4gIGFzeW5jIGlzQWN0aXZlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLmdldFNvcnREaXJlY3Rpb24oKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zb3J0LWhlYWRlci1kaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgaGVhZGVyIHRvIGNoYW5nZSBpdHMgc29ydGluZyBkaXJlY3Rpb24uIE9ubHkgd29ya3MgaWYgdGhlIGhlYWRlciBpcyBlbmFibGVkLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG59XG4iXX0=