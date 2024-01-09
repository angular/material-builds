/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, forwardRef, inject, Inject, Input, NgZone, Output, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_SLIDER_RANGE_THUMB, MAT_SLIDER_THUMB, MAT_SLIDER, } from './slider-interface';
import { Platform } from '@angular/cdk/platform';
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
            this._translateX = this._tickMarkOffset;
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
        /** The distance in px from the start of the slider track to the first tick mark. */
        this._tickMarkOffset = 3;
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
        this._platform = inject(Platform);
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
        // On IOS, dragging only works if the pointer down happens on the
        // slider thumb and the slider does not receive focus from pointer events.
        if (this._platform.IOS) {
            const isCursorOnSliderThumb = this._slider._isCursorOnSliderThumb(event, this._slider._getThumb(this.thumbPosition)._hostElement.getBoundingClientRect());
            this._isActive = isCursorOnSliderThumb;
            this._updateWidthActive();
            this._slider._updateDimensions();
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
            if (this._platform.SAFARI) {
                this._setIsFocused(false);
            }
            this.dragEnd.emit({ source: this, parent: this._slider, value: this.value });
            // This setTimeout is to prevent the pointerup from triggering a value
            // change on the input based on the inactive width. It's not clear why
            // but for some reason on IOS this race condition is even more common so
            // the timeout needs to be increased.
            setTimeout(() => this._updateWidthInactive(), this._platform.IOS ? 10 : 0);
        }
    }
    _clamp(v) {
        const min = this._tickMarkOffset;
        const max = this._slider._cachedWidth - this._tickMarkOffset;
        return Math.max(Math.min(v, max), min);
    }
    _calcTranslateXByValue() {
        if (this._slider._isRtl) {
            return ((1 - this.percentage) * (this._slider._cachedWidth - this._tickMarkOffset * 2) +
                this._tickMarkOffset);
        }
        return (this.percentage * (this._slider._cachedWidth - this._tickMarkOffset * 2) +
            this._tickMarkOffset);
    }
    _calcTranslateXByPointerEvent(event) {
        return event.clientX - this._slider._cachedLeft;
    }
    /**
     * Used to set the slider width to the correct
     * dimensions while the user is dragging.
     */
    _updateWidthActive() { }
    /**
     * Sets the slider input to disproportionate dimensions to allow for touch
     * events to be captured on touch devices.
     */
    _updateWidthInactive() {
        this._hostElement.style.padding = `0 ${this._slider._inputPadding}px`;
        this._hostElement.style.width = `calc(100% + ${this._slider._inputPadding - this._tickMarkOffset * 2}px)`;
        this._hostElement.style.left = `-${this._slider._rippleRadius - this._tickMarkOffset}px`;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSliderThumb, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatSliderThumb, selector: "input[matSliderThumb]", inputs: { value: "value" }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd" }, host: { attributes: { "type": "range" }, listeners: { "change": "_onChange()", "input": "_onInput()", "blur": "_onBlur()", "focus": "_onFocus()" }, properties: { "attr.aria-valuetext": "_valuetext" }, classAttribute: "mdc-slider__input" }, providers: [
            MAT_SLIDER_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
        ], exportAs: ["matSliderThumb"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSliderThumb, decorators: [{
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
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }], propDecorators: { value: [{
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
        return this._tickMarkOffset;
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
        return this._slider._cachedWidth - this._tickMarkOffset;
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
        const maxWidth = this._slider._cachedWidth + this._slider._inputPadding - minWidth - this._tickMarkOffset * 2;
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
        const maxWidth = this._slider._cachedWidth - this._tickMarkOffset * 2;
        const midValue = this._isEndThumb
            ? this.value - (this.value - sibling.value) / 2
            : this.value + (sibling.value - this.value) / 2;
        const _percentage = this._isEndThumb
            ? (this.max - midValue) / (this._slider.max - this._slider.min)
            : (midValue - this.min) / (this._slider.max - this._slider.min);
        const percentage = this._slider.min < this._slider.max ? _percentage : 1;
        // Extend the native input width by the radius of the ripple
        let ripplePadding = this._slider._rippleRadius;
        // If one of the inputs is maximally sized (the value of both thumbs is
        // equal to the min or max), make that input take up all of the width and
        // make the other unselectable.
        if (percentage === 1) {
            ripplePadding = 48;
        }
        else if (percentage === 0) {
            ripplePadding = 0;
        }
        const width = maxWidth * percentage + ripplePadding;
        this._hostElement.style.width = `${width}px`;
        this._hostElement.style.padding = '0px';
        if (this._isLeftThumb) {
            this._hostElement.style.left = `-${this._slider._rippleRadius - this._tickMarkOffset}px`;
            this._hostElement.style.right = 'auto';
        }
        else {
            this._hostElement.style.left = 'auto';
            this._hostElement.style.right = `-${this._slider._rippleRadius - this._tickMarkOffset}px`;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSliderRangeThumb, deps: [{ token: i0.NgZone }, { token: MAT_SLIDER }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatSliderRangeThumb, selector: "input[matSliderStartThumb], input[matSliderEndThumb]", providers: [
            MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
        ], exportAs: ["matSliderRangeThumb"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSliderRangeThumb, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matSliderStartThumb], input[matSliderEndThumb]',
                    exportAs: 'matSliderRangeThumb',
                    providers: [
                        MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
                        { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
                    ],
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBb0MsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFNTCxzQkFBc0IsRUFDdEIsZ0JBQWdCLEVBQ2hCLFVBQVUsR0FDWCxNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFL0M7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQVE7SUFDbEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxxQ0FBcUMsR0FBUTtJQUN4RCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUM7SUFDbEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7Ozs7Ozs7R0FPRztBQW9CSCxNQUFNLE9BQU8sY0FBYztJQUN6QixJQUNJ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QUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ00sVUFBVSxDQUFDLEtBQVU7UUFDNUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDOzhHQWpOVSxtQkFBbUIsd0NBaURwQixVQUFVO2tHQWpEVCxtQkFBbUIsK0VBTG5CO1lBQ1QscUNBQXFDO1lBQ3JDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBQztTQUNwRTs7MkZBRVUsbUJBQW1CO2tCQVIvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzREFBc0Q7b0JBQ2hFLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFNBQVMsRUFBRTt3QkFDVCxxQ0FBcUM7d0JBQ3JDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcscUJBQXFCLEVBQUM7cUJBQ3BFO2lCQUNGOzswQkFrREksTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBfTWF0VGh1bWIsXG4gIE1hdFNsaWRlckRyYWdFdmVudCxcbiAgX01hdFNsaWRlcixcbiAgX01hdFNsaWRlclJhbmdlVGh1bWIsXG4gIF9NYXRTbGlkZXJUaHVtYixcbiAgTUFUX1NMSURFUl9SQU5HRV9USFVNQixcbiAgTUFUX1NMSURFUl9USFVNQixcbiAgTUFUX1NMSURFUixcbn0gZnJvbSAnLi9zbGlkZXItaW50ZXJmYWNlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyVGh1bWIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHJhbmdlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyUmFuZ2VUaHVtYiksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIHNsaWRlci1zcGVjaWZpYyBiZWhhdmlvcnMgdG8gYW4gaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtc2xpZGVyPmAuXG4gKiBVcCB0byB0d28gbWF5IGJlIHBsYWNlZCBpbnNpZGUgb2YgYSBgPG1hdC1zbGlkZXI+YC5cbiAqXG4gKiBJZiBvbmUgaXMgdXNlZCwgdGhlIHNlbGVjdG9yIGBtYXRTbGlkZXJUaHVtYmAgbXVzdCBiZSB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIG5vcm1hbFxuICogc2xpZGVyLiBJZiB0d28gYXJlIHVzZWQsIHRoZSBzZWxlY3RvcnMgYG1hdFNsaWRlclN0YXJ0VGh1bWJgIGFuZCBgbWF0U2xpZGVyRW5kVGh1bWJgIG11c3QgYmVcbiAqIHVzZWQsIGFuZCB0aGUgb3V0Y29tZSB3aWxsIGJlIGEgcmFuZ2Ugc2xpZGVyIHdpdGggdHdvIHNsaWRlciB0aHVtYnMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclRodW1iXScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyVGh1bWInLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX2lucHV0JyxcbiAgICAndHlwZSc6ICdyYW5nZScsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWV0ZXh0XSc6ICdfdmFsdWV0ZXh0JyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCknLFxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogQ29uc2lkZXIgdXNpbmcgYSBnbG9iYWwgZXZlbnQgbGlzdGVuZXIgaW5zdGVhZC5cbiAgICAvLyBSZWFzb246IEkgaGF2ZSBmb3VuZCBhIHNlbWktY29uc2lzdGVudCB3YXkgdG8gbW91c2UgdXAgd2l0aG91dCB0cmlnZ2VyaW5nIHRoaXMgZXZlbnQuXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyVGh1bWJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJUaHVtYiwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSk7XG4gIH1cbiAgc2V0IHZhbHVlKHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgdmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2hhc1NldEluaXRpYWxWYWx1ZSkge1xuICAgICAgdGhpcy5faW5pdGlhbFZhbHVlID0gdmFsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSB2YWw7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB0aGlzLl9zbGlkZXIuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBgdmFsdWVgIGlzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RhcnRzIGJlaW5nIGRyYWdnZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RvcHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdFbmQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdHJhbnNsYXRlWCBpbiBweCBvZiB0aGUgc2xpZGVyIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHRyYW5zbGF0ZVgoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLm1pbiA+PSB0aGlzLl9zbGlkZXIubWF4KSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gdGhpcy5fdGlja01hcmtPZmZzZXQ7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RyYW5zbGF0ZVggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdHJhbnNsYXRlWCA9IHRoaXMuX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgfVxuICBzZXQgdHJhbnNsYXRlWCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl90cmFuc2xhdGVYID0gdjtcbiAgfVxuICBwcml2YXRlIF90cmFuc2xhdGVYOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoaXMgdGh1bWIgaXMgdGhlIHN0YXJ0IG9yIGVuZCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgdGh1bWJQb3NpdGlvbjogX01hdFRodW1iID0gX01hdFRodW1iLkVORDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgbWluKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KHRoaXMuX2hvc3RFbGVtZW50Lm1pbik7XG4gIH1cbiAgc2V0IG1pbih2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50Lm1pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBtYXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQubWF4KTtcbiAgfVxuICBzZXQgbWF4KHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWF4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQuc3RlcCk7XG4gIH1cbiAgc2V0IHN0ZXAodjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdGVwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgaWYgKHRoaXMuX3NsaWRlci5kaXNhYmxlZCAhPT0gdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fc2xpZGVyLmRpc2FibGVkID0gdGhpcy5kaXNhYmxlZDtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGNvaW5jaWRlcyB3aXRoIHRoZSB2YWx1ZS4gKi9cbiAgZ2V0IHBlcmNlbnRhZ2UoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLm1pbiA+PSB0aGlzLl9zbGlkZXIubWF4KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9pc1J0bCA/IDEgOiAwO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMudmFsdWUgLSB0aGlzLl9zbGlkZXIubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbik7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgZmlsbFBlcmNlbnRhZ2UoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2lzUnRsID8gMSA6IDA7XG4gICAgfVxuICAgIGlmICh0aGlzLl90cmFuc2xhdGVYID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlWCAvIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICAvKiogVGhlIGhvc3QgbmF0aXZlIEhUTUwgaW5wdXQgZWxlbWVudC4gKi9cbiAgX2hvc3RFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIC8qKiBUaGUgYXJpYS12YWx1ZXRleHQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbnB1dCdzIHZhbHVlLiAqL1xuICBfdmFsdWV0ZXh0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgYSBuYXRpdmUgaHRtbCBzbGlkZXIncyBrbm9iLiAqL1xuICBfa25vYlJhZGl1czogbnVtYmVyID0gODtcblxuICAvKiogVGhlIGRpc3RhbmNlIGluIHB4IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBzbGlkZXIgdHJhY2sgdG8gdGhlIGZpcnN0IHRpY2sgbWFyay4gKi9cbiAgX3RpY2tNYXJrT2Zmc2V0ID0gMztcblxuICAvKiogV2hldGhlciB1c2VyJ3MgY3Vyc29yIGlzIGN1cnJlbnRseSBpbiBhIG1vdXNlIGRvd24gc3RhdGUgb24gdGhlIGlucHV0LiAqL1xuICBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgY3VycmVudGx5IGZvY3VzZWQgKGVpdGhlciBieSB0YWIgb3IgYWZ0ZXIgY2xpY2tpbmcpLiAqL1xuICBfaXNGb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFVzZWQgdG8gcmVsYXkgdXBkYXRlcyB0byBfaXNGb2N1c2VkIHRvIHRoZSBzbGlkZXIgdmlzdWFsIHRodW1icy4gKi9cbiAgcHJpdmF0ZSBfc2V0SXNGb2N1c2VkKHY6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9pc0ZvY3VzZWQgPSB2O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGluaXRpYWwgdmFsdWUgaGFzIGJlZW4gc2V0LlxuICAgKiBUaGlzIGV4aXN0cyBiZWNhdXNlIHRoZSBpbml0aWFsIHZhbHVlIGNhbm5vdCBiZSBpbW1lZGlhdGVseSBzZXQgYmVjYXVzZSB0aGUgbWluIGFuZCBtYXhcbiAgICogbXVzdCBmaXJzdCBiZSByZWxheWVkIGZyb20gdGhlIHBhcmVudCBNYXRTbGlkZXIgY29tcG9uZW50LCB3aGljaCBjYW4gb25seSBoYXBwZW4gbGF0ZXJcbiAgICogaW4gdGhlIGNvbXBvbmVudCBsaWZlY3ljbGUuXG4gICAqL1xuICBwcml2YXRlIF9oYXNTZXRJbml0aWFsVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIHN0b3JlZCBpbml0aWFsIHZhbHVlLiAqL1xuICBfaW5pdGlhbFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIERlZmluZWQgd2hlbiBhIHVzZXIgaXMgdXNpbmcgYSBmb3JtIGNvbnRyb2wgdG8gbWFuYWdlIHNsaWRlciB2YWx1ZSAmIHZhbGlkYXRpb24uICovXG4gIHByaXZhdGUgX2Zvcm1Db250cm9sOiBGb3JtQ29udHJvbCB8IHVuZGVmaW5lZDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBVSSB1cGRhdGVzIHNob3VsZCBiZSBza2lwcGVkLlxuICAgKlxuICAgKiBUaGlzIGZsYWcgaXMgdXNlZCB0byBhdm9pZCBmbGlja2VyaW5nXG4gICAqIHdoZW4gY29ycmVjdGluZyB2YWx1ZXMgb24gcG9pbnRlciB1cC9kb3duLlxuICAgKi9cbiAgX3NraXBVSVVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgc2xpZGVyIGlucHV0IHZhbHVlIGNoYW5nZXMuICovXG4gIHByb3RlY3RlZCBfb25DaGFuZ2VGbjogKCh2YWx1ZTogYW55KSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcblxuICAvKiogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHNsaWRlciBpbnB1dCBoYXMgYmVlbiB0b3VjaGVkLiAqL1xuICBwcml2YXRlIF9vblRvdWNoZWRGbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBOZ01vZGVsIGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKlxuICAgKiBUaGlzIGZsYWcgaXMgdXNlZCB0byBpZ25vcmUgZ2hvc3QgbnVsbCBjYWxscyB0b1xuICAgKiB3cml0ZVZhbHVlIHdoaWNoIGNhbiBicmVhayBzbGlkZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDk4OC5cbiAgICovXG4gIHByb3RlY3RlZCBfaXNDb250cm9sSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIHJlYWRvbmx5IF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoTUFUX1NMSURFUikgcHJvdGVjdGVkIF9zbGlkZXI6IF9NYXRTbGlkZXIsXG4gICkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vblBvaW50ZXJEb3duLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9vblBvaW50ZXJNb3ZlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5fb25Qb2ludGVyVXAuYmluZCh0aGlzKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX29uUG9pbnRlckRvd24pO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZSk7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5fb25Qb2ludGVyVXApO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kcmFnU3RhcnQuY29tcGxldGUoKTtcbiAgICB0aGlzLmRyYWdFbmQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGluaXRQcm9wcygpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG5cbiAgICAvLyBJZiB0aGlzIG9yIHRoZSBwYXJlbnQgc2xpZGVyIGlzIGRpc2FibGVkLCBqdXN0IG1ha2UgZXZlcnl0aGluZyBkaXNhYmxlZC5cbiAgICBpZiAodGhpcy5kaXNhYmxlZCAhPT0gdGhpcy5fc2xpZGVyLmRpc2FibGVkKSB7XG4gICAgICAvLyBUaGUgTWF0U2xpZGVyIHNldHRlciBmb3IgZGlzYWJsZWQgd2lsbCByZWxheSB0aGlzIGFuZCBkaXNhYmxlIGJvdGggaW5wdXRzLlxuICAgICAgdGhpcy5fc2xpZGVyLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0ZXAgPSB0aGlzLl9zbGlkZXIuc3RlcDtcbiAgICB0aGlzLm1pbiA9IHRoaXMuX3NsaWRlci5taW47XG4gICAgdGhpcy5tYXggPSB0aGlzLl9zbGlkZXIubWF4O1xuICAgIHRoaXMuX2luaXRWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgaW5pdFVJKCk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gIH1cblxuICBfaW5pdFZhbHVlKCk6IHZvaWQge1xuICAgIHRoaXMuX2hhc1NldEluaXRpYWxWYWx1ZSA9IHRydWU7XG4gICAgaWYgKHRoaXMuX2luaXRpYWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnZhbHVlID0gdGhpcy5faW5pdGlhbFZhbHVlO1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgX2dldERlZmF1bHRWYWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm1pbjtcbiAgfVxuXG4gIF9vbkJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0SXNGb2N1c2VkKGZhbHNlKTtcbiAgICB0aGlzLl9vblRvdWNoZWRGbigpO1xuICB9XG5cbiAgX29uRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0SXNGb2N1c2VkKHRydWUpO1xuICB9XG5cbiAgX29uQ2hhbmdlKCk6IHZvaWQge1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICAvLyBvbmx5IHVzZWQgdG8gaGFuZGxlIHRoZSBlZGdlIGNhc2Ugd2hlcmUgdXNlclxuICAgIC8vIG1vdXNlZG93biBvbiB0aGUgc2xpZGVyIHRoZW4gdXNlcyBhcnJvdyBrZXlzLlxuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoe3dpdGhBbmltYXRpb246IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZUZuPy4odGhpcy52YWx1ZSk7XG4gICAgLy8gaGFuZGxlcyBhcnJvd2luZyBhbmQgdXBkYXRpbmcgdGhlIHZhbHVlIHdoZW5cbiAgICAvLyBhIHN0ZXAgaXMgZGVmaW5lZC5cbiAgICBpZiAodGhpcy5fc2xpZGVyLnN0ZXAgfHwgIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSh7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gIH1cblxuICBfb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICAvLyBvbmx5IHVzZWQgdG8gaGFuZGxlIHdoZW4gdGhlIHZhbHVlIGNoYW5nZVxuICAgIC8vIG9yaWdpbmF0ZXMgb3V0c2lkZSBvZiB0aGUgc2xpZGVyLlxuICAgIGlmICghdGhpcy5faXNBY3RpdmUgfHwgIXRoaXMuX2lzRm9jdXNlZCkge1xuICAgICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICB9XG4gICAgdGhpcy5fc2xpZGVyLmRpc2FibGVkID0gdGhpcy5fZm9ybUNvbnRyb2whLmRpc2FibGVkO1xuICB9XG5cbiAgX29uUG9pbnRlckRvd24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE9uIElPUywgZHJhZ2dpbmcgb25seSB3b3JrcyBpZiB0aGUgcG9pbnRlciBkb3duIGhhcHBlbnMgb24gdGhlXG4gICAgLy8gc2xpZGVyIHRodW1iIGFuZCB0aGUgc2xpZGVyIGRvZXMgbm90IHJlY2VpdmUgZm9jdXMgZnJvbSBwb2ludGVyIGV2ZW50cy5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uSU9TKSB7XG4gICAgICBjb25zdCBpc0N1cnNvck9uU2xpZGVyVGh1bWIgPSB0aGlzLl9zbGlkZXIuX2lzQ3Vyc29yT25TbGlkZXJUaHVtYihcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIHRoaXMuX3NsaWRlci5fZ2V0VGh1bWIodGhpcy50aHVtYlBvc2l0aW9uKS5faG9zdEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IGlzQ3Vyc29yT25TbGlkZXJUaHVtYjtcbiAgICAgIHRoaXMuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgICB0aGlzLl9zbGlkZXIuX3VwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5fc2V0SXNGb2N1c2VkKHRydWUpO1xuICAgIHRoaXMuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgdGhpcy5fc2xpZGVyLl91cGRhdGVEaW1lbnNpb25zKCk7XG5cbiAgICAvLyBEb2VzIG5vdGhpbmcgaWYgYSBzdGVwIGlzIGRlZmluZWQgYmVjYXVzZSB3ZVxuICAgIC8vIHdhbnQgdGhlIHZhbHVlIHRvIHNuYXAgdG8gdGhlIHZhbHVlcyBvbiBpbnB1dC5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9oYW5kbGVWYWx1ZUNvcnJlY3Rpb24oZXZlbnQpO1xuICAgICAgdGhpcy5kcmFnU3RhcnQuZW1pdCh7c291cmNlOiB0aGlzLCBwYXJlbnQ6IHRoaXMuX3NsaWRlciwgdmFsdWU6IHRoaXMudmFsdWV9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgb24gcG9pbnRlciB1cC9kb3duLlxuICAgKlxuICAgKiBDYWxsZWQgb24gcG9pbnRlciBkb3duIGFuZCB1cCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBzZXQgYmFzZWRcbiAgICogb24gdGhlIGluYWN0aXZlIHdpZHRoIGluc3RlYWQgb2YgdGhlIGFjdGl2ZSB3aWR0aC5cbiAgICovXG4gIHByaXZhdGUgX2hhbmRsZVZhbHVlQ29ycmVjdGlvbihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBVSSB3aXRoIHRoZSBjdXJyZW50IHZhbHVlISBUaGUgdmFsdWUgb24gcG9pbnRlcmRvd25cbiAgICAvLyBhbmQgcG9pbnRlcnVwIGlzIGNhbGN1bGF0ZWQgaW4gdGhlIHNwbGl0IHNlY29uZCBiZWZvcmUgdGhlIGlucHV0KHMpXG4gICAgLy8gcmVzaXplLiBTZWUgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKSBhbmQgX3VwZGF0ZVdpZHRoQWN0aXZlKCkgZm9yIG1vcmVcbiAgICAvLyBkZXRhaWxzLlxuICAgIHRoaXMuX3NraXBVSVVwZGF0ZSA9IHRydWU7XG5cbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBnZXRzIHRyaWdnZXJlZCBiZWZvcmUgdGhlIGFjdHVhbCB2YWx1ZSBvZiB0aGVcbiAgICAvLyBzbGlkZXIgaXMgdXBkYXRlZC4gVGhpcyBtZWFucyBpZiB3ZSB3ZXJlIHRvIHNldCB0aGUgdmFsdWUgaGVyZSwgaXRcbiAgICAvLyB3b3VsZCBpbW1lZGlhdGVseSBiZSBvdmVyd3JpdHRlbi4gVXNpbmcgc2V0VGltZW91dCBlbnN1cmVzIHRoZSBzZXR0aW5nXG4gICAgLy8gb2YgdGhlIHZhbHVlIGhhcHBlbnMgYWZ0ZXIgdGhlIHZhbHVlIGhhcyBiZWVuIHVwZGF0ZWQgYnkgdGhlXG4gICAgLy8gcG9pbnRlcmRvd24gZXZlbnQuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9za2lwVUlVcGRhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2ZpeFZhbHVlKGV2ZW50KTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIC8qKiBDb3JyZWN0cyB0aGUgdmFsdWUgb2YgdGhlIHNsaWRlciBiYXNlZCBvbiB0aGUgcG9pbnRlciBldmVudCdzIHBvc2l0aW9uLiAqL1xuICBfZml4VmFsdWUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHhQb3MgPSBldmVudC5jbGllbnRYIC0gdGhpcy5fc2xpZGVyLl9jYWNoZWRMZWZ0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICBjb25zdCBzdGVwID0gdGhpcy5fc2xpZGVyLnN0ZXAgPT09IDAgPyAxIDogdGhpcy5fc2xpZGVyLnN0ZXA7XG4gICAgY29uc3QgbnVtU3RlcHMgPSBNYXRoLmZsb29yKCh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbikgLyBzdGVwKTtcbiAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5fc2xpZGVyLl9pc1J0bCA/IDEgLSB4UG9zIC8gd2lkdGggOiB4UG9zIC8gd2lkdGg7XG5cbiAgICAvLyBUbyBlbnN1cmUgdGhlIHBlcmNlbnRhZ2UgaXMgcm91bmRlZCB0byB0aGUgbmVjZXNzYXJ5IG51bWJlciBvZiBkZWNpbWFscy5cbiAgICBjb25zdCBmaXhlZFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKHBlcmNlbnRhZ2UgKiBudW1TdGVwcykgLyBudW1TdGVwcztcblxuICAgIGNvbnN0IGltcHJlY2lzZVZhbHVlID1cbiAgICAgIGZpeGVkUGVyY2VudGFnZSAqICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbikgKyB0aGlzLl9zbGlkZXIubWluO1xuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5yb3VuZChpbXByZWNpc2VWYWx1ZSAvIHN0ZXApICogc3RlcDtcbiAgICBjb25zdCBwcmV2VmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgaWYgKHZhbHVlID09PSBwcmV2VmFsdWUpIHtcbiAgICAgIC8vIEJlY2F1c2Ugd2UgcHJldmVudGVkIFVJIHVwZGF0ZXMsIGlmIGl0IHR1cm5zIG91dCB0aGF0IHRoZSByYWNlXG4gICAgICAvLyBjb25kaXRpb24gZGlkbid0IGhhcHBlbiBhbmQgdGhlIHZhbHVlIGlzIGFscmVhZHkgY29ycmVjdCwgd2VcbiAgICAgIC8vIGhhdmUgdG8gYXBwbHkgdGhlIHVpIHVwZGF0ZXMgbm93LlxuICAgICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgICAgdGhpcy5fc2xpZGVyLnN0ZXAgPiAwXG4gICAgICAgID8gdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKVxuICAgICAgICA6IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCwge3dpdGhBbmltYXRpb246IHRoaXMuX3NsaWRlci5faGFzQW5pbWF0aW9ufSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9vbkNoYW5nZUZuPy4odGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgIHRoaXMuX3NsaWRlci5zdGVwID4gMFxuICAgICAgPyB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpXG4gICAgICA6IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCwge3dpdGhBbmltYXRpb246IHRoaXMuX3NsaWRlci5faGFzQW5pbWF0aW9ufSk7XG4gIH1cblxuICBfb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgLy8gQWdhaW4sIGRvZXMgbm90aGluZyBpZiBhIHN0ZXAgaXMgZGVmaW5lZCBiZWNhdXNlXG4gICAgLy8gd2Ugd2FudCB0aGUgdmFsdWUgdG8gc25hcCB0byB0aGUgdmFsdWVzIG9uIGlucHV0LlxuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXAgJiYgdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgX29uUG9pbnRlclVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5TQUZBUkkpIHtcbiAgICAgICAgdGhpcy5fc2V0SXNGb2N1c2VkKGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhZ0VuZC5lbWl0KHtzb3VyY2U6IHRoaXMsIHBhcmVudDogdGhpcy5fc2xpZGVyLCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuXG4gICAgICAvLyBUaGlzIHNldFRpbWVvdXQgaXMgdG8gcHJldmVudCB0aGUgcG9pbnRlcnVwIGZyb20gdHJpZ2dlcmluZyBhIHZhbHVlXG4gICAgICAvLyBjaGFuZ2Ugb24gdGhlIGlucHV0IGJhc2VkIG9uIHRoZSBpbmFjdGl2ZSB3aWR0aC4gSXQncyBub3QgY2xlYXIgd2h5XG4gICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIG9uIElPUyB0aGlzIHJhY2UgY29uZGl0aW9uIGlzIGV2ZW4gbW9yZSBjb21tb24gc29cbiAgICAgIC8vIHRoZSB0aW1lb3V0IG5lZWRzIHRvIGJlIGluY3JlYXNlZC5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpLCB0aGlzLl9wbGF0Zm9ybS5JT1MgPyAxMCA6IDApO1xuICAgIH1cbiAgfVxuXG4gIF9jbGFtcCh2OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuX3RpY2tNYXJrT2Zmc2V0O1xuICAgIGNvbnN0IG1heCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGggLSB0aGlzLl90aWNrTWFya09mZnNldDtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odiwgbWF4KSwgbWluKTtcbiAgfVxuXG4gIF9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLl9pc1J0bCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgKDEgLSB0aGlzLnBlcmNlbnRhZ2UpICogKHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGggLSB0aGlzLl90aWNrTWFya09mZnNldCAqIDIpICtcbiAgICAgICAgdGhpcy5fdGlja01hcmtPZmZzZXRcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnBlcmNlbnRhZ2UgKiAodGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCAtIHRoaXMuX3RpY2tNYXJrT2Zmc2V0ICogMikgK1xuICAgICAgdGhpcy5fdGlja01hcmtPZmZzZXRcbiAgICApO1xuICB9XG5cbiAgX2NhbGNUcmFuc2xhdGVYQnlQb2ludGVyRXZlbnQoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGV2ZW50LmNsaWVudFggLSB0aGlzLl9zbGlkZXIuX2NhY2hlZExlZnQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBzZXQgdGhlIHNsaWRlciB3aWR0aCB0byB0aGUgY29ycmVjdFxuICAgKiBkaW1lbnNpb25zIHdoaWxlIHRoZSB1c2VyIGlzIGRyYWdnaW5nLlxuICAgKi9cbiAgX3VwZGF0ZVdpZHRoQWN0aXZlKCk6IHZvaWQge31cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2xpZGVyIGlucHV0IHRvIGRpc3Byb3BvcnRpb25hdGUgZGltZW5zaW9ucyB0byBhbGxvdyBmb3IgdG91Y2hcbiAgICogZXZlbnRzIHRvIGJlIGNhcHR1cmVkIG9uIHRvdWNoIGRldmljZXMuXG4gICAqL1xuICBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYDAgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgY2FsYygxMDAlICsgJHtcbiAgICAgIHRoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nIC0gdGhpcy5fdGlja01hcmtPZmZzZXQgKiAyXG4gICAgfXB4KWA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9IGAtJHt0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cyAtIHRoaXMuX3RpY2tNYXJrT2Zmc2V0fXB4YDtcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJQnlWYWx1ZShvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2xhdGVYID0gdGhpcy5fY2xhbXAodGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCkpO1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUkob3B0aW9ucyk7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50OiBQb2ludGVyRXZlbnQsIG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVggPSB0aGlzLl9jbGFtcCh0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5UG9pbnRlckV2ZW50KGV2ZW50KSk7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSShvcHRpb25zKTtcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJKG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pIHtcbiAgICB0aGlzLl9zbGlkZXIuX3NldFRyYW5zaXRpb24oISFvcHRpb25zPy53aXRoQW5pbWF0aW9uKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVHJhbnNsYXRlWENoYW5nZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnB1dCdzIHZhbHVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkIHx8IHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgaW5wdXQncyB2YWx1ZSBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayB0byByZWdpc3RlclxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZUZuID0gZm47XG4gICAgdGhpcy5faXNDb250cm9sSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgaW5wdXQgaXMgYmx1cnJlZCBieSB0aGUgdXNlci5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayB0byByZWdpc3RlclxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4gPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgc2xpZGVyLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBUaGUgbmV3IGRpc2FibGVkIHN0YXRlXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuYmx1cigpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclN0YXJ0VGh1bWJdLCBpbnB1dFttYXRTbGlkZXJFbmRUaHVtYl0nLFxuICBleHBvcnRBczogJ21hdFNsaWRlclJhbmdlVGh1bWInLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1JBTkdFX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1JBTkdFX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyUmFuZ2VUaHVtYn0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlclJhbmdlVGh1bWIgZXh0ZW5kcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJSYW5nZVRodW1iIHtcbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0U2libGluZygpOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nID0gdGhpcy5fc2xpZGVyLl9nZXRJbnB1dCh0aGlzLl9pc0VuZFRodW1iID8gX01hdFRodW1iLlNUQVJUIDogX01hdFRodW1iLkVORCkgYXNcbiAgICAgICAgfCBNYXRTbGlkZXJSYW5nZVRodW1iXG4gICAgICAgIHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2libGluZztcbiAgfVxuICBwcml2YXRlIF9zaWJsaW5nOiBNYXRTbGlkZXJSYW5nZVRodW1iIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1pblBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2lzTGVmdFRodW1iICYmIHNpYmxpbmcpIHtcbiAgICAgIHJldHVybiBzaWJsaW5nLnRyYW5zbGF0ZVg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90aWNrTWFya09mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1heFBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAodGhpcy5faXNMZWZ0VGh1bWIgJiYgc2libGluZykge1xuICAgICAgcmV0dXJuIHNpYmxpbmcudHJhbnNsYXRlWDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGggLSB0aGlzLl90aWNrTWFya09mZnNldDtcbiAgfVxuXG4gIF9zZXRJc0xlZnRUaHVtYigpOiB2b2lkIHtcbiAgICB0aGlzLl9pc0xlZnRUaHVtYiA9XG4gICAgICAodGhpcy5faXNFbmRUaHVtYiAmJiB0aGlzLl9zbGlkZXIuX2lzUnRsKSB8fCAoIXRoaXMuX2lzRW5kVGh1bWIgJiYgIXRoaXMuX3NsaWRlci5faXNSdGwpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBzbGlkZXIgY29ycmVzcG9uZHMgdG8gdGhlIGlucHV0IG9uIHRoZSBsZWZ0IGhhbmQgc2lkZS4gKi9cbiAgX2lzTGVmdFRodW1iOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgc2xpZGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBpbnB1dCB3aXRoIGdyZWF0ZXIgdmFsdWUuICovXG4gIF9pc0VuZFRodW1iOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIF9zbGlkZXI6IF9NYXRTbGlkZXIsXG4gICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgb3ZlcnJpZGUgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIHN1cGVyKF9uZ1pvbmUsIF9lbGVtZW50UmVmLCBfY2RyLCBfc2xpZGVyKTtcbiAgICB0aGlzLl9pc0VuZFRodW1iID0gdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCdtYXRTbGlkZXJFbmRUaHVtYicpO1xuICAgIHRoaXMuX3NldElzTGVmdFRodW1iKCk7XG4gICAgdGhpcy50aHVtYlBvc2l0aW9uID0gdGhpcy5faXNFbmRUaHVtYiA/IF9NYXRUaHVtYi5FTkQgOiBfTWF0VGh1bWIuU1RBUlQ7XG4gIH1cblxuICBvdmVycmlkZSBfZ2V0RGVmYXVsdFZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRW5kVGh1bWIgJiYgdGhpcy5fc2xpZGVyLl9pc1JhbmdlID8gdGhpcy5tYXggOiB0aGlzLm1pbjtcbiAgfVxuXG4gIG92ZXJyaWRlIF9vbklucHV0KCk6IHZvaWQge1xuICAgIHN1cGVyLl9vbklucHV0KCk7XG4gICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICAgIGlmICghdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpO1xuICAgIHRoaXMuZ2V0U2libGluZygpPy5fdXBkYXRlTWluTWF4KCk7XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgICAgdGhpcy5fc2libGluZy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItaW5wdXQtbm8tcG9pbnRlci1ldmVudHMnKTtcbiAgICB9XG4gICAgc3VwZXIuX29uUG9pbnRlckRvd24oZXZlbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlclVwKCk6IHZvaWQge1xuICAgIHN1cGVyLl9vblBvaW50ZXJVcCgpO1xuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21hdC1tZGMtc2xpZGVyLWlucHV0LW5vLXBvaW50ZXItZXZlbnRzJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIuX29uUG9pbnRlck1vdmUoZXZlbnQpO1xuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXAgJiYgdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfZml4VmFsdWUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLl9maXhWYWx1ZShldmVudCk7XG4gICAgdGhpcy5fc2libGluZz8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2NsYW1wKHY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIHRoaXMuZ2V0TWF4UG9zKCkpLCB0aGlzLmdldE1pblBvcygpKTtcbiAgfVxuXG4gIF91cGRhdGVNaW5NYXgoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNFbmRUaHVtYikge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1heCh0aGlzLl9zbGlkZXIubWluLCBzaWJsaW5nLnZhbHVlKTtcbiAgICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1pbih0aGlzLl9zbGlkZXIubWF4LCBzaWJsaW5nLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhBY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3QgbWluV2lkdGggPSB0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cyAqIDIgLSB0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZyAqIDI7XG4gICAgY29uc3QgbWF4V2lkdGggPVxuICAgICAgdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCArIHRoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nIC0gbWluV2lkdGggLSB0aGlzLl90aWNrTWFya09mZnNldCAqIDI7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9XG4gICAgICB0aGlzLl9zbGlkZXIubWluIDwgdGhpcy5fc2xpZGVyLm1heFxuICAgICAgICA/ICh0aGlzLm1heCAtIHRoaXMubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbilcbiAgICAgICAgOiAxO1xuICAgIGNvbnN0IHdpZHRoID0gbWF4V2lkdGggKiBwZXJjZW50YWdlICsgbWluV2lkdGg7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9IGAwICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHhgO1xuICB9XG5cbiAgb3ZlcnJpZGUgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGggLSB0aGlzLl90aWNrTWFya09mZnNldCAqIDI7XG4gICAgY29uc3QgbWlkVmFsdWUgPSB0aGlzLl9pc0VuZFRodW1iXG4gICAgICA/IHRoaXMudmFsdWUgLSAodGhpcy52YWx1ZSAtIHNpYmxpbmcudmFsdWUpIC8gMlxuICAgICAgOiB0aGlzLnZhbHVlICsgKHNpYmxpbmcudmFsdWUgLSB0aGlzLnZhbHVlKSAvIDI7XG5cbiAgICBjb25zdCBfcGVyY2VudGFnZSA9IHRoaXMuX2lzRW5kVGh1bWJcbiAgICAgID8gKHRoaXMubWF4IC0gbWlkVmFsdWUpIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKVxuICAgICAgOiAobWlkVmFsdWUgLSB0aGlzLm1pbikgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5taW4gPCB0aGlzLl9zbGlkZXIubWF4ID8gX3BlcmNlbnRhZ2UgOiAxO1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBuYXRpdmUgaW5wdXQgd2lkdGggYnkgdGhlIHJhZGl1cyBvZiB0aGUgcmlwcGxlXG4gICAgbGV0IHJpcHBsZVBhZGRpbmcgPSB0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cztcblxuICAgIC8vIElmIG9uZSBvZiB0aGUgaW5wdXRzIGlzIG1heGltYWxseSBzaXplZCAodGhlIHZhbHVlIG9mIGJvdGggdGh1bWJzIGlzXG4gICAgLy8gZXF1YWwgdG8gdGhlIG1pbiBvciBtYXgpLCBtYWtlIHRoYXQgaW5wdXQgdGFrZSB1cCBhbGwgb2YgdGhlIHdpZHRoIGFuZFxuICAgIC8vIG1ha2UgdGhlIG90aGVyIHVuc2VsZWN0YWJsZS5cbiAgICBpZiAocGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgcmlwcGxlUGFkZGluZyA9IDQ4O1xuICAgIH0gZWxzZSBpZiAocGVyY2VudGFnZSA9PT0gMCkge1xuICAgICAgcmlwcGxlUGFkZGluZyA9IDA7XG4gICAgfVxuXG4gICAgY29uc3Qgd2lkdGggPSBtYXhXaWR0aCAqIHBlcmNlbnRhZ2UgKyByaXBwbGVQYWRkaW5nO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnMHB4JztcblxuICAgIGlmICh0aGlzLl9pc0xlZnRUaHVtYikge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9IGAtJHt0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cyAtIHRoaXMuX3RpY2tNYXJrT2Zmc2V0fXB4YDtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucmlnaHQgPSBgLSR7dGhpcy5fc2xpZGVyLl9yaXBwbGVSYWRpdXMgLSB0aGlzLl90aWNrTWFya09mZnNldH1weGA7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZVN0YXRpY1N0eWxlcygpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtYXQtc2xpZGVyX19yaWdodC1pbnB1dCcsICF0aGlzLl9pc0xlZnRUaHVtYik7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTaWJsaW5nKCk6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2libGluZy5fdXBkYXRlTWluTWF4KCk7XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICBzaWJsaW5nLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWJsaW5nLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGlucHV0J3MgdmFsdWUuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBpbnB1dFxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvdmVycmlkZSB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNDb250cm9sSW5pdGlhbGl6ZWQgfHwgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==