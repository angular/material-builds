/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { SimpleSnackBar } from './simple-snack-bar';
import { MatSnackBarContainer } from './snack-bar-container';
let MatSnackBarModule = /** @class */ (() => {
    class MatSnackBarModule {
    }
    MatSnackBarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        OverlayModule,
                        PortalModule,
                        CommonModule,
                        MatButtonModule,
                        MatCommonModule,
                    ],
                    exports: [MatSnackBarContainer, MatCommonModule],
                    declarations: [MatSnackBarContainer, SimpleSnackBar],
                    entryComponents: [MatSnackBarContainer, SimpleSnackBar],
                },] }
    ];
    return MatSnackBarModule;
})();
export { MatSnackBarModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzNEO0lBQUEsTUFZYSxpQkFBaUI7OztnQkFaN0IsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxhQUFhO3dCQUNiLFlBQVk7d0JBQ1osWUFBWTt3QkFDWixlQUFlO3dCQUNmLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLGVBQWUsQ0FBQztvQkFDaEQsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDO29CQUNwRCxlQUFlLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLENBQUM7aUJBQ3hEOztJQUMrQix3QkFBQztLQUFBO1NBQXBCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7U2ltcGxlU25hY2tCYXJ9IGZyb20gJy4vc2ltcGxlLXNuYWNrLWJhcic7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29udGFpbmVyfSBmcm9tICcuL3NuYWNrLWJhci1jb250YWluZXInO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW01hdFNuYWNrQmFyQ29udGFpbmVyLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRTbmFja0JhckNvbnRhaW5lciwgU2ltcGxlU25hY2tCYXJdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtNYXRTbmFja0JhckNvbnRhaW5lciwgU2ltcGxlU25hY2tCYXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhck1vZHVsZSB7fVxuIl19