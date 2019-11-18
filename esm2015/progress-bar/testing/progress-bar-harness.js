/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-progress-bar in tests. */
export class MatProgressBarHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatProgressBarHarness, options);
    }
    /** Gets a promise for the progress bar's value. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const ariaValue = yield host.getAttribute('aria-valuenow');
            return ariaValue ? coerceNumberProperty(ariaValue) : null;
        });
    }
    /** Gets a promise for the progress bar's mode. */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('mode');
        });
    }
}
MatProgressBarHarness.hostSelector = 'mat-progress-bar';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3MtYmFyL3Rlc3RpbmcvcHJvZ3Jlc3MtYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHlFQUF5RTtBQUN6RSxNQUFNLE9BQU8scUJBQXNCLFNBQVEsZ0JBQWdCO0lBR3pEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBcUMsRUFBRTtRQUNqRCxPQUFPLElBQUksZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELG1EQUFtRDtJQUM3QyxRQUFROztZQUNaLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzRCxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM1RCxDQUFDO0tBQUE7SUFFRCxrREFBa0Q7SUFDNUMsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBOztBQXBCTSxrQ0FBWSxHQUFHLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UHJvZ3Jlc3NCYXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9wcm9ncmVzcy1iYXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcHJvZ3Jlc3MtYmFyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFByb2dyZXNzQmFySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1wcm9ncmVzcy1iYXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHByb2dyZXNzIGJhciB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBQcm9ncmVzc0Jhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFByb2dyZXNzQmFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRQcm9ncmVzc0Jhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcHJvZ3Jlc3MgYmFyJ3MgdmFsdWUuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8bnVtYmVyfG51bGw+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgYXJpYVZhbHVlID0gYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKTtcbiAgICByZXR1cm4gYXJpYVZhbHVlID8gY29lcmNlTnVtYmVyUHJvcGVydHkoYXJpYVZhbHVlKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBwcm9ncmVzcyBiYXIncyBtb2RlLiAqL1xuICBhc3luYyBnZXRNb2RlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ21vZGUnKTtcbiAgfVxufVxuIl19