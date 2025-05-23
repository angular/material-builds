import { Directionality } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { ChangeDetectorRef, WritableSignal, AfterViewInit, OnDestroy, NgZone, ElementRef, QueryList, EventEmitter } from '@angular/core';
import { T as ThemePalette } from '../palette.d-BSSFKjO6.js';
import { R as RippleGlobalOptions, M as MatRipple } from '../ripple.d-BT30YVLB.js';
import { ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { M as MatCommonModule } from '../common-module.d-C8xzHJDr.js';
import { M as MatRippleModule } from '../index.d-C5neTPvr.js';
import '@angular/cdk/platform';

/**
 * Thumb types: range slider has two thumbs (START, END) whereas single point
 * slider only has one thumb (END).
 */
declare enum _MatThumb {
    START = 1,
    END = 2
}
/** Tick mark enum, for discrete sliders. */
declare enum _MatTickMark {
    ACTIVE = 0,
    INACTIVE = 1
}
/** Represents a drag event emitted by the MatSlider component. */
interface MatSliderDragEvent {
    /** The MatSliderThumb that was interacted with. */
    source: _MatSliderThumb;
    /** The MatSlider that was interacted with. */
    parent: _MatSlider;
    /** The current value of the slider. */
    value: number;
}
/**
 * A simple change event emitted by the MatSlider component.
 * @deprecated Use event bindings directly on the MatSliderThumbs for `change` and `input` events. See https://v17.material.angular.dev/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
declare class MatSliderChange {
    /** The MatSliderThumb that was interacted with. */
    source: _MatSliderThumb;
    /** The MatSlider that was interacted with. */
    parent: _MatSlider;
    /** The new value of the source slider. */
    value: number;
}
interface _MatSlider {
    /** Whether the given pointer event occurred within the bounds of the slider pointer's DOM Rect. */
    _isCursorOnSliderThumb(event: PointerEvent, rect: DOMRect): boolean;
    /** Gets the slider thumb input of the given thumb position. */
    _getInput(thumbPosition: _MatThumb): _MatSliderThumb | _MatSliderRangeThumb | undefined;
    /** Gets the slider thumb HTML input element of the given thumb position. */
    _getThumb(thumbPosition: _MatThumb): _MatSliderVisualThumb;
    /** The minimum value that the slider can have. */
    min: number;
    /** The maximum value that the slider can have. */
    max: number;
    /** The amount that slider values can increment or decrement by. */
    step: number;
    /** Whether the slider is disabled. */
    disabled: boolean;
    /** Whether the slider is a range slider. */
    _isRange: boolean;
    /** Whether the slider is rtl. */
    _isRtl: boolean;
    /** The stored width of the host element's bounding client rect. */
    _cachedWidth: number;
    /** The stored width of the host element's bounding client rect. */
    _cachedLeft: number;
    /**
     * The padding of the native slider input. This is added in order to make the region where the
     * thumb ripple extends past the end of the slider track clickable.
     */
    _inputPadding: number;
    /** The radius of the visual slider's ripple. */
    _rippleRadius: number;
    /** The global configuration for `matRipple` instances. */
    readonly _globalRippleOptions: RippleGlobalOptions | null;
    /** Whether animations have been disabled. */
    _noopAnimations: boolean;
    /** Whether or not the slider should use animations. */
    _hasAnimation: boolean;
    /** Triggers UI updates that are needed after a slider input value has changed. */
    _onValueChange: (source: _MatSliderThumb) => void;
    /** Triggers UI updates that are needed after the slider thumb position has changed. */
    _onTranslateXChange: (source: _MatSliderThumb) => void;
    /** Updates the stored slider dimensions using the current bounding client rect. */
    _updateDimensions: () => void;
    /** Updates the scale on the active portion of the track. */
    _updateTrackUI: (source: _MatSliderThumb) => void;
    /** Used to set the transition duration for thumb and track animations. */
    _setTransition: (withAnimation: boolean) => void;
    _cdr: ChangeDetectorRef;
}
interface _MatSliderThumb {
    /** The minimum value that the slider can have. */
    min: number;
    /** The maximum value that the slider can have. */
    max: number;
    /** The amount that slider values can increment or decrement by. */
    step: number;
    /** The current value of this slider input. */
    value: number;
    /** The current translateX in px of the slider visual thumb. */
    translateX: number;
    /** Indicates whether this thumb is the start or end thumb. */
    thumbPosition: _MatThumb;
    /** Similar to percentage but calcualted using translateX relative to the total track width. */
    fillPercentage: number;
    /** Whether the slider is disabled. */
    disabled: boolean;
    /** The host native HTML input element. */
    _hostElement: HTMLInputElement;
    /** Whether the input is currently focused (either by tab or after clicking). */
    _isFocused: boolean;
    /** The aria-valuetext string representation of the input's value. */
    _valuetext: WritableSignal<string>;
    /**
     * Indicates whether UI updates should be skipped.
     *
     * This flag is used to avoid flickering
     * when correcting values on pointer up/down.
     */
    _skipUIUpdate: boolean;
    /** Handles the initialization of properties for the slider input. */
    initProps: () => void;
    /** Handles UI initialization controlled by this slider input. */
    initUI: () => void;
    /** Calculates the visual thumb's translateX based on the slider input's current value. */
    _calcTranslateXByValue: () => number;
    /** Updates the visual thumb based on the slider input's current value. */
    _updateThumbUIByValue: () => void;
    /**
     * Sets the slider input to disproportionate dimensions to allow for touch
     * events to be captured on touch devices.
     */
    _updateWidthInactive: () => void;
    /**
     * Used to set the slider width to the correct
     * dimensions while the user is dragging.
     */
    _updateWidthActive: () => void;
}
interface _MatSliderRangeThumb extends _MatSliderThumb {
    /** Whether this slider corresponds to the input on the left hand side. */
    _isLeftThumb: boolean;
    /**
     * Gets the sibling MatSliderRangeThumb.
     * Returns undefined if it is too early in Angular's life cycle.
     */
    getSibling: () => _MatSliderRangeThumb | undefined;
    /** Used to cache whether this slider input corresponds to the visual left thumb. */
    _setIsLeftThumb: () => void;
    /** Updates the input styles to control whether it is pinned to the start or end of the mat-slider. */
    _updateStaticStyles: () => void;
    /** Updates the min and max properties of this slider input according to it's sibling. */
    _updateMinMax: () => void;
}
interface _MatSliderVisualThumb {
    /** The MatRipple for this slider thumb. */
    _ripple: MatRipple;
    /** Whether the slider thumb is currently being pressed. */
    _isActive: boolean;
    /** The host native HTML input element. */
    _hostElement: HTMLElement;
    /** Shows the value indicator ui. */
    _showValueIndicator: () => void;
    /** Hides the value indicator ui. */
    _hideValueIndicator: () => void;
    /** Whether the slider visual thumb is currently showing any ripple. */
    _isShowingAnyRipple: () => boolean;
}

