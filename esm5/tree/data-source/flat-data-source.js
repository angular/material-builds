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
import { map, take } from 'rxjs/operators';
/**
 * Tree flattener to convert a normal type of node to node with children & level information.
 * Transform nested nodes of type `T` to flattened nodes of type `F`.
 *
 * For example, the input data of type `T` is nested, and contains its children data:
 *   SomeNode: {
 *     key: 'Fruits',
 *     children: [
 *       NodeOne: {
 *         key: 'Apple',
 *       },
 *       NodeTwo: {
 *        key: 'Pear',
 *      }
 *    ]
 *  }
 *  After flattener flatten the tree, the structure will become
 *  SomeNode: {
 *    key: 'Fruits',
 *    expandable: true,
 *    level: 1
 *  },
 *  NodeOne: {
 *    key: 'Apple',
 *    expandable: false,
 *    level: 2
 *  },
 *  NodeTwo: {
 *   key: 'Pear',
 *   expandable: false,
 *   level: 2
 * }
 * and the output flattened type is `F` with additional information.
 */
var MatTreeFlattener = /** @class */ (function () {
    function MatTreeFlattener(transformFunction, getLevel, isExpandable, getChildren) {
        this.transformFunction = transformFunction;
        this.getLevel = getLevel;
        this.isExpandable = isExpandable;
        this.getChildren = getChildren;
    }
    MatTreeFlattener.prototype._flattenNode = function (node, level, resultNodes, parentMap) {
        var _this = this;
        var flatNode = this.transformFunction(node, level);
        resultNodes.push(flatNode);
        if (this.isExpandable(flatNode)) {
            var childrenNodes = this.getChildren(node);
            if (childrenNodes) {
                if (Array.isArray(childrenNodes)) {
                    this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
                }
                else {
                    childrenNodes.pipe(take(1)).subscribe(function (children) {
                        _this._flattenChildren(children, level, resultNodes, parentMap);
                    });
                }
            }
        }
        return resultNodes;
    };
    MatTreeFlattener.prototype._flattenChildren = function (children, level, resultNodes, parentMap) {
        var _this = this;
        children.forEach(function (child, index) {
            var childParentMap = parentMap.slice();
            childParentMap.push(index != children.length - 1);
            _this._flattenNode(child, level + 1, resultNodes, childParentMap);
        });
    };
    /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     */
    MatTreeFlattener.prototype.flattenNodes = function (structuredData) {
        var _this = this;
        var resultNodes = [];
        structuredData.forEach(function (node) { return _this._flattenNode(node, 0, resultNodes, []); });
        return resultNodes;
    };
    /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     */
    MatTreeFlattener.prototype.expandFlattenedNodes = function (nodes, treeControl) {
        var _this = this;
        var results = [];
        var currentExpand = [];
        currentExpand[0] = true;
        nodes.forEach(function (node) {
            var expand = true;
            for (var i = 0; i <= _this.getLevel(node); i++) {
                expand = expand && currentExpand[i];
            }
            if (expand) {
                results.push(node);
            }
            if (_this.isExpandable(node)) {
                currentExpand[_this.getLevel(node) + 1] = treeControl.isExpanded(node);
            }
        });
        return results;
    };
    return MatTreeFlattener;
}());
export { MatTreeFlattener };
/**
 * Data source for flat tree.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `MatTree`.
 * The nested tree nodes of type `T` are flattened through `MatTreeFlattener`, and converted
 * to type `F` for `MatTree` to consume.
 */
