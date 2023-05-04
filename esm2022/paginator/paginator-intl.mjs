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
class MatPaginatorIntl {
    constructor() {
        /**
         * Stream to emit from when labels are changed. Use this to notify components when the labels have
         * changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the page size selector. */
        this.itemsPerPageLabel = 'Items per page:';
        /** A label for the button that increments the current page. */
        this.nextPageLabel = 'Next page';
        /** A label for the button that decrements the current page. */
        this.previousPageLabel = 'Previous page';
        /** A label for the button that moves to the first page. */
        this.firstPageLabel = 'First page';
        /** A label for the button that moves to the last page. */
        this.lastPageLabel = 'Last page';
        /** A label for the range of items within the current page and the length of the whole list. */
        this.getRangeLabel = (page, pageSize, length) => {
            if (length == 0 || pageSize == 0) {
                return `0 of ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} – ${endIndex} of ${length}`;
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPaginatorIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPaginatorIntl, providedIn: 'root' }); }
}
export { MatPaginatorIntl };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPaginatorIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** @docs-private */
export function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatPaginatorIntl();
}
/** @docs-private */
export const MAT_PAGINATOR_INTL_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: MatPaginatorIntl,
    deps: [[new Optional(), new SkipSelf(), MatPaginatorIntl]],
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWludGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qjs7O0dBR0c7QUFDSCxNQUNhLGdCQUFnQjtJQUQ3QjtRQUVFOzs7V0FHRztRQUNNLFlBQU8sR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUV0RCwwQ0FBMEM7UUFDMUMsc0JBQWlCLEdBQVcsaUJBQWlCLENBQUM7UUFFOUMsK0RBQStEO1FBQy9ELGtCQUFhLEdBQVcsV0FBVyxDQUFDO1FBRXBDLCtEQUErRDtRQUMvRCxzQkFBaUIsR0FBVyxlQUFlLENBQUM7UUFFNUMsMkRBQTJEO1FBQzNELG1CQUFjLEdBQVcsWUFBWSxDQUFDO1FBRXRDLDBEQUEwRDtRQUMxRCxrQkFBYSxHQUFXLFdBQVcsQ0FBQztRQUVwQywrRkFBK0Y7UUFDL0Ysa0JBQWEsR0FBK0QsQ0FDMUUsSUFBWSxFQUNaLFFBQWdCLEVBQ2hCLE1BQWMsRUFDZCxFQUFFO1lBQ0YsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sUUFBUSxNQUFNLEVBQUUsQ0FBQzthQUN6QjtZQUVELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU3QixNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBRW5DLDJGQUEyRjtZQUMzRixNQUFNLFFBQVEsR0FDWixVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7WUFFeEYsT0FBTyxHQUFHLFVBQVUsR0FBRyxDQUFDLE1BQU0sUUFBUSxPQUFPLE1BQU0sRUFBRSxDQUFDO1FBQ3hELENBQUMsQ0FBQztLQUNIOzhHQTFDWSxnQkFBZ0I7a0hBQWhCLGdCQUFnQixjQURKLE1BQU07O1NBQ2xCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUE2Q2hDLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsbUNBQW1DLENBQUMsVUFBNEI7SUFDOUUsT0FBTyxVQUFVLElBQUksSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQzlDLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUc7SUFDekMsNkZBQTZGO0lBQzdGLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMxRCxVQUFVLEVBQUUsbUNBQW1DO0NBQ2hELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBUbyBtb2RpZnkgdGhlIGxhYmVscyBhbmQgdGV4dCBkaXNwbGF5ZWQsIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBNYXRQYWdpbmF0b3JJbnRsIGFuZFxuICogaW5jbHVkZSBpdCBpbiBhIGN1c3RvbSBwcm92aWRlclxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRQYWdpbmF0b3JJbnRsIHtcbiAgLyoqXG4gICAqIFN0cmVhbSB0byBlbWl0IGZyb20gd2hlbiBsYWJlbHMgYXJlIGNoYW5nZWQuIFVzZSB0aGlzIHRvIG5vdGlmeSBjb21wb25lbnRzIHdoZW4gdGhlIGxhYmVscyBoYXZlXG4gICAqIGNoYW5nZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rvci4gKi9cbiAgaXRlbXNQZXJQYWdlTGFiZWw6IHN0cmluZyA9ICdJdGVtcyBwZXIgcGFnZTonO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgYnV0dG9uIHRoYXQgaW5jcmVtZW50cyB0aGUgY3VycmVudCBwYWdlLiAqL1xuICBuZXh0UGFnZUxhYmVsOiBzdHJpbmcgPSAnTmV4dCBwYWdlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IGRlY3JlbWVudHMgdGhlIGN1cnJlbnQgcGFnZS4gKi9cbiAgcHJldmlvdXNQYWdlTGFiZWw6IHN0cmluZyA9ICdQcmV2aW91cyBwYWdlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBmaXJzdCBwYWdlLiAqL1xuICBmaXJzdFBhZ2VMYWJlbDogc3RyaW5nID0gJ0ZpcnN0IHBhZ2UnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgYnV0dG9uIHRoYXQgbW92ZXMgdG8gdGhlIGxhc3QgcGFnZS4gKi9cbiAgbGFzdFBhZ2VMYWJlbDogc3RyaW5nID0gJ0xhc3QgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSByYW5nZSBvZiBpdGVtcyB3aXRoaW4gdGhlIGN1cnJlbnQgcGFnZSBhbmQgdGhlIGxlbmd0aCBvZiB0aGUgd2hvbGUgbGlzdC4gKi9cbiAgZ2V0UmFuZ2VMYWJlbDogKHBhZ2U6IG51bWJlciwgcGFnZVNpemU6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpID0+IHN0cmluZyA9IChcbiAgICBwYWdlOiBudW1iZXIsXG4gICAgcGFnZVNpemU6IG51bWJlcixcbiAgICBsZW5ndGg6IG51bWJlcixcbiAgKSA9PiB7XG4gICAgaWYgKGxlbmd0aCA9PSAwIHx8IHBhZ2VTaXplID09IDApIHtcbiAgICAgIHJldHVybiBgMCBvZiAke2xlbmd0aH1gO1xuICAgIH1cblxuICAgIGxlbmd0aCA9IE1hdGgubWF4KGxlbmd0aCwgMCk7XG5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gcGFnZSAqIHBhZ2VTaXplO1xuXG4gICAgLy8gSWYgdGhlIHN0YXJ0IGluZGV4IGV4Y2VlZHMgdGhlIGxpc3QgbGVuZ3RoLCBkbyBub3QgdHJ5IGFuZCBmaXggdGhlIGVuZCBpbmRleCB0byB0aGUgZW5kLlxuICAgIGNvbnN0IGVuZEluZGV4ID1cbiAgICAgIHN0YXJ0SW5kZXggPCBsZW5ndGggPyBNYXRoLm1pbihzdGFydEluZGV4ICsgcGFnZVNpemUsIGxlbmd0aCkgOiBzdGFydEluZGV4ICsgcGFnZVNpemU7XG5cbiAgICByZXR1cm4gYCR7c3RhcnRJbmRleCArIDF9IOKAkyAke2VuZEluZGV4fSBvZiAke2xlbmd0aH1gO1xuICB9O1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9QQUdJTkFUT1JfSU5UTF9QUk9WSURFUl9GQUNUT1JZKHBhcmVudEludGw6IE1hdFBhZ2luYXRvckludGwpIHtcbiAgcmV0dXJuIHBhcmVudEludGwgfHwgbmV3IE1hdFBhZ2luYXRvckludGwoKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfUEFHSU5BVE9SX0lOVExfUFJPVklERVIgPSB7XG4gIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYW4gTWF0UGFnaW5hdG9ySW50bCBhdmFpbGFibGUsIHVzZSB0aGF0LiBPdGhlcndpc2UsIHByb3ZpZGUgYSBuZXcgb25lLlxuICBwcm92aWRlOiBNYXRQYWdpbmF0b3JJbnRsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0UGFnaW5hdG9ySW50bF1dLFxuICB1c2VGYWN0b3J5OiBNQVRfUEFHSU5BVE9SX0lOVExfUFJPVklERVJfRkFDVE9SWSxcbn07XG4iXX0=