/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, ANIMATION_MODULE_TYPE, Injector, } from '@angular/core';
import { RippleRenderer } from './ripple-renderer';
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
    constructor(_elementRef, ngZone, platform, globalOptions, _animationMode, injector) {
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
        // Note: cannot use `inject()` here, because this class
        // gets instantiated manually in the ripple loader.
        this._globalOptions = globalOptions || {};
        this._rippleRenderer = new RippleRenderer(this, ngZone, _elementRef, platform, injector);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MatRipple, isStandalone: true, selector: "[mat-ripple], [matRipple]", inputs: { color: ["matRippleColor", "color"], unbounded: ["matRippleUnbounded", "unbounded"], centered: ["matRippleCentered", "centered"], radius: ["matRippleRadius", "radius"], animation: ["matRippleAnimation", "animation"], disabled: ["matRippleDisabled", "disabled"], trigger: ["matRippleTrigger", "trigger"] }, host: { properties: { "class.mat-ripple-unbounded": "unbounded" }, classAttribute: "mat-ripple" }, exportAs: ["matRipple"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatRipple, decorators: [{
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
                }] }, { type: i0.Injector }], propDecorators: { color: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixxQkFBcUIsRUFDckIsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBQyxjQUFjLEVBQWUsTUFBTSxtQkFBbUIsQ0FBQzs7O0FBNkIvRCw2RUFBNkU7QUFDN0UsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxjQUFjLENBQ3pELDJCQUEyQixDQUM1QixDQUFDO0FBV0YsTUFBTSxPQUFPLFNBQVM7SUEyQnBCOzs7T0FHRztJQUNILElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1YsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDakMsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDekQsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLE9BQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxD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NUpVLFNBQVMsMEZBdUVFLHlCQUF5Qiw2QkFDekIscUJBQXFCO3lHQXhFaEMsU0FBUzs7a0dBQVQsU0FBUztrQkFUckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsV0FBVztvQkFDckIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxZQUFZO3dCQUNyQiw4QkFBOEIsRUFBRSxXQUFXO3FCQUM1QztvQkFDRCxVQUFVLEVBQUUsSUFBSTtpQkFDakI7OzBCQXdFSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHlCQUF5Qjs7MEJBQzVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCO2dFQXRFbEIsS0FBSztzQkFBN0IsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBR00sU0FBUztzQkFBckMsS0FBSzt1QkFBQyxvQkFBb0I7Z0JBTUMsUUFBUTtzQkFBbkMsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBT0EsTUFBTTtzQkFBL0IsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBT0ssU0FBUztzQkFBckMsS0FBSzt1QkFBQyxvQkFBb0I7Z0JBT3ZCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBa0J0QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxuICBJbmplY3Rvcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge19DZGtQcml2YXRlU3R5bGVMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wcml2YXRlJztcbmltcG9ydCB7UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCBSaXBwbGVDb25maWcsIFJpcHBsZVJlZn0gZnJvbSAnLi9yaXBwbGUtcmVmJztcbmltcG9ydCB7UmlwcGxlUmVuZGVyZXIsIFJpcHBsZVRhcmdldH0gZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuXG4vKiogQ29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIGBtYXRSaXBwbGVgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVHbG9iYWxPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgYmUgZGlzYWJsZWQuIFJpcHBsZXMgY2FuIGJlIHN0aWxsIGxhdW5jaGVkIG1hbnVhbGx5IGJ5IHVzaW5nXG4gICAqIHRoZSBgbGF1bmNoKClgIG1ldGhvZC4gVGhlcmVmb3JlIGZvY3VzIGluZGljYXRvcnMgd2lsbCBzdGlsbCBzaG93IHVwLlxuICAgKi9cbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhbmltYXRpb24gZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZXJlIGFyZSB0d28gcGhhc2VzIHdpdGhcbiAgICogZGlmZmVyZW50IGR1cmF0aW9ucyBmb3IgdGhlIHJpcHBsZXM6IGBlbnRlcmAgYW5kIGBsZWF2ZWAuIFRoZSBkdXJhdGlvbnMgd2lsbCBiZSBvdmVyd3JpdHRlblxuICAgKiBieSB0aGUgdmFsdWUgb2YgYG1hdFJpcHBsZUFuaW1hdGlvbmAgb3IgaWYgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgaW5jbHVkZWQuXG4gICAqL1xuICBhbmltYXRpb24/OiBSaXBwbGVBbmltYXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgc3RhcnQgZmFkaW5nIG91dCBpbW1lZGlhdGVseSBhZnRlciB0aGUgbW91c2Ugb3IgdG91Y2ggaXMgcmVsZWFzZWQuIEJ5XG4gICAqIGRlZmF1bHQsIHJpcHBsZXMgd2lsbCB3YWl0IGZvciB0aGUgZW50ZXIgYW5pbWF0aW9uIHRvIGNvbXBsZXRlIGFuZCBmb3IgbW91c2Ugb3IgdG91Y2ggcmVsZWFzZS5cbiAgICovXG4gIHRlcm1pbmF0ZU9uUG9pbnRlclVwPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBuYW1lc3BhY2UgdG8gdXNlIGZvciByaXBwbGUgbG9hZGVyIHRvIGFsbG93IG11bHRpcGxlIGluc3RhbmNlcyB0byBleGlzdCBvbiB0aGUgc2FtZSBwYWdlLlxuICAgKi9cbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgZ2xvYmFsIHJpcHBsZSBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48UmlwcGxlR2xvYmFsT3B0aW9ucz4oXG4gICdtYXQtcmlwcGxlLWdsb2JhbC1vcHRpb25zJyxcbik7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtcmlwcGxlXSwgW21hdFJpcHBsZV0nLFxuICBleHBvcnRBczogJ21hdFJpcHBsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXJpcHBsZScsXG4gICAgJ1tjbGFzcy5tYXQtcmlwcGxlLXVuYm91bmRlZF0nOiAndW5ib3VuZGVkJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBDdXN0b20gY29sb3IgZm9yIGFsbCByaXBwbGVzLiAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUNvbG9yJykgY29sb3I6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlcyBzaG91bGQgYmUgdmlzaWJsZSBvdXRzaWRlIHRoZSBjb21wb25lbnQncyBib3VuZHMuICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVW5ib3VuZGVkJykgdW5ib3VuZGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSByaXBwbGUgYWx3YXlzIG9yaWdpbmF0ZXMgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBob3N0IGVsZW1lbnQncyBib3VuZHMsIHJhdGhlclxuICAgKiB0aGFuIG9yaWdpbmF0aW5nIGZyb20gdGhlIGxvY2F0aW9uIG9mIHRoZSBjbGljayBldmVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQ2VudGVyZWQnKSBjZW50ZXJlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgc2V0LCB0aGUgcmFkaXVzIGluIHBpeGVscyBvZiBmb3JlZ3JvdW5kIHJpcHBsZXMgd2hlbiBmdWxseSBleHBhbmRlZC4gSWYgdW5zZXQsIHRoZSByYWRpdXNcbiAgICogd2lsbCBiZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSByaXBwbGUgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiB0aGUgaG9zdCBlbGVtZW50J3NcbiAgICogYm91bmRpbmcgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVSYWRpdXMnKSByYWRpdXM6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSByaXBwbGUgYW5pbWF0aW9uLiBBbGxvd3MgbW9kaWZ5aW5nIHRoZSBlbnRlciBhbmQgZXhpdCBhbmltYXRpb25cbiAgICogZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZSBhbmltYXRpb24gZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW4gaWYgdGhlXG4gICAqIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgYmVpbmcgdXNlZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQW5pbWF0aW9uJykgYW5pbWF0aW9uOiBSaXBwbGVBbmltYXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY2xpY2sgZXZlbnRzIHdpbGwgbm90IHRyaWdnZXIgdGhlIHJpcHBsZS4gUmlwcGxlcyBjYW4gYmUgc3RpbGwgbGF1bmNoZWQgbWFudWFsbHlcbiAgICogYnkgdXNpbmcgdGhlIGBsYXVuY2goKWAgbWV0aG9kLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCk7XG4gICAgfVxuICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyB0aGUgcmlwcGxlIHdoZW4gY2xpY2sgZXZlbnRzIGFyZSByZWNlaXZlZC5cbiAgICogRGVmYXVsdHMgdG8gdGhlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVHJpZ2dlcicpXG4gIGdldCB0cmlnZ2VyKCkge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyIHx8IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuICBzZXQgdHJpZ2dlcih0cmlnZ2VyOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuX3RyaWdnZXIgPSB0cmlnZ2VyO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX3RyaWdnZXI6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBSZW5kZXJlciBmb3IgdGhlIHJpcHBsZSBET00gbWFuaXB1bGF0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfcmlwcGxlUmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIC8qKiBPcHRpb25zIHRoYXQgYXJlIHNldCBnbG9iYWxseSBmb3IgYWxsIHJpcHBsZXMuICovXG4gIHByaXZhdGUgX2dsb2JhbE9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgV2hldGhlciByaXBwbGUgZGlyZWN0aXZlIGlzIGluaXRpYWxpemVkIGFuZCB0aGUgaW5wdXQgYmluZGluZ3MgYXJlIHNldC4gKi9cbiAgX2lzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxPcHRpb25zPzogUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBpbmplY3Rvcj86IEluamVjdG9yLFxuICApIHtcbiAgICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBpbmplY3QoKWAgaGVyZSwgYmVjYXVzZSB0aGlzIGNsYXNzXG4gICAgLy8gZ2V0cyBpbnN0YW50aWF0ZWQgbWFudWFsbHkgaW4gdGhlIHJpcHBsZSBsb2FkZXIuXG4gICAgdGhpcy5fZ2xvYmFsT3B0aW9ucyA9IGdsb2JhbE9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgbmdab25lLCBfZWxlbWVudFJlZiwgcGxhdGZvcm0sIGluamVjdG9yKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBzaG93aW5nIHJpcHBsZSBlbGVtZW50cy4gKi9cbiAgZmFkZU91dEFsbCgpIHtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlT3V0QWxsKCk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgc2hvd2luZyBub24tcGVyc2lzdGVudCByaXBwbGUgZWxlbWVudHMuICovXG4gIGZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgZGlyZWN0aXZlJ3MgaW5wdXQgdmFsdWVzLlxuICAgKiBAZG9jcy1wcml2YXRlIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgUmlwcGxlVGFyZ2V0XG4gICAqL1xuICBnZXQgcmlwcGxlQ29uZmlnKCk6IFJpcHBsZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbnRlcmVkOiB0aGlzLmNlbnRlcmVkLFxuICAgICAgcmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIC4uLnRoaXMuX2dsb2JhbE9wdGlvbnMuYW5pbWF0aW9uLFxuICAgICAgICAuLi4odGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJyA/IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9IDoge30pLFxuICAgICAgICAuLi50aGlzLmFuaW1hdGlvbixcbiAgICAgIH0sXG4gICAgICB0ZXJtaW5hdGVPblBvaW50ZXJVcDogdGhpcy5fZ2xvYmFsT3B0aW9ucy50ZXJtaW5hdGVPblBvaW50ZXJVcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyLWRvd24gYXJlIGRpc2FibGVkIG9yIG5vdC5cbiAgICogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFJpcHBsZVRhcmdldFxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICEhdGhpcy5fZ2xvYmFsT3B0aW9ucy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyBpZiByaXBwbGVzIGFyZSBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuX2lzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLnNldHVwVHJpZ2dlckV2ZW50cyh0aGlzLnRyaWdnZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMYXVuY2hlcyBhIG1hbnVhbCByaXBwbGUgdXNpbmcgdGhlIHNwZWNpZmllZCByaXBwbGUgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciB0aGUgbWFudWFsIHJpcHBsZS5cbiAgICovXG4gIGxhdW5jaChjb25maWc6IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZjtcblxuICAvKipcbiAgICogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIGF0IHRoZSBzcGVjaWZpZWQgY29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIGFsb25nIHRoZSBYIGF4aXMgYXQgd2hpY2ggdG8gZmFkZS1pbiB0aGUgcmlwcGxlLiBDb29yZGluYXRlXG4gICAqICAgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHkgQ29vcmRpbmF0ZSBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIGZhZGUtaW4gdGhlIHJpcHBsZS4gQ29vcmRpbmF0ZVxuICAgKiAgIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgcmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYW51YWwgcmlwcGxlLlxuICAgKi9cbiAgbGF1bmNoKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc/OiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWY7XG5cbiAgLyoqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVkIG9yIGp1c3QgYnkgdGhlIHJpcHBsZSBjb25maWcuICovXG4gIGxhdW5jaChjb25maWdPclg6IG51bWJlciB8IFJpcHBsZUNvbmZpZywgeTogbnVtYmVyID0gMCwgY29uZmlnPzogUmlwcGxlQ29uZmlnKTogUmlwcGxlUmVmIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZ09yWCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlSW5SaXBwbGUoY29uZmlnT3JYLCB5LCB7Li4udGhpcy5yaXBwbGVDb25maWcsIC4uLmNvbmZpZ30pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZUluUmlwcGxlKDAsIDAsIHsuLi50aGlzLnJpcHBsZUNvbmZpZywgLi4uY29uZmlnT3JYfSk7XG4gICAgfVxuICB9XG59XG4iXX0=