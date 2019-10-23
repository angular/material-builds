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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3BhZGRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFTL0MsTUFBTSxPQUFPLGtCQUFzQixTQUFRLGtCQUFxQjs7O1lBSi9ELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQzthQUM1RTs7O29CQUlFLEtBQUssU0FBQyxvQkFBb0I7cUJBRzFCLEtBQUssU0FBQywwQkFBMEI7Ozs7Ozs7SUFIakMsbUNBQTJDOzs7OztJQUczQyxvQ0FBa0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Q2RrVHJlZU5vZGVQYWRkaW5nfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIHBhZGRpbmcgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVQYWRkaW5nXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZVBhZGRpbmcsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZVBhZGRpbmd9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZVBhZGRpbmc8VD4gZXh0ZW5kcyBDZGtUcmVlTm9kZVBhZGRpbmc8VD4ge1xuXG4gIC8qKiBUaGUgbGV2ZWwgb2YgZGVwdGggb2YgdGhlIHRyZWUgbm9kZS4gVGhlIHBhZGRpbmcgd2lsbCBiZSBgbGV2ZWwgKiBpbmRlbnRgIHBpeGVscy4gKi9cbiAgQElucHV0KCdtYXRUcmVlTm9kZVBhZGRpbmcnKSBsZXZlbDogbnVtYmVyO1xuXG4gIC8qKiBUaGUgaW5kZW50IGZvciBlYWNoIGxldmVsLiBEZWZhdWx0IG51bWJlciA0MHB4IGZyb20gbWF0ZXJpYWwgZGVzaWduIG1lbnUgc3ViLW1lbnUgc3BlYy4gKi9cbiAgQElucHV0KCdtYXRUcmVlTm9kZVBhZGRpbmdJbmRlbnQnKSBpbmRlbnQ6IG51bWJlcjtcbn1cbiJdfQ==