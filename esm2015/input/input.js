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
import { Directive, ElementRef, HostListener, Inject, Input, NgZone, Optional, Self, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState, } from '@angular/material/core';
import { MatFormFieldControl, MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { getMatInputUnsupportedTypeError } from './input-errors';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
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
    'submit'
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
    constructor(_elementRef, _platform, 
    /** @docs-private */
    ngControl, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, ngZone, 
    // TODO: Remove this once the legacy appearance has been removed. We only need
    // to inject the form-field for determining whether the placeholder has been promoted.
    _formField) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this._elementRef = _elementRef;
        this._platform = _platform;
        this.ngControl = ngControl;
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
        this._required = false;
        this._type = 'text';
        this._readonly = false;
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
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
            this.controlType = element.multiple ? 'mat-native-select-multiple' :
                'mat-native-select';
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
    get id() { return this._id; }
    set id(value) { this._id = value || this._uid; }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required() { return this._required; }
    set required(value) { this._required = coerceBooleanProperty(value); }
    /** Input type of the element. */
    get type() { return this._type; }
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
    get value() { return this._inputValueAccessor.value; }
    set value(value) {
        if (value !== this.value) {
            this._inputValueAccessor.value = value;
            this.stateChanges.next();
        }
    }
    /** Whether the element is readonly. */
    get readonly() { return this._readonly; }
    set readonly(value) { this._readonly = coerceBooleanProperty(value); }
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
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    /** Callback for the cases where the focused state of the input changes. */
    // tslint:disable:no-host-decorator-in-concrete
    // tslint:enable:no-host-decorator-in-concrete
    _focusChanged(isFocused) {
        if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    }
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
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
        var _a, _b;
        // If we're hiding the native placeholder, it should also be cleared from the DOM, otherwise
        // screen readers will read it out twice: once from the label and once from the attribute.
        // TODO: can be removed once we get rid of the `legacy` style for the form field, because it's
        // the only one that supports promoting the placeholder to a label.
        const placeholder = ((_b = (_a = this._formField) === null || _a === void 0 ? void 0 : _a._hideControlPlaceholder) === null || _b === void 0 ? void 0 : _b.call(_a)) ? null : this.placeholder;
        if (placeholder !== this._previousPlaceholder) {
            const element = this._elementRef.nativeElement;
            this._previousPlaceholder = placeholder;
            placeholder ?
                element.setAttribute('placeholder', placeholder) : element.removeAttribute('placeholder');
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
        return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() &&
            !this.autofilled;
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
            return this.focused || selectElement.multiple || !this.empty ||
                !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label);
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
}
MatInput.decorators = [
    { type: Directive, args: [{
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
                    // Only mark the input as invalid for assistive technology if it has a value since the
                    // state usually overlaps with `aria-required` when the input is empty and can be redundant.
                    '[attr.aria-invalid]': 'errorState && !empty',
                    '[attr.aria-required]': 'required',
                },
                providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
            },] }
];
MatInput.ctorParameters = () => [
    { type: ElementRef },
    { type: Platform },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] },
    { type: NgForm, decorators: [{ type: Optional }] },
    { type: FormGroupDirective, decorators: [{ type: Optional }] },
    { type: ErrorStateMatcher },
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [MAT_INPUT_VALUE_ACCESSOR,] }] },
    { type: AutofillMonitor },
    { type: NgZone },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }] }
];
MatInput.propDecorators = {
    disabled: [{ type: Input }],
    id: [{ type: Input }],
    placeholder: [{ type: Input }],
    required: [{ type: Input }],
    type: [{ type: Input }],
    errorStateMatcher: [{ type: Input }],
    userAriaDescribedBy: [{ type: Input, args: ['aria-describedby',] }],
    value: [{ type: Input }],
    readonly: [{ type: Input }],
    _focusChanged: [{ type: HostListener, args: ['focus', ['true'],] }, { type: HostListener, args: ['blur', ['false'],] }],
    _onInput: [{ type: HostListener, args: ['input',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0YsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUdoRSxxRkFBcUY7QUFDckYsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixRQUFRO0lBQ1IsVUFBVTtJQUNWLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBRUYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLCtDQUErQztBQUMv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LFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyx3QkFBd0I7WUF2T2xELGVBQWU7WUFTckIsTUFBTTtZQVlxQixZQUFZLHVCQXVObEMsUUFBUSxZQUFJLE1BQU0sU0FBQyxjQUFjOzs7dUJBN0dyQyxLQUFLO2lCQXVCTCxLQUFLOzBCQVNMLEtBQUs7dUJBTUwsS0FBSzttQkFNTCxLQUFLO2dDQWdCTCxLQUFLO2tDQU1MLEtBQUssU0FBQyxrQkFBa0I7b0JBTXhCLEtBQUs7dUJBVUwsS0FBSzs0QkFrSUwsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUM5QixZQUFZLFNBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO3VCQWM5QixZQUFZLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzLCBQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QXV0b2ZpbGxNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvdGV4dC1maWVsZCc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmUsIE5nQ29udHJvbCwgTmdGb3JtfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgbWl4aW5FcnJvclN0YXRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbCwgTWF0Rm9ybUZpZWxkLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yfSBmcm9tICcuL2lucHV0LWVycm9ycyc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9pbnB1dC12YWx1ZS1hY2Nlc3Nvcic7XG5cblxuLy8gSW52YWxpZCBpbnB1dCB0eXBlLiBVc2luZyBvbmUgb2YgdGhlc2Ugd2lsbCB0aHJvdyBhbiBNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yLlxuY29uc3QgTUFUX0lOUFVUX0lOVkFMSURfVFlQRVMgPSBbXG4gICdidXR0b24nLFxuICAnY2hlY2tib3gnLFxuICAnZmlsZScsXG4gICdoaWRkZW4nLFxuICAnaW1hZ2UnLFxuICAncmFkaW8nLFxuICAncmFuZ2UnLFxuICAncmVzZXQnLFxuICAnc3VibWl0J1xuXTtcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0SW5wdXQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdElucHV0QmFzZSA9IG1peGluRXJyb3JTdGF0ZShjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge31cbn0pO1xuXG4vKiogRGlyZWN0aXZlIHRoYXQgYWxsb3dzIGEgbmF0aXZlIGlucHV0IHRvIHdvcmsgaW5zaWRlIGEgYE1hdEZvcm1GaWVsZGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRJbnB1dF0sIHRleHRhcmVhW21hdElucHV0XSwgc2VsZWN0W21hdE5hdGl2ZUNvbnRyb2xdLFxuICAgICAgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdYCxcbiAgZXhwb3J0QXM6ICdtYXRJbnB1dCcsXG4gIGhvc3Q6IHtcbiAgICAvKipcbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSAubWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCBpbiBmYXZvciBvZiBBdXRvZmlsbE1vbml0b3IuXG4gICAgICovXG4gICAgJ2NsYXNzJzogJ21hdC1pbnB1dC1lbGVtZW50IG1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2wnLFxuICAgICdbY2xhc3MubWF0LWlucHV0LXNlcnZlcl0nOiAnX2lzU2VydmVyJyxcbiAgICAvLyBOYXRpdmUgaW5wdXQgcHJvcGVydGllcyB0aGF0IGFyZSBvdmVyd3JpdHRlbiBieSBBbmd1bGFyIGlucHV0cyBuZWVkIHRvIGJlIHN5bmNlZCB3aXRoXG4gICAgLy8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50LiBPdGhlcndpc2UgcHJvcGVydHkgYmluZGluZ3MgZm9yIHRob3NlIGRvbid0IHdvcmsuXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgLy8gQXQgdGhlIHRpbWUgb2Ygd3JpdGluZywgd2UgaGF2ZSBhIGxvdCBvZiBjdXN0b21lciB0ZXN0cyB0aGF0IGxvb2sgdXAgdGhlIGlucHV0IGJhc2VkIG9uIGl0c1xuICAgIC8vIHBsYWNlaG9sZGVyLiBTaW5jZSB3ZSBzb21ldGltZXMgb21pdCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZyb20gdGhlIERPTSB0byBwcmV2ZW50IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgZnJvbSByZWFkaW5nIGl0IHR3aWNlLCB3ZSBoYXZlIHRvIGtlZXAgaXQgc29tZXdoZXJlIGluIHRoZSBET00gZm9yIHRoZSBsb29rdXAuXG4gICAgJ1thdHRyLmRhdGEtcGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tyZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbYXR0ci5yZWFkb25seV0nOiAncmVhZG9ubHkgJiYgIV9pc05hdGl2ZVNlbGVjdCB8fCBudWxsJyxcbiAgICAvLyBPbmx5IG1hcmsgdGhlIGlucHV0IGFzIGludmFsaWQgZm9yIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IGlmIGl0IGhhcyBhIHZhbHVlIHNpbmNlIHRoZVxuICAgIC8vIHN0YXRlIHVzdWFsbHkgb3ZlcmxhcHMgd2l0aCBgYXJpYS1yZXF1aXJlZGAgd2hlbiB0aGUgaW5wdXQgaXMgZW1wdHkgYW5kIGNhbiBiZSByZWR1bmRhbnQuXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZSAmJiAhZW1wdHknLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0SW5wdXR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5wdXQgZXh0ZW5kcyBfTWF0SW5wdXRCYXNlIGltcGxlbWVudHMgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBEb0NoZWNrLCBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgcHJvdGVjdGVkIF91aWQgPSBgbWF0LWlucHV0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcbiAgcHJvdGVjdGVkIF9wcmV2aW91c05hdGl2ZVZhbHVlOiBhbnk7XG4gIHByaXZhdGUgX2lucHV0VmFsdWVBY2Nlc3Nvcjoge3ZhbHVlOiBhbnl9O1xuICBwcml2YXRlIF9wcmV2aW91c1BsYWNlaG9sZGVyOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYmVpbmcgcmVuZGVyZWQgb24gdGhlIHNlcnZlci4gKi9cbiAgcmVhZG9ubHkgX2lzU2VydmVyOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSBuYXRpdmUgaHRtbCBzZWxlY3QuICovXG4gIHJlYWRvbmx5IF9pc05hdGl2ZVNlbGVjdDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGEgdGV4dGFyZWEuICovXG4gIHJlYWRvbmx5IF9pc1RleHRhcmVhOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBpbnNpZGUgb2YgYSBmb3JtIGZpZWxkLiAqL1xuICByZWFkb25seSBfaXNJbkZvcm1GaWVsZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb250cm9sVHlwZTogc3RyaW5nID0gJ21hdC1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXV0b2ZpbGxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wgJiYgdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIEJyb3dzZXJzIG1heSBub3QgZmlyZSB0aGUgYmx1ciBldmVudCBpZiB0aGUgaW5wdXQgaXMgZGlzYWJsZWQgdG9vIHF1aWNrbHkuXG4gICAgLy8gUmVzZXQgZnJvbSBoZXJlIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGRvZXNuJ3QgYmVjb21lIHN0dWNrLlxuICAgIGlmICh0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykgeyB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDsgfVxuICBwcm90ZWN0ZWQgX2lkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQgPSBmYWxzZTtcblxuICAvKiogSW5wdXQgdHlwZSBvZiB0aGUgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3R5cGU7IH1cbiAgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB2YWx1ZSB8fCAndGV4dCc7XG4gICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XG5cbiAgICAvLyBXaGVuIHVzaW5nIEFuZ3VsYXIgaW5wdXRzLCBkZXZlbG9wZXJzIGFyZSBubyBsb25nZXIgYWJsZSB0byBzZXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIG5hdGl2ZVxuICAgIC8vIGlucHV0IGVsZW1lbnQuIFRvIGVuc3VyZSB0aGF0IGJpbmRpbmdzIGZvciBgdHlwZWAgd29yaywgd2UgbmVlZCB0byBzeW5jIHRoZSBzZXR0ZXJcbiAgICAvLyB3aXRoIHRoZSBuYXRpdmUgcHJvcGVydHkuIFRleHRhcmVhIGVsZW1lbnRzIGRvbid0IHN1cHBvcnQgdGhlIHR5cGUgcHJvcGVydHkgb3IgYXR0cmlidXRlLlxuICAgIGlmICghdGhpcy5faXNUZXh0YXJlYSAmJiBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHRoaXMuX3R5cGUpKSB7XG4gICAgICAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGUgPSB0aGlzLl90eXBlO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX3R5cGUgPSAndGV4dCc7XG5cbiAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IudmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIHJlYWRvbmx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZWFkb25seTsgfVxuICBzZXQgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVhZG9ubHkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3JlYWRvbmx5ID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9uZXZlckVtcHR5SW5wdXRUeXBlcyA9IFtcbiAgICAnZGF0ZScsXG4gICAgJ2RhdGV0aW1lJyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICdtb250aCcsXG4gICAgJ3RpbWUnLFxuICAgICd3ZWVrJ1xuICBdLmZpbHRlcih0ID0+IGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ+LFxuICAgICAgcHJvdGVjdGVkIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgICAgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SKSBpbnB1dFZhbHVlQWNjZXNzb3I6IGFueSxcbiAgICAgIHByaXZhdGUgX2F1dG9maWxsTW9uaXRvcjogQXV0b2ZpbGxNb25pdG9yLFxuICAgICAgbmdab25lOiBOZ1pvbmUsXG4gICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBvbmNlIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSBoYXMgYmVlbiByZW1vdmVkLiBXZSBvbmx5IG5lZWRcbiAgICAgIC8vIHRvIGluamVjdCB0aGUgZm9ybS1maWVsZCBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgcGxhY2Vob2xkZXIgaGFzIGJlZW4gcHJvbW90ZWQuXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcml2YXRlIF9mb3JtRmllbGQ/OiBNYXRGb3JtRmllbGQpIHtcblxuICAgIHN1cGVyKF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIF9wYXJlbnRGb3JtLCBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIElmIG5vIGlucHV0IHZhbHVlIGFjY2Vzc29yIHdhcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgdXNlIHRoZSBlbGVtZW50IGFzIHRoZSBpbnB1dCB2YWx1ZVxuICAgIC8vIGFjY2Vzc29yLlxuICAgIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3NvciA9IGlucHV0VmFsdWVBY2Nlc3NvciB8fCBlbGVtZW50O1xuXG4gICAgdGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICAvLyBGb3JjZSBzZXR0ZXIgdG8gYmUgY2FsbGVkIGluIGNhc2UgaWQgd2FzIG5vdCBzcGVjaWZpZWQuXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQ7XG5cbiAgICAvLyBPbiBzb21lIHZlcnNpb25zIG9mIGlPUyB0aGUgY2FyZXQgZ2V0cyBzdHVjayBpbiB0aGUgd3JvbmcgcGxhY2Ugd2hlbiBob2xkaW5nIGRvd24gdGhlIGRlbGV0ZVxuICAgIC8vIGtleS4gSW4gb3JkZXIgdG8gZ2V0IGFyb3VuZCB0aGlzIHdlIG5lZWQgdG8gXCJqaWdnbGVcIiB0aGUgY2FyZXQgbG9vc2UuIFNpbmNlIHRoaXMgYnVnIG9ubHlcbiAgICAvLyBleGlzdHMgb24gaU9TLCB3ZSBvbmx5IGJvdGhlciB0byBpbnN0YWxsIHRoZSBsaXN0ZW5lciBvbiBpT1MuXG4gICAgaWYgKF9wbGF0Zm9ybS5JT1MpIHtcbiAgICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZWwgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgICAgICAgIC8vIE5vdGU6IFdlIHNwZWNpZmljYWxseSBjaGVjayBmb3IgMCwgcmF0aGVyIHRoYW4gYCFlbC5zZWxlY3Rpb25TdGFydGAsIGJlY2F1c2UgdGhlIHR3b1xuICAgICAgICAgIC8vIGluZGljYXRlIGRpZmZlcmVudCB0aGluZ3MuIElmIHRoZSB2YWx1ZSBpcyAwLCBpdCBtZWFucyB0aGF0IHRoZSBjYXJldCBpcyBhdCB0aGUgc3RhcnRcbiAgICAgICAgICAvLyBvZiB0aGUgaW5wdXQsIHdoZXJlYXMgYSB2YWx1ZSBvZiBgbnVsbGAgbWVhbnMgdGhhdCB0aGUgaW5wdXQgZG9lc24ndCBzdXBwb3J0XG4gICAgICAgICAgLy8gbWFuaXB1bGF0aW5nIHRoZSBzZWxlY3Rpb24gcmFuZ2UuIElucHV0cyB0aGF0IGRvbid0IHN1cHBvcnQgc2V0dGluZyB0aGUgc2VsZWN0aW9uIHJhbmdlXG4gICAgICAgICAgLy8gd2lsbCB0aHJvdyBhbiBlcnJvciBzbyB3ZSB3YW50IHRvIGF2b2lkIGNhbGxpbmcgYHNldFNlbGVjdGlvblJhbmdlYCBvbiB0aGVtLiBTZWU6XG4gICAgICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5wdXQuaHRtbCNkby1ub3QtYXBwbHlcbiAgICAgICAgICBpZiAoIWVsLnZhbHVlICYmIGVsLnNlbGVjdGlvblN0YXJ0ID09PSAwICYmIGVsLnNlbGVjdGlvbkVuZCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gTm90ZTogSnVzdCBzZXR0aW5nIGAwLCAwYCBkb2Vzbid0IGZpeCB0aGUgaXNzdWUuIFNldHRpbmdcbiAgICAgICAgICAgIC8vIGAxLCAxYCBmaXhlcyBpdCBmb3IgdGhlIGZpcnN0IHRpbWUgdGhhdCB5b3UgdHlwZSB0ZXh0IGFuZFxuICAgICAgICAgICAgLy8gdGhlbiBob2xkIGRlbGV0ZS4gVG9nZ2xpbmcgdG8gYDEsIDFgIGFuZCB0aGVuIGJhY2sgdG9cbiAgICAgICAgICAgIC8vIGAwLCAwYCBzZWVtcyB0byBjb21wbGV0ZWx5IGZpeCBpdC5cbiAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKDEsIDEpO1xuICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU2VydmVyID0gIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3NlcjtcbiAgICB0aGlzLl9pc05hdGl2ZVNlbGVjdCA9IG5vZGVOYW1lID09PSAnc2VsZWN0JztcbiAgICB0aGlzLl9pc1RleHRhcmVhID0gbm9kZU5hbWUgPT09ICd0ZXh0YXJlYSc7XG4gICAgdGhpcy5faXNJbkZvcm1GaWVsZCA9ICEhX2Zvcm1GaWVsZDtcblxuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgdGhpcy5jb250cm9sVHlwZSA9IChlbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50KS5tdWx0aXBsZSA/ICdtYXQtbmF0aXZlLXNlbGVjdC1tdWx0aXBsZScgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtYXQtbmF0aXZlLXNlbGVjdCc7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy5hdXRvZmlsbGVkID0gZXZlbnQuaXNBdXRvZmlsbGVkO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fYXV0b2ZpbGxNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZS1ldmFsdWF0ZSB0aGlzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWVcbiAgICAgIC8vIGVycm9yIHRyaWdnZXJzIHRoYXQgd2UgY2FuJ3Qgc3Vic2NyaWJlIHRvIChlLmcuIHBhcmVudCBmb3JtIHN1Ym1pc3Npb25zKS4gVGhpcyBtZWFuc1xuICAgICAgLy8gdGhhdCB3aGF0ZXZlciBsb2dpYyBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgZGVzdHJveWluZyB0aGUgcGVyZm9ybWFuY2UuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpcnR5LWNoZWNrIHRoZSBuYXRpdmUgZWxlbWVudCdzIHZhbHVlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lIGNhc2VzIHdoZXJlXG4gICAgLy8gd2Ugd29uJ3QgYmUgbm90aWZpZWQgd2hlbiBpdCBjaGFuZ2VzIChlLmcuIHRoZSBjb25zdW1lciBpc24ndCB1c2luZyBmb3JtcyBvciB0aGV5J3JlXG4gICAgLy8gdXBkYXRpbmcgdGhlIHZhbHVlIHVzaW5nIGBlbWl0RXZlbnQ6IGZhbHNlYCkuXG4gICAgdGhpcy5fZGlydHlDaGVja05hdGl2ZVZhbHVlKCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpcnR5LWNoZWNrIGFuZCBzZXQgdGhlIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBvdXJzZWx2ZXMsIGJlY2F1c2Ugd2hldGhlciBpdCdzXG4gICAgLy8gcHJlc2VudCBvciBub3QgZGVwZW5kcyBvbiBhIHF1ZXJ5IHdoaWNoIGlzIHByb25lIHRvIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzLlxuICAgIHRoaXMuX2RpcnR5Q2hlY2tQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLyoqIENhbGxiYWNrIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIGlucHV0IGNoYW5nZXMuICovXG4gIC8vIHRzbGludDpkaXNhYmxlOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyd0cnVlJ10pXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInLCBbJ2ZhbHNlJ10pXG4gIC8vIHRzbGludDplbmFibGU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgX2ZvY3VzQ2hhbmdlZChpc0ZvY3VzZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoaXNGb2N1c2VkICE9PSB0aGlzLmZvY3VzZWQgJiYgKCF0aGlzLnJlYWRvbmx5IHx8ICFpc0ZvY3VzZWQpKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gVGhpcyBpcyBhIG5vb3AgZnVuY3Rpb24gYW5kIGlzIHVzZWQgdG8gbGV0IEFuZ3VsYXIga25vdyB3aGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAvLyBBbmd1bGFyIHdpbGwgcnVuIGEgbmV3IGNoYW5nZSBkZXRlY3Rpb24gZWFjaCB0aW1lIHRoZSBgaW5wdXRgIGV2ZW50IGhhcyBiZWVuIGRpc3BhdGNoZWQuXG4gICAgLy8gSXQncyBuZWNlc3NhcnkgdGhhdCBBbmd1bGFyIHJlY29nbml6ZXMgdGhlIHZhbHVlIGNoYW5nZSwgYmVjYXVzZSB3aGVuIGZsb2F0aW5nTGFiZWxcbiAgICAvLyBpcyBzZXQgdG8gZmFsc2UgYW5kIEFuZ3VsYXIgZm9ybXMgYXJlbid0IHVzZWQsIHRoZSBwbGFjZWhvbGRlciB3b24ndCByZWNvZ25pemUgdGhlXG4gICAgLy8gdmFsdWUgY2hhbmdlcyBhbmQgd2lsbCBub3QgZGlzYXBwZWFyLlxuICAgIC8vIExpc3RlbmluZyB0byB0aGUgaW5wdXQgZXZlbnQgd291bGRuJ3QgYmUgbmVjZXNzYXJ5IHdoZW4gdGhlIGlucHV0IGlzIHVzaW5nIHRoZVxuICAgIC8vIEZvcm1zTW9kdWxlIG9yIFJlYWN0aXZlRm9ybXNNb2R1bGUsIGJlY2F1c2UgQW5ndWxhciBmb3JtcyBhbHNvIGxpc3RlbnMgdG8gaW5wdXQgZXZlbnRzLlxuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZS4gKi9cbiAgcHJpdmF0ZSBfZGlydHlDaGVja1BsYWNlaG9sZGVyKCkge1xuICAgIC8vIElmIHdlJ3JlIGhpZGluZyB0aGUgbmF0aXZlIHBsYWNlaG9sZGVyLCBpdCBzaG91bGQgYWxzbyBiZSBjbGVhcmVkIGZyb20gdGhlIERPTSwgb3RoZXJ3aXNlXG4gICAgLy8gc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIGl0IG91dCB0d2ljZTogb25jZSBmcm9tIHRoZSBsYWJlbCBhbmQgb25jZSBmcm9tIHRoZSBhdHRyaWJ1dGUuXG4gICAgLy8gVE9ETzogY2FuIGJlIHJlbW92ZWQgb25jZSB3ZSBnZXQgcmlkIG9mIHRoZSBgbGVnYWN5YCBzdHlsZSBmb3IgdGhlIGZvcm0gZmllbGQsIGJlY2F1c2UgaXQnc1xuICAgIC8vIHRoZSBvbmx5IG9uZSB0aGF0IHN1cHBvcnRzIHByb21vdGluZyB0aGUgcGxhY2Vob2xkZXIgdG8gYSBsYWJlbC5cbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuX2Zvcm1GaWVsZD8uX2hpZGVDb250cm9sUGxhY2Vob2xkZXI/LigpID8gbnVsbCA6IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgaWYgKHBsYWNlaG9sZGVyICE9PSB0aGlzLl9wcmV2aW91c1BsYWNlaG9sZGVyKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5fcHJldmlvdXNQbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICAgICAgcGxhY2Vob2xkZXIgP1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyKSA6IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEb2VzIHNvbWUgbWFudWFsIGRpcnR5IGNoZWNraW5nIG9uIHRoZSBuYXRpdmUgaW5wdXQgYHZhbHVlYCBwcm9wZXJ0eS4gKi9cbiAgcHJvdGVjdGVkIF9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG5cbiAgICBpZiAodGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBhIHN1cHBvcnRlZCB0eXBlLiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlVHlwZSgpIHtcbiAgICBpZiAoTUFUX0lOUFVUX0lOVkFMSURfVFlQRVMuaW5kZXhPZih0aGlzLl90eXBlKSA+IC0xICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvcih0aGlzLl90eXBlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IHR5cGUgaXMgb25lIG9mIHRoZSB0eXBlcyB0aGF0IGFyZSBuZXZlciBlbXB0eS4gKi9cbiAgcHJvdGVjdGVkIF9pc05ldmVyRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzLmluZGV4T2YodGhpcy5fdHlwZSkgPiAtMTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgaXMgaW52YWxpZCBiYXNlZCBvbiB0aGUgbmF0aXZlIHZhbGlkYXRpb24uICovXG4gIHByb3RlY3RlZCBfaXNCYWRJbnB1dCgpIHtcbiAgICAvLyBUaGUgYHZhbGlkaXR5YCBwcm9wZXJ0eSB3b24ndCBiZSBwcmVzZW50IG9uIHBsYXRmb3JtLXNlcnZlci5cbiAgICBsZXQgdmFsaWRpdHkgPSAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbGlkaXR5O1xuICAgIHJldHVybiB2YWxpZGl0eSAmJiB2YWxpZGl0eS5iYWRJbnB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX2lzTmV2ZXJFbXB0eSgpICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiYgIXRoaXMuX2lzQmFkSW5wdXQoKSAmJlxuICAgICAgICAhdGhpcy5hdXRvZmlsbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0aW9uIGA8c2VsZWN0PmAsIHRoZSBsYWJlbCBzaG91bGQgZmxvYXQgd2hlbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIGhhc1xuICAgICAgLy8gYSBub24tZW1wdHkgZGlzcGxheSB2YWx1ZS4gRm9yIGEgYDxzZWxlY3QgbXVsdGlwbGU+YCwgdGhlIGxhYmVsICphbHdheXMqIGZsb2F0cyB0byBhdm9pZFxuICAgICAgLy8gb3ZlcmxhcHBpbmcgdGhlIGxhYmVsIHdpdGggdGhlIG9wdGlvbnMuXG4gICAgICBjb25zdCBzZWxlY3RFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgICAgY29uc3QgZmlyc3RPcHRpb246IEhUTUxPcHRpb25FbGVtZW50IHwgdW5kZWZpbmVkID0gc2VsZWN0RWxlbWVudC5vcHRpb25zWzBdO1xuXG4gICAgICAvLyBPbiBtb3N0IGJyb3dzZXJzIHRoZSBgc2VsZWN0ZWRJbmRleGAgd2lsbCBhbHdheXMgYmUgMCwgaG93ZXZlciBvbiBJRSBhbmQgRWRnZSBpdCdsbCBiZVxuICAgICAgLy8gLTEgaWYgdGhlIGB2YWx1ZWAgaXMgc2V0IHRvIHNvbWV0aGluZywgdGhhdCBpc24ndCBpbiB0aGUgbGlzdCBvZiBvcHRpb25zLCBhdCBhIGxhdGVyIHBvaW50LlxuICAgICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCBzZWxlY3RFbGVtZW50Lm11bHRpcGxlIHx8ICF0aGlzLmVtcHR5IHx8XG4gICAgICAgICAgICAgISEoc2VsZWN0RWxlbWVudC5zZWxlY3RlZEluZGV4ID4gLTEgJiYgZmlyc3RPcHRpb24gJiYgZmlyc3RPcHRpb24ubGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICBpZiAoaWRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGlkcy5qb2luKCcgJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljaygpIHtcbiAgICAvLyBEbyBub3QgcmUtZm9jdXMgdGhlIGlucHV0IGVsZW1lbnQgaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLiBPdGhlcndpc2UgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgc29tZW9uZSBjbGlja3Mgb24gYSB0aW1lIGlucHV0IGFuZCB0aGUgY3Vyc29yIHJlc2V0cyB0byB0aGUgXCJob3Vyc1wiIGZpZWxkIHdoaWxlIHRoZVxuICAgIC8vIFwibWludXRlc1wiIGZpZWxkIHdhcyBhY3R1YWxseSBjbGlja2VkLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzEyODQ5XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlYWRvbmx5OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0IG1heVxuICAvLyBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbn1cbiJdfQ==