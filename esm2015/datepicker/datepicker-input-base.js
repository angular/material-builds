/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { Directive, ElementRef, EventEmitter, Inject, Input, Optional, Output, } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { createMissingDateImplError } from './datepicker-errors';
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
export class MatDatepickerInputEvent {
    constructor(
    /** Reference to the datepicker input component that emitted the event. */
    target, 
    /** Reference to the native input element associated with the datepicker input. */
    targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
/** Base class for datepicker inputs. */
let MatDatepickerInputBase = /** @class */ (() => {
    class MatDatepickerInputBase {
        constructor(_elementRef, _dateAdapter, _dateFormats) {
            this._elementRef = _elementRef;
            this._dateAdapter = _dateAdapter;
            this._dateFormats = _dateFormats;
            /** Emits when a `change` event is fired on this `<input>`. */
            this.dateChange = new EventEmitter();
            /** Emits when an `input` event is fired on this `<input>`. */
            this.dateInput = new EventEmitter();
            /** Emits when the value changes (either due to user input or programmatic change). */
            this._valueChange = new EventEmitter();
            /** Emits when the disabled state has changed */
            this._disabledChange = new EventEmitter();
            this._onTouched = () => { };
            this._validatorOnChange = () => { };
            this._cvaOnChange = () => { };
            this._valueChangesSubscription = Subscription.EMPTY;
            this._localeSubscription = Subscription.EMPTY;
            /** The form control validator for whether the input parses. */
            this._parseValidator = () => {
                return this._lastValueValid ?
                    null : { 'matDatepickerParse': { 'text': this._elementRef.nativeElement.value } };
            };
            /** The form control validator for the date filter. */
            this._filterValidator = (control) => {
                const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const dateFilter = this._getDateFilter();
                return !dateFilter || !controlValue || dateFilter(controlValue) ?
                    null : { 'matDatepickerFilter': true };
            };
            /** The form control validator for the min date. */
            this._minValidator = (control) => {
                const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const min = this._getMinDate();
                return (!min || !controlValue ||
                    this._dateAdapter.compareDate(min, controlValue) <= 0) ?
                    null : { 'matDatepickerMin': { 'min': min, 'actual': controlValue } };
            };
            /** The form control validator for the max date. */
            this._maxValidator = (control) => {
                const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const max = this._getMaxDate();
                return (!max || !controlValue ||
                    this._dateAdapter.compareDate(max, controlValue) >= 0) ?
                    null : { 'matDatepickerMax': { 'max': max, 'actual': controlValue } };
            };
            /** Whether the last value set on the input was valid. */
            this._lastValueValid = false;
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
            // Update the displayed date when the locale changes.
            this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
                this.value = this.value;
            });
        }
        /** The value of the input. */
        get value() {
            return this._model ? this._getValueFromModel(this._model.selection) : this._pendingValue;
        }
        set value(value) {
            value = this._dateAdapter.deserialize(value);
            this._lastValueValid = !value || this._dateAdapter.isValid(value);
            value = this._getValidDateOrNull(value);
            const oldDate = this.value;
            this._assignValue(value);
            this._formatValue(value);
            if (!this._dateAdapter.sameDate(oldDate, value)) {
                this._valueChange.emit(value);
            }
        }
        /** Whether the datepicker-input is disabled. */
        get disabled() { return !!this._disabled || this._parentDisabled(); }
        set disabled(value) {
            const newValue = coerceBooleanProperty(value);
            const element = this._elementRef.nativeElement;
            if (this._disabled !== newValue) {
                this._disabled = newValue;
                this._disabledChange.emit(newValue);
            }
            // We need to null check the `blur` method, because it's undefined during SSR.
            // In Ivy static bindings are invoked earlier, before the element is attached to the DOM.
            // This can cause an error to be thrown in some browsers (IE/Edge) which assert that the
            // element has been inserted.
            if (newValue && this._isInitialized && element.blur) {
                // Normally, native input elements automatically blur if they turn disabled. This behavior
                // is problematic, because it would mean that it triggers another change detection cycle,
                // which then causes a changed after checked error if the input element was focused before.
                element.blur();
            }
        }
        /** Gets the base validator functions. */
        _getValidators() {
            return [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator];
        }
        /** Registers a date selection model with the input. */
        _registerModel(model) {
            this._model = model;
            this._valueChangesSubscription.unsubscribe();
            if (this._pendingValue) {
                this._assignValue(this._pendingValue);
            }
            this._valueChangesSubscription = this._model.selectionChanged.subscribe(event => {
                if (event.source !== this) {
                    const value = this._getValueFromModel(event.selection);
                    this._cvaOnChange(value);
                    this._onTouched();
                    this._formatValue(value);
                    this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
                    this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
                    if (this._outsideValueChanged) {
                        this._outsideValueChanged();
                    }
                }
            });
        }
        ngAfterViewInit() {
            this._isInitialized = true;
        }
        ngOnDestroy() {
            this._valueChangesSubscription.unsubscribe();
            this._localeSubscription.unsubscribe();
            this._valueChange.complete();
            this._disabledChange.complete();
        }
        /** @docs-private */
        registerOnValidatorChange(fn) {
            this._validatorOnChange = fn;
        }
        /** @docs-private */
        validate(c) {
            return this._validator ? this._validator(c) : null;
        }
        // Implemented as part of ControlValueAccessor.
        writeValue(value) {
            this.value = value;
        }
        // Implemented as part of ControlValueAccessor.
        registerOnChange(fn) {
            this._cvaOnChange = fn;
        }
        // Implemented as part of ControlValueAccessor.
        registerOnTouched(fn) {
            this._onTouched = fn;
        }
        // Implemented as part of ControlValueAccessor.
        setDisabledState(isDisabled) {
            this.disabled = isDisabled;
        }
        _onKeydown(event) {
            const isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;
            if (isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
                this._openPopup();
                event.preventDefault();
            }
        }
        _onInput(value) {
            const lastValueWasValid = this._lastValueValid;
            let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
            this._lastValueValid = !date || this._dateAdapter.isValid(date);
            date = this._getValidDateOrNull(date);
            if (!this._dateAdapter.sameDate(date, this.value)) {
                this._assignValue(date);
                this._cvaOnChange(date);
                this._valueChange.emit(date);
                this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
            }
            else if (lastValueWasValid !== this._lastValueValid) {
                this._validatorOnChange();
            }
        }
        _onChange() {
            this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
        }
        /** Handles blur events on the input. */
        _onBlur() {
            // Reformat the input only if we have a valid value.
            if (this.value) {
                this._formatValue(this.value);
            }
            this._onTouched();
        }
        /** Formats a value and sets it on the input element. */
        _formatValue(value) {
            this._elementRef.nativeElement.value =
                value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
        }
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        _getValidDateOrNull(obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        }
        /** Assigns a value to the model. */
        _assignValue(value) {
            // We may get some incoming values before the model was
            // assigned. Save the value so that we can assign it later.
            if (this._model) {
                this._assignValueToModel(value);
                this._pendingValue = null;
            }
            else {
                this._pendingValue = value;
            }
        }
        /**
         * Checks whether a parent control is disabled. This is in place so that it can be overridden
         * by inputs extending this one which can be placed inside of a group that can be disabled.
         */
        _parentDisabled() {
            return false;
        }
    }
    MatDatepickerInputBase.decorators = [
        { type: Directive }
    ];
    MatDatepickerInputBase.ctorParameters = () => [
        { type: ElementRef },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] }
    ];
    MatDatepickerInputBase.propDecorators = {
        value: [{ type: Input }],
        disabled: [{ type: Input }],
        dateChange: [{ type: Output }],
        dateInput: [{ type: Output }]
    };
    return MatDatepickerInputBase;
})();
export { MatDatepickerInputBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pbnB1dC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBUXZCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEdBRWpCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUcvRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHVCQUF1QjtJQUlsQztJQUNJLDBFQUEwRTtJQUNuRSxNQUFvQztJQUMzQyxrRkFBa0Y7SUFDM0UsYUFBMEI7UUFGMUIsV0FBTSxHQUFOLE1BQU0sQ0FBOEI7UUFFcEMsa0JBQWEsR0FBYixhQUFhLENBQWE7UUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFLRCx3Q0FBd0M7QUFDeEM7SUFBQSxNQUNzQixzQkFBc0I7UUEwSzFDLFlBQ2MsV0FBeUMsRUFDaEMsWUFBNEIsRUFDRCxZQUE0QjtZQUZoRSxnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7WUFDaEMsaUJBQVksR0FBWixZQUFZLENBQWdCO1lBQ0QsaUJBQVksR0FBWixZQUFZLENBQWdCO1lBM0g5RSw4REFB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QUFJLE1BQU0sU0FBQyxnQkFBZ0I7Ozt3QkF0S3ZDLEtBQUs7MkJBbUJMLEtBQUs7NkJBeUJMLE1BQU07NEJBSU4sTUFBTTs7SUEwUFQsNkJBQUM7S0FBQTtTQWpUcUIsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPV05fQVJST1d9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvcixcbiAgVmFsaWRhdG9yRm4sXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIERhdGVBZGFwdGVyLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBNYXREYXRlRm9ybWF0cyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7RXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbiwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqXG4gKiBBbiBldmVudCB1c2VkIGZvciBkYXRlcGlja2VyIGlucHV0IGFuZCBjaGFuZ2UgZXZlbnRzLiBXZSBkb24ndCBhbHdheXMgaGF2ZSBhY2Nlc3MgdG8gYSBuYXRpdmVcbiAqIGlucHV0IG9yIGNoYW5nZSBldmVudCBiZWNhdXNlIHRoZSBldmVudCBtYXkgaGF2ZSBiZWVuIHRyaWdnZXJlZCBieSB0aGUgdXNlciBjbGlja2luZyBvbiB0aGVcbiAqIGNhbGVuZGFyIHBvcHVwLiBGb3IgY29uc2lzdGVuY3ksIHdlIGFsd2F5cyB1c2UgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQsIFMgPSB1bmtub3duPiB7XG4gIC8qKiBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdGFyZ2V0IGRhdGVwaWNrZXIgaW5wdXQuICovXG4gIHZhbHVlOiBEIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGRhdGVwaWNrZXIgaW5wdXQgY29tcG9uZW50IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgICBwdWJsaWMgdGFyZ2V0OiBNYXREYXRlcGlja2VySW5wdXRCYXNlPFMsIEQ+LFxuICAgICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlcGlja2VyIGlucHV0LiAqL1xuICAgICAgcHVibGljIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudGFyZ2V0LnZhbHVlO1xuICB9XG59XG5cbi8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbHRlciBvdXQgZGF0ZXMgZnJvbSBhIGNhbGVuZGFyLiAqL1xuZXhwb3J0IHR5cGUgRGF0ZUZpbHRlckZuPEQ+ID0gKGRhdGU6IEQgfCBudWxsKSA9PiBib29sZWFuO1xuXG4vKiogQmFzZSBjbGFzcyBmb3IgZGF0ZXBpY2tlciBpbnB1dHMuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXREYXRlcGlja2VySW5wdXRCYXNlPFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIFZhbGlkYXRvciB7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZDogYm9vbGVhbjtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwgPyB0aGlzLl9nZXRWYWx1ZUZyb21Nb2RlbCh0aGlzLl9tb2RlbC5zZWxlY3Rpb24pIDogdGhpcy5fcGVuZGluZ1ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB2YWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9ICF2YWx1ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKHZhbHVlKTtcbiAgICB2YWx1ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh2YWx1ZSk7XG4gICAgY29uc3Qgb2xkRGF0ZSA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy5fYXNzaWduVmFsdWUodmFsdWUpO1xuICAgIHRoaXMuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUob2xkRGF0ZSwgdmFsdWUpKSB7XG4gICAgICB0aGlzLl92YWx1ZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyLWlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuX2Rpc2FibGVkIHx8IHRoaXMuX3BhcmVudERpc2FibGVkKCk7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuZW1pdChuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBudWxsIGNoZWNrIHRoZSBgYmx1cmAgbWV0aG9kLCBiZWNhdXNlIGl0J3MgdW5kZWZpbmVkIGR1cmluZyBTU1IuXG4gICAgLy8gSW4gSXZ5IHN0YXRpYyBiaW5kaW5ncyBhcmUgaW52b2tlZCBlYXJsaWVyLCBiZWZvcmUgdGhlIGVsZW1lbnQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAgICAvLyBUaGlzIGNhbiBjYXVzZSBhbiBlcnJvciB0byBiZSB0aHJvd24gaW4gc29tZSBicm93c2VycyAoSUUvRWRnZSkgd2hpY2ggYXNzZXJ0IHRoYXQgdGhlXG4gICAgLy8gZWxlbWVudCBoYXMgYmVlbiBpbnNlcnRlZC5cbiAgICBpZiAobmV3VmFsdWUgJiYgdGhpcy5faXNJbml0aWFsaXplZCAmJiBlbGVtZW50LmJsdXIpIHtcbiAgICAgIC8vIE5vcm1hbGx5LCBuYXRpdmUgaW5wdXQgZWxlbWVudHMgYXV0b21hdGljYWxseSBibHVyIGlmIHRoZXkgdHVybiBkaXNhYmxlZC4gVGhpcyBiZWhhdmlvclxuICAgICAgLy8gaXMgcHJvYmxlbWF0aWMsIGJlY2F1c2UgaXQgd291bGQgbWVhbiB0aGF0IGl0IHRyaWdnZXJzIGFub3RoZXIgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSxcbiAgICAgIC8vIHdoaWNoIHRoZW4gY2F1c2VzIGEgY2hhbmdlZCBhZnRlciBjaGVja2VkIGVycm9yIGlmIHRoZSBpbnB1dCBlbGVtZW50IHdhcyBmb2N1c2VkIGJlZm9yZS5cbiAgICAgIGVsZW1lbnQuYmx1cigpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogRW1pdHMgd2hlbiBhIGBjaGFuZ2VgIGV2ZW50IGlzIGZpcmVkIG9uIHRoaXMgYDxpbnB1dD5gLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQsIFM+PiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQsIFM+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGBpbnB1dGAgZXZlbnQgaXMgZmlyZWQgb24gdGhpcyBgPGlucHV0PmAuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkYXRlSW5wdXQ6IEV2ZW50RW1pdHRlcjxNYXREYXRlcGlja2VySW5wdXRFdmVudDxELCBTPj4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXREYXRlcGlja2VySW5wdXRFdmVudDxELCBTPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcyAoZWl0aGVyIGR1ZSB0byB1c2VyIGlucHV0IG9yIHByb2dyYW1tYXRpYyBjaGFuZ2UpLiAqL1xuICBfdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQgfCBudWxsPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkaXNhYmxlZCBzdGF0ZSBoYXMgY2hhbmdlZCAqL1xuICBfZGlzYWJsZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBfdmFsaWRhdG9yT25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICBwcm90ZWN0ZWQgX2N2YU9uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIF92YWx1ZUNoYW5nZXNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIHByaXZhdGUgX2xvY2FsZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogU2luY2UgdGhlIHZhbHVlIGlzIGtlcHQgb24gdGhlIG1vZGVsIHdoaWNoIGlzIGFzc2lnbmVkIGluIGFuIElucHV0LFxuICAgKiB3ZSBtaWdodCBnZXQgYSB2YWx1ZSBiZWZvcmUgd2UgaGF2ZSBhIG1vZGVsLiBUaGlzIHByb3BlcnR5IGtlZXBzIHRyYWNrXG4gICAqIG9mIHRoZSB2YWx1ZSB1bnRpbCB3ZSBoYXZlIHNvbWV3aGVyZSB0byBhc3NpZ24gaXQuXG4gICAqL1xuICBwcml2YXRlIF9wZW5kaW5nVmFsdWU6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3Igd2hldGhlciB0aGUgaW5wdXQgcGFyc2VzLiAqL1xuICBwcml2YXRlIF9wYXJzZVZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIHJldHVybiB0aGlzLl9sYXN0VmFsdWVWYWxpZCA/XG4gICAgICAgIG51bGwgOiB7J21hdERhdGVwaWNrZXJQYXJzZSc6IHsndGV4dCc6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZX19O1xuICB9XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgZGF0ZSBmaWx0ZXIuICovXG4gIHByaXZhdGUgX2ZpbHRlclZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSk7XG4gICAgY29uc3QgZGF0ZUZpbHRlciA9IHRoaXMuX2dldERhdGVGaWx0ZXIoKTtcbiAgICByZXR1cm4gIWRhdGVGaWx0ZXIgfHwgIWNvbnRyb2xWYWx1ZSB8fCBkYXRlRmlsdGVyKGNvbnRyb2xWYWx1ZSkgP1xuICAgICAgICBudWxsIDogeydtYXREYXRlcGlja2VyRmlsdGVyJzogdHJ1ZX07XG4gIH1cblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtaW4gZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfbWluVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBtaW4gPSB0aGlzLl9nZXRNaW5EYXRlKCk7XG4gICAgcmV0dXJuICghbWluIHx8ICFjb250cm9sVmFsdWUgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUobWluLCBjb250cm9sVmFsdWUpIDw9IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RGF0ZXBpY2tlck1pbic6IHsnbWluJzogbWluLCAnYWN0dWFsJzogY29udHJvbFZhbHVlfX07XG4gIH1cblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtYXggZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfbWF4VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLl9nZXRNYXhEYXRlKCk7XG4gICAgcmV0dXJuICghbWF4IHx8ICFjb250cm9sVmFsdWUgfHxcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUobWF4LCBjb250cm9sVmFsdWUpID49IDApID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RGF0ZXBpY2tlck1heCc6IHsnbWF4JzogbWF4LCAnYWN0dWFsJzogY29udHJvbFZhbHVlfX07XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYmFzZSB2YWxpZGF0b3IgZnVuY3Rpb25zLiAqL1xuICBwcm90ZWN0ZWQgX2dldFZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgcmV0dXJuIFt0aGlzLl9wYXJzZVZhbGlkYXRvciwgdGhpcy5fbWluVmFsaWRhdG9yLCB0aGlzLl9tYXhWYWxpZGF0b3IsIHRoaXMuX2ZpbHRlclZhbGlkYXRvcl07XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWluaW11bSBkYXRlIGZvciB0aGUgaW5wdXQuIFVzZWQgZm9yIHZhbGlkYXRpb24uICovXG4gIGFic3RyYWN0IF9nZXRNaW5EYXRlKCk6IEQgfCBudWxsO1xuXG4gIC8qKiBHZXRzIHRoZSBtYXhpbXVtIGRhdGUgZm9yIHRoZSBpbnB1dC4gVXNlZCBmb3IgdmFsaWRhdGlvbi4gKi9cbiAgYWJzdHJhY3QgX2dldE1heERhdGUoKTogRCB8IG51bGw7XG5cbiAgLyoqIEdldHMgdGhlIGRhdGUgZmlsdGVyIGZ1bmN0aW9uLiBVc2VkIGZvciB2YWxpZGF0aW9uLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2dldERhdGVGaWx0ZXIoKTogRGF0ZUZpbHRlckZuPEQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBSZWdpc3RlcnMgYSBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgX3JlZ2lzdGVyTW9kZWwobW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPik6IHZvaWQge1xuICAgIHRoaXMuX21vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5fdmFsdWVDaGFuZ2VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICBpZiAodGhpcy5fcGVuZGluZ1ZhbHVlKSB7XG4gICAgICB0aGlzLl9hc3NpZ25WYWx1ZSh0aGlzLl9wZW5kaW5nVmFsdWUpO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IHRoaXMuX21vZGVsLnNlbGVjdGlvbkNoYW5nZWQuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5zb3VyY2UgIT09IHRoaXMpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9nZXRWYWx1ZUZyb21Nb2RlbChldmVudC5zZWxlY3Rpb24pO1xuICAgICAgICB0aGlzLl9jdmFPbkNoYW5nZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgICB0aGlzLl9mb3JtYXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuZGF0ZUlucHV0LmVtaXQobmV3IE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuICAgICAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdChuZXcgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX291dHNpZGVWYWx1ZUNoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLl9vdXRzaWRlVmFsdWVDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgcG9wdXAgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vcGVuUG9wdXAoKTogdm9pZDtcblxuICAvKiogQXNzaWducyBhIHZhbHVlIHRvIHRoZSBpbnB1dCdzIG1vZGVsLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2Fzc2lnblZhbHVlVG9Nb2RlbChtb2RlbDogRCB8IG51bGwpOiB2b2lkO1xuXG4gIC8qKiBDb252ZXJ0cyBhIHZhbHVlIGZyb20gdGhlIG1vZGVsIGludG8gYSBuYXRpdmUgdmFsdWUgZm9yIHRoZSBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBTKTogRCB8IG51bGw7XG5cbiAgLyoqIENvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQnbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3Rpb24gbW9kZWwgaXMgY2hhbmdlZFxuICAgKiBmcm9tIHNvbWV3aGVyZSB0aGF0J3Mgbm90IHRoZSBjdXJyZW50IGRhdGVwaWNrZXIgaW5wdXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX291dHNpZGVWYWx1ZUNoYW5nZWQ/OiAoKSA9PiB2b2lkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYXN0IHZhbHVlIHNldCBvbiB0aGUgaW5wdXQgd2FzIHZhbGlkLiAqL1xuICBwcm90ZWN0ZWQgX2xhc3RWYWx1ZVZhbGlkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzKSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBkaXNwbGF5ZWQgZGF0ZSB3aGVuIHRoZSBsb2NhbGUgY2hhbmdlcy5cbiAgICB0aGlzLl9sb2NhbGVTdWJzY3JpcHRpb24gPSBfZGF0ZUFkYXB0ZXIubG9jYWxlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl92YWx1ZUNoYW5nZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9sb2NhbGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl92YWx1ZUNoYW5nZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yID8gdGhpcy5fdmFsaWRhdG9yKGMpIDogbnVsbDtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHdyaXRlVmFsdWUodmFsdWU6IEQpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX2N2YU9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgaXNBbHREb3duQXJyb3cgPSBldmVudC5hbHRLZXkgJiYgZXZlbnQua2V5Q29kZSA9PT0gRE9XTl9BUlJPVztcblxuICAgIGlmIChpc0FsdERvd25BcnJvdyAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlYWRPbmx5KSB7XG4gICAgICB0aGlzLl9vcGVuUG9wdXAoKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQodmFsdWU6IHN0cmluZykge1xuICAgIGNvbnN0IGxhc3RWYWx1ZVdhc1ZhbGlkID0gdGhpcy5fbGFzdFZhbHVlVmFsaWQ7XG4gICAgbGV0IGRhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5wYXJzZSh2YWx1ZSwgdGhpcy5fZGF0ZUZvcm1hdHMucGFyc2UuZGF0ZUlucHV0KTtcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9ICFkYXRlIHx8IHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XG4gICAgZGF0ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbChkYXRlKTtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUoZGF0ZSwgdGhpcy52YWx1ZSkpIHtcbiAgICAgIHRoaXMuX2Fzc2lnblZhbHVlKGRhdGUpO1xuICAgICAgdGhpcy5fY3ZhT25DaGFuZ2UoZGF0ZSk7XG4gICAgICB0aGlzLl92YWx1ZUNoYW5nZS5lbWl0KGRhdGUpO1xuICAgICAgdGhpcy5kYXRlSW5wdXQuZW1pdChuZXcgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG4gICAgfSBlbHNlIGlmIChsYXN0VmFsdWVXYXNWYWxpZCAhPT0gdGhpcy5fbGFzdFZhbHVlVmFsaWQpIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KG5ldyBNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGJsdXIgZXZlbnRzIG9uIHRoZSBpbnB1dC4gKi9cbiAgX29uQmx1cigpIHtcbiAgICAvLyBSZWZvcm1hdCB0aGUgaW5wdXQgb25seSBpZiB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2Zvcm1hdFZhbHVlKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgLyoqIEZvcm1hdHMgYSB2YWx1ZSBhbmQgc2V0cyBpdCBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPVxuICAgICAgICB2YWx1ZSA/IHRoaXMuX2RhdGVBZGFwdGVyLmZvcm1hdCh2YWx1ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5kYXRlSW5wdXQpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBUaGUgZ2l2ZW4gb2JqZWN0IGlmIGl0IGlzIGJvdGggYSBkYXRlIGluc3RhbmNlIGFuZCB2YWxpZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldFZhbGlkRGF0ZU9yTnVsbChvYmo6IGFueSk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX2RhdGVBZGFwdGVyLmlzRGF0ZUluc3RhbmNlKG9iaikgJiYgdGhpcy5fZGF0ZUFkYXB0ZXIuaXNWYWxpZChvYmopKSA/IG9iaiA6IG51bGw7XG4gIH1cblxuICAvKiogQXNzaWducyBhIHZhbHVlIHRvIHRoZSBtb2RlbC4gKi9cbiAgcHJpdmF0ZSBfYXNzaWduVmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgLy8gV2UgbWF5IGdldCBzb21lIGluY29taW5nIHZhbHVlcyBiZWZvcmUgdGhlIG1vZGVsIHdhc1xuICAgIC8vIGFzc2lnbmVkLiBTYXZlIHRoZSB2YWx1ZSBzbyB0aGF0IHdlIGNhbiBhc3NpZ24gaXQgbGF0ZXIuXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWUpO1xuICAgICAgdGhpcy5fcGVuZGluZ1ZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGVuZGluZ1ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGEgcGFyZW50IGNvbnRyb2wgaXMgZGlzYWJsZWQuIFRoaXMgaXMgaW4gcGxhY2Ugc28gdGhhdCBpdCBjYW4gYmUgb3ZlcnJpZGRlblxuICAgKiBieSBpbnB1dHMgZXh0ZW5kaW5nIHRoaXMgb25lIHdoaWNoIGNhbiBiZSBwbGFjZWQgaW5zaWRlIG9mIGEgZ3JvdXAgdGhhdCBjYW4gYmUgZGlzYWJsZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgX3BhcmVudERpc2FibGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0XG4gIC8vIG1heSBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=