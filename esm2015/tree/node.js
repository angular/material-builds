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
const _MatTreeNodeMixinBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
let MatTreeNode = /** @class */ (() => {
    class MatTreeNode extends _MatTreeNodeMixinBase {
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
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
let MatTreeNodeDef = /** @class */ (() => {
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
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
let MatNestedTreeNode = /** @class */ (() => {
    class MatNestedTreeNode extends CdkNestedTreeNode {
        constructor(_elementRef, _tree, _differs, tabIndex) {
            super(_elementRef, _tree, _differs);
            this._elementRef = _elementRef;
            this._tree = _tree;
            this._differs = _differs;
            this._disabled = false;
            this.tabIndex = Number(tabIndex) || 0;
        }
        /** Whether the node is disabled. */
        get disabled() { return this._disabled; }
        set disabled(value) { this._disabled = coerceBooleanProperty(value); }
        /** Tabindex for the node. */
        get tabIndex() { return this.disabled ? -1 : this._tabIndex; }
        set tabIndex(value) {
            // If the specified tabIndex value is null or undefined, fall back to the default value.
            this._tabIndex = value != null ? value : 0;
        }
        // This is a workaround for https://github.com/angular/angular/issues/23091
        // In aot mode, the lifecycle hooks from parent class are not called.
        // TODO(tinayuangao): Remove when the angular issue #23091 is fixed
        ngAfterContentInit() {
            super.ngAfterContentInit();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFdBQVcsRUFDWCxjQUFjLEdBQ2YsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBRUwsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGVBQWUsR0FFaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUtMLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRSxNQUFNLHFCQUFxQixHQUN2QixhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFFOUM7O0dBRUc7QUFDSDtJQUFBLE1BWWEsV0FBZSxTQUFRLHFCQUF3QjtRQUkxRCxZQUFzQixXQUFvQyxFQUNwQyxLQUFpQixFQUNKLFFBQWdCO1lBQ2pELEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFITixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7WUFDcEMsVUFBSyxHQUFMLEtBQUssQ0FBWTtZQUg5QixTQUFJLEdBQXlCLFVBQVUsQ0FBQztZQU8vQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQzs7O2dCQXRCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSxhQUFhO29CQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO29CQUNoQyxJQUFJLEVBQUU7d0JBQ0osc0JBQXNCLEVBQUUsWUFBWTt3QkFD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dUJBcEJoQyxLQUFLLFNBQUMsbUJBQW1COzJCQUd6QixLQUFLOzJCQU1MLEtBQUs7O0lBNEJSLHdCQUFDO0tBQUE7U0F2Q1ksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENES19UUkVFX05PREVfT1VUTEVUX05PREUsXG4gIENka05lc3RlZFRyZWVOb2RlLFxuICBDZGtUcmVlLFxuICBDZGtUcmVlTm9kZSxcbiAgQ2RrVHJlZU5vZGVEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcblxuY29uc3QgX01hdFRyZWVOb2RlTWl4aW5CYXNlOiBIYXNUYWJJbmRleEN0b3IgJiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBDZGtUcmVlTm9kZSA9XG4gICAgbWl4aW5UYWJJbmRleChtaXhpbkRpc2FibGVkKENka1RyZWVOb2RlKSk7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbm9kZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC10cmVlLW5vZGUnLFxuICBleHBvcnRBczogJ21hdFRyZWVOb2RlJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ3RhYkluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnaXNFeHBhbmRlZCcsXG4gICAgJ1thdHRyLmFyaWEtbGV2ZWxdJzogJ3JvbGUgPT09IFwidHJlZWl0ZW1cIiA/IGxldmVsIDogbnVsbCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtdHJlZS1ub2RlJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZX1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlPFQ+IGV4dGVuZHMgX01hdFRyZWVOb2RlTWl4aW5CYXNlPFQ+XG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNUYWJJbmRleCB7XG4gIEBJbnB1dCgpIHJvbGU6ICd0cmVlaXRlbScgfCAnZ3JvdXAnID0gJ3RyZWVpdGVtJztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX3RyZWU6IENka1RyZWU8VD4sXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmLCBfdHJlZSk7XG5cbiAgICB0aGlzLnRhYkluZGV4ID0gTnVtYmVyKHRhYkluZGV4KSB8fCAwO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbm9kZSBkZWZpbml0aW9uIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlRGVmXScsXG4gIGlucHV0czogW1xuICAgICd3aGVuOiBtYXRUcmVlTm9kZURlZldoZW4nXG4gIF0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZURlZiwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlRGVmfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVEZWY8VD4gZXh0ZW5kcyBDZGtUcmVlTm9kZURlZjxUPiB7XG4gIEBJbnB1dCgnbWF0VHJlZU5vZGUnKSBkYXRhOiBUO1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5lc3RlZCBub2RlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LW5lc3RlZC10cmVlLW5vZGUnLFxuICBleHBvcnRBczogJ21hdE5lc3RlZFRyZWVOb2RlJyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdpc0V4cGFuZGVkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ2NsYXNzJzogJ21hdC1uZXN0ZWQtdHJlZS1ub2RlJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IENka05lc3RlZFRyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9LFxuICAgIHtwcm92aWRlOiBDZGtUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfSxcbiAgICB7cHJvdmlkZTogQ0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdE5lc3RlZFRyZWVOb2RlPFQ+IGV4dGVuZHMgQ2RrTmVzdGVkVHJlZU5vZGU8VD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LFxuICBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ21hdE5lc3RlZFRyZWVOb2RlJykgbm9kZTogVDtcblxuICAvKiogV2hldGhlciB0aGUgbm9kZSBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFRhYmluZGV4IGZvciB0aGUgbm9kZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRhYkluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmRpc2FibGVkID8gLTEgOiB0aGlzLl90YWJJbmRleDsgfVxuICBzZXQgdGFiSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIC8vIElmIHRoZSBzcGVjaWZpZWQgdGFiSW5kZXggdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQsIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgICB0aGlzLl90YWJJbmRleCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgcHJpdmF0ZSBfdGFiSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX3RyZWU6IENka1RyZWU8VD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZiwgX3RyZWUsIF9kaWZmZXJzKTtcbiAgICB0aGlzLnRhYkluZGV4ID0gTnVtYmVyKHRhYkluZGV4KSB8fCAwO1xuICB9XG5cbiAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIzMDkxXG4gIC8vIEluIGFvdCBtb2RlLCB0aGUgbGlmZWN5Y2xlIGhvb2tzIGZyb20gcGFyZW50IGNsYXNzIGFyZSBub3QgY2FsbGVkLlxuICAvLyBUT0RPKHRpbmF5dWFuZ2FvKTogUmVtb3ZlIHdoZW4gdGhlIGFuZ3VsYXIgaXNzdWUgIzIzMDkxIGlzIGZpeGVkXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==