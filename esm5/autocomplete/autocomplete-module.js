/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatOptionModule, MatCommonModule } from '@angular/material/core';
import { MatAutocomplete } from './autocomplete';
import { MatAutocompleteTrigger, MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './autocomplete-trigger';
import { MatAutocompleteOrigin } from './autocomplete-origin';
var MatAutocompleteModule = /** @class */ (function () {
    function MatAutocompleteModule() {
    }
    MatAutocompleteModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatOptionModule, OverlayModule, MatCommonModule, CommonModule],
                    exports: [
                        MatAutocomplete,
                        MatOptionModule,
                        MatAutocompleteTrigger,
                        MatAutocompleteOrigin,
                        MatCommonModule
                    ],
                    declarations: [MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteOrigin],
                    providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
                },] }
    ];
    return MatAutocompleteModule;
}());
export { MatAutocompleteModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixpREFBaUQsR0FDbEQsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU1RDtJQUFBO0lBWW9DLENBQUM7O2dCQVpwQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDO29CQUN4RSxPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixlQUFlO3dCQUNmLHNCQUFzQjt3QkFDdEIscUJBQXFCO3dCQUNyQixlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCLENBQUM7b0JBQzlFLFNBQVMsRUFBRSxDQUFDLGlEQUFpRCxDQUFDO2lCQUMvRDs7SUFDbUMsNEJBQUM7Q0FBQSxBQVpyQyxJQVlxQztTQUF4QixxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtNYXRPcHRpb25Nb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZX0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuaW1wb3J0IHtcbiAgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlcixcbiAgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtdHJpZ2dlcic7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZU9yaWdpbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdE9wdGlvbk1vZHVsZSwgT3ZlcmxheU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0QXV0b2NvbXBsZXRlLFxuICAgIE1hdE9wdGlvbk1vZHVsZSxcbiAgICBNYXRBdXRvY29tcGxldGVUcmlnZ2VyLFxuICAgIE1hdEF1dG9jb21wbGV0ZU9yaWdpbixcbiAgICBNYXRDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0QXV0b2NvbXBsZXRlLCBNYXRBdXRvY29tcGxldGVUcmlnZ2VyLCBNYXRBdXRvY29tcGxldGVPcmlnaW5dLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlTW9kdWxlIHt9XG4iXX0=