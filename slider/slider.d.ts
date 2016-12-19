import { ModuleWithProviders, ElementRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
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
export declare class MdSlider implements ControlValueAccessor {
    private _dir;
    /** A renderer to handle updating the slider's thumb and fill track. */
    private _renderer;
    /** The dimensions of the slider. */
    private _sliderDimensions;
    /** Whether or not the slider is disabled. */
    private _disabled;
    disabled: boolean;
    /** Whether or not to show the thumb label. */
    private _thumbLabel;
    thumbLabel: boolean;
    /** @deprecated */
    _thumbLabelDeprecated: boolean;
    private _controlValueAccessorChangeFn;
    /** The last value for which a change event was emitted. */
    private _lastEmittedValue;
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
    /** The values at which the thumb will snap. */
    private _step;
    step: number;
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    private _tickInterval;
    tickInterval: number | "auto";
    /** @deprecated */
    _tickIntervalDeprecated: number | "auto";
    /** The size of a tick interval as a percentage of the size of the track. */
    private _tickIntervalPercent;
    readonly tickIntervalPercent: number;
    /** The percentage of the slider that coincides with the value. */
    private _percent;
    readonly percent: number;
    /** Value of the slider. */
    private _value;
    value: number;
    /** The miniumum value that the slider can have. */
    private _min;
    min: number;
    /** The maximum value that the slider can have. */
    private _max;
    max: number;
    /** Whether the slider is inverted. */
    invert: any;
    private _invert;
    /** Whether the slider is vertical. */
    vertical: any;
    private _vertical;
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
    change: EventEmitter<MdSliderChange>;
    constructor(_dir: Dir, elementRef: ElementRef);
    _onMouseenter(): void;
    _onClick(event: MouseEvent): void;
    _onSlide(event: HammerInput): void;
    _onSlideStart(event: HammerInput): void;
    _onSlideEnd(): void;
    _onBlur(): void;
    _onKeydown(event: KeyboardEvent): void;
    /** Increments the slider by the given number of steps (negative number decrements). */
    private _increment(numSteps);
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    private _updateValueFromPosition(pos);
    /** Emits a change event if the current value is different from the last emitted value. */
    private _emitValueIfChanged();
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    private _updateTickIntervalPercent();
    /** Calculates the percentage of the slider that a value is. */
    private _calculatePercentage(value);
    /** Calculates the value a percentage of the slider corresponds to. */
    private _calculateValue(percentage);
    /** Return a number between two numbers. */
    private _clamp(value, min?, max?);
    /** Implemented as part of ControlValueAccessor. */
    writeValue(value: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: (value: any) => void): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: any): void;
    /** Implemented as part of ControlValueAccessor. */
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
    static forRoot(): ModuleWithProviders;
}
