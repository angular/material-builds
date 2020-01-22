/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tree/tree-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @type {?} */
const MAT_TREE_DIRECTIVES = [
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatTree,
    MatTreeNode,
    MatTreeNodeOutlet
];
export class MatTreeModule {
}
MatTreeModule.decorators = [
    { type: NgModule, args: [{
                imports: [CdkTreeModule, MatCommonModule],
                exports: MAT_TREE_DIRECTIVES,
                declarations: MAT_TREE_DIRECTIVES,
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdHJlZS90cmVlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDdEUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7TUFFdkMsbUJBQW1CLEdBQUc7SUFDMUIsaUJBQWlCO0lBQ2pCLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLE9BQU87SUFDUCxXQUFXO0lBQ1gsaUJBQWlCO0NBQ2xCO0FBT0QsTUFBTSxPQUFPLGFBQWE7OztZQUx6QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQztnQkFDekMsT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsWUFBWSxFQUFFLG1CQUFtQjthQUNsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDZGtUcmVlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdE5lc3RlZFRyZWVOb2RlLCBNYXRUcmVlTm9kZURlZiwgTWF0VHJlZU5vZGV9IGZyb20gJy4vbm9kZSc7XG5pbXBvcnQge01hdFRyZWV9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge01hdFRyZWVOb2RlVG9nZ2xlfSBmcm9tICcuL3RvZ2dsZSc7XG5pbXBvcnQge01hdFRyZWVOb2RlT3V0bGV0fSBmcm9tICcuL291dGxldCc7XG5pbXBvcnQge01hdFRyZWVOb2RlUGFkZGluZ30gZnJvbSAnLi9wYWRkaW5nJztcblxuY29uc3QgTUFUX1RSRUVfRElSRUNUSVZFUyA9IFtcbiAgTWF0TmVzdGVkVHJlZU5vZGUsXG4gIE1hdFRyZWVOb2RlRGVmLFxuICBNYXRUcmVlTm9kZVBhZGRpbmcsXG4gIE1hdFRyZWVOb2RlVG9nZ2xlLFxuICBNYXRUcmVlLFxuICBNYXRUcmVlTm9kZSxcbiAgTWF0VHJlZU5vZGVPdXRsZXRcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDZGtUcmVlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBNQVRfVFJFRV9ESVJFQ1RJVkVTLFxuICBkZWNsYXJhdGlvbnM6IE1BVF9UUkVFX0RJUkVDVElWRVMsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVNb2R1bGUge31cbiJdfQ==