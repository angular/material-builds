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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tabs = _this.locatorForAll(MatTabHarness);
        return _this;
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
    MatTabGroupHarness.prototype.getTabs = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._tabs()];
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
    MatTabGroupHarness.hostSelector = '.mat-tab-group';
    return MatTabGroupHarness;
}(ComponentHarness));
export { MatTabGroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1ncm91cC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVDOzs7R0FHRztBQUNIO0lBQXdDLDhDQUFnQjtJQUF4RDtRQUFBLHFFQXNDQztRQWxCUyxXQUFLLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7SUFrQnBELENBQUM7SUFuQ0M7Ozs7Ozs7O09BUUc7SUFDSSx1QkFBSSxHQUFYLFVBQVksT0FBb0M7UUFBaEQsaUJBTUM7UUFOVyx3QkFBQSxFQUFBLFlBQW9DO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUM7YUFDbkQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFPLE9BQU8sRUFBRSxLQUFLOzs7OzRCQUN4RCxxQkFBTSxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dCQUE1QyxXQUFXLEdBQUcsU0FBOEI7d0JBQzNDLEtBQUEsQ0FBQSxLQUFBLGdCQUFnQixDQUFBLENBQUMsYUFBYSxDQUFBO3dCQUFDLHFCQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBQTs0QkFBbEUsc0JBQU8sY0FBK0IsU0FBNEIsRUFBRSxLQUFLLEVBQUMsRUFBQzs7O2FBQzVFLENBQUMsQ0FBQztJQUNULENBQUM7SUFJRCxzQ0FBc0M7SUFDaEMsb0NBQU8sR0FBYjs7O2dCQUNFLHNCQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQzs7O0tBQ3JCO0lBRUQsOENBQThDO0lBQ3hDLDJDQUFjLEdBQXBCOzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUEzQixJQUFJLEdBQUcsU0FBb0I7d0JBQ2QscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDLEVBQUE7O3dCQUE3RCxVQUFVLEdBQUcsU0FBZ0Q7d0JBQ25FLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDcEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ2pCLHNCQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQzs2QkFDaEI7eUJBQ0Y7d0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzs7O0tBQ3BEO0lBcENNLCtCQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUFxQ3pDLHlCQUFDO0NBQUEsQUF0Q0QsQ0FBd0MsZ0JBQWdCLEdBc0N2RDtTQXRDWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYkdyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdGFiLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdFRhYkhhcm5lc3N9IGZyb20gJy4vdGFiLWhhcm5lc3MnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtdGFiLWdyb3VwIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYkdyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtdGFiLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSByYWRpby1idXR0b24gd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIHRhYi1ncm91cCB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgc2VsZWN0ZWRUYWJMYWJlbGAgZmluZHMgYSB0YWItZ3JvdXAgd2l0aCBhIHNlbGVjdGVkIHRhYiB0aGF0IG1hdGNoZXMgdGhlXG4gICAqICAgICAgc3BlY2lmaWVkIHRhYiBsYWJlbC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUYWJHcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRhYkdyb3VwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRUYWJHcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3NlbGVjdGVkVGFiTGFiZWwnLCBvcHRpb25zLnNlbGVjdGVkVGFiTGFiZWwsIGFzeW5jIChoYXJuZXNzLCBsYWJlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGFiID0gYXdhaXQgaGFybmVzcy5nZXRTZWxlY3RlZFRhYigpO1xuICAgICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgc2VsZWN0ZWRUYWIuZ2V0TGFiZWwoKSwgbGFiZWwpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3RhYnMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0VGFiSGFybmVzcyk7XG5cbiAgLyoqIEdldHMgYWxsIHRhYnMgb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgYXN5bmMgZ2V0VGFicygpOiBQcm9taXNlPE1hdFRhYkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl90YWJzKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0ZWQgdGFiIG9mIHRoZSB0YWIgZ3JvdXAuICovXG4gIGFzeW5jIGdldFNlbGVjdGVkVGFiKCk6IFByb21pc2U8TWF0VGFiSGFybmVzcz4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0aGlzLmdldFRhYnMoKTtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gYXdhaXQgUHJvbWlzZS5hbGwodGFicy5tYXAodCA9PiB0LmlzU2VsZWN0ZWQoKSkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGlzU2VsZWN0ZWRbaV0pIHtcbiAgICAgICAgcmV0dXJuIHRhYnNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignTm8gc2VsZWN0ZWQgdGFiIGNvdWxkIGJlIGZvdW5kLicpO1xuICB9XG59XG4iXX0=