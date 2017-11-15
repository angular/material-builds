/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/common';
import { Optional, SkipSelf } from '@angular/core';
import '@angular/material/button';
import '@angular/material/select';
import '@angular/material/tooltip';
import 'rxjs/Subject';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * To modify the labels and text displayed, create a new instance of MatPaginatorIntl and
 * include it in a custom provider
 */
var MatPaginatorIntl = /** @class */ (function () {
    function MatPaginatorIntl() {
    }
    return MatPaginatorIntl;
}());
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatPaginatorIntl();
}
/**
 * \@docs-private
 */
var MAT_PAGINATOR_INTL_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: MatPaginatorIntl,
    deps: [[new Optional(), new SkipSelf(), MatPaginatorIntl]],
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The default page size if there is no page size and there are no provided page size options.
 */
var DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
var PageEvent = /** @class */ (function () {
    function PageEvent() {
    }
    return PageEvent;
}());
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
var MatPaginator = /** @class */ (function () {
    function MatPaginator(_intl, _changeDetectorRef) {
        var _this = this;
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._intlChanges = _intl.changes.subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MatPaginator.prototype, "pageIndex", {
        get: /**
         * The zero-based page index of the displayed list of items. Defaulted to 0.
         * @return {?}
         */
        function () { return this._pageIndex; },
        set: /**
         * @param {?} pageIndex
         * @return {?}
         */
        function (pageIndex) {
            this._pageIndex = pageIndex;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "length", {
        get: /**
         * The length of the total number of items that are being paginated. Defaulted to 0.
         * @return {?}
         */
        function () { return this._length; },
        set: /**
         * @param {?} length
         * @return {?}
         */
        function (length) {
            this._length = length;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "pageSize", {
        get: /**
         * Number of items to display on a page. By default set to 50.
         * @return {?}
         */
        function () { return this._pageSize; },
        set: /**
         * @param {?} pageSize
         * @return {?}
         */
        function (pageSize) {
            this._pageSize = pageSize;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "pageSizeOptions", {
        get: /**
         * The set of provided page size options to display to the user.
         * @return {?}
         */
        function () { return this._pageSizeOptions; },
        set: /**
         * @param {?} pageSizeOptions
         * @return {?}
         */
        function (pageSizeOptions) {
            this._pageSizeOptions = pageSizeOptions;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatPaginator.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
    };
    /**
     * @return {?}
     */
    MatPaginator.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._intlChanges.unsubscribe();
    };
    /** Advances to the next page if it exists. */
    /**
     * Advances to the next page if it exists.
     * @return {?}
     */
    MatPaginator.prototype.nextPage = /**
     * Advances to the next page if it exists.
     * @return {?}
     */
    function () {
        if (!this.hasNextPage()) {
            return;
        }
        this.pageIndex++;
        this._emitPageEvent();
    };
    /** Move back to the previous page if it exists. */
    /**
     * Move back to the previous page if it exists.
     * @return {?}
     */
    MatPaginator.prototype.previousPage = /**
     * Move back to the previous page if it exists.
     * @return {?}
     */
    function () {
        if (!this.hasPreviousPage()) {
            return;
        }
        this.pageIndex--;
        this._emitPageEvent();
    };
    /** Whether there is a previous page. */
    /**
     * Whether there is a previous page.
     * @return {?}
     */
    MatPaginator.prototype.hasPreviousPage = /**
     * Whether there is a previous page.
     * @return {?}
     */
    function () {
        return this.pageIndex >= 1 && this.pageSize != 0;
    };
    /** Whether there is a next page. */
    /**
     * Whether there is a next page.
     * @return {?}
     */
    MatPaginator.prototype.hasNextPage = /**
     * Whether there is a next page.
     * @return {?}
     */
    function () {
        var /** @type {?} */ numberOfPages = Math.ceil(this.length / this.pageSize) - 1;
        return this.pageIndex < numberOfPages && this.pageSize != 0;
    };
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
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
    MatPaginator.prototype._changePageSize = /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     * @param {?} pageSize
     * @return {?}
     */
    function (pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        var /** @type {?} */ startIndex = this.pageIndex * this.pageSize;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent();
    };
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     * @return {?}
     */
    MatPaginator.prototype._updateDisplayedPageSizeOptions = /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     * @return {?}
     */
    function () {
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
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) == -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort(function (a, b) { return a - b; });
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Emits an event notifying that a change of the paginator's properties has been triggered.
     * @return {?}
     */
    MatPaginator.prototype._emitPageEvent = /**
     * Emits an event notifying that a change of the paginator's properties has been triggered.
     * @return {?}
     */
    function () {
        this.page.next({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    };
    return MatPaginator;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatPaginatorModule = /** @class */ (function () {
    function MatPaginatorModule() {
    }
    return MatPaginatorModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatPaginatorModule, PageEvent, MatPaginator, MatPaginatorIntl, MAT_PAGINATOR_INTL_PROVIDER_FACTORY, MAT_PAGINATOR_INTL_PROVIDER };
//# sourceMappingURL=paginator.es5.js.map
