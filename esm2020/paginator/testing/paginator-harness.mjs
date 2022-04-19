/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
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
        this._select = this.locatorForOptional(MatSelectHarness.with({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3Rlc3RpbmcvcGFnaW5hdG9yLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUczRCxNQUFNLE9BQWdCLHdCQUF5QixTQUFRLGdCQUFnQjtJQWVyRSw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELCtEQUErRDtJQUMvRCxLQUFLLENBQUMsa0JBQWtCO1FBQ3RCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRixPQUFPLGFBQWEsSUFBSSxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUVELGtFQUFrRTtJQUNsRSxLQUFLLENBQUMsc0JBQXNCO1FBQzFCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRixPQUFPLGFBQWEsSUFBSSxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFD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QkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0U2VsZWN0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGFnaW5hdG9ySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcGFnaW5hdG9yLWhhcm5lc3MtZmlsdGVycyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0UGFnaW5hdG9ySGFybmVzc0Jhc2UgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9uZXh0QnV0dG9uOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcHJldmlvdXNCdXR0b246IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50PjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9maXJzdFBhZ2VCdXR0b246IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50IHwgbnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfbGFzdFBhZ2VCdXR0b246IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50IHwgbnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2VsZWN0OiBBc3luY0ZhY3RvcnlGbjxcbiAgICB8IChDb21wb25lbnRIYXJuZXNzICYge1xuICAgICAgICBnZXRWYWx1ZVRleHQoKTogUHJvbWlzZTxzdHJpbmc+O1xuICAgICAgICBjbGlja09wdGlvbnMoLi4uZmlsdGVyczogdW5rbm93bltdKTogUHJvbWlzZTx2b2lkPjtcbiAgICAgIH0pXG4gICAgfCBudWxsXG4gID47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcGFnZVNpemVGYWxsYmFjazogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3JhbmdlTGFiZWw6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50PjtcblxuICAvKiogR29lcyB0byB0aGUgbmV4dCBwYWdlIGluIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdvVG9OZXh0UGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX25leHRCdXR0b24oKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBuZXh0IHBhZ2UgYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc05leHRQYWdlRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWRWYWx1ZSA9IGF3YWl0IChhd2FpdCB0aGlzLl9uZXh0QnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gZGlzYWJsZWRWYWx1ZSA9PSAndHJ1ZSc7XG4gIH1cblxuICAvKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBwcmV2aW91cyBwYWdlIGJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNQcmV2aW91c1BhZ2VEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZFZhbHVlID0gYXdhaXQgKGF3YWl0IHRoaXMuX3ByZXZpb3VzQnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gZGlzYWJsZWRWYWx1ZSA9PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogR29lcyB0byB0aGUgcHJldmlvdXMgcGFnZSBpbiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnb1RvUHJldmlvdXNQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fcHJldmlvdXNCdXR0b24oKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHb2VzIHRvIHRoZSBmaXJzdCBwYWdlIGluIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdvVG9GaXJzdFBhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYnV0dG9uID0gYXdhaXQgdGhpcy5fZmlyc3RQYWdlQnV0dG9uKCk7XG5cbiAgICAvLyBUaGUgZmlyc3QgcGFnZSBidXR0b24gaXNuJ3QgZW5hYmxlZCBieSBkZWZhdWx0IHNvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGl0LlxuICAgIGlmICghYnV0dG9uKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIGZpcnN0IHBhZ2UgYnV0dG9uIGluc2lkZSBwYWdpbmF0b3IuICcgK1xuICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCBgc2hvd0ZpcnN0TGFzdEJ1dHRvbnNgIGlzIGVuYWJsZWQuJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdvZXMgdG8gdGhlIGxhc3QgcGFnZSBpbiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnb1RvTGFzdFBhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYnV0dG9uID0gYXdhaXQgdGhpcy5fbGFzdFBhZ2VCdXR0b24oKTtcblxuICAgIC8vIFRoZSBsYXN0IHBhZ2UgYnV0dG9uIGlzbid0IGVuYWJsZWQgYnkgZGVmYXVsdCBzbyB3ZSBuZWVkIHRvIGNoZWNrIGZvciBpdC5cbiAgICBpZiAoIWJ1dHRvbikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDb3VsZCBub3QgZmluZCBsYXN0IHBhZ2UgYnV0dG9uIGluc2lkZSBwYWdpbmF0b3IuICcgK1xuICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCBgc2hvd0ZpcnN0TGFzdEJ1dHRvbnNgIGlzIGVuYWJsZWQuJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhZ2Ugc2l6ZSBvZiB0aGUgcGFnaW5hdG9yLlxuICAgKiBAcGFyYW0gc2l6ZSBQYWdlIHNpemUgdGhhdCBzaG91bGQgYmUgc2VsZWN0LlxuICAgKi9cbiAgYXN5bmMgc2V0UGFnZVNpemUoc2l6ZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2VsZWN0ID0gYXdhaXQgdGhpcy5fc2VsZWN0KCk7XG5cbiAgICAvLyBUaGUgc2VsZWN0IGlzIG9ubHkgYXZhaWxhYmxlIGlmIHRoZSBgcGFnZVNpemVPcHRpb25zYCBhcmVcbiAgICAvLyBzZXQgdG8gYW4gYXJyYXkgd2l0aCBtb3JlIHRoYW4gb25lIGl0ZW0uXG4gICAgaWYgKCFzZWxlY3QpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGZpbmQgcGFnZSBzaXplIHNlbGVjdG9yIGluIHBhZ2luYXRvci4gJyArXG4gICAgICAgICAgJ01ha2Ugc3VyZSB0aGF0IHRoZSBgcGFnZVNpemVPcHRpb25zYCBoYXZlIGJlZW4gY29uZmlndXJlZC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0LmNsaWNrT3B0aW9ucyh7dGV4dDogYCR7c2l6ZX1gfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGFnZSBzaXplIG9mIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdldFBhZ2VTaXplKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3Qgc2VsZWN0ID0gYXdhaXQgdGhpcy5fc2VsZWN0KCk7XG4gICAgY29uc3QgdmFsdWUgPSBzZWxlY3QgPyBzZWxlY3QuZ2V0VmFsdWVUZXh0KCkgOiAoYXdhaXQgdGhpcy5fcGFnZVNpemVGYWxsYmFjaygpKS50ZXh0KCk7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSByYW5nZSBsYWJlIG9mIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdldFJhbmdlTGFiZWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3JhbmdlTGFiZWwoKSkudGV4dCgpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXBhZ2luYXRvciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRQYWdpbmF0b3JIYXJuZXNzIGV4dGVuZHMgX01hdFBhZ2luYXRvckhhcm5lc3NCYXNlIHtcbiAgLyoqIFNlbGVjdG9yIHVzZWQgdG8gZmluZCBwYWdpbmF0b3IgaW5zdGFuY2VzLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcGFnaW5hdG9yJztcbiAgcHJvdGVjdGVkIF9uZXh0QnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLW5leHQnKTtcbiAgcHJvdGVjdGVkIF9wcmV2aW91c0J1dHRvbiA9IHRoaXMubG9jYXRvckZvcignLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1wcmV2aW91cycpO1xuICBwcm90ZWN0ZWQgX2ZpcnN0UGFnZUJ1dHRvbiA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLWZpcnN0Jyk7XG4gIHByb3RlY3RlZCBfbGFzdFBhZ2VCdXR0b24gPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1sYXN0Jyk7XG4gIHByb3RlY3RlZCBfc2VsZWN0ID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoXG4gICAgTWF0U2VsZWN0SGFybmVzcy53aXRoKHtcbiAgICAgIGFuY2VzdG9yOiAnLm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplJyxcbiAgICB9KSxcbiAgKTtcbiAgcHJvdGVjdGVkIF9wYWdlU2l6ZUZhbGxiYWNrID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1wYWdlLXNpemUtdmFsdWUnKTtcbiAgcHJvdGVjdGVkIF9yYW5nZUxhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1yYW5nZS1sYWJlbCcpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRQYWdpbmF0b3JIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBwYWdpbmF0b3IgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUGFnaW5hdG9ySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0UGFnaW5hdG9ySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRQYWdpbmF0b3JIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuIl19