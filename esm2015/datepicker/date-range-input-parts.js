/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/date-range-input-parts.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Optional, InjectionToken, Inject, Injector, InjectFlags, } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NgForm, FormGroupDirective, NgControl, Validators, } from '@angular/forms';
import { mixinErrorState, MAT_DATE_FORMATS, DateAdapter, ErrorStateMatcher, } from '@angular/material/core';
import { BACKSPACE } from '@angular/cdk/keycodes';
import { MatDatepickerInputBase } from './datepicker-input-base';
import { DateRange } from './date-selection-model';
/**
 * Parent component that should be wrapped around `MatStartDate` and `MatEndDate`.
 * @record
 * @template D
 */
export function MatDateRangeInputParent() { }
if (false) {
    /** @type {?} */
    MatDateRangeInputParent.prototype.id;
    /** @type {?} */
    MatDateRangeInputParent.prototype.min;
    /** @type {?} */
    MatDateRangeInputParent.prototype.max;
    /** @type {?} */
    MatDateRangeInputParent.prototype.dateFilter;
    /** @type {?} */
    MatDateRangeInputParent.prototype._startInput;
    /** @type {?} */
    MatDateRangeInputParent.prototype._endInput;
    /** @type {?} */
    MatDateRangeInputParent.prototype._groupDisabled;
    /** @type {?} */
    MatDateRangeInputParent.prototype._ariaDescribedBy;
    /** @type {?} */
    MatDateRangeInputParent.prototype._ariaLabelledBy;
    /** @type {?} */
    MatDateRangeInputParent.prototype._handleChildValueChange;
    /** @type {?} */
    MatDateRangeInputParent.prototype._openDatepicker;
}
/**
 * Used to provide the date range input wrapper component
 * to the parts without circular dependencies.
 * @type {?}
 */
export const MAT_DATE_RANGE_INPUT_PARENT = new InjectionToken('MAT_DATE_RANGE_INPUT_PARENT');
/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 * @abstract
 * @template D
 */
