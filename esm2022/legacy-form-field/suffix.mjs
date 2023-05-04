/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { MAT_SUFFIX } from '@angular/material/form-field';
import * as i0 from "@angular/core";
/**
 * Suffix to be placed at the end of the form field.
 * @deprecated Use `MatSuffix` from `@angular/material/form-field` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySuffix {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySuffix, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacySuffix, selector: "[matSuffix]", providers: [{ provide: MAT_SUFFIX, useExisting: MatLegacySuffix }], ngImport: i0 }); }
}
export { MatLegacySuffix };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySuffix, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matSuffix]',
                    providers: [{ provide: MAT_SUFFIX, useExisting: MatLegacySuffix }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VmZml4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1mb3JtLWZpZWxkL3N1ZmZpeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQzs7QUFFeEQ7Ozs7R0FJRztBQUNILE1BSWEsZUFBZTs4R0FBZixlQUFlO2tHQUFmLGVBQWUsc0NBRmYsQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDOztTQUVyRCxlQUFlOzJGQUFmLGVBQWU7a0JBSjNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLGlCQUFpQixFQUFDLENBQUM7aUJBQ2pFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX1NVRkZJWH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbi8qKlxuICogU3VmZml4IHRvIGJlIHBsYWNlZCBhdCB0aGUgZW5kIG9mIHRoZSBmb3JtIGZpZWxkLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRTdWZmaXhgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGRgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFN1ZmZpeF0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NVRkZJWCwgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeVN1ZmZpeH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lTdWZmaXgge31cbiJdfQ==