/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Optional, ContentChild, ChangeDetectorRef, Self, ElementRef, Inject, } from '@angular/core';
import { MatFormFieldControl, MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';
import { DateAdapter } from '@angular/material/core';
import { ControlContainer } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatStartDate, MatEndDate, MAT_DATE_RANGE_INPUT_PARENT, } from './date-range-input-parts';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDateRangePicker } from './date-range-picker';
let nextUniqueId = 0;
export class MatDateRangeInput {
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
        /** Separator text to be shown between the inputs. */
        this.separator = '–';
        /** Start of the comparison range that should be shown in the calendar. */
        this.comparisonStart = null;
        /** End of the comparison range that should be shown in the calendar. */
        this.comparisonEnd = null;
        /** Emits when the input's state changes. */
        this._stateChanges = new Subject();
        if (!_dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw createMissingDateImplError('DateAdapter');
        }
        // TODO(crisbeto): remove `as any` after #18206 lands.
        this.ngControl = control;
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
        this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._revalidate();
    }
    /** The maximum valid date. */
    get max() { return this._max; }
    set max(value) {
        this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
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
            this._stateChanges.next(undefined);
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
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._startInput) {
                throw Error('mat-date-range-input must contain a matStartDate input');
            }
            if (!this._endInput) {
                throw Error('mat-date-range-input must contain a matEndDate input');
            }
        }
        if (this._model) {
            this._registerModel(this._model);
        }
        // We don't need to unsubscribe from this, because we
        // know that the input streams will be completed on destroy.
        merge(this._startInput.stateChanges, this._endInput.stateChanges).subscribe(() => {
            this._stateChanges.next(undefined);
        });
    }
    ngOnChanges() {
        this._stateChanges.next(undefined);
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        this._stateChanges.unsubscribe();
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
        this.stateChanges.next(undefined);
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
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby() {
        const formField = this._formField;
        return formField && formField._hasFloatingLabel() ? formField._labelId : null;
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
                    '[class.mat-date-range-input-required]': 'required',
                    '[attr.id]': 'null',
                    'role': 'group',
                    '[attr.aria-labelledby]': '_getAriaLabelledby()',
                    '[attr.aria-describedby]': '_ariaDescribedBy',
                    // Used by the test harness to tie this input to its calendar. We can't depend on
                    // `aria-owns` for this, because it's only defined while the calendar is open.
                    '[attr.data-mat-calendar]': 'rangePicker ? rangePicker.id : null',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [
                    { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
                    { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
                ],
                styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px}.mat-date-range-input-separator-hidden{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner::-ms-clear,.mat-date-range-input-inner::-ms-reveal{display:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"]
            },] }
];
MatDateRangeInput.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Self }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxFQUNWLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9GLE9BQU8sRUFBZSxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUMscUJBQXFCLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsWUFBWSxFQUNaLFVBQVUsRUFFViwyQkFBMkIsR0FDNUIsTUFBTSwwQkFBMEIsQ0FBQztBQUVsQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUvRCxPQUFPLEVBQUMsa0JBQWtCLEVBQTBCLE1BQU0scUJBQXFCLENBQUM7QUFHaEYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBMEJyQixNQUFNLE9BQU8saUJBQWlCO0lBZ0o1QixZQUNVLGtCQUFxQyxFQUNyQyxXQUFvQyxFQUN4QixPQUF5QixFQUN6QixZQUE0QixFQUNKLFVBQXlCO1FBSjdELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FB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QUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsU0FBUyxFQUFFO29CQUNULEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQztvQkFDOUQsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDO2lCQUN2RTs7YUFDRjs7O1lBaERDLGlCQUFpQjtZQUVqQixVQUFVO1lBTU8sZ0JBQWdCLHVCQTRMOUIsUUFBUSxZQUFJLElBQUk7WUE3TEMsV0FBVyx1QkE4TDVCLFFBQVE7WUEvTGdCLFlBQVksdUJBZ01wQyxRQUFRLFlBQUksTUFBTSxTQUFDLGNBQWM7OzswQkFoSG5DLEtBQUs7dUJBWUwsS0FBSzt5QkFRTCxLQUFLO2tCQVNMLEtBQUs7a0JBU0wsS0FBSzt1QkFTTCxLQUFLO3dCQXVDTCxLQUFLOzhCQUdMLEtBQUs7NEJBR0wsS0FBSzswQkFFTCxZQUFZLFNBQUMsWUFBWTt3QkFDekIsWUFBWSxTQUFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT25EZXN0cm95LFxuICBDb250ZW50Q2hpbGQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBTZWxmLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIE9uQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2wsIE1hdEZvcm1GaWVsZCwgTUFUX0ZPUk1fRklFTER9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtUaGVtZVBhbGV0dGUsIERhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TmdDb250cm9sLCBDb250cm9sQ29udGFpbmVyfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3QsIG1lcmdlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5LCBCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBNYXRTdGFydERhdGUsXG4gIE1hdEVuZERhdGUsXG4gIE1hdERhdGVSYW5nZUlucHV0UGFyZW50LFxuICBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQsXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJDb250cm9sfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7RGF0ZUZpbHRlckZufSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtYmFzZSc7XG5pbXBvcnQge01hdERhdGVSYW5nZVBpY2tlciwgTWF0RGF0ZVJhbmdlUGlja2VySW5wdXR9IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXInO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZS1yYW5nZS1pbnB1dC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcmFuZ2UtaW5wdXQuY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZVJhbmdlSW5wdXQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0JyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LWhpZGUtcGxhY2Vob2xkZXJzXSc6ICdfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpJyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1thdHRyLmlkXSc6ICdudWxsJyxcbiAgICAncm9sZSc6ICdncm91cCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2dldEFyaWFMYWJlbGxlZGJ5KCknLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAvLyBVc2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgdG8gdGllIHRoaXMgaW5wdXQgdG8gaXRzIGNhbGVuZGFyLiBXZSBjYW4ndCBkZXBlbmQgb25cbiAgICAvLyBgYXJpYS1vd25zYCBmb3IgdGhpcywgYmVjYXVzZSBpdCdzIG9ubHkgZGVmaW5lZCB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi5cbiAgICAnW2F0dHIuZGF0YS1tYXQtY2FsZW5kYXJdJzogJ3JhbmdlUGlja2VyID8gcmFuZ2VQaWNrZXIuaWQgOiBudWxsJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0RGF0ZVJhbmdlSW5wdXR9LFxuICAgIHtwcm92aWRlOiBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VJbnB1dH0sXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXQ8RD4gaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPERhdGVSYW5nZTxEPj4sXG4gIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPiwgTWF0RGF0ZVJhbmdlUGlja2VySW5wdXQ8RD4sXG4gIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBpbnB1dCdzIHN0YXRlIGhhcyBjaGFuZ2VkLiAqL1xuICBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBpbnB1dC4gKi9cbiAgaWQgPSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIGZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCdzIGxhYmVsIHNob3VsZCBmbG9hdC4gKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIC8qKiBOYW1lIG9mIHRoZSBmb3JtIGNvbnRyb2wuICovXG4gIGNvbnRyb2xUeXBlID0gJ21hdC1kYXRlLXJhbmdlLWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogU2V0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb24gYG1hdFN0YXJ0RGF0ZWAgYW5kIGBtYXRFbmREYXRlYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fc3RhcnRJbnB1dD8uX2dldFBsYWNlaG9sZGVyKCkgfHwgJyc7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZW5kSW5wdXQ/Ll9nZXRQbGFjZWhvbGRlcigpIHx8ICcnO1xuICAgIHJldHVybiAoc3RhcnQgfHwgZW5kKSA/IGAke3N0YXJ0fSAke3RoaXMuc2VwYXJhdG9yfSAke2VuZH1gIDogJyc7XG4gIH1cblxuICAvKiogVGhlIHJhbmdlIHBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmFuZ2VQaWNrZXIoKSB7IHJldHVybiB0aGlzLl9yYW5nZVBpY2tlcjsgfVxuICBzZXQgcmFuZ2VQaWNrZXIocmFuZ2VQaWNrZXI6IE1hdERhdGVSYW5nZVBpY2tlcjxEPikge1xuICAgIGlmIChyYW5nZVBpY2tlcikge1xuICAgICAgdGhpcy5fbW9kZWwgPSByYW5nZVBpY2tlci5fcmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICAgIHRoaXMuX3JhbmdlUGlja2VyID0gcmFuZ2VQaWNrZXI7XG4gICAgICB0aGlzLl9yZWdpc3Rlck1vZGVsKHRoaXMuX21vZGVsISk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3JhbmdlUGlja2VyOiBNYXREYXRlUmFuZ2VQaWNrZXI8RD47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuX3JlcXVpcmVkOyB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbjtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGRhdGVzIHdpdGhpbiB0aGUgZGF0ZSByYW5nZSBwaWNrZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkYXRlRmlsdGVyKCkgeyByZXR1cm4gdGhpcy5fZGF0ZUZpbHRlcjsgfVxuICBzZXQgZGF0ZUZpbHRlcih2YWx1ZTogRGF0ZUZpbHRlckZuPEQ+KSB7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IHZhbHVlO1xuICAgIHRoaXMuX3JldmFsaWRhdGUoKTtcbiAgfVxuICBwcml2YXRlIF9kYXRlRmlsdGVyOiBEYXRlRmlsdGVyRm48RD47XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluOyB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX21pbjogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWF4OyB9XG4gIHNldCBtYXgodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0KSA/XG4gICAgICAodGhpcy5fc3RhcnRJbnB1dC5kaXNhYmxlZCAmJiB0aGlzLl9lbmRJbnB1dC5kaXNhYmxlZCkgOlxuICAgICAgdGhpcy5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2dyb3VwRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2dyb3VwRGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG4gIF9ncm91cERpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICBnZXQgZXJyb3JTdGF0ZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fc3RhcnRJbnB1dCAmJiB0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQuZXJyb3JTdGF0ZSB8fCB0aGlzLl9lbmRJbnB1dC5lcnJvclN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlucHV0IGlzIGVtcHR5LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc3RhcnRFbXB0eSA9IHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIGNvbnN0IGVuZEVtcHR5ID0gdGhpcy5fZW5kSW5wdXQgPyB0aGlzLl9lbmRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgICByZXR1cm4gc3RhcnRFbXB0eSAmJiBlbmRFbXB0eTtcbiAgfVxuXG4gIC8qKiBWYWx1ZSBmb3IgdGhlIGBhcmlhLWRlc2NyaWJlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2FyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIERhdGUgc2VsZWN0aW9uIG1vZGVsIGN1cnJlbnRseSByZWdpc3RlcmVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPj4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFNlcGFyYXRvciB0ZXh0IHRvIGJlIHNob3duIGJldHdlZW4gdGhlIGlucHV0cy4gKi9cbiAgQElucHV0KCkgc2VwYXJhdG9yID0gJ+KAkyc7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlIHRoYXQgc2hvdWxkIGJlIHNob3duIGluIHRoZSBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZSB0aGF0IHNob3VsZCBiZSBzaG93biBpbiB0aGUgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsID0gbnVsbDtcblxuICBAQ29udGVudENoaWxkKE1hdFN0YXJ0RGF0ZSkgX3N0YXJ0SW5wdXQ6IE1hdFN0YXJ0RGF0ZTxEPjtcbiAgQENvbnRlbnRDaGlsZChNYXRFbmREYXRlKSBfZW5kSW5wdXQ6IE1hdEVuZERhdGU8RD47XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIFRPRE8oY3Jpc2JldG8pOiBjaGFuZ2UgdHlwZSB0byBgQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlYCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG5nQ29udHJvbDogTmdDb250cm9sIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgaW5wdXQncyBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBjb250cm9sOiBDb250cm9sQ29udGFpbmVyLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcml2YXRlIF9mb3JtRmllbGQ/OiBNYXRGb3JtRmllbGQpIHtcblxuICAgIGlmICghX2RhdGVBZGFwdGVyICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignRGF0ZUFkYXB0ZXInKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogcmVtb3ZlIGBhcyBhbnlgIGFmdGVyICMxODIwNiBsYW5kcy5cbiAgICB0aGlzLm5nQ29udHJvbCA9IGNvbnRyb2wgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVkQnkgPSBpZHMubGVuZ3RoID8gaWRzLmpvaW4oJyAnKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljaygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZm9jdXNlZCAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgaWYgKCF0aGlzLl9tb2RlbCB8fCAhdGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0KSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0SW5wdXQuZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VuZElucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fc3RhcnRJbnB1dCkge1xuICAgICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0U3RhcnREYXRlIGlucHV0Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ21hdC1kYXRlLXJhbmdlLWlucHV0IG11c3QgY29udGFpbiBhIG1hdEVuZERhdGUgaW5wdXQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwodGhpcy5fbW9kZWwpO1xuICAgIH1cblxuICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUgZnJvbSB0aGlzLCBiZWNhdXNlIHdlXG4gICAgLy8ga25vdyB0aGF0IHRoZSBpbnB1dCBzdHJlYW1zIHdpbGwgYmUgY29tcGxldGVkIG9uIGRlc3Ryb3kuXG4gICAgbWVyZ2UodGhpcy5fc3RhcnRJbnB1dC5zdGF0ZUNoYW5nZXMsIHRoaXMuX2VuZElucHV0LnN0YXRlQ2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGF0IHdoaWNoIHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQuICovXG4gIGdldFN0YXJ0VmFsdWUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5zdGFydCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyB0aGVtZSBwYWxldHRlLiAqL1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmNvbG9yIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNhbGVuZGFyIG92ZXJsYXkgc2hvdWxkIGJlIGF0dGFjaGVkLiAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IGlzIHVzZWQgdG8gbWlycm9yIHRoZSBzdGF0ZSBpbnB1dC4gKi9cbiAgX2dldElucHV0TWlycm9yVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmdldE1pcnJvclZhbHVlKCkgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBwbGFjZWhvbGRlcnMgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyAhdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSB2YWx1ZSBpbiBvbmUgb2YgdGhlIGNoaWxkIGlucHV0cyBjaGFuZ2luZy4gKi9cbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlIHJhbmdlIHBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBfb3BlbkRhdGVwaWNrZXIoKSB7XG4gICAgaWYgKHRoaXMuX3JhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLl9yYW5nZVBpY2tlci5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlcGFyYXRlIHRleHQgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVTZXBhcmF0b3IoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fZm9ybUZpZWxkIHx8IHRoaXMuX2Zvcm1GaWVsZC5faGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpKSAmJiB0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dHMuICovXG4gIF9nZXRBcmlhTGFiZWxsZWRieSgpIHtcbiAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQ7XG4gICAgcmV0dXJuIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQuX2hhc0Zsb2F0aW5nTGFiZWwoKSA/IGZvcm1GaWVsZC5fbGFiZWxJZCA6IG51bGw7XG4gIH1cblxuICAvKiogUmUtcnVucyB0aGUgdmFsaWRhdG9ycyBvbiB0aGUgc3RhcnQvZW5kIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfcmV2YWxpZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fc3RhcnRJbnB1dCkge1xuICAgICAgdGhpcy5fc3RhcnRJbnB1dC5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZWdpc3RlcnMgdGhlIGN1cnJlbnQgZGF0ZSBzZWxlY3Rpb24gbW9kZWwgd2l0aCB0aGUgc3RhcnQvZW5kIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJNb2RlbChtb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPj4pIHtcbiAgICBpZiAodGhpcy5fc3RhcnRJbnB1dCkge1xuICAgICAgdGhpcy5fc3RhcnRJbnB1dC5fcmVnaXN0ZXJNb2RlbChtb2RlbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2VuZElucHV0KSB7XG4gICAgICB0aGlzLl9lbmRJbnB1dC5fcmVnaXN0ZXJNb2RlbChtb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19