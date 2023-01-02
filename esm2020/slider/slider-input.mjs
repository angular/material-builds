/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_SLIDER_RANGE_THUMB, MAT_SLIDER_THUMB, MAT_SLIDER, } from './slider-interface';
import * as i0 from "@angular/core";
/**
 * Provider that allows the slider thumb to register as a ControlValueAccessor.
 * @docs-private
 */
export const MAT_SLIDER_THUMB_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatSliderThumb),
    multi: true,
};
/**
 * Provider that allows the range slider thumb to register as a ControlValueAccessor.
 * @docs-private
 */
export const MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatSliderRangeThumb),
    multi: true,
};
/**
 * Directive that adds slider-specific behaviors to an input element inside `<mat-slider>`.
 * Up to two may be placed inside of a `<mat-slider>`.
 *
 * If one is used, the selector `matSliderThumb` must be used, and the outcome will be a normal
 * slider. If two are used, the selectors `matSliderStartThumb` and `matSliderEndThumb` must be
 * used, and the outcome will be a range slider with two slider thumbs.
 */
export class MatSliderThumb {
    constructor(_ngZone, _elementRef, _cdr, _slider) {
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._cdr = _cdr;
        this._slider = _slider;
        /** Event emitted when the `value` is changed. */
        this.valueChange = new EventEmitter();
        /** Event emitted when the slider thumb starts being dragged. */
        this.dragStart = new EventEmitter();
        /** Event emitted when the slider thumb stops being dragged. */
        this.dragEnd = new EventEmitter();
        /**
         * Indicates whether this thumb is the start or end thumb.
         * @docs-private
         */
        this.thumbPosition = 2 /* _MatThumb.END */;
        /** The radius of a native html slider's knob. */
        this._knobRadius = 8;
        /** Whether user's cursor is currently in a mouse down state on the input. */
        this._isActive = false;
        /** Whether the input is currently focused (either by tab or after clicking). */
        this._isFocused = false;
        /**
         * Whether the initial value has been set.
         * This exists because the initial value cannot be immediately set because the min and max
         * must first be relayed from the parent MatSlider component, which can only happen later
         * in the component lifecycle.
         */
        this._hasSetInitialValue = false;
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /**
         * Indicates whether UI updates should be skipped.
         *
         * This flag is used to avoid flickering
         * when correcting values on pointer up/down.
         */
        this._skipUIUpdate = false;
        /** Callback called when the slider input value changes. */
        this._onChangeFn = () => { };
        /** Callback called when the slider input has been touched. */
        this._onTouchedFn = () => { };
        this._hostElement = _elementRef.nativeElement;
        this._ngZone.runOutsideAngular(() => {
            this._hostElement.addEventListener('pointerdown', this._onPointerDown.bind(this));
            this._hostElement.addEventListener('pointermove', this._onPointerMove.bind(this));
            this._hostElement.addEventListener('pointerup', this._onPointerUp.bind(this));
        });
    }
    get value() {
        return coerceNumberProperty(this._hostElement.value);
    }
    set value(v) {
        const val = coerceNumberProperty(v).toString();
        if (!this._hasSetInitialValue) {
            this._initialValue = val;
            return;
        }
        if (this._isActive) {
            return;
        }
        this._hostElement.value = val;
        this._updateThumbUIByValue();
        this._slider._onValueChange(this);
        this._cdr.detectChanges();
    }
    /**
     * The current translateX in px of the slider visual thumb.
     * @docs-private
     */
    get translateX() {
        if (this._slider.min >= this._slider.max) {
            this._translateX = 0;
            return this._translateX;
        }
        if (this._translateX === undefined) {
            this._translateX = this._calcTranslateXByValue();
        }
        return this._translateX;
    }
    set translateX(v) {
        this._translateX = v;
    }
    /** @docs-private */
    get min() {
        return coerceNumberProperty(this._hostElement.min);
    }
    set min(v) {
        this._hostElement.min = coerceNumberProperty(v).toString();
        this._cdr.detectChanges();
    }
    /** @docs-private */
    get max() {
        return coerceNumberProperty(this._hostElement.max);
    }
    set max(v) {
        this._hostElement.max = coerceNumberProperty(v).toString();
        this._cdr.detectChanges();
    }
    get step() {
        return coerceNumberProperty(this._hostElement.step);
    }
    set step(v) {
        this._hostElement.step = coerceNumberProperty(v).toString();
        this._cdr.detectChanges();
    }
    /** @docs-private */
    get disabled() {
        return coerceBooleanProperty(this._hostElement.disabled);
    }
    set disabled(v) {
        this._hostElement.disabled = coerceBooleanProperty(v);
        this._cdr.detectChanges();
        if (this._slider.disabled !== this.disabled) {
            this._slider.disabled = this.disabled;
        }
    }
    /** The percentage of the slider that coincides with the value. */
    get percentage() {
        if (this._slider.min >= this._slider.max) {
            return this._slider._isRtl ? 1 : 0;
        }
        return (this.value - this._slider.min) / (this._slider.max - this._slider.min);
    }
    /** @docs-private */
    get fillPercentage() {
        if (!this._slider._cachedWidth) {
            return this._slider._isRtl ? 1 : 0;
        }
        if (this._translateX === 0) {
            return 0;
        }
        return this.translateX / this._slider._cachedWidth;
    }
    /** Used to relay updates to _isFocused to the slider visual thumbs. */
    _setIsFocused(v) {
        this._isFocused = v;
    }
    ngOnDestroy() {
        this._hostElement.removeEventListener('pointerdown', this._onPointerDown);
        this._hostElement.removeEventListener('pointermove', this._onPointerMove);
        this._hostElement.removeEventListener('pointerup', this._onPointerUp);
        this._destroyed.next();
        this._destroyed.complete();
        this.dragStart.complete();
        this.dragEnd.complete();
    }
    /** @docs-private */
    initProps() {
        this._updateWidthInactive();
        // If this or the parent slider is disabled, just make everything disabled.
        if (this.disabled !== this._slider.disabled) {
            // The MatSlider setter for disabled will relay this and disable both inputs.
            this._slider.disabled = true;
        }
        this.step = this._slider.step;
        this.min = this._slider.min;
        this.max = this._slider.max;
        this._initValue();
    }
    /** @docs-private */
    initUI() {
        this._updateThumbUIByValue();
    }
    _initValue() {
        this._hasSetInitialValue = true;
        if (this._initialValue === undefined) {
            this.value = this._getDefaultValue();
        }
        else {
            this._hostElement.value = this._initialValue;
            this._updateThumbUIByValue();
            this._slider._onValueChange(this);
            this._cdr.detectChanges();
        }
    }
    _getDefaultValue() {
        return this.min;
    }
    _onBlur() {
        this._setIsFocused(false);
        this._onTouchedFn();
    }
    _onFocus() {
        this._setIsFocused(true);
    }
    _onChange() {
        // only used to handle the edge case where user
        // mousedown on the slider then uses arrow keys.
        if (this._isActive) {
            this._updateThumbUIByValue({ withAnimation: true });
        }
    }
    _onInput() {
        this.valueChange.emit(this.value);
        this._onChangeFn(this.value);
        // handles arrowing and updating the value when
        // a step is defined.
        if (this._slider.step || !this._isActive) {
            this._updateThumbUIByValue({ withAnimation: true });
        }
        this._slider._onValueChange(this);
    }
    _onNgControlValueChange() {
        // only used to handle when the value change
        // originates outside of the slider.
        if (!this._isActive || !this._isFocused) {
            this._slider._onValueChange(this);
            this._updateThumbUIByValue();
        }
        this._slider.disabled = this._formControl.disabled;
    }
    _onPointerDown(event) {
        if (this.disabled || event.button !== 0) {
            return;
        }
        this._isActive = true;
        this._setIsFocused(true);
        this._updateWidthActive();
        this._slider._updateDimensions();
        // Does nothing if a step is defined because we
        // want the value to snap to the values on input.
        if (!this._slider.step) {
            this._updateThumbUIByPointerEvent(event, { withAnimation: true });
        }
        if (!this.disabled) {
            this._handleValueCorrection(event);
            this.dragStart.emit({ source: this, parent: this._slider, value: this.value });
        }
    }
    /**
     * Corrects the value of the slider on pointer up/down.
     *
     * Called on pointer down and up because the value is set based
     * on the inactive width instead of the active width.
     */
    _handleValueCorrection(event) {
        // Don't update the UI with the current value! The value on pointerdown
        // and pointerup is calculated in the split second before the input(s)
        // resize. See _updateWidthInactive() and _updateWidthActive() for more
        // details.
        this._skipUIUpdate = true;
        // Note that this function gets triggered before the actual value of the
        // slider is updated. This means if we were to set the value here, it
        // would immediately be overwritten. Using setTimeout ensures the setting
        // of the value happens after the value has been updated by the
        // pointerdown event.
        setTimeout(() => {
            this._skipUIUpdate = false;
            this._fixValue(event);
        }, 0);
    }
    /** Corrects the value of the slider based on the pointer event's position. */
    _fixValue(event) {
        const xPos = event.clientX - this._slider._cachedLeft;
        const width = this._slider._cachedWidth;
        const step = this._slider.step === 0 ? 1 : this._slider.step;
        const numSteps = Math.floor((this._slider.max - this._slider.min) / step);
        const percentage = this._slider._isRtl ? 1 - xPos / width : xPos / width;
        // To ensure the percentage is rounded to the necessary number of decimals.
        const fixedPercentage = Math.round(percentage * numSteps) / numSteps;
        const impreciseValue = fixedPercentage * (this._slider.max - this._slider.min) + this._slider.min;
        const value = Math.round(impreciseValue / step) * step;
        const prevValue = this.value;
        if (value === prevValue) {
            // Because we prevented UI updates, if it turns out that the race
            // condition didn't happen and the value is already correct, we
            // have to apply the ui updates now.
            this._slider._onValueChange(this);
            this._slider.step > 0
                ? this._updateThumbUIByValue()
                : this._updateThumbUIByPointerEvent(event, { withAnimation: this._slider._hasAnimation });
            return;
        }
        this.value = value;
        this.valueChange.emit(this.value);
        this._onChangeFn(this.value);
        this._slider._onValueChange(this);
        this._slider.step > 0
            ? this._updateThumbUIByValue()
            : this._updateThumbUIByPointerEvent(event, { withAnimation: this._slider._hasAnimation });
    }
    _onPointerMove(event) {
        // Again, does nothing if a step is defined because
        // we want the value to snap to the values on input.
        if (!this._slider.step && this._isActive) {
            this._updateThumbUIByPointerEvent(event);
        }
    }
    _onPointerUp() {
        if (this._isActive) {
            this._isActive = false;
            this.dragEnd.emit({ source: this, parent: this._slider, value: this.value });
            setTimeout(() => this._updateWidthInactive());
        }
    }
    _clamp(v) {
        return Math.max(Math.min(v, this._slider._cachedWidth), 0);
    }
    _calcTranslateXByValue() {
        if (this._slider._isRtl) {
            return (1 - this.percentage) * this._slider._cachedWidth;
        }
        return this.percentage * this._slider._cachedWidth;
    }
    _calcTranslateXByPointerEvent(event) {
        return event.clientX - this._slider._cachedLeft;
    }
    /**
     * Used to set the slider width to the correct
     * dimensions while the user is dragging.
     */
    _updateWidthActive() {
        this._hostElement.style.padding = `0 ${this._slider._inputPadding}px`;
        this._hostElement.style.width = `calc(100% + ${this._slider._inputPadding}px)`;
    }
    /**
     * Sets the slider input to disproportionate dimensions to allow for touch
     * events to be captured on touch devices.
     */
    _updateWidthInactive() {
        this._hostElement.style.padding = '0px';
        this._hostElement.style.width = 'calc(100% + 48px)';
        this._hostElement.style.left = '-24px';
    }
    _updateThumbUIByValue(options) {
        this.translateX = this._clamp(this._calcTranslateXByValue());
        this._updateThumbUI(options);
    }
    _updateThumbUIByPointerEvent(event, options) {
        this.translateX = this._clamp(this._calcTranslateXByPointerEvent(event));
        this._updateThumbUI(options);
    }
    _updateThumbUI(options) {
        this._slider._setTransition(!!options?.withAnimation);
        this._slider._onTranslateXChange(this);
    }
    /**
     * Sets the input's value.
     * @param value The new value of the input
     * @docs-private
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * Registers a callback to be invoked when the input's value changes from user input.
     * @param fn The callback to register
     * @docs-private
     */
    registerOnChange(fn) {
        this._onChangeFn = fn;
    }
    /**
     * Registers a callback to be invoked when the input is blurred by the user.
     * @param fn The callback to register
     * @docs-private
     */
    registerOnTouched(fn) {
        this._onTouchedFn = fn;
    }
    /**
     * Sets the disabled state of the slider.
     * @param isDisabled The new disabled state
     * @docs-private
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    focus() {
        this._hostElement.focus();
    }
    blur() {
        this._hostElement.blur();
    }
}
MatSliderThumb.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatSliderThumb, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Directive });
MatSliderThumb.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: MatSliderThumb, selector: "input[matSliderThumb]", inputs: { value: "value" }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd" }, host: { attributes: { "type": "range" }, listeners: { "change": "_onChange()", "input": "_onInput()", "blur": "_onBlur()", "focus": "_onFocus()" }, properties: { "attr.aria-valuetext": "_valuetext" }, classAttribute: "mdc-slider__input" }, providers: [
        MAT_SLIDER_THUMB_VALUE_ACCESSOR,
        { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
    ], exportAs: ["matSliderThumb"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatSliderThumb, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matSliderThumb]',
                    exportAs: 'matSliderThumb',
                    host: {
                        'class': 'mdc-slider__input',
                        'type': 'range',
                        '[attr.aria-valuetext]': '_valuetext',
                        '(change)': '_onChange()',
                        '(input)': '_onInput()',
                        // TODO(wagnermaciel): Consider using a global event listener instead.
                        // Reason: I have found a semi-consistent way to mouse up without triggering this event.
                        '(blur)': '_onBlur()',
                        '(focus)': '_onFocus()',
                    },
                    providers: [
                        MAT_SLIDER_THUMB_VALUE_ACCESSOR,
                        { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }]; }, propDecorators: { value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }] } });
export class MatSliderRangeThumb extends MatSliderThumb {
    constructor(_ngZone, _slider, _elementRef, _cdr) {
        super(_ngZone, _elementRef, _cdr, _slider);
        this._cdr = _cdr;
        this._isEndThumb = this._hostElement.hasAttribute('matSliderEndThumb');
        this._setIsLeftThumb();
        this.thumbPosition = this._isEndThumb ? 2 /* _MatThumb.END */ : 1 /* _MatThumb.START */;
    }
    /** @docs-private */
    getSibling() {
        if (!this._sibling) {
            this._sibling = this._slider._getInput(this._isEndThumb ? 1 /* _MatThumb.START */ : 2 /* _MatThumb.END */);
        }
        return this._sibling;
    }
    /**
     * Returns the minimum translateX position allowed for this slider input's visual thumb.
     * @docs-private
     */
    getMinPos() {
        const sibling = this.getSibling();
        if (!this._isLeftThumb && sibling) {
            return sibling.translateX;
        }
        return 0;
    }
    /**
     * Returns the maximum translateX position allowed for this slider input's visual thumb.
     * @docs-private
     */
    getMaxPos() {
        const sibling = this.getSibling();
        if (this._isLeftThumb && sibling) {
            return sibling.translateX;
        }
        return this._slider._cachedWidth;
    }
    _setIsLeftThumb() {
        this._isLeftThumb =
            (this._isEndThumb && this._slider._isRtl) || (!this._isEndThumb && !this._slider._isRtl);
    }
    _getDefaultValue() {
        return this._isEndThumb && this._slider._isRange ? this.max : this.min;
    }
    _onInput() {
        super._onInput();
        this._updateSibling();
        if (!this._isActive) {
            this._updateWidthInactive();
        }
    }
    _onNgControlValueChange() {
        super._onNgControlValueChange();
        this.getSibling()?._updateMinMax();
    }
    _onPointerDown(event) {
        if (this.disabled) {
            return;
        }
        if (this._sibling) {
            this._sibling._updateWidthActive();
            this._sibling._hostElement.classList.add('mat-mdc-slider-input-no-pointer-events');
        }
        super._onPointerDown(event);
    }
    _onPointerUp() {
        super._onPointerUp();
        if (this._sibling) {
            setTimeout(() => {
                this._sibling._updateWidthInactive();
                this._sibling._hostElement.classList.remove('mat-mdc-slider-input-no-pointer-events');
            });
        }
    }
    _onPointerMove(event) {
        super._onPointerMove(event);
        if (!this._slider.step && this._isActive) {
            this._updateSibling();
        }
    }
    _fixValue(event) {
        super._fixValue(event);
        this._sibling?._updateMinMax();
    }
    _clamp(v) {
        return Math.max(Math.min(v, this.getMaxPos()), this.getMinPos());
    }
    _updateMinMax() {
        const sibling = this.getSibling();
        if (!sibling) {
            return;
        }
        if (this._isEndThumb) {
            this.min = Math.max(this._slider.min, sibling.value);
            this.max = this._slider.max;
        }
        else {
            this.min = this._slider.min;
            this.max = Math.min(this._slider.max, sibling.value);
        }
    }
    _updateWidthActive() {
        const minWidth = this._slider._rippleRadius * 2 - this._slider._inputPadding * 2;
        const maxWidth = this._slider._cachedWidth + this._slider._inputPadding - minWidth;
        const percentage = this._slider.min < this._slider.max
            ? (this.max - this.min) / (this._slider.max - this._slider.min)
            : 1;
        const width = maxWidth * percentage + minWidth;
        this._hostElement.style.width = `${width}px`;
        this._hostElement.style.padding = `0 ${this._slider._inputPadding}px`;
    }
    _updateWidthInactive() {
        const sibling = this.getSibling();
        if (!sibling) {
            return;
        }
        const maxWidth = this._slider._cachedWidth;
        const midValue = this._isEndThumb
            ? this.value - (this.value - sibling.value) / 2
            : this.value + (sibling.value - this.value) / 2;
        const _percentage = this._isEndThumb
            ? (this.max - midValue) / (this._slider.max - this._slider.min)
            : (midValue - this.min) / (this._slider.max - this._slider.min);
        const percentage = this._slider.min < this._slider.max ? _percentage : 1;
        const width = maxWidth * percentage + 24;
        this._hostElement.style.width = `${width}px`;
        this._hostElement.style.padding = '0px';
        if (this._isLeftThumb) {
            this._hostElement.style.left = '-24px';
            this._hostElement.style.right = 'auto';
        }
        else {
            this._hostElement.style.left = 'auto';
            this._hostElement.style.right = '-24px';
        }
    }
    _updateStaticStyles() {
        this._hostElement.classList.toggle('mat-slider__right-input', !this._isLeftThumb);
    }
    _updateSibling() {
        const sibling = this.getSibling();
        if (!sibling) {
            return;
        }
        sibling._updateMinMax();
        if (this._isActive) {
            sibling._updateWidthActive();
        }
        else {
            sibling._updateWidthInactive();
        }
    }
    /**
     * Sets the input's value.
     * @param value The new value of the input
     * @docs-private
     */
    writeValue(value) {
        this.value = value;
        this._updateWidthInactive();
        this._updateSibling();
    }
}
MatSliderRangeThumb.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatSliderRangeThumb, deps: [{ token: i0.NgZone }, { token: MAT_SLIDER }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
MatSliderRangeThumb.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: MatSliderRangeThumb, selector: "input[matSliderStartThumb], input[matSliderEndThumb]", providers: [
        MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
        { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
    ], exportAs: ["matSliderRangeThumb"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatSliderRangeThumb, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matSliderStartThumb], input[matSliderEndThumb]',
                    exportAs: 'matSliderRangeThumb',
                    providers: [
                        MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
                        { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFvQyxpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQU1MLHNCQUFzQixFQUN0QixnQkFBZ0IsRUFDaEIsVUFBVSxHQUNYLE1BQU0sb0JBQW9CLENBQUM7O0FBRTVCOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFRO0lBQ2xELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQVE7SUFDeEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBQ2xELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFvQkgsTUFBTSxPQUFPLGNBQWM7SUFvS3pCLFlBQ1csT0FBZSxFQUNmLFdBQXlDLEVBQ3pDLElBQXVCLEVBQ0YsT0FBbUI7UUFIeEMsWUFBTyxH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QUMsTUFBTSxDQUFDLHlCQUF5QixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFTyxjQUFjO1FBQ3BCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTztTQUNSO1FBQ0QsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztTQUM5QjthQUFNO1lBQ0wsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNNLFVBQVUsQ0FBQyxLQUFVO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDOztnSEFsTVUsbUJBQW1CLHdDQWlEcEIsVUFBVTtvR0FqRFQsbUJBQW1CLCtFQUxuQjtRQUNULHFDQUFxQztRQUNyQyxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUM7S0FDcEU7MkZBRVUsbUJBQW1CO2tCQVIvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzREFBc0Q7b0JBQ2hFLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFNBQVMsRUFBRTt3QkFDVCxxQ0FBcUM7d0JBQ3JDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcscUJBQXFCLEVBQUM7cUJBQ3BFO2lCQUNGOzswQkFrREksTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUNvbnRyb2wsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgX01hdFRodW1iLFxuICBNYXRTbGlkZXJEcmFnRXZlbnQsXG4gIF9NYXRTbGlkZXIsXG4gIF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICBfTWF0U2xpZGVyVGh1bWIsXG4gIE1BVF9TTElERVJfUkFOR0VfVEhVTUIsXG4gIE1BVF9TTElERVJfVEhVTUIsXG4gIE1BVF9TTElERVIsXG59IGZyb20gJy4vc2xpZGVyLWludGVyZmFjZSc7XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyVGh1bWIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHJhbmdlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyUmFuZ2VUaHVtYiksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIHNsaWRlci1zcGVjaWZpYyBiZWhhdmlvcnMgdG8gYW4gaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtc2xpZGVyPmAuXG4gKiBVcCB0byB0d28gbWF5IGJlIHBsYWNlZCBpbnNpZGUgb2YgYSBgPG1hdC1zbGlkZXI+YC5cbiAqXG4gKiBJZiBvbmUgaXMgdXNlZCwgdGhlIHNlbGVjdG9yIGBtYXRTbGlkZXJUaHVtYmAgbXVzdCBiZSB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIG5vcm1hbFxuICogc2xpZGVyLiBJZiB0d28gYXJlIHVzZWQsIHRoZSBzZWxlY3RvcnMgYG1hdFNsaWRlclN0YXJ0VGh1bWJgIGFuZCBgbWF0U2xpZGVyRW5kVGh1bWJgIG11c3QgYmVcbiAqIHVzZWQsIGFuZCB0aGUgb3V0Y29tZSB3aWxsIGJlIGEgcmFuZ2Ugc2xpZGVyIHdpdGggdHdvIHNsaWRlciB0aHVtYnMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclRodW1iXScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyVGh1bWInLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX2lucHV0JyxcbiAgICAndHlwZSc6ICdyYW5nZScsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWV0ZXh0XSc6ICdfdmFsdWV0ZXh0JyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCknLFxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogQ29uc2lkZXIgdXNpbmcgYSBnbG9iYWwgZXZlbnQgbGlzdGVuZXIgaW5zdGVhZC5cbiAgICAvLyBSZWFzb246IEkgaGF2ZSBmb3VuZCBhIHNlbWktY29uc2lzdGVudCB3YXkgdG8gbW91c2UgdXAgd2l0aG91dCB0cmlnZ2VyaW5nIHRoaXMgZXZlbnQuXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyVGh1bWJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJUaHVtYiwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSk7XG4gIH1cbiAgc2V0IHZhbHVlKHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgdmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2hhc1NldEluaXRpYWxWYWx1ZSkge1xuICAgICAgdGhpcy5faW5pdGlhbFZhbHVlID0gdmFsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSB2YWw7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBgdmFsdWVgIGlzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RhcnRzIGJlaW5nIGRyYWdnZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RvcHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdFbmQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdHJhbnNsYXRlWCBpbiBweCBvZiB0aGUgc2xpZGVyIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHRyYW5zbGF0ZVgoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLm1pbiA+PSB0aGlzLl9zbGlkZXIubWF4KSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gMDtcbiAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGVYO1xuICAgIH1cbiAgICBpZiAodGhpcy5fdHJhbnNsYXRlWCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gdGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGVYO1xuICB9XG4gIHNldCB0cmFuc2xhdGVYKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3RyYW5zbGF0ZVggPSB2O1xuICB9XG4gIHByaXZhdGUgX3RyYW5zbGF0ZVg6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyB0aHVtYiBpcyB0aGUgc3RhcnQgb3IgZW5kIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWIgPSBfTWF0VGh1bWIuRU5EO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQubWluKTtcbiAgfVxuICBzZXQgbWluKHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5tYXgpO1xuICB9XG4gIHNldCBtYXgodjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5tYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KS50b1N0cmluZygpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBnZXQgc3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5zdGVwKTtcbiAgfVxuICBzZXQgc3RlcCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KS50b1N0cmluZygpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmRpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5fc2xpZGVyLmRpc2FibGVkICE9PSB0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudGFnZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIubWluID49IHRoaXMuX3NsaWRlci5tYXgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2lzUnRsID8gMSA6IDA7XG4gICAgfVxuICAgIHJldHVybiAodGhpcy52YWx1ZSAtIHRoaXMuX3NsaWRlci5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBmaWxsUGVyY2VudGFnZSgpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIDogMDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RyYW5zbGF0ZVggPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVYIC8gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgfVxuXG4gIC8qKiBUaGUgaG9zdCBuYXRpdmUgSFRNTCBpbnB1dCBlbGVtZW50LiAqL1xuICBfaG9zdEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgLyoqIFRoZSBhcmlhLXZhbHVldGV4dCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGlucHV0J3MgdmFsdWUuICovXG4gIF92YWx1ZXRleHQ6IHN0cmluZztcblxuICAvKiogVGhlIHJhZGl1cyBvZiBhIG5hdGl2ZSBodG1sIHNsaWRlcidzIGtub2IuICovXG4gIF9rbm9iUmFkaXVzOiBudW1iZXIgPSA4O1xuXG4gIC8qKiBXaGV0aGVyIHVzZXIncyBjdXJzb3IgaXMgY3VycmVudGx5IGluIGEgbW91c2UgZG93biBzdGF0ZSBvbiB0aGUgaW5wdXQuICovXG4gIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBjdXJyZW50bHkgZm9jdXNlZCAoZWl0aGVyIGJ5IHRhYiBvciBhZnRlciBjbGlja2luZykuICovXG4gIF9pc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVXNlZCB0byByZWxheSB1cGRhdGVzIHRvIF9pc0ZvY3VzZWQgdG8gdGhlIHNsaWRlciB2aXN1YWwgdGh1bWJzLiAqL1xuICBwcml2YXRlIF9zZXRJc0ZvY3VzZWQodjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX2lzRm9jdXNlZCA9IHY7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaW5pdGlhbCB2YWx1ZSBoYXMgYmVlbiBzZXQuXG4gICAqIFRoaXMgZXhpc3RzIGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2Fubm90IGJlIGltbWVkaWF0ZWx5IHNldCBiZWNhdXNlIHRoZSBtaW4gYW5kIG1heFxuICAgKiBtdXN0IGZpcnN0IGJlIHJlbGF5ZWQgZnJvbSB0aGUgcGFyZW50IE1hdFNsaWRlciBjb21wb25lbnQsIHdoaWNoIGNhbiBvbmx5IGhhcHBlbiBsYXRlclxuICAgKiBpbiB0aGUgY29tcG9uZW50IGxpZmVjeWNsZS5cbiAgICovXG4gIHByaXZhdGUgX2hhc1NldEluaXRpYWxWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc3RvcmVkIGluaXRpYWwgdmFsdWUuICovXG4gIF9pbml0aWFsVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKiogRGVmaW5lZCB3aGVuIGEgdXNlciBpcyB1c2luZyBhIGZvcm0gY29udHJvbCB0byBtYW5hZ2Ugc2xpZGVyIHZhbHVlICYgdmFsaWRhdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIFVJIHVwZGF0ZXMgc2hvdWxkIGJlIHNraXBwZWQuXG4gICAqXG4gICAqIFRoaXMgZmxhZyBpcyB1c2VkIHRvIGF2b2lkIGZsaWNrZXJpbmdcbiAgICogd2hlbiBjb3JyZWN0aW5nIHZhbHVlcyBvbiBwb2ludGVyIHVwL2Rvd24uXG4gICAqL1xuICBfc2tpcFVJVXBkYXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBzbGlkZXIgaW5wdXQgdmFsdWUgY2hhbmdlcy4gKi9cbiAgcHJpdmF0ZSBfb25DaGFuZ2VGbjogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHNsaWRlciBpbnB1dCBoYXMgYmVlbiB0b3VjaGVkLiAqL1xuICBwcml2YXRlIF9vblRvdWNoZWRGbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICByZWFkb25seSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIHByb3RlY3RlZCBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICApIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25Qb2ludGVyRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vblBvaW50ZXJEb3duKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZHJhZ1N0YXJ0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kcmFnRW5kLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBpbml0UHJvcHMoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgLy8gSWYgdGhpcyBvciB0aGUgcGFyZW50IHNsaWRlciBpcyBkaXNhYmxlZCwganVzdCBtYWtlIGV2ZXJ5dGhpbmcgZGlzYWJsZWQuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgIT09IHRoaXMuX3NsaWRlci5kaXNhYmxlZCkge1xuICAgICAgLy8gVGhlIE1hdFNsaWRlciBzZXR0ZXIgZm9yIGRpc2FibGVkIHdpbGwgcmVsYXkgdGhpcyBhbmQgZGlzYWJsZSBib3RoIGlucHV0cy5cbiAgICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwID0gdGhpcy5fc2xpZGVyLnN0ZXA7XG4gICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGluaXRVSSgpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgX2luaXRWYWx1ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNTZXRJbml0aWFsVmFsdWUgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9pbml0aWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldERlZmF1bHRWYWx1ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSA9IHRoaXMuX2luaXRpYWxWYWx1ZTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXREZWZhdWx0VmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5taW47XG4gIH1cblxuICBfb25CbHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZChmYWxzZSk7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4oKTtcbiAgfVxuXG4gIF9vbkZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpOiB2b2lkIHtcbiAgICAvLyBvbmx5IHVzZWQgdG8gaGFuZGxlIHRoZSBlZGdlIGNhc2Ugd2hlcmUgdXNlclxuICAgIC8vIG1vdXNlZG93biBvbiB0aGUgc2xpZGVyIHRoZW4gdXNlcyBhcnJvdyBrZXlzLlxuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoe3dpdGhBbmltYXRpb246IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCgpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fb25DaGFuZ2VGbih0aGlzLnZhbHVlKTtcbiAgICAvLyBoYW5kbGVzIGFycm93aW5nIGFuZCB1cGRhdGluZyB0aGUgdmFsdWUgd2hlblxuICAgIC8vIGEgc3RlcCBpcyBkZWZpbmVkLlxuICAgIGlmICh0aGlzLl9zbGlkZXIuc3RlcCB8fCAhdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgfVxuXG4gIF9vbk5nQ29udHJvbFZhbHVlQ2hhbmdlKCk6IHZvaWQge1xuICAgIC8vIG9ubHkgdXNlZCB0byBoYW5kbGUgd2hlbiB0aGUgdmFsdWUgY2hhbmdlXG4gICAgLy8gb3JpZ2luYXRlcyBvdXRzaWRlIG9mIHRoZSBzbGlkZXIuXG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSB8fCAhdGhpcy5faXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0aGlzLl9mb3JtQ29udHJvbCEuZGlzYWJsZWQ7XG4gIH1cblxuICBfb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgICB0aGlzLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgIHRoaXMuX3NsaWRlci5fdXBkYXRlRGltZW5zaW9ucygpO1xuXG4gICAgLy8gRG9lcyBub3RoaW5nIGlmIGEgc3RlcCBpcyBkZWZpbmVkIGJlY2F1c2Ugd2VcbiAgICAvLyB3YW50IHRoZSB2YWx1ZSB0byBzbmFwIHRvIHRoZSB2YWx1ZXMgb24gaW5wdXQuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5faGFuZGxlVmFsdWVDb3JyZWN0aW9uKGV2ZW50KTtcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoe3NvdXJjZTogdGhpcywgcGFyZW50OiB0aGlzLl9zbGlkZXIsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIG9uIHBvaW50ZXIgdXAvZG93bi5cbiAgICpcbiAgICogQ2FsbGVkIG9uIHBvaW50ZXIgZG93biBhbmQgdXAgYmVjYXVzZSB0aGUgdmFsdWUgaXMgc2V0IGJhc2VkXG4gICAqIG9uIHRoZSBpbmFjdGl2ZSB3aWR0aCBpbnN0ZWFkIG9mIHRoZSBhY3RpdmUgd2lkdGguXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVWYWx1ZUNvcnJlY3Rpb24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgVUkgd2l0aCB0aGUgY3VycmVudCB2YWx1ZSEgVGhlIHZhbHVlIG9uIHBvaW50ZXJkb3duXG4gICAgLy8gYW5kIHBvaW50ZXJ1cCBpcyBjYWxjdWxhdGVkIGluIHRoZSBzcGxpdCBzZWNvbmQgYmVmb3JlIHRoZSBpbnB1dChzKVxuICAgIC8vIHJlc2l6ZS4gU2VlIF91cGRhdGVXaWR0aEluYWN0aXZlKCkgYW5kIF91cGRhdGVXaWR0aEFjdGl2ZSgpIGZvciBtb3JlXG4gICAgLy8gZGV0YWlscy5cbiAgICB0aGlzLl9za2lwVUlVcGRhdGUgPSB0cnVlO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZ2V0cyB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlXG4gICAgLy8gc2xpZGVyIGlzIHVwZGF0ZWQuIFRoaXMgbWVhbnMgaWYgd2Ugd2VyZSB0byBzZXQgdGhlIHZhbHVlIGhlcmUsIGl0XG4gICAgLy8gd291bGQgaW1tZWRpYXRlbHkgYmUgb3ZlcndyaXR0ZW4uIFVzaW5nIHNldFRpbWVvdXQgZW5zdXJlcyB0aGUgc2V0dGluZ1xuICAgIC8vIG9mIHRoZSB2YWx1ZSBoYXBwZW5zIGFmdGVyIHRoZSB2YWx1ZSBoYXMgYmVlbiB1cGRhdGVkIGJ5IHRoZVxuICAgIC8vIHBvaW50ZXJkb3duIGV2ZW50LlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2tpcFVJVXBkYXRlID0gZmFsc2U7XG4gICAgICB0aGlzLl9maXhWYWx1ZShldmVudCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKiogQ29ycmVjdHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgYmFzZWQgb24gdGhlIHBvaW50ZXIgZXZlbnQncyBwb3NpdGlvbi4gKi9cbiAgX2ZpeFZhbHVlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB4UG9zID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuX3NsaWRlci5fY2FjaGVkTGVmdDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgY29uc3Qgc3RlcCA9IHRoaXMuX3NsaWRlci5zdGVwID09PSAwID8gMSA6IHRoaXMuX3NsaWRlci5zdGVwO1xuICAgIGNvbnN0IG51bVN0ZXBzID0gTWF0aC5mbG9vcigodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pIC8gc3RlcCk7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIC0geFBvcyAvIHdpZHRoIDogeFBvcyAvIHdpZHRoO1xuXG4gICAgLy8gVG8gZW5zdXJlIHRoZSBwZXJjZW50YWdlIGlzIHJvdW5kZWQgdG8gdGhlIG5lY2Vzc2FyeSBudW1iZXIgb2YgZGVjaW1hbHMuXG4gICAgY29uc3QgZml4ZWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZChwZXJjZW50YWdlICogbnVtU3RlcHMpIC8gbnVtU3RlcHM7XG5cbiAgICBjb25zdCBpbXByZWNpc2VWYWx1ZSA9XG4gICAgICBmaXhlZFBlcmNlbnRhZ2UgKiAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pICsgdGhpcy5fc2xpZGVyLm1pbjtcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGgucm91bmQoaW1wcmVjaXNlVmFsdWUgLyBzdGVwKSAqIHN0ZXA7XG4gICAgY29uc3QgcHJldlZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gcHJldlZhbHVlKSB7XG4gICAgICAvLyBCZWNhdXNlIHdlIHByZXZlbnRlZCBVSSB1cGRhdGVzLCBpZiBpdCB0dXJucyBvdXQgdGhhdCB0aGUgcmFjZVxuICAgICAgLy8gY29uZGl0aW9uIGRpZG4ndCBoYXBwZW4gYW5kIHRoZSB2YWx1ZSBpcyBhbHJlYWR5IGNvcnJlY3QsIHdlXG4gICAgICAvLyBoYXZlIHRvIGFwcGx5IHRoZSB1aSB1cGRhdGVzIG5vdy5cbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3NsaWRlci5zdGVwID4gMFxuICAgICAgICA/IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKClcbiAgICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fb25DaGFuZ2VGbih0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fc2xpZGVyLnN0ZXAgPiAwXG4gICAgICA/IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKClcbiAgICAgIDogdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdGhpcy5fc2xpZGVyLl9oYXNBbmltYXRpb259KTtcbiAgfVxuXG4gIF9vblBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBBZ2FpbiwgZG9lcyBub3RoaW5nIGlmIGEgc3RlcCBpcyBkZWZpbmVkIGJlY2F1c2VcbiAgICAvLyB3ZSB3YW50IHRoZSB2YWx1ZSB0byBzbmFwIHRvIHRoZSB2YWx1ZXMgb24gaW5wdXQuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCAmJiB0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBfb25Qb2ludGVyVXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoe3NvdXJjZTogdGhpcywgcGFyZW50OiB0aGlzLl9zbGlkZXIsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKSk7XG4gICAgfVxuICB9XG5cbiAgX2NsYW1wKHY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGgpLCAwKTtcbiAgfVxuXG4gIF9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLl9pc1J0bCkge1xuICAgICAgcmV0dXJuICgxIC0gdGhpcy5wZXJjZW50YWdlKSAqIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBlcmNlbnRhZ2UgKiB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICB9XG5cbiAgX2NhbGNUcmFuc2xhdGVYQnlQb2ludGVyRXZlbnQoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGV2ZW50LmNsaWVudFggLSB0aGlzLl9zbGlkZXIuX2NhY2hlZExlZnQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBzZXQgdGhlIHNsaWRlciB3aWR0aCB0byB0aGUgY29ycmVjdFxuICAgKiBkaW1lbnNpb25zIHdoaWxlIHRoZSB1c2VyIGlzIGRyYWdnaW5nLlxuICAgKi9cbiAgX3VwZGF0ZVdpZHRoQWN0aXZlKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBgMCAke3RoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nfXB4YDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgKyAke3RoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nfXB4KWA7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2xpZGVyIGlucHV0IHRvIGRpc3Byb3BvcnRpb25hdGUgZGltZW5zaW9ucyB0byBhbGxvdyBmb3IgdG91Y2hcbiAgICogZXZlbnRzIHRvIGJlIGNhcHR1cmVkIG9uIHRvdWNoIGRldmljZXMuXG4gICAqL1xuICBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzBweCc7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSAnY2FsYygxMDAlICsgNDhweCknO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSAnLTI0cHgnO1xuICB9XG5cbiAgX3VwZGF0ZVRodW1iVUlCeVZhbHVlKG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVggPSB0aGlzLl9jbGFtcCh0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKSk7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSShvcHRpb25zKTtcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQ6IFBvaW50ZXJFdmVudCwgb3B0aW9ucz86IHt3aXRoQW5pbWF0aW9uOiBib29sZWFufSk6IHZvaWQge1xuICAgIHRoaXMudHJhbnNsYXRlWCA9IHRoaXMuX2NsYW1wKHRoaXMuX2NhbGNUcmFuc2xhdGVYQnlQb2ludGVyRXZlbnQoZXZlbnQpKTtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJKG9wdGlvbnMpO1xuICB9XG5cbiAgX3VwZGF0ZVRodW1iVUkob3B0aW9ucz86IHt3aXRoQW5pbWF0aW9uOiBib29sZWFufSkge1xuICAgIHRoaXMuX3NsaWRlci5fc2V0VHJhbnNpdGlvbighIW9wdGlvbnM/LndpdGhBbmltYXRpb24pO1xuICAgIHRoaXMuX3NsaWRlci5fb25UcmFuc2xhdGVYQ2hhbmdlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGlucHV0J3MgdmFsdWUuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBpbnB1dFxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBpbnB1dCdzIHZhbHVlIGNoYW5nZXMgZnJvbSB1c2VyIGlucHV0LlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIHRvIHJlZ2lzdGVyXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWQgYnkgdGhlIHVzZXIuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXJcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZEZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIHNsaWRlci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIG5ldyBkaXNhYmxlZCBzdGF0ZVxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBibHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmJsdXIoKTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTbGlkZXJTdGFydFRodW1iXSwgaW5wdXRbbWF0U2xpZGVyRW5kVGh1bWJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXJSYW5nZVRodW1iJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX1NMSURFUl9SQU5HRV9USFVNQiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlclJhbmdlVGh1bWJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJSYW5nZVRodW1iIGV4dGVuZHMgTWF0U2xpZGVyVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyUmFuZ2VUaHVtYiB7XG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldFNpYmxpbmcoKTogX01hdFNsaWRlclJhbmdlVGh1bWIgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fc2libGluZykge1xuICAgICAgdGhpcy5fc2libGluZyA9IHRoaXMuX3NsaWRlci5fZ2V0SW5wdXQodGhpcy5faXNFbmRUaHVtYiA/IF9NYXRUaHVtYi5TVEFSVCA6IF9NYXRUaHVtYi5FTkQpIGFzXG4gICAgICAgIHwgTWF0U2xpZGVyUmFuZ2VUaHVtYlxuICAgICAgICB8IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NpYmxpbmc7XG4gIH1cbiAgcHJpdmF0ZSBfc2libGluZzogTWF0U2xpZGVyUmFuZ2VUaHVtYiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWluaW11bSB0cmFuc2xhdGVYIHBvc2l0aW9uIGFsbG93ZWQgZm9yIHRoaXMgc2xpZGVyIGlucHV0J3MgdmlzdWFsIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRNaW5Qb3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCF0aGlzLl9pc0xlZnRUaHVtYiAmJiBzaWJsaW5nKSB7XG4gICAgICByZXR1cm4gc2libGluZy50cmFuc2xhdGVYO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1heFBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAodGhpcy5faXNMZWZ0VGh1bWIgJiYgc2libGluZykge1xuICAgICAgcmV0dXJuIHNpYmxpbmcudHJhbnNsYXRlWDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICBfc2V0SXNMZWZ0VGh1bWIoKTogdm9pZCB7XG4gICAgdGhpcy5faXNMZWZ0VGh1bWIgPVxuICAgICAgKHRoaXMuX2lzRW5kVGh1bWIgJiYgdGhpcy5fc2xpZGVyLl9pc1J0bCkgfHwgKCF0aGlzLl9pc0VuZFRodW1iICYmICF0aGlzLl9zbGlkZXIuX2lzUnRsKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgc2xpZGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBpbnB1dCBvbiB0aGUgbGVmdCBoYW5kIHNpZGUuICovXG4gIF9pc0xlZnRUaHVtYjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGlzIHNsaWRlciBjb3JyZXNwb25kcyB0byB0aGUgaW5wdXQgd2l0aCBncmVhdGVyIHZhbHVlLiAqL1xuICBfaXNFbmRUaHVtYjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfU0xJREVSKSBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICAgIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIG92ZXJyaWRlIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHtcbiAgICBzdXBlcihfbmdab25lLCBfZWxlbWVudFJlZiwgX2NkciwgX3NsaWRlcik7XG4gICAgdGhpcy5faXNFbmRUaHVtYiA9IHRoaXMuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyRW5kVGh1bWInKTtcbiAgICB0aGlzLl9zZXRJc0xlZnRUaHVtYigpO1xuICAgIHRoaXMudGh1bWJQb3NpdGlvbiA9IHRoaXMuX2lzRW5kVGh1bWIgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJUO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2dldERlZmF1bHRWYWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pc0VuZFRodW1iICYmIHRoaXMuX3NsaWRlci5faXNSYW5nZSA/IHRoaXMubWF4IDogdGhpcy5taW47XG4gIH1cblxuICBvdmVycmlkZSBfb25JbnB1dCgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25JbnB1dCgpO1xuICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTogdm9pZCB7XG4gICAgc3VwZXIuX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTtcbiAgICB0aGlzLmdldFNpYmxpbmcoKT8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlckRvd24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgICAgdGhpcy5fc2libGluZy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItaW5wdXQtbm8tcG9pbnRlci1ldmVudHMnKTtcbiAgICB9XG4gICAgc3VwZXIuX29uUG9pbnRlckRvd24oZXZlbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlclVwKCk6IHZvaWQge1xuICAgIHN1cGVyLl9vblBvaW50ZXJVcCgpO1xuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21hdC1tZGMtc2xpZGVyLWlucHV0LW5vLXBvaW50ZXItZXZlbnRzJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIuX29uUG9pbnRlck1vdmUoZXZlbnQpO1xuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXAgJiYgdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfZml4VmFsdWUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLl9maXhWYWx1ZShldmVudCk7XG4gICAgdGhpcy5fc2libGluZz8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2NsYW1wKHY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIHRoaXMuZ2V0TWF4UG9zKCkpLCB0aGlzLmdldE1pblBvcygpKTtcbiAgfVxuXG4gIF91cGRhdGVNaW5NYXgoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNFbmRUaHVtYikge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1heCh0aGlzLl9zbGlkZXIubWluLCBzaWJsaW5nLnZhbHVlKTtcbiAgICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1pbih0aGlzLl9zbGlkZXIubWF4LCBzaWJsaW5nLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhBY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3QgbWluV2lkdGggPSB0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cyAqIDIgLSB0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZyAqIDI7XG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoICsgdGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmcgLSBtaW5XaWR0aDtcbiAgICBjb25zdCBwZXJjZW50YWdlID1cbiAgICAgIHRoaXMuX3NsaWRlci5taW4gPCB0aGlzLl9zbGlkZXIubWF4XG4gICAgICAgID8gKHRoaXMubWF4IC0gdGhpcy5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKVxuICAgICAgICA6IDE7XG4gICAgY29uc3Qgd2lkdGggPSBtYXhXaWR0aCAqIHBlcmNlbnRhZ2UgKyBtaW5XaWR0aDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYDAgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weGA7XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICBjb25zdCBtaWRWYWx1ZSA9IHRoaXMuX2lzRW5kVGh1bWJcbiAgICAgID8gdGhpcy52YWx1ZSAtICh0aGlzLnZhbHVlIC0gc2libGluZy52YWx1ZSkgLyAyXG4gICAgICA6IHRoaXMudmFsdWUgKyAoc2libGluZy52YWx1ZSAtIHRoaXMudmFsdWUpIC8gMjtcblxuICAgIGNvbnN0IF9wZXJjZW50YWdlID0gdGhpcy5faXNFbmRUaHVtYlxuICAgICAgPyAodGhpcy5tYXggLSBtaWRWYWx1ZSkgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pXG4gICAgICA6IChtaWRWYWx1ZSAtIHRoaXMubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbik7XG5cbiAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5fc2xpZGVyLm1pbiA8IHRoaXMuX3NsaWRlci5tYXggPyBfcGVyY2VudGFnZSA6IDE7XG5cbiAgICBjb25zdCB3aWR0aCA9IG1heFdpZHRoICogcGVyY2VudGFnZSArIDI0O1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnMHB4JztcblxuICAgIGlmICh0aGlzLl9pc0xlZnRUaHVtYikge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICctMjRweCc7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJy0yNHB4JztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlU3RhdGljU3R5bGVzKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21hdC1zbGlkZXJfX3JpZ2h0LWlucHV0JywgIXRoaXMuX2lzTGVmdFRodW1iKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVNpYmxpbmcoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaWJsaW5nLl91cGRhdGVNaW5NYXgoKTtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHNpYmxpbmcuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpYmxpbmcuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW5wdXQncyB2YWx1ZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG92ZXJyaWRlIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICB9XG59XG4iXX0=