/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatSortHeaderHarness } from './sort-header-harness';
/** Harness for interacting with a standard `mat-sort` in tests. */
var MatSortHarness = /** @class */ (function (_super) {
    __extends(MatSortHarness, _super);
    function MatSortHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSortHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSortHarness, options);
    };
    /** Gets all of the sort headers in the `mat-sort`. */
    MatSortHarness.prototype.getSortHeaders = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatSortHeaderHarness.with(filter))()];
            });
        });
    };
    /** Gets the selected header in the `mat-sort`. */
    MatSortHarness.prototype.getActiveHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headers, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortHeaders()];
                    case 1:
                        headers = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < headers.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, headers[i].isActive()];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, headers[i]];
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    MatSortHarness.hostSelector = '.mat-sort';
    return MatSortHarness;
}(ComponentHarness));
export { MatSortHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NvcnQvdGVzdGluZy9zb3J0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTNELG1FQUFtRTtBQUNuRTtJQUFvQyxrQ0FBZ0I7SUFBcEQ7O0lBMkJBLENBQUM7SUF4QkM7Ozs7T0FJRztJQUNJLG1CQUFJLEdBQVgsVUFBWSxPQUFnQztRQUFoQyx3QkFBQSxFQUFBLFlBQWdDO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHNEQUFzRDtJQUNoRCx1Q0FBYyxHQUFwQixVQUFxQixNQUFxQztRQUFyQyx1QkFBQSxFQUFBLFdBQXFDOzs7Z0JBQ3hELHNCQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQzs7O0tBQ2hFO0lBRUQsa0RBQWtEO0lBQzVDLHdDQUFlLEdBQXJCOzs7Ozs0QkFDa0IscUJBQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFBOzt3QkFBckMsT0FBTyxHQUFHLFNBQTJCO3dCQUNsQyxDQUFDLEdBQUcsQ0FBQzs7OzZCQUFFLENBQUEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7d0JBQzVCLHFCQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQTs7d0JBQS9CLElBQUksU0FBMkIsRUFBRTs0QkFDL0Isc0JBQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDO3lCQUNuQjs7O3dCQUhpQyxDQUFDLEVBQUUsQ0FBQTs7NEJBS3ZDLHNCQUFPLElBQUksRUFBQzs7OztLQUNiO0lBekJNLDJCQUFZLEdBQUcsV0FBVyxDQUFDO0lBMEJwQyxxQkFBQztDQUFBLEFBM0JELENBQW9DLGdCQUFnQixHQTJCbkQ7U0EzQlksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7U29ydEhhcm5lc3NGaWx0ZXJzLCBTb3J0SGVhZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc29ydC1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRTb3J0SGVhZGVySGFybmVzc30gZnJvbSAnLi9zb3J0LWhlYWRlci1oYXJuZXNzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBgbWF0LXNvcnRgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNvcnRIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zb3J0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgbWF0LXNvcnRgIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU29ydEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNvcnRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNvcnRIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgc29ydCBoZWFkZXJzIGluIHRoZSBgbWF0LXNvcnRgLiAqL1xuICBhc3luYyBnZXRTb3J0SGVhZGVycyhmaWx0ZXI6IFNvcnRIZWFkZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRTb3J0SGVhZGVySGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRTb3J0SGVhZGVySGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0ZWQgaGVhZGVyIGluIHRoZSBgbWF0LXNvcnRgLiAqL1xuICBhc3luYyBnZXRBY3RpdmVIZWFkZXIoKTogUHJvbWlzZTxNYXRTb3J0SGVhZGVySGFybmVzc3xudWxsPiB7XG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IHRoaXMuZ2V0U29ydEhlYWRlcnMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhd2FpdCBoZWFkZXJzW2ldLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgcmV0dXJuIGhlYWRlcnNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=