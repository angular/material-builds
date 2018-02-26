/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/tree'), require('@angular/material/core'), require('@angular/common'), require('@angular/cdk/collections'), require('rxjs/observable/merge'), require('rxjs/operators/map'), require('rxjs/operators/take'), require('rxjs/BehaviorSubject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/cdk/tree', '@angular/material/core', '@angular/common', '@angular/cdk/collections', 'rxjs/observable/merge', 'rxjs/operators/map', 'rxjs/operators/take', 'rxjs/BehaviorSubject'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.tree = global.ng.material.tree || {}),global.ng.core,global.ng.cdk.tree,global.ng.material.core,global.ng.common,global.ng.cdk.collections,global.Rx.Observable,global.Rx.operators,global.Rx.operators,global.Rx));
}(this, (function (exports,_angular_core,_angular_cdk_tree,_angular_material_core,_angular_common,_angular_cdk_collections,rxjs_observable_merge,rxjs_operators_map,rxjs_operators_take,rxjs_BehaviorSubject) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
var MatTreeNodeOutlet = /** @class */ (function () {
    function MatTreeNodeOutlet(viewContainer) {
        this.viewContainer = viewContainer;
    }
    MatTreeNodeOutlet.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[matTreeNodeOutlet]'
                },] },
    ];
    /** @nocollapse */
    MatTreeNodeOutlet.ctorParameters = function () { return [
        { type: _angular_core.ViewContainerRef, },
    ]; };
    return MatTreeNodeOutlet;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var _MatTreeNodeMixinBase = _angular_material_core.mixinTabIndex(_angular_material_core.mixinDisabled(_angular_cdk_tree.CdkTreeNode));
