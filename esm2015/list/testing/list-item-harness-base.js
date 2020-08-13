/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
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
export class MatListItemHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._lines = this.locatorForAll('[mat-line], [matLine]');
        this._avatar = this.locatorForOptional('[mat-list-avatar], [matListAvatar]');
        this._icon = this.locatorForOptional('[mat-list-icon], [matListIcon]');
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
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
    /** Gets a `HarnessLoader` used to get harnesses within the list item's content. */
    getHarnessLoaderForContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorFactory.harnessLoaderFor('.mat-list-item-content');
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1pdGVtLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbGlzdC1pdGVtLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUdoQixnQkFBZ0IsRUFDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5Qjs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQixDQUNoQyxXQUEyQyxFQUMzQyxPQUFtQztJQUNyQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQztTQUM1QyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLENBQUM7QUFFRCxxREFBcUQ7QUFDckQsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGdCQUFnQjtJQUd2RCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQW1DLEVBQUU7UUFDL0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQzthQUNwRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFFRCx3RkFBd0Y7SUFDbEYsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7O0FBWE0sZ0NBQVksR0FBRyxnQkFBZ0IsQ0FBQztBQWN6Qzs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsZ0JBQWdCO0lBQTVEOztRQUNVLFdBQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDckQsWUFBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3hFLFVBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQTBCNUUsQ0FBQztJQXhCQyx3RkFBd0Y7SUFDbEYsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRCwwRUFBMEU7SUFDcEUsWUFBWTs7WUFDaEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUVELDRDQUE0QztJQUN0QyxTQUFTOztZQUNiLE9BQU8sQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUEsQ0FBQztRQUNoQyxDQUFDO0tBQUE7SUFFRCwwQ0FBMEM7SUFDcEMsT0FBTzs7WUFDWCxPQUFPLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRUQsbUZBQW1GO0lBQzdFLDBCQUEwQjs7WUFDOUIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDeEUsQ0FBQztLQUFBO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzTG9hZGVyLFxuICBIYXJuZXNzUHJlZGljYXRlXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7QmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnMsIFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqXG4gKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgYXBwbGllcyB0aGUgZ2l2ZW4gYEJhc2VMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzYCB0byB0aGUgZ2l2ZW5cbiAqIGxpc3QgaXRlbSBoYXJuZXNzLlxuICogQHRlbXBsYXRlIEggVGhlIHR5cGUgb2YgbGlzdCBpdGVtIGhhcm5lc3MgdG8gY3JlYXRlIGEgcHJlZGljYXRlIGZvci5cbiAqIEBwYXJhbSBoYXJuZXNzVHlwZSBBIGNvbnN0cnVjdG9yIGZvciBhIGxpc3QgaXRlbSBoYXJuZXNzLlxuICogQHBhcmFtIG9wdGlvbnMgQW4gaW5zdGFuY2Ugb2YgYEJhc2VMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzYCB0byBhcHBseS5cbiAqIEByZXR1cm4gQSBgSGFybmVzc1ByZWRpY2F0ZWAgZm9yIHRoZSBnaXZlbiBoYXJuZXNzIHR5cGUgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBhcHBsaWVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdEl0ZW1QcmVkaWNhdGU8SCBleHRlbmRzIE1hdExpc3RJdGVtSGFybmVzc0Jhc2U+KFxuICAgIGhhcm5lc3NUeXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8SD4sXG4gICAgb3B0aW9uczogQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnMpOiBIYXJuZXNzUHJlZGljYXRlPEg+IHtcbiAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKGhhcm5lc3NUeXBlLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSk7XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbGlzdCBzdWJoZWFkZXIuICovXG5leHBvcnQgY2xhc3MgTWF0U3ViaGVhZGVySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc3ViaGVhZGVyJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTdWJoZWFkZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTdWJoZWFkZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFN1YmhlYWRlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZnVsbCB0ZXh0IGNvbnRlbnQgb2YgdGhlIGxpc3QgaXRlbSAoaW5jbHVkaW5nIHRleHQgZnJvbSBhbnkgZm9udCBpY29ucykuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBTaGFyZWQgYmVoYXZpb3IgYW1vbmcgdGhlIGhhcm5lc3NlcyBmb3IgdGhlIHZhcmlvdXMgYE1hdExpc3RJdGVtYCBmbGF2b3JzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9saW5lcyA9IHRoaXMubG9jYXRvckZvckFsbCgnW21hdC1saW5lXSwgW21hdExpbmVdJyk7XG4gIHByaXZhdGUgX2F2YXRhciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCdbbWF0LWxpc3QtYXZhdGFyXSwgW21hdExpc3RBdmF0YXJdJyk7XG4gIHByaXZhdGUgX2ljb24gPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnW21hdC1saXN0LWljb25dLCBbbWF0TGlzdEljb25dJyk7XG5cbiAgLyoqIEdldHMgdGhlIGZ1bGwgdGV4dCBjb250ZW50IG9mIHRoZSBsaXN0IGl0ZW0gKGluY2x1ZGluZyB0ZXh0IGZyb20gYW55IGZvbnQgaWNvbnMpLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxpbmVzIG9mIHRleHQgKGBtYXQtbGluZWAgZWxlbWVudHMpIGluIHRoaXMgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0TGluZXNUZXh0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGF3YWl0IHRoaXMuX2xpbmVzKCkpLm1hcChsID0+IGwudGV4dCgpKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBoYXMgYW4gYXZhdGFyLiAqL1xuICBhc3luYyBoYXNBdmF0YXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhYXdhaXQgdGhpcy5fYXZhdGFyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBoYXMgYW4gaWNvbi4gKi9cbiAgYXN5bmMgaGFzSWNvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISFhd2FpdCB0aGlzLl9pY29uKCk7XG4gIH1cblxuICAvKiogR2V0cyBhIGBIYXJuZXNzTG9hZGVyYCB1c2VkIHRvIGdldCBoYXJuZXNzZXMgd2l0aGluIHRoZSBsaXN0IGl0ZW0ncyBjb250ZW50LiAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yQ29udGVudCgpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRmFjdG9yeS5oYXJuZXNzTG9hZGVyRm9yKCcubWF0LWxpc3QtaXRlbS1jb250ZW50Jyk7XG4gIH1cbn1cbiJdfQ==