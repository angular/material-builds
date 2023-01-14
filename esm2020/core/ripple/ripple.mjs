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
        /** Whether ripple directive is initialized and the input bindings are set. */
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
}
MatRipple.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatRipple.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: { color: ["matRippleColor", "color"], unbounded: ["matRippleUnbounded", "unbounded"], centered: ["matRippleCentered", "centered"], radius: ["matRippleRadius", "radius"], animation: ["matRippleAnimation", "animation"], disabled: ["matRippleDisabled", "disabled"], trigger: ["matRippleTrigger", "trigger"] }, host: { properties: { "class.mat-ripple-unbounded": "unbounded" }, classAttribute: "mat-ripple" }, exportAs: ["matRipple"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-ripple], [matRipple]',
                    exportAs: 'matRipple',
                    host: {
                        'class': 'mat-ripple',
                        '[class.mat-ripple-unbounded]': 'unbounded',
                    },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sbUJBQW1CLENBQUM7QUFDL0QsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQXdCM0UsNkVBQTZFO0FBQzdFLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsQ0FDNUIsQ0FBQztBQVVGLE1BQU0sT0FBTyxTQUFTO0lBMkJwQjs7O09BR0c7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDekQsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLE9BQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyw0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UnJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsWUFBWTt3QkFDckIsOEJBQThCLEVBQUUsV0FBVztxQkFDNUM7aUJBQ0Y7OzBCQXdFSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHlCQUF5Qjs7MEJBQzVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQXRFbEIsS0FBSztzQkFBN0IsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBR00sU0FBUztzQkFBckMsS0FBSzt1QkFBQyxvQkFBb0I7Z0JBTUMsUUFBUTtzQkFBbkMsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBT0EsTUFBTTtzQkFBL0IsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBT0ssU0FBUztzQkFBckMsS0FBSzt1QkFBQyxvQkFBb0I7Z0JBT3ZCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBa0J0QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1JpcHBsZUFuaW1hdGlvbkNvbmZpZywgUmlwcGxlQ29uZmlnLCBSaXBwbGVSZWZ9IGZyb20gJy4vcmlwcGxlLXJlZic7XG5pbXBvcnQge1JpcHBsZVJlbmRlcmVyLCBSaXBwbGVUYXJnZXR9IGZyb20gJy4vcmlwcGxlLXJlbmRlcmVyJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG4vKiogQ29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIGBtYXRSaXBwbGVgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVHbG9iYWxPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgYmUgZGlzYWJsZWQuIFJpcHBsZXMgY2FuIGJlIHN0aWxsIGxhdW5jaGVkIG1hbnVhbGx5IGJ5IHVzaW5nXG4gICAqIHRoZSBgbGF1bmNoKClgIG1ldGhvZC4gVGhlcmVmb3JlIGZvY3VzIGluZGljYXRvcnMgd2lsbCBzdGlsbCBzaG93IHVwLlxuICAgKi9cbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhbmltYXRpb24gZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZXJlIGFyZSB0d28gcGhhc2VzIHdpdGhcbiAgICogZGlmZmVyZW50IGR1cmF0aW9ucyBmb3IgdGhlIHJpcHBsZXM6IGBlbnRlcmAgYW5kIGBsZWF2ZWAuIFRoZSBkdXJhdGlvbnMgd2lsbCBiZSBvdmVyd3JpdHRlblxuICAgKiBieSB0aGUgdmFsdWUgb2YgYG1hdFJpcHBsZUFuaW1hdGlvbmAgb3IgaWYgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgaW5jbHVkZWQuXG4gICAqL1xuICBhbmltYXRpb24/OiBSaXBwbGVBbmltYXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgc3RhcnQgZmFkaW5nIG91dCBpbW1lZGlhdGVseSBhZnRlciB0aGUgbW91c2Ugb3IgdG91Y2ggaXMgcmVsZWFzZWQuIEJ5XG4gICAqIGRlZmF1bHQsIHJpcHBsZXMgd2lsbCB3YWl0IGZvciB0aGUgZW50ZXIgYW5pbWF0aW9uIHRvIGNvbXBsZXRlIGFuZCBmb3IgbW91c2Ugb3IgdG91Y2ggcmVsZWFzZS5cbiAgICovXG4gIHRlcm1pbmF0ZU9uUG9pbnRlclVwPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPFJpcHBsZUdsb2JhbE9wdGlvbnM+KFxuICAnbWF0LXJpcHBsZS1nbG9iYWwtb3B0aW9ucycsXG4pO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXJpcHBsZV0sIFttYXRSaXBwbGVdJyxcbiAgZXhwb3J0QXM6ICdtYXRSaXBwbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1yaXBwbGUnLFxuICAgICdbY2xhc3MubWF0LXJpcHBsZS11bmJvdW5kZWRdJzogJ3VuYm91bmRlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBSaXBwbGVUYXJnZXQge1xuICAvKiogQ3VzdG9tIGNvbG9yIGZvciBhbGwgcmlwcGxlcy4gKi9cbiAgQElucHV0KCdtYXRSaXBwbGVDb2xvcicpIGNvbG9yOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZXMgc2hvdWxkIGJlIHZpc2libGUgb3V0c2lkZSB0aGUgY29tcG9uZW50J3MgYm91bmRzLiAqL1xuICBASW5wdXQoJ21hdFJpcHBsZVVuYm91bmRlZCcpIHVuYm91bmRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcmlwcGxlIGFsd2F5cyBvcmlnaW5hdGVzIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgaG9zdCBlbGVtZW50J3MgYm91bmRzLCByYXRoZXJcbiAgICogdGhhbiBvcmlnaW5hdGluZyBmcm9tIHRoZSBsb2NhdGlvbiBvZiB0aGUgY2xpY2sgZXZlbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUNlbnRlcmVkJykgY2VudGVyZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHNldCwgdGhlIHJhZGl1cyBpbiBwaXhlbHMgb2YgZm9yZWdyb3VuZCByaXBwbGVzIHdoZW4gZnVsbHkgZXhwYW5kZWQuIElmIHVuc2V0LCB0aGUgcmFkaXVzXG4gICAqIHdpbGwgYmUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgcmlwcGxlIHRvIHRoZSBmdXJ0aGVzdCBjb3JuZXIgb2YgdGhlIGhvc3QgZWxlbWVudCdzXG4gICAqIGJvdW5kaW5nIHJlY3RhbmdsZS5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlUmFkaXVzJykgcmFkaXVzOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGZvciB0aGUgcmlwcGxlIGFuaW1hdGlvbi4gQWxsb3dzIG1vZGlmeWluZyB0aGUgZW50ZXIgYW5kIGV4aXQgYW5pbWF0aW9uXG4gICAqIGR1cmF0aW9uIG9mIHRoZSByaXBwbGVzLiBUaGUgYW5pbWF0aW9uIGR1cmF0aW9ucyB3aWxsIGJlIG92ZXJ3cml0dGVuIGlmIHRoZVxuICAgKiBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGlzIGJlaW5nIHVzZWQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUFuaW1hdGlvbicpIGFuaW1hdGlvbjogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGNsaWNrIGV2ZW50cyB3aWxsIG5vdCB0cmlnZ2VyIHRoZSByaXBwbGUuIFJpcHBsZXMgY2FuIGJlIHN0aWxsIGxhdW5jaGVkIG1hbnVhbGx5XG4gICAqIGJ5IHVzaW5nIHRoZSBgbGF1bmNoKClgIG1ldGhvZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5mYWRlT3V0QWxsTm9uUGVyc2lzdGVudCgpO1xuICAgIH1cbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgdGhlIHJpcHBsZSB3aGVuIGNsaWNrIGV2ZW50cyBhcmUgcmVjZWl2ZWQuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdFJpcHBsZVRyaWdnZXInKVxuICBnZXQgdHJpZ2dlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJpZ2dlciB8fCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbiAgc2V0IHRyaWdnZXIodHJpZ2dlcjogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLl90cmlnZ2VyID0gdHJpZ2dlcjtcbiAgICB0aGlzLl9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKTtcbiAgfVxuICBwcml2YXRlIF90cmlnZ2VyOiBIVE1MRWxlbWVudDtcblxuICAvKiogUmVuZGVyZXIgZm9yIHRoZSByaXBwbGUgRE9NIG1hbmlwdWxhdGlvbnMuICovXG4gIHByaXZhdGUgX3JpcHBsZVJlbmRlcmVyOiBSaXBwbGVSZW5kZXJlcjtcblxuICAvKiogT3B0aW9ucyB0aGF0IGFyZSBzZXQgZ2xvYmFsbHkgZm9yIGFsbCByaXBwbGVzLiAqL1xuICBwcml2YXRlIF9nbG9iYWxPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZSBkaXJlY3RpdmUgaXMgaW5pdGlhbGl6ZWQgYW5kIHRoZSBpbnB1dCBiaW5kaW5ncyBhcmUgc2V0LiAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUykgZ2xvYmFsT3B0aW9ucz86IFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuX2dsb2JhbE9wdGlvbnMgPSBnbG9iYWxPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRoaXMsIG5nWm9uZSwgX2VsZW1lbnRSZWYsIHBsYXRmb3JtKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBzaG93aW5nIHJpcHBsZSBlbGVtZW50cy4gKi9cbiAgZmFkZU91dEFsbCgpIHtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlT3V0QWxsKCk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgc2hvd2luZyBub24tcGVyc2lzdGVudCByaXBwbGUgZWxlbWVudHMuICovXG4gIGZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgZGlyZWN0aXZlJ3MgaW5wdXQgdmFsdWVzLlxuICAgKiBAZG9jcy1wcml2YXRlIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgUmlwcGxlVGFyZ2V0XG4gICAqL1xuICBnZXQgcmlwcGxlQ29uZmlnKCk6IFJpcHBsZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbnRlcmVkOiB0aGlzLmNlbnRlcmVkLFxuICAgICAgcmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIC4uLnRoaXMuX2dsb2JhbE9wdGlvbnMuYW5pbWF0aW9uLFxuICAgICAgICAuLi4odGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJyA/IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9IDoge30pLFxuICAgICAgICAuLi50aGlzLmFuaW1hdGlvbixcbiAgICAgIH0sXG4gICAgICB0ZXJtaW5hdGVPblBvaW50ZXJVcDogdGhpcy5fZ2xvYmFsT3B0aW9ucy50ZXJtaW5hdGVPblBvaW50ZXJVcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyLWRvd24gYXJlIGRpc2FibGVkIG9yIG5vdC5cbiAgICogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFJpcHBsZVRhcmdldFxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICEhdGhpcy5fZ2xvYmFsT3B0aW9ucy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyBpZiByaXBwbGVzIGFyZSBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cFRyaWdnZXJFdmVudHNJZkVuYWJsZWQoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuX2lzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLnNldHVwVHJpZ2dlckV2ZW50cyh0aGlzLnRyaWdnZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMYXVuY2hlcyBhIG1hbnVhbCByaXBwbGUgdXNpbmcgdGhlIHNwZWNpZmllZCByaXBwbGUgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciB0aGUgbWFudWFsIHJpcHBsZS5cbiAgICovXG4gIGxhdW5jaChjb25maWc6IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZjtcblxuICAvKipcbiAgICogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIGF0IHRoZSBzcGVjaWZpZWQgY29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIGFsb25nIHRoZSBYIGF4aXMgYXQgd2hpY2ggdG8gZmFkZS1pbiB0aGUgcmlwcGxlLiBDb29yZGluYXRlXG4gICAqICAgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHkgQ29vcmRpbmF0ZSBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIGZhZGUtaW4gdGhlIHJpcHBsZS4gQ29vcmRpbmF0ZVxuICAgKiAgIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgcmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYW51YWwgcmlwcGxlLlxuICAgKi9cbiAgbGF1bmNoKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc/OiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWY7XG5cbiAgLyoqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVkIG9yIGp1c3QgYnkgdGhlIHJpcHBsZSBjb25maWcuICovXG4gIGxhdW5jaChjb25maWdPclg6IG51bWJlciB8IFJpcHBsZUNvbmZpZywgeTogbnVtYmVyID0gMCwgY29uZmlnPzogUmlwcGxlQ29uZmlnKTogUmlwcGxlUmVmIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZ09yWCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlSW5SaXBwbGUoY29uZmlnT3JYLCB5LCB7Li4udGhpcy5yaXBwbGVDb25maWcsIC4uLmNvbmZpZ30pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZUluUmlwcGxlKDAsIDAsIHsuLi50aGlzLnJpcHBsZUNvbmZpZywgLi4uY29uZmlnT3JYfSk7XG4gICAgfVxuICB9XG59XG4iXX0=