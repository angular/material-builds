/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatProgressSpinner, MatSpinner } from './progress-spinner';
var MatProgressSpinnerModule = /** @class */ (function () {
    function MatProgressSpinnerModule() {
    }
    MatProgressSpinnerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule, CommonModule],
                    exports: [
                        MatProgressSpinner,
                        MatSpinner,
                        MatCommonModule
                    ],
                    declarations: [
                        MatProgressSpinner,
                        MatSpinner
                    ],
                },] }
    ];
    return MatProgressSpinnerModule;
}());
export { MatProgressSpinnerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFVBQVUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR2xFO0lBQUE7SUFZZ0MsQ0FBQzs7Z0JBWmhDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDO29CQUN4QyxPQUFPLEVBQUU7d0JBQ1Asa0JBQWtCO3dCQUNsQixVQUFVO3dCQUNWLGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRTt3QkFDWixrQkFBa0I7d0JBQ2xCLFVBQVU7cUJBQ1g7aUJBQ0Y7O0lBQytCLCtCQUFDO0NBQUEsQUFaakMsSUFZaUM7QUFFakMsT0FBTyxFQUFDLHdCQUF3QixFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdFByb2dyZXNzU3Bpbm5lciwgTWF0U3Bpbm5lcn0gZnJvbSAnLi9wcm9ncmVzcy1zcGlubmVyJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0UHJvZ3Jlc3NTcGlubmVyLFxuICAgIE1hdFNwaW5uZXIsXG4gICAgTWF0Q29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdFByb2dyZXNzU3Bpbm5lcixcbiAgICBNYXRTcGlubmVyXG4gIF0sXG59KVxuY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlIHt9XG5cbmV4cG9ydCB7TWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlfTtcbiJdfQ==