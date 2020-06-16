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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQXFCakQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQ3BDLElBQUksY0FBYyxDQUFtQyw2QkFBNkIsQ0FBQyxDQUFDO0FBRXhGOztHQUVHO0FBQ0g7SUFBQSxNQUNlLHlCQUNiLFNBQVEsc0JBQW9DO1FBWTVDLFlBQzhDLFdBQXVDLEVBQ25GLFVBQXdDLEVBQ2pDLHlCQUE0QyxFQUMzQyxTQUFtQixFQUNSLFdBQW1CLEVBQ25CLGdCQUFvQyxFQUMzQyxXQUEyQixFQUNELFdBQTJCO1lBQ2pFLEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBUkEsZ0JBQVcsR0FBWCxXQUFXLENBQTRCO1lB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dHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIE9wdGlvbmFsLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPbkluaXQsXG4gIEluamVjdG9yLFxuICBJbmplY3RGbGFncyxcbiAgRG9DaGVjayxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgTkdfVkFMSURBVE9SUyxcbiAgTmdGb3JtLFxuICBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gIE5nQ29udHJvbCxcbiAgVmFsaWRhdG9yRm4sXG4gIFZhbGlkYXRvcnMsXG4gIEFic3RyYWN0Q29udHJvbCxcbiAgVmFsaWRhdGlvbkVycm9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IsXG4gIG1peGluRXJyb3JTdGF0ZSxcbiAgTUFUX0RBVEVfRk9STUFUUyxcbiAgRGF0ZUFkYXB0ZXIsXG4gIE1hdERhdGVGb3JtYXRzLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRCYXNlLCBEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7RGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqIFBhcmVudCBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgd3JhcHBlZCBhcm91bmQgYE1hdFN0YXJ0RGF0ZWAgYW5kIGBNYXRFbmREYXRlYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4ge1xuICBpZDogc3RyaW5nO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkYXRlRmlsdGVyOiBEYXRlRmlsdGVyRm48RD47XG4gIHJhbmdlUGlja2VyOiB7XG4gICAgb3BlbmVkOiBib29sZWFuO1xuICAgIGlkOiBzdHJpbmc7XG4gIH07XG4gIF9zdGFydElucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZW5kSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD47XG4gIF9ncm91cERpc2FibGVkOiBib29sZWFuO1xuICBfYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmcgfCBudWxsO1xuICBfYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGw7XG4gIF9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlOiAoKSA9PiB2b2lkO1xuICBfb3BlbkRhdGVwaWNrZXI6ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIHRoZSBkYXRlIHJhbmdlIGlucHV0IHdyYXBwZXIgY29tcG9uZW50XG4gKiB0byB0aGUgcGFydHMgd2l0aG91dCBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDx1bmtub3duPj4oJ01BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSBpbmRpdmlkdWFsIGlucHV0cyB0aGF0IGNhbiBiZSBwcm9qZWN0ZWQgaW5zaWRlIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC5cbiAqL1xuQERpcmVjdGl2ZSgpXG5hYnN0cmFjdCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+XG4gIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxEYXRlUmFuZ2U8RD4+IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrIHtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBuZ0NvbnRyb2w6IE5nQ29udHJvbDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBhYnN0cmFjdCB1cGRhdGVFcnJvclN0YXRlKCk6IHZvaWQ7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92YWxpZGF0b3I6IFZhbGlkYXRvckZuIHwgbnVsbDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKTogdm9pZDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pOiBEIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcHVibGljIF9yYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0aGUgZGF0ZSBpbnB1dCB0byBwcm92aWRlIGl0c2VsZiBhcyBhIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGEgYFZhbGlkYXRvcmAsIHdoaWxlXG4gICAgLy8gaW5qZWN0aW5nIGl0cyBgTmdDb250cm9sYCBzbyB0aGF0IHRoZSBlcnJvciBzdGF0ZSBpcyBoYW5kbGVkIGNvcnJlY3RseS4gVGhpcyBpbnRyb2R1Y2VzIGFcbiAgICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5LCBiZWNhdXNlIGJvdGggYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBhbmQgYFZhbGlkYXRvcmAgZGVwZW5kIG9uIHRoZSBpbnB1dFxuICAgIC8vIGl0c2VsZi4gVXN1YWxseSB3ZSBjYW4gd29yayBhcm91bmQgaXQgZm9yIHRoZSBDVkEsIGJ1dCB0aGVyZSdzIG5vIEFQSSB0byBkbyBpdCBmb3IgdGhlXG4gICAgLy8gdmFsaWRhdG9yLiBXZSB3b3JrIGFyb3VuZCBpdCBoZXJlIGJ5IGluamVjdGluZyB0aGUgYE5nQ29udHJvbGAgaW4gYG5nT25Jbml0YCwgYWZ0ZXJcbiAgICAvLyBldmVyeXRoaW5nIGhhcyBiZWVuIHJlc29sdmVkLlxuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldChOZ0NvbnRyb2wsIG51bGwsIEluamVjdEZsYWdzLlNlbGYpO1xuXG4gICAgaWYgKG5nQ29udHJvbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wgPSBuZ0NvbnRyb2w7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZS1ldmFsdWF0ZSB0aGlzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWVcbiAgICAgIC8vIGVycm9yIHRyaWdnZXJzIHRoYXQgd2UgY2FuJ3Qgc3Vic2NyaWJlIHRvIChlLmcuIHBhcmVudCBmb3JtIHN1Ym1pc3Npb25zKS4gVGhpcyBtZWFuc1xuICAgICAgLy8gdGhhdCB3aGF0ZXZlciBsb2dpYyBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgZGVzdHJveWluZyB0aGUgcGVyZm9ybWFuY2UuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBlbXB0eS4gKi9cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwbGFjZWhvbGRlciBvZiB0aGUgaW5wdXQuICovXG4gIF9nZXRQbGFjZWhvbGRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGBpbnB1dGAgZXZlbnRzIG9uIHRoZSBpbnB1dCBlbGVtZW50LiAqL1xuICBfb25JbnB1dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIuX29uSW5wdXQodmFsdWUpO1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgZGF0ZXBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX29wZW5Qb3B1cCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9vcGVuRGF0ZXBpY2tlcigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1pbmltdW0gZGF0ZSBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgX2dldE1pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQubWluO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1heGltdW0gZGF0ZSBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgX2dldE1heERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQubWF4O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRhdGUgZmlsdGVyIGZ1bmN0aW9uIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX2dldERhdGVGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQuZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfb3V0c2lkZVZhbHVlQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAvLyBXaGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcyBvdXRzaWRlIHRoZSBpbnB1dCB3ZSBuZWVkIHRvIHJldmFsaWRhdGUsIGJlY2F1c2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBzdGF0ZSBvZiBlYWNoIG9mIHRoZSBpbnB1dHMgZGVwZW5kcyBvbiB0aGUgb3RoZXIgb25lLlxuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3BhcmVudERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Ll9ncm91cERpc2FibGVkO1xuICB9XG59XG5cbmNvbnN0IF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U6XG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgJiB0eXBlb2YgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZSA9XG4gICAgLy8gTmVlZHMgdG8gYmUgYGFzIGFueWAsIGJlY2F1c2UgdGhlIGJhc2UgY2xhc3MgaXMgYWJzdHJhY3QuXG4gICAgbWl4aW5FcnJvclN0YXRlKE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgYXMgYW55KTtcblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgc3RhcnQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTdGFydERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuaWRdJzogJ19yYW5nZUlucHV0LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGFydERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgc3RhcnQgZGF0ZSBpc24ndCBhZnRlciB0aGUgZW5kIGRhdGUuICovXG4gIHByaXZhdGUgX3N0YXJ0VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCA6IG51bGw7XG4gICAgcmV0dXJuICghc3RhcnQgfHwgIWVuZCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdFN0YXJ0RGF0ZUludmFsaWQnOiB7J2VuZCc6IGVuZCwgJ2FjdHVhbCc6IHN0YXJ0fX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX3N0YXJ0VmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5zdGFydDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgICB0aGlzLl9jdmFPbkNoYW5nZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci5fZm9ybWF0VmFsdWUodmFsdWUpO1xuXG4gICAgLy8gQW55IHRpbWUgdGhlIGlucHV0IHZhbHVlIGlzIHJlZm9ybWF0dGVkIHdlIG5lZWQgdG8gdGVsbCB0aGUgcGFyZW50LlxuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gbWlycm9yaW5nIHRoZSBpbnB1dCdzIHNpemUuICovXG4gIGdldE1pcnJvclZhbHVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDAgPyB2YWx1ZSA6IGVsZW1lbnQucGxhY2Vob2xkZXI7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKiogSW5wdXQgZm9yIGVudGVyaW5nIHRoZSBlbmQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRFbmREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX3JhbmdlSW5wdXQuX2FyaWFEZXNjcmliZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZX0sXG4gICAge3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFbmREYXRlPEQ+IGV4dGVuZHMgX01hdERhdGVSYW5nZUlucHV0QmFzZTxEPiBpbXBsZW1lbnRzIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICAvKiogVmFsaWRhdG9yIHRoYXQgY2hlY2tzIHRoYXQgdGhlIGVuZCBkYXRlIGlzbid0IGJlZm9yZSB0aGUgc3RhcnQgZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZW5kVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0IDogbnVsbDtcbiAgICByZXR1cm4gKCFlbmQgfHwgIXN0YXJ0IHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGVuZCwgc3RhcnQpID49IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RW5kRGF0ZUludmFsaWQnOiB7J3N0YXJ0Jzogc3RhcnQsICdhY3R1YWwnOiBlbmR9fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGNvbnN0cnVjdG9yIHNob3VsZG4ndCBiZSBuZWNlc3NhcnksIGJ1dCBWaWV3RW5naW5lIGRvZXNuJ3Qgc2VlbSB0b1xuICAgIC8vIGhhbmRsZSBESSBjb3JyZWN0bHkgd2hlbiBpdCBpcyBpbmhlcml0ZWQgZnJvbSBgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZWAuIFdlIGNhbiBkcm9wIHRoaXNcbiAgICAvLyBjb25zdHJ1Y3RvciBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICBzdXBlcihyYW5nZUlucHV0LCBlbGVtZW50UmVmLCBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIGluamVjdG9yLCBwYXJlbnRGb3JtLCBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICAgIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fZW5kVmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5lbmQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQsIHZhbHVlKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgICB0aGlzLl9jdmFPbkNoYW5nZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIElmIHRoZSB1c2VyIGlzIHByZXNzaW5nIGJhY2tzcGFjZSBvbiBhbiBlbXB0eSBlbmQgaW5wdXQsIG1vdmUgZm9jdXMgYmFjayB0byB0aGUgc3RhcnQuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlKSB7XG4gICAgICB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuX29uS2V5ZG93bihldmVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==