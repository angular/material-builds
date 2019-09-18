/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBarRef } from './snack-bar-ref';
import { MAT_SNACK_BAR_DATA } from './snack-bar-config';
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
export class SimpleSnackBar {
    /**
     * @param {?} snackBarRef
     * @param {?} data
     */
    constructor(snackBarRef, data) {
        this.snackBarRef = snackBarRef;
        this.data = data;
    }
    /**
     * Performs the action on the snack bar.
     * @return {?}
     */
    action() {
        this.snackBarRef.dismissWithAction();
    }
    /**
     * If the action button should be shown.
     * @return {?}
     */
    get hasAction() {
        return !!this.data.action;
    }
}
SimpleSnackBar.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'simple-snack-bar',
                template: "<span>{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-simple-snackbar',
                },
                styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}/*# sourceMappingURL=simple-snack-bar.css.map */\n"]
            }] }
];
/** @nocollapse */
SimpleSnackBar.ctorParameters = () => [
    { type: MatSnackBarRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DATA,] }] }
];
if (false) {
    /**
     * Data that was injected into the snack bar.
     * @type {?}
     */
    SimpleSnackBar.prototype.data;
    /** @type {?} */
    SimpleSnackBar.prototype.snackBarRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLXNuYWNrLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7QUFrQnRELE1BQU0sT0FBTyxjQUFjOzs7OztJQUl6QixZQUNTLFdBQTJDLEVBQ3RCLElBQVM7UUFEOUIsZ0JBQVcsR0FBWCxXQUFXLENBQWdDO1FBRWxELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBR0QsTUFBTTtRQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUN2QyxDQUFDOzs7OztJQUdELElBQUksU0FBUztRQUNYLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzVCLENBQUM7OztZQTdCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQixRQUFRLEVBQUUsa0JBQWtCO2dCQUM1Qix3TEFBb0M7Z0JBRXBDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxxQkFBcUI7aUJBQy9COzthQUNGOzs7O1lBbEJPLGNBQWM7NENBeUJqQixNQUFNLFNBQUMsa0JBQWtCOzs7Ozs7O0lBSjVCLDhCQUF3Qzs7SUFHdEMscUNBQWtEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbiwgSW5qZWN0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFNuYWNrQmFyUmVmfSBmcm9tICcuL3NuYWNrLWJhci1yZWYnO1xuaW1wb3J0IHtNQVRfU05BQ0tfQkFSX0RBVEF9IGZyb20gJy4vc25hY2stYmFyLWNvbmZpZyc7XG5cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB1c2VkIHRvIG9wZW4gYXMgdGhlIGRlZmF1bHQgc25hY2sgYmFyLCBtYXRjaGluZyBtYXRlcmlhbCBzcGVjLlxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgdGhlIHNuYWNrIGJhciBzZXJ2aWNlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdzaW1wbGUtc25hY2stYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICdzaW1wbGUtc25hY2stYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2ltcGxlLXNuYWNrLWJhci5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNpbXBsZS1zbmFja2JhcicsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgU2ltcGxlU25hY2tCYXIge1xuICAvKiogRGF0YSB0aGF0IHdhcyBpbmplY3RlZCBpbnRvIHRoZSBzbmFjayBiYXIuICovXG4gIGRhdGE6IHttZXNzYWdlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFNpbXBsZVNuYWNrQmFyPixcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREFUQSkgZGF0YTogYW55KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIC8qKiBQZXJmb3JtcyB0aGUgYWN0aW9uIG9uIHRoZSBzbmFjayBiYXIuICovXG4gIGFjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyUmVmLmRpc21pc3NXaXRoQWN0aW9uKCk7XG4gIH1cblxuICAvKiogSWYgdGhlIGFjdGlvbiBidXR0b24gc2hvdWxkIGJlIHNob3duLiAqL1xuICBnZXQgaGFzQWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZGF0YS5hY3Rpb247XG4gIH1cbn1cbiJdfQ==