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
 * Used to provide the date range input wrapper component
 * to the parts without circular dependencies.
 */
export const MAT_DATE_RANGE_INPUT_PARENT = new InjectionToken('MAT_DATE_RANGE_INPUT_PARENT');
/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 */
let MatDateRangeInputPartBase = /** @class */ (() => {
    class MatDateRangeInputPartBase extends MatDatepickerInputBase {
        constructor(_rangeInput, elementRef, _defaultErrorStateMatcher, _injector, _parentForm, _parentFormGroup, dateAdapter, dateFormats) {
            super(elementRef, dateAdapter, dateFormats);
            this._rangeInput = _rangeInput;
            this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
            this._injector = _injector;
            this._parentForm = _parentForm;
            this._parentFormGroup = _parentFormGroup;
            this._outsideValueChanged = () => {
                // Whenever the value changes outside the input we need to revalidate, because
                // the validation state of each of the inputs depends on the other one.
                this._validatorOnChange();
            };
        }
        ngOnInit() {
            // We need the date input to provide itself as a `ControlValueAccessor` and a `Validator`, while
            // injecting its `NgControl` so that the error state is handled correctly. This introduces a
            // circular dependency, because both `ControlValueAccessor` and `Validator` depend on the input
            // itself. Usually we can work around it for the CVA, but there's no API to do it for the
            // validator. We work around it here by injecting the `NgControl` in `ngOnInit`, after
            // everything has been resolved.
            const ngControl = this._injector.get(NgControl, null, InjectFlags.Self);
            if (ngControl) {
                this.ngControl = ngControl;
            }
        }
        ngDoCheck() {
            if (this.ngControl) {
                // We need to re-evaluate this on every change detection cycle, because there are some
                // error triggers that we can't subscribe to (e.g. parent form submissions). This means
                // that whatever logic is in here has to be super lean or we risk destroying the performance.
                this.updateErrorState();
            }
        }
        /** Gets whether the input is empty. */
        isEmpty() {
            return this._elementRef.nativeElement.value.length === 0;
        }
        /** Focuses the input. */
        focus() {
            this._elementRef.nativeElement.focus();
        }
        /** Handles `input` events on the input element. */
        _onInput(value) {
            super._onInput(value);
            this._rangeInput._handleChildValueChange();
        }
        /** Opens the datepicker associated with the input. */
        _openPopup() {
            this._rangeInput._openDatepicker();
        }
        /** Gets the minimum date from the range input. */
        _getMinDate() {
            return this._rangeInput.min;
        }
        /** Gets the maximum date from the range input. */
        _getMaxDate() {
            return this._rangeInput.max;
        }
        /** Gets the date filter function from the range input. */
        _getDateFilter() {
            return this._rangeInput.dateFilter;
        }
        _parentDisabled() {
            return this._rangeInput._groupDisabled;
        }
        _registerModel(model) {
            // The very first time the range inputs write their values, they don't know about the value
            // of the opposite input. When this is combined with the fact that `NgModel` defers writing
            // its value with a `Promise.resolve`, we can get into a situation where the first input
            // resets the value of the second. We work around it by deferring the registration of
            // the model, allowing the input enough time to assign the initial value.
            Promise.resolve().then(() => super._registerModel(model));
        }
    }
    MatDateRangeInputPartBase.decorators = [
        { type: Directive }
    ];
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
const _MatDateRangeInputBase = 
// Needs to be `as any`, because the base class is abstract.
mixinErrorState(MatDateRangeInputPartBase);
/** Input for entering the start date in a `mat-date-range-input`. */
let MatStartDate = /** @class */ (() => {
    class MatStartDate extends _MatDateRangeInputBase {
        constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
            // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
            // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
            // constructor once ViewEngine is removed.
            super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
            /** Validator that checks that the start date isn't after the end date. */
            this._startValidator = (control) => {
                const start = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const end = this._model ? this._model.selection.end : null;
                return (!start || !end ||
                    this._dateAdapter.compareDate(start, end) <= 0) ?
                    null : { 'matStartDateInvalid': { 'end': end, 'actual': start } };
            };
            this._validator = Validators.compose([...super._getValidators(), this._startValidator]);
        }
        _getValueFromModel(modelValue) {
            return modelValue.start;
        }
        _assignValueToModel(value) {
            if (this._model) {
                const range = new DateRange(value, this._model.selection.end);
                this._model.updateSelection(range, this);
            }
        }
        _formatValue(value) {
            super._formatValue(value);
            // Any time the input value is reformatted we need to tell the parent.
            this._rangeInput._handleChildValueChange();
        }
        /** Gets the value that should be used when mirroring the input's size. */
        getMirrorValue() {
            const element = this._elementRef.nativeElement;
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
/** Input for entering the end date in a `mat-date-range-input`. */
let MatEndDate = /** @class */ (() => {
    class MatEndDate extends _MatDateRangeInputBase {
        constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
            // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
            // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
            // constructor once ViewEngine is removed.
            super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
            /** Validator that checks that the end date isn't before the start date. */
            this._endValidator = (control) => {
                const end = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const start = this._model ? this._model.selection.start : null;
                return (!end || !start ||
                    this._dateAdapter.compareDate(end, start) >= 0) ?
                    null : { 'matEndDateInvalid': { 'start': start, 'actual': end } };
            };
            this._validator = Validators.compose([...super._getValidators(), this._endValidator]);
        }
        _getValueFromModel(modelValue) {
            return modelValue.end;
        }
        _assignValueToModel(value) {
            if (this._model) {
                const range = new DateRange(this._model.selection.start, value);
                this._model.updateSelection(range, this);
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQXdCLE1BQU0sd0JBQXdCLENBQUM7QUFxQnhFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNIO0lBQUEsTUFDZSx5QkFDYixTQUFRLHNCQUFvQztRQVk1QyxZQUM4QyxXQUF1QyxFQUNuRixVQUF3QyxFQUNqQyx5QkFBNEMsRUFDM0MsU0FBbUIsRUFDUixXQUFtQixFQUNuQixnQkFBb0MsRUFDM0MsV0FBMkIsRUFDRCxXQUEyQjtZQUNqRSxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQVJBLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtZ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eXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uSW5pdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdEZsYWdzLFxuICBEb0NoZWNrLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBOR19WQUxJREFUT1JTLFxuICBOZ0Zvcm0sXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTmdDb250cm9sLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbiAgQWJzdHJhY3RDb250cm9sLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBEYXRlQWRhcHRlcixcbiAgTWF0RGF0ZUZvcm1hdHMsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEJhc2UsIERhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbi8qKiBQYXJlbnQgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIHdyYXBwZWQgYXJvdW5kIGBNYXRTdGFydERhdGVgIGFuZCBgTWF0RW5kRGF0ZWAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+IHtcbiAgaWQ6IHN0cmluZztcbiAgbWluOiBEIHwgbnVsbDtcbiAgbWF4OiBEIHwgbnVsbDtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICByYW5nZVBpY2tlcjoge1xuICAgIG9wZW5lZDogYm9vbGVhbjtcbiAgICBpZDogc3RyaW5nO1xuICB9O1xuICBfc3RhcnRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2VuZElucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZ3JvdXBEaXNhYmxlZDogYm9vbGVhbjtcbiAgX2FyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbDtcbiAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsO1xuICBfaGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZTogKCkgPT4gdm9pZDtcbiAgX29wZW5EYXRlcGlja2VyOiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSB0aGUgZGF0ZSByYW5nZSBpbnB1dCB3cmFwcGVyIGNvbXBvbmVudFxuICogdG8gdGhlIHBhcnRzIHdpdGhvdXQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8dW5rbm93bj4+KCdNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQnKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgaW5kaXZpZHVhbCBpbnB1dHMgdGhhdCBjYW4gYmUgcHJvamVjdGVkIGluc2lkZSBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuXG4gKi9cbkBEaXJlY3RpdmUoKVxuYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPlxuICBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEJhc2U8RGF0ZVJhbmdlPEQ+PiBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjayB7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2w7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgYWJzdHJhY3QgdXBkYXRlRXJyb3JTdGF0ZSgpOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCk6IHZvaWQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHB1YmxpYyBfcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhlIGRhdGUgaW5wdXQgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGFuZCBhIGBWYWxpZGF0b3JgLCB3aGlsZVxuICAgIC8vIGluamVjdGluZyBpdHMgYE5nQ29udHJvbGAgc28gdGhhdCB0aGUgZXJyb3Igc3RhdGUgaXMgaGFuZGxlZCBjb3JyZWN0bHkuIFRoaXMgaW50cm9kdWNlcyBhXG4gICAgLy8gY2lyY3VsYXIgZGVwZW5kZW5jeSwgYmVjYXVzZSBib3RoIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGBWYWxpZGF0b3JgIGRlcGVuZCBvbiB0aGUgaW5wdXRcbiAgICAvLyBpdHNlbGYuIFVzdWFsbHkgd2UgY2FuIHdvcmsgYXJvdW5kIGl0IGZvciB0aGUgQ1ZBLCBidXQgdGhlcmUncyBubyBBUEkgdG8gZG8gaXQgZm9yIHRoZVxuICAgIC8vIHZhbGlkYXRvci4gV2Ugd29yayBhcm91bmQgaXQgaGVyZSBieSBpbmplY3RpbmcgdGhlIGBOZ0NvbnRyb2xgIGluIGBuZ09uSW5pdGAsIGFmdGVyXG4gICAgLy8gZXZlcnl0aGluZyBoYXMgYmVlbiByZXNvbHZlZC5cbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQoTmdDb250cm9sLCBudWxsLCBJbmplY3RGbGFncy5TZWxmKTtcblxuICAgIGlmIChuZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMubmdDb250cm9sID0gbmdDb250cm9sO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYGlucHV0YCBldmVudHMgb24gdGhlIGlucHV0IGVsZW1lbnQuICovXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5fb25JbnB1dCh2YWx1ZSk7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5faGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfb3BlblBvcHVwKCk6IHZvaWQge1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX29wZW5EYXRlcGlja2VyKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWluaW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBfZ2V0TWluRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5taW47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBfZ2V0TWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5tYXg7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGF0ZSBmaWx0ZXIgZnVuY3Rpb24gZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfZ2V0RGF0ZUZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5kYXRlRmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9vdXRzaWRlVmFsdWVDaGFuZ2VkID0gKCkgPT4ge1xuICAgIC8vIFdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzIG91dHNpZGUgdGhlIGlucHV0IHdlIG5lZWQgdG8gcmV2YWxpZGF0ZSwgYmVjYXVzZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIHN0YXRlIG9mIGVhY2ggb2YgdGhlIGlucHV0cyBkZXBlbmRzIG9uIHRoZSBvdGhlciBvbmUuXG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcGFyZW50RGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQuX2dyb3VwRGlzYWJsZWQ7XG4gIH1cblxuICBfcmVnaXN0ZXJNb2RlbChtb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPiwgRD4pIHtcbiAgICAvLyBUaGUgdmVyeSBmaXJzdCB0aW1lIHRoZSByYW5nZSBpbnB1dHMgd3JpdGUgdGhlaXIgdmFsdWVzLCB0aGV5IGRvbid0IGtub3cgYWJvdXQgdGhlIHZhbHVlXG4gICAgLy8gb2YgdGhlIG9wcG9zaXRlIGlucHV0LiBXaGVuIHRoaXMgaXMgY29tYmluZWQgd2l0aCB0aGUgZmFjdCB0aGF0IGBOZ01vZGVsYCBkZWZlcnMgd3JpdGluZ1xuICAgIC8vIGl0cyB2YWx1ZSB3aXRoIGEgYFByb21pc2UucmVzb2x2ZWAsIHdlIGNhbiBnZXQgaW50byBhIHNpdHVhdGlvbiB3aGVyZSB0aGUgZmlyc3QgaW5wdXRcbiAgICAvLyByZXNldHMgdGhlIHZhbHVlIG9mIHRoZSBzZWNvbmQuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IGRlZmVycmluZyB0aGUgcmVnaXN0cmF0aW9uIG9mXG4gICAgLy8gdGhlIG1vZGVsLCBhbGxvd2luZyB0aGUgaW5wdXQgZW5vdWdoIHRpbWUgdG8gYXNzaWduIHRoZSBpbml0aWFsIHZhbHVlLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gc3VwZXIuX3JlZ2lzdGVyTW9kZWwobW9kZWwpKTtcbiAgfVxufVxuXG5jb25zdCBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlOlxuICAgIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgdHlwZW9mIE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgPVxuICAgIC8vIE5lZWRzIHRvIGJlIGBhcyBhbnlgLCBiZWNhdXNlIHRoZSBiYXNlIGNsYXNzIGlzIGFic3RyYWN0LlxuICAgIG1peGluRXJyb3JTdGF0ZShNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlIGFzIGFueSk7XG5cbi8qKiBJbnB1dCBmb3IgZW50ZXJpbmcgdGhlIHN0YXJ0IGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0U3RhcnREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmlkXSc6ICdfcmFuZ2VJbnB1dC5pZCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFEZXNjcmliZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXRTdGFydERhdGUsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RhcnREYXRlPEQ+IGV4dGVuZHMgX01hdERhdGVSYW5nZUlucHV0QmFzZTxEPiBpbXBsZW1lbnRzIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICAvKiogVmFsaWRhdG9yIHRoYXQgY2hlY2tzIHRoYXQgdGhlIHN0YXJ0IGRhdGUgaXNuJ3QgYWZ0ZXIgdGhlIGVuZCBkYXRlLiAqL1xuICBwcml2YXRlIF9zdGFydFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbi5lbmQgOiBudWxsO1xuICAgIHJldHVybiAoIXN0YXJ0IHx8ICFlbmQgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoc3RhcnQsIGVuZCkgPD0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXRTdGFydERhdGVJbnZhbGlkJzogeydlbmQnOiBlbmQsICdhY3R1YWwnOiBzdGFydH19O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHJhbmdlSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIGRhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgY29uc3RydWN0b3Igc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSwgYnV0IFZpZXdFbmdpbmUgZG9lc24ndCBzZWVtIHRvXG4gICAgLy8gaGFuZGxlIERJIGNvcnJlY3RseSB3aGVuIGl0IGlzIGluaGVyaXRlZCBmcm9tIGBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlYC4gV2UgY2FuIGRyb3AgdGhpc1xuICAgIC8vIGNvbnN0cnVjdG9yIG9uY2UgVmlld0VuZ2luZSBpcyByZW1vdmVkLlxuICAgIHN1cGVyKHJhbmdlSW5wdXQsIGVsZW1lbnRSZWYsIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgaW5qZWN0b3IsIHBhcmVudEZvcm0sIHBhcmVudEZvcm1Hcm91cCxcbiAgICAgICAgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFsuLi5zdXBlci5fZ2V0VmFsaWRhdG9ycygpLCB0aGlzLl9zdGFydFZhbGlkYXRvcl0pO1xuXG4gIHByb3RlY3RlZCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgcmV0dXJuIG1vZGVsVmFsdWUuc3RhcnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh2YWx1ZSwgdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcblxuICAgIC8vIEFueSB0aW1lIHRoZSBpbnB1dCB2YWx1ZSBpcyByZWZvcm1hdHRlZCB3ZSBuZWVkIHRvIHRlbGwgdGhlIHBhcmVudC5cbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIG1pcnJvcmluZyB0aGUgaW5wdXQncyBzaXplLiAqL1xuICBnZXRNaXJyb3JWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwID8gdmFsdWUgOiBlbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgZW5kIGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0RW5kRGF0ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0LWlubmVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19yYW5nZUlucHV0Ll9hcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19yYW5nZUlucHV0Ll9hcmlhRGVzY3JpYmVkQnknLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXI/Lm9wZW5lZCAmJiBfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnX2dldE1pbkRhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1pbkRhdGUoKSkgOiBudWxsJyxcbiAgICAnW2F0dHIubWF4XSc6ICdfZ2V0TWF4RGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWF4RGF0ZSgpKSA6IG51bGwnLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAndHlwZSc6ICd0ZXh0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTWF0RW5kRGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0RW5kRGF0ZSwgbXVsdGk6IHRydWV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RW5kRGF0ZTxEPiBleHRlbmRzIF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U8RD4gaW1wbGVtZW50cyBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgLyoqIFZhbGlkYXRvciB0aGF0IGNoZWNrcyB0aGF0IHRoZSBlbmQgZGF0ZSBpc24ndCBiZWZvcmUgdGhlIHN0YXJ0IGRhdGUuICovXG4gIHByaXZhdGUgX2VuZFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCA6IG51bGw7XG4gICAgcmV0dXJuICghZW5kIHx8ICFzdGFydCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShlbmQsIHN0YXJ0KSA+PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdEVuZERhdGVJbnZhbGlkJzogeydzdGFydCc6IHN0YXJ0LCAnYWN0dWFsJzogZW5kfX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX2VuZFZhbGlkYXRvcl0pO1xuXG4gIHByb3RlY3RlZCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgcmV0dXJuIG1vZGVsVmFsdWUuZW5kO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBEYXRlUmFuZ2UodGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0LCB2YWx1ZSk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBJZiB0aGUgdXNlciBpcyBwcmVzc2luZyBiYWNrc3BhY2Ugb24gYW4gZW1wdHkgZW5kIGlucHV0LCBmb2N1cyBmb2N1cyBiYWNrIHRvIHRoZSBzdGFydC5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gQkFDS1NQQUNFICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcbiAgICAgIHRoaXMuX3JhbmdlSW5wdXQuX3N0YXJ0SW5wdXQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBzdXBlci5fb25LZXlkb3duKGV2ZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19