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
    /**
     * Whether click events will not trigger the ripple. Ripples can be still launched manually
     * by using the `launch()` method.
     */
    get disabled() {
        return this._disabled;
    }
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
    get trigger() {
        return this._trigger || this._elementRef.nativeElement;
    }
    set trigger(trigger) {
        this._trigger = trigger;
        this._setupTriggerEventsIfEnabled();
    }
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
        /** @docs-private Whether ripple directive is initialized and the input bindings are set. */
        this._isInitialized = false;
        this._globalOptions = globalOptions || {};
        this._rippleRenderer = new RippleRenderer(this, ngZone, _elementRef, platform);
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
                ...this.animation,
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatRipple, isStandalone: true, selector: "[mat-ripple], [matRipple]", inputs: { color: ["matRippleColor", "color"], unbounded: ["matRippleUnbounded", "unbounded"], centered: ["matRippleCentered", "centered"], radius: ["matRippleRadius", "radius"], animation: ["matRippleAnimation", "animation"], disabled: ["matRippleDisabled", "disabled"], trigger: ["matRippleTrigger", "trigger"] }, host: { properties: { "class.mat-ripple-unbounded": "unbounded" }, classAttribute: "mat-ripple" }, exportAs: ["matRipple"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-ripple], [matRipple]',
                    exportAs: 'matRipple',
                    host: {
                        'class': 'mat-ripple',
                        '[class.mat-ripple-unbounded]': 'unbounded',
                    },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }], propDecorators: { color: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sbUJBQW1CLENBQUM7QUFDL0QsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQXdCM0UsNkVBQTZFO0FBQzdFLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsQ0FDNUIsQ0FBQztBQVdGLE1BQU0sT0FBTyxTQUFTO0lBMkJwQjs7O09BR0c7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDekQsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLE9BQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyw0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VHJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsWUFBWTt3QkFDckIsOEJBQThCLEVBQUUsV0FBVztxQkFDNUM7b0JBQ0QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzswQkF3RUksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyx5QkFBeUI7OzBCQUM1QyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjt5Q0F0RWxCLEtBQUs7c0JBQTdCLEtBQUs7dUJBQUMsZ0JBQWdCO2dCQUdNLFNBQVM7c0JBQXJDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQU1DLFFBQVE7c0JBQW5DLEtBQUs7dUJBQUMsbUJBQW1CO2dCQU9BLE1BQU07c0JBQS9CLEtBQUs7dUJBQUMsaUJBQWlCO2dCQU9LLFNBQVM7c0JBQXJDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQU92QixRQUFRO3NCQURYLEtBQUs7dUJBQUMsbUJBQW1CO2dCQWtCdEIsT0FBTztzQkFEVixLQUFLO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSaXBwbGVBbmltYXRpb25Db25maWcsIFJpcHBsZUNvbmZpZywgUmlwcGxlUmVmfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuaW1wb3J0IHtSaXBwbGVSZW5kZXJlciwgUmlwcGxlVGFyZ2V0fSBmcm9tICcuL3JpcHBsZS1yZW5kZXJlcic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqIENvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciBgbWF0UmlwcGxlYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlR2xvYmFsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIGJlIGRpc2FibGVkLiBSaXBwbGVzIGNhbiBiZSBzdGlsbCBsYXVuY2hlZCBtYW51YWxseSBieSB1c2luZ1xuICAgKiB0aGUgYGxhdW5jaCgpYCBtZXRob2QuIFRoZXJlZm9yZSBmb2N1cyBpbmRpY2F0b3JzIHdpbGwgc3RpbGwgc2hvdyB1cC5cbiAgICovXG4gIGRpc2FibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIG9mIHRoZSByaXBwbGVzLiBUaGVyZSBhcmUgdHdvIHBoYXNlcyB3aXRoXG4gICAqIGRpZmZlcmVudCBkdXJhdGlvbnMgZm9yIHRoZSByaXBwbGVzOiBgZW50ZXJgIGFuZCBgbGVhdmVgLiBUaGUgZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW5cbiAgICogYnkgdGhlIHZhbHVlIG9mIGBtYXRSaXBwbGVBbmltYXRpb25gIG9yIGlmIHRoZSBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGlzIGluY2x1ZGVkLlxuICAgKi9cbiAgYW5pbWF0aW9uPzogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIHN0YXJ0IGZhZGluZyBvdXQgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIG1vdXNlIG9yIHRvdWNoIGlzIHJlbGVhc2VkLiBCeVxuICAgKiBkZWZhdWx0LCByaXBwbGVzIHdpbGwgd2FpdCBmb3IgdGhlIGVudGVyIGFuaW1hdGlvbiB0byBjb21wbGV0ZSBhbmQgZm9yIG1vdXNlIG9yIHRvdWNoIHJlbGVhc2UuXG4gICAqL1xuICB0ZXJtaW5hdGVPblBvaW50ZXJVcD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSaXBwbGVHbG9iYWxPcHRpb25zPihcbiAgJ21hdC1yaXBwbGUtZ2xvYmFsLW9wdGlvbnMnLFxuKTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1yaXBwbGVdLCBbbWF0UmlwcGxlXScsXG4gIGV4cG9ydEFzOiAnbWF0UmlwcGxlJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcmlwcGxlJyxcbiAgICAnW2NsYXNzLm1hdC1yaXBwbGUtdW5ib3VuZGVkXSc6ICd1bmJvdW5kZWQnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSaXBwbGUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUmlwcGxlVGFyZ2V0IHtcbiAgLyoqIEN1c3RvbSBjb2xvciBmb3IgYWxsIHJpcHBsZXMuICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQ29sb3InKSBjb2xvcjogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByaXBwbGVzIHNob3VsZCBiZSB2aXNpYmxlIG91dHNpZGUgdGhlIGNvbXBvbmVudCdzIGJvdW5kcy4gKi9cbiAgQElucHV0KCdtYXRSaXBwbGVVbmJvdW5kZWQnKSB1bmJvdW5kZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHJpcHBsZSBhbHdheXMgb3JpZ2luYXRlcyBmcm9tIHRoZSBjZW50ZXIgb2YgdGhlIGhvc3QgZWxlbWVudCdzIGJvdW5kcywgcmF0aGVyXG4gICAqIHRoYW4gb3JpZ2luYXRpbmcgZnJvbSB0aGUgbG9jYXRpb24gb2YgdGhlIGNsaWNrIGV2ZW50LlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVDZW50ZXJlZCcpIGNlbnRlcmVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBzZXQsIHRoZSByYWRpdXMgaW4gcGl4ZWxzIG9mIGZvcmVncm91bmQgcmlwcGxlcyB3aGVuIGZ1bGx5IGV4cGFuZGVkLiBJZiB1bnNldCwgdGhlIHJhZGl1c1xuICAgKiB3aWxsIGJlIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIgb2YgdGhlIHJpcHBsZSB0byB0aGUgZnVydGhlc3QgY29ybmVyIG9mIHRoZSBob3N0IGVsZW1lbnQnc1xuICAgKiBib3VuZGluZyByZWN0YW5nbGUuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZVJhZGl1cycpIHJhZGl1czogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBmb3IgdGhlIHJpcHBsZSBhbmltYXRpb24uIEFsbG93cyBtb2RpZnlpbmcgdGhlIGVudGVyIGFuZCBleGl0IGFuaW1hdGlvblxuICAgKiBkdXJhdGlvbiBvZiB0aGUgcmlwcGxlcy4gVGhlIGFuaW1hdGlvbiBkdXJhdGlvbnMgd2lsbCBiZSBvdmVyd3JpdHRlbiBpZiB0aGVcbiAgICogYE5vb3BBbmltYXRpb25zTW9kdWxlYCBpcyBiZWluZyB1c2VkLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVBbmltYXRpb24nKSBhbmltYXRpb246IFJpcHBsZUFuaW1hdGlvbkNvbmZpZztcblxuICAvKipcbiAgICogV2hldGhlciBjbGljayBldmVudHMgd2lsbCBub3QgdHJpZ2dlciB0aGUgcmlwcGxlLiBSaXBwbGVzIGNhbiBiZSBzdGlsbCBsYXVuY2hlZCBtYW51YWxseVxuICAgKiBieSB1c2luZyB0aGUgYGxhdW5jaCgpYCBtZXRob2QuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZURpc2FibGVkJylcbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuZmFkZU91dEFsbE5vblBlcnNpc3RlbnQoKTtcbiAgICB9XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgZWxlbWVudCB0aGF0IHRyaWdnZXJzIHRoZSByaXBwbGUgd2hlbiBjbGljayBldmVudHMgYXJlIHJlY2VpdmVkLlxuICAgKiBEZWZhdWx0cyB0byB0aGUgZGlyZWN0aXZlJ3MgaG9zdCBlbGVtZW50LlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVUcmlnZ2VyJylcbiAgZ2V0IHRyaWdnZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyaWdnZXIgfHwgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG4gIHNldCB0cmlnZ2VyKHRyaWdnZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5fdHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfdHJpZ2dlcjogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFJlbmRlcmVyIGZvciB0aGUgcmlwcGxlIERPTSBtYW5pcHVsYXRpb25zLiAqL1xuICBwcml2YXRlIF9yaXBwbGVSZW5kZXJlcjogUmlwcGxlUmVuZGVyZXI7XG5cbiAgLyoqIE9wdGlvbnMgdGhhdCBhcmUgc2V0IGdsb2JhbGx5IGZvciBhbGwgcmlwcGxlcy4gKi9cbiAgcHJpdmF0ZSBfZ2xvYmFsT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKiogQGRvY3MtcHJpdmF0ZSBXaGV0aGVyIHJpcHBsZSBkaXJlY3RpdmUgaXMgaW5pdGlhbGl6ZWQgYW5kIHRoZSBpbnB1dCBiaW5kaW5ncyBhcmUgc2V0LiAqL1xuICBfaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbE9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLl9nbG9iYWxPcHRpb25zID0gZ2xvYmFsT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlciA9IG5ldyBSaXBwbGVSZW5kZXJlcih0aGlzLCBuZ1pvbmUsIF9lbGVtZW50UmVmLCBwbGF0Zm9ybSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgc2hvd2luZyByaXBwbGUgZWxlbWVudHMuICovXG4gIGZhZGVPdXRBbGwoKSB7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZU91dEFsbCgpO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IHNob3dpbmcgbm9uLXBlcnNpc3RlbnQgcmlwcGxlIGVsZW1lbnRzLiAqL1xuICBmYWRlT3V0QWxsTm9uUGVyc2lzdGVudCgpIHtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlT3V0QWxsTm9uUGVyc2lzdGVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIGRpcmVjdGl2ZSdzIGlucHV0IHZhbHVlcy5cbiAgICogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFJpcHBsZVRhcmdldFxuICAgKi9cbiAgZ2V0IHJpcHBsZUNvbmZpZygpOiBSaXBwbGVDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBjZW50ZXJlZDogdGhpcy5jZW50ZXJlZCxcbiAgICAgIHJhZGl1czogdGhpcy5yYWRpdXMsXG4gICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICAuLi50aGlzLl9nbG9iYWxPcHRpb25zLmFuaW1hdGlvbixcbiAgICAgICAgLi4uKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycgPyB7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfSA6IHt9KSxcbiAgICAgICAgLi4udGhpcy5hbmltYXRpb24sXG4gICAgICB9LFxuICAgICAgdGVybWluYXRlT25Qb2ludGVyVXA6IHRoaXMuX2dsb2JhbE9wdGlvbnMudGVybWluYXRlT25Qb2ludGVyVXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlci1kb3duIGFyZSBkaXNhYmxlZCBvciBub3QuXG4gICAqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBSaXBwbGVUYXJnZXRcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhIXRoaXMuX2dsb2JhbE9wdGlvbnMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgdHJpZ2dlciBldmVudCBsaXN0ZW5lcnMgaWYgcmlwcGxlcyBhcmUgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5zZXR1cFRyaWdnZXJFdmVudHModGhpcy50cmlnZ2VyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmlwcGxlIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlndXJhdGlvbiBmb3IgdGhlIG1hbnVhbCByaXBwbGUuXG4gICAqL1xuICBsYXVuY2goY29uZmlnOiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWY7XG5cbiAgLyoqXG4gICAqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHggQ29vcmRpbmF0ZSBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIGZhZGUtaW4gdGhlIHJpcHBsZS4gQ29vcmRpbmF0ZVxuICAgKiAgIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBmYWRlLWluIHRoZSByaXBwbGUuIENvb3JkaW5hdGVcbiAgICogICBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0gY29uZmlnIE9wdGlvbmFsIHJpcHBsZSBjb25maWd1cmF0aW9uIGZvciB0aGUgbWFudWFsIHJpcHBsZS5cbiAgICovXG4gIGxhdW5jaCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uZmlnPzogUmlwcGxlQ29uZmlnKTogUmlwcGxlUmVmO1xuXG4gIC8qKiBMYXVuY2hlcyBhIG1hbnVhbCByaXBwbGUgYXQgdGhlIHNwZWNpZmllZCBjb29yZGluYXRlZCBvciBqdXN0IGJ5IHRoZSByaXBwbGUgY29uZmlnLiAqL1xuICBsYXVuY2goY29uZmlnT3JYOiBudW1iZXIgfCBSaXBwbGVDb25maWcsIHk6IG51bWJlciA9IDAsIGNvbmZpZz86IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZiB7XG4gICAgaWYgKHR5cGVvZiBjb25maWdPclggPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZUluUmlwcGxlKGNvbmZpZ09yWCwgeSwgey4uLnRoaXMucmlwcGxlQ29uZmlnLCAuLi5jb25maWd9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVJblJpcHBsZSgwLCAwLCB7Li4udGhpcy5yaXBwbGVDb25maWcsIC4uLmNvbmZpZ09yWH0pO1xuICAgIH1cbiAgfVxufVxuIl19