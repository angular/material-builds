/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatSnackBarHarnessBase } from '@angular/material/snack-bar/testing';
/**
 * Harness for interacting with a standard mat-snack-bar in tests.
 * @deprecated Use `MatSnackBarHarness` from `@angular/material/snack-bar/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySnackBarHarness extends _MatSnackBarHarnessBase {
    constructor() {
        super(...arguments);
        this._messageSelector = '.mat-simple-snackbar > span';
        this._actionButtonSelector = '.mat-simple-snackbar-action > button';
    }
    // Developers can provide a custom component or template for the snackbar. The canonical snack-bar
    // parent is the "MatSnackBarContainer". We use `:not([mat-exit])` to exclude snack bars that
    // are in the process of being dismissed, because the element only gets removed after the
    // animation is finished and since it runs outside of Angular, we don't have a way of being
    // notified when it's done.
    /** The selector for the host element of a `MatSnackBar` instance. */
    static { this.hostSelector = '.mat-snack-bar-container'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a snack bar with specific attributes.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacySnackBarHarness, options);
    }
    async _assertContentAnnotated() {
        if (!(await this._isSimpleSnackBar())) {
            throw Error('Method cannot be used for snack-bar with custom content.');
        }
    }
    /** Whether the snack-bar is using the default content template. */
    async _isSimpleSnackBar() {
        return (await this.locatorForOptional('.mat-simple-snackbar')()) !== null;
    }
}
export { MatLegacySnackBarHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXNuYWNrLWJhci90ZXN0aW5nL3NuYWNrLWJhci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyx1QkFBdUIsRUFBeUIsTUFBTSxxQ0FBcUMsQ0FBQztBQUVwRzs7OztHQUlHO0FBQ0gsTUFBYSx3QkFBeUIsU0FBUSx1QkFBdUI7SUFBckU7O1FBUXFCLHFCQUFnQixHQUFHLDZCQUE2QixDQUFDO1FBQ2pELDBCQUFxQixHQUFHLHNDQUFzQyxDQUFDO0lBcUJwRixDQUFDO0lBN0JDLGtHQUFrRztJQUNsRyw2RkFBNkY7SUFDN0YseUZBQXlGO0lBQ3pGLDJGQUEyRjtJQUMzRiwyQkFBMkI7SUFDM0IscUVBQXFFO2FBQzlELGlCQUFZLEdBQUcsMEJBQTBCLEFBQTdCLENBQThCO0lBSWpEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFa0IsS0FBSyxDQUFDLHVCQUF1QjtRQUM5QyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUU7WUFDckMsTUFBTSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7SUFFRCxtRUFBbUU7SUFDM0QsS0FBSyxDQUFDLGlCQUFpQjtRQUM3QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQzVFLENBQUM7O1NBN0JVLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge19NYXRTbmFja0Jhckhhcm5lc3NCYXNlLCBTbmFja0Jhckhhcm5lc3NGaWx0ZXJzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXIvdGVzdGluZyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbmFjay1iYXIgaW4gdGVzdHMuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFNuYWNrQmFySGFybmVzc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3RpbmdgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNuYWNrQmFySGFybmVzcyBleHRlbmRzIF9NYXRTbmFja0Jhckhhcm5lc3NCYXNlIHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZSBzbmFja2Jhci4gVGhlIGNhbm9uaWNhbCBzbmFjay1iYXJcbiAgLy8gcGFyZW50IGlzIHRoZSBcIk1hdFNuYWNrQmFyQ29udGFpbmVyXCIuIFdlIHVzZSBgOm5vdChbbWF0LWV4aXRdKWAgdG8gZXhjbHVkZSBzbmFjayBiYXJzIHRoYXRcbiAgLy8gYXJlIGluIHRoZSBwcm9jZXNzIG9mIGJlaW5nIGRpc21pc3NlZCwgYmVjYXVzZSB0aGUgZWxlbWVudCBvbmx5IGdldHMgcmVtb3ZlZCBhZnRlciB0aGVcbiAgLy8gYW5pbWF0aW9uIGlzIGZpbmlzaGVkIGFuZCBzaW5jZSBpdCBydW5zIG91dHNpZGUgb2YgQW5ndWxhciwgd2UgZG9uJ3QgaGF2ZSBhIHdheSBvZiBiZWluZ1xuICAvLyBub3RpZmllZCB3aGVuIGl0J3MgZG9uZS5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTbmFja0JhcmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zbmFjay1iYXItY29udGFpbmVyJztcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9tZXNzYWdlU2VsZWN0b3IgPSAnLm1hdC1zaW1wbGUtc25hY2tiYXIgPiBzcGFuJztcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9hY3Rpb25CdXR0b25TZWxlY3RvciA9ICcubWF0LXNpbXBsZS1zbmFja2Jhci1hY3Rpb24gPiBidXR0b24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHNuYWNrIGJhciB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzbmFjayBiYXIgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU25hY2tCYXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lTbmFja0Jhckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TGVnYWN5U25hY2tCYXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBhc3luYyBfYXNzZXJ0Q29udGVudEFubm90YXRlZCgpIHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLl9pc1NpbXBsZVNuYWNrQmFyKCkpKSB7XG4gICAgICB0aHJvdyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIgd2l0aCBjdXN0b20gY29udGVudC4nKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc25hY2stYmFyIGlzIHVzaW5nIHRoZSBkZWZhdWx0IGNvbnRlbnQgdGVtcGxhdGUuICovXG4gIHByaXZhdGUgYXN5bmMgX2lzU2ltcGxlU25hY2tCYXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1zaW1wbGUtc25hY2tiYXInKSgpKSAhPT0gbnVsbDtcbiAgfVxufVxuIl19