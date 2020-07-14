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
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Self, HostListener, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState, } from '@angular/material/core';
import { MatFormFieldControl, MatFormField } from '@angular/material/form-field';
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
class MatInputBase {
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /** @docs-private */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
}
const _MatInputMixinBase = mixinErrorState(MatInputBase);
/** Directive that allows a native input to work inside a `MatFormField`. */
export class MatInput extends _MatInputMixinBase {
    constructor(_elementRef, _platform, 
    /** @docs-private */
    ngControl, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, ngZone, 
    // @breaking-change 8.0.0 `_formField` parameter to be made required.
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
                    let el = event.target;
                    if (!el.value && !el.selectionStart && !el.selectionEnd) {
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
    /** Determines the value of the native `placeholder` attribute that should be used in the DOM. */
    _getPlaceholderAttribute() {
        // If we're hiding the native placeholder, it should also be cleared from the DOM, otherwise
        // screen readers will read it out twice: once from the label and once from the attribute.
        // TODO: can be removed once we get rid of the `legacy` style for the form field, because it's
        // the only one that supports promoting the placeholder to a label.
        const formField = this._formField;
        return (!formField || !formField._hideControlPlaceholder()) ? this.placeholder : undefined;
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
        if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
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
        this._ariaDescribedby = ids.join(' ');
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
                    '[attr.placeholder]': '_getPlaceholderAttribute()',
                    // At the time of writing, we have a lot of customer tests that look up the input based on its
                    // placeholder. Since we sometimes omit the placeholder attribute from the DOM to prevent screen
                    // readers from reading it twice, we have to keep it somewhere in the DOM for the lookup.
                    '[attr.data-placeholder]': 'placeholder',
                    '[disabled]': 'disabled',
                    '[required]': 'required',
                    '[attr.readonly]': 'readonly && !_isNativeSelect || null',
                    '[attr.aria-describedby]': '_ariaDescribedby || null',
                    '[attr.aria-invalid]': 'errorState',
                    '[attr.aria-required]': 'required.toString()',
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
    { type: MatFormField, decorators: [{ type: Optional }] }
];
MatInput.propDecorators = {
    disabled: [{ type: Input }],
    id: [{ type: Input }],
    placeholder: [{ type: Input }],
    required: [{ type: Input }],
    type: [{ type: Input }],
    errorStateMatcher: [{ type: Input }],
    value: [{ type: Input }],
    readonly: [{ type: Input }],
    _focusChanged: [{ type: HostListener, args: ['focus', ['true'],] }, { type: HostListener, args: ['blur', ['false'],] }],
    _onInput: [{ type: HostListener, args: ['input',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsU0FBUyxFQUVULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsSUFBSSxFQUNKLFlBQVksR0FFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFHTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBR2hFLHFGQUFxRjtBQUNyRixNQUFNLHVCQUF1QixHQUFHO0lBQzlCLFFBQVE7SUFDUixVQUFVO0lBQ1YsTUFBTTtJQUNOLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtDQUNULENBQUM7QUFFRixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsK0NBQStDO0FBQy9DLG9CQUFvQjtB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Q3hCLGlCQUFpQixFQUFFLHNDQUFzQztvQkFDekQseUJBQXlCLEVBQUUsMEJBQTBCO29CQUNyRCxxQkFBcUIsRUFBRSxZQUFZO29CQUNuQyxzQkFBc0IsRUFBRSxxQkFBcUI7aUJBQzlDO2dCQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUMsQ0FBQzthQUNuRTs7O1lBOUVDLFVBQVU7WUFMb0IsUUFBUTtZQWdCWixTQUFTLHVCQStNaEMsUUFBUSxZQUFJLElBQUk7WUEvTWtCLE1BQU0sdUJBZ054QyxRQUFRO1lBaE5MLGtCQUFrQix1QkFpTnJCLFFBQVE7WUE3TVgsaUJBQWlCOzRDQStNZCxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyx3QkFBd0I7WUFsT2hELGVBQWU7WUFPckIsTUFBTTtZQWVxQixZQUFZLHVCQWdOcEMsUUFBUTs7O3VCQXRHVixLQUFLO2lCQXVCTCxLQUFLOzBCQVNMLEtBQUs7dUJBTUwsS0FBSzttQkFNTCxLQUFLO2dDQWdCTCxLQUFLO29CQU1MLEtBQUs7dUJBVUwsS0FBSzs0QkFvSEwsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUM5QixZQUFZLFNBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO3VCQWM5QixZQUFZLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzLCBQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QXV0b2ZpbGxNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvdGV4dC1maWVsZCc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTZWxmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmUsIE5nQ29udHJvbCwgTmdGb3JtfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gIG1peGluRXJyb3JTdGF0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2wsIE1hdEZvcm1GaWVsZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yfSBmcm9tICcuL2lucHV0LWVycm9ycyc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9pbnB1dC12YWx1ZS1hY2Nlc3Nvcic7XG5cblxuLy8gSW52YWxpZCBpbnB1dCB0eXBlLiBVc2luZyBvbmUgb2YgdGhlc2Ugd2lsbCB0aHJvdyBhbiBNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yLlxuY29uc3QgTUFUX0lOUFVUX0lOVkFMSURfVFlQRVMgPSBbXG4gICdidXR0b24nLFxuICAnY2hlY2tib3gnLFxuICAnZmlsZScsXG4gICdoaWRkZW4nLFxuICAnaW1hZ2UnLFxuICAncmFkaW8nLFxuICAncmFuZ2UnLFxuICAncmVzZXQnLFxuICAnc3VibWl0J1xuXTtcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0SW5wdXQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0SW5wdXRCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sKSB7fVxufVxuY29uc3QgX01hdElucHV0TWl4aW5CYXNlOiBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciAmIHR5cGVvZiBNYXRJbnB1dEJhc2UgPVxuICAgIG1peGluRXJyb3JTdGF0ZShNYXRJbnB1dEJhc2UpO1xuXG4vKiogRGlyZWN0aXZlIHRoYXQgYWxsb3dzIGEgbmF0aXZlIGlucHV0IHRvIHdvcmsgaW5zaWRlIGEgYE1hdEZvcm1GaWVsZGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRJbnB1dF0sIHRleHRhcmVhW21hdElucHV0XSwgc2VsZWN0W21hdE5hdGl2ZUNvbnRyb2xdLFxuICAgICAgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdYCxcbiAgZXhwb3J0QXM6ICdtYXRJbnB1dCcsXG4gIGhvc3Q6IHtcbiAgICAvKipcbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSAubWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCBpbiBmYXZvciBvZiBBdXRvZmlsbE1vbml0b3IuXG4gICAgICovXG4gICAgJ2NsYXNzJzogJ21hdC1pbnB1dC1lbGVtZW50IG1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2wnLFxuICAgICdbY2xhc3MubWF0LWlucHV0LXNlcnZlcl0nOiAnX2lzU2VydmVyJyxcbiAgICAvLyBOYXRpdmUgaW5wdXQgcHJvcGVydGllcyB0aGF0IGFyZSBvdmVyd3JpdHRlbiBieSBBbmd1bGFyIGlucHV0cyBuZWVkIHRvIGJlIHN5bmNlZCB3aXRoXG4gICAgLy8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50LiBPdGhlcndpc2UgcHJvcGVydHkgYmluZGluZ3MgZm9yIHRob3NlIGRvbid0IHdvcmsuXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnBsYWNlaG9sZGVyXSc6ICdfZ2V0UGxhY2Vob2xkZXJBdHRyaWJ1dGUoKScsXG4gICAgLy8gQXQgdGhlIHRpbWUgb2Ygd3JpdGluZywgd2UgaGF2ZSBhIGxvdCBvZiBjdXN0b21lciB0ZXN0cyB0aGF0IGxvb2sgdXAgdGhlIGlucHV0IGJhc2VkIG9uIGl0c1xuICAgIC8vIHBsYWNlaG9sZGVyLiBTaW5jZSB3ZSBzb21ldGltZXMgb21pdCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZyb20gdGhlIERPTSB0byBwcmV2ZW50IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgZnJvbSByZWFkaW5nIGl0IHR3aWNlLCB3ZSBoYXZlIHRvIGtlZXAgaXQgc29tZXdoZXJlIGluIHRoZSBET00gZm9yIHRoZSBsb29rdXAuXG4gICAgJ1thdHRyLmRhdGEtcGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tyZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbYXR0ci5yZWFkb25seV0nOiAncmVhZG9ubHkgJiYgIV9pc05hdGl2ZVNlbGVjdCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRieSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncmVxdWlyZWQudG9TdHJpbmcoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0SW5wdXR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5wdXQgZXh0ZW5kcyBfTWF0SW5wdXRNaXhpbkJhc2UgaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIERvQ2hlY2ssIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICBwcm90ZWN0ZWQgX3VpZCA9IGBtYXQtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuICBwcm90ZWN0ZWQgX3ByZXZpb3VzTmF0aXZlVmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBfaW5wdXRWYWx1ZUFjY2Vzc29yOiB7dmFsdWU6IGFueX07XG4gIC8qKiBUaGUgYXJpYS1kZXNjcmliZWRieSBhdHRyaWJ1dGUgb24gdGhlIGlucHV0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBiZWluZyByZW5kZXJlZCBvbiB0aGUgc2VydmVyLiAqL1xuICByZWFkb25seSBfaXNTZXJ2ZXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIG5hdGl2ZSBodG1sIHNlbGVjdC4gKi9cbiAgcmVhZG9ubHkgX2lzTmF0aXZlU2VsZWN0OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSB0ZXh0YXJlYS4gKi9cbiAgcmVhZG9ubHkgX2lzVGV4dGFyZWE6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29udHJvbFR5cGU6IHN0cmluZyA9ICdtYXQtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGF1dG9maWxsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sICYmIHRoaXMubmdDb250cm9sLmRpc2FibGVkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBCcm93c2VycyBtYXkgbm90IGZpcmUgdGhlIGJsdXIgZXZlbnQgaWYgdGhlIGlucHV0IGlzIGRpc2FibGVkIHRvbyBxdWlja2x5LlxuICAgIC8vIFJlc2V0IGZyb20gaGVyZSB0byBlbnN1cmUgdGhhdCB0aGUgZWxlbWVudCBkb2Vzbid0IGJlY29tZSBzdHVjay5cbiAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faWQ7IH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7IH1cbiAgcHJvdGVjdGVkIF9pZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcm90ZWN0ZWQgX3JlcXVpcmVkID0gZmFsc2U7XG5cbiAgLyoqIElucHV0IHR5cGUgb2YgdGhlIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl90eXBlOyB9XG4gIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgJ3RleHQnO1xuICAgIHRoaXMuX3ZhbGlkYXRlVHlwZSgpO1xuXG4gICAgLy8gV2hlbiB1c2luZyBBbmd1bGFyIGlucHV0cywgZGV2ZWxvcGVycyBhcmUgbm8gbG9uZ2VyIGFibGUgdG8gc2V0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSBuYXRpdmVcbiAgICAvLyBpbnB1dCBlbGVtZW50LiBUbyBlbnN1cmUgdGhhdCBiaW5kaW5ncyBmb3IgYHR5cGVgIHdvcmssIHdlIG5lZWQgdG8gc3luYyB0aGUgc2V0dGVyXG4gICAgLy8gd2l0aCB0aGUgbmF0aXZlIHByb3BlcnR5LiBUZXh0YXJlYSBlbGVtZW50cyBkb24ndCBzdXBwb3J0IHRoZSB0eXBlIHByb3BlcnR5IG9yIGF0dHJpYnV0ZS5cbiAgICBpZiAoIXRoaXMuX2lzVGV4dGFyZWEgJiYgZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpLmhhcyh0aGlzLl90eXBlKSkge1xuICAgICAgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS50eXBlID0gdGhpcy5fdHlwZTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF90eXBlID0gJ3RleHQnO1xuXG4gIC8qKiBBbiBvYmplY3QgdXNlZCB0byBjb250cm9sIHdoZW4gZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLiAqL1xuICBASW5wdXQoKSBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IudmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIHJlYWRvbmx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZWFkb25seTsgfVxuICBzZXQgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVhZG9ubHkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3JlYWRvbmx5ID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9uZXZlckVtcHR5SW5wdXRUeXBlcyA9IFtcbiAgICAnZGF0ZScsXG4gICAgJ2RhdGV0aW1lJyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICdtb250aCcsXG4gICAgJ3RpbWUnLFxuICAgICd3ZWVrJ1xuICBdLmZpbHRlcih0ID0+IGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IpIGlucHV0VmFsdWVBY2Nlc3NvcjogYW55LFxuICAgIHByaXZhdGUgX2F1dG9maWxsTW9uaXRvcjogQXV0b2ZpbGxNb25pdG9yLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYF9mb3JtRmllbGRgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2Zvcm1GaWVsZD86IE1hdEZvcm1GaWVsZCkge1xuICAgIHN1cGVyKF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIF9wYXJlbnRGb3JtLCBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIElmIG5vIGlucHV0IHZhbHVlIGFjY2Vzc29yIHdhcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgdXNlIHRoZSBlbGVtZW50IGFzIHRoZSBpbnB1dCB2YWx1ZVxuICAgIC8vIGFjY2Vzc29yLlxuICAgIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3NvciA9IGlucHV0VmFsdWVBY2Nlc3NvciB8fCBlbGVtZW50O1xuXG4gICAgdGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICAvLyBGb3JjZSBzZXR0ZXIgdG8gYmUgY2FsbGVkIGluIGNhc2UgaWQgd2FzIG5vdCBzcGVjaWZpZWQuXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQ7XG5cbiAgICAvLyBPbiBzb21lIHZlcnNpb25zIG9mIGlPUyB0aGUgY2FyZXQgZ2V0cyBzdHVjayBpbiB0aGUgd3JvbmcgcGxhY2Ugd2hlbiBob2xkaW5nIGRvd24gdGhlIGRlbGV0ZVxuICAgIC8vIGtleS4gSW4gb3JkZXIgdG8gZ2V0IGFyb3VuZCB0aGlzIHdlIG5lZWQgdG8gXCJqaWdnbGVcIiB0aGUgY2FyZXQgbG9vc2UuIFNpbmNlIHRoaXMgYnVnIG9ubHlcbiAgICAvLyBleGlzdHMgb24gaU9TLCB3ZSBvbmx5IGJvdGhlciB0byBpbnN0YWxsIHRoZSBsaXN0ZW5lciBvbiBpT1MuXG4gICAgaWYgKF9wbGF0Zm9ybS5JT1MpIHtcbiAgICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgbGV0IGVsID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKCFlbC52YWx1ZSAmJiAhZWwuc2VsZWN0aW9uU3RhcnQgJiYgIWVsLnNlbGVjdGlvbkVuZCkge1xuICAgICAgICAgICAgLy8gTm90ZTogSnVzdCBzZXR0aW5nIGAwLCAwYCBkb2Vzbid0IGZpeCB0aGUgaXNzdWUuIFNldHRpbmdcbiAgICAgICAgICAgIC8vIGAxLCAxYCBmaXhlcyBpdCBmb3IgdGhlIGZpcnN0IHRpbWUgdGhhdCB5b3UgdHlwZSB0ZXh0IGFuZFxuICAgICAgICAgICAgLy8gdGhlbiBob2xkIGRlbGV0ZS4gVG9nZ2xpbmcgdG8gYDEsIDFgIGFuZCB0aGVuIGJhY2sgdG9cbiAgICAgICAgICAgIC8vIGAwLCAwYCBzZWVtcyB0byBjb21wbGV0ZWx5IGZpeCBpdC5cbiAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKDEsIDEpO1xuICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU2VydmVyID0gIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3NlcjtcbiAgICB0aGlzLl9pc05hdGl2ZVNlbGVjdCA9IG5vZGVOYW1lID09PSAnc2VsZWN0JztcbiAgICB0aGlzLl9pc1RleHRhcmVhID0gbm9kZU5hbWUgPT09ICd0ZXh0YXJlYSc7XG5cbiAgICBpZiAodGhpcy5faXNOYXRpdmVTZWxlY3QpIHtcbiAgICAgIHRoaXMuY29udHJvbFR5cGUgPSAoZWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudCkubXVsdGlwbGUgPyAnbWF0LW5hdGl2ZS1zZWxlY3QtbXVsdGlwbGUnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbWF0LW5hdGl2ZS1zZWxlY3QnO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2ZpbGxlZCA9IGV2ZW50LmlzQXV0b2ZpbGxlZDtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBkaXJ0eS1jaGVjayB0aGUgbmF0aXZlIGVsZW1lbnQncyB2YWx1ZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZSBjYXNlcyB3aGVyZVxuICAgIC8vIHdlIHdvbid0IGJlIG5vdGlmaWVkIHdoZW4gaXQgY2hhbmdlcyAoZS5nLiB0aGUgY29uc3VtZXIgaXNuJ3QgdXNpbmcgZm9ybXMgb3IgdGhleSdyZVxuICAgIC8vIHVwZGF0aW5nIHRoZSB2YWx1ZSB1c2luZyBgZW1pdEV2ZW50OiBmYWxzZWApLlxuICAgIHRoaXMuX2RpcnR5Q2hlY2tOYXRpdmVWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLyoqIENhbGxiYWNrIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIGlucHV0IGNoYW5nZXMuICovXG4gIC8vIHRzbGludDpkaXNhYmxlOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyd0cnVlJ10pXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInLCBbJ2ZhbHNlJ10pXG4gIC8vIHRzbGludDplbmFibGU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgX2ZvY3VzQ2hhbmdlZChpc0ZvY3VzZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoaXNGb2N1c2VkICE9PSB0aGlzLmZvY3VzZWQgJiYgKCF0aGlzLnJlYWRvbmx5IHx8ICFpc0ZvY3VzZWQpKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gVGhpcyBpcyBhIG5vb3AgZnVuY3Rpb24gYW5kIGlzIHVzZWQgdG8gbGV0IEFuZ3VsYXIga25vdyB3aGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAvLyBBbmd1bGFyIHdpbGwgcnVuIGEgbmV3IGNoYW5nZSBkZXRlY3Rpb24gZWFjaCB0aW1lIHRoZSBgaW5wdXRgIGV2ZW50IGhhcyBiZWVuIGRpc3BhdGNoZWQuXG4gICAgLy8gSXQncyBuZWNlc3NhcnkgdGhhdCBBbmd1bGFyIHJlY29nbml6ZXMgdGhlIHZhbHVlIGNoYW5nZSwgYmVjYXVzZSB3aGVuIGZsb2F0aW5nTGFiZWxcbiAgICAvLyBpcyBzZXQgdG8gZmFsc2UgYW5kIEFuZ3VsYXIgZm9ybXMgYXJlbid0IHVzZWQsIHRoZSBwbGFjZWhvbGRlciB3b24ndCByZWNvZ25pemUgdGhlXG4gICAgLy8gdmFsdWUgY2hhbmdlcyBhbmQgd2lsbCBub3QgZGlzYXBwZWFyLlxuICAgIC8vIExpc3RlbmluZyB0byB0aGUgaW5wdXQgZXZlbnQgd291bGRuJ3QgYmUgbmVjZXNzYXJ5IHdoZW4gdGhlIGlucHV0IGlzIHVzaW5nIHRoZVxuICAgIC8vIEZvcm1zTW9kdWxlIG9yIFJlYWN0aXZlRm9ybXNNb2R1bGUsIGJlY2F1c2UgQW5ndWxhciBmb3JtcyBhbHNvIGxpc3RlbnMgdG8gaW5wdXQgZXZlbnRzLlxuICB9XG5cbiAgLyoqIERldGVybWluZXMgdGhlIHZhbHVlIG9mIHRoZSBuYXRpdmUgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgdGhhdCBzaG91bGQgYmUgdXNlZCBpbiB0aGUgRE9NLiAqL1xuICBfZ2V0UGxhY2Vob2xkZXJBdHRyaWJ1dGUoKSB7XG4gICAgLy8gSWYgd2UncmUgaGlkaW5nIHRoZSBuYXRpdmUgcGxhY2Vob2xkZXIsIGl0IHNob3VsZCBhbHNvIGJlIGNsZWFyZWQgZnJvbSB0aGUgRE9NLCBvdGhlcndpc2VcbiAgICAvLyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgaXQgb3V0IHR3aWNlOiBvbmNlIGZyb20gdGhlIGxhYmVsIGFuZCBvbmNlIGZyb20gdGhlIGF0dHJpYnV0ZS5cbiAgICAvLyBUT0RPOiBjYW4gYmUgcmVtb3ZlZCBvbmNlIHdlIGdldCByaWQgb2YgdGhlIGBsZWdhY3lgIHN0eWxlIGZvciB0aGUgZm9ybSBmaWVsZCwgYmVjYXVzZSBpdCdzXG4gICAgLy8gdGhlIG9ubHkgb25lIHRoYXQgc3VwcG9ydHMgcHJvbW90aW5nIHRoZSBwbGFjZWhvbGRlciB0byBhIGxhYmVsLlxuICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2Zvcm1GaWVsZDtcbiAgICByZXR1cm4gKCFmb3JtRmllbGQgfHwgIWZvcm1GaWVsZC5faGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpKSA/IHRoaXMucGxhY2Vob2xkZXIgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogRG9lcyBzb21lIG1hbnVhbCBkaXJ0eSBjaGVja2luZyBvbiB0aGUgbmF0aXZlIGlucHV0IGB2YWx1ZWAgcHJvcGVydHkuICovXG4gIHByb3RlY3RlZCBfZGlydHlDaGVja05hdGl2ZVZhbHVlKCkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE1ha2Ugc3VyZSB0aGUgaW5wdXQgaXMgYSBzdXBwb3J0ZWQgdHlwZS4gKi9cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZVR5cGUoKSB7XG4gICAgaWYgKE1BVF9JTlBVVF9JTlZBTElEX1RZUEVTLmluZGV4T2YodGhpcy5fdHlwZSkgPiAtMSkge1xuICAgICAgdGhyb3cgZ2V0TWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvcih0aGlzLl90eXBlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IHR5cGUgaXMgb25lIG9mIHRoZSB0eXBlcyB0aGF0IGFyZSBuZXZlciBlbXB0eS4gKi9cbiAgcHJvdGVjdGVkIF9pc05ldmVyRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzLmluZGV4T2YodGhpcy5fdHlwZSkgPiAtMTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgaXMgaW52YWxpZCBiYXNlZCBvbiB0aGUgbmF0aXZlIHZhbGlkYXRpb24uICovXG4gIHByb3RlY3RlZCBfaXNCYWRJbnB1dCgpIHtcbiAgICAvLyBUaGUgYHZhbGlkaXR5YCBwcm9wZXJ0eSB3b24ndCBiZSBwcmVzZW50IG9uIHBsYXRmb3JtLXNlcnZlci5cbiAgICBsZXQgdmFsaWRpdHkgPSAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbGlkaXR5O1xuICAgIHJldHVybiB2YWxpZGl0eSAmJiB2YWxpZGl0eS5iYWRJbnB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX2lzTmV2ZXJFbXB0eSgpICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiYgIXRoaXMuX2lzQmFkSW5wdXQoKSAmJlxuICAgICAgICAhdGhpcy5hdXRvZmlsbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0aW9uIGA8c2VsZWN0PmAsIHRoZSBsYWJlbCBzaG91bGQgZmxvYXQgd2hlbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIGhhc1xuICAgICAgLy8gYSBub24tZW1wdHkgZGlzcGxheSB2YWx1ZS4gRm9yIGEgYDxzZWxlY3QgbXVsdGlwbGU+YCwgdGhlIGxhYmVsICphbHdheXMqIGZsb2F0cyB0byBhdm9pZFxuICAgICAgLy8gb3ZlcmxhcHBpbmcgdGhlIGxhYmVsIHdpdGggdGhlIG9wdGlvbnMuXG4gICAgICBjb25zdCBzZWxlY3RFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgICAgY29uc3QgZmlyc3RPcHRpb246IEhUTUxPcHRpb25FbGVtZW50IHwgdW5kZWZpbmVkID0gc2VsZWN0RWxlbWVudC5vcHRpb25zWzBdO1xuXG4gICAgICAvLyBPbiBtb3N0IGJyb3dzZXJzIHRoZSBgc2VsZWN0ZWRJbmRleGAgd2lsbCBhbHdheXMgYmUgMCwgaG93ZXZlciBvbiBJRSBhbmQgRWRnZSBpdCdsbCBiZVxuICAgICAgLy8gLTEgaWYgdGhlIGB2YWx1ZWAgaXMgc2V0IHRvIHNvbWV0aGluZywgdGhhdCBpc24ndCBpbiB0aGUgbGlzdCBvZiBvcHRpb25zLCBhdCBhIGxhdGVyIHBvaW50LlxuICAgICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCBzZWxlY3RFbGVtZW50Lm11bHRpcGxlIHx8ICF0aGlzLmVtcHR5IHx8XG4gICAgICAgICAgICAgISEoc2VsZWN0RWxlbWVudC5zZWxlY3RlZEluZGV4ID4gLTEgJiYgZmlyc3RPcHRpb24gJiYgZmlyc3RPcHRpb24ubGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVkYnkgPSBpZHMuam9pbignICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljaygpIHtcbiAgICAvLyBEbyBub3QgcmUtZm9jdXMgdGhlIGlucHV0IGVsZW1lbnQgaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLiBPdGhlcndpc2UgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgc29tZW9uZSBjbGlja3Mgb24gYSB0aW1lIGlucHV0IGFuZCB0aGUgY3Vyc29yIHJlc2V0cyB0byB0aGUgXCJob3Vyc1wiIGZpZWxkIHdoaWxlIHRoZVxuICAgIC8vIFwibWludXRlc1wiIGZpZWxkIHdhcyBhY3R1YWxseSBjbGlja2VkLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzEyODQ5XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlYWRvbmx5OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0IG1heVxuICAvLyBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbn1cbiJdfQ==