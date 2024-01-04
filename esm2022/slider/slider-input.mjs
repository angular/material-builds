/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { booleanAttribute, ChangeDetectorRef, Directive, ElementRef, EventEmitter, forwardRef, inject, Inject, Input, NgZone, numberAttribute, Output, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { _MatThumb, MAT_SLIDER_RANGE_THUMB, MAT_SLIDER_THUMB, MAT_SLIDER, } from './slider-interface';
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
        return numberAttribute(this._hostElement.value, 0);
    }
    set value(value) {
        value = isNaN(value) ? 0 : value;
        const stringValue = value + '';
        if (!this._hasSetInitialValue) {
            this._initialValue = stringValue;
            return;
        }
        if (this._isActive) {
            return;
        }
        this._setValue(stringValue);
    }
    /**
     * Handles programmatic value setting. This has been split out to
     * allow the range thumb to override it and add additional necessary logic.
     */
    _setValue(value) {
        this._hostElement.value = value;
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
        return numberAttribute(this._hostElement.min, 0);
    }
    set min(v) {
        this._hostElement.min = v + '';
        this._cdr.detectChanges();
    }
    /** @docs-private */
    get max() {
        return numberAttribute(this._hostElement.max, 0);
    }
    set max(v) {
        this._hostElement.max = v + '';
        this._cdr.detectChanges();
    }
    get step() {
        return numberAttribute(this._hostElement.step, 0);
    }
    set step(v) {
        this._hostElement.step = v + '';
        this._cdr.detectChanges();
    }
    /** @docs-private */
    get disabled() {
        return booleanAttribute(this._hostElement.disabled);
    }
    set disabled(v) {
        this._hostElement.disabled = v;
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
        this.thumbPosition = _MatThumb.END;
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
        return Math.max(Math.min(v, this._slider._cachedWidth), 0);
    }
    _calcTranslateXByValue() {
        if (this._slider._isRtl) {
            return (1 - this.percentage) * this._slider._cachedWidth;
        }
        const tickMarkOffset = 3; // The spaces before & after the start & end tick marks.
        return this.percentage * (this._slider._cachedWidth - tickMarkOffset * 2) + tickMarkOffset;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSliderThumb, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.1.0-next.5", type: MatSliderThumb, isStandalone: true, selector: "input[matSliderThumb]", inputs: { value: ["value", "value", numberAttribute] }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd" }, host: { attributes: { "type": "range" }, listeners: { "change": "_onChange()", "input": "_onInput()", "blur": "_onBlur()", "focus": "_onFocus()" }, properties: { "attr.aria-valuetext": "_valuetext" }, classAttribute: "mdc-slider__input" }, providers: [
            MAT_SLIDER_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
        ], exportAs: ["matSliderThumb"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSliderThumb, decorators: [{
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
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }], propDecorators: { value: [{
                type: Input,
                args: [{ transform: numberAttribute }]
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
            this._sibling = this._slider._getInput(this._isEndThumb ? _MatThumb.START : _MatThumb.END);
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
        this.thumbPosition = this._isEndThumb ? _MatThumb.END : _MatThumb.START;
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
    _setValue(value) {
        super._setValue(value);
        this._updateWidthInactive();
        this._updateSibling();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSliderRangeThumb, deps: [{ token: i0.NgZone }, { token: MAT_SLIDER }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatSliderRangeThumb, isStandalone: true, selector: "input[matSliderStartThumb], input[matSliderEndThumb]", providers: [
            MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
        ], exportAs: ["matSliderRangeThumb"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSliderRangeThumb, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matSliderStartThumb], input[matSliderEndThumb]',
                    exportAs: 'matSliderRangeThumb',
                    providers: [
                        MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
                        { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
                    ],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SLIDER]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFDTixlQUFlLEVBRWYsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBb0MsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFDTCxTQUFTLEVBS1Qsc0JBQXNCLEVBQ3RCLGdCQUFnQixFQUNoQixVQUFVLEdBQ1gsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRS9DOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFRO0lBQ2xELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQVE7SUFDeEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBQ2xELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFxQkgsTUFBTSxPQUFPLGNBQWM7SUFDekIsSUFDSSxLQUFLO1FBQ1AsT0FBTyxlQUFlLENBQUMs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QUFFLFdBQVcscUJBQXFCLEVBQUM7cUJBQ3BFO29CQUNELFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7MEJBa0RJLE1BQU07MkJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBib29sZWFuQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBudW1iZXJBdHRyaWJ1dGUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIEZvcm1Db250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgTWF0U2xpZGVyRHJhZ0V2ZW50LFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgX01hdFNsaWRlclRodW1iLFxuICBNQVRfU0xJREVSX1JBTkdFX1RIVU1CLFxuICBNQVRfU0xJREVSX1RIVU1CLFxuICBNQVRfU0xJREVSLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcblxuLyoqXG4gKiBQcm92aWRlciB0aGF0IGFsbG93cyB0aGUgc2xpZGVyIHRodW1iIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVSX1RIVU1CX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXJUaHVtYiksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBQcm92aWRlciB0aGF0IGFsbG93cyB0aGUgcmFuZ2Ugc2xpZGVyIHRodW1iIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVSX1JBTkdFX1RIVU1CX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXJSYW5nZVRodW1iKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGFkZHMgc2xpZGVyLXNwZWNpZmljIGJlaGF2aW9ycyB0byBhbiBpbnB1dCBlbGVtZW50IGluc2lkZSBgPG1hdC1zbGlkZXI+YC5cbiAqIFVwIHRvIHR3byBtYXkgYmUgcGxhY2VkIGluc2lkZSBvZiBhIGA8bWF0LXNsaWRlcj5gLlxuICpcbiAqIElmIG9uZSBpcyB1c2VkLCB0aGUgc2VsZWN0b3IgYG1hdFNsaWRlclRodW1iYCBtdXN0IGJlIHVzZWQsIGFuZCB0aGUgb3V0Y29tZSB3aWxsIGJlIGEgbm9ybWFsXG4gKiBzbGlkZXIuIElmIHR3byBhcmUgdXNlZCwgdGhlIHNlbGVjdG9ycyBgbWF0U2xpZGVyU3RhcnRUaHVtYmAgYW5kIGBtYXRTbGlkZXJFbmRUaHVtYmAgbXVzdCBiZVxuICogdXNlZCwgYW5kIHRoZSBvdXRjb21lIHdpbGwgYmUgYSByYW5nZSBzbGlkZXIgd2l0aCB0d28gc2xpZGVyIHRodW1icy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0U2xpZGVyVGh1bWJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXJUaHVtYicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLXNsaWRlcl9faW5wdXQnLFxuICAgICd0eXBlJzogJ3JhbmdlJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZXRleHRdJzogJ192YWx1ZXRleHQnLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoKScsXG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBDb25zaWRlciB1c2luZyBhIGdsb2JhbCBldmVudCBsaXN0ZW5lciBpbnN0ZWFkLlxuICAgIC8vIFJlYXNvbjogSSBoYXZlIGZvdW5kIGEgc2VtaS1jb25zaXN0ZW50IHdheSB0byBtb3VzZSB1cCB3aXRob3V0IHRyaWdnZXJpbmcgdGhpcyBldmVudC5cbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9TTElERVJfVEhVTUJfVkFMVUVfQUNDRVNTT1IsXG4gICAge3Byb3ZpZGU6IE1BVF9TTElERVJfVEhVTUIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJUaHVtYn0sXG4gIF0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlclRodW1iIGltcGxlbWVudHMgX01hdFNsaWRlclRodW1iLCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgQElucHV0KHt0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZX0pXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBudW1iZXJBdHRyaWJ1dGUodGhpcy5faG9zdEVsZW1lbnQudmFsdWUsIDApO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdmFsdWUgPSBpc05hTih2YWx1ZSkgPyAwIDogdmFsdWU7XG4gICAgY29uc3Qgc3RyaW5nVmFsdWUgPSB2YWx1ZSArICcnO1xuICAgIGlmICghdGhpcy5faGFzU2V0SW5pdGlhbFZhbHVlKSB7XG4gICAgICB0aGlzLl9pbml0aWFsVmFsdWUgPSBzdHJpbmdWYWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3NldFZhbHVlKHN0cmluZ1ZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHByb2dyYW1tYXRpYyB2YWx1ZSBzZXR0aW5nLiBUaGlzIGhhcyBiZWVuIHNwbGl0IG91dCB0b1xuICAgKiBhbGxvdyB0aGUgcmFuZ2UgdGh1bWIgdG8gb3ZlcnJpZGUgaXQgYW5kIGFkZCBhZGRpdGlvbmFsIG5lY2Vzc2FyeSBsb2dpYy5cbiAgICovXG4gIHByb3RlY3RlZCBfc2V0VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB0aGlzLl9zbGlkZXIuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGB2YWx1ZWAgaXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBzdGFydHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdTdGFydDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBzdG9wcyBiZWluZyBkcmFnZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ0VuZDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB0cmFuc2xhdGVYIGluIHB4IG9mIHRoZSBzbGlkZXIgdmlzdWFsIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgdHJhbnNsYXRlWCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIubWluID49IHRoaXMuX3NsaWRlci5tYXgpIHtcbiAgICAgIHRoaXMuX3RyYW5zbGF0ZVggPSAwO1xuICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgfVxuICAgIGlmICh0aGlzLl90cmFuc2xhdGVYID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RyYW5zbGF0ZVggPSB0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gIH1cbiAgc2V0IHRyYW5zbGF0ZVgodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRlWCA9IHY7XG4gIH1cbiAgcHJpdmF0ZSBfdHJhbnNsYXRlWDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGlzIHRodW1iIGlzIHRoZSBzdGFydCBvciBlbmQgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHRodW1iUG9zaXRpb246IF9NYXRUaHVtYiA9IF9NYXRUaHVtYi5FTkQ7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1pbigpOiBudW1iZXIge1xuICAgIHJldHVybiBudW1iZXJBdHRyaWJ1dGUodGhpcy5faG9zdEVsZW1lbnQubWluLCAwKTtcbiAgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50Lm1pbiA9IHYgKyAnJztcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiBudW1iZXJBdHRyaWJ1dGUodGhpcy5faG9zdEVsZW1lbnQubWF4LCAwKTtcbiAgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50Lm1heCA9IHYgKyAnJztcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbnVtYmVyQXR0cmlidXRlKHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAsIDApO1xuICB9XG4gIHNldCBzdGVwKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAgPSB2ICsgJyc7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYm9vbGVhbkF0dHJpYnV0ZSh0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCA9IHY7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIGlmICh0aGlzLl9zbGlkZXIuZGlzYWJsZWQgIT09IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgdGhhdCBjb2luY2lkZXMgd2l0aCB0aGUgdmFsdWUuICovXG4gIGdldCBwZXJjZW50YWdlKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3NsaWRlci5taW4gPj0gdGhpcy5fc2xpZGVyLm1heCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIDogMDtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLnZhbHVlIC0gdGhpcy5fc2xpZGVyLm1pbikgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGZpbGxQZXJjZW50YWdlKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9pc1J0bCA/IDEgOiAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5fdHJhbnNsYXRlWCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVggLyB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICB9XG5cbiAgLyoqIFRoZSBob3N0IG5hdGl2ZSBIVE1MIGlucHV0IGVsZW1lbnQuICovXG4gIF9ob3N0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIGFyaWEtdmFsdWV0ZXh0IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW5wdXQncyB2YWx1ZS4gKi9cbiAgX3ZhbHVldGV4dDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgcmFkaXVzIG9mIGEgbmF0aXZlIGh0bWwgc2xpZGVyJ3Mga25vYi4gKi9cbiAgX2tub2JSYWRpdXM6IG51bWJlciA9IDg7XG5cbiAgLyoqIFdoZXRoZXIgdXNlcidzIGN1cnNvciBpcyBjdXJyZW50bHkgaW4gYSBtb3VzZSBkb3duIHN0YXRlIG9uIHRoZSBpbnB1dC4gKi9cbiAgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGN1cnJlbnRseSBmb2N1c2VkIChlaXRoZXIgYnkgdGFiIG9yIGFmdGVyIGNsaWNraW5nKS4gKi9cbiAgX2lzRm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBVc2VkIHRvIHJlbGF5IHVwZGF0ZXMgdG8gX2lzRm9jdXNlZCB0byB0aGUgc2xpZGVyIHZpc3VhbCB0aHVtYnMuICovXG4gIHByaXZhdGUgX3NldElzRm9jdXNlZCh2OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5faXNGb2N1c2VkID0gdjtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbml0aWFsIHZhbHVlIGhhcyBiZWVuIHNldC5cbiAgICogVGhpcyBleGlzdHMgYmVjYXVzZSB0aGUgaW5pdGlhbCB2YWx1ZSBjYW5ub3QgYmUgaW1tZWRpYXRlbHkgc2V0IGJlY2F1c2UgdGhlIG1pbiBhbmQgbWF4XG4gICAqIG11c3QgZmlyc3QgYmUgcmVsYXllZCBmcm9tIHRoZSBwYXJlbnQgTWF0U2xpZGVyIGNvbXBvbmVudCwgd2hpY2ggY2FuIG9ubHkgaGFwcGVuIGxhdGVyXG4gICAqIGluIHRoZSBjb21wb25lbnQgbGlmZWN5Y2xlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFzU2V0SW5pdGlhbFZhbHVlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzdG9yZWQgaW5pdGlhbCB2YWx1ZS4gKi9cbiAgX2luaXRpYWxWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBEZWZpbmVkIHdoZW4gYSB1c2VyIGlzIHVzaW5nIGEgZm9ybSBjb250cm9sIHRvIG1hbmFnZSBzbGlkZXIgdmFsdWUgJiB2YWxpZGF0aW9uLiAqL1xuICBwcml2YXRlIF9mb3JtQ29udHJvbDogRm9ybUNvbnRyb2wgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgVUkgdXBkYXRlcyBzaG91bGQgYmUgc2tpcHBlZC5cbiAgICpcbiAgICogVGhpcyBmbGFnIGlzIHVzZWQgdG8gYXZvaWQgZmxpY2tlcmluZ1xuICAgKiB3aGVuIGNvcnJlY3RpbmcgdmFsdWVzIG9uIHBvaW50ZXIgdXAvZG93bi5cbiAgICovXG4gIF9za2lwVUlVcGRhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHNsaWRlciBpbnB1dCB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBwcm90ZWN0ZWQgX29uQ2hhbmdlRm46ICgodmFsdWU6IGFueSkgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBzbGlkZXIgaW5wdXQgaGFzIGJlZW4gdG91Y2hlZC4gKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaGVkRm46ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgTmdNb2RlbCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogVGhpcyBmbGFnIGlzIHVzZWQgdG8gaWdub3JlIGdob3N0IG51bGwgY2FsbHMgdG9cbiAgICogd3JpdGVWYWx1ZSB3aGljaCBjYW4gYnJlYWsgc2xpZGVyIGluaXRpYWxpemF0aW9uLlxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ5ODguXG4gICAqL1xuICBwcm90ZWN0ZWQgX2lzQ29udHJvbEluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfcGxhdGZvcm0gPSBpbmplY3QoUGxhdGZvcm0pO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICByZWFkb25seSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIHByb3RlY3RlZCBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICApIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25Qb2ludGVyRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vblBvaW50ZXJEb3duKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZHJhZ1N0YXJ0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kcmFnRW5kLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBpbml0UHJvcHMoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgLy8gSWYgdGhpcyBvciB0aGUgcGFyZW50IHNsaWRlciBpcyBkaXNhYmxlZCwganVzdCBtYWtlIGV2ZXJ5dGhpbmcgZGlzYWJsZWQuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgIT09IHRoaXMuX3NsaWRlci5kaXNhYmxlZCkge1xuICAgICAgLy8gVGhlIE1hdFNsaWRlciBzZXR0ZXIgZm9yIGRpc2FibGVkIHdpbGwgcmVsYXkgdGhpcyBhbmQgZGlzYWJsZSBib3RoIGlucHV0cy5cbiAgICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwID0gdGhpcy5fc2xpZGVyLnN0ZXA7XG4gICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGluaXRVSSgpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgX2luaXRWYWx1ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNTZXRJbml0aWFsVmFsdWUgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9pbml0aWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldERlZmF1bHRWYWx1ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSA9IHRoaXMuX2luaXRpYWxWYWx1ZTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXREZWZhdWx0VmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5taW47XG4gIH1cblxuICBfb25CbHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZChmYWxzZSk7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4oKTtcbiAgfVxuXG4gIF9vbkZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgLy8gb25seSB1c2VkIHRvIGhhbmRsZSB0aGUgZWRnZSBjYXNlIHdoZXJlIHVzZXJcbiAgICAvLyBtb3VzZWRvd24gb24gdGhlIHNsaWRlciB0aGVuIHVzZXMgYXJyb3cga2V5cy5cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2VGbj8uKHRoaXMudmFsdWUpO1xuICAgIC8vIGhhbmRsZXMgYXJyb3dpbmcgYW5kIHVwZGF0aW5nIHRoZSB2YWx1ZSB3aGVuXG4gICAgLy8gYSBzdGVwIGlzIGRlZmluZWQuXG4gICAgaWYgKHRoaXMuX3NsaWRlci5zdGVwIHx8ICF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoe3dpdGhBbmltYXRpb246IHRydWV9KTtcbiAgICB9XG4gICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICB9XG5cbiAgX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTogdm9pZCB7XG4gICAgLy8gb25seSB1c2VkIHRvIGhhbmRsZSB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VcbiAgICAvLyBvcmlnaW5hdGVzIG91dHNpZGUgb2YgdGhlIHNsaWRlci5cbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlIHx8ICF0aGlzLl9pc0ZvY3VzZWQpIHtcbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgfVxuICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRoaXMuX2Zvcm1Db250cm9sIS5kaXNhYmxlZDtcbiAgfVxuXG4gIF9vblBvaW50ZXJEb3duKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPbiBJT1MsIGRyYWdnaW5nIG9ubHkgd29ya3MgaWYgdGhlIHBvaW50ZXIgZG93biBoYXBwZW5zIG9uIHRoZVxuICAgIC8vIHNsaWRlciB0aHVtYiBhbmQgdGhlIHNsaWRlciBkb2VzIG5vdCByZWNlaXZlIGZvY3VzIGZyb20gcG9pbnRlciBldmVudHMuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLklPUykge1xuICAgICAgY29uc3QgaXNDdXJzb3JPblNsaWRlclRodW1iID0gdGhpcy5fc2xpZGVyLl9pc0N1cnNvck9uU2xpZGVyVGh1bWIoXG4gICAgICAgIGV2ZW50LFxuICAgICAgICB0aGlzLl9zbGlkZXIuX2dldFRodW1iKHRoaXMudGh1bWJQb3NpdGlvbikuX2hvc3RFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5faXNBY3RpdmUgPSBpc0N1cnNvck9uU2xpZGVyVGh1bWI7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgICAgdGhpcy5fc2xpZGVyLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgICB0aGlzLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgIHRoaXMuX3NsaWRlci5fdXBkYXRlRGltZW5zaW9ucygpO1xuXG4gICAgLy8gRG9lcyBub3RoaW5nIGlmIGEgc3RlcCBpcyBkZWZpbmVkIGJlY2F1c2Ugd2VcbiAgICAvLyB3YW50IHRoZSB2YWx1ZSB0byBzbmFwIHRvIHRoZSB2YWx1ZXMgb24gaW5wdXQuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5faGFuZGxlVmFsdWVDb3JyZWN0aW9uKGV2ZW50KTtcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoe3NvdXJjZTogdGhpcywgcGFyZW50OiB0aGlzLl9zbGlkZXIsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIG9uIHBvaW50ZXIgdXAvZG93bi5cbiAgICpcbiAgICogQ2FsbGVkIG9uIHBvaW50ZXIgZG93biBhbmQgdXAgYmVjYXVzZSB0aGUgdmFsdWUgaXMgc2V0IGJhc2VkXG4gICAqIG9uIHRoZSBpbmFjdGl2ZSB3aWR0aCBpbnN0ZWFkIG9mIHRoZSBhY3RpdmUgd2lkdGguXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVWYWx1ZUNvcnJlY3Rpb24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgVUkgd2l0aCB0aGUgY3VycmVudCB2YWx1ZSEgVGhlIHZhbHVlIG9uIHBvaW50ZXJkb3duXG4gICAgLy8gYW5kIHBvaW50ZXJ1cCBpcyBjYWxjdWxhdGVkIGluIHRoZSBzcGxpdCBzZWNvbmQgYmVmb3JlIHRoZSBpbnB1dChzKVxuICAgIC8vIHJlc2l6ZS4gU2VlIF91cGRhdGVXaWR0aEluYWN0aXZlKCkgYW5kIF91cGRhdGVXaWR0aEFjdGl2ZSgpIGZvciBtb3JlXG4gICAgLy8gZGV0YWlscy5cbiAgICB0aGlzLl9za2lwVUlVcGRhdGUgPSB0cnVlO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZ2V0cyB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlXG4gICAgLy8gc2xpZGVyIGlzIHVwZGF0ZWQuIFRoaXMgbWVhbnMgaWYgd2Ugd2VyZSB0byBzZXQgdGhlIHZhbHVlIGhlcmUsIGl0XG4gICAgLy8gd291bGQgaW1tZWRpYXRlbHkgYmUgb3ZlcndyaXR0ZW4uIFVzaW5nIHNldFRpbWVvdXQgZW5zdXJlcyB0aGUgc2V0dGluZ1xuICAgIC8vIG9mIHRoZSB2YWx1ZSBoYXBwZW5zIGFmdGVyIHRoZSB2YWx1ZSBoYXMgYmVlbiB1cGRhdGVkIGJ5IHRoZVxuICAgIC8vIHBvaW50ZXJkb3duIGV2ZW50LlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2tpcFVJVXBkYXRlID0gZmFsc2U7XG4gICAgICB0aGlzLl9maXhWYWx1ZShldmVudCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKiogQ29ycmVjdHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgYmFzZWQgb24gdGhlIHBvaW50ZXIgZXZlbnQncyBwb3NpdGlvbi4gKi9cbiAgX2ZpeFZhbHVlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB4UG9zID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuX3NsaWRlci5fY2FjaGVkTGVmdDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgY29uc3Qgc3RlcCA9IHRoaXMuX3NsaWRlci5zdGVwID09PSAwID8gMSA6IHRoaXMuX3NsaWRlci5zdGVwO1xuICAgIGNvbnN0IG51bVN0ZXBzID0gTWF0aC5mbG9vcigodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pIC8gc3RlcCk7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIC0geFBvcyAvIHdpZHRoIDogeFBvcyAvIHdpZHRoO1xuXG4gICAgLy8gVG8gZW5zdXJlIHRoZSBwZXJjZW50YWdlIGlzIHJvdW5kZWQgdG8gdGhlIG5lY2Vzc2FyeSBudW1iZXIgb2YgZGVjaW1hbHMuXG4gICAgY29uc3QgZml4ZWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZChwZXJjZW50YWdlICogbnVtU3RlcHMpIC8gbnVtU3RlcHM7XG5cbiAgICBjb25zdCBpbXByZWNpc2VWYWx1ZSA9XG4gICAgICBmaXhlZFBlcmNlbnRhZ2UgKiAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pICsgdGhpcy5fc2xpZGVyLm1pbjtcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGgucm91bmQoaW1wcmVjaXNlVmFsdWUgLyBzdGVwKSAqIHN0ZXA7XG4gICAgY29uc3QgcHJldlZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gcHJldlZhbHVlKSB7XG4gICAgICAvLyBCZWNhdXNlIHdlIHByZXZlbnRlZCBVSSB1cGRhdGVzLCBpZiBpdCB0dXJucyBvdXQgdGhhdCB0aGUgcmFjZVxuICAgICAgLy8gY29uZGl0aW9uIGRpZG4ndCBoYXBwZW4gYW5kIHRoZSB2YWx1ZSBpcyBhbHJlYWR5IGNvcnJlY3QsIHdlXG4gICAgICAvLyBoYXZlIHRvIGFwcGx5IHRoZSB1aSB1cGRhdGVzIG5vdy5cbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3NsaWRlci5zdGVwID4gMFxuICAgICAgICA/IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKClcbiAgICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fb25DaGFuZ2VGbj8uKHRoaXMudmFsdWUpO1xuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICB0aGlzLl9zbGlkZXIuc3RlcCA+IDBcbiAgICAgID8gdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKVxuICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIEFnYWluLCBkb2VzIG5vdGhpbmcgaWYgYSBzdGVwIGlzIGRlZmluZWQgYmVjYXVzZVxuICAgIC8vIHdlIHdhbnQgdGhlIHZhbHVlIHRvIHNuYXAgdG8gdGhlIHZhbHVlcyBvbiBpbnB1dC5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwICYmIHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblBvaW50ZXJVcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fcGxhdGZvcm0uU0FGQVJJKSB7XG4gICAgICAgIHRoaXMuX3NldElzRm9jdXNlZChmYWxzZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRyYWdFbmQuZW1pdCh7c291cmNlOiB0aGlzLCBwYXJlbnQ6IHRoaXMuX3NsaWRlciwgdmFsdWU6IHRoaXMudmFsdWV9KTtcblxuICAgICAgLy8gVGhpcyBzZXRUaW1lb3V0IGlzIHRvIHByZXZlbnQgdGhlIHBvaW50ZXJ1cCBmcm9tIHRyaWdnZXJpbmcgYSB2YWx1ZVxuICAgICAgLy8gY2hhbmdlIG9uIHRoZSBpbnB1dCBiYXNlZCBvbiB0aGUgaW5hY3RpdmUgd2lkdGguIEl0J3Mgbm90IGNsZWFyIHdoeVxuICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiBvbiBJT1MgdGhpcyByYWNlIGNvbmRpdGlvbiBpcyBldmVuIG1vcmUgY29tbW9uIHNvXG4gICAgICAvLyB0aGUgdGltZW91dCBuZWVkcyB0byBiZSBpbmNyZWFzZWQuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKSwgdGhpcy5fcGxhdGZvcm0uSU9TID8gMTAgOiAwKTtcbiAgICB9XG4gIH1cblxuICBfY2xhbXAodjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odiwgdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCksIDApO1xuICB9XG5cbiAgX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIuX2lzUnRsKSB7XG4gICAgICByZXR1cm4gKDEgLSB0aGlzLnBlcmNlbnRhZ2UpICogdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICB9XG4gICAgY29uc3QgdGlja01hcmtPZmZzZXQgPSAzOyAvLyBUaGUgc3BhY2VzIGJlZm9yZSAmIGFmdGVyIHRoZSBzdGFydCAmIGVuZCB0aWNrIG1hcmtzLlxuICAgIHJldHVybiB0aGlzLnBlcmNlbnRhZ2UgKiAodGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCAtIHRpY2tNYXJrT2Zmc2V0ICogMikgKyB0aWNrTWFya09mZnNldDtcbiAgfVxuXG4gIF9jYWxjVHJhbnNsYXRlWEJ5UG9pbnRlckV2ZW50KGV2ZW50OiBQb2ludGVyRXZlbnQpOiBudW1iZXIge1xuICAgIHJldHVybiBldmVudC5jbGllbnRYIC0gdGhpcy5fc2xpZGVyLl9jYWNoZWRMZWZ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc2V0IHRoZSBzbGlkZXIgd2lkdGggdG8gdGhlIGNvcnJlY3RcbiAgICogZGltZW5zaW9ucyB3aGlsZSB0aGUgdXNlciBpcyBkcmFnZ2luZy5cbiAgICovXG4gIF91cGRhdGVXaWR0aEFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYDAgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgY2FsYygxMDAlICsgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weClgO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNsaWRlciBpbnB1dCB0byBkaXNwcm9wb3J0aW9uYXRlIGRpbWVuc2lvbnMgdG8gYWxsb3cgZm9yIHRvdWNoXG4gICAqIGV2ZW50cyB0byBiZSBjYXB0dXJlZCBvbiB0b3VjaCBkZXZpY2VzLlxuICAgKi9cbiAgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICcwcHgnO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gJ2NhbGMoMTAwJSArIDQ4cHgpJztcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJy0yNHB4JztcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJQnlWYWx1ZShvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2xhdGVYID0gdGhpcy5fY2xhbXAodGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCkpO1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUkob3B0aW9ucyk7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50OiBQb2ludGVyRXZlbnQsIG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVggPSB0aGlzLl9jbGFtcCh0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5UG9pbnRlckV2ZW50KGV2ZW50KSk7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSShvcHRpb25zKTtcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJKG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pIHtcbiAgICB0aGlzLl9zbGlkZXIuX3NldFRyYW5zaXRpb24oISFvcHRpb25zPy53aXRoQW5pbWF0aW9uKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVHJhbnNsYXRlWENoYW5nZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnB1dCdzIHZhbHVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkIHx8IHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgaW5wdXQncyB2YWx1ZSBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayB0byByZWdpc3RlclxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZUZuID0gZm47XG4gICAgdGhpcy5faXNDb250cm9sSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgaW5wdXQgaXMgYmx1cnJlZCBieSB0aGUgdXNlci5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayB0byByZWdpc3RlclxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4gPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgc2xpZGVyLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBUaGUgbmV3IGRpc2FibGVkIHN0YXRlXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuYmx1cigpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclN0YXJ0VGh1bWJdLCBpbnB1dFttYXRTbGlkZXJFbmRUaHVtYl0nLFxuICBleHBvcnRBczogJ21hdFNsaWRlclJhbmdlVGh1bWInLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1JBTkdFX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1JBTkdFX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyUmFuZ2VUaHVtYn0sXG4gIF0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlclJhbmdlVGh1bWIgZXh0ZW5kcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJSYW5nZVRodW1iIHtcbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0U2libGluZygpOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nID0gdGhpcy5fc2xpZGVyLl9nZXRJbnB1dCh0aGlzLl9pc0VuZFRodW1iID8gX01hdFRodW1iLlNUQVJUIDogX01hdFRodW1iLkVORCkgYXNcbiAgICAgICAgfCBNYXRTbGlkZXJSYW5nZVRodW1iXG4gICAgICAgIHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2libGluZztcbiAgfVxuICBwcml2YXRlIF9zaWJsaW5nOiBNYXRTbGlkZXJSYW5nZVRodW1iIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1pblBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2lzTGVmdFRodW1iICYmIHNpYmxpbmcpIHtcbiAgICAgIHJldHVybiBzaWJsaW5nLnRyYW5zbGF0ZVg7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gdHJhbnNsYXRlWCBwb3NpdGlvbiBhbGxvd2VkIGZvciB0aGlzIHNsaWRlciBpbnB1dCdzIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWF4UG9zKCk6IG51bWJlciB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICh0aGlzLl9pc0xlZnRUaHVtYiAmJiBzaWJsaW5nKSB7XG4gICAgICByZXR1cm4gc2libGluZy50cmFuc2xhdGVYO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgfVxuXG4gIF9zZXRJc0xlZnRUaHVtYigpOiB2b2lkIHtcbiAgICB0aGlzLl9pc0xlZnRUaHVtYiA9XG4gICAgICAodGhpcy5faXNFbmRUaHVtYiAmJiB0aGlzLl9zbGlkZXIuX2lzUnRsKSB8fCAoIXRoaXMuX2lzRW5kVGh1bWIgJiYgIXRoaXMuX3NsaWRlci5faXNSdGwpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBzbGlkZXIgY29ycmVzcG9uZHMgdG8gdGhlIGlucHV0IG9uIHRoZSBsZWZ0IGhhbmQgc2lkZS4gKi9cbiAgX2lzTGVmdFRodW1iOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgc2xpZGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBpbnB1dCB3aXRoIGdyZWF0ZXIgdmFsdWUuICovXG4gIF9pc0VuZFRodW1iOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIF9zbGlkZXI6IF9NYXRTbGlkZXIsXG4gICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgb3ZlcnJpZGUgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIHN1cGVyKF9uZ1pvbmUsIF9lbGVtZW50UmVmLCBfY2RyLCBfc2xpZGVyKTtcbiAgICB0aGlzLl9pc0VuZFRodW1iID0gdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCdtYXRTbGlkZXJFbmRUaHVtYicpO1xuICAgIHRoaXMuX3NldElzTGVmdFRodW1iKCk7XG4gICAgdGhpcy50aHVtYlBvc2l0aW9uID0gdGhpcy5faXNFbmRUaHVtYiA/IF9NYXRUaHVtYi5FTkQgOiBfTWF0VGh1bWIuU1RBUlQ7XG4gIH1cblxuICBvdmVycmlkZSBfZ2V0RGVmYXVsdFZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRW5kVGh1bWIgJiYgdGhpcy5fc2xpZGVyLl9pc1JhbmdlID8gdGhpcy5tYXggOiB0aGlzLm1pbjtcbiAgfVxuXG4gIG92ZXJyaWRlIF9vbklucHV0KCk6IHZvaWQge1xuICAgIHN1cGVyLl9vbklucHV0KCk7XG4gICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICAgIGlmICghdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25OZ0NvbnRyb2xWYWx1ZUNoYW5nZSgpO1xuICAgIHRoaXMuZ2V0U2libGluZygpPy5fdXBkYXRlTWluTWF4KCk7XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICB0aGlzLl9zaWJsaW5nLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgICAgdGhpcy5fc2libGluZy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1zbGlkZXItaW5wdXQtbm8tcG9pbnRlci1ldmVudHMnKTtcbiAgICB9XG4gICAgc3VwZXIuX29uUG9pbnRlckRvd24oZXZlbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlclVwKCk6IHZvaWQge1xuICAgIHN1cGVyLl9vblBvaW50ZXJVcCgpO1xuICAgIGlmICh0aGlzLl9zaWJsaW5nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgICAgdGhpcy5fc2libGluZyEuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21hdC1tZGMtc2xpZGVyLWlucHV0LW5vLXBvaW50ZXItZXZlbnRzJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIuX29uUG9pbnRlck1vdmUoZXZlbnQpO1xuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXAgJiYgdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfZml4VmFsdWUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLl9maXhWYWx1ZShldmVudCk7XG4gICAgdGhpcy5fc2libGluZz8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2NsYW1wKHY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIHRoaXMuZ2V0TWF4UG9zKCkpLCB0aGlzLmdldE1pblBvcygpKTtcbiAgfVxuXG4gIF91cGRhdGVNaW5NYXgoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNFbmRUaHVtYikge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1heCh0aGlzLl9zbGlkZXIubWluLCBzaWJsaW5nLnZhbHVlKTtcbiAgICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1pbih0aGlzLl9zbGlkZXIubWF4LCBzaWJsaW5nLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhBY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3QgbWluV2lkdGggPSB0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cyAqIDIgLSB0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZyAqIDI7XG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoICsgdGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmcgLSBtaW5XaWR0aDtcbiAgICBjb25zdCBwZXJjZW50YWdlID1cbiAgICAgIHRoaXMuX3NsaWRlci5taW4gPCB0aGlzLl9zbGlkZXIubWF4XG4gICAgICAgID8gKHRoaXMubWF4IC0gdGhpcy5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKVxuICAgICAgICA6IDE7XG4gICAgY29uc3Qgd2lkdGggPSBtYXhXaWR0aCAqIHBlcmNlbnRhZ2UgKyBtaW5XaWR0aDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYDAgJHt0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZ31weGA7XG4gIH1cblxuICBvdmVycmlkZSBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICBjb25zdCBtaWRWYWx1ZSA9IHRoaXMuX2lzRW5kVGh1bWJcbiAgICAgID8gdGhpcy52YWx1ZSAtICh0aGlzLnZhbHVlIC0gc2libGluZy52YWx1ZSkgLyAyXG4gICAgICA6IHRoaXMudmFsdWUgKyAoc2libGluZy52YWx1ZSAtIHRoaXMudmFsdWUpIC8gMjtcblxuICAgIGNvbnN0IF9wZXJjZW50YWdlID0gdGhpcy5faXNFbmRUaHVtYlxuICAgICAgPyAodGhpcy5tYXggLSBtaWRWYWx1ZSkgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pXG4gICAgICA6IChtaWRWYWx1ZSAtIHRoaXMubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbik7XG5cbiAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5fc2xpZGVyLm1pbiA8IHRoaXMuX3NsaWRlci5tYXggPyBfcGVyY2VudGFnZSA6IDE7XG5cbiAgICAvLyBFeHRlbmQgdGhlIG5hdGl2ZSBpbnB1dCB3aWR0aCBieSB0aGUgcmFkaXVzIG9mIHRoZSByaXBwbGVcbiAgICBsZXQgcmlwcGxlUGFkZGluZyA9IHRoaXMuX3NsaWRlci5fcmlwcGxlUmFkaXVzO1xuXG4gICAgLy8gSWYgb25lIG9mIHRoZSBpbnB1dHMgaXMgbWF4aW1hbGx5IHNpemVkICh0aGUgdmFsdWUgb2YgYm90aCB0aHVtYnMgaXNcbiAgICAvLyBlcXVhbCB0byB0aGUgbWluIG9yIG1heCksIG1ha2UgdGhhdCBpbnB1dCB0YWtlIHVwIGFsbCBvZiB0aGUgd2lkdGggYW5kXG4gICAgLy8gbWFrZSB0aGUgb3RoZXIgdW5zZWxlY3RhYmxlLlxuICAgIGlmIChwZXJjZW50YWdlID09PSAxKSB7XG4gICAgICByaXBwbGVQYWRkaW5nID0gNDg7XG4gICAgfSBlbHNlIGlmIChwZXJjZW50YWdlID09PSAwKSB7XG4gICAgICByaXBwbGVQYWRkaW5nID0gMDtcbiAgICB9XG5cbiAgICBjb25zdCB3aWR0aCA9IG1heFdpZHRoICogcGVyY2VudGFnZSArIHJpcHBsZVBhZGRpbmc7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICcwcHgnO1xuXG4gICAgaWYgKHRoaXMuX2lzTGVmdFRodW1iKSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJy0yNHB4JztcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucmlnaHQgPSAnLTI0cHgnO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVTdGF0aWNTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWF0LXNsaWRlcl9fcmlnaHQtaW5wdXQnLCAhdGhpcy5faXNMZWZ0VGh1bWIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU2libGluZygpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNpYmxpbmcuX3VwZGF0ZU1pbk1heCgpO1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgc2libGluZy5fdXBkYXRlV2lkdGhBY3RpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2libGluZy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnB1dCdzIHZhbHVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb3ZlcnJpZGUgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkIHx8IHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgICB0aGlzLl91cGRhdGVTaWJsaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX3NldFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5fc2V0VmFsdWUodmFsdWUpO1xuICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB0aGlzLl91cGRhdGVTaWJsaW5nKCk7XG4gIH1cbn1cbiJdfQ==