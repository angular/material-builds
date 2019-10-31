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
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 * @template T
 */
export class MatTreeNodeToggle extends CdkTreeNodeToggle {
    constructor() {
        super(...arguments);
        this.recursive = false;
    }
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
if (false) {
    /** @type {?} */
    MatTreeNodeToggle.ngAcceptInputType_recursive;
    /** @type {?} */
    MatTreeNodeToggle.prototype.recursive;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7O0FBUy9DLE1BQU0sT0FBTyxpQkFBcUIsU0FBUSxpQkFBb0I7SUFKOUQ7O1FBS3VDLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFHbEUsQ0FBQzs7O1lBUkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO2FBQzFFOzs7d0JBRUUsS0FBSyxTQUFDLDRCQUE0Qjs7OztJQUVuQyw4Q0FBcUQ7O0lBRnJELHNDQUFnRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RyZWVOb2RlVG9nZ2xlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlJ3MgdG9nZ2xlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlVG9nZ2xlXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZVRvZ2dsZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlVG9nZ2xlfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVUb2dnbGU8VD4gZXh0ZW5kcyBDZGtUcmVlTm9kZVRvZ2dsZTxUPiB7XG4gIEBJbnB1dCgnbWF0VHJlZU5vZGVUb2dnbGVSZWN1cnNpdmUnKSByZWN1cnNpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVjdXJzaXZlOiBib29sZWFuIHwgc3RyaW5nO1xufVxuIl19