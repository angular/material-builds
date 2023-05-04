/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
class MatTreeNodeToggle extends CdkTreeNodeToggle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodeToggle, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatTreeNodeToggle, selector: "[matTreeNodeToggle]", inputs: { recursive: ["matTreeNodeToggleRecursive", "recursive"] }, providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }], usesInheritance: true, ngImport: i0 }); }
}
export { MatTreeNodeToggle };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodeToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeToggle]',
                    providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }],
                    inputs: ['recursive: matTreeNodeToggleRecursive'],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXhDOztHQUVHO0FBQ0gsTUFLYSxpQkFBNEIsU0FBUSxpQkFBdUI7OEdBQTNELGlCQUFpQjtrR0FBakIsaUJBQWlCLGtIQUhqQixDQUFDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDOztTQUc5RCxpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFMN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLG1CQUFtQixFQUFDLENBQUM7b0JBQ3pFLE1BQU0sRUFBRSxDQUFDLHVDQUF1QyxDQUFDO2lCQUNsRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RyZWVOb2RlVG9nZ2xlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUncyB0b2dnbGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVUb2dnbGVdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlVG9nZ2xlLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGVUb2dnbGV9XSxcbiAgaW5wdXRzOiBbJ3JlY3Vyc2l2ZTogbWF0VHJlZU5vZGVUb2dnbGVSZWN1cnNpdmUnXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVUb2dnbGU8VCwgSyA9IFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVUb2dnbGU8VCwgSz4ge31cbiJdfQ==