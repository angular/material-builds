/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule, MatPseudoCheckboxModule, MatCommonModule } from '@angular/material/core';
import { MatLegacyOption } from './option';
import { MatLegacyOptgroup } from './optgroup';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatOptionModule` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyOptionModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyOptionModule, declarations: [MatLegacyOption, MatLegacyOptgroup], imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule], exports: [MatLegacyOption, MatLegacyOptgroup] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyOptionModule, imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule] }); }
}
export { MatLegacyOptionModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule],
                    exports: [MatLegacyOption, MatLegacyOptgroup],
                    declarations: [MatLegacyOption, MatLegacyOptgroup],
                }]
        }] });
export * from './option';
export * from './optgroup';
export { 
/**
 * @deprecated Use `MAT_OPTGROUP` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_OPTGROUP as MAT_LEGACY_OPTGROUP, 
/**
 * @deprecated Use `MatOptionSelectionChange` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MatOptionSelectionChange as MatLegacyOptionSelectionChange, 
/**
 * @deprecated Use `MAT_OPTION_PARENT_COMPONENT` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_OPTION_PARENT_COMPONENT as MAT_LEGACY_OPTION_PARENT_COMPONENT, 
/**
 * @deprecated Use `_countGroupLabelsBeforeOption` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_countGroupLabelsBeforeOption as _countGroupLabelsBeforeLegacyOption, 
/**
 * @deprecated Use `_getOptionScrollPosition` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_getOptionScrollPosition as _getLegacyOptionScrollPosition, 
/**
 * @deprecated Use `_MatOptionBase` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_MatOptionBase as _MatLegacyOptionBase, 
/**
 * @deprecated Use `_MatOptgroupBase` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_MatOptgroupBase as _MatLegacyOptgroupBase, } from '@angular/material/core';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWNvcmUvb3B0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUUsdUJBQXVCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakcsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7O0FBRTdDOzs7R0FHRztBQUNILE1BS2EscUJBQXFCOzhHQUFyQixxQkFBcUI7K0dBQXJCLHFCQUFxQixpQkFGakIsZUFBZSxFQUFFLGlCQUFpQixhQUZ2QyxlQUFlLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsYUFDdkUsZUFBZSxFQUFFLGlCQUFpQjsrR0FHakMscUJBQXFCLFlBSnRCLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLHVCQUF1Qjs7U0FJdEUscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBTGpDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsdUJBQXVCLENBQUM7b0JBQ2xGLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQztvQkFDN0MsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLGlCQUFpQixDQUFDO2lCQUNuRDs7QUFHRCxjQUFjLFVBQVUsQ0FBQztBQUN6QixjQUFjLFlBQVksQ0FBQztBQUUzQixPQUFPO0FBQ0w7OztHQUdHO0FBQ0gsWUFBWSxJQUFJLG1CQUFtQjtBQUVuQzs7O0dBR0c7QUFDSCx3QkFBd0IsSUFBSSw4QkFBOEI7QUFRMUQ7OztHQUdHO0FBQ0gsMkJBQTJCLElBQUksa0NBQWtDO0FBRWpFOzs7R0FHRztBQUNILDZCQUE2QixJQUFJLG1DQUFtQztBQUVwRTs7O0dBR0c7QUFDSCx3QkFBd0IsSUFBSSw4QkFBOEI7QUFFMUQ7OztHQUdHO0FBQ0gsY0FBYyxJQUFJLG9CQUFvQjtBQUV0Qzs7O0dBR0c7QUFDSCxnQkFBZ0IsSUFBSSxzQkFBc0IsR0FDM0MsTUFBTSx3QkFBd0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRSaXBwbGVNb2R1bGUsIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlLCBNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lPcHRpb259IGZyb20gJy4vb3B0aW9uJztcbmltcG9ydCB7TWF0TGVnYWN5T3B0Z3JvdXB9IGZyb20gJy4vb3B0Z3JvdXAnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0T3B0aW9uTW9kdWxlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jb3JlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRSaXBwbGVNb2R1bGUsIENvbW1vbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBNYXRQc2V1ZG9DaGVja2JveE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRMZWdhY3lPcHRpb24sIE1hdExlZ2FjeU9wdGdyb3VwXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5T3B0aW9uLCBNYXRMZWdhY3lPcHRncm91cF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeU9wdGlvbk1vZHVsZSB7fVxuXG5leHBvcnQgKiBmcm9tICcuL29wdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL29wdGdyb3VwJztcblxuZXhwb3J0IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTUFUX09QVEdST1VQYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jb3JlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIE1BVF9PUFRHUk9VUCBhcyBNQVRfTEVHQUNZX09QVEdST1VQLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgYXMgTWF0TGVnYWN5T3B0aW9uU2VsZWN0aW9uQ2hhbmdlLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE9wdGlvblBhcmVudENvbXBvbmVudGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNYXRPcHRpb25QYXJlbnRDb21wb25lbnQgYXMgTWF0TGVnYWN5T3B0aW9uUGFyZW50Q29tcG9uZW50LFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQgYXMgTUFUX0xFR0FDWV9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCxcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbiBhcyBfY291bnRHcm91cExhYmVsc0JlZm9yZUxlZ2FjeU9wdGlvbixcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb25gIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NvcmVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uIGFzIF9nZXRMZWdhY3lPcHRpb25TY3JvbGxQb3NpdGlvbixcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBfTWF0T3B0aW9uQmFzZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBfTWF0T3B0aW9uQmFzZSBhcyBfTWF0TGVnYWN5T3B0aW9uQmFzZSxcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBfTWF0T3B0Z3JvdXBCYXNlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jb3JlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIF9NYXRPcHRncm91cEJhc2UgYXMgX01hdExlZ2FjeU9wdGdyb3VwQmFzZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG4iXX0=