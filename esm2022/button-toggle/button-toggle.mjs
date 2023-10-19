/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, InjectionToken, Inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
/**
 * Injection token that can be used to configure the
 * default options for all button toggles within an app.
 */
export const MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken('MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS');
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
    /** Whether the toggle group is vertical. */
    get vertical() {
        return this._vertical;
    }
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
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
        this._multiple = coerceBooleanProperty(value);
        this._markButtonsForCheck();
    }
    /** Whether multiple button toggle group is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._markButtonsForCheck();
    }
    constructor(_changeDetector, defaultOptions) {
        this._changeDetector = _changeDetector;
        this._vertical = false;
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
    }
    ngOnInit() {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
    }
    ngAfterContentInit() {
        this._selectionModel.select(...this._buttonToggles.filter(toggle => toggle.checked));
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
        this._buttonToggles.forEach(toggle => (toggle.checked = false));
    }
    /** Selects a value if there's a toggle that corresponds to it. */
    _selectValue(value) {
        const correspondingOption = this._buttonToggles.find(toggle => {
            return toggle.value != null && toggle.value === value;
        });
        if (correspondingOption) {
            correspondingOption.checked = true;
            this._selectionModel.select(correspondingOption);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonToggleGroup, deps: [{ token: i0.ChangeDetectorRef }, { token: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatButtonToggleGroup, selector: "mat-button-toggle-group", inputs: { appearance: "appearance", name: "name", vertical: "vertical", value: "value", multiple: "multiple", disabled: "disabled" }, outputs: { valueChange: "valueChange", change: "change" }, host: { attributes: { "role": "group" }, properties: { "attr.aria-disabled": "disabled", "class.mat-button-toggle-vertical": "vertical", "class.mat-button-toggle-group-appearance-standard": "appearance === \"standard\"" }, classAttribute: "mat-button-toggle-group" }, providers: [
            MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
            { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
        ], queries: [{ propertyName: "_buttonToggles", predicate: i0.forwardRef(function () { return MatButtonToggle; }), descendants: true }], exportAs: ["matButtonToggleGroup"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonToggleGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-button-toggle-group',
                    providers: [
                        MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
                        { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
                    ],
                    host: {
                        'role': 'group',
                        'class': 'mat-button-toggle-group',
                        '[attr.aria-disabled]': 'disabled',
                        '[class.mat-button-toggle-vertical]': 'vertical',
                        '[class.mat-button-toggle-group-appearance-standard]': 'appearance === "standard"',
                    },
                    exportAs: 'matButtonToggleGroup',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { _buttonToggles: [{
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
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], multiple: [{
                type: Input
            }], disabled: [{
                type: Input
            }], change: [{
                type: Output
            }] } });
// Boilerplate for applying mixins to the MatButtonToggle class.
/** @docs-private */
const _MatButtonToggleBase = mixinDisableRipple(class {
});
/** Single button inside of a toggle group. */
export class MatButtonToggle extends _MatButtonToggleBase {
    /** Unique ID for the underlying `button` element. */
    get buttonId() {
        return `${this.id}-button`;
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
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._checked) {
            this._checked = newValue;
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
        this._disabled = coerceBooleanProperty(value);
    }
    constructor(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, defaultTabIndex, defaultOptions) {
        super();
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
        const newChecked = this._isSingleSelector() ? true : !this._checked;
        if (newChecked !== this._checked) {
            this._checked = newChecked;
            if (this.buttonToggleGroup) {
                this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
                this.buttonToggleGroup._onTouched();
            }
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
        if (this._isSingleSelector()) {
            return this.buttonToggleGroup.name;
        }
        return this.name || null;
    }
    /** Whether the toggle is in single selection mode. */
    _isSingleSelector() {
        return this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonToggle, deps: [{ token: MAT_BUTTON_TOGGLE_GROUP, optional: true }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: 'tabindex', attribute: true }, { token: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatButtonToggle, selector: "mat-button-toggle", inputs: { disableRipple: "disableRipple", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], id: "id", name: "name", value: "value", tabIndex: "tabIndex", appearance: "appearance", checked: "checked", disabled: "disabled" }, outputs: { change: "change" }, host: { attributes: { "role": "presentation" }, listeners: { "focus": "focus()" }, properties: { "class.mat-button-toggle-standalone": "!buttonToggleGroup", "class.mat-button-toggle-checked": "checked", "class.mat-button-toggle-disabled": "disabled", "class.mat-button-toggle-appearance-standard": "appearance === \"standard\"", "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.id": "id", "attr.name": "null" }, classAttribute: "mat-button-toggle" }, viewQueries: [{ propertyName: "_buttonElement", first: true, predicate: ["button"], descendants: true }], exportAs: ["matButtonToggle"], usesInheritance: true, ngImport: i0, template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"_getButtonName()\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <span class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</span>\n", styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{--mat-legacy-button-toggle-height:36px;--mat-legacy-button-toggle-shape:2px;--mat-legacy-button-toggle-focus-state-layer-opacity:1;position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{--mat-standard-button-toggle-shape:4px;--mat-standard-button-toggle-hover-state-layer-opacity:0.04;--mat-standard-button-toggle-focus-state-layer-opacity:0.12;border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-text-font)}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color)}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{--mat-standard-button-toggle-shape:4px;--mat-standard-button-toggle-hover-state-layer-opacity:0.04;--mat-standard-button-toggle-focus-state-layer-opacity:0.12;color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-text-font)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}"], dependencies: [{ kind: "directive", type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mat-button-toggle', encapsulation: ViewEncapsulation.None, exportAs: 'matButtonToggle', changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disableRipple'], host: {
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
                    }, template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"_getButtonName()\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <span class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</span>\n", styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{--mat-legacy-button-toggle-height:36px;--mat-legacy-button-toggle-shape:2px;--mat-legacy-button-toggle-focus-state-layer-opacity:1;position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{--mat-standard-button-toggle-shape:4px;--mat-standard-button-toggle-hover-state-layer-opacity:0.04;--mat-standard-button-toggle-focus-state-layer-opacity:0.12;border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-text-font)}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color)}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{--mat-standard-button-toggle-shape:4px;--mat-standard-button-toggle-hover-state-layer-opacity:0.04;--mat-standard-button-toggle-focus-state-layer-opacity:0.12;color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-text-font)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}"] }]
        }], ctorParameters: function () { return [{ type: MatButtonToggleGroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_GROUP]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { ariaLabel: [{
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
            }], appearance: [{
                type: Input
            }], checked: [{
                type: Input
            }], disabled: [{
                type: Input
            }], change: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24tdG9nZ2xlL2J1dHRvbi10b2dnbGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZS9idXR0b24tdG9nZ2xlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsY0FBYyxFQUNkLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUFtQixrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7O0FBdUI1RTs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQ0FBaUMsR0FBRyxJQUFJLGNBQWMsQ0FDakUsbUNBQW1DLENBQ3BDLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxjQUFjLENBQ3ZELHNCQUFzQixDQUN2QixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNDQUFzQyxHQUFRO0lBQ3pELE9BQU8sRUFBRSxpQkFBaUI7SUFD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QUs7c0JBQWIsS0FBSztnQkFHRyxRQUFRO3NCQUFoQixLQUFLO2dCQUlGLFVBQVU7c0JBRGIsS0FBSztnQkFXRixPQUFPO3NCQURWLEtBQUs7Z0JBb0JGLFFBQVE7c0JBRFgsS0FBSztnQkFVYSxNQUFNO3NCQUF4QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0NhbkRpc2FibGVSaXBwbGUsIG1peGluRGlzYWJsZVJpcHBsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMFxuICovXG5leHBvcnQgdHlwZSBUb2dnbGVUeXBlID0gJ2NoZWNrYm94JyB8ICdyYWRpbyc7XG5cbi8qKiBQb3NzaWJsZSBhcHBlYXJhbmNlIHN0eWxlcyBmb3IgdGhlIGJ1dHRvbiB0b2dnbGUuICovXG5leHBvcnQgdHlwZSBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlID0gJ2xlZ2FjeScgfCAnc3RhbmRhcmQnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIGJ1dHRvbiB0b2dnbGUgdGhhdCBjYW4gYmUgY29uZmlndXJlZFxuICogdXNpbmcgdGhlIGBNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBEZWZhdWx0IGFwcGVhcmFuY2UgdG8gYmUgdXNlZCBieSBidXR0b24gdG9nZ2xlcy4gQ2FuIGJlIG92ZXJyaWRkZW4gYnkgZXhwbGljaXRseVxuICAgKiBzZXR0aW5nIGFuIGFwcGVhcmFuY2Ugb24gYSBidXR0b24gdG9nZ2xlIG9yIGdyb3VwLlxuICAgKi9cbiAgYXBwZWFyYW5jZT86IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgYnV0dG9uIHRvZ2dsZXMgd2l0aGluIGFuIGFwcC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucz4oXG4gICdNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMnLFxuKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRCdXR0b25Ub2dnbGVHcm91cGAuXG4gKiBJdCBzZXJ2ZXMgYXMgYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0QnV0dG9uVG9nZ2xlR3JvdXBgIGNsYXNzIHdoaWNoXG4gKiBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeSByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVAgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0QnV0dG9uVG9nZ2xlR3JvdXA+KFxuICAnTWF0QnV0dG9uVG9nZ2xlR3JvdXAnLFxuKTtcblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1idXR0b24tdG9nZ2xlLWdyb3VwIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBUaGlzIGFsbG93cyBpdCB0byBzdXBwb3J0IFsobmdNb2RlbCldLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVBfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdEJ1dHRvblRvZ2dsZUdyb3VwKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vLyBDb3VudGVyIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcy5cbmxldCB1bmlxdWVJZENvdW50ZXIgPSAwO1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IGJ1dHRvbiB0b2dnbGUuICovXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBidXR0b24gdG9nZ2xlIHRoYXQgZW1pdHMgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdEJ1dHRvblRvZ2dsZSxcblxuICAgIC8qKiBUaGUgdmFsdWUgYXNzaWduZWQgdG8gdGhlIGJ1dHRvbiB0b2dnbGUuICovXG4gICAgcHVibGljIHZhbHVlOiBhbnksXG4gICkge31cbn1cblxuLyoqIEV4Y2x1c2l2ZSBzZWxlY3Rpb24gYnV0dG9uIHRvZ2dsZSBncm91cCB0aGF0IGJlaGF2ZXMgbGlrZSBhIHJhZGlvLWJ1dHRvbiBncm91cC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1idXR0b24tdG9nZ2xlLWdyb3VwJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVBfVkFMVUVfQUNDRVNTT1IsXG4gICAge3Byb3ZpZGU6IE1BVF9CVVRUT05fVE9HR0xFX0dST1VQLCB1c2VFeGlzdGluZzogTWF0QnV0dG9uVG9nZ2xlR3JvdXB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnZ3JvdXAnLFxuICAgICdjbGFzcyc6ICdtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1ncm91cC1hcHBlYXJhbmNlLXN0YW5kYXJkXSc6ICdhcHBlYXJhbmNlID09PSBcInN0YW5kYXJkXCInLFxuICB9LFxuICBleHBvcnRBczogJ21hdEJ1dHRvblRvZ2dsZUdyb3VwJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlR3JvdXAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0IHtcbiAgcHJpdmF0ZSBfdmVydGljYWwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbXVsdGlwbGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uTW9kZWw6IFNlbGVjdGlvbk1vZGVsPE1hdEJ1dHRvblRvZ2dsZT47XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgcmF3IHZhbHVlIHRoYXQgdGhlIGNvbnN1bWVyIHRyaWVkIHRvIGFzc2lnbi4gVGhlIHJlYWxcbiAgICogdmFsdWUgd2lsbCBleGNsdWRlIGFueSB2YWx1ZXMgZnJvbSB0aGlzIG9uZSB0aGF0IGRvbid0IGNvcnJlc3BvbmQgdG8gYVxuICAgKiB0b2dnbGUuIFVzZWZ1bCBmb3IgdGhlIGNhc2VzIHdoZXJlIHRoZSB2YWx1ZSBpcyBhc3NpZ25lZCBiZWZvcmUgdGhlIHRvZ2dsZXNcbiAgICogaGF2ZSBiZWVuIGluaXRpYWxpemVkIG9yIGF0IHRoZSBzYW1lIHRoYXQgdGhleSdyZSBiZWluZyBzd2FwcGVkIG91dC5cbiAgICovXG4gIHByaXZhdGUgX3Jhd1ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdG8gYmUgY2FsbGVkIGluIG9yZGVyIHRvIHVwZGF0ZSBuZ01vZGVsLlxuICAgKiBOb3cgYG5nTW9kZWxgIGJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCBpbiBtdWx0aXBsZSBzZWxlY3Rpb24gbW9kZS5cbiAgICovXG4gIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBfb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKiogQ2hpbGQgYnV0dG9uIHRvZ2dsZSBidXR0b25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTWF0QnV0dG9uVG9nZ2xlKSwge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIHdvdWxkIHRlY2huaWNhbGx5IHBpY2sgdXAgdG9nZ2xlc1xuICAgIC8vIGZyb20gbmVzdGVkIGdyb3VwcywgYnV0IHRoYXQncyBub3QgYSBjYXNlIHRoYXQgd2Ugc3VwcG9ydC5cbiAgICBkZXNjZW5kYW50czogdHJ1ZSxcbiAgfSlcbiAgX2J1dHRvblRvZ2dsZXM6IFF1ZXJ5TGlzdDxNYXRCdXR0b25Ub2dnbGU+O1xuXG4gIC8qKiBUaGUgYXBwZWFyYW5jZSBmb3IgYWxsIHRoZSBidXR0b25zIGluIHRoZSBncm91cC4gKi9cbiAgQElucHV0KCkgYXBwZWFyYW5jZTogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZTtcblxuICAvKiogYG5hbWVgIGF0dHJpYnV0ZSBmb3IgdGhlIHVuZGVybHlpbmcgYGlucHV0YCBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG4gIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgdGhpcy5fbWFya0J1dHRvbnNGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX25hbWUgPSBgbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAtJHt1bmlxdWVJZENvdW50ZXIrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgZ3JvdXAgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGljYWw7XG4gIH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogVmFsdWUgb2YgdGhlIHRvZ2dsZSBncm91cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogW107XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkLm1hcCh0b2dnbGUgPT4gdG9nZ2xlLnZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRbMF0gPyBzZWxlY3RlZFswXS52YWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUobmV3VmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAgY2hhbmdlcy5cbiAgICogVXNlZCB0byBmYWNpbGl0YXRlIHR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogU2VsZWN0ZWQgYnV0dG9uIHRvZ2dsZXMgaW4gdGhlIGdyb3VwLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0QnV0dG9uVG9nZ2xlIHwgTWF0QnV0dG9uVG9nZ2xlW10ge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IFtdO1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gc2VsZWN0ZWQgOiBzZWxlY3RlZFswXSB8fCBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgbXVsdGlwbGUgYnV0dG9uIHRvZ2dsZXMgY2FuIGJlIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX21hcmtCdXR0b25zRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG11bHRpcGxlIGJ1dHRvbiB0b2dnbGUgZ3JvdXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fbWFya0J1dHRvbnNGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAncyB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMpXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucyxcbiAgKSB7XG4gICAgdGhpcy5hcHBlYXJhbmNlID1cbiAgICAgIGRlZmF1bHRPcHRpb25zICYmIGRlZmF1bHRPcHRpb25zLmFwcGVhcmFuY2UgPyBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlIDogJ3N0YW5kYXJkJztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdEJ1dHRvblRvZ2dsZT4odGhpcy5tdWx0aXBsZSwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KC4uLnRoaXMuX2J1dHRvblRvZ2dsZXMuZmlsdGVyKHRvZ2dsZSA9PiB0b2dnbGUuY2hlY2tlZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1vZGVsIHZhbHVlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gYmUgc2V0IHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0QnV0dG9uVG9nZ2xlQ2hhbmdlKHRvZ2dsZSwgdGhpcy52YWx1ZSk7XG4gICAgdGhpcy5fcmF3VmFsdWUgPSBldmVudC52YWx1ZTtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyBhIGJ1dHRvbiB0b2dnbGUncyBzZWxlY3RlZCBzdGF0ZSB3aXRoIHRoZSBtb2RlbCB2YWx1ZS5cbiAgICogQHBhcmFtIHRvZ2dsZSBUb2dnbGUgdG8gYmUgc3luY2VkLlxuICAgKiBAcGFyYW0gc2VsZWN0IFdoZXRoZXIgdGhlIHRvZ2dsZSBzaG91bGQgYmUgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSBpc1VzZXJJbnB1dCBXaGV0aGVyIHRoZSBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi5cbiAgICogQHBhcmFtIGRlZmVyRXZlbnRzIFdoZXRoZXIgdG8gZGVmZXIgZW1pdHRpbmcgdGhlIGNoYW5nZSBldmVudHMuXG4gICAqL1xuICBfc3luY0J1dHRvblRvZ2dsZShcbiAgICB0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSxcbiAgICBzZWxlY3Q6IGJvb2xlYW4sXG4gICAgaXNVc2VySW5wdXQgPSBmYWxzZSxcbiAgICBkZWZlckV2ZW50cyA9IGZhbHNlLFxuICApIHtcbiAgICAvLyBEZXNlbGVjdCB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHRvZ2dsZSwgaWYgd2UncmUgaW4gc2luZ2xlLXNlbGVjdGlvblxuICAgIC8vIG1vZGUgYW5kIHRoZSBidXR0b24gYmVpbmcgdG9nZ2xlZCBpc24ndCBzZWxlY3RlZCBhdCB0aGUgbW9tZW50LlxuICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnNlbGVjdGVkICYmICF0b2dnbGUuY2hlY2tlZCkge1xuICAgICAgKHRoaXMuc2VsZWN0ZWQgYXMgTWF0QnV0dG9uVG9nZ2xlKS5jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICBpZiAoc2VsZWN0KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCh0b2dnbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3QodG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJFdmVudHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgaW4gc29tZSBjYXNlcyBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvcnNcIiwgaG93ZXZlclxuICAgIC8vIHRoZSBzaWRlLWVmZmVjdCBpcyB0aGF0IHdlIG1heSBlbmQgdXAgdXBkYXRpbmcgdGhlIG1vZGVsIHZhbHVlIG91dCBvZiBzZXF1ZW5jZSBpbiBvdGhlcnNcbiAgICAvLyBUaGUgYGRlZmVyRXZlbnRzYCBmbGFnIGFsbG93cyB1cyB0byBkZWNpZGUgd2hldGhlciB0byBkbyBpdCBvbiBhIGNhc2UtYnktY2FzZSBiYXNpcy5cbiAgICBpZiAoZGVmZXJFdmVudHMpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fdXBkYXRlTW9kZWxWYWx1ZSh0b2dnbGUsIGlzVXNlcklucHV0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU1vZGVsVmFsdWUodG9nZ2xlLCBpc1VzZXJJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGEgYnV0dG9uIHRvZ2dsZSBpcyBzZWxlY3RlZC4gKi9cbiAgX2lzU2VsZWN0ZWQodG9nZ2xlOiBNYXRCdXR0b25Ub2dnbGUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTW9kZWwgJiYgdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZCh0b2dnbGUpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGJ1dHRvbiB0b2dnbGUgc2hvdWxkIGJlIGNoZWNrZWQgb24gaW5pdC4gKi9cbiAgX2lzUHJlY2hlY2tlZCh0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcmF3VmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheSh0aGlzLl9yYXdWYWx1ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yYXdWYWx1ZS5zb21lKHZhbHVlID0+IHRvZ2dsZS52YWx1ZSAhPSBudWxsICYmIHZhbHVlID09PSB0b2dnbGUudmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0b2dnbGUudmFsdWUgPT09IHRoaXMuX3Jhd1ZhbHVlO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiB0aGUgdG9nZ2xlcyBpbiB0aGUgZ3JvdXAgYmFzZWQgb24gYSB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfc2V0U2VsZWN0aW9uQnlWYWx1ZSh2YWx1ZTogYW55IHwgYW55W10pIHtcbiAgICB0aGlzLl9yYXdWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKCF0aGlzLl9idXR0b25Ub2dnbGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdmFsdWUpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1ZhbHVlIG11c3QgYmUgYW4gYXJyYXkgaW4gbXVsdGlwbGUtc2VsZWN0aW9uIG1vZGUuJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NsZWFyU2VsZWN0aW9uKCk7XG4gICAgICB2YWx1ZS5mb3JFYWNoKChjdXJyZW50VmFsdWU6IGFueSkgPT4gdGhpcy5fc2VsZWN0VmFsdWUoY3VycmVudFZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsZWFyU2VsZWN0aW9uKCk7XG4gICAgICB0aGlzLl9zZWxlY3RWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsZWFycyB0aGUgc2VsZWN0ZWQgdG9nZ2xlcy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcbiAgICB0aGlzLl9idXR0b25Ub2dnbGVzLmZvckVhY2godG9nZ2xlID0+ICh0b2dnbGUuY2hlY2tlZCA9IGZhbHNlKSk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhIHZhbHVlIGlmIHRoZXJlJ3MgYSB0b2dnbGUgdGhhdCBjb3JyZXNwb25kcyB0byBpdC4gKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLl9idXR0b25Ub2dnbGVzLmZpbmQodG9nZ2xlID0+IHtcbiAgICAgIHJldHVybiB0b2dnbGUudmFsdWUgIT0gbnVsbCAmJiB0b2dnbGUudmFsdWUgPT09IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgIGNvcnJlc3BvbmRpbmdPcHRpb24uY2hlY2tlZCA9IHRydWU7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoY29ycmVzcG9uZGluZ09wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN5bmNzIHVwIHRoZSBncm91cCdzIHZhbHVlIHdpdGggdGhlIG1vZGVsIGFuZCBlbWl0cyB0aGUgY2hhbmdlIGV2ZW50LiAqL1xuICBwcml2YXRlIF91cGRhdGVNb2RlbFZhbHVlKHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlLCBpc1VzZXJJbnB1dDogYm9vbGVhbikge1xuICAgIC8vIE9ubHkgZW1pdCB0aGUgY2hhbmdlIGV2ZW50IGZvciB1c2VyIGlucHV0LlxuICAgIGlmIChpc1VzZXJJbnB1dCkge1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KHRvZ2dsZSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgZW1pdCB0aGlzIG9uZSBubyBtYXR0ZXIgd2hldGhlciBpdCB3YXMgYSB1c2VyIGludGVyYWN0aW9uLCBiZWNhdXNlXG4gICAgLy8gaXQgaXMgdXNlZCBieSBBbmd1bGFyIHRvIHN5bmMgdXAgdGhlIHR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyBhbGwgb2YgdGhlIGNoaWxkIGJ1dHRvbiB0b2dnbGVzIHRvIGJlIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX21hcmtCdXR0b25zRm9yQ2hlY2soKSB7XG4gICAgdGhpcy5fYnV0dG9uVG9nZ2xlcz8uZm9yRWFjaCh0b2dnbGUgPT4gdG9nZ2xlLl9tYXJrRm9yQ2hlY2soKSk7XG4gIH1cbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byB0aGUgTWF0QnV0dG9uVG9nZ2xlIGNsYXNzLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRCdXR0b25Ub2dnbGVCYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KTtcblxuLyoqIFNpbmdsZSBidXR0b24gaW5zaWRlIG9mIGEgdG9nZ2xlIGdyb3VwLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJ2J1dHRvbi10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydidXR0b24tdG9nZ2xlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdEJ1dHRvblRvZ2dsZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFsb25lXSc6ICchYnV0dG9uVG9nZ2xlR3JvdXAnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnY2xhc3MnOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIubmFtZV0nOiAnbnVsbCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlXG4gIGV4dGVuZHMgX01hdEJ1dHRvblRvZ2dsZUJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9jaGVja2VkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVkIHRvIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZSBvZiB0aGUgaG9zdCBlbGVtZW50LiBJbiBtb3N0IGNhc2VzLCBhcmlhLWxhYmVsbGVkYnkgd2lsbFxuICAgKiB0YWtlIHByZWNlZGVuY2Ugc28gdGhpcyBtYXkgYmUgb21pdHRlZC5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVc2VycyBjYW4gc3BlY2lmeSB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIHdoaWNoIHdpbGwgYmUgZm9yd2FyZGVkIHRvIHRoZSBpbnB1dCBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogVW5kZXJseWluZyBuYXRpdmUgYGJ1dHRvbmAgZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnYnV0dG9uJykgX2J1dHRvbkVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgcGFyZW50IGJ1dHRvbiB0b2dnbGUgZ3JvdXAgKGV4Y2x1c2l2ZSBzZWxlY3Rpb24pLiBPcHRpb25hbC4gKi9cbiAgYnV0dG9uVG9nZ2xlR3JvdXA6IE1hdEJ1dHRvblRvZ2dsZUdyb3VwO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSB1bmRlcmx5aW5nIGBidXR0b25gIGVsZW1lbnQuICovXG4gIGdldCBidXR0b25JZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmlkfS1idXR0b25gO1xuICB9XG5cbiAgLyoqIFRoZSB1bmlxdWUgSUQgZm9yIHRoaXMgYnV0dG9uIHRvZ2dsZS4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZztcblxuICAvKiogSFRNTCdzICduYW1lJyBhdHRyaWJ1dGUgdXNlZCB0byBncm91cCByYWRpb3MgZm9yIHVuaXF1ZSBzZWxlY3Rpb24uICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAvKiogTWF0QnV0dG9uVG9nZ2xlR3JvdXAgcmVhZHMgdGhpcyB0byBhc3NpZ24gaXRzIG93biB2YWx1ZS4gKi9cbiAgQElucHV0KCkgdmFsdWU6IGFueTtcblxuICAvKiogVGFiaW5kZXggZm9yIHRoZSB0b2dnbGUuICovXG4gIEBJbnB1dCgpIHRhYkluZGV4OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBUaGUgYXBwZWFyYW5jZSBzdHlsZSBvZiB0aGUgYnV0dG9uLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXBwZWFyYW5jZSgpOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlIHtcbiAgICByZXR1cm4gdGhpcy5idXR0b25Ub2dnbGVHcm91cCA/IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuYXBwZWFyYW5jZSA6IHRoaXMuX2FwcGVhcmFuY2U7XG4gIH1cbiAgc2V0IGFwcGVhcmFuY2UodmFsdWU6IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2UpIHtcbiAgICB0aGlzLl9hcHBlYXJhbmNlID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYXBwZWFyYW5jZTogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwID8gdGhpcy5idXR0b25Ub2dnbGVHcm91cC5faXNTZWxlY3RlZCh0aGlzKSA6IHRoaXMuX2NoZWNrZWQ7XG4gIH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fY2hlY2tlZCkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IG5ld1ZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5idXR0b25Ub2dnbGVHcm91cCkge1xuICAgICAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIHRoaXMuX2NoZWNrZWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwICYmIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdEJ1dHRvblRvZ2dsZUNoYW5nZT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVApIHRvZ2dsZUdyb3VwOiBNYXRCdXR0b25Ub2dnbGVHcm91cCxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSBkZWZhdWx0VGFiSW5kZXg6IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TKVxuICAgIGRlZmF1bHRPcHRpb25zPzogTWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBwYXJzZWRUYWJJbmRleCA9IE51bWJlcihkZWZhdWx0VGFiSW5kZXgpO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZWRUYWJJbmRleCB8fCBwYXJzZWRUYWJJbmRleCA9PT0gMCA/IHBhcnNlZFRhYkluZGV4IDogbnVsbDtcbiAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwID0gdG9nZ2xlR3JvdXA7XG4gICAgdGhpcy5hcHBlYXJhbmNlID1cbiAgICAgIGRlZmF1bHRPcHRpb25zICYmIGRlZmF1bHRPcHRpb25zLmFwcGVhcmFuY2UgPyBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlIDogJ3N0YW5kYXJkJztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5idXR0b25Ub2dnbGVHcm91cDtcbiAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCBgbWF0LWJ1dHRvbi10b2dnbGUtJHt1bmlxdWVJZENvdW50ZXIrK31gO1xuXG4gICAgaWYgKGdyb3VwKSB7XG4gICAgICBpZiAoZ3JvdXAuX2lzUHJlY2hlY2tlZCh0aGlzKSkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChncm91cC5faXNTZWxlY3RlZCh0aGlzKSAhPT0gdGhpcy5fY2hlY2tlZCkge1xuICAgICAgICAvLyBBcyBzaWRlIGVmZmVjdCBvZiB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeSBiZXR3ZWVuIHRoZSB0b2dnbGUgZ3JvdXAgYW5kIHRoZSBidXR0b24sXG4gICAgICAgIC8vIHdlIG1heSBlbmQgdXAgaW4gYSBzdGF0ZSB3aGVyZSB0aGUgYnV0dG9uIGlzIHN1cHBvc2VkIHRvIGJlIGNoZWNrZWQgb24gaW5pdCwgYnV0IGl0XG4gICAgICAgIC8vIGlzbid0LCBiZWNhdXNlIHRoZSBjaGVja2VkIHZhbHVlIHdhcyBhc3NpZ25lZCB0b28gZWFybHkuIFRoaXMgY2FuIGhhcHBlbiB3aGVuIEl2eVxuICAgICAgICAvLyBhc3NpZ25zIHRoZSBzdGF0aWMgaW5wdXQgdmFsdWUgYmVmb3JlIHRoZSBgbmdPbkluaXRgIGhhcyBydW4uXG4gICAgICAgIGdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIHRoaXMuX2NoZWNrZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5idXR0b25Ub2dnbGVHcm91cDtcblxuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcblxuICAgIC8vIFJlbW92ZSB0aGUgdG9nZ2xlIGZyb20gdGhlIHNlbGVjdGlvbiBvbmNlIGl0J3MgZGVzdHJveWVkLiBOZWVkcyB0byBoYXBwZW5cbiAgICAvLyBvbiB0aGUgbmV4dCB0aWNrIGluIG9yZGVyIHRvIGF2b2lkIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzLlxuICAgIGlmIChncm91cCAmJiBncm91cC5faXNTZWxlY3RlZCh0aGlzKSkge1xuICAgICAgZ3JvdXAuX3N5bmNCdXR0b25Ub2dnbGUodGhpcywgZmFsc2UsIGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYnV0dG9uLiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fYnV0dG9uRWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB0aGUgYnV0dG9uIHRvZ2dsZSBkdWUgdG8gYW4gaW50ZXJhY3Rpb24gd2l0aCB0aGUgdW5kZXJseWluZyBuYXRpdmUgYnV0dG9uLiAqL1xuICBfb25CdXR0b25DbGljaygpIHtcbiAgICBjb25zdCBuZXdDaGVja2VkID0gdGhpcy5faXNTaW5nbGVTZWxlY3RvcigpID8gdHJ1ZSA6ICF0aGlzLl9jaGVja2VkO1xuXG4gICAgaWYgKG5ld0NoZWNrZWQgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSBuZXdDaGVja2VkO1xuICAgICAgaWYgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkLCB0cnVlKTtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fb25Ub3VjaGVkKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgd2hlbiBpdCdzIHRoZSBzaW5nbGUgc2VsZWN0b3JcbiAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRCdXR0b25Ub2dnbGVDaGFuZ2UodGhpcywgdGhpcy52YWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBidXR0b24gdG9nZ2xlIGFzIG5lZWRpbmcgY2hlY2tpbmcgZm9yIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqIFRoaXMgbWV0aG9kIGlzIGV4cG9zZWQgYmVjYXVzZSB0aGUgcGFyZW50IGJ1dHRvbiB0b2dnbGUgZ3JvdXAgd2lsbCBkaXJlY3RseVxuICAgKiB1cGRhdGUgYm91bmQgcHJvcGVydGllcyBvZiB0aGUgcmFkaW8gYnV0dG9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICAvLyBXaGVuIHRoZSBncm91cCB2YWx1ZSBjaGFuZ2VzLCB0aGUgYnV0dG9uIHdpbGwgbm90IGJlIG5vdGlmaWVkLlxuICAgIC8vIFVzZSBgbWFya0ZvckNoZWNrYCB0byBleHBsaWNpdCB1cGRhdGUgYnV0dG9uIHRvZ2dsZSdzIHN0YXR1cy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIHRoYXQgc2hvdWxkIGJlIGFzc2lnbmVkIHRvIHRoZSBpbm5lciBET00gbm9kZS4gKi9cbiAgX2dldEJ1dHRvbk5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuX2lzU2luZ2xlU2VsZWN0b3IoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAubmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmFtZSB8fCBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBpcyBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGUuICovXG4gIHByaXZhdGUgX2lzU2luZ2xlU2VsZWN0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgJiYgIXRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAubXVsdGlwbGU7XG4gIH1cbn1cbiIsIjxidXR0b24gI2J1dHRvbiBjbGFzcz1cIm1hdC1idXR0b24tdG9nZ2xlLWJ1dHRvbiBtYXQtZm9jdXMtaW5kaWNhdG9yXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIFtpZF09XCJidXR0b25JZFwiXG4gICAgICAgIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gLTEgOiB0YWJJbmRleFwiXG4gICAgICAgIFthdHRyLmFyaWEtcHJlc3NlZF09XCJjaGVja2VkXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkIHx8IG51bGxcIlxuICAgICAgICBbYXR0ci5uYW1lXT1cIl9nZXRCdXR0b25OYW1lKClcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieVwiXG4gICAgICAgIChjbGljayk9XCJfb25CdXR0b25DbGljaygpXCI+XG4gIDxzcGFuIGNsYXNzPVwibWF0LWJ1dHRvbi10b2dnbGUtbGFiZWwtY29udGVudFwiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9zcGFuPlxuPC9idXR0b24+XG5cbjxzcGFuIGNsYXNzPVwibWF0LWJ1dHRvbi10b2dnbGUtZm9jdXMtb3ZlcmxheVwiPjwvc3Bhbj5cbjxzcGFuIGNsYXNzPVwibWF0LWJ1dHRvbi10b2dnbGUtcmlwcGxlXCIgbWF0UmlwcGxlXG4gICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cImJ1dHRvblwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJ0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZFwiPlxuPC9zcGFuPlxuIl19