/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCommonModule } from '@angular/material/core';
import { MatTooltip, TooltipComponent, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './tooltip';
import * as i0 from "@angular/core";
class MatTooltipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatTooltipModule, declarations: [MatTooltip, TooltipComponent], imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule], exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTooltipModule, providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule, MatCommonModule, CdkScrollableModule] }); }
}
export { MatTooltipModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule],
                    exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
                    declarations: [MatTooltip, TooltipComponent],
                    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Rvb2x0aXAvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFDTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLDRDQUE0QyxHQUM3QyxNQUFNLFdBQVcsQ0FBQzs7QUFFbkIsTUFNYSxnQkFBZ0I7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGlCQUhaLFVBQVUsRUFBRSxnQkFBZ0IsYUFGakMsVUFBVSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsZUFBZSxhQUN4RCxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQjsrR0FJakUsZ0JBQWdCLGFBRmhCLENBQUMsNENBQTRDLENBQUMsWUFIL0MsVUFBVSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUMxQixlQUFlLEVBQUUsbUJBQW1COztTQUlqRSxnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFONUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUM7b0JBQ25FLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLENBQUM7b0JBQzdFLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDNUMsU0FBUyxFQUFFLENBQUMsNENBQTRDLENBQUM7aUJBQzFEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0ExMXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7XG4gIE1hdFRvb2x0aXAsXG4gIFRvb2x0aXBDb21wb25lbnQsXG4gIE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLFxufSBmcm9tICcuL3Rvb2x0aXAnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQTExeU1vZHVsZSwgQ29tbW9uTW9kdWxlLCBPdmVybGF5TW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0VG9vbHRpcCwgVG9vbHRpcENvbXBvbmVudCwgTWF0Q29tbW9uTW9kdWxlLCBDZGtTY3JvbGxhYmxlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0VG9vbHRpcCwgVG9vbHRpcENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW01BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VG9vbHRpcE1vZHVsZSB7fVxuIl19