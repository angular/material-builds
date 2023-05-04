/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '../ripple/index';
import { MatPseudoCheckboxModule } from '../selection/index';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatOption } from './option';
import { MatOptgroup } from './optgroup';
import * as i0 from "@angular/core";
class MatOptionModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatOptionModule, declarations: [MatOption, MatOptgroup], imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule], exports: [MatOption, MatOptgroup] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule] }); }
}
export { MatOptionModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule],
                    exports: [MatOption, MatOptgroup],
                    declarations: [MatOption, MatOptgroup],
                }]
        }] });
export * from './option';
export * from './optgroup';
export * from './option-parent';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7O0FBRXZDLE1BS2EsZUFBZTs4R0FBZixlQUFlOytHQUFmLGVBQWUsaUJBRlgsU0FBUyxFQUFFLFdBQVcsYUFGM0IsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsdUJBQXVCLGFBQ3ZFLFNBQVMsRUFBRSxXQUFXOytHQUdyQixlQUFlLFlBSmhCLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLHVCQUF1Qjs7U0FJdEUsZUFBZTsyRkFBZixlQUFlO2tCQUwzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixDQUFDO29CQUNsRixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO29CQUNqQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO2lCQUN2Qzs7QUFHRCxjQUFjLFVBQVUsQ0FBQztBQUN6QixjQUFjLFlBQVksQ0FBQztBQUMzQixjQUFjLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01hdFJpcHBsZU1vZHVsZX0gZnJvbSAnLi4vcmlwcGxlL2luZGV4JztcbmltcG9ydCB7TWF0UHNldWRvQ2hlY2tib3hNb2R1bGV9IGZyb20gJy4uL3NlbGVjdGlvbi9pbmRleCc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLWJlaGF2aW9ycy9jb21tb24tbW9kdWxlJztcbmltcG9ydCB7TWF0T3B0aW9ufSBmcm9tICcuL29wdGlvbic7XG5pbXBvcnQge01hdE9wdGdyb3VwfSBmcm9tICcuL29wdGdyb3VwJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFJpcHBsZU1vZHVsZSwgQ29tbW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlXSxcbiAgZXhwb3J0czogW01hdE9wdGlvbiwgTWF0T3B0Z3JvdXBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRPcHRpb24sIE1hdE9wdGdyb3VwXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0T3B0aW9uTW9kdWxlIHt9XG5cbmV4cG9ydCAqIGZyb20gJy4vb3B0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vb3B0Z3JvdXAnO1xuZXhwb3J0ICogZnJvbSAnLi9vcHRpb24tcGFyZW50JztcbiJdfQ==