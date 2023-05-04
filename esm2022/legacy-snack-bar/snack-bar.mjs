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
 * @deprecated Use `MatSnackBar` from `@angular/material/snack-bar` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySnackBar extends _MatSnackBarBase {
    constructor(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig) {
        super(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig);
        this.simpleSnackBarComponent = LegacySimpleSnackBar;
        this.snackBarContainerComponent = MatLegacySnackBarContainer;
        this.handsetCssClass = 'mat-snack-bar-handset';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySnackBar, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: MatLegacySnackBar, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySnackBar, providedIn: MatLegacySnackBarModule }); }
}
export { MatLegacySnackBar };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacySnackBar, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zbmFjay1iYXIvc25hY2stYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDeEQsT0FBTyxFQUNMLGdCQUFnQixFQUNoQiw2QkFBNkIsRUFDN0IsaUJBQWlCLEdBQ2xCLE1BQU0sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDakUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUUzRDs7OztHQUlHO0FBQ0gsTUFDYSxpQkFBa0IsU0FBUSxnQkFBZ0I7SUFLckQsWUFDRSxPQUFnQixFQUNoQixJQUFtQixFQUNuQixRQUFrQixFQUNsQixrQkFBc0MsRUFDZCxjQUFpQyxFQUNsQixhQUFnQztRQUV2RSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBWjFFLDRCQUF1QixHQUFHLG9CQUFvQixDQUFDO1FBQy9DLCtCQUEwQixHQUFHLDBCQUEwQixDQUFDO1FBQ3hELG9CQUFlLEdBQUcsdUJBQXVCLENBQUM7SUFXcEQsQ0FBQzs4R0FkVSxpQkFBaUIsOExBV2xCLDZCQUE2QjtrSEFYNUIsaUJBQWlCLGNBREwsdUJBQXVCOztTQUNuQyxpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEN0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSx1QkFBdUIsRUFBQzs7MEJBVzVDLFFBQVE7OzBCQUFJLFFBQVE7OzBCQUNwQixNQUFNOzJCQUFDLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xpdmVBbm5vdW5jZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIEluamVjdG9yLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMZWdhY3lTaW1wbGVTbmFja0Jhcn0gZnJvbSAnLi9zaW1wbGUtc25hY2stYmFyJztcbmltcG9ydCB7XG4gIF9NYXRTbmFja0JhckJhc2UsXG4gIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TLFxuICBNYXRTbmFja0JhckNvbmZpZyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJztcbmltcG9ydCB7TWF0TGVnYWN5U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdExlZ2FjeVNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gZGlzcGF0Y2ggTWF0ZXJpYWwgRGVzaWduIHNuYWNrIGJhciBtZXNzYWdlcy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0U25hY2tCYXJgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcmAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0TGVnYWN5U25hY2tCYXJNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNuYWNrQmFyIGV4dGVuZHMgX01hdFNuYWNrQmFyQmFzZSB7XG4gIHByb3RlY3RlZCBzaW1wbGVTbmFja0JhckNvbXBvbmVudCA9IExlZ2FjeVNpbXBsZVNuYWNrQmFyO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJDb250YWluZXJDb21wb25lbnQgPSBNYXRMZWdhY3lTbmFja0JhckNvbnRhaW5lcjtcbiAgcHJvdGVjdGVkIGhhbmRzZXRDc3NDbGFzcyA9ICdtYXQtc25hY2stYmFyLWhhbmRzZXQnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIsXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcGFyZW50U25hY2tCYXI6IE1hdExlZ2FjeVNuYWNrQmFyLFxuICAgIEBJbmplY3QoTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApIHtcbiAgICBzdXBlcihvdmVybGF5LCBsaXZlLCBpbmplY3RvciwgYnJlYWtwb2ludE9ic2VydmVyLCBwYXJlbnRTbmFja0JhciwgZGVmYXVsdENvbmZpZyk7XG4gIH1cbn1cbiJdfQ==