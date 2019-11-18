/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatTabHarness } from './tab-harness';
/** Harness for interacting with a standard mat-tab-group in tests. */
var MatTabGroupHarness = /** @class */ (function (_super) {
    __extends(MatTabGroupHarness, _super);
    function MatTabGroupHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-button with
     * specific attributes.
     * @param options Options for narrowing the search
     *   - `selector` finds a tab-group whose host element matches the given selector.
     *   - `selectedTabLabel` finds a tab-group with a selected tab that matches the
     *      specified tab label.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatTabGroupHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatTabGroupHarness, options)
            .addOption('selectedTabLabel', options.selectedTabLabel, function (harness, label) { return __awaiter(_this, void 0, void 0, function () {
            var selectedTab, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, harness.getSelectedTab()];
                    case 1:
                        selectedTab = _c.sent();
                        _b = (_a = HarnessPredicate).stringMatches;
                        return [4 /*yield*/, selectedTab.getLabel()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent(), label])];
                }
            });
        }); });
    };
    /** Gets all tabs of the tab group. */
    MatTabGroupHarness.prototype.getTabs = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatTabHarness.with(filter))()];
            });
        });
    };
    /** Gets the selected tab of the tab group. */
    MatTabGroupHarness.prototype.getSelectedTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs, isSelected, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTabs()];
                    case 1:
                        tabs = _a.sent();
                        return [4 /*yield*/, Promise.all(tabs.map(function (t) { return t.isSelected(); }))];
                    case 2:
                        isSelected = _a.sent();
                        for (i = 0; i < tabs.length; i++) {
                            if (isSelected[i]) {
                                return [2 /*return*/, tabs[i]];
                            }
                        }
                        throw new Error('No selected tab could be found.');
                }
            });
        });
    };
    /** Selects a tab in this tab group. */
    MatTabGroupHarness.prototype.selectTab = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTabs(filter)];
                    case 1:
                        tabs = _a.sent();
                        if (!tabs.length) {
                            throw Error("Cannot find mat-tab matching filter " + JSON.stringify(filter));
                        }
                        return [4 /*yield*/, tabs[0].select()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MatTabGroupHarness.hostSelector = '.mat-tab-group';
    return MatTabGroupHarness;
}(ComponentHarness));
export { MatTabGroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVDLHNFQUFzRTtBQUN0RTtJQUF3QyxzQ0FBZ0I7SUFBeEQ7O0lBNkNBLENBQUM7SUExQ0M7Ozs7Ozs7O09BUUc7SUFDSSx1QkFBSSxHQUFYLFVBQVksT0FBb0M7UUFBaEQsaUJBTUM7UUFOVyx3QkFBQSxFQUFBLFlBQW9DO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUM7YUFDbkQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFPLE9BQU8sRUFBRSxLQUFLOzs7OzRCQUN4RCxxQkFBTSxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dCQUE1QyxXQUFXLEdBQUcsU0FBOEI7d0JBQzNDLEtBQUEsQ0FBQSxLQUFBLGdCQUFnQixDQUFBLENBQUMsYUFBYSxDQUFBO3dCQUFDLHFCQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBQTs0QkFBbEUsc0JBQU8sY0FBK0IsU0FBNEIsRUFBRSxLQUFLLEVBQUMsRUFBQzs7O2FBQzVFLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCxzQ0FBc0M7SUFDaEMsb0NBQU8sR0FBYixVQUFjLE1BQThCO1FBQTlCLHVCQUFBLEVBQUEsV0FBOEI7OztnQkFDMUMsc0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQzs7O0tBQ3pEO0lBRUQsOENBQThDO0lBQ3hDLDJDQUFjLEdBQXBCOzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUEzQixJQUFJLEdBQUcsU0FBb0I7d0JBQ2QscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDLEVBQUE7O3dCQUE3RCxVQUFVLEdBQUcsU0FBZ0Q7d0JBQ25FLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDcEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ2pCLHNCQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQzs2QkFDaEI7eUJBQ0Y7d0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzs7O0tBQ3BEO0lBRUQsdUNBQXVDO0lBQ2pDLHNDQUFTLEdBQWYsVUFBZ0IsTUFBOEI7UUFBOUIsdUJBQUEsRUFBQSxXQUE4Qjs7Ozs7NEJBQy9CLHFCQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUFqQyxJQUFJLEdBQUcsU0FBMEI7d0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOzRCQUNoQixNQUFNLEtBQUssQ0FBQyx5Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUcsQ0FBQyxDQUFDO3lCQUM5RTt3QkFDRCxxQkFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzs7OztLQUN4QjtJQTNDTSwrQkFBWSxHQUFHLGdCQUFnQixDQUFDO0lBNEN6Qyx5QkFBQztDQUFBLEFBN0NELENBQXdDLGdCQUFnQixHQTZDdkQ7U0E3Q1ksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtUYWJHcm91cEhhcm5lc3NGaWx0ZXJzLCBUYWJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90YWItaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0VGFiSGFybmVzc30gZnJvbSAnLi90YWItaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRhYi1ncm91cCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJHcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRhYi1ncm91cCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tYnV0dG9uIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSB0YWItZ3JvdXAgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYHNlbGVjdGVkVGFiTGFiZWxgIGZpbmRzIGEgdGFiLWdyb3VwIHdpdGggYSBzZWxlY3RlZCB0YWIgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiAgICAgIHNwZWNpZmllZCB0YWIgbGFiZWwuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVGFiR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJHcm91cEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VGFiR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdzZWxlY3RlZFRhYkxhYmVsJywgb3B0aW9ucy5zZWxlY3RlZFRhYkxhYmVsLCBhc3luYyAoaGFybmVzcywgbGFiZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZFRhYiA9IGF3YWl0IGhhcm5lc3MuZ2V0U2VsZWN0ZWRUYWIoKTtcbiAgICAgICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IHNlbGVjdGVkVGFiLmdldExhYmVsKCksIGxhYmVsKTtcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgdGFicyBvZiB0aGUgdGFiIGdyb3VwLiAqL1xuICBhc3luYyBnZXRUYWJzKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0VGFiSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRUYWJIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RlZCB0YWIgb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgZ2V0U2VsZWN0ZWRUYWIoKTogUHJvbWlzZTxNYXRUYWJIYXJuZXNzPiB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IHRoaXMuZ2V0VGFicygpO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBhd2FpdCBQcm9taXNlLmFsbCh0YWJzLm1hcCh0ID0+IHQuaXNTZWxlY3RlZCgpKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXNTZWxlY3RlZFtpXSkge1xuICAgICAgICByZXR1cm4gdGFic1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzZWxlY3RlZCB0YWIgY291bGQgYmUgZm91bmQuJyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhIHRhYiBpbiB0aGlzIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgc2VsZWN0VGFiKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0aGlzLmdldFRhYnMoZmlsdGVyKTtcbiAgICBpZiAoIXRhYnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LXRhYiBtYXRjaGluZyBmaWx0ZXIgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICBhd2FpdCB0YWJzWzBdLnNlbGVjdCgpO1xuICB9XG59XG4iXX0=