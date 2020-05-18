/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tree/node.ts
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
let MatTreeNode = /** @class */ (() => {
    /**
     * Wrapper for the CdkTree node with Material design styles.
     * @template T
     */
    class MatTreeNode extends _MatTreeNodeMixinBase {
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
    return MatTreeNode;
})();
export { MatTreeNode };
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
let MatTreeNodeDef = /** @class */ (() => {
    /**
     * Wrapper for the CdkTree node definition with Material design styles.
     * @template T
     */
    class MatTreeNodeDef extends CdkTreeNodeDef {
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
    return MatTreeNodeDef;
})();
export { MatTreeNodeDef };
if (false) {
    /** @type {?} */
    MatTreeNodeDef.prototype.data;
}
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 * @template T
 */
let MatNestedTreeNode = /** @class */ (() => {
    /**
     * Wrapper for the CdkTree nested node with Material design styles.
     * @template T
     */
    class MatNestedTreeNode extends CdkNestedTreeNode {
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
    return MatNestedTreeNode;
})();
export { MatNestedTreeNode };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFdBQVcsRUFDWCxjQUFjLEdBQ2YsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBRUwsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGVBQWUsR0FFaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUtMLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7TUFFcEUscUJBQXFCLEdBQ3ZCLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7O0FBSzdDOzs7OztJQUFBLE1BWWEsV0FBZSxTQUFRLHFCQUF3Qjs7Ozs7O1FBSTFELFlBQXNCLFdBQW9DLEVBQ3BDLEtBQWlCLEVBQ0osUUFBZ0I7WUFDakQsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUhOLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtZQUNwQyxVQUFLLEdBQUwsS0FBSyxDQUFZO1lBSDlCLFNBQUksR0FBeUIsVUFBVSxDQUFDO1lBTy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDOzs7Z0JBdEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7b0JBQ2hDLElBQUksRUFBRTt3QkFDSixzQkFBc0IsRUFBRSxZQUFZO3dCQUNwQyxtQkFBbUIs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LGVBQWU7NkNBbUdGLFNBQVMsU0FBQyxVQUFVOzs7dUJBcEJoQyxLQUFLLFNBQUMsbUJBQW1COzJCQUd6QixLQUFLOzJCQU1MLEtBQUs7O0lBNEJSLHdCQUFDO0tBQUE7U0F2Q1ksaUJBQWlCOzs7SUFzQzVCLDZDQUFnRDs7SUFwQ2hELGlDQUFvQzs7Ozs7SUFNcEMsc0NBQTBCOzs7OztJQVMxQixzQ0FBMEI7Ozs7O0lBRWQsd0NBQThDOzs7OztJQUM5QyxrQ0FBMkI7Ozs7O0lBQzNCLHFDQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFLFxuICBDZGtOZXN0ZWRUcmVlTm9kZSxcbiAgQ2RrVHJlZSxcbiAgQ2RrVHJlZU5vZGUsXG4gIENka1RyZWVOb2RlRGVmLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IF9NYXRUcmVlTm9kZU1peGluQmFzZTogSGFzVGFiSW5kZXhDdG9yICYgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgQ2RrVHJlZU5vZGUgPVxuICAgIG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlZChDZGtUcmVlTm9kZSkpO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXRUcmVlTm9kZScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzRXhwYW5kZWQnLFxuICAgICdbYXR0ci5hcmlhLWxldmVsXSc6ICdyb2xlID09PSBcInRyZWVpdGVtXCIgPyBsZXZlbCA6IG51bGwnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXRyZWUtbm9kZSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGV9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZTxUPiBleHRlbmRzIF9NYXRUcmVlTm9kZU1peGluQmFzZTxUPlxuICAgIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgge1xuICBASW5wdXQoKSByb2xlOiAndHJlZWl0ZW0nIHwgJ2dyb3VwJyA9ICd0cmVlaXRlbSc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF90cmVlOiBDZGtUcmVlPFQ+LFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZiwgX3RyZWUpO1xuXG4gICAgdGhpcy50YWJJbmRleCA9IE51bWJlcih0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgZGVmaW5pdGlvbiB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZURlZl0nLFxuICBpbnB1dHM6IFtcbiAgICAnd2hlbjogbWF0VHJlZU5vZGVEZWZXaGVuJ1xuICBdLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGVEZWYsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZURlZn1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlRGVmPFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVEZWY8VD4ge1xuICBASW5wdXQoJ21hdFRyZWVOb2RlJykgZGF0YTogVDtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBuZXN0ZWQgbm9kZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1uZXN0ZWQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXROZXN0ZWRUcmVlTm9kZScsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnaXNFeHBhbmRlZCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtbmVzdGVkLXRyZWUtbm9kZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtOZXN0ZWRUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfSxcbiAgICB7cHJvdmlkZTogQ2RrVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gICAge3Byb3ZpZGU6IENES19UUkVFX05PREVfT1VUTEVUX05PREUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXROZXN0ZWRUcmVlTm9kZTxUPiBleHRlbmRzIENka05lc3RlZFRyZWVOb2RlPFQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgT25EZXN0cm95IHtcbiAgQElucHV0KCdtYXROZXN0ZWRUcmVlTm9kZScpIG5vZGU6IFQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG5vZGUgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIG5vZGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0YWJJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IC0xIDogdGhpcy5fdGFiSW5kZXg7IH1cbiAgc2V0IHRhYkluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICAvLyBJZiB0aGUgc3BlY2lmaWVkIHRhYkluZGV4IHZhbHVlIGlzIG51bGwgb3IgdW5kZWZpbmVkLCBmYWxsIGJhY2sgdG8gdGhlIGRlZmF1bHQgdmFsdWUuXG4gICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAwO1xuICB9XG4gIHByaXZhdGUgX3RhYkluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF90cmVlOiBDZGtUcmVlPFQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2RpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYsIF90cmVlLCBfZGlmZmVycyk7XG4gICAgdGhpcy50YWJJbmRleCA9IE51bWJlcih0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMzA5MVxuICAvLyBJbiBhb3QgbW9kZSwgdGhlIGxpZmVjeWNsZSBob29rcyBmcm9tIHBhcmVudCBjbGFzcyBhcmUgbm90IGNhbGxlZC5cbiAgLy8gVE9ETyh0aW5heXVhbmdhbyk6IFJlbW92ZSB3aGVuIHRoZSBhbmd1bGFyIGlzc3VlICMyMzA5MSBpcyBmaXhlZFxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=