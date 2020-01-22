/**
 * @fileoverview added by tsickle
 * Generated from: src/material/input/input-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTextareaAutosize } from './autosize';
import { MatInput } from './input';
export class MatInputModule {
}
MatInputModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L2lucHV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQWtCakMsTUFBTSxPQUFPLGNBQWM7OztZQWhCMUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztnQkFDN0MsT0FBTyxFQUFFO29CQUNQLGVBQWU7b0JBQ2Ysa0JBQWtCO2lCQUNuQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZTtvQkFDZiw0RUFBNEU7b0JBQzVFLHdDQUF3QztvQkFDeEMsa0JBQWtCO29CQUNsQixRQUFRO29CQUNSLG1CQUFtQjtpQkFDcEI7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZXh0RmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtFcnJvclN0YXRlTWF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge01hdFRleHRhcmVhQXV0b3NpemV9IGZyb20gJy4vYXV0b3NpemUnO1xuaW1wb3J0IHtNYXRJbnB1dH0gZnJvbSAnLi9pbnB1dCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW01hdElucHV0LCBNYXRUZXh0YXJlYUF1dG9zaXplXSxcbiAgaW1wb3J0czogW1xuICAgIFRleHRGaWVsZE1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBUZXh0RmllbGRNb2R1bGUsXG4gICAgLy8gV2UgcmUtZXhwb3J0IHRoZSBgTWF0Rm9ybUZpZWxkTW9kdWxlYCBzaW5jZSBgTWF0SW5wdXRgIHdpbGwgYWxtb3N0IGFsd2F5c1xuICAgIC8vIGJlIHVzZWQgdG9nZXRoZXIgd2l0aCBgTWF0Rm9ybUZpZWxkYC5cbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0SW5wdXQsXG4gICAgTWF0VGV4dGFyZWFBdXRvc2l6ZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbRXJyb3JTdGF0ZU1hdGNoZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJbnB1dE1vZHVsZSB7fVxuIl19