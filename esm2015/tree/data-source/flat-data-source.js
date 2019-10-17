/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1kYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL2RhdGEtc291cmNlL2ZsYXQtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQW1CLFVBQVUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRXRFLE9BQU8sRUFBQyxlQUFlLEVBQUUsS0FBSyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DekMsTUFBTSxPQUFPLGdCQUFnQjs7Ozs7OztJQUUzQixZQUFtQixpQkFBZ0QsRUFDaEQsUUFBNkIsRUFDN0IsWUFBa0MsRUFDbEMsV0FDcUM7UUFKckMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUErQjtRQUNoRCxhQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUM3QixpQkFBWSxHQUFaLFlBQVksQ0FBc0I7UUFDbEMsZ0JBQVcsR0FBWCxXQUFXLENBQzBCO0lBQUcsQ0FBQzs7Ozs7Ozs7SUFFNUQsWUFBWSxDQUFDLElBQU8sRUFBRSxLQUFhLEVBQ3RCLFdBQWdCLEVBQUUsU0FBb0I7O2NBQzNDLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztRQUNwRCxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTNCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRTs7a0JBQ3pCLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUM1QyxJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUNoQyxJ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QywrQ0FBOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb2xsZWN0aW9uVmlld2VyLCBEYXRhU291cmNlfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtGbGF0VHJlZUNvbnRyb2wsIFRyZWVDb250cm9sfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBUcmVlIGZsYXR0ZW5lciB0byBjb252ZXJ0IGEgbm9ybWFsIHR5cGUgb2Ygbm9kZSB0byBub2RlIHdpdGggY2hpbGRyZW4gJiBsZXZlbCBpbmZvcm1hdGlvbi5cbiAqIFRyYW5zZm9ybSBuZXN0ZWQgbm9kZXMgb2YgdHlwZSBgVGAgdG8gZmxhdHRlbmVkIG5vZGVzIG9mIHR5cGUgYEZgLlxuICpcbiAqIEZvciBleGFtcGxlLCB0aGUgaW5wdXQgZGF0YSBvZiB0eXBlIGBUYCBpcyBuZXN0ZWQsIGFuZCBjb250YWlucyBpdHMgY2hpbGRyZW4gZGF0YTpcbiAqICAgU29tZU5vZGU6IHtcbiAqICAgICBrZXk6ICdGcnVpdHMnLFxuICogICAgIGNoaWxkcmVuOiBbXG4gKiAgICAgICBOb2RlT25lOiB7XG4gKiAgICAgICAgIGtleTogJ0FwcGxlJyxcbiAqICAgICAgIH0sXG4gKiAgICAgICBOb2RlVHdvOiB7XG4gKiAgICAgICAga2V5OiAnUGVhcicsXG4gKiAgICAgIH1cbiAqICAgIF1cbiAqICB9XG4gKiAgQWZ0ZXIgZmxhdHRlbmVyIGZsYXR0ZW4gdGhlIHRyZWUsIHRoZSBzdHJ1Y3R1cmUgd2lsbCBiZWNvbWVcbiAqICBTb21lTm9kZToge1xuICogICAga2V5OiAnRnJ1aXRzJyxcbiAqICAgIGV4cGFuZGFibGU6IHRydWUsXG4gKiAgICBsZXZlbDogMVxuICogIH0sXG4gKiAgTm9kZU9uZToge1xuICogICAga2V5OiAnQXBwbGUnLFxuICogICAgZXhwYW5kYWJsZTogZmFsc2UsXG4gKiAgICBsZXZlbDogMlxuICogIH0sXG4gKiAgTm9kZVR3bzoge1xuICogICBrZXk6ICdQZWFyJyxcbiAqICAgZXhwYW5kYWJsZTogZmFsc2UsXG4gKiAgIGxldmVsOiAyXG4gKiB9XG4gKiBhbmQgdGhlIG91dHB1dCBmbGF0dGVuZWQgdHlwZSBpcyBgRmAgd2l0aCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZUZsYXR0ZW5lcjxULCBGPiB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRyYW5zZm9ybUZ1bmN0aW9uOiAobm9kZTogVCwgbGV2ZWw6IG51bWJlcikgPT4gRixcbiAgICAgICAgICAgICAgcHVibGljIGdldExldmVsOiAobm9kZTogRikgPT4gbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgaXNFeHBhbmRhYmxlOiAobm9kZTogRikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIGdldENoaWxkcmVuOiAobm9kZTogVCkgPT5cbiAgICAgICAgICAgICAgICAgIE9ic2VydmFibGU8VFtdPiB8IFRbXSB8IHVuZGVmaW5lZCB8IG51bGwpIHt9XG5cbiAgX2ZsYXR0ZW5Ob2RlKG5vZGU6IFQsIGxldmVsOiBudW1iZXIsXG4gICAgICAgICAgICAgICByZXN1bHROb2RlczogRltdLCBwYXJlbnRNYXA6IGJvb2xlYW5bXSk6IEZbXSB7XG4gICAgY29uc3QgZmxhdE5vZGUgPSB0aGlzLnRyYW5zZm9ybUZ1bmN0aW9uKG5vZGUsIGxldmVsKTtcbiAgICByZXN1bHROb2Rlcy5wdXNoKGZsYXROb2RlKTtcblxuICAgIGlmICh0aGlzLmlzRXhwYW5kYWJsZShmbGF0Tm9kZSkpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuTm9kZXMgPSB0aGlzLmdldENoaWxkcmVuKG5vZGUpO1xuICAgICAgaWYgKGNoaWxkcmVuTm9kZXMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW5Ob2RlcykpIHtcbiAgICAgICAgICB0aGlzLl9mbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW5Ob2RlcywgbGV2ZWwsIHJlc3VsdE5vZGVzLCBwYXJlbnRNYXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkcmVuTm9kZXMucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoY2hpbGRyZW4gPT4ge1xuICAgICAgICAgICAgdGhpcy5fZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuLCBsZXZlbCwgcmVzdWx0Tm9kZXMsIHBhcmVudE1hcCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xuICB9XG5cbiAgX2ZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbjogVFtdLCBsZXZlbDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgIHJlc3VsdE5vZGVzOiBGW10sIHBhcmVudE1hcDogYm9vbGVhbltdKTogdm9pZCB7XG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgY2hpbGRQYXJlbnRNYXA6IGJvb2xlYW5bXSA9IHBhcmVudE1hcC5zbGljZSgpO1xuICAgICAgY2hpbGRQYXJlbnRNYXAucHVzaChpbmRleCAhPSBjaGlsZHJlbi5sZW5ndGggLSAxKTtcbiAgICAgIHRoaXMuX2ZsYXR0ZW5Ob2RlKGNoaWxkLCBsZXZlbCArIDEsIHJlc3VsdE5vZGVzLCBjaGlsZFBhcmVudE1hcCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmxhdHRlbiBhIGxpc3Qgb2Ygbm9kZSB0eXBlIFQgdG8gZmxhdHRlbmVkIHZlcnNpb24gb2Ygbm9kZSBGLlxuICAgKiBQbGVhc2Ugbm90ZSB0aGF0IHR5cGUgVCBtYXkgYmUgbmVzdGVkLCBhbmQgdGhlIGxlbmd0aCBvZiBgc3RydWN0dXJlZERhdGFgIG1heSBiZSBkaWZmZXJlbnRcbiAgICogZnJvbSB0aGF0IG9mIHJldHVybmVkIGxpc3QgYEZbXWAuXG4gICAqL1xuICBmbGF0dGVuTm9kZXMoc3RydWN0dXJlZERhdGE6IFRbXSk6IEZbXSB7XG4gICAgbGV0IHJlc3VsdE5vZGVzOiBGW10gPSBbXTtcbiAgICBzdHJ1Y3R1cmVkRGF0YS5mb3JFYWNoKG5vZGUgPT4gdGhpcy5fZmxhdHRlbk5vZGUobm9kZSwgMCwgcmVzdWx0Tm9kZXMsIFtdKSk7XG4gICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cGFuZCBmbGF0dGVuZWQgbm9kZSB3aXRoIGN1cnJlbnQgZXhwYW5zaW9uIHN0YXR1cy5cbiAgICogVGhlIHJldHVybmVkIGxpc3QgbWF5IGhhdmUgZGlmZmVyZW50IGxlbmd0aC5cbiAgICovXG4gIGV4cGFuZEZsYXR0ZW5lZE5vZGVzKG5vZGVzOiBGW10sIHRyZWVDb250cm9sOiBUcmVlQ29udHJvbDxGPik6IEZbXSB7XG4gICAgbGV0IHJlc3VsdHM6IEZbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50RXhwYW5kOiBib29sZWFuW10gPSBbXTtcbiAgICBjdXJyZW50RXhwYW5kWzBdID0gdHJ1ZTtcblxuICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBsZXQgZXhwYW5kID0gdHJ1ZTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMuZ2V0TGV2ZWwobm9kZSk7IGkrKykge1xuICAgICAgICBleHBhbmQgPSBleHBhbmQgJiYgY3VycmVudEV4cGFuZFtpXTtcbiAgICAgIH1cbiAgICAgIGlmIChleHBhbmQpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaXNFeHBhbmRhYmxlKG5vZGUpKSB7XG4gICAgICAgIGN1cnJlbnRFeHBhbmRbdGhpcy5nZXRMZXZlbChub2RlKSArIDFdID0gdHJlZUNvbnRyb2wuaXNFeHBhbmRlZChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxufVxuXG5cbi8qKlxuICogRGF0YSBzb3VyY2UgZm9yIGZsYXQgdHJlZS5cbiAqIFRoZSBkYXRhIHNvdXJjZSBuZWVkIHRvIGhhbmRsZSBleHBhbnNpb24vY29sbGFwc2lvbiBvZiB0aGUgdHJlZSBub2RlIGFuZCBjaGFuZ2UgdGhlIGRhdGEgZmVlZFxuICogdG8gYE1hdFRyZWVgLlxuICogVGhlIG5lc3RlZCB0cmVlIG5vZGVzIG9mIHR5cGUgYFRgIGFyZSBmbGF0dGVuZWQgdGhyb3VnaCBgTWF0VHJlZUZsYXR0ZW5lcmAsIGFuZCBjb252ZXJ0ZWRcbiAqIHRvIHR5cGUgYEZgIGZvciBgTWF0VHJlZWAgdG8gY29uc3VtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVGbGF0RGF0YVNvdXJjZTxULCBGPiBleHRlbmRzIERhdGFTb3VyY2U8Rj4ge1xuICBfZmxhdHRlbmVkRGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RltdPihbXSk7XG5cbiAgX2V4cGFuZGVkRGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RltdPihbXSk7XG5cbiAgX2RhdGE6IEJlaGF2aW9yU3ViamVjdDxUW10+O1xuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWU7IH1cbiAgc2V0IGRhdGEodmFsdWU6IFRbXSkge1xuICAgIHRoaXMuX2RhdGEubmV4dCh2YWx1ZSk7XG4gICAgdGhpcy5fZmxhdHRlbmVkRGF0YS5uZXh0KHRoaXMuX3RyZWVGbGF0dGVuZXIuZmxhdHRlbk5vZGVzKHRoaXMuZGF0YSkpO1xuICAgIHRoaXMuX3RyZWVDb250cm9sLmRhdGFOb2RlcyA9IHRoaXMuX2ZsYXR0ZW5lZERhdGEudmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90cmVlQ29udHJvbDogRmxhdFRyZWVDb250cm9sPEY+LFxuICAgICAgICAgICAgICBwcml2YXRlIF90cmVlRmxhdHRlbmVyOiBNYXRUcmVlRmxhdHRlbmVyPFQsIEY+LFxuICAgICAgICAgICAgICBpbml0aWFsRGF0YTogVFtdID0gW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFRbXT4oaW5pdGlhbERhdGEpO1xuICB9XG5cbiAgY29ubmVjdChjb2xsZWN0aW9uVmlld2VyOiBDb2xsZWN0aW9uVmlld2VyKTogT2JzZXJ2YWJsZTxGW10+IHtcbiAgICBjb25zdCBjaGFuZ2VzID0gW1xuICAgICAgY29sbGVjdGlvblZpZXdlci52aWV3Q2hhbmdlLFxuICAgICAgdGhpcy5fdHJlZUNvbnRyb2wuZXhwYW5zaW9uTW9kZWwuY2hhbmdlZCxcbiAgICAgIHRoaXMuX2ZsYXR0ZW5lZERhdGFcbiAgICBdO1xuICAgIHJldHVybiBtZXJnZSguLi5jaGFuZ2VzKS5waXBlKG1hcCgoKSA9PiB7XG4gICAgICB0aGlzLl9leHBhbmRlZERhdGEubmV4dChcbiAgICAgICAgdGhpcy5fdHJlZUZsYXR0ZW5lci5leHBhbmRGbGF0dGVuZWROb2Rlcyh0aGlzLl9mbGF0dGVuZWREYXRhLnZhbHVlLCB0aGlzLl90cmVlQ29udHJvbCkpO1xuICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZGVkRGF0YS52YWx1ZTtcbiAgICB9KSk7XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIC8vIG5vIG9wXG4gIH1cbn1cbiJdfQ==