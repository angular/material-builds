/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Optional, Output, QueryList, ViewChild, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRipple, MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MDCSliderFoundation, Thumb, TickMark } from '@material/slider';
import { Subscription } from 'rxjs';
import { GlobalChangeAndInputListener } from './global-change-and-input-listener';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "./global-change-and-input-listener";
import * as i5 from "@angular/cdk/bidi";
/** Options used to bind passive event listeners. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * The visual slider thumb.
 *
 * Handles the slider thumb ripple states (hover, focus, and active),
 * and displaying the value tooltip on discrete sliders.
 * @docs-private
 */
export class MatSliderVisualThumb {
    constructor(_ngZone, _slider, _elementRef) {
        this._ngZone = _ngZone;
        this._slider = _slider;
        this._elementRef = _elementRef;
        /** Whether ripples on the slider thumb should be disabled. */
        this.disableRipple = false;
        /** Whether the slider thumb is currently being pressed. */
        this._isActive = false;
        /** Whether the slider thumb is currently being hovered. */
        this._isHovered = false;
        this._onMouseEnter = () => {
            this._isHovered = true;
            // We don't want to show the hover ripple on top of the focus ripple.
            // This can happen if the user tabs to a thumb and then the user moves their cursor over it.
            if (!this._isShowingRipple(this._focusRippleRef)) {
                this._showHoverRipple();
            }
        };
        this._onMouseLeave = () => {
            this._isHovered = false;
            this._hoverRippleRef?.fadeOut();
        };
    }
    ngAfterViewInit() {
        this._ripple.radius = 24;
        this._sliderInput = this._slider._getInput(this.thumbPosition);
        // Note that we don't unsubscribe from these, because they're complete on destroy.
        this._sliderInput.dragStart.subscribe(event => this._onDragStart(event));
        this._sliderInput.dragEnd.subscribe(event => this._onDragEnd(event));
        this._sliderInput._focus.subscribe(() => this._onFocus());
        this._sliderInput._blur.subscribe(() => this._onBlur());
        // These two listeners don't update any data bindings so we bind them
        // outside of the NgZone to prevent Angular from needlessly running change detection.
        this._ngZone.runOutsideAngular(() => {
            this._elementRef.nativeElement.addEventListener('mouseenter', this._onMouseEnter);
            this._elementRef.nativeElement.addEventListener('mouseleave', this._onMouseLeave);
        });
    }
    ngOnDestroy() {
        this._elementRef.nativeElement.removeEventListener('mouseenter', this._onMouseEnter);
        this._elementRef.nativeElement.removeEventListener('mouseleave', this._onMouseLeave);
    }
    /** Used to append a class to indicate when the value indicator text is short. */
    _isShortValue() {
        return this.valueIndicatorText?.length <= 2;
    }
    _onFocus() {
        // We don't want to show the hover ripple on top of the focus ripple.
        // Happen when the users cursor is over a thumb and then the user tabs to it.
        this._hoverRippleRef?.fadeOut();
        this._showFocusRipple();
    }
    _onBlur() {
        // Happens when the user tabs away while still dragging a thumb.
        if (!this._isActive) {
            this._focusRippleRef?.fadeOut();
        }
        // Happens when the user tabs away from a thumb but their cursor is still over it.
        if (this._isHovered) {
            this._showHoverRipple();
        }
    }
    _onDragStart(event) {
        if (event.source._thumbPosition === this.thumbPosition) {
            this._isActive = true;
            this._showActiveRipple();
        }
    }
    _onDragEnd(event) {
        if (event.source._thumbPosition === this.thumbPosition) {
            this._isActive = false;
            this._activeRippleRef?.fadeOut();
            // Happens when the user starts dragging a thumb, tabs away, and then stops dragging.
            if (!this._sliderInput._isFocused()) {
                this._focusRippleRef?.fadeOut();
            }
        }
    }
    /** Handles displaying the hover ripple. */
    _showHoverRipple() {
        if (!this._isShowingRipple(this._hoverRippleRef)) {
            this._hoverRippleRef = this._showRipple({ enterDuration: 0, exitDuration: 0 });
            this._hoverRippleRef?.element.classList.add('mat-mdc-slider-hover-ripple');
        }
    }
    /** Handles displaying the focus ripple. */
    _showFocusRipple() {
        // Show the focus ripple event if noop animations are enabled.
        if (!this._isShowingRipple(this._focusRippleRef)) {
            this._focusRippleRef = this._showRipple({ enterDuration: 0, exitDuration: 0 });
            this._focusRippleRef?.element.classList.add('mat-mdc-slider-focus-ripple');
        }
    }
    /** Handles displaying the active ripple. */
    _showActiveRipple() {
        if (!this._isShowingRipple(this._activeRippleRef)) {
            this._activeRippleRef = this._showRipple({ enterDuration: 225, exitDuration: 400 });
            this._activeRippleRef?.element.classList.add('mat-mdc-slider-active-ripple');
        }
    }
    /** Whether the given rippleRef is currently fading in or visible. */
    _isShowingRipple(rippleRef) {
        return rippleRef?.state === 0 /* RippleState.FADING_IN */ || rippleRef?.state === 1 /* RippleState.VISIBLE */;
    }
    /** Manually launches the slider thumb ripple using the specified ripple animation config. */
    _showRipple(animation) {
        if (this.disableRipple) {
            return;
        }
        return this._ripple.launch({
            animation: this._slider._noopAnimations ? { enterDuration: 0, exitDuration: 0 } : animation,
            centered: true,
            persistent: true,
        });
    }
    /** Gets the hosts native HTML element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /** Gets the native HTML element of the slider thumb knob. */
    _getKnob() {
        return this._knob.nativeElement;
    }
    /**
     * Gets the native HTML element of the slider thumb value indicator
     * container.
     */
    _getValueIndicatorContainer() {
        return this._valueIndicatorContainer.nativeElement;
    }
}
MatSliderVisualThumb.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSliderVisualThumb, deps: [{ token: i0.NgZone }, { token: forwardRef(() => MatSlider) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
MatSliderVisualThumb.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: { discrete: "discrete", thumbPosition: "thumbPosition", valueIndicatorText: "valueIndicatorText", disableRipple: "disableRipple" }, host: { properties: { "class.mdc-slider__thumb--short-value": "_isShortValue()" }, classAttribute: "mdc-slider__thumb mat-mdc-slider-visual-thumb" }, viewQueries: [{ propertyName: "_ripple", first: true, predicate: MatRipple, descendants: true }, { propertyName: "_knob", first: true, predicate: ["knob"], descendants: true }, { propertyName: "_valueIndicatorContainer", first: true, predicate: ["valueIndicatorContainer"], descendants: true }], ngImport: i0, template: "<div class=\"mdc-slider__value-indicator-container\" *ngIf=\"discrete\" #valueIndicatorContainer>\n  <div class=\"mdc-slider__value-indicator\">\n    <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n  </div>\n</div>\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div\n  matRipple\n  class=\"mat-mdc-focus-indicator\"\n  [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSliderVisualThumb, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider-visual-thumb', host: {
                        'class': 'mdc-slider__thumb mat-mdc-slider-visual-thumb',
                        // NOTE: This class is used internally.
                        // TODO(wagnermaciel): Remove this once it is handled by the mdc foundation (cl/388828896).
                        '[class.mdc-slider__thumb--short-value]': '_isShortValue()',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mdc-slider__value-indicator-container\" *ngIf=\"discrete\" #valueIndicatorContainer>\n  <div class=\"mdc-slider__value-indicator\">\n    <span class=\"mdc-slider__value-indicator-text\">{{valueIndicatorText}}</span>\n  </div>\n</div>\n<div class=\"mdc-slider__thumb-knob\" #knob></div>\n<div\n  matRipple\n  class=\"mat-mdc-focus-indicator\"\n  [matRippleDisabled]=\"true\"></div>\n", styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: MatSlider, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatSlider)]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { discrete: [{
                type: Input
            }], thumbPosition: [{
                type: Input
            }], valueIndicatorText: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], _ripple: [{
                type: ViewChild,
                args: [MatRipple]
            }], _knob: [{
                type: ViewChild,
                args: ['knob']
            }], _valueIndicatorContainer: [{
                type: ViewChild,
                args: ['valueIndicatorContainer']
            }] } });
/**
 * Directive that adds slider-specific behaviors to an input element inside `<mat-slider>`.
 * Up to two may be placed inside of a `<mat-slider>`.
 *
 * If one is used, the selector `matSliderThumb` must be used, and the outcome will be a normal
 * slider. If two are used, the selectors `matSliderStartThumb` and `matSliderEndThumb` must be
 * used, and the outcome will be a range slider with two slider thumbs.
 */
export class MatSliderThumb {
    constructor(document, _slider, _elementRef) {
        this._slider = _slider;
        this._elementRef = _elementRef;
        /**
         * Emits when the raw value of the slider changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * @docs-private
         */
        this.valueChange = new EventEmitter();
        /** Event emitted when the slider thumb starts being dragged. */
        this.dragStart = new EventEmitter();
        /** Event emitted when the slider thumb stops being dragged. */
        this.dragEnd = new EventEmitter();
        /** Event emitted every time the MatSliderThumb is blurred. */
        this._blur = new EventEmitter();
        /** Event emitted every time the MatSliderThumb is focused. */
        this._focus = new EventEmitter();
        /**
         * Used to determine the disabled state of the MatSlider (ControlValueAccessor).
         * For ranged sliders, the disabled state of the MatSlider depends on the combined state of the
         * start and end inputs. See MatSlider._updateDisabled.
         */
        this._disabled = false;
        /**
         * A callback function that is called when the
         * control's value changes in the UI (ControlValueAccessor).
         */
        this._onChange = () => { };
        /**
         * A callback function that is called by the forms API on
         * initialization to update the form model on blur (ControlValueAccessor).
         */
        this._onTouched = () => { };
        /** Indicates which slider thumb this input corresponds to. */
        this._thumbPosition = this._elementRef.nativeElement.hasAttribute('matSliderStartThumb')
            ? Thumb.START
            : Thumb.END;
        this._document = document;
        this._hostElement = _elementRef.nativeElement;
    }
    // ** IMPORTANT NOTE **
    //
    // The way `value` is implemented for MatSliderThumb doesn't follow typical Angular conventions.
    // Normally we would define a private variable `_value` as the source of truth for the value of
    // the slider thumb input. The source of truth for the value of the slider inputs has already
    // been decided for us by MDC to be the value attribute on the slider thumb inputs. This is
    // because the MDC foundation and adapter expect that the value attribute is the source of truth
    // for the slider inputs.
    //
    // Also, note that the value attribute is completely disconnected from the value property.
    /** The current value of this slider input. */
    get value() {
        return coerceNumberProperty(this._hostElement.getAttribute('value'));
    }
    set value(v) {
        const value = coerceNumberProperty(v);
        // If the foundation has already been initialized, we need to
        // relay any value updates to it so that it can update the UI.
        if (this._slider._initialized) {
            this._slider._setValue(value, this._thumbPosition);
        }
        else {
            // Setup for the MDC foundation.
            this._hostElement.setAttribute('value', `${value}`);
        }
    }
    ngOnInit() {
        // By calling this in ngOnInit() we guarantee that the sibling sliders initial value by
        // has already been set by the time we reach ngAfterViewInit().
        this._initializeInputValueAttribute();
        this._initializeAriaValueText();
    }
    ngAfterViewInit() {
        this._initializeInputState();
        this._initializeInputValueProperty();
        // Setup for the MDC foundation.
        if (this._slider.disabled) {
            this._hostElement.disabled = true;
        }
    }
    ngOnDestroy() {
        this.dragStart.complete();
        this.dragEnd.complete();
        this._focus.complete();
        this._blur.complete();
        this.valueChange.complete();
    }
    _onBlur() {
        this._onTouched();
        this._blur.emit();
    }
    _emitFakeEvent(type) {
        const event = new Event(type);
        event._matIsHandled = true;
        this._hostElement.dispatchEvent(event);
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled) {
        this._disabled = isDisabled;
        this._slider._updateDisabled();
    }
    focus() {
        this._hostElement.focus();
    }
    blur() {
        this._hostElement.blur();
    }
    /** Returns true if this slider input currently has focus. */
    _isFocused() {
        return this._document.activeElement === this._hostElement;
    }
    /**
     * Sets the min, max, and step properties on the slider thumb input.
     *
     * Must be called AFTER the sibling slider thumb input is guaranteed to have had its value
     * attribute value set. For a range slider, the min and max of the slider thumb input depends on
     * the value of its sibling slider thumb inputs value.
     *
     * Must be called BEFORE the value property is set. In the case where the min and max have not
     * yet been set and we are setting the input value property to a value outside of the native
     * inputs default min or max. The value property would not be set to our desired value, but
     * instead be capped at either the default min or max.
     *
     */
    _initializeInputState() {
        const min = this._hostElement.hasAttribute('matSliderEndThumb')
            ? this._slider._getInput(Thumb.START).value
            : this._slider.min;
        const max = this._hostElement.hasAttribute('matSliderStartThumb')
            ? this._slider._getInput(Thumb.END).value
            : this._slider.max;
        this._hostElement.min = `${min}`;
        this._hostElement.max = `${max}`;
        this._hostElement.step = `${this._slider.step}`;
    }
    /**
     * Sets the value property on the slider thumb input.
     *
     * Must be called AFTER the min and max have been set. In the case where the min and max have not
     * yet been set and we are setting the input value property to a value outside of the native
     * inputs default min or max. The value property would not be set to our desired value, but
     * instead be capped at either the default min or max.
     */
    _initializeInputValueProperty() {
        this._hostElement.value = `${this.value}`;
    }
    /**
     * Ensures the value attribute is initialized.
     *
     * Must be called BEFORE the min and max are set. For a range slider, the min and max of the
     * slider thumb input depends on the value of its sibling slider thumb inputs value.
     */
    _initializeInputValueAttribute() {
        // Only set the default value if an initial value has not already been provided.
        if (!this._hostElement.hasAttribute('value')) {
            this.value = this._hostElement.hasAttribute('matSliderEndThumb')
                ? this._slider.max
                : this._slider.min;
        }
    }
    /**
     * Initializes the aria-valuetext attribute.
     *
     * Must be called AFTER the value attribute is set. This is because the slider's parent
     * `displayWith` function is used to set the `aria-valuetext` attribute.
     */
    _initializeAriaValueText() {
        this._hostElement.setAttribute('aria-valuetext', this._slider.displayWith(this.value));
    }
}
MatSliderThumb.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSliderThumb, deps: [{ token: DOCUMENT }, { token: forwardRef(() => MatSlider) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MatSliderThumb.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatSliderThumb, selector: "input[matSliderThumb], input[matSliderStartThumb], input[matSliderEndThumb]", inputs: { value: "value" }, outputs: { valueChange: "valueChange", dragStart: "dragStart", dragEnd: "dragEnd", _blur: "_blur", _focus: "_focus" }, host: { attributes: { "type": "range" }, listeners: { "blur": "_onBlur()", "focus": "_focus.emit()" }, classAttribute: "mdc-slider__input" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: MatSliderThumb,
            multi: true,
        },
    ], exportAs: ["matSliderThumb"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSliderThumb, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matSliderThumb], input[matSliderStartThumb], input[matSliderEndThumb]',
                    exportAs: 'matSliderThumb',
                    host: {
                        'class': 'mdc-slider__input',
                        'type': 'range',
                        '(blur)': '_onBlur()',
                        '(focus)': '_focus.emit()',
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: MatSliderThumb,
                            multi: true,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: MatSlider, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatSlider)]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], _blur: [{
                type: Output
            }], _focus: [{
                type: Output
            }] } });
