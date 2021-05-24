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
        // tslint:disable-next-line:no-bitwise
        const ngControl = this._injector.get(NgControl, null, InjectFlags.Self | InjectFlags.Optional);
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
const _MatDateRangeInputBase = mixinErrorState(MatDateRangeInputPartBase);
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
    _shouldHandleChangeEvent(change) {
        var _a;
        if (!super._shouldHandleChangeEvent(change)) {
            return false;
        }
        else {
            return !((_a = change.oldValue) === null || _a === void 0 ? void 0 : _a.start) ? !!change.selection.start :
                !change.selection.start ||
                    !!this._dateAdapter.compareDate(change.oldValue.start, change.selection.start);
        }
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
    _shouldHandleChangeEvent(change) {
        var _a;
        if (!super._shouldHandleChangeEvent(change)) {
            return false;
        }
        else {
            return !((_a = change.oldValue) === null || _a === void 0 ? void 0 : _a.end) ? !!change.selection.end :
                !change.selection.end ||
                    !!this._dateAdapter.compareDate(change.oldValue.end, change.selection.end);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBRUwsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQTJCLE1BQU0sd0JBQXdCLENBQUM7QUFtQjNFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNILE1BQ2UseUJBQ2IsU0FBUSxzQkFBb0M7SUFZNUMsWUFDOEMsV0FBdUMsRUFDbkYsVUFBd0MsRUFDakMseUJBQTRDLEVBQzNDLFNBQW1CLEVBQ1IsV0FBbUIsRUFDbkIsZ0JBQW9DLEVBQzNDLFdBQTJCLEVBQ0QsV0FBMkI7UUFDakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFSQSxnQkFBVyxHQUFYLFdBQVcsQ0FBNEI7UUFFNUUs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LEVBQUUsMkNBQTJDO29CQUNuRSxrQkFBa0IsRUFBRSx5RUFBeUU7b0JBQzdGLFlBQVksRUFBRSw4REFBOEQ7b0JBQzVFLFlBQVksRUFBRSw4REFBOEQ7b0JBQzVFLFFBQVEsRUFBRSxXQUFXO29CQUNyQixNQUFNLEVBQUUsTUFBTTtpQkFDZjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO29CQUNsRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO2lCQUMvRDtnQkFDRCxzRUFBc0U7Z0JBQ3RFLHdEQUF3RDtnQkFDeEQsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQztnQkFDcEMsTUFBTSxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDOUI7Ozs0Q0FhSSxNQUFNLFNBQUMsMkJBQTJCO1lBbFVyQyxVQUFVO1lBMEJWLGlCQUFpQjtZQXJCakIsUUFBUTtZQU9SLE1BQU0sdUJBMFRILFFBQVE7WUF6VFgsa0JBQWtCLHVCQTBUZixRQUFRO1lBL1NYLFdBQVcsdUJBZ1RSLFFBQVE7NENBQ1IsUUFBUSxZQUFJLE1BQU0sU0FBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT25Jbml0LFxuICBJbmplY3RvcixcbiAgSW5qZWN0RmxhZ3MsXG4gIERvQ2hlY2ssXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5nRm9ybSxcbiAgRm9ybUdyb3VwRGlyZWN0aXZlLFxuICBOZ0NvbnRyb2wsXG4gIFZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzLFxuICBBYnN0cmFjdENvbnRyb2wsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIG1peGluRXJyb3JTdGF0ZSxcbiAgTUFUX0RBVEVfRk9STUFUUyxcbiAgRGF0ZUFkYXB0ZXIsXG4gIE1hdERhdGVGb3JtYXRzLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRCYXNlLCBEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7RGF0ZVJhbmdlLCBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2V9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuXG4vKiogUGFyZW50IGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSB3cmFwcGVkIGFyb3VuZCBgTWF0U3RhcnREYXRlYCBhbmQgYE1hdEVuZERhdGVgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPiB7XG4gIGlkOiBzdHJpbmc7XG4gIG1pbjogRCB8IG51bGw7XG4gIG1heDogRCB8IG51bGw7XG4gIGRhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcbiAgcmFuZ2VQaWNrZXI6IHtcbiAgICBvcGVuZWQ6IGJvb2xlYW47XG4gICAgaWQ6IHN0cmluZztcbiAgfTtcbiAgX3N0YXJ0SW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD47XG4gIF9lbmRJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPjtcbiAgX2dyb3VwRGlzYWJsZWQ6IGJvb2xlYW47XG4gIF9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk6IHZvaWQ7XG4gIF9vcGVuRGF0ZXBpY2tlcigpOiB2b2lkO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSB0aGUgZGF0ZSByYW5nZSBpbnB1dCB3cmFwcGVyIGNvbXBvbmVudFxuICogdG8gdGhlIHBhcnRzIHdpdGhvdXQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8dW5rbm93bj4+KCdNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQnKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgaW5kaXZpZHVhbCBpbnB1dHMgdGhhdCBjYW4gYmUgcHJvamVjdGVkIGluc2lkZSBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuXG4gKi9cbkBEaXJlY3RpdmUoKVxuYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPlxuICBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEJhc2U8RGF0ZVJhbmdlPEQ+PiBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjayB7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2w7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgYWJzdHJhY3QgdXBkYXRlRXJyb3JTdGF0ZSgpOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCk6IHZvaWQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRGF0ZVJhbmdlPEQ+KTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHB1YmxpYyBfcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhlIGRhdGUgaW5wdXQgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGFuZCBhIGBWYWxpZGF0b3JgLCB3aGlsZVxuICAgIC8vIGluamVjdGluZyBpdHMgYE5nQ29udHJvbGAgc28gdGhhdCB0aGUgZXJyb3Igc3RhdGUgaXMgaGFuZGxlZCBjb3JyZWN0bHkuIFRoaXMgaW50cm9kdWNlcyBhXG4gICAgLy8gY2lyY3VsYXIgZGVwZW5kZW5jeSwgYmVjYXVzZSBib3RoIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGBWYWxpZGF0b3JgIGRlcGVuZCBvbiB0aGUgaW5wdXRcbiAgICAvLyBpdHNlbGYuIFVzdWFsbHkgd2UgY2FuIHdvcmsgYXJvdW5kIGl0IGZvciB0aGUgQ1ZBLCBidXQgdGhlcmUncyBubyBBUEkgdG8gZG8gaXQgZm9yIHRoZVxuICAgIC8vIHZhbGlkYXRvci4gV2Ugd29yayBhcm91bmQgaXQgaGVyZSBieSBpbmplY3RpbmcgdGhlIGBOZ0NvbnRyb2xgIGluIGBuZ09uSW5pdGAsIGFmdGVyXG4gICAgLy8gZXZlcnl0aGluZyBoYXMgYmVlbiByZXNvbHZlZC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldChOZ0NvbnRyb2wsIG51bGwsIEluamVjdEZsYWdzLlNlbGYgfCBJbmplY3RGbGFncy5PcHRpb25hbCk7XG5cbiAgICBpZiAobmdDb250cm9sKSB7XG4gICAgICB0aGlzLm5nQ29udHJvbCA9IG5nQ29udHJvbDtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGlucHV0IGlzIGVtcHR5LiAqL1xuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dC4gKi9cbiAgX2dldFBsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGxhY2Vob2xkZXI7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYGlucHV0YCBldmVudHMgb24gdGhlIGlucHV0IGVsZW1lbnQuICovXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5fb25JbnB1dCh2YWx1ZSk7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5faGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfb3BlblBvcHVwKCk6IHZvaWQge1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX29wZW5EYXRlcGlja2VyKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWluaW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBfZ2V0TWluRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5taW47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBfZ2V0TWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5tYXg7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGF0ZSBmaWx0ZXIgZnVuY3Rpb24gZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfZ2V0RGF0ZUZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5kYXRlRmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wYXJlbnREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoe3NvdXJjZX06IERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxEYXRlUmFuZ2U8RD4+KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHNvdXJjZSAhPT0gdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dCAmJiBzb3VyY2UgIT09IHRoaXMuX3JhbmdlSW5wdXQuX2VuZElucHV0O1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVByb2dyYW1tYXRpY2FsbHkodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIuX2Fzc2lnblZhbHVlUHJvZ3JhbW1hdGljYWxseSh2YWx1ZSk7XG4gICAgY29uc3Qgb3Bwb3NpdGUgPSAodGhpcyA9PT0gdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dCA/IHRoaXMuX3JhbmdlSW5wdXQuX2VuZElucHV0IDpcbiAgICAgICAgdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dCkgYXMgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZTxEPiB8IHVuZGVmaW5lZDtcbiAgICBvcHBvc2l0ZT8uX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cbn1cblxuY29uc3QgX01hdERhdGVSYW5nZUlucHV0QmFzZSA9IG1peGluRXJyb3JTdGF0ZShNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlKTtcblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgc3RhcnQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRTdGFydERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RhcnQtZGF0ZSBtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuaWRdJzogJ19yYW5nZUlucHV0LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdFN0YXJ0RGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZX1cbiAgXSxcbiAgLy8gVGhlc2UgbmVlZCB0byBiZSBzcGVjaWZpZWQgZXhwbGljaXRseSwgYmVjYXVzZSBzb21lIHRvb2xpbmcgZG9lc24ndFxuICAvLyBzZWVtIHRvIHBpY2sgdGhlbSB1cCBmcm9tIHRoZSBiYXNlIGNsYXNzLiBTZWUgIzIwOTMyLlxuICBvdXRwdXRzOiBbJ2RhdGVDaGFuZ2UnLCAnZGF0ZUlucHV0J10sXG4gIGlucHV0czogWydlcnJvclN0YXRlTWF0Y2hlciddXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0YXJ0RGF0ZTxEPiBleHRlbmRzIF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U8RD4gaW1wbGVtZW50c1xuICAgIENhblVwZGF0ZUVycm9yU3RhdGUsIERvQ2hlY2ssIE9uSW5pdCB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgc3RhcnQgZGF0ZSBpc24ndCBhZnRlciB0aGUgZW5kIGRhdGUuICovXG4gIHByaXZhdGUgX3N0YXJ0VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kIDogbnVsbDtcbiAgICByZXR1cm4gKCFzdGFydCB8fCAhZW5kIHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKHN0YXJ0LCBlbmQpIDw9IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0U3RhcnREYXRlSW52YWxpZCc6IHsnZW5kJzogZW5kLCAnYWN0dWFsJzogc3RhcnR9fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGNvbnN0cnVjdG9yIHNob3VsZG4ndCBiZSBuZWNlc3NhcnksIGJ1dCBWaWV3RW5naW5lIGRvZXNuJ3Qgc2VlbSB0b1xuICAgIC8vIGhhbmRsZSBESSBjb3JyZWN0bHkgd2hlbiBpdCBpcyBpbmhlcml0ZWQgZnJvbSBgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZWAuIFdlIGNhbiBkcm9wIHRoaXNcbiAgICAvLyBjb25zdHJ1Y3RvciBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICBzdXBlcihyYW5nZUlucHV0LCBlbGVtZW50UmVmLCBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIGluamVjdG9yLCBwYXJlbnRGb3JtLCBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICAgIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBOb3JtYWxseSB0aGlzIGhhcHBlbnMgYXV0b21hdGljYWxseSwgYnV0IGl0IHNlZW1zIHRvIGJyZWFrIGlmIG5vdCBhZGRlZCBleHBsaWNpdGx5IHdoZW4gYWxsXG4gICAgLy8gb2YgdGhlIGNyaXRlcmlhIGJlbG93IGFyZSBtZXQ6XG4gICAgLy8gMSkgVGhlIGNsYXNzIGV4dGVuZHMgYSBUUyBtaXhpbi5cbiAgICAvLyAyKSBUaGUgYXBwbGljYXRpb24gaXMgcnVubmluZyBpbiBWaWV3RW5naW5lLlxuICAgIC8vIDMpIFRoZSBhcHBsaWNhdGlvbiBpcyBiZWluZyB0cmFuc3BpbGVkIHRocm91Z2ggdHNpY2tsZS5cbiAgICAvLyBUaGlzIGNhbiBiZSByZW1vdmVkIG9uY2UgZ29vZ2xlMyBpcyBjb21wbGV0ZWx5IG1pZ3JhdGVkIHRvIEl2eS5cbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIC8vIE5vcm1hbGx5IHRoaXMgaGFwcGVucyBhdXRvbWF0aWNhbGx5LCBidXQgaXQgc2VlbXMgdG8gYnJlYWsgaWYgbm90IGFkZGVkIGV4cGxpY2l0bHkgd2hlbiBhbGxcbiAgICAvLyBvZiB0aGUgY3JpdGVyaWEgYmVsb3cgYXJlIG1ldDpcbiAgICAvLyAxKSBUaGUgY2xhc3MgZXh0ZW5kcyBhIFRTIG1peGluLlxuICAgIC8vIDIpIFRoZSBhcHBsaWNhdGlvbiBpcyBydW5uaW5nIGluIFZpZXdFbmdpbmUuXG4gICAgLy8gMykgVGhlIGFwcGxpY2F0aW9uIGlzIGJlaW5nIHRyYW5zcGlsZWQgdGhyb3VnaCB0c2lja2xlLlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlbW92ZWQgb25jZSBnb29nbGUzIGlzIGNvbXBsZXRlbHkgbWlncmF0ZWQgdG8gSXZ5LlxuICAgIHN1cGVyLm5nRG9DaGVjaygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX3N0YXJ0VmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5zdGFydDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoY2hhbmdlOiBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8RGF0ZVJhbmdlPEQ+Pik6IGJvb2xlYW4ge1xuICAgIGlmICghc3VwZXIuX3Nob3VsZEhhbmRsZUNoYW5nZUV2ZW50KGNoYW5nZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFjaGFuZ2Uub2xkVmFsdWU/LnN0YXJ0ID8gISFjaGFuZ2Uuc2VsZWN0aW9uLnN0YXJ0IDpcbiAgICAgICAgIWNoYW5nZS5zZWxlY3Rpb24uc3RhcnQgfHxcbiAgICAgICAgISF0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShjaGFuZ2Uub2xkVmFsdWUuc3RhcnQsIGNoYW5nZS5zZWxlY3Rpb24uc3RhcnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihyYW5nZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci5fZm9ybWF0VmFsdWUodmFsdWUpO1xuXG4gICAgLy8gQW55IHRpbWUgdGhlIGlucHV0IHZhbHVlIGlzIHJlZm9ybWF0dGVkIHdlIG5lZWQgdG8gdGVsbCB0aGUgcGFyZW50LlxuICAgIHRoaXMuX3JhbmdlSW5wdXQuX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gbWlycm9yaW5nIHRoZSBpbnB1dCdzIHNpemUuICovXG4gIGdldE1pcnJvclZhbHVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDAgPyB2YWx1ZSA6IGVsZW1lbnQucGxhY2Vob2xkZXI7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKiogSW5wdXQgZm9yIGVudGVyaW5nIHRoZSBlbmQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRFbmREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWVuZC1kYXRlIG1hdC1kYXRlLXJhbmdlLWlucHV0LWlubmVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXI/Lm9wZW5lZCAmJiBfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnX2dldE1pbkRhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1pbkRhdGUoKSkgOiBudWxsJyxcbiAgICAnW2F0dHIubWF4XSc6ICdfZ2V0TWF4RGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWF4RGF0ZSgpKSA6IG51bGwnLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAndHlwZSc6ICd0ZXh0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTWF0RW5kRGF0ZSwgbXVsdGk6IHRydWV9LFxuICAgIHtwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWF0RW5kRGF0ZSwgbXVsdGk6IHRydWV9XG4gIF0sXG4gIC8vIFRoZXNlIG5lZWQgdG8gYmUgc3BlY2lmaWVkIGV4cGxpY2l0bHksIGJlY2F1c2Ugc29tZSB0b29saW5nIGRvZXNuJ3RcbiAgLy8gc2VlbSB0byBwaWNrIHRoZW0gdXAgZnJvbSB0aGUgYmFzZSBjbGFzcy4gU2VlICMyMDkzMi5cbiAgb3V0cHV0czogWydkYXRlQ2hhbmdlJywgJ2RhdGVJbnB1dCddLFxuICBpbnB1dHM6IFsnZXJyb3JTdGF0ZU1hdGNoZXInXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFbmREYXRlPEQ+IGV4dGVuZHMgX01hdERhdGVSYW5nZUlucHV0QmFzZTxEPiBpbXBsZW1lbnRzXG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSwgRG9DaGVjaywgT25Jbml0IHtcbiAgLyoqIFZhbGlkYXRvciB0aGF0IGNoZWNrcyB0aGF0IHRoZSBlbmQgZGF0ZSBpc24ndCBiZWZvcmUgdGhlIHN0YXJ0IGRhdGUuICovXG4gIHByaXZhdGUgX2VuZFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCA6IG51bGw7XG4gICAgcmV0dXJuICghZW5kIHx8ICFzdGFydCB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShlbmQsIHN0YXJ0KSA+PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdEVuZERhdGVJbnZhbGlkJzogeydzdGFydCc6IHN0YXJ0LCAnYWN0dWFsJzogZW5kfX07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcmFuZ2VJbnB1dDogTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBjb25zdHJ1Y3RvciBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LCBidXQgVmlld0VuZ2luZSBkb2Vzbid0IHNlZW0gdG9cbiAgICAvLyBoYW5kbGUgREkgY29ycmVjdGx5IHdoZW4gaXQgaXMgaW5oZXJpdGVkIGZyb20gYE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2VgLiBXZSBjYW4gZHJvcCB0aGlzXG4gICAgLy8gY29uc3RydWN0b3Igb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAgc3VwZXIocmFuZ2VJbnB1dCwgZWxlbWVudFJlZiwgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBpbmplY3RvciwgcGFyZW50Rm9ybSwgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgICBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gTm9ybWFsbHkgdGhpcyBoYXBwZW5zIGF1dG9tYXRpY2FsbHksIGJ1dCBpdCBzZWVtcyB0byBicmVhayBpZiBub3QgYWRkZWQgZXhwbGljaXRseSB3aGVuIGFsbFxuICAgIC8vIG9mIHRoZSBjcml0ZXJpYSBiZWxvdyBhcmUgbWV0OlxuICAgIC8vIDEpIFRoZSBjbGFzcyBleHRlbmRzIGEgVFMgbWl4aW4uXG4gICAgLy8gMikgVGhlIGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW4gVmlld0VuZ2luZS5cbiAgICAvLyAzKSBUaGUgYXBwbGljYXRpb24gaXMgYmVpbmcgdHJhbnNwaWxlZCB0aHJvdWdoIHRzaWNrbGUuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVtb3ZlZCBvbmNlIGdvb2dsZTMgaXMgY29tcGxldGVseSBtaWdyYXRlZCB0byBJdnkuXG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICAvLyBOb3JtYWxseSB0aGlzIGhhcHBlbnMgYXV0b21hdGljYWxseSwgYnV0IGl0IHNlZW1zIHRvIGJyZWFrIGlmIG5vdCBhZGRlZCBleHBsaWNpdGx5IHdoZW4gYWxsXG4gICAgLy8gb2YgdGhlIGNyaXRlcmlhIGJlbG93IGFyZSBtZXQ6XG4gICAgLy8gMSkgVGhlIGNsYXNzIGV4dGVuZHMgYSBUUyBtaXhpbi5cbiAgICAvLyAyKSBUaGUgYXBwbGljYXRpb24gaXMgcnVubmluZyBpbiBWaWV3RW5naW5lLlxuICAgIC8vIDMpIFRoZSBhcHBsaWNhdGlvbiBpcyBiZWluZyB0cmFuc3BpbGVkIHRocm91Z2ggdHNpY2tsZS5cbiAgICAvLyBUaGlzIGNhbiBiZSByZW1vdmVkIG9uY2UgZ29vZ2xlMyBpcyBjb21wbGV0ZWx5IG1pZ3JhdGVkIHRvIEl2eS5cbiAgICBzdXBlci5uZ0RvQ2hlY2soKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFsuLi5zdXBlci5fZ2V0VmFsaWRhdG9ycygpLCB0aGlzLl9lbmRWYWxpZGF0b3JdKTtcblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IERhdGVSYW5nZTxEPikge1xuICAgIHJldHVybiBtb2RlbFZhbHVlLmVuZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoY2hhbmdlOiBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8RGF0ZVJhbmdlPEQ+Pik6IGJvb2xlYW4ge1xuICAgIGlmICghc3VwZXIuX3Nob3VsZEhhbmRsZUNoYW5nZUV2ZW50KGNoYW5nZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFjaGFuZ2Uub2xkVmFsdWU/LmVuZCA/ICEhY2hhbmdlLnNlbGVjdGlvbi5lbmQgOlxuICAgICAgICAhY2hhbmdlLnNlbGVjdGlvbi5lbmQgfHxcbiAgICAgICAgISF0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShjaGFuZ2Uub2xkVmFsdWUuZW5kLCBjaGFuZ2Uuc2VsZWN0aW9uLmVuZCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBEYXRlUmFuZ2UodGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0LCB2YWx1ZSk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBJZiB0aGUgdXNlciBpcyBwcmVzc2luZyBiYWNrc3BhY2Ugb24gYW4gZW1wdHkgZW5kIGlucHV0LCBtb3ZlIGZvY3VzIGJhY2sgdG8gdGhlIHN0YXJ0LlxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBCQUNLU1BBQ0UgJiYgIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSkge1xuICAgICAgdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dC5mb2N1cygpO1xuICAgIH1cblxuICAgIHN1cGVyLl9vbktleWRvd24oZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=