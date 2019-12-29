import { __extends, __awaiter, __generator, __read } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material table cell. */
var MatCellHarness = /** @class */ (function (_super) {
    __extends(MatCellHarness, _super);
    function MatCellHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatCellHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return getCellPredicate(MatCellHarness, options);
    };
    /** Gets the cell's text. */
    MatCellHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the name of the column that the cell belongs to. */
    MatCellHarness.prototype.getColumnName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, classAttribute, prefix_1, name_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.getAttribute('class')];
                    case 2:
                        classAttribute = _a.sent();
                        if (classAttribute) {
                            prefix_1 = 'mat-column-';
                            name_1 = classAttribute.split(' ').map(function (c) { return c.trim(); }).find(function (c) { return c.startsWith(prefix_1); });
                            if (name_1) {
                                return [2 /*return*/, name_1.split(prefix_1)[1]];
                            }
                        }
                        throw Error('Could not determine column name of cell.');
                }
            });
        });
    };
    /** The selector for the host element of a `MatCellHarness` instance. */
    MatCellHarness.hostSelector = '.mat-cell';
    return MatCellHarness;
}(ComponentHarness));
/** Harness for interacting with a standard Angular Material table header cell. */
var MatHeaderCellHarness = /** @class */ (function (_super) {
    __extends(MatHeaderCellHarness, _super);
    function MatHeaderCellHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatHeaderCellHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return getCellPredicate(MatHeaderCellHarness, options);
    };
    /** The selector for the host element of a `MatHeaderCellHarness` instance. */
    MatHeaderCellHarness.hostSelector = '.mat-header-cell';
    return MatHeaderCellHarness;
}(MatCellHarness));
/** Harness for interacting with a standard Angular Material table footer cell. */
var MatFooterCellHarness = /** @class */ (function (_super) {
    __extends(MatFooterCellHarness, _super);
    function MatFooterCellHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatFooterCellHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return getCellPredicate(MatFooterCellHarness, options);
    };
    /** The selector for the host element of a `MatFooterCellHarness` instance. */
    MatFooterCellHarness.hostSelector = '.mat-footer-cell';
    return MatFooterCellHarness;
}(MatCellHarness));
function getCellPredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
                                Promise.all(headerRows.map(function (row) { return row.getCellTextByColumnName(); })),
                                Promise.all(footerRows.map(function (row) { return row.getCellTextByColumnName(); })),
                                Promise.all(dataRows.map(function (row) { return row.getCellTextByColumnName(); })),
                            ])];
                    case 2:
                        _b = __read.apply(void 0, [_c.sent(), 3]), headerData = _b[0], footerData = _b[1], rowsData = _b[2];
                        rowsData.forEach(function (data) {
                            Object.keys(data).forEach(function (columnName) {
                                var cellText = data[columnName];
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
/** Extracts the text of cells only under a particular column. */
function getCellTextsByColumn(rowsData, column) {
    var columnTexts = [];
    rowsData.forEach(function (data) {
        Object.keys(data).forEach(function (columnName) {
            if (columnName === column) {
                columnTexts.push(data[columnName]);
            }
        });
    });
    return columnTexts;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatCellHarness, MatFooterCellHarness, MatFooterRowHarness, MatHeaderCellHarness, MatHeaderRowHarness, MatRowHarness, MatTableHarness };
//# sourceMappingURL=testing.js.map
