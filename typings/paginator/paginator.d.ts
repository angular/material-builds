/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, OnInit } from '@angular/core';
import { MdPaginatorIntl } from './paginator-intl';
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export declare class PageEvent {
    pageIndex: number;
    pageSize: number;
    length: number;
}
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export declare class MdPaginator implements OnInit {
    _intl: MdPaginatorIntl;
    private _initialized;
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    pageIndex: number;
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    length: number;
    /** Number of items to display on a page. By default set to 50. */
    pageSize: number;
    private _pageSize;
    /** The set of provided page size options to display to the user. */
    pageSizeOptions: number[];
    private _pageSizeOptions;
    /** Event emitted when the paginator changes the page size or page index. */
    page: EventEmitter<PageEvent>;
    /** Displayed set of page size options. Will be sorted and include current page size. */
    _displayedPageSizeOptions: number[];
    constructor(_intl: MdPaginatorIntl);
    ngOnInit(): void;
    /** Increments the page index to the next page index if a next page exists. */
    nextPage(): void;
    /** Decrements the page index to the previous page index if a next page exists. */
    previousPage(): void;
    /** Returns true if the user can go to the next page. */
    hasPreviousPage(): boolean;
    /** Returns true if the user can go to the next page. */
    hasNextPage(): boolean;
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize: number): void;
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    private _updateDisplayedPageSizeOptions();
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    private _emitPageEvent();
}
