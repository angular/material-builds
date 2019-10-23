/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard mat-progress-spinner in tests.
 * @dynamic
 */
var MatProgressSpinnerHarness = /** @class */ (function (_super) {
    __extends(MatProgressSpinnerHarness, _super);
    function MatProgressSpinnerHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     */
    MatProgressSpinnerHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatProgressSpinnerHarness, options);
    };
    /** Gets a promise for the progress spinner's value. */
    MatProgressSpinnerHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, ariaValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.getAttribute('aria-valuenow')];
                    case 2:
                        ariaValue = _a.sent();
                        return [2 /*return*/, ariaValue ? coerceNumberProperty(ariaValue) : null];
                }
            });
        });
    };
    /** Gets a promise for the progress spinner's mode. */
    MatProgressSpinnerHarness.prototype.getMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modeAttr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        modeAttr = (_a.sent()).getAttribute('mode');
                        return [4 /*yield*/, modeAttr];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MatProgressSpinnerHarness.hostSelector = 'mat-progress-spinner';
    return MatProgressSpinnerHarness;
}(ComponentHarness));
export { MatProgressSpinnerHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXIvdGVzdGluZy9wcm9ncmVzcy1zcGlubmVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSXhFOzs7R0FHRztBQUNIO0lBQStDLDZDQUFnQjtJQUEvRDs7SUF3QkEsQ0FBQztJQXJCQzs7O09BR0c7SUFDSSw4QkFBSSxHQUFYLFVBQVksT0FBMkM7UUFBM0Msd0JBQUEsRUFBQSxZQUEyQztRQUVyRCxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHVEQUF1RDtJQUNqRCw0Q0FBUSxHQUFkOzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQ1oscUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBQTs7d0JBQXBELFNBQVMsR0FBRyxTQUF3Qzt3QkFDMUQsc0JBQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDOzs7O0tBQzNEO0lBRUQsc0RBQXNEO0lBQ2hELDJDQUFPLEdBQWI7Ozs7OzRCQUNvQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE3QixRQUFRLEdBQUcsQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQzt3QkFDbEQscUJBQU0sUUFBUSxFQUFBOzRCQUFyQixzQkFBTyxTQUFxQyxFQUFDOzs7O0tBQzlDO0lBdEJNLHNDQUFZLEdBQUcsc0JBQXNCLENBQUM7SUF1Qi9DLGdDQUFDO0NBQUEsQUF4QkQsQ0FBK0MsZ0JBQWdCLEdBd0I5RDtTQXhCWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtQcm9ncmVzc1NwaW5uZXJNb2RlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyJztcbmltcG9ydCB7UHJvZ3Jlc3NTcGlubmVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcHJvZ3Jlc3Mtc3Bpbm5lci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc1NwaW5uZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXByb2dyZXNzLXNwaW5uZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHByb2dyZXNzIGJhciB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBQcm9ncmVzc1NwaW5uZXJIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRQcm9ncmVzc1NwaW5uZXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHByb2dyZXNzIHNwaW5uZXIncyB2YWx1ZS4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxudW1iZXJ8bnVsbD4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBhcmlhVmFsdWUgPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpO1xuICAgIHJldHVybiBhcmlhVmFsdWUgPyBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhcmlhVmFsdWUpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHByb2dyZXNzIHNwaW5uZXIncyBtb2RlLiAqL1xuICBhc3luYyBnZXRNb2RlKCk6IFByb21pc2U8UHJvZ3Jlc3NTcGlubmVyTW9kZT4ge1xuICAgIGNvbnN0IG1vZGVBdHRyID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ21vZGUnKTtcbiAgICByZXR1cm4gYXdhaXQgbW9kZUF0dHIgYXMgUHJvZ3Jlc3NTcGlubmVyTW9kZTtcbiAgfVxufVxuIl19