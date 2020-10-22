/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatChipHarness } from './chip-harness';
import { MatChipInputHarness } from './chip-input-harness';
/** Harness for interacting with a standard chip list in tests. */
export class MatChipListHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatChipListHarness, options);
    }
    /** Gets whether the chip list is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.host()).getAttribute('aria-disabled')) === 'true';
        });
    }
    /** Gets whether the chip list is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.host()).getAttribute('aria-required')) === 'true';
        });
    }
    /** Gets whether the chip list is invalid. */
    isInvalid() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.host()).getAttribute('aria-invalid')) === 'true';
        });
    }
    /** Gets whether the chip list is in multi selection mode. */
    isMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.host()).getAttribute('aria-multiselectable')) === 'true';
        });
    }
    /** Gets whether the orientation of the chip list. */
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            const orientation = yield (yield this.host()).getAttribute('aria-orientation');
            return orientation === 'vertical' ? 'vertical' : 'horizontal';
        });
    }
    /**
     * Gets the list of chips inside the chip list.
     * @param filter Optionally filters which chips are included.
     */
    getChips(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatChipHarness.with(filter))();
        });
    }
    /**
     * Selects a chip inside the chip list.
     * @param filter An optional filter to apply to the child chips.
     *    All the chips matching the filter will be selected.
     * @deprecated Will be moved into separate selection-specific harness.
     * @breaking-change 12.0.0
     */
    selectChips(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const chips = yield this.getChips(filter);
            if (!chips.length) {
                throw Error(`Cannot find mat-chip matching filter ${JSON.stringify(filter)}`);
            }
            yield Promise.all(chips.map(chip => chip.select()));
        });
    }
    /**
     * Gets the `MatChipInput` inside the chip list.
     * @param filter Optionally filters which chip input is included.
     */
    getInput(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // The input isn't required to be a descendant of the chip list so we have to look it up by id.
            const inputId = yield (yield this.host()).getAttribute('data-mat-chip-input');
            if (!inputId) {
                throw Error(`Chip list is not associated with an input`);
            }
            return this.documentRootLocatorFactory().locatorFor(MatChipInputHarness.with(Object.assign(Object.assign({}, filter), { selector: `#${inputId}` })))();
        });
    }
}
/** The selector for the host element of a `MatChipList` instance. */
MatChipListHarness.hostSelector = '.mat-chip-list';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvdGVzdGluZy9jaGlwLWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBT3pELGtFQUFrRTtBQUNsRSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0JBQWdCO0lBSXREOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsOENBQThDO0lBQ3hDLFVBQVU7O1lBQ2QsT0FBTyxDQUFBLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBSyxNQUFNLENBQUM7UUFDNUUsQ0FBQztLQUFBO0lBRUQsOENBQThDO0lBQ3hDLFVBQVU7O1lBQ2QsT0FBTyxDQUFBLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBSyxNQUFNLENBQUM7UUFDNUUsQ0FBQztLQUFBO0lBRUQsNkNBQTZDO0lBQ3ZDLFNBQVM7O1lBQ2IsT0FBTyxDQUFBLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBSyxNQUFNLENBQUM7UUFDM0UsQ0FBQztLQUFBO0lBRUQsNkRBQTZEO0lBQ3ZELFVBQVU7O1lBQ2QsT0FBTyxDQUFBLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFLLE1BQU0sQ0FBQztRQUNuRixDQUFDO0tBQUE7SUFFRCxxREFBcUQ7SUFDL0MsY0FBYzs7WUFDbEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDL0UsT0FBTyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUNoRSxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxRQUFRLENBQUMsU0FBNkIsRUFBRTs7WUFDNUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNHLFdBQVcsQ0FBQyxTQUE2QixFQUFFOztZQUMvQyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pCLE1BQU0sS0FBSyxDQUFDLHdDQUF3QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMvRTtZQUNELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxRQUFRLENBQUMsU0FBa0MsRUFBRTs7WUFDakQsK0ZBQStGO1lBQy9GLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRTlFLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osTUFBTSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQzthQUMxRDtZQUVELE9BQU8sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsVUFBVSxDQUNqRCxtQkFBbUIsQ0FBQyxJQUFJLGlDQUFLLE1BQU0sS0FBRSxRQUFRLEVBQUUsSUFBSSxPQUFPLEVBQUUsSUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN0RSxDQUFDO0tBQUE7O0FBNUVELHFFQUFxRTtBQUM5RCwrQkFBWSxHQUFHLGdCQUFnQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRDaGlwSGFybmVzc30gZnJvbSAnLi9jaGlwLWhhcm5lc3MnO1xuaW1wb3J0IHtNYXRDaGlwSW5wdXRIYXJuZXNzfSBmcm9tICcuL2NoaXAtaW5wdXQtaGFybmVzcyc7XG5pbXBvcnQge1xuICBDaGlwTGlzdEhhcm5lc3NGaWx0ZXJzLFxuICBDaGlwSGFybmVzc0ZpbHRlcnMsXG4gIENoaXBJbnB1dEhhcm5lc3NGaWx0ZXJzLFxufSBmcm9tICcuL2NoaXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBjaGlwIGxpc3QgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcExpc3RIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Q2hpcExpc3RgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtY2hpcC1saXN0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2hpcExpc3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBjaGlwIGxpc3QgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2hpcExpc3RIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRDaGlwTGlzdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Q2hpcExpc3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1yZXF1aXJlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBjaGlwIGxpc3QgaXMgaW52YWxpZC4gKi9cbiAgYXN5bmMgaXNJbnZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBpbiBtdWx0aSBzZWxlY3Rpb24gbW9kZS4gKi9cbiAgYXN5bmMgaXNNdWx0aXBsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBjaGlwIGxpc3QuICovXG4gIGFzeW5jIGdldE9yaWVudGF0aW9uKCk6IFByb21pc2U8J2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJz4ge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtb3JpZW50YXRpb24nKTtcbiAgICByZXR1cm4gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxpc3Qgb2YgY2hpcHMgaW5zaWRlIHRoZSBjaGlwIGxpc3QuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIGNoaXBzIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldENoaXBzKGZpbHRlcjogQ2hpcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENoaXBIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdENoaXBIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGEgY2hpcCBpbnNpZGUgdGhlIGNoaXAgbGlzdC5cbiAgICogQHBhcmFtIGZpbHRlciBBbiBvcHRpb25hbCBmaWx0ZXIgdG8gYXBwbHkgdG8gdGhlIGNoaWxkIGNoaXBzLlxuICAgKiAgICBBbGwgdGhlIGNoaXBzIG1hdGNoaW5nIHRoZSBmaWx0ZXIgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICogQGRlcHJlY2F0ZWQgV2lsbCBiZSBtb3ZlZCBpbnRvIHNlcGFyYXRlIHNlbGVjdGlvbi1zcGVjaWZpYyBoYXJuZXNzLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgKi9cbiAgYXN5bmMgc2VsZWN0Q2hpcHMoZmlsdGVyOiBDaGlwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNoaXBzID0gYXdhaXQgdGhpcy5nZXRDaGlwcyhmaWx0ZXIpO1xuICAgIGlmICghY2hpcHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LWNoaXAgbWF0Y2hpbmcgZmlsdGVyICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoY2hpcHMubWFwKGNoaXAgPT4gY2hpcC5zZWxlY3QoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGBNYXRDaGlwSW5wdXRgIGluc2lkZSB0aGUgY2hpcCBsaXN0LlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBjaGlwIGlucHV0IGlzIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0SW5wdXQoZmlsdGVyOiBDaGlwSW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRDaGlwSW5wdXRIYXJuZXNzPiB7XG4gICAgLy8gVGhlIGlucHV0IGlzbid0IHJlcXVpcmVkIHRvIGJlIGEgZGVzY2VuZGFudCBvZiB0aGUgY2hpcCBsaXN0IHNvIHdlIGhhdmUgdG8gbG9vayBpdCB1cCBieSBpZC5cbiAgICBjb25zdCBpbnB1dElkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWNoaXAtaW5wdXQnKTtcblxuICAgIGlmICghaW5wdXRJZCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENoaXAgbGlzdCBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGFuIGlucHV0YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5sb2NhdG9yRm9yKFxuICAgICAgTWF0Q2hpcElucHV0SGFybmVzcy53aXRoKHsuLi5maWx0ZXIsIHNlbGVjdG9yOiBgIyR7aW5wdXRJZH1gfSkpKCk7XG4gIH1cbn1cbiJdfQ==