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
/** Harness for interacting with a standard mat-progress-spinner in tests. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXIvdGVzdGluZy9wcm9ncmVzcy1zcGlubmVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSXhFLDZFQUE2RTtBQUM3RTtJQUErQyw2Q0FBZ0I7SUFBL0Q7O0lBd0JBLENBQUM7SUFyQkM7OztPQUdHO0lBQ0ksOEJBQUksR0FBWCxVQUFZLE9BQTJDO1FBQTNDLHdCQUFBLEVBQUEsWUFBMkM7UUFFckQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCx1REFBdUQ7SUFDakQsNENBQVEsR0FBZDs7Ozs7NEJBQ2UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBeEIsSUFBSSxHQUFHLFNBQWlCO3dCQUNaLHFCQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUE7O3dCQUFwRCxTQUFTLEdBQUcsU0FBd0M7d0JBQzFELHNCQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQzs7OztLQUMzRDtJQUVELHNEQUFzRDtJQUNoRCwyQ0FBTyxHQUFiOzs7Ozs0QkFDb0IscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBN0IsUUFBUSxHQUFHLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7d0JBQ2xELHFCQUFNLFFBQVEsRUFBQTs0QkFBckIsc0JBQU8sU0FBcUMsRUFBQzs7OztLQUM5QztJQXRCTSxzQ0FBWSxHQUFHLHNCQUFzQixDQUFDO0lBdUIvQyxnQ0FBQztDQUFBLEFBeEJELENBQStDLGdCQUFnQixHQXdCOUQ7U0F4QlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UHJvZ3Jlc3NTcGlubmVyTW9kZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5pbXBvcnQge1Byb2dyZXNzU3Bpbm5lckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3Byb2dyZXNzLXNwaW5uZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc1NwaW5uZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXByb2dyZXNzLXNwaW5uZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHByb2dyZXNzIGJhciB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBQcm9ncmVzc1NwaW5uZXJIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRQcm9ncmVzc1NwaW5uZXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHByb2dyZXNzIHNwaW5uZXIncyB2YWx1ZS4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxudW1iZXJ8bnVsbD4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBhcmlhVmFsdWUgPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpO1xuICAgIHJldHVybiBhcmlhVmFsdWUgPyBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhcmlhVmFsdWUpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHByb2dyZXNzIHNwaW5uZXIncyBtb2RlLiAqL1xuICBhc3luYyBnZXRNb2RlKCk6IFByb21pc2U8UHJvZ3Jlc3NTcGlubmVyTW9kZT4ge1xuICAgIGNvbnN0IG1vZGVBdHRyID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ21vZGUnKTtcbiAgICByZXR1cm4gYXdhaXQgbW9kZUF0dHIgYXMgUHJvZ3Jlc3NTcGlubmVyTW9kZTtcbiAgfVxufVxuIl19