let MatDateRangeInputPartBase = /** @class */ (() => {
    /**
     * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
     * @abstract
     * @template D
     */
    class MatDateRangeInputPartBase extends MatDatepickerInputBase {
        /**
         * @param {?} _rangeInput
         * @param {?} elementRef
         * @param {?} _defaultErrorStateMatcher
         * @param {?} _injector
         * @param {?} _parentForm
         * @param {?} _parentFormGroup
         * @param {?} dateAdapter
         * @param {?} dateFormats
         */
        constructor(_rangeInput, elementRef, _defaultErrorStateMatcher, _injector, _parentForm, _parentFormGroup, dateAdapter, dateFormats) {
            super(elementRef, dateAdapter, dateFormats);
            this._rangeInput = _rangeInput;
            this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
            this._injector = _injector;
            this._parentForm = _parentForm;
            this._parentFormGroup = _parentFormGroup;
            this._outsideValueChanged = (/**
             * @return {?}
             */
            () => {
                // Whenever the value changes outside the input we need to revalidate, because
                // the validation state of each of the inputs depends on the other one.
                this._validatorOnChange();
            });
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            // We need the date input to provide itself as a `ControlValueAccessor` and a `Validator`, while
            // injecting its `NgControl` so that the error state is handled correctly. This introduces a
            // circular dependency, because both `ControlValueAccessor` and `Validator` depend on the input
            // itself. Usually we can work around it for the CVA, but there's no API to do it for the
            // validator. We work around it here by injecting the `NgControl` in `ngOnInit`, after
            // everything has been resolved.
            /** @type {?} */
            const ngControl = this._injector.get(NgControl, null, InjectFlags.Self);
            if (ngControl) {
                this.ngControl = ngControl;
            }
        }
        /**
         * @return {?}
         */
        ngDoCheck() {
            if (this.ngControl) {
                // We need to re-evaluate this on every change detection cycle, because there are some
                // error triggers that we can't subscribe to (e.g. parent form submissions). This means
                // that whatever logic is in here has to be super lean or we risk destroying the performance.
                this.updateErrorState();
            }
        }
        /**
         * Gets whether the input is empty.
         * @return {?}
         */
        isEmpty() {
            return this._elementRef.nativeElement.value.length === 0;
        }
        /**
         * Focuses the input.
         * @return {?}
         */
        focus() {
            this._elementRef.nativeElement.focus();
        }
        /**
         * Handles `input` events on the input element.
         * @param {?} value
         * @return {?}
         */
        _onInput(value) {
            super._onInput(value);
            this._rangeInput._handleChildValueChange();
        }
        /**
         * Opens the datepicker associated with the input.
         * @protected
         * @return {?}
         */
        _openPopup() {
            this._rangeInput._openDatepicker();
        }
        /**
         * Gets the minimum date from the range input.
         * @protected
         * @return {?}
         */
        _getMinDate() {
            return this._rangeInput.min;
        }
        /**
         * Gets the maximum date from the range input.
         * @protected
         * @return {?}
         */
        _getMaxDate() {
            return this._rangeInput.max;
        }
        /**
         * Gets the date filter function from the range input.
         * @protected
         * @return {?}
         */
        _getDateFilter() {
            return this._rangeInput.dateFilter;
        }
        /**
         * @protected
         * @return {?}
         */
        _parentDisabled() {
            return this._rangeInput._groupDisabled;
        }
        /**
         * @param {?} model
         * @return {?}
         */
        _registerModel(model) {
            // The very first time the range inputs write their values, they don't know about the value
            // of the opposite input. When this is combined with the fact that `NgModel` defers writing
            // its value with a `Promise.resolve`, we can get into a situation where the first input
            // resets the value of the second. We work around it by deferring the registration of
            // the model, allowing the input enough time to assign the initial value.
            Promise.resolve().then((/**
             * @return {?}
             */
            () => super._registerModel(model)));
        }
    }
    MatDateRangeInputPartBase.decorators = [
        { type: Directive }
    ];
    /** @nocollapse */
    MatDateRangeInputPartBase.ctorParameters = () => [
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_INPUT_PARENT,] }] },
        { type: ElementRef },
        { type: ErrorStateMatcher },
        { type: Injector },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
    ];
    return MatDateRangeInputPartBase;
})();
if (false) {
    /**
     * \@docs-private
     * @type {?}
     */
    MatDateRangeInputPartBase.prototype.ngControl;
    /**
     * @type {?}
     * @protected
     */
    MatDateRangeInputPartBase.prototype._validator;
    /**
     * @type {?}
     * @protected
     */
    MatDateRangeInputPartBase.prototype._outsideValueChanged;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._rangeInput;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._defaultErrorStateMatcher;
    /**
     * @type {?}
     * @private
     */
    MatDateRangeInputPartBase.prototype._injector;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._parentForm;
    /** @type {?} */
    MatDateRangeInputPartBase.prototype._parentFormGroup;
    /**
     * \@docs-private
     * @abstract
     * @return {?}
     */
    MatDateRangeInputPartBase.prototype.updateErrorState = function () { };
    /**
     * @abstract
     * @protected
     * @param {?} value
     * @return {?}
     */
    MatDateRangeInputPartBase.prototype._assignValueToModel = function (value) { };
    /**
     * @abstract
     * @protected
     * @param {?} modelValue
     * @return {?}
     */
    MatDateRangeInputPartBase.prototype._getValueFromModel = function (modelValue) { };
}
/** @type {?} */
const _MatDateRangeInputBase = 
// Needs to be `as any`, because the base class is abstract.
mixinErrorState((/** @type {?} */ (MatDateRangeInputPartBase)));
/**
 * Input for entering the start date in a `mat-date-range-input`.
 * @template D
 */
