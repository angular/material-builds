/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { MAT_MENU_CONTENT, _MatMenuContentBase } from '@angular/material/menu';
import * as i0 from "@angular/core";
/**
 * Menu content that will be rendered lazily once the menu is opened.
 * @deprecated Use `MatMenuContent` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyMenuContent extends _MatMenuContentBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyMenuContent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyMenuContent, selector: "ng-template[matMenuContent]", providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatLegacyMenuContent }], usesInheritance: true, ngImport: i0 }); }
}
export { MatLegacyMenuContent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyMenuContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matMenuContent]',
                    providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatLegacyMenuContent }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1tZW51L21lbnUtY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUU3RTs7OztHQUlHO0FBQ0gsTUFJYSxvQkFBcUIsU0FBUSxtQkFBbUI7OEdBQWhELG9CQUFvQjtrR0FBcEIsb0JBQW9CLHNEQUZwQixDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxvQkFBb0IsRUFBQyxDQUFDOztTQUVoRSxvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFKaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLHNCQUFzQixFQUFDLENBQUM7aUJBQzVFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX01FTlVfQ09OVEVOVCwgX01hdE1lbnVDb250ZW50QmFzZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG5cbi8qKlxuICogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkgb25jZSB0aGUgbWVudSBpcyBvcGVuZWQuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE1lbnVDb250ZW50YCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9tZW51YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdE1lbnVDb250ZW50XScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfTUVOVV9DT05URU5ULCB1c2VFeGlzdGluZzogTWF0TGVnYWN5TWVudUNvbnRlbnR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5TWVudUNvbnRlbnQgZXh0ZW5kcyBfTWF0TWVudUNvbnRlbnRCYXNlIHt9XG4iXX0=