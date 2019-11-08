import { __extends } from "tslib";
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
var MatProgressBarBase = /** @class */ (function () {
    function MatProgressBarBase(_elementRef) {
        this._elementRef = _elementRef;
    }
    return MatProgressBarBase;
}());
var _MatProgressBarMixinBase = mixinColor(MatProgressBarBase, 'primary');
/**
 * Injection token used to provide the current location to `MatProgressBar`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export var MAT_PROGRESS_BAR_LOCATION = new InjectionToken('mat-progress-bar-location', { providedIn: 'root', factory: MAT_PROGRESS_BAR_LOCATION_FACTORY });
/** @docs-private */
export function MAT_PROGRESS_BAR_LOCATION_FACTORY() {
    var _document = inject(DOCUMENT);
    var _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: function () { return _location ? (_location.pathname + _location.search) : ''; }
    };
}
/** Counter used to generate unique IDs for progress bars. */
var progressbarId = 0;
/**
 * `<mat-progress-bar>` component.
 */
var MatProgressBar = /** @class */ (function (_super) {
    __extends(MatProgressBar, _super);
    function MatProgressBar(_elementRef, _ngZone, _animationMode, 
    /**
     * @deprecated `location` parameter to be made required.
     * @breaking-change 8.0.0
     */
    location) {
        var _this = _super.call(this, _elementRef) || this;
        _this._elementRef = _elementRef;
        _this._ngZone = _ngZone;
        _this._animationMode = _animationMode;
        /** Flag that indicates whether NoopAnimations mode is set to true. */
        _this._isNoopAnimation = false;
        _this._value = 0;
        _this._bufferValue = 0;
        /**
         * Event emitted when animation of the primary progress bar completes. This event will not
         * be emitted when animations are disabled, nor will it be emitted for modes with continuous
         * animations (indeterminate and query).
         */
        _this.animationEnd = new EventEmitter();
        /** Reference to animation end subscription to be unsubscribed on destroy. */
        _this._animationEndSubscription = Subscription.EMPTY;
        /**
         * Mode of the progress bar.
         *
         * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
         * 'determinate'.
         * Mirrored to mode attribute.
         */
        _this.mode = 'determinate';
        /** ID of the progress bar. */
        _this.progressbarId = "mat-progress-bar-" + progressbarId++;
        // We need to prefix the SVG reference with the current path, otherwise they won't work
        // in Safari if the page has a `<base>` tag. Note that we need quotes inside the `url()`,
        // because named route URLs can contain parentheses (see #12338). Also we don't use since
        // we can't tell the difference between whether
        // the consumer is using the hash location strategy or not, because `Location` normalizes
        // both `/#/foo/bar` and `/foo/bar` to the same thing.
        var path = location ? location.getPathname().split('#')[0] : '';
        _this._rectangleFillValue = "url('" + path + "#" + _this.progressbarId + "')";
        _this._isNoopAnimation = _animationMode === 'NoopAnimations';
        return _this;
    }
    Object.defineProperty(MatProgressBar.prototype, "value", {
        /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
        get: function () { return this._value; },
        set: function (v) {
            this._value = clamp(coerceNumberProperty(v) || 0);
            // When noop animation is set to true, trigger animationEnd directly.
            if (this._isNoopAnimation) {
                this._emitAnimationEnd();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressBar.prototype, "bufferValue", {
        /** Buffer value of the progress bar. Defaults to zero. */
        get: function () { return this._bufferValue; },
        set: function (v) { this._bufferValue = clamp(v || 0); },
        enumerable: true,
        configurable: true
    });
    /** Gets the current transform value for the progress bar's primary indicator. */
    MatProgressBar.prototype._primaryTransform = function () {
        var scale = this.value / 100;
        return { transform: "scaleX(" + scale + ")" };
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator. Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    MatProgressBar.prototype._bufferTransform = function () {
        if (this.mode === 'buffer') {
            var scale = this.bufferValue / 100;
            return { transform: "scaleX(" + scale + ")" };
        }
        return null;
    };
    MatProgressBar.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!this._isNoopAnimation) {
            // Run outside angular so change detection didn't get triggered on every transition end
            // instead only on the animation that we care about (primary value bar's transitionend)
            this._ngZone.runOutsideAngular((function () {
                var element = _this._primaryValueBar.nativeElement;
                _this._animationEndSubscription =
                    fromEvent(element, 'transitionend')
                        .pipe(filter((function (e) { return e.target === element; })))
                        .subscribe(function () { return _this._ngZone.run(function () { return _this._emitAnimationEnd(); }); });
            }));
        }
    };
    MatProgressBar.prototype.ngOnDestroy = function () {
        this._animationEndSubscription.unsubscribe();
    };
    /** Emit an animationEnd event if in determinate or buffer mode. */
    MatProgressBar.prototype._emitAnimationEnd = function () {
        if (this.mode === 'determinate' || this.mode === 'buffer') {
            this.animationEnd.next({ value: this.value });
        }
    };
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
                    styles: [".mat-progress-bar{display:block;height:4px;overflow:hidden;position:relative;transition:opacity 250ms linear;width:100%}._mat-animation-noopable.mat-progress-bar{transition:none;animation:none}.mat-progress-bar .mat-progress-bar-element,.mat-progress-bar .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}.mat-progress-bar .mat-progress-bar-background{width:calc(100% + 10px)}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-background{display:none}.mat-progress-bar .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-buffer{border-top:solid 5px;opacity:.5}.mat-progress-bar .mat-progress-bar-secondary{display:none}.mat-progress-bar .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease}.cdk-high-contrast-active .mat-progress-bar .mat-progress-bar-fill{border-top:solid 4px}.mat-progress-bar .mat-progress-bar-fill::after{animation:none;content:\"\";display:inline-block;left:0}.mat-progress-bar[dir=rtl],[dir=rtl] .mat-progress-bar{transform:rotateY(180deg)}.mat-progress-bar[mode=query]{transform:rotateZ(180deg)}.mat-progress-bar[mode=query][dir=rtl],[dir=rtl] .mat-progress-bar[mode=query]{transform:rotateZ(180deg) rotateY(180deg)}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-fill,.mat-progress-bar[mode=query] .mat-progress-bar-fill{transition:none}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary,.mat-progress-bar[mode=query] .mat-progress-bar-primary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-translate 2000ms infinite linear;left:-145.166611%}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-primary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary,.mat-progress-bar[mode=query] .mat-progress-bar-secondary{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-translate 2000ms infinite linear;left:-54.888891%;display:block}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-secondary-indeterminate-scale 2000ms infinite linear}.mat-progress-bar[mode=buffer] .mat-progress-bar-background{-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-buffer,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar._mat-animation-noopable .mat-progress-bar-background{animation:none;transition:none}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-8px)}}\n"]
                }] }
    ];
    /** @nocollapse */
    MatProgressBar.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PROGRESS_BAR_LOCATION,] }] }
    ]; };
    MatProgressBar.propDecorators = {
        value: [{ type: Input }],
        bufferValue: [{ type: Input }],
        _primaryValueBar: [{ type: ViewChild, args: ['primaryValueBar',] }],
        animationEnd: [{ type: Output }],
        mode: [{ type: Input }]
    };
    return MatProgressBar;
}(_MatProgressBarMixinBase));
export { MatProgressBar };
/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.max(min, Math.min(max, v));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBeUIsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLFNBQVMsRUFBYyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBV3RDLHFEQUFxRDtBQUNyRCxvQkFBb0I7QUFDcEI7SUFDRSw0QkFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBSSxDQUFDO0lBQ2pELHlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRCxJQUFNLHdCQUF3QixHQUMxQixVQUFVLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFOUM7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxJQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsRUFDM0IsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8s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LEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBpbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IEJlbmNocHJlc3MgdGVzdHMuXG4vLyBUT0RPKGpvc2VwaHBlcnJvdHQpOiBBZGQgQVJJQSBhdHRyaWJ1dGVzIGZvciBwcm9ncmVzcyBiYXIgXCJmb3JcIi5cblxuLyoqIExhc3QgYW5pbWF0aW9uIGVuZCBkYXRhLiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0FuaW1hdGlvbkVuZCB7XG4gIHZhbHVlOiBudW1iZXI7XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0UHJvZ3Jlc3NCYXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0UHJvZ3Jlc3NCYXJCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cbn1cblxuY29uc3QgX01hdFByb2dyZXNzQmFyTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0UHJvZ3Jlc3NCYXJCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdFByb2dyZXNzQmFyQmFzZSwgJ3ByaW1hcnknKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdXNlZCB0byBwcm92aWRlIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIGBNYXRQcm9ncmVzc0JhcmAuXG4gKiBVc2VkIHRvIGhhbmRsZSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgYW5kIHRvIHN0dWIgb3V0IGR1cmluZyB1bml0IHRlc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1BST0dSRVNTX0JBUl9MT0NBVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRQcm9ncmVzc0JhckxvY2F0aW9uPihcbiAgJ21hdC1wcm9ncmVzcy1iYXItbG9jYXRpb24nLFxuICB7cHJvdmlkZWRJbjogJ3Jvb3QnLCBmYWN0b3J5OiBNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OX0ZBQ1RPUll9XG4pO1xuXG4vKipcbiAqIFN0dWJiZWQgb3V0IGxvY2F0aW9uIGZvciBgTWF0UHJvZ3Jlc3NCYXJgLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFByb2dyZXNzQmFyTG9jYXRpb24ge1xuICBnZXRQYXRobmFtZTogKCkgPT4gc3RyaW5nO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9QUk9HUkVTU19CQVJfTE9DQVRJT05fRkFDVE9SWSgpOiBNYXRQcm9ncmVzc0JhckxvY2F0aW9uIHtcbiAgY29uc3QgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgY29uc3QgX2xvY2F0aW9uID0gX2RvY3VtZW50ID8gX2RvY3VtZW50LmxvY2F0aW9uIDogbnVsbDtcblxuICByZXR1cm4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24sIHJhdGhlciB0aGFuIGEgcHJvcGVydHksIGJlY2F1c2UgQW5ndWxhclxuICAgIC8vIHdpbGwgb25seSByZXNvbHZlIGl0IG9uY2UsIGJ1dCB3ZSB3YW50IHRoZSBjdXJyZW50IHBhdGggb24gZWFjaCBjYWxsLlxuICAgIGdldFBhdGhuYW1lOiAoKSA9PiBfbG9jYXRpb24gPyAoX2xvY2F0aW9uLnBhdGhuYW1lICsgX2xvY2F0aW9uLnNlYXJjaCkgOiAnJ1xuICB9O1xufVxuXG5leHBvcnQgdHlwZSBQcm9ncmVzc0Jhck1vZGUgPSAnZGV0ZXJtaW5hdGUnIHwgJ2luZGV0ZXJtaW5hdGUnIHwgJ2J1ZmZlcicgfCAncXVlcnknO1xuXG4vKiogQ291bnRlciB1c2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIHByb2dyZXNzIGJhcnMuICovXG5sZXQgcHJvZ3Jlc3NiYXJJZCA9IDA7XG5cbi8qKlxuICogYDxtYXQtcHJvZ3Jlc3MtYmFyPmAgY29tcG9uZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcHJvZ3Jlc3MtYmFyJyxcbiAgZXhwb3J0QXM6ICdtYXRQcm9ncmVzc0JhcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdwcm9ncmVzc2JhcicsXG4gICAgJ2FyaWEtdmFsdWVtaW4nOiAnMCcsXG4gICAgJ2FyaWEtdmFsdWVtYXgnOiAnMTAwJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnKG1vZGUgPT09IFwiaW5kZXRlcm1pbmF0ZVwiIHx8IG1vZGUgPT09IFwicXVlcnlcIikgPyBudWxsIDogdmFsdWUnLFxuICAgICdbYXR0ci5tb2RlXSc6ICdtb2RlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXByb2dyZXNzLWJhcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2lzTm9vcEFuaW1hdGlvbicsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzLWJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Byb2dyZXNzLWJhci5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFByb2dyZXNzQmFyIGV4dGVuZHMgX01hdFByb2dyZXNzQmFyTWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgYGxvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUFJPR1JFU1NfQkFSX0xPQ0FUSU9OKSBsb2NhdGlvbj86IE1hdFByb2dyZXNzQmFyTG9jYXRpb24pIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByZWZpeCB0aGUgU1ZHIHJlZmVyZW5jZSB3aXRoIHRoZSBjdXJyZW50IHBhdGgsIG90aGVyd2lzZSB0aGV5IHdvbid0IHdvcmtcbiAgICAvLyBpbiBTYWZhcmkgaWYgdGhlIHBhZ2UgaGFzIGEgYDxiYXNlPmAgdGFnLiBOb3RlIHRoYXQgd2UgbmVlZCBxdW90ZXMgaW5zaWRlIHRoZSBgdXJsKClgLFxuXG4gICAgLy8gYmVjYXVzZSBuYW1lZCByb3V0ZSBVUkxzIGNhbiBjb250YWluIHBhcmVudGhlc2VzIChzZWUgIzEyMzM4KS4gQWxzbyB3ZSBkb24ndCB1c2Ugc2luY2VcbiAgICAvLyB3ZSBjYW4ndCB0ZWxsIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gd2hldGhlclxuICAgIC8vIHRoZSBjb25zdW1lciBpcyB1c2luZyB0aGUgaGFzaCBsb2NhdGlvbiBzdHJhdGVneSBvciBub3QsIGJlY2F1c2UgYExvY2F0aW9uYCBub3JtYWxpemVzXG4gICAgLy8gYm90aCBgLyMvZm9vL2JhcmAgYW5kIGAvZm9vL2JhcmAgdG8gdGhlIHNhbWUgdGhpbmcuXG4gICAgY29uc3QgcGF0aCA9IGxvY2F0aW9uID8gbG9jYXRpb24uZ2V0UGF0aG5hbWUoKS5zcGxpdCgnIycpWzBdIDogJyc7XG4gICAgdGhpcy5fcmVjdGFuZ2xlRmlsbFZhbHVlID0gYHVybCgnJHtwYXRofSMke3RoaXMucHJvZ3Jlc3NiYXJJZH0nKWA7XG4gICAgdGhpcy5faXNOb29wQW5pbWF0aW9uID0gX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gIH1cblxuICAvKiogRmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIE5vb3BBbmltYXRpb25zIG1vZGUgaXMgc2V0IHRvIHRydWUuICovXG4gIF9pc05vb3BBbmltYXRpb24gPSBmYWxzZTtcblxuICAvKiogVmFsdWUgb2YgdGhlIHByb2dyZXNzIGJhci4gRGVmYXVsdHMgdG8gemVyby4gTWlycm9yZWQgdG8gYXJpYS12YWx1ZW5vdy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBjbGFtcChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KSB8fCAwKTtcblxuICAgIC8vIFdoZW4gbm9vcCBhbmltYXRpb24gaXMgc2V0IHRvIHRydWUsIHRyaWdnZXIgYW5pbWF0aW9uRW5kIGRpcmVjdGx5LlxuICAgIGlmICh0aGlzLl9pc05vb3BBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX2VtaXRBbmltYXRpb25FbmQoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciA9IDA7XG5cbiAgLyoqIEJ1ZmZlciB2YWx1ZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLiBEZWZhdWx0cyB0byB6ZXJvLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYnVmZmVyVmFsdWUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2J1ZmZlclZhbHVlOyB9XG4gIHNldCBidWZmZXJWYWx1ZSh2OiBudW1iZXIpIHsgdGhpcy5fYnVmZmVyVmFsdWUgPSBjbGFtcCh2IHx8IDApOyB9XG4gIHByaXZhdGUgX2J1ZmZlclZhbHVlOiBudW1iZXIgPSAwO1xuXG4gIEBWaWV3Q2hpbGQoJ3ByaW1hcnlWYWx1ZUJhcicpIF9wcmltYXJ5VmFsdWVCYXI6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhbmltYXRpb24gb2YgdGhlIHByaW1hcnkgcHJvZ3Jlc3MgYmFyIGNvbXBsZXRlcy4gVGhpcyBldmVudCB3aWxsIG5vdFxuICAgKiBiZSBlbWl0dGVkIHdoZW4gYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIG5vciB3aWxsIGl0IGJlIGVtaXR0ZWQgZm9yIG1vZGVzIHdpdGggY29udGludW91c1xuICAgKiBhbmltYXRpb25zIChpbmRldGVybWluYXRlIGFuZCBxdWVyeSkuXG4gICAqL1xuICBAT3V0cHV0KCkgYW5pbWF0aW9uRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxQcm9ncmVzc0FuaW1hdGlvbkVuZD4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFuaW1hdGlvbiBlbmQgc3Vic2NyaXB0aW9uIHRvIGJlIHVuc3Vic2NyaWJlZCBvbiBkZXN0cm95LiAqL1xuICBwcml2YXRlIF9hbmltYXRpb25FbmRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogTW9kZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLlxuICAgKlxuICAgKiBJbnB1dCBtdXN0IGJlIG9uZSBvZiB0aGVzZSB2YWx1ZXM6IGRldGVybWluYXRlLCBpbmRldGVybWluYXRlLCBidWZmZXIsIHF1ZXJ5LCBkZWZhdWx0cyB0b1xuICAgKiAnZGV0ZXJtaW5hdGUnLlxuICAgKiBNaXJyb3JlZCB0byBtb2RlIGF0dHJpYnV0ZS5cbiAgICovXG4gIEBJbnB1dCgpIG1vZGU6IFByb2dyZXNzQmFyTW9kZSA9ICdkZXRlcm1pbmF0ZSc7XG5cbiAgLyoqIElEIG9mIHRoZSBwcm9ncmVzcyBiYXIuICovXG4gIHByb2dyZXNzYmFySWQgPSBgbWF0LXByb2dyZXNzLWJhci0ke3Byb2dyZXNzYmFySWQrK31gO1xuXG4gIC8qKiBBdHRyaWJ1dGUgdG8gYmUgdXNlZCBmb3IgdGhlIGBmaWxsYCBhdHRyaWJ1dGUgb24gdGhlIGludGVybmFsIGByZWN0YCBlbGVtZW50LiAqL1xuICBfcmVjdGFuZ2xlRmlsbFZhbHVlOiBzdHJpbmc7XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgdHJhbnNmb3JtIHZhbHVlIGZvciB0aGUgcHJvZ3Jlc3MgYmFyJ3MgcHJpbWFyeSBpbmRpY2F0b3IuICovXG4gIF9wcmltYXJ5VHJhbnNmb3JtKCkge1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52YWx1ZSAvIDEwMDtcbiAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlWCgke3NjYWxlfSlgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHRyYW5zZm9ybSB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhcidzIGJ1ZmZlciBpbmRpY2F0b3IuIE9ubHkgdXNlZCBpZiB0aGVcbiAgICogcHJvZ3Jlc3MgbW9kZSBpcyBzZXQgdG8gYnVmZmVyLCBvdGhlcndpc2UgcmV0dXJucyBhbiB1bmRlZmluZWQsIGNhdXNpbmcgbm8gdHJhbnNmb3JtYXRpb24uXG4gICAqL1xuICBfYnVmZmVyVHJhbnNmb3JtKCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdidWZmZXInKSB7XG4gICAgICBjb25zdCBzY2FsZSA9IHRoaXMuYnVmZmVyVmFsdWUgLyAxMDA7XG4gICAgICByZXR1cm4ge3RyYW5zZm9ybTogYHNjYWxlWCgke3NjYWxlfSlgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9pc05vb3BBbmltYXRpb24pIHtcbiAgICAgIC8vIFJ1biBvdXRzaWRlIGFuZ3VsYXIgc28gY2hhbmdlIGRldGVjdGlvbiBkaWRuJ3QgZ2V0IHRyaWdnZXJlZCBvbiBldmVyeSB0cmFuc2l0aW9uIGVuZFxuICAgICAgLy8gaW5zdGVhZCBvbmx5IG9uIHRoZSBhbmltYXRpb24gdGhhdCB3ZSBjYXJlIGFib3V0IChwcmltYXJ5IHZhbHVlIGJhcidzIHRyYW5zaXRpb25lbmQpXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX3ByaW1hcnlWYWx1ZUJhci5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbkVuZFN1YnNjcmlwdGlvbiA9XG4gICAgICAgICAgICAoZnJvbUV2ZW50KGVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJykgYXMgT2JzZXJ2YWJsZTxUcmFuc2l0aW9uRXZlbnQ+KVxuICAgICAgICAgICAgICAucGlwZShmaWx0ZXIoKChlOiBUcmFuc2l0aW9uRXZlbnQpID0+IGUudGFyZ2V0ID09PSBlbGVtZW50KSkpXG4gICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLl9lbWl0QW5pbWF0aW9uRW5kKCkpKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9hbmltYXRpb25FbmRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBFbWl0IGFuIGFuaW1hdGlvbkVuZCBldmVudCBpZiBpbiBkZXRlcm1pbmF0ZSBvciBidWZmZXIgbW9kZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdEFuaW1hdGlvbkVuZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnIHx8IHRoaXMubW9kZSA9PT0gJ2J1ZmZlcicpIHtcbiAgICAgIHRoaXMuYW5pbWF0aW9uRW5kLm5leHQoe3ZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBudW1iZXIgfCBzdHJpbmc7XG59XG5cbi8qKiBDbGFtcHMgYSB2YWx1ZSB0byBiZSBiZXR3ZWVuIHR3byBudW1iZXJzLCBieSBkZWZhdWx0IDAgYW5kIDEwMC4gKi9cbmZ1bmN0aW9uIGNsYW1wKHY6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMTAwKSB7XG4gIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdikpO1xufVxuIl19