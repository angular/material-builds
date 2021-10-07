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
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Injection token that can be used to specify the global ripple options. */
export const MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken('mat-ripple-global-options');
export class MatRipple {
    constructor(_elementRef, ngZone, platform, globalOptions, _animationMode) {
        this._elementRef = _elementRef;
        this._animationMode = _animationMode;
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.radius = 0;
        this._disabled = false;
        /** Whether ripple directive is initialized and the input bindings are set. */
        this._isInitialized = false;
        this._globalOptions = globalOptions || {};
        this._rippleRenderer = new RippleRenderer(this, ngZone, _elementRef, platform);
    }
    /**
     * Whether click events will not trigger the ripple. Ripples can be still launched manually
     * by using the `launch()` method.
     */
    get disabled() { return this._disabled; }
    set disabled(value) {
        if (value) {
            this.fadeOutAllNonPersistent();
        }
        this._disabled = value;
        this._setupTriggerEventsIfEnabled();
    }
    /**
     * The element that triggers the ripple when click events are received.
     * Defaults to the directive's host element.
     */
    get trigger() { return this._trigger || this._elementRef.nativeElement; }
    set trigger(trigger) {
        this._trigger = trigger;
        this._setupTriggerEventsIfEnabled();
    }
    ngOnInit() {
        this._isInitialized = true;
        this._setupTriggerEventsIfEnabled();
    }
    ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
    }
    /** Fades out all currently showing ripple elements. */
    fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
    }
    /** Fades out all currently showing non-persistent ripple elements. */
    fadeOutAllNonPersistent() {
        this._rippleRenderer.fadeOutAllNonPersistent();
    }
    /**
     * Ripple configuration from the directive's input values.
     * @docs-private Implemented as part of RippleTarget
     */
    get rippleConfig() {
        return {
            centered: this.centered,
            radius: this.radius,
            color: this.color,
            animation: {
                ...this._globalOptions.animation,
                ...(this._animationMode === 'NoopAnimations' ? { enterDuration: 0, exitDuration: 0 } : {}),
                ...this.animation
            },
            terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
        };
    }
    /**
     * Whether ripples on pointer-down are disabled or not.
     * @docs-private Implemented as part of RippleTarget
     */
    get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
    }
    /** Sets up the trigger event listeners if ripples are enabled. */
    _setupTriggerEventsIfEnabled() {
        if (!this.disabled && this._isInitialized) {
            this._rippleRenderer.setupTriggerEvents(this.trigger);
        }
    }
    /** Launches a manual ripple at the specified coordinated or just by the ripple config. */
    launch(configOrX, y = 0, config) {
        if (typeof configOrX === 'number') {
            return this._rippleRenderer.fadeInRipple(configOrX, y, { ...this.rippleConfig, ...config });
        }
        else {
            return this._rippleRenderer.fadeInRipple(0, 0, { ...this.rippleConfig, ...configOrX });
        }
    }
}
MatRipple.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatRipple.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: { color: ["matRippleColor", "color"], unbounded: ["matRippleUnbounded", "unbounded"], centered: ["matRippleCentered", "centered"], radius: ["matRippleRadius", "radius"], animation: ["matRippleAnimation", "animation"], disabled: ["matRippleDisabled", "disabled"], trigger: ["matRippleTrigger", "trigger"] }, host: { properties: { "class.mat-ripple-unbounded": "unbounded" }, classAttribute: "mat-ripple" }, exportAs: ["matRipple"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-ripple], [matRipple]',
                    exportAs: 'matRipple',
                    host: {
                        'class': 'mat-ripple',
                        '[class.mat-ripple-unbounded]': 'unbounded'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { color: [{
                type: Input,
                args: ['matRippleColor']
            }], unbounded: [{
                type: Input,
                args: ['matRippleUnbounded']
            }], centered: [{
                type: Input,
                args: ['matRippleCentered']
            }], radius: [{
                type: Input,
                args: ['matRippleRadius']
            }], animation: [{
                type: Input,
                args: ['matRippleAnimation']
            }], disabled: [{
                type: Input,
                args: ['matRippleDisabled']
            }], trigger: [{
                type: Input,
                args: ['matRippleTrigger']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sbUJBQW1CLENBQUM7QUFDL0QsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQXdCM0UsNkVBQTZFO0FBQzdFLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUNsQyxJQUFJLGNBQWMsQ0FBc0IsMkJBQTJCLENBQUMsQ0FBQztBQVV6RSxNQUFNLE9BQU8sU0FBUztJQWdFcEIsWUFBb0IsV0FBb0MsRUFDNUMsTUFBYyxFQUNkLFFBQWtCLEVBQzZCLGFBQW1DLEVBQy9CLGNBQXVCO1FBSmxFLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUlPLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBdER0Rjs7OztXQUlHO1FBQ3VCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFzQnJDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFvQm5DLDhFQUE4RTtRQUN0RSxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQVF0QyxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBNUNEOzs7T0FHRztJQUNILElBQ0ksUUFBUSxLQUFLLE9BQU8s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O2tCQVJyQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFFBQVEsRUFBRSxXQUFXO29CQUNyQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFlBQVk7d0JBQ3JCLDhCQUE4QixFQUFFLFdBQVc7cUJBQzVDO2lCQUNGOzswQkFvRWMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyx5QkFBeUI7OzBCQUM1QyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs0Q0FqRTVCLEtBQUs7c0JBQTdCLEtBQUs7dUJBQUMsZ0JBQWdCO2dCQUdNLFNBQVM7c0JBQXJDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQU1DLFFBQVE7c0JBQW5DLEtBQUs7dUJBQUMsbUJBQW1CO2dCQU9BLE1BQU07c0JBQS9CLEtBQUs7dUJBQUMsaUJBQWlCO2dCQU9LLFNBQVM7c0JBQXJDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQU92QixRQUFRO3NCQURYLEtBQUs7dUJBQUMsbUJBQW1CO2dCQWdCdEIsT0FBTztzQkFEVixLQUFLO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSaXBwbGVBbmltYXRpb25Db25maWcsIFJpcHBsZUNvbmZpZywgUmlwcGxlUmVmfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuaW1wb3J0IHtSaXBwbGVSZW5kZXJlciwgUmlwcGxlVGFyZ2V0fSBmcm9tICcuL3JpcHBsZS1yZW5kZXJlcic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqIENvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciBgbWF0UmlwcGxlYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlR2xvYmFsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIGJlIGRpc2FibGVkLiBSaXBwbGVzIGNhbiBiZSBzdGlsbCBsYXVuY2hlZCBtYW51YWxseSBieSB1c2luZ1xuICAgKiB0aGUgYGxhdW5jaCgpYCBtZXRob2QuIFRoZXJlZm9yZSBmb2N1cyBpbmRpY2F0b3JzIHdpbGwgc3RpbGwgc2hvdyB1cC5cbiAgICovXG4gIGRpc2FibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIG9mIHRoZSByaXBwbGVzLiBUaGVyZSBhcmUgdHdvIHBoYXNlcyB3aXRoXG4gICAqIGRpZmZlcmVudCBkdXJhdGlvbnMgZm9yIHRoZSByaXBwbGVzOiBgZW50ZXJgIGFuZCBgbGVhdmVgLiBUaGUgZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW5cbiAgICogYnkgdGhlIHZhbHVlIG9mIGBtYXRSaXBwbGVBbmltYXRpb25gIG9yIGlmIHRoZSBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGlzIGluY2x1ZGVkLlxuICAgKi9cbiAgYW5pbWF0aW9uPzogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIHN0YXJ0IGZhZGluZyBvdXQgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIG1vdXNlIG9yIHRvdWNoIGlzIHJlbGVhc2VkLiBCeVxuICAgKiBkZWZhdWx0LCByaXBwbGVzIHdpbGwgd2FpdCBmb3IgdGhlIGVudGVyIGFuaW1hdGlvbiB0byBjb21wbGV0ZSBhbmQgZm9yIG1vdXNlIG9yIHRvdWNoIHJlbGVhc2UuXG4gICAqL1xuICB0ZXJtaW5hdGVPblBvaW50ZXJVcD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPFJpcHBsZUdsb2JhbE9wdGlvbnM+KCdtYXQtcmlwcGxlLWdsb2JhbC1vcHRpb25zJyk7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtcmlwcGxlXSwgW21hdFJpcHBsZV0nLFxuICBleHBvcnRBczogJ21hdFJpcHBsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXJpcHBsZScsXG4gICAgJ1tjbGFzcy5tYXQtcmlwcGxlLXVuYm91bmRlZF0nOiAndW5ib3VuZGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBSaXBwbGVUYXJnZXQge1xuXG4gIC8qKiBDdXN0b20gY29sb3IgZm9yIGFsbCByaXBwbGVzLiAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUNvbG9yJykgY29sb3I6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlcyBzaG91bGQgYmUgdmlzaWJsZSBvdXRzaWRlIHRoZSBjb21wb25lbnQncyBib3VuZHMuICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVW5ib3VuZGVkJykgdW5ib3VuZGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSByaXBwbGUgYWx3YXlzIG9yaWdpbmF0ZXMgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBob3N0IGVsZW1lbnQncyBib3VuZHMsIHJhdGhlclxuICAgKiB0aGFuIG9yaWdpbmF0aW5nIGZyb20gdGhlIGxvY2F0aW9uIG9mIHRoZSBjbGljayBldmVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQ2VudGVyZWQnKSBjZW50ZXJlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgc2V0LCB0aGUgcmFkaXVzIGluIHBpeGVscyBvZiBmb3JlZ3JvdW5kIHJpcHBsZXMgd2hlbiBmdWxseSBleHBhbmRlZC4gSWYgdW5zZXQsIHRoZSByYWRpdXNcbiAgICogd2lsbCBiZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSByaXBwbGUgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiB0aGUgaG9zdCBlbGVtZW50J3NcbiAgICogYm91bmRpbmcgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVSYWRpdXMnKSByYWRpdXM6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSByaXBwbGUgYW5pbWF0aW9uLiBBbGxvd3MgbW9kaWZ5aW5nIHRoZSBlbnRlciBhbmQgZXhpdCBhbmltYXRpb25cbiAgICogZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZSBhbmltYXRpb24gZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW4gaWYgdGhlXG4gICAqIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgYmVpbmcgdXNlZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQW5pbWF0aW9uJykgYW5pbWF0aW9uOiBSaXBwbGVBbmltYXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY2xpY2sgZXZlbnRzIHdpbGwgbm90IHRyaWdnZXIgdGhlIHJpcHBsZS4gUmlwcGxlcyBjYW4gYmUgc3RpbGwgbGF1bmNoZWQgbWFudWFsbHlcbiAgICogYnkgdXNpbmcgdGhlIGBsYXVuY2goKWAgbWV0aG9kLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5mYWRlT3V0QWxsTm9uUGVyc2lzdGVudCgpO1xuICAgIH1cbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgdGhlIHJpcHBsZSB3aGVuIGNsaWNrIGV2ZW50cyBhcmUgcmVjZWl2ZWQuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZVRyaWdnZXInKVxuICBnZXQgdHJpZ2dlcigpIHsgcmV0dXJuIHRoaXMuX3RyaWdnZXIgfHwgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50OyB9XG4gIHNldCB0cmlnZ2VyKHRyaWdnZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5fdHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfdHJpZ2dlcjogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFJlbmRlcmVyIGZvciB0aGUgcmlwcGxlIERPTSBtYW5pcHVsYXRpb25zLiAqL1xuICBwcml2YXRlIF9yaXBwbGVSZW5kZXJlcjogUmlwcGxlUmVuZGVyZXI7XG5cbiAgLyoqIE9wdGlvbnMgdGhhdCBhcmUgc2V0IGdsb2JhbGx5IGZvciBhbGwgcmlwcGxlcy4gKi9cbiAgcHJpdmF0ZSBfZ2xvYmFsT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKiogV2hldGhlciByaXBwbGUgZGlyZWN0aXZlIGlzIGluaXRpYWxpemVkIGFuZCB0aGUgaW5wdXQgYmluZGluZ3MgYXJlIHNldC4gKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbE9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuXG4gICAgdGhpcy5fZ2xvYmFsT3B0aW9ucyA9IGdsb2JhbE9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgbmdab25lLCBfZWxlbWVudFJlZiwgcGxhdGZvcm0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IHNob3dpbmcgcmlwcGxlIGVsZW1lbnRzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVPdXRBbGwoKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBzaG93aW5nIG5vbi1wZXJzaXN0ZW50IHJpcHBsZSBlbGVtZW50cy4gKi9cbiAgZmFkZU91dEFsbE5vblBlcnNpc3RlbnQoKSB7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZU91dEFsbE5vblBlcnNpc3RlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBkaXJlY3RpdmUncyBpbnB1dCB2YWx1ZXMuXG4gICAqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBSaXBwbGVUYXJnZXRcbiAgICovXG4gIGdldCByaXBwbGVDb25maWcoKTogUmlwcGxlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyZWQ6IHRoaXMuY2VudGVyZWQsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgLi4udGhpcy5fZ2xvYmFsT3B0aW9ucy5hbmltYXRpb24sXG4gICAgICAgIC4uLih0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnID8ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0gOiB7fSksXG4gICAgICAgIC4uLnRoaXMuYW5pbWF0aW9uXG4gICAgICB9LFxuICAgICAgdGVybWluYXRlT25Qb2ludGVyVXA6IHRoaXMuX2dsb2JhbE9wdGlvbnMudGVybWluYXRlT25Qb2ludGVyVXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlci1kb3duIGFyZSBkaXNhYmxlZCBvciBub3QuXG4gICAqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBSaXBwbGVUYXJnZXRcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhIXRoaXMuX2dsb2JhbE9wdGlvbnMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgdHJpZ2dlciBldmVudCBsaXN0ZW5lcnMgaWYgcmlwcGxlcyBhcmUgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5zZXR1cFRyaWdnZXJFdmVudHModGhpcy50cmlnZ2VyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmlwcGxlIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlndXJhdGlvbiBmb3IgdGhlIG1hbnVhbCByaXBwbGUuXG4gICAqL1xuICBsYXVuY2goY29uZmlnOiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWY7XG5cbiAgLyoqXG4gICAqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHggQ29vcmRpbmF0ZSBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIGZhZGUtaW4gdGhlIHJpcHBsZS4gQ29vcmRpbmF0ZVxuICAgKiAgIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBmYWRlLWluIHRoZSByaXBwbGUuIENvb3JkaW5hdGVcbiAgICogICBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0gY29uZmlnIE9wdGlvbmFsIHJpcHBsZSBjb25maWd1cmF0aW9uIGZvciB0aGUgbWFudWFsIHJpcHBsZS5cbiAgICovXG4gIGxhdW5jaCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uZmlnPzogUmlwcGxlQ29uZmlnKTogUmlwcGxlUmVmO1xuXG4gIC8qKiBMYXVuY2hlcyBhIG1hbnVhbCByaXBwbGUgYXQgdGhlIHNwZWNpZmllZCBjb29yZGluYXRlZCBvciBqdXN0IGJ5IHRoZSByaXBwbGUgY29uZmlnLiAqL1xuICBsYXVuY2goY29uZmlnT3JYOiBudW1iZXIgfCBSaXBwbGVDb25maWcsIHk6IG51bWJlciA9IDAsIGNvbmZpZz86IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZiB7XG4gICAgaWYgKHR5cGVvZiBjb25maWdPclggPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZUluUmlwcGxlKGNvbmZpZ09yWCwgeSwgey4uLnRoaXMucmlwcGxlQ29uZmlnLCAuLi5jb25maWd9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVJblJpcHBsZSgwLCAwLCB7Li4udGhpcy5yaXBwbGVDb25maWcsIC4uLmNvbmZpZ09yWH0pO1xuICAgIH1cbiAgfVxufVxuXG4iXX0=