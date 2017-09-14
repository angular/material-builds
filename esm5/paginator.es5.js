/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { MdButtonModule } from '@angular/material/button';
import { MdSelectModule } from '@angular/material/select';
import { MdTooltipModule } from '@angular/material/tooltip';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
/**
 * To modify the labels and text displayed, create a new instance of MdPaginatorIntl and
 * include it in a custom provider
 */
var MdPaginatorIntl = (function () {
    function MdPaginatorIntl() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * A label for the page size selector.
         */
        this.itemsPerPageLabel = 'Items per page:';
        /**
         * A label for the button that increments the current page.
         */
        this.nextPageLabel = 'Next page';
        /**
         * A label for the button that decrements the current page.
         */
        this.previousPageLabel = 'Previous page';
        /**
         * A label for the range of items within the current page and the length of the whole list.
         */
        this.getRangeLabel = function (page, pageSize, length) {
            if (length == 0 || pageSize == 0) {
                return "0 of " + length;
            }
            length = Math.max(length, 0);
            var startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            var endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return startIndex + 1 + " - " + endIndex + " of " + length;
        };
    }
    return MdPaginatorIntl;
}());
MdPaginatorIntl.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdPaginatorIntl.ctorParameters = function () { return []; };
/**
 * The default page size if there is no page size and there are no provided page size options.
 */
var DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
var PageEvent = (function () {
    function PageEvent() {
    }
    return PageEvent;
}());
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
var MdPaginator = (function () {
    /**
     * @param {?} _intl
     * @param {?} _changeDetectorRef
     */
    function MdPaginator(_intl, _changeDetectorRef) {
        var _this = this;
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._pageIndex = 0;
        this._length = 0;
        this._pageSizeOptions = [];
        /**
         * Event emitted when the paginator changes the page size or page index.
         */
        this.page = new EventEmitter();
        this._intlChanges = _intl.changes.subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MdPaginator.prototype, "pageIndex", {
        /**
         * The zero-based page index of the displayed list of items. Defaulted to 0.
         * @return {?}
         */
        get: function () { return this._pageIndex; },
        /**
         * @param {?} pageIndex
         * @return {?}
         */
        set: function (pageIndex) {
            this._pageIndex = pageIndex;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "length", {
        /**
         * The length of the total number of items that are being paginated. Defaulted to 0.
         * @return {?}
         */
        get: function () { return this._length; },
        /**
         * @param {?} length
         * @return {?}
         */
        set: function (length) {
            this._length = length;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "pageSize", {
        /**
         * Number of items to display on a page. By default set to 50.
         * @return {?}
         */
        get: function () { return this._pageSize; },
        /**
         * @param {?} pageSize
         * @return {?}
         */
        set: function (pageSize) {
            this._pageSize = pageSize;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "pageSizeOptions", {
        /**
         * The set of provided page size options to display to the user.
         * @return {?}
         */
        get: function () { return this._pageSizeOptions; },
        /**
         * @param {?} pageSizeOptions
         * @return {?}
         */
        set: function (pageSizeOptions) {
            this._pageSizeOptions = pageSizeOptions;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdPaginator.prototype.ngOnInit = function () {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
    };
    /**
     * @return {?}
     */
    MdPaginator.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
    };
    /**
     * Advances to the next page if it exists.
     * @return {?}
     */
    MdPaginator.prototype.nextPage = function () {
        if (!this.hasNextPage()) {
            return;
        }
        this.pageIndex++;
        this._emitPageEvent();
    };
    /**
     * Move back to the previous page if it exists.
     * @return {?}
     */
    MdPaginator.prototype.previousPage = function () {
        if (!this.hasPreviousPage()) {
            return;
        }
        this.pageIndex--;
        this._emitPageEvent();
    };
    /**
     * Whether there is a previous page.
     * @return {?}
     */
    MdPaginator.prototype.hasPreviousPage = function () {
        return this.pageIndex >= 1 && this.pageSize != 0;
    };
    /**
     * Whether there is a next page.
     * @return {?}
     */
    MdPaginator.prototype.hasNextPage = function () {
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
     * @param {?} pageSize
     * @return {?}
     */
    MdPaginator.prototype._changePageSize = function (pageSize) {
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
    MdPaginator.prototype._updateDisplayedPageSizeOptions = function () {
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
    MdPaginator.prototype._emitPageEvent = function () {
        this.page.next({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    };
    return MdPaginator;
}());
MdPaginator.decorators = [
    { type: Component, args: [{ selector: 'md-paginator, mat-paginator',
                template: "<div class=\"mat-paginator-page-size\"><div class=\"mat-paginator-page-size-label\">{{_intl.itemsPerPageLabel}}</div><md-select *ngIf=\"_displayedPageSizeOptions.length > 1\" class=\"mat-paginator-page-size-select\" [value]=\"pageSize\" [aria-label]=\"_intl.itemsPerPageLabel\" (change)=\"_changePageSize($event.value)\"><md-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">{{pageSizeOption}}</md-option></md-select><div *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div></div><div class=\"mat-paginator-range-label\">{{_intl.getRangeLabel(pageIndex, pageSize, length)}}</div><button md-icon-button type=\"button\" class=\"mat-paginator-navigation-previous\" (click)=\"previousPage()\" [attr.aria-label]=\"_intl.previousPageLabel\" [mdTooltip]=\"_intl.previousPageLabel\" [mdTooltipPosition]=\"'above'\" [disabled]=\"!hasPreviousPage()\"><div class=\"mat-paginator-increment\"></div></button> <button md-icon-button type=\"button\" class=\"mat-paginator-navigation-next\" (click)=\"nextPage()\" [attr.aria-label]=\"_intl.nextPageLabel\" [mdTooltip]=\"_intl.nextPageLabel\" [mdTooltipPosition]=\"'above'\" [disabled]=\"!hasNextPage()\"><div class=\"mat-paginator-decrement\"></div></button>",
                styles: [".mat-paginator{display:flex;align-items:center;justify-content:flex-end;min-height:56px;padding:0 8px}.mat-paginator-page-size{display:flex;align-items:center}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{padding-top:0;margin:0 4px}.mat-paginator-page-size-select .mat-select-trigger{min-width:56px}.mat-paginator-range-label{margin:0 32px}.mat-paginator-increment-button+.mat-paginator-increment-button{margin:0 0 0 8px}[dir=rtl] .mat-paginator-increment-button+.mat-paginator-increment-button{margin:0 8px 0 0}.mat-paginator-decrement,.mat-paginator-increment{width:8px;height:8px}.mat-paginator-decrement,[dir=rtl] .mat-paginator-increment{transform:rotate(45deg)}.mat-paginator-increment,[dir=rtl] .mat-paginator-decrement{transform:rotate(225deg)}.mat-paginator-decrement{margin-left:12px}[dir=rtl] .mat-paginator-decrement{margin-right:12px}.mat-paginator-increment{margin-left:16px}[dir=rtl] .mat-paginator-increment{margin-right:16px}"],
                host: {
                    'class': 'mat-paginator',
                },
                providers: [
                    { provide: MATERIAL_COMPATIBILITY_MODE, useValue: false }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdPaginator.ctorParameters = function () { return [
    { type: MdPaginatorIntl, },
    { type: ChangeDetectorRef, },
]; };
MdPaginator.propDecorators = {
    'pageIndex': [{ type: Input },],
    'length': [{ type: Input },],
    'pageSize': [{ type: Input },],
    'pageSizeOptions': [{ type: Input },],
    'page': [{ type: Output },],
};
var MdPaginatorModule = (function () {
    function MdPaginatorModule() {
    }
    return MdPaginatorModule;
}());
MdPaginatorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MdButtonModule,
                    MdSelectModule,
                    MdTooltipModule,
                ],
                exports: [MdPaginator],
                declarations: [MdPaginator],
                providers: [MdPaginatorIntl],
            },] },
];
/**
 * @nocollapse
 */
MdPaginatorModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdPaginatorModule, PageEvent, MdPaginator, MdPaginatorIntl };
//# sourceMappingURL=paginator.es5.js.map
