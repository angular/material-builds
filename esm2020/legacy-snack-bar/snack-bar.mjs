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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zbmFjay1iYXIvc25hY2stYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDeEQsT0FBTyxFQUNMLGdCQUFnQixFQUNoQiw2QkFBNkIsRUFDN0IsaUJBQWlCLEdBQ2xCLE1BQU0sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDakUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUUzRDs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGdCQUFnQjtJQUtyRCxZQUNFLE9BQWdCLEVBQ2hCLElBQW1CLEVBQ25CLFFBQWtCLEVBQ2xCLGtCQUFzQyxFQUNkLGNBQWlDLEVBQ2xCLGFBQWdDO1FBRXZFLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFaMUUsNEJBQXVCLEdBQUcsb0JBQW9CLENBQUM7UUFDL0MsK0JBQTBCLEdBQUcsMEJBQTBCLENBQUM7UUFDeEQsb0JBQWUsR0FBRyx1QkFBdUIsQ0FBQztJQVdwRCxDQUFDOzs4R0FkVSxpQkFBaUIsZ0lBVWMsaUJBQWlCLDZDQUNqRCw2QkFBNkI7a0hBWDVCLGlCQUFpQixjQURMLHVCQUF1QjsyRkFDbkMsaUJBQWlCO2tCQUQ3QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLHVCQUF1QixFQUFDO29LQVdMLGlCQUFpQjswQkFBeEQsUUFBUTs7MEJBQUksUUFBUTs7MEJBQ3BCLE1BQU07MkJBQUMsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtPdmVybGF5fSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE9wdGlvbmFsLCBTa2lwU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xlZ2FjeVNpbXBsZVNuYWNrQmFyfSBmcm9tICcuL3NpbXBsZS1zbmFjay1iYXInO1xuaW1wb3J0IHtcbiAgX01hdFNuYWNrQmFyQmFzZSxcbiAgTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlMsXG4gIE1hdFNuYWNrQmFyQ29uZmlnLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXInO1xuaW1wb3J0IHtNYXRMZWdhY3lTbmFja0JhckNvbnRhaW5lcn0gZnJvbSAnLi9zbmFjay1iYXItY29udGFpbmVyJztcbmltcG9ydCB7TWF0TGVnYWN5U25hY2tCYXJNb2R1bGV9IGZyb20gJy4vc25hY2stYmFyLW1vZHVsZSc7XG5cbi8qKlxuICogU2VydmljZSB0byBkaXNwYXRjaCBNYXRlcmlhbCBEZXNpZ24gc25hY2sgYmFyIG1lc3NhZ2VzLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRTbmFja0JhcmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBNYXRMZWdhY3lTbmFja0Jhck1vZHVsZX0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5U25hY2tCYXIgZXh0ZW5kcyBfTWF0U25hY2tCYXJCYXNlIHtcbiAgcHJvdGVjdGVkIHNpbXBsZVNuYWNrQmFyQ29tcG9uZW50ID0gTGVnYWN5U2ltcGxlU25hY2tCYXI7XG4gIHByb3RlY3RlZCBzbmFja0JhckNvbnRhaW5lckNvbXBvbmVudCA9IE1hdExlZ2FjeVNuYWNrQmFyQ29udGFpbmVyO1xuICBwcm90ZWN0ZWQgaGFuZHNldENzc0NsYXNzID0gJ21hdC1zbmFjay1iYXItaGFuZHNldCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBsaXZlOiBMaXZlQW5ub3VuY2VyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwYXJlbnRTbmFja0JhcjogTWF0TGVnYWN5U25hY2tCYXIsXG4gICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdENvbmZpZzogTWF0U25hY2tCYXJDb25maWcsXG4gICkge1xuICAgIHN1cGVyKG92ZXJsYXksIGxpdmUsIGluamVjdG9yLCBicmVha3BvaW50T2JzZXJ2ZXIsIHBhcmVudFNuYWNrQmFyLCBkZWZhdWx0Q29uZmlnKTtcbiAgfVxufVxuIl19