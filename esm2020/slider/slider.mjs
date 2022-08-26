/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { DOWN_ARROW, END, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, NgZone, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/common";
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
    multi: true,
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
                this._touchId = isTouchEvent(event)
                    ? getTouchIdForSlider(event, this._elementRef.nativeElement)
                    : undefined;
                const pointerPosition = getPointerPositionOnPage(event, this._touchId);
                if (pointerPosition) {
                    const oldValue = this.value;
                    this._isSliding = 'pointer';
                    this._lastPointerEvent = event;
                    this._focusHostElement();
                    this._onMouseenter(); // Simulate mouseenter in case this is a mobile device.
                    this._bindGlobalEvents(event);
                    this._focusHostElement();
                    this._updateValueFromPosition(pointerPosition);
                    this._valueOnSlideStart = oldValue;
                    // Despite the fact that we explicitly bind active events, in some cases the browser
                    // still dispatches non-cancelable events which cause this call to throw an error.
                    // There doesn't appear to be a good way of avoiding them. See #23820.
                    if (event.cancelable) {
                        event.preventDefault();
                    }
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
                    if (event.cancelable) {
                        event.preventDefault();
                    }
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
                if (!isTouchEvent(event) ||
                    typeof this._touchId !== 'number' ||
                    // Note that we use `changedTouches`, rather than `touches` because it
                    // seems like in most cases `touches` is empty for `touchend` events.
                    findMatchingTouch(event.changedTouches, this._touchId)) {
                    if (event.cancelable) {
                        event.preventDefault();
                    }
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
    get invert() {
        return this._invert;
    }
    set invert(value) {
        this._invert = coerceBooleanProperty(value);
    }
    /** The maximum value that the slider can have. */
    get max() {
        return this._max;
    }
    set max(v) {
        this._max = coerceNumberProperty(v, this._max);
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /** The minimum value that the slider can have. */
    get min() {
        return this._min;
    }
    set min(v) {
        this._min = coerceNumberProperty(v, this._min);
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /** The values at which the thumb will snap. */
    get step() {
        return this._step;
    }
    set step(v) {
        this._step = coerceNumberProperty(v, this._step);
        if (this._step % 1 !== 0) {
            this._roundToDecimal = this._step.toString().split('.').pop().length;
        }
        // Since this could modify the label, we need to notify the change detection.
        this._changeDetectorRef.markForCheck();
    }
    /** Whether or not to show the thumb label. */
    get thumbLabel() {
        return this._thumbLabel;
    }
    set thumbLabel(value) {
        this._thumbLabel = coerceBooleanProperty(value);
    }
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    get tickInterval() {
        return this._tickInterval;
    }
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
    get vertical() {
        return this._vertical;
    }
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
    get percent() {
        return this._clamp(this._percent);
    }
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
            transform: `translate${axis}(${sign}${this._getThumbGap()}px) scale3d(${scale})`,
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
            display: percent === 0 ? 'none' : '',
        };
    }
    /** CSS styles for the ticks container element. */
    _getTicksContainerStyles() {
        let axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the ticks container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        let sign = !this.vertical && this._getDirection() == 'rtl' ? '' : '-';
        let offset = (this._tickIntervalPercent / 2) * 100;
        return {
            'transform': `translate${axis}(${sign}${offset}%)`,
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
            'transform': `translateZ(0) translate${axis}(${sign}${tickSize / 2}%)${rotate}`,
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
        let invertOffset = this._getDirection() == 'rtl' && !this.vertical ? !shouldInvertAxis : shouldInvertAxis;
        let offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
        return {
            'transform': `translate${axis}(-${offset}%)`,
        };
    }
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    _shouldInvertMouseCoords() {
        const shouldInvertAxis = this._shouldInvertAxis();
        return this._getDirection() == 'rtl' && !this.vertical ? !shouldInvertAxis : shouldInvertAxis;
    }
    /** The language direction for this slider element. */
    _getDirection() {
        return this._dir && this._dir.value == 'rtl' ? 'rtl' : 'ltr';
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe((origin) => {
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
        if (this.disabled ||
            hasModifierKey(event) ||
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
        // Pre-clamp the current value since it's allowed to be
        // out of bounds when assigned programmatically.
        const clampedValue = this._clamp(this.value || 0, this.min, this.max);
        this.value = this._clamp(clampedValue + this.step * numSteps, this.min, this.max);
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
        let tickIntervalPercent;
        if (this.tickInterval == 'auto') {
            let trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            let pixelsPerStep = (trackSize * this.step) / (this.max - this.min);
            let stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            let pixelsPerTick = stepsPerTick * this.step;
            tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            tickIntervalPercent = (this.tickInterval * this.step) / (this.max - this.min);
        }
        this._tickIntervalPercent = isSafeNumber(tickIntervalPercent) ? tickIntervalPercent : 0;
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
        const percentage = ((value || 0) - this.min) / (this.max - this.min);
        return isSafeNumber(percentage) ? percentage : 0;
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
MatSlider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatSlider, deps: [{ token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i0.ChangeDetectorRef }, { token: i2.Directionality, optional: true }, { token: 'tabindex', attribute: true }, { token: i0.NgZone }, { token: DOCUMENT }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatSlider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: MatSlider, selector: "mat-slider", inputs: { disabled: "disabled", color: "color", tabIndex: "tabIndex", invert: "invert", max: "max", min: "min", step: "step", thumbLabel: "thumbLabel", tickInterval: "tickInterval", value: "value", displayWith: "displayWith", valueText: "valueText", vertical: "vertical" }, outputs: { change: "change", input: "input", valueChange: "valueChange" }, host: { attributes: { "role": "slider" }, listeners: { "focus": "_onFocus()", "blur": "_onBlur()", "keydown": "_onKeydown($event)", "keyup": "_onKeyup()", "mouseenter": "_onMouseenter()", "selectstart": "$event.preventDefault()" }, properties: { "tabIndex": "tabIndex", "attr.aria-disabled": "disabled", "attr.aria-valuemax": "max", "attr.aria-valuemin": "min", "attr.aria-valuenow": "value", "attr.aria-valuetext": "valueText == null ? displayValue : valueText", "attr.aria-orientation": "vertical ? \"vertical\" : \"horizontal\"", "class.mat-slider-disabled": "disabled", "class.mat-slider-has-ticks": "tickInterval", "class.mat-slider-horizontal": "!vertical", "class.mat-slider-axis-inverted": "_shouldInvertAxis()", "class.mat-slider-invert-mouse-coords": "_shouldInvertMouseCoords()", "class.mat-slider-sliding": "_isSliding", "class.mat-slider-thumb-label-showing": "thumbLabel", "class.mat-slider-vertical": "vertical", "class.mat-slider-min-value": "_isMinValue()", "class.mat-slider-hide-last-tick": "disabled || _isMinValue() && _getThumbGap() && _shouldInvertAxis()", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "mat-slider mat-focus-indicator" }, providers: [MAT_SLIDER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "_sliderWrapper", first: true, predicate: ["sliderWrapper"], descendants: true }], exportAs: ["matSlider"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-slider-wrapper\" #sliderWrapper>\n  <div class=\"mat-slider-track-wrapper\">\n    <div class=\"mat-slider-track-background\" [ngStyle]=\"_getTrackBackgroundStyles()\"></div>\n    <div class=\"mat-slider-track-fill\" [ngStyle]=\"_getTrackFillStyles()\"></div>\n  </div>\n  <div class=\"mat-slider-ticks-container\" [ngStyle]=\"_getTicksContainerStyles()\">\n    <div class=\"mat-slider-ticks\" [ngStyle]=\"_getTicksStyles()\"></div>\n  </div>\n  <div class=\"mat-slider-thumb-container\" [ngStyle]=\"_getThumbContainerStyles()\">\n    <div class=\"mat-slider-focus-ring\"></div>\n    <div class=\"mat-slider-thumb\"></div>\n    <div class=\"mat-slider-thumb-label\">\n      <span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span>\n    </div>\n  </div>\n</div>\n", styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mat-slider:not(.mat-slider-disabled):active,.mat-slider.mat-slider-sliding:not(.mat-slider-disabled){cursor:grabbing}.mat-slider-wrapper{-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{-webkit-background-clip:content-box;background-clip:content-box;background-repeat:repeat;box-sizing:border-box;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider.cdk-keyboard-focused .mat-slider-focus-ring,.mat-slider.cdk-program-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb{cursor:grab}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid rgba(0,0,0,0);border-radius:50%;transform:scale(0.7);transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-radius 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.cdk-high-contrast-active .mat-slider-thumb-label{outline:solid 1px}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-sliding .mat-slider-track-fill,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-thumb-container{transition-duration:0ms}.mat-slider-has-ticks .mat-slider-wrapper::after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{display:none}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text{opacity:1}.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(0.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mat-slider-horizontal .mat-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(0.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text{transform:none}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mat-slider-vertical .mat-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(0.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}.mat-slider._mat-animation-noopable .mat-slider-track-fill,.mat-slider._mat-animation-noopable .mat-slider-track-background,.mat-slider._mat-animation-noopable .mat-slider-ticks,.mat-slider._mat-animation-noopable .mat-slider-thumb-container,.mat-slider._mat-animation-noopable .mat-slider-focus-ring,.mat-slider._mat-animation-noopable .mat-slider-thumb,.mat-slider._mat-animation-noopable .mat-slider-thumb-label,.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after{transition:none}"], dependencies: [{ kind: "directive", type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider', exportAs: 'matSlider', providers: [MAT_SLIDER_VALUE_ACCESSOR], host: {
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
                    }, inputs: ['disabled', 'color', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mat-slider-wrapper\" #sliderWrapper>\n  <div class=\"mat-slider-track-wrapper\">\n    <div class=\"mat-slider-track-background\" [ngStyle]=\"_getTrackBackgroundStyles()\"></div>\n    <div class=\"mat-slider-track-fill\" [ngStyle]=\"_getTrackFillStyles()\"></div>\n  </div>\n  <div class=\"mat-slider-ticks-container\" [ngStyle]=\"_getTicksContainerStyles()\">\n    <div class=\"mat-slider-ticks\" [ngStyle]=\"_getTicksStyles()\"></div>\n  </div>\n  <div class=\"mat-slider-thumb-container\" [ngStyle]=\"_getThumbContainerStyles()\">\n    <div class=\"mat-slider-focus-ring\"></div>\n    <div class=\"mat-slider-thumb\"></div>\n    <div class=\"mat-slider-thumb-label\">\n      <span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span>\n    </div>\n  </div>\n</div>\n", styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mat-slider:not(.mat-slider-disabled):active,.mat-slider.mat-slider-sliding:not(.mat-slider-disabled){cursor:grabbing}.mat-slider-wrapper{-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{-webkit-background-clip:content-box;background-clip:content-box;background-repeat:repeat;box-sizing:border-box;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider.cdk-keyboard-focused .mat-slider-focus-ring,.mat-slider.cdk-program-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb{cursor:grab}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid rgba(0,0,0,0);border-radius:50%;transform:scale(0.7);transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-radius 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.cdk-high-contrast-active .mat-slider-thumb-label{outline:solid 1px}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-sliding .mat-slider-track-fill,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-thumb-container{transition-duration:0ms}.mat-slider-has-ticks .mat-slider-wrapper::after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{display:none}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text{opacity:1}.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(0.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mat-slider-horizontal .mat-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(0.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text{transform:none}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mat-slider-vertical .mat-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(0.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}.mat-slider._mat-animation-noopable .mat-slider-track-fill,.mat-slider._mat-animation-noopable .mat-slider-track-background,.mat-slider._mat-animation-noopable .mat-slider-ticks,.mat-slider._mat-animation-noopable .mat-slider-thumb-container,.mat-slider._mat-animation-noopable .mat-slider-focus-ring,.mat-slider._mat-animation-noopable .mat-slider-thumb,.mat-slider._mat-animation-noopable .mat-slider-thumb-label,.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after{transition:none}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i0.ChangeDetectorRef }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { invert: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], step: [{
                type: Input
            }], thumbLabel: [{
                type: Input
            }], tickInterval: [{
                type: Input
            }], value: [{
                type: Input
            }], displayWith: [{
                type: Input
            }], valueText: [{
                type: Input
            }], vertical: [{
                type: Input
            }], change: [{
                type: Output
            }], input: [{
                type: Output
            }], valueChange: [{
                type: Output
            }], _sliderWrapper: [{
                type: ViewChild,
                args: ['sliderWrapper']
            }] } });
/** Checks if number is safe for calculation */
function isSafeNumber(value) {
    return !isNaN(value) && isFinite(value);
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsVUFBVSxFQUNWLEdBQUcsRUFDSCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsRUFDUixjQUFjLEdBQ2YsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUlMLFVBQVUsRUFDVixhQUFhLEVBQ2IsYUFBYSxHQUNkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8s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ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlLFxuICBIYXNUYWJJbmRleCxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbmNvbnN0IGFjdGl2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IGZhbHNlfSk7XG5cbi8qKlxuICogVmlzdWFsbHksIGEgMzBweCBzZXBhcmF0aW9uIGJldHdlZW4gdGljayBtYXJrcyBsb29rcyBiZXN0LiBUaGlzIGlzIHZlcnkgc3ViamVjdGl2ZSBidXQgaXQgaXNcbiAqIHRoZSBkZWZhdWx0IHNlcGFyYXRpb24gd2UgY2hvc2UuXG4gKi9cbmNvbnN0IE1JTl9BVVRPX1RJQ0tfU0VQQVJBVElPTiA9IDMwO1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIGRpc2FibGVkIHNsaWRlci4gKi9cbmNvbnN0IERJU0FCTEVEX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGEgbm9uLWFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGFuIGFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA9IDEwO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LXNsaWRlciB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogVGhpcyBhbGxvd3MgaXQgdG8gc3VwcG9ydCBbKG5nTW9kZWwpXSBhbmQgW2Zvcm1Db250cm9sXS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlciksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIGJ5IHRoZSBNYXRTbGlkZXIgY29tcG9uZW50LiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckNoYW5nZSB7XG4gIC8qKiBUaGUgTWF0U2xpZGVyIHRoYXQgY2hhbmdlZC4gKi9cbiAgc291cmNlOiBNYXRTbGlkZXI7XG5cbiAgLyoqIFRoZSBuZXcgdmFsdWUgb2YgdGhlIHNvdXJjZSBzbGlkZXIuICovXG4gIHZhbHVlOiBudW1iZXIgfCBudWxsO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U2xpZGVyQmFzZSA9IG1peGluVGFiSW5kZXgoXG4gIG1peGluQ29sb3IoXG4gICAgbWl4aW5EaXNhYmxlZChcbiAgICAgIGNsYXNzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICAgICAgfSxcbiAgICApLFxuICAgICdhY2NlbnQnLFxuICApLFxuKTtcblxuLyoqXG4gKiBBbGxvd3MgdXNlcnMgdG8gc2VsZWN0IGZyb20gYSByYW5nZSBvZiB2YWx1ZXMgYnkgbW92aW5nIHRoZSBzbGlkZXIgdGh1bWIuIEl0IGlzIHNpbWlsYXIgaW5cbiAqIGJlaGF2aW9yIHRvIHRoZSBuYXRpdmUgYDxpbnB1dCB0eXBlPVwicmFuZ2VcIj5gIGVsZW1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zbGlkZXInLFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIHByb3ZpZGVyczogW01BVF9TTElERVJfVkFMVUVfQUNDRVNTT1JdLFxuICBob3N0OiB7XG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGtleXVwKSc6ICdfb25LZXl1cCgpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19vbk1vdXNlZW50ZXIoKScsXG5cbiAgICAvLyBPbiBTYWZhcmkgc3RhcnRpbmcgdG8gc2xpZGUgdGVtcG9yYXJpbHkgdHJpZ2dlcnMgdGV4dCBzZWxlY3Rpb24gbW9kZSB3aGljaFxuICAgIC8vIHNob3cgdGhlIHdyb25nIGN1cnNvci4gV2UgcHJldmVudCBpdCBieSBzdG9wcGluZyB0aGUgYHNlbGVjdHN0YXJ0YCBldmVudC5cbiAgICAnKHNlbGVjdHN0YXJ0KSc6ICckZXZlbnQucHJldmVudERlZmF1bHQoKScsXG4gICAgJ2NsYXNzJzogJ21hdC1zbGlkZXIgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ3JvbGUnOiAnc2xpZGVyJyxcbiAgICAnW3RhYkluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbWF4JyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1pbl0nOiAnbWluJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAndmFsdWUnLFxuXG4gICAgLy8gTlZEQSBhbmQgSmF3cyBhcHBlYXIgdG8gYW5ub3VuY2UgdGhlIGBhcmlhLXZhbHVlbm93YCBieSBjYWxjdWxhdGluZyBpdHMgcGVyY2VudGFnZSBiYXNlZFxuICAgIC8vIG9uIGl0cyB2YWx1ZSBiZXR3ZWVuIGBhcmlhLXZhbHVlbWluYCBhbmQgYGFyaWEtdmFsdWVtYXhgLiBEdWUgdG8gaG93IGRlY2ltYWxzIGFyZSBoYW5kbGVkLFxuICAgIC8vIGl0IGNhbiBjYXVzZSB0aGUgc2xpZGVyIHRvIHJlYWQgb3V0IGEgdmVyeSBsb25nIHZhbHVlIGxpa2UgMC4yMDAwMDA2OCBpZiB0aGUgY3VycmVudCB2YWx1ZVxuICAgIC8vIGlzIDAuMiB3aXRoIGEgbWluIG9mIDAgYW5kIG1heCBvZiAxLiBXZSB3b3JrIGFyb3VuZCB0aGUgaXNzdWUgYnkgc2V0dGluZyBgYXJpYS12YWx1ZXRleHRgXG4gICAgLy8gdG8gdGhlIHNhbWUgdmFsdWUgdGhhdCB3ZSBzZXQgb24gdGhlIHNsaWRlcidzIHRodW1iIHdoaWNoIHdpbGwgYmUgdHJ1bmNhdGVkLlxuICAgICdbYXR0ci5hcmlhLXZhbHVldGV4dF0nOiAndmFsdWVUZXh0ID09IG51bGwgPyBkaXNwbGF5VmFsdWUgOiB2YWx1ZVRleHQnLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICd2ZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGFzLXRpY2tzXSc6ICd0aWNrSW50ZXJ2YWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1ob3Jpem9udGFsXSc6ICchdmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1heGlzLWludmVydGVkXSc6ICdfc2hvdWxkSW52ZXJ0QXhpcygpJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbW91c2UgY29vcmRpbmF0ZXMgbmVlZCB0byBiZSBpbnZlcnRlZC5cbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaW52ZXJ0LW1vdXNlLWNvb3Jkc10nOiAnX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCknLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1zbGlkaW5nXSc6ICdfaXNTbGlkaW5nJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZ10nOiAndGh1bWJMYWJlbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLW1pbi12YWx1ZV0nOiAnX2lzTWluVmFsdWUoKScsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhpZGUtbGFzdC10aWNrXSc6XG4gICAgICAnZGlzYWJsZWQgfHwgX2lzTWluVmFsdWUoKSAmJiBfZ2V0VGh1bWJHYXAoKSAmJiBfc2hvdWxkSW52ZXJ0QXhpcygpJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXIuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyXG4gIGV4dGVuZHMgX01hdFNsaWRlckJhc2VcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95LCBDYW5EaXNhYmxlLCBDYW5Db2xvciwgQWZ0ZXJWaWV3SW5pdCwgSGFzVGFiSW5kZXhcbntcbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGludmVydCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW52ZXJ0O1xuICB9XG4gIHNldCBpbnZlcnQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2ludmVydCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW52ZXJ0ID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHZhbHVlIHRoYXQgdGhlIHNsaWRlciBjYW4gaGF2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tYXg7XG4gIH1cbiAgc2V0IG1heCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG4gIHNldCBtaW4odjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9taW4gPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9taW4pO1xuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9taW46IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3RlcDtcbiAgfVxuICBzZXQgc3RlcCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3N0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9zdGVwKTtcblxuICAgIGlmICh0aGlzLl9zdGVwICUgMSAhPT0gMCkge1xuICAgICAgdGhpcy5fcm91bmRUb0RlY2ltYWwgPSB0aGlzLl9zdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKS5wb3AoKSEubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoaXMgY291bGQgbW9kaWZ5IHRoZSBsYWJlbCwgd2UgbmVlZCB0byBub3RpZnkgdGhlIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RlcDogbnVtYmVyID0gMTtcblxuICAvKiogV2hldGhlciBvciBub3QgdG8gc2hvdyB0aGUgdGh1bWIgbGFiZWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aHVtYkxhYmVsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90aHVtYkxhYmVsO1xuICB9XG4gIHNldCB0aHVtYkxhYmVsKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl90aHVtYkxhYmVsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90aHVtYkxhYmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBzaG93IHRpY2tzLiBSZWxhdGl2ZSB0byB0aGUgc3RlcCBzbyB0aGF0IGEgdGljayBhbHdheXMgYXBwZWFycyBvbiBhIHN0ZXAuXG4gICAqIEV4OiBUaWNrIGludGVydmFsIG9mIDQgd2l0aCBhIHN0ZXAgb2YgMyB3aWxsIGRyYXcgYSB0aWNrIGV2ZXJ5IDQgc3RlcHMgKGV2ZXJ5IDEyIHZhbHVlcykuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdGlja0ludGVydmFsKCk6ICdhdXRvJyB8IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3RpY2tJbnRlcnZhbDtcbiAgfVxuICBzZXQgdGlja0ludGVydmFsKHZhbHVlOiAnYXV0bycgfCBOdW1iZXJJbnB1dCkge1xuICAgIGlmICh2YWx1ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAnYXV0byc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlLCB0aGlzLl90aWNrSW50ZXJ2YWwgYXMgbnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gMDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsOiAnYXV0bycgfCBudW1iZXIgPSAwO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVhZCBhbmQgaXQgaXMgc3RpbGwgdW5pbml0aWFsaXplZCwgaW5pdGlhbGl6ZSBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlIGFzIG51bWJlcjtcbiAgfVxuICBzZXQgdmFsdWUodjogTnVtYmVySW5wdXQpIHtcbiAgICBpZiAodiAhPT0gdGhpcy5fdmFsdWUpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIDApO1xuXG4gICAgICAvLyBXaGlsZSBpbmNyZW1lbnRpbmcgYnkgYSBkZWNpbWFsIHdlIGNhbiBlbmQgdXAgd2l0aCB2YWx1ZXMgbGlrZSAzMy4zMDAwMDAwMDAwMDAwMDQuXG4gICAgICAvLyBUcnVuY2F0ZSBpdCB0byBlbnN1cmUgdGhhdCBpdCBtYXRjaGVzIHRoZSBsYWJlbCBhbmQgdG8gbWFrZSBpdCBlYXNpZXIgdG8gd29yayB3aXRoLlxuICAgICAgaWYgKHRoaXMuX3JvdW5kVG9EZWNpbWFsICYmIHZhbHVlICE9PSB0aGlzLm1pbiAmJiB2YWx1ZSAhPT0gdGhpcy5tYXgpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gZm9ybWF0IHRoZSB2YWx1ZSBiZWZvcmUgaXQgaXMgZGlzcGxheWVkXG4gICAqIGluIHRoZSB0aHVtYiBsYWJlbC4gQ2FuIGJlIHVzZWQgdG8gZm9ybWF0IHZlcnkgbGFyZ2UgbnVtYmVyIGluIG9yZGVyXG4gICAqIGZvciB0aGVtIHRvIGZpdCBpbnRvIHRoZSBzbGlkZXIgdGh1bWIuXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogVGV4dCBjb3JyZXNwb25kaW5nIHRvIHRoZSBzbGlkZXIncyB2YWx1ZS4gVXNlZCBwcmltYXJpbHkgZm9yIGltcHJvdmVkIGFjY2Vzc2liaWxpdHkuICovXG4gIEBJbnB1dCgpIHZhbHVlVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGljYWw7XG4gIH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdmVydGljYWwgPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdmFsdWUgaGFzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHRodW1iIG1vdmVzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2xpZGVyIGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlciB8IG51bGw+KCk7XG5cbiAgLyoqIFRoZSB2YWx1ZSB0byBiZSB1c2VkIGZvciBkaXNwbGF5IHB1cnBvc2VzLiAqL1xuICBnZXQgZGlzcGxheVZhbHVlKCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgaWYgKHRoaXMuZGlzcGxheVdpdGgpIHtcbiAgICAgIC8vIFZhbHVlIGlzIG5ldmVyIG51bGwgYnV0IHNpbmNlIHNldHRlcnMgYW5kIGdldHRlcnMgY2Fubm90IGhhdmVcbiAgICAgIC8vIGRpZmZlcmVudCB0eXBlcywgdGhlIHZhbHVlIGdldHRlciBpcyBhbHNvIHR5cGVkIHRvIHJldHVybiBudWxsLlxuICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheVdpdGgodGhpcy52YWx1ZSEpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGNvdWxkIGJlIGltcHJvdmVkIGZ1cnRoZXIgYnkgcm91bmRpbmcgc29tZXRoaW5nIGxpa2UgMC45OTkgdG8gMSBvclxuICAgIC8vIDAuODk5IHRvIDAuOSwgaG93ZXZlciBpdCBpcyB2ZXJ5IHBlcmZvcm1hbmNlIHNlbnNpdGl2ZSwgYmVjYXVzZSBpdCBnZXRzIGNhbGxlZCBvblxuICAgIC8vIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuXG4gICAgaWYgKHRoaXMuX3JvdW5kVG9EZWNpbWFsICYmIHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZSAlIDEgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnZhbHVlIHx8IDA7XG4gIH1cblxuICAvKiogc2V0IGZvY3VzIHRvIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQob3B0aW9ucyk7XG4gIH1cblxuICAvKiogYmx1ciB0aGUgaG9zdCBlbGVtZW50ICovXG4gIGJsdXIoKSB7XG4gICAgdGhpcy5fYmx1ckhvc3RFbGVtZW50KCk7XG4gIH1cblxuICAvKiogb25Ub3VjaCBmdW5jdGlvbiByZWdpc3RlcmVkIHZpYSByZWdpc3Rlck9uVG91Y2ggKENvbnRyb2xWYWx1ZUFjY2Vzc29yKS4gKi9cbiAgb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGNvaW5jaWRlcyB3aXRoIHRoZSB2YWx1ZS4gKi9cbiAgZ2V0IHBlcmNlbnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY2xhbXAodGhpcy5fcGVyY2VudCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHRodW1iIGlzIHNsaWRpbmcgYW5kIHdoYXQgdGhlIHVzZXIgaXMgdXNpbmcgdG8gc2xpZGUgaXQgd2l0aC5cbiAgICogVXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlcmUgc2hvdWxkIGJlIGEgdHJhbnNpdGlvbiBmb3IgdGhlIHRodW1iIGFuZCBmaWxsIHRyYWNrLlxuICAgKi9cbiAgX2lzU2xpZGluZzogJ2tleWJvYXJkJyB8ICdwb2ludGVyJyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgc2xpZGVyIGlzIGFjdGl2ZSAoY2xpY2tlZCBvciBzbGlkaW5nKS5cbiAgICogVXNlZCB0byBzaHJpbmsgYW5kIGdyb3cgdGhlIHRodW1iIGFzIGFjY29yZGluZyB0byB0aGUgTWF0ZXJpYWwgRGVzaWduIHNwZWMuXG4gICAqL1xuICBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXhpcyBvZiB0aGUgc2xpZGVyIGlzIGludmVydGVkLlxuICAgKiAoaS5lLiB3aGV0aGVyIG1vdmluZyB0aGUgdGh1bWIgaW4gdGhlIHBvc2l0aXZlIHggb3IgeSBkaXJlY3Rpb24gZGVjcmVhc2VzIHRoZSBzbGlkZXIncyB2YWx1ZSkuXG4gICAqL1xuICBfc2hvdWxkSW52ZXJ0QXhpcygpIHtcbiAgICAvLyBTdGFuZGFyZCBub24taW52ZXJ0ZWQgbW9kZSBmb3IgYSB2ZXJ0aWNhbCBzbGlkZXIgc2hvdWxkIGJlIGRyYWdnaW5nIHRoZSB0aHVtYiBmcm9tIGJvdHRvbSB0b1xuICAgIC8vIHRvcC4gSG93ZXZlciBmcm9tIGEgeS1heGlzIHN0YW5kcG9pbnQgdGhpcyBpcyBpbnZlcnRlZC5cbiAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbCA/ICF0aGlzLmludmVydCA6IHRoaXMuaW52ZXJ0O1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBhdCBpdHMgbWluaW11bSB2YWx1ZS4gKi9cbiAgX2lzTWluVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGVyY2VudCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHNwYWNlIHRvIGxlYXZlIGJldHdlZW4gdGhlIHNsaWRlciB0aHVtYiBhbmQgdGhlIHRyYWNrIGZpbGwgJiB0cmFjayBiYWNrZ3JvdW5kXG4gICAqIGVsZW1lbnRzLlxuICAgKi9cbiAgX2dldFRodW1iR2FwKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gRElTQUJMRURfVEhVTUJfR0FQO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSgpICYmICF0aGlzLnRodW1iTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pc0FjdGl2ZSA/IE1JTl9WQUxVRV9BQ1RJVkVfVEhVTUJfR0FQIDogTUlOX1ZBTFVFX05PTkFDVElWRV9USFVNQl9HQVA7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0cmFjayBiYWNrZ3JvdW5kIGVsZW1lbnQuICovXG4gIF9nZXRUcmFja0JhY2tncm91bmRTdHlsZXMoKToge1trZXk6IHN0cmluZ106IHN0cmluZ30ge1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAkezEgLSB0aGlzLnBlcmNlbnR9LCAxYCA6IGAkezEgLSB0aGlzLnBlcmNlbnR9LCAxLCAxYDtcbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICctJyA6ICcnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX2dldFRodW1iR2FwKCl9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYCxcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0cmFjayBmaWxsIGVsZW1lbnQuICovXG4gIF9nZXRUcmFja0ZpbGxTdHlsZXMoKToge1trZXk6IHN0cmluZ106IHN0cmluZ30ge1xuICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLnBlcmNlbnQ7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnZlcnRpY2FsID8gYDEsICR7cGVyY2VudH0sIDFgIDogYCR7cGVyY2VudH0sIDEsIDFgO1xuICAgIGNvbnN0IHNpZ24gPSB0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpID8gJycgOiAnLSc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gc2NhbGUzZCBhdm9pZHMgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIENocm9tZS4gU2VlICMxMjA3MS5cbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGhpcy5fZ2V0VGh1bWJHYXAoKX1weCkgc2NhbGUzZCgke3NjYWxlfSlgLFxuICAgICAgLy8gaU9TIFNhZmFyaSBoYXMgYSBidWcgd2hlcmUgaXQgd29uJ3QgcmUtcmVuZGVyIGVsZW1lbnRzIHdoaWNoIHN0YXJ0IG9mIGFzIGBzY2FsZSgwKWAgdW50aWxcbiAgICAgIC8vIHNvbWV0aGluZyBmb3JjZXMgYSBzdHlsZSByZWNhbGN1bGF0aW9uIG9uIGl0LiBTaW5jZSB3ZSdsbCBlbmQgdXAgd2l0aCBgc2NhbGUoMClgIHdoZW5cbiAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIGlzIDAsIHdlIGNhbiBlYXNpbHkgZ2V0IGludG8gdGhpcyBzaXR1YXRpb24uIFdlIGZvcmNlIGFcbiAgICAgIC8vIHJlY2FsY3VsYXRpb24gYnkgY2hhbmdpbmcgdGhlIGVsZW1lbnQncyBgZGlzcGxheWAgd2hlbiBpdCBnb2VzIGZyb20gMCB0byBhbnkgb3RoZXIgdmFsdWUuXG4gICAgICBkaXNwbGF5OiBwZXJjZW50ID09PSAwID8gJ25vbmUnIDogJycsXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdGlja3MgY29udGFpbmVyIGVsZW1lbnQuICovXG4gIF9nZXRUaWNrc0NvbnRhaW5lclN0eWxlcygpOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSB7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGlja3MgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGxldCBzaWduID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnJyA6ICctJztcbiAgICBsZXQgb2Zmc2V0ID0gKHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgLyAyKSAqIDEwMDtcbiAgICByZXR1cm4ge1xuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke29mZnNldH0lKWAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdGlja3MgZWxlbWVudC4gKi9cbiAgX2dldFRpY2tzU3R5bGVzKCk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9IHtcbiAgICBsZXQgdGlja1NpemUgPSB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ICogMTAwO1xuICAgIGxldCBiYWNrZ3JvdW5kU2l6ZSA9IHRoaXMudmVydGljYWwgPyBgMnB4ICR7dGlja1NpemV9JWAgOiBgJHt0aWNrU2l6ZX0lIDJweGA7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIERlcGVuZGluZyBvbiB0aGUgZGlyZWN0aW9uIHdlIHB1c2hlZCB0aGUgdGlja3MgY29udGFpbmVyLCBwdXNoIHRoZSB0aWNrcyB0aGUgb3Bwb3NpdGVcbiAgICAvLyBkaXJlY3Rpb24gdG8gcmUtY2VudGVyIHRoZW0gYnV0IGNsaXAgb2ZmIHRoZSBlbmQgZWRnZS4gSW4gUlRMIGxhbmd1YWdlcyB3ZSBuZWVkIHRvIGZsaXAgdGhlXG4gICAgLy8gdGlja3MgMTgwIGRlZ3JlZXMgc28gd2UncmUgcmVhbGx5IGN1dHRpbmcgb2ZmIHRoZSBlbmQgZWRnZSBhYmQgbm90IHRoZSBzdGFydC5cbiAgICBsZXQgc2lnbiA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gJy0nIDogJyc7XG4gICAgbGV0IHJvdGF0ZSA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gJyByb3RhdGUoMTgwZGVnKScgOiAnJztcbiAgICBsZXQgc3R5bGVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IGJhY2tncm91bmRTaXplLFxuICAgICAgLy8gV2l0aG91dCB0cmFuc2xhdGVaIHRpY2tzIHNvbWV0aW1lcyBqaXR0ZXIgYXMgdGhlIHNsaWRlciBtb3ZlcyBvbiBDaHJvbWUgJiBGaXJlZm94LlxuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YCxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUoKSAmJiB0aGlzLl9nZXRUaHVtYkdhcCgpKSB7XG4gICAgICBjb25zdCBzaG91bGRJbnZlcnRBeGlzID0gdGhpcy5fc2hvdWxkSW52ZXJ0QXhpcygpO1xuICAgICAgbGV0IHNpZGU6IHN0cmluZztcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgc2lkZSA9IHNob3VsZEludmVydEF4aXMgPyAnQm90dG9tJyA6ICdUb3AnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2lkZSA9IHNob3VsZEludmVydEF4aXMgPyAnUmlnaHQnIDogJ0xlZnQnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXNbYHBhZGRpbmcke3NpZGV9YF0gPSBgJHt0aGlzLl9nZXRUaHVtYkdhcCgpfXB4YDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgX2dldFRodW1iQ29udGFpbmVyU3R5bGVzKCk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9IHtcbiAgICBjb25zdCBzaG91bGRJbnZlcnRBeGlzID0gdGhpcy5fc2hvdWxkSW52ZXJ0QXhpcygpO1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRodW1iIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgaW52ZXJ0T2Zmc2V0ID1cbiAgICAgIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnICYmICF0aGlzLnZlcnRpY2FsID8gIXNob3VsZEludmVydEF4aXMgOiBzaG91bGRJbnZlcnRBeGlzO1xuICAgIGxldCBvZmZzZXQgPSAoaW52ZXJ0T2Zmc2V0ID8gdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudCkgKiAxMDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlJHtheGlzfSgtJHtvZmZzZXR9JSlgLFxuICAgIH07XG4gIH1cblxuICAvKiogVGhlIHNpemUgb2YgYSB0aWNrIGludGVydmFsIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgc2l6ZSBvZiB0aGUgdHJhY2suICovXG4gIHByaXZhdGUgX3RpY2tJbnRlcnZhbFBlcmNlbnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3NsaWRlckRpbWVuc2lvbnM6IENsaWVudFJlY3QgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBEZWNpbWFsIHBsYWNlcyB0byByb3VuZCB0bywgYmFzZWQgb24gdGhlIHN0ZXAgYW1vdW50LiAqL1xuICBwcml2YXRlIF9yb3VuZFRvRGVjaW1hbDogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIERpcmVjdGlvbmFsaXR5IGNoYW5nZSBFdmVudEVtaXR0ZXIuICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgd2hlbiB0aGUgc2xpZGUgc3RhcnQgZXZlbnQgZmlyZXMuICovXG4gIHByaXZhdGUgX3ZhbHVlT25TbGlkZVN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIHNsaWRlciB3cmFwcGVyIGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcldyYXBwZXInKSBwcml2YXRlIF9zbGlkZXJXcmFwcGVyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG1vdXNlIGV2ZW50cyBzaG91bGQgYmUgY29udmVydGVkIHRvIGEgc2xpZGVyIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZWlyIGRpc3RhbmNlXG4gICAqIGZyb20gdGhlIHJpZ2h0IG9yIGJvdHRvbSBlZGdlIG9mIHRoZSBzbGlkZXIgYXMgb3Bwb3NlZCB0byB0aGUgdG9wIG9yIGxlZnQuXG4gICAqL1xuICBfc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSB7XG4gICAgY29uc3Qgc2hvdWxkSW52ZXJ0QXhpcyA9IHRoaXMuX3Nob3VsZEludmVydEF4aXMoKTtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwgPyAhc2hvdWxkSW52ZXJ0QXhpcyA6IHNob3VsZEludmVydEF4aXM7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgbGFzdCBwb2ludGVyIGV2ZW50IHRoYXQgd2FzIGNhcHR1cmVkIGJ5IHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX2xhc3RQb2ludGVyRXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50IHwgbnVsbDtcblxuICAvKiogVXNlZCB0byBzdWJzY3JpYmUgdG8gZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXIgdXNlZCB0byBhdHRyaWJ1dGUgYSB0b3VjaCBldmVudCB0byBhIHBhcnRpY3VsYXIgc2xpZGVyLlxuICAgKiBXaWxsIGJlIHVuZGVmaW5lZCBpZiBvbmUgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGlzIHRydWU6XG4gICAqIC0gVGhlIHVzZXIgaXNuJ3QgZHJhZ2dpbmcgdXNpbmcgYSB0b3VjaCBkZXZpY2UuXG4gICAqIC0gVGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGBUb3VjaC5pZGVudGlmaWVyYC5cbiAgICogLSBEcmFnZ2luZyBoYXNuJ3Qgc3RhcnRlZCB5ZXQuXG4gICAqL1xuICBwcml2YXRlIF90b3VjaElkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZSgob3JpZ2luOiBGb2N1c09yaWdpbikgPT4ge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSAhIW9yaWdpbiAmJiBvcmlnaW4gIT09ICdrZXlib2FyZCc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMuX2Rpcikge1xuICAgICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBfb25Nb3VzZWVudGVyKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICBoYXNNb2RpZmllcktleShldmVudCkgfHxcbiAgICAgICh0aGlzLl9pc1NsaWRpbmcgJiYgdGhpcy5faXNTbGlkaW5nICE9PSAna2V5Ym9hcmQnKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoLTEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgLy8gTk9URTogRm9yIGEgc2lnaHRlZCB1c2VyIGl0IHdvdWxkIG1ha2UgbW9yZSBzZW5zZSB0aGF0IHdoZW4gdGhleSBwcmVzcyBhbiBhcnJvdyBrZXkgb24gYW5cbiAgICAgICAgLy8gaW52ZXJ0ZWQgc2xpZGVyIHRoZSB0aHVtYiBtb3ZlcyBpbiB0aGF0IGRpcmVjdGlvbi4gSG93ZXZlciBmb3IgYSBibGluZCB1c2VyLCBub3RoaW5nXG4gICAgICAgIC8vIGFib3V0IHRoZSBzbGlkZXIgaW5kaWNhdGVzIHRoYXQgaXQgaXMgaW52ZXJ0ZWQuIFRoZXkgd2lsbCBleHBlY3QgbGVmdCB0byBiZSBkZWNyZW1lbnQsXG4gICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2YgaG93IGl0IGFwcGVhcnMgb24gdGhlIHNjcmVlbi4gRm9yIHNwZWFrZXJzIG9mUlRMIGxhbmd1YWdlcywgdGhleSBwcm9iYWJseVxuICAgICAgICAvLyBleHBlY3QgbGVmdCB0byBtZWFuIGluY3JlbWVudC4gVGhlcmVmb3JlIHdlIGZsaXAgdGhlIG1lYW5pbmcgb2YgdGhlIHNpZGUgYXJyb3cga2V5cyBmb3JcbiAgICAgICAgLy8gUlRMLiBGb3IgaW52ZXJ0ZWQgc2xpZGVycyB3ZSBwcmVmZXIgYSBnb29kIGExMXkgZXhwZXJpZW5jZSB0byBoYXZpbmcgaXQgXCJsb29rIHJpZ2h0XCIgZm9yXG4gICAgICAgIC8vIHNpZ2h0ZWQgdXNlcnMsIHRoZXJlZm9yZSB3ZSBkbyBub3Qgc3dhcCB0aGUgbWVhbmluZy5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50KHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gMSA6IC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgLy8gU2VlIGNvbW1lbnQgb24gTEVGVF9BUlJPVyBhYm91dCB0aGUgY29uZGl0aW9ucyB1bmRlciB3aGljaCB3ZSBmbGlwIHRoZSBtZWFuaW5nLlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBSZXR1cm4gaWYgdGhlIGtleSBpcyBub3Qgb25lIHRoYXQgd2UgZXhwbGljaXRseSBoYW5kbGUgdG8gYXZvaWQgY2FsbGluZyBwcmV2ZW50RGVmYXVsdCBvblxuICAgICAgICAvLyBpdC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTbGlkaW5nID0gJ2tleWJvYXJkJztcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgX29uS2V5dXAoKSB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZyA9PT0gJ2tleWJvYXJkJykge1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIHB1dCB0aGVpciBwb2ludGVyIGRvd24gb24gdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlckRvd24gPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgdGhlIHNsaWRlciBpcyBkaXNhYmxlZCBvciB0aGVcbiAgICAvLyB1c2VyIGlzIHVzaW5nIGFueXRoaW5nIG90aGVyIHRoYW4gdGhlIG1haW4gbW91c2UgYnV0dG9uLlxuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuX2lzU2xpZGluZyB8fCAoIWlzVG91Y2hFdmVudChldmVudCkgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5fdG91Y2hJZCA9IGlzVG91Y2hFdmVudChldmVudClcbiAgICAgICAgPyBnZXRUb3VjaElkRm9yU2xpZGVyKGV2ZW50LCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50LCB0aGlzLl90b3VjaElkKTtcblxuICAgICAgaWYgKHBvaW50ZXJQb3NpdGlvbikge1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMuX2lzU2xpZGluZyA9ICdwb2ludGVyJztcbiAgICAgICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IGV2ZW50O1xuICAgICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuX29uTW91c2VlbnRlcigpOyAvLyBTaW11bGF0ZSBtb3VzZWVudGVyIGluIGNhc2UgdGhpcyBpcyBhIG1vYmlsZSBkZXZpY2UuXG4gICAgICAgIHRoaXMuX2JpbmRHbG9iYWxFdmVudHMoZXZlbnQpO1xuICAgICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvaW50ZXJQb3NpdGlvbik7XG4gICAgICAgIHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ID0gb2xkVmFsdWU7XG5cbiAgICAgICAgLy8gRGVzcGl0ZSB0aGUgZmFjdCB0aGF0IHdlIGV4cGxpY2l0bHkgYmluZCBhY3RpdmUgZXZlbnRzLCBpbiBzb21lIGNhc2VzIHRoZSBicm93c2VyXG4gICAgICAgIC8vIHN0aWxsIGRpc3BhdGNoZXMgbm9uLWNhbmNlbGFibGUgZXZlbnRzIHdoaWNoIGNhdXNlIHRoaXMgY2FsbCB0byB0aHJvdyBhbiBlcnJvci5cbiAgICAgICAgLy8gVGhlcmUgZG9lc24ndCBhcHBlYXIgdG8gYmUgYSBnb29kIHdheSBvZiBhdm9pZGluZyB0aGVtLiBTZWUgIzIzODIwLlxuICAgICAgICBpZiAoZXZlbnQuY2FuY2VsYWJsZSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbWl0IGEgY2hhbmdlIGFuZCBpbnB1dCBldmVudCBpZiB0aGUgdmFsdWUgY2hhbmdlZC5cbiAgICAgICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBtb3ZlZCB0aGVpciBwb2ludGVyIGFmdGVyXG4gICAqIHN0YXJ0aW5nIHRvIGRyYWcuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC5cbiAgICovXG4gIHByaXZhdGUgX3BvaW50ZXJNb3ZlID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcgPT09ICdwb2ludGVyJykge1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50LCB0aGlzLl90b3VjaElkKTtcblxuICAgICAgaWYgKHBvaW50ZXJQb3NpdGlvbikge1xuICAgICAgICAvLyBQcmV2ZW50IHRoZSBzbGlkZSBmcm9tIHNlbGVjdGluZyBhbnl0aGluZyBlbHNlLlxuICAgICAgICBpZiAoZXZlbnQuY2FuY2VsYWJsZSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gZXZlbnQ7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvaW50ZXJQb3NpdGlvbik7XG5cbiAgICAgICAgLy8gTmF0aXZlIHJhbmdlIGVsZW1lbnRzIGFsd2F5cyBlbWl0IGBpbnB1dGAgZXZlbnRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZWQgd2hpbGUgc2xpZGluZy5cbiAgICAgICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbGlmdGVkIHRoZWlyIHBvaW50ZXIuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcgPT09ICdwb2ludGVyJykge1xuICAgICAgaWYgKFxuICAgICAgICAhaXNUb3VjaEV2ZW50KGV2ZW50KSB8fFxuICAgICAgICB0eXBlb2YgdGhpcy5fdG91Y2hJZCAhPT0gJ251bWJlcicgfHxcbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIHVzZSBgY2hhbmdlZFRvdWNoZXNgLCByYXRoZXIgdGhhbiBgdG91Y2hlc2AgYmVjYXVzZSBpdFxuICAgICAgICAvLyBzZWVtcyBsaWtlIGluIG1vc3QgY2FzZXMgYHRvdWNoZXNgIGlzIGVtcHR5IGZvciBgdG91Y2hlbmRgIGV2ZW50cy5cbiAgICAgICAgZmluZE1hdGNoaW5nVG91Y2goZXZlbnQuY2hhbmdlZFRvdWNoZXMsIHRoaXMuX3RvdWNoSWQpXG4gICAgICApIHtcbiAgICAgICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICAgICAgICB0aGlzLl9pc1NsaWRpbmcgPSBudWxsO1xuICAgICAgICB0aGlzLl90b3VjaElkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmICh0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCAhPSB0aGlzLnZhbHVlICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCA9IHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBoYXMgbG9zdCBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgd2luZG93IGlzIGJsdXJyZWQgd2hpbGUgZHJhZ2dpbmcgd2UgbmVlZCB0byBzdG9wIGRyYWdnaW5nIGJlY2F1c2UgdGhlXG4gICAgLy8gYnJvd3NlciB3b24ndCBkaXNwYXRjaCB0aGUgYG1vdXNldXBgIGFuZCBgdG91Y2hlbmRgIGV2ZW50cyBhbnltb3JlLlxuICAgIGlmICh0aGlzLl9sYXN0UG9pbnRlckV2ZW50KSB7XG4gICAgICB0aGlzLl9wb2ludGVyVXAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBVc2UgZGVmYXVsdFZpZXcgb2YgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCB3aW5kb3cgcmVmZXJlbmNlICovXG4gIHByaXZhdGUgX2dldFdpbmRvdygpOiBXaW5kb3cge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgb3VyIGdsb2JhbCBtb3ZlIGFuZCBlbmQgZXZlbnRzLiBUaGV5J3JlIGJvdW5kIGF0IHRoZSBkb2N1bWVudCBsZXZlbCBhbmQgb25seSB3aGlsZVxuICAgKiBkcmFnZ2luZyBzbyB0aGF0IHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBrZWVwIHRoZWlyIHBvaW50ZXIgZXhhY3RseSBvdmVyIHRoZSBzbGlkZXJcbiAgICogYXMgdGhleSdyZSBzd2lwaW5nIGFjcm9zcyB0aGUgc2NyZWVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfYmluZEdsb2JhbEV2ZW50cyh0cmlnZ2VyRXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIGJpbmQgdGhlIGV2ZW50cyB0byB0aGUgYGRvY3VtZW50YCwgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gY2FwdHVyZVxuICAgIC8vIGRyYWcgY2FuY2VsIGV2ZW50cyB3aGVyZSB0aGUgdXNlcidzIHBvaW50ZXIgaXMgb3V0c2lkZSB0aGUgYnJvd3NlciB3aW5kb3cuXG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9kb2N1bWVudDtcbiAgICBjb25zdCBpc1RvdWNoID0gaXNUb3VjaEV2ZW50KHRyaWdnZXJFdmVudCk7XG4gICAgY29uc3QgbW92ZUV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuICAgIGNvbnN0IGVuZEV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2hlbmQnIDogJ21vdXNldXAnO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcblxuICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9XG5cbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1cik7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgYW55IGdsb2JhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZSBtYXkgaGF2ZSBhZGRlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2xvYmFsRXZlbnRzKCkge1xuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZG9jdW1lbnQ7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW5jcmVtZW50cyB0aGUgc2xpZGVyIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2Ygc3RlcHMgKG5lZ2F0aXZlIG51bWJlciBkZWNyZW1lbnRzKS4gKi9cbiAgcHJpdmF0ZSBfaW5jcmVtZW50KG51bVN0ZXBzOiBudW1iZXIpIHtcbiAgICAvLyBQcmUtY2xhbXAgdGhlIGN1cnJlbnQgdmFsdWUgc2luY2UgaXQncyBhbGxvd2VkIHRvIGJlXG4gICAgLy8gb3V0IG9mIGJvdW5kcyB3aGVuIGFzc2lnbmVkIHByb2dyYW1tYXRpY2FsbHkuXG4gICAgY29uc3QgY2xhbXBlZFZhbHVlID0gdGhpcy5fY2xhbXAodGhpcy52YWx1ZSB8fCAwLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcChjbGFtcGVkVmFsdWUgKyB0aGlzLnN0ZXAgKiBudW1TdGVwcywgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGUgdGhlIG5ldyB2YWx1ZSBmcm9tIHRoZSBuZXcgcGh5c2ljYWwgbG9jYXRpb24uIFRoZSB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBzbmFwcGVkLiAqL1xuICBwcml2YXRlIF91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihwb3M6IHt4OiBudW1iZXI7IHk6IG51bWJlcn0pIHtcbiAgICBpZiAoIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMudG9wIDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5sZWZ0O1xuICAgIGxldCBzaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICBsZXQgcG9zQ29tcG9uZW50ID0gdGhpcy52ZXJ0aWNhbCA/IHBvcy55IDogcG9zLng7XG5cbiAgICAvLyBUaGUgZXhhY3QgdmFsdWUgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBldmVudCBhbmQgdXNlZCB0byBmaW5kIHRoZSBjbG9zZXN0IHNuYXAgdmFsdWUuXG4gICAgbGV0IHBlcmNlbnQgPSB0aGlzLl9jbGFtcCgocG9zQ29tcG9uZW50IC0gb2Zmc2V0KSAvIHNpemUpO1xuXG4gICAgaWYgKHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkpIHtcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGUgc3RlcHMgbWF5IG5vdCBkaXZpZGUgY2xlYW5seSBpbnRvIHRoZSBtYXggdmFsdWUsIGlmIHRoZSB1c2VyXG4gICAgLy8gc2xpZCB0byAwIG9yIDEwMCBwZXJjZW50LCB3ZSBqdW1wIHRvIHRoZSBtaW4vbWF4IHZhbHVlLiBUaGlzIGFwcHJvYWNoXG4gICAgLy8gaXMgc2xpZ2h0bHkgbW9yZSBpbnR1aXRpdmUgdGhhbiB1c2luZyBgTWF0aC5jZWlsYCBiZWxvdywgYmVjYXVzZSBpdFxuICAgIC8vIGZvbGxvd3MgdGhlIHVzZXIncyBwb2ludGVyIGNsb3Nlci5cbiAgICBpZiAocGVyY2VudCA9PT0gMCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluO1xuICAgIH0gZWxzZSBpZiAocGVyY2VudCA9PT0gMSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGFjdFZhbHVlID0gdGhpcy5fY2FsY3VsYXRlVmFsdWUocGVyY2VudCk7XG5cbiAgICAgIC8vIFRoaXMgY2FsY3VsYXRpb24gZmluZHMgdGhlIGNsb3Nlc3Qgc3RlcCBieSBmaW5kaW5nIHRoZSBjbG9zZXN0XG4gICAgICAvLyB3aG9sZSBudW1iZXIgZGl2aXNpYmxlIGJ5IHRoZSBzdGVwIHJlbGF0aXZlIHRvIHRoZSBtaW4uXG4gICAgICBjb25zdCBjbG9zZXN0VmFsdWUgPSBNYXRoLnJvdW5kKChleGFjdFZhbHVlIC0gdGhpcy5taW4pIC8gdGhpcy5zdGVwKSAqIHRoaXMuc3RlcCArIHRoaXMubWluO1xuXG4gICAgICAvLyBUaGUgdmFsdWUgbmVlZHMgdG8gc25hcCB0byB0aGUgbWluIGFuZCBtYXguXG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fY2xhbXAoY2xvc2VzdFZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBhIGNoYW5nZSBldmVudCBpZiB0aGUgY3VycmVudCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbih0aGlzLnZhbHVlKTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudCgpKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBhbiBpbnB1dCBldmVudCB3aGVuIHRoZSBjdXJyZW50IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRJbnB1dEV2ZW50KCkge1xuICAgIHRoaXMuaW5wdXQuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudCgpKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBhbW91bnQgb2Ygc3BhY2UgYmV0d2VlbiB0aWNrcyBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHdpZHRoIG9mIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnRpY2tJbnRlcnZhbCB8fCAhdGhpcy5fc2xpZGVyRGltZW5zaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0aWNrSW50ZXJ2YWxQZXJjZW50OiBudW1iZXI7XG4gICAgaWYgKHRoaXMudGlja0ludGVydmFsID09ICdhdXRvJykge1xuICAgICAgbGV0IHRyYWNrU2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgICBsZXQgcGl4ZWxzUGVyU3RlcCA9ICh0cmFja1NpemUgKiB0aGlzLnN0ZXApIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgbGV0IHN0ZXBzUGVyVGljayA9IE1hdGguY2VpbChNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gLyBwaXhlbHNQZXJTdGVwKTtcbiAgICAgIGxldCBwaXhlbHNQZXJUaWNrID0gc3RlcHNQZXJUaWNrICogdGhpcy5zdGVwO1xuICAgICAgdGlja0ludGVydmFsUGVyY2VudCA9IHBpeGVsc1BlclRpY2sgLyB0cmFja1NpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpY2tJbnRlcnZhbFBlcmNlbnQgPSAodGhpcy50aWNrSW50ZXJ2YWwgKiB0aGlzLnN0ZXApIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgIH1cbiAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gaXNTYWZlTnVtYmVyKHRpY2tJbnRlcnZhbFBlcmNlbnQpID8gdGlja0ludGVydmFsUGVyY2VudCA6IDA7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIHNsaWRlciBjaGFuZ2Ugb2JqZWN0IGZyb20gdGhlIHNwZWNpZmllZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ2hhbmdlRXZlbnQodmFsdWUgPSB0aGlzLnZhbHVlKTogTWF0U2xpZGVyQ2hhbmdlIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgTWF0U2xpZGVyQ2hhbmdlKCk7XG5cbiAgICBldmVudC5zb3VyY2UgPSB0aGlzO1xuICAgIGV2ZW50LnZhbHVlID0gdmFsdWU7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgYSB2YWx1ZSBpcy4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAoKHZhbHVlIHx8IDApIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgIHJldHVybiBpc1NhZmVOdW1iZXIocGVyY2VudGFnZSkgPyBwZXJjZW50YWdlIDogMDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSB2YWx1ZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciBjb3JyZXNwb25kcyB0by4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlVmFsdWUocGVyY2VudGFnZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMubWluICsgcGVyY2VudGFnZSAqICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBudW1iZXIgYmV0d2VlbiB0d28gbnVtYmVycy4gKi9cbiAgcHJpdmF0ZSBfY2xhbXAodmFsdWU6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMSkge1xuICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIHRoZSBzbGlkZXIgdHJhY2sgZWxlbWVudC5cbiAgICogVGhlIHRyYWNrIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlIG5hdGl2ZSBlbGVtZW50IHRvIGlnbm9yZSB0aGUgZXh0cmEgc3BhY2UgdGhhdCB0aGUgdGh1bWIgY2FuXG4gICAqIHRha2UgdXAuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTbGlkZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXJXcmFwcGVyID8gdGhpcy5fc2xpZGVyV3JhcHBlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICogQ3VycmVudGx5IG9ubHkgdXNlZCB0byBhbGxvdyBhIGJsdXIgZXZlbnQgdG8gZmlyZSBidXQgd2lsbCBiZSB1c2VkIHdpdGgga2V5Ym9hcmQgaW5wdXQgbGF0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9ibHVySG9zdEVsZW1lbnQoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxufVxuXG4vKiogQ2hlY2tzIGlmIG51bWJlciBpcyBzYWZlIGZvciBjYWxjdWxhdGlvbiAqL1xuZnVuY3Rpb24gaXNTYWZlTnVtYmVyKHZhbHVlOiBudW1iZXIpIHtcbiAgcmV0dXJuICFpc05hTih2YWx1ZSkgJiYgaXNGaW5pdGUodmFsdWUpO1xufVxuXG4vKiogUmV0dXJucyB3aGV0aGVyIGFuIGV2ZW50IGlzIGEgdG91Y2ggZXZlbnQuICovXG5mdW5jdGlvbiBpc1RvdWNoRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogZXZlbnQgaXMgVG91Y2hFdmVudCB7XG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBldmVyeSBwaXhlbCB0aGF0IHRoZSB1c2VyIGhhcyBkcmFnZ2VkIHNvIHdlIG5lZWQgaXQgdG8gYmVcbiAgLy8gYXMgZmFzdCBhcyBwb3NzaWJsZS4gU2luY2Ugd2Ugb25seSBiaW5kIG1vdXNlIGV2ZW50cyBhbmQgdG91Y2ggZXZlbnRzLCB3ZSBjYW4gYXNzdW1lXG4gIC8vIHRoYXQgaWYgdGhlIGV2ZW50J3MgbmFtZSBzdGFydHMgd2l0aCBgdGAsIGl0J3MgYSB0b3VjaCBldmVudC5cbiAgcmV0dXJuIGV2ZW50LnR5cGVbMF0gPT09ICd0Jztcbn1cblxuLyoqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGEgdG91Y2ggb3IgbW91c2UgZXZlbnQgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LiAqL1xuZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgaWQ6IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICBsZXQgcG9pbnQ6IHtjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlcn0gfCB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzVG91Y2hFdmVudChldmVudCkpIHtcbiAgICAvLyBUaGUgYGlkZW50aWZpZXJgIGNvdWxkIGJlIHVuZGVmaW5lZCBpZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYFRvdWNoRXZlbnQuaWRlbnRpZmllcmAuXG4gICAgLy8gSWYgdGhhdCdzIHRoZSBjYXNlLCBhdHRyaWJ1dGUgdGhlIGZpcnN0IHRvdWNoIHRvIGFsbCBhY3RpdmUgc2xpZGVycy4gVGhpcyBzaG91bGQgc3RpbGwgY292ZXJcbiAgICAvLyB0aGUgbW9zdCBjb21tb24gY2FzZSB3aGlsZSBvbmx5IGJyZWFraW5nIG11bHRpLXRvdWNoLlxuICAgIGlmICh0eXBlb2YgaWQgPT09ICdudW1iZXInKSB7XG4gICAgICBwb2ludCA9IGZpbmRNYXRjaGluZ1RvdWNoKGV2ZW50LnRvdWNoZXMsIGlkKSB8fCBmaW5kTWF0Y2hpbmdUb3VjaChldmVudC5jaGFuZ2VkVG91Y2hlcywgaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBgdG91Y2hlc2Agd2lsbCBiZSBlbXB0eSBmb3Igc3RhcnQvZW5kIGV2ZW50cyBzbyB3ZSBoYXZlIHRvIGZhbGwgYmFjayB0byBgY2hhbmdlZFRvdWNoZXNgLlxuICAgICAgcG9pbnQgPSBldmVudC50b3VjaGVzWzBdIHx8IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwb2ludCA9IGV2ZW50O1xuICB9XG5cbiAgcmV0dXJuIHBvaW50ID8ge3g6IHBvaW50LmNsaWVudFgsIHk6IHBvaW50LmNsaWVudFl9IDogdW5kZWZpbmVkO1xufVxuXG4vKiogRmluZHMgYSBgVG91Y2hgIHdpdGggYSBzcGVjaWZpYyBJRCBpbiBhIGBUb3VjaExpc3RgLiAqL1xuZnVuY3Rpb24gZmluZE1hdGNoaW5nVG91Y2godG91Y2hlczogVG91Y2hMaXN0LCBpZDogbnVtYmVyKTogVG91Y2ggfCB1bmRlZmluZWQge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodG91Y2hlc1tpXS5pZGVudGlmaWVyID09PSBpZCkge1xuICAgICAgcmV0dXJuIHRvdWNoZXNbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqIEdldHMgdGhlIHVuaXF1ZSBJRCBvZiBhIHRvdWNoIHRoYXQgbWF0Y2hlcyBhIHNwZWNpZmljIHNsaWRlci4gKi9cbmZ1bmN0aW9uIGdldFRvdWNoSWRGb3JTbGlkZXIoZXZlbnQ6IFRvdWNoRXZlbnQsIHNsaWRlckhvc3Q6IEhUTUxFbGVtZW50KTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudG91Y2hlc1tpXS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoc2xpZGVySG9zdCA9PT0gdGFyZ2V0IHx8IHNsaWRlckhvc3QuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGV2ZW50LnRvdWNoZXNbaV0uaWRlbnRpZmllcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1zbGlkZXItd3JhcHBlclwiICNzbGlkZXJXcmFwcGVyPlxuICA8ZGl2IGNsYXNzPVwibWF0LXNsaWRlci10cmFjay13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zbGlkZXItdHJhY2stYmFja2dyb3VuZFwiIFtuZ1N0eWxlXT1cIl9nZXRUcmFja0JhY2tncm91bmRTdHlsZXMoKVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtc2xpZGVyLXRyYWNrLWZpbGxcIiBbbmdTdHlsZV09XCJfZ2V0VHJhY2tGaWxsU3R5bGVzKClcIj48L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtYXQtc2xpZGVyLXRpY2tzLWNvbnRhaW5lclwiIFtuZ1N0eWxlXT1cIl9nZXRUaWNrc0NvbnRhaW5lclN0eWxlcygpXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zbGlkZXItdGlja3NcIiBbbmdTdHlsZV09XCJfZ2V0VGlja3NTdHlsZXMoKVwiPjwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zbGlkZXItdGh1bWItY29udGFpbmVyXCIgW25nU3R5bGVdPVwiX2dldFRodW1iQ29udGFpbmVyU3R5bGVzKClcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXNsaWRlci1mb2N1cy1yaW5nXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zbGlkZXItdGh1bWJcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXNsaWRlci10aHVtYi1sYWJlbFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtc2xpZGVyLXRodW1iLWxhYmVsLXRleHRcIj57e2Rpc3BsYXlWYWx1ZX19PC9zcGFuPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19