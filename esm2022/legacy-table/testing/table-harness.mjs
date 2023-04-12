/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatLegacyFooterRowHarness, MatLegacyHeaderRowHarness, MatLegacyRowHarness, } from './row-harness';
import { _MatTableHarnessBase } from '@angular/material/table/testing';
/**
 * Harness for interacting with a standard mat-table in tests.
 * @deprecated Use `MatTableHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTableHarness extends _MatTableHarnessBase {
    constructor() {
        super(...arguments);
        this._headerRowHarness = MatLegacyHeaderRowHarness;
        this._rowHarness = MatLegacyRowHarness;
        this._footerRowHarness = MatLegacyFooterRowHarness;
    }
    /** The selector for the host element of a `MatTableHarness` instance. */
    static { this.hostSelector = '.mat-table'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyTableHarness, options);
    }
}
export { MatLegacyTableHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktdGFibGUvdGVzdGluZy90YWJsZS1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFDTCx5QkFBeUIsRUFDekIseUJBQXlCLEVBQ3pCLG1CQUFtQixHQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsb0JBQW9CLEVBQXNCLE1BQU0saUNBQWlDLENBQUM7QUFFMUY7Ozs7R0FJRztBQUNILE1BQWEscUJBQXNCLFNBQVEsb0JBTzFDO0lBUEQ7O1FBVVksc0JBQWlCLEdBQUcseUJBQXlCLENBQUM7UUFDOUMsZ0JBQVcsR0FBRyxtQkFBbUIsQ0FBQztRQUNsQyxzQkFBaUIsR0FBRyx5QkFBeUIsQ0FBQztJQVUxRCxDQUFDO0lBZEMseUVBQXlFO2FBQ2xFLGlCQUFZLEdBQUcsWUFBWSxBQUFmLENBQWdCO0lBS25DOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQStCLEVBQUU7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7O1NBckJVLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7XG4gIE1hdExlZ2FjeUZvb3RlclJvd0hhcm5lc3MsXG4gIE1hdExlZ2FjeUhlYWRlclJvd0hhcm5lc3MsXG4gIE1hdExlZ2FjeVJvd0hhcm5lc3MsXG59IGZyb20gJy4vcm93LWhhcm5lc3MnO1xuaW1wb3J0IHtfTWF0VGFibGVIYXJuZXNzQmFzZSwgVGFibGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGFibGUvdGVzdGluZyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC10YWJsZSBpbiB0ZXN0cy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0VGFibGVIYXJuZXNzYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC90YWJsZS90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUYWJsZUhhcm5lc3MgZXh0ZW5kcyBfTWF0VGFibGVIYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdExlZ2FjeUhlYWRlclJvd0hhcm5lc3MsXG4gIE1hdExlZ2FjeUhlYWRlclJvd0hhcm5lc3MsXG4gIHR5cGVvZiBNYXRMZWdhY3lSb3dIYXJuZXNzLFxuICBNYXRMZWdhY3lSb3dIYXJuZXNzLFxuICB0eXBlb2YgTWF0TGVnYWN5Rm9vdGVyUm93SGFybmVzcyxcbiAgTWF0TGVnYWN5Rm9vdGVyUm93SGFybmVzc1xuPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0VGFibGVIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRhYmxlJztcbiAgcHJvdGVjdGVkIF9oZWFkZXJSb3dIYXJuZXNzID0gTWF0TGVnYWN5SGVhZGVyUm93SGFybmVzcztcbiAgcHJvdGVjdGVkIF9yb3dIYXJuZXNzID0gTWF0TGVnYWN5Um93SGFybmVzcztcbiAgcHJvdGVjdGVkIF9mb290ZXJSb3dIYXJuZXNzID0gTWF0TGVnYWN5Rm9vdGVyUm93SGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWJsZSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVGFibGVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lUYWJsZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TGVnYWN5VGFibGVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuIl19