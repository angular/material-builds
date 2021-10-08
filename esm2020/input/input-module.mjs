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
MatInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatInputModule, declarations: [MatInput], imports: [TextFieldModule,
        MatFormFieldModule,
        MatCommonModule], exports: [TextFieldModule,
        // We re-export the `MatFormFieldModule` since `MatInput` will almost always
        // be used together with `MatFormField`.
        MatFormFieldModule,
        MatInput] });
MatInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatInputModule, providers: [ErrorStateMatcher], imports: [[
            TextFieldModule,
            MatFormFieldModule,
            MatCommonModule,
        ], TextFieldModule,
        // We re-export the `MatFormFieldModule` since `MatInput` will almost always
        // be used together with `MatFormField`.
        MatFormFieldModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatInputModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MatInput],
                    imports: [
                        TextFieldModule,
                        MatFormFieldModule,
                        MatCommonModule,
                    ],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L2lucHV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7QUFrQmpDLE1BQU0sT0FBTyxjQUFjOzttSEFBZCxjQUFjO29IQUFkLGNBQWMsaUJBZlYsUUFBUSxhQUVyQixlQUFlO1FBQ2Ysa0JBQWtCO1FBQ2xCLGVBQWUsYUFHZixlQUFlO1FBQ2YsNEVBQTRFO1FBQzVFLHdDQUF3QztRQUN4QyxrQkFBa0I7UUFDbEIsUUFBUTtvSEFJQyxjQUFjLGFBRmQsQ0FBQyxpQkFBaUIsQ0FBQyxZQVpyQjtZQUNQLGVBQWU7WUFDZixrQkFBa0I7WUFDbEIsZUFBZTtTQUNoQixFQUVDLGVBQWU7UUFDZiw0RUFBNEU7UUFDNUUsd0NBQXdDO1FBQ3hDLGtCQUFrQjttR0FLVCxjQUFjO2tCQWhCMUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ3hCLE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLGtCQUFrQjt3QkFDbEIsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2YsNEVBQTRFO3dCQUM1RSx3Q0FBd0M7d0JBQ3hDLGtCQUFrQjt3QkFDbEIsUUFBUTtxQkFDVDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZXh0RmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtFcnJvclN0YXRlTWF0Y2hlciwgTWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7TWF0SW5wdXR9IGZyb20gJy4vaW5wdXQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtNYXRJbnB1dF0sXG4gIGltcG9ydHM6IFtcbiAgICBUZXh0RmllbGRNb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFRleHRGaWVsZE1vZHVsZSxcbiAgICAvLyBXZSByZS1leHBvcnQgdGhlIGBNYXRGb3JtRmllbGRNb2R1bGVgIHNpbmNlIGBNYXRJbnB1dGAgd2lsbCBhbG1vc3QgYWx3YXlzXG4gICAgLy8gYmUgdXNlZCB0b2dldGhlciB3aXRoIGBNYXRGb3JtRmllbGRgLlxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgICBNYXRJbnB1dCxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbRXJyb3JTdGF0ZU1hdGNoZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJbnB1dE1vZHVsZSB7fVxuIl19