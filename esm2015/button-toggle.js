/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '@angular/cdk/collections';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisabled } from '@angular/material/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatButtonToggleGroupBase {
}
const _MatButtonToggleGroupMixinBase = mixinDisabled(MatButtonToggleGroupBase);
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatButtonToggleGroup),
    multi: true
};
let _uniqueIdCounter = 0;
/**
 * Change event object emitted by MatButtonToggle.
 */
class MatButtonToggleChange {
}
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
class MatButtonToggleGroup extends _MatButtonToggleGroupMixinBase {
    /**
     * @param {?} _changeDetector
     */
    constructor(_changeDetector) {
        super();
        this._changeDetector = _changeDetector;
    }
    /**
     * `name` attribute for the underlying `input` element.
     * @return {?}
     */
    get name() {
        return this._name;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set name(value) {
        this._name = value;
        this._updateButtonToggleNames();
    }
    /**
     * Whether the toggle group is vertical.
     * @return {?}
     */
    get vertical() {
        return this._vertical;
    }
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
        return this._value;
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        if (this._value != newValue) {
            this._value = newValue;
            this.valueChange.emit(newValue);
            this._updateSelectedButtonToggleFromValue();
        }
    }
    /**
     * Whether the toggle group is selected.
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.value = selected ? selected.value : null;
        if (selected && !selected.checked) {
            selected.checked = true;
        }
    }
    /**
     * @return {?}
     */
    _updateButtonToggleNames() {
        if (this._buttonToggles) {
            this._buttonToggles.forEach((toggle) => {
                toggle.name = this._name;
            });
        }
    }
    /**
     * @return {?}
     */
    _updateSelectedButtonToggleFromValue() {
        let /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            let /** @type {?} */ matchingButtonToggle = this._buttonToggles.filter(buttonToggle => buttonToggle.value == this._value)[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(buttonToggle => {
                    buttonToggle.checked = false;
                });
            }
        }
    }
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    _emitChangeEvent() {
        let /** @type {?} */ event = new MatButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
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
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._markButtonTogglesForCheck();
    }
    /**
     * @return {?}
     */
    _markButtonTogglesForCheck() {
        if (this._buttonToggles) {
            this._buttonToggles.forEach((toggle) => toggle._markForCheck());
        }
    }
}
/**
 * Multiple selection button-toggle group. `ngModel` is not supported in this mode.
 */
class MatButtonToggleGroupMultiple extends _MatButtonToggleGroupMixinBase {
    /**
     * Whether the toggle group is vertical.
     * @return {?}
     */
    get vertical() {
        return this._vertical;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
}
/**
 * Single button inside of a toggle group.
 */
class MatButtonToggle {
    /**
     * @param {?} toggleGroup
     * @param {?} toggleGroupMultiple
     * @param {?} _changeDetectorRef
     * @param {?} _buttonToggleDispatcher
     * @param {?} _elementRef
     * @param {?} _focusMonitor
     */
    constructor(toggleGroup, toggleGroupMultiple, _changeDetectorRef, _buttonToggleDispatcher, _elementRef, _focusMonitor) {
        this._changeDetectorRef = _changeDetectorRef;
        this._buttonToggleDispatcher = _buttonToggleDispatcher;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            this._removeUniqueSelectionListener =
                _buttonToggleDispatcher.listen((id, name) => {
                    if (id != this.id && name == this.name) {
                        this.checked = false;
                        this._changeDetectorRef.markForCheck();
                    }
                });
            this._type = 'radio';
            this.name = this.buttonToggleGroup.name;
            this._isSingleSelector = true;
        }
        else {
            // Even if there is no group at all, treat the button toggle as a checkbox so it can be
            // toggled on or off.
            this._type = 'checkbox';
            this._isSingleSelector = false;
        }
    }
    /**
     * Unique ID for the underlying `input` element.
     * @return {?}
     */
    get inputId() {
        return `${this.id}-input`;
    }
    /**
     * Whether the button is checked.
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @param {?} newCheckedState
     * @return {?}
     */
    set checked(newCheckedState) {
        if (this._isSingleSelector && newCheckedState) {
            // Notify all button toggles with the same name (in the same group) to un-check.
            this._buttonToggleDispatcher.notify(this.id, this.name);
            this._changeDetectorRef.markForCheck();
        }
        this._checked = newCheckedState;
        if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
            this.buttonToggleGroup.selected = this;
        }
    }
    /**
     * MatButtonToggleGroup reads this to assign its own value.
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        if (this._value != value) {
            if (this.buttonToggleGroup != null && this.checked) {
                this.buttonToggleGroup.value = value;
            }
            this._value = value;
        }
    }
    /**
     * Whether the button is disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
            (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.id == null) {
            this.id = `mat-button-toggle-${_uniqueIdCounter++}`;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
        this._focusMonitor.monitor(this._elementRef.nativeElement, true);
    }
    /**
     * Focuses the button.
     * @return {?}
     */
    focus() {
        this._inputElement.nativeElement.focus();
    }
    /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    _toggle() {
        this.checked = !this.checked;
    }
    /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    _onInputChange(event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            let /** @type {?} */ groupValueChanged = this.buttonToggleGroup.selected != this;
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup._onTouched();
            if (groupValueChanged) {
                this.buttonToggleGroup._emitChangeEvent();
            }
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onInputClick(event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    _emitChangeEvent() {
        let /** @type {?} */ event = new MatButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._removeUniqueSelectionListener();
    }
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    _markForCheck() {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update button toggle's status
        this._changeDetectorRef.markForCheck();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatButtonToggleModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatButtonToggleGroupBase, _MatButtonToggleGroupMixinBase, MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleGroupMultiple, MatButtonToggle, MatButtonToggleModule };
//# sourceMappingURL=button-toggle.js.map
