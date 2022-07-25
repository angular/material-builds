/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelect, MatSelectTrigger } from './select';
import * as i0 from "@angular/core";
export class MatSelectModule {
}
MatSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: MatSelectModule, declarations: [MatSelect, MatSelectTrigger], imports: [CommonModule, OverlayModule, MatOptionModule, MatCommonModule], exports: [CdkScrollableModule,
        MatLegacyFormFieldModule,
        MatSelect,
        MatSelectTrigger,
        MatOptionModule,
        MatCommonModule] });
MatSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelectModule, providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER], imports: [CommonModule, OverlayModule, MatOptionModule, MatCommonModule, CdkScrollableModule,
        MatLegacyFormFieldModule,
        MatOptionModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, MatOptionModule, MatCommonModule],
                    exports: [
                        CdkScrollableModule,
                        MatLegacyFormFieldModule,
                        MatSelect,
                        MatSelectTrigger,
                        MatOptionModule,
                        MatCommonModule,
                    ],
                    declarations: [MatSelect, MatSelectTrigger],
                    providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zZWxlY3Qvc2VsZWN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsbUNBQW1DLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sVUFBVSxDQUFDOztBQWUxRixNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLGlCQUhYLFNBQVMsRUFBRSxnQkFBZ0IsYUFUaEMsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxhQUVyRSxtQkFBbUI7UUFDbkIsd0JBQXdCO1FBQ3hCLFNBQVM7UUFDVCxnQkFBZ0I7UUFDaEIsZUFBZTtRQUNmLGVBQWU7NkdBS04sZUFBZSxhQUZmLENBQUMsbUNBQW1DLENBQUMsWUFWdEMsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUVyRSxtQkFBbUI7UUFDbkIsd0JBQXdCO1FBR3hCLGVBQWU7UUFDZixlQUFlOzJGQUtOLGVBQWU7a0JBYjNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO29CQUN4RSxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3dCQUNuQix3QkFBd0I7d0JBQ3hCLFNBQVM7d0JBQ1QsZ0JBQWdCO3dCQUNoQixlQUFlO3dCQUNmLGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDM0MsU0FBUyxFQUFFLENBQUMsbUNBQW1DLENBQUM7aUJBQ2pEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRPcHRpb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1mb3JtLWZpZWxkJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSLCBNYXRTZWxlY3QsIE1hdFNlbGVjdFRyaWdnZXJ9IGZyb20gJy4vc2VsZWN0JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT3ZlcmxheU1vZHVsZSwgTWF0T3B0aW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRMZWdhY3lGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0U2VsZWN0LFxuICAgIE1hdFNlbGVjdFRyaWdnZXIsXG4gICAgTWF0T3B0aW9uTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0U2VsZWN0LCBNYXRTZWxlY3RUcmlnZ2VyXSxcbiAgcHJvdmlkZXJzOiBbTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RNb2R1bGUge31cbiJdfQ==