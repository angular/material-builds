/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read, __spread } from "tslib";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Data source for nested tree.
 *
 * The data source for nested tree doesn't have to consider node flattener, or the way to expand
 * or collapse. The expansion/collapsion will be handled by TreeControl and each non-leaf node.
 */
var MatTreeNestedDataSource = /** @class */ (function (_super) {
    __extends(MatTreeNestedDataSource, _super);
    function MatTreeNestedDataSource() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._data = new BehaviorSubject([]);
        return _this;
    }
    Object.defineProperty(MatTreeNestedDataSource.prototype, "data", {
        /**
         * Data for the nested tree
         */
        get: function () { return this._data.value; },
        set: function (value) { this._data.next(value); },
        enumerable: true,
        configurable: true
    });
    MatTreeNestedDataSource.prototype.connect = function (collectionViewer) {
        var _this = this;
        return merge.apply(void 0, __spread([collectionViewer.viewChange, this._data])).pipe(map(function () {
            return _this.data;
        }));
    };
    MatTreeNestedDataSource.prototype.disconnect = function () {
        // no op
    };
    return MatTreeNestedDataSource;
}(DataSource));
export { MatTreeNestedDataSource };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLWRhdGEtc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvZGF0YS1zb3VyY2UvbmVzdGVkLWRhdGEtc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQW1CLFVBQVUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxlQUFlLEVBQUUsS0FBSyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUduQzs7Ozs7R0FLRztBQUNIO0lBQWdELDJDQUFhO0lBQTdEO1FBQUEscUVBbUJDO1FBbEJDLFdBQUssR0FBRyxJQUFJLGVBQWUsQ0FBTSxFQUFFLENBQUMsQ0FBQzs7SUFrQnZDLENBQUM7SUFiQyxzQkFBSSx5Q0FBSTtRQUhSOztXQUVHO2FBQ0gsY0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUN2QyxVQUFTLEtBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQURUO0lBR3ZDLHlDQUFPLEdBQVAsVUFBUSxnQkFBa0M7UUFBMUMsaUJBS0M7UUFKQyxPQUFPLEtBQUssd0JBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUN0RCxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ1IsT0FBTyxLQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUQsNENBQVUsR0FBVjtRQUNFLFFBQVE7SUFDVixDQUFDO0lBQ0gsOEJBQUM7QUFBRCxDQUFDLEFBbkJELENBQWdELFVBQVUsR0FtQnpEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29sbGVjdGlvblZpZXdlciwgRGF0YVNvdXJjZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBtZXJnZSwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbi8qKlxuICogRGF0YSBzb3VyY2UgZm9yIG5lc3RlZCB0cmVlLlxuICpcbiAqIFRoZSBkYXRhIHNvdXJjZSBmb3IgbmVzdGVkIHRyZWUgZG9lc24ndCBoYXZlIHRvIGNvbnNpZGVyIG5vZGUgZmxhdHRlbmVyLCBvciB0aGUgd2F5IHRvIGV4cGFuZFxuICogb3IgY29sbGFwc2UuIFRoZSBleHBhbnNpb24vY29sbGFwc2lvbiB3aWxsIGJlIGhhbmRsZWQgYnkgVHJlZUNvbnRyb2wgYW5kIGVhY2ggbm9uLWxlYWYgbm9kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVOZXN0ZWREYXRhU291cmNlPFQ+IGV4dGVuZHMgRGF0YVNvdXJjZTxUPiB7XG4gIF9kYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KFtdKTtcblxuICAvKipcbiAgICogRGF0YSBmb3IgdGhlIG5lc3RlZCB0cmVlXG4gICAqL1xuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWU7IH1cbiAgc2V0IGRhdGEodmFsdWU6IFRbXSkgeyB0aGlzLl9kYXRhLm5leHQodmFsdWUpOyB9XG5cbiAgY29ubmVjdChjb2xsZWN0aW9uVmlld2VyOiBDb2xsZWN0aW9uVmlld2VyKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gbWVyZ2UoLi4uW2NvbGxlY3Rpb25WaWV3ZXIudmlld0NoYW5nZSwgdGhpcy5fZGF0YV0pXG4gICAgICAucGlwZShtYXAoKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgfSkpO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICAvLyBubyBvcFxuICB9XG59XG5cbiJdfQ==