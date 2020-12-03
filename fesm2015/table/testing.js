import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material table cell. */
class MatCellHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getCellPredicate(MatCellHarness, options);
    }
    /** Gets the cell's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the name of the column that the cell belongs to. */
    getColumnName() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const classAttribute = yield host.getAttribute('class');
            if (classAttribute) {
                const prefix = 'mat-column-';
                const name = classAttribute.split(' ').map(c => c.trim()).find(c => c.startsWith(prefix));
                if (name) {
                    return name.split(prefix)[1];
                }
            }
            throw Error('Could not determine column name of cell.');
        });
    }
}
/** The selector for the host element of a `MatCellHarness` instance. */
MatCellHarness.hostSelector = '.mat-cell';
/** Harness for interacting with a standard Angular Material table header cell. */
class MatHeaderCellHarness extends MatCellHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getCellPredicate(MatHeaderCellHarness, options);
    }
}
/** The selector for the host element of a `MatHeaderCellHarness` instance. */
MatHeaderCellHarness.hostSelector = '.mat-header-cell';
/** Harness for interacting with a standard Angular Material table footer cell. */
class MatFooterCellHarness extends MatCellHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getCellPredicate(MatFooterCellHarness, options);
    }
}
/** The selector for the host element of a `MatFooterCellHarness` instance. */
MatFooterCellHarness.hostSelector = '.mat-footer-cell';
function getCellPredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('columnName', options.columnName, (harness, name) => HarnessPredicate.stringMatches(harness.getColumnName(), name));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material table row. */
class MatRowHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRowHarness, options);
    }
    /** Gets a list of `MatCellHarness` for all cells in the row. */
    getCells(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatCellHarness.with(filter))();
        });
    }
    /** Gets the text of the cells in the row. */
    getCellTextByIndex(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return getCellTextByIndex(this, filter);
        });
    }
    /** Gets the text inside the row organized by columns. */
    getCellTextByColumnName() {
        return __awaiter(this, void 0, void 0, function* () {
            return getCellTextByColumnName(this);
        });
    }
}
/** The selector for the host element of a `MatRowHarness` instance. */
MatRowHarness.hostSelector = '.mat-row';
/** Harness for interacting with a standard Angular Material table header row. */
class MatHeaderRowHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatHeaderRowHarness, options);
    }
    /** Gets a list of `MatHeaderCellHarness` for all cells in the row. */
    getCells(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatHeaderCellHarness.with(filter))();
        });
    }
    /** Gets the text of the cells in the header row. */
    getCellTextByIndex(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return getCellTextByIndex(this, filter);
        });
    }
    /** Gets the text inside the header row organized by columns. */
    getCellTextByColumnName() {
        return __awaiter(this, void 0, void 0, function* () {
            return getCellTextByColumnName(this);
        });
    }
}
/** The selector for the host element of a `MatHeaderRowHarness` instance. */
MatHeaderRowHarness.hostSelector = '.mat-header-row';
/** Harness for interacting with a standard Angular Material table footer row. */
class MatFooterRowHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer row cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatFooterRowHarness, options);
    }
    /** Gets a list of `MatFooterCellHarness` for all cells in the row. */
    getCells(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatFooterCellHarness.with(filter))();
        });
    }
    /** Gets the text of the cells in the footer row. */
    getCellTextByIndex(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return getCellTextByIndex(this, filter);
        });
    }
    /** Gets the text inside the footer row organized by columns. */
    getCellTextByColumnName() {
        return __awaiter(this, void 0, void 0, function* () {
            return getCellTextByColumnName(this);
        });
    }
}
/** The selector for the host element of a `MatFooterRowHarness` instance. */
MatFooterRowHarness.hostSelector = '.mat-footer-row';
function getCellTextByIndex(harness, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const cells = yield harness.getCells(filter);
        return parallel(() => cells.map(cell => cell.getText()));
    });
}
function getCellTextByColumnName(harness) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = {};
        const cells = yield harness.getCells();
        const cellsData = yield parallel(() => cells.map(cell => {
            return parallel(() => [cell.getColumnName(), cell.getText()]);
        }));
        cellsData.forEach(([columnName, text]) => output[columnName] = text);
        return output;
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
class MatTableHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTableHarness, options);
    }
    /** Gets all of the header rows in a table. */
    getHeaderRows(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatHeaderRowHarness.with(filter))();
        });
    }
    /** Gets all of the regular data rows in a table. */
    getRows(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatRowHarness.with(filter))();
        });
    }
    /** Gets all of the footer rows in a table. */
    getFooterRows(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatFooterRowHarness.with(filter))();
        });
    }
    /** Gets the text inside the entire table organized by rows. */
    getCellTextByIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.getRows();
            return parallel(() => rows.map(row => row.getCellTextByIndex()));
        });
    }
    /** Gets the text inside the entire table organized by columns. */
    getCellTextByColumnName() {
        return __awaiter(this, void 0, void 0, function* () {
            const [headerRows, footerRows, dataRows] = yield parallel(() => [
                this.getHeaderRows(),
                this.getFooterRows(),
                this.getRows()
            ]);
            const text = {};
            const [headerData, footerData, rowsData] = yield parallel(() => [
                parallel(() => headerRows.map(row => row.getCellTextByColumnName())),
                parallel(() => footerRows.map(row => row.getCellTextByColumnName())),
                parallel(() => dataRows.map(row => row.getCellTextByColumnName())),
            ]);
            rowsData.forEach(data => {
                Object.keys(data).forEach(columnName => {
                    const cellText = data[columnName];
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
            return text;
        });
    }
}
/** The selector for the host element of a `MatTableHarness` instance. */
MatTableHarness.hostSelector = '.mat-table';
/** Extracts the text of cells only under a particular column. */
function getCellTextsByColumn(rowsData, column) {
    const columnTexts = [];
    rowsData.forEach(data => {
        Object.keys(data).forEach(columnName => {
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
