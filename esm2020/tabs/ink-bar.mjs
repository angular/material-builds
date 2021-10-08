/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, InjectionToken, NgZone, Optional } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
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
export class MatInkBar {
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
}
MatInkBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatInkBar, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: _MAT_INK_BAR_POSITIONER }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatInkBar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatInkBar, selector: "mat-ink-bar", host: { properties: { "class._mat-animation-noopable": "_animationMode === 'NoopAnimations'" }, classAttribute: "mat-ink-bar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatInkBar, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-ink-bar',
                    host: {
                        'class': 'mat-ink-bar',
                        '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [_MAT_INK_BAR_POSITIONER]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOztBQVczRSxzREFBc0Q7QUFDdEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQ2xDLElBQUksY0FBYyxDQUF1QixxQkFBcUIsRUFBRTtJQUM5RCxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsK0JBQStCO0NBQ3pDLENBQUMsQ0FBQztBQUVMOzs7R0FHRztBQUNILE1BQU0sVUFBVSwrQkFBK0I7SUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7UUFDdEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUN6RCxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7OztHQUdHO0FBUUgsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFDVSxXQUFvQyxFQUNwQyxPQUFlLEVBQ2tCLGlCQUF1QyxFQUM5QixjQUF1QjtRQUhqRSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNrQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQXNCO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO0lBQUksQ0FBQztJQUVoRjs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLE9BQW9CO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVaLElBQUksT0FBTyxxQkFBcUIsS0FBSyxXQUFXLEVBQUU7WUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUQsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7T0FHRztJQUNLLFVBQVUsQ0FBQyxPQUFvQjtRQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsTUFBTSxNQUFNLEdBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBRTNELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUN2QyxDQUFDOzs4R0E1Q1UsU0FBUyxrRUFJVix1QkFBdUIsYUFDWCxxQkFBcUI7a0dBTGhDLFNBQVM7bUdBQVQsU0FBUztrQkFQckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixpQ0FBaUMsRUFBRSxxQ0FBcUM7cUJBQ3pFO2lCQUNGOzswQkFLSSxNQUFNOzJCQUFDLHVCQUF1Qjs7MEJBQzlCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBOZ1pvbmUsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBhIGEgTWF0SW5rQmFyIHBvc2l0aW9uZXIgbWV0aG9kLCBkZWZpbmluZyB0aGUgcG9zaXRpb25pbmcgYW5kIHdpZHRoIG9mIHRoZSBpbmtcbiAqIGJhciBpbiBhIHNldCBvZiB0YWJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogeyBsZWZ0OiBzdHJpbmcsIHdpZHRoOiBzdHJpbmcgfTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiBmb3IgdGhlIE1hdElua0JhcidzIFBvc2l0aW9uZXIuICovXG5leHBvcnQgY29uc3QgX01BVF9JTktfQkFSX1BPU0lUSU9ORVIgPVxuICBuZXcgSW5qZWN0aW9uVG9rZW48X01hdElua0JhclBvc2l0aW9uZXI+KCdNYXRJbmtCYXJQb3NpdGlvbmVyJywge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZXG4gIH0pO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHBvc2l0aW9uZXIgZnVuY3Rpb24gZm9yIHRoZSBNYXRJbmtCYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZKCk6IF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgY29uc3QgbWV0aG9kID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiAoe1xuICAgIGxlZnQ6IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgICB3aWR0aDogZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgfSk7XG5cbiAgcmV0dXJuIG1ldGhvZDtcbn1cblxuLyoqXG4gKiBUaGUgaW5rLWJhciBpcyB1c2VkIHRvIGRpc3BsYXkgYW5kIGFuaW1hdGUgdGhlIGxpbmUgdW5kZXJuZWF0aCB0aGUgY3VycmVudCBhY3RpdmUgdGFiIGxhYmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtaW5rLWJhcicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWluay1iYXInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogYF9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnYCxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5rQmFyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChfTUFUX0lOS19CQVJfUE9TSVRJT05FUikgcHJpdmF0ZSBfaW5rQmFyUG9zaXRpb25lcjogX01hdElua0JhclBvc2l0aW9uZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykgeyB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHN0eWxlcyBmcm9tIHRoZSBwcm92aWRlZCBlbGVtZW50IGluIG9yZGVyIHRvIGFsaWduIHRoZSBpbmstYmFyIHRvIHRoYXQgZWxlbWVudC5cbiAgICogU2hvd3MgdGhlIGluayBiYXIgaWYgcHJldmlvdXNseSBzZXQgYXMgaGlkZGVuLlxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKi9cbiAgYWxpZ25Ub0VsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX3NldFN0eWxlcyhlbGVtZW50KSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0U3R5bGVzKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgaW5rIGJhci4gKi9cbiAgc2hvdygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgfVxuXG4gIC8qKiBIaWRlcyB0aGUgaW5rIGJhci4gKi9cbiAgaGlkZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHByb3BlciBzdHlsZXMgdG8gdGhlIGluayBiYXIgZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIHByaXZhdGUgX3NldFN0eWxlcyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuX2lua0JhclBvc2l0aW9uZXIoZWxlbWVudCk7XG4gICAgY29uc3QgaW5rQmFyOiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlua0Jhci5zdHlsZS5sZWZ0ID0gcG9zaXRpb25zLmxlZnQ7XG4gICAgaW5rQmFyLnN0eWxlLndpZHRoID0gcG9zaXRpb25zLndpZHRoO1xuICB9XG59XG4iXX0=