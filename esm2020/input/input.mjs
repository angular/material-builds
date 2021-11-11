/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Self, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import { MatFormFieldControl, MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { getMatInputUnsupportedTypeError } from './input-errors';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/core";
import * as i4 from "@angular/cdk/text-field";
import * as i5 from "@angular/material/form-field";
// Invalid input type. Using one of these will throw an MatInputUnsupportedTypeError.
const MAT_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
];
let nextUniqueId = 0;
// Boilerplate for applying mixins to MatInput.
/** @docs-private */
const _MatInputBase = mixinErrorState(class {
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /** @docs-private */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
});
/** Directive that allows a native input to work inside a `MatFormField`. */
export class MatInput extends _MatInputBase {
    constructor(_elementRef, _platform, ngControl, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, ngZone, 
    // TODO: Remove this once the legacy appearance has been removed. We only need
    // to inject the form-field for determining whether the placeholder has been promoted.
    _formField) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this._elementRef = _elementRef;
        this._platform = _platform;
        this._autofillMonitor = _autofillMonitor;
        this._formField = _formField;
        this._uid = `mat-input-${nextUniqueId++}`;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.focused = false;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.stateChanges = new Subject();
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.controlType = 'mat-input';
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.autofilled = false;
        this._disabled = false;
        this._type = 'text';
        this._readonly = false;
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week',
        ].filter(t => getSupportedInputTypes().has(t));
        const element = this._elementRef.nativeElement;
        const nodeName = element.nodeName.toLowerCase();
        // If no input value accessor was explicitly specified, use the element as the input value
        // accessor.
        this._inputValueAccessor = inputValueAccessor || element;
        this._previousNativeValue = this.value;
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (_platform.IOS) {
            ngZone.runOutsideAngular(() => {
                _elementRef.nativeElement.addEventListener('keyup', (event) => {
                    const el = event.target;
                    // Note: We specifically check for 0, rather than `!el.selectionStart`, because the two
                    // indicate different things. If the value is 0, it means that the caret is at the start
                    // of the input, whereas a value of `null` means that the input doesn't support
                    // manipulating the selection range. Inputs that don't support setting the selection range
                    // will throw an error so we want to avoid calling `setSelectionRange` on them. See:
                    // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
                    if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
                        // Note: Just setting `0, 0` doesn't fix the issue. Setting
                        // `1, 1` fixes it for the first time that you type text and
                        // then hold delete. Toggling to `1, 1` and then back to
                        // `0, 0` seems to completely fix it.
                        el.setSelectionRange(1, 1);
                        el.setSelectionRange(0, 0);
                    }
                });
            });
        }
        this._isServer = !this._platform.isBrowser;
        this._isNativeSelect = nodeName === 'select';
        this._isTextarea = nodeName === 'textarea';
        this._isInFormField = !!_formField;
        if (this._isNativeSelect) {
            this.controlType = element.multiple
                ? 'mat-native-select-multiple'
                : 'mat-native-select';
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled() {
        if (this.ngControl && this.ngControl.disabled !== null) {
            return this.ngControl.disabled;
        }
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // Browsers may not fire the blur event if the input is disabled too quickly.
        // Reset from here to ensure that the element doesn't become stuck.
        if (this.focused) {
            this.focused = false;
            this.stateChanges.next();
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /** Input type of the element. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'text';
        this._validateType();
        // When using Angular inputs, developers are no longer able to set the properties on the native
        // input element. To ensure that bindings for `type` work, we need to sync the setter
        // with the native property. Textarea elements don't support the type property or attribute.
        if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
            this._elementRef.nativeElement.type = this._type;
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value() {
        return this._inputValueAccessor.value;
    }
    set value(value) {
        if (value !== this.value) {
            this._inputValueAccessor.value = value;
            this.stateChanges.next();
        }
    }
    /** Whether the element is readonly. */
    get readonly() {
        return this._readonly;
    }
    set readonly(value) {
        this._readonly = coerceBooleanProperty(value);
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
                this.autofilled = event.isAutofilled;
                this.stateChanges.next();
            });
        }
    }
    ngOnChanges() {
        this.stateChanges.next();
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        if (this._platform.isBrowser) {
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
        }
    }
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
        }
        // We need to dirty-check the native element's value, because there are some cases where
        // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
        // updating the value using `emitEvent: false`).
        this._dirtyCheckNativeValue();
        // We need to dirty-check and set the placeholder attribute ourselves, because whether it's
        // present or not depends on a query which is prone to "changed after checked" errors.
        this._dirtyCheckPlaceholder();
    }
    /** Focuses the input. */
    focus(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused) {
        if (isFocused !== this.focused) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    }
    _onInput() {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    }
    /** Does some manual dirty checking on the native input `placeholder` attribute. */
    _dirtyCheckPlaceholder() {
        // If we're hiding the native placeholder, it should also be cleared from the DOM, otherwise
        // screen readers will read it out twice: once from the label and once from the attribute.
        // TODO: can be removed once we get rid of the `legacy` style for the form field, because it's
        // the only one that supports promoting the placeholder to a label.
        const placeholder = this._formField?._hideControlPlaceholder?.() ? null : this.placeholder;
        if (placeholder !== this._previousPlaceholder) {
            const element = this._elementRef.nativeElement;
            this._previousPlaceholder = placeholder;
            placeholder
                ? element.setAttribute('placeholder', placeholder)
                : element.removeAttribute('placeholder');
        }
    }
    /** Does some manual dirty checking on the native input `value` property. */
    _dirtyCheckNativeValue() {
        const newValue = this._elementRef.nativeElement.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }
    /** Make sure the input is a supported type. */
    _validateType() {
        if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1 &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatInputUnsupportedTypeError(this._type);
        }
    }
    /** Checks whether the input type is one of the types that are never empty. */
    _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    }
    /** Checks whether the input is invalid based on the native validation. */
    _isBadInput() {
        // The `validity` property won't be present on platform-server.
        let validity = this._elementRef.nativeElement.validity;
        return validity && validity.badInput;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty() {
        return (!this._isNeverEmpty() &&
            !this._elementRef.nativeElement.value &&
            !this._isBadInput() &&
            !this.autofilled);
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat() {
        if (this._isNativeSelect) {
            // For a single-selection `<select>`, the label should float when the selected option has
            // a non-empty display value. For a `<select multiple>`, the label *always* floats to avoid
            // overlapping the label with the options.
            const selectElement = this._elementRef.nativeElement;
            const firstOption = selectElement.options[0];
            // On most browsers the `selectedIndex` will always be 0, however on IE and Edge it'll be
            // -1 if the `value` is set to something, that isn't in the list of options, at a later point.
            return (this.focused ||
                selectElement.multiple ||
                !this.empty ||
                !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label));
        }
        else {
            return this.focused || !this.empty;
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids) {
        if (ids.length) {
            this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
        }
        else {
            this._elementRef.nativeElement.removeAttribute('aria-describedby');
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick() {
        // Do not re-focus the input element if the element is already focused. Otherwise it can happen
        // that someone clicks on a time input and the cursor resets to the "hours" field while the
        // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
        if (!this.focused) {
            this.focus();
        }
    }
    /** Whether the form control is a native select that is displayed inline. */
    _isInlineSelect() {
        const element = this._elementRef.nativeElement;
        return this._isNativeSelect && (element.multiple || element.size > 1);
    }
}
MatInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatInput, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: i2.NgControl, optional: true, self: true }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.ErrorStateMatcher }, { token: MAT_INPUT_VALUE_ACCESSOR, optional: true, self: true }, { token: i4.AutofillMonitor }, { token: i0.NgZone }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", inputs: { disabled: "disabled", id: "id", placeholder: "placeholder", required: "required", type: "type", errorStateMatcher: "errorStateMatcher", userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], value: "value", readonly: "readonly" }, host: { listeners: { "focus": "_focusChanged(true)", "blur": "_focusChanged(false)", "input": "_onInput()" }, properties: { "class.mat-input-server": "_isServer", "attr.id": "id", "attr.data-placeholder": "placeholder", "disabled": "disabled", "required": "required", "attr.readonly": "readonly && !_isNativeSelect || null", "class.mat-native-select-inline": "_isInlineSelect()", "attr.aria-invalid": "(empty && required) ? null : errorState", "attr.aria-required": "required" }, classAttribute: "mat-input-element mat-form-field-autofill-control" }, providers: [{ provide: MatFormFieldControl, useExisting: MatInput }], exportAs: ["matInput"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatInput, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
                    exportAs: 'matInput',
                    host: {
                        /**
                         * @breaking-change 8.0.0 remove .mat-form-field-autofill-control in favor of AutofillMonitor.
                         */
                        'class': 'mat-input-element mat-form-field-autofill-control',
                        '[class.mat-input-server]': '_isServer',
                        // Native input properties that are overwritten by Angular inputs need to be synced with
                        // the native input element. Otherwise property bindings for those don't work.
                        '[attr.id]': 'id',
                        // At the time of writing, we have a lot of customer tests that look up the input based on its
                        // placeholder. Since we sometimes omit the placeholder attribute from the DOM to prevent screen
                        // readers from reading it twice, we have to keep it somewhere in the DOM for the lookup.
                        '[attr.data-placeholder]': 'placeholder',
                        '[disabled]': 'disabled',
                        '[required]': 'required',
                        '[attr.readonly]': 'readonly && !_isNativeSelect || null',
                        '[class.mat-native-select-inline]': '_isInlineSelect()',
                        // Only mark the input as invalid for assistive technology if it has a value since the
                        // state usually overlaps with `aria-required` when the input is empty and can be redundant.
                        '[attr.aria-invalid]': '(empty && required) ? null : errorState',
                        '[attr.aria-required]': 'required',
                        '(focus)': '_focusChanged(true)',
                        '(blur)': '_focusChanged(false)',
                        '(input)': '_onInput()',
                    },
                    providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i2.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.ErrorStateMatcher }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [MAT_INPUT_VALUE_ACCESSOR]
                }] }, { type: i4.AutofillMonitor }, { type: i0.NgZone }, { type: i5.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }]; }, propDecorators: { disabled: [{
                type: Input
            }], id: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], type: [{
                type: Input
            }], errorStateMatcher: [{
                type: Input
            }], userAriaDescribedBy: [{
                type: Input,
                args: ['aria-describedby']
            }], value: [{
                type: Input
            }], readonly: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsSUFBSSxHQUNMLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pGLE9BQU8sRUFBc0IsaUJBQWlCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDL0YsT0FBTyxFQUFDLG1CQUFtQixFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7Ozs7O0FBRWhFLHFGQUFxRjtBQUNyRixNQUFNLHVCQUF1QixHQUFHO0lBQzlCLFFBQVE7SUFDUixVQUFVO0lBQ1YsTUFBTTtJQUNOLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtDQUNULENBQUM7QUFFRixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsK0NBQStD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QkFDaEMsU0FBUyxFQUFFLFlBQVk7cUJBQ3hCO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsVUFBVSxFQUFDLENBQUM7aUJBQ25FOzswQkEyS0ksUUFBUTs7MEJBQUksSUFBSTs7MEJBQ2hCLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUVSLFFBQVE7OzBCQUFJLElBQUk7OzBCQUFJLE1BQU07MkJBQUMsd0JBQXdCOzswQkFLbkQsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxjQUFjOzRDQTNIaEMsUUFBUTtzQkFEWCxLQUFLO2dCQXdCRixFQUFFO3NCQURMLEtBQUs7Z0JBYUcsV0FBVztzQkFBbkIsS0FBSztnQkFPRixRQUFRO3NCQURYLEtBQUs7Z0JBV0YsSUFBSTtzQkFEUCxLQUFLO2dCQWtCWSxpQkFBaUI7c0JBQWxDLEtBQUs7Z0JBTXFCLG1CQUFtQjtzQkFBN0MsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBT3JCLEtBQUs7c0JBRFIsS0FBSztnQkFhRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Z2V0U3VwcG9ydGVkSW5wdXRUeXBlcywgUGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0F1dG9maWxsTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm0sIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q2FuVXBkYXRlRXJyb3JTdGF0ZSwgRXJyb3JTdGF0ZU1hdGNoZXIsIG1peGluRXJyb3JTdGF0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2wsIE1hdEZvcm1GaWVsZCwgTUFUX0ZPUk1fRklFTER9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7Z2V0TWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvcn0gZnJvbSAnLi9pbnB1dC1lcnJvcnMnO1xuaW1wb3J0IHtNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vaW5wdXQtdmFsdWUtYWNjZXNzb3InO1xuXG4vLyBJbnZhbGlkIGlucHV0IHR5cGUuIFVzaW5nIG9uZSBvZiB0aGVzZSB3aWxsIHRocm93IGFuIE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3IuXG5jb25zdCBNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUyA9IFtcbiAgJ2J1dHRvbicsXG4gICdjaGVja2JveCcsXG4gICdmaWxlJyxcbiAgJ2hpZGRlbicsXG4gICdpbWFnZScsXG4gICdyYWRpbycsXG4gICdyYW5nZScsXG4gICdyZXNldCcsXG4gICdzdWJtaXQnLFxuXTtcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0SW5wdXQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdElucHV0QmFzZSA9IG1peGluRXJyb3JTdGF0ZShcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICBwdWJsaWMgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcbiAgICApIHt9XG4gIH0sXG4pO1xuXG4vKiogRGlyZWN0aXZlIHRoYXQgYWxsb3dzIGEgbmF0aXZlIGlucHV0IHRvIHdvcmsgaW5zaWRlIGEgYE1hdEZvcm1GaWVsZGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRJbnB1dF0sIHRleHRhcmVhW21hdElucHV0XSwgc2VsZWN0W21hdE5hdGl2ZUNvbnRyb2xdLFxuICAgICAgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdYCxcbiAgZXhwb3J0QXM6ICdtYXRJbnB1dCcsXG4gIGhvc3Q6IHtcbiAgICAvKipcbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSAubWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCBpbiBmYXZvciBvZiBBdXRvZmlsbE1vbml0b3IuXG4gICAgICovXG4gICAgJ2NsYXNzJzogJ21hdC1pbnB1dC1lbGVtZW50IG1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2wnLFxuICAgICdbY2xhc3MubWF0LWlucHV0LXNlcnZlcl0nOiAnX2lzU2VydmVyJyxcbiAgICAvLyBOYXRpdmUgaW5wdXQgcHJvcGVydGllcyB0aGF0IGFyZSBvdmVyd3JpdHRlbiBieSBBbmd1bGFyIGlucHV0cyBuZWVkIHRvIGJlIHN5bmNlZCB3aXRoXG4gICAgLy8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50LiBPdGhlcndpc2UgcHJvcGVydHkgYmluZGluZ3MgZm9yIHRob3NlIGRvbid0IHdvcmsuXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgLy8gQXQgdGhlIHRpbWUgb2Ygd3JpdGluZywgd2UgaGF2ZSBhIGxvdCBvZiBjdXN0b21lciB0ZXN0cyB0aGF0IGxvb2sgdXAgdGhlIGlucHV0IGJhc2VkIG9uIGl0c1xuICAgIC8vIHBsYWNlaG9sZGVyLiBTaW5jZSB3ZSBzb21ldGltZXMgb21pdCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZyb20gdGhlIERPTSB0byBwcmV2ZW50IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgZnJvbSByZWFkaW5nIGl0IHR3aWNlLCB3ZSBoYXZlIHRvIGtlZXAgaXQgc29tZXdoZXJlIGluIHRoZSBET00gZm9yIHRoZSBsb29rdXAuXG4gICAgJ1thdHRyLmRhdGEtcGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tyZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbYXR0ci5yZWFkb25seV0nOiAncmVhZG9ubHkgJiYgIV9pc05hdGl2ZVNlbGVjdCB8fCBudWxsJyxcbiAgICAnW2NsYXNzLm1hdC1uYXRpdmUtc2VsZWN0LWlubGluZV0nOiAnX2lzSW5saW5lU2VsZWN0KCknLFxuICAgIC8vIE9ubHkgbWFyayB0aGUgaW5wdXQgYXMgaW52YWxpZCBmb3IgYXNzaXN0aXZlIHRlY2hub2xvZ3kgaWYgaXQgaGFzIGEgdmFsdWUgc2luY2UgdGhlXG4gICAgLy8gc3RhdGUgdXN1YWxseSBvdmVybGFwcyB3aXRoIGBhcmlhLXJlcXVpcmVkYCB3aGVuIHRoZSBpbnB1dCBpcyBlbXB0eSBhbmQgY2FuIGJlIHJlZHVuZGFudC5cbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICcoZW1wdHkgJiYgcmVxdWlyZWQpID8gbnVsbCA6IGVycm9yU3RhdGUnLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJyhmb2N1cyknOiAnX2ZvY3VzQ2hhbmdlZCh0cnVlKScsXG4gICAgJyhibHVyKSc6ICdfZm9jdXNDaGFuZ2VkKGZhbHNlKScsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0SW5wdXR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5wdXRcbiAgZXh0ZW5kcyBfTWF0SW5wdXRCYXNlXG4gIGltcGxlbWVudHNcbiAgICBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIERvQ2hlY2ssXG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZVxue1xuICBwcm90ZWN0ZWQgX3VpZCA9IGBtYXQtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuICBwcm90ZWN0ZWQgX3ByZXZpb3VzTmF0aXZlVmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBfaW5wdXRWYWx1ZUFjY2Vzc29yOiB7dmFsdWU6IGFueX07XG4gIHByaXZhdGUgX3ByZXZpb3VzUGxhY2Vob2xkZXI6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBiZWluZyByZW5kZXJlZCBvbiB0aGUgc2VydmVyLiAqL1xuICByZWFkb25seSBfaXNTZXJ2ZXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIG5hdGl2ZSBodG1sIHNlbGVjdC4gKi9cbiAgcmVhZG9ubHkgX2lzTmF0aXZlU2VsZWN0OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSB0ZXh0YXJlYS4gKi9cbiAgcmVhZG9ubHkgX2lzVGV4dGFyZWE6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGluc2lkZSBvZiBhIGZvcm0gZmllbGQuICovXG4gIHJlYWRvbmx5IF9pc0luRm9ybUZpZWxkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvdmVycmlkZSByZWFkb25seSBzdGF0ZUNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbnRyb2xUeXBlOiBzdHJpbmcgPSAnbWF0LWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhdXRvZmlsbGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCAmJiB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMubmdDb250cm9sLmRpc2FibGVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgLy8gQnJvd3NlcnMgbWF5IG5vdCBmaXJlIHRoZSBibHVyIGV2ZW50IGlmIHRoZSBpbnB1dCBpcyBkaXNhYmxlZCB0b28gcXVpY2tseS5cbiAgICAvLyBSZXNldCBmcm9tIGhlcmUgdG8gZW5zdXJlIHRoYXQgdGhlIGVsZW1lbnQgZG9lc24ndCBiZWNvbWUgc3R1Y2suXG4gICAgaWYgKHRoaXMuZm9jdXNlZCkge1xuICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgfVxuICBwcm90ZWN0ZWQgX2lkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkID8/IHRoaXMubmdDb250cm9sPy5jb250cm9sPy5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5yZXF1aXJlZCkgPz8gZmFsc2U7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIElucHV0IHR5cGUgb2YgdGhlIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cbiAgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB2YWx1ZSB8fCAndGV4dCc7XG4gICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XG5cbiAgICAvLyBXaGVuIHVzaW5nIEFuZ3VsYXIgaW5wdXRzLCBkZXZlbG9wZXJzIGFyZSBubyBsb25nZXIgYWJsZSB0byBzZXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIG5hdGl2ZVxuICAgIC8vIGlucHV0IGVsZW1lbnQuIFRvIGVuc3VyZSB0aGF0IGJpbmRpbmdzIGZvciBgdHlwZWAgd29yaywgd2UgbmVlZCB0byBzeW5jIHRoZSBzZXR0ZXJcbiAgICAvLyB3aXRoIHRoZSBuYXRpdmUgcHJvcGVydHkuIFRleHRhcmVhIGVsZW1lbnRzIGRvbid0IHN1cHBvcnQgdGhlIHR5cGUgcHJvcGVydHkgb3IgYXR0cmlidXRlLlxuICAgIGlmICghdGhpcy5faXNUZXh0YXJlYSAmJiBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHRoaXMuX3R5cGUpKSB7XG4gICAgICAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGUgPSB0aGlzLl90eXBlO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX3R5cGUgPSAndGV4dCc7XG5cbiAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIG92ZXJyaWRlIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgcmVhZG9ubHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZG9ubHk7XG4gIH1cbiAgc2V0IHJlYWRvbmx5KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVhZG9ubHkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3JlYWRvbmx5ID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9uZXZlckVtcHR5SW5wdXRUeXBlcyA9IFtcbiAgICAnZGF0ZScsXG4gICAgJ2RhdGV0aW1lJyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICdtb250aCcsXG4gICAgJ3RpbWUnLFxuICAgICd3ZWVrJyxcbiAgXS5maWx0ZXIodCA9PiBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHQpKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SKSBpbnB1dFZhbHVlQWNjZXNzb3I6IGFueSxcbiAgICBwcml2YXRlIF9hdXRvZmlsbE1vbml0b3I6IEF1dG9maWxsTW9uaXRvcixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBvbmNlIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSBoYXMgYmVlbiByZW1vdmVkLiBXZSBvbmx5IG5lZWRcbiAgICAvLyB0byBpbmplY3QgdGhlIGZvcm0tZmllbGQgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIHBsYWNlaG9sZGVyIGhhcyBiZWVuIHByb21vdGVkLlxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIHByaXZhdGUgX2Zvcm1GaWVsZD86IE1hdEZvcm1GaWVsZCxcbiAgKSB7XG4gICAgc3VwZXIoX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgX3BhcmVudEZvcm0sIF9wYXJlbnRGb3JtR3JvdXAsIG5nQ29udHJvbCk7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gSWYgbm8gaW5wdXQgdmFsdWUgYWNjZXNzb3Igd2FzIGV4cGxpY2l0bHkgc3BlY2lmaWVkLCB1c2UgdGhlIGVsZW1lbnQgYXMgdGhlIGlucHV0IHZhbHVlXG4gICAgLy8gYWNjZXNzb3IuXG4gICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yID0gaW5wdXRWYWx1ZUFjY2Vzc29yIHx8IGVsZW1lbnQ7XG5cbiAgICB0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIC8vIEZvcmNlIHNldHRlciB0byBiZSBjYWxsZWQgaW4gY2FzZSBpZCB3YXMgbm90IHNwZWNpZmllZC5cbiAgICB0aGlzLmlkID0gdGhpcy5pZDtcblxuICAgIC8vIE9uIHNvbWUgdmVyc2lvbnMgb2YgaU9TIHRoZSBjYXJldCBnZXRzIHN0dWNrIGluIHRoZSB3cm9uZyBwbGFjZSB3aGVuIGhvbGRpbmcgZG93biB0aGUgZGVsZXRlXG4gICAgLy8ga2V5LiBJbiBvcmRlciB0byBnZXQgYXJvdW5kIHRoaXMgd2UgbmVlZCB0byBcImppZ2dsZVwiIHRoZSBjYXJldCBsb29zZS4gU2luY2UgdGhpcyBidWcgb25seVxuICAgIC8vIGV4aXN0cyBvbiBpT1MsIHdlIG9ubHkgYm90aGVyIHRvIGluc3RhbGwgdGhlIGxpc3RlbmVyIG9uIGlPUy5cbiAgICBpZiAoX3BsYXRmb3JtLklPUykge1xuICAgICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgICAgICAgLy8gTm90ZTogV2Ugc3BlY2lmaWNhbGx5IGNoZWNrIGZvciAwLCByYXRoZXIgdGhhbiBgIWVsLnNlbGVjdGlvblN0YXJ0YCwgYmVjYXVzZSB0aGUgdHdvXG4gICAgICAgICAgLy8gaW5kaWNhdGUgZGlmZmVyZW50IHRoaW5ncy4gSWYgdGhlIHZhbHVlIGlzIDAsIGl0IG1lYW5zIHRoYXQgdGhlIGNhcmV0IGlzIGF0IHRoZSBzdGFydFxuICAgICAgICAgIC8vIG9mIHRoZSBpbnB1dCwgd2hlcmVhcyBhIHZhbHVlIG9mIGBudWxsYCBtZWFucyB0aGF0IHRoZSBpbnB1dCBkb2Vzbid0IHN1cHBvcnRcbiAgICAgICAgICAvLyBtYW5pcHVsYXRpbmcgdGhlIHNlbGVjdGlvbiByYW5nZS4gSW5wdXRzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBzZXR0aW5nIHRoZSBzZWxlY3Rpb24gcmFuZ2VcbiAgICAgICAgICAvLyB3aWxsIHRocm93IGFuIGVycm9yIHNvIHdlIHdhbnQgdG8gYXZvaWQgY2FsbGluZyBgc2V0U2VsZWN0aW9uUmFuZ2VgIG9uIHRoZW0uIFNlZTpcbiAgICAgICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbnB1dC5odG1sI2RvLW5vdC1hcHBseVxuICAgICAgICAgIGlmICghZWwudmFsdWUgJiYgZWwuc2VsZWN0aW9uU3RhcnQgPT09IDAgJiYgZWwuc2VsZWN0aW9uRW5kID09PSAwKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiBKdXN0IHNldHRpbmcgYDAsIDBgIGRvZXNuJ3QgZml4IHRoZSBpc3N1ZS4gU2V0dGluZ1xuICAgICAgICAgICAgLy8gYDEsIDFgIGZpeGVzIGl0IGZvciB0aGUgZmlyc3QgdGltZSB0aGF0IHlvdSB0eXBlIHRleHQgYW5kXG4gICAgICAgICAgICAvLyB0aGVuIGhvbGQgZGVsZXRlLiBUb2dnbGluZyB0byBgMSwgMWAgYW5kIHRoZW4gYmFjayB0b1xuICAgICAgICAgICAgLy8gYDAsIDBgIHNlZW1zIHRvIGNvbXBsZXRlbHkgZml4IGl0LlxuICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMSwgMSk7XG4gICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZSgwLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyO1xuICAgIHRoaXMuX2lzTmF0aXZlU2VsZWN0ID0gbm9kZU5hbWUgPT09ICdzZWxlY3QnO1xuICAgIHRoaXMuX2lzVGV4dGFyZWEgPSBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJztcbiAgICB0aGlzLl9pc0luRm9ybUZpZWxkID0gISFfZm9ybUZpZWxkO1xuXG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICB0aGlzLmNvbnRyb2xUeXBlID0gKGVsZW1lbnQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLm11bHRpcGxlXG4gICAgICAgID8gJ21hdC1uYXRpdmUtc2VsZWN0LW11bHRpcGxlJ1xuICAgICAgICA6ICdtYXQtbmF0aXZlLXNlbGVjdCc7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy5hdXRvZmlsbGVkID0gZXZlbnQuaXNBdXRvZmlsbGVkO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fYXV0b2ZpbGxNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZS1ldmFsdWF0ZSB0aGlzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWVcbiAgICAgIC8vIGVycm9yIHRyaWdnZXJzIHRoYXQgd2UgY2FuJ3Qgc3Vic2NyaWJlIHRvIChlLmcuIHBhcmVudCBmb3JtIHN1Ym1pc3Npb25zKS4gVGhpcyBtZWFuc1xuICAgICAgLy8gdGhhdCB3aGF0ZXZlciBsb2dpYyBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgZGVzdHJveWluZyB0aGUgcGVyZm9ybWFuY2UuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpcnR5LWNoZWNrIHRoZSBuYXRpdmUgZWxlbWVudCdzIHZhbHVlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lIGNhc2VzIHdoZXJlXG4gICAgLy8gd2Ugd29uJ3QgYmUgbm90aWZpZWQgd2hlbiBpdCBjaGFuZ2VzIChlLmcuIHRoZSBjb25zdW1lciBpc24ndCB1c2luZyBmb3JtcyBvciB0aGV5J3JlXG4gICAgLy8gdXBkYXRpbmcgdGhlIHZhbHVlIHVzaW5nIGBlbWl0RXZlbnQ6IGZhbHNlYCkuXG4gICAgdGhpcy5fZGlydHlDaGVja05hdGl2ZVZhbHVlKCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpcnR5LWNoZWNrIGFuZCBzZXQgdGhlIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBvdXJzZWx2ZXMsIGJlY2F1c2Ugd2hldGhlciBpdCdzXG4gICAgLy8gcHJlc2VudCBvciBub3QgZGVwZW5kcyBvbiBhIHF1ZXJ5IHdoaWNoIGlzIHByb25lIHRvIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzLlxuICAgIHRoaXMuX2RpcnR5Q2hlY2tQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIGlucHV0IGNoYW5nZXMuICovXG4gIF9mb2N1c0NoYW5nZWQoaXNGb2N1c2VkOiBib29sZWFuKSB7XG4gICAgaWYgKGlzRm9jdXNlZCAhPT0gdGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gVGhpcyBpcyBhIG5vb3AgZnVuY3Rpb24gYW5kIGlzIHVzZWQgdG8gbGV0IEFuZ3VsYXIga25vdyB3aGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAvLyBBbmd1bGFyIHdpbGwgcnVuIGEgbmV3IGNoYW5nZSBkZXRlY3Rpb24gZWFjaCB0aW1lIHRoZSBgaW5wdXRgIGV2ZW50IGhhcyBiZWVuIGRpc3BhdGNoZWQuXG4gICAgLy8gSXQncyBuZWNlc3NhcnkgdGhhdCBBbmd1bGFyIHJlY29nbml6ZXMgdGhlIHZhbHVlIGNoYW5nZSwgYmVjYXVzZSB3aGVuIGZsb2F0aW5nTGFiZWxcbiAgICAvLyBpcyBzZXQgdG8gZmFsc2UgYW5kIEFuZ3VsYXIgZm9ybXMgYXJlbid0IHVzZWQsIHRoZSBwbGFjZWhvbGRlciB3b24ndCByZWNvZ25pemUgdGhlXG4gICAgLy8gdmFsdWUgY2hhbmdlcyBhbmQgd2lsbCBub3QgZGlzYXBwZWFyLlxuICAgIC8vIExpc3RlbmluZyB0byB0aGUgaW5wdXQgZXZlbnQgd291bGRuJ3QgYmUgbmVjZXNzYXJ5IHdoZW4gdGhlIGlucHV0IGlzIHVzaW5nIHRoZVxuICAgIC8vIEZvcm1zTW9kdWxlIG9yIFJlYWN0aXZlRm9ybXNNb2R1bGUsIGJlY2F1c2UgQW5ndWxhciBmb3JtcyBhbHNvIGxpc3RlbnMgdG8gaW5wdXQgZXZlbnRzLlxuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZS4gKi9cbiAgcHJpdmF0ZSBfZGlydHlDaGVja1BsYWNlaG9sZGVyKCkge1xuICAgIC8vIElmIHdlJ3JlIGhpZGluZyB0aGUgbmF0aXZlIHBsYWNlaG9sZGVyLCBpdCBzaG91bGQgYWxzbyBiZSBjbGVhcmVkIGZyb20gdGhlIERPTSwgb3RoZXJ3aXNlXG4gICAgLy8gc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIGl0IG91dCB0d2ljZTogb25jZSBmcm9tIHRoZSBsYWJlbCBhbmQgb25jZSBmcm9tIHRoZSBhdHRyaWJ1dGUuXG4gICAgLy8gVE9ETzogY2FuIGJlIHJlbW92ZWQgb25jZSB3ZSBnZXQgcmlkIG9mIHRoZSBgbGVnYWN5YCBzdHlsZSBmb3IgdGhlIGZvcm0gZmllbGQsIGJlY2F1c2UgaXQnc1xuICAgIC8vIHRoZSBvbmx5IG9uZSB0aGF0IHN1cHBvcnRzIHByb21vdGluZyB0aGUgcGxhY2Vob2xkZXIgdG8gYSBsYWJlbC5cbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuX2Zvcm1GaWVsZD8uX2hpZGVDb250cm9sUGxhY2Vob2xkZXI/LigpID8gbnVsbCA6IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgaWYgKHBsYWNlaG9sZGVyICE9PSB0aGlzLl9wcmV2aW91c1BsYWNlaG9sZGVyKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5fcHJldmlvdXNQbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICAgICAgcGxhY2Vob2xkZXJcbiAgICAgICAgPyBlbGVtZW50LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlcilcbiAgICAgICAgOiBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcbiAgICB9XG4gIH1cblxuICAvKiogRG9lcyBzb21lIG1hbnVhbCBkaXJ0eSBjaGVja2luZyBvbiB0aGUgbmF0aXZlIGlucHV0IGB2YWx1ZWAgcHJvcGVydHkuICovXG4gIHByb3RlY3RlZCBfZGlydHlDaGVja05hdGl2ZVZhbHVlKCkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE1ha2Ugc3VyZSB0aGUgaW5wdXQgaXMgYSBzdXBwb3J0ZWQgdHlwZS4gKi9cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZVR5cGUoKSB7XG4gICAgaWYgKFxuICAgICAgTUFUX0lOUFVUX0lOVkFMSURfVFlQRVMuaW5kZXhPZih0aGlzLl90eXBlKSA+IC0xICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICkge1xuICAgICAgdGhyb3cgZ2V0TWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvcih0aGlzLl90eXBlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IHR5cGUgaXMgb25lIG9mIHRoZSB0eXBlcyB0aGF0IGFyZSBuZXZlciBlbXB0eS4gKi9cbiAgcHJvdGVjdGVkIF9pc05ldmVyRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzLmluZGV4T2YodGhpcy5fdHlwZSkgPiAtMTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgaXMgaW52YWxpZCBiYXNlZCBvbiB0aGUgbmF0aXZlIHZhbGlkYXRpb24uICovXG4gIHByb3RlY3RlZCBfaXNCYWRJbnB1dCgpIHtcbiAgICAvLyBUaGUgYHZhbGlkaXR5YCBwcm9wZXJ0eSB3b24ndCBiZSBwcmVzZW50IG9uIHBsYXRmb3JtLXNlcnZlci5cbiAgICBsZXQgdmFsaWRpdHkgPSAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbGlkaXR5O1xuICAgIHJldHVybiB2YWxpZGl0eSAmJiB2YWxpZGl0eS5iYWRJbnB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgIXRoaXMuX2lzTmV2ZXJFbXB0eSgpICYmXG4gICAgICAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlICYmXG4gICAgICAhdGhpcy5faXNCYWRJbnB1dCgpICYmXG4gICAgICAhdGhpcy5hdXRvZmlsbGVkXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgLy8gRm9yIGEgc2luZ2xlLXNlbGVjdGlvbiBgPHNlbGVjdD5gLCB0aGUgbGFiZWwgc2hvdWxkIGZsb2F0IHdoZW4gdGhlIHNlbGVjdGVkIG9wdGlvbiBoYXNcbiAgICAgIC8vIGEgbm9uLWVtcHR5IGRpc3BsYXkgdmFsdWUuIEZvciBhIGA8c2VsZWN0IG11bHRpcGxlPmAsIHRoZSBsYWJlbCAqYWx3YXlzKiBmbG9hdHMgdG8gYXZvaWRcbiAgICAgIC8vIG92ZXJsYXBwaW5nIHRoZSBsYWJlbCB3aXRoIHRoZSBvcHRpb25zLlxuICAgICAgY29uc3Qgc2VsZWN0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgIGNvbnN0IGZpcnN0T3B0aW9uOiBIVE1MT3B0aW9uRWxlbWVudCB8IHVuZGVmaW5lZCA9IHNlbGVjdEVsZW1lbnQub3B0aW9uc1swXTtcblxuICAgICAgLy8gT24gbW9zdCBicm93c2VycyB0aGUgYHNlbGVjdGVkSW5kZXhgIHdpbGwgYWx3YXlzIGJlIDAsIGhvd2V2ZXIgb24gSUUgYW5kIEVkZ2UgaXQnbGwgYmVcbiAgICAgIC8vIC0xIGlmIHRoZSBgdmFsdWVgIGlzIHNldCB0byBzb21ldGhpbmcsIHRoYXQgaXNuJ3QgaW4gdGhlIGxpc3Qgb2Ygb3B0aW9ucywgYXQgYSBsYXRlciBwb2ludC5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuZm9jdXNlZCB8fFxuICAgICAgICBzZWxlY3RFbGVtZW50Lm11bHRpcGxlIHx8XG4gICAgICAgICF0aGlzLmVtcHR5IHx8XG4gICAgICAgICEhKHNlbGVjdEVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+IC0xICYmIGZpcnN0T3B0aW9uICYmIGZpcnN0T3B0aW9uLmxhYmVsKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKGlkcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZHMuam9pbignICcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgLy8gRG8gbm90IHJlLWZvY3VzIHRoZSBpbnB1dCBlbGVtZW50IGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgZm9jdXNlZC4gT3RoZXJ3aXNlIGl0IGNhbiBoYXBwZW5cbiAgICAvLyB0aGF0IHNvbWVvbmUgY2xpY2tzIG9uIGEgdGltZSBpbnB1dCBhbmQgdGhlIGN1cnNvciByZXNldHMgdG8gdGhlIFwiaG91cnNcIiBmaWVsZCB3aGlsZSB0aGVcbiAgICAvLyBcIm1pbnV0ZXNcIiBmaWVsZCB3YXMgYWN0dWFsbHkgY2xpY2tlZC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xMjg0OVxuICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyBhIG5hdGl2ZSBzZWxlY3QgdGhhdCBpcyBkaXNwbGF5ZWQgaW5saW5lLiAqL1xuICBfaXNJbmxpbmVTZWxlY3QoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICByZXR1cm4gdGhpcy5faXNOYXRpdmVTZWxlY3QgJiYgKGVsZW1lbnQubXVsdGlwbGUgfHwgZWxlbWVudC5zaXplID4gMSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlYWRvbmx5OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0IG1heVxuICAvLyBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbn1cbiJdfQ==