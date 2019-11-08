(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/material/core'), require('tslib'), require('@angular/cdk/a11y'), require('@angular/cdk/coercion'), require('@angular/cdk/collections'), require('@angular/forms'), require('@angular/platform-browser/animations')) :
    typeof define === 'function' && define.amd ? define('@angular/material/radio', ['exports', '@angular/common', '@angular/core', '@angular/material/core', 'tslib', '@angular/cdk/a11y', '@angular/cdk/coercion', '@angular/cdk/collections', '@angular/forms', '@angular/platform-browser/animations'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.radio = {}), global.ng.common, global.ng.core, global.ng.material.core, global.tslib, global.ng.cdk.a11y, global.ng.cdk.coercion, global.ng.cdk.collections, global.ng.forms, global.ng.platformBrowser.animations));
}(this, (function (exports, common, core, core$1, tslib, a11y, coercion, collections, forms, animations) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MAT_RADIO_DEFAULT_OPTIONS = new core.InjectionToken('mat-radio-default-options', {
        providedIn: 'root',
        factory: MAT_RADIO_DEFAULT_OPTIONS_FACTORY
    });
    function MAT_RADIO_DEFAULT_OPTIONS_FACTORY() {
        return {
            color: 'accent'
        };
    }
    // Increasing integer for generating unique ids for radio components.
    var nextUniqueId = 0;
    /**
     * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
     * allows it to support [(ngModel)] and ngControl.
     * @docs-private
     */
    var MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return MatRadioGroup; }),
        multi: true
    };
    /** Change event object emitted by MatRadio and MatRadioGroup. */
    var MatRadioChange = /** @class */ (function () {
        function MatRadioChange(
        /** The MatRadioButton that emits the change event. */
        source, 
        /** The value of the MatRadioButton. */
        value) {
            this.source = source;
            this.value = value;
        }
        return MatRadioChange;
    }());
    /**
     * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
     */
    var MatRadioGroup = /** @class */ (function () {
        function MatRadioGroup(_changeDetector) {
            this._changeDetector = _changeDetector;
            /** Selected value for the radio group. */
            this._value = null;
            /** The HTML name attribute applied to radio buttons in this group. */
            this._name = "mat-radio-group-" + nextUniqueId++;
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
            this._controlValueAccessorChangeFn = function () { };
            /**
             * onTouch function registered via registerOnTouch (ControlValueAccessor).
             * @docs-private
             */
            this.onTouched = function () { };
            /**
             * Event emitted when the group value changes.
             * Change events are only emitted when the value changes due to user interaction with
             * a radio button (the same behavior as `<input type-"radio">`).
             */
            this.change = new core.EventEmitter();
        }
        Object.defineProperty(MatRadioGroup.prototype, "name", {
            /** Name of the radio button group. All radio buttons inside this group will use this name. */
            get: function () { return this._name; },
            set: function (value) {
                this._name = value;
                this._updateRadioButtonNames();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioGroup.prototype, "labelPosition", {
            /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
            get: function () {
                return this._labelPosition;
            },
            set: function (v) {
                this._labelPosition = v === 'before' ? 'before' : 'after';
                this._markRadiosForCheck();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioGroup.prototype, "value", {
            /**
             * Value for the radio-group. Should equal the value of the selected radio button if there is
             * a corresponding radio button with a matching value. If there is not such a corresponding
             * radio button, this value persists to be applied in case a new radio button is added with a
             * matching value.
             */
            get: function () { return this._value; },
            set: function (newValue) {
                if (this._value !== newValue) {
                    // Set this before proceeding to ensure no circular loop occurs with selection.
                    this._value = newValue;
                    this._updateSelectedRadioFromValue();
                    this._checkSelectedRadioButton();
                }
            },
            enumerable: true,
            configurable: true
        });
        MatRadioGroup.prototype._checkSelectedRadioButton = function () {
            if (this._selected && !this._selected.checked) {
                this._selected.checked = true;
            }
        };
        Object.defineProperty(MatRadioGroup.prototype, "selected", {
            /**
             * The currently selected radio button. If set to a new radio button, the radio group value
             * will be updated to match the new selected button.
             */
            get: function () { return this._selected; },
            set: function (selected) {
                this._selected = selected;
                this.value = selected ? selected.value : null;
                this._checkSelectedRadioButton();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioGroup.prototype, "disabled", {
            /** Whether the radio group is disabled */
            get: function () { return this._disabled; },
            set: function (value) {
                this._disabled = coercion.coerceBooleanProperty(value);
                this._markRadiosForCheck();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioGroup.prototype, "required", {
            /** Whether the radio group is required */
            get: function () { return this._required; },
            set: function (value) {
                this._required = coercion.coerceBooleanProperty(value);
                this._markRadiosForCheck();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initialize properties once content children are available.
         * This allows us to propagate relevant attributes to associated buttons.
         */
        MatRadioGroup.prototype.ngAfterContentInit = function () {
            // Mark this component as initialized in AfterContentInit because the initial value can
            // possibly be set by NgModel on MatRadioGroup, and it is possible that the OnInit of the
            // NgModel occurs *after* the OnInit of the MatRadioGroup.
            this._isInitialized = true;
        };
        /**
         * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
         * radio buttons upon their blur.
         */
        MatRadioGroup.prototype._touch = function () {
            if (this.onTouched) {
                this.onTouched();
            }
        };
        MatRadioGroup.prototype._updateRadioButtonNames = function () {
            var _this = this;
            if (this._radios) {
                this._radios.forEach(function (radio) {
                    radio.name = _this.name;
                    radio._markForCheck();
                });
            }
        };
        /** Updates the `selected` radio button from the internal _value state. */
        MatRadioGroup.prototype._updateSelectedRadioFromValue = function () {
            var _this = this;
            // If the value already matches the selected radio, do nothing.
            var isAlreadySelected = this._selected !== null && this._selected.value === this._value;
            if (this._radios && !isAlreadySelected) {
                this._selected = null;
                this._radios.forEach(function (radio) {
                    radio.checked = _this.value === radio.value;
                    if (radio.checked) {
                        _this._selected = radio;
                    }
                });
            }
        };
        /** Dispatch change event with current selection and group value. */
        MatRadioGroup.prototype._emitChangeEvent = function () {
            if (this._isInitialized) {
                this.change.emit(new MatRadioChange(this._selected, this._value));
            }
        };
        MatRadioGroup.prototype._markRadiosForCheck = function () {
            if (this._radios) {
                this._radios.forEach(function (radio) { return radio._markForCheck(); });
            }
        };
        /**
         * Sets the model value. Implemented as part of ControlValueAccessor.
         * @param value
         */
        MatRadioGroup.prototype.writeValue = function (value) {
            this.value = value;
            this._changeDetector.markForCheck();
        };
        /**
         * Registers a callback to be triggered when the model value changes.
         * Implemented as part of ControlValueAccessor.
         * @param fn Callback to be registered.
         */
        MatRadioGroup.prototype.registerOnChange = function (fn) {
            this._controlValueAccessorChangeFn = fn;
        };
        /**
         * Registers a callback to be triggered when the control is touched.
         * Implemented as part of ControlValueAccessor.
         * @param fn Callback to be registered.
         */
        MatRadioGroup.prototype.registerOnTouched = function (fn) {
            this.onTouched = fn;
        };
        /**
         * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
         * @param isDisabled Whether the control should be disabled.
         */
        MatRadioGroup.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
            this._changeDetector.markForCheck();
        };
        MatRadioGroup.decorators = [
            { type: core.Directive, args: [{
                        selector: 'mat-radio-group',
                        exportAs: 'matRadioGroup',
                        providers: [MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
                        host: {
                            'role': 'radiogroup',
                            'class': 'mat-radio-group',
                        },
                    },] }
        ];
        /** @nocollapse */
        MatRadioGroup.ctorParameters = function () { return [
            { type: core.ChangeDetectorRef }
        ]; };
        MatRadioGroup.propDecorators = {
            change: [{ type: core.Output }],
            _radios: [{ type: core.ContentChildren, args: [core.forwardRef(function () { return MatRadioButton; }), { descendants: true },] }],
            color: [{ type: core.Input }],
            name: [{ type: core.Input }],
            labelPosition: [{ type: core.Input }],
            value: [{ type: core.Input }],
            selected: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            required: [{ type: core.Input }]
        };
        return MatRadioGroup;
    }());
    // Boilerplate for applying mixins to MatRadioButton.
    /** @docs-private */
    var MatRadioButtonBase = /** @class */ (function () {
        function MatRadioButtonBase(_elementRef) {
            this._elementRef = _elementRef;
        }
        return MatRadioButtonBase;
    }());
    // As per Material design specifications the selection control radio should use the accent color
    // palette by default. https://material.io/guidelines/components/selection-controls.html
    var _MatRadioButtonMixinBase = core$1.mixinDisableRipple(core$1.mixinTabIndex(MatRadioButtonBase));
    /**
     * A Material design radio-button. Typically placed inside of `<mat-radio-group>` elements.
     */
    var MatRadioButton = /** @class */ (function (_super) {
        tslib.__extends(MatRadioButton, _super);
        function MatRadioButton(radioGroup, elementRef, _changeDetector, _focusMonitor, _radioDispatcher, _animationMode, _providerOverride) {
            var _this = _super.call(this, elementRef) || this;
            _this._changeDetector = _changeDetector;
            _this._focusMonitor = _focusMonitor;
            _this._radioDispatcher = _radioDispatcher;
            _this._animationMode = _animationMode;
            _this._providerOverride = _providerOverride;
            _this._uniqueId = "mat-radio-" + ++nextUniqueId;
            /** The unique ID for the radio button. */
            _this.id = _this._uniqueId;
            /**
             * Event emitted when the checked state of this radio button changes.
             * Change events are only emitted when the value changes due to user interaction with
             * the radio button (the same behavior as `<input type-"radio">`).
             */
            _this.change = new core.EventEmitter();
            /** Whether this radio is checked. */
            _this._checked = false;
            /** Value assigned to this radio. */
            _this._value = null;
            /** Unregister function for _radioDispatcher */
            _this._removeUniqueSelectionListener = function () { };
            // Assertions. Ideally these should be stripped out by the compiler.
            // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
            _this.radioGroup = radioGroup;
            _this._removeUniqueSelectionListener =
                _radioDispatcher.listen(function (id, name) {
                    if (id !== _this.id && name === _this.name) {
                        _this.checked = false;
                    }
                });
            return _this;
        }
        Object.defineProperty(MatRadioButton.prototype, "checked", {
            /** Whether this radio button is checked. */
            get: function () { return this._checked; },
            set: function (value) {
                var newCheckedState = coercion.coerceBooleanProperty(value);
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioButton.prototype, "value", {
            /** The value of this radio button. */
            get: function () { return this._value; },
            set: function (value) {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioButton.prototype, "labelPosition", {
            /** Whether the label should appear after or before the radio button. Defaults to 'after' */
            get: function () {
                return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
            },
            set: function (value) {
                this._labelPosition = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioButton.prototype, "disabled", {
            /** Whether the radio button is disabled. */
            get: function () {
                return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
            },
            set: function (value) {
                var newDisabledState = coercion.coerceBooleanProperty(value);
                if (this._disabled !== newDisabledState) {
                    this._disabled = newDisabledState;
                    this._changeDetector.markForCheck();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioButton.prototype, "required", {
            /** Whether the radio button is required. */
            get: function () {
                return this._required || (this.radioGroup && this.radioGroup.required);
            },
            set: function (value) {
                this._required = coercion.coerceBooleanProperty(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioButton.prototype, "color", {
            /** Theme color of the radio button. */
            get: function () {
                return this._color ||
                    (this.radioGroup && this.radioGroup.color) ||
                    this._providerOverride && this._providerOverride.color || 'accent';
            },
            set: function (newValue) { this._color = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRadioButton.prototype, "inputId", {
            /** ID of the native input element inside `<mat-radio-button>` */
            get: function () { return (this.id || this._uniqueId) + "-input"; },
            enumerable: true,
            configurable: true
        });
        /** Focuses the radio button. */
        MatRadioButton.prototype.focus = function (options) {
            this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
        };
        /**
         * Marks the radio button as needing checking for change detection.
         * This method is exposed because the parent radio group will directly
         * update bound properties of the radio button.
         */
        MatRadioButton.prototype._markForCheck = function () {
            // When group value changes, the button will not be notified. Use `markForCheck` to explicit
            // update radio button's status
            this._changeDetector.markForCheck();
        };
        MatRadioButton.prototype.ngOnInit = function () {
            if (this.radioGroup) {
                // If the radio is inside a radio group, determine if it should be checked
                this.checked = this.radioGroup.value === this._value;
                // Copy name from parent radio group
                this.name = this.radioGroup.name;
            }
        };
        MatRadioButton.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._focusMonitor
                .monitor(this._elementRef, true)
                .subscribe(function (focusOrigin) {
                if (!focusOrigin && _this.radioGroup) {
                    _this.radioGroup._touch();
                }
            });
        };
        MatRadioButton.prototype.ngOnDestroy = function () {
            this._focusMonitor.stopMonitoring(this._elementRef);
            this._removeUniqueSelectionListener();
        };
        /** Dispatch change event with current value. */
        MatRadioButton.prototype._emitChangeEvent = function () {
            this.change.emit(new MatRadioChange(this, this._value));
        };
        MatRadioButton.prototype._isRippleDisabled = function () {
            return this.disableRipple || this.disabled;
        };
        MatRadioButton.prototype._onInputClick = function (event) {
            // We have to stop propagation for click events on the visual hidden input element.
            // By default, when a user clicks on a label element, a generated click event will be
            // dispatched on the associated input element. Since we are using a label element as our
            // root container, the click event on the `radio-button` will be executed twice.
            // The real click event will bubble up, and the generated click event also tries to bubble up.
            // This will lead to multiple click events.
            // Preventing bubbling for the second event will solve that issue.
            event.stopPropagation();
        };
        /**
         * Triggered when the radio button received a click or the input recognized any change.
         * Clicking on a label element, will trigger a change event on the associated input.
         */
        MatRadioButton.prototype._onInputChange = function (event) {
            // We always have to stop propagation on the change event.
            // Otherwise the change event, from the input element, will bubble up and
            // emit its event object to the `change` output.
            event.stopPropagation();
            var groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
            this.checked = true;
            this._emitChangeEvent();
            if (this.radioGroup) {
                this.radioGroup._controlValueAccessorChangeFn(this.value);
                if (groupValueChanged) {
                    this.radioGroup._emitChangeEvent();
                }
            }
        };
        MatRadioButton.decorators = [
            { type: core.Component, args: [{
                        selector: 'mat-radio-button',
                        template: "<!-- TODO(jelbourn): render the radio on either side of the content -->\n<!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. -->\n<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label>\n  <!-- The actual 'radio' part of the control. -->\n  <div class=\"mat-radio-container\">\n    <div class=\"mat-radio-outer-circle\"></div>\n    <div class=\"mat-radio-inner-circle\"></div>\n    <div mat-ripple class=\"mat-radio-ripple\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleCentered]=\"true\"\n         [matRippleRadius]=\"20\"\n         [matRippleAnimation]=\"{enterDuration: 150}\">\n\n      <div class=\"mat-ripple-element mat-radio-persistent-ripple\"></div>\n    </div>\n\n    <input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\"\n        [id]=\"inputId\"\n        [checked]=\"checked\"\n        [disabled]=\"disabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.name]=\"name\"\n        [attr.value]=\"value\"\n        [required]=\"required\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-describedby]=\"ariaDescribedby\"\n        (change)=\"_onInputChange($event)\"\n        (click)=\"_onInputClick($event)\">\n  </div>\n\n  <!-- The label content for radio control. -->\n  <div class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </div>\n</label>\n",
                        inputs: ['disableRipple', 'tabIndex'],
                        encapsulation: core.ViewEncapsulation.None,
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
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: [".mat-radio-button{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.mat-radio-label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;width:100%}.mat-radio-container{box-sizing:border-box;display:inline-block;position:relative;width:20px;height:20px;flex-shrink:0}.mat-radio-outer-circle{box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}._mat-animation-noopable .mat-radio-outer-circle{transition:none}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:transform ease 280ms,background-color ease 280ms;width:20px;transform:scale(0.001)}._mat-animation-noopable .mat-radio-inner-circle{transition:none}.mat-radio-checked .mat-radio-inner-circle{transform:scale(0.5)}.cdk-high-contrast-active .mat-radio-checked .mat-radio-inner-circle{border:solid 10px}.mat-radio-label-content{-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto;display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-button .mat-radio-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-radio-button .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple){opacity:.16}.mat-radio-persistent-ripple{width:100%;height:100%;transform:none}.mat-radio-container:hover .mat-radio-persistent-ripple{opacity:.04}.mat-radio-button:not(.mat-radio-disabled).cdk-keyboard-focused .mat-radio-persistent-ripple,.mat-radio-button:not(.mat-radio-disabled).cdk-program-focused .mat-radio-persistent-ripple{opacity:.12}.mat-radio-persistent-ripple,.mat-radio-disabled .mat-radio-container:hover .mat-radio-persistent-ripple{opacity:0}@media(hover: none){.mat-radio-container:hover .mat-radio-persistent-ripple{display:none}}.mat-radio-input{bottom:0;left:50%}.cdk-high-contrast-active .mat-radio-disabled{opacity:.5}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatRadioButton.ctorParameters = function () { return [
            { type: MatRadioGroup, decorators: [{ type: core.Optional }] },
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef },
            { type: a11y.FocusMonitor },
            { type: collections.UniqueSelectionDispatcher },
            { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [animations.ANIMATION_MODULE_TYPE,] }] },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [MAT_RADIO_DEFAULT_OPTIONS,] }] }
        ]; };
        MatRadioButton.propDecorators = {
            id: [{ type: core.Input }],
            name: [{ type: core.Input }],
            ariaLabel: [{ type: core.Input, args: ['aria-label',] }],
            ariaLabelledby: [{ type: core.Input, args: ['aria-labelledby',] }],
            ariaDescribedby: [{ type: core.Input, args: ['aria-describedby',] }],
            checked: [{ type: core.Input }],
            value: [{ type: core.Input }],
            labelPosition: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            required: [{ type: core.Input }],
            color: [{ type: core.Input }],
            change: [{ type: core.Output }],
            _inputElement: [{ type: core.ViewChild, args: ['input',] }]
        };
        return MatRadioButton;
    }(_MatRadioButtonMixinBase));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatRadioModule = /** @class */ (function () {
        function MatRadioModule() {
        }
        MatRadioModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, core$1.MatRippleModule, core$1.MatCommonModule],
                        exports: [MatRadioGroup, MatRadioButton, core$1.MatCommonModule],
                        declarations: [MatRadioGroup, MatRadioButton],
                    },] }
        ];
        return MatRadioModule;
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

    exports.MAT_RADIO_DEFAULT_OPTIONS = MAT_RADIO_DEFAULT_OPTIONS;
    exports.MAT_RADIO_DEFAULT_OPTIONS_FACTORY = MAT_RADIO_DEFAULT_OPTIONS_FACTORY;
    exports.MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR;
    exports.MatRadioButton = MatRadioButton;
    exports.MatRadioChange = MatRadioChange;
    exports.MatRadioGroup = MatRadioGroup;
    exports.MatRadioModule = MatRadioModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-radio.umd.js.map
