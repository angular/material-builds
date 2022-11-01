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
export class MatSlider extends _MatSliderMixinBase {
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
        this.startValueIndicatorText = '';
        this.endValueIndicatorText = '';
        this._isRange = false;
        /** Whether the slider is rtl. */
        this._isRtl = false;
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
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._updateDimensions();
        }
        const eInput = this._getInput(2 /* _MatThumb.END */);
        const sInput = this._getInput(1 /* _MatThumb.START */);
        this._isRange = !!eInput && !!sInput;
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            _validateInputs(this._isRange, this._getInput(2 /* _MatThumb.END */), this._getInput(1 /* _MatThumb.START */));
        }
        const thumb = this._getThumb(2 /* _MatThumb.END */);
        this._rippleRadius = thumb._ripple.radius;
        this._inputPadding = this._rippleRadius - this._knobRadius;
        this._inputOffset = this._knobRadius;
        if (eInput) {
            eInput.initProps();
            eInput.initUI();
        }
        if (sInput) {
            sInput.initProps();
            sInput.initUI();
        }
        if (this._isRange) {
            eInput._updateMinMax();
            sInput._updateMinMax();
        }
        this._updateTrackUI(eInput);
        this._updateTickMarkUI();
        this._updateTickMarkTrackUI();
        this._observeHostResize();
        this._cdr.detectChanges();
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
        const rect = this._elementRef.nativeElement.getBoundingClientRect();
        this._cachedWidth = rect.width;
        this._cachedLeft = rect.left;
    }
    /** Sets the styles for the active portion of the track. */
    _setTrackActiveStyles(styles) {
        const trackStyle = this._trackActive.nativeElement.style;
        trackStyle.left = styles.left;
        trackStyle.right = styles.right;
        trackStyle.transform = styles.transform;
        trackStyle.transformOrigin = styles.transformOrigin;
    }
    /** Returns the translateX positioning for a tick mark based on it's index. */
    _calcTickMarkTransform(index) {
        // TODO(wagnermaciel): See if we can avoid doing this and just using flex to position these.
        const translateX = index * (this._tickMarkTrackWidth / (this._tickMarks.length - 1));
        return `translateX(${translateX}px`;
    }
    // Handlers for updating the slider ui.
    _onTranslateXChange(source) {
        this._updateThumbUI(source);
        this._updateTrackUI(source);
        this._updateOverlappingThumbUI(source);
    }
    _onTranslateXChangeBySideEffect(input1, input2) {
        input1._updateThumbUIByValue();
        input2._updateThumbUIByValue();
    }
    _onValueChange(source) {
        this._updateValueIndicatorUI(source);
        this._updateTickMarkUI();
        this._cdr.detectChanges();
    }
    _onMinMaxOrStepChange() {
        this._updateTickMarkUI();
        this._updateTickMarkTrackUI();
        this._cdr.markForCheck();
    }
    _onResize() {
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
        source._valuetext = valuetext;
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
        if (this._skipUpdate()) {
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
        if (this.step === undefined || this.min === undefined || this.max === undefined) {
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
}
MatSlider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0-rc.1", ngImport: i0, type: MatSlider, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.Platform }, { token: i0.ElementRef }, { token: i2.Directionality, optional: true }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatSlider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0-rc.1", type: MatSlider, selector: "mat-slider", inputs: { color: "color", disableRipple: "disableRipple", disabled: "disabled", discrete: "discrete", showTickMarks: "showTickMarks", min: "min", max: "max", step: "step", displayWith: "displayWith" }, host: { properties: { "class.mdc-slider--range": "_isRange", "class.mdc-slider--disabled": "disabled", "class.mdc-slider--discrete": "discrete", "class.mdc-slider--tick-marks": "showTickMarks", "class._mat-animation-noopable": "_noopAnimations" }, classAttribute: "mat-mdc-slider mdc-slider" }, providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], queries: [{ propertyName: "_input", first: true, predicate: MAT_SLIDER_THUMB, descendants: true }, { propertyName: "_inputs", predicate: MAT_SLIDER_RANGE_THUMB }], viewQueries: [{ propertyName: "_trackActive", first: true, predicate: ["trackActive"], descendants: true }, { propertyName: "_thumbs", predicate: MAT_SLIDER_VISUAL_THUMB, descendants: true }], exportAs: ["matSlider"], usesInheritance: true, ngImport: i0, template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <ng-container *ngIf=\"_cachedWidth\">\n        <div\n          *ngFor=\"let tickMark of _tickMarks; let i = index\"\n          [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n          [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngIf=\"_isRange\"\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"1\"\n  [valueIndicatorText]=\"startValueIndicatorText\">\n</mat-slider-visual-thumb>\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden;top:-1px}.mdc-slider .mdc-slider__track--active_fill{border-top:6px solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:0;margin:0;height:100%;opacity:0;pointer-events:none;position:absolute;top:0;width:100%}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000));border-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color, var(--mdc-theme-primary, #6200ee));opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color, var(--mdc-theme-on-surface, #000));opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color, var(--mdc-theme-primary, #6200ee));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color, var(--mdc-theme-on-surface, #000));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color, #666666);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color, #666666)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height, 6px)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size, 2px);width:var(--mdc-slider-with-tick-marks-container-size, 2px)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking, 0.0071428571em);font-size:var(--mdc-slider-label-label-text-font-size, 0.875rem);font-family:var(--mdc-slider-label-label-text-font, Roboto, sans-serif);font-weight:var(--mdc-slider-label-label-text-weight, 500);line-height:var(--mdc-slider-label-label-text-line-height, 1.375rem)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape, 50%);width:var(--mdc-slider-handle-width, 20px);height:var(--mdc-slider-handle-height, 20px);border-style:solid;border-width:calc(var(--mdc-slider-handle-height, 20px) / 2) calc(var(--mdc-slider-handle-width, 20px) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape, 50%)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color, #fff);border-width:var(--mdc-slider-with-overlap-handle-outline-width, 1px)}.mat-mdc-slider .mdc-slider__input{pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-mdc-slider-value-indicator-opacity, 1)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.MatSliderVisualThumb, selector: "mat-slider-visual-thumb", inputs: ["discrete", "thumbPosition", "valueIndicatorText"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0-rc.1", ngImport: i0, type: MatSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slider', host: {
                        'class': 'mat-mdc-slider mdc-slider',
                        '[class.mdc-slider--range]': '_isRange',
                        '[class.mdc-slider--disabled]': 'disabled',
                        '[class.mdc-slider--discrete]': 'discrete',
                        '[class.mdc-slider--tick-marks]': 'showTickMarks',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                    }, exportAs: 'matSlider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, inputs: ['color', 'disableRipple'], providers: [{ provide: MAT_SLIDER, useExisting: MatSlider }], template: "<!-- Inputs -->\n<ng-content></ng-content>\n\n<!-- Track -->\n<div class=\"mdc-slider__track\">\n  <div class=\"mdc-slider__track--inactive\"></div>\n  <div class=\"mdc-slider__track--active\">\n    <div #trackActive class=\"mdc-slider__track--active_fill\"></div>\n  </div>\n  <div *ngIf=\"showTickMarks\" class=\"mdc-slider__tick-marks\" #tickMarkContainer>\n    <ng-container *ngIf=\"_cachedWidth\">\n        <div\n          *ngFor=\"let tickMark of _tickMarks; let i = index\"\n          [class]=\"tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'\"\n          [style.transform]=\"_calcTickMarkTransform(i)\"></div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Thumbs -->\n<mat-slider-visual-thumb\n  *ngIf=\"_isRange\"\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"1\"\n  [valueIndicatorText]=\"startValueIndicatorText\">\n</mat-slider-visual-thumb>\n\n<mat-slider-visual-thumb\n  [discrete]=\"discrete\"\n  [thumbPosition]=\"2\"\n  [valueIndicatorText]=\"endValueIndicatorText\">\n</mat-slider-visual-thumb>\n", styles: [".mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden;top:-1px}.mdc-slider .mdc-slider__track--active_fill{border-top:6px solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:\"\";height:0;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:0;margin:0;height:100%;opacity:0;pointer-events:none;position:absolute;top:0;width:100%}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000));border-color:var(--mdc-slider-disabled-handle-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color, var(--mdc-theme-on-surface, #000))}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color, var(--mdc-theme-primary, #6200ee));opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color, var(--mdc-theme-on-surface, #000));opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color, var(--mdc-theme-on-primary, #fff));opacity:var(--mdc-slider-with-tick-marks-active-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color, var(--mdc-theme-primary, #6200ee));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color, var(--mdc-theme-on-surface, #000));opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity, 0.6)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color, #666666);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color, #666666)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height, 6px)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height, 4px)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size, 2px);width:var(--mdc-slider-with-tick-marks-container-size, 2px)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking, 0.0071428571em);font-size:var(--mdc-slider-label-label-text-font-size, 0.875rem);font-family:var(--mdc-slider-label-label-text-font, Roboto, sans-serif);font-weight:var(--mdc-slider-label-label-text-weight, 500);line-height:var(--mdc-slider-label-label-text-line-height, 1.375rem)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape, 9999px)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape, 50%);width:var(--mdc-slider-handle-width, 20px);height:var(--mdc-slider-handle-height, 20px);border-style:solid;border-width:calc(var(--mdc-slider-handle-height, 20px) / 2) calc(var(--mdc-slider-handle-width, 20px) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape, 50%)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-hover-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee));border-color:var(--mdc-slider-focus-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color, #fff);border-width:var(--mdc-slider-with-overlap-handle-outline-width, 1px)}.mat-mdc-slider .mdc-slider__input{pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator{opacity:var(--mat-mdc-slider-value-indicator-opacity, 1)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-mdc-slider-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-mdc-slider-hover-ripple-color, transparent)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-mdc-slider-focus-ripple-color, transparent)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:\"\"}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9zbGlkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3NsaWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixHQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBRUwseUJBQXlCLEVBQ3pCLFVBQVUsRUFDVixrQkFBa0IsR0FFbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUUzRSxPQUFPLEVBT0wsc0JBQXNCLEVBQ3RCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsdUJBQXVCLEdBQ3hCLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUU1Qiw0REFBNEQ7QUFDNUQsb0NBQW9DO0FBQ3BDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MsZ0RBQWdEO0FBQ2hELE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUNwQyxrQkFBa0IsQ0FDaEI7SUFDRSxZQUFtQixXQUFvQztRQUFwQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7SUFBRyxDQUFDO0NBQzVELENB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QUMzQyxNQUFNLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7Ozs7SUFjVixDQUFDLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIF9NYXRUaHVtYixcbiAgX01hdFRpY2tNYXJrLFxuICBfTWF0U2xpZGVyLFxuICBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgX01hdFNsaWRlclRodW1iLFxuICBfTWF0U2xpZGVyVmlzdWFsVGh1bWIsXG4gIE1BVF9TTElERVJfUkFOR0VfVEhVTUIsXG4gIE1BVF9TTElERVJfVEhVTUIsXG4gIE1BVF9TTElERVIsXG4gIE1BVF9TTElERVJfVklTVUFMX1RIVU1CLFxufSBmcm9tICcuL3NsaWRlci1pbnRlcmZhY2UnO1xuXG4vLyBUT0RPKHdhZ25lcm1hY2llbCk6IG1heWJlIGhhbmRsZSB0aGUgZm9sbG93aW5nIGVkZ2UgY2FzZTpcbi8vIDEuIHN0YXJ0IGRyYWdnaW5nIGRpc2NyZXRlIHNsaWRlclxuLy8gMi4gdGFiIHRvIGRpc2FibGUgY2hlY2tib3hcbi8vIDMuIHdpdGhvdXQgZW5kaW5nIGRyYWcsIGRpc2FibGUgdGhlIHNsaWRlclxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlci5cbmNvbnN0IF9NYXRTbGlkZXJNaXhpbkJhc2UgPSBtaXhpbkNvbG9yKFxuICBtaXhpbkRpc2FibGVSaXBwbGUoXG4gICAgY2xhc3Mge1xuICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cbiAgICB9LFxuICApLFxuICAncHJpbWFyeScsXG4pO1xuXG4vKipcbiAqIEFsbG93cyB1c2VycyB0byBzZWxlY3QgZnJvbSBhIHJhbmdlIG9mIHZhbHVlcyBieSBtb3ZpbmcgdGhlIHNsaWRlciB0aHVtYi4gSXQgaXMgc2ltaWxhciBpblxuICogYmVoYXZpb3IgdG8gdGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJyYW5nZVwiPmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtc2xpZGVyIG1kYy1zbGlkZXInLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tcmFuZ2VdJzogJ19pc1JhbmdlJyxcbiAgICAnW2NsYXNzLm1kYy1zbGlkZXItLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tZGMtc2xpZGVyLS1kaXNjcmV0ZV0nOiAnZGlzY3JldGUnLFxuICAgICdbY2xhc3MubWRjLXNsaWRlci0tdGljay1tYXJrc10nOiAnc2hvd1RpY2tNYXJrcycsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX25vb3BBbmltYXRpb25zJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9TTElERVIsIHVzZUV4aXN0aW5nOiBNYXRTbGlkZXJ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyXG4gIGV4dGVuZHMgX01hdFNsaWRlck1peGluQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveSwgX01hdFNsaWRlclxue1xuICAvKiogVGhlIGFjdGl2ZSBwb3J0aW9uIG9mIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIEBWaWV3Q2hpbGQoJ3RyYWNrQWN0aXZlJykgX3RyYWNrQWN0aXZlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogVGhlIHNsaWRlciB0aHVtYihzKS4gKi9cbiAgQFZpZXdDaGlsZHJlbihNQVRfU0xJREVSX1ZJU1VBTF9USFVNQikgX3RodW1iczogUXVlcnlMaXN0PF9NYXRTbGlkZXJWaXN1YWxUaHVtYj47XG5cbiAgLyoqIFRoZSBzbGlkZXJzIGhpZGRlbiByYW5nZSBpbnB1dChzKS4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfU0xJREVSX1RIVU1CKSBfaW5wdXQ6IF9NYXRTbGlkZXJUaHVtYjtcblxuICAvKiogVGhlIHNsaWRlcnMgaGlkZGVuIHJhbmdlIGlucHV0KHMpLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9TTElERVJfUkFOR0VfVEhVTUIsIHtkZXNjZW5kYW50czogZmFsc2V9KVxuICBfaW5wdXRzOiBRdWVyeUxpc3Q8X01hdFNsaWRlclJhbmdlVGh1bWI+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk7XG5cbiAgICBpZiAoZW5kSW5wdXQpIHtcbiAgICAgIGVuZElucHV0LmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICAgIGlmIChzdGFydElucHV0KSB7XG4gICAgICBzdGFydElucHV0LmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyBhIG51bWVyaWMgdmFsdWUgbGFiZWwgdXBvbiBwcmVzc2luZyB0aGUgdGh1bWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNjcmV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzY3JldGU7XG4gIH1cbiAgc2V0IGRpc2NyZXRlKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2NyZXRlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2NyZXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBkaXNwbGF5cyB0aWNrIG1hcmtzIGFsb25nIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93VGlja01hcmtzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93VGlja01hcmtzO1xuICB9XG4gIHNldCBzaG93VGlja01hcmtzKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3Nob3dUaWNrTWFya3MgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd1RpY2tNYXJrczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG4gIHNldCBtaW4odjogTnVtYmVySW5wdXQpIHtcbiAgICBjb25zdCBtaW4gPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9taW4pO1xuICAgIGlmICh0aGlzLl9taW4gIT09IG1pbikge1xuICAgICAgdGhpcy5fdXBkYXRlTWluKG1pbik7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21pbjogbnVtYmVyID0gMDtcblxuICBwcml2YXRlIF91cGRhdGVNaW4obWluOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2TWluID0gdGhpcy5fbWluO1xuICAgIHRoaXMuX21pbiA9IG1pbjtcbiAgICB0aGlzLl9pc1JhbmdlID8gdGhpcy5fdXBkYXRlTWluUmFuZ2Uoe29sZDogcHJldk1pbiwgbmV3OiBtaW59KSA6IHRoaXMuX3VwZGF0ZU1pbk5vblJhbmdlKG1pbik7XG4gICAgdGhpcy5fb25NaW5NYXhPclN0ZXBDaGFuZ2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU1pblJhbmdlKG1pbjoge29sZDogbnVtYmVyOyBuZXc6IG51bWJlcn0pOiB2b2lkIHtcbiAgICBjb25zdCBlbmRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuXG4gICAgY29uc3Qgb2xkRW5kVmFsdWUgPSBlbmRJbnB1dC52YWx1ZTtcbiAgICBjb25zdCBvbGRTdGFydFZhbHVlID0gc3RhcnRJbnB1dC52YWx1ZTtcblxuICAgIHN0YXJ0SW5wdXQubWluID0gbWluLm5ldztcbiAgICBlbmRJbnB1dC5taW4gPSBNYXRoLm1heChtaW4ubmV3LCBzdGFydElucHV0LnZhbHVlKTtcbiAgICBzdGFydElucHV0Lm1heCA9IE1hdGgubWluKGVuZElucHV0Lm1heCwgZW5kSW5wdXQudmFsdWUpO1xuXG4gICAgc3RhcnRJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgIGVuZElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG5cbiAgICBtaW4ubmV3IDwgbWluLm9sZFxuICAgICAgPyB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3QoZW5kSW5wdXQsIHN0YXJ0SW5wdXQpXG4gICAgICA6IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChzdGFydElucHV0LCBlbmRJbnB1dCk7XG5cbiAgICBpZiAob2xkRW5kVmFsdWUgIT09IGVuZElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGVuZElucHV0KTtcbiAgICB9XG5cbiAgICBpZiAob2xkU3RhcnRWYWx1ZSAhPT0gc3RhcnRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShzdGFydElucHV0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVNaW5Ob25SYW5nZShtaW46IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICBpbnB1dC5taW4gPSBtaW47XG4gICAgICBpbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRyYWNrVUkoaW5wdXQpO1xuXG4gICAgICBpZiAob2xkVmFsdWUgIT09IGlucHV0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xuICB9XG4gIHNldCBtYXgodjogTnVtYmVySW5wdXQpIHtcbiAgICBjb25zdCBtYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9tYXgpO1xuICAgIGlmICh0aGlzLl9tYXggIT09IG1heCkge1xuICAgICAgdGhpcy5fdXBkYXRlTWF4KG1heCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIHByaXZhdGUgX3VwZGF0ZU1heChtYXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHByZXZNYXggPSB0aGlzLl9tYXg7XG4gICAgdGhpcy5fbWF4ID0gbWF4O1xuICAgIHRoaXMuX2lzUmFuZ2UgPyB0aGlzLl91cGRhdGVNYXhSYW5nZSh7b2xkOiBwcmV2TWF4LCBuZXc6IG1heH0pIDogdGhpcy5fdXBkYXRlTWF4Tm9uUmFuZ2UobWF4KTtcbiAgICB0aGlzLl9vbk1pbk1heE9yU3RlcENoYW5nZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWF4UmFuZ2UobWF4OiB7b2xkOiBudW1iZXI7IG5ldzogbnVtYmVyfSk6IHZvaWQge1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICBjb25zdCBvbGRFbmRWYWx1ZSA9IGVuZElucHV0LnZhbHVlO1xuICAgIGNvbnN0IG9sZFN0YXJ0VmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgZW5kSW5wdXQubWF4ID0gbWF4Lm5ldztcbiAgICBzdGFydElucHV0Lm1heCA9IE1hdGgubWluKG1heC5uZXcsIGVuZElucHV0LnZhbHVlKTtcbiAgICBlbmRJbnB1dC5taW4gPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgZW5kSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICBzdGFydElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG5cbiAgICBtYXgubmV3ID4gbWF4Lm9sZFxuICAgICAgPyB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3Qoc3RhcnRJbnB1dCwgZW5kSW5wdXQpXG4gICAgICA6IHRoaXMuX29uVHJhbnNsYXRlWENoYW5nZUJ5U2lkZUVmZmVjdChlbmRJbnB1dCwgc3RhcnRJbnB1dCk7XG5cbiAgICBpZiAob2xkRW5kVmFsdWUgIT09IGVuZElucHV0LnZhbHVlKSB7XG4gICAgICB0aGlzLl9vblZhbHVlQ2hhbmdlKGVuZElucHV0KTtcbiAgICB9XG5cbiAgICBpZiAob2xkU3RhcnRWYWx1ZSAhPT0gc3RhcnRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShzdGFydElucHV0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVNYXhOb25SYW5nZShtYXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICBpbnB1dC5tYXggPSBtYXg7XG4gICAgICBpbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRyYWNrVUkoaW5wdXQpO1xuXG4gICAgICBpZiAob2xkVmFsdWUgIT09IGlucHV0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2UoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWVzIGF0IHdoaWNoIHRoZSB0aHVtYiB3aWxsIHNuYXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGVwKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0ZXA7XG4gIH1cbiAgc2V0IHN0ZXAodjogTnVtYmVySW5wdXQpIHtcbiAgICBjb25zdCBzdGVwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fc3RlcCk7XG4gICAgaWYgKHRoaXMuX3N0ZXAgIT09IHN0ZXApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN0ZXAoc3RlcCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3N0ZXA6IG51bWJlciA9IDA7XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RlcChzdGVwOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICB0aGlzLl9pc1JhbmdlID8gdGhpcy5fdXBkYXRlU3RlcFJhbmdlKCkgOiB0aGlzLl91cGRhdGVTdGVwTm9uUmFuZ2UoKTtcbiAgICB0aGlzLl9vbk1pbk1heE9yU3RlcENoYW5nZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RlcFJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG4gICAgY29uc3Qgc3RhcnRJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCkgYXMgX01hdFNsaWRlclJhbmdlVGh1bWI7XG5cbiAgICBjb25zdCBvbGRFbmRWYWx1ZSA9IGVuZElucHV0LnZhbHVlO1xuICAgIGNvbnN0IG9sZFN0YXJ0VmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgY29uc3QgcHJldlN0YXJ0VmFsdWUgPSBzdGFydElucHV0LnZhbHVlO1xuXG4gICAgZW5kSW5wdXQubWluID0gdGhpcy5fbWluO1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gdGhpcy5fbWF4O1xuXG4gICAgZW5kSW5wdXQuc3RlcCA9IHRoaXMuX3N0ZXA7XG4gICAgc3RhcnRJbnB1dC5zdGVwID0gdGhpcy5fc3RlcDtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5TQUZBUkkpIHtcbiAgICAgIGVuZElucHV0LnZhbHVlID0gZW5kSW5wdXQudmFsdWU7XG4gICAgICBzdGFydElucHV0LnZhbHVlID0gc3RhcnRJbnB1dC52YWx1ZTtcbiAgICB9XG5cbiAgICBlbmRJbnB1dC5taW4gPSBNYXRoLm1heCh0aGlzLl9taW4sIHN0YXJ0SW5wdXQudmFsdWUpO1xuICAgIHN0YXJ0SW5wdXQubWF4ID0gTWF0aC5taW4odGhpcy5fbWF4LCBlbmRJbnB1dC52YWx1ZSk7XG5cbiAgICBzdGFydElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgZW5kSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcblxuICAgIGVuZElucHV0LnZhbHVlIDwgcHJldlN0YXJ0VmFsdWVcbiAgICAgID8gdGhpcy5fb25UcmFuc2xhdGVYQ2hhbmdlQnlTaWRlRWZmZWN0KHN0YXJ0SW5wdXQsIGVuZElucHV0KVxuICAgICAgOiB0aGlzLl9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3QoZW5kSW5wdXQsIHN0YXJ0SW5wdXQpO1xuXG4gICAgaWYgKG9sZEVuZFZhbHVlICE9PSBlbmRJbnB1dC52YWx1ZSkge1xuICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShlbmRJbnB1dCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFN0YXJ0VmFsdWUgIT09IHN0YXJ0SW5wdXQudmFsdWUpIHtcbiAgICAgIHRoaXMuX29uVmFsdWVDaGFuZ2Uoc3RhcnRJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RlcE5vblJhbmdlKCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICBpbnB1dC5zdGVwID0gdGhpcy5fc3RlcDtcbiAgICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5TQUZBUkkpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG5cbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gaW5wdXQudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25WYWx1ZUNoYW5nZShpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGZvcm1hdCB0aGUgdmFsdWUgYmVmb3JlIGl0IGlzIGRpc3BsYXllZFxuICAgKiBpbiB0aGUgdGh1bWIgbGFiZWwuIENhbiBiZSB1c2VkIHRvIGZvcm1hdCB2ZXJ5IGxhcmdlIG51bWJlciBpbiBvcmRlclxuICAgKiBmb3IgdGhlbSB0byBmaXQgaW50byB0aGUgc2xpZGVyIHRodW1iLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheVdpdGg6ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSAodmFsdWU6IG51bWJlcikgPT4gYCR7dmFsdWV9YDtcblxuICAvKiogVXNlZCB0byBrZWVwIHRyYWNrIG9mICYgcmVuZGVyIHRoZSBhY3RpdmUgJiBpbmFjdGl2ZSB0aWNrIG1hcmtzIG9uIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIF90aWNrTWFya3M6IF9NYXRUaWNrTWFya1tdO1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgaGF2ZSBiZWVuIGRpc2FibGVkLiAqL1xuICBfbm9vcEFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBjaGFuZ2VzIHRvIHRoZSBkaXJlY3Rpb25hbGl0eSAoTFRSIC8gUlRMKSBjb250ZXh0IGZvciB0aGUgYXBwbGljYXRpb24uICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBPYnNlcnZlciB1c2VkIHRvIG1vbml0b3Igc2l6ZSBjaGFuZ2VzIGluIHRoZSBzbGlkZXIuICovXG4gIHByaXZhdGUgX3Jlc2l6ZU9ic2VydmVyOiBSZXNpemVPYnNlcnZlciB8IG51bGw7XG5cbiAgLy8gU3RvcmVkIGRpbWVuc2lvbnMgdG8gYXZvaWQgY2FsbGluZyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgcmVkdW5kYW50bHkuXG5cbiAgX2NhY2hlZFdpZHRoOiBudW1iZXI7XG4gIF9jYWNoZWRMZWZ0OiBudW1iZXI7XG5cbiAgX3JpcHBsZVJhZGl1czogbnVtYmVyID0gMjQ7XG5cbiAgLy8gVGhlIHZhbHVlIGluZGljYXRvciB0b29sdGlwIHRleHQgZm9yIHRoZSB2aXN1YWwgc2xpZGVyIHRodW1iKHMpLlxuXG4gIHByb3RlY3RlZCBzdGFydFZhbHVlSW5kaWNhdG9yVGV4dDogc3RyaW5nID0gJyc7XG4gIHByb3RlY3RlZCBlbmRWYWx1ZUluZGljYXRvclRleHQ6IHN0cmluZyA9ICcnO1xuXG4gIC8vIFVzZWQgdG8gY29udHJvbCB0aGUgdHJhbnNsYXRlWCBvZiB0aGUgdmlzdWFsIHNsaWRlciB0aHVtYihzKS5cblxuICBfZW5kVGh1bWJUcmFuc2Zvcm06IHN0cmluZztcbiAgX3N0YXJ0VGh1bWJUcmFuc2Zvcm06IHN0cmluZztcblxuICBfaXNSYW5nZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgcnRsLiAqL1xuICBfaXNSdGw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHdpZHRoIG9mIHRoZSB0aWNrIG1hcmsgdHJhY2suXG4gICAqIFRoZSB0aWNrIG1hcmsgdHJhY2sgd2lkdGggaXMgZGlmZmVyZW50IGZyb20gZnVsbCB0cmFjayB3aWR0aFxuICAgKi9cbiAgX3RpY2tNYXJrVHJhY2tXaWR0aDogbnVtYmVyID0gMDtcblxuICBfaGFzQW5pbWF0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfcmVzaXplVGltZXI6IG51bGwgfCBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIHJlYWRvbmx5IF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHJlYWRvbmx5IF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgcmVhZG9ubHkgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgcmVhZG9ubHkgX2dsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fb25EaXJDaGFuZ2UoKSk7XG4gICAgdGhpcy5faXNSdGwgPSB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIG5hdGl2ZSBzbGlkZXIncyBrbm9iLiBBRkFJSyB0aGVyZSBpcyBubyB3YXkgdG8gYXZvaWQgaGFyZGNvZGluZyB0aGlzLiAqL1xuICBfa25vYlJhZGl1czogbnVtYmVyID0gODtcblxuICBfaW5wdXRQYWRkaW5nOiBudW1iZXI7XG4gIF9pbnB1dE9mZnNldDogbnVtYmVyO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgfVxuICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgIGNvbnN0IHNJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCk7XG4gICAgdGhpcy5faXNSYW5nZSA9ICEhZUlucHV0ICYmICEhc0lucHV0O1xuXG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgX3ZhbGlkYXRlSW5wdXRzKFxuICAgICAgICB0aGlzLl9pc1JhbmdlLFxuICAgICAgICB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSEsXG4gICAgICAgIHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5TVEFSVCksXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHRodW1iID0gdGhpcy5fZ2V0VGh1bWIoX01hdFRodW1iLkVORCk7XG4gICAgdGhpcy5fcmlwcGxlUmFkaXVzID0gdGh1bWIuX3JpcHBsZS5yYWRpdXM7XG5cbiAgICB0aGlzLl9pbnB1dFBhZGRpbmcgPSB0aGlzLl9yaXBwbGVSYWRpdXMgLSB0aGlzLl9rbm9iUmFkaXVzO1xuICAgIHRoaXMuX2lucHV0T2Zmc2V0ID0gdGhpcy5fa25vYlJhZGl1cztcblxuICAgIGlmIChlSW5wdXQpIHtcbiAgICAgIGVJbnB1dC5pbml0UHJvcHMoKTtcbiAgICAgIGVJbnB1dC5pbml0VUkoKTtcbiAgICB9XG4gICAgaWYgKHNJbnB1dCkge1xuICAgICAgc0lucHV0LmluaXRQcm9wcygpO1xuICAgICAgc0lucHV0LmluaXRVSSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNSYW5nZSkge1xuICAgICAgKGVJbnB1dCBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYikuX3VwZGF0ZU1pbk1heCgpO1xuICAgICAgKHNJbnB1dCBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYikuX3VwZGF0ZU1pbk1heCgpO1xuICAgIH1cbiAgICB0aGlzLl91cGRhdGVUcmFja1VJKGVJbnB1dCEpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTtcblxuICAgIHRoaXMuX29ic2VydmVIb3N0UmVzaXplKCk7XG4gICAgdGhpcy5fY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3Jlc2l6ZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXBkYXRpbmcgdGhlIHNsaWRlciB1aSBhZnRlciBhIGRpciBjaGFuZ2UuICovXG4gIHByaXZhdGUgX29uRGlyQ2hhbmdlKCk6IHZvaWQge1xuICAgIHRoaXMuX2lzUnRsID0gdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJztcbiAgICB0aGlzLl9pc1JhbmdlID8gdGhpcy5fb25EaXJDaGFuZ2VSYW5nZSgpIDogdGhpcy5fb25EaXJDaGFuZ2VOb25SYW5nZSgpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVUkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX29uRGlyQ2hhbmdlUmFuZ2UoKTogdm9pZCB7XG4gICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuRU5EKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgIGVuZElucHV0Ll9zZXRJc0xlZnRUaHVtYigpO1xuICAgIHN0YXJ0SW5wdXQuX3NldElzTGVmdFRodW1iKCk7XG5cbiAgICBlbmRJbnB1dC50cmFuc2xhdGVYID0gZW5kSW5wdXQuX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpO1xuICAgIHN0YXJ0SW5wdXQudHJhbnNsYXRlWCA9IHN0YXJ0SW5wdXQuX2NhbGNUcmFuc2xhdGVYQnlWYWx1ZSgpO1xuXG4gICAgZW5kSW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuICAgIHN0YXJ0SW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuXG4gICAgZW5kSW5wdXQuX3VwZGF0ZVdpZHRoSW5hY3RpdmUoKTtcbiAgICBzdGFydElucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG5cbiAgICBlbmRJbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgICBzdGFydElucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25EaXJDaGFuZ2VOb25SYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpITtcbiAgICBpbnB1dC5fdXBkYXRlVGh1bWJVSUJ5VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBTdGFydHMgb2JzZXJ2aW5nIGFuZCB1cGRhdGluZyB0aGUgc2xpZGVyIGlmIHRoZSBob3N0IGNoYW5nZXMgaXRzIHNpemUuICovXG4gIHByaXZhdGUgX29ic2VydmVIb3N0UmVzaXplKCkge1xuICAgIGlmICh0eXBlb2YgUmVzaXplT2JzZXJ2ZXIgPT09ICd1bmRlZmluZWQnIHx8ICFSZXNpemVPYnNlcnZlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVUaW1lcikge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZXNpemVUaW1lcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb25SZXNpemUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgYW55IG9mIHRoZSB0aHVtYnMgYXJlIGN1cnJlbnRseSBhY3RpdmUuICovXG4gIHByaXZhdGUgX2lzQWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRUaHVtYihfTWF0VGh1bWIuU1RBUlQpLl9pc0FjdGl2ZSB8fCB0aGlzLl9nZXRUaHVtYihfTWF0VGh1bWIuRU5EKS5faXNBY3RpdmU7XG4gIH1cblxuICBwcml2YXRlIF9nZXRWYWx1ZSh0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWIgPSBfTWF0VGh1bWIuRU5EKTogbnVtYmVyIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2dldElucHV0KHRodW1iUG9zaXRpb24pO1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiB0aGlzLm1pbjtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0LnZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2tpcFVwZGF0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEoXG4gICAgICB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpPy5fc2tpcFVJVXBkYXRlIHx8IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpPy5fc2tpcFVJVXBkYXRlXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBTdG9yZXMgdGhlIHNsaWRlciBkaW1lbnNpb25zLiAqL1xuICBfdXBkYXRlRGltZW5zaW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMuX2NhY2hlZFdpZHRoID0gcmVjdC53aWR0aDtcbiAgICB0aGlzLl9jYWNoZWRMZWZ0ID0gcmVjdC5sZWZ0O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHN0eWxlcyBmb3IgdGhlIGFjdGl2ZSBwb3J0aW9uIG9mIHRoZSB0cmFjay4gKi9cbiAgX3NldFRyYWNrQWN0aXZlU3R5bGVzKHN0eWxlczoge1xuICAgIGxlZnQ6IHN0cmluZztcbiAgICByaWdodDogc3RyaW5nO1xuICAgIHRyYW5zZm9ybTogc3RyaW5nO1xuICAgIHRyYW5zZm9ybU9yaWdpbjogc3RyaW5nO1xuICB9KTogdm9pZCB7XG4gICAgY29uc3QgdHJhY2tTdHlsZSA9IHRoaXMuX3RyYWNrQWN0aXZlLm5hdGl2ZUVsZW1lbnQuc3R5bGU7XG4gICAgdHJhY2tTdHlsZS5sZWZ0ID0gc3R5bGVzLmxlZnQ7XG4gICAgdHJhY2tTdHlsZS5yaWdodCA9IHN0eWxlcy5yaWdodDtcbiAgICB0cmFja1N0eWxlLnRyYW5zZm9ybSA9IHN0eWxlcy50cmFuc2Zvcm07XG4gICAgdHJhY2tTdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBzdHlsZXMudHJhbnNmb3JtT3JpZ2luO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRyYW5zbGF0ZVggcG9zaXRpb25pbmcgZm9yIGEgdGljayBtYXJrIGJhc2VkIG9uIGl0J3MgaW5kZXguICovXG4gIF9jYWxjVGlja01hcmtUcmFuc2Zvcm0oaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBTZWUgaWYgd2UgY2FuIGF2b2lkIGRvaW5nIHRoaXMgYW5kIGp1c3QgdXNpbmcgZmxleCB0byBwb3NpdGlvbiB0aGVzZS5cbiAgICBjb25zdCB0cmFuc2xhdGVYID0gaW5kZXggKiAodGhpcy5fdGlja01hcmtUcmFja1dpZHRoIC8gKHRoaXMuX3RpY2tNYXJrcy5sZW5ndGggLSAxKSk7XG4gICAgcmV0dXJuIGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRlWH1weGA7XG4gIH1cblxuICAvLyBIYW5kbGVycyBmb3IgdXBkYXRpbmcgdGhlIHNsaWRlciB1aS5cblxuICBfb25UcmFuc2xhdGVYQ2hhbmdlKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJVSShzb3VyY2UpO1xuICAgIHRoaXMuX3VwZGF0ZVRyYWNrVUkoc291cmNlKTtcbiAgICB0aGlzLl91cGRhdGVPdmVybGFwcGluZ1RodW1iVUkoc291cmNlIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iKTtcbiAgfVxuXG4gIF9vblRyYW5zbGF0ZVhDaGFuZ2VCeVNpZGVFZmZlY3QoXG4gICAgaW5wdXQxOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYixcbiAgICBpbnB1dDI6IF9NYXRTbGlkZXJSYW5nZVRodW1iLFxuICApOiB2b2lkIHtcbiAgICBpbnB1dDEuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgaW5wdXQyLl91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICB9XG5cbiAgX29uVmFsdWVDaGFuZ2Uoc291cmNlOiBfTWF0U2xpZGVyVGh1bWIpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZUluZGljYXRvclVJKHNvdXJjZSk7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBfb25NaW5NYXhPclN0ZXBDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVHJhY2tVSSgpO1xuICAgIHRoaXMuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIF9vblJlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgaWYgKHRoaXMuX2lzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpIGFzIF9NYXRTbGlkZXJSYW5nZVRodW1iO1xuICAgICAgY29uc3Qgc0lucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLlNUQVJUKSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYjtcblxuICAgICAgZUlucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuICAgICAgc0lucHV0Ll91cGRhdGVUaHVtYlVJQnlWYWx1ZSgpO1xuXG4gICAgICBlSW5wdXQuX3VwZGF0ZVN0YXRpY1N0eWxlcygpO1xuICAgICAgc0lucHV0Ll91cGRhdGVTdGF0aWNTdHlsZXMoKTtcblxuICAgICAgZUlucHV0Ll91cGRhdGVNaW5NYXgoKTtcbiAgICAgIHNJbnB1dC5fdXBkYXRlTWluTWF4KCk7XG5cbiAgICAgIGVJbnB1dC5fdXBkYXRlV2lkdGhJbmFjdGl2ZSgpO1xuICAgICAgc0lucHV0Ll91cGRhdGVXaWR0aEluYWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVJbnB1dCA9IHRoaXMuX2dldElucHV0KF9NYXRUaHVtYi5FTkQpO1xuICAgICAgaWYgKGVJbnB1dCkge1xuICAgICAgICBlSW5wdXQuX3VwZGF0ZVRodW1iVUlCeVZhbHVlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlVGlja01hcmtVSSgpO1xuICAgIHRoaXMuX3VwZGF0ZVRpY2tNYXJrVHJhY2tVSSgpO1xuICAgIHRoaXMuX2Nkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIHNsaWRlciB0aHVtYnMgb3ZlcmxhcC4gKi9cbiAgcHJpdmF0ZSBfdGh1bWJzT3ZlcmxhcDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNsaWRlciBrbm9icyBhcmUgb3ZlcmxhcHBpbmcgb25lIGFub3RoZXIuICovXG4gIHByaXZhdGUgX2FyZVRodW1ic092ZXJsYXBwaW5nKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHN0YXJ0SW5wdXQgPSB0aGlzLl9nZXRJbnB1dChfTWF0VGh1bWIuU1RBUlQpO1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fZ2V0SW5wdXQoX01hdFRodW1iLkVORCk7XG4gICAgaWYgKCFzdGFydElucHV0IHx8ICFlbmRJbnB1dCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZW5kSW5wdXQudHJhbnNsYXRlWCAtIHN0YXJ0SW5wdXQudHJhbnNsYXRlWCA8IDIwO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNsYXNzIG5hbWVzIG9mIG92ZXJsYXBwaW5nIHNsaWRlciB0aHVtYnMgc29cbiAgICogdGhhdCB0aGUgY3VycmVudCBhY3RpdmUgdGh1bWIgaXMgc3R5bGVkIHRvIGJlIG9uIFwidG9wXCIuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVPdmVybGFwcGluZ1RodW1iQ2xhc3NOYW1lcyhzb3VyY2U6IF9NYXRTbGlkZXJSYW5nZVRodW1iKTogdm9pZCB7XG4gICAgY29uc3Qgc2libGluZyA9IHNvdXJjZS5nZXRTaWJsaW5nKCkhO1xuICAgIGNvbnN0IHNvdXJjZVRodW1iID0gdGhpcy5fZ2V0VGh1bWIoc291cmNlLnRodW1iUG9zaXRpb24pO1xuICAgIGNvbnN0IHNpYmxpbmdUaHVtYiA9IHRoaXMuX2dldFRodW1iKHNpYmxpbmcudGh1bWJQb3NpdGlvbik7XG4gICAgc2libGluZ1RodW1iLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtc2xpZGVyX190aHVtYi0tdG9wJyk7XG4gICAgc291cmNlVGh1bWIuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1zbGlkZXJfX3RodW1iLS10b3AnLCB0aGlzLl90aHVtYnNPdmVybGFwKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBVSSBvZiBzbGlkZXIgdGh1bWJzIHdoZW4gdGhleSBiZWdpbiBvciBzdG9wIG92ZXJsYXBwaW5nLiAqL1xuICBwcml2YXRlIF91cGRhdGVPdmVybGFwcGluZ1RodW1iVUkoc291cmNlOiBfTWF0U2xpZGVyUmFuZ2VUaHVtYik6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNSYW5nZSB8fCB0aGlzLl9za2lwVXBkYXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RodW1ic092ZXJsYXAgIT09IHRoaXMuX2FyZVRodW1ic092ZXJsYXBwaW5nKCkpIHtcbiAgICAgIHRoaXMuX3RodW1ic092ZXJsYXAgPSAhdGhpcy5fdGh1bWJzT3ZlcmxhcDtcbiAgICAgIHRoaXMuX3VwZGF0ZU92ZXJsYXBwaW5nVGh1bWJDbGFzc05hbWVzKHNvdXJjZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gX01hdFRodW1iIHN0eWxlcyB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBUcmFuc2xhdGVYLCByZXNpemUsIG9yIGRpciBjaGFuZ2VcbiAgLy8gICAgLSBSZWFzb246IFRoZSB0aHVtYiBzdHlsZXMgbmVlZCB0byBiZSB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgbmV3IHRyYW5zbGF0ZVguXG4gIC8vIDIuIE1pbiwgbWF4LCBvciBzdGVwXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdmFsdWUgbWF5IGhhdmUgc2lsZW50bHkgY2hhbmdlZC5cblxuICAvKiogVXBkYXRlcyB0aGUgdHJhbnNsYXRlWCBvZiB0aGUgZ2l2ZW4gdGh1bWIuICovXG4gIF91cGRhdGVUaHVtYlVJKHNvdXJjZTogX01hdFNsaWRlclRodW1iKSB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aHVtYiA9IHRoaXMuX2dldFRodW1iKFxuICAgICAgc291cmNlLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5FTkQgPyBfTWF0VGh1bWIuRU5EIDogX01hdFRodW1iLlNUQVJULFxuICAgICkhO1xuICAgIHRodW1iLl9ob3N0RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3NvdXJjZS50cmFuc2xhdGVYfXB4KWA7XG4gIH1cblxuICAvLyBWYWx1ZSBpbmRpY2F0b3IgdGV4dCB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBWYWx1ZVxuICAvLyAgICAtIFJlYXNvbjogVGhlIHZhbHVlIGRpc3BsYXllZCBuZWVkcyB0byBiZSB1cGRhdGVkLlxuICAvLyAyLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbjogVGhlIHZhbHVlIG1heSBoYXZlIHNpbGVudGx5IGNoYW5nZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHZhbHVlIGluZGljYXRvciB0b29sdGlwIHVpIGZvciB0aGUgZ2l2ZW4gdGh1bWIuICovXG4gIF91cGRhdGVWYWx1ZUluZGljYXRvclVJKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVldGV4dCA9IHRoaXMuZGlzcGxheVdpdGgoc291cmNlLnZhbHVlKTtcbiAgICBzb3VyY2UuX3ZhbHVldGV4dCA9IHZhbHVldGV4dDtcbiAgICBpZiAodGhpcy5kaXNjcmV0ZSkge1xuICAgICAgc291cmNlLnRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVFxuICAgICAgICA/ICh0aGlzLnN0YXJ0VmFsdWVJbmRpY2F0b3JUZXh0ID0gdmFsdWV0ZXh0KVxuICAgICAgICA6ICh0aGlzLmVuZFZhbHVlSW5kaWNhdG9yVGV4dCA9IHZhbHVldGV4dCk7XG5cbiAgICAgIGNvbnN0IHZpc3VhbFRodW1iID0gdGhpcy5fZ2V0VGh1bWIoc291cmNlLnRodW1iUG9zaXRpb24pO1xuICAgICAgdmFsdWV0ZXh0Lmxlbmd0aCA8IDNcbiAgICAgICAgPyB2aXN1YWxUaHVtYi5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWRjLXNsaWRlcl9fdGh1bWItLXNob3J0LXZhbHVlJylcbiAgICAgICAgOiB2aXN1YWxUaHVtYi5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLXNsaWRlcl9fdGh1bWItLXNob3J0LXZhbHVlJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gVXBkYXRlIFRpY2sgTWFyayBUcmFjayBXaWR0aFxuICAvL1xuICAvLyAxLiBNaW4sIG1heCwgb3Igc3RlcFxuICAvLyAgICAtIFJlYXNvbjogVGhlIG1heGltdW0gcmVhY2hhYmxlIHZhbHVlIG1heSBoYXZlIGNoYW5nZWQuXG4gIC8vICAgIC0gU2lkZSBub3RlOiBUaGUgbWF4aW11bSByZWFjaGFibGUgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIG1heGltdW0gdmFsdWUgc2V0IGJ5IHRoZVxuICAvLyAgICAgIHVzZXIuIEZvciBleGFtcGxlLCBhIHNsaWRlciB3aXRoIFttaW46IDUsIG1heDogMTAwLCBzdGVwOiAxMF0gd291bGQgaGF2ZSBhIG1heGltdW1cbiAgLy8gICAgICByZWFjaGFibGUgdmFsdWUgb2YgOTUuXG4gIC8vIDIuIFJlc2l6ZVxuICAvLyAgICAtIFJlYXNvbjogVGhlIHBvc2l0aW9uIGZvciB0aGUgbWF4aW11bSByZWFjaGFibGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVjYWxjdWxhdGVkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSB3aWR0aCBvZiB0aGUgdGljayBtYXJrIHRyYWNrLiAqL1xuICBwcml2YXRlIF91cGRhdGVUaWNrTWFya1RyYWNrVUkoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0ZXAgPSB0aGlzLl9zdGVwICYmIHRoaXMuX3N0ZXAgPiAwID8gdGhpcy5fc3RlcCA6IDE7XG4gICAgY29uc3QgbWF4VmFsdWUgPSBNYXRoLmZsb29yKHRoaXMubWF4IC8gc3RlcCkgKiBzdGVwO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAobWF4VmFsdWUgLSB0aGlzLm1pbikgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgdGhpcy5fdGlja01hcmtUcmFja1dpZHRoID0gdGhpcy5fY2FjaGVkV2lkdGggKiBwZXJjZW50YWdlIC0gNjtcbiAgfVxuXG4gIC8vIFRyYWNrIGFjdGl2ZSB1cGRhdGUgY29uZGl0aW9uc1xuICAvL1xuICAvLyAxLiBUcmFuc2xhdGVYXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdHJhY2sgYWN0aXZlIHNob3VsZCBsaW5lIHVwIHdpdGggdGhlIG5ldyB0aHVtYiBwb3NpdGlvbi5cbiAgLy8gMi4gTWluIG9yIG1heFxuICAvLyAgICAtIFJlYXNvbiAjMTogVGhlICdhY3RpdmUnIHBlcmNlbnRhZ2UgbmVlZHMgdG8gYmUgcmVjYWxjdWxhdGVkLlxuICAvLyAgICAtIFJlYXNvbiAjMjogVGhlIHZhbHVlIG1heSBoYXZlIHNpbGVudGx5IGNoYW5nZWQuXG4gIC8vIDMuIFN0ZXBcbiAgLy8gICAgLSBSZWFzb246IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkIGNhdXNpbmcgdGhlIHRodW1iKHMpIHRvIHNoaWZ0LlxuICAvLyA0LiBEaXIgY2hhbmdlXG4gIC8vICAgIC0gUmVhc29uOiBUaGUgdHJhY2sgYWN0aXZlIHdpbGwgbmVlZCB0byBiZSB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgbmV3IHRodW1iIHBvc2l0aW9uKHMpLlxuICAvLyA1LiBSZXNpemVcbiAgLy8gICAgLSBSZWFzb246IFRoZSB0b3RhbCB3aWR0aCB0aGUgJ2FjdGl2ZScgdHJhY2tzIHRyYW5zbGF0ZVggaXMgYmFzZWQgb24gaGFzIGNoYW5nZWQuXG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHNjYWxlIG9uIHRoZSBhY3RpdmUgcG9ydGlvbiBvZiB0aGUgdHJhY2suICovXG4gIF91cGRhdGVUcmFja1VJKHNvdXJjZTogX01hdFNsaWRlclRodW1iKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NraXBVcGRhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzUmFuZ2VcbiAgICAgID8gdGhpcy5fdXBkYXRlVHJhY2tVSVJhbmdlKHNvdXJjZSBhcyBfTWF0U2xpZGVyUmFuZ2VUaHVtYilcbiAgICAgIDogdGhpcy5fdXBkYXRlVHJhY2tVSU5vblJhbmdlKHNvdXJjZSBhcyBfTWF0U2xpZGVyVGh1bWIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVHJhY2tVSVJhbmdlKHNvdXJjZTogX01hdFNsaWRlclJhbmdlVGh1bWIpOiB2b2lkIHtcbiAgICBjb25zdCBzaWJsaW5nID0gc291cmNlLmdldFNpYmxpbmcoKTtcbiAgICBpZiAoIXNpYmxpbmcgfHwgIXRoaXMuX2NhY2hlZFdpZHRoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlUGVyY2VudGFnZSA9IE1hdGguYWJzKHNpYmxpbmcudHJhbnNsYXRlWCAtIHNvdXJjZS50cmFuc2xhdGVYKSAvIHRoaXMuX2NhY2hlZFdpZHRoO1xuXG4gICAgaWYgKHNvdXJjZS5faXNMZWZ0VGh1bWIgJiYgdGhpcy5fY2FjaGVkV2lkdGgpIHtcbiAgICAgIHRoaXMuX3NldFRyYWNrQWN0aXZlU3R5bGVzKHtcbiAgICAgICAgbGVmdDogJ2F1dG8nLFxuICAgICAgICByaWdodDogYCR7dGhpcy5fY2FjaGVkV2lkdGggLSBzaWJsaW5nLnRyYW5zbGF0ZVh9cHhgLFxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdyaWdodCcsXG4gICAgICAgIHRyYW5zZm9ybTogYHNjYWxlWCgke2FjdGl2ZVBlcmNlbnRhZ2V9KWAsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0VHJhY2tBY3RpdmVTdHlsZXMoe1xuICAgICAgICBsZWZ0OiBgJHtzaWJsaW5nLnRyYW5zbGF0ZVh9cHhgLFxuICAgICAgICByaWdodDogJ2F1dG8nLFxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0JyxcbiAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGVYKCR7YWN0aXZlUGVyY2VudGFnZX0pYCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVRyYWNrVUlOb25SYW5nZShzb3VyY2U6IF9NYXRTbGlkZXJUaHVtYik6IHZvaWQge1xuICAgIHRoaXMuX2lzUnRsXG4gICAgICA/IHRoaXMuX3NldFRyYWNrQWN0aXZlU3R5bGVzKHtcbiAgICAgICAgICBsZWZ0OiAnYXV0bycsXG4gICAgICAgICAgcmlnaHQ6ICcwcHgnLFxuICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ3JpZ2h0JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHsxIC0gc291cmNlLmZpbGxQZXJjZW50YWdlfSlgLFxuICAgICAgICB9KVxuICAgICAgOiB0aGlzLl9zZXRUcmFja0FjdGl2ZVN0eWxlcyh7XG4gICAgICAgICAgbGVmdDogJzBweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHtzb3VyY2UuZmlsbFBlcmNlbnRhZ2V9KWAsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLy8gVGljayBtYXJrIHVwZGF0ZSBjb25kaXRpb25zXG4gIC8vXG4gIC8vIDEuIFZhbHVlXG4gIC8vICAgIC0gUmVhc29uOiBhIHRpY2sgbWFyayB3aGljaCB3YXMgb25jZSBhY3RpdmUgbWlnaHQgbm93IGJlIGluYWN0aXZlIG9yIHZpY2UgdmVyc2EuXG4gIC8vIDIuIE1pbiwgbWF4LCBvciBzdGVwXG4gIC8vICAgIC0gUmVhc29uICMxOiB0aGUgbnVtYmVyIG9mIHRpY2sgbWFya3MgbWF5IGhhdmUgY2hhbmdlZC5cbiAgLy8gICAgLSBSZWFzb24gIzI6IFRoZSB2YWx1ZSBtYXkgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkLlxuXG4gIC8qKiBVcGRhdGVzIHRoZSBkb3RzIGFsb25nIHRoZSBzbGlkZXIgdHJhY2suICovXG4gIF91cGRhdGVUaWNrTWFya1VJKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0ZXAgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm1pbiA9PT0gdW5kZWZpbmVkIHx8IHRoaXMubWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RlcCA9IHRoaXMuc3RlcCA+IDAgPyB0aGlzLnN0ZXAgOiAxO1xuICAgIHRoaXMuX2lzUmFuZ2UgPyB0aGlzLl91cGRhdGVUaWNrTWFya1VJUmFuZ2Uoc3RlcCkgOiB0aGlzLl91cGRhdGVUaWNrTWFya1VJTm9uUmFuZ2Uoc3RlcCk7XG5cbiAgICBpZiAodGhpcy5faXNSdGwpIHtcbiAgICAgIHRoaXMuX3RpY2tNYXJrcy5yZXZlcnNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVGlja01hcmtVSU5vblJhbmdlKHN0ZXA6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0VmFsdWUoKTtcbiAgICBsZXQgbnVtQWN0aXZlID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgodmFsdWUgLSB0aGlzLm1pbikgLyBzdGVwKSwgMCk7XG4gICAgbGV0IG51bUluYWN0aXZlID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgodGhpcy5tYXggLSB2YWx1ZSkgLyBzdGVwKSwgMCk7XG4gICAgdGhpcy5faXNSdGwgPyBudW1BY3RpdmUrKyA6IG51bUluYWN0aXZlKys7XG5cbiAgICB0aGlzLl90aWNrTWFya3MgPSBBcnJheShudW1BY3RpdmUpXG4gICAgICAuZmlsbChfTWF0VGlja01hcmsuQUNUSVZFKVxuICAgICAgLmNvbmNhdChBcnJheShudW1JbmFjdGl2ZSkuZmlsbChfTWF0VGlja01hcmsuSU5BQ1RJVkUpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVRpY2tNYXJrVUlSYW5nZShzdGVwOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBlbmRWYWx1ZSA9IHRoaXMuX2dldFZhbHVlKCk7XG4gICAgY29uc3Qgc3RhcnRWYWx1ZSA9IHRoaXMuX2dldFZhbHVlKF9NYXRUaHVtYi5TVEFSVCk7XG4gICAgY29uc3QgbnVtSW5hY3RpdmVCZWZvcmVTdGFydFRodW1iID0gTWF0aC5tYXgoTWF0aC5mbG9vcigoc3RhcnRWYWx1ZSAtIHRoaXMubWluKSAvIHN0ZXApLCAwKTtcbiAgICBjb25zdCBudW1BY3RpdmUgPSBNYXRoLm1heChNYXRoLmZsb29yKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpIC8gc3RlcCkgKyAxLCAwKTtcbiAgICBjb25zdCBudW1JbmFjdGl2ZUFmdGVyRW5kVGh1bWIgPSBNYXRoLm1heChNYXRoLmZsb29yKCh0aGlzLm1heCAtIGVuZFZhbHVlKSAvIHN0ZXApLCAwKTtcbiAgICB0aGlzLl90aWNrTWFya3MgPSBBcnJheShudW1JbmFjdGl2ZUJlZm9yZVN0YXJ0VGh1bWIpXG4gICAgICAuZmlsbChfTWF0VGlja01hcmsuSU5BQ1RJVkUpXG4gICAgICAuY29uY2F0KFxuICAgICAgICBBcnJheShudW1BY3RpdmUpLmZpbGwoX01hdFRpY2tNYXJrLkFDVElWRSksXG4gICAgICAgIEFycmF5KG51bUluYWN0aXZlQWZ0ZXJFbmRUaHVtYikuZmlsbChfTWF0VGlja01hcmsuSU5BQ1RJVkUpLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzbGlkZXIgdGh1bWIgaW5wdXQgb2YgdGhlIGdpdmVuIHRodW1iIHBvc2l0aW9uLiAqL1xuICBfZ2V0SW5wdXQodGh1bWJQb3NpdGlvbjogX01hdFRodW1iKTogX01hdFNsaWRlclRodW1iIHwgX01hdFNsaWRlclJhbmdlVGh1bWIgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuRU5EICYmIHRoaXMuX2lucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5wdXQ7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pbnB1dHM/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRodW1iUG9zaXRpb24gPT09IF9NYXRUaHVtYi5TVEFSVCA/IHRoaXMuX2lucHV0cy5maXJzdCA6IHRoaXMuX2lucHV0cy5sYXN0O1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGVyIHRodW1iIEhUTUwgaW5wdXQgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gdGh1bWIgcG9zaXRpb24uICovXG4gIF9nZXRUaHVtYih0aHVtYlBvc2l0aW9uOiBfTWF0VGh1bWIpOiBfTWF0U2xpZGVyVmlzdWFsVGh1bWIge1xuICAgIHJldHVybiB0aHVtYlBvc2l0aW9uID09PSBfTWF0VGh1bWIuRU5EID8gdGhpcy5fdGh1bWJzPy5sYXN0ISA6IHRoaXMuX3RodW1icz8uZmlyc3QhO1xuICB9XG5cbiAgX3NldFRyYW5zaXRpb24od2l0aEFuaW1hdGlvbjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX2hhc0FuaW1hdGlvbiA9IHdpdGhBbmltYXRpb24gJiYgIXRoaXMuX25vb3BBbmltYXRpb25zO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgJ21hdC1tZGMtc2xpZGVyLXdpdGgtYW5pbWF0aW9uJyxcbiAgICAgIHRoaXMuX2hhc0FuaW1hdGlvbixcbiAgICApO1xuICB9XG59XG5cbi8qKiBFbnN1cmVzIHRoYXQgdGhlcmUgaXMgbm90IGFuIGludmFsaWQgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNsaWRlciB0aHVtYiBpbnB1dHMuICovXG5mdW5jdGlvbiBfdmFsaWRhdGVJbnB1dHMoXG4gIGlzUmFuZ2U6IGJvb2xlYW4sXG4gIGVuZElucHV0RWxlbWVudDogX01hdFNsaWRlclRodW1iIHwgX01hdFNsaWRlclJhbmdlVGh1bWIsXG4gIHN0YXJ0SW5wdXRFbGVtZW50PzogX01hdFNsaWRlclRodW1iLFxuKTogdm9pZCB7XG4gIGNvbnN0IHN0YXJ0VmFsaWQgPVxuICAgICFpc1JhbmdlIHx8IHN0YXJ0SW5wdXRFbGVtZW50Py5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCdtYXRTbGlkZXJTdGFydFRodW1iJyk7XG4gIGNvbnN0IGVuZFZhbGlkID0gZW5kSW5wdXRFbGVtZW50Ll9ob3N0RWxlbWVudC5oYXNBdHRyaWJ1dGUoXG4gICAgaXNSYW5nZSA/ICdtYXRTbGlkZXJFbmRUaHVtYicgOiAnbWF0U2xpZGVyVGh1bWInLFxuICApO1xuXG4gIGlmICghc3RhcnRWYWxpZCB8fCAhZW5kVmFsaWQpIHtcbiAgICBfdGhyb3dJbnZhbGlkSW5wdXRDb25maWd1cmF0aW9uRXJyb3IoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfdGhyb3dJbnZhbGlkSW5wdXRDb25maWd1cmF0aW9uRXJyb3IoKTogdm9pZCB7XG4gIHRocm93IEVycm9yKGBJbnZhbGlkIHNsaWRlciB0aHVtYiBpbnB1dCBjb25maWd1cmF0aW9uIVxuXG4gICBWYWxpZCBjb25maWd1cmF0aW9ucyBhcmUgYXMgZm9sbG93czpcblxuICAgICA8bWF0LXNsaWRlcj5cbiAgICAgICA8aW5wdXQgbWF0U2xpZGVyVGh1bWI+XG4gICAgIDwvbWF0LXNsaWRlcj5cblxuICAgICBvclxuXG4gICAgIDxtYXQtc2xpZGVyPlxuICAgICAgIDxpbnB1dCBtYXRTbGlkZXJTdGFydFRodW1iPlxuICAgICAgIDxpbnB1dCBtYXRTbGlkZXJFbmRUaHVtYj5cbiAgICAgPC9tYXQtc2xpZGVyPlxuICAgYCk7XG59XG4iLCI8IS0tIElucHV0cyAtLT5cbjxuZy1jb250ZW50PjwvbmctY29udGVudD5cblxuPCEtLSBUcmFjayAtLT5cbjxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX190cmFja1wiPlxuICA8ZGl2IGNsYXNzPVwibWRjLXNsaWRlcl9fdHJhY2stLWluYWN0aXZlXCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtZGMtc2xpZGVyX190cmFjay0tYWN0aXZlXCI+XG4gICAgPGRpdiAjdHJhY2tBY3RpdmUgY2xhc3M9XCJtZGMtc2xpZGVyX190cmFjay0tYWN0aXZlX2ZpbGxcIj48L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgKm5nSWY9XCJzaG93VGlja01hcmtzXCIgY2xhc3M9XCJtZGMtc2xpZGVyX190aWNrLW1hcmtzXCIgI3RpY2tNYXJrQ29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJfY2FjaGVkV2lkdGhcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0Zvcj1cImxldCB0aWNrTWFyayBvZiBfdGlja01hcmtzOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICBbY2xhc3NdPVwidGlja01hcmsgPT09IDAgPyAnbWRjLXNsaWRlcl9fdGljay1tYXJrLS1hY3RpdmUnIDogJ21kYy1zbGlkZXJfX3RpY2stbWFyay0taW5hY3RpdmUnXCJcbiAgICAgICAgICBbc3R5bGUudHJhbnNmb3JtXT1cIl9jYWxjVGlja01hcmtUcmFuc2Zvcm0oaSlcIj48L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPCEtLSBUaHVtYnMgLS0+XG48bWF0LXNsaWRlci12aXN1YWwtdGh1bWJcbiAgKm5nSWY9XCJfaXNSYW5nZVwiXG4gIFtkaXNjcmV0ZV09XCJkaXNjcmV0ZVwiXG4gIFt0aHVtYlBvc2l0aW9uXT1cIjFcIlxuICBbdmFsdWVJbmRpY2F0b3JUZXh0XT1cInN0YXJ0VmFsdWVJbmRpY2F0b3JUZXh0XCI+XG48L21hdC1zbGlkZXItdmlzdWFsLXRodW1iPlxuXG48bWF0LXNsaWRlci12aXN1YWwtdGh1bWJcbiAgW2Rpc2NyZXRlXT1cImRpc2NyZXRlXCJcbiAgW3RodW1iUG9zaXRpb25dPVwiMlwiXG4gIFt2YWx1ZUluZGljYXRvclRleHRdPVwiZW5kVmFsdWVJbmRpY2F0b3JUZXh0XCI+XG48L21hdC1zbGlkZXItdmlzdWFsLXRodW1iPlxuIl19