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
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._min)) {
            this._min = validValue;
            this._validatorOnChange();
        }
    }
    /** The maximum valid date. */
    get max() { return this._max; }
    set max(value) {
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._max)) {
            this._max = validValue;
            this._validatorOnChange();
        }
    }
    /** Function that can be used to filter out dates within the datepicker. */
    get dateFilter() { return this._dateFilter; }
    set dateFilter(value) {
        const wasMatchingValue = this._matchesFilter(this.value);
        this._dateFilter = value;
        if (this._matchesFilter(this.value) !== wasMatchingValue) {
            this._validatorOnChange();
        }
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
                    'class': 'mat-datepicker-input',
                    '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
                    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
                    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                    // Used by the test harness to tie this input to its calendar. We can't depend on
                    // `aria-owns` for this, because it's only defined while the calendar is open.
                    '[attr.data-mat-calendar]': '_datepicker ? _datepicker.id : null',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxhQUFhLEVBQ2IsaUJBQWlCLEVBRWpCLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEdBR2pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBRzdFLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBUTtJQUNoRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFRO0lBQzVDLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsNkRBQTZEO0FBeUI3RCxNQUFNLE9BQU8s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QStCO29CQUMxQyxVQUFVLEVBQUUsYUFBYTtvQkFDekIsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLFdBQVcsRUFBRSxvQkFBb0I7aUJBQ2xDO2dCQUNELFFBQVEsRUFBRSxvQkFBb0I7YUFDL0I7OztZQTlEQyxVQUFVO1lBYVYsV0FBVyx1QkEwR04sUUFBUTs0Q0FDUixRQUFRLFlBQUksTUFBTSxTQUFDLGdCQUFnQjtZQXRHbEMsWUFBWSx1QkF1R2IsUUFBUSxZQUFJLE1BQU0sU0FBQyxjQUFjOzs7NEJBdkRyQyxLQUFLO2tCQVVMLEtBQUs7a0JBYUwsS0FBSzt5QkFhTCxLQUFLLFNBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBEYXRlQWRhcHRlcixcbiAgTUFUX0RBVEVfRk9STUFUUyxcbiAgTWF0RGF0ZUZvcm1hdHMsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZCwgTUFUX0ZPUk1fRklFTER9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0JztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcklucHV0QmFzZSwgRGF0ZUZpbHRlckZufSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtYmFzZSc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJDb250cm9sfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdERhdGVwaWNrZXJJbnB1dCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1ZBTElEQVRPUlM6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXBpY2tlcklucHV0KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBEaXJlY3RpdmUgdXNlZCB0byBjb25uZWN0IGFuIGlucHV0IHRvIGEgTWF0RGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdERhdGVwaWNrZXJdJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IsXG4gICAgTUFUX0RBVEVQSUNLRVJfVkFMSURBVE9SUyxcbiAgICB7cHJvdmlkZTogTUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTWF0RGF0ZXBpY2tlcklucHV0fSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZXBpY2tlci1pbnB1dCcsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19kYXRlcGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfZGF0ZXBpY2tlcj8ub3BlbmVkICYmIF9kYXRlcGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdtaW4gPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKG1pbikgOiBudWxsJyxcbiAgICAnW2F0dHIubWF4XSc6ICdtYXggPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKG1heCkgOiBudWxsJyxcbiAgICAvLyBVc2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgdG8gdGllIHRoaXMgaW5wdXQgdG8gaXRzIGNhbGVuZGFyLiBXZSBjYW4ndCBkZXBlbmQgb25cbiAgICAvLyBgYXJpYS1vd25zYCBmb3IgdGhpcywgYmVjYXVzZSBpdCdzIG9ubHkgZGVmaW5lZCB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi5cbiAgICAnW2F0dHIuZGF0YS1tYXQtY2FsZW5kYXJdJzogJ19kYXRlcGlja2VyID8gX2RhdGVwaWNrZXIuaWQgOiBudWxsJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXREYXRlcGlja2VySW5wdXQnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VySW5wdXQ8RD4gZXh0ZW5kcyBNYXREYXRlcGlja2VySW5wdXRCYXNlPEQgfCBudWxsLCBEPlxuICBpbXBsZW1lbnRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQgfCBudWxsPiB7XG4gIC8qKiBUaGUgZGF0ZXBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoKVxuICBzZXQgbWF0RGF0ZXBpY2tlcihkYXRlcGlja2VyOiBNYXREYXRlcGlja2VyPEQ+KSB7XG4gICAgaWYgKGRhdGVwaWNrZXIpIHtcbiAgICAgIHRoaXMuX2RhdGVwaWNrZXIgPSBkYXRlcGlja2VyO1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbChkYXRlcGlja2VyLl9yZWdpc3RlcklucHV0KHRoaXMpKTtcbiAgICB9XG4gIH1cbiAgX2RhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXI8RD47XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluOyB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgY29uc3QgdmFsaWRWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWxpZFZhbHVlLCB0aGlzLl9taW4pKSB7XG4gICAgICB0aGlzLl9taW4gPSB2YWxpZFZhbHVlO1xuICAgICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBjb25zdCB2YWxpZFZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbGlkVmFsdWUsIHRoaXMuX21heCkpIHtcbiAgICAgIHRoaXMuX21heCA9IHZhbGlkVmFsdWU7XG4gICAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9tYXg6IEQgfCBudWxsO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbHRlciBvdXQgZGF0ZXMgd2l0aGluIHRoZSBkYXRlcGlja2VyLiAqL1xuICBASW5wdXQoJ21hdERhdGVwaWNrZXJGaWx0ZXInKVxuICBnZXQgZGF0ZUZpbHRlcigpIHsgcmV0dXJuIHRoaXMuX2RhdGVGaWx0ZXI7IH1cbiAgc2V0IGRhdGVGaWx0ZXIodmFsdWU6IERhdGVGaWx0ZXJGbjxEIHwgbnVsbD4pIHtcbiAgICBjb25zdCB3YXNNYXRjaGluZ1ZhbHVlID0gdGhpcy5fbWF0Y2hlc0ZpbHRlcih0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9kYXRlRmlsdGVyID0gdmFsdWU7XG5cbiAgICBpZiAodGhpcy5fbWF0Y2hlc0ZpbHRlcih0aGlzLnZhbHVlKSAhPT0gd2FzTWF0Y2hpbmdWYWx1ZSkge1xuICAgICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQgfCBudWxsPjtcblxuICAvKiogVGhlIGNvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTWF0RGF0ZUZvcm1hdHMsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcml2YXRlIF9mb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRhdGVBZGFwdGVyLCBkYXRlRm9ybWF0cyk7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKHN1cGVyLl9nZXRWYWxpZGF0b3JzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgY29ubmVjdGVkIHRvLlxuICAgKiBAcmV0dXJuIFRoZSBlbGVtZW50IHRvIGNvbm5lY3QgdGhlIHBvcHVwIHRvLlxuICAgKi9cbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSA6IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgcGFsZXR0ZSB1c2VkIGJ5IHRoZSBpbnB1dCdzIGZvcm0gZmllbGQsIGlmIGFueS4gKi9cbiAgZ2V0VGhlbWVQYWxldHRlKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5jb2xvciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBhdCB3aGljaCB0aGUgY2FsZW5kYXIgc2hvdWxkIHN0YXJ0LiAqL1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgYXNzb2NpYXRlZCBkYXRlcGlja2VyLiAqL1xuICBwcm90ZWN0ZWQgX29wZW5Qb3B1cCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZGF0ZXBpY2tlcikge1xuICAgICAgdGhpcy5fZGF0ZXBpY2tlci5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBEIHwgbnVsbCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfYXNzaWduVmFsdWVUb01vZGVsKHZhbHVlOiBEIHwgbnVsbCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKHZhbHVlLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyBtaW5pbXVtIGRhdGUuICovXG4gIF9nZXRNaW5EYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9taW47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyBtYXhpbXVtIGRhdGUuICovXG4gIF9nZXRNYXhEYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXg7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyBkYXRlIGZpbHRlcmluZyBmdW5jdGlvbi4gKi9cbiAgcHJvdGVjdGVkIF9nZXREYXRlRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRlRmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jYW5FbWl0Q2hhbmdlRXZlbnQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBVbm5lY2Vzc2FyeSB3aGVuIHNlbGVjdGluZyBhIHNpbmdsZSBkYXRlLlxuICBwcm90ZWN0ZWQgX291dHNpZGVWYWx1ZUNoYW5nZWQ6IHVuZGVmaW5lZDtcblxuICAvLyBBY2NlcHQgYGFueWAgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggb3RoZXIgZGlyZWN0aXZlcyBvbiBgPGlucHV0PmAgdGhhdFxuICAvLyBtYXkgYWNjZXB0IGRpZmZlcmVudCB0eXBlcy5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBhbnk7XG59XG4iXX0=