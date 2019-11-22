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
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressSpinnerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which progress spinner instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatProgressSpinnerHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatProgressSpinnerHarness, options);
    };
    /** Gets the progress spinner's value. */
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
    /** Gets the progress spinner's mode. */
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
    /** The selector for the host element of a `MatProgressSpinner` instance. */
    MatProgressSpinnerHarness.hostSelector = 'mat-progress-spinner';
    return MatProgressSpinnerHarness;
}(ComponentHarness));
export { MatProgressSpinnerHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXIvdGVzdGluZy9wcm9ncmVzcy1zcGlubmVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSXhFLDZFQUE2RTtBQUM3RTtJQUErQyw2Q0FBZ0I7SUFBL0Q7O0lBMkJBLENBQUM7SUF2QkM7Ozs7O09BS0c7SUFDSSw4QkFBSSxHQUFYLFVBQVksT0FBMkM7UUFBM0Msd0JBQUEsRUFBQSxZQUEyQztRQUVyRCxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHlDQUF5QztJQUNuQyw0Q0FBUSxHQUFkOzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQ1oscUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBQTs7d0JBQXBELFNBQVMsR0FBRyxTQUF3Qzt3QkFDMUQsc0JBQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDOzs7O0tBQzNEO0lBRUQsd0NBQXdDO0lBQ2xDLDJDQUFPLEdBQWI7Ozs7OzRCQUNvQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE3QixRQUFRLEdBQUcsQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQzt3QkFDbEQscUJBQU0sUUFBUSxFQUFBOzRCQUFyQixzQkFBTyxTQUFxQyxFQUFDOzs7O0tBQzlDO0lBekJELDRFQUE0RTtJQUNyRSxzQ0FBWSxHQUFHLHNCQUFzQixDQUFDO0lBeUIvQyxnQ0FBQztDQUFBLEFBM0JELENBQStDLGdCQUFnQixHQTJCOUQ7U0EzQlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UHJvZ3Jlc3NTcGlubmVyTW9kZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5pbXBvcnQge1Byb2dyZXNzU3Bpbm5lckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3Byb2dyZXNzLXNwaW5uZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc1NwaW5uZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0UHJvZ3Jlc3NTcGlubmVyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFByb2dyZXNzU3Bpbm5lckhhcm5lc3NgIHRoYXRcbiAgICogbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHByb2dyZXNzIHNwaW5uZXIgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUHJvZ3Jlc3NTcGlubmVySGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFByb2dyZXNzU3Bpbm5lckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcHJvZ3Jlc3Mgc3Bpbm5lcidzIHZhbHVlLiAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPG51bWJlcnxudWxsPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IGFyaWFWYWx1ZSA9IGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93Jyk7XG4gICAgcmV0dXJuIGFyaWFWYWx1ZSA/IGNvZXJjZU51bWJlclByb3BlcnR5KGFyaWFWYWx1ZSkgOiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHByb2dyZXNzIHNwaW5uZXIncyBtb2RlLiAqL1xuICBhc3luYyBnZXRNb2RlKCk6IFByb21pc2U8UHJvZ3Jlc3NTcGlubmVyTW9kZT4ge1xuICAgIGNvbnN0IG1vZGVBdHRyID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ21vZGUnKTtcbiAgICByZXR1cm4gYXdhaXQgbW9kZUF0dHIgYXMgUHJvZ3Jlc3NTcGlubmVyTW9kZTtcbiAgfVxufVxuIl19