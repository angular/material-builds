/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-drawer-content in tests. */
class MatDrawerContentHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatDrawerContent` instance. */
    static { this.hostSelector = '.mat-drawer-content'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerContentHarness` that
     * meets certain criteria.
     * @param options Options for filtering which drawer content instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerContentHarness, options);
    }
}
export { MatDrawerContentHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWNvbnRlbnQtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zaWRlbmF2L3Rlc3RpbmcvZHJhd2VyLWNvbnRlbnQtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0NBQWdDLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUd4RiwyRUFBMkU7QUFDM0UsTUFBYSx1QkFBd0IsU0FBUSxnQ0FBd0M7SUFDbkYsMEVBQTBFO2FBQ25FLGlCQUFZLEdBQUcscUJBQXFCLENBQUM7SUFFNUM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUNULFVBQXVDLEVBQUU7UUFFekMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7O1NBZFUsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RHJhd2VyQ29udGVudEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RyYXdlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1kcmF3ZXItY29udGVudCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJDb250ZW50SGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdERyYXdlckNvbnRlbnRgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZHJhd2VyLWNvbnRlbnQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXREcmF3ZXJDb250ZW50SGFybmVzc2AgdGhhdFxuICAgKiBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZHJhd2VyIGNvbnRlbnQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgoXG4gICAgb3B0aW9uczogRHJhd2VyQ29udGVudEhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0RHJhd2VyQ29udGVudEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0RHJhd2VyQ29udGVudEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=