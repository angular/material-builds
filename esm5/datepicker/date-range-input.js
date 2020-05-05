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
var nextUniqueId = 0;
var MatDateRangeInput = /** @class */ (function () {
    function MatDateRangeInput(_changeDetectorRef, _elementRef, control, _dateAdapter, _formField) {
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._formField = _formField;
        /** Emits when the input's state has changed. */
        this.stateChanges = new Subject();
        /** Unique ID for the input. */
        this.id = "mat-date-range-input-" + nextUniqueId++;
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
    Object.defineProperty(MatDateRangeInput.prototype, "value", {
        /** Current value of the range input. */
        get: function () {
            return this._model ? this._model.selection : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "shouldLabelFloat", {
        /** Whether the control's label should float. */
        get: function () {
            return this.focused || !this.empty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "rangePicker", {
        /** The range picker that this input is associated with. */
        get: function () { return this._rangePicker; },
        set: function (rangePicker) {
            if (rangePicker) {
                this._model = rangePicker._registerInput(this);
                this._rangePicker = rangePicker;
                this._registerModel(this._model);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "required", {
        /** Whether the input is required. */
        get: function () { return !!this._required; },
        set: function (value) {
            this._required = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "dateFilter", {
        /** Function that can be used to filter out dates within the date range picker. */
        get: function () { return this._dateFilter; },
        set: function (value) {
            this._dateFilter = value;
            this._revalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "min", {
        /** The minimum valid date. */
        get: function () { return this._min; },
        set: function (value) {
            this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._revalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "max", {
        /** The maximum valid date. */
        get: function () { return this._max; },
        set: function (value) {
            this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._revalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "disabled", {
        /** Whether the input is disabled. */
        get: function () {
            return (this._startInput && this._endInput) ?
                (this._startInput.disabled && this._endInput.disabled) :
                this._groupDisabled;
        },
        set: function (value) {
            var newValue = coerceBooleanProperty(value);
            if (newValue !== this._groupDisabled) {
                this._groupDisabled = newValue;
                this._disabledChange.next(this.disabled);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "errorState", {
        /** Whether the input is in an error state. */
        get: function () {
            if (this._startInput && this._endInput) {
                return this._startInput.errorState || this._endInput.errorState;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDateRangeInput.prototype, "empty", {
        /** Whether the datepicker input is empty. */
        get: function () {
            var startEmpty = this._startInput ? this._startInput.isEmpty() : false;
            var endEmpty = this._endInput ? this._endInput.isEmpty() : false;
            return startEmpty && endEmpty;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * @docs-private
     */
    MatDateRangeInput.prototype.setDescribedByIds = function (ids) {
        this._ariaDescribedBy = ids.length ? ids.join(' ') : null;
    };
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * @docs-private
     */
    MatDateRangeInput.prototype.onContainerClick = function () {
        if (!this.focused && !this.disabled) {
            if (!this._model || !this._model.selection.start) {
                this._startInput.focus();
            }
            else {
                this._endInput.focus();
            }
        }
    };
    MatDateRangeInput.prototype.ngAfterContentInit = function () {
        var _this = this;
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
        merge(this._startInput._disabledChange, this._endInput._disabledChange).subscribe(function () {
            _this._disabledChange.next(_this.disabled);
        });
    };
    MatDateRangeInput.prototype.ngOnDestroy = function () {
        this.stateChanges.complete();
        this._disabledChange.unsubscribe();
    };
    /** Gets the date at which the calendar should start. */
    MatDateRangeInput.prototype.getStartValue = function () {
        return this.value ? this.value.start : null;
    };
    /** Gets the input's theme palette. */
    MatDateRangeInput.prototype.getThemePalette = function () {
        return this._formField ? this._formField.color : undefined;
    };
    /** Gets the element to which the calendar overlay should be attached. */
    MatDateRangeInput.prototype.getConnectedOverlayOrigin = function () {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    };
    /** Gets the value that is used to mirror the state input. */
    MatDateRangeInput.prototype._getInputMirrorValue = function () {
        return this._startInput ? this._startInput.getMirrorValue() : '';
    };
    /** Whether the input placeholders should be hidden. */
    MatDateRangeInput.prototype._shouldHidePlaceholders = function () {
        return this._startInput ? !this._startInput.isEmpty() : false;
    };
    /** Handles the value in one of the child inputs changing. */
    MatDateRangeInput.prototype._handleChildValueChange = function () {
        this._changeDetectorRef.markForCheck();
    };
    /** Opens the date range picker associated with the input. */
    MatDateRangeInput.prototype._openDatepicker = function () {
        if (this._rangePicker) {
            this._rangePicker.open();
        }
    };
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    MatDateRangeInput.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    /** Re-runs the validators on the start/end inputs. */
    MatDateRangeInput.prototype._revalidate = function () {
        if (this._startInput) {
            this._startInput._validatorOnChange();
        }
        if (this._endInput) {
            this._endInput._validatorOnChange();
        }
    };
    /** Registers the current date selection model with the start/end inputs. */
    MatDateRangeInput.prototype._registerModel = function (model) {
        if (this._startInput) {
            this._startInput._registerModel(model);
        }
        if (this._endInput) {
            this._endInput._registerModel(model);
        }
    };
    MatDateRangeInput.decorators = [
        { type: Component, args: [{
                    selector: 'mat-date-range-input',
                    template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"focused = $event !== null\">\n  <div class=\"mat-date-range-input-start-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue()}}</span>\n  </div>\n\n  <span class=\"mat-date-range-input-separator\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n  </div>\n</div>\n\n",
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
                    styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{margin:0 4px;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-separator{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent;transition:none}.mat-date-range-input-inner{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%}.mat-date-range-input-inner::-ms-clear,.mat-date-range-input-inner::-ms-reveal{display:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-date-range-input-start-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-start-wrapper .mat-date-range-input-inner{position:absolute;top:0;left:0}.mat-date-range-input-end-wrapper{flex-grow:1;max-width:calc(50% - 4px)}.mat-form-field-type-mat-date-range-input .mat-form-field-infix{width:200px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatDateRangeInput.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: ControlContainer, decorators: [{ type: Optional }, { type: Self }] },
        { type: DateAdapter, decorators: [{ type: Optional }] },
        { type: MatFormField, decorators: [{ type: Optional }] }
    ]; };
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
}());
export { MatDateRangeInput };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRSxPQUFPLEVBQWUsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakUsT0FBTyxFQUFZLGdCQUFnQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLHFCQUFxQixFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBRVYsMkJBQTJCLEdBQzVCLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFHdkQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCO0lBK0pFLDJCQUNVLGtCQUFxQyxFQUNyQyxXQUFvQyxFQUN4QixPQUF5QixFQUN6QixZQUE0QixFQUM1QixVQUF5QjtRQUpyQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3JDLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUV4QixpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7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XG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE9uRGVzdHJveSxcbiAgQ29udGVudENoaWxkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgU2VsZixcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2wsIE1hdEZvcm1GaWVsZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1RoZW1lUGFsZXR0ZSwgRGF0ZUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtOZ0NvbnRyb2wsIENvbnRyb2xDb250YWluZXJ9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdCwgbWVyZ2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHksIEJvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIE1hdFN0YXJ0RGF0ZSxcbiAgTWF0RW5kRGF0ZSxcbiAgTWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQsXG4gIE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCxcbn0gZnJvbSAnLi9kYXRlLXJhbmdlLWlucHV0LXBhcnRzJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7Y3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3J9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHtEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7TWF0RGF0ZVJhbmdlUGlja2VyfSBmcm9tICcuL2RhdGUtcmFuZ2UtcGlja2VyJztcbmltcG9ydCB7RGF0ZVJhbmdlLCBNYXREYXRlU2VsZWN0aW9uTW9kZWx9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGUtcmFuZ2UtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGUtcmFuZ2UtaW5wdXQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlLXJhbmdlLWlucHV0LmNzcyddLFxuICBleHBvcnRBczogJ21hdERhdGVSYW5nZUlucHV0JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZS1yYW5nZS1pbnB1dC1oaWRlLXBsYWNlaG9sZGVyc10nOiAnX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKScsXG4gICAgJ1thdHRyLmlkXSc6ICdudWxsJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0RGF0ZVJhbmdlSW5wdXR9LFxuICAgIHtwcm92aWRlOiBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VJbnB1dH0sXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXQ8RD4gaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPERhdGVSYW5nZTxEPj4sXG4gIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPiwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBpbnB1dCdzIHN0YXRlIGhhcyBjaGFuZ2VkLiAqL1xuICBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBpbnB1dC4gKi9cbiAgaWQgPSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIGZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCdzIGxhYmVsIHNob3VsZCBmbG9hdC4gKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIC8qKiBOYW1lIG9mIHRoZSBmb3JtIGNvbnRyb2wuICovXG4gIGNvbnRyb2xUeXBlID0gJ21hdC1kYXRlLXJhbmdlLWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYCwgYnV0IG5vdCB1c2VkLlxuICAgKiBTZXQgdGhlIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBvbiBgbWF0U3RhcnREYXRlYCBhbmQgYG1hdEVuZERhdGVgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKiBUaGUgcmFuZ2UgcGlja2VyIHRoYXQgdGhpcyBpbnB1dCBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgpXG4gIGdldCByYW5nZVBpY2tlcigpIHsgcmV0dXJuIHRoaXMuX3JhbmdlUGlja2VyOyB9XG4gIHNldCByYW5nZVBpY2tlcihyYW5nZVBpY2tlcjogTWF0RGF0ZVJhbmdlUGlja2VyPEQ+KSB7XG4gICAgaWYgKHJhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLl9tb2RlbCA9IHJhbmdlUGlja2VyLl9yZWdpc3RlcklucHV0KHRoaXMpO1xuICAgICAgdGhpcy5fcmFuZ2VQaWNrZXIgPSByYW5nZVBpY2tlcjtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwodGhpcy5fbW9kZWwhKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcmFuZ2VQaWNrZXI6IE1hdERhdGVSYW5nZVBpY2tlcjxEPjtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbHRlciBvdXQgZGF0ZXMgd2l0aGluIHRoZSBkYXRlIHJhbmdlIHBpY2tlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRhdGVGaWx0ZXIoKSB7IHJldHVybiB0aGlzLl9kYXRlRmlsdGVyOyB9XG4gIHNldCBkYXRlRmlsdGVyKHZhbHVlOiBEYXRlRmlsdGVyRm48RD4pIHtcbiAgICB0aGlzLl9kYXRlRmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX2RhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcblxuICAvKiogVGhlIG1pbmltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbigpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9taW47IH1cbiAgc2V0IG1pbih2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW4gPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7IHJldHVybiB0aGlzLl9tYXg7IH1cbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXggPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl9yZXZhbGlkYXRlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4OiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuX3N0YXJ0SW5wdXQgJiYgdGhpcy5fZW5kSW5wdXQpID9cbiAgICAgICh0aGlzLl9zdGFydElucHV0LmRpc2FibGVkICYmIHRoaXMuX2VuZElucHV0LmRpc2FibGVkKSA6XG4gICAgICB0aGlzLl9ncm91cERpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZ3JvdXBEaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZ3JvdXBEaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dCh0aGlzLmRpc2FibGVkKTtcbiAgICB9XG4gIH1cbiAgX2dyb3VwRGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgaW4gYW4gZXJyb3Igc3RhdGUuICovXG4gIGdldCBlcnJvclN0YXRlKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhcnRJbnB1dC5lcnJvclN0YXRlIHx8IHRoaXMuX2VuZElucHV0LmVycm9yU3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaW5wdXQgaXMgZW1wdHkuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFydEVtcHR5ID0gdGhpcy5fc3RhcnRJbnB1dCA/IHRoaXMuX3N0YXJ0SW5wdXQuaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgY29uc3QgZW5kRW1wdHkgPSB0aGlzLl9lbmRJbnB1dCA/IHRoaXMuX2VuZElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIHJldHVybiBzdGFydEVtcHR5ICYmIGVuZEVtcHR5O1xuICB9XG5cbiAgLyoqIFZhbHVlIGZvciB0aGUgYGFyaWEtZGVzY3JpYmVkYnlgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXRzLiAqL1xuICBfYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogVmFsdWUgZm9yIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogRGF0ZSBzZWxlY3Rpb24gbW9kZWwgY3VycmVudGx5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByaXZhdGUgX21vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+PiB8IHVuZGVmaW5lZDtcblxuICAvKiogU2VwYXJhdG9yIHRleHQgdG8gYmUgc2hvd24gYmV0d2VlbiB0aGUgaW5wdXRzLiAqL1xuICBASW5wdXQoKSBzZXBhcmF0b3IgPSAn4oCTJztcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UgdGhhdCBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlIHRoYXQgc2hvdWxkIGJlIHNob3duIGluIHRoZSBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogRCB8IG51bGwgPSBudWxsO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0U3RhcnREYXRlKSBfc3RhcnRJbnB1dDogTWF0U3RhcnREYXRlPEQ+O1xuICBAQ29udGVudENoaWxkKE1hdEVuZERhdGUpIF9lbmRJbnB1dDogTWF0RW5kRGF0ZTxEPjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogVE9ETyhjcmlzYmV0byk6IGNoYW5nZSB0eXBlIHRvIGBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmVgIGFmdGVyICMxODIwNiBsYW5kcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgbmdDb250cm9sOiBOZ0NvbnRyb2wgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBpbnB1dCdzIGRpc2FibGVkIHN0YXRlIGNoYW5nZXMuICovXG4gIF9kaXNhYmxlZENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgY29udHJvbDogQ29udHJvbENvbnRhaW5lcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkKSB7XG5cbiAgICBpZiAoIV9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHJlbW92ZSBgYXMgYW55YCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAgdGhpcy5uZ0NvbnRyb2wgPSBjb250cm9sIGFzIGFueTtcbiAgICB0aGlzLl9hcmlhTGFiZWxsZWRCeSA9IF9mb3JtRmllbGQgPyBfZm9ybUZpZWxkLl9sYWJlbElkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZEJ5ID0gaWRzLmxlbmd0aCA/IGlkcy5qb2luKCcgJykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwgfHwgIXRoaXMuX21vZGVsLnNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICB0aGlzLl9zdGFydElucHV0LmZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbmRJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXJ0SW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dCBtdXN0IGNvbnRhaW4gYSBtYXRTdGFydERhdGUgaW5wdXQnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2VuZElucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0RW5kRGF0ZSBpbnB1dCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNb2RlbCh0aGlzLl9tb2RlbCk7XG4gICAgfVxuXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tIHRoaXMsIGJlY2F1c2Ugd2VcbiAgICAvLyBrbm93IHRoYXQgdGhlIGlucHV0IHN0cmVhbXMgd2lsbCBiZSBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICBtZXJnZSh0aGlzLl9zdGFydElucHV0Ll9kaXNhYmxlZENoYW5nZSwgdGhpcy5fZW5kSW5wdXQuX2Rpc2FibGVkQ2hhbmdlKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dCh0aGlzLmRpc2FibGVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkYXRlIGF0IHdoaWNoIHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQuICovXG4gIGdldFN0YXJ0VmFsdWUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5zdGFydCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5wdXQncyB0aGVtZSBwYWxldHRlLiAqL1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmNvbG9yIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNhbGVuZGFyIG92ZXJsYXkgc2hvdWxkIGJlIGF0dGFjaGVkLiAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0aGF0IGlzIHVzZWQgdG8gbWlycm9yIHRoZSBzdGF0ZSBpbnB1dC4gKi9cbiAgX2dldElucHV0TWlycm9yVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmdldE1pcnJvclZhbHVlKCkgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBwbGFjZWhvbGRlcnMgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgX3Nob3VsZEhpZGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQgPyAhdGhpcy5fc3RhcnRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSB2YWx1ZSBpbiBvbmUgb2YgdGhlIGNoaWxkIGlucHV0cyBjaGFuZ2luZy4gKi9cbiAgX2hhbmRsZUNoaWxkVmFsdWVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIF9vcGVuRGF0ZXBpY2tlcigpIHtcbiAgICBpZiAodGhpcy5fcmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuX3JhbmdlUGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBUaGUgZ2l2ZW4gb2JqZWN0IGlmIGl0IGlzIGJvdGggYSBkYXRlIGluc3RhbmNlIGFuZCB2YWxpZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBwcml2YXRlIF9nZXRWYWxpZERhdGVPck51bGwob2JqOiBhbnkpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9kYXRlQWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQob2JqKSkgPyBvYmogOiBudWxsO1xuICB9XG5cbiAgLyoqIFJlLXJ1bnMgdGhlIHZhbGlkYXRvcnMgb24gdGhlIHN0YXJ0L2VuZCBpbnB1dHMuICovXG4gIHByaXZhdGUgX3JldmFsaWRhdGUoKSB7XG4gICAgaWYgKHRoaXMuX3N0YXJ0SW5wdXQpIHtcbiAgICAgIHRoaXMuX3N0YXJ0SW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2VuZElucHV0KSB7XG4gICAgICB0aGlzLl9lbmRJbnB1dC5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVnaXN0ZXJzIHRoZSBjdXJyZW50IGRhdGUgc2VsZWN0aW9uIG1vZGVsIHdpdGggdGhlIHN0YXJ0L2VuZCBpbnB1dHMuICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyTW9kZWwobW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEYXRlUmFuZ2U8RD4+KSB7XG4gICAgaWYgKHRoaXMuX3N0YXJ0SW5wdXQpIHtcbiAgICAgIHRoaXMuX3N0YXJ0SW5wdXQuX3JlZ2lzdGVyTW9kZWwobW9kZWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3JlZ2lzdGVyTW9kZWwobW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==