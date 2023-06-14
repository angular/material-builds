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
        this._slider._cdr.markForCheck();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSliderThumb, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatSliderThumb, selector: "input[matSliderThumb]", inputs: { value: "value" }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd" }, host: { attributes: { "type": "range" }, listeners: { "change": "_onChange()", "input": "_onInput()", "blur": "_onBlur()", "focus": "_onFocus()" }, properties: { "attr.aria-valuetext": "_valuetext" }, classAttribute: "mdc-slider__input" }, providers: [
            MAT_SLIDER_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
        ], exportAs: ["matSliderThumb"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSliderThumb, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSliderRangeThumb, deps: [{ token: i0.NgZone }, { token: MAT_SLIDER }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatSliderRangeThumb, selector: "input[matSliderStartThumb], input[matSliderEndThumb]", providers: [
            MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
        ], exportAs: ["matSliderRangeThumb"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSliderRangeThumb, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFvQyxpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQU1MLHNCQUFzQixFQUN0QixnQkFBZ0IsRUFDaEIsVUFBVSxHQUNYLE1BQU0sb0JBQW9CLENBQUM7O0FBRTVCOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFRO0lBQ2xELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQVE7SUFDeEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBQ2xELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFvQkgsTUFBTSxPQUFPLGNBQWM7SUFDekIsSUFDSSxLQUFLO1FBQ1AsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUss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RUFBRTt3QkFDVCxxQ0FBcUM7d0JBQ3JDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcscUJBQXFCLEVBQUM7cUJBQ3BFO2lCQUNGOzswQkFrREksTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUNvbnRyb2wsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgX01hdFRodW1iLFxuICBNYXRTbGlkZXJEcmFnRXZlbnQsXG4gIF9NYXRTbGlkZXIsXG4gIF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICBfTWF0U2xpZGVyVGh1bWIsXG4gIE1BVF9TTElERVJfUkFOR0VfVEhVTUIsXG4gIE1BVF9TTElERVJfVEhVTUIsXG4gIE1BVF9TTElERVIsXG59IGZyb20gJy4vc2xpZGVyLWludGVyZmFjZSc7XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyVGh1bWIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHJhbmdlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyUmFuZ2VUaHVtYiksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIHNsaWRlci1zcGVjaWZpYyBiZWhhdmlvcnMgdG8gYW4gaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtc2xpZGVyPmAuXG4gKiBVcCB0byB0d28gbWF5IGJlIHBsYWNlZCBpbnNpZGUgb2YgYSBgPG1hdC1zbGlkZXI+YC5cbiAqXG4gKiBJZiBvbmUgaXMgdXNlZCwgdGhlIHNlbGVjdG9yIGBtYXRTbGlkZXJUaHVtYmAgbXVzdCBiZSB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIG5vcm1hbFxuICogc2xpZGVyLiBJZiB0d28gYXJlIHVzZWQsIHRoZSBzZWxlY3RvcnMgYG1hdFNsaWRlclN0YXJ0VGh1bWJgIGFuZCBgbWF0U2xpZGVyRW5kVGh1bWJgIG11c3QgYmVcbiAqIHVzZWQsIGFuZCB0aGUgb3V0Y29tZSB3aWxsIGJlIGEgcmFuZ2Ugc2xpZGVyIHdpdGggdHdvIHNsaWRlciB0aHVtYnMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclRodW1iXScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyVGh1bWInLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX2lucHV0JyxcbiAgICAndHlwZSc6ICdyYW5nZScsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWV0ZXh0XSc6ICdfdmFsdWV0ZXh0JyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCknLFxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogQ29uc2lkZXIgdXNpbmcgYSBnbG9iYWwgZXZlbnQgbGlzdGVuZXIgaW5zdGVhZC5cbiAgICAvLyBSZWFzb246IEkgaGF2ZSBmb3VuZCBhIHNlbWktY29uc2lzdGVudCB3YXkgdG8gbW91c2UgdXAgd2l0aG91dCB0cmlnZ2VyaW5nIHRoaXMgZXZlbnQuXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyVGh1bWJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJUaHVtYiwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSk7XG4gIH1cbiAgc2V0IHZhbHVlKHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgdmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2hhc1NldEluaXRpYWxWYWx1ZSkge1xuICAgICAgdGhpcy5faW5pdGlhbFZhbHVlID0gdmFsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSB2YWw7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB0aGlzLl9zbGlkZXIuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBgdmFsdWVgIGlzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RhcnRzIGJlaW5nIGRyYWdnZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RvcHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdFbmQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdHJhbnNsYXRlWCBpbiBweCBvZiB0aGUgc2xpZGVyIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHRyYW5zbGF0ZVgoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLm1pbiA+PSB0aGlzLl9zbGlkZXIubWF4KSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gMDtcbiAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGVYO1xuICAgIH1cbiAgICBpZiAodGhpcy5fdHJhbnNsYXRlWCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gdGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGVYO1xuICB9XG4gIHNldCB0cmFuc2xhdGVYKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3RyYW5zbGF0ZVggPSB2O1xuICB9XG4gIHByaXZhdGUgX3RyYW5zbGF0ZVg6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyB0aHVtYiBpcyB0aGUgc3RhcnQgb3IgZW5kIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWIgPSBfTWF0VGh1bWIuRU5EO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQubWluKTtcbiAgfVxuICBzZXQgbWluKHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5tYXgpO1xuICB9XG4gIHNldCBtYXgodjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5tYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KS50b1N0cmluZygpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBnZXQgc3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5zdGVwKTtcbiAgfVxuICBzZXQgc3RlcCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KS50b1N0cmluZygpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmRpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5fc2xpZGVyLmRpc2FibGVkICE9PSB0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudGFnZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIubWluID49IHRoaXMuX3NsaWRlci5tYXgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2lzUnRsID8gMSA6IDA7XG4gICAgfVxuICAgIHJldHVybiAodGhpcy52YWx1ZSAtIHRoaXMuX3NsaWRlci5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBmaWxsUGVyY2VudGFnZSgpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIDogMDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RyYW5zbGF0ZVggPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVYIC8gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgfVxuXG4gIC8qKiBUaGUgaG9zdCBuYXRpdmUgSFRNTCBpbnB1dCBlbGVtZW50LiAqL1xuICBfaG9zdEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgLyoqIFRoZSBhcmlhLXZhbHVldGV4dCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGlucHV0J3MgdmFsdWUuICovXG4gIF92YWx1ZXRleHQ6IHN0cmluZztcblxuICAvKiogVGhlIHJhZGl1cyBvZiBhIG5hdGl2ZSBodG1sIHNsaWRlcidzIGtub2IuICovXG4gIF9rbm9iUmFkaXVzOiBudW1iZXIgPSA4O1xuXG4gIC8qKiBXaGV0aGVyIHVzZXIncyBjdXJzb3IgaXMgY3VycmVudGx5IGluIGEgbW91c2UgZG93biBzdGF0ZSBvbiB0aGUgaW5wdXQuICovXG4gIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBjdXJyZW50bHkgZm9jdXNlZCAoZWl0aGVyIGJ5IHRhYiBvciBhZnRlciBjbGlja2luZykuICovXG4gIF9pc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVXNlZCB0byByZWxheSB1cGRhdGVzIHRvIF9pc0ZvY3VzZWQgdG8gdGhlIHNsaWRlciB2aXN1YWwgdGh1bWJzLiAqL1xuICBwcml2YXRlIF9zZXRJc0ZvY3VzZWQodjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX2lzRm9jdXNlZCA9IHY7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaW5pdGlhbCB2YWx1ZSBoYXMgYmVlbiBzZXQuXG4gICAqIFRoaXMgZXhpc3RzIGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2Fubm90IGJlIGltbWVkaWF0ZWx5IHNldCBiZWNhdXNlIHRoZSBtaW4gYW5kIG1heFxuICAgKiBtdXN0IGZpcnN0IGJlIHJlbGF5ZWQgZnJvbSB0aGUgcGFyZW50IE1hdFNsaWRlciBjb21wb25lbnQsIHdoaWNoIGNhbiBvbmx5IGhhcHBlbiBsYXRlclxuICAgKiBpbiB0aGUgY29tcG9uZW50IGxpZmVjeWNsZS5cbiAgICovXG4gIHByaXZhdGUgX2hhc1NldEluaXRpYWxWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc3RvcmVkIGluaXRpYWwgdmFsdWUuICovXG4gIF9pbml0aWFsVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKiogRGVmaW5lZCB3aGVuIGEgdXNlciBpcyB1c2luZyBhIGZvcm0gY29udHJvbCB0byBtYW5hZ2Ugc2xpZGVyIHZhbHVlICYgdmFsaWRhdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIFVJIHVwZGF0ZXMgc2hvdWxkIGJlIHNraXBwZWQuXG4gICAqXG4gICAqIFRoaXMgZmxhZyBpcyB1c2VkIHRvIGF2b2lkIGZsaWNrZXJpbmdcbiAgICogd2hlbiBjb3JyZWN0aW5nIHZhbHVlcyBvbiBwb2ludGVyIHVwL2Rvd24uXG4gICAqL1xuICBfc2tpcFVJVXBkYXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBzbGlkZXIgaW5wdXQgdmFsdWUgY2hhbmdlcy4gKi9cbiAgcHJvdGVjdGVkIF9vbkNoYW5nZUZuOiAoKHZhbHVlOiBhbnkpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgc2xpZGVyIGlucHV0IGhhcyBiZWVuIHRvdWNoZWQuICovXG4gIHByaXZhdGUgX29uVG91Y2hlZEZuOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIE5nTW9kZWwgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIFRoaXMgZmxhZyBpcyB1c2VkIHRvIGlnbm9yZSBnaG9zdCBudWxsIGNhbGxzIHRvXG4gICAqIHdyaXRlVmFsdWUgd2hpY2ggY2FuIGJyZWFrIHNsaWRlciBpbml0aWFsaXphdGlvbi5cbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE0OTg4LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9pc0NvbnRyb2xJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICByZWFkb25seSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIHByb3RlY3RlZCBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICApIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25Qb2ludGVyRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vblBvaW50ZXJEb3duKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZHJhZ1N0YXJ0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kcmFnRW5kLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBpbml0UHJvcHMoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgLy8gSWYgdGhpcyBvciB0aGUgcGFyZW50IHNsaWRlciBpcyBkaXNhYmxlZCwganVzdCBtYWtlIGV2ZXJ5dGhpbmcgZGlzYWJsZWQuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgIT09IHRoaXMuX3NsaWRlci5kaXNhYmxlZCkge1xuICAgICAgLy8gVGhlIE1hdFNsaWRlciBzZXR0ZXIgZm9yIGRpc2FibGVkIHdpbGwgcmVsYXkgdGhpcyBhbmQgZGlzYWJsZSBib3RoIGlucHV0cy5cbiAgICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwID0gdGhpcy5fc2xpZGVyLnN0ZXA7XG4gICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGluaXRVSSgpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgX2luaXRWYWx1ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNTZXRJbml0aWFsVmFsdWUgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9pbml0aWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldERlZmF1bHRWYWx1ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSA9IHRoaXMuX2luaXRpYWxWYWx1ZTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXREZWZhdWx0VmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5taW47XG4gIH1cblxuICBfb25CbHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZChmYWxzZSk7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4oKTtcbiAgfVxuXG4gIF9vbkZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgLy8gb25seSB1c2VkIHRvIGhhbmRsZSB0aGUgZWRnZSBjYXNlIHdoZXJlIHVzZXJcbiAgICAvLyBtb3VzZWRvd24gb24gdGhlIHNsaWRlciB0aGVuIHVzZXMgYXJyb3cga2V5cy5cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2VGbj8uKHRoaXMudmFsdWUpO1xuICAgIC8vIGhhbmRsZXMgYXJyb3dpbmcgYW5kIHVwZGF0aW5nIHRoZSB2YWx1ZSB3aGVuXG4gICAgLy8gYSBzdGVwIGlzIGRlZmluZWQuXG4gICAgaWYgKHRoaXMuX3NsaWRlci5zdGVwIHx8ICF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoe3dpdGhBbmltYXRpb246IHRydWV9KTtcbiAgICB9XG4gICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICB9XG5cbiAgX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTogdm9pZCB7XG4gICAgLy8gb25seSB1c2VkIHRvIGhhbmRsZSB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VcbiAgICAvLyBvcmlnaW5hdGVzIG91dHNpZGUgb2YgdGhlIHNsaWRlci5cbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlIHx8ICF0aGlzLl9pc0ZvY3VzZWQpIHtcbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgfVxuICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRoaXMuX2Zvcm1Db250cm9sIS5kaXNhYmxlZDtcbiAgfVxuXG4gIF9vblBvaW50ZXJEb3duKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5fc2V0SXNGb2N1c2VkKHRydWUpO1xuICAgIHRoaXMuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgdGhpcy5fc2xpZGVyLl91cGRhdGVEaW1lbnNpb25zKCk7XG5cbiAgICAvLyBEb2VzIG5vdGhpbmcgaWYgYSBzdGVwIGlzIGRlZmluZWQgYmVjYXVzZSB3ZVxuICAgIC8vIHdhbnQgdGhlIHZhbHVlIHRvIHNuYXAgdG8gdGhlIHZhbHVlcyBvbiBpbnB1dC5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9oYW5kbGVWYWx1ZUNvcnJlY3Rpb24oZXZlbnQpO1xuICAgICAgdGhpcy5kcmFnU3RhcnQuZW1pdCh7c291cmNlOiB0aGlzLCBwYXJlbnQ6IHRoaXMuX3NsaWRlciwgdmFsdWU6IHRoaXMudmFsdWV9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgb24gcG9pbnRlciB1cC9kb3duLlxuICAgKlxuICAgKiBDYWxsZWQgb24gcG9pbnRlciBkb3duIGFuZCB1cCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBzZXQgYmFzZWRcbiAgICogb24gdGhlIGluYWN0aXZlIHdpZHRoIGluc3RlYWQgb2YgdGhlIGFjdGl2ZSB3aWR0aC5cbiAgICovXG4gIHByaXZhdGUgX2hhbmRsZVZhbHVlQ29ycmVjdGlvbihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBVSSB3aXRoIHRoZSBjdXJyZW50IHZhbHVlISBUaGUgdmFsdWUgb24gcG9pbnRlcmRvd25cbiAgICAvLyBhbmQgcG9pbnRlcnVwIGlzIGNhbGN1bGF0ZWQgaW4gdGhlIHNwbGl0IHNlY29uZCBiZWZvcmUgdGhlIGlucHV0KHMpXG4gICAgLy8gcmVzaXplLiBTZWUgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKSBhbmQgX3VwZGF0ZVdpZHRoQWN0aXZlKCkgZm9yIG1vcmVcbiAgICAvLyBkZXRhaWxzLlxuICAgIHRoaXMuX3NraXBVSVVwZGF0ZSA9IHRydWU7XG5cbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBnZXRzIHRyaWdnZXJlZCBiZWZvcmUgdGhlIGFjdHVhbCB2YWx1ZSBvZiB0aGVcbiAgICAvLyBzbGlkZXIgaXMgdXBkYXRlZC4gVGhpcyBtZWFucyBpZiB3ZSB3ZXJlIHRvIHNldCB0aGUgdmFsdWUgaGVyZSwgaXRcbiAgICAvLyB3b3VsZCBpbW1lZGlhdGVseSBiZSBvdmVyd3JpdHRlbi4gVXNpbmcgc2V0VGltZW91dCBlbnN1cmVzIHRoZSBzZXR0aW5nXG4gICAgLy8gb2YgdGhlIHZhbHVlIGhhcHBlbnMgYWZ0ZXIgdGhlIHZhbHVlIGhhcyBiZWVuIHVwZGF0ZWQgYnkgdGhlXG4gICAgLy8gcG9pbnRlcmRvd24gZXZlbnQuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9za2lwVUlVcGRhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2ZpeFZhbHVlKGV2ZW50KTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIC8qKiBDb3JyZWN0cyB0aGUgdmFsdWUgb2YgdGhlIHNsaWRlciBiYXNlZCBvbiB0aGUgcG9pbnRlciBldmVudCdzIHBvc2l0aW9uLiAqL1xuICBfZml4VmFsdWUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHhQb3MgPSBldmVudC5jbGllbnRYIC0gdGhpcy5fc2xpZGVyLl9jYWNoZWRMZWZ0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICBjb25zdCBzdGVwID0gdGhpcy5fc2xpZGVyLnN0ZXAgPT09IDAgPyAxIDogdGhpcy5fc2xpZGVyLnN0ZXA7XG4gICAgY29uc3QgbnVtU3RlcHMgPSBNYXRoLmZsb29yKCh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbikgLyBzdGVwKTtcbiAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5fc2xpZGVyLl9pc1J0bCA/IDEgLSB4UG9zIC8gd2lkdGggOiB4UG9zIC8gd2lkdGg7XG5cbiAgICAvLyBUbyBlbnN1cmUgdGhlIHBlcmNlbnRhZ2UgaXMgcm91bmRlZCB0byB0aGUgbmVjZXNzYXJ5IG51bWJlciBvZiBkZWNpbWFscy5cbiAgICBjb25zdCBmaXhlZFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKHBlcmNlbnRhZ2UgKiBudW1TdGVwcykgLyBudW1TdGVwcztcblxuICAgIGNvbnN0IGltcHJlY2lzZVZhbHVlID1cbiAgICAgIGZpeGVkUGVyY2VudGFnZSAqICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbikgKyB0aGlzLl9zbGlkZXIubWluO1xuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5yb3VuZChpbXByZWNpc2VWYWx1ZSAvIHN0ZXApICogc3RlcDtcbiAgICBjb25zdCBwcmV2VmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgaWYgKHZhbHVlID09PSBwcmV2VmFsdWUpIHtcbiAgICAgIC8vIEJlY2F1c2Ugd2UgcHJldmVudGVkIFVJIHVwZGF0ZXMsIGlmIGl0IHR1cm5zIG91dCB0aGF0IHRoZSByYWNlXG4gICAgICAvLyBjb25kaXRpb24gZGlkbid0IGhhcHBlbiBhbmQgdGhlIHZhbHVlIGlzIGFscmVhZHkgY29ycmVjdCwgd2VcbiAgICAgIC8vIGhhdmUgdG8gYXBwbHkgdGhlIHVpIHVwZGF0ZXMgbm93LlxuICAgICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgICAgdGhpcy5fc2xpZGVyLnN0ZXAgPiAwXG4gICAgICAgID8gdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKVxuICAgICAgICA6IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCwge3dpdGhBbmltYXRpb246IHRoaXMuX3NsaWRlci5faGFzQW5pbWF0aW9ufSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9vbkNoYW5nZUZuPy4odGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgIHRoaXMuX3NsaWRlci5zdGVwID4gMFxuICAgICAgPyB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpXG4gICAgICA6IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCwge3dpdGhBbmltYXRpb246IHRoaXMuX3NsaWRlci5faGFzQW5pbWF0aW9ufSk7XG4gIH1cblxuICBfb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgLy8gQWdhaW4sIGRvZXMgbm90aGluZyBpZiBhIHN0ZXAgaXMgZGVmaW5lZCBiZWNhdXNlXG4gICAgLy8gd2Ugd2FudCB0aGUgdmFsdWUgdG8gc25hcCB0byB0aGUgdmFsdWVzIG9uIGlucHV0LlxuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXAgJiYgdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgX29uUG9pbnRlclVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZHJhZ0VuZC5lbWl0KHtzb3VyY2U6IHRoaXMsIHBhcmVudDogdGhpcy5fc2xpZGVyLCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCkpO1xuICAgIH1cbiAgfVxuXG4gIF9jbGFtcCh2OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbih2LCB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoKSwgMCk7XG4gIH1cblxuICBfY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3NsaWRlci5faXNSdGwpIHtcbiAgICAgIHJldHVybiAoMSAtIHRoaXMucGVyY2VudGFnZSkgKiB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wZXJjZW50YWdlICogdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgfVxuXG4gIF9jYWxjVHJhbnNsYXRlWEJ5UG9pbnRlckV2ZW50KGV2ZW50OiBQb2ludGVyRXZlbnQpOiBudW1iZXIge1xuICAgIHJldHVybiBldmVudC5jbGllbnRYIC0gdGhpcy5fc2xpZGVyLl9jYWNoZWRMZWZ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc2V0IHRoZSBzbGlkZXIgd2lkdGggdG8gdGhlIGNvcnJlY3RcbiAgICogZGltZW5zaW9ucyB3aGlsZSB0aGUgdXNlciBpcyBkcmFnZ2luZy5cbiAgICovXG4gIF91cGRhdGVXaWR0aEFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYDAgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgY2FsYygxMDAlICsgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weClgO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNsaWRlciBpbnB1dCB0byBkaXNwcm9wb3J0aW9uYXRlIGRpbWVuc2lvbnMgdG8gYWxsb3cgZm9yIHRvdWNoXG4gICAqIGV2ZW50cyB0byBiZSBjYXB0dXJlZCBvbiB0b3VjaCBkZXZpY2VzLlxuICAgKi9cbiAgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICcwcHgnO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gJ2NhbGMoMTAwJSArIDQ4cHgpJztcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJy0yNHB4JztcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJQnlWYWx1ZShvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2xhdGVYID0gdGhpcy5fY2xhbXAodGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCkpO1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUkob3B0aW9ucyk7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50OiBQb2ludGVyRXZlbnQsIG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVggPSB0aGlzLl9jbGFtcCh0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5UG9pbnRlckV2ZW50KGV2ZW50KSk7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSShvcHRpb25zKTtcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJKG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pIHtcbiAgICB0aGlzLl9zbGlkZXIuX3NldFRyYW5zaXRpb24oISFvcHRpb25zPy53aXRoQW5pbWF0aW9uKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVHJhbnNsYXRlWENoYW5nZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnB1dCdzIHZhbHVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkIHx8IHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgaW5wdXQncyB2YWx1ZSBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayB0byByZWdpc3RlclxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZUZuID0gZm47XG4gICAgdGhpcy5faXNDb250cm9sSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgaW5wdXQgaXMgYmx1cnJlZCBieSB0aGUgdXNlci5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayB0byByZWdpc3RlclxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4gPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgc2xpZGVyLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBUaGUgbmV3IGRpc2FibGVkIHN0YXRlXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuYmx1cigpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclN0YXJ0VGh1bWJdLCBpbnB1dFttYXRTbGlkZXJFbmRUaHVtYl0nLFxuICBleHBvcnRBczogJ21hdFNsaWRlclJhbmdlVGh1bWInLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1JBTkdFX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1JBTkdFX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyUmFuZ2VUaHVtYn0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlclJhbmdlVGh1bWIgZXh0ZW5kcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJSYW5nZVRodW1iIHtcbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0U2libGluZygpOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nID0gdGhpcy5fc2xpZGVyLl9nZXRJbnB1dCh0aGlzLl9pc0VuZFRodW1iID8gX01hdFRodW1iLlNUQVJUIDogX01hdFRodW1iLkVORCkgYXNcbiAgICAgICAgfCBNYXRTbGlkZXJSYW5nZVRodW1iXG4gICAgICAgIHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2libGluZztcbiAgfVxuICBwcml2YXRlIF9zaWJsaW5nOiBNYXRTbGlkZXJSYW5nZVRodW1iIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1pblBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2lzTGVmdFRodW1iICYmIHNpYmxpbmcpIHtcbiAgICAgIHJldHVybiBzaWJsaW5nLnRyYW5zbGF0ZVg7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gdHJhbnNsYXRlWCBwb3NpdGlvbiBhbGxvd2VkIGZvciB0aGlzIHNsaWRlciBpbnB1dCdzIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWF4UG9zKCk6IG51bWJlciB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICh0aGlzLl9pc0xlZnRUaHVtYiAmJiBzaWJsaW5nKSB7XG4gICAgICByZXR1cm4gc2libGluZy50cmFuc2xhdGVYO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgfVxuXG4gIF9zZXRJc0xlZnRUaHVtYigpOiB2b2lkIHtcbiAgICB0aGlzLl9pc0xlZnRUaHVtYiA9XG4gICAgICAodGhpcy5faXNFbmRUaHVtYiAmJiB0aGlzLl9zbGlkZXIuX2lzUnRsKSB8fCAoIXRoaXMuX2lzRW5kVGh1bWIgJiYgIXRoaXMuX3NsaWRlci5faXNSdGwpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBzbGlkZXIgY29ycmVzcG9uZHMgdG8gdGhlIGlucHV0IG9uIHRoZSBsZWZ0IGhhbmQgc2lkZS4gKi9cbiAgX2lzTGVmdFRodW1iOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgc2xpZGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBpbnB1dCB3aXRoIGdyZWF0ZXIgdmFsdWUuICovXG4gIF9pc0VuZFRodW1iOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIF9zbGlkZXI6IF9NYXRTbGlkZXIsXG4gICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgb3ZlcnJpZGUgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIHN1cGVyKF9uZ1pvbmUsIF9lbGVtZW50UmVmLCBfY2RyLCBfc2xpZGVyKTtcbiAgICB0aGlzLl9pc0VuZFRodW1iID0gdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCdtYXRTbGlkZXJFbmRUaHVtYicpO1xuICAgIHRoaXMuX3NldElzTGVmdFRodW1iKCk7XG4gICAgdGhpcy50aHVtYlBvc2l0aW9uID0gdGhpcy5faXNFbmRUaHVtYiA/IF9NYXRUaHVtYi5FTkQgOiBfTWF0VGh1bWIuU1RBUlQ7XG4gIH1cblxuICBvdmVycmlkZSBfZ2V0RGVmYXVsdFZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRW5kVGh1bWIgJiYgdGhpcy5fc2xpZGVyLl9pc1JhbmdlID8gdGhpcy5tYXggOiB0aGlzLm1pbjtcbiAgfVxuXG4gIG92ZXJyaWRlIF9vbklucHV0KCk6IHZvaWQge1xuICAgIHN1cGVyLl9vbklucHV0KCk7XG4gICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICAgIGlmICghdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpO1xuICAgIHRoaXMuZ2V0U2libGluZygpPy5fdXBkYXRlTWluTWF4KCk7XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgICAgdGhpcy5fc2libGluZy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItaW5wdXQtbm8tcG9pbnRlci1ldmVudHMnKTtcbiAgICB9XG4gICAgc3VwZXIuX29uUG9pbnRlckRvd24oZXZlbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlclVwKCk6IHZvaWQge1xuICAgIHN1cGVyLl9vblBvaW50ZXJVcCgpO1xuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21hdC1tZGMtc2xpZGVyLWlucHV0LW5vLXBvaW50ZXItZXZlbnRzJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIuX29uUG9pbnRlck1vdmUoZXZlbnQpO1xuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXAgJiYgdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfZml4VmFsdWUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLl9maXhWYWx1ZShldmVudCk7XG4gICAgdGhpcy5fc2libGluZz8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2NsYW1wKHY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIHRoaXMuZ2V0TWF4UG9zKCkpLCB0aGlzLmdldE1pblBvcygpKTtcbiAgfVxuXG4gIF91cGRhdGVNaW5NYXgoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNFbmRUaHVtYikge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1heCh0aGlzLl9zbGlkZXIubWluLCBzaWJsaW5nLnZhbHVlKTtcbiAgICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1pbih0aGlzLl9zbGlkZXIubWF4LCBzaWJsaW5nLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhBY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3QgbWluV2lkdGggPSB0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cyAqIDIgLSB0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZyAqIDI7XG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoICsgdGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmcgLSBtaW5XaWR0aDtcbiAgICBjb25zdCBwZXJjZW50YWdlID1cbiAgICAgIHRoaXMuX3NsaWRlci5taW4gPCB0aGlzLl9zbGlkZXIubWF4XG4gICAgICAgID8gKHRoaXMubWF4IC0gdGhpcy5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKVxuICAgICAgICA6IDE7XG4gICAgY29uc3Qgd2lkdGggPSBtYXhXaWR0aCAqIHBlcmNlbnRhZ2UgKyBtaW5XaWR0aDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYDAgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weGA7XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICBjb25zdCBtaWRWYWx1ZSA9IHRoaXMuX2lzRW5kVGh1bWJcbiAgICAgID8gdGhpcy52YWx1ZSAtICh0aGlzLnZhbHVlIC0gc2libGluZy52YWx1ZSkgLyAyXG4gICAgICA6IHRoaXMudmFsdWUgKyAoc2libGluZy52YWx1ZSAtIHRoaXMudmFsdWUpIC8gMjtcblxuICAgIGNvbnN0IF9wZXJjZW50YWdlID0gdGhpcy5faXNFbmRUaHVtYlxuICAgICAgPyAodGhpcy5tYXggLSBtaWRWYWx1ZSkgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pXG4gICAgICA6IChtaWRWYWx1ZSAtIHRoaXMubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbik7XG5cbiAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5fc2xpZGVyLm1pbiA8IHRoaXMuX3NsaWRlci5tYXggPyBfcGVyY2VudGFnZSA6IDE7XG5cbiAgICBjb25zdCB3aWR0aCA9IG1heFdpZHRoICogcGVyY2VudGFnZSArIDI0O1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnMHB4JztcblxuICAgIGlmICh0aGlzLl9pc0xlZnRUaHVtYikge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICctMjRweCc7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJy0yNHB4JztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlU3RhdGljU3R5bGVzKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21hdC1zbGlkZXJfX3JpZ2h0LWlucHV0JywgIXRoaXMuX2lzTGVmdFRodW1iKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVNpYmxpbmcoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaWJsaW5nLl91cGRhdGVNaW5NYXgoKTtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHNpYmxpbmcuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpYmxpbmcuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW5wdXQncyB2YWx1ZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG92ZXJyaWRlIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0NvbnRyb2xJbml0aWFsaXplZCB8fCB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICAgIH1cbiAgfVxufVxuIl19