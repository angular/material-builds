/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
/** Base class containing all of the functionality for `MatAutocompleteOrigin`. */
export class _MatAutocompleteOriginBase {
    constructor(
    /** Reference to the element on which the directive is applied. */
    elementRef) {
        this.elementRef = elementRef;
    }
}
_MatAutocompleteOriginBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatAutocompleteOriginBase, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
_MatAutocompleteOriginBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatAutocompleteOriginBase, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatAutocompleteOriginBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });
/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
export class MatAutocompleteOrigin extends _MatAutocompleteOriginBase {
}
MatAutocompleteOrigin.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatAutocompleteOrigin, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatAutocompleteOrigin.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatAutocompleteOrigin, selector: "[matAutocompleteOrigin]", exportAs: ["matAutocompleteOrigin"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatAutocompleteOrigin, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matAutocompleteOrigin]',
                    exportAs: 'matAutocompleteOrigin',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW9yaWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLW9yaWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFcEQsa0ZBQWtGO0FBRWxGLE1BQU0sT0FBZ0IsMEJBQTBCO0lBQzlDO0lBQ0Usa0VBQWtFO0lBQzNELFVBQW1DO1FBQW5DLGVBQVUsR0FBVixVQUFVLENBQXlCO0lBQUcsQ0FBQzs7K0hBSDVCLDBCQUEwQjttSEFBMUIsMEJBQTBCO21HQUExQiwwQkFBMEI7a0JBRC9DLFNBQVM7O0FBT1Y7OztHQUdHO0FBS0gsTUFBTSxPQUFPLHFCQUFzQixTQUFRLDBCQUEwQjs7MEhBQXhELHFCQUFxQjs4R0FBckIscUJBQXFCO21HQUFyQixxQkFBcUI7a0JBSmpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLHVCQUF1QjtpQkFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQmFzZSBjbGFzcyBjb250YWluaW5nIGFsbCBvZiB0aGUgZnVuY3Rpb25hbGl0eSBmb3IgYE1hdEF1dG9jb21wbGV0ZU9yaWdpbmAuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0QXV0b2NvbXBsZXRlT3JpZ2luQmFzZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgb24gd2hpY2ggdGhlIGRpcmVjdGl2ZSBpcyBhcHBsaWVkLiAqL1xuICAgIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgYXBwbGllZCB0byBhbiBlbGVtZW50IHRvIG1ha2UgaXQgdXNhYmxlXG4gKiBhcyBhIGNvbm5lY3Rpb24gcG9pbnQgZm9yIGFuIGF1dG9jb21wbGV0ZSBwYW5lbC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEF1dG9jb21wbGV0ZU9yaWdpbl0nLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZU9yaWdpbicsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9yaWdpbiBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVPcmlnaW5CYXNlIHt9XG4iXX0=