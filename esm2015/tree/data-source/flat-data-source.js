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
 */
export class MatTreeFlattener {
    constructor(transformFunction, getLevel, isExpandable, getChildren) {
        this.transformFunction = transformFunction;
        this.getLevel = getLevel;
        this.isExpandable = isExpandable;
        this.getChildren = getChildren;
    }
    _flattenNode(node, level, resultNodes, parentMap) {
        const flatNode = this.transformFunction(node, level);
        resultNodes.push(flatNode);
        if (this.isExpandable(flatNode)) {
            const childrenNodes = this.getChildren(node);
            if (childrenNodes) {
                if (Array.isArray(childrenNodes)) {
                    this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
                }
                else {
                    childrenNodes.pipe(take(1)).subscribe(children => {
                        this._flattenChildren(children, level, resultNodes, parentMap);
                    });
                }
            }
        }
        return resultNodes;
    }
    _flattenChildren(children, level, resultNodes, parentMap) {
        children.forEach((child, index) => {
            let childParentMap = parentMap.slice();
            childParentMap.push(index != children.length - 1);
            this._flattenNode(child, level + 1, resultNodes, childParentMap);
        });
    }
    /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     */
    flattenNodes(structuredData) {
        let resultNodes = [];
        structuredData.forEach(node => this._flattenNode(node, 0, resultNodes, []));
        return resultNodes;
    }
    /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     */
    expandFlattenedNodes(nodes, treeControl) {
        let results = [];
        let currentExpand = [];
        currentExpand[0] = true;
        nodes.forEach(node => {
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
        });
        return results;
    }
}
/**
 * Data source for flat tree.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `MatTree`.
 * The nested tree nodes of type `T` are flattened through `MatTreeFlattener`, and converted
 * to type `F` for `MatTree` to consume.
 */
export class MatTreeFlatDataSource extends DataSource {
    constructor(_treeControl, _treeFlattener, initialData = []) {
        super();
        this._treeControl = _treeControl;
        this._treeFlattener = _treeFlattener;
        this._flattenedData = new BehaviorSubject([]);
        this._expandedData = new BehaviorSubject([]);
        this._data = new BehaviorSubject(initialData);
    }
    get data() { return this._data.value; }
    set data(value) {
        this._data.next(value);
        this._flattenedData.next(this._treeFlattener.flattenNodes(this.data));
        this._treeControl.dataNodes = this._flattenedData.value;
    }
    connect(collectionViewer) {
        const changes = [
            collectionViewer.viewChange,
            this._treeControl.expansionModel.changed,
            this._flattenedData
        ];
        return merge(...changes).pipe(map(() => {
            this._expandedData.next(this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeControl));
            return this._expandedData.value;
        }));
    }
    disconnect() {
        // no op
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1kYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL2RhdGEtc291cmNlL2ZsYXQtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFtQixVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RSxPQUFPLEVBQUMsZUFBZSxFQUFFLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQ0c7QUFDSCxNQUFNLE9BQU8sZ0JBQWdCO0lBRTNCLFlBQW1CLGlCQUFnRCxFQUNoRCxRQUE2QixFQUM3QixZQUFrQyxFQUNsQyxXQUNxQztRQUpyQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQStCO1FBQ2hELGFBQVEsR0FBUixRQUFRLENBQXFCO1FBQzdCLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtRQUNsQyxnQkFBVyxHQUFYLFdBQVcsQ0FDMEI7SUFBRyxDQUFDO0lBRTVELFlBQVksQ0FBQyxJQUFPLEVBQUUsS0FBYSxFQUN0QixXQUFnQixFQUFFLFNBQW9CO1FBQ2pELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FB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LEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBTSxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBWkQsSUFBSSxJQUFJLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdkMsSUFBSSxJQUFJLENBQUMsS0FBVTtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztJQUMxRCxDQUFDO0lBU0QsT0FBTyxDQUFDLGdCQUFrQztRQUN4QyxNQUFNLE9BQU8sR0FBRztZQUNkLGdCQUFnQixDQUFDLFVBQVU7WUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsT0FBTztZQUN4QyxJQUFJLENBQUMsY0FBYztTQUNwQixDQUFDO1FBQ0YsT0FBTyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUMxRixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsVUFBVTtRQUNSLFFBQVE7SUFDVixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb2xsZWN0aW9uVmlld2VyLCBEYXRhU291cmNlfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtGbGF0VHJlZUNvbnRyb2wsIFRyZWVDb250cm9sfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBUcmVlIGZsYXR0ZW5lciB0byBjb252ZXJ0IGEgbm9ybWFsIHR5cGUgb2Ygbm9kZSB0byBub2RlIHdpdGggY2hpbGRyZW4gJiBsZXZlbCBpbmZvcm1hdGlvbi5cbiAqIFRyYW5zZm9ybSBuZXN0ZWQgbm9kZXMgb2YgdHlwZSBgVGAgdG8gZmxhdHRlbmVkIG5vZGVzIG9mIHR5cGUgYEZgLlxuICpcbiAqIEZvciBleGFtcGxlLCB0aGUgaW5wdXQgZGF0YSBvZiB0eXBlIGBUYCBpcyBuZXN0ZWQsIGFuZCBjb250YWlucyBpdHMgY2hpbGRyZW4gZGF0YTpcbiAqICAgU29tZU5vZGU6IHtcbiAqICAgICBrZXk6ICdGcnVpdHMnLFxuICogICAgIGNoaWxkcmVuOiBbXG4gKiAgICAgICBOb2RlT25lOiB7XG4gKiAgICAgICAgIGtleTogJ0FwcGxlJyxcbiAqICAgICAgIH0sXG4gKiAgICAgICBOb2RlVHdvOiB7XG4gKiAgICAgICAga2V5OiAnUGVhcicsXG4gKiAgICAgIH1cbiAqICAgIF1cbiAqICB9XG4gKiAgQWZ0ZXIgZmxhdHRlbmVyIGZsYXR0ZW4gdGhlIHRyZWUsIHRoZSBzdHJ1Y3R1cmUgd2lsbCBiZWNvbWVcbiAqICBTb21lTm9kZToge1xuICogICAga2V5OiAnRnJ1aXRzJyxcbiAqICAgIGV4cGFuZGFibGU6IHRydWUsXG4gKiAgICBsZXZlbDogMVxuICogIH0sXG4gKiAgTm9kZU9uZToge1xuICogICAga2V5OiAnQXBwbGUnLFxuICogICAgZXhwYW5kYWJsZTogZmFsc2UsXG4gKiAgICBsZXZlbDogMlxuICogIH0sXG4gKiAgTm9kZVR3bzoge1xuICogICBrZXk6ICdQZWFyJyxcbiAqICAgZXhwYW5kYWJsZTogZmFsc2UsXG4gKiAgIGxldmVsOiAyXG4gKiB9XG4gKiBhbmQgdGhlIG91dHB1dCBmbGF0dGVuZWQgdHlwZSBpcyBgRmAgd2l0aCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZUZsYXR0ZW5lcjxULCBGLCBLID0gRj4ge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmFuc2Zvcm1GdW5jdGlvbjogKG5vZGU6IFQsIGxldmVsOiBudW1iZXIpID0+IEYsXG4gICAgICAgICAgICAgIHB1YmxpYyBnZXRMZXZlbDogKG5vZGU6IEYpID0+IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIGlzRXhwYW5kYWJsZTogKG5vZGU6IEYpID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbjogKG5vZGU6IFQpID0+XG4gICAgICAgICAgICAgICAgICBPYnNlcnZhYmxlPFRbXT4gfCBUW10gfCB1bmRlZmluZWQgfCBudWxsKSB7fVxuXG4gIF9mbGF0dGVuTm9kZShub2RlOiBULCBsZXZlbDogbnVtYmVyLFxuICAgICAgICAgICAgICAgcmVzdWx0Tm9kZXM6IEZbXSwgcGFyZW50TWFwOiBib29sZWFuW10pOiBGW10ge1xuICAgIGNvbnN0IGZsYXROb2RlID0gdGhpcy50cmFuc2Zvcm1GdW5jdGlvbihub2RlLCBsZXZlbCk7XG4gICAgcmVzdWx0Tm9kZXMucHVzaChmbGF0Tm9kZSk7XG5cbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoZmxhdE5vZGUpKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbk5vZGVzID0gdGhpcy5nZXRDaGlsZHJlbihub2RlKTtcbiAgICAgIGlmIChjaGlsZHJlbk5vZGVzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuTm9kZXMpKSB7XG4gICAgICAgICAgdGhpcy5fZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuTm9kZXMsIGxldmVsLCByZXN1bHROb2RlcywgcGFyZW50TWFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZHJlbk5vZGVzLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKGNoaWxkcmVuID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2ZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbiwgbGV2ZWwsIHJlc3VsdE5vZGVzLCBwYXJlbnRNYXApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgfVxuXG4gIF9mbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW46IFRbXSwgbGV2ZWw6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICByZXN1bHROb2RlczogRltdLCBwYXJlbnRNYXA6IGJvb2xlYW5bXSk6IHZvaWQge1xuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGNoaWxkUGFyZW50TWFwOiBib29sZWFuW10gPSBwYXJlbnRNYXAuc2xpY2UoKTtcbiAgICAgIGNoaWxkUGFyZW50TWFwLnB1c2goaW5kZXggIT0gY2hpbGRyZW4ubGVuZ3RoIC0gMSk7XG4gICAgICB0aGlzLl9mbGF0dGVuTm9kZShjaGlsZCwgbGV2ZWwgKyAxLCByZXN1bHROb2RlcywgY2hpbGRQYXJlbnRNYXApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsYXR0ZW4gYSBsaXN0IG9mIG5vZGUgdHlwZSBUIHRvIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIG5vZGUgRi5cbiAgICogUGxlYXNlIG5vdGUgdGhhdCB0eXBlIFQgbWF5IGJlIG5lc3RlZCwgYW5kIHRoZSBsZW5ndGggb2YgYHN0cnVjdHVyZWREYXRhYCBtYXkgYmUgZGlmZmVyZW50XG4gICAqIGZyb20gdGhhdCBvZiByZXR1cm5lZCBsaXN0IGBGW11gLlxuICAgKi9cbiAgZmxhdHRlbk5vZGVzKHN0cnVjdHVyZWREYXRhOiBUW10pOiBGW10ge1xuICAgIGxldCByZXN1bHROb2RlczogRltdID0gW107XG4gICAgc3RydWN0dXJlZERhdGEuZm9yRWFjaChub2RlID0+IHRoaXMuX2ZsYXR0ZW5Ob2RlKG5vZGUsIDAsIHJlc3VsdE5vZGVzLCBbXSkpO1xuICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmQgZmxhdHRlbmVkIG5vZGUgd2l0aCBjdXJyZW50IGV4cGFuc2lvbiBzdGF0dXMuXG4gICAqIFRoZSByZXR1cm5lZCBsaXN0IG1heSBoYXZlIGRpZmZlcmVudCBsZW5ndGguXG4gICAqL1xuICBleHBhbmRGbGF0dGVuZWROb2Rlcyhub2RlczogRltdLCB0cmVlQ29udHJvbDogVHJlZUNvbnRyb2w8RiwgSz4pOiBGW10ge1xuICAgIGxldCByZXN1bHRzOiBGW10gPSBbXTtcbiAgICBsZXQgY3VycmVudEV4cGFuZDogYm9vbGVhbltdID0gW107XG4gICAgY3VycmVudEV4cGFuZFswXSA9IHRydWU7XG5cbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgbGV0IGV4cGFuZCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmdldExldmVsKG5vZGUpOyBpKyspIHtcbiAgICAgICAgZXhwYW5kID0gZXhwYW5kICYmIGN1cnJlbnRFeHBhbmRbaV07XG4gICAgICB9XG4gICAgICBpZiAoZXhwYW5kKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzRXhwYW5kYWJsZShub2RlKSkge1xuICAgICAgICBjdXJyZW50RXhwYW5kW3RoaXMuZ2V0TGV2ZWwobm9kZSkgKyAxXSA9IHRyZWVDb250cm9sLmlzRXhwYW5kZWQobm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cblxuXG4vKipcbiAqIERhdGEgc291cmNlIGZvciBmbGF0IHRyZWUuXG4gKiBUaGUgZGF0YSBzb3VyY2UgbmVlZCB0byBoYW5kbGUgZXhwYW5zaW9uL2NvbGxhcHNpb24gb2YgdGhlIHRyZWUgbm9kZSBhbmQgY2hhbmdlIHRoZSBkYXRhIGZlZWRcbiAqIHRvIGBNYXRUcmVlYC5cbiAqIFRoZSBuZXN0ZWQgdHJlZSBub2RlcyBvZiB0eXBlIGBUYCBhcmUgZmxhdHRlbmVkIHRocm91Z2ggYE1hdFRyZWVGbGF0dGVuZXJgLCBhbmQgY29udmVydGVkXG4gKiB0byB0eXBlIGBGYCBmb3IgYE1hdFRyZWVgIHRvIGNvbnN1bWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUcmVlRmxhdERhdGFTb3VyY2U8VCwgRiwgSyA9IEY+IGV4dGVuZHMgRGF0YVNvdXJjZTxGPiB7XG4gIF9mbGF0dGVuZWREYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGW10+KFtdKTtcblxuICBfZXhwYW5kZWREYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGW10+KFtdKTtcblxuICBfZGF0YTogQmVoYXZpb3JTdWJqZWN0PFRbXT47XG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZTsgfVxuICBzZXQgZGF0YSh2YWx1ZTogVFtdKSB7XG4gICAgdGhpcy5fZGF0YS5uZXh0KHZhbHVlKTtcbiAgICB0aGlzLl9mbGF0dGVuZWREYXRhLm5leHQodGhpcy5fdHJlZUZsYXR0ZW5lci5mbGF0dGVuTm9kZXModGhpcy5kYXRhKSk7XG4gICAgdGhpcy5fdHJlZUNvbnRyb2wuZGF0YU5vZGVzID0gdGhpcy5fZmxhdHRlbmVkRGF0YS52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RyZWVDb250cm9sOiBGbGF0VHJlZUNvbnRyb2w8RiwgSz4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX3RyZWVGbGF0dGVuZXI6IE1hdFRyZWVGbGF0dGVuZXI8VCwgRiwgSz4sXG4gICAgICAgICAgICAgIGluaXRpYWxEYXRhOiBUW10gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihpbml0aWFsRGF0YSk7XG4gIH1cblxuICBjb25uZWN0KGNvbGxlY3Rpb25WaWV3ZXI6IENvbGxlY3Rpb25WaWV3ZXIpOiBPYnNlcnZhYmxlPEZbXT4ge1xuICAgIGNvbnN0IGNoYW5nZXMgPSBbXG4gICAgICBjb2xsZWN0aW9uVmlld2VyLnZpZXdDaGFuZ2UsXG4gICAgICB0aGlzLl90cmVlQ29udHJvbC5leHBhbnNpb25Nb2RlbC5jaGFuZ2VkLFxuICAgICAgdGhpcy5fZmxhdHRlbmVkRGF0YVxuICAgIF07XG4gICAgcmV0dXJuIG1lcmdlKC4uLmNoYW5nZXMpLnBpcGUobWFwKCgpID0+IHtcbiAgICAgIHRoaXMuX2V4cGFuZGVkRGF0YS5uZXh0KFxuICAgICAgICB0aGlzLl90cmVlRmxhdHRlbmVyLmV4cGFuZEZsYXR0ZW5lZE5vZGVzKHRoaXMuX2ZsYXR0ZW5lZERhdGEudmFsdWUsIHRoaXMuX3RyZWVDb250cm9sKSk7XG4gICAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWREYXRhLnZhbHVlO1xuICAgIH0pKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgLy8gbm8gb3BcbiAgfVxufVxuIl19