(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/a11y'), require('@angular/cdk/coercion'), require('@angular/cdk/collections'), require('@angular/core'), require('@angular/forms'), require('@angular/material/core')) :
    typeof define === 'function' && define.amd ? define('@angular/material/button-toggle', ['exports', 'tslib', '@angular/cdk/a11y', '@angular/cdk/coercion', '@angular/cdk/collections', '@angular/core', '@angular/forms', '@angular/material/core'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.buttonToggle = {}), global.tslib, global.ng.cdk.a11y, global.ng.cdk.coercion, global.ng.cdk.collections, global.ng.core, global.ng.forms, global.ng.material.core));
}(this, (function (exports, tslib, a11y, coercion, collections, core, forms, core$1) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Injection token that can be used to configure the
     * default options for all button toggles within an app.
     */
    var MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new core.InjectionToken('MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS');
    /**
     * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
     * This allows it to support [(ngModel)].
     * @docs-private
     */
    var MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return MatButtonToggleGroup; }),
        multi: true
    };
    /**
     * @deprecated Use `MatButtonToggleGroup` instead.
     * @breaking-change 8.0.0
     */
    var MatButtonToggleGroupMultiple = /** @class */ (function () {
        function MatButtonToggleGroupMultiple() {
        }
        return MatButtonToggleGroupMultiple;
    }());
    var _uniqueIdCounter = 0;
    /** Change event object emitted by MatButtonToggle. */
    var MatButtonToggleChange = /** @class */ (function () {
        function MatButtonToggleChange(
        /** The MatButtonToggle that emits the event. */
        source, 
        /** The value assigned to the MatButtonToggle. */
        value) {
            this.source = source;
            this.value = value;
        }
        return MatButtonToggleChange;
    }());
    /** Exclusive selection button toggle group that behaves like a radio-button group. */
    var MatButtonToggleGroup = /** @class */ (function () {
        function MatButtonToggleGroup(_changeDetector, defaultOptions) {
            this._changeDetector = _changeDetector;
            this._vertical = false;
            this._multiple = false;
            this._disabled = false;
            /**
             * The method to be called in order to update ngModel.
             * Now `ngModel` binding is not supported in multiple selection mode.
             */
            this._controlValueAccessorChangeFn = function () { };
            /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
            this._onTouched = function () { };
            this._name = "mat-button-toggle-group-" + _uniqueIdCounter++;
            /**
             * Event that emits whenever the value of the group changes.
             * Used to facilitate two-way data binding.
             * @docs-private
             */
            this.valueChange = new core.EventEmitter();
            /** Event emitted when the group's value changes. */
            this.change = new core.EventEmitter();
            this.appearance =
                defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
        }
        Object.defineProperty(MatButtonToggleGroup.prototype, "name", {
            /** `name` attribute for the underlying `input` element. */
            get: function () { return this._name; },
            set: function (value) {
                var _this = this;
                this._name = value;
                if (this._buttonToggles) {
                    this._buttonToggles.forEach(function (toggle) {
                        toggle.name = _this._name;
                        toggle._markForCheck();
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggleGroup.prototype, "vertical", {
            /** Whether the toggle group is vertical. */
            get: function () { return this._vertical; },
            set: function (value) {
                this._vertical = coercion.coerceBooleanProperty(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggleGroup.prototype, "value", {
            /** Value of the toggle group. */
            get: function () {
                var selected = this._selectionModel ? this._selectionModel.selected : [];
                if (this.multiple) {
                    return selected.map(function (toggle) { return toggle.value; });
                }
                return selected[0] ? selected[0].value : undefined;
            },
            set: function (newValue) {
                this._setSelectionByValue(newValue);
                this.valueChange.emit(this.value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggleGroup.prototype, "selected", {
            /** Selected button toggles in the group. */
            get: function () {
                var selected = this._selectionModel ? this._selectionModel.selected : [];
                return this.multiple ? selected : (selected[0] || null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggleGroup.prototype, "multiple", {
            /** Whether multiple button toggles can be selected. */
            get: function () { return this._multiple; },
            set: function (value) {
                this._multiple = coercion.coerceBooleanProperty(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggleGroup.prototype, "disabled", {
            /** Whether multiple button toggle group is disabled. */
            get: function () { return this._disabled; },
            set: function (value) {
                this._disabled = coercion.coerceBooleanProperty(value);
                if (this._buttonToggles) {
                    this._buttonToggles.forEach(function (toggle) { return toggle._markForCheck(); });
                }
            },
            enumerable: true,
            configurable: true
        });
        MatButtonToggleGroup.prototype.ngOnInit = function () {
            this._selectionModel = new collections.SelectionModel(this.multiple, undefined, false);
        };
        MatButtonToggleGroup.prototype.ngAfterContentInit = function () {
            var _a;
            (_a = this._selectionModel).select.apply(_a, tslib.__spread(this._buttonToggles.filter(function (toggle) { return toggle.checked; })));
        };
        /**
         * Sets the model value. Implemented as part of ControlValueAccessor.
         * @param value Value to be set to the model.
         */
        MatButtonToggleGroup.prototype.writeValue = function (value) {
            this.value = value;
            this._changeDetector.markForCheck();
        };
        // Implemented as part of ControlValueAccessor.
        MatButtonToggleGroup.prototype.registerOnChange = function (fn) {
            this._controlValueAccessorChangeFn = fn;
        };
        // Implemented as part of ControlValueAccessor.
        MatButtonToggleGroup.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        // Implemented as part of ControlValueAccessor.
        MatButtonToggleGroup.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
        };
        /** Dispatch change event with current selection and group value. */
        MatButtonToggleGroup.prototype._emitChangeEvent = function () {
            var selected = this.selected;
            var source = Array.isArray(selected) ? selected[selected.length - 1] : selected;
            var event = new MatButtonToggleChange(source, this.value);
            this._controlValueAccessorChangeFn(event.value);
            this.change.emit(event);
        };
        /**
         * Syncs a button toggle's selected state with the model value.
         * @param toggle Toggle to be synced.
         * @param select Whether the toggle should be selected.
         * @param isUserInput Whether the change was a result of a user interaction.
         * @param deferEvents Whether to defer emitting the change events.
         */
        MatButtonToggleGroup.prototype._syncButtonToggle = function (toggle, select, isUserInput, deferEvents) {
            var _this = this;
            if (isUserInput === void 0) { isUserInput = false; }
            if (deferEvents === void 0) { deferEvents = false; }
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
                Promise.resolve(function () { return _this._updateModelValue(isUserInput); });
            }
            else {
                this._updateModelValue(isUserInput);
            }
        };
        /** Checks whether a button toggle is selected. */
        MatButtonToggleGroup.prototype._isSelected = function (toggle) {
            return this._selectionModel && this._selectionModel.isSelected(toggle);
        };
        /** Determines whether a button toggle should be checked on init. */
        MatButtonToggleGroup.prototype._isPrechecked = function (toggle) {
            if (typeof this._rawValue === 'undefined') {
                return false;
            }
            if (this.multiple && Array.isArray(this._rawValue)) {
                return this._rawValue.some(function (value) { return toggle.value != null && value === toggle.value; });
            }
            return toggle.value === this._rawValue;
        };
        /** Updates the selection state of the toggles in the group based on a value. */
        MatButtonToggleGroup.prototype._setSelectionByValue = function (value) {
            var _this = this;
            this._rawValue = value;
            if (!this._buttonToggles) {
                return;
            }
            if (this.multiple && value) {
                if (!Array.isArray(value)) {
                    throw Error('Value must be an array in multiple-selection mode.');
                }
                this._clearSelection();
                value.forEach(function (currentValue) { return _this._selectValue(currentValue); });
            }
            else {
                this._clearSelection();
                this._selectValue(value);
            }
        };
        /** Clears the selected toggles. */
        MatButtonToggleGroup.prototype._clearSelection = function () {
            this._selectionModel.clear();
            this._buttonToggles.forEach(function (toggle) { return toggle.checked = false; });
        };
        /** Selects a value if there's a toggle that corresponds to it. */
        MatButtonToggleGroup.prototype._selectValue = function (value) {
            var correspondingOption = this._buttonToggles.find(function (toggle) {
                return toggle.value != null && toggle.value === value;
            });
            if (correspondingOption) {
                correspondingOption.checked = true;
                this._selectionModel.select(correspondingOption);
            }
        };
        /** Syncs up the group's value with the model and emits the change event. */
        MatButtonToggleGroup.prototype._updateModelValue = function (isUserInput) {
            // Only emit the change event for user input.
            if (isUserInput) {
                this._emitChangeEvent();
            }
            // Note: we emit this one no matter whether it was a user interaction, because
            // it is used by Angular to sync up the two-way data binding.
            this.valueChange.emit(this.value);
        };
        MatButtonToggleGroup.decorators = [
            { type: core.Directive, args: [{
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
        MatButtonToggleGroup.ctorParameters = function () { return [
            { type: core.ChangeDetectorRef },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,] }] }
        ]; };
        MatButtonToggleGroup.propDecorators = {
            _buttonToggles: [{ type: core.ContentChildren, args: [core.forwardRef(function () { return MatButtonToggle; }), {
                            // Note that this would technically pick up toggles
                            // from nested groups, but that's not a case that we support.
                            descendants: true
                        },] }],
            appearance: [{ type: core.Input }],
            name: [{ type: core.Input }],
            vertical: [{ type: core.Input }],
            value: [{ type: core.Input }],
            valueChange: [{ type: core.Output }],
            multiple: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            change: [{ type: core.Output }]
        };
        return MatButtonToggleGroup;
    }());
    // Boilerplate for applying mixins to the MatButtonToggle class.
    /** @docs-private */
    var MatButtonToggleBase = /** @class */ (function () {
        function MatButtonToggleBase() {
        }
        return MatButtonToggleBase;
    }());
    var _MatButtonToggleMixinBase = core$1.mixinDisableRipple(MatButtonToggleBase);
    /** Single button inside of a toggle group. */
    var MatButtonToggle = /** @class */ (function (_super) {
        tslib.__extends(MatButtonToggle, _super);
        function MatButtonToggle(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, 
        // @breaking-change 8.0.0 `defaultTabIndex` to be made a required parameter.
        defaultTabIndex, defaultOptions) {
            var _this = _super.call(this) || this;
            _this._changeDetectorRef = _changeDetectorRef;
            _this._elementRef = _elementRef;
            _this._focusMonitor = _focusMonitor;
            _this._isSingleSelector = false;
            _this._checked = false;
            /**
             * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
             */
            _this.ariaLabelledby = null;
            _this._disabled = false;
            /** Event emitted when the group value changes. */
            _this.change = new core.EventEmitter();
            var parsedTabIndex = Number(defaultTabIndex);
            _this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
            _this.buttonToggleGroup = toggleGroup;
            _this.appearance =
                defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
            return _this;
        }
        Object.defineProperty(MatButtonToggle.prototype, "buttonId", {
            /** Unique ID for the underlying `button` element. */
            get: function () { return this.id + "-button"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggle.prototype, "appearance", {
            /** The appearance style of the button. */
            get: function () {
                return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
            },
            set: function (value) {
                this._appearance = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggle.prototype, "checked", {
            /** Whether the button is checked. */
            get: function () {
                return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
            },
            set: function (value) {
                var newValue = coercion.coerceBooleanProperty(value);
                if (newValue !== this._checked) {
                    this._checked = newValue;
                    if (this.buttonToggleGroup) {
                        this.buttonToggleGroup._syncButtonToggle(this, this._checked);
                    }
                    this._changeDetectorRef.markForCheck();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatButtonToggle.prototype, "disabled", {
            /** Whether the button is disabled. */
            get: function () {
                return this._disabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
            },
            set: function (value) { this._disabled = coercion.coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        MatButtonToggle.prototype.ngOnInit = function () {
            this._isSingleSelector = this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
            this._type = this._isSingleSelector ? 'radio' : 'checkbox';
            this.id = this.id || "mat-button-toggle-" + _uniqueIdCounter++;
            if (this._isSingleSelector) {
                this.name = this.buttonToggleGroup.name;
            }
            if (this.buttonToggleGroup && this.buttonToggleGroup._isPrechecked(this)) {
                this.checked = true;
            }
            this._focusMonitor.monitor(this._elementRef, true);
        };
        MatButtonToggle.prototype.ngOnDestroy = function () {
            var group = this.buttonToggleGroup;
            this._focusMonitor.stopMonitoring(this._elementRef);
            // Remove the toggle from the selection once it's destroyed. Needs to happen
            // on the next tick in order to avoid "changed after checked" errors.
            if (group && group._isSelected(this)) {
                group._syncButtonToggle(this, false, false, true);
            }
        };
        /** Focuses the button. */
        MatButtonToggle.prototype.focus = function (options) {
            this._buttonElement.nativeElement.focus(options);
        };
        /** Checks the button toggle due to an interaction with the underlying native button. */
        MatButtonToggle.prototype._onButtonClick = function () {
            var newChecked = this._isSingleSelector ? true : !this._checked;
            if (newChecked !== this._checked) {
                this._checked = newChecked;
                if (this.buttonToggleGroup) {
                    this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
                    this.buttonToggleGroup._onTouched();
                }
            }
            // Emit a change event when it's the single selector
            this.change.emit(new MatButtonToggleChange(this, this.value));
        };
        /**
         * Marks the button toggle as needing checking for change detection.
         * This method is exposed because the parent button toggle group will directly
         * update bound properties of the radio button.
         */
        MatButtonToggle.prototype._markForCheck = function () {
            // When the group value changes, the button will not be notified.
            // Use `markForCheck` to explicit update button toggle's status.
            this._changeDetectorRef.markForCheck();
        };
        MatButtonToggle.decorators = [
            { type: core.Component, args: [{
                        selector: 'mat-button-toggle',
                        template: "<button #button class=\"mat-button-toggle-button\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"name || null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <div class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </div>\n</button>\n\n<div class=\"mat-button-toggle-focus-overlay\"></div>\n<div class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</div>\n",
                        encapsulation: core.ViewEncapsulation.None,
                        exportAs: 'matButtonToggle',
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
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
        MatButtonToggle.ctorParameters = function () { return [
            { type: MatButtonToggleGroup, decorators: [{ type: core.Optional }] },
            { type: core.ChangeDetectorRef },
            { type: core.ElementRef },
            { type: a11y.FocusMonitor },
            { type: String, decorators: [{ type: core.Attribute, args: ['tabindex',] }] },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,] }] }
        ]; };
        MatButtonToggle.propDecorators = {
            ariaLabel: [{ type: core.Input, args: ['aria-label',] }],
            ariaLabelledby: [{ type: core.Input, args: ['aria-labelledby',] }],
            _buttonElement: [{ type: core.ViewChild, args: ['button',] }],
            id: [{ type: core.Input }],
            name: [{ type: core.Input }],
            value: [{ type: core.Input }],
            tabIndex: [{ type: core.Input }],
            appearance: [{ type: core.Input }],
            checked: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            change: [{ type: core.Output }]
        };
        return MatButtonToggle;
    }(_MatButtonToggleMixinBase));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatButtonToggleModule = /** @class */ (function () {
        function MatButtonToggleModule() {
        }
        MatButtonToggleModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [core$1.MatCommonModule, core$1.MatRippleModule],
                        exports: [core$1.MatCommonModule, MatButtonToggleGroup, MatButtonToggle],
                        declarations: [MatButtonToggleGroup, MatButtonToggle],
                    },] }
        ];
        return MatButtonToggleModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS;
    exports.MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR;
    exports.MatButtonToggle = MatButtonToggle;
    exports.MatButtonToggleChange = MatButtonToggleChange;
    exports.MatButtonToggleGroup = MatButtonToggleGroup;
    exports.MatButtonToggleGroupMultiple = MatButtonToggleGroupMultiple;
    exports.MatButtonToggleModule = MatButtonToggleModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-button-toggle.umd.js.map
