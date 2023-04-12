import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';

class _MatCellHarnessBase extends ContentContainerComponentHarness {
    /** Gets the cell's text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the name of the column that the cell belongs to. */
    async getColumnName() {
        const host = await this.host();
        const classAttribute = await host.getAttribute('class');
        if (classAttribute) {
            const prefix = 'mat-column-';
            const name = classAttribute
                .split(' ')
                .map(c => c.trim())
                .find(c => c.startsWith(prefix));
            if (name) {
                return name.split(prefix)[1];
            }
        }
        throw Error('Could not determine column name of cell.');
    }
    static _getCellPredicate(type, options) {
        return new HarnessPredicate(type, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('columnName', options.columnName, (harness, name) => HarnessPredicate.stringMatches(harness.getColumnName(), name));
    }
}
/** Harness for interacting with an MDC-based Angular Material table cell. */
class MatCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatCellHarness` instance. */
    static { this.hostSelector = '.mat-mdc-cell'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}
/** Harness for interacting with an MDC-based Angular Material table header cell. */
class MatHeaderCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatHeaderCellHarness` instance. */
    static { this.hostSelector = '.mat-mdc-header-cell'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table header cell with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}
/** Harness for interacting with an MDC-based Angular Material table footer cell. */
class MatFooterCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatFooterCellHarness` instance. */
    static { this.hostSelector = '.mat-mdc-footer-cell'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table footer cell with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}

class _MatRowHarnessBase extends ComponentHarness {
    /** Gets a list of `MatCellHarness` for all cells in the row. */
    async getCells(filter = {}) {
        return this.locatorForAll(this._cellHarness.with(filter))();
    }
    /** Gets the text of the cells in the row. */
    async getCellTextByIndex(filter = {}) {
        const cells = await this.getCells(filter);
        return parallel(() => cells.map(cell => cell.getText()));
    }
    /** Gets the text inside the row organized by columns. */
    async getCellTextByColumnName() {
        const output = {};
        const cells = await this.getCells();
        const cellsData = await parallel(() => cells.map(cell => {
            return parallel(() => [cell.getColumnName(), cell.getText()]);
        }));
        cellsData.forEach(([columnName, text]) => (output[columnName] = text));
        return output;
    }
}
/** Harness for interacting with an MDC-based Angular Material table row. */
class MatRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatCellHarness;
    }
    /** The selector for the host element of a `MatRowHarness` instance. */
    static { this.hostSelector = '.mat-mdc-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}
/** Harness for interacting with an MDC-based Angular Material table header row. */
class MatHeaderRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatHeaderCellHarness;
    }
    /** The selector for the host element of a `MatHeaderRowHarness` instance. */
    static { this.hostSelector = '.mat-mdc-header-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table header row with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}
/** Harness for interacting with an MDC-based Angular Material table footer row. */
class MatFooterRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatFooterCellHarness;
    }
    /** The selector for the host element of a `MatFooterRowHarness` instance. */
    static { this.hostSelector = '.mat-mdc-footer-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table footer row cell with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}

class _MatTableHarnessBase extends ContentContainerComponentHarness {
    /** Gets all of the header rows in a table. */
    async getHeaderRows(filter = {}) {
        return this.locatorForAll(this._headerRowHarness.with(filter))();
    }
    /** Gets all of the regular data rows in a table. */
    async getRows(filter = {}) {
        return this.locatorForAll(this._rowHarness.with(filter))();
    }
    /** Gets all of the footer rows in a table. */
    async getFooterRows(filter = {}) {
        return this.locatorForAll(this._footerRowHarness.with(filter))();
    }
    /** Gets the text inside the entire table organized by rows. */
    async getCellTextByIndex() {
        const rows = await this.getRows();
        return parallel(() => rows.map(row => row.getCellTextByIndex()));
    }
    /** Gets the text inside the entire table organized by columns. */
    async getCellTextByColumnName() {
        const [headerRows, footerRows, dataRows] = await parallel(() => [
            this.getHeaderRows(),
            this.getFooterRows(),
            this.getRows(),
        ]);
        const text = {};
        const [headerData, footerData, rowsData] = await parallel(() => [
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
                        text: [],
                    };
                }
                text[columnName].text.push(cellText);
            });
        });
        return text;
    }
}
/** Harness for interacting with an MDC-based mat-table in tests. */
class MatTableHarness extends _MatTableHarnessBase {
    constructor() {
        super(...arguments);
        this._headerRowHarness = MatHeaderRowHarness;
        this._rowHarness = MatRowHarness;
        this._footerRowHarness = MatFooterRowHarness;
    }
    /** The selector for the host element of a `MatTableHarness` instance. */
    static { this.hostSelector = '.mat-mdc-table'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}
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

export { MatCellHarness, MatFooterCellHarness, MatFooterRowHarness, MatHeaderCellHarness, MatHeaderRowHarness, MatRowHarness, MatTableHarness, _MatCellHarnessBase, _MatRowHarnessBase, _MatTableHarnessBase };
//# sourceMappingURL=testing.mjs.map
