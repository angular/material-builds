/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatRowHarness, MatHeaderRowHarness, MatFooterRowHarness } from './row-harness';
/** Harness for interacting with a standard mat-table in tests. */
export class MatTableHarness extends ComponentHarness {
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
            return Promise.all(rows.map(row => row.getCellTextByIndex()));
        });
    }
    /** Gets the text inside the entire table organized by columns. */
    getCellTextByColumnName() {
        return __awaiter(this, void 0, void 0, function* () {
            const [headerRows, footerRows, dataRows] = yield Promise.all([
                this.getHeaderRows(),
                this.getFooterRows(),
                this.getRows()
            ]);
            const text = {};
            const [headerData, footerData, rowsData] = yield Promise.all([
                Promise.all(headerRows.map(row => getRowData(row))),
                Promise.all(footerRows.map(row => getRowData(row))),
                Promise.all(dataRows.map(row => getRowData(row))),
            ]);
            rowsData.forEach(cells => {
                cells.forEach(([columnName, cellText]) => {
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
/** Utility to extract the column names and text from all of the cells in a row. */
function getRowData(row) {
    return __awaiter(this, void 0, void 0, function* () {
        const cells = yield row.getCells();
        return Promise.all(cells.map(cell => Promise.all([cell.getColumnName(), cell.getText()])));
    });
}
/** Extracts the text of cells only under a particular column. */
function getCellTextsByColumn(rowsData, column) {
    const columnTexts = [];
    rowsData.forEach(cells => {
        cells.forEach(([columnName, cellText]) => {
            if (columnName === column) {
                columnTexts.push(cellText);
            }
        });
    });
    return columnTexts;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS90ZXN0aW5nL3RhYmxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhFLE9BQU8sRUFBQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFXdEYsa0VBQWtFO0FBQ2xFLE1BQU0sT0FBTyxlQUFnQixTQUFRLGdCQUFnQjtJQUluRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUErQixFQUFFO1FBQzNDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELDhDQUE4QztJQUN4QyxhQUFhLENBQUMsU0FBNEIsRUFBRTs7WUFDaEQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDaEUsQ0FBQztLQUFBO0lBRUQsb0RBQW9EO0lBQzlDLE9BQU8sQ0FBQyxTQUE0QixFQUFFOztZQUMxQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRUQsOENBQThDO0lBQ3hDLGFBQWEsQ0FBQyxTQUE0QixFQUFFOztZQUNoRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoRSxDQUFDO0tBQUE7SUFFRCwrREFBK0Q7SUFDekQsa0JBQWtCOztZQUN0QixNQUFNLElBQUksR0FB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QyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYmxlSGFybmVzc0ZpbHRlcnMsIFJvd0hhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RhYmxlLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdFJvd0hhcm5lc3MsIE1hdEhlYWRlclJvd0hhcm5lc3MsIE1hdEZvb3RlclJvd0hhcm5lc3N9IGZyb20gJy4vcm93LWhhcm5lc3MnO1xuXG4vKiogVGV4dCBleHRyYWN0ZWQgZnJvbSBhIHRhYmxlIG9yZ2FuaXplZCBieSBjb2x1bW5zLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dCB7XG4gIFtjb2x1bW5OYW1lOiBzdHJpbmddOiB7XG4gICAgdGV4dDogc3RyaW5nW107XG4gICAgaGVhZGVyVGV4dDogc3RyaW5nW107XG4gICAgZm9vdGVyVGV4dDogc3RyaW5nW107XG4gIH07XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRhYmxlIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYmxlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFRhYmxlSGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10YWJsZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgdGFibGUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFRhYmxlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0VGFibGVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFRhYmxlSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgb2YgdGhlIGhlYWRlciByb3dzIGluIGEgdGFibGUuICovXG4gIGFzeW5jIGdldEhlYWRlclJvd3MoZmlsdGVyOiBSb3dIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRIZWFkZXJSb3dIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdEhlYWRlclJvd0hhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIG9mIHRoZSByZWd1bGFyIGRhdGEgcm93cyBpbiBhIHRhYmxlLiAqL1xuICBhc3luYyBnZXRSb3dzKGZpbHRlcjogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0Um93SGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRSb3dIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgZm9vdGVyIHJvd3MgaW4gYSB0YWJsZS4gKi9cbiAgYXN5bmMgZ2V0Rm9vdGVyUm93cyhmaWx0ZXI6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdEZvb3RlclJvd0hhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0Rm9vdGVyUm93SGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIGVudGlyZSB0YWJsZSBvcmdhbml6ZWQgYnkgcm93cy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbFRleHRCeUluZGV4KCk6IFByb21pc2U8c3RyaW5nW11bXT4ge1xuICAgIGNvbnN0IHJvd3MgPSBhd2FpdCB0aGlzLmdldFJvd3MoKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocm93cy5tYXAocm93ID0+IHJvdy5nZXRDZWxsVGV4dEJ5SW5kZXgoKSkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgaW5zaWRlIHRoZSBlbnRpcmUgdGFibGUgb3JnYW5pemVkIGJ5IGNvbHVtbnMuICovXG4gIGFzeW5jIGdldENlbGxUZXh0QnlDb2x1bW5OYW1lKCk6IFByb21pc2U8TWF0VGFibGVIYXJuZXNzQ29sdW1uc1RleHQ+IHtcbiAgICBjb25zdCBbaGVhZGVyUm93cywgZm9vdGVyUm93cywgZGF0YVJvd3NdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5nZXRIZWFkZXJSb3dzKCksXG4gICAgICB0aGlzLmdldEZvb3RlclJvd3MoKSxcbiAgICAgIHRoaXMuZ2V0Um93cygpXG4gICAgXSk7XG5cbiAgICBjb25zdCB0ZXh0OiBNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dCA9IHt9O1xuICAgIGNvbnN0IFtoZWFkZXJEYXRhLCBmb290ZXJEYXRhLCByb3dzRGF0YV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBQcm9taXNlLmFsbChoZWFkZXJSb3dzLm1hcChyb3cgPT4gZ2V0Um93RGF0YShyb3cpKSksXG4gICAgICBQcm9taXNlLmFsbChmb290ZXJSb3dzLm1hcChyb3cgPT4gZ2V0Um93RGF0YShyb3cpKSksXG4gICAgICBQcm9taXNlLmFsbChkYXRhUm93cy5tYXAocm93ID0+IGdldFJvd0RhdGEocm93KSkpLFxuICAgIF0pO1xuXG4gICAgcm93c0RhdGEuZm9yRWFjaChjZWxscyA9PiB7XG4gICAgICBjZWxscy5mb3JFYWNoKChbY29sdW1uTmFtZSwgY2VsbFRleHRdKSA9PiB7XG4gICAgICAgIGlmICghdGV4dFtjb2x1bW5OYW1lXSkge1xuICAgICAgICAgIHRleHRbY29sdW1uTmFtZV0gPSB7XG4gICAgICAgICAgICBoZWFkZXJUZXh0OiBnZXRDZWxsVGV4dHNCeUNvbHVtbihoZWFkZXJEYXRhLCBjb2x1bW5OYW1lKSxcbiAgICAgICAgICAgIGZvb3RlclRleHQ6IGdldENlbGxUZXh0c0J5Q29sdW1uKGZvb3RlckRhdGEsIGNvbHVtbk5hbWUpLFxuICAgICAgICAgICAgdGV4dDogW11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dFtjb2x1bW5OYW1lXS50ZXh0LnB1c2goY2VsbFRleHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufVxuXG4vKiogVXRpbGl0eSB0byBleHRyYWN0IHRoZSBjb2x1bW4gbmFtZXMgYW5kIHRleHQgZnJvbSBhbGwgb2YgdGhlIGNlbGxzIGluIGEgcm93LiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0Um93RGF0YShyb3c6IE1hdFJvd0hhcm5lc3MgfCBNYXRIZWFkZXJSb3dIYXJuZXNzIHwgTWF0Rm9vdGVyUm93SGFybmVzcykge1xuICBjb25zdCBjZWxscyA9IGF3YWl0IHJvdy5nZXRDZWxscygpO1xuICByZXR1cm4gUHJvbWlzZS5hbGwoY2VsbHMubWFwKGNlbGwgPT4gUHJvbWlzZS5hbGwoW2NlbGwuZ2V0Q29sdW1uTmFtZSgpLCBjZWxsLmdldFRleHQoKV0pKSk7XG59XG5cblxuLyoqIEV4dHJhY3RzIHRoZSB0ZXh0IG9mIGNlbGxzIG9ubHkgdW5kZXIgYSBwYXJ0aWN1bGFyIGNvbHVtbi4gKi9cbmZ1bmN0aW9uIGdldENlbGxUZXh0c0J5Q29sdW1uKHJvd3NEYXRhOiBbc3RyaW5nLCBzdHJpbmddW11bXSwgY29sdW1uOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGNvbHVtblRleHRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHJvd3NEYXRhLmZvckVhY2goY2VsbHMgPT4ge1xuICAgIGNlbGxzLmZvckVhY2goKFtjb2x1bW5OYW1lLCBjZWxsVGV4dF0pID0+IHtcbiAgICAgIGlmIChjb2x1bW5OYW1lID09PSBjb2x1bW4pIHtcbiAgICAgICAgY29sdW1uVGV4dHMucHVzaChjZWxsVGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb2x1bW5UZXh0cztcbn1cbiJdfQ==