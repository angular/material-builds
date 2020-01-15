/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Self, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState, } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { getMatInputUnsupportedTypeError } from './input-errors';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
// Invalid input type. Using one of these will throw an MatInputUnsupportedTypeError.
var MAT_INPUT_INVALID_TYPES = [
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
var nextUniqueId = 0;
// Boilerplate for applying mixins to MatInput.
/** @docs-private */
var MatInputBase = /** @class */ (function () {
    function MatInputBase(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /** @docs-private */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
    return MatInputBase;
}());
var _MatInputMixinBase = mixinErrorState(MatInputBase);
/** Directive that allows a native input to work inside a `MatFormField`. */
var MatInput = /** @class */ (function (_super) {
    __extends(MatInput, _super);
    function MatInput(_elementRef, _platform, 
    /** @docs-private */
    ngControl, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, ngZone) {
        var _this = _super.call(this, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl) || this;
        _this._elementRef = _elementRef;
        _this._platform = _platform;
        _this.ngControl = ngControl;
        _this._autofillMonitor = _autofillMonitor;
        _this._uid = "mat-input-" + nextUniqueId++;
        /** Whether the component is being rendered on the server. */
        _this._isServer = false;
        /** Whether the component is a native html select. */
        _this._isNativeSelect = false;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        _this.focused = false;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        _this.stateChanges = new Subject();
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        _this.controlType = 'mat-input';
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        _this.autofilled = false;
        _this._disabled = false;
        _this._required = false;
        _this._type = 'text';
        _this._readonly = false;
        _this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
        ].filter(function (t) { return getSupportedInputTypes().has(t); });
        var element = _this._elementRef.nativeElement;
        // If no input value accessor was explicitly specified, use the element as the input value
        // accessor.
        _this._inputValueAccessor = inputValueAccessor || element;
        _this._previousNativeValue = _this.value;
        // Force setter to be called in case id was not specified.
        _this.id = _this.id;
        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (_platform.IOS) {
            ngZone.runOutsideAngular(function () {
                _elementRef.nativeElement.addEventListener('keyup', function (event) {
                    var el = event.target;
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
        _this._isServer = !_this._platform.isBrowser;
        _this._isNativeSelect = element.nodeName.toLowerCase() === 'select';
        if (_this._isNativeSelect) {
            _this.controlType = element.multiple ? 'mat-native-select-multiple' :
                'mat-native-select';
        }
        return _this;
    }
    Object.defineProperty(MatInput.prototype, "disabled", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () {
            if (this.ngControl && this.ngControl.disabled !== null) {
                return this.ngControl.disabled;
            }
            return this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            // Browsers may not fire the blur event if the input is disabled too quickly.
            // Reset from here to ensure that the element doesn't become stuck.
            if (this.focused) {
                this.focused = false;
                this.stateChanges.next();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatInput.prototype, "id", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return this._id; },
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatInput.prototype, "required", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatInput.prototype, "type", {
        /** Input type of the element. */
        get: function () { return this._type; },
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
            // When using Angular inputs, developers are no longer able to set the properties on the native
            // input element. To ensure that bindings for `type` work, we need to sync the setter
            // with the native property. Textarea elements don't support the type property or attribute.
            if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
                this._elementRef.nativeElement.type = this._type;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatInput.prototype, "value", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return this._inputValueAccessor.value; },
        set: function (value) {
            if (value !== this.value) {
                this._inputValueAccessor.value = value;
                this.stateChanges.next();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatInput.prototype, "readonly", {
        /** Whether the element is readonly. */
        get: function () { return this._readonly; },
        set: function (value) { this._readonly = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MatInput.prototype.ngOnInit = function () {
        var _this = this;
        if (this._platform.isBrowser) {
            this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(function (event) {
                _this.autofilled = event.isAutofilled;
                _this.stateChanges.next();
            });
        }
    };
    MatInput.prototype.ngOnChanges = function () {
        this.stateChanges.next();
    };
    MatInput.prototype.ngOnDestroy = function () {
        this.stateChanges.complete();
        if (this._platform.isBrowser) {
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
        }
    };
    MatInput.prototype.ngDoCheck = function () {
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
    };
    /** Focuses the input. */
    MatInput.prototype.focus = function (options) {
        this._elementRef.nativeElement.focus(options);
    };
    /** Callback for the cases where the focused state of the input changes. */
    MatInput.prototype._focusChanged = function (isFocused) {
        if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    };
    MatInput.prototype._onInput = function () {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    };
    /** Determines if the component host is a textarea. */
    MatInput.prototype._isTextarea = function () {
        return this._elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
    };
    /** Does some manual dirty checking on the native input `value` property. */
    MatInput.prototype._dirtyCheckNativeValue = function () {
        var newValue = this._elementRef.nativeElement.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    };
    /** Make sure the input is a supported type. */
    MatInput.prototype._validateType = function () {
        if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
            throw getMatInputUnsupportedTypeError(this._type);
        }
    };
    /** Checks whether the input type is one of the types that are never empty. */
    MatInput.prototype._isNeverEmpty = function () {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    };
    /** Checks whether the input is invalid based on the native validation. */
    MatInput.prototype._isBadInput = function () {
        // The `validity` property won't be present on platform-server.
        var validity = this._elementRef.nativeElement.validity;
        return validity && validity.badInput;
    };
    Object.defineProperty(MatInput.prototype, "empty", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () {
            return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() &&
                !this.autofilled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatInput.prototype, "shouldLabelFloat", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () {
            if (this._isNativeSelect) {
                // For a single-selection `<select>`, the label should float when the selected option has
                // a non-empty display value. For a `<select multiple>`, the label *always* floats to avoid
                // overlapping the label with the options.
                var selectElement = this._elementRef.nativeElement;
                var firstOption = selectElement.options[0];
                // On most browsers the `selectedIndex` will always be 0, however on IE and Edge it'll be
                // -1 if the `value` is set to something, that isn't in the list of options, at a later point.
                return this.focused || selectElement.multiple || !this.empty ||
                    !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label);
            }
            else {
                return this.focused || !this.empty;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    MatInput.prototype.setDescribedByIds = function (ids) {
        this._ariaDescribedby = ids.join(' ');
    };
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    MatInput.prototype.onContainerClick = function () {
        // Do not re-focus the input element if the element is already focused. Otherwise it can happen
        // that someone clicks on a time input and the cursor resets to the "hours" field while the
        // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
        if (!this.focused) {
            this.focus();
        }
    };
    MatInput.decorators = [
        { type: Directive, args: [{
                    selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]",
                    exportAs: 'matInput',
                    host: {
                        /**
                         * @breaking-change 8.0.0 remove .mat-form-field-autofill-control in favor of AutofillMonitor.
                         */
                        '[class.mat-form-field-autofill-control]': 'true',
                        '[class.mat-input-element]': 'true',
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
                        '(blur)': '_focusChanged(false)',
                        '(focus)': '_focusChanged(true)',
                        '(input)': '_onInput()',
                    },
                    providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
                },] }
    ];
    /** @nocollapse */
    MatInput.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Platform },
        { type: NgControl, decorators: [{ type: Optional }, { type: Self }] },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] },
        { type: ErrorStateMatcher },
        { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [MAT_INPUT_VALUE_ACCESSOR,] }] },
        { type: AutofillMonitor },
        { type: NgZone }
    ]; };
    MatInput.propDecorators = {
        disabled: [{ type: Input }],
        id: [{ type: Input }],
        placeholder: [{ type: Input }],
        required: [{ type: Input }],
        type: [{ type: Input }],
        errorStateMatcher: [{ type: Input }],
        value: [{ type: Input }],
        readonly: [{ type: Input }]
    };
    return MatInput;
}(_MatInputMixinBase));
export { MatInput };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBSU4sUUFBUSxFQUNSLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFHTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0QsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFHaEUscUZBQXFGO0FBQ3JGLElBQU0sdUJBQXVCLEdBQUc7SUFDOUIsUUFBUTtJQUNSLFVBQVU7SUFDVixNQUFNO0lBQ04sUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxRQUFRO0NBQ1QsQ0FBQztBQUVGLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQiwrQ0FBK0M7QUFDL0Msb0JBQW9CO0FBQ3BCO0lB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QUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUMsQ0FBQztpQkFDbkU7Ozs7Z0JBN0VDLFVBQVU7Z0JBTG9CLFFBQVE7Z0JBZVosU0FBUyx1QkE0TWhDLFFBQVEsWUFBSSxJQUFJO2dCQTVNa0IsTUFBTSx1QkE2TXhDLFFBQVE7Z0JBN01MLGtCQUFrQix1QkE4TXJCLFFBQVE7Z0JBMU1YLGlCQUFpQjtnREE0TWQsUUFBUSxZQUFJLElBQUksWUFBSSxNQUFNLFNBQUMsd0JBQXdCO2dCQTlOaEQsZUFBZTtnQkFPckIsTUFBTTs7OzJCQXFITCxLQUFLO3FCQXVCTCxLQUFLOzhCQVNMLEtBQUs7MkJBTUwsS0FBSzt1QkFNTCxLQUFLO29DQWdCTCxLQUFLO3dCQU1MLEtBQUs7MkJBVUwsS0FBSzs7SUF5TlIsZUFBQztDQUFBLEFBMVdELENBMkI4QixrQkFBa0IsR0ErVS9DO1NBL1VZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Z2V0U3VwcG9ydGVkSW5wdXRUeXBlcywgUGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0F1dG9maWxsTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBtaXhpbkVycm9yU3RhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2dldE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3J9IGZyb20gJy4vaW5wdXQtZXJyb3JzJztcbmltcG9ydCB7TUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2lucHV0LXZhbHVlLWFjY2Vzc29yJztcblxuXG4vLyBJbnZhbGlkIGlucHV0IHR5cGUuIFVzaW5nIG9uZSBvZiB0aGVzZSB3aWxsIHRocm93IGFuIE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3IuXG5jb25zdCBNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUyA9IFtcbiAgJ2J1dHRvbicsXG4gICdjaGVja2JveCcsXG4gICdmaWxlJyxcbiAgJ2hpZGRlbicsXG4gICdpbWFnZScsXG4gICdyYWRpbycsXG4gICdyYW5nZScsXG4gICdyZXNldCcsXG4gICdzdWJtaXQnXG5dO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRJbnB1dC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRJbnB1dEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgICAgICAgICAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgICAgICAgICAgICBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wpIHt9XG59XG5jb25zdCBfTWF0SW5wdXRNaXhpbkJhc2U6IENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgdHlwZW9mIE1hdElucHV0QmFzZSA9XG4gICAgbWl4aW5FcnJvclN0YXRlKE1hdElucHV0QmFzZSk7XG5cbi8qKiBEaXJlY3RpdmUgdGhhdCBhbGxvd3MgYSBuYXRpdmUgaW5wdXQgdG8gd29yayBpbnNpZGUgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdElucHV0XSwgdGV4dGFyZWFbbWF0SW5wdXRdLCBzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0sXG4gICAgICBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF1gLFxuICBleHBvcnRBczogJ21hdElucHV0JyxcbiAgaG9zdDoge1xuICAgIC8qKlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIC5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sIGluIGZhdm9yIG9mIEF1dG9maWxsTW9uaXRvci5cbiAgICAgKi9cbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsLWNvbnRyb2xdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubWF0LWlucHV0LWVsZW1lbnRdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubWF0LWlucHV0LXNlcnZlcl0nOiAnX2lzU2VydmVyJyxcbiAgICAvLyBOYXRpdmUgaW5wdXQgcHJvcGVydGllcyB0aGF0IGFyZSBvdmVyd3JpdHRlbiBieSBBbmd1bGFyIGlucHV0cyBuZWVkIHRvIGJlIHN5bmNlZCB3aXRoXG4gICAgLy8gdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50LiBPdGhlcndpc2UgcHJvcGVydHkgYmluZGluZ3MgZm9yIHRob3NlIGRvbid0IHdvcmsuXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnBsYWNlaG9sZGVyXSc6ICdwbGFjZWhvbGRlcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2F0dHIucmVhZG9ubHldJzogJ3JlYWRvbmx5ICYmICFfaXNOYXRpdmVTZWxlY3QgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkYnkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkLnRvU3RyaW5nKCknLFxuICAgICcoYmx1ciknOiAnX2ZvY3VzQ2hhbmdlZChmYWxzZSknLFxuICAgICcoZm9jdXMpJzogJ19mb2N1c0NoYW5nZWQodHJ1ZSknLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCknLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdElucHV0fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdElucHV0IGV4dGVuZHMgX01hdElucHV0TWl4aW5CYXNlIGltcGxlbWVudHMgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBPbkluaXQsIERvQ2hlY2ssIENhblVwZGF0ZUVycm9yU3RhdGUge1xuICBwcm90ZWN0ZWQgX3VpZCA9IGBtYXQtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuICBwcm90ZWN0ZWQgX3ByZXZpb3VzTmF0aXZlVmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBfaW5wdXRWYWx1ZUFjY2Vzc29yOiB7dmFsdWU6IGFueX07XG4gIC8qKiBUaGUgYXJpYS1kZXNjcmliZWRieSBhdHRyaWJ1dGUgb24gdGhlIGlucHV0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBiZWluZyByZW5kZXJlZCBvbiB0aGUgc2VydmVyLiAqL1xuICBfaXNTZXJ2ZXIgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGEgbmF0aXZlIGh0bWwgc2VsZWN0LiAqL1xuICBfaXNOYXRpdmVTZWxlY3QgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb250cm9sVHlwZTogc3RyaW5nID0gJ21hdC1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXV0b2ZpbGxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wgJiYgdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIEJyb3dzZXJzIG1heSBub3QgZmlyZSB0aGUgYmx1ciBldmVudCBpZiB0aGUgaW5wdXQgaXMgZGlzYWJsZWQgdG9vIHF1aWNrbHkuXG4gICAgLy8gUmVzZXQgZnJvbSBoZXJlIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGRvZXNuJ3QgYmVjb21lIHN0dWNrLlxuICAgIGlmICh0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykgeyB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDsgfVxuICBwcm90ZWN0ZWQgX2lkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQgPSBmYWxzZTtcblxuICAvKiogSW5wdXQgdHlwZSBvZiB0aGUgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3R5cGU7IH1cbiAgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB2YWx1ZSB8fCAndGV4dCc7XG4gICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XG5cbiAgICAvLyBXaGVuIHVzaW5nIEFuZ3VsYXIgaW5wdXRzLCBkZXZlbG9wZXJzIGFyZSBubyBsb25nZXIgYWJsZSB0byBzZXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIG5hdGl2ZVxuICAgIC8vIGlucHV0IGVsZW1lbnQuIFRvIGVuc3VyZSB0aGF0IGJpbmRpbmdzIGZvciBgdHlwZWAgd29yaywgd2UgbmVlZCB0byBzeW5jIHRoZSBzZXR0ZXJcbiAgICAvLyB3aXRoIHRoZSBuYXRpdmUgcHJvcGVydHkuIFRleHRhcmVhIGVsZW1lbnRzIGRvbid0IHN1cHBvcnQgdGhlIHR5cGUgcHJvcGVydHkgb3IgYXR0cmlidXRlLlxuICAgIGlmICghdGhpcy5faXNUZXh0YXJlYSgpICYmIGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModGhpcy5fdHlwZSkpIHtcbiAgICAgICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZSA9IHRoaXMuX3R5cGU7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfdHlwZSA9ICd0ZXh0JztcblxuICAvKiogQW4gb2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yLnZhbHVlOyB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLnZhbHVlKSB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyByZWFkb25seS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlYWRvbmx5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVhZG9ubHk7IH1cbiAgc2V0IHJlYWRvbmx5KHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3JlYWRvbmx5ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9yZWFkb25seSA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBfbmV2ZXJFbXB0eUlucHV0VHlwZXMgPSBbXG4gICAgJ2RhdGUnLFxuICAgICdkYXRldGltZScsXG4gICAgJ2RhdGV0aW1lLWxvY2FsJyxcbiAgICAnbW9udGgnLFxuICAgICd0aW1lJyxcbiAgICAnd2VlaydcbiAgXS5maWx0ZXIodCA9PiBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHQpKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SKSBpbnB1dFZhbHVlQWNjZXNzb3I6IGFueSxcbiAgICBwcml2YXRlIF9hdXRvZmlsbE1vbml0b3I6IEF1dG9maWxsTW9uaXRvcixcbiAgICBuZ1pvbmU6IE5nWm9uZSkge1xuXG4gICAgc3VwZXIoX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgX3BhcmVudEZvcm0sIF9wYXJlbnRGb3JtR3JvdXAsIG5nQ29udHJvbCk7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gSWYgbm8gaW5wdXQgdmFsdWUgYWNjZXNzb3Igd2FzIGV4cGxpY2l0bHkgc3BlY2lmaWVkLCB1c2UgdGhlIGVsZW1lbnQgYXMgdGhlIGlucHV0IHZhbHVlXG4gICAgLy8gYWNjZXNzb3IuXG4gICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yID0gaW5wdXRWYWx1ZUFjY2Vzc29yIHx8IGVsZW1lbnQ7XG5cbiAgICB0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgIC8vIEZvcmNlIHNldHRlciB0byBiZSBjYWxsZWQgaW4gY2FzZSBpZCB3YXMgbm90IHNwZWNpZmllZC5cbiAgICB0aGlzLmlkID0gdGhpcy5pZDtcblxuICAgIC8vIE9uIHNvbWUgdmVyc2lvbnMgb2YgaU9TIHRoZSBjYXJldCBnZXRzIHN0dWNrIGluIHRoZSB3cm9uZyBwbGFjZSB3aGVuIGhvbGRpbmcgZG93biB0aGUgZGVsZXRlXG4gICAgLy8ga2V5LiBJbiBvcmRlciB0byBnZXQgYXJvdW5kIHRoaXMgd2UgbmVlZCB0byBcImppZ2dsZVwiIHRoZSBjYXJldCBsb29zZS4gU2luY2UgdGhpcyBidWcgb25seVxuICAgIC8vIGV4aXN0cyBvbiBpT1MsIHdlIG9ubHkgYm90aGVyIHRvIGluc3RhbGwgdGhlIGxpc3RlbmVyIG9uIGlPUy5cbiAgICBpZiAoX3BsYXRmb3JtLklPUykge1xuICAgICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICBsZXQgZWwgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoIWVsLnZhbHVlICYmICFlbC5zZWxlY3Rpb25TdGFydCAmJiAhZWwuc2VsZWN0aW9uRW5kKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiBKdXN0IHNldHRpbmcgYDAsIDBgIGRvZXNuJ3QgZml4IHRoZSBpc3N1ZS4gU2V0dGluZ1xuICAgICAgICAgICAgLy8gYDEsIDFgIGZpeGVzIGl0IGZvciB0aGUgZmlyc3QgdGltZSB0aGF0IHlvdSB0eXBlIHRleHQgYW5kXG4gICAgICAgICAgICAvLyB0aGVuIGhvbGQgZGVsZXRlLiBUb2dnbGluZyB0byBgMSwgMWAgYW5kIHRoZW4gYmFjayB0b1xuICAgICAgICAgICAgLy8gYDAsIDBgIHNlZW1zIHRvIGNvbXBsZXRlbHkgZml4IGl0LlxuICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMSwgMSk7XG4gICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZSgwLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyO1xuICAgIHRoaXMuX2lzTmF0aXZlU2VsZWN0ID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgdGhpcy5jb250cm9sVHlwZSA9IChlbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50KS5tdWx0aXBsZSA/ICdtYXQtbmF0aXZlLXNlbGVjdC1tdWx0aXBsZScgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtYXQtbmF0aXZlLXNlbGVjdCc7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fYXV0b2ZpbGxNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmF1dG9maWxsZWQgPSBldmVudC5pc0F1dG9maWxsZWQ7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgdGhlIG5hdGl2ZSBlbGVtZW50J3MgdmFsdWUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWUgY2FzZXMgd2hlcmVcbiAgICAvLyB3ZSB3b24ndCBiZSBub3RpZmllZCB3aGVuIGl0IGNoYW5nZXMgKGUuZy4gdGhlIGNvbnN1bWVyIGlzbid0IHVzaW5nIGZvcm1zIG9yIHRoZXkncmVcbiAgICAvLyB1cGRhdGluZyB0aGUgdmFsdWUgdXNpbmcgYGVtaXRFdmVudDogZmFsc2VgKS5cbiAgICB0aGlzLl9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDYWxsYmFjayBmb3IgdGhlIGNhc2VzIHdoZXJlIHRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBpbnB1dCBjaGFuZ2VzLiAqL1xuICBfZm9jdXNDaGFuZ2VkKGlzRm9jdXNlZDogYm9vbGVhbikge1xuICAgIGlmIChpc0ZvY3VzZWQgIT09IHRoaXMuZm9jdXNlZCAmJiAoIXRoaXMucmVhZG9ubHkgfHwgIWlzRm9jdXNlZCkpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCgpIHtcbiAgICAvLyBUaGlzIGlzIGEgbm9vcCBmdW5jdGlvbiBhbmQgaXMgdXNlZCB0byBsZXQgQW5ndWxhciBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIC8vIEFuZ3VsYXIgd2lsbCBydW4gYSBuZXcgY2hhbmdlIGRldGVjdGlvbiBlYWNoIHRpbWUgdGhlIGBpbnB1dGAgZXZlbnQgaGFzIGJlZW4gZGlzcGF0Y2hlZC5cbiAgICAvLyBJdCdzIG5lY2Vzc2FyeSB0aGF0IEFuZ3VsYXIgcmVjb2duaXplcyB0aGUgdmFsdWUgY2hhbmdlLCBiZWNhdXNlIHdoZW4gZmxvYXRpbmdMYWJlbFxuICAgIC8vIGlzIHNldCB0byBmYWxzZSBhbmQgQW5ndWxhciBmb3JtcyBhcmVuJ3QgdXNlZCwgdGhlIHBsYWNlaG9sZGVyIHdvbid0IHJlY29nbml6ZSB0aGVcbiAgICAvLyB2YWx1ZSBjaGFuZ2VzIGFuZCB3aWxsIG5vdCBkaXNhcHBlYXIuXG4gICAgLy8gTGlzdGVuaW5nIHRvIHRoZSBpbnB1dCBldmVudCB3b3VsZG4ndCBiZSBuZWNlc3Nhcnkgd2hlbiB0aGUgaW5wdXQgaXMgdXNpbmcgdGhlXG4gICAgLy8gRm9ybXNNb2R1bGUgb3IgUmVhY3RpdmVGb3Jtc01vZHVsZSwgYmVjYXVzZSBBbmd1bGFyIGZvcm1zIGFsc28gbGlzdGVucyB0byBpbnB1dCBldmVudHMuXG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGhvc3QgaXMgYSB0ZXh0YXJlYS4gKi9cbiAgX2lzVGV4dGFyZWEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndGV4dGFyZWEnO1xuICB9XG5cbiAgLyoqIERvZXMgc29tZSBtYW51YWwgZGlydHkgY2hlY2tpbmcgb24gdGhlIG5hdGl2ZSBpbnB1dCBgdmFsdWVgIHByb3BlcnR5LiAqL1xuICBwcm90ZWN0ZWQgX2RpcnR5Q2hlY2tOYXRpdmVWYWx1ZSgpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcblxuICAgIGlmICh0aGlzLl9wcmV2aW91c05hdGl2ZVZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYWtlIHN1cmUgdGhlIGlucHV0IGlzIGEgc3VwcG9ydGVkIHR5cGUuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVUeXBlKCkge1xuICAgIGlmIChNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTEpIHtcbiAgICAgIHRocm93IGdldE1hdElucHV0VW5zdXBwb3J0ZWRUeXBlRXJyb3IodGhpcy5fdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBpbnB1dCB0eXBlIGlzIG9uZSBvZiB0aGUgdHlwZXMgdGhhdCBhcmUgbmV2ZXIgZW1wdHkuICovXG4gIHByb3RlY3RlZCBfaXNOZXZlckVtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9uZXZlckVtcHR5SW5wdXRUeXBlcy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTE7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IGlzIGludmFsaWQgYmFzZWQgb24gdGhlIG5hdGl2ZSB2YWxpZGF0aW9uLiAqL1xuICBwcm90ZWN0ZWQgX2lzQmFkSW5wdXQoKSB7XG4gICAgLy8gVGhlIGB2YWxpZGl0eWAgcHJvcGVydHkgd29uJ3QgYmUgcHJlc2VudCBvbiBwbGF0Zm9ybS1zZXJ2ZXIuXG4gICAgbGV0IHZhbGlkaXR5ID0gKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWxpZGl0eTtcbiAgICByZXR1cm4gdmFsaWRpdHkgJiYgdmFsaWRpdHkuYmFkSW5wdXQ7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9pc05ldmVyRW1wdHkoKSAmJiAhdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlICYmICF0aGlzLl9pc0JhZElucHV0KCkgJiZcbiAgICAgICAgIXRoaXMuYXV0b2ZpbGxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9pc05hdGl2ZVNlbGVjdCkge1xuICAgICAgLy8gRm9yIGEgc2luZ2xlLXNlbGVjdGlvbiBgPHNlbGVjdD5gLCB0aGUgbGFiZWwgc2hvdWxkIGZsb2F0IHdoZW4gdGhlIHNlbGVjdGVkIG9wdGlvbiBoYXNcbiAgICAgIC8vIGEgbm9uLWVtcHR5IGRpc3BsYXkgdmFsdWUuIEZvciBhIGA8c2VsZWN0IG11bHRpcGxlPmAsIHRoZSBsYWJlbCAqYWx3YXlzKiBmbG9hdHMgdG8gYXZvaWRcbiAgICAgIC8vIG92ZXJsYXBwaW5nIHRoZSBsYWJlbCB3aXRoIHRoZSBvcHRpb25zLlxuICAgICAgY29uc3Qgc2VsZWN0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgIGNvbnN0IGZpcnN0T3B0aW9uOiBIVE1MT3B0aW9uRWxlbWVudCB8IHVuZGVmaW5lZCA9IHNlbGVjdEVsZW1lbnQub3B0aW9uc1swXTtcblxuICAgICAgLy8gT24gbW9zdCBicm93c2VycyB0aGUgYHNlbGVjdGVkSW5kZXhgIHdpbGwgYWx3YXlzIGJlIDAsIGhvd2V2ZXIgb24gSUUgYW5kIEVkZ2UgaXQnbGwgYmVcbiAgICAgIC8vIC0xIGlmIHRoZSBgdmFsdWVgIGlzIHNldCB0byBzb21ldGhpbmcsIHRoYXQgaXNuJ3QgaW4gdGhlIGxpc3Qgb2Ygb3B0aW9ucywgYXQgYSBsYXRlciBwb2ludC5cbiAgICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgc2VsZWN0RWxlbWVudC5tdWx0aXBsZSB8fCAhdGhpcy5lbXB0eSB8fFxuICAgICAgICAgICAgICEhKHNlbGVjdEVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+IC0xICYmIGZpcnN0T3B0aW9uICYmIGZpcnN0T3B0aW9uLmxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgLy8gRG8gbm90IHJlLWZvY3VzIHRoZSBpbnB1dCBlbGVtZW50IGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgZm9jdXNlZC4gT3RoZXJ3aXNlIGl0IGNhbiBoYXBwZW5cbiAgICAvLyB0aGF0IHNvbWVvbmUgY2xpY2tzIG9uIGEgdGltZSBpbnB1dCBhbmQgdGhlIGN1cnNvciByZXNldHMgdG8gdGhlIFwiaG91cnNcIiBmaWVsZCB3aGlsZSB0aGVcbiAgICAvLyBcIm1pbnV0ZXNcIiBmaWVsZCB3YXMgYWN0dWFsbHkgY2xpY2tlZC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xMjg0OVxuICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZWFkb25seTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcblxuICAvLyBBY2NlcHQgYGFueWAgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggb3RoZXIgZGlyZWN0aXZlcyBvbiBgPGlucHV0PmAgdGhhdCBtYXlcbiAgLy8gYWNjZXB0IGRpZmZlcmVudCB0eXBlcy5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBhbnk7XG59XG4iXX0=