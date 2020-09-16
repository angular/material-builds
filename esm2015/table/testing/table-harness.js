/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatRowHarness, MatHeaderRowHarness, MatFooterRowHarness, } from './row-harness';
/** Harness for interacting with a standard mat-table in tests. */
export class MatTableHarness extends ContentContainerComponentHarness {
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
                Promise.all(headerRows.map(row => row.getCellTextByColumnName())),
                Promise.all(footerRows.map(row => row.getCellTextByColumnName())),
                Promise.all(dataRows.map(row => row.getCellTextByColumnName())),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS90ZXN0aW5nL3RhYmxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhGLE9BQU8sRUFDTCxhQUFhLEVBQ2IsbUJBQW1CLEVBQ25CLG1CQUFtQixHQUVwQixNQUFNLGVBQWUsQ0FBQztBQVd2QixrRUFBa0U7QUFDbEUsTUFBTSxPQUFPLGVBQWdCLFNBQVEsZ0NBQXdDO0lBSTNFOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQStCLEVBQUU7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsOENBQThDO0lBQ3hDLGFBQWEsQ0FBQyxTQUE0QixFQUFFOztZQUNoRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoRSxDQUFDO0tBQUE7SUFFRCxvREFBb0Q7SUFDOUMsT0FBTyxDQUFDLFNBQTRCLEVBQUU7O1lBQzFDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFRCw4Q0FBOEM7SUFDeEMsYUFBYSxDQUFDLFNBQTRCLEVBQUU7O1lBQ2hELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2hFLENBQUM7S0FBQTtJQUVELCtEQUErRDtJQUN6RCxrQkFBa0I7O1lBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FBQTtJQUVELGtFQUFrRTtJQUM1RCx1QkFBdUI7O1lBQzNCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRTthQUNmLENBQUMsQ0FBQztZQUVILE1BQU0sSUFBSSxHQUErQixFQUFFLENBQUM7WUFDNUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO2FBQ2hFLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBRWxDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7d0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRzs0QkFDakIsVUFBVSxFQUFFLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7NEJBQ3hELFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDOzRCQUN4RCxJQUFJLEVBQUUsRUFBRTt5QkFDVCxDQUFDO3FCQUNIO29CQUVELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7O0FBakVELHlFQUF5RTtBQUNsRSw0QkFBWSxHQUFHLFlBQVksQ0FBQztBQW1FckMsaUVBQWlFO0FBQ2pFLFNBQVMsb0JBQW9CLENBQUMsUUFBb0MsRUFBRSxNQUFjO0lBQ2hGLE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztJQUVqQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JDLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtnQkFDekIsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNwQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7VGFibGVIYXJuZXNzRmlsdGVycywgUm93SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdGFibGUtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7XG4gIE1hdFJvd0hhcm5lc3MsXG4gIE1hdEhlYWRlclJvd0hhcm5lc3MsXG4gIE1hdEZvb3RlclJvd0hhcm5lc3MsXG4gIE1hdFJvd0hhcm5lc3NDb2x1bW5zVGV4dCxcbn0gZnJvbSAnLi9yb3ctaGFybmVzcyc7XG5cbi8qKiBUZXh0IGV4dHJhY3RlZCBmcm9tIGEgdGFibGUgb3JnYW5pemVkIGJ5IGNvbHVtbnMuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFRhYmxlSGFybmVzc0NvbHVtbnNUZXh0IHtcbiAgW2NvbHVtbk5hbWU6IHN0cmluZ106IHtcbiAgICB0ZXh0OiBzdHJpbmdbXTtcbiAgICBoZWFkZXJUZXh0OiBzdHJpbmdbXTtcbiAgICBmb290ZXJUZXh0OiBzdHJpbmdbXTtcbiAgfTtcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtdGFibGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0VGFibGVIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0VGFibGVIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRhYmxlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWJsZSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVGFibGVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJsZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VGFibGVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgaGVhZGVyIHJvd3MgaW4gYSB0YWJsZS4gKi9cbiAgYXN5bmMgZ2V0SGVhZGVyUm93cyhmaWx0ZXI6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdEhlYWRlclJvd0hhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0SGVhZGVyUm93SGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgb2YgdGhlIHJlZ3VsYXIgZGF0YSByb3dzIGluIGEgdGFibGUuICovXG4gIGFzeW5jIGdldFJvd3MoZmlsdGVyOiBSb3dIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRSb3dIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFJvd0hhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIG9mIHRoZSBmb290ZXIgcm93cyBpbiBhIHRhYmxlLiAqL1xuICBhc3luYyBnZXRGb290ZXJSb3dzKGZpbHRlcjogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0Rm9vdGVyUm93SGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRGb290ZXJSb3dIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgZW50aXJlIHRhYmxlIG9yZ2FuaXplZCBieSByb3dzLiAqL1xuICBhc3luYyBnZXRDZWxsVGV4dEJ5SW5kZXgoKTogUHJvbWlzZTxzdHJpbmdbXVtdPiB7XG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IHRoaXMuZ2V0Um93cygpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChyb3dzLm1hcChyb3cgPT4gcm93LmdldENlbGxUZXh0QnlJbmRleCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIGVudGlyZSB0YWJsZSBvcmdhbml6ZWQgYnkgY29sdW1ucy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKTogUHJvbWlzZTxNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dD4ge1xuICAgIGNvbnN0IFtoZWFkZXJSb3dzLCBmb290ZXJSb3dzLCBkYXRhUm93c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmdldEhlYWRlclJvd3MoKSxcbiAgICAgIHRoaXMuZ2V0Rm9vdGVyUm93cygpLFxuICAgICAgdGhpcy5nZXRSb3dzKClcbiAgICBdKTtcblxuICAgIGNvbnN0IHRleHQ6IE1hdFRhYmxlSGFybmVzc0NvbHVtbnNUZXh0ID0ge307XG4gICAgY29uc3QgW2hlYWRlckRhdGEsIGZvb3RlckRhdGEsIHJvd3NEYXRhXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIFByb21pc2UuYWxsKGhlYWRlclJvd3MubWFwKHJvdyA9PiByb3cuZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKSkpLFxuICAgICAgUHJvbWlzZS5hbGwoZm9vdGVyUm93cy5tYXAocm93ID0+IHJvdy5nZXRDZWxsVGV4dEJ5Q29sdW1uTmFtZSgpKSksXG4gICAgICBQcm9taXNlLmFsbChkYXRhUm93cy5tYXAocm93ID0+IHJvdy5nZXRDZWxsVGV4dEJ5Q29sdW1uTmFtZSgpKSksXG4gICAgXSk7XG5cbiAgICByb3dzRGF0YS5mb3JFYWNoKGRhdGEgPT4ge1xuICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChjb2x1bW5OYW1lID0+IHtcbiAgICAgICAgY29uc3QgY2VsbFRleHQgPSBkYXRhW2NvbHVtbk5hbWVdO1xuXG4gICAgICAgIGlmICghdGV4dFtjb2x1bW5OYW1lXSkge1xuICAgICAgICAgIHRleHRbY29sdW1uTmFtZV0gPSB7XG4gICAgICAgICAgICBoZWFkZXJUZXh0OiBnZXRDZWxsVGV4dHNCeUNvbHVtbihoZWFkZXJEYXRhLCBjb2x1bW5OYW1lKSxcbiAgICAgICAgICAgIGZvb3RlclRleHQ6IGdldENlbGxUZXh0c0J5Q29sdW1uKGZvb3RlckRhdGEsIGNvbHVtbk5hbWUpLFxuICAgICAgICAgICAgdGV4dDogW11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dFtjb2x1bW5OYW1lXS50ZXh0LnB1c2goY2VsbFRleHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufVxuXG4vKiogRXh0cmFjdHMgdGhlIHRleHQgb2YgY2VsbHMgb25seSB1bmRlciBhIHBhcnRpY3VsYXIgY29sdW1uLiAqL1xuZnVuY3Rpb24gZ2V0Q2VsbFRleHRzQnlDb2x1bW4ocm93c0RhdGE6IE1hdFJvd0hhcm5lc3NDb2x1bW5zVGV4dFtdLCBjb2x1bW46IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY29sdW1uVGV4dHM6IHN0cmluZ1tdID0gW107XG5cbiAgcm93c0RhdGEuZm9yRWFjaChkYXRhID0+IHtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGNvbHVtbk5hbWUgPT4ge1xuICAgICAgaWYgKGNvbHVtbk5hbWUgPT09IGNvbHVtbikge1xuICAgICAgICBjb2x1bW5UZXh0cy5wdXNoKGRhdGFbY29sdW1uTmFtZV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gY29sdW1uVGV4dHM7XG59XG4iXX0=