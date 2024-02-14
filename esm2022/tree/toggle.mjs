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
export class MatTreeNodeToggle extends CdkTreeNodeToggle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatTreeNodeToggle, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatTreeNodeToggle, isStandalone: true, selector: "[matTreeNodeToggle]", inputs: { recursive: ["matTreeNodeToggleRecursive", "recursive"] }, providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatTreeNodeToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeToggle]',
                    providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }],
                    inputs: ['recursive: matTreeNodeToggleRecursive'],
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXhDOztHQUVHO0FBT0gsTUFBTSxPQUFPLGlCQUE0QixTQUFRLGlCQUF1Qjs4R0FBM0QsaUJBQWlCO2tHQUFqQixpQkFBaUIsc0lBSmpCLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDLENBQUM7OzJGQUk5RCxpQkFBaUI7a0JBTjdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxtQkFBbUIsRUFBQyxDQUFDO29CQUN6RSxNQUFNLEVBQUUsQ0FBQyx1Q0FBdUMsQ0FBQztvQkFDakQsVUFBVSxFQUFFLElBQUk7aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrVHJlZU5vZGVUb2dnbGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSdzIHRvZ2dsZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZVRvZ2dsZV0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGVUb2dnbGUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZVRvZ2dsZX1dLFxuICBpbnB1dHM6IFsncmVjdXJzaXZlOiBtYXRUcmVlTm9kZVRvZ2dsZVJlY3Vyc2l2ZSddLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZVRvZ2dsZTxULCBLID0gVD4gZXh0ZW5kcyBDZGtUcmVlTm9kZVRvZ2dsZTxULCBLPiB7fVxuIl19