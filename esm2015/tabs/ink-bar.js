/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { Directive, ElementRef, Inject, InjectionToken, NgZone, Optional } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/** Injection token for the MatInkBar's Positioner. */
export const _MAT_INK_BAR_POSITIONER = new InjectionToken('MatInkBarPositioner', {
    providedIn: 'root',
    factory: _MAT_INK_BAR_POSITIONER_FACTORY
});
/**
 * The default positioner function for the MatInkBar.
 * @docs-private
 */
export function _MAT_INK_BAR_POSITIONER_FACTORY() {
    const method = (element) => ({
        left: element ? (element.offsetLeft || 0) + 'px' : '0',
        width: element ? (element.offsetWidth || 0) + 'px' : '0',
    });
    return method;
}
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 */
let MatInkBar = /** @class */ (() => {
    let MatInkBar = class MatInkBar {
        constructor(_elementRef, _ngZone, _inkBarPositioner, _animationMode) {
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            this._inkBarPositioner = _inkBarPositioner;
            this._animationMode = _animationMode;
        }
        /**
         * Calculates the styles from the provided element in order to align the ink-bar to that element.
         * Shows the ink bar if previously set as hidden.
         * @param element
         */
        alignToElement(element) {
            this.show();
            if (typeof requestAnimationFrame !== 'undefined') {
                this._ngZone.runOutsideAngular(() => {
                    requestAnimationFrame(() => this._setStyles(element));
                });
            }
            else {
                this._setStyles(element);
            }
        }
        /** Shows the ink bar. */
        show() {
            this._elementRef.nativeElement.style.visibility = 'visible';
        }
        /** Hides the ink bar. */
        hide() {
            this._elementRef.nativeElement.style.visibility = 'hidden';
        }
        /**
         * Sets the proper styles to the ink bar element.
         * @param element
         */
        _setStyles(element) {
            const positions = this._inkBarPositioner(element);
            const inkBar = this._elementRef.nativeElement;
            inkBar.style.left = positions.left;
            inkBar.style.width = positions.width;
        }
    };
    MatInkBar = __decorate([
        Directive({
            selector: 'mat-ink-bar',
            host: {
                'class': 'mat-ink-bar',
                '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
            },
        }),
        __param(2, Inject(_MAT_INK_BAR_POSITIONER)),
        __param(3, Optional()), __param(3, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [ElementRef,
            NgZone, Function, String])
    ], MatInkBar);
    return MatInkBar;
})();
export { MatInkBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQVkzRSxzREFBc0Q7QUFDdEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQ2xDLElBQUksY0FBYyxDQUF1QixxQkFBcUIsRUFBRTtJQUM5RCxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsK0JBQStCO0NBQ3pDLENBQUMsQ0FBQztBQUVMOzs7R0FHRztBQUNILE1BQU0sVUFBVSwrQkFBK0I7SUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7UUFDdEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUN6RCxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7OztHQUdHO0FBUUg7SUFBQSxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO1FBQ3BCLFlBQ1UsV0FBb0MsRUFDcEMsT0FBZSxFQUNrQixpQkFBdUMsRUFDOUIsY0FBdUI7WUFIakUsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1lBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVE7WUFDa0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFzQjtZQUM5QixtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUFJLENBQUM7UUFFaEY7Ozs7V0FJRztRQUNILGNBQWMsQ0FBQyxPQUFvQjtZQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFWixJQUFJLE9BQU8scUJBQXFCLEtBQUssV0FBVyxFQUFFO2dCQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtvQkFDbEMscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDMUI7UUFDSCxDQUFDO1FBRUQseUJBQXlCO1FBQ3pCLElBQUk7WUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM5RCxDQUFDO1FBRUQseUJBQXlCO1FBQ3pCLElBQUk7WUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUM3RCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssVUFBVSxDQUFDLE9BQW9CO1lBQ3JDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFFM0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLENBQUM7S0FDRixDQUFBO0lBN0NZLFNBQVM7UUFQckIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixpQ0FBaUMsRUFBRSxxQ0FBcUM7YUFDekU7U0FDRixDQUFDO1FBS0csV0FBQSxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtRQUMvQixXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTt5Q0FIckIsVUFBVTtZQUNkLE1BQU07T0FIZCxTQUFTLENBNkNyQjtJQUFELGdCQUFDO0tBQUE7U0E3Q1ksU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgTmdab25lLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgYSBhIE1hdElua0JhciBwb3NpdGlvbmVyIG1ldGhvZCwgZGVmaW5pbmcgdGhlIHBvc2l0aW9uaW5nIGFuZCB3aWR0aCBvZiB0aGUgaW5rXG4gKiBiYXIgaW4gYSBzZXQgb2YgdGFicy5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW5hbWUgVXNpbmcgbGVhZGluZyB1bmRlcnNjb3JlIHRvIGRlbm90ZSBpbnRlcm5hbCBpbnRlcmZhY2UuXG5leHBvcnQgaW50ZXJmYWNlIF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogeyBsZWZ0OiBzdHJpbmcsIHdpZHRoOiBzdHJpbmcgfTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiBmb3IgdGhlIE1hdElua0JhcidzIFBvc2l0aW9uZXIuICovXG5leHBvcnQgY29uc3QgX01BVF9JTktfQkFSX1BPU0lUSU9ORVIgPVxuICBuZXcgSW5qZWN0aW9uVG9rZW48X01hdElua0JhclBvc2l0aW9uZXI+KCdNYXRJbmtCYXJQb3NpdGlvbmVyJywge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZXG4gIH0pO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHBvc2l0aW9uZXIgZnVuY3Rpb24gZm9yIHRoZSBNYXRJbmtCYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZKCk6IF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgY29uc3QgbWV0aG9kID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiAoe1xuICAgIGxlZnQ6IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgICB3aWR0aDogZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgfSk7XG5cbiAgcmV0dXJuIG1ldGhvZDtcbn1cblxuLyoqXG4gKiBUaGUgaW5rLWJhciBpcyB1c2VkIHRvIGRpc3BsYXkgYW5kIGFuaW1hdGUgdGhlIGxpbmUgdW5kZXJuZWF0aCB0aGUgY3VycmVudCBhY3RpdmUgdGFiIGxhYmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtaW5rLWJhcicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWluay1iYXInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogYF9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnYCxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5rQmFyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChfTUFUX0lOS19CQVJfUE9TSVRJT05FUikgcHJpdmF0ZSBfaW5rQmFyUG9zaXRpb25lcjogX01hdElua0JhclBvc2l0aW9uZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykgeyB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHN0eWxlcyBmcm9tIHRoZSBwcm92aWRlZCBlbGVtZW50IGluIG9yZGVyIHRvIGFsaWduIHRoZSBpbmstYmFyIHRvIHRoYXQgZWxlbWVudC5cbiAgICogU2hvd3MgdGhlIGluayBiYXIgaWYgcHJldmlvdXNseSBzZXQgYXMgaGlkZGVuLlxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKi9cbiAgYWxpZ25Ub0VsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX3NldFN0eWxlcyhlbGVtZW50KSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0U3R5bGVzKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgaW5rIGJhci4gKi9cbiAgc2hvdygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgfVxuXG4gIC8qKiBIaWRlcyB0aGUgaW5rIGJhci4gKi9cbiAgaGlkZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHByb3BlciBzdHlsZXMgdG8gdGhlIGluayBiYXIgZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIHByaXZhdGUgX3NldFN0eWxlcyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuX2lua0JhclBvc2l0aW9uZXIoZWxlbWVudCk7XG4gICAgY29uc3QgaW5rQmFyOiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlua0Jhci5zdHlsZS5sZWZ0ID0gcG9zaXRpb25zLmxlZnQ7XG4gICAgaW5rQmFyLnN0eWxlLndpZHRoID0gcG9zaXRpb25zLndpZHRoO1xuICB9XG59XG4iXX0=