import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';

class _MatCellHarnessBase extends ContentContainerComponentHarness {
  async getText() {
    return (await this.host()).text();
  }
  async getColumnName() {
    const host = await this.host();
    const classAttribute = await host.getAttribute('class');
    if (classAttribute) {
      const prefix = 'mat-column-';
      const name = classAttribute.split(' ').map(c => c.trim()).find(c => c.startsWith(prefix));
      if (name) {
        return name.split(prefix)[1];
      }
    }
    throw Error('Could not determine column name of cell.');
  }
  static _getCellPredicate(type, options) {
    return new HarnessPredicate(type, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('columnName', options.columnName, (harness, name) => HarnessPredicate.stringMatches(harness.getColumnName(), name));
  }
}
class MatCellHarness extends _MatCellHarnessBase {
  static hostSelector = '.mat-mdc-cell:not(.mat-no-data-cell)';
  static with(options = {}) {
    return _MatCellHarnessBase._getCellPredicate(this, options);
  }
}
class MatHeaderCellHarness extends _MatCellHarnessBase {
  static hostSelector = '.mat-mdc-header-cell';
  static with(options = {}) {
    return _MatCellHarnessBase._getCellPredicate(this, options);
  }
}
class MatFooterCellHarness extends _MatCellHarnessBase {
  static hostSelector = '.mat-mdc-footer-cell';
  static with(options = {}) {
    return _MatCellHarnessBase._getCellPredicate(this, options);
  }
}
class MatNoDataCellHarness extends _MatCellHarnessBase {
  static hostSelector = '.mat-no-data-cell';
  static with(options = {}) {
    return _MatCellHarnessBase._getCellPredicate(this, options);
  }
}

class _MatRowHarnessBase extends ComponentHarness {
  async getCells(filter = {}) {
    return this.locatorForAll(this._cellHarness.with(filter))();
  }
  async getCellTextByIndex(filter = {}) {
    const cells = await this.getCells(filter);
    return parallel(() => cells.map(cell => cell.getText()));
  }
  async getCellTextByColumnName() {
    const output = {};
    const cells = await this.getCells();
    const cellsData = await parallel(() => cells.map(cell => {
      return parallel(() => [cell.getColumnName(), cell.getText()]);
    }));
    cellsData.forEach(([columnName, text]) => output[columnName] = text);
    return output;
  }
}
class MatRowHarness extends _MatRowHarnessBase {
  static hostSelector = '.mat-mdc-row:not(.mat-mdc-no-data-row)';
  _cellHarness = MatCellHarness;
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
}
class MatHeaderRowHarness extends _MatRowHarnessBase {
  static hostSelector = '.mat-mdc-header-row';
  _cellHarness = MatHeaderCellHarness;
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
}
class MatFooterRowHarness extends _MatRowHarnessBase {
  static hostSelector = '.mat-mdc-footer-row';
  _cellHarness = MatFooterCellHarness;
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
}
class MatNoDataRowHarness extends _MatRowHarnessBase {
  static hostSelector = '.mat-mdc-no-data-row';
  _cellHarness = MatNoDataCellHarness;
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
}

class MatTableHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-table';
  _headerRowHarness = MatHeaderRowHarness;
  _rowHarness = MatRowHarness;
  _footerRowHarness = MatFooterRowHarness;
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async getHeaderRows(filter = {}) {
    return this.locatorForAll(this._headerRowHarness.with(filter))();
  }
  async getRows(filter = {}) {
    return this.locatorForAll(this._rowHarness.with(filter))();
  }
  async getFooterRows(filter = {}) {
    return this.locatorForAll(this._footerRowHarness.with(filter))();
  }
  async getNoDataRow(filter = {}) {
    return this.locatorForOptional(MatNoDataRowHarness.with(filter))();
  }
  async getCellTextByIndex() {
    const rows = await this.getRows();
    return parallel(() => rows.map(row => row.getCellTextByIndex()));
  }
  async getCellTextByColumnName() {
    const [headerRows, footerRows, dataRows] = await parallel(() => [this.getHeaderRows(), this.getFooterRows(), this.getRows()]);
    const text = {};
    const [headerData, footerData, rowsData] = await parallel(() => [parallel(() => headerRows.map(row => row.getCellTextByColumnName())), parallel(() => footerRows.map(row => row.getCellTextByColumnName())), parallel(() => dataRows.map(row => row.getCellTextByColumnName()))]);
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
  }
}
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

export { MatCellHarness, MatFooterCellHarness, MatFooterRowHarness, MatHeaderCellHarness, MatHeaderRowHarness, MatNoDataCellHarness, MatNoDataRowHarness, MatRowHarness, MatTableHarness, _MatCellHarnessBase, _MatRowHarnessBase };
//# sourceMappingURL=table-testing.mjs.map
