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
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
let SimpleSnackBar = /** @class */ (() => {
    class SimpleSnackBar {
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
    SimpleSnackBar.decorators = [
        { type: Component, args: [{
                    selector: 'simple-snack-bar',
                    template: "<span>{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        'class': 'mat-simple-snackbar',
                    },
                    styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}\n"]
                },] }
    ];
    SimpleSnackBar.ctorParameters = () => [
        { type: MatSnackBarRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DATA,] }] }
    ];
    return SimpleSnackBar;
})();
export { SimpleSnackBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLXNuYWNrLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFZL0M7OztHQUdHO0FBQ0g7SUFBQSxNQVVhLGNBQWM7UUFJekIsWUFDUyxXQUEyQyxFQUN0QixJQUFTO1lBRDlCLGdCQUFXLEdBQVgsV0FBVyxDQUFnQztZQUVsRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDO1FBRUQsNENBQTRDO1FBQzVDLE1BQU07WUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUVELDRDQUE0QztRQUM1QyxJQUFJLFNBQVM7WUFDWCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM1QixDQUFDOzs7Z0JBNUJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1Qix3TEFBb0M7b0JBRXBDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxxQkFBcUI7cUJBQy9COztpQkFDRjs7O2dCQXpCTyxjQUFjO2dEQWdDakIsTUFBTSxTQUFDLGtCQUFrQjs7SUFhOUIscUJBQUM7S0FBQTtTQW5CWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9TTkFDS19CQVJfREFUQX0gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcbmltcG9ydCB7TWF0U25hY2tCYXJSZWZ9IGZyb20gJy4vc25hY2stYmFyLXJlZic7XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBpbnRlcmZhY2UgZm9yIGEgc2ltcGxlIHNuYWNrIGJhciBjb21wb25lbnQuLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRleHRPbmx5U25hY2tCYXIge1xuICBkYXRhOiB7bWVzc2FnZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZ307XG4gIHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxUZXh0T25seVNuYWNrQmFyPjtcbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB1c2VkIHRvIG9wZW4gYXMgdGhlIGRlZmF1bHQgc25hY2sgYmFyLCBtYXRjaGluZyBtYXRlcmlhbCBzcGVjLlxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgdGhlIHNuYWNrIGJhciBzZXJ2aWNlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdzaW1wbGUtc25hY2stYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICdzaW1wbGUtc25hY2stYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2ltcGxlLXNuYWNrLWJhci5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNpbXBsZS1zbmFja2JhcicsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgU2ltcGxlU25hY2tCYXIgaW1wbGVtZW50cyBUZXh0T25seVNuYWNrQmFyIHtcbiAgLyoqIERhdGEgdGhhdCB3YXMgaW5qZWN0ZWQgaW50byB0aGUgc25hY2sgYmFyLiAqL1xuICBkYXRhOiB7bWVzc2FnZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZ307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxTaW1wbGVTbmFja0Jhcj4sXG4gICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RBVEEpIGRhdGE6IGFueSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICAvKiogUGVyZm9ybXMgdGhlIGFjdGlvbiBvbiB0aGUgc25hY2sgYmFyLiAqL1xuICBhY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zbmFja0JhclJlZi5kaXNtaXNzV2l0aEFjdGlvbigpO1xuICB9XG5cbiAgLyoqIElmIHRoZSBhY3Rpb24gYnV0dG9uIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgZ2V0IGhhc0FjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmRhdGEuYWN0aW9uO1xuICB9XG59XG4iXX0=