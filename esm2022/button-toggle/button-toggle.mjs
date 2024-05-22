/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, SPACE, ENTER } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, InjectionToken, Inject, booleanAttribute, } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRipple, MatPseudoCheckbox } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/cdk/a11y";
/**
 * Injection token that can be used to configure the
 * default options for all button toggles within an app.
 */
export const MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken('MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS', {
    providedIn: 'root',
    factory: MAT_BUTTON_TOGGLE_GROUP_DEFAULT_OPTIONS_FACTORY,
});
export function MAT_BUTTON_TOGGLE_GROUP_DEFAULT_OPTIONS_FACTORY() {
    return {
        hideSingleSelectionIndicator: false,
        hideMultipleSelectionIndicator: false,
    };
}
/**
 * Injection token that can be used to reference instances of `MatButtonToggleGroup`.
 * It serves as alternative token to the actual `MatButtonToggleGroup` class which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const MAT_BUTTON_TOGGLE_GROUP = new InjectionToken('MatButtonToggleGroup');
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatButtonToggleGroup),
    multi: true,
};
// Counter used to generate unique IDs.
let uniqueIdCounter = 0;
/** Change event object emitted by button toggle. */
export class MatButtonToggleChange {
    constructor(
    /** The button toggle that emits the event. */
    source, 
    /** The value assigned to the button toggle. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/** Exclusive selection button toggle group that behaves like a radio-button group. */
export class MatButtonToggleGroup {
    /** `name` attribute for the underlying `input` element. */
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        this._markButtonsForCheck();
    }
    /** Value of the toggle group. */
    get value() {
        const selected = this._selectionModel ? this._selectionModel.selected : [];
        if (this.multiple) {
            return selected.map(toggle => toggle.value);
        }
        return selected[0] ? selected[0].value : undefined;
    }
    set value(newValue) {
        this._setSelectionByValue(newValue);
        this.valueChange.emit(this.value);
    }
    /** Selected button toggles in the group. */
    get selected() {
        const selected = this._selectionModel ? this._selectionModel.selected : [];
        return this.multiple ? selected : selected[0] || null;
    }
    /** Whether multiple button toggles can be selected. */
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = value;
        this._markButtonsForCheck();
    }
    /** Whether multiple button toggle group is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        this._markButtonsForCheck();
    }
    /** The layout direction of the toggle button group. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Whether checkmark indicator for single-selection button toggle groups is hidden. */
    get hideSingleSelectionIndicator() {
        return this._hideSingleSelectionIndicator;
    }
    set hideSingleSelectionIndicator(value) {
        this._hideSingleSelectionIndicator = value;
        this._markButtonsForCheck();
    }
    /** Whether checkmark indicator for multiple-selection button toggle groups is hidden. */
    get hideMultipleSelectionIndicator() {
        return this._hideMultipleSelectionIndicator;
    }
    set hideMultipleSelectionIndicator(value) {
        this._hideMultipleSelectionIndicator = value;
        this._markButtonsForCheck();
    }
    constructor(_changeDetector, defaultOptions, _dir) {
        this._changeDetector = _changeDetector;
        this._dir = _dir;
        this._multiple = false;
        this._disabled = false;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        this._controlValueAccessorChangeFn = () => { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this._onTouched = () => { };
        this._name = `mat-button-toggle-group-${uniqueIdCounter++}`;
        /**
         * Event that emits whenever the value of the group changes.
         * Used to facilitate two-way data binding.
         * @docs-private
         */
        this.valueChange = new EventEmitter();
        /** Event emitted when the group's value changes. */
        this.change = new EventEmitter();
        this.appearance =
            defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
        this.hideSingleSelectionIndicator = defaultOptions?.hideSingleSelectionIndicator ?? false;
        this.hideMultipleSelectionIndicator = defaultOptions?.hideMultipleSelectionIndicator ?? false;
    }
    ngOnInit() {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
    }
    ngAfterContentInit() {
        this._selectionModel.select(...this._buttonToggles.filter(toggle => toggle.checked));
        if (!this.multiple) {
            this._initializeTabIndex();
        }
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    writeValue(value) {
        this.value = value;
        this._changeDetector.markForCheck();
    }
    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** Handle keydown event calling to single-select button toggle. */
    _keydown(event) {
        if (this.multiple || this.disabled) {
            return;
        }
        const target = event.target;
        const buttonId = target.id;
        const index = this._buttonToggles.toArray().findIndex(toggle => {
            return toggle.buttonId === buttonId;
        });
        let nextButton;
        switch (event.keyCode) {
            case SPACE:
            case ENTER:
                nextButton = this._buttonToggles.get(index);
                break;
            case UP_ARROW:
                nextButton = this._buttonToggles.get(this._getNextIndex(index, -1));
                break;
            case LEFT_ARROW:
                nextButton = this._buttonToggles.get(this._getNextIndex(index, this.dir === 'ltr' ? -1 : 1));
                break;
            case DOWN_ARROW:
                nextButton = this._buttonToggles.get(this._getNextIndex(index, 1));
                break;
            case RIGHT_ARROW:
                nextButton = this._buttonToggles.get(this._getNextIndex(index, this.dir === 'ltr' ? 1 : -1));
                break;
            default:
                return;
        }
        event.preventDefault();
        nextButton?._onButtonClick();
        nextButton?.focus();
    }
    /** Dispatch change event with current selection and group value. */
    _emitChangeEvent(toggle) {
        const event = new MatButtonToggleChange(toggle, this.value);
        this._rawValue = event.value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    }
    /**
     * Syncs a button toggle's selected state with the model value.
     * @param toggle Toggle to be synced.
     * @param select Whether the toggle should be selected.
     * @param isUserInput Whether the change was a result of a user interaction.
     * @param deferEvents Whether to defer emitting the change events.
     */
    _syncButtonToggle(toggle, select, isUserInput = false, deferEvents = false) {
        // Deselect the currently-selected toggle, if we're in single-selection
        // mode and the button being toggled isn't selected at the moment.
        if (!this.multiple && this.selected && !toggle.checked) {
            this.selected.checked = false;
        }
        if (this._selectionModel) {
            if (select) {
                this._selectionModel.select(toggle);
            }
            else {
                this._selectionModel.deselect(toggle);
            }
        }
        else {
            deferEvents = true;
        }
        // We need to defer in some cases in order to avoid "changed after checked errors", however
        // the side-effect is that we may end up updating the model value out of sequence in others
        // The `deferEvents` flag allows us to decide whether to do it on a case-by-case basis.
        if (deferEvents) {
            Promise.resolve().then(() => this._updateModelValue(toggle, isUserInput));
        }
        else {
            this._updateModelValue(toggle, isUserInput);
        }
    }
    /** Checks whether a button toggle is selected. */
    _isSelected(toggle) {
        return this._selectionModel && this._selectionModel.isSelected(toggle);
    }
    /** Determines whether a button toggle should be checked on init. */
    _isPrechecked(toggle) {
        if (typeof this._rawValue === 'undefined') {
            return false;
        }
        if (this.multiple && Array.isArray(this._rawValue)) {
            return this._rawValue.some(value => toggle.value != null && value === toggle.value);
        }
        return toggle.value === this._rawValue;
    }
    /** Initializes the tabindex attribute using the radio pattern. */
    _initializeTabIndex() {
        this._buttonToggles.forEach(toggle => {
            toggle.tabIndex = -1;
        });
        if (this.selected) {
            this.selected.tabIndex = 0;
        }
        else if (this._buttonToggles.length > 0) {
            this._buttonToggles.get(0).tabIndex = 0;
        }
        this._markButtonsForCheck();
    }
    /** Obtain the subsequent index to which the focus shifts. */
    _getNextIndex(index, offset) {
        let nextIndex = index + offset;
        if (nextIndex === this._buttonToggles.length) {
            nextIndex = 0;
        }
        if (nextIndex === -1) {
            nextIndex = this._buttonToggles.length - 1;
        }
        return nextIndex;
    }
    /** Updates the selection state of the toggles in the group based on a value. */
    _setSelectionByValue(value) {
        this._rawValue = value;
        if (!this._buttonToggles) {
            return;
        }
        if (this.multiple && value) {
            if (!Array.isArray(value) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Value must be an array in multiple-selection mode.');
            }
            this._clearSelection();
            value.forEach((currentValue) => this._selectValue(currentValue));
        }
        else {
            this._clearSelection();
            this._selectValue(value);
        }
    }
    /** Clears the selected toggles. */
    _clearSelection() {
        this._selectionModel.clear();
        this._buttonToggles.forEach(toggle => {
            toggle.checked = false;
            // If the button toggle is in single select mode, initialize the tabIndex.
            if (!this.multiple) {
                toggle.tabIndex = -1;
            }
        });
    }
    /** Selects a value if there's a toggle that corresponds to it. */
    _selectValue(value) {
        const correspondingOption = this._buttonToggles.find(toggle => {
            return toggle.value != null && toggle.value === value;
        });
        if (correspondingOption) {
            correspondingOption.checked = true;
            this._selectionModel.select(correspondingOption);
            if (!this.multiple) {
                // If the button toggle is in single select mode, reset the tabIndex.
                correspondingOption.tabIndex = 0;
            }
        }
    }
    /** Syncs up the group's value with the model and emits the change event. */
    _updateModelValue(toggle, isUserInput) {
        // Only emit the change event for user input.
        if (isUserInput) {
            this._emitChangeEvent(toggle);
        }
        // Note: we emit this one no matter whether it was a user interaction, because
        // it is used by Angular to sync up the two-way data binding.
        this.valueChange.emit(this.value);
    }
    /** Marks all of the child button toggles to be checked. */
    _markButtonsForCheck() {
        this._buttonToggles?.forEach(toggle => toggle._markForCheck());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatButtonToggleGroup, deps: [{ token: i0.ChangeDetectorRef }, { token: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, optional: true }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.0", type: MatButtonToggleGroup, isStandalone: true, selector: "mat-button-toggle-group", inputs: { appearance: "appearance", name: "name", vertical: ["vertical", "vertical", booleanAttribute], value: "value", multiple: ["multiple", "multiple", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], hideSingleSelectionIndicator: ["hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute], hideMultipleSelectionIndicator: ["hideMultipleSelectionIndicator", "hideMultipleSelectionIndicator", booleanAttribute] }, outputs: { valueChange: "valueChange", change: "change" }, host: { listeners: { "keydown": "_keydown($event)" }, properties: { "attr.role": "multiple ? 'group' : 'radiogroup'", "attr.aria-disabled": "disabled", "class.mat-button-toggle-vertical": "vertical", "class.mat-button-toggle-group-appearance-standard": "appearance === \"standard\"" }, classAttribute: "mat-button-toggle-group" }, providers: [
            MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
            { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
        ], queries: [{ propertyName: "_buttonToggles", predicate: i0.forwardRef(() => MatButtonToggle), descendants: true }], exportAs: ["matButtonToggleGroup"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatButtonToggleGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-button-toggle-group',
                    providers: [
                        MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
                        { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
                    ],
                    host: {
                        'class': 'mat-button-toggle-group',
                        '(keydown)': '_keydown($event)',
                        '[attr.role]': "multiple ? 'group' : 'radiogroup'",
                        '[attr.aria-disabled]': 'disabled',
                        '[class.mat-button-toggle-vertical]': 'vertical',
                        '[class.mat-button-toggle-group-appearance-standard]': 'appearance === "standard"',
                    },
                    exportAs: 'matButtonToggleGroup',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
                }] }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }], propDecorators: { _buttonToggles: [{
                type: ContentChildren,
                args: [forwardRef(() => MatButtonToggle), {
                        // Note that this would technically pick up toggles
                        // from nested groups, but that's not a case that we support.
                        descendants: true,
                    }]
            }], appearance: [{
                type: Input
            }], name: [{
                type: Input
            }], vertical: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], multiple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], change: [{
                type: Output
            }], hideSingleSelectionIndicator: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hideMultipleSelectionIndicator: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
