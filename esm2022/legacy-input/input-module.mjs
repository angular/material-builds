/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, MatCommonModule } from '@angular/material/core';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInput } from './input';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatInputModule` from `@angular/material/input` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyInputModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInputModule, declarations: [MatLegacyInput], imports: [TextFieldModule, MatLegacyFormFieldModule, MatCommonModule], exports: [TextFieldModule,
            // We re-export the `MatLegacyFormFieldModule` since `MatLegacyInput` will almost always
            // be used together with `MatLegacyFormField`.
            MatLegacyFormFieldModule,
            MatLegacyInput] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInputModule, providers: [ErrorStateMatcher], imports: [TextFieldModule, MatLegacyFormFieldModule, MatCommonModule, TextFieldModule,
            // We re-export the `MatLegacyFormFieldModule` since `MatLegacyInput` will almost always
            // be used together with `MatLegacyFormField`.
            MatLegacyFormFieldModule] }); }
}
export { MatLegacyInputModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInputModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MatLegacyInput],
                    imports: [TextFieldModule, MatLegacyFormFieldModule, MatCommonModule],
                    exports: [
                        TextFieldModule,
                        // We re-export the `MatLegacyFormFieldModule` since `MatLegacyInput` will almost always
                        // be used together with `MatLegacyFormField`.
                        MatLegacyFormFieldModule,
                        MatLegacyInput,
                    ],
                    providers: [ErrorStateMatcher],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1pbnB1dC9pbnB1dC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQzdFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7O0FBRXZDOzs7R0FHRztBQUNILE1BWWEsb0JBQW9COzhHQUFwQixvQkFBb0I7K0dBQXBCLG9CQUFvQixpQkFYaEIsY0FBYyxhQUNuQixlQUFlLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxhQUVsRSxlQUFlO1lBQ2Ysd0ZBQXdGO1lBQ3hGLDhDQUE4QztZQUM5Qyx3QkFBd0I7WUFDeEIsY0FBYzsrR0FJTCxvQkFBb0IsYUFGcEIsQ0FBQyxpQkFBaUIsQ0FBQyxZQVJwQixlQUFlLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxFQUVsRSxlQUFlO1lBQ2Ysd0ZBQXdGO1lBQ3hGLDhDQUE4QztZQUM5Qyx3QkFBd0I7O1NBS2Ysb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBWmhDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDO29CQUM5QixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxDQUFDO29CQUNyRSxPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZix3RkFBd0Y7d0JBQ3hGLDhDQUE4Qzt3QkFDOUMsd0JBQXdCO3dCQUN4QixjQUFjO3FCQUNmO29CQUNELFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2lCQUMvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RleHRGaWVsZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyLCBNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1mb3JtLWZpZWxkJztcbmltcG9ydCB7TWF0TGVnYWN5SW5wdXR9IGZyb20gJy4vaW5wdXQnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0SW5wdXRNb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2lucHV0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW01hdExlZ2FjeUlucHV0XSxcbiAgaW1wb3J0czogW1RleHRGaWVsZE1vZHVsZSwgTWF0TGVnYWN5Rm9ybUZpZWxkTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgVGV4dEZpZWxkTW9kdWxlLFxuICAgIC8vIFdlIHJlLWV4cG9ydCB0aGUgYE1hdExlZ2FjeUZvcm1GaWVsZE1vZHVsZWAgc2luY2UgYE1hdExlZ2FjeUlucHV0YCB3aWxsIGFsbW9zdCBhbHdheXNcbiAgICAvLyBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggYE1hdExlZ2FjeUZvcm1GaWVsZGAuXG4gICAgTWF0TGVnYWN5Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdExlZ2FjeUlucHV0LFxuICBdLFxuICBwcm92aWRlcnM6IFtFcnJvclN0YXRlTWF0Y2hlcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUlucHV0TW9kdWxlIHt9XG4iXX0=