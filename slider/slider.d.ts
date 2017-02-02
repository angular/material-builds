import { ModuleWithProviders, ElementRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { HammerInput } from '../core';
import { Dir } from '../core/rtl/dir';
/**
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
export declare const MD_SLIDER_VALUE_ACCESSOR: any;
/** A simple change event emitted by the MdSlider component. */
export declare class MdSliderChange {
    source: MdSlider;
    value: number;
}
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export declare class MdSlider implements ControlValueAccessor {
    private _dir;
    /** A renderer to handle updating the slider's thumb and fill track. */
    private _renderer;
    /** The dimensions of the slider. */
    private _sliderDimensions;
    private _disabled;
    /** Whether or not the slider is disabled. */
    disabled: boolean;
    private _thumbLabel;
    /** Whether or not to show the thumb label. */
    thumbLabel: boolean;
    /** @deprecated */
    _thumbLabelDeprecated: boolean;
    private _controlValueAccessorChangeFn;
    /** The last values for which a change or input event was emitted. */
    private _lastChangeValue;
    private _lastInputValue;
    /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
    onTouched: () => any;
    /**
     * Whether or not the thumb is sliding.
     * Used to determine if there should be a transition for the thumb and fill track.
     */
    _isSliding: boolean;
    /**
     * Whether or not the slider is active (clicked or sliding).
     * Used to shrink and grow the thumb as according to the Material Design spec.
     */
    _isActive: boolean;
    /** Decimal places to round to, based on the step amount. */
    private _roundLabelTo;
    private _step;
    /** The values at which the thumb will snap. */
    step: number;
    private _tickInterval;
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    tickInterval: number | "auto";
    /** @deprecated */
    _tickIntervalDeprecated: number | "auto";
    private _tickIntervalPercent;
    /** The size of a tick interval as a percentage of the size of the track. */
    readonly tickIntervalPercent: number;
    private _percent;
    /** The percentage of the slider that coincides with the value. */
    readonly percent: number;
    private _value;
    /** Value of the slider. */
    value: number;
    private _min;
    /** The minimum value that the slider can have. */
    min: number;
    private _max;
    /** The maximum value that the slider can have. */
    max: number;
    /** Whether the slider is inverted. */
    invert: any;
    private _invert;
    /** Whether the slider is vertical. */
    vertical: any;
    private _vertical;
    /** The value to be used for display purposes. */
    readonly displayValue: string | number;
    /**
     * Whether the axis of the slider is inverted.
     * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
     */
    readonly invertAxis: any;
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    readonly invertMouseCoords: any;
    /** Whether the slider is at its minimum value. */
    readonly _isMinValue: boolean;
    /**
     * The amount of space to leave between the slider thumb and the track fill & track background
     * elements.
     */
    readonly _thumbGap: number;
    /** CSS styles for the track background element. */
    readonly trackBackgroundStyles: {
        [key: string]: string;
    };
    /** CSS styles for the track fill element. */
    readonly trackFillStyles: {
        [key: string]: string;
    };
    /** CSS styles for the ticks container element. */
    readonly ticksContainerStyles: {
        [key: string]: string;
    };
    /** CSS styles for the ticks element. */
    readonly ticksStyles: {
        [key: string]: string;
    };
    readonly thumbContainerStyles: {
        [key: string]: string;
    };
    /** The language direction for this slider element. */
    readonly direction: string;
    /** Event emitted when the slider value has changed. */
    change: EventEmitter<MdSliderChange>;
    /** Event emitted when the slider thumb moves. */
    input: EventEmitter<MdSliderChange>;
    constructor(_dir: Dir, elementRef: ElementRef);
    _onMouseenter(): void;
    _onClick(event: MouseEvent): void;
    _onSlide(event: HammerInput): void;
    _onSlideStart(event: HammerInput): void;
    _onSlideEnd(): void;
    _onBlur(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(): void;
    /** Increments the slider by the given number of steps (negative number decrements). */
    private _increment(numSteps);
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    private _updateValueFromPosition(pos);
    /** Emits a change event if the current value is different from the last emitted value. */
    private _emitValueIfChanged();
    /** Emits an input event when the current value is different from the last emitted value. */
    private _emitInputEvent();
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    private _updateTickIntervalPercent();
    /** Creates a slider change object from the specified value. */
    private _createChangeEvent(value?);
    /** Calculates the percentage of the slider that a value is. */
    private _calculatePercentage(value);
    /** Calculates the value a percentage of the slider corresponds to. */
    private _calculateValue(percentage);
    /** Return a number between two numbers. */
    private _clamp(value, min?, max?);
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to eb triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled: boolean): void;
}
/**
 * Renderer class in order to keep all dom manipulation in one place and outside of the main class.
 * @docs-private
 */
export declare class SliderRenderer {
    private _sliderElement;
    constructor(elementRef: ElementRef);
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    getSliderDimensions(): ClientRect;
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    addFocus(): void;
}
export declare class MdSliderModule {
    /** @deprecated */
    static forRoot(): ModuleWithProviders;
}
