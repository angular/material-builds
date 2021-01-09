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
    _shouldHandleChangeEvent({ source }) {
        return source !== this._rangeInput._startInput && source !== this._rangeInput._endInput;
    }
    _assignValueProgrammatically(value) {
        super._assignValueProgrammatically(value);
        const opposite = (this === this._rangeInput._startInput ? this._rangeInput._endInput :
            this._rangeInput._startInput);
        opposite === null || opposite === void 0 ? void 0 : opposite._validatorOnChange();
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
    }
    ngOnInit() {
        // Normally this happens automatically, but it seems to break if not added explicitly when all
        // of the criteria below are met:
        // 1) The class extends a TS mixin.
        // 2) The application is running in ViewEngine.
        // 3) The application is being transpiled through tsickle.
        // This can be removed once google3 is completely migrated to Ivy.
        super.ngOnInit();
    }
    ngDoCheck() {
        // Normally this happens automatically, but it seems to break if not added explicitly when all
        // of the criteria below are met:
        // 1) The class extends a TS mixin.
        // 2) The application is running in ViewEngine.
        // 3) The application is being transpiled through tsickle.
        // This can be removed once google3 is completely migrated to Ivy.
        super.ngDoCheck();
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
                ],
                // These need to be specified explicitly, because some tooling doesn't
                // seem to pick them up from the base class. See #20932.
                outputs: ['dateChange', 'dateInput'],
                inputs: ['errorStateMatcher']
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
    }
    ngOnInit() {
        // Normally this happens automatically, but it seems to break if not added explicitly when all
        // of the criteria below are met:
        // 1) The class extends a TS mixin.
        // 2) The application is running in ViewEngine.
        // 3) The application is being transpiled through tsickle.
        // This can be removed once google3 is completely migrated to Ivy.
        super.ngOnInit();
    }
    ngDoCheck() {
        // Normally this happens automatically, but it seems to break if not added explicitly when all
        // of the criteria below are met:
        // 1) The class extends a TS mixin.
        // 2) The application is running in ViewEngine.
        // 3) The application is being transpiled through tsickle.
        // This can be removed once google3 is completely migrated to Ivy.
        super.ngDoCheck();
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
                ],
                // These need to be specified explicitly, because some tooling doesn't
                // seem to pick them up from the base class. See #20932.
                outputs: ['dateChange', 'dateInput'],
                inputs: ['errorStateMatcher']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQTJCLE1BQU0sd0JBQXdCLENBQUM7QUFtQjNFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNILE1BQ2UseUJBQ2IsU0FBUSxzQkFBb0M7SUFZNUMsWUFDOEMsV0FBdUMsRUFDbkYsVUFBd0MsRUFDakMseUJBQTRDLEVBQzNDLFNBQW1CLEVBQ1IsV0FBbUIsRUFDbkIsZ0JBQW9DLEVBQzNDLFdBQTJCLEVBQ0QsV0FBMkI7UUFDakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFSQSxnQkFBVyxHQUFYLFdBQVcsQ0FBNEI7UUFFNUUs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WUFBWSxFQUFFLFVBQVU7b0JBQ3hCLFNBQVMsRUFBRSwrQkFBK0I7b0JBQzFDLFVBQVUsRUFBRSxhQUFhO29CQUN6QixXQUFXLEVBQUUsb0JBQW9CO29CQUNqQyxzQkFBc0IsRUFBRSwyQ0FBMkM7b0JBQ25FLGtCQUFrQixFQUFFLHlFQUF5RTtvQkFDN0YsWUFBWSxFQUFFLDhEQUE4RDtvQkFDNUUsWUFBWSxFQUFFLDhEQUE4RDtvQkFDNUUsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLE1BQU0sRUFBRSxNQUFNO2lCQUNmO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQ2xFLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7aUJBQy9EO2dCQUNELHNFQUFzRTtnQkFDdEUsd0RBQXdEO2dCQUN4RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO2dCQUNwQyxNQUFNLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzthQUM5Qjs7OzRDQWFJLE1BQU0sU0FBQywyQkFBMkI7WUEzVHJDLFVBQVU7WUEyQlYsaUJBQWlCO1lBdEJqQixRQUFRO1lBT1IsTUFBTSx1QkFtVEgsUUFBUTtZQWxUWCxrQkFBa0IsdUJBbVRmLFFBQVE7WUF2U1gsV0FBVyx1QkF3U1IsUUFBUTs0Q0FDUixRQUFRLFlBQUksTUFBTSxTQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIE9wdGlvbmFsLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPbkluaXQsXG4gIEluamVjdG9yLFxuICBJbmplY3RGbGFncyxcbiAgRG9DaGVjayxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgTkdfVkFMSURBVE9SUyxcbiAgTmdGb3JtLFxuICBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gIE5nQ29udHJvbCxcbiAgVmFsaWRhdG9yRm4sXG4gIFZhbGlkYXRvcnMsXG4gIEFic3RyYWN0Q29udHJvbCxcbiAgVmFsaWRhdGlvbkVycm9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IsXG4gIG1peGluRXJyb3JTdGF0ZSxcbiAgTUFUX0RBVEVfRk9STUFUUyxcbiAgRGF0ZUFkYXB0ZXIsXG4gIE1hdERhdGVGb3JtYXRzLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRCYXNlLCBEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7RGF0ZVJhbmdlLCBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2V9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuXG4vKiogUGFyZW50IGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSB3cmFwcGVkIGFyb3VuZCBgTWF0U3RhcnREYXRlYCBhbmQgYE1hdEVuZERhdGVgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPiB7XG4gIGlkOiBzdHJpbmc7XG4gIG1pbjogRCB8IG51bGw7XG4gIG1heDogRCB8IG51bGw7XG4gIGRhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcbiAgcmFuZ2VQaWNrZXI6IHtcbiAgICBvcGVuZWQ6IGJvb2xlYW47XG4gICAgaWQ6IHN0cmluZztcbiAgfTtcbiAgX3N0YXJ0SW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD47XG4gIF9lbmRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2dyb3VwRGlzYWJsZWQ6IGJvb2xlYW47XG4gIF9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk6IHZvaWQ7XG4gIF9vcGVuRGF0ZXBpY2tlcigpOiB2b2lkO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSB0aGUgZGF0ZSByYW5nZSBpbnB1dCB3cmFwcGVyIGNvbXBvbmVudFxuICogdG8gdGhlIHBhcnRzIHdpdGhvdXQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8dW5rbm93bj4+KCdNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQnKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgaW5kaXZpZHVhbCBpbnB1dHMgdGhhdCBjYW4gYmUgcHJvamVjdGVkIGluc2lkZSBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuXG4gKi9cbkBEaXJlY3RpdmUoKVxuYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPlxuICBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEJhc2U8RGF0ZVJhbmdlPEQ+PiBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjayB7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2w7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgYWJzdHJhY3QgdXBkYXRlRXJyb3JTdGF0ZSgpOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCk6IHZvaWQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHB1YmxpYyBfcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhlIGRhdGUgaW5wdXQgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGFuZCBhIGBWYWxpZGF0b3JgLCB3aGlsZVxuICAgIC8vIGluamVjdGluZyBpdHMgYE5nQ29udHJvbGAgc28gdGhhdCB0aGUgZXJyb3Igc3RhdGUgaXMgaGFuZGxlZCBjb3JyZWN0bHkuIFRoaXMgaW50cm9kdWNlcyBhXG4gICAgLy8gY2lyY3VsYXIgZGVwZW5kZW5jeSwgYmVjYXVzZSBib3RoIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGBWYWxpZGF0b3JgIGRlcGVuZCBvbiB0aGUgaW5wdXRcbiAgICAvLyBpdHNlbGYuIFVzdWFsbHkgd2UgY2FuIHdvcmsgYXJvdW5kIGl0IGZvciB0aGUgQ1ZBLCBidXQgdGhlcmUncyBubyBBUEkgdG8gZG8gaXQgZm9yIHRoZVxuICAgIC8vIHZhbGlkYXRvci4gV2Ugd29yayBhcm91bmQgaXQgaGVyZSBieSBpbmplY3RpbmcgdGhlIGBOZ0NvbnRyb2xgIGluIGBuZ09uSW5pdGAsIGFmdGVyXG4gICAgLy8gZXZlcnl0aGluZyBoYXMgYmVlbiByZXNvbHZlZC5cbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQoTmdDb250cm9sLCBudWxsLCBJbmplY3RGbGFncy5TZWxmKTtcblxuICAgIGlmIChuZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMubmdDb250cm9sID0gbmdDb250cm9sO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGxhY2Vob2xkZXIgb2YgdGhlIGlucHV0LiAqL1xuICBfZ2V0UGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBgaW5wdXRgIGV2ZW50cyBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgX29uSW5wdXQodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLl9vbklucHV0KHZhbHVlKTtcbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGRhdGVwaWNrZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9vcGVuUG9wdXAoKTogdm9pZCB7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5fb3BlbkRhdGVwaWNrZXIoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIGRhdGUgZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF9nZXRNaW5EYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtYXhpbXVtIGRhdGUgZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF9nZXRNYXhEYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Lm1heDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGZpbHRlciBmdW5jdGlvbiBmcm9tIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9nZXREYXRlRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3BhcmVudERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Ll9ncm91cERpc2FibGVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9zaG91bGRIYW5kbGVDaGFuZ2VFdmVudCh7c291cmNlfTogRGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPERhdGVSYW5nZTxEPj4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gc291cmNlICE9PSB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0ICYmIHNvdXJjZSAhPT0gdGhpcy5fcmFuZ2VJbnB1dC5fZW5kSW5wdXQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlUHJvZ3JhbW1hdGljYWxseSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci5fYXNzaWduVmFsdWVQcm9ncmFtbWF0aWNhbGx5KHZhbHVlKTtcbiAgICBjb25zdCBvcHBvc2l0ZSA9ICh0aGlzID09PSB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0ID8gdGhpcy5fcmFuZ2VJbnB1dC5fZW5kSW5wdXQgOlxuICAgICAgICB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0KSBhcyBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+IHwgdW5kZWZpbmVkO1xuICAgIG9wcG9zaXRlPy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxufVxuXG5jb25zdCBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlOlxuICAgIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgdHlwZW9mIE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2UgPVxuICAgIC8vIE5lZWRzIHRvIGJlIGBhcyBhbnlgLCBiZWNhdXNlIHRoZSBiYXNlIGNsYXNzIGlzIGFic3RyYWN0LlxuICAgIG1peGluRXJyb3JTdGF0ZShNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlIGFzIGFueSk7XG5cbi8qKiBJbnB1dCBmb3IgZW50ZXJpbmcgdGhlIHN0YXJ0IGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0U3RhcnREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0YXJ0LWRhdGUgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmlkXSc6ICdfcmFuZ2VJbnB1dC5pZCcsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXRTdGFydERhdGUsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9XG4gIF0sXG4gIC8vIFRoZXNlIG5lZWQgdG8gYmUgc3BlY2lmaWVkIGV4cGxpY2l0bHksIGJlY2F1c2Ugc29tZSB0b29saW5nIGRvZXNuJ3RcbiAgLy8gc2VlbSB0byBwaWNrIHRoZW0gdXAgZnJvbSB0aGUgYmFzZSBjbGFzcy4gU2VlICMyMDkzMi5cbiAgb3V0cHV0czogWydkYXRlQ2hhbmdlJywgJ2RhdGVJbnB1dCddLFxuICBpbnB1dHM6IFsnZXJyb3JTdGF0ZU1hdGNoZXInXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGFydERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHNcbiAgICBDYW5VcGRhdGVFcnJvclN0YXRlLCBEb0NoZWNrLCBPbkluaXQge1xuICAvKiogVmFsaWRhdG9yIHRoYXQgY2hlY2tzIHRoYXQgdGhlIHN0YXJ0IGRhdGUgaXNuJ3QgYWZ0ZXIgdGhlIGVuZCBkYXRlLiAqL1xuICBwcml2YXRlIF9zdGFydFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCA6IG51bGw7XG4gICAgcmV0dXJuICghc3RhcnQgfHwgIWVuZCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShzdGFydCwgZW5kKSA8PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdFN0YXJ0RGF0ZUludmFsaWQnOiB7J2VuZCc6IGVuZCwgJ2FjdHVhbCc6IHN0YXJ0fX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gTm9ybWFsbHkgdGhpcyBoYXBwZW5zIGF1dG9tYXRpY2FsbHksIGJ1dCBpdCBzZWVtcyB0byBicmVhayBpZiBub3QgYWRkZWQgZXhwbGljaXRseSB3aGVuIGFsbFxuICAgIC8vIG9mIHRoZSBjcml0ZXJpYSBiZWxvdyBhcmUgbWV0OlxuICAgIC8vIDEpIFRoZSBjbGFzcyBleHRlbmRzIGEgVFMgbWl4aW4uXG4gICAgLy8gMikgVGhlIGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW4gVmlld0VuZ2luZS5cbiAgICAvLyAzKSBUaGUgYXBwbGljYXRpb24gaXMgYmVpbmcgdHJhbnNwaWxlZCB0aHJvdWdoIHRzaWNrbGUuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVtb3ZlZCBvbmNlIGdvb2dsZTMgaXMgY29tcGxldGVseSBtaWdyYXRlZCB0byBJdnkuXG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICAvLyBOb3JtYWxseSB0aGlzIGhhcHBlbnMgYXV0b21hdGljYWxseSwgYnV0IGl0IHNlZW1zIHRvIGJyZWFrIGlmIG5vdCBhZGRlZCBleHBsaWNpdGx5IHdoZW4gYWxsXG4gICAgLy8gb2YgdGhlIGNyaXRlcmlhIGJlbG93IGFyZSBtZXQ6XG4gICAgLy8gMSkgVGhlIGNsYXNzIGV4dGVuZHMgYSBUUyBtaXhpbi5cbiAgICAvLyAyKSBUaGUgYXBwbGljYXRpb24gaXMgcnVubmluZyBpbiBWaWV3RW5naW5lLlxuICAgIC8vIDMpIFRoZSBhcHBsaWNhdGlvbiBpcyBiZWluZyB0cmFuc3BpbGVkIHRocm91Z2ggdHNpY2tsZS5cbiAgICAvLyBUaGlzIGNhbiBiZSByZW1vdmVkIG9uY2UgZ29vZ2xlMyBpcyBjb21wbGV0ZWx5IG1pZ3JhdGVkIHRvIEl2eS5cbiAgICBzdXBlci5uZ0RvQ2hlY2soKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFsuLi5zdXBlci5fZ2V0VmFsaWRhdG9ycygpLCB0aGlzLl9zdGFydFZhbGlkYXRvcl0pO1xuXG4gIHByb3RlY3RlZCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KSB7XG4gICAgcmV0dXJuIG1vZGVsVmFsdWUuc3RhcnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh2YWx1ZSwgdGhpcy5fbW9kZWwuc2VsZWN0aW9uLmVuZCk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcblxuICAgIC8vIEFueSB0aW1lIHRoZSBpbnB1dCB2YWx1ZSBpcyByZWZvcm1hdHRlZCB3ZSBuZWVkIHRvIHRlbGwgdGhlIHBhcmVudC5cbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIG1pcnJvcmluZyB0aGUgaW5wdXQncyBzaXplLiAqL1xuICBnZXRNaXJyb3JWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwID8gdmFsdWUgOiBlbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgZW5kIGRhdGUgaW4gYSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXRgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0RW5kRGF0ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1lbmQtZGF0ZSBtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdEVuZERhdGUsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IE1hdEVuZERhdGUsIG11bHRpOiB0cnVlfVxuICBdLFxuICAvLyBUaGVzZSBuZWVkIHRvIGJlIHNwZWNpZmllZCBleHBsaWNpdGx5LCBiZWNhdXNlIHNvbWUgdG9vbGluZyBkb2Vzbid0XG4gIC8vIHNlZW0gdG8gcGljayB0aGVtIHVwIGZyb20gdGhlIGJhc2UgY2xhc3MuIFNlZSAjMjA5MzIuXG4gIG91dHB1dHM6IFsnZGF0ZUNoYW5nZScsICdkYXRlSW5wdXQnXSxcbiAgaW5wdXRzOiBbJ2Vycm9yU3RhdGVNYXRjaGVyJ11cbn0pXG5leHBvcnQgY2xhc3MgTWF0RW5kRGF0ZTxEPiBleHRlbmRzIF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U8RD4gaW1wbGVtZW50c1xuICAgIENhblVwZGF0ZUVycm9yU3RhdGUsIERvQ2hlY2ssIE9uSW5pdCB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgZW5kIGRhdGUgaXNuJ3QgYmVmb3JlIHRoZSBzdGFydCBkYXRlLiAqL1xuICBwcml2YXRlIF9lbmRWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQgOiBudWxsO1xuICAgIHJldHVybiAoIWVuZCB8fCAhc3RhcnQgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoZW5kLCBzdGFydCkgPj0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXRFbmREYXRlSW52YWxpZCc6IHsnc3RhcnQnOiBzdGFydCwgJ2FjdHVhbCc6IGVuZH19O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHJhbmdlSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIGRhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgY29uc3RydWN0b3Igc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSwgYnV0IFZpZXdFbmdpbmUgZG9lc24ndCBzZWVtIHRvXG4gICAgLy8gaGFuZGxlIERJIGNvcnJlY3RseSB3aGVuIGl0IGlzIGluaGVyaXRlZCBmcm9tIGBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlYC4gV2UgY2FuIGRyb3AgdGhpc1xuICAgIC8vIGNvbnN0cnVjdG9yIG9uY2UgVmlld0VuZ2luZSBpcyByZW1vdmVkLlxuICAgIHN1cGVyKHJhbmdlSW5wdXQsIGVsZW1lbnRSZWYsIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgaW5qZWN0b3IsIHBhcmVudEZvcm0sIHBhcmVudEZvcm1Hcm91cCxcbiAgICAgICAgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIE5vcm1hbGx5IHRoaXMgaGFwcGVucyBhdXRvbWF0aWNhbGx5LCBidXQgaXQgc2VlbXMgdG8gYnJlYWsgaWYgbm90IGFkZGVkIGV4cGxpY2l0bHkgd2hlbiBhbGxcbiAgICAvLyBvZiB0aGUgY3JpdGVyaWEgYmVsb3cgYXJlIG1ldDpcbiAgICAvLyAxKSBUaGUgY2xhc3MgZXh0ZW5kcyBhIFRTIG1peGluLlxuICAgIC8vIDIpIFRoZSBhcHBsaWNhdGlvbiBpcyBydW5uaW5nIGluIFZpZXdFbmdpbmUuXG4gICAgLy8gMykgVGhlIGFwcGxpY2F0aW9uIGlzIGJlaW5nIHRyYW5zcGlsZWQgdGhyb3VnaCB0c2lja2xlLlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlbW92ZWQgb25jZSBnb29nbGUzIGlzIGNvbXBsZXRlbHkgbWlncmF0ZWQgdG8gSXZ5LlxuICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgLy8gTm9ybWFsbHkgdGhpcyBoYXBwZW5zIGF1dG9tYXRpY2FsbHksIGJ1dCBpdCBzZWVtcyB0byBicmVhayBpZiBub3QgYWRkZWQgZXhwbGljaXRseSB3aGVuIGFsbFxuICAgIC8vIG9mIHRoZSBjcml0ZXJpYSBiZWxvdyBhcmUgbWV0OlxuICAgIC8vIDEpIFRoZSBjbGFzcyBleHRlbmRzIGEgVFMgbWl4aW4uXG4gICAgLy8gMikgVGhlIGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW4gVmlld0VuZ2luZS5cbiAgICAvLyAzKSBUaGUgYXBwbGljYXRpb24gaXMgYmVpbmcgdHJhbnNwaWxlZCB0aHJvdWdoIHRzaWNrbGUuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVtb3ZlZCBvbmNlIGdvb2dsZTMgaXMgY29tcGxldGVseSBtaWdyYXRlZCB0byBJdnkuXG4gICAgc3VwZXIubmdEb0NoZWNrKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fZW5kVmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5lbmQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IERhdGVSYW5nZSh0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQsIHZhbHVlKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIElmIHRoZSB1c2VyIGlzIHByZXNzaW5nIGJhY2tzcGFjZSBvbiBhbiBlbXB0eSBlbmQgaW5wdXQsIG1vdmUgZm9jdXMgYmFjayB0byB0aGUgc3RhcnQuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlKSB7XG4gICAgICB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuX29uS2V5ZG93bihldmVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==