/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
// tslint:disable-next-line: coercion-types
export class MatTreeNodeToggle extends CdkTreeNodeToggle {
    get recursive() { return this._recursive; }
    set recursive(value) {
        // TODO: when we remove support for ViewEngine, change this setter to an input
        // alias in the decorator metadata.
        this._recursive = coerceBooleanProperty(value);
    }
}
MatTreeNodeToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTreeNodeToggle, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodeToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatTreeNodeToggle, selector: "[matTreeNodeToggle]", inputs: { recursive: ["matTreeNodeToggleRecursive", "recursive"] }, providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTreeNodeToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeToggle]',
                    providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }]
                }]
        }], propDecorators: { recursive: [{
                type: Input,
                args: ['matTreeNodeToggleRecursive']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUUvQzs7R0FFRztBQUtILDJDQUEyQztBQUMzQyxNQUFNLE9BQU8saUJBQTRCLFNBQVEsaUJBQXVCO0lBQ3RFLElBQ2EsU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDN0QsSUFBYSxTQUFTLENBQUMsS0FBYztRQUNuQyw4RUFBOEU7UUFDOUUsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQzs7c0hBUFUsaUJBQWlCOzBHQUFqQixpQkFBaUIsa0hBSGpCLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDLENBQUM7bUdBRzlELGlCQUFpQjtrQkFMN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLG1CQUFtQixFQUFDLENBQUM7aUJBQzFFOzhCQUljLFNBQVM7c0JBRHJCLEtBQUs7dUJBQUMsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDZGtUcmVlTm9kZVRvZ2dsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSdzIHRvZ2dsZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZVRvZ2dsZV0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGVUb2dnbGUsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZVRvZ2dsZX1dXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb2VyY2lvbi10eXBlc1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlVG9nZ2xlPFQsIEsgPSBUPiBleHRlbmRzIENka1RyZWVOb2RlVG9nZ2xlPFQsIEs+IHtcbiAgQElucHV0KCdtYXRUcmVlTm9kZVRvZ2dsZVJlY3Vyc2l2ZScpXG4gIG92ZXJyaWRlIGdldCByZWN1cnNpdmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZWN1cnNpdmU7IH1cbiAgb3ZlcnJpZGUgc2V0IHJlY3Vyc2l2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIC8vIFRPRE86IHdoZW4gd2UgcmVtb3ZlIHN1cHBvcnQgZm9yIFZpZXdFbmdpbmUsIGNoYW5nZSB0aGlzIHNldHRlciB0byBhbiBpbnB1dFxuICAgIC8vIGFsaWFzIGluIHRoZSBkZWNvcmF0b3IgbWV0YWRhdGEuXG4gICAgdGhpcy5fcmVjdXJzaXZlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxufVxuIl19