/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatRowHarness, MatHeaderRowHarness, MatFooterRowHarness } from './row-harness';
/** Harness for interacting with a standard mat-table in tests. */
var MatTableHarness = /** @class */ (function (_super) {
    __extends(MatTableHarness, _super);
    function MatTableHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatTableHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatTableHarness, options);
    };
    /** Gets all of the header rows in a table. */
    MatTableHarness.prototype.getHeaderRows = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatHeaderRowHarness.with(filter))()];
            });
        });
    };
    /** Gets all of the regular data rows in a table. */
    MatTableHarness.prototype.getRows = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatRowHarness.with(filter))()];
            });
        });
    };
    /** Gets all of the footer rows in a table. */
    MatTableHarness.prototype.getFooterRows = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatFooterRowHarness.with(filter))()];
            });
        });
    };
    /** Gets the text inside the entire table organized by rows. */
    MatTableHarness.prototype.getCellTextByIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRows()];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, Promise.all(rows.map(function (row) { return row.getCellTextByIndex(); }))];
                }
            });
        });
    };
    /** Gets the text inside the entire table organized by columns. */
    MatTableHarness.prototype.getCellTextByColumnName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, headerRows, footerRows, dataRows, text, _b, headerData, footerData, rowsData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.getHeaderRows(),
                            this.getFooterRows(),
                            this.getRows()
                        ])];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 3]), headerRows = _a[0], footerRows = _a[1], dataRows = _a[2];
                        text = {};
                        return [4 /*yield*/, Promise.all([
                                Promise.all(headerRows.map(function (row) { return getRowData(row); })),
                                Promise.all(footerRows.map(function (row) { return getRowData(row); })),
                                Promise.all(dataRows.map(function (row) { return getRowData(row); })),
                            ])];
                    case 2:
                        _b = __read.apply(void 0, [_c.sent(), 3]), headerData = _b[0], footerData = _b[1], rowsData = _b[2];
                        rowsData.forEach(function (cells) {
                            cells.forEach(function (_a) {
                                var _b = __read(_a, 2), columnName = _b[0], cellText = _b[1];
                                if (!text[columnName]) {
                                    text[columnName] = {
                                        headerText: getCellTextsByColumn(headerData, columnName),
                                        footerText: getCellTextsByColumn(footerData, columnName),
                                        text: []
                                    };
                                }
                                text[columnName].text.push(cellText);
                            });
                        });
                        return [2 /*return*/, text];
                }
            });
        });
    };
    /** The selector for the host element of a `MatTableHarness` instance. */
    MatTableHarness.hostSelector = '.mat-table';
    return MatTableHarness;
}(ComponentHarness));
export { MatTableHarness };
/** Utility to extract the column names and text from all of the cells in a row. */
function getRowData(row) {
    return __awaiter(this, void 0, void 0, function () {
        var cells;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, row.getCells()];
                case 1:
                    cells = _a.sent();
                    return [2 /*return*/, Promise.all(cells.map(function (cell) { return Promise.all([cell.getColumnName(), cell.getText()]); }))];
            }
        });
    });
}
/** Extracts the text of cells only under a particular column. */
function getCellTextsByColumn(rowsData, column) {
    var columnTexts = [];
    rowsData.forEach(function (cells) {
        cells.forEach(function (_a) {
            var _b = __read(_a, 2), columnName = _b[0], cellText = _b[1];
            if (columnName === column) {
                columnTexts.push(cellText);
            }
        });
    });
    return columnTexts;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS90ZXN0aW5nL3RhYmxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhFLE9BQU8sRUFBQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFXdEYsa0VBQWtFO0FBQ2xFO0lBQXFDLG1DQUFnQjtJQUFyRDs7SUFpRUEsQ0FBQztJQTdEQzs7OztPQUlHO0lBQ0ksb0JBQUksR0FBWCxVQUFZLE9BQWlDO1FBQWpDLHdCQUFBLEVBQUEsWUFBaUM7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsOENBQThDO0lBQ3hDLHVDQUFhLEdBQW5CLFVBQW9CLE1BQThCO1FBQTlCLHVCQUFBLEVBQUEsV0FBOEI7OztnQkFDaEQsc0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDOzs7S0FDL0Q7SUFFRCxvREFBb0Q7SUFDOUMsaUNBQU8sR0FBYixVQUFjLE1BQThCO1FBQTlCLHVCQUFBLEVBQUEsV0FBOEI7OztnQkFDMUMsc0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQzs7O0tBQ3pEO0lBRUQsOENBQThDO0lBQ3hDLHVDQUFhLEdBQW5CLFVBQW9CLE1BQThCO1FBQTlCLHVCQUFBLEVBQUEsV0FBOEI7OztnQkFDaEQsc0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIs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Q0FBQyxFQUFuRCxDQUFtRCxDQUFDLENBQUMsRUFBQzs7OztDQUM1RjtBQUdELGlFQUFpRTtBQUNqRSxTQUFTLG9CQUFvQixDQUFDLFFBQThCLEVBQUUsTUFBYztJQUMxRSxJQUFNLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFFakMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7UUFDcEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQXNCO2dCQUF0QixrQkFBc0IsRUFBckIsa0JBQVUsRUFBRSxnQkFBUTtZQUNsQyxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7Z0JBQ3pCLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7VGFibGVIYXJuZXNzRmlsdGVycywgUm93SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdGFibGUtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0Um93SGFybmVzcywgTWF0SGVhZGVyUm93SGFybmVzcywgTWF0Rm9vdGVyUm93SGFybmVzc30gZnJvbSAnLi9yb3ctaGFybmVzcyc7XG5cbi8qKiBUZXh0IGV4dHJhY3RlZCBmcm9tIGEgdGFibGUgb3JnYW5pemVkIGJ5IGNvbHVtbnMuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFRhYmxlSGFybmVzc0NvbHVtbnNUZXh0IHtcbiAgW2NvbHVtbk5hbWU6IHN0cmluZ106IHtcbiAgICB0ZXh0OiBzdHJpbmdbXTtcbiAgICBoZWFkZXJUZXh0OiBzdHJpbmdbXTtcbiAgICBmb290ZXJUZXh0OiBzdHJpbmdbXTtcbiAgfTtcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtdGFibGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0VGFibGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0VGFibGVIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRhYmxlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWJsZSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVGFibGVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJsZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VGFibGVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgaGVhZGVyIHJvd3MgaW4gYSB0YWJsZS4gKi9cbiAgYXN5bmMgZ2V0SGVhZGVyUm93cyhmaWx0ZXI6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdEhlYWRlclJvd0hhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0SGVhZGVyUm93SGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgb2YgdGhlIHJlZ3VsYXIgZGF0YSByb3dzIGluIGEgdGFibGUuICovXG4gIGFzeW5jIGdldFJvd3MoZmlsdGVyOiBSb3dIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRSb3dIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFJvd0hhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIG9mIHRoZSBmb290ZXIgcm93cyBpbiBhIHRhYmxlLiAqL1xuICBhc3luYyBnZXRGb290ZXJSb3dzKGZpbHRlcjogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0Rm9vdGVyUm93SGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRGb290ZXJSb3dIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgZW50aXJlIHRhYmxlIG9yZ2FuaXplZCBieSByb3dzLiAqL1xuICBhc3luYyBnZXRDZWxsVGV4dEJ5SW5kZXgoKTogUHJvbWlzZTxzdHJpbmdbXVtdPiB7XG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IHRoaXMuZ2V0Um93cygpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChyb3dzLm1hcChyb3cgPT4gcm93LmdldENlbGxUZXh0QnlJbmRleCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIGVudGlyZSB0YWJsZSBvcmdhbml6ZWQgYnkgY29sdW1ucy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKTogUHJvbWlzZTxNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dD4ge1xuICAgIGNvbnN0IFtoZWFkZXJSb3dzLCBmb290ZXJSb3dzLCBkYXRhUm93c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmdldEhlYWRlclJvd3MoKSxcbiAgICAgIHRoaXMuZ2V0Rm9vdGVyUm93cygpLFxuICAgICAgdGhpcy5nZXRSb3dzKClcbiAgICBdKTtcblxuICAgIGNvbnN0IHRleHQ6IE1hdFRhYmxlSGFybmVzc0NvbHVtbnNUZXh0ID0ge307XG4gICAgY29uc3QgW2hlYWRlckRhdGEsIGZvb3RlckRhdGEsIHJvd3NEYXRhXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIFByb21pc2UuYWxsKGhlYWRlclJvd3MubWFwKHJvdyA9PiBnZXRSb3dEYXRhKHJvdykpKSxcbiAgICAgIFByb21pc2UuYWxsKGZvb3RlclJvd3MubWFwKHJvdyA9PiBnZXRSb3dEYXRhKHJvdykpKSxcbiAgICAgIFByb21pc2UuYWxsKGRhdGFSb3dzLm1hcChyb3cgPT4gZ2V0Um93RGF0YShyb3cpKSksXG4gICAgXSk7XG5cbiAgICByb3dzRGF0YS5mb3JFYWNoKGNlbGxzID0+IHtcbiAgICAgIGNlbGxzLmZvckVhY2goKFtjb2x1bW5OYW1lLCBjZWxsVGV4dF0pID0+IHtcbiAgICAgICAgaWYgKCF0ZXh0W2NvbHVtbk5hbWVdKSB7XG4gICAgICAgICAgdGV4dFtjb2x1bW5OYW1lXSA9IHtcbiAgICAgICAgICAgIGhlYWRlclRleHQ6IGdldENlbGxUZXh0c0J5Q29sdW1uKGhlYWRlckRhdGEsIGNvbHVtbk5hbWUpLFxuICAgICAgICAgICAgZm9vdGVyVGV4dDogZ2V0Q2VsbFRleHRzQnlDb2x1bW4oZm9vdGVyRGF0YSwgY29sdW1uTmFtZSksXG4gICAgICAgICAgICB0ZXh0OiBbXVxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0W2NvbHVtbk5hbWVdLnRleHQucHVzaChjZWxsVGV4dCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0ZXh0O1xuICB9XG59XG5cbi8qKiBVdGlsaXR5IHRvIGV4dHJhY3QgdGhlIGNvbHVtbiBuYW1lcyBhbmQgdGV4dCBmcm9tIGFsbCBvZiB0aGUgY2VsbHMgaW4gYSByb3cuICovXG5hc3luYyBmdW5jdGlvbiBnZXRSb3dEYXRhKHJvdzogTWF0Um93SGFybmVzcyB8IE1hdEhlYWRlclJvd0hhcm5lc3MgfCBNYXRGb290ZXJSb3dIYXJuZXNzKSB7XG4gIGNvbnN0IGNlbGxzID0gYXdhaXQgcm93LmdldENlbGxzKCk7XG4gIHJldHVybiBQcm9taXNlLmFsbChjZWxscy5tYXAoY2VsbCA9PiBQcm9taXNlLmFsbChbY2VsbC5nZXRDb2x1bW5OYW1lKCksIGNlbGwuZ2V0VGV4dCgpXSkpKTtcbn1cblxuXG4vKiogRXh0cmFjdHMgdGhlIHRleHQgb2YgY2VsbHMgb25seSB1bmRlciBhIHBhcnRpY3VsYXIgY29sdW1uLiAqL1xuZnVuY3Rpb24gZ2V0Q2VsbFRleHRzQnlDb2x1bW4ocm93c0RhdGE6IFtzdHJpbmcsIHN0cmluZ11bXVtdLCBjb2x1bW46IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY29sdW1uVGV4dHM6IHN0cmluZ1tdID0gW107XG5cbiAgcm93c0RhdGEuZm9yRWFjaChjZWxscyA9PiB7XG4gICAgY2VsbHMuZm9yRWFjaCgoW2NvbHVtbk5hbWUsIGNlbGxUZXh0XSkgPT4ge1xuICAgICAgaWYgKGNvbHVtbk5hbWUgPT09IGNvbHVtbikge1xuICAgICAgICBjb2x1bW5UZXh0cy5wdXNoKGNlbGxUZXh0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbHVtblRleHRzO1xufVxuIl19