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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from './input';
import * as i0 from "@angular/core";
export class MatInputModule {
}
MatInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.0", ngImport: i0, type: MatInputModule, declarations: [MatInput], imports: [TextFieldModule, MatFormFieldModule, MatCommonModule], exports: [TextFieldModule,
        // We re-export the `MatFormFieldModule` since `MatInput` will almost always
        // be used together with `MatFormField`.
        MatFormFieldModule,
        MatInput] });
MatInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatInputModule, providers: [ErrorStateMatcher], imports: [TextFieldModule, MatFormFieldModule, MatCommonModule, TextFieldModule,
        // We re-export the `MatFormFieldModule` since `MatInput` will almost always
        // be used together with `MatFormField`.
        MatFormFieldModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatInputModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MatInput],
                    imports: [TextFieldModule, MatFormFieldModule, MatCommonModule],
                    exports: [
                        TextFieldModule,
                        // We re-export the `MatFormFieldModule` since `MatInput` will almost always
                        // be used together with `MatFormField`.
                        MatFormFieldModule,
                        MatInput,
                    ],
                    providers: [ErrorStateMatcher],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L2lucHV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7QUFjakMsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkFYVixRQUFRLGFBQ2IsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsYUFFNUQsZUFBZTtRQUNmLDRFQUE0RTtRQUM1RSx3Q0FBd0M7UUFDeEMsa0JBQWtCO1FBQ2xCLFFBQVE7NEdBSUMsY0FBYyxhQUZkLENBQUMsaUJBQWlCLENBQUMsWUFScEIsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFFNUQsZUFBZTtRQUNmLDRFQUE0RTtRQUM1RSx3Q0FBd0M7UUFDeEMsa0JBQWtCOzJGQUtULGNBQWM7a0JBWjFCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUN4QixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDO29CQUMvRCxPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZiw0RUFBNEU7d0JBQzVFLHdDQUF3Qzt3QkFDeEMsa0JBQWtCO3dCQUNsQixRQUFRO3FCQUNUO29CQUNELFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2lCQUMvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RleHRGaWVsZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyLCBNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtNYXRJbnB1dH0gZnJvbSAnLi9pbnB1dCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW01hdElucHV0XSxcbiAgaW1wb3J0czogW1RleHRGaWVsZE1vZHVsZSwgTWF0Rm9ybUZpZWxkTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgVGV4dEZpZWxkTW9kdWxlLFxuICAgIC8vIFdlIHJlLWV4cG9ydCB0aGUgYE1hdEZvcm1GaWVsZE1vZHVsZWAgc2luY2UgYE1hdElucHV0YCB3aWxsIGFsbW9zdCBhbHdheXNcbiAgICAvLyBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggYE1hdEZvcm1GaWVsZGAuXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdElucHV0LFxuICBdLFxuICBwcm92aWRlcnM6IFtFcnJvclN0YXRlTWF0Y2hlcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdElucHV0TW9kdWxlIHt9XG4iXX0=