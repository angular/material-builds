/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatChipHarness } from './chip-harness';
import { MatChipInputHarness } from './chip-input-harness';
/** Base class for chip list harnesses. */
export class _MatChipListHarnessBase extends ComponentHarness {
    /** Gets whether the chip list is disabled. */
    async isDisabled() {
        return await (await this.host()).getAttribute('aria-disabled') === 'true';
    }
    /** Gets whether the chip list is required. */
    async isRequired() {
        return await (await this.host()).getAttribute('aria-required') === 'true';
    }
    /** Gets whether the chip list is invalid. */
    async isInvalid() {
        return await (await this.host()).getAttribute('aria-invalid') === 'true';
    }
    /** Gets whether the chip list is in multi selection mode. */
    async isMultiple() {
        return await (await this.host()).getAttribute('aria-multiselectable') === 'true';
    }
    /** Gets whether the orientation of the chip list. */
    async getOrientation() {
        const orientation = await (await this.host()).getAttribute('aria-orientation');
        return orientation === 'vertical' ? 'vertical' : 'horizontal';
    }
}
/** Harness for interacting with a standard chip list in tests. */
export class MatChipListHarness extends _MatChipListHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatChipListHarness, options);
    }
    /**
     * Gets the list of chips inside the chip list.
     * @param filter Optionally filters which chips are included.
     */
    async getChips(filter = {}) {
        return this.locatorForAll(MatChipHarness.with(filter))();
    }
    /**
     * Selects a chip inside the chip list.
     * @param filter An optional filter to apply to the child chips.
     *    All the chips matching the filter will be selected.
     * @deprecated Use `MatChipListboxHarness.selectChips` instead.
     * @breaking-change 12.0.0
     */
    async selectChips(filter = {}) {
        const chips = await this.getChips(filter);
        if (!chips.length) {
            throw Error(`Cannot find chip matching filter ${JSON.stringify(filter)}`);
        }
        await parallel(() => chips.map(chip => chip.select()));
    }
    /**
     * Gets the `MatChipInput` inside the chip list.
     * @param filter Optionally filters which chip input is included.
     */
    async getInput(filter = {}) {
        // The input isn't required to be a descendant of the chip list so we have to look it up by id.
        const inputId = await (await this.host()).getAttribute('data-mat-chip-input');
        if (!inputId) {
            throw Error(`Chip list is not associated with an input`);
        }
        return this.documentRootLocatorFactory().locatorFor(MatChipInputHarness.with({ ...filter, selector: `#${inputId}` }))();
    }
}
/** The selector for the host element of a `MatChipList` instance. */
MatChipListHarness.hostSelector = '.mat-chip-list';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvdGVzdGluZy9jaGlwLWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbEYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBT3pELDBDQUEwQztBQUMxQyxNQUFNLE9BQWdCLHVCQUF3QixTQUFRLGdCQUFnQjtJQUNwRSw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxNQUFNLENBQUM7SUFDNUUsQ0FBQztJQUVELDhDQUE4QztJQUM5QyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE1BQU0sQ0FBQztJQUM1RSxDQUFDO0lBRUQsNkNBQTZDO0lBQzdDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUssTUFBTSxDQUFDO0lBQzNFLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLE1BQU0sQ0FBQztJQUNuRixDQUFDO0lBRUQscURBQXFEO0lBQ3JELEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9FLE9BQU8sV0FBVyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDaEUsQ0FBQztDQUNGO0FBRUQsa0VBQWtFO0FBQ2xFLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSx1QkFBdUI7SUFJN0Q7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQTZCLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQTZCLEVBQUU7UUFDL0MsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxDQUFDLG9DQUFvQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMzRTtRQUNELE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWtDLEVBQUU7UUFDakQsK0ZBQStGO1FBQy9GLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRTlFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsT0FBTyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxVQUFVLENBQ2pELG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdEUsQ0FBQzs7QUFsREQscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRDaGlwSGFybmVzc30gZnJvbSAnLi9jaGlwLWhhcm5lc3MnO1xuaW1wb3J0IHtNYXRDaGlwSW5wdXRIYXJuZXNzfSBmcm9tICcuL2NoaXAtaW5wdXQtaGFybmVzcyc7XG5pbXBvcnQge1xuICBDaGlwTGlzdEhhcm5lc3NGaWx0ZXJzLFxuICBDaGlwSGFybmVzc0ZpbHRlcnMsXG4gIENoaXBJbnB1dEhhcm5lc3NGaWx0ZXJzLFxufSBmcm9tICcuL2NoaXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEJhc2UgY2xhc3MgZm9yIGNoaXAgbGlzdCBoYXJuZXNzZXMuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdENoaXBMaXN0SGFybmVzc0Jhc2UgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIEdldHMgd2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBjaGlwIGxpc3QgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXJlcXVpcmVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBpbnZhbGlkLiAqL1xuICBhc3luYyBpc0ludmFsaWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGluIG11bHRpIHNlbGVjdGlvbiBtb2RlLiAqL1xuICBhc3luYyBpc011bHRpcGxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1tdWx0aXNlbGVjdGFibGUnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGNoaXAgbGlzdC4gKi9cbiAgYXN5bmMgZ2V0T3JpZW50YXRpb24oKTogUHJvbWlzZTwnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnPiB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1vcmllbnRhdGlvbicpO1xuICAgIHJldHVybiBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBjaGlwIGxpc3QgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcExpc3RIYXJuZXNzIGV4dGVuZHMgX01hdENoaXBMaXN0SGFybmVzc0Jhc2Uge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdENoaXBMaXN0YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWNoaXAtbGlzdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdENoaXBMaXN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggY2hpcCBsaXN0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENoaXBMaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Q2hpcExpc3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdENoaXBMaXN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGlzdCBvZiBjaGlwcyBpbnNpZGUgdGhlIGNoaXAgbGlzdC5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggY2hpcHMgYXJlIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q2hpcHMoZmlsdGVyOiBDaGlwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0Q2hpcEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0Q2hpcEhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYSBjaGlwIGluc2lkZSB0aGUgY2hpcCBsaXN0LlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2hpbGQgY2hpcHMuXG4gICAqICAgIEFsbCB0aGUgY2hpcHMgbWF0Y2hpbmcgdGhlIGZpbHRlciB3aWxsIGJlIHNlbGVjdGVkLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENoaXBMaXN0Ym94SGFybmVzcy5zZWxlY3RDaGlwc2AgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICovXG4gIGFzeW5jIHNlbGVjdENoaXBzKGZpbHRlcjogQ2hpcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjaGlwcyA9IGF3YWl0IHRoaXMuZ2V0Q2hpcHMoZmlsdGVyKTtcbiAgICBpZiAoIWNoaXBzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbm5vdCBmaW5kIGNoaXAgbWF0Y2hpbmcgZmlsdGVyICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgcGFyYWxsZWwoKCkgPT4gY2hpcHMubWFwKGNoaXAgPT4gY2hpcC5zZWxlY3QoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGBNYXRDaGlwSW5wdXRgIGluc2lkZSB0aGUgY2hpcCBsaXN0LlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBjaGlwIGlucHV0IGlzIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0SW5wdXQoZmlsdGVyOiBDaGlwSW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRDaGlwSW5wdXRIYXJuZXNzPiB7XG4gICAgLy8gVGhlIGlucHV0IGlzbid0IHJlcXVpcmVkIHRvIGJlIGEgZGVzY2VuZGFudCBvZiB0aGUgY2hpcCBsaXN0IHNvIHdlIGhhdmUgdG8gbG9vayBpdCB1cCBieSBpZC5cbiAgICBjb25zdCBpbnB1dElkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWNoaXAtaW5wdXQnKTtcblxuICAgIGlmICghaW5wdXRJZCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENoaXAgbGlzdCBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGFuIGlucHV0YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5sb2NhdG9yRm9yKFxuICAgICAgTWF0Q2hpcElucHV0SGFybmVzcy53aXRoKHsuLi5maWx0ZXIsIHNlbGVjdG9yOiBgIyR7aW5wdXRJZH1gfSkpKCk7XG4gIH1cbn1cbiJdfQ==