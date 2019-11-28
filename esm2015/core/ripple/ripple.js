/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/ripple/ripple.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, } from '@angular/core';
import { RippleRenderer } from './ripple-renderer';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Configurable options for `matRipple`.
 * @record
 */
export function RippleGlobalOptions() { }
if (false) {
    /**
     * Whether ripples should be disabled. Ripples can be still launched manually by using
     * the `launch()` method. Therefore focus indicators will still show up.
     * @type {?|undefined}
     */
    RippleGlobalOptions.prototype.disabled;
    /**
     * Configuration for the animation duration of the ripples. There are two phases with different
     * durations for the ripples. The animation durations will be overwritten if the
     * `NoopAnimationsModule` is being used.
     * @type {?|undefined}
     */
    RippleGlobalOptions.prototype.animation;
    /**
     * Whether ripples should start fading out immediately after the mouse or touch is released. By
     * default, ripples will wait for the enter animation to complete and for mouse or touch release.
     * @type {?|undefined}
     */
    RippleGlobalOptions.prototype.terminateOnPointerUp;
}
/**
 * Injection token that can be used to specify the global ripple options.
 * @type {?}
 */
export const MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken('mat-ripple-global-options');
export class MatRipple {
    /**
     * @param {?} _elementRef
     * @param {?} ngZone
     * @param {?} platform
     * @param {?=} globalOptions
     * @param {?=} animationMode
     */
    constructor(_elementRef, ngZone, platform, globalOptions, animationMode) {
        this._elementRef = _elementRef;
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.radius = 0;
        this._disabled = false;
        /**
         * Whether ripple directive is initialized and the input bindings are set.
         */
        this._isInitialized = false;
        this._globalOptions = globalOptions || {};
        this._rippleRenderer = new RippleRenderer(this, ngZone, _elementRef, platform);
        if (animationMode === 'NoopAnimations') {
            this._globalOptions.animation = { enterDuration: 0, exitDuration: 0 };
        }
    }
    /**
     * Whether click events will not trigger the ripple. Ripples can be still launched manually
     * by using the `launch()` method.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = value;
        this._setupTriggerEventsIfEnabled();
    }
    /**
     * The element that triggers the ripple when click events are received.
     * Defaults to the directive's host element.
     * @return {?}
     */
    get trigger() { return this._trigger || this._elementRef.nativeElement; }
    /**
     * @param {?} trigger
     * @return {?}
     */
    set trigger(trigger) {
        this._trigger = trigger;
        this._setupTriggerEventsIfEnabled();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._isInitialized = true;
        this._setupTriggerEventsIfEnabled();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
    }
    /**
     * Fades out all currently showing ripple elements.
     * @return {?}
     */
    fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
    }
    /**
     * Ripple configuration from the directive's input values.
     * \@docs-private Implemented as part of RippleTarget
     * @return {?}
     */
    get rippleConfig() {
        return {
            centered: this.centered,
            radius: this.radius,
            color: this.color,
            animation: Object.assign(Object.assign({}, this._globalOptions.animation), this.animation),
            terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
        };
    }
    /**
     * Whether ripples on pointer-down are disabled or not.
     * \@docs-private Implemented as part of RippleTarget
     * @return {?}
     */
    get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
    }
    /**
     * Sets up the trigger event listeners if ripples are enabled.
     * @private
     * @return {?}
     */
    _setupTriggerEventsIfEnabled() {
        if (!this.disabled && this._isInitialized) {
            this._rippleRenderer.setupTriggerEvents(this.trigger);
        }
    }
    /**
     * Launches a manual ripple at the specified coordinated or just by the ripple config.
     * @param {?} configOrX
     * @param {?=} y
     * @param {?=} config
     * @return {?}
     */
    launch(configOrX, y = 0, config) {
        if (typeof configOrX === 'number') {
            return this._rippleRenderer.fadeInRipple(configOrX, y, Object.assign(Object.assign({}, this.rippleConfig), config));
        }
        else {
            return this._rippleRenderer.fadeInRipple(0, 0, Object.assign(Object.assign({}, this.rippleConfig), configOrX));
        }
    }
}
MatRipple.decorators = [
    { type: Directive, args: [{
                selector: '[mat-ripple], [matRipple]',
                exportAs: 'matRipple',
                host: {
                    'class': 'mat-ripple',
                    '[class.mat-ripple-unbounded]': 'unbounded'
                }
            },] }
];
/** @nocollapse */
MatRipple.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Platform },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatRipple.propDecorators = {
    color: [{ type: Input, args: ['matRippleColor',] }],
    unbounded: [{ type: Input, args: ['matRippleUnbounded',] }],
    centered: [{ type: Input, args: ['matRippleCentered',] }],
    radius: [{ type: Input, args: ['matRippleRadius',] }],
    animation: [{ type: Input, args: ['matRippleAnimation',] }],
    disabled: [{ type: Input, args: ['matRippleDisabled',] }],
    trigger: [{ type: Input, args: ['matRippleTrigger',] }]
};
if (false) {
    /**
     * Custom color for all ripples.
     * @type {?}
     */
    MatRipple.prototype.color;
    /**
     * Whether the ripples should be visible outside the component's bounds.
     * @type {?}
     */
    MatRipple.prototype.unbounded;
    /**
     * Whether the ripple always originates from the center of the host element's bounds, rather
     * than originating from the location of the click event.
     * @type {?}
     */
    MatRipple.prototype.centered;
    /**
     * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
     * will be the distance from the center of the ripple to the furthest corner of the host element's
     * bounding rectangle.
     * @type {?}
     */
    MatRipple.prototype.radius;
    /**
     * Configuration for the ripple animation. Allows modifying the enter and exit animation
     * duration of the ripples. The animation durations will be overwritten if the
     * `NoopAnimationsModule` is being used.
     * @type {?}
     */
    MatRipple.prototype.animation;
    /**
     * @type {?}
     * @private
     */
    MatRipple.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    MatRipple.prototype._trigger;
    /**
     * Renderer for the ripple DOM manipulations.
     * @type {?}
     * @private
     */
    MatRipple.prototype._rippleRenderer;
    /**
     * Options that are set globally for all ripples.
     * @type {?}
     * @private
     */
    MatRipple.prototype._globalOptions;
    /**
     * Whether ripple directive is initialized and the input bindings are set.
     * @type {?}
     * @private
     */
    MatRipple.prototype._isInitialized;
    /**
     * @type {?}
     * @private
     */
    MatRipple.prototype._elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQXNDLGNBQWMsRUFBZSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BHLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOzs7OztBQUczRSx5Q0FtQkM7Ozs7Ozs7SUFkQyx1Q0FBbUI7Ozs7Ozs7SUFPbkIsd0NBQWtDOzs7Ozs7SUFNbEMsbURBQStCOzs7Ozs7QUFJakMsTUFBTSxPQUFPLHlCQUF5QixHQUNsQyxJQUFJLGNBQWMsQ0FBc0IsMkJBQTJCLENBQUM7QUFVeEUsTUFBTSxPQUFPLFNBQVM7Ozs7Ozs7O0lBNkRwQixZQUFvQixXQUFvQyxFQUM1QyxNQUFjLEVBQ2QsUUFBa0IsRUFDNkIsYUFBbUMsRUFDdkMsYUFBc0I7UUFKekQsZ0JBQVcsR0FBWCxXQUFXLENBQXlCOzs7Ozs7UUExQzlCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFtQnJDLGNBQVMsR0FBWSxLQUFLLENBQUM7Ozs7UUFxQjNCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBUXRDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxJQUFJLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRS9FLElBQUksYUFBYSxLQUFLLGdCQUFnQixFQUFFO1lBQ3RD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b0I7dUJBTTFCLEtBQUssU0FBQyxtQkFBbUI7cUJBT3pCLEtBQUssU0FBQyxpQkFBaUI7d0JBT3ZCLEtBQUssU0FBQyxvQkFBb0I7dUJBTTFCLEtBQUssU0FBQyxtQkFBbUI7c0JBWXpCLEtBQUssU0FBQyxrQkFBa0I7Ozs7Ozs7SUF6Q3pCLDBCQUF1Qzs7Ozs7SUFHdkMsOEJBQWdEOzs7Ozs7SUFNaEQsNkJBQThDOzs7Ozs7O0lBTzlDLDJCQUE2Qzs7Ozs7OztJQU83Qyw4QkFBOEQ7Ozs7O0lBWTlELDhCQUFtQzs7Ozs7SUFZbkMsNkJBQThCOzs7Ozs7SUFHOUIsb0NBQXdDOzs7Ozs7SUFHeEMsbUNBQTRDOzs7Ozs7SUFHNUMsbUNBQXdDOzs7OztJQUU1QixnQ0FBNEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UmlwcGxlUmVmfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuaW1wb3J0IHtSaXBwbGVBbmltYXRpb25Db25maWcsIFJpcHBsZUNvbmZpZywgUmlwcGxlUmVuZGVyZXIsIFJpcHBsZVRhcmdldH0gZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBDb25maWd1cmFibGUgb3B0aW9ucyBmb3IgYG1hdFJpcHBsZWAuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUdsb2JhbE9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIHNob3VsZCBiZSBkaXNhYmxlZC4gUmlwcGxlcyBjYW4gYmUgc3RpbGwgbGF1bmNoZWQgbWFudWFsbHkgYnkgdXNpbmdcbiAgICogdGhlIGBsYXVuY2goKWAgbWV0aG9kLiBUaGVyZWZvcmUgZm9jdXMgaW5kaWNhdG9ycyB3aWxsIHN0aWxsIHNob3cgdXAuXG4gICAqL1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBhbmltYXRpb24gZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZXJlIGFyZSB0d28gcGhhc2VzIHdpdGggZGlmZmVyZW50XG4gICAqIGR1cmF0aW9ucyBmb3IgdGhlIHJpcHBsZXMuIFRoZSBhbmltYXRpb24gZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW4gaWYgdGhlXG4gICAqIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgYmVpbmcgdXNlZC5cbiAgICovXG4gIGFuaW1hdGlvbj86IFJpcHBsZUFuaW1hdGlvbkNvbmZpZztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIHNob3VsZCBzdGFydCBmYWRpbmcgb3V0IGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBtb3VzZSBvciB0b3VjaCBpcyByZWxlYXNlZC4gQnlcbiAgICogZGVmYXVsdCwgcmlwcGxlcyB3aWxsIHdhaXQgZm9yIHRoZSBlbnRlciBhbmltYXRpb24gdG8gY29tcGxldGUgYW5kIGZvciBtb3VzZSBvciB0b3VjaCByZWxlYXNlLlxuICAgKi9cbiAgdGVybWluYXRlT25Qb2ludGVyVXA/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgZ2xvYmFsIHJpcHBsZSBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxSaXBwbGVHbG9iYWxPcHRpb25zPignbWF0LXJpcHBsZS1nbG9iYWwtb3B0aW9ucycpO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXJpcHBsZV0sIFttYXRSaXBwbGVdJyxcbiAgZXhwb3J0QXM6ICdtYXRSaXBwbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1yaXBwbGUnLFxuICAgICdbY2xhc3MubWF0LXJpcHBsZS11bmJvdW5kZWRdJzogJ3VuYm91bmRlZCdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRSaXBwbGUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUmlwcGxlVGFyZ2V0IHtcblxuICAvKiogQ3VzdG9tIGNvbG9yIGZvciBhbGwgcmlwcGxlcy4gKi9cbiAgQElucHV0KCdtYXRSaXBwbGVDb2xvcicpIGNvbG9yOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZXMgc2hvdWxkIGJlIHZpc2libGUgb3V0c2lkZSB0aGUgY29tcG9uZW50J3MgYm91bmRzLiAqL1xuICBASW5wdXQoJ21hdFJpcHBsZVVuYm91bmRlZCcpIHVuYm91bmRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcmlwcGxlIGFsd2F5cyBvcmlnaW5hdGVzIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgaG9zdCBlbGVtZW50J3MgYm91bmRzLCByYXRoZXJcbiAgICogdGhhbiBvcmlnaW5hdGluZyBmcm9tIHRoZSBsb2NhdGlvbiBvZiB0aGUgY2xpY2sgZXZlbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUNlbnRlcmVkJykgY2VudGVyZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHNldCwgdGhlIHJhZGl1cyBpbiBwaXhlbHMgb2YgZm9yZWdyb3VuZCByaXBwbGVzIHdoZW4gZnVsbHkgZXhwYW5kZWQuIElmIHVuc2V0LCB0aGUgcmFkaXVzXG4gICAqIHdpbGwgYmUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgcmlwcGxlIHRvIHRoZSBmdXJ0aGVzdCBjb3JuZXIgb2YgdGhlIGhvc3QgZWxlbWVudCdzXG4gICAqIGJvdW5kaW5nIHJlY3RhbmdsZS5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlUmFkaXVzJykgcmFkaXVzOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGZvciB0aGUgcmlwcGxlIGFuaW1hdGlvbi4gQWxsb3dzIG1vZGlmeWluZyB0aGUgZW50ZXIgYW5kIGV4aXQgYW5pbWF0aW9uXG4gICAqIGR1cmF0aW9uIG9mIHRoZSByaXBwbGVzLiBUaGUgYW5pbWF0aW9uIGR1cmF0aW9ucyB3aWxsIGJlIG92ZXJ3cml0dGVuIGlmIHRoZVxuICAgKiBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGlzIGJlaW5nIHVzZWQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUFuaW1hdGlvbicpIGFuaW1hdGlvbjogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGNsaWNrIGV2ZW50cyB3aWxsIG5vdCB0cmlnZ2VyIHRoZSByaXBwbGUuIFJpcHBsZXMgY2FuIGJlIHN0aWxsIGxhdW5jaGVkIG1hbnVhbGx5XG4gICAqIGJ5IHVzaW5nIHRoZSBgbGF1bmNoKClgIG1ldGhvZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgdGhlIHJpcHBsZSB3aGVuIGNsaWNrIGV2ZW50cyBhcmUgcmVjZWl2ZWQuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZVRyaWdnZXInKVxuICBnZXQgdHJpZ2dlcigpIHsgcmV0dXJuIHRoaXMuX3RyaWdnZXIgfHwgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50OyB9XG4gIHNldCB0cmlnZ2VyKHRyaWdnZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5fdHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfdHJpZ2dlcjogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFJlbmRlcmVyIGZvciB0aGUgcmlwcGxlIERPTSBtYW5pcHVsYXRpb25zLiAqL1xuICBwcml2YXRlIF9yaXBwbGVSZW5kZXJlcjogUmlwcGxlUmVuZGVyZXI7XG5cbiAgLyoqIE9wdGlvbnMgdGhhdCBhcmUgc2V0IGdsb2JhbGx5IGZvciBhbGwgcmlwcGxlcy4gKi9cbiAgcHJpdmF0ZSBfZ2xvYmFsT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKiogV2hldGhlciByaXBwbGUgZGlyZWN0aXZlIGlzIGluaXRpYWxpemVkIGFuZCB0aGUgaW5wdXQgYmluZGluZ3MgYXJlIHNldC4gKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbE9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuXG4gICAgdGhpcy5fZ2xvYmFsT3B0aW9ucyA9IGdsb2JhbE9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgbmdab25lLCBfZWxlbWVudFJlZiwgcGxhdGZvcm0pO1xuXG4gICAgaWYgKGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMuX2dsb2JhbE9wdGlvbnMuYW5pbWF0aW9uID0ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH07XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IHNob3dpbmcgcmlwcGxlIGVsZW1lbnRzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVPdXRBbGwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBkaXJlY3RpdmUncyBpbnB1dCB2YWx1ZXMuXG4gICAqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBSaXBwbGVUYXJnZXRcbiAgICovXG4gIGdldCByaXBwbGVDb25maWcoKTogUmlwcGxlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyZWQ6IHRoaXMuY2VudGVyZWQsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICBhbmltYXRpb246IHsuLi50aGlzLl9nbG9iYWxPcHRpb25zLmFuaW1hdGlvbiwgLi4udGhpcy5hbmltYXRpb259LFxuICAgICAgdGVybWluYXRlT25Qb2ludGVyVXA6IHRoaXMuX2dsb2JhbE9wdGlvbnMudGVybWluYXRlT25Qb2ludGVyVXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlci1kb3duIGFyZSBkaXNhYmxlZCBvciBub3QuXG4gICAqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBSaXBwbGVUYXJnZXRcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhIXRoaXMuX2dsb2JhbE9wdGlvbnMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgdHJpZ2dlciBldmVudCBsaXN0ZW5lcnMgaWYgcmlwcGxlcyBhcmUgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5zZXR1cFRyaWdnZXJFdmVudHModGhpcy50cmlnZ2VyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmlwcGxlIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlndXJhdGlvbiBmb3IgdGhlIG1hbnVhbCByaXBwbGUuXG4gICAqL1xuICBsYXVuY2goY29uZmlnOiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWY7XG5cbiAgLyoqXG4gICAqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHdpdGhpbiB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIHggQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBYIGF4aXMgYXQgd2hpY2ggdG8gZmFkZS1pbiB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0geSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBmYWRlLWluIHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgcmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYW51YWwgcmlwcGxlLlxuICAgKi9cbiAgbGF1bmNoKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc/OiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWY7XG5cbiAgLyoqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVkIG9yIGp1c3QgYnkgdGhlIHJpcHBsZSBjb25maWcuICovXG4gIGxhdW5jaChjb25maWdPclg6IG51bWJlciB8IFJpcHBsZUNvbmZpZywgeTogbnVtYmVyID0gMCwgY29uZmlnPzogUmlwcGxlQ29uZmlnKTogUmlwcGxlUmVmIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZ09yWCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlSW5SaXBwbGUoY29uZmlnT3JYLCB5LCB7Li4udGhpcy5yaXBwbGVDb25maWcsIC4uLmNvbmZpZ30pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZUluUmlwcGxlKDAsIDAsIHsuLi50aGlzLnJpcHBsZUNvbmZpZywgLi4uY29uZmlnT3JYfSk7XG4gICAgfVxuICB9XG59XG5cbiJdfQ==