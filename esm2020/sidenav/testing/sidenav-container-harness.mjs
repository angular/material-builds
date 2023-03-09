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
class MatSidenavContainerHarness extends ContentContainerComponentHarness {
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
export { MatSidenavContainerHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1jb250YWluZXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zaWRlbmF2L3Rlc3Rpbmcvc2lkZW5hdi1jb250YWluZXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0NBQWdDLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCw4RUFBOEU7QUFDOUUsTUFBYSwwQkFBMkIsU0FBUSxnQ0FBd0M7SUFJdEY7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUNULFVBQXlDLEVBQUU7UUFFM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQStCLEVBQUU7UUFDakQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVELHlEQUF5RDtJQUN6RCxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLENBQUM7SUFDckQsQ0FBQzs7QUExQkQsNkVBQTZFO0FBQ3RFLHVDQUFZLEdBQUcsd0JBQXdCLENBQUM7U0FGcEMsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RHJhd2VyQ29udGFpbmVySGFybmVzc0ZpbHRlcnMsIERyYXdlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RyYXdlci1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRTaWRlbmF2Q29udGVudEhhcm5lc3N9IGZyb20gJy4vc2lkZW5hdi1jb250ZW50LWhhcm5lc3MnO1xuaW1wb3J0IHtNYXRTaWRlbmF2SGFybmVzc30gZnJvbSAnLi9zaWRlbmF2LWhhcm5lc3MnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zaWRlbmF2LWNvbnRhaW5lciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2Q29udGFpbmVySGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFNpZGVuYXZDb250YWluZXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2lkZW5hdi1jb250YWluZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTaWRlbmF2Q29udGFpbmVySGFybmVzc2AgdGhhdFxuICAgKiBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggY29udGFpbmVyIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKFxuICAgIG9wdGlvbnM6IERyYXdlckNvbnRhaW5lckhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U2lkZW5hdkNvbnRhaW5lckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2lkZW5hdkNvbnRhaW5lckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgc2lkZW5hdnMgdGhhdCBtYXRjaCBwYXJ0aWN1bGFyIGNyaXRlcmlhIHdpdGhpbiB0aGUgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBjaGlwcyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRTaWRlbmF2cyhmaWx0ZXI6IERyYXdlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdFNpZGVuYXZIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFNpZGVuYXZIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBlbGVtZW50IHRoYXQgaGFzIHRoZSBjb250YWluZXIncyBjb250ZW50LiAqL1xuICBhc3luYyBnZXRDb250ZW50KCk6IFByb21pc2U8TWF0U2lkZW5hdkNvbnRlbnRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRTaWRlbmF2Q29udGVudEhhcm5lc3MpKCk7XG4gIH1cbn1cbiJdfQ==