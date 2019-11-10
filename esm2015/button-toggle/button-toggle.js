/**
 * @fileoverview added by tsickle
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
import { SelectionModel } from '@angular/cdk/collections';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, InjectionToken, Inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple, } from '@angular/material/core';
/**
 * Represents the default options for the button toggle that can be configured
 * using the `MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS` injection token.
 * @record
 */
export function MatButtonToggleDefaultOptions() { }
if (false) {
    /** @type {?|undefined} */
    MatButtonToggleDefaultOptions.prototype.appearance;
}
/**
 * Injection token that can be used to configure the
 * default options for all button toggles within an app.
 * @type {?}
 */
export const MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken('MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS');
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 * @type {?}
 */
export const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatButtonToggleGroup)),
    multi: true
};
/**
 * @deprecated Use `MatButtonToggleGroup` instead.
 * \@breaking-change 8.0.0
 */
export class MatButtonToggleGroupMultiple {
}
/** @type {?} */
let _uniqueIdCounter = 0;
/**
 * Change event object emitted by MatButtonToggle.
 */
export class MatButtonToggleChange {
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
     * The MatButtonToggle that emits the event.
     * @type {?}
     */
    MatButtonToggleChange.prototype.source;
    /**
     * The value assigned to the MatButtonToggle.
     * @type {?}
     */
    MatButtonToggleChange.prototype.value;
}
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
export class MatButtonToggleGroup {
    /**
     * @param {?} _changeDetector
     * @param {?=} defaultOptions
     */
    constructor(_changeDetector, defaultOptions) {
        this._changeDetector = _changeDetector;
        this._vertical = false;
        this._multiple = false;
        this._disabled = false;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        this._controlValueAccessorChangeFn = (/**
         * @return {?}
         */
        () => { });
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        this._onTouched = (/**
         * @return {?}
         */
        () => { });
        this._name = `mat-button-toggle-group-${_uniqueIdCounter++}`;
        /**
         * Event that emits whenever the value of the group changes.
         * Used to facilitate two-way data binding.
         * \@docs-private
         */
        this.valueChange = new EventEmitter();
        /**
         * Event emitted when the group's value changes.
         */
        this.change = new EventEmitter();
        this.appearance =
            defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
    }
    /**
     * `name` attribute for the underlying `input` element.
     * @return {?}
     */
    get name() { return this._name; }
    /**
     * @param {?} value
     * @return {?}
     */
    set name(value) {
        this._name = value;
        if (this._buttonToggles) {
            this._buttonToggles.forEach((/**
             * @param {?} toggle
             * @return {?}
             */
            toggle => {
                toggle.name = this._name;
                toggle._markForCheck();
            }));
        }
    }
    /**
     * Whether the toggle group is vertical.
     * @return {?}
     */
    get vertical() { return this._vertical; }
    /**
     * @param {?} value
     * @return {?}
     */
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /**
     * Value of the toggle group.
     * @return {?}
     */
    get value() {
        /** @type {?} */
        const selected = this._selectionModel ? this._selectionModel.selected : [];
        if (this.multiple) {
            return selected.map((/**
             * @param {?} toggle
             * @return {?}
             */
            toggle => toggle.value));
        }
        return selected[0] ? selected[0].value : undefined;
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        this._setSelectionByValue(newValue);
        this.valueChange.emit(this.value);
    }
    /**
     * Selected button toggles in the group.
     * @return {?}
     */
    get selected() {
        /** @type {?} */
        const selected = this._selectionModel ? this._selectionModel.selected : [];
        return this.multiple ? selected : (selected[0] || null);
    }
    /**
     * Whether multiple button toggles can be selected.
     * @return {?}
     */
    get multiple() { return this._multiple; }
    /**
     * @param {?} value
     * @return {?}
     */
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
    }
    /**
     * Whether multiple button toggle group is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        if (this._buttonToggles) {
            this._buttonToggles.forEach((/**
             * @param {?} toggle
             * @return {?}
             */
            toggle => toggle._markForCheck()));
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._selectionModel.select(...this._buttonToggles.filter((/**
         * @param {?} toggle
         * @return {?}
         */
        toggle => toggle.checked)));
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        this._changeDetector.markForCheck();
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    _emitChangeEvent() {
        /** @type {?} */
        const selected = this.selected;
        /** @type {?} */
        const source = Array.isArray(selected) ? selected[selected.length - 1] : selected;
        /** @type {?} */
        const event = new MatButtonToggleChange((/** @type {?} */ (source)), this.value);
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    }
    /**
     * Syncs a button toggle's selected state with the model value.
     * @param {?} toggle Toggle to be synced.
     * @param {?} select Whether the toggle should be selected.
     * @param {?=} isUserInput Whether the change was a result of a user interaction.
     * @param {?=} deferEvents Whether to defer emitting the change events.
     * @return {?}
     */
    _syncButtonToggle(toggle, select, isUserInput = false, deferEvents = false) {
        // Deselect the currently-selected toggle, if we're in single-selection
        // mode and the button being toggled isn't selected at the moment.
        if (!this.multiple && this.selected && !toggle.checked) {
            ((/** @type {?} */ (this.selected))).checked = false;
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
            Promise.resolve((/**
             * @return {?}
             */
            () => this._updateModelValue(isUserInput)));
        }
        else {
            this._updateModelValue(isUserInput);
        }
    }
    /**
     * Checks whether a button toggle is selected.
     * @param {?} toggle
     * @return {?}
     */
    _isSelected(toggle) {
        return this._selectionModel && this._selectionModel.isSelected(toggle);
    }
    /**
     * Determines whether a button toggle should be checked on init.
     * @param {?} toggle
     * @return {?}
     */
    _isPrechecked(toggle) {
        if (typeof this._rawValue === 'undefined') {
            return false;
        }
        if (this.multiple && Array.isArray(this._rawValue)) {
            return this._rawValue.some((/**
             * @param {?} value
             * @return {?}
             */
            value => toggle.value != null && value === toggle.value));
        }
        return toggle.value === this._rawValue;
    }
    /**
     * Updates the selection state of the toggles in the group based on a value.
     * @private
     * @param {?} value
     * @return {?}
     */
    _setSelectionByValue(value) {
        this._rawValue = value;
        if (!this._buttonToggles) {
            return;
        }
        if (this.multiple && value) {
            if (!Array.isArray(value)) {
                throw Error('Value must be an array in multiple-selection mode.');
            }
            this._clearSelection();
            value.forEach((/**
             * @param {?} currentValue
             * @return {?}
             */
            (currentValue) => this._selectValue(currentValue)));
        }
        else {
            this._clearSelection();
            this._selectValue(value);
        }
    }
    /**
     * Clears the selected toggles.
     * @private
     * @return {?}
     */
    _clearSelection() {
        this._selectionModel.clear();
        this._buttonToggles.forEach((/**
         * @param {?} toggle
         * @return {?}
         */
        toggle => toggle.checked = false));
    }
    /**
     * Selects a value if there's a toggle that corresponds to it.
     * @private
     * @param {?} value
     * @return {?}
     */
    _selectValue(value) {
        /** @type {?} */
        const correspondingOption = this._buttonToggles.find((/**
         * @param {?} toggle
         * @return {?}
         */
        toggle => {
            return toggle.value != null && toggle.value === value;
        }));
        if (correspondingOption) {
            correspondingOption.checked = true;
            this._selectionModel.select(correspondingOption);
        }
    }
    /**
     * Syncs up the group's value with the model and emits the change event.
     * @private
     * @param {?} isUserInput
     * @return {?}
     */
    _updateModelValue(isUserInput) {
        // Only emit the change event for user input.
        if (isUserInput) {
            this._emitChangeEvent();
        }
        // Note: we emit this one no matter whether it was a user interaction, because
        // it is used by Angular to sync up the two-way data binding.
        this.valueChange.emit(this.value);
    }
}
MatButtonToggleGroup.decorators = [
    { type: Directive, args: [{
                selector: 'mat-button-toggle-group',
                providers: [
                    MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
                    { provide: MatButtonToggleGroupMultiple, useExisting: MatButtonToggleGroup },
                ],
                host: {
                    'role': 'group',
                    'class': 'mat-button-toggle-group',
                    '[attr.aria-disabled]': 'disabled',
                    '[class.mat-button-toggle-vertical]': 'vertical',
                    '[class.mat-button-toggle-group-appearance-standard]': 'appearance === "standard"',
                },
                exportAs: 'matButtonToggleGroup',
            },] }
];
/** @nocollapse */
MatButtonToggleGroup.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,] }] }
];
MatButtonToggleGroup.propDecorators = {
    _buttonToggles: [{ type: ContentChildren, args: [forwardRef((/**
                 * @return {?}
                 */
                () => MatButtonToggle)), {
                    // Note that this would technically pick up toggles
                    // from nested groups, but that's not a case that we support.
                    descendants: true
                },] }],
    appearance: [{ type: Input }],
    name: [{ type: Input }],
    vertical: [{ type: Input }],
    value: [{ type: Input }],
    valueChange: [{ type: Output }],
    multiple: [{ type: Input }],
    disabled: [{ type: Input }],
    change: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    MatButtonToggleGroup.ngAcceptInputType_disabled;
    /** @type {?} */
    MatButtonToggleGroup.ngAcceptInputType_multiple;
    /** @type {?} */
    MatButtonToggleGroup.ngAcceptInputType_vertical;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._vertical;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._multiple;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._selectionModel;
    /**
     * Reference to the raw value that the consumer tried to assign. The real
     * value will exclude any values from this one that don't correspond to a
     * toggle. Useful for the cases where the value is assigned before the toggles
     * have been initialized or at the same that they're being swapped out.
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._rawValue;
    /**
     * The method to be called in order to update ngModel.
     * Now `ngModel` binding is not supported in multiple selection mode.
     * @type {?}
     */
    MatButtonToggleGroup.prototype._controlValueAccessorChangeFn;
    /**
     * onTouch function registered via registerOnTouch (ControlValueAccessor).
     * @type {?}
     */
    MatButtonToggleGroup.prototype._onTouched;
    /**
     * Child button toggle buttons.
     * @type {?}
     */
    MatButtonToggleGroup.prototype._buttonToggles;
    /**
     * The appearance for all the buttons in the group.
     * @type {?}
     */
    MatButtonToggleGroup.prototype.appearance;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._name;
    /**
     * Event that emits whenever the value of the group changes.
     * Used to facilitate two-way data binding.
     * \@docs-private
     * @type {?}
     */
    MatButtonToggleGroup.prototype.valueChange;
    /**
     * Event emitted when the group's value changes.
     * @type {?}
     */
    MatButtonToggleGroup.prototype.change;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggleGroup.prototype._changeDetector;
}
// Boilerplate for applying mixins to the MatButtonToggle class.
/**
 * \@docs-private
 */
class MatButtonToggleBase {
}
/** @type {?} */
const _MatButtonToggleMixinBase = mixinDisableRipple(MatButtonToggleBase);
/**
 * Single button inside of a toggle group.
 */
export class MatButtonToggle extends _MatButtonToggleMixinBase {
    /**
     * @param {?} toggleGroup
     * @param {?} _changeDetectorRef
     * @param {?} _elementRef
     * @param {?} _focusMonitor
     * @param {?} defaultTabIndex
     * @param {?=} defaultOptions
     */
    constructor(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, 
    // @breaking-change 8.0.0 `defaultTabIndex` to be made a required parameter.
    defaultTabIndex, defaultOptions) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this._isSingleSelector = false;
        this._checked = false;
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        this._disabled = false;
        /**
         * Event emitted when the group value changes.
         */
        this.change = new EventEmitter();
        /** @type {?} */
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
        this.buttonToggleGroup = toggleGroup;
        this.appearance =
            defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
    }
    /**
     * Unique ID for the underlying `button` element.
     * @return {?}
     */
    get buttonId() { return `${this.id}-button`; }
    /**
     * The appearance style of the button.
     * @return {?}
     */
    get appearance() {
        return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set appearance(value) {
        this._appearance = value;
    }
    /**
     * Whether the button is checked.
     * @return {?}
     */
    get checked() {
        return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set checked(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._checked) {
            this._checked = newValue;
            if (this.buttonToggleGroup) {
                this.buttonToggleGroup._syncButtonToggle(this, this._checked);
            }
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Whether the button is disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._isSingleSelector = this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
        this._type = this._isSingleSelector ? 'radio' : 'checkbox';
        this.id = this.id || `mat-button-toggle-${_uniqueIdCounter++}`;
        if (this._isSingleSelector) {
            this.name = this.buttonToggleGroup.name;
        }
        if (this.buttonToggleGroup && this.buttonToggleGroup._isPrechecked(this)) {
            this.checked = true;
        }
        this._focusMonitor.monitor(this._elementRef, true);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const group = this.buttonToggleGroup;
        this._focusMonitor.stopMonitoring(this._elementRef);
        // Remove the toggle from the selection once it's destroyed. Needs to happen
        // on the next tick in order to avoid "changed after checked" errors.
        if (group && group._isSelected(this)) {
            group._syncButtonToggle(this, false, false, true);
        }
    }
    /**
     * Focuses the button.
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._buttonElement.nativeElement.focus(options);
    }
    /**
     * Checks the button toggle due to an interaction with the underlying native button.
     * @return {?}
     */
    _onButtonClick() {
        /** @type {?} */
        const newChecked = this._isSingleSelector ? true : !this._checked;
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
     * @return {?}
     */
    _markForCheck() {
        // When the group value changes, the button will not be notified.
        // Use `markForCheck` to explicit update button toggle's status.
        this._changeDetectorRef.markForCheck();
    }
}
MatButtonToggle.decorators = [
    { type: Component, args: [{
                selector: 'mat-button-toggle',
                template: "<button #button class=\"mat-button-toggle-button\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"name || null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <div class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </div>\n</button>\n\n<div class=\"mat-button-toggle-focus-overlay\"></div>\n<div class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                exportAs: 'matButtonToggle',
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['disableRipple'],
                host: {
                    '[class.mat-button-toggle-standalone]': '!buttonToggleGroup',
                    '[class.mat-button-toggle-checked]': 'checked',
                    '[class.mat-button-toggle-disabled]': 'disabled',
                    '[class.mat-button-toggle-appearance-standard]': 'appearance === "standard"',
                    'class': 'mat-button-toggle',
                    // Always reset the tabindex to -1 so it doesn't conflict with the one on the `button`,
                    // but can still receive focus from things like cdkFocusInitial.
                    '[attr.tabindex]': '-1',
                    '[attr.id]': 'id',
                    '[attr.name]': 'null',
                    '(focus)': 'focus()',
                },
                styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;border-radius:2px;-webkit-tap-highlight-color:transparent}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:4px}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.cdk-high-contrast-active .mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:.5}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:.04}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.12}.cdk-high-contrast-active .mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.5}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{line-height:48px;padding:0 12px}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}.mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 36px}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 48px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}\n"]
            }] }
];
/** @nocollapse */
MatButtonToggle.ctorParameters = () => [
    { type: MatButtonToggleGroup, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: FocusMonitor },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,] }] }
];
MatButtonToggle.propDecorators = {
    ariaLabel: [{ type: Input, args: ['aria-label',] }],
    ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
    _buttonElement: [{ type: ViewChild, args: ['button',] }],
    id: [{ type: Input }],
    name: [{ type: Input }],
    value: [{ type: Input }],
    tabIndex: [{ type: Input }],
    appearance: [{ type: Input }],
    checked: [{ type: Input }],
    disabled: [{ type: Input }],
    change: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    MatButtonToggle.ngAcceptInputType_checked;
    /** @type {?} */
    MatButtonToggle.ngAcceptInputType_disabled;
    /** @type {?} */
    MatButtonToggle.ngAcceptInputType_vertical;
    /** @type {?} */
    MatButtonToggle.ngAcceptInputType_multiple;
    /** @type {?} */
    MatButtonToggle.ngAcceptInputType_disableRipple;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._isSingleSelector;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._checked;
    /**
     * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
     * take precedence so this may be omitted.
     * @type {?}
     */
    MatButtonToggle.prototype.ariaLabel;
    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     * @type {?}
     */
    MatButtonToggle.prototype.ariaLabelledby;
    /**
     * Type of the button toggle. Either 'radio' or 'checkbox'.
     * @type {?}
     */
    MatButtonToggle.prototype._type;
    /** @type {?} */
    MatButtonToggle.prototype._buttonElement;
    /**
     * The parent button toggle group (exclusive selection). Optional.
     * @type {?}
     */
    MatButtonToggle.prototype.buttonToggleGroup;
    /**
     * The unique ID for this button toggle.
     * @type {?}
     */
    MatButtonToggle.prototype.id;
    /**
     * HTML's 'name' attribute used to group radios for unique selection.
     * @type {?}
     */
    MatButtonToggle.prototype.name;
    /**
     * MatButtonToggleGroup reads this to assign its own value.
     * @type {?}
     */
    MatButtonToggle.prototype.value;
    /**
     * Tabindex for the toggle.
     * @type {?}
     */
    MatButtonToggle.prototype.tabIndex;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._appearance;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._disabled;
    /**
     * Event emitted when the group value changes.
     * @type {?}
     */
    MatButtonToggle.prototype.change;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatButtonToggle.prototype._focusMonitor;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24tdG9nZ2xlL2J1dHRvbi10b2dnbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBRUwsa0JBQWtCLEdBRW5CLE1BQU0sd0JBQXdCLENBQUM7Ozs7OztBQWFoQyxtREFFQzs7O0lBREMsbURBQXVDOzs7Ozs7O0FBT3pDLE1BQU0sT0FBTyxpQ0FBaUMsR0FDMUMsSUFBSSxjQUFjLENBQWdDLG1DQUFtQyxDQUFDOzs7Ozs7O0FBUzFGLE1BQU0sT0FBTyxzQ0FBc0MsR0FBUTtJQUN6RCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsRUFBQztJQUNuRCxLQUFLLEVBQUUsSUFBSTtDQUNaOzs7OztBQU1ELE1BQU0sT0FBTyw0QkFBNEI7Q0FBRzs7SUFFeEMsZ0JBQWdCLEdBQUcsQ0FBQzs7OztBQUd4QixNQUFNLE9B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QUFPLEVBQUUsbUJBQW1COzs7b0JBRzVCLGlCQUFpQixFQUFFLElBQUk7b0JBQ3ZCLFdBQVcsRUFBRSxJQUFJO29CQUNqQixhQUFhLEVBQUUsTUFBTTtvQkFDckIsU0FBUyxFQUFFLFNBQVM7aUJBQ3JCOzthQUNGOzs7O1lBa0ZzQyxvQkFBb0IsdUJBQTVDLFFBQVE7WUF2ZHJCLGlCQUFpQjtZQUlqQixVQUFVO1lBWEosWUFBWTt5Q0FtZUwsU0FBUyxTQUFDLFVBQVU7NENBQ3BCLFFBQVEsWUFBSSxNQUFNLFNBQUMsaUNBQWlDOzs7d0JBN0VoRSxLQUFLLFNBQUMsWUFBWTs2QkFLbEIsS0FBSyxTQUFDLGlCQUFpQjs2QkFLdkIsU0FBUyxTQUFDLFFBQVE7aUJBU2xCLEtBQUs7bUJBR0wsS0FBSztvQkFHTCxLQUFLO3VCQUdMLEtBQUs7eUJBR0wsS0FBSztzQkFVTCxLQUFLO3VCQW1CTCxLQUFLO3FCQVFMLE1BQU07Ozs7SUErRVAsMENBQXNFOztJQUN0RSwyQ0FBdUU7O0lBQ3ZFLDJDQUF1RTs7SUFDdkUsMkNBQXVFOztJQUN2RSxnREFBNEU7Ozs7O0lBOUo1RSw0Q0FBa0M7Ozs7O0lBQ2xDLG1DQUF5Qjs7Ozs7O0lBTXpCLG9DQUF1Qzs7Ozs7SUFLdkMseUNBQStEOzs7OztJQUcvRCxnQ0FBa0I7O0lBRWxCLHlDQUFtRTs7Ozs7SUFHbkUsNENBQXdDOzs7OztJQU14Qyw2QkFBb0I7Ozs7O0lBR3BCLCtCQUFzQjs7Ozs7SUFHdEIsZ0NBQW9COzs7OztJQUdwQixtQ0FBaUM7Ozs7O0lBVWpDLHNDQUErQzs7Ozs7SUEyQi9DLG9DQUFtQzs7Ozs7SUFHbkMsaUNBQzhDOzs7OztJQUdsQyw2Q0FBNkM7Ozs7O0lBQzdDLHNDQUE0Qzs7Ozs7SUFDNUMsd0NBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3Rvcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cblxuLyoqIEFjY2VwdGFibGUgdHlwZXMgZm9yIGEgYnV0dG9uIHRvZ2dsZS4gKi9cbmV4cG9ydCB0eXBlIFRvZ2dsZVR5cGUgPSAnY2hlY2tib3gnIHwgJ3JhZGlvJztcblxuLyoqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgYnV0dG9uIHRvZ2dsZS4gKi9cbmV4cG9ydCB0eXBlIE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2UgPSAnbGVnYWN5JyB8ICdzdGFuZGFyZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgYnV0dG9uIHRvZ2dsZSB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEJ1dHRvblRvZ2dsZURlZmF1bHRPcHRpb25zIHtcbiAgYXBwZWFyYW5jZT86IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgYnV0dG9uIHRvZ2dsZXMgd2l0aGluIGFuIGFwcC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEJ1dHRvblRvZ2dsZURlZmF1bHRPcHRpb25zPignTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TJyk7XG5cblxuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QnV0dG9uVG9nZ2xlR3JvdXApLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdEJ1dHRvblRvZ2dsZUdyb3VwYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICovXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlR3JvdXBNdWx0aXBsZSB7fVxuXG5sZXQgX3VuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0QnV0dG9uVG9nZ2xlLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgTWF0QnV0dG9uVG9nZ2xlIHRoYXQgZW1pdHMgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdEJ1dHRvblRvZ2dsZSxcblxuICAgIC8qKiBUaGUgdmFsdWUgYXNzaWduZWQgdG8gdGhlIE1hdEJ1dHRvblRvZ2dsZS4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkge31cbn1cblxuLyoqIEV4Y2x1c2l2ZSBzZWxlY3Rpb24gYnV0dG9uIHRvZ2dsZSBncm91cCB0aGF0IGJlaGF2ZXMgbGlrZSBhIHJhZGlvLWJ1dHRvbiBncm91cC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1idXR0b24tdG9nZ2xlLWdyb3VwJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVBfVkFMVUVfQUNDRVNTT1IsXG4gICAge3Byb3ZpZGU6IE1hdEJ1dHRvblRvZ2dsZUdyb3VwTXVsdGlwbGUsIHVzZUV4aXN0aW5nOiBNYXRCdXR0b25Ub2dnbGVHcm91cH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdncm91cCcsXG4gICAgJ2NsYXNzJzogJ21hdC1idXR0b24tdG9nZ2xlLWdyb3VwJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLWdyb3VwLWFwcGVhcmFuY2Utc3RhbmRhcmRdJzogJ2FwcGVhcmFuY2UgPT09IFwic3RhbmRhcmRcIicsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0QnV0dG9uVG9nZ2xlR3JvdXAnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGVHcm91cCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQge1xuICBwcml2YXRlIF92ZXJ0aWNhbCA9IGZhbHNlO1xuICBwcml2YXRlIF9tdWx0aXBsZSA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0QnV0dG9uVG9nZ2xlPjtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSByYXcgdmFsdWUgdGhhdCB0aGUgY29uc3VtZXIgdHJpZWQgdG8gYXNzaWduLiBUaGUgcmVhbFxuICAgKiB2YWx1ZSB3aWxsIGV4Y2x1ZGUgYW55IHZhbHVlcyBmcm9tIHRoaXMgb25lIHRoYXQgZG9uJ3QgY29ycmVzcG9uZCB0byBhXG4gICAqIHRvZ2dsZS4gVXNlZnVsIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIHZhbHVlIGlzIGFzc2lnbmVkIGJlZm9yZSB0aGUgdG9nZ2xlc1xuICAgKiBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQgb3IgYXQgdGhlIHNhbWUgdGhhdCB0aGV5J3JlIGJlaW5nIHN3YXBwZWQgb3V0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3VmFsdWU6IGFueTtcblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB0byBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIG5nTW9kZWwuXG4gICAqIE5vdyBgbmdNb2RlbGAgYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLlxuICAgKi9cbiAgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuICovXG4gIF9vblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBDaGlsZCBidXR0b24gdG9nZ2xlIGJ1dHRvbnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRCdXR0b25Ub2dnbGUpLCB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgd291bGQgdGVjaG5pY2FsbHkgcGljayB1cCB0b2dnbGVzXG4gICAgLy8gZnJvbSBuZXN0ZWQgZ3JvdXBzLCBidXQgdGhhdCdzIG5vdCBhIGNhc2UgdGhhdCB3ZSBzdXBwb3J0LlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlXG4gIH0pIF9idXR0b25Ub2dnbGVzOiBRdWVyeUxpc3Q8TWF0QnV0dG9uVG9nZ2xlPjtcblxuICAvKiogVGhlIGFwcGVhcmFuY2UgZm9yIGFsbCB0aGUgYnV0dG9ucyBpbiB0aGUgZ3JvdXAuICovXG4gIEBJbnB1dCgpIGFwcGVhcmFuY2U6IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U7XG5cbiAgLyoqIGBuYW1lYCBhdHRyaWJ1dGUgZm9yIHRoZSB1bmRlcmx5aW5nIGBpbnB1dGAgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX25hbWU7IH1cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcblxuICAgIGlmICh0aGlzLl9idXR0b25Ub2dnbGVzKSB7XG4gICAgICB0aGlzLl9idXR0b25Ub2dnbGVzLmZvckVhY2godG9nZ2xlID0+IHtcbiAgICAgICAgdG9nZ2xlLm5hbWUgPSB0aGlzLl9uYW1lO1xuICAgICAgICB0b2dnbGUuX21hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX25hbWUgPSBgbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAtJHtfdW5pcXVlSWRDb3VudGVyKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgdG9nZ2xlIGdyb3VwIGlzIHZlcnRpY2FsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92ZXJ0aWNhbDsgfVxuICBzZXQgdmVydGljYWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogVmFsdWUgb2YgdGhlIHRvZ2dsZSBncm91cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogW107XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkLm1hcCh0b2dnbGUgPT4gdG9nZ2xlLnZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRbMF0gPyBzZWxlY3RlZFswXS52YWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUobmV3VmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAgY2hhbmdlcy5cbiAgICogVXNlZCB0byBmYWNpbGl0YXRlIHR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogU2VsZWN0ZWQgYnV0dG9uIHRvZ2dsZXMgaW4gdGhlIGdyb3VwLiAqL1xuICBnZXQgc2VsZWN0ZWQoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogW107XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyBzZWxlY3RlZCA6IChzZWxlY3RlZFswXSB8fCBudWxsKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG11bHRpcGxlIGJ1dHRvbiB0b2dnbGVzIGNhbiBiZSBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbXVsdGlwbGU7IH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgbXVsdGlwbGUgYnV0dG9uIHRvZ2dsZSBncm91cCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuX2J1dHRvblRvZ2dsZXMpIHtcbiAgICAgIHRoaXMuX2J1dHRvblRvZ2dsZXMuZm9yRWFjaCh0b2dnbGUgPT4gdG9nZ2xlLl9tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAncyB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEJ1dHRvblRvZ2dsZUNoYW5nZT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgIGRlZmF1bHRPcHRpb25zPzogTWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnMpIHtcblxuICAgICAgdGhpcy5hcHBlYXJhbmNlID1cbiAgICAgICAgICBkZWZhdWx0T3B0aW9ucyAmJiBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlID8gZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA6ICdzdGFuZGFyZCc7XG4gICAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdEJ1dHRvblRvZ2dsZT4odGhpcy5tdWx0aXBsZSwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KC4uLnRoaXMuX2J1dHRvblRvZ2dsZXMuZmlsdGVyKHRvZ2dsZSA9PiB0b2dnbGUuY2hlY2tlZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1vZGVsIHZhbHVlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gYmUgc2V0IHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHdpdGggY3VycmVudCBzZWxlY3Rpb24gYW5kIGdyb3VwIHZhbHVlLiAqL1xuICBfZW1pdENoYW5nZUV2ZW50KCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcbiAgICBjb25zdCBzb3VyY2UgPSBBcnJheS5pc0FycmF5KHNlbGVjdGVkKSA/IHNlbGVjdGVkW3NlbGVjdGVkLmxlbmd0aCAtIDFdIDogc2VsZWN0ZWQ7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0QnV0dG9uVG9nZ2xlQ2hhbmdlKHNvdXJjZSEsIHRoaXMudmFsdWUpO1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4oZXZlbnQudmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bmNzIGEgYnV0dG9uIHRvZ2dsZSdzIHNlbGVjdGVkIHN0YXRlIHdpdGggdGhlIG1vZGVsIHZhbHVlLlxuICAgKiBAcGFyYW0gdG9nZ2xlIFRvZ2dsZSB0byBiZSBzeW5jZWQuXG4gICAqIEBwYXJhbSBzZWxlY3QgV2hldGhlciB0aGUgdG9nZ2xlIHNob3VsZCBiZSBzZWxlY3RlZC5cbiAgICogQHBhcmFtIGlzVXNlcklucHV0IFdoZXRoZXIgdGhlIGNoYW5nZSB3YXMgYSByZXN1bHQgb2YgYSB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBAcGFyYW0gZGVmZXJFdmVudHMgV2hldGhlciB0byBkZWZlciBlbWl0dGluZyB0aGUgY2hhbmdlIGV2ZW50cy5cbiAgICovXG4gIF9zeW5jQnV0dG9uVG9nZ2xlKHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgIGlzVXNlcklucHV0ID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRlZmVyRXZlbnRzID0gZmFsc2UpIHtcbiAgICAvLyBEZXNlbGVjdCB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHRvZ2dsZSwgaWYgd2UncmUgaW4gc2luZ2xlLXNlbGVjdGlvblxuICAgIC8vIG1vZGUgYW5kIHRoZSBidXR0b24gYmVpbmcgdG9nZ2xlZCBpc24ndCBzZWxlY3RlZCBhdCB0aGUgbW9tZW50LlxuICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnNlbGVjdGVkICYmICF0b2dnbGUuY2hlY2tlZCkge1xuICAgICAgKHRoaXMuc2VsZWN0ZWQgYXMgTWF0QnV0dG9uVG9nZ2xlKS5jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICBpZiAoc2VsZWN0KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCh0b2dnbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3QodG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJFdmVudHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgaW4gc29tZSBjYXNlcyBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvcnNcIiwgaG93ZXZlclxuICAgIC8vIHRoZSBzaWRlLWVmZmVjdCBpcyB0aGF0IHdlIG1heSBlbmQgdXAgdXBkYXRpbmcgdGhlIG1vZGVsIHZhbHVlIG91dCBvZiBzZXF1ZW5jZSBpbiBvdGhlcnNcbiAgICAvLyBUaGUgYGRlZmVyRXZlbnRzYCBmbGFnIGFsbG93cyB1cyB0byBkZWNpZGUgd2hldGhlciB0byBkbyBpdCBvbiBhIGNhc2UtYnktY2FzZSBiYXNpcy5cbiAgICBpZiAoZGVmZXJFdmVudHMpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgoKSA9PiB0aGlzLl91cGRhdGVNb2RlbFZhbHVlKGlzVXNlcklucHV0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU1vZGVsVmFsdWUoaXNVc2VySW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBhIGJ1dHRvbiB0b2dnbGUgaXMgc2VsZWN0ZWQuICovXG4gIF9pc1NlbGVjdGVkKHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQodG9nZ2xlKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBidXR0b24gdG9nZ2xlIHNob3VsZCBiZSBjaGVja2VkIG9uIGluaXQuICovXG4gIF9pc1ByZWNoZWNrZWQodG9nZ2xlOiBNYXRCdXR0b25Ub2dnbGUpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX3Jhd1ZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm11bHRpcGxlICYmIEFycmF5LmlzQXJyYXkodGhpcy5fcmF3VmFsdWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmF3VmFsdWUuc29tZSh2YWx1ZSA9PiB0b2dnbGUudmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA9PT0gdG9nZ2xlLnZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9nZ2xlLnZhbHVlID09PSB0aGlzLl9yYXdWYWx1ZTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIHRvZ2dsZXMgaW4gdGhlIGdyb3VwIGJhc2VkIG9uIGEgdmFsdWUuICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueXxhbnlbXSkge1xuICAgIHRoaXMuX3Jhd1ZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoIXRoaXMuX2J1dHRvblRvZ2dsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignVmFsdWUgbXVzdCBiZSBhbiBhcnJheSBpbiBtdWx0aXBsZS1zZWxlY3Rpb24gbW9kZS4nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHZhbHVlLmZvckVhY2goKGN1cnJlbnRWYWx1ZTogYW55KSA9PiB0aGlzLl9zZWxlY3RWYWx1ZShjdXJyZW50VmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHRoaXMuX3NlbGVjdFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSBzZWxlY3RlZCB0b2dnbGVzLiAqL1xuICBwcml2YXRlIF9jbGVhclNlbGVjdGlvbigpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuICAgIHRoaXMuX2J1dHRvblRvZ2dsZXMuZm9yRWFjaCh0b2dnbGUgPT4gdG9nZ2xlLmNoZWNrZWQgPSBmYWxzZSk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhIHZhbHVlIGlmIHRoZXJlJ3MgYSB0b2dnbGUgdGhhdCBjb3JyZXNwb25kcyB0byBpdC4gKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLl9idXR0b25Ub2dnbGVzLmZpbmQodG9nZ2xlID0+IHtcbiAgICAgIHJldHVybiB0b2dnbGUudmFsdWUgIT0gbnVsbCAmJiB0b2dnbGUudmFsdWUgPT09IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgIGNvcnJlc3BvbmRpbmdPcHRpb24uY2hlY2tlZCA9IHRydWU7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoY29ycmVzcG9uZGluZ09wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN5bmNzIHVwIHRoZSBncm91cCdzIHZhbHVlIHdpdGggdGhlIG1vZGVsIGFuZCBlbWl0cyB0aGUgY2hhbmdlIGV2ZW50LiAqL1xuICBwcml2YXRlIF91cGRhdGVNb2RlbFZhbHVlKGlzVXNlcklucHV0OiBib29sZWFuKSB7XG4gICAgLy8gT25seSBlbWl0IHRoZSBjaGFuZ2UgZXZlbnQgZm9yIHVzZXIgaW5wdXQuXG4gICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlOiB3ZSBlbWl0IHRoaXMgb25lIG5vIG1hdHRlciB3aGV0aGVyIGl0IHdhcyBhIHVzZXIgaW50ZXJhY3Rpb24sIGJlY2F1c2VcbiAgICAvLyBpdCBpcyB1c2VkIGJ5IEFuZ3VsYXIgdG8gc3luYyB1cCB0aGUgdHdvLXdheSBkYXRhIGJpbmRpbmcuXG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpcGxlOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZlcnRpY2FsOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byB0aGUgTWF0QnV0dG9uVG9nZ2xlIGNsYXNzLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdEJ1dHRvblRvZ2dsZUJhc2Uge31cbmNvbnN0IF9NYXRCdXR0b25Ub2dnbGVNaXhpbkJhc2U6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdEJ1dHRvblRvZ2dsZUJhc2UgPVxuICAgIG1peGluRGlzYWJsZVJpcHBsZShNYXRCdXR0b25Ub2dnbGVCYXNlKTtcblxuLyoqIFNpbmdsZSBidXR0b24gaW5zaWRlIG9mIGEgdG9nZ2xlIGdyb3VwLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJ2J1dHRvbi10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydidXR0b24tdG9nZ2xlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdEJ1dHRvblRvZ2dsZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFsb25lXSc6ICchYnV0dG9uVG9nZ2xlR3JvdXAnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnY2xhc3MnOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICAgIC8vIEFsd2F5cyByZXNldCB0aGUgdGFiaW5kZXggdG8gLTEgc28gaXQgZG9lc24ndCBjb25mbGljdCB3aXRoIHRoZSBvbmUgb24gdGhlIGBidXR0b25gLFxuICAgIC8vIGJ1dCBjYW4gc3RpbGwgcmVjZWl2ZSBmb2N1cyBmcm9tIHRoaW5ncyBsaWtlIGNka0ZvY3VzSW5pdGlhbC5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJy0xJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIubmFtZV0nOiAnbnVsbCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlIGV4dGVuZHMgX01hdEJ1dHRvblRvZ2dsZU1peGluQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCxcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95IHtcblxuICBwcml2YXRlIF9pc1NpbmdsZVNlbGVjdG9yID0gZmFsc2U7XG4gIHByaXZhdGUgX2NoZWNrZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQXR0YWNoZWQgdG8gdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlIG9mIHRoZSBob3N0IGVsZW1lbnQuIEluIG1vc3QgY2FzZXMsIGFyaWEtbGFiZWxsZWRieSB3aWxsXG4gICAqIHRha2UgcHJlY2VkZW5jZSBzbyB0aGlzIG1heSBiZSBvbWl0dGVkLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSBmb3J3YXJkZWQgdG8gdGhlIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUeXBlIG9mIHRoZSBidXR0b24gdG9nZ2xlLiBFaXRoZXIgJ3JhZGlvJyBvciAnY2hlY2tib3gnLiAqL1xuICBfdHlwZTogVG9nZ2xlVHlwZTtcblxuICBAVmlld0NoaWxkKCdidXR0b24nKSBfYnV0dG9uRWxlbWVudDogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG5cbiAgLyoqIFRoZSBwYXJlbnQgYnV0dG9uIHRvZ2dsZSBncm91cCAoZXhjbHVzaXZlIHNlbGVjdGlvbikuIE9wdGlvbmFsLiAqL1xuICBidXR0b25Ub2dnbGVHcm91cDogTWF0QnV0dG9uVG9nZ2xlR3JvdXA7XG5cbiAgLyoqIFVuaXF1ZSBJRCBmb3IgdGhlIHVuZGVybHlpbmcgYGJ1dHRvbmAgZWxlbWVudC4gKi9cbiAgZ2V0IGJ1dHRvbklkKCk6IHN0cmluZyB7IHJldHVybiBgJHt0aGlzLmlkfS1idXR0b25gOyB9XG5cbiAgLyoqIFRoZSB1bmlxdWUgSUQgZm9yIHRoaXMgYnV0dG9uIHRvZ2dsZS4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZztcblxuICAvKiogSFRNTCdzICduYW1lJyBhdHRyaWJ1dGUgdXNlZCB0byBncm91cCByYWRpb3MgZm9yIHVuaXF1ZSBzZWxlY3Rpb24uICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAvKiogTWF0QnV0dG9uVG9nZ2xlR3JvdXAgcmVhZHMgdGhpcyB0byBhc3NpZ24gaXRzIG93biB2YWx1ZS4gKi9cbiAgQElucHV0KCkgdmFsdWU6IGFueTtcblxuICAvKiogVGFiaW5kZXggZm9yIHRoZSB0b2dnbGUuICovXG4gIEBJbnB1dCgpIHRhYkluZGV4OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBUaGUgYXBwZWFyYW5jZSBzdHlsZSBvZiB0aGUgYnV0dG9uLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXBwZWFyYW5jZSgpOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlIHtcbiAgICByZXR1cm4gdGhpcy5idXR0b25Ub2dnbGVHcm91cCA/IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuYXBwZWFyYW5jZSA6IHRoaXMuX2FwcGVhcmFuY2U7XG4gIH1cbiAgc2V0IGFwcGVhcmFuY2UodmFsdWU6IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2UpIHtcbiAgICB0aGlzLl9hcHBlYXJhbmNlID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYXBwZWFyYW5jZTogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwID8gdGhpcy5idXR0b25Ub2dnbGVHcm91cC5faXNTZWxlY3RlZCh0aGlzKSA6IHRoaXMuX2NoZWNrZWQ7XG4gIH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSBuZXdWYWx1ZTtcblxuICAgICAgaWYgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAodGhpcy5idXR0b25Ub2dnbGVHcm91cCAmJiB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLmRpc2FibGVkKTtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdXAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdEJ1dHRvblRvZ2dsZUNoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgdG9nZ2xlR3JvdXA6IE1hdEJ1dHRvblRvZ2dsZUdyb3VwLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgZGVmYXVsdFRhYkluZGV4YCB0byBiZSBtYWRlIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIGRlZmF1bHRUYWJJbmRleDogc3RyaW5nLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zPzogTWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc3QgcGFyc2VkVGFiSW5kZXggPSBOdW1iZXIoZGVmYXVsdFRhYkluZGV4KTtcbiAgICB0aGlzLnRhYkluZGV4ID0gKHBhcnNlZFRhYkluZGV4IHx8IHBhcnNlZFRhYkluZGV4ID09PSAwKSA/IHBhcnNlZFRhYkluZGV4IDogbnVsbDtcbiAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwID0gdG9nZ2xlR3JvdXA7XG4gICAgdGhpcy5hcHBlYXJhbmNlID1cbiAgICAgICAgZGVmYXVsdE9wdGlvbnMgJiYgZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA/IGRlZmF1bHRPcHRpb25zLmFwcGVhcmFuY2UgOiAnc3RhbmRhcmQnO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5faXNTaW5nbGVTZWxlY3RvciA9IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgJiYgIXRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAubXVsdGlwbGU7XG4gICAgdGhpcy5fdHlwZSA9IHRoaXMuX2lzU2luZ2xlU2VsZWN0b3IgPyAncmFkaW8nIDogJ2NoZWNrYm94JztcbiAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCBgbWF0LWJ1dHRvbi10b2dnbGUtJHtfdW5pcXVlSWRDb3VudGVyKyt9YDtcblxuICAgIGlmICh0aGlzLl9pc1NpbmdsZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLm5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgJiYgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5faXNQcmVjaGVja2VkKHRoaXMpKSB7XG4gICAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwO1xuXG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSB0b2dnbGUgZnJvbSB0aGUgc2VsZWN0aW9uIG9uY2UgaXQncyBkZXN0cm95ZWQuIE5lZWRzIHRvIGhhcHBlblxuICAgIC8vIG9uIHRoZSBuZXh0IHRpY2sgaW4gb3JkZXIgdG8gYXZvaWQgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgaWYgKGdyb3VwICYmIGdyb3VwLl9pc1NlbGVjdGVkKHRoaXMpKSB7XG4gICAgICBncm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBidXR0b24uICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9idXR0b25FbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHRoZSBidXR0b24gdG9nZ2xlIGR1ZSB0byBhbiBpbnRlcmFjdGlvbiB3aXRoIHRoZSB1bmRlcmx5aW5nIG5hdGl2ZSBidXR0b24uICovXG4gIF9vbkJ1dHRvbkNsaWNrKCkge1xuICAgIGNvbnN0IG5ld0NoZWNrZWQgPSB0aGlzLl9pc1NpbmdsZVNlbGVjdG9yID8gdHJ1ZSA6ICF0aGlzLl9jaGVja2VkO1xuXG4gICAgaWYgKG5ld0NoZWNrZWQgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSBuZXdDaGVja2VkO1xuICAgICAgaWYgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkLCB0cnVlKTtcbiAgICAgICAgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5fb25Ub3VjaGVkKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgd2hlbiBpdCdzIHRoZSBzaW5nbGUgc2VsZWN0b3JcbiAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRCdXR0b25Ub2dnbGVDaGFuZ2UodGhpcywgdGhpcy52YWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBidXR0b24gdG9nZ2xlIGFzIG5lZWRpbmcgY2hlY2tpbmcgZm9yIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqIFRoaXMgbWV0aG9kIGlzIGV4cG9zZWQgYmVjYXVzZSB0aGUgcGFyZW50IGJ1dHRvbiB0b2dnbGUgZ3JvdXAgd2lsbCBkaXJlY3RseVxuICAgKiB1cGRhdGUgYm91bmQgcHJvcGVydGllcyBvZiB0aGUgcmFkaW8gYnV0dG9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICAvLyBXaGVuIHRoZSBncm91cCB2YWx1ZSBjaGFuZ2VzLCB0aGUgYnV0dG9uIHdpbGwgbm90IGJlIG5vdGlmaWVkLlxuICAgIC8vIFVzZSBgbWFya0ZvckNoZWNrYCB0byBleHBsaWNpdCB1cGRhdGUgYnV0dG9uIHRvZ2dsZSdzIHN0YXR1cy5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jaGVja2VkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZlcnRpY2FsOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpcGxlOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuIl19