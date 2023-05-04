/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, InjectionToken, Optional, TemplateRef, ViewContainerRef, } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatTabLabel`. It serves as
 * alternative token to the actual `MatTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_TAB_LABEL = new InjectionToken('MatTabLabel');
/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB = new InjectionToken('MAT_TAB');
/** Used to flag tab labels for use with the portal directive */
class MatTabLabel extends CdkPortal {
    constructor(templateRef, viewContainerRef, _closestTab) {
        super(templateRef, viewContainerRef);
        this._closestTab = _closestTab;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTabLabel, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: MAT_TAB, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatTabLabel, selector: "[mat-tab-label], [matTabLabel]", providers: [{ provide: MAT_TAB_LABEL, useExisting: MatTabLabel }], usesInheritance: true, ngImport: i0 }); }
}
export { MatTabLabel };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTabLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-tab-label], [matTabLabel]',
                    providers: [{ provide: MAT_TAB_LABEL, useExisting: MatTabLabel }],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TAB]
                }, {
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWxhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0scUJBQXFCLENBQUM7O0FBRTlDOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQWMsYUFBYSxDQUFDLENBQUM7QUFFNUU7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBYyxDQUFNLFNBQVMsQ0FBQyxDQUFDO0FBRTFELGdFQUFnRTtBQUNoRSxNQUlhLFdBQVksU0FBUSxTQUFTO0lBQ3hDLFlBQ0UsV0FBNkIsRUFDN0IsZ0JBQWtDLEVBQ0UsV0FBZ0I7UUFFcEQsS0FBSyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRkQsZ0JBQVcsR0FBWCxXQUFXLENBQUs7SUFHdEQsQ0FBQzs4R0FQVSxXQUFXLDZFQUlaLE9BQU87a0dBSk4sV0FBVyx5REFGWCxDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7O1NBRXBELFdBQVc7MkZBQVgsV0FBVztrQkFKdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZ0NBQWdDO29CQUMxQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxhQUFhLEVBQUMsQ0FBQztpQkFDaEU7OzBCQUtJLE1BQU07MkJBQUMsT0FBTzs7MEJBQUcsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Nka1BvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0VGFiTGFiZWxgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdFRhYkxhYmVsYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UQUJfTEFCRUwgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0VGFiTGFiZWw+KCdNYXRUYWJMYWJlbCcpO1xuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIHRhYiBsYWJlbCB0byBhIHRhYiB3aXRob3V0IGNhdXNpbmcgYSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1RBQiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNQVRfVEFCJyk7XG5cbi8qKiBVc2VkIHRvIGZsYWcgdGFiIGxhYmVscyBmb3IgdXNlIHdpdGggdGhlIHBvcnRhbCBkaXJlY3RpdmUgKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtdGFiLWxhYmVsXSwgW21hdFRhYkxhYmVsXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfVEFCX0xBQkVMLCB1c2VFeGlzdGluZzogTWF0VGFiTGFiZWx9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTGFiZWwgZXh0ZW5kcyBDZGtQb3J0YWwge1xuICBjb25zdHJ1Y3RvcihcbiAgICB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTUFUX1RBQikgQE9wdGlvbmFsKCkgcHVibGljIF9jbG9zZXN0VGFiOiBhbnksXG4gICkge1xuICAgIHN1cGVyKHRlbXBsYXRlUmVmLCB2aWV3Q29udGFpbmVyUmVmKTtcbiAgfVxufVxuIl19