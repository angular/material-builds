/**
 * @fileoverview added by tsickle
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
import { CommonModule } from '@angular/common';
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
                    CommonModule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L2lucHV0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQW9CakMsTUFBTSxPQUFPLGNBQWM7OztZQWpCMUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztnQkFDN0MsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixrQkFBa0I7aUJBQ25CO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxlQUFlO29CQUNmLDRFQUE0RTtvQkFDNUUsd0NBQXdDO29CQUN4QyxrQkFBa0I7b0JBQ2xCLFFBQVE7b0JBQ1IsbUJBQW1CO2lCQUNwQjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQzthQUMvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RleHRGaWVsZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtNYXRUZXh0YXJlYUF1dG9zaXplfSBmcm9tICcuL2F1dG9zaXplJztcbmltcG9ydCB7TWF0SW5wdXR9IGZyb20gJy4vaW5wdXQnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW01hdElucHV0LCBNYXRUZXh0YXJlYUF1dG9zaXplXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBUZXh0RmllbGRNb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgVGV4dEZpZWxkTW9kdWxlLFxuICAgIC8vIFdlIHJlLWV4cG9ydCB0aGUgYE1hdEZvcm1GaWVsZE1vZHVsZWAgc2luY2UgYE1hdElucHV0YCB3aWxsIGFsbW9zdCBhbHdheXNcbiAgICAvLyBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggYE1hdEZvcm1GaWVsZGAuXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdElucHV0LFxuICAgIE1hdFRleHRhcmVhQXV0b3NpemUsXG4gIF0sXG4gIHByb3ZpZGVyczogW0Vycm9yU3RhdGVNYXRjaGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5wdXRNb2R1bGUge31cbiJdfQ==