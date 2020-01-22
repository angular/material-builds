/**
 * @fileoverview added by tsickle
 * Generated from: src/material/progress-spinner/progress-spinner.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, InjectionToken, Input, Optional, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Base reference size of the spinner.
 * \@docs-private
 * @type {?}
 */
const BASE_SIZE = 100;
/**
 * Base reference stroke width of the spinner.
 * \@docs-private
 * @type {?}
 */
const BASE_STROKE_WIDTH = 10;
// Boilerplate for applying mixins to MatProgressSpinner.
/**
 * \@docs-private
 */
class MatProgressSpinnerBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatProgressSpinnerBase.prototype._elementRef;
}
/** @type {?} */
const _MatProgressSpinnerMixinBase = mixinColor(MatProgressSpinnerBase, 'primary');
/**
 * Default `mat-progress-spinner` options that can be overridden.
 * @record
 */
export function MatProgressSpinnerDefaultOptions() { }
if (false) {
    /**
     * Diameter of the spinner.
     * @type {?|undefined}
     */
    MatProgressSpinnerDefaultOptions.prototype.diameter;
    /**
     * Width of the spinner's stroke.
     * @type {?|undefined}
     */
    MatProgressSpinnerDefaultOptions.prototype.strokeWidth;
    /**
     * Whether the animations should be force to be enabled, ignoring if the current environment is
     * using NoopAnimationsModule.
     * @type {?|undefined}
     */
    MatProgressSpinnerDefaultOptions.prototype._forceAnimations;
}
/**
 * Injection token to be used to override the default options for `mat-progress-spinner`.
 * @type {?}
 */
export const MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS = new InjectionToken('mat-progress-spinner-default-options', {
    providedIn: 'root',
    factory: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY,
});
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY() {
    return { diameter: BASE_SIZE };
}
// .0001 percentage difference is necessary in order to avoid unwanted animation frames
// for example because the animation duration is 4 seconds, .1% accounts to 4ms
// which are enough to see the flicker described in
// https://github.com/angular/components/issues/8984
/** @type {?} */
const INDETERMINATE_ANIMATION_TEMPLATE = `
 @keyframes mat-progress-spinner-stroke-rotate-DIAMETER {
    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }
    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }
    12.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }
    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }

    25.0001%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }
    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }
    37.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }
    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }

    50.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }
    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }
    62.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }
    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }

    75.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }
    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }
    87.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }
    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }
  }
`;
/**
 * `<mat-progress-spinner>` component.
 */
