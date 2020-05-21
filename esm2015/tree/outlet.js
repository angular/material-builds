import { __decorate, __metadata, __param } from "tslib";
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
    var MatTreeNodeOutlet_1;
    let MatTreeNodeOutlet = MatTreeNodeOutlet_1 = class MatTreeNodeOutlet {
        constructor(viewContainer, _node) {
            this.viewContainer = viewContainer;
            this._node = _node;
        }
    };
    MatTreeNodeOutlet = MatTreeNodeOutlet_1 = __decorate([
        Directive({
            selector: '[matTreeNodeOutlet]',
            providers: [{
                    provide: CdkTreeNodeOutlet,
                    useExisting: MatTreeNodeOutlet_1
                }]
        }),
        __param(1, Inject(CDK_TREE_NODE_OUTLET_NODE)), __param(1, Optional()),
        __metadata("design:paramtypes", [ViewContainerRef, Object])
    ], MatTreeNodeOutlet);
    return MatTreeNodeOutlet;
})();
export { MatTreeNodeOutlet };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvRSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBRXZCOzs7R0FHRztBQVFIOztJQUFBLElBQWEsaUJBQWlCLHlCQUE5QixNQUFhLGlCQUFpQjtRQUM1QixZQUNXLGFBQStCLEVBQ2dCLEtBQVc7WUFEMUQsa0JBQWEsR0FBYixhQUFhLENBQWtCO1lBQ2dCLFVBQUssR0FBTCxLQUFLLENBQU07UUFBRyxDQUFDO0tBQzFFLENBQUE7SUFKWSxpQkFBaUI7UUFQN0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixTQUFTLEVBQUUsQ0FBQztvQkFDVixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixXQUFXLEVBQUUsbUJBQWlCO2lCQUMvQixDQUFDO1NBQ0gsQ0FBQztRQUlLLFdBQUEsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUEsRUFBRSxXQUFBLFFBQVEsRUFBRSxDQUFBO3lDQUR4QixnQkFBZ0I7T0FGL0IsaUJBQWlCLENBSTdCO0lBQUQsd0JBQUM7S0FBQTtTQUpZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFLCBDZGtUcmVlTm9kZU91dGxldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBPdXRsZXQgZm9yIG5lc3RlZCBDZGtOb2RlLiBQdXQgYFttYXRUcmVlTm9kZU91dGxldF1gIG9uIGEgdGFnIHRvIHBsYWNlIGNoaWxkcmVuIGRhdGFOb2Rlc1xuICogaW5zaWRlIHRoZSBvdXRsZXQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZU91dGxldF0nLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogQ2RrVHJlZU5vZGVPdXRsZXQsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlT3V0bGV0XG4gIH1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlT3V0bGV0IGltcGxlbWVudHMgQ2RrVHJlZU5vZGVPdXRsZXQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyB2aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgQEluamVjdChDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFKSBAT3B0aW9uYWwoKSBwdWJsaWMgX25vZGU/OiBhbnkpIHt9XG59XG4iXX0=