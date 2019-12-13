/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptionHarness } from './option-harness';
/** Harness for interacting with a `mat-optgroup` in tests. */
var MatOptgroupHarness = /** @class */ (function (_super) {
    __extends(MatOptgroupHarness, _super);
    function MatOptgroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-optgroup-label');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptgroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatOptgroupHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatOptgroupHarness, options)
            .addOption('labelText', options.labelText, function (harness, title) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = HarnessPredicate).stringMatches;
                    return [4 /*yield*/, harness.getLabelText()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
            }
        }); }); });
    };
    /** Gets the option group's label text. */
    MatOptgroupHarness.prototype.getLabelText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._label()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets whether the option group is disabled. */
    MatOptgroupHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-optgroup-disabled')];
                }
            });
        });
    };
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    MatOptgroupHarness.prototype.getOptions = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatOptionHarness.with(filter))()];
            });
        });
    };
    /** Selector used to locate option group instances. */
    MatOptgroupHarness.hostSelector = '.mat-optgroup';
    return MatOptgroupHarness;
}(ComponentHarness));
export { MatOptgroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3Rlc3Rpbmcvb3B0Z3JvdXAtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFeEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFHbEQsOERBQThEO0FBQzlEO0lBQXdDLHNDQUFnQjtJQUF4RDtRQUFBLHFFQW1DQztRQWhDUyxZQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztJQWdDMUQsQ0FBQztJQTlCQzs7Ozs7T0FLRztJQUNJLHVCQUFJLEdBQVgsVUFBWSxPQUFvQztRQUFoRCxpQkFLQztRQUxXLHdCQUFBLEVBQUEsWUFBb0M7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQzthQUNuRCxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQ3JDLFVBQU8sT0FBTyxFQUFFLEtBQUs7OztvQkFDakIsS0FBQSxDQUFBLEtBQUEsZ0JBQWdCLENBQUEsQ0FBQyxhQUFhLENBQUE7b0JBQUMscUJBQU0sT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFBO3dCQUEzRCxzQkFBQSxjQUErQixTQUE0QixFQUFFLEtBQUssRUFBQyxFQUFBOztpQkFBQSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELDBDQUEwQztJQUNwQyx5Q0FBWSxHQUFsQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7NEJBQTNCLHNCQUFPLENBQUMsU0FBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JDO0lBRUQsaURBQWlEO0lBQzNDLHVDQUFVLEdBQWhCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUM7Ozs7S0FDOUQ7SUFFRDs7O09BR0c7SUFDRyx1Q0FBVSxHQUFoQixVQUFpQixNQUFpQztRQUFqQyx1QkFBQSxFQUFBLFdBQWlDOzs7Z0JBQ2hELHNCQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQzs7O0tBQzVEO0lBakNELHNEQUFzRDtJQUMvQywrQkFBWSxHQUFHLGVBQWUsQ0FBQztJQWlDeEMseUJBQUM7Q0FBQSxBQW5DRCxDQUF3QyxnQkFBZ0IsR0FtQ3ZEO1NBbkNZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7T3B0Z3JvdXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9vcHRncm91cC1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRPcHRpb25IYXJuZXNzfSBmcm9tICcuL29wdGlvbi1oYXJuZXNzJztcbmltcG9ydCB7T3B0aW9uSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vb3B0aW9uLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgYG1hdC1vcHRncm91cGAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0T3B0Z3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBTZWxlY3RvciB1c2VkIHRvIGxvY2F0ZSBvcHRpb24gZ3JvdXAgaW5zdGFuY2VzLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtb3B0Z3JvdXAnO1xuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1vcHRncm91cC1sYWJlbCcpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRPcHRncm91cEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIG9wdGlvbiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRncm91cEhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0T3B0Z3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdsYWJlbFRleHQnLCBvcHRpb25zLmxhYmVsVGV4dCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCB0aXRsZSkgPT5cbiAgICAgICAgICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgdGl0bGUpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb24gZ3JvdXAncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2xhYmVsKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIG9wdGlvbiBncm91cCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LW9wdGdyb3VwLWRpc2FibGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgb3B0aW9ucyB0aGF0IGFyZSBpbnNpZGUgdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBvcHRpb25zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVyOiBPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRPcHRpb25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdE9wdGlvbkhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG59XG5cbiJdfQ==