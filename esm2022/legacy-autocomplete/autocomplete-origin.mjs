/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { _MatAutocompleteOriginBase } from '@angular/material/autocomplete';
import * as i0 from "@angular/core";
/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 * @deprecated Use `MatAutocompleteOrigin` from `@angular/material/autocomplete` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyAutocompleteOrigin extends _MatAutocompleteOriginBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyAutocompleteOrigin, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyAutocompleteOrigin, selector: "[matAutocompleteOrigin]", exportAs: ["matAutocompleteOrigin"], usesInheritance: true, ngImport: i0 }); }
}
export { MatLegacyAutocompleteOrigin };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyAutocompleteOrigin, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matAutocompleteOrigin]',
                    exportAs: 'matAutocompleteOrigin',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW9yaWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS1vcmlnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFFMUU7Ozs7O0dBS0c7QUFDSCxNQUlhLDJCQUE0QixTQUFRLDBCQUEwQjs4R0FBOUQsMkJBQTJCO2tHQUEzQiwyQkFBMkI7O1NBQTNCLDJCQUEyQjsyRkFBM0IsMkJBQTJCO2tCQUp2QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSx1QkFBdUI7aUJBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7X01hdEF1dG9jb21wbGV0ZU9yaWdpbkJhc2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2F1dG9jb21wbGV0ZSc7XG5cbi8qKlxuICogRGlyZWN0aXZlIGFwcGxpZWQgdG8gYW4gZWxlbWVudCB0byBtYWtlIGl0IHVzYWJsZVxuICogYXMgYSBjb25uZWN0aW9uIHBvaW50IGZvciBhbiBhdXRvY29tcGxldGUgcGFuZWwuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdEF1dG9jb21wbGV0ZU9yaWdpbmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRBdXRvY29tcGxldGVPcmlnaW5dJyxcbiAgZXhwb3J0QXM6ICdtYXRBdXRvY29tcGxldGVPcmlnaW4nLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lBdXRvY29tcGxldGVPcmlnaW4gZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlT3JpZ2luQmFzZSB7fVxuIl19