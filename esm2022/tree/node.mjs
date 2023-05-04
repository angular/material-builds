/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkNestedTreeNode, CdkTree, CdkTreeNode, CdkTreeNodeDef, } from '@angular/cdk/tree';
import { Attribute, Directive, ElementRef, Input, IterableDiffers, } from '@angular/core';
import { mixinDisabled, mixinTabIndex } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/tree";
const _MatTreeNodeBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
class MatTreeNode extends _MatTreeNodeBase {
    constructor(elementRef, tree, tabIndex) {
        super(elementRef, tree);
        this.tabIndex = Number(tabIndex) || 0;
    }
    // This is a workaround for https://github.com/angular/angular/issues/23091
    // In aot mode, the lifecycle hooks from parent class are not called.
    ngOnInit() {
        super.ngOnInit();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNode, deps: [{ token: i0.ElementRef }, { token: i1.CdkTree }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatTreeNode, selector: "mat-tree-node", inputs: { role: "role", disabled: "disabled", tabIndex: "tabIndex" }, host: { classAttribute: "mat-tree-node" }, providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode }], exportAs: ["matTreeNode"], usesInheritance: true, ngImport: i0 }); }
}
export { MatTreeNode };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNode, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-tree-node',
                    exportAs: 'matTreeNode',
                    inputs: ['role', 'disabled', 'tabIndex'],
                    providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode }],
                    host: {
                        'class': 'mat-tree-node',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.CdkTree }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; } });
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 * Captures the node's template and a when predicate that describes when this node should be used.
 */
