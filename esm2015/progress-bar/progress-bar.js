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
    location) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFXLFVBQVUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxTQUFTLEVBQWMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVd0QyxxREFBcUQ7QUFDckQsb0JBQW9CO0FBQ3BCLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0lBQ3JDLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztDQUMvQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRWQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsRUFDM0IsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBQyxDQUNqRSxDQUFDO0FBVUYsb0JBQW9CO0FBQ3BCLE1BQU0sVUFB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RUFBaUU7b0JBQ2pFLCtGQUErRjtvQkFDL0YsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLHNCQUFzQixFQUFFLCtEQUErRDtvQkFDdkYsYUFBYSxFQUFFLE1BQU07b0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLGlDQUFpQyxFQUFFLGtCQUFrQjtpQkFDdEQ7Z0JBQ0QsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNqQixxbUNBQWdDO2dCQUVoQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7WUEzRkMsVUFBVTtZQU1WLE1BQU07eUNBeUZPLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzRDQUt4QyxRQUFRLFlBQUksTUFBTSxTQUFDLHlCQUF5Qjs7O29CQW1CeEQsS0FBSzswQkFRTCxLQUFLOytCQUtMLFNBQVMsU0FBQyxpQkFBaUI7MkJBTzNCLE1BQU07bUJBWU4sS0FBSzs7QUFvRFIsc0VBQXNFO0FBQ3RFLFNBQVMsS0FBSyxDQUFDLENBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHO0lBQzFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgaW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIG1peGluQ29sb3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogQmVuY2hwcmVzcyB0ZXN0cy5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IEFkZCBBUklBIGF0dHJpYnV0ZXMgZm9yIHByb2dyZXNzIGJhciBcImZvclwiLlxuXG4vKiogTGFzdCBhbmltYXRpb24gZW5kIGRhdGEuICovXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQW5pbWF0aW9uRW5kIHtcbiAgdmFsdWU6IG51bWJlcjtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRQcm9ncmVzc0Jhci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0UHJvZ3Jlc3NCYXJCYXNlID0gbWl4aW5Db2xvcihjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn0sICdwcmltYXJ5Jyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgY3VycmVudCBsb2NhdGlvbiB0byBgTWF0UHJvZ3Jlc3NCYXJgLlxuICogVXNlZCB0byBoYW5kbGUgc2VydmVyLXNpZGUgcmVuZGVyaW5nIGFuZCB0byBzdHViIG91dCBkdXJpbmcgdW5pdCB0ZXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbj4oXG4gICdtYXQtcHJvZ3Jlc3MtYmFyLWxvY2F0aW9uJyxcbiAge3Byb3ZpZGVkSW46ICdyb290JywgZmFjdG9yeTogTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTl9GQUNUT1JZfVxuKTtcblxuLyoqXG4gKiBTdHViYmVkIG91dCBsb2NhdGlvbiBmb3IgYE1hdFByb2dyZXNzQmFyYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQcm9ncmVzc0JhckxvY2F0aW9uIHtcbiAgZ2V0UGF0aG5hbWU6ICgpID0+IHN0cmluZztcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbiB7XG4gIGNvbnN0IF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG4gIGNvbnN0IF9sb2NhdGlvbiA9IF9kb2N1bWVudCA/IF9kb2N1bWVudC5sb2NhdGlvbiA6IG51bGw7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBuZWVkcyB0byBiZSBhIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiBhIHByb3BlcnR5LCBiZWNhdXNlIEFuZ3VsYXJcbiAgICAvLyB3aWxsIG9ubHkgcmVzb2x2ZSBpdCBvbmNlLCBidXQgd2Ugd2FudCB0aGUgY3VycmVudCBwYXRoIG9uIGVhY2ggY2FsbC5cbiAgICBnZXRQYXRobmFtZTogKCkgPT4gX2xvY2F0aW9uID8gKF9sb2NhdGlvbi5wYXRobmFtZSArIF9sb2NhdGlvbi5zZWFyY2gpIDogJydcbiAgfTtcbn1cblxuZXhwb3J0IHR5cGUgUHJvZ3Jlc3NCYXJNb2RlID0gJ2RldGVybWluYXRlJyB8ICdpbmRldGVybWluYXRlJyB8ICdidWZmZXInIHwgJ3F1ZXJ5JztcblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBwcm9ncmVzcyBiYXJzLiAqL1xubGV0IHByb2dyZXNzYmFySWQgPSAwO1xuXG4vKipcbiAqIGA8bWF0LXByb2dyZXNzLWJhcj5gIGNvbXBvbmVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXByb2dyZXNzLWJhcicsXG4gIGV4cG9ydEFzOiAnbWF0UHJvZ3Jlc3NCYXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAncHJvZ3Jlc3NiYXInLFxuICAgICdhcmlhLXZhbHVlbWluJzogJzAnLFxuICAgICdhcmlhLXZhbHVlbWF4JzogJzEwMCcsXG4gICAgLy8gc2V0IHRhYiBpbmRleCB0byAtMSBzbyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgdGhlIGFyaWEtbGFiZWxcbiAgICAvLyBOb3RlOiB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdpdGggSkFXUyB0aGF0IGRvZXMgbm90IHJlYWQgcHJvZ3Jlc3NiYXIgYXJpYSBsYWJlbHMgb24gRmlyZUZveFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVub3ddJzogJyhtb2RlID09PSBcImluZGV0ZXJtaW5hdGVcIiB8fCBtb2RlID09PSBcInF1ZXJ5XCIpID8gbnVsbCA6IHZhbHVlJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnbW9kZScsXG4gICAgJ2NsYXNzJzogJ21hdC1wcm9ncmVzcy1iYXInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19pc05vb3BBbmltYXRpb24nLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy1iYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwcm9ncmVzcy1iYXIuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc0JhciBleHRlbmRzIF9NYXRQcm9ncmVzc0JhckJhc2UgaW1wbGVtZW50cyBDYW5Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgYGxvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OKSBsb2NhdGlvbj86IE1hdFByb2dyZXNzQmFyTG9jYXRpb24pIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gcHJlZml4IHRoZSBTVkcgcmVmZXJlbmNlIHdpdGggdGhlIGN1cnJlbnQgcGF0aCwgb3RoZXJ3aXNlIHRoZXkgd29uJ3Qgd29ya1xuICAgIC8vIGluIFNhZmFyaSBpZiB0aGUgcGFnZSBoYXMgYSBgPGJhc2U+YCB0YWcuIE5vdGUgdGhhdCB3ZSBuZWVkIHF1b3RlcyBpbnNpZGUgdGhlIGB1cmwoKWAsXG5cbiAgICAvLyBiZWNhdXNlIG5hbWVkIHJvdXRlIFVSTHMgY2FuIGNvbnRhaW4gcGFyZW50aGVzZXMgKHNlZSAjMTIzMzgpLiBBbHNvIHdlIGRvbid0IHVzZSBzaW5jZVxuICAgIC8vIHdlIGNhbid0IHRlbGwgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB3aGV0aGVyXG4gICAgLy8gdGhlIGNvbnN1bWVyIGlzIHVzaW5nIHRoZSBoYXNoIGxvY2F0aW9uIHN0cmF0ZWd5IG9yIG5vdCwgYmVjYXVzZSBgTG9jYXRpb25gIG5vcm1hbGl6ZXNcbiAgICAvLyBib3RoIGAvIy9mb28vYmFyYCBhbmQgYC9mb28vYmFyYCB0byB0aGUgc2FtZSB0aGluZy5cbiAgICBjb25zdCBwYXRoID0gbG9jYXRpb24gPyBsb2NhdGlvbi5nZXRQYXRobmFtZSgpLnNwbGl0KCcjJylbMF0gOiAnJztcbiAgICB0aGlzLl9yZWN0YW5nbGVGaWxsVmFsdWUgPSBgdXJsKCcke3BhdGh9IyR7dGhpcy5wcm9ncmVzc2JhcklkfScpYDtcbiAgICB0aGlzLl9pc05vb3BBbmltYXRpb24gPSBfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgfVxuXG4gIC8qKiBGbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgTm9vcEFuaW1hdGlvbnMgbW9kZSBpcyBzZXQgdG8gdHJ1ZS4gKi9cbiAgX2lzTm9vcEFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiBEZWZhdWx0cyB0byB6ZXJvLiBNaXJyb3JlZCB0byBhcmlhLXZhbHVlbm93LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGNsYW1wKGNvZXJjZU51bWJlclByb3BlcnR5KHYpIHx8IDApO1xuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgPSAwO1xuXG4gIC8qKiBCdWZmZXIgdmFsdWUgb2YgdGhlIHByb2dyZXNzIGJhci4gRGVmYXVsdHMgdG8gemVyby4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJ1ZmZlclZhbHVlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9idWZmZXJWYWx1ZTsgfVxuICBzZXQgYnVmZmVyVmFsdWUodjogbnVtYmVyKSB7IHRoaXMuX2J1ZmZlclZhbHVlID0gY2xhbXAodiB8fCAwKTsgfVxuICBwcml2YXRlIF9idWZmZXJWYWx1ZTogbnVtYmVyID0gMDtcblxuICBAVmlld0NoaWxkKCdwcmltYXJ5VmFsdWVCYXInKSBfcHJpbWFyeVZhbHVlQmFyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gYW5pbWF0aW9uIG9mIHRoZSBwcmltYXJ5IHByb2dyZXNzIGJhciBjb21wbGV0ZXMuIFRoaXMgZXZlbnQgd2lsbCBub3RcbiAgICogYmUgZW1pdHRlZCB3aGVuIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLCBub3Igd2lsbCBpdCBiZSBlbWl0dGVkIGZvciBtb2RlcyB3aXRoIGNvbnRpbnVvdXNcbiAgICogYW5pbWF0aW9ucyAoaW5kZXRlcm1pbmF0ZSBhbmQgcXVlcnkpLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8UHJvZ3Jlc3NBbmltYXRpb25FbmQ+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbmltYXRpb24gZW5kIHN1YnNjcmlwdGlvbiB0byBiZSB1bnN1YnNjcmliZWQgb24gZGVzdHJveS4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uRW5kU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIE1vZGUgb2YgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogSW5wdXQgbXVzdCBiZSBvbmUgb2YgdGhlc2UgdmFsdWVzOiBkZXRlcm1pbmF0ZSwgaW5kZXRlcm1pbmF0ZSwgYnVmZmVyLCBxdWVyeSwgZGVmYXVsdHMgdG9cbiAgICogJ2RldGVybWluYXRlJy5cbiAgICogTWlycm9yZWQgdG8gbW9kZSBhdHRyaWJ1dGUuXG4gICAqL1xuICBASW5wdXQoKSBtb2RlOiBQcm9ncmVzc0Jhck1vZGUgPSAnZGV0ZXJtaW5hdGUnO1xuXG4gIC8qKiBJRCBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiAqL1xuICBwcm9ncmVzc2JhcklkID0gYG1hdC1wcm9ncmVzcy1iYXItJHtwcm9ncmVzc2JhcklkKyt9YDtcblxuICAvKiogQXR0cmlidXRlIHRvIGJlIHVzZWQgZm9yIHRoZSBgZmlsbGAgYXR0cmlidXRlIG9uIHRoZSBpbnRlcm5hbCBgcmVjdGAgZWxlbWVudC4gKi9cbiAgX3JlY3RhbmdsZUZpbGxWYWx1ZTogc3RyaW5nO1xuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHRyYW5zZm9ybSB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhcidzIHByaW1hcnkgaW5kaWNhdG9yLiAqL1xuICBfcHJpbWFyeVRyYW5zZm9ybSgpIHtcbiAgICAvLyBXZSB1c2UgYSAzZCB0cmFuc2Zvcm0gdG8gd29yayBhcm91bmQgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIGlPUyBTYWZhcmkuIFNlZSAjMTkzMjguXG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnZhbHVlIC8gMTAwO1xuICAgIHJldHVybiB7dHJhbnNmb3JtOiBgc2NhbGUzZCgke3NjYWxlfSwgMSwgMSlgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHRyYW5zZm9ybSB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhcidzIGJ1ZmZlciBpbmRpY2F0b3IuIE9ubHkgdXNlZCBpZiB0aGVcbiAgICogcHJvZ3Jlc3MgbW9kZSBpcyBzZXQgdG8gYnVmZmVyLCBvdGhlcndpc2UgcmV0dXJucyBhbiB1bmRlZmluZWQsIGNhdXNpbmcgbm8gdHJhbnNmb3JtYXRpb24uXG4gICAqL1xuICBfYnVmZmVyVHJhbnNmb3JtKCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdidWZmZXInKSB7XG4gICAgICAvLyBXZSB1c2UgYSAzZCB0cmFuc2Zvcm0gdG8gd29yayBhcm91bmQgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIGlPUyBTYWZhcmkuIFNlZSAjMTkzMjguXG4gICAgICBjb25zdCBzY2FsZSA9IHRoaXMuYnVmZmVyVmFsdWUgLyAxMDA7XG4gICAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlM2QoJHtzY2FsZX0sIDEsIDEpYH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIFJ1biBvdXRzaWRlIGFuZ3VsYXIgc28gY2hhbmdlIGRldGVjdGlvbiBkaWRuJ3QgZ2V0IHRyaWdnZXJlZCBvbiBldmVyeSB0cmFuc2l0aW9uIGVuZFxuICAgIC8vIGluc3RlYWQgb25seSBvbiB0aGUgYW5pbWF0aW9uIHRoYXQgd2UgY2FyZSBhYm91dCAocHJpbWFyeSB2YWx1ZSBiYXIncyB0cmFuc2l0aW9uZW5kKVxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX3ByaW1hcnlWYWx1ZUJhci5uYXRpdmVFbGVtZW50O1xuXG4gICAgICB0aGlzLl9hbmltYXRpb25FbmRTdWJzY3JpcHRpb24gPVxuICAgICAgICAoZnJvbUV2ZW50KGVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJykgYXMgT2JzZXJ2YWJsZTxUcmFuc2l0aW9uRXZlbnQ+KVxuICAgICAgICAgIC5waXBlKGZpbHRlcigoKGU6IFRyYW5zaXRpb25FdmVudCkgPT4gZS50YXJnZXQgPT09IGVsZW1lbnQpKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScgfHwgdGhpcy5tb2RlID09PSAnYnVmZmVyJykge1xuICAgICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuYW5pbWF0aW9uRW5kLm5leHQoe3ZhbHVlOiB0aGlzLnZhbHVlfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkVuZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBOdW1iZXJJbnB1dDtcbn1cblxuLyoqIENsYW1wcyBhIHZhbHVlIHRvIGJlIGJldHdlZW4gdHdvIG51bWJlcnMsIGJ5IGRlZmF1bHQgMCBhbmQgMTAwLiAqL1xuZnVuY3Rpb24gY2xhbXAodjogbnVtYmVyLCBtaW4gPSAwLCBtYXggPSAxMDApIHtcbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2KSk7XG59XG4iXX0=