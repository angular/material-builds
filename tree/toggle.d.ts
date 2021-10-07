import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
export declare class MatTreeNodeToggle<T, K = T> extends CdkTreeNodeToggle<T, K> {
    get recursive(): boolean;
    set recursive(value: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTreeNodeToggle<any, any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTreeNodeToggle<any, any>, "[matTreeNodeToggle]", never, { "recursive": "matTreeNodeToggleRecursive"; }, {}, never>;
}
