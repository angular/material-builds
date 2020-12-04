/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
export const MAT_RADIO_DEFAULT_OPTIONS = new InjectionToken('mat-radio-default-options', {
    providedIn: 'root',
    factory: MAT_RADIO_DEFAULT_OPTIONS_FACTORY
});
export function MAT_RADIO_DEFAULT_OPTIONS_FACTORY() {
    return {
        color: 'accent'
    };
}
// Increasing integer for generating unique ids for radio components.
let nextUniqueId = 0;
/**
 * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
export const MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatRadioGroup),
    multi: true
};
/** Change event object emitted by MatRadio and MatRadioGroup. */
export class MatRadioChange {
    constructor(
    /** The MatRadioButton that emits the change event. */
    source, 
    /** The value of the MatRadioButton. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/**
 * Injection token that can be used to inject instances of `MatRadioGroup`. It serves as
 * alternative token to the actual `MatRadioGroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const MAT_RADIO_GROUP = new InjectionToken('MatRadioGroup');
/**
 * Base class with all of the `MatRadioGroup` functionality.
 * @docs-private
 */
export class _MatRadioGroupBase {
    constructor(_changeDetector) {
        this._changeDetector = _changeDetector;
        /** Selected value for the radio group. */
        this._value = null;
        /** The HTML name attribute applied to radio buttons in this group. */
        this._name = `mat-radio-group-${nextUniqueId++}`;
        /** The currently selected radio button. Should match value. */
        this._selected = null;
        /** Whether the `value` has been set to its initial value. */
        this._isInitialized = false;
        /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
        this._labelPosition = 'after';
        /** Whether the radio group is disabled. */
        this._disabled = false;
        /** Whether the radio group is required. */
        this._required = false;
        /** The method to be called in order to update ngModel */
        this._controlValueAccessorChangeFn = () => { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         * @docs-private
         */
        this.onTouched = () => { };
        /**
         * Event emitted when the group value changes.
         * Change events are only emitted when the value changes due to user interaction with
         * a radio button (the same behavior as `<input type-"radio">`).
         */
        this.change = new EventEmitter();
    }
    /** Name of the radio button group. All radio buttons inside this group will use this name. */
    get name() { return this._name; }
    set name(value) {
        this._name = value;
        this._updateRadioButtonNames();
    }
    /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
    get labelPosition() {
        return this._labelPosition;
    }
    set labelPosition(v) {
        this._labelPosition = v === 'before' ? 'before' : 'after';
        this._markRadiosForCheck();
    }
    /**
     * Value for the radio-group. Should equal the value of the selected radio button if there is
     * a corresponding radio button with a matching value. If there is not such a corresponding
     * radio button, this value persists to be applied in case a new radio button is added with a
     * matching value.
     */
    get value() { return this._value; }
    set value(newValue) {
        if (this._value !== newValue) {
            // Set this before proceeding to ensure no circular loop occurs with selection.
            this._value = newValue;
            this._updateSelectedRadioFromValue();
            this._checkSelectedRadioButton();
        }
    }
    _checkSelectedRadioButton() {
        if (this._selected && !this._selected.checked) {
            this._selected.checked = true;
        }
    }
    /**
     * The currently selected radio button. If set to a new radio button, the radio group value
     * will be updated to match the new selected button.
     */
    get selected() { return this._selected; }
    set selected(selected) {
        this._selected = selected;
        this.value = selected ? selected.value : null;
        this._checkSelectedRadioButton();
    }
    /** Whether the radio group is disabled */
    get disabled() { return this._disabled; }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._markRadiosForCheck();
    }
    /** Whether the radio group is required */
    get required() { return this._required; }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this._markRadiosForCheck();
    }
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
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
     */
    _touch() {
        if (this.onTouched) {
            this.onTouched();
        }
    }
    _updateRadioButtonNames() {
        if (this._radios) {
            this._radios.forEach(radio => {
                radio.name = this.name;
                radio._markForCheck();
            });
        }
    }
    /** Updates the `selected` radio button from the internal _value state. */
    _updateSelectedRadioFromValue() {
        // If the value already matches the selected radio, do nothing.
        const isAlreadySelected = this._selected !== null && this._selected.value === this._value;
        if (this._radios && !isAlreadySelected) {
            this._selected = null;
            this._radios.forEach(radio => {
                radio.checked = this.value === radio.value;
                if (radio.checked) {
                    this._selected = radio;
                }
            });
        }
    }
    /** Dispatch change event with current selection and group value. */
    _emitChangeEvent() {
        if (this._isInitialized) {
            this.change.emit(new MatRadioChange(this._selected, this._value));
        }
    }
    _markRadiosForCheck() {
        if (this._radios) {
            this._radios.forEach(radio => radio._markForCheck());
        }
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value) {
        this.value = value;
        this._changeDetector.markForCheck();
    }
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the control should be disabled.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._changeDetector.markForCheck();
    }
}
_MatRadioGroupBase.decorators = [
    { type: Directive }
];
_MatRadioGroupBase.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
_MatRadioGroupBase.propDecorators = {
    change: [{ type: Output }],
    color: [{ type: Input }],
    name: [{ type: Input }],
    labelPosition: [{ type: Input }],
    value: [{ type: Input }],
    selected: [{ type: Input }],
    disabled: [{ type: Input }],
    required: [{ type: Input }]
};
/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
 */
