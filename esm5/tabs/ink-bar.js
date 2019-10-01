/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, InjectionToken, NgZone, Optional } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/** Injection token for the MatInkBar's Positioner. */
export var _MAT_INK_BAR_POSITIONER = new InjectionToken('MatInkBarPositioner', {
    providedIn: 'root',
    factory: _MAT_INK_BAR_POSITIONER_FACTORY
});
/**
 * The default positioner function for the MatInkBar.
 * @docs-private
 */
export function _MAT_INK_BAR_POSITIONER_FACTORY() {
    var method = function (element) { return ({
        left: element ? (element.offsetLeft || 0) + 'px' : '0',
        width: element ? (element.offsetWidth || 0) + 'px' : '0',
    }); };
    return method;
}
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 */
var MatInkBar = /** @class */ (function () {
    function MatInkBar(_elementRef, _ngZone, _inkBarPositioner, _animationMode) {
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
    MatInkBar.prototype.alignToElement = function (element) {
        var _this = this;
        this.show();
        if (typeof requestAnimationFrame !== 'undefined') {
            this._ngZone.runOutsideAngular(function () {
                requestAnimationFrame(function () { return _this._setStyles(element); });
            });
        }
        else {
            this._setStyles(element);
        }
    };
    /** Shows the ink bar. */
    MatInkBar.prototype.show = function () {
        this._elementRef.nativeElement.style.visibility = 'visible';
    };
    /** Hides the ink bar. */
    MatInkBar.prototype.hide = function () {
        this._elementRef.nativeElement.style.visibility = 'hidden';
    };
    /**
     * Sets the proper styles to the ink bar element.
     * @param element
     */
    MatInkBar.prototype._setStyles = function (element) {
        var positions = this._inkBarPositioner(element);
        var inkBar = this._elementRef.nativeElement;
        inkBar.style.left = positions.left;
        inkBar.style.width = positions.width;
    };
    MatInkBar.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-ink-bar',
                    host: {
                        'class': 'mat-ink-bar',
                        '[class._mat-animation-noopable]': "_animationMode === 'NoopAnimations'",
                    },
                },] }
    ];
    /** @nocollapse */
    MatInkBar.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [_MAT_INK_BAR_POSITIONER,] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    return MatInkBar;
}());
export { MatInkBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBWTNFLHNEQUFzRDtBQUN0RCxNQUFNLENBQUMsSUFBTSx1QkFBdUIsR0FDbEMsSUFBSSxjQUFjLENBQXVCLHFCQUFxQixFQUFFO0lBQzlELFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSwrQkFBK0I7Q0FDekMsQ0FBQyxDQUFDO0FBRUw7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLCtCQUErQjtJQUM3QyxJQUFNLE1BQU0sR0FBRyxVQUFDLE9BQW9CLElBQUssT0FBQSxDQUFDO1FBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7UUFDdEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUN6RCxDQUFDLEVBSHVDLENBR3ZDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0g7SUFRRSxtQkFDVSxXQUFvQyxFQUNwQyxPQUFlLEVBQ2tCLGlCQUF1QyxFQUM5QixjQUF1QjtRQUhqRSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNrQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQXNCO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO0lBQUksQ0FBQztJQUVoRjs7OztPQUlHO0lBQ0gsa0NBQWMsR0FBZCxVQUFlLE9BQW9CO1FBQW5DLGlCQVVDO1FBVEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRVosSUFBSSxPQUFPLHFCQUFxQixLQUFLLFdBQVcsRUFBRTtZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2dCQUM3QixxQkFBcUIsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCLHdCQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUM5RCxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCLHdCQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssOEJBQVUsR0FBbEIsVUFBbUIsT0FBb0I7UUFDckMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQU0sTUFBTSxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUUzRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDdkMsQ0FBQzs7Z0JBbkRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixpQ0FBaUMsRUFBRSxxQ0FBcUM7cUJBQ3pFO2lCQUNGOzs7O2dCQTNDa0IsVUFBVTtnQkFBMEIsTUFBTTtnREFnRHhELE1BQU0sU0FBQyx1QkFBdUI7NkNBQzlCLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOztJQXdDN0MsZ0JBQUM7Q0FBQSxBQXBERCxJQW9EQztTQTdDWSxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBOZ1pvbmUsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBhIGEgTWF0SW5rQmFyIHBvc2l0aW9uZXIgbWV0aG9kLCBkZWZpbmluZyB0aGUgcG9zaXRpb25pbmcgYW5kIHdpZHRoIG9mIHRoZSBpbmtcbiAqIGJhciBpbiBhIHNldCBvZiB0YWJzLlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbmFtZSBVc2luZyBsZWFkaW5nIHVuZGVyc2NvcmUgdG8gZGVub3RlIGludGVybmFsIGludGVyZmFjZS5cbmV4cG9ydCBpbnRlcmZhY2UgX01hdElua0JhclBvc2l0aW9uZXIge1xuICAoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB7IGxlZnQ6IHN0cmluZywgd2lkdGg6IHN0cmluZyB9O1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIGZvciB0aGUgTWF0SW5rQmFyJ3MgUG9zaXRpb25lci4gKi9cbmV4cG9ydCBjb25zdCBfTUFUX0lOS19CQVJfUE9TSVRJT05FUiA9XG4gIG5ldyBJbmplY3Rpb25Ub2tlbjxfTWF0SW5rQmFyUG9zaXRpb25lcj4oJ01hdElua0JhclBvc2l0aW9uZXInLCB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSX0ZBQ1RPUllcbiAgfSk7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgcG9zaXRpb25lciBmdW5jdGlvbiBmb3IgdGhlIE1hdElua0Jhci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSX0ZBQ1RPUlkoKTogX01hdElua0JhclBvc2l0aW9uZXIge1xuICBjb25zdCBtZXRob2QgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+ICh7XG4gICAgbGVmdDogZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldExlZnQgfHwgMCkgKyAncHgnIDogJzAnLFxuICAgIHdpZHRoOiBlbGVtZW50ID8gKGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMCkgKyAncHgnIDogJzAnLFxuICB9KTtcblxuICByZXR1cm4gbWV0aG9kO1xufVxuXG4vKipcbiAqIFRoZSBpbmstYmFyIGlzIHVzZWQgdG8gZGlzcGxheSBhbmQgYW5pbWF0ZSB0aGUgbGluZSB1bmRlcm5lYXRoIHRoZSBjdXJyZW50IGFjdGl2ZSB0YWIgbGFiZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1pbmstYmFyJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtaW5rLWJhcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydgLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJbmtCYXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSKSBwcml2YXRlIF9pbmtCYXJQb3NpdGlvbmVyOiBfTWF0SW5rQmFyUG9zaXRpb25lcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7IH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3R5bGVzIGZyb20gdGhlIHByb3ZpZGVkIGVsZW1lbnQgaW4gb3JkZXIgdG8gYWxpZ24gdGhlIGluay1iYXIgdG8gdGhhdCBlbGVtZW50LlxuICAgKiBTaG93cyB0aGUgaW5rIGJhciBpZiBwcmV2aW91c2x5IHNldCBhcyBoaWRkZW4uXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqL1xuICBhbGlnblRvRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5fc2V0U3R5bGVzKGVsZW1lbnQpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRTdHlsZXMoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNob3dzIHRoZSBpbmsgYmFyLiAqL1xuICBzaG93KCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSBpbmsgYmFyLiAqL1xuICBoaWRlKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcHJvcGVyIHN0eWxlcyB0byB0aGUgaW5rIGJhciBlbGVtZW50LlxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0U3R5bGVzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5faW5rQmFyUG9zaXRpb25lcihlbGVtZW50KTtcbiAgICBjb25zdCBpbmtCYXI6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaW5rQmFyLnN0eWxlLmxlZnQgPSBwb3NpdGlvbnMubGVmdDtcbiAgICBpbmtCYXIuc3R5bGUud2lkdGggPSBwb3NpdGlvbnMud2lkdGg7XG4gIH1cbn1cbiJdfQ==