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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, inject, Inject, Input, NgZone, Optional, QueryList, ViewChild, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_SLIDER_RANGE_THUMB, MAT_SLIDER_THUMB, MAT_SLIDER, MAT_SLIDER_VISUAL_THUMB, } from './slider-interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/common";
import * as i3 from "./slider-thumb";
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
export class MatSlider extends _MatSliderMixinBase {
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
    constructor(_ngZone, _cdr, elementRef, _dir, _globalRippleOptions, animationMode) {
        super(elementRef);
        this._ngZone = _ngZone;
        this._cdr = _cdr;
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
        this._platform = inject(Platform);
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
        this._hasAnimation = !this._platform.IOS && withAnimation && !this._noopAnimations;
        this._elementRef.nativeElement.classList.toggle('mat-mdc-slider-with-animation', this._hasAnimation);
    }
    /** Whether the given pointer event occurred within the bounds of the slider pointer's DOM Rect. */
    _isCursorOnSliderThumb(event, rect) {
        const radius = rect.width / 2;
        const centerX = rect.x + radius;
        const centerY = rect.y + radius;
        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;
        return Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(radius, 2);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSlider, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatSlider, selector: "mat-slider", inputs: { color: "color", disableRipple: "disableRipple", disabled: "disabled", discrete: "discrete", showTickMarks: "showTickMarks", min: "min", max: "max", step: "step", displayWith: "displayWith" }, host: { properties: { "class.mdc-slider--range": "_isRange", "class.mdc-slider--disabled": "disabled", "class.mdc-slider--discrete": "discrete", "class.mdc-slider--tick-marks": "showTickMarks", "class._mat-animation-noopable": "_noopAnimations" }, classAttribute: "mat-mdc-slider mdc-slider" }, providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], queries: [{ propertyName: "_input", first: true, predicate: MAT_SLIDER_THUMB, descendants: true }, { propertyName: "_inputs", predicate: MAT_SLIDER_RANGE_THUMB }], viewQueries: [{ propertyName: "_trackActive", first: true, predicate: ["trackActive"], descendants: true }, { propertyName: "_thumbs", predicate: MAT_SLIDER_VISUAL_THUMB, descendants: true }], exportAs: ["matSlider"], usesInheritance: true, ngImport: i0, template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <ng-container *ngIf=\"_cachedWidth\">\n        <div\n          *ngFor=\"let tickMark of _tickMarks; let i = index\"\n          [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n          [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngIf=\"_isRange\"\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"1\"\n  [valueIndicatorText]=\"startValueIndicatorText\">\n</mat-slider-visual-thumb>\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000));border-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color, var(--mdc-theme-primary, #6200ee));opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color, var(--mdc-theme-on-surface, #000));opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color, var(--mdc-theme-primary, #6200ee));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color, var(--mdc-theme-on-surface, #000));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color, #666666);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color, #666666)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height, 6px);top:calc((var(--mdc-slider-inactive-track-height, 4px) - var(--mdc-slider-active-track-height, 6px)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height, 6px)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size, 2px);width:var(--mdc-slider-with-tick-marks-container-size, 2px)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking, 0.0071428571em);font-size:var(--mdc-slider-label-label-text-size, 0.875rem);font-family:var(--mdc-slider-label-label-text-font, Roboto, sans-serif);font-weight:var(--mdc-slider-label-label-text-weight, 500);line-height:var(--mdc-slider-label-label-text-line-height, 1.375rem)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape, 50%);width:var(--mdc-slider-handle-width, 20px);height:var(--mdc-slider-handle-height, 20px);border-style:solid;border-width:calc(var(--mdc-slider-handle-height, 20px) / 2) calc(var(--mdc-slider-handle-width, 20px) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape, 50%)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color, #fff);border-width:var(--mdc-slider-with-overlap-handle-outline-width, 1px)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__value-indicator{word-break:normal}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-mdc-slider-value-indicator-opacity, 1)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: ["discrete", "thumbPosition", "valueIndicatorText"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider', host: {
                        'class': 'mat-mdc-slider mdc-slider',
                        '[class.mdc-slider--range]': '_isRange',
                        '[class.mdc-slider--disabled]': 'disabled',
                        '[class.mdc-slider--discrete]': 'discrete',
                        '[class.mdc-slider--tick-marks]': 'showTickMarks',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                    }, exportAs: 'matSlider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, inputs: ['color', 'disableRipple'], providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <ng-container *ngIf=\"_cachedWidth\">\n        <div\n          *ngFor=\"let tickMark of _tickMarks; let i = index\"\n          [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n          [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngIf=\"_isRange\"\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"1\"\n  [valueIndicatorText]=\"startValueIndicatorText\">\n</mat-slider-visual-thumb>\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000));border-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color, var(--mdc-theme-primary, #6200ee));opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color, var(--mdc-theme-on-surface, #000));opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color, var(--mdc-theme-primary, #6200ee));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color, var(--mdc-theme-on-surface, #000));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color, #666666);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color, #666666)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height, 6px);top:calc((var(--mdc-slider-inactive-track-height, 4px) - var(--mdc-slider-active-track-height, 6px)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height, 6px)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size, 2px);width:var(--mdc-slider-with-tick-marks-container-size, 2px)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking, 0.0071428571em);font-size:var(--mdc-slider-label-label-text-size, 0.875rem);font-family:var(--mdc-slider-label-label-text-font, Roboto, sans-serif);font-weight:var(--mdc-slider-label-label-text-weight, 500);line-height:var(--mdc-slider-label-label-text-line-height, 1.375rem)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape, 50%);width:var(--mdc-slider-handle-width, 20px);height:var(--mdc-slider-handle-height, 20px);border-style:solid;border-width:calc(var(--mdc-slider-handle-height, 20px) / 2) calc(var(--mdc-slider-handle-width, 20px) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape, 50%)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color, #fff);border-width:var(--mdc-slider-with-overlap-handle-outline-width, 1px)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__value-indicator{word-break:normal}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-mdc-slider-value-indicator-opacity, 1)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixHQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVMLHlCQUF5QixFQUN6QixVQUFVLEVBQ1Ysa0JBQWtCLEdBRW5CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFFM0UsT0FBTyxFQU9MLHNCQUFzQixFQUN0QixnQkFBZ0IsRUFDaEIsVUFBVSxFQUNWLHVCQUF1QixHQUN4QixNQUFNLG9CQUFvQixDQUFDOzs7OztBQUU1Qiw0REFBNEQ7QUFDNUQsb0NBQW9DO0FBQ3BDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MsZ0RBQWdEO0FBQ2hELE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUNwQyxrQkFBa0IsQ0FDaEI7SUFDRSxZQUFtQixXQUFvQztRQUFwQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7SUFBRyxDQUFD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UyxvQ0FBb0M7SUFDM0MsTUFBTSxLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBY1YsQ0FBQyxDQUFDO0FBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgX01hdFRpY2tNYXJrLFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgX01hdFNsaWRlclRodW1iLFxuICBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsXG4gIE1BVF9TTElERVJfUkFOR0VfVEhVTUIsXG4gIE1BVF9TTElERVJfVEhVTUIsXG4gIE1BVF9TTElERVIsXG4gIE1BVF9TTElERVJfVklTVUFMX1RIVU1CLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuXG4vLyBUT0RPKHdhZ25lcm1hY2llbCk6IG1heWJlIGhhbmRsZSB0aGUgZm9sbG93aW5nIGVkZ2UgY2FzZTpcbi8vIDEuIHN0YXJ0IGRyYWdnaW5nIGRpc2NyZXRlIHNsaWRlclxuLy8gMi4gdGFiIHRvIGRpc2FibGUgY2hlY2tib3hcbi8vIDMuIHdpdGhvdXQgZW5kaW5nIGRyYWcsIGRpc2FibGUgdGhlIHNsaWRlclxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbmNvbnN0IF9NYXRTbGlkZXJNaXhpbkJhc2UgPSBtaXhpbkNvbG9yKFxuICBtaXhpbkRpc2FibGVSaXBwbGUoXG4gICAgY2xhc3Mge1xuICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cbiAgICB9LFxuICApLFxuICAncHJpbWFyeScsXG4pO1xuXG4vKipcbiAqIEFsbG93cyB1c2VycyB0byBzZWxlY3QgZnJvbSBhIHJhbmdlIG9mIHZhbHVlcyBieSBtb3ZpbmcgdGhlIHNsaWRlciB0aHVtYi4gSXQgaXMgc2ltaWxhciBpblxuICogYmVoYXZpb3IgdG8gdGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJyYW5nZVwiPmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtc2xpZGVyIG1kYy1zbGlkZXInLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tcmFuZ2VdJzogJ19pc1JhbmdlJyxcbiAgICAnW2NsYXNzLm1kYy1zbGlkZXItLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS1kaXNjcmV0ZV0nOiAnZGlzY3JldGUnLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tdGljay1tYXJrc10nOiAnc2hvd1RpY2tNYXJrcycsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX25vb3BBbmltYXRpb25zJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9TTElERVIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyXG4gIGV4dGVuZHMgX01hdFNsaWRlck1peGluQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveSwgX01hdFNsaWRlclxue1xuICAvKiogVGhlIGFjdGl2ZSBwb3J0aW9uIG9mIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIEBWaWV3Q2hpbGQoJ3RyYWNrQWN0aXZlJykgX3RyYWNrQWN0aXZlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYihzKS4gKi9cbiAgQFZpZXdDaGlsZHJlbihNQVRfU0xJREVSX1ZJU1VBTF9USFVNQikgX3RodW1iczogUXVlcnlMaXN0PF9NYXRTbGlkZXJWaXN1YWxUaHVtYj47XG5cbiAgLyoqIFRoZSBzbGlkZXJzIGhpZGRlbiByYW5nZSBpbnB1dChzKS4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfU0xJREVSX1RIVU1CKSBfaW5wdXQ6IF9NYXRTbGlkZXJUaHVtYjtcblxuICAvKiogVGhlIHNsaWRlcnMgaGlkZGVuIHJhbmdlIGlucHV0KHMpLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9TTElERVJfUkFOR0VfVEhVTUIsIHtkZXNjZW5kYW50czogZmFsc2V9KVxuICBfaW5wdXRzOiBRdWVyeUxpc3Q8X01hdFNsaWRlclJhbmdlVGh1bWI+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk7XG5cbiAgICBpZiAoZW5kSW5wdXQpIHtcbiAgICAgIGVuZElucHV0LmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICAgIGlmIChzdGFydElucHV0KSB7XG4gICAgICBzdGFydElucHV0LmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyBhIG51bWVyaWMgdmFsdWUgbGFiZWwgdXBvbiBwcmVzc2luZyB0aGUgdGh1bWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNjcmV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzY3JldGU7XG4gIH1cbiAgc2V0IGRpc2NyZXRlKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2NyZXRlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUlzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzY3JldGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGRpc3BsYXlzIHRpY2sgbWFya3MgYWxvbmcgdGhlIHNsaWRlciB0cmFjay4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNob3dUaWNrTWFya3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dUaWNrTWFya3M7XG4gIH1cbiAgc2V0IHNob3dUaWNrTWFya3ModjogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fc2hvd1RpY2tNYXJrcyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTtcbiAgfVxuICBwcml2YXRlIF9zaG93VGlja01hcmtzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbHVlIHRoYXQgdGhlIHNsaWRlciBjYW4gaGF2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9taW47XG4gIH1cbiAgc2V0IG1pbih2OiBOdW1iZXJJbnB1dCkge1xuICAgIGNvbnN0IG1pbiA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21pbik7XG4gICAgaWYgKHRoaXMuX21pbiAhPT0gbWluKSB7XG4gICAgICB0aGlzLl91cGRhdGVNaW4obWluKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBudW1iZXIgPSAwO1xuXG4gIHByaXZhdGUgX3VwZGF0ZU1pbihtaW46IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHByZXZNaW4gPSB0aGlzLl9taW47XG4gICAgdGhpcy5fbWluID0gbWluO1xuICAgIHRoaXMuX2lzUmFuZ2UgPyB0aGlzLl91cGRhdGVNaW5SYW5nZSh7b2xkOiBwcmV2TWluLCBuZXc6IG1pbn0pIDogdGhpcy5fdXBkYXRlTWluTm9uUmFuZ2UobWluKTtcbiAgICB0aGlzLl9vbk1pbk1heE9yU3RlcENoYW5nZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWluUmFuZ2UobWluOiB7b2xkOiBudW1iZXI7IG5ldzogbnVtYmVyfSk6IHZvaWQge1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICBjb25zdCBvbGRFbmRWYWx1ZSA9IGVuZElucHV0LnZhbHVlO1xuICAgIGNvbnN0IG9sZFN0YXJ0VmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgc3RhcnRJbnB1dC5taW4gPSBtaW4ubmV3O1xuICAgIGVuZElucHV0Lm1pbiA9IE1hdGgubWF4KG1pbi5uZXcsIHN0YXJ0SW5wdXQudmFsdWUpO1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gTWF0aC5taW4oZW5kSW5wdXQubWF4LCBlbmRJbnB1dC52YWx1ZSk7XG5cbiAgICBzdGFydElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgZW5kSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIG1pbi5uZXcgPCBtaW4ub2xkXG4gICAgICA/IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChlbmRJbnB1dCwgc3RhcnRJbnB1dClcbiAgICAgIDogdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KHN0YXJ0SW5wdXQsIGVuZElucHV0KTtcblxuICAgIGlmIChvbGRFbmRWYWx1ZSAhPT0gZW5kSW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoZW5kSW5wdXQpO1xuICAgIH1cblxuICAgIGlmIChvbGRTdGFydFZhbHVlICE9PSBzdGFydElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKHN0YXJ0SW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU1pbk5vblJhbmdlKG1pbjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gaW5wdXQudmFsdWU7XG5cbiAgICAgIGlucHV0Lm1pbiA9IG1pbjtcbiAgICAgIGlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlVHJhY2tVSShpbnB1dCk7XG5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gaW5wdXQudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHZhbHVlIHRoYXQgdGhlIHNsaWRlciBjYW4gaGF2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tYXg7XG4gIH1cbiAgc2V0IG1heCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIGNvbnN0IG1heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgaWYgKHRoaXMuX21heCAhPT0gbWF4KSB7XG4gICAgICB0aGlzLl91cGRhdGVNYXgobWF4KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBudW1iZXIgPSAxMDA7XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWF4KG1heDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgcHJldk1heCA9IHRoaXMuX21heDtcbiAgICB0aGlzLl9tYXggPSBtYXg7XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZU1heFJhbmdlKHtvbGQ6IHByZXZNYXgsIG5ldzogbWF4fSkgOiB0aGlzLl91cGRhdGVNYXhOb25SYW5nZShtYXgpO1xuICAgIHRoaXMuX29uTWluTWF4T3JTdGVwQ2hhbmdlKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVNYXhSYW5nZShtYXg6IHtvbGQ6IG51bWJlcjsgbmV3OiBudW1iZXJ9KTogdm9pZCB7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgIGNvbnN0IG9sZEVuZFZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgY29uc3Qgb2xkU3RhcnRWYWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBlbmRJbnB1dC5tYXggPSBtYXgubmV3O1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gTWF0aC5taW4obWF4Lm5ldywgZW5kSW5wdXQudmFsdWUpO1xuICAgIGVuZElucHV0Lm1pbiA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIG1heC5uZXcgPiBtYXgub2xkXG4gICAgICA/IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChzdGFydElucHV0LCBlbmRJbnB1dClcbiAgICAgIDogdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KGVuZElucHV0LCBzdGFydElucHV0KTtcblxuICAgIGlmIChvbGRFbmRWYWx1ZSAhPT0gZW5kSW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoZW5kSW5wdXQpO1xuICAgIH1cblxuICAgIGlmIChvbGRTdGFydFZhbHVlICE9PSBzdGFydElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKHN0YXJ0SW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU1heE5vblJhbmdlKG1heDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gaW5wdXQudmFsdWU7XG5cbiAgICAgIGlucHV0Lm1heCA9IG1heDtcbiAgICAgIGlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlVHJhY2tVSShpbnB1dCk7XG5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gaW5wdXQudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3RlcDtcbiAgfVxuICBzZXQgc3RlcCh2OiBOdW1iZXJJbnB1dCkge1xuICAgIGNvbnN0IHN0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9zdGVwKTtcbiAgICBpZiAodGhpcy5fc3RlcCAhPT0gc3RlcCkge1xuICAgICAgdGhpcy5fdXBkYXRlU3RlcChzdGVwKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc3RlcDogbnVtYmVyID0gMTtcblxuICBwcml2YXRlIF91cGRhdGVTdGVwKHN0ZXA6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX3N0ZXAgPSBzdGVwO1xuICAgIHRoaXMuX2lzUmFuZ2UgPyB0aGlzLl91cGRhdGVTdGVwUmFuZ2UoKSA6IHRoaXMuX3VwZGF0ZVN0ZXBOb25SYW5nZSgpO1xuICAgIHRoaXMuX29uTWluTWF4T3JTdGVwQ2hhbmdlKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTdGVwUmFuZ2UoKTogdm9pZCB7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgIGNvbnN0IG9sZEVuZFZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgY29uc3Qgb2xkU3RhcnRWYWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBjb25zdCBwcmV2U3RhcnRWYWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBlbmRJbnB1dC5taW4gPSB0aGlzLl9taW47XG4gICAgc3RhcnRJbnB1dC5tYXggPSB0aGlzLl9tYXg7XG5cbiAgICBlbmRJbnB1dC5zdGVwID0gdGhpcy5fc3RlcDtcbiAgICBzdGFydElucHV0LnN0ZXAgPSB0aGlzLl9zdGVwO1xuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLlNBRkFSSSkge1xuICAgICAgZW5kSW5wdXQudmFsdWUgPSBlbmRJbnB1dC52YWx1ZTtcbiAgICAgIHN0YXJ0SW5wdXQudmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuICAgIH1cblxuICAgIGVuZElucHV0Lm1pbiA9IE1hdGgubWF4KHRoaXMuX21pbiwgc3RhcnRJbnB1dC52YWx1ZSk7XG4gICAgc3RhcnRJbnB1dC5tYXggPSBNYXRoLm1pbih0aGlzLl9tYXgsIGVuZElucHV0LnZhbHVlKTtcblxuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgZW5kSW5wdXQudmFsdWUgPCBwcmV2U3RhcnRWYWx1ZVxuICAgICAgPyB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3Qoc3RhcnRJbnB1dCwgZW5kSW5wdXQpXG4gICAgICA6IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChlbmRJbnB1dCwgc3RhcnRJbnB1dCk7XG5cbiAgICBpZiAob2xkRW5kVmFsdWUgIT09IGVuZElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGVuZElucHV0KTtcbiAgICB9XG5cbiAgICBpZiAob2xkU3RhcnRWYWx1ZSAhPT0gc3RhcnRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShzdGFydElucHV0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTdGVwTm9uUmFuZ2UoKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gaW5wdXQudmFsdWU7XG5cbiAgICAgIGlucHV0LnN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgICAgaWYgKHRoaXMuX3BsYXRmb3JtLlNBRkFSSSkge1xuICAgICAgICBpbnB1dC52YWx1ZSA9IGlucHV0LnZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcblxuICAgICAgaWYgKG9sZFZhbHVlICE9PSBpbnB1dC52YWx1ZSkge1xuICAgICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGlucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gZm9ybWF0IHRoZSB2YWx1ZSBiZWZvcmUgaXQgaXMgZGlzcGxheWVkXG4gICAqIGluIHRoZSB0aHVtYiBsYWJlbC4gQ2FuIGJlIHVzZWQgdG8gZm9ybWF0IHZlcnkgbGFyZ2UgbnVtYmVyIGluIG9yZGVyXG4gICAqIGZvciB0aGVtIHRvIGZpdCBpbnRvIHRoZSBzbGlkZXIgdGh1bWIuXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyA9ICh2YWx1ZTogbnVtYmVyKSA9PiBgJHt2YWx1ZX1gO1xuXG4gIC8qKiBVc2VkIHRvIGtlZXAgdHJhY2sgb2YgJiByZW5kZXIgdGhlIGFjdGl2ZSAmIGluYWN0aXZlIHRpY2sgbWFya3Mgb24gdGhlIHNsaWRlciB0cmFjay4gKi9cbiAgX3RpY2tNYXJrczogX01hdFRpY2tNYXJrW107XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBoYXZlIGJlZW4gZGlzYWJsZWQuICovXG4gIF9ub29wQW5pbWF0aW9uczogYm9vbGVhbjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIGNoYW5nZXMgdG8gdGhlIGRpcmVjdGlvbmFsaXR5IChMVFIgLyBSVEwpIGNvbnRleHQgZm9yIHRoZSBhcHBsaWNhdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIE9ic2VydmVyIHVzZWQgdG8gbW9uaXRvciBzaXplIGNoYW5nZXMgaW4gdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyIHwgbnVsbDtcblxuICAvLyBTdG9yZWQgZGltZW5zaW9ucyB0byBhdm9pZCBjYWxsaW5nIGdldEJvdW5kaW5nQ2xpZW50UmVjdCByZWR1bmRhbnRseS5cblxuICBfY2FjaGVkV2lkdGg6IG51bWJlcjtcbiAgX2NhY2hlZExlZnQ6IG51bWJlcjtcblxuICBfcmlwcGxlUmFkaXVzOiBudW1iZXIgPSAyNDtcblxuICAvLyBUaGUgdmFsdWUgaW5kaWNhdG9yIHRvb2x0aXAgdGV4dCBmb3IgdGhlIHZpc3VhbCBzbGlkZXIgdGh1bWIocykuXG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgcHJvdGVjdGVkIHN0YXJ0VmFsdWVJbmRpY2F0b3JUZXh0OiBzdHJpbmcgPSAnJztcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBwcm90ZWN0ZWQgZW5kVmFsdWVJbmRpY2F0b3JUZXh0OiBzdHJpbmcgPSAnJztcblxuICAvLyBVc2VkIHRvIGNvbnRyb2wgdGhlIHRyYW5zbGF0ZVggb2YgdGhlIHZpc3VhbCBzbGlkZXIgdGh1bWIocykuXG5cbiAgX2VuZFRodW1iVHJhbnNmb3JtOiBzdHJpbmc7XG4gIF9zdGFydFRodW1iVHJhbnNmb3JtOiBzdHJpbmc7XG5cbiAgX2lzUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIHJ0bC4gKi9cbiAgX2lzUnRsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfaGFzVmlld0luaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSB3aWR0aCBvZiB0aGUgdGljayBtYXJrIHRyYWNrLlxuICAgKiBUaGUgdGljayBtYXJrIHRyYWNrIHdpZHRoIGlzIGRpZmZlcmVudCBmcm9tIGZ1bGwgdHJhY2sgd2lkdGhcbiAgICovXG4gIF90aWNrTWFya1RyYWNrV2lkdGg6IG51bWJlciA9IDA7XG5cbiAgX2hhc0FuaW1hdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3Jlc2l6ZVRpbWVyOiBudWxsIHwgUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gPSBudWxsO1xuXG4gIHByaXZhdGUgX3BsYXRmb3JtID0gaW5qZWN0KFBsYXRmb3JtKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcmVhZG9ubHkgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgcmVhZG9ubHkgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgcmVhZG9ubHkgX2dsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fb25EaXJDaGFuZ2UoKSk7XG4gICAgdGhpcy5faXNSdGwgPSB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIG5hdGl2ZSBzbGlkZXIncyBrbm9iLiBBRkFJSyB0aGVyZSBpcyBubyB3YXkgdG8gYXZvaWQgaGFyZGNvZGluZyB0aGlzLiAqL1xuICBfa25vYlJhZGl1czogbnVtYmVyID0gODtcblxuICBfaW5wdXRQYWRkaW5nOiBudW1iZXI7XG4gIF9pbnB1dE9mZnNldDogbnVtYmVyO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZUlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgY29uc3Qgc0lucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKTtcbiAgICB0aGlzLl9pc1JhbmdlID0gISFlSW5wdXQgJiYgISFzSW5wdXQ7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIF92YWxpZGF0ZUlucHV0cyhcbiAgICAgICAgdGhpcy5faXNSYW5nZSxcbiAgICAgICAgdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkhLFxuICAgICAgICB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0aHVtYiA9IHRoaXMuX2dldFRodW1iKF9NYXRUaHVtYi5FTkQpO1xuICAgIHRoaXMuX3JpcHBsZVJhZGl1cyA9IHRodW1iLl9yaXBwbGUucmFkaXVzO1xuICAgIHRoaXMuX2lucHV0UGFkZGluZyA9IHRoaXMuX3JpcHBsZVJhZGl1cyAtIHRoaXMuX2tub2JSYWRpdXM7XG4gICAgdGhpcy5faW5wdXRPZmZzZXQgPSB0aGlzLl9rbm9iUmFkaXVzO1xuXG4gICAgdGhpcy5faXNSYW5nZVxuICAgICAgPyB0aGlzLl9pbml0VUlSYW5nZShlSW5wdXQgYXMgX01hdFNsaWRlclJhbmdlVGh1bWIsIHNJbnB1dCBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYilcbiAgICAgIDogdGhpcy5faW5pdFVJTm9uUmFuZ2UoZUlucHV0ISk7XG5cbiAgICB0aGlzLl91cGRhdGVUcmFja1VJKGVJbnB1dCEpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTtcblxuICAgIHRoaXMuX29ic2VydmVIb3N0UmVzaXplKCk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRVSU5vblJhbmdlKGVJbnB1dDogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgZUlucHV0LmluaXRQcm9wcygpO1xuICAgIGVJbnB1dC5pbml0VUkoKTtcblxuICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUkoZUlucHV0KTtcblxuICAgIHRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG4gICAgZUlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdFVJUmFuZ2UoZUlucHV0OiBfTWF0U2xpZGVyUmFuZ2VUaHVtYiwgc0lucHV0OiBfTWF0U2xpZGVyUmFuZ2VUaHVtYik6IHZvaWQge1xuICAgIGVJbnB1dC5pbml0UHJvcHMoKTtcbiAgICBlSW5wdXQuaW5pdFVJKCk7XG5cbiAgICBzSW5wdXQuaW5pdFByb3BzKCk7XG4gICAgc0lucHV0LmluaXRVSSgpO1xuXG4gICAgZUlucHV0Ll91cGRhdGVNaW5NYXgoKTtcbiAgICBzSW5wdXQuX3VwZGF0ZU1pbk1heCgpO1xuXG4gICAgZUlucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcbiAgICBzSW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuXG4gICAgdGhpcy5fdXBkYXRlVmFsdWVJbmRpY2F0b3JVSXMoKTtcblxuICAgIHRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBlSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgc0lucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLl9yZXNpemVPYnNlcnZlciA9IG51bGw7XG4gIH1cblxuICAvKiogSGFuZGxlcyB1cGRhdGluZyB0aGUgc2xpZGVyIHVpIGFmdGVyIGEgZGlyIGNoYW5nZS4gKi9cbiAgcHJpdmF0ZSBfb25EaXJDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5faXNSdGwgPSB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICAgIHRoaXMuX2lzUmFuZ2UgPyB0aGlzLl9vbkRpckNoYW5nZVJhbmdlKCkgOiB0aGlzLl9vbkRpckNoYW5nZU5vblJhbmdlKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25EaXJDaGFuZ2VSYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuXG4gICAgZW5kSW5wdXQuX3NldElzTGVmdFRodW1iKCk7XG4gICAgc3RhcnRJbnB1dC5fc2V0SXNMZWZ0VGh1bWIoKTtcblxuICAgIGVuZElucHV0LnRyYW5zbGF0ZVggPSBlbmRJbnB1dC5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG4gICAgc3RhcnRJbnB1dC50cmFuc2xhdGVYID0gc3RhcnRJbnB1dC5fY2FsY1RyYW5zbGF0ZVhCeVZhbHVlKCk7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIGVuZElucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gIH1cblxuICBwcml2YXRlIF9vbkRpckNoYW5nZU5vblJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkhO1xuICAgIGlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyBvYnNlcnZpbmcgYW5kIHVwZGF0aW5nIHRoZSBzbGlkZXIgaWYgdGhlIGhvc3QgY2hhbmdlcyBpdHMgc2l6ZS4gKi9cbiAgcHJpdmF0ZSBfb2JzZXJ2ZUhvc3RSZXNpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBSZXNpemVPYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcgfHwgIVJlc2l6ZU9ic2VydmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQWN0aXZlKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZVRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Jlc2l6ZVRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vblJlc2l6ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogV2hldGhlciBhbnkgb2YgdGhlIHRodW1icyBhcmUgY3VycmVudGx5IGFjdGl2ZS4gKi9cbiAgcHJpdmF0ZSBfaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFRodW1iKF9NYXRUaHVtYi5TVEFSVCkuX2lzQWN0aXZlIHx8IHRoaXMuX2dldFRodW1iKF9NYXRUaHVtYi5FTkQpLl9pc0FjdGl2ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFZhbHVlKHRodW1iUG9zaXRpb246IF9NYXRUaHVtYiA9IF9NYXRUaHVtYi5FTkQpOiBudW1iZXIge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQodGh1bWJQb3NpdGlvbik7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMubWluO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9za2lwVXBkYXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIShcbiAgICAgIHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk/Ll9za2lwVUlVcGRhdGUgfHwgdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk/Ll9za2lwVUlVcGRhdGVcbiAgICApO1xuICB9XG5cbiAgLyoqIFN0b3JlcyB0aGUgc2xpZGVyIGRpbWVuc2lvbnMuICovXG4gIF91cGRhdGVEaW1lbnNpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuX2NhY2hlZFdpZHRoID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIHRoaXMuX2NhY2hlZExlZnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzdHlsZXMgZm9yIHRoZSBhY3RpdmUgcG9ydGlvbiBvZiB0aGUgdHJhY2suICovXG4gIF9zZXRUcmFja0FjdGl2ZVN0eWxlcyhzdHlsZXM6IHtcbiAgICBsZWZ0OiBzdHJpbmc7XG4gICAgcmlnaHQ6IHN0cmluZztcbiAgICB0cmFuc2Zvcm06IHN0cmluZztcbiAgICB0cmFuc2Zvcm1PcmlnaW46IHN0cmluZztcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IHRyYWNrU3R5bGUgPSB0aGlzLl90cmFja0FjdGl2ZS5uYXRpdmVFbGVtZW50LnN0eWxlO1xuXG4gICAgdHJhY2tTdHlsZS5sZWZ0ID0gc3R5bGVzLmxlZnQ7XG4gICAgdHJhY2tTdHlsZS5yaWdodCA9IHN0eWxlcy5yaWdodDtcbiAgICB0cmFja1N0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IHN0eWxlcy50cmFuc2Zvcm1PcmlnaW47XG4gICAgdHJhY2tTdHlsZS50cmFuc2Zvcm0gPSBzdHlsZXMudHJhbnNmb3JtO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRyYW5zbGF0ZVggcG9zaXRpb25pbmcgZm9yIGEgdGljayBtYXJrIGJhc2VkIG9uIGl0J3MgaW5kZXguICovXG4gIF9jYWxjVGlja01hcmtUcmFuc2Zvcm0oaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBTZWUgaWYgd2UgY2FuIGF2b2lkIGRvaW5nIHRoaXMgYW5kIGp1c3QgdXNpbmcgZmxleCB0byBwb3NpdGlvbiB0aGVzZS5cbiAgICBjb25zdCB0cmFuc2xhdGVYID0gaW5kZXggKiAodGhpcy5fdGlja01hcmtUcmFja1dpZHRoIC8gKHRoaXMuX3RpY2tNYXJrcy5sZW5ndGggLSAxKSk7XG4gICAgcmV0dXJuIGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRlWH1weGA7XG4gIH1cblxuICAvLyBIYW5kbGVycyBmb3IgdXBkYXRpbmcgdGhlIHNsaWRlciB1aS5cblxuICBfb25UcmFuc2xhdGVYQ2hhbmdlKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVUaHVtYlVJKHNvdXJjZSk7XG4gICAgdGhpcy5fdXBkYXRlVHJhY2tVSShzb3VyY2UpO1xuICAgIHRoaXMuX3VwZGF0ZU92ZXJsYXBwaW5nVGh1bWJVSShzb3VyY2UgYXMgX01hdFNsaWRlclJhbmdlVGh1bWIpO1xuICB9XG5cbiAgX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChcbiAgICBpbnB1dDE6IF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICAgIGlucHV0MjogX01hdFNsaWRlclJhbmdlVGh1bWIsXG4gICk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzVmlld0luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW5wdXQxLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgIGlucHV0Mi5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgfVxuXG4gIF9vblZhbHVlQ2hhbmdlKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVWYWx1ZUluZGljYXRvclVJKHNvdXJjZSk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBfb25NaW5NYXhPclN0ZXBDaGFuZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1VJKCk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtUcmFja1VJKCk7XG4gICAgdGhpcy5fY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX29uUmVzaXplKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzVmlld0luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRGltZW5zaW9ucygpO1xuICAgIGlmICh0aGlzLl9pc1JhbmdlKSB7XG4gICAgICBjb25zdCBlSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICAgIGNvbnN0IHNJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICAgIGVJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcblxuICAgICAgZUlucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG5cbiAgICAgIGVJbnB1dC5fdXBkYXRlTWluTWF4KCk7XG4gICAgICBzSW5wdXQuX3VwZGF0ZU1pbk1heCgpO1xuXG4gICAgICBlSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICAgIGlmIChlSW5wdXQpIHtcbiAgICAgICAgZUlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBzbGlkZXIgdGh1bWJzIG92ZXJsYXAuICovXG4gIHByaXZhdGUgX3RodW1ic092ZXJsYXA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBzbGlkZXIga25vYnMgYXJlIG92ZXJsYXBwaW5nIG9uZSBhbm90aGVyLiAqL1xuICBwcml2YXRlIF9hcmVUaHVtYnNPdmVybGFwcGluZygpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKTtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGlmICghc3RhcnRJbnB1dCB8fCAhZW5kSW5wdXQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGVuZElucHV0LnRyYW5zbGF0ZVggLSBzdGFydElucHV0LnRyYW5zbGF0ZVggPCAyMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjbGFzcyBuYW1lcyBvZiBvdmVybGFwcGluZyBzbGlkZXIgdGh1bWJzIHNvXG4gICAqIHRoYXQgdGhlIGN1cnJlbnQgYWN0aXZlIHRodW1iIGlzIHN0eWxlZCB0byBiZSBvbiBcInRvcFwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlT3ZlcmxhcHBpbmdUaHVtYkNsYXNzTmFtZXMoc291cmNlOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYik6IHZvaWQge1xuICAgIGNvbnN0IHNpYmxpbmcgPSBzb3VyY2UuZ2V0U2libGluZygpITtcbiAgICBjb25zdCBzb3VyY2VUaHVtYiA9IHRoaXMuX2dldFRodW1iKHNvdXJjZS50aHVtYlBvc2l0aW9uKTtcbiAgICBjb25zdCBzaWJsaW5nVGh1bWIgPSB0aGlzLl9nZXRUaHVtYihzaWJsaW5nLnRodW1iUG9zaXRpb24pO1xuICAgIHNpYmxpbmdUaHVtYi5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLXRvcCcpO1xuICAgIHNvdXJjZVRodW1iLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtc2xpZGVyX190aHVtYi0tdG9wJywgdGhpcy5fdGh1bWJzT3ZlcmxhcCk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgVUkgb2Ygc2xpZGVyIHRodW1icyB3aGVuIHRoZXkgYmVnaW4gb3Igc3RvcCBvdmVybGFwcGluZy4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlT3ZlcmxhcHBpbmdUaHVtYlVJKHNvdXJjZTogX01hdFNsaWRlclJhbmdlVGh1bWIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzUmFuZ2UgfHwgdGhpcy5fc2tpcFVwZGF0ZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl90aHVtYnNPdmVybGFwICE9PSB0aGlzLl9hcmVUaHVtYnNPdmVybGFwcGluZygpKSB7XG4gICAgICB0aGlzLl90aHVtYnNPdmVybGFwID0gIXRoaXMuX3RodW1ic092ZXJsYXA7XG4gICAgICB0aGlzLl91cGRhdGVPdmVybGFwcGluZ1RodW1iQ2xhc3NOYW1lcyhzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIF9NYXRUaHVtYiBzdHlsZXMgdXBkYXRlIGNvbmRpdGlvbnNcbiAgLy9cbiAgLy8gMS4gVHJhbnNsYXRlWCwgcmVzaXplLCBvciBkaXIgY2hhbmdlXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdGh1bWIgc3R5bGVzIG5lZWQgdG8gYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIG5ldyB0cmFuc2xhdGVYLlxuICAvLyAyLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbjogVGhlIHZhbHVlIG1heSBoYXZlIHNpbGVudGx5IGNoYW5nZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRyYW5zbGF0ZVggb2YgdGhlIGdpdmVuIHRodW1iLiAqL1xuICBfdXBkYXRlVGh1bWJVSShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYikge1xuICAgIGlmICh0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGh1bWIgPSB0aGlzLl9nZXRUaHVtYihcbiAgICAgIHNvdXJjZS50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuRU5EID8gX01hdFRodW1iLkVORCA6IF9NYXRUaHVtYi5TVEFSVCxcbiAgICApITtcbiAgICB0aHVtYi5faG9zdEVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtzb3VyY2UudHJhbnNsYXRlWH1weClgO1xuICB9XG5cbiAgLy8gVmFsdWUgaW5kaWNhdG9yIHRleHQgdXBkYXRlIGNvbmRpdGlvbnNcbiAgLy9cbiAgLy8gMS4gVmFsdWVcbiAgLy8gICAgLSBSZWFzb246IFRoZSB2YWx1ZSBkaXNwbGF5ZWQgbmVlZHMgdG8gYmUgdXBkYXRlZC5cbiAgLy8gMi4gTWluLCBtYXgsIG9yIHN0ZXBcbiAgLy8gICAgLSBSZWFzb246IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSB2YWx1ZSBpbmRpY2F0b3IgdG9vbHRpcCB1aSBmb3IgdGhlIGdpdmVuIHRodW1iLiAqL1xuICBfdXBkYXRlVmFsdWVJbmRpY2F0b3JVSShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZXRleHQgPSB0aGlzLmRpc3BsYXlXaXRoKHNvdXJjZS52YWx1ZSk7XG5cbiAgICB0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWRcbiAgICAgID8gKHNvdXJjZS5fdmFsdWV0ZXh0ID0gdmFsdWV0ZXh0KVxuICAgICAgOiBzb3VyY2UuX2hvc3RFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCB2YWx1ZXRleHQpO1xuXG4gICAgaWYgKHRoaXMuZGlzY3JldGUpIHtcbiAgICAgIHNvdXJjZS50aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlRcbiAgICAgICAgPyAodGhpcy5zdGFydFZhbHVlSW5kaWNhdG9yVGV4dCA9IHZhbHVldGV4dClcbiAgICAgICAgOiAodGhpcy5lbmRWYWx1ZUluZGljYXRvclRleHQgPSB2YWx1ZXRleHQpO1xuXG4gICAgICBjb25zdCB2aXN1YWxUaHVtYiA9IHRoaXMuX2dldFRodW1iKHNvdXJjZS50aHVtYlBvc2l0aW9uKTtcbiAgICAgIHZhbHVldGV4dC5sZW5ndGggPCAzXG4gICAgICAgID8gdmlzdWFsVGh1bWIuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1zbGlkZXJfX3RodW1iLS1zaG9ydC12YWx1ZScpXG4gICAgICAgIDogdmlzdWFsVGh1bWIuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21kYy1zbGlkZXJfX3RodW1iLS1zaG9ydC12YWx1ZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGVzIGFsbCB2YWx1ZSBpbmRpY2F0b3IgVUlzIGluIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUlzKCk6IHZvaWQge1xuICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGNvbnN0IHNJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk7XG5cbiAgICBpZiAoZUlucHV0KSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUluZGljYXRvclVJKGVJbnB1dCk7XG4gICAgfVxuICAgIGlmIChzSW5wdXQpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUkoc0lucHV0KTtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGUgVGljayBNYXJrIFRyYWNrIFdpZHRoXG4gIC8vXG4gIC8vIDEuIE1pbiwgbWF4LCBvciBzdGVwXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgbWF4aW11bSByZWFjaGFibGUgdmFsdWUgbWF5IGhhdmUgY2hhbmdlZC5cbiAgLy8gICAgLSBTaWRlIG5vdGU6IFRoZSBtYXhpbXVtIHJlYWNoYWJsZSB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbWF4aW11bSB2YWx1ZSBzZXQgYnkgdGhlXG4gIC8vICAgICAgdXNlci4gRm9yIGV4YW1wbGUsIGEgc2xpZGVyIHdpdGggW21pbjogNSwgbWF4OiAxMDAsIHN0ZXA6IDEwXSB3b3VsZCBoYXZlIGEgbWF4aW11bVxuICAvLyAgICAgIHJlYWNoYWJsZSB2YWx1ZSBvZiA5NS5cbiAgLy8gMi4gUmVzaXplXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgcG9zaXRpb24gZm9yIHRoZSBtYXhpbXVtIHJlYWNoYWJsZSB2YWx1ZSBuZWVkcyB0byBiZSByZWNhbGN1bGF0ZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHdpZHRoIG9mIHRoZSB0aWNrIG1hcmsgdHJhY2suICovXG4gIHByaXZhdGUgX3VwZGF0ZVRpY2tNYXJrVHJhY2tVSSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2hvd1RpY2tNYXJrcyB8fCB0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdGVwID0gdGhpcy5fc3RlcCAmJiB0aGlzLl9zdGVwID4gMCA/IHRoaXMuX3N0ZXAgOiAxO1xuICAgIGNvbnN0IG1heFZhbHVlID0gTWF0aC5mbG9vcih0aGlzLm1heCAvIHN0ZXApICogc3RlcDtcbiAgICBjb25zdCBwZXJjZW50YWdlID0gKG1heFZhbHVlIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgIHRoaXMuX3RpY2tNYXJrVHJhY2tXaWR0aCA9IHRoaXMuX2NhY2hlZFdpZHRoICogcGVyY2VudGFnZSAtIDY7XG4gIH1cblxuICAvLyBUcmFjayBhY3RpdmUgdXBkYXRlIGNvbmRpdGlvbnNcbiAgLy9cbiAgLy8gMS4gVHJhbnNsYXRlWFxuICAvLyAgICAtIFJlYXNvbjogVGhlIHRyYWNrIGFjdGl2ZSBzaG91bGQgbGluZSB1cCB3aXRoIHRoZSBuZXcgdGh1bWIgcG9zaXRpb24uXG4gIC8vIDIuIE1pbiBvciBtYXhcbiAgLy8gICAgLSBSZWFzb24gIzE6IFRoZSAnYWN0aXZlJyBwZXJjZW50YWdlIG5lZWRzIHRvIGJlIHJlY2FsY3VsYXRlZC5cbiAgLy8gICAgLSBSZWFzb24gIzI6IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkLlxuICAvLyAzLiBTdGVwXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdmFsdWUgbWF5IGhhdmUgc2lsZW50bHkgY2hhbmdlZCBjYXVzaW5nIHRoZSB0aHVtYihzKSB0byBzaGlmdC5cbiAgLy8gNC4gRGlyIGNoYW5nZVxuICAvLyAgICAtIFJlYXNvbjogVGhlIHRyYWNrIGFjdGl2ZSB3aWxsIG5lZWQgdG8gYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIG5ldyB0aHVtYiBwb3NpdGlvbihzKS5cbiAgLy8gNS4gUmVzaXplXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdG90YWwgd2lkdGggdGhlICdhY3RpdmUnIHRyYWNrcyB0cmFuc2xhdGVYIGlzIGJhc2VkIG9uIGhhcyBjaGFuZ2VkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSBzY2FsZSBvbiB0aGUgYWN0aXZlIHBvcnRpb24gb2YgdGhlIHRyYWNrLiAqL1xuICBfdXBkYXRlVHJhY2tVSShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1JhbmdlXG4gICAgICA/IHRoaXMuX3VwZGF0ZVRyYWNrVUlSYW5nZShzb3VyY2UgYXMgX01hdFNsaWRlclJhbmdlVGh1bWIpXG4gICAgICA6IHRoaXMuX3VwZGF0ZVRyYWNrVUlOb25SYW5nZShzb3VyY2UgYXMgX01hdFNsaWRlclRodW1iKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVRyYWNrVUlSYW5nZShzb3VyY2U6IF9NYXRTbGlkZXJSYW5nZVRodW1iKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHNvdXJjZS5nZXRTaWJsaW5nKCk7XG4gICAgaWYgKCFzaWJsaW5nIHx8ICF0aGlzLl9jYWNoZWRXaWR0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZVBlcmNlbnRhZ2UgPSBNYXRoLmFicyhzaWJsaW5nLnRyYW5zbGF0ZVggLSBzb3VyY2UudHJhbnNsYXRlWCkgLyB0aGlzLl9jYWNoZWRXaWR0aDtcblxuICAgIGlmIChzb3VyY2UuX2lzTGVmdFRodW1iICYmIHRoaXMuX2NhY2hlZFdpZHRoKSB7XG4gICAgICB0aGlzLl9zZXRUcmFja0FjdGl2ZVN0eWxlcyh7XG4gICAgICAgIGxlZnQ6ICdhdXRvJyxcbiAgICAgICAgcmlnaHQ6IGAke3RoaXMuX2NhY2hlZFdpZHRoIC0gc2libGluZy50cmFuc2xhdGVYfXB4YCxcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAncmlnaHQnLFxuICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHthY3RpdmVQZXJjZW50YWdlfSlgLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldFRyYWNrQWN0aXZlU3R5bGVzKHtcbiAgICAgICAgbGVmdDogYCR7c2libGluZy50cmFuc2xhdGVYfXB4YCxcbiAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnbGVmdCcsXG4gICAgICAgIHRyYW5zZm9ybTogYHNjYWxlWCgke2FjdGl2ZVBlcmNlbnRhZ2V9KWAsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUcmFja1VJTm9uUmFuZ2Uoc291cmNlOiBfTWF0U2xpZGVyVGh1bWIpOiB2b2lkIHtcbiAgICB0aGlzLl9pc1J0bFxuICAgICAgPyB0aGlzLl9zZXRUcmFja0FjdGl2ZVN0eWxlcyh7XG4gICAgICAgICAgbGVmdDogJ2F1dG8nLFxuICAgICAgICAgIHJpZ2h0OiAnMHB4JyxcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdyaWdodCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGVYKCR7MSAtIHNvdXJjZS5maWxsUGVyY2VudGFnZX0pYCxcbiAgICAgICAgfSlcbiAgICAgIDogdGhpcy5fc2V0VHJhY2tBY3RpdmVTdHlsZXMoe1xuICAgICAgICAgIGxlZnQ6ICcwcHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bycsXG4gICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnbGVmdCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGVYKCR7c291cmNlLmZpbGxQZXJjZW50YWdlfSlgLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8vIFRpY2sgbWFyayB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBWYWx1ZVxuICAvLyAgICAtIFJlYXNvbjogYSB0aWNrIG1hcmsgd2hpY2ggd2FzIG9uY2UgYWN0aXZlIG1pZ2h0IG5vdyBiZSBpbmFjdGl2ZSBvciB2aWNlIHZlcnNhLlxuICAvLyAyLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbiAjMTogdGhlIG51bWJlciBvZiB0aWNrIG1hcmtzIG1heSBoYXZlIGNoYW5nZWQuXG4gIC8vICAgIC0gUmVhc29uICMyOiBUaGUgdmFsdWUgbWF5IGhhdmUgc2lsZW50bHkgY2hhbmdlZC5cblxuICAvKiogVXBkYXRlcyB0aGUgZG90cyBhbG9uZyB0aGUgc2xpZGVyIHRyYWNrLiAqL1xuICBfdXBkYXRlVGlja01hcmtVSSgpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5zaG93VGlja01hcmtzIHx8XG4gICAgICB0aGlzLnN0ZXAgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5taW4gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5tYXggPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gdGhpcy5zdGVwID4gMCA/IHRoaXMuc3RlcCA6IDE7XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUlSYW5nZShzdGVwKSA6IHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUlOb25SYW5nZShzdGVwKTtcblxuICAgIGlmICh0aGlzLl9pc1J0bCkge1xuICAgICAgdGhpcy5fdGlja01hcmtzLnJldmVyc2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUaWNrTWFya1VJTm9uUmFuZ2Uoc3RlcDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9nZXRWYWx1ZSgpO1xuICAgIGxldCBudW1BY3RpdmUgPSBNYXRoLm1heChNYXRoLnJvdW5kKCh2YWx1ZSAtIHRoaXMubWluKSAvIHN0ZXApLCAwKTtcbiAgICBsZXQgbnVtSW5hY3RpdmUgPSBNYXRoLm1heChNYXRoLnJvdW5kKCh0aGlzLm1heCAtIHZhbHVlKSAvIHN0ZXApLCAwKTtcbiAgICB0aGlzLl9pc1J0bCA/IG51bUFjdGl2ZSsrIDogbnVtSW5hY3RpdmUrKztcblxuICAgIHRoaXMuX3RpY2tNYXJrcyA9IEFycmF5KG51bUFjdGl2ZSlcbiAgICAgIC5maWxsKF9NYXRUaWNrTWFyay5BQ1RJVkUpXG4gICAgICAuY29uY2F0KEFycmF5KG51bUluYWN0aXZlKS5maWxsKF9NYXRUaWNrTWFyay5JTkFDVElWRSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja01hcmtVSVJhbmdlKHN0ZXA6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGVuZFZhbHVlID0gdGhpcy5fZ2V0VmFsdWUoKTtcbiAgICBjb25zdCBzdGFydFZhbHVlID0gdGhpcy5fZ2V0VmFsdWUoX01hdFRodW1iLlNUQVJUKTtcblxuICAgIGNvbnN0IG51bUluYWN0aXZlQmVmb3JlU3RhcnRUaHVtYiA9IE1hdGgubWF4KE1hdGguZmxvb3IoKHN0YXJ0VmFsdWUgLSB0aGlzLm1pbikgLyBzdGVwKSwgMCk7XG4gICAgY29uc3QgbnVtQWN0aXZlID0gTWF0aC5tYXgoTWF0aC5mbG9vcigoZW5kVmFsdWUgLSBzdGFydFZhbHVlKSAvIHN0ZXApICsgMSwgMCk7XG4gICAgY29uc3QgbnVtSW5hY3RpdmVBZnRlckVuZFRodW1iID0gTWF0aC5tYXgoTWF0aC5mbG9vcigodGhpcy5tYXggLSBlbmRWYWx1ZSkgLyBzdGVwKSwgMCk7XG4gICAgdGhpcy5fdGlja01hcmtzID0gQXJyYXkobnVtSW5hY3RpdmVCZWZvcmVTdGFydFRodW1iKVxuICAgICAgLmZpbGwoX01hdFRpY2tNYXJrLklOQUNUSVZFKVxuICAgICAgLmNvbmNhdChcbiAgICAgICAgQXJyYXkobnVtQWN0aXZlKS5maWxsKF9NYXRUaWNrTWFyay5BQ1RJVkUpLFxuICAgICAgICBBcnJheShudW1JbmFjdGl2ZUFmdGVyRW5kVGh1bWIpLmZpbGwoX01hdFRpY2tNYXJrLklOQUNUSVZFKSxcbiAgICAgICk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIHRodW1iIGlucHV0IG9mIHRoZSBnaXZlbiB0aHVtYiBwb3NpdGlvbi4gKi9cbiAgX2dldElucHV0KHRodW1iUG9zaXRpb246IF9NYXRUaHVtYik6IF9NYXRTbGlkZXJUaHVtYiB8IF9NYXRTbGlkZXJSYW5nZVRodW1iIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGh1bWJQb3NpdGlvbiA9PT0gX01hdFRodW1iLkVORCAmJiB0aGlzLl9pbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lucHV0O1xuICAgIH1cbiAgICBpZiAodGhpcy5faW5wdXRzPy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuU1RBUlQgPyB0aGlzLl9pbnB1dHMuZmlyc3QgOiB0aGlzLl9pbnB1dHMubGFzdDtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNsaWRlciB0aHVtYiBIVE1MIGlucHV0IGVsZW1lbnQgb2YgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uLiAqL1xuICBfZ2V0VGh1bWIodGh1bWJQb3NpdGlvbjogX01hdFRodW1iKTogX01hdFNsaWRlclZpc3VhbFRodW1iIHtcbiAgICByZXR1cm4gdGh1bWJQb3NpdGlvbiA9PT0gX01hdFRodW1iLkVORCA/IHRoaXMuX3RodW1icz8ubGFzdCEgOiB0aGlzLl90aHVtYnM/LmZpcnN0ITtcbiAgfVxuXG4gIF9zZXRUcmFuc2l0aW9uKHdpdGhBbmltYXRpb246IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNBbmltYXRpb24gPSAhdGhpcy5fcGxhdGZvcm0uSU9TICYmIHdpdGhBbmltYXRpb24gJiYgIXRoaXMuX25vb3BBbmltYXRpb25zO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgJ21hdC1tZGMtc2xpZGVyLXdpdGgtYW5pbWF0aW9uJyxcbiAgICAgIHRoaXMuX2hhc0FuaW1hdGlvbixcbiAgICApO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHBvaW50ZXIgZXZlbnQgb2NjdXJyZWQgd2l0aGluIHRoZSBib3VuZHMgb2YgdGhlIHNsaWRlciBwb2ludGVyJ3MgRE9NIFJlY3QuICovXG4gIF9pc0N1cnNvck9uU2xpZGVyVGh1bWIoZXZlbnQ6IFBvaW50ZXJFdmVudCwgcmVjdDogRE9NUmVjdCkge1xuICAgIGNvbnN0IHJhZGl1cyA9IHJlY3Qud2lkdGggLyAyO1xuICAgIGNvbnN0IGNlbnRlclggPSByZWN0LnggKyByYWRpdXM7XG4gICAgY29uc3QgY2VudGVyWSA9IHJlY3QueSArIHJhZGl1cztcbiAgICBjb25zdCBkeCA9IGV2ZW50LmNsaWVudFggLSBjZW50ZXJYO1xuICAgIGNvbnN0IGR5ID0gZXZlbnQuY2xpZW50WSAtIGNlbnRlclk7XG4gICAgcmV0dXJuIE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSA8IE1hdGgucG93KHJhZGl1cywgMik7XG4gIH1cbn1cblxuLyoqIEVuc3VyZXMgdGhhdCB0aGVyZSBpcyBub3QgYW4gaW52YWxpZCBjb25maWd1cmF0aW9uIGZvciB0aGUgc2xpZGVyIHRodW1iIGlucHV0cy4gKi9cbmZ1bmN0aW9uIF92YWxpZGF0ZUlucHV0cyhcbiAgaXNSYW5nZTogYm9vbGVhbixcbiAgZW5kSW5wdXRFbGVtZW50OiBfTWF0U2xpZGVyVGh1bWIgfCBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgc3RhcnRJbnB1dEVsZW1lbnQ/OiBfTWF0U2xpZGVyVGh1bWIsXG4pOiB2b2lkIHtcbiAgY29uc3Qgc3RhcnRWYWxpZCA9XG4gICAgIWlzUmFuZ2UgfHwgc3RhcnRJbnB1dEVsZW1lbnQ/Ll9ob3N0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ21hdFNsaWRlclN0YXJ0VGh1bWInKTtcbiAgY29uc3QgZW5kVmFsaWQgPSBlbmRJbnB1dEVsZW1lbnQuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZShcbiAgICBpc1JhbmdlID8gJ21hdFNsaWRlckVuZFRodW1iJyA6ICdtYXRTbGlkZXJUaHVtYicsXG4gICk7XG5cbiAgaWYgKCFzdGFydFZhbGlkIHx8ICFlbmRWYWxpZCkge1xuICAgIF90aHJvd0ludmFsaWRJbnB1dENvbmZpZ3VyYXRpb25FcnJvcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF90aHJvd0ludmFsaWRJbnB1dENvbmZpZ3VyYXRpb25FcnJvcigpOiB2b2lkIHtcbiAgdGhyb3cgRXJyb3IoYEludmFsaWQgc2xpZGVyIHRodW1iIGlucHV0IGNvbmZpZ3VyYXRpb24hXG5cbiAgIFZhbGlkIGNvbmZpZ3VyYXRpb25zIGFyZSBhcyBmb2xsb3dzOlxuXG4gICAgIDxtYXQtc2xpZGVyPlxuICAgICAgIDxpbnB1dCBtYXRTbGlkZXJUaHVtYj5cbiAgICAgPC9tYXQtc2xpZGVyPlxuXG4gICAgIG9yXG5cbiAgICAgPG1hdC1zbGlkZXI+XG4gICAgICAgPGlucHV0IG1hdFNsaWRlclN0YXJ0VGh1bWI+XG4gICAgICAgPGlucHV0IG1hdFNsaWRlckVuZFRodW1iPlxuICAgICA8L21hdC1zbGlkZXI+XG4gICBgKTtcbn1cbiIsIjwhLS0gSW5wdXRzIC0tPlxuPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuXG48IS0tIFRyYWNrIC0tPlxuPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RyYWNrXCI+XG4gIDxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX190cmFjay0taW5hY3RpdmVcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RyYWNrLS1hY3RpdmVcIj5cbiAgICA8ZGl2ICN0cmFja0FjdGl2ZSBjbGFzcz1cIm1kYy1zbGlkZXJfX3RyYWNrLS1hY3RpdmVfZmlsbFwiPjwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiAqbmdJZj1cInNob3dUaWNrTWFya3NcIiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RpY2stbWFya3NcIiAjdGlja01hcmtDb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIl9jYWNoZWRXaWR0aFwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgKm5nRm9yPVwibGV0IHRpY2tNYXJrIG9mIF90aWNrTWFya3M7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICAgIFtjbGFzc109XCJ0aWNrTWFyayA9PT0gMCA/ICdtZGMtc2xpZGVyX190aWNrLW1hcmstLWFjdGl2ZScgOiAnbWRjLXNsaWRlcl9fdGljay1tYXJrLS1pbmFjdGl2ZSdcIlxuICAgICAgICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwiX2NhbGNUaWNrTWFya1RyYW5zZm9ybShpKVwiPjwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48IS0tIFRodW1icyAtLT5cbjxtYXQtc2xpZGVyLXZpc3VhbC10aHVtYlxuICAqbmdJZj1cIl9pc1JhbmdlXCJcbiAgW2Rpc2NyZXRlXT1cImRpc2NyZXRlXCJcbiAgW3RodW1iUG9zaXRpb25dPVwiMVwiXG4gIFt2YWx1ZUluZGljYXRvclRleHRdPVwic3RhcnRWYWx1ZUluZGljYXRvclRleHRcIj5cbjwvbWF0LXNsaWRlci12aXN1YWwtdGh1bWI+XG5cbjxtYXQtc2xpZGVyLXZpc3VhbC10aHVtYlxuICBbZGlzY3JldGVdPVwiZGlzY3JldGVcIlxuICBbdGh1bWJQb3NpdGlvbl09XCIyXCJcbiAgW3ZhbHVlSW5kaWNhdG9yVGV4dF09XCJlbmRWYWx1ZUluZGljYXRvclRleHRcIj5cbjwvbWF0LXNsaWRlci12aXN1YWwtdGh1bWI+XG4iXX0=