export class MatProgressSpinner extends _MatProgressSpinnerMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} platform
     * @param {?} _document
     * @param {?} animationMode
     * @param {?=} defaults
     */
    constructor(_elementRef, platform, _document, animationMode, defaults) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._document = _document;
        this._diameter = BASE_SIZE;
        this._value = 0;
        this._fallbackAnimation = false;
        /**
         * Mode of the progress circle
         */
        this.mode = 'determinate';
        /** @type {?} */
        const trackedDiameters = MatProgressSpinner._diameters;
        // The base size is already inserted via the component's structural styles. We still
        // need to track it so we don't end up adding the same styles again.
        if (!trackedDiameters.has(_document.head)) {
            trackedDiameters.set(_document.head, new Set([BASE_SIZE]));
        }
        this._fallbackAnimation = platform.EDGE || platform.TRIDENT;
        this._noopAnimations = animationMode === 'NoopAnimations' &&
            (!!defaults && !defaults._forceAnimations);
        if (defaults) {
            if (defaults.diameter) {
                this.diameter = defaults.diameter;
            }
            if (defaults.strokeWidth) {
                this.strokeWidth = defaults.strokeWidth;
            }
        }
    }
    /**
     * The diameter of the progress spinner (will set width and height of svg).
     * @return {?}
     */
    get diameter() { return this._diameter; }
    /**
     * @param {?} size
     * @return {?}
     */
    set diameter(size) {
        this._diameter = coerceNumberProperty(size);
        // If this is set before `ngOnInit`, the style root may not have been resolved yet.
        if (!this._fallbackAnimation && this._styleRoot) {
            this._attachStyleNode();
        }
    }
    /**
     * Stroke width of the progress spinner.
     * @return {?}
     */
    get strokeWidth() {
        return this._strokeWidth || this.diameter / 10;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set strokeWidth(value) {
        this._strokeWidth = coerceNumberProperty(value);
    }
    /**
     * Value of the progress circle.
     * @return {?}
     */
    get value() {
        return this.mode === 'determinate' ? this._value : 0;
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        this._value = Math.max(0, Math.min(100, coerceNumberProperty(newValue)));
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        // Note that we need to look up the root node in ngOnInit, rather than the constructor, because
        // Angular seems to create the element outside the shadow root and then moves it inside, if the
        // node is inside an `ngIf` and a ShadowDom-encapsulated component.
        this._styleRoot = _getShadowRoot(element, this._document) || this._document.head;
        this._attachStyleNode();
        // On IE and Edge, we can't animate the `stroke-dashoffset`
        // reliably so we fall back to a non-spec animation.
        /** @type {?} */
        const animationClass = `mat-progress-spinner-indeterminate${this._fallbackAnimation ? '-fallback' : ''}-animation`;
        element.classList.add(animationClass);
    }
    /**
     * The radius of the spinner, adjusted for stroke width.
     * @return {?}
     */
    get _circleRadius() {
        return (this.diameter - BASE_STROKE_WIDTH) / 2;
    }
    /**
     * The view box of the spinner's svg element.
     * @return {?}
     */
    get _viewBox() {
        /** @type {?} */
        const viewBox = this._circleRadius * 2 + this.strokeWidth;
        return `0 0 ${viewBox} ${viewBox}`;
    }
    /**
     * The stroke circumference of the svg circle.
     * @return {?}
     */
    get _strokeCircumference() {
        return 2 * Math.PI * this._circleRadius;
    }
    /**
     * The dash offset of the svg circle.
     * @return {?}
     */
    get _strokeDashOffset() {
        if (this.mode === 'determinate') {
            return this._strokeCircumference * (100 - this._value) / 100;
        }
        // In fallback mode set the circle to 80% and rotate it with CSS.
        if (this._fallbackAnimation && this.mode === 'indeterminate') {
            return this._strokeCircumference * 0.2;
        }
        return null;
    }
    /**
     * Stroke width of the circle in percent.
     * @return {?}
     */
    get _circleStrokeWidth() {
        return this.strokeWidth / this.diameter * 100;
    }
    /**
     * Dynamically generates a style tag containing the correct animation for this diameter.
     * @private
     * @return {?}
     */
    _attachStyleNode() {
        /** @type {?} */
        const styleRoot = this._styleRoot;
        /** @type {?} */
        const currentDiameter = this._diameter;
        /** @type {?} */
        const diameters = MatProgressSpinner._diameters;
        /** @type {?} */
        let diametersForElement = diameters.get(styleRoot);
        if (!diametersForElement || !diametersForElement.has(currentDiameter)) {
            /** @type {?} */
            const styleTag = this._document.createElement('style');
            styleTag.setAttribute('mat-spinner-animation', currentDiameter + '');
            styleTag.textContent = this._getAnimationText();
            styleRoot.appendChild(styleTag);
            if (!diametersForElement) {
                diametersForElement = new Set();
                diameters.set(styleRoot, diametersForElement);
            }
            diametersForElement.add(currentDiameter);
        }
    }
    /**
     * Generates animation styles adjusted for the spinner's diameter.
     * @private
     * @return {?}
     */
    _getAnimationText() {
        return INDETERMINATE_ANIMATION_TEMPLATE
            // Animation should begin at 5% and end at 80%
            .replace(/START_VALUE/g, `${0.95 * this._strokeCircumference}`)
            .replace(/END_VALUE/g, `${0.2 * this._strokeCircumference}`)
            .replace(/DIAMETER/g, `${this.diameter}`);
    }
}
/**
 * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
 * We need to keep track of which elements the diameters were attached to, because for
 * elements in the Shadow DOM the style tags are attached to the shadow root, rather
 * than the document head.
 */
MatProgressSpinner._diameters = new WeakMap();
MatProgressSpinner.decorators = [
    { type: Component, args: [{
                selector: 'mat-progress-spinner',
                exportAs: 'matProgressSpinner',
                host: {
                    'role': 'progressbar',
                    'class': 'mat-progress-spinner',
                    '[class._mat-animation-noopable]': `_noopAnimations`,
                    '[style.width.px]': 'diameter',
                    '[style.height.px]': 'diameter',
                    '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
                    '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
                    '[attr.aria-valuenow]': 'mode === "determinate" ? value : null',
                    '[attr.mode]': 'mode',
                },
                inputs: ['color'],
                template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG. `focusable=\"false\"` prevents IE from allowing the user to\n  tab into the SVG element.\n-->\n\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_viewBox\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\">\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + diameter\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n</svg>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-progress-spinner{display:block;position:relative}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transform-origin:center;transition:stroke-dashoffset 225ms linear}._mat-animation-noopable.mat-progress-spinner circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{animation:mat-progress-spinner-stroke-rotate-fallback 10000ms cubic-bezier(0.87, 0.03, 0.33, 1) infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition-property:stroke}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition:none;animation:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}@keyframes mat-progress-spinner-stroke-rotate-fallback{0%{transform:rotate(0deg)}25%{transform:rotate(1170deg)}50%{transform:rotate(2340deg)}75%{transform:rotate(3510deg)}100%{transform:rotate(4680deg)}}\n"]
            }] }
];
/** @nocollapse */
MatProgressSpinner.ctorParameters = () => [
    { type: ElementRef },
    { type: Platform },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,] }] }
];
MatProgressSpinner.propDecorators = {
    diameter: [{ type: Input }],
    strokeWidth: [{ type: Input }],
    mode: [{ type: Input }],
    value: [{ type: Input }]
};
if (false) {
    /**
     * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
     * We need to keep track of which elements the diameters were attached to, because for
     * elements in the Shadow DOM the style tags are attached to the shadow root, rather
     * than the document head.
     * @type {?}
     * @private
     */
    MatProgressSpinner._diameters;
    /** @type {?} */
    MatProgressSpinner.ngAcceptInputType_diameter;
    /** @type {?} */
    MatProgressSpinner.ngAcceptInputType_strokeWidth;
    /** @type {?} */
    MatProgressSpinner.ngAcceptInputType_value;
    /**
     * @type {?}
     * @private
     */
    MatProgressSpinner.prototype._diameter;
    /**
     * @type {?}
     * @private
     */
    MatProgressSpinner.prototype._value;
    /**
     * @type {?}
     * @private
     */
    MatProgressSpinner.prototype._strokeWidth;
    /**
     * @type {?}
     * @private
     */
    MatProgressSpinner.prototype._fallbackAnimation;
    /**
     * Element to which we should add the generated style tags for the indeterminate animation.
     * For most elements this is the document, but for the ones in the Shadow DOM we need to
     * use the shadow root.
     * @type {?}
     * @private
     */
    MatProgressSpinner.prototype._styleRoot;
    /**
     * Whether the _mat-animation-noopable class should be applied, disabling animations.
     * @type {?}
     */
    MatProgressSpinner.prototype._noopAnimations;
    /**
     * Mode of the progress circle
     * @type {?}
     */
    MatProgressSpinner.prototype.mode;
    /** @type {?} */
    MatProgressSpinner.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatProgressSpinner.prototype._document;
}
/**
 * `<mat-spinner>` component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate `<mat-progress-spinner>` instance.
 */
