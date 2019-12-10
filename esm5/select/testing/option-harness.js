/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a the `mat-option` for a `mat-select` in tests. */
var MatSelectOptionHarness = /** @class */ (function (_super) {
    __extends(MatSelectOptionHarness, _super);
    function MatSelectOptionHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO(crisbeto): things to add here when adding a common option harness:
    // - isDisabled
    // - isSelected
    // - isActive
    // - isMultiple
    MatSelectOptionHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSelectOptionHarness, options)
            .addOption('text', options.text, function (harness, title) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = HarnessPredicate).stringMatches;
                    return [4 /*yield*/, harness.getText()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
            }
        }); }); });
    };
    /** Clicks the option. */
    MatSelectOptionHarness.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Gets a promise for the option's label text. */
    MatSelectOptionHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    MatSelectOptionHarness.hostSelector = '.mat-select-panel .mat-option';
    return MatSelectOptionHarness;
}(ComponentHarness));
export { MatSelectOptionHarness };
/** Harness for interacting with a the `mat-optgroup` for a `mat-select` in tests. */
var MatSelectOptionGroupHarness = /** @class */ (function (_super) {
    __extends(MatSelectOptionGroupHarness, _super);
    function MatSelectOptionGroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-optgroup-label');
        return _this;
    }
    MatSelectOptionGroupHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSelectOptionGroupHarness, options)
            .addOption('labelText', options.labelText, function (harness, title) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = HarnessPredicate).stringMatches;
                    return [4 /*yield*/, harness.getLabelText()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
            }
        }); }); });
    };
    /** Gets a promise for the option group's label text. */
    MatSelectOptionGroupHarness.prototype.getLabelText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._label()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    MatSelectOptionGroupHarness.hostSelector = '.mat-select-panel .mat-optgroup';
    return MatSelectOptionGroupHarness;
}(ComponentHarness));
export { MatSelectOptionGroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1RixtRkFBbUY7QUFDbkY7SUFBNEMsMENBQWdCO0lBQTVEOztJQXlCQSxDQUFDO0lBeEJDLDBFQUEwRTtJQUMxRSxlQUFlO0lBQ2YsZUFBZTtJQUNmLGFBQWE7SUFDYixlQUFlO0lBRVIsMkJBQUksR0FBWCxVQUFZLE9BQWtDO1FBQTlDLGlCQUtDO1FBTFcsd0JBQUEsRUFBQSxZQUFrQztRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDO2FBQ3ZELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsVUFBTyxPQUFPLEVBQUUsS0FBSzs7O29CQUNqQixLQUFBLENBQUEsS0FBQSxnQkFBZ0IsQ0FBQSxDQUFDLGFBQWEsQ0FBQTtvQkFBQyxxQkFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUE7d0JBQXRELHNCQUFBLGNBQStCLFNBQXVCLEVBQUUsS0FBSyxFQUFDLEVBQUE7O2lCQUFBLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBSUQseUJBQXlCO0lBQ25CLHNDQUFLLEdBQVg7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUNwQztJQUVELGtEQUFrRDtJQUM1Qyx3Q0FBTyxHQUFiOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDbkM7SUFWTSxtQ0FBWSxHQUFHLCtCQUErQixDQUFDO0lBV3hELDZCQUFDO0NBQUEsQUF6QkQsQ0FBNEMsZ0JBQWdCLEdBeUIzRDtTQXpCWSxzQkFBc0I7QUEyQm5DLHFGQUFxRjtBQUNyRjtJQUFpRCwrQ0FBZ0I7SUFBakU7UUFBQSxxRUFlQztRQWRTLFlBQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0lBYzFELENBQUM7SUFYUSxnQ0FBSSxHQUFYLFVBQVksT0FBdUM7UUFBbkQsaUJBS0M7UUFMVyx3QkFBQSxFQUFBLFlBQXVDO1FBQ2pELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUM7YUFDNUQsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUNyQyxVQUFPLE9BQU8sRUFBRSxLQUFLOzs7b0JBQ2pCLEtBQUEsQ0FBQSxLQUFBLGdCQUFnQixDQUFBLENBQUMsYUFBYSxDQUFBO29CQUFDLHFCQUFNLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBQTt3QkFBM0Qsc0JBQUEsY0FBK0IsU0FBNEIsRUFBRSxLQUFLLEVBQUMsRUFBQTs7aUJBQUEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCx3REFBd0Q7SUFDbEQsa0RBQVksR0FBbEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNyQztJQVpNLHdDQUFZLEdBQUcsaUNBQWlDLENBQUM7SUFhMUQsa0NBQUM7Q0FBQSxBQWZELENBQWlELGdCQUFnQixHQWVoRTtTQWZZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIEJhc2VIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuXG4vLyBUT0RPKGNyaXNiZXRvKTogY29tYmluZSB0aGVzZSB3aXRoIHRoZSBvbmVzIGluIGBtYXQtYXV0b2NvbXBsZXRlYFxuLy8gYW5kIGV4cGFuZCB0byBjb3ZlciBhbGwgc3RhdGVzIG9uY2Ugd2UgaGF2ZSBleHBlcmltZW50YWwvY29yZS5cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25IYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIGxhYmVsVGV4dD86IHN0cmluZztcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSB0aGUgYG1hdC1vcHRpb25gIGZvciBhIGBtYXQtc2VsZWN0YCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RPcHRpb25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGluZ3MgdG8gYWRkIGhlcmUgd2hlbiBhZGRpbmcgYSBjb21tb24gb3B0aW9uIGhhcm5lc3M6XG4gIC8vIC0gaXNEaXNhYmxlZFxuICAvLyAtIGlzU2VsZWN0ZWRcbiAgLy8gLSBpc0FjdGl2ZVxuICAvLyAtIGlzTXVsdGlwbGVcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNlbGVjdE9wdGlvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgdGl0bGUpID0+XG4gICAgICAgICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IGhhcm5lc3MuZ2V0VGV4dCgpLCB0aXRsZSkpO1xuICB9XG5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNlbGVjdC1wYW5lbCAubWF0LW9wdGlvbic7XG5cbiAgLyoqIENsaWNrcyB0aGUgb3B0aW9uLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgb3B0aW9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHRoZSBgbWF0LW9wdGdyb3VwYCBmb3IgYSBgbWF0LXNlbGVjdGAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0T3B0aW9uR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LW9wdGdyb3VwLWxhYmVsJyk7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zZWxlY3QtcGFuZWwgLm1hdC1vcHRncm91cCc7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNlbGVjdE9wdGlvbkdyb3VwSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbGFiZWxUZXh0Jywgb3B0aW9ucy5sYWJlbFRleHQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgdGl0bGUpID0+XG4gICAgICAgICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIHRpdGxlKSk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBvcHRpb24gZ3JvdXAncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2xhYmVsKCkpLnRleHQoKTtcbiAgfVxufVxuXG4iXX0=