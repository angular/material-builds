/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tree/data-source/flat-data-source.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
 * @template T, F
 */
export class MatTreeFlattener {
    /**
     * @param {?} transformFunction
     * @param {?} getLevel
     * @param {?} isExpandable
     * @param {?} getChildren
     */
    constructor(transformFunction, getLevel, isExpandable, getChildren) {
        this.transformFunction = transformFunction;
        this.getLevel = getLevel;
        this.isExpandable = isExpandable;
        this.getChildren = getChildren;
    }
    /**
     * @param {?} node
     * @param {?} level
     * @param {?} resultNodes
     * @param {?} parentMap
     * @return {?}
     */
    _flattenNode(node, level, resultNodes, parentMap) {
        /** @type {?} */
        const flatNode = this.transformFunction(node, level);
        resultNodes.push(flatNode);
        if (this.isExpandable(flatNode)) {
            /** @type {?} */
            const childrenNodes = this.getChildren(node);
            if (childrenNodes) {
                if (Array.isArray(childrenNodes)) {
                    this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
                }
                else {
                    childrenNodes.pipe(take(1)).subscribe((/**
                     * @param {?} children
                     * @return {?}
                     */
                    children => {
                        this._flattenChildren(children, level, resultNodes, parentMap);
                    }));
                }
            }
        }
        return resultNodes;
    }
    /**
     * @param {?} children
     * @param {?} level
     * @param {?} resultNodes
     * @param {?} parentMap
     * @return {?}
     */
    _flattenChildren(children, level, resultNodes, parentMap) {
        children.forEach((/**
         * @param {?} child
         * @param {?} index
         * @return {?}
         */
        (child, index) => {
            /** @type {?} */
            let childParentMap = parentMap.slice();
            childParentMap.push(index != children.length - 1);
            this._flattenNode(child, level + 1, resultNodes, childParentMap);
        }));
    }
    /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     * @param {?} structuredData
     * @return {?}
     */
    flattenNodes(structuredData) {
        /** @type {?} */
        let resultNodes = [];
        structuredData.forEach((/**
         * @param {?} node
         * @return {?}
         */
        node => this._flattenNode(node, 0, resultNodes, [])));
        return resultNodes;
    }
    /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     * @param {?} nodes
     * @param {?} treeControl
     * @return {?}
     */
    expandFlattenedNodes(nodes, treeControl) {
        /** @type {?} */
        let results = [];
        /** @type {?} */
        let currentExpand = [];
        currentExpand[0] = true;
        nodes.forEach((/**
         * @param {?} node
         * @return {?}
         */
        node => {
            /** @type {?} */
            let expand = true;
            for (let i = 0; i <= this.getLevel(node); i++) {
                expand = expand && currentExpand[i];
            }
            if (expand) {
                results.push(node);
            }
            if (this.isExpandable(node)) {
                currentExpand[this.getLevel(node) + 1] = treeControl.isExpanded(node);
            }
        }));
        return results;
    }
}
if (false) {
    /** @type {?} */
    MatTreeFlattener.prototype.transformFunction;
    /** @type {?} */
    MatTreeFlattener.prototype.getLevel;
    /** @type {?} */
    MatTreeFlattener.prototype.isExpandable;
    /** @type {?} */
    MatTreeFlattener.prototype.getChildren;
}
/**
 * Data source for flat tree.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `MatTree`.
 * The nested tree nodes of type `T` are flattened through `MatTreeFlattener`, and converted
 * to type `F` for `MatTree` to consume.
 * @template T, F
 */
