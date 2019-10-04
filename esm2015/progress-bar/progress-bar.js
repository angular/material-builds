/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectionStrategy, ElementRef, Inject, Input, Output, EventEmitter, Optional, NgZone, ViewEncapsulation, ViewChild, InjectionToken, inject, } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { mixinColor } from '@angular/material/core';
import { DOCUMENT } from '@angular/common';
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
export class MatProgressBar extends _MatProgressBarMixinBase {
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
        this._value = clamp(v || 0);
        // When noop animation is set to true, trigger animationEnd directly.
        if (this._isNoopAnimation) {
            this._emitAnimationEnd();
        }
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
        return undefined;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (!this._isNoopAnimation) {
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
                    () => this._ngZone.run((/**
                     * @return {?}
                     */
                    () => this._emitAnimationEnd()))));
            })));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._animationEndSubscription.unsubscribe();
    }
    /**
     * Emit an animationEnd event if in determinate or buffer mode.
     * @private
     * @return {?}
     */
    _emitAnimationEnd() {
        if (this.mode === 'determinate' || this.mode === 'buffer') {
            this.animationEnd.next({ value: this.value });
        }
    }
}
MatProgressBar.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
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
                styles: [".mat-progress-bar{display:block;height:4px;overflow:hidden;position:relative;transition:opacity 250ms linear;width:100%}._mat-animation-noopable.mat-progress-bar{transition:none;animation:none}.mat-progress-bar .mat-progress-bar-element,.mat-progress-bar .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}.mat-progress-bar .mat-progress-bar-background{width:calc(100% + 10px)}@media(-ms-high-contrast: active){.mat-progress-bar .mat-progress-bar-background{display:none}}.mat-progress-bar .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease}@media(-ms-high-contrast: active){.mat-progress-bar .mat-progress-bar-buffer{border-top:solid 5px;opacity:.5}}.mat-progress-bar .mat-progress-bar-secondary{display:none}.mat-progress-bar .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease}@media(-ms-high-contrast: active){.mat-progress-bar .mat-progress-bar-fill{border-top:solid 4px}}.mat-progress-bar .mat-progress-bar-fill::after{animation:none;content:\"\";display:inline-block;left:0}.mat-progress-bar[dir=rtl],[dir=rtl] .mat-progress-bar{transform:rotateY(180deg)}.mat-progress-bar[mode=query]{transform:rotateZ(180deg)}.mat-progress-bar[mode=query][dir=rtl],[dir=rtl] .mat-progress-bar[mode=query]{transform:rotateZ(180deg) rotateY(180deg)}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-fill,.mat-progress-bar[mode=query] .mat-progress-bar-fill{transition:none}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary,.mat-progress-bar[mode=query] .mat-progress-bar-primary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-translate 2000ms infinite linear;left:-145.166611%}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary,.mat-progress-bar[mode=query] .mat-progress-bar-secondary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-translate 2000ms infinite linear;left:-54.888891%;display:block}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=buffer] .mat-progress-bar-background{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-buffer,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-background{animation:none;transition:none}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-8px)}}\n"]
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
    _primaryValueBar: [{ type: ViewChild, args: ['primaryValueBar', { static: false },] }],
    animationEnd: [{ type: Output }],
    mode: [{ type: Input }]
};
if (false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEVBRWpCLFNBQVMsRUFFVCxjQUFjLEVBQ2QsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQXlCLFVBQVUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7QUFNekMsMENBRUM7OztJQURDLHFDQUFjOzs7Ozs7QUFLaEIsTUFBTSxrQkFBa0I7Ozs7SUFDdEIsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBSSxDQUFDO0NBQ2hEOzs7SUFEYSx5Q0FBOEI7OztNQUd0Qyx3QkFBd0IsR0FDMUIsVUFBVSxDQUFDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQzs7Ozs7OztBQU83QyxNQUFNLE9BQU8seUJBQXlCLEdBQUcsSUFBSSxjQUFjLENBQ3pELDJCQUEyQixFQUMzQixFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFDLENBQ2pFOzs7Ozs7QUFNRCw0Q0FFQzs7O0lBREMsNkNBQTBCOzs7Ozs7QUFJNUIsTUFBTSxV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QUUsK0RBQStEO29CQUN2RixhQUFhLEVBQUUsTUFBTTtvQkFDckIsT0FBTyxFQUFFLGtCQUFrQjtvQkFDM0IsaUNBQWlDLEVBQUUsa0JBQWtCO2lCQUN0RDtnQkFDRCxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLGszQkFBZ0M7Z0JBRWhDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7Ozs7WUE1RkMsVUFBVTtZQU1WLE1BQU07eUNBMEZPLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzRDQUt4QyxRQUFRLFlBQUksTUFBTSxTQUFDLHlCQUF5Qjs7O29CQW1CeEQsS0FBSzswQkFhTCxLQUFLOytCQUtMLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7MkJBTzVDLE1BQU07bUJBWU4sS0FBSzs7Ozs7OztJQXhDTiwwQ0FBeUI7Ozs7O0lBYXpCLGdDQUEyQjs7Ozs7SUFNM0Isc0NBQWlDOztJQUVqQywwQ0FBNEU7Ozs7Ozs7SUFPNUUsc0NBQWtFOzs7Ozs7SUFHbEUsbURBQXFFOzs7Ozs7Ozs7SUFTckUsOEJBQW9GOzs7OztJQUdwRix1Q0FBc0Q7Ozs7O0lBR3RELDZDQUE0Qjs7SUFwRWhCLHFDQUE4Qjs7Ozs7SUFBRSxpQ0FBdUI7O0lBQ3ZELHdDQUF5RTs7Ozs7Ozs7O0FBbUh2RixTQUFTLEtBQUssQ0FBQyxDQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRztJQUMxQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIE9wdGlvbmFsLFxuICBOZ1pvbmUsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlclZpZXdJbml0LFxuICBWaWV3Q2hpbGQsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgU3Vic2NyaXB0aW9uLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7Q2FuQ29sb3IsIENhbkNvbG9yQ3RvciwgbWl4aW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vLyBUT0RPKGpvc2VwaHBlcnJvdHQpOiBCZW5jaHByZXNzIHRlc3RzLlxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogQWRkIEFSSUEgYXR0cmlidXRlcyBmb3IgcHJvZ3Jlc3MgYmFyIFwiZm9yXCIuXG5cbi8qKiBMYXN0IGFuaW1hdGlvbiBlbmQgZGF0YS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NBbmltYXRpb25FbmQge1xuICB2YWx1ZTogbnVtYmVyO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFByb2dyZXNzQmFyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFByb2dyZXNzQmFyQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG59XG5cbmNvbnN0IF9NYXRQcm9ncmVzc0Jhck1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdFByb2dyZXNzQmFyQmFzZSA9XG4gICAgbWl4aW5Db2xvcihNYXRQcm9ncmVzc0JhckJhc2UsICdwcmltYXJ5Jyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgY3VycmVudCBsb2NhdGlvbiB0byBgTWF0UHJvZ3Jlc3NCYXJgLlxuICogVXNlZCB0byBoYW5kbGUgc2VydmVyLXNpZGUgcmVuZGVyaW5nIGFuZCB0byBzdHViIG91dCBkdXJpbmcgdW5pdCB0ZXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbj4oXG4gICdtYXQtcHJvZ3Jlc3MtYmFyLWxvY2F0aW9uJyxcbiAge3Byb3ZpZGVkSW46ICdyb290JywgZmFjdG9yeTogTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTl9GQUNUT1JZfVxuKTtcblxuLyoqXG4gKiBTdHViYmVkIG91dCBsb2NhdGlvbiBmb3IgYE1hdFByb2dyZXNzQmFyYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQcm9ncmVzc0JhckxvY2F0aW9uIHtcbiAgZ2V0UGF0aG5hbWU6ICgpID0+IHN0cmluZztcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0UHJvZ3Jlc3NCYXJMb2NhdGlvbiB7XG4gIGNvbnN0IF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG4gIGNvbnN0IF9sb2NhdGlvbiA9IF9kb2N1bWVudCA/IF9kb2N1bWVudC5sb2NhdGlvbiA6IG51bGw7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBuZWVkcyB0byBiZSBhIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiBhIHByb3BlcnR5LCBiZWNhdXNlIEFuZ3VsYXJcbiAgICAvLyB3aWxsIG9ubHkgcmVzb2x2ZSBpdCBvbmNlLCBidXQgd2Ugd2FudCB0aGUgY3VycmVudCBwYXRoIG9uIGVhY2ggY2FsbC5cbiAgICBnZXRQYXRobmFtZTogKCkgPT4gX2xvY2F0aW9uID8gKF9sb2NhdGlvbi5wYXRobmFtZSArIF9sb2NhdGlvbi5zZWFyY2gpIDogJydcbiAgfTtcbn1cblxuXG4vKiogQ291bnRlciB1c2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIHByb2dyZXNzIGJhcnMuICovXG5sZXQgcHJvZ3Jlc3NiYXJJZCA9IDA7XG5cbi8qKlxuICogYDxtYXQtcHJvZ3Jlc3MtYmFyPmAgY29tcG9uZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtcHJvZ3Jlc3MtYmFyJyxcbiAgZXhwb3J0QXM6ICdtYXRQcm9ncmVzc0JhcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdwcm9ncmVzc2JhcicsXG4gICAgJ2FyaWEtdmFsdWVtaW4nOiAnMCcsXG4gICAgJ2FyaWEtdmFsdWVtYXgnOiAnMTAwJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnKG1vZGUgPT09IFwiaW5kZXRlcm1pbmF0ZVwiIHx8IG1vZGUgPT09IFwicXVlcnlcIikgPyBudWxsIDogdmFsdWUnLFxuICAgICdbYXR0ci5tb2RlXSc6ICdtb2RlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXByb2dyZXNzLWJhcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2lzTm9vcEFuaW1hdGlvbicsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzLWJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Byb2dyZXNzLWJhci5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFByb2dyZXNzQmFyIGV4dGVuZHMgX01hdFByb2dyZXNzQmFyTWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgYGxvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OKSBsb2NhdGlvbj86IE1hdFByb2dyZXNzQmFyTG9jYXRpb24pIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByZWZpeCB0aGUgU1ZHIHJlZmVyZW5jZSB3aXRoIHRoZSBjdXJyZW50IHBhdGgsIG90aGVyd2lzZSB0aGV5IHdvbid0IHdvcmtcbiAgICAvLyBpbiBTYWZhcmkgaWYgdGhlIHBhZ2UgaGFzIGEgYDxiYXNlPmAgdGFnLiBOb3RlIHRoYXQgd2UgbmVlZCBxdW90ZXMgaW5zaWRlIHRoZSBgdXJsKClgLFxuXG4gICAgLy8gYmVjYXVzZSBuYW1lZCByb3V0ZSBVUkxzIGNhbiBjb250YWluIHBhcmVudGhlc2VzIChzZWUgIzEyMzM4KS4gQWxzbyB3ZSBkb24ndCB1c2Ugc2luY2VcbiAgICAvLyB3ZSBjYW4ndCB0ZWxsIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gd2hldGhlclxuICAgIC8vIHRoZSBjb25zdW1lciBpcyB1c2luZyB0aGUgaGFzaCBsb2NhdGlvbiBzdHJhdGVneSBvciBub3QsIGJlY2F1c2UgYExvY2F0aW9uYCBub3JtYWxpemVzXG4gICAgLy8gYm90aCBgLyMvZm9vL2JhcmAgYW5kIGAvZm9vL2JhcmAgdG8gdGhlIHNhbWUgdGhpbmcuXG4gICAgY29uc3QgcGF0aCA9IGxvY2F0aW9uID8gbG9jYXRpb24uZ2V0UGF0aG5hbWUoKS5zcGxpdCgnIycpWzBdIDogJyc7XG4gICAgdGhpcy5fcmVjdGFuZ2xlRmlsbFZhbHVlID0gYHVybCgnJHtwYXRofSMke3RoaXMucHJvZ3Jlc3NiYXJJZH0nKWA7XG4gICAgdGhpcy5faXNOb29wQW5pbWF0aW9uID0gX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gIH1cblxuICAvKiogRmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIE5vb3BBbmltYXRpb25zIG1vZGUgaXMgc2V0IHRvIHRydWUuICovXG4gIF9pc05vb3BBbmltYXRpb24gPSBmYWxzZTtcblxuICAvKiogVmFsdWUgb2YgdGhlIHByb2dyZXNzIGJhci4gRGVmYXVsdHMgdG8gemVyby4gTWlycm9yZWQgdG8gYXJpYS12YWx1ZW5vdy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBjbGFtcCh2IHx8IDApO1xuXG4gICAgLy8gV2hlbiBub29wIGFuaW1hdGlvbiBpcyBzZXQgdG8gdHJ1ZSwgdHJpZ2dlciBhbmltYXRpb25FbmQgZGlyZWN0bHkuXG4gICAgaWYgKHRoaXMuX2lzTm9vcEFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fZW1pdEFuaW1hdGlvbkVuZCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92YWx1ZTogbnVtYmVyID0gMDtcblxuICAvKiogQnVmZmVyIHZhbHVlIG9mIHRoZSBwcm9ncmVzcyBiYXIuIERlZmF1bHRzIHRvIHplcm8uICovXG4gIEBJbnB1dCgpXG4gIGdldCBidWZmZXJWYWx1ZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fYnVmZmVyVmFsdWU7IH1cbiAgc2V0IGJ1ZmZlclZhbHVlKHY6IG51bWJlcikgeyB0aGlzLl9idWZmZXJWYWx1ZSA9IGNsYW1wKHYgfHwgMCk7IH1cbiAgcHJpdmF0ZSBfYnVmZmVyVmFsdWU6IG51bWJlciA9IDA7XG5cbiAgQFZpZXdDaGlsZCgncHJpbWFyeVZhbHVlQmFyJywge3N0YXRpYzogZmFsc2V9KSBfcHJpbWFyeVZhbHVlQmFyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gYW5pbWF0aW9uIG9mIHRoZSBwcmltYXJ5IHByb2dyZXNzIGJhciBjb21wbGV0ZXMuIFRoaXMgZXZlbnQgd2lsbCBub3RcbiAgICogYmUgZW1pdHRlZCB3aGVuIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLCBub3Igd2lsbCBpdCBiZSBlbWl0dGVkIGZvciBtb2RlcyB3aXRoIGNvbnRpbnVvdXNcbiAgICogYW5pbWF0aW9ucyAoaW5kZXRlcm1pbmF0ZSBhbmQgcXVlcnkpLlxuICAgKi9cbiAgQE91dHB1dCgpIGFuaW1hdGlvbkVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8UHJvZ3Jlc3NBbmltYXRpb25FbmQ+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbmltYXRpb24gZW5kIHN1YnNjcmlwdGlvbiB0byBiZSB1bnN1YnNjcmliZWQgb24gZGVzdHJveS4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uRW5kU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIE1vZGUgb2YgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogSW5wdXQgbXVzdCBiZSBvbmUgb2YgdGhlc2UgdmFsdWVzOiBkZXRlcm1pbmF0ZSwgaW5kZXRlcm1pbmF0ZSwgYnVmZmVyLCBxdWVyeSwgZGVmYXVsdHMgdG9cbiAgICogJ2RldGVybWluYXRlJy5cbiAgICogTWlycm9yZWQgdG8gbW9kZSBhdHRyaWJ1dGUuXG4gICAqL1xuICBASW5wdXQoKSBtb2RlOiAnZGV0ZXJtaW5hdGUnIHwgJ2luZGV0ZXJtaW5hdGUnIHwgJ2J1ZmZlcicgfCAncXVlcnknID0gJ2RldGVybWluYXRlJztcblxuICAvKiogSUQgb2YgdGhlIHByb2dyZXNzIGJhci4gKi9cbiAgcHJvZ3Jlc3NiYXJJZCA9IGBtYXQtcHJvZ3Jlc3MtYmFyLSR7cHJvZ3Jlc3NiYXJJZCsrfWA7XG5cbiAgLyoqIEF0dHJpYnV0ZSB0byBiZSB1c2VkIGZvciB0aGUgYGZpbGxgIGF0dHJpYnV0ZSBvbiB0aGUgaW50ZXJuYWwgYHJlY3RgIGVsZW1lbnQuICovXG4gIF9yZWN0YW5nbGVGaWxsVmFsdWU6IHN0cmluZztcblxuICAvKiogR2V0cyB0aGUgY3VycmVudCB0cmFuc2Zvcm0gdmFsdWUgZm9yIHRoZSBwcm9ncmVzcyBiYXIncyBwcmltYXJ5IGluZGljYXRvci4gKi9cbiAgX3ByaW1hcnlUcmFuc2Zvcm0oKSB7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnZhbHVlIC8gMTAwO1xuICAgIHJldHVybiB7dHJhbnNmb3JtOiBgc2NhbGVYKCR7c2NhbGV9KWB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgdHJhbnNmb3JtIHZhbHVlIGZvciB0aGUgcHJvZ3Jlc3MgYmFyJ3MgYnVmZmVyIGluZGljYXRvci4gT25seSB1c2VkIGlmIHRoZVxuICAgKiBwcm9ncmVzcyBtb2RlIGlzIHNldCB0byBidWZmZXIsIG90aGVyd2lzZSByZXR1cm5zIGFuIHVuZGVmaW5lZCwgY2F1c2luZyBubyB0cmFuc2Zvcm1hdGlvbi5cbiAgICovXG4gIF9idWZmZXJUcmFuc2Zvcm0oKSB7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2J1ZmZlcicpIHtcbiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5idWZmZXJWYWx1ZSAvIDEwMDtcbiAgICAgIHJldHVybiB7dHJhbnNmb3JtOiBgc2NhbGVYKCR7c2NhbGV9KWB9O1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICghdGhpcy5faXNOb29wQW5pbWF0aW9uKSB7XG4gICAgICAvLyBSdW4gb3V0c2lkZSBhbmd1bGFyIHNvIGNoYW5nZSBkZXRlY3Rpb24gZGlkbid0IGdldCB0cmlnZ2VyZWQgb24gZXZlcnkgdHJhbnNpdGlvbiBlbmRcbiAgICAgIC8vIGluc3RlYWQgb25seSBvbiB0aGUgYW5pbWF0aW9uIHRoYXQgd2UgY2FyZSBhYm91dCAocHJpbWFyeSB2YWx1ZSBiYXIncyB0cmFuc2l0aW9uZW5kKVxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9wcmltYXJ5VmFsdWVCYXIubmF0aXZlRWxlbWVudDtcblxuICAgICAgICB0aGlzLl9hbmltYXRpb25FbmRTdWJzY3JpcHRpb24gPVxuICAgICAgICAgICAgKGZyb21FdmVudChlbGVtZW50LCAndHJhbnNpdGlvbmVuZCcpIGFzIE9ic2VydmFibGU8VHJhbnNpdGlvbkV2ZW50PilcbiAgICAgICAgICAgICAgLnBpcGUoZmlsdGVyKCgoZTogVHJhbnNpdGlvbkV2ZW50KSA9PiBlLnRhcmdldCA9PT0gZWxlbWVudCkpKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5fZW1pdEFuaW1hdGlvbkVuZCgpKSk7XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogRW1pdCBhbiBhbmltYXRpb25FbmQgZXZlbnQgaWYgaW4gZGV0ZXJtaW5hdGUgb3IgYnVmZmVyIG1vZGUuICovXG4gIHByaXZhdGUgX2VtaXRBbmltYXRpb25FbmQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2RldGVybWluYXRlJyB8fCB0aGlzLm1vZGUgPT09ICdidWZmZXInKSB7XG4gICAgICB0aGlzLmFuaW1hdGlvbkVuZC5uZXh0KHt2YWx1ZTogdGhpcy52YWx1ZX0pO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQ2xhbXBzIGEgdmFsdWUgdG8gYmUgYmV0d2VlbiB0d28gbnVtYmVycywgYnkgZGVmYXVsdCAwIGFuZCAxMDAuICovXG5mdW5jdGlvbiBjbGFtcCh2OiBudW1iZXIsIG1pbiA9IDAsIG1heCA9IDEwMCkge1xuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHYpKTtcbn1cbiJdfQ==