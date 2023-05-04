/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatLegacyError } from './error';
import { MatLegacyFormField } from './form-field';
import { MatLegacyHint } from './hint';
import { MatLegacyLabel } from './label';
import { MatLegacyPlaceholder } from './placeholder';
import { MatLegacyPrefix } from './prefix';
import { MatLegacySuffix } from './suffix';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatFormFieldModule` from `@angular/material/form-field` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyFormFieldModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyFormFieldModule, declarations: [MatLegacyError,
            MatLegacyFormField,
            MatLegacyHint,
            MatLegacyLabel,
            MatLegacyPlaceholder,
            MatLegacyPrefix,
            MatLegacySuffix], imports: [CommonModule, MatCommonModule, ObserversModule], exports: [MatCommonModule,
            MatLegacyError,
            MatLegacyFormField,
            MatLegacyHint,
            MatLegacyLabel,
            MatLegacyPlaceholder,
            MatLegacyPrefix,
            MatLegacySuffix] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyFormFieldModule, imports: [CommonModule, MatCommonModule, ObserversModule, MatCommonModule] }); }
}
export { MatLegacyFormFieldModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyFormFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MatLegacyError,
                        MatLegacyFormField,
                        MatLegacyHint,
                        MatLegacyLabel,
                        MatLegacyPlaceholder,
                        MatLegacyPrefix,
                        MatLegacySuffix,
                    ],
                    imports: [CommonModule, MatCommonModule, ObserversModule],
                    exports: [
                        MatCommonModule,
                        MatLegacyError,
                        MatLegacyFormField,
                        MatLegacyHint,
                        MatLegacyLabel,
                        MatLegacyPlaceholder,
                        MatLegacyPrefix,
                        MatLegacySuffix,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWZvcm0tZmllbGQvZm9ybS1maWVsZC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDdkMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFekM7OztHQUdHO0FBQ0gsTUFzQmEsd0JBQXdCOzhHQUF4Qix3QkFBd0I7K0dBQXhCLHdCQUF3QixpQkFwQmpDLGNBQWM7WUFDZCxrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLGNBQWM7WUFDZCxvQkFBb0I7WUFDcEIsZUFBZTtZQUNmLGVBQWUsYUFFUCxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsYUFFdEQsZUFBZTtZQUNmLGNBQWM7WUFDZCxrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLGNBQWM7WUFDZCxvQkFBb0I7WUFDcEIsZUFBZTtZQUNmLGVBQWU7K0dBR04sd0JBQXdCLFlBWnpCLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUV0RCxlQUFlOztTQVVOLHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQXRCcEMsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osY0FBYzt3QkFDZCxrQkFBa0I7d0JBQ2xCLGFBQWE7d0JBQ2IsY0FBYzt3QkFDZCxvQkFBb0I7d0JBQ3BCLGVBQWU7d0JBQ2YsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQ3pELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLGNBQWM7d0JBQ2Qsa0JBQWtCO3dCQUNsQixhQUFhO3dCQUNiLGNBQWM7d0JBQ2Qsb0JBQW9CO3dCQUNwQixlQUFlO3dCQUNmLGVBQWU7cUJBQ2hCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdExlZ2FjeUVycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7TWF0TGVnYWN5Rm9ybUZpZWxkfSBmcm9tICcuL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtNYXRMZWdhY3lIaW50fSBmcm9tICcuL2hpbnQnO1xuaW1wb3J0IHtNYXRMZWdhY3lMYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge01hdExlZ2FjeVBsYWNlaG9sZGVyfSBmcm9tICcuL3BsYWNlaG9sZGVyJztcbmltcG9ydCB7TWF0TGVnYWN5UHJlZml4fSBmcm9tICcuL3ByZWZpeCc7XG5pbXBvcnQge01hdExlZ2FjeVN1ZmZpeH0gZnJvbSAnLi9zdWZmaXgnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Rm9ybUZpZWxkTW9kdWxlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdExlZ2FjeUVycm9yLFxuICAgIE1hdExlZ2FjeUZvcm1GaWVsZCxcbiAgICBNYXRMZWdhY3lIaW50LFxuICAgIE1hdExlZ2FjeUxhYmVsLFxuICAgIE1hdExlZ2FjeVBsYWNlaG9sZGVyLFxuICAgIE1hdExlZ2FjeVByZWZpeCxcbiAgICBNYXRMZWdhY3lTdWZmaXgsXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgT2JzZXJ2ZXJzTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRMZWdhY3lFcnJvcixcbiAgICBNYXRMZWdhY3lGb3JtRmllbGQsXG4gICAgTWF0TGVnYWN5SGludCxcbiAgICBNYXRMZWdhY3lMYWJlbCxcbiAgICBNYXRMZWdhY3lQbGFjZWhvbGRlcixcbiAgICBNYXRMZWdhY3lQcmVmaXgsXG4gICAgTWF0TGVnYWN5U3VmZml4LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGUge31cbiJdfQ==