/**
 * @fileoverview added by tsickle
 * Generated from: src/material/progress-bar/progress-bar.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/**
 * Last animation end data.
 * @record
 */
export function ProgressAnimationEnd() { }
if (false) {
    /** @type {?} */
    ProgressAnimationEnd.prototype.value;
}
// Boilerplate for applying mixins to MatProgressBar.
/**
 * \@docs-private
 */
class MatProgressBarBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatProgressBarBase.prototype._elementRef;
}
/** @type {?} */
const _MatProgressBarMixinBase = mixinColor(MatProgressBarBase, 'primary');
/**
 * Injection token used to provide the current location to `MatProgressBar`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * \@docs-private
 * @type {?}
 */
export const MAT_PROGRESS_BAR_LOCATION = new InjectionToken('mat-progress-bar-location', { providedIn: 'root', factory: MAT_PROGRESS_BAR_LOCATION_FACTORY });
/**
 * Stubbed out location for `MatProgressBar`.
 * \@docs-private
 * @record
 */
export function MatProgressBarLocation() { }
if (false) {
    /** @type {?} */
    MatProgressBarLocation.prototype.getPathname;
}
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_PROGRESS_BAR_LOCATION_FACTORY() {
    /** @type {?} */
    const _document = inject(DOCUMENT);
    /** @type {?} */
    const _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: (/**
         * @return {?}
         */
        () => _location ? (_location.pathname + _location.search) : '')
    };
}
/**
 * Counter used to generate unique IDs for progress bars.
 * @type {?}
 */
let progressbarId = 0;
/**
 * `<mat-progress-bar>` component.
 */
