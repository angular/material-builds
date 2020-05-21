/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
// Boilerplate for applying mixins to MatTabLabelWrapper.
/** @docs-private */
class MatTabLabelWrapperBase {
}
const _MatTabLabelWrapperMixinBase = mixinDisabled(MatTabLabelWrapperBase);
/**
 * Used in the `mat-tab-group` view to display tab labels.
 * @docs-private
 */
let MatTabLabelWrapper = /** @class */ (() => {
    let MatTabLabelWrapper = class MatTabLabelWrapper extends _MatTabLabelWrapperMixinBase {
        constructor(elementRef) {
            super();
            this.elementRef = elementRef;
        }
        /** Sets focus on the wrapper element */
        focus() {
            this.elementRef.nativeElement.focus();
        }
        getOffsetLeft() {
            return this.elementRef.nativeElement.offsetLeft;
        }
        getOffsetWidth() {
            return this.elementRef.nativeElement.offsetWidth;
        }
    };
    MatTabLabelWrapper = __decorate([
        Directive({
            selector: '[matTabLabelWrapper]',
            inputs: ['disabled'],
            host: {
                '[class.mat-tab-disabled]': 'disabled',
                '[attr.aria-disabled]': '!!disabled',
            }
        }),
        __metadata("design:paramtypes", [ElementRef])
    ], MatTabLabelWrapper);
    return MatTabLabelWrapper;
})();
export { MatTabLabelWrapper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLXdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbGFiZWwtd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBR0gsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUE2QixhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUdqRix5REFBeUQ7QUFDekQsb0JBQW9CO0FBQ3BCLE1BQU0sc0JBQXNCO0NBQUc7QUFDL0IsTUFBTSw0QkFBNEIsR0FDOUIsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFMUM7OztHQUdHO0FBU0g7SUFBQSxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFtQixTQUFRLDRCQUE0QjtRQUNsRSxZQUFtQixVQUFzQjtZQUN2QyxLQUFLLEVBQUUsQ0FBQztZQURTLGVBQVUsR0FBVixVQUFVLENBQVk7UUFFekMsQ0FBQztRQUVELHdDQUF3QztRQUN4QyxLQUFLO1lBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEMsQ0FBQztRQUVELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUNsRCxDQUFDO1FBRUQsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQ25ELENBQUM7S0FHRixDQUFBO0lBbkJZLGtCQUFrQjtRQVI5QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNwQixJQUFJLEVBQUU7Z0JBQ0osMEJBQTBCLEVBQUUsVUFBVTtnQkFDdEMsc0JBQXNCLEVBQUUsWUFBWTthQUNyQztTQUNGLENBQUM7eUNBRStCLFVBQVU7T0FEOUIsa0JBQWtCLENBbUI5QjtJQUFELHlCQUFDO0tBQUE7U0FuQlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRUYWJMYWJlbFdyYXBwZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0VGFiTGFiZWxXcmFwcGVyQmFzZSB7fVxuY29uc3QgX01hdFRhYkxhYmVsV3JhcHBlck1peGluQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0VGFiTGFiZWxXcmFwcGVyQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlZChNYXRUYWJMYWJlbFdyYXBwZXJCYXNlKTtcblxuLyoqXG4gKiBVc2VkIGluIHRoZSBgbWF0LXRhYi1ncm91cGAgdmlldyB0byBkaXNwbGF5IHRhYiBsYWJlbHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUYWJMYWJlbFdyYXBwZXJdJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm1hdC10YWItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnISFkaXNhYmxlZCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTGFiZWxXcmFwcGVyIGV4dGVuZHMgX01hdFRhYkxhYmVsV3JhcHBlck1peGluQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogU2V0cyBmb2N1cyBvbiB0aGUgd3JhcHBlciBlbGVtZW50ICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBnZXRPZmZzZXRMZWZ0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQ7XG4gIH1cblxuICBnZXRPZmZzZXRXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19