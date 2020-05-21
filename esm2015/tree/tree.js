/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { CdkTree } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTreeNodeOutlet } from './outlet';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
let MatTree = /** @class */ (() => {
    var MatTree_1;
    let MatTree = MatTree_1 = class MatTree extends CdkTree {
    };
    __decorate([
        ViewChild(MatTreeNodeOutlet, { static: true }),
        __metadata("design:type", MatTreeNodeOutlet)
    ], MatTree.prototype, "_nodeOutlet", void 0);
    MatTree = MatTree_1 = __decorate([
        Component({
            selector: 'mat-tree',
            exportAs: 'matTree',
            template: `<ng-container matTreeNodeOutlet></ng-container>`,
            host: {
                'class': 'mat-tree',
                'role': 'tree',
            },
            encapsulation: ViewEncapsulation.None,
            // See note on CdkTree for explanation on why this uses the default change detection strategy.
            // tslint:disable-next-line:validate-decorators
            changeDetection: ChangeDetectionStrategy.Default,
            providers: [{ provide: CdkTree, useExisting: MatTree_1 }],
            styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"]
        })
    ], MatTree);
    return MatTree;
})();
export { MatTree };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFM0M7O0dBRUc7QUFnQkg7O0lBQUEsSUFBYSxPQUFPLGVBQXBCLE1BQWEsT0FBVyxTQUFRLE9BQVU7S0FHekMsQ0FBQTtJQUQrQztRQUE3QyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUM7a0NBQWMsaUJBQWlCO2dEQUFDO0lBRmxFLE9BQU87UUFmbkIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsUUFBUSxFQUFFLGlEQUFpRDtZQUMzRCxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyw4RkFBOEY7WUFDOUYsK0NBQStDO1lBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO1lBQ2hELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBTyxFQUFDLENBQUM7O1NBQ3RELENBQUM7T0FDVyxPQUFPLENBR25CO0lBQUQsY0FBQztLQUFBO1NBSFksT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RyZWV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFRyZWVOb2RlT3V0bGV0fSBmcm9tICcuL291dGxldCc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RhYmxlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRyZWUnLFxuICBleHBvcnRBczogJ21hdFRyZWUnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgbWF0VHJlZU5vZGVPdXRsZXQ+PC9uZy1jb250YWluZXI+YCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdHJlZScsXG4gICAgJ3JvbGUnOiAndHJlZScsXG4gIH0sXG4gIHN0eWxlVXJsczogWyd0cmVlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUcmVlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZTxUPiBleHRlbmRzIENka1RyZWU8VD4ge1xuICAvLyBPdXRsZXRzIHdpdGhpbiB0aGUgdHJlZSdzIHRlbXBsYXRlIHdoZXJlIHRoZSBkYXRhTm9kZXMgd2lsbCBiZSBpbnNlcnRlZC5cbiAgQFZpZXdDaGlsZChNYXRUcmVlTm9kZU91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9ub2RlT3V0bGV0OiBNYXRUcmVlTm9kZU91dGxldDtcbn1cbiJdfQ==