let MatStartDate = /** @class */ (() => {
    /**
     * Input for entering the start date in a `mat-date-range-input`.
     * @template D
     */
    class MatStartDate extends _MatDateRangeInputBase {
        /**
         * @param {?} rangeInput
         * @param {?} elementRef
         * @param {?} defaultErrorStateMatcher
         * @param {?} injector
         * @param {?} parentForm
         * @param {?} parentFormGroup
         * @param {?} dateAdapter
         * @param {?} dateFormats
         */
        constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
            // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
            // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
            // constructor once ViewEngine is removed.
            super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
            /**
             * Validator that checks that the start date isn't after the end date.
             */
            this._startValidator = (/**
             * @param {?} control
             * @return {?}
             */
            (control) => {
                /** @type {?} */
                const start = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                /** @type {?} */
                const end = this._model ? this._model.selection.end : null;
                return (!start || !end ||
                    this._dateAdapter.compareDate(start, end) <= 0) ?
                    null : { 'matStartDateInvalid': { 'end': end, 'actual': start } };
            });
            this._validator = Validators.compose([...super._getValidators(), this._startValidator]);
        }
        /**
         * @protected
         * @param {?} modelValue
         * @return {?}
         */
        _getValueFromModel(modelValue) {
            return modelValue.start;
        }
        /**
         * @protected
         * @param {?} value
         * @return {?}
         */
        _assignValueToModel(value) {
            if (this._model) {
                /** @type {?} */
                const range = new DateRange(value, this._model.selection.end);
                this._model.updateSelection(range, this);
            }
        }
        /**
         * @protected
         * @param {?} value
         * @return {?}
         */
        _formatValue(value) {
            super._formatValue(value);
            // Any time the input value is reformatted we need to tell the parent.
            this._rangeInput._handleChildValueChange();
        }
        /**
         * Gets the value that should be used when mirroring the input's size.
         * @return {?}
         */
        getMirrorValue() {
            /** @type {?} */
            const element = this._elementRef.nativeElement;
            /** @type {?} */
            const value = element.value;
            return value.length > 0 ? value : element.placeholder;
        }
    }
    MatStartDate.decorators = [
        { type: Directive, args: [{
                    selector: 'input[matStartDate]',
                    host: {
                        'class': 'mat-date-range-input-inner',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(keydown)': '_onKeydown($event)',
                        '[attr.id]': '_rangeInput.id',
                        '[attr.aria-labelledby]': '_rangeInput._ariaLabelledBy',
                        '[attr.aria-describedby]': '_rangeInput._ariaDescribedBy',
                        '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
                        '[attr.aria-owns]': '(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null',
                        '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
                        '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
                        '(blur)': '_onBlur()',
                        'type': 'text',
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: MatStartDate, multi: true },
                        { provide: NG_VALIDATORS, useExisting: MatStartDate, multi: true }
                    ]
                },] }
    ];
    /** @nocollapse */
    MatStartDate.ctorParameters = () => [
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_INPUT_PARENT,] }] },
        { type: ElementRef },
        { type: ErrorStateMatcher },
        { type: Injector },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
    ];
    return MatStartDate;
})();
export { MatStartDate };
if (false) {
    /** @type {?} */
    MatStartDate.ngAcceptInputType_disabled;
    /**
     * Validator that checks that the start date isn't after the end date.
     * @type {?}
     * @private
     */
    MatStartDate.prototype._startValidator;
    /**
     * @type {?}
     * @protected
     */
    MatStartDate.prototype._validator;
}
/**
 * Input for entering the end date in a `mat-date-range-input`.
 * @template D
 */