/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
declare class MatSlider implements AfterViewInit, OnDestroy, _MatSlider {
    readonly _ngZone: NgZone;
    readonly _cdr: ChangeDetectorRef;
    readonly _elementRef: ElementRef<HTMLElement>;
    readonly _dir: Directionality | null;
    readonly _globalRippleOptions: RippleGlobalOptions | null;
    /** The active portion of the slider track. */
    _trackActive: ElementRef<HTMLElement>;
    /** The slider thumb(s). */
    _thumbs: QueryList<_MatSliderVisualThumb>;
    /** The sliders hidden range input(s). */
    _input: _MatSliderThumb;
    /** The sliders hidden range input(s). */
    _inputs: QueryList<_MatSliderRangeThumb>;
    /** Whether the slider is disabled. */
    get disabled(): boolean;
    set disabled(v: boolean);
    private _disabled;
    /** Whether the slider displays a numeric value label upon pressing the thumb. */
    get discrete(): boolean;
    set discrete(v: boolean);
    private _discrete;
    /** Whether the slider displays tick marks along the slider track. */
    showTickMarks: boolean;
    /** The minimum value that the slider can have. */
    get min(): number;
    set min(v: number);
    private _min;
    /**
     * Theme color of the slider. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/slider/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /** Whether ripples are disabled in the slider. */
    disableRipple: boolean;
    private _updateMin;
    private _updateMinRange;
    private _updateMinNonRange;
    /** The maximum value that the slider can have. */
    get max(): number;
    set max(v: number);
    private _max;
    private _updateMax;
    private _updateMaxRange;
    private _updateMaxNonRange;
    /** The values at which the thumb will snap. */
    get step(): number;
    set step(v: number);
    private _step;
    private _updateStep;
    private _updateStepRange;
    private _updateStepNonRange;
    /**
     * Function that will be used to format the value before it is displayed
     * in the thumb label. Can be used to format very large number in order
     * for them to fit into the slider thumb.
     */
    displayWith: (value: number) => string;
    /** Used to keep track of & render the active & inactive tick marks on the slider track. */
    _tickMarks: _MatTickMark[];
    /** Whether animations have been disabled. */
    _noopAnimations: boolean;
    /** Subscription to changes to the directionality (LTR / RTL) context for the application. */
    private _dirChangeSubscription;
    /** Observer used to monitor size changes in the slider. */
    private _resizeObserver;
    _cachedWidth: number;
    _cachedLeft: number;
    _rippleRadius: number;
    /** @docs-private */
    protected startValueIndicatorText: string;
    /** @docs-private */
    protected endValueIndicatorText: string;
    _endThumbTransform: string;
    _startThumbTransform: string;
    _isRange: boolean;
    /** Whether the slider is rtl. */
    _isRtl: boolean;
    private _hasViewInitialized;
    /**
     * The width of the tick mark track.
     * The tick mark track width is different from full track width
     */
    _tickMarkTrackWidth: number;
    _hasAnimation: boolean;
    private _resizeTimer;
    private _platform;
    constructor(...args: unknown[]);
    /** The radius of the native slider's knob. AFAIK there is no way to avoid hardcoding this. */
    _knobRadius: number;
    _inputPadding: number;
    ngAfterViewInit(): void;
    private _initUINonRange;
    private _initUIRange;
    ngOnDestroy(): void;
    /** Handles updating the slider ui after a dir change. */
    private _onDirChange;
    private _onDirChangeRange;
    private _onDirChangeNonRange;
    /** Starts observing and updating the slider if the host changes its size. */
    private _observeHostResize;
    /** Whether any of the thumbs are currently active. */
    private _isActive;
    private _getValue;
    private _skipUpdate;
    /** Stores the slider dimensions. */
    _updateDimensions(): void;
    /** Sets the styles for the active portion of the track. */
    _setTrackActiveStyles(styles: {
        left: string;
        right: string;
        transform: string;
        transformOrigin: string;
    }): void;
    /** Returns the translateX positioning for a tick mark based on it's index. */
    _calcTickMarkTransform(index: number): string;
    _onTranslateXChange(source: _MatSliderThumb): void;
    _onTranslateXChangeBySideEffect(input1: _MatSliderRangeThumb, input2: _MatSliderRangeThumb): void;
    _onValueChange(source: _MatSliderThumb): void;
    _onMinMaxOrStepChange(): void;
    _onResize(): void;
    /** Whether or not the slider thumbs overlap. */
    private _thumbsOverlap;
    /** Returns true if the slider knobs are overlapping one another. */
    private _areThumbsOverlapping;
    /**
     * Updates the class names of overlapping slider thumbs so
     * that the current active thumb is styled to be on "top".
     */
    private _updateOverlappingThumbClassNames;
    /** Updates the UI of slider thumbs when they begin or stop overlapping. */
    private _updateOverlappingThumbUI;
    /** Updates the translateX of the given thumb. */
    _updateThumbUI(source: _MatSliderThumb): void;
    /** Updates the value indicator tooltip ui for the given thumb. */
    _updateValueIndicatorUI(source: _MatSliderThumb): void;
    /** Updates all value indicator UIs in the slider. */
    private _updateValueIndicatorUIs;
    /** Updates the width of the tick mark track. */
    private _updateTickMarkTrackUI;
    /** Updates the scale on the active portion of the track. */
    _updateTrackUI(source: _MatSliderThumb): void;
    private _updateTrackUIRange;
    private _updateTrackUINonRange;
    /** Updates the dots along the slider track. */
    _updateTickMarkUI(): void;
    private _updateTickMarkUINonRange;
    private _updateTickMarkUIRange;
    /** Gets the slider thumb input of the given thumb position. */
    _getInput(thumbPosition: _MatThumb): _MatSliderThumb | _MatSliderRangeThumb | undefined;
    /** Gets the slider thumb HTML input element of the given thumb position. */
    _getThumb(thumbPosition: _MatThumb): _MatSliderVisualThumb;
    _setTransition(withAnimation: boolean): void;
    /** Whether the given pointer event occurred within the bounds of the slider pointer's DOM Rect. */
    _isCursorOnSliderThumb(event: PointerEvent, rect: DOMRect): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSlider, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSlider, "mat-slider", ["matSlider"], { "disabled": { "alias": "disabled"; "required": false; }; "discrete": { "alias": "discrete"; "required": false; }; "showTickMarks": { "alias": "showTickMarks"; "required": false; }; "min": { "alias": "min"; "required": false; }; "color": { "alias": "color"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "max": { "alias": "max"; "required": false; }; "step": { "alias": "step"; "required": false; }; "displayWith": { "alias": "displayWith"; "required": false; }; }, {}, ["_input", "_inputs"], ["*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_discrete: unknown;
    static ngAcceptInputType_showTickMarks: unknown;
    static ngAcceptInputType_min: unknown;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_max: unknown;
    static ngAcceptInputType_step: unknown;
}

/**
 * The visual slider thumb.
 *
 * Handles the slider thumb ripple states (hover, focus, and active),
 * and displaying the value tooltip on discrete sliders.
 * @docs-private
 */
declare class MatSliderVisualThumb implements _MatSliderVisualThumb, AfterViewInit, OnDestroy {
    readonly _cdr: ChangeDetectorRef;
    private readonly _ngZone;
    private _slider;
    private _renderer;
    private _listenerCleanups;
    /** Whether the slider displays a numeric value label upon pressing the thumb. */
    discrete: boolean;
    /** Indicates which slider thumb this input corresponds to. */
    thumbPosition: _MatThumb;
    /** The display value of the slider thumb. */
    valueIndicatorText: string;
    /** The MatRipple for this slider thumb. */
    readonly _ripple: MatRipple;
    /** The slider thumb knob. */
    _knob: ElementRef<HTMLElement>;
    /** The slider thumb value indicator container. */
    _valueIndicatorContainer: ElementRef<HTMLElement>;
    /** The slider input corresponding to this slider thumb. */
    private _sliderInput;
    /** The native html element of the slider input corresponding to this thumb. */
    private _sliderInputEl;
    /** The RippleRef for the slider thumbs hover state. */
    private _hoverRippleRef;
    /** The RippleRef for the slider thumbs focus state. */
    private _focusRippleRef;
    /** The RippleRef for the slider thumbs active state. */
    private _activeRippleRef;
    /** Whether the slider thumb is currently being hovered. */
    private _isHovered;
    /** Whether the slider thumb is currently being pressed. */
    _isActive: boolean;
    /** Whether the value indicator tooltip is visible. */
    _isValueIndicatorVisible: boolean;
    /** The host native HTML input element. */
    _hostElement: HTMLElement;
    private _platform;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private _onPointerMove;
    private _onMouseLeave;
    private _onFocus;
    private _onBlur;
    private _onDragStart;
    private _onDragEnd;
    /** Handles displaying the hover ripple. */
    private _showHoverRipple;
    /** Handles displaying the focus ripple. */
    private _showFocusRipple;
    /** Handles displaying the active ripple. */
    private _showActiveRipple;
    /** Whether the given rippleRef is currently fading in or visible. */
    private _isShowingRipple;
    /** Manually launches the slider thumb ripple using the specified ripple animation config. */
    private _showRipple;
    /**
     * Fades out the given ripple.
     * Also hides the value indicator if no ripple is showing.
     */
    private _hideRipple;
    /** Shows the value indicator ui. */
    _showValueIndicator(): void;
    /** Hides the value indicator ui. */
    _hideValueIndicator(): void;
    _getSibling(): _MatSliderVisualThumb;
    /** Gets the value indicator container's native HTML element. */
    _getValueIndicatorContainer(): HTMLElement | undefined;
    /** Gets the native HTML element of the slider thumb knob. */
    _getKnob(): HTMLElement;
    _isShowingAnyRipple(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSliderVisualThumb, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSliderVisualThumb, "mat-slider-visual-thumb", never, { "discrete": { "alias": "discrete"; "required": false; }; "thumbPosition": { "alias": "thumbPosition"; "required": false; }; "valueIndicatorText": { "alias": "valueIndicatorText"; "required": false; }; }, {}, never, never, true, never>;
}

/**
 * Directive that adds slider-specific behaviors to an input element inside `<mat-slider>`.
 * Up to two may be placed inside of a `<mat-slider>`.
 *
 * If one is used, the selector `matSliderThumb` must be used, and the outcome will be a normal
 * slider. If two are used, the selectors `matSliderStartThumb` and `matSliderEndThumb` must be
 * used, and the outcome will be a range slider with two slider thumbs.
 */
declare class MatSliderThumb implements _MatSliderThumb, OnDestroy, ControlValueAccessor {
    readonly _ngZone: NgZone;
    readonly _elementRef: ElementRef<HTMLInputElement>;
    readonly _cdr: ChangeDetectorRef;
    protected _slider: _MatSlider;
    private _platform;
    private _listenerCleanups;
    get value(): number;
    set value(value: number);
    /**
     * Handles programmatic value setting. This has been split out to
     * allow the range thumb to override it and add additional necessary logic.
     */
    protected _setValue(value: string): void;
    /** Event emitted when the `value` is changed. */
    readonly valueChange: EventEmitter<number>;
    /** Event emitted when the slider thumb starts being dragged. */
    readonly dragStart: EventEmitter<MatSliderDragEvent>;
    /** Event emitted when the slider thumb stops being dragged. */
    readonly dragEnd: EventEmitter<MatSliderDragEvent>;
    /**
     * The current translateX in px of the slider visual thumb.
     * @docs-private
     */
    get translateX(): number;
    set translateX(v: number);
    private _translateX;
    /**
     * Indicates whether this thumb is the start or end thumb.
     * @docs-private
     */
    thumbPosition: _MatThumb;
    /** @docs-private */
    get min(): number;
    set min(v: number);
    /** @docs-private */
    get max(): number;
    set max(v: number);
    get step(): number;
    set step(v: number);
    /** @docs-private */
    get disabled(): boolean;
    set disabled(v: boolean);
    /** The percentage of the slider that coincides with the value. */
    get percentage(): number;
    /** @docs-private */
    get fillPercentage(): number;
    /** The host native HTML input element. */
    _hostElement: HTMLInputElement;
    /** The aria-valuetext string representation of the input's value. */
    _valuetext: i0.WritableSignal<string>;
    /** The radius of a native html slider's knob. */
    _knobRadius: number;
    /** The distance in px from the start of the slider track to the first tick mark. */
    _tickMarkOffset: number;
    /** Whether user's cursor is currently in a mouse down state on the input. */
    _isActive: boolean;
    /** Whether the input is currently focused (either by tab or after clicking). */
    _isFocused: boolean;
    /** Used to relay updates to _isFocused to the slider visual thumbs. */
    private _setIsFocused;
    /**
     * Whether the initial value has been set.
     * This exists because the initial value cannot be immediately set because the min and max
     * must first be relayed from the parent MatSlider component, which can only happen later
     * in the component lifecycle.
     */
    private _hasSetInitialValue;
    /** The stored initial value. */
    _initialValue: string | undefined;
    /** Defined when a user is using a form control to manage slider value & validation. */
    private _formControl;
    /** Emits when the component is destroyed. */
    protected readonly _destroyed: Subject<void>;
    /**
     * Indicates whether UI updates should be skipped.
     *
     * This flag is used to avoid flickering
     * when correcting values on pointer up/down.
     */
    _skipUIUpdate: boolean;
    /** Callback called when the slider input value changes. */
    protected _onChangeFn: ((value: any) => void) | undefined;
    /** Callback called when the slider input has been touched. */
    private _onTouchedFn;
    /**
     * Whether the NgModel has been initialized.
     *
     * This flag is used to ignore ghost null calls to
     * writeValue which can break slider initialization.
     *
     * See https://github.com/angular/angular/issues/14988.
     */
    protected _isControlInitialized: boolean;
    constructor(...args: unknown[]);
    ngOnDestroy(): void;
    /** @docs-private */
    initProps(): void;
    /** @docs-private */
    initUI(): void;
    _initValue(): void;
    _getDefaultValue(): number;
    _onBlur(): void;
    _onFocus(): void;
    _onChange(): void;
    _onInput(): void;
    _onNgControlValueChange(): void;
    _onPointerDown(event: PointerEvent): void;
    /**
     * Corrects the value of the slider on pointer up/down.
     *
     * Called on pointer down and up because the value is set based
     * on the inactive width instead of the active width.
     */
    private _handleValueCorrection;
    /** Corrects the value of the slider based on the pointer event's position. */
    _fixValue(event: PointerEvent): void;
    _onPointerMove(event: PointerEvent): void;
    _onPointerUp(): void;
    _clamp(v: number): number;
    _calcTranslateXByValue(): number;
    _calcTranslateXByPointerEvent(event: PointerEvent): number;
    /**
     * Used to set the slider width to the correct
     * dimensions while the user is dragging.
     */
    _updateWidthActive(): void;
    /**
     * Sets the slider input to disproportionate dimensions to allow for touch
     * events to be captured on touch devices.
     */
    _updateWidthInactive(): void;
    _updateThumbUIByValue(options?: {
        withAnimation: boolean;
    }): void;
    _updateThumbUIByPointerEvent(event: PointerEvent, options?: {
        withAnimation: boolean;
    }): void;
    _updateThumbUI(options?: {
        withAnimation: boolean;
    }): void;
    /**
     * Sets the input's value.
     * @param value The new value of the input
     * @docs-private
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to be invoked when the input's value changes from user input.
     * @param fn The callback to register
     * @docs-private
     */
    registerOnChange(fn: any): void;
    /**
     * Registers a callback to be invoked when the input is blurred by the user.
     * @param fn The callback to register
     * @docs-private
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets the disabled state of the slider.
     * @param isDisabled The new disabled state
     * @docs-private
     */
    setDisabledState(isDisabled: boolean): void;
    focus(): void;
    blur(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSliderThumb, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSliderThumb, "input[matSliderThumb]", ["matSliderThumb"], { "value": { "alias": "value"; "required": false; }; }, { "valueChange": "valueChange"; "dragStart": "dragStart"; "dragEnd": "dragEnd"; }, never, never, true, never>;
    static ngAcceptInputType_value: unknown;
}
declare class MatSliderRangeThumb extends MatSliderThumb implements _MatSliderRangeThumb {
    readonly _cdr: ChangeDetectorRef;
    /** @docs-private */
    getSibling(): _MatSliderRangeThumb | undefined;
    private _sibling;
    /**
     * Returns the minimum translateX position allowed for this slider input's visual thumb.
     * @docs-private
     */
    getMinPos(): number;
    /**
     * Returns the maximum translateX position allowed for this slider input's visual thumb.
     * @docs-private
     */
    getMaxPos(): number;
    _setIsLeftThumb(): void;
    /** Whether this slider corresponds to the input on the left hand side. */
    _isLeftThumb: boolean;
    /** Whether this slider corresponds to the input with greater value. */
    _isEndThumb: boolean;
    constructor(...args: unknown[]);
    _getDefaultValue(): number;
    _onInput(): void;
    _onNgControlValueChange(): void;
    _onPointerDown(event: PointerEvent): void;
    _onPointerUp(): void;
    _onPointerMove(event: PointerEvent): void;
    _fixValue(event: PointerEvent): void;
    _clamp(v: number): number;
    _updateMinMax(): void;
    _updateWidthActive(): void;
    _updateWidthInactive(): void;
    _updateStaticStyles(): void;
    private _updateSibling;
    /**
     * Sets the input's value.
     * @param value The new value of the input
     * @docs-private
     */
    writeValue(value: any): void;
    _setValue(value: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSliderRangeThumb, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSliderRangeThumb, "input[matSliderStartThumb], input[matSliderEndThumb]", ["matSliderRangeThumb"], {}, {}, never, never, true, never>;
}

declare class MatSliderModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSliderModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatSliderModule, never, [typeof MatCommonModule, typeof MatRippleModule, typeof MatSlider, typeof MatSliderThumb, typeof MatSliderRangeThumb, typeof MatSliderVisualThumb], [typeof MatSlider, typeof MatSliderThumb, typeof MatSliderRangeThumb]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatSliderModule>;
}

export { MatSlider, MatSliderChange, MatSliderModule, MatSliderRangeThumb, MatSliderThumb, MatSliderVisualThumb };
export type { MatSliderDragEvent };
