/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
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
var MatButtonToggleGroupBase = /** @class */ (function () {
    function MatButtonToggleGroupBase() {
    }
    return MatButtonToggleGroupBase;
}());
var _MatButtonToggleGroupMixinBase = mixinDisabled(MatButtonToggleGroupBase);
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
var MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MatButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter = 0;
/**
 * Change event object emitted by MatButtonToggle.
 */
var MatButtonToggleChange = /** @class */ (function () {
    function MatButtonToggleChange() {
    }
    return MatButtonToggleChange;
}());
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
var MatButtonToggleGroup = /** @class */ (function (_super) {
    __extends(MatButtonToggleGroup, _super);
    function MatButtonToggleGroup(_changeDetector) {
        var _this = _super.call(this) || this;
        _this._changeDetector = _changeDetector;
        return _this;
    }
    Object.defineProperty(MatButtonToggleGroup.prototype, "name", {
        get: /**
         * `name` attribute for the underlying `input` element.
         * @return {?}
         */
        function () {
            return this._name;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatButtonToggleGroup.prototype, "vertical", {
        get: /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        function () {
            return this._vertical;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatButtonToggleGroup.prototype, "value", {
        get: /**
         * Value of the toggle group.
         * @return {?}
         */
        function () {
            return this._value;
        },
        set: /**
         * @param {?} newValue
         * @return {?}
         */
        function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this.valueChange.emit(newValue);
                this._updateSelectedButtonToggleFromValue();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatButtonToggleGroup.prototype, "selected", {
        get: /**
         * Whether the toggle group is selected.
         * @return {?}
         */
        function () {
            return this._selected;
        },
        set: /**
         * @param {?} selected
         * @return {?}
         */
        function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatButtonToggleGroup.prototype._updateButtonToggleNames = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) {
                toggle.name = _this._name;
            });
        }
    };
    /**
     * @return {?}
     */
    MatButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var /** @type {?} */ matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(function (buttonToggle) {
                    buttonToggle.checked = false;
                });
            }
        }
    };
    /** Dispatch change event with current selection and group value. */
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    MatButtonToggleGroup.prototype._emitChangeEvent = /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    function () {
        var /** @type {?} */ event = new MatButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    MatButtonToggleGroup.prototype.writeValue = /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    function (value) {
        this.value = value;
        this._changeDetector.markForCheck();
    };
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn On change callback function.
     */
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    MatButtonToggleGroup.prototype.registerOnChange = /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn On touch callback function.
     */
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    MatButtonToggleGroup.prototype.registerOnTouched = /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    function (fn) {
        this._onTouched = fn;
    };
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param isDisabled Whether the component should be disabled.
     */
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    MatButtonToggleGroup.prototype.setDisabledState = /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    function (isDisabled) {
        this.disabled = isDisabled;
        this._markButtonTogglesForCheck();
    };
    /**
     * @return {?}
     */
    MatButtonToggleGroup.prototype._markButtonTogglesForCheck = /**
     * @return {?}
     */
    function () {
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) { return toggle._markForCheck(); });
        }
    };
    return MatButtonToggleGroup;
}(_MatButtonToggleGroupMixinBase));
/**
 * Multiple selection button-toggle group. `ngModel` is not supported in this mode.
 */
var MatButtonToggleGroupMultiple = /** @class */ (function (_super) {
    __extends(MatButtonToggleGroupMultiple, _super);
    function MatButtonToggleGroupMultiple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MatButtonToggleGroupMultiple.prototype, "vertical", {
        get: /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        function () {
            return this._vertical;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    return MatButtonToggleGroupMultiple;
}(_MatButtonToggleGroupMixinBase));
/**
 * Single button inside of a toggle group.
 */
var MatButtonToggle = /** @class */ (function () {
    function MatButtonToggle(toggleGroup, toggleGroupMultiple, _changeDetectorRef, _buttonToggleDispatcher, _elementRef, _focusMonitor) {
        var _this = this;
        this._changeDetectorRef = _changeDetectorRef;
        this._buttonToggleDispatcher = _buttonToggleDispatcher;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            this._removeUniqueSelectionListener =
                _buttonToggleDispatcher.listen(function (id, name) {
                    if (id != _this.id && name == _this.name) {
                        _this.checked = false;
                        _this._changeDetectorRef.markForCheck();
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
    Object.defineProperty(MatButtonToggle.prototype, "inputId", {
        /** Unique ID for the underlying `input` element. */
        get: /**
         * Unique ID for the underlying `input` element.
         * @return {?}
         */
        function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatButtonToggle.prototype, "checked", {
        get: /**
         * Whether the button is checked.
         * @return {?}
         */
        function () { return this._checked; },
        set: /**
         * @param {?} newCheckedState
         * @return {?}
         */
        function (newCheckedState) {
            if (this._isSingleSelector && newCheckedState) {
                // Notify all button toggles with the same name (in the same group) to un-check.
                this._buttonToggleDispatcher.notify(this.id, this.name);
                this._changeDetectorRef.markForCheck();
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatButtonToggle.prototype, "value", {
        get: /**
         * MatButtonToggleGroup reads this to assign its own value.
         * @return {?}
         */
        function () {
            return this._value;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._value != value) {
                if (this.buttonToggleGroup != null && this.checked) {
                    this.buttonToggleGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatButtonToggle.prototype, "disabled", {
        get: /**
         * Whether the button is disabled.
         * @return {?}
         */
        function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatButtonToggle.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.id == null) {
            this.id = "mat-button-toggle-" + _uniqueIdCounter++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
        this._focusMonitor.monitor(this._elementRef.nativeElement, true);
    };
    /** Focuses the button. */
    /**
     * Focuses the button.
     * @return {?}
     */
    MatButtonToggle.prototype.focus = /**
     * Focuses the button.
     * @return {?}
     */
    function () {
        this._inputElement.nativeElement.focus();
    };
    /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    MatButtonToggle.prototype._toggle = /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    function () {
        this.checked = !this.checked;
    };
    /** Checks the button toggle due to an interaction with the underlying native input. */
    /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    MatButtonToggle.prototype._onInputChange = /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            var /** @type {?} */ groupValueChanged = this.buttonToggleGroup.selected != this;
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatButtonToggle.prototype._onInputClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    MatButtonToggle.prototype._emitChangeEvent = /**
     * Dispatch change event with current value.
     * @return {?}
     */
    function () {
        var /** @type {?} */ event = new MatButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    // Unregister buttonToggleDispatcherListener on destroy
    /**
     * @return {?}
     */
    MatButtonToggle.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._removeUniqueSelectionListener();
    };
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     */
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    MatButtonToggle.prototype._markForCheck = /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    function () {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update button toggle's status
        this._changeDetectorRef.markForCheck();
    };
    return MatButtonToggle;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatButtonToggleModule = /** @class */ (function () {
    function MatButtonToggleModule() {
    }
    return MatButtonToggleModule;
}());

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
//# sourceMappingURL=button-toggle.es5.js.map
