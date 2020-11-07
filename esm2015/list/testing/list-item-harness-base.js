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
    /** Gets the full text content of the list item. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1pdGVtLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbGlzdC1pdGVtLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUdoQixnQkFBZ0IsRUFDaEIsZ0NBQWdDLEdBQ2pDLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEMsTUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUM7QUFFMUM7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDaEMsV0FBMkMsRUFDM0MsT0FBbUM7SUFDckMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7U0FDNUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRUQscURBQXFEO0FBQ3JELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7SUFHdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFtQyxFQUFFO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUM7YUFDcEQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsd0ZBQXdGO0lBQ2xGLE9BQU87O1lBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBOztBQVhNLGdDQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFvQnpDOzs7R0FHRztBQUNILE1BQU0sT0FBZ0Isc0JBQ2xCLFNBQVEsZ0NBQW9EO0lBRGhFOztRQUdVLFdBQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pDLFlBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEQsVUFBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQThCeEQsQ0FBQztJQTVCQyxtREFBbUQ7SUFDN0MsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLEtBQUssY0FBYyxFQUFFLEVBQUMsQ0FBQyxDQUFDO1FBQ25GLENBQUM7S0FBQTtJQUVELDBFQUEwRTtJQUNwRSxZQUFZOztZQUNoQixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztLQUFBO0lBRUQsNENBQTRDO0lBQ3RDLFNBQVM7O1lBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQSxDQUFDO1FBQ2hDLENBQUM7S0FBQTtJQUVELDBDQUEwQztJQUNwQyxPQUFPOztZQUNYLE9BQU8sQ0FBQyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUEsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0csMEJBQTBCOztZQUM5QixPQUFPLElBQUksQ0FBQyxjQUFjLHdDQUE0QixDQUFDO1FBQ3pELENBQUM7S0FBQTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgSGFybmVzc0xvYWRlcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7QmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnMsIFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcblxuY29uc3QgaWNvblNlbGVjdG9yID0gJy5tYXQtbGlzdC1pY29uJztcbmNvbnN0IGF2YXRhclNlbGVjdG9yID0gJy5tYXQtbGlzdC1hdmF0YXInO1xuXG4vKipcbiAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBhcHBsaWVzIHRoZSBnaXZlbiBgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNgIHRvIHRoZSBnaXZlblxuICogbGlzdCBpdGVtIGhhcm5lc3MuXG4gKiBAdGVtcGxhdGUgSCBUaGUgdHlwZSBvZiBsaXN0IGl0ZW0gaGFybmVzcyB0byBjcmVhdGUgYSBwcmVkaWNhdGUgZm9yLlxuICogQHBhcmFtIGhhcm5lc3NUeXBlIEEgY29uc3RydWN0b3IgZm9yIGEgbGlzdCBpdGVtIGhhcm5lc3MuXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBpbnN0YW5jZSBvZiBgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNgIHRvIGFwcGx5LlxuICogQHJldHVybiBBIGBIYXJuZXNzUHJlZGljYXRlYCBmb3IgdGhlIGdpdmVuIGhhcm5lc3MgdHlwZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFwcGxpZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0SXRlbVByZWRpY2F0ZTxIIGV4dGVuZHMgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZT4oXG4gICAgaGFybmVzc1R5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxIPixcbiAgICBvcHRpb25zOiBCYXNlTGlzdEl0ZW1IYXJuZXNzRmlsdGVycyk6IEhhcm5lc3NQcmVkaWNhdGU8SD4ge1xuICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoaGFybmVzc1R5cGUsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKTtcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBsaXN0IHN1YmhlYWRlci4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTdWJoZWFkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zdWJoZWFkZXInO1xuXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFN1YmhlYWRlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U3ViaGVhZGVySGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBmdWxsIHRleHQgY29udGVudCBvZiB0aGUgbGlzdCBpdGVtIChpbmNsdWRpbmcgdGV4dCBmcm9tIGFueSBmb250IGljb25zKS4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKiogU2VsZWN0b3JzIGZvciB0aGUgdmFyaW91cyBsaXN0IGl0ZW0gc2VjdGlvbnMgdGhhdCBtYXkgY29udGFpbiB1c2VyIGNvbnRlbnQuICovXG5leHBvcnQgY29uc3QgZW51bSBNYXRMaXN0SXRlbVNlY3Rpb24ge1xuICBDT05URU5UID0gJy5tYXQtbGlzdC1pdGVtLWNvbnRlbnQnXG4gIC8vIFRPRE8obW1hbGVyYmEpOiBjb25zaWRlciBhZGRpbmcgc2VjdGlvbnMgZm9yIGxlYWRpbmcvdHJhaWxpbmcgaWNvbnMuXG59XG5cbi8qKlxuICogU2hhcmVkIGJlaGF2aW9yIGFtb25nIHRoZSBoYXJuZXNzZXMgZm9yIHRoZSB2YXJpb3VzIGBNYXRMaXN0SXRlbWAgZmxhdm9ycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdExpc3RJdGVtSGFybmVzc0Jhc2VcbiAgICBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPE1hdExpc3RJdGVtU2VjdGlvbj4ge1xuXG4gIHByaXZhdGUgX2xpbmVzID0gdGhpcy5sb2NhdG9yRm9yQWxsKCcubWF0LWxpbmUnKTtcbiAgcHJpdmF0ZSBfYXZhdGFyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoYXZhdGFyU2VsZWN0b3IpO1xuICBwcml2YXRlIF9pY29uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoaWNvblNlbGVjdG9yKTtcblxuICAvKiogR2V0cyB0aGUgZnVsbCB0ZXh0IGNvbnRlbnQgb2YgdGhlIGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoe2V4Y2x1ZGU6IGAke2ljb25TZWxlY3Rvcn0sICR7YXZhdGFyU2VsZWN0b3J9YH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxpbmVzIG9mIHRleHQgKGBtYXQtbGluZWAgZWxlbWVudHMpIGluIHRoaXMgbmF2IGxpc3QgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0TGluZXNUZXh0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGF3YWl0IHRoaXMuX2xpbmVzKCkpLm1hcChsID0+IGwudGV4dCgpKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBoYXMgYW4gYXZhdGFyLiAqL1xuICBhc3luYyBoYXNBdmF0YXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhYXdhaXQgdGhpcy5fYXZhdGFyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBoYXMgYW4gaWNvbi4gKi9cbiAgYXN5bmMgaGFzSWNvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISFhd2FpdCB0aGlzLl9pY29uKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzTG9hZGVyYCB1c2VkIHRvIGdldCBoYXJuZXNzZXMgd2l0aGluIHRoZSBsaXN0IGl0ZW0ncyBjb250ZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGdldENoaWxkTG9hZGVyKE1hdExpc3RJdGVtU2VjdGlvbi5DT05URU5UKWAgb3IgYGdldEhhcm5lc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wXG4gICAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yQ29udGVudCgpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZExvYWRlcihNYXRMaXN0SXRlbVNlY3Rpb24uQ09OVEVOVCk7XG4gIH1cbn1cbiJdfQ==