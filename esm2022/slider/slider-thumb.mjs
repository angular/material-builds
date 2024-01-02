/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MatRipple, RippleState } from '@angular/material/core';
import { _MatThumb, MAT_SLIDER, MAT_SLIDER_VISUAL_THUMB, } from './slider-interface';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLXRodW1iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItdGh1bWIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci10aHVtYi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFvQyxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNoRyxPQUFPLEVBQ0wsU0FBUyxFQUlULFVBQVUsRUFDVix1QkFBdUIsR0FDeEIsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFNUI7Ozs7OztHQU1HO0FBY0gsTUFBTSxPQUFPLG9CQUFvQjtJQStDL0IsWUFDVyxJQUF1QixFQUNmLE9BQWUsRUFDaEMsV0FBb0MsRUFDUixPQUFtQjtRQUh0QyxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFFSixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBaEJqRCwyREFBMkQ7UUFDbkQsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUVwQywyREFBMkQ7UUFDM0QsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixzREFBc0Q7UUFDdEQsNkJBQXdCLEdBQVksS0FBSyxDQUFDO1FBMENsQyxtQkFBYyxHQUFHLENBQUMsS0FBbUIsRUFBUSxFQUFFO1lBQ3JELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDakMsT0FBTztZQUNULENBQUM7WUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7WUFFNUIsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDZCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNILENBQUMsQ0FBQztRQUVNLGtCQUFhLEdBQUcsR0FBUyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQztRQUVNLGFBQVEsR0FBRyxHQUFTLEVBQUU7WUFDNUIscUVBQXFFO1lBQ3JFLDZFQUE2RTtZQUM3RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUM7UUFFTSxZQUFPLEdBQUcsR0FBUyxFQUFFO1lBQzNCLGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBQ0Qsa0ZBQWtGO1lBQ2xGLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNwQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDO1FBRU0saUJBQVksR0FBRyxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUNuRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU87WUFDVCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBRU0sZUFBVSxHQUFHLEdBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hDLHFGQUFxRjtZQUNyRixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNILENBQUMsQ0FBQztRQXZGQSxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDaEQsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBRWxDLHlFQUF5RTtRQUN6RSw2RUFBNkU7UUFDN0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDM0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDekQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDbEMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQTRERCwyQ0FBMkM7SUFDbkMsZ0JBQWdCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7WUFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDN0UsQ0FBQztJQUNILENBQUM7SUFFRCwyQ0FBMkM7SUFDbkMsZ0JBQWdCO1FBQ3RCLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUM3RSxDQUFDO0lBQ0gsQ0FBQztJQUVELDRDQUE0QztJQUNwQyxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUMvRSxDQUFDO0lBQ0gsQ0FBQztJQUVELHFFQUFxRTtJQUM3RCxnQkFBZ0IsQ0FBQyxTQUFxQjtRQUM1QyxPQUFPLFNBQVMsRUFBRSxLQUFLLEtBQUssV0FBVyxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUUsS0FBSyxLQUFLLFdBQVcsQ0FBQyxPQUFPLENBQUM7SUFDaEcsQ0FBQztJQUVELDZGQUE2RjtJQUNyRixXQUFXLENBQ2pCLFNBQWdDLEVBQ2hDLHdCQUFrQztRQUVsQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDMUIsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDMUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQ3BDLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FDekUsQ0FBQztZQUNGLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUM3RSxPQUFPO1FBQ1QsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDekIsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3pGLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNLLFdBQVcsQ0FBQyxTQUFxQjtRQUN2QyxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFFckIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDO1lBQy9CLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUMzQixJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQ3pFLENBQUM7SUFDSixDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLDJCQUEyQjtRQUN6QixPQUFPLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxhQUFhLENBQUM7SUFDdEQsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUNsQyxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLE9BQU8sQ0FDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQzdDLENBQUM7SUFDSixDQUFDO3FIQTNQVSxvQkFBb0IsbUdBbURyQixVQUFVO3lHQW5EVCxvQkFBb0IsNlBBSnBCLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFDLENBQUMsbUVBZXZFLFNBQVMsc1BDOUR0QixnWkFTQSxtV0R3Q1ksU0FBUzs7a0dBRVIsb0JBQW9CO2tCQWJoQyxTQUFTOytCQUNFLHlCQUF5QixRQUc3Qjt3QkFDSixPQUFPLEVBQUUsK0NBQStDO3FCQUN6RCxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxhQUMxQixDQUFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFdBQVcsc0JBQXNCLEVBQUMsQ0FBQyxjQUN0RSxJQUFJLFdBQ1AsQ0FBQyxTQUFTLENBQUM7OzBCQXFEakIsTUFBTTsyQkFBQyxVQUFVO3lDQWpEWCxRQUFRO3NCQUFoQixLQUFLO2dCQUdHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBR0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUd5QixPQUFPO3NCQUFyQyxTQUFTO3VCQUFDLFNBQVM7Z0JBR0QsS0FBSztzQkFBdkIsU0FBUzt1QkFBQyxNQUFNO2dCQUlqQix3QkFBd0I7c0JBRHZCLFNBQVM7dUJBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFJpcHBsZSwgUmlwcGxlQW5pbWF0aW9uQ29uZmlnLCBSaXBwbGVSZWYsIFJpcHBsZVN0YXRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgX01hdFNsaWRlcixcbiAgX01hdFNsaWRlclRodW1iLFxuICBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsXG4gIE1BVF9TTElERVIsXG4gIE1BVF9TTElERVJfVklTVUFMX1RIVU1CLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuXG4vKipcbiAqIFRoZSB2aXN1YWwgc2xpZGVyIHRodW1iLlxuICpcbiAqIEhhbmRsZXMgdGhlIHNsaWRlciB0aHVtYiByaXBwbGUgc3RhdGVzIChob3ZlciwgZm9jdXMsIGFuZCBhY3RpdmUpLFxuICogYW5kIGRpc3BsYXlpbmcgdGhlIHZhbHVlIHRvb2x0aXAgb24gZGlzY3JldGUgc2xpZGVycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlci12aXN1YWwtdGh1bWInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2xpZGVyLXRodW1iLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLXRodW1iLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX3RodW1iIG1hdC1tZGMtc2xpZGVyLXZpc3VhbC10aHVtYicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NMSURFUl9WSVNVQUxfVEhVTUIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJWaXN1YWxUaHVtYn1dLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0UmlwcGxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyVmlzdWFsVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgZGlzcGxheXMgYSBudW1lcmljIHZhbHVlIGxhYmVsIHVwb24gcHJlc3NpbmcgdGhlIHRodW1iLiAqL1xuICBASW5wdXQoKSBkaXNjcmV0ZTogYm9vbGVhbjtcblxuICAvKiogSW5kaWNhdGVzIHdoaWNoIHNsaWRlciB0aHVtYiB0aGlzIGlucHV0IGNvcnJlc3BvbmRzIHRvLiAqL1xuICBASW5wdXQoKSB0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWI7XG5cbiAgLyoqIFRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBzbGlkZXIgdGh1bWIuICovXG4gIEBJbnB1dCgpIHZhbHVlSW5kaWNhdG9yVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgTWF0UmlwcGxlIGZvciB0aGlzIHNsaWRlciB0aHVtYi4gKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJlYWRvbmx5IF9yaXBwbGU6IE1hdFJpcHBsZTtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYiBrbm9iLiAqL1xuICBAVmlld0NoaWxkKCdrbm9iJykgX2tub2I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgc2xpZGVyIHRodW1iIHZhbHVlIGluZGljYXRvciBjb250YWluZXIuICovXG4gIEBWaWV3Q2hpbGQoJ3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyJylcbiAgX3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciBpbnB1dCBjb3JyZXNwb25kaW5nIHRvIHRoaXMgc2xpZGVyIHRodW1iLiAqL1xuICBwcml2YXRlIF9zbGlkZXJJbnB1dDogX01hdFNsaWRlclRodW1iO1xuXG4gIC8qKiBUaGUgbmF0aXZlIGh0bWwgZWxlbWVudCBvZiB0aGUgc2xpZGVyIGlucHV0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyB0aHVtYi4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVySW5wdXRFbDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIFJpcHBsZVJlZiBmb3IgdGhlIHNsaWRlciB0aHVtYnMgaG92ZXIgc3RhdGUuICovXG4gIHByaXZhdGUgX2hvdmVyUmlwcGxlUmVmOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFRoZSBSaXBwbGVSZWYgZm9yIHRoZSBzbGlkZXIgdGh1bWJzIGZvY3VzIHN0YXRlLiAqL1xuICBwcml2YXRlIF9mb2N1c1JpcHBsZVJlZjogUmlwcGxlUmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBUaGUgUmlwcGxlUmVmIGZvciB0aGUgc2xpZGVyIHRodW1icyBhY3RpdmUgc3RhdGUuICovXG4gIHByaXZhdGUgX2FjdGl2ZVJpcHBsZVJlZjogUmlwcGxlUmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgdGh1bWIgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQuICovXG4gIHByaXZhdGUgX2lzSG92ZXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgdGh1bWIgaXMgY3VycmVudGx5IGJlaW5nIHByZXNzZWQuICovXG4gIF9pc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdG9vbHRpcCBpcyB2aXNpYmxlLiAqL1xuICBfaXNWYWx1ZUluZGljYXRvclZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGhvc3QgbmF0aXZlIEhUTUwgaW5wdXQgZWxlbWVudC4gKi9cbiAgX2hvc3RFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfU0xJREVSKSBwcml2YXRlIF9zbGlkZXI6IF9NYXRTbGlkZXIsXG4gICkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9yaXBwbGUucmFkaXVzID0gMjQ7XG4gICAgdGhpcy5fc2xpZGVySW5wdXQgPSB0aGlzLl9zbGlkZXIuX2dldElucHV0KHRoaXMudGh1bWJQb3NpdGlvbikhO1xuICAgIHRoaXMuX3NsaWRlcklucHV0RWwgPSB0aGlzLl9zbGlkZXJJbnB1dC5faG9zdEVsZW1lbnQ7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9zbGlkZXJJbnB1dEVsO1xuXG4gICAgLy8gVGhlc2UgbGlzdGVuZXJzIGRvbid0IHVwZGF0ZSBhbnkgZGF0YSBiaW5kaW5ncyBzbyB3ZSBiaW5kIHRoZW0gb3V0c2lkZVxuICAgIC8vIG9mIHRoZSBOZ1pvbmUgdG8gcHJldmVudCBBbmd1bGFyIGZyb20gbmVlZGxlc3NseSBydW5uaW5nIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZSk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJhZ0VuZCk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybGVhdmUnLCB0aGlzLl9vbk1vdXNlTGVhdmUpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9zbGlkZXJJbnB1dEVsO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZSk7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vbkRyYWdTdGFydCk7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5fb25EcmFnRW5kKTtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybGVhdmUnLCB0aGlzLl9vbk1vdXNlTGVhdmUpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG4gIH1cblxuICBwcml2YXRlIF9vblBvaW50ZXJNb3ZlID0gKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy5fc2xpZGVySW5wdXQuX2lzRm9jdXNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLl9ob3N0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBpc0hvdmVyZWQgPSB0aGlzLl9zbGlkZXIuX2lzQ3Vyc29yT25TbGlkZXJUaHVtYihldmVudCwgcmVjdCk7XG4gICAgdGhpcy5faXNIb3ZlcmVkID0gaXNIb3ZlcmVkO1xuXG4gICAgaWYgKGlzSG92ZXJlZCkge1xuICAgICAgdGhpcy5fc2hvd0hvdmVyUmlwcGxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5faG92ZXJSaXBwbGVSZWYpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIF9vbk1vdXNlTGVhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5faXNIb3ZlcmVkID0gZmFsc2U7XG4gICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZik7XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25Gb2N1cyA9ICgpOiB2b2lkID0+IHtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNob3cgdGhlIGhvdmVyIHJpcHBsZSBvbiB0b3Agb2YgdGhlIGZvY3VzIHJpcHBsZS5cbiAgICAvLyBIYXBwZW4gd2hlbiB0aGUgdXNlcnMgY3Vyc29yIGlzIG92ZXIgYSB0aHVtYiBhbmQgdGhlbiB0aGUgdXNlciB0YWJzIHRvIGl0LlxuICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5faG92ZXJSaXBwbGVSZWYpO1xuICAgIHRoaXMuX3Nob3dGb2N1c1JpcHBsZSgpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1zbGlkZXJfX3RodW1iLS1mb2N1c2VkJyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25CbHVyID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIEhhcHBlbnMgd2hlbiB0aGUgdXNlciB0YWJzIGF3YXkgd2hpbGUgc3RpbGwgZHJhZ2dpbmcgYSB0aHVtYi5cbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKTtcbiAgICB9XG4gICAgLy8gSGFwcGVucyB3aGVuIHRoZSB1c2VyIHRhYnMgYXdheSBmcm9tIGEgdGh1bWIgYnV0IHRoZWlyIGN1cnNvciBpcyBzdGlsbCBvdmVyIGl0LlxuICAgIGlmICh0aGlzLl9pc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuX3Nob3dIb3ZlclJpcHBsZSgpO1xuICAgIH1cbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtc2xpZGVyX190aHVtYi0tZm9jdXNlZCcpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uRHJhZ1N0YXJ0ID0gKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2lzQWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLl9zaG93QWN0aXZlUmlwcGxlKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25EcmFnRW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9hY3RpdmVSaXBwbGVSZWYpO1xuICAgIC8vIEhhcHBlbnMgd2hlbiB0aGUgdXNlciBzdGFydHMgZHJhZ2dpbmcgYSB0aHVtYiwgdGFicyBhd2F5LCBhbmQgdGhlbiBzdG9wcyBkcmFnZ2luZy5cbiAgICBpZiAoIXRoaXMuX3NsaWRlcklucHV0Ll9pc0ZvY3VzZWQpIHtcbiAgICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5fZm9jdXNSaXBwbGVSZWYpO1xuICAgIH1cbiAgfTtcblxuICAvKiogSGFuZGxlcyBkaXNwbGF5aW5nIHRoZSBob3ZlciByaXBwbGUuICovXG4gIHByaXZhdGUgX3Nob3dIb3ZlclJpcHBsZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZikpIHtcbiAgICAgIHRoaXMuX2hvdmVyUmlwcGxlUmVmID0gdGhpcy5fc2hvd1JpcHBsZSh7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfSk7XG4gICAgICB0aGlzLl9ob3ZlclJpcHBsZVJlZj8uZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLXNsaWRlci1ob3Zlci1yaXBwbGUnKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBkaXNwbGF5aW5nIHRoZSBmb2N1cyByaXBwbGUuICovXG4gIHByaXZhdGUgX3Nob3dGb2N1c1JpcHBsZSgpOiB2b2lkIHtcbiAgICAvLyBTaG93IHRoZSBmb2N1cyByaXBwbGUgZXZlbnQgaWYgbm9vcCBhbmltYXRpb25zIGFyZSBlbmFibGVkLlxuICAgIGlmICghdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5fZm9jdXNSaXBwbGVSZWYgPSB0aGlzLl9zaG93UmlwcGxlKHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9LCB0cnVlKTtcbiAgICAgIHRoaXMuX2ZvY3VzUmlwcGxlUmVmPy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWZvY3VzLXJpcHBsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGRpc3BsYXlpbmcgdGhlIGFjdGl2ZSByaXBwbGUuICovXG4gIHByaXZhdGUgX3Nob3dBY3RpdmVSaXBwbGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5fYWN0aXZlUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5fYWN0aXZlUmlwcGxlUmVmID0gdGhpcy5fc2hvd1JpcHBsZSh7ZW50ZXJEdXJhdGlvbjogMjI1LCBleGl0RHVyYXRpb246IDQwMH0pO1xuICAgICAgdGhpcy5fYWN0aXZlUmlwcGxlUmVmPy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWFjdGl2ZS1yaXBwbGUnKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gcmlwcGxlUmVmIGlzIGN1cnJlbnRseSBmYWRpbmcgaW4gb3IgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfaXNTaG93aW5nUmlwcGxlKHJpcHBsZVJlZj86IFJpcHBsZVJlZik6IGJvb2xlYW4ge1xuICAgIHJldHVybiByaXBwbGVSZWY/LnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfSU4gfHwgcmlwcGxlUmVmPy5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRTtcbiAgfVxuXG4gIC8qKiBNYW51YWxseSBsYXVuY2hlcyB0aGUgc2xpZGVyIHRodW1iIHJpcHBsZSB1c2luZyB0aGUgc3BlY2lmaWVkIHJpcHBsZSBhbmltYXRpb24gY29uZmlnLiAqL1xuICBwcml2YXRlIF9zaG93UmlwcGxlKFxuICAgIGFuaW1hdGlvbjogUmlwcGxlQW5pbWF0aW9uQ29uZmlnLFxuICAgIGlnbm9yZUdsb2JhbFJpcHBsZUNvbmZpZz86IGJvb2xlYW4sXG4gICk6IFJpcHBsZVJlZiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuX3NsaWRlci5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zaG93VmFsdWVJbmRpY2F0b3IoKTtcbiAgICBpZiAodGhpcy5fc2xpZGVyLl9pc1JhbmdlKSB7XG4gICAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5fc2xpZGVyLl9nZXRUaHVtYihcbiAgICAgICAgdGhpcy50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlQgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJULFxuICAgICAgKTtcbiAgICAgIHNpYmxpbmcuX3Nob3dWYWx1ZUluZGljYXRvcigpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2xpZGVyLl9nbG9iYWxSaXBwbGVPcHRpb25zPy5kaXNhYmxlZCAmJiAhaWdub3JlR2xvYmFsUmlwcGxlQ29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yaXBwbGUubGF1bmNoKHtcbiAgICAgIGFuaW1hdGlvbjogdGhpcy5fc2xpZGVyLl9ub29wQW5pbWF0aW9ucyA/IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9IDogYW5pbWF0aW9uLFxuICAgICAgY2VudGVyZWQ6IHRydWUsXG4gICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhZGVzIG91dCB0aGUgZ2l2ZW4gcmlwcGxlLlxuICAgKiBBbHNvIGhpZGVzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgaWYgbm8gcmlwcGxlIGlzIHNob3dpbmcuXG4gICAqL1xuICBwcml2YXRlIF9oaWRlUmlwcGxlKHJpcHBsZVJlZj86IFJpcHBsZVJlZik6IHZvaWQge1xuICAgIHJpcHBsZVJlZj8uZmFkZU91dCgpO1xuXG4gICAgaWYgKHRoaXMuX2lzU2hvd2luZ0FueVJpcHBsZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuX2lzUmFuZ2UpIHtcbiAgICAgIHRoaXMuX2hpZGVWYWx1ZUluZGljYXRvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLl9nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nLl9pc1Nob3dpbmdBbnlSaXBwbGUoKSkge1xuICAgICAgdGhpcy5faGlkZVZhbHVlSW5kaWNhdG9yKCk7XG4gICAgICBzaWJsaW5nLl9oaWRlVmFsdWVJbmRpY2F0b3IoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2hvd3MgdGhlIHZhbHVlIGluZGljYXRvciB1aS4gKi9cbiAgX3Nob3dWYWx1ZUluZGljYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtc2xpZGVyX190aHVtYi0td2l0aC1pbmRpY2F0b3InKTtcbiAgfVxuXG4gIC8qKiBIaWRlcyB0aGUgdmFsdWUgaW5kaWNhdG9yIHVpLiAqL1xuICBfaGlkZVZhbHVlSW5kaWNhdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21kYy1zbGlkZXJfX3RodW1iLS13aXRoLWluZGljYXRvcicpO1xuICB9XG5cbiAgX2dldFNpYmxpbmcoKTogX01hdFNsaWRlclZpc3VhbFRodW1iIHtcbiAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9nZXRUaHVtYihcbiAgICAgIHRoaXMudGh1bWJQb3NpdGlvbiA9PT0gX01hdFRodW1iLlNUQVJUID8gX01hdFRodW1iLkVORCA6IF9NYXRUaHVtYi5TVEFSVCxcbiAgICApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGluZGljYXRvciBjb250YWluZXIncyBuYXRpdmUgSFRNTCBlbGVtZW50LiAqL1xuICBfZ2V0VmFsdWVJbmRpY2F0b3JDb250YWluZXIoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZUluZGljYXRvckNvbnRhaW5lcj8ubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYXRpdmUgSFRNTCBlbGVtZW50IG9mIHRoZSBzbGlkZXIgdGh1bWIga25vYi4gKi9cbiAgX2dldEtub2IoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9rbm9iLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBfaXNTaG93aW5nQW55UmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5faG92ZXJSaXBwbGVSZWYpIHx8XG4gICAgICB0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5fZm9jdXNSaXBwbGVSZWYpIHx8XG4gICAgICB0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5fYWN0aXZlUmlwcGxlUmVmKVxuICAgICk7XG4gIH1cbn1cbiIsIkBpZiAoZGlzY3JldGUpIHtcbiAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3ZhbHVlLWluZGljYXRvci1jb250YWluZXJcIiAjdmFsdWVJbmRpY2F0b3JDb250YWluZXI+XG4gICAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3ZhbHVlLWluZGljYXRvclwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtZGMtc2xpZGVyX192YWx1ZS1pbmRpY2F0b3ItdGV4dFwiPnt7dmFsdWVJbmRpY2F0b3JUZXh0fX08L3NwYW4+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxufVxuPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RodW1iLWtub2JcIiAja25vYj48L2Rpdj5cbjxkaXYgbWF0UmlwcGxlIGNsYXNzPVwibWF0LW1kYy1mb2N1cy1pbmRpY2F0b3JcIiBbbWF0UmlwcGxlRGlzYWJsZWRdPVwidHJ1ZVwiPjwvZGl2PlxuIl19