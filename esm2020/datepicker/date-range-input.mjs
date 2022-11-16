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
        /** Unique ID for the group. */
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
        return start || end ? `${start} ${this.separator} ${end}` : '';
    }
    /** The range picker that this input is associated with. */
    get rangePicker() {
        return this._rangePicker;
    }
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
    get required() {
        return !!this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /** Function that can be used to filter out dates within the date range picker. */
    get dateFilter() {
        return this._dateFilter;
    }
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
    get min() {
        return this._min;
    }
    set min(value) {
        const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        if (!this._dateAdapter.sameDate(validValue, this._min)) {
            this._min = validValue;
            this._revalidate();
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
            this._revalidate();
        }
    }
    /** Whether the input is disabled. */
    get disabled() {
        return this._startInput && this._endInput
            ? this._startInput.disabled && this._endInput.disabled
            : this._groupDisabled;
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
    _getInputMirrorValue(part) {
        const input = part === 'start' ? this._startInput : this._endInput;
        return input ? input.getMirrorValue() : '';
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
        return ((!this._formField ||
            (this._formField.getLabelId() && !this._formField._shouldLabelFloat())) &&
            this.empty);
    }
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby() {
        const formField = this._formField;
        return formField && formField._hasFloatingLabel() ? formField._labelId : null;
    }
    _getStartDateAccessibleName() {
        return this._startInput._getAccessibleName();
    }
    _getEndDateAccessibleName() {
        return this._endInput._getAccessibleName();
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
MatDateRangeInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0-rc.1", ngImport: i0, type: MatDateRangeInput, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.ControlContainer, optional: true, self: true }, { token: i2.DateAdapter, optional: true }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDateRangeInput.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0-rc.1", type: MatDateRangeInput, selector: "mat-date-range-input", inputs: { rangePicker: "rangePicker", required: "required", dateFilter: "dateFilter", min: "min", max: "max", disabled: "disabled", separator: "separator", comparisonStart: "comparisonStart", comparisonEnd: "comparisonEnd" }, host: { attributes: { "role": "group" }, properties: { "class.mat-date-range-input-hide-placeholders": "_shouldHidePlaceholders()", "class.mat-date-range-input-required": "required", "attr.id": "id", "attr.aria-labelledby": "_getAriaLabelledby()", "attr.aria-describedby": "_ariaDescribedBy", "attr.data-mat-calendar": "rangePicker ? rangePicker.id : null" }, classAttribute: "mat-date-range-input" }, providers: [
        { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
        { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
    ], queries: [{ propertyName: "_startInput", first: true, predicate: MatStartDate, descendants: true }, { propertyName: "_endInput", first: true, predicate: MatEndDate, descendants: true }], exportAs: ["matDateRangeInput"], usesOnChanges: true, ngImport: i0, template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('start')}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-wrapper mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('end')}}</span>\n  </div>\n</div>\n\n", styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px}._mat-animation-noopable .mat-date-range-input-separator{transition:none}.mat-date-range-input-separator-hidden{-webkit-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-end-wrapper{flex-grow:1}.mat-date-range-input-inner{position:absolute;top:0;left:0;font:inherit;background:rgba(0,0,0,0);color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%;height:100%}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{opacity:0}._mat-animation-noopable .mat-date-range-input-inner::placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-moz-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-webkit-input-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner:-ms-input-placeholder{transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-mdc-form-field-type-mat-date-range-input .mat-mdc-form-field-infix{width:200px}"], dependencies: [{ kind: "directive", type: i3.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0-rc.1", ngImport: i0, type: MatDateRangeInput, decorators: [{
            type: Component,
            args: [{ selector: 'mat-date-range-input', exportAs: 'matDateRangeInput', host: {
                        'class': 'mat-date-range-input',
                        '[class.mat-date-range-input-hide-placeholders]': '_shouldHidePlaceholders()',
                        '[class.mat-date-range-input-required]': 'required',
                        '[attr.id]': 'id',
                        'role': 'group',
                        '[attr.aria-labelledby]': '_getAriaLabelledby()',
                        '[attr.aria-describedby]': '_ariaDescribedBy',
                        // Used by the test harness to tie this input to its calendar. We can't depend on
                        // `aria-owns` for this, because it's only defined while the calendar is open.
                        '[attr.data-mat-calendar]': 'rangePicker ? rangePicker.id : null',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [
                        { provide: MatFormFieldControl, useExisting: MatDateRangeInput },
                        { provide: MAT_DATE_RANGE_INPUT_PARENT, useExisting: MatDateRangeInput },
                    ], template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('start')}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-wrapper mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('end')}}</span>\n  </div>\n</div>\n\n", styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px}._mat-animation-noopable .mat-date-range-input-separator{transition:none}.mat-date-range-input-separator-hidden{-webkit-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-end-wrapper{flex-grow:1}.mat-date-range-input-inner{position:absolute;top:0;left:0;font:inherit;background:rgba(0,0,0,0);color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%;height:100%}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.cdk-high-contrast-active .mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{opacity:0}._mat-animation-noopable .mat-date-range-input-inner::placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-moz-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-webkit-input-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner:-ms-input-placeholder{transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-mdc-form-field-type-mat-date-range-input .mat-mdc-form-field-infix{width:200px}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLWlucHV0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxFQUNWLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9GLE9BQU8sRUFBZSxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFbEQsT0FBTyxFQUFDLHFCQUFxQixFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBRVYsMkJBQTJCLEdBQzVCLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDL0QsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0seUJBQXlCLENBQUM7Ozs7OztBQUk1RSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUEwQnJCLE1BQU0sT0FBTyxpQkFBaUI7SUF3TDVCLFlBQ1Usa0JBQXFDLEVBQ3JDLFdBQW9DLEVBQ3hCLE9BQXlCLEVBQ3pC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QUFNLEVBQUUsT0FBTzt3QkFDZix3QkFBd0IsRUFBRSxzQkFBc0I7d0JBQ2hELHlCQUF5QixFQUFFLGtCQUFrQjt3QkFDN0MsaUZBQWlGO3dCQUNqRiw4RUFBOEU7d0JBQzlFLDBCQUEwQixFQUFFLHFDQUFxQztxQkFDbEUsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksYUFDMUI7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxtQkFBbUIsRUFBQzt3QkFDOUQsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxtQkFBbUIsRUFBQztxQkFDdkU7OzBCQTZMRSxRQUFROzswQkFBSSxJQUFJOzswQkFDaEIsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxjQUFjOzRDQWpKaEMsV0FBVztzQkFEZCxLQUFLO2dCQW9CRixRQUFRO3NCQURYLEtBQUs7Z0JBV0YsVUFBVTtzQkFEYixLQUFLO2dCQXVCRixHQUFHO3NCQUROLEtBQUs7Z0JBZ0JGLEdBQUc7c0JBRE4sS0FBSztnQkFnQkYsUUFBUTtzQkFEWCxLQUFLO2dCQXVDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUdHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBR0csYUFBYTtzQkFBckIsS0FBSztnQkFFc0IsV0FBVztzQkFBdEMsWUFBWTt1QkFBQyxZQUFZO2dCQUNBLFNBQVM7c0JBQWxDLFlBQVk7dUJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBPbkRlc3Ryb3ksXG4gIENvbnRlbnRDaGlsZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFNlbGYsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbCwgTWF0Rm9ybUZpZWxkLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1RoZW1lUGFsZXR0ZSwgRGF0ZUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtOZ0NvbnRyb2wsIENvbnRyb2xDb250YWluZXJ9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdCwgbWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0ZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgQm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgTWF0U3RhcnREYXRlLFxuICBNYXRFbmREYXRlLFxuICBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudCxcbiAgTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5ULFxufSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQ29udHJvbCwgTWF0RGF0ZXBpY2tlclBhbmVsfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7RGF0ZUZpbHRlckZuLCBkYXRlSW5wdXRzSGF2ZUNoYW5nZWR9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7TWF0RGF0ZVJhbmdlUGlja2VySW5wdXR9IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXInO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZS1yYW5nZS1pbnB1dC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcmFuZ2UtaW5wdXQuY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZVJhbmdlSW5wdXQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0JyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LWhpZGUtcGxhY2Vob2xkZXJzXSc6ICdfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpJyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ3JvbGUnOiAnZ3JvdXAnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19nZXRBcmlhTGFiZWxsZWRieSgpJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRCeScsXG4gICAgLy8gVXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIHRvIHRpZSB0aGlzIGlucHV0IHRvIGl0cyBjYWxlbmRhci4gV2UgY2FuJ3QgZGVwZW5kIG9uXG4gICAgLy8gYGFyaWEtb3duc2AgZm9yIHRoaXMsIGJlY2F1c2UgaXQncyBvbmx5IGRlZmluZWQgd2hpbGUgdGhlIGNhbGVuZGFyIGlzIG9wZW4uXG4gICAgJ1thdHRyLmRhdGEtbWF0LWNhbGVuZGFyXSc6ICdyYW5nZVBpY2tlciA/IHJhbmdlUGlja2VyLmlkIDogbnVsbCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdERhdGVSYW5nZUlucHV0fSxcbiAgICB7cHJvdmlkZTogTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5ULCB1c2VFeGlzdGluZzogTWF0RGF0ZVJhbmdlSW5wdXR9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dDxEPlxuICBpbXBsZW1lbnRzXG4gICAgTWF0Rm9ybUZpZWxkQ29udHJvbDxEYXRlUmFuZ2U8RD4+LFxuICAgIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LFxuICAgIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIE1hdERhdGVSYW5nZVBpY2tlcklucHV0PEQ+LFxuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9jbG9zZWRTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBncm91cC4gKi9cbiAgaWQgPSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIGZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCdzIGxhYmVsIHNob3VsZCBmbG9hdC4gKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIC8qKiBOYW1lIG9mIHRoZSBmb3JtIGNvbnRyb2wuICovXG4gIGNvbnRyb2xUeXBlID0gJ21hdC1kYXRlLXJhbmdlLWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogU2V0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb24gYG1hdFN0YXJ0RGF0ZWAgYW5kIGBtYXRFbmREYXRlYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fc3RhcnRJbnB1dD8uX2dldFBsYWNlaG9sZGVyKCkgfHwgJyc7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZW5kSW5wdXQ/Ll9nZXRQbGFjZWhvbGRlcigpIHx8ICcnO1xuICAgIHJldHVybiBzdGFydCB8fCBlbmQgPyBgJHtzdGFydH0gJHt0aGlzLnNlcGFyYXRvcn0gJHtlbmR9YCA6ICcnO1xuICB9XG5cbiAgLyoqIFRoZSByYW5nZSBwaWNrZXIgdGhhdCB0aGlzIGlucHV0IGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJhbmdlUGlja2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZVBpY2tlcjtcbiAgfVxuICBzZXQgcmFuZ2VQaWNrZXIocmFuZ2VQaWNrZXI6IE1hdERhdGVwaWNrZXJQYW5lbDxNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgRGF0ZVJhbmdlPEQ+LCBEPikge1xuICAgIGlmIChyYW5nZVBpY2tlcikge1xuICAgICAgdGhpcy5fbW9kZWwgPSByYW5nZVBpY2tlci5yZWdpc3RlcklucHV0KHRoaXMpO1xuICAgICAgdGhpcy5fcmFuZ2VQaWNrZXIgPSByYW5nZVBpY2tlcjtcbiAgICAgIHRoaXMuX2Nsb3NlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fY2xvc2VkU3Vic2NyaXB0aW9uID0gcmFuZ2VQaWNrZXIuY2xvc2VkU3RyZWFtLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXJ0SW5wdXQ/Ll9vblRvdWNoZWQoKTtcbiAgICAgICAgdGhpcy5fZW5kSW5wdXQ/Ll9vblRvdWNoZWQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCEpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9yYW5nZVBpY2tlcjogTWF0RGF0ZXBpY2tlclBhbmVsPE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBEYXRlUmFuZ2U8RD4sIEQ+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX3JlcXVpcmVkO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbHRlciBvdXQgZGF0ZXMgd2l0aGluIHRoZSBkYXRlIHJhbmdlIHBpY2tlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRhdGVGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVGaWx0ZXI7XG4gIH1cbiAgc2V0IGRhdGVGaWx0ZXIodmFsdWU6IERhdGVGaWx0ZXJGbjxEPikge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fc3RhcnRJbnB1dDtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9lbmRJbnB1dDtcbiAgICBjb25zdCB3YXNNYXRjaGluZ1N0YXJ0ID0gc3RhcnQgJiYgc3RhcnQuX21hdGNoZXNGaWx0ZXIoc3RhcnQudmFsdWUpO1xuICAgIGNvbnN0IHdhc01hdGNoaW5nRW5kID0gZW5kICYmIGVuZC5fbWF0Y2hlc0ZpbHRlcihzdGFydC52YWx1ZSk7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IHZhbHVlO1xuXG4gICAgaWYgKHN0YXJ0ICYmIHN0YXJ0Ll9tYXRjaGVzRmlsdGVyKHN0YXJ0LnZhbHVlKSAhPT0gd2FzTWF0Y2hpbmdTdGFydCkge1xuICAgICAgc3RhcnQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgaWYgKGVuZCAmJiBlbmQuX21hdGNoZXNGaWx0ZXIoZW5kLnZhbHVlKSAhPT0gd2FzTWF0Y2hpbmdFbmQpIHtcbiAgICAgIGVuZC5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgY29uc3QgdmFsaWRWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWxpZFZhbHVlLCB0aGlzLl9taW4pKSB7XG4gICAgICB0aGlzLl9taW4gPSB2YWxpZFZhbHVlO1xuICAgICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9taW46IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xuICB9XG4gIHNldCBtYXgodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgY29uc3QgdmFsaWRWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuXG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWxpZFZhbHVlLCB0aGlzLl9tYXgpKSB7XG4gICAgICB0aGlzLl9tYXggPSB2YWxpZFZhbHVlO1xuICAgICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9tYXg6IEQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0XG4gICAgICA/IHRoaXMuX3N0YXJ0SW5wdXQuZGlzYWJsZWQgJiYgdGhpcy5fZW5kSW5wdXQuZGlzYWJsZWRcbiAgICAgIDogdGhpcy5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZ3JvdXBEaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZ3JvdXBEaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuICBfZ3JvdXBEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBpbiBhbiBlcnJvciBzdGF0ZS4gKi9cbiAgZ2V0IGVycm9yU3RhdGUoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX3N0YXJ0SW5wdXQgJiYgdGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFydElucHV0LmVycm9yU3RhdGUgfHwgdGhpcy5fZW5kSW5wdXQuZXJyb3JTdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpbnB1dCBpcyBlbXB0eS4gKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHN0YXJ0RW1wdHkgPSB0aGlzLl9zdGFydElucHV0ID8gdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgICBjb25zdCBlbmRFbXB0eSA9IHRoaXMuX2VuZElucHV0ID8gdGhpcy5fZW5kSW5wdXQuaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgcmV0dXJuIHN0YXJ0RW1wdHkgJiYgZW5kRW1wdHk7XG4gIH1cblxuICAvKiogVmFsdWUgZm9yIHRoZSBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dHMuICovXG4gIF9hcmlhRGVzY3JpYmVkQnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBEYXRlIHNlbGVjdGlvbiBtb2RlbCBjdXJyZW50bHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEYXRlUmFuZ2U8RD4+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBTZXBhcmF0b3IgdGV4dCB0byBiZSBzaG93biBiZXR3ZWVuIHRoZSBpbnB1dHMuICovXG4gIEBJbnB1dCgpIHNlcGFyYXRvciA9ICfigJMnO1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZSB0aGF0IHNob3VsZCBiZSBzaG93biBpbiB0aGUgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UgdGhhdCBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uRW5kOiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZChNYXRTdGFydERhdGUpIF9zdGFydElucHV0OiBNYXRTdGFydERhdGU8RD47XG4gIEBDb250ZW50Q2hpbGQoTWF0RW5kRGF0ZSkgX2VuZElucHV0OiBNYXRFbmREYXRlPEQ+O1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBUT0RPKGNyaXNiZXRvKTogY2hhbmdlIHR5cGUgdG8gYEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZWAgYWZ0ZXIgIzE4MjA2IGxhbmRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBuZ0NvbnRyb2w6IE5nQ29udHJvbCB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGlucHV0J3Mgc3RhdGUgaGFzIGNoYW5nZWQuICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgY29udHJvbDogQ29udHJvbENvbnRhaW5lcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfZm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkLFxuICApIHtcbiAgICBpZiAoIV9kYXRlQWRhcHRlciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGRhdGVwaWNrZXIgbW9kdWxlIGNhbiBiZSB1c2VkIGJvdGggd2l0aCBNREMgYW5kIG5vbi1NREMgZm9ybSBmaWVsZHMuIFdlIGhhdmVcbiAgICAvLyB0byBjb25kaXRpb25hbGx5IGFkZCB0aGUgTURDIGlucHV0IGNsYXNzIHNvIHRoYXQgdGhlIHJhbmdlIHBpY2tlciBsb29rcyBjb3JyZWN0bHkuXG4gICAgaWYgKF9mb3JtRmllbGQ/Ll9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtbWRjLWZvcm0tZmllbGQnKSkge1xuICAgICAgY29uc3QgY2xhc3NMaXN0ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICBjbGFzc0xpc3QuYWRkKCdtYXQtbWRjLWlucHV0LWVsZW1lbnQnKTtcbiAgICAgIGNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtZm9ybS1maWVsZC1pbnB1dC1jb250cm9sJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHJlbW92ZSBgYXMgYW55YCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAgdGhpcy5uZ0NvbnRyb2wgPSBjb250cm9sIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZEJ5ID0gaWRzLmxlbmd0aCA/IGlkcy5qb2luKCcgJykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwgfHwgIXRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICB0aGlzLl9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbmRJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX3N0YXJ0SW5wdXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ21hdC1kYXRlLXJhbmdlLWlucHV0IG11c3QgY29udGFpbiBhIG1hdFN0YXJ0RGF0ZSBpbnB1dCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuX2VuZElucHV0KSB7XG4gICAgICAgIHRocm93IEVycm9yKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dCBtdXN0IGNvbnRhaW4gYSBtYXRFbmREYXRlIGlucHV0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl9yZWdpc3Rlck1vZGVsKHRoaXMuX21vZGVsKTtcbiAgICB9XG5cbiAgICAvLyBXZSBkb24ndCBuZWVkIHRvIHVuc3Vic2NyaWJlIGZyb20gdGhpcywgYmVjYXVzZSB3ZVxuICAgIC8vIGtub3cgdGhhdCB0aGUgaW5wdXQgc3RyZWFtcyB3aWxsIGJlIGNvbXBsZXRlZCBvbiBkZXN0cm95LlxuICAgIG1lcmdlKHRoaXMuX3N0YXJ0SW5wdXQuc3RhdGVDaGFuZ2VzLCB0aGlzLl9lbmRJbnB1dC5zdGF0ZUNoYW5nZXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGRhdGVJbnB1dHNIYXZlQ2hhbmdlZChjaGFuZ2VzLCB0aGlzLl9kYXRlQWRhcHRlcikpIHtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbG9zZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRhdGUgYXQgd2hpY2ggdGhlIGNhbGVuZGFyIHNob3VsZCBzdGFydC4gKi9cbiAgZ2V0U3RhcnRWYWx1ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPyB0aGlzLnZhbHVlLnN0YXJ0IDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbnB1dCdzIHRoZW1lIHBhbGV0dGUuICovXG4gIGdldFRoZW1lUGFsZXR0ZSgpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuY29sb3IgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZWxlbWVudCB0byB3aGljaCB0aGUgY2FsZW5kYXIgb3ZlcmxheSBzaG91bGQgYmUgYXR0YWNoZWQuICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIElEIG9mIGFuIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgdXNlZCBhIGRlc2NyaXB0aW9uIGZvciB0aGUgY2FsZW5kYXIgb3ZlcmxheS4gKi9cbiAgZ2V0T3ZlcmxheUxhYmVsSWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRMYWJlbElkKCkgOiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIHRoYXQgaXMgdXNlZCB0byBtaXJyb3IgdGhlIHN0YXRlIGlucHV0LiAqL1xuICBfZ2V0SW5wdXRNaXJyb3JWYWx1ZShwYXJ0OiAnc3RhcnQnIHwgJ2VuZCcpIHtcbiAgICBjb25zdCBpbnB1dCA9IHBhcnQgPT09ICdzdGFydCcgPyB0aGlzLl9zdGFydElucHV0IDogdGhpcy5fZW5kSW5wdXQ7XG4gICAgcmV0dXJuIGlucHV0ID8gaW5wdXQuZ2V0TWlycm9yVmFsdWUoKSA6ICcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IHBsYWNlaG9sZGVycyBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dCA/ICF0aGlzLl9zdGFydElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIHZhbHVlIGluIG9uZSBvZiB0aGUgY2hpbGQgaW5wdXRzIGNoYW5naW5nLiAqL1xuICBfaGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIF9vcGVuRGF0ZXBpY2tlcigpIHtcbiAgICBpZiAodGhpcy5fcmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuX3JhbmdlUGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2VwYXJhdGUgdGV4dCBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBfc2hvdWxkSGlkZVNlcGFyYXRvcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgKCF0aGlzLl9mb3JtRmllbGQgfHxcbiAgICAgICAgKHRoaXMuX2Zvcm1GaWVsZC5nZXRMYWJlbElkKCkgJiYgIXRoaXMuX2Zvcm1GaWVsZC5fc2hvdWxkTGFiZWxGbG9hdCgpKSkgJiZcbiAgICAgIHRoaXMuZW1wdHlcbiAgICApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dHMuICovXG4gIF9nZXRBcmlhTGFiZWxsZWRieSgpIHtcbiAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQ7XG4gICAgcmV0dXJuIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQuX2hhc0Zsb2F0aW5nTGFiZWwoKSA/IGZvcm1GaWVsZC5fbGFiZWxJZCA6IG51bGw7XG4gIH1cblxuICBfZ2V0U3RhcnREYXRlQWNjZXNzaWJsZU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dC5fZ2V0QWNjZXNzaWJsZU5hbWUoKTtcbiAgfVxuXG4gIF9nZXRFbmREYXRlQWNjZXNzaWJsZU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZW5kSW5wdXQuX2dldEFjY2Vzc2libGVOYW1lKCk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIF91cGRhdGVGb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luKSB7XG4gICAgdGhpcy5mb2N1c2VkID0gb3JpZ2luICE9PSBudWxsO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBSZS1ydW5zIHRoZSB2YWxpZGF0b3JzIG9uIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZXZhbGlkYXRlKCkge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyB0aGUgY3VycmVudCBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXZcbiAgY2xhc3M9XCJtYXQtZGF0ZS1yYW5nZS1pbnB1dC1jb250YWluZXJcIlxuICBjZGtNb25pdG9yU3VidHJlZUZvY3VzXG4gIChjZGtGb2N1c0NoYW5nZSk9XCJfdXBkYXRlRm9jdXMoJGV2ZW50KVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LWRhdGUtcmFuZ2UtaW5wdXQtd3JhcHBlclwiPlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlucHV0W21hdFN0YXJ0RGF0ZV1cIj48L25nLWNvbnRlbnQ+XG4gICAgPHNwYW5cbiAgICAgIGNsYXNzPVwibWF0LWRhdGUtcmFuZ2UtaW5wdXQtbWlycm9yXCJcbiAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPnt7X2dldElucHV0TWlycm9yVmFsdWUoJ3N0YXJ0Jyl9fTwvc3Bhbj5cbiAgPC9kaXY+XG5cbiAgPHNwYW5cbiAgICBjbGFzcz1cIm1hdC1kYXRlLXJhbmdlLWlucHV0LXNlcGFyYXRvclwiXG4gICAgW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LXNlcGFyYXRvci1oaWRkZW5dPVwiX3Nob3VsZEhpZGVTZXBhcmF0b3IoKVwiPnt7c2VwYXJhdG9yfX08L3NwYW4+XG5cbiAgPGRpdiBjbGFzcz1cIm1hdC1kYXRlLXJhbmdlLWlucHV0LXdyYXBwZXIgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtZW5kLXdyYXBwZXJcIj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpbnB1dFttYXRFbmREYXRlXVwiPjwvbmctY29udGVudD5cbiAgICA8c3BhblxuICAgICAgY2xhc3M9XCJtYXQtZGF0ZS1yYW5nZS1pbnB1dC1taXJyb3JcIlxuICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+e3tfZ2V0SW5wdXRNaXJyb3JWYWx1ZSgnZW5kJyl9fTwvc3Bhbj5cbiAgPC9kaXY+XG48L2Rpdj5cblxuIl19