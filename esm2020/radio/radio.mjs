/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/collections";
import * as i3 from "@angular/material/core";
export const MAT_RADIO_DEFAULT_OPTIONS = new InjectionToken('mat-radio-default-options', {
    providedIn: 'root',
    factory: MAT_RADIO_DEFAULT_OPTIONS_FACTORY,
});
export function MAT_RADIO_DEFAULT_OPTIONS_FACTORY() {
    return {
        color: 'accent',
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
    multi: true,
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
    get name() {
        return this._name;
    }
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
    get value() {
        return this._value;
    }
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
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.value = selected ? selected.value : null;
        this._checkSelectedRadioButton();
    }
    /** Whether the radio group is disabled */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._markRadiosForCheck();
    }
    /** Whether the radio group is required */
    get required() {
        return this._required;
    }
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
_MatRadioGroupBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: _MatRadioGroupBase, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
_MatRadioGroupBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.0", type: _MatRadioGroupBase, inputs: { color: "color", name: "name", labelPosition: "labelPosition", value: "value", selected: "selected", disabled: "disabled", required: "required" }, outputs: { change: "change" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: _MatRadioGroupBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { change: [{
                type: Output
            }], color: [{
                type: Input
            }], name: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], value: [{
                type: Input
            }], selected: [{
                type: Input
            }], disabled: [{
                type: Input
            }], required: [{
                type: Input
            }] } });
/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
 */
export class MatRadioGroup extends _MatRadioGroupBase {
}
MatRadioGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatRadioGroup, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatRadioGroup.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.0", type: MatRadioGroup, selector: "mat-radio-group", host: { attributes: { "role": "radiogroup" }, classAttribute: "mat-radio-group" }, providers: [
        MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
        { provide: MAT_RADIO_GROUP, useExisting: MatRadioGroup },
    ], queries: [{ propertyName: "_radios", predicate: i0.forwardRef(function () { return MatRadioButton; }), descendants: true }], exportAs: ["matRadioGroup"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatRadioGroup, decorators: [{
            type: Directive,
            args: [{
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
                }]
        }], propDecorators: { _radios: [{
                type: ContentChildren,
                args: [forwardRef(() => MatRadioButton), { descendants: true }]
            }] } });
// Boilerplate for applying mixins to MatRadioButton.
/** @docs-private */
class MatRadioButtonBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatRadioButtonMixinBase = mixinDisableRipple(mixinTabIndex(MatRadioButtonBase));
/**
 * Base class with all of the `MatRadioButton` functionality.
 * @docs-private
 */
export class _MatRadioButtonBase extends _MatRadioButtonMixinBase {
    constructor(radioGroup, elementRef, _changeDetector, _focusMonitor, _radioDispatcher, animationMode, _providerOverride, tabIndex) {
        super(elementRef);
        this._changeDetector = _changeDetector;
        this._focusMonitor = _focusMonitor;
        this._radioDispatcher = _radioDispatcher;
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
        this._noopAnimations = animationMode === 'NoopAnimations';
        if (tabIndex) {
            this.tabIndex = coerceNumberProperty(tabIndex, 0);
        }
        this._removeUniqueSelectionListener = _radioDispatcher.listen((id, name) => {
            if (id !== this.id && name === this.name) {
                this.checked = false;
            }
        });
    }
    /** Whether this radio button is checked. */
    get checked() {
        return this._checked;
    }
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
    get value() {
        return this._value;
    }
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
        // As per Material design specifications the selection control radio should use the accent color
        // palette by default. https://material.io/guidelines/components/selection-controls.html
        return (this._color ||
            (this.radioGroup && this.radioGroup.color) ||
            (this._providerOverride && this._providerOverride.color) ||
            'accent');
    }
    set color(newValue) {
        this._color = newValue;
    }
    /** ID of the native input element inside `<mat-radio-button>` */
    get inputId() {
        return `${this.id || this._uniqueId}-input`;
    }
    /** Focuses the radio button. */
    focus(options, origin) {
        if (origin) {
            this._focusMonitor.focusVia(this._inputElement, origin, options);
        }
        else {
            this._inputElement.nativeElement.focus(options);
        }
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
        this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
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
    /** Triggered when the radio button receives an interaction from the user. */
    _onInputInteraction(event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        if (!this.checked && !this.disabled) {
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
    }
    /** Sets the disabled state and marks for check if a change occurred. */
    _setDisabled(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            this._changeDetector.markForCheck();
        }
    }
}
_MatRadioButtonBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: _MatRadioButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatRadioButtonBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.0", type: _MatRadioButtonBase, inputs: { id: "id", name: "name", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], checked: "checked", value: "value", labelPosition: "labelPosition", disabled: "disabled", required: "required", color: "color" }, outputs: { change: "change" }, viewQueries: [{ propertyName: "_inputElement", first: true, predicate: ["input"], descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: _MatRadioButtonBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: _MatRadioGroupBase }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }, { type: i2.UniqueSelectionDispatcher }, { type: undefined }, { type: undefined }, { type: undefined }]; }, propDecorators: { id: [{
                type: Input
            }], name: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], checked: [{
                type: Input
            }], value: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], disabled: [{
                type: Input
            }], required: [{
                type: Input
            }], color: [{
                type: Input
            }], change: [{
                type: Output
            }], _inputElement: [{
                type: ViewChild,
                args: ['input']
            }] } });
/**
 * A Material design radio-button. Typically placed inside of `<mat-radio-group>` elements.
 */
