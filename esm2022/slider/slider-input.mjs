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
            if (isCursorOnSliderThumb) {
                this._isActive = true;
            }
        }
        else {
            this._isActive = true;
            this._setIsFocused(true);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBb0MsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFNTCxzQkFBc0IsRUFDdEIsZ0JBQWdCLEVBQ2hCLFVBQVUsR0FDWCxNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFL0M7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQVE7SUFDbEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxxQ0FBcUMsR0FBUTtJQUN4RCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUM7SUFDbEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7Ozs7Ozs7R0FPRztBQW9CSCxNQUFNLE9BQU8sY0FBYztJQUN6QixJQUNJ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U0FBUyxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzlCO2FBQU07WUFDTCxPQUFPLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ00sVUFBVSxDQUFDLEtBQVU7UUFDNUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDOzhHQXBNVSxtQkFBbUIsd0NBaURwQixVQUFVO2tHQWpEVCxtQkFBbUIsK0VBTG5CO1lBQ1QscUNBQXFDO1lBQ3JDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBQztTQUNwRTs7MkZBRVUsbUJBQW1CO2tCQVIvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzREFBc0Q7b0JBQ2hFLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFNBQVMsRUFBRTt3QkFDVCxxQ0FBcUM7d0JBQ3JDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcscUJBQXFCLEVBQUM7cUJBQ3BFO2lCQUNGOzswQkFrREksTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBfTWF0VGh1bWIsXG4gIE1hdFNsaWRlckRyYWdFdmVudCxcbiAgX01hdFNsaWRlcixcbiAgX01hdFNsaWRlclJhbmdlVGh1bWIsXG4gIF9NYXRTbGlkZXJUaHVtYixcbiAgTUFUX1NMSURFUl9SQU5HRV9USFVNQixcbiAgTUFUX1NMSURFUl9USFVNQixcbiAgTUFUX1NMSURFUixcbn0gZnJvbSAnLi9zbGlkZXItaW50ZXJmYWNlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyVGh1bWIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIHJhbmdlIHNsaWRlciB0aHVtYiB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9SQU5HRV9USFVNQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyUmFuZ2VUaHVtYiksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIHNsaWRlci1zcGVjaWZpYyBiZWhhdmlvcnMgdG8gYW4gaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtc2xpZGVyPmAuXG4gKiBVcCB0byB0d28gbWF5IGJlIHBsYWNlZCBpbnNpZGUgb2YgYSBgPG1hdC1zbGlkZXI+YC5cbiAqXG4gKiBJZiBvbmUgaXMgdXNlZCwgdGhlIHNlbGVjdG9yIGBtYXRTbGlkZXJUaHVtYmAgbXVzdCBiZSB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIG5vcm1hbFxuICogc2xpZGVyLiBJZiB0d28gYXJlIHVzZWQsIHRoZSBzZWxlY3RvcnMgYG1hdFNsaWRlclN0YXJ0VGh1bWJgIGFuZCBgbWF0U2xpZGVyRW5kVGh1bWJgIG11c3QgYmVcbiAqIHVzZWQsIGFuZCB0aGUgb3V0Y29tZSB3aWxsIGJlIGEgcmFuZ2Ugc2xpZGVyIHdpdGggdHdvIHNsaWRlciB0aHVtYnMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFNsaWRlclRodW1iXScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyVGh1bWInLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbGlkZXJfX2lucHV0JyxcbiAgICAndHlwZSc6ICdyYW5nZScsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWV0ZXh0XSc6ICdfdmFsdWV0ZXh0JyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCknLFxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogQ29uc2lkZXIgdXNpbmcgYSBnbG9iYWwgZXZlbnQgbGlzdGVuZXIgaW5zdGVhZC5cbiAgICAvLyBSZWFzb246IEkgaGF2ZSBmb3VuZCBhIHNlbWktY29uc2lzdGVudCB3YXkgdG8gbW91c2UgdXAgd2l0aG91dCB0cmlnZ2VyaW5nIHRoaXMgZXZlbnQuXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfU0xJREVSX1RIVU1CX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfU0xJREVSX1RIVU1CLCB1c2VFeGlzdGluZzogTWF0U2xpZGVyVGh1bWJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIF9NYXRTbGlkZXJUaHVtYiwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSk7XG4gIH1cbiAgc2V0IHZhbHVlKHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgdmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICBpZiAoIXRoaXMuX2hhc1NldEluaXRpYWxWYWx1ZSkge1xuICAgICAgdGhpcy5faW5pdGlhbFZhbHVlID0gdmFsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSB2YWw7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB0aGlzLl9zbGlkZXIuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBgdmFsdWVgIGlzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RhcnRzIGJlaW5nIGRyYWdnZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgc3RvcHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdFbmQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdHJhbnNsYXRlWCBpbiBweCBvZiB0aGUgc2xpZGVyIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHRyYW5zbGF0ZVgoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLm1pbiA+PSB0aGlzLl9zbGlkZXIubWF4KSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gMDtcbiAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGVYO1xuICAgIH1cbiAgICBpZiAodGhpcy5fdHJhbnNsYXRlWCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90cmFuc2xhdGVYID0gdGhpcy5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGVYO1xuICB9XG4gIHNldCB0cmFuc2xhdGVYKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3RyYW5zbGF0ZVggPSB2O1xuICB9XG4gIHByaXZhdGUgX3RyYW5zbGF0ZVg6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyB0aHVtYiBpcyB0aGUgc3RhcnQgb3IgZW5kIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWIgPSBfTWF0VGh1bWIuRU5EO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5faG9zdEVsZW1lbnQubWluKTtcbiAgfVxuICBzZXQgbWluKHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodikudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5tYXgpO1xuICB9XG4gIHNldCBtYXgodjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5tYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KS50b1N0cmluZygpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBnZXQgc3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5zdGVwKTtcbiAgfVxuICBzZXQgc3RlcCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KS50b1N0cmluZygpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmRpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5fc2xpZGVyLmRpc2FibGVkICE9PSB0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudGFnZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9zbGlkZXIubWluID49IHRoaXMuX3NsaWRlci5tYXgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2lzUnRsID8gMSA6IDA7XG4gICAgfVxuICAgIHJldHVybiAodGhpcy52YWx1ZSAtIHRoaXMuX3NsaWRlci5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBmaWxsUGVyY2VudGFnZSgpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlci5faXNSdGwgPyAxIDogMDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RyYW5zbGF0ZVggPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVYIC8gdGhpcy5fc2xpZGVyLl9jYWNoZWRXaWR0aDtcbiAgfVxuXG4gIC8qKiBUaGUgaG9zdCBuYXRpdmUgSFRNTCBpbnB1dCBlbGVtZW50LiAqL1xuICBfaG9zdEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgLyoqIFRoZSBhcmlhLXZhbHVldGV4dCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGlucHV0J3MgdmFsdWUuICovXG4gIF92YWx1ZXRleHQ6IHN0cmluZztcblxuICAvKiogVGhlIHJhZGl1cyBvZiBhIG5hdGl2ZSBodG1sIHNsaWRlcidzIGtub2IuICovXG4gIF9rbm9iUmFkaXVzOiBudW1iZXIgPSA4O1xuXG4gIC8qKiBXaGV0aGVyIHVzZXIncyBjdXJzb3IgaXMgY3VycmVudGx5IGluIGEgbW91c2UgZG93biBzdGF0ZSBvbiB0aGUgaW5wdXQuICovXG4gIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBjdXJyZW50bHkgZm9jdXNlZCAoZWl0aGVyIGJ5IHRhYiBvciBhZnRlciBjbGlja2luZykuICovXG4gIF9pc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVXNlZCB0byByZWxheSB1cGRhdGVzIHRvIF9pc0ZvY3VzZWQgdG8gdGhlIHNsaWRlciB2aXN1YWwgdGh1bWJzLiAqL1xuICBwcml2YXRlIF9zZXRJc0ZvY3VzZWQodjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX2lzRm9jdXNlZCA9IHY7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaW5pdGlhbCB2YWx1ZSBoYXMgYmVlbiBzZXQuXG4gICAqIFRoaXMgZXhpc3RzIGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2Fubm90IGJlIGltbWVkaWF0ZWx5IHNldCBiZWNhdXNlIHRoZSBtaW4gYW5kIG1heFxuICAgKiBtdXN0IGZpcnN0IGJlIHJlbGF5ZWQgZnJvbSB0aGUgcGFyZW50IE1hdFNsaWRlciBjb21wb25lbnQsIHdoaWNoIGNhbiBvbmx5IGhhcHBlbiBsYXRlclxuICAgKiBpbiB0aGUgY29tcG9uZW50IGxpZmVjeWNsZS5cbiAgICovXG4gIHByaXZhdGUgX2hhc1NldEluaXRpYWxWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc3RvcmVkIGluaXRpYWwgdmFsdWUuICovXG4gIF9pbml0aWFsVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKiogRGVmaW5lZCB3aGVuIGEgdXNlciBpcyB1c2luZyBhIGZvcm0gY29udHJvbCB0byBtYW5hZ2Ugc2xpZGVyIHZhbHVlICYgdmFsaWRhdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIFVJIHVwZGF0ZXMgc2hvdWxkIGJlIHNraXBwZWQuXG4gICAqXG4gICAqIFRoaXMgZmxhZyBpcyB1c2VkIHRvIGF2b2lkIGZsaWNrZXJpbmdcbiAgICogd2hlbiBjb3JyZWN0aW5nIHZhbHVlcyBvbiBwb2ludGVyIHVwL2Rvd24uXG4gICAqL1xuICBfc2tpcFVJVXBkYXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBzbGlkZXIgaW5wdXQgdmFsdWUgY2hhbmdlcy4gKi9cbiAgcHJvdGVjdGVkIF9vbkNoYW5nZUZuOiAoKHZhbHVlOiBhbnkpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgc2xpZGVyIGlucHV0IGhhcyBiZWVuIHRvdWNoZWQuICovXG4gIHByaXZhdGUgX29uVG91Y2hlZEZuOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIE5nTW9kZWwgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIFRoaXMgZmxhZyBpcyB1c2VkIHRvIGlnbm9yZSBnaG9zdCBudWxsIGNhbGxzIHRvXG4gICAqIHdyaXRlVmFsdWUgd2hpY2ggY2FuIGJyZWFrIHNsaWRlciBpbml0aWFsaXphdGlvbi5cbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE0OTg4LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9pc0NvbnRyb2xJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3BsYXRmb3JtID0gaW5qZWN0KFBsYXRmb3JtKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChNQVRfU0xJREVSKSBwcm90ZWN0ZWQgX3NsaWRlcjogX01hdFNsaWRlcixcbiAgKSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX29uUG9pbnRlckRvd24uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX29uUG9pbnRlck1vdmUuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vblBvaW50ZXJVcC5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fb25Qb2ludGVyRG93bik7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9vblBvaW50ZXJNb3ZlKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9vblBvaW50ZXJVcCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLmRyYWdTdGFydC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZHJhZ0VuZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgaW5pdFByb3BzKCk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIC8vIElmIHRoaXMgb3IgdGhlIHBhcmVudCBzbGlkZXIgaXMgZGlzYWJsZWQsIGp1c3QgbWFrZSBldmVyeXRoaW5nIGRpc2FibGVkLlxuICAgIGlmICh0aGlzLmRpc2FibGVkICE9PSB0aGlzLl9zbGlkZXIuZGlzYWJsZWQpIHtcbiAgICAgIC8vIFRoZSBNYXRTbGlkZXIgc2V0dGVyIGZvciBkaXNhYmxlZCB3aWxsIHJlbGF5IHRoaXMgYW5kIGRpc2FibGUgYm90aCBpbnB1dHMuXG4gICAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuc3RlcCA9IHRoaXMuX3NsaWRlci5zdGVwO1xuICAgIHRoaXMubWluID0gdGhpcy5fc2xpZGVyLm1pbjtcbiAgICB0aGlzLm1heCA9IHRoaXMuX3NsaWRlci5tYXg7XG4gICAgdGhpcy5faW5pdFZhbHVlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBpbml0VUkoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgfVxuXG4gIF9pbml0VmFsdWUoKTogdm9pZCB7XG4gICAgdGhpcy5faGFzU2V0SW5pdGlhbFZhbHVlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5faW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQudmFsdWUgPSB0aGlzLl9pbml0aWFsVmFsdWU7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgdGhpcy5fc2xpZGVyLl9vblZhbHVlQ2hhbmdlKHRoaXMpO1xuICAgICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0RGVmYXVsdFZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubWluO1xuICB9XG5cbiAgX29uQmx1cigpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJc0ZvY3VzZWQoZmFsc2UpO1xuICAgIHRoaXMuX29uVG91Y2hlZEZuKCk7XG4gIH1cblxuICBfb25Gb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJc0ZvY3VzZWQodHJ1ZSk7XG4gIH1cblxuICBfb25DaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIC8vIG9ubHkgdXNlZCB0byBoYW5kbGUgdGhlIGVkZ2UgY2FzZSB3aGVyZSB1c2VyXG4gICAgLy8gbW91c2Vkb3duIG9uIHRoZSBzbGlkZXIgdGhlbiB1c2VzIGFycm93IGtleXMuXG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSh7d2l0aEFuaW1hdGlvbjogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0KCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlRm4/Lih0aGlzLnZhbHVlKTtcbiAgICAvLyBoYW5kbGVzIGFycm93aW5nIGFuZCB1cGRhdGluZyB0aGUgdmFsdWUgd2hlblxuICAgIC8vIGEgc3RlcCBpcyBkZWZpbmVkLlxuICAgIGlmICh0aGlzLl9zbGlkZXIuc3RlcCB8fCAhdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKHt3aXRoQW5pbWF0aW9uOiB0cnVlfSk7XG4gICAgfVxuICAgIHRoaXMuX3NsaWRlci5fb25WYWx1ZUNoYW5nZSh0aGlzKTtcbiAgfVxuXG4gIF9vbk5nQ29udHJvbFZhbHVlQ2hhbmdlKCk6IHZvaWQge1xuICAgIC8vIG9ubHkgdXNlZCB0byBoYW5kbGUgd2hlbiB0aGUgdmFsdWUgY2hhbmdlXG4gICAgLy8gb3JpZ2luYXRlcyBvdXRzaWRlIG9mIHRoZSBzbGlkZXIuXG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSB8fCAhdGhpcy5faXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9zbGlkZXIuZGlzYWJsZWQgPSB0aGlzLl9mb3JtQ29udHJvbCEuZGlzYWJsZWQ7XG4gIH1cblxuICBfb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT24gSU9TLCBkcmFnZ2luZyBvbmx5IHdvcmtzIGlmIHRoZSBwb2ludGVyIGRvd24gaGFwcGVucyBvbiB0aGVcbiAgICAvLyBzbGlkZXIgdGh1bWIgYW5kIHRoZSBzbGlkZXIgZG9lcyBub3QgcmVjZWl2ZSBmb2N1cyBmcm9tIHBvaW50ZXIgZXZlbnRzLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5JT1MpIHtcbiAgICAgIGNvbnN0IGlzQ3Vyc29yT25TbGlkZXJUaHVtYiA9IHRoaXMuX3NsaWRlci5faXNDdXJzb3JPblNsaWRlclRodW1iKFxuICAgICAgICBldmVudCxcbiAgICAgICAgdGhpcy5fc2xpZGVyLl9nZXRUaHVtYih0aGlzLnRodW1iUG9zaXRpb24pLl9ob3N0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0N1cnNvck9uU2xpZGVyVGh1bWIpIHtcbiAgICAgICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLl9zZXRJc0ZvY3VzZWQodHJ1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlV2lkdGhBY3RpdmUoKTtcbiAgICB0aGlzLl9zbGlkZXIuX3VwZGF0ZURpbWVuc2lvbnMoKTtcblxuICAgIC8vIERvZXMgbm90aGluZyBpZiBhIHN0ZXAgaXMgZGVmaW5lZCBiZWNhdXNlIHdlXG4gICAgLy8gd2FudCB0aGUgdmFsdWUgdG8gc25hcCB0byB0aGUgdmFsdWVzIG9uIGlucHV0LlxuICAgIGlmICghdGhpcy5fc2xpZGVyLnN0ZXApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRodW1iVUlCeVBvaW50ZXJFdmVudChldmVudCwge3dpdGhBbmltYXRpb246IHRydWV9KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2hhbmRsZVZhbHVlQ29ycmVjdGlvbihldmVudCk7XG4gICAgICB0aGlzLmRyYWdTdGFydC5lbWl0KHtzb3VyY2U6IHRoaXMsIHBhcmVudDogdGhpcy5fc2xpZGVyLCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JyZWN0cyB0aGUgdmFsdWUgb2YgdGhlIHNsaWRlciBvbiBwb2ludGVyIHVwL2Rvd24uXG4gICAqXG4gICAqIENhbGxlZCBvbiBwb2ludGVyIGRvd24gYW5kIHVwIGJlY2F1c2UgdGhlIHZhbHVlIGlzIHNldCBiYXNlZFxuICAgKiBvbiB0aGUgaW5hY3RpdmUgd2lkdGggaW5zdGVhZCBvZiB0aGUgYWN0aXZlIHdpZHRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFuZGxlVmFsdWVDb3JyZWN0aW9uKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBEb24ndCB1cGRhdGUgdGhlIFVJIHdpdGggdGhlIGN1cnJlbnQgdmFsdWUhIFRoZSB2YWx1ZSBvbiBwb2ludGVyZG93blxuICAgIC8vIGFuZCBwb2ludGVydXAgaXMgY2FsY3VsYXRlZCBpbiB0aGUgc3BsaXQgc2Vjb25kIGJlZm9yZSB0aGUgaW5wdXQocylcbiAgICAvLyByZXNpemUuIFNlZSBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpIGFuZCBfdXBkYXRlV2lkdGhBY3RpdmUoKSBmb3IgbW9yZVxuICAgIC8vIGRldGFpbHMuXG4gICAgdGhpcy5fc2tpcFVJVXBkYXRlID0gdHJ1ZTtcblxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGdldHMgdHJpZ2dlcmVkIGJlZm9yZSB0aGUgYWN0dWFsIHZhbHVlIG9mIHRoZVxuICAgIC8vIHNsaWRlciBpcyB1cGRhdGVkLiBUaGlzIG1lYW5zIGlmIHdlIHdlcmUgdG8gc2V0IHRoZSB2YWx1ZSBoZXJlLCBpdFxuICAgIC8vIHdvdWxkIGltbWVkaWF0ZWx5IGJlIG92ZXJ3cml0dGVuLiBVc2luZyBzZXRUaW1lb3V0IGVuc3VyZXMgdGhlIHNldHRpbmdcbiAgICAvLyBvZiB0aGUgdmFsdWUgaGFwcGVucyBhZnRlciB0aGUgdmFsdWUgaGFzIGJlZW4gdXBkYXRlZCBieSB0aGVcbiAgICAvLyBwb2ludGVyZG93biBldmVudC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3NraXBVSVVwZGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5fZml4VmFsdWUoZXZlbnQpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgLyoqIENvcnJlY3RzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIGJhc2VkIG9uIHRoZSBwb2ludGVyIGV2ZW50J3MgcG9zaXRpb24uICovXG4gIF9maXhWYWx1ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgeFBvcyA9IGV2ZW50LmNsaWVudFggLSB0aGlzLl9zbGlkZXIuX2NhY2hlZExlZnQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICAgIGNvbnN0IHN0ZXAgPSB0aGlzLl9zbGlkZXIuc3RlcCA9PT0gMCA/IDEgOiB0aGlzLl9zbGlkZXIuc3RlcDtcbiAgICBjb25zdCBudW1TdGVwcyA9IE1hdGguZmxvb3IoKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKSAvIHN0ZXApO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLl9zbGlkZXIuX2lzUnRsID8gMSAtIHhQb3MgLyB3aWR0aCA6IHhQb3MgLyB3aWR0aDtcblxuICAgIC8vIFRvIGVuc3VyZSB0aGUgcGVyY2VudGFnZSBpcyByb3VuZGVkIHRvIHRoZSBuZWNlc3NhcnkgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICAgIGNvbnN0IGZpeGVkUGVyY2VudGFnZSA9IE1hdGgucm91bmQocGVyY2VudGFnZSAqIG51bVN0ZXBzKSAvIG51bVN0ZXBzO1xuXG4gICAgY29uc3QgaW1wcmVjaXNlVmFsdWUgPVxuICAgICAgZml4ZWRQZXJjZW50YWdlICogKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKSArIHRoaXMuX3NsaWRlci5taW47XG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLnJvdW5kKGltcHJlY2lzZVZhbHVlIC8gc3RlcCkgKiBzdGVwO1xuICAgIGNvbnN0IHByZXZWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICBpZiAodmFsdWUgPT09IHByZXZWYWx1ZSkge1xuICAgICAgLy8gQmVjYXVzZSB3ZSBwcmV2ZW50ZWQgVUkgdXBkYXRlcywgaWYgaXQgdHVybnMgb3V0IHRoYXQgdGhlIHJhY2VcbiAgICAgIC8vIGNvbmRpdGlvbiBkaWRuJ3QgaGFwcGVuIGFuZCB0aGUgdmFsdWUgaXMgYWxyZWFkeSBjb3JyZWN0LCB3ZVxuICAgICAgLy8gaGF2ZSB0byBhcHBseSB0aGUgdWkgdXBkYXRlcyBub3cuXG4gICAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLl9zbGlkZXIuc3RlcCA+IDBcbiAgICAgICAgPyB0aGlzLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpXG4gICAgICAgIDogdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdGhpcy5fc2xpZGVyLl9oYXNBbmltYXRpb259KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIHRoaXMuX29uQ2hhbmdlRm4/Lih0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9zbGlkZXIuX29uVmFsdWVDaGFuZ2UodGhpcyk7XG4gICAgdGhpcy5fc2xpZGVyLnN0ZXAgPiAwXG4gICAgICA/IHRoaXMuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKClcbiAgICAgIDogdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50LCB7d2l0aEFuaW1hdGlvbjogdGhpcy5fc2xpZGVyLl9oYXNBbmltYXRpb259KTtcbiAgfVxuXG4gIF9vblBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBBZ2FpbiwgZG9lcyBub3RoaW5nIGlmIGEgc3RlcCBpcyBkZWZpbmVkIGJlY2F1c2VcbiAgICAvLyB3ZSB3YW50IHRoZSB2YWx1ZSB0byBzbmFwIHRvIHRoZSB2YWx1ZXMgb24gaW5wdXQuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCAmJiB0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlVGh1bWJVSUJ5UG9pbnRlckV2ZW50KGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBfb25Qb2ludGVyVXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoe3NvdXJjZTogdGhpcywgcGFyZW50OiB0aGlzLl9zbGlkZXIsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG5cbiAgICAgIC8vIFRoaXMgc2V0VGltZW91dCBpcyB0byBwcmV2ZW50IHRoZSBwb2ludGVydXAgZnJvbSB0cmlnZ2VyaW5nIGEgdmFsdWVcbiAgICAgIC8vIGNoYW5nZSBvbiB0aGUgaW5wdXQgYmFzZWQgb24gdGhlIGluYWN0aXZlIHdpZHRoLiBJdCdzIG5vdCBjbGVhciB3aHlcbiAgICAgIC8vIGJ1dCBmb3Igc29tZSByZWFzb24gb24gSU9TIHRoaXMgcmFjZSBjb25kaXRpb24gaXMgZXZlbiBtb3JlIGNvbW1vbiBzb1xuICAgICAgLy8gdGhlIHRpbWVvdXQgbmVlZHMgdG8gYmUgaW5jcmVhc2VkLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCksIHRoaXMuX3BsYXRmb3JtLklPUyA/IDEwIDogMCk7XG4gICAgfVxuICB9XG5cbiAgX2NsYW1wKHY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGgpLCAwKTtcbiAgfVxuXG4gIF9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyLl9pc1J0bCkge1xuICAgICAgcmV0dXJuICgxIC0gdGhpcy5wZXJjZW50YWdlKSAqIHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBlcmNlbnRhZ2UgKiB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICB9XG5cbiAgX2NhbGNUcmFuc2xhdGVYQnlQb2ludGVyRXZlbnQoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGV2ZW50LmNsaWVudFggLSB0aGlzLl9zbGlkZXIuX2NhY2hlZExlZnQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBzZXQgdGhlIHNsaWRlciB3aWR0aCB0byB0aGUgY29ycmVjdFxuICAgKiBkaW1lbnNpb25zIHdoaWxlIHRoZSB1c2VyIGlzIGRyYWdnaW5nLlxuICAgKi9cbiAgX3VwZGF0ZVdpZHRoQWN0aXZlKCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBgMCAke3RoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nfXB4YDtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgKyAke3RoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nfXB4KWA7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2xpZGVyIGlucHV0IHRvIGRpc3Byb3BvcnRpb25hdGUgZGltZW5zaW9ucyB0byBhbGxvdyBmb3IgdG91Y2hcbiAgICogZXZlbnRzIHRvIGJlIGNhcHR1cmVkIG9uIHRvdWNoIGRldmljZXMuXG4gICAqL1xuICBfdXBkYXRlV2lkdGhJbmFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzBweCc7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSAnY2FsYygxMDAlICsgNDhweCknO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSAnLTI0cHgnO1xuICB9XG5cbiAgX3VwZGF0ZVRodW1iVUlCeVZhbHVlKG9wdGlvbnM/OiB7d2l0aEFuaW1hdGlvbjogYm9vbGVhbn0pOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVggPSB0aGlzLl9jbGFtcCh0aGlzLl9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKSk7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSShvcHRpb25zKTtcbiAgfVxuXG4gIF91cGRhdGVUaHVtYlVJQnlQb2ludGVyRXZlbnQoZXZlbnQ6IFBvaW50ZXJFdmVudCwgb3B0aW9ucz86IHt3aXRoQW5pbWF0aW9uOiBib29sZWFufSk6IHZvaWQge1xuICAgIHRoaXMudHJhbnNsYXRlWCA9IHRoaXMuX2NsYW1wKHRoaXMuX2NhbGNUcmFuc2xhdGVYQnlQb2ludGVyRXZlbnQoZXZlbnQpKTtcbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJKG9wdGlvbnMpO1xuICB9XG5cbiAgX3VwZGF0ZVRodW1iVUkob3B0aW9ucz86IHt3aXRoQW5pbWF0aW9uOiBib29sZWFufSkge1xuICAgIHRoaXMuX3NsaWRlci5fc2V0VHJhbnNpdGlvbighIW9wdGlvbnM/LndpdGhBbmltYXRpb24pO1xuICAgIHRoaXMuX3NsaWRlci5fb25UcmFuc2xhdGVYQ2hhbmdlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGlucHV0J3MgdmFsdWUuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBpbnB1dFxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNDb250cm9sSW5pdGlhbGl6ZWQgfHwgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBpbnB1dCdzIHZhbHVlIGNoYW5nZXMgZnJvbSB1c2VyIGlucHV0LlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIHRvIHJlZ2lzdGVyXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlRm4gPSBmbjtcbiAgICB0aGlzLl9pc0NvbnRyb2xJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBpbnB1dCBpcyBibHVycmVkIGJ5IHRoZSB1c2VyLlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIHRvIHJlZ2lzdGVyXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWRGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIG9mIHRoZSBzbGlkZXIuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFRoZSBuZXcgZGlzYWJsZWQgc3RhdGVcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgYmx1cigpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5ibHVyKCk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0U2xpZGVyU3RhcnRUaHVtYl0sIGlucHV0W21hdFNsaWRlckVuZFRodW1iXScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyUmFuZ2VUaHVtYicsXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9TTElERVJfUkFOR0VfVEhVTUJfVkFMVUVfQUNDRVNTT1IsXG4gICAge3Byb3ZpZGU6IE1BVF9TTElERVJfUkFOR0VfVEhVTUIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJSYW5nZVRodW1ifSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyUmFuZ2VUaHVtYiBleHRlbmRzIE1hdFNsaWRlclRodW1iIGltcGxlbWVudHMgX01hdFNsaWRlclJhbmdlVGh1bWIge1xuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXRTaWJsaW5nKCk6IF9NYXRTbGlkZXJSYW5nZVRodW1iIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuX3NpYmxpbmcpIHtcbiAgICAgIHRoaXMuX3NpYmxpbmcgPSB0aGlzLl9zbGlkZXIuX2dldElucHV0KHRoaXMuX2lzRW5kVGh1bWIgPyBfTWF0VGh1bWIuU1RBUlQgOiBfTWF0VGh1bWIuRU5EKSBhc1xuICAgICAgICB8IE1hdFNsaWRlclJhbmdlVGh1bWJcbiAgICAgICAgfCB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zaWJsaW5nO1xuICB9XG4gIHByaXZhdGUgX3NpYmxpbmc6IE1hdFNsaWRlclJhbmdlVGh1bWIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1pbmltdW0gdHJhbnNsYXRlWCBwb3NpdGlvbiBhbGxvd2VkIGZvciB0aGlzIHNsaWRlciBpbnB1dCdzIHZpc3VhbCB0aHVtYi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWluUG9zKCk6IG51bWJlciB7XG4gICAgY29uc3Qgc2libGluZyA9IHRoaXMuZ2V0U2libGluZygpO1xuICAgIGlmICghdGhpcy5faXNMZWZ0VGh1bWIgJiYgc2libGluZykge1xuICAgICAgcmV0dXJuIHNpYmxpbmcudHJhbnNsYXRlWDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSB0cmFuc2xhdGVYIHBvc2l0aW9uIGFsbG93ZWQgZm9yIHRoaXMgc2xpZGVyIGlucHV0J3MgdmlzdWFsIHRodW1iLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRNYXhQb3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKHRoaXMuX2lzTGVmdFRodW1iICYmIHNpYmxpbmcpIHtcbiAgICAgIHJldHVybiBzaWJsaW5nLnRyYW5zbGF0ZVg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICB9XG5cbiAgX3NldElzTGVmdFRodW1iKCk6IHZvaWQge1xuICAgIHRoaXMuX2lzTGVmdFRodW1iID1cbiAgICAgICh0aGlzLl9pc0VuZFRodW1iICYmIHRoaXMuX3NsaWRlci5faXNSdGwpIHx8ICghdGhpcy5faXNFbmRUaHVtYiAmJiAhdGhpcy5fc2xpZGVyLl9pc1J0bCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIHNsaWRlciBjb3JyZXNwb25kcyB0byB0aGUgaW5wdXQgb24gdGhlIGxlZnQgaGFuZCBzaWRlLiAqL1xuICBfaXNMZWZ0VGh1bWI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBzbGlkZXIgY29ycmVzcG9uZHMgdG8gdGhlIGlucHV0IHdpdGggZ3JlYXRlciB2YWx1ZS4gKi9cbiAgX2lzRW5kVGh1bWI6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoTUFUX1NMSURFUikgX3NsaWRlcjogX01hdFNsaWRlcixcbiAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBvdmVycmlkZSByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgc3VwZXIoX25nWm9uZSwgX2VsZW1lbnRSZWYsIF9jZHIsIF9zbGlkZXIpO1xuICAgIHRoaXMuX2lzRW5kVGh1bWIgPSB0aGlzLl9ob3N0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ21hdFNsaWRlckVuZFRodW1iJyk7XG4gICAgdGhpcy5fc2V0SXNMZWZ0VGh1bWIoKTtcbiAgICB0aGlzLnRodW1iUG9zaXRpb24gPSB0aGlzLl9pc0VuZFRodW1iID8gX01hdFRodW1iLkVORCA6IF9NYXRUaHVtYi5TVEFSVDtcbiAgfVxuXG4gIG92ZXJyaWRlIF9nZXREZWZhdWx0VmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faXNFbmRUaHVtYiAmJiB0aGlzLl9zbGlkZXIuX2lzUmFuZ2UgPyB0aGlzLm1heCA6IHRoaXMubWluO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uSW5wdXQoKTogdm9pZCB7XG4gICAgc3VwZXIuX29uSW5wdXQoKTtcbiAgICB0aGlzLl91cGRhdGVTaWJsaW5nKCk7XG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIF9vbk5nQ29udHJvbFZhbHVlQ2hhbmdlKCk6IHZvaWQge1xuICAgIHN1cGVyLl9vbk5nQ29udHJvbFZhbHVlQ2hhbmdlKCk7XG4gICAgdGhpcy5nZXRTaWJsaW5nKCk/Ll91cGRhdGVNaW5NYXgoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9vblBvaW50ZXJEb3duKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NpYmxpbmcpIHtcbiAgICAgIHRoaXMuX3NpYmxpbmcuX3VwZGF0ZVdpZHRoQWN0aXZlKCk7XG4gICAgICB0aGlzLl9zaWJsaW5nLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLXNsaWRlci1pbnB1dC1uby1wb2ludGVyLWV2ZW50cycpO1xuICAgIH1cbiAgICBzdXBlci5fb25Qb2ludGVyRG93bihldmVudCk7XG4gIH1cblxuICBvdmVycmlkZSBfb25Qb2ludGVyVXAoKTogdm9pZCB7XG4gICAgc3VwZXIuX29uUG9pbnRlclVwKCk7XG4gICAgaWYgKHRoaXMuX3NpYmxpbmcpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl9zaWJsaW5nIS5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgICAgICB0aGlzLl9zaWJsaW5nIS5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0LW1kYy1zbGlkZXItaW5wdXQtbm8tcG9pbnRlci1ldmVudHMnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIF9vblBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBzdXBlci5fb25Qb2ludGVyTW92ZShldmVudCk7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXIuc3RlcCAmJiB0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlU2libGluZygpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIF9maXhWYWx1ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIuX2ZpeFZhbHVlKGV2ZW50KTtcbiAgICB0aGlzLl9zaWJsaW5nPy5fdXBkYXRlTWluTWF4KCk7XG4gIH1cblxuICBvdmVycmlkZSBfY2xhbXAodjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odiwgdGhpcy5nZXRNYXhQb3MoKSksIHRoaXMuZ2V0TWluUG9zKCkpO1xuICB9XG5cbiAgX3VwZGF0ZU1pbk1heCgpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0VuZFRodW1iKSB7XG4gICAgICB0aGlzLm1pbiA9IE1hdGgubWF4KHRoaXMuX3NsaWRlci5taW4sIHNpYmxpbmcudmFsdWUpO1xuICAgICAgdGhpcy5tYXggPSB0aGlzLl9zbGlkZXIubWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pbiA9IHRoaXMuX3NsaWRlci5taW47XG4gICAgICB0aGlzLm1heCA9IE1hdGgubWluKHRoaXMuX3NsaWRlci5tYXgsIHNpYmxpbmcudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIF91cGRhdGVXaWR0aEFjdGl2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBtaW5XaWR0aCA9IHRoaXMuX3NsaWRlci5fcmlwcGxlUmFkaXVzICogMiAtIHRoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nICogMjtcbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuX3NsaWRlci5fY2FjaGVkV2lkdGggKyB0aGlzLl9zbGlkZXIuX2lucHV0UGFkZGluZyAtIG1pbldpZHRoO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPVxuICAgICAgdGhpcy5fc2xpZGVyLm1pbiA8IHRoaXMuX3NsaWRlci5tYXhcbiAgICAgICAgPyAodGhpcy5tYXggLSB0aGlzLm1pbikgLyAodGhpcy5fc2xpZGVyLm1heCAtIHRoaXMuX3NsaWRlci5taW4pXG4gICAgICAgIDogMTtcbiAgICBjb25zdCB3aWR0aCA9IG1heFdpZHRoICogcGVyY2VudGFnZSArIG1pbldpZHRoO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBgMCAke3RoaXMuX3NsaWRlci5faW5wdXRQYWRkaW5nfXB4YDtcbiAgfVxuXG4gIG92ZXJyaWRlIF91cGRhdGVXaWR0aEluYWN0aXZlKCk6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9zbGlkZXIuX2NhY2hlZFdpZHRoO1xuICAgIGNvbnN0IG1pZFZhbHVlID0gdGhpcy5faXNFbmRUaHVtYlxuICAgICAgPyB0aGlzLnZhbHVlIC0gKHRoaXMudmFsdWUgLSBzaWJsaW5nLnZhbHVlKSAvIDJcbiAgICAgIDogdGhpcy52YWx1ZSArIChzaWJsaW5nLnZhbHVlIC0gdGhpcy52YWx1ZSkgLyAyO1xuXG4gICAgY29uc3QgX3BlcmNlbnRhZ2UgPSB0aGlzLl9pc0VuZFRodW1iXG4gICAgICA/ICh0aGlzLm1heCAtIG1pZFZhbHVlKSAvICh0aGlzLl9zbGlkZXIubWF4IC0gdGhpcy5fc2xpZGVyLm1pbilcbiAgICAgIDogKG1pZFZhbHVlIC0gdGhpcy5taW4pIC8gKHRoaXMuX3NsaWRlci5tYXggLSB0aGlzLl9zbGlkZXIubWluKTtcblxuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLl9zbGlkZXIubWluIDwgdGhpcy5fc2xpZGVyLm1heCA/IF9wZXJjZW50YWdlIDogMTtcblxuICAgIGNvbnN0IHdpZHRoID0gbWF4V2lkdGggKiBwZXJjZW50YWdlICsgMjQ7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICcwcHgnO1xuXG4gICAgaWYgKHRoaXMuX2lzTGVmdFRodW1iKSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJy0yNHB4JztcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUucmlnaHQgPSAnLTI0cHgnO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVTdGF0aWNTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWF0LXNsaWRlcl9fcmlnaHQtaW5wdXQnLCAhdGhpcy5faXNMZWZ0VGh1bWIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU2libGluZygpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNpYmxpbmcuX3VwZGF0ZU1pbk1heCgpO1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgc2libGluZy5fdXBkYXRlV2lkdGhBY3RpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2libGluZy5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnB1dCdzIHZhbHVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb3ZlcnJpZGUgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQ29udHJvbEluaXRpYWxpemVkIHx8IHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgICB0aGlzLl91cGRhdGVTaWJsaW5nKCk7XG4gICAgfVxuICB9XG59XG4iXX0=