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
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/collections";
import * as i3 from "@angular/material/core";
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
_MatRadioGroupBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatRadioGroupBase, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
_MatRadioGroupBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatRadioGroupBase, inputs: { color: "color", name: "name", labelPosition: "labelPosition", value: "value", selected: "selected", disabled: "disabled", required: "required" }, outputs: { change: "change" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatRadioGroupBase, decorators: [{
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
MatRadioGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatRadioGroup, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatRadioGroup.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatRadioGroup, selector: "mat-radio-group", host: { attributes: { "role": "radiogroup" }, classAttribute: "mat-radio-group" }, providers: [
        MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
        { provide: MAT_RADIO_GROUP, useExisting: MatRadioGroup },
    ], queries: [{ propertyName: "_radios", predicate: MatRadioButton, descendants: true }], exportAs: ["matRadioGroup"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatRadioGroup, decorators: [{
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
        // As per Material design specifications the selection control radio should use the accent color
        // palette by default. https://material.io/guidelines/components/selection-controls.html
        return this._color ||
            (this.radioGroup && this.radioGroup.color) ||
            this._providerOverride && this._providerOverride.color || 'accent';
    }
    set color(newValue) { this._color = newValue; }
    /** ID of the native input element inside `<mat-radio-button>` */
    get inputId() { return `${this.id || this._uniqueId}-input`; }
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
_MatRadioButtonBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatRadioButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatRadioButtonBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatRadioButtonBase, inputs: { id: "id", name: "name", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], checked: "checked", value: "value", labelPosition: "labelPosition", disabled: "disabled", required: "required", color: "color" }, outputs: { change: "change" }, viewQueries: [{ propertyName: "_inputElement", first: true, predicate: ["input"], descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatRadioButtonBase, decorators: [{
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
MatRadioButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatRadioButton, deps: [{ token: MAT_RADIO_GROUP, optional: true }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }, { token: i2.UniqueSelectionDispatcher }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_RADIO_DEFAULT_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component });
MatRadioButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatRadioButton, selector: "mat-radio-button", inputs: { disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { listeners: { "focus": "_inputElement.nativeElement.focus()" }, properties: { "class.mat-radio-checked": "checked", "class.mat-radio-disabled": "disabled", "class._mat-animation-noopable": "_noopAnimations", "class.mat-primary": "color === \"primary\"", "class.mat-accent": "color === \"accent\"", "class.mat-warn": "color === \"warn\"", "attr.tabindex": "null", "attr.id": "id", "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" }, classAttribute: "mat-radio-button" }, exportAs: ["matRadioButton"], usesInheritance: true, ngImport: i0, template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <span class=\"mat-radio-container\">\n    <span class=\"mat-radio-outer-circle\"></span>\n    <span class=\"mat-radio-inner-circle\"></span>\n    <input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputInteraction($event)\"\n        (click)=\"_onInputClick($event)\">\n\n    <!-- The ripple comes after the input so that we can target it with a CSS\n         sibling selector when the input is focused. -->\n    <span mat-ripple class=\"mat-radio-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n      <span class=\"mat-ripple-element mat-radio-persistent-ripple\"></span>\n    </span>\n  </span>\n\n  <!-- The label content for radio control. -->\n  <span class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;opacity:0;transition:transform ease 280ms,background-color ease 280ms,opacity linear 1ms 280ms;width:20px;transform:scale(0.001);-webkit-print-color-adjust:exact;color-adjust:exact}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5);opacity:1;transition:transform ease 280ms,background-color ease 280ms}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none;top:0;left:0}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{bottom:0;left:50%}.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-ripple,.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-ripple{outline:solid 3px}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"], directives: [{ type: i3.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatRadioButton, decorators: [{
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
                    }, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <span class=\"mat-radio-container\">\n    <span class=\"mat-radio-outer-circle\"></span>\n    <span class=\"mat-radio-inner-circle\"></span>\n    <input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputInteraction($event)\"\n        (click)=\"_onInputClick($event)\">\n\n    <!-- The ripple comes after the input so that we can target it with a CSS\n         sibling selector when the input is focused. -->\n    <span mat-ripple class=\"mat-radio-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n      <span class=\"mat-ripple-element mat-radio-persistent-ripple\"></span>\n    </span>\n  </span>\n\n  <!-- The label content for radio control. -->\n  <span class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;display:block;height:20px;left:0;position:absolute;top:0;opacity:0;transition:transform ease 280ms,background-color ease 280ms,opacity linear 1ms 280ms;width:20px;transform:scale(0.001);-webkit-print-color-adjust:exact;color-adjust:exact}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5);opacity:1;transition:transform ease 280ms,background-color ease 280ms}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none;top:0;left:0}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{bottom:0;left:50%}.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-ripple,.cdk-high-contrast-active .mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-ripple{outline:solid 3px}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8udHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcmFkaW8vcmFkaW8uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBR0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUdMLGtCQUFrQixFQUNsQixhQUFhLEdBRWQsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7QUFPM0UsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQ3BDLElBQUksY0FBYyxDQUF5QiwyQkFBMkIsRUFBRTtJQUN4RSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsaUNBQWlDO0NBQzNDLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxpQ0FBaUM7SUFDL0MsT0FBTztRQUNMLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUM7QUFDSixDQUFDO0FB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LFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7O21IQVpVLGNBQWMsa0JBQ08sZUFBZSw2SkFLZixxQkFBcUIsNkJBQ25CLHlCQUF5Qiw2QkFFcEMsVUFBVTt1R0FUdEIsY0FBYyxzckJDL29CM0Isd3pEQXlDQTttR0RzbUJhLGNBQWM7a0JBNUIxQixTQUFTOytCQUNFLGtCQUFrQixVQUdwQixDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsaUJBQ3RCLGlCQUFpQixDQUFDLElBQUksWUFDM0IsZ0JBQWdCLFFBQ3BCO3dCQUNKLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLDJCQUEyQixFQUFFLFNBQVM7d0JBQ3RDLDRCQUE0QixFQUFFLFVBQVU7d0JBQ3hDLGlDQUFpQyxFQUFFLGlCQUFpQjt3QkFDcEQscUJBQXFCLEVBQUUscUJBQXFCO3dCQUM1QyxvQkFBb0IsRUFBRSxvQkFBb0I7d0JBQzFDLGtCQUFrQixFQUFFLGtCQUFrQjt3QkFDdEMscUVBQXFFO3dCQUNyRSxpQkFBaUIsRUFBRSxNQUFNO3dCQUN6QixXQUFXLEVBQUUsSUFBSTt3QkFDakIsbUJBQW1CLEVBQUUsTUFBTTt3QkFDM0Isd0JBQXdCLEVBQUUsTUFBTTt3QkFDaEMseUJBQXlCLEVBQUUsTUFBTTt3QkFDakMsd0ZBQXdGO3dCQUN4Riw0RkFBNEY7d0JBQzVGLG1DQUFtQzt3QkFDbkMsU0FBUyxFQUFFLHFDQUFxQztxQkFDakQsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU07MERBR2MsYUFBYTswQkFBN0QsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxlQUFlOzswQkFLbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7OzBCQUN0QyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHlCQUF5Qjs7MEJBRTlDLFNBQVM7MkJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgSGFzVGFiSW5kZXgsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyB7XG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG59XG5cbmV4cG9ydCBjb25zdCBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdFJhZGlvRGVmYXVsdE9wdGlvbnM+KCdtYXQtcmFkaW8tZGVmYXVsdC1vcHRpb25zJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVF9SQURJT19ERUZBVUxUX09QVElPTlNfRkFDVE9SWVxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUkFESU9fREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgY29sb3I6ICdhY2NlbnQnXG4gIH07XG59XG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzIGZvciByYWRpbyBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtcmFkaW8tZ3JvdXAgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci4gVGhpc1xuICogYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0gYW5kIG5nQ29udHJvbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SQURJT19HUk9VUF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRSYWRpb0dyb3VwKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0UmFkaW8gYW5kIE1hdFJhZGlvR3JvdXAuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIE1hdFJhZGlvQnV0dG9uIHRoYXQgZW1pdHMgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBfTWF0UmFkaW9CdXR0b25CYXNlLFxuICAgIC8qKiBUaGUgdmFsdWUgb2YgdGhlIE1hdFJhZGlvQnV0dG9uLiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55KSB7fVxufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGluamVjdCBpbnN0YW5jZXMgb2YgYE1hdFJhZGlvR3JvdXBgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdFJhZGlvR3JvdXBgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX1JBRElPX0dST1VQID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48X01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+PignTWF0UmFkaW9Hcm91cCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRSYWRpb0dyb3VwYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0UmFkaW9Hcm91cEJhc2U8VCBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbkJhc2U+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKiogU2VsZWN0ZWQgdmFsdWUgZm9yIHRoZSByYWRpbyBncm91cC4gKi9cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueSA9IG51bGw7XG5cbiAgLyoqIFRoZSBIVE1MIG5hbWUgYXR0cmlidXRlIGFwcGxpZWQgdG8gcmFkaW8gYnV0dG9ucyBpbiB0aGlzIGdyb3VwLiAqL1xuICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgPSBgbWF0LXJhZGlvLWdyb3VwLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCByYWRpbyBidXR0b24uIFNob3VsZCBtYXRjaCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IFQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgYHZhbHVlYCBoYXMgYmVlbiBzZXQgdG8gaXRzIGluaXRpYWwgdmFsdWUuICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWxzIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSByYWRpby1idXR0b25zLiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIHByaXZhdGUgX2xhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvIGdyb3VwIGlzIGRpc2FibGVkLiAqL1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyByZXF1aXJlZC4gKi9cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIG1ldGhvZCB0byBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIG5nTW9kZWwgKi9cbiAgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAgdmFsdWUgY2hhbmdlcy5cbiAgICogQ2hhbmdlIGV2ZW50cyBhcmUgb25seSBlbWl0dGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgZHVlIHRvIHVzZXIgaW50ZXJhY3Rpb24gd2l0aFxuICAgKiBhIHJhZGlvIGJ1dHRvbiAodGhlIHNhbWUgYmVoYXZpb3IgYXMgYDxpbnB1dCB0eXBlLVwicmFkaW9cIj5gKS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRSYWRpb0NoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdFJhZGlvQ2hhbmdlPigpO1xuXG4gIC8qKiBDaGlsZCByYWRpbyBidXR0b25zLiAqL1xuICBhYnN0cmFjdCBfcmFkaW9zOiBRdWVyeUxpc3Q8VD47XG5cbiAgLyoqIFRoZW1lIGNvbG9yIGZvciBhbGwgb2YgdGhlIHJhZGlvIGJ1dHRvbnMgaW4gdGhlIGdyb3VwLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSByYWRpbyBidXR0b24gZ3JvdXAuIEFsbCByYWRpbyBidXR0b25zIGluc2lkZSB0aGlzIGdyb3VwIHdpbGwgdXNlIHRoaXMgbmFtZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX25hbWU7IH1cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVSYWRpb0J1dHRvbk5hbWVzKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWxzIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSByYWRpby1idXR0b25zLiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIEBJbnB1dCgpXG4gIGdldCBsYWJlbFBvc2l0aW9uKCk6ICdiZWZvcmUnIHwgJ2FmdGVyJyB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsUG9zaXRpb247XG4gIH1cbiAgc2V0IGxhYmVsUG9zaXRpb24odikge1xuICAgIHRoaXMuX2xhYmVsUG9zaXRpb24gPSB2ID09PSAnYmVmb3JlJyA/ICdiZWZvcmUnIDogJ2FmdGVyJztcbiAgICB0aGlzLl9tYXJrUmFkaW9zRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWx1ZSBmb3IgdGhlIHJhZGlvLWdyb3VwLiBTaG91bGQgZXF1YWwgdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCByYWRpbyBidXR0b24gaWYgdGhlcmUgaXNcbiAgICogYSBjb3JyZXNwb25kaW5nIHJhZGlvIGJ1dHRvbiB3aXRoIGEgbWF0Y2hpbmcgdmFsdWUuIElmIHRoZXJlIGlzIG5vdCBzdWNoIGEgY29ycmVzcG9uZGluZ1xuICAgKiByYWRpbyBidXR0b24sIHRoaXMgdmFsdWUgcGVyc2lzdHMgdG8gYmUgYXBwbGllZCBpbiBjYXNlIGEgbmV3IHJhZGlvIGJ1dHRvbiBpcyBhZGRlZCB3aXRoIGFcbiAgICogbWF0Y2hpbmcgdmFsdWUuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgLy8gU2V0IHRoaXMgYmVmb3JlIHByb2NlZWRpbmcgdG8gZW5zdXJlIG5vIGNpcmN1bGFyIGxvb3Agb2NjdXJzIHdpdGggc2VsZWN0aW9uLlxuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5fdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpO1xuICAgICAgdGhpcy5fY2hlY2tTZWxlY3RlZFJhZGlvQnV0dG9uKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrU2VsZWN0ZWRSYWRpb0J1dHRvbigpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQgJiYgIXRoaXMuX3NlbGVjdGVkLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHJhZGlvIGJ1dHRvbi4gSWYgc2V0IHRvIGEgbmV3IHJhZGlvIGJ1dHRvbiwgdGhlIHJhZGlvIGdyb3VwIHZhbHVlXG4gICAqIHdpbGwgYmUgdXBkYXRlZCB0byBtYXRjaCB0aGUgbmV3IHNlbGVjdGVkIGJ1dHRvbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkOyB9XG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogVCB8IG51bGwpIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMudmFsdWUgPSBzZWxlY3RlZCA/IHNlbGVjdGVkLnZhbHVlIDogbnVsbDtcbiAgICB0aGlzLl9jaGVja1NlbGVjdGVkUmFkaW9CdXR0b24oKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyBkaXNhYmxlZCAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fbWFya1JhZGlvc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gZ3JvdXAgaXMgcmVxdWlyZWQgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX21hcmtSYWRpb3NGb3JDaGVjaygpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwcm9wZXJ0aWVzIG9uY2UgY29udGVudCBjaGlsZHJlbiBhcmUgYXZhaWxhYmxlLlxuICAgKiBUaGlzIGFsbG93cyB1cyB0byBwcm9wYWdhdGUgcmVsZXZhbnQgYXR0cmlidXRlcyB0byBhc3NvY2lhdGVkIGJ1dHRvbnMuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gTWFyayB0aGlzIGNvbXBvbmVudCBhcyBpbml0aWFsaXplZCBpbiBBZnRlckNvbnRlbnRJbml0IGJlY2F1c2UgdGhlIGluaXRpYWwgdmFsdWUgY2FuXG4gICAgLy8gcG9zc2libHkgYmUgc2V0IGJ5IE5nTW9kZWwgb24gTWF0UmFkaW9Hcm91cCwgYW5kIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIE9uSW5pdCBvZiB0aGVcbiAgICAvLyBOZ01vZGVsIG9jY3VycyAqYWZ0ZXIqIHRoZSBPbkluaXQgb2YgdGhlIE1hdFJhZGlvR3JvdXAuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTWFyayB0aGlzIGdyb3VwIGFzIGJlaW5nIFwidG91Y2hlZFwiIChmb3IgbmdNb2RlbCkuIE1lYW50IHRvIGJlIGNhbGxlZCBieSB0aGUgY29udGFpbmVkXG4gICAqIHJhZGlvIGJ1dHRvbnMgdXBvbiB0aGVpciBibHVyLlxuICAgKi9cbiAgX3RvdWNoKCkge1xuICAgIGlmICh0aGlzLm9uVG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSYWRpb0J1dHRvbk5hbWVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9yYWRpb3MpIHtcbiAgICAgIHRoaXMuX3JhZGlvcy5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8ubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgcmFkaW8uX21hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGBzZWxlY3RlZGAgcmFkaW8gYnV0dG9uIGZyb20gdGhlIGludGVybmFsIF92YWx1ZSBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlU2VsZWN0ZWRSYWRpb0Zyb21WYWx1ZSgpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgYWxyZWFkeSBtYXRjaGVzIHRoZSBzZWxlY3RlZCByYWRpbywgZG8gbm90aGluZy5cbiAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkICE9PSBudWxsICYmIHRoaXMuX3NlbGVjdGVkLnZhbHVlID09PSB0aGlzLl92YWx1ZTtcblxuICAgIGlmICh0aGlzLl9yYWRpb3MgJiYgIWlzQWxyZWFkeVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IG51bGw7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmNoZWNrZWQgPSB0aGlzLnZhbHVlID09PSByYWRpby52YWx1ZTtcbiAgICAgICAgaWYgKHJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHJhZGlvO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRSYWRpb0NoYW5nZSh0aGlzLl9zZWxlY3RlZCEsIHRoaXMuX3ZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgX21hcmtSYWRpb3NGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5fcmFkaW9zKSB7XG4gICAgICB0aGlzLl9yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiByYWRpby5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vZGVsIHZhbHVlIGNoYW5nZXMuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xufVxuXG4vKipcbiAqIEEgZ3JvdXAgb2YgcmFkaW8gYnV0dG9ucy4gTWF5IGNvbnRhaW4gb25lIG9yIG1vcmUgYDxtYXQtcmFkaW8tYnV0dG9uPmAgZWxlbWVudHMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1yYWRpby1ncm91cCcsXG4gIGV4cG9ydEFzOiAnbWF0UmFkaW9Hcm91cCcsXG4gIHByb3ZpZGVyczogW1xuICAgIE1BVF9SQURJT19HUk9VUF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHtwcm92aWRlOiBNQVRfUkFESU9fR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRSYWRpb0dyb3VwfSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ3JhZGlvZ3JvdXAnLFxuICAgICdjbGFzcyc6ICdtYXQtcmFkaW8tZ3JvdXAnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0dyb3VwIGV4dGVuZHMgX01hdFJhZGlvR3JvdXBCYXNlPE1hdFJhZGlvQnV0dG9uPiB7XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRSYWRpb0J1dHRvbiksIHtkZXNjZW5kYW50czogdHJ1ZX0pXG4gIF9yYWRpb3M6IFF1ZXJ5TGlzdDxNYXRSYWRpb0J1dHRvbj47XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0UmFkaW9CdXR0b24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuYWJzdHJhY3QgY2xhc3MgTWF0UmFkaW9CdXR0b25CYXNlIHtcbiAgLy8gU2luY2UgdGhlIGRpc2FibGVkIHByb3BlcnR5IGlzIG1hbnVhbGx5IGRlZmluZWQgZm9yIHRoZSBNYXRSYWRpb0J1dHRvbiBhbmQgaXNuJ3Qgc2V0IHVwIGluXG4gIC8vIHRoZSBtaXhpbiBiYXNlIGNsYXNzLiBUbyBiZSBhYmxlIHRvIHVzZSB0aGUgdGFiaW5kZXggbWl4aW4sIGEgZGlzYWJsZWQgcHJvcGVydHkgbXVzdCBiZVxuICAvLyBkZWZpbmVkIHRvIHByb3Blcmx5IHdvcmsuXG4gIGFic3RyYWN0IGRpc2FibGVkOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5cbmNvbnN0IF9NYXRSYWRpb0J1dHRvbk1peGluQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShtaXhpblRhYkluZGV4KE1hdFJhZGlvQnV0dG9uQmFzZSkpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRSYWRpb0J1dHRvbmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFJhZGlvQnV0dG9uQmFzZSBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbk1peGluQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDYW5EaXNhYmxlUmlwcGxlLCBIYXNUYWJJbmRleCB7XG5cbiAgcHJpdmF0ZSBfdW5pcXVlSWQ6IHN0cmluZyA9IGBtYXQtcmFkaW8tJHsrK25leHRVbmlxdWVJZH1gO1xuXG4gIC8qKiBUaGUgdW5pcXVlIElEIGZvciB0aGUgcmFkaW8gYnV0dG9uLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gdGhpcy5fdW5pcXVlSWQ7XG5cbiAgLyoqIEFuYWxvZyB0byBIVE1MICduYW1lJyBhdHRyaWJ1dGUgdXNlZCB0byBncm91cCByYWRpb3MgZm9yIHVuaXF1ZSBzZWxlY3Rpb24uICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAvKiogVXNlZCB0byBzZXQgdGhlICdhcmlhLWxhYmVsJyBhdHRyaWJ1dGUgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSAnYXJpYS1sYWJlbGxlZGJ5JyBhdHRyaWJ1dGUgdGFrZXMgcHJlY2VkZW5jZSBhcyB0aGUgZWxlbWVudCdzIHRleHQgYWx0ZXJuYXRpdmUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogVGhlICdhcmlhLWRlc2NyaWJlZGJ5JyBhdHRyaWJ1dGUgaXMgcmVhZCBhZnRlciB0aGUgZWxlbWVudCdzIGxhYmVsIGFuZCBmaWVsZCB0eXBlLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGlzIHJhZGlvIGJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY2hlY2tlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7IH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdDaGVja2VkU3RhdGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIGlmICh0aGlzLl9jaGVja2VkICE9PSBuZXdDaGVja2VkU3RhdGUpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSBuZXdDaGVja2VkU3RhdGU7XG4gICAgICBpZiAobmV3Q2hlY2tlZFN0YXRlICYmIHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAudmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwLnNlbGVjdGVkID0gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAoIW5ld0NoZWNrZWRTdGF0ZSAmJiB0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLnZhbHVlID09PSB0aGlzLnZhbHVlKSB7XG5cbiAgICAgICAgLy8gV2hlbiB1bmNoZWNraW5nIHRoZSBzZWxlY3RlZCByYWRpbyBidXR0b24sIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgcmFkaW9cbiAgICAgICAgLy8gcHJvcGVydHkgb24gdGhlIGdyb3VwLlxuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3Q2hlY2tlZFN0YXRlKSB7XG4gICAgICAgIC8vIE5vdGlmeSBhbGwgcmFkaW8gYnV0dG9ucyB3aXRoIHRoZSBzYW1lIG5hbWUgdG8gdW4tY2hlY2suXG4gICAgICAgIHRoaXMuX3JhZGlvRGlzcGF0Y2hlci5ub3RpZnkodGhpcy5pZCwgdGhpcy5uYW1lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhpcyByYWRpbyBidXR0b24uICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMucmFkaW9Hcm91cCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgIC8vIFVwZGF0ZSBjaGVja2VkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZWQgdG8gbWF0Y2ggdGhlIHJhZGlvIGdyb3VwJ3MgdmFsdWVcbiAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSByYWRpbyBidXR0b24uIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KClcbiAgZ2V0IGxhYmVsUG9zaXRpb24oKTogJ2JlZm9yZScgfCAnYWZ0ZXInIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxQb3NpdGlvbiB8fCAodGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC5sYWJlbFBvc2l0aW9uKSB8fCAnYWZ0ZXInO1xuICB9XG4gIHNldCBsYWJlbFBvc2l0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fbGFiZWxQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2xhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8gYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLnJhZGlvR3JvdXAgIT09IG51bGwgJiYgdGhpcy5yYWRpb0dyb3VwLmRpc2FibGVkKTtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zZXREaXNhYmxlZChjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpbyBidXR0b24gaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQgfHwgKHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAucmVxdWlyZWQpO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgcmFkaW8gYnV0dG9uLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICAvLyBBcyBwZXIgTWF0ZXJpYWwgZGVzaWduIHNwZWNpZmljYXRpb25zIHRoZSBzZWxlY3Rpb24gY29udHJvbCByYWRpbyBzaG91bGQgdXNlIHRoZSBhY2NlbnQgY29sb3JcbiAgICAvLyBwYWxldHRlIGJ5IGRlZmF1bHQuIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZ3VpZGVsaW5lcy9jb21wb25lbnRzL3NlbGVjdGlvbi1jb250cm9scy5odG1sXG4gICAgcmV0dXJuIHRoaXMuX2NvbG9yIHx8XG4gICAgICAodGhpcy5yYWRpb0dyb3VwICYmIHRoaXMucmFkaW9Hcm91cC5jb2xvcikgfHxcbiAgICAgIHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGUgJiYgdGhpcy5fcHJvdmlkZXJPdmVycmlkZS5jb2xvciB8fCAnYWNjZW50JztcbiAgfVxuICBzZXQgY29sb3IobmV3VmFsdWU6IFRoZW1lUGFsZXR0ZSkgeyB0aGlzLl9jb2xvciA9IG5ld1ZhbHVlOyB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tlZCBzdGF0ZSBvZiB0aGlzIHJhZGlvIGJ1dHRvbiBjaGFuZ2VzLlxuICAgKiBDaGFuZ2UgZXZlbnRzIGFyZSBvbmx5IGVtaXR0ZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcyBkdWUgdG8gdXNlciBpbnRlcmFjdGlvbiB3aXRoXG4gICAqIHRoZSByYWRpbyBidXR0b24gKHRoZSBzYW1lIGJlaGF2aW9yIGFzIGA8aW5wdXQgdHlwZS1cInJhZGlvXCI+YCkuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0UmFkaW9DaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRSYWRpb0NoYW5nZT4oKTtcblxuICAvKiogVGhlIHBhcmVudCByYWRpbyBncm91cC4gTWF5IG9yIG1heSBub3QgYmUgcHJlc2VudC4gKi9cbiAgcmFkaW9Hcm91cDogX01hdFJhZGlvR3JvdXBCYXNlPF9NYXRSYWRpb0J1dHRvbkJhc2U+O1xuXG4gIC8qKiBJRCBvZiB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LXJhZGlvLWJ1dHRvbj5gICovXG4gIGdldCBpbnB1dElkKCk6IHN0cmluZyB7IHJldHVybiBgJHt0aGlzLmlkIHx8IHRoaXMuX3VuaXF1ZUlkfS1pbnB1dGA7IH1cblxuICAvKiogV2hldGhlciB0aGlzIHJhZGlvIGlzIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX2NoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGlzIHJhZGlvIGlzIGRpc2FibGVkLiAqL1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGlzIHJhZGlvIGlzIHJlcXVpcmVkLiAqL1xuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbjtcblxuICAvKiogVmFsdWUgYXNzaWduZWQgdG8gdGhpcyByYWRpby4gKi9cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueSA9IG51bGw7XG5cbiAgLyoqIFVucmVnaXN0ZXIgZnVuY3Rpb24gZm9yIF9yYWRpb0Rpc3BhdGNoZXIgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlVW5pcXVlU2VsZWN0aW9uTGlzdGVuZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9cmFkaW8+YCBlbGVtZW50ICovXG4gIEBWaWV3Q2hpbGQoJ2lucHV0JykgX2lucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGFyZSBkaXNhYmxlZC4gKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHJhZGlvR3JvdXA6IF9NYXRSYWRpb0dyb3VwQmFzZTxfTWF0UmFkaW9CdXR0b25CYXNlPixcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yYWRpb0Rpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICAgICAgICAgICAgIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3Byb3ZpZGVyT3ZlcnJpZGU/OiBNYXRSYWRpb0RlZmF1bHRPcHRpb25zLFxuICAgICAgICAgICAgICB0YWJJbmRleD86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gQXNzZXJ0aW9ucy4gSWRlYWxseSB0aGVzZSBzaG91bGQgYmUgc3RyaXBwZWQgb3V0IGJ5IHRoZSBjb21waWxlci5cbiAgICAvLyBUT0RPKGplbGJvdXJuKTogQXNzZXJ0IHRoYXQgdGhlcmUncyBubyBuYW1lIGJpbmRpbmcgQU5EIGEgcGFyZW50IHJhZGlvIGdyb3VwLlxuICAgIHRoaXMucmFkaW9Hcm91cCA9IHJhZGlvR3JvdXA7XG4gICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgaWYgKHRhYkluZGV4KSB7XG4gICAgICB0aGlzLnRhYkluZGV4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodGFiSW5kZXgsIDApO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyID1cbiAgICAgIF9yYWRpb0Rpc3BhdGNoZXIubGlzdGVuKChpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGlkICE9PSB0aGlzLmlkICYmIG5hbWUgPT09IHRoaXMubmFtZSkge1xuICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSByYWRpbyBidXR0b24uICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMsIG9yaWdpbj86IEZvY3VzT3JpZ2luKTogdm9pZCB7XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2lucHV0RWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSByYWRpbyBidXR0b24gYXMgbmVlZGluZyBjaGVja2luZyBmb3IgY2hhbmdlIGRldGVjdGlvbi5cbiAgICogVGhpcyBtZXRob2QgaXMgZXhwb3NlZCBiZWNhdXNlIHRoZSBwYXJlbnQgcmFkaW8gZ3JvdXAgd2lsbCBkaXJlY3RseVxuICAgKiB1cGRhdGUgYm91bmQgcHJvcGVydGllcyBvZiB0aGUgcmFkaW8gYnV0dG9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICAvLyBXaGVuIGdyb3VwIHZhbHVlIGNoYW5nZXMsIHRoZSBidXR0b24gd2lsbCBub3QgYmUgbm90aWZpZWQuIFVzZSBgbWFya0ZvckNoZWNrYCB0byBleHBsaWNpdFxuICAgIC8vIHVwZGF0ZSByYWRpbyBidXR0b24ncyBzdGF0dXNcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnJhZGlvR3JvdXApIHtcbiAgICAgIC8vIElmIHRoZSByYWRpbyBpcyBpbnNpZGUgYSByYWRpbyBncm91cCwgZGV0ZXJtaW5lIGlmIGl0IHNob3VsZCBiZSBjaGVja2VkXG4gICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnJhZGlvR3JvdXAudmFsdWUgPT09IHRoaXMuX3ZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZCA9IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIENvcHkgbmFtZSBmcm9tIHBhcmVudCByYWRpbyBncm91cFxuICAgICAgdGhpcy5uYW1lID0gdGhpcy5yYWRpb0dyb3VwLm5hbWU7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvclxuICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgICBpZiAoIWZvY3VzT3JpZ2luICYmIHRoaXMucmFkaW9Hcm91cCkge1xuICAgICAgICAgIHRoaXMucmFkaW9Hcm91cC5fdG91Y2goKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fcmVtb3ZlVW5pcXVlU2VsZWN0aW9uTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKiBEaXNwYXRjaCBjaGFuZ2UgZXZlbnQgd2l0aCBjdXJyZW50IHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0UmFkaW9DaGFuZ2UodGhpcywgdGhpcy5fdmFsdWUpKTtcbiAgfVxuXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIF9vbklucHV0Q2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgaGF2ZSB0byBzdG9wIHByb3BhZ2F0aW9uIGZvciBjbGljayBldmVudHMgb24gdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQgZWxlbWVudC5cbiAgICAvLyBCeSBkZWZhdWx0LCB3aGVuIGEgdXNlciBjbGlja3Mgb24gYSBsYWJlbCBlbGVtZW50LCBhIGdlbmVyYXRlZCBjbGljayBldmVudCB3aWxsIGJlXG4gICAgLy8gZGlzcGF0Y2hlZCBvbiB0aGUgYXNzb2NpYXRlZCBpbnB1dCBlbGVtZW50LiBTaW5jZSB3ZSBhcmUgdXNpbmcgYSBsYWJlbCBlbGVtZW50IGFzIG91clxuICAgIC8vIHJvb3QgY29udGFpbmVyLCB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGByYWRpby1idXR0b25gIHdpbGwgYmUgZXhlY3V0ZWQgdHdpY2UuXG4gICAgLy8gVGhlIHJlYWwgY2xpY2sgZXZlbnQgd2lsbCBidWJibGUgdXAsIGFuZCB0aGUgZ2VuZXJhdGVkIGNsaWNrIGV2ZW50IGFsc28gdHJpZXMgdG8gYnViYmxlIHVwLlxuICAgIC8vIFRoaXMgd2lsbCBsZWFkIHRvIG11bHRpcGxlIGNsaWNrIGV2ZW50cy5cbiAgICAvLyBQcmV2ZW50aW5nIGJ1YmJsaW5nIGZvciB0aGUgc2Vjb25kIGV2ZW50IHdpbGwgc29sdmUgdGhhdCBpc3N1ZS5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIC8qKiBUcmlnZ2VyZWQgd2hlbiB0aGUgcmFkaW8gYnV0dG9uIHJlY2VpdmVzIGFuIGludGVyYWN0aW9uIGZyb20gdGhlIHVzZXIuICovXG4gICBfb25JbnB1dEludGVyYWN0aW9uKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGFsd2F5cyBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gb24gdGhlIGNoYW5nZSBldmVudC5cbiAgICAvLyBPdGhlcndpc2UgdGhlIGNoYW5nZSBldmVudCwgZnJvbSB0aGUgaW5wdXQgZWxlbWVudCwgd2lsbCBidWJibGUgdXAgYW5kXG4gICAgLy8gZW1pdCBpdHMgZXZlbnQgb2JqZWN0IHRvIHRoZSBgY2hhbmdlYCBvdXRwdXQuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2tlZCAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgY29uc3QgZ3JvdXBWYWx1ZUNoYW5nZWQgPSB0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy52YWx1ZSAhPT0gdGhpcy5yYWRpb0dyb3VwLnZhbHVlO1xuICAgICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuXG4gICAgICBpZiAodGhpcy5yYWRpb0dyb3VwKSB7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbih0aGlzLnZhbHVlKTtcbiAgICAgICAgaWYgKGdyb3VwVmFsdWVDaGFuZ2VkKSB7XG4gICAgICAgICAgdGhpcy5yYWRpb0dyb3VwLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBhbmQgbWFya3MgZm9yIGNoZWNrIGlmIGEgY2hhbmdlIG9jY3VycmVkLiAqL1xuICBwcm90ZWN0ZWQgX3NldERpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jaGVja2VkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cblxuXG4vKipcbiAqIEEgTWF0ZXJpYWwgZGVzaWduIHJhZGlvLWJ1dHRvbi4gVHlwaWNhbGx5IHBsYWNlZCBpbnNpZGUgb2YgYDxtYXQtcmFkaW8tZ3JvdXA+YCBlbGVtZW50cy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXJhZGlvLWJ1dHRvbicsXG4gIHRlbXBsYXRlVXJsOiAncmFkaW8uaHRtbCcsXG4gIHN0eWxlVXJsczogWydyYWRpby5jc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRSYWRpb0J1dHRvbicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXJhZGlvLWJ1dHRvbicsXG4gICAgJ1tjbGFzcy5tYXQtcmFkaW8tY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtcmFkaW8tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfbm9vcEFuaW1hdGlvbnMnLFxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yID09PSBcInByaW1hcnlcIicsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciA9PT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT09IFwid2FyblwiJyxcbiAgICAvLyBOZWVkcyB0byBiZSByZW1vdmVkIHNpbmNlIGl0IGNhdXNlcyBzb21lIGExMXkgaXNzdWVzIChzZWUgIzIxMjY2KS5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ251bGwnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnbnVsbCcsXG4gICAgLy8gTm90ZTogdW5kZXIgbm9ybWFsIGNvbmRpdGlvbnMgZm9jdXMgc2hvdWxkbid0IGxhbmQgb24gdGhpcyBlbGVtZW50LCBob3dldmVyIGl0IG1heSBiZVxuICAgIC8vIHByb2dyYW1tYXRpY2FsbHkgc2V0LCBmb3IgZXhhbXBsZSBpbnNpZGUgb2YgYSBmb2N1cyB0cmFwLCBpbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBmb3J3YXJkXG4gICAgLy8gdGhlIGZvY3VzIHRvIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICAnKGZvY3VzKSc6ICdfaW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0J1dHRvbiBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SQURJT19HUk9VUCkgcmFkaW9Hcm91cDogTWF0UmFkaW9Hcm91cCxcbiAgICAgICAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcmFkaW9EaXNwYXRjaGVyOiBVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SQURJT19ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgICAgICAgICBwcm92aWRlck92ZXJyaWRlPzogTWF0UmFkaW9EZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleD86IHN0cmluZykge1xuICAgIHN1cGVyKHJhZGlvR3JvdXAsIGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yLCBmb2N1c01vbml0b3IsIHJhZGlvRGlzcGF0Y2hlcixcbiAgICAgICAgICBhbmltYXRpb25Nb2RlLCBwcm92aWRlck92ZXJyaWRlLCB0YWJJbmRleCk7XG4gIH1cbn1cbiIsIjwhLS0gVE9ETyhqZWxib3Vybik6IHJlbmRlciB0aGUgcmFkaW8gb24gZWl0aGVyIHNpZGUgb2YgdGhlIGNvbnRlbnQgLS0+XG48IS0tIFRPRE8obXRsaW4pOiBFdmFsdWF0ZSB0cmFkZS1vZmZzIG9mIHVzaW5nIG5hdGl2ZSByYWRpbyB2cy4gY29zdCBvZiBhZGRpdGlvbmFsIGJpbmRpbmdzLiAtLT5cbjxsYWJlbCBbYXR0ci5mb3JdPVwiaW5wdXRJZFwiIGNsYXNzPVwibWF0LXJhZGlvLWxhYmVsXCIgI2xhYmVsPlxuICA8IS0tIFRoZSBhY3R1YWwgJ3JhZGlvJyBwYXJ0IG9mIHRoZSBjb250cm9sLiAtLT5cbiAgPHNwYW4gY2xhc3M9XCJtYXQtcmFkaW8tY29udGFpbmVyXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJtYXQtcmFkaW8tb3V0ZXItY2lyY2xlXCI+PC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwibWF0LXJhZGlvLWlubmVyLWNpcmNsZVwiPjwvc3Bhbj5cbiAgICA8aW5wdXQgI2lucHV0IGNsYXNzPVwibWF0LXJhZGlvLWlucHV0IGNkay12aXN1YWxseS1oaWRkZW5cIiB0eXBlPVwicmFkaW9cIlxuICAgICAgICBbaWRdPVwiaW5wdXRJZFwiXG4gICAgICAgIFtjaGVja2VkXT1cImNoZWNrZWRcIlxuICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICBbdGFiSW5kZXhdPVwidGFiSW5kZXhcIlxuICAgICAgICBbYXR0ci5uYW1lXT1cIm5hbWVcIlxuICAgICAgICBbYXR0ci52YWx1ZV09XCJ2YWx1ZVwiXG4gICAgICAgIFtyZXF1aXJlZF09XCJyZXF1aXJlZFwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZGJ5XCJcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJhcmlhRGVzY3JpYmVkYnlcIlxuICAgICAgICAoY2hhbmdlKT1cIl9vbklucHV0SW50ZXJhY3Rpb24oJGV2ZW50KVwiXG4gICAgICAgIChjbGljayk9XCJfb25JbnB1dENsaWNrKCRldmVudClcIj5cblxuICAgIDwhLS0gVGhlIHJpcHBsZSBjb21lcyBhZnRlciB0aGUgaW5wdXQgc28gdGhhdCB3ZSBjYW4gdGFyZ2V0IGl0IHdpdGggYSBDU1NcbiAgICAgICAgIHNpYmxpbmcgc2VsZWN0b3Igd2hlbiB0aGUgaW5wdXQgaXMgZm9jdXNlZC4gLS0+XG4gICAgPHNwYW4gbWF0LXJpcHBsZSBjbGFzcz1cIm1hdC1yYWRpby1yaXBwbGUgbWF0LWZvY3VzLWluZGljYXRvclwiXG4gICAgICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJsYWJlbFwiXG4gICAgICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiX2lzUmlwcGxlRGlzYWJsZWQoKVwiXG4gICAgICAgICBbbWF0UmlwcGxlQ2VudGVyZWRdPVwidHJ1ZVwiXG4gICAgICAgICBbbWF0UmlwcGxlUmFkaXVzXT1cIjIwXCJcbiAgICAgICAgIFttYXRSaXBwbGVBbmltYXRpb25dPVwie2VudGVyRHVyYXRpb246IF9ub29wQW5pbWF0aW9ucyA/IDAgOiAxNTB9XCI+XG5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWF0LXJpcHBsZS1lbGVtZW50IG1hdC1yYWRpby1wZXJzaXN0ZW50LXJpcHBsZVwiPjwvc3Bhbj5cbiAgICA8L3NwYW4+XG4gIDwvc3Bhbj5cblxuICA8IS0tIFRoZSBsYWJlbCBjb250ZW50IGZvciByYWRpbyBjb250cm9sLiAtLT5cbiAgPHNwYW4gY2xhc3M9XCJtYXQtcmFkaW8tbGFiZWwtY29udGVudFwiIFtjbGFzcy5tYXQtcmFkaW8tbGFiZWwtYmVmb3JlXT1cImxhYmVsUG9zaXRpb24gPT0gJ2JlZm9yZSdcIj5cbiAgICA8IS0tIEFkZCBhbiBpbnZpc2libGUgc3BhbiBzbyBKQVdTIGNhbiByZWFkIHRoZSBsYWJlbCAtLT5cbiAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPiZuYnNwOzwvc3Bhbj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvc3Bhbj5cbjwvbGFiZWw+XG4iXX0=