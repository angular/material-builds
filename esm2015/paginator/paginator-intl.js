/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * To modify the labels and text displayed, create a new instance of MatPaginatorIntl and
 * include it in a custom provider
 */
export class MatPaginatorIntl {
    constructor() {
        /**
         * Stream to emit from when labels are changed. Use this to notify components when the labels have
         * changed after initialization.
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
         * A label for the button that moves to the first page.
         */
        this.firstPageLabel = 'First page';
        /**
         * A label for the button that moves to the last page.
         */
        this.lastPageLabel = 'Last page';
        /**
         * A label for the range of items within the current page and the length of the whole list.
         */
        this.getRangeLabel = (/**
         * @param {?} page
         * @param {?} pageSize
         * @param {?} length
         * @return {?}
         */
        (page, pageSize, length) => {
            if (length == 0 || pageSize == 0) {
                return `0 of ${length}`;
            }
            length = Math.max(length, 0);
            /** @type {?} */
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            /** @type {?} */
            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return `${startIndex + 1} – ${endIndex} of ${length}`;
        });
    }
}
MatPaginatorIntl.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ MatPaginatorIntl.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function MatPaginatorIntl_Factory() { return new MatPaginatorIntl(); }, token: MatPaginatorIntl, providedIn: "root" });
if (false) {
    /**
     * Stream to emit from when labels are changed. Use this to notify components when the labels have
     * changed after initialization.
     * @type {?}
     */
    MatPaginatorIntl.prototype.changes;
    /**
     * A label for the page size selector.
     * @type {?}
     */
    MatPaginatorIntl.prototype.itemsPerPageLabel;
    /**
     * A label for the button that increments the current page.
     * @type {?}
     */
    MatPaginatorIntl.prototype.nextPageLabel;
    /**
     * A label for the button that decrements the current page.
     * @type {?}
     */
    MatPaginatorIntl.prototype.previousPageLabel;
    /**
     * A label for the button that moves to the first page.
     * @type {?}
     */
    MatPaginatorIntl.prototype.firstPageLabel;
    /**
     * A label for the button that moves to the last page.
     * @type {?}
     */
    MatPaginatorIntl.prototype.lastPageLabel;
    /**
     * A label for the range of items within the current page and the length of the whole list.
     * @type {?}
     */
    MatPaginatorIntl.prototype.getRangeLabel;
}
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
export function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatPaginatorIntl();
}
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_PAGINATOR_INTL_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: MatPaginatorIntl,
    deps: [[new Optional(), new SkipSelf(), MatPaginatorIntl]],
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWludGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7OztBQVE3QixNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCOzs7OztRQU1XLFlBQU8sR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7OztRQUd0RCxzQkFBaUIsR0FBVyxpQkFBaUIsQ0FBQzs7OztRQUc5QyxrQkFBYSxHQUFXLFdBQVcsQ0FBQzs7OztRQUdwQyxzQkFBaUIsR0FBVyxlQUFlLENBQUM7Ozs7UUFHNUMsbUJBQWMsR0FBVyxZQUFZLENBQUM7Ozs7UUFHdEMsa0JBQWEsR0FBVyxXQUFXLENBQUM7Ozs7UUFHcEMsa0JBQWE7Ozs7OztRQUFHLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsTUFBYyxFQUFFLEVBQUU7WUFDakUsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsT0FBTyxRQUFRLE1BQU0sRUFBRSxDQUFDO2FBQUU7WUFFOUQsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDOztrQkFFdkIsVUFBVSxHQUFHLElBQUksR0FBRyxRQUFROzs7a0JBRzVCLFFBQVEsR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxVQUFVLEdBQUcsUUFBUTtZQUV6QixPQUFPLEdBQUcsVUFBVSxHQUFHLENBQUMsTUFBTSxRQUFRLE9BQU8sTUFBTSxFQUFFLENBQUM7UUFDeEQsQ0FBQyxFQUFBO0tBQ0Y7OztZQXRDQSxVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7Ozs7Ozs7SUFNOUIsbUNBQXNEOzs7OztJQUd0RCw2Q0FBOEM7Ozs7O0lBRzlDLHlDQUFvQzs7Ozs7SUFHcEMsNkNBQTRDOzs7OztJQUc1QywwQ0FBc0M7Ozs7O0lBR3RDLHlDQUFvQzs7Ozs7SUFHcEMseUNBYUM7Ozs7Ozs7QUFJSCxNQUFNLFVBQVUsbUNBQW1DLENBQUMsVUFBNEI7SUFDOUUsT0FBTyxVQUFVLElBQUksSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQzlDLENBQUM7Ozs7O0FBR0QsTUFBTSxPQUFPLDJCQUEyQixHQUFHOztJQUV6QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDMUQsVUFBVSxFQUFFLG1DQUFtQztDQUNoRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIE9wdGlvbmFsLCBTa2lwU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5cbi8qKlxuICogVG8gbW9kaWZ5IHRoZSBsYWJlbHMgYW5kIHRleHQgZGlzcGxheWVkLCBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgTWF0UGFnaW5hdG9ySW50bCBhbmRcbiAqIGluY2x1ZGUgaXQgaW4gYSBjdXN0b20gcHJvdmlkZXJcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0UGFnaW5hdG9ySW50bCB7XG4gIC8qKlxuICAgKiBTdHJlYW0gdG8gZW1pdCBmcm9tIHdoZW4gbGFiZWxzIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnkgY29tcG9uZW50cyB3aGVuIHRoZSBsYWJlbHMgaGF2ZVxuICAgKiBjaGFuZ2VkIGFmdGVyIGluaXRpYWxpemF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwYWdlIHNpemUgc2VsZWN0b3IuICovXG4gIGl0ZW1zUGVyUGFnZUxhYmVsOiBzdHJpbmcgPSAnSXRlbXMgcGVyIHBhZ2U6JztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IGluY3JlbWVudHMgdGhlIGN1cnJlbnQgcGFnZS4gKi9cbiAgbmV4dFBhZ2VMYWJlbDogc3RyaW5nID0gJ05leHQgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdGhhdCBkZWNyZW1lbnRzIHRoZSBjdXJyZW50IHBhZ2UuICovXG4gIHByZXZpb3VzUGFnZUxhYmVsOiBzdHJpbmcgPSAnUHJldmlvdXMgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgZmlyc3QgcGFnZS4gKi9cbiAgZmlyc3RQYWdlTGFiZWw6IHN0cmluZyA9ICdGaXJzdCBwYWdlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBsYXN0IHBhZ2UuICovXG4gIGxhc3RQYWdlTGFiZWw6IHN0cmluZyA9ICdMYXN0IHBhZ2UnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcmFuZ2Ugb2YgaXRlbXMgd2l0aGluIHRoZSBjdXJyZW50IHBhZ2UgYW5kIHRoZSBsZW5ndGggb2YgdGhlIHdob2xlIGxpc3QuICovXG4gIGdldFJhbmdlTGFiZWwgPSAocGFnZTogbnVtYmVyLCBwYWdlU2l6ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcikgPT4ge1xuICAgIGlmIChsZW5ndGggPT0gMCB8fCBwYWdlU2l6ZSA9PSAwKSB7IHJldHVybiBgMCBvZiAke2xlbmd0aH1gOyB9XG5cbiAgICBsZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIDApO1xuXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHBhZ2UgKiBwYWdlU2l6ZTtcblxuICAgIC8vIElmIHRoZSBzdGFydCBpbmRleCBleGNlZWRzIHRoZSBsaXN0IGxlbmd0aCwgZG8gbm90IHRyeSBhbmQgZml4IHRoZSBlbmQgaW5kZXggdG8gdGhlIGVuZC5cbiAgICBjb25zdCBlbmRJbmRleCA9IHN0YXJ0SW5kZXggPCBsZW5ndGggP1xuICAgICAgICBNYXRoLm1pbihzdGFydEluZGV4ICsgcGFnZVNpemUsIGxlbmd0aCkgOlxuICAgICAgICBzdGFydEluZGV4ICsgcGFnZVNpemU7XG5cbiAgICByZXR1cm4gYCR7c3RhcnRJbmRleCArIDF9IOKAkyAke2VuZEluZGV4fSBvZiAke2xlbmd0aH1gO1xuICB9XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1BBR0lOQVRPUl9JTlRMX1BST1ZJREVSX0ZBQ1RPUlkocGFyZW50SW50bDogTWF0UGFnaW5hdG9ySW50bCkge1xuICByZXR1cm4gcGFyZW50SW50bCB8fCBuZXcgTWF0UGFnaW5hdG9ySW50bCgpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUiA9IHtcbiAgLy8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhbiBNYXRQYWdpbmF0b3JJbnRsIGF2YWlsYWJsZSwgdXNlIHRoYXQuIE90aGVyd2lzZSwgcHJvdmlkZSBhIG5ldyBvbmUuXG4gIHByb3ZpZGU6IE1hdFBhZ2luYXRvckludGwsXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXRQYWdpbmF0b3JJbnRsXV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUl9GQUNUT1JZXG59O1xuIl19