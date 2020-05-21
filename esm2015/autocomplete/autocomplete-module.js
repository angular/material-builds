/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatOptionModule, MatCommonModule } from '@angular/material/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatAutocomplete } from './autocomplete';
import { MatAutocompleteTrigger, MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './autocomplete-trigger';
import { MatAutocompleteOrigin } from './autocomplete-origin';
let MatAutocompleteModule = /** @class */ (() => {
    let MatAutocompleteModule = class MatAutocompleteModule {
    };
    MatAutocompleteModule = __decorate([
        NgModule({
            imports: [MatOptionModule, OverlayModule, MatCommonModule, CommonModule],
            exports: [
                CdkScrollableModule,
                MatAutocomplete,
                MatOptionModule,
                MatAutocompleteTrigger,
                MatAutocompleteOrigin,
                MatCommonModule
            ],
            declarations: [MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteOrigin],
            providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
        })
    ], MatAutocompleteModule);
    return MatAutocompleteModule;
})();
export { MatAutocompleteModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsaURBQWlELEdBQ2xELE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFlNUQ7SUFBQSxJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtLQUFHLENBQUE7SUFBeEIscUJBQXFCO1FBYmpDLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQztZQUN4RSxPQUFPLEVBQUU7Z0JBQ1AsbUJBQW1CO2dCQUNuQixlQUFlO2dCQUNmLGVBQWU7Z0JBQ2Ysc0JBQXNCO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLGVBQWU7YUFDaEI7WUFDRCxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCLENBQUM7WUFDOUUsU0FBUyxFQUFFLENBQUMsaURBQWlELENBQUM7U0FDL0QsQ0FBQztPQUNXLHFCQUFxQixDQUFHO0lBQUQsNEJBQUM7S0FBQTtTQUF4QixxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtNYXRPcHRpb25Nb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtNYXRBdXRvY29tcGxldGV9IGZyb20gJy4vYXV0b2NvbXBsZXRlJztcbmltcG9ydCB7XG4gIE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIsXG4gIE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG59IGZyb20gJy4vYXV0b2NvbXBsZXRlLXRyaWdnZXInO1xuaW1wb3J0IHtNYXRBdXRvY29tcGxldGVPcmlnaW59IGZyb20gJy4vYXV0b2NvbXBsZXRlLW9yaWdpbic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRPcHRpb25Nb2R1bGUsIE92ZXJsYXlNb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgQ29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgTWF0QXV0b2NvbXBsZXRlLFxuICAgIE1hdE9wdGlvbk1vZHVsZSxcbiAgICBNYXRBdXRvY29tcGxldGVUcmlnZ2VyLFxuICAgIE1hdEF1dG9jb21wbGV0ZU9yaWdpbixcbiAgICBNYXRDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0QXV0b2NvbXBsZXRlLCBNYXRBdXRvY29tcGxldGVUcmlnZ2VyLCBNYXRBdXRvY29tcGxldGVPcmlnaW5dLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlTW9kdWxlIHt9XG4iXX0=