/**
 * @fileoverview added by tsickle
 * Generated from: src/material/input/input.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { getMatInputUnsupportedTypeError } from './input-errors';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
// Invalid input type. Using one of these will throw an MatInputUnsupportedTypeError.
/** @type {?} */
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
/** @type {?} */
let nextUniqueId = 0;
// Boilerplate for applying mixins to MatInput.
/**
 * \@docs-private
 */
class MatInputBase {
    /**
     * @param {?} _defaultErrorStateMatcher
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} ngControl
     */
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
}
if (false) {
    /** @type {?} */
    MatInputBase.prototype._defaultErrorStateMatcher;
    /** @type {?} */
    MatInputBase.prototype._parentForm;
    /** @type {?} */
    MatInputBase.prototype._parentFormGroup;
    /**
     * \@docs-private
     * @type {?}
     */
    MatInputBase.prototype.ngControl;
}
/** @type {?} */
const _MatInputMixinBase = mixinErrorState(MatInputBase);
/**
 * Directive that allows a native input to work inside a `MatFormField`.
 */
export class MatInput extends _MatInputMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} _platform
     * @param {?} ngControl
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} _defaultErrorStateMatcher
     * @param {?} inputValueAccessor
     * @param {?} _autofillMonitor
     * @param {?} ngZone
     */
    constructor(_elementRef, _platform, ngControl, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, ngZone) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this._elementRef = _elementRef;
        this._platform = _platform;
        this.ngControl = ngControl;
        this._autofillMonitor = _autofillMonitor;
        this._uid = `mat-input-${nextUniqueId++}`;
        /**
         * Implemented as part of MatFormFieldControl.
         * \@docs-private
         */
        this.focused = false;
        /**
         * Implemented as part of MatFormFieldControl.
         * \@docs-private
         */
        this.stateChanges = new Subject();
        /**
         * Implemented as part of MatFormFieldControl.
         * \@docs-private
         */
        this.controlType = 'mat-input';
        /**
         * Implemented as part of MatFormFieldControl.
         * \@docs-private
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
        ].filter((/**
         * @param {?} t
         * @return {?}
         */
        t => getSupportedInputTypes().has(t)));
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
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
            ngZone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                _elementRef.nativeElement.addEventListener('keyup', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    /** @type {?} */
                    let el = (/** @type {?} */ (event.target));
                    if (!el.value && !el.selectionStart && !el.selectionEnd) {
                        // Note: Just setting `0, 0` doesn't fix the issue. Setting
                        // `1, 1` fixes it for the first time that you type text and
                        // then hold delete. Toggling to `1, 1` and then back to
                        // `0, 0` seems to completely fix it.
                        el.setSelectionRange(1, 1);
                        el.setSelectionRange(0, 0);
                    }
                }));
            }));
        }
        this._isServer = !this._platform.isBrowser;
        this._isNativeSelect = nodeName === 'select';
        this._isTextarea = nodeName === 'textarea';
        if (this._isNativeSelect) {
            this.controlType = ((/** @type {?} */ (element))).multiple ? 'mat-native-select-multiple' :
                'mat-native-select';
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @return {?}
     */
    get disabled() {
        if (this.ngControl && this.ngControl.disabled !== null) {
            return this.ngControl.disabled;
        }
        return this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
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
     * \@docs-private
     * @return {?}
     */
    get id() { return this._id; }
    /**
     * @param {?} value
     * @return {?}
     */
    set id(value) { this._id = value || this._uid; }
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @return {?}
     */
    get required() { return this._required; }
    /**
     * @param {?} value
     * @return {?}
     */
    set required(value) { this._required = coerceBooleanProperty(value); }
    /**
     * Input type of the element.
     * @return {?}
     */
    get type() { return this._type; }
    /**
     * @param {?} value
     * @return {?}
     */
    set type(value) {
        this._type = value || 'text';
        this._validateType();
        // When using Angular inputs, developers are no longer able to set the properties on the native
        // input element. To ensure that bindings for `type` work, we need to sync the setter
        // with the native property. Textarea elements don't support the type property or attribute.
        if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
            ((/** @type {?} */ (this._elementRef.nativeElement))).type = this._type;
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @return {?}
     */
    get value() { return this._inputValueAccessor.value; }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        if (value !== this.value) {
            this._inputValueAccessor.value = value;
            this.stateChanges.next();
        }
    }
    /**
     * Whether the element is readonly.
     * @return {?}
     */
    get readonly() { return this._readonly; }
    /**
     * @param {?} value
     * @return {?}
     */
    set readonly(value) { this._readonly = coerceBooleanProperty(value); }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._platform.isBrowser) {
            this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((/**
             * @param {?} event
             * @return {?}
             */
            event => {
                this.autofilled = event.isAutofilled;
                this.stateChanges.next();
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.stateChanges.next();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.stateChanges.complete();
        if (this._platform.isBrowser) {
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
        }
    }
    /**
     * @return {?}
     */
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
    /**
     * Focuses the input.
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._elementRef.nativeElement.focus(options);
    }
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    /**
     * Callback for the cases where the focused state of the input changes.
     * @param {?} isFocused
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    _onInput() {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    }
    /**
     * Does some manual dirty checking on the native input `value` property.
     * @protected
     * @return {?}
     */
    _dirtyCheckNativeValue() {
        /** @type {?} */
        const newValue = this._elementRef.nativeElement.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }
    /**
     * Make sure the input is a supported type.
     * @protected
     * @return {?}
     */
    _validateType() {
        if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
            throw getMatInputUnsupportedTypeError(this._type);
        }
    }
    /**
     * Checks whether the input type is one of the types that are never empty.
     * @protected
     * @return {?}
     */
    _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    }
    /**
     * Checks whether the input is invalid based on the native validation.
     * @protected
     * @return {?}
     */
    _isBadInput() {
        // The `validity` property won't be present on platform-server.
        /** @type {?} */
        let validity = ((/** @type {?} */ (this._elementRef.nativeElement))).validity;
        return validity && validity.badInput;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @return {?}
     */
    get empty() {
        return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() &&
            !this.autofilled;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @return {?}
     */
    get shouldLabelFloat() {
        if (this._isNativeSelect) {
            // For a single-selection `<select>`, the label should float when the selected option has
            // a non-empty display value. For a `<select multiple>`, the label *always* floats to avoid
            // overlapping the label with the options.
            /** @type {?} */
            const selectElement = (/** @type {?} */ (this._elementRef.nativeElement));
            /** @type {?} */
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
     * \@docs-private
     * @param {?} ids
     * @return {?}
     */
    setDescribedByIds(ids) {
        this._ariaDescribedby = ids.join(' ');
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @return {?}
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
                     * \@breaking-change 8.0.0 remove .mat-form-field-autofill-control in favor of AutofillMonitor.
                     */
                    'class': 'mat-input-element mat-form-field-autofill-control',
                    '[class.mat-input-server]': '_isServer',
                    // Native input properties that are overwritten by Angular inputs need to be synced with
                    // the native input element. Otherwise property bindings for those don't work.
                    '[attr.id]': 'id',
                    '[attr.placeholder]': 'placeholder',
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
/** @nocollapse */
MatInput.ctorParameters = () => [
    { type: ElementRef },
    { type: Platform },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] },
    { type: NgForm, decorators: [{ type: Optional }] },
    { type: FormGroupDirective, decorators: [{ type: Optional }] },
    { type: ErrorStateMatcher },
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [MAT_INPUT_VALUE_ACCESSOR,] }] },
    { type: AutofillMonitor },
    { type: NgZone }
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
if (false) {
    /** @type {?} */
    MatInput.ngAcceptInputType_disabled;
    /** @type {?} */
    MatInput.ngAcceptInputType_readonly;
    /** @type {?} */
    MatInput.ngAcceptInputType_required;
    /** @type {?} */
    MatInput.ngAcceptInputType_value;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._uid;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._previousNativeValue;
    /**
     * @type {?}
     * @private
     */
    MatInput.prototype._inputValueAccessor;
    /**
     * The aria-describedby attribute on the input for improved a11y.
     * @type {?}
     */
    MatInput.prototype._ariaDescribedby;
    /**
     * Whether the component is being rendered on the server.
     * @type {?}
     */
    MatInput.prototype._isServer;
    /**
     * Whether the component is a native html select.
     * @type {?}
     */
    MatInput.prototype._isNativeSelect;
    /**
     * Whether the component is a textarea.
     * @type {?}
     */
    MatInput.prototype._isTextarea;
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @type {?}
     */
    MatInput.prototype.focused;
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @type {?}
     */
    MatInput.prototype.stateChanges;
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @type {?}
     */
    MatInput.prototype.controlType;
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @type {?}
     */
    MatInput.prototype.autofilled;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._disabled;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._id;
    /**
     * Implemented as part of MatFormFieldControl.
     * \@docs-private
     * @type {?}
     */
    MatInput.prototype.placeholder;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._required;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._type;
    /**
     * An object used to control when error messages are shown.
     * @type {?}
     */
    MatInput.prototype.errorStateMatcher;
    /**
     * @type {?}
     * @private
     */
    MatInput.prototype._readonly;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._neverEmptyInputTypes;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._elementRef;
    /**
     * @type {?}
     * @protected
     */
    MatInput.prototype._platform;
    /**
     * \@docs-private
     * @type {?}
     */
    MatInput.prototype.ngControl;
    /**
     * @type {?}
     * @private
     */
    MatInput.prototype._autofillMonitor;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsU0FBUyxFQUVULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFJTixRQUFRLEVBQ1IsSUFBSSxFQUNKLFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFHTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0QsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sd0JBQXdCLENBQUM7OztNQUkxRCx1QkFBdUIsR0FBRztJQUM5QixRQUFRO0lBQ1IsVUFBVTtJQUNWLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7Q0FDVDs7SUFFRyxZQUFZLEdBQUcsQ0FBQzs7Ozs7QUFJcEIsTUFBTSxZQUFZOzs7Ozs7O0lBQ2hCLFlBQW1CLHlCQUE0QyxFQUM1QyxXQUFtQixFQUNuQixnQkFBb0Ms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QUEwQzs7Ozs7SUFFMUMsb0NBQXlCOzs7OztJQUd6Qiw2QkFBNEI7Ozs7O0lBRzVCLG1DQUFrQzs7Ozs7SUFHbEMsK0JBQThCOzs7Ozs7SUFNOUIsMkJBQXlCOzs7Ozs7SUFNekIsZ0NBQTJEOzs7Ozs7SUFNM0QsK0JBQWtDOzs7Ozs7SUFNbEMsOEJBQW1COzs7OztJQXVCbkIsNkJBQTRCOzs7OztJQVM1Qix1QkFBc0I7Ozs7OztJQU10QiwrQkFBNkI7Ozs7O0lBUzdCLDZCQUE0Qjs7Ozs7SUFnQjVCLHlCQUF5Qjs7Ozs7SUFHekIscUNBQThDOzs7OztJQW1COUMsNkJBQTBCOzs7OztJQUUxQix5Q0FPK0M7Ozs7O0lBRzdDLCtCQUE2Rjs7Ozs7SUFDN0YsNkJBQTZCOzs7OztJQUU3Qiw2QkFBK0M7Ozs7O0lBSy9DLG9DQUF5QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzLCBQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QXV0b2ZpbGxNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvdGV4dC1maWVsZCc7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNlbGYsXG4gIEhvc3RMaXN0ZW5lcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgbWl4aW5FcnJvclN0YXRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yfSBmcm9tICcuL2lucHV0LWVycm9ycyc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9pbnB1dC12YWx1ZS1hY2Nlc3Nvcic7XG5cblxuLy8gSW52YWxpZCBpbnB1dCB0eXBlLiBVc2luZyBvbmUgb2YgdGhlc2Ugd2lsbCB0aHJvdyBhbiBNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yLlxuY29uc3QgTUFUX0lOUFVUX0lOVkFMSURfVFlQRVMgPSBbXG4gICdidXR0b24nLFxuICAnY2hlY2tib3gnLFxuICAnZmlsZScsXG4gICdoaWRkZW4nLFxuICAnaW1hZ2UnLFxuICAncmFkaW8nLFxuICAncmFuZ2UnLFxuICAncmVzZXQnLFxuICAnc3VibWl0J1xuXTtcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0SW5wdXQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0SW5wdXRCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sKSB7fVxufVxuY29uc3QgX01hdElucHV0TWl4aW5CYXNlOiBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciAmIHR5cGVvZiBNYXRJbnB1dEJhc2UgPVxuICAgIG1peGluRXJyb3JTdGF0ZShNYXRJbnB1dEJhc2UpO1xuXG4vKiogRGlyZWN0aXZlIHRoYXQgYWxsb3dzIGEgbmF0aXZlIGlucHV0IHRvIHdvcmsgaW5zaWRlIGEgYE1hdEZvcm1GaWVsZGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRJbnB1dF0sIHRleHRhcmVhW21hdElucHV0XSwgc2VsZWN0W21hdE5hdGl2ZUNvbnRyb2xdLFxuICAgICAgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdYCxcbiAgZXhwb3J0QXM6ICdtYXRJbnB1dCcsXG4gIGhvc3Q6IHtcbiAgICAvKipcbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSAubWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCBpbiBmYXZvciBvZiBBdXRvZmlsbE1vbml0b3IuXG4gICAgICovXG4gICAgJ2NsYXNzJzogJ21hdC1pbnB1dC1lbGVtZW50IG1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2wnLFxuICAgICdbY2xhc3MubWF0LWlucHV0LXNlcnZlcl0nOiAnX2lzU2VydmVyJyxcbiAgICAvLyBOYXRpdmUgaW5wdXQgcHJvcGVydGllcyB0aGF0IGFyZSBvdmVyd3JpdHRlbiBieSBBbmd1bGFyIGlucHV0cyBuZWVkIHRvIGJlIHN5bmNlZCB3aXRoXG4gICAgLy8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50LiBPdGhlcndpc2UgcHJvcGVydHkgYmluZGluZ3MgZm9yIHRob3NlIGRvbid0IHdvcmsuXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnBsYWNlaG9sZGVyXSc6ICdwbGFjZWhvbGRlcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2F0dHIucmVhZG9ubHldJzogJ3JlYWRvbmx5ICYmICFfaXNOYXRpdmVTZWxlY3QgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkYnkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkLnRvU3RyaW5nKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdElucHV0fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdElucHV0IGV4dGVuZHMgX01hdElucHV0TWl4aW5CYXNlIGltcGxlbWVudHMgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBPbkluaXQsIERvQ2hlY2ssIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICBwcm90ZWN0ZWQgX3VpZCA9IGBtYXQtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuICBwcm90ZWN0ZWQgX3ByZXZpb3VzTmF0aXZlVmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBfaW5wdXRWYWx1ZUFjY2Vzc29yOiB7dmFsdWU6IGFueX07XG4gIC8qKiBUaGUgYXJpYS1kZXNjcmliZWRieSBhdHRyaWJ1dGUgb24gdGhlIGlucHV0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBiZWluZyByZW5kZXJlZCBvbiB0aGUgc2VydmVyLiAqL1xuICByZWFkb25seSBfaXNTZXJ2ZXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIG5hdGl2ZSBodG1sIHNlbGVjdC4gKi9cbiAgcmVhZG9ubHkgX2lzTmF0aXZlU2VsZWN0OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYSB0ZXh0YXJlYS4gKi9cbiAgcmVhZG9ubHkgX2lzVGV4dGFyZWE6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29udHJvbFR5cGU6IHN0cmluZyA9ICdtYXQtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGF1dG9maWxsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sICYmIHRoaXMubmdDb250cm9sLmRpc2FibGVkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBCcm93c2VycyBtYXkgbm90IGZpcmUgdGhlIGJsdXIgZXZlbnQgaWYgdGhlIGlucHV0IGlzIGRpc2FibGVkIHRvbyBxdWlja2x5LlxuICAgIC8vIFJlc2V0IGZyb20gaGVyZSB0byBlbnN1cmUgdGhhdCB0aGUgZWxlbWVudCBkb2Vzbid0IGJlY29tZSBzdHVjay5cbiAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faWQ7IH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7IH1cbiAgcHJvdGVjdGVkIF9pZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcm90ZWN0ZWQgX3JlcXVpcmVkID0gZmFsc2U7XG5cbiAgLyoqIElucHV0IHR5cGUgb2YgdGhlIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl90eXBlOyB9XG4gIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgJ3RleHQnO1xuICAgIHRoaXMuX3ZhbGlkYXRlVHlwZSgpO1xuXG4gICAgLy8gV2hlbiB1c2luZyBBbmd1bGFyIGlucHV0cywgZGV2ZWxvcGVycyBhcmUgbm8gbG9uZ2VyIGFibGUgdG8gc2V0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSBuYXRpdmVcbiAgICAvLyBpbnB1dCBlbGVtZW50LiBUbyBlbnN1cmUgdGhhdCBiaW5kaW5ncyBmb3IgYHR5cGVgIHdvcmssIHdlIG5lZWQgdG8gc3luYyB0aGUgc2V0dGVyXG4gICAgLy8gd2l0aCB0aGUgbmF0aXZlIHByb3BlcnR5LiBUZXh0YXJlYSBlbGVtZW50cyBkb24ndCBzdXBwb3J0IHRoZSB0eXBlIHByb3BlcnR5IG9yIGF0dHJpYnV0ZS5cbiAgICBpZiAoIXRoaXMuX2lzVGV4dGFyZWEgJiYgZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpLmhhcyh0aGlzLl90eXBlKSkge1xuICAgICAgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS50eXBlID0gdGhpcy5fdHlwZTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF90eXBlID0gJ3RleHQnO1xuXG4gIC8qKiBBbiBvYmplY3QgdXNlZCB0byBjb250cm9sIHdoZW4gZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLiAqL1xuICBASW5wdXQoKSBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IudmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIHJlYWRvbmx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZWFkb25seTsgfVxuICBzZXQgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVhZG9ubHkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3JlYWRvbmx5ID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9uZXZlckVtcHR5SW5wdXRUeXBlcyA9IFtcbiAgICAnZGF0ZScsXG4gICAgJ2RhdGV0aW1lJyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICdtb250aCcsXG4gICAgJ3RpbWUnLFxuICAgICd3ZWVrJ1xuICBdLmZpbHRlcih0ID0+IGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IpIGlucHV0VmFsdWVBY2Nlc3NvcjogYW55LFxuICAgIHByaXZhdGUgX2F1dG9maWxsTW9uaXRvcjogQXV0b2ZpbGxNb25pdG9yLFxuICAgIG5nWm9uZTogTmdab25lKSB7XG5cbiAgICBzdXBlcihfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSwgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBJZiBubyBpbnB1dCB2YWx1ZSBhY2Nlc3NvciB3YXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIHVzZSB0aGUgZWxlbWVudCBhcyB0aGUgaW5wdXQgdmFsdWVcbiAgICAvLyBhY2Nlc3Nvci5cbiAgICB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IgPSBpbnB1dFZhbHVlQWNjZXNzb3IgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuXG4gICAgLy8gT24gc29tZSB2ZXJzaW9ucyBvZiBpT1MgdGhlIGNhcmV0IGdldHMgc3R1Y2sgaW4gdGhlIHdyb25nIHBsYWNlIHdoZW4gaG9sZGluZyBkb3duIHRoZSBkZWxldGVcbiAgICAvLyBrZXkuIEluIG9yZGVyIHRvIGdldCBhcm91bmQgdGhpcyB3ZSBuZWVkIHRvIFwiamlnZ2xlXCIgdGhlIGNhcmV0IGxvb3NlLiBTaW5jZSB0aGlzIGJ1ZyBvbmx5XG4gICAgLy8gZXhpc3RzIG9uIGlPUywgd2Ugb25seSBib3RoZXIgdG8gaW5zdGFsbCB0aGUgbGlzdGVuZXIgb24gaU9TLlxuICAgIGlmIChfcGxhdGZvcm0uSU9TKSB7XG4gICAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgICAgIGxldCBlbCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmICghZWwudmFsdWUgJiYgIWVsLnNlbGVjdGlvblN0YXJ0ICYmICFlbC5zZWxlY3Rpb25FbmQpIHtcbiAgICAgICAgICAgIC8vIE5vdGU6IEp1c3Qgc2V0dGluZyBgMCwgMGAgZG9lc24ndCBmaXggdGhlIGlzc3VlLiBTZXR0aW5nXG4gICAgICAgICAgICAvLyBgMSwgMWAgZml4ZXMgaXQgZm9yIHRoZSBmaXJzdCB0aW1lIHRoYXQgeW91IHR5cGUgdGV4dCBhbmRcbiAgICAgICAgICAgIC8vIHRoZW4gaG9sZCBkZWxldGUuIFRvZ2dsaW5nIHRvIGAxLCAxYCBhbmQgdGhlbiBiYWNrIHRvXG4gICAgICAgICAgICAvLyBgMCwgMGAgc2VlbXMgdG8gY29tcGxldGVseSBmaXggaXQuXG4gICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZSgxLCAxKTtcbiAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKDAsIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1NlcnZlciA9ICF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXI7XG4gICAgdGhpcy5faXNOYXRpdmVTZWxlY3QgPSBub2RlTmFtZSA9PT0gJ3NlbGVjdCc7XG4gICAgdGhpcy5faXNUZXh0YXJlYSA9IG5vZGVOYW1lID09PSAndGV4dGFyZWEnO1xuXG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICB0aGlzLmNvbnRyb2xUeXBlID0gKGVsZW1lbnQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLm11bHRpcGxlID8gJ21hdC1uYXRpdmUtc2VsZWN0LW11bHRpcGxlJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ21hdC1uYXRpdmUtc2VsZWN0JztcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2ZpbGxlZCA9IGV2ZW50LmlzQXV0b2ZpbGxlZDtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBkaXJ0eS1jaGVjayB0aGUgbmF0aXZlIGVsZW1lbnQncyB2YWx1ZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZSBjYXNlcyB3aGVyZVxuICAgIC8vIHdlIHdvbid0IGJlIG5vdGlmaWVkIHdoZW4gaXQgY2hhbmdlcyAoZS5nLiB0aGUgY29uc3VtZXIgaXNuJ3QgdXNpbmcgZm9ybXMgb3IgdGhleSdyZVxuICAgIC8vIHVwZGF0aW5nIHRoZSB2YWx1ZSB1c2luZyBgZW1pdEV2ZW50OiBmYWxzZWApLlxuICAgIHRoaXMuX2RpcnR5Q2hlY2tOYXRpdmVWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLyoqIENhbGxiYWNrIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIGlucHV0IGNoYW5nZXMuICovXG4gIC8vIHRzbGludDpkaXNhYmxlOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyd0cnVlJ10pXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInLCBbJ2ZhbHNlJ10pXG4gIC8vIHRzbGludDplbmFibGU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgX2ZvY3VzQ2hhbmdlZChpc0ZvY3VzZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoaXNGb2N1c2VkICE9PSB0aGlzLmZvY3VzZWQgJiYgKCF0aGlzLnJlYWRvbmx5IHx8ICFpc0ZvY3VzZWQpKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gVGhpcyBpcyBhIG5vb3AgZnVuY3Rpb24gYW5kIGlzIHVzZWQgdG8gbGV0IEFuZ3VsYXIga25vdyB3aGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAvLyBBbmd1bGFyIHdpbGwgcnVuIGEgbmV3IGNoYW5nZSBkZXRlY3Rpb24gZWFjaCB0aW1lIHRoZSBgaW5wdXRgIGV2ZW50IGhhcyBiZWVuIGRpc3BhdGNoZWQuXG4gICAgLy8gSXQncyBuZWNlc3NhcnkgdGhhdCBBbmd1bGFyIHJlY29nbml6ZXMgdGhlIHZhbHVlIGNoYW5nZSwgYmVjYXVzZSB3aGVuIGZsb2F0aW5nTGFiZWxcbiAgICAvLyBpcyBzZXQgdG8gZmFsc2UgYW5kIEFuZ3VsYXIgZm9ybXMgYXJlbid0IHVzZWQsIHRoZSBwbGFjZWhvbGRlciB3b24ndCByZWNvZ25pemUgdGhlXG4gICAgLy8gdmFsdWUgY2hhbmdlcyBhbmQgd2lsbCBub3QgZGlzYXBwZWFyLlxuICAgIC8vIExpc3RlbmluZyB0byB0aGUgaW5wdXQgZXZlbnQgd291bGRuJ3QgYmUgbmVjZXNzYXJ5IHdoZW4gdGhlIGlucHV0IGlzIHVzaW5nIHRoZVxuICAgIC8vIEZvcm1zTW9kdWxlIG9yIFJlYWN0aXZlRm9ybXNNb2R1bGUsIGJlY2F1c2UgQW5ndWxhciBmb3JtcyBhbHNvIGxpc3RlbnMgdG8gaW5wdXQgZXZlbnRzLlxuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgdmFsdWVgIHByb3BlcnR5LiAqL1xuICBwcm90ZWN0ZWQgX2RpcnR5Q2hlY2tOYXRpdmVWYWx1ZSgpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcblxuICAgIGlmICh0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYWtlIHN1cmUgdGhlIGlucHV0IGlzIGEgc3VwcG9ydGVkIHR5cGUuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVUeXBlKCkge1xuICAgIGlmIChNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTEpIHtcbiAgICAgIHRocm93IGdldE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3IodGhpcy5fdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBpbnB1dCB0eXBlIGlzIG9uZSBvZiB0aGUgdHlwZXMgdGhhdCBhcmUgbmV2ZXIgZW1wdHkuICovXG4gIHByb3RlY3RlZCBfaXNOZXZlckVtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9uZXZlckVtcHR5SW5wdXRUeXBlcy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTE7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IGlzIGludmFsaWQgYmFzZWQgb24gdGhlIG5hdGl2ZSB2YWxpZGF0aW9uLiAqL1xuICBwcm90ZWN0ZWQgX2lzQmFkSW5wdXQoKSB7XG4gICAgLy8gVGhlIGB2YWxpZGl0eWAgcHJvcGVydHkgd29uJ3QgYmUgcHJlc2VudCBvbiBwbGF0Zm9ybS1zZXJ2ZXIuXG4gICAgbGV0IHZhbGlkaXR5ID0gKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWxpZGl0eTtcbiAgICByZXR1cm4gdmFsaWRpdHkgJiYgdmFsaWRpdHkuYmFkSW5wdXQ7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9pc05ldmVyRW1wdHkoKSAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlICYmICF0aGlzLl9pc0JhZElucHV0KCkgJiZcbiAgICAgICAgIXRoaXMuYXV0b2ZpbGxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgLy8gRm9yIGEgc2luZ2xlLXNlbGVjdGlvbiBgPHNlbGVjdD5gLCB0aGUgbGFiZWwgc2hvdWxkIGZsb2F0IHdoZW4gdGhlIHNlbGVjdGVkIG9wdGlvbiBoYXNcbiAgICAgIC8vIGEgbm9uLWVtcHR5IGRpc3BsYXkgdmFsdWUuIEZvciBhIGA8c2VsZWN0IG11bHRpcGxlPmAsIHRoZSBsYWJlbCAqYWx3YXlzKiBmbG9hdHMgdG8gYXZvaWRcbiAgICAgIC8vIG92ZXJsYXBwaW5nIHRoZSBsYWJlbCB3aXRoIHRoZSBvcHRpb25zLlxuICAgICAgY29uc3Qgc2VsZWN0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgIGNvbnN0IGZpcnN0T3B0aW9uOiBIVE1MT3B0aW9uRWxlbWVudCB8IHVuZGVmaW5lZCA9IHNlbGVjdEVsZW1lbnQub3B0aW9uc1swXTtcblxuICAgICAgLy8gT24gbW9zdCBicm93c2VycyB0aGUgYHNlbGVjdGVkSW5kZXhgIHdpbGwgYWx3YXlzIGJlIDAsIGhvd2V2ZXIgb24gSUUgYW5kIEVkZ2UgaXQnbGwgYmVcbiAgICAgIC8vIC0xIGlmIHRoZSBgdmFsdWVgIGlzIHNldCB0byBzb21ldGhpbmcsIHRoYXQgaXNuJ3QgaW4gdGhlIGxpc3Qgb2Ygb3B0aW9ucywgYXQgYSBsYXRlciBwb2ludC5cbiAgICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgc2VsZWN0RWxlbWVudC5tdWx0aXBsZSB8fCAhdGhpcy5lbXB0eSB8fFxuICAgICAgICAgICAgICEhKHNlbGVjdEVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+IC0xICYmIGZpcnN0T3B0aW9uICYmIGZpcnN0T3B0aW9uLmxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgLy8gRG8gbm90IHJlLWZvY3VzIHRoZSBpbnB1dCBlbGVtZW50IGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgZm9jdXNlZC4gT3RoZXJ3aXNlIGl0IGNhbiBoYXBwZW5cbiAgICAvLyB0aGF0IHNvbWVvbmUgY2xpY2tzIG9uIGEgdGltZSBpbnB1dCBhbmQgdGhlIGN1cnNvciByZXNldHMgdG8gdGhlIFwiaG91cnNcIiBmaWVsZCB3aGlsZSB0aGVcbiAgICAvLyBcIm1pbnV0ZXNcIiBmaWVsZCB3YXMgYWN0dWFsbHkgY2xpY2tlZC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xMjg0OVxuICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZWFkb25seTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcblxuICAvLyBBY2NlcHQgYGFueWAgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggb3RoZXIgZGlyZWN0aXZlcyBvbiBgPGlucHV0PmAgdGhhdCBtYXlcbiAgLy8gYWNjZXB0IGRpZmZlcmVudCB0eXBlcy5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBhbnk7XG59XG4iXX0=