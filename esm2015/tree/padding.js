/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTreeNodePadding } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
/**
 * Wrapper for the CdkTree padding with Material design styles.
 * @template T
 */
export class MatTreeNodePadding extends CdkTreeNodePadding {
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
if (false) {
    /** @type {?} */
    MatTreeNodePadding.ngAcceptInputType_level;
    /**
     * The level of depth of the tree node. The padding will be `level * indent` pixels.
     * @type {?}
     */
    MatTreeNodePadding.prototype.level;
    /**
     * The indent for each level. Default number 40px from material design menu sub-menu spec.
     * @type {?}
     */
    MatTreeNodePadding.prototype.indent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3BhZGRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFTL0MsTUFBTSxPQUFPLGtCQUFzQixTQUFRLGtCQUFxQjs7O1lBSi9ELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQzthQUM1RTs7O29CQUlFLEtBQUssU0FBQyxvQkFBb0I7cUJBRzFCLEtBQUssU0FBQywwQkFBMEI7Ozs7SUFFakMsMkNBQW1FOzs7OztJQUxuRSxtQ0FBMkM7Ozs7O0lBRzNDLG9DQUFrRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtDZGtUcmVlTm9kZVBhZGRpbmd9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgcGFkZGluZyB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZVBhZGRpbmddJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlUGFkZGluZywgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlUGFkZGluZ31dXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlUGFkZGluZzxUPiBleHRlbmRzIENka1RyZWVOb2RlUGFkZGluZzxUPiB7XG5cbiAgLyoqIFRoZSBsZXZlbCBvZiBkZXB0aCBvZiB0aGUgdHJlZSBub2RlLiBUaGUgcGFkZGluZyB3aWxsIGJlIGBsZXZlbCAqIGluZGVudGAgcGl4ZWxzLiAqL1xuICBASW5wdXQoJ21hdFRyZWVOb2RlUGFkZGluZycpIGxldmVsOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBpbmRlbnQgZm9yIGVhY2ggbGV2ZWwuIERlZmF1bHQgbnVtYmVyIDQwcHggZnJvbSBtYXRlcmlhbCBkZXNpZ24gbWVudSBzdWItbWVudSBzcGVjLiAqL1xuICBASW5wdXQoJ21hdFRyZWVOb2RlUGFkZGluZ0luZGVudCcpIGluZGVudDogbnVtYmVyO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9sZXZlbDogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==