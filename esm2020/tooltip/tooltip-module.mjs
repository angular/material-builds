/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatTooltip, TooltipComponent, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './tooltip';
import * as i0 from "@angular/core";
export class MatTooltipModule {
}
MatTooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatTooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTooltipModule, declarations: [MatTooltip, TooltipComponent], imports: [A11yModule,
        CommonModule,
        OverlayModule,
        MatCommonModule], exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule] });
MatTooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTooltipModule, providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [[
            A11yModule,
            CommonModule,
            OverlayModule,
            MatCommonModule,
        ], MatCommonModule, CdkScrollableModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        A11yModule,
                        CommonModule,
                        OverlayModule,
                        MatCommonModule,
                    ],
                    exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
                    declarations: [MatTooltip, TooltipComponent],
                    entryComponents: [TooltipComponent],
                    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbHRpcC90b29sdGlwLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQ0wsVUFBVSxFQUNWLGdCQUFnQixFQUNoQiw0Q0FBNEMsR0FDN0MsTUFBTSxXQUFXLENBQUM7O0FBY25CLE1BQU0sT0FBTyxnQkFBZ0I7O3FIQUFoQixnQkFBZ0I7c0hBQWhCLGdCQUFnQixpQkFKWixVQUFVLEVBQUUsZ0JBQWdCLGFBTnpDLFVBQVU7UUFDVixZQUFZO1FBQ1osYUFBYTtRQUNiLGVBQWUsYUFFUCxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQjtzSEFLakUsZ0JBQWdCLGFBRmhCLENBQUMsNENBQTRDLENBQUMsWUFUaEQ7WUFDUCxVQUFVO1lBQ1YsWUFBWTtZQUNaLGFBQWE7WUFDYixlQUFlO1NBQ2hCLEVBQ3VDLGVBQWUsRUFBRSxtQkFBbUI7bUdBS2pFLGdCQUFnQjtrQkFaNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsVUFBVTt3QkFDVixZQUFZO3dCQUNaLGFBQWE7d0JBQ2IsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQztvQkFDN0UsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDO29CQUM1QyxlQUFlLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDbkMsU0FBUyxFQUFFLENBQUMsNENBQTRDLENBQUM7aUJBQzFEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtBMTF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIE1hdFRvb2x0aXAsXG4gIFRvb2x0aXBDb21wb25lbnQsXG4gIE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLFxufSBmcm9tICcuL3Rvb2x0aXAnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQTExeU1vZHVsZSxcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtNYXRUb29sdGlwLCBUb29sdGlwQ29tcG9uZW50LCBNYXRDb21tb25Nb2R1bGUsIENka1Njcm9sbGFibGVNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRUb29sdGlwLCBUb29sdGlwQ29tcG9uZW50XSxcbiAgZW50cnlDb21wb25lbnRzOiBbVG9vbHRpcENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW01BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sdGlwTW9kdWxlIHt9XG4iXX0=