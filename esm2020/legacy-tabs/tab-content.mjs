/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { MAT_TAB_CONTENT, MatTabContent as MatNonLegacyTabContent } from '@angular/material/tabs';
import * as i0 from "@angular/core";
/** Decorates the `ng-template` tags and reads out the template from it. */
export class MatLegacyTabContent extends MatNonLegacyTabContent {
}
MatLegacyTabContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyTabContent, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyTabContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: MatLegacyTabContent, selector: "[matTabContent]", providers: [{ provide: MAT_TAB_CONTENT, useExisting: MatLegacyTabContent }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyTabContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTabContent]',
                    providers: [{ provide: MAT_TAB_CONTENT, useExisting: MatLegacyTabContent }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYnMvdGFiLWNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsSUFBSSxzQkFBc0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUVoRywyRUFBMkU7QUFLM0UsTUFBTSxPQUFPLG1CQUFvQixTQUFRLHNCQUFzQjs7Z0hBQWxELG1CQUFtQjtvR0FBbkIsbUJBQW1CLDBDQUZuQixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQzsyRkFFOUQsbUJBQW1CO2tCQUovQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLHFCQUFxQixFQUFDLENBQUM7aUJBQzFFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX1RBQl9DT05URU5ULCBNYXRUYWJDb250ZW50IGFzIE1hdE5vbkxlZ2FjeVRhYkNvbnRlbnR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xuXG4vKiogRGVjb3JhdGVzIHRoZSBgbmctdGVtcGxhdGVgIHRhZ3MgYW5kIHJlYWRzIG91dCB0aGUgdGVtcGxhdGUgZnJvbSBpdC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUYWJDb250ZW50XScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfVEFCX0NPTlRFTlQsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lUYWJDb250ZW50fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVRhYkNvbnRlbnQgZXh0ZW5kcyBNYXROb25MZWdhY3lUYWJDb250ZW50IHt9XG4iXX0=