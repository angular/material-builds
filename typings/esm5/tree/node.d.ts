/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, IterableDiffers, QueryList } from '@angular/core';
import { CdkNestedTreeNode, CdkTree, CdkTreeNodeDef, CdkTreeNode } from '@angular/cdk/tree';
import { MatTreeNodeOutlet } from './outlet';
import { CanDisable, HasTabIndex } from '@angular/material/core';
export declare const _MatTreeNodeMixinBase: (new (...args: any[]) => HasTabIndex) & (new (...args: any[]) => CanDisable) & typeof CdkTreeNode;
export declare const _MatNestedTreeNodeMixinBase: (new (...args: any[]) => HasTabIndex) & (new (...args: any[]) => CanDisable) & typeof CdkNestedTreeNode;
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
export declare class MatTreeNode<T> extends _MatTreeNodeMixinBase<T> implements HasTabIndex, CanDisable {
    protected _elementRef: ElementRef;
    protected _tree: CdkTree<T>;
    role: 'treeitem' | 'group';
    constructor(_elementRef: ElementRef, _tree: CdkTree<T>, tabIndex: string);
}
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
export declare class MatTreeNodeDef<T> extends CdkTreeNodeDef<T> {
    data: T;
}
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
export declare class MatNestedTreeNode<T> extends _MatNestedTreeNodeMixinBase<T> implements HasTabIndex, CanDisable {
    protected _elementRef: ElementRef;
    protected _tree: CdkTree<T>;
    protected _differs: IterableDiffers;
    node: T;
    nodeOutlet: QueryList<MatTreeNodeOutlet>;
    constructor(_elementRef: ElementRef, _tree: CdkTree<T>, _differs: IterableDiffers, tabIndex: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}
