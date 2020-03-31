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
    // @breaking-change 9.0.0 `_ngZone` parameter to be made required.
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
    /** Use defaultView of injected document if available or fallback to global window reference */
    MatSlider.prototype._getWindow = function () {
        var _a;
        return ((_a = this._document) === null || _a === void 0 ? void 0 : _a.defaultView) || window;
    };
    /**
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     */
    MatSlider.prototype._bindGlobalEvents = function (triggerEvent) {
        // Note that we bind the events to the `document`, because it allows us to capture
        // drag cancel events where the user's pointer is outside the browser window.
        var document = this._document;
        if (typeof document !== 'undefined' && document) {
            var isTouch = isTouchEvent(triggerEvent);
            var moveEventName = isTouch ? 'touchmove' : 'mousemove';
            var endEventName = isTouch ? 'touchend' : 'mouseup';
            document.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
            document.addEventListener(endEventName, this._pointerUp, activeEventOptions);
            if (isTouch) {
                document.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
            }
        }
        var window = this._getWindow();
        if (typeof window !== 'undefined' && window) {
            window.addEventListener('blur', this._windowBlur);
        }
    };
    /** Removes any global event listeners that we may have added. */
    MatSlider.prototype._removeGlobalEvents = function () {
        var document = this._document;
        if (typeof document !== 'undefined' && document) {
            document.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
            document.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
            document.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
            document.removeEventListener('touchend', this._pointerUp, activeEventOptions);
            document.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);
        }
        var window = this._getWindow();
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
        // @breaking-change 9.0.0 Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.run(fn) : fn();
    };
    /** Runs a callback outside of the NgZone, if possible. */
    MatSlider.prototype._runOutsizeZone = function (fn) {
        // @breaking-change 9.0.0 Remove this function once `_ngZone` is a required parameter.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsRUFFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsVUFBVSxFQUNWLEdBQUcsRUFDSCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsRUFDUixjQUFjLEdBQ2YsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQU9MLFVBQVUsRUFDVixhQUFhLEVBQ2IsYUFBYSxHQUNkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFbEMsSUFB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LEtBQUs7c0JBWUwsS0FBSzt1QkFpQkwsS0FBSzs2QkFlTCxLQUFLOytCQVNMLEtBQUs7d0JBY0wsS0FBSzs4QkFnQ0wsS0FBSzsyQkFHTCxLQUFLO3lCQVFMLE1BQU07d0JBR04sTUFBTTs4QkFPTixNQUFNO2lDQXlMTixTQUFTLFNBQUMsZUFBZTs7SUFzYzVCLGdCQUFDO0NBQUEsQUE1eUJELENBMEMrQixtQkFBbUIsR0Frd0JqRDtTQWx3QlksU0FBUztBQW93QnRCLGlEQUFpRDtBQUNqRCxTQUFTLFlBQVksQ0FBQyxLQUE4QjtJQUNsRCx3RkFBd0Y7SUFDeEYsdUZBQXVGO0lBQ3ZGLGdFQUFnRTtJQUNoRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQy9CLENBQUM7QUFFRCwrRUFBK0U7QUFDL0UsU0FBUyx3QkFBd0IsQ0FBQyxLQUE4QjtJQUM5RCw0RkFBNEY7SUFDNUYsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDMUYsT0FBTyxFQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgSE9NRSxcbiAgTEVGVF9BUlJPVyxcbiAgUEFHRV9ET1dOLFxuICBQQUdFX1VQLFxuICBSSUdIVF9BUlJPVyxcbiAgVVBfQVJST1csXG4gIGhhc01vZGlmaWVyS2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuQ29sb3JDdG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbmNvbnN0IGFjdGl2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IGZhbHNlfSk7XG5cbi8qKlxuICogVmlzdWFsbHksIGEgMzBweCBzZXBhcmF0aW9uIGJldHdlZW4gdGljayBtYXJrcyBsb29rcyBiZXN0LiBUaGlzIGlzIHZlcnkgc3ViamVjdGl2ZSBidXQgaXQgaXNcbiAqIHRoZSBkZWZhdWx0IHNlcGFyYXRpb24gd2UgY2hvc2UuXG4gKi9cbmNvbnN0IE1JTl9BVVRPX1RJQ0tfU0VQQVJBVElPTiA9IDMwO1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIGRpc2FibGVkIHNsaWRlci4gKi9cbmNvbnN0IERJU0FCTEVEX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGEgbm9uLWFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGFuIGFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA9IDEwO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LXNsaWRlciB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogVGhpcyBhbGxvd3MgaXQgdG8gc3VwcG9ydCBbKG5nTW9kZWwpXSBhbmQgW2Zvcm1Db250cm9sXS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQSBzaW1wbGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgYnkgdGhlIE1hdFNsaWRlciBjb21wb25lbnQuICovXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyQ2hhbmdlIHtcbiAgLyoqIFRoZSBNYXRTbGlkZXIgdGhhdCBjaGFuZ2VkLiAqL1xuICBzb3VyY2U6IE1hdFNsaWRlcjtcblxuICAvKiogVGhlIG5ldyB2YWx1ZSBvZiB0aGUgc291cmNlIHNsaWRlci4gKi9cbiAgdmFsdWU6IG51bWJlciB8IG51bGw7XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2xpZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNsaWRlckJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0U2xpZGVyTWl4aW5CYXNlOlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuQ29sb3JDdG9yICZcbiAgICBDYW5EaXNhYmxlQ3RvciAmXG4gICAgdHlwZW9mIE1hdFNsaWRlckJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlZChNYXRTbGlkZXJCYXNlKSwgJ2FjY2VudCcpKTtcblxuLyoqXG4gKiBBbGxvd3MgdXNlcnMgdG8gc2VsZWN0IGZyb20gYSByYW5nZSBvZiB2YWx1ZXMgYnkgbW92aW5nIHRoZSBzbGlkZXIgdGh1bWIuIEl0IGlzIHNpbWlsYXIgaW5cbiAqIGJlaGF2aW9yIHRvIHRoZSBuYXRpdmUgYDxpbnB1dCB0eXBlPVwicmFuZ2VcIj5gIGVsZW1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zbGlkZXInLFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIHByb3ZpZGVyczogW01BVF9TTElERVJfVkFMVUVfQUNDRVNTT1JdLFxuICBob3N0OiB7XG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGtleXVwKSc6ICdfb25LZXl1cCgpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19vbk1vdXNlZW50ZXIoKScsXG5cbiAgICAvLyBPbiBTYWZhcmkgc3RhcnRpbmcgdG8gc2xpZGUgdGVtcG9yYXJpbHkgdHJpZ2dlcnMgdGV4dCBzZWxlY3Rpb24gbW9kZSB3aGljaFxuICAgIC8vIHNob3cgdGhlIHdyb25nIGN1cnNvci4gV2UgcHJldmVudCBpdCBieSBzdG9wcGluZyB0aGUgYHNlbGVjdHN0YXJ0YCBldmVudC5cbiAgICAnKHNlbGVjdHN0YXJ0KSc6ICckZXZlbnQucHJldmVudERlZmF1bHQoKScsXG4gICAgJ2NsYXNzJzogJ21hdC1zbGlkZXIgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ3JvbGUnOiAnc2xpZGVyJyxcbiAgICAnW3RhYkluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbWF4JyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1pbl0nOiAnbWluJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAndmFsdWUnLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICd2ZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGFzLXRpY2tzXSc6ICd0aWNrSW50ZXJ2YWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1ob3Jpem9udGFsXSc6ICchdmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1heGlzLWludmVydGVkXSc6ICdfaW52ZXJ0QXhpcycsXG4gICAgLy8gQ2xhc3MgYmluZGluZyB3aGljaCBpcyBvbmx5IHVzZWQgYnkgdGhlIHRlc3QgaGFybmVzcyBhcyB0aGVyZSBpcyBubyBvdGhlclxuICAgIC8vIHdheSBmb3IgdGhlIGhhcm5lc3MgdG8gZGV0ZWN0IGlmIG1vdXNlIGNvb3JkaW5hdGVzIG5lZWQgdG8gYmUgaW52ZXJ0ZWQuXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLWludmVydC1tb3VzZS1jb29yZHNdJzogJ19zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItc2xpZGluZ10nOiAnX2lzU2xpZGluZycsXG4gICAgJ1tjbGFzcy5tYXQtc2xpZGVyLXRodW1iLWxhYmVsLXNob3dpbmddJzogJ3RodW1iTGFiZWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci12ZXJ0aWNhbF0nOiAndmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlci1taW4tdmFsdWVdJzogJ19pc01pblZhbHVlJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZXItaGlkZS1sYXN0LXRpY2tdJzogJ2Rpc2FibGVkIHx8IF9pc01pblZhbHVlICYmIF90aHVtYkdhcCAmJiBfaW52ZXJ0QXhpcycsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnY29sb3InLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlciBleHRlbmRzIF9NYXRTbGlkZXJNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIENhbkNvbG9yLCBPbkluaXQsIEhhc1RhYkluZGV4IHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBpbnZlcnRlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGludmVydCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2ludmVydDsgfVxuICBzZXQgaW52ZXJ0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faW52ZXJ0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9pbnZlcnQgPSBmYWxzZTtcblxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9tYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9tYXgpO1xuICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgIC8vIFNpbmNlIHRoaXMgYWxzbyBtb2RpZmllcyB0aGUgcGVyY2VudGFnZSwgd2UgbmVlZCB0byBsZXQgdGhlIGNoYW5nZSBkZXRlY3Rpb24ga25vdy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9tYXg6IG51bWJlciA9IDEwMDtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9taW47IH1cbiAgc2V0IG1pbih2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW4gPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9taW4pO1xuXG4gICAgLy8gSWYgdGhlIHZhbHVlIHdhc24ndCBleHBsaWNpdGx5IHNldCBieSB0aGUgdXNlciwgc2V0IGl0IHRvIHRoZSBtaW4uXG4gICAgaWYgKHRoaXMuX3ZhbHVlID09PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fbWluO1xuICAgIH1cbiAgICB0aGlzLl9wZXJjZW50ID0gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZSh0aGlzLl92YWx1ZSk7XG5cbiAgICAvLyBTaW5jZSB0aGlzIGFsc28gbW9kaWZpZXMgdGhlIHBlcmNlbnRhZ2UsIHdlIG5lZWQgdG8gbGV0IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGtub3cuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGUgdmFsdWVzIGF0IHdoaWNoIHRoZSB0aHVtYiB3aWxsIHNuYXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGVwKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9zdGVwOyB9XG4gIHNldCBzdGVwKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3N0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9zdGVwKTtcblxuICAgIGlmICh0aGlzLl9zdGVwICUgMSAhPT0gMCkge1xuICAgICAgdGhpcy5fcm91bmRUb0RlY2ltYWwgPSB0aGlzLl9zdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKS5wb3AoKSEubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoaXMgY291bGQgbW9kaWZ5IHRoZSBsYWJlbCwgd2UgbmVlZCB0byBub3RpZnkgdGhlIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RlcDogbnVtYmVyID0gMTtcblxuICAvKiogV2hldGhlciBvciBub3QgdG8gc2hvdyB0aGUgdGh1bWIgbGFiZWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aHVtYkxhYmVsKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdGh1bWJMYWJlbDsgfVxuICBzZXQgdGh1bWJMYWJlbCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl90aHVtYkxhYmVsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF90aHVtYkxhYmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBzaG93IHRpY2tzLiBSZWxhdGl2ZSB0byB0aGUgc3RlcCBzbyB0aGF0IGEgdGljayBhbHdheXMgYXBwZWFycyBvbiBhIHN0ZXAuXG4gICAqIEV4OiBUaWNrIGludGVydmFsIG9mIDQgd2l0aCBhIHN0ZXAgb2YgMyB3aWxsIGRyYXcgYSB0aWNrIGV2ZXJ5IDQgc3RlcHMgKGV2ZXJ5IDEyIHZhbHVlcykuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdGlja0ludGVydmFsKCkgeyByZXR1cm4gdGhpcy5fdGlja0ludGVydmFsOyB9XG4gIHNldCB0aWNrSW50ZXJ2YWwodmFsdWU6ICdhdXRvJyB8IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAnYXV0byc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlLCB0aGlzLl90aWNrSW50ZXJ2YWwgYXMgbnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gMDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsOiAnYXV0bycgfCBudW1iZXIgPSAwO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgLy8gSWYgdGhlIHZhbHVlIG5lZWRzIHRvIGJlIHJlYWQgYW5kIGl0IGlzIHN0aWxsIHVuaW5pdGlhbGl6ZWQsIGluaXRpYWxpemUgaXQgdG8gdGhlIG1pbi5cbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9taW47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodjogbnVtYmVyIHwgbnVsbCkge1xuICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgbGV0IHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodik7XG5cbiAgICAgIC8vIFdoaWxlIGluY3JlbWVudGluZyBieSBhIGRlY2ltYWwgd2UgY2FuIGVuZCB1cCB3aXRoIHZhbHVlcyBsaWtlIDMzLjMwMDAwMDAwMDAwMDAwNC5cbiAgICAgIC8vIFRydW5jYXRlIGl0IHRvIGVuc3VyZSB0aGF0IGl0IG1hdGNoZXMgdGhlIGxhYmVsIGFuZCB0byBtYWtlIGl0IGVhc2llciB0byB3b3JrIHdpdGguXG4gICAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gZm9ybWF0IHRoZSB2YWx1ZSBiZWZvcmUgaXQgaXMgZGlzcGxheWVkXG4gICAqIGluIHRoZSB0aHVtYiBsYWJlbC4gQ2FuIGJlIHVzZWQgdG8gZm9ybWF0IHZlcnkgbGFyZ2UgbnVtYmVyIGluIG9yZGVyXG4gICAqIGZvciB0aGVtIHRvIGZpdCBpbnRvIHRoZSBzbGlkZXIgdGh1bWIuXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIHZlcnRpY2FsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92ZXJ0aWNhbDsgfVxuICBzZXQgdmVydGljYWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdmVydGljYWwgPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdmFsdWUgaGFzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHRodW1iIG1vdmVzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXQ6IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2xpZGVyIGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlciB8IG51bGw+KCk7XG5cbiAgLyoqIFRoZSB2YWx1ZSB0byBiZSB1c2VkIGZvciBkaXNwbGF5IHB1cnBvc2VzLiAqL1xuICBnZXQgZGlzcGxheVZhbHVlKCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgaWYgKHRoaXMuZGlzcGxheVdpdGgpIHtcbiAgICAgIC8vIFZhbHVlIGlzIG5ldmVyIG51bGwgYnV0IHNpbmNlIHNldHRlcnMgYW5kIGdldHRlcnMgY2Fubm90IGhhdmVcbiAgICAgIC8vIGRpZmZlcmVudCB0eXBlcywgdGhlIHZhbHVlIGdldHRlciBpcyBhbHNvIHR5cGVkIHRvIHJldHVybiBudWxsLlxuICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheVdpdGgodGhpcy52YWx1ZSEpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGNvdWxkIGJlIGltcHJvdmVkIGZ1cnRoZXIgYnkgcm91bmRpbmcgc29tZXRoaW5nIGxpa2UgMC45OTkgdG8gMSBvclxuICAgIC8vIDAuODk5IHRvIDAuOSwgaG93ZXZlciBpdCBpcyB2ZXJ5IHBlcmZvcm1hbmNlIHNlbnNpdGl2ZSwgYmVjYXVzZSBpdCBnZXRzIGNhbGxlZCBvblxuICAgIC8vIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuXG4gICAgaWYgKHRoaXMuX3JvdW5kVG9EZWNpbWFsICYmIHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZSAlIDEgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnZhbHVlIHx8IDA7XG4gIH1cblxuICAvKiogc2V0IGZvY3VzIHRvIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQob3B0aW9ucyk7XG4gIH1cblxuICAvKiogYmx1ciB0aGUgaG9zdCBlbGVtZW50ICovXG4gIGJsdXIoKSB7XG4gICAgdGhpcy5fYmx1ckhvc3RFbGVtZW50KCk7XG4gIH1cblxuICAvKiogb25Ub3VjaCBmdW5jdGlvbiByZWdpc3RlcmVkIHZpYSByZWdpc3Rlck9uVG91Y2ggKENvbnRyb2xWYWx1ZUFjY2Vzc29yKS4gKi9cbiAgb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB0aGF0IGNvaW5jaWRlcyB3aXRoIHRoZSB2YWx1ZS4gKi9cbiAgZ2V0IHBlcmNlbnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2NsYW1wKHRoaXMuX3BlcmNlbnQpOyB9XG4gIHByaXZhdGUgX3BlcmNlbnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSB0aHVtYiBpcyBzbGlkaW5nLlxuICAgKiBVc2VkIHRvIGRldGVybWluZSBpZiB0aGVyZSBzaG91bGQgYmUgYSB0cmFuc2l0aW9uIGZvciB0aGUgdGh1bWIgYW5kIGZpbGwgdHJhY2suXG4gICAqL1xuICBfaXNTbGlkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBzbGlkZXIgaXMgYWN0aXZlIChjbGlja2VkIG9yIHNsaWRpbmcpLlxuICAgKiBVc2VkIHRvIHNocmluayBhbmQgZ3JvdyB0aGUgdGh1bWIgYXMgYWNjb3JkaW5nIHRvIHRoZSBNYXRlcmlhbCBEZXNpZ24gc3BlYy5cbiAgICovXG4gIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBheGlzIG9mIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQuXG4gICAqIChpLmUuIHdoZXRoZXIgbW92aW5nIHRoZSB0aHVtYiBpbiB0aGUgcG9zaXRpdmUgeCBvciB5IGRpcmVjdGlvbiBkZWNyZWFzZXMgdGhlIHNsaWRlcidzIHZhbHVlKS5cbiAgICovXG4gIGdldCBfaW52ZXJ0QXhpcygpIHtcbiAgICAvLyBTdGFuZGFyZCBub24taW52ZXJ0ZWQgbW9kZSBmb3IgYSB2ZXJ0aWNhbCBzbGlkZXIgc2hvdWxkIGJlIGRyYWdnaW5nIHRoZSB0aHVtYiBmcm9tIGJvdHRvbSB0b1xuICAgIC8vIHRvcC4gSG93ZXZlciBmcm9tIGEgeS1heGlzIHN0YW5kcG9pbnQgdGhpcyBpcyBpbnZlcnRlZC5cbiAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbCA/ICF0aGlzLmludmVydCA6IHRoaXMuaW52ZXJ0O1xuICB9XG5cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuICBnZXQgX2lzTWluVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGVyY2VudCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHNwYWNlIHRvIGxlYXZlIGJldHdlZW4gdGhlIHNsaWRlciB0aHVtYiBhbmQgdGhlIHRyYWNrIGZpbGwgJiB0cmFjayBiYWNrZ3JvdW5kXG4gICAqIGVsZW1lbnRzLlxuICAgKi9cbiAgZ2V0IF90aHVtYkdhcCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIERJU0FCTEVEX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUgJiYgIXRoaXMudGh1bWJMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlID8gTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgOiBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGJhY2tncm91bmQgZWxlbWVudC4gKi9cbiAgZ2V0IF90cmFja0JhY2tncm91bmRTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnZlcnRpY2FsID8gYDEsICR7MSAtIHRoaXMucGVyY2VudH0sIDFgIDogYCR7MSAtIHRoaXMucGVyY2VudH0sIDEsIDFgO1xuICAgIGNvbnN0IHNpZ24gPSB0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpID8gJy0nIDogJyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gc2NhbGUzZCBhdm9pZHMgc29tZSByZW5kZXJpbmcgaXNzdWVzIGluIENocm9tZS4gU2VlICMxMjA3MS5cbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGhpcy5fdGh1bWJHYXB9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGZpbGwgZWxlbWVudC4gKi9cbiAgZ2V0IF90cmFja0ZpbGxTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgcGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHtwZXJjZW50fSwgMWAgOiBgJHtwZXJjZW50fSwgMSwgMWA7XG4gICAgY29uc3Qgc2lnbiA9IHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkgPyAnJyA6ICctJztcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgLFxuICAgICAgLy8gaU9TIFNhZmFyaSBoYXMgYSBidWcgd2hlcmUgaXQgd29uJ3QgcmUtcmVuZGVyIGVsZW1lbnRzIHdoaWNoIHN0YXJ0IG9mIGFzIGBzY2FsZSgwKWAgdW50aWxcbiAgICAgIC8vIHNvbWV0aGluZyBmb3JjZXMgYSBzdHlsZSByZWNhbGN1bGF0aW9uIG9uIGl0LiBTaW5jZSB3ZSdsbCBlbmQgdXAgd2l0aCBgc2NhbGUoMClgIHdoZW5cbiAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIGlzIDAsIHdlIGNhbiBlYXNpbHkgZ2V0IGludG8gdGhpcyBzaXR1YXRpb24uIFdlIGZvcmNlIGFcbiAgICAgIC8vIHJlY2FsY3VsYXRpb24gYnkgY2hhbmdpbmcgdGhlIGVsZW1lbnQncyBgZGlzcGxheWAgd2hlbiBpdCBnb2VzIGZyb20gMCB0byBhbnkgb3RoZXIgdmFsdWUuXG4gICAgICBkaXNwbGF5OiBwZXJjZW50ID09PSAwID8gJ25vbmUnIDogJydcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0aWNrcyBjb250YWluZXIgZWxlbWVudC4gKi9cbiAgZ2V0IF90aWNrc0NvbnRhaW5lclN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRm9yIGEgaG9yaXpvbnRhbCBzbGlkZXIgaW4gUlRMIGxhbmd1YWdlcyB3ZSBwdXNoIHRoZSB0aWNrcyBjb250YWluZXIgb2ZmIHRoZSBsZWZ0IGVkZ2VcbiAgICAvLyBpbnN0ZWFkIG9mIHRoZSByaWdodCBlZGdlIHRvIGF2b2lkIGNhdXNpbmcgYSBob3Jpem9udGFsIHNjcm9sbGJhciB0byBhcHBlYXIuXG4gICAgbGV0IHNpZ24gPSAhdGhpcy52ZXJ0aWNhbCAmJiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/ICcnIDogJy0nO1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50IC8gMiAqIDEwMDtcbiAgICByZXR1cm4ge1xuICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke29mZnNldH0lKWBcbiAgICB9O1xuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0aWNrcyBlbGVtZW50LiAqL1xuICBnZXQgX3RpY2tzU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCB0aWNrU2l6ZSA9IHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgKiAxMDA7XG4gICAgbGV0IGJhY2tncm91bmRTaXplID0gdGhpcy52ZXJ0aWNhbCA/IGAycHggJHt0aWNrU2l6ZX0lYCA6IGAke3RpY2tTaXplfSUgMnB4YDtcbiAgICBsZXQgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRGVwZW5kaW5nIG9uIHRoZSBkaXJlY3Rpb24gd2UgcHVzaGVkIHRoZSB0aWNrcyBjb250YWluZXIsIHB1c2ggdGhlIHRpY2tzIHRoZSBvcHBvc2l0ZVxuICAgIC8vIGRpcmVjdGlvbiB0byByZS1jZW50ZXIgdGhlbSBidXQgY2xpcCBvZmYgdGhlIGVuZCBlZGdlLiBJbiBSVEwgbGFuZ3VhZ2VzIHdlIG5lZWQgdG8gZmxpcCB0aGVcbiAgICAvLyB0aWNrcyAxODAgZGVncmVlcyBzbyB3ZSdyZSByZWFsbHkgY3V0dGluZyBvZmYgdGhlIGVuZCBlZGdlIGFiZCBub3QgdGhlIHN0YXJ0LlxuICAgIGxldCBzaWduID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnLScgOiAnJztcbiAgICBsZXQgcm90YXRlID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgPyAnIHJvdGF0ZSgxODBkZWcpJyA6ICcnO1xuICAgIGxldCBzdHlsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnYmFja2dyb3VuZFNpemUnOiBiYWNrZ3JvdW5kU2l6ZSxcbiAgICAgIC8vIFdpdGhvdXQgdHJhbnNsYXRlWiB0aWNrcyBzb21ldGltZXMgaml0dGVyIGFzIHRoZSBzbGlkZXIgbW92ZXMgb24gQ2hyb21lICYgRmlyZWZveC5cbiAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlWigwKSB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RpY2tTaXplIC8gMn0lKSR7cm90YXRlfWBcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUgJiYgdGhpcy5fdGh1bWJHYXApIHtcbiAgICAgIGxldCBzaWRlOiBzdHJpbmc7XG5cbiAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgIHNpZGUgPSB0aGlzLl9pbnZlcnRBeGlzID8gJ0JvdHRvbScgOiAnVG9wJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNpZGUgPSB0aGlzLl9pbnZlcnRBeGlzID8gJ1JpZ2h0JyA6ICdMZWZ0JztcbiAgICAgIH1cblxuICAgICAgc3R5bGVzW2BwYWRkaW5nJHtzaWRlfWBdID0gYCR7dGhpcy5fdGh1bWJHYXB9cHhgO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICBnZXQgX3RodW1iQ29udGFpbmVyU3R5bGVzKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGxldCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRodW1iIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBsZXQgaW52ZXJ0T2Zmc2V0ID1cbiAgICAgICAgKHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnICYmICF0aGlzLnZlcnRpY2FsKSA/ICF0aGlzLl9pbnZlcnRBeGlzIDogdGhpcy5faW52ZXJ0QXhpcztcbiAgICBsZXQgb2Zmc2V0ID0gKGludmVydE9mZnNldCA/IHRoaXMucGVyY2VudCA6IDEgLSB0aGlzLnBlcmNlbnQpICogMTAwO1xuICAgIHJldHVybiB7XG4gICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZSR7YXhpc30oLSR7b2Zmc2V0fSUpYFxuICAgIH07XG4gIH1cblxuICAvKiogVGhlIHNpemUgb2YgYSB0aWNrIGludGVydmFsIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgc2l6ZSBvZiB0aGUgdHJhY2suICovXG4gIHByaXZhdGUgX3RpY2tJbnRlcnZhbFBlcmNlbnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3NsaWRlckRpbWVuc2lvbnM6IENsaWVudFJlY3QgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBEZWNpbWFsIHBsYWNlcyB0byByb3VuZCB0bywgYmFzZWQgb24gdGhlIHN0ZXAgYW1vdW50LiAqL1xuICBwcml2YXRlIF9yb3VuZFRvRGVjaW1hbDogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIERpcmVjdGlvbmFsaXR5IGNoYW5nZSBFdmVudEVtaXR0ZXIuICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgd2hlbiB0aGUgc2xpZGUgc3RhcnQgZXZlbnQgZmlyZXMuICovXG4gIHByaXZhdGUgX3ZhbHVlT25TbGlkZVN0YXJ0OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgcG9pbnRlciB3aGVuIHRoZSBkcmFnZ2luZyBzdGFydGVkLiAqL1xuICBwcml2YXRlIF9wb2ludGVyUG9zaXRpb25PblN0YXJ0OiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbm5lciBzbGlkZXIgd3JhcHBlciBlbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCdzbGlkZXJXcmFwcGVyJykgcHJpdmF0ZSBfc2xpZGVyV3JhcHBlcjogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogV2hldGhlciBtb3VzZSBldmVudHMgc2hvdWxkIGJlIGNvbnZlcnRlZCB0byBhIHNsaWRlciBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGVpciBkaXN0YW5jZVxuICAgKiBmcm9tIHRoZSByaWdodCBvciBib3R0b20gZWRnZSBvZiB0aGUgc2xpZGVyIGFzIG9wcG9zZWQgdG8gdGhlIHRvcCBvciBsZWZ0LlxuICAgKi9cbiAgX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkge1xuICAgIHJldHVybiAodGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwpID8gIXRoaXMuX2ludmVydEF4aXMgOiB0aGlzLl9pbnZlcnRBeGlzO1xuICB9XG5cbiAgLyoqIFRoZSBsYW5ndWFnZSBkaXJlY3Rpb24gZm9yIHRoaXMgc2xpZGVyIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2dldERpcmVjdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT0gJ3J0bCcpID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgbGFzdCBwb2ludGVyIGV2ZW50IHRoYXQgd2FzIGNhcHR1cmVkIGJ5IHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX2xhc3RQb2ludGVyRXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50IHwgbnVsbDtcblxuICAvKiogVXNlZCB0byBzdWJzY3JpYmUgdG8gZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudD86IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgX2FuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfbmdab25lYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lPzogTmdab25lLFxuICAgICAgICAgICAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgbWFrZSBkb2N1bWVudCByZXF1aXJlZCAqL1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcblxuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcblxuICAgIHRoaXMuX3J1bk91dHNpemVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX3BvaW50ZXJEb3duLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3JcbiAgICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgICAgLnN1YnNjcmliZSgob3JpZ2luOiBGb2N1c09yaWdpbikgPT4ge1xuICAgICAgICAgIHRoaXMuX2lzQWN0aXZlID0gISFvcmlnaW4gJiYgb3JpZ2luICE9PSAna2V5Ym9hcmQnO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgaWYgKHRoaXMuX2Rpcikge1xuICAgICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB0aGlzLl9sYXN0UG9pbnRlckV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBfb25Nb3VzZWVudGVyKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICAvLyBXZSBzYXZlIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZXIgaGVyZSBzbyB3ZSBjYW4gdXNlIHRoZW0gdG8gdXBkYXRlIHRoZSBzcGFjaW5nIG9mIHRoZVxuICAgIC8vIHRpY2tzIGFuZCBkZXRlcm1pbmUgd2hlcmUgb24gdGhlIHNsaWRlciBjbGljayBhbmQgc2xpZGUgZXZlbnRzIGhhcHBlbi5cbiAgICB0aGlzLl9zbGlkZXJEaW1lbnNpb25zID0gdGhpcy5fZ2V0U2xpZGVyRGltZW5zaW9ucygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tJbnRlcnZhbFBlcmNlbnQoKTtcbiAgfVxuXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfRE9XTjpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIC8vIE5PVEU6IEZvciBhIHNpZ2h0ZWQgdXNlciBpdCB3b3VsZCBtYWtlIG1vcmUgc2Vuc2UgdGhhdCB3aGVuIHRoZXkgcHJlc3MgYW4gYXJyb3cga2V5IG9uIGFuXG4gICAgICAgIC8vIGludmVydGVkIHNsaWRlciB0aGUgdGh1bWIgbW92ZXMgaW4gdGhhdCBkaXJlY3Rpb24uIEhvd2V2ZXIgZm9yIGEgYmxpbmQgdXNlciwgbm90aGluZ1xuICAgICAgICAvLyBhYm91dCB0aGUgc2xpZGVyIGluZGljYXRlcyB0aGF0IGl0IGlzIGludmVydGVkLiBUaGV5IHdpbGwgZXhwZWN0IGxlZnQgdG8gYmUgZGVjcmVtZW50LFxuICAgICAgICAvLyByZWdhcmRsZXNzIG9mIGhvdyBpdCBhcHBlYXJzIG9uIHRoZSBzY3JlZW4uIEZvciBzcGVha2VycyBvZlJUTCBsYW5ndWFnZXMsIHRoZXkgcHJvYmFibHlcbiAgICAgICAgLy8gZXhwZWN0IGxlZnQgdG8gbWVhbiBpbmNyZW1lbnQuIFRoZXJlZm9yZSB3ZSBmbGlwIHRoZSBtZWFuaW5nIG9mIHRoZSBzaWRlIGFycm93IGtleXMgZm9yXG4gICAgICAgIC8vIFJUTC4gRm9yIGludmVydGVkIHNsaWRlcnMgd2UgcHJlZmVyIGEgZ29vZCBhMTF5IGV4cGVyaWVuY2UgdG8gaGF2aW5nIGl0IFwibG9vayByaWdodFwiIGZvclxuICAgICAgICAvLyBzaWdodGVkIHVzZXJzLCB0aGVyZWZvcmUgd2UgZG8gbm90IHN3YXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PSAncnRsJyA/IDEgOiAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIC8vIFNlZSBjb21tZW50IG9uIExFRlRfQVJST1cgYWJvdXQgdGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggd2UgZmxpcCB0aGUgbWVhbmluZy5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50KHRoaXMuX2dldERpcmVjdGlvbigpID09ICdydGwnID8gLTEgOiAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gUmV0dXJuIGlmIHRoZSBrZXkgaXMgbm90IG9uZSB0aGF0IHdlIGV4cGxpY2l0bHkgaGFuZGxlIHRvIGF2b2lkIGNhbGxpbmcgcHJldmVudERlZmF1bHQgb25cbiAgICAgICAgLy8gaXQuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU2xpZGluZyA9IHRydWU7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIF9vbktleXVwKCkge1xuICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBwdXQgdGhlaXIgcG9pbnRlciBkb3duIG9uIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3BvaW50ZXJEb3duID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQgb3IgdGhlXG4gICAgLy8gdXNlciBpcyB1c2luZyBhbnl0aGluZyBvdGhlciB0aGFuIHRoZSBtYWluIG1vdXNlIGJ1dHRvbi5cbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLl9pc1NsaWRpbmcgfHwgKCFpc1RvdWNoRXZlbnQoZXZlbnQpICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ydW5JbnNpZGVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCk7XG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IGV2ZW50O1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQoKTtcbiAgICAgIHRoaXMuX29uTW91c2VlbnRlcigpOyAvLyBTaW11bGF0ZSBtb3VzZWVudGVyIGluIGNhc2UgdGhpcyBpcyBhIG1vYmlsZSBkZXZpY2UuXG4gICAgICB0aGlzLl9iaW5kR2xvYmFsRXZlbnRzKGV2ZW50KTtcbiAgICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvaW50ZXJQb3NpdGlvbik7XG4gICAgICB0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCA9IHRoaXMudmFsdWU7XG4gICAgICB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0ID0gcG9pbnRlclBvc2l0aW9uO1xuXG4gICAgICAvLyBFbWl0IGEgY2hhbmdlIGFuZCBpbnB1dCBldmVudCBpZiB0aGUgdmFsdWUgY2hhbmdlZC5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBtb3ZlZCB0aGVpciBwb2ludGVyIGFmdGVyXG4gICAqIHN0YXJ0aW5nIHRvIGRyYWcuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC5cbiAgICovXG4gIHByaXZhdGUgX3BvaW50ZXJNb3ZlID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIC8vIFByZXZlbnQgdGhlIHNsaWRlIGZyb20gc2VsZWN0aW5nIGFueXRoaW5nIGVsc2UuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy5fbGFzdFBvaW50ZXJFdmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24oZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KSk7XG5cbiAgICAgIC8vIE5hdGl2ZSByYW5nZSBlbGVtZW50cyBhbHdheXMgZW1pdCBgaW5wdXRgIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VkIHdoaWxlIHNsaWRpbmcuXG4gICAgICBpZiAob2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbGlmdGVkIHRoZWlyIHBvaW50ZXIuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQgPSB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0O1xuICAgICAgY29uc3QgY3VycmVudFBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCk7XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICAgIHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ID0gdGhpcy5fcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHRoaXMuX2xhc3RQb2ludGVyRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLl92YWx1ZU9uU2xpZGVTdGFydCAhPSB0aGlzLnZhbHVlICYmICF0aGlzLmRpc2FibGVkICYmXG4gICAgICAgICAgcG9pbnRlclBvc2l0aW9uT25TdGFydCAmJiAocG9pbnRlclBvc2l0aW9uT25TdGFydC54ICE9PSBjdXJyZW50UG9pbnRlclBvc2l0aW9uLnggfHxcbiAgICAgICAgICBwb2ludGVyUG9zaXRpb25PblN0YXJ0LnkgIT09IGN1cnJlbnRQb2ludGVyUG9zaXRpb24ueSkpIHtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB3aW5kb3cgaGFzIGxvc3QgZm9jdXMuICovXG4gIHByaXZhdGUgX3dpbmRvd0JsdXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHdpbmRvdyBpcyBibHVycmVkIHdoaWxlIGRyYWdnaW5nIHdlIG5lZWQgdG8gc3RvcCBkcmFnZ2luZyBiZWNhdXNlIHRoZVxuICAgIC8vIGJyb3dzZXIgd29uJ3QgZGlzcGF0Y2ggdGhlIGBtb3VzZXVwYCBhbmQgYHRvdWNoZW5kYCBldmVudHMgYW55bW9yZS5cbiAgICBpZiAodGhpcy5fbGFzdFBvaW50ZXJFdmVudCkge1xuICAgICAgdGhpcy5fcG9pbnRlclVwKHRoaXMuX2xhc3RQb2ludGVyRXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgZGVmYXVsdFZpZXcgb2YgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCB3aW5kb3cgcmVmZXJlbmNlICovXG4gIHByaXZhdGUgX2dldFdpbmRvdygpOiBXaW5kb3cge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudD8uZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIG91ciBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cy4gVGhleSdyZSBib3VuZCBhdCB0aGUgZG9jdW1lbnQgbGV2ZWwgYW5kIG9ubHkgd2hpbGVcbiAgICogZHJhZ2dpbmcgc28gdGhhdCB0aGUgdXNlciBkb2Vzbid0IGhhdmUgdG8ga2VlcCB0aGVpciBwb2ludGVyIGV4YWN0bHkgb3ZlciB0aGUgc2xpZGVyXG4gICAqIGFzIHRoZXkncmUgc3dpcGluZyBhY3Jvc3MgdGhlIHNjcmVlbi5cbiAgICovXG4gIHByaXZhdGUgX2JpbmRHbG9iYWxFdmVudHModHJpZ2dlckV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBiaW5kIHRoZSBldmVudHMgdG8gdGhlIGBkb2N1bWVudGAsIGJlY2F1c2UgaXQgYWxsb3dzIHVzIHRvIGNhcHR1cmVcbiAgICAvLyBkcmFnIGNhbmNlbCBldmVudHMgd2hlcmUgdGhlIHVzZXIncyBwb2ludGVyIGlzIG91dHNpZGUgdGhlIGJyb3dzZXIgd2luZG93LlxuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZG9jdW1lbnQ7XG5cbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudCkge1xuICAgICAgY29uc3QgaXNUb3VjaCA9IGlzVG91Y2hFdmVudCh0cmlnZ2VyRXZlbnQpO1xuICAgICAgY29uc3QgbW92ZUV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuICAgICAgY29uc3QgZW5kRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCc7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKG1vdmVFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcblxuICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGFueSBnbG9iYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2UgbWF5IGhhdmUgYWRkZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUdsb2JhbEV2ZW50cygpIHtcbiAgICBjb25zdCBkb2N1bWVudCA9IHRoaXMuX2RvY3VtZW50O1xuXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9XG5cbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1cik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEluY3JlbWVudHMgdGhlIHNsaWRlciBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIHN0ZXBzIChuZWdhdGl2ZSBudW1iZXIgZGVjcmVtZW50cykuICovXG4gIHByaXZhdGUgX2luY3JlbWVudChudW1TdGVwczogbnVtYmVyKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKCh0aGlzLnZhbHVlIHx8IDApICsgdGhpcy5zdGVwICogbnVtU3RlcHMsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlIHRoZSBuZXcgdmFsdWUgZnJvbSB0aGUgbmV3IHBoeXNpY2FsIGxvY2F0aW9uLiBUaGUgdmFsdWUgd2lsbCBhbHdheXMgYmUgc25hcHBlZC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsdWVGcm9tUG9zaXRpb24ocG9zOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9KSB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG9mZnNldCA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLnRvcCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMubGVmdDtcbiAgICBsZXQgc2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgbGV0IHBvc0NvbXBvbmVudCA9IHRoaXMudmVydGljYWwgPyBwb3MueSA6IHBvcy54O1xuXG4gICAgLy8gVGhlIGV4YWN0IHZhbHVlIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgZXZlbnQgYW5kIHVzZWQgdG8gZmluZCB0aGUgY2xvc2VzdCBzbmFwIHZhbHVlLlxuICAgIGxldCBwZXJjZW50ID0gdGhpcy5fY2xhbXAoKHBvc0NvbXBvbmVudCAtIG9mZnNldCkgLyBzaXplKTtcblxuICAgIGlmICh0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpKSB7XG4gICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIHN0ZXBzIG1heSBub3QgZGl2aWRlIGNsZWFubHkgaW50byB0aGUgbWF4IHZhbHVlLCBpZiB0aGUgdXNlclxuICAgIC8vIHNsaWQgdG8gMCBvciAxMDAgcGVyY2VudCwgd2UganVtcCB0byB0aGUgbWluL21heCB2YWx1ZS4gVGhpcyBhcHByb2FjaFxuICAgIC8vIGlzIHNsaWdodGx5IG1vcmUgaW50dWl0aXZlIHRoYW4gdXNpbmcgYE1hdGguY2VpbGAgYmVsb3csIGJlY2F1c2UgaXRcbiAgICAvLyBmb2xsb3dzIHRoZSB1c2VyJ3MgcG9pbnRlciBjbG9zZXIuXG4gICAgaWYgKHBlcmNlbnQgPT09IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPT09IDEpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhhY3RWYWx1ZSA9IHRoaXMuX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnQpO1xuXG4gICAgICAvLyBUaGlzIGNhbGN1bGF0aW9uIGZpbmRzIHRoZSBjbG9zZXN0IHN0ZXAgYnkgZmluZGluZyB0aGUgY2xvc2VzdFxuICAgICAgLy8gd2hvbGUgbnVtYmVyIGRpdmlzaWJsZSBieSB0aGUgc3RlcCByZWxhdGl2ZSB0byB0aGUgbWluLlxuICAgICAgY29uc3QgY2xvc2VzdFZhbHVlID0gTWF0aC5yb3VuZCgoZXhhY3RWYWx1ZSAtIHRoaXMubWluKSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXAgKyB0aGlzLm1pbjtcblxuICAgICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIHNuYXAgdG8gdGhlIG1pbiBhbmQgbWF4LlxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKGNsb3Nlc3RWYWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4odGhpcy52YWx1ZSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogRW1pdHMgYW4gaW5wdXQgZXZlbnQgd2hlbiB0aGUgY3VycmVudCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0SW5wdXRFdmVudCgpIHtcbiAgICB0aGlzLmlucHV0LmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlja3MgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aWR0aCBvZiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCkge1xuICAgIGlmICghdGhpcy50aWNrSW50ZXJ2YWwgfHwgIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aWNrSW50ZXJ2YWwgPT0gJ2F1dG8nKSB7XG4gICAgICBsZXQgdHJhY2tTaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICAgIGxldCBwaXhlbHNQZXJTdGVwID0gdHJhY2tTaXplICogdGhpcy5zdGVwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgbGV0IHN0ZXBzUGVyVGljayA9IE1hdGguY2VpbChNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gLyBwaXhlbHNQZXJTdGVwKTtcbiAgICAgIGxldCBwaXhlbHNQZXJUaWNrID0gc3RlcHNQZXJUaWNrICogdGhpcy5zdGVwO1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCA9IHBpeGVsc1BlclRpY2sgLyB0cmFja1NpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgPSB0aGlzLnRpY2tJbnRlcnZhbCAqIHRoaXMuc3RlcCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIHNsaWRlciBjaGFuZ2Ugb2JqZWN0IGZyb20gdGhlIHNwZWNpZmllZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ2hhbmdlRXZlbnQodmFsdWUgPSB0aGlzLnZhbHVlKTogTWF0U2xpZGVyQ2hhbmdlIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgTWF0U2xpZGVyQ2hhbmdlKCk7XG5cbiAgICBldmVudC5zb3VyY2UgPSB0aGlzO1xuICAgIGV2ZW50LnZhbHVlID0gdmFsdWU7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgYSB2YWx1ZSBpcy4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHJldHVybiAoKHZhbHVlIHx8IDApIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHZhbHVlIGEgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIGNvcnJlc3BvbmRzIHRvLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVWYWx1ZShwZXJjZW50YWdlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5taW4gKyBwZXJjZW50YWdlICogKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICB9XG5cbiAgLyoqIFJldHVybiBhIG51bWJlciBiZXR3ZWVuIHR3byBudW1iZXJzLiAqL1xuICBwcml2YXRlIF9jbGFtcCh2YWx1ZTogbnVtYmVyLCBtaW4gPSAwLCBtYXggPSAxKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYm91bmRpbmcgY2xpZW50IHJlY3Qgb2YgdGhlIHNsaWRlciB0cmFjayBlbGVtZW50LlxuICAgKiBUaGUgdHJhY2sgaXMgdXNlZCByYXRoZXIgdGhhbiB0aGUgbmF0aXZlIGVsZW1lbnQgdG8gaWdub3JlIHRoZSBleHRyYSBzcGFjZSB0aGF0IHRoZSB0aHVtYiBjYW5cbiAgICogdGFrZSB1cC5cbiAgICovXG4gIHByaXZhdGUgX2dldFNsaWRlckRpbWVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlcldyYXBwZXIgPyB0aGlzLl9zbGlkZXJXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIG5hdGl2ZSBlbGVtZW50LlxuICAgKiBDdXJyZW50bHkgb25seSB1c2VkIHRvIGFsbG93IGEgYmx1ciBldmVudCB0byBmaXJlIGJ1dCB3aWxsIGJlIHVzZWQgd2l0aCBrZXlib2FyZCBpbnB1dCBsYXRlci5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzSG9zdEVsZW1lbnQob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbmF0aXZlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2JsdXJIb3N0RWxlbWVudCgpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSBjYWxsYmFjayBpbnNpZGUgb2YgdGhlIE5nWm9uZSwgaWYgcG9zc2libGUuICovXG4gIHByaXZhdGUgX3J1bkluc2lkZVpvbmUoZm46ICgpID0+IGFueSkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIHRoaXMgZnVuY3Rpb24gb25jZSBgX25nWm9uZWAgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fbmdab25lID8gdGhpcy5fbmdab25lLnJ1bihmbikgOiBmbigpO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSBjYWxsYmFjayBvdXRzaWRlIG9mIHRoZSBOZ1pvbmUsIGlmIHBvc3NpYmxlLiAqL1xuICBwcml2YXRlIF9ydW5PdXRzaXplWm9uZShmbjogKCkgPT4gYW55KSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBSZW1vdmUgdGhpcyBmdW5jdGlvbiBvbmNlIGBfbmdab25lYCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICB0aGlzLl9uZ1pvbmUgPyB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoZm4pIDogZm4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbnZlcnQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21heDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9taW46IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc3RlcDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aHVtYkxhYmVsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aWNrSW50ZXJ2YWw6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmVydGljYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKiBSZXR1cm5zIHdoZXRoZXIgYW4gZXZlbnQgaXMgYSB0b3VjaCBldmVudC4gKi9cbmZ1bmN0aW9uIGlzVG91Y2hFdmVudChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBldmVudCBpcyBUb3VjaEV2ZW50IHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIGV2ZXJ5IHBpeGVsIHRoYXQgdGhlIHVzZXIgaGFzIGRyYWdnZWQgc28gd2UgbmVlZCBpdCB0byBiZVxuICAvLyBhcyBmYXN0IGFzIHBvc3NpYmxlLiBTaW5jZSB3ZSBvbmx5IGJpbmQgbW91c2UgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMsIHdlIGNhbiBhc3N1bWVcbiAgLy8gdGhhdCBpZiB0aGUgZXZlbnQncyBuYW1lIHN0YXJ0cyB3aXRoIGB0YCwgaXQncyBhIHRvdWNoIGV2ZW50LlxuICByZXR1cm4gZXZlbnQudHlwZVswXSA9PT0gJ3QnO1xufVxuXG4vKiogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYSB0b3VjaCBvciBtb3VzZSBldmVudCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuICovXG5mdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gIC8vIGB0b3VjaGVzYCB3aWxsIGJlIGVtcHR5IGZvciBzdGFydC9lbmQgZXZlbnRzIHNvIHdlIGhhdmUgdG8gZmFsbCBiYWNrIHRvIGBjaGFuZ2VkVG91Y2hlc2AuXG4gIGNvbnN0IHBvaW50ID0gaXNUb3VjaEV2ZW50KGV2ZW50KSA/IChldmVudC50b3VjaGVzWzBdIHx8IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSA6IGV2ZW50O1xuICByZXR1cm4ge3g6IHBvaW50LmNsaWVudFgsIHk6IHBvaW50LmNsaWVudFl9O1xufVxuIl19