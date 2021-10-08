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
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/cdk/a11y";
import * as i4 from "@angular/material/form-field";
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
        if (_formField?._elementRef.nativeElement.classList.contains('mat-mdc-form-field')) {
            const classList = _elementRef.nativeElement.classList;
            classList.add('mat-mdc-input-element');
            classList.add('mat-mdc-form-field-input-control');
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
        const start = this._startInput?._getPlaceholder() || '';
        const end = this._endInput?._getPlaceholder() || '';
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
                this._startInput?._onTouched();
                this._endInput?._onTouched();
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
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId() {
        return this._formField ? this._formField.getLabelId() : null;
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
MatDateRangeInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDateRangeInput, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.ControlContainer, optional: true, self: true }, { token: i2.DateAdapter, optional: true }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDateRangeInput.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatDateRangeInput, selector: "mat-date-range-input", inputs: { rangePicker: "rangePicker", required: "required", dateFilter: "dateFilter", min: "min", max: "max", disabled: "disabled", separator: "separator", comparisonStart: "comparisonStart", comparisonEnd: "comparisonEnd" }, host: { attributes: { "role": "group" }, properties: { "class.mat-date-range-input-hide-placeholders": "_shouldHidePlaceholders()", "class.mat-date-range-input-required": "required", "attr.id": "null", "attr.aria-labelledby": "_getAriaLabelledby()", "attr.aria-describedby": "_ariaDescribedBy", "attr.data-mat-calendar": "rangePicker ? rangePicker.id : null" }, classAttribute: "mat-date-range-input" }, providers: [
        { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
        { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
    ], queries: [{ propertyName: "_startInput", first: true, predicate: MatStartDate, descendants: true }, { propertyName: "_endInput", first: true, predicate: MatEndDate, descendants: true }], exportAs: ["matDateRangeInput"], usesOnChanges: true, ngImport: i0, template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-start-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue()}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n  </div>\n</div>\n\n", styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px}.mat-date-range-input-separator-hidden{-webkit-user-select:none;-moz-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{opacity:0}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"], directives: [{ type: i3.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDateRangeInput, decorators: [{
            type: Component,
            args: [{ selector: 'mat-date-range-input', exportAs: 'matDateRangeInput', host: {
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
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [
                        { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
                        { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
                    ], template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-start-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue()}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n  </div>\n</div>\n\n", styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px}.mat-date-range-input-separator-hidden{-webkit-user-select:none;-moz-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{opacity:0}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i4.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }]; }, propDecorators: { rangePicker: [{
                type: Input
            }], required: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], disabled: [{
                type: Input
            }], separator: [{
                type: Input
            }], comparisonStart: [{
                type: Input
            }], comparisonEnd: [{
                type: Input
            }], _startInput: [{
                type: ContentChild,
                args: [MatStartDate]
            }], _endInput: [{
                type: ContentChild,
                args: [MatEndDate]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLWlucHV0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxFQUNWLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9GLE9BQU8sRUFBZSxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFbEQsT0FBTyxFQUFDLHFCQUFxQixFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBRVYsMkJBQTJCLEdBQzVCLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDL0QsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0seUJBQXlCLENBQUM7Ozs7OztBQUk1RSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUEwQnJCLE1BQU0sT0FBTyxpQkFBaUI7SUF1SzVCLFlBQ1Usa0JBQXFDLEVBQ3JDLFdBQW9DLEVBQ3hCLE9BQXlCLEVBQ3pC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QVcsbUJBQW1CLEVBQUM7d0JBQzlELEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsbUJBQW1CLEVBQUM7cUJBQ3ZFOzswQkE0S0UsUUFBUTs7MEJBQUksSUFBSTs7MEJBQ2hCLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsY0FBYzs0Q0F2SWhDLFdBQVc7c0JBRGQsS0FBSztnQkFrQkYsUUFBUTtzQkFEWCxLQUFLO2dCQVNGLFVBQVU7c0JBRGIsS0FBSztnQkFxQkYsR0FBRztzQkFETixLQUFLO2dCQWNGLEdBQUc7c0JBRE4sS0FBSztnQkFjRixRQUFRO3NCQURYLEtBQUs7Z0JBdUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBR0csZUFBZTtzQkFBdkIsS0FBSztnQkFHRyxhQUFhO3NCQUFyQixLQUFLO2dCQUVzQixXQUFXO3NCQUF0QyxZQUFZO3VCQUFDLFlBQVk7Z0JBQ0EsU0FBUztzQkFBbEMsWUFBWTt1QkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE9uRGVzdHJveSxcbiAgQ29udGVudENoaWxkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgU2VsZixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sLCBNYXRGb3JtRmllbGQsIE1BVF9GT1JNX0ZJRUxEfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7VGhlbWVQYWxldHRlLCBEYXRlQWRhcHRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge05nQ29udHJvbCwgQ29udHJvbENvbnRhaW5lcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0LCBtZXJnZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7Rm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5LCBCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBNYXRTdGFydERhdGUsXG4gIE1hdEVuZERhdGUsXG4gIE1hdERhdGVSYW5nZUlucHV0UGFyZW50LFxuICBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQsXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJDb250cm9sLCBNYXREYXRlcGlja2VyUGFuZWx9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7Y3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3J9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHtEYXRlRmlsdGVyRm4sIGRhdGVJbnB1dHNIYXZlQ2hhbmdlZH0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtNYXREYXRlUmFuZ2VQaWNrZXJJbnB1dH0gZnJvbSAnLi9kYXRlLXJhbmdlLXBpY2tlcic7XG5pbXBvcnQge0RhdGVSYW5nZSwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlLXJhbmdlLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRlLXJhbmdlLWlucHV0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGF0ZS1yYW5nZS1pbnB1dC5jc3MnXSxcbiAgZXhwb3J0QXM6ICdtYXREYXRlUmFuZ2VJbnB1dCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQnLFxuICAgICdbY2xhc3MubWF0LWRhdGUtcmFuZ2UtaW5wdXQtaGlkZS1wbGFjZWhvbGRlcnNdJzogJ19zaG91bGRIaWRlUGxhY2Vob2xkZXJzKCknLFxuICAgICdbY2xhc3MubWF0LWRhdGUtcmFuZ2UtaW5wdXQtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2F0dHIuaWRdJzogJ251bGwnLFxuICAgICdyb2xlJzogJ2dyb3VwJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfZ2V0QXJpYUxhYmVsbGVkYnkoKScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkQnknLFxuICAgIC8vIFVzZWQgYnkgdGhlIHRlc3QgaGFybmVzcyB0byB0aWUgdGhpcyBpbnB1dCB0byBpdHMgY2FsZW5kYXIuIFdlIGNhbid0IGRlcGVuZCBvblxuICAgIC8vIGBhcmlhLW93bnNgIGZvciB0aGlzLCBiZWNhdXNlIGl0J3Mgb25seSBkZWZpbmVkIHdoaWxlIHRoZSBjYWxlbmRhciBpcyBvcGVuLlxuICAgICdbYXR0ci5kYXRhLW1hdC1jYWxlbmRhcl0nOiAncmFuZ2VQaWNrZXIgPyByYW5nZVBpY2tlci5pZCA6IG51bGwnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VJbnB1dH0sXG4gICAge3Byb3ZpZGU6IE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCwgdXNlRXhpc3Rpbmc6IE1hdERhdGVSYW5nZUlucHV0fSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dDxEPiBpbXBsZW1lbnRzIE1hdEZvcm1GaWVsZENvbnRyb2w8RGF0ZVJhbmdlPEQ+PixcbiAgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LCBNYXREYXRlUmFuZ2VQaWNrZXJJbnB1dDxEPixcbiAgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9jbG9zZWRTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBpbnB1dC4gKi9cbiAgaWQgPSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIGZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCdzIGxhYmVsIHNob3VsZCBmbG9hdC4gKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIC8qKiBOYW1lIG9mIHRoZSBmb3JtIGNvbnRyb2wuICovXG4gIGNvbnRyb2xUeXBlID0gJ21hdC1kYXRlLXJhbmdlLWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogU2V0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb24gYG1hdFN0YXJ0RGF0ZWAgYW5kIGBtYXRFbmREYXRlYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fc3RhcnRJbnB1dD8uX2dldFBsYWNlaG9sZGVyKCkgfHwgJyc7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZW5kSW5wdXQ/Ll9nZXRQbGFjZWhvbGRlcigpIHx8ICcnO1xuICAgIHJldHVybiAoc3RhcnQgfHwgZW5kKSA/IGAke3N0YXJ0fSAke3RoaXMuc2VwYXJhdG9yfSAke2VuZH1gIDogJyc7XG4gIH1cblxuICAvKiogVGhlIHJhbmdlIHBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmFuZ2VQaWNrZXIoKSB7IHJldHVybiB0aGlzLl9yYW5nZVBpY2tlcjsgfVxuICBzZXQgcmFuZ2VQaWNrZXIocmFuZ2VQaWNrZXI6IE1hdERhdGVwaWNrZXJQYW5lbDxNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgRGF0ZVJhbmdlPEQ+LCBEPikge1xuICAgIGlmIChyYW5nZVBpY2tlcikge1xuICAgICAgdGhpcy5fbW9kZWwgPSByYW5nZVBpY2tlci5yZWdpc3RlcklucHV0KHRoaXMpO1xuICAgICAgdGhpcy5fcmFuZ2VQaWNrZXIgPSByYW5nZVBpY2tlcjtcbiAgICAgIHRoaXMuX2Nsb3NlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fY2xvc2VkU3Vic2NyaXB0aW9uID0gcmFuZ2VQaWNrZXIuY2xvc2VkU3RyZWFtLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXJ0SW5wdXQ/Ll9vblRvdWNoZWQoKTtcbiAgICAgICAgdGhpcy5fZW5kSW5wdXQ/Ll9vblRvdWNoZWQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCEpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9yYW5nZVBpY2tlcjogTWF0RGF0ZXBpY2tlclBhbmVsPE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBEYXRlUmFuZ2U8RD4sIEQ+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBkYXRlcyB3aXRoaW4gdGhlIGRhdGUgcmFuZ2UgcGlja2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGF0ZUZpbHRlcigpIHsgcmV0dXJuIHRoaXMuX2RhdGVGaWx0ZXI7IH1cbiAgc2V0IGRhdGVGaWx0ZXIodmFsdWU6IERhdGVGaWx0ZXJGbjxEPikge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fc3RhcnRJbnB1dDtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9lbmRJbnB1dDtcbiAgICBjb25zdCB3YXNNYXRjaGluZ1N0YXJ0ID0gc3RhcnQgJiYgc3RhcnQuX21hdGNoZXNGaWx0ZXIoc3RhcnQudmFsdWUpO1xuICAgIGNvbnN0IHdhc01hdGNoaW5nRW5kID0gZW5kICYmIGVuZC5fbWF0Y2hlc0ZpbHRlcihzdGFydC52YWx1ZSk7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IHZhbHVlO1xuXG4gICAgaWYgKHN0YXJ0ICYmIHN0YXJ0Ll9tYXRjaGVzRmlsdGVyKHN0YXJ0LnZhbHVlKSAhPT0gd2FzTWF0Y2hpbmdTdGFydCkge1xuICAgICAgc3RhcnQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgaWYgKGVuZCAmJiBlbmQuX21hdGNoZXNGaWx0ZXIoZW5kLnZhbHVlKSAhPT0gd2FzTWF0Y2hpbmdFbmQpIHtcbiAgICAgIGVuZC5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IEQgfCBudWxsIHsgcmV0dXJuIHRoaXMuX21pbjsgfVxuICBzZXQgbWluKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIGNvbnN0IHZhbGlkVmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcblxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUodmFsaWRWYWx1ZSwgdGhpcy5fbWluKSkge1xuICAgICAgdGhpcy5fbWluID0gdmFsaWRWYWx1ZTtcbiAgICAgIHRoaXMuX3JldmFsaWRhdGUoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBjb25zdCB2YWxpZFZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbGlkVmFsdWUsIHRoaXMuX21heCkpIHtcbiAgICAgIHRoaXMuX21heCA9IHZhbGlkVmFsdWU7XG4gICAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0KSA/XG4gICAgICAodGhpcy5fc3RhcnRJbnB1dC5kaXNhYmxlZCAmJiB0aGlzLl9lbmRJbnB1dC5kaXNhYmxlZCkgOlxuICAgICAgdGhpcy5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2dyb3VwRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2dyb3VwRGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cbiAgX2dyb3VwRGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgaW4gYW4gZXJyb3Igc3RhdGUuICovXG4gIGdldCBlcnJvclN0YXRlKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dC5lcnJvclN0YXRlIHx8IHRoaXMuX2VuZElucHV0LmVycm9yU3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaW5wdXQgaXMgZW1wdHkuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFydEVtcHR5ID0gdGhpcy5fc3RhcnRJbnB1dCA/IHRoaXMuX3N0YXJ0SW5wdXQuaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgY29uc3QgZW5kRW1wdHkgPSB0aGlzLl9lbmRJbnB1dCA/IHRoaXMuX2VuZElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIHJldHVybiBzdGFydEVtcHR5ICYmIGVuZEVtcHR5O1xuICB9XG5cbiAgLyoqIFZhbHVlIGZvciB0aGUgYGFyaWEtZGVzY3JpYmVkYnlgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXRzLiAqL1xuICBfYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogRGF0ZSBzZWxlY3Rpb24gbW9kZWwgY3VycmVudGx5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByaXZhdGUgX21vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+PiB8IHVuZGVmaW5lZDtcblxuICAvKiogU2VwYXJhdG9yIHRleHQgdG8gYmUgc2hvd24gYmV0d2VlbiB0aGUgaW5wdXRzLiAqL1xuICBASW5wdXQoKSBzZXBhcmF0b3IgPSAn4oCTJztcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UgdGhhdCBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlIHRoYXQgc2hvdWxkIGJlIHNob3duIGluIHRoZSBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogRCB8IG51bGwgPSBudWxsO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0U3RhcnREYXRlKSBfc3RhcnRJbnB1dDogTWF0U3RhcnREYXRlPEQ+O1xuICBAQ29udGVudENoaWxkKE1hdEVuZERhdGUpIF9lbmRJbnB1dDogTWF0RW5kRGF0ZTxEPjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogVE9ETyhjcmlzYmV0byk6IGNoYW5nZSB0eXBlIHRvIGBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmVgIGFmdGVyICMxODIwNiBsYW5kcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2wgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBpbnB1dCdzIHN0YXRlIGhhcyBjaGFuZ2VkLiAqL1xuICByZWFkb25seSBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIGNvbnRyb2w6IENvbnRyb2xDb250YWluZXIsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIHByaXZhdGUgX2Zvcm1GaWVsZD86IE1hdEZvcm1GaWVsZCkge1xuXG4gICAgaWYgKCFfZGF0ZUFkYXB0ZXIgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIC8vIFRoZSBkYXRlcGlja2VyIG1vZHVsZSBjYW4gYmUgdXNlZCBib3RoIHdpdGggTURDIGFuZCBub24tTURDIGZvcm0gZmllbGRzLiBXZSBoYXZlXG4gICAgLy8gdG8gY29uZGl0aW9uYWxseSBhZGQgdGhlIE1EQyBpbnB1dCBjbGFzcyBzbyB0aGF0IHRoZSByYW5nZSBwaWNrZXIgbG9va3MgY29ycmVjdGx5LlxuICAgIGlmIChfZm9ybUZpZWxkPy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF0LW1kYy1mb3JtLWZpZWxkJykpIHtcbiAgICAgIGNvbnN0IGNsYXNzTGlzdCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1pbnB1dC1lbGVtZW50Jyk7XG4gICAgICBjbGFzc0xpc3QuYWRkKCdtYXQtbWRjLWZvcm0tZmllbGQtaW5wdXQtY29udHJvbCcpO1xuICAgIH1cblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiByZW1vdmUgYGFzIGFueWAgYWZ0ZXIgIzE4MjA2IGxhbmRzLlxuICAgIHRoaXMubmdDb250cm9sID0gY29udHJvbCBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZWRCeSA9IGlkcy5sZW5ndGggPyBpZHMuam9pbignICcpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5mb2N1c2VkICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAoIXRoaXMuX21vZGVsIHx8ICF0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRJbnB1dC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZW5kSW5wdXQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICAgIHRocm93IEVycm9yKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dCBtdXN0IGNvbnRhaW4gYSBtYXRTdGFydERhdGUgaW5wdXQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0RW5kRGF0ZSBpbnB1dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCk7XG4gICAgfVxuXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tIHRoaXMsIGJlY2F1c2Ugd2VcbiAgICAvLyBrbm93IHRoYXQgdGhlIGlucHV0IHN0cmVhbXMgd2lsbCBiZSBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICBtZXJnZSh0aGlzLl9zdGFydElucHV0LnN0YXRlQ2hhbmdlcywgdGhpcy5fZW5kSW5wdXQuc3RhdGVDaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChkYXRlSW5wdXRzSGF2ZUNoYW5nZWQoY2hhbmdlcywgdGhpcy5fZGF0ZUFkYXB0ZXIpKSB7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY2xvc2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGF0IHdoaWNoIHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQuICovXG4gIGdldFN0YXJ0VmFsdWUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5zdGFydCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyB0aGVtZSBwYWxldHRlLiAqL1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmNvbG9yIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNhbGVuZGFyIG92ZXJsYXkgc2hvdWxkIGJlIGF0dGFjaGVkLiAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBJRCBvZiBhbiBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHVzZWQgYSBkZXNjcmlwdGlvbiBmb3IgdGhlIGNhbGVuZGFyIG92ZXJsYXkuICovXG4gIGdldE92ZXJsYXlMYWJlbElkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0TGFiZWxJZCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IGlzIHVzZWQgdG8gbWlycm9yIHRoZSBzdGF0ZSBpbnB1dC4gKi9cbiAgX2dldElucHV0TWlycm9yVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmdldE1pcnJvclZhbHVlKCkgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBwbGFjZWhvbGRlcnMgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyAhdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSB2YWx1ZSBpbiBvbmUgb2YgdGhlIGNoaWxkIGlucHV0cyBjaGFuZ2luZy4gKi9cbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlIHJhbmdlIHBpY2tlciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBfb3BlbkRhdGVwaWNrZXIoKSB7XG4gICAgaWYgKHRoaXMuX3JhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLl9yYW5nZVBpY2tlci5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlcGFyYXRlIHRleHQgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVTZXBhcmF0b3IoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fZm9ybUZpZWxkIHx8ICh0aGlzLl9mb3JtRmllbGQuZ2V0TGFiZWxJZCgpICYmXG4gICAgICAhdGhpcy5fZm9ybUZpZWxkLl9zaG91bGRMYWJlbEZsb2F0KCkpKSAmJiB0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dHMuICovXG4gIF9nZXRBcmlhTGFiZWxsZWRieSgpIHtcbiAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQ7XG4gICAgcmV0dXJuIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQuX2hhc0Zsb2F0aW5nTGFiZWwoKSA/IGZvcm1GaWVsZC5fbGFiZWxJZCA6IG51bGw7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF91cGRhdGVGb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luKSB7XG4gICAgdGhpcy5mb2N1c2VkID0gb3JpZ2luICE9PSBudWxsO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBSZS1ydW5zIHRoZSB2YWxpZGF0b3JzIG9uIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZXZhbGlkYXRlKCkge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyB0aGUgY3VycmVudCBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iLCI8ZGl2XG4gIGNsYXNzPVwibWF0LWRhdGUtcmFuZ2UtaW5wdXQtY29udGFpbmVyXCJcbiAgY2RrTW9uaXRvclN1YnRyZWVGb2N1c1xuICAoY2RrRm9jdXNDaGFuZ2UpPVwiX3VwZGF0ZUZvY3VzKCRldmVudClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1kYXRlLXJhbmdlLWlucHV0LXN0YXJ0LXdyYXBwZXJcIj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpbnB1dFttYXRTdGFydERhdGVdXCI+PC9uZy1jb250ZW50PlxuICAgIDxzcGFuXG4gICAgICBjbGFzcz1cIm1hdC1kYXRlLXJhbmdlLWlucHV0LW1pcnJvclwiXG4gICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj57e19nZXRJbnB1dE1pcnJvclZhbHVlKCl9fTwvc3Bhbj5cbiAgPC9kaXY+XG5cbiAgPHNwYW5cbiAgICBjbGFzcz1cIm1hdC1kYXRlLXJhbmdlLWlucHV0LXNlcGFyYXRvclwiXG4gICAgW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LXNlcGFyYXRvci1oaWRkZW5dPVwiX3Nob3VsZEhpZGVTZXBhcmF0b3IoKVwiPnt7c2VwYXJhdG9yfX08L3NwYW4+XG5cbiAgPGRpdiBjbGFzcz1cIm1hdC1kYXRlLXJhbmdlLWlucHV0LWVuZC13cmFwcGVyXCI+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaW5wdXRbbWF0RW5kRGF0ZV1cIj48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbiJdfQ==