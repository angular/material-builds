/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/cdk/a11y';
import '@angular/cdk/portal';
import { CdkStep, CdkStepLabel, CdkStepper, CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import '@angular/common';
import '@angular/core';
import '@angular/material/button';
import '@angular/material/core';
import '@angular/material/icon';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import 'rxjs/Subject';
import '@angular/animations';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStepLabel = CdkStepLabel;
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
            this._index = coerceNumberProperty(value);
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
            this._selected = coerceBooleanProperty(value);
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
            this._active = coerceBooleanProperty(value);
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
            this._optional = coerceBooleanProperty(value);
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
var _MatStep = CdkStep;
var _MatStepper = CdkStepper;
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
var _MatStepperNext = CdkStepperNext;
var _MatStepperPrevious = CdkStepperPrevious;
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatStepperModule, _MatStepLabel, MatStepLabel, _MatStep, _MatStepper, MatStep, MatStepper, MatHorizontalStepper, MatVerticalStepper, _MatStepperNext, _MatStepperPrevious, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIntl };
//# sourceMappingURL=stepper.es5.js.map
