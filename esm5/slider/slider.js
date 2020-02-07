/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
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
var activeEventOptions = normalizePassiveListenerOptions({ passive: false });
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
var MIN_AUTO_TICK_SEPARATION = 30;
/** The thumb gap size for a disabled slider. */
var DISABLED_THUMB_GAP = 7;
/** The thumb gap size for a non-active slider at its minimum value. */
var MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/** The thumb gap size for an active slider at its minimum value. */
var MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/**
 * Provider Expression that allows mat-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 * @docs-private
 */
export var MAT_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MatSlider; }),
    multi: true
};
/** A simple change event emitted by the MatSlider component. */
var MatSliderChange = /** @class */ (function () {
    function MatSliderChange() {
    }
    return MatSliderChange;
}());
export { MatSliderChange };
// Boilerplate for applying mixins to MatSlider.
/** @docs-private */
var MatSliderBase = /** @class */ (function () {
    function MatSliderBase(_elementRef) {
        this._elementRef = _elementRef;
    }
    return MatSliderBase;
}());
var _MatSliderMixinBase = mixinTabIndex(mixinColor(mixinDisabled(MatSliderBase), 'accent'));
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
var MatSlider = /** @class */ (function (_super) {
    __extends(MatSlider, _super);
    function MatSlider(elementRef, _focusMonitor, _changeDetectorRef, _dir, tabIndex, 
    // @breaking-change 8.0.0 `_animationMode` parameter to be made required.
    _animationMode, 
    // @breaking-change 9.0.0-sha-59fce287a `_ngZone` parameter to be made required.
    _ngZone, 
    /** @breaking-change 11.0.0 make document required */
    document) {
        var _this = _super.call(this, elementRef) || this;
        _this._focusMonitor = _focusMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        _this._animationMode = _animationMode;
        _this._ngZone = _ngZone;
        _this._invert = false;
        _this._max = 100;
        _this._min = 0;
        _this._step = 1;
        _this._thumbLabel = false;
        _this._tickInterval = 0;
        _this._value = null;
        _this._vertical = false;
        /** Event emitted when the slider value has changed. */
        _this.change = new EventEmitter();
        /** Event emitted when the slider thumb moves. */
        _this.input = new EventEmitter();
        /**
         * Emits when the raw value of the slider changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * @docs-private
         */
        _this.valueChange = new EventEmitter();
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        _this.onTouched = function () { };
        _this._percent = 0;
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        _this._isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        _this._isActive = false;
        /** The size of a tick interval as a percentage of the size of the track. */
        _this._tickIntervalPercent = 0;
        /** The dimensions of the slider. */
        _this._sliderDimensions = null;
        _this._controlValueAccessorChangeFn = function () { };
        /** Subscription to the Directionality change EventEmitter. */
        _this._dirChangeSubscription = Subscription.EMPTY;
        /** Called when the user has put their pointer down on the slider. */
        _this._pointerDown = function (event) {
            // Don't do anything if the slider is disabled or the
            // user is using anything other than the main mouse button.
            if (_this.disabled || _this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
                return;
            }
            _this._runInsideZone(function () {
                var oldValue = _this.value;
                var pointerPosition = getPointerPositionOnPage(event);
                _this._isSliding = true;
                _this._lastPointerEvent = event;
                event.preventDefault();
                _this._focusHostElement();
                _this._onMouseenter(); // Simulate mouseenter in case this is a mobile device.
                _this._bindGlobalEvents(event);
                _this._focusHostElement();
                _this._updateValueFromPosition(pointerPosition);
                _this._valueOnSlideStart = _this.value;
                _this._pointerPositionOnStart = pointerPosition;
                // Emit a change and input event if the value changed.
                if (oldValue != _this.value) {
                    _this._emitInputEvent();
                    _this._emitChangeEvent();
                }
            });
        };
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        _this._pointerMove = function (event) {
            if (_this._isSliding) {
                // Prevent the slide from selecting anything else.
                event.preventDefault();
                var oldValue = _this.value;
                _this._lastPointerEvent = event;
                _this._updateValueFromPosition(getPointerPositionOnPage(event));
                // Native range elements always emit `input` events when the value changed while sliding.
                if (oldValue != _this.value) {
                    _this._emitInputEvent();
                }
            }
        };
        /** Called when the user has lifted their pointer. Bound on the document level. */
        _this._pointerUp = function (event) {
            if (_this._isSliding) {
                var pointerPositionOnStart = _this._pointerPositionOnStart;
                var currentPointerPosition = getPointerPositionOnPage(event);
                event.preventDefault();
                _this._removeGlobalEvents();
                _this._valueOnSlideStart = _this._pointerPositionOnStart = _this._lastPointerEvent = null;
                _this._isSliding = false;
                if (_this._valueOnSlideStart != _this.value && !_this.disabled &&
                    pointerPositionOnStart && (pointerPositionOnStart.x !== currentPointerPosition.x ||
                    pointerPositionOnStart.y !== currentPointerPosition.y)) {
                    _this._emitChangeEvent();
                }
            }
        };
        /** Called when the window has lost focus. */
        _this._windowBlur = function () {
            // If the window is blurred while dragging we need to stop dragging because the
            // browser won't dispatch the `mouseup` and `touchend` events anymore.
            if (_this._lastPointerEvent) {
                _this._pointerUp(_this._lastPointerEvent);
            }
        };
        _this._document = document;
        _this.tabIndex = parseInt(tabIndex) || 0;
        _this._runOutsizeZone(function () {
            var element = elementRef.nativeElement;
            element.addEventListener('mousedown', _this._pointerDown, activeEventOptions);
            element.addEventListener('touchstart', _this._pointerDown, activeEventOptions);
        });
        return _this;
    }
    Object.defineProperty(MatSlider.prototype, "invert", {
        /** Whether the slider is inverted. */
        get: function () { return this._invert; },
        set: function (value) {
            this._invert = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "max", {
        /** The maximum value that the slider can have. */
        get: function () { return this._max; },
        set: function (v) {
            this._max = coerceNumberProperty(v, this._max);
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "min", {
        /** The minimum value that the slider can have. */
        get: function () { return this._min; },
        set: function (v) {
            this._min = coerceNumberProperty(v, this._min);
            // If the value wasn't explicitly set by the user, set it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "step", {
        /** The values at which the thumb will snap. */
        get: function () { return this._step; },
        set: function (v) {
            this._step = coerceNumberProperty(v, this._step);
            if (this._step % 1 !== 0) {
                this._roundToDecimal = this._step.toString().split('.').pop().length;
            }
            // Since this could modify the label, we need to notify the change detection.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "thumbLabel", {
        /** Whether or not to show the thumb label. */
        get: function () { return this._thumbLabel; },
        set: function (value) { this._thumbLabel = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "tickInterval", {
        /**
         * How often to show ticks. Relative to the step so that a tick always appears on a step.
         * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
         */
        get: function () { return this._tickInterval; },
        set: function (value) {
            if (value === 'auto') {
                this._tickInterval = 'auto';
            }
            else if (typeof value === 'number' || typeof value === 'string') {
                this._tickInterval = coerceNumberProperty(value, this._tickInterval);
            }
            else {
                this._tickInterval = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "value", {
        /** Value of the slider. */
        get: function () {
            // If the value needs to be read and it is still uninitialized, initialize it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            return this._value;
        },
        set: function (v) {
            if (v !== this._value) {
                var value = coerceNumberProperty(v);
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "vertical", {
        /** Whether the slider is vertical. */
        get: function () { return this._vertical; },
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "displayValue", {
        /** The value to be used for display purposes. */
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    /** set focus to the host element */
    MatSlider.prototype.focus = function (options) {
        this._focusHostElement(options);
    };
    /** blur the host element */
    MatSlider.prototype.blur = function () {
        this._blurHostElement();
    };
    Object.defineProperty(MatSlider.prototype, "percent", {
        /** The percentage of the slider that coincides with the value. */
        get: function () { return this._clamp(this._percent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_invertAxis", {
        /**
         * Whether the axis of the slider is inverted.
         * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
         */
        get: function () {
            // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
            // top. However from a y-axis standpoint this is inverted.
            return this.vertical ? !this.invert : this.invert;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_isMinValue", {
        /** Whether the slider is at its minimum value. */
        get: function () {
            return this.percent === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_thumbGap", {
        /**
         * The amount of space to leave between the slider thumb and the track fill & track background
         * elements.
         */
        get: function () {
            if (this.disabled) {
                return DISABLED_THUMB_GAP;
            }
            if (this._isMinValue && !this.thumbLabel) {
                return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_trackBackgroundStyles", {
        /** CSS styles for the track background element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            var scale = this.vertical ? "1, " + (1 - this.percent) + ", 1" : 1 - this.percent + ", 1, 1";
            var sign = this._shouldInvertMouseCoords() ? '-' : '';
            return {
                // scale3d avoids some rendering issues in Chrome. See #12071.
                transform: "translate" + axis + "(" + sign + this._thumbGap + "px) scale3d(" + scale + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_trackFillStyles", {
        /** CSS styles for the track fill element. */
        get: function () {
            var percent = this.percent;
            var axis = this.vertical ? 'Y' : 'X';
            var scale = this.vertical ? "1, " + percent + ", 1" : percent + ", 1, 1";
            var sign = this._shouldInvertMouseCoords() ? '' : '-';
            return {
                // scale3d avoids some rendering issues in Chrome. See #12071.
                transform: "translate" + axis + "(" + sign + this._thumbGap + "px) scale3d(" + scale + ")",
                // iOS Safari has a bug where it won't re-render elements which start of as `scale(0)` until
                // something forces a style recalculation on it. Since we'll end up with `scale(0)` when
                // the value of the slider is 0, we can easily get into this situation. We force a
                // recalculation by changing the element's `display` when it goes from 0 to any other value.
                display: percent === 0 ? 'none' : ''
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_ticksContainerStyles", {
        /** CSS styles for the ticks container element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the ticks container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var sign = !this.vertical && this._getDirection() == 'rtl' ? '' : '-';
            var offset = this._tickIntervalPercent / 2 * 100;
            return {
                'transform': "translate" + axis + "(" + sign + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_ticksStyles", {
        /** CSS styles for the ticks element. */
        get: function () {
            var tickSize = this._tickIntervalPercent * 100;
            var backgroundSize = this.vertical ? "2px " + tickSize + "%" : tickSize + "% 2px";
            var axis = this.vertical ? 'Y' : 'X';
            // Depending on the direction we pushed the ticks container, push the ticks the opposite
            // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
            // ticks 180 degrees so we're really cutting off the end edge abd not the start.
            var sign = !this.vertical && this._getDirection() == 'rtl' ? '-' : '';
            var rotate = !this.vertical && this._getDirection() == 'rtl' ? ' rotate(180deg)' : '';
            var styles = {
                'backgroundSize': backgroundSize,
                // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
                'transform': "translateZ(0) translate" + axis + "(" + sign + tickSize / 2 + "%)" + rotate
            };
            if (this._isMinValue && this._thumbGap) {
                var side = void 0;
                if (this.vertical) {
                    side = this._invertAxis ? 'Bottom' : 'Top';
                }
                else {
                    side = this._invertAxis ? 'Right' : 'Left';
                }
                styles["padding" + side] = this._thumbGap + "px";
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlider.prototype, "_thumbContainerStyles", {
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the thumb container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var invertOffset = (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
            var offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
            return {
                'transform': "translate" + axis + "(-" + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    MatSlider.prototype._shouldInvertMouseCoords = function () {
        return (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
    };
    /** The language direction for this slider element. */
    MatSlider.prototype._getDirection = function () {
        return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
    };
    MatSlider.prototype.ngOnInit = function () {
        var _this = this;
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe(function (origin) {
            _this._isActive = !!origin && origin !== 'keyboard';
            _this._changeDetectorRef.detectChanges();
        });
        if (this._dir) {
            this._dirChangeSubscription = this._dir.change.subscribe(function () {
                _this._changeDetectorRef.markForCheck();
            });
        }
    };
    MatSlider.prototype.ngOnDestroy = function () {
        var element = this._elementRef.nativeElement;
        element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
        element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
        this._lastPointerEvent = null;
        this._removeGlobalEvents();
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._dirChangeSubscription.unsubscribe();
    };
    MatSlider.prototype._onMouseenter = function () {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    MatSlider.prototype._onFocus = function () {
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    MatSlider.prototype._onBlur = function () {
        this.onTouched();
    };
    MatSlider.prototype._onKeydown = function (event) {
        if (this.disabled || hasModifierKey(event)) {
            return;
        }
        var oldValue = this.value;
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
    };
    MatSlider.prototype._onKeyup = function () {
        this._isSliding = false;
    };
    /**
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     */
    MatSlider.prototype._bindGlobalEvents = function (triggerEvent) {
        if (typeof this._document !== 'undefined' && this._document) {
            var body = this._document.body;
            var isTouch = isTouchEvent(triggerEvent);
            var moveEventName = isTouch ? 'touchmove' : 'mousemove';
            var endEventName = isTouch ? 'touchend' : 'mouseup';
            body.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
            body.addEventListener(endEventName, this._pointerUp, activeEventOptions);
            if (isTouch) {
                body.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
            }
        }
        if (typeof window !== 'undefined' && window) {
            window.addEventListener('blur', this._windowBlur);
        }
    };
    /** Removes any global event listeners that we may have added. */
    MatSlider.prototype._removeGlobalEvents = function () {
        if (typeof this._document !== 'undefined' && this._document) {
            var body = this._document.body;
            body.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
            body.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
            body.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
            body.removeEventListener('touchend', this._pointerUp, activeEventOptions);
            body.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);
        }
        if (typeof window !== 'undefined' && window) {
            window.removeEventListener('blur', this._windowBlur);
        }
    };
    /** Increments the slider by the given number of steps (negative number decrements). */
    MatSlider.prototype._increment = function (numSteps) {
        this.value = this._clamp((this.value || 0) + this.step * numSteps, this.min, this.max);
    };
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    MatSlider.prototype._updateValueFromPosition = function (pos) {
        if (!this._sliderDimensions) {
            return;
        }
        var offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        var size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        var posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        var percent = this._clamp((posComponent - offset) / size);
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
            var exactValue = this._calculateValue(percent);
            // This calculation finds the closest step by finding the closest
            // whole number divisible by the step relative to the min.
            var closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
            // The value needs to snap to the min and max.
            this.value = this._clamp(closestValue, this.min, this.max);
        }
    };
    /** Emits a change event if the current value is different from the last emitted value. */
    MatSlider.prototype._emitChangeEvent = function () {
        this._controlValueAccessorChangeFn(this.value);
        this.valueChange.emit(this.value);
        this.change.emit(this._createChangeEvent());
    };
    /** Emits an input event when the current value is different from the last emitted value. */
    MatSlider.prototype._emitInputEvent = function () {
        this.input.emit(this._createChangeEvent());
    };
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    MatSlider.prototype._updateTickIntervalPercent = function () {
        if (!this.tickInterval || !this._sliderDimensions) {
            return;
        }
        if (this.tickInterval == 'auto') {
            var trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            var pixelsPerStep = trackSize * this.step / (this.max - this.min);
            var stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            var pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = this.tickInterval * this.step / (this.max - this.min);
        }
    };
    /** Creates a slider change object from the specified value. */
    MatSlider.prototype._createChangeEvent = function (value) {
        if (value === void 0) { value = this.value; }
        var event = new MatSliderChange();
        event.source = this;
        event.value = value;
        return event;
    };
    /** Calculates the percentage of the slider that a value is. */
    MatSlider.prototype._calculatePercentage = function (value) {
        return ((value || 0) - this.min) / (this.max - this.min);
    };
    /** Calculates the value a percentage of the slider corresponds to. */
    MatSlider.prototype._calculateValue = function (percentage) {
        return this.min + percentage * (this.max - this.min);
    };
    /** Return a number between two numbers. */
    MatSlider.prototype._clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    MatSlider.prototype._getSliderDimensions = function () {
        return this._sliderWrapper ? this._sliderWrapper.nativeElement.getBoundingClientRect() : null;
    };
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    MatSlider.prototype._focusHostElement = function (options) {
        this._elementRef.nativeElement.focus(options);
    };
    /** Blurs the native element. */
    MatSlider.prototype._blurHostElement = function () {
        this._elementRef.nativeElement.blur();
    };
    /** Runs a callback inside of the NgZone, if possible. */
    MatSlider.prototype._runInsideZone = function (fn) {
        // @breaking-change 9.0.0-sha-59fce287a Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.run(fn) : fn();
    };
    /** Runs a callback outside of the NgZone, if possible. */
    MatSlider.prototype._runOutsizeZone = function (fn) {
        // @breaking-change 9.0.0-sha-59fce287a Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.runOutsideAngular(fn) : fn();
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    MatSlider.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    MatSlider.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    MatSlider.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    MatSlider.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
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
    MatSlider.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FocusMonitor },
        { type: ChangeDetectorRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
    ]; };
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
    return MatSlider;
}(_MatSliderMixinBase));
export { MatSlider };
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
    var point = isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    return { x: point.clientX, y: point.clientY };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsRUFFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsVUFBVSxFQUNWLEdBQUcsRUFDSCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsRUFDUixjQUFjLEdBQ2YsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQU9MLFVBQVUsRUFDVixhQUFhLEVBQ2IsYUFBYSxHQUNkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFbEMsSUFB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LEFBN3hCRCxDQTBDK0IsbUJBQW1CLEdBbXZCakQ7U0FudkJZLFNBQVM7QUFxdkJ0QixpREFBaUQ7QUFDakQsU0FBUyxZQUFZLENBQUMsS0FBOEI7SUFDbEQsd0ZBQXdGO0lBQ3hGLHVGQUF1RjtJQUN2RixnRUFBZ0U7SUFDaEUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUMvQixDQUFDO0FBRUQsK0VBQStFO0FBQy9FLFNBQVMsd0JBQXdCLENBQUMsS0FBOEI7SUFDOUQsNEZBQTRGO0lBQzVGLElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFGLE9BQU8sRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge25vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG5jb25zdCBhY3RpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiBmYWxzZX0pO1xuXG4vKipcbiAqIFZpc3VhbGx5LCBhIDMwcHggc2VwYXJhdGlvbiBiZXR3ZWVuIHRpY2sgbWFya3MgbG9va3MgYmVzdC4gVGhpcyBpcyB2ZXJ5IHN1YmplY3RpdmUgYnV0IGl0IGlzXG4gKiB0aGUgZGVmYXVsdCBzZXBhcmF0aW9uIHdlIGNob3NlLlxuICovXG5jb25zdCBNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gPSAzMDtcblxuLyoqIFRoZSB0aHVtYiBnYXAgc2l6ZSBmb3IgYSBkaXNhYmxlZCBzbGlkZXIuICovXG5jb25zdCBESVNBQkxFRF9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIG5vbi1hY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX05PTkFDVElWRV9USFVNQl9HQVAgPSA3O1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhbiBhY3RpdmUgc2xpZGVyIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuY29uc3QgTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgPSAxMDtcblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1zbGlkZXIgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIFtmb3JtQ29udHJvbF0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIGJ5IHRoZSBNYXRTbGlkZXIgY29tcG9uZW50LiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckNoYW5nZSB7XG4gIC8qKiBUaGUgTWF0U2xpZGVyIHRoYXQgY2hhbmdlZC4gKi9cbiAgc291cmNlOiBNYXRTbGlkZXI7XG5cbiAgLyoqIFRoZSBuZXcgdmFsdWUgb2YgdGhlIHNvdXJjZSBzbGlkZXIuICovXG4gIHZhbHVlOiBudW1iZXIgfCBudWxsO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTbGlkZXJCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuY29uc3QgX01hdFNsaWRlck1peGluQmFzZTpcbiAgICBIYXNUYWJJbmRleEN0b3IgJlxuICAgIENhbkNvbG9yQ3RvciAmXG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIHR5cGVvZiBNYXRTbGlkZXJCYXNlID1cbiAgICAgICAgbWl4aW5UYWJJbmRleChtaXhpbkNvbG9yKG1peGluRGlzYWJsZWQoTWF0U2xpZGVyQmFzZSksICdhY2NlbnQnKSk7XG5cbi8qKlxuICogQWxsb3dzIHVzZXJzIHRvIHNlbGVjdCBmcm9tIGEgcmFuZ2Ugb2YgdmFsdWVzIGJ5IG1vdmluZyB0aGUgc2xpZGVyIHRodW1iLiBJdCBpcyBzaW1pbGFyIGluXG4gKiBiZWhhdmlvciB0byB0aGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1cInJhbmdlXCI+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGVyJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXInLFxuICBwcm92aWRlcnM6IFtNQVRfU0xJREVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgaG9zdDoge1xuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXl1cCknOiAnX29uS2V5dXAoKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfb25Nb3VzZWVudGVyKCknLFxuXG4gICAgLy8gT24gU2FmYXJpIHN0YXJ0aW5nIHRvIHNsaWRlIHRlbXBvcmFyaWx5IHRyaWdnZXJzIHRleHQgc2VsZWN0aW9uIG1vZGUgd2hpY2hcbiAgICAvLyBzaG93IHRoZSB3cm9uZyBjdXJzb3IuIFdlIHByZXZlbnQgaXQgYnkgc3RvcHBpbmcgdGhlIGBzZWxlY3RzdGFydGAgZXZlbnQuXG4gICAgJyhzZWxlY3RzdGFydCknOiAnJGV2ZW50LnByZXZlbnREZWZhdWx0KCknLFxuICAgICdjbGFzcyc6ICdtYXQtc2xpZGVyJyxcbiAgICAncm9sZSc6ICdzbGlkZXInLFxuICAgICdbdGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtaW4nLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICd2YWx1ZScsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oYXMtdGlja3NdJzogJ3RpY2tJbnRlcnZhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWF4aXMtaW52ZXJ0ZWRdJzogJ19pbnZlcnRBeGlzJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbW91c2UgY29vcmRpbmF0ZXMgbmVlZCB0byBiZSBpbnZlcnRlZC5cbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaW52ZXJ0LW1vdXNlLWNvb3Jkc10nOiAnX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCknLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1zbGlkaW5nXSc6ICdfaXNTbGlkaW5nJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZ10nOiAndGh1bWJMYWJlbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLW1pbi12YWx1ZV0nOiAnX2lzTWluVmFsdWUnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1oaWRlLWxhc3QtdGlja10nOiAnZGlzYWJsZWQgfHwgX2lzTWluVmFsdWUgJiYgX3RodW1iR2FwICYmIF9pbnZlcnRBeGlzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXIuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyIGV4dGVuZHMgX01hdFNsaWRlck1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSwgQ2FuQ29sb3IsIE9uSW5pdCwgSGFzVGFiSW5kZXgge1xuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGludmVydGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaW52ZXJ0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW52ZXJ0OyB9XG4gIHNldCBpbnZlcnQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbnZlcnQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ludmVydCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHY6IG51bWJlcikge1xuICAgIHRoaXMuX21pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21pbik7XG5cbiAgICAvLyBJZiB0aGUgdmFsdWUgd2Fzbid0IGV4cGxpY2l0bHkgc2V0IGJ5IHRoZSB1c2VyLCBzZXQgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9taW46IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3N0ZXA7IH1cbiAgc2V0IHN0ZXAodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fc3RlcCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX3N0ZXApO1xuXG4gICAgaWYgKHRoaXMuX3N0ZXAgJSAxICE9PSAwKSB7XG4gICAgICB0aGlzLl9yb3VuZFRvRGVjaW1hbCA9IHRoaXMuX3N0ZXAudG9TdHJpbmcoKS5zcGxpdCgnLicpLnBvcCgpIS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhpcyBjb3VsZCBtb2RpZnkgdGhlIGxhYmVsLCB3ZSBuZWVkIHRvIG5vdGlmeSB0aGUgY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9zdGVwOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSB0aHVtYiBsYWJlbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRodW1iTGFiZWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl90aHVtYkxhYmVsOyB9XG4gIHNldCB0aHVtYkxhYmVsKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3RodW1iTGFiZWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3RodW1iTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIHNob3cgdGlja3MuIFJlbGF0aXZlIHRvIHRoZSBzdGVwIHNvIHRoYXQgYSB0aWNrIGFsd2F5cyBhcHBlYXJzIG9uIGEgc3RlcC5cbiAgICogRXg6IFRpY2sgaW50ZXJ2YWwgb2YgNCB3aXRoIGEgc3RlcCBvZiAzIHdpbGwgZHJhdyBhIHRpY2sgZXZlcnkgNCBzdGVwcyAoZXZlcnkgMTIgdmFsdWVzKS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aWNrSW50ZXJ2YWwoKSB7IHJldHVybiB0aGlzLl90aWNrSW50ZXJ2YWw7IH1cbiAgc2V0IHRpY2tJbnRlcnZhbCh2YWx1ZTogJ2F1dG8nIHwgbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlID09PSAnYXV0bycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9ICdhdXRvJztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIHRoaXMuX3RpY2tJbnRlcnZhbCBhcyBudW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAwO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF90aWNrSW50ZXJ2YWw6ICdhdXRvJyB8IG51bWJlciA9IDA7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVhZCBhbmQgaXQgaXMgc3RpbGwgdW5pbml0aWFsaXplZCwgaW5pdGlhbGl6ZSBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgaWYgKHYgIT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICBsZXQgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2KTtcblxuICAgICAgLy8gV2hpbGUgaW5jcmVtZW50aW5nIGJ5IGEgZGVjaW1hbCB3ZSBjYW4gZW5kIHVwIHdpdGggdmFsdWVzIGxpa2UgMzMuMzAwMDAwMDAwMDAwMDA0LlxuICAgICAgLy8gVHJ1bmNhdGUgaXQgdG8gZW5zdXJlIHRoYXQgaXQgbWF0Y2hlcyB0aGUgbGFiZWwgYW5kIHRvIG1ha2UgaXQgZWFzaWVyIHRvIHdvcmsgd2l0aC5cbiAgICAgIGlmICh0aGlzLl9yb3VuZFRvRGVjaW1hbCkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsOyB9XG4gIHNldCB2ZXJ0aWNhbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3ZlcnRpY2FsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF92ZXJ0aWNhbCA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdGh1bWIgbW92ZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBpbnB1dDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlckNoYW5nZT4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgcmF3IHZhbHVlIG9mIHRoZSBzbGlkZXIgY2hhbmdlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseVxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0d28td2F5IGJpbmRpbmcgZm9yIHRoZSBgdmFsdWVgIGlucHV0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4oKTtcblxuICAvKiogVGhlIHZhbHVlIHRvIGJlIHVzZWQgZm9yIGRpc3BsYXkgcHVycG9zZXMuICovXG4gIGdldCBkaXNwbGF5VmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5V2l0aCkge1xuICAgICAgLy8gVmFsdWUgaXMgbmV2ZXIgbnVsbCBidXQgc2luY2Ugc2V0dGVycyBhbmQgZ2V0dGVycyBjYW5ub3QgaGF2ZVxuICAgICAgLy8gZGlmZmVyZW50IHR5cGVzLCB0aGUgdmFsdWUgZ2V0dGVyIGlzIGFsc28gdHlwZWQgdG8gcmV0dXJuIG51bGwuXG4gICAgICByZXR1cm4gdGhpcy5kaXNwbGF5V2l0aCh0aGlzLnZhbHVlISk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgY291bGQgYmUgaW1wcm92ZWQgZnVydGhlciBieSByb3VuZGluZyBzb21ldGhpbmcgbGlrZSAwLjk5OSB0byAxIG9yXG4gICAgLy8gMC44OTkgdG8gMC45LCBob3dldmVyIGl0IGlzIHZlcnkgcGVyZm9ybWFuY2Ugc2Vuc2l0aXZlLCBiZWNhdXNlIGl0IGdldHMgY2FsbGVkIG9uXG4gICAgLy8gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICUgMSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudmFsdWUgfHwgMDtcbiAgfVxuXG4gIC8qKiBzZXQgZm9jdXMgdG8gdGhlIGhvc3QgZWxlbWVudCAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBibHVyIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgYmx1cigpIHtcbiAgICB0aGlzLl9ibHVySG9zdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBvblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY2xhbXAodGhpcy5fcGVyY2VudCk7IH1cbiAgcHJpdmF0ZSBfcGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHRodW1iIGlzIHNsaWRpbmcuXG4gICAqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZXJlIHNob3VsZCBiZSBhIHRyYW5zaXRpb24gZm9yIHRoZSB0aHVtYiBhbmQgZmlsbCB0cmFjay5cbiAgICovXG4gIF9pc1NsaWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHNsaWRlciBpcyBhY3RpdmUgKGNsaWNrZWQgb3Igc2xpZGluZykuXG4gICAqIFVzZWQgdG8gc2hyaW5rIGFuZCBncm93IHRoZSB0aHVtYiBhcyBhY2NvcmRpbmcgdG8gdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjLlxuICAgKi9cbiAgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF4aXMgb2YgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC5cbiAgICogKGkuZS4gd2hldGhlciBtb3ZpbmcgdGhlIHRodW1iIGluIHRoZSBwb3NpdGl2ZSB4IG9yIHkgZGlyZWN0aW9uIGRlY3JlYXNlcyB0aGUgc2xpZGVyJ3MgdmFsdWUpLlxuICAgKi9cbiAgZ2V0IF9pbnZlcnRBeGlzKCkge1xuICAgIC8vIFN0YW5kYXJkIG5vbi1pbnZlcnRlZCBtb2RlIGZvciBhIHZlcnRpY2FsIHNsaWRlciBzaG91bGQgYmUgZHJhZ2dpbmcgdGhlIHRodW1iIGZyb20gYm90dG9tIHRvXG4gICAgLy8gdG9wLiBIb3dldmVyIGZyb20gYSB5LWF4aXMgc3RhbmRwb2ludCB0aGlzIGlzIGludmVydGVkLlxuICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gIXRoaXMuaW52ZXJ0IDogdGhpcy5pbnZlcnQ7XG4gIH1cblxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG4gIGdldCBfaXNNaW5WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wZXJjZW50ID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gbGVhdmUgYmV0d2VlbiB0aGUgc2xpZGVyIHRodW1iIGFuZCB0aGUgdHJhY2sgZmlsbCAmIHRyYWNrIGJhY2tncm91bmRcbiAgICogZWxlbWVudHMuXG4gICAqL1xuICBnZXQgX3RodW1iR2FwKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gRElTQUJMRURfVEhVTUJfR0FQO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiAhdGhpcy50aHVtYkxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNBY3RpdmUgPyBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA6IE1JTl9WQUxVRV9OT05BQ1RJVkVfVEhVTUJfR0FQO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgYmFja2dyb3VuZCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrQmFja2dyb3VuZFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHsxIC0gdGhpcy5wZXJjZW50fSwgMWAgOiBgJHsxIC0gdGhpcy5wZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnLScgOiAnJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBDU1Mgc3R5bGVzIGZvciB0aGUgdHJhY2sgZmlsbCBlbGVtZW50LiAqL1xuICBnZXQgX3RyYWNrRmlsbFN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAke3BlcmNlbnR9LCAxYCA6IGAke3BlcmNlbnR9LCAxLCAxYDtcbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICcnIDogJy0nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX3RodW1iR2FwfXB4KSBzY2FsZTNkKCR7c2NhbGV9KWAsXG4gICAgICAvLyBpT1MgU2FmYXJpIGhhcyBhIGJ1ZyB3aGVyZSBpdCB3b24ndCByZS1yZW5kZXIgZWxlbWVudHMgd2hpY2ggc3RhcnQgb2YgYXMgYHNjYWxlKDApYCB1bnRpbFxuICAgICAgLy8gc29tZXRoaW5nIGZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb24gaXQuIFNpbmNlIHdlJ2xsIGVuZCB1cCB3aXRoIGBzY2FsZSgwKWAgd2hlblxuICAgICAgLy8gdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgaXMgMCwgd2UgY2FuIGVhc2lseSBnZXQgaW50byB0aGlzIHNpdHVhdGlvbi4gV2UgZm9yY2UgYVxuICAgICAgLy8gcmVjYWxjdWxhdGlvbiBieSBjaGFuZ2luZyB0aGUgZWxlbWVudCdzIGBkaXNwbGF5YCB3aGVuIGl0IGdvZXMgZnJvbSAwIHRvIGFueSBvdGhlciB2YWx1ZS5cbiAgICAgIGRpc3BsYXk6IHBlcmNlbnQgPT09IDAgPyAnbm9uZScgOiAnJ1xuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGNvbnRhaW5lciBlbGVtZW50LiAqL1xuICBnZXQgX3RpY2tzQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRpY2tzIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgc2lnbiA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gJycgOiAnLSc7XG4gICAgbGV0IG9mZnNldCA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgLyAyICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGVsZW1lbnQuICovXG4gIGdldCBfdGlja3NTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IHRpY2tTaXplID0gdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCAqIDEwMDtcbiAgICBsZXQgYmFja2dyb3VuZFNpemUgPSB0aGlzLnZlcnRpY2FsID8gYDJweCAke3RpY2tTaXplfSVgIDogYCR7dGlja1NpemV9JSAycHhgO1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiB3ZSBwdXNoZWQgdGhlIHRpY2tzIGNvbnRhaW5lciwgcHVzaCB0aGUgdGlja3MgdGhlIG9wcG9zaXRlXG4gICAgLy8gZGlyZWN0aW9uIHRvIHJlLWNlbnRlciB0aGVtIGJ1dCBjbGlwIG9mZiB0aGUgZW5kIGVkZ2UuIEluIFJUTCBsYW5ndWFnZXMgd2UgbmVlZCB0byBmbGlwIHRoZVxuICAgIC8vIHRpY2tzIDE4MCBkZWdyZWVzIHNvIHdlJ3JlIHJlYWxseSBjdXR0aW5nIG9mZiB0aGUgZW5kIGVkZ2UgYWJkIG5vdCB0aGUgc3RhcnQuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICctJyA6ICcnO1xuICAgIGxldCByb3RhdGUgPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcgcm90YXRlKDE4MGRlZyknIDogJyc7XG4gICAgbGV0IHN0eWxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IGJhY2tncm91bmRTaXplLFxuICAgICAgLy8gV2l0aG91dCB0cmFuc2xhdGVaIHRpY2tzIHNvbWV0aW1lcyBqaXR0ZXIgYXMgdGhlIHNsaWRlciBtb3ZlcyBvbiBDaHJvbWUgJiBGaXJlZm94LlxuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5faXNNaW5WYWx1ZSAmJiB0aGlzLl90aHVtYkdhcCkge1xuICAgICAgbGV0IHNpZGU6IHN0cmluZztcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgc2lkZSA9IHRoaXMuX2ludmVydEF4aXMgPyAnQm90dG9tJyA6ICdUb3AnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2lkZSA9IHRoaXMuX2ludmVydEF4aXMgPyAnUmlnaHQnIDogJ0xlZnQnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXNbYHBhZGRpbmcke3NpZGV9YF0gPSBgJHt0aGlzLl90aHVtYkdhcH1weGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuXG4gIGdldCBfdGh1bWJDb250YWluZXJTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgbGV0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGh1bWIgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGxldCBpbnZlcnRPZmZzZXQgPVxuICAgICAgICAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXRoaXMuX2ludmVydEF4aXMgOiB0aGlzLl9pbnZlcnRBeGlzO1xuICAgIGxldCBvZmZzZXQgPSAoaW52ZXJ0T2Zmc2V0ID8gdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudCkgKiAxMDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlJHtheGlzfSgtJHtvZmZzZXR9JSlgXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBUaGUgc2l6ZSBvZiBhIHRpY2sgaW50ZXJ2YWwgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBzaXplIG9mIHRoZSB0cmFjay4gKi9cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsUGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVyRGltZW5zaW9uczogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIERlY2ltYWwgcGxhY2VzIHRvIHJvdW5kIHRvLCBiYXNlZCBvbiB0aGUgc3RlcCBhbW91bnQuICovXG4gIHByaXZhdGUgX3JvdW5kVG9EZWNpbWFsOiBudW1iZXI7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0aGUgRGlyZWN0aW9uYWxpdHkgY2hhbmdlIEV2ZW50RW1pdHRlci4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIHNsaWRlciB3aGVuIHRoZSBzbGlkZSBzdGFydCBldmVudCBmaXJlcy4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPblNsaWRlU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIHdoZW4gdGhlIGRyYWdnaW5nIHN0YXJ0ZWQuICovXG4gIHByaXZhdGUgX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQ6IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIHNsaWRlciB3cmFwcGVyIGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcldyYXBwZXInKSBwcml2YXRlIF9zbGlkZXJXcmFwcGVyOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG1vdXNlIGV2ZW50cyBzaG91bGQgYmUgY29udmVydGVkIHRvIGEgc2xpZGVyIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZWlyIGRpc3RhbmNlXG4gICAqIGZyb20gdGhlIHJpZ2h0IG9yIGJvdHRvbSBlZGdlIG9mIHRoZSBzbGlkZXIgYXMgb3Bwb3NlZCB0byB0aGUgdG9wIG9yIGxlZnQuXG4gICAqL1xuICBfc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCkgPyAhdGhpcy5faW52ZXJ0QXhpcyA6IHRoaXMuX2ludmVydEF4aXM7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PSAncnRsJykgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBsYXN0IHBvaW50ZXIgZXZlbnQgdGhhdCB3YXMgY2FwdHVyZWQgYnkgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfbGFzdFBvaW50ZXJFdmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQgfCBudWxsO1xuXG4gIC8qKiBVc2VkIHRvIHN1YnNjcmliZSB0byBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cyAqL1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50PzogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYF9uZ1pvbmVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU/OiBOZ1pvbmUsXG4gICAgICAgICAgICAgIC8qKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBtYWtlIGRvY3VtZW50IHJlcXVpcmVkICovXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuXG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgdGhpcy5fcnVuT3V0c2l6ZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvclxuICAgICAgICAubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKVxuICAgICAgICAuc3Vic2NyaWJlKChvcmlnaW46IEZvY3VzT3JpZ2luKSA9PiB7XG4gICAgICAgICAgdGhpcy5faXNBY3RpdmUgPSAhIW9yaWdpbiAmJiBvcmlnaW4gIT09ICdrZXlib2FyZCc7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9KTtcbiAgICBpZiAodGhpcy5fZGlyKSB7XG4gICAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLl9kaXIuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIF9vbk1vdXNlZW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkZvY3VzKCkge1xuICAgIC8vIFdlIHNhdmUgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlciBoZXJlIHNvIHdlIGNhbiB1c2UgdGhlbSB0byB1cGRhdGUgdGhlIHNwYWNpbmcgb2YgdGhlXG4gICAgLy8gdGlja3MgYW5kIGRldGVybWluZSB3aGVyZSBvbiB0aGUgc2xpZGVyIGNsaWNrIGFuZCBzbGlkZSBldmVudHMgaGFwcGVuLlxuICAgIHRoaXMuX3NsaWRlckRpbWVuc2lvbnMgPSB0aGlzLl9nZXRTbGlkZXJEaW1lbnNpb25zKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpO1xuICB9XG5cbiAgX29uQmx1cigpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IGhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoLTEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgLy8gTk9URTogRm9yIGEgc2lnaHRlZCB1c2VyIGl0IHdvdWxkIG1ha2UgbW9yZSBzZW5zZSB0aGF0IHdoZW4gdGhleSBwcmVzcyBhbiBhcnJvdyBrZXkgb24gYW5cbiAgICAgICAgLy8gaW52ZXJ0ZWQgc2xpZGVyIHRoZSB0aHVtYiBtb3ZlcyBpbiB0aGF0IGRpcmVjdGlvbi4gSG93ZXZlciBmb3IgYSBibGluZCB1c2VyLCBub3RoaW5nXG4gICAgICAgIC8vIGFib3V0IHRoZSBzbGlkZXIgaW5kaWNhdGVzIHRoYXQgaXQgaXMgaW52ZXJ0ZWQuIFRoZXkgd2lsbCBleHBlY3QgbGVmdCB0byBiZSBkZWNyZW1lbnQsXG4gICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2YgaG93IGl0IGFwcGVhcnMgb24gdGhlIHNjcmVlbi4gRm9yIHNwZWFrZXJzIG9mUlRMIGxhbmd1YWdlcywgdGhleSBwcm9iYWJseVxuICAgICAgICAvLyBleHBlY3QgbGVmdCB0byBtZWFuIGluY3JlbWVudC4gVGhlcmVmb3JlIHdlIGZsaXAgdGhlIG1lYW5pbmcgb2YgdGhlIHNpZGUgYXJyb3cga2V5cyBmb3JcbiAgICAgICAgLy8gUlRMLiBGb3IgaW52ZXJ0ZWQgc2xpZGVycyB3ZSBwcmVmZXIgYSBnb29kIGExMXkgZXhwZXJpZW5jZSB0byBoYXZpbmcgaXQgXCJsb29rIHJpZ2h0XCIgZm9yXG4gICAgICAgIC8vIHNpZ2h0ZWQgdXNlcnMsIHRoZXJlZm9yZSB3ZSBkbyBub3Qgc3dhcCB0aGUgbWVhbmluZy5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50KHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gMSA6IC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQoMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgLy8gU2VlIGNvbW1lbnQgb24gTEVGVF9BUlJPVyBhYm91dCB0aGUgY29uZGl0aW9ucyB1bmRlciB3aGljaCB3ZSBmbGlwIHRoZSBtZWFuaW5nLlxuICAgICAgICB0aGlzLl9pbmNyZW1lbnQodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBSZXR1cm4gaWYgdGhlIGtleSBpcyBub3Qgb25lIHRoYXQgd2UgZXhwbGljaXRseSBoYW5kbGUgdG8gYXZvaWQgY2FsbGluZyBwcmV2ZW50RGVmYXVsdCBvblxuICAgICAgICAvLyBpdC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgX29uS2V5dXAoKSB7XG4gICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIHB1dCB0aGVpciBwb2ludGVyIGRvd24gb24gdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlckRvd24gPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgdGhlIHNsaWRlciBpcyBkaXNhYmxlZCBvciB0aGVcbiAgICAvLyB1c2VyIGlzIHVzaW5nIGFueXRoaW5nIG90aGVyIHRoYW4gdGhlIG1haW4gbW91c2UgYnV0dG9uLlxuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuX2lzU2xpZGluZyB8fCAoIWlzVG91Y2hFdmVudChldmVudCkgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3J1bkluc2lkZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KTtcbiAgICAgIHRoaXMuX2lzU2xpZGluZyA9IHRydWU7XG4gICAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gZXZlbnQ7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuICAgICAgdGhpcy5fb25Nb3VzZWVudGVyKCk7IC8vIFNpbXVsYXRlIG1vdXNlZW50ZXIgaW4gY2FzZSB0aGlzIGlzIGEgbW9iaWxlIGRldmljZS5cbiAgICAgIHRoaXMuX2JpbmRHbG9iYWxFdmVudHMoZXZlbnQpO1xuICAgICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24ocG9pbnRlclBvc2l0aW9uKTtcbiAgICAgIHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ID0gdGhpcy52YWx1ZTtcbiAgICAgIHRoaXMuX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQgPSBwb2ludGVyUG9zaXRpb247XG5cbiAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgYW5kIGlucHV0IGV2ZW50IGlmIHRoZSB2YWx1ZSBjaGFuZ2VkLlxuICAgICAgaWYgKG9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIG1vdmVkIHRoZWlyIHBvaW50ZXIgYWZ0ZXJcbiAgICogc3RhcnRpbmcgdG8gZHJhZy4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcG9pbnRlck1vdmUgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgLy8gUHJldmVudCB0aGUgc2xpZGUgZnJvbSBzZWxlY3RpbmcgYW55dGhpbmcgZWxzZS5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpKTtcblxuICAgICAgLy8gTmF0aXZlIHJhbmdlIGVsZW1lbnRzIGFsd2F5cyBlbWl0IGBpbnB1dGAgZXZlbnRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZWQgd2hpbGUgc2xpZGluZy5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBsaWZ0ZWQgdGhlaXIgcG9pbnRlci4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXAgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHRoaXMuX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQ7XG4gICAgICBjb25zdCBjdXJyZW50UG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0ID0gdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IG51bGw7XG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ICE9IHRoaXMudmFsdWUgJiYgIXRoaXMuZGlzYWJsZWQgJiZcbiAgICAgICAgICBwb2ludGVyUG9zaXRpb25PblN0YXJ0ICYmIChwb2ludGVyUG9zaXRpb25PblN0YXJ0LnggIT09IGN1cnJlbnRQb2ludGVyUG9zaXRpb24ueCB8fFxuICAgICAgICAgIHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQueSAhPT0gY3VycmVudFBvaW50ZXJQb3NpdGlvbi55KSkge1xuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBoYXMgbG9zdCBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgd2luZG93IGlzIGJsdXJyZWQgd2hpbGUgZHJhZ2dpbmcgd2UgbmVlZCB0byBzdG9wIGRyYWdnaW5nIGJlY2F1c2UgdGhlXG4gICAgLy8gYnJvd3NlciB3b24ndCBkaXNwYXRjaCB0aGUgYG1vdXNldXBgIGFuZCBgdG91Y2hlbmRgIGV2ZW50cyBhbnltb3JlLlxuICAgIGlmICh0aGlzLl9sYXN0UG9pbnRlckV2ZW50KSB7XG4gICAgICB0aGlzLl9wb2ludGVyVXAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIG91ciBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cy4gVGhleSdyZSBib3VuZCBhdCB0aGUgZG9jdW1lbnQgbGV2ZWwgYW5kIG9ubHkgd2hpbGVcbiAgICogZHJhZ2dpbmcgc28gdGhhdCB0aGUgdXNlciBkb2Vzbid0IGhhdmUgdG8ga2VlcCB0aGVpciBwb2ludGVyIGV4YWN0bHkgb3ZlciB0aGUgc2xpZGVyXG4gICAqIGFzIHRoZXkncmUgc3dpcGluZyBhY3Jvc3MgdGhlIHNjcmVlbi5cbiAgICovXG4gIHByaXZhdGUgX2JpbmRHbG9iYWxFdmVudHModHJpZ2dlckV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHRoaXMuX2RvY3VtZW50KSB7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICAgIGNvbnN0IGlzVG91Y2ggPSBpc1RvdWNoRXZlbnQodHJpZ2dlckV2ZW50KTtcbiAgICAgIGNvbnN0IG1vdmVFdmVudE5hbWUgPSBpc1RvdWNoID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcbiAgICAgIGNvbnN0IGVuZEV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2hlbmQnIDogJ21vdXNldXAnO1xuICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKG1vdmVFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuXG4gICAgICBpZiAoaXNUb3VjaCkge1xuICAgICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGFueSBnbG9iYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2UgbWF5IGhhdmUgYWRkZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUdsb2JhbEV2ZW50cygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2RvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLl9kb2N1bWVudCkge1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbmNyZW1lbnRzIHRoZSBzbGlkZXIgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBzdGVwcyAobmVnYXRpdmUgbnVtYmVyIGRlY3JlbWVudHMpLiAqL1xuICBwcml2YXRlIF9pbmNyZW1lbnQobnVtU3RlcHM6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcCgodGhpcy52YWx1ZSB8fCAwKSArIHRoaXMuc3RlcCAqIG51bVN0ZXBzLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbmV3IHZhbHVlIGZyb20gdGhlIG5ldyBwaHlzaWNhbCBsb2NhdGlvbi4gVGhlIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHNuYXBwZWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvczoge3g6IG51bWJlciwgeTogbnVtYmVyfSkge1xuICAgIGlmICghdGhpcy5fc2xpZGVyRGltZW5zaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy50b3AgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmxlZnQ7XG4gICAgbGV0IHNpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgIGxldCBwb3NDb21wb25lbnQgPSB0aGlzLnZlcnRpY2FsID8gcG9zLnkgOiBwb3MueDtcblxuICAgIC8vIFRoZSBleGFjdCB2YWx1ZSBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIGV2ZW50IGFuZCB1c2VkIHRvIGZpbmQgdGhlIGNsb3Nlc3Qgc25hcCB2YWx1ZS5cbiAgICBsZXQgcGVyY2VudCA9IHRoaXMuX2NsYW1wKChwb3NDb21wb25lbnQgLSBvZmZzZXQpIC8gc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSkge1xuICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBzdGVwcyBtYXkgbm90IGRpdmlkZSBjbGVhbmx5IGludG8gdGhlIG1heCB2YWx1ZSwgaWYgdGhlIHVzZXJcbiAgICAvLyBzbGlkIHRvIDAgb3IgMTAwIHBlcmNlbnQsIHdlIGp1bXAgdG8gdGhlIG1pbi9tYXggdmFsdWUuIFRoaXMgYXBwcm9hY2hcbiAgICAvLyBpcyBzbGlnaHRseSBtb3JlIGludHVpdGl2ZSB0aGFuIHVzaW5nIGBNYXRoLmNlaWxgIGJlbG93LCBiZWNhdXNlIGl0XG4gICAgLy8gZm9sbG93cyB0aGUgdXNlcidzIHBvaW50ZXIgY2xvc2VyLlxuICAgIGlmIChwZXJjZW50ID09PSAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgfSBlbHNlIGlmIChwZXJjZW50ID09PSAxKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4YWN0VmFsdWUgPSB0aGlzLl9jYWxjdWxhdGVWYWx1ZShwZXJjZW50KTtcblxuICAgICAgLy8gVGhpcyBjYWxjdWxhdGlvbiBmaW5kcyB0aGUgY2xvc2VzdCBzdGVwIGJ5IGZpbmRpbmcgdGhlIGNsb3Nlc3RcbiAgICAgIC8vIHdob2xlIG51bWJlciBkaXZpc2libGUgYnkgdGhlIHN0ZXAgcmVsYXRpdmUgdG8gdGhlIG1pbi5cbiAgICAgIGNvbnN0IGNsb3Nlc3RWYWx1ZSA9IE1hdGgucm91bmQoKGV4YWN0VmFsdWUgLSB0aGlzLm1pbikgLyB0aGlzLnN0ZXApICogdGhpcy5zdGVwICsgdGhpcy5taW47XG5cbiAgICAgIC8vIFRoZSB2YWx1ZSBuZWVkcyB0byBzbmFwIHRvIHRoZSBtaW4gYW5kIG1heC5cbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcChjbG9zZXN0VmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGlucHV0IGV2ZW50IHdoZW4gdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdElucHV0RXZlbnQoKSB7XG4gICAgdGhpcy5pbnB1dC5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KCkpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpY2tzIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGggb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja0ludGVydmFsUGVyY2VudCgpIHtcbiAgICBpZiAoIXRoaXMudGlja0ludGVydmFsIHx8ICF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGlja0ludGVydmFsID09ICdhdXRvJykge1xuICAgICAgbGV0IHRyYWNrU2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgICBsZXQgcGl4ZWxzUGVyU3RlcCA9IHRyYWNrU2l6ZSAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgIGxldCBzdGVwc1BlclRpY2sgPSBNYXRoLmNlaWwoTUlOX0FVVE9fVElDS19TRVBBUkFUSU9OIC8gcGl4ZWxzUGVyU3RlcCk7XG4gICAgICBsZXQgcGl4ZWxzUGVyVGljayA9IHN0ZXBzUGVyVGljayAqIHRoaXMuc3RlcDtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSBwaXhlbHNQZXJUaWNrIC8gdHJhY2tTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gdGhpcy50aWNrSW50ZXJ2YWwgKiB0aGlzLnN0ZXAgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBzbGlkZXIgY2hhbmdlIG9iamVjdCBmcm9tIHRoZSBzcGVjaWZpZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KHZhbHVlID0gdGhpcy52YWx1ZSk6IE1hdFNsaWRlckNoYW5nZSB7XG4gICAgbGV0IGV2ZW50ID0gbmV3IE1hdFNsaWRlckNoYW5nZSgpO1xuXG4gICAgZXZlbnQuc291cmNlID0gdGhpcztcbiAgICBldmVudC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGEgdmFsdWUgaXMuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWU6IG51bWJlciB8IG51bGwpIHtcbiAgICByZXR1cm4gKCh2YWx1ZSB8fCAwKSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSB2YWx1ZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciBjb3JyZXNwb25kcyB0by4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlVmFsdWUocGVyY2VudGFnZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMubWluICsgcGVyY2VudGFnZSAqICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBudW1iZXIgYmV0d2VlbiB0d28gbnVtYmVycy4gKi9cbiAgcHJpdmF0ZSBfY2xhbXAodmFsdWU6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMSkge1xuICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIHRoZSBzbGlkZXIgdHJhY2sgZWxlbWVudC5cbiAgICogVGhlIHRyYWNrIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlIG5hdGl2ZSBlbGVtZW50IHRvIGlnbm9yZSB0aGUgZXh0cmEgc3BhY2UgdGhhdCB0aGUgdGh1bWIgY2FuXG4gICAqIHRha2UgdXAuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTbGlkZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXJXcmFwcGVyID8gdGhpcy5fc2xpZGVyV3JhcHBlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICogQ3VycmVudGx5IG9ubHkgdXNlZCB0byBhbGxvdyBhIGJsdXIgZXZlbnQgdG8gZmlyZSBidXQgd2lsbCBiZSB1c2VkIHdpdGgga2V5Ym9hcmQgaW5wdXQgbGF0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0hvc3RFbGVtZW50KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9ibHVySG9zdEVsZW1lbnQoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgY2FsbGJhY2sgaW5zaWRlIG9mIHRoZSBOZ1pvbmUsIGlmIHBvc3NpYmxlLiAqL1xuICBwcml2YXRlIF9ydW5JbnNpZGVab25lKGZuOiAoKSA9PiBhbnkpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIFJlbW92ZSB0aGlzIGZ1bmN0aW9uIG9uY2UgYF9uZ1pvbmVgIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgIHRoaXMuX25nWm9uZSA/IHRoaXMuX25nWm9uZS5ydW4oZm4pIDogZm4oKTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgY2FsbGJhY2sgb3V0c2lkZSBvZiB0aGUgTmdab25lLCBpZiBwb3NzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfcnVuT3V0c2l6ZVpvbmUoZm46ICgpID0+IGFueSkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIHRoaXMgZnVuY3Rpb24gb25jZSBgX25nWm9uZWAgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fbmdab25lID8gdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZuKSA6IGZuKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbW9kZWwgdmFsdWUuIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIHRvdWNoZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB3aGV0aGVyIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZFxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW52ZXJ0OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9tYXg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbWluOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0ZXA6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGh1bWJMYWJlbDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGlja0ludGVydmFsOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZlcnRpY2FsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKiogUmV0dXJucyB3aGV0aGVyIGFuIGV2ZW50IGlzIGEgdG91Y2ggZXZlbnQuICovXG5mdW5jdGlvbiBpc1RvdWNoRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogZXZlbnQgaXMgVG91Y2hFdmVudCB7XG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBldmVyeSBwaXhlbCB0aGF0IHRoZSB1c2VyIGhhcyBkcmFnZ2VkIHNvIHdlIG5lZWQgaXQgdG8gYmVcbiAgLy8gYXMgZmFzdCBhcyBwb3NzaWJsZS4gU2luY2Ugd2Ugb25seSBiaW5kIG1vdXNlIGV2ZW50cyBhbmQgdG91Y2ggZXZlbnRzLCB3ZSBjYW4gYXNzdW1lXG4gIC8vIHRoYXQgaWYgdGhlIGV2ZW50J3MgbmFtZSBzdGFydHMgd2l0aCBgdGAsIGl0J3MgYSB0b3VjaCBldmVudC5cbiAgcmV0dXJuIGV2ZW50LnR5cGVbMF0gPT09ICd0Jztcbn1cblxuLyoqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGEgdG91Y2ggb3IgbW91c2UgZXZlbnQgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LiAqL1xuZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAvLyBgdG91Y2hlc2Agd2lsbCBiZSBlbXB0eSBmb3Igc3RhcnQvZW5kIGV2ZW50cyBzbyB3ZSBoYXZlIHRvIGZhbGwgYmFjayB0byBgY2hhbmdlZFRvdWNoZXNgLlxuICBjb25zdCBwb2ludCA9IGlzVG91Y2hFdmVudChldmVudCkgPyAoZXZlbnQudG91Y2hlc1swXSB8fCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSkgOiBldmVudDtcbiAgcmV0dXJuIHt4OiBwb2ludC5jbGllbnRYLCB5OiBwb2ludC5jbGllbnRZfTtcbn1cbiJdfQ==