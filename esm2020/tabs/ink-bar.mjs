/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, InjectionToken, NgZone, Optional } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
/** Injection token for the MatInkBar's Positioner. */
export const _MAT_INK_BAR_POSITIONER = new InjectionToken('MatInkBarPositioner', {
    providedIn: 'root',
    factory: _MAT_INK_BAR_POSITIONER_FACTORY,
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
        // `onStable` might not run for a while if the zone has already stabilized.
        // Wrap the call in `NgZone.run` to ensure that it runs relatively soon.
        this._ngZone.run(() => {
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                const positions = this._inkBarPositioner(element);
                const inkBar = this._elementRef.nativeElement;
                inkBar.style.left = positions.left;
                inkBar.style.width = positions.width;
            });
        });
    }
    /** Shows the ink bar. */
    show() {
        this._elementRef.nativeElement.style.visibility = 'visible';
    }
    /** Hides the ink bar. */
    hide() {
        this._elementRef.nativeElement.style.visibility = 'hidden';
    }
}
MatInkBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatInkBar, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: _MAT_INK_BAR_POSITIONER }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatInkBar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: MatInkBar, selector: "mat-ink-bar", host: { properties: { "class._mat-animation-noopable": "_animationMode === 'NoopAnimations'" }, classAttribute: "mat-ink-bar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatInkBar, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFVcEMsc0RBQXNEO0FBQ3RELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUN2RCxxQkFBcUIsRUFDckI7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsK0JBQStCO0NBQ3pDLENBQ0YsQ0FBQztBQUVGOzs7R0FHRztBQUNILE1BQU0sVUFBVSwrQkFBK0I7SUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7UUFDdEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUN6RCxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7OztHQUdHO0FBUUgsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFDVSxXQUFvQyxFQUNwQyxPQUFlLEVBQ2tCLGlCQUF1QyxFQUM5QixjQUF1QjtRQUhqRSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNrQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQXNCO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO0lBQ3hFLENBQUM7SUFFSjs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLE9BQW9CO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVaLDJFQUEyRTtRQUMzRSx3RUFBd0U7UUFDeEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNqRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO2dCQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCLElBQUk7UUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUM5RCxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCLElBQUk7UUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztJQUM3RCxDQUFDOztzR0FwQ1UsU0FBUyxrRUFJVix1QkFBdUIsYUFDWCxxQkFBcUI7MEZBTGhDLFNBQVM7MkZBQVQsU0FBUztrQkFQckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixpQ0FBaUMsRUFBRSxxQ0FBcUM7cUJBQ3pFO2lCQUNGOzswQkFLSSxNQUFNOzJCQUFDLHVCQUF1Qjs7MEJBQzlCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBOZ1pvbmUsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBhIGEgTWF0SW5rQmFyIHBvc2l0aW9uZXIgbWV0aG9kLCBkZWZpbmluZyB0aGUgcG9zaXRpb25pbmcgYW5kIHdpZHRoIG9mIHRoZSBpbmtcbiAqIGJhciBpbiBhIHNldCBvZiB0YWJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KToge2xlZnQ6IHN0cmluZzsgd2lkdGg6IHN0cmluZ307XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gZm9yIHRoZSBNYXRJbmtCYXIncyBQb3NpdGlvbmVyLiAqL1xuZXhwb3J0IGNvbnN0IF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSID0gbmV3IEluamVjdGlvblRva2VuPF9NYXRJbmtCYXJQb3NpdGlvbmVyPihcbiAgJ01hdElua0JhclBvc2l0aW9uZXInLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHBvc2l0aW9uZXIgZnVuY3Rpb24gZm9yIHRoZSBNYXRJbmtCYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZKCk6IF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgY29uc3QgbWV0aG9kID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiAoe1xuICAgIGxlZnQ6IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgICB3aWR0aDogZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgfSk7XG5cbiAgcmV0dXJuIG1ldGhvZDtcbn1cblxuLyoqXG4gKiBUaGUgaW5rLWJhciBpcyB1c2VkIHRvIGRpc3BsYXkgYW5kIGFuaW1hdGUgdGhlIGxpbmUgdW5kZXJuZWF0aCB0aGUgY3VycmVudCBhY3RpdmUgdGFiIGxhYmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtaW5rLWJhcicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWluay1iYXInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogYF9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnYCxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5rQmFyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChfTUFUX0lOS19CQVJfUE9TSVRJT05FUikgcHJpdmF0ZSBfaW5rQmFyUG9zaXRpb25lcjogX01hdElua0JhclBvc2l0aW9uZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzdHlsZXMgZnJvbSB0aGUgcHJvdmlkZWQgZWxlbWVudCBpbiBvcmRlciB0byBhbGlnbiB0aGUgaW5rLWJhciB0byB0aGF0IGVsZW1lbnQuXG4gICAqIFNob3dzIHRoZSBpbmsgYmFyIGlmIHByZXZpb3VzbHkgc2V0IGFzIGhpZGRlbi5cbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIGFsaWduVG9FbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICAvLyBgb25TdGFibGVgIG1pZ2h0IG5vdCBydW4gZm9yIGEgd2hpbGUgaWYgdGhlIHpvbmUgaGFzIGFscmVhZHkgc3RhYmlsaXplZC5cbiAgICAvLyBXcmFwIHRoZSBjYWxsIGluIGBOZ1pvbmUucnVuYCB0byBlbnN1cmUgdGhhdCBpdCBydW5zIHJlbGF0aXZlbHkgc29vbi5cbiAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuX2lua0JhclBvc2l0aW9uZXIoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGlua0JhciA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaW5rQmFyLnN0eWxlLmxlZnQgPSBwb3NpdGlvbnMubGVmdDtcbiAgICAgICAgaW5rQmFyLnN0eWxlLndpZHRoID0gcG9zaXRpb25zLndpZHRoO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2hvd3MgdGhlIGluayBiYXIuICovXG4gIHNob3coKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIGluayBiYXIuICovXG4gIGhpZGUoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgfVxufVxuIl19