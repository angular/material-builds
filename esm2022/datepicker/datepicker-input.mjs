/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, forwardRef, Inject, Input, Optional } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatDatepickerInputBase } from './datepicker-input-base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/core";
/** @docs-private */
export const MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatDatepickerInput),
    multi: true,
};
/** @docs-private */
export const MAT_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatDatepickerInput),
    multi: true,
};
/** Directive used to connect an input to a MatDatepicker. */
class MatDatepickerInput extends MatDatepickerInputBase {
    /** The datepicker that this input is associated with. */
    set matDatepicker(datepicker) {
        if (datepicker) {
            this._datepicker = datepicker;
            this._closedSubscription = datepicker.closedStream.subscribe(() => this._onTouched());
            this._registerModel(datepicker.registerInput(this));
        }
    }
    /** The minimum valid date. */
    get min() {
        return this._min;
    }
    set min(value) {
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._min)) {
            this._min = validValue;
            this._validatorOnChange();
        }
    }
    /** The maximum valid date. */
    get max() {
        return this._max;
    }
    set max(value) {
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._max)) {
            this._max = validValue;
            this._validatorOnChange();
        }
    }
    /** Function that can be used to filter out dates within the datepicker. */
    get dateFilter() {
        return this._dateFilter;
    }
    set dateFilter(value) {
        const wasMatchingValue = this._matchesFilter(this.value);
        this._dateFilter = value;
        if (this._matchesFilter(this.value) !== wasMatchingValue) {
            this._validatorOnChange();
        }
    }
    constructor(elementRef, dateAdapter, dateFormats, _formField) {
        super(elementRef, dateAdapter, dateFormats);
        this._formField = _formField;
        this._closedSubscription = Subscription.EMPTY;
        this._validator = Validators.compose(super._getValidators());
    }
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId() {
        if (this._formField) {
            return this._formField.getLabelId();
        }
        return this._elementRef.nativeElement.getAttribute('aria-labelledby');
    }
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
    /** Gets the value at which the calendar should start. */
    getStartValue() {
        return this.value;
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._closedSubscription.unsubscribe();
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
    _shouldHandleChangeEvent(event) {
        return event.source !== this;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatDatepickerInput, deps: [{ token: i0.ElementRef }, { token: i1.DateAdapter, optional: true }, { token: MAT_DATE_FORMATS, optional: true }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.7", type: MatDatepickerInput, selector: "input[matDatepicker]", inputs: { matDatepicker: "matDatepicker", min: "min", max: "max", dateFilter: ["matDatepickerFilter", "dateFilter"] }, host: { listeners: { "input": "_onInput($event.target.value)", "change": "_onChange()", "blur": "_onBlur()", "keydown": "_onKeydown($event)" }, properties: { "attr.aria-haspopup": "_datepicker ? \"dialog\" : null", "attr.aria-owns": "(_datepicker?.opened && _datepicker.id) || null", "attr.min": "min ? _dateAdapter.toIso8601(min) : null", "attr.max": "max ? _dateAdapter.toIso8601(max) : null", "attr.data-mat-calendar": "_datepicker ? _datepicker.id : null", "disabled": "disabled" }, classAttribute: "mat-datepicker-input" }, providers: [
            MAT_DATEPICKER_VALUE_ACCESSOR,
            MAT_DATEPICKER_VALIDATORS,
            { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatepickerInput },
        ], exportAs: ["matDatepickerInput"], usesInheritance: true, ngImport: i0 }); }
}
export { MatDatepickerInput };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatDatepickerInput, decorators: [{
            type: Directive,
            args: [{
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
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_FORMATS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }]; }, propDecorators: { matDatepicker: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], dateFilter: [{
                type: Input,
                args: ['matDatepickerFilter']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQWEsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxhQUFhLEVBQUUsaUJBQWlCLEVBQWUsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekYsT0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBK0IsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDakUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUMsc0JBQXNCLEVBQXFDLE1BQU0seUJBQXlCLENBQUM7OztBQUluRyxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQVE7SUFDaEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBUTtJQUM1QyxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGLDZEQUE2RDtBQUM3RCxNQXdCYSxrQkFDWCxTQUFRLHNC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Szt1QkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUiwgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0ZPUk1BVFMsIE1hdERhdGVGb3JtYXRzLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRCYXNlLCBEYXRlRmlsdGVyRm4sIF9NYXRGb3JtRmllbGRQYXJ0aWFsfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtYmFzZSc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJDb250cm9sLCBNYXREYXRlcGlja2VyUGFuZWx9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXBpY2tlcklucHV0KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1ZBTElEQVRPUlM6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXBpY2tlcklucHV0KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKiogRGlyZWN0aXZlIHVzZWQgdG8gY29ubmVjdCBhbiBpbnB1dCB0byBhIE1hdERhdGVwaWNrZXIuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXREYXRlcGlja2VyXScsXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SLFxuICAgIE1BVF9EQVRFUElDS0VSX1ZBTElEQVRPUlMsXG4gICAge3Byb3ZpZGU6IE1BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE1hdERhdGVwaWNrZXJJbnB1dH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItaW5wdXQnLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdfZGF0ZXBpY2tlciA/IFwiZGlhbG9nXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoX2RhdGVwaWNrZXI/Lm9wZW5lZCAmJiBfZGF0ZXBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnbWluID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtaW4pIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnbWF4ID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtYXgpIDogbnVsbCcsXG4gICAgLy8gVXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIHRvIHRpZSB0aGlzIGlucHV0IHRvIGl0cyBjYWxlbmRhci4gV2UgY2FuJ3QgZGVwZW5kIG9uXG4gICAgLy8gYGFyaWEtb3duc2AgZm9yIHRoaXMsIGJlY2F1c2UgaXQncyBvbmx5IGRlZmluZWQgd2hpbGUgdGhlIGNhbGVuZGFyIGlzIG9wZW4uXG4gICAgJ1thdHRyLmRhdGEtbWF0LWNhbGVuZGFyXSc6ICdfZGF0ZXBpY2tlciA/IF9kYXRlcGlja2VyLmlkIDogbnVsbCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlcklucHV0Jyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0PEQ+XG4gIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0QmFzZTxEIHwgbnVsbCwgRD5cbiAgaW1wbGVtZW50cyBNYXREYXRlcGlja2VyQ29udHJvbDxEIHwgbnVsbD4sIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9jbG9zZWRTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFRoZSBkYXRlcGlja2VyIHRoYXQgdGhpcyBpbnB1dCBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgpXG4gIHNldCBtYXREYXRlcGlja2VyKGRhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXJQYW5lbDxNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgRCB8IG51bGwsIEQ+KSB7XG4gICAgaWYgKGRhdGVwaWNrZXIpIHtcbiAgICAgIHRoaXMuX2RhdGVwaWNrZXIgPSBkYXRlcGlja2VyO1xuICAgICAgdGhpcy5fY2xvc2VkU3Vic2NyaXB0aW9uID0gZGF0ZXBpY2tlci5jbG9zZWRTdHJlYW0uc3Vic2NyaWJlKCgpID0+IHRoaXMuX29uVG91Y2hlZCgpKTtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwoZGF0ZXBpY2tlci5yZWdpc3RlcklucHV0KHRoaXMpKTtcbiAgICB9XG4gIH1cbiAgX2RhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXJQYW5lbDxNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgRCB8IG51bGwsIEQ+O1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgY29uc3QgdmFsaWRWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWxpZFZhbHVlLCB0aGlzLl9taW4pKSB7XG4gICAgICB0aGlzLl9taW4gPSB2YWxpZFZhbHVlO1xuICAgICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuICBzZXQgbWF4KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGNvbnN0IHZhbGlkVmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUodmFsaWRWYWx1ZSwgdGhpcy5fbWF4KSkge1xuICAgICAgdGhpcy5fbWF4ID0gdmFsaWRWYWx1ZTtcbiAgICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBkYXRlcyB3aXRoaW4gdGhlIGRhdGVwaWNrZXIuICovXG4gIEBJbnB1dCgnbWF0RGF0ZXBpY2tlckZpbHRlcicpXG4gIGdldCBkYXRlRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRlRmlsdGVyO1xuICB9XG4gIHNldCBkYXRlRmlsdGVyKHZhbHVlOiBEYXRlRmlsdGVyRm48RCB8IG51bGw+KSB7XG4gICAgY29uc3Qgd2FzTWF0Y2hpbmdWYWx1ZSA9IHRoaXMuX21hdGNoZXNGaWx0ZXIodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMuX21hdGNoZXNGaWx0ZXIodGhpcy52YWx1ZSkgIT09IHdhc01hdGNoaW5nVmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2RhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEIHwgbnVsbD47XG5cbiAgLyoqIFRoZSBjb21iaW5lZCBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGlzIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE1hdERhdGVGb3JtYXRzLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIHByaXZhdGUgX2Zvcm1GaWVsZD86IF9NYXRGb3JtRmllbGRQYXJ0aWFsLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICAgIHRoaXMuX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShzdXBlci5fZ2V0VmFsaWRhdG9ycygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNvbm5lY3RlZCB0by5cbiAgICogQHJldHVybiBUaGUgZWxlbWVudCB0byBjb25uZWN0IHRoZSBwb3B1cCB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIElEIG9mIGFuIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgdXNlZCBhIGRlc2NyaXB0aW9uIGZvciB0aGUgY2FsZW5kYXIgb3ZlcmxheS4gKi9cbiAgZ2V0T3ZlcmxheUxhYmVsSWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZC5nZXRMYWJlbElkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbGV0dGUgdXNlZCBieSB0aGUgaW5wdXQncyBmb3JtIGZpZWxkLCBpZiBhbnkuICovXG4gIGdldFRoZW1lUGFsZXR0ZSgpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuY29sb3IgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgYXQgd2hpY2ggdGhlIGNhbGVuZGFyIHNob3VsZCBzdGFydC4gKi9cbiAgZ2V0U3RhcnRWYWx1ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2Nsb3NlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBhc3NvY2lhdGVkIGRhdGVwaWNrZXIuICovXG4gIHByb3RlY3RlZCBfb3BlblBvcHVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9kYXRlcGlja2VyKSB7XG4gICAgICB0aGlzLl9kYXRlcGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IEQgfCBudWxsKTogRCB8IG51bGwge1xuICAgIHJldHVybiBtb2RlbFZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24odmFsdWUsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIG1pbmltdW0gZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIG1heGltdW0gZGF0ZS4gKi9cbiAgX2dldE1heERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIGRhdGUgZmlsdGVyaW5nIGZ1bmN0aW9uLiAqL1xuICBwcm90ZWN0ZWQgX2dldERhdGVGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Nob3VsZEhhbmRsZUNoYW5nZUV2ZW50KGV2ZW50OiBEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8RD4pIHtcbiAgICByZXR1cm4gZXZlbnQuc291cmNlICE9PSB0aGlzO1xuICB9XG59XG4iXX0=