export class MatTreeFlatDataSource extends DataSource {
    /**
     * @param {?} _treeControl
     * @param {?} _treeFlattener
     * @param {?=} initialData
     */
    constructor(_treeControl, _treeFlattener, initialData = []) {
        super();
        this._treeControl = _treeControl;
        this._treeFlattener = _treeFlattener;
        this._flattenedData = new BehaviorSubject([]);
        this._expandedData = new BehaviorSubject([]);
        this._data = new BehaviorSubject(initialData);
    }
    /**
     * @return {?}
     */
    get data() { return this._data.value; }
    /**
     * @param {?} value
     * @return {?}
     */
    set data(value) {
        this._data.next(value);
        this._flattenedData.next(this._treeFlattener.flattenNodes(this.data));
        this._treeControl.dataNodes = this._flattenedData.value;
    }
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    connect(collectionViewer) {
        /** @type {?} */
        const changes = [
            collectionViewer.viewChange,
            this._treeControl.expansionModel.changed,
            this._flattenedData
        ];
        return merge(...changes).pipe(map((/**
         * @return {?}
         */
        () => {
            this._expandedData.next(this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeControl));
            return this._expandedData.value;
        })));
    }
    /**
     * @return {?}
     */
    disconnect() {
        // no op
    }
}
if (false) {
    /** @type {?} */
    MatTreeFlatDataSource.prototype._flattenedData;
    /** @type {?} */
    MatTreeFlatDataSource.prototype._expandedData;
    /** @type {?} */
    MatTreeFlatDataSource.prototype._data;
    /**
     * @type {?}
     * @private
     */
    MatTreeFlatDataSource.prototype._treeControl;
    /**
     * @type {?}
     * @private
     */
    MatTreeFlatDataSource.prototype._treeFlattener;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1kYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL2RhdGEtc291cmNlL2ZsYXQtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFtQixVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RSxPQUFPLEVBQUMsZUFBZSxFQUFFLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQ3pDLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7Ozs7SUFFM0IsWUFBbUIsaUJBQWdELEVBQ2hELFFBQTZCLEVBQzdCLFlBQWtDLEVBQ2xDLFdBQ3FDO1FBSnJDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBK0I7UUFDaEQsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFDN0IsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUMwQjtJQUFHLENBQUM7Ozs7Ozs7O0lBRTVELFlBQVksQ0FBQyxJQUFPLEVBQUUsS0FBYSxFQUN0QixXQUFnQixFQUFFLFNBQW9COztjQUMzQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7O2tCQUN6QixhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDNUMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDaEMs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eEMsK0NBQThDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29sbGVjdGlvblZpZXdlciwgRGF0YVNvdXJjZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7RmxhdFRyZWVDb250cm9sLCBUcmVlQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIG1lcmdlLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogVHJlZSBmbGF0dGVuZXIgdG8gY29udmVydCBhIG5vcm1hbCB0eXBlIG9mIG5vZGUgdG8gbm9kZSB3aXRoIGNoaWxkcmVuICYgbGV2ZWwgaW5mb3JtYXRpb24uXG4gKiBUcmFuc2Zvcm0gbmVzdGVkIG5vZGVzIG9mIHR5cGUgYFRgIHRvIGZsYXR0ZW5lZCBub2RlcyBvZiB0eXBlIGBGYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGhlIGlucHV0IGRhdGEgb2YgdHlwZSBgVGAgaXMgbmVzdGVkLCBhbmQgY29udGFpbnMgaXRzIGNoaWxkcmVuIGRhdGE6XG4gKiAgIFNvbWVOb2RlOiB7XG4gKiAgICAga2V5OiAnRnJ1aXRzJyxcbiAqICAgICBjaGlsZHJlbjogW1xuICogICAgICAgTm9kZU9uZToge1xuICogICAgICAgICBrZXk6ICdBcHBsZScsXG4gKiAgICAgICB9LFxuICogICAgICAgTm9kZVR3bzoge1xuICogICAgICAgIGtleTogJ1BlYXInLFxuICogICAgICB9XG4gKiAgICBdXG4gKiAgfVxuICogIEFmdGVyIGZsYXR0ZW5lciBmbGF0dGVuIHRoZSB0cmVlLCB0aGUgc3RydWN0dXJlIHdpbGwgYmVjb21lXG4gKiAgU29tZU5vZGU6IHtcbiAqICAgIGtleTogJ0ZydWl0cycsXG4gKiAgICBleHBhbmRhYmxlOiB0cnVlLFxuICogICAgbGV2ZWw6IDFcbiAqICB9LFxuICogIE5vZGVPbmU6IHtcbiAqICAgIGtleTogJ0FwcGxlJyxcbiAqICAgIGV4cGFuZGFibGU6IGZhbHNlLFxuICogICAgbGV2ZWw6IDJcbiAqICB9LFxuICogIE5vZGVUd286IHtcbiAqICAga2V5OiAnUGVhcicsXG4gKiAgIGV4cGFuZGFibGU6IGZhbHNlLFxuICogICBsZXZlbDogMlxuICogfVxuICogYW5kIHRoZSBvdXRwdXQgZmxhdHRlbmVkIHR5cGUgaXMgYEZgIHdpdGggYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVGbGF0dGVuZXI8VCwgRj4ge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmFuc2Zvcm1GdW5jdGlvbjogKG5vZGU6IFQsIGxldmVsOiBudW1iZXIpID0+IEYsXG4gICAgICAgICAgICAgIHB1YmxpYyBnZXRMZXZlbDogKG5vZGU6IEYpID0+IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIGlzRXhwYW5kYWJsZTogKG5vZGU6IEYpID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbjogKG5vZGU6IFQpID0+XG4gICAgICAgICAgICAgICAgICBPYnNlcnZhYmxlPFRbXT4gfCBUW10gfCB1bmRlZmluZWQgfCBudWxsKSB7fVxuXG4gIF9mbGF0dGVuTm9kZShub2RlOiBULCBsZXZlbDogbnVtYmVyLFxuICAgICAgICAgICAgICAgcmVzdWx0Tm9kZXM6IEZbXSwgcGFyZW50TWFwOiBib29sZWFuW10pOiBGW10ge1xuICAgIGNvbnN0IGZsYXROb2RlID0gdGhpcy50cmFuc2Zvcm1GdW5jdGlvbihub2RlLCBsZXZlbCk7XG4gICAgcmVzdWx0Tm9kZXMucHVzaChmbGF0Tm9kZSk7XG5cbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoZmxhdE5vZGUpKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbk5vZGVzID0gdGhpcy5nZXRDaGlsZHJlbihub2RlKTtcbiAgICAgIGlmIChjaGlsZHJlbk5vZGVzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuTm9kZXMpKSB7XG4gICAgICAgICAgdGhpcy5fZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuTm9kZXMsIGxldmVsLCByZXN1bHROb2RlcywgcGFyZW50TWFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZHJlbk5vZGVzLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKGNoaWxkcmVuID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2ZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbiwgbGV2ZWwsIHJlc3VsdE5vZGVzLCBwYXJlbnRNYXApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgfVxuXG4gIF9mbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW46IFRbXSwgbGV2ZWw6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICByZXN1bHROb2RlczogRltdLCBwYXJlbnRNYXA6IGJvb2xlYW5bXSk6IHZvaWQge1xuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGNoaWxkUGFyZW50TWFwOiBib29sZWFuW10gPSBwYXJlbnRNYXAuc2xpY2UoKTtcbiAgICAgIGNoaWxkUGFyZW50TWFwLnB1c2goaW5kZXggIT0gY2hpbGRyZW4ubGVuZ3RoIC0gMSk7XG4gICAgICB0aGlzLl9mbGF0dGVuTm9kZShjaGlsZCwgbGV2ZWwgKyAxLCByZXN1bHROb2RlcywgY2hpbGRQYXJlbnRNYXApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsYXR0ZW4gYSBsaXN0IG9mIG5vZGUgdHlwZSBUIHRvIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIG5vZGUgRi5cbiAgICogUGxlYXNlIG5vdGUgdGhhdCB0eXBlIFQgbWF5IGJlIG5lc3RlZCwgYW5kIHRoZSBsZW5ndGggb2YgYHN0cnVjdHVyZWREYXRhYCBtYXkgYmUgZGlmZmVyZW50XG4gICAqIGZyb20gdGhhdCBvZiByZXR1cm5lZCBsaXN0IGBGW11gLlxuICAgKi9cbiAgZmxhdHRlbk5vZGVzKHN0cnVjdHVyZWREYXRhOiBUW10pOiBGW10ge1xuICAgIGxldCByZXN1bHROb2RlczogRltdID0gW107XG4gICAgc3RydWN0dXJlZERhdGEuZm9yRWFjaChub2RlID0+IHRoaXMuX2ZsYXR0ZW5Ob2RlKG5vZGUsIDAsIHJlc3VsdE5vZGVzLCBbXSkpO1xuICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmQgZmxhdHRlbmVkIG5vZGUgd2l0aCBjdXJyZW50IGV4cGFuc2lvbiBzdGF0dXMuXG4gICAqIFRoZSByZXR1cm5lZCBsaXN0IG1heSBoYXZlIGRpZmZlcmVudCBsZW5ndGguXG4gICAqL1xuICBleHBhbmRGbGF0dGVuZWROb2Rlcyhub2RlczogRltdLCB0cmVlQ29udHJvbDogVHJlZUNvbnRyb2w8Rj4pOiBGW10ge1xuICAgIGxldCByZXN1bHRzOiBGW10gPSBbXTtcbiAgICBsZXQgY3VycmVudEV4cGFuZDogYm9vbGVhbltdID0gW107XG4gICAgY3VycmVudEV4cGFuZFswXSA9IHRydWU7XG5cbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgbGV0IGV4cGFuZCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmdldExldmVsKG5vZGUpOyBpKyspIHtcbiAgICAgICAgZXhwYW5kID0gZXhwYW5kICYmIGN1cnJlbnRFeHBhbmRbaV07XG4gICAgICB9XG4gICAgICBpZiAoZXhwYW5kKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzRXhwYW5kYWJsZShub2RlKSkge1xuICAgICAgICBjdXJyZW50RXhwYW5kW3RoaXMuZ2V0TGV2ZWwobm9kZSkgKyAxXSA9IHRyZWVDb250cm9sLmlzRXhwYW5kZWQobm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cblxuXG4vKipcbiAqIERhdGEgc291cmNlIGZvciBmbGF0IHRyZWUuXG4gKiBUaGUgZGF0YSBzb3VyY2UgbmVlZCB0byBoYW5kbGUgZXhwYW5zaW9uL2NvbGxhcHNpb24gb2YgdGhlIHRyZWUgbm9kZSBhbmQgY2hhbmdlIHRoZSBkYXRhIGZlZWRcbiAqIHRvIGBNYXRUcmVlYC5cbiAqIFRoZSBuZXN0ZWQgdHJlZSBub2RlcyBvZiB0eXBlIGBUYCBhcmUgZmxhdHRlbmVkIHRocm91Z2ggYE1hdFRyZWVGbGF0dGVuZXJgLCBhbmQgY29udmVydGVkXG4gKiB0byB0eXBlIGBGYCBmb3IgYE1hdFRyZWVgIHRvIGNvbnN1bWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUcmVlRmxhdERhdGFTb3VyY2U8VCwgRj4gZXh0ZW5kcyBEYXRhU291cmNlPEY+IHtcbiAgX2ZsYXR0ZW5lZERhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEZbXT4oW10pO1xuXG4gIF9leHBhbmRlZERhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEZbXT4oW10pO1xuXG4gIF9kYXRhOiBCZWhhdmlvclN1YmplY3Q8VFtdPjtcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhLnZhbHVlOyB9XG4gIHNldCBkYXRhKHZhbHVlOiBUW10pIHtcbiAgICB0aGlzLl9kYXRhLm5leHQodmFsdWUpO1xuICAgIHRoaXMuX2ZsYXR0ZW5lZERhdGEubmV4dCh0aGlzLl90cmVlRmxhdHRlbmVyLmZsYXR0ZW5Ob2Rlcyh0aGlzLmRhdGEpKTtcbiAgICB0aGlzLl90cmVlQ29udHJvbC5kYXRhTm9kZXMgPSB0aGlzLl9mbGF0dGVuZWREYXRhLnZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdHJlZUNvbnRyb2w6IEZsYXRUcmVlQ29udHJvbDxGPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdHJlZUZsYXR0ZW5lcjogTWF0VHJlZUZsYXR0ZW5lcjxULCBGPixcbiAgICAgICAgICAgICAgaW5pdGlhbERhdGE6IFRbXSA9IFtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KGluaXRpYWxEYXRhKTtcbiAgfVxuXG4gIGNvbm5lY3QoY29sbGVjdGlvblZpZXdlcjogQ29sbGVjdGlvblZpZXdlcik6IE9ic2VydmFibGU8RltdPiB7XG4gICAgY29uc3QgY2hhbmdlcyA9IFtcbiAgICAgIGNvbGxlY3Rpb25WaWV3ZXIudmlld0NoYW5nZSxcbiAgICAgIHRoaXMuX3RyZWVDb250cm9sLmV4cGFuc2lvbk1vZGVsLmNoYW5nZWQsXG4gICAgICB0aGlzLl9mbGF0dGVuZWREYXRhXG4gICAgXTtcbiAgICByZXR1cm4gbWVyZ2UoLi4uY2hhbmdlcykucGlwZShtYXAoKCkgPT4ge1xuICAgICAgdGhpcy5fZXhwYW5kZWREYXRhLm5leHQoXG4gICAgICAgIHRoaXMuX3RyZWVGbGF0dGVuZXIuZXhwYW5kRmxhdHRlbmVkTm9kZXModGhpcy5fZmxhdHRlbmVkRGF0YS52YWx1ZSwgdGhpcy5fdHJlZUNvbnRyb2wpKTtcbiAgICAgIHJldHVybiB0aGlzLl9leHBhbmRlZERhdGEudmFsdWU7XG4gICAgfSkpO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICAvLyBubyBvcFxuICB9XG59XG4iXX0=