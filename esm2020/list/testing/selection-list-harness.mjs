/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { getListItemPredicate, MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-selection-list in tests. */
export class MatSelectionListHarness extends MatListHarnessBase {
    constructor() {
        super(...arguments);
        this._itemHarness = MatListOptionHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSelectionListHarness, options);
    }
    /** Whether the selection list is disabled. */
    async isDisabled() {
        return await (await this.host()).getAttribute('aria-disabled') === 'true';
    }
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    async selectItems(...filters) {
        const items = await this._getItems(filters);
        await parallel(() => items.map(item => item.select()));
    }
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    async deselectItems(...filters) {
        const items = await this._getItems(filters);
        await parallel(() => items.map(item => item.deselect()));
    }
    /** Gets all items matching the given list of filters. */
    async _getItems(filters) {
        if (!filters.length) {
            return this.getItems();
        }
        const matches = await parallel(() => {
            return filters.map(filter => this.locatorForAll(MatListOptionHarness.with(filter))());
        });
        return matches.reduce((result, current) => [...result, ...current], []);
    }
}
/** The selector for the host element of a `MatSelectionList` instance. */
MatSelectionListHarness.hostSelector = '.mat-selection-list';
/** Harness for interacting with a list option. */
export class MatListOptionHarness extends MatListItemHarnessBase {
    constructor() {
        super(...arguments);
        this._itemContent = this.locatorFor('.mat-list-item-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(MatListOptionHarness, options)
            .addOption('is selected', options.selected, async (harness, selected) => await harness.isSelected() === selected);
    }
    /** Gets the position of the checkbox relative to the list option content. */
    async getCheckboxPosition() {
        return await (await this._itemContent()).hasClass('mat-list-item-content-reverse') ?
            'after' : 'before';
    }
    /** Whether the list option is selected. */
    async isSelected() {
        return await (await this.host()).getAttribute('aria-selected') === 'true';
    }
    /** Whether the list option is disabled. */
    async isDisabled() {
        return await (await this.host()).getAttribute('aria-disabled') === 'true';
    }
    /** Focuses the list option. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the list option. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the list option is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Toggles the checked state of the checkbox. */
    async toggle() {
        return (await this.host()).click();
    }
    /**
     * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    async select() {
        if (!await this.isSelected()) {
            return this.toggle();
        }
    }
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    async deselect() {
        if (await this.isSelected()) {
            return this.toggle();
        }
    }
}
/** The selector for the host element of a `MatListOption` instance. */
MatListOptionHarness.hostSelector = '.mat-list-option';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3Rpbmcvc2VsZWN0aW9uLWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFaEUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFNdkQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFdEYsMkVBQTJFO0FBQzNFLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxrQkFDbUM7SUFEaEY7O1FBZ0JXLGlCQUFZLEdBQUcsb0JBQW9CLENBQUM7SUFtQy9DLENBQUM7SUE5Q0M7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXVDLEVBQUU7UUFFbkQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFJRCw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxNQUFNLENBQUM7SUFDNUUsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxPQUFtQztRQUN0RCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FB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QUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxLQUFLLENBQUMsTUFBTTtRQUNWLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsTUFBTTtRQUNWLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUTtRQUNaLElBQUksTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDOztBQXZFRCx1RUFBdUU7QUFDaEUsaUNBQVksR0FBRyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdExpc3RPcHRpb25DaGVja2JveFBvc2l0aW9ufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9saXN0JztcbmltcG9ydCB7TWF0TGlzdEhhcm5lc3NCYXNlfSBmcm9tICcuL2xpc3QtaGFybmVzcy1iYXNlJztcbmltcG9ydCB7XG4gIExpc3RJdGVtSGFybmVzc0ZpbHRlcnMsXG4gIExpc3RPcHRpb25IYXJuZXNzRmlsdGVycyxcbiAgU2VsZWN0aW9uTGlzdEhhcm5lc3NGaWx0ZXJzXG59IGZyb20gJy4vbGlzdC1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtnZXRMaXN0SXRlbVByZWRpY2F0ZSwgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZX0gZnJvbSAnLi9saXN0LWl0ZW0taGFybmVzcy1iYXNlJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2VsZWN0aW9uLWxpc3QgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdEhhcm5lc3MgZXh0ZW5kcyBNYXRMaXN0SGFybmVzc0Jhc2U8XG4gICAgdHlwZW9mIE1hdExpc3RPcHRpb25IYXJuZXNzLCBNYXRMaXN0T3B0aW9uSGFybmVzcywgTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U2VsZWN0aW9uTGlzdGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zZWxlY3Rpb24tbGlzdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzZWxlY3Rpb24gbGlzdCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTZWxlY3Rpb25MaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9pdGVtSGFybmVzcyA9IE1hdExpc3RPcHRpb25IYXJuZXNzO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYWxsIGl0ZW1zIG1hdGNoaW5nIGFueSBvZiB0aGUgZ2l2ZW4gZmlsdGVycy5cbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyB0aGF0IHNwZWNpZnkgd2hpY2ggaXRlbXMgc2hvdWxkIGJlIHNlbGVjdGVkLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0SXRlbXMoLi4uZmlsdGVyczogTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuX2dldEl0ZW1zKGZpbHRlcnMpO1xuICAgIGF3YWl0IHBhcmFsbGVsKCgpID0+IGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0uc2VsZWN0KCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlbGVjdHMgYWxsIGl0ZW1zIG1hdGNoaW5nIGFueSBvZiB0aGUgZ2l2ZW4gZmlsdGVycy5cbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyB0aGF0IHNwZWNpZnkgd2hpY2ggaXRlbXMgc2hvdWxkIGJlIGRlc2VsZWN0ZWQuXG4gICAqL1xuICBhc3luYyBkZXNlbGVjdEl0ZW1zKC4uLmZpbHRlcnM6IExpc3RJdGVtSGFybmVzc0ZpbHRlcnNbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5fZ2V0SXRlbXMoZmlsdGVycyk7XG4gICAgYXdhaXQgcGFyYWxsZWwoKCkgPT4gaXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5kZXNlbGVjdCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgaXRlbXMgbWF0Y2hpbmcgdGhlIGdpdmVuIGxpc3Qgb2YgZmlsdGVycy4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0SXRlbXMoZmlsdGVyczogTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzW10pOiBQcm9taXNlPE1hdExpc3RPcHRpb25IYXJuZXNzW10+IHtcbiAgICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJdGVtcygpO1xuICAgIH1cbiAgICBjb25zdCBtYXRjaGVzID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIGZpbHRlcnMubWFwKGZpbHRlciA9PiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0TGlzdE9wdGlvbkhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWF0Y2hlcy5yZWR1Y2UoKHJlc3VsdCwgY3VycmVudCkgPT4gWy4uLnJlc3VsdCwgLi4uY3VycmVudF0sIFtdKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIGxpc3Qgb3B0aW9uLiAqL1xuZXhwb3J0IGNsYXNzIE1hdExpc3RPcHRpb25IYXJuZXNzIGV4dGVuZHMgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZSB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TGlzdE9wdGlvbmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1saXN0LW9wdGlvbic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdExpc3RPcHRpb25IYXJuZXNzYCB0aGF0XG4gICAqIG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBsaXN0IG9wdGlvbiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBMaXN0T3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGlzdE9wdGlvbkhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0TGlzdEl0ZW1QcmVkaWNhdGUoTWF0TGlzdE9wdGlvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2lzIHNlbGVjdGVkJywgb3B0aW9ucy5zZWxlY3RlZCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBzZWxlY3RlZCkgPT4gYXdhaXQgaGFybmVzcy5pc1NlbGVjdGVkKCkgPT09IHNlbGVjdGVkKTtcbiAgfVxuXG4gIHByaXZhdGUgX2l0ZW1Db250ZW50ID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWxpc3QtaXRlbS1jb250ZW50Jyk7XG5cbiAgLyoqIEdldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjaGVja2JveCByZWxhdGl2ZSB0byB0aGUgbGlzdCBvcHRpb24gY29udGVudC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tib3hQb3NpdGlvbigpOiBQcm9taXNlPE1hdExpc3RPcHRpb25DaGVja2JveFBvc2l0aW9uPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLl9pdGVtQ29udGVudCgpKS5oYXNDbGFzcygnbWF0LWxpc3QtaXRlbS1jb250ZW50LXJldmVyc2UnKSA/XG4gICAgICAgICdhZnRlcicgOiAnYmVmb3JlJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbiAgYXN5bmMgaXNTZWxlY3RlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3Qgb3B0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbGlzdCBvcHRpb24uICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGxpc3Qgb3B0aW9uLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IG9wdGlvbiBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgY2hlY2tlZCBzdGF0ZSBvZiB0aGUgY2hlY2tib3guICovXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIGxpc3Qgb3B0aW9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIHNlbGVjdCgpIHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgbGlzdCBvcHRpb24gaW4gYW4gdW5jaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSBjaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgdW5jaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgZGVzZWxlY3QoKSB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==