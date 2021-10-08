/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatSidenavContentHarness } from './sidenav-content-harness';
import { MatSidenavHarness } from './sidenav-harness';
/** Harness for interacting with a standard mat-sidenav-container in tests. */
export class MatSidenavContainerHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavContainerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which container instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSidenavContainerHarness, options);
    }
    /**
     * Gets sidenavs that match particular criteria within the container.
     * @param filter Optionally filters which chips are included.
     */
    async getSidenavs(filter = {}) {
        return this.locatorForAll(MatSidenavHarness.with(filter))();
    }
    /** Gets the element that has the container's content. */
    async getContent() {
        return this.locatorFor(MatSidenavContentHarness)();
    }
}
/** The selector for the host element of a `MatSidenavContainer` instance. */
MatSidenavContainerHarness.hostSelector = '.mat-sidenav-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1jb250YWluZXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zaWRlbmF2L3Rlc3Rpbmcvc2lkZW5hdi1jb250YWluZXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0NBQWdDLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCw4RUFBOEU7QUFDOUUsTUFBTSxPQUFPLDBCQUEyQixTQUFRLGdDQUF3QztJQUl0Rjs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUVyRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBK0IsRUFBRTtRQUNqRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRUQseURBQXlEO0lBQ3pELEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQztJQUNyRCxDQUFDOztBQXpCRCw2RUFBNkU7QUFDdEUsdUNBQVksR0FBRyx3QkFBd0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0RyYXdlckNvbnRhaW5lckhhcm5lc3NGaWx0ZXJzLCBEcmF3ZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kcmF3ZXItaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0U2lkZW5hdkNvbnRlbnRIYXJuZXNzfSBmcm9tICcuL3NpZGVuYXYtY29udGVudC1oYXJuZXNzJztcbmltcG9ydCB7TWF0U2lkZW5hdkhhcm5lc3N9IGZyb20gJy4vc2lkZW5hdi1oYXJuZXNzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2lkZW5hdi1jb250YWluZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U2lkZW5hdkNvbnRhaW5lckhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTaWRlbmF2Q29udGFpbmVyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNpZGVuYXYtY29udGFpbmVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U2lkZW5hdkNvbnRhaW5lckhhcm5lc3NgIHRoYXRcbiAgICogbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNvbnRhaW5lciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJDb250YWluZXJIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFNpZGVuYXZDb250YWluZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNpZGVuYXZDb250YWluZXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHNpZGVuYXZzIHRoYXQgbWF0Y2ggcGFydGljdWxhciBjcml0ZXJpYSB3aXRoaW4gdGhlIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggY2hpcHMgYXJlIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0U2lkZW5hdnMoZmlsdGVyOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRTaWRlbmF2SGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRTaWRlbmF2SGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZWxlbWVudCB0aGF0IGhhcyB0aGUgY29udGFpbmVyJ3MgY29udGVudC4gKi9cbiAgYXN5bmMgZ2V0Q29udGVudCgpOiBQcm9taXNlPE1hdFNpZGVuYXZDb250ZW50SGFybmVzcz4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3IoTWF0U2lkZW5hdkNvbnRlbnRIYXJuZXNzKSgpO1xuICB9XG59XG4iXX0=