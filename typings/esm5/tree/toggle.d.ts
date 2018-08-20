import { CdkTreeNodeToggle, CdkTree, CdkTreeNode } from '@angular/cdk/tree';
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
export declare class MatTreeNodeToggle<T> extends CdkTreeNodeToggle<T> {
    recursive: boolean;
    constructor(_tree: CdkTree<T>, _treeNode: CdkTreeNode<T>);
}
