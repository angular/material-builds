var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { NgModule, Component, ContentChildren, Directive, ElementRef, Renderer, EventEmitter, HostBinding, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UniqueSelectionDispatcher, coerceBooleanProperty, UNIQUE_SELECTION_DISPATCHER_PROVIDER, CompatibilityModule } from '../core';
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export var MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter = 0;
/** Change event object emitted by MdButtonToggle. */
export var MdButtonToggleChange = (function () {
    function MdButtonToggleChange() {
    }
    return MdButtonToggleChange;
}());
/** Exclusive selection button toggle group that behaves like a radio-button group. */
export var MdButtonToggleGroup = (function () {
    function MdButtonToggleGroup() {
        /** The value for the button toggle group. Should match currently selected button toggle. */
        this._value = null;
        /** The HTML name attribute applied to toggles in this group. */
        this._name = "md-button-toggle-group-" + _uniqueIdCounter++;
        /** Disables all toggles in the group. */
        this._disabled = null;
        /** Whether the button toggle group should be vertical. */
        this._vertical = false;
        /** The currently selected button toggle, should match the value. */
        this._selected = null;
        /** Whether the button toggle group is initialized or not. */
        this._isInitialized = false;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        this._controlValueAccessorChangeFn = function (value) { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /** Event emitted when the group's value changes. */
        this._change = new EventEmitter();
        /** Child button toggle buttons. */
        this._buttonToggles = null;
    }
    Object.defineProperty(MdButtonToggleGroup.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggleGroup.prototype.ngAfterViewInit = function () {
        this._isInitialized = true;
    };
    Object.defineProperty(MdButtonToggleGroup.prototype, "name", {
        /** `name` attribute for the underlying `input` element. */
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "disabled", {
        /** Whether the toggle group is disabled. */
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "vertical", {
        /** Whether the toggle group is vertical. */
        get: function () {
            return this._vertical;
        },
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "value", {
        /** Value of the toggle group. */
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this._updateSelectedButtonToggleFromValue();
                // Only emit a change event if the view is completely initialized.
                // We don't want to emit a change event for the initial values.
                if (this._isInitialized) {
                    this._emitChangeEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "selected", {
        /** Whether the toggle group is selected. */
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggleGroup.prototype._updateButtonToggleNames = function () {
        var _this = this;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) {
                toggle.name = _this._name;
            });
        }
    };
    // TODO: Refactor into shared code with radio.
    MdButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = function () {
        var _this = this;
        var isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
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
    MdButtonToggleGroup.prototype._emitChangeEvent = function () {
        var event = new MdButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this._change.emit(event);
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    MdButtonToggleGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn On change callback function.
     */
    MdButtonToggleGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn On touch callback function.
     */
    MdButtonToggleGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param isDisabled Whether the component should be disabled.
     */
    MdButtonToggleGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    __decorate([
        Output(), 
        __metadata('design:type', Observable)
    ], MdButtonToggleGroup.prototype, "change", null);
    __decorate([
        ContentChildren(forwardRef(function () { return MdButtonToggle; })), 
        __metadata('design:type', QueryList)
    ], MdButtonToggleGroup.prototype, "_buttonToggles", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdButtonToggleGroup.prototype, "name", null);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggleGroup.prototype, "disabled", null);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggleGroup.prototype, "vertical", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdButtonToggleGroup.prototype, "value", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdButtonToggleGroup.prototype, "selected", null);
    MdButtonToggleGroup = __decorate([
        Directive({
            selector: 'md-button-toggle-group:not([multiple]), mat-button-toggle-group:not([multiple])',
            providers: [MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
            host: {
                '[class.mat-button-toggle-group]': 'true',
                'role': 'radiogroup',
                '[class.mat-button-toggle-vertical]': 'vertical'
            },
            exportAs: 'mdButtonToggleGroup',
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleGroup);
    return MdButtonToggleGroup;
}());
/** Multiple selection button-toggle group. `ngModel` is not supported in this mode. */
export var MdButtonToggleGroupMultiple = (function () {
    function MdButtonToggleGroupMultiple() {
        /** Disables all toggles in the group. */
        this._disabled = null;
        /** Whether the button toggle group should be vertical. */
        this._vertical = false;
    }
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "disabled", {
        /** Whether the toggle group is disabled. */
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "vertical", {
        /** Whether the toggle group is vertical. */
        get: function () {
            return this._vertical;
        },
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggleGroupMultiple.prototype, "disabled", null);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggleGroupMultiple.prototype, "vertical", null);
    MdButtonToggleGroupMultiple = __decorate([
        Directive({
            selector: 'md-button-toggle-group[multiple], mat-button-toggle-group[multiple]',
            exportAs: 'mdButtonToggleGroup',
            host: {
                '[class.mat-button-toggle-group]': 'true',
                '[class.mat-button-toggle-vertical]': 'vertical'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleGroupMultiple);
    return MdButtonToggleGroupMultiple;
}());
/** Single button inside of a toggle group. */
export var MdButtonToggle = (function () {
    function MdButtonToggle(toggleGroup, toggleGroupMultiple, buttonToggleDispatcher, _renderer) {
        var _this = this;
        this.buttonToggleDispatcher = buttonToggleDispatcher;
        this._renderer = _renderer;
        /** Whether or not this button toggle is checked. */
        this._checked = false;
        /** Whether or not this button toggle is disabled. */
        this._disabled = null;
        /** Value assigned to this button toggle. */
        this._value = null;
        /** Whether or not the button toggle is a single selection. */
        this._isSingleSelector = null;
        /** Event emitted when the group value changes. */
        this._change = new EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            buttonToggleDispatcher.listen(function (id, name) {
                if (id != _this.id && name == _this.name) {
                    _this.checked = false;
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
    Object.defineProperty(MdButtonToggle.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggle.prototype.ngOnInit = function () {
        if (this.id == null) {
            this.id = "md-button-toggle-" + _uniqueIdCounter++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
    };
    Object.defineProperty(MdButtonToggle.prototype, "inputId", {
        /** Unique ID for the underlying `input` element. */
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "checked", {
        /** Whether the button is checked. */
        get: function () {
            return this._checked;
        },
        set: function (newCheckedState) {
            if (this._isSingleSelector) {
                if (newCheckedState) {
                    // Notify all button toggles with the same name (in the same group) to un-check.
                    this.buttonToggleDispatcher.notify(this.id, this.name);
                }
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "value", {
        /** MdButtonToggleGroup reads this to assign its own value. */
        get: function () {
            return this._value;
        },
        set: function (value) {
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
    /** Dispatch change event with current value. */
    MdButtonToggle.prototype._emitChangeEvent = function () {
        var event = new MdButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this._change.emit(event);
    };
    Object.defineProperty(MdButtonToggle.prototype, "disabled", {
        /** Whether the button is disabled. */
        get: function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    /** Toggle the state of the current button toggle. */
    MdButtonToggle.prototype._toggle = function () {
        this.checked = !this.checked;
    };
    /** Checks the button toggle due to an interaction with the underlying native input. */
    MdButtonToggle.prototype._onInputChange = function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup.onTouched();
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    };
    MdButtonToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /** Focuses the button. */
    MdButtonToggle.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
    };
    __decorate([
        HostBinding(),
        Input(), 
        __metadata('design:type', String)
    ], MdButtonToggle.prototype, "id", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdButtonToggle.prototype, "name", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Observable)
    ], MdButtonToggle.prototype, "change", null);
    __decorate([
        ViewChild('input'), 
        __metadata('design:type', ElementRef)
    ], MdButtonToggle.prototype, "_inputElement", void 0);
    __decorate([
        HostBinding('class.mat-button-toggle-checked'),
        Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggle.prototype, "checked", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdButtonToggle.prototype, "value", null);
    __decorate([
        HostBinding('class.mat-button-toggle-disabled'),
        Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggle.prototype, "disabled", null);
    MdButtonToggle = __decorate([
        Component({selector: 'md-button-toggle, mat-button-toggle',
            template: "<label [attr.for]=\"inputId\" class=\"mat-button-toggle-label\"><input #input class=\"mat-button-toggle-input cdk-visually-hidden\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-button-toggle-label-content\"><ng-content></ng-content></div></label>",
            styles: [".mat-button-toggle-group{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);position:relative;display:inline-flex;flex-direction:row;border-radius:2px;cursor:pointer;white-space:nowrap}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle-disabled .mat-button-toggle-label-content{cursor:default}.mat-button-toggle{white-space:nowrap;font-family:Roboto,\"Helvetica Neue\",sans-serif}.mat-button-toggle-label-content{display:inline-block;line-height:36px;padding:0 16px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mat-button-toggle-label-content>*{vertical-align:middle}"],
            encapsulation: ViewEncapsulation.None,
            host: {
                '[class.mat-button-toggle]': 'true'
            }
        }),
        __param(0, Optional()),
        __param(1, Optional()), 
        __metadata('design:paramtypes', [MdButtonToggleGroup, MdButtonToggleGroupMultiple, UniqueSelectionDispatcher, Renderer])
    ], MdButtonToggle);
    return MdButtonToggle;
}());
export var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    /** @deprecated */
    MdButtonToggleModule.forRoot = function () {
        return {
            ngModule: MdButtonToggleModule,
            providers: []
        };
    };
    MdButtonToggleModule = __decorate([
        NgModule({
            imports: [FormsModule, CompatibilityModule],
            exports: [
                MdButtonToggleGroup,
                MdButtonToggleGroupMultiple,
                MdButtonToggle,
                CompatibilityModule,
            ],
            declarations: [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle],
            providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleModule);
    return MdButtonToggleModule;
}());
//# sourceMappingURL=button-toggle.js.map