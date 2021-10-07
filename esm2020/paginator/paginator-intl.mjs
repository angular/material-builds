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
            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return `${startIndex + 1} – ${endIndex} of ${length}`;
        };
    }
}
MatPaginatorIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPaginatorIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MatPaginatorIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPaginatorIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPaginatorIntl, decorators: [{
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
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWludGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUc3Qjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBRUU7OztXQUdHO1FBQ00sWUFBTyxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXRELDBDQUEwQztRQUMxQyxzQkFBaUIsR0FBVyxpQkFBaUIsQ0FBQztRQUU5QywrREFBK0Q7UUFDL0Qsa0JBQWEsR0FBVyxXQUFXLENBQUM7UUFFcEMsK0RBQStEO1FBQy9ELHNCQUFpQixHQUFXLGVBQWUsQ0FBQztRQUU1QywyREFBMkQ7UUFDM0QsbUJBQWMsR0FBVyxZQUFZLENBQUM7UUFFdEMsMERBQTBEO1FBQzFELGtCQUFhLEdBQVcsV0FBVyxDQUFDO1FBRXBDLCtGQUErRjtRQUMvRixrQkFBYSxHQUNYLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsTUFBYyxFQUFFLEVBQUU7WUFDakQsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsT0FBTyxRQUFRLE1BQU0sRUFBRSxDQUFDO2FBQUU7WUFFOUQsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7WUFFbkMsMkZBQTJGO1lBQzNGLE1BQU0sUUFBUSxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLFVBQVUsR0FBRyxRQUFRLENBQUM7WUFFMUIsT0FBTyxHQUFHLFVBQVUsR0FBRyxDQUFDLE1BQU0sUUFBUSxPQUFPLE1BQU0sRUFBRSxDQUFDO1FBQ3hELENBQUMsQ0FBQTtLQUNKOztxSEF0Q1ksZ0JBQWdCO3lIQUFoQixnQkFBZ0IsY0FESixNQUFNO21HQUNsQixnQkFBZ0I7a0JBRDVCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQXlDaEMsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxtQ0FBbUMsQ0FBQyxVQUE0QjtJQUM5RSxPQUFPLFVBQVUsSUFBSSxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDOUMsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRztJQUN6Qyw2RkFBNkY7SUFDN0YsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFELFVBQVUsRUFBRSxtQ0FBbUM7Q0FDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIE9wdGlvbmFsLCBTa2lwU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5cbi8qKlxuICogVG8gbW9kaWZ5IHRoZSBsYWJlbHMgYW5kIHRleHQgZGlzcGxheWVkLCBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgTWF0UGFnaW5hdG9ySW50bCBhbmRcbiAqIGluY2x1ZGUgaXQgaW4gYSBjdXN0b20gcHJvdmlkZXJcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0UGFnaW5hdG9ySW50bCB7XG4gIC8qKlxuICAgKiBTdHJlYW0gdG8gZW1pdCBmcm9tIHdoZW4gbGFiZWxzIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnkgY29tcG9uZW50cyB3aGVuIHRoZSBsYWJlbHMgaGF2ZVxuICAgKiBjaGFuZ2VkIGFmdGVyIGluaXRpYWxpemF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwYWdlIHNpemUgc2VsZWN0b3IuICovXG4gIGl0ZW1zUGVyUGFnZUxhYmVsOiBzdHJpbmcgPSAnSXRlbXMgcGVyIHBhZ2U6JztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IGluY3JlbWVudHMgdGhlIGN1cnJlbnQgcGFnZS4gKi9cbiAgbmV4dFBhZ2VMYWJlbDogc3RyaW5nID0gJ05leHQgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdGhhdCBkZWNyZW1lbnRzIHRoZSBjdXJyZW50IHBhZ2UuICovXG4gIHByZXZpb3VzUGFnZUxhYmVsOiBzdHJpbmcgPSAnUHJldmlvdXMgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgZmlyc3QgcGFnZS4gKi9cbiAgZmlyc3RQYWdlTGFiZWw6IHN0cmluZyA9ICdGaXJzdCBwYWdlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBsYXN0IHBhZ2UuICovXG4gIGxhc3RQYWdlTGFiZWw6IHN0cmluZyA9ICdMYXN0IHBhZ2UnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcmFuZ2Ugb2YgaXRlbXMgd2l0aGluIHRoZSBjdXJyZW50IHBhZ2UgYW5kIHRoZSBsZW5ndGggb2YgdGhlIHdob2xlIGxpc3QuICovXG4gIGdldFJhbmdlTGFiZWw6IChwYWdlOiBudW1iZXIsIHBhZ2VTaXplOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSA9PiBzdHJpbmcgPVxuICAgIChwYWdlOiBudW1iZXIsIHBhZ2VTaXplOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAobGVuZ3RoID09IDAgfHwgcGFnZVNpemUgPT0gMCkgeyByZXR1cm4gYDAgb2YgJHtsZW5ndGh9YDsgfVxuXG4gICAgICBsZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIDApO1xuXG4gICAgICBjb25zdCBzdGFydEluZGV4ID0gcGFnZSAqIHBhZ2VTaXplO1xuXG4gICAgICAvLyBJZiB0aGUgc3RhcnQgaW5kZXggZXhjZWVkcyB0aGUgbGlzdCBsZW5ndGgsIGRvIG5vdCB0cnkgYW5kIGZpeCB0aGUgZW5kIGluZGV4IHRvIHRoZSBlbmQuXG4gICAgICBjb25zdCBlbmRJbmRleCA9IHN0YXJ0SW5kZXggPCBsZW5ndGggP1xuICAgICAgICAgIE1hdGgubWluKHN0YXJ0SW5kZXggKyBwYWdlU2l6ZSwgbGVuZ3RoKSA6XG4gICAgICAgICAgc3RhcnRJbmRleCArIHBhZ2VTaXplO1xuXG4gICAgICByZXR1cm4gYCR7c3RhcnRJbmRleCArIDF9IOKAkyAke2VuZEluZGV4fSBvZiAke2xlbmd0aH1gO1xuICAgIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUEFHSU5BVE9SX0lOVExfUFJPVklERVJfRkFDVE9SWShwYXJlbnRJbnRsOiBNYXRQYWdpbmF0b3JJbnRsKSB7XG4gIHJldHVybiBwYXJlbnRJbnRsIHx8IG5ldyBNYXRQYWdpbmF0b3JJbnRsKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1BBR0lOQVRPUl9JTlRMX1BST1ZJREVSID0ge1xuICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIE1hdFBhZ2luYXRvckludGwgYXZhaWxhYmxlLCB1c2UgdGhhdC4gT3RoZXJ3aXNlLCBwcm92aWRlIGEgbmV3IG9uZS5cbiAgcHJvdmlkZTogTWF0UGFnaW5hdG9ySW50bCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdFBhZ2luYXRvckludGxdXSxcbiAgdXNlRmFjdG9yeTogTUFUX1BBR0lOQVRPUl9JTlRMX1BST1ZJREVSX0ZBQ1RPUllcbn07XG4iXX0=