/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTree } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTreeNodeOutlet } from './outlet';
import * as i0 from "@angular/core";
import * as i1 from "./outlet";
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export class MatTree extends CdkTree {
}
MatTree.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatTree, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatTree.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-rc.3", type: MatTree, selector: "mat-tree", host: { attributes: { "role": "tree" }, classAttribute: "mat-tree cdk-tree" }, providers: [{ provide: CdkTree, useExisting: MatTree }], viewQueries: [{ propertyName: "_nodeOutlet", first: true, predicate: MatTreeNodeOutlet, descendants: true, static: true }], exportAs: ["matTree"], usesInheritance: true, ngImport: i0, template: `<ng-container matTreeNodeOutlet></ng-container>`, isInline: true, styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"], directives: [{ type: i1.MatTreeNodeOutlet, selector: "[matTreeNodeOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatTree, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tree', exportAs: 'matTree', template: `<ng-container matTreeNodeOutlet></ng-container>`, host: {
                        // The 'cdk-tree' class needs to be included here because classes set in the host in the
                        // parent class are not inherited with View Engine. The 'cdk-tree' class in CdkTreeNode has
                        // to be set in the host because:
                        // if it is set as a @HostBinding it is not set by the time the tree nodes try to read the
                        // class from it.
                        // the ElementRef is not available in the constructor so the class can't be applied directly
                        // without a breaking constructor change.
                        'class': 'mat-tree cdk-tree',
                        'role': 'tree',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, providers: [{ provide: CdkTree, useExisting: MatTree }], styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"] }]
        }], propDecorators: { _nodeOutlet: [{
                type: ViewChild,
                args: [MatTreeNodeOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9GLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7O0FBRTNDOztHQUVHO0FBdUJILE1BQU0sT0FBTyxPQUFrQixTQUFRLE9BQWE7O3lHQUF2QyxPQUFPOzZGQUFQLE9BQU8sa0hBRlAsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQyxDQUFDLHVFQUkxQyxpQkFBaUIsNEdBckJsQixpREFBaUQ7Z0dBbUJoRCxPQUFPO2tCQXRCbkIsU0FBUzsrQkFDRSxVQUFVLFlBQ1YsU0FBUyxZQUNULGlEQUFpRCxRQUNyRDt3QkFDSix3RkFBd0Y7d0JBQ3hGLDJGQUEyRjt3QkFDM0YsaUNBQWlDO3dCQUNqQywwRkFBMEY7d0JBQzFGLGlCQUFpQjt3QkFDakIsNEZBQTRGO3dCQUM1Rix5Q0FBeUM7d0JBQ3pDLE9BQU8sRUFBRSxtQkFBbUI7d0JBQzVCLE1BQU0sRUFBRSxNQUFNO3FCQUNmLGlCQUVjLGlCQUFpQixDQUFDLElBQUksbUJBR3BCLHVCQUF1QixDQUFDLE9BQU8sYUFDckMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxTQUFTLEVBQUMsQ0FBQzs4QkFJRSxXQUFXO3NCQUFqRSxTQUFTO3VCQUFDLGlCQUFpQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RyZWV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFRyZWVOb2RlT3V0bGV0fSBmcm9tICcuL291dGxldCc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RhYmxlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRyZWUnLFxuICBleHBvcnRBczogJ21hdFRyZWUnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgbWF0VHJlZU5vZGVPdXRsZXQ+PC9uZy1jb250YWluZXI+YCxcbiAgaG9zdDoge1xuICAgIC8vIFRoZSAnY2RrLXRyZWUnIGNsYXNzIG5lZWRzIHRvIGJlIGluY2x1ZGVkIGhlcmUgYmVjYXVzZSBjbGFzc2VzIHNldCBpbiB0aGUgaG9zdCBpbiB0aGVcbiAgICAvLyBwYXJlbnQgY2xhc3MgYXJlIG5vdCBpbmhlcml0ZWQgd2l0aCBWaWV3IEVuZ2luZS4gVGhlICdjZGstdHJlZScgY2xhc3MgaW4gQ2RrVHJlZU5vZGUgaGFzXG4gICAgLy8gdG8gYmUgc2V0IGluIHRoZSBob3N0IGJlY2F1c2U6XG4gICAgLy8gaWYgaXQgaXMgc2V0IGFzIGEgQEhvc3RCaW5kaW5nIGl0IGlzIG5vdCBzZXQgYnkgdGhlIHRpbWUgdGhlIHRyZWUgbm9kZXMgdHJ5IHRvIHJlYWQgdGhlXG4gICAgLy8gY2xhc3MgZnJvbSBpdC5cbiAgICAvLyB0aGUgRWxlbWVudFJlZiBpcyBub3QgYXZhaWxhYmxlIGluIHRoZSBjb25zdHJ1Y3RvciBzbyB0aGUgY2xhc3MgY2FuJ3QgYmUgYXBwbGllZCBkaXJlY3RseVxuICAgIC8vIHdpdGhvdXQgYSBicmVha2luZyBjb25zdHJ1Y3RvciBjaGFuZ2UuXG4gICAgJ2NsYXNzJzogJ21hdC10cmVlIGNkay10cmVlJyxcbiAgICAncm9sZSc6ICd0cmVlJyxcbiAgfSxcbiAgc3R5bGVVcmxzOiBbJ3RyZWUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RyZWUgZm9yIGV4cGxhbmF0aW9uIG9uIHdoeSB0aGlzIHVzZXMgdGhlIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWV9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZTxULCBLID0gVD4gZXh0ZW5kcyBDZGtUcmVlPFQsIEs+IHtcbiAgLy8gT3V0bGV0cyB3aXRoaW4gdGhlIHRyZWUncyB0ZW1wbGF0ZSB3aGVyZSB0aGUgZGF0YU5vZGVzIHdpbGwgYmUgaW5zZXJ0ZWQuXG4gIEBWaWV3Q2hpbGQoTWF0VHJlZU5vZGVPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBvdmVycmlkZSBfbm9kZU91dGxldDogTWF0VHJlZU5vZGVPdXRsZXQ7XG59XG4iXX0=