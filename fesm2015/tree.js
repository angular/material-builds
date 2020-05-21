import { __decorate, __metadata, __param } from 'tslib';
import { CdkTreeNode, CdkTree, CdkTreeNodeDef, CdkNestedTreeNode, CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodePadding, CdkTreeNodeOutlet, CdkTreeNodeToggle, CdkTreeModule } from '@angular/cdk/tree';
import { Input, Directive, Attribute, ElementRef, IterableDiffers, Inject, Optional, ViewContainerRef, ViewChild, Component, ViewEncapsulation, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { mixinTabIndex, mixinDisabled, MatCommonModule } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge } from 'rxjs';
import { take, map } from 'rxjs/operators';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _MatTreeNodeMixinBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
let MatTreeNode = /** @class */ (() => {
    var MatTreeNode_1;
    let MatTreeNode = MatTreeNode_1 = class MatTreeNode extends _MatTreeNodeMixinBase {
        constructor(_elementRef, _tree, tabIndex) {
            super(_elementRef, _tree);
            this._elementRef = _elementRef;
            this._tree = _tree;
            this.role = 'treeitem';
            this.tabIndex = Number(tabIndex) || 0;
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatTreeNode.prototype, "role", void 0);
    MatTreeNode = MatTreeNode_1 = __decorate([
        Directive({
            selector: 'mat-tree-node',
            exportAs: 'matTreeNode',
            inputs: ['disabled', 'tabIndex'],
            host: {
                '[attr.aria-expanded]': 'isExpanded',
                '[attr.aria-level]': 'role === "treeitem" ? level : null',
                '[attr.role]': 'role',
                'class': 'mat-tree-node'
            },
            providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode_1 }]
        }),
        __param(2, Attribute('tabindex')),
        __metadata("design:paramtypes", [ElementRef,
            CdkTree, String])
    ], MatTreeNode);
    return MatTreeNode;
})();
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
let MatTreeNodeDef = /** @class */ (() => {
    var MatTreeNodeDef_1;
    let MatTreeNodeDef = MatTreeNodeDef_1 = class MatTreeNodeDef extends CdkTreeNodeDef {
    };
    __decorate([
        Input('matTreeNode'),
        __metadata("design:type", Object)
    ], MatTreeNodeDef.prototype, "data", void 0);
    MatTreeNodeDef = MatTreeNodeDef_1 = __decorate([
        Directive({
            selector: '[matTreeNodeDef]',
            inputs: [
                'when: matTreeNodeDefWhen'
            ],
            providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef_1 }]
        })
    ], MatTreeNodeDef);
    return MatTreeNodeDef;
})();
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
let MatNestedTreeNode = /** @class */ (() => {
    var MatNestedTreeNode_1;
    let MatNestedTreeNode = MatNestedTreeNode_1 = class MatNestedTreeNode extends CdkNestedTreeNode {
        constructor(_elementRef, _tree, _differs, tabIndex) {
            super(_elementRef, _tree, _differs);
            this._elementRef = _elementRef;
            this._tree = _tree;
            this._differs = _differs;
            this._disabled = false;
            this.tabIndex = Number(tabIndex) || 0;
        }
        /** Whether the node is disabled. */
        get disabled() { return this._disabled; }
        set disabled(value) { this._disabled = coerceBooleanProperty(value); }
        /** Tabindex for the node. */
        get tabIndex() { return this.disabled ? -1 : this._tabIndex; }
        set tabIndex(value) {
            // If the specified tabIndex value is null or undefined, fall back to the default value.
            this._tabIndex = value != null ? value : 0;
        }
        // This is a workaround for https://github.com/angular/angular/issues/23091
        // In aot mode, the lifecycle hooks from parent class are not called.
        // TODO(tinayuangao): Remove when the angular issue #23091 is fixed
        ngAfterContentInit() {
            super.ngAfterContentInit();
        }
        ngOnDestroy() {
            super.ngOnDestroy();
        }
    };
    __decorate([
        Input('matNestedTreeNode'),
        __metadata("design:type", Object)
    ], MatNestedTreeNode.prototype, "node", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatNestedTreeNode.prototype, "disabled", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatNestedTreeNode.prototype, "tabIndex", null);
    MatNestedTreeNode = MatNestedTreeNode_1 = __decorate([
        Directive({
            selector: 'mat-nested-tree-node',
            exportAs: 'matNestedTreeNode',
            host: {
                '[attr.aria-expanded]': 'isExpanded',
                '[attr.role]': 'role',
                'class': 'mat-nested-tree-node',
            },
            providers: [
                { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode_1 },
                { provide: CdkTreeNode, useExisting: MatNestedTreeNode_1 },
                { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode_1 }
            ]
        }),
        __param(3, Attribute('tabindex')),
        __metadata("design:paramtypes", [ElementRef,
            CdkTree,
            IterableDiffers, String])
    ], MatNestedTreeNode);
    return MatNestedTreeNode;
})();

/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
let MatTreeNodePadding = /** @class */ (() => {
    var MatTreeNodePadding_1;
    let MatTreeNodePadding = MatTreeNodePadding_1 = class MatTreeNodePadding extends CdkTreeNodePadding {
    };
    __decorate([
        Input('matTreeNodePadding'),
        __metadata("design:type", Number)
    ], MatTreeNodePadding.prototype, "level", void 0);
    __decorate([
        Input('matTreeNodePaddingIndent'),
        __metadata("design:type", Number)
    ], MatTreeNodePadding.prototype, "indent", void 0);
    MatTreeNodePadding = MatTreeNodePadding_1 = __decorate([
        Directive({
            selector: '[matTreeNodePadding]',
            providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding_1 }]
        })
    ], MatTreeNodePadding);
    return MatTreeNodePadding;
})();

/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
let MatTreeNodeOutlet = /** @class */ (() => {
    var MatTreeNodeOutlet_1;
    let MatTreeNodeOutlet = MatTreeNodeOutlet_1 = class MatTreeNodeOutlet {
        constructor(viewContainer, _node) {
            this.viewContainer = viewContainer;
            this._node = _node;
        }
    };
    MatTreeNodeOutlet = MatTreeNodeOutlet_1 = __decorate([
        Directive({
            selector: '[matTreeNodeOutlet]',
            providers: [{
                    provide: CdkTreeNodeOutlet,
                    useExisting: MatTreeNodeOutlet_1
                }]
        }),
        __param(1, Inject(CDK_TREE_NODE_OUTLET_NODE)), __param(1, Optional()),
        __metadata("design:paramtypes", [ViewContainerRef, Object])
    ], MatTreeNodeOutlet);
    return MatTreeNodeOutlet;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Wrapper for the CdkTable with Material design styles.
 */
let MatTree = /** @class */ (() => {
    var MatTree_1;
    let MatTree = MatTree_1 = class MatTree extends CdkTree {
    };
    __decorate([
        ViewChild(MatTreeNodeOutlet, { static: true }),
        __metadata("design:type", MatTreeNodeOutlet)
    ], MatTree.prototype, "_nodeOutlet", void 0);
    MatTree = MatTree_1 = __decorate([
        Component({
            selector: 'mat-tree',
            exportAs: 'matTree',
            template: `<ng-container matTreeNodeOutlet></ng-container>`,
            host: {
                'class': 'mat-tree',
                'role': 'tree',
            },
            encapsulation: ViewEncapsulation.None,
            // See note on CdkTree for explanation on why this uses the default change detection strategy.
            // tslint:disable-next-line:validate-decorators
            changeDetection: ChangeDetectionStrategy.Default,
            providers: [{ provide: CdkTree, useExisting: MatTree_1 }],
            styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"]
        })
    ], MatTree);
    return MatTree;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
let MatTreeNodeToggle = /** @class */ (() => {
    var MatTreeNodeToggle_1;
    let MatTreeNodeToggle = MatTreeNodeToggle_1 = class MatTreeNodeToggle extends CdkTreeNodeToggle {
        constructor() {
            super(...arguments);
            this.recursive = false;
        }
    };
    __decorate([
        Input('matTreeNodeToggleRecursive'),
        __metadata("design:type", Boolean)
    ], MatTreeNodeToggle.prototype, "recursive", void 0);
    MatTreeNodeToggle = MatTreeNodeToggle_1 = __decorate([
        Directive({
            selector: '[matTreeNodeToggle]',
            providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle_1 }]
        })
    ], MatTreeNodeToggle);
    return MatTreeNodeToggle;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const MAT_TREE_DIRECTIVES = [
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatTree,
    MatTreeNode,
    MatTreeNodeOutlet
];
let MatTreeModule = /** @class */ (() => {
    let MatTreeModule = class MatTreeModule {
    };
    MatTreeModule = __decorate([
        NgModule({
            imports: [CdkTreeModule, MatCommonModule],
            exports: [MatCommonModule, MAT_TREE_DIRECTIVES],
            declarations: MAT_TREE_DIRECTIVES,
        })
    ], MatTreeModule);
    return MatTreeModule;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
class MatTreeFlattener {
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
class MatTreeFlatDataSource extends DataSource {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Data source for nested tree.
 *
 * The data source for nested tree doesn't have to consider node flattener, or the way to expand
 * or collapse. The expansion/collapsion will be handled by TreeControl and each non-leaf node.
 */
class MatTreeNestedDataSource extends DataSource {
    constructor() {
        super(...arguments);
        this._data = new BehaviorSubject([]);
    }
    /**
     * Data for the nested tree
     */
    get data() { return this._data.value; }
    set data(value) { this._data.next(value); }
    connect(collectionViewer) {
        return merge(...[collectionViewer.viewChange, this._data])
            .pipe(map(() => {
            return this.data;
        }));
    }
    disconnect() {
        // no op
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MatNestedTreeNode, MatTree, MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource, MatTreeNode, MatTreeNodeDef, MatTreeNodeOutlet, MatTreeNodePadding, MatTreeNodeToggle };
//# sourceMappingURL=tree.js.map
