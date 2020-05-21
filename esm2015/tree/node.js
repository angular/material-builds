/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { CDK_TREE_NODE_OUTLET_NODE, CdkNestedTreeNode, CdkTree, CdkTreeNode, CdkTreeNodeDef, } from '@angular/cdk/tree';
import { Attribute, Directive, ElementRef, Input, IterableDiffers, } from '@angular/core';
import { mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
const _MatTreeNodeMixinBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
let MatTreeNode = /** @class */ (() => {
    var MatTreeNode_1;
    let MatTreeNode = MatTreeNode_1 = class MatTreeNode extends _MatTreeNodeMixinBase {
        constructor(_elementRef, _tree, tabIndex) {
            super(_elementRef, _tree);
            this._elementRef = _elementRef;
            this._tree = _tree;
            this.role = 'treeitem';
            this.tabIndex = Number(tabIndex) || 0;
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatTreeNode.prototype, "role", void 0);
    MatTreeNode = MatTreeNode_1 = __decorate([
        Directive({
            selector: 'mat-tree-node',
            exportAs: 'matTreeNode',
            inputs: ['disabled', 'tabIndex'],
            host: {
                '[attr.aria-expanded]': 'isExpanded',
                '[attr.aria-level]': 'role === "treeitem" ? level : null',
                '[attr.role]': 'role',
                'class': 'mat-tree-node'
            },
            providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode_1 }]
        }),
        __param(2, Attribute('tabindex')),
        __metadata("design:paramtypes", [ElementRef,
            CdkTree, String])
    ], MatTreeNode);
    return MatTreeNode;
})();
export { MatTreeNode };
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
let MatTreeNodeDef = /** @class */ (() => {
    var MatTreeNodeDef_1;
    let MatTreeNodeDef = MatTreeNodeDef_1 = class MatTreeNodeDef extends CdkTreeNodeDef {
    };
    __decorate([
        Input('matTreeNode'),
        __metadata("design:type", Object)
    ], MatTreeNodeDef.prototype, "data", void 0);
    MatTreeNodeDef = MatTreeNodeDef_1 = __decorate([
        Directive({
            selector: '[matTreeNodeDef]',
            inputs: [
                'when: matTreeNodeDefWhen'
            ],
            providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef_1 }]
        })
    ], MatTreeNodeDef);
    return MatTreeNodeDef;
})();
export { MatTreeNodeDef };
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
let MatNestedTreeNode = /** @class */ (() => {
    var MatNestedTreeNode_1;
    let MatNestedTreeNode = MatNestedTreeNode_1 = class MatNestedTreeNode extends CdkNestedTreeNode {
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
    };
    __decorate([
        Input('matNestedTreeNode'),
        __metadata("design:type", Object)
    ], MatNestedTreeNode.prototype, "node", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatNestedTreeNode.prototype, "disabled", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatNestedTreeNode.prototype, "tabIndex", null);
    MatNestedTreeNode = MatNestedTreeNode_1 = __decorate([
        Directive({
            selector: 'mat-nested-tree-node',
            exportAs: 'matNestedTreeNode',
            host: {
                '[attr.aria-expanded]': 'isExpanded',
                '[attr.role]': 'role',
                'class': 'mat-nested-tree-node',
            },
            providers: [
                { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode_1 },
                { provide: CdkTreeNode, useExisting: MatNestedTreeNode_1 },
                { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode_1 }
            ]
        }),
        __param(3, Attribute('tabindex')),
        __metadata("design:paramtypes", [ElementRef,
            CdkTree,
            IterableDiffers, String])
    ], MatNestedTreeNode);
    return MatNestedTreeNode;
})();
export { MatNestedTreeNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsaUJBQWlCLEVBQ2pCLE9BQU8sRUFDUCxXQUFXLEVBQ1gsY0FBYyxHQUNmLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUVMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxlQUFlLEdBRWhCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCxhQUFhLEVBQ2IsYUFBYSxHQUNkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFMUUsTUFBTSxxQkFBcUIsR0FDdkIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTlDOztHQUVHO0FBYUg7O0lBQUEsSUFBYSxXQUFXLG1CQUF4QixNQUFhLFdBQWUsU0FBUSxxQkFBd0I7UUFJMUQsWUFBc0IsV0FBb0MsRUFDcEMsS0FBaUIsRUFDSixRQUFnQjtZQUNqRCxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBSE4sZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1lBQ3BDLFVBQUssR0FBTCxLQUFLLENBQVk7WUFIOUIsU0FBSSxHQUF5QixVQUFVLENBQUM7WUFPL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FHRixDQUFBO0lBWFU7UUFBUixLQUFLLEVBQUU7OzZDQUF5QztJQUZ0QyxXQUFXO1FBWnZCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLE1BQU0sRUFBRSxDQUFDLFVB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QixPQUFPLEVBQUUsc0JBQXNCO2FBQ2hDO1lBQ0QsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxtQkFBaUIsRUFBQztnQkFDNUQsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxtQkFBaUIsRUFBQztnQkFDdEQsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsV0FBVyxFQUFFLG1CQUFpQixFQUFDO2FBQ3JFO1NBQ0YsQ0FBQztRQXVCYSxXQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTt5Q0FIQyxVQUFVO1lBQ2hCLE9BQU87WUFDSixlQUFlO09BckJwQyxpQkFBaUIsQ0F1QzdCO0lBQUQsd0JBQUM7S0FBQTtTQXZDWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSxcbiAgQ2RrTmVzdGVkVHJlZU5vZGUsXG4gIENka1RyZWUsXG4gIENka1RyZWVOb2RlLFxuICBDZGtUcmVlTm9kZURlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5jb25zdCBfTWF0VHJlZU5vZGVNaXhpbkJhc2U6IEhhc1RhYkluZGV4Q3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIENka1RyZWVOb2RlID1cbiAgICBtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZWQoQ2RrVHJlZU5vZGUpKTtcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBub2RlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRyZWUtbm9kZScsXG4gIGV4cG9ydEFzOiAnbWF0VHJlZU5vZGUnLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAndGFiSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdpc0V4cGFuZGVkJyxcbiAgICAnW2F0dHIuYXJpYS1sZXZlbF0nOiAncm9sZSA9PT0gXCJ0cmVlaXRlbVwiID8gbGV2ZWwgOiBudWxsJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ2NsYXNzJzogJ21hdC10cmVlLW5vZGUnXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGU8VD4gZXh0ZW5kcyBfTWF0VHJlZU5vZGVNaXhpbkJhc2U8VD5cbiAgICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIEhhc1RhYkluZGV4IHtcbiAgQElucHV0KCkgcm9sZTogJ3RyZWVpdGVtJyB8ICdncm91cCcgPSAndHJlZWl0ZW0nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfdHJlZTogQ2RrVHJlZTxUPixcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYsIF90cmVlKTtcblxuICAgIHRoaXMudGFiSW5kZXggPSBOdW1iZXIodGFiSW5kZXgpIHx8IDA7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBub2RlIGRlZmluaXRpb24gd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVEZWZdJyxcbiAgaW5wdXRzOiBbXG4gICAgJ3doZW46IG1hdFRyZWVOb2RlRGVmV2hlbidcbiAgXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlRGVmLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGVEZWZ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZURlZjxUPiBleHRlbmRzIENka1RyZWVOb2RlRGVmPFQ+IHtcbiAgQElucHV0KCdtYXRUcmVlTm9kZScpIGRhdGE6IFQ7XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbmVzdGVkIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtbmVzdGVkLXRyZWUtbm9kZScsXG4gIGV4cG9ydEFzOiAnbWF0TmVzdGVkVHJlZU5vZGUnLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzRXhwYW5kZWQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnY2xhc3MnOiAnbWF0LW5lc3RlZC10cmVlLW5vZGUnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrTmVzdGVkVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gICAge3Byb3ZpZGU6IENka1RyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9LFxuICAgIHtwcm92aWRlOiBDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0TmVzdGVkVHJlZU5vZGU8VD4gZXh0ZW5kcyBDZGtOZXN0ZWRUcmVlTm9kZTxUPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsXG4gIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnbWF0TmVzdGVkVHJlZU5vZGUnKSBub2RlOiBUO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBub2RlIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkgeyB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogVGFiaW5kZXggZm9yIHRoZSBub2RlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdGFiSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAtMSA6IHRoaXMuX3RhYkluZGV4OyB9XG4gIHNldCB0YWJJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgLy8gSWYgdGhlIHNwZWNpZmllZCB0YWJJbmRleCB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgIHRoaXMuX3RhYkluZGV4ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogMDtcbiAgfVxuICBwcml2YXRlIF90YWJJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfdHJlZTogQ2RrVHJlZTxUPixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmLCBfdHJlZSwgX2RpZmZlcnMpO1xuICAgIHRoaXMudGFiSW5kZXggPSBOdW1iZXIodGFiSW5kZXgpIHx8IDA7XG4gIH1cblxuICAvLyBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjMwOTFcbiAgLy8gSW4gYW90IG1vZGUsIHRoZSBsaWZlY3ljbGUgaG9va3MgZnJvbSBwYXJlbnQgY2xhc3MgYXJlIG5vdCBjYWxsZWQuXG4gIC8vIFRPRE8odGluYXl1YW5nYW8pOiBSZW1vdmUgd2hlbiB0aGUgYW5ndWxhciBpc3N1ZSAjMjMwOTEgaXMgZml4ZWRcbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHN1cGVyLm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19