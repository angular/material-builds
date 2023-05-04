/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet } from '@angular/cdk/tree';
import { Directive, Inject, Optional, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
class MatTreeNodeOutlet {
    constructor(viewContainer, _node) {
        this.viewContainer = viewContainer;
        this._node = _node;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodeOutlet, deps: [{ token: i0.ViewContainerRef }, { token: CDK_TREE_NODE_OUTLET_NODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatTreeNodeOutlet, selector: "[matTreeNodeOutlet]", providers: [
            {
                provide: CdkTreeNodeOutlet,
                useExisting: MatTreeNodeOutlet,
            },
        ], ngImport: i0 }); }
}
export { MatTreeNodeOutlet };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodeOutlet, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeOutlet]',
                    providers: [
                        {
                            provide: CdkTreeNodeOutlet,
                            useExisting: MatTreeNodeOutlet,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_TREE_NODE_OUTLET_NODE]
                }, {
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9FLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFNUU7OztHQUdHO0FBQ0gsTUFTYSxpQkFBaUI7SUFDNUIsWUFDUyxhQUErQixFQUNnQixLQUFXO1FBRDFELGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUNnQixVQUFLLEdBQUwsS0FBSyxDQUFNO0lBQ2hFLENBQUM7OEdBSk8saUJBQWlCLGtEQUdsQix5QkFBeUI7a0dBSHhCLGlCQUFpQiw4Q0FQakI7WUFDVDtnQkFDRSxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUsaUJBQWlCO2FBQy9CO1NBQ0Y7O1NBRVUsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBVDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsbUJBQW1CO3lCQUMvQjtxQkFDRjtpQkFDRjs7MEJBSUksTUFBTTsyQkFBQyx5QkFBeUI7OzBCQUFHLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Q0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSwgQ2RrVHJlZU5vZGVPdXRsZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7RGlyZWN0aXZlLCBJbmplY3QsIE9wdGlvbmFsLCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBPdXRsZXQgZm9yIG5lc3RlZCBDZGtOb2RlLiBQdXQgYFttYXRUcmVlTm9kZU91dGxldF1gIG9uIGEgdGFnIHRvIHBsYWNlIGNoaWxkcmVuIGRhdGFOb2Rlc1xuICogaW5zaWRlIHRoZSBvdXRsZXQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZU91dGxldF0nLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBDZGtUcmVlTm9kZU91dGxldCxcbiAgICAgIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZU91dGxldCxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZU91dGxldCBpbXBsZW1lbnRzIENka1RyZWVOb2RlT3V0bGV0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFKSBAT3B0aW9uYWwoKSBwdWJsaWMgX25vZGU/OiBhbnksXG4gICkge31cbn1cbiJdfQ==