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
const _MatDateRangeInputBase = 
// Needs to be `as any`, because the base class is abstract.
mixinErrorState(MatDateRangeInputPartBase);
/** Input for entering the start date in a `mat-date-range-input`. */
export class MatStartDate extends _MatDateRangeInputBase {
    constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
        // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
        // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
        // constructor once ViewEngine is removed.
        super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
        /** Validator that checks that the start date isn't after the end date. */
        this._startValidator = (control) => {
            const start = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const end = this._model ? this._model.selection.end : null;
            return (!start || !end ||
                this._dateAdapter.compareDate(start, end) <= 0) ?
                null : { 'matStartDateInvalid': { 'end': end, 'actual': start } };
        };
        this._validator = Validators.compose([...super._getValidators(), this._startValidator]);
        this._canEmitChangeEvent = (event) => {
            return event.source !== this._rangeInput._endInput;
        };
    }
    _getValueFromModel(modelValue) {
        return modelValue.start;
    }
    _assignValueToModel(value) {
        if (this._model) {
            const range = new DateRange(value, this._model.selection.end);
            this._model.updateSelection(range, this);
            this._cvaOnChange(value);
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
                    'class': 'mat-start-date mat-date-range-input-inner',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(keydown)': '_onKeydown($event)',
                    '[attr.id]': '_rangeInput.id',
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
/** Input for entering the end date in a `mat-date-range-input`. */
export class MatEndDate extends _MatDateRangeInputBase {
    constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
        // TODO(crisbeto): this constructor shouldn't be necessary, but ViewEngine doesn't seem to
        // handle DI correctly when it is inherited from `MatDateRangeInputPartBase`. We can drop this
        // constructor once ViewEngine is removed.
        super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
        /** Validator that checks that the end date isn't before the start date. */
        this._endValidator = (control) => {
            const end = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const start = this._model ? this._model.selection.start : null;
            return (!end || !start ||
                this._dateAdapter.compareDate(end, start) >= 0) ?
                null : { 'matEndDateInvalid': { 'start': start, 'actual': end } };
        };
        this._validator = Validators.compose([...super._getValidators(), this._endValidator]);
        this._canEmitChangeEvent = (event) => {
            return event.source !== this._rangeInput._startInput;
        };
    }
    _getValueFromModel(modelValue) {
        return modelValue.end;
    }
    _assignValueToModel(value) {
        if (this._model) {
            const range = new DateRange(this._model.selection.start, value);
            this._model.updateSelection(range, this);
            this._cvaOnChange(value);
        }
    }
    _onKeydown(event) {
        // If the user is pressing backspace on an empty end input, move focus back to the start.
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
                    'class': 'mat-end-date mat-date-range-input-inner',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(keydown)': '_onKeydown($event)',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQTJCLE1BQU0sd0JBQXdCLENBQUM7QUFtQjNFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNILE1BQ2UseUJBQ2IsU0FBUSxzQkFBb0M7SUFZNUMsWUFDOEMsV0FBdUMsRUFDbkYsVUFBd0MsRUFDakMseUJBQTRDLEVBQzNDLFNBQW1CLEVBQ1IsV0FBbUIsRUFDbkIsZ0JBQW9DLEVBQzNDLFdBQTJCLEVBQ0QsV0FBMkI7UUFDakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFSQSxnQkFBVyxHQUFYLFdBQVcsQ0FBNEI7UUFFNUUs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eXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uSW5pdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdEZsYWdzLFxuICBEb0NoZWNrLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBOR19WQUxJREFUT1JTLFxuICBOZ0Zvcm0sXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTmdDb250cm9sLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbiAgQWJzdHJhY3RDb250cm9sLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBEYXRlQWRhcHRlcixcbiAgTWF0RGF0ZUZvcm1hdHMsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEJhc2UsIERhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZX0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbi8qKiBQYXJlbnQgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIHdyYXBwZWQgYXJvdW5kIGBNYXRTdGFydERhdGVgIGFuZCBgTWF0RW5kRGF0ZWAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+IHtcbiAgaWQ6IHN0cmluZztcbiAgbWluOiBEIHwgbnVsbDtcbiAgbWF4OiBEIHwgbnVsbDtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICByYW5nZVBpY2tlcjoge1xuICAgIG9wZW5lZDogYm9vbGVhbjtcbiAgICBpZDogc3RyaW5nO1xuICB9O1xuICBfc3RhcnRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2VuZElucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZ3JvdXBEaXNhYmxlZDogYm9vbGVhbjtcbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTogdm9pZDtcbiAgX29wZW5EYXRlcGlja2VyKCk6IHZvaWQ7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIHRoZSBkYXRlIHJhbmdlIGlucHV0IHdyYXBwZXIgY29tcG9uZW50XG4gKiB0byB0aGUgcGFydHMgd2l0aG91dCBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDx1bmtub3duPj4oJ01BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSBpbmRpdmlkdWFsIGlucHV0cyB0aGF0IGNhbiBiZSBwcm9qZWN0ZWQgaW5zaWRlIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC5cbiAqL1xuQERpcmVjdGl2ZSgpXG5hYnN0cmFjdCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+XG4gIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxEYXRlUmFuZ2U8RD4+IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrIHtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBuZ0NvbnRyb2w6IE5nQ29udHJvbDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBhYnN0cmFjdCB1cGRhdGVFcnJvclN0YXRlKCk6IHZvaWQ7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92YWxpZGF0b3I6IFZhbGlkYXRvckZuIHwgbnVsbDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKTogdm9pZDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pOiBEIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcHVibGljIF9yYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0aGUgZGF0ZSBpbnB1dCB0byBwcm92aWRlIGl0c2VsZiBhcyBhIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGEgYFZhbGlkYXRvcmAsIHdoaWxlXG4gICAgLy8gaW5qZWN0aW5nIGl0cyBgTmdDb250cm9sYCBzbyB0aGF0IHRoZSBlcnJvciBzdGF0ZSBpcyBoYW5kbGVkIGNvcnJlY3RseS4gVGhpcyBpbnRyb2R1Y2VzIGFcbiAgICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5LCBiZWNhdXNlIGJvdGggYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBhbmQgYFZhbGlkYXRvcmAgZGVwZW5kIG9uIHRoZSBpbnB1dFxuICAgIC8vIGl0c2VsZi4gVXN1YWxseSB3ZSBjYW4gd29yayBhcm91bmQgaXQgZm9yIHRoZSBDVkEsIGJ1dCB0aGVyZSdzIG5vIEFQSSB0byBkbyBpdCBmb3IgdGhlXG4gICAgLy8gdmFsaWRhdG9yLiBXZSB3b3JrIGFyb3VuZCBpdCBoZXJlIGJ5IGluamVjdGluZyB0aGUgYE5nQ29udHJvbGAgaW4gYG5nT25Jbml0YCwgYWZ0ZXJcbiAgICAvLyBldmVyeXRoaW5nIGhhcyBiZWVuIHJlc29sdmVkLlxuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldChOZ0NvbnRyb2wsIG51bGwsIEluamVjdEZsYWdzLlNlbGYpO1xuXG4gICAgaWYgKG5nQ29udHJvbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wgPSBuZ0NvbnRyb2w7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZS1ldmFsdWF0ZSB0aGlzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWVcbiAgICAgIC8vIGVycm9yIHRyaWdnZXJzIHRoYXQgd2UgY2FuJ3Qgc3Vic2NyaWJlIHRvIChlLmcuIHBhcmVudCBmb3JtIHN1Ym1pc3Npb25zKS4gVGhpcyBtZWFuc1xuICAgICAgLy8gdGhhdCB3aGF0ZXZlciBsb2dpYyBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgZGVzdHJveWluZyB0aGUgcGVyZm9ybWFuY2UuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBlbXB0eS4gKi9cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwbGFjZWhvbGRlciBvZiB0aGUgaW5wdXQuICovXG4gIF9nZXRQbGFjZWhvbGRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGBpbnB1dGAgZXZlbnRzIG9uIHRoZSBpbnB1dCBlbGVtZW50LiAqL1xuICBfb25JbnB1dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIuX29uSW5wdXQodmFsdWUpO1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgZGF0ZXBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX29wZW5Qb3B1cCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9vcGVuRGF0ZXBpY2tlcigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1pbmltdW0gZGF0ZSBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgX2dldE1pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQubWluO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1heGltdW0gZGF0ZSBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgX2dldE1heERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQubWF4O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRhdGUgZmlsdGVyIGZ1bmN0aW9uIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX2dldERhdGVGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQuZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfb3V0c2lkZVZhbHVlQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAvLyBXaGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcyBvdXRzaWRlIHRoZSBpbnB1dCB3ZSBuZWVkIHRvIHJldmFsaWRhdGUsIGJlY2F1c2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBzdGF0ZSBvZiBlYWNoIG9mIHRoZSBpbnB1dHMgZGVwZW5kcyBvbiB0aGUgb3RoZXIgb25lLlxuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3BhcmVudERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Ll9ncm91cERpc2FibGVkO1xuICB9XG59XG5cbmNvbnN0IF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U6XG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgJiB0eXBlb2YgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZSA9XG4gICAgLy8gTmVlZHMgdG8gYmUgYGFzIGFueWAsIGJlY2F1c2UgdGhlIGJhc2UgY2xhc3MgaXMgYWJzdHJhY3QuXG4gICAgbWl4aW5FcnJvclN0YXRlKE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgYXMgYW55KTtcblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgc3RhcnQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTdGFydERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RhcnQtZGF0ZSBtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuaWRdJzogJ19yYW5nZUlucHV0LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGFydERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgc3RhcnQgZGF0ZSBpc24ndCBhZnRlciB0aGUgZW5kIGRhdGUuICovXG4gIHByaXZhdGUgX3N0YXJ0VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kIDogbnVsbDtcbiAgICByZXR1cm4gKCFzdGFydCB8fCAhZW5kIHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKHN0YXJ0LCBlbmQpIDw9IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0U3RhcnREYXRlSW52YWxpZCc6IHsnZW5kJzogZW5kLCAnYWN0dWFsJzogc3RhcnR9fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGNvbnN0cnVjdG9yIHNob3VsZG4ndCBiZSBuZWNlc3NhcnksIGJ1dCBWaWV3RW5naW5lIGRvZXNuJ3Qgc2VlbSB0b1xuICAgIC8vIGhhbmRsZSBESSBjb3JyZWN0bHkgd2hlbiBpdCBpcyBpbmhlcml0ZWQgZnJvbSBgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZWAuIFdlIGNhbiBkcm9wIHRoaXNcbiAgICAvLyBjb25zdHJ1Y3RvciBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICBzdXBlcihyYW5nZUlucHV0LCBlbGVtZW50UmVmLCBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIGluamVjdG9yLCBwYXJlbnRGb3JtLCBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICAgIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fc3RhcnRWYWxpZGF0b3JdKTtcblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IERhdGVSYW5nZTxEPikge1xuICAgIHJldHVybiBtb2RlbFZhbHVlLnN0YXJ0O1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBEYXRlUmFuZ2UodmFsdWUsIHRoaXMuX21vZGVsLnNlbGVjdGlvbi5lbmQpO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKHJhbmdlLCB0aGlzKTtcbiAgICAgIHRoaXMuX2N2YU9uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NhbkVtaXRDaGFuZ2VFdmVudCA9IChldmVudDogRGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPERhdGVSYW5nZTxEPj4pOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gZXZlbnQuc291cmNlICE9PSB0aGlzLl9yYW5nZUlucHV0Ll9lbmRJbnB1dDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcblxuICAgIC8vIEFueSB0aW1lIHRoZSBpbnB1dCB2YWx1ZSBpcyByZWZvcm1hdHRlZCB3ZSBuZWVkIHRvIHRlbGwgdGhlIHBhcmVudC5cbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIG1pcnJvcmluZyB0aGUgaW5wdXQncyBzaXplLiAqL1xuICBnZXRNaXJyb3JWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwID8gdmFsdWUgOiBlbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgZW5kIGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0RW5kRGF0ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1lbmQtZGF0ZSBtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdEVuZERhdGUsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IE1hdEVuZERhdGUsIG11bHRpOiB0cnVlfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdEVuZERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgZW5kIGRhdGUgaXNuJ3QgYmVmb3JlIHRoZSBzdGFydCBkYXRlLiAqL1xuICBwcml2YXRlIF9lbmRWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQgOiBudWxsO1xuICAgIHJldHVybiAoIWVuZCB8fCAhc3RhcnQgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoZW5kLCBzdGFydCkgPj0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXRFbmREYXRlSW52YWxpZCc6IHsnc3RhcnQnOiBzdGFydCwgJ2FjdHVhbCc6IGVuZH19O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHJhbmdlSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIGRhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgY29uc3RydWN0b3Igc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSwgYnV0IFZpZXdFbmdpbmUgZG9lc24ndCBzZWVtIHRvXG4gICAgLy8gaGFuZGxlIERJIGNvcnJlY3RseSB3aGVuIGl0IGlzIGluaGVyaXRlZCBmcm9tIGBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlYC4gV2UgY2FuIGRyb3AgdGhpc1xuICAgIC8vIGNvbnN0cnVjdG9yIG9uY2UgVmlld0VuZ2luZSBpcyByZW1vdmVkLlxuICAgIHN1cGVyKHJhbmdlSW5wdXQsIGVsZW1lbnRSZWYsIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgaW5qZWN0b3IsIHBhcmVudEZvcm0sIHBhcmVudEZvcm1Hcm91cCxcbiAgICAgICAgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFsuLi5zdXBlci5fZ2V0VmFsaWRhdG9ycygpLCB0aGlzLl9lbmRWYWxpZGF0b3JdKTtcblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IERhdGVSYW5nZTxEPikge1xuICAgIHJldHVybiBtb2RlbFZhbHVlLmVuZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgRGF0ZVJhbmdlKHRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCwgdmFsdWUpO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKHJhbmdlLCB0aGlzKTtcbiAgICAgIHRoaXMuX2N2YU9uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NhbkVtaXRDaGFuZ2VFdmVudCA9IChldmVudDogRGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPERhdGVSYW5nZTxEPj4pOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gZXZlbnQuc291cmNlICE9PSB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0O1xuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIElmIHRoZSB1c2VyIGlzIHByZXNzaW5nIGJhY2tzcGFjZSBvbiBhbiBlbXB0eSBlbmQgaW5wdXQsIG1vdmUgZm9jdXMgYmFjayB0byB0aGUgc3RhcnQuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlKSB7XG4gICAgICB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuX29uS2V5ZG93bihldmVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==