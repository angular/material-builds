/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatLegacyCellHarness, MatLegacyFooterCellHarness, MatLegacyHeaderCellHarness, } from './cell-harness';
import { _MatRowHarnessBase } from '@angular/material/table/testing';
/**
 * Harness for interacting with a standard Angular Material table row.
 * @deprecated Use `MatRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyCellHarness;
    }
    /** The selector for the host element of a `MatRowHarness` instance. */
    static { this.hostSelector = '.mat-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyRowHarness, options);
    }
}
/**
 * Harness for interacting with a standard Angular Material table header row.
 * @deprecated Use `MatHeaderRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyHeaderRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyHeaderCellHarness;
    }
    /** The selector for the host element of a `MatHeaderRowHarness` instance. */
    static { this.hostSelector = '.mat-header-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyHeaderRowHarness, options);
    }
}
/**
 * Harness for interacting with a standard Angular Material table footer row.
 * @deprecated Use `MatFooterRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyFooterRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyFooterCellHarness;
    }
    /** The selector for the host element of a `MatFooterRowHarness` instance. */
    static { this.hostSelector = '.mat-footer-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer row cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyFooterRowHarness, options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYmxlL3Rlc3Rpbmcvcm93LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUNMLG9CQUFvQixFQUNwQiwwQkFBMEIsRUFDMUIsMEJBQTBCLEdBQzNCLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFDLGtCQUFrQixFQUFvQixNQUFNLGlDQUFpQyxDQUFDO0FBRXRGOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsa0JBR3hDO0lBSEQ7O1FBTVksaUJBQVksR0FBRyxvQkFBb0IsQ0FBQztJQVVoRCxDQUFDO0lBWkMsdUVBQXVFO2FBQ2hFLGlCQUFZLEdBQUcsVUFBVSxBQUFiLENBQWM7SUFHakM7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBNkIsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUQsQ0FBQzs7QUFHSDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHlCQUEwQixTQUFRLGtCQUc5QztJQUhEOztRQU1ZLGlCQUFZLEdBQUcsMEJBQTBCLENBQUM7SUFXdEQsQ0FBQztJQWJDLDZFQUE2RTthQUN0RSxpQkFBWSxHQUFHLGlCQUFpQixBQUFwQixDQUFxQjtJQUd4Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBNkIsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7QUFHSDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHlCQUEwQixTQUFRLGtCQUc5QztJQUhEOztRQU1ZLGlCQUFZLEdBQUcsMEJBQTBCLENBQUM7SUFXdEQsQ0FBQztJQWJDLDZFQUE2RTthQUN0RSxpQkFBWSxHQUFHLGlCQUFpQixBQUFwQixDQUFxQjtJQUd4Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBNkIsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7XG4gIE1hdExlZ2FjeUNlbGxIYXJuZXNzLFxuICBNYXRMZWdhY3lGb290ZXJDZWxsSGFybmVzcyxcbiAgTWF0TGVnYWN5SGVhZGVyQ2VsbEhhcm5lc3MsXG59IGZyb20gJy4vY2VsbC1oYXJuZXNzJztcbmltcG9ydCB7X01hdFJvd0hhcm5lc3NCYXNlLCBSb3dIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGFibGUvdGVzdGluZyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdGFibGUgcm93LlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRSb3dIYXJuZXNzYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC90YWJsZS90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lSb3dIYXJuZXNzIGV4dGVuZHMgX01hdFJvd0hhcm5lc3NCYXNlPFxuICB0eXBlb2YgTWF0TGVnYWN5Q2VsbEhhcm5lc3MsXG4gIE1hdExlZ2FjeUNlbGxIYXJuZXNzXG4+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRSb3dIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXJvdyc7XG4gIHByb3RlY3RlZCBfY2VsbEhhcm5lc3MgPSBNYXRMZWdhY3lDZWxsSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWJsZSByb3cgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdExlZ2FjeVJvd0hhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TGVnYWN5Um93SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0YWJsZSBoZWFkZXIgcm93LlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRIZWFkZXJSb3dIYXJuZXNzYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC90YWJsZS90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lIZWFkZXJSb3dIYXJuZXNzIGV4dGVuZHMgX01hdFJvd0hhcm5lc3NCYXNlPFxuICB0eXBlb2YgTWF0TGVnYWN5SGVhZGVyQ2VsbEhhcm5lc3MsXG4gIE1hdExlZ2FjeUhlYWRlckNlbGxIYXJuZXNzXG4+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRIZWFkZXJSb3dIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWhlYWRlci1yb3cnO1xuICBwcm90ZWN0ZWQgX2NlbGxIYXJuZXNzID0gTWF0TGVnYWN5SGVhZGVyQ2VsbEhhcm5lc3M7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yXG4gICAqIGEgdGFibGUgaGVhZGVyIHJvdyB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGVnYWN5SGVhZGVyUm93SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRMZWdhY3lIZWFkZXJSb3dIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGZvb3RlciByb3cuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdEZvb3RlclJvd0hhcm5lc3NgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3RhYmxlL3Rlc3RpbmdgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUZvb3RlclJvd0hhcm5lc3MgZXh0ZW5kcyBfTWF0Um93SGFybmVzc0Jhc2U8XG4gIHR5cGVvZiBNYXRMZWdhY3lGb290ZXJDZWxsSGFybmVzcyxcbiAgTWF0TGVnYWN5Rm9vdGVyQ2VsbEhhcm5lc3Ncbj4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEZvb3RlclJvd0hhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZm9vdGVyLXJvdyc7XG4gIHByb3RlY3RlZCBfY2VsbEhhcm5lc3MgPSBNYXRMZWdhY3lGb290ZXJDZWxsSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3JcbiAgICogYSB0YWJsZSBmb290ZXIgcm93IGNlbGwgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdExlZ2FjeUZvb3RlclJvd0hhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TGVnYWN5Rm9vdGVyUm93SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==