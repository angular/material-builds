/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, END, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 * @type {?}
 */
const MIN_AUTO_TICK_SEPARATION = 30;
/**
 * The thumb gap size for a disabled slider.
 * @type {?}
 */
const DISABLED_THUMB_GAP = 7;
/**
 * The thumb gap size for a non-active slider at its minimum value.
 * @type {?}
 */
const MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/**
 * The thumb gap size for an active slider at its minimum value.
 * @type {?}
 */
const MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/**
 * Provider Expression that allows mat-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 * \@docs-private
 * @type {?}
 */
export const MAT_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatSlider)),
    multi: true
};
/**
 * A simple change event emitted by the MatSlider component.
 */
export class MatSliderChange {
}
if (false) {
    /**
     * The MatSlider that changed.
     * @type {?}
     */
    MatSliderChange.prototype.source;
    /**
     * The new value of the source slider.
     * @type {?}
     */
    MatSliderChange.prototype.value;
}
// Boilerplate for applying mixins to MatSlider.
/**
 * \@docs-private
 */
class MatSliderBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatSliderBase.prototype._elementRef;
}
/** @type {?} */
const _MatSliderMixinBase = mixinTabIndex(mixinColor(mixinDisabled(MatSliderBase), 'accent'));
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export class MatSlider extends _MatSliderMixinBase {
    /**
     * @param {?} elementRef
     * @param {?} _focusMonitor
     * @param {?} _changeDetectorRef
     * @param {?} _dir
     * @param {?} tabIndex
     * @param {?=} _animationMode
     */
    constructor(elementRef, _focusMonitor, _changeDetectorRef, _dir, tabIndex, _animationMode) {
        super(elementRef);
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._animationMode = _animationMode;
        this._invert = false;
        this._max = 100;
        this._min = 0;
        this._step = 1;
        this._thumbLabel = false;
        this._tickInterval = 0;
        this._value = null;
        this._vertical = false;
        /**
         * Event emitted when the slider value has changed.
         */
        this.change = new EventEmitter();
        /**
         * Event emitted when the slider thumb moves.
         */
        this.input = new EventEmitter();
        /**
         * Emits when the raw value of the slider changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * \@docs-private
         */
        this.valueChange = new EventEmitter();
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        this.onTouched = (/**
         * @return {?}
         */
        () => { });
        this._percent = 0;
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        this._isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        this._isActive = false;
        /**
         * The size of a tick interval as a percentage of the size of the track.
         */
        this._tickIntervalPercent = 0;
        /**
         * The dimensions of the slider.
         */
        this._sliderDimensions = null;
        this._controlValueAccessorChangeFn = (/**
         * @return {?}
         */
        () => { });
        /**
         * Subscription to the Directionality change EventEmitter.
         */
        this._dirChangeSubscription = Subscription.EMPTY;
        this.tabIndex = parseInt(tabIndex) || 0;
    }
    /**
     * Whether the slider is inverted.
     * @return {?}
     */
    get invert() { return this._invert; }
    /**
     * @param {?} value
     * @return {?}
     */
    set invert(value) {
        this._invert = coerceBooleanProperty(value);
    }
    /**
     * The maximum value that the slider can have.
     * @return {?}
     */
    get max() { return this._max; }
    /**
     * @param {?} v
     * @return {?}
     */
    set max(v) {
        this._max = coerceNumberProperty(v, this._max);
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /**
     * The minimum value that the slider can have.
     * @return {?}
     */
    get min() { return this._min; }
    /**
     * @param {?} v
     * @return {?}
     */
    set min(v) {
        this._min = coerceNumberProperty(v, this._min);
        // If the value wasn't explicitly set by the user, set it to the min.
        if (this._value === null) {
            this.value = this._min;
        }
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /**
     * The values at which the thumb will snap.
     * @return {?}
     */
    get step() { return this._step; }
    /**
     * @param {?} v
     * @return {?}
     */
    set step(v) {
        this._step = coerceNumberProperty(v, this._step);
        if (this._step % 1 !== 0) {
            this._roundToDecimal = (/** @type {?} */ (this._step.toString().split('.').pop())).length;
        }
        // Since this could modify the label, we need to notify the change detection.
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Whether or not to show the thumb label.
     * @return {?}
     */
    get thumbLabel() { return this._thumbLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set thumbLabel(value) { this._thumbLabel = coerceBooleanProperty(value); }
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     * @return {?}
     */
    get tickInterval() { return this._tickInterval; }
    /**
     * @param {?} value
     * @return {?}
     */
    set tickInterval(value) {
        if (value === 'auto') {
            this._tickInterval = 'auto';
        }
        else if (typeof value === 'number' || typeof value === 'string') {
            this._tickInterval = coerceNumberProperty(value, (/** @type {?} */ (this._tickInterval)));
        }
        else {
            this._tickInterval = 0;
        }
    }
    /**
     * Value of the slider.
     * @return {?}
     */
    get value() {
        // If the value needs to be read and it is still uninitialized, initialize it to the min.
        if (this._value === null) {
            this.value = this._min;
        }
        return this._value;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set value(v) {
        if (v !== this._value) {
            /** @type {?} */
            let value = coerceNumberProperty(v);
            // While incrementing by a decimal we can end up with values like 33.300000000000004.
            // Truncate it to ensure that it matches the label and to make it easier to work with.
            if (this._roundToDecimal) {
                value = parseFloat(value.toFixed(this._roundToDecimal));
            }
            this._value = value;
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Whether the slider is vertical.
     * @return {?}
     */
    get vertical() { return this._vertical; }
    /**
     * @param {?} value
     * @return {?}
     */
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /**
     * The value to be used for display purposes.
     * @return {?}
     */
    get displayValue() {
        if (this.displayWith) {
            // Value is never null but since setters and getters cannot have
            // different types, the value getter is also typed to return null.
            return this.displayWith((/** @type {?} */ (this.value)));
        }
        // Note that this could be improved further by rounding something like 0.999 to 1 or
        // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
        // every change detection cycle.
        if (this._roundToDecimal && this.value && this.value % 1 !== 0) {
            return this.value.toFixed(this._roundToDecimal);
        }
        return this.value || 0;
    }
    /**
     * set focus to the host element
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._focusHostElement(options);
    }
    /**
     * blur the host element
     * @return {?}
     */
    blur() {
        this._blurHostElement();
    }
    /**
     * The percentage of the slider that coincides with the value.
     * @return {?}
     */
    get percent() { return this._clamp(this._percent); }
    /**
     * Whether the axis of the slider is inverted.
     * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
     * @return {?}
     */
    get _invertAxis() {
        // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
        // top. However from a y-axis standpoint this is inverted.
        return this.vertical ? !this.invert : this.invert;
    }
    /**
     * Whether the slider is at its minimum value.
     * @return {?}
     */
    get _isMinValue() {
        return this.percent === 0;
    }
    /**
     * The amount of space to leave between the slider thumb and the track fill & track background
     * elements.
     * @return {?}
     */
    get _thumbGap() {
        if (this.disabled) {
            return DISABLED_THUMB_GAP;
        }
        if (this._isMinValue && !this.thumbLabel) {
            return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
        }
        return 0;
    }
    /**
     * CSS styles for the track background element.
     * @return {?}
     */
    get _trackBackgroundStyles() {
        /** @type {?} */
        const axis = this.vertical ? 'Y' : 'X';
        /** @type {?} */
        const scale = this.vertical ? `1, ${1 - this.percent}, 1` : `${1 - this.percent}, 1, 1`;
        /** @type {?} */
        const sign = this._shouldInvertMouseCoords() ? '-' : '';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`
        };
    }
    /**
     * CSS styles for the track fill element.
     * @return {?}
     */
    get _trackFillStyles() {
        /** @type {?} */
        const axis = this.vertical ? 'Y' : 'X';
        /** @type {?} */
        const scale = this.vertical ? `1, ${this.percent}, 1` : `${this.percent}, 1, 1`;
        /** @type {?} */
        const sign = this._shouldInvertMouseCoords() ? '' : '-';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`
        };
    }
    /**
     * CSS styles for the ticks container element.
     * @return {?}
     */
    get _ticksContainerStyles() {
        /** @type {?} */
        let axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the ticks container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        /** @type {?} */
        let sign = !this.vertical && this._getDirection() == 'rtl' ? '' : '-';
        /** @type {?} */
        let offset = this._tickIntervalPercent / 2 * 100;
        return {
            'transform': `translate${axis}(${sign}${offset}%)`
        };
    }
    /**
     * CSS styles for the ticks element.
     * @return {?}
     */
    get _ticksStyles() {
        /** @type {?} */
        let tickSize = this._tickIntervalPercent * 100;
        /** @type {?} */
        let backgroundSize = this.vertical ? `2px ${tickSize}%` : `${tickSize}% 2px`;
        /** @type {?} */
        let axis = this.vertical ? 'Y' : 'X';
        // Depending on the direction we pushed the ticks container, push the ticks the opposite
        // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
        // ticks 180 degrees so we're really cutting off the end edge abd not the start.
        /** @type {?} */
        let sign = !this.vertical && this._getDirection() == 'rtl' ? '-' : '';
        /** @type {?} */
        let rotate = !this.vertical && this._getDirection() == 'rtl' ? ' rotate(180deg)' : '';
        /** @type {?} */
        let styles = {
            'backgroundSize': backgroundSize,
            // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
            'transform': `translateZ(0) translate${axis}(${sign}${tickSize / 2}%)${rotate}`
        };
        if (this._isMinValue && this._thumbGap) {
            /** @type {?} */
            let side = this.vertical ?
                (this._invertAxis ? 'Bottom' : 'Top') :
                (this._invertAxis ? 'Right' : 'Left');
            styles[`padding${side}`] = `${this._thumbGap}px`;
        }
        return styles;
    }
    /**
     * @return {?}
     */
    get _thumbContainerStyles() {
        /** @type {?} */
        let axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the thumb container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        /** @type {?} */
        let invertOffset = (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
        /** @type {?} */
        let offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
        return {
            'transform': `translate${axis}(-${offset}%)`
        };
    }
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     * @return {?}
     */
    _shouldInvertMouseCoords() {
        return (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
    }
    /**
     * The language direction for this slider element.
     * @private
     * @return {?}
     */
    _getDirection() {
        return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe((/**
         * @param {?} origin
         * @return {?}
         */
        (origin) => {
            this._isActive = !!origin && origin !== 'keyboard';
            this._changeDetectorRef.detectChanges();
        }));
        if (this._dir) {
            this._dirChangeSubscription = this._dir.change.subscribe((/**
             * @return {?}
             */
            () => {
                this._changeDetectorRef.markForCheck();
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._dirChangeSubscription.unsubscribe();
    }
    /**
     * @return {?}
     */
    _onMouseenter() {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onMousedown(event) {
        // Don't do anything if the slider is disabled or the
        // user is using anything other than the main mouse button.
        if (this.disabled || event.button !== 0) {
            return;
        }
        /** @type {?} */
        const oldValue = this.value;
        this._isSliding = false;
        this._focusHostElement();
        this._updateValueFromPosition({ x: event.clientX, y: event.clientY });
        // Emit a change and input event if the value changed.
        if (oldValue != this.value) {
            this._emitInputEvent();
            this._emitChangeEvent();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onSlide(event) {
        if (this.disabled) {
            return;
        }
        // The slide start event sometimes fails to fire on iOS, so if we're not already in the sliding
        // state, call the slide start handler manually.
        if (!this._isSliding) {
            this._onSlideStart(null);
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        /** @type {?} */
        let oldValue = this.value;
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
        // Native range elements always emit `input` events when the value changed while sliding.
        if (oldValue != this.value) {
            this._emitInputEvent();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onSlideStart(event) {
        if (this.disabled || this._isSliding) {
            return;
        }
        // Simulate mouseenter in case this is a mobile device.
        this._onMouseenter();
        this._isSliding = true;
        this._focusHostElement();
        this._valueOnSlideStart = this.value;
        if (event) {
            this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
            event.preventDefault();
        }
    }
    /**
     * @return {?}
     */
    _onSlideEnd() {
        this._isSliding = false;
        if (this._valueOnSlideStart != this.value && !this.disabled) {
            this._emitChangeEvent();
        }
        this._valueOnSlideStart = null;
    }
    /**
     * @return {?}
     */
    _onFocus() {
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    }
    /**
     * @return {?}
     */
    _onBlur() {
        this.onTouched();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onKeydown(event) {
        if (this.disabled || hasModifierKey(event)) {
            return;
        }
        /** @type {?} */
        const oldValue = this.value;
        switch (event.keyCode) {
            case PAGE_UP:
                this._increment(10);
                break;
            case PAGE_DOWN:
                this._increment(-10);
                break;
            case END:
                this.value = this.max;
                break;
            case HOME:
                this.value = this.min;
                break;
            case LEFT_ARROW:
                // NOTE: For a sighted user it would make more sense that when they press an arrow key on an
                // inverted slider the thumb moves in that direction. However for a blind user, nothing
                // about the slider indicates that it is inverted. They will expect left to be decrement,
                // regardless of how it appears on the screen. For speakers ofRTL languages, they probably
                // expect left to mean increment. Therefore we flip the meaning of the side arrow keys for
                // RTL. For inverted sliders we prefer a good a11y experience to having it "look right" for
                // sighted users, therefore we do not swap the meaning.
                this._increment(this._getDirection() == 'rtl' ? 1 : -1);
                break;
            case UP_ARROW:
                this._increment(1);
                break;
            case RIGHT_ARROW:
                // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
                this._increment(this._getDirection() == 'rtl' ? -1 : 1);
                break;
            case DOWN_ARROW:
                this._increment(-1);
                break;
            default:
                // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
                // it.
                return;
        }
        if (oldValue != this.value) {
            this._emitInputEvent();
            this._emitChangeEvent();
        }
        this._isSliding = true;
        event.preventDefault();
    }
    /**
     * @return {?}
     */
    _onKeyup() {
        this._isSliding = false;
    }
    /**
     * Increments the slider by the given number of steps (negative number decrements).
     * @private
     * @param {?} numSteps
     * @return {?}
     */
    _increment(numSteps) {
        this.value = this._clamp((this.value || 0) + this.step * numSteps, this.min, this.max);
    }
    /**
     * Calculate the new value from the new physical location. The value will always be snapped.
     * @private
     * @param {?} pos
     * @return {?}
     */
    _updateValueFromPosition(pos) {
        if (!this._sliderDimensions) {
            return;
        }
        /** @type {?} */
        let offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        /** @type {?} */
        let size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        /** @type {?} */
        let posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        /** @type {?} */
        let percent = this._clamp((posComponent - offset) / size);
        if (this._shouldInvertMouseCoords()) {
            percent = 1 - percent;
        }
        // Since the steps may not divide cleanly into the max value, if the user
        // slid to 0 or 100 percent, we jump to the min/max value. This approach
        // is slightly more intuitive than using `Math.ceil` below, because it
        // follows the user's pointer closer.
        if (percent === 0) {
            this.value = this.min;
        }
        else if (percent === 1) {
            this.value = this.max;
        }
        else {
            /** @type {?} */
            const exactValue = this._calculateValue(percent);
            // This calculation finds the closest step by finding the closest
            // whole number divisible by the step relative to the min.
            /** @type {?} */
            const closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
            // The value needs to snap to the min and max.
            this.value = this._clamp(closestValue, this.min, this.max);
        }
    }
    /**
     * Emits a change event if the current value is different from the last emitted value.
     * @private
     * @return {?}
     */
    _emitChangeEvent() {
        this._controlValueAccessorChangeFn(this.value);
        this.valueChange.emit(this.value);
        this.change.emit(this._createChangeEvent());
    }
    /**
     * Emits an input event when the current value is different from the last emitted value.
     * @private
     * @return {?}
     */
    _emitInputEvent() {
        this.input.emit(this._createChangeEvent());
    }
    /**
     * Updates the amount of space between ticks as a percentage of the width of the slider.
     * @private
     * @return {?}
     */
    _updateTickIntervalPercent() {
        if (!this.tickInterval || !this._sliderDimensions) {
            return;
        }
        if (this.tickInterval == 'auto') {
            /** @type {?} */
            let trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            /** @type {?} */
            let pixelsPerStep = trackSize * this.step / (this.max - this.min);
            /** @type {?} */
            let stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            /** @type {?} */
            let pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = this.tickInterval * this.step / (this.max - this.min);
        }
    }
    /**
     * Creates a slider change object from the specified value.
     * @private
     * @param {?=} value
     * @return {?}
     */
    _createChangeEvent(value = this.value) {
        /** @type {?} */
        let event = new MatSliderChange();
        event.source = this;
        event.value = value;
        return event;
    }
    /**
     * Calculates the percentage of the slider that a value is.
     * @private
     * @param {?} value
     * @return {?}
     */
    _calculatePercentage(value) {
        return ((value || 0) - this.min) / (this.max - this.min);
    }
    /**
     * Calculates the value a percentage of the slider corresponds to.
     * @private
     * @param {?} percentage
     * @return {?}
     */
    _calculateValue(percentage) {
        return this.min + percentage * (this.max - this.min);
    }
    /**
     * Return a number between two numbers.
     * @private
     * @param {?} value
     * @param {?=} min
     * @param {?=} max
     * @return {?}
     */
    _clamp(value, min = 0, max = 1) {
        return Math.max(min, Math.min(value, max));
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     * @private
     * @return {?}
     */
    _getSliderDimensions() {
        return this._sliderWrapper ? this._sliderWrapper.nativeElement.getBoundingClientRect() : null;
    }
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     * @private
     * @param {?=} options
     * @return {?}
     */
    _focusHostElement(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /**
     * Blurs the native element.
     * @private
     * @return {?}
     */
    _blurHostElement() {
        this._elementRef.nativeElement.blur();
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
MatSlider.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-slider',
                exportAs: 'matSlider',
                providers: [MAT_SLIDER_VALUE_ACCESSOR],
                host: {
                    '(focus)': '_onFocus()',
                    '(blur)': '_onBlur()',
                    '(mousedown)': '_onMousedown($event)',
                    '(keydown)': '_onKeydown($event)',
                    '(keyup)': '_onKeyup()',
                    '(mouseenter)': '_onMouseenter()',
                    '(slide)': '_onSlide($event)',
                    '(slideend)': '_onSlideEnd()',
                    '(slidestart)': '_onSlideStart($event)',
                    // On Safari starting to slide temporarily triggers text selection mode which
                    // show the wrong cursor. We prevent it by stopping the `selectstart` event.
                    '(selectstart)': '$event.preventDefault()',
                    'class': 'mat-slider',
                    'role': 'slider',
                    '[tabIndex]': 'tabIndex',
                    '[attr.aria-disabled]': 'disabled',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuemin]': 'min',
                    '[attr.aria-valuenow]': 'value',
                    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                    '[class.mat-slider-disabled]': 'disabled',
                    '[class.mat-slider-has-ticks]': 'tickInterval',
                    '[class.mat-slider-horizontal]': '!vertical',
                    '[class.mat-slider-axis-inverted]': '_invertAxis',
                    // Class binding which is only used by the test harness as there is no other
                    // way for the harness to detect if mouse coordinates need to be inverted.
                    '[class.mat-slider-invert-mouse-coords]': '_shouldInvertMouseCoords()',
                    '[class.mat-slider-sliding]': '_isSliding',
                    '[class.mat-slider-thumb-label-showing]': 'thumbLabel',
                    '[class.mat-slider-vertical]': 'vertical',
                    '[class.mat-slider-min-value]': '_isMinValue',
                    '[class.mat-slider-hide-last-tick]': 'disabled || _isMinValue && _thumbGap && _invertAxis',
                    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                },
                template: "<div class=\"mat-slider-wrapper\" #sliderWrapper>\n  <div class=\"mat-slider-track-wrapper\">\n    <div class=\"mat-slider-track-background\" [ngStyle]=\"_trackBackgroundStyles\"></div>\n    <div class=\"mat-slider-track-fill\" [ngStyle]=\"_trackFillStyles\"></div>\n  </div>\n  <div class=\"mat-slider-ticks-container\" [ngStyle]=\"_ticksContainerStyles\">\n    <div class=\"mat-slider-ticks\" [ngStyle]=\"_ticksStyles\"></div>\n  </div>\n  <div class=\"mat-slider-thumb-container\" [ngStyle]=\"_thumbContainerStyles\">\n    <div class=\"mat-slider-focus-ring\"></div>\n    <div class=\"mat-slider-thumb\"></div>\n    <div class=\"mat-slider-thumb-label\">\n      <span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span>\n    </div>\n  </div>\n</div>\n",
                inputs: ['disabled', 'color', 'tabIndex'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mat-slider:not(.mat-slider-disabled):active,.mat-slider.mat-slider-sliding:not(.mat-slider-disabled){cursor:-webkit-grabbing;cursor:grabbing}.mat-slider-wrapper{position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider.cdk-keyboard-focused .mat-slider-focus-ring,.mat-slider.cdk-program-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb{cursor:-webkit-grab;cursor:grab}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(0.7);transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-radius 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}@media(-ms-high-contrast: active){.mat-slider-thumb-label{outline:solid 1px}}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-sliding .mat-slider-track-fill,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-thumb-container{transition-duration:0ms}.mat-slider-has-ticks .mat-slider-wrapper::after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{display:none}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text{opacity:1}.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(0.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}@media(-ms-high-contrast: active){.mat-slider-horizontal .mat-slider-ticks-container{height:0;outline:solid 2px;top:1px}}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(0.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}@media(-ms-high-contrast: active){.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text{transform:none}}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}@media(-ms-high-contrast: active){.mat-slider-vertical .mat-slider-ticks-container{width:0;outline:solid 2px;left:1px}}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(0.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}.mat-slider._mat-animation-noopable .mat-slider-track-fill,.mat-slider._mat-animation-noopable .mat-slider-track-background,.mat-slider._mat-animation-noopable .mat-slider-ticks,.mat-slider._mat-animation-noopable .mat-slider-thumb-container,.mat-slider._mat-animation-noopable .mat-slider-focus-ring,.mat-slider._mat-animation-noopable .mat-slider-thumb,.mat-slider._mat-animation-noopable .mat-slider-thumb-label,.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after{transition:none}/*# sourceMappingURL=slider.css.map */\n"]
            }] }
];
/** @nocollapse */
MatSlider.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusMonitor },
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatSlider.propDecorators = {
    invert: [{ type: Input }],
    max: [{ type: Input }],
    min: [{ type: Input }],
    step: [{ type: Input }],
    thumbLabel: [{ type: Input }],
    tickInterval: [{ type: Input }],
    value: [{ type: Input }],
    displayWith: [{ type: Input }],
    vertical: [{ type: Input }],
    change: [{ type: Output }],
    input: [{ type: Output }],
    valueChange: [{ type: Output }],
    _sliderWrapper: [{ type: ViewChild, args: ['sliderWrapper', { static: false },] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._invert;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._max;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._min;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._step;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._thumbLabel;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._tickInterval;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._value;
    /**
     * Function that will be used to format the value before it is displayed
     * in the thumb label. Can be used to format very large number in order
     * for them to fit into the slider thumb.
     * @type {?}
     */
    MatSlider.prototype.displayWith;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._vertical;
    /**
     * Event emitted when the slider value has changed.
     * @type {?}
     */
    MatSlider.prototype.change;
    /**
     * Event emitted when the slider thumb moves.
     * @type {?}
     */
    MatSlider.prototype.input;
    /**
     * Emits when the raw value of the slider changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * \@docs-private
     * @type {?}
     */
    MatSlider.prototype.valueChange;
    /**
     * onTouch function registered via registerOnTouch (ControlValueAccessor).
     * @type {?}
     */
    MatSlider.prototype.onTouched;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._percent;
    /**
     * Whether or not the thumb is sliding.
     * Used to determine if there should be a transition for the thumb and fill track.
     * @type {?}
     */
    MatSlider.prototype._isSliding;
    /**
     * Whether or not the slider is active (clicked or sliding).
     * Used to shrink and grow the thumb as according to the Material Design spec.
     * @type {?}
     */
    MatSlider.prototype._isActive;
    /**
     * The size of a tick interval as a percentage of the size of the track.
     * @type {?}
     * @private
     */
    MatSlider.prototype._tickIntervalPercent;
    /**
     * The dimensions of the slider.
     * @type {?}
     * @private
     */
    MatSlider.prototype._sliderDimensions;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._controlValueAccessorChangeFn;
    /**
     * Decimal places to round to, based on the step amount.
     * @type {?}
     * @private
     */
    MatSlider.prototype._roundToDecimal;
    /**
     * Subscription to the Directionality change EventEmitter.
     * @type {?}
     * @private
     */
    MatSlider.prototype._dirChangeSubscription;
    /**
     * The value of the slider when the slide start event fires.
     * @type {?}
     * @private
     */
    MatSlider.prototype._valueOnSlideStart;
    /**
     * Reference to the inner slider wrapper element.
     * @type {?}
     * @private
     */
    MatSlider.prototype._sliderWrapper;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._focusMonitor;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._dir;
    /** @type {?} */
    MatSlider.prototype._animationMode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2xGLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFRTCxVQUFVLEVBQ1YsYUFBYSxFQUNiLGFBQWEsR0FDZCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7OztNQU01Qix3QkFBd0IsR0FBRyxFQUFFOzs7OztNQUc3QixrQkFBa0IsR0FBRyxDQUFDOzs7OztNQUd0Qiw2QkFBNkIsR0FBRyxDQUFDOzs7OztNQUdqQywwQkFBMEIsR0FBRyxFQUFFOzs7Ozs7O0FBT3JDLE1BQU0sT0FBTyx5QkFBeUIsR0FBUTtJQUM1QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLEVBQUM7SUFDeEMsS0FBSyxFQUFFLElBQUk7Q0FDWjs7OztBQUdELE1BQU0sT0FBTyxlQUFlO0NBTTNCOzs7Ozs7SUFKQyxpQ0FBa0I7Ozs7O0lBR2xCLGdDQUFxQjs7Ozs7O0FBTXZCLE1BQU0sYUFBYTs7OztJQUNqQixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7OztJQURhLG9DQUE4Qjs7O01BRXRDLG1CQUFtQixHQUtqQixhQUFhLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7QUFvRHpFLE1BQU0sT0FBTyxTQUFVLFNBQVEsbUJBQW1COzs7Ozs7Ozs7SUE2VGhELFlBQVksVUFBc0IsRUFDZCxhQUEyQixFQUMzQixrQkFBcUMsRUFDekIsSUFBb0IsRUFDakIsUUFBZ0IsRUFFVyxjQUF1QjtRQUNuRixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFOQSxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3pCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBR1UsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUEzVDdFLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFZaEIsU0FBSSxHQUFXLEdBQUcsQ0FBQztRQWlCbkIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQWVqQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBTWxCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBaUI3QixrQkFBYSxHQUFvQixDQUFDLENBQUM7UUE0Qm5DLFdBQU0sR0FBa0IsSUFBSSxDQUFDO1FBZTdCLGNBQVMsR0FBRyxLQUFLLENBQUM7Ozs7UUFHUCxXQUFNLEdBQWtDLElBQUksWUFBWSxFQUFtQixDQUFDOzs7O1FBRzVFLFVBQUssR0FBa0MsSUFBSSxZQUFZLEVBQW1CLENBQUM7Ozs7OztRQU8zRSxnQkFBVyxHQUFnQyxJQUFJLFlBQVksRUFBaUIsQ0FBQzs7OztRQStCaEcsY0FBUzs7O1FBQWMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUFDO1FBSXhCLGFBQVEsR0FBVyxDQUFDLENBQUM7Ozs7O1FBTTdCLGVBQVUsR0FBWSxLQUFLLENBQUM7Ozs7O1FBTTVCLGNBQVMsR0FBWSxLQUFLLENBQUM7Ozs7UUEyR25CLHlCQUFvQixHQUFXLENBQUMsQ0FBQzs7OztRQUdqQyxzQkFBaUIsR0FBc0IsSUFBSSxDQUFDO1FBRTVDLGtDQUE2Qjs7O1FBQXlCLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBQzs7OztRQU0vRCwyQkFBc0IsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBOEJsRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7SUFwVUQsSUFDSSxNQUFNLEtBQWMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDOUMsSUFBSSxNQUFNLENBQUMsS0FBYztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUM7Ozs7O0lBSUQsSUFDSSxHQUFHLEtBQWEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDdkMsSUFBSSxHQUFHLENBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkQscUZBQXFGO1FBQ3JGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxDQUFDOzs7OztJQUlELElBQ0ksR0FBRyxLQUFhLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3ZDLElBQUksR0FBRyxDQUFDLENBQVM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0MscUVBQXFFO1FBQ3JFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZELHFGQUFxRjtRQUNyRixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekMsQ0FBQzs7Ozs7SUFJRCxJQUNJLElBQUksS0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7OztJQUN6QyxJQUFJLElBQUksQ0FBQyxDQUFTO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVqRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLG1CQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFDLENBQUMsTUFBTSxDQUFDO1NBQ3ZFO1FBRUQsNkVBQTZFO1FBQzdFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxDQUFDOzs7OztJQUlELElBQ0ksVUFBVSxLQUFjLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3RELElBQUksVUFBVSxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBT25GLElBQ0ksWUFBWSxLQUFLLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ2pELElBQUksWUFBWSxDQUFDLEtBQXNCO1FBQ3JDLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtZQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztTQUM3QjthQUFNLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUNqRSxJQUFJLENBQUMsYUFBYSxHQUFHLG9CQUFvQixDQUFDLEtBQUssRUFBRSxtQkFBQSxJQUFJLENBQUMsYUFBYSxFQUFVLENBQUMsQ0FBQztTQUNoRjthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7OztJQUlELElBQ0ksS0FBSztRQUNQLHlGQUF5RjtRQUN6RixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOzs7OztJQUNELElBQUksS0FBSyxDQUFDLENBQWdCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUNqQixLQUFLLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBRW5DLHFGQUFxRjtZQUNyRixzRkFBc0Y7WUFDdEYsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN4QixLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7YUFDekQ7WUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdkQscUZBQXFGO1lBQ3JGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7Ozs7O0lBV0QsSUFDSSxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDbEQsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7Ozs7O0lBaUJELElBQUksWUFBWTtRQUNkLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixnRUFBZ0U7WUFDaEUsa0VBQWtFO1lBQ2xFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBQSxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztTQUN0QztRQUVELG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsZ0NBQWdDO1FBQ2hDLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM5RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNqRDtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQzs7Ozs7O0lBR0QsS0FBSyxDQUFDLE9BQXNCO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7OztJQUdELElBQUk7UUFDRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDOzs7OztJQU1ELElBQUksT0FBTyxLQUFhLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFtQjVELElBQUksV0FBVztRQUNiLCtGQUErRjtRQUMvRiwwREFBMEQ7UUFDMUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEQsQ0FBQzs7Ozs7SUFJRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7OztJQU1ELElBQUksU0FBUztRQUNYLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPLGtCQUFrQixDQUFDO1NBQzNCO1FBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQztTQUNwRjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7Ozs7SUFHRCxJQUFJLHNCQUFzQjs7Y0FDbEIsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRzs7Y0FDaEMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sUUFBUTs7Y0FDakYsSUFBSSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFFdkQsT0FBTzs7WUFFTCxTQUFTLEVBQUUsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLGVBQWUsS0FBSyxHQUFHO1NBQzVFLENBQUM7SUFDSixDQUFDOzs7OztJQUdELElBQUksZ0JBQWdCOztjQUNaLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7O2NBQ2hDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxRQUFROztjQUN6RSxJQUFJLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRztRQUV2RCxPQUFPOztZQUVMLFNBQVMsRUFBRSxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsZUFBZSxLQUFLLEdBQUc7U0FDNUUsQ0FBQztJQUNKLENBQUM7Ozs7O0lBR0QsSUFBSSxxQkFBcUI7O1lBQ25CLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7Ozs7WUFHaEMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUc7O1lBQ2pFLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLEdBQUc7UUFDaEQsT0FBTztZQUNMLFdBQVcsRUFBRSxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJO1NBQ25ELENBQUM7SUFDSixDQUFDOzs7OztJQUdELElBQUksWUFBWTs7WUFDVixRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEdBQUc7O1lBQzFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsT0FBTzs7WUFDeEUsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRzs7Ozs7WUFJaEMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7O1lBQ2pFLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUU7O1lBQ2pGLE1BQU0sR0FBOEI7WUFDdEMsZ0JBQWdCLEVBQUUsY0FBYzs7WUFFaEMsV0FBVyxFQUFFLDBCQUEwQixJQUFJLElBQUksSUFBSSxHQUFHLFFBQVEsR0FBRyxDQUFDLEtBQUssTUFBTSxFQUFFO1NBQ2hGO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7O2dCQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN6QyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDO1NBQ2xEO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7OztJQUVELElBQUkscUJBQXFCOztZQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHOzs7O1lBR2hDLFlBQVksR0FDWixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7O1lBQ3hGLE1BQU0sR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHO1FBQ25FLE9BQU87WUFDTCxXQUFXLEVBQUUsWUFBWSxJQUFJLEtBQUssTUFBTSxJQUFJO1NBQzdDLENBQUM7SUFDSixDQUFDOzs7Ozs7SUEwQkQsd0JBQXdCO1FBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDbEcsQ0FBQzs7Ozs7O0lBR08sYUFBYTtRQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDakUsQ0FBQzs7OztJQWNELFFBQVE7UUFDTixJQUFJLENBQUMsYUFBYTthQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQzthQUMvQixTQUFTOzs7O1FBQUMsQ0FBQyxNQUFtQixFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLENBQUM7WUFDbkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLENBQUMsRUFBQyxDQUFDO1FBQ1AsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7OztZQUFDLEdBQUcsRUFBRTtnQkFDNUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDNUMsQ0FBQzs7OztJQUVELGFBQWE7UUFDWCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBRUQsNEZBQTRGO1FBQzVGLHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Ozs7SUFFRCxZQUFZLENBQUMsS0FBaUI7UUFDNUIscURBQXFEO1FBQ3JELDJEQUEyRDtRQUMzRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsT0FBTztTQUNSOztjQUVLLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFFcEUsc0RBQXNEO1FBQ3RELElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxRQUFRLENBQUMsS0FBa0I7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU87U0FDUjtRQUVELCtGQUErRjtRQUMvRixnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUVELGtEQUFrRDtRQUNsRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7O1lBRW5CLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSztRQUN6QixJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUV0RSx5RkFBeUY7UUFDekYsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMxQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUF5QjtRQUNyQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQyxPQUFPO1NBQ1I7UUFFRCx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXJDLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDdEUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7SUFDakMsQ0FBQzs7OztJQUVELFFBQVE7UUFDTiw0RkFBNEY7UUFDNUYseUVBQXlFO1FBQ3pFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztJQUNwQyxDQUFDOzs7O0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxLQUFvQjtRQUM3QixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFDLE9BQU87U0FDUjs7Y0FFSyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFFM0IsUUFBUSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ3JCLEtBQUssT0FBTztnQkFDVixJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ3RCLE1BQU07WUFDUixLQUFLLElBQUk7Z0JBQ1AsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUN0QixNQUFNO1lBQ1IsS0FBSyxVQUFVO2dCQUNiLDRGQUE0RjtnQkFDNUYsdUZBQXVGO2dCQUN2Rix5RkFBeUY7Z0JBQ3pGLDBGQUEwRjtnQkFDMUYsMEZBQTBGO2dCQUMxRiwyRkFBMkY7Z0JBQzNGLHVEQUF1RDtnQkFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU07WUFDUixLQUFLLFFBQVE7Z0JBQ1gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTTtZQUNSLEtBQUssV0FBVztnQkFDZCxrRkFBa0Y7Z0JBQ2xGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNO1lBQ1IsS0FBSyxVQUFVO2dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTTtZQUNSO2dCQUNFLDRGQUE0RjtnQkFDNUYsTUFBTTtnQkFDTixPQUFPO1NBQ1Y7UUFFRCxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzFCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjtRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7Ozs7Ozs7SUFHTyxVQUFVLENBQUMsUUFBZ0I7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RixDQUFDOzs7Ozs7O0lBR08sd0JBQXdCLENBQUMsR0FBMkI7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixPQUFPO1NBQ1I7O1lBRUcsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJOztZQUNqRixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUs7O1lBQ25GLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7O1lBRzVDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV6RCxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFO1lBQ25DLE9BQU8sR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3ZCO1FBRUQseUVBQXlFO1FBQ3pFLHdFQUF3RTtRQUN4RSxzRUFBc0U7UUFDdEUscUNBQXFDO1FBQ3JDLElBQUksT0FBTyxLQUFLLENBQUMsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDdkI7YUFBTSxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ3ZCO2FBQU07O2tCQUNDLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQzs7OztrQkFJMUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHO1lBRTNGLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQzs7Ozs7O0lBR08sZ0JBQWdCO1FBQ3RCLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7Ozs7O0lBR08sZUFBZTtRQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Ozs7OztJQUdPLDBCQUEwQjtRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUNqRCxPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksTUFBTSxFQUFFOztnQkFDM0IsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLOztnQkFDeEYsYUFBYSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOztnQkFDN0QsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsYUFBYSxDQUFDOztnQkFDbEUsYUFBYSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSTtZQUM1QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsYUFBYSxHQUFHLFNBQVMsQ0FBQztTQUN2RDthQUFNO1lBQ0wsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25GO0lBQ0gsQ0FBQzs7Ozs7OztJQUdPLGtCQUFrQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSzs7WUFDdkMsS0FBSyxHQUFHLElBQUksZUFBZSxFQUFFO1FBRWpDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRXBCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7OztJQUdPLG9CQUFvQixDQUFDLEtBQW9CO1FBQy9DLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzRCxDQUFDOzs7Ozs7O0lBR08sZUFBZSxDQUFDLFVBQWtCO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7Ozs7Ozs7SUFHTyxNQUFNLENBQUMsS0FBYSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDNUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Ozs7Ozs7O0lBT08sb0JBQW9CO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hHLENBQUM7Ozs7Ozs7O0lBTU8saUJBQWlCLENBQUMsT0FBc0I7UUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7Ozs7OztJQUdPLGdCQUFnQjtRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxDQUFDOzs7Ozs7SUFNRCxVQUFVLENBQUMsS0FBVTtRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDOzs7Ozs7O0lBT0QsZ0JBQWdCLENBQUMsRUFBd0I7UUFDdkMsSUFBSSxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDOzs7Ozs7O0lBT0QsaUJBQWlCLENBQUMsRUFBTztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7Ozs7O0lBT0QsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDN0IsQ0FBQzs7O1lBdnJCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQixRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO2dCQUN0QyxJQUFJLEVBQUU7b0JBQ0osU0FBUyxFQUFFLFlBQVk7b0JBQ3ZCLFFBQVEsRUFBRSxXQUFXO29CQUNyQixhQUFhLEVBQUUsc0JBQXNCO29CQUNyQyxXQUFXLEVBQUUsb0JBQW9CO29CQUNqQyxTQUFTLEVBQUUsWUFBWTtvQkFDdkIsY0FBYyxFQUFFLGlCQUFpQjtvQkFDakMsU0FBUyxFQUFFLGtCQUFrQjtvQkFDN0IsWUFBWSxFQUFFLGVBQWU7b0JBQzdCLGNBQWMsRUFBRSx1QkFBdUI7OztvQkFHdkMsZUFBZSxFQUFFLHlCQUF5QjtvQkFDMUMsT0FBTyxFQUFFLFlBQVk7b0JBQ3JCLE1BQU0sRUFBRSxRQUFRO29CQUNoQixZQUFZLEVBQUUsVUFBVTtvQkFDeEIsc0JBQXNCLEVBQUUsVUFBVTtvQkFDbEMsc0JBQXNCLEVBQUUsS0FBSztvQkFDN0Isc0JBQXNCLEVBQUUsS0FBSztvQkFDN0Isc0JBQXNCLEVBQUUsT0FBTztvQkFDL0IseUJBQXlCLEVBQUUsc0NBQXNDO29CQUNqRSw2QkFBNkIsRUFBRSxVQUFVO29CQUN6Qyw4QkFBOEIsRUFBRSxjQUFjO29CQUM5QywrQkFBK0IsRUFBRSxXQUFXO29CQUM1QyxrQ0FBa0MsRUFBRSxhQUFhOzs7b0JBR2pELHdDQUF3QyxFQUFFLDRCQUE0QjtvQkFDdEUsNEJBQTRCLEVBQUUsWUFBWTtvQkFDMUMsd0NBQXdDLEVBQUUsWUFBWTtvQkFDdEQsNkJBQTZCLEVBQUUsVUFBVTtvQkFDekMsOEJBQThCLEVBQUUsYUFBYTtvQkFDN0MsbUNBQW1DLEVBQUUscURBQXFEO29CQUMxRixpQ0FBaUMsRUFBRSxxQ0FBcUM7aUJBQ3pFO2dCQUNELHd3QkFBMEI7Z0JBRTFCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDO2dCQUN6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7O1lBN0hDLFVBQVU7WUFuQkosWUFBWTtZQWlCbEIsaUJBQWlCO1lBaEJYLGNBQWMsdUJBZ2RQLFFBQVE7eUNBQ1IsU0FBUyxTQUFDLFVBQVU7eUNBRXBCLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7cUJBaFVwRCxLQUFLO2tCQVFMLEtBQUs7a0JBWUwsS0FBSzttQkFpQkwsS0FBSzt5QkFlTCxLQUFLOzJCQVNMLEtBQUs7b0JBY0wsS0FBSzswQkFnQ0wsS0FBSzt1QkFHTCxLQUFLO3FCQVFMLE1BQU07b0JBR04sTUFBTTswQkFPTixNQUFNOzZCQTJLTixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs7Ozs7OztJQXRTM0MsNEJBQXdCOzs7OztJQVl4Qix5QkFBMkI7Ozs7O0lBaUIzQix5QkFBeUI7Ozs7O0lBZXpCLDBCQUEwQjs7Ozs7SUFNMUIsZ0NBQXFDOzs7OztJQWlCckMsa0NBQTJDOzs7OztJQTRCM0MsMkJBQXFDOzs7Ozs7O0lBT3JDLGdDQUF5RDs7Ozs7SUFRekQsOEJBQTBCOzs7OztJQUcxQiwyQkFBK0Y7Ozs7O0lBRy9GLDBCQUE4Rjs7Ozs7OztJQU85RixnQ0FBZ0c7Ozs7O0lBK0JoRyw4QkFBZ0M7Ozs7O0lBSWhDLDZCQUE2Qjs7Ozs7O0lBTTdCLCtCQUE0Qjs7Ozs7O0lBTTVCLDhCQUEyQjs7Ozs7O0lBMkczQix5Q0FBeUM7Ozs7OztJQUd6QyxzQ0FBb0Q7Ozs7O0lBRXBELGtEQUF1RTs7Ozs7O0lBR3ZFLG9DQUFnQzs7Ozs7O0lBR2hDLDJDQUFvRDs7Ozs7O0lBR3BELHVDQUEwQzs7Ozs7O0lBRzFDLG1DQUFnRjs7Ozs7SUFnQnBFLGtDQUFtQzs7Ozs7SUFDbkMsdUNBQTZDOzs7OztJQUM3Qyx5QkFBd0M7O0lBR3hDLG1DQUF5RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgSE9NRSxcbiAgTEVGVF9BUlJPVyxcbiAgUEFHRV9ET1dOLFxuICBQQUdFX1VQLFxuICBSSUdIVF9BUlJPVyxcbiAgVVBfQVJST1csXG4gIGhhc01vZGlmaWVyS2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIEhhbW1lcklucHV0LFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIFZpc3VhbGx5LCBhIDMwcHggc2VwYXJhdGlvbiBiZXR3ZWVuIHRpY2sgbWFya3MgbG9va3MgYmVzdC4gVGhpcyBpcyB2ZXJ5IHN1YmplY3RpdmUgYnV0IGl0IGlzXG4gKiB0aGUgZGVmYXVsdCBzZXBhcmF0aW9uIHdlIGNob3NlLlxuICovXG5jb25zdCBNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gPSAzMDtcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYSBkaXNhYmxlZCBzbGlkZXIuICovXG5jb25zdCBESVNBQkxFRF9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIG5vbi1hY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX05PTkFDVElWRV9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhbiBhY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgPSAxMDtcblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1zbGlkZXIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIFtmb3JtQ29udHJvbF0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIGJ5IHRoZSBNYXRTbGlkZXIgY29tcG9uZW50LiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckNoYW5nZSB7XG4gIC8qKiBUaGUgTWF0U2xpZGVyIHRoYXQgY2hhbmdlZC4gKi9cbiAgc291cmNlOiBNYXRTbGlkZXI7XG5cbiAgLyoqIFRoZSBuZXcgdmFsdWUgb2YgdGhlIHNvdXJjZSBzbGlkZXIuICovXG4gIHZhbHVlOiBudW1iZXIgfCBudWxsO1xufVxuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2xpZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNsaWRlckJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0U2xpZGVyTWl4aW5CYXNlOlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuQ29sb3JDdG9yICZcbiAgICBDYW5EaXNhYmxlQ3RvciAmXG4gICAgdHlwZW9mIE1hdFNsaWRlckJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlZChNYXRTbGlkZXJCYXNlKSwgJ2FjY2VudCcpKTtcblxuLyoqXG4gKiBBbGxvd3MgdXNlcnMgdG8gc2VsZWN0IGZyb20gYSByYW5nZSBvZiB2YWx1ZXMgYnkgbW92aW5nIHRoZSBzbGlkZXIgdGh1bWIuIEl0IGlzIHNpbWlsYXIgaW5cbiAqIGJlaGF2aW9yIHRvIHRoZSBuYXRpdmUgYDxpbnB1dCB0eXBlPVwicmFuZ2VcIj5gIGVsZW1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1zbGlkZXInLFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIHByb3ZpZGVyczogW01BVF9TTElERVJfVkFMVUVfQUNDRVNTT1JdLFxuICBob3N0OiB7XG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcobW91c2Vkb3duKSc6ICdfb25Nb3VzZWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICcoa2V5dXApJzogJ19vbktleXVwKCknLFxuICAgICcobW91c2VlbnRlciknOiAnX29uTW91c2VlbnRlcigpJyxcbiAgICAnKHNsaWRlKSc6ICdfb25TbGlkZSgkZXZlbnQpJyxcbiAgICAnKHNsaWRlZW5kKSc6ICdfb25TbGlkZUVuZCgpJyxcbiAgICAnKHNsaWRlc3RhcnQpJzogJ19vblNsaWRlU3RhcnQoJGV2ZW50KScsXG4gICAgLy8gT24gU2FmYXJpIHN0YXJ0aW5nIHRvIHNsaWRlIHRlbXBvcmFyaWx5IHRyaWdnZXJzIHRleHQgc2VsZWN0aW9uIG1vZGUgd2hpY2hcbiAgICAvLyBzaG93IHRoZSB3cm9uZyBjdXJzb3IuIFdlIHByZXZlbnQgaXQgYnkgc3RvcHBpbmcgdGhlIGBzZWxlY3RzdGFydGAgZXZlbnQuXG4gICAgJyhzZWxlY3RzdGFydCknOiAnJGV2ZW50LnByZXZlbnREZWZhdWx0KCknLFxuICAgICdjbGFzcyc6ICdtYXQtc2xpZGVyJyxcbiAgICAncm9sZSc6ICdzbGlkZXInLFxuICAgICdbdGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtaW4nLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICd2YWx1ZScsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oYXMtdGlja3NdJzogJ3RpY2tJbnRlcnZhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWF4aXMtaW52ZXJ0ZWRdJzogJ19pbnZlcnRBeGlzJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbW91c2UgY29vcmRpbmF0ZXMgbmVlZCB0byBiZSBpbnZlcnRlZC5cbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaW52ZXJ0LW1vdXNlLWNvb3Jkc10nOiAnX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCknLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1zbGlkaW5nXSc6ICdfaXNTbGlkaW5nJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZ10nOiAndGh1bWJMYWJlbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLW1pbi12YWx1ZV0nOiAnX2lzTWluVmFsdWUnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oaWRlLWxhc3QtdGlja10nOiAnZGlzYWJsZWQgfHwgX2lzTWluVmFsdWUgJiYgX3RodW1iR2FwICYmIF9pbnZlcnRBeGlzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXIuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyIGV4dGVuZHMgX01hdFNsaWRlck1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSwgQ2FuQ29sb3IsIE9uSW5pdCwgSGFzVGFiSW5kZXgge1xuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGludmVydGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaW52ZXJ0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW52ZXJ0OyB9XG4gIHNldCBpbnZlcnQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbnZlcnQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ludmVydCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX21pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21pbik7XG5cbiAgICAvLyBJZiB0aGUgdmFsdWUgd2Fzbid0IGV4cGxpY2l0bHkgc2V0IGJ5IHRoZSB1c2VyLCBzZXQgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9taW46IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3N0ZXA7IH1cbiAgc2V0IHN0ZXAodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fc3RlcCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX3N0ZXApO1xuXG4gICAgaWYgKHRoaXMuX3N0ZXAgJSAxICE9PSAwKSB7XG4gICAgICB0aGlzLl9yb3VuZFRvRGVjaW1hbCA9IHRoaXMuX3N0ZXAudG9TdHJpbmcoKS5zcGxpdCgnLicpLnBvcCgpIS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhpcyBjb3VsZCBtb2RpZnkgdGhlIGxhYmVsLCB3ZSBuZWVkIHRvIG5vdGlmeSB0aGUgY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9zdGVwOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSB0aHVtYiBsYWJlbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRodW1iTGFiZWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl90aHVtYkxhYmVsOyB9XG4gIHNldCB0aHVtYkxhYmVsKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3RodW1iTGFiZWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3RodW1iTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIHNob3cgdGlja3MuIFJlbGF0aXZlIHRvIHRoZSBzdGVwIHNvIHRoYXQgYSB0aWNrIGFsd2F5cyBhcHBlYXJzIG9uIGEgc3RlcC5cbiAgICogRXg6IFRpY2sgaW50ZXJ2YWwgb2YgNCB3aXRoIGEgc3RlcCBvZiAzIHdpbGwgZHJhdyBhIHRpY2sgZXZlcnkgNCBzdGVwcyAoZXZlcnkgMTIgdmFsdWVzKS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aWNrSW50ZXJ2YWwoKSB7IHJldHVybiB0aGlzLl90aWNrSW50ZXJ2YWw7IH1cbiAgc2V0IHRpY2tJbnRlcnZhbCh2YWx1ZTogJ2F1dG8nIHwgbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlID09PSAnYXV0bycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9ICdhdXRvJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIHRoaXMuX3RpY2tJbnRlcnZhbCBhcyBudW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAwO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF90aWNrSW50ZXJ2YWw6ICdhdXRvJyB8IG51bWJlciA9IDA7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVhZCBhbmQgaXQgaXMgc3RpbGwgdW5pbml0aWFsaXplZCwgaW5pdGlhbGl6ZSBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgaWYgKHYgIT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICBsZXQgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KTtcblxuICAgICAgLy8gV2hpbGUgaW5jcmVtZW50aW5nIGJ5IGEgZGVjaW1hbCB3ZSBjYW4gZW5kIHVwIHdpdGggdmFsdWVzIGxpa2UgMzMuMzAwMDAwMDAwMDAwMDA0LlxuICAgICAgLy8gVHJ1bmNhdGUgaXQgdG8gZW5zdXJlIHRoYXQgaXQgbWF0Y2hlcyB0aGUgbGFiZWwgYW5kIHRvIG1ha2UgaXQgZWFzaWVyIHRvIHdvcmsgd2l0aC5cbiAgICAgIGlmICh0aGlzLl9yb3VuZFRvRGVjaW1hbCkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsOyB9XG4gIHNldCB2ZXJ0aWNhbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3ZlcnRpY2FsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF92ZXJ0aWNhbCA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgbW92ZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBpbnB1dDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgcmF3IHZhbHVlIG9mIHRoZSBzbGlkZXIgY2hhbmdlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseVxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0d28td2F5IGJpbmRpbmcgZm9yIHRoZSBgdmFsdWVgIGlucHV0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4oKTtcblxuICAvKiogVGhlIHZhbHVlIHRvIGJlIHVzZWQgZm9yIGRpc3BsYXkgcHVycG9zZXMuICovXG4gIGdldCBkaXNwbGF5VmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5V2l0aCkge1xuICAgICAgLy8gVmFsdWUgaXMgbmV2ZXIgbnVsbCBidXQgc2luY2Ugc2V0dGVycyBhbmQgZ2V0dGVycyBjYW5ub3QgaGF2ZVxuICAgICAgLy8gZGlmZmVyZW50IHR5cGVzLCB0aGUgdmFsdWUgZ2V0dGVyIGlzIGFsc28gdHlwZWQgdG8gcmV0dXJuIG51bGwuXG4gICAgICByZXR1cm4gdGhpcy5kaXNwbGF5V2l0aCh0aGlzLnZhbHVlISk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgY291bGQgYmUgaW1wcm92ZWQgZnVydGhlciBieSByb3VuZGluZyBzb21ldGhpbmcgbGlrZSAwLjk5OSB0byAxIG9yXG4gICAgLy8gMC44OTkgdG8gMC45LCBob3dldmVyIGl0IGlzIHZlcnkgcGVyZm9ybWFuY2Ugc2Vuc2l0aXZlLCBiZWNhdXNlIGl0IGdldHMgY2FsbGVkIG9uXG4gICAgLy8gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICUgMSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudmFsdWUgfHwgMDtcbiAgfVxuXG4gIC8qKiBzZXQgZm9jdXMgdG8gdGhlIGhvc3QgZWxlbWVudCAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBibHVyIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgYmx1cigpIHtcbiAgICB0aGlzLl9ibHVySG9zdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBvblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY2xhbXAodGhpcy5fcGVyY2VudCk7IH1cbiAgcHJpdmF0ZSBfcGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHRodW1iIGlzIHNsaWRpbmcuXG4gICAqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZXJlIHNob3VsZCBiZSBhIHRyYW5zaXRpb24gZm9yIHRoZSB0aHVtYiBhbmQgZmlsbCB0cmFjay5cbiAgICovXG4gIF9pc1NsaWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHNsaWRlciBpcyBhY3RpdmUgKGNsaWNrZWQgb3Igc2xpZGluZykuXG4gICAqIFVzZWQgdG8gc2hyaW5rIGFuZCBncm93IHRoZSB0aHVtYiBhcyBhY2NvcmRpbmcgdG8gdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjLlxuICAgKi9cbiAgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF4aXMgb2YgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC5cbiAgICogKGkuZS4gd2hldGhlciBtb3ZpbmcgdGhlIHRodW1iIGluIHRoZSBwb3NpdGl2ZSB4IG9yIHkgZGlyZWN0aW9uIGRlY3JlYXNlcyB0aGUgc2xpZGVyJ3MgdmFsdWUpLlxuICAgKi9cbiAgZ2V0IF9pbnZlcnRBeGlzKCkge1xuICAgIC8vIFN0YW5kYXJkIG5vbi1pbnZlcnRlZCBtb2RlIGZvciBhIHZlcnRpY2FsIHNsaWRlciBzaG91bGQgYmUgZHJhZ2dpbmcgdGhlIHRodW1iIGZyb20gYm90dG9tIHRvXG4gICAgLy8gdG9wLiBIb3dldmVyIGZyb20gYSB5LWF4aXMgc3RhbmRwb2ludCB0aGlzIGlzIGludmVydGVkLlxuICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gIXRoaXMuaW52ZXJ0IDogdGhpcy5pbnZlcnQ7XG4gIH1cblxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG4gIGdldCBfaXNNaW5WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wZXJjZW50ID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gbGVhdmUgYmV0d2VlbiB0aGUgc2xpZGVyIHRodW1iIGFuZCB0aGUgdHJhY2sgZmlsbCAmIHRyYWNrIGJhY2tncm91bmRcbiAgICogZWxlbWVudHMuXG4gICAqL1xuICBnZXQgX3RodW1iR2FwKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gRElTQUJMRURfVEhVTUJfR0FQO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiAhdGhpcy50aHVtYkxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNBY3RpdmUgPyBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA6IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgYmFja2dyb3VuZCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrQmFja2dyb3VuZFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHsxIC0gdGhpcy5wZXJjZW50fSwgMWAgOiBgJHsxIC0gdGhpcy5wZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnLScgOiAnJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgZmlsbCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrRmlsbFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHt0aGlzLnBlcmNlbnR9LCAxYCA6IGAke3RoaXMucGVyY2VudH0sIDEsIDFgO1xuICAgIGNvbnN0IHNpZ24gPSB0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpID8gJycgOiAnLSc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gc2NhbGUzZCBhdm9pZHMgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIENocm9tZS4gU2VlICMxMjA3MS5cbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGhpcy5fdGh1bWJHYXB9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGNvbnRhaW5lciBlbGVtZW50LiAqL1xuICBnZXQgX3RpY2tzQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRpY2tzIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgc2lnbiA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gJycgOiAnLSc7XG4gICAgbGV0IG9mZnNldCA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgLyAyICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGVsZW1lbnQuICovXG4gIGdldCBfdGlja3NTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IHRpY2tTaXplID0gdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCAqIDEwMDtcbiAgICBsZXQgYmFja2dyb3VuZFNpemUgPSB0aGlzLnZlcnRpY2FsID8gYDJweCAke3RpY2tTaXplfSVgIDogYCR7dGlja1NpemV9JSAycHhgO1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiB3ZSBwdXNoZWQgdGhlIHRpY2tzIGNvbnRhaW5lciwgcHVzaCB0aGUgdGlja3MgdGhlIG9wcG9zaXRlXG4gICAgLy8gZGlyZWN0aW9uIHRvIHJlLWNlbnRlciB0aGVtIGJ1dCBjbGlwIG9mZiB0aGUgZW5kIGVkZ2UuIEluIFJUTCBsYW5ndWFnZXMgd2UgbmVlZCB0byBmbGlwIHRoZVxuICAgIC8vIHRpY2tzIDE4MCBkZWdyZWVzIHNvIHdlJ3JlIHJlYWxseSBjdXR0aW5nIG9mZiB0aGUgZW5kIGVkZ2UgYWJkIG5vdCB0aGUgc3RhcnQuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICctJyA6ICcnO1xuICAgIGxldCByb3RhdGUgPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcgcm90YXRlKDE4MGRlZyknIDogJyc7XG4gICAgbGV0IHN0eWxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IGJhY2tncm91bmRTaXplLFxuICAgICAgLy8gV2l0aG91dCB0cmFuc2xhdGVaIHRpY2tzIHNvbWV0aW1lcyBqaXR0ZXIgYXMgdGhlIHNsaWRlciBtb3ZlcyBvbiBDaHJvbWUgJiBGaXJlZm94LlxuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiB0aGlzLl90aHVtYkdhcCkge1xuICAgICAgbGV0IHNpZGUgPSB0aGlzLnZlcnRpY2FsID9cbiAgICAgICAgICAodGhpcy5faW52ZXJ0QXhpcyA/ICdCb3R0b20nIDogJ1RvcCcpIDpcbiAgICAgICAgICAodGhpcy5faW52ZXJ0QXhpcyA/ICdSaWdodCcgOiAnTGVmdCcpO1xuICAgICAgc3R5bGVzW2BwYWRkaW5nJHtzaWRlfWBdID0gYCR7dGhpcy5fdGh1bWJHYXB9cHhgO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICBnZXQgX3RodW1iQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRodW1iIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgaW52ZXJ0T2Zmc2V0ID1cbiAgICAgICAgKHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnICYmICF0aGlzLnZlcnRpY2FsKSA/ICF0aGlzLl9pbnZlcnRBeGlzIDogdGhpcy5faW52ZXJ0QXhpcztcbiAgICBsZXQgb2Zmc2V0ID0gKGludmVydE9mZnNldCA/IHRoaXMucGVyY2VudCA6IDEgLSB0aGlzLnBlcmNlbnQpICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oLSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogVGhlIHNpemUgb2YgYSB0aWNrIGludGVydmFsIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgc2l6ZSBvZiB0aGUgdHJhY2suICovXG4gIHByaXZhdGUgX3RpY2tJbnRlcnZhbFBlcmNlbnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3NsaWRlckRpbWVuc2lvbnM6IENsaWVudFJlY3QgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBEZWNpbWFsIHBsYWNlcyB0byByb3VuZCB0bywgYmFzZWQgb24gdGhlIHN0ZXAgYW1vdW50LiAqL1xuICBwcml2YXRlIF9yb3VuZFRvRGVjaW1hbDogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIERpcmVjdGlvbmFsaXR5IGNoYW5nZSBFdmVudEVtaXR0ZXIuICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgd2hlbiB0aGUgc2xpZGUgc3RhcnQgZXZlbnQgZmlyZXMuICovXG4gIHByaXZhdGUgX3ZhbHVlT25TbGlkZVN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIHNsaWRlciB3cmFwcGVyIGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcldyYXBwZXInLCB7c3RhdGljOiBmYWxzZX0pIHByaXZhdGUgX3NsaWRlcldyYXBwZXI6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgbW91c2UgZXZlbnRzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gYSBzbGlkZXIgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlaXIgZGlzdGFuY2VcbiAgICogZnJvbSB0aGUgcmlnaHQgb3IgYm90dG9tIGVkZ2Ugb2YgdGhlIHNsaWRlciBhcyBvcHBvc2VkIHRvIHRoZSB0b3Agb3IgbGVmdC5cbiAgICovXG4gIF9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpIHtcbiAgICByZXR1cm4gKHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnICYmICF0aGlzLnZlcnRpY2FsKSA/ICF0aGlzLl9pbnZlcnRBeGlzIDogdGhpcy5faW52ZXJ0QXhpcztcbiAgfVxuXG4gIC8qKiBUaGUgbGFuZ3VhZ2UgZGlyZWN0aW9uIGZvciB0aGlzIHNsaWRlciBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9nZXREaXJlY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09ICdydGwnKSA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYF9hbmltYXRpb25Nb2RlYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yXG4gICAgICAgIC5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAgIC5zdWJzY3JpYmUoKG9yaWdpbjogRm9jdXNPcmlnaW4pID0+IHtcbiAgICAgICAgICB0aGlzLl9pc0FjdGl2ZSA9ICEhb3JpZ2luICYmIG9yaWdpbiAhPT0gJ2tleWJvYXJkJztcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuX2Rpci5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBfb25Nb3VzZWVudGVyKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiB0aGUgc2xpZGVyIGlzIGRpc2FibGVkIG9yIHRoZVxuICAgIC8vIHVzZXIgaXMgdXNpbmcgYW55dGhpbmcgb3RoZXIgdGhhbiB0aGUgbWFpbiBtb3VzZSBidXR0b24uXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQoKTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbih7eDogZXZlbnQuY2xpZW50WCwgeTogZXZlbnQuY2xpZW50WX0pO1xuXG4gICAgLy8gRW1pdCBhIGNoYW5nZSBhbmQgaW5wdXQgZXZlbnQgaWYgdGhlIHZhbHVlIGNoYW5nZWQuXG4gICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfb25TbGlkZShldmVudDogSGFtbWVySW5wdXQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBzbGlkZSBzdGFydCBldmVudCBzb21ldGltZXMgZmFpbHMgdG8gZmlyZSBvbiBpT1MsIHNvIGlmIHdlJ3JlIG5vdCBhbHJlYWR5IGluIHRoZSBzbGlkaW5nXG4gICAgLy8gc3RhdGUsIGNhbGwgdGhlIHNsaWRlIHN0YXJ0IGhhbmRsZXIgbWFudWFsbHkuXG4gICAgaWYgKCF0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIHRoaXMuX29uU2xpZGVTdGFydChudWxsKTtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBzbGlkZSBmcm9tIHNlbGVjdGluZyBhbnl0aGluZyBlbHNlLlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHt4OiBldmVudC5jZW50ZXIueCwgeTogZXZlbnQuY2VudGVyLnl9KTtcblxuICAgIC8vIE5hdGl2ZSByYW5nZSBlbGVtZW50cyBhbHdheXMgZW1pdCBgaW5wdXRgIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VkIHdoaWxlIHNsaWRpbmcuXG4gICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgX29uU2xpZGVTdGFydChldmVudDogSGFtbWVySW5wdXQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5faXNTbGlkaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2ltdWxhdGUgbW91c2VlbnRlciBpbiBjYXNlIHRoaXMgaXMgYSBtb2JpbGUgZGV2aWNlLlxuICAgIHRoaXMuX29uTW91c2VlbnRlcigpO1xuXG4gICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLnZhbHVlO1xuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbih7eDogZXZlbnQuY2VudGVyLngsIHk6IGV2ZW50LmNlbnRlci55fSk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIF9vblNsaWRlRW5kKCkge1xuICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ICE9IHRoaXMudmFsdWUgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cbiAgICB0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCA9IG51bGw7XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfRE9XTjpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIC8vIE5PVEU6IEZvciBhIHNpZ2h0ZWQgdXNlciBpdCB3b3VsZCBtYWtlIG1vcmUgc2Vuc2UgdGhhdCB3aGVuIHRoZXkgcHJlc3MgYW4gYXJyb3cga2V5IG9uIGFuXG4gICAgICAgIC8vIGludmVydGVkIHNsaWRlciB0aGUgdGh1bWIgbW92ZXMgaW4gdGhhdCBkaXJlY3Rpb24uIEhvd2V2ZXIgZm9yIGEgYmxpbmQgdXNlciwgbm90aGluZ1xuICAgICAgICAvLyBhYm91dCB0aGUgc2xpZGVyIGluZGljYXRlcyB0aGF0IGl0IGlzIGludmVydGVkLiBUaGV5IHdpbGwgZXhwZWN0IGxlZnQgdG8gYmUgZGVjcmVtZW50LFxuICAgICAgICAvLyByZWdhcmRsZXNzIG9mIGhvdyBpdCBhcHBlYXJzIG9uIHRoZSBzY3JlZW4uIEZvciBzcGVha2VycyBvZlJUTCBsYW5ndWFnZXMsIHRoZXkgcHJvYmFibHlcbiAgICAgICAgLy8gZXhwZWN0IGxlZnQgdG8gbWVhbiBpbmNyZW1lbnQuIFRoZXJlZm9yZSB3ZSBmbGlwIHRoZSBtZWFuaW5nIG9mIHRoZSBzaWRlIGFycm93IGtleXMgZm9yXG4gICAgICAgIC8vIFJUTC4gRm9yIGludmVydGVkIHNsaWRlcnMgd2UgcHJlZmVyIGEgZ29vZCBhMTF5IGV4cGVyaWVuY2UgdG8gaGF2aW5nIGl0IFwibG9vayByaWdodFwiIGZvclxuICAgICAgICAvLyBzaWdodGVkIHVzZXJzLCB0aGVyZWZvcmUgd2UgZG8gbm90IHN3YXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/IDEgOiAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIC8vIFNlZSBjb21tZW50IG9uIExFRlRfQVJST1cgYWJvdXQgdGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggd2UgZmxpcCB0aGUgbWVhbmluZy5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50KHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gLTEgOiAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gUmV0dXJuIGlmIHRoZSBrZXkgaXMgbm90IG9uZSB0aGF0IHdlIGV4cGxpY2l0bHkgaGFuZGxlIHRvIGF2b2lkIGNhbGxpbmcgcHJldmVudERlZmF1bHQgb25cbiAgICAgICAgLy8gaXQuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU2xpZGluZyA9IHRydWU7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIF9vbktleXVwKCkge1xuICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEluY3JlbWVudHMgdGhlIHNsaWRlciBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIHN0ZXBzIChuZWdhdGl2ZSBudW1iZXIgZGVjcmVtZW50cykuICovXG4gIHByaXZhdGUgX2luY3JlbWVudChudW1TdGVwczogbnVtYmVyKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKCh0aGlzLnZhbHVlIHx8IDApICsgdGhpcy5zdGVwICogbnVtU3RlcHMsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlIHRoZSBuZXcgdmFsdWUgZnJvbSB0aGUgbmV3IHBoeXNpY2FsIGxvY2F0aW9uLiBUaGUgdmFsdWUgd2lsbCBhbHdheXMgYmUgc25hcHBlZC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24ocG9zOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9KSB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG9mZnNldCA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLnRvcCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMubGVmdDtcbiAgICBsZXQgc2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgbGV0IHBvc0NvbXBvbmVudCA9IHRoaXMudmVydGljYWwgPyBwb3MueSA6IHBvcy54O1xuXG4gICAgLy8gVGhlIGV4YWN0IHZhbHVlIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgZXZlbnQgYW5kIHVzZWQgdG8gZmluZCB0aGUgY2xvc2VzdCBzbmFwIHZhbHVlLlxuICAgIGxldCBwZXJjZW50ID0gdGhpcy5fY2xhbXAoKHBvc0NvbXBvbmVudCAtIG9mZnNldCkgLyBzaXplKTtcblxuICAgIGlmICh0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpKSB7XG4gICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIHN0ZXBzIG1heSBub3QgZGl2aWRlIGNsZWFubHkgaW50byB0aGUgbWF4IHZhbHVlLCBpZiB0aGUgdXNlclxuICAgIC8vIHNsaWQgdG8gMCBvciAxMDAgcGVyY2VudCwgd2UganVtcCB0byB0aGUgbWluL21heCB2YWx1ZS4gVGhpcyBhcHByb2FjaFxuICAgIC8vIGlzIHNsaWdodGx5IG1vcmUgaW50dWl0aXZlIHRoYW4gdXNpbmcgYE1hdGguY2VpbGAgYmVsb3csIGJlY2F1c2UgaXRcbiAgICAvLyBmb2xsb3dzIHRoZSB1c2VyJ3MgcG9pbnRlciBjbG9zZXIuXG4gICAgaWYgKHBlcmNlbnQgPT09IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPT09IDEpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhhY3RWYWx1ZSA9IHRoaXMuX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnQpO1xuXG4gICAgICAvLyBUaGlzIGNhbGN1bGF0aW9uIGZpbmRzIHRoZSBjbG9zZXN0IHN0ZXAgYnkgZmluZGluZyB0aGUgY2xvc2VzdFxuICAgICAgLy8gd2hvbGUgbnVtYmVyIGRpdmlzaWJsZSBieSB0aGUgc3RlcCByZWxhdGl2ZSB0byB0aGUgbWluLlxuICAgICAgY29uc3QgY2xvc2VzdFZhbHVlID0gTWF0aC5yb3VuZCgoZXhhY3RWYWx1ZSAtIHRoaXMubWluKSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXAgKyB0aGlzLm1pbjtcblxuICAgICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIHNuYXAgdG8gdGhlIG1pbiBhbmQgbWF4LlxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKGNsb3Nlc3RWYWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4odGhpcy52YWx1ZSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogRW1pdHMgYW4gaW5wdXQgZXZlbnQgd2hlbiB0aGUgY3VycmVudCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0SW5wdXRFdmVudCgpIHtcbiAgICB0aGlzLmlucHV0LmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlja3MgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aWR0aCBvZiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCkge1xuICAgIGlmICghdGhpcy50aWNrSW50ZXJ2YWwgfHwgIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aWNrSW50ZXJ2YWwgPT0gJ2F1dG8nKSB7XG4gICAgICBsZXQgdHJhY2tTaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICAgIGxldCBwaXhlbHNQZXJTdGVwID0gdHJhY2tTaXplICogdGhpcy5zdGVwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgbGV0IHN0ZXBzUGVyVGljayA9IE1hdGguY2VpbChNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gLyBwaXhlbHNQZXJTdGVwKTtcbiAgICAgIGxldCBwaXhlbHNQZXJUaWNrID0gc3RlcHNQZXJUaWNrICogdGhpcy5zdGVwO1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCA9IHBpeGVsc1BlclRpY2sgLyB0cmFja1NpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSB0aGlzLnRpY2tJbnRlcnZhbCAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIHNsaWRlciBjaGFuZ2Ugb2JqZWN0IGZyb20gdGhlIHNwZWNpZmllZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ2hhbmdlRXZlbnQodmFsdWUgPSB0aGlzLnZhbHVlKTogTWF0U2xpZGVyQ2hhbmdlIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgTWF0U2xpZGVyQ2hhbmdlKCk7XG5cbiAgICBldmVudC5zb3VyY2UgPSB0aGlzO1xuICAgIGV2ZW50LnZhbHVlID0gdmFsdWU7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgYSB2YWx1ZSBpcy4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHJldHVybiAoKHZhbHVlIHx8IDApIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHZhbHVlIGEgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIGNvcnJlc3BvbmRzIHRvLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVWYWx1ZShwZXJjZW50YWdlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5taW4gKyBwZXJjZW50YWdlICogKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICB9XG5cbiAgLyoqIFJldHVybiBhIG51bWJlciBiZXR3ZWVuIHR3byBudW1iZXJzLiAqL1xuICBwcml2YXRlIF9jbGFtcCh2YWx1ZTogbnVtYmVyLCBtaW4gPSAwLCBtYXggPSAxKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYm91bmRpbmcgY2xpZW50IHJlY3Qgb2YgdGhlIHNsaWRlciB0cmFjayBlbGVtZW50LlxuICAgKiBUaGUgdHJhY2sgaXMgdXNlZCByYXRoZXIgdGhhbiB0aGUgbmF0aXZlIGVsZW1lbnQgdG8gaWdub3JlIHRoZSBleHRyYSBzcGFjZSB0aGF0IHRoZSB0aHVtYiBjYW5cbiAgICogdGFrZSB1cC5cbiAgICovXG4gIHByaXZhdGUgX2dldFNsaWRlckRpbWVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlcldyYXBwZXIgPyB0aGlzLl9zbGlkZXJXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIG5hdGl2ZSBlbGVtZW50LlxuICAgKiBDdXJyZW50bHkgb25seSB1c2VkIHRvIGFsbG93IGEgYmx1ciBldmVudCB0byBmaXJlIGJ1dCB3aWxsIGJlIHVzZWQgd2l0aCBrZXlib2FyZCBpbnB1dCBsYXRlci5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzSG9zdEVsZW1lbnQob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbmF0aXZlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2JsdXJIb3N0RWxlbWVudCgpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1vZGVsIHZhbHVlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgaGFzIGNoYW5nZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyB0b3VjaGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWRcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG59XG4iXX0=