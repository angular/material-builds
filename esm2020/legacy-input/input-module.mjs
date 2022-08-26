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
export class MatLegacyInputModule {
}
MatLegacyInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatLegacyInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyInputModule, declarations: [MatLegacyInput], imports: [TextFieldModule, MatLegacyFormFieldModule, MatCommonModule], exports: [TextFieldModule,
        // We re-export the `MatLegacyFormFieldModule` since `MatLegacyInput` will almost always
        // be used together with `MatLegacyFormField`.
        MatLegacyFormFieldModule,
        MatLegacyInput] });
MatLegacyInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyInputModule, providers: [ErrorStateMatcher], imports: [TextFieldModule, MatLegacyFormFieldModule, MatCommonModule, TextFieldModule,
        // We re-export the `MatLegacyFormFieldModule` since `MatLegacyInput` will almost always
        // be used together with `MatLegacyFormField`.
        MatLegacyFormFieldModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyInputModule, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1pbnB1dC9pbnB1dC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQzdFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7O0FBY3ZDLE1BQU0sT0FBTyxvQkFBb0I7O2lIQUFwQixvQkFBb0I7a0hBQXBCLG9CQUFvQixpQkFYaEIsY0FBYyxhQUNuQixlQUFlLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxhQUVsRSxlQUFlO1FBQ2Ysd0ZBQXdGO1FBQ3hGLDhDQUE4QztRQUM5Qyx3QkFBd0I7UUFDeEIsY0FBYztrSEFJTCxvQkFBb0IsYUFGcEIsQ0FBQyxpQkFBaUIsQ0FBQyxZQVJwQixlQUFlLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxFQUVsRSxlQUFlO1FBQ2Ysd0ZBQXdGO1FBQ3hGLDhDQUE4QztRQUM5Qyx3QkFBd0I7MkZBS2Ysb0JBQW9CO2tCQVpoQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDOUIsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLHdCQUF3QixFQUFFLGVBQWUsQ0FBQztvQkFDckUsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2Ysd0ZBQXdGO3dCQUN4Riw4Q0FBOEM7d0JBQzlDLHdCQUF3Qjt3QkFDeEIsY0FBYztxQkFDZjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZXh0RmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtFcnJvclN0YXRlTWF0Y2hlciwgTWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0TGVnYWN5Rm9ybUZpZWxkTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9sZWdhY3ktZm9ybS1maWVsZCc7XG5pbXBvcnQge01hdExlZ2FjeUlucHV0fSBmcm9tICcuL2lucHV0JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5SW5wdXRdLFxuICBpbXBvcnRzOiBbVGV4dEZpZWxkTW9kdWxlLCBNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBUZXh0RmllbGRNb2R1bGUsXG4gICAgLy8gV2UgcmUtZXhwb3J0IHRoZSBgTWF0TGVnYWN5Rm9ybUZpZWxkTW9kdWxlYCBzaW5jZSBgTWF0TGVnYWN5SW5wdXRgIHdpbGwgYWxtb3N0IGFsd2F5c1xuICAgIC8vIGJlIHVzZWQgdG9nZXRoZXIgd2l0aCBgTWF0TGVnYWN5Rm9ybUZpZWxkYC5cbiAgICBNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0TGVnYWN5SW5wdXQsXG4gIF0sXG4gIHByb3ZpZGVyczogW0Vycm9yU3RhdGVNYXRjaGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5SW5wdXRNb2R1bGUge31cbiJdfQ==