/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/common';
import '@angular/core';
import '@angular/cdk/platform';
import '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { first } from 'rxjs/operators/first';
import { startWith } from 'rxjs/operators/startWith';
import '@angular/material/core';
import { fromEvent } from 'rxjs/observable/fromEvent';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Single error message to be shown underneath the form field.
 */
class MatError {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * An interface which allows a control to work inside of a `MatFormField`.
 * @abstract
 */
class MatFormFieldControl {
}

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
    return Error(`A hint was already declared for 'align="${align}"'.`);
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
class MatHint {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The floating placeholder for an `MatFormField`.
 */
class MatPlaceholder {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Prefix to be placed the the front of the form field.
 */
class MatPrefix {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Suffix to be placed at the end of the form field.
 */
class MatSuffix {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Container for form controls that applies Material Design styling and behavior.
 */
class MatFormField {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _changeDetectorRef
     * @param {?} placeholderOptions
     */
    constructor(_elementRef, _renderer, _changeDetectorRef, placeholderOptions) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._changeDetectorRef = _changeDetectorRef;
        this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
        this.floatPlaceholder = this._placeholderOptions.float || 'auto';
    }
    /**
     * @deprecated Use `color` instead.
     * @return {?}
     */
    get dividerColor() { return this.color; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dividerColor(value) { this.color = value; }
    /**
     * Whether the required marker should be hidden.
     * @return {?}
     */
    get hideRequiredMarker() { return this._hideRequiredMarker; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hideRequiredMarker(value) {
        this._hideRequiredMarker = coerceBooleanProperty(value);
    }
    /**
     * Whether the floating label should always float or not.
     * @return {?}
     */
    get _shouldAlwaysFloat() {
        return this._floatPlaceholder === 'always' && !this._showAlwaysAnimate;
    }
    /**
     * Whether the placeholder can float or not.
     * @return {?}
     */
    get _canPlaceholderFloat() { return this._floatPlaceholder !== 'never'; }
    /**
     * Text for the form field hint.
     * @return {?}
     */
    get hintLabel() { return this._hintLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hintLabel(value) {
        this._hintLabel = value;
        this._processHints();
    }
    /**
     * Whether the placeholder should always float, never float or float as the user types.
     * @return {?}
     */
    get floatPlaceholder() { return this._floatPlaceholder; }
    /**
     * @param {?} value
     * @return {?}
     */
    set floatPlaceholder(value) {
        if (value !== this._floatPlaceholder) {
            this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._validateControlChild();
        if (this._control.controlType) {
            this._renderer.addClass(this._elementRef.nativeElement, `mat-form-field-type-${this._control.controlType}`);
        }
        // Subscribe to changes in the child control state in order to update the form field UI.
        this._control.stateChanges.pipe(startWith(/** @type {?} */ ((null)))).subscribe(() => {
            this._validatePlaceholders();
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        });
        let /** @type {?} */ ngControl = this._control.ngControl;
        if (ngControl && ngControl.valueChanges) {
            ngControl.valueChanges.subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
        }
        // Re-validate when the number of hints changes.
        this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
            this._processHints();
            this._changeDetectorRef.markForCheck();
        });
        // Update the aria-described by when the number of errors changes.
        this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        this._validateControlChild();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    }
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    _shouldForward(prop) {
        let /** @type {?} */ ngControl = this._control ? this._control.ngControl : null;
        return ngControl && (/** @type {?} */ (ngControl))[prop];
    }
    /**
     * Whether the form field has a placeholder.
     * @return {?}
     */
    _hasPlaceholder() {
        return !!(this._control.placeholder || this._placeholderChild);
    }
    /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    _getDisplayedMessages() {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    }
    /**
     * Animates the placeholder up and locks it in position.
     * @return {?}
     */
    _animateAndLockPlaceholder() {
        if (this._placeholder && this._canPlaceholderFloat) {
            this._showAlwaysAnimate = true;
            this._floatPlaceholder = 'always';
            fromEvent(this._placeholder.nativeElement, 'transitionend').pipe(first()).subscribe(() => {
                this._showAlwaysAnimate = false;
            });
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     * @return {?}
     */
    _validatePlaceholders() {
        if (this._control.placeholder && this._placeholderChild) {
            throw getMatFormFieldPlaceholderConflictError();
        }
    }
    /**
     * Does any extra processing that is required when handling the hints.
     * @return {?}
     */
    _processHints() {
        this._validateHints();
        this._syncDescribedByIds();
    }
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @return {?}
     */
    _validateHints() {
        if (this._hintChildren) {
            let /** @type {?} */ startHint;
            let /** @type {?} */ endHint;
            this._hintChildren.forEach((hint) => {
                if (hint.align == 'start') {
                    if (startHint || this.hintLabel) {
                        throw getMatFormFieldDuplicatedHintError('start');
                    }
                    startHint = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint) {
                        throw getMatFormFieldDuplicatedHintError('end');
                    }
                    endHint = hint;
                }
            });
        }
    }
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     * @return {?}
     */
    _syncDescribedByIds() {
        if (this._control) {
            let /** @type {?} */ ids = [];
            if (this._getDisplayedMessages() === 'hint') {
                let /** @type {?} */ startHint = this._hintChildren ?
                    this._hintChildren.find(hint => hint.align === 'start') : null;
                let /** @type {?} */ endHint = this._hintChildren ?
                    this._hintChildren.find(hint => hint.align === 'end') : null;
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
                ids = this._errorChildren.map(error => error.id);
            }
            this._control.setDescribedByIds(ids);
        }
    }
    /**
     * Throws an error if the form field's control is missing.
     * @return {?}
     */
    _validateControlChild() {
        if (!this._control) {
            throw getMatFormFieldMissingControlError();
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatFormFieldModule {
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

export { MatFormFieldModule, MatError, MatFormField, MatFormFieldControl, getMatFormFieldPlaceholderConflictError, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, MatHint, MatPlaceholder, MatPrefix, MatSuffix };
//# sourceMappingURL=form-field.js.map
