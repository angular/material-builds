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
        /** Gets the value for the `aria-labelledby` attribute of the inputs. */
        _getAriaLabelledby() {
            const formField = this._formField;
            return formField && formField._hasFloatingLabel() ? formField._labelId : null;
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
                        'role': 'group',
                        '[attr.aria-labelledby]': '_getAriaLabelledby()',
                        '[attr.aria-describedby]': '_ariaDescribedBy',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2RhdGUtcmFuZ2UtaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxRQUFRLEVBRVIsWUFBWSxFQUVaLGlCQUFpQixFQUNqQixJQUFJLEVBQ0osVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRSxPQUFPLEVBQWUsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakUsT0FBTyxFQUFZLGdCQUFnQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLHFCQUFxQixFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBRVYsMkJBQTJCLEdBQzVCLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGtCQUFrQixFQUEwQixNQUFNLHFCQUFxQixDQUFDO0FBR2hGLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjtJQUFBLE1Bb0JhLGlCQUFpQjtRQWdKNUIsWUFDVSxrQkFBcUMsRUFDckMsV0FBb0MsRUFDeEIsT0FBeUIsRUFDekIsWUFBNEIsRUFDNUIsVUFBeUI7WUFKckMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtZQUNyQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7WUFFeEIsaUJBQVksR0FBWixZQUFZ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TyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQzt3QkFDOUQsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDO3FCQUN2RTs7aUJBQ0Y7OztnQkExQ0MsaUJBQWlCO2dCQUVqQixVQUFVO2dCQUlPLGdCQUFnQix1QkF3TDlCLFFBQVEsWUFBSSxJQUFJO2dCQXpMQyxXQUFXLHVCQTBMNUIsUUFBUTtnQkEzTGdCLFlBQVksdUJBNExwQyxRQUFROzs7OEJBaEhWLEtBQUs7MkJBWUwsS0FBSzs2QkFRTCxLQUFLO3NCQVNMLEtBQUs7c0JBU0wsS0FBSzsyQkFTTCxLQUFLOzRCQXVDTCxLQUFLO2tDQUdMLEtBQUs7Z0NBR0wsS0FBSzs4QkFFTCxZQUFZLFNBQUMsWUFBWTs0QkFDekIsWUFBWSxTQUFDLFVBQVU7O0lBMkoxQix3QkFBQztLQUFBO1NBL1JZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBPbkRlc3Ryb3ksXG4gIENvbnRlbnRDaGlsZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFNlbGYsXG4gIEVsZW1lbnRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sLCBNYXRGb3JtRmllbGR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtUaGVtZVBhbGV0dGUsIERhdGVBZGFwdGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TmdDb250cm9sLCBDb250cm9sQ29udGFpbmVyfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3QsIG1lcmdlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5LCBCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBNYXRTdGFydERhdGUsXG4gIE1hdEVuZERhdGUsXG4gIE1hdERhdGVSYW5nZUlucHV0UGFyZW50LFxuICBNQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQsXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJDb250cm9sfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7RGF0ZUZpbHRlckZufSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtYmFzZSc7XG5pbXBvcnQge01hdERhdGVSYW5nZVBpY2tlciwgTWF0RGF0ZVJhbmdlUGlja2VySW5wdXR9IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXInO1xuaW1wb3J0IHtEYXRlUmFuZ2UsIE1hdERhdGVTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZS1yYW5nZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZS1yYW5nZS1pbnB1dC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcmFuZ2UtaW5wdXQuY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZVJhbmdlSW5wdXQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlLXJhbmdlLWlucHV0JyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlLXJhbmdlLWlucHV0LWhpZGUtcGxhY2Vob2xkZXJzXSc6ICdfc2hvdWxkSGlkZVBsYWNlaG9sZGVycygpJyxcbiAgICAnW2F0dHIuaWRdJzogJ251bGwnLFxuICAgICdyb2xlJzogJ2dyb3VwJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfZ2V0QXJpYUxhYmVsbGVkYnkoKScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkQnknLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VJbnB1dH0sXG4gICAge3Byb3ZpZGU6IE1BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCwgdXNlRXhpc3Rpbmc6IE1hdERhdGVSYW5nZUlucHV0fSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dDxEPiBpbXBsZW1lbnRzIE1hdEZvcm1GaWVsZENvbnRyb2w8RGF0ZVJhbmdlPEQ+PixcbiAgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LCBNYXREYXRlUmFuZ2VQaWNrZXJJbnB1dDxEPixcbiAgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBpbnB1dCdzIHN0YXRlIGhhcyBjaGFuZ2VkLiAqL1xuICBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBpbnB1dC4gKi9cbiAgaWQgPSBgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIGZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCdzIGxhYmVsIHNob3VsZCBmbG9hdC4gKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIC8qKiBOYW1lIG9mIHRoZSBmb3JtIGNvbnRyb2wuICovXG4gIGNvbnRyb2xUeXBlID0gJ21hdC1kYXRlLXJhbmdlLWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogU2V0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb24gYG1hdFN0YXJ0RGF0ZWAgYW5kIGBtYXRFbmREYXRlYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fc3RhcnRJbnB1dD8uX2dldFBsYWNlaG9sZGVyKCkgfHwgJyc7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fZW5kSW5wdXQ/Ll9nZXRQbGFjZWhvbGRlcigpIHx8ICcnO1xuICAgIHJldHVybiAoc3RhcnQgfHwgZW5kKSA/IGAke3N0YXJ0fSAke3RoaXMuc2VwYXJhdG9yfSAke2VuZH1gIDogJyc7XG4gIH1cblxuICAvKiogVGhlIHJhbmdlIHBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmFuZ2VQaWNrZXIoKSB7IHJldHVybiB0aGlzLl9yYW5nZVBpY2tlcjsgfVxuICBzZXQgcmFuZ2VQaWNrZXIocmFuZ2VQaWNrZXI6IE1hdERhdGVSYW5nZVBpY2tlcjxEPikge1xuICAgIGlmIChyYW5nZVBpY2tlcikge1xuICAgICAgdGhpcy5fbW9kZWwgPSByYW5nZVBpY2tlci5fcmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICAgIHRoaXMuX3JhbmdlUGlja2VyID0gcmFuZ2VQaWNrZXI7XG4gICAgICB0aGlzLl9yZWdpc3Rlck1vZGVsKHRoaXMuX21vZGVsISk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3JhbmdlUGlja2VyOiBNYXREYXRlUmFuZ2VQaWNrZXI8RD47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuX3JlcXVpcmVkOyB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbjtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGRhdGVzIHdpdGhpbiB0aGUgZGF0ZSByYW5nZSBwaWNrZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkYXRlRmlsdGVyKCkgeyByZXR1cm4gdGhpcy5fZGF0ZUZpbHRlcjsgfVxuICBzZXQgZGF0ZUZpbHRlcih2YWx1ZTogRGF0ZUZpbHRlckZuPEQ+KSB7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IHZhbHVlO1xuICAgIHRoaXMuX3JldmFsaWRhdGUoKTtcbiAgfVxuICBwcml2YXRlIF9kYXRlRmlsdGVyOiBEYXRlRmlsdGVyRm48RD47XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWluOyB9XG4gIHNldCBtaW4odmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX21pbjogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXgoKTogRCB8IG51bGwgeyByZXR1cm4gdGhpcy5fbWF4OyB9XG4gIHNldCBtYXgodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4ID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fcmV2YWxpZGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLl9zdGFydElucHV0ICYmIHRoaXMuX2VuZElucHV0KSA/XG4gICAgICAodGhpcy5fc3RhcnRJbnB1dC5kaXNhYmxlZCAmJiB0aGlzLl9lbmRJbnB1dC5kaXNhYmxlZCkgOlxuICAgICAgdGhpcy5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2dyb3VwRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2dyb3VwRGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLm5leHQodGhpcy5kaXNhYmxlZCk7XG4gICAgfVxuICB9XG4gIF9ncm91cERpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICBnZXQgZXJyb3JTdGF0ZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fc3RhcnRJbnB1dCAmJiB0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5wdXQuZXJyb3JTdGF0ZSB8fCB0aGlzLl9lbmRJbnB1dC5lcnJvclN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlucHV0IGlzIGVtcHR5LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc3RhcnRFbXB0eSA9IHRoaXMuX3N0YXJ0SW5wdXQgPyB0aGlzLl9zdGFydElucHV0LmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIGNvbnN0IGVuZEVtcHR5ID0gdGhpcy5fZW5kSW5wdXQgPyB0aGlzLl9lbmRJbnB1dC5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgICByZXR1cm4gc3RhcnRFbXB0eSAmJiBlbmRFbXB0eTtcbiAgfVxuXG4gIC8qKiBWYWx1ZSBmb3IgdGhlIGBhcmlhLWRlc2NyaWJlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2FyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIERhdGUgc2VsZWN0aW9uIG1vZGVsIGN1cnJlbnRseSByZWdpc3RlcmVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPERhdGVSYW5nZTxEPj4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFNlcGFyYXRvciB0ZXh0IHRvIGJlIHNob3duIGJldHdlZW4gdGhlIGlucHV0cy4gKi9cbiAgQElucHV0KCkgc2VwYXJhdG9yID0gJ+KAkyc7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlIHRoYXQgc2hvdWxkIGJlIHNob3duIGluIHRoZSBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZSB0aGF0IHNob3VsZCBiZSBzaG93biBpbiB0aGUgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsID0gbnVsbDtcblxuICBAQ29udGVudENoaWxkKE1hdFN0YXJ0RGF0ZSkgX3N0YXJ0SW5wdXQ6IE1hdFN0YXJ0RGF0ZTxEPjtcbiAgQENvbnRlbnRDaGlsZChNYXRFbmREYXRlKSBfZW5kSW5wdXQ6IE1hdEVuZERhdGU8RD47XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIFRPRE8oY3Jpc2JldG8pOiBjaGFuZ2UgdHlwZSB0byBgQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlYCBhZnRlciAjMTgyMDYgbGFuZHMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG5nQ29udHJvbDogTmdDb250cm9sIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgaW5wdXQncyBkaXNhYmxlZCBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfZGlzYWJsZWRDaGFuZ2UgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIGNvbnRyb2w6IENvbnRyb2xDb250YWluZXIsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2Zvcm1GaWVsZD86IE1hdEZvcm1GaWVsZCkge1xuXG4gICAgaWYgKCFfZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiByZW1vdmUgYGFzIGFueWAgYWZ0ZXIgIzE4MjA2IGxhbmRzLlxuICAgIHRoaXMubmdDb250cm9sID0gY29udHJvbCBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZWRCeSA9IGlkcy5sZW5ndGggPyBpZHMuam9pbignICcpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5mb2N1c2VkICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAoIXRoaXMuX21vZGVsIHx8ICF0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRJbnB1dC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZW5kSW5wdXQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignbWF0LWRhdGUtcmFuZ2UtaW5wdXQgbXVzdCBjb250YWluIGEgbWF0U3RhcnREYXRlIGlucHV0Jyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ21hdC1kYXRlLXJhbmdlLWlucHV0IG11c3QgY29udGFpbiBhIG1hdEVuZERhdGUgaW5wdXQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTW9kZWwodGhpcy5fbW9kZWwpO1xuICAgIH1cblxuICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUgZnJvbSB0aGlzLCBiZWNhdXNlIHdlXG4gICAgLy8ga25vdyB0aGF0IHRoZSBpbnB1dCBzdHJlYW1zIHdpbGwgYmUgY29tcGxldGVkIG9uIGRlc3Ryb3kuXG4gICAgbWVyZ2UodGhpcy5fc3RhcnRJbnB1dC5fZGlzYWJsZWRDaGFuZ2UsIHRoaXMuX2VuZElucHV0Ll9kaXNhYmxlZENoYW5nZSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLm5leHQodGhpcy5kaXNhYmxlZCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGF0ZSBhdCB3aGljaCB0aGUgY2FsZW5kYXIgc2hvdWxkIHN0YXJ0LiAqL1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZSA/IHRoaXMudmFsdWUuc3RhcnQgOiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlucHV0J3MgdGhlbWUgcGFsZXR0ZS4gKi9cbiAgZ2V0VGhlbWVQYWxldHRlKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5jb2xvciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBlbGVtZW50IHRvIHdoaWNoIHRoZSBjYWxlbmRhciBvdmVybGF5IHNob3VsZCBiZSBhdHRhY2hlZC4gKi9cbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSA6IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCBpcyB1c2VkIHRvIG1pcnJvciB0aGUgc3RhdGUgaW5wdXQuICovXG4gIF9nZXRJbnB1dE1pcnJvclZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydElucHV0ID8gdGhpcy5fc3RhcnRJbnB1dC5nZXRNaXJyb3JWYWx1ZSgpIDogJyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgcGxhY2Vob2xkZXJzIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIF9zaG91bGRIaWRlUGxhY2Vob2xkZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydElucHV0ID8gIXRoaXMuX3N0YXJ0SW5wdXQuaXNFbXB0eSgpIDogZmFsc2U7XG4gIH1cblxuICAvKiogSGFuZGxlcyB0aGUgdmFsdWUgaW4gb25lIG9mIHRoZSBjaGlsZCBpbnB1dHMgY2hhbmdpbmcuICovXG4gIF9oYW5kbGVDaGlsZFZhbHVlQ2hhbmdlKCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgZGF0ZSByYW5nZSBwaWNrZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgX29wZW5EYXRlcGlja2VyKCkge1xuICAgIGlmICh0aGlzLl9yYW5nZVBpY2tlcikge1xuICAgICAgdGhpcy5fcmFuZ2VQaWNrZXIub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZXBhcmF0ZSB0ZXh0IHNob3VsZCBiZSBoaWRkZW4uICovXG4gIF9zaG91bGRIaWRlU2VwYXJhdG9yKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2Zvcm1GaWVsZCB8fCB0aGlzLl9mb3JtRmllbGQuX2hpZGVDb250cm9sUGxhY2Vob2xkZXIoKSkgJiYgdGhpcy5lbXB0eTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXRzLiAqL1xuICBfZ2V0QXJpYUxhYmVsbGVkYnkoKSB7XG4gICAgY29uc3QgZm9ybUZpZWxkID0gdGhpcy5fZm9ybUZpZWxkO1xuICAgIHJldHVybiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLl9oYXNGbG9hdGluZ0xhYmVsKCkgPyBmb3JtRmllbGQuX2xhYmVsSWQgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VmFsaWREYXRlT3JOdWxsKG9iajogYW55KTogRCB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5fZGF0ZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJiB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKG9iaikpID8gb2JqIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBSZS1ydW5zIHRoZSB2YWxpZGF0b3JzIG9uIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZXZhbGlkYXRlKCkge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbmRJbnB1dCkge1xuICAgICAgdGhpcy5fZW5kSW5wdXQuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyB0aGUgY3VycmVudCBkYXRlIHNlbGVjdGlvbiBtb2RlbCB3aXRoIHRoZSBzdGFydC9lbmQgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1vZGVsKG1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIGlmICh0aGlzLl9zdGFydElucHV0KSB7XG4gICAgICB0aGlzLl9zdGFydElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZW5kSW5wdXQpIHtcbiAgICAgIHRoaXMuX2VuZElucHV0Ll9yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=