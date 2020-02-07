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
import { DOCUMENT } from '@angular/common';
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
     * @param {?=} document
     */
    constructor(elementRef, _focusMonitor, _changeDetectorRef, _dir, tabIndex, _animationMode, _ngZone, 
    /** @breaking-change 11.0.0 make document required */
    document) {
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
        this._document = document;
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
        if (typeof this._document !== 'undefined' && this._document) {
            /** @type {?} */
            const body = this._document.body;
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
        if (typeof this._document !== 'undefined' && this._document) {
            /** @type {?} */
            const body = this._document.body;
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
        // @breaking-change 9.0.0-sha-a58c72591 Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.run(fn) : fn();
    }
    /**
     * Runs a callback outside of the NgZone, if possible.
     * @private
     * @param {?} fn
     * @return {?}
     */
    _runOutsizeZone(fn) {
        // @breaking-change 9.0.0-sha-a58c72591 Remove this function once `_ngZone` is a required parameter.
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
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
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
     * Used to subscribe to global move and end events
     * @type {?}
     * @protected
     */
    MatSlider.prototype._document;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBT0wsVUFBVSxFQUNWLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQzs7TUFFNUIsa0JBQWtCLEdBQUcsK0JBQStC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Ozs7OztJQUdELCtCQWdCQzs7Ozs7O0lBR0QsZ0NBTUM7Ozs7O0lBM01XLGtDQUFtQzs7Ozs7SUFDbkMsdUNBQTZDOzs7OztJQUM3Qyx5QkFBd0M7O0lBR3hDLG1DQUF5RTs7Ozs7SUFFekUsNEJBQXdCOzs7Ozs7O0FBNlp0QyxTQUFTLFlBQVksQ0FBQyxLQUE4QjtJQUNsRCx3RkFBd0Y7SUFDeEYsdUZBQXVGO0lBQ3ZGLGdFQUFnRTtJQUNoRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQy9CLENBQUM7Ozs7OztBQUdELFNBQVMsd0JBQXdCLENBQUMsS0FBOEI7OztVQUV4RCxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO0lBQ3pGLE9BQU8sRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge25vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG5jb25zdCBhY3RpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiBmYWxzZX0pO1xuXG4vKipcbiAqIFZpc3VhbGx5LCBhIDMwcHggc2VwYXJhdGlvbiBiZXR3ZWVuIHRpY2sgbWFya3MgbG9va3MgYmVzdC4gVGhpcyBpcyB2ZXJ5IHN1YmplY3RpdmUgYnV0IGl0IGlzXG4gKiB0aGUgZGVmYXVsdCBzZXBhcmF0aW9uIHdlIGNob3NlLlxuICovXG5jb25zdCBNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gPSAzMDtcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYSBkaXNhYmxlZCBzbGlkZXIuICovXG5jb25zdCBESVNBQkxFRF9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIG5vbi1hY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX05PTkFDVElWRV9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhbiBhY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgPSAxMDtcblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1zbGlkZXIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIFtmb3JtQ29udHJvbF0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIGJ5IHRoZSBNYXRTbGlkZXIgY29tcG9uZW50LiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckNoYW5nZSB7XG4gIC8qKiBUaGUgTWF0U2xpZGVyIHRoYXQgY2hhbmdlZC4gKi9cbiAgc291cmNlOiBNYXRTbGlkZXI7XG5cbiAgLyoqIFRoZSBuZXcgdmFsdWUgb2YgdGhlIHNvdXJjZSBzbGlkZXIuICovXG4gIHZhbHVlOiBudW1iZXIgfCBudWxsO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTbGlkZXJCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuY29uc3QgX01hdFNsaWRlck1peGluQmFzZTpcbiAgICBIYXNUYWJJbmRleEN0b3IgJlxuICAgIENhbkNvbG9yQ3RvciAmXG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIHR5cGVvZiBNYXRTbGlkZXJCYXNlID1cbiAgICAgICAgbWl4aW5UYWJJbmRleChtaXhpbkNvbG9yKG1peGluRGlzYWJsZWQoTWF0U2xpZGVyQmFzZSksICdhY2NlbnQnKSk7XG5cbi8qKlxuICogQWxsb3dzIHVzZXJzIHRvIHNlbGVjdCBmcm9tIGEgcmFuZ2Ugb2YgdmFsdWVzIGJ5IG1vdmluZyB0aGUgc2xpZGVyIHRodW1iLiBJdCBpcyBzaW1pbGFyIGluXG4gKiBiZWhhdmlvciB0byB0aGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1cInJhbmdlXCI+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGVyJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXInLFxuICBwcm92aWRlcnM6IFtNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgaG9zdDoge1xuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXl1cCknOiAnX29uS2V5dXAoKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfb25Nb3VzZWVudGVyKCknLFxuXG4gICAgLy8gT24gU2FmYXJpIHN0YXJ0aW5nIHRvIHNsaWRlIHRlbXBvcmFyaWx5IHRyaWdnZXJzIHRleHQgc2VsZWN0aW9uIG1vZGUgd2hpY2hcbiAgICAvLyBzaG93IHRoZSB3cm9uZyBjdXJzb3IuIFdlIHByZXZlbnQgaXQgYnkgc3RvcHBpbmcgdGhlIGBzZWxlY3RzdGFydGAgZXZlbnQuXG4gICAgJyhzZWxlY3RzdGFydCknOiAnJGV2ZW50LnByZXZlbnREZWZhdWx0KCknLFxuICAgICdjbGFzcyc6ICdtYXQtc2xpZGVyJyxcbiAgICAncm9sZSc6ICdzbGlkZXInLFxuICAgICdbdGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtaW4nLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICd2YWx1ZScsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oYXMtdGlja3NdJzogJ3RpY2tJbnRlcnZhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWF4aXMtaW52ZXJ0ZWRdJzogJ19pbnZlcnRBeGlzJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbW91c2UgY29vcmRpbmF0ZXMgbmVlZCB0byBiZSBpbnZlcnRlZC5cbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaW52ZXJ0LW1vdXNlLWNvb3Jkc10nOiAnX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCknLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1zbGlkaW5nXSc6ICdfaXNTbGlkaW5nJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZ10nOiAndGh1bWJMYWJlbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLW1pbi12YWx1ZV0nOiAnX2lzTWluVmFsdWUnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oaWRlLWxhc3QtdGlja10nOiAnZGlzYWJsZWQgfHwgX2lzTWluVmFsdWUgJiYgX3RodW1iR2FwICYmIF9pbnZlcnRBeGlzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXIuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyIGV4dGVuZHMgX01hdFNsaWRlck1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSwgQ2FuQ29sb3IsIE9uSW5pdCwgSGFzVGFiSW5kZXgge1xuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGludmVydGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaW52ZXJ0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW52ZXJ0OyB9XG4gIHNldCBpbnZlcnQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbnZlcnQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ludmVydCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX21pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21pbik7XG5cbiAgICAvLyBJZiB0aGUgdmFsdWUgd2Fzbid0IGV4cGxpY2l0bHkgc2V0IGJ5IHRoZSB1c2VyLCBzZXQgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9taW46IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3N0ZXA7IH1cbiAgc2V0IHN0ZXAodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fc3RlcCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX3N0ZXApO1xuXG4gICAgaWYgKHRoaXMuX3N0ZXAgJSAxICE9PSAwKSB7XG4gICAgICB0aGlzLl9yb3VuZFRvRGVjaW1hbCA9IHRoaXMuX3N0ZXAudG9TdHJpbmcoKS5zcGxpdCgnLicpLnBvcCgpIS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhpcyBjb3VsZCBtb2RpZnkgdGhlIGxhYmVsLCB3ZSBuZWVkIHRvIG5vdGlmeSB0aGUgY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9zdGVwOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSB0aHVtYiBsYWJlbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRodW1iTGFiZWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl90aHVtYkxhYmVsOyB9XG4gIHNldCB0aHVtYkxhYmVsKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3RodW1iTGFiZWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3RodW1iTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIHNob3cgdGlja3MuIFJlbGF0aXZlIHRvIHRoZSBzdGVwIHNvIHRoYXQgYSB0aWNrIGFsd2F5cyBhcHBlYXJzIG9uIGEgc3RlcC5cbiAgICogRXg6IFRpY2sgaW50ZXJ2YWwgb2YgNCB3aXRoIGEgc3RlcCBvZiAzIHdpbGwgZHJhdyBhIHRpY2sgZXZlcnkgNCBzdGVwcyAoZXZlcnkgMTIgdmFsdWVzKS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aWNrSW50ZXJ2YWwoKSB7IHJldHVybiB0aGlzLl90aWNrSW50ZXJ2YWw7IH1cbiAgc2V0IHRpY2tJbnRlcnZhbCh2YWx1ZTogJ2F1dG8nIHwgbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlID09PSAnYXV0bycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9ICdhdXRvJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIHRoaXMuX3RpY2tJbnRlcnZhbCBhcyBudW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAwO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF90aWNrSW50ZXJ2YWw6ICdhdXRvJyB8IG51bWJlciA9IDA7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVhZCBhbmQgaXQgaXMgc3RpbGwgdW5pbml0aWFsaXplZCwgaW5pdGlhbGl6ZSBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgaWYgKHYgIT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICBsZXQgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KTtcblxuICAgICAgLy8gV2hpbGUgaW5jcmVtZW50aW5nIGJ5IGEgZGVjaW1hbCB3ZSBjYW4gZW5kIHVwIHdpdGggdmFsdWVzIGxpa2UgMzMuMzAwMDAwMDAwMDAwMDA0LlxuICAgICAgLy8gVHJ1bmNhdGUgaXQgdG8gZW5zdXJlIHRoYXQgaXQgbWF0Y2hlcyB0aGUgbGFiZWwgYW5kIHRvIG1ha2UgaXQgZWFzaWVyIHRvIHdvcmsgd2l0aC5cbiAgICAgIGlmICh0aGlzLl9yb3VuZFRvRGVjaW1hbCkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsOyB9XG4gIHNldCB2ZXJ0aWNhbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3ZlcnRpY2FsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF92ZXJ0aWNhbCA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgbW92ZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBpbnB1dDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgcmF3IHZhbHVlIG9mIHRoZSBzbGlkZXIgY2hhbmdlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseVxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0d28td2F5IGJpbmRpbmcgZm9yIHRoZSBgdmFsdWVgIGlucHV0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4oKTtcblxuICAvKiogVGhlIHZhbHVlIHRvIGJlIHVzZWQgZm9yIGRpc3BsYXkgcHVycG9zZXMuICovXG4gIGdldCBkaXNwbGF5VmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5V2l0aCkge1xuICAgICAgLy8gVmFsdWUgaXMgbmV2ZXIgbnVsbCBidXQgc2luY2Ugc2V0dGVycyBhbmQgZ2V0dGVycyBjYW5ub3QgaGF2ZVxuICAgICAgLy8gZGlmZmVyZW50IHR5cGVzLCB0aGUgdmFsdWUgZ2V0dGVyIGlzIGFsc28gdHlwZWQgdG8gcmV0dXJuIG51bGwuXG4gICAgICByZXR1cm4gdGhpcy5kaXNwbGF5V2l0aCh0aGlzLnZhbHVlISk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgY291bGQgYmUgaW1wcm92ZWQgZnVydGhlciBieSByb3VuZGluZyBzb21ldGhpbmcgbGlrZSAwLjk5OSB0byAxIG9yXG4gICAgLy8gMC44OTkgdG8gMC45LCBob3dldmVyIGl0IGlzIHZlcnkgcGVyZm9ybWFuY2Ugc2Vuc2l0aXZlLCBiZWNhdXNlIGl0IGdldHMgY2FsbGVkIG9uXG4gICAgLy8gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICUgMSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudmFsdWUgfHwgMDtcbiAgfVxuXG4gIC8qKiBzZXQgZm9jdXMgdG8gdGhlIGhvc3QgZWxlbWVudCAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBibHVyIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgYmx1cigpIHtcbiAgICB0aGlzLl9ibHVySG9zdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBvblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY2xhbXAodGhpcy5fcGVyY2VudCk7IH1cbiAgcHJpdmF0ZSBfcGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHRodW1iIGlzIHNsaWRpbmcuXG4gICAqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZXJlIHNob3VsZCBiZSBhIHRyYW5zaXRpb24gZm9yIHRoZSB0aHVtYiBhbmQgZmlsbCB0cmFjay5cbiAgICovXG4gIF9pc1NsaWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHNsaWRlciBpcyBhY3RpdmUgKGNsaWNrZWQgb3Igc2xpZGluZykuXG4gICAqIFVzZWQgdG8gc2hyaW5rIGFuZCBncm93IHRoZSB0aHVtYiBhcyBhY2NvcmRpbmcgdG8gdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjLlxuICAgKi9cbiAgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF4aXMgb2YgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC5cbiAgICogKGkuZS4gd2hldGhlciBtb3ZpbmcgdGhlIHRodW1iIGluIHRoZSBwb3NpdGl2ZSB4IG9yIHkgZGlyZWN0aW9uIGRlY3JlYXNlcyB0aGUgc2xpZGVyJ3MgdmFsdWUpLlxuICAgKi9cbiAgZ2V0IF9pbnZlcnRBeGlzKCkge1xuICAgIC8vIFN0YW5kYXJkIG5vbi1pbnZlcnRlZCBtb2RlIGZvciBhIHZlcnRpY2FsIHNsaWRlciBzaG91bGQgYmUgZHJhZ2dpbmcgdGhlIHRodW1iIGZyb20gYm90dG9tIHRvXG4gICAgLy8gdG9wLiBIb3dldmVyIGZyb20gYSB5LWF4aXMgc3RhbmRwb2ludCB0aGlzIGlzIGludmVydGVkLlxuICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gIXRoaXMuaW52ZXJ0IDogdGhpcy5pbnZlcnQ7XG4gIH1cblxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG4gIGdldCBfaXNNaW5WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wZXJjZW50ID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gbGVhdmUgYmV0d2VlbiB0aGUgc2xpZGVyIHRodW1iIGFuZCB0aGUgdHJhY2sgZmlsbCAmIHRyYWNrIGJhY2tncm91bmRcbiAgICogZWxlbWVudHMuXG4gICAqL1xuICBnZXQgX3RodW1iR2FwKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gRElTQUJMRURfVEhVTUJfR0FQO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiAhdGhpcy50aHVtYkxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNBY3RpdmUgPyBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA6IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgYmFja2dyb3VuZCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrQmFja2dyb3VuZFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHsxIC0gdGhpcy5wZXJjZW50fSwgMWAgOiBgJHsxIC0gdGhpcy5wZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnLScgOiAnJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgZmlsbCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrRmlsbFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAke3BlcmNlbnR9LCAxYCA6IGAke3BlcmNlbnR9LCAxLCAxYDtcbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICcnIDogJy0nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX3RodW1iR2FwfXB4KSBzY2FsZTNkKCR7c2NhbGV9KWAsXG4gICAgICAvLyBpT1MgU2FmYXJpIGhhcyBhIGJ1ZyB3aGVyZSBpdCB3b24ndCByZS1yZW5kZXIgZWxlbWVudHMgd2hpY2ggc3RhcnQgb2YgYXMgYHNjYWxlKDApYCB1bnRpbFxuICAgICAgLy8gc29tZXRoaW5nIGZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb24gaXQuIFNpbmNlIHdlJ2xsIGVuZCB1cCB3aXRoIGBzY2FsZSgwKWAgd2hlblxuICAgICAgLy8gdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgaXMgMCwgd2UgY2FuIGVhc2lseSBnZXQgaW50byB0aGlzIHNpdHVhdGlvbi4gV2UgZm9yY2UgYVxuICAgICAgLy8gcmVjYWxjdWxhdGlvbiBieSBjaGFuZ2luZyB0aGUgZWxlbWVudCdzIGBkaXNwbGF5YCB3aGVuIGl0IGdvZXMgZnJvbSAwIHRvIGFueSBvdGhlciB2YWx1ZS5cbiAgICAgIGRpc3BsYXk6IHBlcmNlbnQgPT09IDAgPyAnbm9uZScgOiAnJ1xuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGNvbnRhaW5lciBlbGVtZW50LiAqL1xuICBnZXQgX3RpY2tzQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRpY2tzIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgc2lnbiA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gJycgOiAnLSc7XG4gICAgbGV0IG9mZnNldCA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgLyAyICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGVsZW1lbnQuICovXG4gIGdldCBfdGlja3NTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IHRpY2tTaXplID0gdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCAqIDEwMDtcbiAgICBsZXQgYmFja2dyb3VuZFNpemUgPSB0aGlzLnZlcnRpY2FsID8gYDJweCAke3RpY2tTaXplfSVgIDogYCR7dGlja1NpemV9JSAycHhgO1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiB3ZSBwdXNoZWQgdGhlIHRpY2tzIGNvbnRhaW5lciwgcHVzaCB0aGUgdGlja3MgdGhlIG9wcG9zaXRlXG4gICAgLy8gZGlyZWN0aW9uIHRvIHJlLWNlbnRlciB0aGVtIGJ1dCBjbGlwIG9mZiB0aGUgZW5kIGVkZ2UuIEluIFJUTCBsYW5ndWFnZXMgd2UgbmVlZCB0byBmbGlwIHRoZVxuICAgIC8vIHRpY2tzIDE4MCBkZWdyZWVzIHNvIHdlJ3JlIHJlYWxseSBjdXR0aW5nIG9mZiB0aGUgZW5kIGVkZ2UgYWJkIG5vdCB0aGUgc3RhcnQuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICctJyA6ICcnO1xuICAgIGxldCByb3RhdGUgPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcgcm90YXRlKDE4MGRlZyknIDogJyc7XG4gICAgbGV0IHN0eWxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IGJhY2tncm91bmRTaXplLFxuICAgICAgLy8gV2l0aG91dCB0cmFuc2xhdGVaIHRpY2tzIHNvbWV0aW1lcyBqaXR0ZXIgYXMgdGhlIHNsaWRlciBtb3ZlcyBvbiBDaHJvbWUgJiBGaXJlZm94LlxuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiB0aGlzLl90aHVtYkdhcCkge1xuICAgICAgbGV0IHNpZGU6IHN0cmluZztcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgc2lkZSA9IHRoaXMuX2ludmVydEF4aXMgPyAnQm90dG9tJyA6ICdUb3AnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2lkZSA9IHRoaXMuX2ludmVydEF4aXMgPyAnUmlnaHQnIDogJ0xlZnQnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXNbYHBhZGRpbmcke3NpZGV9YF0gPSBgJHt0aGlzLl90aHVtYkdhcH1weGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuXG4gIGdldCBfdGh1bWJDb250YWluZXJTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGh1bWIgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGxldCBpbnZlcnRPZmZzZXQgPVxuICAgICAgICAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXRoaXMuX2ludmVydEF4aXMgOiB0aGlzLl9pbnZlcnRBeGlzO1xuICAgIGxldCBvZmZzZXQgPSAoaW52ZXJ0T2Zmc2V0ID8gdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudCkgKiAxMDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlJHtheGlzfSgtJHtvZmZzZXR9JSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBUaGUgc2l6ZSBvZiBhIHRpY2sgaW50ZXJ2YWwgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBzaXplIG9mIHRoZSB0cmFjay4gKi9cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsUGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVyRGltZW5zaW9uczogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIERlY2ltYWwgcGxhY2VzIHRvIHJvdW5kIHRvLCBiYXNlZCBvbiB0aGUgc3RlcCBhbW91bnQuICovXG4gIHByaXZhdGUgX3JvdW5kVG9EZWNpbWFsOiBudW1iZXI7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0aGUgRGlyZWN0aW9uYWxpdHkgY2hhbmdlIEV2ZW50RW1pdHRlci4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIHNsaWRlciB3aGVuIHRoZSBzbGlkZSBzdGFydCBldmVudCBmaXJlcy4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPblNsaWRlU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIHdoZW4gdGhlIGRyYWdnaW5nIHN0YXJ0ZWQuICovXG4gIHByaXZhdGUgX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQ6IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIHNsaWRlciB3cmFwcGVyIGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcldyYXBwZXInKSBwcml2YXRlIF9zbGlkZXJXcmFwcGVyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG1vdXNlIGV2ZW50cyBzaG91bGQgYmUgY29udmVydGVkIHRvIGEgc2xpZGVyIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZWlyIGRpc3RhbmNlXG4gICAqIGZyb20gdGhlIHJpZ2h0IG9yIGJvdHRvbSBlZGdlIG9mIHRoZSBzbGlkZXIgYXMgb3Bwb3NlZCB0byB0aGUgdG9wIG9yIGxlZnQuXG4gICAqL1xuICBfc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCkgPyAhdGhpcy5faW52ZXJ0QXhpcyA6IHRoaXMuX2ludmVydEF4aXM7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PSAncnRsJykgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBsYXN0IHBvaW50ZXIgZXZlbnQgdGhhdCB3YXMgY2FwdHVyZWQgYnkgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfbGFzdFBvaW50ZXJFdmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQgfCBudWxsO1xuXG4gIC8qKiBVc2VkIHRvIHN1YnNjcmliZSB0byBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cyAqL1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50PzogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYF9uZ1pvbmVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU/OiBOZ1pvbmUsXG4gICAgICAgICAgICAgIC8qKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBtYWtlIGRvY3VtZW50IHJlcXVpcmVkICovXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuXG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgdGhpcy5fcnVuT3V0c2l6ZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvclxuICAgICAgICAubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKVxuICAgICAgICAuc3Vic2NyaWJlKChvcmlnaW46IEZvY3VzT3JpZ2luKSA9PiB7XG4gICAgICAgICAgdGhpcy5faXNBY3RpdmUgPSAhIW9yaWdpbiAmJiBvcmlnaW4gIT09ICdrZXlib2FyZCc7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9KTtcbiAgICBpZiAodGhpcy5fZGlyKSB7XG4gICAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLl9kaXIuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIF9vbk1vdXNlZW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkZvY3VzKCkge1xuICAgIC8vIFdlIHNhdmUgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlciBoZXJlIHNvIHdlIGNhbiB1c2UgdGhlbSB0byB1cGRhdGUgdGhlIHNwYWNpbmcgb2YgdGhlXG4gICAgLy8gdGlja3MgYW5kIGRldGVybWluZSB3aGVyZSBvbiB0aGUgc2xpZGVyIGNsaWNrIGFuZCBzbGlkZSBldmVudHMgaGFwcGVuLlxuICAgIHRoaXMuX3NsaWRlckRpbWVuc2lvbnMgPSB0aGlzLl9nZXRTbGlkZXJEaW1lbnNpb25zKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpO1xuICB9XG5cbiAgX29uQmx1cigpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IGhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoLTEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgLy8gTk9URTogRm9yIGEgc2lnaHRlZCB1c2VyIGl0IHdvdWxkIG1ha2UgbW9yZSBzZW5zZSB0aGF0IHdoZW4gdGhleSBwcmVzcyBhbiBhcnJvdyBrZXkgb24gYW5cbiAgICAgICAgLy8gaW52ZXJ0ZWQgc2xpZGVyIHRoZSB0aHVtYiBtb3ZlcyBpbiB0aGF0IGRpcmVjdGlvbi4gSG93ZXZlciBmb3IgYSBibGluZCB1c2VyLCBub3RoaW5nXG4gICAgICAgIC8vIGFib3V0IHRoZSBzbGlkZXIgaW5kaWNhdGVzIHRoYXQgaXQgaXMgaW52ZXJ0ZWQuIFRoZXkgd2lsbCBleHBlY3QgbGVmdCB0byBiZSBkZWNyZW1lbnQsXG4gICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2YgaG93IGl0IGFwcGVhcnMgb24gdGhlIHNjcmVlbi4gRm9yIHNwZWFrZXJzIG9mUlRMIGxhbmd1YWdlcywgdGhleSBwcm9iYWJseVxuICAgICAgICAvLyBleHBlY3QgbGVmdCB0byBtZWFuIGluY3JlbWVudC4gVGhlcmVmb3JlIHdlIGZsaXAgdGhlIG1lYW5pbmcgb2YgdGhlIHNpZGUgYXJyb3cga2V5cyBmb3JcbiAgICAgICAgLy8gUlRMLiBGb3IgaW52ZXJ0ZWQgc2xpZGVycyB3ZSBwcmVmZXIgYSBnb29kIGExMXkgZXhwZXJpZW5jZSB0byBoYXZpbmcgaXQgXCJsb29rIHJpZ2h0XCIgZm9yXG4gICAgICAgIC8vIHNpZ2h0ZWQgdXNlcnMsIHRoZXJlZm9yZSB3ZSBkbyBub3Qgc3dhcCB0aGUgbWVhbmluZy5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50KHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gMSA6IC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgLy8gU2VlIGNvbW1lbnQgb24gTEVGVF9BUlJPVyBhYm91dCB0aGUgY29uZGl0aW9ucyB1bmRlciB3aGljaCB3ZSBmbGlwIHRoZSBtZWFuaW5nLlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBSZXR1cm4gaWYgdGhlIGtleSBpcyBub3Qgb25lIHRoYXQgd2UgZXhwbGljaXRseSBoYW5kbGUgdG8gYXZvaWQgY2FsbGluZyBwcmV2ZW50RGVmYXVsdCBvblxuICAgICAgICAvLyBpdC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgX29uS2V5dXAoKSB7XG4gICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIHB1dCB0aGVpciBwb2ludGVyIGRvd24gb24gdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlckRvd24gPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgdGhlIHNsaWRlciBpcyBkaXNhYmxlZCBvciB0aGVcbiAgICAvLyB1c2VyIGlzIHVzaW5nIGFueXRoaW5nIG90aGVyIHRoYW4gdGhlIG1haW4gbW91c2UgYnV0dG9uLlxuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuX2lzU2xpZGluZyB8fCAoIWlzVG91Y2hFdmVudChldmVudCkgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3J1bkluc2lkZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KTtcbiAgICAgIHRoaXMuX2lzU2xpZGluZyA9IHRydWU7XG4gICAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gZXZlbnQ7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuICAgICAgdGhpcy5fb25Nb3VzZWVudGVyKCk7IC8vIFNpbXVsYXRlIG1vdXNlZW50ZXIgaW4gY2FzZSB0aGlzIGlzIGEgbW9iaWxlIGRldmljZS5cbiAgICAgIHRoaXMuX2JpbmRHbG9iYWxFdmVudHMoZXZlbnQpO1xuICAgICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24ocG9pbnRlclBvc2l0aW9uKTtcbiAgICAgIHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ID0gdGhpcy52YWx1ZTtcbiAgICAgIHRoaXMuX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQgPSBwb2ludGVyUG9zaXRpb247XG5cbiAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgYW5kIGlucHV0IGV2ZW50IGlmIHRoZSB2YWx1ZSBjaGFuZ2VkLlxuICAgICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIG1vdmVkIHRoZWlyIHBvaW50ZXIgYWZ0ZXJcbiAgICogc3RhcnRpbmcgdG8gZHJhZy4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcG9pbnRlck1vdmUgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgLy8gUHJldmVudCB0aGUgc2xpZGUgZnJvbSBzZWxlY3RpbmcgYW55dGhpbmcgZWxzZS5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpKTtcblxuICAgICAgLy8gTmF0aXZlIHJhbmdlIGVsZW1lbnRzIGFsd2F5cyBlbWl0IGBpbnB1dGAgZXZlbnRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZWQgd2hpbGUgc2xpZGluZy5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBsaWZ0ZWQgdGhlaXIgcG9pbnRlci4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXAgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHRoaXMuX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQ7XG4gICAgICBjb25zdCBjdXJyZW50UG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0ID0gdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IG51bGw7XG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ICE9IHRoaXMudmFsdWUgJiYgIXRoaXMuZGlzYWJsZWQgJiZcbiAgICAgICAgICBwb2ludGVyUG9zaXRpb25PblN0YXJ0ICYmIChwb2ludGVyUG9zaXRpb25PblN0YXJ0LnggIT09IGN1cnJlbnRQb2ludGVyUG9zaXRpb24ueCB8fFxuICAgICAgICAgIHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQueSAhPT0gY3VycmVudFBvaW50ZXJQb3NpdGlvbi55KSkge1xuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBoYXMgbG9zdCBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgd2luZG93IGlzIGJsdXJyZWQgd2hpbGUgZHJhZ2dpbmcgd2UgbmVlZCB0byBzdG9wIGRyYWdnaW5nIGJlY2F1c2UgdGhlXG4gICAgLy8gYnJvd3NlciB3b24ndCBkaXNwYXRjaCB0aGUgYG1vdXNldXBgIGFuZCBgdG91Y2hlbmRgIGV2ZW50cyBhbnltb3JlLlxuICAgIGlmICh0aGlzLl9sYXN0UG9pbnRlckV2ZW50KSB7XG4gICAgICB0aGlzLl9wb2ludGVyVXAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIG91ciBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cy4gVGhleSdyZSBib3VuZCBhdCB0aGUgZG9jdW1lbnQgbGV2ZWwgYW5kIG9ubHkgd2hpbGVcbiAgICogZHJhZ2dpbmcgc28gdGhhdCB0aGUgdXNlciBkb2Vzbid0IGhhdmUgdG8ga2VlcCB0aGVpciBwb2ludGVyIGV4YWN0bHkgb3ZlciB0aGUgc2xpZGVyXG4gICAqIGFzIHRoZXkncmUgc3dpcGluZyBhY3Jvc3MgdGhlIHNjcmVlbi5cbiAgICovXG4gIHByaXZhdGUgX2JpbmRHbG9iYWxFdmVudHModHJpZ2dlckV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHRoaXMuX2RvY3VtZW50KSB7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICAgIGNvbnN0IGlzVG91Y2ggPSBpc1RvdWNoRXZlbnQodHJpZ2dlckV2ZW50KTtcbiAgICAgIGNvbnN0IG1vdmVFdmVudE5hbWUgPSBpc1RvdWNoID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcbiAgICAgIGNvbnN0IGVuZEV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2hlbmQnIDogJ21vdXNldXAnO1xuICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKG1vdmVFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgICBpZiAoaXNUb3VjaCkge1xuICAgICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGFueSBnbG9iYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2UgbWF5IGhhdmUgYWRkZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUdsb2JhbEV2ZW50cygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2RvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLl9kb2N1bWVudCkge1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbmNyZW1lbnRzIHRoZSBzbGlkZXIgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBzdGVwcyAobmVnYXRpdmUgbnVtYmVyIGRlY3JlbWVudHMpLiAqL1xuICBwcml2YXRlIF9pbmNyZW1lbnQobnVtU3RlcHM6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcCgodGhpcy52YWx1ZSB8fCAwKSArIHRoaXMuc3RlcCAqIG51bVN0ZXBzLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbmV3IHZhbHVlIGZyb20gdGhlIG5ldyBwaHlzaWNhbCBsb2NhdGlvbi4gVGhlIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHNuYXBwZWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvczoge3g6IG51bWJlciwgeTogbnVtYmVyfSkge1xuICAgIGlmICghdGhpcy5fc2xpZGVyRGltZW5zaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy50b3AgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmxlZnQ7XG4gICAgbGV0IHNpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgIGxldCBwb3NDb21wb25lbnQgPSB0aGlzLnZlcnRpY2FsID8gcG9zLnkgOiBwb3MueDtcblxuICAgIC8vIFRoZSBleGFjdCB2YWx1ZSBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIGV2ZW50IGFuZCB1c2VkIHRvIGZpbmQgdGhlIGNsb3Nlc3Qgc25hcCB2YWx1ZS5cbiAgICBsZXQgcGVyY2VudCA9IHRoaXMuX2NsYW1wKChwb3NDb21wb25lbnQgLSBvZmZzZXQpIC8gc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSkge1xuICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBzdGVwcyBtYXkgbm90IGRpdmlkZSBjbGVhbmx5IGludG8gdGhlIG1heCB2YWx1ZSwgaWYgdGhlIHVzZXJcbiAgICAvLyBzbGlkIHRvIDAgb3IgMTAwIHBlcmNlbnQsIHdlIGp1bXAgdG8gdGhlIG1pbi9tYXggdmFsdWUuIFRoaXMgYXBwcm9hY2hcbiAgICAvLyBpcyBzbGlnaHRseSBtb3JlIGludHVpdGl2ZSB0aGFuIHVzaW5nIGBNYXRoLmNlaWxgIGJlbG93LCBiZWNhdXNlIGl0XG4gICAgLy8gZm9sbG93cyB0aGUgdXNlcidzIHBvaW50ZXIgY2xvc2VyLlxuICAgIGlmIChwZXJjZW50ID09PSAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgfSBlbHNlIGlmIChwZXJjZW50ID09PSAxKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4YWN0VmFsdWUgPSB0aGlzLl9jYWxjdWxhdGVWYWx1ZShwZXJjZW50KTtcblxuICAgICAgLy8gVGhpcyBjYWxjdWxhdGlvbiBmaW5kcyB0aGUgY2xvc2VzdCBzdGVwIGJ5IGZpbmRpbmcgdGhlIGNsb3Nlc3RcbiAgICAgIC8vIHdob2xlIG51bWJlciBkaXZpc2libGUgYnkgdGhlIHN0ZXAgcmVsYXRpdmUgdG8gdGhlIG1pbi5cbiAgICAgIGNvbnN0IGNsb3Nlc3RWYWx1ZSA9IE1hdGgucm91bmQoKGV4YWN0VmFsdWUgLSB0aGlzLm1pbikgLyB0aGlzLnN0ZXApICogdGhpcy5zdGVwICsgdGhpcy5taW47XG5cbiAgICAgIC8vIFRoZSB2YWx1ZSBuZWVkcyB0byBzbmFwIHRvIHRoZSBtaW4gYW5kIG1heC5cbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcChjbG9zZXN0VmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGlucHV0IGV2ZW50IHdoZW4gdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdElucHV0RXZlbnQoKSB7XG4gICAgdGhpcy5pbnB1dC5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpY2tzIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGggb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpIHtcbiAgICBpZiAoIXRoaXMudGlja0ludGVydmFsIHx8ICF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGlja0ludGVydmFsID09ICdhdXRvJykge1xuICAgICAgbGV0IHRyYWNrU2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgICBsZXQgcGl4ZWxzUGVyU3RlcCA9IHRyYWNrU2l6ZSAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgIGxldCBzdGVwc1BlclRpY2sgPSBNYXRoLmNlaWwoTUlOX0FVVE9fVElDS19TRVBBUkFUSU9OIC8gcGl4ZWxzUGVyU3RlcCk7XG4gICAgICBsZXQgcGl4ZWxzUGVyVGljayA9IHN0ZXBzUGVyVGljayAqIHRoaXMuc3RlcDtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSBwaXhlbHNQZXJUaWNrIC8gdHJhY2tTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gdGhpcy50aWNrSW50ZXJ2YWwgKiB0aGlzLnN0ZXAgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBzbGlkZXIgY2hhbmdlIG9iamVjdCBmcm9tIHRoZSBzcGVjaWZpZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KHZhbHVlID0gdGhpcy52YWx1ZSk6IE1hdFNsaWRlckNoYW5nZSB7XG4gICAgbGV0IGV2ZW50ID0gbmV3IE1hdFNsaWRlckNoYW5nZSgpO1xuXG4gICAgZXZlbnQuc291cmNlID0gdGhpcztcbiAgICBldmVudC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGEgdmFsdWUgaXMuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWU6IG51bWJlciB8IG51bGwpIHtcbiAgICByZXR1cm4gKCh2YWx1ZSB8fCAwKSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSB2YWx1ZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciBjb3JyZXNwb25kcyB0by4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlVmFsdWUocGVyY2VudGFnZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMubWluICsgcGVyY2VudGFnZSAqICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBudW1iZXIgYmV0d2VlbiB0d28gbnVtYmVycy4gKi9cbiAgcHJpdmF0ZSBfY2xhbXAodmFsdWU6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMSkge1xuICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIHRoZSBzbGlkZXIgdHJhY2sgZWxlbWVudC5cbiAgICogVGhlIHRyYWNrIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlIG5hdGl2ZSBlbGVtZW50IHRvIGlnbm9yZSB0aGUgZXh0cmEgc3BhY2UgdGhhdCB0aGUgdGh1bWIgY2FuXG4gICAqIHRha2UgdXAuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTbGlkZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXJXcmFwcGVyID8gdGhpcy5fc2xpZGVyV3JhcHBlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICogQ3VycmVudGx5IG9ubHkgdXNlZCB0byBhbGxvdyBhIGJsdXIgZXZlbnQgdG8gZmlyZSBidXQgd2lsbCBiZSB1c2VkIHdpdGgga2V5Ym9hcmQgaW5wdXQgbGF0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9ibHVySG9zdEVsZW1lbnQoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgY2FsbGJhY2sgaW5zaWRlIG9mIHRoZSBOZ1pvbmUsIGlmIHBvc3NpYmxlLiAqL1xuICBwcml2YXRlIF9ydW5JbnNpZGVab25lKGZuOiAoKSA9PiBhbnkpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIFJlbW92ZSB0aGlzIGZ1bmN0aW9uIG9uY2UgYF9uZ1pvbmVgIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgIHRoaXMuX25nWm9uZSA/IHRoaXMuX25nWm9uZS5ydW4oZm4pIDogZm4oKTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgY2FsbGJhY2sgb3V0c2lkZSBvZiB0aGUgTmdab25lLCBpZiBwb3NzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfcnVuT3V0c2l6ZVpvbmUoZm46ICgpID0+IGFueSkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIHRoaXMgZnVuY3Rpb24gb25jZSBgX25nWm9uZWAgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fbmdab25lID8gdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZuKSA6IGZuKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbW9kZWwgdmFsdWUuIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIHRvdWNoZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB3aGV0aGVyIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZFxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW52ZXJ0OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9tYXg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbWluOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0ZXA6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGh1bWJMYWJlbDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGlja0ludGVydmFsOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZlcnRpY2FsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKiogUmV0dXJucyB3aGV0aGVyIGFuIGV2ZW50IGlzIGEgdG91Y2ggZXZlbnQuICovXG5mdW5jdGlvbiBpc1RvdWNoRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogZXZlbnQgaXMgVG91Y2hFdmVudCB7XG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBldmVyeSBwaXhlbCB0aGF0IHRoZSB1c2VyIGhhcyBkcmFnZ2VkIHNvIHdlIG5lZWQgaXQgdG8gYmVcbiAgLy8gYXMgZmFzdCBhcyBwb3NzaWJsZS4gU2luY2Ugd2Ugb25seSBiaW5kIG1vdXNlIGV2ZW50cyBhbmQgdG91Y2ggZXZlbnRzLCB3ZSBjYW4gYXNzdW1lXG4gIC8vIHRoYXQgaWYgdGhlIGV2ZW50J3MgbmFtZSBzdGFydHMgd2l0aCBgdGAsIGl0J3MgYSB0b3VjaCBldmVudC5cbiAgcmV0dXJuIGV2ZW50LnR5cGVbMF0gPT09ICd0Jztcbn1cblxuLyoqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGEgdG91Y2ggb3IgbW91c2UgZXZlbnQgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LiAqL1xuZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAvLyBgdG91Y2hlc2Agd2lsbCBiZSBlbXB0eSBmb3Igc3RhcnQvZW5kIGV2ZW50cyBzbyB3ZSBoYXZlIHRvIGZhbGwgYmFjayB0byBgY2hhbmdlZFRvdWNoZXNgLlxuICBjb25zdCBwb2ludCA9IGlzVG91Y2hFdmVudChldmVudCkgPyAoZXZlbnQudG91Y2hlc1swXSB8fCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSkgOiBldmVudDtcbiAgcmV0dXJuIHt4OiBwb2ludC5jbGllbnRYLCB5OiBwb2ludC5jbGllbnRZfTtcbn1cbiJdfQ==