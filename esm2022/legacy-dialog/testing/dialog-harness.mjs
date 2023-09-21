/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatDialogHarnessBase } from '@angular/material/dialog/testing';
/**
 * Harness for interacting with a standard `MatDialog` in tests.
 * @deprecated Use `MatDialogHarness` from `@angular/material/dialog/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyDialogHarness extends _MatDialogHarnessBase {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-dialog-title" /* MatLegacyDialogSection.TITLE */);
        this._content = this.locatorForOptional(".mat-dialog-content" /* MatLegacyDialogSection.CONTENT */);
        this._actions = this.locatorForOptional(".mat-dialog-actions" /* MatLegacyDialogSection.ACTIONS */);
    }
    // Developers can provide a custom component or template for the
    // dialog. The canonical dialog parent is the "MatDialogContainer".
    /** The selector for the host element of a `MatDialog` instance. */
    static { this.hostSelector = '.mat-dialog-container'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDialogHarness` that meets
     * certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyDialogHarness, options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWRpYWxvZy90ZXN0aW5nL2RpYWxvZy1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxxQkFBcUIsRUFBdUIsTUFBTSxrQ0FBa0MsQ0FBQztBQWE3Rjs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHNCQUF1QixTQUFRLHFCQUFxQjtJQUFqRTs7UUFnQnFCLFdBQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLHdEQUE4QixDQUFDO1FBQy9ELGFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLDREQUFnQyxDQUFDO1FBQ25FLGFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLDREQUFnQyxDQUFDO0lBQ3hGLENBQUM7SUFsQkMsZ0VBQWdFO0lBQ2hFLG1FQUFtRTtJQUNuRSxtRUFBbUU7YUFDNUQsaUJBQVksR0FBRyx1QkFBdUIsQUFBMUIsQ0FBMkI7SUFFOUM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWdDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge19NYXREaWFsb2dIYXJuZXNzQmFzZSwgRGlhbG9nSGFybmVzc0ZpbHRlcnN9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZy90ZXN0aW5nJztcblxuLyoqXG4gKiBTZWxlY3RvcnMgZm9yIGRpZmZlcmVudCBzZWN0aW9ucyBvZiB0aGUgbWF0LWRpYWxvZyB0aGF0IGNhbiBjb250YWluIHVzZXIgY29udGVudC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgZW51bWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmdgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gTWF0TGVnYWN5RGlhbG9nU2VjdGlvbiB7XG4gIFRJVExFID0gJy5tYXQtZGlhbG9nLXRpdGxlJyxcbiAgQ09OVEVOVCA9ICcubWF0LWRpYWxvZy1jb250ZW50JyxcbiAgQUNUSU9OUyA9ICcubWF0LWRpYWxvZy1hY3Rpb25zJyxcbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgYE1hdERpYWxvZ2AgaW4gdGVzdHMuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdERpYWxvZ0hhcm5lc3NgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2RpYWxvZy90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lEaWFsb2dIYXJuZXNzIGV4dGVuZHMgX01hdERpYWxvZ0hhcm5lc3NCYXNlIHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBkaWFsb2cuIFRoZSBjYW5vbmljYWwgZGlhbG9nIHBhcmVudCBpcyB0aGUgXCJNYXREaWFsb2dDb250YWluZXJcIi5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXREaWFsb2dgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZGlhbG9nLWNvbnRhaW5lcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdERpYWxvZ0hhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRpYWxvZyBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEaWFsb2dIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lEaWFsb2dIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeURpYWxvZ0hhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF90aXRsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdExlZ2FjeURpYWxvZ1NlY3Rpb24uVElUTEUpO1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2NvbnRlbnQgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRMZWdhY3lEaWFsb2dTZWN0aW9uLkNPTlRFTlQpO1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2FjdGlvbnMgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRMZWdhY3lEaWFsb2dTZWN0aW9uLkFDVElPTlMpO1xufVxuIl19