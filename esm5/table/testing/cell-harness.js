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
        .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); })
        .addOption('columnName', options.columnName, function (harness, name) { return HarnessPredicate.stringMatches(harness.getColumnName(), name); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYmxlL3Rlc3RpbmcvY2VsbC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGdCQUFnQixHQUVqQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLDJFQUEyRTtBQUMzRTtJQUFvQyxrQ0FBZ0I7SUFBcEQ7O0lBa0NBLENBQUM7SUE5QkM7Ozs7T0FJRztJQUNJLG1CQUFJLEdBQVgsVUFBWSxPQUFnQztRQUFoQyx3QkFBQSxFQUFBLFlBQWdDO1FBQzFDLE9BQU8sZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCw0QkFBNEI7SUFDdEIsZ0NBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQsNERBQTREO0lBQ3RELHNDQUFhLEdBQW5COzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQ1AscUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBQTs7d0JBQWpELGNBQWMsR0FBRyxTQUFnQzt3QkFFdkQsSUFBSSxjQUFjLEVBQUU7NEJBQ1osV0FBUyxhQUFhLENBQUM7NEJBQ3ZCLFNBQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFNLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDOzRCQUUxRixJQUFJLE1BQUksRUFBRTtnQ0FDUixzQkFBTyxNQUFJLENBQUMsS0FBSyxDQUFDLFFBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDOzZCQUM5Qjt5QkFDRjt3QkFFRCxNQUFNLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDOzs7O0tBQ3pEO0lBaENELHdFQUF3RTtJQUNqRSwyQkFBWSxHQUFHLFdBQVcsQ0FBQztJQWdDcEMscUJBQUM7Q0FBQSxBQWxDRCxDQUFvQyxnQkFBZ0IsR0FrQ25EO1NBbENZLGNBQWM7QUFvQzNCLGtGQUFrRjtBQUNsRjtJQUEwQyx3Q0FBYztJQUF4RDs7SUFhQSxDQUFDO0lBVEM7Ozs7O09BS0c7SUFDSSx5QkFBSSxHQUFYLFVBQVksT0FBZ0M7UUFBaEMsd0JBQUEsRUFBQSxZQUFnQztRQUMxQyxPQUFPLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFYRCw4RUFBOEU7SUFDdkUsaUNBQVksR0FBRyxrQkFBa0IsQ0FBQztJQVczQywyQkFBQztDQUFBLEFBYkQsQ0FBMEMsY0FBYyxHQWF2RDtTQWJZLG9CQUFvQjtBQWVqQyxrRkFBa0Y7QUFDbEY7SUFBMEMsd0NBQWM7SUFBeEQ7O0lBYUEsQ0FBQztJQVRDOzs7OztPQUtHO0lBQ0kseUJBQUksR0FBWCxVQUFZLE9BQWdDO1FBQWhDLHdCQUFBLEVBQUEsWUFBZ0M7UUFDMUMsT0FBTyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBWEQsOEVBQThFO0lBQ3ZFLGlDQUFZLEdBQUcsa0JBQWtCLENBQUM7SUFXM0MsMkJBQUM7Q0FBQSxBQWJELENBQTBDLGNBQWMsR0FhdkQ7U0FiWSxvQkFBb0I7QUFnQmpDLFNBQVMsZ0JBQWdCLENBQ3ZCLElBQW9DLEVBQ3BDLE9BQTJCO0lBQzNCLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsVUFBQyxPQUFPLEVBQUUsSUFBSSxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBdkQsQ0FBdUQsQ0FBQztTQUM5RSxTQUFTLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQ3ZDLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQTdELENBQTZELENBQUMsQ0FBQztBQUMxRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3Rvcixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtDZWxsSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdGFibGUtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGNlbGwuICovXG5leHBvcnQgY2xhc3MgTWF0Q2VsbEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRDZWxsSGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1jZWxsJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0YWJsZSBjZWxsIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Q2VsbEhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFByZWRpY2F0ZShNYXRDZWxsSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2VsbCdzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgY29sdW1uIHRoYXQgdGhlIGNlbGwgYmVsb25ncyB0by4gKi9cbiAgYXN5bmMgZ2V0Q29sdW1uTmFtZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBjbGFzc0F0dHJpYnV0ZSA9IGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuXG4gICAgaWYgKGNsYXNzQXR0cmlidXRlKSB7XG4gICAgICBjb25zdCBwcmVmaXggPSAnbWF0LWNvbHVtbi0nO1xuICAgICAgY29uc3QgbmFtZSA9IGNsYXNzQXR0cmlidXRlLnNwbGl0KCcgJykubWFwKGMgPT4gYy50cmltKCkpLmZpbmQoYyA9PiBjLnN0YXJ0c1dpdGgocHJlZml4KSk7XG5cbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lLnNwbGl0KHByZWZpeClbMV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgRXJyb3IoJ0NvdWxkIG5vdCBkZXRlcm1pbmUgY29sdW1uIG5hbWUgb2YgY2VsbC4nKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdGFibGUgaGVhZGVyIGNlbGwuICovXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyQ2VsbEhhcm5lc3MgZXh0ZW5kcyBNYXRDZWxsSGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0SGVhZGVyQ2VsbEhhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtaGVhZGVyLWNlbGwnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvclxuICAgKiBhIHRhYmxlIGhlYWRlciBjZWxsIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0SGVhZGVyQ2VsbEhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFByZWRpY2F0ZShNYXRIZWFkZXJDZWxsSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYmxlIGZvb3RlciBjZWxsLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEZvb3RlckNlbGxIYXJuZXNzIGV4dGVuZHMgTWF0Q2VsbEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEZvb3RlckNlbGxIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWZvb3Rlci1jZWxsJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3JcbiAgICogYSB0YWJsZSBmb290ZXIgY2VsbCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2VsbEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEZvb3RlckNlbGxIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldENlbGxQcmVkaWNhdGUoTWF0Rm9vdGVyQ2VsbEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gZ2V0Q2VsbFByZWRpY2F0ZTxUIGV4dGVuZHMgTWF0Q2VsbEhhcm5lc3M+KFxuICB0eXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gIG9wdGlvbnM6IENlbGxIYXJuZXNzRmlsdGVycyk6IEhhcm5lc3NQcmVkaWNhdGU8VD4ge1xuICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodHlwZSwgb3B0aW9ucylcbiAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSlcbiAgICAuYWRkT3B0aW9uKCdjb2x1bW5OYW1lJywgb3B0aW9ucy5jb2x1bW5OYW1lLFxuICAgICAgICAoaGFybmVzcywgbmFtZSkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0Q29sdW1uTmFtZSgpLCBuYW1lKSk7XG59XG4iXX0=