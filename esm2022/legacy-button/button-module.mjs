/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatLegacyAnchor, MatLegacyButton } from './button';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatButtonModule` from `@angular/material/button` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyButtonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyButtonModule, declarations: [MatLegacyButton, MatLegacyAnchor], imports: [MatRippleModule, MatCommonModule], exports: [MatLegacyButton, MatLegacyAnchor, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyButtonModule, imports: [MatRippleModule, MatCommonModule, MatCommonModule] }); }
}
export { MatLegacyButtonModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule],
                    exports: [MatLegacyButton, MatLegacyAnchor, MatCommonModule],
                    declarations: [MatLegacyButton, MatLegacyAnchor],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktYnV0dG9uL2J1dHRvbi1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUUxRDs7O0dBR0c7QUFDSCxNQUthLHFCQUFxQjs4R0FBckIscUJBQXFCOytHQUFyQixxQkFBcUIsaUJBRmpCLGVBQWUsRUFBRSxlQUFlLGFBRnJDLGVBQWUsRUFBRSxlQUFlLGFBQ2hDLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZTsrR0FHaEQscUJBQXFCLFlBSnRCLGVBQWUsRUFBRSxlQUFlLEVBQ0UsZUFBZTs7U0FHaEQscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBTGpDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQztvQkFDM0MsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQzVELFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7aUJBQ2pEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdExlZ2FjeUFuY2hvciwgTWF0TGVnYWN5QnV0dG9ufSBmcm9tICcuL2J1dHRvbic7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRCdXR0b25Nb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2J1dHRvbmAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0TGVnYWN5QnV0dG9uLCBNYXRMZWdhY3lBbmNob3IsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdExlZ2FjeUJ1dHRvbiwgTWF0TGVnYWN5QW5jaG9yXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5QnV0dG9uTW9kdWxlIHt9XG4iXX0=