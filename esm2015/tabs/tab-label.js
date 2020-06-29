/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, InjectionToken } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
/**
 * Injection token that can be used to reference instances of `MatTabLabel`. It serves as
 * alternative token to the actual `MatTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_TAB_LABEL = new InjectionToken('MatTabLabel');
/** Used to flag tab labels for use with the portal directive */
let MatTabLabel = /** @class */ (() => {
    class MatTabLabel extends CdkPortal {
    }
    MatTabLabel.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-tab-label], [matTabLabel]',
                    providers: [{ provide: MAT_TAB_LABEL, useExisting: MatTabLabel }],
                },] }
    ];
    return MatTabLabel;
})();
export { MatTabLabel };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWxhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUU5Qzs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUFjLGFBQWEsQ0FBQyxDQUFDO0FBRTVFLGdFQUFnRTtBQUNoRTtJQUFBLE1BSWEsV0FBWSxTQUFRLFNBQVM7OztnQkFKekMsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7aUJBQ2hFOztJQUMyQyxrQkFBQztLQUFBO1NBQWhDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2RrUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRUYWJMYWJlbGAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0VGFiTGFiZWxgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX1RBQl9MQUJFTCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRUYWJMYWJlbD4oJ01hdFRhYkxhYmVsJyk7XG5cbi8qKiBVc2VkIHRvIGZsYWcgdGFiIGxhYmVscyBmb3IgdXNlIHdpdGggdGhlIHBvcnRhbCBkaXJlY3RpdmUgKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtdGFiLWxhYmVsXSwgW21hdFRhYkxhYmVsXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfVEFCX0xBQkVMLCB1c2VFeGlzdGluZzogTWF0VGFiTGFiZWx9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTGFiZWwgZXh0ZW5kcyBDZGtQb3J0YWwge31cbiJdfQ==