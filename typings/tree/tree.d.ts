import { CdkTree } from '@angular/cdk/tree';
import { MatTreeNodeOutlet } from './outlet';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export declare class MatTree<T> extends CdkTree<T> {
    _nodeOutlet: MatTreeNodeOutlet;
}
