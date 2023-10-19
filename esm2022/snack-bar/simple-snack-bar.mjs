/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarRef } from './snack-bar-ref';
import { MAT_SNACK_BAR_DATA } from './snack-bar-config';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from './snack-bar-content';
import * as i0 from "@angular/core";
import * as i1 from "./snack-bar-ref";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/common";
export class SimpleSnackBar {
    constructor(snackBarRef, data) {
        this.snackBarRef = snackBarRef;
        this.data = data;
    }
    /** Performs the action on the snack bar. */
    action() {
        this.snackBarRef.dismissWithAction();
    }
    /** If the action button should be shown. */
    get hasAction() {
        return !!this.data.action;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: SimpleSnackBar, deps: [{ token: i1.MatSnackBarRef }, { token: MAT_SNACK_BAR_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0-next.6", type: SimpleSnackBar, isStandalone: true, selector: "simple-snack-bar", host: { classAttribute: "mat-mdc-simple-snack-bar" }, exportAs: ["matSnackBar"], ngImport: i0, template: "<div matSnackBarLabel>\n  {{data.message}}\n</div>\n\n<div matSnackBarActions *ngIf=\"hasAction\">\n  <button mat-button matSnackBarAction (click)=\"action()\">\n    {{data.action}}\n  </button>\n</div>\n", styles: [".mat-mdc-simple-snack-bar{display:flex}"], dependencies: [{ kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i2.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatSnackBarLabel, selector: "[matSnackBarLabel]" }, { kind: "directive", type: MatSnackBarActions, selector: "[matSnackBarActions]" }, { kind: "directive", type: MatSnackBarAction, selector: "[matSnackBarAction]" }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: SimpleSnackBar, decorators: [{
            type: Component,
            args: [{ selector: 'simple-snack-bar', exportAs: 'matSnackBar', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, CommonModule], standalone: true, host: {
                        'class': 'mat-mdc-simple-snack-bar',
                    }, template: "<div matSnackBarLabel>\n  {{data.message}}\n</div>\n\n<div matSnackBarActions *ngIf=\"hasAction\">\n  <button mat-button matSnackBarAction (click)=\"action()\">\n    {{data.action}}\n  </button>\n</div>\n", styles: [".mat-mdc-simple-snack-bar{display:flex}"] }]
        }], ctorParameters: () => [{ type: i1.MatSnackBarRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DATA]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLXNuYWNrLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDOzs7OztBQXlCNUYsTUFBTSxPQUFPLGNBQWM7SUFDekIsWUFDUyxXQUEyQyxFQUNmLElBQXVDO1FBRG5FLGdCQUFXLEdBQVgsV0FBVyxDQUFnQztRQUNmLFNBQUksR0FBSixJQUFJLENBQW1DO0lBQ3pFLENBQUM7SUFFSiw0Q0FBNEM7SUFDNUMsTUFBTTtRQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsNENBQTRDO0lBQzVDLElBQUksU0FBUztRQUNYLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzVCLENBQUM7cUhBZFUsY0FBYyxnREFHZixrQkFBa0I7eUdBSGpCLGNBQWMsNkpDdEMzQiw4TUFTQSxnR0R1QlksZUFBZSw0TkFBRSxnQkFBZ0IsK0RBQUUsa0JBQWtCLGlFQUFFLGlCQUFpQiwrREFBRSxZQUFZOztrR0FNckYsY0FBYztrQkFiMUIsU0FBUzsrQkFDRSxrQkFBa0IsWUFHbEIsYUFBYSxpQkFDUixpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLFdBQ3RDLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxjQUNyRixJQUFJLFFBQ1Y7d0JBQ0osT0FBTyxFQUFFLDBCQUEwQjtxQkFDcEM7OzBCQUtFLE1BQU07MkJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0QnV0dG9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcbmltcG9ydCB7TUFUX1NOQUNLX0JBUl9EQVRBfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuaW1wb3J0IHtNYXRTbmFja0JhckFjdGlvbiwgTWF0U25hY2tCYXJBY3Rpb25zLCBNYXRTbmFja0JhckxhYmVsfSBmcm9tICcuL3NuYWNrLWJhci1jb250ZW50JztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGEgc2ltcGxlIHNuYWNrIGJhciBjb21wb25lbnQgdGhhdCBoYXMgYSBtZXNzYWdlIGFuZCBhIHNpbmdsZSBhY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dE9ubHlTbmFja0JhciB7XG4gIGRhdGE6IHttZXNzYWdlOiBzdHJpbmc7IGFjdGlvbjogc3RyaW5nfTtcbiAgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFRleHRPbmx5U25hY2tCYXI+O1xuICBhY3Rpb246ICgpID0+IHZvaWQ7XG4gIGhhc0FjdGlvbjogYm9vbGVhbjtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2ltcGxlLXNuYWNrLWJhcicsXG4gIHRlbXBsYXRlVXJsOiAnc2ltcGxlLXNuYWNrLWJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3NpbXBsZS1zbmFjay1iYXIuY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0U25hY2tCYXInLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW1wb3J0czogW01hdEJ1dHRvbk1vZHVsZSwgTWF0U25hY2tCYXJMYWJlbCwgTWF0U25hY2tCYXJBY3Rpb25zLCBNYXRTbmFja0JhckFjdGlvbiwgQ29tbW9uTW9kdWxlXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLXNpbXBsZS1zbmFjay1iYXInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBTaW1wbGVTbmFja0JhciBpbXBsZW1lbnRzIFRleHRPbmx5U25hY2tCYXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFNpbXBsZVNuYWNrQmFyPixcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREFUQSkgcHVibGljIGRhdGE6IHttZXNzYWdlOiBzdHJpbmc7IGFjdGlvbjogc3RyaW5nfSxcbiAgKSB7fVxuXG4gIC8qKiBQZXJmb3JtcyB0aGUgYWN0aW9uIG9uIHRoZSBzbmFjayBiYXIuICovXG4gIGFjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyUmVmLmRpc21pc3NXaXRoQWN0aW9uKCk7XG4gIH1cblxuICAvKiogSWYgdGhlIGFjdGlvbiBidXR0b24gc2hvdWxkIGJlIHNob3duLiAqL1xuICBnZXQgaGFzQWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZGF0YS5hY3Rpb247XG4gIH1cbn1cbiIsIjxkaXYgbWF0U25hY2tCYXJMYWJlbD5cbiAge3tkYXRhLm1lc3NhZ2V9fVxuPC9kaXY+XG5cbjxkaXYgbWF0U25hY2tCYXJBY3Rpb25zICpuZ0lmPVwiaGFzQWN0aW9uXCI+XG4gIDxidXR0b24gbWF0LWJ1dHRvbiBtYXRTbmFja0JhckFjdGlvbiAoY2xpY2spPVwiYWN0aW9uKClcIj5cbiAgICB7e2RhdGEuYWN0aW9ufX1cbiAgPC9idXR0b24+XG48L2Rpdj5cbiJdfQ==