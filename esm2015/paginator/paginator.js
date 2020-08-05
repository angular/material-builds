/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation, InjectionToken, Inject, Optional, } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { mixinInitialized, mixinDisabled, } from '@angular/material/core';
/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
}
/** Injection token that can be used to provide the default options for the paginator module. */
export const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to MatPaginator.
/** @docs-private */
class MatPaginatorBase {
}
const _MatPaginatorBase = mixinDisabled(mixinInitialized(MatPaginatorBase));
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export class MatPaginator extends _MatPaginatorBase {
    constructor(_intl, _changeDetectorRef, defaults) {
        super();
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._pageIndex = 0;
        this._length = 0;
        this._pageSizeOptions = [];
        this._hidePageSize = false;
        this._showFirstLastButtons = false;
        /** Event emitted when the paginator changes the page size or page index. */
        this.page = new EventEmitter();
        this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
        if (defaults) {
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons, formFieldAppearance, } = defaults;
            if (pageSize != null) {
                this._pageSize = pageSize;
            }
            if (pageSizeOptions != null) {
                this._pageSizeOptions = pageSizeOptions;
            }
            if (hidePageSize != null) {
                this._hidePageSize = hidePageSize;
            }
            if (showFirstLastButtons != null) {
                this._showFirstLastButtons = showFirstLastButtons;
            }
            if (formFieldAppearance != null) {
                this._formFieldAppearance = formFieldAppearance;
            }
        }
    }
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    get pageIndex() { return this._pageIndex; }
    set pageIndex(value) {
        this._pageIndex = Math.max(coerceNumberProperty(value), 0);
        this._changeDetectorRef.markForCheck();
    }
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length() { return this._length; }
    set length(value) {
        this._length = coerceNumberProperty(value);
        this._changeDetectorRef.markForCheck();
    }
    /** Number of items to display on a page. By default set to 50. */
    get pageSize() { return this._pageSize; }
    set pageSize(value) {
        this._pageSize = Math.max(coerceNumberProperty(value), 0);
        this._updateDisplayedPageSizeOptions();
    }
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions() { return this._pageSizeOptions; }
    set pageSizeOptions(value) {
        this._pageSizeOptions = (value || []).map(p => coerceNumberProperty(p));
        this._updateDisplayedPageSizeOptions();
    }
    /** Whether to hide the page size selection UI from the user. */
    get hidePageSize() { return this._hidePageSize; }
    set hidePageSize(value) {
        this._hidePageSize = coerceBooleanProperty(value);
    }
    /** Whether to show the first/last buttons UI to the user. */
    get showFirstLastButtons() { return this._showFirstLastButtons; }
    set showFirstLastButtons(value) {
        this._showFirstLastButtons = coerceBooleanProperty(value);
    }
    ngOnInit() {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
        this._markInitialized();
    }
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /** Advances to the next page if it exists. */
    nextPage() {
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex++;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move back to the previous page if it exists. */
    previousPage() {
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex--;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the first page if not already there. */
    firstPage() {
        // hasPreviousPage being false implies at the start
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = 0;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the last page if not already there. */
    lastPage() {
        // hasNextPage being false implies at the end
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.getNumberOfPages() - 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Whether there is a previous page. */
    hasPreviousPage() {
        return this.pageIndex >= 1 && this.pageSize != 0;
    }
    /** Whether there is a next page. */
    hasNextPage() {
        const maxPageIndex = this.getNumberOfPages() - 1;
        return this.pageIndex < maxPageIndex && this.pageSize != 0;
    }
    /** Calculate the number of pages */
    getNumberOfPages() {
        if (!this.pageSize) {
            return 0;
        }
        return Math.ceil(this.length / this.pageSize);
    }
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        const startIndex = this.pageIndex * this.pageSize;
        const previousPageIndex = this.pageIndex;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent(previousPageIndex);
    }
    /** Checks whether the buttons for going forwards should be disabled. */
    _nextButtonsDisabled() {
        return this.disabled || !this.hasNextPage();
    }
    /** Checks whether the buttons for going backwards should be disabled. */
    _previousButtonsDisabled() {
        return this.disabled || !this.hasPreviousPage();
    }
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    _updateDisplayedPageSizeOptions() {
        if (!this._initialized) {
            return;
        }
        // If no page size is provided, use the first page size option or the default page size.
        if (!this.pageSize) {
            this._pageSize = this.pageSizeOptions.length != 0 ?
                this.pageSizeOptions[0] :
                DEFAULT_PAGE_SIZE;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.slice();
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort((a, b) => a - b);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    _emitPageEvent(previousPageIndex) {
        this.page.emit({
            previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    }
}
MatPaginator.decorators = [
    { type: Component, args: [{
                selector: 'mat-paginator',
                exportAs: 'matPaginator',
                template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n",
                inputs: ['disabled'],
                host: {
                    'class': 'mat-paginator',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}\n"]
            },] }
];
MatPaginator.ctorParameters = () => [
    { type: MatPaginatorIntl },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PAGINATOR_DEFAULT_OPTIONS,] }] }
];
MatPaginator.propDecorators = {
    color: [{ type: Input }],
    pageIndex: [{ type: Input }],
    length: [{ type: Input }],
    pageSize: [{ type: Input }],
    pageSizeOptions: [{ type: Input }],
    hidePageSize: [{ type: Input }],
    showFirstLastButtons: [{ type: Input }],
    page: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixxQkFBcUIsRUFHdEIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFHTCxnQkFBZ0IsRUFFaEIsYUFBYSxHQUdkLE1BQU0sd0JBQXdCLENBQUM7QUFHaEMsa0dBQWtHO0FBQ2xHLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRTdCOzs7R0FHRztBQUNILE1BQU0sT0FBTyxTQUFTO0NBZXJCO0FBcUJELGdHQUFnRztBQUNoRyxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FDdEMsSUFBSSxjQUFjLENBQTZCLCtCQUErQixDQUFDLENBQUM7QUFFcEYsbURBQW1EO0FBQ25ELG9CQUFvQjtBQUNwQixNQUFNLGdCQUFnQjtDQUFHO0FBQ3pCLE1BQU0saUJBQWlCLEdBQ25CLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFFdEQ7Ozs7R0FJRztBQWFILE1BQU0sT0FBTyxZQUFhLFNBQVEsaUJBQWlCO0lBc0VqRCxZQUFtQixLQUF1QixFQUN0QixrQkFBcUMsRUFFekMsUUFBcUM7UUFDbkQsS0FBSyxFQUFFLENBQUM7UUFKUyxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN0Qix1QkFBa0IsR0FBbEIsa0JBQWtC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QyxFQUFFO1lBQ2hFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsMERBQTBEO1FBQzFELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCwrRkFBK0Y7SUFDdkYsY0FBYyxDQUFDLGlCQUF5QjtRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNiLGlCQUFpQjtZQUNqQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUEzUEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUUsY0FBYztnQkFDeEIsdXZIQUE2QjtnQkFFN0IsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNwQixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLGVBQWU7aUJBQ3pCO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQWpGTyxnQkFBZ0I7WUFidEIsaUJBQWlCOzRDQXVLSixRQUFRLFlBQUksTUFBTSxTQUFDLDZCQUE2Qjs7O29CQWxFNUQsS0FBSzt3QkFHTCxLQUFLO3FCQVNMLEtBQUs7dUJBU0wsS0FBSzs4QkFTTCxLQUFLOzJCQVNMLEtBQUs7bUNBU0wsS0FBSzttQkFRTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIEJvb2xlYW5JbnB1dCxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRQYWdpbmF0b3JJbnRsfSBmcm9tICcuL3BhZ2luYXRvci1pbnRsJztcbmltcG9ydCB7XG4gIEhhc0luaXRpYWxpemVkLFxuICBIYXNJbml0aWFsaXplZEN0b3IsXG4gIG1peGluSW5pdGlhbGl6ZWQsXG4gIFRoZW1lUGFsZXR0ZSxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRBcHBlYXJhbmNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcblxuLyoqIFRoZSBkZWZhdWx0IHBhZ2Ugc2l6ZSBpZiB0aGVyZSBpcyBubyBwYWdlIHNpemUgYW5kIHRoZXJlIGFyZSBubyBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucy4gKi9cbmNvbnN0IERFRkFVTFRfUEFHRV9TSVpFID0gNTA7XG5cbi8qKlxuICogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3RzIGFcbiAqIGRpZmZlcmVudCBwYWdlIHNpemUgb3IgbmF2aWdhdGVzIHRvIGFub3RoZXIgcGFnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhZ2VFdmVudCB7XG4gIC8qKiBUaGUgY3VycmVudCBwYWdlIGluZGV4LiAqL1xuICBwYWdlSW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogSW5kZXggb2YgdGhlIHBhZ2UgdGhhdCB3YXMgc2VsZWN0ZWQgcHJldmlvdXNseS5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBUbyBiZSBtYWRlIGludG8gYSByZXF1aXJlZCBwcm9wZXJ0eS5cbiAgICovXG4gIHByZXZpb3VzUGFnZUluZGV4PzogbnVtYmVyO1xuXG4gIC8qKiBUaGUgY3VycmVudCBwYWdlIHNpemUgKi9cbiAgcGFnZVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIGN1cnJlbnQgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIGJlaW5nIHBhZ2VkICovXG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHBhZ2luYXRvciBtb2R1bGUuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zIHtcbiAgLyoqIE51bWJlciBvZiBpdGVtcyB0byBkaXNwbGF5IG9uIGEgcGFnZS4gQnkgZGVmYXVsdCBzZXQgdG8gNTAuICovXG4gIHBhZ2VTaXplPzogbnVtYmVyO1xuXG4gIC8qKiBUaGUgc2V0IG9mIHByb3ZpZGVkIHBhZ2Ugc2l6ZSBvcHRpb25zIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXIuICovXG4gIHBhZ2VTaXplT3B0aW9ucz86IG51bWJlcltdO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGhpZGUgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rpb24gVUkgZnJvbSB0aGUgdXNlci4gKi9cbiAgaGlkZVBhZ2VTaXplPzogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0byBzaG93IHRoZSBmaXJzdC9sYXN0IGJ1dHRvbnMgVUkgdG8gdGhlIHVzZXIuICovXG4gIHNob3dGaXJzdExhc3RCdXR0b25zPzogYm9vbGVhbjtcblxuICAvKiogVGhlIGRlZmF1bHQgZm9ybS1maWVsZCBhcHBlYXJhbmNlIHRvIGFwcGx5IHRvIHRoZSBwYWdlIHNpemUgb3B0aW9ucyBzZWxlY3Rvci4gKi9cbiAgZm9ybUZpZWxkQXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwYWdpbmF0b3IgbW9kdWxlLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnM+KCdNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUycpO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFBhZ2luYXRvci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRQYWdpbmF0b3JCYXNlIHt9XG5jb25zdCBfTWF0UGFnaW5hdG9yQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiBIYXNJbml0aWFsaXplZEN0b3IgJiB0eXBlb2YgTWF0UGFnaW5hdG9yQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlZChtaXhpbkluaXRpYWxpemVkKE1hdFBhZ2luYXRvckJhc2UpKTtcblxuLyoqXG4gKiBDb21wb25lbnQgdG8gcHJvdmlkZSBuYXZpZ2F0aW9uIGJldHdlZW4gcGFnZWQgaW5mb3JtYXRpb24uIERpc3BsYXlzIHRoZSBzaXplIG9mIHRoZSBjdXJyZW50XG4gKiBwYWdlLCB1c2VyLXNlbGVjdGFibGUgb3B0aW9ucyB0byBjaGFuZ2UgdGhhdCBzaXplLCB3aGF0IGl0ZW1zIGFyZSBiZWluZyBzaG93biwgYW5kXG4gKiBuYXZpZ2F0aW9uYWwgYnV0dG9uIHRvIGdvIHRvIHRoZSBwcmV2aW91cyBvciBuZXh0IHBhZ2UuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1wYWdpbmF0b3InLFxuICBleHBvcnRBczogJ21hdFBhZ2luYXRvcicsXG4gIHRlbXBsYXRlVXJsOiAncGFnaW5hdG9yLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncGFnaW5hdG9yLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcGFnaW5hdG9yJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvciBleHRlbmRzIF9NYXRQYWdpbmF0b3JCYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsXG4gIEhhc0luaXRpYWxpemVkIHtcbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX2ludGxDaGFuZ2VzOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFRoZW1lIGNvbG9yIHRvIGJlIHVzZWQgZm9yIHRoZSB1bmRlcmx5aW5nIGZvcm0gY29udHJvbHMuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFRoZSB6ZXJvLWJhc2VkIHBhZ2UgaW5kZXggb2YgdGhlIGRpc3BsYXllZCBsaXN0IG9mIGl0ZW1zLiBEZWZhdWx0ZWQgdG8gMC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcGFnZUluZGV4OyB9XG4gIHNldCBwYWdlSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VJbmRleCA9IE1hdGgubWF4KGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSwgMCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZUluZGV4ID0gMDtcblxuICAvKiogVGhlIGxlbmd0aCBvZiB0aGUgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIHRoYXQgYXJlIGJlaW5nIHBhZ2luYXRlZC4gRGVmYXVsdGVkIHRvIDAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xlbmd0aDsgfVxuICBzZXQgbGVuZ3RoKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9sZW5ndGggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbGVuZ3RoID0gMDtcblxuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9wYWdlU2l6ZTsgfVxuICBzZXQgcGFnZVNpemUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VTaXplID0gTWF0aC5tYXgoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpLCAwKTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgc2V0IG9mIHByb3ZpZGVkIHBhZ2Ugc2l6ZSBvcHRpb25zIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlU2l6ZU9wdGlvbnMoKTogbnVtYmVyW10geyByZXR1cm4gdGhpcy5fcGFnZVNpemVPcHRpb25zOyB9XG4gIHNldCBwYWdlU2l6ZU9wdGlvbnModmFsdWU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gKHZhbHVlIHx8IFtdKS5tYXAocCA9PiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShwKSk7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZVNpemVPcHRpb25zOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGhpZGUgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rpb24gVUkgZnJvbSB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVQYWdlU2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2hpZGVQYWdlU2l6ZTsgfVxuICBzZXQgaGlkZVBhZ2VTaXplKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVBhZ2VTaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlUGFnZVNpemUgPSBmYWxzZTtcblxuXG4gIC8qKiBXaGV0aGVyIHRvIHNob3cgdGhlIGZpcnN0L2xhc3QgYnV0dG9ucyBVSSB0byB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNob3dGaXJzdExhc3RCdXR0b25zKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnM7IH1cbiAgc2V0IHNob3dGaXJzdExhc3RCdXR0b25zKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3Nob3dGaXJzdExhc3RCdXR0b25zID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgcGFnaW5hdG9yIGNoYW5nZXMgdGhlIHBhZ2Ugc2l6ZSBvciBwYWdlIGluZGV4LiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcGFnZTogRXZlbnRFbWl0dGVyPFBhZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2VFdmVudD4oKTtcblxuICAvKiogRGlzcGxheWVkIHNldCBvZiBwYWdlIHNpemUgb3B0aW9ucy4gV2lsbCBiZSBzb3J0ZWQgYW5kIGluY2x1ZGUgY3VycmVudCBwYWdlIHNpemUuICovXG4gIF9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdO1xuXG4gIC8qKiBJZiBzZXQsIHN0eWxlcyB0aGUgXCJwYWdlIHNpemVcIiBmb3JtIGZpZWxkIHdpdGggdGhlIGRlc2lnbmF0ZWQgc3R5bGUuICovXG4gIF9mb3JtRmllbGRBcHBlYXJhbmNlPzogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2ludGw6IE1hdFBhZ2luYXRvckludGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRzPzogTWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzID0gX2ludGwuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuXG4gICAgaWYgKGRlZmF1bHRzKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHBhZ2VTaXplLFxuICAgICAgICBwYWdlU2l6ZU9wdGlvbnMsXG4gICAgICAgIGhpZGVQYWdlU2l6ZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnMsXG4gICAgICAgIGZvcm1GaWVsZEFwcGVhcmFuY2UsXG4gICAgICB9ID0gZGVmYXVsdHM7XG5cbiAgICAgIGlmIChwYWdlU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BhZ2VTaXplID0gcGFnZVNpemU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYWdlU2l6ZU9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMgPSBwYWdlU2l6ZU9wdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChoaWRlUGFnZVNpemUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9oaWRlUGFnZVNpemUgPSBoaWRlUGFnZVNpemU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaG93Rmlyc3RMYXN0QnV0dG9ucyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zID0gc2hvd0ZpcnN0TGFzdEJ1dHRvbnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JtRmllbGRBcHBlYXJhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkQXBwZWFyYW5jZSA9IGZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICAgIHRoaXMuX21hcmtJbml0aWFsaXplZCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5faW50bENoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBBZHZhbmNlcyB0byB0aGUgbmV4dCBwYWdlIGlmIGl0IGV4aXN0cy4gKi9cbiAgbmV4dFBhZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc05leHRQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4Kys7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogTW92ZSBiYWNrIHRvIHRoZSBwcmV2aW91cyBwYWdlIGlmIGl0IGV4aXN0cy4gKi9cbiAgcHJldmlvdXNQYWdlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNQcmV2aW91c1BhZ2UoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXgtLTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRvIHRoZSBmaXJzdCBwYWdlIGlmIG5vdCBhbHJlYWR5IHRoZXJlLiAqL1xuICBmaXJzdFBhZ2UoKTogdm9pZCB7XG4gICAgLy8gaGFzUHJldmlvdXNQYWdlIGJlaW5nIGZhbHNlIGltcGxpZXMgYXQgdGhlIHN0YXJ0XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IDA7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogTW92ZSB0byB0aGUgbGFzdCBwYWdlIGlmIG5vdCBhbHJlYWR5IHRoZXJlLiAqL1xuICBsYXN0UGFnZSgpOiB2b2lkIHtcbiAgICAvLyBoYXNOZXh0UGFnZSBiZWluZyBmYWxzZSBpbXBsaWVzIGF0IHRoZSBlbmRcbiAgICBpZiAoIXRoaXMuaGFzTmV4dFBhZ2UoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLmdldE51bWJlck9mUGFnZXMoKSAtIDE7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGVyZSBpcyBhIHByZXZpb3VzIHBhZ2UuICovXG4gIGhhc1ByZXZpb3VzUGFnZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlSW5kZXggPj0gMSAmJiB0aGlzLnBhZ2VTaXplICE9IDA7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGVyZSBpcyBhIG5leHQgcGFnZS4gKi9cbiAgaGFzTmV4dFBhZ2UoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbWF4UGFnZUluZGV4ID0gdGhpcy5nZXROdW1iZXJPZlBhZ2VzKCkgLSAxO1xuICAgIHJldHVybiB0aGlzLnBhZ2VJbmRleCA8IG1heFBhZ2VJbmRleCAmJiB0aGlzLnBhZ2VTaXplICE9IDA7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgcGFnZXMgKi9cbiAgZ2V0TnVtYmVyT2ZQYWdlcygpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5wYWdlU2l6ZSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xuICB9XG5cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgcGFnZSBzaXplIHNvIHRoYXQgdGhlIGZpcnN0IGl0ZW0gZGlzcGxheWVkIG9uIHRoZSBwYWdlIHdpbGwgc3RpbGwgYmVcbiAgICogZGlzcGxheWVkIHVzaW5nIHRoZSBuZXcgcGFnZSBzaXplLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIHBhZ2Ugc2l6ZSBpcyAxMCBhbmQgb24gdGhlIHNlY29uZCBwYWdlIChpdGVtcyBpbmRleGVkIDEwLTE5KSB0aGVuXG4gICAqIHN3aXRjaGluZyBzbyB0aGF0IHRoZSBwYWdlIHNpemUgaXMgNSB3aWxsIHNldCB0aGUgdGhpcmQgcGFnZSBhcyB0aGUgY3VycmVudCBwYWdlIHNvXG4gICAqIHRoYXQgdGhlIDEwdGggaXRlbSB3aWxsIHN0aWxsIGJlIGRpc3BsYXllZC5cbiAgICovXG4gIF9jaGFuZ2VQYWdlU2l6ZShwYWdlU2l6ZTogbnVtYmVyKSB7XG4gICAgLy8gQ3VycmVudCBwYWdlIG5lZWRzIHRvIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgbmV3IHBhZ2Ugc2l6ZS4gTmF2aWdhdGUgdG8gdGhlIHBhZ2VcbiAgICAvLyBjb250YWluaW5nIHRoZSBwcmV2aW91cyBwYWdlJ3MgZmlyc3QgaXRlbS5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5wYWdlSW5kZXggKiB0aGlzLnBhZ2VTaXplO1xuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG5cbiAgICB0aGlzLnBhZ2VJbmRleCA9IE1hdGguZmxvb3Ioc3RhcnRJbmRleCAvIHBhZ2VTaXplKSB8fCAwO1xuICAgIHRoaXMucGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgYnV0dG9ucyBmb3IgZ29pbmcgZm9yd2FyZHMgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5oYXNOZXh0UGFnZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBidXR0b25zIGZvciBnb2luZyBiYWNrd2FyZHMgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaGFzUHJldmlvdXNQYWdlKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGlzdCBvZiBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiBJbmNsdWRlcyBtYWtpbmcgc3VyZSB0aGF0XG4gICAqIHRoZSBwYWdlIHNpemUgaXMgYW4gb3B0aW9uIGFuZCB0aGF0IHRoZSBsaXN0IGlzIHNvcnRlZC5cbiAgICovXG4gIHByaXZhdGUgX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMuX2luaXRpYWxpemVkKSB7IHJldHVybjsgfVxuXG4gICAgLy8gSWYgbm8gcGFnZSBzaXplIGlzIHByb3ZpZGVkLCB1c2UgdGhlIGZpcnN0IHBhZ2Ugc2l6ZSBvcHRpb24gb3IgdGhlIGRlZmF1bHQgcGFnZSBzaXplLlxuICAgIGlmICghdGhpcy5wYWdlU2l6ZSkge1xuICAgICAgdGhpcy5fcGFnZVNpemUgPSB0aGlzLnBhZ2VTaXplT3B0aW9ucy5sZW5ndGggIT0gMCA/XG4gICAgICAgICAgdGhpcy5wYWdlU2l6ZU9wdGlvbnNbMF0gOlxuICAgICAgICAgIERFRkFVTFRfUEFHRV9TSVpFO1xuICAgIH1cblxuICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucyA9IHRoaXMucGFnZVNpemVPcHRpb25zLnNsaWNlKCk7XG5cbiAgICBpZiAodGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLmluZGV4T2YodGhpcy5wYWdlU2l6ZSkgPT09IC0xKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMucHVzaCh0aGlzLnBhZ2VTaXplKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSBudW1iZXJzIHVzaW5nIGEgbnVtYmVyLXNwZWNpZmljIHNvcnQgZnVuY3Rpb24uXG4gICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBhbiBldmVudCBub3RpZnlpbmcgdGhhdCBhIGNoYW5nZSBvZiB0aGUgcGFnaW5hdG9yJ3MgcHJvcGVydGllcyBoYXMgYmVlbiB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgIHByZXZpb3VzUGFnZUluZGV4LFxuICAgICAgcGFnZUluZGV4OiB0aGlzLnBhZ2VJbmRleCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGVuZ3RoOiB0aGlzLmxlbmd0aFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3BhZ2VJbmRleDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9sZW5ndGg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcGFnZVNpemU6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZVBhZ2VTaXplOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zaG93Rmlyc3RMYXN0QnV0dG9uczogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==