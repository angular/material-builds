/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatCellHarness, MatHeaderCellHarness, MatFooterCellHarness } from './cell-harness';
/** Harness for interacting with a standard Angular Material table row. */
var MatRowHarness = /** @class */ (function (_super) {
    __extends(MatRowHarness, _super);
    function MatRowHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatRowHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatRowHarness, options);
    };
    /** Gets a list of `MatCellHarness` for all cells in the row. */
    MatRowHarness.prototype.getCells = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatCellHarness.with(filter))()];
            });
        });
    };
    /** Gets the text of the cells in the row. */
    MatRowHarness.prototype.getCellTextByIndex = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getCellTextByIndex(this, filter)];
            });
        });
    };
    /** Gets the text inside the row organized by columns. */
    MatRowHarness.prototype.getCellTextByColumnName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getCellTextByColumnName(this)];
            });
        });
    };
    /** The selector for the host element of a `MatRowHarness` instance. */
    MatRowHarness.hostSelector = '.mat-row';
    return MatRowHarness;
}(ComponentHarness));
export { MatRowHarness };
/** Harness for interacting with a standard Angular Material table header row. */
var MatHeaderRowHarness = /** @class */ (function (_super) {
    __extends(MatHeaderRowHarness, _super);
    function MatHeaderRowHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatHeaderRowHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatHeaderRowHarness, options);
    };
    /** Gets a list of `MatHeaderCellHarness` for all cells in the row. */
    MatHeaderRowHarness.prototype.getCells = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatHeaderCellHarness.with(filter))()];
            });
        });
    };
    /** Gets the text of the cells in the header row. */
    MatHeaderRowHarness.prototype.getCellTextByIndex = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getCellTextByIndex(this, filter)];
            });
        });
    };
    /** Gets the text inside the header row organized by columns. */
    MatHeaderRowHarness.prototype.getCellTextByColumnName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getCellTextByColumnName(this)];
            });
        });
    };
    /** The selector for the host element of a `MatHeaderRowHarness` instance. */
    MatHeaderRowHarness.hostSelector = '.mat-header-row';
    return MatHeaderRowHarness;
}(ComponentHarness));
export { MatHeaderRowHarness };
/** Harness for interacting with a standard Angular Material table footer row. */
var MatFooterRowHarness = /** @class */ (function (_super) {
    __extends(MatFooterRowHarness, _super);
    function MatFooterRowHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer row cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatFooterRowHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatFooterRowHarness, options);
    };
    /** Gets a list of `MatFooterCellHarness` for all cells in the row. */
    MatFooterRowHarness.prototype.getCells = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatFooterCellHarness.with(filter))()];
            });
        });
    };
    /** Gets the text of the cells in the footer row. */
    MatFooterRowHarness.prototype.getCellTextByIndex = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getCellTextByIndex(this, filter)];
            });
        });
    };
    /** Gets the text inside the footer row organized by columns. */
    MatFooterRowHarness.prototype.getCellTextByColumnName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getCellTextByColumnName(this)];
            });
        });
    };
    /** The selector for the host element of a `MatFooterRowHarness` instance. */
    MatFooterRowHarness.hostSelector = '.mat-footer-row';
    return MatFooterRowHarness;
}(ComponentHarness));
export { MatFooterRowHarness };
function getCellTextByIndex(harness, filter) {
    return __awaiter(this, void 0, void 0, function () {
        var cells;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.getCells(filter)];
                case 1:
                    cells = _a.sent();
                    return [2 /*return*/, Promise.all(cells.map(function (cell) { return cell.getText(); }))];
            }
        });
    });
}
function getCellTextByColumnName(harness) {
    return __awaiter(this, void 0, void 0, function () {
        var output, cells, cellsData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = {};
                    return [4 /*yield*/, harness.getCells()];
                case 1:
                    cells = _a.sent();
                    return [4 /*yield*/, Promise.all(cells.map(function (cell) {
                            return Promise.all([cell.getColumnName(), cell.getText()]);
                        }))];
                case 2:
                    cellsData = _a.sent();
                    cellsData.forEach(function (_a) {
                        var _b = __read(_a, 2), columnName = _b[0], text = _b[1];
                        return output[columnName] = text;
                    });
                    return [2 /*return*/, output];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGVzdGluZy9yb3ctaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFeEUsT0FBTyxFQUFDLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTzFGLDBFQUEwRTtBQUMxRTtJQUFtQyxpQ0FBZ0I7SUFBbkQ7O0lBMkJBLENBQUM7SUF2QkM7Ozs7T0FJRztJQUNJLGtCQUFJLEdBQVgsVUFBWSxPQUErQjtRQUEvQix3QkFBQSxFQUFBLFlBQStCO1FBQ3pDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGdFQUFnRTtJQUMxRCxnQ0FBUSxHQUFkLFVBQWUsTUFBK0I7UUFBL0IsdUJBQUEsRUFBQSxXQUErQjs7O2dCQUM1QyxzQkFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDOzs7S0FDMUQ7SUFFRCw2Q0FBNkM7SUFDdkMsMENBQWtCLEdBQXhCLFVBQXlCLE1BQStCO1FBQS9CLHVCQUFBLEVBQUEsV0FBK0I7OztnQkFDdEQsc0JBQU8sa0JBQWtCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFDOzs7S0FDekM7SUFFRCx5REFBeUQ7SUFDbkQsK0NBQXVCLEdBQTdCOzs7Z0JBQ0Usc0JBQU8sdUJBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUM7OztLQUN0QztJQXpCRCx1RUFBdUU7SUFDaEUsMEJBQVksR0FBRyxVQUFVLENBQUM7SUF5Qm5DLG9CQUFDO0NBQUEsQUEzQkQsQ0FBbUMsZ0JBQWdCLEdBMkJsRDtTQTNCWSxhQUFhO0FBNkIxQixpRkFBaUY7QUFDakY7SUFBeUMsdUNBQWdCO0lBQXpEOztJQTRCQSxDQUFDO0lBeEJDOzs7OztPQUtHO0lBQ0ksd0JBQUksR0FBWCxVQUFZLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFDekMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxzRUFBc0U7SUFDaEUsc0NBQVEsR0FBZCxVQUFlLE1BQStCO1FBQS9CLHVCQUFBLEVBQUEsV0FBK0I7OztnQkFDNUMsc0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDOzs7S0FDaEU7SUFFRCxvREFBb0Q7SUFDOUMsZ0RBQWtCLEdBQXhCLFVBQXlCLE1BQStCO1FBQS9CLHVCQUFBLEVBQUEsV0FBK0I7OztnQkFDdEQsc0JBQU8sa0JBQWtCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFDOzs7S0FDekM7SUFFRCxnRUFBZ0U7SUFDMUQscURBQXVCLEdBQTdCOzs7Z0JBQ0Usc0JBQU8sdUJBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUM7OztLQUN0QztJQTFCRCw2RUFBNkU7SUFDdEUsZ0NBQVksR0FBRyxpQkFBaUIsQ0FBQztJQTBCMUMsMEJBQUM7Q0FBQSxBQTVCRCxDQUF5QyxnQkFBZ0IsR0E0QnhEO1NBNUJZLG1CQUFtQjtBQStCaEMsaUZBQWlGO0FBQ2pGO0lBQXlDLHVDQUFnQjtJQUF6RDs7SUE0QkEsQ0FBQztJQXhCQzs7Ozs7T0FLRztJQUNJLHdCQUFJLEdBQVgsVUFBWSxPQUErQjtRQUEvQix3QkFBQSxFQUFBLFlBQStCO1FBQ3pDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsc0VBQXNFO0lBQ2hFLHNDQUFRLEdBQWQsVUFBZSxNQUErQjtRQUEvQix1QkFBQSxFQUFBLFdBQStCOzs7Z0JBQzVDLHNCQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQzs7O0tBQ2hFO0lBRUQsb0RBQW9EO0lBQzlDLGdEQUFrQixHQUF4QixVQUF5QixNQUErQjtRQUEvQix1QkFBQSxFQUFBLFdBQStCOzs7Z0JBQ3RELHNCQUFPLGtCQUFrQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBQzs7O0tBQ3pDO0lBRUQsZ0VBQWdFO0lBQzFELHFEQUF1QixHQUE3Qjs7O2dCQUNFLHNCQUFPLHVCQUF1QixDQUFDLElBQUksQ0FBQyxFQUFDOzs7S0FDdEM7SUExQkQsNkVBQTZFO0lBQ3RFLGdDQUFZLEdBQUcsaUJBQWlCLENBQUM7SUEwQjFDLDBCQUFDO0NBQUEsQUE1QkQsQ0FBeUMsZ0JBQWdCLEdBNEJ4RDtTQTVCWSxtQkFBbUI7QUErQmhDLFNBQWUsa0JBQWtCLENBQUMsT0FFakMsRUFBRSxNQUEwQjs7Ozs7d0JBQ2IscUJBQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBQTs7b0JBQXRDLEtBQUssR0FBRyxTQUE4QjtvQkFDNUMsc0JBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDLEVBQUM7Ozs7Q0FDdkQ7QUFFRCxTQUFlLHVCQUF1QixDQUFDLE9BRXRDOzs7Ozs7b0JBQ08sTUFBTSxHQUE2QixFQUFFLENBQUM7b0JBQzlCLHFCQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQTs7b0JBQWhDLEtBQUssR0FBRyxTQUF3QjtvQkFDcEIscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTs0QkFDaEQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzdELENBQUMsQ0FBQyxDQUFDLEVBQUE7O29CQUZHLFNBQVMsR0FBRyxTQUVmO29CQUNILFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFrQjs0QkFBbEIsa0JBQWtCLEVBQWpCLGtCQUFVLEVBQUUsWUFBSTt3QkFBTSxPQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJO29CQUF6QixDQUF5QixDQUFDLENBQUM7b0JBQ3JFLHNCQUFPLE1BQU0sRUFBQzs7OztDQUNmIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtSb3dIYXJuZXNzRmlsdGVycywgQ2VsbEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RhYmxlLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdENlbGxIYXJuZXNzLCBNYXRIZWFkZXJDZWxsSGFybmVzcywgTWF0Rm9vdGVyQ2VsbEhhcm5lc3N9IGZyb20gJy4vY2VsbC1oYXJuZXNzJztcblxuLyoqIFRleHQgZXh0cmFjdGVkIGZyb20gYSB0YWJsZSByb3cgb3JnYW5pemVkIGJ5IGNvbHVtbnMuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFJvd0hhcm5lc3NDb2x1bW5zVGV4dCB7XG4gIFtjb2x1bW5OYW1lOiBzdHJpbmddOiBzdHJpbmc7XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0YWJsZSByb3cuICovXG5leHBvcnQgY2xhc3MgTWF0Um93SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFJvd0hhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcm93JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWJsZSByb3cgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJvd0hhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Um93SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGxpc3Qgb2YgYE1hdENlbGxIYXJuZXNzYCBmb3IgYWxsIGNlbGxzIGluIHRoZSByb3cuICovXG4gIGFzeW5jIGdldENlbGxzKGZpbHRlcjogQ2VsbEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENlbGxIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdENlbGxIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBjZWxscyBpbiB0aGUgcm93LiAqL1xuICBhc3luYyBnZXRDZWxsVGV4dEJ5SW5kZXgoZmlsdGVyOiBDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFRleHRCeUluZGV4KHRoaXMsIGZpbHRlcik7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIHJvdyBvcmdhbml6ZWQgYnkgY29sdW1ucy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKTogUHJvbWlzZTxNYXRSb3dIYXJuZXNzQ29sdW1uc1RleHQ+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUodGhpcyk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGhlYWRlciByb3cuICovXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyUm93SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEhlYWRlclJvd0hhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtaGVhZGVyLXJvdyc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yXG4gICAqIGEgdGFibGUgaGVhZGVyIHJvdyB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0SGVhZGVyUm93SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRIZWFkZXJSb3dIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgbGlzdCBvZiBgTWF0SGVhZGVyQ2VsbEhhcm5lc3NgIGZvciBhbGwgY2VsbHMgaW4gdGhlIHJvdy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbHMoZmlsdGVyOiBDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0SGVhZGVyQ2VsbEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0SGVhZGVyQ2VsbEhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgb2YgdGhlIGNlbGxzIGluIHRoZSBoZWFkZXIgcm93LiAqL1xuICBhc3luYyBnZXRDZWxsVGV4dEJ5SW5kZXgoZmlsdGVyOiBDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFRleHRCeUluZGV4KHRoaXMsIGZpbHRlcik7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIGhlYWRlciByb3cgb3JnYW5pemVkIGJ5IGNvbHVtbnMuICovXG4gIGFzeW5jIGdldENlbGxUZXh0QnlDb2x1bW5OYW1lKCk6IFByb21pc2U8TWF0Um93SGFybmVzc0NvbHVtbnNUZXh0PiB7XG4gICAgcmV0dXJuIGdldENlbGxUZXh0QnlDb2x1bW5OYW1lKHRoaXMpO1xuICB9XG59XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGZvb3RlciByb3cuICovXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyUm93SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEZvb3RlclJvd0hhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZm9vdGVyLXJvdyc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yXG4gICAqIGEgdGFibGUgZm9vdGVyIHJvdyBjZWxsIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSb3dIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRGb290ZXJSb3dIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEZvb3RlclJvd0hhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBsaXN0IG9mIGBNYXRGb290ZXJDZWxsSGFybmVzc2AgZm9yIGFsbCBjZWxscyBpbiB0aGUgcm93LiAqL1xuICBhc3luYyBnZXRDZWxscyhmaWx0ZXI6IENlbGxIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRGb290ZXJDZWxsSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRGb290ZXJDZWxsSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgY2VsbHMgaW4gdGhlIGZvb3RlciByb3cuICovXG4gIGFzeW5jIGdldENlbGxUZXh0QnlJbmRleChmaWx0ZXI6IENlbGxIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiBnZXRDZWxsVGV4dEJ5SW5kZXgodGhpcywgZmlsdGVyKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgZm9vdGVyIHJvdyBvcmdhbml6ZWQgYnkgY29sdW1ucy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKTogUHJvbWlzZTxNYXRSb3dIYXJuZXNzQ29sdW1uc1RleHQ+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUodGhpcyk7XG4gIH1cbn1cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRDZWxsVGV4dEJ5SW5kZXgoaGFybmVzczoge1xuICBnZXRDZWxsczogKGZpbHRlcj86IENlbGxIYXJuZXNzRmlsdGVycykgPT4gUHJvbWlzZTxNYXRDZWxsSGFybmVzc1tdPlxufSwgZmlsdGVyOiBDZWxsSGFybmVzc0ZpbHRlcnMpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gIGNvbnN0IGNlbGxzID0gYXdhaXQgaGFybmVzcy5nZXRDZWxscyhmaWx0ZXIpO1xuICByZXR1cm4gUHJvbWlzZS5hbGwoY2VsbHMubWFwKGNlbGwgPT4gY2VsbC5nZXRUZXh0KCkpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoaGFybmVzczoge1xuICBnZXRDZWxsczogKCkgPT4gUHJvbWlzZTxNYXRDZWxsSGFybmVzc1tdPlxufSk6IFByb21pc2U8TWF0Um93SGFybmVzc0NvbHVtbnNUZXh0PiB7XG4gIGNvbnN0IG91dHB1dDogTWF0Um93SGFybmVzc0NvbHVtbnNUZXh0ID0ge307XG4gIGNvbnN0IGNlbGxzID0gYXdhaXQgaGFybmVzcy5nZXRDZWxscygpO1xuICBjb25zdCBjZWxsc0RhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChjZWxscy5tYXAoY2VsbCA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtjZWxsLmdldENvbHVtbk5hbWUoKSwgY2VsbC5nZXRUZXh0KCldKTtcbiAgfSkpO1xuICBjZWxsc0RhdGEuZm9yRWFjaCgoW2NvbHVtbk5hbWUsIHRleHRdKSA9PiBvdXRwdXRbY29sdW1uTmFtZV0gPSB0ZXh0KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cbiJdfQ==