/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MAT_SLIDER, MAT_SLIDER_VISUAL_THUMB, } from './slider-interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/core";
/**
 * The visual slider thumb.
 *
 * Handles the slider thumb ripple states (hover, focus, and active),
 * and displaying the value tooltip on discrete sliders.
 * @docs-private
 */
export class MatSliderVisualThumb {
    constructor(_cdr, _ngZone, _elementRef, _slider) {
        this._cdr = _cdr;
        this._ngZone = _ngZone;
        this._slider = _slider;
        /** Whether the slider thumb is currently being hovered. */
        this._isHovered = false;
        /** Whether the slider thumb is currently being pressed. */
        this._isActive = false;
        /** Whether the value indicator tooltip is visible. */
        this._isValueIndicatorVisible = false;
        this._onPointerMove = (event) => {
            if (this._sliderInput._isFocused) {
                return;
            }
            const rect = this._hostElement.getBoundingClientRect();
            const isHovered = this._slider._isCursorOnSliderThumb(event, rect);
            this._isHovered = isHovered;
            if (isHovered) {
                this._showHoverRipple();
            }
            else {
                this._hideRipple(this._hoverRippleRef);
            }
        };
        this._onMouseLeave = () => {
            this._isHovered = false;
            this._hideRipple(this._hoverRippleRef);
        };
        this._onFocus = () => {
            // We don't want to show the hover ripple on top of the focus ripple.
            // Happen when the users cursor is over a thumb and then the user tabs to it.
            this._hideRipple(this._hoverRippleRef);
            this._showFocusRipple();
            this._hostElement.classList.add('mdc-slider__thumb--focused');
        };
        this._onBlur = () => {
            // Happens when the user tabs away while still dragging a thumb.
            if (!this._isActive) {
                this._hideRipple(this._focusRippleRef);
            }
            // Happens when the user tabs away from a thumb but their cursor is still over it.
            if (this._isHovered) {
                this._showHoverRipple();
            }
            this._hostElement.classList.remove('mdc-slider__thumb--focused');
        };
        this._onDragStart = (event) => {
            if (event.button !== 0) {
                return;
            }
            this._isActive = true;
            this._showActiveRipple();
        };
        this._onDragEnd = () => {
            this._isActive = false;
            this._hideRipple(this._activeRippleRef);
            // Happens when the user starts dragging a thumb, tabs away, and then stops dragging.
            if (!this._sliderInput._isFocused) {
                this._hideRipple(this._focusRippleRef);
            }
        };
        this._hostElement = _elementRef.nativeElement;
    }
    ngAfterViewInit() {
        this._ripple.radius = 24;
        this._sliderInput = this._slider._getInput(this.thumbPosition);
        this._sliderInputEl = this._sliderInput._hostElement;
        const input = this._sliderInputEl;
        // These listeners don't update any data bindings so we bind them outside
        // of the NgZone to prevent Angular from needlessly running change detection.
        this._ngZone.runOutsideAngular(() => {
            input.addEventListener('pointermove', this._onPointerMove);
            input.addEventListener('pointerdown', this._onDragStart);
            input.addEventListener('pointerup', this._onDragEnd);
            input.addEventListener('pointerleave', this._onMouseLeave);
            input.addEventListener('focus', this._onFocus);
            input.addEventListener('blur', this._onBlur);
        });
    }
    ngOnDestroy() {
        const input = this._sliderInputEl;
        input.removeEventListener('pointermove', this._onPointerMove);
        input.removeEventListener('pointerdown', this._onDragStart);
        input.removeEventListener('pointerup', this._onDragEnd);
        input.removeEventListener('pointerleave', this._onMouseLeave);
        input.removeEventListener('focus', this._onFocus);
        input.removeEventListener('blur', this._onBlur);
    }
    /** Handles displaying the hover ripple. */
    _showHoverRipple() {
        if (!this._isShowingRipple(this._hoverRippleRef)) {
            this._hoverRippleRef = this._showRipple({ enterDuration: 0, exitDuration: 0 });
            this._hoverRippleRef?.element.classList.add('mat-mdc-slider-hover-ripple');
        }
    }
    /** Handles displaying the focus ripple. */
    _showFocusRipple() {
        // Show the focus ripple event if noop animations are enabled.
        if (!this._isShowingRipple(this._focusRippleRef)) {
            this._focusRippleRef = this._showRipple({ enterDuration: 0, exitDuration: 0 }, true);
            this._focusRippleRef?.element.classList.add('mat-mdc-slider-focus-ripple');
        }
    }
    /** Handles displaying the active ripple. */
    _showActiveRipple() {
        if (!this._isShowingRipple(this._activeRippleRef)) {
            this._activeRippleRef = this._showRipple({ enterDuration: 225, exitDuration: 400 });
            this._activeRippleRef?.element.classList.add('mat-mdc-slider-active-ripple');
        }
    }
    /** Whether the given rippleRef is currently fading in or visible. */
    _isShowingRipple(rippleRef) {
        return rippleRef?.state === 0 /* RippleState.FADING_IN */ || rippleRef?.state === 1 /* RippleState.VISIBLE */;
    }
    /** Manually launches the slider thumb ripple using the specified ripple animation config. */
    _showRipple(animation, ignoreGlobalRippleConfig) {
        if (this._slider.disabled) {
            return;
        }
        this._showValueIndicator();
        if (this._slider._isRange) {
            const sibling = this._slider._getThumb(this.thumbPosition === 1 /* _MatThumb.START */ ? 2 /* _MatThumb.END */ : 1 /* _MatThumb.START */);
            sibling._showValueIndicator();
        }
        if (this._slider._globalRippleOptions?.disabled && !ignoreGlobalRippleConfig) {
            return;
        }
        return this._ripple.launch({
            animation: this._slider._noopAnimations ? { enterDuration: 0, exitDuration: 0 } : animation,
            centered: true,
            persistent: true,
        });
    }
    /**
     * Fades out the given ripple.
     * Also hides the value indicator if no ripple is showing.
     */
    _hideRipple(rippleRef) {
        rippleRef?.fadeOut();
        if (this._isShowingAnyRipple()) {
            return;
        }
        if (!this._slider._isRange) {
            this._hideValueIndicator();
        }
        const sibling = this._getSibling();
        if (!sibling._isShowingAnyRipple()) {
            this._hideValueIndicator();
            sibling._hideValueIndicator();
        }
    }
    /** Shows the value indicator ui. */
    _showValueIndicator() {
        this._hostElement.classList.add('mdc-slider__thumb--with-indicator');
    }
    /** Hides the value indicator ui. */
    _hideValueIndicator() {
        this._hostElement.classList.remove('mdc-slider__thumb--with-indicator');
    }
    _getSibling() {
        return this._slider._getThumb(this.thumbPosition === 1 /* _MatThumb.START */ ? 2 /* _MatThumb.END */ : 1 /* _MatThumb.START */);
    }
    /** Gets the value indicator container's native HTML element. */
    _getValueIndicatorContainer() {
        return this._valueIndicatorContainer?.nativeElement;
    }
    /** Gets the native HTML element of the slider thumb knob. */
    _getKnob() {
        return this._knob.nativeElement;
    }
    _isShowingAnyRipple() {
        return (this._isShowingRipple(this._hoverRippleRef) ||
            this._isShowingRipple(this._focusRippleRef) ||
            this._isShowingRipple(this._activeRippleRef));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSliderVisualThumb, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i0.ElementRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.0.4", type: MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: { discrete: "discrete", thumbPosition: "thumbPosition", valueIndicatorText: "valueIndicatorText" }, host: { classAttribute: "mdc-slider__thumb mat-mdc-slider-visual-thumb" }, providers: [{ provide: MAT_SLIDER_VISUAL_THUMB, useExisting: MatSliderVisualThumb }], viewQueries: [{ propertyName: "_ripple", first: true, predicate: MatRipple, descendants: true }, { propertyName: "_knob", first: true, predicate: ["knob"], descendants: true }, { propertyName: "_valueIndicatorContainer", first: true, predicate: ["valueIndicatorContainer"], descendants: true }], ngImport: i0, template: "@if (discrete) {\n  <div class=\"mdc-slider__value-indicator-container\" #valueIndicatorContainer>\n    <div class=\"mdc-slider__value-indicator\">\n      <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n    </div>\n  </div>\n}\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div matRipple class=\"mat-mdc-focus-indicator\" [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"], dependencies: [{ kind: "directive", type: i1.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSliderVisualThumb, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider-visual-thumb', host: {
                        'class': 'mdc-slider__thumb mat-mdc-slider-visual-thumb',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: MAT_SLIDER_VISUAL_THUMB, useExisting: MatSliderVisualThumb }], template: "@if (discrete) {\n  <div class=\"mdc-slider__value-indicator-container\" #valueIndicatorContainer>\n    <div class=\"mdc-slider__value-indicator\">\n      <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n    </div>\n  </div>\n}\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div matRipple class=\"mat-mdc-focus-indicator\" [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }], propDecorators: { discrete: [{
                type: Input
            }], thumbPosition: [{
                type: Input
            }], valueIndicatorText: [{
                type: Input
            }], _ripple: [{
                type: ViewChild,
                args: [MatRipple]
            }], _knob: [{
                type: ViewChild,
                args: ['knob']
            }], _valueIndicatorContainer: [{
                type: ViewChild,
                args: ['valueIndicatorContainer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLXRodW1iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItdGh1bWIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci10aHVtYi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFnRCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hHLE9BQU8sRUFLTCxVQUFVLEVBQ1YsdUJBQXVCLEdBQ3hCLE1BQU0sb0JBQW9CLENBQUM7OztBQUU1Qjs7Ozs7O0dBTUc7QUFZSCxNQUFNLE9BQU8sb0JBQW9CO0lBK0MvQixZQUNXLElBQXVCLEVBQ2YsT0FBZSxFQUNoQyxXQUFvQyxFQUNSLE9BQW1CO1FBSHRDLFNBQUksR0FBSixJQUFJLENBQW1CO1FBQ2YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUVKLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFoQmpELDJEQUEyRDtRQUNuRCxlQUFVLEdBQVksS0FBSyxDQUFDO1FBRXBDLDJEQUEyRDtRQUMzRCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLHNEQUFzRDtRQUN0RCw2QkFBd0IsR0FBWSxLQUFLLENBQUM7UUEwQ2xDLG1CQUFjLEdBQUcsQ0FBQyxLQUFtQixFQUFRLEVBQUU7WUFDckQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRTtnQkFDaEMsT0FBTzthQUNSO1lBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3ZELE1BQU0s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QkFDaEMsaUJBQWlCLENBQUMsSUFBSSxhQUMxQixDQUFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFdBQVcsc0JBQXNCLEVBQUMsQ0FBQzs7MEJBcUQvRSxNQUFNOzJCQUFDLFVBQVU7eUNBakRYLFFBQVE7c0JBQWhCLEtBQUs7Z0JBR0csYUFBYTtzQkFBckIsS0FBSztnQkFHRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBR3lCLE9BQU87c0JBQXJDLFNBQVM7dUJBQUMsU0FBUztnQkFHRCxLQUFLO3NCQUF2QixTQUFTO3VCQUFDLE1BQU07Z0JBSWpCLHdCQUF3QjtzQkFEdkIsU0FBUzt1QkFBQyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0UmlwcGxlLCBSaXBwbGVBbmltYXRpb25Db25maWcsIFJpcHBsZVJlZiwgUmlwcGxlU3RhdGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtcbiAgX01hdFRodW1iLFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyVGh1bWIsXG4gIF9NYXRTbGlkZXJWaXN1YWxUaHVtYixcbiAgTUFUX1NMSURFUixcbiAgTUFUX1NMSURFUl9WSVNVQUxfVEhVTUIsXG59IGZyb20gJy4vc2xpZGVyLWludGVyZmFjZSc7XG5cbi8qKlxuICogVGhlIHZpc3VhbCBzbGlkZXIgdGh1bWIuXG4gKlxuICogSGFuZGxlcyB0aGUgc2xpZGVyIHRodW1iIHJpcHBsZSBzdGF0ZXMgKGhvdmVyLCBmb2N1cywgYW5kIGFjdGl2ZSksXG4gKiBhbmQgZGlzcGxheWluZyB0aGUgdmFsdWUgdG9vbHRpcCBvbiBkaXNjcmV0ZSBzbGlkZXJzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGVyLXZpc3VhbC10aHVtYicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zbGlkZXItdGh1bWIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXItdGh1bWIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLXNsaWRlcl9fdGh1bWIgbWF0LW1kYy1zbGlkZXItdmlzdWFsLXRodW1iJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfU0xJREVSX1ZJU1VBTF9USFVNQiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlclZpc3VhbFRodW1ifV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlclZpc3VhbFRodW1iIGltcGxlbWVudHMgX01hdFNsaWRlclZpc3VhbFRodW1iLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGRpc3BsYXlzIGEgbnVtZXJpYyB2YWx1ZSBsYWJlbCB1cG9uIHByZXNzaW5nIHRoZSB0aHVtYi4gKi9cbiAgQElucHV0KCkgZGlzY3JldGU6IGJvb2xlYW47XG5cbiAgLyoqIEluZGljYXRlcyB3aGljaCBzbGlkZXIgdGh1bWIgdGhpcyBpbnB1dCBjb3JyZXNwb25kcyB0by4gKi9cbiAgQElucHV0KCkgdGh1bWJQb3NpdGlvbjogX01hdFRodW1iO1xuXG4gIC8qKiBUaGUgZGlzcGxheSB2YWx1ZSBvZiB0aGUgc2xpZGVyIHRodW1iLiAqL1xuICBASW5wdXQoKSB2YWx1ZUluZGljYXRvclRleHQ6IHN0cmluZztcblxuICAvKiogVGhlIE1hdFJpcHBsZSBmb3IgdGhpcyBzbGlkZXIgdGh1bWIuICovXG4gIEBWaWV3Q2hpbGQoTWF0UmlwcGxlKSByZWFkb25seSBfcmlwcGxlOiBNYXRSaXBwbGU7XG5cbiAgLyoqIFRoZSBzbGlkZXIgdGh1bWIga25vYi4gKi9cbiAgQFZpZXdDaGlsZCgna25vYicpIF9rbm9iOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYiB2YWx1ZSBpbmRpY2F0b3IgY29udGFpbmVyLiAqL1xuICBAVmlld0NoaWxkKCd2YWx1ZUluZGljYXRvckNvbnRhaW5lcicpXG4gIF92YWx1ZUluZGljYXRvckNvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFRoZSBzbGlkZXIgaW5wdXQgY29ycmVzcG9uZGluZyB0byB0aGlzIHNsaWRlciB0aHVtYi4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVySW5wdXQ6IF9NYXRTbGlkZXJUaHVtYjtcblxuICAvKiogVGhlIG5hdGl2ZSBodG1sIGVsZW1lbnQgb2YgdGhlIHNsaWRlciBpbnB1dCBjb3JyZXNwb25kaW5nIHRvIHRoaXMgdGh1bWIuICovXG4gIHByaXZhdGUgX3NsaWRlcklucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgLyoqIFRoZSBSaXBwbGVSZWYgZm9yIHRoZSBzbGlkZXIgdGh1bWJzIGhvdmVyIHN0YXRlLiAqL1xuICBwcml2YXRlIF9ob3ZlclJpcHBsZVJlZjogUmlwcGxlUmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBUaGUgUmlwcGxlUmVmIGZvciB0aGUgc2xpZGVyIHRodW1icyBmb2N1cyBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNSaXBwbGVSZWY6IFJpcHBsZVJlZiB8IHVuZGVmaW5lZDtcblxuICAvKiogVGhlIFJpcHBsZVJlZiBmb3IgdGhlIHNsaWRlciB0aHVtYnMgYWN0aXZlIHN0YXRlLiAqL1xuICBwcml2YXRlIF9hY3RpdmVSaXBwbGVSZWY6IFJpcHBsZVJlZiB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIHRodW1iIGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkLiAqL1xuICBwcml2YXRlIF9pc0hvdmVyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIHRodW1iIGlzIGN1cnJlbnRseSBiZWluZyBwcmVzc2VkLiAqL1xuICBfaXNBY3RpdmUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgdmFsdWUgaW5kaWNhdG9yIHRvb2x0aXAgaXMgdmlzaWJsZS4gKi9cbiAgX2lzVmFsdWVJbmRpY2F0b3JWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBob3N0IG5hdGl2ZSBIVE1MIGlucHV0IGVsZW1lbnQuICovXG4gIF9ob3N0RWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX1NMSURFUikgcHJpdmF0ZSBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICApIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fcmlwcGxlLnJhZGl1cyA9IDI0O1xuICAgIHRoaXMuX3NsaWRlcklucHV0ID0gdGhpcy5fc2xpZGVyLl9nZXRJbnB1dCh0aGlzLnRodW1iUG9zaXRpb24pITtcbiAgICB0aGlzLl9zbGlkZXJJbnB1dEVsID0gdGhpcy5fc2xpZGVySW5wdXQuX2hvc3RFbGVtZW50O1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fc2xpZGVySW5wdXRFbDtcblxuICAgIC8vIFRoZXNlIGxpc3RlbmVycyBkb24ndCB1cGRhdGUgYW55IGRhdGEgYmluZGluZ3Mgc28gd2UgYmluZCB0aGVtIG91dHNpZGVcbiAgICAvLyBvZiB0aGUgTmdab25lIHRvIHByZXZlbnQgQW5ndWxhciBmcm9tIG5lZWRsZXNzbHkgcnVubmluZyBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vbkRyYWdTdGFydCk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vbkRyYWdFbmQpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgdGhpcy5fb25Nb3VzZUxlYXZlKTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fc2xpZGVySW5wdXRFbDtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25EcmFnU3RhcnQpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJhZ0VuZCk7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgdGhpcy5fb25Nb3VzZUxlYXZlKTtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25Qb2ludGVyTW92ZSA9IChldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMuX3NsaWRlcklucHV0Ll9pc0ZvY3VzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWN0ID0gdGhpcy5faG9zdEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgaXNIb3ZlcmVkID0gdGhpcy5fc2xpZGVyLl9pc0N1cnNvck9uU2xpZGVyVGh1bWIoZXZlbnQsIHJlY3QpO1xuICAgIHRoaXMuX2lzSG92ZXJlZCA9IGlzSG92ZXJlZDtcblxuICAgIGlmIChpc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuX3Nob3dIb3ZlclJpcHBsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25Nb3VzZUxlYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2lzSG92ZXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5faG92ZXJSaXBwbGVSZWYpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uRm9jdXMgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzaG93IHRoZSBob3ZlciByaXBwbGUgb24gdG9wIG9mIHRoZSBmb2N1cyByaXBwbGUuXG4gICAgLy8gSGFwcGVuIHdoZW4gdGhlIHVzZXJzIGN1cnNvciBpcyBvdmVyIGEgdGh1bWIgYW5kIHRoZW4gdGhlIHVzZXIgdGFicyB0byBpdC5cbiAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKTtcbiAgICB0aGlzLl9zaG93Rm9jdXNSaXBwbGUoKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtc2xpZGVyX190aHVtYi0tZm9jdXNlZCcpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uQmx1ciA9ICgpOiB2b2lkID0+IHtcbiAgICAvLyBIYXBwZW5zIHdoZW4gdGhlIHVzZXIgdGFicyBhd2F5IHdoaWxlIHN0aWxsIGRyYWdnaW5nIGEgdGh1bWIuXG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9mb2N1c1JpcHBsZVJlZik7XG4gICAgfVxuICAgIC8vIEhhcHBlbnMgd2hlbiB0aGUgdXNlciB0YWJzIGF3YXkgZnJvbSBhIHRodW1iIGJ1dCB0aGVpciBjdXJzb3IgaXMgc3RpbGwgb3ZlciBpdC5cbiAgICBpZiAodGhpcy5faXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLl9zaG93SG92ZXJSaXBwbGUoKTtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLWZvY3VzZWQnKTtcbiAgfTtcblxuICBwcml2YXRlIF9vbkRyYWdTdGFydCA9IChldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5fc2hvd0FjdGl2ZVJpcHBsZSgpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uRHJhZ0VuZCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5fYWN0aXZlUmlwcGxlUmVmKTtcbiAgICAvLyBIYXBwZW5zIHdoZW4gdGhlIHVzZXIgc3RhcnRzIGRyYWdnaW5nIGEgdGh1bWIsIHRhYnMgYXdheSwgYW5kIHRoZW4gc3RvcHMgZHJhZ2dpbmcuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXJJbnB1dC5faXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqIEhhbmRsZXMgZGlzcGxheWluZyB0aGUgaG92ZXIgcmlwcGxlLiAqL1xuICBwcml2YXRlIF9zaG93SG92ZXJSaXBwbGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5faG92ZXJSaXBwbGVSZWYpKSB7XG4gICAgICB0aGlzLl9ob3ZlclJpcHBsZVJlZiA9IHRoaXMuX3Nob3dSaXBwbGUoe2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0pO1xuICAgICAgdGhpcy5faG92ZXJSaXBwbGVSZWY/LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItaG92ZXItcmlwcGxlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgZGlzcGxheWluZyB0aGUgZm9jdXMgcmlwcGxlLiAqL1xuICBwcml2YXRlIF9zaG93Rm9jdXNSaXBwbGUoKTogdm9pZCB7XG4gICAgLy8gU2hvdyB0aGUgZm9jdXMgcmlwcGxlIGV2ZW50IGlmIG5vb3AgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZC5cbiAgICBpZiAoIXRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9mb2N1c1JpcHBsZVJlZikpIHtcbiAgICAgIHRoaXMuX2ZvY3VzUmlwcGxlUmVmID0gdGhpcy5fc2hvd1JpcHBsZSh7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfSwgdHJ1ZSk7XG4gICAgICB0aGlzLl9mb2N1c1JpcHBsZVJlZj8uZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLXNsaWRlci1mb2N1cy1yaXBwbGUnKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBkaXNwbGF5aW5nIHRoZSBhY3RpdmUgcmlwcGxlLiAqL1xuICBwcml2YXRlIF9zaG93QWN0aXZlUmlwcGxlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2FjdGl2ZVJpcHBsZVJlZikpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZVJpcHBsZVJlZiA9IHRoaXMuX3Nob3dSaXBwbGUoe2VudGVyRHVyYXRpb246IDIyNSwgZXhpdER1cmF0aW9uOiA0MDB9KTtcbiAgICAgIHRoaXMuX2FjdGl2ZVJpcHBsZVJlZj8uZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLXNsaWRlci1hY3RpdmUtcmlwcGxlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHJpcHBsZVJlZiBpcyBjdXJyZW50bHkgZmFkaW5nIGluIG9yIHZpc2libGUuICovXG4gIHByaXZhdGUgX2lzU2hvd2luZ1JpcHBsZShyaXBwbGVSZWY/OiBSaXBwbGVSZWYpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcmlwcGxlUmVmPy5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuRkFESU5HX0lOIHx8IHJpcHBsZVJlZj8uc3RhdGUgPT09IFJpcHBsZVN0YXRlLlZJU0lCTEU7XG4gIH1cblxuICAvKiogTWFudWFsbHkgbGF1bmNoZXMgdGhlIHNsaWRlciB0aHVtYiByaXBwbGUgdXNpbmcgdGhlIHNwZWNpZmllZCByaXBwbGUgYW5pbWF0aW9uIGNvbmZpZy4gKi9cbiAgcHJpdmF0ZSBfc2hvd1JpcHBsZShcbiAgICBhbmltYXRpb246IFJpcHBsZUFuaW1hdGlvbkNvbmZpZyxcbiAgICBpZ25vcmVHbG9iYWxSaXBwbGVDb25maWc/OiBib29sZWFuLFxuICApOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLl9zbGlkZXIuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc2hvd1ZhbHVlSW5kaWNhdG9yKCk7XG4gICAgaWYgKHRoaXMuX3NsaWRlci5faXNSYW5nZSkge1xuICAgICAgY29uc3Qgc2libGluZyA9IHRoaXMuX3NsaWRlci5fZ2V0VGh1bWIoXG4gICAgICAgIHRoaXMudGh1bWJQb3NpdGlvbiA9PT0gX01hdFRodW1iLlNUQVJUID8gX01hdFRodW1iLkVORCA6IF9NYXRUaHVtYi5TVEFSVCxcbiAgICAgICk7XG4gICAgICBzaWJsaW5nLl9zaG93VmFsdWVJbmRpY2F0b3IoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NsaWRlci5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8uZGlzYWJsZWQgJiYgIWlnbm9yZUdsb2JhbFJpcHBsZUNvbmZpZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmlwcGxlLmxhdW5jaCh7XG4gICAgICBhbmltYXRpb246IHRoaXMuX3NsaWRlci5fbm9vcEFuaW1hdGlvbnMgPyB7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfSA6IGFuaW1hdGlvbixcbiAgICAgIGNlbnRlcmVkOiB0cnVlLFxuICAgICAgcGVyc2lzdGVudDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWRlcyBvdXQgdGhlIGdpdmVuIHJpcHBsZS5cbiAgICogQWxzbyBoaWRlcyB0aGUgdmFsdWUgaW5kaWNhdG9yIGlmIG5vIHJpcHBsZSBpcyBzaG93aW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlkZVJpcHBsZShyaXBwbGVSZWY/OiBSaXBwbGVSZWYpOiB2b2lkIHtcbiAgICByaXBwbGVSZWY/LmZhZGVPdXQoKTtcblxuICAgIGlmICh0aGlzLl9pc1Nob3dpbmdBbnlSaXBwbGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fc2xpZGVyLl9pc1JhbmdlKSB7XG4gICAgICB0aGlzLl9oaWRlVmFsdWVJbmRpY2F0b3IoKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5fZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZy5faXNTaG93aW5nQW55UmlwcGxlKCkpIHtcbiAgICAgIHRoaXMuX2hpZGVWYWx1ZUluZGljYXRvcigpO1xuICAgICAgc2libGluZy5faGlkZVZhbHVlSW5kaWNhdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNob3dzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdWkuICovXG4gIF9zaG93VmFsdWVJbmRpY2F0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWRjLXNsaWRlcl9fdGh1bWItLXdpdGgtaW5kaWNhdG9yJyk7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIHZhbHVlIGluZGljYXRvciB1aS4gKi9cbiAgX2hpZGVWYWx1ZUluZGljYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtc2xpZGVyX190aHVtYi0td2l0aC1pbmRpY2F0b3InKTtcbiAgfVxuXG4gIF9nZXRTaWJsaW5nKCk6IF9NYXRTbGlkZXJWaXN1YWxUaHVtYiB7XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlci5fZ2V0VGh1bWIoXG4gICAgICB0aGlzLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVCA/IF9NYXRUaHVtYi5FTkQgOiBfTWF0VGh1bWIuU1RBUlQsXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgY29udGFpbmVyJ3MgbmF0aXZlIEhUTUwgZWxlbWVudC4gKi9cbiAgX2dldFZhbHVlSW5kaWNhdG9yQ29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVJbmRpY2F0b3JDb250YWluZXI/Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmF0aXZlIEhUTUwgZWxlbWVudCBvZiB0aGUgc2xpZGVyIHRodW1iIGtub2IuICovXG4gIF9nZXRLbm9iKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fa25vYi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgX2lzU2hvd2luZ0FueVJpcHBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKSB8fFxuICAgICAgdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKSB8fFxuICAgICAgdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2FjdGl2ZVJpcHBsZVJlZilcbiAgICApO1xuICB9XG59XG4iLCJAaWYgKGRpc2NyZXRlKSB7XG4gIDxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX192YWx1ZS1pbmRpY2F0b3ItY29udGFpbmVyXCIgI3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyPlxuICAgIDxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX192YWx1ZS1pbmRpY2F0b3JcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWRjLXNsaWRlcl9fdmFsdWUtaW5kaWNhdG9yLXRleHRcIj57e3ZhbHVlSW5kaWNhdG9yVGV4dH19PC9zcGFuPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbn1cbjxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX190aHVtYi1rbm9iXCIgI2tub2I+PC9kaXY+XG48ZGl2IG1hdFJpcHBsZSBjbGFzcz1cIm1hdC1tZGMtZm9jdXMtaW5kaWNhdG9yXCIgW21hdFJpcHBsZURpc2FibGVkXT1cInRydWVcIj48L2Rpdj5cbiJdfQ==