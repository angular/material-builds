/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatRippleModule } from '../ripple/index';
import { MatPseudoCheckboxModule } from '../selection/index';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatOption } from './option';
import { MatOptgroup } from './optgroup';
import * as i0 from "@angular/core";
export class MatOptionModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.4", ngImport: i0, type: MatOptionModule, declarations: [MatOption, MatOptgroup], imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule], exports: [MatOption, MatOptgroup] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule],
                    exports: [MatOption, MatOptgroup],
                    declarations: [MatOption, MatOptgroup],
                }]
        }] });
export * from './option';
export * from './optgroup';
export * from './option-parent';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQzs7QUFPdkMsTUFBTSxPQUFPLGVBQWU7OEdBQWYsZUFBZTsrR0FBZixlQUFlLGlCQUZYLFNBQVMsRUFBRSxXQUFXLGFBRjNCLGVBQWUsRUFBRSxlQUFlLEVBQUUsdUJBQXVCLGFBQ3pELFNBQVMsRUFBRSxXQUFXOytHQUdyQixlQUFlLFlBSmhCLGVBQWUsRUFBRSxlQUFlLEVBQUUsdUJBQXVCOzsyRkFJeEQsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixDQUFDO29CQUNwRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO29CQUNqQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO2lCQUN2Qzs7QUFHRCxjQUFjLFVBQVUsQ0FBQztBQUN6QixjQUFjLFlBQVksQ0FBQztBQUMzQixjQUFjLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRSaXBwbGVNb2R1bGV9IGZyb20gJy4uL3JpcHBsZS9pbmRleCc7XG5pbXBvcnQge01hdFBzZXVkb0NoZWNrYm94TW9kdWxlfSBmcm9tICcuLi9zZWxlY3Rpb24vaW5kZXgnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5pbXBvcnQge01hdE9wdGlvbn0gZnJvbSAnLi9vcHRpb24nO1xuaW1wb3J0IHtNYXRPcHRncm91cH0gZnJvbSAnLi9vcHRncm91cCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRSaXBwbGVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0T3B0aW9uLCBNYXRPcHRncm91cF0sXG4gIGRlY2xhcmF0aW9uczogW01hdE9wdGlvbiwgTWF0T3B0Z3JvdXBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRpb25Nb2R1bGUge31cblxuZXhwb3J0ICogZnJvbSAnLi9vcHRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9vcHRncm91cCc7XG5leHBvcnQgKiBmcm9tICcuL29wdGlvbi1wYXJlbnQnO1xuIl19