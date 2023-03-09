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
class MatLegacyRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyCellHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyRowHarness, options);
    }
}
/** The selector for the host element of a `MatRowHarness` instance. */
MatLegacyRowHarness.hostSelector = '.mat-row';
export { MatLegacyRowHarness };
/**
 * Harness for interacting with a standard Angular Material table header row.
 * @deprecated Use `MatHeaderRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyHeaderRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyHeaderCellHarness;
    }
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
/** The selector for the host element of a `MatHeaderRowHarness` instance. */
MatLegacyHeaderRowHarness.hostSelector = '.mat-header-row';
export { MatLegacyHeaderRowHarness };
/**
 * Harness for interacting with a standard Angular Material table footer row.
 * @deprecated Use `MatFooterRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyFooterRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyFooterCellHarness;
    }
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
/** The selector for the host element of a `MatFooterRowHarness` instance. */
MatLegacyFooterRowHarness.hostSelector = '.mat-footer-row';
export { MatLegacyFooterRowHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYmxlL3Rlc3Rpbmcvcm93LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUNMLG9CQUFvQixFQUNwQiwwQkFBMEIsRUFDMUIsMEJBQTBCLEdBQzNCLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFDLGtCQUFrQixFQUFvQixNQUFNLGlDQUFpQyxDQUFDO0FBRXRGOzs7O0dBSUc7QUFDSCxNQUFhLG1CQUFvQixTQUFRLGtCQUd4QztJQUhEOztRQU1ZLGlCQUFZLEdBQUcsb0JBQW9CLENBQUM7SUFVaEQsQ0FBQztJQVJDOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQTZCLEVBQUU7UUFDekMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7O0FBWEQsdUVBQXVFO0FBQ2hFLGdDQUFZLEdBQUcsVUFBVSxBQUFiLENBQWM7U0FMdEIsbUJBQW1CO0FBa0JoQzs7OztHQUlHO0FBQ0gsTUFBYSx5QkFBMEIsU0FBUSxrQkFHOUM7SUFIRDs7UUFNWSxpQkFBWSxHQUFHLDBCQUEwQixDQUFDO0lBV3RELENBQUM7SUFUQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBNkIsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7QUFaRCw2RUFBNkU7QUFDdEUsc0NBQVksR0FBRyxpQkFBaUIsQUFBcEIsQ0FBcUI7U0FMN0IseUJBQXlCO0FBbUJ0Qzs7OztHQUlHO0FBQ0gsTUFBYSx5QkFBMEIsU0FBUSxrQkFHOUM7SUFIRDs7UUFNWSxpQkFBWSxHQUFHLDBCQUEwQixDQUFDO0lBV3RELENBQUM7SUFUQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBNkIsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7QUFaRCw2RUFBNkU7QUFDdEUsc0NBQVksR0FBRyxpQkFBaUIsQUFBcEIsQ0FBcUI7U0FMN0IseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgTWF0TGVnYWN5Q2VsbEhhcm5lc3MsXG4gIE1hdExlZ2FjeUZvb3RlckNlbGxIYXJuZXNzLFxuICBNYXRMZWdhY3lIZWFkZXJDZWxsSGFybmVzcyxcbn0gZnJvbSAnLi9jZWxsLWhhcm5lc3MnO1xuaW1wb3J0IHtfTWF0Um93SGFybmVzc0Jhc2UsIFJvd0hhcm5lc3NGaWx0ZXJzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJsZS90ZXN0aW5nJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0YWJsZSByb3cuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFJvd0hhcm5lc3NgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3RhYmxlL3Rlc3RpbmdgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVJvd0hhcm5lc3MgZXh0ZW5kcyBfTWF0Um93SGFybmVzc0Jhc2U8XG4gIHR5cGVvZiBNYXRMZWdhY3lDZWxsSGFybmVzcyxcbiAgTWF0TGVnYWN5Q2VsbEhhcm5lc3Ncbj4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFJvd0hhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcm93JztcbiAgcHJvdGVjdGVkIF9jZWxsSGFybmVzcyA9IE1hdExlZ2FjeUNlbGxIYXJuZXNzO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRhYmxlIHJvdyB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGVnYWN5Um93SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRMZWdhY3lSb3dIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGhlYWRlciByb3cuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdEhlYWRlclJvd0hhcm5lc3NgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3RhYmxlL3Rlc3RpbmdgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUhlYWRlclJvd0hhcm5lc3MgZXh0ZW5kcyBfTWF0Um93SGFybmVzc0Jhc2U8XG4gIHR5cGVvZiBNYXRMZWdhY3lIZWFkZXJDZWxsSGFybmVzcyxcbiAgTWF0TGVnYWN5SGVhZGVyQ2VsbEhhcm5lc3Ncbj4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEhlYWRlclJvd0hhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtaGVhZGVyLXJvdyc7XG4gIHByb3RlY3RlZCBfY2VsbEhhcm5lc3MgPSBNYXRMZWdhY3lIZWFkZXJDZWxsSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3JcbiAgICogYSB0YWJsZSBoZWFkZXIgcm93IHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSb3dIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lIZWFkZXJSb3dIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeUhlYWRlclJvd0hhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdGFibGUgZm9vdGVyIHJvdy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Rm9vdGVyUm93SGFybmVzc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdGFibGUvdGVzdGluZ2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Rm9vdGVyUm93SGFybmVzcyBleHRlbmRzIF9NYXRSb3dIYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdExlZ2FjeUZvb3RlckNlbGxIYXJuZXNzLFxuICBNYXRMZWdhY3lGb290ZXJDZWxsSGFybmVzc1xuPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Rm9vdGVyUm93SGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1mb290ZXItcm93JztcbiAgcHJvdGVjdGVkIF9jZWxsSGFybmVzcyA9IE1hdExlZ2FjeUZvb3RlckNlbGxIYXJuZXNzO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvclxuICAgKiBhIHRhYmxlIGZvb3RlciByb3cgY2VsbCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGVnYWN5Rm9vdGVyUm93SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRMZWdhY3lGb290ZXJSb3dIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuIl19