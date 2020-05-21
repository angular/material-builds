import { __decorate } from "tslib";
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
let MatProgressSpinnerModule = /** @class */ (() => {
    let MatProgressSpinnerModule = class MatProgressSpinnerModule {
    };
    MatProgressSpinnerModule = __decorate([
        NgModule({
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
        })
    ], MatProgressSpinnerModule);
    return MatProgressSpinnerModule;
})();
export { MatProgressSpinnerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQWVsRTtJQUFBLElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0tBQUcsQ0FBQTtJQUEzQix3QkFBd0I7UUFacEMsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQztZQUN4QyxPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCO2dCQUNsQixVQUFVO2dCQUNWLGVBQWU7YUFDaEI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osa0JBQWtCO2dCQUNsQixVQUFVO2FBQ1g7U0FDRixDQUFDO09BQ1csd0JBQXdCLENBQUc7SUFBRCwrQkFBQztLQUFBO1NBQTNCLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0UHJvZ3Jlc3NTcGlubmVyLCBNYXRTcGlubmVyfSBmcm9tICcuL3Byb2dyZXNzLXNwaW5uZXInO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRQcm9ncmVzc1NwaW5uZXIsXG4gICAgTWF0U3Bpbm5lcixcbiAgICBNYXRDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0UHJvZ3Jlc3NTcGlubmVyLFxuICAgIE1hdFNwaW5uZXJcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlIHt9XG4iXX0=