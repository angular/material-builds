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
import 'rxjs/Subject';
import '@angular/animations';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatStepLabel = CdkStepLabel;
class MatStepLabel extends _MatStepLabel {
    /**
     * @param {?} template
     */
    constructor(template) {
        super(template);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Stepper data that is required for internationalization.
 */
class MatStepperIntl {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatStepHeader {
    /**
     * @param {?} _intl
     * @param {?} _focusMonitor
     * @param {?} _element
     * @param {?} changeDetectorRef
     */
    constructor(_intl, _focusMonitor, _element, changeDetectorRef) {
        this._intl = _intl;
        this._focusMonitor = _focusMonitor;
        this._element = _element;
        _focusMonitor.monitor(_element.nativeElement, true);
        this._intlSubscription = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
    }
    /**
     * Index of the given step.
     * @return {?}
     */
    get index() { return this._index; }
    /**
     * @param {?} value
     * @return {?}
     */
    set index(value) {
        this._index = coerceNumberProperty(value);
    }
    /**
     * Whether the given step is selected.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        this._selected = coerceBooleanProperty(value);
    }
    /**
     * Whether the given step label is active.
     * @return {?}
     */
    get active() { return this._active; }
    /**
     * @param {?} value
     * @return {?}
     */
    set active(value) {
        this._active = coerceBooleanProperty(value);
    }
    /**
     * Whether the given step is optional.
     * @return {?}
     */
    get optional() { return this._optional; }
    /**
     * @param {?} value
     * @return {?}
     */
    set optional(value) {
        this._optional = coerceBooleanProperty(value);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._intlSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element.nativeElement);
    }
    /**
     * Returns string label of given step if it is a text label.
     * @return {?}
     */
    _stringLabel() {
        return this.label instanceof MatStepLabel ? null : this.label;
    }
    /**
     * Returns MatStepLabel if the label of given step is a template label.
     * @return {?}
     */
    _templateLabel() {
        return this.label instanceof MatStepLabel ? this.label : null;
    }
    /**
     * Returns the host HTML element.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatStep = CdkStep;
const _MatStepper = CdkStepper;
class MatStep extends _MatStep {
    /**
     * @param {?} stepper
     * @param {?} _errorStateMatcher
     */
    constructor(stepper, _errorStateMatcher) {
        super(stepper);
        this._errorStateMatcher = _errorStateMatcher;
    }
    /**
     * Custom error state matcher that additionally checks for validity of interacted form.
     * @param {?} control
     * @param {?} form
     * @return {?}
     */
    isErrorState(control, form) {
        const /** @type {?} */ originalErrorState = this._errorStateMatcher.isErrorState(control, form);
        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        const /** @type {?} */ customErrorState = !!(control && control.invalid && this.interacted);
        return originalErrorState || customErrorState;
    }
}
class MatStepper extends _MatStepper {
}
class MatHorizontalStepper extends MatStepper {
}
class MatVerticalStepper extends MatStepper {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatStepperNext = CdkStepperNext;
const _MatStepperPrevious = CdkStepperPrevious;
/**
 * Button that moves to the next step in a stepper workflow.
 */
class MatStepperNext extends _MatStepperNext {
}
/**
 * Button that moves to the previous step in a stepper workflow.
 */
class MatStepperPrevious extends _MatStepperPrevious {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatStepperModule {
}

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
//# sourceMappingURL=stepper.js.map
