/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { MatLegacySelectHarness } from '@angular/material/legacy-select/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';
export class _MatPaginatorHarnessBase extends ComponentHarness {
    /** Goes to the next page in the paginator. */
    async goToNextPage() {
        return (await this._nextButton()).click();
    }
    /** Returns whether or not the next page button is disabled. */
    async isNextPageDisabled() {
        const disabledValue = await (await this._nextButton()).getAttribute('disabled');
        return disabledValue == 'true';
    }
    /* Returns whether or not the previous page button is disabled. */
    async isPreviousPageDisabled() {
        const disabledValue = await (await this._previousButton()).getAttribute('disabled');
        return disabledValue == 'true';
    }
    /** Goes to the previous page in the paginator. */
    async goToPreviousPage() {
        return (await this._previousButton()).click();
    }
    /** Goes to the first page in the paginator. */
    async goToFirstPage() {
        const button = await this._firstPageButton();
        // The first page button isn't enabled by default so we need to check for it.
        if (!button) {
            throw Error('Could not find first page button inside paginator. ' +
                'Make sure that `showFirstLastButtons` is enabled.');
        }
        return button.click();
    }
    /** Goes to the last page in the paginator. */
    async goToLastPage() {
        const button = await this._lastPageButton();
        // The last page button isn't enabled by default so we need to check for it.
        if (!button) {
            throw Error('Could not find last page button inside paginator. ' +
                'Make sure that `showFirstLastButtons` is enabled.');
        }
        return button.click();
    }
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    async setPageSize(size) {
        const select = await this._select();
        // The select is only available if the `pageSizeOptions` are
        // set to an array with more than one item.
        if (!select) {
            throw Error('Cannot find page size selector in paginator. ' +
                'Make sure that the `pageSizeOptions` have been configured.');
        }
        return select.clickOptions({ text: `${size}` });
    }
    /** Gets the page size of the paginator. */
    async getPageSize() {
        const select = await this._select();
        const value = select ? select.getValueText() : (await this._pageSizeFallback()).text();
        return coerceNumberProperty(await value);
    }
    /** Gets the text of the range labe of the paginator. */
    async getRangeLabel() {
        return (await this._rangeLabel()).text();
    }
}
/** Harness for interacting with a standard mat-paginator in tests. */
export class MatPaginatorHarness extends _MatPaginatorHarnessBase {
    constructor() {
        super(...arguments);
        this._nextButton = this.locatorFor('.mat-paginator-navigation-next');
        this._previousButton = this.locatorFor('.mat-paginator-navigation-previous');
        this._firstPageButton = this.locatorForOptional('.mat-paginator-navigation-first');
        this._lastPageButton = this.locatorForOptional('.mat-paginator-navigation-last');
        this._select = this.locatorForOptional(MatLegacySelectHarness.with({
            ancestor: '.mat-paginator-page-size',
        }));
        this._pageSizeFallback = this.locatorFor('.mat-paginator-page-size-value');
        this._rangeLabel = this.locatorFor('.mat-paginator-range-label');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatPaginatorHarness, options);
    }
}
/** Selector used to find paginator instances. */
MatPaginatorHarness.hostSelector = '.mat-paginator';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3Rlc3RpbmcvcGFnaW5hdG9yLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQztBQUMvRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUczRCxNQUFNLE9BQWdCLHdCQUF5QixTQUFRLGdCQUFnQjtJQWVyRSw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELCtEQUErRDtJQUMvRCxLQUFLLENBQUMsa0JBQWtCO1FBQ3RCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRixPQUFPLGFBQWEsSUFBSSxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUVELGtFQUFrRTtJQUNsRSxLQUFLLENBQUMsc0JBQXNCO1FBQzFCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRixPQUFPLGFBQWEsSUFBSSxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFD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QkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0TGVnYWN5U2VsZWN0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LXNlbGVjdC90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BhZ2luYXRvckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3BhZ2luYXRvci1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFBhZ2luYXRvckhhcm5lc3NCYXNlIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfbmV4dEJ1dHRvbjogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3ByZXZpb3VzQnV0dG9uOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZmlyc3RQYWdlQnV0dG9uOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudCB8IG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2xhc3RQYWdlQnV0dG9uOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudCB8IG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3NlbGVjdDogQXN5bmNGYWN0b3J5Rm48XG4gICAgfCAoQ29tcG9uZW50SGFybmVzcyAmIHtcbiAgICAgICAgZ2V0VmFsdWVUZXh0KCk6IFByb21pc2U8c3RyaW5nPjtcbiAgICAgICAgY2xpY2tPcHRpb25zKC4uLmZpbHRlcnM6IHVua25vd25bXSk6IFByb21pc2U8dm9pZD47XG4gICAgICB9KVxuICAgIHwgbnVsbFxuICA+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3BhZ2VTaXplRmFsbGJhY2s6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50PjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9yYW5nZUxhYmVsOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG5cbiAgLyoqIEdvZXMgdG8gdGhlIG5leHQgcGFnZSBpbiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnb1RvTmV4dFBhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9uZXh0QnV0dG9uKCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbmV4dCBwYWdlIGJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNOZXh0UGFnZURpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkVmFsdWUgPSBhd2FpdCAoYXdhaXQgdGhpcy5fbmV4dEJ1dHRvbigpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGRpc2FibGVkVmFsdWUgPT0gJ3RydWUnO1xuICB9XG5cbiAgLyogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgcHJldmlvdXMgcGFnZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzUHJldmlvdXNQYWdlRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWRWYWx1ZSA9IGF3YWl0IChhd2FpdCB0aGlzLl9wcmV2aW91c0J1dHRvbigpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGRpc2FibGVkVmFsdWUgPT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEdvZXMgdG8gdGhlIHByZXZpb3VzIHBhZ2UgaW4gdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ29Ub1ByZXZpb3VzUGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3ByZXZpb3VzQnV0dG9uKCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogR29lcyB0byB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnb1RvRmlyc3RQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGF3YWl0IHRoaXMuX2ZpcnN0UGFnZUJ1dHRvbigpO1xuXG4gICAgLy8gVGhlIGZpcnN0IHBhZ2UgYnV0dG9uIGlzbid0IGVuYWJsZWQgYnkgZGVmYXVsdCBzbyB3ZSBuZWVkIHRvIGNoZWNrIGZvciBpdC5cbiAgICBpZiAoIWJ1dHRvbikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDb3VsZCBub3QgZmluZCBmaXJzdCBwYWdlIGJ1dHRvbiBpbnNpZGUgcGFnaW5hdG9yLiAnICtcbiAgICAgICAgICAnTWFrZSBzdXJlIHRoYXQgYHNob3dGaXJzdExhc3RCdXR0b25zYCBpcyBlbmFibGVkLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBidXR0b24uY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHb2VzIHRvIHRoZSBsYXN0IHBhZ2UgaW4gdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ29Ub0xhc3RQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGF3YWl0IHRoaXMuX2xhc3RQYWdlQnV0dG9uKCk7XG5cbiAgICAvLyBUaGUgbGFzdCBwYWdlIGJ1dHRvbiBpc24ndCBlbmFibGVkIGJ5IGRlZmF1bHQgc28gd2UgbmVlZCB0byBjaGVjayBmb3IgaXQuXG4gICAgaWYgKCFidXR0b24pIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgbGFzdCBwYWdlIGJ1dHRvbiBpbnNpZGUgcGFnaW5hdG9yLiAnICtcbiAgICAgICAgICAnTWFrZSBzdXJlIHRoYXQgYHNob3dGaXJzdExhc3RCdXR0b25zYCBpcyBlbmFibGVkLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBidXR0b24uY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYWdlIHNpemUgb2YgdGhlIHBhZ2luYXRvci5cbiAgICogQHBhcmFtIHNpemUgUGFnZSBzaXplIHRoYXQgc2hvdWxkIGJlIHNlbGVjdC5cbiAgICovXG4gIGFzeW5jIHNldFBhZ2VTaXplKHNpemU6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNlbGVjdCA9IGF3YWl0IHRoaXMuX3NlbGVjdCgpO1xuXG4gICAgLy8gVGhlIHNlbGVjdCBpcyBvbmx5IGF2YWlsYWJsZSBpZiB0aGUgYHBhZ2VTaXplT3B0aW9uc2AgYXJlXG4gICAgLy8gc2V0IHRvIGFuIGFycmF5IHdpdGggbW9yZSB0aGFuIG9uZSBpdGVtLlxuICAgIGlmICghc2VsZWN0KSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBmaW5kIHBhZ2Ugc2l6ZSBzZWxlY3RvciBpbiBwYWdpbmF0b3IuICcgK1xuICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCB0aGUgYHBhZ2VTaXplT3B0aW9uc2AgaGF2ZSBiZWVuIGNvbmZpZ3VyZWQuJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdC5jbGlja09wdGlvbnMoe3RleHQ6IGAke3NpemV9YH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhZ2Ugc2l6ZSBvZiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnZXRQYWdlU2l6ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIGNvbnN0IHNlbGVjdCA9IGF3YWl0IHRoaXMuX3NlbGVjdCgpO1xuICAgIGNvbnN0IHZhbHVlID0gc2VsZWN0ID8gc2VsZWN0LmdldFZhbHVlVGV4dCgpIDogKGF3YWl0IHRoaXMuX3BhZ2VTaXplRmFsbGJhY2soKSkudGV4dCgpO1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCB2YWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgcmFuZ2UgbGFiZSBvZiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnZXRSYW5nZUxhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9yYW5nZUxhYmVsKCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1wYWdpbmF0b3IgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UGFnaW5hdG9ySGFybmVzcyBleHRlbmRzIF9NYXRQYWdpbmF0b3JIYXJuZXNzQmFzZSB7XG4gIC8qKiBTZWxlY3RvciB1c2VkIHRvIGZpbmQgcGFnaW5hdG9yIGluc3RhbmNlcy4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXBhZ2luYXRvcic7XG4gIHByb3RlY3RlZCBfbmV4dEJ1dHRvbiA9IHRoaXMubG9jYXRvckZvcignLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1uZXh0Jyk7XG4gIHByb3RlY3RlZCBfcHJldmlvdXNCdXR0b24gPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tcHJldmlvdXMnKTtcbiAgcHJvdGVjdGVkIF9maXJzdFBhZ2VCdXR0b24gPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1maXJzdCcpO1xuICBwcm90ZWN0ZWQgX2xhc3RQYWdlQnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tbGFzdCcpO1xuICBwcm90ZWN0ZWQgX3NlbGVjdCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKFxuICAgIE1hdExlZ2FjeVNlbGVjdEhhcm5lc3Mud2l0aCh7XG4gICAgICBhbmNlc3RvcjogJy5tYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZScsXG4gICAgfSksXG4gICk7XG4gIHByb3RlY3RlZCBfcGFnZVNpemVGYWxsYmFjayA9IHRoaXMubG9jYXRvckZvcignLm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplLXZhbHVlJyk7XG4gIHByb3RlY3RlZCBfcmFuZ2VMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1wYWdpbmF0b3ItcmFuZ2UtbGFiZWwnKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0UGFnaW5hdG9ySGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggcGFnaW5hdG9yIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFBhZ2luYXRvckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFBhZ2luYXRvckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UGFnaW5hdG9ySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==