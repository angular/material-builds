/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
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
export { MatCellHarness };
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
export { MatHeaderCellHarness };
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
export { MatFooterCellHarness };
function getCellPredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3Rlc3RpbmcvY2VsbC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGdCQUFnQixHQUVqQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLDJFQUEyRTtBQUMzRTtJQUFvQyxrQ0FBZ0I7SUFBcEQ7O0lBa0NBLENBQUM7SUE5QkM7Ozs7T0FJRztJQUNJLG1CQUFJLEdBQVgsVUFBWSxPQUFnQztRQUFoQyx3QkFBQSxFQUFBLFlBQWdDO1FBQzFDLE9BQU8sZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCw0QkFBNEI7SUFDdEIsZ0NBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQsNERBQTREO0lBQ3RELHNDQUFhLEdBQW5COzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQ1AscUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBQTs7d0JBQWpELGNBQWMsR0FBRyxTQUFnQzt3QkFFdkQsSUFBSSxjQUFjLEVBQUU7NEJBQ1osV0FBUyxhQUFhLENBQUM7NEJBQ3ZCLFNBQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFNLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDOzRCQUUxRixJQUFJLE1BQUksRUFBRTtnQ0FDUixzQkFBTyxNQUFJLENBQUMsS0FBSyxDQUFDLFFBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDOzZCQUM5Qjt5QkFDRjt3QkFFRCxNQUFNLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDOzs7O0tBQ3pEO0lBaENELHdFQUF3RTtJQUNqRSwyQkFBWSxHQUFHLFdBQVcsQ0FBQztJQWdDcEMscUJBQUM7Q0FBQSxBQWxDRCxDQUFvQyxnQkFBZ0IsR0FrQ25EO1NBbENZLGNBQWM7QUFvQzNCLGtGQUFrRjtBQUNsRjtJQUEwQyx3Q0FBYztJQUF4RDs7SUFhQSxDQUFDO0lBVEM7Ozs7O09BS0c7SUFDSSx5QkFBSSxHQUFYLFVBQVksT0FBZ0M7UUFBaEMsd0JBQUEsRUFBQSxZQUFnQztRQUMxQyxPQUFPLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFYRCw4RUFBOEU7SUFDdkUsaUNBQVksR0FBRyxrQkFBa0IsQ0FBQztJQVczQywyQkFBQztDQUFBLEFBYkQsQ0FBMEMsY0FBYyxHQWF2RDtTQWJZLG9CQUFvQjtBQWVqQyxrRkFBa0Y7QUFDbEY7SUFBMEMsd0NBQWM7SUFBeEQ7O0lBYUEsQ0FBQztJQVRDOzs7OztPQUtHO0lBQ0kseUJBQUksR0FBWCxVQUFZLE9BQWdDO1FBQWhDLHdCQUFBLEVBQUEsWUFBZ0M7UUFDMUMsT0FBTyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBWEQsOEVBQThFO0lBQ3ZFLGlDQUFZLEdBQUcsa0JBQWtCLENBQUM7SUFXM0MsMkJBQUM7Q0FBQSxBQWJELENBQTBDLGNBQWMsR0FhdkQ7U0FiWSxvQkFBb0I7QUFnQmpDLFNBQVMsZ0JBQWdCLENBQ3ZCLElBQW9DLEVBQ3BDLE9BQTJCO0lBQzNCLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsVUFBQyxPQUFPLEVBQUUsSUFBSSxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBdkQsQ0FBdUQsQ0FBQyxDQUFDO0FBQ3BGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NlbGxIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90YWJsZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdGFibGUgY2VsbC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDZWxsSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdENlbGxIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWNlbGwnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRhYmxlIGNlbGwgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENlbGxIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRDZWxsSGFybmVzcz4ge1xuICAgIHJldHVybiBnZXRDZWxsUHJlZGljYXRlKE1hdENlbGxIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjZWxsJ3MgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBjb2x1bW4gdGhhdCB0aGUgY2VsbCBiZWxvbmdzIHRvLiAqL1xuICBhc3luYyBnZXRDb2x1bW5OYW1lKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IGNsYXNzQXR0cmlidXRlID0gYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cbiAgICBpZiAoY2xhc3NBdHRyaWJ1dGUpIHtcbiAgICAgIGNvbnN0IHByZWZpeCA9ICdtYXQtY29sdW1uLSc7XG4gICAgICBjb25zdCBuYW1lID0gY2xhc3NBdHRyaWJ1dGUuc3BsaXQoJyAnKS5tYXAoYyA9PiBjLnRyaW0oKSkuZmluZChjID0+IGMuc3RhcnRzV2l0aChwcmVmaXgpKTtcblxuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUuc3BsaXQocHJlZml4KVsxXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGRldGVybWluZSBjb2x1bW4gbmFtZSBvZiBjZWxsLicpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0YWJsZSBoZWFkZXIgY2VsbC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRIZWFkZXJDZWxsSGFybmVzcyBleHRlbmRzIE1hdENlbGxIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRIZWFkZXJDZWxsSGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1oZWFkZXItY2VsbCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yXG4gICAqIGEgdGFibGUgaGVhZGVyIGNlbGwgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENlbGxIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRIZWFkZXJDZWxsSGFybmVzcz4ge1xuICAgIHJldHVybiBnZXRDZWxsUHJlZGljYXRlKE1hdEhlYWRlckNlbGxIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdGFibGUgZm9vdGVyIGNlbGwuICovXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyQ2VsbEhhcm5lc3MgZXh0ZW5kcyBNYXRDZWxsSGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Rm9vdGVyQ2VsbEhhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZm9vdGVyLWNlbGwnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvclxuICAgKiBhIHRhYmxlIGZvb3RlciBjZWxsIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Rm9vdGVyQ2VsbEhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFByZWRpY2F0ZShNYXRGb290ZXJDZWxsSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBnZXRDZWxsUHJlZGljYXRlPFQgZXh0ZW5kcyBNYXRDZWxsSGFybmVzcz4oXG4gIHR5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgb3B0aW9uczogQ2VsbEhhcm5lc3NGaWx0ZXJzKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0eXBlLCBvcHRpb25zKVxuICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKTtcbn1cbiJdfQ==