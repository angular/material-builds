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
var MAT_TREE_DIRECTIVES = [
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatTree,
    MatTreeNode,
    MatTreeNodeOutlet
];
var MatTreeModule = /** @class */ (function () {
    function MatTreeModule() {
    }
    MatTreeModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CdkTreeModule, MatCommonModule],
                    exports: MAT_TREE_DIRECTIVES,
                    declarations: MAT_TREE_DIRECTIVES,
                },] }
    ];
    return MatTreeModule;
}());
export { MatTreeModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdHJlZS90cmVlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDdEUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUU3QyxJQUFNLG1CQUFtQixHQUFHO0lBQzFCLGlCQUFpQjtJQUNqQixjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsV0FBVztJQUNYLGlCQUFpQjtDQUNsQixDQUFDO0FBRUY7SUFBQTtJQUs0QixDQUFDOztnQkFMNUIsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUM7b0JBQ3pDLE9BQU8sRUFBRSxtQkFBbUI7b0JBQzVCLFlBQVksRUFBRSxtQkFBbUI7aUJBQ2xDOztJQUMyQixvQkFBQztDQUFBLEFBTDdCLElBSzZCO1NBQWhCLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Q2RrVHJlZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXROZXN0ZWRUcmVlTm9kZSwgTWF0VHJlZU5vZGVEZWYsIE1hdFRyZWVOb2RlfSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IHtNYXRUcmVlfSBmcm9tICcuL3RyZWUnO1xuaW1wb3J0IHtNYXRUcmVlTm9kZVRvZ2dsZX0gZnJvbSAnLi90b2dnbGUnO1xuaW1wb3J0IHtNYXRUcmVlTm9kZU91dGxldH0gZnJvbSAnLi9vdXRsZXQnO1xuaW1wb3J0IHtNYXRUcmVlTm9kZVBhZGRpbmd9IGZyb20gJy4vcGFkZGluZyc7XG5cbmNvbnN0IE1BVF9UUkVFX0RJUkVDVElWRVMgPSBbXG4gIE1hdE5lc3RlZFRyZWVOb2RlLFxuICBNYXRUcmVlTm9kZURlZixcbiAgTWF0VHJlZU5vZGVQYWRkaW5nLFxuICBNYXRUcmVlTm9kZVRvZ2dsZSxcbiAgTWF0VHJlZSxcbiAgTWF0VHJlZU5vZGUsXG4gIE1hdFRyZWVOb2RlT3V0bGV0XG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ2RrVHJlZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogTUFUX1RSRUVfRElSRUNUSVZFUyxcbiAgZGVjbGFyYXRpb25zOiBNQVRfVFJFRV9ESVJFQ1RJVkVTLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTW9kdWxlIHt9XG4iXX0=