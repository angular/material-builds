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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBT0wsVUFBVSxFQUNWLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQzs7TUFFNUIsa0JBQWtCLEdBQUcsK0JBQStC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Qzs7Ozs7O0lBR0QsK0JBZ0JDOzs7Ozs7SUFHRCxnQ0FNQzs7Ozs7SUEzTVcsa0NBQW1DOzs7OztJQUNuQyx1Q0FBNkM7Ozs7O0lBQzdDLHlCQUF3Qzs7SUFHeEMsbUNBQXlFOzs7OztJQUV6RSw0QkFBd0I7Ozs7Ozs7QUE2WnRDLFNBQVMsWUFBWSxDQUFDLEtBQThCO0lBQ2xELHdGQUF3RjtJQUN4Rix1RkFBdUY7SUFDdkYsZ0VBQWdFO0lBQ2hFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDL0IsQ0FBQzs7Ozs7O0FBR0QsU0FBUyx3QkFBd0IsQ0FBQyxLQUE4Qjs7O1VBRXhELEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7SUFDekYsT0FBTyxFQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgSE9NRSxcbiAgTEVGVF9BUlJPVyxcbiAgUEFHRV9ET1dOLFxuICBQQUdFX1VQLFxuICBSSUdIVF9BUlJPVyxcbiAgVVBfQVJST1csXG4gIGhhc01vZGlmaWVyS2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuQ29sb3JDdG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbmNvbnN0IGFjdGl2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IGZhbHNlfSk7XG5cbi8qKlxuICogVmlzdWFsbHksIGEgMzBweCBzZXBhcmF0aW9uIGJldHdlZW4gdGljayBtYXJrcyBsb29rcyBiZXN0LiBUaGlzIGlzIHZlcnkgc3ViamVjdGl2ZSBidXQgaXQgaXNcbiAqIHRoZSBkZWZhdWx0IHNlcGFyYXRpb24gd2UgY2hvc2UuXG4gKi9cbmNvbnN0IE1JTl9BVVRPX1RJQ0tfU0VQQVJBVElPTiA9IDMwO1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIGRpc2FibGVkIHNsaWRlci4gKi9cbmNvbnN0IERJU0FCTEVEX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGEgbm9uLWFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGFuIGFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA9IDEwO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LXNsaWRlciB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogVGhpcyBhbGxvd3MgaXQgdG8gc3VwcG9ydCBbKG5nTW9kZWwpXSBhbmQgW2Zvcm1Db250cm9sXS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQSBzaW1wbGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgYnkgdGhlIE1hdFNsaWRlciBjb21wb25lbnQuICovXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyQ2hhbmdlIHtcbiAgLyoqIFRoZSBNYXRTbGlkZXIgdGhhdCBjaGFuZ2VkLiAqL1xuICBzb3VyY2U6IE1hdFNsaWRlcjtcblxuICAvKiogVGhlIG5ldyB2YWx1ZSBvZiB0aGUgc291cmNlIHNsaWRlci4gKi9cbiAgdmFsdWU6IG51bWJlciB8IG51bGw7XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2xpZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNsaWRlckJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0U2xpZGVyTWl4aW5CYXNlOlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuQ29sb3JDdG9yICZcbiAgICBDYW5EaXNhYmxlQ3RvciAmXG4gICAgdHlwZW9mIE1hdFNsaWRlckJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlZChNYXRTbGlkZXJCYXNlKSwgJ2FjY2VudCcpKTtcblxuLyoqXG4gKiBBbGxvd3MgdXNlcnMgdG8gc2VsZWN0IGZyb20gYSByYW5nZSBvZiB2YWx1ZXMgYnkgbW92aW5nIHRoZSBzbGlkZXIgdGh1bWIuIEl0IGlzIHNpbWlsYXIgaW5cbiAqIGJlaGF2aW9yIHRvIHRoZSBuYXRpdmUgYDxpbnB1dCB0eXBlPVwicmFuZ2VcIj5gIGVsZW1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zbGlkZXInLFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIHByb3ZpZGVyczogW01BVF9TTElERVJfVkFMVUVfQUNDRVNTT1JdLFxuICBob3N0OiB7XG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGtleXVwKSc6ICdfb25LZXl1cCgpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19vbk1vdXNlZW50ZXIoKScsXG5cbiAgICAvLyBPbiBTYWZhcmkgc3RhcnRpbmcgdG8gc2xpZGUgdGVtcG9yYXJpbHkgdHJpZ2dlcnMgdGV4dCBzZWxlY3Rpb24gbW9kZSB3aGljaFxuICAgIC8vIHNob3cgdGhlIHdyb25nIGN1cnNvci4gV2UgcHJldmVudCBpdCBieSBzdG9wcGluZyB0aGUgYHNlbGVjdHN0YXJ0YCBldmVudC5cbiAgICAnKHNlbGVjdHN0YXJ0KSc6ICckZXZlbnQucHJldmVudERlZmF1bHQoKScsXG4gICAgJ2NsYXNzJzogJ21hdC1zbGlkZXIgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ3JvbGUnOiAnc2xpZGVyJyxcbiAgICAnW3RhYkluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbWF4JyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1pbl0nOiAnbWluJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAndmFsdWUnLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICd2ZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGFzLXRpY2tzXSc6ICd0aWNrSW50ZXJ2YWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1ob3Jpem9udGFsXSc6ICchdmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1heGlzLWludmVydGVkXSc6ICdfaW52ZXJ0QXhpcycsXG4gICAgLy8gQ2xhc3MgYmluZGluZyB3aGljaCBpcyBvbmx5IHVzZWQgYnkgdGhlIHRlc3QgaGFybmVzcyBhcyB0aGVyZSBpcyBubyBvdGhlclxuICAgIC8vIHdheSBmb3IgdGhlIGhhcm5lc3MgdG8gZGV0ZWN0IGlmIG1vdXNlIGNvb3JkaW5hdGVzIG5lZWQgdG8gYmUgaW52ZXJ0ZWQuXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWludmVydC1tb3VzZS1jb29yZHNdJzogJ19zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItc2xpZGluZ10nOiAnX2lzU2xpZGluZycsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXRodW1iLWxhYmVsLXNob3dpbmddJzogJ3RodW1iTGFiZWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci12ZXJ0aWNhbF0nOiAndmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1taW4tdmFsdWVdJzogJ19pc01pblZhbHVlJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGlkZS1sYXN0LXRpY2tdJzogJ2Rpc2FibGVkIHx8IF9pc01pblZhbHVlICYmIF90aHVtYkdhcCAmJiBfaW52ZXJ0QXhpcycsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnY29sb3InLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlciBleHRlbmRzIF9NYXRTbGlkZXJNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIENhbkNvbG9yLCBPbkluaXQsIEhhc1RhYkluZGV4IHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGludmVydCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2ludmVydDsgfVxuICBzZXQgaW52ZXJ0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faW52ZXJ0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9pbnZlcnQgPSBmYWxzZTtcblxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9tYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9tYXgpO1xuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9tYXg6IG51bWJlciA9IDEwMDtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9taW47IH1cbiAgc2V0IG1pbih2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW4gPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9taW4pO1xuXG4gICAgLy8gSWYgdGhlIHZhbHVlIHdhc24ndCBleHBsaWNpdGx5IHNldCBieSB0aGUgdXNlciwgc2V0IGl0IHRvIHRoZSBtaW4uXG4gICAgaWYgKHRoaXMuX3ZhbHVlID09PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fbWluO1xuICAgIH1cbiAgICB0aGlzLl9wZXJjZW50ID0gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZSh0aGlzLl92YWx1ZSk7XG5cbiAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGUgdmFsdWVzIGF0IHdoaWNoIHRoZSB0aHVtYiB3aWxsIHNuYXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGVwKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9zdGVwOyB9XG4gIHNldCBzdGVwKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3N0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9zdGVwKTtcblxuICAgIGlmICh0aGlzLl9zdGVwICUgMSAhPT0gMCkge1xuICAgICAgdGhpcy5fcm91bmRUb0RlY2ltYWwgPSB0aGlzLl9zdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKS5wb3AoKSEubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoaXMgY291bGQgbW9kaWZ5IHRoZSBsYWJlbCwgd2UgbmVlZCB0byBub3RpZnkgdGhlIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RlcDogbnVtYmVyID0gMTtcblxuICAvKiogV2hldGhlciBvciBub3QgdG8gc2hvdyB0aGUgdGh1bWIgbGFiZWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aHVtYkxhYmVsKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdGh1bWJMYWJlbDsgfVxuICBzZXQgdGh1bWJMYWJlbCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl90aHVtYkxhYmVsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF90aHVtYkxhYmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBzaG93IHRpY2tzLiBSZWxhdGl2ZSB0byB0aGUgc3RlcCBzbyB0aGF0IGEgdGljayBhbHdheXMgYXBwZWFycyBvbiBhIHN0ZXAuXG4gICAqIEV4OiBUaWNrIGludGVydmFsIG9mIDQgd2l0aCBhIHN0ZXAgb2YgMyB3aWxsIGRyYXcgYSB0aWNrIGV2ZXJ5IDQgc3RlcHMgKGV2ZXJ5IDEyIHZhbHVlcykuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdGlja0ludGVydmFsKCkgeyByZXR1cm4gdGhpcy5fdGlja0ludGVydmFsOyB9XG4gIHNldCB0aWNrSW50ZXJ2YWwodmFsdWU6ICdhdXRvJyB8IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAnYXV0byc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlLCB0aGlzLl90aWNrSW50ZXJ2YWwgYXMgbnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gMDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsOiAnYXV0bycgfCBudW1iZXIgPSAwO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgLy8gSWYgdGhlIHZhbHVlIG5lZWRzIHRvIGJlIHJlYWQgYW5kIGl0IGlzIHN0aWxsIHVuaW5pdGlhbGl6ZWQsIGluaXRpYWxpemUgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodjogbnVtYmVyIHwgbnVsbCkge1xuICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgbGV0IHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodik7XG5cbiAgICAgIC8vIFdoaWxlIGluY3JlbWVudGluZyBieSBhIGRlY2ltYWwgd2UgY2FuIGVuZCB1cCB3aXRoIHZhbHVlcyBsaWtlIDMzLjMwMDAwMDAwMDAwMDAwNC5cbiAgICAgIC8vIFRydW5jYXRlIGl0IHRvIGVuc3VyZSB0aGF0IGl0IG1hdGNoZXMgdGhlIGxhYmVsIGFuZCB0byBtYWtlIGl0IGVhc2llciB0byB3b3JrIHdpdGguXG4gICAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gZm9ybWF0IHRoZSB2YWx1ZSBiZWZvcmUgaXQgaXMgZGlzcGxheWVkXG4gICAqIGluIHRoZSB0aHVtYiBsYWJlbC4gQ2FuIGJlIHVzZWQgdG8gZm9ybWF0IHZlcnkgbGFyZ2UgbnVtYmVyIGluIG9yZGVyXG4gICAqIGZvciB0aGVtIHRvIGZpdCBpbnRvIHRoZSBzbGlkZXIgdGh1bWIuXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIHZlcnRpY2FsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92ZXJ0aWNhbDsgfVxuICBzZXQgdmVydGljYWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdmVydGljYWwgPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdmFsdWUgaGFzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHRodW1iIG1vdmVzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2xpZGVyIGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlciB8IG51bGw+KCk7XG5cbiAgLyoqIFRoZSB2YWx1ZSB0byBiZSB1c2VkIGZvciBkaXNwbGF5IHB1cnBvc2VzLiAqL1xuICBnZXQgZGlzcGxheVZhbHVlKCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgaWYgKHRoaXMuZGlzcGxheVdpdGgpIHtcbiAgICAgIC8vIFZhbHVlIGlzIG5ldmVyIG51bGwgYnV0IHNpbmNlIHNldHRlcnMgYW5kIGdldHRlcnMgY2Fubm90IGhhdmVcbiAgICAgIC8vIGRpZmZlcmVudCB0eXBlcywgdGhlIHZhbHVlIGdldHRlciBpcyBhbHNvIHR5cGVkIHRvIHJldHVybiBudWxsLlxuICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheVdpdGgodGhpcy52YWx1ZSEpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGNvdWxkIGJlIGltcHJvdmVkIGZ1cnRoZXIgYnkgcm91bmRpbmcgc29tZXRoaW5nIGxpa2UgMC45OTkgdG8gMSBvclxuICAgIC8vIDAuODk5IHRvIDAuOSwgaG93ZXZlciBpdCBpcyB2ZXJ5IHBlcmZvcm1hbmNlIHNlbnNpdGl2ZSwgYmVjYXVzZSBpdCBnZXRzIGNhbGxlZCBvblxuICAgIC8vIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuXG4gICAgaWYgKHRoaXMuX3JvdW5kVG9EZWNpbWFsICYmIHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZSAlIDEgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnZhbHVlIHx8IDA7XG4gIH1cblxuICAvKiogc2V0IGZvY3VzIHRvIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQob3B0aW9ucyk7XG4gIH1cblxuICAvKiogYmx1ciB0aGUgaG9zdCBlbGVtZW50ICovXG4gIGJsdXIoKSB7XG4gICAgdGhpcy5fYmx1ckhvc3RFbGVtZW50KCk7XG4gIH1cblxuICAvKiogb25Ub3VjaCBmdW5jdGlvbiByZWdpc3RlcmVkIHZpYSByZWdpc3Rlck9uVG91Y2ggKENvbnRyb2xWYWx1ZUFjY2Vzc29yKS4gKi9cbiAgb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGNvaW5jaWRlcyB3aXRoIHRoZSB2YWx1ZS4gKi9cbiAgZ2V0IHBlcmNlbnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2NsYW1wKHRoaXMuX3BlcmNlbnQpOyB9XG4gIHByaXZhdGUgX3BlcmNlbnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSB0aHVtYiBpcyBzbGlkaW5nLlxuICAgKiBVc2VkIHRvIGRldGVybWluZSBpZiB0aGVyZSBzaG91bGQgYmUgYSB0cmFuc2l0aW9uIGZvciB0aGUgdGh1bWIgYW5kIGZpbGwgdHJhY2suXG4gICAqL1xuICBfaXNTbGlkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBzbGlkZXIgaXMgYWN0aXZlIChjbGlja2VkIG9yIHNsaWRpbmcpLlxuICAgKiBVc2VkIHRvIHNocmluayBhbmQgZ3JvdyB0aGUgdGh1bWIgYXMgYWNjb3JkaW5nIHRvIHRoZSBNYXRlcmlhbCBEZXNpZ24gc3BlYy5cbiAgICovXG4gIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBheGlzIG9mIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQuXG4gICAqIChpLmUuIHdoZXRoZXIgbW92aW5nIHRoZSB0aHVtYiBpbiB0aGUgcG9zaXRpdmUgeCBvciB5IGRpcmVjdGlvbiBkZWNyZWFzZXMgdGhlIHNsaWRlcidzIHZhbHVlKS5cbiAgICovXG4gIGdldCBfaW52ZXJ0QXhpcygpIHtcbiAgICAvLyBTdGFuZGFyZCBub24taW52ZXJ0ZWQgbW9kZSBmb3IgYSB2ZXJ0aWNhbCBzbGlkZXIgc2hvdWxkIGJlIGRyYWdnaW5nIHRoZSB0aHVtYiBmcm9tIGJvdHRvbSB0b1xuICAgIC8vIHRvcC4gSG93ZXZlciBmcm9tIGEgeS1heGlzIHN0YW5kcG9pbnQgdGhpcyBpcyBpbnZlcnRlZC5cbiAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbCA/ICF0aGlzLmludmVydCA6IHRoaXMuaW52ZXJ0O1xuICB9XG5cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuICBnZXQgX2lzTWluVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGVyY2VudCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHNwYWNlIHRvIGxlYXZlIGJldHdlZW4gdGhlIHNsaWRlciB0aHVtYiBhbmQgdGhlIHRyYWNrIGZpbGwgJiB0cmFjayBiYWNrZ3JvdW5kXG4gICAqIGVsZW1lbnRzLlxuICAgKi9cbiAgZ2V0IF90aHVtYkdhcCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIERJU0FCTEVEX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUgJiYgIXRoaXMudGh1bWJMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlID8gTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgOiBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGJhY2tncm91bmQgZWxlbWVudC4gKi9cbiAgZ2V0IF90cmFja0JhY2tncm91bmRTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnZlcnRpY2FsID8gYDEsICR7MSAtIHRoaXMucGVyY2VudH0sIDFgIDogYCR7MSAtIHRoaXMucGVyY2VudH0sIDEsIDFgO1xuICAgIGNvbnN0IHNpZ24gPSB0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpID8gJy0nIDogJyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gc2NhbGUzZCBhdm9pZHMgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIENocm9tZS4gU2VlICMxMjA3MS5cbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGhpcy5fdGh1bWJHYXB9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGZpbGwgZWxlbWVudC4gKi9cbiAgZ2V0IF90cmFja0ZpbGxTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgcGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHtwZXJjZW50fSwgMWAgOiBgJHtwZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnJyA6ICctJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgLFxuICAgICAgLy8gaU9TIFNhZmFyaSBoYXMgYSBidWcgd2hlcmUgaXQgd29uJ3QgcmUtcmVuZGVyIGVsZW1lbnRzIHdoaWNoIHN0YXJ0IG9mIGFzIGBzY2FsZSgwKWAgdW50aWxcbiAgICAgIC8vIHNvbWV0aGluZyBmb3JjZXMgYSBzdHlsZSByZWNhbGN1bGF0aW9uIG9uIGl0LiBTaW5jZSB3ZSdsbCBlbmQgdXAgd2l0aCBgc2NhbGUoMClgIHdoZW5cbiAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIGlzIDAsIHdlIGNhbiBlYXNpbHkgZ2V0IGludG8gdGhpcyBzaXR1YXRpb24uIFdlIGZvcmNlIGFcbiAgICAgIC8vIHJlY2FsY3VsYXRpb24gYnkgY2hhbmdpbmcgdGhlIGVsZW1lbnQncyBgZGlzcGxheWAgd2hlbiBpdCBnb2VzIGZyb20gMCB0byBhbnkgb3RoZXIgdmFsdWUuXG4gICAgICBkaXNwbGF5OiBwZXJjZW50ID09PSAwID8gJ25vbmUnIDogJydcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0aWNrcyBjb250YWluZXIgZWxlbWVudC4gKi9cbiAgZ2V0IF90aWNrc0NvbnRhaW5lclN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRm9yIGEgaG9yaXpvbnRhbCBzbGlkZXIgaW4gUlRMIGxhbmd1YWdlcyB3ZSBwdXNoIHRoZSB0aWNrcyBjb250YWluZXIgb2ZmIHRoZSBsZWZ0IGVkZ2VcbiAgICAvLyBpbnN0ZWFkIG9mIHRoZSByaWdodCBlZGdlIHRvIGF2b2lkIGNhdXNpbmcgYSBob3Jpem9udGFsIHNjcm9sbGJhciB0byBhcHBlYXIuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcnIDogJy0nO1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50IC8gMiAqIDEwMDtcbiAgICByZXR1cm4ge1xuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke29mZnNldH0lKWBcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0aWNrcyBlbGVtZW50LiAqL1xuICBnZXQgX3RpY2tzU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCB0aWNrU2l6ZSA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgKiAxMDA7XG4gICAgbGV0IGJhY2tncm91bmRTaXplID0gdGhpcy52ZXJ0aWNhbCA/IGAycHggJHt0aWNrU2l6ZX0lYCA6IGAke3RpY2tTaXplfSUgMnB4YDtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRGVwZW5kaW5nIG9uIHRoZSBkaXJlY3Rpb24gd2UgcHVzaGVkIHRoZSB0aWNrcyBjb250YWluZXIsIHB1c2ggdGhlIHRpY2tzIHRoZSBvcHBvc2l0ZVxuICAgIC8vIGRpcmVjdGlvbiB0byByZS1jZW50ZXIgdGhlbSBidXQgY2xpcCBvZmYgdGhlIGVuZCBlZGdlLiBJbiBSVEwgbGFuZ3VhZ2VzIHdlIG5lZWQgdG8gZmxpcCB0aGVcbiAgICAvLyB0aWNrcyAxODAgZGVncmVlcyBzbyB3ZSdyZSByZWFsbHkgY3V0dGluZyBvZmYgdGhlIGVuZCBlZGdlIGFiZCBub3QgdGhlIHN0YXJ0LlxuICAgIGxldCBzaWduID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnLScgOiAnJztcbiAgICBsZXQgcm90YXRlID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnIHJvdGF0ZSgxODBkZWcpJyA6ICcnO1xuICAgIGxldCBzdHlsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnYmFja2dyb3VuZFNpemUnOiBiYWNrZ3JvdW5kU2l6ZSxcbiAgICAgIC8vIFdpdGhvdXQgdHJhbnNsYXRlWiB0aWNrcyBzb21ldGltZXMgaml0dGVyIGFzIHRoZSBzbGlkZXIgbW92ZXMgb24gQ2hyb21lICYgRmlyZWZveC5cbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlWigwKSB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RpY2tTaXplIC8gMn0lKSR7cm90YXRlfWBcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUgJiYgdGhpcy5fdGh1bWJHYXApIHtcbiAgICAgIGxldCBzaWRlOiBzdHJpbmc7XG5cbiAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgIHNpZGUgPSB0aGlzLl9pbnZlcnRBeGlzID8gJ0JvdHRvbScgOiAnVG9wJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNpZGUgPSB0aGlzLl9pbnZlcnRBeGlzID8gJ1JpZ2h0JyA6ICdMZWZ0JztcbiAgICAgIH1cblxuICAgICAgc3R5bGVzW2BwYWRkaW5nJHtzaWRlfWBdID0gYCR7dGhpcy5fdGh1bWJHYXB9cHhgO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICBnZXQgX3RodW1iQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRodW1iIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgaW52ZXJ0T2Zmc2V0ID1cbiAgICAgICAgKHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnICYmICF0aGlzLnZlcnRpY2FsKSA/ICF0aGlzLl9pbnZlcnRBeGlzIDogdGhpcy5faW52ZXJ0QXhpcztcbiAgICBsZXQgb2Zmc2V0ID0gKGludmVydE9mZnNldCA/IHRoaXMucGVyY2VudCA6IDEgLSB0aGlzLnBlcmNlbnQpICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oLSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogVGhlIHNpemUgb2YgYSB0aWNrIGludGVydmFsIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgc2l6ZSBvZiB0aGUgdHJhY2suICovXG4gIHByaXZhdGUgX3RpY2tJbnRlcnZhbFBlcmNlbnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3NsaWRlckRpbWVuc2lvbnM6IENsaWVudFJlY3QgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBEZWNpbWFsIHBsYWNlcyB0byByb3VuZCB0bywgYmFzZWQgb24gdGhlIHN0ZXAgYW1vdW50LiAqL1xuICBwcml2YXRlIF9yb3VuZFRvRGVjaW1hbDogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIERpcmVjdGlvbmFsaXR5IGNoYW5nZSBFdmVudEVtaXR0ZXIuICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgd2hlbiB0aGUgc2xpZGUgc3RhcnQgZXZlbnQgZmlyZXMuICovXG4gIHByaXZhdGUgX3ZhbHVlT25TbGlkZVN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgcG9pbnRlciB3aGVuIHRoZSBkcmFnZ2luZyBzdGFydGVkLiAqL1xuICBwcml2YXRlIF9wb2ludGVyUG9zaXRpb25PblN0YXJ0OiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbm5lciBzbGlkZXIgd3JhcHBlciBlbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCdzbGlkZXJXcmFwcGVyJykgcHJpdmF0ZSBfc2xpZGVyV3JhcHBlcjogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogV2hldGhlciBtb3VzZSBldmVudHMgc2hvdWxkIGJlIGNvbnZlcnRlZCB0byBhIHNsaWRlciBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGVpciBkaXN0YW5jZVxuICAgKiBmcm9tIHRoZSByaWdodCBvciBib3R0b20gZWRnZSBvZiB0aGUgc2xpZGVyIGFzIG9wcG9zZWQgdG8gdGhlIHRvcCBvciBsZWZ0LlxuICAgKi9cbiAgX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkge1xuICAgIHJldHVybiAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXRoaXMuX2ludmVydEF4aXMgOiB0aGlzLl9pbnZlcnRBeGlzO1xuICB9XG5cbiAgLyoqIFRoZSBsYW5ndWFnZSBkaXJlY3Rpb24gZm9yIHRoaXMgc2xpZGVyIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2dldERpcmVjdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT0gJ3J0bCcpID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgbGFzdCBwb2ludGVyIGV2ZW50IHRoYXQgd2FzIGNhcHR1cmVkIGJ5IHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX2xhc3RQb2ludGVyRXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50IHwgbnVsbDtcblxuICAvKiogVXNlZCB0byBzdWJzY3JpYmUgdG8gZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudD86IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgX2FuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfbmdab25lYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lPzogTmdab25lLFxuICAgICAgICAgICAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgbWFrZSBkb2N1bWVudCByZXF1aXJlZCAqL1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcblxuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcblxuICAgIHRoaXMuX3J1bk91dHNpemVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3JcbiAgICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgICAgLnN1YnNjcmliZSgob3JpZ2luOiBGb2N1c09yaWdpbikgPT4ge1xuICAgICAgICAgIHRoaXMuX2lzQWN0aXZlID0gISFvcmlnaW4gJiYgb3JpZ2luICE9PSAna2V5Ym9hcmQnO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgaWYgKHRoaXMuX2Rpcikge1xuICAgICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBfb25Nb3VzZWVudGVyKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfRE9XTjpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIC8vIE5PVEU6IEZvciBhIHNpZ2h0ZWQgdXNlciBpdCB3b3VsZCBtYWtlIG1vcmUgc2Vuc2UgdGhhdCB3aGVuIHRoZXkgcHJlc3MgYW4gYXJyb3cga2V5IG9uIGFuXG4gICAgICAgIC8vIGludmVydGVkIHNsaWRlciB0aGUgdGh1bWIgbW92ZXMgaW4gdGhhdCBkaXJlY3Rpb24uIEhvd2V2ZXIgZm9yIGEgYmxpbmQgdXNlciwgbm90aGluZ1xuICAgICAgICAvLyBhYm91dCB0aGUgc2xpZGVyIGluZGljYXRlcyB0aGF0IGl0IGlzIGludmVydGVkLiBUaGV5IHdpbGwgZXhwZWN0IGxlZnQgdG8gYmUgZGVjcmVtZW50LFxuICAgICAgICAvLyByZWdhcmRsZXNzIG9mIGhvdyBpdCBhcHBlYXJzIG9uIHRoZSBzY3JlZW4uIEZvciBzcGVha2VycyBvZlJUTCBsYW5ndWFnZXMsIHRoZXkgcHJvYmFibHlcbiAgICAgICAgLy8gZXhwZWN0IGxlZnQgdG8gbWVhbiBpbmNyZW1lbnQuIFRoZXJlZm9yZSB3ZSBmbGlwIHRoZSBtZWFuaW5nIG9mIHRoZSBzaWRlIGFycm93IGtleXMgZm9yXG4gICAgICAgIC8vIFJUTC4gRm9yIGludmVydGVkIHNsaWRlcnMgd2UgcHJlZmVyIGEgZ29vZCBhMTF5IGV4cGVyaWVuY2UgdG8gaGF2aW5nIGl0IFwibG9vayByaWdodFwiIGZvclxuICAgICAgICAvLyBzaWdodGVkIHVzZXJzLCB0aGVyZWZvcmUgd2UgZG8gbm90IHN3YXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/IDEgOiAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIC8vIFNlZSBjb21tZW50IG9uIExFRlRfQVJST1cgYWJvdXQgdGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggd2UgZmxpcCB0aGUgbWVhbmluZy5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50KHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gLTEgOiAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gUmV0dXJuIGlmIHRoZSBrZXkgaXMgbm90IG9uZSB0aGF0IHdlIGV4cGxpY2l0bHkgaGFuZGxlIHRvIGF2b2lkIGNhbGxpbmcgcHJldmVudERlZmF1bHQgb25cbiAgICAgICAgLy8gaXQuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU2xpZGluZyA9IHRydWU7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIF9vbktleXVwKCkge1xuICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBwdXQgdGhlaXIgcG9pbnRlciBkb3duIG9uIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3BvaW50ZXJEb3duID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQgb3IgdGhlXG4gICAgLy8gdXNlciBpcyB1c2luZyBhbnl0aGluZyBvdGhlciB0aGFuIHRoZSBtYWluIG1vdXNlIGJ1dHRvbi5cbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLl9pc1NsaWRpbmcgfHwgKCFpc1RvdWNoRXZlbnQoZXZlbnQpICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ydW5JbnNpZGVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCk7XG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IGV2ZW50O1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQoKTtcbiAgICAgIHRoaXMuX29uTW91c2VlbnRlcigpOyAvLyBTaW11bGF0ZSBtb3VzZWVudGVyIGluIGNhc2UgdGhpcyBpcyBhIG1vYmlsZSBkZXZpY2UuXG4gICAgICB0aGlzLl9iaW5kR2xvYmFsRXZlbnRzKGV2ZW50KTtcbiAgICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvaW50ZXJQb3NpdGlvbik7XG4gICAgICB0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCA9IHRoaXMudmFsdWU7XG4gICAgICB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0ID0gcG9pbnRlclBvc2l0aW9uO1xuXG4gICAgICAvLyBFbWl0IGEgY2hhbmdlIGFuZCBpbnB1dCBldmVudCBpZiB0aGUgdmFsdWUgY2hhbmdlZC5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBtb3ZlZCB0aGVpciBwb2ludGVyIGFmdGVyXG4gICAqIHN0YXJ0aW5nIHRvIGRyYWcuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC5cbiAgICovXG4gIHByaXZhdGUgX3BvaW50ZXJNb3ZlID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIC8vIFByZXZlbnQgdGhlIHNsaWRlIGZyb20gc2VsZWN0aW5nIGFueXRoaW5nIGVsc2UuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24oZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KSk7XG5cbiAgICAgIC8vIE5hdGl2ZSByYW5nZSBlbGVtZW50cyBhbHdheXMgZW1pdCBgaW5wdXRgIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VkIHdoaWxlIHNsaWRpbmcuXG4gICAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbGlmdGVkIHRoZWlyIHBvaW50ZXIuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQgPSB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0O1xuICAgICAgY29uc3QgY3VycmVudFBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCk7XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICAgIHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ID0gdGhpcy5fcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCAhPSB0aGlzLnZhbHVlICYmICF0aGlzLmRpc2FibGVkICYmXG4gICAgICAgICAgcG9pbnRlclBvc2l0aW9uT25TdGFydCAmJiAocG9pbnRlclBvc2l0aW9uT25TdGFydC54ICE9PSBjdXJyZW50UG9pbnRlclBvc2l0aW9uLnggfHxcbiAgICAgICAgICBwb2ludGVyUG9zaXRpb25PblN0YXJ0LnkgIT09IGN1cnJlbnRQb2ludGVyUG9zaXRpb24ueSkpIHtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB3aW5kb3cgaGFzIGxvc3QgZm9jdXMuICovXG4gIHByaXZhdGUgX3dpbmRvd0JsdXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHdpbmRvdyBpcyBibHVycmVkIHdoaWxlIGRyYWdnaW5nIHdlIG5lZWQgdG8gc3RvcCBkcmFnZ2luZyBiZWNhdXNlIHRoZVxuICAgIC8vIGJyb3dzZXIgd29uJ3QgZGlzcGF0Y2ggdGhlIGBtb3VzZXVwYCBhbmQgYHRvdWNoZW5kYCBldmVudHMgYW55bW9yZS5cbiAgICBpZiAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCkge1xuICAgICAgdGhpcy5fcG9pbnRlclVwKHRoaXMuX2xhc3RQb2ludGVyRXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBvdXIgZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMuIFRoZXkncmUgYm91bmQgYXQgdGhlIGRvY3VtZW50IGxldmVsIGFuZCBvbmx5IHdoaWxlXG4gICAqIGRyYWdnaW5nIHNvIHRoYXQgdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIGtlZXAgdGhlaXIgcG9pbnRlciBleGFjdGx5IG92ZXIgdGhlIHNsaWRlclxuICAgKiBhcyB0aGV5J3JlIHN3aXBpbmcgYWNyb3NzIHRoZSBzY3JlZW4uXG4gICAqL1xuICBwcml2YXRlIF9iaW5kR2xvYmFsRXZlbnRzKHRyaWdnZXJFdmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2RvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLl9kb2N1bWVudCkge1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG4gICAgICBjb25zdCBpc1RvdWNoID0gaXNUb3VjaEV2ZW50KHRyaWdnZXJFdmVudCk7XG4gICAgICBjb25zdCBtb3ZlRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZSc7XG4gICAgICBjb25zdCBlbmRFdmVudE5hbWUgPSBpc1RvdWNoID8gJ3RvdWNoZW5kJyA6ICdtb3VzZXVwJztcbiAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnROYW1lLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcblxuICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbnkgZ2xvYmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlIG1heSBoYXZlIGFkZGVkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVHbG9iYWxFdmVudHMoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9kb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW5jcmVtZW50cyB0aGUgc2xpZGVyIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2Ygc3RlcHMgKG5lZ2F0aXZlIG51bWJlciBkZWNyZW1lbnRzKS4gKi9cbiAgcHJpdmF0ZSBfaW5jcmVtZW50KG51bVN0ZXBzOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5fY2xhbXAoKHRoaXMudmFsdWUgfHwgMCkgKyB0aGlzLnN0ZXAgKiBudW1TdGVwcywgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGUgdGhlIG5ldyB2YWx1ZSBmcm9tIHRoZSBuZXcgcGh5c2ljYWwgbG9jYXRpb24uIFRoZSB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBzbmFwcGVkLiAqL1xuICBwcml2YXRlIF91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihwb3M6IHt4OiBudW1iZXIsIHk6IG51bWJlcn0pIHtcbiAgICBpZiAoIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMudG9wIDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5sZWZ0O1xuICAgIGxldCBzaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICBsZXQgcG9zQ29tcG9uZW50ID0gdGhpcy52ZXJ0aWNhbCA/IHBvcy55IDogcG9zLng7XG5cbiAgICAvLyBUaGUgZXhhY3QgdmFsdWUgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBldmVudCBhbmQgdXNlZCB0byBmaW5kIHRoZSBjbG9zZXN0IHNuYXAgdmFsdWUuXG4gICAgbGV0IHBlcmNlbnQgPSB0aGlzLl9jbGFtcCgocG9zQ29tcG9uZW50IC0gb2Zmc2V0KSAvIHNpemUpO1xuXG4gICAgaWYgKHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkpIHtcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGUgc3RlcHMgbWF5IG5vdCBkaXZpZGUgY2xlYW5seSBpbnRvIHRoZSBtYXggdmFsdWUsIGlmIHRoZSB1c2VyXG4gICAgLy8gc2xpZCB0byAwIG9yIDEwMCBwZXJjZW50LCB3ZSBqdW1wIHRvIHRoZSBtaW4vbWF4IHZhbHVlLiBUaGlzIGFwcHJvYWNoXG4gICAgLy8gaXMgc2xpZ2h0bHkgbW9yZSBpbnR1aXRpdmUgdGhhbiB1c2luZyBgTWF0aC5jZWlsYCBiZWxvdywgYmVjYXVzZSBpdFxuICAgIC8vIGZvbGxvd3MgdGhlIHVzZXIncyBwb2ludGVyIGNsb3Nlci5cbiAgICBpZiAocGVyY2VudCA9PT0gMCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluO1xuICAgIH0gZWxzZSBpZiAocGVyY2VudCA9PT0gMSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGFjdFZhbHVlID0gdGhpcy5fY2FsY3VsYXRlVmFsdWUocGVyY2VudCk7XG5cbiAgICAgIC8vIFRoaXMgY2FsY3VsYXRpb24gZmluZHMgdGhlIGNsb3Nlc3Qgc3RlcCBieSBmaW5kaW5nIHRoZSBjbG9zZXN0XG4gICAgICAvLyB3aG9sZSBudW1iZXIgZGl2aXNpYmxlIGJ5IHRoZSBzdGVwIHJlbGF0aXZlIHRvIHRoZSBtaW4uXG4gICAgICBjb25zdCBjbG9zZXN0VmFsdWUgPSBNYXRoLnJvdW5kKChleGFjdFZhbHVlIC0gdGhpcy5taW4pIC8gdGhpcy5zdGVwKSAqIHRoaXMuc3RlcCArIHRoaXMubWluO1xuXG4gICAgICAvLyBUaGUgdmFsdWUgbmVlZHMgdG8gc25hcCB0byB0aGUgbWluIGFuZCBtYXguXG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fY2xhbXAoY2xvc2VzdFZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBhIGNoYW5nZSBldmVudCBpZiB0aGUgY3VycmVudCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbih0aGlzLnZhbHVlKTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudCgpKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBhbiBpbnB1dCBldmVudCB3aGVuIHRoZSBjdXJyZW50IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRJbnB1dEV2ZW50KCkge1xuICAgIHRoaXMuaW5wdXQuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudCgpKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBhbW91bnQgb2Ygc3BhY2UgYmV0d2VlbiB0aWNrcyBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHdpZHRoIG9mIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnRpY2tJbnRlcnZhbCB8fCAhdGhpcy5fc2xpZGVyRGltZW5zaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRpY2tJbnRlcnZhbCA9PSAnYXV0bycpIHtcbiAgICAgIGxldCB0cmFja1NpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgICAgbGV0IHBpeGVsc1BlclN0ZXAgPSB0cmFja1NpemUgKiB0aGlzLnN0ZXAgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgICBsZXQgc3RlcHNQZXJUaWNrID0gTWF0aC5jZWlsKE1JTl9BVVRPX1RJQ0tfU0VQQVJBVElPTiAvIHBpeGVsc1BlclN0ZXApO1xuICAgICAgbGV0IHBpeGVsc1BlclRpY2sgPSBzdGVwc1BlclRpY2sgKiB0aGlzLnN0ZXA7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gcGl4ZWxzUGVyVGljayAvIHRyYWNrU2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCA9IHRoaXMudGlja0ludGVydmFsICogdGhpcy5zdGVwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgc2xpZGVyIGNoYW5nZSBvYmplY3QgZnJvbSB0aGUgc3BlY2lmaWVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9jcmVhdGVDaGFuZ2VFdmVudCh2YWx1ZSA9IHRoaXMudmFsdWUpOiBNYXRTbGlkZXJDaGFuZ2Uge1xuICAgIGxldCBldmVudCA9IG5ldyBNYXRTbGlkZXJDaGFuZ2UoKTtcblxuICAgIGV2ZW50LnNvdXJjZSA9IHRoaXM7XG4gICAgZXZlbnQudmFsdWUgPSB2YWx1ZTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgdGhhdCBhIHZhbHVlIGlzLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVQZXJjZW50YWdlKHZhbHVlOiBudW1iZXIgfCBudWxsKSB7XG4gICAgcmV0dXJuICgodmFsdWUgfHwgMCkgLSB0aGlzLm1pbikgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgdmFsdWUgYSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgY29ycmVzcG9uZHMgdG8uICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnRhZ2U6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLm1pbiArIHBlcmNlbnRhZ2UgKiAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gIH1cblxuICAvKiogUmV0dXJuIGEgbnVtYmVyIGJldHdlZW4gdHdvIG51bWJlcnMuICovXG4gIHByaXZhdGUgX2NsYW1wKHZhbHVlOiBudW1iZXIsIG1pbiA9IDAsIG1heCA9IDEpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbih2YWx1ZSwgbWF4KSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBib3VuZGluZyBjbGllbnQgcmVjdCBvZiB0aGUgc2xpZGVyIHRyYWNrIGVsZW1lbnQuXG4gICAqIFRoZSB0cmFjayBpcyB1c2VkIHJhdGhlciB0aGFuIHRoZSBuYXRpdmUgZWxlbWVudCB0byBpZ25vcmUgdGhlIGV4dHJhIHNwYWNlIHRoYXQgdGhlIHRodW1iIGNhblxuICAgKiB0YWtlIHVwLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0U2xpZGVyRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2xpZGVyV3JhcHBlciA/IHRoaXMuX3NsaWRlcldyYXBwZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgbmF0aXZlIGVsZW1lbnQuXG4gICAqIEN1cnJlbnRseSBvbmx5IHVzZWQgdG8gYWxsb3cgYSBibHVyIGV2ZW50IHRvIGZpcmUgYnV0IHdpbGwgYmUgdXNlZCB3aXRoIGtleWJvYXJkIGlucHV0IGxhdGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNIb3N0RWxlbWVudChvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBuYXRpdmUgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfYmx1ckhvc3RFbGVtZW50KCkge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gIH1cblxuICAvKiogUnVucyBhIGNhbGxiYWNrIGluc2lkZSBvZiB0aGUgTmdab25lLCBpZiBwb3NzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfcnVuSW5zaWRlWm9uZShmbjogKCkgPT4gYW55KSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBSZW1vdmUgdGhpcyBmdW5jdGlvbiBvbmNlIGBfbmdab25lYCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICB0aGlzLl9uZ1pvbmUgPyB0aGlzLl9uZ1pvbmUucnVuKGZuKSA6IGZuKCk7XG4gIH1cblxuICAvKiogUnVucyBhIGNhbGxiYWNrIG91dHNpZGUgb2YgdGhlIE5nWm9uZSwgaWYgcG9zc2libGUuICovXG4gIHByaXZhdGUgX3J1bk91dHNpemVab25lKGZuOiAoKSA9PiBhbnkpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIFJlbW92ZSB0aGlzIGZ1bmN0aW9uIG9uY2UgYF9uZ1pvbmVgIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgIHRoaXMuX25nWm9uZSA/IHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihmbikgOiBmbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1vZGVsIHZhbHVlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgaGFzIGNoYW5nZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyB0b3VjaGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWRcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2ludmVydDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbWF4OiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21pbjogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zdGVwOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RodW1iTGFiZWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RpY2tJbnRlcnZhbDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92YWx1ZTogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92ZXJ0aWNhbDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqIFJldHVybnMgd2hldGhlciBhbiBldmVudCBpcyBhIHRvdWNoIGV2ZW50LiAqL1xuZnVuY3Rpb24gaXNUb3VjaEV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IGV2ZW50IGlzIFRvdWNoRXZlbnQge1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBmb3IgZXZlcnkgcGl4ZWwgdGhhdCB0aGUgdXNlciBoYXMgZHJhZ2dlZCBzbyB3ZSBuZWVkIGl0IHRvIGJlXG4gIC8vIGFzIGZhc3QgYXMgcG9zc2libGUuIFNpbmNlIHdlIG9ubHkgYmluZCBtb3VzZSBldmVudHMgYW5kIHRvdWNoIGV2ZW50cywgd2UgY2FuIGFzc3VtZVxuICAvLyB0aGF0IGlmIHRoZSBldmVudCdzIG5hbWUgc3RhcnRzIHdpdGggYHRgLCBpdCdzIGEgdG91Y2ggZXZlbnQuXG4gIHJldHVybiBldmVudC50eXBlWzBdID09PSAndCc7XG59XG5cbi8qKiBHZXRzIHRoZSBjb29yZGluYXRlcyBvZiBhIHRvdWNoIG9yIG1vdXNlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC4gKi9cbmZ1bmN0aW9uIGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgLy8gYHRvdWNoZXNgIHdpbGwgYmUgZW1wdHkgZm9yIHN0YXJ0L2VuZCBldmVudHMgc28gd2UgaGF2ZSB0byBmYWxsIGJhY2sgdG8gYGNoYW5nZWRUb3VjaGVzYC5cbiAgY29uc3QgcG9pbnQgPSBpc1RvdWNoRXZlbnQoZXZlbnQpID8gKGV2ZW50LnRvdWNoZXNbMF0gfHwgZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pIDogZXZlbnQ7XG4gIHJldHVybiB7eDogcG9pbnQuY2xpZW50WCwgeTogcG9pbnQuY2xpZW50WX07XG59XG4iXX0=