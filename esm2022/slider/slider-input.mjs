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
class MatSliderThumb {
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
        /** Callback called when the slider input has been touched. */
        this._onTouchedFn = () => { };
        /**
         * Whether the NgModel has been initialized.
         *
         * This flag is used to ignore ghost null calls to
         * writeValue which can break slider initialization.
         *
         * See https://github.com/angular/angular/issues/14988.
         */
        this._isControlInitialized = false;
        this._hostElement = _elementRef.nativeElement;
        this._ngZone.runOutsideAngular(() => {
            this._hostElement.addEventListener('pointerdown', this._onPointerDown.bind(this));
            this._hostElement.addEventListener('pointermove', this._onPointerMove.bind(this));
            this._hostElement.addEventListener('pointerup', this._onPointerUp.bind(this));
        });
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
        this.valueChange.emit(this.value);
        // only used to handle the edge case where user
        // mousedown on the slider then uses arrow keys.
        if (this._isActive) {
            this._updateThumbUIByValue({ withAnimation: true });
        }
    }
    _onInput() {
        this._onChangeFn?.(this.value);
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
        this._onChangeFn?.(this.value);
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
        if (this._isControlInitialized || value !== null) {
            this.value = value;
        }
    }
    /**
     * Registers a callback to be invoked when the input's value changes from user input.
     * @param fn The callback to register
     * @docs-private
     */
    registerOnChange(fn) {
        this._onChangeFn = fn;
        this._isControlInitialized = true;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderThumb, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatSliderThumb, selector: "input[matSliderThumb]", inputs: { value: "value" }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd" }, host: { attributes: { "type": "range" }, listeners: { "change": "_onChange()", "input": "_onInput()", "blur": "_onBlur()", "focus": "_onFocus()" }, properties: { "attr.aria-valuetext": "_valuetext" }, classAttribute: "mdc-slider__input" }, providers: [
            MAT_SLIDER_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
        ], exportAs: ["matSliderThumb"], ngImport: i0 }); }
}
export { MatSliderThumb };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderThumb, decorators: [{
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
class MatSliderRangeThumb extends MatSliderThumb {
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
    constructor(_ngZone, _slider, _elementRef, _cdr) {
        super(_ngZone, _elementRef, _cdr, _slider);
        this._cdr = _cdr;
        this._isEndThumb = this._hostElement.hasAttribute('matSliderEndThumb');
        this._setIsLeftThumb();
        this.thumbPosition = this._isEndThumb ? 2 /* _MatThumb.END */ : 1 /* _MatThumb.START */;
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
        if (this.disabled || event.button !== 0) {
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
        if (this._isControlInitialized || value !== null) {
            this.value = value;
            this._updateWidthInactive();
            this._updateSibling();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderRangeThumb, deps: [{ token: i0.NgZone }, { token: MAT_SLIDER }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatSliderRangeThumb, selector: "input[matSliderStartThumb], input[matSliderEndThumb]", providers: [
            MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
        ], exportAs: ["matSliderRangeThumb"], usesInheritance: true, ngImport: i0 }); }
}
export { MatSliderRangeThumb };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderRangeThumb, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFvQyxpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQU1MLHNCQUFzQixFQUN0QixnQkFBZ0IsRUFDaEIsVUFBVSxHQUNYLE1BQU0sb0JBQW9CLENBQUM7O0FBRTVCOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFRO0lBQ2xELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQVE7SUFDeEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBQ2xELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxNQW1CYSxjQUFjO0lBQ3pCLElBQ0ksS0FBSztRQUNQLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMs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RSxzQkFBc0IsRUFBRSxXQUFXLHFCQUFxQixFQUFDO3FCQUNwRTtpQkFDRjs7MEJBa0RJLE1BQU07MkJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIEZvcm1Db250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgTWF0U2xpZGVyRHJhZ0V2ZW50LFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgX01hdFNsaWRlclRodW1iLFxuICBNQVRfU0xJREVSX1JBTkdFX1RIVU1CLFxuICBNQVRfU0xJREVSX1RIVU1CLFxuICBNQVRfU0xJREVSLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSBzbGlkZXIgdGh1bWIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfVEhVTUJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlclRodW1iKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSByYW5nZSBzbGlkZXIgdGh1bWIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfUkFOR0VfVEhVTUJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlclJhbmdlVGh1bWIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogRGlyZWN0aXZlIHRoYXQgYWRkcyBzbGlkZXItc3BlY2lmaWMgYmVoYXZpb3JzIHRvIGFuIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LXNsaWRlcj5gLlxuICogVXAgdG8gdHdvIG1heSBiZSBwbGFjZWQgaW5zaWRlIG9mIGEgYDxtYXQtc2xpZGVyPmAuXG4gKlxuICogSWYgb25lIGlzIHVzZWQsIHRoZSBzZWxlY3RvciBgbWF0U2xpZGVyVGh1bWJgIG11c3QgYmUgdXNlZCwgYW5kIHRoZSBvdXRjb21lIHdpbGwgYmUgYSBub3JtYWxcbiAqIHNsaWRlci4gSWYgdHdvIGFyZSB1c2VkLCB0aGUgc2VsZWN0b3JzIGBtYXRTbGlkZXJTdGFydFRodW1iYCBhbmQgYG1hdFNsaWRlckVuZFRodW1iYCBtdXN0IGJlXG4gKiB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIHJhbmdlIHNsaWRlciB3aXRoIHR3byBzbGlkZXIgdGh1bWJzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTbGlkZXJUaHVtYl0nLFxuICBleHBvcnRBczogJ21hdFNsaWRlclRodW1iJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtc2xpZGVyX19pbnB1dCcsXG4gICAgJ3R5cGUnOiAncmFuZ2UnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVldGV4dF0nOiAnX3ZhbHVldGV4dCcsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IENvbnNpZGVyIHVzaW5nIGEgZ2xvYmFsIGV2ZW50IGxpc3RlbmVyIGluc3RlYWQuXG4gICAgLy8gUmVhc29uOiBJIGhhdmUgZm91bmQgYSBzZW1pLWNvbnNpc3RlbnQgd2F5IHRvIG1vdXNlIHVwIHdpdGhvdXQgdHJpZ2dlcmluZyB0aGlzIGV2ZW50LlxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1NMSURFUl9USFVNQl9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX1NMSURFUl9USFVNQiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlclRodW1ifSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyVGh1bWIsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQudmFsdWUpO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBOdW1iZXJJbnB1dCkge1xuICAgIGNvbnN0IHZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYpLnRvU3RyaW5nKCk7XG4gICAgaWYgKCF0aGlzLl9oYXNTZXRJbml0aWFsVmFsdWUpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxWYWx1ZSA9IHZhbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2hvc3RFbGVtZW50LnZhbHVlID0gdmFsO1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYHZhbHVlYCBpcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHRodW1iIHN0YXJ0cyBiZWluZyBkcmFnZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHRodW1iIHN0b3BzIGJlaW5nIGRyYWdnZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnRW5kOiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHRyYW5zbGF0ZVggaW4gcHggb2YgdGhlIHNsaWRlciB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCB0cmFuc2xhdGVYKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3NsaWRlci5taW4gPj0gdGhpcy5fc2xpZGVyLm1heCkge1xuICAgICAgdGhpcy5fdHJhbnNsYXRlWCA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RyYW5zbGF0ZVggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdHJhbnNsYXRlWCA9IHRoaXMuX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgfVxuICBzZXQgdHJhbnNsYXRlWCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl90cmFuc2xhdGVYID0gdjtcbiAgfVxuICBwcml2YXRlIF90cmFuc2xhdGVYOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoaXMgdGh1bWIgaXMgdGhlIHN0YXJ0IG9yIGVuZCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgdGh1bWJQb3NpdGlvbjogX01hdFRodW1iID0gX01hdFRodW1iLkVORDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgbWluKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KHRoaXMuX2hvc3RFbGVtZW50Lm1pbik7XG4gIH1cbiAgc2V0IG1pbih2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50Lm1pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBtYXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQubWF4KTtcbiAgfVxuICBzZXQgbWF4KHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWF4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQuc3RlcCk7XG4gIH1cbiAgc2V0IHN0ZXAodjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdGVwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgaWYgKHRoaXMuX3NsaWRlci5kaXNhYmxlZCAhPT0gdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fc2xpZGVyLmRpc2FibGVkID0gdGhpcy5kaXNhYmxlZDtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGNvaW5jaWRlcyB3aXRoIHRoZSB2YWx1ZS4gKi9cbiAgZ2V0IHBlcmNlbnRhZ2UoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLm1pbiA+PSB0aGlzLl9zbGlkZXIubWF4KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9pc1J0bCA/IDEgOiAwO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMudmFsdWUgLSB0aGlzLl9zbGlkZXIubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbik7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgZmlsbFBlcmNlbnRhZ2UoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2lzUnRsID8gMSA6IDA7XG4gICAgfVxuICAgIGlmICh0aGlzLl90cmFuc2xhdGVYID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlWCAvIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICAvKiogVGhlIGhvc3QgbmF0aXZlIEhUTUwgaW5wdXQgZWxlbWVudC4gKi9cbiAgX2hvc3RFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIC8qKiBUaGUgYXJpYS12YWx1ZXRleHQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbnB1dCdzIHZhbHVlLiAqL1xuICBfdmFsdWV0ZXh0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgYSBuYXRpdmUgaHRtbCBzbGlkZXIncyBrbm9iLiAqL1xuICBfa25vYlJhZGl1czogbnVtYmVyID0gODtcblxuICAvKiogV2hldGhlciB1c2VyJ3MgY3Vyc29yIGlzIGN1cnJlbnRseSBpbiBhIG1vdXNlIGRvd24gc3RhdGUgb24gdGhlIGlucHV0LiAqL1xuICBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgY3VycmVudGx5IGZvY3VzZWQgKGVpdGhlciBieSB0YWIgb3IgYWZ0ZXIgY2xpY2tpbmcpLiAqL1xuICBfaXNGb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFVzZWQgdG8gcmVsYXkgdXBkYXRlcyB0byBfaXNGb2N1c2VkIHRvIHRoZSBzbGlkZXIgdmlzdWFsIHRodW1icy4gKi9cbiAgcHJpdmF0ZSBfc2V0SXNGb2N1c2VkKHY6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9pc0ZvY3VzZWQgPSB2O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGluaXRpYWwgdmFsdWUgaGFzIGJlZW4gc2V0LlxuICAgKiBUaGlzIGV4aXN0cyBiZWNhdXNlIHRoZSBpbml0aWFsIHZhbHVlIGNhbm5vdCBiZSBpbW1lZGlhdGVseSBzZXQgYmVjYXVzZSB0aGUgbWluIGFuZCBtYXhcbiAgICogbXVzdCBmaXJzdCBiZSByZWxheWVkIGZyb20gdGhlIHBhcmVudCBNYXRTbGlkZXIgY29tcG9uZW50LCB3aGljaCBjYW4gb25seSBoYXBwZW4gbGF0ZXJcbiAgICogaW4gdGhlIGNvbXBvbmVudCBsaWZlY3ljbGUuXG4gICAqL1xuICBwcml2YXRlIF9oYXNTZXRJbml0aWFsVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIHN0b3JlZCBpbml0aWFsIHZhbHVlLiAqL1xuICBfaW5pdGlhbFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIERlZmluZWQgd2hlbiBhIHVzZXIgaXMgdXNpbmcgYSBmb3JtIGNvbnRyb2wgdG8gbWFuYWdlIHNsaWRlciB2YWx1ZSAmIHZhbGlkYXRpb24uICovXG4gIHByaXZhdGUgX2Zvcm1Db250cm9sOiBGb3JtQ29udHJvbCB8IHVuZGVmaW5lZDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBVSSB1cGRhdGVzIHNob3VsZCBiZSBza2lwcGVkLlxuICAgKlxuICAgKiBUaGlzIGZsYWcgaXMgdXNlZCB0byBhdm9pZCBmbGlja2VyaW5nXG4gICAqIHdoZW4gY29ycmVjdGluZyB2YWx1ZXMgb24gcG9pbnRlciB1cC9kb3duLlxuICAgKi9cbiAgX3NraXBVSVVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgc2xpZGVyIGlucHV0IHZhbHVlIGNoYW5nZXMuICovXG4gIHByb3RlY3RlZCBfb25DaGFuZ2VGbjogKCh2YWx1ZTogYW55KSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcblxuICAvKiogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHNsaWRlciBpbnB1dCBoYXMgYmVlbiB0b3VjaGVkLiAqL1xuICBwcml2YXRlIF9vblRvdWNoZWRGbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBOZ01vZGVsIGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKlxuICAgKiBUaGlzIGZsYWcgaXMgdXNlZCB0byBpZ25vcmUgZ2hvc3QgbnVsbCBjYWxscyB0b1xuICAgKiB3cml0ZVZhbHVlIHdoaWNoIGNhbiBicmVhayBzbGlkZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDk4OC5cbiAgICovXG4gIHByb3RlY3RlZCBfaXNDb250cm9sSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChNQVRfU0xJREVSKSBwcm90ZWN0ZWQgX3NsaWRlcjogX01hdFNsaWRlcixcbiAgKSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX29uUG9pbnRlckRvd24uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vblBvaW50ZXJVcC5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25Qb2ludGVyRG93bik7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9vblBvaW50ZXJNb3ZlKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vblBvaW50ZXJVcCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLmRyYWdTdGFydC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZHJhZ0VuZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgaW5pdFByb3BzKCk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIC8vIElmIHRoaXMgb3IgdGhlIHBhcmVudCBzbGlkZXIgaXMgZGlzYWJsZWQsIGp1c3QgbWFrZSBldmVyeXRoaW5nIGRpc2FibGVkLlxuICAgIGlmICh0aGlzLmRpc2FibGVkICE9PSB0aGlzLl9zbGlkZXIuZGlzYWJsZWQpIHtcbiAgICAgIC8vIFRoZSBNYXRTbGlkZXIgc2V0dGVyIGZvciBkaXNhYmxlZCB3aWxsIHJlbGF5IHRoaXMgYW5kIGRpc2FibGUgYm90aCBpbnB1dHMuXG4gICAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuc3RlcCA9IHRoaXMuX3NsaWRlci5zdGVwO1xuICAgIHRoaXMubWluID0gdGhpcy5fc2xpZGVyLm1pbjtcbiAgICB0aGlzLm1heCA9IHRoaXMuX3NsaWRlci5tYXg7XG4gICAgdGhpcy5faW5pdFZhbHVlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBpbml0VUkoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgfVxuXG4gIF9pbml0VmFsdWUoKTogdm9pZCB7XG4gICAgdGhpcy5faGFzU2V0SW5pdGlhbFZhbHVlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5faW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSB0aGlzLl9pbml0aWFsVmFsdWU7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0RGVmYXVsdFZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubWluO1xuICB9XG5cbiAgX29uQmx1cigpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJc0ZvY3VzZWQoZmFsc2UpO1xuICAgIHRoaXMuX29uVG91Y2hlZEZuKCk7XG4gIH1cblxuICBfb25Gb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJc0ZvY3VzZWQodHJ1ZSk7XG4gIH1cblxuICBfb25DaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIC8vIG9ubHkgdXNlZCB0byBoYW5kbGUgdGhlIGVkZ2UgY2FzZSB3aGVyZSB1c2VyXG4gICAgLy8gbW91c2Vkb3duIG9uIHRoZSBzbGlkZXIgdGhlbiB1c2VzIGFycm93IGtleXMuXG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSh7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0KCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlRm4/Lih0aGlzLnZhbHVlKTtcbiAgICAvLyBoYW5kbGVzIGFycm93aW5nIGFuZCB1cGRhdGluZyB0aGUgdmFsdWUgd2hlblxuICAgIC8vIGEgc3RlcCBpcyBkZWZpbmVkLlxuICAgIGlmICh0aGlzLl9zbGlkZXIuc3RlcCB8fCAhdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgfVxuXG4gIF9vbk5nQ29udHJvbFZhbHVlQ2hhbmdlKCk6IHZvaWQge1xuICAgIC8vIG9ubHkgdXNlZCB0byBoYW5kbGUgd2hlbiB0aGUgdmFsdWUgY2hhbmdlXG4gICAgLy8gb3JpZ2luYXRlcyBvdXRzaWRlIG9mIHRoZSBzbGlkZXIuXG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSB8fCAhdGhpcy5faXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0aGlzLl9mb3JtQ29udHJvbCEuZGlzYWJsZWQ7XG4gIH1cblxuICBfb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgICB0aGlzLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgIHRoaXMuX3NsaWRlci5fdXBkYXRlRGltZW5zaW9ucygpO1xuXG4gICAgLy8gRG9lcyBub3RoaW5nIGlmIGEgc3RlcCBpcyBkZWZpbmVkIGJlY2F1c2Ugd2VcbiAgICAvLyB3YW50IHRoZSB2YWx1ZSB0byBzbmFwIHRvIHRoZSB2YWx1ZXMgb24gaW5wdXQuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5faGFuZGxlVmFsdWVDb3JyZWN0aW9uKGV2ZW50KTtcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoe3NvdXJjZTogdGhpcywgcGFyZW50OiB0aGlzLl9zbGlkZXIsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIG9uIHBvaW50ZXIgdXAvZG93bi5cbiAgICpcbiAgICogQ2FsbGVkIG9uIHBvaW50ZXIgZG93biBhbmQgdXAgYmVjYXVzZSB0aGUgdmFsdWUgaXMgc2V0IGJhc2VkXG4gICAqIG9uIHRoZSBpbmFjdGl2ZSB3aWR0aCBpbnN0ZWFkIG9mIHRoZSBhY3RpdmUgd2lkdGguXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVWYWx1ZUNvcnJlY3Rpb24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgVUkgd2l0aCB0aGUgY3VycmVudCB2YWx1ZSEgVGhlIHZhbHVlIG9uIHBvaW50ZXJkb3duXG4gICAgLy8gYW5kIHBvaW50ZXJ1cCBpcyBjYWxjdWxhdGVkIGluIHRoZSBzcGxpdCBzZWNvbmQgYmVmb3JlIHRoZSBpbnB1dChzKVxuICAgIC8vIHJlc2l6ZS4gU2VlIF91cGRhdGVXaWR0aEluYWN0aXZlKCkgYW5kIF91cGRhdGVXaWR0aEFjdGl2ZSgpIGZvciBtb3JlXG4gICAgLy8gZGV0YWlscy5cbiAgICB0aGlzLl9za2lwVUlVcGRhdGUgPSB0cnVlO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZ2V0cyB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlXG4gICAgLy8gc2xpZGVyIGlzIHVwZGF0ZWQuIFRoaXMgbWVhbnMgaWYgd2Ugd2VyZSB0byBzZXQgdGhlIHZhbHVlIGhlcmUsIGl0XG4gICAgLy8gd291bGQgaW1tZWRpYXRlbHkgYmUgb3ZlcndyaXR0ZW4uIFVzaW5nIHNldFRpbWVvdXQgZW5zdXJlcyB0aGUgc2V0dGluZ1xuICAgIC8vIG9mIHRoZSB2YWx1ZSBoYXBwZW5zIGFmdGVyIHRoZSB2YWx1ZSBoYXMgYmVlbiB1cGRhdGVkIGJ5IHRoZVxuICAgIC8vIHBvaW50ZXJkb3duIGV2ZW50LlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2tpcFVJVXBkYXRlID0gZmFsc2U7XG4gICAgICB0aGlzLl9maXhWYWx1ZShldmVudCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKiogQ29ycmVjdHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgYmFzZWQgb24gdGhlIHBvaW50ZXIgZXZlbnQncyBwb3NpdGlvbi4gKi9cbiAgX2ZpeFZhbHVlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB4UG9zID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuX3NsaWRlci5fY2FjaGVkTGVmdDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgY29uc3Qgc3RlcCA9IHRoaXMuX3NsaWRlci5zdGVwID09PSAwID8gMSA6IHRoaXMuX3NsaWRlci5zdGVwO1xuICAgIGNvbnN0IG51bVN0ZXBzID0gTWF0aC5mbG9vcigodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pIC8gc3RlcCk7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIC0geFBvcyAvIHdpZHRoIDogeFBvcyAvIHdpZHRoO1xuXG4gICAgLy8gVG8gZW5zdXJlIHRoZSBwZXJjZW50YWdlIGlzIHJvdW5kZWQgdG8gdGhlIG5lY2Vzc2FyeSBudW1iZXIgb2YgZGVjaW1hbHMuXG4gICAgY29uc3QgZml4ZWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZChwZXJjZW50YWdlICogbnVtU3RlcHMpIC8gbnVtU3RlcHM7XG5cbiAgICBjb25zdCBpbXByZWNpc2VWYWx1ZSA9XG4gICAgICBmaXhlZFBlcmNlbnRhZ2UgKiAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pICsgdGhpcy5fc2xpZGVyLm1pbjtcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGgucm91bmQoaW1wcmVjaXNlVmFsdWUgLyBzdGVwKSAqIHN0ZXA7XG4gICAgY29uc3QgcHJldlZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gcHJldlZhbHVlKSB7XG4gICAgICAvLyBCZWNhdXNlIHdlIHByZXZlbnRlZCBVSSB1cGRhdGVzLCBpZiBpdCB0dXJucyBvdXQgdGhhdCB0aGUgcmFjZVxuICAgICAgLy8gY29uZGl0aW9uIGRpZG4ndCBoYXBwZW4gYW5kIHRoZSB2YWx1ZSBpcyBhbHJlYWR5IGNvcnJlY3QsIHdlXG4gICAgICAvLyBoYXZlIHRvIGFwcGx5IHRoZSB1aSB1cGRhdGVzIG5vdy5cbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3NsaWRlci5zdGVwID4gMFxuICAgICAgICA/IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKClcbiAgICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fb25DaGFuZ2VGbj8uKHRoaXMudmFsdWUpO1xuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICB0aGlzLl9zbGlkZXIuc3RlcCA+IDBcbiAgICAgID8gdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKVxuICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIEFnYWluLCBkb2VzIG5vdGhpbmcgaWYgYSBzdGVwIGlzIGRlZmluZWQgYmVjYXVzZVxuICAgIC8vIHdlIHdhbnQgdGhlIHZhbHVlIHRvIHNuYXAgdG8gdGhlIHZhbHVlcyBvbiBpbnB1dC5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwICYmIHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblBvaW50ZXJVcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLmRyYWdFbmQuZW1pdCh7c291cmNlOiB0aGlzLCBwYXJlbnQ6IHRoaXMuX3NsaWRlciwgdmFsdWU6IHRoaXMudmFsdWV9KTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpKTtcbiAgICB9XG4gIH1cblxuICBfY2xhbXAodjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odiwgdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCksIDApO1xuICB9XG5cbiAgX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIuX2lzUnRsKSB7XG4gICAgICByZXR1cm4gKDEgLSB0aGlzLnBlcmNlbnRhZ2UpICogdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGVyY2VudGFnZSAqIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICBfY2FsY1RyYW5zbGF0ZVhCeVBvaW50ZXJFdmVudChldmVudDogUG9pbnRlckV2ZW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gZXZlbnQuY2xpZW50WCAtIHRoaXMuX3NsaWRlci5fY2FjaGVkTGVmdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHNldCB0aGUgc2xpZGVyIHdpZHRoIHRvIHRoZSBjb3JyZWN0XG4gICAqIGRpbWVuc2lvbnMgd2hpbGUgdGhlIHVzZXIgaXMgZHJhZ2dpbmcuXG4gICAqL1xuICBfdXBkYXRlV2lkdGhBY3RpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9IGAwICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYGNhbGMoMTAwJSArICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHgpYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzbGlkZXIgaW5wdXQgdG8gZGlzcHJvcG9ydGlvbmF0ZSBkaW1lbnNpb25zIHRvIGFsbG93IGZvciB0b3VjaFxuICAgKiBldmVudHMgdG8gYmUgY2FwdHVyZWQgb24gdG91Y2ggZGV2aWNlcy5cbiAgICovXG4gIF91cGRhdGVXaWR0aEluYWN0aXZlKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnMHB4JztcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9ICdjYWxjKDEwMCUgKyA0OHB4KSc7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICctMjRweCc7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSUJ5VmFsdWUob3B0aW9ucz86IHt3aXRoQW5pbWF0aW9uOiBib29sZWFufSk6IHZvaWQge1xuICAgIHRoaXMudHJhbnNsYXRlWCA9IHRoaXMuX2NsYW1wKHRoaXMuX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpKTtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJKG9wdGlvbnMpO1xuICB9XG5cbiAgX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudDogUG9pbnRlckV2ZW50LCBvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2xhdGVYID0gdGhpcy5fY2xhbXAodGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVBvaW50ZXJFdmVudChldmVudCkpO1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUkob3B0aW9ucyk7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSShvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KSB7XG4gICAgdGhpcy5fc2xpZGVyLl9zZXRUcmFuc2l0aW9uKCEhb3B0aW9ucz8ud2l0aEFuaW1hdGlvbik7XG4gICAgdGhpcy5fc2xpZGVyLl9vblRyYW5zbGF0ZVhDaGFuZ2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW5wdXQncyB2YWx1ZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0NvbnRyb2xJbml0aWFsaXplZCB8fCB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGlucHV0J3MgdmFsdWUgY2hhbmdlcyBmcm9tIHVzZXIgaW5wdXQuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXJcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2VGbiA9IGZuO1xuICAgIHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWQgYnkgdGhlIHVzZXIuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXJcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZEZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIHNsaWRlci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIG5ldyBkaXNhYmxlZCBzdGF0ZVxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBibHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmJsdXIoKTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTbGlkZXJTdGFydFRodW1iXSwgaW5wdXRbbWF0U2xpZGVyRW5kVGh1bWJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXJSYW5nZVRodW1iJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX1NMSURFUl9SQU5HRV9USFVNQiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlclJhbmdlVGh1bWJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJSYW5nZVRodW1iIGV4dGVuZHMgTWF0U2xpZGVyVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyUmFuZ2VUaHVtYiB7XG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldFNpYmxpbmcoKTogX01hdFNsaWRlclJhbmdlVGh1bWIgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fc2libGluZykge1xuICAgICAgdGhpcy5fc2libGluZyA9IHRoaXMuX3NsaWRlci5fZ2V0SW5wdXQodGhpcy5faXNFbmRUaHVtYiA/IF9NYXRUaHVtYi5TVEFSVCA6IF9NYXRUaHVtYi5FTkQpIGFzXG4gICAgICAgIHwgTWF0U2xpZGVyUmFuZ2VUaHVtYlxuICAgICAgICB8IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NpYmxpbmc7XG4gIH1cbiAgcHJpdmF0ZSBfc2libGluZzogTWF0U2xpZGVyUmFuZ2VUaHVtYiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWluaW11bSB0cmFuc2xhdGVYIHBvc2l0aW9uIGFsbG93ZWQgZm9yIHRoaXMgc2xpZGVyIGlucHV0J3MgdmlzdWFsIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRNaW5Qb3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCF0aGlzLl9pc0xlZnRUaHVtYiAmJiBzaWJsaW5nKSB7XG4gICAgICByZXR1cm4gc2libGluZy50cmFuc2xhdGVYO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1heFBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAodGhpcy5faXNMZWZ0VGh1bWIgJiYgc2libGluZykge1xuICAgICAgcmV0dXJuIHNpYmxpbmcudHJhbnNsYXRlWDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICBfc2V0SXNMZWZ0VGh1bWIoKTogdm9pZCB7XG4gICAgdGhpcy5faXNMZWZ0VGh1bWIgPVxuICAgICAgKHRoaXMuX2lzRW5kVGh1bWIgJiYgdGhpcy5fc2xpZGVyLl9pc1J0bCkgfHwgKCF0aGlzLl9pc0VuZFRodW1iICYmICF0aGlzLl9zbGlkZXIuX2lzUnRsKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgc2xpZGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBpbnB1dCBvbiB0aGUgbGVmdCBoYW5kIHNpZGUuICovXG4gIF9pc0xlZnRUaHVtYjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGlzIHNsaWRlciBjb3JyZXNwb25kcyB0byB0aGUgaW5wdXQgd2l0aCBncmVhdGVyIHZhbHVlLiAqL1xuICBfaXNFbmRUaHVtYjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfU0xJREVSKSBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICAgIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIG92ZXJyaWRlIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHtcbiAgICBzdXBlcihfbmdab25lLCBfZWxlbWVudFJlZiwgX2NkciwgX3NsaWRlcik7XG4gICAgdGhpcy5faXNFbmRUaHVtYiA9IHRoaXMuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyRW5kVGh1bWInKTtcbiAgICB0aGlzLl9zZXRJc0xlZnRUaHVtYigpO1xuICAgIHRoaXMudGh1bWJQb3NpdGlvbiA9IHRoaXMuX2lzRW5kVGh1bWIgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJUO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2dldERlZmF1bHRWYWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pc0VuZFRodW1iICYmIHRoaXMuX3NsaWRlci5faXNSYW5nZSA/IHRoaXMubWF4IDogdGhpcy5taW47XG4gIH1cblxuICBvdmVycmlkZSBfb25JbnB1dCgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25JbnB1dCgpO1xuICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTogdm9pZCB7XG4gICAgc3VwZXIuX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTtcbiAgICB0aGlzLmdldFNpYmxpbmcoKT8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlckRvd24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2libGluZykge1xuICAgICAgdGhpcy5fc2libGluZy5fdXBkYXRlV2lkdGhBY3RpdmUoKTtcbiAgICAgIHRoaXMuX3NpYmxpbmcuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWlucHV0LW5vLXBvaW50ZXItZXZlbnRzJyk7XG4gICAgfVxuICAgIHN1cGVyLl9vblBvaW50ZXJEb3duKGV2ZW50KTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9vblBvaW50ZXJVcCgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25Qb2ludGVyVXAoKTtcbiAgICBpZiAodGhpcy5fc2libGluZykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpYmxpbmchLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgICAgIHRoaXMuX3NpYmxpbmchLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtYXQtbWRjLXNsaWRlci1pbnB1dC1uby1wb2ludGVyLWV2ZW50cycpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLl9vblBvaW50ZXJNb3ZlKGV2ZW50KTtcbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwICYmIHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVTaWJsaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX2ZpeFZhbHVlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBzdXBlci5fZml4VmFsdWUoZXZlbnQpO1xuICAgIHRoaXMuX3NpYmxpbmc/Ll91cGRhdGVNaW5NYXgoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9jbGFtcCh2OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbih2LCB0aGlzLmdldE1heFBvcygpKSwgdGhpcy5nZXRNaW5Qb3MoKSk7XG4gIH1cblxuICBfdXBkYXRlTWluTWF4KCk6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzRW5kVGh1bWIpIHtcbiAgICAgIHRoaXMubWluID0gTWF0aC5tYXgodGhpcy5fc2xpZGVyLm1pbiwgc2libGluZy52YWx1ZSk7XG4gICAgICB0aGlzLm1heCA9IHRoaXMuX3NsaWRlci5tYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWluID0gdGhpcy5fc2xpZGVyLm1pbjtcbiAgICAgIHRoaXMubWF4ID0gTWF0aC5taW4odGhpcy5fc2xpZGVyLm1heCwgc2libGluZy52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX3VwZGF0ZVdpZHRoQWN0aXZlKCk6IHZvaWQge1xuICAgIGNvbnN0IG1pbldpZHRoID0gdGhpcy5fc2xpZGVyLl9yaXBwbGVSYWRpdXMgKiAyIC0gdGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmcgKiAyO1xuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCArIHRoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nIC0gbWluV2lkdGg7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9XG4gICAgICB0aGlzLl9zbGlkZXIubWluIDwgdGhpcy5fc2xpZGVyLm1heFxuICAgICAgICA/ICh0aGlzLm1heCAtIHRoaXMubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbilcbiAgICAgICAgOiAxO1xuICAgIGNvbnN0IHdpZHRoID0gbWF4V2lkdGggKiBwZXJjZW50YWdlICsgbWluV2lkdGg7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9IGAwICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHhgO1xuICB9XG5cbiAgb3ZlcnJpZGUgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgY29uc3QgbWlkVmFsdWUgPSB0aGlzLl9pc0VuZFRodW1iXG4gICAgICA/IHRoaXMudmFsdWUgLSAodGhpcy52YWx1ZSAtIHNpYmxpbmcudmFsdWUpIC8gMlxuICAgICAgOiB0aGlzLnZhbHVlICsgKHNpYmxpbmcudmFsdWUgLSB0aGlzLnZhbHVlKSAvIDI7XG5cbiAgICBjb25zdCBfcGVyY2VudGFnZSA9IHRoaXMuX2lzRW5kVGh1bWJcbiAgICAgID8gKHRoaXMubWF4IC0gbWlkVmFsdWUpIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKVxuICAgICAgOiAobWlkVmFsdWUgLSB0aGlzLm1pbikgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5taW4gPCB0aGlzLl9zbGlkZXIubWF4ID8gX3BlcmNlbnRhZ2UgOiAxO1xuXG4gICAgY29uc3Qgd2lkdGggPSBtYXhXaWR0aCAqIHBlcmNlbnRhZ2UgKyAyNDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzBweCc7XG5cbiAgICBpZiAodGhpcy5faXNMZWZ0VGh1bWIpIHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSAnLTI0cHgnO1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucmlnaHQgPSAnYXV0byc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSAnYXV0byc7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5yaWdodCA9ICctMjRweCc7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZVN0YXRpY1N0eWxlcygpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtYXQtc2xpZGVyX19yaWdodC1pbnB1dCcsICF0aGlzLl9pc0xlZnRUaHVtYik7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTaWJsaW5nKCk6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2libGluZy5fdXBkYXRlTWluTWF4KCk7XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICBzaWJsaW5nLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWJsaW5nLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGlucHV0J3MgdmFsdWUuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBpbnB1dFxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvdmVycmlkZSB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNDb250cm9sSW5pdGlhbGl6ZWQgfHwgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==