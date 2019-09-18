/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkNestedTreeNode, CdkTree, CdkTreeNode, CdkTreeNodeDef, } from '@angular/cdk/tree';
import { Attribute, Directive, ElementRef, Input, IterableDiffers, } from '@angular/core';
import { mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** @type {?} */
const _MatTreeNodeMixinBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 * @template T
 */
export class MatTreeNode extends _MatTreeNodeMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} _tree
     * @param {?} tabIndex
     */
    constructor(_elementRef, _tree, tabIndex) {
        super(_elementRef, _tree);
        this._elementRef = _elementRef;
        this._tree = _tree;
        this.role = 'treeitem';
        this.tabIndex = Number(tabIndex) || 0;
    }
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
MatTreeNode.ctorParameters = () => [
    { type: ElementRef },
    { type: CdkTree },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
MatTreeNode.propDecorators = {
    role: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatTreeNode.prototype.role;
    /**
     * @type {?}
     * @protected
     */
    MatTreeNode.prototype._elementRef;
    /**
     * @type {?}
     * @protected
     */
    MatTreeNode.prototype._tree;
}
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 * @template T
 */
export class MatTreeNodeDef extends CdkTreeNodeDef {
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
if (false) {
    /** @type {?} */
    MatTreeNodeDef.prototype.data;
}
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 * @template T
 */
export class MatNestedTreeNode extends CdkNestedTreeNode {
    /**
     * @param {?} _elementRef
     * @param {?} _tree
     * @param {?} _differs
     * @param {?} tabIndex
     */
    constructor(_elementRef, _tree, _differs, tabIndex) {
        super(_elementRef, _tree, _differs);
        this._elementRef = _elementRef;
        this._tree = _tree;
        this._differs = _differs;
        this._disabled = false;
        this.tabIndex = Number(tabIndex) || 0;
    }
    /**
     * Whether the node is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }
    /**
     * Tabindex for the node.
     * @return {?}
     */
    get tabIndex() { return this.disabled ? -1 : this._tabIndex; }
    /**
     * @param {?} value
     * @return {?}
     */
    set tabIndex(value) {
        // If the specified tabIndex value is null or undefined, fall back to the default value.
        this._tabIndex = value != null ? value : 0;
    }
    // This is a workaround for https://github.com/angular/angular/issues/23091
    // In aot mode, the lifecycle hooks from parent class are not called.
    // TODO(tinayuangao): Remove when the angular issue #23091 is fixed
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        super.ngAfterContentInit();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
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
MatNestedTreeNode.ctorParameters = () => [
    { type: ElementRef },
    { type: CdkTree },
    { type: IterableDiffers },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
MatNestedTreeNode.propDecorators = {
    node: [{ type: Input, args: ['matNestedTreeNode',] }],
    disabled: [{ type: Input }],
    tabIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatNestedTreeNode.prototype.node;
    /**
     * @type {?}
     * @private
     */
    MatNestedTreeNode.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    MatNestedTreeNode.prototype._tabIndex;
    /**
     * @type {?}
     * @protected
     */
    MatNestedTreeNode.prototype._elementRef;
    /**
     * @type {?}
     * @protected
     */
    MatNestedTreeNode.prototype._tree;
    /**
     * @type {?}
     * @protected
     */
    MatNestedTreeNode.prototype._differs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLGlCQUFpQixFQUNqQixPQUFPLEVBQ1AsV0FBVyxFQUNYLGNBQWMsR0FDZixNQUFNLG1CQUFtQixDQUFDO0FBQzNCLE9BQU8sRUFFTCxTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsZUFBZSxHQUVoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsYUFBYSxFQUNiLGFBQWEsR0FDZCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztNQUV0RCxxQkFBcUIsR0FDdkIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7QUFpQjdDLE1BQU0sT0FBTyxXQUFlLFNBQVEscUJBQXdCOzs7Ozs7SUFJMUQsWUFBc0IsV0FBb0MsRUFDcEMsS0FBaUIsRUFDSixRQUFnQjtRQUNqRCxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSE4sZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFIOUIsU0FBSSxHQUF5QixVQUFVLENBQUM7UUFPL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OztZQXRCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEVBQUU7b0JBQ0osc0JBQXNCLEVBQUUsWUFBWTtvQkFDcEMsbUJBQW1CLEVBQUUsb0NBQW9DO29CQUN6RCxhQUFhLEVBQUUsTUFBTTtvQkFDckIsT0FBTyxFQUFFLGVBQWU7aUJBQ3pCO2dCQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7YUFDOUQ7Ozs7WUFoQ0MsVUFBVTtZQVJWLE9BQU87eUNBK0NNLFNBQVMsU0FBQyxVQUFVOzs7bUJBSmhDLEtBQUs7Ozs7SUFBTiwyQkFBaUQ7Ozs7O0lBRXJDLGtDQUE4Qzs7Ozs7SUFDOUMsNEJBQTJCOzs7Ozs7QUFrQnpDLE1BQU0sT0FBTyxjQUFrQixTQUFRLGNBQWlCOzs7WUFQdkQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLE1BQU0sRUFBRTtvQkFDTiwwQkFBMEI7aUJBQzNCO2dCQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7YUFDcEU7OzttQkFFRSxLQUFLLFNBQUMsYUFBYTs7OztJQUFwQiw4QkFBOEI7Ozs7OztBQW9CaEMsTUFBTSxPQUFPLGlCQUFxQixTQUFRLGlCQUFvQjs7Ozs7OztJQW1CNUQsWUFBc0IsV0FBb0MsRUFDcEMsS0FBaUIsRUFDakIsUUFBeUIsRUFDWixRQUFnQjtRQUNqRCxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUpoQixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFpQjtRQWJ2QyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBZ0J4QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7Ozs7SUFwQkQsSUFDSSxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDekMsSUFBSSxRQUFRLENBQUMsS0FBVSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7OztJQUkzRSxJQUNJLFFBQVEsS0FBYSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDdEUsSUFBSSxRQUFRLENBQUMsS0FBYTtRQUN4Qix3RkFBd0Y7UUFDeEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDOzs7Ozs7O0lBY0Qsa0JBQWtCO1FBQ2hCLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7OztZQWxERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsSUFBSSxFQUFFO29CQUNKLHNCQUFzQixFQUFFLFlBQVk7b0JBQ3BDLGFBQWEsRUFBRSxNQUFNO29CQUNyQixPQUFPLEVBQUUsc0JBQXNCO2lCQUNoQztnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDO29CQUM1RCxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDO29CQUN0RCxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUM7aUJBQ3JFO2FBQ0Y7Ozs7WUE1RUMsVUFBVTtZQVJWLE9BQU87WUFVUCxlQUFlO3lDQWlHRixTQUFTLFNBQUMsVUFBVTs7O21CQXBCaEMsS0FBSyxTQUFDLG1CQUFtQjt1QkFHekIsS0FBSzt1QkFNTCxLQUFLOzs7O0lBVE4saUNBQW9DOzs7OztJQU1wQyxzQ0FBMEI7Ozs7O0lBUzFCLHNDQUEwQjs7Ozs7SUFFZCx3Q0FBOEM7Ozs7O0lBQzlDLGtDQUEyQjs7Ozs7SUFDM0IscUNBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENES19UUkVFX05PREVfT1VUTEVUX05PREUsXG4gIENka05lc3RlZFRyZWVOb2RlLFxuICBDZGtUcmVlLFxuICBDZGtUcmVlTm9kZSxcbiAgQ2RrVHJlZU5vZGVEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IF9NYXRUcmVlTm9kZU1peGluQmFzZTogSGFzVGFiSW5kZXhDdG9yICYgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgQ2RrVHJlZU5vZGUgPVxuICAgIG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlZChDZGtUcmVlTm9kZSkpO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXRUcmVlTm9kZScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzRXhwYW5kZWQnLFxuICAgICdbYXR0ci5hcmlhLWxldmVsXSc6ICdyb2xlID09PSBcInRyZWVpdGVtXCIgPyBsZXZlbCA6IG51bGwnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXRyZWUtbm9kZSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGV9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZTxUPiBleHRlbmRzIF9NYXRUcmVlTm9kZU1peGluQmFzZTxUPlxuICAgIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgge1xuICBASW5wdXQoKSByb2xlOiAndHJlZWl0ZW0nIHwgJ2dyb3VwJyA9ICd0cmVlaXRlbSc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF90cmVlOiBDZGtUcmVlPFQ+LFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZiwgX3RyZWUpO1xuXG4gICAgdGhpcy50YWJJbmRleCA9IE51bWJlcih0YWJJbmRleCkgfHwgMDtcbiAgfVxufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgZGVmaW5pdGlvbiB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZURlZl0nLFxuICBpbnB1dHM6IFtcbiAgICAnd2hlbjogbWF0VHJlZU5vZGVEZWZXaGVuJ1xuICBdLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGVEZWYsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZURlZn1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlRGVmPFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVEZWY8VD4ge1xuICBASW5wdXQoJ21hdFRyZWVOb2RlJykgZGF0YTogVDtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBuZXN0ZWQgbm9kZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1uZXN0ZWQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXROZXN0ZWRUcmVlTm9kZScsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnaXNFeHBhbmRlZCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtbmVzdGVkLXRyZWUtbm9kZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtOZXN0ZWRUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfSxcbiAgICB7cHJvdmlkZTogQ2RrVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gICAge3Byb3ZpZGU6IENES19UUkVFX05PREVfT1VUTEVUX05PREUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXROZXN0ZWRUcmVlTm9kZTxUPiBleHRlbmRzIENka05lc3RlZFRyZWVOb2RlPFQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgT25EZXN0cm95IHtcbiAgQElucHV0KCdtYXROZXN0ZWRUcmVlTm9kZScpIG5vZGU6IFQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG5vZGUgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIG5vZGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0YWJJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IC0xIDogdGhpcy5fdGFiSW5kZXg7IH1cbiAgc2V0IHRhYkluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICAvLyBJZiB0aGUgc3BlY2lmaWVkIHRhYkluZGV4IHZhbHVlIGlzIG51bGwgb3IgdW5kZWZpbmVkLCBmYWxsIGJhY2sgdG8gdGhlIGRlZmF1bHQgdmFsdWUuXG4gICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAwO1xuICB9XG4gIHByaXZhdGUgX3RhYkluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF90cmVlOiBDZGtUcmVlPFQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2RpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYsIF90cmVlLCBfZGlmZmVycyk7XG4gICAgdGhpcy50YWJJbmRleCA9IE51bWJlcih0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMzA5MVxuICAvLyBJbiBhb3QgbW9kZSwgdGhlIGxpZmVjeWNsZSBob29rcyBmcm9tIHBhcmVudCBjbGFzcyBhcmUgbm90IGNhbGxlZC5cbiAgLy8gVE9ETyh0aW5heXVhbmdhbyk6IFJlbW92ZSB3aGVuIHRoZSBhbmd1bGFyIGlzc3VlICMyMzA5MSBpcyBmaXhlZFxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICB9XG59XG4iXX0=