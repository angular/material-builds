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
import { GestureConfig, coerceBooleanProperty, coerceNumberProperty, DefaultStyleCompatibilityModeModule } from '../core';
import { Dir } from '../core/rtl/dir';
import { CommonModule } from '@angular/common';
import { PAGE_UP, PAGE_DOWN, END, HOME, LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW } from '../core/keyboard/keycodes';
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
var MIN_AUTO_TICK_SEPARATION = 30;
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
        /** The last value for which a change event was emitted. */
        this._lastEmittedValue = null;
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
        set: function (v) { this._step = coerceNumberProperty(v, this._step); },
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
        /** The miniumum value that the slider can have. */
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
    Object.defineProperty(MdSlider.prototype, "trackFillStyles", {
        /** CSS styles for the track fill element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            return {
                'transform': "scale" + axis + "(" + this.percent + ")"
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
            return {
                'backgroundSize': backgroundSize,
                // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
                'transform': "translateZ(0) translate" + axis + "(" + sign + tickSize / 2 + "%)" + rotate
            };
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
        this._emitValueIfChanged();
    };
    MdSlider.prototype._onSlide = function (event) {
        if (this.disabled) {
            return;
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
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
        event.preventDefault();
    };
    /** Increments the slider by the given number of steps (negative number decrements). */
    MdSlider.prototype._increment = function (numSteps) {
        this.value = this._clamp(this.value + this.step * numSteps, this.min, this.max);
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
        if (this.value != this._lastEmittedValue) {
            var event_1 = new MdSliderChange();
            event_1.source = this;
            event_1.value = this.value;
            this._lastEmittedValue = this.value;
            this._controlValueAccessorChangeFn(this.value);
            this.change.emit(event_1);
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
    MdSlider = __decorate([
        Component({selector: 'md-slider, mat-slider',
            providers: [MD_SLIDER_VALUE_ACCESSOR],
            host: {
                '(blur)': '_onBlur()',
                '(click)': '_onClick($event)',
                '(keydown)': '_onKeydown($event)',
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
                '[class.md-slider-active]': '_isActive',
                '[class.md-slider-disabled]': 'disabled',
                '[class.md-slider-has-ticks]': 'tickInterval',
                '[class.md-slider-horizontal]': '!vertical',
                '[class.md-slider-axis-inverted]': 'invertAxis',
                '[class.md-slider-sliding]': '_isSliding',
                '[class.md-slider-thumb-label-showing]': 'thumbLabel',
                '[class.md-slider-vertical]': 'vertical',
            },
            template: "<div class=\"md-slider-track\"><div class=\"md-slider-track-fill\" [ngStyle]=\"trackFillStyles\"></div><div class=\"md-slider-ticks-container\" [ngStyle]=\"ticksContainerStyles\"><div class=\"md-slider-ticks\" [ngStyle]=\"ticksStyles\"></div></div><div class=\"md-slider-thumb-container\" [ngStyle]=\"thumbContainerStyles\"><div class=\"md-slider-thumb\"></div><div class=\"md-slider-thumb-label\"><span class=\"md-slider-thumb-label-text\">{{value}}</span></div></div></div>",
            styles: ["md-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:0;vertical-align:middle}.md-slider-track{position:absolute}.md-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.md-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.md-slider-ticks{opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.md-slider-thumb,.md-slider-thumb-container{transition:transform .4s cubic-bezier(.25,.8,.25,1);position:absolute}.md-slider-thumb-container{z-index:1}.md-slider-thumb{right:-10px;bottom:-10px;width:20px;height:20px;border-radius:50%;transform:scale(.7)}.md-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:.3s cubic-bezier(.35,0,.25,1);transition-property:transform,border-radius}.md-slider-thumb-label-text{z-index:1;font-size:12px;font-weight:700;opacity:0;transition:opacity .3s cubic-bezier(.35,0,.25,1)}.md-slider-sliding .md-slider-thumb-container,.md-slider-sliding .md-slider-track-fill{transition-duration:0s}.md-slider-has-ticks .md-slider-track::after{content:'';position:absolute;border:0 solid rgba(0,0,0,.6);opacity:0;transition:opacity .3s cubic-bezier(.35,0,.25,1)}.md-slider-active .md-slider-thumb-label-text,.md-slider-has-ticks.md-slider-active .md-slider-ticks,.md-slider-has-ticks.md-slider-active .md-slider-track::after,.md-slider-has-ticks:hover .md-slider-ticks,.md-slider-has-ticks:hover .md-slider-track::after{opacity:1}.md-slider-thumb-label-showing .md-slider-thumb-label{display:flex}.md-slider-axis-inverted .md-slider-track-fill{transform-origin:100% 100%}.md-slider-active .md-slider-thumb{transform:scale(1)}.md-slider-active.md-slider-thumb-label-showing .md-slider-thumb{transform:scale(0)}.md-slider-active .md-slider-thumb-label{border-radius:50% 50% 0}.md-slider-horizontal{height:48px;min-width:128px}.md-slider-horizontal .md-slider-track{height:2px;top:23px;left:8px;right:8px}.md-slider-horizontal .md-slider-track::after{height:2px;border-left-width:2px;right:0}.md-slider-horizontal .md-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.md-slider-horizontal .md-slider-ticks-container{height:2px;width:100%}.md-slider-horizontal .md-slider-ticks{background:repeating-linear-gradient(to right,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);background:-moz-repeating-linear-gradient(.0001deg,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);height:2px;width:100%}.md-slider-horizontal .md-slider-thumb-container{width:100%;height:0;top:50%}.md-slider-horizontal .md-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.4) rotate(45deg)}.md-slider-horizontal .md-slider-thumb-label-text{transform:rotate(-45deg)}.md-slider-horizontal.md-slider-active .md-slider-thumb-label{transform:rotate(45deg)}.md-slider-vertical{width:48px;min-height:128px}.md-slider-vertical .md-slider-track{width:2px;top:8px;bottom:8px;left:23px}.md-slider-vertical .md-slider-track::after{width:2px;border-top-width:2px;bottom:0}.md-slider-vertical .md-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.md-slider-vertical .md-slider-ticks-container{width:2px;height:100%}.md-slider-vertical .md-slider-ticks{background:repeating-linear-gradient(to bottom,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);width:2px;height:100%}.md-slider-vertical .md-slider-thumb-container{height:100%;width:0;left:50%}.md-slider-vertical .md-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(.4) rotate(-45deg)}.md-slider-vertical .md-slider-thumb-label-text{transform:rotate(45deg)}.md-slider-vertical.md-slider-active .md-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .md-slider-track::after{left:0;right:auto}[dir=rtl] .md-slider-horizontal .md-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .md-slider-horizontal.md-slider-axis-inverted .md-slider-track-fill{transform-origin:0 0}"],
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
        var trackElement = this._sliderElement.querySelector('.md-slider-track');
        return trackElement.getBoundingClientRect();
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
    MdSliderModule.forRoot = function () {
        return {
            ngModule: MdSliderModule,
            providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
        };
    };
    MdSliderModule = __decorate([
        NgModule({
            imports: [CommonModule, FormsModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSlider, DefaultStyleCompatibilityModeModule],
            declarations: [MdSlider],
            providers: [
                { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSliderModule);
    return MdSliderModule;
}());

//# sourceMappingURL=slider.js.map
