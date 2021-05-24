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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0YsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUdoRSxxRkFBcUY7QUFDckYsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixRQUFRO0lBQ1IsVUFBVTtJQUNWLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBRUYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLCtDQUErQztBQUMv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LGNBQWM7Ozt1QkE3R3JDLEtBQUs7aUJBdUJMLEtBQUs7MEJBU0wsS0FBSzt1QkFNTCxLQUFLO21CQU1MLEtBQUs7Z0NBZ0JMLEtBQUs7a0NBTUwsS0FBSyxTQUFDLGtCQUFrQjtvQkFNeEIsS0FBSzt1QkFVTCxLQUFLOzRCQTJITCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQzlCLFlBQVksU0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7dUJBYzlCLFlBQVksU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge2dldFN1cHBvcnRlZElucHV0VHlwZXMsIFBsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtBdXRvZmlsbE1vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBtaXhpbkVycm9yU3RhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sLCBNYXRGb3JtRmllbGQsIE1BVF9GT1JNX0ZJRUxEfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2dldE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3J9IGZyb20gJy4vaW5wdXQtZXJyb3JzJztcbmltcG9ydCB7TUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2lucHV0LXZhbHVlLWFjY2Vzc29yJztcblxuXG4vLyBJbnZhbGlkIGlucHV0IHR5cGUuIFVzaW5nIG9uZSBvZiB0aGVzZSB3aWxsIHRocm93IGFuIE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3IuXG5jb25zdCBNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUyA9IFtcbiAgJ2J1dHRvbicsXG4gICdjaGVja2JveCcsXG4gICdmaWxlJyxcbiAgJ2hpZGRlbicsXG4gICdpbWFnZScsXG4gICdyYWRpbycsXG4gICdyYW5nZScsXG4gICdyZXNldCcsXG4gICdzdWJtaXQnXG5dO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRJbnB1dC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0SW5wdXRCYXNlID0gbWl4aW5FcnJvclN0YXRlKGNsYXNzIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sKSB7fVxufSk7XG5cbi8qKiBEaXJlY3RpdmUgdGhhdCBhbGxvd3MgYSBuYXRpdmUgaW5wdXQgdG8gd29yayBpbnNpZGUgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdElucHV0XSwgdGV4dGFyZWFbbWF0SW5wdXRdLCBzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0sXG4gICAgICBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF1gLFxuICBleHBvcnRBczogJ21hdElucHV0JyxcbiAgaG9zdDoge1xuICAgIC8qKlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIC5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sIGluIGZhdm9yIG9mIEF1dG9maWxsTW9uaXRvci5cbiAgICAgKi9cbiAgICAnY2xhc3MnOiAnbWF0LWlucHV0LWVsZW1lbnQgbWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCcsXG4gICAgJ1tjbGFzcy5tYXQtaW5wdXQtc2VydmVyXSc6ICdfaXNTZXJ2ZXInLFxuICAgIC8vIE5hdGl2ZSBpbnB1dCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG92ZXJ3cml0dGVuIGJ5IEFuZ3VsYXIgaW5wdXRzIG5lZWQgdG8gYmUgc3luY2VkIHdpdGhcbiAgICAvLyB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQuIE90aGVyd2lzZSBwcm9wZXJ0eSBiaW5kaW5ncyBmb3IgdGhvc2UgZG9uJ3Qgd29yay5cbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAvLyBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCB3ZSBoYXZlIGEgbG90IG9mIGN1c3RvbWVyIHRlc3RzIHRoYXQgbG9vayB1cCB0aGUgaW5wdXQgYmFzZWQgb24gaXRzXG4gICAgLy8gcGxhY2Vob2xkZXIuIFNpbmNlIHdlIHNvbWV0aW1lcyBvbWl0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZnJvbSB0aGUgRE9NIHRvIHByZXZlbnQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyBmcm9tIHJlYWRpbmcgaXQgdHdpY2UsIHdlIGhhdmUgdG8ga2VlcCBpdCBzb21ld2hlcmUgaW4gdGhlIERPTSBmb3IgdGhlIGxvb2t1cC5cbiAgICAnW2F0dHIuZGF0YS1wbGFjZWhvbGRlcl0nOiAncGxhY2Vob2xkZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW3JlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1thdHRyLnJlYWRvbmx5XSc6ICdyZWFkb25seSAmJiAhX2lzTmF0aXZlU2VsZWN0IHx8IG51bGwnLFxuICAgIC8vIE9ubHkgbWFyayB0aGUgaW5wdXQgYXMgaW52YWxpZCBmb3IgYXNzaXN0aXZlIHRlY2hub2xvZ3kgaWYgaXQgaGFzIGEgdmFsdWUgc2luY2UgdGhlXG4gICAgLy8gc3RhdGUgdXN1YWxseSBvdmVybGFwcyB3aXRoIGBhcmlhLXJlcXVpcmVkYCB3aGVuIHRoZSBpbnB1dCBpcyBlbXB0eSBhbmQgY2FuIGJlIHJlZHVuZGFudC5cbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlICYmICFlbXB0eScsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXRJbnB1dH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJbnB1dCBleHRlbmRzIF9NYXRJbnB1dEJhc2UgaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIERvQ2hlY2ssIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICBwcm90ZWN0ZWQgX3VpZCA9IGBtYXQtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuICBwcm90ZWN0ZWQgX3ByZXZpb3VzTmF0aXZlVmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBfaW5wdXRWYWx1ZUFjY2Vzc29yOiB7dmFsdWU6IGFueX07XG4gIHByaXZhdGUgX3ByZXZpb3VzUGxhY2Vob2xkZXI6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBiZWluZyByZW5kZXJlZCBvbiB0aGUgc2VydmVyLiAqL1xuICByZWFkb25seSBfaXNTZXJ2ZXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIG5hdGl2ZSBodG1sIHNlbGVjdC4gKi9cbiAgcmVhZG9ubHkgX2lzTmF0aXZlU2VsZWN0OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSB0ZXh0YXJlYS4gKi9cbiAgcmVhZG9ubHkgX2lzVGV4dGFyZWE6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGluc2lkZSBvZiBhIGZvcm0gZmllbGQuICovXG4gIHJlYWRvbmx5IF9pc0luRm9ybUZpZWxkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWFkb25seSBzdGF0ZUNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbnRyb2xUeXBlOiBzdHJpbmcgPSAnbWF0LWlucHV0JztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhdXRvZmlsbGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCAmJiB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMubmdDb250cm9sLmRpc2FibGVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgLy8gQnJvd3NlcnMgbWF5IG5vdCBmaXJlIHRoZSBibHVyIGV2ZW50IGlmIHRoZSBpbnB1dCBpcyBkaXNhYmxlZCB0b28gcXVpY2tseS5cbiAgICAvLyBSZXNldCBmcm9tIGhlcmUgdG8gZW5zdXJlIHRoYXQgdGhlIGVsZW1lbnQgZG9lc24ndCBiZWNvbWUgc3R1Y2suXG4gICAgaWYgKHRoaXMuZm9jdXNlZCkge1xuICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2lkOyB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2lkID0gdmFsdWUgfHwgdGhpcy5fdWlkOyB9XG4gIHByb3RlY3RlZCBfaWQ6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlcXVpcmVkOyB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJvdGVjdGVkIF9yZXF1aXJlZCA9IGZhbHNlO1xuXG4gIC8qKiBJbnB1dCB0eXBlIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxuICBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHZhbHVlIHx8ICd0ZXh0JztcbiAgICB0aGlzLl92YWxpZGF0ZVR5cGUoKTtcblxuICAgIC8vIFdoZW4gdXNpbmcgQW5ndWxhciBpbnB1dHMsIGRldmVsb3BlcnMgYXJlIG5vIGxvbmdlciBhYmxlIHRvIHNldCB0aGUgcHJvcGVydGllcyBvbiB0aGUgbmF0aXZlXG4gICAgLy8gaW5wdXQgZWxlbWVudC4gVG8gZW5zdXJlIHRoYXQgYmluZGluZ3MgZm9yIGB0eXBlYCB3b3JrLCB3ZSBuZWVkIHRvIHN5bmMgdGhlIHNldHRlclxuICAgIC8vIHdpdGggdGhlIG5hdGl2ZSBwcm9wZXJ0eS4gVGV4dGFyZWEgZWxlbWVudHMgZG9uJ3Qgc3VwcG9ydCB0aGUgdHlwZSBwcm9wZXJ0eSBvciBhdHRyaWJ1dGUuXG4gICAgaWYgKCF0aGlzLl9pc1RleHRhcmVhICYmIGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModGhpcy5fdHlwZSkpIHtcbiAgICAgICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZSA9IHRoaXMuX3R5cGU7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfdHlwZSA9ICd0ZXh0JztcblxuICAvKiogQW4gb2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIHVzZXJBcmlhRGVzY3JpYmVkQnk6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZTsgfVxuICBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgcmVhZG9ubHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZWFkb25seSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlYWRvbmx5OyB9XG4gIHNldCByZWFkb25seSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9yZWFkb25seSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfcmVhZG9ubHkgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX25ldmVyRW1wdHlJbnB1dFR5cGVzID0gW1xuICAgICdkYXRlJyxcbiAgICAnZGF0ZXRpbWUnLFxuICAgICdkYXRldGltZS1sb2NhbCcsXG4gICAgJ21vbnRoJyxcbiAgICAndGltZScsXG4gICAgJ3dlZWsnXG4gIF0uZmlsdGVyKHQgPT4gZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpLmhhcyh0KSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudD4sXG4gICAgICBwcm90ZWN0ZWQgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcbiAgICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IpIGlucHV0VmFsdWVBY2Nlc3NvcjogYW55LFxuICAgICAgcHJpdmF0ZSBfYXV0b2ZpbGxNb25pdG9yOiBBdXRvZmlsbE1vbml0b3IsXG4gICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIG9uY2UgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIGhhcyBiZWVuIHJlbW92ZWQuIFdlIG9ubHkgbmVlZFxuICAgICAgLy8gdG8gaW5qZWN0IHRoZSBmb3JtLWZpZWxkIGZvciBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBwbGFjZWhvbGRlciBoYXMgYmVlbiBwcm9tb3RlZC5cbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIHByaXZhdGUgX2Zvcm1GaWVsZD86IE1hdEZvcm1GaWVsZCkge1xuXG4gICAgc3VwZXIoX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgX3BhcmVudEZvcm0sIF9wYXJlbnRGb3JtR3JvdXAsIG5nQ29udHJvbCk7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gSWYgbm8gaW5wdXQgdmFsdWUgYWNjZXNzb3Igd2FzIGV4cGxpY2l0bHkgc3BlY2lmaWVkLCB1c2UgdGhlIGVsZW1lbnQgYXMgdGhlIGlucHV0IHZhbHVlXG4gICAgLy8gYWNjZXNzb3IuXG4gICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yID0gaW5wdXRWYWx1ZUFjY2Vzc29yIHx8IGVsZW1lbnQ7XG5cbiAgICB0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIC8vIEZvcmNlIHNldHRlciB0byBiZSBjYWxsZWQgaW4gY2FzZSBpZCB3YXMgbm90IHNwZWNpZmllZC5cbiAgICB0aGlzLmlkID0gdGhpcy5pZDtcblxuICAgIC8vIE9uIHNvbWUgdmVyc2lvbnMgb2YgaU9TIHRoZSBjYXJldCBnZXRzIHN0dWNrIGluIHRoZSB3cm9uZyBwbGFjZSB3aGVuIGhvbGRpbmcgZG93biB0aGUgZGVsZXRlXG4gICAgLy8ga2V5LiBJbiBvcmRlciB0byBnZXQgYXJvdW5kIHRoaXMgd2UgbmVlZCB0byBcImppZ2dsZVwiIHRoZSBjYXJldCBsb29zZS4gU2luY2UgdGhpcyBidWcgb25seVxuICAgIC8vIGV4aXN0cyBvbiBpT1MsIHdlIG9ubHkgYm90aGVyIHRvIGluc3RhbGwgdGhlIGxpc3RlbmVyIG9uIGlPUy5cbiAgICBpZiAoX3BsYXRmb3JtLklPUykge1xuICAgICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICBsZXQgZWwgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoIWVsLnZhbHVlICYmICFlbC5zZWxlY3Rpb25TdGFydCAmJiAhZWwuc2VsZWN0aW9uRW5kKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiBKdXN0IHNldHRpbmcgYDAsIDBgIGRvZXNuJ3QgZml4IHRoZSBpc3N1ZS4gU2V0dGluZ1xuICAgICAgICAgICAgLy8gYDEsIDFgIGZpeGVzIGl0IGZvciB0aGUgZmlyc3QgdGltZSB0aGF0IHlvdSB0eXBlIHRleHQgYW5kXG4gICAgICAgICAgICAvLyB0aGVuIGhvbGQgZGVsZXRlLiBUb2dnbGluZyB0byBgMSwgMWAgYW5kIHRoZW4gYmFjayB0b1xuICAgICAgICAgICAgLy8gYDAsIDBgIHNlZW1zIHRvIGNvbXBsZXRlbHkgZml4IGl0LlxuICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMSwgMSk7XG4gICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZSgwLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyO1xuICAgIHRoaXMuX2lzTmF0aXZlU2VsZWN0ID0gbm9kZU5hbWUgPT09ICdzZWxlY3QnO1xuICAgIHRoaXMuX2lzVGV4dGFyZWEgPSBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJztcbiAgICB0aGlzLl9pc0luRm9ybUZpZWxkID0gISFfZm9ybUZpZWxkO1xuXG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICB0aGlzLmNvbnRyb2xUeXBlID0gKGVsZW1lbnQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLm11bHRpcGxlID8gJ21hdC1uYXRpdmUtc2VsZWN0LW11bHRpcGxlJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ21hdC1uYXRpdmUtc2VsZWN0JztcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fYXV0b2ZpbGxNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmF1dG9maWxsZWQgPSBldmVudC5pc0F1dG9maWxsZWQ7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgdGhlIG5hdGl2ZSBlbGVtZW50J3MgdmFsdWUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWUgY2FzZXMgd2hlcmVcbiAgICAvLyB3ZSB3b24ndCBiZSBub3RpZmllZCB3aGVuIGl0IGNoYW5nZXMgKGUuZy4gdGhlIGNvbnN1bWVyIGlzbid0IHVzaW5nIGZvcm1zIG9yIHRoZXkncmVcbiAgICAvLyB1cGRhdGluZyB0aGUgdmFsdWUgdXNpbmcgYGVtaXRFdmVudDogZmFsc2VgKS5cbiAgICB0aGlzLl9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgYW5kIHNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG91cnNlbHZlcywgYmVjYXVzZSB3aGV0aGVyIGl0J3NcbiAgICAvLyBwcmVzZW50IG9yIG5vdCBkZXBlbmRzIG9uIGEgcXVlcnkgd2hpY2ggaXMgcHJvbmUgdG8gXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgdGhpcy5fZGlydHlDaGVja1BsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvLyBXZSBoYXZlIHRvIHVzZSBhIGBIb3N0TGlzdGVuZXJgIGhlcmUgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgLy8gSW4gSXZ5IHRoZSBgaG9zdGAgYmluZGluZ3Mgd2lsbCBiZSBtZXJnZWQgd2hlbiB0aGlzIGNsYXNzIGlzIGV4dGVuZGVkLCB3aGVyZWFzIGluXG4gIC8vIFZpZXdFbmdpbmUgdGhleSdyZSBvdmVyd3JpdHRlbi5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIG1vdmUgdGhpcyBiYWNrIGludG8gYGhvc3RgIG9uY2UgSXZ5IGlzIHR1cm5lZCBvbiBieSBkZWZhdWx0LlxuICAvKiogQ2FsbGJhY2sgZm9yIHRoZSBjYXNlcyB3aGVyZSB0aGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgaW5wdXQgY2hhbmdlcy4gKi9cbiAgLy8gdHNsaW50OmRpc2FibGU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnLCBbJ3RydWUnXSlcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicsIFsnZmFsc2UnXSlcbiAgLy8gdHNsaW50OmVuYWJsZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBfZm9jdXNDaGFuZ2VkKGlzRm9jdXNlZDogYm9vbGVhbikge1xuICAgIGlmIChpc0ZvY3VzZWQgIT09IHRoaXMuZm9jdXNlZCAmJiAoIXRoaXMucmVhZG9ubHkgfHwgIWlzRm9jdXNlZCkpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvLyBXZSBoYXZlIHRvIHVzZSBhIGBIb3N0TGlzdGVuZXJgIGhlcmUgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgLy8gSW4gSXZ5IHRoZSBgaG9zdGAgYmluZGluZ3Mgd2lsbCBiZSBtZXJnZWQgd2hlbiB0aGlzIGNsYXNzIGlzIGV4dGVuZGVkLCB3aGVyZWFzIGluXG4gIC8vIFZpZXdFbmdpbmUgdGhleSdyZSBvdmVyd3JpdHRlbi5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIG1vdmUgdGhpcyBiYWNrIGludG8gYGhvc3RgIG9uY2UgSXZ5IGlzIHR1cm5lZCBvbiBieSBkZWZhdWx0LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnKVxuICBfb25JbnB1dCgpIHtcbiAgICAvLyBUaGlzIGlzIGEgbm9vcCBmdW5jdGlvbiBhbmQgaXMgdXNlZCB0byBsZXQgQW5ndWxhciBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIC8vIEFuZ3VsYXIgd2lsbCBydW4gYSBuZXcgY2hhbmdlIGRldGVjdGlvbiBlYWNoIHRpbWUgdGhlIGBpbnB1dGAgZXZlbnQgaGFzIGJlZW4gZGlzcGF0Y2hlZC5cbiAgICAvLyBJdCdzIG5lY2Vzc2FyeSB0aGF0IEFuZ3VsYXIgcmVjb2duaXplcyB0aGUgdmFsdWUgY2hhbmdlLCBiZWNhdXNlIHdoZW4gZmxvYXRpbmdMYWJlbFxuICAgIC8vIGlzIHNldCB0byBmYWxzZSBhbmQgQW5ndWxhciBmb3JtcyBhcmVuJ3QgdXNlZCwgdGhlIHBsYWNlaG9sZGVyIHdvbid0IHJlY29nbml6ZSB0aGVcbiAgICAvLyB2YWx1ZSBjaGFuZ2VzIGFuZCB3aWxsIG5vdCBkaXNhcHBlYXIuXG4gICAgLy8gTGlzdGVuaW5nIHRvIHRoZSBpbnB1dCBldmVudCB3b3VsZG4ndCBiZSBuZWNlc3Nhcnkgd2hlbiB0aGUgaW5wdXQgaXMgdXNpbmcgdGhlXG4gICAgLy8gRm9ybXNNb2R1bGUgb3IgUmVhY3RpdmVGb3Jtc01vZHVsZSwgYmVjYXVzZSBBbmd1bGFyIGZvcm1zIGFsc28gbGlzdGVucyB0byBpbnB1dCBldmVudHMuXG4gIH1cblxuICAvKiogRG9lcyBzb21lIG1hbnVhbCBkaXJ0eSBjaGVja2luZyBvbiB0aGUgbmF0aXZlIGlucHV0IGBwbGFjZWhvbGRlcmAgYXR0cmlidXRlLiAqL1xuICBwcml2YXRlIF9kaXJ0eUNoZWNrUGxhY2Vob2xkZXIoKSB7XG4gICAgLy8gSWYgd2UncmUgaGlkaW5nIHRoZSBuYXRpdmUgcGxhY2Vob2xkZXIsIGl0IHNob3VsZCBhbHNvIGJlIGNsZWFyZWQgZnJvbSB0aGUgRE9NLCBvdGhlcndpc2VcbiAgICAvLyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgaXQgb3V0IHR3aWNlOiBvbmNlIGZyb20gdGhlIGxhYmVsIGFuZCBvbmNlIGZyb20gdGhlIGF0dHJpYnV0ZS5cbiAgICAvLyBUT0RPOiBjYW4gYmUgcmVtb3ZlZCBvbmNlIHdlIGdldCByaWQgb2YgdGhlIGBsZWdhY3lgIHN0eWxlIGZvciB0aGUgZm9ybSBmaWVsZCwgYmVjYXVzZSBpdCdzXG4gICAgLy8gdGhlIG9ubHkgb25lIHRoYXQgc3VwcG9ydHMgcHJvbW90aW5nIHRoZSBwbGFjZWhvbGRlciB0byBhIGxhYmVsLlxuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fZm9ybUZpZWxkPy5faGlkZUNvbnRyb2xQbGFjZWhvbGRlcj8uKCkgPyBudWxsIDogdGhpcy5wbGFjZWhvbGRlcjtcbiAgICBpZiAocGxhY2Vob2xkZXIgIT09IHRoaXMuX3ByZXZpb3VzUGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLl9wcmV2aW91c1BsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gICAgICBwbGFjZWhvbGRlciA/XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgcGxhY2Vob2xkZXIpIDogZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgdmFsdWVgIHByb3BlcnR5LiAqL1xuICBwcm90ZWN0ZWQgX2RpcnR5Q2hlY2tOYXRpdmVWYWx1ZSgpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcblxuICAgIGlmICh0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYWtlIHN1cmUgdGhlIGlucHV0IGlzIGEgc3VwcG9ydGVkIHR5cGUuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVUeXBlKCkge1xuICAgIGlmIChNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTEgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yKHRoaXMuX3R5cGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgdHlwZSBpcyBvbmUgb2YgdGhlIHR5cGVzIHRoYXQgYXJlIG5ldmVyIGVtcHR5LiAqL1xuICBwcm90ZWN0ZWQgX2lzTmV2ZXJFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmV2ZXJFbXB0eUlucHV0VHlwZXMuaW5kZXhPZih0aGlzLl90eXBlKSA+IC0xO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBpbnZhbGlkIGJhc2VkIG9uIHRoZSBuYXRpdmUgdmFsaWRhdGlvbi4gKi9cbiAgcHJvdGVjdGVkIF9pc0JhZElucHV0KCkge1xuICAgIC8vIFRoZSBgdmFsaWRpdHlgIHByb3BlcnR5IHdvbid0IGJlIHByZXNlbnQgb24gcGxhdGZvcm0tc2VydmVyLlxuICAgIGxldCB2YWxpZGl0eSA9ICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsaWRpdHk7XG4gICAgcmV0dXJuIHZhbGlkaXR5ICYmIHZhbGlkaXR5LmJhZElucHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5faXNOZXZlckVtcHR5KCkgJiYgIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSAmJiAhdGhpcy5faXNCYWRJbnB1dCgpICYmXG4gICAgICAgICF0aGlzLmF1dG9maWxsZWQ7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5faXNOYXRpdmVTZWxlY3QpIHtcbiAgICAgIC8vIEZvciBhIHNpbmdsZS1zZWxlY3Rpb24gYDxzZWxlY3Q+YCwgdGhlIGxhYmVsIHNob3VsZCBmbG9hdCB3aGVuIHRoZSBzZWxlY3RlZCBvcHRpb24gaGFzXG4gICAgICAvLyBhIG5vbi1lbXB0eSBkaXNwbGF5IHZhbHVlLiBGb3IgYSBgPHNlbGVjdCBtdWx0aXBsZT5gLCB0aGUgbGFiZWwgKmFsd2F5cyogZmxvYXRzIHRvIGF2b2lkXG4gICAgICAvLyBvdmVybGFwcGluZyB0aGUgbGFiZWwgd2l0aCB0aGUgb3B0aW9ucy5cbiAgICAgIGNvbnN0IHNlbGVjdEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgICBjb25zdCBmaXJzdE9wdGlvbjogSFRNTE9wdGlvbkVsZW1lbnQgfCB1bmRlZmluZWQgPSBzZWxlY3RFbGVtZW50Lm9wdGlvbnNbMF07XG5cbiAgICAgIC8vIE9uIG1vc3QgYnJvd3NlcnMgdGhlIGBzZWxlY3RlZEluZGV4YCB3aWxsIGFsd2F5cyBiZSAwLCBob3dldmVyIG9uIElFIGFuZCBFZGdlIGl0J2xsIGJlXG4gICAgICAvLyAtMSBpZiB0aGUgYHZhbHVlYCBpcyBzZXQgdG8gc29tZXRoaW5nLCB0aGF0IGlzbid0IGluIHRoZSBsaXN0IG9mIG9wdGlvbnMsIGF0IGEgbGF0ZXIgcG9pbnQuXG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8IHNlbGVjdEVsZW1lbnQubXVsdGlwbGUgfHwgIXRoaXMuZW1wdHkgfHxcbiAgICAgICAgICAgICAhIShzZWxlY3RFbGVtZW50LnNlbGVjdGVkSW5kZXggPiAtMSAmJiBmaXJzdE9wdGlvbiAmJiBmaXJzdE9wdGlvbi5sYWJlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgIXRoaXMuZW1wdHk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIGlmIChpZHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWRzLmpvaW4oJyAnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgIC8vIERvIG5vdCByZS1mb2N1cyB0aGUgaW5wdXQgZWxlbWVudCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGZvY3VzZWQuIE90aGVyd2lzZSBpdCBjYW4gaGFwcGVuXG4gICAgLy8gdGhhdCBzb21lb25lIGNsaWNrcyBvbiBhIHRpbWUgaW5wdXQgYW5kIHRoZSBjdXJzb3IgcmVzZXRzIHRvIHRoZSBcImhvdXJzXCIgZmllbGQgd2hpbGUgdGhlXG4gICAgLy8gXCJtaW51dGVzXCIgZmllbGQgd2FzIGFjdHVhbGx5IGNsaWNrZWQuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTI4NDlcbiAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVhZG9ubHk6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBCb29sZWFuSW5wdXQ7XG5cbiAgLy8gQWNjZXB0IGBhbnlgIHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG90aGVyIGRpcmVjdGl2ZXMgb24gYDxpbnB1dD5gIHRoYXQgbWF5XG4gIC8vIGFjY2VwdCBkaWZmZXJlbnQgdHlwZXMuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92YWx1ZTogYW55O1xufVxuIl19