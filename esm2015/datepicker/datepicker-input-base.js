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
    /** @nocollapse */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pbnB1dC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBUXZCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEdBRWpCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUcvRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHVCQUF1QjtJQUlsQztJQUNJLDBFQUEwRTtJQUNuRSxNQUFvQztJQUMzQyxrRkFBa0Y7SUFDM0UsYUFBMEI7UUFGMUIsV0FBTSxHQUFOLE1BQU0sQ0FBOEI7UUFFcEMsa0JBQWEsR0FBYixhQUFhLENBQWE7UUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFLRCx3Q0FBd0M7QUFDeEM7SUFBQSxNQUNzQixzQkFBc0I7UUEwSzFDLFlBQ2MsV0FBeUMsRUFDaEMsWUFBNEIsRUFDRCxZQUE0QjtZQUZoRSxnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7WUFDaEMsaUJBQVksR0FBWixZQUFZLENBQWdCO1lBQ0QsaUJBQVksR0FBWixZQUFZLENBQWdCO1lBM0g5RSw4REFB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WUFBSSxNQUFNLFNBQUMsZ0JBQWdCOzs7d0JBdEt2QyxLQUFLOzJCQW1CTCxLQUFLOzZCQXlCTCxNQUFNOzRCQUlOLE1BQU07O0lBMFBULDZCQUFDO0tBQUE7U0FqVHFCLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET1dOX0FSUk9XfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3IsXG4gIFZhbGlkYXRvckZuLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBEYXRlQWRhcHRlcixcbiAgTUFUX0RBVEVfRk9STUFUUyxcbiAgTWF0RGF0ZUZvcm1hdHMsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge0V4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb24sIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbi8qKlxuICogQW4gZXZlbnQgdXNlZCBmb3IgZGF0ZXBpY2tlciBpbnB1dCBhbmQgY2hhbmdlIGV2ZW50cy4gV2UgZG9uJ3QgYWx3YXlzIGhhdmUgYWNjZXNzIHRvIGEgbmF0aXZlXG4gKiBpbnB1dCBvciBjaGFuZ2UgZXZlbnQgYmVjYXVzZSB0aGUgZXZlbnQgbWF5IGhhdmUgYmVlbiB0cmlnZ2VyZWQgYnkgdGhlIHVzZXIgY2xpY2tpbmcgb24gdGhlXG4gKiBjYWxlbmRhciBwb3B1cC4gRm9yIGNvbnNpc3RlbmN5LCB3ZSBhbHdheXMgdXNlIE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50IGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VySW5wdXRFdmVudDxELCBTID0gdW5rbm93bj4ge1xuICAvKiogVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHRhcmdldCBkYXRlcGlja2VyIGlucHV0LiAqL1xuICB2YWx1ZTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBkYXRlcGlja2VyIGlucHV0IGNvbXBvbmVudCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgICAgcHVibGljIHRhcmdldDogTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxTLCBEPixcbiAgICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0ZXBpY2tlciBpbnB1dC4gKi9cbiAgICAgIHB1YmxpYyB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnRhcmdldC52YWx1ZTtcbiAgfVxufVxuXG4vKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGRhdGVzIGZyb20gYSBjYWxlbmRhci4gKi9cbmV4cG9ydCB0eXBlIERhdGVGaWx0ZXJGbjxEPiA9IChkYXRlOiBEIHwgbnVsbCkgPT4gYm9vbGVhbjtcblxuLyoqIEJhc2UgY2xhc3MgZm9yIGRhdGVwaWNrZXIgaW5wdXRzLiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxTLCBEID0gRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPj5cbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBWYWxpZGF0b3Ige1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fZ2V0VmFsdWVGcm9tTW9kZWwodGhpcy5fbW9kZWwuc2VsZWN0aW9uKSA6IHRoaXMuX3BlbmRpbmdWYWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgdGhpcy5fbGFzdFZhbHVlVmFsaWQgPSAhdmFsdWUgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIuaXNWYWxpZCh2YWx1ZSk7XG4gICAgdmFsdWUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodmFsdWUpO1xuICAgIGNvbnN0IG9sZERhdGUgPSB0aGlzLnZhbHVlO1xuICAgIHRoaXMuX2Fzc2lnblZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLl9mb3JtYXRWYWx1ZSh2YWx1ZSk7XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKG9sZERhdGUsIHZhbHVlKSkge1xuICAgICAgdGhpcy5fdmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPiB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlci1pbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLl9kaXNhYmxlZCB8fCB0aGlzLl9wYXJlbnREaXNhYmxlZCgpOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLmVtaXQobmV3VmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gbnVsbCBjaGVjayB0aGUgYGJsdXJgIG1ldGhvZCwgYmVjYXVzZSBpdCdzIHVuZGVmaW5lZCBkdXJpbmcgU1NSLlxuICAgIC8vIEluIEl2eSBzdGF0aWMgYmluZGluZ3MgYXJlIGludm9rZWQgZWFybGllciwgYmVmb3JlIHRoZSBlbGVtZW50IGlzIGF0dGFjaGVkIHRvIHRoZSBET00uXG4gICAgLy8gVGhpcyBjYW4gY2F1c2UgYW4gZXJyb3IgdG8gYmUgdGhyb3duIGluIHNvbWUgYnJvd3NlcnMgKElFL0VkZ2UpIHdoaWNoIGFzc2VydCB0aGF0IHRoZVxuICAgIC8vIGVsZW1lbnQgaGFzIGJlZW4gaW5zZXJ0ZWQuXG4gICAgaWYgKG5ld1ZhbHVlICYmIHRoaXMuX2lzSW5pdGlhbGl6ZWQgJiYgZWxlbWVudC5ibHVyKSB7XG4gICAgICAvLyBOb3JtYWxseSwgbmF0aXZlIGlucHV0IGVsZW1lbnRzIGF1dG9tYXRpY2FsbHkgYmx1ciBpZiB0aGV5IHR1cm4gZGlzYWJsZWQuIFRoaXMgYmVoYXZpb3JcbiAgICAgIC8vIGlzIHByb2JsZW1hdGljLCBiZWNhdXNlIGl0IHdvdWxkIG1lYW4gdGhhdCBpdCB0cmlnZ2VycyBhbm90aGVyIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsXG4gICAgICAvLyB3aGljaCB0aGVuIGNhdXNlcyBhIGNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvciBpZiB0aGUgaW5wdXQgZWxlbWVudCB3YXMgZm9jdXNlZCBiZWZvcmUuXG4gICAgICBlbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBgY2hhbmdlYCBldmVudCBpcyBmaXJlZCBvbiB0aGlzIGA8aW5wdXQ+YC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXREYXRlcGlja2VySW5wdXRFdmVudDxELCBTPj4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXREYXRlcGlja2VySW5wdXRFdmVudDxELCBTPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbiBgaW5wdXRgIGV2ZW50IGlzIGZpcmVkIG9uIHRoaXMgYDxpbnB1dD5gLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGF0ZUlucHV0OiBFdmVudEVtaXR0ZXI8TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RCwgUz4+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RCwgUz4+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgKGVpdGhlciBkdWUgdG8gdXNlciBpbnB1dCBvciBwcm9ncmFtbWF0aWMgY2hhbmdlKS4gKi9cbiAgX3ZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEIHwgbnVsbD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgaGFzIGNoYW5nZWQgKi9cbiAgX2Rpc2FibGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcbiAgX3ZhbGlkYXRvck9uQ2hhbmdlID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfY3ZhT25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG4gIHByaXZhdGUgX3ZhbHVlQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfbG9jYWxlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBTaW5jZSB0aGUgdmFsdWUgaXMga2VwdCBvbiB0aGUgbW9kZWwgd2hpY2ggaXMgYXNzaWduZWQgaW4gYW4gSW5wdXQsXG4gICAqIHdlIG1pZ2h0IGdldCBhIHZhbHVlIGJlZm9yZSB3ZSBoYXZlIGEgbW9kZWwuIFRoaXMgcHJvcGVydHkga2VlcHMgdHJhY2tcbiAgICogb2YgdGhlIHZhbHVlIHVudGlsIHdlIGhhdmUgc29tZXdoZXJlIHRvIGFzc2lnbiBpdC5cbiAgICovXG4gIHByaXZhdGUgX3BlbmRpbmdWYWx1ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB3aGV0aGVyIHRoZSBpbnB1dCBwYXJzZXMuICovXG4gIHByaXZhdGUgX3BhcnNlVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9ICgpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RWYWx1ZVZhbGlkID9cbiAgICAgICAgbnVsbCA6IHsnbWF0RGF0ZXBpY2tlclBhcnNlJzogeyd0ZXh0JzogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlfX07XG4gIH1cblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBkYXRlIGZpbHRlci4gKi9cbiAgcHJpdmF0ZSBfZmlsdGVyVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpKTtcbiAgICBjb25zdCBkYXRlRmlsdGVyID0gdGhpcy5fZ2V0RGF0ZUZpbHRlcigpO1xuICAgIHJldHVybiAhZGF0ZUZpbHRlciB8fCAhY29udHJvbFZhbHVlIHx8IGRhdGVGaWx0ZXIoY29udHJvbFZhbHVlKSA/XG4gICAgICAgIG51bGwgOiB7J21hdERhdGVwaWNrZXJGaWx0ZXInOiB0cnVlfTtcbiAgfVxuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIG1pbiBkYXRlLiAqL1xuICBwcml2YXRlIF9taW5WYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuX2dldE1pbkRhdGUoKTtcbiAgICByZXR1cm4gKCFtaW4gfHwgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShtaW4sIGNvbnRyb2xWYWx1ZSkgPD0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXREYXRlcGlja2VyTWluJzogeydtaW4nOiBtaW4sICdhY3R1YWwnOiBjb250cm9sVmFsdWV9fTtcbiAgfVxuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIG1heCBkYXRlLiAqL1xuICBwcml2YXRlIF9tYXhWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IG1heCA9IHRoaXMuX2dldE1heERhdGUoKTtcbiAgICByZXR1cm4gKCFtYXggfHwgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShtYXgsIGNvbnRyb2xWYWx1ZSkgPj0gMCkgP1xuICAgICAgICBudWxsIDogeydtYXREYXRlcGlja2VyTWF4JzogeydtYXgnOiBtYXgsICdhY3R1YWwnOiBjb250cm9sVmFsdWV9fTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBiYXNlIHZhbGlkYXRvciBmdW5jdGlvbnMuICovXG4gIHByb3RlY3RlZCBfZ2V0VmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICByZXR1cm4gW3RoaXMuX3BhcnNlVmFsaWRhdG9yLCB0aGlzLl9taW5WYWxpZGF0b3IsIHRoaXMuX21heFZhbGlkYXRvciwgdGhpcy5fZmlsdGVyVmFsaWRhdG9yXTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIGRhdGUgZm9yIHRoZSBpbnB1dC4gVXNlZCBmb3IgdmFsaWRhdGlvbi4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRNaW5EYXRlKCk6IEQgfCBudWxsO1xuXG4gIC8qKiBHZXRzIHRoZSBtYXhpbXVtIGRhdGUgZm9yIHRoZSBpbnB1dC4gVXNlZCBmb3IgdmFsaWRhdGlvbi4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRNYXhEYXRlKCk6IEQgfCBudWxsO1xuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGZpbHRlciBmdW5jdGlvbi4gVXNlZCBmb3IgdmFsaWRhdGlvbi4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXREYXRlRmlsdGVyKCk6IERhdGVGaWx0ZXJGbjxEPiB8IHVuZGVmaW5lZDtcblxuICAvKiogUmVnaXN0ZXJzIGEgZGF0ZSBzZWxlY3Rpb24gbW9kZWwgd2l0aCB0aGUgaW5wdXQuICovXG4gIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4pOiB2b2lkIHtcbiAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xuICAgIHRoaXMuX3ZhbHVlQ2hhbmdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKHRoaXMuX3BlbmRpbmdWYWx1ZSkge1xuICAgICAgdGhpcy5fYXNzaWduVmFsdWUodGhpcy5fcGVuZGluZ1ZhbHVlKTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZUNoYW5nZXNTdWJzY3JpcHRpb24gPSB0aGlzLl9tb2RlbC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQuc291cmNlICE9PSB0aGlzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0VmFsdWVGcm9tTW9kZWwoZXZlbnQuc2VsZWN0aW9uKTtcbiAgICAgICAgdGhpcy5fY3ZhT25DaGFuZ2UodmFsdWUpO1xuICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgICAgdGhpcy5fZm9ybWF0VmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLmRhdGVJbnB1dC5lbWl0KG5ldyBNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQobmV3IE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuXG4gICAgICAgIGlmICh0aGlzLl9vdXRzaWRlVmFsdWVDaGFuZ2VkKSB7XG4gICAgICAgICAgdGhpcy5fb3V0c2lkZVZhbHVlQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHBvcHVwIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfb3BlblBvcHVwKCk6IHZvaWQ7XG5cbiAgLyoqIEFzc2lnbnMgYSB2YWx1ZSB0byB0aGUgaW5wdXQncyBtb2RlbC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9hc3NpZ25WYWx1ZVRvTW9kZWwobW9kZWw6IEQgfCBudWxsKTogdm9pZDtcblxuICAvKiogQ29udmVydHMgYSB2YWx1ZSBmcm9tIHRoZSBtb2RlbCBpbnRvIGEgbmF0aXZlIHZhbHVlIGZvciB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogUyk6IEQgfCBudWxsO1xuXG4gIC8qKiBDb21iaW5lZCBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGlzIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0J2xsIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0aW9uIG1vZGVsIGlzIGNoYW5nZWRcbiAgICogZnJvbSBzb21ld2hlcmUgdGhhdCdzIG5vdCB0aGUgY3VycmVudCBkYXRlcGlja2VyIGlucHV0LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vdXRzaWRlVmFsdWVDaGFuZ2VkPzogKCkgPT4gdm9pZDtcblxuICAvKiogV2hldGhlciB0aGUgbGFzdCB2YWx1ZSBzZXQgb24gdGhlIGlucHV0IHdhcyB2YWxpZC4gKi9cbiAgcHJvdGVjdGVkIF9sYXN0VmFsdWVWYWxpZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgICAgQE9wdGlvbmFsKCkgcHVibGljIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0ZPUk1BVFMpIHByaXZhdGUgX2RhdGVGb3JtYXRzOiBNYXREYXRlRm9ybWF0cykge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTUFUX0RBVEVfRk9STUFUUycpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgZGlzcGxheWVkIGRhdGUgd2hlbiB0aGUgbG9jYWxlIGNoYW5nZXMuXG4gICAgdGhpcy5fbG9jYWxlU3Vic2NyaXB0aW9uID0gX2RhdGVBZGFwdGVyLmxvY2FsZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdmFsdWVDaGFuZ2VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fbG9jYWxlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fdmFsdWVDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kaXNhYmxlZENoYW5nZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvciA/IHRoaXMuX3ZhbGlkYXRvcihjKSA6IG51bGw7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICB3cml0ZVZhbHVlKHZhbHVlOiBEKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9jdmFPbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGlzQWx0RG93bkFycm93ID0gZXZlbnQuYWx0S2V5ICYmIGV2ZW50LmtleUNvZGUgPT09IERPV05fQVJST1c7XG5cbiAgICBpZiAoaXNBbHREb3duQXJyb3cgJiYgIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZWFkT25seSkge1xuICAgICAgdGhpcy5fb3BlblBvcHVwKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsYXN0VmFsdWVXYXNWYWxpZCA9IHRoaXMuX2xhc3RWYWx1ZVZhbGlkO1xuICAgIGxldCBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIucGFyc2UodmFsdWUsIHRoaXMuX2RhdGVGb3JtYXRzLnBhcnNlLmRhdGVJbnB1dCk7XG4gICAgdGhpcy5fbGFzdFZhbHVlVmFsaWQgPSAhZGF0ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKGRhdGUpO1xuICAgIGRhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwoZGF0ZSk7XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKGRhdGUsIHRoaXMudmFsdWUpKSB7XG4gICAgICB0aGlzLl9hc3NpZ25WYWx1ZShkYXRlKTtcbiAgICAgIHRoaXMuX2N2YU9uQ2hhbmdlKGRhdGUpO1xuICAgICAgdGhpcy5fdmFsdWVDaGFuZ2UuZW1pdChkYXRlKTtcbiAgICAgIHRoaXMuZGF0ZUlucHV0LmVtaXQobmV3IE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuICAgIH0gZWxzZSBpZiAobGFzdFZhbHVlV2FzVmFsaWQgIT09IHRoaXMuX2xhc3RWYWx1ZVZhbGlkKSB7XG4gICAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdChuZXcgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBibHVyIGV2ZW50cyBvbiB0aGUgaW5wdXQuICovXG4gIF9vbkJsdXIoKSB7XG4gICAgLy8gUmVmb3JtYXQgdGhlIGlucHV0IG9ubHkgaWYgd2UgaGF2ZSBhIHZhbGlkIHZhbHVlLlxuICAgIGlmICh0aGlzLnZhbHVlKSB7XG4gICAgICB0aGlzLl9mb3JtYXRWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgfVxuXG4gIC8qKiBGb3JtYXRzIGEgdmFsdWUgYW5kIHNldHMgaXQgb24gdGhlIGlucHV0IGVsZW1lbnQuICovXG4gIHByb3RlY3RlZCBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID1cbiAgICAgICAgdmFsdWUgPyB0aGlzLl9kYXRlQWRhcHRlci5mb3JtYXQodmFsdWUsIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkuZGF0ZUlucHV0KSA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9nZXRWYWxpZERhdGVPck51bGwob2JqOiBhbnkpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9kYXRlQWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQob2JqKSkgPyBvYmogOiBudWxsO1xuICB9XG5cbiAgLyoqIEFzc2lnbnMgYSB2YWx1ZSB0byB0aGUgbW9kZWwuICovXG4gIHByaXZhdGUgX2Fzc2lnblZhbHVlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIC8vIFdlIG1heSBnZXQgc29tZSBpbmNvbWluZyB2YWx1ZXMgYmVmb3JlIHRoZSBtb2RlbCB3YXNcbiAgICAvLyBhc3NpZ25lZC4gU2F2ZSB0aGUgdmFsdWUgc28gdGhhdCB3ZSBjYW4gYXNzaWduIGl0IGxhdGVyLlxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlKTtcbiAgICAgIHRoaXMuX3BlbmRpbmdWYWx1ZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBhIHBhcmVudCBjb250cm9sIGlzIGRpc2FibGVkLiBUaGlzIGlzIGluIHBsYWNlIHNvIHRoYXQgaXQgY2FuIGJlIG92ZXJyaWRkZW5cbiAgICogYnkgaW5wdXRzIGV4dGVuZGluZyB0aGlzIG9uZSB3aGljaCBjYW4gYmUgcGxhY2VkIGluc2lkZSBvZiBhIGdyb3VwIHRoYXQgY2FuIGJlIGRpc2FibGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9wYXJlbnREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBBY2NlcHQgYGFueWAgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggb3RoZXIgZGlyZWN0aXZlcyBvbiBgPGlucHV0PmAgdGhhdFxuICAvLyBtYXkgYWNjZXB0IGRpZmZlcmVudCB0eXBlcy5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBhbnk7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19