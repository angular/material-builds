(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/core'), require('tslib'), require('@angular/cdk/coercion'), require('@angular/cdk/platform'), require('@angular/platform-browser/animations')) :
    typeof define === 'function' && define.amd ? define('@angular/material/progress-spinner', ['exports', '@angular/core', '@angular/common', '@angular/material/core', 'tslib', '@angular/cdk/coercion', '@angular/cdk/platform', '@angular/platform-browser/animations'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.progressSpinner = {}), global.ng.core, global.ng.common, global.ng.material.core, global.tslib, global.ng.cdk.coercion, global.ng.cdk.platform, global.ng.platformBrowser.animations));
}(this, (function (exports, core, common, core$1, tslib, coercion, platform, animations) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Base reference size of the spinner.
     * @docs-private
     */
    var BASE_SIZE = 100;
    /**
     * Base reference stroke width of the spinner.
     * @docs-private
     */
    var BASE_STROKE_WIDTH = 10;
    // Boilerplate for applying mixins to MatProgressSpinner.
    /** @docs-private */
    var MatProgressSpinnerBase = /** @class */ (function () {
        function MatProgressSpinnerBase(_elementRef) {
            this._elementRef = _elementRef;
        }
        return MatProgressSpinnerBase;
    }());
    var _MatProgressSpinnerMixinBase = core$1.mixinColor(MatProgressSpinnerBase, 'primary');
    /** Injection token to be used to override the default options for `mat-progress-spinner`. */
    var MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS = new core.InjectionToken('mat-progress-spinner-default-options', {
        providedIn: 'root',
        factory: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY,
    });
    /** @docs-private */
    function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY() {
        return { diameter: BASE_SIZE };
    }
    // .0001 percentage difference is necessary in order to avoid unwanted animation frames
    // for example because the animation duration is 4 seconds, .1% accounts to 4ms
    // which are enough to see the flicker described in
    // https://github.com/angular/components/issues/8984
    var INDETERMINATE_ANIMATION_TEMPLATE = "\n @keyframes mat-progress-spinner-stroke-rotate-DIAMETER {\n    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }\n    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }\n    12.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }\n    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }\n\n    25.0001%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }\n    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }\n    37.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }\n    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }\n\n    50.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }\n    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }\n    62.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }\n    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }\n\n    75.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }\n    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }\n    87.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }\n    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }\n  }\n";
    /**
     * `<mat-progress-spinner>` component.
     */
    var MatProgressSpinner = /** @class */ (function (_super) {
        tslib.__extends(MatProgressSpinner, _super);
        function MatProgressSpinner(_elementRef, platform, _document, animationMode, defaults) {
            var _this = _super.call(this, _elementRef) || this;
            _this._elementRef = _elementRef;
            _this._document = _document;
            _this._diameter = BASE_SIZE;
            _this._value = 0;
            _this._fallbackAnimation = false;
            /** Mode of the progress circle */
            _this.mode = 'determinate';
            var trackedDiameters = MatProgressSpinner._diameters;
            // The base size is already inserted via the component's structural styles. We still
            // need to track it so we don't end up adding the same styles again.
            if (!trackedDiameters.has(_document.head)) {
                trackedDiameters.set(_document.head, new Set([BASE_SIZE]));
            }
            _this._fallbackAnimation = platform.EDGE || platform.TRIDENT;
            _this._noopAnimations = animationMode === 'NoopAnimations' &&
                (!!defaults && !defaults._forceAnimations);
            if (defaults) {
                if (defaults.diameter) {
                    _this.diameter = defaults.diameter;
                }
                if (defaults.strokeWidth) {
                    _this.strokeWidth = defaults.strokeWidth;
                }
            }
            return _this;
        }
        Object.defineProperty(MatProgressSpinner.prototype, "diameter", {
            /** The diameter of the progress spinner (will set width and height of svg). */
            get: function () { return this._diameter; },
            set: function (size) {
                this._diameter = coercion.coerceNumberProperty(size);
                // If this is set before `ngOnInit`, the style root may not have been resolved yet.
                if (!this._fallbackAnimation && this._styleRoot) {
                    this._attachStyleNode();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatProgressSpinner.prototype, "strokeWidth", {
            /** Stroke width of the progress spinner. */
            get: function () {
                return this._strokeWidth || this.diameter / 10;
            },
            set: function (value) {
                this._strokeWidth = coercion.coerceNumberProperty(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatProgressSpinner.prototype, "value", {
            /** Value of the progress circle. */
            get: function () {
                return this.mode === 'determinate' ? this._value : 0;
            },
            set: function (newValue) {
                this._value = Math.max(0, Math.min(100, coercion.coerceNumberProperty(newValue)));
            },
            enumerable: true,
            configurable: true
        });
        MatProgressSpinner.prototype.ngOnInit = function () {
            var element = this._elementRef.nativeElement;
            // Note that we need to look up the root node in ngOnInit, rather than the constructor, because
            // Angular seems to create the element outside the shadow root and then moves it inside, if the
            // node is inside an `ngIf` and a ShadowDom-encapsulated component.
            this._styleRoot = _getShadowRoot(element, this._document) || this._document.head;
            this._attachStyleNode();
            // On IE and Edge, we can't animate the `stroke-dashoffset`
            // reliably so we fall back to a non-spec animation.
            var animationClass = "mat-progress-spinner-indeterminate" + (this._fallbackAnimation ? '-fallback' : '') + "-animation";
            element.classList.add(animationClass);
        };
        Object.defineProperty(MatProgressSpinner.prototype, "_circleRadius", {
            /** The radius of the spinner, adjusted for stroke width. */
            get: function () {
                return (this.diameter - BASE_STROKE_WIDTH) / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatProgressSpinner.prototype, "_viewBox", {
            /** The view box of the spinner's svg element. */
            get: function () {
                var viewBox = this._circleRadius * 2 + this.strokeWidth;
                return "0 0 " + viewBox + " " + viewBox;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatProgressSpinner.prototype, "_strokeCircumference", {
            /** The stroke circumference of the svg circle. */
            get: function () {
                return 2 * Math.PI * this._circleRadius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatProgressSpinner.prototype, "_strokeDashOffset", {
            /** The dash offset of the svg circle. */
            get: function () {
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
            get: function () {
                return this.strokeWidth / this.diameter * 100;
            },
            enumerable: true,
            configurable: true
        });
        /** Dynamically generates a style tag containing the correct animation for this diameter. */
        MatProgressSpinner.prototype._attachStyleNode = function () {
            var styleRoot = this._styleRoot;
            var currentDiameter = this._diameter;
            var diameters = MatProgressSpinner._diameters;
            var diametersForElement = diameters.get(styleRoot);
            if (!diametersForElement || !diametersForElement.has(currentDiameter)) {
                var styleTag = this._document.createElement('style');
                styleTag.setAttribute('mat-spinner-animation', currentDiameter + '');
                styleTag.textContent = this._getAnimationText();
                styleRoot.appendChild(styleTag);
                if (!diametersForElement) {
                    diametersForElement = new Set();
                    diameters.set(styleRoot, diametersForElement);
                }
                diametersForElement.add(currentDiameter);
            }
        };
        /** Generates animation styles adjusted for the spinner's diameter. */
        MatProgressSpinner.prototype._getAnimationText = function () {
            return INDETERMINATE_ANIMATION_TEMPLATE
                // Animation should begin at 5% and end at 80%
                .replace(/START_VALUE/g, "" + 0.95 * this._strokeCircumference)
                .replace(/END_VALUE/g, "" + 0.2 * this._strokeCircumference)
                .replace(/DIAMETER/g, "" + this.diameter);
        };
        /**
         * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
         * We need to keep track of which elements the diameters were attached to, because for
         * elements in the Shadow DOM the style tags are attached to the shadow root, rather
         * than the document head.
         */
        MatProgressSpinner._diameters = new WeakMap();
        MatProgressSpinner.decorators = [
            { type: core.Component, args: [{
                        selector: 'mat-progress-spinner',
                        exportAs: 'matProgressSpinner',
                        host: {
                            'role': 'progressbar',
                            'class': 'mat-progress-spinner',
                            '[class._mat-animation-noopable]': "_noopAnimations",
                            '[style.width.px]': 'diameter',
                            '[style.height.px]': 'diameter',
                            '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
                            '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
                            '[attr.aria-valuenow]': 'mode === "determinate" ? value : null',
                            '[attr.mode]': 'mode',
                        },
                        inputs: ['color'],
                        template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG. `focusable=\"false\"` prevents IE from allowing the user to\n  tab into the SVG element.\n-->\n\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_viewBox\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\">\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + diameter\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n</svg>\n",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".mat-progress-spinner{display:block;position:relative}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transform-origin:center;transition:stroke-dashoffset 225ms linear}._mat-animation-noopable.mat-progress-spinner circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{animation:mat-progress-spinner-stroke-rotate-fallback 10000ms cubic-bezier(0.87, 0.03, 0.33, 1) infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition-property:stroke}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition:none;animation:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}@keyframes mat-progress-spinner-stroke-rotate-fallback{0%{transform:rotate(0deg)}25%{transform:rotate(1170deg)}50%{transform:rotate(2340deg)}75%{transform:rotate(3510deg)}100%{transform:rotate(4680deg)}}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatProgressSpinner.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: platform.Platform },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [common.DOCUMENT,] }] },
            { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [animations.ANIMATION_MODULE_TYPE,] }] },
            { type: undefined, decorators: [{ type: core.Inject, args: [MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,] }] }
        ]; };
        MatProgressSpinner.propDecorators = {
            diameter: [{ type: core.Input }],
            strokeWidth: [{ type: core.Input }],
            mode: [{ type: core.Input }],
            value: [{ type: core.Input }]
        };
        return MatProgressSpinner;
    }(_MatProgressSpinnerMixinBase));
    /**
     * `<mat-spinner>` component.
     *
     * This is a component definition to be used as a convenience reference to create an
     * indeterminate `<mat-progress-spinner>` instance.
     */
    var MatSpinner = /** @class */ (function (_super) {
        tslib.__extends(MatSpinner, _super);
        function MatSpinner(elementRef, platform, document, animationMode, defaults) {
            var _this = _super.call(this, elementRef, platform, document, animationMode, defaults) || this;
            _this.mode = 'indeterminate';
            return _this;
        }
        MatSpinner.decorators = [
            { type: core.Component, args: [{
                        selector: 'mat-spinner',
                        host: {
                            'role': 'progressbar',
                            'mode': 'indeterminate',
                            'class': 'mat-spinner mat-progress-spinner',
                            '[class._mat-animation-noopable]': "_noopAnimations",
                            '[style.width.px]': 'diameter',
                            '[style.height.px]': 'diameter',
                        },
                        inputs: ['color'],
                        template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG. `focusable=\"false\"` prevents IE from allowing the user to\n  tab into the SVG element.\n-->\n\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_viewBox\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\">\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + diameter\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_circleRadius\"\n    [style.stroke-dashoffset.px]=\"_strokeDashOffset\"\n    [style.stroke-dasharray.px]=\"_strokeCircumference\"\n    [style.stroke-width.%]=\"_circleStrokeWidth\"></circle>\n</svg>\n",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".mat-progress-spinner{display:block;position:relative}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transform-origin:center;transition:stroke-dashoffset 225ms linear}._mat-animation-noopable.mat-progress-spinner circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{animation:mat-progress-spinner-stroke-rotate-fallback 10000ms cubic-bezier(0.87, 0.03, 0.33, 1) infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition-property:stroke}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition:none;animation:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}@keyframes mat-progress-spinner-stroke-rotate-fallback{0%{transform:rotate(0deg)}25%{transform:rotate(1170deg)}50%{transform:rotate(2340deg)}75%{transform:rotate(3510deg)}100%{transform:rotate(4680deg)}}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatSpinner.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: platform.Platform },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [common.DOCUMENT,] }] },
            { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [animations.ANIMATION_MODULE_TYPE,] }] },
            { type: undefined, decorators: [{ type: core.Inject, args: [MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,] }] }
        ]; };
        return MatSpinner;
    }(MatProgressSpinner));
    /** Gets the shadow root of an element, if supported and the element is inside the Shadow DOM. */
    function _getShadowRoot(element, _document) {
        // TODO(crisbeto): see whether we should move this into the CDK
        // feature detection utilities once #15616 gets merged in.
        if (typeof window !== 'undefined') {
            var head = _document.head;
            // Check whether the browser supports Shadow DOM.
            if (head && (head.createShadowRoot || head.attachShadow)) {
                var rootNode = element.getRootNode ? element.getRootNode() : null;
                // We need to take the `ShadowRoot` off of `window`, because the built-in types are
                // incorrect. See https://github.com/Microsoft/TypeScript/issues/27929.
                if (rootNode instanceof window.ShadowRoot) {
                    return rootNode;
                }
            }
        }
        return null;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatProgressSpinnerModule = /** @class */ (function () {
        function MatProgressSpinnerModule() {
        }
        MatProgressSpinnerModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [core$1.MatCommonModule, common.CommonModule],
                        exports: [
                            MatProgressSpinner,
                            MatSpinner,
                            core$1.MatCommonModule
                        ],
                        declarations: [
                            MatProgressSpinner,
                            MatSpinner
                        ],
                    },] }
        ];
        return MatProgressSpinnerModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS = MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS;
    exports.MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY = MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY;
    exports.MatProgressSpinner = MatProgressSpinner;
    exports.MatProgressSpinnerModule = MatProgressSpinnerModule;
    exports.MatSpinner = MatSpinner;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-progress-spinner.umd.js.map
