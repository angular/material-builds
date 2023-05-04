/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
let nextUniqueId = 0;
/** Hint text to be shown underneath the form field control. */
class MatHint {
    constructor() {
        /** Whether to align the hint label at the start or end of the line. */
        this.align = 'start';
        /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
        this.id = `mat-mdc-hint-${nextUniqueId++}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatHint, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatHint, selector: "mat-hint", inputs: { align: "align", id: "id" }, host: { properties: { "class.mat-mdc-form-field-hint-end": "align === \"end\"", "id": "id", "attr.align": "null" }, classAttribute: "mat-mdc-form-field-hint mat-mdc-form-field-bottom-align" }, ngImport: i0 }); }
}
export { MatHint };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatHint, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-hint',
                    host: {
                        'class': 'mat-mdc-form-field-hint mat-mdc-form-field-bottom-align',
                        '[class.mat-mdc-form-field-hint-end]': 'align === "end"',
                        '[id]': 'id',
                        // Remove align attribute to prevent it from interfering with layout.
                        '[attr.align]': 'null',
                    },
                }]
        }], propDecorators: { align: [{
                type: Input
            }], id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2RpcmVjdGl2ZXMvaGludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFL0MsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLCtEQUErRDtBQUMvRCxNQVVhLE9BQU87SUFWcEI7UUFXRSx1RUFBdUU7UUFDOUQsVUFBSyxHQUFvQixPQUFPLENBQUM7UUFFMUMsdUZBQXVGO1FBQzlFLE9BQUUsR0FBVyxnQkFBZ0IsWUFBWSxFQUFFLEVBQUUsQ0FBQztLQUN4RDs4R0FOWSxPQUFPO2tHQUFQLE9BQU87O1NBQVAsT0FBTzsyRkFBUCxPQUFPO2tCQVZuQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLHlEQUF5RDt3QkFDbEUscUNBQXFDLEVBQUUsaUJBQWlCO3dCQUN4RCxNQUFNLEVBQUUsSUFBSTt3QkFDWixxRUFBcUU7d0JBQ3JFLGNBQWMsRUFBRSxNQUFNO3FCQUN2QjtpQkFDRjs4QkFHVSxLQUFLO3NCQUFiLEtBQUs7Z0JBR0csRUFBRTtzQkFBVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKiogSGludCB0ZXh0IHRvIGJlIHNob3duIHVuZGVybmVhdGggdGhlIGZvcm0gZmllbGQgY29udHJvbC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oaW50JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWZvcm0tZmllbGQtaGludCBtYXQtbWRjLWZvcm0tZmllbGQtYm90dG9tLWFsaWduJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZm9ybS1maWVsZC1oaW50LWVuZF0nOiAnYWxpZ24gPT09IFwiZW5kXCInLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAvLyBSZW1vdmUgYWxpZ24gYXR0cmlidXRlIHRvIHByZXZlbnQgaXQgZnJvbSBpbnRlcmZlcmluZyB3aXRoIGxheW91dC5cbiAgICAnW2F0dHIuYWxpZ25dJzogJ251bGwnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIaW50IHtcbiAgLyoqIFdoZXRoZXIgdG8gYWxpZ24gdGhlIGhpbnQgbGFiZWwgYXQgdGhlIHN0YXJ0IG9yIGVuZCBvZiB0aGUgbGluZS4gKi9cbiAgQElucHV0KCkgYWxpZ246ICdzdGFydCcgfCAnZW5kJyA9ICdzdGFydCc7XG5cbiAgLyoqIFVuaXF1ZSBJRCBmb3IgdGhlIGhpbnQuIFVzZWQgZm9yIHRoZSBhcmlhLWRlc2NyaWJlZGJ5IG9uIHRoZSBmb3JtIGZpZWxkIGNvbnRyb2wuICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LW1kYy1oaW50LSR7bmV4dFVuaXF1ZUlkKyt9YDtcbn1cbiJdfQ==