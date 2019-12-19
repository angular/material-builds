/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard mat-paginator in tests. */
var MatPaginatorHarness = /** @class */ (function (_super) {
    __extends(MatPaginatorHarness, _super);
    function MatPaginatorHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._nextButton = _this.locatorFor('.mat-paginator-navigation-next');
        _this._previousButton = _this.locatorFor('.mat-paginator-navigation-previous');
        _this._firstPageButton = _this.locatorForOptional('.mat-paginator-navigation-first');
        _this._lastPageButton = _this.locatorForOptional('.mat-paginator-navigation-last');
        _this._select = _this.locatorForOptional(MatSelectHarness.with({
            ancestor: '.mat-paginator-page-size'
        }));
        _this._pageSizeFallback = _this.locatorFor('.mat-paginator-page-size-value');
        _this._rangeLabel = _this.locatorFor('.mat-paginator-range-label');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatPaginatorHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatPaginatorHarness, options);
    };
    /** Goes to the next page in the paginator. */
    MatPaginatorHarness.prototype.goToNextPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._nextButton()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Goes to the previous page in the paginator. */
    MatPaginatorHarness.prototype.goToPreviousPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._previousButton()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Goes to the first page in the paginator. */
    MatPaginatorHarness.prototype.goToFirstPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._firstPageButton()];
                    case 1:
                        button = _a.sent();
                        // The first page button isn't enabled by default so we need to check for it.
                        if (!button) {
                            throw Error('Could not find first page button inside paginator. ' +
                                'Make sure that `showFirstLastButtons` is enabled.');
                        }
                        return [2 /*return*/, button.click()];
                }
            });
        });
    };
    /** Goes to the last page in the paginator. */
    MatPaginatorHarness.prototype.goToLastPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._lastPageButton()];
                    case 1:
                        button = _a.sent();
                        // The last page button isn't enabled by default so we need to check for it.
                        if (!button) {
                            throw Error('Could not find last page button inside paginator. ' +
                                'Make sure that `showFirstLastButtons` is enabled.');
                        }
                        return [2 /*return*/, button.click()];
                }
            });
        });
    };
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    MatPaginatorHarness.prototype.setPageSize = function (size) {
        return __awaiter(this, void 0, void 0, function () {
            var select;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._select()];
                    case 1:
                        select = _a.sent();
                        // The select is only available if the `pageSizeOptions` are
                        // set to an array with more than one item.
                        if (!select) {
                            throw Error('Cannot find page size selector in paginator. ' +
                                'Make sure that the `pageSizeOptions` have been configured.');
                        }
                        return [2 /*return*/, select.clickOptions({ text: "" + size })];
                }
            });
        });
    };
    /** Gets the page size of the paginator. */
    MatPaginatorHarness.prototype.getPageSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var select, value, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._select()];
                    case 1:
                        select = _c.sent();
                        if (!select) return [3 /*break*/, 2];
                        _a = select.getValueText();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._pageSizeFallback()];
                    case 3:
                        _a = (_c.sent()).text();
                        _c.label = 4;
                    case 4:
                        value = _a;
                        _b = coerceNumberProperty;
                        return [4 /*yield*/, value];
                    case 5: return [2 /*return*/, _b.apply(void 0, [_c.sent()])];
                }
            });
        });
    };
    /** Gets the text of the range labe of the paginator. */
    MatPaginatorHarness.prototype.getRangeLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._rangeLabel()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Selector used to find paginator instances. */
    MatPaginatorHarness.hostSelector = '.mat-paginator';
    return MatPaginatorHarness;
}(ComponentHarness));
export { MatPaginatorHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3Rlc3RpbmcvcGFnaW5hdG9yLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSTNELHNFQUFzRTtBQUN0RTtJQUF5Qyx1Q0FBZ0I7SUFBekQ7UUFBQSxxRUF1RkM7UUFwRlMsaUJBQVcsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDaEUscUJBQWUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDeEUsc0JBQWdCLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDOUUscUJBQWUsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUM1RSxhQUFPLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUM5RCxRQUFRLEVBQUUsMEJBQTBCO1NBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0ksdUJBQWlCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3RFLGlCQUFXLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztJQTRFdEUsQ0FBQztJQTFFQzs7Ozs7T0FLRztJQUNJLHdCQUFJLEdBQVgsVUFBWSxPQUFxQztRQUFyQyx3QkFBQSxFQUFBLFlBQXFDO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsOENBQThDO0lBQ3hDLDBDQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBQTs0QkFBaEMsc0JBQU8sQ0FBQyxTQUF3QixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDM0M7SUFFRCxrREFBa0Q7SUFDNUMsOENBQWdCLEdBQXRCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBQTs0QkFBcEMsc0JBQU8sQ0FBQyxTQUE0QixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDL0M7SUFFRCwrQ0FBK0M7SUFDekMsMkNBQWEsR0FBbkI7Ozs7OzRCQUNpQixxQkFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBQTs7d0JBQXRDLE1BQU0sR0FBRyxTQUE2Qjt3QkFFNUMsNkVBQTZFO3dCQUM3RSxJQUFJLENBQUMsTUFBTSxFQUFFOzRCQUNYLE1BQU0sS0FBSyxDQUFDLHFEQUFxRDtnQ0FDckQsbURBQW1ELENBQUMsQ0FBQzt5QkFDbEU7d0JBRUQsc0JBQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3ZCO0lBRUQsOENBQThDO0lBQ3hDLDBDQUFZLEdBQWxCOzs7Ozs0QkFDaUIscUJBQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFBOzt3QkFBckMsTUFBTSxHQUFHLFNBQTRCO3dCQUUzQyw0RUFBNEU7d0JBQzVFLElBQUksQ0FBQyxNQUFNLEVBQUU7NEJBQ1gsTUFBTSxLQUFLLENBQUMsb0RBQW9EO2dDQUNwRCxtREFBbUQsQ0FBQyxDQUFDO3lCQUNsRTt3QkFFRCxzQkFBTyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDdkI7SUFFRDs7O09BR0c7SUFDRyx5Q0FBVyxHQUFqQixVQUFrQixJQUFZOzs7Ozs0QkFDYixxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUE3QixNQUFNLEdBQUcsU0FBb0I7d0JBRW5DLDREQUE0RDt3QkFDNUQsMkNBQTJDO3dCQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFOzRCQUNYLE1BQU0sS0FBSyxDQUFDLCtDQUErQztnQ0FDL0MsNERBQTRELENBQUMsQ0FBQzt5QkFDM0U7d0JBRUQsc0JBQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFHLElBQU0sRUFBQyxDQUFDLEVBQUM7Ozs7S0FDL0M7SUFFRCwyQ0FBMkM7SUFDckMseUNBQVcsR0FBakI7Ozs7OzRCQUNpQixxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUE3QixNQUFNLEdBQUcsU0FBb0I7NkJBQ3JCLE1BQU0sRUFBTix3QkFBTTt3QkFBRyxLQUFBLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTs7NEJBQUkscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUE7O3dCQUEvQixLQUFBLENBQUMsU0FBOEIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBOzs7d0JBQWhGLEtBQUssS0FBMkU7d0JBQy9FLEtBQUEsb0JBQW9CLENBQUE7d0JBQUMscUJBQU0sS0FBSyxFQUFBOzRCQUF2QyxzQkFBTyxrQkFBcUIsU0FBVyxFQUFDLEVBQUM7Ozs7S0FDMUM7SUFFRCx3REFBd0Q7SUFDbEQsMkNBQWEsR0FBbkI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFBOzRCQUFoQyxzQkFBTyxDQUFDLFNBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUMxQztJQXJGRCxpREFBaUQ7SUFDMUMsZ0NBQVksR0FBRyxnQkFBZ0IsQ0FBQztJQXFGekMsMEJBQUM7Q0FBQSxBQXZGRCxDQUF5QyxnQkFBZ0IsR0F1RnhEO1NBdkZZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0U2VsZWN0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGFnaW5hdG9ySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcGFnaW5hdG9yLWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcGFnaW5hdG9yIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFNlbGVjdG9yIHVzZWQgdG8gZmluZCBwYWdpbmF0b3IgaW5zdGFuY2VzLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcGFnaW5hdG9yJztcbiAgcHJpdmF0ZSBfbmV4dEJ1dHRvbiA9IHRoaXMubG9jYXRvckZvcignLm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1uZXh0Jyk7XG4gIHByaXZhdGUgX3ByZXZpb3VzQnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLXByZXZpb3VzJyk7XG4gIHByaXZhdGUgX2ZpcnN0UGFnZUJ1dHRvbiA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLWZpcnN0Jyk7XG4gIHByaXZhdGUgX2xhc3RQYWdlQnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tbGFzdCcpO1xuICBwcml2YXRlIF9zZWxlY3QgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRTZWxlY3RIYXJuZXNzLndpdGgoe1xuICAgIGFuY2VzdG9yOiAnLm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplJ1xuICB9KSk7XG4gIHByaXZhdGUgX3BhZ2VTaXplRmFsbGJhY2sgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS12YWx1ZScpO1xuICBwcml2YXRlIF9yYW5nZUxhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1yYW5nZS1sYWJlbCcpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRQYWdpbmF0b3JIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBwYWdpbmF0b3IgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUGFnaW5hdG9ySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0UGFnaW5hdG9ySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRQYWdpbmF0b3JIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHb2VzIHRvIHRoZSBuZXh0IHBhZ2UgaW4gdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ29Ub05leHRQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbmV4dEJ1dHRvbigpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdvZXMgdG8gdGhlIHByZXZpb3VzIHBhZ2UgaW4gdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ29Ub1ByZXZpb3VzUGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3ByZXZpb3VzQnV0dG9uKCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogR29lcyB0byB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnb1RvRmlyc3RQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGF3YWl0IHRoaXMuX2ZpcnN0UGFnZUJ1dHRvbigpO1xuXG4gICAgLy8gVGhlIGZpcnN0IHBhZ2UgYnV0dG9uIGlzbid0IGVuYWJsZWQgYnkgZGVmYXVsdCBzbyB3ZSBuZWVkIHRvIGNoZWNrIGZvciBpdC5cbiAgICBpZiAoIWJ1dHRvbikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGZpcnN0IHBhZ2UgYnV0dG9uIGluc2lkZSBwYWdpbmF0b3IuICcgK1xuICAgICAgICAgICAgICAgICAgJ01ha2Ugc3VyZSB0aGF0IGBzaG93Rmlyc3RMYXN0QnV0dG9uc2AgaXMgZW5hYmxlZC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICAvKiogR29lcyB0byB0aGUgbGFzdCBwYWdlIGluIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdvVG9MYXN0UGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCB0aGlzLl9sYXN0UGFnZUJ1dHRvbigpO1xuXG4gICAgLy8gVGhlIGxhc3QgcGFnZSBidXR0b24gaXNuJ3QgZW5hYmxlZCBieSBkZWZhdWx0IHNvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGl0LlxuICAgIGlmICghYnV0dG9uKSB7XG4gICAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGZpbmQgbGFzdCBwYWdlIGJ1dHRvbiBpbnNpZGUgcGFnaW5hdG9yLiAnICtcbiAgICAgICAgICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCBgc2hvd0ZpcnN0TGFzdEJ1dHRvbnNgIGlzIGVuYWJsZWQuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhZ2Ugc2l6ZSBvZiB0aGUgcGFnaW5hdG9yLlxuICAgKiBAcGFyYW0gc2l6ZSBQYWdlIHNpemUgdGhhdCBzaG91bGQgYmUgc2VsZWN0LlxuICAgKi9cbiAgYXN5bmMgc2V0UGFnZVNpemUoc2l6ZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2VsZWN0ID0gYXdhaXQgdGhpcy5fc2VsZWN0KCk7XG5cbiAgICAvLyBUaGUgc2VsZWN0IGlzIG9ubHkgYXZhaWxhYmxlIGlmIHRoZSBgcGFnZVNpemVPcHRpb25zYCBhcmVcbiAgICAvLyBzZXQgdG8gYW4gYXJyYXkgd2l0aCBtb3JlIHRoYW4gb25lIGl0ZW0uXG4gICAgaWYgKCFzZWxlY3QpIHtcbiAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgZmluZCBwYWdlIHNpemUgc2VsZWN0b3IgaW4gcGFnaW5hdG9yLiAnICtcbiAgICAgICAgICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCB0aGUgYHBhZ2VTaXplT3B0aW9uc2AgaGF2ZSBiZWVuIGNvbmZpZ3VyZWQuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdC5jbGlja09wdGlvbnMoe3RleHQ6IGAke3NpemV9YH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhZ2Ugc2l6ZSBvZiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnZXRQYWdlU2l6ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIGNvbnN0IHNlbGVjdCA9IGF3YWl0IHRoaXMuX3NlbGVjdCgpO1xuICAgIGNvbnN0IHZhbHVlID0gc2VsZWN0ID8gc2VsZWN0LmdldFZhbHVlVGV4dCgpIDogKGF3YWl0IHRoaXMuX3BhZ2VTaXplRmFsbGJhY2soKSkudGV4dCgpO1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCB2YWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgcmFuZ2UgbGFiZSBvZiB0aGUgcGFnaW5hdG9yLiAqL1xuICBhc3luYyBnZXRSYW5nZUxhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9yYW5nZUxhYmVsKCkpLnRleHQoKTtcbiAgfVxufVxuIl19