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
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/core";
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSliderVisualThumb, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i0.ElementRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: { discrete: "discrete", thumbPosition: "thumbPosition", valueIndicatorText: "valueIndicatorText" }, host: { classAttribute: "mdc-slider__thumb mat-mdc-slider-visual-thumb" }, providers: [{ provide: MAT_SLIDER_VISUAL_THUMB, useExisting: MatSliderVisualThumb }], viewQueries: [{ propertyName: "_ripple", first: true, predicate: MatRipple, descendants: true }, { propertyName: "_knob", first: true, predicate: ["knob"], descendants: true }, { propertyName: "_valueIndicatorContainer", first: true, predicate: ["valueIndicatorContainer"], descendants: true }], ngImport: i0, template: "<div class=\"mdc-slider__value-indicator-container\" *ngIf=\"discrete\" #valueIndicatorContainer>\n  <div class=\"mdc-slider__value-indicator\">\n    <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n  </div>\n</div>\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div matRipple class=\"mat-mdc-focus-indicator\" [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSliderVisualThumb, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider-visual-thumb', host: {
                        'class': 'mdc-slider__thumb mat-mdc-slider-visual-thumb',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: MAT_SLIDER_VISUAL_THUMB, useExisting: MatSliderVisualThumb }], template: "<div class=\"mdc-slider__value-indicator-container\" *ngIf=\"discrete\" #valueIndicatorContainer>\n  <div class=\"mdc-slider__value-indicator\">\n    <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n  </div>\n</div>\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div matRipple class=\"mat-mdc-focus-indicator\" [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }]; }, propDecorators: { discrete: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLXRodW1iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItdGh1bWIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci10aHVtYi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFnRCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hHLE9BQU8sRUFLTCxVQUFVLEVBQ1YsdUJBQXVCLEdBQ3hCLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFFNUI7Ozs7OztHQU1HO0FBWUgsTUFBTSxPQUFPLG9CQUFvQjtJQStDL0IsWUFDVyxJQUF1QixFQUNmLE9BQWUsRUFDaEMsV0FBb0MsRUFDUixPQUFtQjtRQUh0QyxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFFSixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBaEJqRCwyREFBMkQ7UUFDbkQsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUVwQywyREFBMkQ7UUFDM0QsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixzREFBc0Q7UUFDdEQsNkJBQXdCLEdBQVksS0FBSyxDQUFDO1FBMENsQyxtQkFBYyxHQUFHLENBQUMsS0FBbUIsRUFBUSxFQUFFO1lBQ3JELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2hDLE9BQU87YUFDUjtZQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN2RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztZQUU1QixJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN6QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUN4QztRQUNILENBQUMsQ0FBQztRQUVNLGtCQUFhLEdBQUcsR0FBUyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQztRQUVNLGFBQVEsR0FBRyxHQUFTLEVBQUU7WUFDNUIscUVBQXFFO1lBQ3JFLDZFQUE2RTtZQUM3RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUM7UUFFTSxZQUFPLEdBQUcsR0FBUyxFQUFFO1lBQzNCLGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDeEM7WUFDRCxrRkFBa0Y7WUFDbEYsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN6QjtZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQztRQUVNLGlCQUFZLEdBQUcsQ0FBQyxLQUFtQixFQUFRLEVBQUU7WUFDbkQsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDdEIsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBRU0sZUFBVSxHQUFHLEdBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hDLHFGQUFxRjtZQUNyRixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFDO1FBdkZBLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQztJQUNoRCxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUUsQ0FBQztRQUNoRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO1FBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFbEMseUVBQXlFO1FBQ3pFLDZFQUE2RTtRQUM3RSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNsQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMzRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUNsQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5RCxLQUFLLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1RCxLQUFLLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RCxLQUFLLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RCxLQUFLLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBNERELDJDQUEyQztJQUNuQyxnQkFBZ0I7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDNUU7SUFDSCxDQUFDO0lBRUQsMkNBQTJDO0lBQ25DLGdCQUFnQjtRQUN0Qiw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQzVFO0lBQ0gsQ0FBQztJQUVELDRDQUE0QztJQUNwQyxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDOUU7SUFDSCxDQUFDO0lBRUQscUVBQXFFO0lBQzdELGdCQUFnQixDQUFDLFNBQXFCO1FBQzVDLE9BQU8sU0FBUyxFQUFFLEtBQUssa0NBQTBCLElBQUksU0FBUyxFQUFFLEtBQUssZ0NBQXdCLENBQUM7SUFDaEcsQ0FBQztJQUVELDZGQUE2RjtJQUNyRixXQUFXLENBQ2pCLFNBQWdDLEVBQ2hDLHdCQUFrQztRQUVsQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3pCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDekIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQ3BDLElBQUksQ0FBQyxhQUFhLDRCQUFvQixDQUFDLENBQUMsdUJBQWUsQ0FBQyx3QkFBZ0IsQ0FDekUsQ0FBQztZQUNGLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLFFBQVEsSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQzVFLE9BQU87U0FDUjtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDekIsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3pGLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNLLFdBQVcsQ0FBQyxTQUFxQjtRQUN2QyxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFFckIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRTtZQUM5QixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDMUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDNUI7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUMzQixJQUFJLENBQUMsYUFBYSw0QkFBb0IsQ0FBQyxDQUFDLHVCQUFlLENBQUMsd0JBQWdCLENBQ3pFLENBQUM7SUFDSixDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLDJCQUEyQjtRQUN6QixPQUFPLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxhQUFhLENBQUM7SUFDdEQsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUNsQyxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLE9BQU8sQ0FDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQzdDLENBQUM7SUFDSixDQUFDOzhHQTNQVSxvQkFBb0IsbUdBbURyQixVQUFVO2tHQW5EVCxvQkFBb0IseU9BRnBCLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFDLENBQUMsbUVBYXZFLFNBQVMsc1BDNUR0QixvWUFPQTs7MkZEMENhLG9CQUFvQjtrQkFYaEMsU0FBUzsrQkFDRSx5QkFBeUIsUUFHN0I7d0JBQ0osT0FBTyxFQUFFLCtDQUErQztxQkFDekQsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksYUFDMUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxXQUFXLHNCQUFzQixFQUFDLENBQUM7OzBCQXFEL0UsTUFBTTsyQkFBQyxVQUFVOzRDQWpEWCxRQUFRO3NCQUFoQixLQUFLO2dCQUdHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBR0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUd5QixPQUFPO3NCQUFyQyxTQUFTO3VCQUFDLFNBQVM7Z0JBR0QsS0FBSztzQkFBdkIsU0FBUzt1QkFBQyxNQUFNO2dCQUlqQix3QkFBd0I7c0JBRHZCLFNBQVM7dUJBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFJpcHBsZSwgUmlwcGxlQW5pbWF0aW9uQ29uZmlnLCBSaXBwbGVSZWYsIFJpcHBsZVN0YXRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgX01hdFNsaWRlcixcbiAgX01hdFNsaWRlclRodW1iLFxuICBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsXG4gIE1BVF9TTElERVIsXG4gIE1BVF9TTElERVJfVklTVUFMX1RIVU1CLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuXG4vKipcbiAqIFRoZSB2aXN1YWwgc2xpZGVyIHRodW1iLlxuICpcbiAqIEhhbmRsZXMgdGhlIHNsaWRlciB0aHVtYiByaXBwbGUgc3RhdGVzIChob3ZlciwgZm9jdXMsIGFuZCBhY3RpdmUpLFxuICogYW5kIGRpc3BsYXlpbmcgdGhlIHZhbHVlIHRvb2x0aXAgb24gZGlzY3JldGUgc2xpZGVycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlci12aXN1YWwtdGh1bWInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2xpZGVyLXRodW1iLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLXRodW1iLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX3RodW1iIG1hdC1tZGMtc2xpZGVyLXZpc3VhbC10aHVtYicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NMSURFUl9WSVNVQUxfVEhVTUIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJWaXN1YWxUaHVtYn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJWaXN1YWxUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJWaXN1YWxUaHVtYiwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyBhIG51bWVyaWMgdmFsdWUgbGFiZWwgdXBvbiBwcmVzc2luZyB0aGUgdGh1bWIuICovXG4gIEBJbnB1dCgpIGRpc2NyZXRlOiBib29sZWFuO1xuXG4gIC8qKiBJbmRpY2F0ZXMgd2hpY2ggc2xpZGVyIHRodW1iIHRoaXMgaW5wdXQgY29ycmVzcG9uZHMgdG8uICovXG4gIEBJbnB1dCgpIHRodW1iUG9zaXRpb246IF9NYXRUaHVtYjtcblxuICAvKiogVGhlIGRpc3BsYXkgdmFsdWUgb2YgdGhlIHNsaWRlciB0aHVtYi4gKi9cbiAgQElucHV0KCkgdmFsdWVJbmRpY2F0b3JUZXh0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBNYXRSaXBwbGUgZm9yIHRoaXMgc2xpZGVyIHRodW1iLiAqL1xuICBAVmlld0NoaWxkKE1hdFJpcHBsZSkgcmVhZG9ubHkgX3JpcHBsZTogTWF0UmlwcGxlO1xuXG4gIC8qKiBUaGUgc2xpZGVyIHRodW1iIGtub2IuICovXG4gIEBWaWV3Q2hpbGQoJ2tub2InKSBfa25vYjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFRoZSBzbGlkZXIgdGh1bWIgdmFsdWUgaW5kaWNhdG9yIGNvbnRhaW5lci4gKi9cbiAgQFZpZXdDaGlsZCgndmFsdWVJbmRpY2F0b3JDb250YWluZXInKVxuICBfdmFsdWVJbmRpY2F0b3JDb250YWluZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgc2xpZGVyIGlucHV0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBzbGlkZXIgdGh1bWIuICovXG4gIHByaXZhdGUgX3NsaWRlcklucHV0OiBfTWF0U2xpZGVyVGh1bWI7XG5cbiAgLyoqIFRoZSBuYXRpdmUgaHRtbCBlbGVtZW50IG9mIHRoZSBzbGlkZXIgaW5wdXQgY29ycmVzcG9uZGluZyB0byB0aGlzIHRodW1iLiAqL1xuICBwcml2YXRlIF9zbGlkZXJJbnB1dEVsOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIC8qKiBUaGUgUmlwcGxlUmVmIGZvciB0aGUgc2xpZGVyIHRodW1icyBob3ZlciBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfaG92ZXJSaXBwbGVSZWY6IFJpcHBsZVJlZiB8IHVuZGVmaW5lZDtcblxuICAvKiogVGhlIFJpcHBsZVJlZiBmb3IgdGhlIHNsaWRlciB0aHVtYnMgZm9jdXMgc3RhdGUuICovXG4gIHByaXZhdGUgX2ZvY3VzUmlwcGxlUmVmOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFRoZSBSaXBwbGVSZWYgZm9yIHRoZSBzbGlkZXIgdGh1bWJzIGFjdGl2ZSBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfYWN0aXZlUmlwcGxlUmVmOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciB0aHVtYiBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZC4gKi9cbiAgcHJpdmF0ZSBfaXNIb3ZlcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciB0aHVtYiBpcyBjdXJyZW50bHkgYmVpbmcgcHJlc3NlZC4gKi9cbiAgX2lzQWN0aXZlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHZhbHVlIGluZGljYXRvciB0b29sdGlwIGlzIHZpc2libGUuICovXG4gIF9pc1ZhbHVlSW5kaWNhdG9yVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaG9zdCBuYXRpdmUgSFRNTCBpbnB1dCBlbGVtZW50LiAqL1xuICBfaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIHByaXZhdGUgX3NsaWRlcjogX01hdFNsaWRlcixcbiAgKSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3JpcHBsZS5yYWRpdXMgPSAyNDtcbiAgICB0aGlzLl9zbGlkZXJJbnB1dCA9IHRoaXMuX3NsaWRlci5fZ2V0SW5wdXQodGhpcy50aHVtYlBvc2l0aW9uKSE7XG4gICAgdGhpcy5fc2xpZGVySW5wdXRFbCA9IHRoaXMuX3NsaWRlcklucHV0Ll9ob3N0RWxlbWVudDtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX3NsaWRlcklucHV0RWw7XG5cbiAgICAvLyBUaGVzZSBsaXN0ZW5lcnMgZG9uJ3QgdXBkYXRlIGFueSBkYXRhIGJpbmRpbmdzIHNvIHdlIGJpbmQgdGhlbSBvdXRzaWRlXG4gICAgLy8gb2YgdGhlIE5nWm9uZSB0byBwcmV2ZW50IEFuZ3VsYXIgZnJvbSBuZWVkbGVzc2x5IHJ1bm5pbmcgY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9vblBvaW50ZXJNb3ZlKTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25EcmFnU3RhcnQpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5fb25EcmFnRW5kKTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsZWF2ZScsIHRoaXMuX29uTW91c2VMZWF2ZSk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX3NsaWRlcklucHV0RWw7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9vblBvaW50ZXJNb3ZlKTtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vbkRyYWdFbmQpO1xuICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsZWF2ZScsIHRoaXMuX29uTW91c2VMZWF2ZSk7XG4gICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgfVxuXG4gIHByaXZhdGUgX29uUG9pbnRlck1vdmUgPSAoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLl9zbGlkZXJJbnB1dC5faXNGb2N1c2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuX2hvc3RFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGlzSG92ZXJlZCA9IHRoaXMuX3NsaWRlci5faXNDdXJzb3JPblNsaWRlclRodW1iKGV2ZW50LCByZWN0KTtcbiAgICB0aGlzLl9pc0hvdmVyZWQgPSBpc0hvdmVyZWQ7XG5cbiAgICBpZiAoaXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLl9zaG93SG92ZXJSaXBwbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZik7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgX29uTW91c2VMZWF2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9pc0hvdmVyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKTtcbiAgfTtcblxuICBwcml2YXRlIF9vbkZvY3VzID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2hvdyB0aGUgaG92ZXIgcmlwcGxlIG9uIHRvcCBvZiB0aGUgZm9jdXMgcmlwcGxlLlxuICAgIC8vIEhhcHBlbiB3aGVuIHRoZSB1c2VycyBjdXJzb3IgaXMgb3ZlciBhIHRodW1iIGFuZCB0aGVuIHRoZSB1c2VyIHRhYnMgdG8gaXQuXG4gICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZik7XG4gICAgdGhpcy5fc2hvd0ZvY3VzUmlwcGxlKCk7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWRjLXNsaWRlcl9fdGh1bWItLWZvY3VzZWQnKTtcbiAgfTtcblxuICBwcml2YXRlIF9vbkJsdXIgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gSGFwcGVucyB3aGVuIHRoZSB1c2VyIHRhYnMgYXdheSB3aGlsZSBzdGlsbCBkcmFnZ2luZyBhIHRodW1iLlxuICAgIGlmICghdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2hpZGVSaXBwbGUodGhpcy5fZm9jdXNSaXBwbGVSZWYpO1xuICAgIH1cbiAgICAvLyBIYXBwZW5zIHdoZW4gdGhlIHVzZXIgdGFicyBhd2F5IGZyb20gYSB0aHVtYiBidXQgdGhlaXIgY3Vyc29yIGlzIHN0aWxsIG92ZXIgaXQuXG4gICAgaWYgKHRoaXMuX2lzSG92ZXJlZCkge1xuICAgICAgdGhpcy5fc2hvd0hvdmVyUmlwcGxlKCk7XG4gICAgfVxuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21kYy1zbGlkZXJfX3RodW1iLS1mb2N1c2VkJyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25EcmFnU3RhcnQgPSAoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX3Nob3dBY3RpdmVSaXBwbGUoKTtcbiAgfTtcblxuICBwcml2YXRlIF9vbkRyYWdFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLl9oaWRlUmlwcGxlKHRoaXMuX2FjdGl2ZVJpcHBsZVJlZik7XG4gICAgLy8gSGFwcGVucyB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmFnZ2luZyBhIHRodW1iLCB0YWJzIGF3YXksIGFuZCB0aGVuIHN0b3BzIGRyYWdnaW5nLlxuICAgIGlmICghdGhpcy5fc2xpZGVySW5wdXQuX2lzRm9jdXNlZCkge1xuICAgICAgdGhpcy5faGlkZVJpcHBsZSh0aGlzLl9mb2N1c1JpcHBsZVJlZik7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBIYW5kbGVzIGRpc3BsYXlpbmcgdGhlIGhvdmVyIHJpcHBsZS4gKi9cbiAgcHJpdmF0ZSBfc2hvd0hvdmVyUmlwcGxlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2hvdmVyUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5faG92ZXJSaXBwbGVSZWYgPSB0aGlzLl9zaG93UmlwcGxlKHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9KTtcbiAgICAgIHRoaXMuX2hvdmVyUmlwcGxlUmVmPy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWhvdmVyLXJpcHBsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGRpc3BsYXlpbmcgdGhlIGZvY3VzIHJpcHBsZS4gKi9cbiAgcHJpdmF0ZSBfc2hvd0ZvY3VzUmlwcGxlKCk6IHZvaWQge1xuICAgIC8vIFNob3cgdGhlIGZvY3VzIHJpcHBsZSBldmVudCBpZiBub29wIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQuXG4gICAgaWYgKCF0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5fZm9jdXNSaXBwbGVSZWYpKSB7XG4gICAgICB0aGlzLl9mb2N1c1JpcHBsZVJlZiA9IHRoaXMuX3Nob3dSaXBwbGUoe2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0sIHRydWUpO1xuICAgICAgdGhpcy5fZm9jdXNSaXBwbGVSZWY/LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItZm9jdXMtcmlwcGxlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgZGlzcGxheWluZyB0aGUgYWN0aXZlIHJpcHBsZS4gKi9cbiAgcHJpdmF0ZSBfc2hvd0FjdGl2ZVJpcHBsZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9hY3RpdmVSaXBwbGVSZWYpKSB7XG4gICAgICB0aGlzLl9hY3RpdmVSaXBwbGVSZWYgPSB0aGlzLl9zaG93UmlwcGxlKHtlbnRlckR1cmF0aW9uOiAyMjUsIGV4aXREdXJhdGlvbjogNDAwfSk7XG4gICAgICB0aGlzLl9hY3RpdmVSaXBwbGVSZWY/LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItYWN0aXZlLXJpcHBsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiByaXBwbGVSZWYgaXMgY3VycmVudGx5IGZhZGluZyBpbiBvciB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9pc1Nob3dpbmdSaXBwbGUocmlwcGxlUmVmPzogUmlwcGxlUmVmKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHJpcHBsZVJlZj8uc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTiB8fCByaXBwbGVSZWY/LnN0YXRlID09PSBSaXBwbGVTdGF0ZS5WSVNJQkxFO1xuICB9XG5cbiAgLyoqIE1hbnVhbGx5IGxhdW5jaGVzIHRoZSBzbGlkZXIgdGh1bWIgcmlwcGxlIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmlwcGxlIGFuaW1hdGlvbiBjb25maWcuICovXG4gIHByaXZhdGUgX3Nob3dSaXBwbGUoXG4gICAgYW5pbWF0aW9uOiBSaXBwbGVBbmltYXRpb25Db25maWcsXG4gICAgaWdub3JlR2xvYmFsUmlwcGxlQ29uZmlnPzogYm9vbGVhbixcbiAgKTogUmlwcGxlUmVmIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3Nob3dWYWx1ZUluZGljYXRvcigpO1xuICAgIGlmICh0aGlzLl9zbGlkZXIuX2lzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLl9zbGlkZXIuX2dldFRodW1iKFxuICAgICAgICB0aGlzLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVCA/IF9NYXRUaHVtYi5FTkQgOiBfTWF0VGh1bWIuU1RBUlQsXG4gICAgICApO1xuICAgICAgc2libGluZy5fc2hvd1ZhbHVlSW5kaWNhdG9yKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zbGlkZXIuX2dsb2JhbFJpcHBsZU9wdGlvbnM/LmRpc2FibGVkICYmICFpZ25vcmVHbG9iYWxSaXBwbGVDb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JpcHBsZS5sYXVuY2goe1xuICAgICAgYW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX25vb3BBbmltYXRpb25zID8ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0gOiBhbmltYXRpb24sXG4gICAgICBjZW50ZXJlZDogdHJ1ZSxcbiAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmFkZXMgb3V0IHRoZSBnaXZlbiByaXBwbGUuXG4gICAqIEFsc28gaGlkZXMgdGhlIHZhbHVlIGluZGljYXRvciBpZiBubyByaXBwbGUgaXMgc2hvd2luZy5cbiAgICovXG4gIHByaXZhdGUgX2hpZGVSaXBwbGUocmlwcGxlUmVmPzogUmlwcGxlUmVmKTogdm9pZCB7XG4gICAgcmlwcGxlUmVmPy5mYWRlT3V0KCk7XG5cbiAgICBpZiAodGhpcy5faXNTaG93aW5nQW55UmlwcGxlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5faXNSYW5nZSkge1xuICAgICAgdGhpcy5faGlkZVZhbHVlSW5kaWNhdG9yKCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuX2dldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcuX2lzU2hvd2luZ0FueVJpcHBsZSgpKSB7XG4gICAgICB0aGlzLl9oaWRlVmFsdWVJbmRpY2F0b3IoKTtcbiAgICAgIHNpYmxpbmcuX2hpZGVWYWx1ZUluZGljYXRvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdmFsdWUgaW5kaWNhdG9yIHVpLiAqL1xuICBfc2hvd1ZhbHVlSW5kaWNhdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1zbGlkZXJfX3RodW1iLS13aXRoLWluZGljYXRvcicpO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdWkuICovXG4gIF9oaWRlVmFsdWVJbmRpY2F0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLXdpdGgtaW5kaWNhdG9yJyk7XG4gIH1cblxuICBfZ2V0U2libGluZygpOiBfTWF0U2xpZGVyVmlzdWFsVGh1bWIge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2dldFRodW1iKFxuICAgICAgdGhpcy50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlQgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJULFxuICAgICk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgaW5kaWNhdG9yIGNvbnRhaW5lcidzIG5hdGl2ZSBIVE1MIGVsZW1lbnQuICovXG4gIF9nZXRWYWx1ZUluZGljYXRvckNvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyPy5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hdGl2ZSBIVE1MIGVsZW1lbnQgb2YgdGhlIHNsaWRlciB0aHVtYiBrbm9iLiAqL1xuICBfZ2V0S25vYigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2tub2IubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIF9pc1Nob3dpbmdBbnlSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZikgfHxcbiAgICAgIHRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9mb2N1c1JpcHBsZVJlZikgfHxcbiAgICAgIHRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9hY3RpdmVSaXBwbGVSZWYpXG4gICAgKTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3ZhbHVlLWluZGljYXRvci1jb250YWluZXJcIiAqbmdJZj1cImRpc2NyZXRlXCIgI3ZhbHVlSW5kaWNhdG9yQ29udGFpbmVyPlxuICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdmFsdWUtaW5kaWNhdG9yXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJtZGMtc2xpZGVyX192YWx1ZS1pbmRpY2F0b3ItdGV4dFwiPnt7dmFsdWVJbmRpY2F0b3JUZXh0fX08L3NwYW4+XG4gIDwvZGl2PlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdGh1bWIta25vYlwiICNrbm9iPjwvZGl2PlxuPGRpdiBtYXRSaXBwbGUgY2xhc3M9XCJtYXQtbWRjLWZvY3VzLWluZGljYXRvclwiIFttYXRSaXBwbGVEaXNhYmxlZF09XCJ0cnVlXCI+PC9kaXY+XG4iXX0=