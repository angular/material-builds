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
    MatTreeNode.ngAcceptInputType_disabled;
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
    MatNestedTreeNode.ngAcceptInputType_disabled;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLGlCQUFpQixFQUNqQixPQUFPLEVBQ1AsV0FBVyxFQUNYLGNBQWMsR0FDZixNQUFNLG1CQUFtQixDQUFDO0FBQzNCLE9BQU8sRUFFTCxTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsZUFBZSxHQUVoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsYUFBYSxFQUNiLGFBQWEsR0FDZCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztNQUV0RCxxQkFBcUIsR0FDdkIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7QUFpQjdDLE1BQU0sT0FBTyxXQUFlLFNBQVEscUJBQXdCOzs7Ozs7SUFJMUQsWUFBc0IsV0FBb0MsRUFDcEMsS0FBaUIsRUFDSixRQUFnQjtRQUNqRCxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSE4sZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFIOUIsU0FBSSxHQUF5QixVQUFVLENBQUM7UUFPL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OztZQXRCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEVBQUU7b0JBQ0osc0JBQXNCLEVBQUUsWUFBWTtvQkFDcEMsbUJBQW1CLEVBQUUs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QUs7Ozs7SUEyQk4sNkNBQW9EOztJQXBDcEQsaUNBQW9DOzs7OztJQU1wQyxzQ0FBMEI7Ozs7O0lBUzFCLHNDQUEwQjs7Ozs7SUFFZCx3Q0FBOEM7Ozs7O0lBQzlDLGtDQUEyQjs7Ozs7SUFDM0IscUNBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENES19UUkVFX05PREVfT1VUTEVUX05PREUsXG4gIENka05lc3RlZFRyZWVOb2RlLFxuICBDZGtUcmVlLFxuICBDZGtUcmVlTm9kZSxcbiAgQ2RrVHJlZU5vZGVEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IF9NYXRUcmVlTm9kZU1peGluQmFzZTogSGFzVGFiSW5kZXhDdG9yICYgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgQ2RrVHJlZU5vZGUgPVxuICAgIG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlZChDZGtUcmVlTm9kZSkpO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXRUcmVlTm9kZScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzRXhwYW5kZWQnLFxuICAgICdbYXR0ci5hcmlhLWxldmVsXSc6ICdyb2xlID09PSBcInRyZWVpdGVtXCIgPyBsZXZlbCA6IG51bGwnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXRyZWUtbm9kZSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGV9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZTxUPiBleHRlbmRzIF9NYXRUcmVlTm9kZU1peGluQmFzZTxUPlxuICAgIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgge1xuICBASW5wdXQoKSByb2xlOiAndHJlZWl0ZW0nIHwgJ2dyb3VwJyA9ICd0cmVlaXRlbSc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF90cmVlOiBDZGtUcmVlPFQ+LFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZiwgX3RyZWUpO1xuXG4gICAgdGhpcy50YWJJbmRleCA9IE51bWJlcih0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8IHN0cmluZztcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBub2RlIGRlZmluaXRpb24gd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVEZWZdJyxcbiAgaW5wdXRzOiBbXG4gICAgJ3doZW46IG1hdFRyZWVOb2RlRGVmV2hlbidcbiAgXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlRGVmLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGVEZWZ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZURlZjxUPiBleHRlbmRzIENka1RyZWVOb2RlRGVmPFQ+IHtcbiAgQElucHV0KCdtYXRUcmVlTm9kZScpIGRhdGE6IFQ7XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbmVzdGVkIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtbmVzdGVkLXRyZWUtbm9kZScsXG4gIGV4cG9ydEFzOiAnbWF0TmVzdGVkVHJlZU5vZGUnLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzRXhwYW5kZWQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnY2xhc3MnOiAnbWF0LW5lc3RlZC10cmVlLW5vZGUnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrTmVzdGVkVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gICAge3Byb3ZpZGU6IENka1RyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9LFxuICAgIHtwcm92aWRlOiBDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0TmVzdGVkVHJlZU5vZGU8VD4gZXh0ZW5kcyBDZGtOZXN0ZWRUcmVlTm9kZTxUPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsXG4gIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnbWF0TmVzdGVkVHJlZU5vZGUnKSBub2RlOiBUO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBub2RlIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkgeyB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogVGFiaW5kZXggZm9yIHRoZSBub2RlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdGFiSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAtMSA6IHRoaXMuX3RhYkluZGV4OyB9XG4gIHNldCB0YWJJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgLy8gSWYgdGhlIHNwZWNpZmllZCB0YWJJbmRleCB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgIHRoaXMuX3RhYkluZGV4ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogMDtcbiAgfVxuICBwcml2YXRlIF90YWJJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfdHJlZTogQ2RrVHJlZTxUPixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmLCBfdHJlZSwgX2RpZmZlcnMpO1xuICAgIHRoaXMudGFiSW5kZXggPSBOdW1iZXIodGFiSW5kZXgpIHx8IDA7XG4gIH1cblxuICAvLyBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjMwOTFcbiAgLy8gSW4gYW90IG1vZGUsIHRoZSBsaWZlY3ljbGUgaG9va3MgZnJvbSBwYXJlbnQgY2xhc3MgYXJlIG5vdCBjYWxsZWQuXG4gIC8vIFRPRE8odGluYXl1YW5nYW8pOiBSZW1vdmUgd2hlbiB0aGUgYW5ndWxhciBpc3N1ZSAjMjMwOTEgaXMgZml4ZWRcbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHN1cGVyLm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8IHN0cmluZztcbn1cbiJdfQ==