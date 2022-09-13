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
export class MatLegacyOptionModule {
}
MatLegacyOptionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatLegacyOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatLegacyOptionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatLegacyOptionModule, declarations: [MatLegacyOption, MatLegacyOptgroup], imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule], exports: [MatLegacyOption, MatLegacyOptgroup] });
MatLegacyOptionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatLegacyOptionModule, imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatLegacyOptionModule, decorators: [{
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
MAT_OPTGROUP, 
/**
 * @deprecated Use `MatOptionSelectionChange` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MatOptionSelectionChange, 
/**
 * @deprecated Use `MAT_OPTION_PARENT_COMPONENT` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_OPTION_PARENT_COMPONENT, 
/**
 * @deprecated Use `_countGroupLabelsBeforeOption` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_countGroupLabelsBeforeOption, 
/**
 * @deprecated Use `_getOptionScrollPosition` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_getOptionScrollPosition, 
/**
 * @deprecated Use `_MatOptionBase` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_MatOptionBase, 
/**
 * @deprecated Use `_MatOptgroupBase` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
_MatOptgroupBase, } from '@angular/material/core';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWNvcmUvb3B0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUUsdUJBQXVCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakcsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7O0FBRTdDOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxxQkFBcUI7O3lIQUFyQixxQkFBcUI7MEhBQXJCLHFCQUFxQixpQkFGakIsZUFBZSxFQUFFLGlCQUFpQixhQUZ2QyxlQUFlLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsYUFDdkUsZUFBZSxFQUFFLGlCQUFpQjswSEFHakMscUJBQXFCLFlBSnRCLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLHVCQUF1QjtrR0FJdEUscUJBQXFCO2tCQUxqQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixDQUFDO29CQUNsRixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUM7b0JBQzdDLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQztpQkFDbkQ7O0FBR0QsY0FBYyxVQUFVLENBQUM7QUFDekIsY0FBYyxZQUFZLENBQUM7QUFFM0IsT0FBTztBQUNMOzs7R0FHRztBQUNILFlBQVk7QUFFWjs7O0dBR0c7QUFDSCx3QkFBd0I7QUFReEI7OztHQUdHO0FBQ0gsMkJBQTJCO0FBRTNCOzs7R0FHRztBQUNILDZCQUE2QjtBQUU3Qjs7O0dBR0c7QUFDSCx3QkFBd0I7QUFFeEI7OztHQUdHO0FBQ0gsY0FBYztBQUVkOzs7R0FHRztBQUNILGdCQUFnQixHQUNqQixNQUFNLHdCQUF3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01hdFJpcHBsZU1vZHVsZSwgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdExlZ2FjeU9wdGlvbn0gZnJvbSAnLi9vcHRpb24nO1xuaW1wb3J0IHtNYXRMZWdhY3lPcHRncm91cH0gZnJvbSAnLi9vcHRncm91cCc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRPcHRpb25Nb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NvcmVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFJpcHBsZU1vZHVsZSwgQ29tbW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlXSxcbiAgZXhwb3J0czogW01hdExlZ2FjeU9wdGlvbiwgTWF0TGVnYWN5T3B0Z3JvdXBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRMZWdhY3lPcHRpb24sIE1hdExlZ2FjeU9wdGdyb3VwXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5T3B0aW9uTW9kdWxlIHt9XG5cbmV4cG9ydCAqIGZyb20gJy4vb3B0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vb3B0Z3JvdXAnO1xuXG5leHBvcnQge1xuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBNQVRfT1BUR1JPVVBgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NvcmVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgTUFUX09QVEdST1VQLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTWF0T3B0aW9uUGFyZW50Q29tcG9uZW50YCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jb3JlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIE1hdE9wdGlvblBhcmVudENvbXBvbmVudCxcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlRgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NvcmVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jb3JlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgX01hdE9wdGlvbkJhc2VgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NvcmVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgX01hdE9wdGlvbkJhc2UsXG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgX01hdE9wdGdyb3VwQmFzZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBfTWF0T3B0Z3JvdXBCYXNlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbiJdfQ==