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
const _MatProgressBarBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}, 'primary');
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
/** Injection token to be used to override the default options for `mat-progress-bar`. */
export const MAT_PROGRESS_BAR_DEFAULT_OPTIONS = new InjectionToken('MAT_PROGRESS_BAR_DEFAULT_OPTIONS');
/** Counter used to generate unique IDs for progress bars. */
let progressbarId = 0;
/**
 * `<mat-progress-bar>` component.
 */
export class MatProgressBar extends _MatProgressBarBase {
    constructor(elementRef, _ngZone, _animationMode, 
    /**
     * @deprecated `location` parameter to be made required.
     * @breaking-change 8.0.0
     */
    location, defaults) {
        super(elementRef);
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
        if (defaults) {
            if (defaults.color) {
                this.color = this.defaultColor = defaults.color;
            }
            this.mode = defaults.mode || this.mode;
        }
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
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PROGRESS_BAR_LOCATION,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PROGRESS_BAR_DEFAULT_OPTIONS,] }] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFXLFVBQVUsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxTQUFTLEVBQWMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVd0QyxxREFBcUQ7QUFDckQsb0JBQW9CO0FBQ3BCLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0lBQ3JDLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztDQUMvQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRWQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsRUFDM0IsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBQyxDQUNqRSxDQUFDO0FBVUYsb0JBQW9CO0FBQ3BCLE1BQU0sVUFB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RSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBpbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgbWl4aW5Db2xvciwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IEJlbmNocHJlc3MgdGVzdHMuXG4vLyBUT0RPKGpvc2VwaHBlcnJvdHQpOiBBZGQgQVJJQSBhdHRyaWJ1dGVzIGZvciBwcm9ncmVzcyBiYXIgXCJmb3JcIi5cblxuLyoqIExhc3QgYW5pbWF0aW9uIGVuZCBkYXRhLiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0FuaW1hdGlvbkVuZCB7XG4gIHZhbHVlOiBudW1iZXI7XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0UHJvZ3Jlc3NCYXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFByb2dyZXNzQmFyQmFzZSA9IG1peGluQ29sb3IoY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59LCAncHJpbWFyeScpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIHByb3ZpZGUgdGhlIGN1cnJlbnQgbG9jYXRpb24gdG8gYE1hdFByb2dyZXNzQmFyYC5cbiAqIFVzZWQgdG8gaGFuZGxlIHNlcnZlci1zaWRlIHJlbmRlcmluZyBhbmQgdG8gc3R1YiBvdXQgZHVyaW5nIHVuaXQgdGVzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OID0gbmV3IEluamVjdGlvblRva2VuPE1hdFByb2dyZXNzQmFyTG9jYXRpb24+KFxuICAnbWF0LXByb2dyZXNzLWJhci1sb2NhdGlvbicsXG4gIHtwcm92aWRlZEluOiAncm9vdCcsIGZhY3Rvcnk6IE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT05fRkFDVE9SWX1cbik7XG5cbi8qKlxuICogU3R1YmJlZCBvdXQgbG9jYXRpb24gZm9yIGBNYXRQcm9ncmVzc0JhcmAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbiB7XG4gIGdldFBhdGhuYW1lOiAoKSA9PiBzdHJpbmc7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTl9GQUNUT1JZKCk6IE1hdFByb2dyZXNzQmFyTG9jYXRpb24ge1xuICBjb25zdCBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICBjb25zdCBfbG9jYXRpb24gPSBfZG9jdW1lbnQgPyBfZG9jdW1lbnQubG9jYXRpb24gOiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgbmVlZHMgdG8gYmUgYSBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gYSBwcm9wZXJ0eSwgYmVjYXVzZSBBbmd1bGFyXG4gICAgLy8gd2lsbCBvbmx5IHJlc29sdmUgaXQgb25jZSwgYnV0IHdlIHdhbnQgdGhlIGN1cnJlbnQgcGF0aCBvbiBlYWNoIGNhbGwuXG4gICAgZ2V0UGF0aG5hbWU6ICgpID0+IF9sb2NhdGlvbiA/IChfbG9jYXRpb24ucGF0aG5hbWUgKyBfbG9jYXRpb24uc2VhcmNoKSA6ICcnXG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIFByb2dyZXNzQmFyTW9kZSA9ICdkZXRlcm1pbmF0ZScgfCAnaW5kZXRlcm1pbmF0ZScgfCAnYnVmZmVyJyB8ICdxdWVyeSc7XG5cbi8qKiBEZWZhdWx0IGBtYXQtcHJvZ3Jlc3MtYmFyYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFByb2dyZXNzQmFyRGVmYXVsdE9wdGlvbnMge1xuICAvKiogRGVmYXVsdCBjb2xvciBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiAqL1xuICBjb2xvcj86IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogRGVmYXVsdCBtb2RlIG9mIHRoZSBwcm9ncmVzcyBiYXIuICovXG4gIG1vZGU/OiBQcm9ncmVzc0Jhck1vZGU7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LXByb2dyZXNzLWJhcmAuICovXG5leHBvcnQgY29uc3QgTUFUX1BST0dSRVNTX0JBUl9ERUZBVUxUX09QVElPTlMgPVxuICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UHJvZ3Jlc3NCYXJEZWZhdWx0T3B0aW9ucz4oJ01BVF9QUk9HUkVTU19CQVJfREVGQVVMVF9PUFRJT05TJyk7XG5cblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBwcm9ncmVzcyBiYXJzLiAqL1xubGV0IHByb2dyZXNzYmFySWQgPSAwO1xuXG4vKipcbiAqIGA8bWF0LXByb2dyZXNzLWJhcj5gIGNvbXBvbmVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXByb2dyZXNzLWJhcicsXG4gIGV4cG9ydEFzOiAnbWF0UHJvZ3Jlc3NCYXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAncHJvZ3Jlc3NiYXInLFxuICAgICdhcmlhLXZhbHVlbWluJzogJzAnLFxuICAgICdhcmlhLXZhbHVlbWF4JzogJzEwMCcsXG4gICAgLy8gc2V0IHRhYiBpbmRleCB0byAtMSBzbyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgdGhlIGFyaWEtbGFiZWxcbiAgICAvLyBOb3RlOiB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdpdGggSkFXUyB0aGF0IGRvZXMgbm90IHJlYWQgcHJvZ3Jlc3NiYXIgYXJpYSBsYWJlbHMgb24gRmlyZUZveFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVub3ddJzogJyhtb2RlID09PSBcImluZGV0ZXJtaW5hdGVcIiB8fCBtb2RlID09PSBcInF1ZXJ5XCIpID8gbnVsbCA6IHZhbHVlJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnbW9kZScsXG4gICAgJ2NsYXNzJzogJ21hdC1wcm9ncmVzcy1iYXInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19pc05vb3BBbmltYXRpb24nLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy1iYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwcm9ncmVzcy1iYXIuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc0JhciBleHRlbmRzIF9NYXRQcm9ncmVzc0JhckJhc2UgaW1wbGVtZW50cyBDYW5Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgYGxvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OKSBsb2NhdGlvbj86IE1hdFByb2dyZXNzQmFyTG9jYXRpb24sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1BST0dSRVNTX0JBUl9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0cz86IE1hdFByb2dyZXNzQmFyRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gcHJlZml4IHRoZSBTVkcgcmVmZXJlbmNlIHdpdGggdGhlIGN1cnJlbnQgcGF0aCwgb3RoZXJ3aXNlIHRoZXkgd29uJ3Qgd29ya1xuICAgIC8vIGluIFNhZmFyaSBpZiB0aGUgcGFnZSBoYXMgYSBgPGJhc2U+YCB0YWcuIE5vdGUgdGhhdCB3ZSBuZWVkIHF1b3RlcyBpbnNpZGUgdGhlIGB1cmwoKWAsXG5cbiAgICAvLyBiZWNhdXNlIG5hbWVkIHJvdXRlIFVSTHMgY2FuIGNvbnRhaW4gcGFyZW50aGVzZXMgKHNlZSAjMTIzMzgpLiBBbHNvIHdlIGRvbid0IHVzZSBzaW5jZVxuICAgIC8vIHdlIGNhbid0IHRlbGwgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB3aGV0aGVyXG4gICAgLy8gdGhlIGNvbnN1bWVyIGlzIHVzaW5nIHRoZSBoYXNoIGxvY2F0aW9uIHN0cmF0ZWd5IG9yIG5vdCwgYmVjYXVzZSBgTG9jYXRpb25gIG5vcm1hbGl6ZXNcbiAgICAvLyBib3RoIGAvIy9mb28vYmFyYCBhbmQgYC9mb28vYmFyYCB0byB0aGUgc2FtZSB0aGluZy5cbiAgICBjb25zdCBwYXRoID0gbG9jYXRpb24gPyBsb2NhdGlvbi5nZXRQYXRobmFtZSgpLnNwbGl0KCcjJylbMF0gOiAnJztcbiAgICB0aGlzLl9yZWN0YW5nbGVGaWxsVmFsdWUgPSBgdXJsKCcke3BhdGh9IyR7dGhpcy5wcm9ncmVzc2JhcklkfScpYDtcbiAgICB0aGlzLl9pc05vb3BBbmltYXRpb24gPSBfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmNvbG9yKSB7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmRlZmF1bHRDb2xvciA9IGRlZmF1bHRzLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vZGUgPSBkZWZhdWx0cy5tb2RlIHx8IHRoaXMubW9kZTtcbiAgICB9XG4gIH1cblxuICAvKiogRmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIE5vb3BBbmltYXRpb25zIG1vZGUgaXMgc2V0IHRvIHRydWUuICovXG4gIF9pc05vb3BBbmltYXRpb24gPSBmYWxzZTtcblxuICAvKiogVmFsdWUgb2YgdGhlIHByb2dyZXNzIGJhci4gRGVmYXVsdHMgdG8gemVyby4gTWlycm9yZWQgdG8gYXJpYS12YWx1ZW5vdy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBjbGFtcChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KSB8fCAwKTtcbiAgfVxuICBwcml2YXRlIF92YWx1ZTogbnVtYmVyID0gMDtcblxuICAvKiogQnVmZmVyIHZhbHVlIG9mIHRoZSBwcm9ncmVzcyBiYXIuIERlZmF1bHRzIHRvIHplcm8uICovXG4gIEBJbnB1dCgpXG4gIGdldCBidWZmZXJWYWx1ZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fYnVmZmVyVmFsdWU7IH1cbiAgc2V0IGJ1ZmZlclZhbHVlKHY6IG51bWJlcikgeyB0aGlzLl9idWZmZXJWYWx1ZSA9IGNsYW1wKHYgfHwgMCk7IH1cbiAgcHJpdmF0ZSBfYnVmZmVyVmFsdWU6IG51bWJlciA9IDA7XG5cbiAgQFZpZXdDaGlsZCgncHJpbWFyeVZhbHVlQmFyJykgX3ByaW1hcnlWYWx1ZUJhcjogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIGFuaW1hdGlvbiBvZiB0aGUgcHJpbWFyeSBwcm9ncmVzcyBiYXIgY29tcGxldGVzLiBUaGlzIGV2ZW50IHdpbGwgbm90XG4gICAqIGJlIGVtaXR0ZWQgd2hlbiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgbm9yIHdpbGwgaXQgYmUgZW1pdHRlZCBmb3IgbW9kZXMgd2l0aCBjb250aW51b3VzXG4gICAqIGFuaW1hdGlvbnMgKGluZGV0ZXJtaW5hdGUgYW5kIHF1ZXJ5KS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25FbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFByb2dyZXNzQW5pbWF0aW9uRW5kPigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYW5pbWF0aW9uIGVuZCBzdWJzY3JpcHRpb24gdG8gYmUgdW5zdWJzY3JpYmVkIG9uIGRlc3Ryb3kuICovXG4gIHByaXZhdGUgX2FuaW1hdGlvbkVuZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBNb2RlIG9mIHRoZSBwcm9ncmVzcyBiYXIuXG4gICAqXG4gICAqIElucHV0IG11c3QgYmUgb25lIG9mIHRoZXNlIHZhbHVlczogZGV0ZXJtaW5hdGUsIGluZGV0ZXJtaW5hdGUsIGJ1ZmZlciwgcXVlcnksIGRlZmF1bHRzIHRvXG4gICAqICdkZXRlcm1pbmF0ZScuXG4gICAqIE1pcnJvcmVkIHRvIG1vZGUgYXR0cmlidXRlLlxuICAgKi9cbiAgQElucHV0KCkgbW9kZTogUHJvZ3Jlc3NCYXJNb2RlID0gJ2RldGVybWluYXRlJztcblxuICAvKiogSUQgb2YgdGhlIHByb2dyZXNzIGJhci4gKi9cbiAgcHJvZ3Jlc3NiYXJJZCA9IGBtYXQtcHJvZ3Jlc3MtYmFyLSR7cHJvZ3Jlc3NiYXJJZCsrfWA7XG5cbiAgLyoqIEF0dHJpYnV0ZSB0byBiZSB1c2VkIGZvciB0aGUgYGZpbGxgIGF0dHJpYnV0ZSBvbiB0aGUgaW50ZXJuYWwgYHJlY3RgIGVsZW1lbnQuICovXG4gIF9yZWN0YW5nbGVGaWxsVmFsdWU6IHN0cmluZztcblxuICAvKiogR2V0cyB0aGUgY3VycmVudCB0cmFuc2Zvcm0gdmFsdWUgZm9yIHRoZSBwcm9ncmVzcyBiYXIncyBwcmltYXJ5IGluZGljYXRvci4gKi9cbiAgX3ByaW1hcnlUcmFuc2Zvcm0oKSB7XG4gICAgLy8gV2UgdXNlIGEgM2QgdHJhbnNmb3JtIHRvIHdvcmsgYXJvdW5kIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBpT1MgU2FmYXJpLiBTZWUgIzE5MzI4LlxuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52YWx1ZSAvIDEwMDtcbiAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlM2QoJHtzY2FsZX0sIDEsIDEpYH07XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCB0cmFuc2Zvcm0gdmFsdWUgZm9yIHRoZSBwcm9ncmVzcyBiYXIncyBidWZmZXIgaW5kaWNhdG9yLiBPbmx5IHVzZWQgaWYgdGhlXG4gICAqIHByb2dyZXNzIG1vZGUgaXMgc2V0IHRvIGJ1ZmZlciwgb3RoZXJ3aXNlIHJldHVybnMgYW4gdW5kZWZpbmVkLCBjYXVzaW5nIG5vIHRyYW5zZm9ybWF0aW9uLlxuICAgKi9cbiAgX2J1ZmZlclRyYW5zZm9ybSgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnYnVmZmVyJykge1xuICAgICAgLy8gV2UgdXNlIGEgM2QgdHJhbnNmb3JtIHRvIHdvcmsgYXJvdW5kIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBpT1MgU2FmYXJpLiBTZWUgIzE5MzI4LlxuICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmJ1ZmZlclZhbHVlIC8gMTAwO1xuICAgICAgcmV0dXJuIHt0cmFuc2Zvcm06IGBzY2FsZTNkKCR7c2NhbGV9LCAxLCAxKWB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBSdW4gb3V0c2lkZSBhbmd1bGFyIHNvIGNoYW5nZSBkZXRlY3Rpb24gZGlkbid0IGdldCB0cmlnZ2VyZWQgb24gZXZlcnkgdHJhbnNpdGlvbiBlbmRcbiAgICAvLyBpbnN0ZWFkIG9ubHkgb24gdGhlIGFuaW1hdGlvbiB0aGF0IHdlIGNhcmUgYWJvdXQgKHByaW1hcnkgdmFsdWUgYmFyJ3MgdHJhbnNpdGlvbmVuZClcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9wcmltYXJ5VmFsdWVCYXIubmF0aXZlRWxlbWVudDtcblxuICAgICAgdGhpcy5fYW5pbWF0aW9uRW5kU3Vic2NyaXB0aW9uID1cbiAgICAgICAgKGZyb21FdmVudChlbGVtZW50LCAndHJhbnNpdGlvbmVuZCcpIGFzIE9ic2VydmFibGU8VHJhbnNpdGlvbkV2ZW50PilcbiAgICAgICAgICAucGlwZShmaWx0ZXIoKChlOiBUcmFuc2l0aW9uRXZlbnQpID0+IGUudGFyZ2V0ID09PSBlbGVtZW50KSkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnIHx8IHRoaXMubW9kZSA9PT0gJ2J1ZmZlcicpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmFuaW1hdGlvbkVuZC5uZXh0KHt2YWx1ZTogdGhpcy52YWx1ZX0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICB9KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9hbmltYXRpb25FbmRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92YWx1ZTogTnVtYmVySW5wdXQ7XG59XG5cbi8qKiBDbGFtcHMgYSB2YWx1ZSB0byBiZSBiZXR3ZWVuIHR3byBudW1iZXJzLCBieSBkZWZhdWx0IDAgYW5kIDEwMC4gKi9cbmZ1bmN0aW9uIGNsYW1wKHY6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMTAwKSB7XG4gIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdikpO1xufVxuIl19