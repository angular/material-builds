import { __extends, __spread } from 'tslib';
import { CdkTreeNode, CdkTree, CdkTreeNodeDef, CdkNestedTreeNode, CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodePadding, CdkTreeNodeOutlet, CdkTreeNodeToggle, CdkTreeModule } from '@angular/cdk/tree';
import { Directive, ElementRef, Attribute, Input, IterableDiffers, ViewContainerRef, Inject, Optional, Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, NgModule } from '@angular/core';
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
var _MatTreeNodeMixinBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
var MatTreeNode = /** @class */ (function (_super) {
    __extends(MatTreeNode, _super);
    function MatTreeNode(_elementRef, _tree, tabIndex) {
        var _this = _super.call(this, _elementRef, _tree) || this;
        _this._elementRef = _elementRef;
        _this._tree = _tree;
        _this.role = 'treeitem';
        _this.tabIndex = Number(tabIndex) || 0;
        return _this;
    }
    MatTreeNode.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-tree-node',
                    exportAs: 'matTreeNode',
                    inputs: ['disabled', 'tabIndex'],
                    host: {
                        '[attr.aria-expanded]': 'isExpanded',
                        '[attr.aria-level]': 'role === "treeitem" ? level : null',
                        '[attr.role]': 'role',
                        'class': 'mat-tree-node'
                    },
                    providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode }]
                },] }
    ];
    /** @nocollapse */
    MatTreeNode.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CdkTree },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
    ]; };
    MatTreeNode.propDecorators = {
        role: [{ type: Input }]
    };
    return MatTreeNode;
}(_MatTreeNodeMixinBase));
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
var MatTreeNodeDef = /** @class */ (function (_super) {
    __extends(MatTreeNodeDef, _super);
    function MatTreeNodeDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatTreeNodeDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matTreeNodeDef]',
                    inputs: [
                        'when: matTreeNodeDefWhen'
                    ],
                    providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef }]
                },] }
    ];
    MatTreeNodeDef.propDecorators = {
        data: [{ type: Input, args: ['matTreeNode',] }]
    };
    return MatTreeNodeDef;
}(CdkTreeNodeDef));
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
var MatNestedTreeNode = /** @class */ (function (_super) {
    __extends(MatNestedTreeNode, _super);
    function MatNestedTreeNode(_elementRef, _tree, _differs, tabIndex) {
        var _this = _super.call(this, _elementRef, _tree, _differs) || this;
        _this._elementRef = _elementRef;
        _this._tree = _tree;
        _this._differs = _differs;
        _this._disabled = false;
        _this.tabIndex = Number(tabIndex) || 0;
        return _this;
    }
    Object.defineProperty(MatNestedTreeNode.prototype, "disabled", {
        /** Whether the node is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatNestedTreeNode.prototype, "tabIndex", {
        /** Tabindex for the node. */
        get: function () { return this.disabled ? -1 : this._tabIndex; },
        set: function (value) {
            // If the specified tabIndex value is null or undefined, fall back to the default value.
            this._tabIndex = value != null ? value : 0;
        },
        enumerable: true,
        configurable: true
    });
    // This is a workaround for https://github.com/angular/angular/issues/23091
    // In aot mode, the lifecycle hooks from parent class are not called.
    // TODO(tinayuangao): Remove when the angular issue #23091 is fixed
    MatNestedTreeNode.prototype.ngAfterContentInit = function () {
        _super.prototype.ngAfterContentInit.call(this);
    };
    MatNestedTreeNode.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    MatNestedTreeNode.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-nested-tree-node',
                    exportAs: 'matNestedTreeNode',
                    host: {
                        '[attr.aria-expanded]': 'isExpanded',
                        '[attr.role]': 'role',
                        'class': 'mat-nested-tree-node',
                    },
                    providers: [
                        { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode },
                        { provide: CdkTreeNode, useExisting: MatNestedTreeNode },
                        { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode }
                    ]
                },] }
    ];
    /** @nocollapse */
    MatNestedTreeNode.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CdkTree },
        { type: IterableDiffers },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
    ]; };
    MatNestedTreeNode.propDecorators = {
        node: [{ type: Input, args: ['matNestedTreeNode',] }],
        disabled: [{ type: Input }],
        tabIndex: [{ type: Input }]
    };
    return MatNestedTreeNode;
}(CdkNestedTreeNode));

/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
var MatTreeNodePadding = /** @class */ (function (_super) {
    __extends(MatTreeNodePadding, _super);
    function MatTreeNodePadding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatTreeNodePadding.decorators = [
        { type: Directive, args: [{
                    selector: '[matTreeNodePadding]',
                    providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding }]
                },] }
    ];
    MatTreeNodePadding.propDecorators = {
        level: [{ type: Input, args: ['matTreeNodePadding',] }],
        indent: [{ type: Input, args: ['matTreeNodePaddingIndent',] }]
    };
    return MatTreeNodePadding;
}(CdkTreeNodePadding));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
var MatTreeNodeOutlet = /** @class */ (function () {
    function MatTreeNodeOutlet(viewContainer, _node) {
        this.viewContainer = viewContainer;
        this._node = _node;
    }
    MatTreeNodeOutlet.decorators = [
        { type: Directive, args: [{
                    selector: '[matTreeNodeOutlet]',
                    providers: [{
                            provide: CdkTreeNodeOutlet,
                            useExisting: MatTreeNodeOutlet
                        }]
                },] }
    ];
    /** @nocollapse */
    MatTreeNodeOutlet.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: undefined, decorators: [{ type: Inject, args: [CDK_TREE_NODE_OUTLET_NODE,] }, { type: Optional }] }
    ]; };
    return MatTreeNodeOutlet;
}());

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
var MatTree = /** @class */ (function (_super) {
    __extends(MatTree, _super);
    function MatTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatTree.decorators = [
        { type: Component, args: [{
                    selector: 'mat-tree',
                    exportAs: 'matTree',
                    template: "<ng-container matTreeNodeOutlet></ng-container>",
                    host: {
                        'class': 'mat-tree',
                        'role': 'tree',
                    },
                    encapsulation: ViewEncapsulation.None,
                    // See note on CdkTree for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    providers: [{ provide: CdkTree, useExisting: MatTree }],
                    styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;min-height:48px;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"]
                }] }
    ];
    MatTree.propDecorators = {
        _nodeOutlet: [{ type: ViewChild, args: [MatTreeNodeOutlet, { static: true },] }]
    };
    return MatTree;
}(CdkTree));

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
var MatTreeNodeToggle = /** @class */ (function (_super) {
    __extends(MatTreeNodeToggle, _super);
    function MatTreeNodeToggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.recursive = false;
        return _this;
    }
    MatTreeNodeToggle.decorators = [
        { type: Directive, args: [{
                    selector: '[matTreeNodeToggle]',
                    providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }]
                },] }
    ];
    MatTreeNodeToggle.propDecorators = {
        recursive: [{ type: Input, args: ['matTreeNodeToggleRecursive',] }]
    };
    return MatTreeNodeToggle;
}(CdkTreeNodeToggle));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MAT_TREE_DIRECTIVES = [
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatTree,
    MatTreeNode,
    MatTreeNodeOutlet
];
var MatTreeModule = /** @class */ (function () {
    function MatTreeModule() {
    }
    MatTreeModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CdkTreeModule, MatCommonModule],
                    exports: [MatCommonModule, MAT_TREE_DIRECTIVES],
                    declarations: MAT_TREE_DIRECTIVES,
                },] }
    ];
    return MatTreeModule;
}());

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
