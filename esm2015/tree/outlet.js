/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet } from '@angular/cdk/tree';
import { Directive, Inject, Optional, ViewContainerRef, } from '@angular/core';
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
let MatTreeNodeOutlet = /** @class */ (() => {
    class MatTreeNodeOutlet {
        constructor(viewContainer, _node) {
            this.viewContainer = viewContainer;
            this._node = _node;
        }
    }
    MatTreeNodeOutlet.decorators = [
        { type: Directive, args: [{
                    selector: '[matTreeNodeOutlet]',
                    providers: [{
                            provide: CdkTreeNodeOutlet,
                            useExisting: MatTreeNodeOutlet
                        }]
                },] }
    ];
    /** @nocollapse */
    MatTreeNodeOutlet.ctorParameters = () => [
        { type: ViewContainerRef },
        { type: undefined, decorators: [{ type: Inject, args: [CDK_TREE_NODE_OUTLET_NODE,] }, { type: Optional }] }
    ];
    return MatTreeNodeOutlet;
})();
export { MatTreeNodeOutlet };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9FLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFFBQVEsRUFDUixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFFdkI7OztHQUdHO0FBQ0g7SUFBQSxNQU9hLGlCQUFpQjtRQUM1QixZQUNXLGFBQStCLEVBQ2dCLEtBQVc7WUFEMUQsa0JBQWEsR0FBYixhQUFhLENBQWtCO1lBQ2dCLFVBQUssR0FBTCxLQUFLLENBQU07UUFBRyxDQUFDOzs7Z0JBVjFFLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixTQUFTLEVBQUUsQ0FBQzs0QkFDVixPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsaUJBQWlCO3lCQUMvQixDQUFDO2lCQUNIOzs7O2dCQWJDLGdCQUFnQjtnREFpQlgsTUFBTSxTQUFDLHlCQUF5QixjQUFHLFFBQVE7O0lBQ2xELHdCQUFDO0tBQUE7U0FKWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Q0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSwgQ2RrVHJlZU5vZGVPdXRsZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogT3V0bGV0IGZvciBuZXN0ZWQgQ2RrTm9kZS4gUHV0IGBbbWF0VHJlZU5vZGVPdXRsZXRdYCBvbiBhIHRhZyB0byBwbGFjZSBjaGlsZHJlbiBkYXRhTm9kZXNcbiAqIGluc2lkZSB0aGUgb3V0bGV0LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVPdXRsZXRdJyxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IENka1RyZWVOb2RlT3V0bGV0LFxuICAgIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZU91dGxldFxuICB9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZU91dGxldCBpbXBsZW1lbnRzIENka1RyZWVOb2RlT3V0bGV0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgIEBJbmplY3QoQ0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSkgQE9wdGlvbmFsKCkgcHVibGljIF9ub2RlPzogYW55KSB7fVxufVxuIl19