var MatTreeFlatDataSource = /** @class */ (function (_super) {
    __extends(MatTreeFlatDataSource, _super);
    function MatTreeFlatDataSource(_treeControl, _treeFlattener, initialData) {
        if (initialData === void 0) { initialData = []; }
        var _this = _super.call(this) || this;
        _this._treeControl = _treeControl;
        _this._treeFlattener = _treeFlattener;
        _this._flattenedData = new BehaviorSubject([]);
        _this._expandedData = new BehaviorSubject([]);
        _this._data = new BehaviorSubject(initialData);
        return _this;
    }
    Object.defineProperty(MatTreeFlatDataSource.prototype, "data", {
        get: function () { return this._data.value; },
        set: function (value) {
            this._data.next(value);
            this._flattenedData.next(this._treeFlattener.flattenNodes(this.data));
            this._treeControl.dataNodes = this._flattenedData.value;
        },
        enumerable: true,
        configurable: true
    });
    MatTreeFlatDataSource.prototype.connect = function (collectionViewer) {
        var _this = this;
        var changes = [
            collectionViewer.viewChange,
            this._treeControl.expansionModel.changed,
            this._flattenedData
        ];
        return merge.apply(void 0, __spread(changes)).pipe(map(function () {
            _this._expandedData.next(_this._treeFlattener.expandFlattenedNodes(_this._flattenedData.value, _this._treeControl));
            return _this._expandedData.value;
        }));
    };
    MatTreeFlatDataSource.prototype.disconnect = function () {
        // no op
    };
    return MatTreeFlatDataSource;
}(DataSource));
export { MatTreeFlatDataSource };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1kYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL2RhdGEtc291cmNlL2ZsYXQtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBbUIsVUFBVSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFdEUsT0FBTyxFQUFDLGVBQWUsRUFBRSxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDeEQsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNHO0FBQ0g7SUFFRSwwQkFBbUIsaUJBQWdELEVBQ2hELFFBQTZCLEVBQzdCLFlBQWtDLEVBQ2xDLFdBQ3FDO1FBSnJDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBK0I7UUFDaEQsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFDN0IsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUMwQjtJQUFHLENBQUM7SUFFNUQsdUNBQVksR0FBWixVQUFhLElBQU8sRUFBRSxLQUFhLEVBQ3RCLFdBQWdCLEVBQUUsU0FBb0I7UUFEbkQsaUJBa0JDO1FBaEJDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxLQUFLLENBQUMsT0FB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UUFDRSxRQUFRO0lBQ1YsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQXBDRCxDQUFpRCxVQUFVLEdBb0MxRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbGxlY3Rpb25WaWV3ZXIsIERhdGFTb3VyY2V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge0ZsYXRUcmVlQ29udHJvbCwgVHJlZUNvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBtZXJnZSwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIFRyZWUgZmxhdHRlbmVyIHRvIGNvbnZlcnQgYSBub3JtYWwgdHlwZSBvZiBub2RlIHRvIG5vZGUgd2l0aCBjaGlsZHJlbiAmIGxldmVsIGluZm9ybWF0aW9uLlxuICogVHJhbnNmb3JtIG5lc3RlZCBub2RlcyBvZiB0eXBlIGBUYCB0byBmbGF0dGVuZWQgbm9kZXMgb2YgdHlwZSBgRmAuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBpbnB1dCBkYXRhIG9mIHR5cGUgYFRgIGlzIG5lc3RlZCwgYW5kIGNvbnRhaW5zIGl0cyBjaGlsZHJlbiBkYXRhOlxuICogICBTb21lTm9kZToge1xuICogICAgIGtleTogJ0ZydWl0cycsXG4gKiAgICAgY2hpbGRyZW46IFtcbiAqICAgICAgIE5vZGVPbmU6IHtcbiAqICAgICAgICAga2V5OiAnQXBwbGUnLFxuICogICAgICAgfSxcbiAqICAgICAgIE5vZGVUd286IHtcbiAqICAgICAgICBrZXk6ICdQZWFyJyxcbiAqICAgICAgfVxuICogICAgXVxuICogIH1cbiAqICBBZnRlciBmbGF0dGVuZXIgZmxhdHRlbiB0aGUgdHJlZSwgdGhlIHN0cnVjdHVyZSB3aWxsIGJlY29tZVxuICogIFNvbWVOb2RlOiB7XG4gKiAgICBrZXk6ICdGcnVpdHMnLFxuICogICAgZXhwYW5kYWJsZTogdHJ1ZSxcbiAqICAgIGxldmVsOiAxXG4gKiAgfSxcbiAqICBOb2RlT25lOiB7XG4gKiAgICBrZXk6ICdBcHBsZScsXG4gKiAgICBleHBhbmRhYmxlOiBmYWxzZSxcbiAqICAgIGxldmVsOiAyXG4gKiAgfSxcbiAqICBOb2RlVHdvOiB7XG4gKiAgIGtleTogJ1BlYXInLFxuICogICBleHBhbmRhYmxlOiBmYWxzZSxcbiAqICAgbGV2ZWw6IDJcbiAqIH1cbiAqIGFuZCB0aGUgb3V0cHV0IGZsYXR0ZW5lZCB0eXBlIGlzIGBGYCB3aXRoIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUcmVlRmxhdHRlbmVyPFQsIEY+IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHJhbnNmb3JtRnVuY3Rpb246IChub2RlOiBULCBsZXZlbDogbnVtYmVyKSA9PiBGLFxuICAgICAgICAgICAgICBwdWJsaWMgZ2V0TGV2ZWw6IChub2RlOiBGKSA9PiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBpc0V4cGFuZGFibGU6IChub2RlOiBGKSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW46IChub2RlOiBUKSA9PlxuICAgICAgICAgICAgICAgICAgT2JzZXJ2YWJsZTxUW10+IHwgVFtdIHwgdW5kZWZpbmVkIHwgbnVsbCkge31cblxuICBfZmxhdHRlbk5vZGUobm9kZTogVCwgbGV2ZWw6IG51bWJlcixcbiAgICAgICAgICAgICAgIHJlc3VsdE5vZGVzOiBGW10sIHBhcmVudE1hcDogYm9vbGVhbltdKTogRltdIHtcbiAgICBjb25zdCBmbGF0Tm9kZSA9IHRoaXMudHJhbnNmb3JtRnVuY3Rpb24obm9kZSwgbGV2ZWwpO1xuICAgIHJlc3VsdE5vZGVzLnB1c2goZmxhdE5vZGUpO1xuXG4gICAgaWYgKHRoaXMuaXNFeHBhbmRhYmxlKGZsYXROb2RlKSkge1xuICAgICAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IHRoaXMuZ2V0Q2hpbGRyZW4obm9kZSk7XG4gICAgICBpZiAoY2hpbGRyZW5Ob2Rlcykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbk5vZGVzKSkge1xuICAgICAgICAgIHRoaXMuX2ZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbk5vZGVzLCBsZXZlbCwgcmVzdWx0Tm9kZXMsIHBhcmVudE1hcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGRyZW5Ob2Rlcy5waXBlKHRha2UoMSkpLnN1YnNjcmliZShjaGlsZHJlbiA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW4sIGxldmVsLCByZXN1bHROb2RlcywgcGFyZW50TWFwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XG4gIH1cblxuICBfZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuOiBUW10sIGxldmVsOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgcmVzdWx0Tm9kZXM6IEZbXSwgcGFyZW50TWFwOiBib29sZWFuW10pOiB2b2lkIHtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBjaGlsZFBhcmVudE1hcDogYm9vbGVhbltdID0gcGFyZW50TWFwLnNsaWNlKCk7XG4gICAgICBjaGlsZFBhcmVudE1hcC5wdXNoKGluZGV4ICE9IGNoaWxkcmVuLmxlbmd0aCAtIDEpO1xuICAgICAgdGhpcy5fZmxhdHRlbk5vZGUoY2hpbGQsIGxldmVsICsgMSwgcmVzdWx0Tm9kZXMsIGNoaWxkUGFyZW50TWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVuIGEgbGlzdCBvZiBub2RlIHR5cGUgVCB0byBmbGF0dGVuZWQgdmVyc2lvbiBvZiBub2RlIEYuXG4gICAqIFBsZWFzZSBub3RlIHRoYXQgdHlwZSBUIG1heSBiZSBuZXN0ZWQsIGFuZCB0aGUgbGVuZ3RoIG9mIGBzdHJ1Y3R1cmVkRGF0YWAgbWF5IGJlIGRpZmZlcmVudFxuICAgKiBmcm9tIHRoYXQgb2YgcmV0dXJuZWQgbGlzdCBgRltdYC5cbiAgICovXG4gIGZsYXR0ZW5Ob2RlcyhzdHJ1Y3R1cmVkRGF0YTogVFtdKTogRltdIHtcbiAgICBsZXQgcmVzdWx0Tm9kZXM6IEZbXSA9IFtdO1xuICAgIHN0cnVjdHVyZWREYXRhLmZvckVhY2gobm9kZSA9PiB0aGlzLl9mbGF0dGVuTm9kZShub2RlLCAwLCByZXN1bHROb2RlcywgW10pKTtcbiAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XG4gIH1cblxuICAvKipcbiAgICogRXhwYW5kIGZsYXR0ZW5lZCBub2RlIHdpdGggY3VycmVudCBleHBhbnNpb24gc3RhdHVzLlxuICAgKiBUaGUgcmV0dXJuZWQgbGlzdCBtYXkgaGF2ZSBkaWZmZXJlbnQgbGVuZ3RoLlxuICAgKi9cbiAgZXhwYW5kRmxhdHRlbmVkTm9kZXMobm9kZXM6IEZbXSwgdHJlZUNvbnRyb2w6IFRyZWVDb250cm9sPEY+KTogRltdIHtcbiAgICBsZXQgcmVzdWx0czogRltdID0gW107XG4gICAgbGV0IGN1cnJlbnRFeHBhbmQ6IGJvb2xlYW5bXSA9IFtdO1xuICAgIGN1cnJlbnRFeHBhbmRbMF0gPSB0cnVlO1xuXG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGxldCBleHBhbmQgPSB0cnVlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5nZXRMZXZlbChub2RlKTsgaSsrKSB7XG4gICAgICAgIGV4cGFuZCA9IGV4cGFuZCAmJiBjdXJyZW50RXhwYW5kW2ldO1xuICAgICAgfVxuICAgICAgaWYgKGV4cGFuZCkge1xuICAgICAgICByZXN1bHRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUobm9kZSkpIHtcbiAgICAgICAgY3VycmVudEV4cGFuZFt0aGlzLmdldExldmVsKG5vZGUpICsgMV0gPSB0cmVlQ29udHJvbC5pc0V4cGFuZGVkKG5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG59XG5cblxuLyoqXG4gKiBEYXRhIHNvdXJjZSBmb3IgZmxhdCB0cmVlLlxuICogVGhlIGRhdGEgc291cmNlIG5lZWQgdG8gaGFuZGxlIGV4cGFuc2lvbi9jb2xsYXBzaW9uIG9mIHRoZSB0cmVlIG5vZGUgYW5kIGNoYW5nZSB0aGUgZGF0YSBmZWVkXG4gKiB0byBgTWF0VHJlZWAuXG4gKiBUaGUgbmVzdGVkIHRyZWUgbm9kZXMgb2YgdHlwZSBgVGAgYXJlIGZsYXR0ZW5lZCB0aHJvdWdoIGBNYXRUcmVlRmxhdHRlbmVyYCwgYW5kIGNvbnZlcnRlZFxuICogdG8gdHlwZSBgRmAgZm9yIGBNYXRUcmVlYCB0byBjb25zdW1lLlxuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZUZsYXREYXRhU291cmNlPFQsIEY+IGV4dGVuZHMgRGF0YVNvdXJjZTxGPiB7XG4gIF9mbGF0dGVuZWREYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGW10+KFtdKTtcblxuICBfZXhwYW5kZWREYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGW10+KFtdKTtcblxuICBfZGF0YTogQmVoYXZpb3JTdWJqZWN0PFRbXT47XG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZTsgfVxuICBzZXQgZGF0YSh2YWx1ZTogVFtdKSB7XG4gICAgdGhpcy5fZGF0YS5uZXh0KHZhbHVlKTtcbiAgICB0aGlzLl9mbGF0dGVuZWREYXRhLm5leHQodGhpcy5fdHJlZUZsYXR0ZW5lci5mbGF0dGVuTm9kZXModGhpcy5kYXRhKSk7XG4gICAgdGhpcy5fdHJlZUNvbnRyb2wuZGF0YU5vZGVzID0gdGhpcy5fZmxhdHRlbmVkRGF0YS52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RyZWVDb250cm9sOiBGbGF0VHJlZUNvbnRyb2w8Rj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX3RyZWVGbGF0dGVuZXI6IE1hdFRyZWVGbGF0dGVuZXI8VCwgRj4sXG4gICAgICAgICAgICAgIGluaXRpYWxEYXRhOiBUW10gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihpbml0aWFsRGF0YSk7XG4gIH1cblxuICBjb25uZWN0KGNvbGxlY3Rpb25WaWV3ZXI6IENvbGxlY3Rpb25WaWV3ZXIpOiBPYnNlcnZhYmxlPEZbXT4ge1xuICAgIGNvbnN0IGNoYW5nZXMgPSBbXG4gICAgICBjb2xsZWN0aW9uVmlld2VyLnZpZXdDaGFuZ2UsXG4gICAgICB0aGlzLl90cmVlQ29udHJvbC5leHBhbnNpb25Nb2RlbC5jaGFuZ2VkLFxuICAgICAgdGhpcy5fZmxhdHRlbmVkRGF0YVxuICAgIF07XG4gICAgcmV0dXJuIG1lcmdlKC4uLmNoYW5nZXMpLnBpcGUobWFwKCgpID0+IHtcbiAgICAgIHRoaXMuX2V4cGFuZGVkRGF0YS5uZXh0KFxuICAgICAgICB0aGlzLl90cmVlRmxhdHRlbmVyLmV4cGFuZEZsYXR0ZW5lZE5vZGVzKHRoaXMuX2ZsYXR0ZW5lZERhdGEudmFsdWUsIHRoaXMuX3RyZWVDb250cm9sKSk7XG4gICAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWREYXRhLnZhbHVlO1xuICAgIH0pKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgLy8gbm8gb3BcbiAgfVxufVxuIl19