/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { CDK_TREE_NODE_OUTLET_NODE, CdkNestedTreeNode, CdkTree, CdkTreeNode, CdkTreeNodeDef, } from '@angular/cdk/tree';
import { Attribute, Directive, ElementRef, Input, IterableDiffers, } from '@angular/core';
import { mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
var _MatTreeNodeMixinBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
var MatTreeNode = /** @class */ (function (_super) {
    tslib_1.__extends(MatTreeNode, _super);
    function MatTreeNode(_elementRef, _tree, tabIndex) {
        var _this = _super.call(this, _elementRef, _tree) || this;
        _this._elementRef = _elementRef;
        _this._tree = _tree;
        _this.role = 'treeitem';
        _this.tabIndex = Number(tabIndex) || 0;
        return _this;
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
    MatTreeNode.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CdkTree },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
    ]; };
    MatTreeNode.propDecorators = {
        role: [{ type: Input }]
    };
    return MatTreeNode;
}(_MatTreeNodeMixinBase));
export { MatTreeNode };
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
var MatTreeNodeDef = /** @class */ (function (_super) {
    tslib_1.__extends(MatTreeNodeDef, _super);
    function MatTreeNodeDef() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(CdkTreeNodeDef));
export { MatTreeNodeDef };
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
var MatNestedTreeNode = /** @class */ (function (_super) {
    tslib_1.__extends(MatNestedTreeNode, _super);
    function MatNestedTreeNode(_elementRef, _tree, _differs, tabIndex) {
        var _this = _super.call(this, _elementRef, _tree, _differs) || this;
        _this._elementRef = _elementRef;
        _this._tree = _tree;
        _this._differs = _differs;
        _this._disabled = false;
        _this.tabIndex = Number(tabIndex) || 0;
        return _this;
    }
    Object.defineProperty(MatNestedTreeNode.prototype, "disabled", {
        /** Whether the node is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatNestedTreeNode.prototype, "tabIndex", {
        /** Tabindex for the node. */
        get: function () { return this.disabled ? -1 : this._tabIndex; },
        set: function (value) {
            // If the specified tabIndex value is null or undefined, fall back to the default value.
            this._tabIndex = value != null ? value : 0;
        },
        enumerable: true,
        configurable: true
    });
    // This is a workaround for https://github.com/angular/angular/issues/23091
    // In aot mode, the lifecycle hooks from parent class are not called.
    // TODO(tinayuangao): Remove when the angular issue #23091 is fixed
    MatNestedTreeNode.prototype.ngAfterContentInit = function () {
        _super.prototype.ngAfterContentInit.call(this);
    };
    MatNestedTreeNode.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
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
    MatNestedTreeNode.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CdkTree },
        { type: IterableDiffers },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
    ]; };
    MatNestedTreeNode.propDecorators = {
        node: [{ type: Input, args: ['matNestedTreeNode',] }],
        disabled: [{ type: Input }],
        tabIndex: [{ type: Input }]
    };
    return MatNestedTreeNode;
}(CdkNestedTreeNode));
export { MatNestedTreeNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsaUJBQWlCLEVBQ2pCLE9BQU8sRUFDUCxXQUFXLEVBQ1gsY0FBYyxHQUNmLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUVMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxlQUFlLEdBRWhCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCxhQUFhLEVBQ2IsYUFBYSxHQUNkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFNUQsSUFBTSxxQkFBcUIsR0FDdkIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTlDOztHQUVHO0FBQ0g7SUFZb0MsdUNBQXdCO0lBSTFELHFCQUFzQixXQUFvQyxFQUNwQyxLQUFpQixFQUNKLFFBQWdCO1FBRm5ELFlBR0Usa0JBQU0sV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUcxQjtRQU5xQixpQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsV0FBSyxHQUFMLEtBQUssQ0FBWTtRQUg5QixVQUFJLEdBQXlCLFVBQVUsQ0FBQztRQU8vQyxLQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBQ3hDLENBQUM7O2dCQXRCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSxhQUFhO29CQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO29CQUNoQyxJQUFJLEVBQUU7d0JBQ0osc0JBQXNCLEVBQUUsWUFBWTt3QkFDcEMsbUJBQW1CLEVBQUUsb0NBQW9DO3dCQUN6RCxhQUFhLEVBQUUsTUFBTTt3QkFDckIsT0FBTyxFQUFFLGVBQWU7cUJBQ3pCO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7aUJBQzlEOzs7O2dCQWhDQyxVQUFVO2dCQVJWLE9BQU87NkNBK0NNLFNBQVMsU0FBQyxVQUFVOzs7dUJBSmhDLEtBQUs7O0lBU1Isa0JBQUM7Q0FBQSxBQXZCRCxDQVlvQyxxQkFBcUIsR0FXeEQ7U0FYWSxXQUFXO0FBYXhCOztHQUVHO0FBQ0g7SUFPdUMsMENBQWlCO0lBUHhEOztJQVNBLENBQUM7O2dCQVRBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixNQUFNLEVBQUU7d0JBQ04sMEJBQTBCO3FCQUMzQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQyxDQUFDO2lCQUNwRTs7O3VCQUVFLEtBQUssU0FBQyxhQUFhOztJQUN0QixxQkFBQztDQUFBLEFBVEQsQ0FPdUMsY0FBYyxHQUVwRDtTQUZZLGNBQWM7QUFJM0I7O0dBRUc7QUFDSDtJQWMwQyw2Q0FBb0I7SUFtQjVELDJCQUFzQixXQUFvQyxFQUNwQyxLQUFpQixFQUNqQixRQUF5QixFQUNaLFFBQWdCO1FBSG5ELFlBSUUsa0JBQU0sV0FBVyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FFcEM7UUFOcUIsaUJBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFdBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsY0FBUSxHQUFSLFFBQVEsQ0FBaUI7UUFidkMsZUFBUyxHQUFHLEtBQUssQ0FBQztRQWdCeEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUN4QyxDQUFDO0lBcEJELHNCQUNJLHVDQUFRO1FBRlosb0NBQW9DO2FBQ3BDLGNBQ2lCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDekMsVUFBYSxLQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQURsQztJQUt6QyxzQkFDSSx1Q0FBUTtRQUZaLDZCQUE2QjthQUM3QixjQUN5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUN0RSxVQUFhLEtBQWE7WUFDeEIsd0ZBQXdGO1lBQ3hGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQzs7O09BSnFFO0lBZXRFLDJFQUEyRTtJQUMzRSxxRUFBcUU7SUFDckUsbUVBQW1FO0lBQ25FLDhDQUFrQixHQUFsQjtRQUNFLGlCQUFNLGtCQUFrQixXQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELHVDQUFXLEdBQVg7UUFDRSxpQkFBTSxXQUFXLFdBQUUsQ0FBQztJQUN0QixDQUFDOztnQkFsREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLElBQUksRUFBRTt3QkFDSixzQkFBc0IsRUFBRSxZQUFZO3dCQUNwQyxhQUFhLEVBQUUsTUFBTTt3QkFDckIsT0FBTyxFQUFFLHNCQUFzQjtxQkFDaEM7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQzt3QkFDNUQsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQzt3QkFDdEQsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDO3FCQUNyRTtpQkFDRjs7OztnQkE1RUMsVUFBVTtnQkFSVixPQUFPO2dCQVVQLGVBQWU7NkNBaUdGLFNBQVMsU0FBQyxVQUFVOzs7dUJBcEJoQyxLQUFLLFNBQUMsbUJBQW1COzJCQUd6QixLQUFLOzJCQU1MLEtBQUs7O0lBMEJSLHdCQUFDO0NBQUEsQUFuREQsQ0FjMEMsaUJBQWlCLEdBcUMxRDtTQXJDWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSxcbiAgQ2RrTmVzdGVkVHJlZU5vZGUsXG4gIENka1RyZWUsXG4gIENka1RyZWVOb2RlLFxuICBDZGtUcmVlTm9kZURlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcblxuY29uc3QgX01hdFRyZWVOb2RlTWl4aW5CYXNlOiBIYXNUYWJJbmRleEN0b3IgJiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBDZGtUcmVlTm9kZSA9XG4gICAgbWl4aW5UYWJJbmRleChtaXhpbkRpc2FibGVkKENka1RyZWVOb2RlKSk7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbm9kZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC10cmVlLW5vZGUnLFxuICBleHBvcnRBczogJ21hdFRyZWVOb2RlJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ3RhYkluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnaXNFeHBhbmRlZCcsXG4gICAgJ1thdHRyLmFyaWEtbGV2ZWxdJzogJ3JvbGUgPT09IFwidHJlZWl0ZW1cIiA/IGxldmVsIDogbnVsbCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtdHJlZS1ub2RlJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZX1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlPFQ+IGV4dGVuZHMgX01hdFRyZWVOb2RlTWl4aW5CYXNlPFQ+XG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNUYWJJbmRleCB7XG4gIEBJbnB1dCgpIHJvbGU6ICd0cmVlaXRlbScgfCAnZ3JvdXAnID0gJ3RyZWVpdGVtJztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX3RyZWU6IENka1RyZWU8VD4sXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmLCBfdHJlZSk7XG5cbiAgICB0aGlzLnRhYkluZGV4ID0gTnVtYmVyKHRhYkluZGV4KSB8fCAwO1xuICB9XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbm9kZSBkZWZpbml0aW9uIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlRGVmXScsXG4gIGlucHV0czogW1xuICAgICd3aGVuOiBtYXRUcmVlTm9kZURlZldoZW4nXG4gIF0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZURlZiwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlRGVmfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVEZWY8VD4gZXh0ZW5kcyBDZGtUcmVlTm9kZURlZjxUPiB7XG4gIEBJbnB1dCgnbWF0VHJlZU5vZGUnKSBkYXRhOiBUO1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5lc3RlZCBub2RlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LW5lc3RlZC10cmVlLW5vZGUnLFxuICBleHBvcnRBczogJ21hdE5lc3RlZFRyZWVOb2RlJyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdpc0V4cGFuZGVkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ2NsYXNzJzogJ21hdC1uZXN0ZWQtdHJlZS1ub2RlJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IENka05lc3RlZFRyZWVOb2RlLCB1c2VFeGlzdGluZzogTWF0TmVzdGVkVHJlZU5vZGV9LFxuICAgIHtwcm92aWRlOiBDZGtUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfSxcbiAgICB7cHJvdmlkZTogQ0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdE5lc3RlZFRyZWVOb2RlPFQ+IGV4dGVuZHMgQ2RrTmVzdGVkVHJlZU5vZGU8VD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LFxuICBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ21hdE5lc3RlZFRyZWVOb2RlJykgbm9kZTogVDtcblxuICAvKiogV2hldGhlciB0aGUgbm9kZSBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFRhYmluZGV4IGZvciB0aGUgbm9kZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRhYkluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmRpc2FibGVkID8gLTEgOiB0aGlzLl90YWJJbmRleDsgfVxuICBzZXQgdGFiSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIC8vIElmIHRoZSBzcGVjaWZpZWQgdGFiSW5kZXggdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQsIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgICB0aGlzLl90YWJJbmRleCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgcHJpdmF0ZSBfdGFiSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX3RyZWU6IENka1RyZWU8VD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZiwgX3RyZWUsIF9kaWZmZXJzKTtcbiAgICB0aGlzLnRhYkluZGV4ID0gTnVtYmVyKHRhYkluZGV4KSB8fCAwO1xuICB9XG5cbiAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIzMDkxXG4gIC8vIEluIGFvdCBtb2RlLCB0aGUgbGlmZWN5Y2xlIGhvb2tzIGZyb20gcGFyZW50IGNsYXNzIGFyZSBub3QgY2FsbGVkLlxuICAvLyBUT0RPKHRpbmF5dWFuZ2FvKTogUmVtb3ZlIHdoZW4gdGhlIGFuZ3VsYXIgaXNzdWUgIzIzMDkxIGlzIGZpeGVkXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==