// Boilerplate for applying mixins to MatSlider.
const _MatSliderMixinBase = mixinColor(mixinDisableRipple(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}), 'primary');
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export class MatSlider extends _MatSliderMixinBase {
    constructor(_ngZone, _cdr, elementRef, _platform, _globalChangeAndInputListener, document, _dir, _globalRippleOptions, animationMode) {
        super(elementRef);
        this._ngZone = _ngZone;
        this._cdr = _cdr;
        this._platform = _platform;
        this._globalChangeAndInputListener = _globalChangeAndInputListener;
        this._dir = _dir;
        this._globalRippleOptions = _globalRippleOptions;
        this._disabled = false;
        this._discrete = false;
        this._showTickMarks = false;
        this._min = 0;
        this._max = 100;
        this._step = 1;
        /**
         * Function that will be used to format the value before it is displayed
         * in the thumb label. Can be used to format very large number in order
         * for them to fit into the slider thumb.
         */
        this.displayWith = (value) => `${value}`;
        /** Instance of the MDC slider foundation for this slider. */
        this._foundation = new MDCSliderFoundation(new SliderAdapter(this));
        /** Whether the foundation has been initialized. */
        this._initialized = false;
        /**
         * Whether the browser supports pointer events.
         *
         * We exclude iOS to mirror the MDC Foundation. The MDC Foundation cannot use pointer events on
         * iOS because of this open bug - https://bugs.webkit.org/show_bug.cgi?id=220196.
         */
        this._SUPPORTS_POINTER_EVENTS = typeof PointerEvent !== 'undefined' && !!PointerEvent && !this._platform.IOS;
        /** Wrapper function for calling layout (needed for adding & removing an event listener). */
        this._layout = () => this._foundation.layout();
        this._document = document;
        this._window = this._document.defaultView || window;
        this._noopAnimations = animationMode === 'NoopAnimations';
        this._dirChangeSubscription = this._dir.change.subscribe(() => this._onDirChange());
        this._attachUISyncEventListener();
    }
    /** Whether the slider is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(v) {
        this._setDisabled(coerceBooleanProperty(v));
        this._updateInputsDisabledState();
    }
    /** Whether the slider displays a numeric value label upon pressing the thumb. */
    get discrete() {
        return this._discrete;
    }
    set discrete(v) {
        this._discrete = coerceBooleanProperty(v);
    }
    /** Whether the slider displays tick marks along the slider track. */
    get showTickMarks() {
        return this._showTickMarks;
    }
    set showTickMarks(v) {
        this._showTickMarks = coerceBooleanProperty(v);
    }
    /** The minimum value that the slider can have. */
    get min() {
        return this._min;
    }
    set min(v) {
        this._min = coerceNumberProperty(v, this._min);
        this._reinitialize();
    }
    /** The maximum value that the slider can have. */
    get max() {
        return this._max;
    }
    set max(v) {
        this._max = coerceNumberProperty(v, this._max);
        this._reinitialize();
    }
    /** The values at which the thumb will snap. */
    get step() {
        return this._step;
    }
    set step(v) {
        this._step = coerceNumberProperty(v, this._step);
        this._reinitialize();
    }
    ngAfterViewInit() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            _validateThumbs(this._isRange(), this._getThumb(Thumb.START), this._getThumb(Thumb.END));
            _validateInputs(this._isRange(), this._getInputElement(Thumb.START), this._getInputElement(Thumb.END));
        }
        if (this._platform.isBrowser) {
            this._foundation.init();
            this._foundation.layout();
            this._initialized = true;
            this._observeHostResize();
        }
        // The MDC foundation requires access to the view and content children of the MatSlider. In
        // order to access the view and content children of MatSlider we need to wait until change
        // detection runs and materializes them. That is why we call init() and layout() in
        // ngAfterViewInit().
        //
        // The MDC foundation then uses the information it gathers from the DOM to compute an initial
        // value for the tickMarks array. It then tries to update the component data, but because it is
        // updating the component data AFTER change detection already ran, we will get a changed after
        // checked error. Because of this, we need to force change detection to update the UI with the
        // new state.
        this._cdr.detectChanges();
    }
    ngOnDestroy() {
        if (this._platform.isBrowser) {
            this._foundation.destroy();
        }
        this._dirChangeSubscription.unsubscribe();
        this._resizeObserver?.disconnect();
        this._resizeObserver = null;
        clearTimeout(this._resizeTimer);
        this._removeUISyncEventListener();
    }
    /** Returns true if the language direction for this slider element is right to left. */
    _isRTL() {
        return this._dir && this._dir.value === 'rtl';
    }
    /**
     * Attaches an event listener that keeps sync the slider UI and the foundation in sync.
     *
     * Because the MDC Foundation stores the value of the bounding client rect when layout is called,
     * we need to keep calling layout to avoid the position of the slider getting out of sync with
     * what the foundation has stored. If we don't do this, the foundation will not be able to
     * correctly calculate the slider value on click/slide.
     */
    _attachUISyncEventListener() {
        // Implementation detail: It may seem weird that we are using "mouseenter" instead of
        // "mousedown" as the default for when a browser does not support pointer events. While we
        // would prefer to use "mousedown" as the default, for some reason it does not work (the
        // callback is never triggered).
        if (this._SUPPORTS_POINTER_EVENTS) {
            this._elementRef.nativeElement.addEventListener('pointerdown', this._layout);
        }
        else {
            this._elementRef.nativeElement.addEventListener('mouseenter', this._layout);
            this._elementRef.nativeElement.addEventListener('touchstart', this._layout, passiveEventListenerOptions);
        }
    }
    /** Removes the event listener that keeps sync the slider UI and the foundation in sync. */
    _removeUISyncEventListener() {
        if (this._SUPPORTS_POINTER_EVENTS) {
            this._elementRef.nativeElement.removeEventListener('pointerdown', this._layout);
        }
        else {
            this._elementRef.nativeElement.removeEventListener('mouseenter', this._layout);
            this._elementRef.nativeElement.removeEventListener('touchstart', this._layout, passiveEventListenerOptions);
        }
    }
    /**
     * Reinitializes the slider foundation and input state(s).
     *
     * The MDC Foundation does not support changing some slider attributes after it has been
     * initialized (e.g. min, max, and step). To continue supporting this feature, we need to
     * destroy the foundation and re-initialize everything whenever we make these changes.
     */
    _reinitialize() {
        if (this._initialized) {
            this._foundation.destroy();
            if (this._isRange()) {
                this._getInput(Thumb.START)._initializeInputState();
            }
            this._getInput(Thumb.END)._initializeInputState();
            this._foundation.init();
            this._foundation.layout();
        }
    }
    /** Handles updating the slider foundation after a dir change. */
    _onDirChange() {
        this._ngZone.runOutsideAngular(() => {
            // We need to call layout() a few milliseconds after the dir change callback
            // because we need to wait until the bounding client rect of the slider has updated.
            setTimeout(() => this._foundation.layout(), 10);
        });
    }
    /** Sets the value of a slider thumb. */
    _setValue(value, thumbPosition) {
        thumbPosition === Thumb.START
            ? this._foundation.setValueStart(value)
            : this._foundation.setValue(value);
    }
    /** Sets the disabled state of the MatSlider. */
    _setDisabled(value) {
        this._disabled = value;
        // If we want to disable the slider after the foundation has been initialized,
        // we need to inform the foundation by calling `setDisabled`. Also, we can't call
        // this before initializing the foundation because it will throw errors.
        if (this._initialized) {
            this._foundation.setDisabled(value);
        }
    }
    /** Sets the disabled state of the individual slider thumb(s) (ControlValueAccessor). */
    _updateInputsDisabledState() {
        if (this._initialized) {
            this._getInput(Thumb.END)._disabled = true;
            if (this._isRange()) {
                this._getInput(Thumb.START)._disabled = true;
            }
        }
    }
    /** Whether this is a ranged slider. */
    _isRange() {
        return this._inputs.length === 2;
    }
    /** Sets the disabled state based on the disabled state of the inputs (ControlValueAccessor). */
    _updateDisabled() {
        const disabled = this._inputs?.some(input => input._disabled) || false;
        this._setDisabled(disabled);
    }
    /** Gets the slider thumb input of the given thumb position. */
    _getInput(thumbPosition) {
        return thumbPosition === Thumb.END ? this._inputs?.last : this._inputs?.first;
    }
    /** Gets the slider thumb HTML input element of the given thumb position. */
    _getInputElement(thumbPosition) {
        return this._getInput(thumbPosition)?._hostElement;
    }
    _getThumb(thumbPosition) {
        return thumbPosition === Thumb.END ? this._thumbs?.last : this._thumbs?.first;
    }
    /** Gets the slider thumb HTML element of the given thumb position. */
    _getThumbElement(thumbPosition) {
        return this._getThumb(thumbPosition)?._getHostElement();
    }
    /** Gets the slider knob HTML element of the given thumb position. */
    _getKnobElement(thumbPosition) {
        return this._getThumb(thumbPosition)?._getKnob();
    }
    /**
     * Gets the slider value indicator container HTML element of the given thumb
     * position.
     */
    _getValueIndicatorContainerElement(thumbPosition) {
        return this._getThumb(thumbPosition)._getValueIndicatorContainer();
    }
    /**
     * Sets the value indicator text of the given thumb position using the given value.
     *
     * Uses the `displayWith` function if one has been provided. Otherwise, it just uses the
     * numeric value as a string.
     */
    _setValueIndicatorText(value, thumbPosition) {
        thumbPosition === Thumb.START
            ? (this._startValueIndicatorText = this.displayWith(value))
            : (this._endValueIndicatorText = this.displayWith(value));
        this._cdr.markForCheck();
    }
    /** Gets the value indicator text for the given thumb position. */
    _getValueIndicatorText(thumbPosition) {
        return thumbPosition === Thumb.START
            ? this._startValueIndicatorText
            : this._endValueIndicatorText;
    }
    /** Determines the class name for a HTML element. */
    _getTickMarkClass(tickMark) {
        return tickMark === TickMark.ACTIVE
            ? 'mdc-slider__tick-mark--active'
            : 'mdc-slider__tick-mark--inactive';
    }
    /** Whether the slider thumb ripples should be disabled. */
    _isRippleDisabled() {
        return this.disabled || this.disableRipple || !!this._globalRippleOptions?.disabled;
    }
    /** Gets the dimensions of the host element. */
    _getHostDimensions() {
        return this._cachedHostRect || this._elementRef.nativeElement.getBoundingClientRect();
    }
    /** Starts observing and updating the slider if the host changes its size. */
    _observeHostResize() {
        if (typeof ResizeObserver === 'undefined' || !ResizeObserver) {
            return;
        }
        // MDC only updates the slider when the window is resized which
        // doesn't capture changes of the container itself. We use a resize
        // observer to ensure that the layout is correct (see #24590 and #25286).
        this._ngZone.runOutsideAngular(() => {
            this._resizeObserver = new ResizeObserver(entries => {
                // Triggering a layout while the user is dragging can throw off the alignment.
                if (this._isActive()) {
                    return;
                }
                clearTimeout(this._resizeTimer);
                this._resizeTimer = setTimeout(() => {
                    // The `layout` call is going to call `getBoundingClientRect` to update the dimensions
                    // of the host. Since the `ResizeObserver` already calculated them, we can save some
                    // work by returning them instead of having to check the DOM again.
                    if (!this._isActive()) {
                        this._cachedHostRect = entries[0]?.contentRect;
                        this._layout();
                        this._cachedHostRect = null;
                    }
                }, 50);
            });
            this._resizeObserver.observe(this._elementRef.nativeElement);
        });
    }
    /** Whether any of the thumbs are currently active. */
    _isActive() {
        return this._getThumb(Thumb.START)._isActive || this._getThumb(Thumb.END)._isActive;
    }
}
MatSlider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSlider, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i3.Platform }, { token: i4.GlobalChangeAndInputListener }, { token: DOCUMENT }, { token: i5.Directionality, optional: true }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatSlider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatSlider, selector: "mat-slider", inputs: { color: "color", disableRipple: "disableRipple", disabled: "disabled", discrete: "discrete", showTickMarks: "showTickMarks", min: "min", max: "max", step: "step", displayWith: "displayWith" }, host: { properties: { "class.mdc-slider--range": "_isRange()", "class.mdc-slider--disabled": "disabled", "class.mdc-slider--discrete": "discrete", "class.mdc-slider--tick-marks": "showTickMarks", "class._mat-animation-noopable": "_noopAnimations" }, classAttribute: "mat-mdc-slider mdc-slider" }, queries: [{ propertyName: "_inputs", predicate: MatSliderThumb }], viewQueries: [{ propertyName: "_trackActive", first: true, predicate: ["trackActive"], descendants: true }, { propertyName: "_thumbs", predicate: MatSliderVisualThumb, descendants: true }], exportAs: ["matSlider"], usesInheritance: true, ngImport: i0, template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div class=\"mdc-slider__track--active_fill\" #trackActive></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <div *ngFor=\"let tickMark of _tickMarks\" [class]=\"_getTickMarkClass(tickMark)\"></div>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngFor=\"let thumb of _inputs\"\n  [discrete]=\"discrete\"\n  [disableRipple]=\"_isRippleDisabled()\"\n  [thumbPosition]=\"thumb._thumbPosition\"\n  [valueIndicatorText]=\"_getValueIndicatorText(thumb._thumbPosition)\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{height:4px;position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{border-radius:3px;height:6px;overflow:hidden;top:-1px}.mdc-slider .mdc-slider__track--active_fill{border-top:6px solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{border-radius:2px;height:4px;left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;height:48px;left:-24px;outline:none;position:absolute;user-select:none;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{border:10px solid;border-radius:50%;box-sizing:border-box;height:20px;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);width:20px}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider .mdc-slider__tick-mark--active,.mdc-slider .mdc-slider__tick-mark--inactive{border-radius:50%;height:2px;width:2px}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:0;margin:0;height:100%;opacity:0;pointer-events:none;position:absolute;top:0;width:100%}.mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms}.mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: ["discrete", "thumbPosition", "valueIndicatorText", "disableRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider', host: {
                        'class': 'mat-mdc-slider mdc-slider',
                        '[class.mdc-slider--range]': '_isRange()',
                        '[class.mdc-slider--disabled]': 'disabled',
                        '[class.mdc-slider--discrete]': 'discrete',
                        '[class.mdc-slider--tick-marks]': 'showTickMarks',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                    }, exportAs: 'matSlider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, inputs: ['color', 'disableRipple'], template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div class=\"mdc-slider__track--active_fill\" #trackActive></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <div *ngFor=\"let tickMark of _tickMarks\" [class]=\"_getTickMarkClass(tickMark)\"></div>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngFor=\"let thumb of _inputs\"\n  [discrete]=\"discrete\"\n  [disableRipple]=\"_isRippleDisabled()\"\n  [thumbPosition]=\"thumb._thumbPosition\"\n  [valueIndicatorText]=\"_getValueIndicatorText(thumb._thumbPosition)\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{height:4px;position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{border-radius:3px;height:6px;overflow:hidden;top:-1px}.mdc-slider .mdc-slider__track--active_fill{border-top:6px solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{border-radius:2px;height:4px;left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;height:48px;left:-24px;outline:none;position:absolute;user-select:none;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{border:10px solid;border-radius:50%;box-sizing:border-box;height:20px;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);width:20px}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider .mdc-slider__tick-mark--active,.mdc-slider .mdc-slider__tick-mark--inactive{border-radius:50%;height:2px;width:2px}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:0;margin:0;height:100%;opacity:0;pointer-events:none;position:absolute;top:0;width:100%}.mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms}.mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i3.Platform }, { type: i4.GlobalChangeAndInputListener }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i5.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _thumbs: [{
                type: ViewChildren,
                args: [MatSliderVisualThumb]
            }], _trackActive: [{
                type: ViewChild,
                args: ['trackActive']
            }], _inputs: [{
                type: ContentChildren,
                args: [MatSliderThumb, { descendants: false }]
            }], disabled: [{
                type: Input
            }], discrete: [{
                type: Input
            }], showTickMarks: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], step: [{
                type: Input
            }], displayWith: [{
                type: Input
            }] } });
/** The MDCSliderAdapter implementation. */
class SliderAdapter {
    constructor(_delegate) {
        this._delegate = _delegate;
        /** The global event listener subscription used to handle events on the slider inputs. */
        this._globalEventSubscriptions = new Subscription();
        // We manually assign functions instead of using prototype methods because
        // MDC clobbers the values otherwise.
        // See https://github.com/material-components/material-components-web/pull/6256
        this.hasClass = (className) => {
            return this._delegate._elementRef.nativeElement.classList.contains(className);
        };
        this.addClass = (className) => {
            this._delegate._elementRef.nativeElement.classList.add(className);
        };
        this.removeClass = (className) => {
            this._delegate._elementRef.nativeElement.classList.remove(className);
        };
        this.getAttribute = (attribute) => {
            return this._delegate._elementRef.nativeElement.getAttribute(attribute);
        };
        this.addThumbClass = (className, thumbPosition) => {
            this._delegate._getThumbElement(thumbPosition).classList.add(className);
        };
        this.removeThumbClass = (className, thumbPosition) => {
            this._delegate._getThumbElement(thumbPosition).classList.remove(className);
        };
        this.getInputValue = (thumbPosition) => {
            return this._delegate._getInputElement(thumbPosition).value;
        };
        this.setInputValue = (value, thumbPosition) => {
            this._delegate._getInputElement(thumbPosition).value = value;
        };
        this.getInputAttribute = (attribute, thumbPosition) => {
            return this._delegate._getInputElement(thumbPosition).getAttribute(attribute);
        };
        this.setInputAttribute = (attribute, value, thumbPosition) => {
            const input = this._delegate._getInputElement(thumbPosition);
            // TODO(wagnermaciel): remove this check once this component is
            // added to the internal allowlist for calling setAttribute.
            // Explicitly check the attribute we are setting to prevent xss.
            switch (attribute) {
                case 'aria-valuetext':
                    input.setAttribute('aria-valuetext', value);
                    break;
                case 'disabled':
                    input.setAttribute('disabled', value);
                    break;
                case 'min':
                    input.setAttribute('min', value);
                    break;
                case 'max':
                    input.setAttribute('max', value);
                    break;
                case 'value':
                    input.setAttribute('value', value);
                    break;
                case 'step':
                    input.setAttribute('step', value);
                    break;
                default:
                    throw Error(`Tried to set invalid attribute ${attribute} on the mdc-slider.`);
            }
        };
        this.removeInputAttribute = (attribute, thumbPosition) => {
            this._delegate._getInputElement(thumbPosition).removeAttribute(attribute);
        };
        this.focusInput = (thumbPosition) => {
            this._delegate._getInputElement(thumbPosition).focus();
        };
        this.isInputFocused = (thumbPosition) => {
            return this._delegate._getInput(thumbPosition)._isFocused();
        };
        this.getThumbKnobWidth = (thumbPosition) => {
            return this._delegate._getKnobElement(thumbPosition).getBoundingClientRect().width;
        };
        this.getThumbBoundingClientRect = (thumbPosition) => {
            return this._delegate._getThumbElement(thumbPosition).getBoundingClientRect();
        };
        this.getBoundingClientRect = () => {
            return this._delegate._getHostDimensions();
        };
        this.getValueIndicatorContainerWidth = (thumbPosition) => {
            return this._delegate._getValueIndicatorContainerElement(thumbPosition).getBoundingClientRect()
                .width;
        };
        this.isRTL = () => {
            return this._delegate._isRTL();
        };
        this.setThumbStyleProperty = (propertyName, value, thumbPosition) => {
            this._delegate._getThumbElement(thumbPosition).style.setProperty(propertyName, value);
        };
        this.removeThumbStyleProperty = (propertyName, thumbPosition) => {
            this._delegate._getThumbElement(thumbPosition).style.removeProperty(propertyName);
        };
        this.setTrackActiveStyleProperty = (propertyName, value) => {
            this._delegate._trackActive.nativeElement.style.setProperty(propertyName, value);
        };
        this.removeTrackActiveStyleProperty = (propertyName) => {
            this._delegate._trackActive.nativeElement.style.removeProperty(propertyName);
        };
        this.setValueIndicatorText = (value, thumbPosition) => {
            this._delegate._setValueIndicatorText(value, thumbPosition);
        };
        this.getValueToAriaValueTextFn = () => {
            return this._delegate.displayWith;
        };
        this.updateTickMarks = (tickMarks) => {
            this._delegate._tickMarks = tickMarks;
            this._delegate._cdr.markForCheck();
        };
        this.setPointerCapture = (pointerId) => {
            this._delegate._elementRef.nativeElement.setPointerCapture(pointerId);
        };
        this.emitChangeEvent = (value, thumbPosition) => {
            // We block all real slider input change events and emit fake change events from here, instead.
            // We do this because the mdc implementation of the slider does not trigger real change events
            // on pointer up (only on left or right arrow key down).
            //
            // By stopping real change events from reaching users, and dispatching fake change events
            // (which we allow to reach the user) the slider inputs change events are triggered at the
            // appropriate times. This allows users to listen for change events directly on the slider
            // input as they would with a native range input.
            const input = this._delegate._getInput(thumbPosition);
            input._emitFakeEvent('change');
            input._onChange(value);
            input.valueChange.emit(value);
        };
        this.emitInputEvent = (value, thumbPosition) => {
            this._delegate._getInput(thumbPosition)._emitFakeEvent('input');
        };
        this.emitDragStartEvent = (value, thumbPosition) => {
            const input = this._delegate._getInput(thumbPosition);
            input.dragStart.emit({ source: input, parent: this._delegate, value });
        };
        this.emitDragEndEvent = (value, thumbPosition) => {
            const input = this._delegate._getInput(thumbPosition);
            input.dragEnd.emit({ source: input, parent: this._delegate, value });
        };
        this.registerEventHandler = (evtType, handler) => {
            this._delegate._elementRef.nativeElement.addEventListener(evtType, handler);
        };
        this.deregisterEventHandler = (evtType, handler) => {
            this._delegate._elementRef.nativeElement.removeEventListener(evtType, handler);
        };
        this.registerThumbEventHandler = (thumbPosition, evtType, handler) => {
            this._delegate._getThumbElement(thumbPosition).addEventListener(evtType, handler);
        };
        this.deregisterThumbEventHandler = (thumbPosition, evtType, handler) => {
            this._delegate._getThumbElement(thumbPosition)?.removeEventListener(evtType, handler);
        };
        this.registerInputEventHandler = (thumbPosition, evtType, handler) => {
            if (evtType === 'change') {
                this._saveChangeEventHandler(thumbPosition, handler);
            }
            else {
                this._delegate._getInputElement(thumbPosition)?.addEventListener(evtType, handler);
            }
        };
        this.deregisterInputEventHandler = (thumbPosition, evtType, handler) => {
            if (evtType === 'change') {
                this._globalEventSubscriptions.unsubscribe();
            }
            else {
                this._delegate._getInputElement(thumbPosition)?.removeEventListener(evtType, handler);
            }
        };
        this.registerBodyEventHandler = (evtType, handler) => {
            this._delegate._document.body.addEventListener(evtType, handler);
        };
        this.deregisterBodyEventHandler = (evtType, handler) => {
            this._delegate._document.body.removeEventListener(evtType, handler);
        };
        this.registerWindowEventHandler = (evtType, handler) => {
            this._delegate._window.addEventListener(evtType, handler);
        };
        this.deregisterWindowEventHandler = (evtType, handler) => {
            this._delegate._window.removeEventListener(evtType, handler);
        };
        this._globalEventSubscriptions.add(this._subscribeToSliderInputEvents('change'));
        this._globalEventSubscriptions.add(this._subscribeToSliderInputEvents('input'));
    }
    /**
     * Handles "change" and "input" events on the slider inputs.
     *
     * Exposes a callback to allow the MDC Foundations "change" event handler to be called for "real"
     * events.
     *
     * ** IMPORTANT NOTE **
     *
     * We block all "real" change and input events and emit fake events from #emitChangeEvent and
     * #emitInputEvent, instead. We do this because interacting with the MDC slider won't trigger all
     * of the correct change and input events, but it will call #emitChangeEvent and #emitInputEvent
     * at the correct times. This allows users to listen for these events directly on the slider
     * input as they would with a native range input.
     */
    _subscribeToSliderInputEvents(type) {
        return this._delegate._globalChangeAndInputListener.listen(type, (event) => {
            const thumbPosition = this._getInputThumbPosition(event.target);
            // Do nothing if the event isn't from a thumb input.
            if (thumbPosition === null) {
                return;
            }
            // Do nothing if the event is "fake".
            if (event._matIsHandled) {
                return;
            }
            // Prevent "real" events from reaching end users.
            event.stopImmediatePropagation();
            // Relay "real" change events to the MDC Foundation.
            if (type === 'change') {
                this._callChangeEventHandler(event, thumbPosition);
            }
        });
    }
    /** Calls the MDC Foundations change event handler for the specified thumb position. */
    _callChangeEventHandler(event, thumbPosition) {
        if (thumbPosition === Thumb.START) {
            this._startInputChangeEventHandler(event);
        }
        else {
            this._endInputChangeEventHandler(event);
        }
    }
    /** Save the event handler so it can be used in our global change event listener subscription. */
    _saveChangeEventHandler(thumbPosition, handler) {
        if (thumbPosition === Thumb.START) {
            this._startInputChangeEventHandler = handler;
        }
        else {
            this._endInputChangeEventHandler = handler;
        }
    }
    /**
     * Returns the thumb position of the given event target.
     * Returns null if the given event target does not correspond to a slider thumb input.
     */
    _getInputThumbPosition(target) {
        if (target === this._delegate._getInputElement(Thumb.END)) {
            return Thumb.END;
        }
        if (this._delegate._isRange() && target === this._delegate._getInputElement(Thumb.START)) {
            return Thumb.START;
        }
        return null;
    }
}
/** Ensures that there is not an invalid configuration for the slider thumb inputs. */
function _validateInputs(isRange, startInputElement, endInputElement) {
    const startValid = !isRange || startInputElement.hasAttribute('matSliderStartThumb');
    const endValid = endInputElement.hasAttribute(isRange ? 'matSliderEndThumb' : 'matSliderThumb');
    if (!startValid || !endValid) {
        _throwInvalidInputConfigurationError();
    }
}
/** Validates that the slider has the correct set of thumbs. */
function _validateThumbs(isRange, start, end) {
    if (!end && (!isRange || !start)) {
        _throwInvalidInputConfigurationError();
    }
}
function _throwInvalidInputConfigurationError() {
    throw Error(`Invalid slider thumb input configuration!

  Valid configurations are as follows:

    <mat-slider>
      <input matSliderThumb>
    </mat-slider>

    or

    <mat-slider>
      <input matSliderStartThumb>
      <input matSliderEndThumb>
    </mat-slider>
  `);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci10aHVtYi5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEVBQ1osaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBRUwsU0FBUyxFQUNULHlCQUF5QixFQUN6QixVQUFVLEVBQ1Ysa0JBQWtCLEdBS25CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFFM0UsT0FBTyxFQUFtQixtQkFBbUIsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFDLE1BQU0sa0JBQWtCLENB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RUFBRTtRQUM1QixvQ0FBb0MsRUFBRSxDQUFDO0tBQ3hDO0FBQ0gsQ0FBQztBQUVELCtEQUErRDtBQUMvRCxTQUFTLGVBQWUsQ0FDdEIsT0FBZ0IsRUFDaEIsS0FBdUMsRUFDdkMsR0FBcUM7SUFFckMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEMsb0NBQW9DLEVBQUUsQ0FBQztLQUN4QztBQUNILENBQUM7QUFFRCxTQUFTLG9DQUFvQztJQUMzQyxNQUFNLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7Ozs7R0FjWCxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgTWF0UmlwcGxlLFxuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFJpcHBsZUFuaW1hdGlvbkNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVmLFxuICBSaXBwbGVTdGF0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3BlY2lmaWNFdmVudExpc3RlbmVyLCBFdmVudFR5cGV9IGZyb20gJ0BtYXRlcmlhbC9iYXNlJztcbmltcG9ydCB7TURDU2xpZGVyQWRhcHRlciwgTURDU2xpZGVyRm91bmRhdGlvbiwgVGh1bWIsIFRpY2tNYXJrfSBmcm9tICdAbWF0ZXJpYWwvc2xpZGVyJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7R2xvYmFsQ2hhbmdlQW5kSW5wdXRMaXN0ZW5lcn0gZnJvbSAnLi9nbG9iYWwtY2hhbmdlLWFuZC1pbnB1dC1saXN0ZW5lcic7XG5cbi8qKiBPcHRpb25zIHVzZWQgdG8gYmluZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy4gKi9cbmNvbnN0IHBhc3NpdmVFdmVudExpc3RlbmVyT3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqIFJlcHJlc2VudHMgYSBkcmFnIGV2ZW50IGVtaXR0ZWQgYnkgdGhlIE1hdFNsaWRlciBjb21wb25lbnQuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNsaWRlckRyYWdFdmVudCB7XG4gIC8qKiBUaGUgTWF0U2xpZGVyVGh1bWIgdGhhdCB3YXMgaW50ZXJhY3RlZCB3aXRoLiAqL1xuICBzb3VyY2U6IE1hdFNsaWRlclRodW1iO1xuXG4gIC8qKiBUaGUgTWF0U2xpZGVyIHRoYXQgd2FzIGludGVyYWN0ZWQgd2l0aC4gKi9cbiAgcGFyZW50OiBNYXRTbGlkZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIHZhbHVlOiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIHZpc3VhbCBzbGlkZXIgdGh1bWIuXG4gKlxuICogSGFuZGxlcyB0aGUgc2xpZGVyIHRodW1iIHJpcHBsZSBzdGF0ZXMgKGhvdmVyLCBmb2N1cywgYW5kIGFjdGl2ZSksXG4gKiBhbmQgZGlzcGxheWluZyB0aGUgdmFsdWUgdG9vbHRpcCBvbiBkaXNjcmV0ZSBzbGlkZXJzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGVyLXZpc3VhbC10aHVtYicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zbGlkZXItdGh1bWIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXItdGh1bWIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLXNsaWRlcl9fdGh1bWIgbWF0LW1kYy1zbGlkZXItdmlzdWFsLXRodW1iJyxcblxuICAgIC8vIE5PVEU6IFRoaXMgY2xhc3MgaXMgdXNlZCBpbnRlcm5hbGx5LlxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogUmVtb3ZlIHRoaXMgb25jZSBpdCBpcyBoYW5kbGVkIGJ5IHRoZSBtZGMgZm91bmRhdGlvbiAoY2wvMzg4ODI4ODk2KS5cbiAgICAnW2NsYXNzLm1kYy1zbGlkZXJfX3RodW1iLS1zaG9ydC12YWx1ZV0nOiAnX2lzU2hvcnRWYWx1ZSgpJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlclZpc3VhbFRodW1iIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyBhIG51bWVyaWMgdmFsdWUgbGFiZWwgdXBvbiBwcmVzc2luZyB0aGUgdGh1bWIuICovXG4gIEBJbnB1dCgpIGRpc2NyZXRlOiBib29sZWFuO1xuXG4gIC8qKiBJbmRpY2F0ZXMgd2hpY2ggc2xpZGVyIHRodW1iIHRoaXMgaW5wdXQgY29ycmVzcG9uZHMgdG8uICovXG4gIEBJbnB1dCgpIHRodW1iUG9zaXRpb246IFRodW1iO1xuXG4gIC8qKiBUaGUgZGlzcGxheSB2YWx1ZSBvZiB0aGUgc2xpZGVyIHRodW1iLiAqL1xuICBASW5wdXQoKSB2YWx1ZUluZGljYXRvclRleHQ6IHN0cmluZztcblxuICAvKiogV2hldGhlciByaXBwbGVzIG9uIHRoZSBzbGlkZXIgdGh1bWIgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKSBkaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBNYXRSaXBwbGUgZm9yIHRoaXMgc2xpZGVyIHRodW1iLiAqL1xuICBAVmlld0NoaWxkKE1hdFJpcHBsZSkgcHJpdmF0ZSByZWFkb25seSBfcmlwcGxlOiBNYXRSaXBwbGU7XG5cbiAgLyoqIFRoZSBzbGlkZXIgdGh1bWIga25vYi4gKi9cbiAgQFZpZXdDaGlsZCgna25vYicpIF9rbm9iOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYiB2YWx1ZSBpbmRpY2F0b3IgY29udGFpbmVyLiAqL1xuICBAVmlld0NoaWxkKCd2YWx1ZUluZGljYXRvckNvbnRhaW5lcicpXG4gIF92YWx1ZUluZGljYXRvckNvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFRoZSBzbGlkZXIgaW5wdXQgY29ycmVzcG9uZGluZyB0byB0aGlzIHNsaWRlciB0aHVtYi4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVySW5wdXQ6IE1hdFNsaWRlclRodW1iO1xuXG4gIC8qKiBUaGUgUmlwcGxlUmVmIGZvciB0aGUgc2xpZGVyIHRodW1icyBob3ZlciBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfaG92ZXJSaXBwbGVSZWY6IFJpcHBsZVJlZiB8IHVuZGVmaW5lZDtcblxuICAvKiogVGhlIFJpcHBsZVJlZiBmb3IgdGhlIHNsaWRlciB0aHVtYnMgZm9jdXMgc3RhdGUuICovXG4gIHByaXZhdGUgX2ZvY3VzUmlwcGxlUmVmOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFRoZSBSaXBwbGVSZWYgZm9yIHRoZSBzbGlkZXIgdGh1bWJzIGFjdGl2ZSBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfYWN0aXZlUmlwcGxlUmVmOiBSaXBwbGVSZWYgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciB0aHVtYiBpcyBjdXJyZW50bHkgYmVpbmcgcHJlc3NlZC4gKi9cbiAgcmVhZG9ubHkgX2lzQWN0aXZlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciB0aHVtYiBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZC4gKi9cbiAgcHJpdmF0ZSBfaXNIb3ZlcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlcikpIHByaXZhdGUgcmVhZG9ubHkgX3NsaWRlcjogTWF0U2xpZGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICApIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3JpcHBsZS5yYWRpdXMgPSAyNDtcbiAgICB0aGlzLl9zbGlkZXJJbnB1dCA9IHRoaXMuX3NsaWRlci5fZ2V0SW5wdXQodGhpcy50aHVtYlBvc2l0aW9uKTtcblxuICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCB1bnN1YnNjcmliZSBmcm9tIHRoZXNlLCBiZWNhdXNlIHRoZXkncmUgY29tcGxldGUgb24gZGVzdHJveS5cbiAgICB0aGlzLl9zbGlkZXJJbnB1dC5kcmFnU3RhcnQuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuX29uRHJhZ1N0YXJ0KGV2ZW50KSk7XG4gICAgdGhpcy5fc2xpZGVySW5wdXQuZHJhZ0VuZC5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5fb25EcmFnRW5kKGV2ZW50KSk7XG5cbiAgICB0aGlzLl9zbGlkZXJJbnB1dC5fZm9jdXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuX29uRm9jdXMoKSk7XG4gICAgdGhpcy5fc2xpZGVySW5wdXQuX2JsdXIuc3Vic2NyaWJlKCgpID0+IHRoaXMuX29uQmx1cigpKTtcblxuICAgIC8vIFRoZXNlIHR3byBsaXN0ZW5lcnMgZG9uJ3QgdXBkYXRlIGFueSBkYXRhIGJpbmRpbmdzIHNvIHdlIGJpbmQgdGhlbVxuICAgIC8vIG91dHNpZGUgb2YgdGhlIE5nWm9uZSB0byBwcmV2ZW50IEFuZ3VsYXIgZnJvbSBuZWVkbGVzc2x5IHJ1bm5pbmcgY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbk1vdXNlRW50ZXIpO1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLl9vbk1vdXNlTGVhdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbk1vdXNlRW50ZXIpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5fb25Nb3VzZUxlYXZlKTtcbiAgfVxuXG4gIC8qKiBVc2VkIHRvIGFwcGVuZCBhIGNsYXNzIHRvIGluZGljYXRlIHdoZW4gdGhlIHZhbHVlIGluZGljYXRvciB0ZXh0IGlzIHNob3J0LiAqL1xuICBfaXNTaG9ydFZhbHVlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZhbHVlSW5kaWNhdG9yVGV4dD8ubGVuZ3RoIDw9IDI7XG4gIH1cblxuICBwcml2YXRlIF9vbk1vdXNlRW50ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5faXNIb3ZlcmVkID0gdHJ1ZTtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNob3cgdGhlIGhvdmVyIHJpcHBsZSBvbiB0b3Agb2YgdGhlIGZvY3VzIHJpcHBsZS5cbiAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgdGhlIHVzZXIgdGFicyB0byBhIHRodW1iIGFuZCB0aGVuIHRoZSB1c2VyIG1vdmVzIHRoZWlyIGN1cnNvciBvdmVyIGl0LlxuICAgIGlmICghdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5fc2hvd0hvdmVyUmlwcGxlKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgX29uTW91c2VMZWF2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9pc0hvdmVyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9ob3ZlclJpcHBsZVJlZj8uZmFkZU91dCgpO1xuICB9O1xuXG4gIHByaXZhdGUgX29uRm9jdXMoKTogdm9pZCB7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzaG93IHRoZSBob3ZlciByaXBwbGUgb24gdG9wIG9mIHRoZSBmb2N1cyByaXBwbGUuXG4gICAgLy8gSGFwcGVuIHdoZW4gdGhlIHVzZXJzIGN1cnNvciBpcyBvdmVyIGEgdGh1bWIgYW5kIHRoZW4gdGhlIHVzZXIgdGFicyB0byBpdC5cbiAgICB0aGlzLl9ob3ZlclJpcHBsZVJlZj8uZmFkZU91dCgpO1xuICAgIHRoaXMuX3Nob3dGb2N1c1JpcHBsZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25CbHVyKCk6IHZvaWQge1xuICAgIC8vIEhhcHBlbnMgd2hlbiB0aGUgdXNlciB0YWJzIGF3YXkgd2hpbGUgc3RpbGwgZHJhZ2dpbmcgYSB0aHVtYi5cbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9mb2N1c1JpcHBsZVJlZj8uZmFkZU91dCgpO1xuICAgIH1cbiAgICAvLyBIYXBwZW5zIHdoZW4gdGhlIHVzZXIgdGFicyBhd2F5IGZyb20gYSB0aHVtYiBidXQgdGhlaXIgY3Vyc29yIGlzIHN0aWxsIG92ZXIgaXQuXG4gICAgaWYgKHRoaXMuX2lzSG92ZXJlZCkge1xuICAgICAgdGhpcy5fc2hvd0hvdmVyUmlwcGxlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb25EcmFnU3RhcnQoZXZlbnQ6IE1hdFNsaWRlckRyYWdFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5zb3VyY2UuX3RodW1iUG9zaXRpb24gPT09IHRoaXMudGh1bWJQb3NpdGlvbikge1xuICAgICAgKHRoaXMgYXMge19pc0FjdGl2ZTogYm9vbGVhbn0pLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLl9zaG93QWN0aXZlUmlwcGxlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb25EcmFnRW5kKGV2ZW50OiBNYXRTbGlkZXJEcmFnRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQuc291cmNlLl90aHVtYlBvc2l0aW9uID09PSB0aGlzLnRodW1iUG9zaXRpb24pIHtcbiAgICAgICh0aGlzIGFzIHtfaXNBY3RpdmU6IGJvb2xlYW59KS5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2FjdGl2ZVJpcHBsZVJlZj8uZmFkZU91dCgpO1xuICAgICAgLy8gSGFwcGVucyB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmFnZ2luZyBhIHRodW1iLCB0YWJzIGF3YXksIGFuZCB0aGVuIHN0b3BzIGRyYWdnaW5nLlxuICAgICAgaWYgKCF0aGlzLl9zbGlkZXJJbnB1dC5faXNGb2N1c2VkKCkpIHtcbiAgICAgICAgdGhpcy5fZm9jdXNSaXBwbGVSZWY/LmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBkaXNwbGF5aW5nIHRoZSBob3ZlciByaXBwbGUuICovXG4gIHByaXZhdGUgX3Nob3dIb3ZlclJpcHBsZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzU2hvd2luZ1JpcHBsZSh0aGlzLl9ob3ZlclJpcHBsZVJlZikpIHtcbiAgICAgIHRoaXMuX2hvdmVyUmlwcGxlUmVmID0gdGhpcy5fc2hvd1JpcHBsZSh7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfSk7XG4gICAgICB0aGlzLl9ob3ZlclJpcHBsZVJlZj8uZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLXNsaWRlci1ob3Zlci1yaXBwbGUnKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBkaXNwbGF5aW5nIHRoZSBmb2N1cyByaXBwbGUuICovXG4gIHByaXZhdGUgX3Nob3dGb2N1c1JpcHBsZSgpOiB2b2lkIHtcbiAgICAvLyBTaG93IHRoZSBmb2N1cyByaXBwbGUgZXZlbnQgaWYgbm9vcCBhbmltYXRpb25zIGFyZSBlbmFibGVkLlxuICAgIGlmICghdGhpcy5faXNTaG93aW5nUmlwcGxlKHRoaXMuX2ZvY3VzUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5fZm9jdXNSaXBwbGVSZWYgPSB0aGlzLl9zaG93UmlwcGxlKHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9KTtcbiAgICAgIHRoaXMuX2ZvY3VzUmlwcGxlUmVmPy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWZvY3VzLXJpcHBsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGRpc3BsYXlpbmcgdGhlIGFjdGl2ZSByaXBwbGUuICovXG4gIHByaXZhdGUgX3Nob3dBY3RpdmVSaXBwbGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1Nob3dpbmdSaXBwbGUodGhpcy5fYWN0aXZlUmlwcGxlUmVmKSkge1xuICAgICAgdGhpcy5fYWN0aXZlUmlwcGxlUmVmID0gdGhpcy5fc2hvd1JpcHBsZSh7ZW50ZXJEdXJhdGlvbjogMjI1LCBleGl0RHVyYXRpb246IDQwMH0pO1xuICAgICAgdGhpcy5fYWN0aXZlUmlwcGxlUmVmPy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtc2xpZGVyLWFjdGl2ZS1yaXBwbGUnKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gcmlwcGxlUmVmIGlzIGN1cnJlbnRseSBmYWRpbmcgaW4gb3IgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfaXNTaG93aW5nUmlwcGxlKHJpcHBsZVJlZj86IFJpcHBsZVJlZik6IGJvb2xlYW4ge1xuICAgIHJldHVybiByaXBwbGVSZWY/LnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfSU4gfHwgcmlwcGxlUmVmPy5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRTtcbiAgfVxuXG4gIC8qKiBNYW51YWxseSBsYXVuY2hlcyB0aGUgc2xpZGVyIHRodW1iIHJpcHBsZSB1c2luZyB0aGUgc3BlY2lmaWVkIHJpcHBsZSBhbmltYXRpb24gY29uZmlnLiAqL1xuICBwcml2YXRlIF9zaG93UmlwcGxlKGFuaW1hdGlvbjogUmlwcGxlQW5pbWF0aW9uQ29uZmlnKTogUmlwcGxlUmVmIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUmlwcGxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yaXBwbGUubGF1bmNoKHtcbiAgICAgIGFuaW1hdGlvbjogdGhpcy5fc2xpZGVyLl9ub29wQW5pbWF0aW9ucyA/IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9IDogYW5pbWF0aW9uLFxuICAgICAgY2VudGVyZWQ6IHRydWUsXG4gICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGhvc3RzIG5hdGl2ZSBIVE1MIGVsZW1lbnQuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYXRpdmUgSFRNTCBlbGVtZW50IG9mIHRoZSBzbGlkZXIgdGh1bWIga25vYi4gKi9cbiAgX2dldEtub2IoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9rbm9iLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbmF0aXZlIEhUTUwgZWxlbWVudCBvZiB0aGUgc2xpZGVyIHRodW1iIHZhbHVlIGluZGljYXRvclxuICAgKiBjb250YWluZXIuXG4gICAqL1xuICBfZ2V0VmFsdWVJbmRpY2F0b3JDb250YWluZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZUluZGljYXRvckNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIHRoYXQgYWRkcyBzbGlkZXItc3BlY2lmaWMgYmVoYXZpb3JzIHRvIGFuIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LXNsaWRlcj5gLlxuICogVXAgdG8gdHdvIG1heSBiZSBwbGFjZWQgaW5zaWRlIG9mIGEgYDxtYXQtc2xpZGVyPmAuXG4gKlxuICogSWYgb25lIGlzIHVzZWQsIHRoZSBzZWxlY3RvciBgbWF0U2xpZGVyVGh1bWJgIG11c3QgYmUgdXNlZCwgYW5kIHRoZSBvdXRjb21lIHdpbGwgYmUgYSBub3JtYWxcbiAqIHNsaWRlci4gSWYgdHdvIGFyZSB1c2VkLCB0aGUgc2VsZWN0b3JzIGBtYXRTbGlkZXJTdGFydFRodW1iYCBhbmQgYG1hdFNsaWRlckVuZFRodW1iYCBtdXN0IGJlXG4gKiB1c2VkLCBhbmQgdGhlIG91dGNvbWUgd2lsbCBiZSBhIHJhbmdlIHNsaWRlciB3aXRoIHR3byBzbGlkZXIgdGh1bWJzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTbGlkZXJUaHVtYl0sIGlucHV0W21hdFNsaWRlclN0YXJ0VGh1bWJdLCBpbnB1dFttYXRTbGlkZXJFbmRUaHVtYl0nLFxuICBleHBvcnRBczogJ21hdFNsaWRlclRodW1iJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtc2xpZGVyX19pbnB1dCcsXG4gICAgJ3R5cGUnOiAncmFuZ2UnLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGZvY3VzKSc6ICdfZm9jdXMuZW1pdCgpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogTWF0U2xpZGVyVGh1bWIsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJUaHVtYiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8vICoqIElNUE9SVEFOVCBOT1RFICoqXG4gIC8vXG4gIC8vIFRoZSB3YXkgYHZhbHVlYCBpcyBpbXBsZW1lbnRlZCBmb3IgTWF0U2xpZGVyVGh1bWIgZG9lc24ndCBmb2xsb3cgdHlwaWNhbCBBbmd1bGFyIGNvbnZlbnRpb25zLlxuICAvLyBOb3JtYWxseSB3ZSB3b3VsZCBkZWZpbmUgYSBwcml2YXRlIHZhcmlhYmxlIGBfdmFsdWVgIGFzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgc2xpZGVyIHRodW1iIGlucHV0LiBUaGUgc291cmNlIG9mIHRydXRoIGZvciB0aGUgdmFsdWUgb2YgdGhlIHNsaWRlciBpbnB1dHMgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBkZWNpZGVkIGZvciB1cyBieSBNREMgdG8gYmUgdGhlIHZhbHVlIGF0dHJpYnV0ZSBvbiB0aGUgc2xpZGVyIHRodW1iIGlucHV0cy4gVGhpcyBpc1xuICAvLyBiZWNhdXNlIHRoZSBNREMgZm91bmRhdGlvbiBhbmQgYWRhcHRlciBleHBlY3QgdGhhdCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcbiAgLy8gZm9yIHRoZSBzbGlkZXIgaW5wdXRzLlxuICAvL1xuICAvLyBBbHNvLCBub3RlIHRoYXQgdGhlIHZhbHVlIGF0dHJpYnV0ZSBpcyBjb21wbGV0ZWx5IGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSB2YWx1ZSBwcm9wZXJ0eS5cblxuICAvKiogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhpcyBzbGlkZXIgaW5wdXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl9ob3N0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykpO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBOdW1iZXJJbnB1dCkge1xuICAgIGNvbnN0IHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodik7XG5cbiAgICAvLyBJZiB0aGUgZm91bmRhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLCB3ZSBuZWVkIHRvXG4gICAgLy8gcmVsYXkgYW55IHZhbHVlIHVwZGF0ZXMgdG8gaXQgc28gdGhhdCBpdCBjYW4gdXBkYXRlIHRoZSBVSS5cbiAgICBpZiAodGhpcy5fc2xpZGVyLl9pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5fc2xpZGVyLl9zZXRWYWx1ZSh2YWx1ZSwgdGhpcy5fdGh1bWJQb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNldHVwIGZvciB0aGUgTURDIGZvdW5kYXRpb24uXG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgYCR7dmFsdWV9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2xpZGVyIGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBzdGFydHMgYmVpbmcgZHJhZ2dlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdTdGFydDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlciB0aHVtYiBzdG9wcyBiZWluZyBkcmFnZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ0VuZDogRXZlbnRFbWl0dGVyPE1hdFNsaWRlckRyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVyRHJhZ0V2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIE1hdFNsaWRlclRodW1iIGlzIGJsdXJyZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfYmx1cjogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIE1hdFNsaWRlclRodW1iIGlzIGZvY3VzZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfZm9jdXM6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogVXNlZCB0byBkZXRlcm1pbmUgdGhlIGRpc2FibGVkIHN0YXRlIG9mIHRoZSBNYXRTbGlkZXIgKENvbnRyb2xWYWx1ZUFjY2Vzc29yKS5cbiAgICogRm9yIHJhbmdlZCBzbGlkZXJzLCB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIE1hdFNsaWRlciBkZXBlbmRzIG9uIHRoZSBjb21iaW5lZCBzdGF0ZSBvZiB0aGVcbiAgICogc3RhcnQgYW5kIGVuZCBpbnB1dHMuIFNlZSBNYXRTbGlkZXIuX3VwZGF0ZURpc2FibGVkLlxuICAgKi9cbiAgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGVcbiAgICogY29udHJvbCdzIHZhbHVlIGNoYW5nZXMgaW4gdGhlIFVJIChDb250cm9sVmFsdWVBY2Nlc3NvcikuXG4gICAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSBvblxuICAgKiBpbml0aWFsaXphdGlvbiB0byB1cGRhdGUgdGhlIGZvcm0gbW9kZWwgb24gYmx1ciAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLlxuICAgKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIEluZGljYXRlcyB3aGljaCBzbGlkZXIgdGh1bWIgdGhpcyBpbnB1dCBjb3JyZXNwb25kcyB0by4gKi9cbiAgX3RodW1iUG9zaXRpb246IFRodW1iID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyU3RhcnRUaHVtYicpXG4gICAgPyBUaHVtYi5TVEFSVFxuICAgIDogVGh1bWIuRU5EO1xuXG4gIC8qKiBUaGUgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIHRoZSBnbG9iYWwgZG9jdW1lbnQgcmVmZXJlbmNlLiAqL1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFRoZSBob3N0IG5hdGl2ZSBIVE1MIGlucHV0IGVsZW1lbnQuICovXG4gIF9ob3N0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZXIpKSBwcml2YXRlIHJlYWRvbmx5IF9zbGlkZXI6IE1hdFNsaWRlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICApIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIHRoaXMuX2hvc3RFbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIEJ5IGNhbGxpbmcgdGhpcyBpbiBuZ09uSW5pdCgpIHdlIGd1YXJhbnRlZSB0aGF0IHRoZSBzaWJsaW5nIHNsaWRlcnMgaW5pdGlhbCB2YWx1ZSBieVxuICAgIC8vIGhhcyBhbHJlYWR5IGJlZW4gc2V0IGJ5IHRoZSB0aW1lIHdlIHJlYWNoIG5nQWZ0ZXJWaWV3SW5pdCgpLlxuICAgIHRoaXMuX2luaXRpYWxpemVJbnB1dFZhbHVlQXR0cmlidXRlKCk7XG4gICAgdGhpcy5faW5pdGlhbGl6ZUFyaWFWYWx1ZVRleHQoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplSW5wdXRTdGF0ZSgpO1xuICAgIHRoaXMuX2luaXRpYWxpemVJbnB1dFZhbHVlUHJvcGVydHkoKTtcblxuICAgIC8vIFNldHVwIGZvciB0aGUgTURDIGZvdW5kYXRpb24uXG4gICAgaWYgKHRoaXMuX3NsaWRlci5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZHJhZ1N0YXJ0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kcmFnRW5kLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZm9jdXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ibHVyLmNvbXBsZXRlKCk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgX29uQmx1cigpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB0aGlzLl9ibHVyLmVtaXQoKTtcbiAgfVxuXG4gIF9lbWl0RmFrZUV2ZW50KHR5cGU6ICdjaGFuZ2UnIHwgJ2lucHV0Jykge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KHR5cGUpIGFzIGFueTtcbiAgICBldmVudC5fbWF0SXNIYW5kbGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyB0b3VjaGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fc2xpZGVyLl91cGRhdGVEaXNhYmxlZCgpO1xuICB9XG5cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuYmx1cigpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHNsaWRlciBpbnB1dCBjdXJyZW50bHkgaGFzIGZvY3VzLiAqL1xuICBfaXNGb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLl9ob3N0RWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtaW4sIG1heCwgYW5kIHN0ZXAgcHJvcGVydGllcyBvbiB0aGUgc2xpZGVyIHRodW1iIGlucHV0LlxuICAgKlxuICAgKiBNdXN0IGJlIGNhbGxlZCBBRlRFUiB0aGUgc2libGluZyBzbGlkZXIgdGh1bWIgaW5wdXQgaXMgZ3VhcmFudGVlZCB0byBoYXZlIGhhZCBpdHMgdmFsdWVcbiAgICogYXR0cmlidXRlIHZhbHVlIHNldC4gRm9yIGEgcmFuZ2Ugc2xpZGVyLCB0aGUgbWluIGFuZCBtYXggb2YgdGhlIHNsaWRlciB0aHVtYiBpbnB1dCBkZXBlbmRzIG9uXG4gICAqIHRoZSB2YWx1ZSBvZiBpdHMgc2libGluZyBzbGlkZXIgdGh1bWIgaW5wdXRzIHZhbHVlLlxuICAgKlxuICAgKiBNdXN0IGJlIGNhbGxlZCBCRUZPUkUgdGhlIHZhbHVlIHByb3BlcnR5IGlzIHNldC4gSW4gdGhlIGNhc2Ugd2hlcmUgdGhlIG1pbiBhbmQgbWF4IGhhdmUgbm90XG4gICAqIHlldCBiZWVuIHNldCBhbmQgd2UgYXJlIHNldHRpbmcgdGhlIGlucHV0IHZhbHVlIHByb3BlcnR5IHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgbmF0aXZlXG4gICAqIGlucHV0cyBkZWZhdWx0IG1pbiBvciBtYXguIFRoZSB2YWx1ZSBwcm9wZXJ0eSB3b3VsZCBub3QgYmUgc2V0IHRvIG91ciBkZXNpcmVkIHZhbHVlLCBidXRcbiAgICogaW5zdGVhZCBiZSBjYXBwZWQgYXQgZWl0aGVyIHRoZSBkZWZhdWx0IG1pbiBvciBtYXguXG4gICAqXG4gICAqL1xuICBfaW5pdGlhbGl6ZUlucHV0U3RhdGUoKTogdm9pZCB7XG4gICAgY29uc3QgbWluID0gdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCdtYXRTbGlkZXJFbmRUaHVtYicpXG4gICAgICA/IHRoaXMuX3NsaWRlci5fZ2V0SW5wdXQoVGh1bWIuU1RBUlQpLnZhbHVlXG4gICAgICA6IHRoaXMuX3NsaWRlci5taW47XG4gICAgY29uc3QgbWF4ID0gdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCdtYXRTbGlkZXJTdGFydFRodW1iJylcbiAgICAgID8gdGhpcy5fc2xpZGVyLl9nZXRJbnB1dChUaHVtYi5FTkQpLnZhbHVlXG4gICAgICA6IHRoaXMuX3NsaWRlci5tYXg7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWluID0gYCR7bWlufWA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQubWF4ID0gYCR7bWF4fWA7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuc3RlcCA9IGAke3RoaXMuX3NsaWRlci5zdGVwfWA7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgcHJvcGVydHkgb24gdGhlIHNsaWRlciB0aHVtYiBpbnB1dC5cbiAgICpcbiAgICogTXVzdCBiZSBjYWxsZWQgQUZURVIgdGhlIG1pbiBhbmQgbWF4IGhhdmUgYmVlbiBzZXQuIEluIHRoZSBjYXNlIHdoZXJlIHRoZSBtaW4gYW5kIG1heCBoYXZlIG5vdFxuICAgKiB5ZXQgYmVlbiBzZXQgYW5kIHdlIGFyZSBzZXR0aW5nIHRoZSBpbnB1dCB2YWx1ZSBwcm9wZXJ0eSB0byBhIHZhbHVlIG91dHNpZGUgb2YgdGhlIG5hdGl2ZVxuICAgKiBpbnB1dHMgZGVmYXVsdCBtaW4gb3IgbWF4LiBUaGUgdmFsdWUgcHJvcGVydHkgd291bGQgbm90IGJlIHNldCB0byBvdXIgZGVzaXJlZCB2YWx1ZSwgYnV0XG4gICAqIGluc3RlYWQgYmUgY2FwcGVkIGF0IGVpdGhlciB0aGUgZGVmYXVsdCBtaW4gb3IgbWF4LlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZUlucHV0VmFsdWVQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC52YWx1ZSA9IGAke3RoaXMudmFsdWV9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoZSB2YWx1ZSBhdHRyaWJ1dGUgaXMgaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIE11c3QgYmUgY2FsbGVkIEJFRk9SRSB0aGUgbWluIGFuZCBtYXggYXJlIHNldC4gRm9yIGEgcmFuZ2Ugc2xpZGVyLCB0aGUgbWluIGFuZCBtYXggb2YgdGhlXG4gICAqIHNsaWRlciB0aHVtYiBpbnB1dCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiBpdHMgc2libGluZyBzbGlkZXIgdGh1bWIgaW5wdXRzIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZUlucHV0VmFsdWVBdHRyaWJ1dGUoKTogdm9pZCB7XG4gICAgLy8gT25seSBzZXQgdGhlIGRlZmF1bHQgdmFsdWUgaWYgYW4gaW5pdGlhbCB2YWx1ZSBoYXMgbm90IGFscmVhZHkgYmVlbiBwcm92aWRlZC5cbiAgICBpZiAoIXRoaXMuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyRW5kVGh1bWInKVxuICAgICAgICA/IHRoaXMuX3NsaWRlci5tYXhcbiAgICAgICAgOiB0aGlzLl9zbGlkZXIubWluO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYXJpYS12YWx1ZXRleHQgYXR0cmlidXRlLlxuICAgKlxuICAgKiBNdXN0IGJlIGNhbGxlZCBBRlRFUiB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHNldC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBzbGlkZXIncyBwYXJlbnRcbiAgICogYGRpc3BsYXlXaXRoYCBmdW5jdGlvbiBpcyB1c2VkIHRvIHNldCB0aGUgYGFyaWEtdmFsdWV0ZXh0YCBhdHRyaWJ1dGUuXG4gICAqL1xuICBwcml2YXRlIF9pbml0aWFsaXplQXJpYVZhbHVlVGV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgdGhpcy5fc2xpZGVyLmRpc3BsYXlXaXRoKHRoaXMudmFsdWUpKTtcbiAgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbmNvbnN0IF9NYXRTbGlkZXJNaXhpbkJhc2UgPSBtaXhpbkNvbG9yKFxuICBtaXhpbkRpc2FibGVSaXBwbGUoXG4gICAgY2xhc3Mge1xuICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cbiAgICB9LFxuICApLFxuICAncHJpbWFyeScsXG4pO1xuXG4vKipcbiAqIEFsbG93cyB1c2VycyB0byBzZWxlY3QgZnJvbSBhIHJhbmdlIG9mIHZhbHVlcyBieSBtb3ZpbmcgdGhlIHNsaWRlciB0aHVtYi4gSXQgaXMgc2ltaWxhciBpblxuICogYmVoYXZpb3IgdG8gdGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJyYW5nZVwiPmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtc2xpZGVyIG1kYy1zbGlkZXInLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tcmFuZ2VdJzogJ19pc1JhbmdlKCknLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1kYy1zbGlkZXItLWRpc2NyZXRlXSc6ICdkaXNjcmV0ZScsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS10aWNrLW1hcmtzXSc6ICdzaG93VGlja01hcmtzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfbm9vcEFuaW1hdGlvbnMnLFxuICB9LFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBpbnB1dHM6IFsnY29sb3InLCAnZGlzYWJsZVJpcHBsZSddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJcbiAgZXh0ZW5kcyBfTWF0U2xpZGVyTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95XG57XG4gIC8qKiBUaGUgc2xpZGVyIHRodW1iKHMpLiAqL1xuICBAVmlld0NoaWxkcmVuKE1hdFNsaWRlclZpc3VhbFRodW1iKSBfdGh1bWJzOiBRdWVyeUxpc3Q8TWF0U2xpZGVyVmlzdWFsVGh1bWI+O1xuXG4gIC8qKiBUaGUgYWN0aXZlIHNlY3Rpb24gb2YgdGhlIHNsaWRlciB0cmFjay4gKi9cbiAgQFZpZXdDaGlsZCgndHJhY2tBY3RpdmUnKSBfdHJhY2tBY3RpdmU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgc2xpZGVycyBoaWRkZW4gcmFuZ2UgaW5wdXQocykuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0U2xpZGVyVGh1bWIsIHtkZXNjZW5kYW50czogZmFsc2V9KVxuICBfaW5wdXRzOiBRdWVyeUxpc3Q8TWF0U2xpZGVyVGh1bWI+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3NldERpc2FibGVkKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KSk7XG4gICAgdGhpcy5fdXBkYXRlSW5wdXRzRGlzYWJsZWRTdGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyBhIG51bWVyaWMgdmFsdWUgbGFiZWwgdXBvbiBwcmVzc2luZyB0aGUgdGh1bWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNjcmV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzY3JldGU7XG4gIH1cbiAgc2V0IGRpc2NyZXRlKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2NyZXRlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2NyZXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyB0aWNrIG1hcmtzIGFsb25nIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93VGlja01hcmtzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93VGlja01hcmtzO1xuICB9XG4gIHNldCBzaG93VGlja01hcmtzKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3Nob3dUaWNrTWFya3MgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd1RpY2tNYXJrczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG4gIHNldCBtaW4odjogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9taW4gPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9taW4pO1xuICAgIHRoaXMuX3JlaW5pdGlhbGl6ZSgpO1xuICB9XG4gIHByaXZhdGUgX21pbjogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuICBzZXQgbWF4KHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fbWF4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fbWF4KTtcbiAgICB0aGlzLl9yZWluaXRpYWxpemUoKTtcbiAgfVxuICBwcml2YXRlIF9tYXg6IG51bWJlciA9IDEwMDtcblxuICAvKiogVGhlIHZhbHVlcyBhdCB3aGljaCB0aGUgdGh1bWIgd2lsbCBzbmFwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICB9XG4gIHNldCBzdGVwKHY6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fc3RlcCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX3N0ZXApO1xuICAgIHRoaXMuX3JlaW5pdGlhbGl6ZSgpO1xuICB9XG4gIHByaXZhdGUgX3N0ZXA6IG51bWJlciA9IDE7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGZvcm1hdCB0aGUgdmFsdWUgYmVmb3JlIGl0IGlzIGRpc3BsYXllZFxuICAgKiBpbiB0aGUgdGh1bWIgbGFiZWwuIENhbiBiZSB1c2VkIHRvIGZvcm1hdCB2ZXJ5IGxhcmdlIG51bWJlciBpbiBvcmRlclxuICAgKiBmb3IgdGhlbSB0byBmaXQgaW50byB0aGUgc2xpZGVyIHRodW1iLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheVdpdGg6ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSAodmFsdWU6IG51bWJlcikgPT4gYCR7dmFsdWV9YDtcblxuICAvKiogSW5zdGFuY2Ugb2YgdGhlIE1EQyBzbGlkZXIgZm91bmRhdGlvbiBmb3IgdGhpcyBzbGlkZXIuICovXG4gIHByaXZhdGUgX2ZvdW5kYXRpb24gPSBuZXcgTURDU2xpZGVyRm91bmRhdGlvbihuZXcgU2xpZGVyQWRhcHRlcih0aGlzKSk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvdW5kYXRpb24gaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gIF9pbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIHRoZSBnbG9iYWwgZG9jdW1lbnQgcmVmZXJlbmNlLiAqL1xuICBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdFZpZXcgb2YgdGhlIGluamVjdGVkIGRvY3VtZW50IGlmXG4gICAqIGF2YWlsYWJsZSBvciBmYWxsYmFjayB0byBnbG9iYWwgd2luZG93IHJlZmVyZW5jZS5cbiAgICovXG4gIF93aW5kb3c6IFdpbmRvdztcblxuICAvKiogVXNlZCB0byBrZWVwIHRyYWNrIG9mICYgcmVuZGVyIHRoZSBhY3RpdmUgJiBpbmFjdGl2ZSB0aWNrIG1hcmtzIG9uIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIF90aWNrTWFya3M6IFRpY2tNYXJrW107XG5cbiAgLyoqIFRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBzdGFydCB0aHVtYi4gKi9cbiAgX3N0YXJ0VmFsdWVJbmRpY2F0b3JUZXh0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBlbmQgdGh1bWIuICovXG4gIF9lbmRWYWx1ZUluZGljYXRvclRleHQ6IHN0cmluZztcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGhhdmUgYmVlbiBkaXNhYmxlZC4gKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBicm93c2VyIHN1cHBvcnRzIHBvaW50ZXIgZXZlbnRzLlxuICAgKlxuICAgKiBXZSBleGNsdWRlIGlPUyB0byBtaXJyb3IgdGhlIE1EQyBGb3VuZGF0aW9uLiBUaGUgTURDIEZvdW5kYXRpb24gY2Fubm90IHVzZSBwb2ludGVyIGV2ZW50cyBvblxuICAgKiBpT1MgYmVjYXVzZSBvZiB0aGlzIG9wZW4gYnVnIC0gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTIyMDE5Ni5cbiAgICovXG4gIHByaXZhdGUgX1NVUFBPUlRTX1BPSU5URVJfRVZFTlRTID1cbiAgICB0eXBlb2YgUG9pbnRlckV2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhIVBvaW50ZXJFdmVudCAmJiAhdGhpcy5fcGxhdGZvcm0uSU9TO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gY2hhbmdlcyB0byB0aGUgZGlyZWN0aW9uYWxpdHkgKExUUiAvIFJUTCkgY29udGV4dCBmb3IgdGhlIGFwcGxpY2F0aW9uLiAqL1xuICBwcml2YXRlIF9kaXJDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogT2JzZXJ2ZXIgdXNlZCB0byBtb25pdG9yIHNpemUgY2hhbmdlcyBpbiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9yZXNpemVPYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXIgfCBudWxsO1xuXG4gIC8qKiBUaW1lb3V0IHVzZWQgdG8gZGVib3VuY2UgcmVzaXplIGxpc3RlbmVycy4gKi9cbiAgcHJpdmF0ZSBfcmVzaXplVGltZXI6IG51bWJlcjtcblxuICAvKiogQ2FjaGVkIGRpbWVuc2lvbnMgb2YgdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfY2FjaGVkSG9zdFJlY3Q6IERPTVJlY3QgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICByZWFkb25seSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcmVhZG9ubHkgX2dsb2JhbENoYW5nZUFuZElucHV0TGlzdGVuZXI6IEdsb2JhbENoYW5nZUFuZElucHV0TGlzdGVuZXI8J2lucHV0JyB8ICdjaGFuZ2UnPixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgcmVhZG9ubHkgX2dsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIHRoaXMuX3dpbmRvdyA9IHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fb25EaXJDaGFuZ2UoKSk7XG4gICAgdGhpcy5fYXR0YWNoVUlTeW5jRXZlbnRMaXN0ZW5lcigpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIF92YWxpZGF0ZVRodW1icyh0aGlzLl9pc1JhbmdlKCksIHRoaXMuX2dldFRodW1iKFRodW1iLlNUQVJUKSwgdGhpcy5fZ2V0VGh1bWIoVGh1bWIuRU5EKSk7XG4gICAgICBfdmFsaWRhdGVJbnB1dHMoXG4gICAgICAgIHRoaXMuX2lzUmFuZ2UoKSxcbiAgICAgICAgdGhpcy5fZ2V0SW5wdXRFbGVtZW50KFRodW1iLlNUQVJUKSxcbiAgICAgICAgdGhpcy5fZ2V0SW5wdXRFbGVtZW50KFRodW1iLkVORCksXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9mb3VuZGF0aW9uLmluaXQoKTtcbiAgICAgIHRoaXMuX2ZvdW5kYXRpb24ubGF5b3V0KCk7XG4gICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB0aGlzLl9vYnNlcnZlSG9zdFJlc2l6ZSgpO1xuICAgIH1cbiAgICAvLyBUaGUgTURDIGZvdW5kYXRpb24gcmVxdWlyZXMgYWNjZXNzIHRvIHRoZSB2aWV3IGFuZCBjb250ZW50IGNoaWxkcmVuIG9mIHRoZSBNYXRTbGlkZXIuIEluXG4gICAgLy8gb3JkZXIgdG8gYWNjZXNzIHRoZSB2aWV3IGFuZCBjb250ZW50IGNoaWxkcmVuIG9mIE1hdFNsaWRlciB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgY2hhbmdlXG4gICAgLy8gZGV0ZWN0aW9uIHJ1bnMgYW5kIG1hdGVyaWFsaXplcyB0aGVtLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIGluaXQoKSBhbmQgbGF5b3V0KCkgaW5cbiAgICAvLyBuZ0FmdGVyVmlld0luaXQoKS5cbiAgICAvL1xuICAgIC8vIFRoZSBNREMgZm91bmRhdGlvbiB0aGVuIHVzZXMgdGhlIGluZm9ybWF0aW9uIGl0IGdhdGhlcnMgZnJvbSB0aGUgRE9NIHRvIGNvbXB1dGUgYW4gaW5pdGlhbFxuICAgIC8vIHZhbHVlIGZvciB0aGUgdGlja01hcmtzIGFycmF5LiBJdCB0aGVuIHRyaWVzIHRvIHVwZGF0ZSB0aGUgY29tcG9uZW50IGRhdGEsIGJ1dCBiZWNhdXNlIGl0IGlzXG4gICAgLy8gdXBkYXRpbmcgdGhlIGNvbXBvbmVudCBkYXRhIEFGVEVSIGNoYW5nZSBkZXRlY3Rpb24gYWxyZWFkeSByYW4sIHdlIHdpbGwgZ2V0IGEgY2hhbmdlZCBhZnRlclxuICAgIC8vIGNoZWNrZWQgZXJyb3IuIEJlY2F1c2Ugb2YgdGhpcywgd2UgbmVlZCB0byBmb3JjZSBjaGFuZ2UgZGV0ZWN0aW9uIHRvIHVwZGF0ZSB0aGUgVUkgd2l0aCB0aGVcbiAgICAvLyBuZXcgc3RhdGUuXG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2ZvdW5kYXRpb24uZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZXNpemVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyID0gbnVsbDtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVzaXplVGltZXIpO1xuICAgIHRoaXMuX3JlbW92ZVVJU3luY0V2ZW50TGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudCBpcyByaWdodCB0byBsZWZ0LiAqL1xuICBfaXNSVEwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQga2VlcHMgc3luYyB0aGUgc2xpZGVyIFVJIGFuZCB0aGUgZm91bmRhdGlvbiBpbiBzeW5jLlxuICAgKlxuICAgKiBCZWNhdXNlIHRoZSBNREMgRm91bmRhdGlvbiBzdG9yZXMgdGhlIHZhbHVlIG9mIHRoZSBib3VuZGluZyBjbGllbnQgcmVjdCB3aGVuIGxheW91dCBpcyBjYWxsZWQsXG4gICAqIHdlIG5lZWQgdG8ga2VlcCBjYWxsaW5nIGxheW91dCB0byBhdm9pZCB0aGUgcG9zaXRpb24gb2YgdGhlIHNsaWRlciBnZXR0aW5nIG91dCBvZiBzeW5jIHdpdGhcbiAgICogd2hhdCB0aGUgZm91bmRhdGlvbiBoYXMgc3RvcmVkLiBJZiB3ZSBkb24ndCBkbyB0aGlzLCB0aGUgZm91bmRhdGlvbiB3aWxsIG5vdCBiZSBhYmxlIHRvXG4gICAqIGNvcnJlY3RseSBjYWxjdWxhdGUgdGhlIHNsaWRlciB2YWx1ZSBvbiBjbGljay9zbGlkZS5cbiAgICovXG4gIF9hdHRhY2hVSVN5bmNFdmVudExpc3RlbmVyKCk6IHZvaWQge1xuICAgIC8vIEltcGxlbWVudGF0aW9uIGRldGFpbDogSXQgbWF5IHNlZW0gd2VpcmQgdGhhdCB3ZSBhcmUgdXNpbmcgXCJtb3VzZWVudGVyXCIgaW5zdGVhZCBvZlxuICAgIC8vIFwibW91c2Vkb3duXCIgYXMgdGhlIGRlZmF1bHQgZm9yIHdoZW4gYSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgcG9pbnRlciBldmVudHMuIFdoaWxlIHdlXG4gICAgLy8gd291bGQgcHJlZmVyIHRvIHVzZSBcIm1vdXNlZG93blwiIGFzIHRoZSBkZWZhdWx0LCBmb3Igc29tZSByZWFzb24gaXQgZG9lcyBub3Qgd29yayAodGhlXG4gICAgLy8gY2FsbGJhY2sgaXMgbmV2ZXIgdHJpZ2dlcmVkKS5cbiAgICBpZiAodGhpcy5fU1VQUE9SVFNfUE9JTlRFUl9FVkVOVFMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX2xheW91dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fbGF5b3V0KTtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgIHRoaXMuX2xheW91dCxcbiAgICAgICAgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgZXZlbnQgbGlzdGVuZXIgdGhhdCBrZWVwcyBzeW5jIHRoZSBzbGlkZXIgVUkgYW5kIHRoZSBmb3VuZGF0aW9uIGluIHN5bmMuICovXG4gIF9yZW1vdmVVSVN5bmNFdmVudExpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9TVVBQT1JUU19QT0lOVEVSX0VWRU5UUykge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fbGF5b3V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9sYXlvdXQpO1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgdGhpcy5fbGF5b3V0LFxuICAgICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxsaW5nIGxheW91dCAobmVlZGVkIGZvciBhZGRpbmcgJiByZW1vdmluZyBhbiBldmVudCBsaXN0ZW5lcikuICovXG4gIHByaXZhdGUgX2xheW91dCA9ICgpID0+IHRoaXMuX2ZvdW5kYXRpb24ubGF5b3V0KCk7XG5cbiAgLyoqXG4gICAqIFJlaW5pdGlhbGl6ZXMgdGhlIHNsaWRlciBmb3VuZGF0aW9uIGFuZCBpbnB1dCBzdGF0ZShzKS5cbiAgICpcbiAgICogVGhlIE1EQyBGb3VuZGF0aW9uIGRvZXMgbm90IHN1cHBvcnQgY2hhbmdpbmcgc29tZSBzbGlkZXIgYXR0cmlidXRlcyBhZnRlciBpdCBoYXMgYmVlblxuICAgKiBpbml0aWFsaXplZCAoZS5nLiBtaW4sIG1heCwgYW5kIHN0ZXApLiBUbyBjb250aW51ZSBzdXBwb3J0aW5nIHRoaXMgZmVhdHVyZSwgd2UgbmVlZCB0b1xuICAgKiBkZXN0cm95IHRoZSBmb3VuZGF0aW9uIGFuZCByZS1pbml0aWFsaXplIGV2ZXJ5dGhpbmcgd2hlbmV2ZXIgd2UgbWFrZSB0aGVzZSBjaGFuZ2VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5fZm91bmRhdGlvbi5kZXN0cm95KCk7XG4gICAgICBpZiAodGhpcy5faXNSYW5nZSgpKSB7XG4gICAgICAgIHRoaXMuX2dldElucHV0KFRodW1iLlNUQVJUKS5faW5pdGlhbGl6ZUlucHV0U3RhdGUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2dldElucHV0KFRodW1iLkVORCkuX2luaXRpYWxpemVJbnB1dFN0YXRlKCk7XG4gICAgICB0aGlzLl9mb3VuZGF0aW9uLmluaXQoKTtcbiAgICAgIHRoaXMuX2ZvdW5kYXRpb24ubGF5b3V0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXBkYXRpbmcgdGhlIHNsaWRlciBmb3VuZGF0aW9uIGFmdGVyIGEgZGlyIGNoYW5nZS4gKi9cbiAgcHJpdmF0ZSBfb25EaXJDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gY2FsbCBsYXlvdXQoKSBhIGZldyBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGRpciBjaGFuZ2UgY2FsbGJhY2tcbiAgICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byB3YWl0IHVudGlsIHRoZSBib3VuZGluZyBjbGllbnQgcmVjdCBvZiB0aGUgc2xpZGVyIGhhcyB1cGRhdGVkLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9mb3VuZGF0aW9uLmxheW91dCgpLCAxMCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdmFsdWUgb2YgYSBzbGlkZXIgdGh1bWIuICovXG4gIF9zZXRWYWx1ZSh2YWx1ZTogbnVtYmVyLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQge1xuICAgIHRodW1iUG9zaXRpb24gPT09IFRodW1iLlNUQVJUXG4gICAgICA/IHRoaXMuX2ZvdW5kYXRpb24uc2V0VmFsdWVTdGFydCh2YWx1ZSlcbiAgICAgIDogdGhpcy5fZm91bmRhdGlvbi5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIE1hdFNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfc2V0RGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBkaXNhYmxlIHRoZSBzbGlkZXIgYWZ0ZXIgdGhlIGZvdW5kYXRpb24gaGFzIGJlZW4gaW5pdGlhbGl6ZWQsXG4gICAgLy8gd2UgbmVlZCB0byBpbmZvcm0gdGhlIGZvdW5kYXRpb24gYnkgY2FsbGluZyBgc2V0RGlzYWJsZWRgLiBBbHNvLCB3ZSBjYW4ndCBjYWxsXG4gICAgLy8gdGhpcyBiZWZvcmUgaW5pdGlhbGl6aW5nIHRoZSBmb3VuZGF0aW9uIGJlY2F1c2UgaXQgd2lsbCB0aHJvdyBlcnJvcnMuXG4gICAgaWYgKHRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9mb3VuZGF0aW9uLnNldERpc2FibGVkKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIGluZGl2aWR1YWwgc2xpZGVyIHRodW1iKHMpIChDb250cm9sVmFsdWVBY2Nlc3NvcikuICovXG4gIHByaXZhdGUgX3VwZGF0ZUlucHV0c0Rpc2FibGVkU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9nZXRJbnB1dChUaHVtYi5FTkQpLl9kaXNhYmxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5faXNSYW5nZSgpKSB7XG4gICAgICAgIHRoaXMuX2dldElucHV0KFRodW1iLlNUQVJUKS5fZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaXMgYSByYW5nZWQgc2xpZGVyLiAqL1xuICBfaXNSYW5nZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5wdXRzLmxlbmd0aCA9PT0gMjtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBiYXNlZCBvbiB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIGlucHV0cyAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBfdXBkYXRlRGlzYWJsZWQoKTogdm9pZCB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLl9pbnB1dHM/LnNvbWUoaW5wdXQgPT4gaW5wdXQuX2Rpc2FibGVkKSB8fCBmYWxzZTtcbiAgICB0aGlzLl9zZXREaXNhYmxlZChkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIHRodW1iIGlucHV0IG9mIHRoZSBnaXZlbiB0aHVtYiBwb3NpdGlvbi4gKi9cbiAgX2dldElucHV0KHRodW1iUG9zaXRpb246IFRodW1iKTogTWF0U2xpZGVyVGh1bWIge1xuICAgIHJldHVybiB0aHVtYlBvc2l0aW9uID09PSBUaHVtYi5FTkQgPyB0aGlzLl9pbnB1dHM/Lmxhc3QhIDogdGhpcy5faW5wdXRzPy5maXJzdCE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIHRodW1iIEhUTUwgaW5wdXQgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gdGh1bWIgcG9zaXRpb24uICovXG4gIF9nZXRJbnB1dEVsZW1lbnQodGh1bWJQb3NpdGlvbjogVGh1bWIpOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SW5wdXQodGh1bWJQb3NpdGlvbik/Ll9ob3N0RWxlbWVudDtcbiAgfVxuXG4gIF9nZXRUaHVtYih0aHVtYlBvc2l0aW9uOiBUaHVtYik6IE1hdFNsaWRlclZpc3VhbFRodW1iIHtcbiAgICByZXR1cm4gdGh1bWJQb3NpdGlvbiA9PT0gVGh1bWIuRU5EID8gdGhpcy5fdGh1bWJzPy5sYXN0ISA6IHRoaXMuX3RodW1icz8uZmlyc3QhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNsaWRlciB0aHVtYiBIVE1MIGVsZW1lbnQgb2YgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uLiAqL1xuICBfZ2V0VGh1bWJFbGVtZW50KHRodW1iUG9zaXRpb246IFRodW1iKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9nZXRUaHVtYih0aHVtYlBvc2l0aW9uKT8uX2dldEhvc3RFbGVtZW50KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIGtub2IgSFRNTCBlbGVtZW50IG9mIHRoZSBnaXZlbiB0aHVtYiBwb3NpdGlvbi4gKi9cbiAgX2dldEtub2JFbGVtZW50KHRodW1iUG9zaXRpb246IFRodW1iKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9nZXRUaHVtYih0aHVtYlBvc2l0aW9uKT8uX2dldEtub2IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzbGlkZXIgdmFsdWUgaW5kaWNhdG9yIGNvbnRhaW5lciBIVE1MIGVsZW1lbnQgb2YgdGhlIGdpdmVuIHRodW1iXG4gICAqIHBvc2l0aW9uLlxuICAgKi9cbiAgX2dldFZhbHVlSW5kaWNhdG9yQ29udGFpbmVyRWxlbWVudCh0aHVtYlBvc2l0aW9uOiBUaHVtYik6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VGh1bWIodGh1bWJQb3NpdGlvbikuX2dldFZhbHVlSW5kaWNhdG9yQ29udGFpbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgaW5kaWNhdG9yIHRleHQgb2YgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uIHVzaW5nIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogVXNlcyB0aGUgYGRpc3BsYXlXaXRoYCBmdW5jdGlvbiBpZiBvbmUgaGFzIGJlZW4gcHJvdmlkZWQuIE90aGVyd2lzZSwgaXQganVzdCB1c2VzIHRoZVxuICAgKiBudW1lcmljIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKi9cbiAgX3NldFZhbHVlSW5kaWNhdG9yVGV4dCh2YWx1ZTogbnVtYmVyLCB0aHVtYlBvc2l0aW9uOiBUaHVtYikge1xuICAgIHRodW1iUG9zaXRpb24gPT09IFRodW1iLlNUQVJUXG4gICAgICA/ICh0aGlzLl9zdGFydFZhbHVlSW5kaWNhdG9yVGV4dCA9IHRoaXMuZGlzcGxheVdpdGgodmFsdWUpKVxuICAgICAgOiAodGhpcy5fZW5kVmFsdWVJbmRpY2F0b3JUZXh0ID0gdGhpcy5kaXNwbGF5V2l0aCh2YWx1ZSkpO1xuICAgIHRoaXMuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdGV4dCBmb3IgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uLiAqL1xuICBfZ2V0VmFsdWVJbmRpY2F0b3JUZXh0KHRodW1iUG9zaXRpb246IFRodW1iKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGh1bWJQb3NpdGlvbiA9PT0gVGh1bWIuU1RBUlRcbiAgICAgID8gdGhpcy5fc3RhcnRWYWx1ZUluZGljYXRvclRleHRcbiAgICAgIDogdGhpcy5fZW5kVmFsdWVJbmRpY2F0b3JUZXh0O1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgdGhlIGNsYXNzIG5hbWUgZm9yIGEgSFRNTCBlbGVtZW50LiAqL1xuICBfZ2V0VGlja01hcmtDbGFzcyh0aWNrTWFyazogVGlja01hcmspOiBzdHJpbmcge1xuICAgIHJldHVybiB0aWNrTWFyayA9PT0gVGlja01hcmsuQUNUSVZFXG4gICAgICA/ICdtZGMtc2xpZGVyX190aWNrLW1hcmstLWFjdGl2ZSdcbiAgICAgIDogJ21kYy1zbGlkZXJfX3RpY2stbWFyay0taW5hY3RpdmUnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciB0aHVtYiByaXBwbGVzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX2lzUmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8ICEhdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8uZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGltZW5zaW9ucyBvZiB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBfZ2V0SG9zdERpbWVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlZEhvc3RSZWN0IHx8IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIC8qKiBTdGFydHMgb2JzZXJ2aW5nIGFuZCB1cGRhdGluZyB0aGUgc2xpZGVyIGlmIHRoZSBob3N0IGNoYW5nZXMgaXRzIHNpemUuICovXG4gIHByaXZhdGUgX29ic2VydmVIb3N0UmVzaXplKCkge1xuICAgIGlmICh0eXBlb2YgUmVzaXplT2JzZXJ2ZXIgPT09ICd1bmRlZmluZWQnIHx8ICFSZXNpemVPYnNlcnZlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1EQyBvbmx5IHVwZGF0ZXMgdGhlIHNsaWRlciB3aGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplZCB3aGljaFxuICAgIC8vIGRvZXNuJ3QgY2FwdHVyZSBjaGFuZ2VzIG9mIHRoZSBjb250YWluZXIgaXRzZWxmLiBXZSB1c2UgYSByZXNpemVcbiAgICAvLyBvYnNlcnZlciB0byBlbnN1cmUgdGhhdCB0aGUgbGF5b3V0IGlzIGNvcnJlY3QgKHNlZSAjMjQ1OTAgYW5kICMyNTI4NikuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgICAvLyBUcmlnZ2VyaW5nIGEgbGF5b3V0IHdoaWxlIHRoZSB1c2VyIGlzIGRyYWdnaW5nIGNhbiB0aHJvdyBvZmYgdGhlIGFsaWdubWVudC5cbiAgICAgICAgaWYgKHRoaXMuX2lzQWN0aXZlKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVzaXplVGltZXIpO1xuICAgICAgICB0aGlzLl9yZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIFRoZSBgbGF5b3V0YCBjYWxsIGlzIGdvaW5nIHRvIGNhbGwgYGdldEJvdW5kaW5nQ2xpZW50UmVjdGAgdG8gdXBkYXRlIHRoZSBkaW1lbnNpb25zXG4gICAgICAgICAgLy8gb2YgdGhlIGhvc3QuIFNpbmNlIHRoZSBgUmVzaXplT2JzZXJ2ZXJgIGFscmVhZHkgY2FsY3VsYXRlZCB0aGVtLCB3ZSBjYW4gc2F2ZSBzb21lXG4gICAgICAgICAgLy8gd29yayBieSByZXR1cm5pbmcgdGhlbSBpbnN0ZWFkIG9mIGhhdmluZyB0byBjaGVjayB0aGUgRE9NIGFnYWluLlxuICAgICAgICAgIGlmICghdGhpcy5faXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVkSG9zdFJlY3QgPSBlbnRyaWVzWzBdPy5jb250ZW50UmVjdDtcbiAgICAgICAgICAgIHRoaXMuX2xheW91dCgpO1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVkSG9zdFJlY3QgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTApO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogV2hldGhlciBhbnkgb2YgdGhlIHRodW1icyBhcmUgY3VycmVudGx5IGFjdGl2ZS4gKi9cbiAgcHJpdmF0ZSBfaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFRodW1iKFRodW1iLlNUQVJUKS5faXNBY3RpdmUgfHwgdGhpcy5fZ2V0VGh1bWIoVGh1bWIuRU5EKS5faXNBY3RpdmU7XG4gIH1cbn1cblxuLyoqIFRoZSBNRENTbGlkZXJBZGFwdGVyIGltcGxlbWVudGF0aW9uLiAqL1xuY2xhc3MgU2xpZGVyQWRhcHRlciBpbXBsZW1lbnRzIE1EQ1NsaWRlckFkYXB0ZXIge1xuICAvKiogVGhlIGdsb2JhbCBldmVudCBsaXN0ZW5lciBzdWJzY3JpcHRpb24gdXNlZCB0byBoYW5kbGUgZXZlbnRzIG9uIHRoZSBzbGlkZXIgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9nbG9iYWxFdmVudFN1YnNjcmlwdGlvbnMgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgLyoqIFRoZSBNREMgRm91bmRhdGlvbnMgaGFuZGxlciBmdW5jdGlvbiBmb3Igc3RhcnQgaW5wdXQgY2hhbmdlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfc3RhcnRJbnB1dENoYW5nZUV2ZW50SGFuZGxlcjogU3BlY2lmaWNFdmVudExpc3RlbmVyPEV2ZW50VHlwZT47XG5cbiAgLyoqIFRoZSBNREMgRm91bmRhdGlvbnMgaGFuZGxlciBmdW5jdGlvbiBmb3IgZW5kIGlucHV0IGNoYW5nZSBldmVudHMuICovXG4gIHByaXZhdGUgX2VuZElucHV0Q2hhbmdlRXZlbnRIYW5kbGVyOiBTcGVjaWZpY0V2ZW50TGlzdGVuZXI8RXZlbnRUeXBlPjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9kZWxlZ2F0ZTogTWF0U2xpZGVyKSB7XG4gICAgdGhpcy5fZ2xvYmFsRXZlbnRTdWJzY3JpcHRpb25zLmFkZCh0aGlzLl9zdWJzY3JpYmVUb1NsaWRlcklucHV0RXZlbnRzKCdjaGFuZ2UnKSk7XG4gICAgdGhpcy5fZ2xvYmFsRXZlbnRTdWJzY3JpcHRpb25zLmFkZCh0aGlzLl9zdWJzY3JpYmVUb1NsaWRlcklucHV0RXZlbnRzKCdpbnB1dCcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIFwiY2hhbmdlXCIgYW5kIFwiaW5wdXRcIiBldmVudHMgb24gdGhlIHNsaWRlciBpbnB1dHMuXG4gICAqXG4gICAqIEV4cG9zZXMgYSBjYWxsYmFjayB0byBhbGxvdyB0aGUgTURDIEZvdW5kYXRpb25zIFwiY2hhbmdlXCIgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgZm9yIFwicmVhbFwiXG4gICAqIGV2ZW50cy5cbiAgICpcbiAgICogKiogSU1QT1JUQU5UIE5PVEUgKipcbiAgICpcbiAgICogV2UgYmxvY2sgYWxsIFwicmVhbFwiIGNoYW5nZSBhbmQgaW5wdXQgZXZlbnRzIGFuZCBlbWl0IGZha2UgZXZlbnRzIGZyb20gI2VtaXRDaGFuZ2VFdmVudCBhbmRcbiAgICogI2VtaXRJbnB1dEV2ZW50LCBpbnN0ZWFkLiBXZSBkbyB0aGlzIGJlY2F1c2UgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgTURDIHNsaWRlciB3b24ndCB0cmlnZ2VyIGFsbFxuICAgKiBvZiB0aGUgY29ycmVjdCBjaGFuZ2UgYW5kIGlucHV0IGV2ZW50cywgYnV0IGl0IHdpbGwgY2FsbCAjZW1pdENoYW5nZUV2ZW50IGFuZCAjZW1pdElucHV0RXZlbnRcbiAgICogYXQgdGhlIGNvcnJlY3QgdGltZXMuIFRoaXMgYWxsb3dzIHVzZXJzIHRvIGxpc3RlbiBmb3IgdGhlc2UgZXZlbnRzIGRpcmVjdGx5IG9uIHRoZSBzbGlkZXJcbiAgICogaW5wdXQgYXMgdGhleSB3b3VsZCB3aXRoIGEgbmF0aXZlIHJhbmdlIGlucHV0LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9TbGlkZXJJbnB1dEV2ZW50cyh0eXBlOiAnY2hhbmdlJyB8ICdpbnB1dCcpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuX2dsb2JhbENoYW5nZUFuZElucHV0TGlzdGVuZXIubGlzdGVuKHR5cGUsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHRodW1iUG9zaXRpb24gPSB0aGlzLl9nZXRJbnB1dFRodW1iUG9zaXRpb24oZXZlbnQudGFyZ2V0KTtcblxuICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGUgZXZlbnQgaXNuJ3QgZnJvbSBhIHRodW1iIGlucHV0LlxuICAgICAgaWYgKHRodW1iUG9zaXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBEbyBub3RoaW5nIGlmIHRoZSBldmVudCBpcyBcImZha2VcIi5cbiAgICAgIGlmICgoZXZlbnQgYXMgYW55KS5fbWF0SXNIYW5kbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmVudCBcInJlYWxcIiBldmVudHMgZnJvbSByZWFjaGluZyBlbmQgdXNlcnMuXG4gICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblxuICAgICAgLy8gUmVsYXkgXCJyZWFsXCIgY2hhbmdlIGV2ZW50cyB0byB0aGUgTURDIEZvdW5kYXRpb24uXG4gICAgICBpZiAodHlwZSA9PT0gJ2NoYW5nZScpIHtcbiAgICAgICAgdGhpcy5fY2FsbENoYW5nZUV2ZW50SGFuZGxlcihldmVudCwgdGh1bWJQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2FsbHMgdGhlIE1EQyBGb3VuZGF0aW9ucyBjaGFuZ2UgZXZlbnQgaGFuZGxlciBmb3IgdGhlIHNwZWNpZmllZCB0aHVtYiBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfY2FsbENoYW5nZUV2ZW50SGFuZGxlcihldmVudDogRXZlbnQsIHRodW1iUG9zaXRpb246IFRodW1iKSB7XG4gICAgaWYgKHRodW1iUG9zaXRpb24gPT09IFRodW1iLlNUQVJUKSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Q2hhbmdlRXZlbnRIYW5kbGVyKGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZW5kSW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTYXZlIHRoZSBldmVudCBoYW5kbGVyIHNvIGl0IGNhbiBiZSB1c2VkIGluIG91ciBnbG9iYWwgY2hhbmdlIGV2ZW50IGxpc3RlbmVyIHN1YnNjcmlwdGlvbi4gKi9cbiAgcHJpdmF0ZSBfc2F2ZUNoYW5nZUV2ZW50SGFuZGxlcih0aHVtYlBvc2l0aW9uOiBUaHVtYiwgaGFuZGxlcjogU3BlY2lmaWNFdmVudExpc3RlbmVyPEV2ZW50VHlwZT4pIHtcbiAgICBpZiAodGh1bWJQb3NpdGlvbiA9PT0gVGh1bWIuU1RBUlQpIHtcbiAgICAgIHRoaXMuX3N0YXJ0SW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbmRJbnB1dENoYW5nZUV2ZW50SGFuZGxlciA9IGhhbmRsZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRodW1iIHBvc2l0aW9uIG9mIHRoZSBnaXZlbiBldmVudCB0YXJnZXQuXG4gICAqIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZXZlbnQgdGFyZ2V0IGRvZXMgbm90IGNvcnJlc3BvbmQgdG8gYSBzbGlkZXIgdGh1bWIgaW5wdXQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRJbnB1dFRodW1iUG9zaXRpb24odGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwpOiBUaHVtYiB8IG51bGwge1xuICAgIGlmICh0YXJnZXQgPT09IHRoaXMuX2RlbGVnYXRlLl9nZXRJbnB1dEVsZW1lbnQoVGh1bWIuRU5EKSkge1xuICAgICAgcmV0dXJuIFRodW1iLkVORDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlLl9pc1JhbmdlKCkgJiYgdGFyZ2V0ID09PSB0aGlzLl9kZWxlZ2F0ZS5fZ2V0SW5wdXRFbGVtZW50KFRodW1iLlNUQVJUKSkge1xuICAgICAgcmV0dXJuIFRodW1iLlNUQVJUO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFdlIG1hbnVhbGx5IGFzc2lnbiBmdW5jdGlvbnMgaW5zdGVhZCBvZiB1c2luZyBwcm90b3R5cGUgbWV0aG9kcyBiZWNhdXNlXG4gIC8vIE1EQyBjbG9iYmVycyB0aGUgdmFsdWVzIG90aGVyd2lzZS5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRlcmlhbC1jb21wb25lbnRzL21hdGVyaWFsLWNvbXBvbmVudHMtd2ViL3B1bGwvNjI1NlxuXG4gIGhhc0NsYXNzID0gKGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gIH07XG4gIGFkZENsYXNzID0gKGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH07XG4gIHJlbW92ZUNsYXNzID0gKGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gIH07XG4gIGdldEF0dHJpYnV0ZSA9IChhdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZS5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICB9O1xuICBhZGRUaHVtYkNsYXNzID0gKGNsYXNzTmFtZTogc3RyaW5nLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl9nZXRUaHVtYkVsZW1lbnQodGh1bWJQb3NpdGlvbikuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICB9O1xuICByZW1vdmVUaHVtYkNsYXNzID0gKGNsYXNzTmFtZTogc3RyaW5nLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl9nZXRUaHVtYkVsZW1lbnQodGh1bWJQb3NpdGlvbikuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9O1xuICBnZXRJbnB1dFZhbHVlID0gKHRodW1iUG9zaXRpb246IFRodW1iKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuX2dldElucHV0RWxlbWVudCh0aHVtYlBvc2l0aW9uKS52YWx1ZTtcbiAgfTtcbiAgc2V0SW5wdXRWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl9nZXRJbnB1dEVsZW1lbnQodGh1bWJQb3NpdGlvbikudmFsdWUgPSB2YWx1ZTtcbiAgfTtcbiAgZ2V0SW5wdXRBdHRyaWJ1dGUgPSAoYXR0cmlidXRlOiBzdHJpbmcsIHRodW1iUG9zaXRpb246IFRodW1iKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlLl9nZXRJbnB1dEVsZW1lbnQodGh1bWJQb3NpdGlvbikuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gIH07XG4gIHNldElucHV0QXR0cmlidXRlID0gKGF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZGVsZWdhdGUuX2dldElucHV0RWxlbWVudCh0aHVtYlBvc2l0aW9uKTtcblxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogcmVtb3ZlIHRoaXMgY2hlY2sgb25jZSB0aGlzIGNvbXBvbmVudCBpc1xuICAgIC8vIGFkZGVkIHRvIHRoZSBpbnRlcm5hbCBhbGxvd2xpc3QgZm9yIGNhbGxpbmcgc2V0QXR0cmlidXRlLlxuXG4gICAgLy8gRXhwbGljaXRseSBjaGVjayB0aGUgYXR0cmlidXRlIHdlIGFyZSBzZXR0aW5nIHRvIHByZXZlbnQgeHNzLlxuICAgIHN3aXRjaCAoYXR0cmlidXRlKSB7XG4gICAgICBjYXNlICdhcmlhLXZhbHVldGV4dCc6XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCB2YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21pbic6XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbWluJywgdmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbWF4JywgdmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3ZhbHVlJzpcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdGVwJzpcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdzdGVwJywgdmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IEVycm9yKGBUcmllZCB0byBzZXQgaW52YWxpZCBhdHRyaWJ1dGUgJHthdHRyaWJ1dGV9IG9uIHRoZSBtZGMtc2xpZGVyLmApO1xuICAgIH1cbiAgfTtcbiAgcmVtb3ZlSW5wdXRBdHRyaWJ1dGUgPSAoYXR0cmlidXRlOiBzdHJpbmcsIHRodW1iUG9zaXRpb246IFRodW1iKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2dldElucHV0RWxlbWVudCh0aHVtYlBvc2l0aW9uKS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgfTtcbiAgZm9jdXNJbnB1dCA9ICh0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl9nZXRJbnB1dEVsZW1lbnQodGh1bWJQb3NpdGlvbikuZm9jdXMoKTtcbiAgfTtcbiAgaXNJbnB1dEZvY3VzZWQgPSAodGh1bWJQb3NpdGlvbjogVGh1bWIpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuX2dldElucHV0KHRodW1iUG9zaXRpb24pLl9pc0ZvY3VzZWQoKTtcbiAgfTtcbiAgZ2V0VGh1bWJLbm9iV2lkdGggPSAodGh1bWJQb3NpdGlvbjogVGh1bWIpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZS5fZ2V0S25vYkVsZW1lbnQodGh1bWJQb3NpdGlvbikuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIH07XG4gIGdldFRodW1iQm91bmRpbmdDbGllbnRSZWN0ID0gKHRodW1iUG9zaXRpb246IFRodW1iKTogRE9NUmVjdCA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlLl9nZXRUaHVtYkVsZW1lbnQodGh1bWJQb3NpdGlvbikuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH07XG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCA9ICgpOiBET01SZWN0ID0+IHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuX2dldEhvc3REaW1lbnNpb25zKCk7XG4gIH07XG4gIGdldFZhbHVlSW5kaWNhdG9yQ29udGFpbmVyV2lkdGggPSAodGh1bWJQb3NpdGlvbjogVGh1bWIpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZS5fZ2V0VmFsdWVJbmRpY2F0b3JDb250YWluZXJFbGVtZW50KHRodW1iUG9zaXRpb24pLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAud2lkdGg7XG4gIH07XG4gIGlzUlRMID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZS5faXNSVEwoKTtcbiAgfTtcbiAgc2V0VGh1bWJTdHlsZVByb3BlcnR5ID0gKHByb3BlcnR5TmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl9nZXRUaHVtYkVsZW1lbnQodGh1bWJQb3NpdGlvbikuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSk7XG4gIH07XG4gIHJlbW92ZVRodW1iU3R5bGVQcm9wZXJ0eSA9IChwcm9wZXJ0eU5hbWU6IHN0cmluZywgdGh1bWJQb3NpdGlvbjogVGh1bWIpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5fZ2V0VGh1bWJFbGVtZW50KHRodW1iUG9zaXRpb24pLnN0eWxlLnJlbW92ZVByb3BlcnR5KHByb3BlcnR5TmFtZSk7XG4gIH07XG4gIHNldFRyYWNrQWN0aXZlU3R5bGVQcm9wZXJ0eSA9IChwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl90cmFja0FjdGl2ZS5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpO1xuICB9O1xuICByZW1vdmVUcmFja0FjdGl2ZVN0eWxlUHJvcGVydHkgPSAocHJvcGVydHlOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5fdHJhY2tBY3RpdmUubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xuICB9O1xuICBzZXRWYWx1ZUluZGljYXRvclRleHQgPSAodmFsdWU6IG51bWJlciwgdGh1bWJQb3NpdGlvbjogVGh1bWIpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5fc2V0VmFsdWVJbmRpY2F0b3JUZXh0KHZhbHVlLCB0aHVtYlBvc2l0aW9uKTtcbiAgfTtcbiAgZ2V0VmFsdWVUb0FyaWFWYWx1ZVRleHRGbiA9ICgpOiAoKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZykgfCBudWxsID0+IHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuZGlzcGxheVdpdGg7XG4gIH07XG4gIHVwZGF0ZVRpY2tNYXJrcyA9ICh0aWNrTWFya3M6IFRpY2tNYXJrW10pOiB2b2lkID0+IHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5fdGlja01hcmtzID0gdGlja01hcmtzO1xuICAgIHRoaXMuX2RlbGVnYXRlLl9jZHIubWFya0ZvckNoZWNrKCk7XG4gIH07XG4gIHNldFBvaW50ZXJDYXB0dXJlID0gKHBvaW50ZXJJZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpO1xuICB9O1xuICBlbWl0Q2hhbmdlRXZlbnQgPSAodmFsdWU6IG51bWJlciwgdGh1bWJQb3NpdGlvbjogVGh1bWIpOiB2b2lkID0+IHtcbiAgICAvLyBXZSBibG9jayBhbGwgcmVhbCBzbGlkZXIgaW5wdXQgY2hhbmdlIGV2ZW50cyBhbmQgZW1pdCBmYWtlIGNoYW5nZSBldmVudHMgZnJvbSBoZXJlLCBpbnN0ZWFkLlxuICAgIC8vIFdlIGRvIHRoaXMgYmVjYXVzZSB0aGUgbWRjIGltcGxlbWVudGF0aW9uIG9mIHRoZSBzbGlkZXIgZG9lcyBub3QgdHJpZ2dlciByZWFsIGNoYW5nZSBldmVudHNcbiAgICAvLyBvbiBwb2ludGVyIHVwIChvbmx5IG9uIGxlZnQgb3IgcmlnaHQgYXJyb3cga2V5IGRvd24pLlxuICAgIC8vXG4gICAgLy8gQnkgc3RvcHBpbmcgcmVhbCBjaGFuZ2UgZXZlbnRzIGZyb20gcmVhY2hpbmcgdXNlcnMsIGFuZCBkaXNwYXRjaGluZyBmYWtlIGNoYW5nZSBldmVudHNcbiAgICAvLyAod2hpY2ggd2UgYWxsb3cgdG8gcmVhY2ggdGhlIHVzZXIpIHRoZSBzbGlkZXIgaW5wdXRzIGNoYW5nZSBldmVudHMgYXJlIHRyaWdnZXJlZCBhdCB0aGVcbiAgICAvLyBhcHByb3ByaWF0ZSB0aW1lcy4gVGhpcyBhbGxvd3MgdXNlcnMgdG8gbGlzdGVuIGZvciBjaGFuZ2UgZXZlbnRzIGRpcmVjdGx5IG9uIHRoZSBzbGlkZXJcbiAgICAvLyBpbnB1dCBhcyB0aGV5IHdvdWxkIHdpdGggYSBuYXRpdmUgcmFuZ2UgaW5wdXQuXG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9kZWxlZ2F0ZS5fZ2V0SW5wdXQodGh1bWJQb3NpdGlvbik7XG4gICAgaW5wdXQuX2VtaXRGYWtlRXZlbnQoJ2NoYW5nZScpO1xuICAgIGlucHV0Ll9vbkNoYW5nZSh2YWx1ZSk7XG4gICAgaW5wdXQudmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gIH07XG4gIGVtaXRJbnB1dEV2ZW50ID0gKHZhbHVlOiBudW1iZXIsIHRodW1iUG9zaXRpb246IFRodW1iKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2dldElucHV0KHRodW1iUG9zaXRpb24pLl9lbWl0RmFrZUV2ZW50KCdpbnB1dCcpO1xuICB9O1xuICBlbWl0RHJhZ1N0YXJ0RXZlbnQgPSAodmFsdWU6IG51bWJlciwgdGh1bWJQb3NpdGlvbjogVGh1bWIpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2RlbGVnYXRlLl9nZXRJbnB1dCh0aHVtYlBvc2l0aW9uKTtcbiAgICBpbnB1dC5kcmFnU3RhcnQuZW1pdCh7c291cmNlOiBpbnB1dCwgcGFyZW50OiB0aGlzLl9kZWxlZ2F0ZSwgdmFsdWV9KTtcbiAgfTtcbiAgZW1pdERyYWdFbmRFdmVudCA9ICh2YWx1ZTogbnVtYmVyLCB0aHVtYlBvc2l0aW9uOiBUaHVtYik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZGVsZWdhdGUuX2dldElucHV0KHRodW1iUG9zaXRpb24pO1xuICAgIGlucHV0LmRyYWdFbmQuZW1pdCh7c291cmNlOiBpbnB1dCwgcGFyZW50OiB0aGlzLl9kZWxlZ2F0ZSwgdmFsdWV9KTtcbiAgfTtcbiAgcmVnaXN0ZXJFdmVudEhhbmRsZXIgPSA8SyBleHRlbmRzIEV2ZW50VHlwZT4oXG4gICAgZXZ0VHlwZTogSyxcbiAgICBoYW5kbGVyOiBTcGVjaWZpY0V2ZW50TGlzdGVuZXI8Sz4sXG4gICk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBoYW5kbGVyKTtcbiAgfTtcbiAgZGVyZWdpc3RlckV2ZW50SGFuZGxlciA9IDxLIGV4dGVuZHMgRXZlbnRUeXBlPihcbiAgICBldnRUeXBlOiBLLFxuICAgIGhhbmRsZXI6IFNwZWNpZmljRXZlbnRMaXN0ZW5lcjxLPixcbiAgKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIpO1xuICB9O1xuICByZWdpc3RlclRodW1iRXZlbnRIYW5kbGVyID0gPEsgZXh0ZW5kcyBFdmVudFR5cGU+KFxuICAgIHRodW1iUG9zaXRpb246IFRodW1iLFxuICAgIGV2dFR5cGU6IEssXG4gICAgaGFuZGxlcjogU3BlY2lmaWNFdmVudExpc3RlbmVyPEs+LFxuICApOiB2b2lkID0+IHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5fZ2V0VGh1bWJFbGVtZW50KHRodW1iUG9zaXRpb24pLmFkZEV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlcik7XG4gIH07XG4gIGRlcmVnaXN0ZXJUaHVtYkV2ZW50SGFuZGxlciA9IDxLIGV4dGVuZHMgRXZlbnRUeXBlPihcbiAgICB0aHVtYlBvc2l0aW9uOiBUaHVtYixcbiAgICBldnRUeXBlOiBLLFxuICAgIGhhbmRsZXI6IFNwZWNpZmljRXZlbnRMaXN0ZW5lcjxLPixcbiAgKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2dldFRodW1iRWxlbWVudCh0aHVtYlBvc2l0aW9uKT8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBoYW5kbGVyKTtcbiAgfTtcbiAgcmVnaXN0ZXJJbnB1dEV2ZW50SGFuZGxlciA9IDxLIGV4dGVuZHMgRXZlbnRUeXBlPihcbiAgICB0aHVtYlBvc2l0aW9uOiBUaHVtYixcbiAgICBldnRUeXBlOiBLLFxuICAgIGhhbmRsZXI6IFNwZWNpZmljRXZlbnRMaXN0ZW5lcjxLPixcbiAgKTogdm9pZCA9PiB7XG4gICAgaWYgKGV2dFR5cGUgPT09ICdjaGFuZ2UnKSB7XG4gICAgICB0aGlzLl9zYXZlQ2hhbmdlRXZlbnRIYW5kbGVyKHRodW1iUG9zaXRpb24sIGhhbmRsZXIgYXMgU3BlY2lmaWNFdmVudExpc3RlbmVyPEV2ZW50VHlwZT4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5fZ2V0SW5wdXRFbGVtZW50KHRodW1iUG9zaXRpb24pPy5hZGRFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIpO1xuICAgIH1cbiAgfTtcbiAgZGVyZWdpc3RlcklucHV0RXZlbnRIYW5kbGVyID0gPEsgZXh0ZW5kcyBFdmVudFR5cGU+KFxuICAgIHRodW1iUG9zaXRpb246IFRodW1iLFxuICAgIGV2dFR5cGU6IEssXG4gICAgaGFuZGxlcjogU3BlY2lmaWNFdmVudExpc3RlbmVyPEs+LFxuICApOiB2b2lkID0+IHtcbiAgICBpZiAoZXZ0VHlwZSA9PT0gJ2NoYW5nZScpIHtcbiAgICAgIHRoaXMuX2dsb2JhbEV2ZW50U3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5fZ2V0SW5wdXRFbGVtZW50KHRodW1iUG9zaXRpb24pPy5yZW1vdmVFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIpO1xuICAgIH1cbiAgfTtcbiAgcmVnaXN0ZXJCb2R5RXZlbnRIYW5kbGVyID0gPEsgZXh0ZW5kcyBFdmVudFR5cGU+KFxuICAgIGV2dFR5cGU6IEssXG4gICAgaGFuZGxlcjogU3BlY2lmaWNFdmVudExpc3RlbmVyPEs+LFxuICApOiB2b2lkID0+IHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5fZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIpO1xuICB9O1xuICBkZXJlZ2lzdGVyQm9keUV2ZW50SGFuZGxlciA9IDxLIGV4dGVuZHMgRXZlbnRUeXBlPihcbiAgICBldnRUeXBlOiBLLFxuICAgIGhhbmRsZXI6IFNwZWNpZmljRXZlbnRMaXN0ZW5lcjxLPixcbiAgKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX2RvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBoYW5kbGVyKTtcbiAgfTtcbiAgcmVnaXN0ZXJXaW5kb3dFdmVudEhhbmRsZXIgPSA8SyBleHRlbmRzIEV2ZW50VHlwZT4oXG4gICAgZXZ0VHlwZTogSyxcbiAgICBoYW5kbGVyOiBTcGVjaWZpY0V2ZW50TGlzdGVuZXI8Sz4sXG4gICk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2RlbGVnYXRlLl93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBoYW5kbGVyKTtcbiAgfTtcbiAgZGVyZWdpc3RlcldpbmRvd0V2ZW50SGFuZGxlciA9IDxLIGV4dGVuZHMgRXZlbnRUeXBlPihcbiAgICBldnRUeXBlOiBLLFxuICAgIGhhbmRsZXI6IFNwZWNpZmljRXZlbnRMaXN0ZW5lcjxLPixcbiAgKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fZGVsZWdhdGUuX3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIpO1xuICB9O1xufVxuXG4vKiogRW5zdXJlcyB0aGF0IHRoZXJlIGlzIG5vdCBhbiBpbnZhbGlkIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbGlkZXIgdGh1bWIgaW5wdXRzLiAqL1xuZnVuY3Rpb24gX3ZhbGlkYXRlSW5wdXRzKFxuICBpc1JhbmdlOiBib29sZWFuLFxuICBzdGFydElucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudCxcbiAgZW5kSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50LFxuKTogdm9pZCB7XG4gIGNvbnN0IHN0YXJ0VmFsaWQgPSAhaXNSYW5nZSB8fCBzdGFydElucHV0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ21hdFNsaWRlclN0YXJ0VGh1bWInKTtcbiAgY29uc3QgZW5kVmFsaWQgPSBlbmRJbnB1dEVsZW1lbnQuaGFzQXR0cmlidXRlKGlzUmFuZ2UgPyAnbWF0U2xpZGVyRW5kVGh1bWInIDogJ21hdFNsaWRlclRodW1iJyk7XG5cbiAgaWYgKCFzdGFydFZhbGlkIHx8ICFlbmRWYWxpZCkge1xuICAgIF90aHJvd0ludmFsaWRJbnB1dENvbmZpZ3VyYXRpb25FcnJvcigpO1xuICB9XG59XG5cbi8qKiBWYWxpZGF0ZXMgdGhhdCB0aGUgc2xpZGVyIGhhcyB0aGUgY29ycmVjdCBzZXQgb2YgdGh1bWJzLiAqL1xuZnVuY3Rpb24gX3ZhbGlkYXRlVGh1bWJzKFxuICBpc1JhbmdlOiBib29sZWFuLFxuICBzdGFydDogTWF0U2xpZGVyVmlzdWFsVGh1bWIgfCB1bmRlZmluZWQsXG4gIGVuZDogTWF0U2xpZGVyVmlzdWFsVGh1bWIgfCB1bmRlZmluZWQsXG4pOiB2b2lkIHtcbiAgaWYgKCFlbmQgJiYgKCFpc1JhbmdlIHx8ICFzdGFydCkpIHtcbiAgICBfdGhyb3dJbnZhbGlkSW5wdXRDb25maWd1cmF0aW9uRXJyb3IoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfdGhyb3dJbnZhbGlkSW5wdXRDb25maWd1cmF0aW9uRXJyb3IoKTogdm9pZCB7XG4gIHRocm93IEVycm9yKGBJbnZhbGlkIHNsaWRlciB0aHVtYiBpbnB1dCBjb25maWd1cmF0aW9uIVxuXG4gIFZhbGlkIGNvbmZpZ3VyYXRpb25zIGFyZSBhcyBmb2xsb3dzOlxuXG4gICAgPG1hdC1zbGlkZXI+XG4gICAgICA8aW5wdXQgbWF0U2xpZGVyVGh1bWI+XG4gICAgPC9tYXQtc2xpZGVyPlxuXG4gICAgb3JcblxuICAgIDxtYXQtc2xpZGVyPlxuICAgICAgPGlucHV0IG1hdFNsaWRlclN0YXJ0VGh1bWI+XG4gICAgICA8aW5wdXQgbWF0U2xpZGVyRW5kVGh1bWI+XG4gICAgPC9tYXQtc2xpZGVyPlxuICBgKTtcbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX192YWx1ZS1pbmRpY2F0b3ItY29udGFpbmVyXCIgKm5nSWY9XCJkaXNjcmV0ZVwiICN2YWx1ZUluZGljYXRvckNvbnRhaW5lcj5cbiAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3ZhbHVlLWluZGljYXRvclwiPlxuICAgIDxzcGFuIGNsYXNzPVwibWRjLXNsaWRlcl9fdmFsdWUtaW5kaWNhdG9yLXRleHRcIj57e3ZhbHVlSW5kaWNhdG9yVGV4dH19PC9zcGFuPlxuICA8L2Rpdj5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RodW1iLWtub2JcIiAja25vYj48L2Rpdj5cbjxkaXZcbiAgbWF0UmlwcGxlXG4gIGNsYXNzPVwibWF0LW1kYy1mb2N1cy1pbmRpY2F0b3JcIlxuICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwidHJ1ZVwiPjwvZGl2PlxuIiwiPCEtLSBJbnB1dHMgLS0+XG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG5cbjwhLS0gVHJhY2sgLS0+XG48ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2tcIj5cbiAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RyYWNrLS1pbmFjdGl2ZVwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2stLWFjdGl2ZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX190cmFjay0tYWN0aXZlX2ZpbGxcIiAjdHJhY2tBY3RpdmU+PC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2ICpuZ0lmPVwic2hvd1RpY2tNYXJrc1wiIGNsYXNzPVwibWRjLXNsaWRlcl9fdGljay1tYXJrc1wiICN0aWNrTWFya0NvbnRhaW5lcj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCB0aWNrTWFyayBvZiBfdGlja01hcmtzXCIgW2NsYXNzXT1cIl9nZXRUaWNrTWFya0NsYXNzKHRpY2tNYXJrKVwiPjwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48IS0tIFRodW1icyAtLT5cbjxtYXQtc2xpZGVyLXZpc3VhbC10aHVtYlxuICAqbmdGb3I9XCJsZXQgdGh1bWIgb2YgX2lucHV0c1wiXG4gIFtkaXNjcmV0ZV09XCJkaXNjcmV0ZVwiXG4gIFtkaXNhYmxlUmlwcGxlXT1cIl9pc1JpcHBsZURpc2FibGVkKClcIlxuICBbdGh1bWJQb3NpdGlvbl09XCJ0aHVtYi5fdGh1bWJQb3NpdGlvblwiXG4gIFt2YWx1ZUluZGljYXRvclRleHRdPVwiX2dldFZhbHVlSW5kaWNhdG9yVGV4dCh0aHVtYi5fdGh1bWJQb3NpdGlvbilcIj5cbjwvbWF0LXNsaWRlci12aXN1YWwtdGh1bWI+XG4iXX0=