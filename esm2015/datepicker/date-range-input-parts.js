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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBRU4sUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFNBQVMsRUFFVCxVQUFVLEdBR1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBR0wsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixXQUFXLEVBRVgsaUJBQWlCLEdBQ2xCLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQXdCLE1BQU0sd0JBQXdCLENBQUM7QUFpQnhFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBbUMsNkJBQTZCLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNIO0lBQUEsTUFDZSx5QkFDYixTQUFRLHNCQUFvQztRQVk1QyxZQUM4QyxXQUF1QyxFQUNuRixVQUF3QyxFQUNqQyx5QkFBNEMsRUFDM0MsU0FBbUIsRUFDUixXQUFtQixFQUNuQixnQkFBb0MsRUFDM0MsV0FBMkIsRUFDRCxXQUEyQjtZQUNqRSxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQVJBLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtZQUU1RSw4QkFBeUIsR0FBekIseUJBQXlCLENBQW1CO1lBQzNDLGNBQVMsR0FBVCxTQUFTLENBQVU7WUFDUixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtZQUNuQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1lBaUUvQyx5QkFBb0IsR0FBRyxHQUFHLEVBQUU7Z0JBQ3BDLDhFQUE4RTtnQkFDOUUsdUVBQXVFO2dCQUN2RSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUE7UUFqRUQsQ0FBQztRQUVELFFBQVE7WUFDTixnR0FBZ0c7WUFDaEcsNEZBQTRGO1lBQzVGLCtGQUErRjtZQUMvRix5RkFBeUY7WUFDekYsc0ZBQXNGO1lBQ3RGLGdDQUFnQztZQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV4RSxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzthQUM1QjtRQUNILENBQUM7UUFFRCxTQUFTO1lBQ1AsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixzRkFBc0Y7Z0JBQ3RGLHVGQUF1RjtnQkFDdkYsNkZBQTZGO2dCQUM3RixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN6QjtRQUNILENBQUM7UUFFRCx1Q0FBdUM7UUFDdkMsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELHlCQUF5QjtRQUN6QixLQUFLO1lBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekMsQ0FBQztRQUVELG1EQUFtRDtRQUNuRCxRQUFRLENBQUMsS0FBYTtZQUNwQixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUM3QyxDQUFDO1FBRUQsc0RBQXNEO1FBQzVDLFVBQVU7WUFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQsa0RBQWtEO1FBQ3hDLFdBQVc7WUFDbkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztRQUM5QixDQUFDO1FBRUQsa0RBQWtEO1FBQ3hDLFdBQVc7WUFDbkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztRQUM5QixDQUFDO1FBRUQsMERBQTBEO1FBQ2hELGNBQWM7WUFDdEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztRQUNyQyxDQUFDO1FBUVMsZUFBZTtZQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxjQUFjLENBQUMsS0FBNkM7WUFDMUQsMkZBQTJGO1lBQzNGLDJGQUEyRjtZQUMzRix3RkFBd0Y7WUFDeEYscUZBQXFGO1lBQ3JGLHlFQUF5RTtZQUN6RSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDOzs7Z0JBdEdGLFNBQVM7Ozs7Z0RBZUwsTUFBTSxTQUFDLDJCQUEyQjtnQkExRXJDLFVBQVU7Z0JBMkJWLGlCQUFpQjtnQkF0QmpCLFFBQVE7Z0JBT1IsTUFBTSx1QkFrRUgsUUFBUTtnQkFqRVgsa0JBQWtCLHVCQWtFZixRQUFRO2dCQXREWCxXQUFXLHVCQXVEUixRQUFRO2dEQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsZ0JBQWdCOztJQWlGeEMsZ0NBQUM7S0FBQTtBQUVELE1BQU0sc0JBQXNCO0FBRXhCLDREQUE0RDtBQUM1RCxlQUFlLENBQUMseUJBQWdDLENBQUMsQ0FBQztBQUV0RCxxRUFBcUU7QUFDckU7SUFBQSxNQXVCYSxZQUFnQixTQUFRLHNCQUF5QjtRQVU1RCxZQUN1QyxVQUFzQyxFQUMzRSxVQUF3QyxFQUN4Qyx3QkFBMkMsRUFDM0MsUUFBa0IsRUFDTixVQUFrQixFQUNsQixlQUFtQyxFQUNuQyxXQUEyQixFQUNELFdBQTJCO1lBRWpFLDBGQUEwRjtZQUMxRiw4RkFBOEY7WUFDOUYsMENBQTBDO1lBQzFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUN6RixXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7WUF2QmhDLDBFQUEwRTtZQUNsRSxvQkFBZSxHQUFnQixDQUFDLE9BQXdCLEVBQTJCLEVBQUU7Z0JBQzNGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDckYsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzNELE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUc7b0JBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMscUJBQXFCLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQTtZQW1CUyxlQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRjdGLENBQUM7UUFJUyxrQkFBa0IsQ0FBQyxVQUF3QjtZQUNuRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQztRQUVTLG1CQUFtQixDQUFDLEtBQWU7WUFDM0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQztRQUVTLFlBQVksQ0FBQyxLQUFlO1lBQ3BDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUIsc0VBQXNFO1lBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUM3QyxDQUFDO1FBRUQsMEVBQTBFO1FBQzFFLGNBQWM7WUFDWixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztZQUMvQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN4RCxDQUFDOzs7Z0JBM0VGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLDRCQUE0Qjt3QkFDckMsWUFBWSxFQUFFLFVBQVU7d0JBQ3hCLFNBQVMsRUFBRSwrQkFBK0I7d0JBQzFDLFVBQVUsRUFBRSxhQUFhO3dCQUN6QixXQUFXLEVBQUUsb0JBQW9CO3dCQUNqQyxXQUFXLEVBQUUsZ0JBQWdCO3dCQUM3Qix3QkFBd0IsRUFBRSw2QkFBNkI7d0JBQ3ZELHlCQUF5QixFQUFFLDhCQUE4Qjt3QkFDekQsc0JBQXNCLEVBQUUsMkNBQTJDO3dCQUNuRSxrQkFBa0IsRUFBRSx5RUFBeUU7d0JBQzdGLFlBQVksRUFBRSw4REFBOEQ7d0JBQzVFLFlBQVksRUFBRSw4REFBOEQ7d0JBQzVFLFFBQVEsRUFBRSxXQUFXO3dCQUNyQixNQUFNLEVBQUUsTUFBTTtxQkFDZjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO3dCQUNwRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO3FCQUNqRTtpQkFDRjs7OztnREFZSSxNQUFNLFNBQUMsMkJBQTJCO2dCQTVNckMsVUFBVTtnQkEyQlYsaUJBQWlCO2dCQXRCakIsUUFBUTtnQkFPUixNQUFNLHVCQW9NSCxRQUFRO2dCQW5NWCxrQkFBa0IsdUJBb01mLFFBQVE7Z0JBeExYLFdBQVcsdUJBeUxSLFFBQVE7Z0RBQ1IsUUFBUSxZQUFJLE1BQU0sU0FBQyxnQkFBZ0I7O0lBcUN4QyxtQkFBQztLQUFBO1NBdkRZLFlBQVk7QUEwRHpCLG1FQUFtRTtBQUNuRTtJQUFBLE1Bc0JhLFVBQWMsU0FBUSxzQkFBeUI7UUFVMUQsWUFDdUMsVUFBc0MsRUFDM0UsVUFBd0MsRUFDeEMsd0JBQTJDLEVBQzNDLFFBQWtCLEVBQ04sVUFBa0IsRUFDbEIsZUFBbUMsRUFDbkMsV0FBMkIsRUFDRCxXQUEyQjtZQUVqRSwwRkFBMEY7WUFDMUYsOEZBQThGO1lBQzlGLDBDQUEwQztZQUMxQyxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSx3QkFBd0IsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFDekYsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBdkJoQywyRUFBMkU7WUFDbkUsa0JBQWEsR0FBZ0IsQ0FBQyxPQUF3QixFQUEyQixFQUFFO2dCQUN6RixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25GLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMvRCxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLO29CQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLG1CQUFtQixFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLEVBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUE7WUFtQlMsZUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUYzRixDQUFDO1FBSVMsa0JBQWtCLENBQUMsVUFBd0I7WUFDbkQsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDO1FBQ3hCLENBQUM7UUFFUyxtQkFBbUIsQ0FBQyxLQUFlO1lBQzNDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixNQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUM7UUFFRCxVQUFVLENBQUMsS0FBb0I7WUFDN0IsMEZBQTBGO1lBQzFGLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hFLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3RDO1lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDOzs7Z0JBckVGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLDRCQUE0Qjt3QkFDckMsWUFBWSxFQUFFLFVBQVU7d0JBQ3hCLFNBQVMsRUFBRSwrQkFBK0I7d0JBQzFDLFVBQVUsRUFBRSxhQUFhO3dCQUN6QixXQUFXLEVBQUUsb0JBQW9CO3dCQUNqQyx3QkFBd0IsRUFBRSw2QkFBNkI7d0JBQ3ZELHlCQUF5QixFQUFFLDhCQUE4Qjt3QkFDekQsc0JBQXNCLEVBQUUsMkNBQTJDO3dCQUNuRSxrQkFBa0IsRUFBRSx5RUFBeUU7d0JBQzdGLFlBQVksRUFBRSw4REFBOEQ7d0JBQzVFLFlBQVksRUFBRSw4REFBOEQ7d0JBQzVFLFFBQVEsRUFBRSxXQUFXO3dCQUNyQixNQUFNLEVBQUUsTUFBTTtxQkFDZjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO3dCQUNsRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO3FCQUMvRDtpQkFDRjs7OztnREFZSSxNQUFNLFNBQUMsMkJBQTJCO2dCQTdSckMsVUFBVTtnQkEyQlYsaUJBQWlCO2dCQXRCakIsUUFBUTtnQkFPUixNQUFNLHVCQXFSSCxRQUFRO2dCQXBSWCxrQkFBa0IsdUJBcVJmLFFBQVE7Z0JBelFYLFdBQVcsdUJBMFFSLFFBQVE7Z0RBQ1IsUUFBUSxZQUFJLE1BQU0sU0FBQyxnQkFBZ0I7O0lBZ0N4QyxpQkFBQztLQUFBO1NBbERZLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT25Jbml0LFxuICBJbmplY3RvcixcbiAgSW5qZWN0RmxhZ3MsXG4gIERvQ2hlY2ssXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5nRm9ybSxcbiAgRm9ybUdyb3VwRGlyZWN0aXZlLFxuICBOZ0NvbnRyb2wsXG4gIFZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzLFxuICBBYnN0cmFjdENvbnRyb2wsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yLFxuICBtaXhpbkVycm9yU3RhdGUsXG4gIE1BVF9EQVRFX0ZPUk1BVFMsXG4gIERhdGVBZGFwdGVyLFxuICBNYXREYXRlRm9ybWF0cyxcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0JBQ0tTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcklucHV0QmFzZSwgRGF0ZUZpbHRlckZufSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtYmFzZSc7XG5pbXBvcnQge0RhdGVSYW5nZSwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqIFBhcmVudCBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgd3JhcHBlZCBhcm91bmQgYE1hdFN0YXJ0RGF0ZWAgYW5kIGBNYXRFbmREYXRlYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4ge1xuICBpZDogc3RyaW5nO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkYXRlRmlsdGVyOiBEYXRlRmlsdGVyRm48RD47XG4gIF9zdGFydElucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZW5kSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD47XG4gIF9ncm91cERpc2FibGVkOiBib29sZWFuO1xuICBfYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmcgfCBudWxsO1xuICBfYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGw7XG4gIF9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlOiAoKSA9PiB2b2lkO1xuICBfb3BlbkRhdGVwaWNrZXI6ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIHRoZSBkYXRlIHJhbmdlIGlucHV0IHdyYXBwZXIgY29tcG9uZW50XG4gKiB0byB0aGUgcGFydHMgd2l0aG91dCBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDx1bmtub3duPj4oJ01BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSBpbmRpdmlkdWFsIGlucHV0cyB0aGF0IGNhbiBiZSBwcm9qZWN0ZWQgaW5zaWRlIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC5cbiAqL1xuQERpcmVjdGl2ZSgpXG5hYnN0cmFjdCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+XG4gIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxEYXRlUmFuZ2U8RD4+IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrIHtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBuZ0NvbnRyb2w6IE5nQ29udHJvbDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBhYnN0cmFjdCB1cGRhdGVFcnJvclN0YXRlKCk6IHZvaWQ7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92YWxpZGF0b3I6IFZhbGlkYXRvckZuIHwgbnVsbDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKTogdm9pZDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEYXRlUmFuZ2U8RD4pOiBEIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcHVibGljIF9yYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0aGUgZGF0ZSBpbnB1dCB0byBwcm92aWRlIGl0c2VsZiBhcyBhIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGEgYFZhbGlkYXRvcmAsIHdoaWxlXG4gICAgLy8gaW5qZWN0aW5nIGl0cyBgTmdDb250cm9sYCBzbyB0aGF0IHRoZSBlcnJvciBzdGF0ZSBpcyBoYW5kbGVkIGNvcnJlY3RseS4gVGhpcyBpbnRyb2R1Y2VzIGFcbiAgICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5LCBiZWNhdXNlIGJvdGggYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBhbmQgYFZhbGlkYXRvcmAgZGVwZW5kIG9uIHRoZSBpbnB1dFxuICAgIC8vIGl0c2VsZi4gVXN1YWxseSB3ZSBjYW4gd29yayBhcm91bmQgaXQgZm9yIHRoZSBDVkEsIGJ1dCB0aGVyZSdzIG5vIEFQSSB0byBkbyBpdCBmb3IgdGhlXG4gICAgLy8gdmFsaWRhdG9yLiBXZSB3b3JrIGFyb3VuZCBpdCBoZXJlIGJ5IGluamVjdGluZyB0aGUgYE5nQ29udHJvbGAgaW4gYG5nT25Jbml0YCwgYWZ0ZXJcbiAgICAvLyBldmVyeXRoaW5nIGhhcyBiZWVuIHJlc29sdmVkLlxuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldChOZ0NvbnRyb2wsIG51bGwsIEluamVjdEZsYWdzLlNlbGYpO1xuXG4gICAgaWYgKG5nQ29udHJvbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wgPSBuZ0NvbnRyb2w7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZS1ldmFsdWF0ZSB0aGlzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWVcbiAgICAgIC8vIGVycm9yIHRyaWdnZXJzIHRoYXQgd2UgY2FuJ3Qgc3Vic2NyaWJlIHRvIChlLmcuIHBhcmVudCBmb3JtIHN1Ym1pc3Npb25zKS4gVGhpcyBtZWFuc1xuICAgICAgLy8gdGhhdCB3aGF0ZXZlciBsb2dpYyBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgZGVzdHJveWluZyB0aGUgcGVyZm9ybWFuY2UuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBlbXB0eS4gKi9cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBgaW5wdXRgIGV2ZW50cyBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgX29uSW5wdXQodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLl9vbklucHV0KHZhbHVlKTtcbiAgICB0aGlzLl9yYW5nZUlucHV0Ll9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGRhdGVwaWNrZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIF9vcGVuUG9wdXAoKTogdm9pZCB7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5fb3BlbkRhdGVwaWNrZXIoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIGRhdGUgZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfZ2V0TWluRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5taW47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX2dldE1heERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQubWF4O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRhdGUgZmlsdGVyIGZ1bmN0aW9uIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX2dldERhdGVGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlSW5wdXQuZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfb3V0c2lkZVZhbHVlQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAvLyBXaGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcyBvdXRzaWRlIHRoZSBpbnB1dCB3ZSBuZWVkIHRvIHJldmFsaWRhdGUsIGJlY2F1c2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBzdGF0ZSBvZiBlYWNoIG9mIHRoZSBpbnB1dHMgZGVwZW5kcyBvbiB0aGUgb3RoZXIgb25lLlxuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3BhcmVudERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZUlucHV0Ll9ncm91cERpc2FibGVkO1xuICB9XG5cbiAgX3JlZ2lzdGVyTW9kZWwobW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEYXRlUmFuZ2U8RD4sIEQ+KSB7XG4gICAgLy8gVGhlIHZlcnkgZmlyc3QgdGltZSB0aGUgcmFuZ2UgaW5wdXRzIHdyaXRlIHRoZWlyIHZhbHVlcywgdGhleSBkb24ndCBrbm93IGFib3V0IHRoZSB2YWx1ZVxuICAgIC8vIG9mIHRoZSBvcHBvc2l0ZSBpbnB1dC4gV2hlbiB0aGlzIGlzIGNvbWJpbmVkIHdpdGggdGhlIGZhY3QgdGhhdCBgTmdNb2RlbGAgZGVmZXJzIHdyaXRpbmdcbiAgICAvLyBpdHMgdmFsdWUgd2l0aCBhIGBQcm9taXNlLnJlc29sdmVgLCB3ZSBjYW4gZ2V0IGludG8gYSBzaXR1YXRpb24gd2hlcmUgdGhlIGZpcnN0IGlucHV0XG4gICAgLy8gcmVzZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc2Vjb25kLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBkZWZlcnJpbmcgdGhlIHJlZ2lzdHJhdGlvbiBvZlxuICAgIC8vIHRoZSBtb2RlbCwgYWxsb3dpbmcgdGhlIGlucHV0IGVub3VnaCB0aW1lIHRvIGFzc2lnbiB0aGUgaW5pdGlhbCB2YWx1ZS5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHN1cGVyLl9yZWdpc3Rlck1vZGVsKG1vZGVsKSk7XG4gIH1cbn1cblxuY29uc3QgX01hdERhdGVSYW5nZUlucHV0QmFzZTpcbiAgICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciAmIHR5cGVvZiBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlID1cbiAgICAvLyBOZWVkcyB0byBiZSBgYXMgYW55YCwgYmVjYXVzZSB0aGUgYmFzZSBjbGFzcyBpcyBhYnN0cmFjdC5cbiAgICBtaXhpbkVycm9yU3RhdGUoTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZSBhcyBhbnkpO1xuXG4vKiogSW5wdXQgZm9yIGVudGVyaW5nIHRoZSBzdGFydCBkYXRlIGluIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdFN0YXJ0RGF0ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0LWlubmVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5pZF0nOiAnX3JhbmdlSW5wdXQuaWQnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19yYW5nZUlucHV0Ll9hcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19yYW5nZUlucHV0Ll9hcmlhRGVzY3JpYmVkQnknLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXI/Lm9wZW5lZCAmJiBfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnX2dldE1pbkRhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1pbkRhdGUoKSkgOiBudWxsJyxcbiAgICAnW2F0dHIubWF4XSc6ICdfZ2V0TWF4RGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWF4RGF0ZSgpKSA6IG51bGwnLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAndHlwZSc6ICd0ZXh0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZX0sXG4gICAge3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBNYXRTdGFydERhdGUsIG11bHRpOiB0cnVlfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0YXJ0RGF0ZTxEPiBleHRlbmRzIF9NYXREYXRlUmFuZ2VJbnB1dEJhc2U8RD4gaW1wbGVtZW50cyBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgLyoqIFZhbGlkYXRvciB0aGF0IGNoZWNrcyB0aGF0IHRoZSBzdGFydCBkYXRlIGlzbid0IGFmdGVyIHRoZSBlbmQgZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc3RhcnRWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kIDogbnVsbDtcbiAgICByZXR1cm4gKCFzdGFydCB8fCAhZW5kIHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKHN0YXJ0LCBlbmQpIDw9IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0U3RhcnREYXRlSW52YWxpZCc6IHsnZW5kJzogZW5kLCAnYWN0dWFsJzogc3RhcnR9fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMpIHtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGNvbnN0cnVjdG9yIHNob3VsZG4ndCBiZSBuZWNlc3NhcnksIGJ1dCBWaWV3RW5naW5lIGRvZXNuJ3Qgc2VlbSB0b1xuICAgIC8vIGhhbmRsZSBESSBjb3JyZWN0bHkgd2hlbiBpdCBpcyBpbmhlcml0ZWQgZnJvbSBgTWF0RGF0ZVJhbmdlSW5wdXRQYXJ0QmFzZWAuIFdlIGNhbiBkcm9wIHRoaXNcbiAgICAvLyBjb25zdHJ1Y3RvciBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICBzdXBlcihyYW5nZUlucHV0LCBlbGVtZW50UmVmLCBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIGluamVjdG9yLCBwYXJlbnRGb3JtLCBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICAgIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fc3RhcnRWYWxpZGF0b3JdKTtcblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IERhdGVSYW5nZTxEPikge1xuICAgIHJldHVybiBtb2RlbFZhbHVlLnN0YXJ0O1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBEYXRlUmFuZ2UodmFsdWUsIHRoaXMuX21vZGVsLnNlbGVjdGlvbi5lbmQpO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKHJhbmdlLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Zvcm1hdFZhbHVlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHN1cGVyLl9mb3JtYXRWYWx1ZSh2YWx1ZSk7XG5cbiAgICAvLyBBbnkgdGltZSB0aGUgaW5wdXQgdmFsdWUgaXMgcmVmb3JtYXR0ZWQgd2UgbmVlZCB0byB0ZWxsIHRoZSBwYXJlbnQuXG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5faGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIHRoYXQgc2hvdWxkIGJlIHVzZWQgd2hlbiBtaXJyb3JpbmcgdGhlIGlucHV0J3Mgc2l6ZS4gKi9cbiAgZ2V0TWlycm9yVmFsdWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICByZXR1cm4gdmFsdWUubGVuZ3RoID4gMCA/IHZhbHVlIDogZWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKiBJbnB1dCBmb3IgZW50ZXJpbmcgdGhlIGVuZCBkYXRlIGluIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdEVuZERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfcmFuZ2VJbnB1dC5fYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdEVuZERhdGUsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IE1hdEVuZERhdGUsIG11bHRpOiB0cnVlfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdEVuZERhdGU8RD4gZXh0ZW5kcyBfTWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgZW5kIGRhdGUgaXNuJ3QgYmVmb3JlIHRoZSBzdGFydCBkYXRlLiAqL1xuICBwcml2YXRlIF9lbmRWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQgOiBudWxsO1xuICAgIHJldHVybiAoIWVuZCB8fCAhc3RhcnQgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoZW5kLCBzdGFydCkgPj0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXRFbmREYXRlSW52YWxpZCc6IHsnc3RhcnQnOiBzdGFydCwgJ2FjdHVhbCc6IGVuZH19O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHJhbmdlSW5wdXQ6IE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIGRhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgY29uc3RydWN0b3Igc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSwgYnV0IFZpZXdFbmdpbmUgZG9lc24ndCBzZWVtIHRvXG4gICAgLy8gaGFuZGxlIERJIGNvcnJlY3RseSB3aGVuIGl0IGlzIGluaGVyaXRlZCBmcm9tIGBNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlYC4gV2UgY2FuIGRyb3AgdGhpc1xuICAgIC8vIGNvbnN0cnVjdG9yIG9uY2UgVmlld0VuZ2luZSBpcyByZW1vdmVkLlxuICAgIHN1cGVyKHJhbmdlSW5wdXQsIGVsZW1lbnRSZWYsIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgaW5qZWN0b3IsIHBhcmVudEZvcm0sIHBhcmVudEZvcm1Hcm91cCxcbiAgICAgICAgZGF0ZUFkYXB0ZXIsIGRhdGVGb3JtYXRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFsuLi5zdXBlci5fZ2V0VmFsaWRhdG9ycygpLCB0aGlzLl9lbmRWYWxpZGF0b3JdKTtcblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IERhdGVSYW5nZTxEPikge1xuICAgIHJldHVybiBtb2RlbFZhbHVlLmVuZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgRGF0ZVJhbmdlKHRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCwgdmFsdWUpO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKHJhbmdlLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gSWYgdGhlIHVzZXIgaXMgcHJlc3NpbmcgYmFja3NwYWNlIG9uIGFuIGVtcHR5IGVuZCBpbnB1dCwgZm9jdXMgZm9jdXMgYmFjayB0byB0aGUgc3RhcnQuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlKSB7XG4gICAgICB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuX29uS2V5ZG93bihldmVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==