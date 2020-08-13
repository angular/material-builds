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
        this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** The maximum valid date. */
    get max() { return this._max; }
    set max(value) {
        this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxhQUFhLEVBQ2IsaUJBQWlCLEVBRWpCLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEdBR2pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBZSxNQUFNLHlCQUF5QixDQUFDO0FBRzdFLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBUTtJQUNoRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFRO0lBQzVDLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsNkRBQTZEO0FBeUI3RCxNQUFNLE9BQU8s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KlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgRGF0ZUFkYXB0ZXIsXG4gIE1BVF9EQVRFX0ZPUk1BVFMsXG4gIE1hdERhdGVGb3JtYXRzLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGQsIE1BVF9GT1JNX0ZJRUxEfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7TUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEJhc2UsIERhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQ29udHJvbH0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXREYXRlcGlja2VySW5wdXQpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9WQUxJREFUT1JTOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdERhdGVwaWNrZXJJbnB1dCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogRGlyZWN0aXZlIHVzZWQgdG8gY29ubmVjdCBhbiBpbnB1dCB0byBhIE1hdERhdGVwaWNrZXIuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXREYXRlcGlja2VyXScsXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SLFxuICAgIE1BVF9EQVRFUElDS0VSX1ZBTElEQVRPUlMsXG4gICAge3Byb3ZpZGU6IE1BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdERhdGVwaWNrZXJJbnB1dH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItaW5wdXQnLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfZGF0ZXBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX2RhdGVwaWNrZXI/Lm9wZW5lZCAmJiBfZGF0ZXBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnbWluID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtaW4pIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnbWF4ID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtYXgpIDogbnVsbCcsXG4gICAgLy8gVXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIHRvIHRpZSB0aGlzIGlucHV0IHRvIGl0cyBjYWxlbmRhci4gV2UgY2FuJ3QgZGVwZW5kIG9uXG4gICAgLy8gYGFyaWEtb3duc2AgZm9yIHRoaXMsIGJlY2F1c2UgaXQncyBvbmx5IGRlZmluZWQgd2hpbGUgdGhlIGNhbGVuZGFyIGlzIG9wZW4uXG4gICAgJ1thdHRyLmRhdGEtbWF0LWNhbGVuZGFyXSc6ICdfZGF0ZXBpY2tlciA/IF9kYXRlcGlja2VyLmlkIDogbnVsbCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlcklucHV0Jyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0PEQ+IGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxEIHwgbnVsbCwgRD5cbiAgaW1wbGVtZW50cyBNYXREYXRlcGlja2VyQ29udHJvbDxEIHwgbnVsbD4ge1xuICAvKiogVGhlIGRhdGVwaWNrZXIgdGhhdCB0aGlzIGlucHV0IGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KClcbiAgc2V0IG1hdERhdGVwaWNrZXIoZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlcjxEPikge1xuICAgIGlmIChkYXRlcGlja2VyKSB7XG4gICAgICB0aGlzLl9kYXRlcGlja2VyID0gZGF0ZXBpY2tlcjtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwoZGF0ZXBpY2tlci5fcmVnaXN0ZXJJbnB1dCh0aGlzKSk7XG4gICAgfVxuICB9XG4gIF9kYXRlcGlja2VyOiBNYXREYXRlcGlja2VyPEQ+O1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21pbiA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXggPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBkYXRlcyB3aXRoaW4gdGhlIGRhdGVwaWNrZXIuICovXG4gIEBJbnB1dCgnbWF0RGF0ZXBpY2tlckZpbHRlcicpXG4gIGdldCBkYXRlRmlsdGVyKCkgeyByZXR1cm4gdGhpcy5fZGF0ZUZpbHRlcjsgfVxuICBzZXQgZGF0ZUZpbHRlcih2YWx1ZTogRGF0ZUZpbHRlckZuPEQgfCBudWxsPikge1xuICAgIHRoaXMuX2RhdGVGaWx0ZXIgPSB2YWx1ZTtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG4gIHByaXZhdGUgX2RhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEIHwgbnVsbD47XG5cbiAgLyoqIFRoZSBjb21iaW5lZCBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGlzIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICAgIHRoaXMuX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShzdXBlci5fZ2V0VmFsaWRhdG9ycygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNvbm5lY3RlZCB0by5cbiAgICogQHJldHVybiBUaGUgZWxlbWVudCB0byBjb25uZWN0IHRoZSBwb3B1cCB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbGV0dGUgdXNlZCBieSB0aGUgaW5wdXQncyBmb3JtIGZpZWxkLCBpZiBhbnkuICovXG4gIGdldFRoZW1lUGFsZXR0ZSgpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuY29sb3IgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgYXQgd2hpY2ggdGhlIGNhbGVuZGFyIHNob3VsZCBzdGFydC4gKi9cbiAgZ2V0U3RhcnRWYWx1ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBVc2UgYGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW5gIGluc3RlYWRcbiAgICovXG4gIGdldFBvcHVwQ29ubmVjdGlvbkVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBhc3NvY2lhdGVkIGRhdGVwaWNrZXIuICovXG4gIHByb3RlY3RlZCBfb3BlblBvcHVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9kYXRlcGlja2VyKSB7XG4gICAgICB0aGlzLl9kYXRlcGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IEQgfCBudWxsKTogRCB8IG51bGwge1xuICAgIHJldHVybiBtb2RlbFZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24odmFsdWUsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIG1pbmltdW0gZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIG1heGltdW0gZGF0ZS4gKi9cbiAgX2dldE1heERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIGRhdGUgZmlsdGVyaW5nIGZ1bmN0aW9uLiAqL1xuICBwcm90ZWN0ZWQgX2dldERhdGVGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NhbkVtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVubmVjZXNzYXJ5IHdoZW4gc2VsZWN0aW5nIGEgc2luZ2xlIGRhdGUuXG4gIHByb3RlY3RlZCBfb3V0c2lkZVZhbHVlQ2hhbmdlZDogdW5kZWZpbmVkO1xuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0XG4gIC8vIG1heSBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbn1cbiJdfQ==