/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from './snack-bar-config';
import { MatSnackBarRef } from './snack-bar-ref';
import * as i0 from "@angular/core";
import * as i1 from "./snack-bar-ref";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/common";
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
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
}
SimpleSnackBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: SimpleSnackBar, deps: [{ token: i1.MatSnackBarRef }, { token: MAT_SNACK_BAR_DATA }], target: i0.ɵɵFactoryTarget.Component });
SimpleSnackBar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: SimpleSnackBar, selector: "simple-snack-bar", host: { classAttribute: "mat-simple-snackbar" }, ngImport: i0, template: "<span>{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n", styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}\n"], components: [{ type: i2.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: SimpleSnackBar, decorators: [{
            type: Component,
            args: [{ selector: 'simple-snack-bar', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'class': 'mat-simple-snackbar',
                    }, template: "<span>{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n", styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatSnackBarRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DATA]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLXNuYWNrLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7QUFhL0M7OztHQUdHO0FBV0gsTUFBTSxPQUFPLGNBQWM7SUFJekIsWUFDUyxXQUEyQyxFQUN0QixJQUFTO1FBRDlCLGdCQUFXLEdBQVgsV0FBVyxDQUFnQztRQUVsRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsNENBQTRDO0lBQzVDLE1BQU07UUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxJQUFJLFNBQVM7UUFDWCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM1QixDQUFDOzttSEFsQlUsY0FBYyxnREFNZixrQkFBa0I7dUdBTmpCLGNBQWMseUdDckMzQiw4S0FJQTttR0RpQ2EsY0FBYztrQkFWMUIsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxRQUN6Qzt3QkFDSixPQUFPLEVBQUUscUJBQXFCO3FCQUMvQjs7MEJBUUUsTUFBTTsyQkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3QsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX1NOQUNLX0JBUl9EQVRBfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgYSBzaW1wbGUgc25hY2sgYmFyIGNvbXBvbmVudCB0aGF0IGhhcyBhIG1lc3NhZ2UgYW5kIGEgc2luZ2xlIGFjdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXh0T25seVNuYWNrQmFyIHtcbiAgZGF0YToge21lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmd9O1xuICBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8VGV4dE9ubHlTbmFja0Jhcj47XG4gIGFjdGlvbjogKCkgPT4gdm9pZDtcbiAgaGFzQWN0aW9uOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgY29tcG9uZW50IHVzZWQgdG8gb3BlbiBhcyB0aGUgZGVmYXVsdCBzbmFjayBiYXIsIG1hdGNoaW5nIG1hdGVyaWFsIHNwZWMuXG4gKiBUaGlzIHNob3VsZCBvbmx5IGJlIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgc25hY2sgYmFyIHNlcnZpY2UuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NpbXBsZS1zbmFjay1iYXInLFxuICB0ZW1wbGF0ZVVybDogJ3NpbXBsZS1zbmFjay1iYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzaW1wbGUtc25hY2stYmFyLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc2ltcGxlLXNuYWNrYmFyJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBTaW1wbGVTbmFja0JhciBpbXBsZW1lbnRzIFRleHRPbmx5U25hY2tCYXIge1xuICAvKiogRGF0YSB0aGF0IHdhcyBpbmplY3RlZCBpbnRvIHRoZSBzbmFjayBiYXIuICovXG4gIGRhdGE6IHttZXNzYWdlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFNpbXBsZVNuYWNrQmFyPixcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREFUQSkgZGF0YTogYW55KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIC8qKiBQZXJmb3JtcyB0aGUgYWN0aW9uIG9uIHRoZSBzbmFjayBiYXIuICovXG4gIGFjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyUmVmLmRpc21pc3NXaXRoQWN0aW9uKCk7XG4gIH1cblxuICAvKiogSWYgdGhlIGFjdGlvbiBidXR0b24gc2hvdWxkIGJlIHNob3duLiAqL1xuICBnZXQgaGFzQWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZGF0YS5hY3Rpb247XG4gIH1cbn1cbiIsIjxzcGFuPnt7ZGF0YS5tZXNzYWdlfX08L3NwYW4+XG48ZGl2IGNsYXNzPVwibWF0LXNpbXBsZS1zbmFja2Jhci1hY3Rpb25cIiAgKm5nSWY9XCJoYXNBY3Rpb25cIj5cbiAgPGJ1dHRvbiBtYXQtYnV0dG9uIChjbGljayk9XCJhY3Rpb24oKVwiPnt7ZGF0YS5hY3Rpb259fTwvYnV0dG9uPlxuPC9kaXY+XG4iXX0=