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
import { MatLegacyTooltip, LegacyTooltipComponent } from './tooltip';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatTooltipModule` from `@angular/material/tooltip` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTooltipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTooltipModule, declarations: [MatLegacyTooltip, LegacyTooltipComponent], imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule], exports: [MatLegacyTooltip, LegacyTooltipComponent, MatCommonModule, CdkScrollableModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTooltipModule, providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule, MatCommonModule, CdkScrollableModule] }); }
}
export { MatLegacyTooltipModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule],
                    exports: [MatLegacyTooltip, LegacyTooltipComponent, MatCommonModule, CdkScrollableModule],
                    declarations: [MatLegacyTooltip, LegacyTooltipComponent],
                    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRvb2x0aXAvdG9vbHRpcC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGdCQUFnQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ25FLE9BQU8sRUFBQyw0Q0FBNEMsRUFBQyxNQUFNLDJCQUEyQixDQUFDOztBQUV2Rjs7O0dBR0c7QUFDSCxNQU1hLHNCQUFzQjs4R0FBdEIsc0JBQXNCOytHQUF0QixzQkFBc0IsaUJBSGxCLGdCQUFnQixFQUFFLHNCQUFzQixhQUY3QyxVQUFVLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLGFBQ3hELGdCQUFnQixFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxtQkFBbUI7K0dBSTdFLHNCQUFzQixhQUZ0QixDQUFDLDRDQUE0QyxDQUFDLFlBSC9DLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFDZCxlQUFlLEVBQUUsbUJBQW1COztTQUk3RSxzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFObEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUM7b0JBQ25FLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQztvQkFDekYsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsc0JBQXNCLENBQUM7b0JBQ3hELFNBQVMsRUFBRSxDQUFDLDRDQUE0QyxDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7QTExeU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01hdExlZ2FjeVRvb2x0aXAsIExlZ2FjeVRvb2x0aXBDb21wb25lbnR9IGZyb20gJy4vdG9vbHRpcCc7XG5pbXBvcnQge01BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFRvb2x0aXBNb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3Rvb2x0aXBgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0ExMXlNb2R1bGUsIENvbW1vbk1vZHVsZSwgT3ZlcmxheU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdExlZ2FjeVRvb2x0aXAsIExlZ2FjeVRvb2x0aXBDb21wb25lbnQsIE1hdENvbW1vbk1vZHVsZSwgQ2RrU2Nyb2xsYWJsZU1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdExlZ2FjeVRvb2x0aXAsIExlZ2FjeVRvb2x0aXBDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVRvb2x0aXBNb2R1bGUge31cbiJdfQ==