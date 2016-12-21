var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { ENTER, SPACE } from '../core/keyboard/keycodes';
import { coerceBooleanProperty } from '../core/coercion/boolean-property';
/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueIdCounter = 0;
/**
 * Single option inside of a `<md-select>` element.
 */
export var MdOption = (function () {
    function MdOption(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this._selected = false;
        /** Whether the option is disabled.  */
        this._disabled = false;
        this._id = "md-select-option-" + _uniqueIdCounter++;
        /** Event emitted when the option is selected. */
        this.onSelect = new EventEmitter();
    }
    Object.defineProperty(MdOption.prototype, "id", {
        /** The unique ID of the option. */
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "disabled", {
        /** Whether the option is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "selected", {
        /** Whether or not the option is currently selected. */
        get: function () {
            return this._selected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "viewValue", {
        /**
         * The displayed value of the option. It is necessary to show the selected option in the
         * select's trigger.
         */
        get: function () {
            // TODO(kara): Add input property alternative for node envs.
            return this._getHostElement().textContent.trim();
        },
        enumerable: true,
        configurable: true
    });
    /** Selects the option. */
    MdOption.prototype.select = function () {
        this._selected = true;
        this.onSelect.emit();
    };
    /** Deselects the option. */
    MdOption.prototype.deselect = function () {
        this._selected = false;
    };
    /** Sets focus onto this option. */
    MdOption.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._getHostElement(), 'focus');
    };
    /** Ensures the option is selected when activated from the keyboard. */
    MdOption.prototype._handleKeydown = function (event) {
        if (event.keyCode === ENTER || event.keyCode === SPACE) {
            this._selectViaInteraction();
        }
    };
    /**
     * Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.
     */
    MdOption.prototype._selectViaInteraction = function () {
        if (!this.disabled) {
            this._selected = true;
            this.onSelect.emit(true);
        }
    };
    /** Returns the correct tabindex for the option depending on disabled state. */
    MdOption.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    MdOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdOption.prototype, "value", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdOption.prototype, "disabled", null);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MdOption.prototype, "onSelect", void 0);
    MdOption = __decorate([
        Component({selector: 'md-option, mat-option',
            host: {
                'role': 'option',
                '[attr.tabindex]': '_getTabIndex()',
                '[class.md-selected]': 'selected',
                '[id]': 'id',
                '[attr.aria-selected]': 'selected.toString()',
                '[attr.aria-disabled]': 'disabled.toString()',
                '[class.md-option-disabled]': 'disabled',
                '(click)': '_selectViaInteraction()',
                '(keydown)': '_handleKeydown($event)'
            },
            template: "<ng-content></ng-content><div class=\"md-option-ripple\" *ngIf=\"!disabled\" md-ripple mdRippleBackgroundColor=\"rgba(0,0,0,0)\" [mdRippleTrigger]=\"_getHostElement()\"></div>",
            styles: [".md-select-value,md-option{white-space:nowrap;text-overflow:ellipsis}md-select{display:inline-block;outline:0}.md-select-trigger{display:flex;justify-content:space-between;align-items:center;height:30px;min-width:112px;cursor:pointer;position:relative;box-sizing:border-box}[aria-disabled=true] .md-select-trigger{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-bottom:transparent;background-position:0 bottom;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-select-placeholder{position:relative;padding:0 2px;transform-origin:left top}.md-select-placeholder.md-floating-placeholder{top:-22px;left:-2px;transform:scale(.75)}[dir=rtl] .md-select-placeholder{transform-origin:right top}[dir=rtl] .md-select-placeholder.md-floating-placeholder{left:2px}[aria-required=true] .md-select-placeholder::after{content:'*'}.md-select-value{position:absolute;overflow-x:hidden;left:0;top:6px}[dir=rtl] .md-select-value{left:auto;right:0}.md-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.md-select-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px}@media screen and (-ms-high-contrast:active){.md-select-panel{outline:solid 1px}.md-option-ripple{opacity:.5}}md-option{overflow-x:hidden;display:flex;flex-direction:row;align-items:center;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,\"Helvetica Neue\",sans-serif;text-align:start;text-decoration:none;position:relative;cursor:pointer;outline:0}md-option[disabled]{cursor:default}md-option md-icon{margin-right:16px}[dir=rtl] md-option md-icon{margin-left:16px}md-option[aria-disabled=true]{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-option-ripple{position:absolute;top:0;left:0;bottom:0;right:0}"],
            encapsulation: ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer])
    ], MdOption);
    return MdOption;
}());

//# sourceMappingURL=option.js.map
