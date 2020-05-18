/**
 * @fileoverview added by tsickle
 * Generated from: src/material/paginator/paginator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/**
 * The default page size if there is no page size and there are no provided page size options.
 * @type {?}
 */
const DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
}
if (false) {
    /**
     * The current page index.
     * @type {?}
     */
    PageEvent.prototype.pageIndex;
    /**
     * Index of the page that was selected previously.
     * \@breaking-change 8.0.0 To be made into a required property.
     * @type {?}
     */
    PageEvent.prototype.previousPageIndex;
    /**
     * The current page size
     * @type {?}
     */
    PageEvent.prototype.pageSize;
    /**
     * The current total number of items being paged
     * @type {?}
     */
    PageEvent.prototype.length;
}
/**
 * Object that can be used to configure the default options for the paginator module.
 * @record
 */
export function MatPaginatorDefaultOptions() { }
if (false) {
    /**
     * Number of items to display on a page. By default set to 50.
     * @type {?|undefined}
     */
    MatPaginatorDefaultOptions.prototype.pageSize;
    /**
     * The set of provided page size options to display to the user.
     * @type {?|undefined}
     */
    MatPaginatorDefaultOptions.prototype.pageSizeOptions;
    /**
     * Whether to hide the page size selection UI from the user.
     * @type {?|undefined}
     */
    MatPaginatorDefaultOptions.prototype.hidePageSize;
    /**
     * Whether to show the first/last buttons UI to the user.
     * @type {?|undefined}
     */
    MatPaginatorDefaultOptions.prototype.showFirstLastButtons;
}
/**
 * Injection token that can be used to provide the default options for the paginator module.
 * @type {?}
 */
export const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to MatPaginator.
/**
 * \@docs-private
 */