export class MatRadioButton extends _MatRadioButtonBase {
    constructor(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, animationMode, providerOverride, tabIndex) {
        super(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, animationMode, providerOverride, tabIndex);
    }
}
MatRadioButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatRadioButton, deps: [{ token: MAT_RADIO_GROUP, optional: true }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }, { token: i2.UniqueSelectionDispatcher }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_RADIO_DEFAULT_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component });
MatRadioButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.0", type: MatRadioButton, selector: "mat-radio-button", inputs: { disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { listeners: { "focus": "_inputElement.nativeElement.focus()" }, properties: { "class.mat-radio-checked": "checked", "class.mat-radio-disabled": "disabled", "class._mat-animation-noopable": "_noopAnimations", "class.mat-primary": "color === \"primary\"", "class.mat-accent": "color === \"accent\"", "class.mat-warn": "color === \"warn\"", "attr.tabindex": "null", "attr.id": "id", "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" }, classAttribute: "mat-radio-button" }, exportAs: ["matRadioButton"], usesInheritance: true, ngImport: i0, template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <span class=\"mat-radio-container\">\n    <span class=\"mat-radio-outer-circle\"></span>\n    <span class=\"mat-radio-inner-circle\"></span>\n    <input #input class=\"mat-radio-input\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputInteraction($event)\"\n        (click)=\"_onInputClick($event)\">\n\n    <!-- The ripple comes after the input so that we can target it with a CSS\n         sibling selector when the input is focused. -->\n    <span mat-ripple class=\"mat-radio-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n      <span class=\"mat-ripple-element mat-radio-persistent-ripple\"></span>\n    </span>\n  </span>\n\n  <!-- The label content for radio control. -->\n  <span class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;opacity:0;transition:transform ease 280ms,background-color ease 280ms,opacity linear 1ms 280ms;width:20px;transform:scale(0.001);-webkit-print-color-adjust:exact;color-adjust:exact}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5);opacity:1;transition:transform ease 280ms,background-color ease 280ms}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none;top:0;left:0}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{opacity:0;position:absolute;top:0;left:0;margin:0;width:100%;height:100%;cursor:inherit;z-index:-1}.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-ripple,.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-ripple{outline:solid 3px}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"], directives: [{ type: i3.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatRadioButton, decorators: [{
            type: Component,
            args: [{ selector: 'mat-radio-button', inputs: ['disableRipple', 'tabIndex'], encapsulation: ViewEncapsulation.None, exportAs: 'matRadioButton', host: {
                        'class': 'mat-radio-button',
                        '[class.mat-radio-checked]': 'checked',
                        '[class.mat-radio-disabled]': 'disabled',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                        '[class.mat-primary]': 'color === "primary"',
                        '[class.mat-accent]': 'color === "accent"',
                        '[class.mat-warn]': 'color === "warn"',
                        // Needs to be removed since it causes some a11y issues (see #21266).
                        '[attr.tabindex]': 'null',
                        '[attr.id]': 'id',
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.aria-describedby]': 'null',
                        // Note: under normal conditions focus shouldn't land on this element, however it may be
                        // programmatically set, for example inside of a focus trap, in this case we want to forward
                        // the focus to the native element.
                        '(focus)': '_inputElement.nativeElement.focus()',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <span class=\"mat-radio-container\">\n    <span class=\"mat-radio-outer-circle\"></span>\n    <span class=\"mat-radio-inner-circle\"></span>\n    <input #input class=\"mat-radio-input\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputInteraction($event)\"\n        (click)=\"_onInputClick($event)\">\n\n    <!-- The ripple comes after the input so that we can target it with a CSS\n         sibling selector when the input is focused. -->\n    <span mat-ripple class=\"mat-radio-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n      <span class=\"mat-ripple-element mat-radio-persistent-ripple\"></span>\n    </span>\n  </span>\n\n  <!-- The label content for radio control. -->\n  <span class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;opacity:0;transition:transform ease 280ms,background-color ease 280ms,opacity linear 1ms 280ms;width:20px;transform:scale(0.001);-webkit-print-color-adjust:exact;color-adjust:exact}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5);opacity:1;transition:transform ease 280ms,background-color ease 280ms}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none;top:0;left:0}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{opacity:0;position:absolute;top:0;left:0;margin:0;width:100%;height:100%;cursor:inherit;z-index:-1}.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-ripple,.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-ripple{outline:solid 3px}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"] }]
        }], ctorParameters: function () { return [{ type: MatRadioGroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RADIO_GROUP]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }, { type: i2.UniqueSelectionDispatcher }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RADIO_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8udHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFlLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEcsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkUsT0FBTyxFQUdMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFHTCxrQkFBa0IsRUFDbEIsYUFBYSxHQUVkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBTTNFLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsRUFDM0I7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsaUNBQWlDO0NBQzNDLENBQ0YsQ0FBQztBQUVGLE1BQU0sVUFBVSxpQ0FBaUM7SUFDL0MsT0FBTztRQUNMLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUM7QUFDSixDQUFDO0FBRUQs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QUNiLGdCQUFnQixFQUNoQixRQUFRLENBQ1QsQ0FBQztJQUNKLENBQUM7OzJHQXZCVSxjQUFjLGtCQUVILGVBQWUsNkpBS2YscUJBQXFCLDZCQUVqQyx5QkFBeUIsNkJBRXRCLFVBQVU7K0ZBWFosY0FBYyxzckJDeHBCM0Isb3lEQXlDQTsyRkQrbUJhLGNBQWM7a0JBNUIxQixTQUFTOytCQUNFLGtCQUFrQixVQUdwQixDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsaUJBQ3RCLGlCQUFpQixDQUFDLElBQUksWUFDM0IsZ0JBQWdCLFFBQ3BCO3dCQUNKLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLDJCQUEyQixFQUFFLFNBQVM7d0JBQ3RDLDRCQUE0QixFQUFFLFVBQVU7d0JBQ3hDLGlDQUFpQyxFQUFFLGlCQUFpQjt3QkFDcEQscUJBQXFCLEVBQUUscUJBQXFCO3dCQUM1QyxvQkFBb0IsRUFBRSxvQkFBb0I7d0JBQzFDLGtCQUFrQixFQUFFLGtCQUFrQjt3QkFDdEMscUVBQXFFO3dCQUNyRSxpQkFBaUIsRUFBRSxNQUFNO3dCQUN6QixXQUFXLEVBQUUsSUFBSTt3QkFDakIsbUJBQW1CLEVBQUUsTUFBTTt3QkFDM0Isd0JBQXdCLEVBQUUsTUFBTTt3QkFDaEMseUJBQXlCLEVBQUUsTUFBTTt3QkFDakMsd0ZBQXdGO3dCQUN4Riw0RkFBNEY7d0JBQzVGLG1DQUFtQzt3QkFDbkMsU0FBUyxFQUFFLHFDQUFxQztxQkFDakQsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU07MERBSUksYUFBYTswQkFBN0QsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxlQUFlOzswQkFLbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7OzBCQUN4QyxRQUFROzswQkFDUixNQUFNOzJCQUFDLHlCQUF5Qjs7MEJBRWhDLFNBQVM7MkJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIEhhc1RhYkluZGV4LFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXRSYWRpb0RlZmF1bHRPcHRpb25zIHtcbiAgY29sb3I6IFRoZW1lUGFsZXR0ZTtcbn1cblxuZXhwb3J0IGNvbnN0IE1BVF9SQURJT19ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UmFkaW9EZWZhdWx0T3B0aW9ucz4oXG4gICdtYXQtcmFkaW8tZGVmYXVsdC1vcHRpb25zJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gTUFUX1JBRElPX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFJhZGlvRGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGNvbG9yOiAnYWNjZW50JyxcbiAgfTtcbn1cblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMgZm9yIHJhZGlvIGNvbXBvbmVudHMuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1yYWRpby1ncm91cCB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiBUaGlzXG4gKiBhbGxvd3MgaXQgdG8gc3VwcG9ydCBbKG5nTW9kZWwpXSBhbmQgbmdDb250cm9sLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1JBRElPX0dST1VQX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFJhZGlvR3JvdXApLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0UmFkaW8gYW5kIE1hdFJhZGlvR3JvdXAuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIE1hdFJhZGlvQnV0dG9uIHRoYXQgZW1pdHMgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBfTWF0UmFkaW9CdXR0b25CYXNlLFxuICAgIC8qKiBUaGUgdmFsdWUgb2YgdGhlIE1hdFJhZGlvQnV0dG9uLiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55LFxuICApIHt9XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gaW5qZWN0IGluc3RhbmNlcyBvZiBgTWF0UmFkaW9Hcm91cGAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0UmFkaW9Hcm91cGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUkFESU9fR1JPVVAgPSBuZXcgSW5qZWN0aW9uVG9rZW48X01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+PihcbiAgJ01hdFJhZGlvR3JvdXAnLFxuKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0UmFkaW9Hcm91cGAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFJhZGlvR3JvdXBCYXNlPFQgZXh0ZW5kcyBfTWF0UmFkaW9CdXR0b25CYXNlPlxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG57XG4gIC8qKiBTZWxlY3RlZCB2YWx1ZSBmb3IgdGhlIHJhZGlvIGdyb3VwLiAqL1xuICBwcml2YXRlIF92YWx1ZTogYW55ID0gbnVsbDtcblxuICAvKiogVGhlIEhUTUwgbmFtZSBhdHRyaWJ1dGUgYXBwbGllZCB0byByYWRpbyBidXR0b25zIGluIHRoaXMgZ3JvdXAuICovXG4gIHByaXZhdGUgX25hbWU6IHN0cmluZyA9IGBtYXQtcmFkaW8tZ3JvdXAtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHJhZGlvIGJ1dHRvbi4gU2hvdWxkIG1hdGNoIHZhbHVlLiAqL1xuICBwcml2YXRlIF9zZWxlY3RlZDogVCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBgdmFsdWVgIGhhcyBiZWVuIHNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbHMgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHJhZGlvLWJ1dHRvbnMuIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgcHJpdmF0ZSBfbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgZGlzYWJsZWQuICovXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGdyb3VwIGlzIHJlcXVpcmVkLiAqL1xuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWV0aG9kIHRvIGJlIGNhbGxlZCBpbiBvcmRlciB0byB1cGRhdGUgbmdNb2RlbCAqL1xuICBfY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbjogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogb25Ub3VjaCBmdW5jdGlvbiByZWdpc3RlcmVkIHZpYSByZWdpc3Rlck9uVG91Y2ggKENvbnRyb2xWYWx1ZUFjY2Vzc29yKS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBncm91cCB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBDaGFuZ2UgZXZlbnRzIGFyZSBvbmx5IGVtaXR0ZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcyBkdWUgdG8gdXNlciBpbnRlcmFjdGlvbiB3aXRoXG4gICAqIGEgcmFkaW8gYnV0dG9uICh0aGUgc2FtZSBiZWhhdmlvciBhcyBgPGlucHV0IHR5cGUtXCJyYWRpb1wiPmApLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+KCk7XG5cbiAgLyoqIENoaWxkIHJhZGlvIGJ1dHRvbnMuICovXG4gIGFic3RyYWN0IF9yYWRpb3M6IFF1ZXJ5TGlzdDxUPjtcblxuICAvKiogVGhlbWUgY29sb3IgZm9yIGFsbCBvZiB0aGUgcmFkaW8gYnV0dG9ucyBpbiB0aGUgZ3JvdXAuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIHJhZGlvIGJ1dHRvbiBncm91cC4gQWxsIHJhZGlvIGJ1dHRvbnMgaW5zaWRlIHRoaXMgZ3JvdXAgd2lsbCB1c2UgdGhpcyBuYW1lLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG4gIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlUmFkaW9CdXR0b25OYW1lcygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVscyBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgcmFkaW8tYnV0dG9ucy4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKVxuICBnZXQgbGFiZWxQb3NpdGlvbigpOiAnYmVmb3JlJyB8ICdhZnRlcicge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbFBvc2l0aW9uO1xuICB9XG4gIHNldCBsYWJlbFBvc2l0aW9uKHYpIHtcbiAgICB0aGlzLl9sYWJlbFBvc2l0aW9uID0gdiA9PT0gJ2JlZm9yZScgPyAnYmVmb3JlJyA6ICdhZnRlcic7XG4gICAgdGhpcy5fbWFya1JhZGlvc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVmFsdWUgZm9yIHRoZSByYWRpby1ncm91cC4gU2hvdWxkIGVxdWFsIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgcmFkaW8gYnV0dG9uIGlmIHRoZXJlIGlzXG4gICAqIGEgY29ycmVzcG9uZGluZyByYWRpbyBidXR0b24gd2l0aCBhIG1hdGNoaW5nIHZhbHVlLiBJZiB0aGVyZSBpcyBub3Qgc3VjaCBhIGNvcnJlc3BvbmRpbmdcbiAgICogcmFkaW8gYnV0dG9uLCB0aGlzIHZhbHVlIHBlcnNpc3RzIHRvIGJlIGFwcGxpZWQgaW4gY2FzZSBhIG5ldyByYWRpbyBidXR0b24gaXMgYWRkZWQgd2l0aCBhXG4gICAqIG1hdGNoaW5nIHZhbHVlLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgLy8gU2V0IHRoaXMgYmVmb3JlIHByb2NlZWRpbmcgdG8gZW5zdXJlIG5vIGNpcmN1bGFyIGxvb3Agb2NjdXJzIHdpdGggc2VsZWN0aW9uLlxuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5fdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpO1xuICAgICAgdGhpcy5fY2hlY2tTZWxlY3RlZFJhZGlvQnV0dG9uKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrU2VsZWN0ZWRSYWRpb0J1dHRvbigpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQgJiYgIXRoaXMuX3NlbGVjdGVkLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHJhZGlvIGJ1dHRvbi4gSWYgc2V0IHRvIGEgbmV3IHJhZGlvIGJ1dHRvbiwgdGhlIHJhZGlvIGdyb3VwIHZhbHVlXG4gICAqIHdpbGwgYmUgdXBkYXRlZCB0byBtYXRjaCB0aGUgbmV3IHNlbGVjdGVkIGJ1dHRvbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cbiAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkOiBUIHwgbnVsbCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgdGhpcy52YWx1ZSA9IHNlbGVjdGVkID8gc2VsZWN0ZWQudmFsdWUgOiBudWxsO1xuICAgIHRoaXMuX2NoZWNrU2VsZWN0ZWRSYWRpb0J1dHRvbigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGdyb3VwIGlzIGRpc2FibGVkICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fbWFya1JhZGlvc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgcmVxdWlyZWQgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZDtcbiAgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9tYXJrUmFkaW9zRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwcm9wZXJ0aWVzIG9uY2UgY29udGVudCBjaGlsZHJlbiBhcmUgYXZhaWxhYmxlLlxuICAgKiBUaGlzIGFsbG93cyB1cyB0byBwcm9wYWdhdGUgcmVsZXZhbnQgYXR0cmlidXRlcyB0byBhc3NvY2lhdGVkIGJ1dHRvbnMuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gTWFyayB0aGlzIGNvbXBvbmVudCBhcyBpbml0aWFsaXplZCBpbiBBZnRlckNvbnRlbnRJbml0IGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2FuXG4gICAgLy8gcG9zc2libHkgYmUgc2V0IGJ5IE5nTW9kZWwgb24gTWF0UmFkaW9Hcm91cCwgYW5kIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIE9uSW5pdCBvZiB0aGVcbiAgICAvLyBOZ01vZGVsIG9jY3VycyAqYWZ0ZXIqIHRoZSBPbkluaXQgb2YgdGhlIE1hdFJhZGlvR3JvdXAuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTWFyayB0aGlzIGdyb3VwIGFzIGJlaW5nIFwidG91Y2hlZFwiIChmb3IgbmdNb2RlbCkuIE1lYW50IHRvIGJlIGNhbGxlZCBieSB0aGUgY29udGFpbmVkXG4gICAqIHJhZGlvIGJ1dHRvbnMgdXBvbiB0aGVpciBibHVyLlxuICAgKi9cbiAgX3RvdWNoKCkge1xuICAgIGlmICh0aGlzLm9uVG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSYWRpb0J1dHRvbk5hbWVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9yYWRpb3MpIHtcbiAgICAgIHRoaXMuX3JhZGlvcy5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8ubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgcmFkaW8uX21hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGBzZWxlY3RlZGAgcmFkaW8gYnV0dG9uIGZyb20gdGhlIGludGVybmFsIF92YWx1ZSBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgYWxyZWFkeSBtYXRjaGVzIHRoZSBzZWxlY3RlZCByYWRpbywgZG8gbm90aGluZy5cbiAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkICE9PSBudWxsICYmIHRoaXMuX3NlbGVjdGVkLnZhbHVlID09PSB0aGlzLl92YWx1ZTtcblxuICAgIGlmICh0aGlzLl9yYWRpb3MgJiYgIWlzQWxyZWFkeVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IG51bGw7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmNoZWNrZWQgPSB0aGlzLnZhbHVlID09PSByYWRpby52YWx1ZTtcbiAgICAgICAgaWYgKHJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHJhZGlvO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRSYWRpb0NoYW5nZSh0aGlzLl9zZWxlY3RlZCEsIHRoaXMuX3ZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgX21hcmtSYWRpb3NGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5fcmFkaW9zKSB7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiByYWRpby5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vZGVsIHZhbHVlIGNoYW5nZXMuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG5cbi8qKlxuICogQSBncm91cCBvZiByYWRpbyBidXR0b25zLiBNYXkgY29udGFpbiBvbmUgb3IgbW9yZSBgPG1hdC1yYWRpby1idXR0b24+YCBlbGVtZW50cy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXJhZGlvLWdyb3VwJyxcbiAgZXhwb3J0QXM6ICdtYXRSYWRpb0dyb3VwJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1JBRElPX0dST1VQX0NPTlRST0xfVkFMVUVfQUNDRVNTT1IsXG4gICAge3Byb3ZpZGU6IE1BVF9SQURJT19HUk9VUCwgdXNlRXhpc3Rpbmc6IE1hdFJhZGlvR3JvdXB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAncmFkaW9ncm91cCcsXG4gICAgJ2NsYXNzJzogJ21hdC1yYWRpby1ncm91cCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJhZGlvR3JvdXAgZXh0ZW5kcyBfTWF0UmFkaW9Hcm91cEJhc2U8TWF0UmFkaW9CdXR0b24+IHtcbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE1hdFJhZGlvQnV0dG9uKSwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgX3JhZGlvczogUXVlcnlMaXN0PE1hdFJhZGlvQnV0dG9uPjtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRSYWRpb0J1dHRvbi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5hYnN0cmFjdCBjbGFzcyBNYXRSYWRpb0J1dHRvbkJhc2Uge1xuICAvLyBTaW5jZSB0aGUgZGlzYWJsZWQgcHJvcGVydHkgaXMgbWFudWFsbHkgZGVmaW5lZCBmb3IgdGhlIE1hdFJhZGlvQnV0dG9uIGFuZCBpc24ndCBzZXQgdXAgaW5cbiAgLy8gdGhlIG1peGluIGJhc2UgY2xhc3MuIFRvIGJlIGFibGUgdG8gdXNlIHRoZSB0YWJpbmRleCBtaXhpbiwgYSBkaXNhYmxlZCBwcm9wZXJ0eSBtdXN0IGJlXG4gIC8vIGRlZmluZWQgdG8gcHJvcGVybHkgd29yay5cbiAgYWJzdHJhY3QgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cblxuY29uc3QgX01hdFJhZGlvQnV0dG9uTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluVGFiSW5kZXgoTWF0UmFkaW9CdXR0b25CYXNlKSk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFJhZGlvQnV0dG9uYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0UmFkaW9CdXR0b25CYXNlXG4gIGV4dGVuZHMgX01hdFJhZGlvQnV0dG9uTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGVSaXBwbGUsIEhhc1RhYkluZGV4XG57XG4gIHByaXZhdGUgX3VuaXF1ZUlkOiBzdHJpbmcgPSBgbWF0LXJhZGlvLSR7KytuZXh0VW5pcXVlSWR9YDtcblxuICAvKiogVGhlIHVuaXF1ZSBJRCBmb3IgdGhlIHJhZGlvIGJ1dHRvbi4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IHRoaXMuX3VuaXF1ZUlkO1xuXG4gIC8qKiBBbmFsb2cgdG8gSFRNTCAnbmFtZScgYXR0cmlidXRlIHVzZWQgdG8gZ3JvdXAgcmFkaW9zIGZvciB1bmlxdWUgc2VsZWN0aW9uLiAqL1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqIFVzZWQgdG8gc2V0IHRoZSAnYXJpYS1sYWJlbCcgYXR0cmlidXRlIG9uIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgJ2FyaWEtbGFiZWxsZWRieScgYXR0cmlidXRlIHRha2VzIHByZWNlZGVuY2UgYXMgdGhlIGVsZW1lbnQncyB0ZXh0IGFsdGVybmF0aXZlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSAnYXJpYS1kZXNjcmliZWRieScgYXR0cmlidXRlIGlzIHJlYWQgYWZ0ZXIgdGhlIGVsZW1lbnQncyBsYWJlbCBhbmQgZmllbGQgdHlwZS4gKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyByYWRpbyBidXR0b24gaXMgY2hlY2tlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7XG4gIH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGNvbnN0IG5ld0NoZWNrZWRTdGF0ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX2NoZWNrZWQgIT09IG5ld0NoZWNrZWRTdGF0ZSkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IG5ld0NoZWNrZWRTdGF0ZTtcbiAgICAgIGlmIChuZXdDaGVja2VkU3RhdGUgJiYgdGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC52YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSB0aGlzO1xuICAgICAgfSBlbHNlIGlmICghbmV3Q2hlY2tlZFN0YXRlICYmIHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgLy8gV2hlbiB1bmNoZWNraW5nIHRoZSBzZWxlY3RlZCByYWRpbyBidXR0b24sIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgcmFkaW9cbiAgICAgICAgLy8gcHJvcGVydHkgb24gdGhlIGdyb3VwLlxuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3Q2hlY2tlZFN0YXRlKSB7XG4gICAgICAgIC8vIE5vdGlmeSBhbGwgcmFkaW8gYnV0dG9ucyB3aXRoIHRoZSBzYW1lIG5hbWUgdG8gdW4tY2hlY2suXG4gICAgICAgIHRoaXMuX3JhZGlvRGlzcGF0Y2hlci5ub3RpZnkodGhpcy5pZCwgdGhpcy5uYW1lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhpcyByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5yYWRpb0dyb3VwICE9PSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIGNoZWNrZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlZCB0byBtYXRjaCB0aGUgcmFkaW8gZ3JvdXAncyB2YWx1ZVxuICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMucmFkaW9Hcm91cC52YWx1ZSA9PT0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHJhZGlvIGJ1dHRvbi4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKVxuICBnZXQgbGFiZWxQb3NpdGlvbigpOiAnYmVmb3JlJyB8ICdhZnRlcicge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbFBvc2l0aW9uIHx8ICh0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLmxhYmVsUG9zaXRpb24pIHx8ICdhZnRlcic7XG4gIH1cbiAgc2V0IGxhYmVsUG9zaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9sYWJlbFBvc2l0aW9uID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMucmFkaW9Hcm91cCAhPT0gbnVsbCAmJiB0aGlzLnJhZGlvR3JvdXAuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fc2V0RGlzYWJsZWQoY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gYnV0dG9uIGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkIHx8ICh0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLnJlcXVpcmVkKTtcbiAgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgcmFkaW8gYnV0dG9uLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICAvLyBBcyBwZXIgTWF0ZXJpYWwgZGVzaWduIHNwZWNpZmljYXRpb25zIHRoZSBzZWxlY3Rpb24gY29udHJvbCByYWRpbyBzaG91bGQgdXNlIHRoZSBhY2NlbnQgY29sb3JcbiAgICAvLyBwYWxldHRlIGJ5IGRlZmF1bHQuIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZ3VpZGVsaW5lcy9jb21wb25lbnRzL3NlbGVjdGlvbi1jb250cm9scy5odG1sXG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2NvbG9yIHx8XG4gICAgICAodGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC5jb2xvcikgfHxcbiAgICAgICh0aGlzLl9wcm92aWRlck92ZXJyaWRlICYmIHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGUuY29sb3IpIHx8XG4gICAgICAnYWNjZW50J1xuICAgICk7XG4gIH1cbiAgc2V0IGNvbG9yKG5ld1ZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9jb2xvciA9IG5ld1ZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tlZCBzdGF0ZSBvZiB0aGlzIHJhZGlvIGJ1dHRvbiBjaGFuZ2VzLlxuICAgKiBDaGFuZ2UgZXZlbnRzIGFyZSBvbmx5IGVtaXR0ZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcyBkdWUgdG8gdXNlciBpbnRlcmFjdGlvbiB3aXRoXG4gICAqIHRoZSByYWRpbyBidXR0b24gKHRoZSBzYW1lIGJlaGF2aW9yIGFzIGA8aW5wdXQgdHlwZS1cInJhZGlvXCI+YCkuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRSYWRpb0NoYW5nZT4oKTtcblxuICAvKiogVGhlIHBhcmVudCByYWRpbyBncm91cC4gTWF5IG9yIG1heSBub3QgYmUgcHJlc2VudC4gKi9cbiAgcmFkaW9Hcm91cDogX01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+O1xuXG4gIC8qKiBJRCBvZiB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LXJhZGlvLWJ1dHRvbj5gICovXG4gIGdldCBpbnB1dElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWQgfHwgdGhpcy5fdW5pcXVlSWR9LWlucHV0YDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgY2hlY2tlZC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgZGlzYWJsZWQuICovXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcmFkaW8gaXMgcmVxdWlyZWQuICovXG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBWYWx1ZSBhc3NpZ25lZCB0byB0aGlzIHJhZGlvLiAqL1xuICBwcml2YXRlIF92YWx1ZTogYW55ID0gbnVsbDtcblxuICAvKiogVW5yZWdpc3RlciBmdW5jdGlvbiBmb3IgX3JhZGlvRGlzcGF0Y2hlciAqL1xuICBwcml2YXRlIF9yZW1vdmVVbmlxdWVTZWxlY3Rpb25MaXN0ZW5lcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1yYWRpbz5gIGVsZW1lbnQgKi9cbiAgQFZpZXdDaGlsZCgnaW5wdXQnKSBfaW5wdXRFbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLiAqL1xuICBfbm9vcEFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmFkaW9Hcm91cDogX01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcHJpdmF0ZSBfcmFkaW9EaXNwYXRjaGVyOiBVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyLFxuICAgIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfcHJvdmlkZXJPdmVycmlkZT86IE1hdFJhZGlvRGVmYXVsdE9wdGlvbnMsXG4gICAgdGFiSW5kZXg/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gQXNzZXJ0aW9ucy4gSWRlYWxseSB0aGVzZSBzaG91bGQgYmUgc3RyaXBwZWQgb3V0IGJ5IHRoZSBjb21waWxlci5cbiAgICAvLyBUT0RPKGplbGJvdXJuKTogQXNzZXJ0IHRoYXQgdGhlcmUncyBubyBuYW1lIGJpbmRpbmcgQU5EIGEgcGFyZW50IHJhZGlvIGdyb3VwLlxuICAgIHRoaXMucmFkaW9Hcm91cCA9IHJhZGlvR3JvdXA7XG4gICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgaWYgKHRhYkluZGV4KSB7XG4gICAgICB0aGlzLnRhYkluZGV4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodGFiSW5kZXgsIDApO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyID0gX3JhZGlvRGlzcGF0Y2hlci5saXN0ZW4oKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGlkICE9PSB0aGlzLmlkICYmIG5hbWUgPT09IHRoaXMubmFtZSkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSByYWRpbyBidXR0b24uICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMsIG9yaWdpbj86IEZvY3VzT3JpZ2luKTogdm9pZCB7XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2lucHV0RWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSByYWRpbyBidXR0b24gYXMgbmVlZGluZyBjaGVja2luZyBmb3IgY2hhbmdlIGRldGVjdGlvbi5cbiAgICogVGhpcyBtZXRob2QgaXMgZXhwb3NlZCBiZWNhdXNlIHRoZSBwYXJlbnQgcmFkaW8gZ3JvdXAgd2lsbCBkaXJlY3RseVxuICAgKiB1cGRhdGUgYm91bmQgcHJvcGVydGllcyBvZiB0aGUgcmFkaW8gYnV0dG9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICAvLyBXaGVuIGdyb3VwIHZhbHVlIGNoYW5nZXMsIHRoZSBidXR0b24gd2lsbCBub3QgYmUgbm90aWZpZWQuIFVzZSBgbWFya0ZvckNoZWNrYCB0byBleHBsaWNpdFxuICAgIC8vIHVwZGF0ZSByYWRpbyBidXR0b24ncyBzdGF0dXNcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgIC8vIElmIHRoZSByYWRpbyBpcyBpbnNpZGUgYSByYWRpbyBncm91cCwgZGV0ZXJtaW5lIGlmIGl0IHNob3VsZCBiZSBjaGVja2VkXG4gICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHRoaXMuX3ZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIENvcHkgbmFtZSBmcm9tIHBhcmVudCByYWRpbyBncm91cFxuICAgICAgdGhpcy5uYW1lID0gdGhpcy5yYWRpb0dyb3VwLm5hbWU7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZShmb2N1c09yaWdpbiA9PiB7XG4gICAgICBpZiAoIWZvY3VzT3JpZ2luICYmIHRoaXMucmFkaW9Hcm91cCkge1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuX3RvdWNoKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fcmVtb3ZlVW5pcXVlU2VsZWN0aW9uTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKiBEaXNwYXRjaCBjaGFuZ2UgZXZlbnQgd2l0aCBjdXJyZW50IHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0UmFkaW9DaGFuZ2UodGhpcywgdGhpcy5fdmFsdWUpKTtcbiAgfVxuXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIF9vbklucHV0Q2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgaGF2ZSB0byBzdG9wIHByb3BhZ2F0aW9uIGZvciBjbGljayBldmVudHMgb24gdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQgZWxlbWVudC5cbiAgICAvLyBCeSBkZWZhdWx0LCB3aGVuIGEgdXNlciBjbGlja3Mgb24gYSBsYWJlbCBlbGVtZW50LCBhIGdlbmVyYXRlZCBjbGljayBldmVudCB3aWxsIGJlXG4gICAgLy8gZGlzcGF0Y2hlZCBvbiB0aGUgYXNzb2NpYXRlZCBpbnB1dCBlbGVtZW50LiBTaW5jZSB3ZSBhcmUgdXNpbmcgYSBsYWJlbCBlbGVtZW50IGFzIG91clxuICAgIC8vIHJvb3QgY29udGFpbmVyLCB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGByYWRpby1idXR0b25gIHdpbGwgYmUgZXhlY3V0ZWQgdHdpY2UuXG4gICAgLy8gVGhlIHJlYWwgY2xpY2sgZXZlbnQgd2lsbCBidWJibGUgdXAsIGFuZCB0aGUgZ2VuZXJhdGVkIGNsaWNrIGV2ZW50IGFsc28gdHJpZXMgdG8gYnViYmxlIHVwLlxuICAgIC8vIFRoaXMgd2lsbCBsZWFkIHRvIG11bHRpcGxlIGNsaWNrIGV2ZW50cy5cbiAgICAvLyBQcmV2ZW50aW5nIGJ1YmJsaW5nIGZvciB0aGUgc2Vjb25kIGV2ZW50IHdpbGwgc29sdmUgdGhhdCBpc3N1ZS5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIC8qKiBUcmlnZ2VyZWQgd2hlbiB0aGUgcmFkaW8gYnV0dG9uIHJlY2VpdmVzIGFuIGludGVyYWN0aW9uIGZyb20gdGhlIHVzZXIuICovXG4gIF9vbklucHV0SW50ZXJhY3Rpb24oZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgYWx3YXlzIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBvbiB0aGUgY2hhbmdlIGV2ZW50LlxuICAgIC8vIE90aGVyd2lzZSB0aGUgY2hhbmdlIGV2ZW50LCBmcm9tIHRoZSBpbnB1dCBlbGVtZW50LCB3aWxsIGJ1YmJsZSB1cCBhbmRcbiAgICAvLyBlbWl0IGl0cyBldmVudCBvYmplY3QgdG8gdGhlIGBjaGFuZ2VgIG91dHB1dC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmICghdGhpcy5jaGVja2VkICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBjb25zdCBncm91cFZhbHVlQ2hhbmdlZCA9IHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnZhbHVlICE9PSB0aGlzLnJhZGlvR3JvdXAudmFsdWU7XG4gICAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG5cbiAgICAgIGlmICh0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMudmFsdWUpO1xuICAgICAgICBpZiAoZ3JvdXBWYWx1ZUNoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLnJhZGlvR3JvdXAuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIGFuZCBtYXJrcyBmb3IgY2hlY2sgaWYgYSBjaGFuZ2Ugb2NjdXJyZWQuICovXG4gIHByb3RlY3RlZCBfc2V0RGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQSBNYXRlcmlhbCBkZXNpZ24gcmFkaW8tYnV0dG9uLiBUeXBpY2FsbHkgcGxhY2VkIGluc2lkZSBvZiBgPG1hdC1yYWRpby1ncm91cD5gIGVsZW1lbnRzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcmFkaW8tYnV0dG9uJyxcbiAgdGVtcGxhdGVVcmw6ICdyYWRpby5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3JhZGlvLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdFJhZGlvQnV0dG9uJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcmFkaW8tYnV0dG9uJyxcbiAgICAnW2NsYXNzLm1hdC1yYWRpby1jaGVja2VkXSc6ICdjaGVja2VkJyxcbiAgICAnW2NsYXNzLm1hdC1yYWRpby1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19ub29wQW5pbWF0aW9ucycsXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgPT09IFwicHJpbWFyeVwiJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgIC8vIE5lZWRzIHRvIGJlIHJlbW92ZWQgc2luY2UgaXQgY2F1c2VzIHNvbWUgYTExeSBpc3N1ZXMgKHNlZSAjMjEyNjYpLlxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdudWxsJyxcbiAgICAvLyBOb3RlOiB1bmRlciBub3JtYWwgY29uZGl0aW9ucyBmb2N1cyBzaG91bGRuJ3QgbGFuZCBvbiB0aGlzIGVsZW1lbnQsIGhvd2V2ZXIgaXQgbWF5IGJlXG4gICAgLy8gcHJvZ3JhbW1hdGljYWxseSBzZXQsIGZvciBleGFtcGxlIGluc2lkZSBvZiBhIGZvY3VzIHRyYXAsIGluIHRoaXMgY2FzZSB3ZSB3YW50IHRvIGZvcndhcmRcbiAgICAvLyB0aGUgZm9jdXMgdG8gdGhlIG5hdGl2ZSBlbGVtZW50LlxuICAgICcoZm9jdXMpJzogJ19pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJhZGlvQnV0dG9uIGV4dGVuZHMgX01hdFJhZGlvQnV0dG9uQmFzZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JBRElPX0dST1VQKSByYWRpb0dyb3VwOiBNYXRSYWRpb0dyb3VwLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHJhZGlvRGlzcGF0Y2hlcjogVW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX1JBRElPX0RFRkFVTFRfT1BUSU9OUylcbiAgICBwcm92aWRlck92ZXJyaWRlPzogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4Pzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIHJhZGlvR3JvdXAsXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgY2hhbmdlRGV0ZWN0b3IsXG4gICAgICBmb2N1c01vbml0b3IsXG4gICAgICByYWRpb0Rpc3BhdGNoZXIsXG4gICAgICBhbmltYXRpb25Nb2RlLFxuICAgICAgcHJvdmlkZXJPdmVycmlkZSxcbiAgICAgIHRhYkluZGV4LFxuICAgICk7XG4gIH1cbn1cbiIsIjwhLS0gVE9ETyhqZWxib3Vybik6IHJlbmRlciB0aGUgcmFkaW8gb24gZWl0aGVyIHNpZGUgb2YgdGhlIGNvbnRlbnQgLS0+XG48IS0tIFRPRE8obXRsaW4pOiBFdmFsdWF0ZSB0cmFkZS1vZmZzIG9mIHVzaW5nIG5hdGl2ZSByYWRpbyB2cy4gY29zdCBvZiBhZGRpdGlvbmFsIGJpbmRpbmdzLiAtLT5cbjxsYWJlbCBbYXR0ci5mb3JdPVwiaW5wdXRJZFwiIGNsYXNzPVwibWF0LXJhZGlvLWxhYmVsXCIgI2xhYmVsPlxuICA8IS0tIFRoZSBhY3R1YWwgJ3JhZGlvJyBwYXJ0IG9mIHRoZSBjb250cm9sLiAtLT5cbiAgPHNwYW4gY2xhc3M9XCJtYXQtcmFkaW8tY29udGFpbmVyXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJtYXQtcmFkaW8tb3V0ZXItY2lyY2xlXCI+PC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwibWF0LXJhZGlvLWlubmVyLWNpcmNsZVwiPjwvc3Bhbj5cbiAgICA8aW5wdXQgI2lucHV0IGNsYXNzPVwibWF0LXJhZGlvLWlucHV0XCIgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgW2lkXT1cImlucHV0SWRcIlxuICAgICAgICBbY2hlY2tlZF09XCJjaGVja2VkXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgW3RhYkluZGV4XT1cInRhYkluZGV4XCJcbiAgICAgICAgW2F0dHIubmFtZV09XCJuYW1lXCJcbiAgICAgICAgW2F0dHIudmFsdWVdPVwidmFsdWVcIlxuICAgICAgICBbcmVxdWlyZWRdPVwicmVxdWlyZWRcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieVwiXG4gICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiYXJpYURlc2NyaWJlZGJ5XCJcbiAgICAgICAgKGNoYW5nZSk9XCJfb25JbnB1dEludGVyYWN0aW9uKCRldmVudClcIlxuICAgICAgICAoY2xpY2spPVwiX29uSW5wdXRDbGljaygkZXZlbnQpXCI+XG5cbiAgICA8IS0tIFRoZSByaXBwbGUgY29tZXMgYWZ0ZXIgdGhlIGlucHV0IHNvIHRoYXQgd2UgY2FuIHRhcmdldCBpdCB3aXRoIGEgQ1NTXG4gICAgICAgICBzaWJsaW5nIHNlbGVjdG9yIHdoZW4gdGhlIGlucHV0IGlzIGZvY3VzZWQuIC0tPlxuICAgIDxzcGFuIG1hdC1yaXBwbGUgY2xhc3M9XCJtYXQtcmFkaW8tcmlwcGxlIG1hdC1mb2N1cy1pbmRpY2F0b3JcIlxuICAgICAgICAgW21hdFJpcHBsZVRyaWdnZXJdPVwibGFiZWxcIlxuICAgICAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cIl9pc1JpcHBsZURpc2FibGVkKClcIlxuICAgICAgICAgW21hdFJpcHBsZUNlbnRlcmVkXT1cInRydWVcIlxuICAgICAgICAgW21hdFJpcHBsZVJhZGl1c109XCIyMFwiXG4gICAgICAgICBbbWF0UmlwcGxlQW5pbWF0aW9uXT1cIntlbnRlckR1cmF0aW9uOiBfbm9vcEFuaW1hdGlvbnMgPyAwIDogMTUwfVwiPlxuXG4gICAgICA8c3BhbiBjbGFzcz1cIm1hdC1yaXBwbGUtZWxlbWVudCBtYXQtcmFkaW8tcGVyc2lzdGVudC1yaXBwbGVcIj48L3NwYW4+XG4gICAgPC9zcGFuPlxuICA8L3NwYW4+XG5cbiAgPCEtLSBUaGUgbGFiZWwgY29udGVudCBmb3IgcmFkaW8gY29udHJvbC4gLS0+XG4gIDxzcGFuIGNsYXNzPVwibWF0LXJhZGlvLWxhYmVsLWNvbnRlbnRcIiBbY2xhc3MubWF0LXJhZGlvLWxhYmVsLWJlZm9yZV09XCJsYWJlbFBvc2l0aW9uID09ICdiZWZvcmUnXCI+XG4gICAgPCEtLSBBZGQgYW4gaW52aXNpYmxlIHNwYW4gc28gSkFXUyBjYW4gcmVhZCB0aGUgbGFiZWwgLS0+XG4gICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj4mbmJzcDs8L3NwYW4+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L3NwYW4+XG48L2xhYmVsPlxuIl19