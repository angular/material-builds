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
MatProgressSpinnerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatProgressSpinnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatProgressSpinnerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatProgressSpinnerModule, declarations: [MatProgressSpinner, MatSpinner], imports: [MatCommonModule, CommonModule], exports: [MatProgressSpinner, MatSpinner, MatCommonModule] });
MatProgressSpinnerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatProgressSpinnerModule, imports: [[MatCommonModule, CommonModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatProgressSpinnerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, CommonModule],
                    exports: [MatProgressSpinner, MatSpinner, MatCommonModule],
                    declarations: [MatProgressSpinner, MatSpinner],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFVBQVUsRUFBQyxNQUFNLG9CQUFvQixDQUFDOztBQU9sRSxNQUFNLE9BQU8sd0JBQXdCOztxSEFBeEIsd0JBQXdCO3NIQUF4Qix3QkFBd0IsaUJBRnBCLGtCQUFrQixFQUFFLFVBQVUsYUFGbkMsZUFBZSxFQUFFLFlBQVksYUFDN0Isa0JBQWtCLEVBQUUsVUFBVSxFQUFFLGVBQWU7c0hBRzlDLHdCQUF3QixZQUoxQixDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsRUFDRSxlQUFlOzJGQUc5Qyx3QkFBd0I7a0JBTHBDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQztvQkFDeEMsT0FBTyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQztvQkFDMUQsWUFBWSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO2lCQUMvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0UHJvZ3Jlc3NTcGlubmVyLCBNYXRTcGlubmVyfSBmcm9tICcuL3Byb2dyZXNzLXNwaW5uZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0UHJvZ3Jlc3NTcGlubmVyLCBNYXRTcGlubmVyLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRQcm9ncmVzc1NwaW5uZXIsIE1hdFNwaW5uZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUge31cbiJdfQ==