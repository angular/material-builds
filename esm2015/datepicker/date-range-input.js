/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Optional, ContentChild, ChangeDetectorRef, Self, ElementRef, } from '@angular/core';
import { MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { DateAdapter } from '@angular/material/core';
import { ControlContainer } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatStartDate, MatEndDate, MAT_DATE_RANGE_INPUT_PARENT, } from './date-range-input-parts';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDateRangePicker } from './date-range-picker';
let nextUniqueId = 0;
let MatDateRangeInput = /** @class */ (() => {
    class MatDateRangeInput {
        constructor(_changeDetectorRef, _elementRef, control, _dateAdapter, _formField) {
            this._changeDetectorRef = _changeDetectorRef;
            this._elementRef = _elementRef;
            this._dateAdapter = _dateAdapter;
            this._formField = _formField;
            /** Emits when the input's state has changed. */
            this.stateChanges = new Subject();
            /** Unique ID for the input. */
            this.id = `mat-date-range-input-${nextUniqueId++}`;
            /** Whether the control is focused. */
            this.focused = false;
            /** Name of the form control. */
            this.controlType = 'mat-date-range-input';
            this._groupDisabled = false;
            /** Value for the `aria-describedby` attribute of the inputs. */
            this._ariaDescribedBy = null;
            /** Value for the `aria-labelledby` attribute of the inputs. */
            this._ariaLabelledBy = null;
            /** Separator text to be shown between the inputs. */
            this.separator = '–';
            /** Start of the comparison range that should be shown in the calendar. */
            this.comparisonStart = null;
            /** End of the comparison range that should be shown in the calendar. */
            this.comparisonEnd = null;
            /** Emits when the input's disabled state changes. */
            this._disabledChange = new Subject();
            if (!_dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            // TODO(crisbeto): remove `as any` after #18206 lands.
            this.ngControl = control;
            this._ariaLabelledBy = _formField ? _formField._labelId : null;
        }
        /** Current value of the range input. */
        get value() {
            return this._model ? this._model.selection : null;
        }
        /** Whether the control's label should float. */
        get shouldLabelFloat() {
            return this.focused || !this.empty;
        }
        /**
         * Implemented as a part of `MatFormFieldControl`.
         * Set the placeholder attribute on `matStartDate` and `matEndDate`.
         * @docs-private
         */
        get placeholder() {
            var _a, _b;
            const start = ((_a = this._startInput) === null || _a === void 0 ? void 0 : _a._getPlaceholder()) || '';
            const end = ((_b = this._endInput) === null || _b === void 0 ? void 0 : _b._getPlaceholder()) || '';
            return (start || end) ? `${start} ${this.separator} ${end}` : '';
        }
        /** The range picker that this input is associated with. */
        get rangePicker() { return this._rangePicker; }
        set rangePicker(rangePicker) {
            if (rangePicker) {
                this._model = rangePicker._registerInput(this);
                this._rangePicker = rangePicker;
                this._registerModel(this._model);
            }
        }
        /** Whether the input is required. */
        get required() { return !!this._required; }
        set required(value) {
            this._required = coerceBooleanProperty(value);
        }
        /** Function that can be used to filter out dates within the date range picker. */
        get dateFilter() { return this._dateFilter; }
        set dateFilter(value) {
            this._dateFilter = value;
            this._revalidate();
        }
        /** The minimum valid date. */
        get min() { return this._min; }
        set min(value) {
            this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._revalidate();
        }
        /** The maximum valid date. */
        get max() { return this._max; }
        set max(value) {
            this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._revalidate();
        }
        /** Whether the input is disabled. */
        get disabled() {
            return (this._startInput && this._endInput) ?
                (this._startInput.disabled && this._endInput.disabled) :
                this._groupDisabled;
        }
        set disabled(value) {
            const newValue = coerceBooleanProperty(value);
            if (newValue !== this._groupDisabled) {
                this._groupDisabled = newValue;
                this._disabledChange.next(this.disabled);
            }
        }
        /** Whether the input is in an error state. */
        get errorState() {
            if (this._startInput && this._endInput) {
                return this._startInput.errorState || this._endInput.errorState;
            }
            return false;
        }
        /** Whether the datepicker input is empty. */
        get empty() {
            const startEmpty = this._startInput ? this._startInput.isEmpty() : false;
            const endEmpty = this._endInput ? this._endInput.isEmpty() : false;
            return startEmpty && endEmpty;
        }
        /**
         * Implemented as a part of `MatFormFieldControl`.
         * @docs-private
         */
        setDescribedByIds(ids) {
            this._ariaDescribedBy = ids.length ? ids.join(' ') : null;
        }
        /**
         * Implemented as a part of `MatFormFieldControl`.
         * @docs-private
         */
        onContainerClick() {
            if (!this.focused && !this.disabled) {
                if (!this._model || !this._model.selection.start) {
                    this._startInput.focus();
                }
                else {
                    this._endInput.focus();
                }
            }
        }
        ngAfterContentInit() {
            if (!this._startInput) {
                throw Error('mat-date-range-input must contain a matStartDate input');
            }
            if (!this._endInput) {
                throw Error('mat-date-range-input must contain a matEndDate input');
            }
            if (this._model) {
                this._registerModel(this._model);
            }
            // We don't need to unsubscribe from this, because we
            // know that the input streams will be completed on destroy.
            merge(this._startInput._disabledChange, this._endInput._disabledChange).subscribe(() => {
                this._disabledChange.next(this.disabled);
            });
        }
        ngOnDestroy() {
            this.stateChanges.complete();
            this._disabledChange.unsubscribe();
        }
        /** Gets the date at which the calendar should start. */
        getStartValue() {
            return this.value ? this.value.start : null;
        }
        /** Gets the input's theme palette. */
        getThemePalette() {
            return this._formField ? this._formField.color : undefined;
        }
        /** Gets the element to which the calendar overlay should be attached. */
        getConnectedOverlayOrigin() {
            return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
        }
        /** Gets the value that is used to mirror the state input. */
        _getInputMirrorValue() {
            return this._startInput ? this._startInput.getMirrorValue() : '';
        }
        /** Whether the input placeholders should be hidden. */
        _shouldHidePlaceholders() {
            return this._startInput ? !this._startInput.isEmpty() : false;
        }
        /** Handles the value in one of the child inputs changing. */
        _handleChildValueChange() {
            this.stateChanges.next();
            this._changeDetectorRef.markForCheck();
        }
        /** Opens the date range picker associated with the input. */
        _openDatepicker() {
            if (this._rangePicker) {
                this._rangePicker.open();
            }
        }
        /** Whether the separate text should be hidden. */
        _shouldHideSeparator() {
            return (!this._formField || this._formField._hideControlPlaceholder()) && this.empty;
        }
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        _getValidDateOrNull(obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        }
        /** Re-runs the validators on the start/end inputs. */
        _revalidate() {
            if (this._startInput) {
                this._startInput._validatorOnChange();
            }
            if (this._endInput) {
                this._endInput._validatorOnChange();
            }
        }
        /** Registers the current date selection model with the start/end inputs. */
        _registerModel(model) {
            if (this._startInput) {
                this._startInput._registerModel(model);
            }
            if (this._endInput) {
                this._endInput._registerModel(model);
            }
        }
    }
    MatDateRangeInput.decorators = [
        { type: Component, args: [{
                    selector: 'mat-date-range-input',
                    template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"focused = $event !== null\">\n  <div class=\"mat-date-range-input-start-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue()}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n  </div>\n</div>\n\n",
                    exportAs: 'matDateRangeInput',
                    host: {
                        'class': 'mat-date-range-input',
                        '[class.mat-date-range-input-hide-placeholders]': '_shouldHidePlaceholders()',
                        '[attr.id]': 'null',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
                        { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
                    ],
                    styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{margin:0 4px;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-separator-hidden{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner::-ms-clear,.mat-date-range-input-inner::-ms-reveal{display:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"]
                },] }
    ];
    MatDateRangeInput.ctorParameters = () => [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: ControlContainer, decorators: [{ type: Optional }, { type: Self }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: MatFormField, decorators: [{ type: Optional }] }
    ];
    MatDateRangeInput.propDecorators = {
        rangePicker: [{ type: Input }],
        required: [{ type: Input }],
        dateFilter: [{ type: Input }],
        min: [{ type: Input }],
        max: [{ type: Input }],
        disabled: [{ type: Input }],
        separator: [{ type: Input }],
        comparisonStart: [{ type: Input }],
        comparisonEnd: [{ type: Input }],
        _startInput: [{ type: ContentChild, args: [MatStartDate,] }],
        _endInput: [{ type: ContentChild, args: [MatEndDate,] }]
    };
    return MatDateRangeInput;
})();
export { MatDateRangeInput };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRSxPQUFPLEVBQWUsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakUsT0FBTyxFQUFZLGdCQUFnQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLHFCQUFxQixFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBRVYsMkJBQTJCLEdBQzVCLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFHdkQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCO0lBQUEsTUFpQmEsaUJBQWlCO1FBa0o1QixZQUNVLGtCQUFxQyxFQUNyQyxXQUFvQyxFQUN4QixPQUF5QixFQUN6QixZQUE0QixFQUM1QixVQUF5QjtZQUpyQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1lBQ3JDLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtZQUV4QixpQkFBWSxHQUFaLFlBQVks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QUFpQjtnQkFFakIsVUFBVTtnQkFJTyxnQkFBZ0IsdUJBdUw5QixRQUFRLFlBQUksSUFBSTtnQkF4TEMsV0FBVyx1QkF5TDVCLFFBQVE7Z0JBMUxnQixZQUFZLHVCQTJMcEMsUUFBUTs7OzhCQW5IVixLQUFLOzJCQVlMLEtBQUs7NkJBUUwsS0FBSztzQkFTTCxLQUFLO3NCQVNMLEtBQUs7MkJBU0wsS0FBSzs0QkEwQ0wsS0FBSztrQ0FHTCxLQUFLO2dDQUdMLEtBQUs7OEJBRUwsWUFBWSxTQUFDLFlBQVk7NEJBQ3pCLFlBQVksU0FBQyxVQUFVOztJQXNKMUIsd0JBQUM7S0FBQTtTQTVSWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT25EZXN0cm95LFxuICBDb250ZW50Q2hpbGQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBTZWxmLFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbCwgTWF0Rm9ybUZpZWxkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7VGhlbWVQYWxldHRlLCBEYXRlQWRhcHRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge05nQ29udHJvbCwgQ29udHJvbENvbnRhaW5lcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgQm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgTWF0U3RhcnREYXRlLFxuICBNYXRFbmREYXRlLFxuICBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudCxcbiAgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5ULFxufSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQ29udHJvbH0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge0RhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtNYXREYXRlUmFuZ2VQaWNrZXJ9IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXInO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZS1yYW5nZS1pbnB1dC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcmFuZ2UtaW5wdXQuY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZVJhbmdlSW5wdXQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0JyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LWhpZGUtcGxhY2Vob2xkZXJzXSc6ICdfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpJyxcbiAgICAnW2F0dHIuaWRdJzogJ251bGwnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VJbnB1dH0sXG4gICAge3Byb3ZpZGU6IE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCwgdXNlRXhpc3Rpbmc6IE1hdERhdGVSYW5nZUlucHV0fSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dDxEPiBpbXBsZW1lbnRzIE1hdEZvcm1GaWVsZENvbnRyb2w8RGF0ZVJhbmdlPEQ+PixcbiAgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICAvKiogQ3VycmVudCB2YWx1ZSBvZiB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24gOiBudWxsO1xuICB9XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGlucHV0J3Mgc3RhdGUgaGFzIGNoYW5nZWQuICovXG4gIHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFVuaXF1ZSBJRCBmb3IgdGhlIGlucHV0LiAqL1xuICBpZCA9IGBtYXQtZGF0ZS1yYW5nZS1pbnB1dC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZm9jdXNlZC4gKi9cbiAgZm9jdXNlZCA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sJ3MgbGFiZWwgc2hvdWxkIGZsb2F0LiAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIE5hbWUgb2YgdGhlIGZvcm0gY29udHJvbC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBTZXQgdGhlIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBvbiBgbWF0U3RhcnREYXRlYCBhbmQgYG1hdEVuZERhdGVgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcGxhY2Vob2xkZXIoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9zdGFydElucHV0Py5fZ2V0UGxhY2Vob2xkZXIoKSB8fCAnJztcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9lbmRJbnB1dD8uX2dldFBsYWNlaG9sZGVyKCkgfHwgJyc7XG4gICAgcmV0dXJuIChzdGFydCB8fCBlbmQpID8gYCR7c3RhcnR9ICR7dGhpcy5zZXBhcmF0b3J9ICR7ZW5kfWAgOiAnJztcbiAgfVxuXG4gIC8qKiBUaGUgcmFuZ2UgcGlja2VyIHRoYXQgdGhpcyBpbnB1dCBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgpXG4gIGdldCByYW5nZVBpY2tlcigpIHsgcmV0dXJuIHRoaXMuX3JhbmdlUGlja2VyOyB9XG4gIHNldCByYW5nZVBpY2tlcihyYW5nZVBpY2tlcjogTWF0RGF0ZVJhbmdlUGlja2VyPEQ+KSB7XG4gICAgaWYgKHJhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLl9tb2RlbCA9IHJhbmdlUGlja2VyLl9yZWdpc3RlcklucHV0KHRoaXMpO1xuICAgICAgdGhpcy5fcmFuZ2VQaWNrZXIgPSByYW5nZVBpY2tlcjtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwodGhpcy5fbW9kZWwhKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcmFuZ2VQaWNrZXI6IE1hdERhdGVSYW5nZVBpY2tlcjxEPjtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbHRlciBvdXQgZGF0ZXMgd2l0aGluIHRoZSBkYXRlIHJhbmdlIHBpY2tlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRhdGVGaWx0ZXIoKSB7IHJldHVybiB0aGlzLl9kYXRlRmlsdGVyOyB9XG4gIHNldCBkYXRlRmlsdGVyKHZhbHVlOiBEYXRlRmlsdGVyRm48RD4pIHtcbiAgICB0aGlzLl9kYXRlRmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX2RhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbigpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9taW47IH1cbiAgc2V0IG1pbih2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW4gPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXggPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuX3N0YXJ0SW5wdXQgJiYgdGhpcy5fZW5kSW5wdXQpID9cbiAgICAgICh0aGlzLl9zdGFydElucHV0LmRpc2FibGVkICYmIHRoaXMuX2VuZElucHV0LmRpc2FibGVkKSA6XG4gICAgICB0aGlzLl9ncm91cERpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZ3JvdXBEaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZ3JvdXBEaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dCh0aGlzLmRpc2FibGVkKTtcbiAgICB9XG4gIH1cbiAgX2dyb3VwRGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgaW4gYW4gZXJyb3Igc3RhdGUuICovXG4gIGdldCBlcnJvclN0YXRlKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dC5lcnJvclN0YXRlIHx8IHRoaXMuX2VuZElucHV0LmVycm9yU3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaW5wdXQgaXMgZW1wdHkuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFydEVtcHR5ID0gdGhpcy5fc3RhcnRJbnB1dCA/IHRoaXMuX3N0YXJ0SW5wdXQuaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgY29uc3QgZW5kRW1wdHkgPSB0aGlzLl9lbmRJbnB1dCA/IHRoaXMuX2VuZElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIHJldHVybiBzdGFydEVtcHR5ICYmIGVuZEVtcHR5O1xuICB9XG5cbiAgLyoqIFZhbHVlIGZvciB0aGUgYGFyaWEtZGVzY3JpYmVkYnlgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXRzLiAqL1xuICBfYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogVmFsdWUgZm9yIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogRGF0ZSBzZWxlY3Rpb24gbW9kZWwgY3VycmVudGx5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByaXZhdGUgX21vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+PiB8IHVuZGVmaW5lZDtcblxuICAvKiogU2VwYXJhdG9yIHRleHQgdG8gYmUgc2hvd24gYmV0d2VlbiB0aGUgaW5wdXRzLiAqL1xuICBASW5wdXQoKSBzZXBhcmF0b3IgPSAn4oCTJztcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UgdGhhdCBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlIHRoYXQgc2hvdWxkIGJlIHNob3duIGluIHRoZSBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogRCB8IG51bGwgPSBudWxsO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0U3RhcnREYXRlKSBfc3RhcnRJbnB1dDogTWF0U3RhcnREYXRlPEQ+O1xuICBAQ29udGVudENoaWxkKE1hdEVuZERhdGUpIF9lbmRJbnB1dDogTWF0RW5kRGF0ZTxEPjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogVE9ETyhjcmlzYmV0byk6IGNoYW5nZSB0eXBlIHRvIGBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmVgIGFmdGVyICMxODIwNiBsYW5kcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2wgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBpbnB1dCdzIGRpc2FibGVkIHN0YXRlIGNoYW5nZXMuICovXG4gIF9kaXNhYmxlZENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgY29udHJvbDogQ29udHJvbENvbnRhaW5lcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkKSB7XG5cbiAgICBpZiAoIV9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHJlbW92ZSBgYXMgYW55YCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAgdGhpcy5uZ0NvbnRyb2wgPSBjb250cm9sIGFzIGFueTtcbiAgICB0aGlzLl9hcmlhTGFiZWxsZWRCeSA9IF9mb3JtRmllbGQgPyBfZm9ybUZpZWxkLl9sYWJlbElkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZEJ5ID0gaWRzLmxlbmd0aCA/IGlkcy5qb2luKCcgJykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwgfHwgIXRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICB0aGlzLl9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbmRJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXJ0SW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dCBtdXN0IGNvbnRhaW4gYSBtYXRTdGFydERhdGUgaW5wdXQnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2VuZElucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0RW5kRGF0ZSBpbnB1dCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCk7XG4gICAgfVxuXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tIHRoaXMsIGJlY2F1c2Ugd2VcbiAgICAvLyBrbm93IHRoYXQgdGhlIGlucHV0IHN0cmVhbXMgd2lsbCBiZSBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICBtZXJnZSh0aGlzLl9zdGFydElucHV0Ll9kaXNhYmxlZENoYW5nZSwgdGhpcy5fZW5kSW5wdXQuX2Rpc2FibGVkQ2hhbmdlKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dCh0aGlzLmRpc2FibGVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGF0IHdoaWNoIHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQuICovXG4gIGdldFN0YXJ0VmFsdWUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5zdGFydCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyB0aGVtZSBwYWxldHRlLiAqL1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmNvbG9yIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNhbGVuZGFyIG92ZXJsYXkgc2hvdWxkIGJlIGF0dGFjaGVkLiAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IGlzIHVzZWQgdG8gbWlycm9yIHRoZSBzdGF0ZSBpbnB1dC4gKi9cbiAgX2dldElucHV0TWlycm9yVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmdldE1pcnJvclZhbHVlKCkgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBwbGFjZWhvbGRlcnMgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyAhdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSB2YWx1ZSBpbiBvbmUgb2YgdGhlIGNoaWxkIGlucHV0cyBjaGFuZ2luZy4gKi9cbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlIHJhbmdlIHBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBfb3BlbkRhdGVwaWNrZXIoKSB7XG4gICAgaWYgKHRoaXMuX3JhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLl9yYW5nZVBpY2tlci5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlcGFyYXRlIHRleHQgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVTZXBhcmF0b3IoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fZm9ybUZpZWxkIHx8IHRoaXMuX2Zvcm1GaWVsZC5faGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpKSAmJiB0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VmFsaWREYXRlT3JOdWxsKG9iajogYW55KTogRCB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5fZGF0ZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJiB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKG9iaikpID8gb2JqIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBSZS1ydW5zIHRoZSB2YWxpZGF0b3JzIG9uIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZXZhbGlkYXRlKCkge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyB0aGUgY3VycmVudCBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=