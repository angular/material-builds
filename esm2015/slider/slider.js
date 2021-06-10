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
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, NgZone, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
const activeEventOptions = normalizePassiveListenerOptions({ passive: false });
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
const MIN_AUTO_TICK_SEPARATION = 30;
/** The thumb gap size for a disabled slider. */
const DISABLED_THUMB_GAP = 7;
/** The thumb gap size for a non-active slider at its minimum value. */
const MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/** The thumb gap size for an active slider at its minimum value. */
const MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/**
 * Provider Expression that allows mat-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 * @docs-private
 */
export const MAT_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatSlider),
    multi: true
};
/** A simple change event emitted by the MatSlider component. */
export class MatSliderChange {
}
// Boilerplate for applying mixins to MatSlider.
/** @docs-private */
const _MatSliderBase = mixinTabIndex(mixinColor(mixinDisabled(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}), 'accent'));
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export class MatSlider extends _MatSliderBase {
    constructor(elementRef, _focusMonitor, _changeDetectorRef, _dir, tabIndex, _ngZone, _document, _animationMode) {
        super(elementRef);
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._ngZone = _ngZone;
        this._animationMode = _animationMode;
        this._invert = false;
        this._max = 100;
        this._min = 0;
        this._step = 1;
        this._thumbLabel = false;
        this._tickInterval = 0;
        this._value = null;
        this._vertical = false;
        /** Event emitted when the slider value has changed. */
        this.change = new EventEmitter();
        /** Event emitted when the slider thumb moves. */
        this.input = new EventEmitter();
        /**
         * Emits when the raw value of the slider changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * @docs-private
         */
        this.valueChange = new EventEmitter();
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = () => { };
        this._percent = 0;
        /**
         * Whether or not the thumb is sliding and what the user is using to slide it with.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        this._isSliding = null;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        this._isActive = false;
        /** The size of a tick interval as a percentage of the size of the track. */
        this._tickIntervalPercent = 0;
        /** The dimensions of the slider. */
        this._sliderDimensions = null;
        this._controlValueAccessorChangeFn = () => { };
        /** Subscription to the Directionality change EventEmitter. */
        this._dirChangeSubscription = Subscription.EMPTY;
        /** Called when the user has put their pointer down on the slider. */
        this._pointerDown = (event) => {
            // Don't do anything if the slider is disabled or the
            // user is using anything other than the main mouse button.
            if (this.disabled || this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
                return;
            }
            this._ngZone.run(() => {
                this._touchId = isTouchEvent(event) ?
                    getTouchIdForSlider(event, this._elementRef.nativeElement) : undefined;
                const pointerPosition = getPointerPositionOnPage(event, this._touchId);
                if (pointerPosition) {
                    const oldValue = this.value;
                    this._isSliding = 'pointer';
                    this._lastPointerEvent = event;
                    event.preventDefault();
                    this._focusHostElement();
                    this._onMouseenter(); // Simulate mouseenter in case this is a mobile device.
                    this._bindGlobalEvents(event);
                    this._focusHostElement();
                    this._updateValueFromPosition(pointerPosition);
                    this._valueOnSlideStart = oldValue;
                    // Emit a change and input event if the value changed.
                    if (oldValue != this.value) {
                        this._emitInputEvent();
                    }
                }
            });
        };
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        this._pointerMove = (event) => {
            if (this._isSliding === 'pointer') {
                const pointerPosition = getPointerPositionOnPage(event, this._touchId);
                if (pointerPosition) {
                    // Prevent the slide from selecting anything else.
                    event.preventDefault();
                    const oldValue = this.value;
                    this._lastPointerEvent = event;
                    this._updateValueFromPosition(pointerPosition);
                    // Native range elements always emit `input` events when the value changed while sliding.
                    if (oldValue != this.value) {
                        this._emitInputEvent();
                    }
                }
            }
        };
        /** Called when the user has lifted their pointer. Bound on the document level. */
        this._pointerUp = (event) => {
            if (this._isSliding === 'pointer') {
                if (!isTouchEvent(event) || typeof this._touchId !== 'number' ||
                    // Note that we use `changedTouches`, rather than `touches` because it
                    // seems like in most cases `touches` is empty for `touchend` events.
                    findMatchingTouch(event.changedTouches, this._touchId)) {
                    event.preventDefault();
                    this._removeGlobalEvents();
                    this._isSliding = null;
                    this._touchId = undefined;
                    if (this._valueOnSlideStart != this.value && !this.disabled) {
                        this._emitChangeEvent();
                    }
                    this._valueOnSlideStart = this._lastPointerEvent = null;
                }
            }
        };
        /** Called when the window has lost focus. */
        this._windowBlur = () => {
            // If the window is blurred while dragging we need to stop dragging because the
            // browser won't dispatch the `mouseup` and `touchend` events anymore.
            if (this._lastPointerEvent) {
                this._pointerUp(this._lastPointerEvent);
            }
        };
        this._document = _document;
        this.tabIndex = parseInt(tabIndex) || 0;
        _ngZone.runOutsideAngular(() => {
            const element = elementRef.nativeElement;
            element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
            element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
        });
    }
    /** Whether the slider is inverted. */
    get invert() { return this._invert; }
    set invert(value) {
        this._invert = coerceBooleanProperty(value);
    }
    /** The maximum value that the slider can have. */
    get max() { return this._max; }
    set max(v) {
        this._max = coerceNumberProperty(v, this._max);
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /** The minimum value that the slider can have. */
    get min() { return this._min; }
    set min(v) {
        this._min = coerceNumberProperty(v, this._min);
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /** The values at which the thumb will snap. */
    get step() { return this._step; }
    set step(v) {
        this._step = coerceNumberProperty(v, this._step);
        if (this._step % 1 !== 0) {
            this._roundToDecimal = this._step.toString().split('.').pop().length;
        }
        // Since this could modify the label, we need to notify the change detection.
        this._changeDetectorRef.markForCheck();
    }
    /** Whether or not to show the thumb label. */
    get thumbLabel() { return this._thumbLabel; }
    set thumbLabel(value) { this._thumbLabel = coerceBooleanProperty(value); }
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    get tickInterval() { return this._tickInterval; }
    set tickInterval(value) {
        if (value === 'auto') {
            this._tickInterval = 'auto';
        }
        else if (typeof value === 'number' || typeof value === 'string') {
            this._tickInterval = coerceNumberProperty(value, this._tickInterval);
        }
        else {
            this._tickInterval = 0;
        }
    }
    /** Value of the slider. */
    get value() {
        // If the value needs to be read and it is still uninitialized, initialize it to the min.
        if (this._value === null) {
            this.value = this._min;
        }
        return this._value;
    }
    set value(v) {
        if (v !== this._value) {
            let value = coerceNumberProperty(v, 0);
            // While incrementing by a decimal we can end up with values like 33.300000000000004.
            // Truncate it to ensure that it matches the label and to make it easier to work with.
            if (this._roundToDecimal && value !== this.min && value !== this.max) {
                value = parseFloat(value.toFixed(this._roundToDecimal));
            }
            this._value = value;
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Whether the slider is vertical. */
    get vertical() { return this._vertical; }
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /** The value to be used for display purposes. */
    get displayValue() {
        if (this.displayWith) {
            // Value is never null but since setters and getters cannot have
            // different types, the value getter is also typed to return null.
            return this.displayWith(this.value);
        }
        // Note that this could be improved further by rounding something like 0.999 to 1 or
        // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
        // every change detection cycle.
        if (this._roundToDecimal && this.value && this.value % 1 !== 0) {
            return this.value.toFixed(this._roundToDecimal);
        }
        return this.value || 0;
    }
    /** set focus to the host element */
    focus(options) {
        this._focusHostElement(options);
    }
    /** blur the host element */
    blur() {
        this._blurHostElement();
    }
    /** The percentage of the slider that coincides with the value. */
    get percent() { return this._clamp(this._percent); }
    /**
     * Whether the axis of the slider is inverted.
     * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
     */
    _shouldInvertAxis() {
        // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
        // top. However from a y-axis standpoint this is inverted.
        return this.vertical ? !this.invert : this.invert;
    }
    /** Whether the slider is at its minimum value. */
    _isMinValue() {
        return this.percent === 0;
    }
    /**
     * The amount of space to leave between the slider thumb and the track fill & track background
     * elements.
     */
    _getThumbGap() {
        if (this.disabled) {
            return DISABLED_THUMB_GAP;
        }
        if (this._isMinValue() && !this.thumbLabel) {
            return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
        }
        return 0;
    }
    /** CSS styles for the track background element. */
    _getTrackBackgroundStyles() {
        const axis = this.vertical ? 'Y' : 'X';
        const scale = this.vertical ? `1, ${1 - this.percent}, 1` : `${1 - this.percent}, 1, 1`;
        const sign = this._shouldInvertMouseCoords() ? '-' : '';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._getThumbGap()}px) scale3d(${scale})`
        };
    }
    /** CSS styles for the track fill element. */
    _getTrackFillStyles() {
        const percent = this.percent;
        const axis = this.vertical ? 'Y' : 'X';
        const scale = this.vertical ? `1, ${percent}, 1` : `${percent}, 1, 1`;
        const sign = this._shouldInvertMouseCoords() ? '' : '-';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._getThumbGap()}px) scale3d(${scale})`,
            // iOS Safari has a bug where it won't re-render elements which start of as `scale(0)` until
            // something forces a style recalculation on it. Since we'll end up with `scale(0)` when
            // the value of the slider is 0, we can easily get into this situation. We force a
            // recalculation by changing the element's `display` when it goes from 0 to any other value.
            display: percent === 0 ? 'none' : ''
        };
    }
    /** CSS styles for the ticks container element. */
    _getTicksContainerStyles() {
        let axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the ticks container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        let sign = !this.vertical && this._getDirection() == 'rtl' ? '' : '-';
        let offset = this._tickIntervalPercent / 2 * 100;
        return {
            'transform': `translate${axis}(${sign}${offset}%)`
        };
    }
    /** CSS styles for the ticks element. */
    _getTicksStyles() {
        let tickSize = this._tickIntervalPercent * 100;
        let backgroundSize = this.vertical ? `2px ${tickSize}%` : `${tickSize}% 2px`;
        let axis = this.vertical ? 'Y' : 'X';
        // Depending on the direction we pushed the ticks container, push the ticks the opposite
        // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
        // ticks 180 degrees so we're really cutting off the end edge abd not the start.
        let sign = !this.vertical && this._getDirection() == 'rtl' ? '-' : '';
        let rotate = !this.vertical && this._getDirection() == 'rtl' ? ' rotate(180deg)' : '';
        let styles = {
            'backgroundSize': backgroundSize,
            // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
            'transform': `translateZ(0) translate${axis}(${sign}${tickSize / 2}%)${rotate}`
        };
        if (this._isMinValue() && this._getThumbGap()) {
            const shouldInvertAxis = this._shouldInvertAxis();
            let side;
            if (this.vertical) {
                side = shouldInvertAxis ? 'Bottom' : 'Top';
            }
            else {
                side = shouldInvertAxis ? 'Right' : 'Left';
            }
            styles[`padding${side}`] = `${this._getThumbGap()}px`;
        }
        return styles;
    }
    _getThumbContainerStyles() {
        const shouldInvertAxis = this._shouldInvertAxis();
        let axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the thumb container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        let invertOffset = (this._getDirection() == 'rtl' && !this.vertical) ? !shouldInvertAxis : shouldInvertAxis;
        let offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
        return {
            'transform': `translate${axis}(-${offset}%)`
        };
    }
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    _shouldInvertMouseCoords() {
        const shouldInvertAxis = this._shouldInvertAxis();
        return (this._getDirection() == 'rtl' && !this.vertical) ? !shouldInvertAxis : shouldInvertAxis;
    }
    /** The language direction for this slider element. */
    _getDirection() {
        return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
    }
    ngAfterViewInit() {
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe((origin) => {
            this._isActive = !!origin && origin !== 'keyboard';
            this._changeDetectorRef.detectChanges();
        });
        if (this._dir) {
            this._dirChangeSubscription = this._dir.change.subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    ngOnDestroy() {
        const element = this._elementRef.nativeElement;
        element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
        element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
        this._lastPointerEvent = null;
        this._removeGlobalEvents();
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._dirChangeSubscription.unsubscribe();
    }
    _onMouseenter() {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    }
    _onFocus() {
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    }
    _onBlur() {
        this.onTouched();
    }
    _onKeydown(event) {
        if (this.disabled || hasModifierKey(event) ||
            (this._isSliding && this._isSliding !== 'keyboard')) {
            return;
        }
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
        this._isSliding = 'keyboard';
        event.preventDefault();
    }
    _onKeyup() {
        if (this._isSliding === 'keyboard') {
            this._isSliding = null;
        }
    }
    /** Use defaultView of injected document if available or fallback to global window reference */
    _getWindow() {
        return this._document.defaultView || window;
    }
    /**
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     */
    _bindGlobalEvents(triggerEvent) {
        // Note that we bind the events to the `document`, because it allows us to capture
        // drag cancel events where the user's pointer is outside the browser window.
        const document = this._document;
        const isTouch = isTouchEvent(triggerEvent);
        const moveEventName = isTouch ? 'touchmove' : 'mousemove';
        const endEventName = isTouch ? 'touchend' : 'mouseup';
        document.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
        document.addEventListener(endEventName, this._pointerUp, activeEventOptions);
        if (isTouch) {
            document.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
        }
        const window = this._getWindow();
        if (typeof window !== 'undefined' && window) {
            window.addEventListener('blur', this._windowBlur);
        }
    }
    /** Removes any global event listeners that we may have added. */
    _removeGlobalEvents() {
        const document = this._document;
        document.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
        document.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
        document.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
        document.removeEventListener('touchend', this._pointerUp, activeEventOptions);
        document.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);
        const window = this._getWindow();
        if (typeof window !== 'undefined' && window) {
            window.removeEventListener('blur', this._windowBlur);
        }
    }
    /** Increments the slider by the given number of steps (negative number decrements). */
    _increment(numSteps) {
        this.value = this._clamp((this.value || 0) + this.step * numSteps, this.min, this.max);
    }
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    _updateValueFromPosition(pos) {
        if (!this._sliderDimensions) {
            return;
        }
        let offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        let size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        let posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
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
            const exactValue = this._calculateValue(percent);
            // This calculation finds the closest step by finding the closest
            // whole number divisible by the step relative to the min.
            const closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
            // The value needs to snap to the min and max.
            this.value = this._clamp(closestValue, this.min, this.max);
        }
    }
    /** Emits a change event if the current value is different from the last emitted value. */
    _emitChangeEvent() {
        this._controlValueAccessorChangeFn(this.value);
        this.valueChange.emit(this.value);
        this.change.emit(this._createChangeEvent());
    }
    /** Emits an input event when the current value is different from the last emitted value. */
    _emitInputEvent() {
        this.input.emit(this._createChangeEvent());
    }
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    _updateTickIntervalPercent() {
        if (!this.tickInterval || !this._sliderDimensions) {
            return;
        }
        if (this.tickInterval == 'auto') {
            let trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            let pixelsPerStep = trackSize * this.step / (this.max - this.min);
            let stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            let pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = this.tickInterval * this.step / (this.max - this.min);
        }
    }
    /** Creates a slider change object from the specified value. */
    _createChangeEvent(value = this.value) {
        let event = new MatSliderChange();
        event.source = this;
        event.value = value;
        return event;
    }
    /** Calculates the percentage of the slider that a value is. */
    _calculatePercentage(value) {
        return ((value || 0) - this.min) / (this.max - this.min);
    }
    /** Calculates the value a percentage of the slider corresponds to. */
    _calculateValue(percentage) {
        return this.min + percentage * (this.max - this.min);
    }
    /** Return a number between two numbers. */
    _clamp(value, min = 0, max = 1) {
        return Math.max(min, Math.min(value, max));
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    _getSliderDimensions() {
        return this._sliderWrapper ? this._sliderWrapper.nativeElement.getBoundingClientRect() : null;
    }
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    _focusHostElement(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /** Blurs the native element. */
    _blurHostElement() {
        this._elementRef.nativeElement.blur();
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
MatSlider.decorators = [
    { type: Component, args: [{
                selector: 'mat-slider',
                exportAs: 'matSlider',
                providers: [MAT_SLIDER_VALUE_ACCESSOR],
                host: {
                    '(focus)': '_onFocus()',
                    '(blur)': '_onBlur()',
                    '(keydown)': '_onKeydown($event)',
                    '(keyup)': '_onKeyup()',
                    '(mouseenter)': '_onMouseenter()',
                    // On Safari starting to slide temporarily triggers text selection mode which
                    // show the wrong cursor. We prevent it by stopping the `selectstart` event.
                    '(selectstart)': '$event.preventDefault()',
                    'class': 'mat-slider mat-focus-indicator',
                    'role': 'slider',
                    '[tabIndex]': 'tabIndex',
                    '[attr.aria-disabled]': 'disabled',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuemin]': 'min',
                    '[attr.aria-valuenow]': 'value',
                    // NVDA and Jaws appear to announce the `aria-valuenow` by calculating its percentage based
                    // on its value between `aria-valuemin` and `aria-valuemax`. Due to how decimals are handled,
                    // it can cause the slider to read out a very long value like 0.20000068 if the current value
                    // is 0.2 with a min of 0 and max of 1. We work around the issue by setting `aria-valuetext`
                    // to the same value that we set on the slider's thumb which will be truncated.
                    '[attr.aria-valuetext]': 'valueText == null ? displayValue : valueText',
                    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                    '[class.mat-slider-disabled]': 'disabled',
                    '[class.mat-slider-has-ticks]': 'tickInterval',
                    '[class.mat-slider-horizontal]': '!vertical',
                    '[class.mat-slider-axis-inverted]': '_shouldInvertAxis()',
                    // Class binding which is only used by the test harness as there is no other
                    // way for the harness to detect if mouse coordinates need to be inverted.
                    '[class.mat-slider-invert-mouse-coords]': '_shouldInvertMouseCoords()',
                    '[class.mat-slider-sliding]': '_isSliding',
                    '[class.mat-slider-thumb-label-showing]': 'thumbLabel',
                    '[class.mat-slider-vertical]': 'vertical',
                    '[class.mat-slider-min-value]': '_isMinValue()',
                    '[class.mat-slider-hide-last-tick]': 'disabled || _isMinValue() && _getThumbGap() && _shouldInvertAxis()',
                    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                },
                template: "<div class=\"mat-slider-wrapper\" #sliderWrapper>\n  <div class=\"mat-slider-track-wrapper\">\n    <div class=\"mat-slider-track-background\" [ngStyle]=\"_getTrackBackgroundStyles()\"></div>\n    <div class=\"mat-slider-track-fill\" [ngStyle]=\"_getTrackFillStyles()\"></div>\n  </div>\n  <div class=\"mat-slider-ticks-container\" [ngStyle]=\"_getTicksContainerStyles()\">\n    <div class=\"mat-slider-ticks\" [ngStyle]=\"_getTicksStyles()\"></div>\n  </div>\n  <div class=\"mat-slider-thumb-container\" [ngStyle]=\"_getThumbContainerStyles()\">\n    <div class=\"mat-slider-focus-ring\"></div>\n    <div class=\"mat-slider-thumb\"></div>\n    <div class=\"mat-slider-thumb-label\">\n      <span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span>\n    </div>\n  </div>\n</div>\n",
                inputs: ['disabled', 'color', 'tabIndex'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mat-slider:not(.mat-slider-disabled):active,.mat-slider.mat-slider-sliding:not(.mat-slider-disabled){cursor:-webkit-grabbing;cursor:grabbing}.mat-slider-wrapper{-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{-webkit-background-clip:content-box;background-clip:content-box;background-repeat:repeat;box-sizing:border-box;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider.cdk-keyboard-focused .mat-slider-focus-ring,.mat-slider.cdk-program-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb{cursor:-webkit-grab;cursor:grab}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(0.7);transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-radius 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.cdk-high-contrast-active .mat-slider-thumb-label{outline:solid 1px}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-sliding .mat-slider-track-fill,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-thumb-container{transition-duration:0ms}.mat-slider-has-ticks .mat-slider-wrapper::after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{display:none}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text{opacity:1}.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(0.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mat-slider-horizontal .mat-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(0.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text{transform:none}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mat-slider-vertical .mat-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(0.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}.mat-slider._mat-animation-noopable .mat-slider-track-fill,.mat-slider._mat-animation-noopable .mat-slider-track-background,.mat-slider._mat-animation-noopable .mat-slider-ticks,.mat-slider._mat-animation-noopable .mat-slider-thumb-container,.mat-slider._mat-animation-noopable .mat-slider-focus-ring,.mat-slider._mat-animation-noopable .mat-slider-thumb,.mat-slider._mat-animation-noopable .mat-slider-thumb-label,.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after{transition:none}\n"]
            },] }
];
MatSlider.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusMonitor },
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
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
    valueText: [{ type: Input }],
    vertical: [{ type: Input }],
    change: [{ type: Output }],
    input: [{ type: Output }],
    valueChange: [{ type: Output }],
    _sliderWrapper: [{ type: ViewChild, args: ['sliderWrapper',] }]
};
/** Returns whether an event is a touch event. */
function isTouchEvent(event) {
    // This function is called for every pixel that the user has dragged so we need it to be
    // as fast as possible. Since we only bind mouse events and touch events, we can assume
    // that if the event's name starts with `t`, it's a touch event.
    return event.type[0] === 't';
}
/** Gets the coordinates of a touch or mouse event relative to the viewport. */
function getPointerPositionOnPage(event, id) {
    let point;
    if (isTouchEvent(event)) {
        // The `identifier` could be undefined if the browser doesn't support `TouchEvent.identifier`.
        // If that's the case, attribute the first touch to all active sliders. This should still cover
        // the most common case while only breaking multi-touch.
        if (typeof id === 'number') {
            point = findMatchingTouch(event.touches, id) || findMatchingTouch(event.changedTouches, id);
        }
        else {
            // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
            point = event.touches[0] || event.changedTouches[0];
        }
    }
    else {
        point = event;
    }
    return point ? { x: point.clientX, y: point.clientY } : undefined;
}
/** Finds a `Touch` with a specific ID in a `TouchList`. */
function findMatchingTouch(touches, id) {
    for (let i = 0; i < touches.length; i++) {
        if (touches[i].identifier === id) {
            return touches[i];
        }
    }
    return undefined;
}
/** Gets the unique ID of a touch that matches a specific slider. */
function getTouchIdForSlider(event, sliderHost) {
    for (let i = 0; i < event.touches.length; i++) {
        const target = event.touches[i].target;
        if (sliderHost === target || sliderHost.contains(target)) {
            return event.touches[i].identifier;
        }
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBSUwsVUFBVSxFQUNWLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUVsQyxNQUFNLGtCQUFrQixHQUFH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QVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztTQUNwQztLQUNGO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgSE9NRSxcbiAgTEVGVF9BUlJPVyxcbiAgUEFHRV9ET1dOLFxuICBQQUdFX1VQLFxuICBSSUdIVF9BUlJPVyxcbiAgVVBfQVJST1csXG4gIGhhc01vZGlmaWVyS2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGUsXG4gIEhhc1RhYkluZGV4LFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuY29uc3QgYWN0aXZlRXZlbnRPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogZmFsc2V9KTtcblxuLyoqXG4gKiBWaXN1YWxseSwgYSAzMHB4IHNlcGFyYXRpb24gYmV0d2VlbiB0aWNrIG1hcmtzIGxvb2tzIGJlc3QuIFRoaXMgaXMgdmVyeSBzdWJqZWN0aXZlIGJ1dCBpdCBpc1xuICogdGhlIGRlZmF1bHQgc2VwYXJhdGlvbiB3ZSBjaG9zZS5cbiAqL1xuY29uc3QgTUlOX0FVVE9fVElDS19TRVBBUkFUSU9OID0gMzA7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGEgZGlzYWJsZWQgc2xpZGVyLiAqL1xuY29uc3QgRElTQUJMRURfVEhVTUJfR0FQID0gNztcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYSBub24tYWN0aXZlIHNsaWRlciBhdCBpdHMgbWluaW11bSB2YWx1ZS4gKi9cbmNvbnN0IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQID0gNztcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYW4gYWN0aXZlIHNsaWRlciBhdCBpdHMgbWluaW11bSB2YWx1ZS4gKi9cbmNvbnN0IE1JTl9WQUxVRV9BQ1RJVkVfVEhVTUJfR0FQID0gMTA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtc2xpZGVyIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBUaGlzIGFsbG93cyBpdCB0byBzdXBwb3J0IFsobmdNb2RlbCldIGFuZCBbZm9ybUNvbnRyb2xdLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBBIHNpbXBsZSBjaGFuZ2UgZXZlbnQgZW1pdHRlZCBieSB0aGUgTWF0U2xpZGVyIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJDaGFuZ2Uge1xuICAvKiogVGhlIE1hdFNsaWRlciB0aGF0IGNoYW5nZWQuICovXG4gIHNvdXJjZTogTWF0U2xpZGVyO1xuXG4gIC8qKiBUaGUgbmV3IHZhbHVlIG9mIHRoZSBzb3VyY2Ugc2xpZGVyLiAqL1xuICB2YWx1ZTogbnVtYmVyIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRTbGlkZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFNsaWRlckJhc2UgPSBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlZChjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn0pLCAnYWNjZW50JykpO1xuXG4vKipcbiAqIEFsbG93cyB1c2VycyB0byBzZWxlY3QgZnJvbSBhIHJhbmdlIG9mIHZhbHVlcyBieSBtb3ZpbmcgdGhlIHNsaWRlciB0aHVtYi4gSXQgaXMgc2ltaWxhciBpblxuICogYmVoYXZpb3IgdG8gdGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJyYW5nZVwiPmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlcicsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyJyxcbiAgcHJvdmlkZXJzOiBbTUFUX1NMSURFUl9WQUxVRV9BQ0NFU1NPUl0sXG4gIGhvc3Q6IHtcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICcoa2V5dXApJzogJ19vbktleXVwKCknLFxuICAgICcobW91c2VlbnRlciknOiAnX29uTW91c2VlbnRlcigpJyxcblxuICAgIC8vIE9uIFNhZmFyaSBzdGFydGluZyB0byBzbGlkZSB0ZW1wb3JhcmlseSB0cmlnZ2VycyB0ZXh0IHNlbGVjdGlvbiBtb2RlIHdoaWNoXG4gICAgLy8gc2hvdyB0aGUgd3JvbmcgY3Vyc29yLiBXZSBwcmV2ZW50IGl0IGJ5IHN0b3BwaW5nIHRoZSBgc2VsZWN0c3RhcnRgIGV2ZW50LlxuICAgICcoc2VsZWN0c3RhcnQpJzogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpJyxcbiAgICAnY2xhc3MnOiAnbWF0LXNsaWRlciBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAncm9sZSc6ICdzbGlkZXInLFxuICAgICdbdGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtaW4nLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICd2YWx1ZScsXG5cbiAgICAvLyBOVkRBIGFuZCBKYXdzIGFwcGVhciB0byBhbm5vdW5jZSB0aGUgYGFyaWEtdmFsdWVub3dgIGJ5IGNhbGN1bGF0aW5nIGl0cyBwZXJjZW50YWdlIGJhc2VkXG4gICAgLy8gb24gaXRzIHZhbHVlIGJldHdlZW4gYGFyaWEtdmFsdWVtaW5gIGFuZCBgYXJpYS12YWx1ZW1heGAuIER1ZSB0byBob3cgZGVjaW1hbHMgYXJlIGhhbmRsZWQsXG4gICAgLy8gaXQgY2FuIGNhdXNlIHRoZSBzbGlkZXIgdG8gcmVhZCBvdXQgYSB2ZXJ5IGxvbmcgdmFsdWUgbGlrZSAwLjIwMDAwMDY4IGlmIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgLy8gaXMgMC4yIHdpdGggYSBtaW4gb2YgMCBhbmQgbWF4IG9mIDEuIFdlIHdvcmsgYXJvdW5kIHRoZSBpc3N1ZSBieSBzZXR0aW5nIGBhcmlhLXZhbHVldGV4dGBcbiAgICAvLyB0byB0aGUgc2FtZSB2YWx1ZSB0aGF0IHdlIHNldCBvbiB0aGUgc2xpZGVyJ3MgdGh1bWIgd2hpY2ggd2lsbCBiZSB0cnVuY2F0ZWQuXG4gICAgJ1thdHRyLmFyaWEtdmFsdWV0ZXh0XSc6ICd2YWx1ZVRleHQgPT0gbnVsbCA/IGRpc3BsYXlWYWx1ZSA6IHZhbHVlVGV4dCcsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oYXMtdGlja3NdJzogJ3RpY2tJbnRlcnZhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWF4aXMtaW52ZXJ0ZWRdJzogJ19zaG91bGRJbnZlcnRBeGlzKCknLFxuICAgIC8vIENsYXNzIGJpbmRpbmcgd2hpY2ggaXMgb25seSB1c2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgYXMgdGhlcmUgaXMgbm8gb3RoZXJcbiAgICAvLyB3YXkgZm9yIHRoZSBoYXJuZXNzIHRvIGRldGVjdCBpZiBtb3VzZSBjb29yZGluYXRlcyBuZWVkIHRvIGJlIGludmVydGVkLlxuICAgICdbY2xhc3MubWF0LXNsaWRlci1pbnZlcnQtbW91c2UtY29vcmRzXSc6ICdfc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKScsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXNsaWRpbmddJzogJ19pc1NsaWRpbmcnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci10aHVtYi1sYWJlbC1zaG93aW5nXSc6ICd0aHVtYkxhYmVsJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItbWluLXZhbHVlXSc6ICdfaXNNaW5WYWx1ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGlkZS1sYXN0LXRpY2tdJzpcbiAgICAgICAgJ2Rpc2FibGVkIHx8IF9pc01pblZhbHVlKCkgJiYgX2dldFRodW1iR2FwKCkgJiYgX3Nob3VsZEludmVydEF4aXMoKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnY29sb3InLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlciBleHRlbmRzIF9NYXRTbGlkZXJCYXNlXG4gICAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95LCBDYW5EaXNhYmxlLCBDYW5Db2xvciwgQWZ0ZXJWaWV3SW5pdCwgSGFzVGFiSW5kZXgge1xuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGludmVydGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaW52ZXJ0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW52ZXJ0OyB9XG4gIHNldCBpbnZlcnQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbnZlcnQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ludmVydCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX21pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21pbik7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21pbjogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIHZhbHVlcyBhdCB3aGljaCB0aGUgdGh1bWIgd2lsbCBzbmFwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RlcCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc3RlcDsgfVxuICBzZXQgc3RlcCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9zdGVwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fc3RlcCk7XG5cbiAgICBpZiAodGhpcy5fc3RlcCAlIDEgIT09IDApIHtcbiAgICAgIHRoaXMuX3JvdW5kVG9EZWNpbWFsID0gdGhpcy5fc3RlcC50b1N0cmluZygpLnNwbGl0KCcuJykucG9wKCkhLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGlzIGNvdWxkIG1vZGlmeSB0aGUgbGFiZWwsIHdlIG5lZWQgdG8gbm90aWZ5IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX3N0ZXA6IG51bWJlciA9IDE7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIHNob3cgdGhlIHRodW1iIGxhYmVsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdGh1bWJMYWJlbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3RodW1iTGFiZWw7IH1cbiAgc2V0IHRodW1iTGFiZWwodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fdGh1bWJMYWJlbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfdGh1bWJMYWJlbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gc2hvdyB0aWNrcy4gUmVsYXRpdmUgdG8gdGhlIHN0ZXAgc28gdGhhdCBhIHRpY2sgYWx3YXlzIGFwcGVhcnMgb24gYSBzdGVwLlxuICAgKiBFeDogVGljayBpbnRlcnZhbCBvZiA0IHdpdGggYSBzdGVwIG9mIDMgd2lsbCBkcmF3IGEgdGljayBldmVyeSA0IHN0ZXBzIChldmVyeSAxMiB2YWx1ZXMpLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRpY2tJbnRlcnZhbCgpIHsgcmV0dXJuIHRoaXMuX3RpY2tJbnRlcnZhbDsgfVxuICBzZXQgdGlja0ludGVydmFsKHZhbHVlOiAnYXV0bycgfCBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgPT09ICdhdXRvJykge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gJ2F1dG8nO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgdGhpcy5fdGlja0ludGVydmFsIGFzIG51bWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IDA7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3RpY2tJbnRlcnZhbDogJ2F1dG8nIHwgbnVtYmVyID0gMDtcblxuICAvKiogVmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7XG4gICAgLy8gSWYgdGhlIHZhbHVlIG5lZWRzIHRvIGJlIHJlYWQgYW5kIGl0IGlzIHN0aWxsIHVuaW5pdGlhbGl6ZWQsIGluaXRpYWxpemUgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZSBhcyBudW1iZXI7XG4gIH1cbiAgc2V0IHZhbHVlKHY6IG51bWJlcikge1xuICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgbGV0IHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgMCk7XG5cbiAgICAgIC8vIFdoaWxlIGluY3JlbWVudGluZyBieSBhIGRlY2ltYWwgd2UgY2FuIGVuZCB1cCB3aXRoIHZhbHVlcyBsaWtlIDMzLjMwMDAwMDAwMDAwMDAwNC5cbiAgICAgIC8vIFRydW5jYXRlIGl0IHRvIGVuc3VyZSB0aGF0IGl0IG1hdGNoZXMgdGhlIGxhYmVsIGFuZCB0byBtYWtlIGl0IGVhc2llciB0byB3b3JrIHdpdGguXG4gICAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwgJiYgdmFsdWUgIT09IHRoaXMubWluICYmIHZhbHVlICE9PSB0aGlzLm1heCkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBUZXh0IGNvcnJlc3BvbmRpbmcgdG8gdGhlIHNsaWRlcidzIHZhbHVlLiBVc2VkIHByaW1hcmlseSBmb3IgaW1wcm92ZWQgYWNjZXNzaWJpbGl0eS4gKi9cbiAgQElucHV0KCkgdmFsdWVUZXh0OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyB2ZXJ0aWNhbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZlcnRpY2FsKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdmVydGljYWw7IH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdmVydGljYWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3ZlcnRpY2FsID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBtb3Zlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGlucHV0OiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNsaWRlciBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlciB8IG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPigpO1xuXG4gIC8qKiBUaGUgdmFsdWUgdG8gYmUgdXNlZCBmb3IgZGlzcGxheSBwdXJwb3Nlcy4gKi9cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgIGlmICh0aGlzLmRpc3BsYXlXaXRoKSB7XG4gICAgICAvLyBWYWx1ZSBpcyBuZXZlciBudWxsIGJ1dCBzaW5jZSBzZXR0ZXJzIGFuZCBnZXR0ZXJzIGNhbm5vdCBoYXZlXG4gICAgICAvLyBkaWZmZXJlbnQgdHlwZXMsIHRoZSB2YWx1ZSBnZXR0ZXIgaXMgYWxzbyB0eXBlZCB0byByZXR1cm4gbnVsbC5cbiAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlXaXRoKHRoaXMudmFsdWUhKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBjb3VsZCBiZSBpbXByb3ZlZCBmdXJ0aGVyIGJ5IHJvdW5kaW5nIHNvbWV0aGluZyBsaWtlIDAuOTk5IHRvIDEgb3JcbiAgICAvLyAwLjg5OSB0byAwLjksIGhvd2V2ZXIgaXQgaXMgdmVyeSBwZXJmb3JtYW5jZSBzZW5zaXRpdmUsIGJlY2F1c2UgaXQgZ2V0cyBjYWxsZWQgb25cbiAgICAvLyBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmICh0aGlzLl9yb3VuZFRvRGVjaW1hbCAmJiB0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUgJSAxICE9PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS50b0ZpeGVkKHRoaXMuX3JvdW5kVG9EZWNpbWFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZSB8fCAwO1xuICB9XG5cbiAgLyoqIHNldCBmb2N1cyB0byB0aGUgaG9zdCBlbGVtZW50ICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIGJsdXIgdGhlIGhvc3QgZWxlbWVudCAqL1xuICBibHVyKCkge1xuICAgIHRoaXMuX2JsdXJIb3N0RWxlbWVudCgpO1xuICB9XG5cbiAgLyoqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuICovXG4gIG9uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgLyoqIFRoZSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgdGhhdCBjb2luY2lkZXMgd2l0aCB0aGUgdmFsdWUuICovXG4gIGdldCBwZXJjZW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jbGFtcCh0aGlzLl9wZXJjZW50KTsgfVxuICBwcml2YXRlIF9wZXJjZW50OiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdGh1bWIgaXMgc2xpZGluZyBhbmQgd2hhdCB0aGUgdXNlciBpcyB1c2luZyB0byBzbGlkZSBpdCB3aXRoLlxuICAgKiBVc2VkIHRvIGRldGVybWluZSBpZiB0aGVyZSBzaG91bGQgYmUgYSB0cmFuc2l0aW9uIGZvciB0aGUgdGh1bWIgYW5kIGZpbGwgdHJhY2suXG4gICAqL1xuICBfaXNTbGlkaW5nOiAna2V5Ym9hcmQnIHwgJ3BvaW50ZXInIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBzbGlkZXIgaXMgYWN0aXZlIChjbGlja2VkIG9yIHNsaWRpbmcpLlxuICAgKiBVc2VkIHRvIHNocmluayBhbmQgZ3JvdyB0aGUgdGh1bWIgYXMgYWNjb3JkaW5nIHRvIHRoZSBNYXRlcmlhbCBEZXNpZ24gc3BlYy5cbiAgICovXG4gIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBheGlzIG9mIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQuXG4gICAqIChpLmUuIHdoZXRoZXIgbW92aW5nIHRoZSB0aHVtYiBpbiB0aGUgcG9zaXRpdmUgeCBvciB5IGRpcmVjdGlvbiBkZWNyZWFzZXMgdGhlIHNsaWRlcidzIHZhbHVlKS5cbiAgICovXG4gIF9zaG91bGRJbnZlcnRBeGlzKCkge1xuICAgIC8vIFN0YW5kYXJkIG5vbi1pbnZlcnRlZCBtb2RlIGZvciBhIHZlcnRpY2FsIHNsaWRlciBzaG91bGQgYmUgZHJhZ2dpbmcgdGhlIHRodW1iIGZyb20gYm90dG9tIHRvXG4gICAgLy8gdG9wLiBIb3dldmVyIGZyb20gYSB5LWF4aXMgc3RhbmRwb2ludCB0aGlzIGlzIGludmVydGVkLlxuICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gIXRoaXMuaW52ZXJ0IDogdGhpcy5pbnZlcnQ7XG4gIH1cblxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG4gIF9pc01pblZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnBlcmNlbnQgPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiBzcGFjZSB0byBsZWF2ZSBiZXR3ZWVuIHRoZSBzbGlkZXIgdGh1bWIgYW5kIHRoZSB0cmFjayBmaWxsICYgdHJhY2sgYmFja2dyb3VuZFxuICAgKiBlbGVtZW50cy5cbiAgICovXG4gIF9nZXRUaHVtYkdhcCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIERJU0FCTEVEX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUoKSAmJiAhdGhpcy50aHVtYkxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNBY3RpdmUgPyBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA6IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgYmFja2dyb3VuZCBlbGVtZW50LiAqL1xuICBfZ2V0VHJhY2tCYWNrZ3JvdW5kU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAkezEgLSB0aGlzLnBlcmNlbnR9LCAxYCA6IGAkezEgLSB0aGlzLnBlcmNlbnR9LCAxLCAxYDtcbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICctJyA6ICcnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX2dldFRodW1iR2FwKCl9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGZpbGwgZWxlbWVudC4gKi9cbiAgX2dldFRyYWNrRmlsbFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAke3BlcmNlbnR9LCAxYCA6IGAke3BlcmNlbnR9LCAxLCAxYDtcbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICcnIDogJy0nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX2dldFRodW1iR2FwKCl9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYCxcbiAgICAgIC8vIGlPUyBTYWZhcmkgaGFzIGEgYnVnIHdoZXJlIGl0IHdvbid0IHJlLXJlbmRlciBlbGVtZW50cyB3aGljaCBzdGFydCBvZiBhcyBgc2NhbGUoMClgIHVudGlsXG4gICAgICAvLyBzb21ldGhpbmcgZm9yY2VzIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBvbiBpdC4gU2luY2Ugd2UnbGwgZW5kIHVwIHdpdGggYHNjYWxlKDApYCB3aGVuXG4gICAgICAvLyB0aGUgdmFsdWUgb2YgdGhlIHNsaWRlciBpcyAwLCB3ZSBjYW4gZWFzaWx5IGdldCBpbnRvIHRoaXMgc2l0dWF0aW9uLiBXZSBmb3JjZSBhXG4gICAgICAvLyByZWNhbGN1bGF0aW9uIGJ5IGNoYW5naW5nIHRoZSBlbGVtZW50J3MgYGRpc3BsYXlgIHdoZW4gaXQgZ29lcyBmcm9tIDAgdG8gYW55IG90aGVyIHZhbHVlLlxuICAgICAgZGlzcGxheTogcGVyY2VudCA9PT0gMCA/ICdub25lJyA6ICcnXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdGlja3MgY29udGFpbmVyIGVsZW1lbnQuICovXG4gIF9nZXRUaWNrc0NvbnRhaW5lclN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRm9yIGEgaG9yaXpvbnRhbCBzbGlkZXIgaW4gUlRMIGxhbmd1YWdlcyB3ZSBwdXNoIHRoZSB0aWNrcyBjb250YWluZXIgb2ZmIHRoZSBsZWZ0IGVkZ2VcbiAgICAvLyBpbnN0ZWFkIG9mIHRoZSByaWdodCBlZGdlIHRvIGF2b2lkIGNhdXNpbmcgYSBob3Jpem9udGFsIHNjcm9sbGJhciB0byBhcHBlYXIuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcnIDogJy0nO1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50IC8gMiAqIDEwMDtcbiAgICByZXR1cm4ge1xuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke29mZnNldH0lKWBcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0aWNrcyBlbGVtZW50LiAqL1xuICBfZ2V0VGlja3NTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IHRpY2tTaXplID0gdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCAqIDEwMDtcbiAgICBsZXQgYmFja2dyb3VuZFNpemUgPSB0aGlzLnZlcnRpY2FsID8gYDJweCAke3RpY2tTaXplfSVgIDogYCR7dGlja1NpemV9JSAycHhgO1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiB3ZSBwdXNoZWQgdGhlIHRpY2tzIGNvbnRhaW5lciwgcHVzaCB0aGUgdGlja3MgdGhlIG9wcG9zaXRlXG4gICAgLy8gZGlyZWN0aW9uIHRvIHJlLWNlbnRlciB0aGVtIGJ1dCBjbGlwIG9mZiB0aGUgZW5kIGVkZ2UuIEluIFJUTCBsYW5ndWFnZXMgd2UgbmVlZCB0byBmbGlwIHRoZVxuICAgIC8vIHRpY2tzIDE4MCBkZWdyZWVzIHNvIHdlJ3JlIHJlYWxseSBjdXR0aW5nIG9mZiB0aGUgZW5kIGVkZ2UgYWJkIG5vdCB0aGUgc3RhcnQuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICctJyA6ICcnO1xuICAgIGxldCByb3RhdGUgPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcgcm90YXRlKDE4MGRlZyknIDogJyc7XG4gICAgbGV0IHN0eWxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IGJhY2tncm91bmRTaXplLFxuICAgICAgLy8gV2l0aG91dCB0cmFuc2xhdGVaIHRpY2tzIHNvbWV0aW1lcyBqaXR0ZXIgYXMgdGhlIHNsaWRlciBtb3ZlcyBvbiBDaHJvbWUgJiBGaXJlZm94LlxuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSgpICYmIHRoaXMuX2dldFRodW1iR2FwKCkpIHtcbiAgICAgIGNvbnN0IHNob3VsZEludmVydEF4aXMgPSB0aGlzLl9zaG91bGRJbnZlcnRBeGlzKCk7XG4gICAgICBsZXQgc2lkZTogc3RyaW5nO1xuXG4gICAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICBzaWRlID0gc2hvdWxkSW52ZXJ0QXhpcyA/ICdCb3R0b20nIDogJ1RvcCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaWRlID0gc2hvdWxkSW52ZXJ0QXhpcyA/ICdSaWdodCcgOiAnTGVmdCc7XG4gICAgICB9XG5cbiAgICAgIHN0eWxlc1tgcGFkZGluZyR7c2lkZX1gXSA9IGAke3RoaXMuX2dldFRodW1iR2FwKCl9cHhgO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICBfZ2V0VGh1bWJDb250YWluZXJTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3Qgc2hvdWxkSW52ZXJ0QXhpcyA9IHRoaXMuX3Nob3VsZEludmVydEF4aXMoKTtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRm9yIGEgaG9yaXpvbnRhbCBzbGlkZXIgaW4gUlRMIGxhbmd1YWdlcyB3ZSBwdXNoIHRoZSB0aHVtYiBjb250YWluZXIgb2ZmIHRoZSBsZWZ0IGVkZ2VcbiAgICAvLyBpbnN0ZWFkIG9mIHRoZSByaWdodCBlZGdlIHRvIGF2b2lkIGNhdXNpbmcgYSBob3Jpem9udGFsIHNjcm9sbGJhciB0byBhcHBlYXIuXG4gICAgbGV0IGludmVydE9mZnNldCA9XG4gICAgICAgICh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCkgPyAhc2hvdWxkSW52ZXJ0QXhpcyA6IHNob3VsZEludmVydEF4aXM7XG4gICAgbGV0IG9mZnNldCA9IChpbnZlcnRPZmZzZXQgPyB0aGlzLnBlcmNlbnQgOiAxIC0gdGhpcy5wZXJjZW50KSAqIDEwMDtcbiAgICByZXR1cm4ge1xuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGUke2F4aXN9KC0ke29mZnNldH0lKWBcbiAgICB9O1xuICB9XG5cbiAgLyoqIFRoZSBzaXplIG9mIGEgdGljayBpbnRlcnZhbCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNpemUgb2YgdGhlIHRyYWNrLiAqL1xuICBwcml2YXRlIF90aWNrSW50ZXJ2YWxQZXJjZW50OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9zbGlkZXJEaW1lbnNpb25zOiBDbGllbnRSZWN0IHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbjogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogRGVjaW1hbCBwbGFjZXMgdG8gcm91bmQgdG8sIGJhc2VkIG9uIHRoZSBzdGVwIGFtb3VudC4gKi9cbiAgcHJpdmF0ZSBfcm91bmRUb0RlY2ltYWw6IG51bWJlcjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRoZSBEaXJlY3Rpb25hbGl0eSBjaGFuZ2UgRXZlbnRFbWl0dGVyLiAqL1xuICBwcml2YXRlIF9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIHdoZW4gdGhlIHNsaWRlIHN0YXJ0IGV2ZW50IGZpcmVzLiAqL1xuICBwcml2YXRlIF92YWx1ZU9uU2xpZGVTdGFydDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbm5lciBzbGlkZXIgd3JhcHBlciBlbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCdzbGlkZXJXcmFwcGVyJykgcHJpdmF0ZSBfc2xpZGVyV3JhcHBlcjogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogV2hldGhlciBtb3VzZSBldmVudHMgc2hvdWxkIGJlIGNvbnZlcnRlZCB0byBhIHNsaWRlciBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGVpciBkaXN0YW5jZVxuICAgKiBmcm9tIHRoZSByaWdodCBvciBib3R0b20gZWRnZSBvZiB0aGUgc2xpZGVyIGFzIG9wcG9zZWQgdG8gdGhlIHRvcCBvciBsZWZ0LlxuICAgKi9cbiAgX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkge1xuICAgIGNvbnN0IHNob3VsZEludmVydEF4aXMgPSB0aGlzLl9zaG91bGRJbnZlcnRBeGlzKCk7XG4gICAgcmV0dXJuICh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCkgPyAhc2hvdWxkSW52ZXJ0QXhpcyA6IHNob3VsZEludmVydEF4aXM7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PSAncnRsJykgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBsYXN0IHBvaW50ZXIgZXZlbnQgdGhhdCB3YXMgY2FwdHVyZWQgYnkgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfbGFzdFBvaW50ZXJFdmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQgfCBudWxsO1xuXG4gIC8qKiBVc2VkIHRvIHN1YnNjcmliZSB0byBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cyAqL1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKipcbiAgICogSWRlbnRpZmllciB1c2VkIHRvIGF0dHJpYnV0ZSBhIHRvdWNoIGV2ZW50IHRvIGEgcGFydGljdWxhciBzbGlkZXIuXG4gICAqIFdpbGwgYmUgdW5kZWZpbmVkIGlmIG9uZSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgaXMgdHJ1ZTpcbiAgICogLSBUaGUgdXNlciBpc24ndCBkcmFnZ2luZyB1c2luZyBhIHRvdWNoIGRldmljZS5cbiAgICogLSBUaGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYFRvdWNoLmlkZW50aWZpZXJgLlxuICAgKiAtIERyYWdnaW5nIGhhc24ndCBzdGFydGVkIHlldC5cbiAgICovXG4gIHByaXZhdGUgX3RvdWNoSWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcblxuICAgIF9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3JcbiAgICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgICAgLnN1YnNjcmliZSgob3JpZ2luOiBGb2N1c09yaWdpbikgPT4ge1xuICAgICAgICAgIHRoaXMuX2lzQWN0aXZlID0gISFvcmlnaW4gJiYgb3JpZ2luICE9PSAna2V5Ym9hcmQnO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgaWYgKHRoaXMuX2Rpcikge1xuICAgICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBfb25Nb3VzZWVudGVyKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBoYXNNb2RpZmllcktleShldmVudCkgfHxcbiAgICAgICAgKHRoaXMuX2lzU2xpZGluZyAmJiB0aGlzLl9pc1NsaWRpbmcgIT09ICdrZXlib2FyZCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIFBBR0VfVVA6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgtMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICAvLyBOT1RFOiBGb3IgYSBzaWdodGVkIHVzZXIgaXQgd291bGQgbWFrZSBtb3JlIHNlbnNlIHRoYXQgd2hlbiB0aGV5IHByZXNzIGFuIGFycm93IGtleSBvbiBhblxuICAgICAgICAvLyBpbnZlcnRlZCBzbGlkZXIgdGhlIHRodW1iIG1vdmVzIGluIHRoYXQgZGlyZWN0aW9uLiBIb3dldmVyIGZvciBhIGJsaW5kIHVzZXIsIG5vdGhpbmdcbiAgICAgICAgLy8gYWJvdXQgdGhlIHNsaWRlciBpbmRpY2F0ZXMgdGhhdCBpdCBpcyBpbnZlcnRlZC4gVGhleSB3aWxsIGV4cGVjdCBsZWZ0IHRvIGJlIGRlY3JlbWVudCxcbiAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiBob3cgaXQgYXBwZWFycyBvbiB0aGUgc2NyZWVuLiBGb3Igc3BlYWtlcnMgb2ZSVEwgbGFuZ3VhZ2VzLCB0aGV5IHByb2JhYmx5XG4gICAgICAgIC8vIGV4cGVjdCBsZWZ0IHRvIG1lYW4gaW5jcmVtZW50LiBUaGVyZWZvcmUgd2UgZmxpcCB0aGUgbWVhbmluZyBvZiB0aGUgc2lkZSBhcnJvdyBrZXlzIGZvclxuICAgICAgICAvLyBSVEwuIEZvciBpbnZlcnRlZCBzbGlkZXJzIHdlIHByZWZlciBhIGdvb2QgYTExeSBleHBlcmllbmNlIHRvIGhhdmluZyBpdCBcImxvb2sgcmlnaHRcIiBmb3JcbiAgICAgICAgLy8gc2lnaHRlZCB1c2VycywgdGhlcmVmb3JlIHdlIGRvIG5vdCBzd2FwIHRoZSBtZWFuaW5nLlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICAvLyBTZWUgY29tbWVudCBvbiBMRUZUX0FSUk9XIGFib3V0IHRoZSBjb25kaXRpb25zIHVuZGVyIHdoaWNoIHdlIGZsaXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/IC0xIDogMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIFJldHVybiBpZiB0aGUga2V5IGlzIG5vdCBvbmUgdGhhdCB3ZSBleHBsaWNpdGx5IGhhbmRsZSB0byBhdm9pZCBjYWxsaW5nIHByZXZlbnREZWZhdWx0IG9uXG4gICAgICAgIC8vIGl0LlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1NsaWRpbmcgPSAna2V5Ym9hcmQnO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBfb25LZXl1cCgpIHtcbiAgICBpZiAodGhpcy5faXNTbGlkaW5nID09PSAna2V5Ym9hcmQnKSB7XG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgcHV0IHRoZWlyIHBvaW50ZXIgZG93biBvbiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9wb2ludGVyRG93biA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiB0aGUgc2xpZGVyIGlzIGRpc2FibGVkIG9yIHRoZVxuICAgIC8vIHVzZXIgaXMgdXNpbmcgYW55dGhpbmcgb3RoZXIgdGhhbiB0aGUgbWFpbiBtb3VzZSBidXR0b24uXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5faXNTbGlkaW5nIHx8ICghaXNUb3VjaEV2ZW50KGV2ZW50KSAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLl90b3VjaElkID0gaXNUb3VjaEV2ZW50KGV2ZW50KSA/XG4gICAgICAgICAgZ2V0VG91Y2hJZEZvclNsaWRlcihldmVudCwgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCwgdGhpcy5fdG91Y2hJZCk7XG5cbiAgICAgIGlmIChwb2ludGVyUG9zaXRpb24pIHtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLl9pc1NsaWRpbmcgPSAncG9pbnRlcic7XG4gICAgICAgIHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBldmVudDtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuICAgICAgICB0aGlzLl9vbk1vdXNlZW50ZXIoKTsgLy8gU2ltdWxhdGUgbW91c2VlbnRlciBpbiBjYXNlIHRoaXMgaXMgYSBtb2JpbGUgZGV2aWNlLlxuICAgICAgICB0aGlzLl9iaW5kR2xvYmFsRXZlbnRzKGV2ZW50KTtcbiAgICAgICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihwb2ludGVyUG9zaXRpb24pO1xuICAgICAgICB0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCA9IG9sZFZhbHVlO1xuXG4gICAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgYW5kIGlucHV0IGV2ZW50IGlmIHRoZSB2YWx1ZSBjaGFuZ2VkLlxuICAgICAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbW92ZWQgdGhlaXIgcG9pbnRlciBhZnRlclxuICAgKiBzdGFydGluZyB0byBkcmFnLiBCb3VuZCBvbiB0aGUgZG9jdW1lbnQgbGV2ZWwuXG4gICAqL1xuICBwcml2YXRlIF9wb2ludGVyTW92ZSA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5faXNTbGlkaW5nID09PSAncG9pbnRlcicpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCwgdGhpcy5fdG91Y2hJZCk7XG5cbiAgICAgIGlmIChwb2ludGVyUG9zaXRpb24pIHtcbiAgICAgICAgLy8gUHJldmVudCB0aGUgc2xpZGUgZnJvbSBzZWxlY3RpbmcgYW55dGhpbmcgZWxzZS5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gZXZlbnQ7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvaW50ZXJQb3NpdGlvbik7XG5cbiAgICAgICAgLy8gTmF0aXZlIHJhbmdlIGVsZW1lbnRzIGFsd2F5cyBlbWl0IGBpbnB1dGAgZXZlbnRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZWQgd2hpbGUgc2xpZGluZy5cbiAgICAgICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBsaWZ0ZWQgdGhlaXIgcG9pbnRlci4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXAgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZyA9PT0gJ3BvaW50ZXInKSB7XG4gICAgICBpZiAoIWlzVG91Y2hFdmVudChldmVudCkgfHwgdHlwZW9mIHRoaXMuX3RvdWNoSWQgIT09ICdudW1iZXInIHx8XG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHdlIHVzZSBgY2hhbmdlZFRvdWNoZXNgLCByYXRoZXIgdGhhbiBgdG91Y2hlc2AgYmVjYXVzZSBpdFxuICAgICAgICAgIC8vIHNlZW1zIGxpa2UgaW4gbW9zdCBjYXNlcyBgdG91Y2hlc2AgaXMgZW1wdHkgZm9yIGB0b3VjaGVuZGAgZXZlbnRzLlxuICAgICAgICAgIGZpbmRNYXRjaGluZ1RvdWNoKGV2ZW50LmNoYW5nZWRUb3VjaGVzLCB0aGlzLl90b3VjaElkKSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdG91Y2hJZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgIT0gdGhpcy52YWx1ZSAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBoYXMgbG9zdCBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgd2luZG93IGlzIGJsdXJyZWQgd2hpbGUgZHJhZ2dpbmcgd2UgbmVlZCB0byBzdG9wIGRyYWdnaW5nIGJlY2F1c2UgdGhlXG4gICAgLy8gYnJvd3NlciB3b24ndCBkaXNwYXRjaCB0aGUgYG1vdXNldXBgIGFuZCBgdG91Y2hlbmRgIGV2ZW50cyBhbnltb3JlLlxuICAgIGlmICh0aGlzLl9sYXN0UG9pbnRlckV2ZW50KSB7XG4gICAgICB0aGlzLl9wb2ludGVyVXAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBvdXIgZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMuIFRoZXkncmUgYm91bmQgYXQgdGhlIGRvY3VtZW50IGxldmVsIGFuZCBvbmx5IHdoaWxlXG4gICAqIGRyYWdnaW5nIHNvIHRoYXQgdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIGtlZXAgdGhlaXIgcG9pbnRlciBleGFjdGx5IG92ZXIgdGhlIHNsaWRlclxuICAgKiBhcyB0aGV5J3JlIHN3aXBpbmcgYWNyb3NzIHRoZSBzY3JlZW4uXG4gICAqL1xuICBwcml2YXRlIF9iaW5kR2xvYmFsRXZlbnRzKHRyaWdnZXJFdmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgYmluZCB0aGUgZXZlbnRzIHRvIHRoZSBgZG9jdW1lbnRgLCBiZWNhdXNlIGl0IGFsbG93cyB1cyB0byBjYXB0dXJlXG4gICAgLy8gZHJhZyBjYW5jZWwgZXZlbnRzIHdoZXJlIHRoZSB1c2VyJ3MgcG9pbnRlciBpcyBvdXRzaWRlIHRoZSBicm93c2VyIHdpbmRvdy5cbiAgICBjb25zdCBkb2N1bWVudCA9IHRoaXMuX2RvY3VtZW50O1xuICAgIGNvbnN0IGlzVG91Y2ggPSBpc1RvdWNoRXZlbnQodHJpZ2dlckV2ZW50KTtcbiAgICBjb25zdCBtb3ZlRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZSc7XG4gICAgY29uc3QgZW5kRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCc7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnROYW1lLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbnkgZ2xvYmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlIG1heSBoYXZlIGFkZGVkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVHbG9iYWxFdmVudHMoKSB7XG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9kb2N1bWVudDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbmNyZW1lbnRzIHRoZSBzbGlkZXIgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBzdGVwcyAobmVnYXRpdmUgbnVtYmVyIGRlY3JlbWVudHMpLiAqL1xuICBwcml2YXRlIF9pbmNyZW1lbnQobnVtU3RlcHM6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcCgodGhpcy52YWx1ZSB8fCAwKSArIHRoaXMuc3RlcCAqIG51bVN0ZXBzLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbmV3IHZhbHVlIGZyb20gdGhlIG5ldyBwaHlzaWNhbCBsb2NhdGlvbi4gVGhlIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHNuYXBwZWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvczoge3g6IG51bWJlciwgeTogbnVtYmVyfSkge1xuICAgIGlmICghdGhpcy5fc2xpZGVyRGltZW5zaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy50b3AgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmxlZnQ7XG4gICAgbGV0IHNpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgIGxldCBwb3NDb21wb25lbnQgPSB0aGlzLnZlcnRpY2FsID8gcG9zLnkgOiBwb3MueDtcblxuICAgIC8vIFRoZSBleGFjdCB2YWx1ZSBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIGV2ZW50IGFuZCB1c2VkIHRvIGZpbmQgdGhlIGNsb3Nlc3Qgc25hcCB2YWx1ZS5cbiAgICBsZXQgcGVyY2VudCA9IHRoaXMuX2NsYW1wKChwb3NDb21wb25lbnQgLSBvZmZzZXQpIC8gc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSkge1xuICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBzdGVwcyBtYXkgbm90IGRpdmlkZSBjbGVhbmx5IGludG8gdGhlIG1heCB2YWx1ZSwgaWYgdGhlIHVzZXJcbiAgICAvLyBzbGlkIHRvIDAgb3IgMTAwIHBlcmNlbnQsIHdlIGp1bXAgdG8gdGhlIG1pbi9tYXggdmFsdWUuIFRoaXMgYXBwcm9hY2hcbiAgICAvLyBpcyBzbGlnaHRseSBtb3JlIGludHVpdGl2ZSB0aGFuIHVzaW5nIGBNYXRoLmNlaWxgIGJlbG93LCBiZWNhdXNlIGl0XG4gICAgLy8gZm9sbG93cyB0aGUgdXNlcidzIHBvaW50ZXIgY2xvc2VyLlxuICAgIGlmIChwZXJjZW50ID09PSAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgfSBlbHNlIGlmIChwZXJjZW50ID09PSAxKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4YWN0VmFsdWUgPSB0aGlzLl9jYWxjdWxhdGVWYWx1ZShwZXJjZW50KTtcblxuICAgICAgLy8gVGhpcyBjYWxjdWxhdGlvbiBmaW5kcyB0aGUgY2xvc2VzdCBzdGVwIGJ5IGZpbmRpbmcgdGhlIGNsb3Nlc3RcbiAgICAgIC8vIHdob2xlIG51bWJlciBkaXZpc2libGUgYnkgdGhlIHN0ZXAgcmVsYXRpdmUgdG8gdGhlIG1pbi5cbiAgICAgIGNvbnN0IGNsb3Nlc3RWYWx1ZSA9IE1hdGgucm91bmQoKGV4YWN0VmFsdWUgLSB0aGlzLm1pbikgLyB0aGlzLnN0ZXApICogdGhpcy5zdGVwICsgdGhpcy5taW47XG5cbiAgICAgIC8vIFRoZSB2YWx1ZSBuZWVkcyB0byBzbmFwIHRvIHRoZSBtaW4gYW5kIG1heC5cbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcChjbG9zZXN0VmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGlucHV0IGV2ZW50IHdoZW4gdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdElucHV0RXZlbnQoKSB7XG4gICAgdGhpcy5pbnB1dC5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpY2tzIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGggb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpIHtcbiAgICBpZiAoIXRoaXMudGlja0ludGVydmFsIHx8ICF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGlja0ludGVydmFsID09ICdhdXRvJykge1xuICAgICAgbGV0IHRyYWNrU2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgICBsZXQgcGl4ZWxzUGVyU3RlcCA9IHRyYWNrU2l6ZSAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgIGxldCBzdGVwc1BlclRpY2sgPSBNYXRoLmNlaWwoTUlOX0FVVE9fVElDS19TRVBBUkFUSU9OIC8gcGl4ZWxzUGVyU3RlcCk7XG4gICAgICBsZXQgcGl4ZWxzUGVyVGljayA9IHN0ZXBzUGVyVGljayAqIHRoaXMuc3RlcDtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSBwaXhlbHNQZXJUaWNrIC8gdHJhY2tTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gdGhpcy50aWNrSW50ZXJ2YWwgKiB0aGlzLnN0ZXAgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBzbGlkZXIgY2hhbmdlIG9iamVjdCBmcm9tIHRoZSBzcGVjaWZpZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KHZhbHVlID0gdGhpcy52YWx1ZSk6IE1hdFNsaWRlckNoYW5nZSB7XG4gICAgbGV0IGV2ZW50ID0gbmV3IE1hdFNsaWRlckNoYW5nZSgpO1xuXG4gICAgZXZlbnQuc291cmNlID0gdGhpcztcbiAgICBldmVudC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGEgdmFsdWUgaXMuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWU6IG51bWJlciB8IG51bGwpIHtcbiAgICByZXR1cm4gKCh2YWx1ZSB8fCAwKSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSB2YWx1ZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciBjb3JyZXNwb25kcyB0by4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlVmFsdWUocGVyY2VudGFnZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMubWluICsgcGVyY2VudGFnZSAqICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBudW1iZXIgYmV0d2VlbiB0d28gbnVtYmVycy4gKi9cbiAgcHJpdmF0ZSBfY2xhbXAodmFsdWU6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMSkge1xuICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIHRoZSBzbGlkZXIgdHJhY2sgZWxlbWVudC5cbiAgICogVGhlIHRyYWNrIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlIG5hdGl2ZSBlbGVtZW50IHRvIGlnbm9yZSB0aGUgZXh0cmEgc3BhY2UgdGhhdCB0aGUgdGh1bWIgY2FuXG4gICAqIHRha2UgdXAuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTbGlkZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXJXcmFwcGVyID8gdGhpcy5fc2xpZGVyV3JhcHBlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICogQ3VycmVudGx5IG9ubHkgdXNlZCB0byBhbGxvdyBhIGJsdXIgZXZlbnQgdG8gZmlyZSBidXQgd2lsbCBiZSB1c2VkIHdpdGgga2V5Ym9hcmQgaW5wdXQgbGF0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9ibHVySG9zdEVsZW1lbnQoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbnZlcnQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21heDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9taW46IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RlcDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aHVtYkxhYmVsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aWNrSW50ZXJ2YWw6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmVydGljYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90YWJJbmRleDogTnVtYmVySW5wdXQ7XG59XG5cbi8qKiBSZXR1cm5zIHdoZXRoZXIgYW4gZXZlbnQgaXMgYSB0b3VjaCBldmVudC4gKi9cbmZ1bmN0aW9uIGlzVG91Y2hFdmVudChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBldmVudCBpcyBUb3VjaEV2ZW50IHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIGV2ZXJ5IHBpeGVsIHRoYXQgdGhlIHVzZXIgaGFzIGRyYWdnZWQgc28gd2UgbmVlZCBpdCB0byBiZVxuICAvLyBhcyBmYXN0IGFzIHBvc3NpYmxlLiBTaW5jZSB3ZSBvbmx5IGJpbmQgbW91c2UgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMsIHdlIGNhbiBhc3N1bWVcbiAgLy8gdGhhdCBpZiB0aGUgZXZlbnQncyBuYW1lIHN0YXJ0cyB3aXRoIGB0YCwgaXQncyBhIHRvdWNoIGV2ZW50LlxuICByZXR1cm4gZXZlbnQudHlwZVswXSA9PT0gJ3QnO1xufVxuXG4vKiogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYSB0b3VjaCBvciBtb3VzZSBldmVudCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuICovXG5mdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBpZDogbnVtYmVyfHVuZGVmaW5lZCkge1xuICBsZXQgcG9pbnQ6IHtjbGllbnRYOiBudW1iZXIsIGNsaWVudFk6IG51bWJlcn18dW5kZWZpbmVkO1xuXG4gIGlmIChpc1RvdWNoRXZlbnQoZXZlbnQpKSB7XG4gICAgLy8gVGhlIGBpZGVudGlmaWVyYCBjb3VsZCBiZSB1bmRlZmluZWQgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGBUb3VjaEV2ZW50LmlkZW50aWZpZXJgLlxuICAgIC8vIElmIHRoYXQncyB0aGUgY2FzZSwgYXR0cmlidXRlIHRoZSBmaXJzdCB0b3VjaCB0byBhbGwgYWN0aXZlIHNsaWRlcnMuIFRoaXMgc2hvdWxkIHN0aWxsIGNvdmVyXG4gICAgLy8gdGhlIG1vc3QgY29tbW9uIGNhc2Ugd2hpbGUgb25seSBicmVha2luZyBtdWx0aS10b3VjaC5cbiAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJykge1xuICAgICAgcG9pbnQgPSBmaW5kTWF0Y2hpbmdUb3VjaChldmVudC50b3VjaGVzLCBpZCkgfHwgZmluZE1hdGNoaW5nVG91Y2goZXZlbnQuY2hhbmdlZFRvdWNoZXMsIGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYHRvdWNoZXNgIHdpbGwgYmUgZW1wdHkgZm9yIHN0YXJ0L2VuZCBldmVudHMgc28gd2UgaGF2ZSB0byBmYWxsIGJhY2sgdG8gYGNoYW5nZWRUb3VjaGVzYC5cbiAgICAgIHBvaW50ID0gZXZlbnQudG91Y2hlc1swXSB8fCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcG9pbnQgPSBldmVudDtcbiAgfVxuXG4gIHJldHVybiBwb2ludCA/IHt4OiBwb2ludC5jbGllbnRYLCB5OiBwb2ludC5jbGllbnRZfSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqIEZpbmRzIGEgYFRvdWNoYCB3aXRoIGEgc3BlY2lmaWMgSUQgaW4gYSBgVG91Y2hMaXN0YC4gKi9cbmZ1bmN0aW9uIGZpbmRNYXRjaGluZ1RvdWNoKHRvdWNoZXM6IFRvdWNoTGlzdCwgaWQ6IG51bWJlcik6IFRvdWNoIHwgdW5kZWZpbmVkIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRvdWNoZXNbaV0uaWRlbnRpZmllciA9PT0gaWQpIHtcbiAgICAgIHJldHVybiB0b3VjaGVzW2ldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuLyoqIEdldHMgdGhlIHVuaXF1ZSBJRCBvZiBhIHRvdWNoIHRoYXQgbWF0Y2hlcyBhIHNwZWNpZmljIHNsaWRlci4gKi9cbmZ1bmN0aW9uIGdldFRvdWNoSWRGb3JTbGlkZXIoZXZlbnQ6IFRvdWNoRXZlbnQsIHNsaWRlckhvc3Q6IEhUTUxFbGVtZW50KTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudG91Y2hlc1tpXS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoc2xpZGVySG9zdCA9PT0gdGFyZ2V0IHx8IHNsaWRlckhvc3QuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGV2ZW50LnRvdWNoZXNbaV0uaWRlbnRpZmllcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIl19