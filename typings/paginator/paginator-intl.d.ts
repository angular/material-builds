/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
/**
 * To modify the labels and text displayed, create a new instance of MdPaginatorIntl and
 * include it in a custom provider
 */
export declare class MdPaginatorIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    changes: EventEmitter<void>;
    /** A label for the page size selector. */
    itemsPerPageLabel: string;
    /** A label for the button that increments the current page. */
    nextPageLabel: string;
    /** A label for the button that decrements the current page. */
    previousPageLabel: string;
    /** A label for the range of items within the current page and the length of the whole list. */
    getRangeLabel: (page: number, pageSize: number, length: number) => string;
}
