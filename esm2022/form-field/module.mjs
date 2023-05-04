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
import { MatError } from './directives/error';
import { MatFormFieldFloatingLabel } from './directives/floating-label';
import { MatHint } from './directives/hint';
import { MatLabel } from './directives/label';
import { MatFormFieldLineRipple } from './directives/line-ripple';
import { MatFormFieldNotchedOutline } from './directives/notched-outline';
import { MatPrefix } from './directives/prefix';
import { MatSuffix } from './directives/suffix';
import { MatFormField } from './form-field';
import * as i0 from "@angular/core";
class MatFormFieldModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldModule, declarations: [MatFormField,
            MatLabel,
            MatError,
            MatHint,
            MatPrefix,
            MatSuffix,
            MatFormFieldFloatingLabel,
            MatFormFieldNotchedOutline,
            MatFormFieldLineRipple], imports: [MatCommonModule, CommonModule, ObserversModule], exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule, CommonModule, ObserversModule, MatCommonModule] }); }
}
export { MatFormFieldModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, CommonModule, ObserversModule],
                    exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatCommonModule],
                    declarations: [
                        MatFormField,
                        MatLabel,
                        MatError,
                        MatHint,
                        MatPrefix,
                        MatSuffix,
                        MatFormFieldFloatingLabel,
                        MatFormFieldNotchedOutline,
                        MatFormFieldLineRipple,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDOztBQUUxQyxNQWVhLGtCQUFrQjs4R0FBbEIsa0JBQWtCOytHQUFsQixrQkFBa0IsaUJBWDNCLFlBQVk7WUFDWixRQUFRO1lBQ1IsUUFBUTtZQUNSLE9BQU87WUFDUCxTQUFTO1lBQ1QsU0FBUztZQUNULHlCQUF5QjtZQUN6QiwwQkFBMEI7WUFDMUIsc0JBQXNCLGFBWGQsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLGFBQzlDLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWU7K0dBYS9FLGtCQUFrQixZQWRuQixlQUFlLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFDbUIsZUFBZTs7U0FhL0Usa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBZjlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3pELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQztvQkFDM0YsWUFBWSxFQUFFO3dCQUNaLFlBQVk7d0JBQ1osUUFBUTt3QkFDUixRQUFRO3dCQUNSLE9BQU87d0JBQ1AsU0FBUzt3QkFDVCxTQUFTO3dCQUNULHlCQUF5Qjt3QkFDekIsMEJBQTBCO3dCQUMxQixzQkFBc0I7cUJBQ3ZCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEVycm9yfSBmcm9tICcuL2RpcmVjdGl2ZXMvZXJyb3InO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRGbG9hdGluZ0xhYmVsfSBmcm9tICcuL2RpcmVjdGl2ZXMvZmxvYXRpbmctbGFiZWwnO1xuaW1wb3J0IHtNYXRIaW50fSBmcm9tICcuL2RpcmVjdGl2ZXMvaGludCc7XG5pbXBvcnQge01hdExhYmVsfSBmcm9tICcuL2RpcmVjdGl2ZXMvbGFiZWwnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRMaW5lUmlwcGxlfSBmcm9tICcuL2RpcmVjdGl2ZXMvbGluZS1yaXBwbGUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGROb3RjaGVkT3V0bGluZX0gZnJvbSAnLi9kaXJlY3RpdmVzL25vdGNoZWQtb3V0bGluZSc7XG5pbXBvcnQge01hdFByZWZpeH0gZnJvbSAnLi9kaXJlY3RpdmVzL3ByZWZpeCc7XG5pbXBvcnQge01hdFN1ZmZpeH0gZnJvbSAnLi9kaXJlY3RpdmVzL3N1ZmZpeCc7XG5pbXBvcnQge01hdEZvcm1GaWVsZH0gZnJvbSAnLi9mb3JtLWZpZWxkJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZSwgQ29tbW9uTW9kdWxlLCBPYnNlcnZlcnNNb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0Rm9ybUZpZWxkLCBNYXRMYWJlbCwgTWF0SGludCwgTWF0RXJyb3IsIE1hdFByZWZpeCwgTWF0U3VmZml4LCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRGb3JtRmllbGQsXG4gICAgTWF0TGFiZWwsXG4gICAgTWF0RXJyb3IsXG4gICAgTWF0SGludCxcbiAgICBNYXRQcmVmaXgsXG4gICAgTWF0U3VmZml4LFxuICAgIE1hdEZvcm1GaWVsZEZsb2F0aW5nTGFiZWwsXG4gICAgTWF0Rm9ybUZpZWxkTm90Y2hlZE91dGxpbmUsXG4gICAgTWF0Rm9ybUZpZWxkTGluZVJpcHBsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9ybUZpZWxkTW9kdWxlIHt9XG4iXX0=