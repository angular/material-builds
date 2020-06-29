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
/** Harness for interacting with a standard mat-selection-list in tests. */
let MatSelectionListHarness = /** @class */ (() => {
    class MatSelectionListHarness extends MatListHarnessBase {
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
        isDisabled() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield (yield this.host()).getAttribute('aria-disabled')) === 'true';
            });
        }
        /**
         * Selects all items matching any of the given filters.
         * @param filters Filters that specify which items should be selected.
         */
        selectItems(...filters) {
            return __awaiter(this, void 0, void 0, function* () {
                const items = yield this._getItems(filters);
                yield Promise.all(items.map(item => item.select()));
            });
        }
        /**
         * Deselects all items matching any of the given filters.
         * @param filters Filters that specify which items should be deselected.
         */
        deselectItems(...filters) {
            return __awaiter(this, void 0, void 0, function* () {
                const items = yield this._getItems(filters);
                yield Promise.all(items.map(item => item.deselect()));
            });
        }
        /** Gets all items matching the given list of filters. */
        _getItems(filters) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!filters.length) {
                    return this.getItems();
                }
                return [].concat(...yield Promise.all(filters.map(filter => this.locatorForAll(MatListOptionHarness.with(filter))())));
            });
        }
    }
    /** The selector for the host element of a `MatSelectionList` instance. */
    MatSelectionListHarness.hostSelector = 'mat-selection-list';
    return MatSelectionListHarness;
})();
export { MatSelectionListHarness };
/** Harness for interacting with a list option. */
let MatListOptionHarness = /** @class */ (() => {
    class MatListOptionHarness extends MatListItemHarnessBase {
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
                .addOption('is selected', options.selected, (harness, selected) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isSelected()) === selected; }));
        }
        /** Gets the position of the checkbox relative to the list option content. */
        getCheckboxPosition() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield (yield this._itemContent()).hasClass('mat-list-item-content-reverse')) ?
                    'after' : 'before';
            });
        }
        /** Whether the list option is selected. */
        isSelected() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield (yield this.host()).getAttribute('aria-selected')) === 'true';
            });
        }
        /** Whether the list option is disabled. */
        isDisabled() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield (yield this.host()).getAttribute('aria-disabled')) === 'true';
            });
        }
        /** Focuses the list option. */
        focus() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).focus();
            });
        }
        /** Blurs the list option. */
        blur() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).blur();
            });
        }
        /** Whether the list option is focused. */
        isFocused() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).isFocused();
            });
        }
        /** Toggles the checked state of the checkbox. */
        toggle() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).click();
            });
        }
        /**
         * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
         * nothing if it is already checked.
         */
        select() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.isSelected())) {
                    return this.toggle();
                }
            });
        }
        /**
         * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
         * nothing if it is already unchecked.
         */
        deselect() {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield this.isSelected()) {
                    return this.toggle();
                }
            });
        }
    }
    /** The selector for the host element of a `MatListOption` instance. */
    MatListOptionHarness.hostSelector = 'mat-list-option';
    return MatListOptionHarness;
})();
export { MatListOptionHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3Rpbmcvc2VsZWN0aW9uLWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFNdkQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFdEYsMkVBQTJFO0FBQzNFO0lBQUEsTUFBYSx1QkFBd0IsU0FBUSxrQkFDbUM7UUFEaEY7O1lBZ0JFLGlCQUFZLEdBQUcsb0JBQW9CLENBQUM7UUFpQ3RDLENBQUM7UUE1Q0M7Ozs7O1dBS0c7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXVDLEVBQUU7WUFFbkQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFJRCw4Q0FBOEM7UUFDeEMsVUFBVTs7Z0JBQ2QsT0FBTyxDQUFBLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBSyxNQUFNLENBQUM7WUFDNUUsQ0FBQztTQUFBO1FBRUQ7OztXQUdHO1FBQ0csV0FBVyxDQUFDLEdBQUcsT0FBbUM7O2dCQUN0RCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RCxD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Q0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLENBQUM7U0FBQTtRQUVEOzs7V0FHRztRQUNHLE1BQU07O2dCQUNWLElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBLEVBQUU7b0JBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUN0QjtZQUNILENBQUM7U0FBQTtRQUVEOzs7V0FHRztRQUNHLFFBQVE7O2dCQUNaLElBQUksTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQzNCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUN0QjtZQUNILENBQUM7U0FBQTs7SUF2RUQsdUVBQXVFO0lBQ2hFLGlDQUFZLEdBQUcsaUJBQWlCLENBQUM7SUF1RTFDLDJCQUFDO0tBQUE7U0F6RVksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRMaXN0SGFybmVzc0Jhc2V9IGZyb20gJy4vbGlzdC1oYXJuZXNzLWJhc2UnO1xuaW1wb3J0IHtcbiAgTGlzdEl0ZW1IYXJuZXNzRmlsdGVycyxcbiAgTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICBTZWxlY3Rpb25MaXN0SGFybmVzc0ZpbHRlcnNcbn0gZnJvbSAnLi9saXN0LWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge2dldExpc3RJdGVtUHJlZGljYXRlLCBNYXRMaXN0SXRlbUhhcm5lc3NCYXNlfSBmcm9tICcuL2xpc3QtaXRlbS1oYXJuZXNzLWJhc2UnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zZWxlY3Rpb24tbGlzdCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3Rpb25MaXN0SGFybmVzcyBleHRlbmRzIE1hdExpc3RIYXJuZXNzQmFzZTxcbiAgICB0eXBlb2YgTWF0TGlzdE9wdGlvbkhhcm5lc3MsIE1hdExpc3RPcHRpb25IYXJuZXNzLCBMaXN0T3B0aW9uSGFybmVzc0ZpbHRlcnM+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTZWxlY3Rpb25MaXN0YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtc2VsZWN0aW9uLWxpc3QnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTZWxlY3Rpb25MaXN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2VsZWN0aW9uIGxpc3QgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU2VsZWN0aW9uTGlzdEhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgICAgSGFybmVzc1ByZWRpY2F0ZTxNYXRTZWxlY3Rpb25MaXN0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTZWxlY3Rpb25MaXN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICBfaXRlbUhhcm5lc3MgPSBNYXRMaXN0T3B0aW9uSGFybmVzcztcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGxpc3QgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFsbCBpdGVtcyBtYXRjaGluZyBhbnkgb2YgdGhlIGdpdmVuIGZpbHRlcnMuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIEZpbHRlcnMgdGhhdCBzcGVjaWZ5IHdoaWNoIGl0ZW1zIHNob3VsZCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIHNlbGVjdEl0ZW1zKC4uLmZpbHRlcnM6IExpc3RPcHRpb25IYXJuZXNzRmlsdGVyc1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLl9nZXRJdGVtcyhmaWx0ZXJzKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChpdGVtcy5tYXAoaXRlbSA9PiBpdGVtLnNlbGVjdCgpKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZWxlY3RzIGFsbCBpdGVtcyBtYXRjaGluZyBhbnkgb2YgdGhlIGdpdmVuIGZpbHRlcnMuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIEZpbHRlcnMgdGhhdCBzcGVjaWZ5IHdoaWNoIGl0ZW1zIHNob3VsZCBiZSBkZXNlbGVjdGVkLlxuICAgKi9cbiAgYXN5bmMgZGVzZWxlY3RJdGVtcyguLi5maWx0ZXJzOiBMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuX2dldEl0ZW1zKGZpbHRlcnMpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0uZGVzZWxlY3QoKSkpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIGl0ZW1zIG1hdGNoaW5nIHRoZSBnaXZlbiBsaXN0IG9mIGZpbHRlcnMuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldEl0ZW1zKGZpbHRlcnM6IExpc3RPcHRpb25IYXJuZXNzRmlsdGVyc1tdKTogUHJvbWlzZTxNYXRMaXN0T3B0aW9uSGFybmVzc1tdPiB7XG4gICAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIChbXSBhcyBNYXRMaXN0T3B0aW9uSGFybmVzc1tdKS5jb25jYXQoLi4uYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIGZpbHRlcnMubWFwKGZpbHRlciA9PiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0TGlzdE9wdGlvbkhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpKSkpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbGlzdCBvcHRpb24uICovXG5leHBvcnQgY2xhc3MgTWF0TGlzdE9wdGlvbkhhcm5lc3MgZXh0ZW5kcyBNYXRMaXN0SXRlbUhhcm5lc3NCYXNlIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRMaXN0T3B0aW9uYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtbGlzdC1vcHRpb24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRMaXN0T3B0aW9uSGFybmVzc2AgdGhhdFxuICAgKiBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbGlzdCBvcHRpb24gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdExpc3RPcHRpb25IYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldExpc3RJdGVtUHJlZGljYXRlKE1hdExpc3RPcHRpb25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdpcyBzZWxlY3RlZCcsIG9wdGlvbnMuc2VsZWN0ZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgc2VsZWN0ZWQpID0+IGF3YWl0IGhhcm5lc3MuaXNTZWxlY3RlZCgpID09PSBzZWxlY3RlZCk7XG4gIH1cblxuICBwcml2YXRlIF9pdGVtQ29udGVudCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1saXN0LWl0ZW0tY29udGVudCcpO1xuXG4gIC8qKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgY2hlY2tib3ggcmVsYXRpdmUgdG8gdGhlIGxpc3Qgb3B0aW9uIGNvbnRlbnQuICovXG4gIGFzeW5jIGdldENoZWNrYm94UG9zaXRpb24oKTogUHJvbWlzZTwnYmVmb3JlJyB8ICdhZnRlcic+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuX2l0ZW1Db250ZW50KCkpLmhhc0NsYXNzKCdtYXQtbGlzdC1pdGVtLWNvbnRlbnQtcmV2ZXJzZScpID9cbiAgICAgICAgJ2FmdGVyJyA6ICdiZWZvcmUnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3Qgb3B0aW9uIGlzIHNlbGVjdGVkLiAqL1xuICBhc3luYyBpc1NlbGVjdGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBvcHRpb24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBsaXN0IG9wdGlvbi4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbGlzdCBvcHRpb24uICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3Qgb3B0aW9uIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBjaGVja2VkIHN0YXRlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgYXN5bmMgdG9nZ2xlKCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgbGlzdCBvcHRpb24gaW4gYSBjaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSB1bmNoZWNrZWQsIG9yIGRvaW5nXG4gICAqIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0KCkge1xuICAgIGlmICghYXdhaXQgdGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBsaXN0IG9wdGlvbiBpbiBhbiB1bmNoZWNrZWQgc3RhdGUgYnkgdG9nZ2xpbmcgaXQgaWYgaXQgaXMgY3VycmVudGx5IGNoZWNrZWQsIG9yIGRvaW5nXG4gICAqIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSB1bmNoZWNrZWQuXG4gICAqL1xuICBhc3luYyBkZXNlbGVjdCgpIHtcbiAgICBpZiAoYXdhaXQgdGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxufVxuIl19