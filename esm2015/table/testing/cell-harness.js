/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material table cell. */
export class MatCellHarness extends ContentContainerComponentHarness {
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
export class MatHeaderCellHarness extends MatCellHarness {
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
export class MatFooterCellHarness extends MatCellHarness {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3Rlc3RpbmcvY2VsbC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGdDQUFnQyxFQUNqQyxNQUFNLHNCQUFzQixDQUFDO0FBRzlCLDJFQUEyRTtBQUMzRSxNQUFNLE9BQU8sY0FBZSxTQUFRLGdDQUFnQztJQUlsRTs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCw0QkFBNEI7SUFDdEIsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRCw0REFBNEQ7SUFDdEQsYUFBYTs7WUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXhELElBQUksY0FBYyxFQUFFO2dCQUNsQixNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUM7Z0JBQzdCLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUUxRixJQUFJLElBQUksRUFBRTtvQkFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Y7WUFFRCxNQUFNLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQzFELENBQUM7S0FBQTs7QUFoQ0Qsd0VBQXdFO0FBQ2pFLDJCQUFZLEdBQUcsV0FBVyxDQUFDO0FBa0NwQyxrRkFBa0Y7QUFDbEYsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGNBQWM7SUFJdEQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQThCLEVBQUU7UUFDMUMsT0FBTyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDOztBQVhELDhFQUE4RTtBQUN2RSxpQ0FBWSxHQUFHLGtCQUFrQixDQUFDO0FBYTNDLGtGQUFrRjtBQUNsRixNQUFNLE9BQU8sb0JBQXFCLFNBQVEsY0FBYztJQUl0RDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBOEIsRUFBRTtRQUMxQyxPQUFPLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7O0FBWEQsOEVBQThFO0FBQ3ZFLGlDQUFZLEdBQUcsa0JBQWtCLENBQUM7QUFjM0MsU0FBUyxnQkFBZ0IsQ0FDdkIsSUFBb0MsRUFDcEMsT0FBMkI7SUFDM0IsT0FBTyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7U0FDdkMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDOUUsU0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVSxFQUN2QyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3Ncbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtDZWxsSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdGFibGUtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGNlbGwuICovXG5leHBvcnQgY2xhc3MgTWF0Q2VsbEhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Q2VsbEhhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtY2VsbCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgdGFibGUgY2VsbCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2VsbEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdENlbGxIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldENlbGxQcmVkaWNhdGUoTWF0Q2VsbEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNlbGwncyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGNvbHVtbiB0aGF0IHRoZSBjZWxsIGJlbG9uZ3MgdG8uICovXG4gIGFzeW5jIGdldENvbHVtbk5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgY2xhc3NBdHRyaWJ1dGUgPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcblxuICAgIGlmIChjbGFzc0F0dHJpYnV0ZSkge1xuICAgICAgY29uc3QgcHJlZml4ID0gJ21hdC1jb2x1bW4tJztcbiAgICAgIGNvbnN0IG5hbWUgPSBjbGFzc0F0dHJpYnV0ZS5zcGxpdCgnICcpLm1hcChjID0+IGMudHJpbSgpKS5maW5kKGMgPT4gYy5zdGFydHNXaXRoKHByZWZpeCkpO1xuXG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZS5zcGxpdChwcmVmaXgpWzFdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IEVycm9yKCdDb3VsZCBub3QgZGV0ZXJtaW5lIGNvbHVtbiBuYW1lIG9mIGNlbGwuJyk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGhlYWRlciBjZWxsLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEhlYWRlckNlbGxIYXJuZXNzIGV4dGVuZHMgTWF0Q2VsbEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEhlYWRlckNlbGxIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWhlYWRlci1jZWxsJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3JcbiAgICogYSB0YWJsZSBoZWFkZXIgY2VsbCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2VsbEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEhlYWRlckNlbGxIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldENlbGxQcmVkaWNhdGUoTWF0SGVhZGVyQ2VsbEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0YWJsZSBmb290ZXIgY2VsbC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJDZWxsSGFybmVzcyBleHRlbmRzIE1hdENlbGxIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRGb290ZXJDZWxsSGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1mb290ZXItY2VsbCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yXG4gICAqIGEgdGFibGUgZm9vdGVyIGNlbGwgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENlbGxIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRGb290ZXJDZWxsSGFybmVzcz4ge1xuICAgIHJldHVybiBnZXRDZWxsUHJlZGljYXRlKE1hdEZvb3RlckNlbGxIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGdldENlbGxQcmVkaWNhdGU8VCBleHRlbmRzIE1hdENlbGxIYXJuZXNzPihcbiAgdHlwZTogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICBvcHRpb25zOiBDZWxsSGFybmVzc0ZpbHRlcnMpOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHR5cGUsIG9wdGlvbnMpXG4gICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgLmFkZE9wdGlvbignY29sdW1uTmFtZScsIG9wdGlvbnMuY29sdW1uTmFtZSxcbiAgICAgICAgKGhhcm5lc3MsIG5hbWUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldENvbHVtbk5hbWUoKSwgbmFtZSkpO1xufVxuIl19