export class MatRadioGroup extends _MatRadioGroupBase {
}
MatRadioGroup.decorators = [
    { type: Directive, args: [{
                selector: 'mat-radio-group',
                exportAs: 'matRadioGroup',
                providers: [
                    MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
                    { provide: MAT_RADIO_GROUP, useExisting: MatRadioGroup },
                ],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-radio-group',
                },
            },] }
];
MatRadioGroup.propDecorators = {
    _radios: [{ type: ContentChildren, args: [forwardRef(() => MatRadioButton), { descendants: true },] }]
};
// Boilerplate for applying mixins to MatRadioButton.
/** @docs-private */
class MatRadioButtonBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
// As per Material design specifications the selection control radio should use the accent color
// palette by default. https://material.io/guidelines/components/selection-controls.html
const _MatRadioButtonMixinBase = mixinDisableRipple(mixinTabIndex(MatRadioButtonBase));
/**
 * Base class with all of the `MatRadioButton` functionality.
 * @docs-private
 */
export class _MatRadioButtonBase extends _MatRadioButtonMixinBase {
    constructor(radioGroup, elementRef, _changeDetector, _focusMonitor, _radioDispatcher, _animationMode, _providerOverride, tabIndex) {
        super(elementRef);
        this._changeDetector = _changeDetector;
        this._focusMonitor = _focusMonitor;
        this._radioDispatcher = _radioDispatcher;
        this._animationMode = _animationMode;
        this._providerOverride = _providerOverride;
        this._uniqueId = `mat-radio-${++nextUniqueId}`;
        /** The unique ID for the radio button. */
        this.id = this._uniqueId;
        /**
         * Event emitted when the checked state of this radio button changes.
         * Change events are only emitted when the value changes due to user interaction with
         * the radio button (the same behavior as `<input type-"radio">`).
         */
        this.change = new EventEmitter();
        /** Whether this radio is checked. */
        this._checked = false;
        /** Value assigned to this radio. */
        this._value = null;
        /** Unregister function for _radioDispatcher */
        this._removeUniqueSelectionListener = () => { };
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        this.radioGroup = radioGroup;
        if (tabIndex) {
            this.tabIndex = coerceNumberProperty(tabIndex, 0);
        }
        this._removeUniqueSelectionListener =
            _radioDispatcher.listen((id, name) => {
                if (id !== this.id && name === this.name) {
                    this.checked = false;
                }
            });
    }
    /** Whether this radio button is checked. */
    get checked() { return this._checked; }
    set checked(value) {
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
    /** The value of this radio button. */
    get value() { return this._value; }
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
    /** Whether the label should appear after or before the radio button. Defaults to 'after' */
    get labelPosition() {
        return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
    }
    set labelPosition(value) {
        this._labelPosition = value;
    }
    /** Whether the radio button is disabled. */
    get disabled() {
        return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
    }
    set disabled(value) {
        this._setDisabled(coerceBooleanProperty(value));
    }
    /** Whether the radio button is required. */
    get required() {
        return this._required || (this.radioGroup && this.radioGroup.required);
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /** Theme color of the radio button. */
    get color() {
        return this._color ||
            (this.radioGroup && this.radioGroup.color) ||
            this._providerOverride && this._providerOverride.color || 'accent';
    }
    set color(newValue) { this._color = newValue; }
    /** ID of the native input element inside `<mat-radio-button>` */
    get inputId() { return `${this.id || this._uniqueId}-input`; }
    /** Focuses the radio button. */
    focus(options) {
        this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
    }
    /**
     * Marks the radio button as needing checking for change detection.
     * This method is exposed because the parent radio group will directly
     * update bound properties of the radio button.
     */
    _markForCheck() {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update radio button's status
        this._changeDetector.markForCheck();
    }
    ngOnInit() {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            if (this.checked) {
                this.radioGroup.selected = this;
            }
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    }
    ngAfterViewInit() {
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe(focusOrigin => {
            if (!focusOrigin && this.radioGroup) {
                this.radioGroup._touch();
            }
        });
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._removeUniqueSelectionListener();
    }
    /** Dispatch change event with current value. */
    _emitChangeEvent() {
        this.change.emit(new MatRadioChange(this, this._value));
    }
    _isRippleDisabled() {
        return this.disableRipple || this.disabled;
    }
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
     */
    _onInputChange(event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
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
    /** Sets the disabled state and marks for check if a change occurred. */
    _setDisabled(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            this._changeDetector.markForCheck();
        }
    }
}
_MatRadioButtonBase.decorators = [
    { type: Directive }
];
_MatRadioButtonBase.ctorParameters = () => [
    { type: _MatRadioGroupBase },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: FocusMonitor },
    { type: UniqueSelectionDispatcher },
    { type: String },
    { type: undefined },
    { type: String }
];
_MatRadioButtonBase.propDecorators = {
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
/**
 * A Material design radio-button. Typically placed inside of `<mat-radio-group>` elements.
 */
export class MatRadioButton extends _MatRadioButtonBase {
    constructor(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, animationMode, providerOverride, tabIndex) {
        super(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, animationMode, providerOverride, tabIndex);
    }
}
MatRadioButton.decorators = [
    { type: Component, args: [{
                selector: 'mat-radio-button',
                template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <span class=\"mat-radio-container\">\n    <span class=\"mat-radio-outer-circle\"></span>\n    <span class=\"mat-radio-inner-circle\"></span>\n    <input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputChange($event)\"\n        (click)=\"_onInputClick($event)\">\n\n    <!-- The ripple comes after the input so that we can target it with a CSS\n         sibling selector when the input is focused. -->\n    <span mat-ripple class=\"mat-radio-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: 150}\">\n\n      <span class=\"mat-ripple-element mat-radio-persistent-ripple\"></span>\n    </span>\n  </span>\n\n  <!-- The label content for radio control. -->\n  <span class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n",
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
                styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;transition:transform ease 280ms,background-color ease 280ms;width:20px;transform:scale(0.001)}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5)}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{bottom:0;left:50%}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"]
            },] }
];
MatRadioButton.ctorParameters = () => [
    { type: MatRadioGroup, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RADIO_GROUP,] }] },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: FocusMonitor },
    { type: UniqueSelectionDispatcher },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RADIO_DEFAULT_OPTIONS,] }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsb0JBQW9CLEdBRXJCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkUsT0FBTyxFQUdMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFLTCxrQkFBa0IsRUFDbEIsYUFBYSxHQUVkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFPM0UsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQ3BDLElBQUksY0FBYyxDQUF5QiwyQkFBMkIsRUFBRTtJQUN4RSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsaUNBQWlDO0NBQzNDLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxpQ0FBaUM7SUFDL0MsT0FBTztRQUNMLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUM7QUFDSixDQUFDO0FBRUQscUVBQXFFO0FBQ3JFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjs7OztHQUlH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QUFRLFlBQUksTUFBTSxTQUFDLGVBQWU7WUFubkIvQyxVQUFVO1lBSlYsaUJBQWlCO1lBYlgsWUFBWTtZQU9aLHlCQUF5Qjt5Q0Frb0JsQixRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs0Q0FDdEMsUUFBUSxZQUFJLE1BQU0sU0FBQyx5QkFBeUI7eUNBRTlDLFNBQVMsU0FBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIE1hdFJhZGlvRGVmYXVsdE9wdGlvbnMge1xuICBjb2xvcjogVGhlbWVQYWxldHRlO1xufVxuXG5leHBvcnQgY29uc3QgTUFUX1JBRElPX0RFRkFVTFRfT1BUSU9OUyA9XG4gIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRSYWRpb0RlZmF1bHRPcHRpb25zPignbWF0LXJhZGlvLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TX0ZBQ1RPUllcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gTUFUX1JBRElPX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFJhZGlvRGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGNvbG9yOiAnYWNjZW50J1xuICB9O1xufVxuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcyBmb3IgcmFkaW8gY29tcG9uZW50cy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LXJhZGlvLWdyb3VwIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuIFRoaXNcbiAqIGFsbG93cyBpdCB0byBzdXBwb3J0IFsobmdNb2RlbCldIGFuZCBuZ0NvbnRyb2wuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUkFESU9fR1JPVVBfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0UmFkaW9Hcm91cCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdFJhZGlvIGFuZCBNYXRSYWRpb0dyb3VwLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBNYXRSYWRpb0J1dHRvbiB0aGF0IGVtaXRzIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogX01hdFJhZGlvQnV0dG9uQmFzZSxcbiAgICAvKiogVGhlIHZhbHVlIG9mIHRoZSBNYXRSYWRpb0J1dHRvbi4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkge31cbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBpbmplY3QgaW5zdGFuY2VzIG9mIGBNYXRSYWRpb0dyb3VwYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRSYWRpb0dyb3VwYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SQURJT19HUk9VUCA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPF9NYXRSYWRpb0dyb3VwQmFzZTxfTWF0UmFkaW9CdXR0b25CYXNlPj4oJ01hdFJhZGlvR3JvdXAnKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0UmFkaW9Hcm91cGAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFJhZGlvR3JvdXBCYXNlPFQgZXh0ZW5kcyBfTWF0UmFkaW9CdXR0b25CYXNlPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqIFNlbGVjdGVkIHZhbHVlIGZvciB0aGUgcmFkaW8gZ3JvdXAuICovXG4gIHByaXZhdGUgX3ZhbHVlOiBhbnkgPSBudWxsO1xuXG4gIC8qKiBUaGUgSFRNTCBuYW1lIGF0dHJpYnV0ZSBhcHBsaWVkIHRvIHJhZGlvIGJ1dHRvbnMgaW4gdGhpcyBncm91cC4gKi9cbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nID0gYG1hdC1yYWRpby1ncm91cC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmFkaW8gYnV0dG9uLiBTaG91bGQgbWF0Y2ggdmFsdWUuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkOiBUIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGB2YWx1ZWAgaGFzIGJlZW4gc2V0IHRvIGl0cyBpbml0aWFsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVscyBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgcmFkaW8tYnV0dG9ucy4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBwcml2YXRlIF9sYWJlbFBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyBkaXNhYmxlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgcmVxdWlyZWQuICovXG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBtZXRob2QgdG8gYmUgY2FsbGVkIGluIG9yZGVyIHRvIHVwZGF0ZSBuZ01vZGVsICovXG4gIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGdyb3VwIHZhbHVlIGNoYW5nZXMuXG4gICAqIENoYW5nZSBldmVudHMgYXJlIG9ubHkgZW1pdHRlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIGR1ZSB0byB1c2VyIGludGVyYWN0aW9uIHdpdGhcbiAgICogYSByYWRpbyBidXR0b24gKHRoZSBzYW1lIGJlaGF2aW9yIGFzIGA8aW5wdXQgdHlwZS1cInJhZGlvXCI+YCkuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRSYWRpb0NoYW5nZT4oKTtcblxuICAvKiogQ2hpbGQgcmFkaW8gYnV0dG9ucy4gKi9cbiAgYWJzdHJhY3QgX3JhZGlvczogUXVlcnlMaXN0PFQ+O1xuXG4gIC8qKiBUaGVtZSBjb2xvciBmb3IgYWxsIG9mIHRoZSByYWRpbyBidXR0b25zIGluIHRoZSBncm91cC4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogTmFtZSBvZiB0aGUgcmFkaW8gYnV0dG9uIGdyb3VwLiBBbGwgcmFkaW8gYnV0dG9ucyBpbnNpZGUgdGhpcyBncm91cCB3aWxsIHVzZSB0aGlzIG5hbWUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9uYW1lOyB9XG4gIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlUmFkaW9CdXR0b25OYW1lcygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVscyBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgcmFkaW8tYnV0dG9ucy4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKVxuICBnZXQgbGFiZWxQb3NpdGlvbigpOiAnYmVmb3JlJyB8ICdhZnRlcicge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbFBvc2l0aW9uO1xuICB9XG4gIHNldCBsYWJlbFBvc2l0aW9uKHYpIHtcbiAgICB0aGlzLl9sYWJlbFBvc2l0aW9uID0gdiA9PT0gJ2JlZm9yZScgPyAnYmVmb3JlJyA6ICdhZnRlcic7XG4gICAgdGhpcy5fbWFya1JhZGlvc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVmFsdWUgZm9yIHRoZSByYWRpby1ncm91cC4gU2hvdWxkIGVxdWFsIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgcmFkaW8gYnV0dG9uIGlmIHRoZXJlIGlzXG4gICAqIGEgY29ycmVzcG9uZGluZyByYWRpbyBidXR0b24gd2l0aCBhIG1hdGNoaW5nIHZhbHVlLiBJZiB0aGVyZSBpcyBub3Qgc3VjaCBhIGNvcnJlc3BvbmRpbmdcbiAgICogcmFkaW8gYnV0dG9uLCB0aGlzIHZhbHVlIHBlcnNpc3RzIHRvIGJlIGFwcGxpZWQgaW4gY2FzZSBhIG5ldyByYWRpbyBidXR0b24gaXMgYWRkZWQgd2l0aCBhXG4gICAqIG1hdGNoaW5nIHZhbHVlLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIC8vIFNldCB0aGlzIGJlZm9yZSBwcm9jZWVkaW5nIHRvIGVuc3VyZSBubyBjaXJjdWxhciBsb29wIG9jY3VycyB3aXRoIHNlbGVjdGlvbi5cbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZVNlbGVjdGVkUmFkaW9Gcm9tVmFsdWUoKTtcbiAgICAgIHRoaXMuX2NoZWNrU2VsZWN0ZWRSYWRpb0J1dHRvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja1NlbGVjdGVkUmFkaW9CdXR0b24oKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkICYmICF0aGlzLl9zZWxlY3RlZC5jaGVja2VkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCByYWRpbyBidXR0b24uIElmIHNldCB0byBhIG5ldyByYWRpbyBidXR0b24sIHRoZSByYWRpbyBncm91cCB2YWx1ZVxuICAgKiB3aWxsIGJlIHVwZGF0ZWQgdG8gbWF0Y2ggdGhlIG5ldyBzZWxlY3RlZCBidXR0b24uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKSB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IFQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLnZhbHVlID0gc2VsZWN0ZWQgPyBzZWxlY3RlZC52YWx1ZSA6IG51bGw7XG4gICAgdGhpcy5fY2hlY2tTZWxlY3RlZFJhZGlvQnV0dG9uKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgZGlzYWJsZWQgKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX21hcmtSYWRpb3NGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGdyb3VwIGlzIHJlcXVpcmVkICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlcXVpcmVkOyB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9tYXJrUmFkaW9zRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcHJvcGVydGllcyBvbmNlIGNvbnRlbnQgY2hpbGRyZW4gYXJlIGF2YWlsYWJsZS5cbiAgICogVGhpcyBhbGxvd3MgdXMgdG8gcHJvcGFnYXRlIHJlbGV2YW50IGF0dHJpYnV0ZXMgdG8gYXNzb2NpYXRlZCBidXR0b25zLlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIE1hcmsgdGhpcyBjb21wb25lbnQgYXMgaW5pdGlhbGl6ZWQgaW4gQWZ0ZXJDb250ZW50SW5pdCBiZWNhdXNlIHRoZSBpbml0aWFsIHZhbHVlIGNhblxuICAgIC8vIHBvc3NpYmx5IGJlIHNldCBieSBOZ01vZGVsIG9uIE1hdFJhZGlvR3JvdXAsIGFuZCBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBPbkluaXQgb2YgdGhlXG4gICAgLy8gTmdNb2RlbCBvY2N1cnMgKmFmdGVyKiB0aGUgT25Jbml0IG9mIHRoZSBNYXRSYWRpb0dyb3VwLlxuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgdGhpcyBncm91cCBhcyBiZWluZyBcInRvdWNoZWRcIiAoZm9yIG5nTW9kZWwpLiBNZWFudCB0byBiZSBjYWxsZWQgYnkgdGhlIGNvbnRhaW5lZFxuICAgKiByYWRpbyBidXR0b25zIHVwb24gdGhlaXIgYmx1ci5cbiAgICovXG4gIF90b3VjaCgpIHtcbiAgICBpZiAodGhpcy5vblRvdWNoZWQpIHtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUmFkaW9CdXR0b25OYW1lcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcmFkaW9zKSB7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgIHJhZGlvLl9tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBgc2VsZWN0ZWRgIHJhZGlvIGJ1dHRvbiBmcm9tIHRoZSBpbnRlcm5hbCBfdmFsdWUgc3RhdGUuICovXG4gIHByaXZhdGUgX3VwZGF0ZVNlbGVjdGVkUmFkaW9Gcm9tVmFsdWUoKTogdm9pZCB7XG4gICAgLy8gSWYgdGhlIHZhbHVlIGFscmVhZHkgbWF0Y2hlcyB0aGUgc2VsZWN0ZWQgcmFkaW8sIGRvIG5vdGhpbmcuXG4gICAgY29uc3QgaXNBbHJlYWR5U2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZCAhPT0gbnVsbCAmJiB0aGlzLl9zZWxlY3RlZC52YWx1ZSA9PT0gdGhpcy5fdmFsdWU7XG5cbiAgICBpZiAodGhpcy5fcmFkaW9zICYmICFpc0FscmVhZHlTZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgdGhpcy5fcmFkaW9zLmZvckVhY2gocmFkaW8gPT4ge1xuICAgICAgICByYWRpby5jaGVja2VkID0gdGhpcy52YWx1ZSA9PT0gcmFkaW8udmFsdWU7XG4gICAgICAgIGlmIChyYWRpby5jaGVja2VkKSB7XG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSByYWRpbztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERpc3BhdGNoIGNoYW5nZSBldmVudCB3aXRoIGN1cnJlbnQgc2VsZWN0aW9uIGFuZCBncm91cCB2YWx1ZS4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0UmFkaW9DaGFuZ2UodGhpcy5fc2VsZWN0ZWQhLCB0aGlzLl92YWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIF9tYXJrUmFkaW9zRm9yQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMuX3JhZGlvcykge1xuICAgICAgdGhpcy5fcmFkaW9zLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uX21hcmtGb3JDaGVjaygpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbW9kZWwgdmFsdWUuIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBtb2RlbCB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb250cm9sIGlzIHRvdWNoZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIGNvbnRyb2wuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgV2hldGhlciB0aGUgY29udHJvbCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBBIGdyb3VwIG9mIHJhZGlvIGJ1dHRvbnMuIE1heSBjb250YWluIG9uZSBvciBtb3JlIGA8bWF0LXJhZGlvLWJ1dHRvbj5gIGVsZW1lbnRzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcmFkaW8tZ3JvdXAnLFxuICBleHBvcnRBczogJ21hdFJhZGlvR3JvdXAnLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfUkFESU9fR1JPVVBfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX1JBRElPX0dST1VQLCB1c2VFeGlzdGluZzogTWF0UmFkaW9Hcm91cH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdyYWRpb2dyb3VwJyxcbiAgICAnY2xhc3MnOiAnbWF0LXJhZGlvLWdyb3VwJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cCBleHRlbmRzIF9NYXRSYWRpb0dyb3VwQmFzZTxNYXRSYWRpb0J1dHRvbj4ge1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTWF0UmFkaW9CdXR0b24pLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBfcmFkaW9zOiBRdWVyeUxpc3Q8TWF0UmFkaW9CdXR0b24+O1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFJhZGlvQnV0dG9uLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmFic3RyYWN0IGNsYXNzIE1hdFJhZGlvQnV0dG9uQmFzZSB7XG4gIC8vIFNpbmNlIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eSBpcyBtYW51YWxseSBkZWZpbmVkIGZvciB0aGUgTWF0UmFkaW9CdXR0b24gYW5kIGlzbid0IHNldCB1cCBpblxuICAvLyB0aGUgbWl4aW4gYmFzZSBjbGFzcy4gVG8gYmUgYWJsZSB0byB1c2UgdGhlIHRhYmluZGV4IG1peGluLCBhIGRpc2FibGVkIHByb3BlcnR5IG11c3QgYmVcbiAgLy8gZGVmaW5lZCB0byBwcm9wZXJseSB3b3JrLlxuICBhYnN0cmFjdCBkaXNhYmxlZDogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuLy8gQXMgcGVyIE1hdGVyaWFsIGRlc2lnbiBzcGVjaWZpY2F0aW9ucyB0aGUgc2VsZWN0aW9uIGNvbnRyb2wgcmFkaW8gc2hvdWxkIHVzZSB0aGUgYWNjZW50IGNvbG9yXG4vLyBwYWxldHRlIGJ5IGRlZmF1bHQuIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZ3VpZGVsaW5lcy9jb21wb25lbnRzL3NlbGVjdGlvbi1jb250cm9scy5odG1sXG5jb25zdCBfTWF0UmFkaW9CdXR0b25NaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiBIYXNUYWJJbmRleEN0b3IgJiB0eXBlb2YgTWF0UmFkaW9CdXR0b25CYXNlID1cbiAgICAgICAgbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluVGFiSW5kZXgoTWF0UmFkaW9CdXR0b25CYXNlKSk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFJhZGlvQnV0dG9uYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0UmFkaW9CdXR0b25CYXNlIGV4dGVuZHMgX01hdFJhZGlvQnV0dG9uTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LFxuICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGVSaXBwbGUsIEhhc1RhYkluZGV4IHtcblxuICBwcml2YXRlIF91bmlxdWVJZDogc3RyaW5nID0gYG1hdC1yYWRpby0keysrbmV4dFVuaXF1ZUlkfWA7XG5cbiAgLyoqIFRoZSB1bmlxdWUgSUQgZm9yIHRoZSByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSB0aGlzLl91bmlxdWVJZDtcblxuICAvKiogQW5hbG9nIHRvIEhUTUwgJ25hbWUnIGF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIHJhZGlvcyBmb3IgdW5pcXVlIHNlbGVjdGlvbi4gKi9cbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgJ2FyaWEtbGFiZWwnIGF0dHJpYnV0ZSBvbiB0aGUgdW5kZXJseWluZyBpbnB1dCBlbGVtZW50LiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlICdhcmlhLWxhYmVsbGVkYnknIGF0dHJpYnV0ZSB0YWtlcyBwcmVjZWRlbmNlIGFzIHRoZSBlbGVtZW50J3MgdGV4dCBhbHRlcm5hdGl2ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgJ2FyaWEtZGVzY3JpYmVkYnknIGF0dHJpYnV0ZSBpcyByZWFkIGFmdGVyIHRoZSBlbGVtZW50J3MgbGFiZWwgYW5kIGZpZWxkIHR5cGUuICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2hlY2tlZDsgfVxuICBzZXQgY2hlY2tlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld0NoZWNrZWRTdGF0ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX2NoZWNrZWQgIT09IG5ld0NoZWNrZWRTdGF0ZSkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IG5ld0NoZWNrZWRTdGF0ZTtcbiAgICAgIGlmIChuZXdDaGVja2VkU3RhdGUgJiYgdGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC52YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSB0aGlzO1xuICAgICAgfSBlbHNlIGlmICghbmV3Q2hlY2tlZFN0YXRlICYmIHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHRoaXMudmFsdWUpIHtcblxuICAgICAgICAvLyBXaGVuIHVuY2hlY2tpbmcgdGhlIHNlbGVjdGVkIHJhZGlvIGJ1dHRvbiwgdXBkYXRlIHRoZSBzZWxlY3RlZCByYWRpb1xuICAgICAgICAvLyBwcm9wZXJ0eSBvbiB0aGUgZ3JvdXAuXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdDaGVja2VkU3RhdGUpIHtcbiAgICAgICAgLy8gTm90aWZ5IGFsbCByYWRpbyBidXR0b25zIHdpdGggdGhlIHNhbWUgbmFtZSB0byB1bi1jaGVjay5cbiAgICAgICAgdGhpcy5fcmFkaW9EaXNwYXRjaGVyLm5vdGlmeSh0aGlzLmlkLCB0aGlzLm5hbWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGlzIHJhZGlvIGJ1dHRvbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5yYWRpb0dyb3VwICE9PSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIGNoZWNrZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlZCB0byBtYXRjaCB0aGUgcmFkaW8gZ3JvdXAncyB2YWx1ZVxuICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMucmFkaW9Hcm91cC52YWx1ZSA9PT0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHJhZGlvIGJ1dHRvbi4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKVxuICBnZXQgbGFiZWxQb3NpdGlvbigpOiAnYmVmb3JlJyB8ICdhZnRlcicge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbFBvc2l0aW9uIHx8ICh0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLmxhYmVsUG9zaXRpb24pIHx8ICdhZnRlcic7XG4gIH1cbiAgc2V0IGxhYmVsUG9zaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9sYWJlbFBvc2l0aW9uID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMucmFkaW9Hcm91cCAhPT0gbnVsbCAmJiB0aGlzLnJhZGlvR3JvdXAuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NldERpc2FibGVkKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZCB8fCAodGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC5yZXF1aXJlZCk7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvciB8fFxuICAgICAgKHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAuY29sb3IpIHx8XG4gICAgICB0aGlzLl9wcm92aWRlck92ZXJyaWRlICYmIHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGUuY29sb3IgfHwgJ2FjY2VudCc7XG4gIH1cbiAgc2V0IGNvbG9yKG5ld1ZhbHVlOiBUaGVtZVBhbGV0dGUpIHsgdGhpcy5fY29sb3IgPSBuZXdWYWx1ZTsgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhpcyByYWRpbyBidXR0b24gY2hhbmdlcy5cbiAgICogQ2hhbmdlIGV2ZW50cyBhcmUgb25seSBlbWl0dGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgZHVlIHRvIHVzZXIgaW50ZXJhY3Rpb24gd2l0aFxuICAgKiB0aGUgcmFkaW8gYnV0dG9uICh0aGUgc2FtZSBiZWhhdmlvciBhcyBgPGlucHV0IHR5cGUtXCJyYWRpb1wiPmApLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+KCk7XG5cbiAgLyoqIFRoZSBwYXJlbnQgcmFkaW8gZ3JvdXAuIE1heSBvciBtYXkgbm90IGJlIHByZXNlbnQuICovXG4gIHJhZGlvR3JvdXA6IF9NYXRSYWRpb0dyb3VwQmFzZTxfTWF0UmFkaW9CdXR0b25CYXNlPjtcblxuICAvKiogSUQgb2YgdGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50IGluc2lkZSBgPG1hdC1yYWRpby1idXR0b24+YCAqL1xuICBnZXQgaW5wdXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gYCR7dGhpcy5pZCB8fCB0aGlzLl91bmlxdWVJZH0taW5wdXRgOyB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyByYWRpbyBpcyBjaGVja2VkLiAqL1xuICBwcml2YXRlIF9jaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyByYWRpbyBpcyBkaXNhYmxlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyByYWRpbyBpcyByZXF1aXJlZC4gKi9cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFZhbHVlIGFzc2lnbmVkIHRvIHRoaXMgcmFkaW8uICovXG4gIHByaXZhdGUgX3ZhbHVlOiBhbnkgPSBudWxsO1xuXG4gIC8qKiBVbnJlZ2lzdGVyIGZ1bmN0aW9uIGZvciBfcmFkaW9EaXNwYXRjaGVyICovXG4gIHByaXZhdGUgX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIFRoZSBuYXRpdmUgYDxpbnB1dCB0eXBlPXJhZGlvPmAgZWxlbWVudCAqL1xuICBAVmlld0NoaWxkKCdpbnB1dCcpIF9pbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IocmFkaW9Hcm91cDogX01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+LFxuICAgICAgICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3JhZGlvRGlzcGF0Y2hlcjogVW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcixcbiAgICAgICAgICAgICAgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIF9wcm92aWRlck92ZXJyaWRlPzogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICAgICAgdGFiSW5kZXg/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIEFzc2VydGlvbnMuIElkZWFsbHkgdGhlc2Ugc2hvdWxkIGJlIHN0cmlwcGVkIG91dCBieSB0aGUgY29tcGlsZXIuXG4gICAgLy8gVE9ETyhqZWxib3Vybik6IEFzc2VydCB0aGF0IHRoZXJlJ3Mgbm8gbmFtZSBiaW5kaW5nIEFORCBhIHBhcmVudCByYWRpbyBncm91cC5cbiAgICB0aGlzLnJhZGlvR3JvdXAgPSByYWRpb0dyb3VwO1xuXG4gICAgaWYgKHRhYkluZGV4KSB7XG4gICAgICB0aGlzLnRhYkluZGV4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodGFiSW5kZXgsIDApO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyID1cbiAgICAgIF9yYWRpb0Rpc3BhdGNoZXIubGlzdGVuKChpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGlkICE9PSB0aGlzLmlkICYmIG5hbWUgPT09IHRoaXMubmFtZSkge1xuICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSByYWRpbyBidXR0b24uICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5faW5wdXRFbGVtZW50LCAna2V5Ym9hcmQnLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgcmFkaW8gYnV0dG9uIGFzIG5lZWRpbmcgY2hlY2tpbmcgZm9yIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqIFRoaXMgbWV0aG9kIGlzIGV4cG9zZWQgYmVjYXVzZSB0aGUgcGFyZW50IHJhZGlvIGdyb3VwIHdpbGwgZGlyZWN0bHlcbiAgICogdXBkYXRlIGJvdW5kIHByb3BlcnRpZXMgb2YgdGhlIHJhZGlvIGJ1dHRvbi5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKSB7XG4gICAgLy8gV2hlbiBncm91cCB2YWx1ZSBjaGFuZ2VzLCB0aGUgYnV0dG9uIHdpbGwgbm90IGJlIG5vdGlmaWVkLiBVc2UgYG1hcmtGb3JDaGVja2AgdG8gZXhwbGljaXRcbiAgICAvLyB1cGRhdGUgcmFkaW8gYnV0dG9uJ3Mgc3RhdHVzXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yYWRpb0dyb3VwKSB7XG4gICAgICAvLyBJZiB0aGUgcmFkaW8gaXMgaW5zaWRlIGEgcmFkaW8gZ3JvdXAsIGRldGVybWluZSBpZiBpdCBzaG91bGQgYmUgY2hlY2tlZFxuICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy5yYWRpb0dyb3VwLnZhbHVlID09PSB0aGlzLl92YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBDb3B5IG5hbWUgZnJvbSBwYXJlbnQgcmFkaW8gZ3JvdXBcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMucmFkaW9Hcm91cC5uYW1lO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3JcbiAgICAgIC5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAuc3Vic2NyaWJlKGZvY3VzT3JpZ2luID0+IHtcbiAgICAgICAgaWYgKCFmb2N1c09yaWdpbiAmJiB0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgICAgICB0aGlzLnJhZGlvR3JvdXAuX3RvdWNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyKCk7XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIHRoaXMuY2hhbmdlLmVtaXQobmV3IE1hdFJhZGlvQ2hhbmdlKHRoaXMsIHRoaXMuX3ZhbHVlKSk7XG4gIH1cblxuICBfaXNSaXBwbGVEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICBfb25JbnB1dENsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBmb3IgY2xpY2sgZXZlbnRzIG9uIHRoZSB2aXN1YWwgaGlkZGVuIGlucHV0IGVsZW1lbnQuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIGEgbGFiZWwgZWxlbWVudCwgYSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgd2lsbCBiZVxuICAgIC8vIGRpc3BhdGNoZWQgb24gdGhlIGFzc29jaWF0ZWQgaW5wdXQgZWxlbWVudC4gU2luY2Ugd2UgYXJlIHVzaW5nIGEgbGFiZWwgZWxlbWVudCBhcyBvdXJcbiAgICAvLyByb290IGNvbnRhaW5lciwgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBgcmFkaW8tYnV0dG9uYCB3aWxsIGJlIGV4ZWN1dGVkIHR3aWNlLlxuICAgIC8vIFRoZSByZWFsIGNsaWNrIGV2ZW50IHdpbGwgYnViYmxlIHVwLCBhbmQgdGhlIGdlbmVyYXRlZCBjbGljayBldmVudCBhbHNvIHRyaWVzIHRvIGJ1YmJsZSB1cC5cbiAgICAvLyBUaGlzIHdpbGwgbGVhZCB0byBtdWx0aXBsZSBjbGljayBldmVudHMuXG4gICAgLy8gUHJldmVudGluZyBidWJibGluZyBmb3IgdGhlIHNlY29uZCBldmVudCB3aWxsIHNvbHZlIHRoYXQgaXNzdWUuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHJhZGlvIGJ1dHRvbiByZWNlaXZlZCBhIGNsaWNrIG9yIHRoZSBpbnB1dCByZWNvZ25pemVkIGFueSBjaGFuZ2UuXG4gICAqIENsaWNraW5nIG9uIGEgbGFiZWwgZWxlbWVudCwgd2lsbCB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50IG9uIHRoZSBhc3NvY2lhdGVkIGlucHV0LlxuICAgKi9cbiAgX29uSW5wdXRDaGFuZ2UoZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgYWx3YXlzIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBvbiB0aGUgY2hhbmdlIGV2ZW50LlxuICAgIC8vIE90aGVyd2lzZSB0aGUgY2hhbmdlIGV2ZW50LCBmcm9tIHRoZSBpbnB1dCBlbGVtZW50LCB3aWxsIGJ1YmJsZSB1cCBhbmRcbiAgICAvLyBlbWl0IGl0cyBldmVudCBvYmplY3QgdG8gdGhlIGBjaGFuZ2VgIG91dHB1dC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGNvbnN0IGdyb3VwVmFsdWVDaGFuZ2VkID0gdGhpcy5yYWRpb0dyb3VwICYmIHRoaXMudmFsdWUgIT09IHRoaXMucmFkaW9Hcm91cC52YWx1ZTtcbiAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuXG4gICAgaWYgKHRoaXMucmFkaW9Hcm91cCkge1xuICAgICAgdGhpcy5yYWRpb0dyb3VwLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgICAgaWYgKGdyb3VwVmFsdWVDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIGFuZCBtYXJrcyBmb3IgY2hlY2sgaWYgYSBjaGFuZ2Ugb2NjdXJyZWQuICovXG4gIHByb3RlY3RlZCBfc2V0RGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NoZWNrZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGFiSW5kZXg6IE51bWJlcklucHV0O1xufVxuXG5cbi8qKlxuICogQSBNYXRlcmlhbCBkZXNpZ24gcmFkaW8tYnV0dG9uLiBUeXBpY2FsbHkgcGxhY2VkIGluc2lkZSBvZiBgPG1hdC1yYWRpby1ncm91cD5gIGVsZW1lbnRzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcmFkaW8tYnV0dG9uJyxcbiAgdGVtcGxhdGVVcmw6ICdyYWRpby5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3JhZGlvLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdFJhZGlvQnV0dG9uJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcmFkaW8tYnV0dG9uJyxcbiAgICAnW2NsYXNzLm1hdC1yYWRpby1jaGVja2VkXSc6ICdjaGVja2VkJyxcbiAgICAnW2NsYXNzLm1hdC1yYWRpby1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yID09PSBcInByaW1hcnlcIicsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciA9PT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT09IFwid2FyblwiJyxcbiAgICAvLyBOZWVkcyB0byBiZSAtMSBzbyB0aGUgYGZvY3VzYCBldmVudCBzdGlsbCBmaXJlcy5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJy0xJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ251bGwnLFxuICAgIC8vIE5vdGU6IHVuZGVyIG5vcm1hbCBjb25kaXRpb25zIGZvY3VzIHNob3VsZG4ndCBsYW5kIG9uIHRoaXMgZWxlbWVudCwgaG93ZXZlciBpdCBtYXkgYmVcbiAgICAvLyBwcm9ncmFtbWF0aWNhbGx5IHNldCwgZm9yIGV4YW1wbGUgaW5zaWRlIG9mIGEgZm9jdXMgdHJhcCwgaW4gdGhpcyBjYXNlIHdlIHdhbnQgdG8gZm9yd2FyZFxuICAgIC8vIHRoZSBmb2N1cyB0byB0aGUgbmF0aXZlIGVsZW1lbnQuXG4gICAgJyhmb2N1cyknOiAnX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCknLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b24gZXh0ZW5kcyBfTWF0UmFkaW9CdXR0b25CYXNlIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUkFESU9fR1JPVVApIHJhZGlvR3JvdXA6IE1hdFJhZGlvR3JvdXAsXG4gICAgICAgICAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHJhZGlvRGlzcGF0Y2hlcjogVW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TKVxuICAgICAgICAgICAgICAgICAgcHJvdmlkZXJPdmVycmlkZT86IE1hdFJhZGlvRGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihyYWRpb0dyb3VwLCBlbGVtZW50UmVmLCBjaGFuZ2VEZXRlY3RvciwgZm9jdXNNb25pdG9yLCByYWRpb0Rpc3BhdGNoZXIsXG4gICAgICAgICAgYW5pbWF0aW9uTW9kZSwgcHJvdmlkZXJPdmVycmlkZSwgdGFiSW5kZXgpO1xuICB9XG59XG4iXX0=