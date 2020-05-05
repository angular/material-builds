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
export class MatStartDate extends _MatDateRangeInputBase {
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
export class MatEndDate extends _MatDateRangeInputBase {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQXdCLE1BQU0sd0JBQXdCLENBQUM7Ozs7OztBQUd4RSw2Q0FZQzs7O0lBWEMscUNBQVc7O0lBQ1gsc0NBQWM7O0lBQ2Qsc0NBQWM7O0lBQ2QsNkNBQTRCOztJQUM1Qiw4Q0FBMEM7O0lBQzFDLDRDQUF3Qzs7SUFDeEMsaURBQXdCOztJQUN4QixtREFBZ0M7O0lBQ2hDLGtEQUErQjs7SUFDL0IsMERBQW9DOztJQUNwQyxrREFBNEI7Ozs7Ozs7QUFPOUIsTUFBTSxPQUFPLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUM7Ozs7OztBQUt2RixNQUNlLHlCQUNiLFNBQVEsc0JBQW9DOzs7Ozs7Ozs7OztJQVk1QyxZQUM4QyxXQUF1QyxFQUNuRixVQUF3QyxFQUNqQyx5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dUJBMFFSLFFBQVE7NENBQ1IsUUFBUSxZQUFJLE1BQU0sU0FBQyxnQkFBZ0I7Ozs7SUErQnRDLHNDQUFnRDs7Ozs7O0lBL0NoRCxtQ0FNQzs7Ozs7SUFtQkQsZ0NBQTJGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uSW5pdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdEZsYWdzLFxuICBEb0NoZWNrLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBOR19WQUxJREFUT1JTLFxuICBOZ0Zvcm0sXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTmdDb250cm9sLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbiAgQWJzdHJhY3RDb250cm9sLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBEYXRlQWRhcHRlcixcbiAgTWF0RGF0ZUZvcm1hdHMsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEJhc2UsIERhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbi8qKiBQYXJlbnQgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIHdyYXBwZWQgYXJvdW5kIGBNYXRTdGFydERhdGVgIGFuZCBgTWF0RW5kRGF0ZWAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+IHtcbiAgaWQ6IHN0cmluZztcbiAgbWluOiBEIHwgbnVsbDtcbiAgbWF4OiBEIHwgbnVsbDtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICBfc3RhcnRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2VuZElucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZ3JvdXBEaXNhYmxlZDogYm9vbGVhbjtcbiAgX2FyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbDtcbiAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsO1xuICBfaGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZTogKCkgPT4gdm9pZDtcbiAgX29wZW5EYXRlcGlja2VyOiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSB0aGUgZGF0ZSByYW5nZSBpbnB1dCB3cmFwcGVyIGNvbXBvbmVudFxuICogdG8gdGhlIHBhcnRzIHdpdGhvdXQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8dW5rbm93bj4+KCdNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQnKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgaW5kaXZpZHVhbCBpbnB1dHMgdGhhdCBjYW4gYmUgcHJvamVjdGVkIGluc2lkZSBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuXG4gKi9cbkBEaXJlY3RpdmUoKVxuYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPlxuICBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEJhc2U8RGF0ZVJhbmdlPEQ+PiBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjayB7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2w7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgYWJzdHJhY3QgdXBkYXRlRXJyb3JTdGF0ZSgpOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCk6IHZvaWQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHB1YmxpYyBfcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhlIGRhdGUgaW5wdXQgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGFuZCBhIGBWYWxpZGF0b3JgLCB3aGlsZVxuICAgIC8vIGluamVjdGluZyBpdHMgYE5nQ29udHJvbGAgc28gdGhhdCB0aGUgZXJyb3Igc3RhdGUgaXMgaGFuZGxlZCBjb3JyZWN0bHkuIFRoaXMgaW50cm9kdWNlcyBhXG4gICAgLy8gY2lyY3VsYXIgZGVwZW5kZW5jeSwgYmVjYXVzZSBib3RoIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGBWYWxpZGF0b3JgIGRlcGVuZCBvbiB0aGUgaW5wdXRcbiAgICAvLyBpdHNlbGYuIFVzdWFsbHkgd2UgY2FuIHdvcmsgYXJvdW5kIGl0IGZvciB0aGUgQ1ZBLCBidXQgdGhlcmUncyBubyBBUEkgdG8gZG8gaXQgZm9yIHRoZVxuICAgIC8vIHZhbGlkYXRvci4gV2Ugd29yayBhcm91bmQgaXQgaGVyZSBieSBpbmplY3RpbmcgdGhlIGBOZ0NvbnRyb2xgIGluIGBuZ09uSW5pdGAsIGFmdGVyXG4gICAgLy8gZXZlcnl0aGluZyBoYXMgYmVlbiByZXNvbHZlZC5cbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQoTmdDb250cm9sLCBudWxsLCBJbmplY3RGbGFncy5TZWxmKTtcblxuICAgIGlmIChuZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMubmdDb250cm9sID0gbmdDb250cm9sO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYGlucHV0YCBldmVudHMgb24gdGhlIGlucHV0IGVsZW1lbnQuICovXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5fb25JbnB1dCh2YWx1ZSk7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5faGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfb3BlblBvcHVwKCk6IHZvaWQge1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX29wZW5EYXRlcGlja2VyKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWluaW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX2dldE1pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQubWluO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1heGltdW0gZGF0ZSBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9nZXRNYXhEYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Lm1heDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGZpbHRlciBmdW5jdGlvbiBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9nZXREYXRlRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgX291dHNpZGVWYWx1ZUNoYW5nZWQgPSAoKSA9PiB7XG4gICAgLy8gV2hlbmV2ZXIgdGhlIHZhbHVlIGNoYW5nZXMgb3V0c2lkZSB0aGUgaW5wdXQgd2UgbmVlZCB0byByZXZhbGlkYXRlLCBiZWNhdXNlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gc3RhdGUgb2YgZWFjaCBvZiB0aGUgaW5wdXRzIGRlcGVuZHMgb24gdGhlIG90aGVyIG9uZS5cbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wYXJlbnREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuXG4gIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+LCBEPikge1xuICAgIC8vIFRoZSB2ZXJ5IGZpcnN0IHRpbWUgdGhlIHJhbmdlIGlucHV0cyB3cml0ZSB0aGVpciB2YWx1ZXMsIHRoZXkgZG9uJ3Qga25vdyBhYm91dCB0aGUgdmFsdWVcbiAgICAvLyBvZiB0aGUgb3Bwb3NpdGUgaW5wdXQuIFdoZW4gdGhpcyBpcyBjb21iaW5lZCB3aXRoIHRoZSBmYWN0IHRoYXQgYE5nTW9kZWxgIGRlZmVycyB3cml0aW5nXG4gICAgLy8gaXRzIHZhbHVlIHdpdGggYSBgUHJvbWlzZS5yZXNvbHZlYCwgd2UgY2FuIGdldCBpbnRvIGEgc2l0dWF0aW9uIHdoZXJlIHRoZSBmaXJzdCBpbnB1dFxuICAgIC8vIHJlc2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNlY29uZC4gV2Ugd29yayBhcm91bmQgaXQgYnkgZGVmZXJyaW5nIHRoZSByZWdpc3RyYXRpb24gb2ZcbiAgICAvLyB0aGUgbW9kZWwsIGFsbG93aW5nIHRoZSBpbnB1dCBlbm91Z2ggdGltZSB0byBhc3NpZ24gdGhlIGluaXRpYWwgdmFsdWUuXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBzdXBlci5fcmVnaXN0ZXJNb2RlbChtb2RlbCkpO1xuICB9XG59XG5cbmNvbnN0IF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U6XG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgJiB0eXBlb2YgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZSA9XG4gICAgLy8gTmVlZHMgdG8gYmUgYGFzIGFueWAsIGJlY2F1c2UgdGhlIGJhc2UgY2xhc3MgaXMgYWJzdHJhY3QuXG4gICAgbWl4aW5FcnJvclN0YXRlKE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgYXMgYW55KTtcblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgc3RhcnQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTdGFydERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuaWRdJzogJ19yYW5nZUlucHV0LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGFydERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgc3RhcnQgZGF0ZSBpc24ndCBhZnRlciB0aGUgZW5kIGRhdGUuICovXG4gIHByaXZhdGUgX3N0YXJ0VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCA6IG51bGw7XG4gICAgcmV0dXJuICghc3RhcnQgfHwgIWVuZCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdFN0YXJ0RGF0ZUludmFsaWQnOiB7J2VuZCc6IGVuZCwgJ2FjdHVhbCc6IHN0YXJ0fX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX3N0YXJ0VmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5zdGFydDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci5fZm9ybWF0VmFsdWUodmFsdWUpO1xuXG4gICAgLy8gQW55IHRpbWUgdGhlIGlucHV0IHZhbHVlIGlzIHJlZm9ybWF0dGVkIHdlIG5lZWQgdG8gdGVsbCB0aGUgcGFyZW50LlxuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gbWlycm9yaW5nIHRoZSBpbnB1dCdzIHNpemUuICovXG4gIGdldE1pcnJvclZhbHVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDAgPyB2YWx1ZSA6IGVsZW1lbnQucGxhY2Vob2xkZXI7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKiogSW5wdXQgZm9yIGVudGVyaW5nIHRoZSBlbmQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRFbmREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFEZXNjcmliZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZX0sXG4gICAge3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFbmREYXRlPEQ+IGV4dGVuZHMgX01hdERhdGVSYW5nZUlucHV0QmFzZTxEPiBpbXBsZW1lbnRzIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICAvKiogVmFsaWRhdG9yIHRoYXQgY2hlY2tzIHRoYXQgdGhlIGVuZCBkYXRlIGlzbid0IGJlZm9yZSB0aGUgc3RhcnQgZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZW5kVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0IDogbnVsbDtcbiAgICByZXR1cm4gKCFlbmQgfHwgIXN0YXJ0IHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGVuZCwgc3RhcnQpID49IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RW5kRGF0ZUludmFsaWQnOiB7J3N0YXJ0Jzogc3RhcnQsICdhY3R1YWwnOiBlbmR9fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGNvbnN0cnVjdG9yIHNob3VsZG4ndCBiZSBuZWNlc3NhcnksIGJ1dCBWaWV3RW5naW5lIGRvZXNuJ3Qgc2VlbSB0b1xuICAgIC8vIGhhbmRsZSBESSBjb3JyZWN0bHkgd2hlbiBpdCBpcyBpbmhlcml0ZWQgZnJvbSBgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZWAuIFdlIGNhbiBkcm9wIHRoaXNcbiAgICAvLyBjb25zdHJ1Y3RvciBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICBzdXBlcihyYW5nZUlucHV0LCBlbGVtZW50UmVmLCBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIGluamVjdG9yLCBwYXJlbnRGb3JtLCBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICAgIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fZW5kVmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5lbmQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQsIHZhbHVlKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIElmIHRoZSB1c2VyIGlzIHByZXNzaW5nIGJhY2tzcGFjZSBvbiBhbiBlbXB0eSBlbmQgaW5wdXQsIGZvY3VzIGZvY3VzIGJhY2sgdG8gdGhlIHN0YXJ0LlxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBCQUNLU1BBQ0UgJiYgIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSkge1xuICAgICAgdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dC5mb2N1cygpO1xuICAgIH1cblxuICAgIHN1cGVyLl9vbktleWRvd24oZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=