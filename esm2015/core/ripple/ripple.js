/**
 * @fileoverview added by tsickle
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBc0MsY0FBYyxFQUFlLE1BQU0sbUJBQW1CLENBQUM7QUFDcEcsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBRzNFLHlDQW1CQzs7Ozs7OztJQWRDLHVDQUFtQjs7Ozs7OztJQU9uQix3Q0FBa0M7Ozs7OztJQU1sQyxtREFBK0I7Ozs7OztBQUlqQyxNQUFNLE9BQU8seUJBQXlCLEdBQ2xDLElBQUksY0FBYyxDQUFzQiwyQkFBMkIsQ0FBQztBQVV4RSxNQUFNLE9BQU8sU0FBUzs7Ozs7Ozs7SUE2RHBCLFlBQW9CLFdBQW9DLEVBQzVDLE1BQWMsRUFDZCxRQUFrQixFQUM2QixhQUFtQyxFQUN2QyxhQUFzQjtRQUp6RCxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7Ozs7OztRQTFDOUIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQW1CckMsY0FBUyxHQUFZLEtBQUssQ0FBQzs7OztRQXFCM0IsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFRdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLElBQUksRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFL0UsSUFBSSxhQUFhLEtBQUssZ0JBQWdCLEVBQUU7WUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUMsQ0FBQztTQUNyRTtJQUNILENBQUM7Ozs7OztJQXpDRCxJQUNJLFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7OztJQUN6QyxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Ozs7OztJQU9ELElBQ0ksT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3pFLElBQUksT0FBTyxDQUFDLE9BQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Ozs7SUEwQkQsUUFBUTtRQUNOLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlDLENBQUM7Ozs7O0lBR0QsVUFBVTtRQUNSLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBTUQsSUFBSSxZQUFZO1FBQ2QsT0FBTztZQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFNBQVMsa0NBQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEdBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNoRSxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQjtTQUMvRCxDQUFDO0lBQ0osQ0FBQzs7Ozs7O0lBTUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7SUFDekQsQ0FBQzs7Ozs7O0lBR08sNEJBQTRCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkQ7SUFDSCxDQUFDOzs7Ozs7OztJQWlCRCxNQUFNLENBQUMsU0FBZ0MsRUFBRSxJQUFZLENBQUMsRUFBRSxNQUFxQjtRQUMzRSxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtDQUFNLElBQUksQ0FBQyxZQUFZLEdBQUssTUFBTSxFQUFFLENBQUM7U0FDM0Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsa0NBQU0sSUFBSSxDQUFDLFlBQVksR0FBSyxTQUFTLEVBQUUsQ0FBQztTQUN0RjtJQUNILENBQUM7OztZQW5KRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsWUFBWTtvQkFDckIsOEJBQThCLEVBQUUsV0FBVztpQkFDNUM7YUFDRjs7OztZQTlDQyxVQUFVO1lBSVYsTUFBTTtZQVBBLFFBQVE7NENBa0hELFFBQVEsWUFBSSxNQUFNLFNBQUMseUJBQXlCO3lDQUM1QyxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O29CQTlEcEQsS0FBSyxTQUFDLGdCQUFnQjt3QkFHdEIsS0FBSyxTQUFDLG9CQUFvQjt1QkFNMUIsS0FBSyxTQUFDLG1CQUFtQjtxQkFPekIsS0FBSyxTQUFDLGlCQUFpQjt3QkFPdkIsS0FBSyxTQUFDLG9CQUFvQjt1QkFNMUIsS0FBSyxTQUFDLG1CQUFtQjtzQkFZekIsS0FBSyxTQUFDLGtCQUFrQjs7Ozs7OztJQXpDekIsMEJBQXVDOzs7OztJQUd2Qyw4QkFBZ0Q7Ozs7OztJQU1oRCw2QkFBOEM7Ozs7Ozs7SUFPOUMsMkJBQTZDOzs7Ozs7O0lBTzdDLDhCQUE4RDs7Ozs7SUFZOUQsOEJBQW1DOzs7OztJQVluQyw2QkFBOEI7Ozs7OztJQUc5QixvQ0FBd0M7Ozs7OztJQUd4QyxtQ0FBNEM7Ozs7OztJQUc1QyxtQ0FBd0M7Ozs7O0lBRTVCLGdDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSaXBwbGVSZWZ9IGZyb20gJy4vcmlwcGxlLXJlZic7XG5pbXBvcnQge1JpcHBsZUFuaW1hdGlvbkNvbmZpZywgUmlwcGxlQ29uZmlnLCBSaXBwbGVSZW5kZXJlciwgUmlwcGxlVGFyZ2V0fSBmcm9tICcuL3JpcHBsZS1yZW5kZXJlcic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqIENvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciBgbWF0UmlwcGxlYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlR2xvYmFsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIGJlIGRpc2FibGVkLiBSaXBwbGVzIGNhbiBiZSBzdGlsbCBsYXVuY2hlZCBtYW51YWxseSBieSB1c2luZ1xuICAgKiB0aGUgYGxhdW5jaCgpYCBtZXRob2QuIFRoZXJlZm9yZSBmb2N1cyBpbmRpY2F0b3JzIHdpbGwgc3RpbGwgc2hvdyB1cC5cbiAgICovXG4gIGRpc2FibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBmb3IgdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBvZiB0aGUgcmlwcGxlcy4gVGhlcmUgYXJlIHR3byBwaGFzZXMgd2l0aCBkaWZmZXJlbnRcbiAgICogZHVyYXRpb25zIGZvciB0aGUgcmlwcGxlcy4gVGhlIGFuaW1hdGlvbiBkdXJhdGlvbnMgd2lsbCBiZSBvdmVyd3JpdHRlbiBpZiB0aGVcbiAgICogYE5vb3BBbmltYXRpb25zTW9kdWxlYCBpcyBiZWluZyB1c2VkLlxuICAgKi9cbiAgYW5pbWF0aW9uPzogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIHN0YXJ0IGZhZGluZyBvdXQgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIG1vdXNlIG9yIHRvdWNoIGlzIHJlbGVhc2VkLiBCeVxuICAgKiBkZWZhdWx0LCByaXBwbGVzIHdpbGwgd2FpdCBmb3IgdGhlIGVudGVyIGFuaW1hdGlvbiB0byBjb21wbGV0ZSBhbmQgZm9yIG1vdXNlIG9yIHRvdWNoIHJlbGVhc2UuXG4gICAqL1xuICB0ZXJtaW5hdGVPblBvaW50ZXJVcD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPFJpcHBsZUdsb2JhbE9wdGlvbnM+KCdtYXQtcmlwcGxlLWdsb2JhbC1vcHRpb25zJyk7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtcmlwcGxlXSwgW21hdFJpcHBsZV0nLFxuICBleHBvcnRBczogJ21hdFJpcHBsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXJpcHBsZScsXG4gICAgJ1tjbGFzcy5tYXQtcmlwcGxlLXVuYm91bmRlZF0nOiAndW5ib3VuZGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBSaXBwbGVUYXJnZXQge1xuXG4gIC8qKiBDdXN0b20gY29sb3IgZm9yIGFsbCByaXBwbGVzLiAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUNvbG9yJykgY29sb3I6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlcyBzaG91bGQgYmUgdmlzaWJsZSBvdXRzaWRlIHRoZSBjb21wb25lbnQncyBib3VuZHMuICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVW5ib3VuZGVkJykgdW5ib3VuZGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSByaXBwbGUgYWx3YXlzIG9yaWdpbmF0ZXMgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBob3N0IGVsZW1lbnQncyBib3VuZHMsIHJhdGhlclxuICAgKiB0aGFuIG9yaWdpbmF0aW5nIGZyb20gdGhlIGxvY2F0aW9uIG9mIHRoZSBjbGljayBldmVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQ2VudGVyZWQnKSBjZW50ZXJlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgc2V0LCB0aGUgcmFkaXVzIGluIHBpeGVscyBvZiBmb3JlZ3JvdW5kIHJpcHBsZXMgd2hlbiBmdWxseSBleHBhbmRlZC4gSWYgdW5zZXQsIHRoZSByYWRpdXNcbiAgICogd2lsbCBiZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSByaXBwbGUgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiB0aGUgaG9zdCBlbGVtZW50J3NcbiAgICogYm91bmRpbmcgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVSYWRpdXMnKSByYWRpdXM6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSByaXBwbGUgYW5pbWF0aW9uLiBBbGxvd3MgbW9kaWZ5aW5nIHRoZSBlbnRlciBhbmQgZXhpdCBhbmltYXRpb25cbiAgICogZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZSBhbmltYXRpb24gZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW4gaWYgdGhlXG4gICAqIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgYmVpbmcgdXNlZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQW5pbWF0aW9uJykgYW5pbWF0aW9uOiBSaXBwbGVBbmltYXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY2xpY2sgZXZlbnRzIHdpbGwgbm90IHRyaWdnZXIgdGhlIHJpcHBsZS4gUmlwcGxlcyBjYW4gYmUgc3RpbGwgbGF1bmNoZWQgbWFudWFsbHlcbiAgICogYnkgdXNpbmcgdGhlIGBsYXVuY2goKWAgbWV0aG9kLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyB0aGUgcmlwcGxlIHdoZW4gY2xpY2sgZXZlbnRzIGFyZSByZWNlaXZlZC5cbiAgICogRGVmYXVsdHMgdG8gdGhlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVHJpZ2dlcicpXG4gIGdldCB0cmlnZ2VyKCkgeyByZXR1cm4gdGhpcy5fdHJpZ2dlciB8fCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7IH1cbiAgc2V0IHRyaWdnZXIodHJpZ2dlcjogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLl90cmlnZ2VyID0gdHJpZ2dlcjtcbiAgICB0aGlzLl9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKTtcbiAgfVxuICBwcml2YXRlIF90cmlnZ2VyOiBIVE1MRWxlbWVudDtcblxuICAvKiogUmVuZGVyZXIgZm9yIHRoZSByaXBwbGUgRE9NIG1hbmlwdWxhdGlvbnMuICovXG4gIHByaXZhdGUgX3JpcHBsZVJlbmRlcmVyOiBSaXBwbGVSZW5kZXJlcjtcblxuICAvKiogT3B0aW9ucyB0aGF0IGFyZSBzZXQgZ2xvYmFsbHkgZm9yIGFsbCByaXBwbGVzLiAqL1xuICBwcml2YXRlIF9nbG9iYWxPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZSBkaXJlY3RpdmUgaXMgaW5pdGlhbGl6ZWQgYW5kIHRoZSBpbnB1dCBiaW5kaW5ncyBhcmUgc2V0LiAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIG5nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUykgZ2xvYmFsT3B0aW9ucz86IFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG5cbiAgICB0aGlzLl9nbG9iYWxPcHRpb25zID0gZ2xvYmFsT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlciA9IG5ldyBSaXBwbGVSZW5kZXJlcih0aGlzLCBuZ1pvbmUsIF9lbGVtZW50UmVmLCBwbGF0Zm9ybSk7XG5cbiAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5fZ2xvYmFsT3B0aW9ucy5hbmltYXRpb24gPSB7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgc2hvd2luZyByaXBwbGUgZWxlbWVudHMuICovXG4gIGZhZGVPdXRBbGwoKSB7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZU91dEFsbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIGRpcmVjdGl2ZSdzIGlucHV0IHZhbHVlcy5cbiAgICogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFJpcHBsZVRhcmdldFxuICAgKi9cbiAgZ2V0IHJpcHBsZUNvbmZpZygpOiBSaXBwbGVDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBjZW50ZXJlZDogdGhpcy5jZW50ZXJlZCxcbiAgICAgIHJhZGl1czogdGhpcy5yYWRpdXMsXG4gICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgIGFuaW1hdGlvbjogey4uLnRoaXMuX2dsb2JhbE9wdGlvbnMuYW5pbWF0aW9uLCAuLi50aGlzLmFuaW1hdGlvbn0sXG4gICAgICB0ZXJtaW5hdGVPblBvaW50ZXJVcDogdGhpcy5fZ2xvYmFsT3B0aW9ucy50ZXJtaW5hdGVPblBvaW50ZXJVcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyLWRvd24gYXJlIGRpc2FibGVkIG9yIG5vdC5cbiAgICogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFJpcHBsZVRhcmdldFxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICEhdGhpcy5fZ2xvYmFsT3B0aW9ucy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyBpZiByaXBwbGVzIGFyZSBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuX2lzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLnNldHVwVHJpZ2dlckV2ZW50cyh0aGlzLnRyaWdnZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMYXVuY2hlcyBhIG1hbnVhbCByaXBwbGUgdXNpbmcgdGhlIHNwZWNpZmllZCByaXBwbGUgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciB0aGUgbWFudWFsIHJpcHBsZS5cbiAgICovXG4gIGxhdW5jaChjb25maWc6IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZjtcblxuICAvKipcbiAgICogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIGF0IHRoZSBzcGVjaWZpZWQgY29vcmRpbmF0ZXMgd2l0aGluIHRoZSBlbGVtZW50LlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFggYXhpcyBhdCB3aGljaCB0byBmYWRlLWluIHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIGZhZGUtaW4gdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIGNvbmZpZyBPcHRpb25hbCByaXBwbGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIG1hbnVhbCByaXBwbGUuXG4gICAqL1xuICBsYXVuY2goeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZz86IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZjtcblxuICAvKiogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIGF0IHRoZSBzcGVjaWZpZWQgY29vcmRpbmF0ZWQgb3IganVzdCBieSB0aGUgcmlwcGxlIGNvbmZpZy4gKi9cbiAgbGF1bmNoKGNvbmZpZ09yWDogbnVtYmVyIHwgUmlwcGxlQ29uZmlnLCB5OiBudW1iZXIgPSAwLCBjb25maWc/OiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWYge1xuICAgIGlmICh0eXBlb2YgY29uZmlnT3JYID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVJblJpcHBsZShjb25maWdPclgsIHksIHsuLi50aGlzLnJpcHBsZUNvbmZpZywgLi4uY29uZmlnfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlSW5SaXBwbGUoMCwgMCwgey4uLnRoaXMucmlwcGxlQ29uZmlnLCAuLi5jb25maWdPclh9KTtcbiAgICB9XG4gIH1cbn1cblxuIl19