/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatCommonModule } from '@angular/material/core';
import { MatNestedTreeNode, MatTreeNodeDef, MatTreeNode } from './node';
import { MatTree } from './tree';
import { MatTreeNodeToggle } from './toggle';
import { MatTreeNodeOutlet } from './outlet';
import { MatTreeNodePadding } from './padding';
import * as i0 from "@angular/core";
const MAT_TREE_DIRECTIVES = [
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatTree,
    MatTreeNode,
    MatTreeNodeOutlet,
];
class MatTreeModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatTreeModule, declarations: [MatNestedTreeNode,
            MatTreeNodeDef,
            MatTreeNodePadding,
            MatTreeNodeToggle,
            MatTree,
            MatTreeNode,
            MatTreeNodeOutlet], imports: [CdkTreeModule, MatCommonModule], exports: [MatCommonModule, MatNestedTreeNode,
            MatTreeNodeDef,
            MatTreeNodePadding,
            MatTreeNodeToggle,
            MatTree,
            MatTreeNode,
            MatTreeNodeOutlet] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeModule, imports: [CdkTreeModule, MatCommonModule, MatCommonModule] }); }
}
export { MatTreeModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CdkTreeModule, MatCommonModule],
                    exports: [MatCommonModule, MAT_TREE_DIRECTIVES],
                    declarations: MAT_TREE_DIRECTIVES,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdHJlZS90cmVlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDdEUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7QUFFN0MsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixpQkFBaUI7SUFDakIsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsT0FBTztJQUNQLFdBQVc7SUFDWCxpQkFBaUI7Q0FDbEIsQ0FBQztBQUVGLE1BS2EsYUFBYTs4R0FBYixhQUFhOytHQUFiLGFBQWEsaUJBZHhCLGlCQUFpQjtZQUNqQixjQUFjO1lBQ2Qsa0JBQWtCO1lBQ2xCLGlCQUFpQjtZQUNqQixPQUFPO1lBQ1AsV0FBVztZQUNYLGlCQUFpQixhQUlQLGFBQWEsRUFBRSxlQUFlLGFBQzlCLGVBQWUsRUFYekIsaUJBQWlCO1lBQ2pCLGNBQWM7WUFDZCxrQkFBa0I7WUFDbEIsaUJBQWlCO1lBQ2pCLE9BQU87WUFDUCxXQUFXO1lBQ1gsaUJBQWlCOytHQVFOLGFBQWEsWUFKZCxhQUFhLEVBQUUsZUFBZSxFQUM5QixlQUFlOztTQUdkLGFBQWE7MkZBQWIsYUFBYTtrQkFMekIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDO29CQUN6QyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLENBQUM7b0JBQy9DLFlBQVksRUFBRSxtQkFBbUI7aUJBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Nka1RyZWVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0TmVzdGVkVHJlZU5vZGUsIE1hdFRyZWVOb2RlRGVmLCBNYXRUcmVlTm9kZX0gZnJvbSAnLi9ub2RlJztcbmltcG9ydCB7TWF0VHJlZX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7TWF0VHJlZU5vZGVUb2dnbGV9IGZyb20gJy4vdG9nZ2xlJztcbmltcG9ydCB7TWF0VHJlZU5vZGVPdXRsZXR9IGZyb20gJy4vb3V0bGV0JztcbmltcG9ydCB7TWF0VHJlZU5vZGVQYWRkaW5nfSBmcm9tICcuL3BhZGRpbmcnO1xuXG5jb25zdCBNQVRfVFJFRV9ESVJFQ1RJVkVTID0gW1xuICBNYXROZXN0ZWRUcmVlTm9kZSxcbiAgTWF0VHJlZU5vZGVEZWYsXG4gIE1hdFRyZWVOb2RlUGFkZGluZyxcbiAgTWF0VHJlZU5vZGVUb2dnbGUsXG4gIE1hdFRyZWUsXG4gIE1hdFRyZWVOb2RlLFxuICBNYXRUcmVlTm9kZU91dGxldCxcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDZGtUcmVlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBNQVRfVFJFRV9ESVJFQ1RJVkVTXSxcbiAgZGVjbGFyYXRpb25zOiBNQVRfVFJFRV9ESVJFQ1RJVkVTLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTW9kdWxlIHt9XG4iXX0=