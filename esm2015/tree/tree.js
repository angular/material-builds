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
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export class MatTree extends CdkTree {
}
MatTree.decorators = [
    { type: Component, args: [{
                selector: 'mat-tree',
                exportAs: 'matTree',
                template: `<ng-container matTreeNodeOutlet></ng-container>`,
                host: {
                    // The 'cdk-tree' class needs to be included here because classes set in the host in the
                    // parent class are not inherited with View Engine. The 'cdk-tree' class in CdkTreeNode has
                    // to be set in the host because:
                    // if it is set as a @HostBinding it is not set by the time the tree nodes try to read the
                    // class from it.
                    // the ElementRef is not available in the constructor so the class can't be applied directly
                    // without a breaking constructor change.
                    'class': 'mat-tree cdk-tree',
                    'role': 'tree',
                },
                encapsulation: ViewEncapsulation.None,
                // See note on CdkTree for explanation on why this uses the default change detection strategy.
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                providers: [{ provide: CdkTree, useExisting: MatTree }],
                styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"]
            },] }
];
MatTree.propDecorators = {
    _nodeOutlet: [{ type: ViewChild, args: [MatTreeNodeOutlet, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRTNDOztHQUVHO0FBdUJILE1BQU0sT0FBTyxPQUFXLFNBQVEsT0FBVTs7O1lBdEJ6QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixRQUFRLEVBQUUsaURBQWlEO2dCQUMzRCxJQUFJLEVBQUU7b0JBQ0osd0ZBQXdGO29CQUN4RiwyRkFBMkY7b0JBQzNGLGlDQUFpQztvQkFDakMsMEZBQTBGO29CQUMxRixpQkFBaUI7b0JBQ2pCLDRGQUE0RjtvQkFDNUYseUNBQXlDO29CQUN6QyxPQUFPLEVBQUUsbUJBQW1CO29CQUM1QixNQUFNLEVBQUUsTUFBTTtpQkFDZjtnQkFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsOEZBQThGO2dCQUM5RiwrQ0FBK0M7Z0JBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQyxDQUFDOzthQUN0RDs7OzBCQUdFLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDZGtUcmVlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRUcmVlTm9kZU91dGxldH0gZnJvbSAnLi9vdXRsZXQnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUYWJsZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10cmVlJyxcbiAgZXhwb3J0QXM6ICdtYXRUcmVlJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyIG1hdFRyZWVOb2RlT3V0bGV0PjwvbmctY29udGFpbmVyPmAsXG4gIGhvc3Q6IHtcbiAgICAvLyBUaGUgJ2Nkay10cmVlJyBjbGFzcyBuZWVkcyB0byBiZSBpbmNsdWRlZCBoZXJlIGJlY2F1c2UgY2xhc3NlcyBzZXQgaW4gdGhlIGhvc3QgaW4gdGhlXG4gICAgLy8gcGFyZW50IGNsYXNzIGFyZSBub3QgaW5oZXJpdGVkIHdpdGggVmlldyBFbmdpbmUuIFRoZSAnY2RrLXRyZWUnIGNsYXNzIGluIENka1RyZWVOb2RlIGhhc1xuICAgIC8vIHRvIGJlIHNldCBpbiB0aGUgaG9zdCBiZWNhdXNlOlxuICAgIC8vIGlmIGl0IGlzIHNldCBhcyBhIEBIb3N0QmluZGluZyBpdCBpcyBub3Qgc2V0IGJ5IHRoZSB0aW1lIHRoZSB0cmVlIG5vZGVzIHRyeSB0byByZWFkIHRoZVxuICAgIC8vIGNsYXNzIGZyb20gaXQuXG4gICAgLy8gdGhlIEVsZW1lbnRSZWYgaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgY29uc3RydWN0b3Igc28gdGhlIGNsYXNzIGNhbid0IGJlIGFwcGxpZWQgZGlyZWN0bHlcbiAgICAvLyB3aXRob3V0IGEgYnJlYWtpbmcgY29uc3RydWN0b3IgY2hhbmdlLlxuICAgICdjbGFzcyc6ICdtYXQtdHJlZSBjZGstdHJlZScsXG4gICAgJ3JvbGUnOiAndHJlZScsXG4gIH0sXG4gIHN0eWxlVXJsczogWyd0cmVlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUcmVlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZTxUPiBleHRlbmRzIENka1RyZWU8VD4ge1xuICAvLyBPdXRsZXRzIHdpdGhpbiB0aGUgdHJlZSdzIHRlbXBsYXRlIHdoZXJlIHRoZSBkYXRhTm9kZXMgd2lsbCBiZSBpbnNlcnRlZC5cbiAgQFZpZXdDaGlsZChNYXRUcmVlTm9kZU91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9ub2RlT3V0bGV0OiBNYXRUcmVlTm9kZU91dGxldDtcbn1cbiJdfQ==