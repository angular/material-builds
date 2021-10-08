/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet } from '@angular/cdk/tree';
import { Directive, Inject, Optional, ViewContainerRef, } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
export class MatTreeNodeOutlet {
    constructor(viewContainer, _node) {
        this.viewContainer = viewContainer;
        this._node = _node;
    }
}
MatTreeNodeOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTreeNodeOutlet, deps: [{ token: i0.ViewContainerRef }, { token: CDK_TREE_NODE_OUTLET_NODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodeOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatTreeNodeOutlet, selector: "[matTreeNodeOutlet]", providers: [{
            provide: CdkTreeNodeOutlet,
            useExisting: MatTreeNodeOutlet
        }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTreeNodeOutlet, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeOutlet]',
                    providers: [{
                            provide: CdkTreeNodeOutlet,
                            useExisting: MatTreeNodeOutlet
                        }]
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_TREE_NODE_OUTLET_NODE]
                }, {
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9FLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFFBQVEsRUFDUixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7O0FBRXZCOzs7R0FHRztBQVFILE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFDVyxhQUErQixFQUNnQixLQUFXO1FBRDFELGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUNnQixVQUFLLEdBQUwsS0FBSyxDQUFNO0lBQUcsQ0FBQzs7c0hBSDlELGlCQUFpQixrREFHaEIseUJBQXlCOzBHQUgxQixpQkFBaUIsOENBTGpCLENBQUM7WUFDVixPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQzttR0FFUyxpQkFBaUI7a0JBUDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsU0FBUyxFQUFFLENBQUM7NEJBQ1YsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsV0FBVyxtQkFBbUI7eUJBQy9CLENBQUM7aUJBQ0g7OzBCQUlNLE1BQU07MkJBQUMseUJBQXlCOzswQkFBRyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0NES19UUkVFX05PREVfT1VUTEVUX05PREUsIENka1RyZWVOb2RlT3V0bGV0fSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIE91dGxldCBmb3IgbmVzdGVkIENka05vZGUuIFB1dCBgW21hdFRyZWVOb2RlT3V0bGV0XWAgb24gYSB0YWcgdG8gcGxhY2UgY2hpbGRyZW4gZGF0YU5vZGVzXG4gKiBpbnNpZGUgdGhlIG91dGxldC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlT3V0bGV0XScsXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBDZGtUcmVlTm9kZU91dGxldCxcbiAgICB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGVPdXRsZXRcbiAgfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVPdXRsZXQgaW1wbGVtZW50cyBDZGtUcmVlTm9kZU91dGxldCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICBASW5qZWN0KENES19UUkVFX05PREVfT1VUTEVUX05PREUpIEBPcHRpb25hbCgpIHB1YmxpYyBfbm9kZT86IGFueSkge31cbn1cbiJdfQ==