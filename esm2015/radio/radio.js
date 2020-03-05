/**
 * @fileoverview added by tsickle
 * Generated from: src/material/radio/radio.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * @record
 */
export function MatRadioDefaultOptions() { }
if (false) {
    /** @type {?} */
    MatRadioDefaultOptions.prototype.color;
}
/** @type {?} */
export const MAT_RADIO_DEFAULT_OPTIONS = new InjectionToken('mat-radio-default-options', {
    providedIn: 'root',
    factory: MAT_RADIO_DEFAULT_OPTIONS_FACTORY
});
/**
 * @return {?}
 */
export function MAT_RADIO_DEFAULT_OPTIONS_FACTORY() {
    return {
        color: 'accent'
    };
}
// Increasing integer for generating unique ids for radio components.
/** @type {?} */
let nextUniqueId = 0;
/**
 * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * \@docs-private
 * @type {?}
 */
export const MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatRadioGroup)),
    multi: true
};
/**
 * Change event object emitted by MatRadio and MatRadioGroup.
 */
export class MatRadioChange {
    /**
     * @param {?} source
     * @param {?} value
     */
    constructor(source, value) {
        this.source = source;
        this.value = value;
    }
}
if (false) {
    /**
     * The MatRadioButton that emits the change event.
     * @type {?}
     */
    MatRadioChange.prototype.source;
    /**
     * The value of the MatRadioButton.
     * @type {?}
     */
    MatRadioChange.prototype.value;
}
/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
 */
export class MatRadioGroup {
    /**
     * @param {?} _changeDetector
     */
    constructor(_changeDetector) {
        this._changeDetector = _changeDetector;
        /**
         * Selected value for the radio group.
         */
        this._value = null;
        /**
         * The HTML name attribute applied to radio buttons in this group.
         */
        this._name = `mat-radio-group-${nextUniqueId++}`;
        /**
         * The currently selected radio button. Should match value.
         */
        this._selected = null;
        /**
         * Whether the `value` has been set to its initial value.
         */
        this._isInitialized = false;
        /**
         * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
         */
        this._labelPosition = 'after';
        /**
         * Whether the radio group is disabled.
         */
        this._disabled = false;
        /**
         * Whether the radio group is required.
         */
        this._required = false;
        /**
         * The method to be called in order to update ngModel
         */
        this._controlValueAccessorChangeFn = (/**
         * @return {?}
         */
        () => { });
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         * \@docs-private
         */
        this.onTouched = (/**
         * @return {?}
         */
        () => { });
        /**
         * Event emitted when the group value changes.
         * Change events are only emitted when the value changes due to user interaction with
         * a radio button (the same behavior as `<input type-"radio">`).
         */
        this.change = new EventEmitter();
    }
    /**
     * Name of the radio button group. All radio buttons inside this group will use this name.
     * @return {?}
     */
    get name() { return this._name; }
    /**
     * @param {?} value
     * @return {?}
     */
    set name(value) {
        this._name = value;
        this._updateRadioButtonNames();
    }
    /**
     * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
     * @return {?}
     */
    get labelPosition() {
        return this._labelPosition;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set labelPosition(v) {
        this._labelPosition = v === 'before' ? 'before' : 'after';
        this._markRadiosForCheck();
    }
    /**
     * Value for the radio-group. Should equal the value of the selected radio button if there is
     * a corresponding radio button with a matching value. If there is not such a corresponding
     * radio button, this value persists to be applied in case a new radio button is added with a
     * matching value.
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        if (this._value !== newValue) {
            // Set this before proceeding to ensure no circular loop occurs with selection.
            this._value = newValue;
            this._updateSelectedRadioFromValue();
            this._checkSelectedRadioButton();
        }
    }
    /**
     * @return {?}
     */
    _checkSelectedRadioButton() {
        if (this._selected && !this._selected.checked) {
            this._selected.checked = true;
        }
    }
    /**
     * The currently selected radio button. If set to a new radio button, the radio group value
     * will be updated to match the new selected button.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.value = selected ? selected.value : null;
        this._checkSelectedRadioButton();
    }
    /**
     * Whether the radio group is disabled
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._markRadiosForCheck();
    }
    /**
     * Whether the radio group is required
     * @return {?}
     */
    get required() { return this._required; }
    /**
     * @param {?} value
     * @return {?}
     */
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this._markRadiosForCheck();
    }
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     * @return {?}
     */
    ngAfterContentInit() {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MatRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MatRadioGroup.
        this._isInitialized = true;
    }
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     * @return {?}
     */
    _touch() {
        if (this.onTouched) {
            this.onTouched();
        }
    }
    /**
     * @private
     * @return {?}
     */
    _updateRadioButtonNames() {
        if (this._radios) {
            this._radios.forEach((/**
             * @param {?} radio
             * @return {?}
             */
            radio => {
                radio.name = this.name;
                radio._markForCheck();
            }));
        }
    }
    /**
     * Updates the `selected` radio button from the internal _value state.
     * @private
     * @return {?}
     */
    _updateSelectedRadioFromValue() {
        // If the value already matches the selected radio, do nothing.
        /** @type {?} */
        const isAlreadySelected = this._selected !== null && this._selected.value === this._value;
        if (this._radios && !isAlreadySelected) {
            this._selected = null;
            this._radios.forEach((/**
             * @param {?} radio
             * @return {?}
             */
            radio => {
                radio.checked = this.value === radio.value;
                if (radio.checked) {
                    this._selected = radio;
                }
            }));
        }
    }
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    _emitChangeEvent() {
        if (this._isInitialized) {
            this.change.emit(new MatRadioChange((/** @type {?} */ (this._selected)), this._value));
        }
    }
    /**
     * @return {?}
     */
    _markRadiosForCheck() {
        if (this._radios) {
            this._radios.forEach((/**
             * @param {?} radio
             * @return {?}
             */
            radio => radio._markForCheck()));
        }
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        this._changeDetector.markForCheck();
    }
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled Whether the control should be disabled.
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._changeDetector.markForCheck();
    }
}
MatRadioGroup.decorators = [
    { type: Directive, args: [{
                selector: 'mat-radio-group',
                exportAs: 'matRadioGroup',
                providers: [MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-radio-group',
                },
            },] }
];
/** @nocollapse */
MatRadioGroup.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
MatRadioGroup.propDecorators = {
    change: [{ type: Output }],
    _radios: [{ type: ContentChildren, args: [forwardRef((/**
                 * @return {?}
                 */
                () => MatRadioButton)), { descendants: true },] }],
    color: [{ type: Input }],
    name: [{ type: Input }],
    labelPosition: [{ type: Input }],
    value: [{ type: Input }],
    selected: [{ type: Input }],
    disabled: [{ type: Input }],
    required: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatRadioGroup.ngAcceptInputType_disabled;
    /** @type {?} */
    MatRadioGroup.ngAcceptInputType_required;
    /**
     * Selected value for the radio group.
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._value;
    /**
     * The HTML name attribute applied to radio buttons in this group.
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._name;
    /**
     * The currently selected radio button. Should match value.
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._selected;
    /**
     * Whether the `value` has been set to its initial value.
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._isInitialized;
    /**
     * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._labelPosition;
    /**
     * Whether the radio group is disabled.
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._disabled;
    /**
     * Whether the radio group is required.
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._required;
    /**
     * The method to be called in order to update ngModel
     * @type {?}
     */
    MatRadioGroup.prototype._controlValueAccessorChangeFn;
    /**
     * onTouch function registered via registerOnTouch (ControlValueAccessor).
     * \@docs-private
     * @type {?}
     */
    MatRadioGroup.prototype.onTouched;
    /**
     * Event emitted when the group value changes.
     * Change events are only emitted when the value changes due to user interaction with
     * a radio button (the same behavior as `<input type-"radio">`).
     * @type {?}
     */
    MatRadioGroup.prototype.change;
    /**
     * Child radio buttons.
     * @type {?}
     */
    MatRadioGroup.prototype._radios;
    /**
     * Theme color for all of the radio buttons in the group.
     * @type {?}
     */
    MatRadioGroup.prototype.color;
    /**
     * @type {?}
     * @private
     */
    MatRadioGroup.prototype._changeDetector;
}
// Boilerplate for applying mixins to MatRadioButton.
/**
 * \@docs-private
 */
class MatRadioButtonBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatRadioButtonBase.prototype.disabled;
    /** @type {?} */
    MatRadioButtonBase.prototype._elementRef;
}
// As per Material design specifications the selection control radio should use the accent color
// palette by default. https://material.io/guidelines/components/selection-controls.html
/** @type {?} */
const _MatRadioButtonMixinBase = mixinDisableRipple(mixinTabIndex(MatRadioButtonBase));
/**
 * A Material design radio-button. Typically placed inside of `<mat-radio-group>` elements.
 */
export class MatRadioButton extends _MatRadioButtonMixinBase {
    /**
     * @param {?} radioGroup
     * @param {?} elementRef
     * @param {?} _changeDetector
     * @param {?} _focusMonitor
     * @param {?} _radioDispatcher
     * @param {?=} _animationMode
     * @param {?=} _providerOverride
     */
    constructor(radioGroup, elementRef, _changeDetector, _focusMonitor, _radioDispatcher, _animationMode, _providerOverride) {
        super(elementRef);
        this._changeDetector = _changeDetector;
        this._focusMonitor = _focusMonitor;
        this._radioDispatcher = _radioDispatcher;
        this._animationMode = _animationMode;
        this._providerOverride = _providerOverride;
        this._uniqueId = `mat-radio-${++nextUniqueId}`;
        /**
         * The unique ID for the radio button.
         */
        this.id = this._uniqueId;
        /**
         * Event emitted when the checked state of this radio button changes.
         * Change events are only emitted when the value changes due to user interaction with
         * the radio button (the same behavior as `<input type-"radio">`).
         */
        this.change = new EventEmitter();
        /**
         * Whether this radio is checked.
         */
        this._checked = false;
        /**
         * Value assigned to this radio.
         */
        this._value = null;
        /**
         * Unregister function for _radioDispatcher
         */
        this._removeUniqueSelectionListener = (/**
         * @return {?}
         */
        () => { });
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        this.radioGroup = radioGroup;
        this._removeUniqueSelectionListener =
            _radioDispatcher.listen((/**
             * @param {?} id
             * @param {?} name
             * @return {?}
             */
            (id, name) => {
                if (id !== this.id && name === this.name) {
                    this.checked = false;
                }
            }));
    }
    /**
     * Whether this radio button is checked.
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @param {?} value
     * @return {?}
     */
    set checked(value) {
        /** @type {?} */
        const newCheckedState = coerceBooleanProperty(value);
        if (this._checked !== newCheckedState) {
            this._checked = newCheckedState;
            if (newCheckedState && this.radioGroup && this.radioGroup.value !== this.value) {
                this.radioGroup.selected = this;
            }
            else if (!newCheckedState && this.radioGroup && this.radioGroup.value === this.value) {
                // When unchecking the selected radio button, update the selected radio
                // property on the group.
                this.radioGroup.selected = null;
            }
            if (newCheckedState) {
                // Notify all radio buttons with the same name to un-check.
                this._radioDispatcher.notify(this.id, this.name);
            }
            this._changeDetector.markForCheck();
        }
    }
    /**
     * The value of this radio button.
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        if (this._value !== value) {
            this._value = value;
            if (this.radioGroup !== null) {
                if (!this.checked) {
                    // Update checked when the value changed to match the radio group's value
                    this.checked = this.radioGroup.value === value;
                }
                if (this.checked) {
                    this.radioGroup.selected = this;
                }
            }
        }
    }
    /**
     * Whether the label should appear after or before the radio button. Defaults to 'after'
     * @return {?}
     */
    get labelPosition() {
        return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set labelPosition(value) {
        this._labelPosition = value;
    }
    /**
     * Whether the radio button is disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._setDisabled(coerceBooleanProperty(value));
    }
    /**
     * Whether the radio button is required.
     * @return {?}
     */
    get required() {
        return this._required || (this.radioGroup && this.radioGroup.required);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /**
     * Theme color of the radio button.
     * @return {?}
     */
    get color() {
        return this._color ||
            (this.radioGroup && this.radioGroup.color) ||
            this._providerOverride && this._providerOverride.color || 'accent';
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set color(newValue) { this._color = newValue; }
    /**
     * ID of the native input element inside `<mat-radio-button>`
     * @return {?}
     */
    get inputId() { return `${this.id || this._uniqueId}-input`; }
    /**
     * Focuses the radio button.
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
    }
    /**
     * Marks the radio button as needing checking for change detection.
     * This method is exposed because the parent radio group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    _markForCheck() {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update radio button's status
        this._changeDetector.markForCheck();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe((/**
         * @param {?} focusOrigin
         * @return {?}
         */
        focusOrigin => {
            if (!focusOrigin && this.radioGroup) {
                this.radioGroup._touch();
            }
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._removeUniqueSelectionListener();
    }
    /**
     * Dispatch change event with current value.
     * @private
     * @return {?}
     */
    _emitChangeEvent() {
        this.change.emit(new MatRadioChange(this, this._value));
    }
    /**
     * @return {?}
     */
    _isRippleDisabled() {
        return this.disableRipple || this.disabled;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onInputClick(event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }
    /**
     * Triggered when the radio button received a click or the input recognized any change.
     * Clicking on a label element, will trigger a change event on the associated input.
     * @param {?} event
     * @return {?}
     */
    _onInputChange(event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        /** @type {?} */
        const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
        this.checked = true;
        this._emitChangeEvent();
        if (this.radioGroup) {
            this.radioGroup._controlValueAccessorChangeFn(this.value);
            if (groupValueChanged) {
                this.radioGroup._emitChangeEvent();
            }
        }
    }
    /**
     * Sets the disabled state and marks for check if a change occurred.
     * @protected
     * @param {?} value
     * @return {?}
     */
    _setDisabled(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            this._changeDetector.markForCheck();
        }
    }
}
MatRadioButton.decorators = [
    { type: Component, args: [{
                selector: 'mat-radio-button',
                template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <div class=\"mat-radio-container\">\n    <div class=\"mat-radio-outer-circle\"></div>\n    <div class=\"mat-radio-inner-circle\"></div>\n    <input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputChange($event)\"\n        (click)=\"_onInputClick($event)\">\n\n    <!-- The ripple comes after the input so that we can target it with a CSS\n         sibling selector when the input is focused. -->\n    <div mat-ripple class=\"mat-radio-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: 150}\">\n\n      <div class=\"mat-ripple-element mat-radio-persistent-ripple\"></div>\n    </div>\n  </div>\n\n  <!-- The label content for radio control. -->\n  <div class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </div>\n</label>\n",
                inputs: ['disableRipple', 'tabIndex'],
                encapsulation: ViewEncapsulation.None,
                exportAs: 'matRadioButton',
                host: {
                    'class': 'mat-radio-button',
                    '[class.mat-radio-checked]': 'checked',
                    '[class.mat-radio-disabled]': 'disabled',
                    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    '[class.mat-primary]': 'color === "primary"',
                    '[class.mat-accent]': 'color === "accent"',
                    '[class.mat-warn]': 'color === "warn"',
                    // Needs to be -1 so the `focus` event still fires.
                    '[attr.tabindex]': '-1',
                    '[attr.id]': 'id',
                    '[attr.aria-label]': 'null',
                    '[attr.aria-labelledby]': 'null',
                    '[attr.aria-describedby]': 'null',
                    // Note: under normal conditions focus shouldn't land on this element, however it may be
                    // programmatically set, for example inside of a focus trap, in this case we want to forward
                    // the focus to the native element.
                    '(focus)': '_inputElement.nativeElement.focus()',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:transform ease 280ms,background-color ease 280ms;width:20px;transform:scale(0.001)}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5)}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{bottom:0;left:50%}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"]
            }] }
];
/** @nocollapse */
MatRadioButton.ctorParameters = () => [
    { type: MatRadioGroup, decorators: [{ type: Optional }] },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: FocusMonitor },
    { type: UniqueSelectionDispatcher },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RADIO_DEFAULT_OPTIONS,] }] }
];
MatRadioButton.propDecorators = {
    id: [{ type: Input }],
    name: [{ type: Input }],
    ariaLabel: [{ type: Input, args: ['aria-label',] }],
    ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
    ariaDescribedby: [{ type: Input, args: ['aria-describedby',] }],
    checked: [{ type: Input }],
    value: [{ type: Input }],
    labelPosition: [{ type: Input }],
    disabled: [{ type: Input }],
    required: [{ type: Input }],
    color: [{ type: Input }],
    change: [{ type: Output }],
    _inputElement: [{ type: ViewChild, args: ['input',] }]
};
if (false) {
    /** @type {?} */
    MatRadioButton.ngAcceptInputType_checked;
    /** @type {?} */
    MatRadioButton.ngAcceptInputType_disabled;
    /** @type {?} */
    MatRadioButton.ngAcceptInputType_required;
    /** @type {?} */
    MatRadioButton.ngAcceptInputType_disableRipple;
    /**
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._uniqueId;
    /**
     * The unique ID for the radio button.
     * @type {?}
     */
    MatRadioButton.prototype.id;
    /**
     * Analog to HTML 'name' attribute used to group radios for unique selection.
     * @type {?}
     */
    MatRadioButton.prototype.name;
    /**
     * Used to set the 'aria-label' attribute on the underlying input element.
     * @type {?}
     */
    MatRadioButton.prototype.ariaLabel;
    /**
     * The 'aria-labelledby' attribute takes precedence as the element's text alternative.
     * @type {?}
     */
    MatRadioButton.prototype.ariaLabelledby;
    /**
     * The 'aria-describedby' attribute is read after the element's label and field type.
     * @type {?}
     */
    MatRadioButton.prototype.ariaDescribedby;
    /**
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._labelPosition;
    /**
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._color;
    /**
     * Event emitted when the checked state of this radio button changes.
     * Change events are only emitted when the value changes due to user interaction with
     * the radio button (the same behavior as `<input type-"radio">`).
     * @type {?}
     */
    MatRadioButton.prototype.change;
    /**
     * The parent radio group. May or may not be present.
     * @type {?}
     */
    MatRadioButton.prototype.radioGroup;
    /**
     * Whether this radio is checked.
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._checked;
    /**
     * Whether this radio is disabled.
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._disabled;
    /**
     * Whether this radio is required.
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._required;
    /**
     * Value assigned to this radio.
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._value;
    /**
     * Unregister function for _radioDispatcher
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._removeUniqueSelectionListener;
    /**
     * The native `<input type=radio>` element
     * @type {?}
     */
    MatRadioButton.prototype._inputElement;
    /**
     * @type {?}
     * @protected
     */
    MatRadioButton.prototype._changeDetector;
    /**
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._focusMonitor;
    /**
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._radioDispatcher;
    /** @type {?} */
    MatRadioButton.prototype._animationMode;
    /**
     * @type {?}
     * @private
     */
    MatRadioButton.prototype._providerOverride;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFLTCxrQkFBa0IsRUFDbEIsYUFBYSxHQUVkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7QUFHM0UsNENBRUM7OztJQURDLHVDQUFvQjs7O0FBR3RCLE1BQU0sT0FBTyx5QkFBeUIsR0FDcEMsSUFBSSxjQUFjLENBQXlCLDJCQUEyQixFQUFFO0lBQ3hFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxpQ0FBaUM7Q0FDM0MsQ0FBQzs7OztBQUVGLE1BQU0sVUFBVSxpQ0FBaUM7SUFDL0MsT0FBTztRQUNMLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUM7QUFDSixDQUFDOzs7SUFHRyxZQUFZLEdBQUcsQ0FBQzs7Ozs7OztBQU9wQixNQUFNLE9BQU8sc0NBQXNDLEdBQVE7SUFD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TCxLQUFLLFNBQUMsWUFBWTs2QkFHbEIsS0FBSyxTQUFDLGlCQUFpQjs4QkFHdkIsS0FBSyxTQUFDLGtCQUFrQjtzQkFHeEIsS0FBSztvQkF3QkwsS0FBSzs0QkFrQkwsS0FBSzt1QkFVTCxLQUFLO3VCQVNMLEtBQUs7b0JBU0wsS0FBSztxQkFjTCxNQUFNOzRCQXdCTixTQUFTLFNBQUMsT0FBTzs7OztJQWtIbEIseUNBQStDOztJQUMvQywwQ0FBZ0Q7O0lBQ2hELDBDQUFnRDs7SUFDaEQsK0NBQXFEOzs7OztJQW5QckQsbUNBQTBEOzs7OztJQUcxRCw0QkFBcUM7Ozs7O0lBR3JDLDhCQUFzQjs7Ozs7SUFHdEIsbUNBQXVDOzs7OztJQUd2Qyx3Q0FBaUQ7Ozs7O0lBR2pELHlDQUFtRDs7Ozs7SUFvRG5ELHdDQUEyQzs7Ozs7SUE0QjNDLGdDQUE2Qjs7Ozs7OztJQU83QixnQ0FBNkY7Ozs7O0lBRzdGLG9DQUEwQjs7Ozs7O0lBTTFCLGtDQUFrQzs7Ozs7O0lBR2xDLG1DQUEyQjs7Ozs7O0lBRzNCLG1DQUEyQjs7Ozs7O0lBRzNCLGdDQUEyQjs7Ozs7O0lBRzNCLHdEQUE4RDs7Ozs7SUFHOUQsdUNBQWdFOzs7OztJQUlwRCx5Q0FBNEM7Ozs7O0lBQzVDLHVDQUFtQzs7Ozs7SUFDbkMsMENBQW1EOztJQUNuRCx3Q0FBeUU7Ozs7O0lBQ3ZFLDJDQUNrRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7VW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyB7XG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG59XG5cbmV4cG9ydCBjb25zdCBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdFJhZGlvRGVmYXVsdE9wdGlvbnM+KCdtYXQtcmFkaW8tZGVmYXVsdC1vcHRpb25zJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVF9SQURJT19ERUZBVUxUX09QVElPTlNfRkFDVE9SWVxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgY29sb3I6ICdhY2NlbnQnXG4gIH07XG59XG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzIGZvciByYWRpbyBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtcmFkaW8tZ3JvdXAgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci4gVGhpc1xuICogYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIG5nQ29udHJvbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SQURJT19HUk9VUF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRSYWRpb0dyb3VwKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0UmFkaW8gYW5kIE1hdFJhZGlvR3JvdXAuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIE1hdFJhZGlvQnV0dG9uIHRoYXQgZW1pdHMgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRSYWRpb0J1dHRvbixcbiAgICAvKiogVGhlIHZhbHVlIG9mIHRoZSBNYXRSYWRpb0J1dHRvbi4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkge31cbn1cblxuLyoqXG4gKiBBIGdyb3VwIG9mIHJhZGlvIGJ1dHRvbnMuIE1heSBjb250YWluIG9uZSBvciBtb3JlIGA8bWF0LXJhZGlvLWJ1dHRvbj5gIGVsZW1lbnRzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcmFkaW8tZ3JvdXAnLFxuICBleHBvcnRBczogJ21hdFJhZGlvR3JvdXAnLFxuICBwcm92aWRlcnM6IFtNQVRfUkFESU9fR1JPVVBfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUl0sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdyYWRpb2dyb3VwJyxcbiAgICAnY2xhc3MnOiAnbWF0LXJhZGlvLWdyb3VwJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqIFNlbGVjdGVkIHZhbHVlIGZvciB0aGUgcmFkaW8gZ3JvdXAuICovXG4gIHByaXZhdGUgX3ZhbHVlOiBhbnkgPSBudWxsO1xuXG4gIC8qKiBUaGUgSFRNTCBuYW1lIGF0dHJpYnV0ZSBhcHBsaWVkIHRvIHJhZGlvIGJ1dHRvbnMgaW4gdGhpcyBncm91cC4gKi9cbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nID0gYG1hdC1yYWRpby1ncm91cC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmFkaW8gYnV0dG9uLiBTaG91bGQgbWF0Y2ggdmFsdWUuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkOiBNYXRSYWRpb0J1dHRvbiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBgdmFsdWVgIGhhcyBiZWVuIHNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbHMgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHJhZGlvLWJ1dHRvbnMuIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgcHJpdmF0ZSBfbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgZGlzYWJsZWQuICovXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGdyb3VwIGlzIHJlcXVpcmVkLiAqL1xuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWV0aG9kIHRvIGJlIGNhbGxlZCBpbiBvcmRlciB0byB1cGRhdGUgbmdNb2RlbCAqL1xuICBfY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbjogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogb25Ub3VjaCBmdW5jdGlvbiByZWdpc3RlcmVkIHZpYSByZWdpc3Rlck9uVG91Y2ggKENvbnRyb2xWYWx1ZUFjY2Vzc29yKS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBncm91cCB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBDaGFuZ2UgZXZlbnRzIGFyZSBvbmx5IGVtaXR0ZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcyBkdWUgdG8gdXNlciBpbnRlcmFjdGlvbiB3aXRoXG4gICAqIGEgcmFkaW8gYnV0dG9uICh0aGUgc2FtZSBiZWhhdmlvciBhcyBgPGlucHV0IHR5cGUtXCJyYWRpb1wiPmApLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+KCk7XG5cbiAgLyoqIENoaWxkIHJhZGlvIGJ1dHRvbnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRSYWRpb0J1dHRvbiksIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgX3JhZGlvczogUXVlcnlMaXN0PE1hdFJhZGlvQnV0dG9uPjtcblxuICAvKiogVGhlbWUgY29sb3IgZm9yIGFsbCBvZiB0aGUgcmFkaW8gYnV0dG9ucyBpbiB0aGUgZ3JvdXAuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIHJhZGlvIGJ1dHRvbiBncm91cC4gQWxsIHJhZGlvIGJ1dHRvbnMgaW5zaWRlIHRoaXMgZ3JvdXAgd2lsbCB1c2UgdGhpcyBuYW1lLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbmFtZTsgfVxuICBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVJhZGlvQnV0dG9uTmFtZXMoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbHMgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHJhZGlvLWJ1dHRvbnMuIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KClcbiAgZ2V0IGxhYmVsUG9zaXRpb24oKTogJ2JlZm9yZScgfCAnYWZ0ZXInIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxQb3NpdGlvbjtcbiAgfVxuICBzZXQgbGFiZWxQb3NpdGlvbih2KSB7XG4gICAgdGhpcy5fbGFiZWxQb3NpdGlvbiA9IHYgPT09ICdiZWZvcmUnID8gJ2JlZm9yZScgOiAnYWZ0ZXInO1xuICAgIHRoaXMuX21hcmtSYWRpb3NGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbHVlIGZvciB0aGUgcmFkaW8tZ3JvdXAuIFNob3VsZCBlcXVhbCB0aGUgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIHJhZGlvIGJ1dHRvbiBpZiB0aGVyZSBpc1xuICAgKiBhIGNvcnJlc3BvbmRpbmcgcmFkaW8gYnV0dG9uIHdpdGggYSBtYXRjaGluZyB2YWx1ZS4gSWYgdGhlcmUgaXMgbm90IHN1Y2ggYSBjb3JyZXNwb25kaW5nXG4gICAqIHJhZGlvIGJ1dHRvbiwgdGhpcyB2YWx1ZSBwZXJzaXN0cyB0byBiZSBhcHBsaWVkIGluIGNhc2UgYSBuZXcgcmFkaW8gYnV0dG9uIGlzIGFkZGVkIHdpdGggYVxuICAgKiBtYXRjaGluZyB2YWx1ZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAvLyBTZXQgdGhpcyBiZWZvcmUgcHJvY2VlZGluZyB0byBlbnN1cmUgbm8gY2lyY3VsYXIgbG9vcCBvY2N1cnMgd2l0aCBzZWxlY3Rpb24uXG4gICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLl91cGRhdGVTZWxlY3RlZFJhZGlvRnJvbVZhbHVlKCk7XG4gICAgICB0aGlzLl9jaGVja1NlbGVjdGVkUmFkaW9CdXR0b24oKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tTZWxlY3RlZFJhZGlvQnV0dG9uKCkge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZCAmJiAhdGhpcy5fc2VsZWN0ZWQuY2hlY2tlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQuY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmFkaW8gYnV0dG9uLiBJZiBzZXQgdG8gYSBuZXcgcmFkaW8gYnV0dG9uLCB0aGUgcmFkaW8gZ3JvdXAgdmFsdWVcbiAgICogd2lsbCBiZSB1cGRhdGVkIHRvIG1hdGNoIHRoZSBuZXcgc2VsZWN0ZWQgYnV0dG9uLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCkgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7IH1cbiAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkOiBNYXRSYWRpb0J1dHRvbiB8IG51bGwpIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMudmFsdWUgPSBzZWxlY3RlZCA/IHNlbGVjdGVkLnZhbHVlIDogbnVsbDtcbiAgICB0aGlzLl9jaGVja1NlbGVjdGVkUmFkaW9CdXR0b24oKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyBkaXNhYmxlZCAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fbWFya1JhZGlvc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgcmVxdWlyZWQgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX21hcmtSYWRpb3NGb3JDaGVjaygpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwcm9wZXJ0aWVzIG9uY2UgY29udGVudCBjaGlsZHJlbiBhcmUgYXZhaWxhYmxlLlxuICAgKiBUaGlzIGFsbG93cyB1cyB0byBwcm9wYWdhdGUgcmVsZXZhbnQgYXR0cmlidXRlcyB0byBhc3NvY2lhdGVkIGJ1dHRvbnMuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gTWFyayB0aGlzIGNvbXBvbmVudCBhcyBpbml0aWFsaXplZCBpbiBBZnRlckNvbnRlbnRJbml0IGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2FuXG4gICAgLy8gcG9zc2libHkgYmUgc2V0IGJ5IE5nTW9kZWwgb24gTWF0UmFkaW9Hcm91cCwgYW5kIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIE9uSW5pdCBvZiB0aGVcbiAgICAvLyBOZ01vZGVsIG9jY3VycyAqYWZ0ZXIqIHRoZSBPbkluaXQgb2YgdGhlIE1hdFJhZGlvR3JvdXAuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTWFyayB0aGlzIGdyb3VwIGFzIGJlaW5nIFwidG91Y2hlZFwiIChmb3IgbmdNb2RlbCkuIE1lYW50IHRvIGJlIGNhbGxlZCBieSB0aGUgY29udGFpbmVkXG4gICAqIHJhZGlvIGJ1dHRvbnMgdXBvbiB0aGVpciBibHVyLlxuICAgKi9cbiAgX3RvdWNoKCkge1xuICAgIGlmICh0aGlzLm9uVG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSYWRpb0J1dHRvbk5hbWVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9yYWRpb3MpIHtcbiAgICAgIHRoaXMuX3JhZGlvcy5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8ubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgcmFkaW8uX21hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGBzZWxlY3RlZGAgcmFkaW8gYnV0dG9uIGZyb20gdGhlIGludGVybmFsIF92YWx1ZSBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgYWxyZWFkeSBtYXRjaGVzIHRoZSBzZWxlY3RlZCByYWRpbywgZG8gbm90aGluZy5cbiAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkICE9PSBudWxsICYmIHRoaXMuX3NlbGVjdGVkLnZhbHVlID09PSB0aGlzLl92YWx1ZTtcblxuICAgIGlmICh0aGlzLl9yYWRpb3MgJiYgIWlzQWxyZWFkeVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IG51bGw7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmNoZWNrZWQgPSB0aGlzLnZhbHVlID09PSByYWRpby52YWx1ZTtcbiAgICAgICAgaWYgKHJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHJhZGlvO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRSYWRpb0NoYW5nZSh0aGlzLl9zZWxlY3RlZCEsIHRoaXMuX3ZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgX21hcmtSYWRpb3NGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5fcmFkaW9zKSB7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiByYWRpby5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vZGVsIHZhbHVlIGNoYW5nZXMuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFJhZGlvQnV0dG9uLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFJhZGlvQnV0dG9uQmFzZSB7XG4gIC8vIFNpbmNlIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eSBpcyBtYW51YWxseSBkZWZpbmVkIGZvciB0aGUgTWF0UmFkaW9CdXR0b24gYW5kIGlzbid0IHNldCB1cCBpblxuICAvLyB0aGUgbWl4aW4gYmFzZSBjbGFzcy4gVG8gYmUgYWJsZSB0byB1c2UgdGhlIHRhYmluZGV4IG1peGluLCBhIGRpc2FibGVkIHByb3BlcnR5IG11c3QgYmVcbiAgLy8gZGVmaW5lZCB0byBwcm9wZXJseSB3b3JrLlxuICBkaXNhYmxlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG4vLyBBcyBwZXIgTWF0ZXJpYWwgZGVzaWduIHNwZWNpZmljYXRpb25zIHRoZSBzZWxlY3Rpb24gY29udHJvbCByYWRpbyBzaG91bGQgdXNlIHRoZSBhY2NlbnQgY29sb3Jcbi8vIHBhbGV0dGUgYnkgZGVmYXVsdC4gaHR0cHM6Ly9tYXRlcmlhbC5pby9ndWlkZWxpbmVzL2NvbXBvbmVudHMvc2VsZWN0aW9uLWNvbnRyb2xzLmh0bWxcbmNvbnN0IF9NYXRSYWRpb0J1dHRvbk1peGluQmFzZTpcbiAgICBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIEhhc1RhYkluZGV4Q3RvciAmIHR5cGVvZiBNYXRSYWRpb0J1dHRvbkJhc2UgPVxuICAgICAgICBtaXhpbkRpc2FibGVSaXBwbGUobWl4aW5UYWJJbmRleChNYXRSYWRpb0J1dHRvbkJhc2UpKTtcblxuLyoqXG4gKiBBIE1hdGVyaWFsIGRlc2lnbiByYWRpby1idXR0b24uIFR5cGljYWxseSBwbGFjZWQgaW5zaWRlIG9mIGA8bWF0LXJhZGlvLWdyb3VwPmAgZWxlbWVudHMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1yYWRpby1idXR0b24nLFxuICB0ZW1wbGF0ZVVybDogJ3JhZGlvLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncmFkaW8uY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0UmFkaW9CdXR0b24nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1yYWRpby1idXR0b24nLFxuICAgICdbY2xhc3MubWF0LXJhZGlvLWNoZWNrZWRdJzogJ2NoZWNrZWQnLFxuICAgICdbY2xhc3MubWF0LXJhZGlvLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgPT09IFwicHJpbWFyeVwiJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgIC8vIE5lZWRzIHRvIGJlIC0xIHNvIHRoZSBgZm9jdXNgIGV2ZW50IHN0aWxsIGZpcmVzLlxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnLTEnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnbnVsbCcsXG4gICAgLy8gTm90ZTogdW5kZXIgbm9ybWFsIGNvbmRpdGlvbnMgZm9jdXMgc2hvdWxkbid0IGxhbmQgb24gdGhpcyBlbGVtZW50LCBob3dldmVyIGl0IG1heSBiZVxuICAgIC8vIHByb2dyYW1tYXRpY2FsbHkgc2V0LCBmb3IgZXhhbXBsZSBpbnNpZGUgb2YgYSBmb2N1cyB0cmFwLCBpbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBmb3J3YXJkXG4gICAgLy8gdGhlIGZvY3VzIHRvIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICAnKGZvY3VzKSc6ICdfaW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0J1dHRvbiBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbk1peGluQmFzZVxuICAgIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGVSaXBwbGUsIEhhc1RhYkluZGV4IHtcblxuICBwcml2YXRlIF91bmlxdWVJZDogc3RyaW5nID0gYG1hdC1yYWRpby0keysrbmV4dFVuaXF1ZUlkfWA7XG5cbiAgLyoqIFRoZSB1bmlxdWUgSUQgZm9yIHRoZSByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSB0aGlzLl91bmlxdWVJZDtcblxuICAvKiogQW5hbG9nIHRvIEhUTUwgJ25hbWUnIGF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIHJhZGlvcyBmb3IgdW5pcXVlIHNlbGVjdGlvbi4gKi9cbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgJ2FyaWEtbGFiZWwnIGF0dHJpYnV0ZSBvbiB0aGUgdW5kZXJseWluZyBpbnB1dCBlbGVtZW50LiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlICdhcmlhLWxhYmVsbGVkYnknIGF0dHJpYnV0ZSB0YWtlcyBwcmVjZWRlbmNlIGFzIHRoZSBlbGVtZW50J3MgdGV4dCBhbHRlcm5hdGl2ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgJ2FyaWEtZGVzY3JpYmVkYnknIGF0dHJpYnV0ZSBpcyByZWFkIGFmdGVyIHRoZSBlbGVtZW50J3MgbGFiZWwgYW5kIGZpZWxkIHR5cGUuICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2hlY2tlZDsgfVxuICBzZXQgY2hlY2tlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld0NoZWNrZWRTdGF0ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX2NoZWNrZWQgIT09IG5ld0NoZWNrZWRTdGF0ZSkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IG5ld0NoZWNrZWRTdGF0ZTtcbiAgICAgIGlmIChuZXdDaGVja2VkU3RhdGUgJiYgdGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC52YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSB0aGlzO1xuICAgICAgfSBlbHNlIGlmICghbmV3Q2hlY2tlZFN0YXRlICYmIHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHRoaXMudmFsdWUpIHtcblxuICAgICAgICAvLyBXaGVuIHVuY2hlY2tpbmcgdGhlIHNlbGVjdGVkIHJhZGlvIGJ1dHRvbiwgdXBkYXRlIHRoZSBzZWxlY3RlZCByYWRpb1xuICAgICAgICAvLyBwcm9wZXJ0eSBvbiB0aGUgZ3JvdXAuXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdDaGVja2VkU3RhdGUpIHtcbiAgICAgICAgLy8gTm90aWZ5IGFsbCByYWRpbyBidXR0b25zIHdpdGggdGhlIHNhbWUgbmFtZSB0byB1bi1jaGVjay5cbiAgICAgICAgdGhpcy5fcmFkaW9EaXNwYXRjaGVyLm5vdGlmeSh0aGlzLmlkLCB0aGlzLm5hbWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGlzIHJhZGlvIGJ1dHRvbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5yYWRpb0dyb3VwICE9PSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIGNoZWNrZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlZCB0byBtYXRjaCB0aGUgcmFkaW8gZ3JvdXAncyB2YWx1ZVxuICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMucmFkaW9Hcm91cC52YWx1ZSA9PT0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHJhZGlvIGJ1dHRvbi4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKVxuICBnZXQgbGFiZWxQb3NpdGlvbigpOiAnYmVmb3JlJyB8ICdhZnRlcicge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbFBvc2l0aW9uIHx8ICh0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLmxhYmVsUG9zaXRpb24pIHx8ICdhZnRlcic7XG4gIH1cbiAgc2V0IGxhYmVsUG9zaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9sYWJlbFBvc2l0aW9uID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMucmFkaW9Hcm91cCAhPT0gbnVsbCAmJiB0aGlzLnJhZGlvR3JvdXAuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NldERpc2FibGVkKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZCB8fCAodGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC5yZXF1aXJlZCk7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvciB8fFxuICAgICAgKHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAuY29sb3IpIHx8XG4gICAgICB0aGlzLl9wcm92aWRlck92ZXJyaWRlICYmIHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGUuY29sb3IgfHwgJ2FjY2VudCc7XG4gIH1cbiAgc2V0IGNvbG9yKG5ld1ZhbHVlOiBUaGVtZVBhbGV0dGUpIHsgdGhpcy5fY29sb3IgPSBuZXdWYWx1ZTsgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhpcyByYWRpbyBidXR0b24gY2hhbmdlcy5cbiAgICogQ2hhbmdlIGV2ZW50cyBhcmUgb25seSBlbWl0dGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgZHVlIHRvIHVzZXIgaW50ZXJhY3Rpb24gd2l0aFxuICAgKiB0aGUgcmFkaW8gYnV0dG9uICh0aGUgc2FtZSBiZWhhdmlvciBhcyBgPGlucHV0IHR5cGUtXCJyYWRpb1wiPmApLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+KCk7XG5cbiAgLyoqIFRoZSBwYXJlbnQgcmFkaW8gZ3JvdXAuIE1heSBvciBtYXkgbm90IGJlIHByZXNlbnQuICovXG4gIHJhZGlvR3JvdXA6IE1hdFJhZGlvR3JvdXA7XG5cbiAgLyoqIElEIG9mIHRoZSBuYXRpdmUgaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtcmFkaW8tYnV0dG9uPmAgKi9cbiAgZ2V0IGlucHV0SWQoKTogc3RyaW5nIHsgcmV0dXJuIGAke3RoaXMuaWQgfHwgdGhpcy5fdW5pcXVlSWR9LWlucHV0YDsgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgY2hlY2tlZC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgZGlzYWJsZWQuICovXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgcmVxdWlyZWQuICovXG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBWYWx1ZSBhc3NpZ25lZCB0byB0aGlzIHJhZGlvLiAqL1xuICBwcml2YXRlIF92YWx1ZTogYW55ID0gbnVsbDtcblxuICAvKiogVW5yZWdpc3RlciBmdW5jdGlvbiBmb3IgX3JhZGlvRGlzcGF0Y2hlciAqL1xuICBwcml2YXRlIF9yZW1vdmVVbmlxdWVTZWxlY3Rpb25MaXN0ZW5lcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1yYWRpbz5gIGVsZW1lbnQgKi9cbiAgQFZpZXdDaGlsZCgnaW5wdXQnKSBfaW5wdXRFbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHJhZGlvR3JvdXA6IE1hdFJhZGlvR3JvdXAsXG4gICAgICAgICAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcmFkaW9EaXNwYXRjaGVyOiBVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JBRElPX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9wcm92aWRlck92ZXJyaWRlPzogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gQXNzZXJ0aW9ucy4gSWRlYWxseSB0aGVzZSBzaG91bGQgYmUgc3RyaXBwZWQgb3V0IGJ5IHRoZSBjb21waWxlci5cbiAgICAvLyBUT0RPKGplbGJvdXJuKTogQXNzZXJ0IHRoYXQgdGhlcmUncyBubyBuYW1lIGJpbmRpbmcgQU5EIGEgcGFyZW50IHJhZGlvIGdyb3VwLlxuICAgIHRoaXMucmFkaW9Hcm91cCA9IHJhZGlvR3JvdXA7XG5cbiAgICB0aGlzLl9yZW1vdmVVbmlxdWVTZWxlY3Rpb25MaXN0ZW5lciA9XG4gICAgICBfcmFkaW9EaXNwYXRjaGVyLmxpc3RlbigoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChpZCAhPT0gdGhpcy5pZCAmJiBuYW1lID09PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcmFkaW8gYnV0dG9uLiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2lucHV0RWxlbWVudCwgJ2tleWJvYXJkJywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIHJhZGlvIGJ1dHRvbiBhcyBuZWVkaW5nIGNoZWNraW5nIGZvciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBleHBvc2VkIGJlY2F1c2UgdGhlIHBhcmVudCByYWRpbyBncm91cCB3aWxsIGRpcmVjdGx5XG4gICAqIHVwZGF0ZSBib3VuZCBwcm9wZXJ0aWVzIG9mIHRoZSByYWRpbyBidXR0b24uXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCkge1xuICAgIC8vIFdoZW4gZ3JvdXAgdmFsdWUgY2hhbmdlcywgdGhlIGJ1dHRvbiB3aWxsIG5vdCBiZSBub3RpZmllZC4gVXNlIGBtYXJrRm9yQ2hlY2tgIHRvIGV4cGxpY2l0XG4gICAgLy8gdXBkYXRlIHJhZGlvIGJ1dHRvbidzIHN0YXR1c1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMucmFkaW9Hcm91cCkge1xuICAgICAgLy8gSWYgdGhlIHJhZGlvIGlzIGluc2lkZSBhIHJhZGlvIGdyb3VwLCBkZXRlcm1pbmUgaWYgaXQgc2hvdWxkIGJlIGNoZWNrZWRcbiAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMucmFkaW9Hcm91cC52YWx1ZSA9PT0gdGhpcy5fdmFsdWU7XG4gICAgICAvLyBDb3B5IG5hbWUgZnJvbSBwYXJlbnQgcmFkaW8gZ3JvdXBcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMucmFkaW9Hcm91cC5uYW1lO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3JcbiAgICAgIC5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAuc3Vic2NyaWJlKGZvY3VzT3JpZ2luID0+IHtcbiAgICAgICAgaWYgKCFmb2N1c09yaWdpbiAmJiB0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgICAgICB0aGlzLnJhZGlvR3JvdXAuX3RvdWNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyKCk7XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIHRoaXMuY2hhbmdlLmVtaXQobmV3IE1hdFJhZGlvQ2hhbmdlKHRoaXMsIHRoaXMuX3ZhbHVlKSk7XG4gIH1cblxuICBfaXNSaXBwbGVEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICBfb25JbnB1dENsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBmb3IgY2xpY2sgZXZlbnRzIG9uIHRoZSB2aXN1YWwgaGlkZGVuIGlucHV0IGVsZW1lbnQuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIGEgbGFiZWwgZWxlbWVudCwgYSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgd2lsbCBiZVxuICAgIC8vIGRpc3BhdGNoZWQgb24gdGhlIGFzc29jaWF0ZWQgaW5wdXQgZWxlbWVudC4gU2luY2Ugd2UgYXJlIHVzaW5nIGEgbGFiZWwgZWxlbWVudCBhcyBvdXJcbiAgICAvLyByb290IGNvbnRhaW5lciwgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBgcmFkaW8tYnV0dG9uYCB3aWxsIGJlIGV4ZWN1dGVkIHR3aWNlLlxuICAgIC8vIFRoZSByZWFsIGNsaWNrIGV2ZW50IHdpbGwgYnViYmxlIHVwLCBhbmQgdGhlIGdlbmVyYXRlZCBjbGljayBldmVudCBhbHNvIHRyaWVzIHRvIGJ1YmJsZSB1cC5cbiAgICAvLyBUaGlzIHdpbGwgbGVhZCB0byBtdWx0aXBsZSBjbGljayBldmVudHMuXG4gICAgLy8gUHJldmVudGluZyBidWJibGluZyBmb3IgdGhlIHNlY29uZCBldmVudCB3aWxsIHNvbHZlIHRoYXQgaXNzdWUuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHJhZGlvIGJ1dHRvbiByZWNlaXZlZCBhIGNsaWNrIG9yIHRoZSBpbnB1dCByZWNvZ25pemVkIGFueSBjaGFuZ2UuXG4gICAqIENsaWNraW5nIG9uIGEgbGFiZWwgZWxlbWVudCwgd2lsbCB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50IG9uIHRoZSBhc3NvY2lhdGVkIGlucHV0LlxuICAgKi9cbiAgX29uSW5wdXRDaGFuZ2UoZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgYWx3YXlzIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBvbiB0aGUgY2hhbmdlIGV2ZW50LlxuICAgIC8vIE90aGVyd2lzZSB0aGUgY2hhbmdlIGV2ZW50LCBmcm9tIHRoZSBpbnB1dCBlbGVtZW50LCB3aWxsIGJ1YmJsZSB1cCBhbmRcbiAgICAvLyBlbWl0IGl0cyBldmVudCBvYmplY3QgdG8gdGhlIGBjaGFuZ2VgIG91dHB1dC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGNvbnN0IGdyb3VwVmFsdWVDaGFuZ2VkID0gdGhpcy5yYWRpb0dyb3VwICYmIHRoaXMudmFsdWUgIT09IHRoaXMucmFkaW9Hcm91cC52YWx1ZTtcbiAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuXG4gICAgaWYgKHRoaXMucmFkaW9Hcm91cCkge1xuICAgICAgdGhpcy5yYWRpb0dyb3VwLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgICAgaWYgKGdyb3VwVmFsdWVDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIGFuZCBtYXJrcyBmb3IgY2hlY2sgaWYgYSBjaGFuZ2Ugb2NjdXJyZWQuICovXG4gIHByb3RlY3RlZCBfc2V0RGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NoZWNrZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuIl19