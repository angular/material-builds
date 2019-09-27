/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard mat-drawer in tests.
 * @dynamic
 */
export class MatDrawerHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a drawer with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options);
    }
    /** Gets whether the drawer is open. */
    isOpen() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-drawer-opened');
        });
    }
    /** Gets the position of the drawer inside its container. */
    getPosition() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.hasClass('mat-drawer-end')) ? 'end' : 'start';
        });
    }
    /** Gets the mode that the drawer is in. */
    getMode() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            if (yield host.hasClass('mat-drawer-push')) {
                return 'push';
            }
            if (yield host.hasClass('mat-drawer-side')) {
                return 'side';
            }
            return 'over';
        });
    }
}
MatDrawerHarness.hostSelector = '.mat-drawer';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi90ZXN0aW5nL2RyYXdlci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUd4RTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCO0lBR3BEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFnQyxFQUFFO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsdUNBQXVDO0lBQ2pDLE1BQU07O1lBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBO0lBRUQsNERBQTREO0lBQ3RELFdBQVc7O1lBQ2YsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUVELDJDQUEyQztJQUNyQyxPQUFPOztZQUNYLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRS9CLElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQzFDLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFFRCxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUMxQyxPQUFPLE1BQU0sQ0FBQzthQUNmO1lBRUQsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztLQUFBOztBQXBDTSw2QkFBWSxHQUFHLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RHJhd2VySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZHJhd2VyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1kcmF3ZXIgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZHJhd2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBkcmF3ZXIgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaC5cbiAgICogQHJldHVybiBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRHJhd2VySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0RHJhd2VySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXREcmF3ZXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGRyYXdlciBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1kcmF3ZXItb3BlbmVkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcG9zaXRpb24gb2YgdGhlIGRyYXdlciBpbnNpZGUgaXRzIGNvbnRhaW5lci4gKi9cbiAgYXN5bmMgZ2V0UG9zaXRpb24oKTogUHJvbWlzZTwnc3RhcnQnfCdlbmQnPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWRyYXdlci1lbmQnKSkgPyAnZW5kJyA6ICdzdGFydCc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbW9kZSB0aGF0IHRoZSBkcmF3ZXIgaXMgaW4uICovXG4gIGFzeW5jIGdldE1vZGUoKTogUHJvbWlzZTwnb3Zlcid8J3B1c2gnfCdzaWRlJz4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcblxuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtZHJhd2VyLXB1c2gnKSkge1xuICAgICAgcmV0dXJuICdwdXNoJztcbiAgICB9XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWRyYXdlci1zaWRlJykpIHtcbiAgICAgIHJldHVybiAnc2lkZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuICdvdmVyJztcbiAgfVxufVxuIl19