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
    constructor(radioGroup, elementRef, _changeDetector, _focusMonitor, _radioDispatcher, _animationMode, _providerOverride) {
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
    { type: undefined }
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
    constructor(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, animationMode, providerOverride) {
        super(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, animationMode, providerOverride);
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
            },] }
];
MatRadioButton.ctorParameters = () => [
    { type: MatRadioGroup, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RADIO_GROUP,] }] },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: FocusMonitor },
    { type: UniqueSelectionDispatcher },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RADIO_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFLTCxrQkFBa0IsRUFDbEIsYUFBYSxHQUVkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFPM0UsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQ3BDLElBQUksY0FBYyxDQUF5QiwyQkFBMkIsRUFBRTtJQUN4RSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsaUNBQWlDO0NBQzNDLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxpQ0FBaUM7SUFDL0MsT0FBTztRQUNMLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUM7QUFDSixDQUFDO0FBRUQscUVBQXFFO0FBQ3JFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0NB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WSxFQUFFLGVBQWUsRUFDckUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekMsQ0FBQzs7O1lBdkNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QiwyeERBQXlCO2dCQUV6QixNQUFNLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDO2dCQUNyQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLDJCQUEyQixFQUFFLFNBQVM7b0JBQ3RDLDRCQUE0QixFQUFFLFVBQVU7b0JBQ3hDLGlDQUFpQyxFQUFFLHFDQUFxQztvQkFDeEUscUJBQXFCLEVBQUUscUJBQXFCO29CQUM1QyxvQkFBb0IsRUFBRSxvQkFBb0I7b0JBQzFDLGtCQUFrQixFQUFFLGtCQUFrQjtvQkFDdEMsbURBQW1EO29CQUNuRCxpQkFBaUIsRUFBRSxJQUFJO29CQUN2QixXQUFXLEVBQUUsSUFBSTtvQkFDakIsbUJBQW1CLEVBQUUsTUFBTTtvQkFDM0Isd0JBQXdCLEVBQUUsTUFBTTtvQkFDaEMseUJBQXlCLEVBQUUsTUFBTTtvQkFDakMsd0ZBQXdGO29CQUN4Riw0RkFBNEY7b0JBQzVGLG1DQUFtQztvQkFDbkMsU0FBUyxFQUFFLHFDQUFxQztpQkFDakQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7WUFFOEQsYUFBYSx1QkFBN0QsUUFBUSxZQUFJLE1BQU0sU0FBQyxlQUFlO1lBMW1CL0MsVUFBVTtZQUpWLGlCQUFpQjtZQVBYLFlBQVk7WUFFWix5QkFBeUI7eUNBd25CbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7NENBQ3RDLFFBQVEsWUFBSSxNQUFNLFNBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7VW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyB7XG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG59XG5cbmV4cG9ydCBjb25zdCBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdFJhZGlvRGVmYXVsdE9wdGlvbnM+KCdtYXQtcmFkaW8tZGVmYXVsdC1vcHRpb25zJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVF9SQURJT19ERUZBVUxUX09QVElPTlNfRkFDVE9SWVxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgY29sb3I6ICdhY2NlbnQnXG4gIH07XG59XG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzIGZvciByYWRpbyBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtcmFkaW8tZ3JvdXAgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci4gVGhpc1xuICogYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIG5nQ29udHJvbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SQURJT19HUk9VUF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRSYWRpb0dyb3VwKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0UmFkaW8gYW5kIE1hdFJhZGlvR3JvdXAuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIE1hdFJhZGlvQnV0dG9uIHRoYXQgZW1pdHMgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBfTWF0UmFkaW9CdXR0b25CYXNlLFxuICAgIC8qKiBUaGUgdmFsdWUgb2YgdGhlIE1hdFJhZGlvQnV0dG9uLiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55KSB7fVxufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGluamVjdCBpbnN0YW5jZXMgb2YgYE1hdFJhZGlvR3JvdXBgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdFJhZGlvR3JvdXBgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX1JBRElPX0dST1VQID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48X01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+PignTWF0UmFkaW9Hcm91cCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRSYWRpb0dyb3VwYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0UmFkaW9Hcm91cEJhc2U8VCBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbkJhc2U+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKiogU2VsZWN0ZWQgdmFsdWUgZm9yIHRoZSByYWRpbyBncm91cC4gKi9cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueSA9IG51bGw7XG5cbiAgLyoqIFRoZSBIVE1MIG5hbWUgYXR0cmlidXRlIGFwcGxpZWQgdG8gcmFkaW8gYnV0dG9ucyBpbiB0aGlzIGdyb3VwLiAqL1xuICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgPSBgbWF0LXJhZGlvLWdyb3VwLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCByYWRpbyBidXR0b24uIFNob3VsZCBtYXRjaCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IFQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgYHZhbHVlYCBoYXMgYmVlbiBzZXQgdG8gaXRzIGluaXRpYWwgdmFsdWUuICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWxzIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSByYWRpby1idXR0b25zLiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIHByaXZhdGUgX2xhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGdyb3VwIGlzIGRpc2FibGVkLiAqL1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyByZXF1aXJlZC4gKi9cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIG1ldGhvZCB0byBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIG5nTW9kZWwgKi9cbiAgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAgdmFsdWUgY2hhbmdlcy5cbiAgICogQ2hhbmdlIGV2ZW50cyBhcmUgb25seSBlbWl0dGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgZHVlIHRvIHVzZXIgaW50ZXJhY3Rpb24gd2l0aFxuICAgKiBhIHJhZGlvIGJ1dHRvbiAodGhlIHNhbWUgYmVoYXZpb3IgYXMgYDxpbnB1dCB0eXBlLVwicmFkaW9cIj5gKS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRSYWRpb0NoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPigpO1xuXG4gIC8qKiBDaGlsZCByYWRpbyBidXR0b25zLiAqL1xuICBhYnN0cmFjdCBfcmFkaW9zOiBRdWVyeUxpc3Q8VD47XG5cbiAgLyoqIFRoZW1lIGNvbG9yIGZvciBhbGwgb2YgdGhlIHJhZGlvIGJ1dHRvbnMgaW4gdGhlIGdyb3VwLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSByYWRpbyBidXR0b24gZ3JvdXAuIEFsbCByYWRpbyBidXR0b25zIGluc2lkZSB0aGlzIGdyb3VwIHdpbGwgdXNlIHRoaXMgbmFtZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX25hbWU7IH1cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVSYWRpb0J1dHRvbk5hbWVzKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWxzIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSByYWRpby1idXR0b25zLiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIEBJbnB1dCgpXG4gIGdldCBsYWJlbFBvc2l0aW9uKCk6ICdiZWZvcmUnIHwgJ2FmdGVyJyB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsUG9zaXRpb247XG4gIH1cbiAgc2V0IGxhYmVsUG9zaXRpb24odikge1xuICAgIHRoaXMuX2xhYmVsUG9zaXRpb24gPSB2ID09PSAnYmVmb3JlJyA/ICdiZWZvcmUnIDogJ2FmdGVyJztcbiAgICB0aGlzLl9tYXJrUmFkaW9zRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWx1ZSBmb3IgdGhlIHJhZGlvLWdyb3VwLiBTaG91bGQgZXF1YWwgdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCByYWRpbyBidXR0b24gaWYgdGhlcmUgaXNcbiAgICogYSBjb3JyZXNwb25kaW5nIHJhZGlvIGJ1dHRvbiB3aXRoIGEgbWF0Y2hpbmcgdmFsdWUuIElmIHRoZXJlIGlzIG5vdCBzdWNoIGEgY29ycmVzcG9uZGluZ1xuICAgKiByYWRpbyBidXR0b24sIHRoaXMgdmFsdWUgcGVyc2lzdHMgdG8gYmUgYXBwbGllZCBpbiBjYXNlIGEgbmV3IHJhZGlvIGJ1dHRvbiBpcyBhZGRlZCB3aXRoIGFcbiAgICogbWF0Y2hpbmcgdmFsdWUuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgLy8gU2V0IHRoaXMgYmVmb3JlIHByb2NlZWRpbmcgdG8gZW5zdXJlIG5vIGNpcmN1bGFyIGxvb3Agb2NjdXJzIHdpdGggc2VsZWN0aW9uLlxuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5fdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpO1xuICAgICAgdGhpcy5fY2hlY2tTZWxlY3RlZFJhZGlvQnV0dG9uKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrU2VsZWN0ZWRSYWRpb0J1dHRvbigpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQgJiYgIXRoaXMuX3NlbGVjdGVkLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHJhZGlvIGJ1dHRvbi4gSWYgc2V0IHRvIGEgbmV3IHJhZGlvIGJ1dHRvbiwgdGhlIHJhZGlvIGdyb3VwIHZhbHVlXG4gICAqIHdpbGwgYmUgdXBkYXRlZCB0byBtYXRjaCB0aGUgbmV3IHNlbGVjdGVkIGJ1dHRvbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkOyB9XG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogVCB8IG51bGwpIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMudmFsdWUgPSBzZWxlY3RlZCA/IHNlbGVjdGVkLnZhbHVlIDogbnVsbDtcbiAgICB0aGlzLl9jaGVja1NlbGVjdGVkUmFkaW9CdXR0b24oKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyBkaXNhYmxlZCAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fbWFya1JhZGlvc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgcmVxdWlyZWQgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX21hcmtSYWRpb3NGb3JDaGVjaygpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwcm9wZXJ0aWVzIG9uY2UgY29udGVudCBjaGlsZHJlbiBhcmUgYXZhaWxhYmxlLlxuICAgKiBUaGlzIGFsbG93cyB1cyB0byBwcm9wYWdhdGUgcmVsZXZhbnQgYXR0cmlidXRlcyB0byBhc3NvY2lhdGVkIGJ1dHRvbnMuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gTWFyayB0aGlzIGNvbXBvbmVudCBhcyBpbml0aWFsaXplZCBpbiBBZnRlckNvbnRlbnRJbml0IGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2FuXG4gICAgLy8gcG9zc2libHkgYmUgc2V0IGJ5IE5nTW9kZWwgb24gTWF0UmFkaW9Hcm91cCwgYW5kIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIE9uSW5pdCBvZiB0aGVcbiAgICAvLyBOZ01vZGVsIG9jY3VycyAqYWZ0ZXIqIHRoZSBPbkluaXQgb2YgdGhlIE1hdFJhZGlvR3JvdXAuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTWFyayB0aGlzIGdyb3VwIGFzIGJlaW5nIFwidG91Y2hlZFwiIChmb3IgbmdNb2RlbCkuIE1lYW50IHRvIGJlIGNhbGxlZCBieSB0aGUgY29udGFpbmVkXG4gICAqIHJhZGlvIGJ1dHRvbnMgdXBvbiB0aGVpciBibHVyLlxuICAgKi9cbiAgX3RvdWNoKCkge1xuICAgIGlmICh0aGlzLm9uVG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSYWRpb0J1dHRvbk5hbWVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9yYWRpb3MpIHtcbiAgICAgIHRoaXMuX3JhZGlvcy5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8ubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgcmFkaW8uX21hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGBzZWxlY3RlZGAgcmFkaW8gYnV0dG9uIGZyb20gdGhlIGludGVybmFsIF92YWx1ZSBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgYWxyZWFkeSBtYXRjaGVzIHRoZSBzZWxlY3RlZCByYWRpbywgZG8gbm90aGluZy5cbiAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkICE9PSBudWxsICYmIHRoaXMuX3NlbGVjdGVkLnZhbHVlID09PSB0aGlzLl92YWx1ZTtcblxuICAgIGlmICh0aGlzLl9yYWRpb3MgJiYgIWlzQWxyZWFkeVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IG51bGw7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmNoZWNrZWQgPSB0aGlzLnZhbHVlID09PSByYWRpby52YWx1ZTtcbiAgICAgICAgaWYgKHJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHJhZGlvO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRSYWRpb0NoYW5nZSh0aGlzLl9zZWxlY3RlZCEsIHRoaXMuX3ZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgX21hcmtSYWRpb3NGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5fcmFkaW9zKSB7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiByYWRpby5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vZGVsIHZhbHVlIGNoYW5nZXMuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKipcbiAqIEEgZ3JvdXAgb2YgcmFkaW8gYnV0dG9ucy4gTWF5IGNvbnRhaW4gb25lIG9yIG1vcmUgYDxtYXQtcmFkaW8tYnV0dG9uPmAgZWxlbWVudHMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1yYWRpby1ncm91cCcsXG4gIGV4cG9ydEFzOiAnbWF0UmFkaW9Hcm91cCcsXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9SQURJT19HUk9VUF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfUkFESU9fR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRSYWRpb0dyb3VwfSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ3JhZGlvZ3JvdXAnLFxuICAgICdjbGFzcyc6ICdtYXQtcmFkaW8tZ3JvdXAnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0dyb3VwIGV4dGVuZHMgX01hdFJhZGlvR3JvdXBCYXNlPE1hdFJhZGlvQnV0dG9uPiB7XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRSYWRpb0J1dHRvbiksIHtkZXNjZW5kYW50czogdHJ1ZX0pXG4gIF9yYWRpb3M6IFF1ZXJ5TGlzdDxNYXRSYWRpb0J1dHRvbj47XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0UmFkaW9CdXR0b24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0UmFkaW9CdXR0b25CYXNlIHtcbiAgLy8gU2luY2UgdGhlIGRpc2FibGVkIHByb3BlcnR5IGlzIG1hbnVhbGx5IGRlZmluZWQgZm9yIHRoZSBNYXRSYWRpb0J1dHRvbiBhbmQgaXNuJ3Qgc2V0IHVwIGluXG4gIC8vIHRoZSBtaXhpbiBiYXNlIGNsYXNzLiBUbyBiZSBhYmxlIHRvIHVzZSB0aGUgdGFiaW5kZXggbWl4aW4sIGEgZGlzYWJsZWQgcHJvcGVydHkgbXVzdCBiZVxuICAvLyBkZWZpbmVkIHRvIHByb3Blcmx5IHdvcmsuXG4gIGRpc2FibGVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbi8vIEFzIHBlciBNYXRlcmlhbCBkZXNpZ24gc3BlY2lmaWNhdGlvbnMgdGhlIHNlbGVjdGlvbiBjb250cm9sIHJhZGlvIHNob3VsZCB1c2UgdGhlIGFjY2VudCBjb2xvclxuLy8gcGFsZXR0ZSBieSBkZWZhdWx0LiBodHRwczovL21hdGVyaWFsLmlvL2d1aWRlbGluZXMvY29tcG9uZW50cy9zZWxlY3Rpb24tY29udHJvbHMuaHRtbFxuY29uc3QgX01hdFJhZGlvQnV0dG9uTWl4aW5CYXNlOlxuICAgIENhbkRpc2FibGVSaXBwbGVDdG9yICYgSGFzVGFiSW5kZXhDdG9yICYgdHlwZW9mIE1hdFJhZGlvQnV0dG9uQmFzZSA9XG4gICAgICAgIG1peGluRGlzYWJsZVJpcHBsZShtaXhpblRhYkluZGV4KE1hdFJhZGlvQnV0dG9uQmFzZSkpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRSYWRpb0J1dHRvbmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFJhZGlvQnV0dG9uQmFzZSBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbk1peGluQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDYW5EaXNhYmxlUmlwcGxlLCBIYXNUYWJJbmRleCB7XG5cbiAgcHJpdmF0ZSBfdW5pcXVlSWQ6IHN0cmluZyA9IGBtYXQtcmFkaW8tJHsrK25leHRVbmlxdWVJZH1gO1xuXG4gIC8qKiBUaGUgdW5pcXVlIElEIGZvciB0aGUgcmFkaW8gYnV0dG9uLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gdGhpcy5fdW5pcXVlSWQ7XG5cbiAgLyoqIEFuYWxvZyB0byBIVE1MICduYW1lJyBhdHRyaWJ1dGUgdXNlZCB0byBncm91cCByYWRpb3MgZm9yIHVuaXF1ZSBzZWxlY3Rpb24uICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAvKiogVXNlZCB0byBzZXQgdGhlICdhcmlhLWxhYmVsJyBhdHRyaWJ1dGUgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSAnYXJpYS1sYWJlbGxlZGJ5JyBhdHRyaWJ1dGUgdGFrZXMgcHJlY2VkZW5jZSBhcyB0aGUgZWxlbWVudCdzIHRleHQgYWx0ZXJuYXRpdmUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogVGhlICdhcmlhLWRlc2NyaWJlZGJ5JyBhdHRyaWJ1dGUgaXMgcmVhZCBhZnRlciB0aGUgZWxlbWVudCdzIGxhYmVsIGFuZCBmaWVsZCB0eXBlLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGlzIHJhZGlvIGJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY2hlY2tlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7IH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdDaGVja2VkU3RhdGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIGlmICh0aGlzLl9jaGVja2VkICE9PSBuZXdDaGVja2VkU3RhdGUpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSBuZXdDaGVja2VkU3RhdGU7XG4gICAgICBpZiAobmV3Q2hlY2tlZFN0YXRlICYmIHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAudmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwLnNlbGVjdGVkID0gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAoIW5ld0NoZWNrZWRTdGF0ZSAmJiB0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLnZhbHVlID09PSB0aGlzLnZhbHVlKSB7XG5cbiAgICAgICAgLy8gV2hlbiB1bmNoZWNraW5nIHRoZSBzZWxlY3RlZCByYWRpbyBidXR0b24sIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgcmFkaW9cbiAgICAgICAgLy8gcHJvcGVydHkgb24gdGhlIGdyb3VwLlxuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3Q2hlY2tlZFN0YXRlKSB7XG4gICAgICAgIC8vIE5vdGlmeSBhbGwgcmFkaW8gYnV0dG9ucyB3aXRoIHRoZSBzYW1lIG5hbWUgdG8gdW4tY2hlY2suXG4gICAgICAgIHRoaXMuX3JhZGlvRGlzcGF0Y2hlci5ub3RpZnkodGhpcy5pZCwgdGhpcy5uYW1lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhpcyByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMucmFkaW9Hcm91cCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgIC8vIFVwZGF0ZSBjaGVja2VkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZWQgdG8gbWF0Y2ggdGhlIHJhZGlvIGdyb3VwJ3MgdmFsdWVcbiAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSByYWRpbyBidXR0b24uIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KClcbiAgZ2V0IGxhYmVsUG9zaXRpb24oKTogJ2JlZm9yZScgfCAnYWZ0ZXInIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxQb3NpdGlvbiB8fCAodGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC5sYWJlbFBvc2l0aW9uKSB8fCAnYWZ0ZXInO1xuICB9XG4gIHNldCBsYWJlbFBvc2l0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fbGFiZWxQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2xhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLnJhZGlvR3JvdXAgIT09IG51bGwgJiYgdGhpcy5yYWRpb0dyb3VwLmRpc2FibGVkKTtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zZXREaXNhYmxlZChjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBidXR0b24gaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQgfHwgKHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAucmVxdWlyZWQpO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgcmFkaW8gYnV0dG9uLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3IgfHxcbiAgICAgICh0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLmNvbG9yKSB8fFxuICAgICAgdGhpcy5fcHJvdmlkZXJPdmVycmlkZSAmJiB0aGlzLl9wcm92aWRlck92ZXJyaWRlLmNvbG9yIHx8ICdhY2NlbnQnO1xuICB9XG4gIHNldCBjb2xvcihuZXdWYWx1ZTogVGhlbWVQYWxldHRlKSB7IHRoaXMuX2NvbG9yID0gbmV3VmFsdWU7IH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjaGVja2VkIHN0YXRlIG9mIHRoaXMgcmFkaW8gYnV0dG9uIGNoYW5nZXMuXG4gICAqIENoYW5nZSBldmVudHMgYXJlIG9ubHkgZW1pdHRlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIGR1ZSB0byB1c2VyIGludGVyYWN0aW9uIHdpdGhcbiAgICogdGhlIHJhZGlvIGJ1dHRvbiAodGhlIHNhbWUgYmVoYXZpb3IgYXMgYDxpbnB1dCB0eXBlLVwicmFkaW9cIj5gKS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRSYWRpb0NoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPigpO1xuXG4gIC8qKiBUaGUgcGFyZW50IHJhZGlvIGdyb3VwLiBNYXkgb3IgbWF5IG5vdCBiZSBwcmVzZW50LiAqL1xuICByYWRpb0dyb3VwOiBfTWF0UmFkaW9Hcm91cEJhc2U8X01hdFJhZGlvQnV0dG9uQmFzZT47XG5cbiAgLyoqIElEIG9mIHRoZSBuYXRpdmUgaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtcmFkaW8tYnV0dG9uPmAgKi9cbiAgZ2V0IGlucHV0SWQoKTogc3RyaW5nIHsgcmV0dXJuIGAke3RoaXMuaWQgfHwgdGhpcy5fdW5pcXVlSWR9LWlucHV0YDsgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgY2hlY2tlZC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgZGlzYWJsZWQuICovXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgcmVxdWlyZWQuICovXG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBWYWx1ZSBhc3NpZ25lZCB0byB0aGlzIHJhZGlvLiAqL1xuICBwcml2YXRlIF92YWx1ZTogYW55ID0gbnVsbDtcblxuICAvKiogVW5yZWdpc3RlciBmdW5jdGlvbiBmb3IgX3JhZGlvRGlzcGF0Y2hlciAqL1xuICBwcml2YXRlIF9yZW1vdmVVbmlxdWVTZWxlY3Rpb25MaXN0ZW5lcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1yYWRpbz5gIGVsZW1lbnQgKi9cbiAgQFZpZXdDaGlsZCgnaW5wdXQnKSBfaW5wdXRFbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHJhZGlvR3JvdXA6IF9NYXRSYWRpb0dyb3VwQmFzZTxfTWF0UmFkaW9CdXR0b25CYXNlPixcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yYWRpb0Rpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcHJvdmlkZXJPdmVycmlkZT86IE1hdFJhZGlvRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIEFzc2VydGlvbnMuIElkZWFsbHkgdGhlc2Ugc2hvdWxkIGJlIHN0cmlwcGVkIG91dCBieSB0aGUgY29tcGlsZXIuXG4gICAgLy8gVE9ETyhqZWxib3Vybik6IEFzc2VydCB0aGF0IHRoZXJlJ3Mgbm8gbmFtZSBiaW5kaW5nIEFORCBhIHBhcmVudCByYWRpbyBncm91cC5cbiAgICB0aGlzLnJhZGlvR3JvdXAgPSByYWRpb0dyb3VwO1xuXG4gICAgdGhpcy5fcmVtb3ZlVW5pcXVlU2VsZWN0aW9uTGlzdGVuZXIgPVxuICAgICAgX3JhZGlvRGlzcGF0Y2hlci5saXN0ZW4oKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoaWQgIT09IHRoaXMuaWQgJiYgbmFtZSA9PT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgdGhpcy5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHJhZGlvIGJ1dHRvbi4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9pbnB1dEVsZW1lbnQsICdrZXlib2FyZCcsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSByYWRpbyBidXR0b24gYXMgbmVlZGluZyBjaGVja2luZyBmb3IgY2hhbmdlIGRldGVjdGlvbi5cbiAgICogVGhpcyBtZXRob2QgaXMgZXhwb3NlZCBiZWNhdXNlIHRoZSBwYXJlbnQgcmFkaW8gZ3JvdXAgd2lsbCBkaXJlY3RseVxuICAgKiB1cGRhdGUgYm91bmQgcHJvcGVydGllcyBvZiB0aGUgcmFkaW8gYnV0dG9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICAvLyBXaGVuIGdyb3VwIHZhbHVlIGNoYW5nZXMsIHRoZSBidXR0b24gd2lsbCBub3QgYmUgbm90aWZpZWQuIFVzZSBgbWFya0ZvckNoZWNrYCB0byBleHBsaWNpdFxuICAgIC8vIHVwZGF0ZSByYWRpbyBidXR0b24ncyBzdGF0dXNcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgIC8vIElmIHRoZSByYWRpbyBpcyBpbnNpZGUgYSByYWRpbyBncm91cCwgZGV0ZXJtaW5lIGlmIGl0IHNob3VsZCBiZSBjaGVja2VkXG4gICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHRoaXMuX3ZhbHVlO1xuICAgICAgLy8gQ29weSBuYW1lIGZyb20gcGFyZW50IHJhZGlvIGdyb3VwXG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLnJhZGlvR3JvdXAubmFtZTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yXG4gICAgICAubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKVxuICAgICAgLnN1YnNjcmliZShmb2N1c09yaWdpbiA9PiB7XG4gICAgICAgIGlmICghZm9jdXNPcmlnaW4gJiYgdGhpcy5yYWRpb0dyb3VwKSB7XG4gICAgICAgICAgdGhpcy5yYWRpb0dyb3VwLl90b3VjaCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9yZW1vdmVVbmlxdWVTZWxlY3Rpb25MaXN0ZW5lcigpO1xuICB9XG5cbiAgLyoqIERpc3BhdGNoIGNoYW5nZSBldmVudCB3aXRoIGN1cnJlbnQgdmFsdWUuICovXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpOiB2b2lkIHtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRSYWRpb0NoYW5nZSh0aGlzLCB0aGlzLl92YWx1ZSkpO1xuICB9XG5cbiAgX2lzUmlwcGxlRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgX29uSW5wdXRDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAvLyBXZSBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gZm9yIGNsaWNrIGV2ZW50cyBvbiB0aGUgdmlzdWFsIGhpZGRlbiBpbnB1dCBlbGVtZW50LlxuICAgIC8vIEJ5IGRlZmF1bHQsIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiBhIGxhYmVsIGVsZW1lbnQsIGEgZ2VuZXJhdGVkIGNsaWNrIGV2ZW50IHdpbGwgYmVcbiAgICAvLyBkaXNwYXRjaGVkIG9uIHRoZSBhc3NvY2lhdGVkIGlucHV0IGVsZW1lbnQuIFNpbmNlIHdlIGFyZSB1c2luZyBhIGxhYmVsIGVsZW1lbnQgYXMgb3VyXG4gICAgLy8gcm9vdCBjb250YWluZXIsIHRoZSBjbGljayBldmVudCBvbiB0aGUgYHJhZGlvLWJ1dHRvbmAgd2lsbCBiZSBleGVjdXRlZCB0d2ljZS5cbiAgICAvLyBUaGUgcmVhbCBjbGljayBldmVudCB3aWxsIGJ1YmJsZSB1cCwgYW5kIHRoZSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgYWxzbyB0cmllcyB0byBidWJibGUgdXAuXG4gICAgLy8gVGhpcyB3aWxsIGxlYWQgdG8gbXVsdGlwbGUgY2xpY2sgZXZlbnRzLlxuICAgIC8vIFByZXZlbnRpbmcgYnViYmxpbmcgZm9yIHRoZSBzZWNvbmQgZXZlbnQgd2lsbCBzb2x2ZSB0aGF0IGlzc3VlLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJlZCB3aGVuIHRoZSByYWRpbyBidXR0b24gcmVjZWl2ZWQgYSBjbGljayBvciB0aGUgaW5wdXQgcmVjb2duaXplZCBhbnkgY2hhbmdlLlxuICAgKiBDbGlja2luZyBvbiBhIGxhYmVsIGVsZW1lbnQsIHdpbGwgdHJpZ2dlciBhIGNoYW5nZSBldmVudCBvbiB0aGUgYXNzb2NpYXRlZCBpbnB1dC5cbiAgICovXG4gIF9vbklucHV0Q2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGFsd2F5cyBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gb24gdGhlIGNoYW5nZSBldmVudC5cbiAgICAvLyBPdGhlcndpc2UgdGhlIGNoYW5nZSBldmVudCwgZnJvbSB0aGUgaW5wdXQgZWxlbWVudCwgd2lsbCBidWJibGUgdXAgYW5kXG4gICAgLy8gZW1pdCBpdHMgZXZlbnQgb2JqZWN0IHRvIHRoZSBgY2hhbmdlYCBvdXRwdXQuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBjb25zdCBncm91cFZhbHVlQ2hhbmdlZCA9IHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnZhbHVlICE9PSB0aGlzLnJhZGlvR3JvdXAudmFsdWU7XG4gICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcblxuICAgIGlmICh0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgIHRoaXMucmFkaW9Hcm91cC5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbih0aGlzLnZhbHVlKTtcbiAgICAgIGlmIChncm91cFZhbHVlQ2hhbmdlZCkge1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBhbmQgbWFya3MgZm9yIGNoZWNrIGlmIGEgY2hhbmdlIG9jY3VycmVkLiAqL1xuICBwcm90ZWN0ZWQgX3NldERpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jaGVja2VkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cblxuXG4vKipcbiAqIEEgTWF0ZXJpYWwgZGVzaWduIHJhZGlvLWJ1dHRvbi4gVHlwaWNhbGx5IHBsYWNlZCBpbnNpZGUgb2YgYDxtYXQtcmFkaW8tZ3JvdXA+YCBlbGVtZW50cy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXJhZGlvLWJ1dHRvbicsXG4gIHRlbXBsYXRlVXJsOiAncmFkaW8uaHRtbCcsXG4gIHN0eWxlVXJsczogWydyYWRpby5jc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRSYWRpb0J1dHRvbicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXJhZGlvLWJ1dHRvbicsXG4gICAgJ1tjbGFzcy5tYXQtcmFkaW8tY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtcmFkaW8tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgICAnW2NsYXNzLm1hdC1wcmltYXJ5XSc6ICdjb2xvciA9PT0gXCJwcmltYXJ5XCInLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09PSBcIndhcm5cIicsXG4gICAgLy8gTmVlZHMgdG8gYmUgLTEgc28gdGhlIGBmb2N1c2AgZXZlbnQgc3RpbGwgZmlyZXMuXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICctMScsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdudWxsJyxcbiAgICAvLyBOb3RlOiB1bmRlciBub3JtYWwgY29uZGl0aW9ucyBmb2N1cyBzaG91bGRuJ3QgbGFuZCBvbiB0aGlzIGVsZW1lbnQsIGhvd2V2ZXIgaXQgbWF5IGJlXG4gICAgLy8gcHJvZ3JhbW1hdGljYWxseSBzZXQsIGZvciBleGFtcGxlIGluc2lkZSBvZiBhIGZvY3VzIHRyYXAsIGluIHRoaXMgY2FzZSB3ZSB3YW50IHRvIGZvcndhcmRcbiAgICAvLyB0aGUgZm9jdXMgdG8gdGhlIG5hdGl2ZSBlbGVtZW50LlxuICAgICcoZm9jdXMpJzogJ19pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJhZGlvQnV0dG9uIGV4dGVuZHMgX01hdFJhZGlvQnV0dG9uQmFzZSB7XG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JBRElPX0dST1VQKSByYWRpb0dyb3VwOiBNYXRSYWRpb0dyb3VwLFxuICAgICAgICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICByYWRpb0Rpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JBRElPX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIHByb3ZpZGVyT3ZlcnJpZGU/OiBNYXRSYWRpb0RlZmF1bHRPcHRpb25zKSB7XG4gICAgc3VwZXIocmFkaW9Hcm91cCwgZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3IsIGZvY3VzTW9uaXRvciwgcmFkaW9EaXNwYXRjaGVyLFxuICAgICAgICAgIGFuaW1hdGlvbk1vZGUsIHByb3ZpZGVyT3ZlcnJpZGUpO1xuICB9XG59XG4iXX0=