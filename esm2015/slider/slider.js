/**
 * @fileoverview added by tsickle
 * Generated from: src/material/slider/slider.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, NgZone, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';
/** @type {?} */
const activeEventOptions = normalizePassiveListenerOptions({ passive: false });
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
     * @param {?=} _ngZone
     */
    constructor(elementRef, _focusMonitor, _changeDetectorRef, _dir, tabIndex, _animationMode, _ngZone) {
        super(elementRef);
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._animationMode = _animationMode;
        this._ngZone = _ngZone;
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
        /**
         * Called when the user has put their pointer down on the slider.
         */
        this._pointerDown = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            // Don't do anything if the slider is disabled or the
            // user is using anything other than the main mouse button.
            if (this.disabled || this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
                return;
            }
            this._runInsideZone((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const oldValue = this.value;
                /** @type {?} */
                const pointerPosition = getPointerPositionOnPage(event);
                this._isSliding = true;
                this._lastPointerEvent = event;
                event.preventDefault();
                this._focusHostElement();
                this._onMouseenter(); // Simulate mouseenter in case this is a mobile device.
                this._bindGlobalEvents(event);
                this._focusHostElement();
                this._updateValueFromPosition(pointerPosition);
                this._valueOnSlideStart = this.value;
                this._pointerPositionOnStart = pointerPosition;
                // Emit a change and input event if the value changed.
                if (oldValue != this.value) {
                    this._emitInputEvent();
                    this._emitChangeEvent();
                }
            }));
        });
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        this._pointerMove = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (this._isSliding) {
                // Prevent the slide from selecting anything else.
                event.preventDefault();
                /** @type {?} */
                const oldValue = this.value;
                this._lastPointerEvent = event;
                this._updateValueFromPosition(getPointerPositionOnPage(event));
                // Native range elements always emit `input` events when the value changed while sliding.
                if (oldValue != this.value) {
                    this._emitInputEvent();
                }
            }
        });
        /**
         * Called when the user has lifted their pointer. Bound on the document level.
         */
        this._pointerUp = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (this._isSliding) {
                /** @type {?} */
                const pointerPositionOnStart = this._pointerPositionOnStart;
                /** @type {?} */
                const currentPointerPosition = getPointerPositionOnPage(event);
                event.preventDefault();
                this._removeGlobalEvents();
                this._valueOnSlideStart = this._pointerPositionOnStart = this._lastPointerEvent = null;
                this._isSliding = false;
                if (this._valueOnSlideStart != this.value && !this.disabled &&
                    pointerPositionOnStart && (pointerPositionOnStart.x !== currentPointerPosition.x ||
                    pointerPositionOnStart.y !== currentPointerPosition.y)) {
                    this._emitChangeEvent();
                }
            }
        });
        /**
         * Called when the window has lost focus.
         */
        this._windowBlur = (/**
         * @return {?}
         */
        () => {
            // If the window is blurred while dragging we need to stop dragging because the
            // browser won't dispatch the `mouseup` and `touchend` events anymore.
            if (this._lastPointerEvent) {
                this._pointerUp(this._lastPointerEvent);
            }
        });
        this.tabIndex = parseInt(tabIndex) || 0;
        this._runOutsizeZone((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const element = elementRef.nativeElement;
            element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
            element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
        }));
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
        const percent = this.percent;
        /** @type {?} */
        const axis = this.vertical ? 'Y' : 'X';
        /** @type {?} */
        const scale = this.vertical ? `1, ${percent}, 1` : `${percent}, 1, 1`;
        /** @type {?} */
        const sign = this._shouldInvertMouseCoords() ? '' : '-';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`,
            // iOS Safari has a bug where it won't re-render elements which start of as `scale(0)` until
            // something forces a style recalculation on it. Since we'll end up with `scale(0)` when
            // the value of the slider is 0, we can easily get into this situation. We force a
            // recalculation by changing the element's `display` when it goes from 0 to any other value.
            display: percent === 0 ? 'none' : ''
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
            let side;
            if (this.vertical) {
                side = this._invertAxis ? 'Bottom' : 'Top';
            }
            else {
                side = this._invertAxis ? 'Right' : 'Left';
            }
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
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
        element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
        this._lastPointerEvent = null;
        this._removeGlobalEvents();
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
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     * @private
     * @param {?} triggerEvent
     * @return {?}
     */
    _bindGlobalEvents(triggerEvent) {
        if (typeof document !== 'undefined' && document) {
            /** @type {?} */
            const body = document.body;
            /** @type {?} */
            const isTouch = isTouchEvent(triggerEvent);
            /** @type {?} */
            const moveEventName = isTouch ? 'touchmove' : 'mousemove';
            /** @type {?} */
            const endEventName = isTouch ? 'touchend' : 'mouseup';
            body.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
            body.addEventListener(endEventName, this._pointerUp, activeEventOptions);
            if (isTouch) {
                body.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
            }
        }
        if (typeof window !== 'undefined' && window) {
            window.addEventListener('blur', this._windowBlur);
        }
    }
    /**
     * Removes any global event listeners that we may have added.
     * @private
     * @return {?}
     */
    _removeGlobalEvents() {
        if (typeof document !== 'undefined' && document) {
            /** @type {?} */
            const body = document.body;
            body.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
            body.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
            body.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
            body.removeEventListener('touchend', this._pointerUp, activeEventOptions);
            body.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);
        }
        if (typeof window !== 'undefined' && window) {
            window.removeEventListener('blur', this._windowBlur);
        }
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
     * Runs a callback inside of the NgZone, if possible.
     * @private
     * @param {?} fn
     * @return {?}
     */
    _runInsideZone(fn) {
        // @breaking-change 9.0.0 Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.run(fn) : fn();
    }
    /**
     * Runs a callback outside of the NgZone, if possible.
     * @private
     * @param {?} fn
     * @return {?}
     */
    _runOutsizeZone(fn) {
        // @breaking-change 9.0.0 Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.runOutsideAngular(fn) : fn();
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
                styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mat-slider:not(.mat-slider-disabled):active,.mat-slider.mat-slider-sliding:not(.mat-slider-disabled){cursor:-webkit-grabbing;cursor:grabbing}.mat-slider-wrapper{position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider.cdk-keyboard-focused .mat-slider-focus-ring,.mat-slider.cdk-program-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled):not(.mat-slider-sliding) .mat-slider-thumb{cursor:-webkit-grab;cursor:grab}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(0.7);transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),border-radius 400ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.cdk-high-contrast-active .mat-slider-thumb-label{outline:solid 1px}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-sliding .mat-slider-track-fill,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-thumb-container{transition-duration:0ms}.mat-slider-has-ticks .mat-slider-wrapper::after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{display:none}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text{opacity:1}.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(0.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mat-slider-horizontal .mat-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(0.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,.cdk-high-contrast-active .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text{transform:none}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mat-slider-vertical .mat-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(0.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}.mat-slider._mat-animation-noopable .mat-slider-track-fill,.mat-slider._mat-animation-noopable .mat-slider-track-background,.mat-slider._mat-animation-noopable .mat-slider-ticks,.mat-slider._mat-animation-noopable .mat-slider-thumb-container,.mat-slider._mat-animation-noopable .mat-slider-focus-ring,.mat-slider._mat-animation-noopable .mat-slider-thumb,.mat-slider._mat-animation-noopable .mat-slider-thumb-label,.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after{transition:none}\n"]
            }] }
];
/** @nocollapse */
MatSlider.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusMonitor },
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: NgZone }
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
if (false) {
    /** @type {?} */
    MatSlider.ngAcceptInputType_invert;
    /** @type {?} */
    MatSlider.ngAcceptInputType_max;
    /** @type {?} */
    MatSlider.ngAcceptInputType_min;
    /** @type {?} */
    MatSlider.ngAcceptInputType_step;
    /** @type {?} */
    MatSlider.ngAcceptInputType_thumbLabel;
    /** @type {?} */
    MatSlider.ngAcceptInputType_tickInterval;
    /** @type {?} */
    MatSlider.ngAcceptInputType_value;
    /** @type {?} */
    MatSlider.ngAcceptInputType_vertical;
    /** @type {?} */
    MatSlider.ngAcceptInputType_disabled;
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
     * Position of the pointer when the dragging started.
     * @type {?}
     * @private
     */
    MatSlider.prototype._pointerPositionOnStart;
    /**
     * Reference to the inner slider wrapper element.
     * @type {?}
     * @private
     */
    MatSlider.prototype._sliderWrapper;
    /**
     * Keeps track of the last pointer event that was captured by the slider.
     * @type {?}
     * @private
     */
    MatSlider.prototype._lastPointerEvent;
    /**
     * Called when the user has put their pointer down on the slider.
     * @type {?}
     * @private
     */
    MatSlider.prototype._pointerDown;
    /**
     * Called when the user has moved their pointer after
     * starting to drag. Bound on the document level.
     * @type {?}
     * @private
     */
    MatSlider.prototype._pointerMove;
    /**
     * Called when the user has lifted their pointer. Bound on the document level.
     * @type {?}
     * @private
     */
    MatSlider.prototype._pointerUp;
    /**
     * Called when the window has lost focus.
     * @type {?}
     * @private
     */
    MatSlider.prototype._windowBlur;
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
    /**
     * @type {?}
     * @private
     */
    MatSlider.prototype._ngZone;
}
/**
 * Returns whether an event is a touch event.
 * @param {?} event
 * @return {?}
 */
function isTouchEvent(event) {
    // This function is called for every pixel that the user has dragged so we need it to be
    // as fast as possible. Since we only bind mouse events and touch events, we can assume
    // that if the event's name starts with `t`, it's a touch event.
    return event.type[0] === 't';
}
/**
 * Gets the coordinates of a touch or mouse event relative to the viewport.
 * @param {?} event
 * @return {?}
 */
function getPointerPositionOnPage(event) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    /** @type {?} */
    const point = isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    return { x: point.clientX, y: point.clientY };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBT0wsVUFBVSxFQUNWLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOztNQUU1QixrQkFBa0IsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQzs7Ozs7O01B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QUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUMvQixDQUFDOzs7Ozs7QUFHRCxTQUFTLHdCQUF3QixDQUFDLEtBQThCOzs7VUFFeEQsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztJQUN6RixPQUFPLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUMsQ0FBQztBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRE9XTl9BUlJPVyxcbiAgRU5ELFxuICBIT01FLFxuICBMRUZUX0FSUk9XLFxuICBQQUdFX0RPV04sXG4gIFBBR0VfVVAsXG4gIFJJR0hUX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG5jb25zdCBhY3RpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiBmYWxzZX0pO1xuXG4vKipcbiAqIFZpc3VhbGx5LCBhIDMwcHggc2VwYXJhdGlvbiBiZXR3ZWVuIHRpY2sgbWFya3MgbG9va3MgYmVzdC4gVGhpcyBpcyB2ZXJ5IHN1YmplY3RpdmUgYnV0IGl0IGlzXG4gKiB0aGUgZGVmYXVsdCBzZXBhcmF0aW9uIHdlIGNob3NlLlxuICovXG5jb25zdCBNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gPSAzMDtcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYSBkaXNhYmxlZCBzbGlkZXIuICovXG5jb25zdCBESVNBQkxFRF9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIG5vbi1hY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX05PTkFDVElWRV9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhbiBhY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgPSAxMDtcblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1zbGlkZXIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIFtmb3JtQ29udHJvbF0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIGJ5IHRoZSBNYXRTbGlkZXIgY29tcG9uZW50LiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckNoYW5nZSB7XG4gIC8qKiBUaGUgTWF0U2xpZGVyIHRoYXQgY2hhbmdlZC4gKi9cbiAgc291cmNlOiBNYXRTbGlkZXI7XG5cbiAgLyoqIFRoZSBuZXcgdmFsdWUgb2YgdGhlIHNvdXJjZSBzbGlkZXIuICovXG4gIHZhbHVlOiBudW1iZXIgfCBudWxsO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTbGlkZXJCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuY29uc3QgX01hdFNsaWRlck1peGluQmFzZTpcbiAgICBIYXNUYWJJbmRleEN0b3IgJlxuICAgIENhbkNvbG9yQ3RvciAmXG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIHR5cGVvZiBNYXRTbGlkZXJCYXNlID1cbiAgICAgICAgbWl4aW5UYWJJbmRleChtaXhpbkNvbG9yKG1peGluRGlzYWJsZWQoTWF0U2xpZGVyQmFzZSksICdhY2NlbnQnKSk7XG5cbi8qKlxuICogQWxsb3dzIHVzZXJzIHRvIHNlbGVjdCBmcm9tIGEgcmFuZ2Ugb2YgdmFsdWVzIGJ5IG1vdmluZyB0aGUgc2xpZGVyIHRodW1iLiBJdCBpcyBzaW1pbGFyIGluXG4gKiBiZWhhdmlvciB0byB0aGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1cInJhbmdlXCI+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGVyJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXInLFxuICBwcm92aWRlcnM6IFtNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgaG9zdDoge1xuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXl1cCknOiAnX29uS2V5dXAoKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfb25Nb3VzZWVudGVyKCknLFxuXG4gICAgLy8gT24gU2FmYXJpIHN0YXJ0aW5nIHRvIHNsaWRlIHRlbXBvcmFyaWx5IHRyaWdnZXJzIHRleHQgc2VsZWN0aW9uIG1vZGUgd2hpY2hcbiAgICAvLyBzaG93IHRoZSB3cm9uZyBjdXJzb3IuIFdlIHByZXZlbnQgaXQgYnkgc3RvcHBpbmcgdGhlIGBzZWxlY3RzdGFydGAgZXZlbnQuXG4gICAgJyhzZWxlY3RzdGFydCknOiAnJGV2ZW50LnByZXZlbnREZWZhdWx0KCknLFxuICAgICdjbGFzcyc6ICdtYXQtc2xpZGVyJyxcbiAgICAncm9sZSc6ICdzbGlkZXInLFxuICAgICdbdGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtaW4nLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICd2YWx1ZScsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oYXMtdGlja3NdJzogJ3RpY2tJbnRlcnZhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWF4aXMtaW52ZXJ0ZWRdJzogJ19pbnZlcnRBeGlzJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbW91c2UgY29vcmRpbmF0ZXMgbmVlZCB0byBiZSBpbnZlcnRlZC5cbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaW52ZXJ0LW1vdXNlLWNvb3Jkc10nOiAnX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCknLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1zbGlkaW5nXSc6ICdfaXNTbGlkaW5nJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZ10nOiAndGh1bWJMYWJlbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLW1pbi12YWx1ZV0nOiAnX2lzTWluVmFsdWUnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oaWRlLWxhc3QtdGlja10nOiAnZGlzYWJsZWQgfHwgX2lzTWluVmFsdWUgJiYgX3RodW1iR2FwICYmIF9pbnZlcnRBeGlzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXIuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyIGV4dGVuZHMgX01hdFNsaWRlck1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSwgQ2FuQ29sb3IsIE9uSW5pdCwgSGFzVGFiSW5kZXgge1xuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGludmVydGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaW52ZXJ0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW52ZXJ0OyB9XG4gIHNldCBpbnZlcnQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbnZlcnQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ludmVydCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX21pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21pbik7XG5cbiAgICAvLyBJZiB0aGUgdmFsdWUgd2Fzbid0IGV4cGxpY2l0bHkgc2V0IGJ5IHRoZSB1c2VyLCBzZXQgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9taW46IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3N0ZXA7IH1cbiAgc2V0IHN0ZXAodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fc3RlcCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX3N0ZXApO1xuXG4gICAgaWYgKHRoaXMuX3N0ZXAgJSAxICE9PSAwKSB7XG4gICAgICB0aGlzLl9yb3VuZFRvRGVjaW1hbCA9IHRoaXMuX3N0ZXAudG9TdHJpbmcoKS5zcGxpdCgnLicpLnBvcCgpIS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhpcyBjb3VsZCBtb2RpZnkgdGhlIGxhYmVsLCB3ZSBuZWVkIHRvIG5vdGlmeSB0aGUgY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9zdGVwOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSB0aHVtYiBsYWJlbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRodW1iTGFiZWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl90aHVtYkxhYmVsOyB9XG4gIHNldCB0aHVtYkxhYmVsKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3RodW1iTGFiZWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3RodW1iTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIHNob3cgdGlja3MuIFJlbGF0aXZlIHRvIHRoZSBzdGVwIHNvIHRoYXQgYSB0aWNrIGFsd2F5cyBhcHBlYXJzIG9uIGEgc3RlcC5cbiAgICogRXg6IFRpY2sgaW50ZXJ2YWwgb2YgNCB3aXRoIGEgc3RlcCBvZiAzIHdpbGwgZHJhdyBhIHRpY2sgZXZlcnkgNCBzdGVwcyAoZXZlcnkgMTIgdmFsdWVzKS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aWNrSW50ZXJ2YWwoKSB7IHJldHVybiB0aGlzLl90aWNrSW50ZXJ2YWw7IH1cbiAgc2V0IHRpY2tJbnRlcnZhbCh2YWx1ZTogJ2F1dG8nIHwgbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlID09PSAnYXV0bycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9ICdhdXRvJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIHRoaXMuX3RpY2tJbnRlcnZhbCBhcyBudW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAwO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF90aWNrSW50ZXJ2YWw6ICdhdXRvJyB8IG51bWJlciA9IDA7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVhZCBhbmQgaXQgaXMgc3RpbGwgdW5pbml0aWFsaXplZCwgaW5pdGlhbGl6ZSBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgaWYgKHYgIT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICBsZXQgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KTtcblxuICAgICAgLy8gV2hpbGUgaW5jcmVtZW50aW5nIGJ5IGEgZGVjaW1hbCB3ZSBjYW4gZW5kIHVwIHdpdGggdmFsdWVzIGxpa2UgMzMuMzAwMDAwMDAwMDAwMDA0LlxuICAgICAgLy8gVHJ1bmNhdGUgaXQgdG8gZW5zdXJlIHRoYXQgaXQgbWF0Y2hlcyB0aGUgbGFiZWwgYW5kIHRvIG1ha2UgaXQgZWFzaWVyIHRvIHdvcmsgd2l0aC5cbiAgICAgIGlmICh0aGlzLl9yb3VuZFRvRGVjaW1hbCkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsOyB9XG4gIHNldCB2ZXJ0aWNhbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3ZlcnRpY2FsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF92ZXJ0aWNhbCA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgbW92ZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBpbnB1dDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgcmF3IHZhbHVlIG9mIHRoZSBzbGlkZXIgY2hhbmdlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseVxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0d28td2F5IGJpbmRpbmcgZm9yIHRoZSBgdmFsdWVgIGlucHV0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4oKTtcblxuICAvKiogVGhlIHZhbHVlIHRvIGJlIHVzZWQgZm9yIGRpc3BsYXkgcHVycG9zZXMuICovXG4gIGdldCBkaXNwbGF5VmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5V2l0aCkge1xuICAgICAgLy8gVmFsdWUgaXMgbmV2ZXIgbnVsbCBidXQgc2luY2Ugc2V0dGVycyBhbmQgZ2V0dGVycyBjYW5ub3QgaGF2ZVxuICAgICAgLy8gZGlmZmVyZW50IHR5cGVzLCB0aGUgdmFsdWUgZ2V0dGVyIGlzIGFsc28gdHlwZWQgdG8gcmV0dXJuIG51bGwuXG4gICAgICByZXR1cm4gdGhpcy5kaXNwbGF5V2l0aCh0aGlzLnZhbHVlISk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgY291bGQgYmUgaW1wcm92ZWQgZnVydGhlciBieSByb3VuZGluZyBzb21ldGhpbmcgbGlrZSAwLjk5OSB0byAxIG9yXG4gICAgLy8gMC44OTkgdG8gMC45LCBob3dldmVyIGl0IGlzIHZlcnkgcGVyZm9ybWFuY2Ugc2Vuc2l0aXZlLCBiZWNhdXNlIGl0IGdldHMgY2FsbGVkIG9uXG4gICAgLy8gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICUgMSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudmFsdWUgfHwgMDtcbiAgfVxuXG4gIC8qKiBzZXQgZm9jdXMgdG8gdGhlIGhvc3QgZWxlbWVudCAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBibHVyIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgYmx1cigpIHtcbiAgICB0aGlzLl9ibHVySG9zdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBvblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY2xhbXAodGhpcy5fcGVyY2VudCk7IH1cbiAgcHJpdmF0ZSBfcGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHRodW1iIGlzIHNsaWRpbmcuXG4gICAqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZXJlIHNob3VsZCBiZSBhIHRyYW5zaXRpb24gZm9yIHRoZSB0aHVtYiBhbmQgZmlsbCB0cmFjay5cbiAgICovXG4gIF9pc1NsaWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHNsaWRlciBpcyBhY3RpdmUgKGNsaWNrZWQgb3Igc2xpZGluZykuXG4gICAqIFVzZWQgdG8gc2hyaW5rIGFuZCBncm93IHRoZSB0aHVtYiBhcyBhY2NvcmRpbmcgdG8gdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjLlxuICAgKi9cbiAgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF4aXMgb2YgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC5cbiAgICogKGkuZS4gd2hldGhlciBtb3ZpbmcgdGhlIHRodW1iIGluIHRoZSBwb3NpdGl2ZSB4IG9yIHkgZGlyZWN0aW9uIGRlY3JlYXNlcyB0aGUgc2xpZGVyJ3MgdmFsdWUpLlxuICAgKi9cbiAgZ2V0IF9pbnZlcnRBeGlzKCkge1xuICAgIC8vIFN0YW5kYXJkIG5vbi1pbnZlcnRlZCBtb2RlIGZvciBhIHZlcnRpY2FsIHNsaWRlciBzaG91bGQgYmUgZHJhZ2dpbmcgdGhlIHRodW1iIGZyb20gYm90dG9tIHRvXG4gICAgLy8gdG9wLiBIb3dldmVyIGZyb20gYSB5LWF4aXMgc3RhbmRwb2ludCB0aGlzIGlzIGludmVydGVkLlxuICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gIXRoaXMuaW52ZXJ0IDogdGhpcy5pbnZlcnQ7XG4gIH1cblxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG4gIGdldCBfaXNNaW5WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wZXJjZW50ID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gbGVhdmUgYmV0d2VlbiB0aGUgc2xpZGVyIHRodW1iIGFuZCB0aGUgdHJhY2sgZmlsbCAmIHRyYWNrIGJhY2tncm91bmRcbiAgICogZWxlbWVudHMuXG4gICAqL1xuICBnZXQgX3RodW1iR2FwKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gRElTQUJMRURfVEhVTUJfR0FQO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiAhdGhpcy50aHVtYkxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNBY3RpdmUgPyBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA6IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgYmFja2dyb3VuZCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrQmFja2dyb3VuZFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHsxIC0gdGhpcy5wZXJjZW50fSwgMWAgOiBgJHsxIC0gdGhpcy5wZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnLScgOiAnJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgZmlsbCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrRmlsbFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAke3BlcmNlbnR9LCAxYCA6IGAke3BlcmNlbnR9LCAxLCAxYDtcbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICcnIDogJy0nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX3RodW1iR2FwfXB4KSBzY2FsZTNkKCR7c2NhbGV9KWAsXG4gICAgICAvLyBpT1MgU2FmYXJpIGhhcyBhIGJ1ZyB3aGVyZSBpdCB3b24ndCByZS1yZW5kZXIgZWxlbWVudHMgd2hpY2ggc3RhcnQgb2YgYXMgYHNjYWxlKDApYCB1bnRpbFxuICAgICAgLy8gc29tZXRoaW5nIGZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb24gaXQuIFNpbmNlIHdlJ2xsIGVuZCB1cCB3aXRoIGBzY2FsZSgwKWAgd2hlblxuICAgICAgLy8gdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgaXMgMCwgd2UgY2FuIGVhc2lseSBnZXQgaW50byB0aGlzIHNpdHVhdGlvbi4gV2UgZm9yY2UgYVxuICAgICAgLy8gcmVjYWxjdWxhdGlvbiBieSBjaGFuZ2luZyB0aGUgZWxlbWVudCdzIGBkaXNwbGF5YCB3aGVuIGl0IGdvZXMgZnJvbSAwIHRvIGFueSBvdGhlciB2YWx1ZS5cbiAgICAgIGRpc3BsYXk6IHBlcmNlbnQgPT09IDAgPyAnbm9uZScgOiAnJ1xuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGNvbnRhaW5lciBlbGVtZW50LiAqL1xuICBnZXQgX3RpY2tzQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRpY2tzIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgc2lnbiA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gJycgOiAnLSc7XG4gICAgbGV0IG9mZnNldCA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgLyAyICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGVsZW1lbnQuICovXG4gIGdldCBfdGlja3NTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IHRpY2tTaXplID0gdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCAqIDEwMDtcbiAgICBsZXQgYmFja2dyb3VuZFNpemUgPSB0aGlzLnZlcnRpY2FsID8gYDJweCAke3RpY2tTaXplfSVgIDogYCR7dGlja1NpemV9JSAycHhgO1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiB3ZSBwdXNoZWQgdGhlIHRpY2tzIGNvbnRhaW5lciwgcHVzaCB0aGUgdGlja3MgdGhlIG9wcG9zaXRlXG4gICAgLy8gZGlyZWN0aW9uIHRvIHJlLWNlbnRlciB0aGVtIGJ1dCBjbGlwIG9mZiB0aGUgZW5kIGVkZ2UuIEluIFJUTCBsYW5ndWFnZXMgd2UgbmVlZCB0byBmbGlwIHRoZVxuICAgIC8vIHRpY2tzIDE4MCBkZWdyZWVzIHNvIHdlJ3JlIHJlYWxseSBjdXR0aW5nIG9mZiB0aGUgZW5kIGVkZ2UgYWJkIG5vdCB0aGUgc3RhcnQuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICctJyA6ICcnO1xuICAgIGxldCByb3RhdGUgPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcgcm90YXRlKDE4MGRlZyknIDogJyc7XG4gICAgbGV0IHN0eWxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IGJhY2tncm91bmRTaXplLFxuICAgICAgLy8gV2l0aG91dCB0cmFuc2xhdGVaIHRpY2tzIHNvbWV0aW1lcyBqaXR0ZXIgYXMgdGhlIHNsaWRlciBtb3ZlcyBvbiBDaHJvbWUgJiBGaXJlZm94LlxuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiB0aGlzLl90aHVtYkdhcCkge1xuICAgICAgbGV0IHNpZGU6IHN0cmluZztcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgc2lkZSA9IHRoaXMuX2ludmVydEF4aXMgPyAnQm90dG9tJyA6ICdUb3AnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2lkZSA9IHRoaXMuX2ludmVydEF4aXMgPyAnUmlnaHQnIDogJ0xlZnQnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXNbYHBhZGRpbmcke3NpZGV9YF0gPSBgJHt0aGlzLl90aHVtYkdhcH1weGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuXG4gIGdldCBfdGh1bWJDb250YWluZXJTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGh1bWIgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGxldCBpbnZlcnRPZmZzZXQgPVxuICAgICAgICAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXRoaXMuX2ludmVydEF4aXMgOiB0aGlzLl9pbnZlcnRBeGlzO1xuICAgIGxldCBvZmZzZXQgPSAoaW52ZXJ0T2Zmc2V0ID8gdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudCkgKiAxMDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlJHtheGlzfSgtJHtvZmZzZXR9JSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBUaGUgc2l6ZSBvZiBhIHRpY2sgaW50ZXJ2YWwgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBzaXplIG9mIHRoZSB0cmFjay4gKi9cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsUGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVyRGltZW5zaW9uczogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIERlY2ltYWwgcGxhY2VzIHRvIHJvdW5kIHRvLCBiYXNlZCBvbiB0aGUgc3RlcCBhbW91bnQuICovXG4gIHByaXZhdGUgX3JvdW5kVG9EZWNpbWFsOiBudW1iZXI7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0aGUgRGlyZWN0aW9uYWxpdHkgY2hhbmdlIEV2ZW50RW1pdHRlci4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIHNsaWRlciB3aGVuIHRoZSBzbGlkZSBzdGFydCBldmVudCBmaXJlcy4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPblNsaWRlU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIHdoZW4gdGhlIGRyYWdnaW5nIHN0YXJ0ZWQuICovXG4gIHByaXZhdGUgX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQ6IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIHNsaWRlciB3cmFwcGVyIGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcldyYXBwZXInKSBwcml2YXRlIF9zbGlkZXJXcmFwcGVyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG1vdXNlIGV2ZW50cyBzaG91bGQgYmUgY29udmVydGVkIHRvIGEgc2xpZGVyIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZWlyIGRpc3RhbmNlXG4gICAqIGZyb20gdGhlIHJpZ2h0IG9yIGJvdHRvbSBlZGdlIG9mIHRoZSBzbGlkZXIgYXMgb3Bwb3NlZCB0byB0aGUgdG9wIG9yIGxlZnQuXG4gICAqL1xuICBfc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCkgPyAhdGhpcy5faW52ZXJ0QXhpcyA6IHRoaXMuX2ludmVydEF4aXM7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PSAncnRsJykgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBsYXN0IHBvaW50ZXIgZXZlbnQgdGhhdCB3YXMgY2FwdHVyZWQgYnkgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfbGFzdFBvaW50ZXJFdmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgX2FuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfbmdab25lYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lPzogTmdab25lKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICB0aGlzLl9ydW5PdXRzaXplWm9uZSgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yXG4gICAgICAgIC5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAgIC5zdWJzY3JpYmUoKG9yaWdpbjogRm9jdXNPcmlnaW4pID0+IHtcbiAgICAgICAgICB0aGlzLl9pc0FjdGl2ZSA9ICEhb3JpZ2luICYmIG9yaWdpbiAhPT0gJ2tleWJvYXJkJztcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuX2Rpci5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlR2xvYmFsRXZlbnRzKCk7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgX29uTW91c2VlbnRlcigpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIHNhdmUgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlciBoZXJlIHNvIHdlIGNhbiB1c2UgdGhlbSB0byB1cGRhdGUgdGhlIHNwYWNpbmcgb2YgdGhlXG4gICAgLy8gdGlja3MgYW5kIGRldGVybWluZSB3aGVyZSBvbiB0aGUgc2xpZGVyIGNsaWNrIGFuZCBzbGlkZSBldmVudHMgaGFwcGVuLlxuICAgIHRoaXMuX3NsaWRlckRpbWVuc2lvbnMgPSB0aGlzLl9nZXRTbGlkZXJEaW1lbnNpb25zKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpO1xuICB9XG5cbiAgX29uRm9jdXMoKSB7XG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25CbHVyKCkge1xuICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIFBBR0VfVVA6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgtMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICAvLyBOT1RFOiBGb3IgYSBzaWdodGVkIHVzZXIgaXQgd291bGQgbWFrZSBtb3JlIHNlbnNlIHRoYXQgd2hlbiB0aGV5IHByZXNzIGFuIGFycm93IGtleSBvbiBhblxuICAgICAgICAvLyBpbnZlcnRlZCBzbGlkZXIgdGhlIHRodW1iIG1vdmVzIGluIHRoYXQgZGlyZWN0aW9uLiBIb3dldmVyIGZvciBhIGJsaW5kIHVzZXIsIG5vdGhpbmdcbiAgICAgICAgLy8gYWJvdXQgdGhlIHNsaWRlciBpbmRpY2F0ZXMgdGhhdCBpdCBpcyBpbnZlcnRlZC4gVGhleSB3aWxsIGV4cGVjdCBsZWZ0IHRvIGJlIGRlY3JlbWVudCxcbiAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiBob3cgaXQgYXBwZWFycyBvbiB0aGUgc2NyZWVuLiBGb3Igc3BlYWtlcnMgb2ZSVEwgbGFuZ3VhZ2VzLCB0aGV5IHByb2JhYmx5XG4gICAgICAgIC8vIGV4cGVjdCBsZWZ0IHRvIG1lYW4gaW5jcmVtZW50LiBUaGVyZWZvcmUgd2UgZmxpcCB0aGUgbWVhbmluZyBvZiB0aGUgc2lkZSBhcnJvdyBrZXlzIGZvclxuICAgICAgICAvLyBSVEwuIEZvciBpbnZlcnRlZCBzbGlkZXJzIHdlIHByZWZlciBhIGdvb2QgYTExeSBleHBlcmllbmNlIHRvIGhhdmluZyBpdCBcImxvb2sgcmlnaHRcIiBmb3JcbiAgICAgICAgLy8gc2lnaHRlZCB1c2VycywgdGhlcmVmb3JlIHdlIGRvIG5vdCBzd2FwIHRoZSBtZWFuaW5nLlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICAvLyBTZWUgY29tbWVudCBvbiBMRUZUX0FSUk9XIGFib3V0IHRoZSBjb25kaXRpb25zIHVuZGVyIHdoaWNoIHdlIGZsaXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/IC0xIDogMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIFJldHVybiBpZiB0aGUga2V5IGlzIG5vdCBvbmUgdGhhdCB3ZSBleHBsaWNpdGx5IGhhbmRsZSB0byBhdm9pZCBjYWxsaW5nIHByZXZlbnREZWZhdWx0IG9uXG4gICAgICAgIC8vIGl0LlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1NsaWRpbmcgPSB0cnVlO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBfb25LZXl1cCgpIHtcbiAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgcHV0IHRoZWlyIHBvaW50ZXIgZG93biBvbiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9wb2ludGVyRG93biA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiB0aGUgc2xpZGVyIGlzIGRpc2FibGVkIG9yIHRoZVxuICAgIC8vIHVzZXIgaXMgdXNpbmcgYW55dGhpbmcgb3RoZXIgdGhhbiB0aGUgbWFpbiBtb3VzZSBidXR0b24uXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5faXNTbGlkaW5nIHx8ICghaXNUb3VjaEV2ZW50KGV2ZW50KSAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcnVuSW5zaWRlWm9uZSgoKSA9PiB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICBjb25zdCBwb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBldmVudDtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICB0aGlzLl9vbk1vdXNlZW50ZXIoKTsgLy8gU2ltdWxhdGUgbW91c2VlbnRlciBpbiBjYXNlIHRoaXMgaXMgYSBtb2JpbGUgZGV2aWNlLlxuICAgICAgdGhpcy5fYmluZEdsb2JhbEV2ZW50cyhldmVudCk7XG4gICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihwb2ludGVyUG9zaXRpb24pO1xuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy5fcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHBvaW50ZXJQb3NpdGlvbjtcblxuICAgICAgLy8gRW1pdCBhIGNoYW5nZSBhbmQgaW5wdXQgZXZlbnQgaWYgdGhlIHZhbHVlIGNoYW5nZWQuXG4gICAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbW92ZWQgdGhlaXIgcG9pbnRlciBhZnRlclxuICAgKiBzdGFydGluZyB0byBkcmFnLiBCb3VuZCBvbiB0aGUgZG9jdW1lbnQgbGV2ZWwuXG4gICAqL1xuICBwcml2YXRlIF9wb2ludGVyTW92ZSA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5faXNTbGlkaW5nKSB7XG4gICAgICAvLyBQcmV2ZW50IHRoZSBzbGlkZSBmcm9tIHNlbGVjdGluZyBhbnl0aGluZyBlbHNlLlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgIHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCkpO1xuXG4gICAgICAvLyBOYXRpdmUgcmFuZ2UgZWxlbWVudHMgYWx3YXlzIGVtaXQgYGlucHV0YCBldmVudHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlZCB3aGlsZSBzbGlkaW5nLlxuICAgICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGxpZnRlZCB0aGVpciBwb2ludGVyLiBCb3VuZCBvbiB0aGUgZG9jdW1lbnQgbGV2ZWwuICovXG4gIHByaXZhdGUgX3BvaW50ZXJVcCA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5faXNTbGlkaW5nKSB7XG4gICAgICBjb25zdCBwb2ludGVyUG9zaXRpb25PblN0YXJ0ID0gdGhpcy5fcG9pbnRlclBvc2l0aW9uT25TdGFydDtcbiAgICAgIGNvbnN0IGN1cnJlbnRQb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fcmVtb3ZlR2xvYmFsRXZlbnRzKCk7XG4gICAgICB0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCA9IHRoaXMuX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQgPSB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgIT0gdGhpcy52YWx1ZSAmJiAhdGhpcy5kaXNhYmxlZCAmJlxuICAgICAgICAgIHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQgJiYgKHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQueCAhPT0gY3VycmVudFBvaW50ZXJQb3NpdGlvbi54IHx8XG4gICAgICAgICAgcG9pbnRlclBvc2l0aW9uT25TdGFydC55ICE9PSBjdXJyZW50UG9pbnRlclBvc2l0aW9uLnkpKSB7XG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgd2luZG93IGhhcyBsb3N0IGZvY3VzLiAqL1xuICBwcml2YXRlIF93aW5kb3dCbHVyID0gKCkgPT4ge1xuICAgIC8vIElmIHRoZSB3aW5kb3cgaXMgYmx1cnJlZCB3aGlsZSBkcmFnZ2luZyB3ZSBuZWVkIHRvIHN0b3AgZHJhZ2dpbmcgYmVjYXVzZSB0aGVcbiAgICAvLyBicm93c2VyIHdvbid0IGRpc3BhdGNoIHRoZSBgbW91c2V1cGAgYW5kIGB0b3VjaGVuZGAgZXZlbnRzIGFueW1vcmUuXG4gICAgaWYgKHRoaXMuX2xhc3RQb2ludGVyRXZlbnQpIHtcbiAgICAgIHRoaXMuX3BvaW50ZXJVcCh0aGlzLl9sYXN0UG9pbnRlckV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgb3VyIGdsb2JhbCBtb3ZlIGFuZCBlbmQgZXZlbnRzLiBUaGV5J3JlIGJvdW5kIGF0IHRoZSBkb2N1bWVudCBsZXZlbCBhbmQgb25seSB3aGlsZVxuICAgKiBkcmFnZ2luZyBzbyB0aGF0IHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBrZWVwIHRoZWlyIHBvaW50ZXIgZXhhY3RseSBvdmVyIHRoZSBzbGlkZXJcbiAgICogYXMgdGhleSdyZSBzd2lwaW5nIGFjcm9zcyB0aGUgc2NyZWVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfYmluZEdsb2JhbEV2ZW50cyh0cmlnZ2VyRXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgY29uc3QgaXNUb3VjaCA9IGlzVG91Y2hFdmVudCh0cmlnZ2VyRXZlbnQpO1xuICAgICAgY29uc3QgbW92ZUV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuICAgICAgY29uc3QgZW5kRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCc7XG4gICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoZW5kRXZlbnROYW1lLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG5cbiAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1cik7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgYW55IGdsb2JhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZSBtYXkgaGF2ZSBhZGRlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2xvYmFsRXZlbnRzKCkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50KSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1cik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEluY3JlbWVudHMgdGhlIHNsaWRlciBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIHN0ZXBzIChuZWdhdGl2ZSBudW1iZXIgZGVjcmVtZW50cykuICovXG4gIHByaXZhdGUgX2luY3JlbWVudChudW1TdGVwczogbnVtYmVyKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKCh0aGlzLnZhbHVlIHx8IDApICsgdGhpcy5zdGVwICogbnVtU3RlcHMsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlIHRoZSBuZXcgdmFsdWUgZnJvbSB0aGUgbmV3IHBoeXNpY2FsIGxvY2F0aW9uLiBUaGUgdmFsdWUgd2lsbCBhbHdheXMgYmUgc25hcHBlZC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24ocG9zOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9KSB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG9mZnNldCA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLnRvcCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMubGVmdDtcbiAgICBsZXQgc2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgbGV0IHBvc0NvbXBvbmVudCA9IHRoaXMudmVydGljYWwgPyBwb3MueSA6IHBvcy54O1xuXG4gICAgLy8gVGhlIGV4YWN0IHZhbHVlIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgZXZlbnQgYW5kIHVzZWQgdG8gZmluZCB0aGUgY2xvc2VzdCBzbmFwIHZhbHVlLlxuICAgIGxldCBwZXJjZW50ID0gdGhpcy5fY2xhbXAoKHBvc0NvbXBvbmVudCAtIG9mZnNldCkgLyBzaXplKTtcblxuICAgIGlmICh0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpKSB7XG4gICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIHN0ZXBzIG1heSBub3QgZGl2aWRlIGNsZWFubHkgaW50byB0aGUgbWF4IHZhbHVlLCBpZiB0aGUgdXNlclxuICAgIC8vIHNsaWQgdG8gMCBvciAxMDAgcGVyY2VudCwgd2UganVtcCB0byB0aGUgbWluL21heCB2YWx1ZS4gVGhpcyBhcHByb2FjaFxuICAgIC8vIGlzIHNsaWdodGx5IG1vcmUgaW50dWl0aXZlIHRoYW4gdXNpbmcgYE1hdGguY2VpbGAgYmVsb3csIGJlY2F1c2UgaXRcbiAgICAvLyBmb2xsb3dzIHRoZSB1c2VyJ3MgcG9pbnRlciBjbG9zZXIuXG4gICAgaWYgKHBlcmNlbnQgPT09IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPT09IDEpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhhY3RWYWx1ZSA9IHRoaXMuX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnQpO1xuXG4gICAgICAvLyBUaGlzIGNhbGN1bGF0aW9uIGZpbmRzIHRoZSBjbG9zZXN0IHN0ZXAgYnkgZmluZGluZyB0aGUgY2xvc2VzdFxuICAgICAgLy8gd2hvbGUgbnVtYmVyIGRpdmlzaWJsZSBieSB0aGUgc3RlcCByZWxhdGl2ZSB0byB0aGUgbWluLlxuICAgICAgY29uc3QgY2xvc2VzdFZhbHVlID0gTWF0aC5yb3VuZCgoZXhhY3RWYWx1ZSAtIHRoaXMubWluKSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXAgKyB0aGlzLm1pbjtcblxuICAgICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIHNuYXAgdG8gdGhlIG1pbiBhbmQgbWF4LlxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKGNsb3Nlc3RWYWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4odGhpcy52YWx1ZSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogRW1pdHMgYW4gaW5wdXQgZXZlbnQgd2hlbiB0aGUgY3VycmVudCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0SW5wdXRFdmVudCgpIHtcbiAgICB0aGlzLmlucHV0LmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlja3MgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aWR0aCBvZiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCkge1xuICAgIGlmICghdGhpcy50aWNrSW50ZXJ2YWwgfHwgIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aWNrSW50ZXJ2YWwgPT0gJ2F1dG8nKSB7XG4gICAgICBsZXQgdHJhY2tTaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICAgIGxldCBwaXhlbHNQZXJTdGVwID0gdHJhY2tTaXplICogdGhpcy5zdGVwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgbGV0IHN0ZXBzUGVyVGljayA9IE1hdGguY2VpbChNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gLyBwaXhlbHNQZXJTdGVwKTtcbiAgICAgIGxldCBwaXhlbHNQZXJUaWNrID0gc3RlcHNQZXJUaWNrICogdGhpcy5zdGVwO1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCA9IHBpeGVsc1BlclRpY2sgLyB0cmFja1NpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSB0aGlzLnRpY2tJbnRlcnZhbCAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIHNsaWRlciBjaGFuZ2Ugb2JqZWN0IGZyb20gdGhlIHNwZWNpZmllZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ2hhbmdlRXZlbnQodmFsdWUgPSB0aGlzLnZhbHVlKTogTWF0U2xpZGVyQ2hhbmdlIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgTWF0U2xpZGVyQ2hhbmdlKCk7XG5cbiAgICBldmVudC5zb3VyY2UgPSB0aGlzO1xuICAgIGV2ZW50LnZhbHVlID0gdmFsdWU7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgYSB2YWx1ZSBpcy4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHJldHVybiAoKHZhbHVlIHx8IDApIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHZhbHVlIGEgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIGNvcnJlc3BvbmRzIHRvLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVWYWx1ZShwZXJjZW50YWdlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5taW4gKyBwZXJjZW50YWdlICogKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICB9XG5cbiAgLyoqIFJldHVybiBhIG51bWJlciBiZXR3ZWVuIHR3byBudW1iZXJzLiAqL1xuICBwcml2YXRlIF9jbGFtcCh2YWx1ZTogbnVtYmVyLCBtaW4gPSAwLCBtYXggPSAxKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYm91bmRpbmcgY2xpZW50IHJlY3Qgb2YgdGhlIHNsaWRlciB0cmFjayBlbGVtZW50LlxuICAgKiBUaGUgdHJhY2sgaXMgdXNlZCByYXRoZXIgdGhhbiB0aGUgbmF0aXZlIGVsZW1lbnQgdG8gaWdub3JlIHRoZSBleHRyYSBzcGFjZSB0aGF0IHRoZSB0aHVtYiBjYW5cbiAgICogdGFrZSB1cC5cbiAgICovXG4gIHByaXZhdGUgX2dldFNsaWRlckRpbWVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlcldyYXBwZXIgPyB0aGlzLl9zbGlkZXJXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIG5hdGl2ZSBlbGVtZW50LlxuICAgKiBDdXJyZW50bHkgb25seSB1c2VkIHRvIGFsbG93IGEgYmx1ciBldmVudCB0byBmaXJlIGJ1dCB3aWxsIGJlIHVzZWQgd2l0aCBrZXlib2FyZCBpbnB1dCBsYXRlci5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzSG9zdEVsZW1lbnQob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbmF0aXZlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2JsdXJIb3N0RWxlbWVudCgpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSBjYWxsYmFjayBpbnNpZGUgb2YgdGhlIE5nWm9uZSwgaWYgcG9zc2libGUuICovXG4gIHByaXZhdGUgX3J1bkluc2lkZVpvbmUoZm46ICgpID0+IGFueSkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIHRoaXMgZnVuY3Rpb24gb25jZSBgX25nWm9uZWAgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fbmdab25lID8gdGhpcy5fbmdab25lLnJ1bihmbikgOiBmbigpO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSBjYWxsYmFjayBvdXRzaWRlIG9mIHRoZSBOZ1pvbmUsIGlmIHBvc3NpYmxlLiAqL1xuICBwcml2YXRlIF9ydW5PdXRzaXplWm9uZShmbjogKCkgPT4gYW55KSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBSZW1vdmUgdGhpcyBmdW5jdGlvbiBvbmNlIGBfbmdab25lYCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICB0aGlzLl9uZ1pvbmUgPyB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoZm4pIDogZm4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbnZlcnQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21heDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9taW46IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RlcDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aHVtYkxhYmVsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aWNrSW50ZXJ2YWw6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmVydGljYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKiBSZXR1cm5zIHdoZXRoZXIgYW4gZXZlbnQgaXMgYSB0b3VjaCBldmVudC4gKi9cbmZ1bmN0aW9uIGlzVG91Y2hFdmVudChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBldmVudCBpcyBUb3VjaEV2ZW50IHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIGV2ZXJ5IHBpeGVsIHRoYXQgdGhlIHVzZXIgaGFzIGRyYWdnZWQgc28gd2UgbmVlZCBpdCB0byBiZVxuICAvLyBhcyBmYXN0IGFzIHBvc3NpYmxlLiBTaW5jZSB3ZSBvbmx5IGJpbmQgbW91c2UgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMsIHdlIGNhbiBhc3N1bWVcbiAgLy8gdGhhdCBpZiB0aGUgZXZlbnQncyBuYW1lIHN0YXJ0cyB3aXRoIGB0YCwgaXQncyBhIHRvdWNoIGV2ZW50LlxuICByZXR1cm4gZXZlbnQudHlwZVswXSA9PT0gJ3QnO1xufVxuXG4vKiogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYSB0b3VjaCBvciBtb3VzZSBldmVudCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuICovXG5mdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gIC8vIGB0b3VjaGVzYCB3aWxsIGJlIGVtcHR5IGZvciBzdGFydC9lbmQgZXZlbnRzIHNvIHdlIGhhdmUgdG8gZmFsbCBiYWNrIHRvIGBjaGFuZ2VkVG91Y2hlc2AuXG4gIGNvbnN0IHBvaW50ID0gaXNUb3VjaEV2ZW50KGV2ZW50KSA/IChldmVudC50b3VjaGVzWzBdIHx8IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSA6IGV2ZW50O1xuICByZXR1cm4ge3g6IHBvaW50LmNsaWVudFgsIHk6IHBvaW50LmNsaWVudFl9O1xufVxuIl19