var _MatNestedTreeNodeMixinBase = _angular_material_core.mixinTabIndex(_angular_material_core.mixinDisabled(_angular_cdk_tree.CdkNestedTreeNode));
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
        { type: _angular_core.Directive, args: [{
                    selector: 'mat-tree-node',
                    exportAs: 'matTreeNode',
                    inputs: ['disabled', 'tabIndex'],
                    host: {
                        '[attr.aria-expanded]': 'isExpanded',
                        '[attr.aria-level]': 'level',
                        '[attr.role]': 'role',
                        'class': 'mat-tree-node'
                    },
                    providers: [{ provide: _angular_cdk_tree.CdkTreeNode, useExisting: MatTreeNode }]
                },] },
    ];
    /** @nocollapse */
    MatTreeNode.ctorParameters = function () { return [
        { type: _angular_core.ElementRef, },
        { type: _angular_cdk_tree.CdkTree, },
        { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['tabindex',] },] },
    ]; };
    MatTreeNode.propDecorators = {
        "role": [{ type: _angular_core.Input },],
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
        { type: _angular_core.Directive, args: [{
                    selector: '[matTreeNodeDef]',
                    inputs: [
                        'when: matTreeNodeDefWhen'
                    ],
                    providers: [{ provide: _angular_cdk_tree.CdkTreeNodeDef, useExisting: MatTreeNodeDef }]
                },] },
    ];
    /** @nocollapse */
    MatTreeNodeDef.ctorParameters = function () { return []; };
    MatTreeNodeDef.propDecorators = {
        "data": [{ type: _angular_core.Input, args: ['matTreeNode',] },],
    };
    return MatTreeNodeDef;
}(_angular_cdk_tree.CdkTreeNodeDef));
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
var MatNestedTreeNode = /** @class */ (function (_super) {
    __extends(MatNestedTreeNode, _super);
    function MatNestedTreeNode(_elementRef, _tree, tabIndex) {
        var _this = _super.call(this, _elementRef, _tree) || this;
        _this._elementRef = _elementRef;
        _this._tree = _tree;
        _this.tabIndex = Number(tabIndex) || 0;
        return _this;
    }
    MatNestedTreeNode.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'mat-nested-tree-node',
                    exportAs: 'matNestedTreeNode',
                    host: {
                        '[attr.aria-expanded]': 'isExpanded',
                        '[attr.role]': 'role',
                        'class': 'mat-nested-tree-node',
                    },
                    inputs: ['disabled', 'tabIndex'],
                    providers: [
                        { provide: _angular_cdk_tree.CdkNestedTreeNode, useExisting: MatNestedTreeNode },
                        { provide: _angular_cdk_tree.CdkTreeNode, useExisting: MatNestedTreeNode }
                    ]
                },] },
    ];
    /** @nocollapse */
    MatNestedTreeNode.ctorParameters = function () { return [
        { type: _angular_core.ElementRef, },
        { type: _angular_cdk_tree.CdkTree, },
        { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['tabindex',] },] },
    ]; };
    MatNestedTreeNode.propDecorators = {
        "node": [{ type: _angular_core.Input, args: ['matNestedTreeNode',] },],
        "nodeOutlet": [{ type: _angular_core.ContentChildren, args: [MatTreeNodeOutlet,] },],
    };
    return MatNestedTreeNode;
}(_MatNestedTreeNodeMixinBase));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
var MatTreeNodePadding = /** @class */ (function (_super) {
    __extends(MatTreeNodePadding, _super);
    function MatTreeNodePadding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatTreeNodePadding.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[matTreeNodePadding]',
                    providers: [{ provide: _angular_cdk_tree.CdkTreeNodePadding, useExisting: MatTreeNodePadding }]
                },] },
    ];
    /** @nocollapse */
    MatTreeNodePadding.ctorParameters = function () { return []; };
    MatTreeNodePadding.propDecorators = {
        "level": [{ type: _angular_core.Input, args: ['matTreeNodePadding',] },],
        "indent": [{ type: _angular_core.Input, args: ['matTreeNodePaddingIndent',] },],
    };
    return MatTreeNodePadding;
}(_angular_cdk_tree.CdkTreeNodePadding));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        { type: _angular_core.Component, args: [{selector: 'mat-tree',
                    exportAs: 'matTree',
                    template: "<ng-container matTreeNodeOutlet></ng-container>",
                    host: {
                        'class': 'mat-tree',
                        'role': 'tree',
                    },
                    styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;min-height:48px;padding:0 24px;flex:1;overflow:hidden;word-wrap:break-word}.mat-nested-tree-ndoe{border-bottom-width:0}"],
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    providers: [{ provide: _angular_cdk_tree.CdkTree, useExisting: MatTree }]
                },] },
    ];
    /** @nocollapse */
    MatTree.ctorParameters = function () { return []; };
    MatTree.propDecorators = {
        "_nodeOutlet": [{ type: _angular_core.ViewChild, args: [MatTreeNodeOutlet,] },],
    };
    return MatTree;
}(_angular_cdk_tree.CdkTree));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
var MatTreeNodeToggle = /** @class */ (function (_super) {
    __extends(MatTreeNodeToggle, _super);
    function MatTreeNodeToggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.recursive = true;
        return _this;
    }
    MatTreeNodeToggle.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[matTreeNodeToggle]',
                    host: {
                        '(click)': '_toggle($event)',
                    },
                    providers: [{ provide: _angular_cdk_tree.CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }]
                },] },
    ];
    /** @nocollapse */
    MatTreeNodeToggle.ctorParameters = function () { return []; };
    MatTreeNodeToggle.propDecorators = {
        "recursive": [{ type: _angular_core.Input, args: ['matTreeNodeToggleRecursive',] },],
    };
    return MatTreeNodeToggle;
}(_angular_cdk_tree.CdkTreeNodeToggle));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        { type: _angular_core.NgModule, args: [{
                    imports: [_angular_cdk_tree.CdkTreeModule, _angular_common.CommonModule, _angular_material_core.MatCommonModule],
                    exports: MAT_TREE_DIRECTIVES,
                    declarations: MAT_TREE_DIRECTIVES,
                },] },
    ];
    /** @nocollapse */
    MatTreeModule.ctorParameters = function () { return []; };
    return MatTreeModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
    /**
     * @param {?} node
     * @param {?} level
     * @param {?} resultNodes
     * @param {?} parentMap
     * @return {?}
     */
    MatTreeFlattener.prototype._flattenNode = /**
     * @param {?} node
     * @param {?} level
     * @param {?} resultNodes
     * @param {?} parentMap
     * @return {?}
     */
    function (node, level, resultNodes, parentMap) {
        var _this = this;
        var /** @type {?} */ flatNode = this.transformFunction(node, level);
        resultNodes.push(flatNode);
        if (this.isExpandable(flatNode)) {
            this.getChildren(node).pipe(rxjs_operators_take.take(1)).subscribe(function (children) {
                children.forEach(function (child, index) {
                    var /** @type {?} */ childParentMap = parentMap.slice();
                    childParentMap.push(index != children.length - 1);
                    _this._flattenNode(child, level + 1, resultNodes, childParentMap);
                });
            });
        }
        return resultNodes;
    };
    /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     */
    /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     * @param {?} structuredData
     * @return {?}
     */
    MatTreeFlattener.prototype.flattenNodes = /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     * @param {?} structuredData
     * @return {?}
     */
    function (structuredData) {
        var _this = this;
        var /** @type {?} */ resultNodes = [];
        structuredData.forEach(function (node) { return _this._flattenNode(node, 0, resultNodes, []); });
        return resultNodes;
    };
    /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     */
    /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     * @param {?} nodes
     * @param {?} treeControl
     * @return {?}
     */
    MatTreeFlattener.prototype.expandFlattenedNodes = /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     * @param {?} nodes
     * @param {?} treeControl
     * @return {?}
     */
    function (nodes, treeControl) {
        var _this = this;
        var /** @type {?} */ results = [];
        var /** @type {?} */ currentExpand = [];
        currentExpand[0] = true;
        nodes.forEach(function (node) {
            var /** @type {?} */ expand = true;
            for (var /** @type {?} */ i = 0; i <= _this.getLevel(node); i++) {
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
    function MatTreeFlatDataSource(treeControl, treeFlattener, initialData) {
        if (initialData === void 0) { initialData = []; }
        var _this = _super.call(this) || this;
        _this.treeControl = treeControl;
        _this.treeFlattener = treeFlattener;
        _this._flattenedData = new rxjs_BehaviorSubject.BehaviorSubject([]);
        _this._expandedData = new rxjs_BehaviorSubject.BehaviorSubject([]);
        _this._data = new rxjs_BehaviorSubject.BehaviorSubject(initialData);
        return _this;
    }
    Object.defineProperty(MatTreeFlatDataSource.prototype, "data", {
        get: /**
         * @return {?}
         */
        function () { return this._data.value; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._data.next(value);
            this._flattenedData.next(this.treeFlattener.flattenNodes(this.data));
            this.treeControl.dataNodes = this._flattenedData.value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    MatTreeFlatDataSource.prototype.connect = /**
     * @param {?} collectionViewer
     * @return {?}
     */
    function (collectionViewer) {
        var _this = this;
        var /** @type {?} */ changes = [
            collectionViewer.viewChange,
            /** @type {?} */ ((this.treeControl.expansionModel.onChange)),
            this._flattenedData
        ];
        return rxjs_observable_merge.merge.apply(void 0, changes).pipe(rxjs_operators_map.map(function () {
            _this._expandedData.next(_this.treeFlattener.expandFlattenedNodes(_this._flattenedData.value, _this.treeControl));
            return _this._expandedData.value;
        }));
    };
    /**
     * @return {?}
     */
    MatTreeFlatDataSource.prototype.disconnect = /**
     * @return {?}
     */
    function () {
        // no op
    };
    return MatTreeFlatDataSource;
}(_angular_cdk_collections.DataSource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        _this._data = new rxjs_BehaviorSubject.BehaviorSubject([]);
        return _this;
    }
    Object.defineProperty(MatTreeNestedDataSource.prototype, "data", {
        /**
         * Data for the nested treee
         */
        get: /**
         * Data for the nested treee
         * @return {?}
         */
        function () { return this._data.value; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._data.next(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    MatTreeNestedDataSource.prototype.connect = /**
     * @param {?} collectionViewer
     * @return {?}
     */
    function (collectionViewer) {
        var _this = this;
        return rxjs_observable_merge.merge.apply(void 0, [collectionViewer.viewChange, this._data]).pipe(rxjs_operators_map.map(function () {
            return _this.data;
        }));
    };
    /**
     * @return {?}
     */
    MatTreeNestedDataSource.prototype.disconnect = /**
     * @return {?}
     */
    function () {
        // no op
    };
    return MatTreeNestedDataSource;
}(_angular_cdk_collections.DataSource));

exports._MatTreeNodeMixinBase = _MatTreeNodeMixinBase;
exports._MatNestedTreeNodeMixinBase = _MatNestedTreeNodeMixinBase;
exports.MatTreeNode = MatTreeNode;
exports.MatTreeNodeDef = MatTreeNodeDef;
exports.MatNestedTreeNode = MatNestedTreeNode;
exports.MatTreeNodePadding = MatTreeNodePadding;
exports.MatTree = MatTree;
exports.MatTreeModule = MatTreeModule;
exports.MatTreeNodeToggle = MatTreeNodeToggle;
exports.MatTreeFlattener = MatTreeFlattener;
exports.MatTreeFlatDataSource = MatTreeFlatDataSource;
exports.MatTreeNestedDataSource = MatTreeNestedDataSource;
exports.ɵa17 = MatTreeNodeOutlet;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-tree.umd.js.map
