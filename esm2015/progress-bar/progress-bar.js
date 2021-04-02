/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, inject, InjectionToken, Input, NgZone, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// Boilerplate for applying mixins to MatProgressBar.
/** @docs-private */
class MatProgressBarBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatProgressBarMixinBase = mixinColor(MatProgressBarBase, 'primary');
/**
 * Injection token used to provide the current location to `MatProgressBar`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export const MAT_PROGRESS_BAR_LOCATION = new InjectionToken('mat-progress-bar-location', { providedIn: 'root', factory: MAT_PROGRESS_BAR_LOCATION_FACTORY });
/** @docs-private */
export function MAT_PROGRESS_BAR_LOCATION_FACTORY() {
    const _document = inject(DOCUMENT);
    const _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: () => _location ? (_location.pathname + _location.search) : ''
    };
}
/** Counter used to generate unique IDs for progress bars. */
let progressbarId = 0;
/**
 * `<mat-progress-bar>` component.
 */
export class MatProgressBar extends _MatProgressBarMixinBase {
    constructor(_elementRef, _ngZone, _animationMode, 
    /**
     * @deprecated `location` parameter to be made required.
     * @breaking-change 8.0.0
     */
    location) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._animationMode = _animationMode;
        /** Flag that indicates whether NoopAnimations mode is set to true. */
        this._isNoopAnimation = false;
        this._value = 0;
        this._bufferValue = 0;
        /**
         * Event emitted when animation of the primary progress bar completes. This event will not
         * be emitted when animations are disabled, nor will it be emitted for modes with continuous
         * animations (indeterminate and query).
         */
        this.animationEnd = new EventEmitter();
        /** Reference to animation end subscription to be unsubscribed on destroy. */
        this._animationEndSubscription = Subscription.EMPTY;
        /**
         * Mode of the progress bar.
         *
         * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
         * 'determinate'.
         * Mirrored to mode attribute.
         */
        this.mode = 'determinate';
        /** ID of the progress bar. */
        this.progressbarId = `mat-progress-bar-${progressbarId++}`;
        // We need to prefix the SVG reference with the current path, otherwise they won't work
        // in Safari if the page has a `<base>` tag. Note that we need quotes inside the `url()`,
        // because named route URLs can contain parentheses (see #12338). Also we don't use since
        // we can't tell the difference between whether
        // the consumer is using the hash location strategy or not, because `Location` normalizes
        // both `/#/foo/bar` and `/foo/bar` to the same thing.
        const path = location ? location.getPathname().split('#')[0] : '';
        this._rectangleFillValue = `url('${path}#${this.progressbarId}')`;
        this._isNoopAnimation = _animationMode === 'NoopAnimations';
    }
    /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
    get value() { return this._value; }
    set value(v) {
        this._value = clamp(coerceNumberProperty(v) || 0);
    }
    /** Buffer value of the progress bar. Defaults to zero. */
    get bufferValue() { return this._bufferValue; }
    set bufferValue(v) { this._bufferValue = clamp(v || 0); }
    /** Gets the current transform value for the progress bar's primary indicator. */
    _primaryTransform() {
        // We use a 3d transform to work around some rendering issues in iOS Safari. See #19328.
        const scale = this.value / 100;
        return { transform: `scale3d(${scale}, 1, 1)` };
    }
    /**
     * Gets the current transform value for the progress bar's buffer indicator. Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    _bufferTransform() {
        if (this.mode === 'buffer') {
            // We use a 3d transform to work around some rendering issues in iOS Safari. See #19328.
            const scale = this.bufferValue / 100;
            return { transform: `scale3d(${scale}, 1, 1)` };
        }
        return null;
    }
    ngAfterViewInit() {
        // Run outside angular so change detection didn't get triggered on every transition end
        // instead only on the animation that we care about (primary value bar's transitionend)
        this._ngZone.runOutsideAngular((() => {
            const element = this._primaryValueBar.nativeElement;
            this._animationEndSubscription =
                fromEvent(element, 'transitionend')
                    .pipe(filter(((e) => e.target === element)))
                    .subscribe(() => {
                    if (this.mode === 'determinate' || this.mode === 'buffer') {
                        this._ngZone.run(() => this.animationEnd.next({ value: this.value }));
                    }
                });
        }));
    }
    ngOnDestroy() {
        this._animationEndSubscription.unsubscribe();
    }
}
MatProgressBar.decorators = [
    { type: Component, args: [{
                selector: 'mat-progress-bar',
                exportAs: 'matProgressBar',
                host: {
                    'role': 'progressbar',
                    'aria-valuemin': '0',
                    'aria-valuemax': '100',
                    // set tab index to -1 so screen readers will read the aria-label
                    // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
                    'tabindex': '-1',
                    '[attr.aria-valuenow]': '(mode === "indeterminate" || mode === "query") ? null : value',
                    '[attr.mode]': 'mode',
                    'class': 'mat-progress-bar',
                    '[class._mat-animation-noopable]': '_isNoopAnimation',
                },
                inputs: ['color'],
                template: "<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<div aria-hidden=\"true\">\n  <svg width=\"100%\" height=\"4\" focusable=\"false\" class=\"mat-progress-bar-background mat-progress-bar-element\">\n    <defs>\n      <pattern [id]=\"progressbarId\" x=\"4\" y=\"0\" width=\"8\" height=\"4\" patternUnits=\"userSpaceOnUse\">\n        <circle cx=\"2\" cy=\"2\" r=\"2\"/>\n      </pattern>\n    </defs>\n    <rect [attr.fill]=\"_rectangleFillValue\" width=\"100%\" height=\"100%\"/>\n  </svg>\n  <!--\n    The background div is named as such because it appears below the other divs and is not sized based\n    on values.\n  -->\n  <div class=\"mat-progress-bar-buffer mat-progress-bar-element\" [ngStyle]=\"_bufferTransform()\"></div>\n  <div class=\"mat-progress-bar-primary mat-progress-bar-fill mat-progress-bar-element\" [ngStyle]=\"_primaryTransform()\" #primaryValueBar></div>\n  <div class=\"mat-progress-bar-secondary mat-progress-bar-fill mat-progress-bar-element\"></div>\n</div>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-progress-bar{display:block;height:4px;overflow:hidden;position:relative;transition:opacity 250ms linear;width:100%}._mat-animation-noopable.mat-progress-bar{transition:none;animation:none}.mat-progress-bar .mat-progress-bar-element,.mat-progress-bar .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}.mat-progress-bar .mat-progress-bar-background{width:calc(100% + 10px)}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-background{display:none}.mat-progress-bar .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-buffer{border-top:solid 5px;opacity:.5}.mat-progress-bar .mat-progress-bar-secondary{display:none}.mat-progress-bar .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-fill{border-top:solid 4px}.mat-progress-bar .mat-progress-bar-fill::after{animation:none;content:\"\";display:inline-block;left:0}.mat-progress-bar[dir=rtl],[dir=rtl] .mat-progress-bar{transform:rotateY(180deg)}.mat-progress-bar[mode=query]{transform:rotateZ(180deg)}.mat-progress-bar[mode=query][dir=rtl],[dir=rtl] .mat-progress-bar[mode=query]{transform:rotateZ(180deg) rotateY(180deg)}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-fill,.mat-progress-bar[mode=query] .mat-progress-bar-fill{transition:none}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary,.mat-progress-bar[mode=query] .mat-progress-bar-primary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-translate 2000ms infinite linear;left:-145.166611%}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary,.mat-progress-bar[mode=query] .mat-progress-bar-secondary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-translate 2000ms infinite linear;left:-54.888891%;display:block}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=buffer] .mat-progress-bar-background{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-buffer,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-background{animation:none;transition-duration:1ms}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-8px)}}\n"]
            },] }
];
MatProgressBar.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PROGRESS_BAR_LOCATION,] }] }
];
MatProgressBar.propDecorators = {
    value: [{ type: Input }],
    bufferValue: [{ type: Input }],
    _primaryValueBar: [{ type: ViewChild, args: ['primaryValueBar',] }],
    animationEnd: [{ type: Output }],
    mode: [{ type: Input }]
};
/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsU0FBUyxFQUFjLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFXdEMscURBQXFEO0FBQ3JELG9CQUFvQjtBQUNwQixNQUFNLGtCQUFrQjtJQUN0QixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFJLENBQUM7Q0FDaEQ7QUFFRCxNQUFNLHdCQUF3QixHQUMxQixVQUFVLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFOUM7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsRUFDM0IsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBQyxDQUNqRSxDQUFD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b0JBQ3JCLGVBQWUsRUFBRSxHQUFHO29CQUNwQixlQUFlLEVBQUUsS0FBSztvQkFDdEIsaUVBQWlFO29CQUNqRSwrRkFBK0Y7b0JBQy9GLFVBQVUsRUFBRSxJQUFJO29CQUNoQixzQkFBc0IsRUFBRSwrREFBK0Q7b0JBQ3ZGLGFBQWEsRUFBRSxNQUFNO29CQUNyQixPQUFPLEVBQUUsa0JBQWtCO29CQUMzQixpQ0FBaUMsRUFBRSxrQkFBa0I7aUJBQ3REO2dCQUNELE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDakIscW1DQUFnQztnQkFFaEMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7O1lBOUZDLFVBQVU7WUFNVixNQUFNO3lDQTRGTyxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs0Q0FLeEMsUUFBUSxZQUFJLE1BQU0sU0FBQyx5QkFBeUI7OztvQkFtQnhELEtBQUs7MEJBUUwsS0FBSzsrQkFLTCxTQUFTLFNBQUMsaUJBQWlCOzJCQU8zQixNQUFNO21CQVlOLEtBQUs7O0FBb0RSLHNFQUFzRTtBQUN0RSxTQUFTLEtBQUssQ0FBQyxDQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRztJQUMxQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIGluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBDYW5Db2xvckN0b3IsIG1peGluQ29sb3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogQmVuY2hwcmVzcyB0ZXN0cy5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IEFkZCBBUklBIGF0dHJpYnV0ZXMgZm9yIHByb2dyZXNzIGJhciBcImZvclwiLlxuXG4vKiogTGFzdCBhbmltYXRpb24gZW5kIGRhdGEuICovXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQW5pbWF0aW9uRW5kIHtcbiAgdmFsdWU6IG51bWJlcjtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRQcm9ncmVzc0Jhci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRQcm9ncmVzc0JhckJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxufVxuXG5jb25zdCBfTWF0UHJvZ3Jlc3NCYXJNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXRQcm9ncmVzc0JhckJhc2UgPVxuICAgIG1peGluQ29sb3IoTWF0UHJvZ3Jlc3NCYXJCYXNlLCAncHJpbWFyeScpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIHByb3ZpZGUgdGhlIGN1cnJlbnQgbG9jYXRpb24gdG8gYE1hdFByb2dyZXNzQmFyYC5cbiAqIFVzZWQgdG8gaGFuZGxlIHNlcnZlci1zaWRlIHJlbmRlcmluZyBhbmQgdG8gc3R1YiBvdXQgZHVyaW5nIHVuaXQgdGVzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OID0gbmV3IEluamVjdGlvblRva2VuPE1hdFByb2dyZXNzQmFyTG9jYXRpb24+KFxuICAnbWF0LXByb2dyZXNzLWJhci1sb2NhdGlvbicsXG4gIHtwcm92aWRlZEluOiAncm9vdCcsIGZhY3Rvcnk6IE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT05fRkFDVE9SWX1cbik7XG5cbi8qKlxuICogU3R1YmJlZCBvdXQgbG9jYXRpb24gZm9yIGBNYXRQcm9ncmVzc0JhcmAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbiB7XG4gIGdldFBhdGhuYW1lOiAoKSA9PiBzdHJpbmc7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTl9GQUNUT1JZKCk6IE1hdFByb2dyZXNzQmFyTG9jYXRpb24ge1xuICBjb25zdCBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICBjb25zdCBfbG9jYXRpb24gPSBfZG9jdW1lbnQgPyBfZG9jdW1lbnQubG9jYXRpb24gOiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgbmVlZHMgdG8gYmUgYSBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gYSBwcm9wZXJ0eSwgYmVjYXVzZSBBbmd1bGFyXG4gICAgLy8gd2lsbCBvbmx5IHJlc29sdmUgaXQgb25jZSwgYnV0IHdlIHdhbnQgdGhlIGN1cnJlbnQgcGF0aCBvbiBlYWNoIGNhbGwuXG4gICAgZ2V0UGF0aG5hbWU6ICgpID0+IF9sb2NhdGlvbiA/IChfbG9jYXRpb24ucGF0aG5hbWUgKyBfbG9jYXRpb24uc2VhcmNoKSA6ICcnXG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIFByb2dyZXNzQmFyTW9kZSA9ICdkZXRlcm1pbmF0ZScgfCAnaW5kZXRlcm1pbmF0ZScgfCAnYnVmZmVyJyB8ICdxdWVyeSc7XG5cbi8qKiBDb3VudGVyIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgcHJvZ3Jlc3MgYmFycy4gKi9cbmxldCBwcm9ncmVzc2JhcklkID0gMDtcblxuLyoqXG4gKiBgPG1hdC1wcm9ncmVzcy1iYXI+YCBjb21wb25lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1wcm9ncmVzcy1iYXInLFxuICBleHBvcnRBczogJ21hdFByb2dyZXNzQmFyJyxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ3Byb2dyZXNzYmFyJyxcbiAgICAnYXJpYS12YWx1ZW1pbic6ICcwJyxcbiAgICAnYXJpYS12YWx1ZW1heCc6ICcxMDAnLFxuICAgIC8vIHNldCB0YWIgaW5kZXggdG8gLTEgc28gc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIHRoZSBhcmlhLWxhYmVsXG4gICAgLy8gTm90ZTogdGhlcmUgaXMgYSBrbm93biBpc3N1ZSB3aXRoIEpBV1MgdGhhdCBkb2VzIG5vdCByZWFkIHByb2dyZXNzYmFyIGFyaWEgbGFiZWxzIG9uIEZpcmVGb3hcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICcobW9kZSA9PT0gXCJpbmRldGVybWluYXRlXCIgfHwgbW9kZSA9PT0gXCJxdWVyeVwiKSA/IG51bGwgOiB2YWx1ZScsXG4gICAgJ1thdHRyLm1vZGVdJzogJ21vZGUnLFxuICAgICdjbGFzcyc6ICdtYXQtcHJvZ3Jlc3MtYmFyJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfaXNOb29wQW5pbWF0aW9uJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIHRlbXBsYXRlVXJsOiAncHJvZ3Jlc3MtYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncHJvZ3Jlc3MtYmFyLmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UHJvZ3Jlc3NCYXIgZXh0ZW5kcyBfTWF0UHJvZ3Jlc3NCYXJNaXhpbkJhc2UgaW1wbGVtZW50cyBDYW5Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBgbG9jYXRpb25gIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT04pIGxvY2F0aW9uPzogTWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbikge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gcHJlZml4IHRoZSBTVkcgcmVmZXJlbmNlIHdpdGggdGhlIGN1cnJlbnQgcGF0aCwgb3RoZXJ3aXNlIHRoZXkgd29uJ3Qgd29ya1xuICAgIC8vIGluIFNhZmFyaSBpZiB0aGUgcGFnZSBoYXMgYSBgPGJhc2U+YCB0YWcuIE5vdGUgdGhhdCB3ZSBuZWVkIHF1b3RlcyBpbnNpZGUgdGhlIGB1cmwoKWAsXG5cbiAgICAvLyBiZWNhdXNlIG5hbWVkIHJvdXRlIFVSTHMgY2FuIGNvbnRhaW4gcGFyZW50aGVzZXMgKHNlZSAjMTIzMzgpLiBBbHNvIHdlIGRvbid0IHVzZSBzaW5jZVxuICAgIC8vIHdlIGNhbid0IHRlbGwgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB3aGV0aGVyXG4gICAgLy8gdGhlIGNvbnN1bWVyIGlzIHVzaW5nIHRoZSBoYXNoIGxvY2F0aW9uIHN0cmF0ZWd5IG9yIG5vdCwgYmVjYXVzZSBgTG9jYXRpb25gIG5vcm1hbGl6ZXNcbiAgICAvLyBib3RoIGAvIy9mb28vYmFyYCBhbmQgYC9mb28vYmFyYCB0byB0aGUgc2FtZSB0aGluZy5cbiAgICBjb25zdCBwYXRoID0gbG9jYXRpb24gPyBsb2NhdGlvbi5nZXRQYXRobmFtZSgpLnNwbGl0KCcjJylbMF0gOiAnJztcbiAgICB0aGlzLl9yZWN0YW5nbGVGaWxsVmFsdWUgPSBgdXJsKCcke3BhdGh9IyR7dGhpcy5wcm9ncmVzc2JhcklkfScpYDtcbiAgICB0aGlzLl9pc05vb3BBbmltYXRpb24gPSBfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgfVxuXG4gIC8qKiBGbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgTm9vcEFuaW1hdGlvbnMgbW9kZSBpcyBzZXQgdG8gdHJ1ZS4gKi9cbiAgX2lzTm9vcEFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiBEZWZhdWx0cyB0byB6ZXJvLiBNaXJyb3JlZCB0byBhcmlhLXZhbHVlbm93LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGNsYW1wKGNvZXJjZU51bWJlclByb3BlcnR5KHYpIHx8IDApO1xuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgPSAwO1xuXG4gIC8qKiBCdWZmZXIgdmFsdWUgb2YgdGhlIHByb2dyZXNzIGJhci4gRGVmYXVsdHMgdG8gemVyby4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJ1ZmZlclZhbHVlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9idWZmZXJWYWx1ZTsgfVxuICBzZXQgYnVmZmVyVmFsdWUodjogbnVtYmVyKSB7IHRoaXMuX2J1ZmZlclZhbHVlID0gY2xhbXAodiB8fCAwKTsgfVxuICBwcml2YXRlIF9idWZmZXJWYWx1ZTogbnVtYmVyID0gMDtcblxuICBAVmlld0NoaWxkKCdwcmltYXJ5VmFsdWVCYXInKSBfcHJpbWFyeVZhbHVlQmFyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gYW5pbWF0aW9uIG9mIHRoZSBwcmltYXJ5IHByb2dyZXNzIGJhciBjb21wbGV0ZXMuIFRoaXMgZXZlbnQgd2lsbCBub3RcbiAgICogYmUgZW1pdHRlZCB3aGVuIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLCBub3Igd2lsbCBpdCBiZSBlbWl0dGVkIGZvciBtb2RlcyB3aXRoIGNvbnRpbnVvdXNcbiAgICogYW5pbWF0aW9ucyAoaW5kZXRlcm1pbmF0ZSBhbmQgcXVlcnkpLlxuICAgKi9cbiAgQE91dHB1dCgpIGFuaW1hdGlvbkVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8UHJvZ3Jlc3NBbmltYXRpb25FbmQ+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbmltYXRpb24gZW5kIHN1YnNjcmlwdGlvbiB0byBiZSB1bnN1YnNjcmliZWQgb24gZGVzdHJveS4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uRW5kU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIE1vZGUgb2YgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogSW5wdXQgbXVzdCBiZSBvbmUgb2YgdGhlc2UgdmFsdWVzOiBkZXRlcm1pbmF0ZSwgaW5kZXRlcm1pbmF0ZSwgYnVmZmVyLCBxdWVyeSwgZGVmYXVsdHMgdG9cbiAgICogJ2RldGVybWluYXRlJy5cbiAgICogTWlycm9yZWQgdG8gbW9kZSBhdHRyaWJ1dGUuXG4gICAqL1xuICBASW5wdXQoKSBtb2RlOiBQcm9ncmVzc0Jhck1vZGUgPSAnZGV0ZXJtaW5hdGUnO1xuXG4gIC8qKiBJRCBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiAqL1xuICBwcm9ncmVzc2JhcklkID0gYG1hdC1wcm9ncmVzcy1iYXItJHtwcm9ncmVzc2JhcklkKyt9YDtcblxuICAvKiogQXR0cmlidXRlIHRvIGJlIHVzZWQgZm9yIHRoZSBgZmlsbGAgYXR0cmlidXRlIG9uIHRoZSBpbnRlcm5hbCBgcmVjdGAgZWxlbWVudC4gKi9cbiAgX3JlY3RhbmdsZUZpbGxWYWx1ZTogc3RyaW5nO1xuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHRyYW5zZm9ybSB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhcidzIHByaW1hcnkgaW5kaWNhdG9yLiAqL1xuICBfcHJpbWFyeVRyYW5zZm9ybSgpIHtcbiAgICAvLyBXZSB1c2UgYSAzZCB0cmFuc2Zvcm0gdG8gd29yayBhcm91bmQgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIGlPUyBTYWZhcmkuIFNlZSAjMTkzMjguXG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnZhbHVlIC8gMTAwO1xuICAgIHJldHVybiB7dHJhbnNmb3JtOiBgc2NhbGUzZCgke3NjYWxlfSwgMSwgMSlgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHRyYW5zZm9ybSB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhcidzIGJ1ZmZlciBpbmRpY2F0b3IuIE9ubHkgdXNlZCBpZiB0aGVcbiAgICogcHJvZ3Jlc3MgbW9kZSBpcyBzZXQgdG8gYnVmZmVyLCBvdGhlcndpc2UgcmV0dXJucyBhbiB1bmRlZmluZWQsIGNhdXNpbmcgbm8gdHJhbnNmb3JtYXRpb24uXG4gICAqL1xuICBfYnVmZmVyVHJhbnNmb3JtKCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdidWZmZXInKSB7XG4gICAgICAvLyBXZSB1c2UgYSAzZCB0cmFuc2Zvcm0gdG8gd29yayBhcm91bmQgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIGlPUyBTYWZhcmkuIFNlZSAjMTkzMjguXG4gICAgICBjb25zdCBzY2FsZSA9IHRoaXMuYnVmZmVyVmFsdWUgLyAxMDA7XG4gICAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlM2QoJHtzY2FsZX0sIDEsIDEpYH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIFJ1biBvdXRzaWRlIGFuZ3VsYXIgc28gY2hhbmdlIGRldGVjdGlvbiBkaWRuJ3QgZ2V0IHRyaWdnZXJlZCBvbiBldmVyeSB0cmFuc2l0aW9uIGVuZFxuICAgIC8vIGluc3RlYWQgb25seSBvbiB0aGUgYW5pbWF0aW9uIHRoYXQgd2UgY2FyZSBhYm91dCAocHJpbWFyeSB2YWx1ZSBiYXIncyB0cmFuc2l0aW9uZW5kKVxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX3ByaW1hcnlWYWx1ZUJhci5uYXRpdmVFbGVtZW50O1xuXG4gICAgICB0aGlzLl9hbmltYXRpb25FbmRTdWJzY3JpcHRpb24gPVxuICAgICAgICAoZnJvbUV2ZW50KGVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJykgYXMgT2JzZXJ2YWJsZTxUcmFuc2l0aW9uRXZlbnQ+KVxuICAgICAgICAgIC5waXBlKGZpbHRlcigoKGU6IFRyYW5zaXRpb25FdmVudCkgPT4gZS50YXJnZXQgPT09IGVsZW1lbnQpKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScgfHwgdGhpcy5tb2RlID09PSAnYnVmZmVyJykge1xuICAgICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuYW5pbWF0aW9uRW5kLm5leHQoe3ZhbHVlOiB0aGlzLnZhbHVlfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkVuZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBOdW1iZXJJbnB1dDtcbn1cblxuLyoqIENsYW1wcyBhIHZhbHVlIHRvIGJlIGJldHdlZW4gdHdvIG51bWJlcnMsIGJ5IGRlZmF1bHQgMCBhbmQgMTAwLiAqL1xuZnVuY3Rpb24gY2xhbXAodjogbnVtYmVyLCBtaW4gPSAwLCBtYXggPSAxMDApIHtcbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2KSk7XG59XG4iXX0=