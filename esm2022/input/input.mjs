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
import { booleanAttribute, Directive, ElementRef, inject, Inject, InjectionToken, Input, NgZone, Optional, Self, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, _ErrorStateTracker } from '@angular/material/core';
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
/** Injection token that can be used to provide the default options for the input. */
export const MAT_INPUT_CONFIG = new InjectionToken('MAT_INPUT_CONFIG');
export class MatInput {
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled() {
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
        this._ensureWheelDefaultBehavior();
    }
    /** An object used to control when error messages are shown. */
    get errorStateMatcher() {
        return this._errorStateTracker.matcher;
    }
    set errorStateMatcher(value) {
        this._errorStateTracker.matcher = value;
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
    /** Whether the input is in an error state. */
    get errorState() {
        return this._errorStateTracker.errorState;
    }
    set errorState(value) {
        this._errorStateTracker.errorState = value;
    }
    constructor(_elementRef, _platform, ngControl, parentForm, parentFormGroup, defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, _ngZone, 
    // TODO: Remove this once the legacy appearance has been removed. We only need
    // to inject the form field for determining whether the placeholder has been promoted.
    _formField) {
        this._elementRef = _elementRef;
        this._platform = _platform;
        this.ngControl = ngControl;
        this._autofillMonitor = _autofillMonitor;
        this._ngZone = _ngZone;
        this._formField = _formField;
        this._uid = `mat-input-${nextUniqueId++}`;
        this._webkitBlinkWheelListenerAttached = false;
        this._config = inject(MAT_INPUT_CONFIG, { optional: true });
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
        this._iOSKeyupListener = (event) => {
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
        };
        this._webkitBlinkWheelListener = () => {
            // This is a noop function and is used to enable mouse wheel input
            // on number inputs
            // on blink and webkit browsers.
        };
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
            _ngZone.runOutsideAngular(() => {
                _elementRef.nativeElement.addEventListener('keyup', this._iOSKeyupListener);
            });
        }
        this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, ngControl, parentFormGroup, parentForm, this.stateChanges);
        this._isServer = !this._platform.isBrowser;
        this._isNativeSelect = nodeName === 'select';
        this._isTextarea = nodeName === 'textarea';
        this._isInFormField = !!_formField;
        this.disabledInteractive = this._config?.disabledInteractive || false;
        if (this._isNativeSelect) {
            this.controlType = element.multiple
                ? 'mat-native-select-multiple'
                : 'mat-native-select';
        }
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
        if (this._platform.IOS) {
            this._elementRef.nativeElement.removeEventListener('keyup', this._iOSKeyupListener);
        }
        if (this._webkitBlinkWheelListenerAttached) {
            this._elementRef.nativeElement.removeEventListener('wheel', this._webkitBlinkWheelListener);
        }
    }
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
            // Since the input isn't a `ControlValueAccessor`, we don't have a good way of knowing when
            // the disabled state has changed. We can't use the `ngControl.statusChanges`, because it
            // won't fire if the input is disabled with `emitEvents = false`, despite the input becoming
            // disabled.
            if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
                this.disabled = this.ngControl.disabled;
                this.stateChanges.next();
            }
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
    /** Refreshes the error state of the input. */
    updateErrorState() {
        this._errorStateTracker.updateErrorState();
    }
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused) {
        if (isFocused === this.focused) {
            return;
        }
        if (!this._isNativeSelect && isFocused && this.disabled && this.disabledInteractive) {
            const element = this._elementRef.nativeElement;
            // Focusing an input that has text will cause all the text to be selected. Clear it since
            // the user won't be able to change it. This is based on the internal implementation.
            if (element.type === 'number') {
                // setSelectionRange doesn't work on number inputs so it needs to be set briefly to text.
                element.type = 'text';
                element.setSelectionRange(0, 0);
                element.type = 'number';
            }
            else {
                element.setSelectionRange(0, 0);
            }
        }
        this.focused = isFocused;
        this.stateChanges.next();
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
    /** Does some manual dirty checking on the native input `value` property. */
    _dirtyCheckNativeValue() {
        const newValue = this._elementRef.nativeElement.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }
    /** Does some manual dirty checking on the native input `placeholder` attribute. */
    _dirtyCheckPlaceholder() {
        const placeholder = this._getPlaceholder();
        if (placeholder !== this._previousPlaceholder) {
            const element = this._elementRef.nativeElement;
            this._previousPlaceholder = placeholder;
            placeholder
                ? element.setAttribute('placeholder', placeholder)
                : element.removeAttribute('placeholder');
        }
    }
    /** Gets the current placeholder of the form field. */
    _getPlaceholder() {
        return this.placeholder || null;
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
            return (this.focused && !this.disabled) || !this.empty;
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
    /**
     * In blink and webkit browsers a focused number input does not increment or decrement its value
     * on mouse wheel interaction unless a wheel event listener is attached to it or one of its ancestors or a passive wheel listener is attached somewhere in the DOM.
     * For example: Hitting a tooltip once enables the mouse wheel input for all number inputs as long as it exists.
     * In order to get reliable and intuitive behavior we apply a wheel event on our own
     * thus making sure increment and decrement by mouse wheel works every time.
     * @docs-private
     */
    _ensureWheelDefaultBehavior() {
        if (!this._webkitBlinkWheelListenerAttached &&
            this._type === 'number' &&
            (this._platform.BLINK || this._platform.WEBKIT)) {
            this._ngZone.runOutsideAngular(() => {
                this._elementRef.nativeElement.addEventListener('wheel', this._webkitBlinkWheelListener);
            });
            this._webkitBlinkWheelListenerAttached = true;
        }
        if (this._webkitBlinkWheelListenerAttached && this._type !== 'number') {
            this._elementRef.nativeElement.removeEventListener('wheel', this._webkitBlinkWheelListener);
            this._webkitBlinkWheelListenerAttached = true;
        }
    }
    /** Gets the value to set on the `readonly` attribute. */
    _getReadonlyAttribute() {
        if (this._isNativeSelect) {
            return null;
        }
        if (this.readonly || (this.disabled && this.disabledInteractive)) {
            return 'true';
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatInput, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: i2.NgControl, optional: true, self: true }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.ErrorStateMatcher }, { token: MAT_INPUT_VALUE_ACCESSOR, optional: true, self: true }, { token: i4.AutofillMonitor }, { token: i0.NgZone }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.2.0-next.2", type: MatInput, isStandalone: true, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", inputs: { disabled: "disabled", id: "id", placeholder: "placeholder", name: "name", required: "required", type: "type", errorStateMatcher: "errorStateMatcher", userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], value: "value", readonly: "readonly", disabledInteractive: ["disabledInteractive", "disabledInteractive", booleanAttribute] }, host: { listeners: { "focus": "_focusChanged(true)", "blur": "_focusChanged(false)", "input": "_onInput()" }, properties: { "class.mat-input-server": "_isServer", "class.mat-mdc-form-field-textarea-control": "_isInFormField && _isTextarea", "class.mat-mdc-form-field-input-control": "_isInFormField", "class.mat-mdc-input-disabled-interactive": "disabledInteractive", "class.mdc-text-field__input": "_isInFormField", "class.mat-mdc-native-select-inline": "_isInlineSelect()", "id": "id", "disabled": "disabled && !disabledInteractive", "required": "required", "attr.name": "name || null", "attr.readonly": "_getReadonlyAttribute()", "attr.aria-disabled": "disabled && disabledInteractive ? \"true\" : null", "attr.aria-invalid": "(empty && required) ? null : errorState", "attr.aria-required": "required", "attr.id": "id" }, classAttribute: "mat-mdc-input-element" }, providers: [{ provide: MatFormFieldControl, useExisting: MatInput }], exportAs: ["matInput"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatInput, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
                    exportAs: 'matInput',
                    host: {
                        'class': 'mat-mdc-input-element',
                        // The BaseMatInput parent class adds `mat-input-element`, `mat-form-field-control` and
                        // `mat-form-field-autofill-control` to the CSS class list, but this should not be added for
                        // this MDC equivalent input.
                        '[class.mat-input-server]': '_isServer',
                        '[class.mat-mdc-form-field-textarea-control]': '_isInFormField && _isTextarea',
                        '[class.mat-mdc-form-field-input-control]': '_isInFormField',
                        '[class.mat-mdc-input-disabled-interactive]': 'disabledInteractive',
                        '[class.mdc-text-field__input]': '_isInFormField',
                        '[class.mat-mdc-native-select-inline]': '_isInlineSelect()',
                        // Native input properties that are overwritten by Angular inputs need to be synced with
                        // the native input element. Otherwise property bindings for those don't work.
                        '[id]': 'id',
                        '[disabled]': 'disabled && !disabledInteractive',
                        '[required]': 'required',
                        '[attr.name]': 'name || null',
                        '[attr.readonly]': '_getReadonlyAttribute()',
                        '[attr.aria-disabled]': 'disabled && disabledInteractive ? "true" : null',
                        // Only mark the input as invalid for assistive technology if it has a value since the
                        // state usually overlaps with `aria-required` when the input is empty and can be redundant.
                        '[attr.aria-invalid]': '(empty && required) ? null : errorState',
                        '[attr.aria-required]': 'required',
                        // Native input properties that are overwritten by Angular inputs need to be synced with
                        // the native input element. Otherwise property bindings for those don't work.
                        '[attr.id]': 'id',
                        '(focus)': '_focusChanged(true)',
                        '(blur)': '_focusChanged(false)',
                        '(input)': '_onInput()',
                    },
                    providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i2.NgControl, decorators: [{
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
                }] }], propDecorators: { disabled: [{
                type: Input
            }], id: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], name: [{
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
            }], disabledInteractive: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFFVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsSUFBSSxHQUNMLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0YsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7OztBQUVoRSxxRkFBcUY7QUFDckYsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixRQUFRO0lBQ1IsVUFBVTtJQUNWLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBRUYsSUFB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O3dCQUNoQyxRQUFRLEVBQUUsc0JBQXNCO3dCQUNoQyxTQUFTLEVBQUUsWUFBWTtxQkFDeEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxVQUFVLEVBQUMsQ0FBQztvQkFDbEUsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzswQkE4TEksUUFBUTs7MEJBQUksSUFBSTs7MEJBQ2hCLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUVSLFFBQVE7OzBCQUFJLElBQUk7OzBCQUFJLE1BQU07MkJBQUMsd0JBQXdCOzswQkFLbkQsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxjQUFjO3lDQWxKaEMsUUFBUTtzQkFEWCxLQUFLO2dCQXFCRixFQUFFO3NCQURMLEtBQUs7Z0JBYUcsV0FBVztzQkFBbkIsS0FBSztnQkFNRyxJQUFJO3NCQUFaLEtBQUs7Z0JBT0YsUUFBUTtzQkFEWCxLQUFLO2dCQVdGLElBQUk7c0JBRFAsS0FBSztnQkFxQkYsaUJBQWlCO3NCQURwQixLQUFLO2dCQVlxQixtQkFBbUI7c0JBQTdDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQU9yQixLQUFLO3NCQURSLEtBQUs7Z0JBYUYsUUFBUTtzQkFEWCxLQUFLO2dCQVdOLG1CQUFtQjtzQkFEbEIsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzLCBQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QXV0b2ZpbGxNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvdGV4dC1maWVsZCc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBib29sZWFuQXR0cmlidXRlLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybSwgVmFsaWRhdG9yc30gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtFcnJvclN0YXRlTWF0Y2hlciwgX0Vycm9yU3RhdGVUcmFja2VyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbCwgTWF0Rm9ybUZpZWxkLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yfSBmcm9tICcuL2lucHV0LWVycm9ycyc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9pbnB1dC12YWx1ZS1hY2Nlc3Nvcic7XG5cbi8vIEludmFsaWQgaW5wdXQgdHlwZS4gVXNpbmcgb25lIG9mIHRoZXNlIHdpbGwgdGhyb3cgYW4gTWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvci5cbmNvbnN0IE1BVF9JTlBVVF9JTlZBTElEX1RZUEVTID0gW1xuICAnYnV0dG9uJyxcbiAgJ2NoZWNrYm94JyxcbiAgJ2ZpbGUnLFxuICAnaGlkZGVuJyxcbiAgJ2ltYWdlJyxcbiAgJ3JhZGlvJyxcbiAgJ3JhbmdlJyxcbiAgJ3Jlc2V0JyxcbiAgJ3N1Ym1pdCcsXG5dO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgaW5wdXQuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdElucHV0Q29uZmlnIHtcbiAgLyoqIFdoZXRoZXIgZGlzYWJsZWQgaW5wdXRzIHNob3VsZCBiZSBpbnRlcmFjdGl2ZS4gKi9cbiAgZGlzYWJsZWRJbnRlcmFjdGl2ZT86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBpbnB1dC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfSU5QVVRfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPE1hdElucHV0Q29uZmlnPignTUFUX0lOUFVUX0NPTkZJRycpO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRJbnB1dF0sIHRleHRhcmVhW21hdElucHV0XSwgc2VsZWN0W21hdE5hdGl2ZUNvbnRyb2xdLFxuICAgICAgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdYCxcbiAgZXhwb3J0QXM6ICdtYXRJbnB1dCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1pbnB1dC1lbGVtZW50JyxcbiAgICAvLyBUaGUgQmFzZU1hdElucHV0IHBhcmVudCBjbGFzcyBhZGRzIGBtYXQtaW5wdXQtZWxlbWVudGAsIGBtYXQtZm9ybS1maWVsZC1jb250cm9sYCBhbmRcbiAgICAvLyBgbWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbGAgdG8gdGhlIENTUyBjbGFzcyBsaXN0LCBidXQgdGhpcyBzaG91bGQgbm90IGJlIGFkZGVkIGZvclxuICAgIC8vIHRoaXMgTURDIGVxdWl2YWxlbnQgaW5wdXQuXG4gICAgJ1tjbGFzcy5tYXQtaW5wdXQtc2VydmVyXSc6ICdfaXNTZXJ2ZXInLFxuICAgICdbY2xhc3MubWF0LW1kYy1mb3JtLWZpZWxkLXRleHRhcmVhLWNvbnRyb2xdJzogJ19pc0luRm9ybUZpZWxkICYmIF9pc1RleHRhcmVhJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZm9ybS1maWVsZC1pbnB1dC1jb250cm9sXSc6ICdfaXNJbkZvcm1GaWVsZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWlucHV0LWRpc2FibGVkLWludGVyYWN0aXZlXSc6ICdkaXNhYmxlZEludGVyYWN0aXZlJyxcbiAgICAnW2NsYXNzLm1kYy10ZXh0LWZpZWxkX19pbnB1dF0nOiAnX2lzSW5Gb3JtRmllbGQnLFxuICAgICdbY2xhc3MubWF0LW1kYy1uYXRpdmUtc2VsZWN0LWlubGluZV0nOiAnX2lzSW5saW5lU2VsZWN0KCknLFxuICAgIC8vIE5hdGl2ZSBpbnB1dCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG92ZXJ3cml0dGVuIGJ5IEFuZ3VsYXIgaW5wdXRzIG5lZWQgdG8gYmUgc3luY2VkIHdpdGhcbiAgICAvLyB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQuIE90aGVyd2lzZSBwcm9wZXJ0eSBiaW5kaW5ncyBmb3IgdGhvc2UgZG9uJ3Qgd29yay5cbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQgJiYgIWRpc2FibGVkSW50ZXJhY3RpdmUnLFxuICAgICdbcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2F0dHIubmFtZV0nOiAnbmFtZSB8fCBudWxsJyxcbiAgICAnW2F0dHIucmVhZG9ubHldJzogJ19nZXRSZWFkb25seUF0dHJpYnV0ZSgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQgJiYgZGlzYWJsZWRJbnRlcmFjdGl2ZSA/IFwidHJ1ZVwiIDogbnVsbCcsXG4gICAgLy8gT25seSBtYXJrIHRoZSBpbnB1dCBhcyBpbnZhbGlkIGZvciBhc3Npc3RpdmUgdGVjaG5vbG9neSBpZiBpdCBoYXMgYSB2YWx1ZSBzaW5jZSB0aGVcbiAgICAvLyBzdGF0ZSB1c3VhbGx5IG92ZXJsYXBzIHdpdGggYGFyaWEtcmVxdWlyZWRgIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5IGFuZCBjYW4gYmUgcmVkdW5kYW50LlxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJyhlbXB0eSAmJiByZXF1aXJlZCkgPyBudWxsIDogZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAvLyBOYXRpdmUgaW5wdXQgcHJvcGVydGllcyB0aGF0IGFyZSBvdmVyd3JpdHRlbiBieSBBbmd1bGFyIGlucHV0cyBuZWVkIHRvIGJlIHN5bmNlZCB3aXRoXG4gICAgLy8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50LiBPdGhlcndpc2UgcHJvcGVydHkgYmluZGluZ3MgZm9yIHRob3NlIGRvbid0IHdvcmsuXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJyhmb2N1cyknOiAnX2ZvY3VzQ2hhbmdlZCh0cnVlKScsXG4gICAgJyhibHVyKSc6ICdfZm9jdXNDaGFuZ2VkKGZhbHNlKScsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0SW5wdXR9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5wdXRcbiAgaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBEb0NoZWNrXG57XG4gIHByb3RlY3RlZCBfdWlkID0gYG1hdC1pbnB1dC0ke25leHRVbmlxdWVJZCsrfWA7XG4gIHByb3RlY3RlZCBfcHJldmlvdXNOYXRpdmVWYWx1ZTogYW55O1xuICBwcml2YXRlIF9pbnB1dFZhbHVlQWNjZXNzb3I6IHt2YWx1ZTogYW55fTtcbiAgcHJpdmF0ZSBfcHJldmlvdXNQbGFjZWhvbGRlcjogc3RyaW5nIHwgbnVsbDtcbiAgcHJpdmF0ZSBfZXJyb3JTdGF0ZVRyYWNrZXI6IF9FcnJvclN0YXRlVHJhY2tlcjtcbiAgcHJpdmF0ZSBfd2Via2l0QmxpbmtXaGVlbExpc3RlbmVyQXR0YWNoZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY29uZmlnID0gaW5qZWN0KE1BVF9JTlBVVF9DT05GSUcsIHtvcHRpb25hbDogdHJ1ZX0pO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYmVpbmcgcmVuZGVyZWQgb24gdGhlIHNlcnZlci4gKi9cbiAgcmVhZG9ubHkgX2lzU2VydmVyOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSBuYXRpdmUgaHRtbCBzZWxlY3QuICovXG4gIHJlYWRvbmx5IF9pc05hdGl2ZVNlbGVjdDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGEgdGV4dGFyZWEuICovXG4gIHJlYWRvbmx5IF9pc1RleHRhcmVhOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBpbnNpZGUgb2YgYSBmb3JtIGZpZWxkLiAqL1xuICByZWFkb25seSBfaXNJbkZvcm1GaWVsZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb250cm9sVHlwZTogc3RyaW5nID0gJ21hdC1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXV0b2ZpbGxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBCcm93c2VycyBtYXkgbm90IGZpcmUgdGhlIGJsdXIgZXZlbnQgaWYgdGhlIGlucHV0IGlzIGRpc2FibGVkIHRvbyBxdWlja2x5LlxuICAgIC8vIFJlc2V0IGZyb20gaGVyZSB0byBlbnN1cmUgdGhhdCB0aGUgZWxlbWVudCBkb2Vzbid0IGJlY29tZSBzdHVjay5cbiAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2lkID0gdmFsdWUgfHwgdGhpcy5fdWlkO1xuICB9XG4gIHByb3RlY3RlZCBfaWQ6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQgPz8gdGhpcy5uZ0NvbnRyb2w/LmNvbnRyb2w/Lmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLnJlcXVpcmVkKSA/PyBmYWxzZTtcbiAgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3JlcXVpcmVkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBJbnB1dCB0eXBlIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG4gIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgJ3RleHQnO1xuICAgIHRoaXMuX3ZhbGlkYXRlVHlwZSgpO1xuXG4gICAgLy8gV2hlbiB1c2luZyBBbmd1bGFyIGlucHV0cywgZGV2ZWxvcGVycyBhcmUgbm8gbG9uZ2VyIGFibGUgdG8gc2V0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSBuYXRpdmVcbiAgICAvLyBpbnB1dCBlbGVtZW50LiBUbyBlbnN1cmUgdGhhdCBiaW5kaW5ncyBmb3IgYHR5cGVgIHdvcmssIHdlIG5lZWQgdG8gc3luYyB0aGUgc2V0dGVyXG4gICAgLy8gd2l0aCB0aGUgbmF0aXZlIHByb3BlcnR5LiBUZXh0YXJlYSBlbGVtZW50cyBkb24ndCBzdXBwb3J0IHRoZSB0eXBlIHByb3BlcnR5IG9yIGF0dHJpYnV0ZS5cbiAgICBpZiAoIXRoaXMuX2lzVGV4dGFyZWEgJiYgZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpLmhhcyh0aGlzLl90eXBlKSkge1xuICAgICAgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS50eXBlID0gdGhpcy5fdHlwZTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbnN1cmVXaGVlbERlZmF1bHRCZWhhdmlvcigpO1xuICB9XG4gIHByb3RlY3RlZCBfdHlwZSA9ICd0ZXh0JztcblxuICAvKiogQW4gb2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGVycm9yU3RhdGVNYXRjaGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9lcnJvclN0YXRlVHJhY2tlci5tYXRjaGVyO1xuICB9XG4gIHNldCBlcnJvclN0YXRlTWF0Y2hlcih2YWx1ZTogRXJyb3JTdGF0ZU1hdGNoZXIpIHtcbiAgICB0aGlzLl9lcnJvclN0YXRlVHJhY2tlci5tYXRjaGVyID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgcmVhZG9ubHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZG9ubHk7XG4gIH1cbiAgc2V0IHJlYWRvbmx5KHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9yZWFkb25seSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVhZG9ubHkgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgc2hvdWxkIHJlbWFpbiBpbnRlcmFjdGl2ZSB3aGVuIGl0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGRpc2FibGVkSW50ZXJhY3RpdmU6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICBnZXQgZXJyb3JTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIuZXJyb3JTdGF0ZTtcbiAgfVxuICBzZXQgZXJyb3JTdGF0ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyLmVycm9yU3RhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV2ZXJFbXB0eUlucHV0VHlwZXMgPSBbXG4gICAgJ2RhdGUnLFxuICAgICdkYXRldGltZScsXG4gICAgJ2RhdGV0aW1lLWxvY2FsJyxcbiAgICAnbW9udGgnLFxuICAgICd0aW1lJyxcbiAgICAnd2VlaycsXG4gIF0uZmlsdGVyKHQgPT4gZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpLmhhcyh0KSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ+LFxuICAgIHByb3RlY3RlZCBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IpIGlucHV0VmFsdWVBY2Nlc3NvcjogYW55LFxuICAgIHByaXZhdGUgX2F1dG9maWxsTW9uaXRvcjogQXV0b2ZpbGxNb25pdG9yLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIG9uY2UgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIGhhcyBiZWVuIHJlbW92ZWQuIFdlIG9ubHkgbmVlZFxuICAgIC8vIHRvIGluamVjdCB0aGUgZm9ybSBmaWVsZCBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgcGxhY2Vob2xkZXIgaGFzIGJlZW4gcHJvbW90ZWQuXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJvdGVjdGVkIF9mb3JtRmllbGQ/OiBNYXRGb3JtRmllbGQsXG4gICkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBJZiBubyBpbnB1dCB2YWx1ZSBhY2Nlc3NvciB3YXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIHVzZSB0aGUgZWxlbWVudCBhcyB0aGUgaW5wdXQgdmFsdWVcbiAgICAvLyBhY2Nlc3Nvci5cbiAgICB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IgPSBpbnB1dFZhbHVlQWNjZXNzb3IgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuXG4gICAgLy8gT24gc29tZSB2ZXJzaW9ucyBvZiBpT1MgdGhlIGNhcmV0IGdldHMgc3R1Y2sgaW4gdGhlIHdyb25nIHBsYWNlIHdoZW4gaG9sZGluZyBkb3duIHRoZSBkZWxldGVcbiAgICAvLyBrZXkuIEluIG9yZGVyIHRvIGdldCBhcm91bmQgdGhpcyB3ZSBuZWVkIHRvIFwiamlnZ2xlXCIgdGhlIGNhcmV0IGxvb3NlLiBTaW5jZSB0aGlzIGJ1ZyBvbmx5XG4gICAgLy8gZXhpc3RzIG9uIGlPUywgd2Ugb25seSBib3RoZXIgdG8gaW5zdGFsbCB0aGUgbGlzdGVuZXIgb24gaU9TLlxuICAgIGlmIChfcGxhdGZvcm0uSU9TKSB7XG4gICAgICBfbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2lPU0tleXVwTGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIgPSBuZXcgX0Vycm9yU3RhdGVUcmFja2VyKFxuICAgICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgbmdDb250cm9sLFxuICAgICAgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgcGFyZW50Rm9ybSxcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLFxuICAgICk7XG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyO1xuICAgIHRoaXMuX2lzTmF0aXZlU2VsZWN0ID0gbm9kZU5hbWUgPT09ICdzZWxlY3QnO1xuICAgIHRoaXMuX2lzVGV4dGFyZWEgPSBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJztcbiAgICB0aGlzLl9pc0luRm9ybUZpZWxkID0gISFfZm9ybUZpZWxkO1xuICAgIHRoaXMuZGlzYWJsZWRJbnRlcmFjdGl2ZSA9IHRoaXMuX2NvbmZpZz8uZGlzYWJsZWRJbnRlcmFjdGl2ZSB8fCBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgdGhpcy5jb250cm9sVHlwZSA9IChlbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50KS5tdWx0aXBsZVxuICAgICAgICA/ICdtYXQtbmF0aXZlLXNlbGVjdC1tdWx0aXBsZSdcbiAgICAgICAgOiAnbWF0LW5hdGl2ZS1zZWxlY3QnO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2ZpbGxlZCA9IGV2ZW50LmlzQXV0b2ZpbGxlZDtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5JT1MpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2lPU0tleXVwTGlzdGVuZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl93ZWJraXRCbGlua1doZWVsTGlzdGVuZXJBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5fd2Via2l0QmxpbmtXaGVlbExpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuXG4gICAgICAvLyBTaW5jZSB0aGUgaW5wdXQgaXNuJ3QgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgLCB3ZSBkb24ndCBoYXZlIGEgZ29vZCB3YXkgb2Yga25vd2luZyB3aGVuXG4gICAgICAvLyB0aGUgZGlzYWJsZWQgc3RhdGUgaGFzIGNoYW5nZWQuIFdlIGNhbid0IHVzZSB0aGUgYG5nQ29udHJvbC5zdGF0dXNDaGFuZ2VzYCwgYmVjYXVzZSBpdFxuICAgICAgLy8gd29uJ3QgZmlyZSBpZiB0aGUgaW5wdXQgaXMgZGlzYWJsZWQgd2l0aCBgZW1pdEV2ZW50cyA9IGZhbHNlYCwgZGVzcGl0ZSB0aGUgaW5wdXQgYmVjb21pbmdcbiAgICAgIC8vIGRpc2FibGVkLlxuICAgICAgaWYgKHRoaXMubmdDb250cm9sLmRpc2FibGVkICE9PSBudWxsICYmIHRoaXMubmdDb250cm9sLmRpc2FibGVkICE9PSB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgdGhlIG5hdGl2ZSBlbGVtZW50J3MgdmFsdWUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWUgY2FzZXMgd2hlcmVcbiAgICAvLyB3ZSB3b24ndCBiZSBub3RpZmllZCB3aGVuIGl0IGNoYW5nZXMgKGUuZy4gdGhlIGNvbnN1bWVyIGlzbid0IHVzaW5nIGZvcm1zIG9yIHRoZXkncmVcbiAgICAvLyB1cGRhdGluZyB0aGUgdmFsdWUgdXNpbmcgYGVtaXRFdmVudDogZmFsc2VgKS5cbiAgICB0aGlzLl9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgYW5kIHNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG91cnNlbHZlcywgYmVjYXVzZSB3aGV0aGVyIGl0J3NcbiAgICAvLyBwcmVzZW50IG9yIG5vdCBkZXBlbmRzIG9uIGEgcXVlcnkgd2hpY2ggaXMgcHJvbmUgdG8gXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgdGhpcy5fZGlydHlDaGVja1BsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogUmVmcmVzaGVzIHRoZSBlcnJvciBzdGF0ZSBvZiB0aGUgaW5wdXQuICovXG4gIHVwZGF0ZUVycm9yU3RhdGUoKSB7XG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIGlucHV0IGNoYW5nZXMuICovXG4gIF9mb2N1c0NoYW5nZWQoaXNGb2N1c2VkOiBib29sZWFuKSB7XG4gICAgaWYgKGlzRm9jdXNlZCA9PT0gdGhpcy5mb2N1c2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9pc05hdGl2ZVNlbGVjdCAmJiBpc0ZvY3VzZWQgJiYgdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmRpc2FibGVkSW50ZXJhY3RpdmUpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgICAgLy8gRm9jdXNpbmcgYW4gaW5wdXQgdGhhdCBoYXMgdGV4dCB3aWxsIGNhdXNlIGFsbCB0aGUgdGV4dCB0byBiZSBzZWxlY3RlZC4gQ2xlYXIgaXQgc2luY2VcbiAgICAgIC8vIHRoZSB1c2VyIHdvbid0IGJlIGFibGUgdG8gY2hhbmdlIGl0LiBUaGlzIGlzIGJhc2VkIG9uIHRoZSBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIC8vIHNldFNlbGVjdGlvblJhbmdlIGRvZXNuJ3Qgd29yayBvbiBudW1iZXIgaW5wdXRzIHNvIGl0IG5lZWRzIHRvIGJlIHNldCBicmllZmx5IHRvIHRleHQuXG4gICAgICAgIGVsZW1lbnQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSgwLCAwKTtcbiAgICAgICAgZWxlbWVudC50eXBlID0gJ251bWJlcic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKDAsIDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBfb25JbnB1dCgpIHtcbiAgICAvLyBUaGlzIGlzIGEgbm9vcCBmdW5jdGlvbiBhbmQgaXMgdXNlZCB0byBsZXQgQW5ndWxhciBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIC8vIEFuZ3VsYXIgd2lsbCBydW4gYSBuZXcgY2hhbmdlIGRldGVjdGlvbiBlYWNoIHRpbWUgdGhlIGBpbnB1dGAgZXZlbnQgaGFzIGJlZW4gZGlzcGF0Y2hlZC5cbiAgICAvLyBJdCdzIG5lY2Vzc2FyeSB0aGF0IEFuZ3VsYXIgcmVjb2duaXplcyB0aGUgdmFsdWUgY2hhbmdlLCBiZWNhdXNlIHdoZW4gZmxvYXRpbmdMYWJlbFxuICAgIC8vIGlzIHNldCB0byBmYWxzZSBhbmQgQW5ndWxhciBmb3JtcyBhcmVuJ3QgdXNlZCwgdGhlIHBsYWNlaG9sZGVyIHdvbid0IHJlY29nbml6ZSB0aGVcbiAgICAvLyB2YWx1ZSBjaGFuZ2VzIGFuZCB3aWxsIG5vdCBkaXNhcHBlYXIuXG4gICAgLy8gTGlzdGVuaW5nIHRvIHRoZSBpbnB1dCBldmVudCB3b3VsZG4ndCBiZSBuZWNlc3Nhcnkgd2hlbiB0aGUgaW5wdXQgaXMgdXNpbmcgdGhlXG4gICAgLy8gRm9ybXNNb2R1bGUgb3IgUmVhY3RpdmVGb3Jtc01vZHVsZSwgYmVjYXVzZSBBbmd1bGFyIGZvcm1zIGFsc28gbGlzdGVucyB0byBpbnB1dCBldmVudHMuXG4gIH1cblxuICAvKiogRG9lcyBzb21lIG1hbnVhbCBkaXJ0eSBjaGVja2luZyBvbiB0aGUgbmF0aXZlIGlucHV0IGB2YWx1ZWAgcHJvcGVydHkuICovXG4gIHByb3RlY3RlZCBfZGlydHlDaGVja05hdGl2ZVZhbHVlKCkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZS4gKi9cbiAgcHJpdmF0ZSBfZGlydHlDaGVja1BsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fZ2V0UGxhY2Vob2xkZXIoKTtcbiAgICBpZiAocGxhY2Vob2xkZXIgIT09IHRoaXMuX3ByZXZpb3VzUGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLl9wcmV2aW91c1BsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gICAgICBwbGFjZWhvbGRlclxuICAgICAgICA/IGVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyKVxuICAgICAgICA6IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHBsYWNlaG9sZGVyIG9mIHRoZSBmb3JtIGZpZWxkLiAqL1xuICBwcm90ZWN0ZWQgX2dldFBsYWNlaG9sZGVyKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyIHx8IG51bGw7XG4gIH1cblxuICAvKiogTWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBhIHN1cHBvcnRlZCB0eXBlLiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlVHlwZSgpIHtcbiAgICBpZiAoXG4gICAgICBNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTEgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpXG4gICAgKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yKHRoaXMuX3R5cGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgdHlwZSBpcyBvbmUgb2YgdGhlIHR5cGVzIHRoYXQgYXJlIG5ldmVyIGVtcHR5LiAqL1xuICBwcm90ZWN0ZWQgX2lzTmV2ZXJFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmV2ZXJFbXB0eUlucHV0VHlwZXMuaW5kZXhPZih0aGlzLl90eXBlKSA+IC0xO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBpbnZhbGlkIGJhc2VkIG9uIHRoZSBuYXRpdmUgdmFsaWRhdGlvbi4gKi9cbiAgcHJvdGVjdGVkIF9pc0JhZElucHV0KCkge1xuICAgIC8vIFRoZSBgdmFsaWRpdHlgIHByb3BlcnR5IHdvbid0IGJlIHByZXNlbnQgb24gcGxhdGZvcm0tc2VydmVyLlxuICAgIGxldCB2YWxpZGl0eSA9ICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsaWRpdHk7XG4gICAgcmV0dXJuIHZhbGlkaXR5ICYmIHZhbGlkaXR5LmJhZElucHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5faXNOZXZlckVtcHR5KCkgJiZcbiAgICAgICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiZcbiAgICAgICF0aGlzLl9pc0JhZElucHV0KCkgJiZcbiAgICAgICF0aGlzLmF1dG9maWxsZWRcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0aW9uIGA8c2VsZWN0PmAsIHRoZSBsYWJlbCBzaG91bGQgZmxvYXQgd2hlbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIGhhc1xuICAgICAgLy8gYSBub24tZW1wdHkgZGlzcGxheSB2YWx1ZS4gRm9yIGEgYDxzZWxlY3QgbXVsdGlwbGU+YCwgdGhlIGxhYmVsICphbHdheXMqIGZsb2F0cyB0byBhdm9pZFxuICAgICAgLy8gb3ZlcmxhcHBpbmcgdGhlIGxhYmVsIHdpdGggdGhlIG9wdGlvbnMuXG4gICAgICBjb25zdCBzZWxlY3RFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgICAgY29uc3QgZmlyc3RPcHRpb246IEhUTUxPcHRpb25FbGVtZW50IHwgdW5kZWZpbmVkID0gc2VsZWN0RWxlbWVudC5vcHRpb25zWzBdO1xuXG4gICAgICAvLyBPbiBtb3N0IGJyb3dzZXJzIHRoZSBgc2VsZWN0ZWRJbmRleGAgd2lsbCBhbHdheXMgYmUgMCwgaG93ZXZlciBvbiBJRSBhbmQgRWRnZSBpdCdsbCBiZVxuICAgICAgLy8gLTEgaWYgdGhlIGB2YWx1ZWAgaXMgc2V0IHRvIHNvbWV0aGluZywgdGhhdCBpc24ndCBpbiB0aGUgbGlzdCBvZiBvcHRpb25zLCBhdCBhIGxhdGVyIHBvaW50LlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5mb2N1c2VkIHx8XG4gICAgICAgIHNlbGVjdEVsZW1lbnQubXVsdGlwbGUgfHxcbiAgICAgICAgIXRoaXMuZW1wdHkgfHxcbiAgICAgICAgISEoc2VsZWN0RWxlbWVudC5zZWxlY3RlZEluZGV4ID4gLTEgJiYgZmlyc3RPcHRpb24gJiYgZmlyc3RPcHRpb24ubGFiZWwpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKHRoaXMuZm9jdXNlZCAmJiAhdGhpcy5kaXNhYmxlZCkgfHwgIXRoaXMuZW1wdHk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIGlmIChpZHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWRzLmpvaW4oJyAnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgIC8vIERvIG5vdCByZS1mb2N1cyB0aGUgaW5wdXQgZWxlbWVudCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGZvY3VzZWQuIE90aGVyd2lzZSBpdCBjYW4gaGFwcGVuXG4gICAgLy8gdGhhdCBzb21lb25lIGNsaWNrcyBvbiBhIHRpbWUgaW5wdXQgYW5kIHRoZSBjdXJzb3IgcmVzZXRzIHRvIHRoZSBcImhvdXJzXCIgZmllbGQgd2hpbGUgdGhlXG4gICAgLy8gXCJtaW51dGVzXCIgZmllbGQgd2FzIGFjdHVhbGx5IGNsaWNrZWQuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTI4NDlcbiAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgYSBuYXRpdmUgc2VsZWN0IHRoYXQgaXMgZGlzcGxheWVkIGlubGluZS4gKi9cbiAgX2lzSW5saW5lU2VsZWN0KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgcmV0dXJuIHRoaXMuX2lzTmF0aXZlU2VsZWN0ICYmIChlbGVtZW50Lm11bHRpcGxlIHx8IGVsZW1lbnQuc2l6ZSA+IDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaU9TS2V5dXBMaXN0ZW5lciA9IChldmVudDogRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgLy8gTm90ZTogV2Ugc3BlY2lmaWNhbGx5IGNoZWNrIGZvciAwLCByYXRoZXIgdGhhbiBgIWVsLnNlbGVjdGlvblN0YXJ0YCwgYmVjYXVzZSB0aGUgdHdvXG4gICAgLy8gaW5kaWNhdGUgZGlmZmVyZW50IHRoaW5ncy4gSWYgdGhlIHZhbHVlIGlzIDAsIGl0IG1lYW5zIHRoYXQgdGhlIGNhcmV0IGlzIGF0IHRoZSBzdGFydFxuICAgIC8vIG9mIHRoZSBpbnB1dCwgd2hlcmVhcyBhIHZhbHVlIG9mIGBudWxsYCBtZWFucyB0aGF0IHRoZSBpbnB1dCBkb2Vzbid0IHN1cHBvcnRcbiAgICAvLyBtYW5pcHVsYXRpbmcgdGhlIHNlbGVjdGlvbiByYW5nZS4gSW5wdXRzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBzZXR0aW5nIHRoZSBzZWxlY3Rpb24gcmFuZ2VcbiAgICAvLyB3aWxsIHRocm93IGFuIGVycm9yIHNvIHdlIHdhbnQgdG8gYXZvaWQgY2FsbGluZyBgc2V0U2VsZWN0aW9uUmFuZ2VgIG9uIHRoZW0uIFNlZTpcbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbnB1dC5odG1sI2RvLW5vdC1hcHBseVxuICAgIGlmICghZWwudmFsdWUgJiYgZWwuc2VsZWN0aW9uU3RhcnQgPT09IDAgJiYgZWwuc2VsZWN0aW9uRW5kID09PSAwKSB7XG4gICAgICAvLyBOb3RlOiBKdXN0IHNldHRpbmcgYDAsIDBgIGRvZXNuJ3QgZml4IHRoZSBpc3N1ZS4gU2V0dGluZ1xuICAgICAgLy8gYDEsIDFgIGZpeGVzIGl0IGZvciB0aGUgZmlyc3QgdGltZSB0aGF0IHlvdSB0eXBlIHRleHQgYW5kXG4gICAgICAvLyB0aGVuIGhvbGQgZGVsZXRlLiBUb2dnbGluZyB0byBgMSwgMWAgYW5kIHRoZW4gYmFjayB0b1xuICAgICAgLy8gYDAsIDBgIHNlZW1zIHRvIGNvbXBsZXRlbHkgZml4IGl0LlxuICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMSwgMSk7XG4gICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZSgwLCAwKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBfd2Via2l0QmxpbmtXaGVlbExpc3RlbmVyID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIFRoaXMgaXMgYSBub29wIGZ1bmN0aW9uIGFuZCBpcyB1c2VkIHRvIGVuYWJsZSBtb3VzZSB3aGVlbCBpbnB1dFxuICAgIC8vIG9uIG51bWJlciBpbnB1dHNcbiAgICAvLyBvbiBibGluayBhbmQgd2Via2l0IGJyb3dzZXJzLlxuICB9O1xuXG4gIC8qKlxuICAgKiBJbiBibGluayBhbmQgd2Via2l0IGJyb3dzZXJzIGEgZm9jdXNlZCBudW1iZXIgaW5wdXQgZG9lcyBub3QgaW5jcmVtZW50IG9yIGRlY3JlbWVudCBpdHMgdmFsdWVcbiAgICogb24gbW91c2Ugd2hlZWwgaW50ZXJhY3Rpb24gdW5sZXNzIGEgd2hlZWwgZXZlbnQgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gaXQgb3Igb25lIG9mIGl0cyBhbmNlc3RvcnMgb3IgYSBwYXNzaXZlIHdoZWVsIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHNvbWV3aGVyZSBpbiB0aGUgRE9NLlxuICAgKiBGb3IgZXhhbXBsZTogSGl0dGluZyBhIHRvb2x0aXAgb25jZSBlbmFibGVzIHRoZSBtb3VzZSB3aGVlbCBpbnB1dCBmb3IgYWxsIG51bWJlciBpbnB1dHMgYXMgbG9uZyBhcyBpdCBleGlzdHMuXG4gICAqIEluIG9yZGVyIHRvIGdldCByZWxpYWJsZSBhbmQgaW50dWl0aXZlIGJlaGF2aW9yIHdlIGFwcGx5IGEgd2hlZWwgZXZlbnQgb24gb3VyIG93blxuICAgKiB0aHVzIG1ha2luZyBzdXJlIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ5IG1vdXNlIHdoZWVsIHdvcmtzIGV2ZXJ5IHRpbWUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgX2Vuc3VyZVdoZWVsRGVmYXVsdEJlaGF2aW9yKCk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgICF0aGlzLl93ZWJraXRCbGlua1doZWVsTGlzdGVuZXJBdHRhY2hlZCAmJlxuICAgICAgdGhpcy5fdHlwZSA9PT0gJ251bWJlcicgJiZcbiAgICAgICh0aGlzLl9wbGF0Zm9ybS5CTElOSyB8fCB0aGlzLl9wbGF0Zm9ybS5XRUJLSVQpXG4gICAgKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLl93ZWJraXRCbGlua1doZWVsTGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl93ZWJraXRCbGlua1doZWVsTGlzdGVuZXJBdHRhY2hlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3dlYmtpdEJsaW5rV2hlZWxMaXN0ZW5lckF0dGFjaGVkICYmIHRoaXMuX3R5cGUgIT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLl93ZWJraXRCbGlua1doZWVsTGlzdGVuZXIpO1xuICAgICAgdGhpcy5fd2Via2l0QmxpbmtXaGVlbExpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSB0byBzZXQgb24gdGhlIGByZWFkb25seWAgYXR0cmlidXRlLiAqL1xuICBwcm90ZWN0ZWQgX2dldFJlYWRvbmx5QXR0cmlidXRlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVhZG9ubHkgfHwgKHRoaXMuZGlzYWJsZWQgJiYgdGhpcy5kaXNhYmxlZEludGVyYWN0aXZlKSkge1xuICAgICAgcmV0dXJuICd0cnVlJztcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19