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
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export class MatTree extends CdkTree {
    constructor() {
        super(...arguments);
        // Outlets within the tree's template where the dataNodes will be inserted.
        // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
        this._nodeOutlet = undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatTree, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.0", type: MatTree, isStandalone: true, selector: "mat-tree", host: { attributes: { "role": "tree" }, classAttribute: "mat-tree" }, providers: [{ provide: CdkTree, useExisting: MatTree }], viewQueries: [{ propertyName: "_nodeOutlet", first: true, predicate: MatTreeNodeOutlet, descendants: true, static: true }], exportAs: ["matTree"], usesInheritance: true, ngImport: i0, template: `<ng-container matTreeNodeOutlet></ng-container>`, isInline: true, styles: [".mat-tree{display:block;background-color:var(--mat-tree-container-background-color)}.mat-tree-node,.mat-nested-tree-node{color:var(--mat-tree-node-text-color);font-family:var(--mat-tree-node-text-font);font-size:var(--mat-tree-node-text-size);font-weight:var(--mat-tree-node-text-weight)}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word;min-height:var(--mat-tree-node-min-height)}.mat-nested-tree-node{border-bottom-width:0}"], dependencies: [{ kind: "directive", type: MatTreeNodeOutlet, selector: "[matTreeNodeOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatTree, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tree', exportAs: 'matTree', template: `<ng-container matTreeNodeOutlet></ng-container>`, host: {
                        'class': 'mat-tree',
                        'role': 'tree',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, providers: [{ provide: CdkTree, useExisting: MatTree }], standalone: true, imports: [MatTreeNodeOutlet], styles: [".mat-tree{display:block;background-color:var(--mat-tree-container-background-color)}.mat-tree-node,.mat-nested-tree-node{color:var(--mat-tree-node-text-color);font-family:var(--mat-tree-node-text-font);font-size:var(--mat-tree-node-text-size);font-weight:var(--mat-tree-node-text-weight)}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word;min-height:var(--mat-tree-node-min-height)}.mat-nested-tree-node{border-bottom-width:0}"] }]
        }], propDecorators: { _nodeOutlet: [{
                type: ViewChild,
                args: [MatTreeNodeOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9GLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFM0M7O0dBRUc7QUFrQkgsTUFBTSxPQUFPLE9BQWtCLFNBQVEsT0FBYTtJQWpCcEQ7O1FBa0JFLDJFQUEyRTtRQUMzRSwrRkFBK0Y7UUFDeEMsZ0JBQVcsR0FDaEUsU0FBVSxDQUFDO0tBQ2Q7OEdBTFksT0FBTztrR0FBUCxPQUFPLDZIQUpQLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUMsQ0FBQyx1RUFPMUMsaUJBQWlCLDRHQWpCbEIsaURBQWlELDRnQkFZakQsaUJBQWlCOzsyRkFFaEIsT0FBTztrQkFqQm5CLFNBQVM7K0JBQ0UsVUFBVSxZQUNWLFNBQVMsWUFDVCxpREFBaUQsUUFDckQ7d0JBQ0osT0FBTyxFQUFFLFVBQVU7d0JBQ25CLE1BQU0sRUFBRSxNQUFNO3FCQUNmLGlCQUVjLGlCQUFpQixDQUFDLElBQUksbUJBR3BCLHVCQUF1QixDQUFDLE9BQU8sYUFDckMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxTQUFTLEVBQUMsQ0FBQyxjQUN6QyxJQUFJLFdBQ1AsQ0FBQyxpQkFBaUIsQ0FBQzs4QkFLMkIsV0FBVztzQkFBakUsU0FBUzt1QkFBQyxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDZGtUcmVlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRUcmVlTm9kZU91dGxldH0gZnJvbSAnLi9vdXRsZXQnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUYWJsZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10cmVlJyxcbiAgZXhwb3J0QXM6ICdtYXRUcmVlJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyIG1hdFRyZWVOb2RlT3V0bGV0PjwvbmctY29udGFpbmVyPmAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRyZWUnLFxuICAgICdyb2xlJzogJ3RyZWUnLFxuICB9LFxuICBzdHlsZVVybHM6IFsndHJlZS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gU2VlIG5vdGUgb24gQ2RrVHJlZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlLCB1c2VFeGlzdGluZzogTWF0VHJlZX1dLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0VHJlZU5vZGVPdXRsZXRdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlPFQsIEsgPSBUPiBleHRlbmRzIENka1RyZWU8VCwgSz4ge1xuICAvLyBPdXRsZXRzIHdpdGhpbiB0aGUgdHJlZSdzIHRlbXBsYXRlIHdoZXJlIHRoZSBkYXRhTm9kZXMgd2lsbCBiZSBpbnNlcnRlZC5cbiAgLy8gV2UgbmVlZCBhbiBpbml0aWFsaXplciBoZXJlIHRvIGF2b2lkIGEgVFMgZXJyb3IuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBpbiBgbmdBZnRlclZpZXdJbml0YC5cbiAgQFZpZXdDaGlsZChNYXRUcmVlTm9kZU91dGxldCwge3N0YXRpYzogdHJ1ZX0pIG92ZXJyaWRlIF9ub2RlT3V0bGV0OiBNYXRUcmVlTm9kZU91dGxldCA9XG4gICAgdW5kZWZpbmVkITtcbn1cbiJdfQ==