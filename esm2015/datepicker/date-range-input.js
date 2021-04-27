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
import { Subject, merge, Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatStartDate, MatEndDate, MAT_DATE_RANGE_INPUT_PARENT, } from './date-range-input-parts';
import { createMissingDateImplError } from './datepicker-errors';
import { dateInputsHaveChanged } from './datepicker-input-base';
let nextUniqueId = 0;
export class MatDateRangeInput {
    constructor(_changeDetectorRef, _elementRef, control, _dateAdapter, _formField) {
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._formField = _formField;
        this._closedSubscription = Subscription.EMPTY;
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
        /** Emits when the input's state has changed. */
        this.stateChanges = new Subject();
        if (!_dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw createMissingDateImplError('DateAdapter');
        }
        // The datepicker module can be used both with MDC and non-MDC form fields. We have
        // to conditionally add the MDC input class so that the range picker looks correctly.
        if (_formField === null || _formField === void 0 ? void 0 : _formField._elementRef.nativeElement.classList.contains('mat-mdc-form-field')) {
            _elementRef.nativeElement.classList.add('mat-mdc-input-element');
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
            this._model = rangePicker.registerInput(this);
            this._rangePicker = rangePicker;
            this._closedSubscription.unsubscribe();
            this._closedSubscription = rangePicker.closedStream.subscribe(() => {
                var _a, _b;
                (_a = this._startInput) === null || _a === void 0 ? void 0 : _a._onTouched();
                (_b = this._endInput) === null || _b === void 0 ? void 0 : _b._onTouched();
            });
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
        const start = this._startInput;
        const end = this._endInput;
        const wasMatchingStart = start && start._matchesFilter(start.value);
        const wasMatchingEnd = end && end._matchesFilter(start.value);
        this._dateFilter = value;
        if (start && start._matchesFilter(start.value) !== wasMatchingStart) {
            start._validatorOnChange();
        }
        if (end && end._matchesFilter(end.value) !== wasMatchingEnd) {
            end._validatorOnChange();
        }
    }
    /** The minimum valid date. */
    get min() { return this._min; }
    set min(value) {
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._min)) {
            this._min = validValue;
            this._revalidate();
        }
    }
    /** The maximum valid date. */
    get max() { return this._max; }
    set max(value) {
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._max)) {
            this._max = validValue;
            this._revalidate();
        }
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
            this.stateChanges.next(undefined);
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
            this.stateChanges.next(undefined);
        });
    }
    ngOnChanges(changes) {
        if (dateInputsHaveChanged(changes, this._dateAdapter)) {
            this.stateChanges.next(undefined);
        }
    }
    ngOnDestroy() {
        this._closedSubscription.unsubscribe();
        this.stateChanges.complete();
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
        return (!this._formField || (this._formField.getLabelId() &&
            !this._formField._shouldLabelFloat())) && this.empty;
    }
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby() {
        const formField = this._formField;
        return formField && formField._hasFloatingLabel() ? formField._labelId : null;
    }
    /** Updates the focused state of the range input. */
    _updateFocus(origin) {
        this.focused = origin !== null;
        this.stateChanges.next();
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
                template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-start-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue()}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n  </div>\n</div>\n\n",
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
                styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px}.mat-date-range-input-separator-hidden{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner::-ms-clear,.mat-date-range-input-inner::-ms-reveal{display:none}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxFQUNWLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9GLE9BQU8sRUFBZSxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFbEQsT0FBTyxFQUFDLHFCQUFxQixFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBRVYsMkJBQTJCLEdBQzVCLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDL0QsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFJNUUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBMEJyQixNQUFNLE9BQU8saUJBQWlCO0lBdUs1QixZQUNVLGtCQUFxQyxFQUNyQyxXQUFvQyxFQUN4QixPQUF5QixFQUN6QixZQUE0QixFQUNKLFVBQXlCO1FBSjdELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsZ0JBQVcsR0FBWCxXQUFX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KlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBPbkRlc3Ryb3ksXG4gIENvbnRlbnRDaGlsZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFNlbGYsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbCwgTWF0Rm9ybUZpZWxkLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1RoZW1lUGFsZXR0ZSwgRGF0ZUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtOZ0NvbnRyb2wsIENvbnRyb2xDb250YWluZXJ9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdCwgbWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0ZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgQm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgTWF0U3RhcnREYXRlLFxuICBNYXRFbmREYXRlLFxuICBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudCxcbiAgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5ULFxufSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQ29udHJvbCwgTWF0RGF0ZXBpY2tlclBhbmVsfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7RGF0ZUZpbHRlckZuLCBkYXRlSW5wdXRzSGF2ZUNoYW5nZWR9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7TWF0RGF0ZVJhbmdlUGlja2VySW5wdXR9IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXInO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZS1yYW5nZS1pbnB1dC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcmFuZ2UtaW5wdXQuY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZVJhbmdlSW5wdXQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0JyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LWhpZGUtcGxhY2Vob2xkZXJzXSc6ICdfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpJyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1thdHRyLmlkXSc6ICdudWxsJyxcbiAgICAncm9sZSc6ICdncm91cCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2dldEFyaWFMYWJlbGxlZGJ5KCknLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAvLyBVc2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgdG8gdGllIHRoaXMgaW5wdXQgdG8gaXRzIGNhbGVuZGFyLiBXZSBjYW4ndCBkZXBlbmQgb25cbiAgICAvLyBgYXJpYS1vd25zYCBmb3IgdGhpcywgYmVjYXVzZSBpdCdzIG9ubHkgZGVmaW5lZCB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi5cbiAgICAnW2F0dHIuZGF0YS1tYXQtY2FsZW5kYXJdJzogJ3JhbmdlUGlja2VyID8gcmFuZ2VQaWNrZXIuaWQgOiBudWxsJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0RGF0ZVJhbmdlSW5wdXR9LFxuICAgIHtwcm92aWRlOiBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VJbnB1dH0sXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXQ8RD4gaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPERhdGVSYW5nZTxEPj4sXG4gIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPiwgTWF0RGF0ZVJhbmdlUGlja2VySW5wdXQ8RD4sXG4gIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfY2xvc2VkU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDdXJyZW50IHZhbHVlIG9mIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbCA/IHRoaXMuX21vZGVsLnNlbGVjdGlvbiA6IG51bGw7XG4gIH1cblxuICAvKiogVW5pcXVlIElEIGZvciB0aGUgaW5wdXQuICovXG4gIGlkID0gYG1hdC1kYXRlLXJhbmdlLWlucHV0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBmb2N1c2VkLiAqL1xuICBmb2N1c2VkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wncyBsYWJlbCBzaG91bGQgZmxvYXQuICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgIXRoaXMuZW1wdHk7XG4gIH1cblxuICAvKiogTmFtZSBvZiB0aGUgZm9ybSBjb250cm9sLiAqL1xuICBjb250cm9sVHlwZSA9ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIFNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG9uIGBtYXRTdGFydERhdGVgIGFuZCBgbWF0RW5kRGF0ZWAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBwbGFjZWhvbGRlcigpIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX3N0YXJ0SW5wdXQ/Ll9nZXRQbGFjZWhvbGRlcigpIHx8ICcnO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuX2VuZElucHV0Py5fZ2V0UGxhY2Vob2xkZXIoKSB8fCAnJztcbiAgICByZXR1cm4gKHN0YXJ0IHx8IGVuZCkgPyBgJHtzdGFydH0gJHt0aGlzLnNlcGFyYXRvcn0gJHtlbmR9YCA6ICcnO1xuICB9XG5cbiAgLyoqIFRoZSByYW5nZSBwaWNrZXIgdGhhdCB0aGlzIGlucHV0IGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJhbmdlUGlja2VyKCkgeyByZXR1cm4gdGhpcy5fcmFuZ2VQaWNrZXI7IH1cbiAgc2V0IHJhbmdlUGlja2VyKHJhbmdlUGlja2VyOiBNYXREYXRlcGlja2VyUGFuZWw8TWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIERhdGVSYW5nZTxEPiwgRD4pIHtcbiAgICBpZiAocmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuX21vZGVsID0gcmFuZ2VQaWNrZXIucmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICAgIHRoaXMuX3JhbmdlUGlja2VyID0gcmFuZ2VQaWNrZXI7XG4gICAgICB0aGlzLl9jbG9zZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX2Nsb3NlZFN1YnNjcmlwdGlvbiA9IHJhbmdlUGlja2VyLmNsb3NlZFN0cmVhbS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9zdGFydElucHV0Py5fb25Ub3VjaGVkKCk7XG4gICAgICAgIHRoaXMuX2VuZElucHV0Py5fb25Ub3VjaGVkKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwodGhpcy5fbW9kZWwhKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcmFuZ2VQaWNrZXI6IE1hdERhdGVwaWNrZXJQYW5lbDxNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgRGF0ZVJhbmdlPEQ+LCBEPjtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbHRlciBvdXQgZGF0ZXMgd2l0aGluIHRoZSBkYXRlIHJhbmdlIHBpY2tlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRhdGVGaWx0ZXIoKSB7IHJldHVybiB0aGlzLl9kYXRlRmlsdGVyOyB9XG4gIHNldCBkYXRlRmlsdGVyKHZhbHVlOiBEYXRlRmlsdGVyRm48RD4pIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX3N0YXJ0SW5wdXQ7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZW5kSW5wdXQ7XG4gICAgY29uc3Qgd2FzTWF0Y2hpbmdTdGFydCA9IHN0YXJ0ICYmIHN0YXJ0Ll9tYXRjaGVzRmlsdGVyKHN0YXJ0LnZhbHVlKTtcbiAgICBjb25zdCB3YXNNYXRjaGluZ0VuZCA9IGVuZCAmJiBlbmQuX21hdGNoZXNGaWx0ZXIoc3RhcnQudmFsdWUpO1xuICAgIHRoaXMuX2RhdGVGaWx0ZXIgPSB2YWx1ZTtcblxuICAgIGlmIChzdGFydCAmJiBzdGFydC5fbWF0Y2hlc0ZpbHRlcihzdGFydC52YWx1ZSkgIT09IHdhc01hdGNoaW5nU3RhcnQpIHtcbiAgICAgIHN0YXJ0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmIChlbmQgJiYgZW5kLl9tYXRjaGVzRmlsdGVyKGVuZC52YWx1ZSkgIT09IHdhc01hdGNoaW5nRW5kKSB7XG4gICAgICBlbmQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2RhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbigpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9taW47IH1cbiAgc2V0IG1pbih2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBjb25zdCB2YWxpZFZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbGlkVmFsdWUsIHRoaXMuX21pbikpIHtcbiAgICAgIHRoaXMuX21pbiA9IHZhbGlkVmFsdWU7XG4gICAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21pbjogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWF4OyB9XG4gIHNldCBtYXgodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgY29uc3QgdmFsaWRWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWxpZFZhbHVlLCB0aGlzLl9tYXgpKSB7XG4gICAgICB0aGlzLl9tYXggPSB2YWxpZFZhbHVlO1xuICAgICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9tYXg6IEQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5fc3RhcnRJbnB1dCAmJiB0aGlzLl9lbmRJbnB1dCkgP1xuICAgICAgKHRoaXMuX3N0YXJ0SW5wdXQuZGlzYWJsZWQgJiYgdGhpcy5fZW5kSW5wdXQuZGlzYWJsZWQpIDpcbiAgICAgIHRoaXMuX2dyb3VwRGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9ncm91cERpc2FibGVkKSB7XG4gICAgICB0aGlzLl9ncm91cERpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG4gIF9ncm91cERpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICBnZXQgZXJyb3JTdGF0ZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fc3RhcnRJbnB1dCAmJiB0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQuZXJyb3JTdGF0ZSB8fCB0aGlzLl9lbmRJbnB1dC5lcnJvclN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlucHV0IGlzIGVtcHR5LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc3RhcnRFbXB0eSA9IHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIGNvbnN0IGVuZEVtcHR5ID0gdGhpcy5fZW5kSW5wdXQgPyB0aGlzLl9lbmRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgICByZXR1cm4gc3RhcnRFbXB0eSAmJiBlbmRFbXB0eTtcbiAgfVxuXG4gIC8qKiBWYWx1ZSBmb3IgdGhlIGBhcmlhLWRlc2NyaWJlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2FyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIERhdGUgc2VsZWN0aW9uIG1vZGVsIGN1cnJlbnRseSByZWdpc3RlcmVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPj4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFNlcGFyYXRvciB0ZXh0IHRvIGJlIHNob3duIGJldHdlZW4gdGhlIGlucHV0cy4gKi9cbiAgQElucHV0KCkgc2VwYXJhdG9yID0gJ+KAkyc7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlIHRoYXQgc2hvdWxkIGJlIHNob3duIGluIHRoZSBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZSB0aGF0IHNob3VsZCBiZSBzaG93biBpbiB0aGUgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsID0gbnVsbDtcblxuICBAQ29udGVudENoaWxkKE1hdFN0YXJ0RGF0ZSkgX3N0YXJ0SW5wdXQ6IE1hdFN0YXJ0RGF0ZTxEPjtcbiAgQENvbnRlbnRDaGlsZChNYXRFbmREYXRlKSBfZW5kSW5wdXQ6IE1hdEVuZERhdGU8RD47XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIFRPRE8oY3Jpc2JldG8pOiBjaGFuZ2UgdHlwZSB0byBgQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlYCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG5nQ29udHJvbDogTmdDb250cm9sIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgaW5wdXQncyBzdGF0ZSBoYXMgY2hhbmdlZC4gKi9cbiAgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBjb250cm9sOiBDb250cm9sQ29udGFpbmVyLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcml2YXRlIF9mb3JtRmllbGQ/OiBNYXRGb3JtRmllbGQpIHtcblxuICAgIGlmICghX2RhdGVBZGFwdGVyICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignRGF0ZUFkYXB0ZXInKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGF0ZXBpY2tlciBtb2R1bGUgY2FuIGJlIHVzZWQgYm90aCB3aXRoIE1EQyBhbmQgbm9uLU1EQyBmb3JtIGZpZWxkcy4gV2UgaGF2ZVxuICAgIC8vIHRvIGNvbmRpdGlvbmFsbHkgYWRkIHRoZSBNREMgaW5wdXQgY2xhc3Mgc28gdGhhdCB0aGUgcmFuZ2UgcGlja2VyIGxvb2tzIGNvcnJlY3RseS5cbiAgICBpZiAoX2Zvcm1GaWVsZD8uX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1tZGMtZm9ybS1maWVsZCcpKSB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtaW5wdXQtZWxlbWVudCcpO1xuICAgIH1cblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiByZW1vdmUgYGFzIGFueWAgYWZ0ZXIgIzE4MjA2IGxhbmRzLlxuICAgIHRoaXMubmdDb250cm9sID0gY29udHJvbCBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZWRCeSA9IGlkcy5sZW5ndGggPyBpZHMuam9pbignICcpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5mb2N1c2VkICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAoIXRoaXMuX21vZGVsIHx8ICF0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRJbnB1dC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZW5kSW5wdXQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICAgIHRocm93IEVycm9yKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dCBtdXN0IGNvbnRhaW4gYSBtYXRTdGFydERhdGUgaW5wdXQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0RW5kRGF0ZSBpbnB1dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCk7XG4gICAgfVxuXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tIHRoaXMsIGJlY2F1c2Ugd2VcbiAgICAvLyBrbm93IHRoYXQgdGhlIGlucHV0IHN0cmVhbXMgd2lsbCBiZSBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICBtZXJnZSh0aGlzLl9zdGFydElucHV0LnN0YXRlQ2hhbmdlcywgdGhpcy5fZW5kSW5wdXQuc3RhdGVDaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChkYXRlSW5wdXRzSGF2ZUNoYW5nZWQoY2hhbmdlcywgdGhpcy5fZGF0ZUFkYXB0ZXIpKSB7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY2xvc2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGF0IHdoaWNoIHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQuICovXG4gIGdldFN0YXJ0VmFsdWUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5zdGFydCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyB0aGVtZSBwYWxldHRlLiAqL1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmNvbG9yIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNhbGVuZGFyIG92ZXJsYXkgc2hvdWxkIGJlIGF0dGFjaGVkLiAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IGlzIHVzZWQgdG8gbWlycm9yIHRoZSBzdGF0ZSBpbnB1dC4gKi9cbiAgX2dldElucHV0TWlycm9yVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmdldE1pcnJvclZhbHVlKCkgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBwbGFjZWhvbGRlcnMgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyAhdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSB2YWx1ZSBpbiBvbmUgb2YgdGhlIGNoaWxkIGlucHV0cyBjaGFuZ2luZy4gKi9cbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlIHJhbmdlIHBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBfb3BlbkRhdGVwaWNrZXIoKSB7XG4gICAgaWYgKHRoaXMuX3JhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLl9yYW5nZVBpY2tlci5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlcGFyYXRlIHRleHQgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVTZXBhcmF0b3IoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fZm9ybUZpZWxkIHx8ICh0aGlzLl9mb3JtRmllbGQuZ2V0TGFiZWxJZCgpICYmXG4gICAgICAhdGhpcy5fZm9ybUZpZWxkLl9zaG91bGRMYWJlbEZsb2F0KCkpKSAmJiB0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dHMuICovXG4gIF9nZXRBcmlhTGFiZWxsZWRieSgpIHtcbiAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQ7XG4gICAgcmV0dXJuIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQuX2hhc0Zsb2F0aW5nTGFiZWwoKSA/IGZvcm1GaWVsZC5fbGFiZWxJZCA6IG51bGw7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF91cGRhdGVGb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luKSB7XG4gICAgdGhpcy5mb2N1c2VkID0gb3JpZ2luICE9PSBudWxsO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBSZS1ydW5zIHRoZSB2YWxpZGF0b3JzIG9uIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZXZhbGlkYXRlKCkge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyB0aGUgY3VycmVudCBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=