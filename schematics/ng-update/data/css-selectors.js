/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-update/data/css-selectors", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    exports.cssSelectors = {
        [schematics_1.TargetVersion.V6]: [
            {
                pr: 'https://github.com/angular/components/pull/10296',
                changes: [
                    { replace: '.mat-form-field-placeholder', replaceWith: '.mat-form-field-label' },
                    { replace: '.mat-input-container', replaceWith: '.mat-form-field' },
                    { replace: '.mat-input-flex', replaceWith: '.mat-form-field-flex' },
                    { replace: '.mat-input-hint-spacer', replaceWith: '.mat-form-field-hint-spacer' },
                    { replace: '.mat-input-hint-wrapper', replaceWith: '.mat-form-field-hint-wrapper' },
                    { replace: '.mat-input-infix', replaceWith: '.mat-form-field-infix' },
                    { replace: '.mat-input-invalid', replaceWith: '.mat-form-field-invalid' },
                    { replace: '.mat-input-placeholder', replaceWith: '.mat-form-field-label' },
                    { replace: '.mat-input-placeholder-wrapper', replaceWith: '.mat-form-field-label-wrapper' },
                    { replace: '.mat-input-prefix', replaceWith: '.mat-form-field-prefix' },
                    { replace: '.mat-input-ripple', replaceWith: '.mat-form-field-ripple' },
                    { replace: '.mat-input-subscript-wrapper', replaceWith: '.mat-form-field-subscript-wrapper' },
                    { replace: '.mat-input-suffix', replaceWith: '.mat-form-field-suffix' },
                    { replace: '.mat-input-underline', replaceWith: '.mat-form-field-underline' },
                    { replace: '.mat-input-wrapper', replaceWith: '.mat-form-field-wrapper' }
                ]
            },
            // TODO(devversion): this shouldn't be here because it's not a CSS selector. Move into misc
            // rule.
            {
                pr: 'https://github.com/angular/components/pull/10430',
                changes: [{
                        replace: '$mat-font-family',
                        replaceWith: 'Roboto, \'Helvetica Neue\', sans-serif',
                        whitelist: { stylesheet: true }
                    }]
            }
        ]
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLXNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9kYXRhL2Nzcy1zZWxlY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBc0U7SUFrQnpELFFBQUEsWUFBWSxHQUE0QztRQUNuRSxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFO29CQUNQLEVBQUMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLFdBQVcsRUFBRSx1QkFBdUIsRUFBQztvQkFDOUUsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDO29CQUNqRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsc0JBQXNCLEVBQUM7b0JBQ2pFLEVBQUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLFdBQVcsRUFBRSw2QkFBNkIsRUFBQztvQkFDL0UsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsV0FBVyxFQUFFLDhCQUE4QixFQUFDO29CQUNqRixFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLEVBQUM7b0JBQ25FLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSx5QkFBeUIsRUFBQztvQkFDdkUsRUFBQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixFQUFDO29CQUN6RSxFQUFDLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxXQUFXLEVBQUUsK0JBQStCLEVBQUM7b0JBQ3pGLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBQztvQkFDckUsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixFQUFDO29CQUNyRSxFQUFDLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxXQUFXLEVBQUUsbUNBQW1DLEVBQUM7b0JBQzNGLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBQztvQkFDckUsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxFQUFFLDJCQUEyQixFQUFDO29CQUMzRSxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUseUJBQXlCLEVBQUM7aUJBQ3hFO2FBQ0Y7WUFFRCwyRkFBMkY7WUFDM0YsUUFBUTtZQUNSO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDO3dCQUNSLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLFdBQVcsRUFBRSx3Q0FBd0M7d0JBQ3JELFNBQVMsRUFBRSxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUM7cUJBQzlCLENBQUM7YUFDSDtTQUNGO0tBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RhcmdldFZlcnNpb24sIFZlcnNpb25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWF0ZXJpYWxDc3NTZWxlY3RvckRhdGEge1xuICAvKiogVGhlIENTUyBzZWxlY3RvciB0byByZXBsYWNlLiAqL1xuICByZXBsYWNlOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IENTUyBzZWxlY3Rvci4gKi9cbiAgcmVwbGFjZVdpdGg6IHN0cmluZztcbiAgLyoqIFdoaXRlbGlzdCB3aGVyZSB0aGlzIHJlcGxhY2VtZW50IGlzIG1hZGUuIElmIG9taXR0ZWQgaXQgaXMgbWFkZSBpbiBhbGwgZmlsZXMuICovXG4gIHdoaXRlbGlzdD86IHtcbiAgICAvKiogUmVwbGFjZSB0aGlzIG5hbWUgaW4gc3R5bGVzaGVldCBmaWxlcy4gKi9cbiAgICBzdHlsZXNoZWV0PzogYm9vbGVhbixcbiAgICAvKiogUmVwbGFjZSB0aGlzIG5hbWUgaW4gSFRNTCBmaWxlcy4gKi9cbiAgICBodG1sPzogYm9vbGVhbixcbiAgICAvKiogUmVwbGFjZSB0aGlzIG5hbWUgaW4gVHlwZVNjcmlwdCBzdHJpbmdzLiAqL1xuICAgIHN0cmluZ3M/OiBib29sZWFuXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjc3NTZWxlY3RvcnM6IFZlcnNpb25DaGFuZ2VzPE1hdGVyaWFsQ3NzU2VsZWN0b3JEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyOTYnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJy5tYXQtZm9ybS1maWVsZC1wbGFjZWhvbGRlcicsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLWxhYmVsJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1jb250YWluZXInLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZCd9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtZmxleCcsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLWZsZXgnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LWhpbnQtc3BhY2VyJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtaGludC1zcGFjZXInfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LWhpbnQtd3JhcHBlcicsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLWhpbnQtd3JhcHBlcid9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtaW5maXgnLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1pbmZpeCd9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtaW52YWxpZCcsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLWludmFsaWQnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LXBsYWNlaG9sZGVyJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtbGFiZWwnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LXBsYWNlaG9sZGVyLXdyYXBwZXInLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1sYWJlbC13cmFwcGVyJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1wcmVmaXgnLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1wcmVmaXgnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LXJpcHBsZScsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLXJpcHBsZSd9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtc3Vic2NyaXB0LXdyYXBwZXInLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1zdWJzY3JpcHQtd3JhcHBlcid9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtc3VmZml4JywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtc3VmZml4J30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC11bmRlcmxpbmUnLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC11bmRlcmxpbmUnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LXdyYXBwZXInLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC13cmFwcGVyJ31cbiAgICAgIF1cbiAgICB9LFxuXG4gICAgLy8gVE9ETyhkZXZ2ZXJzaW9uKTogdGhpcyBzaG91bGRuJ3QgYmUgaGVyZSBiZWNhdXNlIGl0J3Mgbm90IGEgQ1NTIHNlbGVjdG9yLiBNb3ZlIGludG8gbWlzY1xuICAgIC8vIHJ1bGUuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTA0MzAnLFxuICAgICAgY2hhbmdlczogW3tcbiAgICAgICAgcmVwbGFjZTogJyRtYXQtZm9udC1mYW1pbHknLFxuICAgICAgICByZXBsYWNlV2l0aDogJ1JvYm90bywgXFwnSGVsdmV0aWNhIE5ldWVcXCcsIHNhbnMtc2VyaWYnLFxuICAgICAgICB3aGl0ZWxpc3Q6IHtzdHlsZXNoZWV0OiB0cnVlfVxuICAgICAgfV1cbiAgICB9XG4gIF1cbn07XG4iXX0=