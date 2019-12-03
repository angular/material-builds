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
        this._button = this.locatorFor('.mat-sort-header-button');
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
            return (yield this._button()).text();
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
    /** Gets the aria-label of the sort header. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).getAttribute('aria-label');
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
            const button = yield this._button();
            return (yield button.getAttribute('disabled')) != null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3Rlc3Rpbmcvc29ydC1oZWFkZXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFJeEUscUZBQXFGO0FBQ3JGLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxnQkFBZ0I7SUFBMUQ7O1FBRVUsWUFBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQXNEL0QsQ0FBQztJQXBEQzs7O09BR0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQW9DLEVBQUU7UUFDaEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQzthQUNyRCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNqRixTQUFTLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUU7WUFDNUUsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQseUNBQXlDO0lBQ25DLFFBQVE7O1lBQ1osT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRUQsZ0RBQWdEO0lBQzFDLGdCQUFnQjs7WUFDcEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXRELElBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtnQkFDNUIsT0FBTyxLQUFLLENBQUM7YUFDZDtpQkFBTSxJQUFJLFFBQVEsS0FBSyxZQUFZLEVBQUU7Z0JBQ3BDLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFFRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtJQUVELDhDQUE4QztJQUN4QyxZQUFZOztZQUNoQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBO0lBRUQsaUVBQWlFO0lBQzNELFFBQVE7O1lBQ1osT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBRUQsMkNBQTJDO0lBQ3JDLFVBQVU7O1lBQ2QsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEMsT0FBTyxDQUFDLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN6RCxDQUFDO0tBQUE7SUFFRCw4RkFBOEY7SUFDeEYsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7O0FBdERNLGlDQUFZLEdBQUcsa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnO1xuaW1wb3J0IHtTb3J0SGVhZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc29ydC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgc29ydCBoZWFkZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U29ydEhlYWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNvcnQtaGVhZGVyJztcbiAgcHJpdmF0ZSBfYnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNvcnQtaGVhZGVyLWJ1dHRvbicpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAgICogc2VhcmNoIGZvciBhIHNvcnQgaGVhZGVyIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNvcnRIZWFkZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTb3J0SGVhZGVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTb3J0SGVhZGVySGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbGFiZWwnLCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbCgpLCBsYWJlbCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ3NvcnREaXJlY3Rpb24nLCBvcHRpb25zLnNvcnREaXJlY3Rpb24sIChoYXJuZXNzLCBzb3J0RGlyZWN0aW9uKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFNvcnREaXJlY3Rpb24oKSwgc29ydERpcmVjdGlvbik7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSBzb3J0IGhlYWRlci4gKi9cbiAgYXN5bmMgZ2V0TGFiZWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc29ydGluZyBkaXJlY3Rpb24gb2YgdGhlIGhlYWRlci4gKi9cbiAgYXN5bmMgZ2V0U29ydERpcmVjdGlvbigpOiBQcm9taXNlPFNvcnREaXJlY3Rpb24+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgYXJpYVNvcnQgPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1zb3J0Jyk7XG5cbiAgICBpZiAoYXJpYVNvcnQgPT09ICdhc2NlbmRpbmcnKSB7XG4gICAgICByZXR1cm4gJ2FzYyc7XG4gICAgfSBlbHNlIGlmIChhcmlhU29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgICByZXR1cm4gJ2Rlc2MnO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsIG9mIHRoZSBzb3J0IGhlYWRlci4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNvcnQgaGVhZGVyIGlzIGN1cnJlbnRseSBiZWluZyBzb3J0ZWQgYnkuICovXG4gIGFzeW5jIGlzQWN0aXZlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLmdldFNvcnREaXJlY3Rpb24oKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgYnV0dG9uID0gYXdhaXQgdGhpcy5fYnV0dG9uKCk7XG4gICAgcmV0dXJuIChhd2FpdCBidXR0b24uZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpKSAhPSBudWxsO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgaGVhZGVyIHRvIGNoYW5nZSBpdHMgc29ydGluZyBkaXJlY3Rpb24uIE9ubHkgd29ya3MgaWYgdGhlIGhlYWRlciBpcyBlbmFibGVkLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG59XG4iXX0=