let MatProgressBar = /** @class */ (() => {
    /**
     * `<mat-progress-bar>` component.
     */
    class MatProgressBar extends _MatProgressBarMixinBase {
        /**
         * @param {?} _elementRef
         * @param {?} _ngZone
         * @param {?=} _animationMode
         * @param {?=} location
         */
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
            /**
             * Flag that indicates whether NoopAnimations mode is set to true.
             */
            this._isNoopAnimation = false;
            this._value = 0;
            this._bufferValue = 0;
            /**
             * Event emitted when animation of the primary progress bar completes. This event will not
             * be emitted when animations are disabled, nor will it be emitted for modes with continuous
             * animations (indeterminate and query).
             */
            this.animationEnd = new EventEmitter();
            /**
             * Reference to animation end subscription to be unsubscribed on destroy.
             */
            this._animationEndSubscription = Subscription.EMPTY;
            /**
             * Mode of the progress bar.
             *
             * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
             * 'determinate'.
             * Mirrored to mode attribute.
             */
            this.mode = 'determinate';
            /**
             * ID of the progress bar.
             */
            this.progressbarId = `mat-progress-bar-${progressbarId++}`;
            // We need to prefix the SVG reference with the current path, otherwise they won't work
            // in Safari if the page has a `<base>` tag. Note that we need quotes inside the `url()`,
            // because named route URLs can contain parentheses (see #12338). Also we don't use since
            // we can't tell the difference between whether
            // the consumer is using the hash location strategy or not, because `Location` normalizes
            // both `/#/foo/bar` and `/foo/bar` to the same thing.
            /** @type {?} */
            const path = location ? location.getPathname().split('#')[0] : '';
            this._rectangleFillValue = `url('${path}#${this.progressbarId}')`;
            this._isNoopAnimation = _animationMode === 'NoopAnimations';
        }
        /**
         * Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow.
         * @return {?}
         */
        get value() { return this._value; }
        /**
         * @param {?} v
         * @return {?}
         */
        set value(v) {
            this._value = clamp(coerceNumberProperty(v) || 0);
        }
        /**
         * Buffer value of the progress bar. Defaults to zero.
         * @return {?}
         */
        get bufferValue() { return this._bufferValue; }
        /**
         * @param {?} v
         * @return {?}
         */
        set bufferValue(v) { this._bufferValue = clamp(v || 0); }
        /**
         * Gets the current transform value for the progress bar's primary indicator.
         * @return {?}
         */
        _primaryTransform() {
            /** @type {?} */
            const scale = this.value / 100;
            return { transform: `scaleX(${scale})` };
        }
        /**
         * Gets the current transform value for the progress bar's buffer indicator. Only used if the
         * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
         * @return {?}
         */
        _bufferTransform() {
            if (this.mode === 'buffer') {
                /** @type {?} */
                const scale = this.bufferValue / 100;
                return { transform: `scaleX(${scale})` };
            }
            return null;
        }
        /**
         * @return {?}
         */
        ngAfterViewInit() {
            // Run outside angular so change detection didn't get triggered on every transition end
            // instead only on the animation that we care about (primary value bar's transitionend)
            this._ngZone.runOutsideAngular(((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const element = this._primaryValueBar.nativeElement;
                this._animationEndSubscription =
                    ((/** @type {?} */ (fromEvent(element, 'transitionend'))))
                        .pipe(filter(((/**
                     * @param {?} e
                     * @return {?}
                     */
                    (e) => e.target === element))))
                        .subscribe((/**
                     * @return {?}
                     */
                    () => {
                        if (this.mode === 'determinate' || this.mode === 'buffer') {
                            this._ngZone.run((/**
                             * @return {?}
                             */
                            () => this.animationEnd.next({ value: this.value })));
                        }
                    }));
            })));
        }
        /**
         * @return {?}
         */
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
                        '[attr.aria-valuenow]': '(mode === "indeterminate" || mode === "query") ? null : value',
                        '[attr.mode]': 'mode',
                        'class': 'mat-progress-bar',
                        '[class._mat-animation-noopable]': '_isNoopAnimation',
                    },
                    inputs: ['color'],
                    template: "<!--\n  The background div is named as such because it appears below the other divs and is not sized based\n  on values.\n-->\n<svg width=\"100%\" height=\"4\" focusable=\"false\" class=\"mat-progress-bar-background mat-progress-bar-element\">\n  <defs>\n    <pattern [id]=\"progressbarId\" x=\"4\" y=\"0\" width=\"8\" height=\"4\" patternUnits=\"userSpaceOnUse\">\n      <circle cx=\"2\" cy=\"2\" r=\"2\"/>\n    </pattern>\n  </defs>\n  <rect [attr.fill]=\"_rectangleFillValue\" width=\"100%\" height=\"100%\"/>\n</svg>\n<div class=\"mat-progress-bar-buffer mat-progress-bar-element\" [ngStyle]=\"_bufferTransform()\"></div>\n<div class=\"mat-progress-bar-primary mat-progress-bar-fill mat-progress-bar-element\" [ngStyle]=\"_primaryTransform()\" #primaryValueBar></div>\n<div class=\"mat-progress-bar-secondary mat-progress-bar-fill mat-progress-bar-element\"></div>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".mat-progress-bar{display:block;height:4px;overflow:hidden;position:relative;transition:opacity 250ms linear;width:100%}._mat-animation-noopable.mat-progress-bar{transition:none;animation:none}.mat-progress-bar .mat-progress-bar-element,.mat-progress-bar .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}.mat-progress-bar .mat-progress-bar-background{width:calc(100% + 10px)}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-background{display:none}.mat-progress-bar .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-buffer{border-top:solid 5px;opacity:.5}.mat-progress-bar .mat-progress-bar-secondary{display:none}.mat-progress-bar .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-fill{border-top:solid 4px}.mat-progress-bar .mat-progress-bar-fill::after{animation:none;content:\"\";display:inline-block;left:0}.mat-progress-bar[dir=rtl],[dir=rtl] .mat-progress-bar{transform:rotateY(180deg)}.mat-progress-bar[mode=query]{transform:rotateZ(180deg)}.mat-progress-bar[mode=query][dir=rtl],[dir=rtl] .mat-progress-bar[mode=query]{transform:rotateZ(180deg) rotateY(180deg)}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-fill,.mat-progress-bar[mode=query] .mat-progress-bar-fill{transition:none}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary,.mat-progress-bar[mode=query] .mat-progress-bar-primary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-translate 2000ms infinite linear;left:-145.166611%}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary,.mat-progress-bar[mode=query] .mat-progress-bar-secondary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-translate 2000ms infinite linear;left:-54.888891%;display:block}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=buffer] .mat-progress-bar-background{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-buffer,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-background{animation:none;transition-duration:1ms}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-8px)}}\n"]
                }] }
    ];
    /** @nocollapse */
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
    return MatProgressBar;
})();
export { MatProgressBar };
if (false) {
    /** @type {?} */
    MatProgressBar.ngAcceptInputType_value;
    /**
     * Flag that indicates whether NoopAnimations mode is set to true.
     * @type {?}
     */
    MatProgressBar.prototype._isNoopAnimation;
    /**
     * @type {?}
     * @private
     */
    MatProgressBar.prototype._value;
    /**
     * @type {?}
     * @private
     */
    MatProgressBar.prototype._bufferValue;
    /** @type {?} */
    MatProgressBar.prototype._primaryValueBar;
    /**
     * Event emitted when animation of the primary progress bar completes. This event will not
     * be emitted when animations are disabled, nor will it be emitted for modes with continuous
     * animations (indeterminate and query).
     * @type {?}
     */
    MatProgressBar.prototype.animationEnd;
    /**
     * Reference to animation end subscription to be unsubscribed on destroy.
     * @type {?}
     * @private
     */
    MatProgressBar.prototype._animationEndSubscription;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     * @type {?}
     */
    MatProgressBar.prototype.mode;
    /**
     * ID of the progress bar.
     * @type {?}
     */
    MatProgressBar.prototype.progressbarId;
    /**
     * Attribute to be used for the `fill` attribute on the internal `rect` element.
     * @type {?}
     */
    MatProgressBar.prototype._rectangleFillValue;
    /** @type {?} */
    MatProgressBar.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatProgressBar.prototype._ngZone;
    /** @type {?} */
    MatProgressBar.prototype._animationMode;
}
/**
 * Clamps a value to be between two numbers, by default 0 and 100.
 * @param {?} v
 * @param {?=} min
 * @param {?=} max
 * @return {?}
 */