class MatTreeNodeDef extends CdkTreeNodeDef {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodeDef, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatTreeNodeDef, selector: "[matTreeNodeDef]", inputs: { when: ["matTreeNodeDefWhen", "when"], data: ["matTreeNode", "data"] }, providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef }], usesInheritance: true, ngImport: i0 }); }
}
export { MatTreeNodeDef };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodeDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeDef]',
                    inputs: ['when: matTreeNodeDefWhen'],
                    providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef }],
                }]
        }], propDecorators: { data: [{
                type: Input,
                args: ['matTreeNode']
            }] } });
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
class MatNestedTreeNode extends CdkNestedTreeNode {
    /** Whether the node is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /** Tabindex for the node. */
    get tabIndex() {
        return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value) {
        // If the specified tabIndex value is null or undefined, fall back to the default value.
        this._tabIndex = value != null ? value : 0;
    }
    constructor(elementRef, tree, differs, tabIndex) {
        super(elementRef, tree, differs);
        this._disabled = false;
        this.tabIndex = Number(tabIndex) || 0;
    }
    // This is a workaround for https://github.com/angular/angular/issues/19145
    // In aot mode, the lifecycle hooks from parent class are not called.
    // TODO(tinayuangao): Remove when the angular issue #19145 is fixed
    ngOnInit() {
        super.ngOnInit();
    }
    ngAfterContentInit() {
        super.ngAfterContentInit();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatNestedTreeNode, deps: [{ token: i0.ElementRef }, { token: i1.CdkTree }, { token: i0.IterableDiffers }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatNestedTreeNode, selector: "mat-nested-tree-node", inputs: { role: "role", disabled: "disabled", tabIndex: "tabIndex", node: ["matNestedTreeNode", "node"] }, host: { classAttribute: "mat-nested-tree-node" }, providers: [
            { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode },
            { provide: CdkTreeNode, useExisting: MatNestedTreeNode },
            { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode },
        ], exportAs: ["matNestedTreeNode"], usesInheritance: true, ngImport: i0 }); }
}
export { MatNestedTreeNode };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatNestedTreeNode, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-nested-tree-node',
                    exportAs: 'matNestedTreeNode',
                    inputs: ['role', 'disabled', 'tabIndex'],
                    providers: [
                        { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode },
                        { provide: CdkTreeNode, useExisting: MatNestedTreeNode },
                        { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode },
                    ],
                    host: {
                        'class': 'mat-nested-tree-node',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.CdkTree }, { type: i0.IterableDiffers }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; }, propDecorators: { node: [{
                type: Input,
                args: ['matNestedTreeNode']
            }], disabled: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFdBQVcsRUFDWCxjQUFjLEdBQ2YsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBRUwsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGVBQWUsR0FHaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUEwQixhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDN0YsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUUxRSxNQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUVuRTs7R0FFRztBQUNILE1BU2EsV0FDWCxTQUFRLGdCQUFzQjtJQUc5QixZQUNFLFVBQW1DLEVBQ25DLElBQW1CLEVBQ0ksUUFBZ0I7UUFFdkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELDJFQUEyRTtJQUMzRSxxRUFBcUU7SUFDNUQsUUFBUTtRQUNmLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRVEsV0FBVztRQUNsQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs4R0FyQlUsV0FBVyxtRUFPVCxVQUFVO2tHQVBaLFdBQVcseUpBTFgsQ0FBQyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDOztTQUtsRCxX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QUUsVUFBVSxFQUFFLFVBQVUsQ0FBQztvQkFDeEMsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsbUJBQW1CLEVBQUM7d0JBQzVELEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLG1CQUFtQixFQUFDO3dCQUN0RCxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLG1CQUFtQixFQUFDO3FCQUNyRTtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLHNCQUFzQjtxQkFDaEM7aUJBQ0Y7OzBCQWdDSSxTQUFTOzJCQUFDLFVBQVU7NENBM0JLLElBQUk7c0JBQS9CLEtBQUs7dUJBQUMsbUJBQW1CO2dCQUl0QixRQUFRO3NCQURYLEtBQUs7Z0JBV0YsUUFBUTtzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENES19UUkVFX05PREVfT1VUTEVUX05PREUsXG4gIENka05lc3RlZFRyZWVOb2RlLFxuICBDZGtUcmVlLFxuICBDZGtUcmVlTm9kZSxcbiAgQ2RrVHJlZU5vZGVEZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIEhhc1RhYkluZGV4LCBtaXhpbkRpc2FibGVkLCBtaXhpblRhYkluZGV4fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IF9NYXRUcmVlTm9kZUJhc2UgPSBtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZWQoQ2RrVHJlZU5vZGUpKTtcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBub2RlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRyZWUtbm9kZScsXG4gIGV4cG9ydEFzOiAnbWF0VHJlZU5vZGUnLFxuICBpbnB1dHM6IFsncm9sZScsICdkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZX1dLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10cmVlLW5vZGUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZTxULCBLID0gVD5cbiAgZXh0ZW5kcyBfTWF0VHJlZU5vZGVCYXNlPFQsIEs+XG4gIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgsIE9uSW5pdCwgT25EZXN0cm95XG57XG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHRyZWU6IENka1RyZWU8VCwgSz4sXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCB0cmVlKTtcbiAgICB0aGlzLnRhYkluZGV4ID0gTnVtYmVyKHRhYkluZGV4KSB8fCAwO1xuICB9XG5cbiAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIzMDkxXG4gIC8vIEluIGFvdCBtb2RlLCB0aGUgbGlmZWN5Y2xlIGhvb2tzIGZyb20gcGFyZW50IGNsYXNzIGFyZSBub3QgY2FsbGVkLlxuICBvdmVycmlkZSBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgZGVmaW5pdGlvbiB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKiBDYXB0dXJlcyB0aGUgbm9kZSdzIHRlbXBsYXRlIGFuZCBhIHdoZW4gcHJlZGljYXRlIHRoYXQgZGVzY3JpYmVzIHdoZW4gdGhpcyBub2RlIHNob3VsZCBiZSB1c2VkLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVEZWZdJyxcbiAgaW5wdXRzOiBbJ3doZW46IG1hdFRyZWVOb2RlRGVmV2hlbiddLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGVEZWYsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZURlZn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZURlZjxUPiBleHRlbmRzIENka1RyZWVOb2RlRGVmPFQ+IHtcbiAgQElucHV0KCdtYXRUcmVlTm9kZScpIGRhdGE6IFQ7XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbmVzdGVkIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtbmVzdGVkLXRyZWUtbm9kZScsXG4gIGV4cG9ydEFzOiAnbWF0TmVzdGVkVHJlZU5vZGUnLFxuICBpbnB1dHM6IFsncm9sZScsICdkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrTmVzdGVkVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gICAge3Byb3ZpZGU6IENka1RyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9LFxuICAgIHtwcm92aWRlOiBDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1uZXN0ZWQtdHJlZS1ub2RlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TmVzdGVkVHJlZU5vZGU8VCwgSyA9IFQ+XG4gIGV4dGVuZHMgQ2RrTmVzdGVkVHJlZU5vZGU8VCwgSz5cbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdFxue1xuICBASW5wdXQoJ21hdE5lc3RlZFRyZWVOb2RlJykgbm9kZTogVDtcblxuICAvKiogV2hldGhlciB0aGUgbm9kZSBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIG5vZGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0YWJJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkID8gLTEgOiB0aGlzLl90YWJJbmRleDtcbiAgfVxuICBzZXQgdGFiSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIC8vIElmIHRoZSBzcGVjaWZpZWQgdGFiSW5kZXggdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQsIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgICB0aGlzLl90YWJJbmRleCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgcHJpdmF0ZSBfdGFiSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB0cmVlOiBDZGtUcmVlPFQsIEs+LFxuICAgIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHRyZWUsIGRpZmZlcnMpO1xuICAgIHRoaXMudGFiSW5kZXggPSBOdW1iZXIodGFiSW5kZXgpIHx8IDA7XG4gIH1cblxuICAvLyBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTkxNDVcbiAgLy8gSW4gYW90IG1vZGUsIHRoZSBsaWZlY3ljbGUgaG9va3MgZnJvbSBwYXJlbnQgY2xhc3MgYXJlIG5vdCBjYWxsZWQuXG4gIC8vIFRPRE8odGluYXl1YW5nYW8pOiBSZW1vdmUgd2hlbiB0aGUgYW5ndWxhciBpc3N1ZSAjMTkxNDUgaXMgZml4ZWRcbiAgb3ZlcnJpZGUgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==