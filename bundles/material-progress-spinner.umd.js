/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/platform'), require('@angular/material/core'), require('@angular/common'), require('@angular/cdk/coercion')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/cdk/platform', '@angular/material/core', '@angular/common', '@angular/cdk/coercion'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material['progress-spinner'] = global.ng.material['progress-spinner'] || {}),global.ng.core,global.ng.cdk.platform,global.ng.material.core,global.ng.common,global.ng.cdk.coercion));
}(this, (function (exports,_angular_core,_angular_cdk_platform,_angular_material_core,_angular_common,_angular_cdk_coercion) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Base reference stroke width of the spinner.
 * \@docs-private
 */
var BASE_STROKE_WIDTH = 10;
/**
 * \@docs-private
 */
var MatProgressSpinnerBase = /** @class */ (function () {
    function MatProgressSpinnerBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatProgressSpinnerBase;
}());
var _MatProgressSpinnerMixinBase = _angular_material_core.mixinColor(MatProgressSpinnerBase, 'primary');
var INDETERMINATE_ANIMATION_TEMPLATE = "\n @keyframes mat-progress-spinner-stroke-rotate-DIAMETER {\n    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }\n    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }\n    12.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }\n    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }\n\n    25.1%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }\n    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }\n    37.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }\n    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }\n\n    50.01%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }\n    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }\n    62.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }\n    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }\n\n    75.01%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }\n    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }\n    87.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }\n    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }\n  }\n";
/**
 * <mat-progress-spinner> component.
 */
var MatProgressSpinner = /** @class */ (function (_super) {
    __extends(MatProgressSpinner, _super);
    function MatProgressSpinner(_renderer, _elementRef, platform, _document) {
        var _this = _super.call(this, _renderer, _elementRef) || this;
        _this._renderer = _renderer;
        _this._elementRef = _elementRef;
        _this._document = _document;
        _this._fallbackAnimation = platform.EDGE || platform.TRIDENT;
        // On IE and Edge, we can't animate the `stroke-dashoffset`
        // reliably so we fall back to a non-spec animation.
        var /** @type {?} */ animationClass = "mat-progress-spinner-indeterminate" + (_this._fallbackAnimation ? '-fallback' : '') + "-animation";
        _renderer.addClass(_elementRef.nativeElement, animationClass);
        return _this;
    }
    Object.defineProperty(MatProgressSpinner.prototype, "diameter", {
        get: /**
         * The diameter of the progress spinner (will set width and height of svg).
         * @return {?}
         */
        function () {
            return this._diameter;
        },
        set: /**
         * @param {?} size
         * @return {?}
         */
        function (size) {
            this._diameter = _angular_cdk_coercion.coerceNumberProperty(size);
            if (!this._fallbackAnimation && !MatProgressSpinner.diameters.has(this._diameter)) {
                this._attachStyleNode();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "strokeWidth", {
        get: /**
         * Stroke width of the progress spinner.
         * @return {?}
         */
        function () {
            return this._strokeWidth || this.diameter / 10;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._strokeWidth = _angular_cdk_coercion.coerceNumberProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "value", {
        get: /**
         * Value of the progress circle.
         * @return {?}
         */
        function () {
            return this.mode === 'determinate' ? this._value : 0;
        },
        set: /**
         * @param {?} newValue
         * @return {?}
         */
        function (newValue) {
            if (newValue != null && this.mode === 'determinate') {
                this._value = Math.max(0, Math.min(100, _angular_cdk_coercion.coerceNumberProperty(newValue)));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MatProgressSpinner.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes["strokeWidth"] || changes["diameter"]) {
            this._elementSize = this._diameter + Math.max(this.strokeWidth - BASE_STROKE_WIDTH, 0);
        }
    };
    Object.defineProperty(MatProgressSpinner.prototype, "_circleRadius", {
        /** The radius of the spinner, adjusted for stroke width. */
        get: /**
         * The radius of the spinner, adjusted for stroke width.
         * @return {?}
         */
        function () {
            return (this.diameter - BASE_STROKE_WIDTH) / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_viewBox", {
        /** The view box of the spinner's svg element. */
        get: /**
         * The view box of the spinner's svg element.
         * @return {?}
         */
        function () {
            var /** @type {?} */ viewBox = this._circleRadius * 2 + this.strokeWidth;
            return "0 0 " + viewBox + " " + viewBox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_strokeCircumference", {
        /** The stroke circumference of the svg circle. */
        get: /**
         * The stroke circumference of the svg circle.
         * @return {?}
         */
        function () {
            return 2 * Math.PI * this._circleRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_strokeDashOffset", {
        /** The dash offset of the svg circle. */
        get: /**
         * The dash offset of the svg circle.
         * @return {?}
         */
        function () {
            if (this.mode === 'determinate') {
                return this._strokeCircumference * (100 - this._value) / 100;
            }
            // In fallback mode set the circle to 80% and rotate it with CSS.
            if (this._fallbackAnimation && this.mode === 'indeterminate') {
                return this._strokeCircumference * 0.2;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_circleStrokeWidth", {
        /** Stroke width of the circle in percent. */
        get: /**
         * Stroke width of the circle in percent.
         * @return {?}
         */
        function () {
            return this.strokeWidth / this._elementSize * 100;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dynamically generates a style tag containing the correct animation for this diameter.
     * @return {?}
     */
    MatProgressSpinner.prototype._attachStyleNode = /**
     * Dynamically generates a style tag containing the correct animation for this diameter.
     * @return {?}
     */
    function () {
        var /** @type {?} */ styleTag = MatProgressSpinner.styleTag;
        if (!styleTag) {
            styleTag = this._renderer.createElement('style');
            this._renderer.appendChild(this._document.head, styleTag);
            MatProgressSpinner.styleTag = styleTag;
        }
        if (styleTag && styleTag.sheet) {
            (/** @type {?} */ (styleTag.sheet)).insertRule(this._getAnimationText(), 0);
        }
        MatProgressSpinner.diameters.add(this.diameter);
    };
    /**
     * Generates animation styles adjusted for the spinner's diameter.
     * @return {?}
     */
    MatProgressSpinner.prototype._getAnimationText = /**
     * Generates animation styles adjusted for the spinner's diameter.
     * @return {?}
     */
    function () {
        return INDETERMINATE_ANIMATION_TEMPLATE
            .replace(/START_VALUE/g, "" + 0.95 * this._strokeCircumference)
            .replace(/END_VALUE/g, "" + 0.2 * this._strokeCircumference)
            .replace(/DIAMETER/g, "" + this.diameter);
    };
    return MatProgressSpinner;
}(_MatProgressSpinnerMixinBase));
/**
 * <mat-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <mat-progress-spinner> instance.
 */
var MatSpinner = /** @class */ (function (_super) {
    __extends(MatSpinner, _super);
    function MatSpinner(renderer, elementRef, platform, document) {
        var _this = _super.call(this, renderer, elementRef, platform, document) || this;
        _this.mode = 'indeterminate';
        return _this;
    }
    return MatSpinner;
}(MatProgressSpinner));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatProgressSpinnerModule = /** @class */ (function () {
    function MatProgressSpinnerModule() {
    }
    return MatProgressSpinnerModule;
}());

exports.MatProgressSpinnerModule = MatProgressSpinnerModule;
exports.MatProgressSpinnerBase = MatProgressSpinnerBase;
exports._MatProgressSpinnerMixinBase = _MatProgressSpinnerMixinBase;
exports.MatProgressSpinner = MatProgressSpinner;
exports.MatSpinner = MatSpinner;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-progress-spinner.umd.js.map
