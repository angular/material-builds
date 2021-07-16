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
        if (isFocused !== this.focused) {
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
                    '[attr.aria-invalid]': '(empty && required) ? null : errorState',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0YsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUdoRSxxRkFBcUY7QUFDckYsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixRQUFRO0lBQ1IsVUFBVTtJQUNWLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBRUYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLCtDQUErQztBQUMv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TSxTQUFDLGNBQWM7Ozt1QkE1R3JDLEtBQUs7aUJBdUJMLEtBQUs7MEJBU0wsS0FBSzt1QkFNTCxLQUFLO21CQU1MLEtBQUs7Z0NBZ0JMLEtBQUs7a0NBTUwsS0FBSyxTQUFDLGtCQUFrQjtvQkFNeEIsS0FBSzt1QkFVTCxLQUFLOzRCQWlJTCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQzlCLFlBQVksU0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7dUJBYzlCLFlBQVksU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge2dldFN1cHBvcnRlZElucHV0VHlwZXMsIFBsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtBdXRvZmlsbE1vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBtaXhpbkVycm9yU3RhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sLCBNYXRGb3JtRmllbGQsIE1BVF9GT1JNX0ZJRUxEfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2dldE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3J9IGZyb20gJy4vaW5wdXQtZXJyb3JzJztcbmltcG9ydCB7TUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2lucHV0LXZhbHVlLWFjY2Vzc29yJztcblxuXG4vLyBJbnZhbGlkIGlucHV0IHR5cGUuIFVzaW5nIG9uZSBvZiB0aGVzZSB3aWxsIHRocm93IGFuIE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3IuXG5jb25zdCBNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUyA9IFtcbiAgJ2J1dHRvbicsXG4gICdjaGVja2JveCcsXG4gICdmaWxlJyxcbiAgJ2hpZGRlbicsXG4gICdpbWFnZScsXG4gICdyYWRpbycsXG4gICdyYW5nZScsXG4gICdyZXNldCcsXG4gICdzdWJtaXQnXG5dO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRJbnB1dC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0SW5wdXRCYXNlID0gbWl4aW5FcnJvclN0YXRlKGNsYXNzIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sKSB7fVxufSk7XG5cbi8qKiBEaXJlY3RpdmUgdGhhdCBhbGxvd3MgYSBuYXRpdmUgaW5wdXQgdG8gd29yayBpbnNpZGUgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdElucHV0XSwgdGV4dGFyZWFbbWF0SW5wdXRdLCBzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0sXG4gICAgICBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF1gLFxuICBleHBvcnRBczogJ21hdElucHV0JyxcbiAgaG9zdDoge1xuICAgIC8qKlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIC5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sIGluIGZhdm9yIG9mIEF1dG9maWxsTW9uaXRvci5cbiAgICAgKi9cbiAgICAnY2xhc3MnOiAnbWF0LWlucHV0LWVsZW1lbnQgbWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCcsXG4gICAgJ1tjbGFzcy5tYXQtaW5wdXQtc2VydmVyXSc6ICdfaXNTZXJ2ZXInLFxuICAgIC8vIE5hdGl2ZSBpbnB1dCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG92ZXJ3cml0dGVuIGJ5IEFuZ3VsYXIgaW5wdXRzIG5lZWQgdG8gYmUgc3luY2VkIHdpdGhcbiAgICAvLyB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQuIE90aGVyd2lzZSBwcm9wZXJ0eSBiaW5kaW5ncyBmb3IgdGhvc2UgZG9uJ3Qgd29yay5cbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAvLyBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCB3ZSBoYXZlIGEgbG90IG9mIGN1c3RvbWVyIHRlc3RzIHRoYXQgbG9vayB1cCB0aGUgaW5wdXQgYmFzZWQgb24gaXRzXG4gICAgLy8gcGxhY2Vob2xkZXIuIFNpbmNlIHdlIHNvbWV0aW1lcyBvbWl0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZnJvbSB0aGUgRE9NIHRvIHByZXZlbnQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyBmcm9tIHJlYWRpbmcgaXQgdHdpY2UsIHdlIGhhdmUgdG8ga2VlcCBpdCBzb21ld2hlcmUgaW4gdGhlIERPTSBmb3IgdGhlIGxvb2t1cC5cbiAgICAnW2F0dHIuZGF0YS1wbGFjZWhvbGRlcl0nOiAncGxhY2Vob2xkZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW3JlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1thdHRyLnJlYWRvbmx5XSc6ICdyZWFkb25seSAmJiAhX2lzTmF0aXZlU2VsZWN0IHx8IG51bGwnLFxuICAgIC8vIE9ubHkgbWFyayB0aGUgaW5wdXQgYXMgaW52YWxpZCBmb3IgYXNzaXN0aXZlIHRlY2hub2xvZ3kgaWYgaXQgaGFzIGEgdmFsdWUgc2luY2UgdGhlXG4gICAgLy8gc3RhdGUgdXN1YWxseSBvdmVybGFwcyB3aXRoIGBhcmlhLXJlcXVpcmVkYCB3aGVuIHRoZSBpbnB1dCBpcyBlbXB0eSBhbmQgY2FuIGJlIHJlZHVuZGFudC5cbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICcoZW1wdHkgJiYgcmVxdWlyZWQpID8gbnVsbCA6IGVycm9yU3RhdGUnLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0SW5wdXR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SW5wdXQgZXh0ZW5kcyBfTWF0SW5wdXRCYXNlIGltcGxlbWVudHMgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBEb0NoZWNrLCBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgcHJvdGVjdGVkIF91aWQgPSBgbWF0LWlucHV0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcbiAgcHJvdGVjdGVkIF9wcmV2aW91c05hdGl2ZVZhbHVlOiBhbnk7XG4gIHByaXZhdGUgX2lucHV0VmFsdWVBY2Nlc3Nvcjoge3ZhbHVlOiBhbnl9O1xuICBwcml2YXRlIF9wcmV2aW91c1BsYWNlaG9sZGVyOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYmVpbmcgcmVuZGVyZWQgb24gdGhlIHNlcnZlci4gKi9cbiAgcmVhZG9ubHkgX2lzU2VydmVyOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSBuYXRpdmUgaHRtbCBzZWxlY3QuICovXG4gIHJlYWRvbmx5IF9pc05hdGl2ZVNlbGVjdDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGEgdGV4dGFyZWEuICovXG4gIHJlYWRvbmx5IF9pc1RleHRhcmVhOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBpbnNpZGUgb2YgYSBmb3JtIGZpZWxkLiAqL1xuICByZWFkb25seSBfaXNJbkZvcm1GaWVsZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb3ZlcnJpZGUgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb250cm9sVHlwZTogc3RyaW5nID0gJ21hdC1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXV0b2ZpbGxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wgJiYgdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIEJyb3dzZXJzIG1heSBub3QgZmlyZSB0aGUgYmx1ciBldmVudCBpZiB0aGUgaW5wdXQgaXMgZGlzYWJsZWQgdG9vIHF1aWNrbHkuXG4gICAgLy8gUmVzZXQgZnJvbSBoZXJlIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGRvZXNuJ3QgYmVjb21lIHN0dWNrLlxuICAgIGlmICh0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykgeyB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDsgfVxuICBwcm90ZWN0ZWQgX2lkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQgPSBmYWxzZTtcblxuICAvKiogSW5wdXQgdHlwZSBvZiB0aGUgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3R5cGU7IH1cbiAgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB2YWx1ZSB8fCAndGV4dCc7XG4gICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XG5cbiAgICAvLyBXaGVuIHVzaW5nIEFuZ3VsYXIgaW5wdXRzLCBkZXZlbG9wZXJzIGFyZSBubyBsb25nZXIgYWJsZSB0byBzZXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIG5hdGl2ZVxuICAgIC8vIGlucHV0IGVsZW1lbnQuIFRvIGVuc3VyZSB0aGF0IGJpbmRpbmdzIGZvciBgdHlwZWAgd29yaywgd2UgbmVlZCB0byBzeW5jIHRoZSBzZXR0ZXJcbiAgICAvLyB3aXRoIHRoZSBuYXRpdmUgcHJvcGVydHkuIFRleHRhcmVhIGVsZW1lbnRzIGRvbid0IHN1cHBvcnQgdGhlIHR5cGUgcHJvcGVydHkgb3IgYXR0cmlidXRlLlxuICAgIGlmICghdGhpcy5faXNUZXh0YXJlYSAmJiBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHRoaXMuX3R5cGUpKSB7XG4gICAgICAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGUgPSB0aGlzLl90eXBlO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX3R5cGUgPSAndGV4dCc7XG5cbiAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIG92ZXJyaWRlIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IudmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIHJlYWRvbmx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZWFkb25seTsgfVxuICBzZXQgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVhZG9ubHkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3JlYWRvbmx5ID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9uZXZlckVtcHR5SW5wdXRUeXBlcyA9IFtcbiAgICAnZGF0ZScsXG4gICAgJ2RhdGV0aW1lJyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICdtb250aCcsXG4gICAgJ3RpbWUnLFxuICAgICd3ZWVrJ1xuICBdLmZpbHRlcih0ID0+IGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ+LFxuICAgICAgcHJvdGVjdGVkIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE1BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUikgaW5wdXRWYWx1ZUFjY2Vzc29yOiBhbnksXG4gICAgICBwcml2YXRlIF9hdXRvZmlsbE1vbml0b3I6IEF1dG9maWxsTW9uaXRvcixcbiAgICAgIG5nWm9uZTogTmdab25lLFxuICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgb25jZSB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgaGFzIGJlZW4gcmVtb3ZlZC4gV2Ugb25seSBuZWVkXG4gICAgICAvLyB0byBpbmplY3QgdGhlIGZvcm0tZmllbGQgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIHBsYWNlaG9sZGVyIGhhcyBiZWVuIHByb21vdGVkLlxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfZm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkKSB7XG5cbiAgICBzdXBlcihfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSwgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBJZiBubyBpbnB1dCB2YWx1ZSBhY2Nlc3NvciB3YXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIHVzZSB0aGUgZWxlbWVudCBhcyB0aGUgaW5wdXQgdmFsdWVcbiAgICAvLyBhY2Nlc3Nvci5cbiAgICB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IgPSBpbnB1dFZhbHVlQWNjZXNzb3IgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuXG4gICAgLy8gT24gc29tZSB2ZXJzaW9ucyBvZiBpT1MgdGhlIGNhcmV0IGdldHMgc3R1Y2sgaW4gdGhlIHdyb25nIHBsYWNlIHdoZW4gaG9sZGluZyBkb3duIHRoZSBkZWxldGVcbiAgICAvLyBrZXkuIEluIG9yZGVyIHRvIGdldCBhcm91bmQgdGhpcyB3ZSBuZWVkIHRvIFwiamlnZ2xlXCIgdGhlIGNhcmV0IGxvb3NlLiBTaW5jZSB0aGlzIGJ1ZyBvbmx5XG4gICAgLy8gZXhpc3RzIG9uIGlPUywgd2Ugb25seSBib3RoZXIgdG8gaW5zdGFsbCB0aGUgbGlzdGVuZXIgb24gaU9TLlxuICAgIGlmIChfcGxhdGZvcm0uSU9TKSB7XG4gICAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICAgICAgICAvLyBOb3RlOiBXZSBzcGVjaWZpY2FsbHkgY2hlY2sgZm9yIDAsIHJhdGhlciB0aGFuIGAhZWwuc2VsZWN0aW9uU3RhcnRgLCBiZWNhdXNlIHRoZSB0d29cbiAgICAgICAgICAvLyBpbmRpY2F0ZSBkaWZmZXJlbnQgdGhpbmdzLiBJZiB0aGUgdmFsdWUgaXMgMCwgaXQgbWVhbnMgdGhhdCB0aGUgY2FyZXQgaXMgYXQgdGhlIHN0YXJ0XG4gICAgICAgICAgLy8gb2YgdGhlIGlucHV0LCB3aGVyZWFzIGEgdmFsdWUgb2YgYG51bGxgIG1lYW5zIHRoYXQgdGhlIGlucHV0IGRvZXNuJ3Qgc3VwcG9ydFxuICAgICAgICAgIC8vIG1hbmlwdWxhdGluZyB0aGUgc2VsZWN0aW9uIHJhbmdlLiBJbnB1dHMgdGhhdCBkb24ndCBzdXBwb3J0IHNldHRpbmcgdGhlIHNlbGVjdGlvbiByYW5nZVxuICAgICAgICAgIC8vIHdpbGwgdGhyb3cgYW4gZXJyb3Igc28gd2Ugd2FudCB0byBhdm9pZCBjYWxsaW5nIGBzZXRTZWxlY3Rpb25SYW5nZWAgb24gdGhlbS4gU2VlOlxuICAgICAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2lucHV0Lmh0bWwjZG8tbm90LWFwcGx5XG4gICAgICAgICAgaWYgKCFlbC52YWx1ZSAmJiBlbC5zZWxlY3Rpb25TdGFydCA9PT0gMCAmJiBlbC5zZWxlY3Rpb25FbmQgPT09IDApIHtcbiAgICAgICAgICAgIC8vIE5vdGU6IEp1c3Qgc2V0dGluZyBgMCwgMGAgZG9lc24ndCBmaXggdGhlIGlzc3VlLiBTZXR0aW5nXG4gICAgICAgICAgICAvLyBgMSwgMWAgZml4ZXMgaXQgZm9yIHRoZSBmaXJzdCB0aW1lIHRoYXQgeW91IHR5cGUgdGV4dCBhbmRcbiAgICAgICAgICAgIC8vIHRoZW4gaG9sZCBkZWxldGUuIFRvZ2dsaW5nIHRvIGAxLCAxYCBhbmQgdGhlbiBiYWNrIHRvXG4gICAgICAgICAgICAvLyBgMCwgMGAgc2VlbXMgdG8gY29tcGxldGVseSBmaXggaXQuXG4gICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZSgxLCAxKTtcbiAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKDAsIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1NlcnZlciA9ICF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXI7XG4gICAgdGhpcy5faXNOYXRpdmVTZWxlY3QgPSBub2RlTmFtZSA9PT0gJ3NlbGVjdCc7XG4gICAgdGhpcy5faXNUZXh0YXJlYSA9IG5vZGVOYW1lID09PSAndGV4dGFyZWEnO1xuICAgIHRoaXMuX2lzSW5Gb3JtRmllbGQgPSAhIV9mb3JtRmllbGQ7XG5cbiAgICBpZiAodGhpcy5faXNOYXRpdmVTZWxlY3QpIHtcbiAgICAgIHRoaXMuY29udHJvbFR5cGUgPSAoZWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudCkubXVsdGlwbGUgPyAnbWF0LW5hdGl2ZS1zZWxlY3QtbXVsdGlwbGUnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbWF0LW5hdGl2ZS1zZWxlY3QnO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2ZpbGxlZCA9IGV2ZW50LmlzQXV0b2ZpbGxlZDtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBkaXJ0eS1jaGVjayB0aGUgbmF0aXZlIGVsZW1lbnQncyB2YWx1ZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZSBjYXNlcyB3aGVyZVxuICAgIC8vIHdlIHdvbid0IGJlIG5vdGlmaWVkIHdoZW4gaXQgY2hhbmdlcyAoZS5nLiB0aGUgY29uc3VtZXIgaXNuJ3QgdXNpbmcgZm9ybXMgb3IgdGhleSdyZVxuICAgIC8vIHVwZGF0aW5nIHRoZSB2YWx1ZSB1c2luZyBgZW1pdEV2ZW50OiBmYWxzZWApLlxuICAgIHRoaXMuX2RpcnR5Q2hlY2tOYXRpdmVWYWx1ZSgpO1xuXG4gICAgLy8gV2UgbmVlZCB0byBkaXJ0eS1jaGVjayBhbmQgc2V0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb3Vyc2VsdmVzLCBiZWNhdXNlIHdoZXRoZXIgaXQnc1xuICAgIC8vIHByZXNlbnQgb3Igbm90IGRlcGVuZHMgb24gYSBxdWVyeSB3aGljaCBpcyBwcm9uZSB0byBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICB0aGlzLl9kaXJ0eUNoZWNrUGxhY2Vob2xkZXIoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8qKiBDYWxsYmFjayBmb3IgdGhlIGNhc2VzIHdoZXJlIHRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBpbnB1dCBjaGFuZ2VzLiAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdmb2N1cycsIFsndHJ1ZSddKVxuICBASG9zdExpc3RlbmVyKCdibHVyJywgWydmYWxzZSddKVxuICAvLyB0c2xpbnQ6ZW5hYmxlOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIF9mb2N1c0NoYW5nZWQoaXNGb2N1c2VkOiBib29sZWFuKSB7XG4gICAgaWYgKGlzRm9jdXNlZCAhPT0gdGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gVGhpcyBpcyBhIG5vb3AgZnVuY3Rpb24gYW5kIGlzIHVzZWQgdG8gbGV0IEFuZ3VsYXIga25vdyB3aGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAvLyBBbmd1bGFyIHdpbGwgcnVuIGEgbmV3IGNoYW5nZSBkZXRlY3Rpb24gZWFjaCB0aW1lIHRoZSBgaW5wdXRgIGV2ZW50IGhhcyBiZWVuIGRpc3BhdGNoZWQuXG4gICAgLy8gSXQncyBuZWNlc3NhcnkgdGhhdCBBbmd1bGFyIHJlY29nbml6ZXMgdGhlIHZhbHVlIGNoYW5nZSwgYmVjYXVzZSB3aGVuIGZsb2F0aW5nTGFiZWxcbiAgICAvLyBpcyBzZXQgdG8gZmFsc2UgYW5kIEFuZ3VsYXIgZm9ybXMgYXJlbid0IHVzZWQsIHRoZSBwbGFjZWhvbGRlciB3b24ndCByZWNvZ25pemUgdGhlXG4gICAgLy8gdmFsdWUgY2hhbmdlcyBhbmQgd2lsbCBub3QgZGlzYXBwZWFyLlxuICAgIC8vIExpc3RlbmluZyB0byB0aGUgaW5wdXQgZXZlbnQgd291bGRuJ3QgYmUgbmVjZXNzYXJ5IHdoZW4gdGhlIGlucHV0IGlzIHVzaW5nIHRoZVxuICAgIC8vIEZvcm1zTW9kdWxlIG9yIFJlYWN0aXZlRm9ybXNNb2R1bGUsIGJlY2F1c2UgQW5ndWxhciBmb3JtcyBhbHNvIGxpc3RlbnMgdG8gaW5wdXQgZXZlbnRzLlxuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZS4gKi9cbiAgcHJpdmF0ZSBfZGlydHlDaGVja1BsYWNlaG9sZGVyKCkge1xuICAgIC8vIElmIHdlJ3JlIGhpZGluZyB0aGUgbmF0aXZlIHBsYWNlaG9sZGVyLCBpdCBzaG91bGQgYWxzbyBiZSBjbGVhcmVkIGZyb20gdGhlIERPTSwgb3RoZXJ3aXNlXG4gICAgLy8gc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIGl0IG91dCB0d2ljZTogb25jZSBmcm9tIHRoZSBsYWJlbCBhbmQgb25jZSBmcm9tIHRoZSBhdHRyaWJ1dGUuXG4gICAgLy8gVE9ETzogY2FuIGJlIHJlbW92ZWQgb25jZSB3ZSBnZXQgcmlkIG9mIHRoZSBgbGVnYWN5YCBzdHlsZSBmb3IgdGhlIGZvcm0gZmllbGQsIGJlY2F1c2UgaXQnc1xuICAgIC8vIHRoZSBvbmx5IG9uZSB0aGF0IHN1cHBvcnRzIHByb21vdGluZyB0aGUgcGxhY2Vob2xkZXIgdG8gYSBsYWJlbC5cbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuX2Zvcm1GaWVsZD8uX2hpZGVDb250cm9sUGxhY2Vob2xkZXI/LigpID8gbnVsbCA6IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgaWYgKHBsYWNlaG9sZGVyICE9PSB0aGlzLl9wcmV2aW91c1BsYWNlaG9sZGVyKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5fcHJldmlvdXNQbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICAgICAgcGxhY2Vob2xkZXIgP1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyKSA6IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEb2VzIHNvbWUgbWFudWFsIGRpcnR5IGNoZWNraW5nIG9uIHRoZSBuYXRpdmUgaW5wdXQgYHZhbHVlYCBwcm9wZXJ0eS4gKi9cbiAgcHJvdGVjdGVkIF9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG5cbiAgICBpZiAodGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBhIHN1cHBvcnRlZCB0eXBlLiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlVHlwZSgpIHtcbiAgICBpZiAoTUFUX0lOUFVUX0lOVkFMSURfVFlQRVMuaW5kZXhPZih0aGlzLl90eXBlKSA+IC0xICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvcih0aGlzLl90eXBlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IHR5cGUgaXMgb25lIG9mIHRoZSB0eXBlcyB0aGF0IGFyZSBuZXZlciBlbXB0eS4gKi9cbiAgcHJvdGVjdGVkIF9pc05ldmVyRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzLmluZGV4T2YodGhpcy5fdHlwZSkgPiAtMTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgaXMgaW52YWxpZCBiYXNlZCBvbiB0aGUgbmF0aXZlIHZhbGlkYXRpb24uICovXG4gIHByb3RlY3RlZCBfaXNCYWRJbnB1dCgpIHtcbiAgICAvLyBUaGUgYHZhbGlkaXR5YCBwcm9wZXJ0eSB3b24ndCBiZSBwcmVzZW50IG9uIHBsYXRmb3JtLXNlcnZlci5cbiAgICBsZXQgdmFsaWRpdHkgPSAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbGlkaXR5O1xuICAgIHJldHVybiB2YWxpZGl0eSAmJiB2YWxpZGl0eS5iYWRJbnB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX2lzTmV2ZXJFbXB0eSgpICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiYgIXRoaXMuX2lzQmFkSW5wdXQoKSAmJlxuICAgICAgICAhdGhpcy5hdXRvZmlsbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0aW9uIGA8c2VsZWN0PmAsIHRoZSBsYWJlbCBzaG91bGQgZmxvYXQgd2hlbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIGhhc1xuICAgICAgLy8gYSBub24tZW1wdHkgZGlzcGxheSB2YWx1ZS4gRm9yIGEgYDxzZWxlY3QgbXVsdGlwbGU+YCwgdGhlIGxhYmVsICphbHdheXMqIGZsb2F0cyB0byBhdm9pZFxuICAgICAgLy8gb3ZlcmxhcHBpbmcgdGhlIGxhYmVsIHdpdGggdGhlIG9wdGlvbnMuXG4gICAgICBjb25zdCBzZWxlY3RFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgICAgY29uc3QgZmlyc3RPcHRpb246IEhUTUxPcHRpb25FbGVtZW50IHwgdW5kZWZpbmVkID0gc2VsZWN0RWxlbWVudC5vcHRpb25zWzBdO1xuXG4gICAgICAvLyBPbiBtb3N0IGJyb3dzZXJzIHRoZSBgc2VsZWN0ZWRJbmRleGAgd2lsbCBhbHdheXMgYmUgMCwgaG93ZXZlciBvbiBJRSBhbmQgRWRnZSBpdCdsbCBiZVxuICAgICAgLy8gLTEgaWYgdGhlIGB2YWx1ZWAgaXMgc2V0IHRvIHNvbWV0aGluZywgdGhhdCBpc24ndCBpbiB0aGUgbGlzdCBvZiBvcHRpb25zLCBhdCBhIGxhdGVyIHBvaW50LlxuICAgICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCBzZWxlY3RFbGVtZW50Lm11bHRpcGxlIHx8ICF0aGlzLmVtcHR5IHx8XG4gICAgICAgICAgICAgISEoc2VsZWN0RWxlbWVudC5zZWxlY3RlZEluZGV4ID4gLTEgJiYgZmlyc3RPcHRpb24gJiYgZmlyc3RPcHRpb24ubGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICBpZiAoaWRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGlkcy5qb2luKCcgJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljaygpIHtcbiAgICAvLyBEbyBub3QgcmUtZm9jdXMgdGhlIGlucHV0IGVsZW1lbnQgaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLiBPdGhlcndpc2UgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgc29tZW9uZSBjbGlja3Mgb24gYSB0aW1lIGlucHV0IGFuZCB0aGUgY3Vyc29yIHJlc2V0cyB0byB0aGUgXCJob3Vyc1wiIGZpZWxkIHdoaWxlIHRoZVxuICAgIC8vIFwibWludXRlc1wiIGZpZWxkIHdhcyBhY3R1YWxseSBjbGlja2VkLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzEyODQ5XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlYWRvbmx5OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuXG4gIC8vIEFjY2VwdCBgYW55YCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBvdGhlciBkaXJlY3RpdmVzIG9uIGA8aW5wdXQ+YCB0aGF0IG1heVxuICAvLyBhY2NlcHQgZGlmZmVyZW50IHR5cGVzLlxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmFsdWU6IGFueTtcbn1cbiJdfQ==