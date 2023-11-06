/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, inject, Inject, Input, NgZone, numberAttribute, Optional, QueryList, ViewChild, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_SLIDER_RANGE_THUMB, MAT_SLIDER_THUMB, MAT_SLIDER, MAT_SLIDER_VISUAL_THUMB, } from './slider-interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "./slider-thumb";
// TODO(wagnermaciel): maybe handle the following edge case:
// 1. start dragging discrete slider
// 2. tab to disable checkbox
// 3. without ending drag, disable the slider
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export class MatSlider {
    /** Whether the slider is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(v) {
        this._disabled = v;
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
        this._discrete = v;
        this._updateValueIndicatorUIs();
    }
    /** The minimum value that the slider can have. */
    get min() {
        return this._min;
    }
    set min(v) {
        const min = isNaN(v) ? this._min : v;
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
        const max = isNaN(v) ? this._max : v;
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
        const step = isNaN(v) ? this._step : v;
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
    constructor(_ngZone, _cdr, _elementRef, _dir, _globalRippleOptions, animationMode) {
        this._ngZone = _ngZone;
        this._cdr = _cdr;
        this._elementRef = _elementRef;
        this._dir = _dir;
        this._globalRippleOptions = _globalRippleOptions;
        this._disabled = false;
        this._discrete = false;
        /** Whether the slider displays tick marks along the slider track. */
        this.showTickMarks = false;
        this._min = 0;
        /** Whether ripples are disabled in the slider. */
        this.disableRipple = false;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatSlider, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.0.0-rc.2", type: MatSlider, selector: "mat-slider", inputs: { disabled: ["disabled", "disabled", booleanAttribute], discrete: ["discrete", "discrete", booleanAttribute], showTickMarks: ["showTickMarks", "showTickMarks", booleanAttribute], min: ["min", "min", numberAttribute], color: "color", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], max: ["max", "max", numberAttribute], step: ["step", "step", numberAttribute], displayWith: "displayWith" }, host: { properties: { "class": "\"mat-\" + (color || \"primary\")", "class.mdc-slider--range": "_isRange", "class.mdc-slider--disabled": "disabled", "class.mdc-slider--discrete": "discrete", "class.mdc-slider--tick-marks": "showTickMarks", "class._mat-animation-noopable": "_noopAnimations" }, classAttribute: "mat-mdc-slider mdc-slider" }, providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], queries: [{ propertyName: "_input", first: true, predicate: MAT_SLIDER_THUMB, descendants: true }, { propertyName: "_inputs", predicate: MAT_SLIDER_RANGE_THUMB }], viewQueries: [{ propertyName: "_trackActive", first: true, predicate: ["trackActive"], descendants: true }, { propertyName: "_thumbs", predicate: MAT_SLIDER_VISUAL_THUMB, descendants: true }], exportAs: ["matSlider"], ngImport: i0, template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  @if (showTickMarks) {\n    <div class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n      @if (_cachedWidth) {\n        @for (tickMark of _tickMarks; track tickMark; let i = $index) {\n          <div\n            [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n            [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n        }\n      }\n    </div>\n  }\n</div>\n\n<!-- Thumbs -->\n@if (_isRange) {\n  <mat-slider-visual-thumb\n    [discrete]=\"discrete\"\n    [thumbPosition]=\"1\"\n    [valueIndicatorText]=\"startValueIndicatorText\">\n  </mat-slider-visual-thumb>\n}\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:50%;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:translateX(-50%);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:50%;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:translateX(-50%);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color);border-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color);border-color:var(--mdc-slider-disabled-handle-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color)}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color);opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color);opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color)}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height);top:calc((var(--mdc-slider-inactive-track-height) - var(--mdc-slider-active-track-height)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size);width:var(--mdc-slider-with-tick-marks-container-size)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking);font-size:var(--mdc-slider-label-label-text-size);font-family:var(--mdc-slider-label-label-text-font);font-weight:var(--mdc-slider-label-label-text-weight);line-height:var(--mdc-slider-label-label-text-line-height)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape);width:var(--mdc-slider-handle-width);height:var(--mdc-slider-handle-height);border-style:solid;border-width:calc(var(--mdc-slider-handle-height) / 2) calc(var(--mdc-slider-handle-width) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color);border-color:var(--mdc-slider-hover-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color);border-color:var(--mdc-slider-focus-handle-color)}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color);border-width:var(--mdc-slider-with-overlap-handle-outline-width)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-slider-value-indicator-opacity)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slider .mdc-slider__value-indicator{word-break:normal}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "component", type: i2.MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: ["discrete", "thumbPosition", "valueIndicatorText"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider', host: {
                        'class': 'mat-mdc-slider mdc-slider',
                        '[class]': '"mat-" + (color || "primary")',
                        '[class.mdc-slider--range]': '_isRange',
                        '[class.mdc-slider--disabled]': 'disabled',
                        '[class.mdc-slider--discrete]': 'discrete',
                        '[class.mdc-slider--tick-marks]': 'showTickMarks',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                    }, exportAs: 'matSlider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  @if (showTickMarks) {\n    <div class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n      @if (_cachedWidth) {\n        @for (tickMark of _tickMarks; track tickMark; let i = $index) {\n          <div\n            [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n            [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n        }\n      }\n    </div>\n  }\n</div>\n\n<!-- Thumbs -->\n@if (_isRange) {\n  <mat-slider-visual-thumb\n    [discrete]=\"discrete\"\n    [thumbPosition]=\"1\"\n    [valueIndicatorText]=\"startValueIndicatorText\">\n  </mat-slider-visual-thumb>\n}\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:50%;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:translateX(-50%);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:50%;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:translateX(-50%);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color);border-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color);border-color:var(--mdc-slider-disabled-handle-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color)}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color);opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color);opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color)}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height);top:calc((var(--mdc-slider-inactive-track-height) - var(--mdc-slider-active-track-height)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size);width:var(--mdc-slider-with-tick-marks-container-size)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking);font-size:var(--mdc-slider-label-label-text-size);font-family:var(--mdc-slider-label-label-text-font);font-weight:var(--mdc-slider-label-label-text-weight);line-height:var(--mdc-slider-label-label-text-line-height)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape);width:var(--mdc-slider-handle-width);height:var(--mdc-slider-handle-height);border-style:solid;border-width:calc(var(--mdc-slider-handle-height) / 2) calc(var(--mdc-slider-handle-width) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color);border-color:var(--mdc-slider-hover-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color);border-color:var(--mdc-slider-focus-handle-color)}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color);border-width:var(--mdc-slider-with-overlap-handle-outline-width)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-slider-value-indicator-opacity)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slider .mdc-slider__value-indicator{word-break:normal}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
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
                }] }], propDecorators: { _trackActive: [{
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
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], discrete: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showTickMarks: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], min: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], color: [{
                type: Input
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], max: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], step: [{
                type: Input,
                args: [{ transform: numberAttribute }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUVMLGdCQUFnQixFQUNoQix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sZUFBZSxFQUVmLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHlCQUF5QixFQUFvQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3BHLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRTNFLE9BQU8sRUFPTCxzQkFBc0IsRUFDdEIsZ0JBQWdCLEVBQ2hCLFVBQVUsRUFDVix1QkFBdUIsR0FDeEIsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUU1Qiw0REFBNEQ7QUFDNUQsb0NBQW9DO0FBQ3BDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0M7OztHQUdHO0FBbUJILE1BQU0sT0FBTyxTQUFTO0lBY3BCLHNDQUFzQztJQUN0QyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLENBQVU7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsTUFB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SUFFRixJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQzVCLG9DQUFvQyxFQUFFLENBQUM7S0FDeEM7QUFDSCxDQUFDO0FBRUQsU0FBUyxvQ0FBb0M7SUFDM0MsTUFBTSxLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBY1YsQ0FBQyxDQUFDO0FBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBpbmplY3QsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgbnVtYmVyQXR0cmlidXRlLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIFJpcHBsZUdsb2JhbE9wdGlvbnMsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgX01hdFRpY2tNYXJrLFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgX01hdFNsaWRlclRodW1iLFxuICBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsXG4gIE1BVF9TTElERVJfUkFOR0VfVEhVTUIsXG4gIE1BVF9TTElERVJfVEhVTUIsXG4gIE1BVF9TTElERVIsXG4gIE1BVF9TTElERVJfVklTVUFMX1RIVU1CLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuXG4vLyBUT0RPKHdhZ25lcm1hY2llbCk6IG1heWJlIGhhbmRsZSB0aGUgZm9sbG93aW5nIGVkZ2UgY2FzZTpcbi8vIDEuIHN0YXJ0IGRyYWdnaW5nIGRpc2NyZXRlIHNsaWRlclxuLy8gMi4gdGFiIHRvIGRpc2FibGUgY2hlY2tib3hcbi8vIDMuIHdpdGhvdXQgZW5kaW5nIGRyYWcsIGRpc2FibGUgdGhlIHNsaWRlclxuXG4vKipcbiAqIEFsbG93cyB1c2VycyB0byBzZWxlY3QgZnJvbSBhIHJhbmdlIG9mIHZhbHVlcyBieSBtb3ZpbmcgdGhlIHNsaWRlciB0aHVtYi4gSXQgaXMgc2ltaWxhciBpblxuICogYmVoYXZpb3IgdG8gdGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJyYW5nZVwiPmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtc2xpZGVyIG1kYy1zbGlkZXInLFxuICAgICdbY2xhc3NdJzogJ1wibWF0LVwiICsgKGNvbG9yIHx8IFwicHJpbWFyeVwiKScsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS1yYW5nZV0nOiAnX2lzUmFuZ2UnLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1kYy1zbGlkZXItLWRpc2NyZXRlXSc6ICdkaXNjcmV0ZScsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS10aWNrLW1hcmtzXSc6ICdzaG93VGlja01hcmtzJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfbm9vcEFuaW1hdGlvbnMnLFxuICB9LFxuICBleHBvcnRBczogJ21hdFNsaWRlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NMSURFUiwgdXNlRXhpc3Rpbmc6IE1hdFNsaWRlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXIgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIF9NYXRTbGlkZXIge1xuICAvKiogVGhlIGFjdGl2ZSBwb3J0aW9uIG9mIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIEBWaWV3Q2hpbGQoJ3RyYWNrQWN0aXZlJykgX3RyYWNrQWN0aXZlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYihzKS4gKi9cbiAgQFZpZXdDaGlsZHJlbihNQVRfU0xJREVSX1ZJU1VBTF9USFVNQikgX3RodW1iczogUXVlcnlMaXN0PF9NYXRTbGlkZXJWaXN1YWxUaHVtYj47XG5cbiAgLyoqIFRoZSBzbGlkZXJzIGhpZGRlbiByYW5nZSBpbnB1dChzKS4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfU0xJREVSX1RIVU1CKSBfaW5wdXQ6IF9NYXRTbGlkZXJUaHVtYjtcblxuICAvKiogVGhlIHNsaWRlcnMgaGlkZGVuIHJhbmdlIGlucHV0KHMpLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9TTElERVJfUkFOR0VfVEhVTUIsIHtkZXNjZW5kYW50czogZmFsc2V9KVxuICBfaW5wdXRzOiBRdWVyeUxpc3Q8X01hdFNsaWRlclJhbmdlVGh1bWI+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodjogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gdjtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpO1xuXG4gICAgaWYgKGVuZElucHV0KSB7XG4gICAgICBlbmRJbnB1dC5kaXNhYmxlZCA9IHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cbiAgICBpZiAoc3RhcnRJbnB1dCkge1xuICAgICAgc3RhcnRJbnB1dC5kaXNhYmxlZCA9IHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgZGlzcGxheXMgYSBudW1lcmljIHZhbHVlIGxhYmVsIHVwb24gcHJlc3NpbmcgdGhlIHRodW1iLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBkaXNjcmV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzY3JldGU7XG4gIH1cbiAgc2V0IGRpc2NyZXRlKHY6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNjcmV0ZSA9IHY7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWVJbmRpY2F0b3JVSXMoKTtcbiAgfVxuICBwcml2YXRlIF9kaXNjcmV0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgZGlzcGxheXMgdGljayBtYXJrcyBhbG9uZyB0aGUgc2xpZGVyIHRyYWNrLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIHNob3dUaWNrTWFya3M6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlfSlcbiAgZ2V0IG1pbigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9taW47XG4gIH1cbiAgc2V0IG1pbih2OiBudW1iZXIpIHtcbiAgICBjb25zdCBtaW4gPSBpc05hTih2KSA/IHRoaXMuX21pbiA6IHY7XG4gICAgaWYgKHRoaXMuX21pbiAhPT0gbWluKSB7XG4gICAgICB0aGlzLl91cGRhdGVNaW4obWluKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBudW1iZXIgPSAwO1xuXG4gIC8qKiBQYWxldHRlIGNvbG9yIG9mIHRoZSBzbGlkZXIuICovXG4gIEBJbnB1dCgpXG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgaW4gdGhlIHNsaWRlci4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWluKG1pbjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgcHJldk1pbiA9IHRoaXMuX21pbjtcbiAgICB0aGlzLl9taW4gPSBtaW47XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZU1pblJhbmdlKHtvbGQ6IHByZXZNaW4sIG5ldzogbWlufSkgOiB0aGlzLl91cGRhdGVNaW5Ob25SYW5nZShtaW4pO1xuICAgIHRoaXMuX29uTWluTWF4T3JTdGVwQ2hhbmdlKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVNaW5SYW5nZShtaW46IHtvbGQ6IG51bWJlcjsgbmV3OiBudW1iZXJ9KTogdm9pZCB7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgIGNvbnN0IG9sZEVuZFZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgY29uc3Qgb2xkU3RhcnRWYWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBzdGFydElucHV0Lm1pbiA9IG1pbi5uZXc7XG4gICAgZW5kSW5wdXQubWluID0gTWF0aC5tYXgobWluLm5ldywgc3RhcnRJbnB1dC52YWx1ZSk7XG4gICAgc3RhcnRJbnB1dC5tYXggPSBNYXRoLm1pbihlbmRJbnB1dC5tYXgsIGVuZElucHV0LnZhbHVlKTtcblxuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgbWluLm5ldyA8IG1pbi5vbGRcbiAgICAgID8gdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KGVuZElucHV0LCBzdGFydElucHV0KVxuICAgICAgOiB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3Qoc3RhcnRJbnB1dCwgZW5kSW5wdXQpO1xuXG4gICAgaWYgKG9sZEVuZFZhbHVlICE9PSBlbmRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShlbmRJbnB1dCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFN0YXJ0VmFsdWUgIT09IHN0YXJ0SW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2Uoc3RhcnRJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWluTm9uUmFuZ2UobWluOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGlmIChpbnB1dCkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgaW5wdXQubWluID0gbWluO1xuICAgICAgaW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB0aGlzLl91cGRhdGVUcmFja1VJKGlucHV0KTtcblxuICAgICAgaWYgKG9sZFZhbHVlICE9PSBpbnB1dC52YWx1ZSkge1xuICAgICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGlucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlfSlcbiAgZ2V0IG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tYXg7XG4gIH1cbiAgc2V0IG1heCh2OiBudW1iZXIpIHtcbiAgICBjb25zdCBtYXggPSBpc05hTih2KSA/IHRoaXMuX21heCA6IHY7XG4gICAgaWYgKHRoaXMuX21heCAhPT0gbWF4KSB7XG4gICAgICB0aGlzLl91cGRhdGVNYXgobWF4KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBudW1iZXIgPSAxMDA7XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWF4KG1heDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgcHJldk1heCA9IHRoaXMuX21heDtcbiAgICB0aGlzLl9tYXggPSBtYXg7XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX3VwZGF0ZU1heFJhbmdlKHtvbGQ6IHByZXZNYXgsIG5ldzogbWF4fSkgOiB0aGlzLl91cGRhdGVNYXhOb25SYW5nZShtYXgpO1xuICAgIHRoaXMuX29uTWluTWF4T3JTdGVwQ2hhbmdlKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVNYXhSYW5nZShtYXg6IHtvbGQ6IG51bWJlcjsgbmV3OiBudW1iZXJ9KTogdm9pZCB7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgIGNvbnN0IG9sZEVuZFZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgY29uc3Qgb2xkU3RhcnRWYWx1ZSA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBlbmRJbnB1dC5tYXggPSBtYXgubmV3O1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gTWF0aC5taW4obWF4Lm5ldywgZW5kSW5wdXQudmFsdWUpO1xuICAgIGVuZElucHV0Lm1pbiA9IHN0YXJ0SW5wdXQudmFsdWU7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIG1heC5uZXcgPiBtYXgub2xkXG4gICAgICA/IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChzdGFydElucHV0LCBlbmRJbnB1dClcbiAgICAgIDogdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KGVuZElucHV0LCBzdGFydElucHV0KTtcblxuICAgIGlmIChvbGRFbmRWYWx1ZSAhPT0gZW5kSW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoZW5kSW5wdXQpO1xuICAgIH1cblxuICAgIGlmIChvbGRTdGFydFZhbHVlICE9PSBzdGFydElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKHN0YXJ0SW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU1heE5vblJhbmdlKG1heDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gaW5wdXQudmFsdWU7XG5cbiAgICAgIGlucHV0Lm1heCA9IG1heDtcbiAgICAgIGlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlVHJhY2tVSShpbnB1dCk7XG5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gaW5wdXQudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZXMgYXQgd2hpY2ggdGhlIHRodW1iIHdpbGwgc25hcC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZX0pXG4gIGdldCBzdGVwKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0ZXA7XG4gIH1cbiAgc2V0IHN0ZXAodjogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3RlcCA9IGlzTmFOKHYpID8gdGhpcy5fc3RlcCA6IHY7XG4gICAgaWYgKHRoaXMuX3N0ZXAgIT09IHN0ZXApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN0ZXAoc3RlcCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3N0ZXA6IG51bWJlciA9IDE7XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RlcChzdGVwOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICB0aGlzLl9pc1JhbmdlID8gdGhpcy5fdXBkYXRlU3RlcFJhbmdlKCkgOiB0aGlzLl91cGRhdGVTdGVwTm9uUmFuZ2UoKTtcbiAgICB0aGlzLl9vbk1pbk1heE9yU3RlcENoYW5nZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RlcFJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICBjb25zdCBvbGRFbmRWYWx1ZSA9IGVuZElucHV0LnZhbHVlO1xuICAgIGNvbnN0IG9sZFN0YXJ0VmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgY29uc3QgcHJldlN0YXJ0VmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgZW5kSW5wdXQubWluID0gdGhpcy5fbWluO1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gdGhpcy5fbWF4O1xuXG4gICAgZW5kSW5wdXQuc3RlcCA9IHRoaXMuX3N0ZXA7XG4gICAgc3RhcnRJbnB1dC5zdGVwID0gdGhpcy5fc3RlcDtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5TQUZBUkkpIHtcbiAgICAgIGVuZElucHV0LnZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgICBzdGFydElucHV0LnZhbHVlID0gc3RhcnRJbnB1dC52YWx1ZTtcbiAgICB9XG5cbiAgICBlbmRJbnB1dC5taW4gPSBNYXRoLm1heCh0aGlzLl9taW4sIHN0YXJ0SW5wdXQudmFsdWUpO1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gTWF0aC5taW4odGhpcy5fbWF4LCBlbmRJbnB1dC52YWx1ZSk7XG5cbiAgICBzdGFydElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgZW5kSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIGVuZElucHV0LnZhbHVlIDwgcHJldlN0YXJ0VmFsdWVcbiAgICAgID8gdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KHN0YXJ0SW5wdXQsIGVuZElucHV0KVxuICAgICAgOiB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3QoZW5kSW5wdXQsIHN0YXJ0SW5wdXQpO1xuXG4gICAgaWYgKG9sZEVuZFZhbHVlICE9PSBlbmRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShlbmRJbnB1dCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFN0YXJ0VmFsdWUgIT09IHN0YXJ0SW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2Uoc3RhcnRJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RlcE5vblJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICBpbnB1dC5zdGVwID0gdGhpcy5fc3RlcDtcbiAgICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5TQUZBUkkpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gaW5wdXQudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGZvcm1hdCB0aGUgdmFsdWUgYmVmb3JlIGl0IGlzIGRpc3BsYXllZFxuICAgKiBpbiB0aGUgdGh1bWIgbGFiZWwuIENhbiBiZSB1c2VkIHRvIGZvcm1hdCB2ZXJ5IGxhcmdlIG51bWJlciBpbiBvcmRlclxuICAgKiBmb3IgdGhlbSB0byBmaXQgaW50byB0aGUgc2xpZGVyIHRodW1iLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheVdpdGg6ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSAodmFsdWU6IG51bWJlcikgPT4gYCR7dmFsdWV9YDtcblxuICAvKiogVXNlZCB0byBrZWVwIHRyYWNrIG9mICYgcmVuZGVyIHRoZSBhY3RpdmUgJiBpbmFjdGl2ZSB0aWNrIG1hcmtzIG9uIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIF90aWNrTWFya3M6IF9NYXRUaWNrTWFya1tdO1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgaGF2ZSBiZWVuIGRpc2FibGVkLiAqL1xuICBfbm9vcEFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBjaGFuZ2VzIHRvIHRoZSBkaXJlY3Rpb25hbGl0eSAoTFRSIC8gUlRMKSBjb250ZXh0IGZvciB0aGUgYXBwbGljYXRpb24uICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBPYnNlcnZlciB1c2VkIHRvIG1vbml0b3Igc2l6ZSBjaGFuZ2VzIGluIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3Jlc2l6ZU9ic2VydmVyOiBSZXNpemVPYnNlcnZlciB8IG51bGw7XG5cbiAgLy8gU3RvcmVkIGRpbWVuc2lvbnMgdG8gYXZvaWQgY2FsbGluZyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgcmVkdW5kYW50bHkuXG5cbiAgX2NhY2hlZFdpZHRoOiBudW1iZXI7XG4gIF9jYWNoZWRMZWZ0OiBudW1iZXI7XG5cbiAgX3JpcHBsZVJhZGl1czogbnVtYmVyID0gMjQ7XG5cbiAgLy8gVGhlIHZhbHVlIGluZGljYXRvciB0b29sdGlwIHRleHQgZm9yIHRoZSB2aXN1YWwgc2xpZGVyIHRodW1iKHMpLlxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIHByb3RlY3RlZCBzdGFydFZhbHVlSW5kaWNhdG9yVGV4dDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgcHJvdGVjdGVkIGVuZFZhbHVlSW5kaWNhdG9yVGV4dDogc3RyaW5nID0gJyc7XG5cbiAgLy8gVXNlZCB0byBjb250cm9sIHRoZSB0cmFuc2xhdGVYIG9mIHRoZSB2aXN1YWwgc2xpZGVyIHRodW1iKHMpLlxuXG4gIF9lbmRUaHVtYlRyYW5zZm9ybTogc3RyaW5nO1xuICBfc3RhcnRUaHVtYlRyYW5zZm9ybTogc3RyaW5nO1xuXG4gIF9pc1JhbmdlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBydGwuICovXG4gIF9pc1J0bDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2hhc1ZpZXdJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgd2lkdGggb2YgdGhlIHRpY2sgbWFyayB0cmFjay5cbiAgICogVGhlIHRpY2sgbWFyayB0cmFjayB3aWR0aCBpcyBkaWZmZXJlbnQgZnJvbSBmdWxsIHRyYWNrIHdpZHRoXG4gICAqL1xuICBfdGlja01hcmtUcmFja1dpZHRoOiBudW1iZXIgPSAwO1xuXG4gIF9oYXNBbmltYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9yZXNpemVUaW1lcjogbnVsbCB8IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+ID0gbnVsbDtcblxuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHJlYWRvbmx5IF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSByZWFkb25seSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUylcbiAgICByZWFkb25seSBfZ2xvYmFsUmlwcGxlT3B0aW9ucz86IFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuX25vb3BBbmltYXRpb25zID0gYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLl9kaXIuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9vbkRpckNoYW5nZSgpKTtcbiAgICB0aGlzLl9pc1J0bCA9IHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCc7XG4gIH1cblxuICAvKiogVGhlIHJhZGl1cyBvZiB0aGUgbmF0aXZlIHNsaWRlcidzIGtub2IuIEFGQUlLIHRoZXJlIGlzIG5vIHdheSB0byBhdm9pZCBoYXJkY29kaW5nIHRoaXMuICovXG4gIF9rbm9iUmFkaXVzOiBudW1iZXIgPSA4O1xuXG4gIF9pbnB1dFBhZGRpbmc6IG51bWJlcjtcbiAgX2lucHV0T2Zmc2V0OiBudW1iZXI7XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCBlSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKTtcbiAgICBjb25zdCBzSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpO1xuICAgIHRoaXMuX2lzUmFuZ2UgPSAhIWVJbnB1dCAmJiAhIXNJbnB1dDtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgX3ZhbGlkYXRlSW5wdXRzKFxuICAgICAgICB0aGlzLl9pc1JhbmdlLFxuICAgICAgICB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSEsXG4gICAgICAgIHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCksXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHRodW1iID0gdGhpcy5fZ2V0VGh1bWIoX01hdFRodW1iLkVORCk7XG4gICAgdGhpcy5fcmlwcGxlUmFkaXVzID0gdGh1bWIuX3JpcHBsZS5yYWRpdXM7XG4gICAgdGhpcy5faW5wdXRQYWRkaW5nID0gdGhpcy5fcmlwcGxlUmFkaXVzIC0gdGhpcy5fa25vYlJhZGl1cztcbiAgICB0aGlzLl9pbnB1dE9mZnNldCA9IHRoaXMuX2tub2JSYWRpdXM7XG5cbiAgICB0aGlzLl9pc1JhbmdlXG4gICAgICA/IHRoaXMuX2luaXRVSVJhbmdlKGVJbnB1dCBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYiwgc0lucHV0IGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iKVxuICAgICAgOiB0aGlzLl9pbml0VUlOb25SYW5nZShlSW5wdXQhKTtcblxuICAgIHRoaXMuX3VwZGF0ZVRyYWNrVUkoZUlucHV0ISk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVHJhY2tVSSgpO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZUhvc3RSZXNpemUoKTtcbiAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdFVJTm9uUmFuZ2UoZUlucHV0OiBfTWF0U2xpZGVyVGh1bWIpOiB2b2lkIHtcbiAgICBlSW5wdXQuaW5pdFByb3BzKCk7XG4gICAgZUlucHV0LmluaXRVSSgpO1xuXG4gICAgdGhpcy5fdXBkYXRlVmFsdWVJbmRpY2F0b3JVSShlSW5wdXQpO1xuXG4gICAgdGhpcy5faGFzVmlld0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBlSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0VUlSYW5nZShlSW5wdXQ6IF9NYXRTbGlkZXJSYW5nZVRodW1iLCBzSW5wdXQ6IF9NYXRTbGlkZXJSYW5nZVRodW1iKTogdm9pZCB7XG4gICAgZUlucHV0LmluaXRQcm9wcygpO1xuICAgIGVJbnB1dC5pbml0VUkoKTtcblxuICAgIHNJbnB1dC5pbml0UHJvcHMoKTtcbiAgICBzSW5wdXQuaW5pdFVJKCk7XG5cbiAgICBlSW5wdXQuX3VwZGF0ZU1pbk1heCgpO1xuICAgIHNJbnB1dC5fdXBkYXRlTWluTWF4KCk7XG5cbiAgICBlSW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuICAgIHNJbnB1dC5fdXBkYXRlU3RhdGljU3R5bGVzKCk7XG5cbiAgICB0aGlzLl91cGRhdGVWYWx1ZUluZGljYXRvclVJcygpO1xuXG4gICAgdGhpcy5faGFzVmlld0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIGVJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICBzSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZXNpemVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVwZGF0aW5nIHRoZSBzbGlkZXIgdWkgYWZ0ZXIgYSBkaXIgY2hhbmdlLiAqL1xuICBwcml2YXRlIF9vbkRpckNoYW5nZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9pc1J0bCA9IHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCc7XG4gICAgdGhpcy5faXNSYW5nZSA/IHRoaXMuX29uRGlyQ2hhbmdlUmFuZ2UoKSA6IHRoaXMuX29uRGlyQ2hhbmdlTm9uUmFuZ2UoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1VJKCk7XG4gIH1cblxuICBwcml2YXRlIF9vbkRpckNoYW5nZVJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICBlbmRJbnB1dC5fc2V0SXNMZWZ0VGh1bWIoKTtcbiAgICBzdGFydElucHV0Ll9zZXRJc0xlZnRUaHVtYigpO1xuXG4gICAgZW5kSW5wdXQudHJhbnNsYXRlWCA9IGVuZElucHV0Ll9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTtcbiAgICBzdGFydElucHV0LnRyYW5zbGF0ZVggPSBzdGFydElucHV0Ll9jYWxjVHJhbnNsYXRlWEJ5VmFsdWUoKTtcblxuICAgIGVuZElucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcbiAgICBzdGFydElucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcblxuICAgIGVuZElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuXG4gICAgZW5kSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX29uRGlyQ2hhbmdlTm9uUmFuZ2UoKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSE7XG4gICAgaW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gIH1cblxuICAvKiogU3RhcnRzIG9ic2VydmluZyBhbmQgdXBkYXRpbmcgdGhlIHNsaWRlciBpZiB0aGUgaG9zdCBjaGFuZ2VzIGl0cyBzaXplLiAqL1xuICBwcml2YXRlIF9vYnNlcnZlSG9zdFJlc2l6ZSgpIHtcbiAgICBpZiAodHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAndW5kZWZpbmVkJyB8fCAhUmVzaXplT2JzZXJ2ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faXNBY3RpdmUoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcmVzaXplVGltZXIpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVzaXplVGltZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29uUmVzaXplKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyLm9ic2VydmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIGFueSBvZiB0aGUgdGh1bWJzIGFyZSBjdXJyZW50bHkgYWN0aXZlLiAqL1xuICBwcml2YXRlIF9pc0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VGh1bWIoX01hdFRodW1iLlNUQVJUKS5faXNBY3RpdmUgfHwgdGhpcy5fZ2V0VGh1bWIoX01hdFRodW1iLkVORCkuX2lzQWN0aXZlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VmFsdWUodGh1bWJQb3NpdGlvbjogX01hdFRodW1iID0gX01hdFRodW1iLkVORCk6IG51bWJlciB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLl9nZXRJbnB1dCh0aHVtYlBvc2l0aW9uKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5taW47XG4gICAgfVxuICAgIHJldHVybiBpbnB1dC52YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3NraXBVcGRhdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKFxuICAgICAgdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKT8uX3NraXBVSVVwZGF0ZSB8fCB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKT8uX3NraXBVSVVwZGF0ZVxuICAgICk7XG4gIH1cblxuICAvKiogU3RvcmVzIHRoZSBzbGlkZXIgZGltZW5zaW9ucy4gKi9cbiAgX3VwZGF0ZURpbWVuc2lvbnMoKTogdm9pZCB7XG4gICAgdGhpcy5fY2FjaGVkV2lkdGggPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgdGhpcy5fY2FjaGVkTGVmdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHN0eWxlcyBmb3IgdGhlIGFjdGl2ZSBwb3J0aW9uIG9mIHRoZSB0cmFjay4gKi9cbiAgX3NldFRyYWNrQWN0aXZlU3R5bGVzKHN0eWxlczoge1xuICAgIGxlZnQ6IHN0cmluZztcbiAgICByaWdodDogc3RyaW5nO1xuICAgIHRyYW5zZm9ybTogc3RyaW5nO1xuICAgIHRyYW5zZm9ybU9yaWdpbjogc3RyaW5nO1xuICB9KTogdm9pZCB7XG4gICAgY29uc3QgdHJhY2tTdHlsZSA9IHRoaXMuX3RyYWNrQWN0aXZlLm5hdGl2ZUVsZW1lbnQuc3R5bGU7XG5cbiAgICB0cmFja1N0eWxlLmxlZnQgPSBzdHlsZXMubGVmdDtcbiAgICB0cmFja1N0eWxlLnJpZ2h0ID0gc3R5bGVzLnJpZ2h0O1xuICAgIHRyYWNrU3R5bGUudHJhbnNmb3JtT3JpZ2luID0gc3R5bGVzLnRyYW5zZm9ybU9yaWdpbjtcbiAgICB0cmFja1N0eWxlLnRyYW5zZm9ybSA9IHN0eWxlcy50cmFuc2Zvcm07XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgdHJhbnNsYXRlWCBwb3NpdGlvbmluZyBmb3IgYSB0aWNrIG1hcmsgYmFzZWQgb24gaXQncyBpbmRleC4gKi9cbiAgX2NhbGNUaWNrTWFya1RyYW5zZm9ybShpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IFNlZSBpZiB3ZSBjYW4gYXZvaWQgZG9pbmcgdGhpcyBhbmQganVzdCB1c2luZyBmbGV4IHRvIHBvc2l0aW9uIHRoZXNlLlxuICAgIGNvbnN0IHRyYW5zbGF0ZVggPSBpbmRleCAqICh0aGlzLl90aWNrTWFya1RyYWNrV2lkdGggLyAodGhpcy5fdGlja01hcmtzLmxlbmd0aCAtIDEpKTtcbiAgICByZXR1cm4gYHRyYW5zbGF0ZVgoJHt0cmFuc2xhdGVYfXB4YDtcbiAgfVxuXG4gIC8vIEhhbmRsZXJzIGZvciB1cGRhdGluZyB0aGUgc2xpZGVyIHVpLlxuXG4gIF9vblRyYW5zbGF0ZVhDaGFuZ2Uoc291cmNlOiBfTWF0U2xpZGVyVGh1bWIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVRodW1iVUkoc291cmNlKTtcbiAgICB0aGlzLl91cGRhdGVUcmFja1VJKHNvdXJjZSk7XG4gICAgdGhpcy5fdXBkYXRlT3ZlcmxhcHBpbmdUaHVtYlVJKHNvdXJjZSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYik7XG4gIH1cblxuICBfb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KFxuICAgIGlucHV0MTogX01hdFNsaWRlclJhbmdlVGh1bWIsXG4gICAgaW5wdXQyOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpbnB1dDEuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgaW5wdXQyLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgX29uVmFsdWVDaGFuZ2Uoc291cmNlOiBfTWF0U2xpZGVyVGh1bWIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUkoc291cmNlKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1VJKCk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIF9vbk1pbk1heE9yU3RlcENoYW5nZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTtcbiAgICB0aGlzLl9jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfb25SZXNpemUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNWaWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgaWYgKHRoaXMuX2lzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgICAgY29uc3Qgc0lucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgICAgZUlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgc0lucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuXG4gICAgICBlSW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuICAgICAgc0lucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcblxuICAgICAgZUlucHV0Ll91cGRhdGVNaW5NYXgoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlTWluTWF4KCk7XG5cbiAgICAgIGVJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgICAgc0lucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgICAgaWYgKGVJbnB1dCkge1xuICAgICAgICBlSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVHJhY2tVSSgpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIHNsaWRlciB0aHVtYnMgb3ZlcmxhcC4gKi9cbiAgcHJpdmF0ZSBfdGh1bWJzT3ZlcmxhcDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNsaWRlciBrbm9icyBhcmUgb3ZlcmxhcHBpbmcgb25lIGFub3RoZXIuICovXG4gIHByaXZhdGUgX2FyZVRodW1ic092ZXJsYXBwaW5nKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpO1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgaWYgKCFzdGFydElucHV0IHx8ICFlbmRJbnB1dCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZW5kSW5wdXQudHJhbnNsYXRlWCAtIHN0YXJ0SW5wdXQudHJhbnNsYXRlWCA8IDIwO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNsYXNzIG5hbWVzIG9mIG92ZXJsYXBwaW5nIHNsaWRlciB0aHVtYnMgc29cbiAgICogdGhhdCB0aGUgY3VycmVudCBhY3RpdmUgdGh1bWIgaXMgc3R5bGVkIHRvIGJlIG9uIFwidG9wXCIuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVPdmVybGFwcGluZ1RodW1iQ2xhc3NOYW1lcyhzb3VyY2U6IF9NYXRTbGlkZXJSYW5nZVRodW1iKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHNvdXJjZS5nZXRTaWJsaW5nKCkhO1xuICAgIGNvbnN0IHNvdXJjZVRodW1iID0gdGhpcy5fZ2V0VGh1bWIoc291cmNlLnRodW1iUG9zaXRpb24pO1xuICAgIGNvbnN0IHNpYmxpbmdUaHVtYiA9IHRoaXMuX2dldFRodW1iKHNpYmxpbmcudGh1bWJQb3NpdGlvbik7XG4gICAgc2libGluZ1RodW1iLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtc2xpZGVyX190aHVtYi0tdG9wJyk7XG4gICAgc291cmNlVGh1bWIuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1zbGlkZXJfX3RodW1iLS10b3AnLCB0aGlzLl90aHVtYnNPdmVybGFwKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBVSSBvZiBzbGlkZXIgdGh1bWJzIHdoZW4gdGhleSBiZWdpbiBvciBzdG9wIG92ZXJsYXBwaW5nLiAqL1xuICBwcml2YXRlIF91cGRhdGVPdmVybGFwcGluZ1RodW1iVUkoc291cmNlOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYik6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNSYW5nZSB8fCB0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RodW1ic092ZXJsYXAgIT09IHRoaXMuX2FyZVRodW1ic092ZXJsYXBwaW5nKCkpIHtcbiAgICAgIHRoaXMuX3RodW1ic092ZXJsYXAgPSAhdGhpcy5fdGh1bWJzT3ZlcmxhcDtcbiAgICAgIHRoaXMuX3VwZGF0ZU92ZXJsYXBwaW5nVGh1bWJDbGFzc05hbWVzKHNvdXJjZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gX01hdFRodW1iIHN0eWxlcyB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBUcmFuc2xhdGVYLCByZXNpemUsIG9yIGRpciBjaGFuZ2VcbiAgLy8gICAgLSBSZWFzb246IFRoZSB0aHVtYiBzdHlsZXMgbmVlZCB0byBiZSB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgbmV3IHRyYW5zbGF0ZVguXG4gIC8vIDIuIE1pbiwgbWF4LCBvciBzdGVwXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdmFsdWUgbWF5IGhhdmUgc2lsZW50bHkgY2hhbmdlZC5cblxuICAvKiogVXBkYXRlcyB0aGUgdHJhbnNsYXRlWCBvZiB0aGUgZ2l2ZW4gdGh1bWIuICovXG4gIF91cGRhdGVUaHVtYlVJKHNvdXJjZTogX01hdFNsaWRlclRodW1iKSB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aHVtYiA9IHRoaXMuX2dldFRodW1iKFxuICAgICAgc291cmNlLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5FTkQgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJULFxuICAgICkhO1xuICAgIHRodW1iLl9ob3N0RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3NvdXJjZS50cmFuc2xhdGVYfXB4KWA7XG4gIH1cblxuICAvLyBWYWx1ZSBpbmRpY2F0b3IgdGV4dCB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBWYWx1ZVxuICAvLyAgICAtIFJlYXNvbjogVGhlIHZhbHVlIGRpc3BsYXllZCBuZWVkcyB0byBiZSB1cGRhdGVkLlxuICAvLyAyLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbjogVGhlIHZhbHVlIG1heSBoYXZlIHNpbGVudGx5IGNoYW5nZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHZhbHVlIGluZGljYXRvciB0b29sdGlwIHVpIGZvciB0aGUgZ2l2ZW4gdGh1bWIuICovXG4gIF91cGRhdGVWYWx1ZUluZGljYXRvclVJKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVldGV4dCA9IHRoaXMuZGlzcGxheVdpdGgoc291cmNlLnZhbHVlKTtcblxuICAgIHRoaXMuX2hhc1ZpZXdJbml0aWFsaXplZFxuICAgICAgPyAoc291cmNlLl92YWx1ZXRleHQgPSB2YWx1ZXRleHQpXG4gICAgICA6IHNvdXJjZS5faG9zdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIHZhbHVldGV4dCk7XG5cbiAgICBpZiAodGhpcy5kaXNjcmV0ZSkge1xuICAgICAgc291cmNlLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVFxuICAgICAgICA/ICh0aGlzLnN0YXJ0VmFsdWVJbmRpY2F0b3JUZXh0ID0gdmFsdWV0ZXh0KVxuICAgICAgICA6ICh0aGlzLmVuZFZhbHVlSW5kaWNhdG9yVGV4dCA9IHZhbHVldGV4dCk7XG5cbiAgICAgIGNvbnN0IHZpc3VhbFRodW1iID0gdGhpcy5fZ2V0VGh1bWIoc291cmNlLnRodW1iUG9zaXRpb24pO1xuICAgICAgdmFsdWV0ZXh0Lmxlbmd0aCA8IDNcbiAgICAgICAgPyB2aXN1YWxUaHVtYi5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWRjLXNsaWRlcl9fdGh1bWItLXNob3J0LXZhbHVlJylcbiAgICAgICAgOiB2aXN1YWxUaHVtYi5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLXNob3J0LXZhbHVlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgYWxsIHZhbHVlIGluZGljYXRvciBVSXMgaW4gdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsdWVJbmRpY2F0b3JVSXMoKTogdm9pZCB7XG4gICAgY29uc3QgZUlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgY29uc3Qgc0lucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKTtcblxuICAgIGlmIChlSW5wdXQpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlSW5kaWNhdG9yVUkoZUlucHV0KTtcbiAgICB9XG4gICAgaWYgKHNJbnB1dCkge1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVJbmRpY2F0b3JVSShzSW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVwZGF0ZSBUaWNrIE1hcmsgVHJhY2sgV2lkdGhcbiAgLy9cbiAgLy8gMS4gTWluLCBtYXgsIG9yIHN0ZXBcbiAgLy8gICAgLSBSZWFzb246IFRoZSBtYXhpbXVtIHJlYWNoYWJsZSB2YWx1ZSBtYXkgaGF2ZSBjaGFuZ2VkLlxuICAvLyAgICAtIFNpZGUgbm90ZTogVGhlIG1heGltdW0gcmVhY2hhYmxlIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBtYXhpbXVtIHZhbHVlIHNldCBieSB0aGVcbiAgLy8gICAgICB1c2VyLiBGb3IgZXhhbXBsZSwgYSBzbGlkZXIgd2l0aCBbbWluOiA1LCBtYXg6IDEwMCwgc3RlcDogMTBdIHdvdWxkIGhhdmUgYSBtYXhpbXVtXG4gIC8vICAgICAgcmVhY2hhYmxlIHZhbHVlIG9mIDk1LlxuICAvLyAyLiBSZXNpemVcbiAgLy8gICAgLSBSZWFzb246IFRoZSBwb3NpdGlvbiBmb3IgdGhlIG1heGltdW0gcmVhY2hhYmxlIHZhbHVlIG5lZWRzIHRvIGJlIHJlY2FsY3VsYXRlZC5cblxuICAvKiogVXBkYXRlcyB0aGUgd2lkdGggb2YgdGhlIHRpY2sgbWFyayB0cmFjay4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja01hcmtUcmFja1VJKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zaG93VGlja01hcmtzIHx8IHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0ZXAgPSB0aGlzLl9zdGVwICYmIHRoaXMuX3N0ZXAgPiAwID8gdGhpcy5fc3RlcCA6IDE7XG4gICAgY29uc3QgbWF4VmFsdWUgPSBNYXRoLmZsb29yKHRoaXMubWF4IC8gc3RlcCkgKiBzdGVwO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAobWF4VmFsdWUgLSB0aGlzLm1pbikgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgdGhpcy5fdGlja01hcmtUcmFja1dpZHRoID0gdGhpcy5fY2FjaGVkV2lkdGggKiBwZXJjZW50YWdlIC0gNjtcbiAgfVxuXG4gIC8vIFRyYWNrIGFjdGl2ZSB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBUcmFuc2xhdGVYXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdHJhY2sgYWN0aXZlIHNob3VsZCBsaW5lIHVwIHdpdGggdGhlIG5ldyB0aHVtYiBwb3NpdGlvbi5cbiAgLy8gMi4gTWluIG9yIG1heFxuICAvLyAgICAtIFJlYXNvbiAjMTogVGhlICdhY3RpdmUnIHBlcmNlbnRhZ2UgbmVlZHMgdG8gYmUgcmVjYWxjdWxhdGVkLlxuICAvLyAgICAtIFJlYXNvbiAjMjogVGhlIHZhbHVlIG1heSBoYXZlIHNpbGVudGx5IGNoYW5nZWQuXG4gIC8vIDMuIFN0ZXBcbiAgLy8gICAgLSBSZWFzb246IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkIGNhdXNpbmcgdGhlIHRodW1iKHMpIHRvIHNoaWZ0LlxuICAvLyA0LiBEaXIgY2hhbmdlXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdHJhY2sgYWN0aXZlIHdpbGwgbmVlZCB0byBiZSB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgbmV3IHRodW1iIHBvc2l0aW9uKHMpLlxuICAvLyA1LiBSZXNpemVcbiAgLy8gICAgLSBSZWFzb246IFRoZSB0b3RhbCB3aWR0aCB0aGUgJ2FjdGl2ZScgdHJhY2tzIHRyYW5zbGF0ZVggaXMgYmFzZWQgb24gaGFzIGNoYW5nZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHNjYWxlIG9uIHRoZSBhY3RpdmUgcG9ydGlvbiBvZiB0aGUgdHJhY2suICovXG4gIF91cGRhdGVUcmFja1VJKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzUmFuZ2VcbiAgICAgID8gdGhpcy5fdXBkYXRlVHJhY2tVSVJhbmdlKHNvdXJjZSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYilcbiAgICAgIDogdGhpcy5fdXBkYXRlVHJhY2tVSU5vblJhbmdlKHNvdXJjZSBhcyBfTWF0U2xpZGVyVGh1bWIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVHJhY2tVSVJhbmdlKHNvdXJjZTogX01hdFNsaWRlclJhbmdlVGh1bWIpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gc291cmNlLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcgfHwgIXRoaXMuX2NhY2hlZFdpZHRoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlUGVyY2VudGFnZSA9IE1hdGguYWJzKHNpYmxpbmcudHJhbnNsYXRlWCAtIHNvdXJjZS50cmFuc2xhdGVYKSAvIHRoaXMuX2NhY2hlZFdpZHRoO1xuXG4gICAgaWYgKHNvdXJjZS5faXNMZWZ0VGh1bWIgJiYgdGhpcy5fY2FjaGVkV2lkdGgpIHtcbiAgICAgIHRoaXMuX3NldFRyYWNrQWN0aXZlU3R5bGVzKHtcbiAgICAgICAgbGVmdDogJ2F1dG8nLFxuICAgICAgICByaWdodDogYCR7dGhpcy5fY2FjaGVkV2lkdGggLSBzaWJsaW5nLnRyYW5zbGF0ZVh9cHhgLFxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdyaWdodCcsXG4gICAgICAgIHRyYW5zZm9ybTogYHNjYWxlWCgke2FjdGl2ZVBlcmNlbnRhZ2V9KWAsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0VHJhY2tBY3RpdmVTdHlsZXMoe1xuICAgICAgICBsZWZ0OiBgJHtzaWJsaW5nLnRyYW5zbGF0ZVh9cHhgLFxuICAgICAgICByaWdodDogJ2F1dG8nLFxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0JyxcbiAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGVYKCR7YWN0aXZlUGVyY2VudGFnZX0pYCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVRyYWNrVUlOb25SYW5nZShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYik6IHZvaWQge1xuICAgIHRoaXMuX2lzUnRsXG4gICAgICA/IHRoaXMuX3NldFRyYWNrQWN0aXZlU3R5bGVzKHtcbiAgICAgICAgICBsZWZ0OiAnYXV0bycsXG4gICAgICAgICAgcmlnaHQ6ICcwcHgnLFxuICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ3JpZ2h0JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHsxIC0gc291cmNlLmZpbGxQZXJjZW50YWdlfSlgLFxuICAgICAgICB9KVxuICAgICAgOiB0aGlzLl9zZXRUcmFja0FjdGl2ZVN0eWxlcyh7XG4gICAgICAgICAgbGVmdDogJzBweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHtzb3VyY2UuZmlsbFBlcmNlbnRhZ2V9KWAsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLy8gVGljayBtYXJrIHVwZGF0ZSBjb25kaXRpb25zXG4gIC8vXG4gIC8vIDEuIFZhbHVlXG4gIC8vICAgIC0gUmVhc29uOiBhIHRpY2sgbWFyayB3aGljaCB3YXMgb25jZSBhY3RpdmUgbWlnaHQgbm93IGJlIGluYWN0aXZlIG9yIHZpY2UgdmVyc2EuXG4gIC8vIDIuIE1pbiwgbWF4LCBvciBzdGVwXG4gIC8vICAgIC0gUmVhc29uICMxOiB0aGUgbnVtYmVyIG9mIHRpY2sgbWFya3MgbWF5IGhhdmUgY2hhbmdlZC5cbiAgLy8gICAgLSBSZWFzb24gIzI6IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSBkb3RzIGFsb25nIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIF91cGRhdGVUaWNrTWFya1VJKCk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNob3dUaWNrTWFya3MgfHxcbiAgICAgIHRoaXMuc3RlcCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLm1pbiA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLm1heCA9PT0gdW5kZWZpbmVkXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnN0ZXAgPiAwID8gdGhpcy5zdGVwIDogMTtcbiAgICB0aGlzLl9pc1JhbmdlID8gdGhpcy5fdXBkYXRlVGlja01hcmtVSVJhbmdlKHN0ZXApIDogdGhpcy5fdXBkYXRlVGlja01hcmtVSU5vblJhbmdlKHN0ZXApO1xuXG4gICAgaWYgKHRoaXMuX2lzUnRsKSB7XG4gICAgICB0aGlzLl90aWNrTWFya3MucmV2ZXJzZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVRpY2tNYXJrVUlOb25SYW5nZShzdGVwOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2dldFZhbHVlKCk7XG4gICAgbGV0IG51bUFjdGl2ZSA9IE1hdGgubWF4KE1hdGgucm91bmQoKHZhbHVlIC0gdGhpcy5taW4pIC8gc3RlcCksIDApO1xuICAgIGxldCBudW1JbmFjdGl2ZSA9IE1hdGgubWF4KE1hdGgucm91bmQoKHRoaXMubWF4IC0gdmFsdWUpIC8gc3RlcCksIDApO1xuICAgIHRoaXMuX2lzUnRsID8gbnVtQWN0aXZlKysgOiBudW1JbmFjdGl2ZSsrO1xuXG4gICAgdGhpcy5fdGlja01hcmtzID0gQXJyYXkobnVtQWN0aXZlKVxuICAgICAgLmZpbGwoX01hdFRpY2tNYXJrLkFDVElWRSlcbiAgICAgIC5jb25jYXQoQXJyYXkobnVtSW5hY3RpdmUpLmZpbGwoX01hdFRpY2tNYXJrLklOQUNUSVZFKSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUaWNrTWFya1VJUmFuZ2Uoc3RlcDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgZW5kVmFsdWUgPSB0aGlzLl9nZXRWYWx1ZSgpO1xuICAgIGNvbnN0IHN0YXJ0VmFsdWUgPSB0aGlzLl9nZXRWYWx1ZShfTWF0VGh1bWIuU1RBUlQpO1xuXG4gICAgY29uc3QgbnVtSW5hY3RpdmVCZWZvcmVTdGFydFRodW1iID0gTWF0aC5tYXgoTWF0aC5mbG9vcigoc3RhcnRWYWx1ZSAtIHRoaXMubWluKSAvIHN0ZXApLCAwKTtcbiAgICBjb25zdCBudW1BY3RpdmUgPSBNYXRoLm1heChNYXRoLmZsb29yKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpIC8gc3RlcCkgKyAxLCAwKTtcbiAgICBjb25zdCBudW1JbmFjdGl2ZUFmdGVyRW5kVGh1bWIgPSBNYXRoLm1heChNYXRoLmZsb29yKCh0aGlzLm1heCAtIGVuZFZhbHVlKSAvIHN0ZXApLCAwKTtcbiAgICB0aGlzLl90aWNrTWFya3MgPSBBcnJheShudW1JbmFjdGl2ZUJlZm9yZVN0YXJ0VGh1bWIpXG4gICAgICAuZmlsbChfTWF0VGlja01hcmsuSU5BQ1RJVkUpXG4gICAgICAuY29uY2F0KFxuICAgICAgICBBcnJheShudW1BY3RpdmUpLmZpbGwoX01hdFRpY2tNYXJrLkFDVElWRSksXG4gICAgICAgIEFycmF5KG51bUluYWN0aXZlQWZ0ZXJFbmRUaHVtYikuZmlsbChfTWF0VGlja01hcmsuSU5BQ1RJVkUpLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzbGlkZXIgdGh1bWIgaW5wdXQgb2YgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uLiAqL1xuICBfZ2V0SW5wdXQodGh1bWJQb3NpdGlvbjogX01hdFRodW1iKTogX01hdFNsaWRlclRodW1iIHwgX01hdFNsaWRlclJhbmdlVGh1bWIgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuRU5EICYmIHRoaXMuX2lucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5wdXQ7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pbnB1dHM/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVCA/IHRoaXMuX2lucHV0cy5maXJzdCA6IHRoaXMuX2lucHV0cy5sYXN0O1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIHRodW1iIEhUTUwgaW5wdXQgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gdGh1bWIgcG9zaXRpb24uICovXG4gIF9nZXRUaHVtYih0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWIpOiBfTWF0U2xpZGVyVmlzdWFsVGh1bWIge1xuICAgIHJldHVybiB0aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuRU5EID8gdGhpcy5fdGh1bWJzPy5sYXN0ISA6IHRoaXMuX3RodW1icz8uZmlyc3QhO1xuICB9XG5cbiAgX3NldFRyYW5zaXRpb24od2l0aEFuaW1hdGlvbjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX2hhc0FuaW1hdGlvbiA9ICF0aGlzLl9wbGF0Zm9ybS5JT1MgJiYgd2l0aEFuaW1hdGlvbiAmJiAhdGhpcy5fbm9vcEFuaW1hdGlvbnM7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXG4gICAgICAnbWF0LW1kYy1zbGlkZXItd2l0aC1hbmltYXRpb24nLFxuICAgICAgdGhpcy5faGFzQW5pbWF0aW9uLFxuICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gcG9pbnRlciBldmVudCBvY2N1cnJlZCB3aXRoaW4gdGhlIGJvdW5kcyBvZiB0aGUgc2xpZGVyIHBvaW50ZXIncyBET00gUmVjdC4gKi9cbiAgX2lzQ3Vyc29yT25TbGlkZXJUaHVtYihldmVudDogUG9pbnRlckV2ZW50LCByZWN0OiBET01SZWN0KSB7XG4gICAgY29uc3QgcmFkaXVzID0gcmVjdC53aWR0aCAvIDI7XG4gICAgY29uc3QgY2VudGVyWCA9IHJlY3QueCArIHJhZGl1cztcbiAgICBjb25zdCBjZW50ZXJZID0gcmVjdC55ICsgcmFkaXVzO1xuICAgIGNvbnN0IGR4ID0gZXZlbnQuY2xpZW50WCAtIGNlbnRlclg7XG4gICAgY29uc3QgZHkgPSBldmVudC5jbGllbnRZIC0gY2VudGVyWTtcbiAgICByZXR1cm4gTWF0aC5wb3coZHgsIDIpICsgTWF0aC5wb3coZHksIDIpIDwgTWF0aC5wb3cocmFkaXVzLCAyKTtcbiAgfVxufVxuXG4vKiogRW5zdXJlcyB0aGF0IHRoZXJlIGlzIG5vdCBhbiBpbnZhbGlkIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbGlkZXIgdGh1bWIgaW5wdXRzLiAqL1xuZnVuY3Rpb24gX3ZhbGlkYXRlSW5wdXRzKFxuICBpc1JhbmdlOiBib29sZWFuLFxuICBlbmRJbnB1dEVsZW1lbnQ6IF9NYXRTbGlkZXJUaHVtYiB8IF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICBzdGFydElucHV0RWxlbWVudD86IF9NYXRTbGlkZXJUaHVtYixcbik6IHZvaWQge1xuICBjb25zdCBzdGFydFZhbGlkID1cbiAgICAhaXNSYW5nZSB8fCBzdGFydElucHV0RWxlbWVudD8uX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbWF0U2xpZGVyU3RhcnRUaHVtYicpO1xuICBjb25zdCBlbmRWYWxpZCA9IGVuZElucHV0RWxlbWVudC5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKFxuICAgIGlzUmFuZ2UgPyAnbWF0U2xpZGVyRW5kVGh1bWInIDogJ21hdFNsaWRlclRodW1iJyxcbiAgKTtcblxuICBpZiAoIXN0YXJ0VmFsaWQgfHwgIWVuZFZhbGlkKSB7XG4gICAgX3Rocm93SW52YWxpZElucHV0Q29uZmlndXJhdGlvbkVycm9yKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Rocm93SW52YWxpZElucHV0Q29uZmlndXJhdGlvbkVycm9yKCk6IHZvaWQge1xuICB0aHJvdyBFcnJvcihgSW52YWxpZCBzbGlkZXIgdGh1bWIgaW5wdXQgY29uZmlndXJhdGlvbiFcblxuICAgVmFsaWQgY29uZmlndXJhdGlvbnMgYXJlIGFzIGZvbGxvd3M6XG5cbiAgICAgPG1hdC1zbGlkZXI+XG4gICAgICAgPGlucHV0IG1hdFNsaWRlclRodW1iPlxuICAgICA8L21hdC1zbGlkZXI+XG5cbiAgICAgb3JcblxuICAgICA8bWF0LXNsaWRlcj5cbiAgICAgICA8aW5wdXQgbWF0U2xpZGVyU3RhcnRUaHVtYj5cbiAgICAgICA8aW5wdXQgbWF0U2xpZGVyRW5kVGh1bWI+XG4gICAgIDwvbWF0LXNsaWRlcj5cbiAgIGApO1xufVxuIiwiPCEtLSBJbnB1dHMgLS0+XG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG5cbjwhLS0gVHJhY2sgLS0+XG48ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2tcIj5cbiAgPGRpdiBjbGFzcz1cIm1kYy1zbGlkZXJfX3RyYWNrLS1pbmFjdGl2ZVwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2stLWFjdGl2ZVwiPlxuICAgIDxkaXYgI3RyYWNrQWN0aXZlIGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2stLWFjdGl2ZV9maWxsXCI+PC9kaXY+XG4gIDwvZGl2PlxuICBAaWYgKHNob3dUaWNrTWFya3MpIHtcbiAgICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdGljay1tYXJrc1wiICN0aWNrTWFya0NvbnRhaW5lcj5cbiAgICAgIEBpZiAoX2NhY2hlZFdpZHRoKSB7XG4gICAgICAgIEBmb3IgKHRpY2tNYXJrIG9mIF90aWNrTWFya3M7IHRyYWNrIHRpY2tNYXJrOyBsZXQgaSA9ICRpbmRleCkge1xuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIFtjbGFzc109XCJ0aWNrTWFyayA9PT0gMCA/ICdtZGMtc2xpZGVyX190aWNrLW1hcmstLWFjdGl2ZScgOiAnbWRjLXNsaWRlcl9fdGljay1tYXJrLS1pbmFjdGl2ZSdcIlxuICAgICAgICAgICAgW3N0eWxlLnRyYW5zZm9ybV09XCJfY2FsY1RpY2tNYXJrVHJhbnNmb3JtKGkpXCI+PC9kaXY+XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgfVxuPC9kaXY+XG5cbjwhLS0gVGh1bWJzIC0tPlxuQGlmIChfaXNSYW5nZSkge1xuICA8bWF0LXNsaWRlci12aXN1YWwtdGh1bWJcbiAgICBbZGlzY3JldGVdPVwiZGlzY3JldGVcIlxuICAgIFt0aHVtYlBvc2l0aW9uXT1cIjFcIlxuICAgIFt2YWx1ZUluZGljYXRvclRleHRdPVwic3RhcnRWYWx1ZUluZGljYXRvclRleHRcIj5cbiAgPC9tYXQtc2xpZGVyLXZpc3VhbC10aHVtYj5cbn1cblxuPG1hdC1zbGlkZXItdmlzdWFsLXRodW1iXG4gIFtkaXNjcmV0ZV09XCJkaXNjcmV0ZVwiXG4gIFt0aHVtYlBvc2l0aW9uXT1cIjJcIlxuICBbdmFsdWVJbmRpY2F0b3JUZXh0XT1cImVuZFZhbHVlSW5kaWNhdG9yVGV4dFwiPlxuPC9tYXQtc2xpZGVyLXZpc3VhbC10aHVtYj5cbiJdfQ==