/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay } from '@angular/cdk/overlay';
import { Inject, Injectable, Injector, Optional, SkipSelf } from '@angular/core';
import { LegacySimpleSnackBar } from './simple-snack-bar';
import { _MatSnackBarBase, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, } from '@angular/material/snack-bar';
import { MatLegacySnackBarContainer } from './snack-bar-container';
import { MatLegacySnackBarModule } from './snack-bar-module';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/layout";
import * as i4 from "@angular/material/snack-bar";
/**
 * Service to dispatch Material Design snack bar messages.
 */
export class MatLegacySnackBar extends _MatSnackBarBase {
    constructor(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig) {
        super(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig);
        this.simpleSnackBarComponent = LegacySimpleSnackBar;
        this.snackBarContainerComponent = MatLegacySnackBarContainer;
        this.handsetCssClass = 'mat-snack-bar-handset';
    }
}
MatLegacySnackBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacySnackBar, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: MatLegacySnackBar, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
MatLegacySnackBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacySnackBar, providedIn: MatLegacySnackBarModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacySnackBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: MatLegacySnackBarModule }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i2.LiveAnnouncer }, { type: i0.Injector }, { type: i3.BreakpointObserver }, { type: MatLegacySnackBar, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i4.MatSnackBarConfig, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zbmFjay1iYXIvc25hY2stYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDeEQsT0FBTyxFQUNMLGdCQUFnQixFQUNoQiw2QkFBNkIsRUFDN0IsaUJBQWlCLEdBQ2xCLE1BQU0sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDakUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUUzRDs7R0FFRztBQUVILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxnQkFBZ0I7SUFLckQsWUFDRSxPQUFnQixFQUNoQixJQUFtQixFQUNuQixRQUFrQixFQUNsQixrQkFBc0MsRUFDZCxjQUFpQyxFQUNsQixhQUFnQztRQUV2RSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBWjFFLDRCQUF1QixHQUFHLG9CQUFvQixDQUFDO1FBQy9DLCtCQUEwQixHQUFHLDBCQUEwQixDQUFDO1FBQ3hELG9CQUFlLEdBQUcsdUJBQXVCLENBQUM7SUFXcEQsQ0FBQzs7OEdBZFUsaUJBQWlCLGdJQVVjLGlCQUFpQiw2Q0FDakQsNkJBQTZCO2tIQVg1QixpQkFBaUIsY0FETCx1QkFBdUI7MkZBQ25DLGlCQUFpQjtrQkFEN0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSx1QkFBdUIsRUFBQztvS0FXTCxpQkFBaUI7MEJBQXhELFFBQVE7OzBCQUFJLFFBQVE7OzBCQUNwQixNQUFNOzJCQUFDLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xpdmVBbm5vdW5jZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIEluamVjdG9yLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMZWdhY3lTaW1wbGVTbmFja0Jhcn0gZnJvbSAnLi9zaW1wbGUtc25hY2stYmFyJztcbmltcG9ydCB7XG4gIF9NYXRTbmFja0JhckJhc2UsXG4gIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TLFxuICBNYXRTbmFja0JhckNvbmZpZyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJztcbmltcG9ydCB7TWF0TGVnYWN5U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdExlZ2FjeVNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gZGlzcGF0Y2ggTWF0ZXJpYWwgRGVzaWduIHNuYWNrIGJhciBtZXNzYWdlcy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IE1hdExlZ2FjeVNuYWNrQmFyTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lTbmFja0JhciBleHRlbmRzIF9NYXRTbmFja0JhckJhc2Uge1xuICBwcm90ZWN0ZWQgc2ltcGxlU25hY2tCYXJDb21wb25lbnQgPSBMZWdhY3lTaW1wbGVTbmFja0JhcjtcbiAgcHJvdGVjdGVkIHNuYWNrQmFyQ29udGFpbmVyQ29tcG9uZW50ID0gTWF0TGVnYWN5U25hY2tCYXJDb250YWluZXI7XG4gIHByb3RlY3RlZCBoYW5kc2V0Q3NzQ2xhc3MgPSAnbWF0LXNuYWNrLWJhci1oYW5kc2V0JztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGxpdmU6IExpdmVBbm5vdW5jZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudFNuYWNrQmFyOiBNYXRMZWdhY3lTbmFja0JhcixcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0Q29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKSB7XG4gICAgc3VwZXIob3ZlcmxheSwgbGl2ZSwgaW5qZWN0b3IsIGJyZWFrcG9pbnRPYnNlcnZlciwgcGFyZW50U25hY2tCYXIsIGRlZmF1bHRDb25maWcpO1xuICB9XG59XG4iXX0=