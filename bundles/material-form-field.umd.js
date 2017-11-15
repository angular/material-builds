/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/cdk/platform'), require('@angular/animations'), require('@angular/cdk/coercion'), require('rxjs/operators/first'), require('rxjs/operators/startWith'), require('@angular/material/core'), require('rxjs/observable/fromEvent')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/cdk/platform', '@angular/animations', '@angular/cdk/coercion', 'rxjs/operators/first', 'rxjs/operators/startWith', '@angular/material/core', 'rxjs/observable/fromEvent'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material['form-field'] = global.ng.material['form-field'] || {}),global.ng.common,global.ng.core,global.ng.cdk.platform,global.ng.animations,global.ng.cdk.coercion,global.Rx.Observable,global.Rx.Observable,global.ng.material.core,global.Rx.Observable));
}(this, (function (exports,_angular_common,_angular_core,_angular_cdk_platform,_angular_animations,_angular_cdk_coercion,rxjs_operators_first,rxjs_operators_startWith,_angular_material_core,rxjs_observable_fromEvent) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Single error message to be shown underneath the form field.
 */
var MatError = /** @class */ (function () {
    function MatError() {
    }
    return MatError;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * An interface which allows a control to work inside of a `MatFormField`.
 * @abstract
 */
var MatFormFieldControl = /** @class */ (function () {
    function MatFormFieldControl() {
    }
    return MatFormFieldControl;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * \@docs-private
 * @return {?}
 */
function getMatFormFieldPlaceholderConflictError() {
    return Error('Placeholder attribute and child element were both specified.');
}
/**
 * \@docs-private
 * @param {?} align
 * @return {?}
 */
function getMatFormFieldDuplicatedHintError(align) {
    return Error("A hint was already declared for 'align=\"" + align + "\"'.");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMatFormFieldMissingControlError() {
    return Error('mat-form-field must contain a MatFormFieldControl.');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Hint text to be shown underneath the form field control.
 */
var MatHint = /** @class */ (function () {
    function MatHint() {
    }
    return MatHint;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The floating placeholder for an `MatFormField`.
 */
var MatPlaceholder = /** @class */ (function () {
    function MatPlaceholder() {
    }
    return MatPlaceholder;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Prefix to be placed the the front of the form field.
 */
var MatPrefix = /** @class */ (function () {
    function MatPrefix() {
    }
    return MatPrefix;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Suffix to be placed at the end of the form field.
 */
var MatSuffix = /** @class */ (function () {
    function MatSuffix() {
    }
    return MatSuffix;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Container for form controls that applies Material Design styling and behavior.
 */
var MatFormField = /** @class */ (function () {
    function MatFormField(_elementRef, _renderer, _changeDetectorRef, placeholderOptions) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._changeDetectorRef = _changeDetectorRef;
        this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
        this.floatPlaceholder = this._placeholderOptions.float || 'auto';
    }
    Object.defineProperty(MatFormField.prototype, "dividerColor", {
        get: /**
         * @deprecated Use `color` instead.
         * @return {?}
         */
        function () { return this.color; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this.color = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "hideRequiredMarker", {
        get: /**
         * Whether the required marker should be hidden.
         * @return {?}
         */
        function () { return this._hideRequiredMarker; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._hideRequiredMarker = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "_shouldAlwaysFloat", {
        /** Whether the floating label should always float or not. */
        get: /**
         * Whether the floating label should always float or not.
         * @return {?}
         */
        function () {
            return this._floatPlaceholder === 'always' && !this._showAlwaysAnimate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "_canPlaceholderFloat", {
        /** Whether the placeholder can float or not. */
        get: /**
         * Whether the placeholder can float or not.
         * @return {?}
         */
        function () { return this._floatPlaceholder !== 'never'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "hintLabel", {
        get: /**
         * Text for the form field hint.
         * @return {?}
         */
        function () { return this._hintLabel; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._hintLabel = value;
            this._processHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "floatPlaceholder", {
        get: /**
         * Whether the placeholder should always float, never float or float as the user types.
         * @return {?}
         */
        function () { return this._floatPlaceholder; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== this._floatPlaceholder) {
                this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatFormField.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._validateControlChild();
        if (this._control.controlType) {
            this._renderer.addClass(this._elementRef.nativeElement, "mat-form-field-type-" + this._control.controlType);
        }
        // Subscribe to changes in the child control state in order to update the form field UI.
        this._control.stateChanges.pipe(rxjs_operators_startWith.startWith(/** @type {?} */ ((null)))).subscribe(function () {
            _this._validatePlaceholders();
            _this._syncDescribedByIds();
            _this._changeDetectorRef.markForCheck();
        });
        var /** @type {?} */ ngControl = this._control.ngControl;
        if (ngControl && ngControl.valueChanges) {
            ngControl.valueChanges.subscribe(function () {
                _this._changeDetectorRef.markForCheck();
            });
        }
        // Re-validate when the number of hints changes.
        this._hintChildren.changes.pipe(rxjs_operators_startWith.startWith(null)).subscribe(function () {
            _this._processHints();
            _this._changeDetectorRef.markForCheck();
        });
        // Update the aria-described by when the number of errors changes.
        this._errorChildren.changes.pipe(rxjs_operators_startWith.startWith(null)).subscribe(function () {
            _this._syncDescribedByIds();
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * @return {?}
     */
    MatFormField.prototype.ngAfterContentChecked = /**
     * @return {?}
     */
    function () {
        this._validateControlChild();
    };
    /**
     * @return {?}
     */
    MatFormField.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    };
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    MatFormField.prototype._shouldForward = /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    function (prop) {
        var /** @type {?} */ ngControl = this._control ? this._control.ngControl : null;
        return ngControl && (/** @type {?} */ (ngControl))[prop];
    };
    /** Whether the form field has a placeholder. */
    /**
     * Whether the form field has a placeholder.
     * @return {?}
     */
    MatFormField.prototype._hasPlaceholder = /**
     * Whether the form field has a placeholder.
     * @return {?}
     */
    function () {
        return !!(this._control.placeholder || this._placeholderChild);
    };
    /** Determines whether to display hints or errors. */
    /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    MatFormField.prototype._getDisplayedMessages = /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    function () {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    };
    /** Animates the placeholder up and locks it in position. */
    /**
     * Animates the placeholder up and locks it in position.
     * @return {?}
     */
    MatFormField.prototype._animateAndLockPlaceholder = /**
     * Animates the placeholder up and locks it in position.
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._placeholder && this._canPlaceholderFloat) {
            this._showAlwaysAnimate = true;
            this._floatPlaceholder = 'always';
            rxjs_observable_fromEvent.fromEvent(this._placeholder.nativeElement, 'transitionend').pipe(rxjs_operators_first.first()).subscribe(function () {
                _this._showAlwaysAnimate = false;
            });
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     * @return {?}
     */
    MatFormField.prototype._validatePlaceholders = /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     * @return {?}
     */
    function () {
        if (this._control.placeholder && this._placeholderChild) {
            throw getMatFormFieldPlaceholderConflictError();
        }
    };
    /**
     * Does any extra processing that is required when handling the hints.
     * @return {?}
     */
    MatFormField.prototype._processHints = /**
     * Does any extra processing that is required when handling the hints.
     * @return {?}
     */
    function () {
        this._validateHints();
        this._syncDescribedByIds();
    };
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @return {?}
     */
    MatFormField.prototype._validateHints = /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._hintChildren) {
            var /** @type {?} */ startHint_1;
            var /** @type {?} */ endHint_1;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw getMatFormFieldDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw getMatFormFieldDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     * @return {?}
     */
    MatFormField.prototype._syncDescribedByIds = /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     * @return {?}
     */
    function () {
        if (this._control) {
            var /** @type {?} */ ids = [];
            if (this._getDisplayedMessages() === 'hint') {
                var /** @type {?} */ startHint = this._hintChildren ?
                    this._hintChildren.find(function (hint) { return hint.align === 'start'; }) : null;
                var /** @type {?} */ endHint = this._hintChildren ?
                    this._hintChildren.find(function (hint) { return hint.align === 'end'; }) : null;
                if (startHint) {
                    ids.push(startHint.id);
                }
                else if (this._hintLabel) {
                    ids.push(this._hintLabelId);
                }
                if (endHint) {
                    ids.push(endHint.id);
                }
            }
            else if (this._errorChildren) {
                ids = this._errorChildren.map(function (error) { return error.id; });
            }
            this._control.setDescribedByIds(ids);
        }
    };
    /** Throws an error if the form field's control is missing. */
    /**
     * Throws an error if the form field's control is missing.
     * @return {?}
     */
    MatFormField.prototype._validateControlChild = /**
     * Throws an error if the form field's control is missing.
     * @return {?}
     */
    function () {
        if (!this._control) {
            throw getMatFormFieldMissingControlError();
        }
    };
    return MatFormField;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatFormFieldModule = /** @class */ (function () {
    function MatFormFieldModule() {
    }
    return MatFormFieldModule;
}());

exports.MatFormFieldModule = MatFormFieldModule;
exports.MatError = MatError;
exports.MatFormField = MatFormField;
exports.MatFormFieldControl = MatFormFieldControl;
exports.getMatFormFieldPlaceholderConflictError = getMatFormFieldPlaceholderConflictError;
exports.getMatFormFieldDuplicatedHintError = getMatFormFieldDuplicatedHintError;
exports.getMatFormFieldMissingControlError = getMatFormFieldMissingControlError;
exports.MatHint = MatHint;
exports.MatPlaceholder = MatPlaceholder;
exports.MatPrefix = MatPrefix;
exports.MatSuffix = MatSuffix;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-form-field.umd.js.map
