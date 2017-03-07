var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Input, Renderer } from '@angular/core';
import { coerceBooleanProperty } from '../core/coercion/boolean-property';
/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
export var MdMenuItem = (function () {
    function MdMenuItem(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** Whether the menu item is disabled */
        this._disabled = false;
    }
    /** Focuses the menu item. */
    MdMenuItem.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._getHostElement(), 'focus');
    };
    Object.defineProperty(MdMenuItem.prototype, "disabled", {
        /** Whether the menu item is disabled. */
        get: function () { return this._disabled; },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /** Used to set the `tabindex`. */
    MdMenuItem.prototype._getTabIndex = function () {
        return this._disabled ? '-1' : '0';
    };
    /** Used to set the HTML `disabled` attribute. Necessary for links to be disabled properly. */
    MdMenuItem.prototype._getDisabledAttr = function () {
        return this._disabled ? true : null;
    };
    /** Returns the host DOM element. */
    MdMenuItem.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    /** Prevents the default element actions if it is disabled. */
    MdMenuItem.prototype._checkDisabled = function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdMenuItem.prototype, "disabled", null);
    MdMenuItem = __decorate([
        Component({selector: '[md-menu-item], [mat-menu-item]',
            host: {
                'role': 'menuitem',
                '[class.mat-menu-item]': 'true',
                '[attr.tabindex]': '_getTabIndex()',
                '[attr.aria-disabled]': 'disabled.toString()',
                '[attr.disabled]': '_getDisabledAttr()',
                '(click)': '_checkDisabled($event)',
            },
            template: "<ng-content></ng-content><div class=\"mat-menu-ripple\" *ngIf=\"!disabled\" md-ripple [mdRippleTrigger]=\"_getHostElement()\"></div>",
            exportAs: 'mdMenuItem'
        }), 
        __metadata('design:paramtypes', [Renderer, ElementRef])
    ], MdMenuItem);
    return MdMenuItem;
}());
//# sourceMappingURL=menu-item.js.map