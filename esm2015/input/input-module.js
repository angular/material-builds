/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTextareaAutosize } from './autosize';
import { MatInput } from './input';
let MatInputModule = /** @class */ (() => {
    let MatInputModule = class MatInputModule {
    };
    MatInputModule = __decorate([
        NgModule({
            declarations: [MatInput, MatTextareaAutosize],
            imports: [
                TextFieldModule,
                MatFormFieldModule,
            ],
            exports: [
                TextFieldModule,
                // We re-export the `MatFormFieldModule` since `MatInput` will almost always
                // be used together with `MatFormField`.
                MatFormFieldModule,
                MatInput,
                MatTextareaAutosize,
            ],
            providers: [ErrorStateMatcher],
        })
    ], MatInputModule);
    return MatInputModule;
})();
export { MatInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L2lucHV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFrQmpDO0lBQUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztLQUFHLENBQUE7SUFBakIsY0FBYztRQWhCMUIsUUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO1lBQzdDLE9BQU8sRUFBRTtnQkFDUCxlQUFlO2dCQUNmLGtCQUFrQjthQUNuQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxlQUFlO2dCQUNmLDRFQUE0RTtnQkFDNUUsd0NBQXdDO2dCQUN4QyxrQkFBa0I7Z0JBQ2xCLFFBQVE7Z0JBQ1IsbUJBQW1CO2FBQ3BCO1lBQ0QsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7U0FDL0IsQ0FBQztPQUNXLGNBQWMsQ0FBRztJQUFELHFCQUFDO0tBQUE7U0FBakIsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RleHRGaWVsZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7TWF0VGV4dGFyZWFBdXRvc2l6ZX0gZnJvbSAnLi9hdXRvc2l6ZSc7XG5pbXBvcnQge01hdElucHV0fSBmcm9tICcuL2lucHV0JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbTWF0SW5wdXQsIE1hdFRleHRhcmVhQXV0b3NpemVdLFxuICBpbXBvcnRzOiBbXG4gICAgVGV4dEZpZWxkTW9kdWxlLFxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFRleHRGaWVsZE1vZHVsZSxcbiAgICAvLyBXZSByZS1leHBvcnQgdGhlIGBNYXRGb3JtRmllbGRNb2R1bGVgIHNpbmNlIGBNYXRJbnB1dGAgd2lsbCBhbG1vc3QgYWx3YXlzXG4gICAgLy8gYmUgdXNlZCB0b2dldGhlciB3aXRoIGBNYXRGb3JtRmllbGRgLlxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgICBNYXRJbnB1dCxcbiAgICBNYXRUZXh0YXJlYUF1dG9zaXplLFxuICBdLFxuICBwcm92aWRlcnM6IFtFcnJvclN0YXRlTWF0Y2hlcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdElucHV0TW9kdWxlIHt9XG4iXX0=