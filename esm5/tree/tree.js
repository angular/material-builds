/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { CdkTree } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTreeNodeOutlet } from './outlet';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
var MatTree = /** @class */ (function (_super) {
    __extends(MatTree, _super);
    function MatTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatTree.decorators = [
        { type: Component, args: [{
                    selector: 'mat-tree',
                    exportAs: 'matTree',
                    template: "<ng-container matTreeNodeOutlet></ng-container>",
                    host: {
                        'class': 'mat-tree',
                        'role': 'tree',
                    },
                    encapsulation: ViewEncapsulation.None,
                    // See note on CdkTree for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    providers: [{ provide: CdkTree, useExisting: MatTree }],
                    styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;min-height:48px;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"]
                }] }
    ];
    MatTree.propDecorators = {
        _nodeOutlet: [{ type: ViewChild, args: [MatTreeNodeOutlet, { static: true },] }]
    };
    return MatTree;
}(CdkTree));
export { MatTree };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFM0M7O0dBRUc7QUFDSDtJQWVnQywyQkFBVTtJQWYxQzs7SUFrQkEsQ0FBQzs7Z0JBbEJBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFFBQVEsRUFBRSxpREFBaUQ7b0JBQzNELElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsVUFBVTt3QkFDbkIsTUFBTSxFQUFFLE1BQU07cUJBQ2Y7b0JBRUQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLDhGQUE4RjtvQkFDOUYsK0NBQStDO29CQUMvQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTztvQkFDaEQsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUMsQ0FBQzs7aUJBQ3REOzs7OEJBR0UsU0FBUyxTQUFDLGlCQUFpQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs7SUFDOUMsY0FBQztDQUFBLEFBbEJELENBZWdDLE9BQU8sR0FHdEM7U0FIWSxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrVHJlZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0VHJlZU5vZGVPdXRsZXR9IGZyb20gJy4vb3V0bGV0JztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVGFibGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdHJlZScsXG4gIGV4cG9ydEFzOiAnbWF0VHJlZScsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciBtYXRUcmVlTm9kZU91dGxldD48L25nLWNvbnRhaW5lcj5gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10cmVlJyxcbiAgICAncm9sZSc6ICd0cmVlJyxcbiAgfSxcbiAgc3R5bGVVcmxzOiBbJ3RyZWUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RyZWUgZm9yIGV4cGxhbmF0aW9uIG9uIHdoeSB0aGlzIHVzZXMgdGhlIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWV9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlPFQ+IGV4dGVuZHMgQ2RrVHJlZTxUPiB7XG4gIC8vIE91dGxldHMgd2l0aGluIHRoZSB0cmVlJ3MgdGVtcGxhdGUgd2hlcmUgdGhlIGRhdGFOb2RlcyB3aWxsIGJlIGluc2VydGVkLlxuICBAVmlld0NoaWxkKE1hdFRyZWVOb2RlT3V0bGV0LCB7c3RhdGljOiB0cnVlfSkgX25vZGVPdXRsZXQ6IE1hdFRyZWVOb2RlT3V0bGV0O1xufVxuIl19