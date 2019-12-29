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
        var lastValueWasValid = this._lastValueValid;
        var date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._getValidDateOrNull(date);
        if (!this._dateAdapter.sameDate(date, this._value)) {
            this._value = date;
            this._cvaOnChange(date);
            this._valueChange.emit(date);
            this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
        }
        else if (lastValueWasValid !== this._lastValueValid) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBSWpCLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQStCLE1BQU0sd0JBQXdCLENBQUM7QUFDbkcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUvRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLElBQU0sNkJBQTZCLEdBQVE7SUFDaEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxrQkFBa0IsRUFBbEIsQ0FBa0IsQ0FBQztJQUNqRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFB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RTtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osc0JBQXNCLEVBQUUsK0JBQStCO3dCQUN2RCxrQkFBa0IsRUFBRSxpREFBaUQ7d0JBQ3JFLFlBQVksRUFBRSwwQ0FBMEM7d0JBQ3hELFlBQVksRUFBRSwwQ0FBMEM7d0JBQ3hELFlBQVksRUFBRSxVQUFVO3dCQUN4QixTQUFTLEVBQUUsK0JBQStCO3dCQUMxQyxVQUFVLEVBQUUsYUFBYTt3QkFDekIsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFdBQVcsRUFBRSxvQkFBb0I7cUJBQ2xDO29CQUNELFFBQVEsRUFBRSxvQkFBb0I7aUJBQy9COzs7O2dCQWhGQyxVQUFVO2dCQW1CSixXQUFXLHVCQW9OWixRQUFRO2dEQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsZ0JBQWdCO2dCQXBObEMsWUFBWSx1QkFxTmIsUUFBUTs7O2dDQXRKWixLQUFLO3NDQXFCTCxLQUFLO3dCQVFMLEtBQUs7c0JBaUJMLEtBQUs7c0JBU0wsS0FBSzsyQkFTTCxLQUFLOzZCQXNCTCxNQUFNOzRCQUlOLE1BQU07O0lBNkxULHlCQUFDO0NBQUEsQUE3U0QsSUE2U0M7U0F6Ulksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPV05fQVJST1d9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3IsXG4gIFZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0RhdGVBZGFwdGVyLCBNQVRfREFURV9GT1JNQVRTLCBNYXREYXRlRm9ybWF0cywgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7TUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXBpY2tlcklucHV0KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVQSUNLRVJfVkFMSURBVE9SUzogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXREYXRlcGlja2VySW5wdXQpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEFuIGV2ZW50IHVzZWQgZm9yIGRhdGVwaWNrZXIgaW5wdXQgYW5kIGNoYW5nZSBldmVudHMuIFdlIGRvbid0IGFsd2F5cyBoYXZlIGFjY2VzcyB0byBhIG5hdGl2ZVxuICogaW5wdXQgb3IgY2hhbmdlIGV2ZW50IGJlY2F1c2UgdGhlIGV2ZW50IG1heSBoYXZlIGJlZW4gdHJpZ2dlcmVkIGJ5IHRoZSB1c2VyIGNsaWNraW5nIG9uIHRoZVxuICogY2FsZW5kYXIgcG9wdXAuIEZvciBjb25zaXN0ZW5jeSwgd2UgYWx3YXlzIHVzZSBNYXREYXRlcGlja2VySW5wdXRFdmVudCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RD4ge1xuICAvKiogVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHRhcmdldCBkYXRlcGlja2VyIGlucHV0LiAqL1xuICB2YWx1ZTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZGF0ZXBpY2tlciBpbnB1dCBjb21wb25lbnQgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgdGFyZ2V0OiBNYXREYXRlcGlja2VySW5wdXQ8RD4sXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlcGlja2VyIGlucHV0LiAqL1xuICAgIHB1YmxpYyB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnRhcmdldC52YWx1ZTtcbiAgfVxufVxuXG5cbi8qKiBEaXJlY3RpdmUgdXNlZCB0byBjb25uZWN0IGFuIGlucHV0IHRvIGEgTWF0RGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdERhdGVwaWNrZXJdJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IsXG4gICAgTUFUX0RBVEVQSUNLRVJfVkFMSURBVE9SUyxcbiAgICB7cHJvdmlkZTogTUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTWF0RGF0ZXBpY2tlcklucHV0fSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfZGF0ZXBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX2RhdGVwaWNrZXI/Lm9wZW5lZCAmJiBfZGF0ZXBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnbWluID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtaW4pIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnbWF4ID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtYXgpIDogbnVsbCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlcklucHV0Jyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0PEQ+IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgVmFsaWRhdG9yIHtcbiAgLyoqIFRoZSBkYXRlcGlja2VyIHRoYXQgdGhpcyBpbnB1dCBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgpXG4gIHNldCBtYXREYXRlcGlja2VyKHZhbHVlOiBNYXREYXRlcGlja2VyPEQ+KSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2RhdGVwaWNrZXIgPSB2YWx1ZTtcbiAgICB0aGlzLl9kYXRlcGlja2VyLl9yZWdpc3RlcklucHV0KHRoaXMpO1xuICAgIHRoaXMuX2RhdGVwaWNrZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgIHRoaXMuX2RhdGVwaWNrZXJTdWJzY3JpcHRpb24gPSB0aGlzLl9kYXRlcGlja2VyLl9zZWxlY3RlZENoYW5nZWQuc3Vic2NyaWJlKChzZWxlY3RlZDogRCkgPT4ge1xuICAgICAgdGhpcy52YWx1ZSA9IHNlbGVjdGVkO1xuICAgICAgdGhpcy5fY3ZhT25DaGFuZ2Uoc2VsZWN0ZWQpO1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICB0aGlzLmRhdGVJbnB1dC5lbWl0KG5ldyBNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KG5ldyBNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICB9KTtcbiAgfVxuICBfZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlcjxEPjtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGRhdGVzIHdpdGhpbiB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgQElucHV0KClcbiAgc2V0IG1hdERhdGVwaWNrZXJGaWx0ZXIodmFsdWU6IChkYXRlOiBEIHwgbnVsbCkgPT4gYm9vbGVhbikge1xuICAgIHRoaXMuX2RhdGVGaWx0ZXIgPSB2YWx1ZTtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG4gIF9kYXRlRmlsdGVyOiAoZGF0ZTogRCB8IG51bGwpID0+IGJvb2xlYW47XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgdGhpcy5fbGFzdFZhbHVlVmFsaWQgPSAhdmFsdWUgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIuaXNWYWxpZCh2YWx1ZSk7XG4gICAgdmFsdWUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodmFsdWUpO1xuICAgIGNvbnN0IG9sZERhdGUgPSB0aGlzLnZhbHVlO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fZm9ybWF0VmFsdWUodmFsdWUpO1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZShvbGREYXRlLCB2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX3ZhbHVlQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92YWx1ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluOyB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxuICBwcml2YXRlIF9taW46IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlci1pbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9kaXNhYmxlZENoYW5nZS5lbWl0KG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIG51bGwgY2hlY2sgdGhlIGBibHVyYCBtZXRob2QsIGJlY2F1c2UgaXQncyB1bmRlZmluZWQgZHVyaW5nIFNTUi5cbiAgICBpZiAobmV3VmFsdWUgJiYgZWxlbWVudC5ibHVyKSB7XG4gICAgICAvLyBOb3JtYWxseSwgbmF0aXZlIGlucHV0IGVsZW1lbnRzIGF1dG9tYXRpY2FsbHkgYmx1ciBpZiB0aGV5IHR1cm4gZGlzYWJsZWQuIFRoaXMgYmVoYXZpb3JcbiAgICAgIC8vIGlzIHByb2JsZW1hdGljLCBiZWNhdXNlIGl0IHdvdWxkIG1lYW4gdGhhdCBpdCB0cmlnZ2VycyBhbm90aGVyIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsXG4gICAgICAvLyB3aGljaCB0aGVuIGNhdXNlcyBhIGNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvciBpZiB0aGUgaW5wdXQgZWxlbWVudCB3YXMgZm9jdXNlZCBiZWZvcmUuXG4gICAgICBlbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBgY2hhbmdlYCBldmVudCBpcyBmaXJlZCBvbiB0aGlzIGA8aW5wdXQ+YC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXREYXRlcGlja2VySW5wdXRFdmVudDxEPj4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXREYXRlcGlja2VySW5wdXRFdmVudDxEPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbiBgaW5wdXRgIGV2ZW50IGlzIGZpcmVkIG9uIHRoaXMgYDxpbnB1dD5gLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGF0ZUlucHV0OiBFdmVudEVtaXR0ZXI8TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RD4+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RD4+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgKGVpdGhlciBkdWUgdG8gdXNlciBpbnB1dCBvciBwcm9ncmFtbWF0aWMgY2hhbmdlKS4gKi9cbiAgX3ZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEIHwgbnVsbD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgaGFzIGNoYW5nZWQgKi9cbiAgX2Rpc2FibGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBwcml2YXRlIF9jdmFPbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICBwcml2YXRlIF92YWxpZGF0b3JPbkNoYW5nZSA9ICgpID0+IHt9O1xuXG4gIHByaXZhdGUgX2RhdGVwaWNrZXJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgcHJpdmF0ZSBfbG9jYWxlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3Igd2hldGhlciB0aGUgaW5wdXQgcGFyc2VzLiAqL1xuICBwcml2YXRlIF9wYXJzZVZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIHJldHVybiB0aGlzLl9sYXN0VmFsdWVWYWxpZCA/XG4gICAgICAgIG51bGwgOiB7J21hdERhdGVwaWNrZXJQYXJzZSc6IHsndGV4dCc6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZX19O1xuICB9XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgbWluIGRhdGUuICovXG4gIHByaXZhdGUgX21pblZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgcmV0dXJuICghdGhpcy5taW4gfHwgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZSh0aGlzLm1pbiwgY29udHJvbFZhbHVlKSA8PSAwKSA/XG4gICAgICAgIG51bGwgOiB7J21hdERhdGVwaWNrZXJNaW4nOiB7J21pbic6IHRoaXMubWluLCAnYWN0dWFsJzogY29udHJvbFZhbHVlfX07XG4gIH1cblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtYXggZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfbWF4VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICByZXR1cm4gKCF0aGlzLm1heCB8fCAhY29udHJvbFZhbHVlIHx8XG4gICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKHRoaXMubWF4LCBjb250cm9sVmFsdWUpID49IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RGF0ZXBpY2tlck1heCc6IHsnbWF4JzogdGhpcy5tYXgsICdhY3R1YWwnOiBjb250cm9sVmFsdWV9fTtcbiAgfVxuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIGRhdGUgZmlsdGVyLiAqL1xuICBwcml2YXRlIF9maWx0ZXJWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIHJldHVybiAhdGhpcy5fZGF0ZUZpbHRlciB8fCAhY29udHJvbFZhbHVlIHx8IHRoaXMuX2RhdGVGaWx0ZXIoY29udHJvbFZhbHVlKSA/XG4gICAgICAgIG51bGwgOiB7J21hdERhdGVwaWNrZXJGaWx0ZXInOiB0cnVlfTtcbiAgfVxuXG4gIC8qKiBUaGUgY29tYmluZWQgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhpcyBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGwgPVxuICAgICAgVmFsaWRhdG9ycy5jb21wb3NlKFxuICAgICAgICAgIFt0aGlzLl9wYXJzZVZhbGlkYXRvciwgdGhpcy5fbWluVmFsaWRhdG9yLCB0aGlzLl9tYXhWYWxpZGF0b3IsIHRoaXMuX2ZpbHRlclZhbGlkYXRvcl0pO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYXN0IHZhbHVlIHNldCBvbiB0aGUgaW5wdXQgd2FzIHZhbGlkLiAqL1xuICBwcml2YXRlIF9sYXN0VmFsdWVWYWxpZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBwcml2YXRlIF9kYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMsXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9mb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCkge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTUFUX0RBVEVfRk9STUFUUycpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgZGlzcGxheWVkIGRhdGUgd2hlbiB0aGUgbG9jYWxlIGNoYW5nZXMuXG4gICAgdGhpcy5fbG9jYWxlU3Vic2NyaXB0aW9uID0gX2RhdGVBZGFwdGVyLmxvY2FsZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGF0ZXBpY2tlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2xvY2FsZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3ZhbHVlQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IgPyB0aGlzLl92YWxpZGF0b3IoYykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgVXNlIGBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luYCBpbnN0ZWFkXG4gICAqL1xuICBnZXRQb3B1cENvbm5lY3Rpb25FbGVtZW50UmVmKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNvbm5lY3RlZCB0by5cbiAgICogQHJldHVybiBUaGUgZWxlbWVudCB0byBjb25uZWN0IHRoZSBwb3B1cCB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogRCk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fY3ZhT25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBpc0FsdERvd25BcnJvdyA9IGV2ZW50LmFsdEtleSAmJiBldmVudC5rZXlDb2RlID09PSBET1dOX0FSUk9XO1xuXG4gICAgaWYgKHRoaXMuX2RhdGVwaWNrZXIgJiYgaXNBbHREb3duQXJyb3cgJiYgIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZWFkT25seSkge1xuICAgICAgdGhpcy5fZGF0ZXBpY2tlci5vcGVuKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsYXN0VmFsdWVXYXNWYWxpZCA9IHRoaXMuX2xhc3RWYWx1ZVZhbGlkO1xuICAgIGxldCBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIucGFyc2UodmFsdWUsIHRoaXMuX2RhdGVGb3JtYXRzLnBhcnNlLmRhdGVJbnB1dCk7XG4gICAgdGhpcy5fbGFzdFZhbHVlVmFsaWQgPSAhZGF0ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKGRhdGUpO1xuICAgIGRhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwoZGF0ZSk7XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKGRhdGUsIHRoaXMuX3ZhbHVlKSkge1xuICAgICAgdGhpcy5fdmFsdWUgPSBkYXRlO1xuICAgICAgdGhpcy5fY3ZhT25DaGFuZ2UoZGF0ZSk7XG4gICAgICB0aGlzLl92YWx1ZUNoYW5nZS5lbWl0KGRhdGUpO1xuICAgICAgdGhpcy5kYXRlSW5wdXQuZW1pdChuZXcgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG4gICAgfSBlbHNlIGlmIChsYXN0VmFsdWVXYXNWYWxpZCAhPT0gdGhpcy5fbGFzdFZhbHVlVmFsaWQpIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KG5ldyBNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBwYWxldHRlIHVzZWQgYnkgdGhlIGlucHV0J3MgZm9ybSBmaWVsZCwgaWYgYW55LiAqL1xuICBfZ2V0VGhlbWVQYWxldHRlKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5jb2xvciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGJsdXIgZXZlbnRzIG9uIHRoZSBpbnB1dC4gKi9cbiAgX29uQmx1cigpIHtcbiAgICAvLyBSZWZvcm1hdCB0aGUgaW5wdXQgb25seSBpZiB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2Zvcm1hdFZhbHVlKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgLyoqIEZvcm1hdHMgYSB2YWx1ZSBhbmQgc2V0cyBpdCBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID1cbiAgICAgICAgdmFsdWUgPyB0aGlzLl9kYXRlQWRhcHRlci5mb3JtYXQodmFsdWUsIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkuZGF0ZUlucHV0KSA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VmFsaWREYXRlT3JOdWxsKG9iajogYW55KTogRCB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5fZGF0ZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJiB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKG9iaikpID8gb2JqIDogbnVsbDtcbiAgfVxuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0XG4gIC8vIG1heSBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=