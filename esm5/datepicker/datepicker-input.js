/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatDatepicker } from './datepicker';
import { createMissingDateImplError } from './datepicker-errors';
/** @docs-private */
export var MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MatDatepickerInput; }),
    multi: true
};
/** @docs-private */
export var MAT_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MatDatepickerInput; }),
    multi: true
};
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
var MatDatepickerInputEvent = /** @class */ (function () {
    function MatDatepickerInputEvent(
    /** Reference to the datepicker input component that emitted the event. */
    target, 
    /** Reference to the native input element associated with the datepicker input. */
    targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
    return MatDatepickerInputEvent;
}());
export { MatDatepickerInputEvent };
/** Directive used to connect an input to a MatDatepicker. */
var MatDatepickerInput = /** @class */ (function () {
    function MatDatepickerInput(_elementRef, _dateAdapter, _dateFormats, _formField) {
        var _this = this;
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._formField = _formField;
        /** Emits when a `change` event is fired on this `<input>`. */
        this.dateChange = new EventEmitter();
        /** Emits when an `input` event is fired on this `<input>`. */
        this.dateInput = new EventEmitter();
        /** Emits when the value changes (either due to user input or programmatic change). */
        this._valueChange = new EventEmitter();
        /** Emits when the disabled state has changed */
        this._disabledChange = new EventEmitter();
        this._onTouched = function () { };
        this._cvaOnChange = function () { };
        this._validatorOnChange = function () { };
        this._datepickerSubscription = Subscription.EMPTY;
        this._localeSubscription = Subscription.EMPTY;
        /** The form control validator for whether the input parses. */
        this._parseValidator = function () {
            return _this._lastValueValid ?
                null : { 'matDatepickerParse': { 'text': _this._elementRef.nativeElement.value } };
        };
        /** The form control validator for the min date. */
        this._minValidator = function (control) {
            var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
            return (!_this.min || !controlValue ||
                _this._dateAdapter.compareDate(_this.min, controlValue) <= 0) ?
                null : { 'matDatepickerMin': { 'min': _this.min, 'actual': controlValue } };
        };
        /** The form control validator for the max date. */
        this._maxValidator = function (control) {
            var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
            return (!_this.max || !controlValue ||
                _this._dateAdapter.compareDate(_this.max, controlValue) >= 0) ?
                null : { 'matDatepickerMax': { 'max': _this.max, 'actual': controlValue } };
        };
        /** The form control validator for the date filter. */
        this._filterValidator = function (control) {
            var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
            return !_this._dateFilter || !controlValue || _this._dateFilter(controlValue) ?
                null : { 'matDatepickerFilter': true };
        };
        /** The combined form control validator for this input. */
        this._validator = Validators.compose([this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator]);
        /** Whether the last value set on the input was valid. */
        this._lastValueValid = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(function () {
            _this.value = _this.value;
        });
    }
    Object.defineProperty(MatDatepickerInput.prototype, "matDatepicker", {
        /** The datepicker that this input is associated with. */
        set: function (value) {
            var _this = this;
            if (!value) {
                return;
            }
            this._datepicker = value;
            this._datepicker._registerInput(this);
            this._datepickerSubscription.unsubscribe();
            this._datepickerSubscription = this._datepicker._selectedChanged.subscribe(function (selected) {
                _this.value = selected;
                _this._cvaOnChange(selected);
                _this._onTouched();
                _this.dateInput.emit(new MatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                _this.dateChange.emit(new MatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "matDatepickerFilter", {
        /** Function that can be used to filter out dates within the datepicker. */
        set: function (value) {
            this._dateFilter = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "value", {
        /** The value of the input. */
        get: function () { return this._value; },
        set: function (value) {
            value = this._dateAdapter.deserialize(value);
            this._lastValueValid = !value || this._dateAdapter.isValid(value);
            value = this._getValidDateOrNull(value);
            var oldDate = this.value;
            this._value = value;
            this._formatValue(value);
            if (!this._dateAdapter.sameDate(oldDate, value)) {
                this._valueChange.emit(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "min", {
        /** The minimum valid date. */
        get: function () { return this._min; },
        set: function (value) {
            this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "max", {
        /** The maximum valid date. */
        get: function () { return this._max; },
        set: function (value) {
            this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "disabled", {
        /** Whether the datepicker-input is disabled. */
        get: function () { return !!this._disabled; },
        set: function (value) {
            var newValue = coerceBooleanProperty(value);
            var element = this._elementRef.nativeElement;
            if (this._disabled !== newValue) {
                this._disabled = newValue;
                this._disabledChange.emit(newValue);
            }
            // We need to null check the `blur` method, because it's undefined during SSR.
            if (newValue && element.blur) {
                // Normally, native input elements automatically blur if they turn disabled. This behavior
                // is problematic, because it would mean that it triggers another change detection cycle,
                // which then causes a changed after checked error if the input element was focused before.
                element.blur();
            }
        },
        enumerable: true,
        configurable: true
    });
    MatDatepickerInput.prototype.ngOnDestroy = function () {
        this._datepickerSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    };
    /** @docs-private */
    MatDatepickerInput.prototype.registerOnValidatorChange = function (fn) {
        this._validatorOnChange = fn;
    };
    /** @docs-private */
    MatDatepickerInput.prototype.validate = function (c) {
        return this._validator ? this._validator(c) : null;
    };
    /**
     * @deprecated
     * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
     */
    MatDatepickerInput.prototype.getPopupConnectionElementRef = function () {
        return this.getConnectedOverlayOrigin();
    };
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    MatDatepickerInput.prototype.getConnectedOverlayOrigin = function () {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    };
    // Implemented as part of ControlValueAccessor.
    MatDatepickerInput.prototype.writeValue = function (value) {
        this.value = value;
    };
    // Implemented as part of ControlValueAccessor.
    MatDatepickerInput.prototype.registerOnChange = function (fn) {
        this._cvaOnChange = fn;
    };
    // Implemented as part of ControlValueAccessor.
    MatDatepickerInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    // Implemented as part of ControlValueAccessor.
    MatDatepickerInput.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MatDatepickerInput.prototype._onKeydown = function (event) {
        var isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;
        if (this._datepicker && isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
            this._datepicker.open();
            event.preventDefault();
        }
    };
    MatDatepickerInput.prototype._onInput = function (value) {
        var date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._getValidDateOrNull(date);
        if (!this._dateAdapter.sameDate(date, this._value)) {
            this._value = date;
            this._cvaOnChange(date);
            this._valueChange.emit(date);
            this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
        }
        else {
            this._validatorOnChange();
        }
    };
    MatDatepickerInput.prototype._onChange = function () {
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    };
    /** Returns the palette used by the input's form field, if any. */
    MatDatepickerInput.prototype._getThemePalette = function () {
        return this._formField ? this._formField.color : undefined;
    };
    /** Handles blur events on the input. */
    MatDatepickerInput.prototype._onBlur = function () {
        // Reformat the input only if we have a valid value.
        if (this.value) {
            this._formatValue(this.value);
        }
        this._onTouched();
    };
    /** Formats a value and sets it on the input element. */
    MatDatepickerInput.prototype._formatValue = function (value) {
        this._elementRef.nativeElement.value =
            value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
    };
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    MatDatepickerInput.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    MatDatepickerInput.decorators = [
        { type: Directive, args: [{
                    selector: 'input[matDatepicker]',
                    providers: [
                        MAT_DATEPICKER_VALUE_ACCESSOR,
                        MAT_DATEPICKER_VALIDATORS,
                        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatepickerInput },
                    ],
                    host: {
                        '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
                        '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
                        '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                        '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(blur)': '_onBlur()',
                        '(keydown)': '_onKeydown($event)',
                    },
                    exportAs: 'matDatepickerInput',
                },] }
    ];
    /** @nocollapse */
    MatDatepickerInput.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: MatFormField, decorators: [{ type: Optional }] }
    ]; };
    MatDatepickerInput.propDecorators = {
        matDatepicker: [{ type: Input }],
        matDatepickerFilter: [{ type: Input }],
        value: [{ type: Input }],
        min: [{ type: Input }],
        max: [{ type: Input }],
        disabled: [{ type: Input }],
        dateChange: [{ type: Output }],
        dateInput: [{ type: Output }]
    };
    return MatDatepickerInput;
}());
export { MatDatepickerInput };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBSWpCLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQStCLE1BQU0sd0JBQXdCLENBQUM7QUFDbkcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUvRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLElBQU0sNkJBQTZCLEdBQVE7SUFDaEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxrQkFBa0IsRUFBbEIsQ0FBa0IsQ0FBQztJQUNqRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFB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RUFBRSwwQ0FBMEM7d0JBQ3hELFlBQVksRUFBRSwwQ0FBMEM7d0JBQ3hELFlBQVksRUFBRSxVQUFVO3dCQUN4QixTQUFTLEVBQUUsK0JBQStCO3dCQUMxQyxVQUFVLEVBQUUsYUFBYTt3QkFDekIsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFdBQVcsRUFBRSxvQkFBb0I7cUJBQ2xDO29CQUNELFFBQVEsRUFBRSxvQkFBb0I7aUJBQy9COzs7O2dCQWhGQyxVQUFVO2dCQW1CSixXQUFXLHVCQW9OWixRQUFRO2dEQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsZ0JBQWdCO2dCQXBObEMsWUFBWSx1QkFxTmIsUUFBUTs7O2dDQXRKWixLQUFLO3NDQXFCTCxLQUFLO3dCQVFMLEtBQUs7c0JBaUJMLEtBQUs7c0JBU0wsS0FBSzsyQkFTTCxLQUFLOzZCQXNCTCxNQUFNOzRCQUlOLE1BQU07O0lBNkxULHlCQUFDO0NBQUEsQUE3U0QsSUE2U0M7U0F6Ulksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET1dOX0FSUk9XfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdGlvbkVycm9ycyxcbiAgVmFsaWRhdG9yLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtEYXRlQWRhcHRlciwgTUFUX0RBVEVfRk9STUFUUywgTWF0RGF0ZUZvcm1hdHMsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyfSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdERhdGVwaWNrZXJJbnB1dCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1ZBTElEQVRPUlM6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXBpY2tlcklucHV0KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBBbiBldmVudCB1c2VkIGZvciBkYXRlcGlja2VyIGlucHV0IGFuZCBjaGFuZ2UgZXZlbnRzLiBXZSBkb24ndCBhbHdheXMgaGF2ZSBhY2Nlc3MgdG8gYSBuYXRpdmVcbiAqIGlucHV0IG9yIGNoYW5nZSBldmVudCBiZWNhdXNlIHRoZSBldmVudCBtYXkgaGF2ZSBiZWVuIHRyaWdnZXJlZCBieSB0aGUgdXNlciBjbGlja2luZyBvbiB0aGVcbiAqIGNhbGVuZGFyIHBvcHVwLiBGb3IgY29uc2lzdGVuY3ksIHdlIGFsd2F5cyB1c2UgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQ+IHtcbiAgLyoqIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSB0YXJnZXQgZGF0ZXBpY2tlciBpbnB1dC4gKi9cbiAgdmFsdWU6IEQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGRhdGVwaWNrZXIgaW5wdXQgY29tcG9uZW50IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHRhcmdldDogTWF0RGF0ZXBpY2tlcklucHV0PEQ+LFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0ZXBpY2tlciBpbnB1dC4gKi9cbiAgICBwdWJsaWMgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy50YXJnZXQudmFsdWU7XG4gIH1cbn1cblxuXG4vKiogRGlyZWN0aXZlIHVzZWQgdG8gY29ubmVjdCBhbiBpbnB1dCB0byBhIE1hdERhdGVwaWNrZXIuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXREYXRlcGlja2VyXScsXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SLFxuICAgIE1BVF9EQVRFUElDS0VSX1ZBTElEQVRPUlMsXG4gICAge3Byb3ZpZGU6IE1BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdERhdGVwaWNrZXJJbnB1dH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX2RhdGVwaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9kYXRlcGlja2VyPy5vcGVuZWQgJiYgX2RhdGVwaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ21pbiA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEobWluKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ21heCA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEobWF4KSA6IG51bGwnLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfb25LZXlkb3duKCRldmVudCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdERhdGVwaWNrZXJJbnB1dCcsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJJbnB1dDxEPiBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIFZhbGlkYXRvciB7XG4gIC8qKiBUaGUgZGF0ZXBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoKVxuICBzZXQgbWF0RGF0ZXBpY2tlcih2YWx1ZTogTWF0RGF0ZXBpY2tlcjxEPikge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9kYXRlcGlja2VyID0gdmFsdWU7XG4gICAgdGhpcy5fZGF0ZXBpY2tlci5fcmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICB0aGlzLl9kYXRlcGlja2VyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICB0aGlzLl9kYXRlcGlja2VyU3Vic2NyaXB0aW9uID0gdGhpcy5fZGF0ZXBpY2tlci5fc2VsZWN0ZWRDaGFuZ2VkLnN1YnNjcmliZSgoc2VsZWN0ZWQ6IEQpID0+IHtcbiAgICAgIHRoaXMudmFsdWUgPSBzZWxlY3RlZDtcbiAgICAgIHRoaXMuX2N2YU9uQ2hhbmdlKHNlbGVjdGVkKTtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgdGhpcy5kYXRlSW5wdXQuZW1pdChuZXcgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG4gICAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdChuZXcgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG4gICAgfSk7XG4gIH1cbiAgX2RhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXI8RD47XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBkYXRlcyB3aXRoaW4gdGhlIGRhdGVwaWNrZXIuICovXG4gIEBJbnB1dCgpXG4gIHNldCBtYXREYXRlcGlja2VyRmlsdGVyKHZhbHVlOiAoZGF0ZTogRCB8IG51bGwpID0+IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kYXRlRmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxuICBfZGF0ZUZpbHRlcjogKGRhdGU6IEQgfCBudWxsKSA9PiBib29sZWFuO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGlucHV0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpO1xuICAgIHRoaXMuX2xhc3RWYWx1ZVZhbGlkID0gIXZhbHVlIHx8IHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQodmFsdWUpO1xuICAgIHZhbHVlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHZhbHVlKTtcbiAgICBjb25zdCBvbGREYXRlID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUob2xkRGF0ZSwgdmFsdWUpKSB7XG4gICAgICB0aGlzLl92YWx1ZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21pbiA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXggPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXItaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuZW1pdChuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBudWxsIGNoZWNrIHRoZSBgYmx1cmAgbWV0aG9kLCBiZWNhdXNlIGl0J3MgdW5kZWZpbmVkIGR1cmluZyBTU1IuXG4gICAgaWYgKG5ld1ZhbHVlICYmIGVsZW1lbnQuYmx1cikge1xuICAgICAgLy8gTm9ybWFsbHksIG5hdGl2ZSBpbnB1dCBlbGVtZW50cyBhdXRvbWF0aWNhbGx5IGJsdXIgaWYgdGhleSB0dXJuIGRpc2FibGVkLiBUaGlzIGJlaGF2aW9yXG4gICAgICAvLyBpcyBwcm9ibGVtYXRpYywgYmVjYXVzZSBpdCB3b3VsZCBtZWFuIHRoYXQgaXQgdHJpZ2dlcnMgYW5vdGhlciBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLFxuICAgICAgLy8gd2hpY2ggdGhlbiBjYXVzZXMgYSBjaGFuZ2VkIGFmdGVyIGNoZWNrZWQgZXJyb3IgaWYgdGhlIGlucHV0IGVsZW1lbnQgd2FzIGZvY3VzZWQgYmVmb3JlLlxuICAgICAgZWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgYGNoYW5nZWAgZXZlbnQgaXMgZmlyZWQgb24gdGhpcyBgPGlucHV0PmAuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RD4+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RD4+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYGlucHV0YCBldmVudCBpcyBmaXJlZCBvbiB0aGlzIGA8aW5wdXQ+YC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRhdGVJbnB1dDogRXZlbnRFbWl0dGVyPE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQ+PiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQ+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIChlaXRoZXIgZHVlIHRvIHVzZXIgaW5wdXQgb3IgcHJvZ3JhbW1hdGljIGNoYW5nZSkuICovXG4gIF92YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RCB8IG51bGw+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRpc2FibGVkIHN0YXRlIGhhcyBjaGFuZ2VkICovXG4gIF9kaXNhYmxlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfY3ZhT25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yT25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICBwcml2YXRlIF9kYXRlcGlja2VyU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIHByaXZhdGUgX2xvY2FsZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHdoZXRoZXIgdGhlIGlucHV0IHBhcnNlcy4gKi9cbiAgcHJpdmF0ZSBfcGFyc2VWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFZhbHVlVmFsaWQgP1xuICAgICAgICBudWxsIDogeydtYXREYXRlcGlja2VyUGFyc2UnOiB7J3RleHQnOiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWV9fTtcbiAgfVxuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIG1pbiBkYXRlLiAqL1xuICBwcml2YXRlIF9taW5WYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIHJldHVybiAoIXRoaXMubWluIHx8ICFjb250cm9sVmFsdWUgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUodGhpcy5taW4sIGNvbnRyb2xWYWx1ZSkgPD0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXREYXRlcGlja2VyTWluJzogeydtaW4nOiB0aGlzLm1pbiwgJ2FjdHVhbCc6IGNvbnRyb2xWYWx1ZX19O1xuICB9XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgbWF4IGRhdGUuICovXG4gIHByaXZhdGUgX21heFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgcmV0dXJuICghdGhpcy5tYXggfHwgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZSh0aGlzLm1heCwgY29udHJvbFZhbHVlKSA+PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdERhdGVwaWNrZXJNYXgnOiB7J21heCc6IHRoaXMubWF4LCAnYWN0dWFsJzogY29udHJvbFZhbHVlfX07XG4gIH1cblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBkYXRlIGZpbHRlci4gKi9cbiAgcHJpdmF0ZSBfZmlsdGVyVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICByZXR1cm4gIXRoaXMuX2RhdGVGaWx0ZXIgfHwgIWNvbnRyb2xWYWx1ZSB8fCB0aGlzLl9kYXRlRmlsdGVyKGNvbnRyb2xWYWx1ZSkgP1xuICAgICAgICBudWxsIDogeydtYXREYXRlcGlja2VyRmlsdGVyJzogdHJ1ZX07XG4gIH1cblxuICAvKiogVGhlIGNvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByaXZhdGUgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsID1cbiAgICAgIFZhbGlkYXRvcnMuY29tcG9zZShcbiAgICAgICAgICBbdGhpcy5fcGFyc2VWYWxpZGF0b3IsIHRoaXMuX21pblZhbGlkYXRvciwgdGhpcy5fbWF4VmFsaWRhdG9yLCB0aGlzLl9maWx0ZXJWYWxpZGF0b3JdKTtcblxuICAvKiogV2hldGhlciB0aGUgbGFzdCB2YWx1ZSBzZXQgb24gdGhlIGlucHV0IHdhcyB2YWxpZC4gKi9cbiAgcHJpdmF0ZSBfbGFzdFZhbHVlVmFsaWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQpIHtcbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignRGF0ZUFkYXB0ZXInKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9kYXRlRm9ybWF0cykge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ01BVF9EQVRFX0ZPUk1BVFMnKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBkYXRlIHdoZW4gdGhlIGxvY2FsZSBjaGFuZ2VzLlxuICAgIHRoaXMuX2xvY2FsZVN1YnNjcmlwdGlvbiA9IF9kYXRlQWRhcHRlci5sb2NhbGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2RhdGVwaWNrZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9sb2NhbGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl92YWx1ZUNoYW5nZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yID8gdGhpcy5fdmFsaWRhdG9yKGMpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIFVzZSBgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbmAgaW5zdGVhZFxuICAgKi9cbiAgZ2V0UG9wdXBDb25uZWN0aW9uRWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWxlbWVudCB0aGF0IHRoZSBkYXRlcGlja2VyIHBvcHVwIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8uXG4gICAqIEByZXR1cm4gVGhlIGVsZW1lbnQgdG8gY29ubmVjdCB0aGUgcG9wdXAgdG8uXG4gICAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHdyaXRlVmFsdWUodmFsdWU6IEQpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX2N2YU9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgaXNBbHREb3duQXJyb3cgPSBldmVudC5hbHRLZXkgJiYgZXZlbnQua2V5Q29kZSA9PT0gRE9XTl9BUlJPVztcblxuICAgIGlmICh0aGlzLl9kYXRlcGlja2VyICYmIGlzQWx0RG93bkFycm93ICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVhZE9ubHkpIHtcbiAgICAgIHRoaXMuX2RhdGVwaWNrZXIub3BlbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGRhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5wYXJzZSh2YWx1ZSwgdGhpcy5fZGF0ZUZvcm1hdHMucGFyc2UuZGF0ZUlucHV0KTtcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9ICFkYXRlIHx8IHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XG4gICAgZGF0ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbChkYXRlKTtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUoZGF0ZSwgdGhpcy5fdmFsdWUpKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IGRhdGU7XG4gICAgICB0aGlzLl9jdmFPbkNoYW5nZShkYXRlKTtcbiAgICAgIHRoaXMuX3ZhbHVlQ2hhbmdlLmVtaXQoZGF0ZSk7XG4gICAgICB0aGlzLmRhdGVJbnB1dC5lbWl0KG5ldyBNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBfb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQobmV3IE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbGV0dGUgdXNlZCBieSB0aGUgaW5wdXQncyBmb3JtIGZpZWxkLCBpZiBhbnkuICovXG4gIF9nZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmNvbG9yIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYmx1ciBldmVudHMgb24gdGhlIGlucHV0LiAqL1xuICBfb25CbHVyKCkge1xuICAgIC8vIFJlZm9ybWF0IHRoZSBpbnB1dCBvbmx5IGlmIHdlIGhhdmUgYSB2YWxpZCB2YWx1ZS5cbiAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5fZm9ybWF0VmFsdWUodGhpcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gIH1cblxuICAvKiogRm9ybWF0cyBhIHZhbHVlIGFuZCBzZXRzIGl0IG9uIHRoZSBpbnB1dCBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPVxuICAgICAgICB2YWx1ZSA/IHRoaXMuX2RhdGVBZGFwdGVyLmZvcm1hdCh2YWx1ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5kYXRlSW5wdXQpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBUaGUgZ2l2ZW4gb2JqZWN0IGlmIGl0IGlzIGJvdGggYSBkYXRlIGluc3RhbmNlIGFuZCB2YWxpZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBwcml2YXRlIF9nZXRWYWxpZERhdGVPck51bGwob2JqOiBhbnkpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9kYXRlQWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQob2JqKSkgPyBvYmogOiBudWxsO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICAvLyBBY2NlcHQgYGFueWAgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggb3RoZXIgZGlyZWN0aXZlcyBvbiBgPGlucHV0PmAgdGhhdFxuICAvLyBtYXkgYWNjZXB0IGRpZmZlcmVudCB0eXBlcy5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBhbnk7XG59XG4iXX0=