let MatEndDate = /** @class */ (() => {
    /**
     * Input for entering the end date in a `mat-date-range-input`.
     * @template D
     */
    class MatEndDate extends _MatDateRangeInputBase {
        /**
         * @param {?} rangeInput
         * @param {?} elementRef
         * @param {?} defaultErrorStateMatcher
         * @param {?} injector
         * @param {?} parentForm
         * @param {?} parentFormGroup
         * @param {?} dateAdapter
         * @param {?} dateFormats
         */
        constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
            // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
            // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
            // constructor once ViewEngine is removed.
            super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
            /**
             * Validator that checks that the end date isn't before the start date.
             */
            this._endValidator = (/**
             * @param {?} control
             * @return {?}
             */
            (control) => {
                /** @type {?} */
                const end = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                /** @type {?} */
                const start = this._model ? this._model.selection.start : null;
                return (!end || !start ||
                    this._dateAdapter.compareDate(end, start) >= 0) ?
                    null : { 'matEndDateInvalid': { 'start': start, 'actual': end } };
            });
            this._validator = Validators.compose([...super._getValidators(), this._endValidator]);
        }
        /**
         * @protected
         * @param {?} modelValue
         * @return {?}
         */
        _getValueFromModel(modelValue) {
            return modelValue.end;
        }
        /**
         * @protected
         * @param {?} value
         * @return {?}
         */
        _assignValueToModel(value) {
            if (this._model) {
                /** @type {?} */
                const range = new DateRange(this._model.selection.start, value);
                this._model.updateSelection(range, this);
            }
        }
        /**
         * @param {?} event
         * @return {?}
         */
        _onKeydown(event) {
            // If the user is pressing backspace on an empty end input, focus focus back to the start.
            if (event.keyCode === BACKSPACE && !this._elementRef.nativeElement.value) {
                this._rangeInput._startInput.focus();
            }
            super._onKeydown(event);
        }
    }
    MatEndDate.decorators = [
        { type: Directive, args: [{
                    selector: 'input[matEndDate]',
                    host: {
                        'class': 'mat-date-range-input-inner',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(keydown)': '_onKeydown($event)',
                        '[attr.aria-labelledby]': '_rangeInput._ariaLabelledBy',
                        '[attr.aria-describedby]': '_rangeInput._ariaDescribedBy',
                        '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
                        '[attr.aria-owns]': '(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null',
                        '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
                        '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
                        '(blur)': '_onBlur()',
                        'type': 'text',
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: MatEndDate, multi: true },
                        { provide: NG_VALIDATORS, useExisting: MatEndDate, multi: true }
                    ]
                },] }
    ];
    /** @nocollapse */
    MatEndDate.ctorParameters = () => [
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DATE_RANGE_INPUT_PARENT,] }] },
        { type: ElementRef },
        { type: ErrorStateMatcher },
        { type: Injector },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
    ];
    return MatEndDate;
})();
export { MatEndDate };
if (false) {
    /** @type {?} */
    MatEndDate.ngAcceptInputType_disabled;
    /**
     * Validator that checks that the end date isn't before the start date.
     * @type {?}
     * @private
     */
    MatEndDate.prototype._endValidator;
    /**
     * @type {?}
     * @protected
     */
    MatEndDate.prototype._validator;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQXdCLE1BQU0sd0JBQXdCLENBQUM7Ozs7OztBQUd4RSw2Q0FZQzs7O0lBWEMscUNBQVc7O0lBQ1gsc0NBQWM7O0lBQ2Qsc0NBQWM7O0lBQ2QsNkNBQTRCOztJQUM1Qiw4Q0FBMEM7O0lBQzFDLDRDQUF3Qzs7SUFDeEMsaURBQXdCOztJQUN4QixtREFBZ0M7O0lBQ2hDLGtEQUErQjs7SUFDL0IsMERBQW9DOztJQUNwQyxrREFBNEI7Ozs7Ozs7QUFPOUIsTUFBTSxPQUFPLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUM7Ozs7OztBQUt2Rjs7Ozs7O0lBQUEsTUFDZSx5QkFDYixTQUFRLHNCQUFvQzs7Ozs7Ozs7Ozs7UUFZNUMsWUFDOEMsV0FBdUMsRUFDbkYsVUFB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MkI7Z0JBN1JyQyxVQUFVO2dCQTJCVixpQkFBaUI7Z0JBdEJqQixRQUFRO2dCQU9SLE1BQU0sdUJBcVJILFFBQVE7Z0JBcFJYLGtCQUFrQix1QkFxUmYsUUFBUTtnQkF6UVgsV0FBVyx1QkEwUVIsUUFBUTtnREFDUixRQUFRLFlBQUksTUFBTSxTQUFDLGdCQUFnQjs7SUFnQ3hDLGlCQUFDO0tBQUE7U0FsRFksVUFBVTs7O0lBaURyQixzQ0FBZ0Q7Ozs7OztJQS9DaEQsbUNBTUM7Ozs7O0lBbUJELGdDQUEyRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIE9wdGlvbmFsLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPbkluaXQsXG4gIEluamVjdG9yLFxuICBJbmplY3RGbGFncyxcbiAgRG9DaGVjayxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgTkdfVkFMSURBVE9SUyxcbiAgTmdGb3JtLFxuICBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gIE5nQ29udHJvbCxcbiAgVmFsaWRhdG9yRm4sXG4gIFZhbGlkYXRvcnMsXG4gIEFic3RyYWN0Q29udHJvbCxcbiAgVmFsaWRhdGlvbkVycm9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IsXG4gIG1peGluRXJyb3JTdGF0ZSxcbiAgTUFUX0RBVEVfRk9STUFUUyxcbiAgRGF0ZUFkYXB0ZXIsXG4gIE1hdERhdGVGb3JtYXRzLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRCYXNlLCBEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7RGF0ZVJhbmdlLCBNYXREYXRlU2VsZWN0aW9uTW9kZWx9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuXG4vKiogUGFyZW50IGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSB3cmFwcGVkIGFyb3VuZCBgTWF0U3RhcnREYXRlYCBhbmQgYE1hdEVuZERhdGVgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPiB7XG4gIGlkOiBzdHJpbmc7XG4gIG1pbjogRCB8IG51bGw7XG4gIG1heDogRCB8IG51bGw7XG4gIGRhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcbiAgX3N0YXJ0SW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD47XG4gIF9lbmRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2dyb3VwRGlzYWJsZWQ6IGJvb2xlYW47XG4gIF9hcmlhRGVzY3JpYmVkQnk6IHN0cmluZyB8IG51bGw7XG4gIF9hcmlhTGFiZWxsZWRCeTogc3RyaW5nIHwgbnVsbDtcbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2U6ICgpID0+IHZvaWQ7XG4gIF9vcGVuRGF0ZXBpY2tlcjogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgdGhlIGRhdGUgcmFuZ2UgaW5wdXQgd3JhcHBlciBjb21wb25lbnRcbiAqIHRvIHRoZSBwYXJ0cyB3aXRob3V0IGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdERhdGVSYW5nZUlucHV0UGFyZW50PHVua25vd24+PignTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UJyk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdGhlIGluZGl2aWR1YWwgaW5wdXRzIHRoYXQgY2FuIGJlIHByb2plY3RlZCBpbnNpZGUgYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLlxuICovXG5ARGlyZWN0aXZlKClcbmFic3RyYWN0IGNsYXNzIE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD5cbiAgZXh0ZW5kcyBNYXREYXRlcGlja2VySW5wdXRCYXNlPERhdGVSYW5nZTxEPj4gaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2sge1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIG5nQ29udHJvbDogTmdDb250cm9sO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGFic3RyYWN0IHVwZGF0ZUVycm9yU3RhdGUoKTogdm9pZDtcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpOiB2b2lkO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IERhdGVSYW5nZTxEPik6IEQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSBwdWJsaWMgX3JhbmdlSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIGRhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBXZSBuZWVkIHRoZSBkYXRlIGlucHV0IHRvIHByb3ZpZGUgaXRzZWxmIGFzIGEgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBhbmQgYSBgVmFsaWRhdG9yYCwgd2hpbGVcbiAgICAvLyBpbmplY3RpbmcgaXRzIGBOZ0NvbnRyb2xgIHNvIHRoYXQgdGhlIGVycm9yIHN0YXRlIGlzIGhhbmRsZWQgY29ycmVjdGx5LiBUaGlzIGludHJvZHVjZXMgYVxuICAgIC8vIGNpcmN1bGFyIGRlcGVuZGVuY3ksIGJlY2F1c2UgYm90aCBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGFuZCBgVmFsaWRhdG9yYCBkZXBlbmQgb24gdGhlIGlucHV0XG4gICAgLy8gaXRzZWxmLiBVc3VhbGx5IHdlIGNhbiB3b3JrIGFyb3VuZCBpdCBmb3IgdGhlIENWQSwgYnV0IHRoZXJlJ3Mgbm8gQVBJIHRvIGRvIGl0IGZvciB0aGVcbiAgICAvLyB2YWxpZGF0b3IuIFdlIHdvcmsgYXJvdW5kIGl0IGhlcmUgYnkgaW5qZWN0aW5nIHRoZSBgTmdDb250cm9sYCBpbiBgbmdPbkluaXRgLCBhZnRlclxuICAgIC8vIGV2ZXJ5dGhpbmcgaGFzIGJlZW4gcmVzb2x2ZWQuXG4gICAgY29uc3QgbmdDb250cm9sID0gdGhpcy5faW5qZWN0b3IuZ2V0KE5nQ29udHJvbCwgbnVsbCwgSW5qZWN0RmxhZ3MuU2VsZik7XG5cbiAgICBpZiAobmdDb250cm9sKSB7XG4gICAgICB0aGlzLm5nQ29udHJvbCA9IG5nQ29udHJvbDtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGlucHV0IGlzIGVtcHR5LiAqL1xuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGBpbnB1dGAgZXZlbnRzIG9uIHRoZSBpbnB1dCBlbGVtZW50LiAqL1xuICBfb25JbnB1dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIuX29uSW5wdXQodmFsdWUpO1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgZGF0ZXBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX29wZW5Qb3B1cCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9vcGVuRGF0ZXBpY2tlcigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1pbmltdW0gZGF0ZSBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9nZXRNaW5EYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtYXhpbXVtIGRhdGUgZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfZ2V0TWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5tYXg7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGF0ZSBmaWx0ZXIgZnVuY3Rpb24gZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfZ2V0RGF0ZUZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5kYXRlRmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9vdXRzaWRlVmFsdWVDaGFuZ2VkID0gKCkgPT4ge1xuICAgIC8vIFdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzIG91dHNpZGUgdGhlIGlucHV0IHdlIG5lZWQgdG8gcmV2YWxpZGF0ZSwgYmVjYXVzZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIHN0YXRlIG9mIGVhY2ggb2YgdGhlIGlucHV0cyBkZXBlbmRzIG9uIHRoZSBvdGhlciBvbmUuXG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcGFyZW50RGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQuX2dyb3VwRGlzYWJsZWQ7XG4gIH1cblxuICBfcmVnaXN0ZXJNb2RlbChtb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPiwgRD4pIHtcbiAgICAvLyBUaGUgdmVyeSBmaXJzdCB0aW1lIHRoZSByYW5nZSBpbnB1dHMgd3JpdGUgdGhlaXIgdmFsdWVzLCB0aGV5IGRvbid0IGtub3cgYWJvdXQgdGhlIHZhbHVlXG4gICAgLy8gb2YgdGhlIG9wcG9zaXRlIGlucHV0LiBXaGVuIHRoaXMgaXMgY29tYmluZWQgd2l0aCB0aGUgZmFjdCB0aGF0IGBOZ01vZGVsYCBkZWZlcnMgd3JpdGluZ1xuICAgIC8vIGl0cyB2YWx1ZSB3aXRoIGEgYFByb21pc2UucmVzb2x2ZWAsIHdlIGNhbiBnZXQgaW50byBhIHNpdHVhdGlvbiB3aGVyZSB0aGUgZmlyc3QgaW5wdXRcbiAgICAvLyByZXNldHMgdGhlIHZhbHVlIG9mIHRoZSBzZWNvbmQuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IGRlZmVycmluZyB0aGUgcmVnaXN0cmF0aW9uIG9mXG4gICAgLy8gdGhlIG1vZGVsLCBhbGxvd2luZyB0aGUgaW5wdXQgZW5vdWdoIHRpbWUgdG8gYXNzaWduIHRoZSBpbml0aWFsIHZhbHVlLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gc3VwZXIuX3JlZ2lzdGVyTW9kZWwobW9kZWwpKTtcbiAgfVxufVxuXG5jb25zdCBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlOlxuICAgIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgdHlwZW9mIE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgPVxuICAgIC8vIE5lZWRzIHRvIGJlIGBhcyBhbnlgLCBiZWNhdXNlIHRoZSBiYXNlIGNsYXNzIGlzIGFic3RyYWN0LlxuICAgIG1peGluRXJyb3JTdGF0ZShNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlIGFzIGFueSk7XG5cbi8qKiBJbnB1dCBmb3IgZW50ZXJpbmcgdGhlIHN0YXJ0IGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0U3RhcnREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmlkXSc6ICdfcmFuZ2VJbnB1dC5pZCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFEZXNjcmliZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXRTdGFydERhdGUsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RhcnREYXRlPEQ+IGV4dGVuZHMgX01hdERhdGVSYW5nZUlucHV0QmFzZTxEPiBpbXBsZW1lbnRzIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICAvKiogVmFsaWRhdG9yIHRoYXQgY2hlY2tzIHRoYXQgdGhlIHN0YXJ0IGRhdGUgaXNuJ3QgYWZ0ZXIgdGhlIGVuZCBkYXRlLiAqL1xuICBwcml2YXRlIF9zdGFydFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbi5lbmQgOiBudWxsO1xuICAgIHJldHVybiAoIXN0YXJ0IHx8ICFlbmQgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoc3RhcnQsIGVuZCkgPD0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXRTdGFydERhdGVJbnZhbGlkJzogeydlbmQnOiBlbmQsICdhY3R1YWwnOiBzdGFydH19O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHJhbmdlSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIGRhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgY29uc3RydWN0b3Igc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSwgYnV0IFZpZXdFbmdpbmUgZG9lc24ndCBzZWVtIHRvXG4gICAgLy8gaGFuZGxlIERJIGNvcnJlY3RseSB3aGVuIGl0IGlzIGluaGVyaXRlZCBmcm9tIGBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlYC4gV2UgY2FuIGRyb3AgdGhpc1xuICAgIC8vIGNvbnN0cnVjdG9yIG9uY2UgVmlld0VuZ2luZSBpcyByZW1vdmVkLlxuICAgIHN1cGVyKHJhbmdlSW5wdXQsIGVsZW1lbnRSZWYsIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgaW5qZWN0b3IsIHBhcmVudEZvcm0sIHBhcmVudEZvcm1Hcm91cCxcbiAgICAgICAgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFsuLi5zdXBlci5fZ2V0VmFsaWRhdG9ycygpLCB0aGlzLl9zdGFydFZhbGlkYXRvcl0pO1xuXG4gIHByb3RlY3RlZCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgcmV0dXJuIG1vZGVsVmFsdWUuc3RhcnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh2YWx1ZSwgdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcblxuICAgIC8vIEFueSB0aW1lIHRoZSBpbnB1dCB2YWx1ZSBpcyByZWZvcm1hdHRlZCB3ZSBuZWVkIHRvIHRlbGwgdGhlIHBhcmVudC5cbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIG1pcnJvcmluZyB0aGUgaW5wdXQncyBzaXplLiAqL1xuICBnZXRNaXJyb3JWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwID8gdmFsdWUgOiBlbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgZW5kIGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0RW5kRGF0ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0LWlubmVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19yYW5nZUlucHV0Ll9hcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19yYW5nZUlucHV0Ll9hcmlhRGVzY3JpYmVkQnknLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXI/Lm9wZW5lZCAmJiBfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnX2dldE1pbkRhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1pbkRhdGUoKSkgOiBudWxsJyxcbiAgICAnW2F0dHIubWF4XSc6ICdfZ2V0TWF4RGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWF4RGF0ZSgpKSA6IG51bGwnLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAndHlwZSc6ICd0ZXh0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTWF0RW5kRGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0RW5kRGF0ZSwgbXVsdGk6IHRydWV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RW5kRGF0ZTxEPiBleHRlbmRzIF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U8RD4gaW1wbGVtZW50cyBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgLyoqIFZhbGlkYXRvciB0aGF0IGNoZWNrcyB0aGF0IHRoZSBlbmQgZGF0ZSBpc24ndCBiZWZvcmUgdGhlIHN0YXJ0IGRhdGUuICovXG4gIHByaXZhdGUgX2VuZFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCA6IG51bGw7XG4gICAgcmV0dXJuICghZW5kIHx8ICFzdGFydCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShlbmQsIHN0YXJ0KSA+PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdEVuZERhdGVJbnZhbGlkJzogeydzdGFydCc6IHN0YXJ0LCAnYWN0dWFsJzogZW5kfX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX2VuZFZhbGlkYXRvcl0pO1xuXG4gIHByb3RlY3RlZCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgcmV0dXJuIG1vZGVsVmFsdWUuZW5kO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBEYXRlUmFuZ2UodGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0LCB2YWx1ZSk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBJZiB0aGUgdXNlciBpcyBwcmVzc2luZyBiYWNrc3BhY2Ugb24gYW4gZW1wdHkgZW5kIGlucHV0LCBmb2N1cyBmb2N1cyBiYWNrIHRvIHRoZSBzdGFydC5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gQkFDS1NQQUNFICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcbiAgICAgIHRoaXMuX3JhbmdlSW5wdXQuX3N0YXJ0SW5wdXQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBzdXBlci5fb25LZXlkb3duKGV2ZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19