/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate, ContentContainerComponentHarness, } from '@angular/cdk/testing';
const iconSelector = '.mat-list-icon';
const avatarSelector = '.mat-list-avatar';
/**
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
export function getListItemPredicate(harnessType, options) {
    return new HarnessPredicate(harnessType, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
}
/** Harness for interacting with a list subheader. */
export class MatSubheaderHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatSubheaderHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
}
MatSubheaderHarness.hostSelector = '.mat-subheader';
/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
export class MatListItemHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._lines = this.locatorForAll('.mat-line');
        this._avatar = this.locatorForOptional(avatarSelector);
        this._icon = this.locatorForOptional(iconSelector);
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text({ exclude: `${iconSelector}, ${avatarSelector}` });
        });
    }
    /** Gets the lines of text (`mat-line` elements) in this nav list item. */
    getLinesText() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all((yield this._lines()).map(l => l.text()));
        });
    }
    /** Whether this list item has an avatar. */
    hasAvatar() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._avatar());
        });
    }
    /** Whether this list item has an icon. */
    hasIcon() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._icon());
        });
    }
    /**
     * Gets a `HarnessLoader` used to get harnesses within the list item's content.
     * @deprecated Use `getChildLoader(MatListItemSection.CONTENT)` or `getHarness` instead.
     * @breaking-change 12.0.0
     */
    getHarnessLoaderForContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getChildLoader(".mat-list-item-content" /* CONTENT */);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1pdGVtLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbGlzdC1pdGVtLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUdoQixnQkFBZ0IsRUFDaEIsZ0NBQWdDLEdBQ2pDLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEMsTUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUM7QUFFMUM7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDaEMsV0FBMkMsRUFDM0MsT0FBbUM7SUFDckMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7U0FDNUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRUQscURBQXFEO0FBQ3JELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7SUFHdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFtQyxFQUFFO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUM7YUFDcEQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsd0ZBQXdGO0lBQ2xGLE9BQU87O1lBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBOztBQVhNLGdDQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFtQnpDOzs7R0FHRztBQUNILE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxnQ0FBb0Q7SUFBaEc7O1FBQ1UsV0FBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekMsWUFBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsRCxVQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBOEJ4RCxDQUFDO0lBNUJDLHdGQUF3RjtJQUNsRixPQUFPOztZQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxHQUFHLFlBQVksS0FBSyxjQUFjLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDbkYsQ0FBQztLQUFBO0lBRUQsMEVBQTBFO0lBQ3BFLFlBQVk7O1lBQ2hCLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFFRCw0Q0FBNEM7SUFDdEMsU0FBUzs7WUFDYixPQUFPLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBLENBQUM7UUFDaEMsQ0FBQztLQUFBO0lBRUQsMENBQTBDO0lBQ3BDLE9BQU87O1lBQ1gsT0FBTyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQSxDQUFDO1FBQzlCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDRywwQkFBMEI7O1lBQzlCLE9BQU8sSUFBSSxDQUFDLGNBQWMsd0NBQTRCLENBQUM7UUFDekQsQ0FBQztLQUFBO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzTG9hZGVyLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtCYXNlTGlzdEl0ZW1IYXJuZXNzRmlsdGVycywgU3ViaGVhZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vbGlzdC1oYXJuZXNzLWZpbHRlcnMnO1xuXG5jb25zdCBpY29uU2VsZWN0b3IgPSAnLm1hdC1saXN0LWljb24nO1xuY29uc3QgYXZhdGFyU2VsZWN0b3IgPSAnLm1hdC1saXN0LWF2YXRhcic7XG5cbi8qKlxuICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGFwcGxpZXMgdGhlIGdpdmVuIGBCYXNlTGlzdEl0ZW1IYXJuZXNzRmlsdGVyc2AgdG8gdGhlIGdpdmVuXG4gKiBsaXN0IGl0ZW0gaGFybmVzcy5cbiAqIEB0ZW1wbGF0ZSBIIFRoZSB0eXBlIG9mIGxpc3QgaXRlbSBoYXJuZXNzIHRvIGNyZWF0ZSBhIHByZWRpY2F0ZSBmb3IuXG4gKiBAcGFyYW0gaGFybmVzc1R5cGUgQSBjb25zdHJ1Y3RvciBmb3IgYSBsaXN0IGl0ZW0gaGFybmVzcy5cbiAqIEBwYXJhbSBvcHRpb25zIEFuIGluc3RhbmNlIG9mIGBCYXNlTGlzdEl0ZW1IYXJuZXNzRmlsdGVyc2AgdG8gYXBwbHkuXG4gKiBAcmV0dXJuIEEgYEhhcm5lc3NQcmVkaWNhdGVgIGZvciB0aGUgZ2l2ZW4gaGFybmVzcyB0eXBlIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgYXBwbGllZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExpc3RJdGVtUHJlZGljYXRlPEggZXh0ZW5kcyBNYXRMaXN0SXRlbUhhcm5lc3NCYXNlPihcbiAgICBoYXJuZXNzVHlwZTogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPEg+LFxuICAgIG9wdGlvbnM6IEJhc2VMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzKTogSGFybmVzc1ByZWRpY2F0ZTxIPiB7XG4gIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShoYXJuZXNzVHlwZSwgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpO1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIGxpc3Qgc3ViaGVhZGVyLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFN1YmhlYWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXN1YmhlYWRlcic7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU3ViaGVhZGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U3ViaGVhZGVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTdWJoZWFkZXJIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGZ1bGwgdGV4dCBjb250ZW50IG9mIHRoZSBsaXN0IGl0ZW0gKGluY2x1ZGluZyB0ZXh0IGZyb20gYW55IGZvbnQgaWNvbnMpLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG59XG5cbi8qKiBTZWxlY3RvcnMgZm9yIHRoZSB2YXJpb3VzIGxpc3QgaXRlbSBzZWN0aW9ucyB0aGF0IG1heSBjb250YWluIHVzZXIgY29udGVudC4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE1hdExpc3RJdGVtU2VjdGlvbiB7XG4gIENPTlRFTlQgPSAnLm1hdC1saXN0LWl0ZW0tY29udGVudCdcbn1cblxuLyoqXG4gKiBTaGFyZWQgYmVoYXZpb3IgYW1vbmcgdGhlIGhhcm5lc3NlcyBmb3IgdGhlIHZhcmlvdXMgYE1hdExpc3RJdGVtYCBmbGF2b3JzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZSBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPE1hdExpc3RJdGVtU2VjdGlvbj4ge1xuICBwcml2YXRlIF9saW5lcyA9IHRoaXMubG9jYXRvckZvckFsbCgnLm1hdC1saW5lJyk7XG4gIHByaXZhdGUgX2F2YXRhciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKGF2YXRhclNlbGVjdG9yKTtcbiAgcHJpdmF0ZSBfaWNvbiA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKGljb25TZWxlY3Rvcik7XG5cbiAgLyoqIEdldHMgdGhlIGZ1bGwgdGV4dCBjb250ZW50IG9mIHRoZSBsaXN0IGl0ZW0gKGluY2x1ZGluZyB0ZXh0IGZyb20gYW55IGZvbnQgaWNvbnMpLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCh7ZXhjbHVkZTogYCR7aWNvblNlbGVjdG9yfSwgJHthdmF0YXJTZWxlY3Rvcn1gfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGluZXMgb2YgdGV4dCAoYG1hdC1saW5lYCBlbGVtZW50cykgaW4gdGhpcyBuYXYgbGlzdCBpdGVtLiAqL1xuICBhc3luYyBnZXRMaW5lc1RleHQoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoYXdhaXQgdGhpcy5fbGluZXMoKSkubWFwKGwgPT4gbC50ZXh0KCkpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgbGlzdCBpdGVtIGhhcyBhbiBhdmF0YXIuICovXG4gIGFzeW5jIGhhc0F2YXRhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISFhd2FpdCB0aGlzLl9hdmF0YXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgbGlzdCBpdGVtIGhhcyBhbiBpY29uLiAqL1xuICBhc3luYyBoYXNJY29uKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIWF3YWl0IHRoaXMuX2ljb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NMb2FkZXJgIHVzZWQgdG8gZ2V0IGhhcm5lc3NlcyB3aXRoaW4gdGhlIGxpc3QgaXRlbSdzIGNvbnRlbnQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZ2V0Q2hpbGRMb2FkZXIoTWF0TGlzdEl0ZW1TZWN0aW9uLkNPTlRFTlQpYCBvciBgZ2V0SGFybmVzc2AgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICovXG4gIGFzeW5jIGdldEhhcm5lc3NMb2FkZXJGb3JDb250ZW50KCk6IFByb21pc2U8SGFybmVzc0xvYWRlcj4ge1xuICAgIHJldHVybiB0aGlzLmdldENoaWxkTG9hZGVyKE1hdExpc3RJdGVtU2VjdGlvbi5DT05URU5UKTtcbiAgfVxufVxuIl19