class MatPaginatorBase {
}
/** @type {?} */
const _MatPaginatorBase = mixinDisabled(mixinInitialized(MatPaginatorBase));
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
let MatPaginator = /** @class */ (() => {
    /**
     * Component to provide navigation between paged information. Displays the size of the current
     * page, user-selectable options to change that size, what items are being shown, and
     * navigational button to go to the previous or next page.
     */
    class MatPaginator extends _MatPaginatorBase {
        /**
         * @param {?} _intl
         * @param {?} _changeDetectorRef
         * @param {?=} defaults
         */
        constructor(_intl, _changeDetectorRef, defaults) {
            super();
            this._intl = _intl;
            this._changeDetectorRef = _changeDetectorRef;
            this._pageIndex = 0;
            this._length = 0;
            this._pageSizeOptions = [];
            this._hidePageSize = false;
            this._showFirstLastButtons = false;
            /**
             * Event emitted when the paginator changes the page size or page index.
             */
            this.page = new EventEmitter();
            this._intlChanges = _intl.changes.subscribe((/**
             * @return {?}
             */
            () => this._changeDetectorRef.markForCheck()));
            if (defaults) {
                const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaults;
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
            }
        }
        /**
         * The zero-based page index of the displayed list of items. Defaulted to 0.
         * @return {?}
         */
        get pageIndex() { return this._pageIndex; }
        /**
         * @param {?} value
         * @return {?}
         */
        set pageIndex(value) {
            this._pageIndex = Math.max(coerceNumberProperty(value), 0);
            this._changeDetectorRef.markForCheck();
        }
        /**
         * The length of the total number of items that are being paginated. Defaulted to 0.
         * @return {?}
         */
        get length() { return this._length; }
        /**
         * @param {?} value
         * @return {?}
         */
        set length(value) {
            this._length = coerceNumberProperty(value);
            this._changeDetectorRef.markForCheck();
        }
        /**
         * Number of items to display on a page. By default set to 50.
         * @return {?}
         */
        get pageSize() { return this._pageSize; }
        /**
         * @param {?} value
         * @return {?}
         */
        set pageSize(value) {
            this._pageSize = Math.max(coerceNumberProperty(value), 0);
            this._updateDisplayedPageSizeOptions();
        }
        /**
         * The set of provided page size options to display to the user.
         * @return {?}
         */
        get pageSizeOptions() { return this._pageSizeOptions; }
        /**
         * @param {?} value
         * @return {?}
         */
        set pageSizeOptions(value) {
            this._pageSizeOptions = (value || []).map((/**
             * @param {?} p
             * @return {?}
             */
            p => coerceNumberProperty(p)));
            this._updateDisplayedPageSizeOptions();
        }
        /**
         * Whether to hide the page size selection UI from the user.
         * @return {?}
         */
        get hidePageSize() { return this._hidePageSize; }
        /**
         * @param {?} value
         * @return {?}
         */
        set hidePageSize(value) {
            this._hidePageSize = coerceBooleanProperty(value);
        }
        /**
         * Whether to show the first/last buttons UI to the user.
         * @return {?}
         */
        get showFirstLastButtons() { return this._showFirstLastButtons; }
        /**
         * @param {?} value
         * @return {?}
         */
        set showFirstLastButtons(value) {
            this._showFirstLastButtons = coerceBooleanProperty(value);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            this._initialized = true;
            this._updateDisplayedPageSizeOptions();
            this._markInitialized();
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._intlChanges.unsubscribe();
        }
        /**
         * Advances to the next page if it exists.
         * @return {?}
         */
        nextPage() {
            if (!this.hasNextPage()) {
                return;
            }
            /** @type {?} */
            const previousPageIndex = this.pageIndex;
            this.pageIndex++;
            this._emitPageEvent(previousPageIndex);
        }
        /**
         * Move back to the previous page if it exists.
         * @return {?}
         */
        previousPage() {
            if (!this.hasPreviousPage()) {
                return;
            }
            /** @type {?} */
            const previousPageIndex = this.pageIndex;
            this.pageIndex--;
            this._emitPageEvent(previousPageIndex);
        }
        /**
         * Move to the first page if not already there.
         * @return {?}
         */
        firstPage() {
            // hasPreviousPage being false implies at the start
            if (!this.hasPreviousPage()) {
                return;
            }
            /** @type {?} */
            const previousPageIndex = this.pageIndex;
            this.pageIndex = 0;
            this._emitPageEvent(previousPageIndex);
        }
        /**
         * Move to the last page if not already there.
         * @return {?}
         */
        lastPage() {
            // hasNextPage being false implies at the end
            if (!this.hasNextPage()) {
                return;
            }
            /** @type {?} */
            const previousPageIndex = this.pageIndex;
            this.pageIndex = this.getNumberOfPages() - 1;
            this._emitPageEvent(previousPageIndex);
        }
        /**
         * Whether there is a previous page.
         * @return {?}
         */
        hasPreviousPage() {
            return this.pageIndex >= 1 && this.pageSize != 0;
        }
        /**
         * Whether there is a next page.
         * @return {?}
         */
        hasNextPage() {
            /** @type {?} */
            const maxPageIndex = this.getNumberOfPages() - 1;
            return this.pageIndex < maxPageIndex && this.pageSize != 0;
        }
        /**
         * Calculate the number of pages
         * @return {?}
         */
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
         * @param {?} pageSize
         * @return {?}
         */
        _changePageSize(pageSize) {
            // Current page needs to be updated to reflect the new page size. Navigate to the page
            // containing the previous page's first item.
            /** @type {?} */
            const startIndex = this.pageIndex * this.pageSize;
            /** @type {?} */
            const previousPageIndex = this.pageIndex;
            this.pageIndex = Math.floor(startIndex / pageSize) || 0;
            this.pageSize = pageSize;
            this._emitPageEvent(previousPageIndex);
        }
        /**
         * Checks whether the buttons for going forwards should be disabled.
         * @return {?}
         */
        _nextButtonsDisabled() {
            return this.disabled || !this.hasNextPage();
        }
        /**
         * Checks whether the buttons for going backwards should be disabled.
         * @return {?}
         */
        _previousButtonsDisabled() {
            return this.disabled || !this.hasPreviousPage();
        }
        /**
         * Updates the list of page size options to display to the user. Includes making sure that
         * the page size is an option and that the list is sorted.
         * @private
         * @return {?}
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
            this._displayedPageSizeOptions.sort((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            (a, b) => a - b));
            this._changeDetectorRef.markForCheck();
        }
        /**
         * Emits an event notifying that a change of the paginator's properties has been triggered.
         * @private
         * @param {?} previousPageIndex
         * @return {?}
         */
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
                    template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n",
                    inputs: ['disabled'],
                    host: {
                        'class': 'mat-paginator',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}\n"]
                }] }
    ];
    /** @nocollapse */
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
    return MatPaginator;
})();
export { MatPaginator };
if (false) {
    /** @type {?} */
    MatPaginator.ngAcceptInputType_pageIndex;
    /** @type {?} */
    MatPaginator.ngAcceptInputType_length;
    /** @type {?} */
    MatPaginator.ngAcceptInputType_pageSize;
    /** @type {?} */
    MatPaginator.ngAcceptInputType_hidePageSize;
    /** @type {?} */
    MatPaginator.ngAcceptInputType_showFirstLastButtons;
    /** @type {?} */
    MatPaginator.ngAcceptInputType_disabled;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._initialized;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._intlChanges;
    /**
     * Theme color to be used for the underlying form controls.
     * @type {?}
     */
    MatPaginator.prototype.color;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._pageIndex;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._length;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._pageSize;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._pageSizeOptions;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._hidePageSize;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._showFirstLastButtons;
    /**
     * Event emitted when the paginator changes the page size or page index.
     * @type {?}
     */
    MatPaginator.prototype.page;
    /**
     * Displayed set of page size options. Will be sorted and include current page size.
     * @type {?}
     */
    MatPaginator.prototype._displayedPageSizeOptions;
    /** @type {?} */
    MatPaginator.prototype._intl;
    /**
     * @type {?}
     * @private
     */
    MatPaginator.prototype._changeDetectorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixxQkFBcUIsRUFHdEIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFHTCxnQkFBZ0IsRUFFaEIsYUFBYSxHQUdkLE1BQU0sd0JBQXdCLENBQUM7Ozs7O01BRzFCLGlCQUFpQixHQUFHLEVBQUU7Ozs7O0FBTTVCLE1BQU0sT0FBTyxTQUFTO0NBZXJCOzs7Ozs7SUFiQyw4QkFBa0I7Ozs7OztJQU1sQixzQ0FBMkI7Ozs7O0lBRzNCLDZCQUFpQjs7Ozs7SUFHakIsMkJBQWU7Ozs7OztBQUtqQixnREFZQzs7Ozs7O0lBVkMsOENBQWtCOzs7OztJQUdsQixxREFBMkI7Ozs7O0lBRzNCLGtEQUF1Qjs7Ozs7SUFHdkIsMERBQStCOzs7Ozs7QUFJakMsTUFBTSxPQUFPLDZCQUE2QixHQUN0QyxJQUFJLGNBQWMsQ0FBNkIsK0JBQStCLENBQUM7Ozs7O0FBSW5GLE1BQU0sZ0JBQWdCO0NBQUc7O01BQ25CLGlCQUFpQixHQUNuQixhQUFhLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7O0FBT3JEOzs7Ozs7SUFBQSxNQVlhLFlBQWEsU0FBUSxpQkFBaUI7Ozs7OztRQW1FakQsWUFBbUIsS0FBdUIsRUFDdEIsa0JBQXFDLEVBRXpDLFFB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QWlGOzs7OztJQUdqRixpREFBb0M7O0lBRXhCLDZCQUE4Qjs7Ozs7SUFDOUIsMENBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIEJvb2xlYW5JbnB1dCxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRQYWdpbmF0b3JJbnRsfSBmcm9tICcuL3BhZ2luYXRvci1pbnRsJztcbmltcG9ydCB7XG4gIEhhc0luaXRpYWxpemVkLFxuICBIYXNJbml0aWFsaXplZEN0b3IsXG4gIG1peGluSW5pdGlhbGl6ZWQsXG4gIFRoZW1lUGFsZXR0ZSxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKiogVGhlIGRlZmF1bHQgcGFnZSBzaXplIGlmIHRoZXJlIGlzIG5vIHBhZ2Ugc2l6ZSBhbmQgdGhlcmUgYXJlIG5vIHByb3ZpZGVkIHBhZ2Ugc2l6ZSBvcHRpb25zLiAqL1xuY29uc3QgREVGQVVMVF9QQUdFX1NJWkUgPSA1MDtcblxuLyoqXG4gKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYVxuICogZGlmZmVyZW50IHBhZ2Ugc2l6ZSBvciBuYXZpZ2F0ZXMgdG8gYW5vdGhlciBwYWdlLlxuICovXG5leHBvcnQgY2xhc3MgUGFnZUV2ZW50IHtcbiAgLyoqIFRoZSBjdXJyZW50IHBhZ2UgaW5kZXguICovXG4gIHBhZ2VJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJbmRleCBvZiB0aGUgcGFnZSB0aGF0IHdhcyBzZWxlY3RlZCBwcmV2aW91c2x5LlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIFRvIGJlIG1hZGUgaW50byBhIHJlcXVpcmVkIHByb3BlcnR5LlxuICAgKi9cbiAgcHJldmlvdXNQYWdlSW5kZXg/OiBudW1iZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHBhZ2Ugc2l6ZSAqL1xuICBwYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgY3VycmVudCB0b3RhbCBudW1iZXIgb2YgaXRlbXMgYmVpbmcgcGFnZWQgKi9cbiAgbGVuZ3RoOiBudW1iZXI7XG59XG5cblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnMge1xuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgcGFnZVNpemU/OiBudW1iZXI7XG5cbiAgLyoqIFRoZSBzZXQgb2YgcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gKi9cbiAgcGFnZVNpemVPcHRpb25zPzogbnVtYmVyW107XG5cbiAgLyoqIFdoZXRoZXIgdG8gaGlkZSB0aGUgcGFnZSBzaXplIHNlbGVjdGlvbiBVSSBmcm9tIHRoZSB1c2VyLiAqL1xuICBoaWRlUGFnZVNpemU/OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHNob3cgdGhlIGZpcnN0L2xhc3QgYnV0dG9ucyBVSSB0byB0aGUgdXNlci4gKi9cbiAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zPignTUFUX1BBR0lOQVRPUl9ERUZBVUxUX09QVElPTlMnKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRQYWdpbmF0b3IuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0UGFnaW5hdG9yQmFzZSB7fVxuY29uc3QgX01hdFBhZ2luYXRvckJhc2U6IENhbkRpc2FibGVDdG9yICYgSGFzSW5pdGlhbGl6ZWRDdG9yICYgdHlwZW9mIE1hdFBhZ2luYXRvckJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQobWl4aW5Jbml0aWFsaXplZChNYXRQYWdpbmF0b3JCYXNlKSk7XG5cbi8qKlxuICogQ29tcG9uZW50IHRvIHByb3ZpZGUgbmF2aWdhdGlvbiBiZXR3ZWVuIHBhZ2VkIGluZm9ybWF0aW9uLiBEaXNwbGF5cyB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudFxuICogcGFnZSwgdXNlci1zZWxlY3RhYmxlIG9wdGlvbnMgdG8gY2hhbmdlIHRoYXQgc2l6ZSwgd2hhdCBpdGVtcyBhcmUgYmVpbmcgc2hvd24sIGFuZFxuICogbmF2aWdhdGlvbmFsIGJ1dHRvbiB0byBnbyB0byB0aGUgcHJldmlvdXMgb3IgbmV4dCBwYWdlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFnaW5hdG9yJyxcbiAgZXhwb3J0QXM6ICdtYXRQYWdpbmF0b3InLFxuICB0ZW1wbGF0ZVVybDogJ3BhZ2luYXRvci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3BhZ2luYXRvci5jc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXBhZ2luYXRvcicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQYWdpbmF0b3IgZXh0ZW5kcyBfTWF0UGFnaW5hdG9yQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDYW5EaXNhYmxlLFxuICBIYXNJbml0aWFsaXplZCB7XG4gIHByaXZhdGUgX2luaXRpYWxpemVkOiBib29sZWFuO1xuICBwcml2YXRlIF9pbnRsQ2hhbmdlczogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBUaGVtZSBjb2xvciB0byBiZSB1c2VkIGZvciB0aGUgdW5kZXJseWluZyBmb3JtIGNvbnRyb2xzLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBUaGUgemVyby1iYXNlZCBwYWdlIGluZGV4IG9mIHRoZSBkaXNwbGF5ZWQgbGlzdCBvZiBpdGVtcy4gRGVmYXVsdGVkIHRvIDAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3BhZ2VJbmRleDsgfVxuICBzZXQgcGFnZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wYWdlSW5kZXggPSBNYXRoLm1heChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSksIDApO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VJbmRleCA9IDA7XG5cbiAgLyoqIFRoZSBsZW5ndGggb2YgdGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcyB0aGF0IGFyZSBiZWluZyBwYWdpbmF0ZWQuIERlZmF1bHRlZCB0byAwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9sZW5ndGg7IH1cbiAgc2V0IGxlbmd0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbGVuZ3RoID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2xlbmd0aCA9IDA7XG5cbiAgLyoqIE51bWJlciBvZiBpdGVtcyB0byBkaXNwbGF5IG9uIGEgcGFnZS4gQnkgZGVmYXVsdCBzZXQgdG8gNTAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlU2l6ZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcGFnZVNpemU7IH1cbiAgc2V0IHBhZ2VTaXplKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IE1hdGgubWF4KGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSwgMCk7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZVNpemVPcHRpb25zKCk6IG51bWJlcltdIHsgcmV0dXJuIHRoaXMuX3BhZ2VTaXplT3B0aW9uczsgfVxuICBzZXQgcGFnZVNpemVPcHRpb25zKHZhbHVlOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9ICh2YWx1ZSB8fCBbXSkubWFwKHAgPT4gY29lcmNlTnVtYmVyUHJvcGVydHkocCkpO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VTaXplT3B0aW9uczogbnVtYmVyW10gPSBbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUGFnZVNpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUGFnZVNpemU7IH1cbiAgc2V0IGhpZGVQYWdlU2l6ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVQYWdlU2l6ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVBhZ2VTaXplID0gZmFsc2U7XG5cblxuICAvKiogV2hldGhlciB0byBzaG93IHRoZSBmaXJzdC9sYXN0IGJ1dHRvbnMgVUkgdG8gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93Rmlyc3RMYXN0QnV0dG9ucygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zOyB9XG4gIHNldCBzaG93Rmlyc3RMYXN0QnV0dG9ucyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHBhZ2luYXRvciBjaGFuZ2VzIHRoZSBwYWdlIHNpemUgb3IgcGFnZSBpbmRleC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBhZ2U6IEV2ZW50RW1pdHRlcjxQYWdlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxQYWdlRXZlbnQ+KCk7XG5cbiAgLyoqIERpc3BsYXllZCBzZXQgb2YgcGFnZSBzaXplIG9wdGlvbnMuIFdpbGwgYmUgc29ydGVkIGFuZCBpbmNsdWRlIGN1cnJlbnQgcGFnZSBzaXplLiAqL1xuICBfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zOiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2ludGw6IE1hdFBhZ2luYXRvckludGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRzPzogTWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzID0gX2ludGwuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuXG4gICAgaWYgKGRlZmF1bHRzKSB7XG4gICAgICBjb25zdCB7cGFnZVNpemUsIHBhZ2VTaXplT3B0aW9ucywgaGlkZVBhZ2VTaXplLCBzaG93Rmlyc3RMYXN0QnV0dG9uc30gPSBkZWZhdWx0cztcblxuICAgICAgaWYgKHBhZ2VTaXplICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhZ2VTaXplT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9IHBhZ2VTaXplT3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgaWYgKGhpZGVQYWdlU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2hpZGVQYWdlU2l6ZSA9IGhpZGVQYWdlU2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3dGaXJzdExhc3RCdXR0b25zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBzaG93Rmlyc3RMYXN0QnV0dG9ucztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9pbnRsQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEFkdmFuY2VzIHRvIHRoZSBuZXh0IHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBuZXh0UGFnZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzTmV4dFBhZ2UoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXgrKztcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIGJhY2sgdG8gdGhlIHByZXZpb3VzIHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBwcmV2aW91c1BhZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleC0tO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgdG8gdGhlIGZpcnN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGZpcnN0UGFnZSgpOiB2b2lkIHtcbiAgICAvLyBoYXNQcmV2aW91c1BhZ2UgYmVpbmcgZmFsc2UgaW1wbGllcyBhdCB0aGUgc3RhcnRcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gMDtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRvIHRoZSBsYXN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGxhc3RQYWdlKCk6IHZvaWQge1xuICAgIC8vIGhhc05leHRQYWdlIGJlaW5nIGZhbHNlIGltcGxpZXMgYXQgdGhlIGVuZFxuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMuZ2V0TnVtYmVyT2ZQYWdlcygpIC0gMTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgcHJldmlvdXMgcGFnZS4gKi9cbiAgaGFzUHJldmlvdXNQYWdlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhZ2VJbmRleCA+PSAxICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgbmV4dCBwYWdlLiAqL1xuICBoYXNOZXh0UGFnZSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBtYXhQYWdlSW5kZXggPSB0aGlzLmdldE51bWJlck9mUGFnZXMoKSAtIDE7XG4gICAgcmV0dXJuIHRoaXMucGFnZUluZGV4IDwgbWF4UGFnZUluZGV4ICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBwYWdlcyAqL1xuICBnZXROdW1iZXJPZlBhZ2VzKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnBhZ2VTaXplKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMubGVuZ3RoIC8gdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBwYWdlIHNpemUgc28gdGhhdCB0aGUgZmlyc3QgaXRlbSBkaXNwbGF5ZWQgb24gdGhlIHBhZ2Ugd2lsbCBzdGlsbCBiZVxuICAgKiBkaXNwbGF5ZWQgdXNpbmcgdGhlIG5ldyBwYWdlIHNpemUuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgcGFnZSBzaXplIGlzIDEwIGFuZCBvbiB0aGUgc2Vjb25kIHBhZ2UgKGl0ZW1zIGluZGV4ZWQgMTAtMTkpIHRoZW5cbiAgICogc3dpdGNoaW5nIHNvIHRoYXQgdGhlIHBhZ2Ugc2l6ZSBpcyA1IHdpbGwgc2V0IHRoZSB0aGlyZCBwYWdlIGFzIHRoZSBjdXJyZW50IHBhZ2Ugc29cbiAgICogdGhhdCB0aGUgMTB0aCBpdGVtIHdpbGwgc3RpbGwgYmUgZGlzcGxheWVkLlxuICAgKi9cbiAgX2NoYW5nZVBhZ2VTaXplKHBhZ2VTaXplOiBudW1iZXIpIHtcbiAgICAvLyBDdXJyZW50IHBhZ2UgbmVlZHMgdG8gYmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBuZXcgcGFnZSBzaXplLiBOYXZpZ2F0ZSB0byB0aGUgcGFnZVxuICAgIC8vIGNvbnRhaW5pbmcgdGhlIHByZXZpb3VzIHBhZ2UncyBmaXJzdCBpdGVtLlxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLnBhZ2VJbmRleCAqIHRoaXMucGFnZVNpemU7XG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcblxuICAgIHRoaXMucGFnZUluZGV4ID0gTWF0aC5mbG9vcihzdGFydEluZGV4IC8gcGFnZVNpemUpIHx8IDA7XG4gICAgdGhpcy5wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBidXR0b25zIGZvciBnb2luZyBmb3J3YXJkcyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIF9uZXh0QnV0dG9uc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmhhc05leHRQYWdlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGJ1dHRvbnMgZm9yIGdvaW5nIGJhY2t3YXJkcyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIF9wcmV2aW91c0J1dHRvbnNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5oYXNQcmV2aW91c1BhZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsaXN0IG9mIHBhZ2Ugc2l6ZSBvcHRpb25zIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXIuIEluY2x1ZGVzIG1ha2luZyBzdXJlIHRoYXRcbiAgICogdGhlIHBhZ2Ugc2l6ZSBpcyBhbiBvcHRpb24gYW5kIHRoYXQgdGhlIGxpc3QgaXMgc29ydGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCkge1xuICAgIGlmICghdGhpcy5faW5pdGlhbGl6ZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBJZiBubyBwYWdlIHNpemUgaXMgcHJvdmlkZWQsIHVzZSB0aGUgZmlyc3QgcGFnZSBzaXplIG9wdGlvbiBvciB0aGUgZGVmYXVsdCBwYWdlIHNpemUuXG4gICAgaWYgKCF0aGlzLnBhZ2VTaXplKSB7XG4gICAgICB0aGlzLl9wYWdlU2l6ZSA9IHRoaXMucGFnZVNpemVPcHRpb25zLmxlbmd0aCAhPSAwID9cbiAgICAgICAgICB0aGlzLnBhZ2VTaXplT3B0aW9uc1swXSA6XG4gICAgICAgICAgREVGQVVMVF9QQUdFX1NJWkU7XG4gICAgfVxuXG4gICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zID0gdGhpcy5wYWdlU2l6ZU9wdGlvbnMuc2xpY2UoKTtcblxuICAgIGlmICh0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuaW5kZXhPZih0aGlzLnBhZ2VTaXplKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5wdXNoKHRoaXMucGFnZVNpemUpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgdGhlIG51bWJlcnMgdXNpbmcgYSBudW1iZXItc3BlY2lmaWMgc29ydCBmdW5jdGlvbi5cbiAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGV2ZW50IG5vdGlmeWluZyB0aGF0IGEgY2hhbmdlIG9mIHRoZSBwYWdpbmF0b3IncyBwcm9wZXJ0aWVzIGhhcyBiZWVuIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5wYWdlLmVtaXQoe1xuICAgICAgcHJldmlvdXNQYWdlSW5kZXgsXG4gICAgICBwYWdlSW5kZXg6IHRoaXMucGFnZUluZGV4LFxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICBsZW5ndGg6IHRoaXMubGVuZ3RoXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcGFnZUluZGV4OiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xlbmd0aDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9wYWdlU2l6ZTogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRlUGFnZVNpemU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Nob3dGaXJzdExhc3RCdXR0b25zOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19