/** Single button inside of a toggle group. */
export class MatButtonToggle {
    /** Unique ID for the underlying `button` element. */
    get buttonId() {
        return `${this.id}-button`;
    }
    /** Tabindex of the toggle. */
    get tabIndex() {
        return this._tabIndex;
    }
    set tabIndex(value) {
        this._tabIndex = value;
        this._markForCheck();
    }
    /** The appearance style of the button. */
    get appearance() {
        return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
    }
    set appearance(value) {
        this._appearance = value;
    }
    /** Whether the button is checked. */
    get checked() {
        return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
    }
    set checked(value) {
        if (value !== this._checked) {
            this._checked = value;
            if (this.buttonToggleGroup) {
                this.buttonToggleGroup._syncButtonToggle(this, this._checked);
            }
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Whether the button is disabled. */
    get disabled() {
        return this._disabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
    }
    set disabled(value) {
        this._disabled = value;
    }
    constructor(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, defaultTabIndex, defaultOptions) {
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this._checked = false;
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        this._disabled = false;
        /** Event emitted when the group value changes. */
        this.change = new EventEmitter();
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
        this.buttonToggleGroup = toggleGroup;
        this.appearance =
            defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
    }
    ngOnInit() {
        const group = this.buttonToggleGroup;
        this.id = this.id || `mat-button-toggle-${uniqueIdCounter++}`;
        if (group) {
            if (group._isPrechecked(this)) {
                this.checked = true;
            }
            else if (group._isSelected(this) !== this._checked) {
                // As side effect of the circular dependency between the toggle group and the button,
                // we may end up in a state where the button is supposed to be checked on init, but it
                // isn't, because the checked value was assigned too early. This can happen when Ivy
                // assigns the static input value before the `ngOnInit` has run.
                group._syncButtonToggle(this, this._checked);
            }
        }
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnDestroy() {
        const group = this.buttonToggleGroup;
        this._focusMonitor.stopMonitoring(this._elementRef);
        // Remove the toggle from the selection once it's destroyed. Needs to happen
        // on the next tick in order to avoid "changed after checked" errors.
        if (group && group._isSelected(this)) {
            group._syncButtonToggle(this, false, false, true);
        }
    }
    /** Focuses the button. */
    focus(options) {
        this._buttonElement.nativeElement.focus(options);
    }
    /** Checks the button toggle due to an interaction with the underlying native button. */
    _onButtonClick() {
        const newChecked = this.isSingleSelector() ? true : !this._checked;
        if (newChecked !== this._checked) {
            this._checked = newChecked;
            if (this.buttonToggleGroup) {
                this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
                this.buttonToggleGroup._onTouched();
            }
        }
        if (this.isSingleSelector()) {
            const focusable = this.buttonToggleGroup._buttonToggles.find(toggle => {
                return toggle.tabIndex === 0;
            });
            // Modify the tabindex attribute of the last focusable button toggle to -1.
            if (focusable) {
                focusable.tabIndex = -1;
            }
            // Modify the tabindex attribute of the presently selected button toggle to 0.
            this.tabIndex = 0;
        }
        // Emit a change event when it's the single selector
        this.change.emit(new MatButtonToggleChange(this, this.value));
    }
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     */
    _markForCheck() {
        // When the group value changes, the button will not be notified.
        // Use `markForCheck` to explicit update button toggle's status.
        this._changeDetectorRef.markForCheck();
    }
    /** Gets the name that should be assigned to the inner DOM node. */
    _getButtonName() {
        if (this.isSingleSelector()) {
            return this.buttonToggleGroup.name;
        }
        return this.name || null;
    }
    /** Whether the toggle is in single selection mode. */
    isSingleSelector() {
        return this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatButtonToggle, deps: [{ token: MAT_BUTTON_TOGGLE_GROUP, optional: true }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i2.FocusMonitor }, { token: 'tabindex', attribute: true }, { token: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.0", type: MatButtonToggle, isStandalone: true, selector: "mat-button-toggle", inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], id: "id", name: "name", value: "value", tabIndex: "tabIndex", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], appearance: "appearance", checked: ["checked", "checked", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { change: "change" }, host: { attributes: { "role": "presentation" }, listeners: { "focus": "focus()" }, properties: { "class.mat-button-toggle-standalone": "!buttonToggleGroup", "class.mat-button-toggle-checked": "checked", "class.mat-button-toggle-disabled": "disabled", "class.mat-button-toggle-appearance-standard": "appearance === \"standard\"", "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.id": "id", "attr.name": "null" }, classAttribute: "mat-button-toggle" }, viewQueries: [{ propertyName: "_buttonElement", first: true, predicate: ["button"], descendants: true }], exportAs: ["matButtonToggle"], ngImport: i0, template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.role]=\"isSingleSelector() ? 'radio' : 'button'\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"!isSingleSelector() ? checked : null\"\n        [attr.aria-checked]=\"isSingleSelector() ? checked : null\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"_getButtonName()\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <span class=\"mat-button-toggle-label-content\">\n    <!-- Render checkmark at the beginning for single-selection. -->\n    @if (buttonToggleGroup && checked && !buttonToggleGroup.multiple && !buttonToggleGroup.hideSingleSelectionIndicator) {\n      <mat-pseudo-checkbox\n          class=\"mat-mdc-option-pseudo-checkbox\"\n          [disabled]=\"disabled\"\n          state=\"checked\"\n          aria-hidden=\"true\"\n          appearance=\"minimal\"></mat-pseudo-checkbox>\n    }\n    <!-- Render checkmark at the beginning for multiple-selection. -->\n    @if (buttonToggleGroup && checked && buttonToggleGroup.multiple && !buttonToggleGroup.hideMultipleSelectionIndicator) {\n      <mat-pseudo-checkbox\n          class=\"mat-mdc-option-pseudo-checkbox\"\n          [disabled]=\"disabled\"\n          state=\"checked\"\n          aria-hidden=\"true\"\n          appearance=\"minimal\"></mat-pseudo-checkbox>\n    }\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</span>\n", styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-standard-button-toggle-selected-state-text-color )}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-label-text-font);font-size:var(--mat-legacy-button-toggle-label-text-size);line-height:var(--mat-legacy-button-toggle-label-text-line-height);font-weight:var(--mat-legacy-button-toggle-label-text-weight);letter-spacing:var(--mat-legacy-button-toggle-label-text-tracking);--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-legacy-button-toggle-selected-state-text-color )}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle .mat-pseudo-checkbox{margin-right:12px}[dir=rtl] .mat-button-toggle .mat-pseudo-checkbox{margin-right:0;margin-left:12px}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color);--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-legacy-button-toggle-disabled-state-text-color )}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-label-text-font);font-size:var(--mat-standard-button-toggle-label-text-size);line-height:var(--mat-standard-button-toggle-label-text-line-height);font-weight:var(--mat-standard-button-toggle-label-text-weight);letter-spacing:var(--mat-standard-button-toggle-label-text-tracking)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-standard-button-toggle-disabled-selected-state-text-color )}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard{--mat-focus-indicator-border-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:last-of-type .mat-button-toggle-button::before{border-top-right-radius:var(--mat-standard-button-toggle-shape);border-bottom-right-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:first-of-type .mat-button-toggle-button::before{border-top-left-radius:var(--mat-standard-button-toggle-shape);border-bottom-left-radius:var(--mat-standard-button-toggle-shape)}"], dependencies: [{ kind: "directive", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "component", type: MatPseudoCheckbox, selector: "mat-pseudo-checkbox", inputs: ["state", "disabled", "appearance"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatButtonToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mat-button-toggle', encapsulation: ViewEncapsulation.None, exportAs: 'matButtonToggle', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.mat-button-toggle-standalone]': '!buttonToggleGroup',
                        '[class.mat-button-toggle-checked]': 'checked',
                        '[class.mat-button-toggle-disabled]': 'disabled',
                        '[class.mat-button-toggle-appearance-standard]': 'appearance === "standard"',
                        'class': 'mat-button-toggle',
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.id]': 'id',
                        '[attr.name]': 'null',
                        '(focus)': 'focus()',
                        'role': 'presentation',
                    }, standalone: true, imports: [MatRipple, MatPseudoCheckbox], template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.role]=\"isSingleSelector() ? 'radio' : 'button'\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"!isSingleSelector() ? checked : null\"\n        [attr.aria-checked]=\"isSingleSelector() ? checked : null\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"_getButtonName()\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <span class=\"mat-button-toggle-label-content\">\n    <!-- Render checkmark at the beginning for single-selection. -->\n    @if (buttonToggleGroup && checked && !buttonToggleGroup.multiple && !buttonToggleGroup.hideSingleSelectionIndicator) {\n      <mat-pseudo-checkbox\n          class=\"mat-mdc-option-pseudo-checkbox\"\n          [disabled]=\"disabled\"\n          state=\"checked\"\n          aria-hidden=\"true\"\n          appearance=\"minimal\"></mat-pseudo-checkbox>\n    }\n    <!-- Render checkmark at the beginning for multiple-selection. -->\n    @if (buttonToggleGroup && checked && buttonToggleGroup.multiple && !buttonToggleGroup.hideMultipleSelectionIndicator) {\n      <mat-pseudo-checkbox\n          class=\"mat-mdc-option-pseudo-checkbox\"\n          [disabled]=\"disabled\"\n          state=\"checked\"\n          aria-hidden=\"true\"\n          appearance=\"minimal\"></mat-pseudo-checkbox>\n    }\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</span>\n", styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-standard-button-toggle-selected-state-text-color )}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-label-text-font);font-size:var(--mat-legacy-button-toggle-label-text-size);line-height:var(--mat-legacy-button-toggle-label-text-line-height);font-weight:var(--mat-legacy-button-toggle-label-text-weight);letter-spacing:var(--mat-legacy-button-toggle-label-text-tracking);--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-legacy-button-toggle-selected-state-text-color )}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle .mat-pseudo-checkbox{margin-right:12px}[dir=rtl] .mat-button-toggle .mat-pseudo-checkbox{margin-right:0;margin-left:12px}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color);--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-legacy-button-toggle-disabled-state-text-color )}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-label-text-font);font-size:var(--mat-standard-button-toggle-label-text-size);line-height:var(--mat-standard-button-toggle-label-text-line-height);font-weight:var(--mat-standard-button-toggle-label-text-weight);letter-spacing:var(--mat-standard-button-toggle-label-text-tracking)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-standard-button-toggle-disabled-selected-state-text-color )}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard{--mat-focus-indicator-border-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:last-of-type .mat-button-toggle-button::before{border-top-right-radius:var(--mat-standard-button-toggle-shape);border-bottom-right-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:first-of-type .mat-button-toggle-button::before{border-top-left-radius:var(--mat-standard-button-toggle-shape);border-bottom-left-radius:var(--mat-standard-button-toggle-shape)}"] }]
        }], ctorParameters: () => [{ type: MatButtonToggleGroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_GROUP]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i2.FocusMonitor }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
                }] }], propDecorators: { ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], _buttonElement: [{
                type: ViewChild,
                args: ['button']
            }], id: [{
                type: Input
            }], name: [{
                type: Input
            }], value: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], appearance: [{
                type: Input
            }], checked: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], change: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24tdG9nZ2xlL2J1dHRvbi10b2dnbGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZS9idXR0b24tdG9nZ2xlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRyxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsY0FBYyxFQUNkLE1BQU0sRUFFTixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFZLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7Ozs7QUEyQnBFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHLElBQUksY0FBYyxDQUNqRSxtQ0FBbUMsRUFDbkM7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsK0NBQStD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QW1CLEVBQUUsTUFBTTt3QkFDM0Isd0JBQXdCLEVBQUUsTUFBTTt3QkFDaEMsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLGFBQWEsRUFBRSxNQUFNO3dCQUNyQixTQUFTLEVBQUUsU0FBUzt3QkFDcEIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCLGNBQ1csSUFBSSxXQUNQLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDOzswQkE0RnBDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsdUJBQXVCOzswQkFJMUMsU0FBUzsyQkFBQyxVQUFVOzswQkFDcEIsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxpQ0FBaUM7eUNBekZ0QixTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBS08sY0FBYztzQkFBdkMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBR0gsY0FBYztzQkFBbEMsU0FBUzt1QkFBQyxRQUFRO2dCQVdWLEVBQUU7c0JBQVYsS0FBSztnQkFHRyxJQUFJO3NCQUFaLEtBQUs7Z0JBR0csS0FBSztzQkFBYixLQUFLO2dCQUlGLFFBQVE7c0JBRFgsS0FBSztnQkFXZ0MsYUFBYTtzQkFBbEQsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFJaEMsVUFBVTtzQkFEYixLQUFLO2dCQVdGLE9BQU87c0JBRFYsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFrQmhDLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFVakIsTUFBTTtzQkFBeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7RE9XTl9BUlJPVywgTEVGVF9BUlJPVywgUklHSFRfQVJST1csIFVQX0FSUk9XLCBTUEFDRSwgRU5URVJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge01hdFJpcHBsZSwgTWF0UHNldWRvQ2hlY2tib3h9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgVG9nZ2xlVHlwZSA9ICdjaGVja2JveCcgfCAncmFkaW8nO1xuXG4vKiogUG9zc2libGUgYXBwZWFyYW5jZSBzdHlsZXMgZm9yIHRoZSBidXR0b24gdG9nZ2xlLiAqL1xuZXhwb3J0IHR5cGUgTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZSA9ICdsZWdhY3knIHwgJ3N0YW5kYXJkJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBidXR0b24gdG9nZ2xlIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWRcbiAqIHVzaW5nIHRoZSBgTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TYCBpbmplY3Rpb24gdG9rZW4uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnMge1xuICAvKipcbiAgICogRGVmYXVsdCBhcHBlYXJhbmNlIHRvIGJlIHVzZWQgYnkgYnV0dG9uIHRvZ2dsZXMuIENhbiBiZSBvdmVycmlkZGVuIGJ5IGV4cGxpY2l0bHlcbiAgICogc2V0dGluZyBhbiBhcHBlYXJhbmNlIG9uIGEgYnV0dG9uIHRvZ2dsZSBvciBncm91cC5cbiAgICovXG4gIGFwcGVhcmFuY2U/OiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlO1xuICAvKiogV2hldGVociBpY29uIGluZGljYXRvcnMgc2hvdWxkIGJlIGhpZGRlbiBmb3Igc2luZ2xlLXNlbGVjdGlvbiBidXR0b24gdG9nZ2xlIGdyb3Vwcy4gKi9cbiAgaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcj86IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIGljb24gaW5kaWNhdG9ycyBzaG91bGQgYmUgaGlkZGVuIGZvciBtdWx0aXBsZS1zZWxlY3Rpb24gYnV0dG9uIHRvZ2dsZSBncm91cHMuICovXG4gIGhpZGVNdWx0aXBsZVNlbGVjdGlvbkluZGljYXRvcj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgYnV0dG9uIHRvZ2dsZXMgd2l0aGluIGFuIGFwcC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucz4oXG4gICdNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMnLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IE1BVF9CVVRUT05fVE9HR0xFX0dST1VQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICB9LFxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIE1BVF9CVVRUT05fVE9HR0xFX0dST1VQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdEJ1dHRvblRvZ2dsZURlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yOiBmYWxzZSxcbiAgICBoaWRlTXVsdGlwbGVTZWxlY3Rpb25JbmRpY2F0b3I6IGZhbHNlLFxuICB9O1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdEJ1dHRvblRvZ2dsZUdyb3VwYC5cbiAqIEl0IHNlcnZlcyBhcyBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRCdXR0b25Ub2dnbGVHcm91cGAgY2xhc3Mgd2hpY2hcbiAqIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5IHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCdXR0b25Ub2dnbGVHcm91cD4oXG4gICdNYXRCdXR0b25Ub2dnbGVHcm91cCcsXG4pO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QnV0dG9uVG9nZ2xlR3JvdXApLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8vIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLlxubGV0IHVuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgYnV0dG9uIHRvZ2dsZS4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGVDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIGJ1dHRvbiB0b2dnbGUgdGhhdCBlbWl0cyB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0QnV0dG9uVG9nZ2xlLFxuXG4gICAgLyoqIFRoZSB2YWx1ZSBhc3NpZ25lZCB0byB0aGUgYnV0dG9uIHRvZ2dsZS4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSxcbiAgKSB7fVxufVxuXG4vKiogRXhjbHVzaXZlIHNlbGVjdGlvbiBidXR0b24gdG9nZ2xlIGdyb3VwIHRoYXQgYmVoYXZlcyBsaWtlIGEgcmFkaW8tYnV0dG9uIGdyb3VwLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAnLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUF9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRCdXR0b25Ub2dnbGVHcm91cH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAnLFxuICAgICcoa2V5ZG93biknOiAnX2tleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLnJvbGVdJzogXCJtdWx0aXBsZSA/ICdncm91cCcgOiAncmFkaW9ncm91cCdcIixcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLWdyb3VwLWFwcGVhcmFuY2Utc3RhbmRhcmRdJzogJ2FwcGVhcmFuY2UgPT09IFwic3RhbmRhcmRcIicsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0QnV0dG9uVG9nZ2xlR3JvdXAnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGVHcm91cCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQge1xuICBwcml2YXRlIF9tdWx0aXBsZSA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0QnV0dG9uVG9nZ2xlPjtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSByYXcgdmFsdWUgdGhhdCB0aGUgY29uc3VtZXIgdHJpZWQgdG8gYXNzaWduLiBUaGUgcmVhbFxuICAgKiB2YWx1ZSB3aWxsIGV4Y2x1ZGUgYW55IHZhbHVlcyBmcm9tIHRoaXMgb25lIHRoYXQgZG9uJ3QgY29ycmVzcG9uZCB0byBhXG4gICAqIHRvZ2dsZS4gVXNlZnVsIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIHZhbHVlIGlzIGFzc2lnbmVkIGJlZm9yZSB0aGUgdG9nZ2xlc1xuICAgKiBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQgb3IgYXQgdGhlIHNhbWUgdGhhdCB0aGV5J3JlIGJlaW5nIHN3YXBwZWQgb3V0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3VmFsdWU6IGFueTtcblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB0byBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIG5nTW9kZWwuXG4gICAqIE5vdyBgbmdNb2RlbGAgYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLlxuICAgKi9cbiAgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuICovXG4gIF9vblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBDaGlsZCBidXR0b24gdG9nZ2xlIGJ1dHRvbnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRCdXR0b25Ub2dnbGUpLCB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgd291bGQgdGVjaG5pY2FsbHkgcGljayB1cCB0b2dnbGVzXG4gICAgLy8gZnJvbSBuZXN0ZWQgZ3JvdXBzLCBidXQgdGhhdCdzIG5vdCBhIGNhc2UgdGhhdCB3ZSBzdXBwb3J0LlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlLFxuICB9KVxuICBfYnV0dG9uVG9nZ2xlczogUXVlcnlMaXN0PE1hdEJ1dHRvblRvZ2dsZT47XG5cbiAgLyoqIFRoZSBhcHBlYXJhbmNlIGZvciBhbGwgdGhlIGJ1dHRvbnMgaW4gdGhlIGdyb3VwLiAqL1xuICBASW5wdXQoKSBhcHBlYXJhbmNlOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlO1xuXG4gIC8qKiBgbmFtZWAgYXR0cmlidXRlIGZvciB0aGUgdW5kZXJseWluZyBgaW5wdXRgIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9tYXJrQnV0dG9uc0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbmFtZSA9IGBtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cC0ke3VuaXF1ZUlkQ291bnRlcisrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBncm91cCBpcyB2ZXJ0aWNhbC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KSB2ZXJ0aWNhbDogYm9vbGVhbjtcblxuICAvKiogVmFsdWUgb2YgdGhlIHRvZ2dsZSBncm91cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogW107XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkLm1hcCh0b2dnbGUgPT4gdG9nZ2xlLnZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRbMF0gPyBzZWxlY3RlZFswXS52YWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUobmV3VmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAgY2hhbmdlcy5cbiAgICogVXNlZCB0byBmYWNpbGl0YXRlIHR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogU2VsZWN0ZWQgYnV0dG9uIHRvZ2dsZXMgaW4gdGhlIGdyb3VwLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0QnV0dG9uVG9nZ2xlIHwgTWF0QnV0dG9uVG9nZ2xlW10ge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IFtdO1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gc2VsZWN0ZWQgOiBzZWxlY3RlZFswXSB8fCBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgbXVsdGlwbGUgYnV0dG9uIHRvZ2dsZXMgY2FuIGJlIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbXVsdGlwbGU7XG4gIH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSB2YWx1ZTtcbiAgICB0aGlzLl9tYXJrQnV0dG9uc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciBtdWx0aXBsZSBidXR0b24gdG9nZ2xlIGdyb3VwIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9tYXJrQnV0dG9uc0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogVGhlIGxheW91dCBkaXJlY3Rpb24gb2YgdGhlIHRvZ2dsZSBidXR0b24gZ3JvdXAuICovXG4gIGdldCBkaXIoKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAncyB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+KCk7XG5cbiAgLyoqIFdoZXRoZXIgY2hlY2ttYXJrIGluZGljYXRvciBmb3Igc2luZ2xlLXNlbGVjdGlvbiBidXR0b24gdG9nZ2xlIGdyb3VwcyBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I7XG4gIH1cbiAgc2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yID0gdmFsdWU7XG4gICAgdGhpcy5fbWFya0J1dHRvbnNGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgY2hlY2ttYXJrIGluZGljYXRvciBmb3IgbXVsdGlwbGUtc2VsZWN0aW9uIGJ1dHRvbiB0b2dnbGUgZ3JvdXBzIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgaGlkZU11bHRpcGxlU2VsZWN0aW9uSW5kaWNhdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlTXVsdGlwbGVTZWxlY3Rpb25JbmRpY2F0b3I7XG4gIH1cbiAgc2V0IGhpZGVNdWx0aXBsZVNlbGVjdGlvbkluZGljYXRvcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVNdWx0aXBsZVNlbGVjdGlvbkluZGljYXRvciA9IHZhbHVlO1xuICAgIHRoaXMuX21hcmtCdXR0b25zRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlTXVsdGlwbGVTZWxlY3Rpb25JbmRpY2F0b3I6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMpXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI/OiBEaXJlY3Rpb25hbGl0eSxcbiAgKSB7XG4gICAgdGhpcy5hcHBlYXJhbmNlID1cbiAgICAgIGRlZmF1bHRPcHRpb25zICYmIGRlZmF1bHRPcHRpb25zLmFwcGVhcmFuY2UgPyBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlIDogJ3N0YW5kYXJkJztcbiAgICB0aGlzLmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPSBkZWZhdWx0T3B0aW9ucz8uaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvciA/PyBmYWxzZTtcbiAgICB0aGlzLmhpZGVNdWx0aXBsZVNlbGVjdGlvbkluZGljYXRvciA9IGRlZmF1bHRPcHRpb25zPy5oaWRlTXVsdGlwbGVTZWxlY3Rpb25JbmRpY2F0b3IgPz8gZmFsc2U7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRCdXR0b25Ub2dnbGU+KHRoaXMubXVsdGlwbGUsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCguLi50aGlzLl9idXR0b25Ub2dnbGVzLmZpbHRlcih0b2dnbGUgPT4gdG9nZ2xlLmNoZWNrZWQpKTtcbiAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVUYWJJbmRleCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGJlIHNldCB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBrZXlkb3duIGV2ZW50IGNhbGxpbmcgdG8gc2luZ2xlLXNlbGVjdCBidXR0b24gdG9nZ2xlLiAqL1xuICBwcm90ZWN0ZWQgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgIGNvbnN0IGJ1dHRvbklkID0gdGFyZ2V0LmlkO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fYnV0dG9uVG9nZ2xlcy50b0FycmF5KCkuZmluZEluZGV4KHRvZ2dsZSA9PiB7XG4gICAgICByZXR1cm4gdG9nZ2xlLmJ1dHRvbklkID09PSBidXR0b25JZDtcbiAgICB9KTtcblxuICAgIGxldCBuZXh0QnV0dG9uO1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIG5leHRCdXR0b24gPSB0aGlzLl9idXR0b25Ub2dnbGVzLmdldChpbmRleCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgbmV4dEJ1dHRvbiA9IHRoaXMuX2J1dHRvblRvZ2dsZXMuZ2V0KHRoaXMuX2dldE5leHRJbmRleChpbmRleCwgLTEpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIG5leHRCdXR0b24gPSB0aGlzLl9idXR0b25Ub2dnbGVzLmdldChcbiAgICAgICAgICB0aGlzLl9nZXROZXh0SW5kZXgoaW5kZXgsIHRoaXMuZGlyID09PSAnbHRyJyA/IC0xIDogMSksXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICBuZXh0QnV0dG9uID0gdGhpcy5fYnV0dG9uVG9nZ2xlcy5nZXQodGhpcy5fZ2V0TmV4dEluZGV4KGluZGV4LCAxKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgbmV4dEJ1dHRvbiA9IHRoaXMuX2J1dHRvblRvZ2dsZXMuZ2V0KFxuICAgICAgICAgIHRoaXMuX2dldE5leHRJbmRleChpbmRleCwgdGhpcy5kaXIgPT09ICdsdHInID8gMSA6IC0xKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBuZXh0QnV0dG9uPy5fb25CdXR0b25DbGljaygpO1xuICAgIG5leHRCdXR0b24/LmZvY3VzKCk7XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0QnV0dG9uVG9nZ2xlQ2hhbmdlKHRvZ2dsZSwgdGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fcmF3VmFsdWUgPSBldmVudC52YWx1ZTtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyBhIGJ1dHRvbiB0b2dnbGUncyBzZWxlY3RlZCBzdGF0ZSB3aXRoIHRoZSBtb2RlbCB2YWx1ZS5cbiAgICogQHBhcmFtIHRvZ2dsZSBUb2dnbGUgdG8gYmUgc3luY2VkLlxuICAgKiBAcGFyYW0gc2VsZWN0IFdoZXRoZXIgdGhlIHRvZ2dsZSBzaG91bGQgYmUgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSBpc1VzZXJJbnB1dCBXaGV0aGVyIHRoZSBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi5cbiAgICogQHBhcmFtIGRlZmVyRXZlbnRzIFdoZXRoZXIgdG8gZGVmZXIgZW1pdHRpbmcgdGhlIGNoYW5nZSBldmVudHMuXG4gICAqL1xuICBfc3luY0J1dHRvblRvZ2dsZShcbiAgICB0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSxcbiAgICBzZWxlY3Q6IGJvb2xlYW4sXG4gICAgaXNVc2VySW5wdXQgPSBmYWxzZSxcbiAgICBkZWZlckV2ZW50cyA9IGZhbHNlLFxuICApIHtcbiAgICAvLyBEZXNlbGVjdCB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHRvZ2dsZSwgaWYgd2UncmUgaW4gc2luZ2xlLXNlbGVjdGlvblxuICAgIC8vIG1vZGUgYW5kIHRoZSBidXR0b24gYmVpbmcgdG9nZ2xlZCBpc24ndCBzZWxlY3RlZCBhdCB0aGUgbW9tZW50LlxuICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnNlbGVjdGVkICYmICF0b2dnbGUuY2hlY2tlZCkge1xuICAgICAgKHRoaXMuc2VsZWN0ZWQgYXMgTWF0QnV0dG9uVG9nZ2xlKS5jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICBpZiAoc2VsZWN0KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCh0b2dnbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3QodG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJFdmVudHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgaW4gc29tZSBjYXNlcyBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvcnNcIiwgaG93ZXZlclxuICAgIC8vIHRoZSBzaWRlLWVmZmVjdCBpcyB0aGF0IHdlIG1heSBlbmQgdXAgdXBkYXRpbmcgdGhlIG1vZGVsIHZhbHVlIG91dCBvZiBzZXF1ZW5jZSBpbiBvdGhlcnNcbiAgICAvLyBUaGUgYGRlZmVyRXZlbnRzYCBmbGFnIGFsbG93cyB1cyB0byBkZWNpZGUgd2hldGhlciB0byBkbyBpdCBvbiBhIGNhc2UtYnktY2FzZSBiYXNpcy5cbiAgICBpZiAoZGVmZXJFdmVudHMpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fdXBkYXRlTW9kZWxWYWx1ZSh0b2dnbGUsIGlzVXNlcklucHV0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU1vZGVsVmFsdWUodG9nZ2xlLCBpc1VzZXJJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGEgYnV0dG9uIHRvZ2dsZSBpcyBzZWxlY3RlZC4gKi9cbiAgX2lzU2VsZWN0ZWQodG9nZ2xlOiBNYXRCdXR0b25Ub2dnbGUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTW9kZWwgJiYgdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZCh0b2dnbGUpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGJ1dHRvbiB0b2dnbGUgc2hvdWxkIGJlIGNoZWNrZWQgb24gaW5pdC4gKi9cbiAgX2lzUHJlY2hlY2tlZCh0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcmF3VmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheSh0aGlzLl9yYXdWYWx1ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yYXdWYWx1ZS5zb21lKHZhbHVlID0+IHRvZ2dsZS52YWx1ZSAhPSBudWxsICYmIHZhbHVlID09PSB0b2dnbGUudmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0b2dnbGUudmFsdWUgPT09IHRoaXMuX3Jhd1ZhbHVlO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgdXNpbmcgdGhlIHJhZGlvIHBhdHRlcm4uICovXG4gIHByaXZhdGUgX2luaXRpYWxpemVUYWJJbmRleCgpIHtcbiAgICB0aGlzLl9idXR0b25Ub2dnbGVzLmZvckVhY2godG9nZ2xlID0+IHtcbiAgICAgIHRvZ2dsZS50YWJJbmRleCA9IC0xO1xuICAgIH0pO1xuICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAodGhpcy5zZWxlY3RlZCBhcyBNYXRCdXR0b25Ub2dnbGUpLnRhYkluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2J1dHRvblRvZ2dsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYnV0dG9uVG9nZ2xlcy5nZXQoMCkhLnRhYkluZGV4ID0gMDtcbiAgICB9XG4gICAgdGhpcy5fbWFya0J1dHRvbnNGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIE9idGFpbiB0aGUgc3Vic2VxdWVudCBpbmRleCB0byB3aGljaCB0aGUgZm9jdXMgc2hpZnRzLiAqL1xuICBwcml2YXRlIF9nZXROZXh0SW5kZXgoaW5kZXg6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGxldCBuZXh0SW5kZXggPSBpbmRleCArIG9mZnNldDtcbiAgICBpZiAobmV4dEluZGV4ID09PSB0aGlzLl9idXR0b25Ub2dnbGVzLmxlbmd0aCkge1xuICAgICAgbmV4dEluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKG5leHRJbmRleCA9PT0gLTEpIHtcbiAgICAgIG5leHRJbmRleCA9IHRoaXMuX2J1dHRvblRvZ2dsZXMubGVuZ3RoIC0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHRJbmRleDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIHRvZ2dsZXMgaW4gdGhlIGdyb3VwIGJhc2VkIG9uIGEgdmFsdWUuICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSB8IGFueVtdKSB7XG4gICAgdGhpcy5fcmF3VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICghdGhpcy5fYnV0dG9uVG9nZ2xlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm11bHRpcGxlICYmIHZhbHVlKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdWYWx1ZSBtdXN0IGJlIGFuIGFycmF5IGluIG11bHRpcGxlLXNlbGVjdGlvbiBtb2RlLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudFZhbHVlOiBhbnkpID0+IHRoaXMuX3NlbGVjdFZhbHVlKGN1cnJlbnRWYWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIHNlbGVjdGVkIHRvZ2dsZXMuICovXG4gIHByaXZhdGUgX2NsZWFyU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG4gICAgdGhpcy5fYnV0dG9uVG9nZ2xlcy5mb3JFYWNoKHRvZ2dsZSA9PiB7XG4gICAgICB0b2dnbGUuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB0b2dnbGUgaXMgaW4gc2luZ2xlIHNlbGVjdCBtb2RlLCBpbml0aWFsaXplIHRoZSB0YWJJbmRleC5cbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0b2dnbGUudGFiSW5kZXggPSAtMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIGEgdmFsdWUgaWYgdGhlcmUncyBhIHRvZ2dsZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGl0LiAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMuX2J1dHRvblRvZ2dsZXMuZmluZCh0b2dnbGUgPT4ge1xuICAgICAgcmV0dXJuIHRvZ2dsZS52YWx1ZSAhPSBudWxsICYmIHRvZ2dsZS52YWx1ZSA9PT0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAvLyBJZiB0aGUgYnV0dG9uIHRvZ2dsZSBpcyBpbiBzaW5nbGUgc2VsZWN0IG1vZGUsIHJlc2V0IHRoZSB0YWJJbmRleC5cbiAgICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi50YWJJbmRleCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFN5bmNzIHVwIHRoZSBncm91cCdzIHZhbHVlIHdpdGggdGhlIG1vZGVsIGFuZCBlbWl0cyB0aGUgY2hhbmdlIGV2ZW50LiAqL1xuICBwcml2YXRlIF91cGRhdGVNb2RlbFZhbHVlKHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlLCBpc1VzZXJJbnB1dDogYm9vbGVhbikge1xuICAgIC8vIE9ubHkgZW1pdCB0aGUgY2hhbmdlIGV2ZW50IGZvciB1c2VyIGlucHV0LlxuICAgIGlmIChpc1VzZXJJbnB1dCkge1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KHRvZ2dsZSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgZW1pdCB0aGlzIG9uZSBubyBtYXR0ZXIgd2hldGhlciBpdCB3YXMgYSB1c2VyIGludGVyYWN0aW9uLCBiZWNhdXNlXG4gICAgLy8gaXQgaXMgdXNlZCBieSBBbmd1bGFyIHRvIHN5bmMgdXAgdGhlIHR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyBhbGwgb2YgdGhlIGNoaWxkIGJ1dHRvbiB0b2dnbGVzIHRvIGJlIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX21hcmtCdXR0b25zRm9yQ2hlY2soKSB7XG4gICAgdGhpcy5fYnV0dG9uVG9nZ2xlcz8uZm9yRWFjaCh0b2dnbGUgPT4gdG9nZ2xlLl9tYXJrRm9yQ2hlY2soKSk7XG4gIH1cbn1cblxuLyoqIFNpbmdsZSBidXR0b24gaW5zaWRlIG9mIGEgdG9nZ2xlIGdyb3VwLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJ2J1dHRvbi10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsOiAnYnV0dG9uLXRvZ2dsZS5jc3MnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdEJ1dHRvblRvZ2dsZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFsb25lXSc6ICchYnV0dG9uVG9nZ2xlR3JvdXAnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnY2xhc3MnOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIubmFtZV0nOiAnbnVsbCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW01hdFJpcHBsZSwgTWF0UHNldWRvQ2hlY2tib3hdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGUgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2NoZWNrZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQXR0YWNoZWQgdG8gdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlIG9mIHRoZSBob3N0IGVsZW1lbnQuIEluIG1vc3QgY2FzZXMsIGFyaWEtbGFiZWxsZWRieSB3aWxsXG4gICAqIHRha2UgcHJlY2VkZW5jZSBzbyB0aGlzIG1heSBiZSBvbWl0dGVkLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSBmb3J3YXJkZWQgdG8gdGhlIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVbmRlcmx5aW5nIG5hdGl2ZSBgYnV0dG9uYCBlbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCdidXR0b24nKSBfYnV0dG9uRWxlbWVudDogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG5cbiAgLyoqIFRoZSBwYXJlbnQgYnV0dG9uIHRvZ2dsZSBncm91cCAoZXhjbHVzaXZlIHNlbGVjdGlvbikuIE9wdGlvbmFsLiAqL1xuICBidXR0b25Ub2dnbGVHcm91cDogTWF0QnV0dG9uVG9nZ2xlR3JvdXA7XG5cbiAgLyoqIFVuaXF1ZSBJRCBmb3IgdGhlIHVuZGVybHlpbmcgYGJ1dHRvbmAgZWxlbWVudC4gKi9cbiAgZ2V0IGJ1dHRvbklkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LWJ1dHRvbmA7XG4gIH1cblxuICAvKiogVGhlIHVuaXF1ZSBJRCBmb3IgdGhpcyBidXR0b24gdG9nZ2xlLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nO1xuXG4gIC8qKiBIVE1MJ3MgJ25hbWUnIGF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIHJhZGlvcyBmb3IgdW5pcXVlIHNlbGVjdGlvbi4gKi9cbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKiBNYXRCdXR0b25Ub2dnbGVHcm91cCByZWFkcyB0aGlzIHRvIGFzc2lnbiBpdHMgb3duIHZhbHVlLiAqL1xuICBASW5wdXQoKSB2YWx1ZTogYW55O1xuXG4gIC8qKiBUYWJpbmRleCBvZiB0aGUgdG9nZ2xlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdGFiSW5kZXgoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3RhYkluZGV4O1xuICB9XG4gIHNldCB0YWJJbmRleCh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMuX3RhYkluZGV4ID0gdmFsdWU7XG4gICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfdGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgb24gdGhlIGJ1dHRvbiB0b2dnbGUuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcblxuICAvKiogVGhlIGFwcGVhcmFuY2Ugc3R5bGUgb2YgdGhlIGJ1dHRvbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFwcGVhcmFuY2UoKTogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZSB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgPyB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLmFwcGVhcmFuY2UgOiB0aGlzLl9hcHBlYXJhbmNlO1xuICB9XG4gIHNldCBhcHBlYXJhbmNlKHZhbHVlOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlKSB7XG4gICAgdGhpcy5fYXBwZWFyYW5jZSA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2FwcGVhcmFuY2U6IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwID8gdGhpcy5idXR0b25Ub2dnbGVHcm91cC5faXNTZWxlY3RlZCh0aGlzKSA6IHRoaXMuX2NoZWNrZWQ7XG4gIH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwICYmIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBncm91cCB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUCkgdG9nZ2xlR3JvdXA6IE1hdEJ1dHRvblRvZ2dsZUdyb3VwLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIGRlZmF1bHRUYWJJbmRleDogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMpXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucyxcbiAgKSB7XG4gICAgY29uc3QgcGFyc2VkVGFiSW5kZXggPSBOdW1iZXIoZGVmYXVsdFRhYkluZGV4KTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VkVGFiSW5kZXggfHwgcGFyc2VkVGFiSW5kZXggPT09IDAgPyBwYXJzZWRUYWJJbmRleCA6IG51bGw7XG4gICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cCA9IHRvZ2dsZUdyb3VwO1xuICAgIHRoaXMuYXBwZWFyYW5jZSA9XG4gICAgICBkZWZhdWx0T3B0aW9ucyAmJiBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlID8gZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA6ICdzdGFuZGFyZCc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXA7XG4gICAgdGhpcy5pZCA9IHRoaXMuaWQgfHwgYG1hdC1idXR0b24tdG9nZ2xlLSR7dW5pcXVlSWRDb3VudGVyKyt9YDtcblxuICAgIGlmIChncm91cCkge1xuICAgICAgaWYgKGdyb3VwLl9pc1ByZWNoZWNrZWQodGhpcykpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXAuX2lzU2VsZWN0ZWQodGhpcykgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgICAgLy8gQXMgc2lkZSBlZmZlY3Qgb2YgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGUgdG9nZ2xlIGdyb3VwIGFuZCB0aGUgYnV0dG9uLFxuICAgICAgICAvLyB3ZSBtYXkgZW5kIHVwIGluIGEgc3RhdGUgd2hlcmUgdGhlIGJ1dHRvbiBpcyBzdXBwb3NlZCB0byBiZSBjaGVja2VkIG9uIGluaXQsIGJ1dCBpdFxuICAgICAgICAvLyBpc24ndCwgYmVjYXVzZSB0aGUgY2hlY2tlZCB2YWx1ZSB3YXMgYXNzaWduZWQgdG9vIGVhcmx5LiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBJdnlcbiAgICAgICAgLy8gYXNzaWducyB0aGUgc3RhdGljIGlucHV0IHZhbHVlIGJlZm9yZSB0aGUgYG5nT25Jbml0YCBoYXMgcnVuLlxuICAgICAgICBncm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXA7XG5cbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBSZW1vdmUgdGhlIHRvZ2dsZSBmcm9tIHRoZSBzZWxlY3Rpb24gb25jZSBpdCdzIGRlc3Ryb3llZC4gTmVlZHMgdG8gaGFwcGVuXG4gICAgLy8gb24gdGhlIG5leHQgdGljayBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICBpZiAoZ3JvdXAgJiYgZ3JvdXAuX2lzU2VsZWN0ZWQodGhpcykpIHtcbiAgICAgIGdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGJ1dHRvbi4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdGhlIGJ1dHRvbiB0b2dnbGUgZHVlIHRvIGFuIGludGVyYWN0aW9uIHdpdGggdGhlIHVuZGVybHlpbmcgbmF0aXZlIGJ1dHRvbi4gKi9cbiAgX29uQnV0dG9uQ2xpY2soKSB7XG4gICAgY29uc3QgbmV3Q2hlY2tlZCA9IHRoaXMuaXNTaW5nbGVTZWxlY3RvcigpID8gdHJ1ZSA6ICF0aGlzLl9jaGVja2VkO1xuXG4gICAgaWYgKG5ld0NoZWNrZWQgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSBuZXdDaGVja2VkO1xuICAgICAgaWYgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkLCB0cnVlKTtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fb25Ub3VjaGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTaW5nbGVTZWxlY3RvcigpKSB7XG4gICAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9idXR0b25Ub2dnbGVzLmZpbmQodG9nZ2xlID0+IHtcbiAgICAgICAgcmV0dXJuIHRvZ2dsZS50YWJJbmRleCA9PT0gMDtcbiAgICAgIH0pO1xuICAgICAgLy8gTW9kaWZ5IHRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgb2YgdGhlIGxhc3QgZm9jdXNhYmxlIGJ1dHRvbiB0b2dnbGUgdG8gLTEuXG4gICAgICBpZiAoZm9jdXNhYmxlKSB7XG4gICAgICAgIGZvY3VzYWJsZS50YWJJbmRleCA9IC0xO1xuICAgICAgfVxuICAgICAgLy8gTW9kaWZ5IHRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgb2YgdGhlIHByZXNlbnRseSBzZWxlY3RlZCBidXR0b24gdG9nZ2xlIHRvIDAuXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcbiAgICB9XG5cbiAgICAvLyBFbWl0IGEgY2hhbmdlIGV2ZW50IHdoZW4gaXQncyB0aGUgc2luZ2xlIHNlbGVjdG9yXG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0QnV0dG9uVG9nZ2xlQ2hhbmdlKHRoaXMsIHRoaXMudmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgYnV0dG9uIHRvZ2dsZSBhcyBuZWVkaW5nIGNoZWNraW5nIGZvciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBleHBvc2VkIGJlY2F1c2UgdGhlIHBhcmVudCBidXR0b24gdG9nZ2xlIGdyb3VwIHdpbGwgZGlyZWN0bHlcbiAgICogdXBkYXRlIGJvdW5kIHByb3BlcnRpZXMgb2YgdGhlIHJhZGlvIGJ1dHRvbi5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKSB7XG4gICAgLy8gV2hlbiB0aGUgZ3JvdXAgdmFsdWUgY2hhbmdlcywgdGhlIGJ1dHRvbiB3aWxsIG5vdCBiZSBub3RpZmllZC5cbiAgICAvLyBVc2UgYG1hcmtGb3JDaGVja2AgdG8gZXhwbGljaXQgdXBkYXRlIGJ1dHRvbiB0b2dnbGUncyBzdGF0dXMuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSB0aGF0IHNob3VsZCBiZSBhc3NpZ25lZCB0byB0aGUgaW5uZXIgRE9NIG5vZGUuICovXG4gIF9nZXRCdXR0b25OYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0b3IoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAubmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmFtZSB8fCBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBpcyBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGUuICovXG4gIGlzU2luZ2xlU2VsZWN0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgJiYgIXRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAubXVsdGlwbGU7XG4gIH1cbn1cbiIsIjxidXR0b24gI2J1dHRvbiBjbGFzcz1cIm1hdC1idXR0b24tdG9nZ2xlLWJ1dHRvbiBtYXQtZm9jdXMtaW5kaWNhdG9yXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIFtpZF09XCJidXR0b25JZFwiXG4gICAgICAgIFthdHRyLnJvbGVdPVwiaXNTaW5nbGVTZWxlY3RvcigpID8gJ3JhZGlvJyA6ICdidXR0b24nXCJcbiAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyAtMSA6IHRhYkluZGV4XCJcbiAgICAgICAgW2F0dHIuYXJpYS1wcmVzc2VkXT1cIiFpc1NpbmdsZVNlbGVjdG9yKCkgPyBjaGVja2VkIDogbnVsbFwiXG4gICAgICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJpc1NpbmdsZVNlbGVjdG9yKCkgPyBjaGVja2VkIDogbnVsbFwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZCB8fCBudWxsXCJcbiAgICAgICAgW2F0dHIubmFtZV09XCJfZ2V0QnV0dG9uTmFtZSgpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkYnlcIlxuICAgICAgICAoY2xpY2spPVwiX29uQnV0dG9uQ2xpY2soKVwiPlxuICA8c3BhbiBjbGFzcz1cIm1hdC1idXR0b24tdG9nZ2xlLWxhYmVsLWNvbnRlbnRcIj5cbiAgICA8IS0tIFJlbmRlciBjaGVja21hcmsgYXQgdGhlIGJlZ2lubmluZyBmb3Igc2luZ2xlLXNlbGVjdGlvbi4gLS0+XG4gICAgQGlmIChidXR0b25Ub2dnbGVHcm91cCAmJiBjaGVja2VkICYmICFidXR0b25Ub2dnbGVHcm91cC5tdWx0aXBsZSAmJiAhYnV0dG9uVG9nZ2xlR3JvdXAuaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcikge1xuICAgICAgPG1hdC1wc2V1ZG8tY2hlY2tib3hcbiAgICAgICAgICBjbGFzcz1cIm1hdC1tZGMtb3B0aW9uLXBzZXVkby1jaGVja2JveFwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICBzdGF0ZT1cImNoZWNrZWRcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgYXBwZWFyYW5jZT1cIm1pbmltYWxcIj48L21hdC1wc2V1ZG8tY2hlY2tib3g+XG4gICAgfVxuICAgIDwhLS0gUmVuZGVyIGNoZWNrbWFyayBhdCB0aGUgYmVnaW5uaW5nIGZvciBtdWx0aXBsZS1zZWxlY3Rpb24uIC0tPlxuICAgIEBpZiAoYnV0dG9uVG9nZ2xlR3JvdXAgJiYgY2hlY2tlZCAmJiBidXR0b25Ub2dnbGVHcm91cC5tdWx0aXBsZSAmJiAhYnV0dG9uVG9nZ2xlR3JvdXAuaGlkZU11bHRpcGxlU2VsZWN0aW9uSW5kaWNhdG9yKSB7XG4gICAgICA8bWF0LXBzZXVkby1jaGVja2JveFxuICAgICAgICAgIGNsYXNzPVwibWF0LW1kYy1vcHRpb24tcHNldWRvLWNoZWNrYm94XCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgIHN0YXRlPVwiY2hlY2tlZFwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICBhcHBlYXJhbmNlPVwibWluaW1hbFwiPjwvbWF0LXBzZXVkby1jaGVja2JveD5cbiAgICB9XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L3NwYW4+XG48L2J1dHRvbj5cblxuPHNwYW4gY2xhc3M9XCJtYXQtYnV0dG9uLXRvZ2dsZS1mb2N1cy1vdmVybGF5XCI+PC9zcGFuPlxuPHNwYW4gY2xhc3M9XCJtYXQtYnV0dG9uLXRvZ2dsZS1yaXBwbGVcIiBtYXRSaXBwbGVcbiAgICAgW21hdFJpcHBsZVRyaWdnZXJdPVwiYnV0dG9uXCJcbiAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cInRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkXCI+XG48L3NwYW4+XG4iXX0=