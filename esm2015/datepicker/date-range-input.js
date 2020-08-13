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
        if (!_dateAdapter) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxFQUNWLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9GLE9BQU8sRUFBZSxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUMscUJBQXFCLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsWUFBWSxFQUNaLFVBQVUsRUFFViwyQkFBMkIsR0FDNUIsTUFBTSwwQkFBMEIsQ0FBQztBQUVsQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUvRCxPQUFPLEVBQUMsa0JBQWtCLEVBQTBCLE1BQU0scUJBQXFCLENBQUM7QUFHaEYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBMEJyQixNQUFNLE9BQU8saUJBQWlCO0lBZ0o1QixZQUNVLGtCQUFxQyxFQUNyQyxXQUFvQyxFQUN4QixPQUF5QixFQUN6QixZQUE0QixFQUNKLFVBQXlCO1FBSjdELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FB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b0JBQzlELEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQztpQkFDdkU7O2FBQ0Y7OztZQWhEQyxpQkFBaUI7WUFFakIsVUFBVTtZQU1PLGdCQUFnQix1QkE0TDlCLFFBQVEsWUFBSSxJQUFJO1lBN0xDLFdBQVcsdUJBOEw1QixRQUFRO1lBL0xnQixZQUFZLHVCQWdNcEMsUUFBUSxZQUFJLE1BQU0sU0FBQyxjQUFjOzs7MEJBaEhuQyxLQUFLO3VCQVlMLEtBQUs7eUJBUUwsS0FBSztrQkFTTCxLQUFLO2tCQVNMLEtBQUs7dUJBU0wsS0FBSzt3QkF1Q0wsS0FBSzs4QkFHTCxLQUFLOzRCQUdMLEtBQUs7MEJBRUwsWUFBWSxTQUFDLFlBQVk7d0JBQ3pCLFlBQVksU0FBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE9uRGVzdHJveSxcbiAgQ29udGVudENoaWxkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgU2VsZixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBPbkNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sLCBNYXRGb3JtRmllbGQsIE1BVF9GT1JNX0ZJRUxEfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7VGhlbWVQYWxldHRlLCBEYXRlQWRhcHRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge05nQ29udHJvbCwgQ29udHJvbENvbnRhaW5lcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgQm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgTWF0U3RhcnREYXRlLFxuICBNYXRFbmREYXRlLFxuICBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudCxcbiAgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5ULFxufSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQ29udHJvbH0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge0RhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtNYXREYXRlUmFuZ2VQaWNrZXIsIE1hdERhdGVSYW5nZVBpY2tlcklucHV0fSBmcm9tICcuL2RhdGUtcmFuZ2UtcGlja2VyJztcbmltcG9ydCB7RGF0ZVJhbmdlLCBNYXREYXRlU2VsZWN0aW9uTW9kZWx9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGUtcmFuZ2UtaW5wdXQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlLXJhbmdlLWlucHV0LmNzcyddLFxuICBleHBvcnRBczogJ21hdERhdGVSYW5nZUlucHV0JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZS1yYW5nZS1pbnB1dC1oaWRlLXBsYWNlaG9sZGVyc10nOiAnX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKScsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZS1yYW5nZS1pbnB1dC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbYXR0ci5pZF0nOiAnbnVsbCcsXG4gICAgJ3JvbGUnOiAnZ3JvdXAnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19nZXRBcmlhTGFiZWxsZWRieSgpJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRCeScsXG4gICAgLy8gVXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIHRvIHRpZSB0aGlzIGlucHV0IHRvIGl0cyBjYWxlbmRhci4gV2UgY2FuJ3QgZGVwZW5kIG9uXG4gICAgLy8gYGFyaWEtb3duc2AgZm9yIHRoaXMsIGJlY2F1c2UgaXQncyBvbmx5IGRlZmluZWQgd2hpbGUgdGhlIGNhbGVuZGFyIGlzIG9wZW4uXG4gICAgJ1thdHRyLmRhdGEtbWF0LWNhbGVuZGFyXSc6ICdyYW5nZVBpY2tlciA/IHJhbmdlUGlja2VyLmlkIDogbnVsbCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdERhdGVSYW5nZUlucHV0fSxcbiAgICB7cHJvdmlkZTogTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5ULCB1c2VFeGlzdGluZzogTWF0RGF0ZVJhbmdlSW5wdXR9LFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVSYW5nZUlucHV0PEQ+IGltcGxlbWVudHMgTWF0Rm9ybUZpZWxkQ29udHJvbDxEYXRlUmFuZ2U8RD4+LFxuICBNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4sIE1hdERhdGVSYW5nZVBpY2tlcklucHV0PEQ+LFxuICBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKiBDdXJyZW50IHZhbHVlIG9mIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbiA6IG51bGw7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbiB0aGUgaW5wdXQncyBzdGF0ZSBoYXMgY2hhbmdlZC4gKi9cbiAgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVW5pcXVlIElEIGZvciB0aGUgaW5wdXQuICovXG4gIGlkID0gYG1hdC1kYXRlLXJhbmdlLWlucHV0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBmb2N1c2VkLiAqL1xuICBmb2N1c2VkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wncyBsYWJlbCBzaG91bGQgZmxvYXQuICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgIXRoaXMuZW1wdHk7XG4gIH1cblxuICAvKiogTmFtZSBvZiB0aGUgZm9ybSBjb250cm9sLiAqL1xuICBjb250cm9sVHlwZSA9ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIFNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG9uIGBtYXRTdGFydERhdGVgIGFuZCBgbWF0RW5kRGF0ZWAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBwbGFjZWhvbGRlcigpIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX3N0YXJ0SW5wdXQ/Ll9nZXRQbGFjZWhvbGRlcigpIHx8ICcnO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX2VuZElucHV0Py5fZ2V0UGxhY2Vob2xkZXIoKSB8fCAnJztcbiAgICByZXR1cm4gKHN0YXJ0IHx8IGVuZCkgPyBgJHtzdGFydH0gJHt0aGlzLnNlcGFyYXRvcn0gJHtlbmR9YCA6ICcnO1xuICB9XG5cbiAgLyoqIFRoZSByYW5nZSBwaWNrZXIgdGhhdCB0aGlzIGlucHV0IGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJhbmdlUGlja2VyKCkgeyByZXR1cm4gdGhpcy5fcmFuZ2VQaWNrZXI7IH1cbiAgc2V0IHJhbmdlUGlja2VyKHJhbmdlUGlja2VyOiBNYXREYXRlUmFuZ2VQaWNrZXI8RD4pIHtcbiAgICBpZiAocmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuX21vZGVsID0gcmFuZ2VQaWNrZXIuX3JlZ2lzdGVySW5wdXQodGhpcyk7XG4gICAgICB0aGlzLl9yYW5nZVBpY2tlciA9IHJhbmdlUGlja2VyO1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCEpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9yYW5nZVBpY2tlcjogTWF0RGF0ZVJhbmdlUGlja2VyPEQ+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBkYXRlcyB3aXRoaW4gdGhlIGRhdGUgcmFuZ2UgcGlja2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGF0ZUZpbHRlcigpIHsgcmV0dXJuIHRoaXMuX2RhdGVGaWx0ZXI7IH1cbiAgc2V0IGRhdGVGaWx0ZXIodmFsdWU6IERhdGVGaWx0ZXJGbjxEPikge1xuICAgIHRoaXMuX2RhdGVGaWx0ZXIgPSB2YWx1ZTtcbiAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21pbiA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIHRoaXMuX3JldmFsaWRhdGUoKTtcbiAgfVxuICBwcml2YXRlIF9taW46IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21heDsgfVxuICBzZXQgbWF4KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIHRoaXMuX3JldmFsaWRhdGUoKTtcbiAgfVxuICBwcml2YXRlIF9tYXg6IEQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5fc3RhcnRJbnB1dCAmJiB0aGlzLl9lbmRJbnB1dCkgP1xuICAgICAgKHRoaXMuX3N0YXJ0SW5wdXQuZGlzYWJsZWQgJiYgdGhpcy5fZW5kSW5wdXQuZGlzYWJsZWQpIDpcbiAgICAgIHRoaXMuX2dyb3VwRGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9ncm91cERpc2FibGVkKSB7XG4gICAgICB0aGlzLl9ncm91cERpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuICBfZ3JvdXBEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBpbiBhbiBlcnJvciBzdGF0ZS4gKi9cbiAgZ2V0IGVycm9yU3RhdGUoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX3N0YXJ0SW5wdXQgJiYgdGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFydElucHV0LmVycm9yU3RhdGUgfHwgdGhpcy5fZW5kSW5wdXQuZXJyb3JTdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpbnB1dCBpcyBlbXB0eS4gKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHN0YXJ0RW1wdHkgPSB0aGlzLl9zdGFydElucHV0ID8gdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgICBjb25zdCBlbmRFbXB0eSA9IHRoaXMuX2VuZElucHV0ID8gdGhpcy5fZW5kSW5wdXQuaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgcmV0dXJuIHN0YXJ0RW1wdHkgJiYgZW5kRW1wdHk7XG4gIH1cblxuICAvKiogVmFsdWUgZm9yIHRoZSBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dHMuICovXG4gIF9hcmlhRGVzY3JpYmVkQnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBEYXRlIHNlbGVjdGlvbiBtb2RlbCBjdXJyZW50bHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEYXRlUmFuZ2U8RD4+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBTZXBhcmF0b3IgdGV4dCB0byBiZSBzaG93biBiZXR3ZWVuIHRoZSBpbnB1dHMuICovXG4gIEBJbnB1dCgpIHNlcGFyYXRvciA9ICfigJMnO1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZSB0aGF0IHNob3VsZCBiZSBzaG93biBpbiB0aGUgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UgdGhhdCBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uRW5kOiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZChNYXRTdGFydERhdGUpIF9zdGFydElucHV0OiBNYXRTdGFydERhdGU8RD47XG4gIEBDb250ZW50Q2hpbGQoTWF0RW5kRGF0ZSkgX2VuZElucHV0OiBNYXRFbmREYXRlPEQ+O1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBUT0RPKGNyaXNiZXRvKTogY2hhbmdlIHR5cGUgdG8gYEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZWAgYWZ0ZXIgIzE4MjA2IGxhbmRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBuZ0NvbnRyb2w6IE5nQ29udHJvbCB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGlucHV0J3Mgc3RhdGUgY2hhbmdlcy4gKi9cbiAgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgY29udHJvbDogQ29udHJvbENvbnRhaW5lcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfZm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkKSB7XG5cbiAgICBpZiAoIV9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHJlbW92ZSBgYXMgYW55YCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAgdGhpcy5uZ0NvbnRyb2wgPSBjb250cm9sIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZEJ5ID0gaWRzLmxlbmd0aCA/IGlkcy5qb2luKCcgJykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwgfHwgIXRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICB0aGlzLl9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbmRJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXJ0SW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dCBtdXN0IGNvbnRhaW4gYSBtYXRTdGFydERhdGUgaW5wdXQnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2VuZElucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0RW5kRGF0ZSBpbnB1dCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCk7XG4gICAgfVxuXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tIHRoaXMsIGJlY2F1c2Ugd2VcbiAgICAvLyBrbm93IHRoYXQgdGhlIGlucHV0IHN0cmVhbXMgd2lsbCBiZSBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICBtZXJnZSh0aGlzLl9zdGFydElucHV0LnN0YXRlQ2hhbmdlcywgdGhpcy5fZW5kSW5wdXQuc3RhdGVDaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRhdGUgYXQgd2hpY2ggdGhlIGNhbGVuZGFyIHNob3VsZCBzdGFydC4gKi9cbiAgZ2V0U3RhcnRWYWx1ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPyB0aGlzLnZhbHVlLnN0YXJ0IDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIHRoZW1lIHBhbGV0dGUuICovXG4gIGdldFRoZW1lUGFsZXR0ZSgpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuY29sb3IgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZWxlbWVudCB0byB3aGljaCB0aGUgY2FsZW5kYXIgb3ZlcmxheSBzaG91bGQgYmUgYXR0YWNoZWQuICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIHRoYXQgaXMgdXNlZCB0byBtaXJyb3IgdGhlIHN0YXRlIGlucHV0LiAqL1xuICBfZ2V0SW5wdXRNaXJyb3JWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dCA/IHRoaXMuX3N0YXJ0SW5wdXQuZ2V0TWlycm9yVmFsdWUoKSA6ICcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IHBsYWNlaG9sZGVycyBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dCA/ICF0aGlzLl9zdGFydElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIHZhbHVlIGluIG9uZSBvZiB0aGUgY2hpbGQgaW5wdXRzIGNoYW5naW5nLiAqL1xuICBfaGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIF9vcGVuRGF0ZXBpY2tlcigpIHtcbiAgICBpZiAodGhpcy5fcmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuX3JhbmdlUGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2VwYXJhdGUgdGV4dCBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBfc2hvdWxkSGlkZVNlcGFyYXRvcigpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9mb3JtRmllbGQgfHwgdGhpcy5fZm9ybUZpZWxkLl9oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCkpICYmIHRoaXMuZW1wdHk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2dldEFyaWFMYWJlbGxlZGJ5KCkge1xuICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2Zvcm1GaWVsZDtcbiAgICByZXR1cm4gZm9ybUZpZWxkICYmIGZvcm1GaWVsZC5faGFzRmxvYXRpbmdMYWJlbCgpID8gZm9ybUZpZWxkLl9sYWJlbElkIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBSZS1ydW5zIHRoZSB2YWxpZGF0b3JzIG9uIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZXZhbGlkYXRlKCkge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyB0aGUgY3VycmVudCBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=