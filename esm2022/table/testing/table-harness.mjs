/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, parallel, } from '@angular/cdk/testing';
import { MatFooterRowHarness, MatHeaderRowHarness, MatRowHarness, } from './row-harness';
/** Harness for interacting with a mat-table in tests. */
export class MatTableHarness extends ContentContainerComponentHarness {
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
    /** Gets all the header rows in a table. */
    async getHeaderRows(filter = {}) {
        return this.locatorForAll(this._headerRowHarness.with(filter))();
    }
    /** Gets all the regular data rows in a table. */
    async getRows(filter = {}) {
        return this.locatorForAll(this._rowHarness.with(filter))();
    }
    /** Gets all the footer rows in a table. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS90ZXN0aW5nL3RhYmxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsRUFDaEIsUUFBUSxHQUNULE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUNMLG1CQUFtQixFQUNuQixtQkFBbUIsRUFDbkIsYUFBYSxHQUVkLE1BQU0sZUFBZSxDQUFDO0FBWXZCLHlEQUF5RDtBQUN6RCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxnQ0FBd0M7SUFBN0U7O1FBR0Usc0JBQWlCLEdBQUcsbUJBQW1CLENBQUM7UUFDeEMsZ0JBQVcsR0FBRyxhQUFhLENBQUM7UUFDcEIsc0JBQWlCLEdBQUcsbUJBQW1CLENBQUM7SUFvRWxELENBQUM7SUF4RUMseUVBQXlFO2FBQ2xFLGlCQUFZLEdBQUcsZ0JBQWdCLEFBQW5CLENBQW9CO0lBS3ZDOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUVULFVBQStCLEVBQUU7UUFFakMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBNEIsRUFBRTtRQUNoRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbkUsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQTRCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUs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QUNwQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIHBhcmFsbGVsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1xuICBNYXRGb290ZXJSb3dIYXJuZXNzLFxuICBNYXRIZWFkZXJSb3dIYXJuZXNzLFxuICBNYXRSb3dIYXJuZXNzLFxuICBNYXRSb3dIYXJuZXNzQ29sdW1uc1RleHQsXG59IGZyb20gJy4vcm93LWhhcm5lc3MnO1xuaW1wb3J0IHtSb3dIYXJuZXNzRmlsdGVycywgVGFibGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90YWJsZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogVGV4dCBleHRyYWN0ZWQgZnJvbSBhIHRhYmxlIG9yZ2FuaXplZCBieSBjb2x1bW5zLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dCB7XG4gIFtjb2x1bW5OYW1lOiBzdHJpbmddOiB7XG4gICAgdGV4dDogc3RyaW5nW107XG4gICAgaGVhZGVyVGV4dDogc3RyaW5nW107XG4gICAgZm9vdGVyVGV4dDogc3RyaW5nW107XG4gIH07XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbWF0LXRhYmxlIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYmxlSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFRhYmxlSGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtdGFibGUnO1xuICBfaGVhZGVyUm93SGFybmVzcyA9IE1hdEhlYWRlclJvd0hhcm5lc3M7XG4gIF9yb3dIYXJuZXNzID0gTWF0Um93SGFybmVzcztcbiAgcHJpdmF0ZSBfZm9vdGVyUm93SGFybmVzcyA9IE1hdEZvb3RlclJvd0hhcm5lc3M7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgdGFibGUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRUYWJsZUhhcm5lc3M+KFxuICAgIHRoaXM6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgICBvcHRpb25zOiBUYWJsZUhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8VD4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCB0aGUgaGVhZGVyIHJvd3MgaW4gYSB0YWJsZS4gKi9cbiAgYXN5bmMgZ2V0SGVhZGVyUm93cyhmaWx0ZXI6IFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdEhlYWRlclJvd0hhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwodGhpcy5faGVhZGVyUm93SGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgdGhlIHJlZ3VsYXIgZGF0YSByb3dzIGluIGEgdGFibGUuICovXG4gIGFzeW5jIGdldFJvd3MoZmlsdGVyOiBSb3dIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRSb3dIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKHRoaXMuX3Jvd0hhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIHRoZSBmb290ZXIgcm93cyBpbiBhIHRhYmxlLiAqL1xuICBhc3luYyBnZXRGb290ZXJSb3dzKGZpbHRlcjogUm93SGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0Rm9vdGVyUm93SGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbCh0aGlzLl9mb290ZXJSb3dIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgZW50aXJlIHRhYmxlIG9yZ2FuaXplZCBieSByb3dzLiAqL1xuICBhc3luYyBnZXRDZWxsVGV4dEJ5SW5kZXgoKTogUHJvbWlzZTxzdHJpbmdbXVtdPiB7XG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IHRoaXMuZ2V0Um93cygpO1xuICAgIHJldHVybiBwYXJhbGxlbCgoKSA9PiByb3dzLm1hcChyb3cgPT4gcm93LmdldENlbGxUZXh0QnlJbmRleCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIGVudGlyZSB0YWJsZSBvcmdhbml6ZWQgYnkgY29sdW1ucy4gKi9cbiAgYXN5bmMgZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKTogUHJvbWlzZTxNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dD4ge1xuICAgIGNvbnN0IFtoZWFkZXJSb3dzLCBmb290ZXJSb3dzLCBkYXRhUm93c10gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLmdldEhlYWRlclJvd3MoKSxcbiAgICAgIHRoaXMuZ2V0Rm9vdGVyUm93cygpLFxuICAgICAgdGhpcy5nZXRSb3dzKCksXG4gICAgXSk7XG5cbiAgICBjb25zdCB0ZXh0OiBNYXRUYWJsZUhhcm5lc3NDb2x1bW5zVGV4dCA9IHt9O1xuICAgIGNvbnN0IFtoZWFkZXJEYXRhLCBmb290ZXJEYXRhLCByb3dzRGF0YV0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICBwYXJhbGxlbCgoKSA9PiBoZWFkZXJSb3dzLm1hcChyb3cgPT4gcm93LmdldENlbGxUZXh0QnlDb2x1bW5OYW1lKCkpKSxcbiAgICAgIHBhcmFsbGVsKCgpID0+IGZvb3RlclJvd3MubWFwKHJvdyA9PiByb3cuZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKSkpLFxuICAgICAgcGFyYWxsZWwoKCkgPT4gZGF0YVJvd3MubWFwKHJvdyA9PiByb3cuZ2V0Q2VsbFRleHRCeUNvbHVtbk5hbWUoKSkpLFxuICAgIF0pO1xuXG4gICAgcm93c0RhdGEuZm9yRWFjaChkYXRhID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goY29sdW1uTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGxUZXh0ID0gZGF0YVtjb2x1bW5OYW1lXTtcblxuICAgICAgICBpZiAoIXRleHRbY29sdW1uTmFtZV0pIHtcbiAgICAgICAgICB0ZXh0W2NvbHVtbk5hbWVdID0ge1xuICAgICAgICAgICAgaGVhZGVyVGV4dDogZ2V0Q2VsbFRleHRzQnlDb2x1bW4oaGVhZGVyRGF0YSwgY29sdW1uTmFtZSksXG4gICAgICAgICAgICBmb290ZXJUZXh0OiBnZXRDZWxsVGV4dHNCeUNvbHVtbihmb290ZXJEYXRhLCBjb2x1bW5OYW1lKSxcbiAgICAgICAgICAgIHRleHQ6IFtdLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0W2NvbHVtbk5hbWVdLnRleHQucHVzaChjZWxsVGV4dCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0ZXh0O1xuICB9XG59XG5cbi8qKiBFeHRyYWN0cyB0aGUgdGV4dCBvZiBjZWxscyBvbmx5IHVuZGVyIGEgcGFydGljdWxhciBjb2x1bW4uICovXG5mdW5jdGlvbiBnZXRDZWxsVGV4dHNCeUNvbHVtbihyb3dzRGF0YTogTWF0Um93SGFybmVzc0NvbHVtbnNUZXh0W10sIGNvbHVtbjogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBjb2x1bW5UZXh0czogc3RyaW5nW10gPSBbXTtcblxuICByb3dzRGF0YS5mb3JFYWNoKGRhdGEgPT4ge1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goY29sdW1uTmFtZSA9PiB7XG4gICAgICBpZiAoY29sdW1uTmFtZSA9PT0gY29sdW1uKSB7XG4gICAgICAgIGNvbHVtblRleHRzLnB1c2goZGF0YVtjb2x1bW5OYW1lXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb2x1bW5UZXh0cztcbn1cbiJdfQ==