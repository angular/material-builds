/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _MatTabLabelWrapperBase } from '@angular/material/tabs';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatTabLabelWrapper` from `@angular/material/tabs` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTabLabelWrapper extends _MatTabLabelWrapperBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabLabelWrapper, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyTabLabelWrapper, selector: "[matTabLabelWrapper]", inputs: { disabled: "disabled" }, host: { properties: { "class.mat-tab-disabled": "disabled", "attr.aria-disabled": "!!disabled" } }, usesInheritance: true, ngImport: i0 }); }
}
export { MatLegacyTabLabelWrapper };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabLabelWrapper, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTabLabelWrapper]',
                    inputs: ['disabled'],
                    host: {
                        '[class.mat-tab-disabled]': 'disabled',
                        '[attr.aria-disabled]': '!!disabled',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLXdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYnMvdGFiLWxhYmVsLXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFeEM7OztHQUdHO0FBQ0gsTUFRYSx3QkFBeUIsU0FBUSx1QkFBdUI7OEdBQXhELHdCQUF3QjtrR0FBeEIsd0JBQXdCOztTQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFScEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3BCLElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxVQUFVO3dCQUN0QyxzQkFBc0IsRUFBRSxZQUFZO3FCQUNyQztpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge19NYXRUYWJMYWJlbFdyYXBwZXJCYXNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJzJztcbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFRhYkxhYmVsV3JhcHBlcmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdGFic2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VGFiTGFiZWxXcmFwcGVyXScsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tYXQtdGFiLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJyEhZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUYWJMYWJlbFdyYXBwZXIgZXh0ZW5kcyBfTWF0VGFiTGFiZWxXcmFwcGVyQmFzZSB7fVxuIl19