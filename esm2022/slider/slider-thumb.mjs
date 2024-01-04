/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, ViewChild, ViewEncapsulation, inject, } from '@angular/core';
import { MatRipple, RippleState } from '@angular/material/core';
import { _MatThumb, MAT_SLIDER, MAT_SLIDER_VISUAL_THUMB, } from './slider-interface';
import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
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
        this._platform = inject(Platform);
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
            // On Safari we need to immediately re-show the hover ripple because
            // sliders do not retain focus from pointer events on that platform.
            if (this._platform.SAFARI) {
                this._showHoverRipple();
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
        return rippleRef?.state === RippleState.FADING_IN || rippleRef?.state === RippleState.VISIBLE;
    }
    /** Manually launches the slider thumb ripple using the specified ripple animation config. */
    _showRipple(animation, ignoreGlobalRippleConfig) {
        if (this._slider.disabled) {
            return;
        }
        this._showValueIndicator();
        if (this._slider._isRange) {
            const sibling = this._slider._getThumb(this.thumbPosition === _MatThumb.START ? _MatThumb.END : _MatThumb.START);
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
        return this._slider._getThumb(this.thumbPosition === _MatThumb.START ? _MatThumb.END : _MatThumb.START);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSliderVisualThumb, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i0.ElementRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.1.0-next.5", type: MatSliderVisualThumb, isStandalone: true, selector: "mat-slider-visual-thumb", inputs: { discrete: "discrete", thumbPosition: "thumbPosition", valueIndicatorText: "valueIndicatorText" }, host: { classAttribute: "mdc-slider__thumb mat-mdc-slider-visual-thumb" }, providers: [{ provide: MAT_SLIDER_VISUAL_THUMB, useExisting: MatSliderVisualThumb }], viewQueries: [{ propertyName: "_ripple", first: true, predicate: MatRipple, descendants: true }, { propertyName: "_knob", first: true, predicate: ["knob"], descendants: true }, { propertyName: "_valueIndicatorContainer", first: true, predicate: ["valueIndicatorContainer"], descendants: true }], ngImport: i0, template: "@if (discrete) {\n  <div class=\"mdc-slider__value-indicator-container\" #valueIndicatorContainer>\n    <div class=\"mdc-slider__value-indicator\">\n      <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n    </div>\n  </div>\n}\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div matRipple class=\"mat-mdc-focus-indicator\" [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"], dependencies: [{ kind: "directive", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSliderVisualThumb, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider-visual-thumb', host: {
                        'class': 'mdc-slider__thumb mat-mdc-slider-visual-thumb',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: MAT_SLIDER_VISUAL_THUMB, useExisting: MatSliderVisualThumb }], standalone: true, imports: [MatRipple], template: "@if (discrete) {\n  <div class=\"mdc-slider__value-indicator-container\" #valueIndicatorContainer>\n    <div class=\"mdc-slider__value-indicator\">\n      <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n    </div>\n  </div>\n}\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div matRipple class=\"mat-mdc-focus-indicator\" [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLXRodW1iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItdGh1bWIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci10aHVtYi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixFQUNqQixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBb0MsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDaEcsT0FBTyxFQUNMLFNBQVMsRUFJVCxVQUFVLEVBQ1YsdUJBQXVCLEdBQ3hCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQUUvQzs7Ozs7O0dBTUc7QUFjSCxNQUFNLE9BQU8sb0JBQW9CO0lBaUQvQixZQUNXLElBQXVCLEVBQ2YsT0FBZSxFQUNoQyxXQUFvQyxFQUNSLE9BQW1CO1FBSHRDLFNBQUksR0FBSixJQUFJLENBQW1CO1FBQ2YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUVKLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFsQmpELDJEQUEyRDtRQUNuRCxlQUFVLEdBQVksS0FBSyxDQUFDO1FBRXBDLDJEQUEyRDtRQUMzRCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLHNEQUFzRDtRQUN0RCw2QkFBd0IsR0FBWSxLQUFLLENBQUM7UUFLbEMsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQXVDN0IsbUJBQWMsR0FBRyxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUNyRCxJQUFJLElB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IFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0UmlwcGxlLCBSaXBwbGVBbmltYXRpb25Db25maWcsIFJpcHBsZVJlZiwgUmlwcGxlU3RhdGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtcbiAgX01hdFRodW1iLFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyVGh1bWIsXG4gIF9NYXRTbGlkZXJWaXN1YWxUaHVtYixcbiAgTUFUX1NMSURFUixcbiAgTUFUX1NMSURFUl9WSVNVQUxfVEhVTUIsXG59IGZyb20gJy4vc2xpZGVyLWludGVyZmFjZSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vKipcbiAqIFRoZSB2aXN1YWwgc2xpZGVyIHRodW1iLlxuICpcbiAqIEhhbmRsZXMgdGhlIHNsaWRlciB0aHVtYiByaXBwbGUgc3RhdGVzIChob3ZlciwgZm9jdXMsIGFuZCBhY3RpdmUpLFxuICogYW5kIGRpc3BsYXlpbmcgdGhlIHZhbHVlIHRvb2x0aXAgb24gZGlzY3JldGUgc2xpZGVycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlci12aXN1YWwtdGh1bWInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2xpZGVyLXRodW1iLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLXRodW1iLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX3RodW1iIG1hdC1tZGMtc2xpZGVyLXZpc3VhbC10aHVtYicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NMSURFUl9WSVNVQUxfVEhVTUIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJWaXN1YWxUaHVtYn1dLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0UmlwcGxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyVmlzdWFsVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgZGlzcGxheXMgYSBudW1lcmljIHZhbHVlIGxhYmVsIHVwb24gcHJlc3NpbmcgdGhlIHRodW1iLiAqL1xuICBASW5wdXQoKSBkaXNjcmV0ZTogYm9vbGVhbjtcblxuICAvKiogSW5kaWNhdGVzIHdoaWNoIHNsaWRlciB0aHVtYiB0aGlzIGlucHV0IGNvcnJlc3BvbmRzIHRvLiAqL1xuICBASW5wdXQoKSB0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWI7XG5cbiAgLyoqIFRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBzbGlkZXIgdGh1bWIuICovXG4gIEBJbnB1dCgpIHZhbHVlSW5kaWNhdG9yVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgTWF0UmlwcGxlIGZvciB0aGlzIHNsaWRlciB0aHVtYi4gKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJlYWRvbmx5IF9yaXBwbGU6IE1hdFJpcHBsZTtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYiBrbm9iLiAqL1xuICBAVmlld0NoaWxkKCdrbm9iJykgX2tub2I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgc2xpZGVyIHRodW1iIHZhbHVlIGluZGljYXRvciBjb250YWluZXIuICovXG4gIEBWaWV3Q2hpbGQoJ3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyJylcbiAgX3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciBpbnB1dCBjb3JyZXNwb25kaW5nIHRvIHRoaXMgc2xpZGVyIHRodW1iLiAqL1xuICBwcml2YXRlIF9zbGlkZXJJbnB1dDogX01hdFNsaWRlclRodW1iO1xuXG4gIC8qKiBUaGUgbmF0aXZlIGh0bWwgZWxlbWVudCBvZiB0aGUgc2xpZGVyIGlucHV0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyB0aHVtYi4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVySW5wdXRFbDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIFJpcHBsZVJlZiBmb3IgdGhlIHNsaWRlciB0aHVtYnMgaG92ZXIgc3RhdGUuICovXG4gIHByaXZhdGUgX2hvdmVyUmlwcGxlUmVmOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFRoZSBSaXBwbGVSZWYgZm9yIHRoZSBzbGlkZXIgdGh1bWJzIGZvY3VzIHN0YXRlLiAqL1xuICBwcml2YXRlIF9mb2N1c1JpcHBsZVJlZjogUmlwcGxlUmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBUaGUgUmlwcGxlUmVmIGZvciB0aGUgc2xpZGVyIHRodW1icyBhY3RpdmUgc3RhdGUuICovXG4gIHByaXZhdGUgX2FjdGl2ZVJpcHBsZVJlZjogUmlwcGxlUmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgdGh1bWIgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQuICovXG4gIHByaXZhdGUgX2lzSG92ZXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgdGh1bWIgaXMgY3VycmVudGx5IGJlaW5nIHByZXNzZWQuICovXG4gIF9pc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdG9vbHRpcCBpcyB2aXNpYmxlLiAqL1xuICBfaXNWYWx1ZUluZGljYXRvclZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGhvc3QgbmF0aXZlIEhUTUwgaW5wdXQgZWxlbWVudC4gKi9cbiAgX2hvc3RFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX1NMSURFUikgcHJpdmF0ZSBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICApIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fcmlwcGxlLnJhZGl1cyA9IDI0O1xuICAgIHRoaXMuX3NsaWRlcklucHV0ID0gdGhpcy5fc2xpZGVyLl9nZXRJbnB1dCh0aGlzLnRodW1iUG9zaXRpb24pITtcbiAgICB0aGlzLl9zbGlkZXJJbnB1dEVsID0gdGhpcy5fc2xpZGVySW5wdXQuX2hvc3RFbGVtZW50O1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fc2xpZGVySW5wdXRFbDtcblxuICAgIC8vIFRoZXNlIGxpc3RlbmVycyBkb24ndCB1cGRhdGUgYW55IGRhdGEgYmluZGluZ3Mgc28gd2UgYmluZCB0aGVtIG91dHNpZGVcbiAgICAvLyBvZiB0aGUgTmdab25lIHRvIHByZXZlbnQgQW5ndWxhciBmcm9tIG5lZWRsZXNzbHkgcnVubmluZyBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vbkRyYWdTdGFydCk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vbkRyYWdFbmQpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgdGhpcy5fb25Nb3VzZUxlYXZlKTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fc2xpZGVySW5wdXRFbDtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25EcmFnU3RhcnQpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJhZ0VuZCk7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgdGhpcy5fb25Nb3VzZUxlYXZlKTtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25Qb2ludGVyTW92ZSA9IChldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMuX3NsaWRlcklucHV0Ll9pc0ZvY3VzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWN0ID0gdGhpcy5faG9zdEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgaXNIb3ZlcmVkID0gdGhpcy5fc2xpZGVyLl9pc0N1cnNvck9uU2xpZGVyVGh1bWIoZXZlbnQsIHJlY3QpO1xuICAgIHRoaXMuX2lzSG92ZXJlZCA9IGlzSG92ZXJlZDtcblxuICAgIGlmIChpc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuX3Nob3dIb3ZlclJpcHBsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25Nb3VzZUxlYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2lzSG92ZXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5faG92ZXJSaXBwbGVSZWYpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uRm9jdXMgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzaG93IHRoZSBob3ZlciByaXBwbGUgb24gdG9wIG9mIHRoZSBmb2N1cyByaXBwbGUuXG4gICAgLy8gSGFwcGVuIHdoZW4gdGhlIHVzZXJzIGN1cnNvciBpcyBvdmVyIGEgdGh1bWIgYW5kIHRoZW4gdGhlIHVzZXIgdGFicyB0byBpdC5cbiAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKTtcbiAgICB0aGlzLl9zaG93Rm9jdXNSaXBwbGUoKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtc2xpZGVyX190aHVtYi0tZm9jdXNlZCcpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uQmx1ciA9ICgpOiB2b2lkID0+IHtcbiAgICAvLyBIYXBwZW5zIHdoZW4gdGhlIHVzZXIgdGFicyBhd2F5IHdoaWxlIHN0aWxsIGRyYWdnaW5nIGEgdGh1bWIuXG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9mb2N1c1JpcHBsZVJlZik7XG4gICAgfVxuICAgIC8vIEhhcHBlbnMgd2hlbiB0aGUgdXNlciB0YWJzIGF3YXkgZnJvbSBhIHRodW1iIGJ1dCB0aGVpciBjdXJzb3IgaXMgc3RpbGwgb3ZlciBpdC5cbiAgICBpZiAodGhpcy5faXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLl9zaG93SG92ZXJSaXBwbGUoKTtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLWZvY3VzZWQnKTtcbiAgfTtcblxuICBwcml2YXRlIF9vbkRyYWdTdGFydCA9IChldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5fc2hvd0FjdGl2ZVJpcHBsZSgpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uRHJhZ0VuZCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5fYWN0aXZlUmlwcGxlUmVmKTtcbiAgICAvLyBIYXBwZW5zIHdoZW4gdGhlIHVzZXIgc3RhcnRzIGRyYWdnaW5nIGEgdGh1bWIsIHRhYnMgYXdheSwgYW5kIHRoZW4gc3RvcHMgZHJhZ2dpbmcuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXJJbnB1dC5faXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKTtcbiAgICB9XG5cbiAgICAvLyBPbiBTYWZhcmkgd2UgbmVlZCB0byBpbW1lZGlhdGVseSByZS1zaG93IHRoZSBob3ZlciByaXBwbGUgYmVjYXVzZVxuICAgIC8vIHNsaWRlcnMgZG8gbm90IHJldGFpbiBmb2N1cyBmcm9tIHBvaW50ZXIgZXZlbnRzIG9uIHRoYXQgcGxhdGZvcm0uXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLlNBRkFSSSkge1xuICAgICAgdGhpcy5fc2hvd0hvdmVyUmlwcGxlKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBIYW5kbGVzIGRpc3BsYXlpbmcgdGhlIGhvdmVyIHJpcHBsZS4gKi9cbiAgcHJpdmF0ZSBfc2hvd0hvdmVyUmlwcGxlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5faG92ZXJSaXBwbGVSZWYgPSB0aGlzLl9zaG93UmlwcGxlKHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9KTtcbiAgICAgIHRoaXMuX2hvdmVyUmlwcGxlUmVmPy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWhvdmVyLXJpcHBsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGRpc3BsYXlpbmcgdGhlIGZvY3VzIHJpcHBsZS4gKi9cbiAgcHJpdmF0ZSBfc2hvd0ZvY3VzUmlwcGxlKCk6IHZvaWQge1xuICAgIC8vIFNob3cgdGhlIGZvY3VzIHJpcHBsZSBldmVudCBpZiBub29wIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQuXG4gICAgaWYgKCF0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5fZm9jdXNSaXBwbGVSZWYpKSB7XG4gICAgICB0aGlzLl9mb2N1c1JpcHBsZVJlZiA9IHRoaXMuX3Nob3dSaXBwbGUoe2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0sIHRydWUpO1xuICAgICAgdGhpcy5fZm9jdXNSaXBwbGVSZWY/LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItZm9jdXMtcmlwcGxlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgZGlzcGxheWluZyB0aGUgYWN0aXZlIHJpcHBsZS4gKi9cbiAgcHJpdmF0ZSBfc2hvd0FjdGl2ZVJpcHBsZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9hY3RpdmVSaXBwbGVSZWYpKSB7XG4gICAgICB0aGlzLl9hY3RpdmVSaXBwbGVSZWYgPSB0aGlzLl9zaG93UmlwcGxlKHtlbnRlckR1cmF0aW9uOiAyMjUsIGV4aXREdXJhdGlvbjogNDAwfSk7XG4gICAgICB0aGlzLl9hY3RpdmVSaXBwbGVSZWY/LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItYWN0aXZlLXJpcHBsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiByaXBwbGVSZWYgaXMgY3VycmVudGx5IGZhZGluZyBpbiBvciB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9pc1Nob3dpbmdSaXBwbGUocmlwcGxlUmVmPzogUmlwcGxlUmVmKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHJpcHBsZVJlZj8uc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTiB8fCByaXBwbGVSZWY/LnN0YXRlID09PSBSaXBwbGVTdGF0ZS5WSVNJQkxFO1xuICB9XG5cbiAgLyoqIE1hbnVhbGx5IGxhdW5jaGVzIHRoZSBzbGlkZXIgdGh1bWIgcmlwcGxlIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmlwcGxlIGFuaW1hdGlvbiBjb25maWcuICovXG4gIHByaXZhdGUgX3Nob3dSaXBwbGUoXG4gICAgYW5pbWF0aW9uOiBSaXBwbGVBbmltYXRpb25Db25maWcsXG4gICAgaWdub3JlR2xvYmFsUmlwcGxlQ29uZmlnPzogYm9vbGVhbixcbiAgKTogUmlwcGxlUmVmIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3Nob3dWYWx1ZUluZGljYXRvcigpO1xuICAgIGlmICh0aGlzLl9zbGlkZXIuX2lzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLl9zbGlkZXIuX2dldFRodW1iKFxuICAgICAgICB0aGlzLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVCA/IF9NYXRUaHVtYi5FTkQgOiBfTWF0VGh1bWIuU1RBUlQsXG4gICAgICApO1xuICAgICAgc2libGluZy5fc2hvd1ZhbHVlSW5kaWNhdG9yKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zbGlkZXIuX2dsb2JhbFJpcHBsZU9wdGlvbnM/LmRpc2FibGVkICYmICFpZ25vcmVHbG9iYWxSaXBwbGVDb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JpcHBsZS5sYXVuY2goe1xuICAgICAgYW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX25vb3BBbmltYXRpb25zID8ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0gOiBhbmltYXRpb24sXG4gICAgICBjZW50ZXJlZDogdHJ1ZSxcbiAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmFkZXMgb3V0IHRoZSBnaXZlbiByaXBwbGUuXG4gICAqIEFsc28gaGlkZXMgdGhlIHZhbHVlIGluZGljYXRvciBpZiBubyByaXBwbGUgaXMgc2hvd2luZy5cbiAgICovXG4gIHByaXZhdGUgX2hpZGVSaXBwbGUocmlwcGxlUmVmPzogUmlwcGxlUmVmKTogdm9pZCB7XG4gICAgcmlwcGxlUmVmPy5mYWRlT3V0KCk7XG5cbiAgICBpZiAodGhpcy5faXNTaG93aW5nQW55UmlwcGxlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5faXNSYW5nZSkge1xuICAgICAgdGhpcy5faGlkZVZhbHVlSW5kaWNhdG9yKCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuX2dldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcuX2lzU2hvd2luZ0FueVJpcHBsZSgpKSB7XG4gICAgICB0aGlzLl9oaWRlVmFsdWVJbmRpY2F0b3IoKTtcbiAgICAgIHNpYmxpbmcuX2hpZGVWYWx1ZUluZGljYXRvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdmFsdWUgaW5kaWNhdG9yIHVpLiAqL1xuICBfc2hvd1ZhbHVlSW5kaWNhdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1zbGlkZXJfX3RodW1iLS13aXRoLWluZGljYXRvcicpO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdWkuICovXG4gIF9oaWRlVmFsdWVJbmRpY2F0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLXdpdGgtaW5kaWNhdG9yJyk7XG4gIH1cblxuICBfZ2V0U2libGluZygpOiBfTWF0U2xpZGVyVmlzdWFsVGh1bWIge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2dldFRodW1iKFxuICAgICAgdGhpcy50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlQgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJULFxuICAgICk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgaW5kaWNhdG9yIGNvbnRhaW5lcidzIG5hdGl2ZSBIVE1MIGVsZW1lbnQuICovXG4gIF9nZXRWYWx1ZUluZGljYXRvckNvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyPy5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hdGl2ZSBIVE1MIGVsZW1lbnQgb2YgdGhlIHNsaWRlciB0aHVtYiBrbm9iLiAqL1xuICBfZ2V0S25vYigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2tub2IubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIF9pc1Nob3dpbmdBbnlSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZikgfHxcbiAgICAgIHRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9mb2N1c1JpcHBsZVJlZikgfHxcbiAgICAgIHRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9hY3RpdmVSaXBwbGVSZWYpXG4gICAgKTtcbiAgfVxufVxuIiwiQGlmIChkaXNjcmV0ZSkge1xuICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdmFsdWUtaW5kaWNhdG9yLWNvbnRhaW5lclwiICN2YWx1ZUluZGljYXRvckNvbnRhaW5lcj5cbiAgICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdmFsdWUtaW5kaWNhdG9yXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cIm1kYy1zbGlkZXJfX3ZhbHVlLWluZGljYXRvci10ZXh0XCI+e3t2YWx1ZUluZGljYXRvclRleHR9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG59XG48ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdGh1bWIta25vYlwiICNrbm9iPjwvZGl2PlxuPGRpdiBtYXRSaXBwbGUgY2xhc3M9XCJtYXQtbWRjLWZvY3VzLWluZGljYXRvclwiIFttYXRSaXBwbGVEaXNhYmxlZF09XCJ0cnVlXCI+PC9kaXY+XG4iXX0=