function clamp(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsU0FBUyxFQUFjLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBT3RDLDBDQUVDOzs7SUFEQyxxQ0FBYzs7Ozs7O0FBS2hCLE1BQU0sa0JBQWtCOzs7O0lBQ3RCLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUksQ0FBQztDQUNoRDs7O0lBRGEseUNBQThCOzs7TUFHdEMsd0JBQXdCLEdBQzFCLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLENBQUM7Ozs7Ozs7QUFPN0MsTUFBTSxPQUFPLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsRUFDM0IsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBQyxDQUNqRTs7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Z0M7b0JBRWhDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7aUJBQ3RDOzs7O2dCQTNGQyxVQUFVO2dCQU1WLE1BQU07NkNBeUZPLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCO2dEQUt4QyxRQUFRLFlBQUksTUFBTSxTQUFDLHlCQUF5Qjs7O3dCQW1CeEQsS0FBSzs4QkFRTCxLQUFLO21DQUtMLFNBQVMsU0FBQyxpQkFBaUI7K0JBTzNCLE1BQU07dUJBWU4sS0FBSzs7SUFnRFIscUJBQUM7S0FBQTtTQTNHWSxjQUFjOzs7SUEwR3pCLHVDQUE0Qzs7Ozs7SUFsRjVDLDBDQUF5Qjs7Ozs7SUFRekIsZ0NBQTJCOzs7OztJQU0zQixzQ0FBaUM7O0lBRWpDLDBDQUEyRDs7Ozs7OztJQU8zRCxzQ0FBa0U7Ozs7OztJQUdsRSxtREFBcUU7Ozs7Ozs7OztJQVNyRSw4QkFBK0M7Ozs7O0lBRy9DLHVDQUFzRDs7Ozs7SUFHdEQsNkNBQTRCOztJQS9EaEIscUNBQThCOzs7OztJQUFFLGlDQUF1Qjs7SUFDdkQsd0NBQXlFOzs7Ozs7Ozs7QUEyR3ZGLFNBQVMsS0FBSyxDQUFDLENBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHO0lBQzFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgaW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIENhbkNvbG9yQ3RvciwgbWl4aW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuXG4vLyBUT0RPKGpvc2VwaHBlcnJvdHQpOiBCZW5jaHByZXNzIHRlc3RzLlxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogQWRkIEFSSUEgYXR0cmlidXRlcyBmb3IgcHJvZ3Jlc3MgYmFyIFwiZm9yXCIuXG5cbi8qKiBMYXN0IGFuaW1hdGlvbiBlbmQgZGF0YS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NBbmltYXRpb25FbmQge1xuICB2YWx1ZTogbnVtYmVyO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFByb2dyZXNzQmFyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFByb2dyZXNzQmFyQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG59XG5cbmNvbnN0IF9NYXRQcm9ncmVzc0Jhck1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdFByb2dyZXNzQmFyQmFzZSA9XG4gICAgbWl4aW5Db2xvcihNYXRQcm9ncmVzc0JhckJhc2UsICdwcmltYXJ5Jyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgY3VycmVudCBsb2NhdGlvbiB0byBgTWF0UHJvZ3Jlc3NCYXJgLlxuICogVXNlZCB0byBoYW5kbGUgc2VydmVyLXNpZGUgcmVuZGVyaW5nIGFuZCB0byBzdHViIG91dCBkdXJpbmcgdW5pdCB0ZXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbj4oXG4gICdtYXQtcHJvZ3Jlc3MtYmFyLWxvY2F0aW9uJyxcbiAge3Byb3ZpZGVkSW46ICdyb290JywgZmFjdG9yeTogTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTl9GQUNUT1JZfVxuKTtcblxuLyoqXG4gKiBTdHViYmVkIG91dCBsb2NhdGlvbiBmb3IgYE1hdFByb2dyZXNzQmFyYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQcm9ncmVzc0JhckxvY2F0aW9uIHtcbiAgZ2V0UGF0aG5hbWU6ICgpID0+IHN0cmluZztcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbiB7XG4gIGNvbnN0IF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG4gIGNvbnN0IF9sb2NhdGlvbiA9IF9kb2N1bWVudCA/IF9kb2N1bWVudC5sb2NhdGlvbiA6IG51bGw7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBuZWVkcyB0byBiZSBhIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiBhIHByb3BlcnR5LCBiZWNhdXNlIEFuZ3VsYXJcbiAgICAvLyB3aWxsIG9ubHkgcmVzb2x2ZSBpdCBvbmNlLCBidXQgd2Ugd2FudCB0aGUgY3VycmVudCBwYXRoIG9uIGVhY2ggY2FsbC5cbiAgICBnZXRQYXRobmFtZTogKCkgPT4gX2xvY2F0aW9uID8gKF9sb2NhdGlvbi5wYXRobmFtZSArIF9sb2NhdGlvbi5zZWFyY2gpIDogJydcbiAgfTtcbn1cblxuZXhwb3J0IHR5cGUgUHJvZ3Jlc3NCYXJNb2RlID0gJ2RldGVybWluYXRlJyB8ICdpbmRldGVybWluYXRlJyB8ICdidWZmZXInIHwgJ3F1ZXJ5JztcblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBwcm9ncmVzcyBiYXJzLiAqL1xubGV0IHByb2dyZXNzYmFySWQgPSAwO1xuXG4vKipcbiAqIGA8bWF0LXByb2dyZXNzLWJhcj5gIGNvbXBvbmVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXByb2dyZXNzLWJhcicsXG4gIGV4cG9ydEFzOiAnbWF0UHJvZ3Jlc3NCYXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAncHJvZ3Jlc3NiYXInLFxuICAgICdhcmlhLXZhbHVlbWluJzogJzAnLFxuICAgICdhcmlhLXZhbHVlbWF4JzogJzEwMCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVub3ddJzogJyhtb2RlID09PSBcImluZGV0ZXJtaW5hdGVcIiB8fCBtb2RlID09PSBcInF1ZXJ5XCIpID8gbnVsbCA6IHZhbHVlJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnbW9kZScsXG4gICAgJ2NsYXNzJzogJ21hdC1wcm9ncmVzcy1iYXInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19pc05vb3BBbmltYXRpb24nLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy1iYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwcm9ncmVzcy1iYXIuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc0JhciBleHRlbmRzIF9NYXRQcm9ncmVzc0Jhck1peGluQmFzZSBpbXBsZW1lbnRzIENhbkNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEBkZXByZWNhdGVkIGBsb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTikgbG9jYXRpb24/OiBNYXRQcm9ncmVzc0JhckxvY2F0aW9uKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuXG4gICAgLy8gV2UgbmVlZCB0byBwcmVmaXggdGhlIFNWRyByZWZlcmVuY2Ugd2l0aCB0aGUgY3VycmVudCBwYXRoLCBvdGhlcndpc2UgdGhleSB3b24ndCB3b3JrXG4gICAgLy8gaW4gU2FmYXJpIGlmIHRoZSBwYWdlIGhhcyBhIGA8YmFzZT5gIHRhZy4gTm90ZSB0aGF0IHdlIG5lZWQgcXVvdGVzIGluc2lkZSB0aGUgYHVybCgpYCxcblxuICAgIC8vIGJlY2F1c2UgbmFtZWQgcm91dGUgVVJMcyBjYW4gY29udGFpbiBwYXJlbnRoZXNlcyAoc2VlICMxMjMzOCkuIEFsc28gd2UgZG9uJ3QgdXNlIHNpbmNlXG4gICAgLy8gd2UgY2FuJ3QgdGVsbCB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHdoZXRoZXJcbiAgICAvLyB0aGUgY29uc3VtZXIgaXMgdXNpbmcgdGhlIGhhc2ggbG9jYXRpb24gc3RyYXRlZ3kgb3Igbm90LCBiZWNhdXNlIGBMb2NhdGlvbmAgbm9ybWFsaXplc1xuICAgIC8vIGJvdGggYC8jL2Zvby9iYXJgIGFuZCBgL2Zvby9iYXJgIHRvIHRoZSBzYW1lIHRoaW5nLlxuICAgIGNvbnN0IHBhdGggPSBsb2NhdGlvbiA/IGxvY2F0aW9uLmdldFBhdGhuYW1lKCkuc3BsaXQoJyMnKVswXSA6ICcnO1xuICAgIHRoaXMuX3JlY3RhbmdsZUZpbGxWYWx1ZSA9IGB1cmwoJyR7cGF0aH0jJHt0aGlzLnByb2dyZXNzYmFySWR9JylgO1xuICAgIHRoaXMuX2lzTm9vcEFuaW1hdGlvbiA9IF9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuICB9XG5cbiAgLyoqIEZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBOb29wQW5pbWF0aW9ucyBtb2RlIGlzIHNldCB0byB0cnVlLiAqL1xuICBfaXNOb29wQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBwcm9ncmVzcyBiYXIuIERlZmF1bHRzIHRvIHplcm8uIE1pcnJvcmVkIHRvIGFyaWEtdmFsdWVub3cuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3ZhbHVlID0gY2xhbXAoY29lcmNlTnVtYmVyUHJvcGVydHkodikgfHwgMCk7XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciA9IDA7XG5cbiAgLyoqIEJ1ZmZlciB2YWx1ZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiBEZWZhdWx0cyB0byB6ZXJvLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYnVmZmVyVmFsdWUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2J1ZmZlclZhbHVlOyB9XG4gIHNldCBidWZmZXJWYWx1ZSh2OiBudW1iZXIpIHsgdGhpcy5fYnVmZmVyVmFsdWUgPSBjbGFtcCh2IHx8IDApOyB9XG4gIHByaXZhdGUgX2J1ZmZlclZhbHVlOiBudW1iZXIgPSAwO1xuXG4gIEBWaWV3Q2hpbGQoJ3ByaW1hcnlWYWx1ZUJhcicpIF9wcmltYXJ5VmFsdWVCYXI6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhbmltYXRpb24gb2YgdGhlIHByaW1hcnkgcHJvZ3Jlc3MgYmFyIGNvbXBsZXRlcy4gVGhpcyBldmVudCB3aWxsIG5vdFxuICAgKiBiZSBlbWl0dGVkIHdoZW4gYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIG5vciB3aWxsIGl0IGJlIGVtaXR0ZWQgZm9yIG1vZGVzIHdpdGggY29udGludW91c1xuICAgKiBhbmltYXRpb25zIChpbmRldGVybWluYXRlIGFuZCBxdWVyeSkuXG4gICAqL1xuICBAT3V0cHV0KCkgYW5pbWF0aW9uRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxQcm9ncmVzc0FuaW1hdGlvbkVuZD4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFuaW1hdGlvbiBlbmQgc3Vic2NyaXB0aW9uIHRvIGJlIHVuc3Vic2NyaWJlZCBvbiBkZXN0cm95LiAqL1xuICBwcml2YXRlIF9hbmltYXRpb25FbmRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogTW9kZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLlxuICAgKlxuICAgKiBJbnB1dCBtdXN0IGJlIG9uZSBvZiB0aGVzZSB2YWx1ZXM6IGRldGVybWluYXRlLCBpbmRldGVybWluYXRlLCBidWZmZXIsIHF1ZXJ5LCBkZWZhdWx0cyB0b1xuICAgKiAnZGV0ZXJtaW5hdGUnLlxuICAgKiBNaXJyb3JlZCB0byBtb2RlIGF0dHJpYnV0ZS5cbiAgICovXG4gIEBJbnB1dCgpIG1vZGU6IFByb2dyZXNzQmFyTW9kZSA9ICdkZXRlcm1pbmF0ZSc7XG5cbiAgLyoqIElEIG9mIHRoZSBwcm9ncmVzcyBiYXIuICovXG4gIHByb2dyZXNzYmFySWQgPSBgbWF0LXByb2dyZXNzLWJhci0ke3Byb2dyZXNzYmFySWQrK31gO1xuXG4gIC8qKiBBdHRyaWJ1dGUgdG8gYmUgdXNlZCBmb3IgdGhlIGBmaWxsYCBhdHRyaWJ1dGUgb24gdGhlIGludGVybmFsIGByZWN0YCBlbGVtZW50LiAqL1xuICBfcmVjdGFuZ2xlRmlsbFZhbHVlOiBzdHJpbmc7XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgdHJhbnNmb3JtIHZhbHVlIGZvciB0aGUgcHJvZ3Jlc3MgYmFyJ3MgcHJpbWFyeSBpbmRpY2F0b3IuICovXG4gIF9wcmltYXJ5VHJhbnNmb3JtKCkge1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52YWx1ZSAvIDEwMDtcbiAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlWCgke3NjYWxlfSlgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHRyYW5zZm9ybSB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhcidzIGJ1ZmZlciBpbmRpY2F0b3IuIE9ubHkgdXNlZCBpZiB0aGVcbiAgICogcHJvZ3Jlc3MgbW9kZSBpcyBzZXQgdG8gYnVmZmVyLCBvdGhlcndpc2UgcmV0dXJucyBhbiB1bmRlZmluZWQsIGNhdXNpbmcgbm8gdHJhbnNmb3JtYXRpb24uXG4gICAqL1xuICBfYnVmZmVyVHJhbnNmb3JtKCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdidWZmZXInKSB7XG4gICAgICBjb25zdCBzY2FsZSA9IHRoaXMuYnVmZmVyVmFsdWUgLyAxMDA7XG4gICAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlWCgke3NjYWxlfSlgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gUnVuIG91dHNpZGUgYW5ndWxhciBzbyBjaGFuZ2UgZGV0ZWN0aW9uIGRpZG4ndCBnZXQgdHJpZ2dlcmVkIG9uIGV2ZXJ5IHRyYW5zaXRpb24gZW5kXG4gICAgLy8gaW5zdGVhZCBvbmx5IG9uIHRoZSBhbmltYXRpb24gdGhhdCB3ZSBjYXJlIGFib3V0IChwcmltYXJ5IHZhbHVlIGJhcidzIHRyYW5zaXRpb25lbmQpXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fcHJpbWFyeVZhbHVlQmFyLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIHRoaXMuX2FuaW1hdGlvbkVuZFN1YnNjcmlwdGlvbiA9XG4gICAgICAgIChmcm9tRXZlbnQoZWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnKSBhcyBPYnNlcnZhYmxlPFRyYW5zaXRpb25FdmVudD4pXG4gICAgICAgICAgLnBpcGUoZmlsdGVyKCgoZTogVHJhbnNpdGlvbkV2ZW50KSA9PiBlLnRhcmdldCA9PT0gZWxlbWVudCkpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gJ2RldGVybWluYXRlJyB8fCB0aGlzLm1vZGUgPT09ICdidWZmZXInKSB7XG4gICAgICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5hbmltYXRpb25FbmQubmV4dCh7dmFsdWU6IHRoaXMudmFsdWV9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgfSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IE51bWJlcklucHV0O1xufVxuXG4vKiogQ2xhbXBzIGEgdmFsdWUgdG8gYmUgYmV0d2VlbiB0d28gbnVtYmVycywgYnkgZGVmYXVsdCAwIGFuZCAxMDAuICovXG5mdW5jdGlvbiBjbGFtcCh2OiBudW1iZXIsIG1pbiA9IDAsIG1heCA9IDEwMCkge1xuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHYpKTtcbn1cbiJdfQ==