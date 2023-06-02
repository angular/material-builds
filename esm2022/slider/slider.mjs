/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, Inject, Input, NgZone, Optional, QueryList, ViewChild, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_SLIDER_RANGE_THUMB, MAT_SLIDER_THUMB, MAT_SLIDER, MAT_SLIDER_VISUAL_THUMB, } from './slider-interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/common";
import * as i4 from "./slider-thumb";
// TODO(wagnermaciel): maybe handle the following edge case:
// 1. start dragging discrete slider
// 2. tab to disable checkbox
// 3. without ending drag, disable the slider
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
class MatSlider extends _MatSliderMixinBase {
    /** Whether the slider is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(v) {
        this._disabled = coerceBooleanProperty(v);
        const endInput = this._getInput(2 /* _MatThumb.END */);
        const startInput = this._getInput(1 /* _MatThumb.START */);
        if (endInput) {
            endInput.disabled = this._disabled;
        }
        if (startInput) {
            startInput.disabled = this._disabled;
        }
    }
    /** Whether the slider displays a numeric value label upon pressing the thumb. */
    get discrete() {
        return this._discrete;
    }
    set discrete(v) {
        this._discrete = coerceBooleanProperty(v);
        this._updateValueIndicatorUIs();
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
        const min = coerceNumberProperty(v, this._min);
        if (this._min !== min) {
            this._updateMin(min);
        }
    }
    _updateMin(min) {
        const prevMin = this._min;
        this._min = min;
        this._isRange ? this._updateMinRange({ old: prevMin, new: min }) : this._updateMinNonRange(min);
        this._onMinMaxOrStepChange();
    }
    _updateMinRange(min) {
        const endInput = this._getInput(2 /* _MatThumb.END */);
        const startInput = this._getInput(1 /* _MatThumb.START */);
        const oldEndValue = endInput.value;
        const oldStartValue = startInput.value;
        startInput.min = min.new;
        endInput.min = Math.max(min.new, startInput.value);
        startInput.max = Math.min(endInput.max, endInput.value);
        startInput._updateWidthInactive();
        endInput._updateWidthInactive();
        min.new < min.old
            ? this._onTranslateXChangeBySideEffect(endInput, startInput)
            : this._onTranslateXChangeBySideEffect(startInput, endInput);
        if (oldEndValue !== endInput.value) {
            this._onValueChange(endInput);
        }
        if (oldStartValue !== startInput.value) {
            this._onValueChange(startInput);
        }
    }
    _updateMinNonRange(min) {
        const input = this._getInput(2 /* _MatThumb.END */);
        if (input) {
            const oldValue = input.value;
            input.min = min;
            input._updateThumbUIByValue();
            this._updateTrackUI(input);
            if (oldValue !== input.value) {
                this._onValueChange(input);
            }
        }
    }
    /** The maximum value that the slider can have. */
    get max() {
        return this._max;
    }
    set max(v) {
        const max = coerceNumberProperty(v, this._max);
        if (this._max !== max) {
            this._updateMax(max);
        }
    }
    _updateMax(max) {
        const prevMax = this._max;
        this._max = max;
        this._isRange ? this._updateMaxRange({ old: prevMax, new: max }) : this._updateMaxNonRange(max);
        this._onMinMaxOrStepChange();
    }
    _updateMaxRange(max) {
        const endInput = this._getInput(2 /* _MatThumb.END */);
        const startInput = this._getInput(1 /* _MatThumb.START */);
        const oldEndValue = endInput.value;
        const oldStartValue = startInput.value;
        endInput.max = max.new;
        startInput.max = Math.min(max.new, endInput.value);
        endInput.min = startInput.value;
        endInput._updateWidthInactive();
        startInput._updateWidthInactive();
        max.new > max.old
            ? this._onTranslateXChangeBySideEffect(startInput, endInput)
            : this._onTranslateXChangeBySideEffect(endInput, startInput);
        if (oldEndValue !== endInput.value) {
            this._onValueChange(endInput);
        }
        if (oldStartValue !== startInput.value) {
            this._onValueChange(startInput);
        }
    }
    _updateMaxNonRange(max) {
        const input = this._getInput(2 /* _MatThumb.END */);
        if (input) {
            const oldValue = input.value;
            input.max = max;
            input._updateThumbUIByValue();
            this._updateTrackUI(input);
            if (oldValue !== input.value) {
                this._onValueChange(input);
            }
        }
    }
    /** The values at which the thumb will snap. */
    get step() {
        return this._step;
    }
    set step(v) {
        const step = coerceNumberProperty(v, this._step);
        if (this._step !== step) {
            this._updateStep(step);
        }
    }
    _updateStep(step) {
        this._step = step;
        this._isRange ? this._updateStepRange() : this._updateStepNonRange();
        this._onMinMaxOrStepChange();
    }
    _updateStepRange() {
        const endInput = this._getInput(2 /* _MatThumb.END */);
        const startInput = this._getInput(1 /* _MatThumb.START */);
        const oldEndValue = endInput.value;
        const oldStartValue = startInput.value;
        const prevStartValue = startInput.value;
        endInput.min = this._min;
        startInput.max = this._max;
        endInput.step = this._step;
        startInput.step = this._step;
        if (this._platform.SAFARI) {
            endInput.value = endInput.value;
            startInput.value = startInput.value;
        }
        endInput.min = Math.max(this._min, startInput.value);
        startInput.max = Math.min(this._max, endInput.value);
        startInput._updateWidthInactive();
        endInput._updateWidthInactive();
        endInput.value < prevStartValue
            ? this._onTranslateXChangeBySideEffect(startInput, endInput)
            : this._onTranslateXChangeBySideEffect(endInput, startInput);
        if (oldEndValue !== endInput.value) {
            this._onValueChange(endInput);
        }
        if (oldStartValue !== startInput.value) {
            this._onValueChange(startInput);
        }
    }
    _updateStepNonRange() {
        const input = this._getInput(2 /* _MatThumb.END */);
        if (input) {
            const oldValue = input.value;
            input.step = this._step;
            if (this._platform.SAFARI) {
                input.value = input.value;
            }
            input._updateThumbUIByValue();
            if (oldValue !== input.value) {
                this._onValueChange(input);
            }
        }
    }
    constructor(_ngZone, _cdr, _platform, elementRef, _dir, _globalRippleOptions, animationMode) {
        super(elementRef);
        this._ngZone = _ngZone;
        this._cdr = _cdr;
        this._platform = _platform;
        this._dir = _dir;
        this._globalRippleOptions = _globalRippleOptions;
        this._disabled = false;
        this._discrete = false;
        this._showTickMarks = false;
        this._min = 0;
        this._max = 100;
        this._step = 0;
        /**
         * Function that will be used to format the value before it is displayed
         * in the thumb label. Can be used to format very large number in order
         * for them to fit into the slider thumb.
         */
        this.displayWith = (value) => `${value}`;
        this._rippleRadius = 24;
        // The value indicator tooltip text for the visual slider thumb(s).
        /** @docs-private */
        this.startValueIndicatorText = '';
        /** @docs-private */
        this.endValueIndicatorText = '';
        this._isRange = false;
        /** Whether the slider is rtl. */
        this._isRtl = false;
        this._hasViewInitialized = false;
        /**
         * The width of the tick mark track.
         * The tick mark track width is different from full track width
         */
        this._tickMarkTrackWidth = 0;
        this._hasAnimation = false;
        this._resizeTimer = null;
        /** The radius of the native slider's knob. AFAIK there is no way to avoid hardcoding this. */
        this._knobRadius = 8;
        /** Whether or not the slider thumbs overlap. */
        this._thumbsOverlap = false;
        this._noopAnimations = animationMode === 'NoopAnimations';
        this._dirChangeSubscription = this._dir.change.subscribe(() => this._onDirChange());
        this._isRtl = this._dir.value === 'rtl';
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._updateDimensions();
        }
        const eInput = this._getInput(2 /* _MatThumb.END */);
        const sInput = this._getInput(1 /* _MatThumb.START */);
        this._isRange = !!eInput && !!sInput;
        this._cdr.detectChanges();
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            _validateInputs(this._isRange, this._getInput(2 /* _MatThumb.END */), this._getInput(1 /* _MatThumb.START */));
        }
        const thumb = this._getThumb(2 /* _MatThumb.END */);
        this._rippleRadius = thumb._ripple.radius;
        this._inputPadding = this._rippleRadius - this._knobRadius;
        this._inputOffset = this._knobRadius;
        this._isRange
            ? this._initUIRange(eInput, sInput)
            : this._initUINonRange(eInput);
        this._updateTrackUI(eInput);
        this._updateTickMarkUI();
        this._updateTickMarkTrackUI();
        this._observeHostResize();
        this._cdr.detectChanges();
    }
    _initUINonRange(eInput) {
        eInput.initProps();
        eInput.initUI();
        this._updateValueIndicatorUI(eInput);
        this._hasViewInitialized = true;
        eInput._updateThumbUIByValue();
    }
    _initUIRange(eInput, sInput) {
        eInput.initProps();
        eInput.initUI();
        sInput.initProps();
        sInput.initUI();
        eInput._updateMinMax();
        sInput._updateMinMax();
        eInput._updateStaticStyles();
        sInput._updateStaticStyles();
        this._updateValueIndicatorUIs();
        this._hasViewInitialized = true;
        eInput._updateThumbUIByValue();
        sInput._updateThumbUIByValue();
    }
    ngOnDestroy() {
        this._dirChangeSubscription.unsubscribe();
        this._resizeObserver?.disconnect();
        this._resizeObserver = null;
    }
    /** Handles updating the slider ui after a dir change. */
    _onDirChange() {
        this._isRtl = this._dir.value === 'rtl';
        this._isRange ? this._onDirChangeRange() : this._onDirChangeNonRange();
        this._updateTickMarkUI();
    }
    _onDirChangeRange() {
        const endInput = this._getInput(2 /* _MatThumb.END */);
        const startInput = this._getInput(1 /* _MatThumb.START */);
        endInput._setIsLeftThumb();
        startInput._setIsLeftThumb();
        endInput.translateX = endInput._calcTranslateXByValue();
        startInput.translateX = startInput._calcTranslateXByValue();
        endInput._updateStaticStyles();
        startInput._updateStaticStyles();
        endInput._updateWidthInactive();
        startInput._updateWidthInactive();
        endInput._updateThumbUIByValue();
        startInput._updateThumbUIByValue();
    }
    _onDirChangeNonRange() {
        const input = this._getInput(2 /* _MatThumb.END */);
        input._updateThumbUIByValue();
    }
    /** Starts observing and updating the slider if the host changes its size. */
    _observeHostResize() {
        if (typeof ResizeObserver === 'undefined' || !ResizeObserver) {
            return;
        }
        this._ngZone.runOutsideAngular(() => {
            this._resizeObserver = new ResizeObserver(() => {
                if (this._isActive()) {
                    return;
                }
                if (this._resizeTimer) {
                    clearTimeout(this._resizeTimer);
                }
                this._onResize();
            });
            this._resizeObserver.observe(this._elementRef.nativeElement);
        });
    }
    /** Whether any of the thumbs are currently active. */
    _isActive() {
        return this._getThumb(1 /* _MatThumb.START */)._isActive || this._getThumb(2 /* _MatThumb.END */)._isActive;
    }
    _getValue(thumbPosition = 2 /* _MatThumb.END */) {
        const input = this._getInput(thumbPosition);
        if (!input) {
            return this.min;
        }
        return input.value;
    }
    _skipUpdate() {
        return !!(this._getInput(1 /* _MatThumb.START */)?._skipUIUpdate || this._getInput(2 /* _MatThumb.END */)?._skipUIUpdate);
    }
    /** Stores the slider dimensions. */
    _updateDimensions() {
        this._cachedWidth = this._elementRef.nativeElement.offsetWidth;
        this._cachedLeft = this._elementRef.nativeElement.getBoundingClientRect().left;
    }
    /** Sets the styles for the active portion of the track. */
    _setTrackActiveStyles(styles) {
        const trackStyle = this._trackActive.nativeElement.style;
        trackStyle.left = styles.left;
        trackStyle.right = styles.right;
        trackStyle.transformOrigin = styles.transformOrigin;
        trackStyle.transform = styles.transform;
    }
    /** Returns the translateX positioning for a tick mark based on it's index. */
    _calcTickMarkTransform(index) {
        // TODO(wagnermaciel): See if we can avoid doing this and just using flex to position these.
        const translateX = index * (this._tickMarkTrackWidth / (this._tickMarks.length - 1));
        return `translateX(${translateX}px`;
    }
    // Handlers for updating the slider ui.
    _onTranslateXChange(source) {
        if (!this._hasViewInitialized) {
            return;
        }
        this._updateThumbUI(source);
        this._updateTrackUI(source);
        this._updateOverlappingThumbUI(source);
    }
    _onTranslateXChangeBySideEffect(input1, input2) {
        if (!this._hasViewInitialized) {
            return;
        }
        input1._updateThumbUIByValue();
        input2._updateThumbUIByValue();
    }
    _onValueChange(source) {
        if (!this._hasViewInitialized) {
            return;
        }
        this._updateValueIndicatorUI(source);
        this._updateTickMarkUI();
        this._cdr.detectChanges();
    }
    _onMinMaxOrStepChange() {
        if (!this._hasViewInitialized) {
            return;
        }
        this._updateTickMarkUI();
        this._updateTickMarkTrackUI();
        this._cdr.markForCheck();
    }
    _onResize() {
        if (!this._hasViewInitialized) {
            return;
        }
        this._updateDimensions();
        if (this._isRange) {
            const eInput = this._getInput(2 /* _MatThumb.END */);
            const sInput = this._getInput(1 /* _MatThumb.START */);
            eInput._updateThumbUIByValue();
            sInput._updateThumbUIByValue();
            eInput._updateStaticStyles();
            sInput._updateStaticStyles();
            eInput._updateMinMax();
            sInput._updateMinMax();
            eInput._updateWidthInactive();
            sInput._updateWidthInactive();
        }
        else {
            const eInput = this._getInput(2 /* _MatThumb.END */);
            if (eInput) {
                eInput._updateThumbUIByValue();
            }
        }
        this._updateTickMarkUI();
        this._updateTickMarkTrackUI();
        this._cdr.detectChanges();
    }
    /** Returns true if the slider knobs are overlapping one another. */
    _areThumbsOverlapping() {
        const startInput = this._getInput(1 /* _MatThumb.START */);
        const endInput = this._getInput(2 /* _MatThumb.END */);
        if (!startInput || !endInput) {
            return false;
        }
        return endInput.translateX - startInput.translateX < 20;
    }
    /**
     * Updates the class names of overlapping slider thumbs so
     * that the current active thumb is styled to be on "top".
     */
    _updateOverlappingThumbClassNames(source) {
        const sibling = source.getSibling();
        const sourceThumb = this._getThumb(source.thumbPosition);
        const siblingThumb = this._getThumb(sibling.thumbPosition);
        siblingThumb._hostElement.classList.remove('mdc-slider__thumb--top');
        sourceThumb._hostElement.classList.toggle('mdc-slider__thumb--top', this._thumbsOverlap);
    }
    /** Updates the UI of slider thumbs when they begin or stop overlapping. */
    _updateOverlappingThumbUI(source) {
        if (!this._isRange || this._skipUpdate()) {
            return;
        }
        if (this._thumbsOverlap !== this._areThumbsOverlapping()) {
            this._thumbsOverlap = !this._thumbsOverlap;
            this._updateOverlappingThumbClassNames(source);
        }
    }
    // _MatThumb styles update conditions
    //
    // 1. TranslateX, resize, or dir change
    //    - Reason: The thumb styles need to be updated according to the new translateX.
    // 2. Min, max, or step
    //    - Reason: The value may have silently changed.
    /** Updates the translateX of the given thumb. */
    _updateThumbUI(source) {
        if (this._skipUpdate()) {
            return;
        }
        const thumb = this._getThumb(source.thumbPosition === 2 /* _MatThumb.END */ ? 2 /* _MatThumb.END */ : 1 /* _MatThumb.START */);
        thumb._hostElement.style.transform = `translateX(${source.translateX}px)`;
    }
    // Value indicator text update conditions
    //
    // 1. Value
    //    - Reason: The value displayed needs to be updated.
    // 2. Min, max, or step
    //    - Reason: The value may have silently changed.
    /** Updates the value indicator tooltip ui for the given thumb. */
    _updateValueIndicatorUI(source) {
        if (this._skipUpdate()) {
            return;
        }
        const valuetext = this.displayWith(source.value);
        this._hasViewInitialized
            ? (source._valuetext = valuetext)
            : source._hostElement.setAttribute('aria-valuetext', valuetext);
        if (this.discrete) {
            source.thumbPosition === 1 /* _MatThumb.START */
                ? (this.startValueIndicatorText = valuetext)
                : (this.endValueIndicatorText = valuetext);
            const visualThumb = this._getThumb(source.thumbPosition);
            valuetext.length < 3
                ? visualThumb._hostElement.classList.add('mdc-slider__thumb--short-value')
                : visualThumb._hostElement.classList.remove('mdc-slider__thumb--short-value');
        }
    }
    /** Updates all value indicator UIs in the slider. */
    _updateValueIndicatorUIs() {
        const eInput = this._getInput(2 /* _MatThumb.END */);
        const sInput = this._getInput(1 /* _MatThumb.START */);
        if (eInput) {
            this._updateValueIndicatorUI(eInput);
        }
        if (sInput) {
            this._updateValueIndicatorUI(sInput);
        }
    }
    // Update Tick Mark Track Width
    //
    // 1. Min, max, or step
    //    - Reason: The maximum reachable value may have changed.
    //    - Side note: The maximum reachable value is different from the maximum value set by the
    //      user. For example, a slider with [min: 5, max: 100, step: 10] would have a maximum
    //      reachable value of 95.
    // 2. Resize
    //    - Reason: The position for the maximum reachable value needs to be recalculated.
    /** Updates the width of the tick mark track. */
    _updateTickMarkTrackUI() {
        if (!this.showTickMarks || this._skipUpdate()) {
            return;
        }
        const step = this._step && this._step > 0 ? this._step : 1;
        const maxValue = Math.floor(this.max / step) * step;
        const percentage = (maxValue - this.min) / (this.max - this.min);
        this._tickMarkTrackWidth = this._cachedWidth * percentage - 6;
    }
    // Track active update conditions
    //
    // 1. TranslateX
    //    - Reason: The track active should line up with the new thumb position.
    // 2. Min or max
    //    - Reason #1: The 'active' percentage needs to be recalculated.
    //    - Reason #2: The value may have silently changed.
    // 3. Step
    //    - Reason: The value may have silently changed causing the thumb(s) to shift.
    // 4. Dir change
    //    - Reason: The track active will need to be updated according to the new thumb position(s).
    // 5. Resize
    //    - Reason: The total width the 'active' tracks translateX is based on has changed.
    /** Updates the scale on the active portion of the track. */
    _updateTrackUI(source) {
        if (this._skipUpdate()) {
            return;
        }
        this._isRange
            ? this._updateTrackUIRange(source)
            : this._updateTrackUINonRange(source);
    }
    _updateTrackUIRange(source) {
        const sibling = source.getSibling();
        if (!sibling || !this._cachedWidth) {
            return;
        }
        const activePercentage = Math.abs(sibling.translateX - source.translateX) / this._cachedWidth;
        if (source._isLeftThumb && this._cachedWidth) {
            this._setTrackActiveStyles({
                left: 'auto',
                right: `${this._cachedWidth - sibling.translateX}px`,
                transformOrigin: 'right',
                transform: `scaleX(${activePercentage})`,
            });
        }
        else {
            this._setTrackActiveStyles({
                left: `${sibling.translateX}px`,
                right: 'auto',
                transformOrigin: 'left',
                transform: `scaleX(${activePercentage})`,
            });
        }
    }
    _updateTrackUINonRange(source) {
        this._isRtl
            ? this._setTrackActiveStyles({
                left: 'auto',
                right: '0px',
                transformOrigin: 'right',
                transform: `scaleX(${1 - source.fillPercentage})`,
            })
            : this._setTrackActiveStyles({
                left: '0px',
                right: 'auto',
                transformOrigin: 'left',
                transform: `scaleX(${source.fillPercentage})`,
            });
    }
    // Tick mark update conditions
    //
    // 1. Value
    //    - Reason: a tick mark which was once active might now be inactive or vice versa.
    // 2. Min, max, or step
    //    - Reason #1: the number of tick marks may have changed.
    //    - Reason #2: The value may have silently changed.
    /** Updates the dots along the slider track. */
    _updateTickMarkUI() {
        if (!this.showTickMarks ||
            this.step === undefined ||
            this.min === undefined ||
            this.max === undefined) {
            return;
        }
        const step = this.step > 0 ? this.step : 1;
        this._isRange ? this._updateTickMarkUIRange(step) : this._updateTickMarkUINonRange(step);
        if (this._isRtl) {
            this._tickMarks.reverse();
        }
    }
    _updateTickMarkUINonRange(step) {
        const value = this._getValue();
        let numActive = Math.max(Math.round((value - this.min) / step), 0);
        let numInactive = Math.max(Math.round((this.max - value) / step), 0);
        this._isRtl ? numActive++ : numInactive++;
        this._tickMarks = Array(numActive)
            .fill(0 /* _MatTickMark.ACTIVE */)
            .concat(Array(numInactive).fill(1 /* _MatTickMark.INACTIVE */));
    }
    _updateTickMarkUIRange(step) {
        const endValue = this._getValue();
        const startValue = this._getValue(1 /* _MatThumb.START */);
        const numInactiveBeforeStartThumb = Math.max(Math.floor((startValue - this.min) / step), 0);
        const numActive = Math.max(Math.floor((endValue - startValue) / step) + 1, 0);
        const numInactiveAfterEndThumb = Math.max(Math.floor((this.max - endValue) / step), 0);
        this._tickMarks = Array(numInactiveBeforeStartThumb)
            .fill(1 /* _MatTickMark.INACTIVE */)
            .concat(Array(numActive).fill(0 /* _MatTickMark.ACTIVE */), Array(numInactiveAfterEndThumb).fill(1 /* _MatTickMark.INACTIVE */));
    }
    /** Gets the slider thumb input of the given thumb position. */
    _getInput(thumbPosition) {
        if (thumbPosition === 2 /* _MatThumb.END */ && this._input) {
            return this._input;
        }
        if (this._inputs?.length) {
            return thumbPosition === 1 /* _MatThumb.START */ ? this._inputs.first : this._inputs.last;
        }
        return;
    }
    /** Gets the slider thumb HTML input element of the given thumb position. */
    _getThumb(thumbPosition) {
        return thumbPosition === 2 /* _MatThumb.END */ ? this._thumbs?.last : this._thumbs?.first;
    }
    _setTransition(withAnimation) {
        this._hasAnimation = withAnimation && !this._noopAnimations;
        this._elementRef.nativeElement.classList.toggle('mat-mdc-slider-with-animation', this._hasAnimation);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSlider, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.Platform }, { token: i0.ElementRef }, { token: i2.Directionality, optional: true }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatSlider, selector: "mat-slider", inputs: { color: "color", disableRipple: "disableRipple", disabled: "disabled", discrete: "discrete", showTickMarks: "showTickMarks", min: "min", max: "max", step: "step", displayWith: "displayWith" }, host: { properties: { "class.mdc-slider--range": "_isRange", "class.mdc-slider--disabled": "disabled", "class.mdc-slider--discrete": "discrete", "class.mdc-slider--tick-marks": "showTickMarks", "class._mat-animation-noopable": "_noopAnimations" }, classAttribute: "mat-mdc-slider mdc-slider" }, providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], queries: [{ propertyName: "_input", first: true, predicate: MAT_SLIDER_THUMB, descendants: true }, { propertyName: "_inputs", predicate: MAT_SLIDER_RANGE_THUMB }], viewQueries: [{ propertyName: "_trackActive", first: true, predicate: ["trackActive"], descendants: true }, { propertyName: "_thumbs", predicate: MAT_SLIDER_VISUAL_THUMB, descendants: true }], exportAs: ["matSlider"], usesInheritance: true, ngImport: i0, template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <ng-container *ngIf=\"_cachedWidth\">\n        <div\n          *ngFor=\"let tickMark of _tickMarks; let i = index\"\n          [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n          [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngIf=\"_isRange\"\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"1\"\n  [valueIndicatorText]=\"startValueIndicatorText\">\n</mat-slider-visual-thumb>\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000));border-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color, var(--mdc-theme-primary, #6200ee));opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color, var(--mdc-theme-on-surface, #000));opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color, var(--mdc-theme-primary, #6200ee));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color, var(--mdc-theme-on-surface, #000));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color, #666666);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color, #666666)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height, 6px);top:calc((var(--mdc-slider-inactive-track-height, 4px) - var(--mdc-slider-active-track-height, 6px)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height, 6px)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size, 2px);width:var(--mdc-slider-with-tick-marks-container-size, 2px)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking, 0.0071428571em);font-size:var(--mdc-slider-label-label-text-size, 0.875rem);font-family:var(--mdc-slider-label-label-text-font, Roboto, sans-serif);font-weight:var(--mdc-slider-label-label-text-weight, 500);line-height:var(--mdc-slider-label-label-text-line-height, 1.375rem)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape, 50%);width:var(--mdc-slider-handle-width, 20px);height:var(--mdc-slider-handle-height, 20px);border-style:solid;border-width:calc(var(--mdc-slider-handle-height, 20px) / 2) calc(var(--mdc-slider-handle-width, 20px) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape, 50%)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color, #fff);border-width:var(--mdc-slider-with-overlap-handle-outline-width, 1px)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-mdc-slider-value-indicator-opacity, 1)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: ["discrete", "thumbPosition", "valueIndicatorText"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatSlider };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider', host: {
                        'class': 'mat-mdc-slider mdc-slider',
                        '[class.mdc-slider--range]': '_isRange',
                        '[class.mdc-slider--disabled]': 'disabled',
                        '[class.mdc-slider--discrete]': 'discrete',
                        '[class.mdc-slider--tick-marks]': 'showTickMarks',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                    }, exportAs: 'matSlider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, inputs: ['color', 'disableRipple'], providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <ng-container *ngIf=\"_cachedWidth\">\n        <div\n          *ngFor=\"let tickMark of _tickMarks; let i = index\"\n          [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n          [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngIf=\"_isRange\"\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"1\"\n  [valueIndicatorText]=\"startValueIndicatorText\">\n</mat-slider-visual-thumb>\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000));border-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color, var(--mdc-theme-primary, #6200ee));opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color, var(--mdc-theme-on-surface, #000));opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color, var(--mdc-theme-primary, #6200ee));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color, var(--mdc-theme-on-surface, #000));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color, #666666);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color, #666666)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height, 6px);top:calc((var(--mdc-slider-inactive-track-height, 4px) - var(--mdc-slider-active-track-height, 6px)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height, 6px)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size, 2px);width:var(--mdc-slider-with-tick-marks-container-size, 2px)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking, 0.0071428571em);font-size:var(--mdc-slider-label-label-text-size, 0.875rem);font-family:var(--mdc-slider-label-label-text-font, Roboto, sans-serif);font-weight:var(--mdc-slider-label-label-text-weight, 500);line-height:var(--mdc-slider-label-label-text-line-height, 1.375rem)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape, 50%);width:var(--mdc-slider-handle-width, 20px);height:var(--mdc-slider-handle-height, 20px);border-style:solid;border-width:calc(var(--mdc-slider-handle-height, 20px) / 2) calc(var(--mdc-slider-handle-width, 20px) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape, 50%)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color, #fff);border-width:var(--mdc-slider-with-overlap-handle-outline-width, 1px)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-mdc-slider-value-indicator-opacity, 1)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.Platform }, { type: i0.ElementRef }, { type: i2.Directionality, decorators: [{
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
                }] }]; }, propDecorators: { _trackActive: [{
                type: ViewChild,
                args: ['trackActive']
            }], _thumbs: [{
                type: ViewChildren,
                args: [MAT_SLIDER_VISUAL_THUMB]
            }], _input: [{
                type: ContentChild,
                args: [MAT_SLIDER_THUMB]
            }], _inputs: [{
                type: ContentChildren,
                args: [MAT_SLIDER_RANGE_THUMB, { descendants: false }]
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
/** Ensures that there is not an invalid configuration for the slider thumb inputs. */
function _validateInputs(isRange, endInputElement, startInputElement) {
    const startValid = !isRange || startInputElement?._hostElement.hasAttribute('matSliderStartThumb');
    const endValid = endInputElement._hostElement.hasAttribute(isRange ? 'matSliderEndThumb' : 'matSliderThumb');
    if (!startValid || !endValid) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixHQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBRUwseUJBQXlCLEVBQ3pCLFVBQVUsRUFDVixrQkFBa0IsR0FFbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUUzRSxPQUFPLEVBT0wsc0JBQXNCLEVBQ3RCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsdUJBQXVCLEdBQ3hCLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUU1Qiw0REFBNEQ7QUFDNUQsb0NBQW9DO0FBQ3BDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MsZ0RBQWdEO0FBQ2hELE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUNwQyxrQkFBa0IsQ0FDaEI7SUFDRSxZQUFtQixXQUFvQztRQUFwQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7SUFBRyxDQUFDO0NBQzVELENB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O2dCQStERixJQUFJO3NCQURQLEtBQUs7Z0JBZ0ZHLFdBQVc7c0JBQW5CLEtBQUs7O0FBeWtCUixzRkFBc0Y7QUFDdEYsU0FBUyxlQUFlLENBQ3RCLE9BQWdCLEVBQ2hCLGVBQXVELEVBQ3ZELGlCQUFtQztJQUVuQyxNQUFNLFVBQVUsR0FDZCxDQUFDLE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDbEYsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQ3hELE9BQU8sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUNqRCxDQUFDO0lBRUYsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUM1QixvQ0FBb0MsRUFBRSxDQUFDO0tBQ3hDO0FBQ0gsQ0FBQztBQUVELFNBQVMsb0NBQW9DO0lBQzNDLE1BQU0sS0FBSyxDQUFDOzs7Ozs7Ozs7Ozs7OztJQWNWLENBQUMsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgX01hdFRodW1iLFxuICBfTWF0VGlja01hcmssXG4gIF9NYXRTbGlkZXIsXG4gIF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICBfTWF0U2xpZGVyVGh1bWIsXG4gIF9NYXRTbGlkZXJWaXN1YWxUaHVtYixcbiAgTUFUX1NMSURFUl9SQU5HRV9USFVNQixcbiAgTUFUX1NMSURFUl9USFVNQixcbiAgTUFUX1NMSURFUixcbiAgTUFUX1NMSURFUl9WSVNVQUxfVEhVTUIsXG59IGZyb20gJy4vc2xpZGVyLWludGVyZmFjZSc7XG5cbi8vIFRPRE8od2FnbmVybWFjaWVsKTogbWF5YmUgaGFuZGxlIHRoZSBmb2xsb3dpbmcgZWRnZSBjYXNlOlxuLy8gMS4gc3RhcnQgZHJhZ2dpbmcgZGlzY3JldGUgc2xpZGVyXG4vLyAyLiB0YWIgdG8gZGlzYWJsZSBjaGVja2JveFxuLy8gMy4gd2l0aG91dCBlbmRpbmcgZHJhZywgZGlzYWJsZSB0aGUgc2xpZGVyXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2xpZGVyLlxuY29uc3QgX01hdFNsaWRlck1peGluQmFzZSA9IG1peGluQ29sb3IoXG4gIG1peGluRGlzYWJsZVJpcHBsZShcbiAgICBjbGFzcyB7XG4gICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuICAgIH0sXG4gICksXG4gICdwcmltYXJ5Jyxcbik7XG5cbi8qKlxuICogQWxsb3dzIHVzZXJzIHRvIHNlbGVjdCBmcm9tIGEgcmFuZ2Ugb2YgdmFsdWVzIGJ5IG1vdmluZyB0aGUgc2xpZGVyIHRodW1iLiBJdCBpcyBzaW1pbGFyIGluXG4gKiBiZWhhdmlvciB0byB0aGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1cInJhbmdlXCI+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1zbGlkZXIgbWRjLXNsaWRlcicsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS1yYW5nZV0nOiAnX2lzUmFuZ2UnLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1kYy1zbGlkZXItLWRpc2NyZXRlXSc6ICdkaXNjcmV0ZScsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS10aWNrLW1hcmtzXSc6ICdzaG93VGlja01hcmtzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfbm9vcEFuaW1hdGlvbnMnLFxuICB9LFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBpbnB1dHM6IFsnY29sb3InLCAnZGlzYWJsZVJpcHBsZSddLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NMSURFUiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJcbiAgZXh0ZW5kcyBfTWF0U2xpZGVyTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95LCBfTWF0U2xpZGVyXG57XG4gIC8qKiBUaGUgYWN0aXZlIHBvcnRpb24gb2YgdGhlIHNsaWRlciB0cmFjay4gKi9cbiAgQFZpZXdDaGlsZCgndHJhY2tBY3RpdmUnKSBfdHJhY2tBY3RpdmU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgc2xpZGVyIHRodW1iKHMpLiAqL1xuICBAVmlld0NoaWxkcmVuKE1BVF9TTElERVJfVklTVUFMX1RIVU1CKSBfdGh1bWJzOiBRdWVyeUxpc3Q8X01hdFNsaWRlclZpc3VhbFRodW1iPjtcblxuICAvKiogVGhlIHNsaWRlcnMgaGlkZGVuIHJhbmdlIGlucHV0KHMpLiAqL1xuICBAQ29udGVudENoaWxkKE1BVF9TTElERVJfVEhVTUIpIF9pbnB1dDogX01hdFNsaWRlclRodW1iO1xuXG4gIC8qKiBUaGUgc2xpZGVycyBoaWRkZW4gcmFuZ2UgaW5wdXQocykuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX1NMSURFUl9SQU5HRV9USFVNQiwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pXG4gIF9pbnB1dHM6IFF1ZXJ5TGlzdDxfTWF0U2xpZGVyUmFuZ2VUaHVtYj47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodjogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKTtcblxuICAgIGlmIChlbmRJbnB1dCkge1xuICAgICAgZW5kSW5wdXQuZGlzYWJsZWQgPSB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG4gICAgaWYgKHN0YXJ0SW5wdXQpIHtcbiAgICAgIHN0YXJ0SW5wdXQuZGlzYWJsZWQgPSB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGRpc3BsYXlzIGEgbnVtZXJpYyB2YWx1ZSBsYWJlbCB1cG9uIHByZXNzaW5nIHRoZSB0aHVtYi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2NyZXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNjcmV0ZTtcbiAgfVxuICBzZXQgZGlzY3JldGUodjogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzY3JldGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWVJbmRpY2F0b3JVSXMoKTtcbiAgfVxuICBwcml2YXRlIF9kaXNjcmV0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgZGlzcGxheXMgdGljayBtYXJrcyBhbG9uZyB0aGUgc2xpZGVyIHRyYWNrLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2hvd1RpY2tNYXJrcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd1RpY2tNYXJrcztcbiAgfVxuICBzZXQgc2hvd1RpY2tNYXJrcyh2OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9zaG93VGlja01hcmtzID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICB9XG4gIHByaXZhdGUgX3Nob3dUaWNrTWFya3M6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21pbjtcbiAgfVxuICBzZXQgbWluKHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgbWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fbWluKTtcbiAgICBpZiAodGhpcy5fbWluICE9PSBtaW4pIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU1pbihtaW4pO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9taW46IG51bWJlciA9IDA7XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWluKG1pbjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgcHJldk1pbiA9IHRoaXMuX21pbjtcbiAgICB0aGlzLl9taW4gPSBtaW47XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZU1pblJhbmdlKHtvbGQ6IHByZXZNaW4sIG5ldzogbWlufSkgOiB0aGlzLl91cGRhdGVNaW5Ob25SYW5nZShtaW4pO1xuICAgIHRoaXMuX29uTWluTWF4T3JTdGVwQ2hhbmdlKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVNaW5SYW5nZShtaW46IHtvbGQ6IG51bWJlcjsgbmV3OiBudW1iZXJ9KTogdm9pZCB7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgIGNvbnN0IG9sZEVuZFZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgY29uc3Qgb2xkU3RhcnRWYWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBzdGFydElucHV0Lm1pbiA9IG1pbi5uZXc7XG4gICAgZW5kSW5wdXQubWluID0gTWF0aC5tYXgobWluLm5ldywgc3RhcnRJbnB1dC52YWx1ZSk7XG4gICAgc3RhcnRJbnB1dC5tYXggPSBNYXRoLm1pbihlbmRJbnB1dC5tYXgsIGVuZElucHV0LnZhbHVlKTtcblxuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgbWluLm5ldyA8IG1pbi5vbGRcbiAgICAgID8gdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KGVuZElucHV0LCBzdGFydElucHV0KVxuICAgICAgOiB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3Qoc3RhcnRJbnB1dCwgZW5kSW5wdXQpO1xuXG4gICAgaWYgKG9sZEVuZFZhbHVlICE9PSBlbmRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShlbmRJbnB1dCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFN0YXJ0VmFsdWUgIT09IHN0YXJ0SW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2Uoc3RhcnRJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWluTm9uUmFuZ2UobWluOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGlmIChpbnB1dCkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgaW5wdXQubWluID0gbWluO1xuICAgICAgaW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl91cGRhdGVUcmFja1VJKGlucHV0KTtcblxuICAgICAgaWYgKG9sZFZhbHVlICE9PSBpbnB1dC52YWx1ZSkge1xuICAgICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGlucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuICBzZXQgbWF4KHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgbWF4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fbWF4KTtcbiAgICBpZiAodGhpcy5fbWF4ICE9PSBtYXgpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU1heChtYXgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9tYXg6IG51bWJlciA9IDEwMDtcblxuICBwcml2YXRlIF91cGRhdGVNYXgobWF4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2TWF4ID0gdGhpcy5fbWF4O1xuICAgIHRoaXMuX21heCA9IG1heDtcbiAgICB0aGlzLl9pc1JhbmdlID8gdGhpcy5fdXBkYXRlTWF4UmFuZ2Uoe29sZDogcHJldk1heCwgbmV3OiBtYXh9KSA6IHRoaXMuX3VwZGF0ZU1heE5vblJhbmdlKG1heCk7XG4gICAgdGhpcy5fb25NaW5NYXhPclN0ZXBDaGFuZ2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU1heFJhbmdlKG1heDoge29sZDogbnVtYmVyOyBuZXc6IG51bWJlcn0pOiB2b2lkIHtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuXG4gICAgY29uc3Qgb2xkRW5kVmFsdWUgPSBlbmRJbnB1dC52YWx1ZTtcbiAgICBjb25zdCBvbGRTdGFydFZhbHVlID0gc3RhcnRJbnB1dC52YWx1ZTtcblxuICAgIGVuZElucHV0Lm1heCA9IG1heC5uZXc7XG4gICAgc3RhcnRJbnB1dC5tYXggPSBNYXRoLm1pbihtYXgubmV3LCBlbmRJbnB1dC52YWx1ZSk7XG4gICAgZW5kSW5wdXQubWluID0gc3RhcnRJbnB1dC52YWx1ZTtcblxuICAgIGVuZElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgbWF4Lm5ldyA+IG1heC5vbGRcbiAgICAgID8gdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KHN0YXJ0SW5wdXQsIGVuZElucHV0KVxuICAgICAgOiB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3QoZW5kSW5wdXQsIHN0YXJ0SW5wdXQpO1xuXG4gICAgaWYgKG9sZEVuZFZhbHVlICE9PSBlbmRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShlbmRJbnB1dCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFN0YXJ0VmFsdWUgIT09IHN0YXJ0SW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2Uoc3RhcnRJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWF4Tm9uUmFuZ2UobWF4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGlmIChpbnB1dCkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgaW5wdXQubWF4ID0gbWF4O1xuICAgICAgaW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl91cGRhdGVUcmFja1VJKGlucHV0KTtcblxuICAgICAgaWYgKG9sZFZhbHVlICE9PSBpbnB1dC52YWx1ZSkge1xuICAgICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGlucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogVGhlIHZhbHVlcyBhdCB3aGljaCB0aGUgdGh1bWIgd2lsbCBzbmFwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICB9XG4gIHNldCBzdGVwKHY6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3Qgc3RlcCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX3N0ZXApO1xuICAgIGlmICh0aGlzLl9zdGVwICE9PSBzdGVwKSB7XG4gICAgICB0aGlzLl91cGRhdGVTdGVwKHN0ZXApO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9zdGVwOiBudW1iZXIgPSAwO1xuXG4gIHByaXZhdGUgX3VwZGF0ZVN0ZXAoc3RlcDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZVN0ZXBSYW5nZSgpIDogdGhpcy5fdXBkYXRlU3RlcE5vblJhbmdlKCk7XG4gICAgdGhpcy5fb25NaW5NYXhPclN0ZXBDaGFuZ2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVN0ZXBSYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuXG4gICAgY29uc3Qgb2xkRW5kVmFsdWUgPSBlbmRJbnB1dC52YWx1ZTtcbiAgICBjb25zdCBvbGRTdGFydFZhbHVlID0gc3RhcnRJbnB1dC52YWx1ZTtcblxuICAgIGNvbnN0IHByZXZTdGFydFZhbHVlID0gc3RhcnRJbnB1dC52YWx1ZTtcblxuICAgIGVuZElucHV0Lm1pbiA9IHRoaXMuX21pbjtcbiAgICBzdGFydElucHV0Lm1heCA9IHRoaXMuX21heDtcblxuICAgIGVuZElucHV0LnN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgIHN0YXJ0SW5wdXQuc3RlcCA9IHRoaXMuX3N0ZXA7XG5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uU0FGQVJJKSB7XG4gICAgICBlbmRJbnB1dC52YWx1ZSA9IGVuZElucHV0LnZhbHVlO1xuICAgICAgc3RhcnRJbnB1dC52YWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG4gICAgfVxuXG4gICAgZW5kSW5wdXQubWluID0gTWF0aC5tYXgodGhpcy5fbWluLCBzdGFydElucHV0LnZhbHVlKTtcbiAgICBzdGFydElucHV0Lm1heCA9IE1hdGgubWluKHRoaXMuX21heCwgZW5kSW5wdXQudmFsdWUpO1xuXG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIGVuZElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG5cbiAgICBlbmRJbnB1dC52YWx1ZSA8IHByZXZTdGFydFZhbHVlXG4gICAgICA/IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChzdGFydElucHV0LCBlbmRJbnB1dClcbiAgICAgIDogdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KGVuZElucHV0LCBzdGFydElucHV0KTtcblxuICAgIGlmIChvbGRFbmRWYWx1ZSAhPT0gZW5kSW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoZW5kSW5wdXQpO1xuICAgIH1cblxuICAgIGlmIChvbGRTdGFydFZhbHVlICE9PSBzdGFydElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKHN0YXJ0SW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVN0ZXBOb25SYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGlmIChpbnB1dCkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgaW5wdXQuc3RlcCA9IHRoaXMuX3N0ZXA7XG4gICAgICBpZiAodGhpcy5fcGxhdGZvcm0uU0FGQVJJKSB7XG4gICAgICAgIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuXG4gICAgICBpZiAob2xkVmFsdWUgIT09IGlucHV0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nID0gKHZhbHVlOiBudW1iZXIpID0+IGAke3ZhbHVlfWA7XG5cbiAgLyoqIFVzZWQgdG8ga2VlcCB0cmFjayBvZiAmIHJlbmRlciB0aGUgYWN0aXZlICYgaW5hY3RpdmUgdGljayBtYXJrcyBvbiB0aGUgc2xpZGVyIHRyYWNrLiAqL1xuICBfdGlja01hcmtzOiBfTWF0VGlja01hcmtbXTtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGhhdmUgYmVlbiBkaXNhYmxlZC4gKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gY2hhbmdlcyB0byB0aGUgZGlyZWN0aW9uYWxpdHkgKExUUiAvIFJUTCkgY29udGV4dCBmb3IgdGhlIGFwcGxpY2F0aW9uLiAqL1xuICBwcml2YXRlIF9kaXJDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogT2JzZXJ2ZXIgdXNlZCB0byBtb25pdG9yIHNpemUgY2hhbmdlcyBpbiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9yZXNpemVPYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXIgfCBudWxsO1xuXG4gIC8vIFN0b3JlZCBkaW1lbnNpb25zIHRvIGF2b2lkIGNhbGxpbmcgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHJlZHVuZGFudGx5LlxuXG4gIF9jYWNoZWRXaWR0aDogbnVtYmVyO1xuICBfY2FjaGVkTGVmdDogbnVtYmVyO1xuXG4gIF9yaXBwbGVSYWRpdXM6IG51bWJlciA9IDI0O1xuXG4gIC8vIFRoZSB2YWx1ZSBpbmRpY2F0b3IgdG9vbHRpcCB0ZXh0IGZvciB0aGUgdmlzdWFsIHNsaWRlciB0aHVtYihzKS5cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBwcm90ZWN0ZWQgc3RhcnRWYWx1ZUluZGljYXRvclRleHQ6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIHByb3RlY3RlZCBlbmRWYWx1ZUluZGljYXRvclRleHQ6IHN0cmluZyA9ICcnO1xuXG4gIC8vIFVzZWQgdG8gY29udHJvbCB0aGUgdHJhbnNsYXRlWCBvZiB0aGUgdmlzdWFsIHNsaWRlciB0aHVtYihzKS5cblxuICBfZW5kVGh1bWJUcmFuc2Zvcm06IHN0cmluZztcbiAgX3N0YXJ0VGh1bWJUcmFuc2Zvcm06IHN0cmluZztcblxuICBfaXNSYW5nZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgcnRsLiAqL1xuICBfaXNSdGw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9oYXNWaWV3SW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHdpZHRoIG9mIHRoZSB0aWNrIG1hcmsgdHJhY2suXG4gICAqIFRoZSB0aWNrIG1hcmsgdHJhY2sgd2lkdGggaXMgZGlmZmVyZW50IGZyb20gZnVsbCB0cmFjayB3aWR0aFxuICAgKi9cbiAgX3RpY2tNYXJrVHJhY2tXaWR0aDogbnVtYmVyID0gMDtcblxuICBfaGFzQW5pbWF0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfcmVzaXplVGltZXI6IG51bGwgfCBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHJlYWRvbmx5IF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgcmVhZG9ubHkgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgcmVhZG9ubHkgX2dsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fb25EaXJDaGFuZ2UoKSk7XG4gICAgdGhpcy5faXNSdGwgPSB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIG5hdGl2ZSBzbGlkZXIncyBrbm9iLiBBRkFJSyB0aGVyZSBpcyBubyB3YXkgdG8gYXZvaWQgaGFyZGNvZGluZyB0aGlzLiAqL1xuICBfa25vYlJhZGl1czogbnVtYmVyID0gODtcblxuICBfaW5wdXRQYWRkaW5nOiBudW1iZXI7XG4gIF9pbnB1dE9mZnNldDogbnVtYmVyO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZUlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgY29uc3Qgc0lucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKTtcbiAgICB0aGlzLl9pc1JhbmdlID0gISFlSW5wdXQgJiYgISFzSW5wdXQ7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIF92YWxpZGF0ZUlucHV0cyhcbiAgICAgICAgdGhpcy5faXNSYW5nZSxcbiAgICAgICAgdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkhLFxuICAgICAgICB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0aHVtYiA9IHRoaXMuX2dldFRodW1iKF9NYXRUaHVtYi5FTkQpO1xuICAgIHRoaXMuX3JpcHBsZVJhZGl1cyA9IHRodW1iLl9yaXBwbGUucmFkaXVzO1xuICAgIHRoaXMuX2lucHV0UGFkZGluZyA9IHRoaXMuX3JpcHBsZVJhZGl1cyAtIHRoaXMuX2tub2JSYWRpdXM7XG4gICAgdGhpcy5faW5wdXRPZmZzZXQgPSB0aGlzLl9rbm9iUmFkaXVzO1xuXG4gICAgdGhpcy5faXNSYW5nZVxuICAgICAgPyB0aGlzLl9pbml0VUlSYW5nZShlSW5wdXQgYXMgX01hdFNsaWRlclJhbmdlVGh1bWIsIHNJbnB1dCBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYilcbiAgICAgIDogdGhpcy5faW5pdFVJTm9uUmFuZ2UoZUlucHV0ISk7XG5cbiAgICB0aGlzLl91cGRhdGVUcmFja1VJKGVJbnB1dCEpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTtcblxuICAgIHRoaXMuX29ic2VydmVIb3N0UmVzaXplKCk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRVSU5vblJhbmdlKGVJbnB1dDogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgZUlucHV0LmluaXRQcm9wcygpO1xuICAgIGVJbnB1dC5pbml0VUkoKTtcblxuICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUkoZUlucHV0KTtcblxuICAgIHRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG4gICAgZUlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdFVJUmFuZ2UoZUlucHV0OiBfTWF0U2xpZGVyUmFuZ2VUaHVtYiwgc0lucHV0OiBfTWF0U2xpZGVyUmFuZ2VUaHVtYik6IHZvaWQge1xuICAgIGVJbnB1dC5pbml0UHJvcHMoKTtcbiAgICBlSW5wdXQuaW5pdFVJKCk7XG5cbiAgICBzSW5wdXQuaW5pdFByb3BzKCk7XG4gICAgc0lucHV0LmluaXRVSSgpO1xuXG4gICAgZUlucHV0Ll91cGRhdGVNaW5NYXgoKTtcbiAgICBzSW5wdXQuX3VwZGF0ZU1pbk1heCgpO1xuXG4gICAgZUlucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcbiAgICBzSW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuXG4gICAgdGhpcy5fdXBkYXRlVmFsdWVJbmRpY2F0b3JVSXMoKTtcblxuICAgIHRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBlSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgc0lucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLl9yZXNpemVPYnNlcnZlciA9IG51bGw7XG4gIH1cblxuICAvKiogSGFuZGxlcyB1cGRhdGluZyB0aGUgc2xpZGVyIHVpIGFmdGVyIGEgZGlyIGNoYW5nZS4gKi9cbiAgcHJpdmF0ZSBfb25EaXJDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5faXNSdGwgPSB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICAgIHRoaXMuX2lzUmFuZ2UgPyB0aGlzLl9vbkRpckNoYW5nZVJhbmdlKCkgOiB0aGlzLl9vbkRpckNoYW5nZU5vblJhbmdlKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25EaXJDaGFuZ2VSYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuXG4gICAgZW5kSW5wdXQuX3NldElzTGVmdFRodW1iKCk7XG4gICAgc3RhcnRJbnB1dC5fc2V0SXNMZWZ0VGh1bWIoKTtcblxuICAgIGVuZElucHV0LnRyYW5zbGF0ZVggPSBlbmRJbnB1dC5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG4gICAgc3RhcnRJbnB1dC50cmFuc2xhdGVYID0gc3RhcnRJbnB1dC5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIGVuZElucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gIH1cblxuICBwcml2YXRlIF9vbkRpckNoYW5nZU5vblJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkhO1xuICAgIGlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyBvYnNlcnZpbmcgYW5kIHVwZGF0aW5nIHRoZSBzbGlkZXIgaWYgdGhlIGhvc3QgY2hhbmdlcyBpdHMgc2l6ZS4gKi9cbiAgcHJpdmF0ZSBfb2JzZXJ2ZUhvc3RSZXNpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBSZXNpemVPYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcgfHwgIVJlc2l6ZU9ic2VydmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQWN0aXZlKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZVRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Jlc2l6ZVRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vblJlc2l6ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogV2hldGhlciBhbnkgb2YgdGhlIHRodW1icyBhcmUgY3VycmVudGx5IGFjdGl2ZS4gKi9cbiAgcHJpdmF0ZSBfaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFRodW1iKF9NYXRUaHVtYi5TVEFSVCkuX2lzQWN0aXZlIHx8IHRoaXMuX2dldFRodW1iKF9NYXRUaHVtYi5FTkQpLl9pc0FjdGl2ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFZhbHVlKHRodW1iUG9zaXRpb246IF9NYXRUaHVtYiA9IF9NYXRUaHVtYi5FTkQpOiBudW1iZXIge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQodGh1bWJQb3NpdGlvbik7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMubWluO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9za2lwVXBkYXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIShcbiAgICAgIHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk/Ll9za2lwVUlVcGRhdGUgfHwgdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk/Ll9za2lwVUlVcGRhdGVcbiAgICApO1xuICB9XG5cbiAgLyoqIFN0b3JlcyB0aGUgc2xpZGVyIGRpbWVuc2lvbnMuICovXG4gIF91cGRhdGVEaW1lbnNpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuX2NhY2hlZFdpZHRoID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIHRoaXMuX2NhY2hlZExlZnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzdHlsZXMgZm9yIHRoZSBhY3RpdmUgcG9ydGlvbiBvZiB0aGUgdHJhY2suICovXG4gIF9zZXRUcmFja0FjdGl2ZVN0eWxlcyhzdHlsZXM6IHtcbiAgICBsZWZ0OiBzdHJpbmc7XG4gICAgcmlnaHQ6IHN0cmluZztcbiAgICB0cmFuc2Zvcm06IHN0cmluZztcbiAgICB0cmFuc2Zvcm1PcmlnaW46IHN0cmluZztcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IHRyYWNrU3R5bGUgPSB0aGlzLl90cmFja0FjdGl2ZS5uYXRpdmVFbGVtZW50LnN0eWxlO1xuXG4gICAgdHJhY2tTdHlsZS5sZWZ0ID0gc3R5bGVzLmxlZnQ7XG4gICAgdHJhY2tTdHlsZS5yaWdodCA9IHN0eWxlcy5yaWdodDtcbiAgICB0cmFja1N0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IHN0eWxlcy50cmFuc2Zvcm1PcmlnaW47XG4gICAgdHJhY2tTdHlsZS50cmFuc2Zvcm0gPSBzdHlsZXMudHJhbnNmb3JtO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRyYW5zbGF0ZVggcG9zaXRpb25pbmcgZm9yIGEgdGljayBtYXJrIGJhc2VkIG9uIGl0J3MgaW5kZXguICovXG4gIF9jYWxjVGlja01hcmtUcmFuc2Zvcm0oaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBTZWUgaWYgd2UgY2FuIGF2b2lkIGRvaW5nIHRoaXMgYW5kIGp1c3QgdXNpbmcgZmxleCB0byBwb3NpdGlvbiB0aGVzZS5cbiAgICBjb25zdCB0cmFuc2xhdGVYID0gaW5kZXggKiAodGhpcy5fdGlja01hcmtUcmFja1dpZHRoIC8gKHRoaXMuX3RpY2tNYXJrcy5sZW5ndGggLSAxKSk7XG4gICAgcmV0dXJuIGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRlWH1weGA7XG4gIH1cblxuICAvLyBIYW5kbGVycyBmb3IgdXBkYXRpbmcgdGhlIHNsaWRlciB1aS5cblxuICBfb25UcmFuc2xhdGVYQ2hhbmdlKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJKHNvdXJjZSk7XG4gICAgdGhpcy5fdXBkYXRlVHJhY2tVSShzb3VyY2UpO1xuICAgIHRoaXMuX3VwZGF0ZU92ZXJsYXBwaW5nVGh1bWJVSShzb3VyY2UgYXMgX01hdFNsaWRlclJhbmdlVGh1bWIpO1xuICB9XG5cbiAgX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChcbiAgICBpbnB1dDE6IF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICAgIGlucHV0MjogX01hdFNsaWRlclJhbmdlVGh1bWIsXG4gICk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzVmlld0luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW5wdXQxLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIGlucHV0Mi5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgfVxuXG4gIF9vblZhbHVlQ2hhbmdlKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVWYWx1ZUluZGljYXRvclVJKHNvdXJjZSk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBfb25NaW5NYXhPclN0ZXBDaGFuZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1VJKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtUcmFja1VJKCk7XG4gICAgdGhpcy5fY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX29uUmVzaXplKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzVmlld0luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRGltZW5zaW9ucygpO1xuICAgIGlmICh0aGlzLl9pc1JhbmdlKSB7XG4gICAgICBjb25zdCBlSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICAgIGNvbnN0IHNJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICAgIGVJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcblxuICAgICAgZUlucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG5cbiAgICAgIGVJbnB1dC5fdXBkYXRlTWluTWF4KCk7XG4gICAgICBzSW5wdXQuX3VwZGF0ZU1pbk1heCgpO1xuXG4gICAgICBlSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICAgIGlmIChlSW5wdXQpIHtcbiAgICAgICAgZUlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBzbGlkZXIgdGh1bWJzIG92ZXJsYXAuICovXG4gIHByaXZhdGUgX3RodW1ic092ZXJsYXA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBzbGlkZXIga25vYnMgYXJlIG92ZXJsYXBwaW5nIG9uZSBhbm90aGVyLiAqL1xuICBwcml2YXRlIF9hcmVUaHVtYnNPdmVybGFwcGluZygpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKTtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGlmICghc3RhcnRJbnB1dCB8fCAhZW5kSW5wdXQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGVuZElucHV0LnRyYW5zbGF0ZVggLSBzdGFydElucHV0LnRyYW5zbGF0ZVggPCAyMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjbGFzcyBuYW1lcyBvZiBvdmVybGFwcGluZyBzbGlkZXIgdGh1bWJzIHNvXG4gICAqIHRoYXQgdGhlIGN1cnJlbnQgYWN0aXZlIHRodW1iIGlzIHN0eWxlZCB0byBiZSBvbiBcInRvcFwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlT3ZlcmxhcHBpbmdUaHVtYkNsYXNzTmFtZXMoc291cmNlOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYik6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSBzb3VyY2UuZ2V0U2libGluZygpITtcbiAgICBjb25zdCBzb3VyY2VUaHVtYiA9IHRoaXMuX2dldFRodW1iKHNvdXJjZS50aHVtYlBvc2l0aW9uKTtcbiAgICBjb25zdCBzaWJsaW5nVGh1bWIgPSB0aGlzLl9nZXRUaHVtYihzaWJsaW5nLnRodW1iUG9zaXRpb24pO1xuICAgIHNpYmxpbmdUaHVtYi5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLXRvcCcpO1xuICAgIHNvdXJjZVRodW1iLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtc2xpZGVyX190aHVtYi0tdG9wJywgdGhpcy5fdGh1bWJzT3ZlcmxhcCk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgVUkgb2Ygc2xpZGVyIHRodW1icyB3aGVuIHRoZXkgYmVnaW4gb3Igc3RvcCBvdmVybGFwcGluZy4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlT3ZlcmxhcHBpbmdUaHVtYlVJKHNvdXJjZTogX01hdFNsaWRlclJhbmdlVGh1bWIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzUmFuZ2UgfHwgdGhpcy5fc2tpcFVwZGF0ZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl90aHVtYnNPdmVybGFwICE9PSB0aGlzLl9hcmVUaHVtYnNPdmVybGFwcGluZygpKSB7XG4gICAgICB0aGlzLl90aHVtYnNPdmVybGFwID0gIXRoaXMuX3RodW1ic092ZXJsYXA7XG4gICAgICB0aGlzLl91cGRhdGVPdmVybGFwcGluZ1RodW1iQ2xhc3NOYW1lcyhzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIF9NYXRUaHVtYiBzdHlsZXMgdXBkYXRlIGNvbmRpdGlvbnNcbiAgLy9cbiAgLy8gMS4gVHJhbnNsYXRlWCwgcmVzaXplLCBvciBkaXIgY2hhbmdlXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdGh1bWIgc3R5bGVzIG5lZWQgdG8gYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIG5ldyB0cmFuc2xhdGVYLlxuICAvLyAyLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbjogVGhlIHZhbHVlIG1heSBoYXZlIHNpbGVudGx5IGNoYW5nZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRyYW5zbGF0ZVggb2YgdGhlIGdpdmVuIHRodW1iLiAqL1xuICBfdXBkYXRlVGh1bWJVSShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYikge1xuICAgIGlmICh0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGh1bWIgPSB0aGlzLl9nZXRUaHVtYihcbiAgICAgIHNvdXJjZS50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuRU5EID8gX01hdFRodW1iLkVORCA6IF9NYXRUaHVtYi5TVEFSVCxcbiAgICApITtcbiAgICB0aHVtYi5faG9zdEVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtzb3VyY2UudHJhbnNsYXRlWH1weClgO1xuICB9XG5cbiAgLy8gVmFsdWUgaW5kaWNhdG9yIHRleHQgdXBkYXRlIGNvbmRpdGlvbnNcbiAgLy9cbiAgLy8gMS4gVmFsdWVcbiAgLy8gICAgLSBSZWFzb246IFRoZSB2YWx1ZSBkaXNwbGF5ZWQgbmVlZHMgdG8gYmUgdXBkYXRlZC5cbiAgLy8gMi4gTWluLCBtYXgsIG9yIHN0ZXBcbiAgLy8gICAgLSBSZWFzb246IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdG9vbHRpcCB1aSBmb3IgdGhlIGdpdmVuIHRodW1iLiAqL1xuICBfdXBkYXRlVmFsdWVJbmRpY2F0b3JVSShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZXRleHQgPSB0aGlzLmRpc3BsYXlXaXRoKHNvdXJjZS52YWx1ZSk7XG5cbiAgICB0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWRcbiAgICAgID8gKHNvdXJjZS5fdmFsdWV0ZXh0ID0gdmFsdWV0ZXh0KVxuICAgICAgOiBzb3VyY2UuX2hvc3RFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCB2YWx1ZXRleHQpO1xuXG4gICAgaWYgKHRoaXMuZGlzY3JldGUpIHtcbiAgICAgIHNvdXJjZS50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlRcbiAgICAgICAgPyAodGhpcy5zdGFydFZhbHVlSW5kaWNhdG9yVGV4dCA9IHZhbHVldGV4dClcbiAgICAgICAgOiAodGhpcy5lbmRWYWx1ZUluZGljYXRvclRleHQgPSB2YWx1ZXRleHQpO1xuXG4gICAgICBjb25zdCB2aXN1YWxUaHVtYiA9IHRoaXMuX2dldFRodW1iKHNvdXJjZS50aHVtYlBvc2l0aW9uKTtcbiAgICAgIHZhbHVldGV4dC5sZW5ndGggPCAzXG4gICAgICAgID8gdmlzdWFsVGh1bWIuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1zbGlkZXJfX3RodW1iLS1zaG9ydC12YWx1ZScpXG4gICAgICAgIDogdmlzdWFsVGh1bWIuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21kYy1zbGlkZXJfX3RodW1iLS1zaG9ydC12YWx1ZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGVzIGFsbCB2YWx1ZSBpbmRpY2F0b3IgVUlzIGluIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUlzKCk6IHZvaWQge1xuICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGNvbnN0IHNJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk7XG5cbiAgICBpZiAoZUlucHV0KSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUluZGljYXRvclVJKGVJbnB1dCk7XG4gICAgfVxuICAgIGlmIChzSW5wdXQpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUkoc0lucHV0KTtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGUgVGljayBNYXJrIFRyYWNrIFdpZHRoXG4gIC8vXG4gIC8vIDEuIE1pbiwgbWF4LCBvciBzdGVwXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgbWF4aW11bSByZWFjaGFibGUgdmFsdWUgbWF5IGhhdmUgY2hhbmdlZC5cbiAgLy8gICAgLSBTaWRlIG5vdGU6IFRoZSBtYXhpbXVtIHJlYWNoYWJsZSB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbWF4aW11bSB2YWx1ZSBzZXQgYnkgdGhlXG4gIC8vICAgICAgdXNlci4gRm9yIGV4YW1wbGUsIGEgc2xpZGVyIHdpdGggW21pbjogNSwgbWF4OiAxMDAsIHN0ZXA6IDEwXSB3b3VsZCBoYXZlIGEgbWF4aW11bVxuICAvLyAgICAgIHJlYWNoYWJsZSB2YWx1ZSBvZiA5NS5cbiAgLy8gMi4gUmVzaXplXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgcG9zaXRpb24gZm9yIHRoZSBtYXhpbXVtIHJlYWNoYWJsZSB2YWx1ZSBuZWVkcyB0byBiZSByZWNhbGN1bGF0ZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHdpZHRoIG9mIHRoZSB0aWNrIG1hcmsgdHJhY2suICovXG4gIHByaXZhdGUgX3VwZGF0ZVRpY2tNYXJrVHJhY2tVSSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2hvd1RpY2tNYXJrcyB8fCB0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdGVwID0gdGhpcy5fc3RlcCAmJiB0aGlzLl9zdGVwID4gMCA/IHRoaXMuX3N0ZXAgOiAxO1xuICAgIGNvbnN0IG1heFZhbHVlID0gTWF0aC5mbG9vcih0aGlzLm1heCAvIHN0ZXApICogc3RlcDtcbiAgICBjb25zdCBwZXJjZW50YWdlID0gKG1heFZhbHVlIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgIHRoaXMuX3RpY2tNYXJrVHJhY2tXaWR0aCA9IHRoaXMuX2NhY2hlZFdpZHRoICogcGVyY2VudGFnZSAtIDY7XG4gIH1cblxuICAvLyBUcmFjayBhY3RpdmUgdXBkYXRlIGNvbmRpdGlvbnNcbiAgLy9cbiAgLy8gMS4gVHJhbnNsYXRlWFxuICAvLyAgICAtIFJlYXNvbjogVGhlIHRyYWNrIGFjdGl2ZSBzaG91bGQgbGluZSB1cCB3aXRoIHRoZSBuZXcgdGh1bWIgcG9zaXRpb24uXG4gIC8vIDIuIE1pbiBvciBtYXhcbiAgLy8gICAgLSBSZWFzb24gIzE6IFRoZSAnYWN0aXZlJyBwZXJjZW50YWdlIG5lZWRzIHRvIGJlIHJlY2FsY3VsYXRlZC5cbiAgLy8gICAgLSBSZWFzb24gIzI6IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkLlxuICAvLyAzLiBTdGVwXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdmFsdWUgbWF5IGhhdmUgc2lsZW50bHkgY2hhbmdlZCBjYXVzaW5nIHRoZSB0aHVtYihzKSB0byBzaGlmdC5cbiAgLy8gNC4gRGlyIGNoYW5nZVxuICAvLyAgICAtIFJlYXNvbjogVGhlIHRyYWNrIGFjdGl2ZSB3aWxsIG5lZWQgdG8gYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIG5ldyB0aHVtYiBwb3NpdGlvbihzKS5cbiAgLy8gNS4gUmVzaXplXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdG90YWwgd2lkdGggdGhlICdhY3RpdmUnIHRyYWNrcyB0cmFuc2xhdGVYIGlzIGJhc2VkIG9uIGhhcyBjaGFuZ2VkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSBzY2FsZSBvbiB0aGUgYWN0aXZlIHBvcnRpb24gb2YgdGhlIHRyYWNrLiAqL1xuICBfdXBkYXRlVHJhY2tVSShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1JhbmdlXG4gICAgICA/IHRoaXMuX3VwZGF0ZVRyYWNrVUlSYW5nZShzb3VyY2UgYXMgX01hdFNsaWRlclJhbmdlVGh1bWIpXG4gICAgICA6IHRoaXMuX3VwZGF0ZVRyYWNrVUlOb25SYW5nZShzb3VyY2UgYXMgX01hdFNsaWRlclRodW1iKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVRyYWNrVUlSYW5nZShzb3VyY2U6IF9NYXRTbGlkZXJSYW5nZVRodW1iKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHNvdXJjZS5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nIHx8ICF0aGlzLl9jYWNoZWRXaWR0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZVBlcmNlbnRhZ2UgPSBNYXRoLmFicyhzaWJsaW5nLnRyYW5zbGF0ZVggLSBzb3VyY2UudHJhbnNsYXRlWCkgLyB0aGlzLl9jYWNoZWRXaWR0aDtcblxuICAgIGlmIChzb3VyY2UuX2lzTGVmdFRodW1iICYmIHRoaXMuX2NhY2hlZFdpZHRoKSB7XG4gICAgICB0aGlzLl9zZXRUcmFja0FjdGl2ZVN0eWxlcyh7XG4gICAgICAgIGxlZnQ6ICdhdXRvJyxcbiAgICAgICAgcmlnaHQ6IGAke3RoaXMuX2NhY2hlZFdpZHRoIC0gc2libGluZy50cmFuc2xhdGVYfXB4YCxcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAncmlnaHQnLFxuICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHthY3RpdmVQZXJjZW50YWdlfSlgLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldFRyYWNrQWN0aXZlU3R5bGVzKHtcbiAgICAgICAgbGVmdDogYCR7c2libGluZy50cmFuc2xhdGVYfXB4YCxcbiAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnbGVmdCcsXG4gICAgICAgIHRyYW5zZm9ybTogYHNjYWxlWCgke2FjdGl2ZVBlcmNlbnRhZ2V9KWAsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUcmFja1VJTm9uUmFuZ2Uoc291cmNlOiBfTWF0U2xpZGVyVGh1bWIpOiB2b2lkIHtcbiAgICB0aGlzLl9pc1J0bFxuICAgICAgPyB0aGlzLl9zZXRUcmFja0FjdGl2ZVN0eWxlcyh7XG4gICAgICAgICAgbGVmdDogJ2F1dG8nLFxuICAgICAgICAgIHJpZ2h0OiAnMHB4JyxcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdyaWdodCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGVYKCR7MSAtIHNvdXJjZS5maWxsUGVyY2VudGFnZX0pYCxcbiAgICAgICAgfSlcbiAgICAgIDogdGhpcy5fc2V0VHJhY2tBY3RpdmVTdHlsZXMoe1xuICAgICAgICAgIGxlZnQ6ICcwcHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bycsXG4gICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnbGVmdCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGVYKCR7c291cmNlLmZpbGxQZXJjZW50YWdlfSlgLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8vIFRpY2sgbWFyayB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBWYWx1ZVxuICAvLyAgICAtIFJlYXNvbjogYSB0aWNrIG1hcmsgd2hpY2ggd2FzIG9uY2UgYWN0aXZlIG1pZ2h0IG5vdyBiZSBpbmFjdGl2ZSBvciB2aWNlIHZlcnNhLlxuICAvLyAyLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbiAjMTogdGhlIG51bWJlciBvZiB0aWNrIG1hcmtzIG1heSBoYXZlIGNoYW5nZWQuXG4gIC8vICAgIC0gUmVhc29uICMyOiBUaGUgdmFsdWUgbWF5IGhhdmUgc2lsZW50bHkgY2hhbmdlZC5cblxuICAvKiogVXBkYXRlcyB0aGUgZG90cyBhbG9uZyB0aGUgc2xpZGVyIHRyYWNrLiAqL1xuICBfdXBkYXRlVGlja01hcmtVSSgpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5zaG93VGlja01hcmtzIHx8XG4gICAgICB0aGlzLnN0ZXAgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5taW4gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5tYXggPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gdGhpcy5zdGVwID4gMCA/IHRoaXMuc3RlcCA6IDE7XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUlSYW5nZShzdGVwKSA6IHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUlOb25SYW5nZShzdGVwKTtcblxuICAgIGlmICh0aGlzLl9pc1J0bCkge1xuICAgICAgdGhpcy5fdGlja01hcmtzLnJldmVyc2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUaWNrTWFya1VJTm9uUmFuZ2Uoc3RlcDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9nZXRWYWx1ZSgpO1xuICAgIGxldCBudW1BY3RpdmUgPSBNYXRoLm1heChNYXRoLnJvdW5kKCh2YWx1ZSAtIHRoaXMubWluKSAvIHN0ZXApLCAwKTtcbiAgICBsZXQgbnVtSW5hY3RpdmUgPSBNYXRoLm1heChNYXRoLnJvdW5kKCh0aGlzLm1heCAtIHZhbHVlKSAvIHN0ZXApLCAwKTtcbiAgICB0aGlzLl9pc1J0bCA/IG51bUFjdGl2ZSsrIDogbnVtSW5hY3RpdmUrKztcblxuICAgIHRoaXMuX3RpY2tNYXJrcyA9IEFycmF5KG51bUFjdGl2ZSlcbiAgICAgIC5maWxsKF9NYXRUaWNrTWFyay5BQ1RJVkUpXG4gICAgICAuY29uY2F0KEFycmF5KG51bUluYWN0aXZlKS5maWxsKF9NYXRUaWNrTWFyay5JTkFDVElWRSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja01hcmtVSVJhbmdlKHN0ZXA6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGVuZFZhbHVlID0gdGhpcy5fZ2V0VmFsdWUoKTtcbiAgICBjb25zdCBzdGFydFZhbHVlID0gdGhpcy5fZ2V0VmFsdWUoX01hdFRodW1iLlNUQVJUKTtcblxuICAgIGNvbnN0IG51bUluYWN0aXZlQmVmb3JlU3RhcnRUaHVtYiA9IE1hdGgubWF4KE1hdGguZmxvb3IoKHN0YXJ0VmFsdWUgLSB0aGlzLm1pbikgLyBzdGVwKSwgMCk7XG4gICAgY29uc3QgbnVtQWN0aXZlID0gTWF0aC5tYXgoTWF0aC5mbG9vcigoZW5kVmFsdWUgLSBzdGFydFZhbHVlKSAvIHN0ZXApICsgMSwgMCk7XG4gICAgY29uc3QgbnVtSW5hY3RpdmVBZnRlckVuZFRodW1iID0gTWF0aC5tYXgoTWF0aC5mbG9vcigodGhpcy5tYXggLSBlbmRWYWx1ZSkgLyBzdGVwKSwgMCk7XG4gICAgdGhpcy5fdGlja01hcmtzID0gQXJyYXkobnVtSW5hY3RpdmVCZWZvcmVTdGFydFRodW1iKVxuICAgICAgLmZpbGwoX01hdFRpY2tNYXJrLklOQUNUSVZFKVxuICAgICAgLmNvbmNhdChcbiAgICAgICAgQXJyYXkobnVtQWN0aXZlKS5maWxsKF9NYXRUaWNrTWFyay5BQ1RJVkUpLFxuICAgICAgICBBcnJheShudW1JbmFjdGl2ZUFmdGVyRW5kVGh1bWIpLmZpbGwoX01hdFRpY2tNYXJrLklOQUNUSVZFKSxcbiAgICAgICk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIHRodW1iIGlucHV0IG9mIHRoZSBnaXZlbiB0aHVtYiBwb3NpdGlvbi4gKi9cbiAgX2dldElucHV0KHRodW1iUG9zaXRpb246IF9NYXRUaHVtYik6IF9NYXRTbGlkZXJUaHVtYiB8IF9NYXRTbGlkZXJSYW5nZVRodW1iIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGh1bWJQb3NpdGlvbiA9PT0gX01hdFRodW1iLkVORCAmJiB0aGlzLl9pbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lucHV0O1xuICAgIH1cbiAgICBpZiAodGhpcy5faW5wdXRzPy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlQgPyB0aGlzLl9pbnB1dHMuZmlyc3QgOiB0aGlzLl9pbnB1dHMubGFzdDtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNsaWRlciB0aHVtYiBIVE1MIGlucHV0IGVsZW1lbnQgb2YgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uLiAqL1xuICBfZ2V0VGh1bWIodGh1bWJQb3NpdGlvbjogX01hdFRodW1iKTogX01hdFNsaWRlclZpc3VhbFRodW1iIHtcbiAgICByZXR1cm4gdGh1bWJQb3NpdGlvbiA9PT0gX01hdFRodW1iLkVORCA/IHRoaXMuX3RodW1icz8ubGFzdCEgOiB0aGlzLl90aHVtYnM/LmZpcnN0ITtcbiAgfVxuXG4gIF9zZXRUcmFuc2l0aW9uKHdpdGhBbmltYXRpb246IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNBbmltYXRpb24gPSB3aXRoQW5pbWF0aW9uICYmICF0aGlzLl9ub29wQW5pbWF0aW9ucztcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICdtYXQtbWRjLXNsaWRlci13aXRoLWFuaW1hdGlvbicsXG4gICAgICB0aGlzLl9oYXNBbmltYXRpb24sXG4gICAgKTtcbiAgfVxufVxuXG4vKiogRW5zdXJlcyB0aGF0IHRoZXJlIGlzIG5vdCBhbiBpbnZhbGlkIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbGlkZXIgdGh1bWIgaW5wdXRzLiAqL1xuZnVuY3Rpb24gX3ZhbGlkYXRlSW5wdXRzKFxuICBpc1JhbmdlOiBib29sZWFuLFxuICBlbmRJbnB1dEVsZW1lbnQ6IF9NYXRTbGlkZXJUaHVtYiB8IF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICBzdGFydElucHV0RWxlbWVudD86IF9NYXRTbGlkZXJUaHVtYixcbik6IHZvaWQge1xuICBjb25zdCBzdGFydFZhbGlkID1cbiAgICAhaXNSYW5nZSB8fCBzdGFydElucHV0RWxlbWVudD8uX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyU3RhcnRUaHVtYicpO1xuICBjb25zdCBlbmRWYWxpZCA9IGVuZElucHV0RWxlbWVudC5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKFxuICAgIGlzUmFuZ2UgPyAnbWF0U2xpZGVyRW5kVGh1bWInIDogJ21hdFNsaWRlclRodW1iJyxcbiAgKTtcblxuICBpZiAoIXN0YXJ0VmFsaWQgfHwgIWVuZFZhbGlkKSB7XG4gICAgX3Rocm93SW52YWxpZElucHV0Q29uZmlndXJhdGlvbkVycm9yKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Rocm93SW52YWxpZElucHV0Q29uZmlndXJhdGlvbkVycm9yKCk6IHZvaWQge1xuICB0aHJvdyBFcnJvcihgSW52YWxpZCBzbGlkZXIgdGh1bWIgaW5wdXQgY29uZmlndXJhdGlvbiFcblxuICAgVmFsaWQgY29uZmlndXJhdGlvbnMgYXJlIGFzIGZvbGxvd3M6XG5cbiAgICAgPG1hdC1zbGlkZXI+XG4gICAgICAgPGlucHV0IG1hdFNsaWRlclRodW1iPlxuICAgICA8L21hdC1zbGlkZXI+XG5cbiAgICAgb3JcblxuICAgICA8bWF0LXNsaWRlcj5cbiAgICAgICA8aW5wdXQgbWF0U2xpZGVyU3RhcnRUaHVtYj5cbiAgICAgICA8aW5wdXQgbWF0U2xpZGVyRW5kVGh1bWI+XG4gICAgIDwvbWF0LXNsaWRlcj5cbiAgIGApO1xufVxuIiwiPCEtLSBJbnB1dHMgLS0+XG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG5cbjwhLS0gVHJhY2sgLS0+XG48ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2tcIj5cbiAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RyYWNrLS1pbmFjdGl2ZVwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2stLWFjdGl2ZVwiPlxuICAgIDxkaXYgI3RyYWNrQWN0aXZlIGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2stLWFjdGl2ZV9maWxsXCI+PC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2ICpuZ0lmPVwic2hvd1RpY2tNYXJrc1wiIGNsYXNzPVwibWRjLXNsaWRlcl9fdGljay1tYXJrc1wiICN0aWNrTWFya0NvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiX2NhY2hlZFdpZHRoXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgdGlja01hcmsgb2YgX3RpY2tNYXJrczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgICAgW2NsYXNzXT1cInRpY2tNYXJrID09PSAwID8gJ21kYy1zbGlkZXJfX3RpY2stbWFyay0tYWN0aXZlJyA6ICdtZGMtc2xpZGVyX190aWNrLW1hcmstLWluYWN0aXZlJ1wiXG4gICAgICAgICAgW3N0eWxlLnRyYW5zZm9ybV09XCJfY2FsY1RpY2tNYXJrVHJhbnNmb3JtKGkpXCI+PC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjwhLS0gVGh1bWJzIC0tPlxuPG1hdC1zbGlkZXItdmlzdWFsLXRodW1iXG4gICpuZ0lmPVwiX2lzUmFuZ2VcIlxuICBbZGlzY3JldGVdPVwiZGlzY3JldGVcIlxuICBbdGh1bWJQb3NpdGlvbl09XCIxXCJcbiAgW3ZhbHVlSW5kaWNhdG9yVGV4dF09XCJzdGFydFZhbHVlSW5kaWNhdG9yVGV4dFwiPlxuPC9tYXQtc2xpZGVyLXZpc3VhbC10aHVtYj5cblxuPG1hdC1zbGlkZXItdmlzdWFsLXRodW1iXG4gIFtkaXNjcmV0ZV09XCJkaXNjcmV0ZVwiXG4gIFt0aHVtYlBvc2l0aW9uXT1cIjJcIlxuICBbdmFsdWVJbmRpY2F0b3JUZXh0XT1cImVuZFZhbHVlSW5kaWNhdG9yVGV4dFwiPlxuPC9tYXQtc2xpZGVyLXZpc3VhbC10aHVtYj5cbiJdfQ==