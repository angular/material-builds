/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, forwardRef, Inject, Input, Optional, } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';
import { MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatDatepicker } from './datepicker';
import { MatDatepickerInputBase } from './datepicker-input-base';
/** @docs-private */
export const MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatDatepickerInput),
    multi: true
};
/** @docs-private */
export const MAT_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatDatepickerInput),
    multi: true
};
/** Directive used to connect an input to a MatDatepicker. */
export class MatDatepickerInput extends MatDatepickerInputBase {
    constructor(elementRef, dateAdapter, dateFormats, _formField) {
        super(elementRef, dateAdapter, dateFormats);
        this._formField = _formField;
        this._validator = Validators.compose(super._getValidators());
    }
    /** The datepicker that this input is associated with. */
    set matDatepicker(datepicker) {
        if (datepicker) {
            this._datepicker = datepicker;
            this._registerModel(datepicker._registerInput(this));
        }
    }
    /** The minimum valid date. */
    get min() { return this._min; }
    set min(value) {
        this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** The maximum valid date. */
    get max() { return this._max; }
    set max(value) {
        this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** Function that can be used to filter out dates within the datepicker. */
    get dateFilter() { return this._dateFilter; }
    set dateFilter(value) {
        this._dateFilter = value;
        this._validatorOnChange();
    }
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
    /** Gets the value at which the calendar should start. */
    getStartValue() {
        return this.value;
    }
    /**
     * @deprecated
     * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
     */
    getPopupConnectionElementRef() {
        return this.getConnectedOverlayOrigin();
    }
    /** Opens the associated datepicker. */
    _openPopup() {
        if (this._datepicker) {
            this._datepicker.open();
        }
    }
    _getValueFromModel(modelValue) {
        return modelValue;
    }
    _assignValueToModel(value) {
        if (this._model) {
            this._model.updateSelection(value, this);
        }
    }
    /** Gets the input's minimum date. */
    _getMinDate() {
        return this._min;
    }
    /** Gets the input's maximum date. */
    _getMaxDate() {
        return this._max;
    }
    /** Gets the input's date filtering function. */
    _getDateFilter() {
        return this._dateFilter;
    }
    _canEmitChangeEvent() {
        return true;
    }
}
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
MatDatepickerInput.ctorParameters = () => [
    { type: ElementRef },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] }] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }] }
];
MatDatepickerInput.propDecorators = {
    matDatepicker: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    dateFilter: [{ type: Input, args: ['matDatepickerFilter',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxhQUFhLEVBQ2IsaUJBQWlCLEVBRWpCLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEdBR2pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBRzdFLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBUTtJQUNoRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFRO0lBQzVDLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsNkRBQTZEO0FBcUI3RCxNQUFNLE9BQU8s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QyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxnREFBZ0Q7SUFDdEMsY0FBYztRQUN0QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVTLG1CQUFtQjtRQUMzQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7OztZQW5JRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsU0FBUyxFQUFFO29CQUNULDZCQUE2QjtvQkFDN0IseUJBQXlCO29CQUN6QixFQUFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUM7aUJBQ3JFO2dCQUNELElBQUksRUFBRTtvQkFDSixzQkFBc0IsRUFBRSwrQkFBK0I7b0JBQ3ZELGtCQUFrQixFQUFFLGlEQUFpRDtvQkFDckUsWUFBWSxFQUFFLDBDQUEwQztvQkFDeEQsWUFBWSxFQUFFLDBDQUEwQztvQkFDeEQsWUFBWSxFQUFFLFVBQVU7b0JBQ3hCLFNBQVMsRUFBRSwrQkFBK0I7b0JBQzFDLFVBQVUsRUFBRSxhQUFhO29CQUN6QixRQUFRLEVBQUUsV0FBVztvQkFDckIsV0FBVyxFQUFFLG9CQUFvQjtpQkFDbEM7Z0JBQ0QsUUFBUSxFQUFFLG9CQUFvQjthQUMvQjs7O1lBMURDLFVBQVU7WUFhVixXQUFXLHVCQTBGTixRQUFROzRDQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsZ0JBQWdCO1lBdEZsQyxZQUFZLHVCQXVGYixRQUFRLFlBQUksTUFBTSxTQUFDLGNBQWM7Ozs0QkEzQ3JDLEtBQUs7a0JBVUwsS0FBSztrQkFTTCxLQUFLO3lCQVNMLEtBQUssU0FBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdG9yRm4sXG4gIFZhbGlkYXRvcnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIERhdGVBZGFwdGVyLFxuICBNQVRfREFURV9GT1JNQVRTLFxuICBNYXREYXRlRm9ybWF0cyxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyfSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRCYXNlLCBEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXBpY2tlcklucHV0KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVQSUNLRVJfVkFMSURBVE9SUzogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXREYXRlcGlja2VySW5wdXQpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIERpcmVjdGl2ZSB1c2VkIHRvIGNvbm5lY3QgYW4gaW5wdXQgdG8gYSBNYXREYXRlcGlja2VyLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0RGF0ZXBpY2tlcl0nLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUixcbiAgICBNQVRfREFURVBJQ0tFUl9WQUxJREFUT1JTLFxuICAgIHtwcm92aWRlOiBNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNYXREYXRlcGlja2VySW5wdXR9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19kYXRlcGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfZGF0ZXBpY2tlcj8ub3BlbmVkICYmIF9kYXRlcGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdtaW4gPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKG1pbikgOiBudWxsJyxcbiAgICAnW2F0dHIubWF4XSc6ICdtYXggPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKG1heCkgOiBudWxsJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXREYXRlcGlja2VySW5wdXQnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VySW5wdXQ8RD4gZXh0ZW5kcyBNYXREYXRlcGlja2VySW5wdXRCYXNlPEQgfCBudWxsLCBEPlxuICBpbXBsZW1lbnRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQgfCBudWxsPiB7XG4gIC8qKiBUaGUgZGF0ZXBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoKVxuICBzZXQgbWF0RGF0ZXBpY2tlcihkYXRlcGlja2VyOiBNYXREYXRlcGlja2VyPEQ+KSB7XG4gICAgaWYgKGRhdGVwaWNrZXIpIHtcbiAgICAgIHRoaXMuX2RhdGVwaWNrZXIgPSBkYXRlcGlja2VyO1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbChkYXRlcGlja2VyLl9yZWdpc3RlcklucHV0KHRoaXMpKTtcbiAgICB9XG4gIH1cbiAgX2RhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXI8RD47XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluOyB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxuICBwcml2YXRlIF9taW46IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBEIHwgbnVsbDtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGRhdGVzIHdpdGhpbiB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgQElucHV0KCdtYXREYXRlcGlja2VyRmlsdGVyJylcbiAgZ2V0IGRhdGVGaWx0ZXIoKSB7IHJldHVybiB0aGlzLl9kYXRlRmlsdGVyOyB9XG4gIHNldCBkYXRlRmlsdGVyKHZhbHVlOiBEYXRlRmlsdGVyRm48RCB8IG51bGw+KSB7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IHZhbHVlO1xuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQgfCBudWxsPjtcblxuICAvKiogVGhlIGNvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcml2YXRlIF9mb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKHN1cGVyLl9nZXRWYWxpZGF0b3JzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgY29ubmVjdGVkIHRvLlxuICAgKiBAcmV0dXJuIFRoZSBlbGVtZW50IHRvIGNvbm5lY3QgdGhlIHBvcHVwIHRvLlxuICAgKi9cbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSA6IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgcGFsZXR0ZSB1c2VkIGJ5IHRoZSBpbnB1dCdzIGZvcm0gZmllbGQsIGlmIGFueS4gKi9cbiAgZ2V0VGhlbWVQYWxldHRlKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5jb2xvciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBhdCB3aGljaCB0aGUgY2FsZW5kYXIgc2hvdWxkIHN0YXJ0LiAqL1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIFVzZSBgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbmAgaW5zdGVhZFxuICAgKi9cbiAgZ2V0UG9wdXBDb25uZWN0aW9uRWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGFzc29jaWF0ZWQgZGF0ZXBpY2tlci4gKi9cbiAgcHJvdGVjdGVkIF9vcGVuUG9wdXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2RhdGVwaWNrZXIpIHtcbiAgICAgIHRoaXMuX2RhdGVwaWNrZXIub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0VmFsdWVGcm9tTW9kZWwobW9kZWxWYWx1ZTogRCB8IG51bGwpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIG1vZGVsVmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbih2YWx1ZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlucHV0J3MgbWluaW11bSBkYXRlLiAqL1xuICBfZ2V0TWluRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlucHV0J3MgbWF4aW11bSBkYXRlLiAqL1xuICBfZ2V0TWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlucHV0J3MgZGF0ZSBmaWx0ZXJpbmcgZnVuY3Rpb24uICovXG4gIHByb3RlY3RlZCBfZ2V0RGF0ZUZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY2FuRW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gVW5uZWNlc3Nhcnkgd2hlbiBzZWxlY3RpbmcgYSBzaW5nbGUgZGF0ZS5cbiAgcHJvdGVjdGVkIF9vdXRzaWRlVmFsdWVDaGFuZ2VkOiB1bmRlZmluZWQ7XG5cbiAgLy8gQWNjZXB0IGBhbnlgIHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG90aGVyIGRpcmVjdGl2ZXMgb24gYDxpbnB1dD5gIHRoYXRcbiAgLy8gbWF5IGFjY2VwdCBkaWZmZXJlbnQgdHlwZXMuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92YWx1ZTogYW55O1xufVxuIl19