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
class MatSliderBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatSliderMixinBase = mixinTabIndex(mixinColor(mixinDisabled(MatSliderBase), 'accent'));
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export class MatSlider extends _MatSliderMixinBase {
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
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        this._isSliding = false;
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
                const oldValue = this.value;
                const pointerPosition = getPointerPositionOnPage(event);
                this._isSliding = true;
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
            });
        };
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        this._pointerMove = (event) => {
            if (this._isSliding) {
                // Prevent the slide from selecting anything else.
                event.preventDefault();
                const oldValue = this.value;
                this._lastPointerEvent = event;
                this._updateValueFromPosition(getPointerPositionOnPage(event));
                // Native range elements always emit `input` events when the value changed while sliding.
                if (oldValue != this.value) {
                    this._emitInputEvent();
                }
            }
        };
        /** Called when the user has lifted their pointer. Bound on the document level. */
        this._pointerUp = (event) => {
            if (this._isSliding) {
                event.preventDefault();
                this._removeGlobalEvents();
                this._isSliding = false;
                if (this._valueOnSlideStart != this.value && !this.disabled) {
                    this._emitChangeEvent();
                }
                this._valueOnSlideStart = this._lastPointerEvent = null;
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
        // If the value wasn't explicitly set by the user, set it to the min.
        if (this._value === null) {
            this.value = this._min;
        }
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
        if (this.disabled || hasModifierKey(event)) {
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
        this._isSliding = true;
        event.preventDefault();
    }
    _onKeyup() {
        this._isSliding = false;
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
                styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mat-slider:not(.mat-slider-disabled):active,.mat-slider.mat-slider-sliding:not(.mat-slider-disabled){cursor:-webkit-grabbing;cursor:grabbing}.mat-slider-wrapper{position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider.cdk-keyboard-focused .mat-slider-focus-ring,.mat-slider.cdk-program-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb{cursor:-webkit-grab;cursor:grab}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(0.7);transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-radius 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.cdk-high-contrast-active .mat-slider-thumb-label{outline:solid 1px}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-sliding .mat-slider-track-fill,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-thumb-container{transition-duration:0ms}.mat-slider-has-ticks .mat-slider-wrapper::after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{display:none}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text{opacity:1}.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(0.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mat-slider-horizontal .mat-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(0.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text{transform:none}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mat-slider-vertical .mat-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(0.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}.mat-slider._mat-animation-noopable .mat-slider-track-fill,.mat-slider._mat-animation-noopable .mat-slider-track-background,.mat-slider._mat-animation-noopable .mat-slider-ticks,.mat-slider._mat-animation-noopable .mat-slider-thumb-container,.mat-slider._mat-animation-noopable .mat-slider-focus-ring,.mat-slider._mat-animation-noopable .mat-slider-thumb,.mat-slider._mat-animation-noopable .mat-slider-thumb-label,.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after{transition:none}\n"]
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
function getPointerPositionOnPage(event) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    return { x: point.clientX, y: point.clientY };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBT0wsVUFBVSxFQUNWLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUVsQyxNQUFNLGtCQUFrQixHQUFH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T0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUMvQixDQUFDO0FBRUQsK0VBQStFO0FBQy9FLFNBQVMsd0JBQXdCLENBQUMsS0FBOEI7SUFDOUQsNEZBQTRGO0lBQzVGLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFGLE9BQU8sRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuY29uc3QgYWN0aXZlRXZlbnRPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogZmFsc2V9KTtcblxuLyoqXG4gKiBWaXN1YWxseSwgYSAzMHB4IHNlcGFyYXRpb24gYmV0d2VlbiB0aWNrIG1hcmtzIGxvb2tzIGJlc3QuIFRoaXMgaXMgdmVyeSBzdWJqZWN0aXZlIGJ1dCBpdCBpc1xuICogdGhlIGRlZmF1bHQgc2VwYXJhdGlvbiB3ZSBjaG9zZS5cbiAqL1xuY29uc3QgTUlOX0FVVE9fVElDS19TRVBBUkFUSU9OID0gMzA7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGEgZGlzYWJsZWQgc2xpZGVyLiAqL1xuY29uc3QgRElTQUJMRURfVEhVTUJfR0FQID0gNztcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYSBub24tYWN0aXZlIHNsaWRlciBhdCBpdHMgbWluaW11bSB2YWx1ZS4gKi9cbmNvbnN0IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQID0gNztcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYW4gYWN0aXZlIHNsaWRlciBhdCBpdHMgbWluaW11bSB2YWx1ZS4gKi9cbmNvbnN0IE1JTl9WQUxVRV9BQ1RJVkVfVEhVTUJfR0FQID0gMTA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtc2xpZGVyIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBUaGlzIGFsbG93cyBpdCB0byBzdXBwb3J0IFsobmdNb2RlbCldIGFuZCBbZm9ybUNvbnRyb2xdLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVyKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBBIHNpbXBsZSBjaGFuZ2UgZXZlbnQgZW1pdHRlZCBieSB0aGUgTWF0U2xpZGVyIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJDaGFuZ2Uge1xuICAvKiogVGhlIE1hdFNsaWRlciB0aGF0IGNoYW5nZWQuICovXG4gIHNvdXJjZTogTWF0U2xpZGVyO1xuXG4gIC8qKiBUaGUgbmV3IHZhbHVlIG9mIHRoZSBzb3VyY2Ugc2xpZGVyLiAqL1xuICB2YWx1ZTogbnVtYmVyIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRTbGlkZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U2xpZGVyQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRTbGlkZXJNaXhpbkJhc2U6XG4gICAgSGFzVGFiSW5kZXhDdG9yICZcbiAgICBDYW5Db2xvckN0b3IgJlxuICAgIENhbkRpc2FibGVDdG9yICZcbiAgICB0eXBlb2YgTWF0U2xpZGVyQmFzZSA9XG4gICAgICAgIG1peGluVGFiSW5kZXgobWl4aW5Db2xvcihtaXhpbkRpc2FibGVkKE1hdFNsaWRlckJhc2UpLCAnYWNjZW50JykpO1xuXG4vKipcbiAqIEFsbG93cyB1c2VycyB0byBzZWxlY3QgZnJvbSBhIHJhbmdlIG9mIHZhbHVlcyBieSBtb3ZpbmcgdGhlIHNsaWRlciB0aHVtYi4gSXQgaXMgc2ltaWxhciBpblxuICogYmVoYXZpb3IgdG8gdGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJyYW5nZVwiPmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlcicsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVyJyxcbiAgcHJvdmlkZXJzOiBbTUFUX1NMSURFUl9WQUxVRV9BQ0NFU1NPUl0sXG4gIGhvc3Q6IHtcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICcoa2V5dXApJzogJ19vbktleXVwKCknLFxuICAgICcobW91c2VlbnRlciknOiAnX29uTW91c2VlbnRlcigpJyxcblxuICAgIC8vIE9uIFNhZmFyaSBzdGFydGluZyB0byBzbGlkZSB0ZW1wb3JhcmlseSB0cmlnZ2VycyB0ZXh0IHNlbGVjdGlvbiBtb2RlIHdoaWNoXG4gICAgLy8gc2hvdyB0aGUgd3JvbmcgY3Vyc29yLiBXZSBwcmV2ZW50IGl0IGJ5IHN0b3BwaW5nIHRoZSBgc2VsZWN0c3RhcnRgIGV2ZW50LlxuICAgICcoc2VsZWN0c3RhcnQpJzogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpJyxcbiAgICAnY2xhc3MnOiAnbWF0LXNsaWRlciBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAncm9sZSc6ICdzbGlkZXInLFxuICAgICdbdGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtaW4nLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICd2YWx1ZScsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oYXMtdGlja3NdJzogJ3RpY2tJbnRlcnZhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWF4aXMtaW52ZXJ0ZWRdJzogJ19zaG91bGRJbnZlcnRBeGlzKCknLFxuICAgIC8vIENsYXNzIGJpbmRpbmcgd2hpY2ggaXMgb25seSB1c2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgYXMgdGhlcmUgaXMgbm8gb3RoZXJcbiAgICAvLyB3YXkgZm9yIHRoZSBoYXJuZXNzIHRvIGRldGVjdCBpZiBtb3VzZSBjb29yZGluYXRlcyBuZWVkIHRvIGJlIGludmVydGVkLlxuICAgICdbY2xhc3MubWF0LXNsaWRlci1pbnZlcnQtbW91c2UtY29vcmRzXSc6ICdfc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKScsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXNsaWRpbmddJzogJ19pc1NsaWRpbmcnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci10aHVtYi1sYWJlbC1zaG93aW5nXSc6ICd0aHVtYkxhYmVsJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItbWluLXZhbHVlXSc6ICdfaXNNaW5WYWx1ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGlkZS1sYXN0LXRpY2tdJzpcbiAgICAgICAgJ2Rpc2FibGVkIHx8IF9pc01pblZhbHVlKCkgJiYgX2dldFRodW1iR2FwKCkgJiYgX3Nob3VsZEludmVydEF4aXMoKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnY29sb3InLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlciBleHRlbmRzIF9NYXRTbGlkZXJNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIENhbkNvbG9yLCBBZnRlclZpZXdJbml0LCBIYXNUYWJJbmRleCB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBpbnZlcnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9pbnZlcnQ7IH1cbiAgc2V0IGludmVydCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2ludmVydCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW52ZXJ0ID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHZhbHVlIHRoYXQgdGhlIHNsaWRlciBjYW4gaGF2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fbWF4OyB9XG4gIHNldCBtYXgodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWF4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fbWF4KTtcbiAgICB0aGlzLl9wZXJjZW50ID0gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZSh0aGlzLl92YWx1ZSk7XG5cbiAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBudW1iZXIgPSAxMDA7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbHVlIHRoYXQgdGhlIHNsaWRlciBjYW4gaGF2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fbWluOyB9XG4gIHNldCBtaW4odjogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fbWluKTtcblxuICAgIC8vIElmIHRoZSB2YWx1ZSB3YXNuJ3QgZXhwbGljaXRseSBzZXQgYnkgdGhlIHVzZXIsIHNldCBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21pbjogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIHZhbHVlcyBhdCB3aGljaCB0aGUgdGh1bWIgd2lsbCBzbmFwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RlcCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc3RlcDsgfVxuICBzZXQgc3RlcCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9zdGVwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fc3RlcCk7XG5cbiAgICBpZiAodGhpcy5fc3RlcCAlIDEgIT09IDApIHtcbiAgICAgIHRoaXMuX3JvdW5kVG9EZWNpbWFsID0gdGhpcy5fc3RlcC50b1N0cmluZygpLnNwbGl0KCcuJykucG9wKCkhLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGlzIGNvdWxkIG1vZGlmeSB0aGUgbGFiZWwsIHdlIG5lZWQgdG8gbm90aWZ5IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX3N0ZXA6IG51bWJlciA9IDE7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIHNob3cgdGhlIHRodW1iIGxhYmVsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdGh1bWJMYWJlbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3RodW1iTGFiZWw7IH1cbiAgc2V0IHRodW1iTGFiZWwodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fdGh1bWJMYWJlbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfdGh1bWJMYWJlbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gc2hvdyB0aWNrcy4gUmVsYXRpdmUgdG8gdGhlIHN0ZXAgc28gdGhhdCBhIHRpY2sgYWx3YXlzIGFwcGVhcnMgb24gYSBzdGVwLlxuICAgKiBFeDogVGljayBpbnRlcnZhbCBvZiA0IHdpdGggYSBzdGVwIG9mIDMgd2lsbCBkcmF3IGEgdGljayBldmVyeSA0IHN0ZXBzIChldmVyeSAxMiB2YWx1ZXMpLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRpY2tJbnRlcnZhbCgpIHsgcmV0dXJuIHRoaXMuX3RpY2tJbnRlcnZhbDsgfVxuICBzZXQgdGlja0ludGVydmFsKHZhbHVlOiAnYXV0bycgfCBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgPT09ICdhdXRvJykge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gJ2F1dG8nO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgdGhpcy5fdGlja0ludGVydmFsIGFzIG51bWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IDA7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3RpY2tJbnRlcnZhbDogJ2F1dG8nIHwgbnVtYmVyID0gMDtcblxuICAvKiogVmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB8IG51bGwge1xuICAgIC8vIElmIHRoZSB2YWx1ZSBuZWVkcyB0byBiZSByZWFkIGFuZCBpdCBpcyBzdGlsbCB1bmluaXRpYWxpemVkLCBpbml0aWFsaXplIGl0IHRvIHRoZSBtaW4uXG4gICAgaWYgKHRoaXMuX3ZhbHVlID09PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fbWluO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbiAgc2V0IHZhbHVlKHY6IG51bWJlciB8IG51bGwpIHtcbiAgICBpZiAodiAhPT0gdGhpcy5fdmFsdWUpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYpO1xuXG4gICAgICAvLyBXaGlsZSBpbmNyZW1lbnRpbmcgYnkgYSBkZWNpbWFsIHdlIGNhbiBlbmQgdXAgd2l0aCB2YWx1ZXMgbGlrZSAzMy4zMDAwMDAwMDAwMDAwMDQuXG4gICAgICAvLyBUcnVuY2F0ZSBpdCB0byBlbnN1cmUgdGhhdCBpdCBtYXRjaGVzIHRoZSBsYWJlbCBhbmQgdG8gbWFrZSBpdCBlYXNpZXIgdG8gd29yayB3aXRoLlxuICAgICAgaWYgKHRoaXMuX3JvdW5kVG9EZWNpbWFsKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHRoaXMuX3JvdW5kVG9EZWNpbWFsKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9wZXJjZW50ID0gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZSh0aGlzLl92YWx1ZSk7XG5cbiAgICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92YWx1ZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGZvcm1hdCB0aGUgdmFsdWUgYmVmb3JlIGl0IGlzIGRpc3BsYXllZFxuICAgKiBpbiB0aGUgdGh1bWIgbGFiZWwuIENhbiBiZSB1c2VkIHRvIGZvcm1hdCB2ZXJ5IGxhcmdlIG51bWJlciBpbiBvcmRlclxuICAgKiBmb3IgdGhlbSB0byBmaXQgaW50byB0aGUgc2xpZGVyIHRodW1iLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheVdpdGg6ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyB2ZXJ0aWNhbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZlcnRpY2FsKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdmVydGljYWw7IH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdmVydGljYWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3ZlcnRpY2FsID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBtb3Zlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGlucHV0OiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyQ2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNsaWRlciBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlciB8IG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPigpO1xuXG4gIC8qKiBUaGUgdmFsdWUgdG8gYmUgdXNlZCBmb3IgZGlzcGxheSBwdXJwb3Nlcy4gKi9cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgIGlmICh0aGlzLmRpc3BsYXlXaXRoKSB7XG4gICAgICAvLyBWYWx1ZSBpcyBuZXZlciBudWxsIGJ1dCBzaW5jZSBzZXR0ZXJzIGFuZCBnZXR0ZXJzIGNhbm5vdCBoYXZlXG4gICAgICAvLyBkaWZmZXJlbnQgdHlwZXMsIHRoZSB2YWx1ZSBnZXR0ZXIgaXMgYWxzbyB0eXBlZCB0byByZXR1cm4gbnVsbC5cbiAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlXaXRoKHRoaXMudmFsdWUhKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBjb3VsZCBiZSBpbXByb3ZlZCBmdXJ0aGVyIGJ5IHJvdW5kaW5nIHNvbWV0aGluZyBsaWtlIDAuOTk5IHRvIDEgb3JcbiAgICAvLyAwLjg5OSB0byAwLjksIGhvd2V2ZXIgaXQgaXMgdmVyeSBwZXJmb3JtYW5jZSBzZW5zaXRpdmUsIGJlY2F1c2UgaXQgZ2V0cyBjYWxsZWQgb25cbiAgICAvLyBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmICh0aGlzLl9yb3VuZFRvRGVjaW1hbCAmJiB0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUgJSAxICE9PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS50b0ZpeGVkKHRoaXMuX3JvdW5kVG9EZWNpbWFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZSB8fCAwO1xuICB9XG5cbiAgLyoqIHNldCBmb2N1cyB0byB0aGUgaG9zdCBlbGVtZW50ICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIGJsdXIgdGhlIGhvc3QgZWxlbWVudCAqL1xuICBibHVyKCkge1xuICAgIHRoaXMuX2JsdXJIb3N0RWxlbWVudCgpO1xuICB9XG5cbiAgLyoqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuICovXG4gIG9uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgLyoqIFRoZSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgdGhhdCBjb2luY2lkZXMgd2l0aCB0aGUgdmFsdWUuICovXG4gIGdldCBwZXJjZW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jbGFtcCh0aGlzLl9wZXJjZW50KTsgfVxuICBwcml2YXRlIF9wZXJjZW50OiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdGh1bWIgaXMgc2xpZGluZy5cbiAgICogVXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlcmUgc2hvdWxkIGJlIGEgdHJhbnNpdGlvbiBmb3IgdGhlIHRodW1iIGFuZCBmaWxsIHRyYWNrLlxuICAgKi9cbiAgX2lzU2xpZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgc2xpZGVyIGlzIGFjdGl2ZSAoY2xpY2tlZCBvciBzbGlkaW5nKS5cbiAgICogVXNlZCB0byBzaHJpbmsgYW5kIGdyb3cgdGhlIHRodW1iIGFzIGFjY29yZGluZyB0byB0aGUgTWF0ZXJpYWwgRGVzaWduIHNwZWMuXG4gICAqL1xuICBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXhpcyBvZiB0aGUgc2xpZGVyIGlzIGludmVydGVkLlxuICAgKiAoaS5lLiB3aGV0aGVyIG1vdmluZyB0aGUgdGh1bWIgaW4gdGhlIHBvc2l0aXZlIHggb3IgeSBkaXJlY3Rpb24gZGVjcmVhc2VzIHRoZSBzbGlkZXIncyB2YWx1ZSkuXG4gICAqL1xuICBfc2hvdWxkSW52ZXJ0QXhpcygpIHtcbiAgICAvLyBTdGFuZGFyZCBub24taW52ZXJ0ZWQgbW9kZSBmb3IgYSB2ZXJ0aWNhbCBzbGlkZXIgc2hvdWxkIGJlIGRyYWdnaW5nIHRoZSB0aHVtYiBmcm9tIGJvdHRvbSB0b1xuICAgIC8vIHRvcC4gSG93ZXZlciBmcm9tIGEgeS1heGlzIHN0YW5kcG9pbnQgdGhpcyBpcyBpbnZlcnRlZC5cbiAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbCA/ICF0aGlzLmludmVydCA6IHRoaXMuaW52ZXJ0O1xuICB9XG5cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuICBfaXNNaW5WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wZXJjZW50ID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gbGVhdmUgYmV0d2VlbiB0aGUgc2xpZGVyIHRodW1iIGFuZCB0aGUgdHJhY2sgZmlsbCAmIHRyYWNrIGJhY2tncm91bmRcbiAgICogZWxlbWVudHMuXG4gICAqL1xuICBfZ2V0VGh1bWJHYXAoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybiBESVNBQkxFRF9USFVNQl9HQVA7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc01pblZhbHVlKCkgJiYgIXRoaXMudGh1bWJMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlID8gTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgOiBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGJhY2tncm91bmQgZWxlbWVudC4gKi9cbiAgX2dldFRyYWNrQmFja2dyb3VuZFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHsxIC0gdGhpcy5wZXJjZW50fSwgMWAgOiBgJHsxIC0gdGhpcy5wZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnLScgOiAnJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl9nZXRUaHVtYkdhcCgpfXB4KSBzY2FsZTNkKCR7c2NhbGV9KWBcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0cmFjayBmaWxsIGVsZW1lbnQuICovXG4gIF9nZXRUcmFja0ZpbGxTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgcGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHtwZXJjZW50fSwgMWAgOiBgJHtwZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnJyA6ICctJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl9nZXRUaHVtYkdhcCgpfXB4KSBzY2FsZTNkKCR7c2NhbGV9KWAsXG4gICAgICAvLyBpT1MgU2FmYXJpIGhhcyBhIGJ1ZyB3aGVyZSBpdCB3b24ndCByZS1yZW5kZXIgZWxlbWVudHMgd2hpY2ggc3RhcnQgb2YgYXMgYHNjYWxlKDApYCB1bnRpbFxuICAgICAgLy8gc29tZXRoaW5nIGZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb24gaXQuIFNpbmNlIHdlJ2xsIGVuZCB1cCB3aXRoIGBzY2FsZSgwKWAgd2hlblxuICAgICAgLy8gdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgaXMgMCwgd2UgY2FuIGVhc2lseSBnZXQgaW50byB0aGlzIHNpdHVhdGlvbi4gV2UgZm9yY2UgYVxuICAgICAgLy8gcmVjYWxjdWxhdGlvbiBieSBjaGFuZ2luZyB0aGUgZWxlbWVudCdzIGBkaXNwbGF5YCB3aGVuIGl0IGdvZXMgZnJvbSAwIHRvIGFueSBvdGhlciB2YWx1ZS5cbiAgICAgIGRpc3BsYXk6IHBlcmNlbnQgPT09IDAgPyAnbm9uZScgOiAnJ1xuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGNvbnRhaW5lciBlbGVtZW50LiAqL1xuICBfZ2V0VGlja3NDb250YWluZXJTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGlja3MgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGxldCBzaWduID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnJyA6ICctJztcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCAvIDIgKiAxMDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHtvZmZzZXR9JSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdGlja3MgZWxlbWVudC4gKi9cbiAgX2dldFRpY2tzU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCB0aWNrU2l6ZSA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgKiAxMDA7XG4gICAgbGV0IGJhY2tncm91bmRTaXplID0gdGhpcy52ZXJ0aWNhbCA/IGAycHggJHt0aWNrU2l6ZX0lYCA6IGAke3RpY2tTaXplfSUgMnB4YDtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRGVwZW5kaW5nIG9uIHRoZSBkaXJlY3Rpb24gd2UgcHVzaGVkIHRoZSB0aWNrcyBjb250YWluZXIsIHB1c2ggdGhlIHRpY2tzIHRoZSBvcHBvc2l0ZVxuICAgIC8vIGRpcmVjdGlvbiB0byByZS1jZW50ZXIgdGhlbSBidXQgY2xpcCBvZmYgdGhlIGVuZCBlZGdlLiBJbiBSVEwgbGFuZ3VhZ2VzIHdlIG5lZWQgdG8gZmxpcCB0aGVcbiAgICAvLyB0aWNrcyAxODAgZGVncmVlcyBzbyB3ZSdyZSByZWFsbHkgY3V0dGluZyBvZmYgdGhlIGVuZCBlZGdlIGFiZCBub3QgdGhlIHN0YXJ0LlxuICAgIGxldCBzaWduID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnLScgOiAnJztcbiAgICBsZXQgcm90YXRlID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnIHJvdGF0ZSgxODBkZWcpJyA6ICcnO1xuICAgIGxldCBzdHlsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnYmFja2dyb3VuZFNpemUnOiBiYWNrZ3JvdW5kU2l6ZSxcbiAgICAgIC8vIFdpdGhvdXQgdHJhbnNsYXRlWiB0aWNrcyBzb21ldGltZXMgaml0dGVyIGFzIHRoZSBzbGlkZXIgbW92ZXMgb24gQ2hyb21lICYgRmlyZWZveC5cbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlWigwKSB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RpY2tTaXplIC8gMn0lKSR7cm90YXRlfWBcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUoKSAmJiB0aGlzLl9nZXRUaHVtYkdhcCgpKSB7XG4gICAgICBjb25zdCBzaG91bGRJbnZlcnRBeGlzID0gdGhpcy5fc2hvdWxkSW52ZXJ0QXhpcygpO1xuICAgICAgbGV0IHNpZGU6IHN0cmluZztcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgc2lkZSA9IHNob3VsZEludmVydEF4aXMgPyAnQm90dG9tJyA6ICdUb3AnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2lkZSA9IHNob3VsZEludmVydEF4aXMgPyAnUmlnaHQnIDogJ0xlZnQnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXNbYHBhZGRpbmcke3NpZGV9YF0gPSBgJHt0aGlzLl9nZXRUaHVtYkdhcCgpfXB4YDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgX2dldFRodW1iQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGNvbnN0IHNob3VsZEludmVydEF4aXMgPSB0aGlzLl9zaG91bGRJbnZlcnRBeGlzKCk7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGh1bWIgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGxldCBpbnZlcnRPZmZzZXQgPVxuICAgICAgICAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXNob3VsZEludmVydEF4aXMgOiBzaG91bGRJbnZlcnRBeGlzO1xuICAgIGxldCBvZmZzZXQgPSAoaW52ZXJ0T2Zmc2V0ID8gdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudCkgKiAxMDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlJHtheGlzfSgtJHtvZmZzZXR9JSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBUaGUgc2l6ZSBvZiBhIHRpY2sgaW50ZXJ2YWwgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBzaXplIG9mIHRoZSB0cmFjay4gKi9cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsUGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVyRGltZW5zaW9uczogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIERlY2ltYWwgcGxhY2VzIHRvIHJvdW5kIHRvLCBiYXNlZCBvbiB0aGUgc3RlcCBhbW91bnQuICovXG4gIHByaXZhdGUgX3JvdW5kVG9EZWNpbWFsOiBudW1iZXI7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0aGUgRGlyZWN0aW9uYWxpdHkgY2hhbmdlIEV2ZW50RW1pdHRlci4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIHNsaWRlciB3aGVuIHRoZSBzbGlkZSBzdGFydCBldmVudCBmaXJlcy4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPblNsaWRlU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgaW5uZXIgc2xpZGVyIHdyYXBwZXIgZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnc2xpZGVyV3JhcHBlcicpIHByaXZhdGUgX3NsaWRlcldyYXBwZXI6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgbW91c2UgZXZlbnRzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gYSBzbGlkZXIgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlaXIgZGlzdGFuY2VcbiAgICogZnJvbSB0aGUgcmlnaHQgb3IgYm90dG9tIGVkZ2Ugb2YgdGhlIHNsaWRlciBhcyBvcHBvc2VkIHRvIHRoZSB0b3Agb3IgbGVmdC5cbiAgICovXG4gIF9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpIHtcbiAgICBjb25zdCBzaG91bGRJbnZlcnRBeGlzID0gdGhpcy5fc2hvdWxkSW52ZXJ0QXhpcygpO1xuICAgIHJldHVybiAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXNob3VsZEludmVydEF4aXMgOiBzaG91bGRJbnZlcnRBeGlzO1xuICB9XG5cbiAgLyoqIFRoZSBsYW5ndWFnZSBkaXJlY3Rpb24gZm9yIHRoaXMgc2xpZGVyIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2dldERpcmVjdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT0gJ3J0bCcpID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgbGFzdCBwb2ludGVyIGV2ZW50IHRoYXQgd2FzIGNhcHR1cmVkIGJ5IHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX2xhc3RQb2ludGVyRXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50IHwgbnVsbDtcblxuICAvKiogVXNlZCB0byBzdWJzY3JpYmUgdG8gZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9kb2N1bWVudCA9IF9kb2N1bWVudDtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICBfbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yXG4gICAgICAgIC5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAgIC5zdWJzY3JpYmUoKG9yaWdpbjogRm9jdXNPcmlnaW4pID0+IHtcbiAgICAgICAgICB0aGlzLl9pc0FjdGl2ZSA9ICEhb3JpZ2luICYmIG9yaWdpbiAhPT0gJ2tleWJvYXJkJztcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuX2Rpci5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlR2xvYmFsRXZlbnRzKCk7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgX29uTW91c2VlbnRlcigpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIHNhdmUgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlciBoZXJlIHNvIHdlIGNhbiB1c2UgdGhlbSB0byB1cGRhdGUgdGhlIHNwYWNpbmcgb2YgdGhlXG4gICAgLy8gdGlja3MgYW5kIGRldGVybWluZSB3aGVyZSBvbiB0aGUgc2xpZGVyIGNsaWNrIGFuZCBzbGlkZSBldmVudHMgaGFwcGVuLlxuICAgIHRoaXMuX3NsaWRlckRpbWVuc2lvbnMgPSB0aGlzLl9nZXRTbGlkZXJEaW1lbnNpb25zKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpO1xuICB9XG5cbiAgX29uRm9jdXMoKSB7XG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25CbHVyKCkge1xuICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIFBBR0VfVVA6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgtMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICAvLyBOT1RFOiBGb3IgYSBzaWdodGVkIHVzZXIgaXQgd291bGQgbWFrZSBtb3JlIHNlbnNlIHRoYXQgd2hlbiB0aGV5IHByZXNzIGFuIGFycm93IGtleSBvbiBhblxuICAgICAgICAvLyBpbnZlcnRlZCBzbGlkZXIgdGhlIHRodW1iIG1vdmVzIGluIHRoYXQgZGlyZWN0aW9uLiBIb3dldmVyIGZvciBhIGJsaW5kIHVzZXIsIG5vdGhpbmdcbiAgICAgICAgLy8gYWJvdXQgdGhlIHNsaWRlciBpbmRpY2F0ZXMgdGhhdCBpdCBpcyBpbnZlcnRlZC4gVGhleSB3aWxsIGV4cGVjdCBsZWZ0IHRvIGJlIGRlY3JlbWVudCxcbiAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiBob3cgaXQgYXBwZWFycyBvbiB0aGUgc2NyZWVuLiBGb3Igc3BlYWtlcnMgb2ZSVEwgbGFuZ3VhZ2VzLCB0aGV5IHByb2JhYmx5XG4gICAgICAgIC8vIGV4cGVjdCBsZWZ0IHRvIG1lYW4gaW5jcmVtZW50LiBUaGVyZWZvcmUgd2UgZmxpcCB0aGUgbWVhbmluZyBvZiB0aGUgc2lkZSBhcnJvdyBrZXlzIGZvclxuICAgICAgICAvLyBSVEwuIEZvciBpbnZlcnRlZCBzbGlkZXJzIHdlIHByZWZlciBhIGdvb2QgYTExeSBleHBlcmllbmNlIHRvIGhhdmluZyBpdCBcImxvb2sgcmlnaHRcIiBmb3JcbiAgICAgICAgLy8gc2lnaHRlZCB1c2VycywgdGhlcmVmb3JlIHdlIGRvIG5vdCBzd2FwIHRoZSBtZWFuaW5nLlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICAvLyBTZWUgY29tbWVudCBvbiBMRUZUX0FSUk9XIGFib3V0IHRoZSBjb25kaXRpb25zIHVuZGVyIHdoaWNoIHdlIGZsaXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/IC0xIDogMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIFJldHVybiBpZiB0aGUga2V5IGlzIG5vdCBvbmUgdGhhdCB3ZSBleHBsaWNpdGx5IGhhbmRsZSB0byBhdm9pZCBjYWxsaW5nIHByZXZlbnREZWZhdWx0IG9uXG4gICAgICAgIC8vIGl0LlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1NsaWRpbmcgPSB0cnVlO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBfb25LZXl1cCgpIHtcbiAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgcHV0IHRoZWlyIHBvaW50ZXIgZG93biBvbiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9wb2ludGVyRG93biA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiB0aGUgc2xpZGVyIGlzIGRpc2FibGVkIG9yIHRoZVxuICAgIC8vIHVzZXIgaXMgdXNpbmcgYW55dGhpbmcgb3RoZXIgdGhhbiB0aGUgbWFpbiBtb3VzZSBidXR0b24uXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5faXNTbGlkaW5nIHx8ICghaXNUb3VjaEV2ZW50KGV2ZW50KSAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICBjb25zdCBwb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBldmVudDtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICB0aGlzLl9vbk1vdXNlZW50ZXIoKTsgLy8gU2ltdWxhdGUgbW91c2VlbnRlciBpbiBjYXNlIHRoaXMgaXMgYSBtb2JpbGUgZGV2aWNlLlxuICAgICAgdGhpcy5fYmluZEdsb2JhbEV2ZW50cyhldmVudCk7XG4gICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihwb2ludGVyUG9zaXRpb24pO1xuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSBvbGRWYWx1ZTtcblxuICAgICAgLy8gRW1pdCBhIGNoYW5nZSBhbmQgaW5wdXQgZXZlbnQgaWYgdGhlIHZhbHVlIGNoYW5nZWQuXG4gICAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBtb3ZlZCB0aGVpciBwb2ludGVyIGFmdGVyXG4gICAqIHN0YXJ0aW5nIHRvIGRyYWcuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC5cbiAgICovXG4gIHByaXZhdGUgX3BvaW50ZXJNb3ZlID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIC8vIFByZXZlbnQgdGhlIHNsaWRlIGZyb20gc2VsZWN0aW5nIGFueXRoaW5nIGVsc2UuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24oZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KSk7XG5cbiAgICAgIC8vIE5hdGl2ZSByYW5nZSBlbGVtZW50cyBhbHdheXMgZW1pdCBgaW5wdXRgIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VkIHdoaWxlIHNsaWRpbmcuXG4gICAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbGlmdGVkIHRoZWlyIHBvaW50ZXIuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgIT0gdGhpcy52YWx1ZSAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBoYXMgbG9zdCBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgd2luZG93IGlzIGJsdXJyZWQgd2hpbGUgZHJhZ2dpbmcgd2UgbmVlZCB0byBzdG9wIGRyYWdnaW5nIGJlY2F1c2UgdGhlXG4gICAgLy8gYnJvd3NlciB3b24ndCBkaXNwYXRjaCB0aGUgYG1vdXNldXBgIGFuZCBgdG91Y2hlbmRgIGV2ZW50cyBhbnltb3JlLlxuICAgIGlmICh0aGlzLl9sYXN0UG9pbnRlckV2ZW50KSB7XG4gICAgICB0aGlzLl9wb2ludGVyVXAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBvdXIgZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMuIFRoZXkncmUgYm91bmQgYXQgdGhlIGRvY3VtZW50IGxldmVsIGFuZCBvbmx5IHdoaWxlXG4gICAqIGRyYWdnaW5nIHNvIHRoYXQgdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIGtlZXAgdGhlaXIgcG9pbnRlciBleGFjdGx5IG92ZXIgdGhlIHNsaWRlclxuICAgKiBhcyB0aGV5J3JlIHN3aXBpbmcgYWNyb3NzIHRoZSBzY3JlZW4uXG4gICAqL1xuICBwcml2YXRlIF9iaW5kR2xvYmFsRXZlbnRzKHRyaWdnZXJFdmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgYmluZCB0aGUgZXZlbnRzIHRvIHRoZSBgZG9jdW1lbnRgLCBiZWNhdXNlIGl0IGFsbG93cyB1cyB0byBjYXB0dXJlXG4gICAgLy8gZHJhZyBjYW5jZWwgZXZlbnRzIHdoZXJlIHRoZSB1c2VyJ3MgcG9pbnRlciBpcyBvdXRzaWRlIHRoZSBicm93c2VyIHdpbmRvdy5cbiAgICBjb25zdCBkb2N1bWVudCA9IHRoaXMuX2RvY3VtZW50O1xuICAgIGNvbnN0IGlzVG91Y2ggPSBpc1RvdWNoRXZlbnQodHJpZ2dlckV2ZW50KTtcbiAgICBjb25zdCBtb3ZlRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZSc7XG4gICAgY29uc3QgZW5kRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCc7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnROYW1lLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbnkgZ2xvYmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlIG1heSBoYXZlIGFkZGVkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVHbG9iYWxFdmVudHMoKSB7XG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9kb2N1bWVudDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbmNyZW1lbnRzIHRoZSBzbGlkZXIgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBzdGVwcyAobmVnYXRpdmUgbnVtYmVyIGRlY3JlbWVudHMpLiAqL1xuICBwcml2YXRlIF9pbmNyZW1lbnQobnVtU3RlcHM6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcCgodGhpcy52YWx1ZSB8fCAwKSArIHRoaXMuc3RlcCAqIG51bVN0ZXBzLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbmV3IHZhbHVlIGZyb20gdGhlIG5ldyBwaHlzaWNhbCBsb2NhdGlvbi4gVGhlIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHNuYXBwZWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvczoge3g6IG51bWJlciwgeTogbnVtYmVyfSkge1xuICAgIGlmICghdGhpcy5fc2xpZGVyRGltZW5zaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy50b3AgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmxlZnQ7XG4gICAgbGV0IHNpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgIGxldCBwb3NDb21wb25lbnQgPSB0aGlzLnZlcnRpY2FsID8gcG9zLnkgOiBwb3MueDtcblxuICAgIC8vIFRoZSBleGFjdCB2YWx1ZSBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIGV2ZW50IGFuZCB1c2VkIHRvIGZpbmQgdGhlIGNsb3Nlc3Qgc25hcCB2YWx1ZS5cbiAgICBsZXQgcGVyY2VudCA9IHRoaXMuX2NsYW1wKChwb3NDb21wb25lbnQgLSBvZmZzZXQpIC8gc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSkge1xuICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBzdGVwcyBtYXkgbm90IGRpdmlkZSBjbGVhbmx5IGludG8gdGhlIG1heCB2YWx1ZSwgaWYgdGhlIHVzZXJcbiAgICAvLyBzbGlkIHRvIDAgb3IgMTAwIHBlcmNlbnQsIHdlIGp1bXAgdG8gdGhlIG1pbi9tYXggdmFsdWUuIFRoaXMgYXBwcm9hY2hcbiAgICAvLyBpcyBzbGlnaHRseSBtb3JlIGludHVpdGl2ZSB0aGFuIHVzaW5nIGBNYXRoLmNlaWxgIGJlbG93LCBiZWNhdXNlIGl0XG4gICAgLy8gZm9sbG93cyB0aGUgdXNlcidzIHBvaW50ZXIgY2xvc2VyLlxuICAgIGlmIChwZXJjZW50ID09PSAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgfSBlbHNlIGlmIChwZXJjZW50ID09PSAxKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4YWN0VmFsdWUgPSB0aGlzLl9jYWxjdWxhdGVWYWx1ZShwZXJjZW50KTtcblxuICAgICAgLy8gVGhpcyBjYWxjdWxhdGlvbiBmaW5kcyB0aGUgY2xvc2VzdCBzdGVwIGJ5IGZpbmRpbmcgdGhlIGNsb3Nlc3RcbiAgICAgIC8vIHdob2xlIG51bWJlciBkaXZpc2libGUgYnkgdGhlIHN0ZXAgcmVsYXRpdmUgdG8gdGhlIG1pbi5cbiAgICAgIGNvbnN0IGNsb3Nlc3RWYWx1ZSA9IE1hdGgucm91bmQoKGV4YWN0VmFsdWUgLSB0aGlzLm1pbikgLyB0aGlzLnN0ZXApICogdGhpcy5zdGVwICsgdGhpcy5taW47XG5cbiAgICAgIC8vIFRoZSB2YWx1ZSBuZWVkcyB0byBzbmFwIHRvIHRoZSBtaW4gYW5kIG1heC5cbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcChjbG9zZXN0VmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGlucHV0IGV2ZW50IHdoZW4gdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdElucHV0RXZlbnQoKSB7XG4gICAgdGhpcy5pbnB1dC5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpY2tzIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGggb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpIHtcbiAgICBpZiAoIXRoaXMudGlja0ludGVydmFsIHx8ICF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGlja0ludGVydmFsID09ICdhdXRvJykge1xuICAgICAgbGV0IHRyYWNrU2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgICBsZXQgcGl4ZWxzUGVyU3RlcCA9IHRyYWNrU2l6ZSAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgIGxldCBzdGVwc1BlclRpY2sgPSBNYXRoLmNlaWwoTUlOX0FVVE9fVElDS19TRVBBUkFUSU9OIC8gcGl4ZWxzUGVyU3RlcCk7XG4gICAgICBsZXQgcGl4ZWxzUGVyVGljayA9IHN0ZXBzUGVyVGljayAqIHRoaXMuc3RlcDtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSBwaXhlbHNQZXJUaWNrIC8gdHJhY2tTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gdGhpcy50aWNrSW50ZXJ2YWwgKiB0aGlzLnN0ZXAgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBzbGlkZXIgY2hhbmdlIG9iamVjdCBmcm9tIHRoZSBzcGVjaWZpZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KHZhbHVlID0gdGhpcy52YWx1ZSk6IE1hdFNsaWRlckNoYW5nZSB7XG4gICAgbGV0IGV2ZW50ID0gbmV3IE1hdFNsaWRlckNoYW5nZSgpO1xuXG4gICAgZXZlbnQuc291cmNlID0gdGhpcztcbiAgICBldmVudC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGEgdmFsdWUgaXMuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWU6IG51bWJlciB8IG51bGwpIHtcbiAgICByZXR1cm4gKCh2YWx1ZSB8fCAwKSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSB2YWx1ZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciBjb3JyZXNwb25kcyB0by4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlVmFsdWUocGVyY2VudGFnZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMubWluICsgcGVyY2VudGFnZSAqICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBudW1iZXIgYmV0d2VlbiB0d28gbnVtYmVycy4gKi9cbiAgcHJpdmF0ZSBfY2xhbXAodmFsdWU6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMSkge1xuICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIHRoZSBzbGlkZXIgdHJhY2sgZWxlbWVudC5cbiAgICogVGhlIHRyYWNrIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlIG5hdGl2ZSBlbGVtZW50IHRvIGlnbm9yZSB0aGUgZXh0cmEgc3BhY2UgdGhhdCB0aGUgdGh1bWIgY2FuXG4gICAqIHRha2UgdXAuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTbGlkZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXJXcmFwcGVyID8gdGhpcy5fc2xpZGVyV3JhcHBlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICogQ3VycmVudGx5IG9ubHkgdXNlZCB0byBhbGxvdyBhIGJsdXIgZXZlbnQgdG8gZmlyZSBidXQgd2lsbCBiZSB1c2VkIHdpdGgga2V5Ym9hcmQgaW5wdXQgbGF0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9ibHVySG9zdEVsZW1lbnQoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbnZlcnQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21heDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9taW46IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RlcDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aHVtYkxhYmVsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aWNrSW50ZXJ2YWw6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmVydGljYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90YWJJbmRleDogTnVtYmVySW5wdXQ7XG59XG5cbi8qKiBSZXR1cm5zIHdoZXRoZXIgYW4gZXZlbnQgaXMgYSB0b3VjaCBldmVudC4gKi9cbmZ1bmN0aW9uIGlzVG91Y2hFdmVudChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBldmVudCBpcyBUb3VjaEV2ZW50IHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIGV2ZXJ5IHBpeGVsIHRoYXQgdGhlIHVzZXIgaGFzIGRyYWdnZWQgc28gd2UgbmVlZCBpdCB0byBiZVxuICAvLyBhcyBmYXN0IGFzIHBvc3NpYmxlLiBTaW5jZSB3ZSBvbmx5IGJpbmQgbW91c2UgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMsIHdlIGNhbiBhc3N1bWVcbiAgLy8gdGhhdCBpZiB0aGUgZXZlbnQncyBuYW1lIHN0YXJ0cyB3aXRoIGB0YCwgaXQncyBhIHRvdWNoIGV2ZW50LlxuICByZXR1cm4gZXZlbnQudHlwZVswXSA9PT0gJ3QnO1xufVxuXG4vKiogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYSB0b3VjaCBvciBtb3VzZSBldmVudCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuICovXG5mdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gIC8vIGB0b3VjaGVzYCB3aWxsIGJlIGVtcHR5IGZvciBzdGFydC9lbmQgZXZlbnRzIHNvIHdlIGhhdmUgdG8gZmFsbCBiYWNrIHRvIGBjaGFuZ2VkVG91Y2hlc2AuXG4gIGNvbnN0IHBvaW50ID0gaXNUb3VjaEV2ZW50KGV2ZW50KSA/IChldmVudC50b3VjaGVzWzBdIHx8IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSA6IGV2ZW50O1xuICByZXR1cm4ge3g6IHBvaW50LmNsaWVudFgsIHk6IHBvaW50LmNsaWVudFl9O1xufVxuIl19