export class MatSpinner extends MatProgressSpinner {
    /**
     * @param {?} elementRef
     * @param {?} platform
     * @param {?} document
     * @param {?} animationMode
     * @param {?=} defaults
     */
    constructor(elementRef, platform, document, animationMode, defaults) {
        super(elementRef, platform, document, animationMode, defaults);
        this.mode = 'indeterminate';
    }
}
MatSpinner.decorators = [
    { type: Component, args: [{
                selector: 'mat-spinner',
                host: {
                    'role': 'progressbar',
                    'mode': 'indeterminate',
                    'class': 'mat-spinner mat-progress-spinner',
                    '[class._mat-animation-noopable]': `_noopAnimations`,
                    '[style.width.px]': 'diameter',
                    '[style.height.px]': 'diameter',
                },
                inputs: ['color'],
                template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG. `focusable=\"false\"` prevents IE from allowing the user to\n  tab into the SVG element.\n-->\n\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_viewBox\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\">\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + diameter\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n</svg>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-progress-spinner{display:block;position:relative}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transform-origin:center;transition:stroke-dashoffset 225ms linear}._mat-animation-noopable.mat-progress-spinner circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{animation:mat-progress-spinner-stroke-rotate-fallback 10000ms cubic-bezier(0.87, 0.03, 0.33, 1) infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition-property:stroke}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition:none;animation:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}@keyframes mat-progress-spinner-stroke-rotate-fallback{0%{transform:rotate(0deg)}25%{transform:rotate(1170deg)}50%{transform:rotate(2340deg)}75%{transform:rotate(3510deg)}100%{transform:rotate(4680deg)}}\n"]
            }] }
];
/** @nocollapse */
MatSpinner.ctorParameters = () => [
    { type: ElementRef },
    { type: Platform },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,] }] }
];
/**
 * Gets the shadow root of an element, if supported and the element is inside the Shadow DOM.
 * @param {?} element
 * @param {?} _document
 * @return {?}
 */
