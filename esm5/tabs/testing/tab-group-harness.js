/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatTabHarness } from './tab-harness';
/**
 * Harness for interacting with a standard mat-tab-group in tests.
 * @dynamic
 */
var MatTabGroupHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatTabGroupHarness, _super);
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
            .addOption('selectedTabLabel', options.selectedTabLabel, function (harness, label) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var selectedTab, _a, _b;
            return tslib_1.__generator(this, function (_c) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatTabHarness.with(filter))()];
            });
        });
    };
    /** Gets the selected tab of the tab group. */
    MatTabGroupHarness.prototype.getSelectedTab = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tabs, isSelected, i;
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tabs;
            return tslib_1.__generator(this, function (_a) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVDOzs7R0FHRztBQUNIO0lBQXdDLDhDQUFnQjtJQUF4RDs7SUE2Q0EsQ0FBQztJQTFDQzs7Ozs7Ozs7T0FRRztJQUNJLHVCQUFJLEdBQVgsVUFBWSxPQUFvQztRQUFoRCxpQkFNQztRQU5XLHdCQUFBLEVBQUEsWUFBb0M7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQzthQUNuRCxTQUFTLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFVBQU8sT0FBTyxFQUFFLEtBQUs7Ozs7NEJBQ3hELHFCQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBQTs7d0JBQTVDLFdBQVcsR0FBRyxTQUE4Qjt3QkFDM0MsS0FBQSxDQUFBLEtBQUEsZ0JBQWdCLENBQUEsQ0FBQyxhQUFhLENBQUE7d0JBQUMscUJBQU0sV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFBOzRCQUFsRSxzQkFBTyxjQUErQixTQUE0QixFQUFFLEtBQUssRUFBQyxFQUFDOzs7YUFDNUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELHNDQUFzQztJQUNoQyxvQ0FBTyxHQUFiLFVBQWMsTUFBOEI7UUFBOUIsdUJBQUEsRUFBQSxXQUE4Qjs7O2dCQUMxQyxzQkFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDOzs7S0FDekQ7SUFFRCw4Q0FBOEM7SUFDeEMsMkNBQWMsR0FBcEI7Ozs7OzRCQUNlLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs7d0JBQTNCLElBQUksR0FBRyxTQUFvQjt3QkFDZCxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUMsRUFBQTs7d0JBQTdELFVBQVUsR0FBRyxTQUFnRDt3QkFDbkUsS0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNwQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FDakIsc0JBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDOzZCQUNoQjt5QkFDRjt3QkFDRCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7Ozs7S0FDcEQ7SUFFRCx1Q0FBdUM7SUFDakMsc0NBQVMsR0FBZixVQUFnQixNQUE4QjtRQUE5Qix1QkFBQSxFQUFBLFdBQThCOzs7Ozs0QkFDL0IscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQWpDLElBQUksR0FBRyxTQUEwQjt3QkFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7NEJBQ2hCLE1BQU0sS0FBSyxDQUFDLHlDQUF1QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBRyxDQUFDLENBQUM7eUJBQzlFO3dCQUNELHFCQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7Ozs7O0tBQ3hCO0lBM0NNLCtCQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUE0Q3pDLHlCQUFDO0NBQUEsQUE3Q0QsQ0FBd0MsZ0JBQWdCLEdBNkN2RDtTQTdDWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYkdyb3VwSGFybmVzc0ZpbHRlcnMsIFRhYkhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RhYi1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRUYWJIYXJuZXNzfSBmcm9tICcuL3RhYi1oYXJuZXNzJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRhYi1ncm91cCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJHcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRhYi1ncm91cCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tYnV0dG9uIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSB0YWItZ3JvdXAgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYHNlbGVjdGVkVGFiTGFiZWxgIGZpbmRzIGEgdGFiLWdyb3VwIHdpdGggYSBzZWxlY3RlZCB0YWIgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiAgICAgIHNwZWNpZmllZCB0YWIgbGFiZWwuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVGFiR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJHcm91cEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VGFiR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdzZWxlY3RlZFRhYkxhYmVsJywgb3B0aW9ucy5zZWxlY3RlZFRhYkxhYmVsLCBhc3luYyAoaGFybmVzcywgbGFiZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZFRhYiA9IGF3YWl0IGhhcm5lc3MuZ2V0U2VsZWN0ZWRUYWIoKTtcbiAgICAgICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IHNlbGVjdGVkVGFiLmdldExhYmVsKCksIGxhYmVsKTtcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgdGFicyBvZiB0aGUgdGFiIGdyb3VwLiAqL1xuICBhc3luYyBnZXRUYWJzKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0VGFiSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRUYWJIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RlZCB0YWIgb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgZ2V0U2VsZWN0ZWRUYWIoKTogUHJvbWlzZTxNYXRUYWJIYXJuZXNzPiB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IHRoaXMuZ2V0VGFicygpO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBhd2FpdCBQcm9taXNlLmFsbCh0YWJzLm1hcCh0ID0+IHQuaXNTZWxlY3RlZCgpKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXNTZWxlY3RlZFtpXSkge1xuICAgICAgICByZXR1cm4gdGFic1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzZWxlY3RlZCB0YWIgY291bGQgYmUgZm91bmQuJyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhIHRhYiBpbiB0aGlzIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgc2VsZWN0VGFiKGZpbHRlcjogVGFiSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0aGlzLmdldFRhYnMoZmlsdGVyKTtcbiAgICBpZiAoIXRhYnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LXRhYiBtYXRjaGluZyBmaWx0ZXIgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICBhd2FpdCB0YWJzWzBdLnNlbGVjdCgpO1xuICB9XG59XG4iXX0=