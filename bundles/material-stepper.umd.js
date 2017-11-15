/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/a11y'), require('@angular/cdk/portal'), require('@angular/cdk/stepper'), require('@angular/common'), require('@angular/core'), require('@angular/material/button'), require('@angular/material/core'), require('@angular/material/icon'), require('@angular/cdk/coercion'), require('rxjs/Subject'), require('@angular/animations')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/cdk/a11y', '@angular/cdk/portal', '@angular/cdk/stepper', '@angular/common', '@angular/core', '@angular/material/button', '@angular/material/core', '@angular/material/icon', '@angular/cdk/coercion', 'rxjs/Subject', '@angular/animations'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.stepper = global.ng.material.stepper || {}),global.ng.cdk.a11y,global.ng.cdk.portal,global.ng.cdk.stepper,global.ng.common,global.ng.core,global.ng.material.button,global.ng.material.core,global.ng.material.icon,global.ng.cdk.coercion));
}(this, (function (exports,_angular_cdk_a11y,_angular_cdk_portal,_angular_cdk_stepper,_angular_common,_angular_core,_angular_material_button,_angular_material_core,_angular_material_icon,_angular_cdk_coercion) { 'use strict';

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
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStepLabel = _angular_cdk_stepper.CdkStepLabel;
var MatStepLabel = /** @class */ (function (_super) {
    __extends(MatStepLabel, _super);
    function MatStepLabel(template) {
        return _super.call(this, template) || this;
    }
    return MatStepLabel;
}(_MatStepLabel));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Stepper data that is required for internationalization.
 */
var MatStepperIntl = /** @class */ (function () {
    function MatStepperIntl() {
    }
    return MatStepperIntl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatStepHeader = /** @class */ (function () {
    function MatStepHeader(_intl, _focusMonitor, _element, changeDetectorRef) {
        this._intl = _intl;
        this._focusMonitor = _focusMonitor;
        this._element = _element;
        _focusMonitor.monitor(_element.nativeElement, true);
        this._intlSubscription = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MatStepHeader.prototype, "index", {
        get: /**
         * Index of the given step.
         * @return {?}
         */
        function () { return this._index; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._index = _angular_cdk_coercion.coerceNumberProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatStepHeader.prototype, "selected", {
        get: /**
         * Whether the given step is selected.
         * @return {?}
         */
        function () { return this._selected; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selected = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatStepHeader.prototype, "active", {
        get: /**
         * Whether the given step label is active.
         * @return {?}
         */
        function () { return this._active; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._active = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatStepHeader.prototype, "optional", {
        get: /**
         * Whether the given step is optional.
         * @return {?}
         */
        function () { return this._optional; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._optional = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatStepHeader.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._intlSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element.nativeElement);
    };
    /** Returns string label of given step if it is a text label. */
    /**
     * Returns string label of given step if it is a text label.
     * @return {?}
     */
    MatStepHeader.prototype._stringLabel = /**
     * Returns string label of given step if it is a text label.
     * @return {?}
     */
    function () {
        return this.label instanceof MatStepLabel ? null : this.label;
    };
    /** Returns MatStepLabel if the label of given step is a template label. */
    /**
     * Returns MatStepLabel if the label of given step is a template label.
     * @return {?}
     */
    MatStepHeader.prototype._templateLabel = /**
     * Returns MatStepLabel if the label of given step is a template label.
     * @return {?}
     */
    function () {
        return this.label instanceof MatStepLabel ? this.label : null;
    };
    /** Returns the host HTML element. */
    /**
     * Returns the host HTML element.
     * @return {?}
     */
    MatStepHeader.prototype._getHostElement = /**
     * Returns the host HTML element.
     * @return {?}
     */
    function () {
        return this._element.nativeElement;
    };
    return MatStepHeader;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStep = _angular_cdk_stepper.CdkStep;
var _MatStepper = _angular_cdk_stepper.CdkStepper;
var MatStep = /** @class */ (function (_super) {
    __extends(MatStep, _super);
    function MatStep(stepper, _errorStateMatcher) {
        var _this = _super.call(this, stepper) || this;
        _this._errorStateMatcher = _errorStateMatcher;
        return _this;
    }
    /** Custom error state matcher that additionally checks for validity of interacted form. */
    /**
     * Custom error state matcher that additionally checks for validity of interacted form.
     * @param {?} control
     * @param {?} form
     * @return {?}
     */
    MatStep.prototype.isErrorState = /**
     * Custom error state matcher that additionally checks for validity of interacted form.
     * @param {?} control
     * @param {?} form
     * @return {?}
     */
    function (control, form) {
        var /** @type {?} */ originalErrorState = this._errorStateMatcher.isErrorState(control, form);
        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        var /** @type {?} */ customErrorState = !!(control && control.invalid && this.interacted);
        return originalErrorState || customErrorState;
    };
    return MatStep;
}(_MatStep));
var MatStepper = /** @class */ (function (_super) {
    __extends(MatStepper, _super);
    function MatStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatStepper;
}(_MatStepper));
var MatHorizontalStepper = /** @class */ (function (_super) {
    __extends(MatHorizontalStepper, _super);
    function MatHorizontalStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatHorizontalStepper;
}(MatStepper));
var MatVerticalStepper = /** @class */ (function (_super) {
    __extends(MatVerticalStepper, _super);
    function MatVerticalStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatVerticalStepper;
}(MatStepper));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStepperNext = _angular_cdk_stepper.CdkStepperNext;
var _MatStepperPrevious = _angular_cdk_stepper.CdkStepperPrevious;
/**
 * Button that moves to the next step in a stepper workflow.
 */
var MatStepperNext = /** @class */ (function (_super) {
    __extends(MatStepperNext, _super);
    function MatStepperNext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatStepperNext;
}(_MatStepperNext));
/**
 * Button that moves to the previous step in a stepper workflow.
 */
var MatStepperPrevious = /** @class */ (function (_super) {
    __extends(MatStepperPrevious, _super);
    function MatStepperPrevious() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatStepperPrevious;
}(_MatStepperPrevious));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatStepperModule = /** @class */ (function () {
    function MatStepperModule() {
    }
    return MatStepperModule;
}());

exports.MatStepperModule = MatStepperModule;
exports._MatStepLabel = _MatStepLabel;
exports.MatStepLabel = MatStepLabel;
exports._MatStep = _MatStep;
exports._MatStepper = _MatStepper;
exports.MatStep = MatStep;
exports.MatStepper = MatStepper;
exports.MatHorizontalStepper = MatHorizontalStepper;
exports.MatVerticalStepper = MatVerticalStepper;
exports._MatStepperNext = _MatStepperNext;
exports._MatStepperPrevious = _MatStepperPrevious;
exports.MatStepperNext = MatStepperNext;
exports.MatStepperPrevious = MatStepperPrevious;
exports.MatStepHeader = MatStepHeader;
exports.MatStepperIntl = MatStepperIntl;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-stepper.umd.js.map
