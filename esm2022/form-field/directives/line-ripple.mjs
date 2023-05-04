/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, NgZone } from '@angular/core';
import * as i0 from "@angular/core";
/** Class added when the line ripple is active. */
const ACTIVATE_CLASS = 'mdc-line-ripple--active';
/** Class added when the line ripple is being deactivated. */
const DEACTIVATING_CLASS = 'mdc-line-ripple--deactivating';
/**
 * Internal directive that creates an instance of the MDC line-ripple component. Using a
 * directive allows us to conditionally render a line-ripple in the template without having
 * to manually create and destroy the `MDCLineRipple` component whenever the condition changes.
 *
 * The directive sets up the styles for the line-ripple and provides an API for activating
 * and deactivating the line-ripple.
 */
class MatFormFieldLineRipple {
    constructor(_elementRef, ngZone) {
        this._elementRef = _elementRef;
        this._handleTransitionEnd = (event) => {
            const classList = this._elementRef.nativeElement.classList;
            const isDeactivating = classList.contains(DEACTIVATING_CLASS);
            if (event.propertyName === 'opacity' && isDeactivating) {
                classList.remove(ACTIVATE_CLASS, DEACTIVATING_CLASS);
            }
        };
        ngZone.runOutsideAngular(() => {
            _elementRef.nativeElement.addEventListener('transitionend', this._handleTransitionEnd);
        });
    }
    activate() {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(DEACTIVATING_CLASS);
        classList.add(ACTIVATE_CLASS);
    }
    deactivate() {
        this._elementRef.nativeElement.classList.add(DEACTIVATING_CLASS);
    }
    ngOnDestroy() {
        this._elementRef.nativeElement.removeEventListener('transitionend', this._handleTransitionEnd);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldLineRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatFormFieldLineRipple, selector: "div[matFormFieldLineRipple]", host: { classAttribute: "mdc-line-ripple" }, ngImport: i0 }); }
}
export { MatFormFieldLineRipple };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldLineRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: 'div[matFormFieldLineRipple]',
                    host: {
                        'class': 'mdc-line-ripple',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1yaXBwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL2xpbmUtcmlwcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBWSxNQUFNLGVBQWUsQ0FBQzs7QUFFdkUsa0RBQWtEO0FBQ2xELE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRWpELDZEQUE2RDtBQUM3RCxNQUFNLGtCQUFrQixHQUFHLCtCQUErQixDQUFDO0FBRTNEOzs7Ozs7O0dBT0c7QUFDSCxNQU1hLHNCQUFzQjtJQUNqQyxZQUFvQixXQUFvQyxFQUFFLE1BQWM7UUFBcEQsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBZ0JoRCx5QkFBb0IsR0FBRyxDQUFDLEtBQXNCLEVBQUUsRUFBRTtZQUN4RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7WUFDM0QsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRTlELElBQUksS0FBSyxDQUFDLFlBQVksS0FBSyxTQUFTLElBQUksY0FBYyxFQUFFO2dCQUN0RCxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2FBQ3REO1FBQ0gsQ0FBQyxDQUFDO1FBdEJBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDNUIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDekYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUMzRCxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDckMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBV0QsV0FBVztRQUNULElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNqRyxDQUFDOzhHQTVCVSxzQkFBc0I7a0dBQXRCLHNCQUFzQjs7U0FBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBTmxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxpQkFBaUI7cUJBQzNCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBOZ1pvbmUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKiBDbGFzcyBhZGRlZCB3aGVuIHRoZSBsaW5lIHJpcHBsZSBpcyBhY3RpdmUuICovXG5jb25zdCBBQ1RJVkFURV9DTEFTUyA9ICdtZGMtbGluZS1yaXBwbGUtLWFjdGl2ZSc7XG5cbi8qKiBDbGFzcyBhZGRlZCB3aGVuIHRoZSBsaW5lIHJpcHBsZSBpcyBiZWluZyBkZWFjdGl2YXRlZC4gKi9cbmNvbnN0IERFQUNUSVZBVElOR19DTEFTUyA9ICdtZGMtbGluZS1yaXBwbGUtLWRlYWN0aXZhdGluZyc7XG5cbi8qKlxuICogSW50ZXJuYWwgZGlyZWN0aXZlIHRoYXQgY3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgTURDIGxpbmUtcmlwcGxlIGNvbXBvbmVudC4gVXNpbmcgYVxuICogZGlyZWN0aXZlIGFsbG93cyB1cyB0byBjb25kaXRpb25hbGx5IHJlbmRlciBhIGxpbmUtcmlwcGxlIGluIHRoZSB0ZW1wbGF0ZSB3aXRob3V0IGhhdmluZ1xuICogdG8gbWFudWFsbHkgY3JlYXRlIGFuZCBkZXN0cm95IHRoZSBgTURDTGluZVJpcHBsZWAgY29tcG9uZW50IHdoZW5ldmVyIHRoZSBjb25kaXRpb24gY2hhbmdlcy5cbiAqXG4gKiBUaGUgZGlyZWN0aXZlIHNldHMgdXAgdGhlIHN0eWxlcyBmb3IgdGhlIGxpbmUtcmlwcGxlIGFuZCBwcm92aWRlcyBhbiBBUEkgZm9yIGFjdGl2YXRpbmdcbiAqIGFuZCBkZWFjdGl2YXRpbmcgdGhlIGxpbmUtcmlwcGxlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdkaXZbbWF0Rm9ybUZpZWxkTGluZVJpcHBsZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1saW5lLXJpcHBsZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZExpbmVSaXBwbGUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Piwgbmdab25lOiBOZ1pvbmUpIHtcbiAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy5faGFuZGxlVHJhbnNpdGlvbkVuZCk7XG4gICAgfSk7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNsYXNzTGlzdC5yZW1vdmUoREVBQ1RJVkFUSU5HX0NMQVNTKTtcbiAgICBjbGFzc0xpc3QuYWRkKEFDVElWQVRFX0NMQVNTKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoREVBQ1RJVkFUSU5HX0NMQVNTKTtcbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZVRyYW5zaXRpb25FbmQgPSAoZXZlbnQ6IFRyYW5zaXRpb25FdmVudCkgPT4ge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY29uc3QgaXNEZWFjdGl2YXRpbmcgPSBjbGFzc0xpc3QuY29udGFpbnMoREVBQ1RJVkFUSU5HX0NMQVNTKTtcblxuICAgIGlmIChldmVudC5wcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5JyAmJiBpc0RlYWN0aXZhdGluZykge1xuICAgICAgY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkFURV9DTEFTUywgREVBQ1RJVkFUSU5HX0NMQVNTKTtcbiAgICB9XG4gIH07XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9oYW5kbGVUcmFuc2l0aW9uRW5kKTtcbiAgfVxufVxuIl19