export function _getShadowRoot(element, _document) {
    // TODO(crisbeto): see whether we should move this into the CDK
    // feature detection utilities once #15616 gets merged in.
    if (typeof window !== 'undefined') {
        /** @type {?} */
        const head = _document.head;
        // Check whether the browser supports Shadow DOM.
        if (head && (((/** @type {?} */ (head))).createShadowRoot || head.attachShadow)) {
            /** @type {?} */
            const rootNode = element.getRootNode ? element.getRootNode() : null;
            // We need to take the `ShadowRoot` off of `window`, because the built-in types are
            // incorrect. See https://github.com/Microsoft/TypeScript/issues/27929.
            if (rootNode instanceof ((/** @type {?} */ (window))).ShadowRoot) {
                return rootNode;
            }
        }
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyL3Byb2dyZXNzLXNwaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsUUFBUSxFQUNSLGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXlCLFVBQVUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7TUFVckUsU0FBUyxHQUFHLEdBQUc7Ozs7OztNQU1mLGlCQUFpQixHQUFHLEVBQUU7Ozs7O0FBSTVCLE1BQU0sc0JBQXNCOzs7O0lBQzFCLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztDQUMvQzs7O0lBRGEsNkNBQThCOzs7TUFFdEMsNEJBQTRCLEdBQzlCLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxTQUFTLENBQUM7Ozs7O0FBR2pELHNEQVVDOzs7Ozs7SUFSQyxvREFBa0I7Ozs7O0lBRWxCLHVEQUFxQjs7Ozs7O0lBS3JCLDREQUEyQjs7Ozs7O0FBSTdCLE1BQU0sT0FBTyxvQ0FBb0MsR0FDN0MsSUFBSSxjQUFjLENBQW1DLHNDQUFzQyxFQUFFO0lBQzNGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSw0Q0FBNEM7Q0FDdEQsQ0FB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RyxTQUFTLENBQUMsSUFBSTtRQUUzQixpREFBaUQ7UUFDakQsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLG1CQUFBLElBQUksRUFBTyxDQUFDLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFOztrQkFDM0QsUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUVuRSxtRkFBbUY7WUFDbkYsdUVBQXVFO1lBQ3ZFLElBQUksUUFBUSxZQUFZLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUU7Z0JBQ2xELE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1NBQ0Y7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIENhbkNvbG9yQ3RvciwgbWl4aW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKiogUG9zc2libGUgbW9kZSBmb3IgYSBwcm9ncmVzcyBzcGlubmVyLiAqL1xuZXhwb3J0IHR5cGUgUHJvZ3Jlc3NTcGlubmVyTW9kZSA9ICdkZXRlcm1pbmF0ZScgfCAnaW5kZXRlcm1pbmF0ZSc7XG5cbi8qKlxuICogQmFzZSByZWZlcmVuY2Ugc2l6ZSBvZiB0aGUgc3Bpbm5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgQkFTRV9TSVpFID0gMTAwO1xuXG4vKipcbiAqIEJhc2UgcmVmZXJlbmNlIHN0cm9rZSB3aWR0aCBvZiB0aGUgc3Bpbm5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgQkFTRV9TVFJPS0VfV0lEVEggPSAxMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRQcm9ncmVzc1NwaW5uZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVyQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRQcm9ncmVzc1NwaW5uZXJNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXRQcm9ncmVzc1NwaW5uZXJCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdFByb2dyZXNzU3Bpbm5lckJhc2UsICdwcmltYXJ5Jyk7XG5cbi8qKiBEZWZhdWx0IGBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcmAgb3B0aW9ucyB0aGF0IGNhbiBiZSBvdmVycmlkZGVuLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQcm9ncmVzc1NwaW5uZXJEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBEaWFtZXRlciBvZiB0aGUgc3Bpbm5lci4gKi9cbiAgZGlhbWV0ZXI/OiBudW1iZXI7XG4gIC8qKiBXaWR0aCBvZiB0aGUgc3Bpbm5lcidzIHN0cm9rZS4gKi9cbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhbmltYXRpb25zIHNob3VsZCBiZSBmb3JjZSB0byBiZSBlbmFibGVkLCBpZ25vcmluZyBpZiB0aGUgY3VycmVudCBlbnZpcm9ubWVudCBpc1xuICAgKiB1c2luZyBOb29wQW5pbWF0aW9uc01vZHVsZS5cbiAgICovXG4gIF9mb3JjZUFuaW1hdGlvbnM/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1wcm9ncmVzcy1zcGlubmVyYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRQcm9ncmVzc1NwaW5uZXJEZWZhdWx0T3B0aW9ucz4oJ21hdC1wcm9ncmVzcy1zcGlubmVyLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9QUk9HUkVTU19TUElOTkVSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9QUk9HUkVTU19TUElOTkVSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtkaWFtZXRlcjogQkFTRV9TSVpFfTtcbn1cblxuLy8gLjAwMDEgcGVyY2VudGFnZSBkaWZmZXJlbmNlIGlzIG5lY2Vzc2FyeSBpbiBvcmRlciB0byBhdm9pZCB1bndhbnRlZCBhbmltYXRpb24gZnJhbWVzXG4vLyBmb3IgZXhhbXBsZSBiZWNhdXNlIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaXMgNCBzZWNvbmRzLCAuMSUgYWNjb3VudHMgdG8gNG1zXG4vLyB3aGljaCBhcmUgZW5vdWdoIHRvIHNlZSB0aGUgZmxpY2tlciBkZXNjcmliZWQgaW5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzg5ODRcbmNvbnN0IElOREVURVJNSU5BVEVfQU5JTUFUSU9OX1RFTVBMQVRFID0gYFxuIEBrZXlmcmFtZXMgbWF0LXByb2dyZXNzLXNwaW5uZXItc3Ryb2tlLXJvdGF0ZS1ESUFNRVRFUiB7XG4gICAgMCUgICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDApOyB9XG4gICAgMTIuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDApOyB9XG4gICAgMTIuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDcyLjVkZWcpOyB9XG4gICAgMjUlICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSg3Mi41ZGVnKTsgfVxuXG4gICAgMjUuMDAwMSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDI3MGRlZyk7IH1cbiAgICAzNy41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoMjcwZGVnKTsgfVxuICAgIDM3LjUwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgxNjEuNWRlZyk7IH1cbiAgICA1MCUgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDE2MS41ZGVnKTsgfVxuXG4gICAgNTAuMDAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTsgfVxuICAgIDYyLjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpOyB9XG4gICAgNjIuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDI1MS41ZGVnKTsgfVxuICAgIDc1JSAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMjUxLjVkZWcpOyB9XG5cbiAgICA3NS4wMDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7IH1cbiAgICA4Ny41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpOyB9XG4gICAgODcuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDM0MS41ZGVnKTsgfVxuICAgIDEwMCUgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMzQxLjVkZWcpOyB9XG4gIH1cbmA7XG5cbi8qKlxuICogYDxtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcj5gIGNvbXBvbmVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXByb2dyZXNzLXNwaW5uZXInLFxuICBleHBvcnRBczogJ21hdFByb2dyZXNzU3Bpbm5lcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdwcm9ncmVzc2JhcicsXG4gICAgJ2NsYXNzJzogJ21hdC1wcm9ncmVzcy1zcGlubmVyJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6IGBfbm9vcEFuaW1hdGlvbnNgLFxuICAgICdbc3R5bGUud2lkdGgucHhdJzogJ2RpYW1ldGVyJyxcbiAgICAnW3N0eWxlLmhlaWdodC5weF0nOiAnZGlhbWV0ZXInLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyAwIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVtYXhdJzogJ21vZGUgPT09IFwiZGV0ZXJtaW5hdGVcIiA/IDEwMCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyB2YWx1ZSA6IG51bGwnLFxuICAgICdbYXR0ci5tb2RlXSc6ICdtb2RlJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIHRlbXBsYXRlVXJsOiAncHJvZ3Jlc3Mtc3Bpbm5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Byb2dyZXNzLXNwaW5uZXIuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQcm9ncmVzc1NwaW5uZXIgZXh0ZW5kcyBfTWF0UHJvZ3Jlc3NTcGlubmVyTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LCBDYW5Db2xvciB7XG4gIHByaXZhdGUgX2RpYW1ldGVyID0gQkFTRV9TSVpFO1xuICBwcml2YXRlIF92YWx1ZSA9IDA7XG4gIHByaXZhdGUgX3N0cm9rZVdpZHRoOiBudW1iZXI7XG4gIHByaXZhdGUgX2ZhbGxiYWNrQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVsZW1lbnQgdG8gd2hpY2ggd2Ugc2hvdWxkIGFkZCB0aGUgZ2VuZXJhdGVkIHN0eWxlIHRhZ3MgZm9yIHRoZSBpbmRldGVybWluYXRlIGFuaW1hdGlvbi5cbiAgICogRm9yIG1vc3QgZWxlbWVudHMgdGhpcyBpcyB0aGUgZG9jdW1lbnQsIGJ1dCBmb3IgdGhlIG9uZXMgaW4gdGhlIFNoYWRvdyBET00gd2UgbmVlZCB0b1xuICAgKiB1c2UgdGhlIHNoYWRvdyByb290LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3R5bGVSb290OiBOb2RlO1xuXG4gIC8qKlxuICAgKiBUcmFja3MgZGlhbWV0ZXJzIG9mIGV4aXN0aW5nIGluc3RhbmNlcyB0byBkZS1kdXBlIGdlbmVyYXRlZCBzdHlsZXMgKGRlZmF1bHQgZCA9IDEwMCkuXG4gICAqIFdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiB3aGljaCBlbGVtZW50cyB0aGUgZGlhbWV0ZXJzIHdlcmUgYXR0YWNoZWQgdG8sIGJlY2F1c2UgZm9yXG4gICAqIGVsZW1lbnRzIGluIHRoZSBTaGFkb3cgRE9NIHRoZSBzdHlsZSB0YWdzIGFyZSBhdHRhY2hlZCB0byB0aGUgc2hhZG93IHJvb3QsIHJhdGhlclxuICAgKiB0aGFuIHRoZSBkb2N1bWVudCBoZWFkLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX2RpYW1ldGVycyA9IG5ldyBXZWFrTWFwPE5vZGUsIFNldDxudW1iZXI+PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBfbWF0LWFuaW1hdGlvbi1ub29wYWJsZSBjbGFzcyBzaG91bGQgYmUgYXBwbGllZCwgZGlzYWJsaW5nIGFuaW1hdGlvbnMuICAqL1xuICBfbm9vcEFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBkaWFtZXRlciBvZiB0aGUgcHJvZ3Jlc3Mgc3Bpbm5lciAod2lsbCBzZXQgd2lkdGggYW5kIGhlaWdodCBvZiBzdmcpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlhbWV0ZXIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2RpYW1ldGVyOyB9XG4gIHNldCBkaWFtZXRlcihzaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9kaWFtZXRlciA9IGNvZXJjZU51bWJlclByb3BlcnR5KHNpemUpO1xuXG4gICAgLy8gSWYgdGhpcyBpcyBzZXQgYmVmb3JlIGBuZ09uSW5pdGAsIHRoZSBzdHlsZSByb290IG1heSBub3QgaGF2ZSBiZWVuIHJlc29sdmVkIHlldC5cbiAgICBpZiAoIXRoaXMuX2ZhbGxiYWNrQW5pbWF0aW9uICYmIHRoaXMuX3N0eWxlUm9vdCkge1xuICAgICAgdGhpcy5fYXR0YWNoU3R5bGVOb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN0cm9rZSB3aWR0aCBvZiB0aGUgcHJvZ3Jlc3Mgc3Bpbm5lci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0cm9rZVdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cm9rZVdpZHRoIHx8IHRoaXMuZGlhbWV0ZXIgLyAxMDtcbiAgfVxuICBzZXQgc3Ryb2tlV2lkdGgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3N0cm9rZVdpZHRoID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIE1vZGUgb2YgdGhlIHByb2dyZXNzIGNpcmNsZSAqL1xuICBASW5wdXQoKSBtb2RlOiBQcm9ncmVzc1NwaW5uZXJNb2RlID0gJ2RldGVybWluYXRlJztcblxuICAvKiogVmFsdWUgb2YgdGhlIHByb2dyZXNzIGNpcmNsZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gJ2RldGVybWluYXRlJyA/IHRoaXMuX3ZhbHVlIDogMDtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3ZhbHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBjb2VyY2VOdW1iZXJQcm9wZXJ0eShuZXdWYWx1ZSkpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU6IHN0cmluZyxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0cz86IE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zKSB7XG5cbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICBjb25zdCB0cmFja2VkRGlhbWV0ZXJzID0gTWF0UHJvZ3Jlc3NTcGlubmVyLl9kaWFtZXRlcnM7XG5cbiAgICAvLyBUaGUgYmFzZSBzaXplIGlzIGFscmVhZHkgaW5zZXJ0ZWQgdmlhIHRoZSBjb21wb25lbnQncyBzdHJ1Y3R1cmFsIHN0eWxlcy4gV2Ugc3RpbGxcbiAgICAvLyBuZWVkIHRvIHRyYWNrIGl0IHNvIHdlIGRvbid0IGVuZCB1cCBhZGRpbmcgdGhlIHNhbWUgc3R5bGVzIGFnYWluLlxuICAgIGlmICghdHJhY2tlZERpYW1ldGVycy5oYXMoX2RvY3VtZW50LmhlYWQpKSB7XG4gICAgICB0cmFja2VkRGlhbWV0ZXJzLnNldChfZG9jdW1lbnQuaGVhZCwgbmV3IFNldDxudW1iZXI+KFtCQVNFX1NJWkVdKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZmFsbGJhY2tBbmltYXRpb24gPSBwbGF0Zm9ybS5FREdFIHx8IHBsYXRmb3JtLlRSSURFTlQ7XG4gICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnICYmXG4gICAgICAgICghIWRlZmF1bHRzICYmICFkZWZhdWx0cy5fZm9yY2VBbmltYXRpb25zKTtcblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmRpYW1ldGVyKSB7XG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBkZWZhdWx0cy5kaWFtZXRlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLnN0cm9rZVdpZHRoKSB7XG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSBkZWZhdWx0cy5zdHJva2VXaWR0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gbG9vayB1cCB0aGUgcm9vdCBub2RlIGluIG5nT25Jbml0LCByYXRoZXIgdGhhbiB0aGUgY29uc3RydWN0b3IsIGJlY2F1c2VcbiAgICAvLyBBbmd1bGFyIHNlZW1zIHRvIGNyZWF0ZSB0aGUgZWxlbWVudCBvdXRzaWRlIHRoZSBzaGFkb3cgcm9vdCBhbmQgdGhlbiBtb3ZlcyBpdCBpbnNpZGUsIGlmIHRoZVxuICAgIC8vIG5vZGUgaXMgaW5zaWRlIGFuIGBuZ0lmYCBhbmQgYSBTaGFkb3dEb20tZW5jYXBzdWxhdGVkIGNvbXBvbmVudC5cbiAgICB0aGlzLl9zdHlsZVJvb3QgPSBfZ2V0U2hhZG93Um9vdChlbGVtZW50LCB0aGlzLl9kb2N1bWVudCkgfHwgdGhpcy5fZG9jdW1lbnQuaGVhZDtcbiAgICB0aGlzLl9hdHRhY2hTdHlsZU5vZGUoKTtcblxuICAgIC8vIE9uIElFIGFuZCBFZGdlLCB3ZSBjYW4ndCBhbmltYXRlIHRoZSBgc3Ryb2tlLWRhc2hvZmZzZXRgXG4gICAgLy8gcmVsaWFibHkgc28gd2UgZmFsbCBiYWNrIHRvIGEgbm9uLXNwZWMgYW5pbWF0aW9uLlxuICAgIGNvbnN0IGFuaW1hdGlvbkNsYXNzID1cbiAgICAgIGBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1pbmRldGVybWluYXRlJHt0aGlzLl9mYWxsYmFja0FuaW1hdGlvbiA/ICctZmFsbGJhY2snIDogJyd9LWFuaW1hdGlvbmA7XG5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uQ2xhc3MpO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIHNwaW5uZXIsIGFkanVzdGVkIGZvciBzdHJva2Ugd2lkdGguICovXG4gIGdldCBfY2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAodGhpcy5kaWFtZXRlciAtIEJBU0VfU1RST0tFX1dJRFRIKSAvIDI7XG4gIH1cblxuICAvKiogVGhlIHZpZXcgYm94IG9mIHRoZSBzcGlubmVyJ3Mgc3ZnIGVsZW1lbnQuICovXG4gIGdldCBfdmlld0JveCgpIHtcbiAgICBjb25zdCB2aWV3Qm94ID0gdGhpcy5fY2lyY2xlUmFkaXVzICogMiArIHRoaXMuc3Ryb2tlV2lkdGg7XG4gICAgcmV0dXJuIGAwIDAgJHt2aWV3Qm94fSAke3ZpZXdCb3h9YDtcbiAgfVxuXG4gIC8qKiBUaGUgc3Ryb2tlIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIGdldCBfc3Ryb2tlQ2lyY3VtZmVyZW5jZSgpOiBudW1iZXIge1xuICAgIHJldHVybiAyICogTWF0aC5QSSAqIHRoaXMuX2NpcmNsZVJhZGl1cztcbiAgfVxuXG4gIC8qKiBUaGUgZGFzaCBvZmZzZXQgb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIGdldCBfc3Ryb2tlRGFzaE9mZnNldCgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3Ryb2tlQ2lyY3VtZmVyZW5jZSAqICgxMDAgLSB0aGlzLl92YWx1ZSkgLyAxMDA7XG4gICAgfVxuXG4gICAgLy8gSW4gZmFsbGJhY2sgbW9kZSBzZXQgdGhlIGNpcmNsZSB0byA4MCUgYW5kIHJvdGF0ZSBpdCB3aXRoIENTUy5cbiAgICBpZiAodGhpcy5fZmFsbGJhY2tBbmltYXRpb24gJiYgdGhpcy5tb2RlID09PSAnaW5kZXRlcm1pbmF0ZScpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdHJva2VDaXJjdW1mZXJlbmNlICogMC4yO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cm9rZSB3aWR0aCBvZiB0aGUgY2lyY2xlIGluIHBlcmNlbnQuICovXG4gIGdldCBfY2lyY2xlU3Ryb2tlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3Ryb2tlV2lkdGggLyB0aGlzLmRpYW1ldGVyICogMTAwO1xuICB9XG5cbiAgLyoqIER5bmFtaWNhbGx5IGdlbmVyYXRlcyBhIHN0eWxlIHRhZyBjb250YWluaW5nIHRoZSBjb3JyZWN0IGFuaW1hdGlvbiBmb3IgdGhpcyBkaWFtZXRlci4gKi9cbiAgcHJpdmF0ZSBfYXR0YWNoU3R5bGVOb2RlKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0eWxlUm9vdCA9IHRoaXMuX3N0eWxlUm9vdDtcbiAgICBjb25zdCBjdXJyZW50RGlhbWV0ZXIgPSB0aGlzLl9kaWFtZXRlcjtcbiAgICBjb25zdCBkaWFtZXRlcnMgPSBNYXRQcm9ncmVzc1NwaW5uZXIuX2RpYW1ldGVycztcbiAgICBsZXQgZGlhbWV0ZXJzRm9yRWxlbWVudCA9IGRpYW1ldGVycy5nZXQoc3R5bGVSb290KTtcblxuICAgIGlmICghZGlhbWV0ZXJzRm9yRWxlbWVudCB8fCAhZGlhbWV0ZXJzRm9yRWxlbWVudC5oYXMoY3VycmVudERpYW1ldGVyKSkge1xuICAgICAgY29uc3Qgc3R5bGVUYWc6IEhUTUxTdHlsZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGVUYWcuc2V0QXR0cmlidXRlKCdtYXQtc3Bpbm5lci1hbmltYXRpb24nLCBjdXJyZW50RGlhbWV0ZXIgKyAnJyk7XG4gICAgICBzdHlsZVRhZy50ZXh0Q29udGVudCA9IHRoaXMuX2dldEFuaW1hdGlvblRleHQoKTtcbiAgICAgIHN0eWxlUm9vdC5hcHBlbmRDaGlsZChzdHlsZVRhZyk7XG5cbiAgICAgIGlmICghZGlhbWV0ZXJzRm9yRWxlbWVudCkge1xuICAgICAgICBkaWFtZXRlcnNGb3JFbGVtZW50ID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgICAgIGRpYW1ldGVycy5zZXQoc3R5bGVSb290LCBkaWFtZXRlcnNGb3JFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgZGlhbWV0ZXJzRm9yRWxlbWVudC5hZGQoY3VycmVudERpYW1ldGVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2VuZXJhdGVzIGFuaW1hdGlvbiBzdHlsZXMgYWRqdXN0ZWQgZm9yIHRoZSBzcGlubmVyJ3MgZGlhbWV0ZXIuICovXG4gIHByaXZhdGUgX2dldEFuaW1hdGlvblRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSU5ERVRFUk1JTkFURV9BTklNQVRJT05fVEVNUExBVEVcbiAgICAgICAgLy8gQW5pbWF0aW9uIHNob3VsZCBiZWdpbiBhdCA1JSBhbmQgZW5kIGF0IDgwJVxuICAgICAgICAucmVwbGFjZSgvU1RBUlRfVkFMVUUvZywgYCR7MC45NSAqIHRoaXMuX3N0cm9rZUNpcmN1bWZlcmVuY2V9YClcbiAgICAgICAgLnJlcGxhY2UoL0VORF9WQUxVRS9nLCBgJHswLjIgKiB0aGlzLl9zdHJva2VDaXJjdW1mZXJlbmNlfWApXG4gICAgICAgIC5yZXBsYWNlKC9ESUFNRVRFUi9nLCBgJHt0aGlzLmRpYW1ldGVyfWApO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2RpYW1ldGVyOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0cm9rZVdpZHRoOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBOdW1iZXJJbnB1dDtcbn1cblxuXG4vKipcbiAqIGA8bWF0LXNwaW5uZXI+YCBjb21wb25lbnQuXG4gKlxuICogVGhpcyBpcyBhIGNvbXBvbmVudCBkZWZpbml0aW9uIHRvIGJlIHVzZWQgYXMgYSBjb252ZW5pZW5jZSByZWZlcmVuY2UgdG8gY3JlYXRlIGFuXG4gKiBpbmRldGVybWluYXRlIGA8bWF0LXByb2dyZXNzLXNwaW5uZXI+YCBpbnN0YW5jZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNwaW5uZXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAncHJvZ3Jlc3NiYXInLFxuICAgICdtb2RlJzogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICdjbGFzcyc6ICdtYXQtc3Bpbm5lciBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX25vb3BBbmltYXRpb25zYCxcbiAgICAnW3N0eWxlLndpZHRoLnB4XSc6ICdkaWFtZXRlcicsXG4gICAgJ1tzdHlsZS5oZWlnaHQucHhdJzogJ2RpYW1ldGVyJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIHRlbXBsYXRlVXJsOiAncHJvZ3Jlc3Mtc3Bpbm5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Byb2dyZXNzLXNwaW5uZXIuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTcGlubmVyIGV4dGVuZHMgTWF0UHJvZ3Jlc3NTcGlubmVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU6IHN0cmluZyxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0cz86IE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgcGxhdGZvcm0sIGRvY3VtZW50LCBhbmltYXRpb25Nb2RlLCBkZWZhdWx0cyk7XG4gICAgdGhpcy5tb2RlID0gJ2luZGV0ZXJtaW5hdGUnO1xuICB9XG59XG5cblxuLyoqIEdldHMgdGhlIHNoYWRvdyByb290IG9mIGFuIGVsZW1lbnQsIGlmIHN1cHBvcnRlZCBhbmQgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSBTaGFkb3cgRE9NLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9nZXRTaGFkb3dSb290KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfZG9jdW1lbnQ6IERvY3VtZW50KTogTm9kZSB8IG51bGwge1xuICAvLyBUT0RPKGNyaXNiZXRvKTogc2VlIHdoZXRoZXIgd2Ugc2hvdWxkIG1vdmUgdGhpcyBpbnRvIHRoZSBDREtcbiAgLy8gZmVhdHVyZSBkZXRlY3Rpb24gdXRpbGl0aWVzIG9uY2UgIzE1NjE2IGdldHMgbWVyZ2VkIGluLlxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zdCBoZWFkID0gX2RvY3VtZW50LmhlYWQ7XG5cbiAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBicm93c2VyIHN1cHBvcnRzIFNoYWRvdyBET00uXG4gICAgaWYgKGhlYWQgJiYgKChoZWFkIGFzIGFueSkuY3JlYXRlU2hhZG93Um9vdCB8fCBoZWFkLmF0dGFjaFNoYWRvdykpIHtcbiAgICAgIGNvbnN0IHJvb3ROb2RlID0gZWxlbWVudC5nZXRSb290Tm9kZSA/IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKSA6IG51bGw7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gdGFrZSB0aGUgYFNoYWRvd1Jvb3RgIG9mZiBvZiBgd2luZG93YCwgYmVjYXVzZSB0aGUgYnVpbHQtaW4gdHlwZXMgYXJlXG4gICAgICAvLyBpbmNvcnJlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI3OTI5LlxuICAgICAgaWYgKHJvb3ROb2RlIGluc3RhbmNlb2YgKHdpbmRvdyBhcyBhbnkpLlNoYWRvd1Jvb3QpIHtcbiAgICAgICAgcmV0dXJuIHJvb3ROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIl19