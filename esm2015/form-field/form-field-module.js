/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatError } from './error';
import { MatFormField } from './form-field';
import { MatHint } from './hint';
import { MatLabel } from './label';
import { MatPlaceholder } from './placeholder';
import { MatPrefix } from './prefix';
import { MatSuffix } from './suffix';
let MatFormFieldModule = /** @class */ (() => {
    let MatFormFieldModule = class MatFormFieldModule {
    };
    MatFormFieldModule = __decorate([
        NgModule({
            declarations: [
                MatError,
                MatFormField,
                MatHint,
                MatLabel,
                MatPlaceholder,
                MatPrefix,
                MatSuffix,
            ],
            imports: [
                CommonModule,
                MatCommonModule,
                ObserversModule,
            ],
            exports: [
                MatCommonModule,
                MatError,
                MatFormField,
                MatHint,
                MatLabel,
                MatPlaceholder,
                MatPrefix,
                MatSuffix,
            ],
        })
    ], MatFormFieldModule);
    return MatFormFieldModule;
})();
export { MatFormFieldModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9mb3JtLWZpZWxkLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBNEJuQztJQUFBLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0tBQUcsQ0FBQTtJQUFyQixrQkFBa0I7UUExQjlCLFFBQVEsQ0FBQztZQUNSLFlBQVksRUFBRTtnQkFDWixRQUFRO2dCQUNSLFlBQVk7Z0JBQ1osT0FBTztnQkFDUCxRQUFRO2dCQUNSLGNBQWM7Z0JBQ2QsU0FBUztnQkFDVCxTQUFTO2FBQ1Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWTtnQkFDWixlQUFlO2dCQUNmLGVBQWU7YUFDaEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsZUFBZTtnQkFDZixRQUFRO2dCQUNSLFlBQVk7Z0JBQ1osT0FBTztnQkFDUCxRQUFRO2dCQUNSLGNBQWM7Z0JBQ2QsU0FBUztnQkFDVCxTQUFTO2FBQ1Y7U0FDRixDQUFDO09BQ1csa0JBQWtCLENBQUc7SUFBRCx5QkFBQztLQUFBO1NBQXJCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge01hdEZvcm1GaWVsZH0gZnJvbSAnLi9mb3JtLWZpZWxkJztcbmltcG9ydCB7TWF0SGludH0gZnJvbSAnLi9oaW50JztcbmltcG9ydCB7TWF0TGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtNYXRQbGFjZWhvbGRlcn0gZnJvbSAnLi9wbGFjZWhvbGRlcic7XG5pbXBvcnQge01hdFByZWZpeH0gZnJvbSAnLi9wcmVmaXgnO1xuaW1wb3J0IHtNYXRTdWZmaXh9IGZyb20gJy4vc3VmZml4JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0RXJyb3IsXG4gICAgTWF0Rm9ybUZpZWxkLFxuICAgIE1hdEhpbnQsXG4gICAgTWF0TGFiZWwsXG4gICAgTWF0UGxhY2Vob2xkZXIsXG4gICAgTWF0UHJlZml4LFxuICAgIE1hdFN1ZmZpeCxcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdEVycm9yLFxuICAgIE1hdEZvcm1GaWVsZCxcbiAgICBNYXRIaW50LFxuICAgIE1hdExhYmVsLFxuICAgIE1hdFBsYWNlaG9sZGVyLFxuICAgIE1hdFByZWZpeCxcbiAgICBNYXRTdWZmaXgsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZE1vZHVsZSB7fVxuIl19