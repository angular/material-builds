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
        /** Gets the placeholder of the input. */
        _getPlaceholder() {
            return this._elementRef.nativeElement.placeholder;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQXdCLE1BQU0sd0JBQXdCLENBQUM7QUFxQnhFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNIO0lBQUEsTUFDZSx5QkFDYixTQUFRLHNCQUFvQztRQVk1QyxZQUM4QyxXQUF1QyxFQUNuRixVQUF3QyxFQUNqQyx5QkFBNEMsRUFDM0MsU0FBbUIsRUFDUixXQUFtQixFQUNuQixnQkFBb0MsRUFDM0MsV0FBMkIsRUFDRCxXQUEyQjtZQUNqRSxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQVJBLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtZ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QUMsZ0JBQWdCOztJQWdDeEMsaUJBQUM7S0FBQTtTQWxEWSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uSW5pdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdEZsYWdzLFxuICBEb0NoZWNrLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBOR19WQUxJREFUT1JTLFxuICBOZ0Zvcm0sXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTmdDb250cm9sLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbiAgQWJzdHJhY3RDb250cm9sLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBEYXRlQWRhcHRlcixcbiAgTWF0RGF0ZUZvcm1hdHMsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEJhc2UsIERhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbi8qKiBQYXJlbnQgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIHdyYXBwZWQgYXJvdW5kIGBNYXRTdGFydERhdGVgIGFuZCBgTWF0RW5kRGF0ZWAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+IHtcbiAgaWQ6IHN0cmluZztcbiAgbWluOiBEIHwgbnVsbDtcbiAgbWF4OiBEIHwgbnVsbDtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICByYW5nZVBpY2tlcjoge1xuICAgIG9wZW5lZDogYm9vbGVhbjtcbiAgICBpZDogc3RyaW5nO1xuICB9O1xuICBfc3RhcnRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2VuZElucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZ3JvdXBEaXNhYmxlZDogYm9vbGVhbjtcbiAgX2FyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbDtcbiAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsO1xuICBfaGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZTogKCkgPT4gdm9pZDtcbiAgX29wZW5EYXRlcGlja2VyOiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSB0aGUgZGF0ZSByYW5nZSBpbnB1dCB3cmFwcGVyIGNvbXBvbmVudFxuICogdG8gdGhlIHBhcnRzIHdpdGhvdXQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8dW5rbm93bj4+KCdNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQnKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgaW5kaXZpZHVhbCBpbnB1dHMgdGhhdCBjYW4gYmUgcHJvamVjdGVkIGluc2lkZSBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuXG4gKi9cbkBEaXJlY3RpdmUoKVxuYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPlxuICBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEJhc2U8RGF0ZVJhbmdlPEQ+PiBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjayB7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2w7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgYWJzdHJhY3QgdXBkYXRlRXJyb3JTdGF0ZSgpOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCk6IHZvaWQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHB1YmxpYyBfcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhlIGRhdGUgaW5wdXQgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGFuZCBhIGBWYWxpZGF0b3JgLCB3aGlsZVxuICAgIC8vIGluamVjdGluZyBpdHMgYE5nQ29udHJvbGAgc28gdGhhdCB0aGUgZXJyb3Igc3RhdGUgaXMgaGFuZGxlZCBjb3JyZWN0bHkuIFRoaXMgaW50cm9kdWNlcyBhXG4gICAgLy8gY2lyY3VsYXIgZGVwZW5kZW5jeSwgYmVjYXVzZSBib3RoIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGBWYWxpZGF0b3JgIGRlcGVuZCBvbiB0aGUgaW5wdXRcbiAgICAvLyBpdHNlbGYuIFVzdWFsbHkgd2UgY2FuIHdvcmsgYXJvdW5kIGl0IGZvciB0aGUgQ1ZBLCBidXQgdGhlcmUncyBubyBBUEkgdG8gZG8gaXQgZm9yIHRoZVxuICAgIC8vIHZhbGlkYXRvci4gV2Ugd29yayBhcm91bmQgaXQgaGVyZSBieSBpbmplY3RpbmcgdGhlIGBOZ0NvbnRyb2xgIGluIGBuZ09uSW5pdGAsIGFmdGVyXG4gICAgLy8gZXZlcnl0aGluZyBoYXMgYmVlbiByZXNvbHZlZC5cbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQoTmdDb250cm9sLCBudWxsLCBJbmplY3RGbGFncy5TZWxmKTtcblxuICAgIGlmIChuZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMubmdDb250cm9sID0gbmdDb250cm9sO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGxhY2Vob2xkZXIgb2YgdGhlIGlucHV0LiAqL1xuICBfZ2V0UGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBgaW5wdXRgIGV2ZW50cyBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgX29uSW5wdXQodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLl9vbklucHV0KHZhbHVlKTtcbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGRhdGVwaWNrZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9vcGVuUG9wdXAoKTogdm9pZCB7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5fb3BlbkRhdGVwaWNrZXIoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIGRhdGUgZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF9nZXRNaW5EYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtYXhpbXVtIGRhdGUgZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF9nZXRNYXhEYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Lm1heDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGZpbHRlciBmdW5jdGlvbiBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9nZXREYXRlRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgX291dHNpZGVWYWx1ZUNoYW5nZWQgPSAoKSA9PiB7XG4gICAgLy8gV2hlbmV2ZXIgdGhlIHZhbHVlIGNoYW5nZXMgb3V0c2lkZSB0aGUgaW5wdXQgd2UgbmVlZCB0byByZXZhbGlkYXRlLCBiZWNhdXNlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gc3RhdGUgb2YgZWFjaCBvZiB0aGUgaW5wdXRzIGRlcGVuZHMgb24gdGhlIG90aGVyIG9uZS5cbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wYXJlbnREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuXG4gIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+LCBEPikge1xuICAgIC8vIFRoZSB2ZXJ5IGZpcnN0IHRpbWUgdGhlIHJhbmdlIGlucHV0cyB3cml0ZSB0aGVpciB2YWx1ZXMsIHRoZXkgZG9uJ3Qga25vdyBhYm91dCB0aGUgdmFsdWVcbiAgICAvLyBvZiB0aGUgb3Bwb3NpdGUgaW5wdXQuIFdoZW4gdGhpcyBpcyBjb21iaW5lZCB3aXRoIHRoZSBmYWN0IHRoYXQgYE5nTW9kZWxgIGRlZmVycyB3cml0aW5nXG4gICAgLy8gaXRzIHZhbHVlIHdpdGggYSBgUHJvbWlzZS5yZXNvbHZlYCwgd2UgY2FuIGdldCBpbnRvIGEgc2l0dWF0aW9uIHdoZXJlIHRoZSBmaXJzdCBpbnB1dFxuICAgIC8vIHJlc2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNlY29uZC4gV2Ugd29yayBhcm91bmQgaXQgYnkgZGVmZXJyaW5nIHRoZSByZWdpc3RyYXRpb24gb2ZcbiAgICAvLyB0aGUgbW9kZWwsIGFsbG93aW5nIHRoZSBpbnB1dCBlbm91Z2ggdGltZSB0byBhc3NpZ24gdGhlIGluaXRpYWwgdmFsdWUuXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBzdXBlci5fcmVnaXN0ZXJNb2RlbChtb2RlbCkpO1xuICB9XG59XG5cbmNvbnN0IF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U6XG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgJiB0eXBlb2YgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZSA9XG4gICAgLy8gTmVlZHMgdG8gYmUgYGFzIGFueWAsIGJlY2F1c2UgdGhlIGJhc2UgY2xhc3MgaXMgYWJzdHJhY3QuXG4gICAgbWl4aW5FcnJvclN0YXRlKE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgYXMgYW55KTtcblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgc3RhcnQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTdGFydERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuaWRdJzogJ19yYW5nZUlucHV0LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGFydERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgc3RhcnQgZGF0ZSBpc24ndCBhZnRlciB0aGUgZW5kIGRhdGUuICovXG4gIHByaXZhdGUgX3N0YXJ0VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCA6IG51bGw7XG4gICAgcmV0dXJuICghc3RhcnQgfHwgIWVuZCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdFN0YXJ0RGF0ZUludmFsaWQnOiB7J2VuZCc6IGVuZCwgJ2FjdHVhbCc6IHN0YXJ0fX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX3N0YXJ0VmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5zdGFydDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci5fZm9ybWF0VmFsdWUodmFsdWUpO1xuXG4gICAgLy8gQW55IHRpbWUgdGhlIGlucHV0IHZhbHVlIGlzIHJlZm9ybWF0dGVkIHdlIG5lZWQgdG8gdGVsbCB0aGUgcGFyZW50LlxuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gbWlycm9yaW5nIHRoZSBpbnB1dCdzIHNpemUuICovXG4gIGdldE1pcnJvclZhbHVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDAgPyB2YWx1ZSA6IGVsZW1lbnQucGxhY2Vob2xkZXI7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKiogSW5wdXQgZm9yIGVudGVyaW5nIHRoZSBlbmQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRFbmREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFEZXNjcmliZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZX0sXG4gICAge3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFbmREYXRlPEQ+IGV4dGVuZHMgX01hdERhdGVSYW5nZUlucHV0QmFzZTxEPiBpbXBsZW1lbnRzIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICAvKiogVmFsaWRhdG9yIHRoYXQgY2hlY2tzIHRoYXQgdGhlIGVuZCBkYXRlIGlzbid0IGJlZm9yZSB0aGUgc3RhcnQgZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZW5kVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0IDogbnVsbDtcbiAgICByZXR1cm4gKCFlbmQgfHwgIXN0YXJ0IHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGVuZCwgc3RhcnQpID49IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RW5kRGF0ZUludmFsaWQnOiB7J3N0YXJ0Jzogc3RhcnQsICdhY3R1YWwnOiBlbmR9fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGNvbnN0cnVjdG9yIHNob3VsZG4ndCBiZSBuZWNlc3NhcnksIGJ1dCBWaWV3RW5naW5lIGRvZXNuJ3Qgc2VlbSB0b1xuICAgIC8vIGhhbmRsZSBESSBjb3JyZWN0bHkgd2hlbiBpdCBpcyBpbmhlcml0ZWQgZnJvbSBgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZWAuIFdlIGNhbiBkcm9wIHRoaXNcbiAgICAvLyBjb25zdHJ1Y3RvciBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICBzdXBlcihyYW5nZUlucHV0LCBlbGVtZW50UmVmLCBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIGluamVjdG9yLCBwYXJlbnRGb3JtLCBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICAgIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fZW5kVmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5lbmQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQsIHZhbHVlKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIElmIHRoZSB1c2VyIGlzIHByZXNzaW5nIGJhY2tzcGFjZSBvbiBhbiBlbXB0eSBlbmQgaW5wdXQsIGZvY3VzIGZvY3VzIGJhY2sgdG8gdGhlIHN0YXJ0LlxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBCQUNLU1BBQ0UgJiYgIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSkge1xuICAgICAgdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dC5mb2N1cygpO1xuICAgIH1cblxuICAgIHN1cGVyLl9vbktleWRvd24oZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=