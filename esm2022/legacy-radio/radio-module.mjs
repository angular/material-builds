/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatLegacyRadioButton, MatLegacyRadioGroup } from './radio';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatRadioModule` from `@angular/material/radio` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyRadioModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyRadioModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyRadioModule, declarations: [MatLegacyRadioGroup, MatLegacyRadioButton], imports: [MatRippleModule, MatCommonModule], exports: [MatLegacyRadioGroup, MatLegacyRadioButton, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyRadioModule, imports: [MatRippleModule, MatCommonModule, MatCommonModule] }); }
}
export { MatLegacyRadioModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyRadioModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule],
                    exports: [MatLegacyRadioGroup, MatLegacyRadioButton, MatCommonModule],
                    declarations: [MatLegacyRadioGroup, MatLegacyRadioButton],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1yYWRpby9yYWRpby1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7QUFFbEU7OztHQUdHO0FBQ0gsTUFLYSxvQkFBb0I7OEdBQXBCLG9CQUFvQjsrR0FBcEIsb0JBQW9CLGlCQUZoQixtQkFBbUIsRUFBRSxvQkFBb0IsYUFGOUMsZUFBZSxFQUFFLGVBQWUsYUFDaEMsbUJBQW1CLEVBQUUsb0JBQW9CLEVBQUUsZUFBZTsrR0FHekQsb0JBQW9CLFlBSnJCLGVBQWUsRUFBRSxlQUFlLEVBQ1csZUFBZTs7U0FHekQsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBTGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQztvQkFDM0MsT0FBTyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDO29CQUNyRSxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQztpQkFDMUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0TGVnYWN5UmFkaW9CdXR0b24sIE1hdExlZ2FjeVJhZGlvR3JvdXB9IGZyb20gJy4vcmFkaW8nO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0UmFkaW9Nb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3JhZGlvYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRSaXBwbGVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRMZWdhY3lSYWRpb0dyb3VwLCBNYXRMZWdhY3lSYWRpb0J1dHRvbiwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5UmFkaW9Hcm91cCwgTWF0TGVnYWN5UmFkaW9CdXR0b25dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lSYWRpb01vZHVsZSB7fVxuIl19