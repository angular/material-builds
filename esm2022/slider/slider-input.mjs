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
        this._hostElement.value = stringValue;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderThumb, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_SLIDER }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.0", type: MatSliderThumb, isStandalone: true, selector: "input[matSliderThumb]", inputs: { value: ["value", "value", numberAttribute] }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd" }, host: { attributes: { "type": "range" }, listeners: { "change": "_onChange()", "input": "_onInput()", "blur": "_onBlur()", "focus": "_onFocus()" }, properties: { "attr.aria-valuetext": "_valuetext" }, classAttribute: "mdc-slider__input" }, providers: [
            MAT_SLIDER_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb },
        ], exportAs: ["matSliderThumb"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderThumb, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderRangeThumb, deps: [{ token: i0.NgZone }, { token: MAT_SLIDER }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatSliderRangeThumb, isStandalone: true, selector: "input[matSliderStartThumb], input[matSliderEndThumb]", providers: [
            MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR,
            { provide: MAT_SLIDER_RANGE_THUMB, useExisting: MatSliderRangeThumb },
        ], exportAs: ["matSliderRangeThumb"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderRangeThumb, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFDTixlQUFlLEVBRWYsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBb0MsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFDTCxTQUFTLEVBS1Qsc0JBQXNCLEVBQ3RCLGdCQUFnQixFQUNoQixVQUFVLEdBQ1gsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRS9DOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFRO0lBQ2xELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQVE7SUFDeEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBQ2xELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFxQkgsTUFBTSxPQUFPLGNBQWM7SUFDekIsSUFDSSxLQUFLO1FBQ1AsT0FBTyxlQUFlLENBQUMs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LHFCQUFxQjtvQkFDL0IsU0FBUyxFQUFFO3dCQUNULHFDQUFxQzt3QkFDckMsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxxQkFBcUIsRUFBQztxQkFDcEU7b0JBQ0QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzswQkFrREksTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIG51bWJlckF0dHJpYnV0ZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUNvbnRyb2wsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgX01hdFRodW1iLFxuICBNYXRTbGlkZXJEcmFnRXZlbnQsXG4gIF9NYXRTbGlkZXIsXG4gIF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICBfTWF0U2xpZGVyVGh1bWIsXG4gIE1BVF9TTElERVJfUkFOR0VfVEhVTUIsXG4gIE1BVF9TTElERVJfVEhVTUIsXG4gIE1BVF9TTElERVIsXG59IGZyb20gJy4vc2xpZGVyLWludGVyZmFjZSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSBzbGlkZXIgdGh1bWIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfVEhVTUJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlclRodW1iKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSByYW5nZSBzbGlkZXIgdGh1bWIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfUkFOR0VfVEhVTUJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlclJhbmdlVGh1bWIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogRGlyZWN0aXZlIHRoYXQgYWRkcyBzbGlkZXItc3BlY2lmaWMgYmVoYXZpb3JzIHRvIGFuIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LXNsaWRlcj5gLlxuICogVXAgdG8gdHdvIG1heSBiZSBwbGFjZWQgaW5zaWRlIG9mIGEgYDxtYXQtc2xpZGVyPmAuXG4gKlxuICogSWYgb25lIGlzIHVzZWQsIHRoZSBzZWxlY3RvciBgbWF0U2xpZGVyVGh1bWJgIG11c3QgYmUgdXNlZCwgYW5kIHRoZSBvdXRjb21lIHdpbGwgYmUgYSBub3JtYWxcbiAqIHNsaWRlci4gSWYgdHdvIGFyZSB1c2VkLCB0aGUgc2VsZWN0b3JzIGBtYXRTbGlkZXJTdGFydFRodW1iYCBhbmQgYG1hdFNsaWRlckVuZFRodW1iYCBtdXN0IGJlXG4gKiB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIHJhbmdlIHNsaWRlciB3aXRoIHR3byBzbGlkZXIgdGh1bWJzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTbGlkZXJUaHVtYl0nLFxuICBleHBvcnRBczogJ21hdFNsaWRlclRodW1iJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtc2xpZGVyX19pbnB1dCcsXG4gICAgJ3R5cGUnOiAncmFuZ2UnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVldGV4dF0nOiAnX3ZhbHVldGV4dCcsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IENvbnNpZGVyIHVzaW5nIGEgZ2xvYmFsIGV2ZW50IGxpc3RlbmVyIGluc3RlYWQuXG4gICAgLy8gUmVhc29uOiBJIGhhdmUgZm91bmQgYSBzZW1pLWNvbnNpc3RlbnQgd2F5IHRvIG1vdXNlIHVwIHdpdGhvdXQgdHJpZ2dlcmluZyB0aGlzIGV2ZW50LlxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1NMSURFUl9USFVNQl9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX1NMSURFUl9USFVNQiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlclRodW1ifSxcbiAgXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyVGh1bWIsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBASW5wdXQoe3RyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlfSlcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIG51bWJlckF0dHJpYnV0ZSh0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSwgMCk7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAgICB2YWx1ZSA9IGlzTmFOKHZhbHVlKSA/IDAgOiB2YWx1ZTtcbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IHZhbHVlICsgJyc7XG4gICAgaWYgKCF0aGlzLl9oYXNTZXRJbml0aWFsVmFsdWUpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxWYWx1ZSA9IHN0cmluZ1ZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSBzdHJpbmdWYWx1ZTtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHRoaXMuX3NsaWRlci5fY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGB2YWx1ZWAgaXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBzdGFydHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdTdGFydDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBzdG9wcyBiZWluZyBkcmFnZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ0VuZDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB0cmFuc2xhdGVYIGluIHB4IG9mIHRoZSBzbGlkZXIgdmlzdWFsIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgdHJhbnNsYXRlWCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIubWluID49IHRoaXMuX3NsaWRlci5tYXgpIHtcbiAgICAgIHRoaXMuX3RyYW5zbGF0ZVggPSAwO1xuICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgfVxuICAgIGlmICh0aGlzLl90cmFuc2xhdGVYID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RyYW5zbGF0ZVggPSB0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gIH1cbiAgc2V0IHRyYW5zbGF0ZVgodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRlWCA9IHY7XG4gIH1cbiAgcHJpdmF0ZSBfdHJhbnNsYXRlWDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGlzIHRodW1iIGlzIHRoZSBzdGFydCBvciBlbmQgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHRodW1iUG9zaXRpb246IF9NYXRUaHVtYiA9IF9NYXRUaHVtYi5FTkQ7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1pbigpOiBudW1iZXIge1xuICAgIHJldHVybiBudW1iZXJBdHRyaWJ1dGUodGhpcy5faG9zdEVsZW1lbnQubWluLCAwKTtcbiAgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50Lm1pbiA9IHYgKyAnJztcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiBudW1iZXJBdHRyaWJ1dGUodGhpcy5faG9zdEVsZW1lbnQubWF4LCAwKTtcbiAgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50Lm1heCA9IHYgKyAnJztcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbnVtYmVyQXR0cmlidXRlKHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAsIDApO1xuICB9XG4gIHNldCBzdGVwKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAgPSB2ICsgJyc7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYm9vbGVhbkF0dHJpYnV0ZSh0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCA9IHY7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIGlmICh0aGlzLl9zbGlkZXIuZGlzYWJsZWQgIT09IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgdGhhdCBjb2luY2lkZXMgd2l0aCB0aGUgdmFsdWUuICovXG4gIGdldCBwZXJjZW50YWdlKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3NsaWRlci5taW4gPj0gdGhpcy5fc2xpZGVyLm1heCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIDogMDtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLnZhbHVlIC0gdGhpcy5fc2xpZGVyLm1pbikgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGZpbGxQZXJjZW50YWdlKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2xpZGVyLl9pc1J0bCA/IDEgOiAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5fdHJhbnNsYXRlWCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVggLyB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICB9XG5cbiAgLyoqIFRoZSBob3N0IG5hdGl2ZSBIVE1MIGlucHV0IGVsZW1lbnQuICovXG4gIF9ob3N0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIGFyaWEtdmFsdWV0ZXh0IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW5wdXQncyB2YWx1ZS4gKi9cbiAgX3ZhbHVldGV4dDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgcmFkaXVzIG9mIGEgbmF0aXZlIGh0bWwgc2xpZGVyJ3Mga25vYi4gKi9cbiAgX2tub2JSYWRpdXM6IG51bWJlciA9IDg7XG5cbiAgLyoqIFdoZXRoZXIgdXNlcidzIGN1cnNvciBpcyBjdXJyZW50bHkgaW4gYSBtb3VzZSBkb3duIHN0YXRlIG9uIHRoZSBpbnB1dC4gKi9cbiAgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGN1cnJlbnRseSBmb2N1c2VkIChlaXRoZXIgYnkgdGFiIG9yIGFmdGVyIGNsaWNraW5nKS4gKi9cbiAgX2lzRm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBVc2VkIHRvIHJlbGF5IHVwZGF0ZXMgdG8gX2lzRm9jdXNlZCB0byB0aGUgc2xpZGVyIHZpc3VhbCB0aHVtYnMuICovXG4gIHByaXZhdGUgX3NldElzRm9jdXNlZCh2OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5faXNGb2N1c2VkID0gdjtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbml0aWFsIHZhbHVlIGhhcyBiZWVuIHNldC5cbiAgICogVGhpcyBleGlzdHMgYmVjYXVzZSB0aGUgaW5pdGlhbCB2YWx1ZSBjYW5ub3QgYmUgaW1tZWRpYXRlbHkgc2V0IGJlY2F1c2UgdGhlIG1pbiBhbmQgbWF4XG4gICAqIG11c3QgZmlyc3QgYmUgcmVsYXllZCBmcm9tIHRoZSBwYXJlbnQgTWF0U2xpZGVyIGNvbXBvbmVudCwgd2hpY2ggY2FuIG9ubHkgaGFwcGVuIGxhdGVyXG4gICAqIGluIHRoZSBjb21wb25lbnQgbGlmZWN5Y2xlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFzU2V0SW5pdGlhbFZhbHVlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzdG9yZWQgaW5pdGlhbCB2YWx1ZS4gKi9cbiAgX2luaXRpYWxWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBEZWZpbmVkIHdoZW4gYSB1c2VyIGlzIHVzaW5nIGEgZm9ybSBjb250cm9sIHRvIG1hbmFnZSBzbGlkZXIgdmFsdWUgJiB2YWxpZGF0aW9uLiAqL1xuICBwcml2YXRlIF9mb3JtQ29udHJvbDogRm9ybUNvbnRyb2wgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgVUkgdXBkYXRlcyBzaG91bGQgYmUgc2tpcHBlZC5cbiAgICpcbiAgICogVGhpcyBmbGFnIGlzIHVzZWQgdG8gYXZvaWQgZmxpY2tlcmluZ1xuICAgKiB3aGVuIGNvcnJlY3RpbmcgdmFsdWVzIG9uIHBvaW50ZXIgdXAvZG93bi5cbiAgICovXG4gIF9za2lwVUlVcGRhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHNsaWRlciBpbnB1dCB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBwcm90ZWN0ZWQgX29uQ2hhbmdlRm46ICgodmFsdWU6IGFueSkgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBzbGlkZXIgaW5wdXQgaGFzIGJlZW4gdG91Y2hlZC4gKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaGVkRm46ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgTmdNb2RlbCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogVGhpcyBmbGFnIGlzIHVzZWQgdG8gaWdub3JlIGdob3N0IG51bGwgY2FsbHMgdG9cbiAgICogd3JpdGVWYWx1ZSB3aGljaCBjYW4gYnJlYWsgc2xpZGVyIGluaXRpYWxpemF0aW9uLlxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ5ODguXG4gICAqL1xuICBwcm90ZWN0ZWQgX2lzQ29udHJvbEluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfcGxhdGZvcm0gPSBpbmplY3QoUGxhdGZvcm0pO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICByZWFkb25seSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9TTElERVIpIHByb3RlY3RlZCBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICApIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25Qb2ludGVyRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Qb2ludGVyTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9vblBvaW50ZXJEb3duKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX29uUG9pbnRlclVwKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZHJhZ1N0YXJ0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kcmFnRW5kLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBpbml0UHJvcHMoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgLy8gSWYgdGhpcyBvciB0aGUgcGFyZW50IHNsaWRlciBpcyBkaXNhYmxlZCwganVzdCBtYWtlIGV2ZXJ5dGhpbmcgZGlzYWJsZWQuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgIT09IHRoaXMuX3NsaWRlci5kaXNhYmxlZCkge1xuICAgICAgLy8gVGhlIE1hdFNsaWRlciBzZXR0ZXIgZm9yIGRpc2FibGVkIHdpbGwgcmVsYXkgdGhpcyBhbmQgZGlzYWJsZSBib3RoIGlucHV0cy5cbiAgICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwID0gdGhpcy5fc2xpZGVyLnN0ZXA7XG4gICAgdGhpcy5taW4gPSB0aGlzLl9zbGlkZXIubWluO1xuICAgIHRoaXMubWF4ID0gdGhpcy5fc2xpZGVyLm1heDtcbiAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGluaXRVSSgpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgX2luaXRWYWx1ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNTZXRJbml0aWFsVmFsdWUgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9pbml0aWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldERlZmF1bHRWYWx1ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSA9IHRoaXMuX2luaXRpYWxWYWx1ZTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXREZWZhdWx0VmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5taW47XG4gIH1cblxuICBfb25CbHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZChmYWxzZSk7XG4gICAgdGhpcy5fb25Ub3VjaGVkRm4oKTtcbiAgfVxuXG4gIF9vbkZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgLy8gb25seSB1c2VkIHRvIGhhbmRsZSB0aGUgZWRnZSBjYXNlIHdoZXJlIHVzZXJcbiAgICAvLyBtb3VzZWRvd24gb24gdGhlIHNsaWRlciB0aGVuIHVzZXMgYXJyb3cga2V5cy5cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2VGbj8uKHRoaXMudmFsdWUpO1xuICAgIC8vIGhhbmRsZXMgYXJyb3dpbmcgYW5kIHVwZGF0aW5nIHRoZSB2YWx1ZSB3aGVuXG4gICAgLy8gYSBzdGVwIGlzIGRlZmluZWQuXG4gICAgaWYgKHRoaXMuX3NsaWRlci5zdGVwIHx8ICF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoe3dpdGhBbmltYXRpb246IHRydWV9KTtcbiAgICB9XG4gICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICB9XG5cbiAgX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTogdm9pZCB7XG4gICAgLy8gb25seSB1c2VkIHRvIGhhbmRsZSB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VcbiAgICAvLyBvcmlnaW5hdGVzIG91dHNpZGUgb2YgdGhlIHNsaWRlci5cbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlIHx8ICF0aGlzLl9pc0ZvY3VzZWQpIHtcbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgfVxuICAgIHRoaXMuX3NsaWRlci5kaXNhYmxlZCA9IHRoaXMuX2Zvcm1Db250cm9sIS5kaXNhYmxlZDtcbiAgfVxuXG4gIF9vblBvaW50ZXJEb3duKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPbiBJT1MsIGRyYWdnaW5nIG9ubHkgd29ya3MgaWYgdGhlIHBvaW50ZXIgZG93biBoYXBwZW5zIG9uIHRoZVxuICAgIC8vIHNsaWRlciB0aHVtYiBhbmQgdGhlIHNsaWRlciBkb2VzIG5vdCByZWNlaXZlIGZvY3VzIGZyb20gcG9pbnRlciBldmVudHMuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLklPUykge1xuICAgICAgY29uc3QgaXNDdXJzb3JPblNsaWRlclRodW1iID0gdGhpcy5fc2xpZGVyLl9pc0N1cnNvck9uU2xpZGVyVGh1bWIoXG4gICAgICAgIGV2ZW50LFxuICAgICAgICB0aGlzLl9zbGlkZXIuX2dldFRodW1iKHRoaXMudGh1bWJQb3NpdGlvbikuX2hvc3RFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5faXNBY3RpdmUgPSBpc0N1cnNvck9uU2xpZGVyVGh1bWI7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgICAgdGhpcy5fc2xpZGVyLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX3NldElzRm9jdXNlZCh0cnVlKTtcbiAgICB0aGlzLl91cGRhdGVXaWR0aEFjdGl2ZSgpO1xuICAgIHRoaXMuX3NsaWRlci5fdXBkYXRlRGltZW5zaW9ucygpO1xuXG4gICAgLy8gRG9lcyBub3RoaW5nIGlmIGEgc3RlcCBpcyBkZWZpbmVkIGJlY2F1c2Ugd2VcbiAgICAvLyB3YW50IHRoZSB2YWx1ZSB0byBzbmFwIHRvIHRoZSB2YWx1ZXMgb24gaW5wdXQuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5faGFuZGxlVmFsdWVDb3JyZWN0aW9uKGV2ZW50KTtcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoe3NvdXJjZTogdGhpcywgcGFyZW50OiB0aGlzLl9zbGlkZXIsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIG9uIHBvaW50ZXIgdXAvZG93bi5cbiAgICpcbiAgICogQ2FsbGVkIG9uIHBvaW50ZXIgZG93biBhbmQgdXAgYmVjYXVzZSB0aGUgdmFsdWUgaXMgc2V0IGJhc2VkXG4gICAqIG9uIHRoZSBpbmFjdGl2ZSB3aWR0aCBpbnN0ZWFkIG9mIHRoZSBhY3RpdmUgd2lkdGguXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVWYWx1ZUNvcnJlY3Rpb24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgVUkgd2l0aCB0aGUgY3VycmVudCB2YWx1ZSEgVGhlIHZhbHVlIG9uIHBvaW50ZXJkb3duXG4gICAgLy8gYW5kIHBvaW50ZXJ1cCBpcyBjYWxjdWxhdGVkIGluIHRoZSBzcGxpdCBzZWNvbmQgYmVmb3JlIHRoZSBpbnB1dChzKVxuICAgIC8vIHJlc2l6ZS4gU2VlIF91cGRhdGVXaWR0aEluYWN0aXZlKCkgYW5kIF91cGRhdGVXaWR0aEFjdGl2ZSgpIGZvciBtb3JlXG4gICAgLy8gZGV0YWlscy5cbiAgICB0aGlzLl9za2lwVUlVcGRhdGUgPSB0cnVlO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZ2V0cyB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlXG4gICAgLy8gc2xpZGVyIGlzIHVwZGF0ZWQuIFRoaXMgbWVhbnMgaWYgd2Ugd2VyZSB0byBzZXQgdGhlIHZhbHVlIGhlcmUsIGl0XG4gICAgLy8gd291bGQgaW1tZWRpYXRlbHkgYmUgb3ZlcndyaXR0ZW4uIFVzaW5nIHNldFRpbWVvdXQgZW5zdXJlcyB0aGUgc2V0dGluZ1xuICAgIC8vIG9mIHRoZSB2YWx1ZSBoYXBwZW5zIGFmdGVyIHRoZSB2YWx1ZSBoYXMgYmVlbiB1cGRhdGVkIGJ5IHRoZVxuICAgIC8vIHBvaW50ZXJkb3duIGV2ZW50LlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fc2tpcFVJVXBkYXRlID0gZmFsc2U7XG4gICAgICB0aGlzLl9maXhWYWx1ZShldmVudCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKiogQ29ycmVjdHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgYmFzZWQgb24gdGhlIHBvaW50ZXIgZXZlbnQncyBwb3NpdGlvbi4gKi9cbiAgX2ZpeFZhbHVlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB4UG9zID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuX3NsaWRlci5fY2FjaGVkTGVmdDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgY29uc3Qgc3RlcCA9IHRoaXMuX3NsaWRlci5zdGVwID09PSAwID8gMSA6IHRoaXMuX3NsaWRlci5zdGVwO1xuICAgIGNvbnN0IG51bVN0ZXBzID0gTWF0aC5mbG9vcigodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pIC8gc3RlcCk7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIC0geFBvcyAvIHdpZHRoIDogeFBvcyAvIHdpZHRoO1xuXG4gICAgLy8gVG8gZW5zdXJlIHRoZSBwZXJjZW50YWdlIGlzIHJvdW5kZWQgdG8gdGhlIG5lY2Vzc2FyeSBudW1iZXIgb2YgZGVjaW1hbHMuXG4gICAgY29uc3QgZml4ZWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZChwZXJjZW50YWdlICogbnVtU3RlcHMpIC8gbnVtU3RlcHM7XG5cbiAgICBjb25zdCBpbXByZWNpc2VWYWx1ZSA9XG4gICAgICBmaXhlZFBlcmNlbnRhZ2UgKiAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pICsgdGhpcy5fc2xpZGVyLm1pbjtcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGgucm91bmQoaW1wcmVjaXNlVmFsdWUgLyBzdGVwKSAqIHN0ZXA7XG4gICAgY29uc3QgcHJldlZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gcHJldlZhbHVlKSB7XG4gICAgICAvLyBCZWNhdXNlIHdlIHByZXZlbnRlZCBVSSB1cGRhdGVzLCBpZiBpdCB0dXJucyBvdXQgdGhhdCB0aGUgcmFjZVxuICAgICAgLy8gY29uZGl0aW9uIGRpZG4ndCBoYXBwZW4gYW5kIHRoZSB2YWx1ZSBpcyBhbHJlYWR5IGNvcnJlY3QsIHdlXG4gICAgICAvLyBoYXZlIHRvIGFwcGx5IHRoZSB1aSB1cGRhdGVzIG5vdy5cbiAgICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICAgIHRoaXMuX3NsaWRlci5zdGVwID4gMFxuICAgICAgICA/IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKClcbiAgICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fb25DaGFuZ2VGbj8uKHRoaXMudmFsdWUpO1xuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgICB0aGlzLl9zbGlkZXIuc3RlcCA+IDBcbiAgICAgID8gdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKVxuICAgICAgOiB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQsIHt3aXRoQW5pbWF0aW9uOiB0aGlzLl9zbGlkZXIuX2hhc0FuaW1hdGlvbn0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIC8vIEFnYWluLCBkb2VzIG5vdGhpbmcgaWYgYSBzdGVwIGlzIGRlZmluZWQgYmVjYXVzZVxuICAgIC8vIHdlIHdhbnQgdGhlIHZhbHVlIHRvIHNuYXAgdG8gdGhlIHZhbHVlcyBvbiBpbnB1dC5cbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwICYmIHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblBvaW50ZXJVcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLmRyYWdFbmQuZW1pdCh7c291cmNlOiB0aGlzLCBwYXJlbnQ6IHRoaXMuX3NsaWRlciwgdmFsdWU6IHRoaXMudmFsdWV9KTtcblxuICAgICAgLy8gVGhpcyBzZXRUaW1lb3V0IGlzIHRvIHByZXZlbnQgdGhlIHBvaW50ZXJ1cCBmcm9tIHRyaWdnZXJpbmcgYSB2YWx1ZVxuICAgICAgLy8gY2hhbmdlIG9uIHRoZSBpbnB1dCBiYXNlZCBvbiB0aGUgaW5hY3RpdmUgd2lkdGguIEl0J3Mgbm90IGNsZWFyIHdoeVxuICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiBvbiBJT1MgdGhpcyByYWNlIGNvbmRpdGlvbiBpcyBldmVuIG1vcmUgY29tbW9uIHNvXG4gICAgICAvLyB0aGUgdGltZW91dCBuZWVkcyB0byBiZSBpbmNyZWFzZWQuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKSwgdGhpcy5fcGxhdGZvcm0uSU9TID8gMTAgOiAwKTtcbiAgICB9XG4gIH1cblxuICBfY2xhbXAodjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odiwgdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCksIDApO1xuICB9XG5cbiAgX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIuX2lzUnRsKSB7XG4gICAgICByZXR1cm4gKDEgLSB0aGlzLnBlcmNlbnRhZ2UpICogdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGVyY2VudGFnZSAqIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICBfY2FsY1RyYW5zbGF0ZVhCeVBvaW50ZXJFdmVudChldmVudDogUG9pbnRlckV2ZW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gZXZlbnQuY2xpZW50WCAtIHRoaXMuX3NsaWRlci5fY2FjaGVkTGVmdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHNldCB0aGUgc2xpZGVyIHdpZHRoIHRvIHRoZSBjb3JyZWN0XG4gICAqIGRpbWVuc2lvbnMgd2hpbGUgdGhlIHVzZXIgaXMgZHJhZ2dpbmcuXG4gICAqL1xuICBfdXBkYXRlV2lkdGhBY3RpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9IGAwICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYGNhbGMoMTAwJSArICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHgpYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzbGlkZXIgaW5wdXQgdG8gZGlzcHJvcG9ydGlvbmF0ZSBkaW1lbnNpb25zIHRvIGFsbG93IGZvciB0b3VjaFxuICAgKiBldmVudHMgdG8gYmUgY2FwdHVyZWQgb24gdG91Y2ggZGV2aWNlcy5cbiAgICovXG4gIF91cGRhdGVXaWR0aEluYWN0aXZlKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnMHB4JztcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9ICdjYWxjKDEwMCUgKyA0OHB4KSc7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICctMjRweCc7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSUJ5VmFsdWUob3B0aW9ucz86IHt3aXRoQW5pbWF0aW9uOiBib29sZWFufSk6IHZvaWQge1xuICAgIHRoaXMudHJhbnNsYXRlWCA9IHRoaXMuX2NsYW1wKHRoaXMuX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpKTtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJKG9wdGlvbnMpO1xuICB9XG5cbiAgX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudDogUG9pbnRlckV2ZW50LCBvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2xhdGVYID0gdGhpcy5fY2xhbXAodGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVBvaW50ZXJFdmVudChldmVudCkpO1xuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUkob3B0aW9ucyk7XG4gIH1cblxuICBfdXBkYXRlVGh1bWJVSShvcHRpb25zPzoge3dpdGhBbmltYXRpb246IGJvb2xlYW59KSB7XG4gICAgdGhpcy5fc2xpZGVyLl9zZXRUcmFuc2l0aW9uKCEhb3B0aW9ucz8ud2l0aEFuaW1hdGlvbik7XG4gICAgdGhpcy5fc2xpZGVyLl9vblRyYW5zbGF0ZVhDaGFuZ2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW5wdXQncyB2YWx1ZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0NvbnRyb2xJbml0aWFsaXplZCB8fCB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGlucHV0J3MgdmFsdWUgY2hhbmdlcyBmcm9tIHVzZXIgaW5wdXQuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXJcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2VGbiA9IGZuO1xuICAgIHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWQgYnkgdGhlIHVzZXIuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXJcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZEZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIHNsaWRlci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIG5ldyBkaXNhYmxlZCBzdGF0ZVxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBibHVyKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmJsdXIoKTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTbGlkZXJTdGFydFRodW1iXSwgaW5wdXRbbWF0U2xpZGVyRW5kVGh1bWJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXJSYW5nZVRodW1iJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX1NMSURFUl9SQU5HRV9USFVNQiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlclJhbmdlVGh1bWJ9LFxuICBdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJSYW5nZVRodW1iIGV4dGVuZHMgTWF0U2xpZGVyVGh1bWIgaW1wbGVtZW50cyBfTWF0U2xpZGVyUmFuZ2VUaHVtYiB7XG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldFNpYmxpbmcoKTogX01hdFNsaWRlclJhbmdlVGh1bWIgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fc2libGluZykge1xuICAgICAgdGhpcy5fc2libGluZyA9IHRoaXMuX3NsaWRlci5fZ2V0SW5wdXQodGhpcy5faXNFbmRUaHVtYiA/IF9NYXRUaHVtYi5TVEFSVCA6IF9NYXRUaHVtYi5FTkQpIGFzXG4gICAgICAgIHwgTWF0U2xpZGVyUmFuZ2VUaHVtYlxuICAgICAgICB8IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NpYmxpbmc7XG4gIH1cbiAgcHJpdmF0ZSBfc2libGluZzogTWF0U2xpZGVyUmFuZ2VUaHVtYiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWluaW11bSB0cmFuc2xhdGVYIHBvc2l0aW9uIGFsbG93ZWQgZm9yIHRoaXMgc2xpZGVyIGlucHV0J3MgdmlzdWFsIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRNaW5Qb3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCF0aGlzLl9pc0xlZnRUaHVtYiAmJiBzaWJsaW5nKSB7XG4gICAgICByZXR1cm4gc2libGluZy50cmFuc2xhdGVYO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHRyYW5zbGF0ZVggcG9zaXRpb24gYWxsb3dlZCBmb3IgdGhpcyBzbGlkZXIgaW5wdXQncyB2aXN1YWwgdGh1bWIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldE1heFBvcygpOiBudW1iZXIge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAodGhpcy5faXNMZWZ0VGh1bWIgJiYgc2libGluZykge1xuICAgICAgcmV0dXJuIHNpYmxpbmcudHJhbnNsYXRlWDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gIH1cblxuICBfc2V0SXNMZWZ0VGh1bWIoKTogdm9pZCB7XG4gICAgdGhpcy5faXNMZWZ0VGh1bWIgPVxuICAgICAgKHRoaXMuX2lzRW5kVGh1bWIgJiYgdGhpcy5fc2xpZGVyLl9pc1J0bCkgfHwgKCF0aGlzLl9pc0VuZFRodW1iICYmICF0aGlzLl9zbGlkZXIuX2lzUnRsKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgc2xpZGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBpbnB1dCBvbiB0aGUgbGVmdCBoYW5kIHNpZGUuICovXG4gIF9pc0xlZnRUaHVtYjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGlzIHNsaWRlciBjb3JyZXNwb25kcyB0byB0aGUgaW5wdXQgd2l0aCBncmVhdGVyIHZhbHVlLiAqL1xuICBfaXNFbmRUaHVtYjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfU0xJREVSKSBfc2xpZGVyOiBfTWF0U2xpZGVyLFxuICAgIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIG92ZXJyaWRlIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHtcbiAgICBzdXBlcihfbmdab25lLCBfZWxlbWVudFJlZiwgX2NkciwgX3NsaWRlcik7XG4gICAgdGhpcy5faXNFbmRUaHVtYiA9IHRoaXMuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyRW5kVGh1bWInKTtcbiAgICB0aGlzLl9zZXRJc0xlZnRUaHVtYigpO1xuICAgIHRoaXMudGh1bWJQb3NpdGlvbiA9IHRoaXMuX2lzRW5kVGh1bWIgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJUO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2dldERlZmF1bHRWYWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pc0VuZFRodW1iICYmIHRoaXMuX3NsaWRlci5faXNSYW5nZSA/IHRoaXMubWF4IDogdGhpcy5taW47XG4gIH1cblxuICBvdmVycmlkZSBfb25JbnB1dCgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25JbnB1dCgpO1xuICAgIHRoaXMuX3VwZGF0ZVNpYmxpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTogdm9pZCB7XG4gICAgc3VwZXIuX29uTmdDb250cm9sVmFsdWVDaGFuZ2UoKTtcbiAgICB0aGlzLmdldFNpYmxpbmcoKT8uX3VwZGF0ZU1pbk1heCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlckRvd24oZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2libGluZykge1xuICAgICAgdGhpcy5fc2libGluZy5fdXBkYXRlV2lkdGhBY3RpdmUoKTtcbiAgICAgIHRoaXMuX3NpYmxpbmcuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWlucHV0LW5vLXBvaW50ZXItZXZlbnRzJyk7XG4gICAgfVxuICAgIHN1cGVyLl9vblBvaW50ZXJEb3duKGV2ZW50KTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9vblBvaW50ZXJVcCgpOiB2b2lkIHtcbiAgICBzdXBlci5fb25Qb2ludGVyVXAoKTtcbiAgICBpZiAodGhpcy5fc2libGluZykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpYmxpbmchLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgICAgIHRoaXMuX3NpYmxpbmchLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtYXQtbWRjLXNsaWRlci1pbnB1dC1uby1wb2ludGVyLWV2ZW50cycpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX29uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLl9vblBvaW50ZXJNb3ZlKGV2ZW50KTtcbiAgICBpZiAoIXRoaXMuX3NsaWRlci5zdGVwICYmIHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVTaWJsaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX2ZpeFZhbHVlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBzdXBlci5fZml4VmFsdWUoZXZlbnQpO1xuICAgIHRoaXMuX3NpYmxpbmc/Ll91cGRhdGVNaW5NYXgoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9jbGFtcCh2OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbih2LCB0aGlzLmdldE1heFBvcygpKSwgdGhpcy5nZXRNaW5Qb3MoKSk7XG4gIH1cblxuICBfdXBkYXRlTWluTWF4KCk6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzRW5kVGh1bWIpIHtcbiAgICAgIHRoaXMubWluID0gTWF0aC5tYXgodGhpcy5fc2xpZGVyLm1pbiwgc2libGluZy52YWx1ZSk7XG4gICAgICB0aGlzLm1heCA9IHRoaXMuX3NsaWRlci5tYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWluID0gdGhpcy5fc2xpZGVyLm1pbjtcbiAgICAgIHRoaXMubWF4ID0gTWF0aC5taW4odGhpcy5fc2xpZGVyLm1heCwgc2libGluZy52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX3VwZGF0ZVdpZHRoQWN0aXZlKCk6IHZvaWQge1xuICAgIGNvbnN0IG1pbldpZHRoID0gdGhpcy5fc2xpZGVyLl9yaXBwbGVSYWRpdXMgKiAyIC0gdGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmcgKiAyO1xuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCArIHRoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nIC0gbWluV2lkdGg7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9XG4gICAgICB0aGlzLl9zbGlkZXIubWluIDwgdGhpcy5fc2xpZGVyLm1heFxuICAgICAgICA/ICh0aGlzLm1heCAtIHRoaXMubWluKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbilcbiAgICAgICAgOiAxO1xuICAgIGNvbnN0IHdpZHRoID0gbWF4V2lkdGggKiBwZXJjZW50YWdlICsgbWluV2lkdGg7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9IGAwICR7dGhpcy5fc2xpZGVyLl9pbnB1dFBhZGRpbmd9cHhgO1xuICB9XG5cbiAgb3ZlcnJpZGUgX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgY29uc3QgbWlkVmFsdWUgPSB0aGlzLl9pc0VuZFRodW1iXG4gICAgICA/IHRoaXMudmFsdWUgLSAodGhpcy52YWx1ZSAtIHNpYmxpbmcudmFsdWUpIC8gMlxuICAgICAgOiB0aGlzLnZhbHVlICsgKHNpYmxpbmcudmFsdWUgLSB0aGlzLnZhbHVlKSAvIDI7XG5cbiAgICBjb25zdCBfcGVyY2VudGFnZSA9IHRoaXMuX2lzRW5kVGh1bWJcbiAgICAgID8gKHRoaXMubWF4IC0gbWlkVmFsdWUpIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKVxuICAgICAgOiAobWlkVmFsdWUgLSB0aGlzLm1pbikgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuX3NsaWRlci5taW4gPCB0aGlzLl9zbGlkZXIubWF4ID8gX3BlcmNlbnRhZ2UgOiAxO1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBuYXRpdmUgaW5wdXQgd2lkdGggYnkgdGhlIHJhZGl1cyBvZiB0aGUgcmlwcGxlXG4gICAgbGV0IHJpcHBsZVBhZGRpbmcgPSB0aGlzLl9zbGlkZXIuX3JpcHBsZVJhZGl1cztcblxuICAgIC8vIElmIG9uZSBvZiB0aGUgaW5wdXRzIGlzIG1heGltYWxseSBzaXplZCAodGhlIHZhbHVlIG9mIGJvdGggdGh1bWJzIGlzXG4gICAgLy8gZXF1YWwgdG8gdGhlIG1pbiBvciBtYXgpLCBtYWtlIHRoYXQgaW5wdXQgdGFrZSB1cCBhbGwgb2YgdGhlIHdpZHRoIGFuZFxuICAgIC8vIG1ha2UgdGhlIG90aGVyIHVuc2VsZWN0YWJsZS5cbiAgICBpZiAocGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgcmlwcGxlUGFkZGluZyA9IDQ4O1xuICAgIH0gZWxzZSBpZiAocGVyY2VudGFnZSA9PT0gMCkge1xuICAgICAgcmlwcGxlUGFkZGluZyA9IDA7XG4gICAgfVxuXG4gICAgY29uc3Qgd2lkdGggPSBtYXhXaWR0aCAqIHBlcmNlbnRhZ2UgKyByaXBwbGVQYWRkaW5nO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnMHB4JztcblxuICAgIGlmICh0aGlzLl9pc0xlZnRUaHVtYikge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICctMjRweCc7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJy0yNHB4JztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlU3RhdGljU3R5bGVzKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21hdC1zbGlkZXJfX3JpZ2h0LWlucHV0JywgIXRoaXMuX2lzTGVmdFRodW1iKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVNpYmxpbmcoKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghc2libGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaWJsaW5nLl91cGRhdGVNaW5NYXgoKTtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHNpYmxpbmcuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpYmxpbmcuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW5wdXQncyB2YWx1ZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG92ZXJyaWRlIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0NvbnRyb2xJbml0aWFsaXplZCB8fCB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICAgIH1cbiAgfVxufVxuIl19