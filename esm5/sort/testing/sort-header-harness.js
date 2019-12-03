/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material sort header in tests. */
var MatSortHeaderHarness = /** @class */ (function (_super) {
    __extends(MatSortHeaderHarness, _super);
    function MatSortHeaderHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._button = _this.locatorFor('.mat-sort-header-button');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    MatSortHeaderHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSortHeaderHarness, options)
            .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabel(), label); })
            .addOption('sortDirection', options.sortDirection, function (harness, sortDirection) {
            return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
        });
    };
    /** Gets the label of the sort header. */
    MatSortHeaderHarness.prototype.getLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the sorting direction of the header. */
    MatSortHeaderHarness.prototype.getSortDirection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, ariaSort;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.getAttribute('aria-sort')];
                    case 2:
                        ariaSort = _a.sent();
                        if (ariaSort === 'ascending') {
                            return [2 /*return*/, 'asc'];
                        }
                        else if (ariaSort === 'descending') {
                            return [2 /*return*/, 'desc'];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    /** Gets the aria-label of the sort header. */
    MatSortHeaderHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /** Gets whether the sort header is currently being sorted by. */
    MatSortHeaderHarness.prototype.isActive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortDirection()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    /** Whether the sort header is disabled. */
    MatSortHeaderHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1:
                        button = _a.sent();
                        return [4 /*yield*/, button.getAttribute('disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) != null];
                }
            });
        });
    };
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    MatSortHeaderHarness.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    MatSortHeaderHarness.hostSelector = '.mat-sort-header';
    return MatSortHeaderHarness;
}(ComponentHarness));
export { MatSortHeaderHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3Rlc3Rpbmcvc29ydC1oZWFkZXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFJeEUscUZBQXFGO0FBQ3JGO0lBQTBDLHdDQUFnQjtJQUExRDtRQUFBLHFFQXdEQztRQXREUyxhQUFPLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztJQXNEL0QsQ0FBQztJQXBEQzs7O09BR0c7SUFDSSx5QkFBSSxHQUFYLFVBQVksT0FBc0M7UUFBdEMsd0JBQUEsRUFBQSxZQUFzQztRQUNoRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDO2FBQ3JELFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsVUFBQyxPQUFPLEVBQUUsS0FBSyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBekQsQ0FBeUQsQ0FBQzthQUNqRixTQUFTLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBQyxPQUFPLEVBQUUsYUFBYTtZQUN4RSxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCx5Q0FBeUM7SUFDbkMsdUNBQVEsR0FBZDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7NEJBQTVCLHNCQUFPLENBQUMsU0FBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3RDO0lBRUQsZ0RBQWdEO0lBQzFDLCtDQUFnQixHQUF0Qjs7Ozs7NEJBQ2UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBeEIsSUFBSSxHQUFHLFNBQWlCO3dCQUNiLHFCQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUE7O3dCQUEvQyxRQUFRLEdBQUcsU0FBb0M7d0JBRXJELElBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTs0QkFDNUIsc0JBQU8sS0FBSyxFQUFDO3lCQUNkOzZCQUFNLElBQUksUUFBUSxLQUFLLFlBQVksRUFBRTs0QkFDcEMsc0JBQU8sTUFBTSxFQUFDO3lCQUNmO3dCQUVELHNCQUFPLEVBQUUsRUFBQzs7OztLQUNYO0lBRUQsOENBQThDO0lBQ3hDLDJDQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBNUIsc0JBQU8sQ0FBQyxTQUFvQixDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFDOzs7O0tBQzFEO0lBRUQsaUVBQWlFO0lBQzNELHVDQUFRLEdBQWQ7Ozs7NEJBQ1kscUJBQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUE7NEJBQXZDLHNCQUFPLENBQUMsQ0FBQyxDQUFDLFNBQTZCLENBQUMsRUFBQzs7OztLQUMxQztJQUVELDJDQUEyQztJQUNyQyx5Q0FBVSxHQUFoQjs7Ozs7NEJBQ2lCLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs7d0JBQTdCLE1BQU0sR0FBRyxTQUFvQjt3QkFDM0IscUJBQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBQTs0QkFBN0Msc0JBQU8sQ0FBQyxTQUFxQyxDQUFDLElBQUksSUFBSSxFQUFDOzs7O0tBQ3hEO0lBRUQsOEZBQThGO0lBQ3hGLG9DQUFLLEdBQVg7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUNwQztJQXRETSxpQ0FBWSxHQUFHLGtCQUFrQixDQUFDO0lBdUQzQywyQkFBQztDQUFBLEFBeERELENBQTBDLGdCQUFnQixHQXdEekQ7U0F4RFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zb3J0JztcbmltcG9ydCB7U29ydEhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NvcnQtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHNvcnQgaGVhZGVyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zb3J0LWhlYWRlcic7XG4gIHByaXZhdGUgX2J1dHRvbiA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zb3J0LWhlYWRlci1idXR0b24nKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvXG4gICAqIHNlYXJjaCBmb3IgYSBzb3J0IGhlYWRlciB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTb3J0SGVhZGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U29ydEhlYWRlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U29ydEhlYWRlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWwoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKCdzb3J0RGlyZWN0aW9uJywgb3B0aW9ucy5zb3J0RGlyZWN0aW9uLCAoaGFybmVzcywgc29ydERpcmVjdGlvbikgPT4ge1xuICAgICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRTb3J0RGlyZWN0aW9uKCksIHNvcnREaXJlY3Rpb24pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgc29ydCBoZWFkZXIuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNvcnRpbmcgZGlyZWN0aW9uIG9mIHRoZSBoZWFkZXIuICovXG4gIGFzeW5jIGdldFNvcnREaXJlY3Rpb24oKTogUHJvbWlzZTxTb3J0RGlyZWN0aW9uPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IGFyaWFTb3J0ID0gYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc29ydCcpO1xuXG4gICAgaWYgKGFyaWFTb3J0ID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgcmV0dXJuICdhc2MnO1xuICAgIH0gZWxzZSBpZiAoYXJpYVNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgcmV0dXJuICdkZXNjJztcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbCBvZiB0aGUgc29ydCBoZWFkZXIuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBzb3J0IGhlYWRlciBpcyBjdXJyZW50bHkgYmVpbmcgc29ydGVkIGJ5LiAqL1xuICBhc3luYyBpc0FjdGl2ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISEoYXdhaXQgdGhpcy5nZXRTb3J0RGlyZWN0aW9uKCkpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNvcnQgaGVhZGVyIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGF3YWl0IHRoaXMuX2J1dHRvbigpO1xuICAgIHJldHVybiAoYXdhaXQgYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgIT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBDbGlja3MgdGhlIGhlYWRlciB0byBjaGFuZ2UgaXRzIHNvcnRpbmcgZGlyZWN0aW9uLiBPbmx5IHdvcmtzIGlmIHRoZSBoZWFkZXIgaXMgZW5hYmxlZC4gKi9cbiAgYXN5bmMgY2xpY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxufVxuIl19