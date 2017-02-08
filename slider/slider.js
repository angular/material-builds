var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { NgModule, Component, ElementRef, Input, Output, ViewEncapsulation, forwardRef, EventEmitter, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig, coerceBooleanProperty, coerceNumberProperty, CompatibilityModule } from '../core';
import { Dir } from '../core/rtl/dir';
import { CommonModule } from '@angular/common';
import { PAGE_UP, PAGE_DOWN, END, HOME, LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW } from '../core/keyboard/keycodes';
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
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
export var MD_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdSlider; }),
    multi: true
};
/** A simple change event emitted by the MdSlider component. */
export var MdSliderChange = (function () {
    function MdSliderChange() {
    }
    return MdSliderChange;
}());
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export var MdSlider = (function () {
    function MdSlider(_dir, elementRef) {
        this._dir = _dir;
        /** A renderer to handle updating the slider's thumb and fill track. */
        this._renderer = null;
        /** The dimensions of the slider. */
        this._sliderDimensions = null;
        this._disabled = false;
        this._thumbLabel = false;
        this._controlValueAccessorChangeFn = function () { };
        /** The last values for which a change or input event was emitted. */
        this._lastChangeValue = null;
        this._lastInputValue = null;
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
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
        this._step = 1;
        this._tickInterval = 0;
        this._tickIntervalPercent = 0;
        this._percent = 0;
        this._value = null;
        this._min = 0;
        this._max = 100;
        this._invert = false;
        this._vertical = false;
        /** Event emitted when the slider value has changed. */
        this.change = new EventEmitter();
        /** Event emitted when the slider thumb moves. */
        this.input = new EventEmitter();
        this._renderer = new SliderRenderer(elementRef);
    }
    Object.defineProperty(MdSlider.prototype, "disabled", {
        /** Whether or not the slider is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "thumbLabel", {
        /** Whether or not to show the thumb label. */
        get: function () { return this._thumbLabel; },
        set: function (value) { this._thumbLabel = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbLabelDeprecated", {
        /** @deprecated */
        get: function () { return this._thumbLabel; },
        set: function (value) { this._thumbLabel = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "step", {
        /** The values at which the thumb will snap. */
        get: function () { return this._step; },
        set: function (v) {
            this._step = coerceNumberProperty(v, this._step);
            if (this._step % 1 !== 0) {
                this._roundLabelTo = this._step.toString().split('.').pop().length;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "tickInterval", {
        /**
         * How often to show ticks. Relative to the step so that a tick always appears on a step.
         * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
         */
        get: function () { return this._tickInterval; },
        set: function (v) {
            this._tickInterval = (v == 'auto') ? v : coerceNumberProperty(v, this._tickInterval);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_tickIntervalDeprecated", {
        /** @deprecated */
        get: function () { return this.tickInterval; },
        set: function (v) { this.tickInterval = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "tickIntervalPercent", {
        /** The size of a tick interval as a percentage of the size of the track. */
        get: function () { return this._tickIntervalPercent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "percent", {
        /** The percentage of the slider that coincides with the value. */
        get: function () { return this._clamp(this._percent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "value", {
        /** Value of the slider. */
        get: function () {
            // If the value needs to be read and it is still uninitialized, initialize it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            return this._value;
        },
        set: function (v) {
            this._value = coerceNumberProperty(v, this._value);
            this._percent = this._calculatePercentage(this._value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "min", {
        /** The minimum value that the slider can have. */
        get: function () {
            return this._min;
        },
        set: function (v) {
            this._min = coerceNumberProperty(v, this._min);
            // If the value wasn't explicitly set by the user, set it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            this._percent = this._calculatePercentage(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "max", {
        /** The maximum value that the slider can have. */
        get: function () {
            return this._max;
        },
        set: function (v) {
            this._max = coerceNumberProperty(v, this._max);
            this._percent = this._calculatePercentage(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "invert", {
        /** Whether the slider is inverted. */
        get: function () { return this._invert; },
        set: function (value) { this._invert = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "vertical", {
        /** Whether the slider is vertical. */
        get: function () { return this._vertical; },
        set: function (value) { this._vertical = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "displayValue", {
        /** The value to be used for display purposes. */
        get: function () {
            // Note that this could be improved further by rounding something like 0.999 to 1 or
            // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
            // every change detection cycle.
            if (this._roundLabelTo && this.value % 1 !== 0) {
                return this.value.toFixed(this._roundLabelTo);
            }
            return this.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "invertAxis", {
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
    Object.defineProperty(MdSlider.prototype, "invertMouseCoords", {
        /**
         * Whether mouse events should be converted to a slider position by calculating their distance
         * from the right or bottom edge of the slider as opposed to the top or left.
         */
        get: function () {
            return (this.direction == 'rtl' && !this.vertical) ? !this.invertAxis : this.invertAxis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_isMinValue", {
        /** Whether the slider is at its minimum value. */
        get: function () {
            return this.percent === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbGap", {
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
    Object.defineProperty(MdSlider.prototype, "trackBackgroundStyles", {
        /** CSS styles for the track background element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            var sign = this.invertMouseCoords ? '-' : '';
            return {
                'transform': "translate" + axis + "(" + sign + this._thumbGap + "px) scale" + axis + "(" + (1 - this.percent) + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "trackFillStyles", {
        /** CSS styles for the track fill element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            var sign = this.invertMouseCoords ? '' : '-';
            return {
                'transform': "translate" + axis + "(" + sign + this._thumbGap + "px) scale" + axis + "(" + this.percent + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "ticksContainerStyles", {
        /** CSS styles for the ticks container element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the ticks container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var sign = !this.vertical && this.direction == 'rtl' ? '' : '-';
            var offset = this.tickIntervalPercent / 2 * 100;
            return {
                'transform': "translate" + axis + "(" + sign + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "ticksStyles", {
        /** CSS styles for the ticks element. */
        get: function () {
            var tickSize = this.tickIntervalPercent * 100;
            var backgroundSize = this.vertical ? "2px " + tickSize + "%" : tickSize + "% 2px";
            var axis = this.vertical ? 'Y' : 'X';
            // Depending on the direction we pushed the ticks container, push the ticks the opposite
            // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
            // ticks 180 degrees so we're really cutting off the end edge abd not the start.
            var sign = !this.vertical && this.direction == 'rtl' ? '-' : '';
            var rotate = !this.vertical && this.direction == 'rtl' ? ' rotate(180deg)' : '';
            var styles = {
                'backgroundSize': backgroundSize,
                // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
                'transform': "translateZ(0) translate" + axis + "(" + sign + tickSize / 2 + "%)" + rotate
            };
            if (this._isMinValue && this._thumbGap) {
                var side = this.vertical ?
                    (this.invertAxis ? 'Bottom' : 'Top') :
                    (this.invertAxis ? 'Right' : 'Left');
                styles[("padding" + side)] = this._thumbGap + "px";
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "thumbContainerStyles", {
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the thumb container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var invertOffset = (this.direction == 'rtl' && !this.vertical) ? !this.invertAxis : this.invertAxis;
            var offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
            return {
                'transform': "translate" + axis + "(-" + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "direction", {
        /** The language direction for this slider element. */
        get: function () {
            return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    MdSlider.prototype._onMouseenter = function () {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._renderer.getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    MdSlider.prototype._onClick = function (event) {
        if (this.disabled) {
            return;
        }
        this._isActive = true;
        this._isSliding = false;
        this._renderer.addFocus();
        this._updateValueFromPosition({ x: event.clientX, y: event.clientY });
        /* Emits a change and input event if the value changed. */
        this._emitInputEvent();
        this._emitValueIfChanged();
    };
    MdSlider.prototype._onSlide = function (event) {
        if (this.disabled) {
            return;
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
        // Native range elements always emit `input` events when the value changed while sliding.
        this._emitInputEvent();
    };
    MdSlider.prototype._onSlideStart = function (event) {
        if (this.disabled) {
            return;
        }
        // Simulate mouseenter in case this is a mobile device.
        this._onMouseenter();
        event.preventDefault();
        this._isSliding = true;
        this._isActive = true;
        this._renderer.addFocus();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
    };
    MdSlider.prototype._onSlideEnd = function () {
        this._isSliding = false;
        this._emitValueIfChanged();
    };
    MdSlider.prototype._onBlur = function () {
        this._isActive = false;
        this.onTouched();
    };
    MdSlider.prototype._onKeydown = function (event) {
        if (this.disabled) {
            return;
        }
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
                this._increment(this.direction == 'rtl' ? 1 : -1);
                break;
            case UP_ARROW:
                this._increment(1);
                break;
            case RIGHT_ARROW:
                // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
                this._increment(this.direction == 'rtl' ? -1 : 1);
                break;
            case DOWN_ARROW:
                this._increment(-1);
                break;
            default:
                // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
                // it.
                return;
        }
        this._isSliding = true;
        event.preventDefault();
    };
    MdSlider.prototype._onKeyup = function () {
        this._isSliding = false;
    };
    /** Increments the slider by the given number of steps (negative number decrements). */
    MdSlider.prototype._increment = function (numSteps) {
        this.value = this._clamp(this.value + this.step * numSteps, this.min, this.max);
        this._emitInputEvent();
        this._emitValueIfChanged();
    };
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    MdSlider.prototype._updateValueFromPosition = function (pos) {
        if (!this._sliderDimensions) {
            return;
        }
        var offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        var size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        var posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        var percent = this._clamp((posComponent - offset) / size);
        if (this.invertMouseCoords) {
            percent = 1 - percent;
        }
        var exactValue = this._calculateValue(percent);
        // This calculation finds the closest step by finding the closest whole number divisible by the
        // step relative to the min.
        var closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
        // The value needs to snap to the min and max.
        this.value = this._clamp(closestValue, this.min, this.max);
    };
    /** Emits a change event if the current value is different from the last emitted value. */
    MdSlider.prototype._emitValueIfChanged = function () {
        if (this.value != this._lastChangeValue) {
            var event_1 = this._createChangeEvent();
            this._lastChangeValue = this.value;
            this._controlValueAccessorChangeFn(this.value);
            this.change.emit(event_1);
        }
    };
    /** Emits an input event when the current value is different from the last emitted value. */
    MdSlider.prototype._emitInputEvent = function () {
        if (this.value != this._lastInputValue) {
            var event_2 = this._createChangeEvent();
            this._lastInputValue = this.value;
            this.input.emit(event_2);
        }
    };
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    MdSlider.prototype._updateTickIntervalPercent = function () {
        if (!this.tickInterval) {
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
    MdSlider.prototype._createChangeEvent = function (value) {
        if (value === void 0) { value = this.value; }
        var event = new MdSliderChange();
        event.source = this;
        event.value = value;
        return event;
    };
    /** Calculates the percentage of the slider that a value is. */
    MdSlider.prototype._calculatePercentage = function (value) {
        return (value - this.min) / (this.max - this.min);
    };
    /** Calculates the value a percentage of the slider corresponds to. */
    MdSlider.prototype._calculateValue = function (percentage) {
        return this.min + percentage * (this.max - this.min);
    };
    /** Return a number between two numbers. */
    MdSlider.prototype._clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    MdSlider.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Registers a callback to eb triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    MdSlider.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    MdSlider.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    MdSlider.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdSlider.prototype, "disabled", null);
    __decorate([
        Input('thumbLabel'), 
        __metadata('design:type', Boolean)
    ], MdSlider.prototype, "thumbLabel", null);
    __decorate([
        Input('thumb-label'), 
        __metadata('design:type', Boolean)
    ], MdSlider.prototype, "_thumbLabelDeprecated", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "step", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "tickInterval", null);
    __decorate([
        Input('tick-interval'), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "_tickIntervalDeprecated", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "value", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "min", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "max", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "invert", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "vertical", null);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "change", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "input", void 0);
    MdSlider = __decorate([
        Component({selector: 'md-slider, mat-slider',
            providers: [MD_SLIDER_VALUE_ACCESSOR],
            host: {
                '[class.mat-slider]': 'true',
                '(blur)': '_onBlur()',
                '(click)': '_onClick($event)',
                '(keydown)': '_onKeydown($event)',
                '(keyup)': '_onKeyup()',
                '(mouseenter)': '_onMouseenter()',
                '(slide)': '_onSlide($event)',
                '(slideend)': '_onSlideEnd()',
                '(slidestart)': '_onSlideStart($event)',
                'role': 'slider',
                'tabindex': '0',
                '[attr.aria-disabled]': 'disabled',
                '[attr.aria-valuemax]': 'max',
                '[attr.aria-valuemin]': 'min',
                '[attr.aria-valuenow]': 'value',
                '[class.mat-slider-active]': '_isActive',
                '[class.mat-slider-disabled]': 'disabled',
                '[class.mat-slider-has-ticks]': 'tickInterval',
                '[class.mat-slider-horizontal]': '!vertical',
                '[class.mat-slider-axis-inverted]': 'invertAxis',
                '[class.mat-slider-sliding]': '_isSliding',
                '[class.mat-slider-thumb-label-showing]': 'thumbLabel',
                '[class.mat-slider-vertical]': 'vertical',
                '[class.mat-slider-min-value]': '_isMinValue',
                '[class.mat-slider-hide-last-tick]': '_isMinValue && _thumbGap && invertAxis',
            },
            template: "<div class=\"mat-slider-wrapper\"><div class=\"mat-slider-track-wrapper\"><div class=\"mat-slider-track-background\" [ngStyle]=\"trackBackgroundStyles\"></div><div class=\"mat-slider-track-fill\" [ngStyle]=\"trackFillStyles\"></div></div><div class=\"mat-slider-ticks-container\" [ngStyle]=\"ticksContainerStyles\"><div class=\"mat-slider-ticks\" [ngStyle]=\"ticksStyles\"></div></div><div class=\"mat-slider-thumb-container\" [ngStyle]=\"thumbContainerStyles\"><div class=\"mat-slider-thumb\"></div><div class=\"mat-slider-thumb-label\"><span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span></div></div></div>",
            styles: [".mat-slider-track-background,.mat-slider-track-fill{transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:0;vertical-align:middle}.mat-slider-wrapper{position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0}.mat-slider-track-background{position:absolute;transform-origin:100% 100%}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{box-sizing:border-box;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-disabled .mat-slider-ticks{opacity:0}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(.7);transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),border-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform .4s cubic-bezier(.25,.8,.25,1),border-radius .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-label-text{z-index:1;font-size:12px;font-weight:700;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-sliding .mat-slider-thumb-container,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-track-fill{transition-duration:0s}.mat-slider-has-ticks .mat-slider-wrapper::after{content:'';position:absolute;border:0 solid rgba(0,0,0,.6);opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-active .mat-slider-thumb-label-text,.mat-slider-has-ticks.mat-slider-active .mat-slider-ticks,.mat-slider-has-ticks.mat-slider-active:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.mat-slider-active .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-active.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.mat-slider-active .mat-slider-thumb-label{border-radius:50% 50% 0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.mat-slider-horizontal .mat-slider-ticks{background:repeating-linear-gradient(to right,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);background:-moz-repeating-linear-gradient(.0001deg,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);background-clip:content-box;height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.mat-slider-active .mat-slider-thumb-label{transform:rotate(45deg)}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.mat-slider-vertical .mat-slider-ticks{background:repeating-linear-gradient(to bottom,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);background-clip:content-box;width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.mat-slider-active .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background,[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}"],
            encapsulation: ViewEncapsulation.None,
        }),
        __param(0, Optional()), 
        __metadata('design:paramtypes', [Dir, ElementRef])
    ], MdSlider);
    return MdSlider;
}());
/**
 * Renderer class in order to keep all dom manipulation in one place and outside of the main class.
 * @docs-private
 */
export var SliderRenderer = (function () {
    function SliderRenderer(elementRef) {
        this._sliderElement = elementRef.nativeElement;
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    SliderRenderer.prototype.getSliderDimensions = function () {
        var wrapperElement = this._sliderElement.querySelector('.mat-slider-wrapper');
        return wrapperElement.getBoundingClientRect();
    };
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    SliderRenderer.prototype.addFocus = function () {
        this._sliderElement.focus();
    };
    return SliderRenderer;
}());
export var MdSliderModule = (function () {
    function MdSliderModule() {
    }
    /** @deprecated */
    MdSliderModule.forRoot = function () {
        return {
            ngModule: MdSliderModule,
            providers: []
        };
    };
    MdSliderModule = __decorate([
        NgModule({
            imports: [CommonModule, FormsModule, CompatibilityModule],
            exports: [MdSlider, CompatibilityModule],
            declarations: [MdSlider],
            providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
        }), 
        __metadata('design:paramtypes', [])
    ], MdSliderModule);
    return MdSliderModule;
}());
//# sourceMappingURL=slider.js.map