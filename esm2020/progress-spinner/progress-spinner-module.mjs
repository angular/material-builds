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
import * as i0 from "@angular/core";
export class MatProgressSpinnerModule {
}
MatProgressSpinnerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatProgressSpinnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatProgressSpinnerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatProgressSpinnerModule, declarations: [MatProgressSpinner,
        MatSpinner], imports: [MatCommonModule, CommonModule], exports: [MatProgressSpinner,
        MatSpinner,
        MatCommonModule] });
MatProgressSpinnerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatProgressSpinnerModule, imports: [[MatCommonModule, CommonModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatProgressSpinnerModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFVBQVUsRUFBQyxNQUFNLG9CQUFvQixDQUFDOztBQWVsRSxNQUFNLE9BQU8sd0JBQXdCOzs2SEFBeEIsd0JBQXdCOzhIQUF4Qix3QkFBd0IsaUJBSmpDLGtCQUFrQjtRQUNsQixVQUFVLGFBUkYsZUFBZSxFQUFFLFlBQVksYUFFckMsa0JBQWtCO1FBQ2xCLFVBQVU7UUFDVixlQUFlOzhIQU9OLHdCQUF3QixZQVgxQixDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsRUFJdEMsZUFBZTttR0FPTix3QkFBd0I7a0JBWnBDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQztvQkFDeEMsT0FBTyxFQUFFO3dCQUNQLGtCQUFrQjt3QkFDbEIsVUFBVTt3QkFDVixlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osa0JBQWtCO3dCQUNsQixVQUFVO3FCQUNYO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRQcm9ncmVzc1NwaW5uZXIsIE1hdFNwaW5uZXJ9IGZyb20gJy4vcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZSwgQ29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdFByb2dyZXNzU3Bpbm5lcixcbiAgICBNYXRTcGlubmVyLFxuICAgIE1hdENvbW1vbk1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRQcm9ncmVzc1NwaW5uZXIsXG4gICAgTWF0U3Bpbm5lclxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUge31cbiJdfQ==