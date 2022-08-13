/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatLegacySelectHarness } from '@angular/material/legacy-select/testing';
import { _MatPaginatorHarnessBase, } from '@angular/material/paginator/testing';
/** Harness for interacting with a standard mat-paginator in tests. */
export class MatLegacyPaginatorHarness extends _MatPaginatorHarnessBase {
    constructor() {
        super(...arguments);
        this._nextButton = this.locatorFor('.mat-paginator-navigation-next');
        this._previousButton = this.locatorFor('.mat-paginator-navigation-previous');
        this._firstPageButton = this.locatorForOptional('.mat-paginator-navigation-first');
        this._lastPageButton = this.locatorForOptional('.mat-paginator-navigation-last');
        this._select = this.locatorForOptional(MatLegacySelectHarness.with({
            ancestor: '.mat-paginator-page-size',
        }));
        this._pageSizeFallback = this.locatorFor('.mat-paginator-page-size-value');
        this._rangeLabel = this.locatorFor('.mat-paginator-range-label');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyPaginatorHarness, options);
    }
}
/** Selector used to find paginator instances. */
MatLegacyPaginatorHarness.hostSelector = '.mat-paginator';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXBhZ2luYXRvci90ZXN0aW5nL3BhZ2luYXRvci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQy9FLE9BQU8sRUFDTCx3QkFBd0IsR0FFekIsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3QyxzRUFBc0U7QUFDdEUsTUFBTSxPQUFPLHlCQUEwQixTQUFRLHdCQUF3QjtJQUF2RTs7UUFHWSxnQkFBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNoRSxvQkFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUN4RSxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUM5RSxvQkFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQzVFLFlBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQ3pDLHNCQUFzQixDQUFDLElBQUksQ0FBQztZQUMxQixRQUFRLEVBQUUsMEJBQTBCO1NBQ3JDLENBQUMsQ0FDSCxDQUFDO1FBQ1Esc0JBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3RFLGdCQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBV3hFLENBQUM7SUFUQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBbUMsRUFBRTtRQUMvQyxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7QUF0QkQsaURBQWlEO0FBQzFDLHNDQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdExlZ2FjeVNlbGVjdEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1zZWxlY3QvdGVzdGluZyc7XG5pbXBvcnQge1xuICBfTWF0UGFnaW5hdG9ySGFybmVzc0Jhc2UsXG4gIFBhZ2luYXRvckhhcm5lc3NGaWx0ZXJzLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wYWdpbmF0b3IvdGVzdGluZyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXBhZ2luYXRvciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lQYWdpbmF0b3JIYXJuZXNzIGV4dGVuZHMgX01hdFBhZ2luYXRvckhhcm5lc3NCYXNlIHtcbiAgLyoqIFNlbGVjdG9yIHVzZWQgdG8gZmluZCBwYWdpbmF0b3IgaW5zdGFuY2VzLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcGFnaW5hdG9yJztcbiAgcHJvdGVjdGVkIF9uZXh0QnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLW5leHQnKTtcbiAgcHJvdGVjdGVkIF9wcmV2aW91c0J1dHRvbiA9IHRoaXMubG9jYXRvckZvcignLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1wcmV2aW91cycpO1xuICBwcm90ZWN0ZWQgX2ZpcnN0UGFnZUJ1dHRvbiA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLWZpcnN0Jyk7XG4gIHByb3RlY3RlZCBfbGFzdFBhZ2VCdXR0b24gPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1sYXN0Jyk7XG4gIHByb3RlY3RlZCBfc2VsZWN0ID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoXG4gICAgTWF0TGVnYWN5U2VsZWN0SGFybmVzcy53aXRoKHtcbiAgICAgIGFuY2VzdG9yOiAnLm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplJyxcbiAgICB9KSxcbiAgKTtcbiAgcHJvdGVjdGVkIF9wYWdlU2l6ZUZhbGxiYWNrID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1wYWdlLXNpemUtdmFsdWUnKTtcbiAgcHJvdGVjdGVkIF9yYW5nZUxhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1yYW5nZS1sYWJlbCcpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRQYWdpbmF0b3JIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBwYWdpbmF0b3IgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUGFnaW5hdG9ySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGVnYWN5UGFnaW5hdG9ySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRMZWdhY3lQYWdpbmF0b3JIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuIl19