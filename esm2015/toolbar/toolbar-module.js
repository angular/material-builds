/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatToolbar, MatToolbarRow } from './toolbar';
let MatToolbarModule = /** @class */ (() => {
    let MatToolbarModule = class MatToolbarModule {
    };
    MatToolbarModule = __decorate([
        NgModule({
            imports: [MatCommonModule],
            exports: [MatToolbar, MatToolbarRow, MatCommonModule],
            declarations: [MatToolbar, MatToolbarRow],
        })
    ], MatToolbarModule);
    return MatToolbarModule;
})();
export { MatToolbarModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbGJhci90b29sYmFyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFRcEQ7SUFBQSxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtLQUFHLENBQUE7SUFBbkIsZ0JBQWdCO1FBTDVCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUMxQixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQztZQUNyRCxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDO1NBQzFDLENBQUM7T0FDVyxnQkFBZ0IsQ0FBRztJQUFELHVCQUFDO0tBQUE7U0FBbkIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRUb29sYmFyLCBNYXRUb29sYmFyUm93fSBmcm9tICcuL3Rvb2xiYXInO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0VG9vbGJhciwgTWF0VG9vbGJhclJvdywgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0VG9vbGJhciwgTWF0VG9vbGJhclJvd10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2xiYXJNb2R1bGUge31cbiJdfQ==