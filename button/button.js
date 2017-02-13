var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation, Input, HostBinding, ChangeDetectionStrategy, ElementRef, Renderer, NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdRippleModule, coerceBooleanProperty, CompatibilityModule } from '../core';
// TODO(jelbourn): Make the `isMouseDown` stuff done with one global listener.
// TODO(kara): Convert attribute selectors to classes when attr maps become available
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdButtonCssMatStyler = (function () {
    function MdButtonCssMatStyler() {
    }
    MdButtonCssMatStyler = __decorate([
        Directive({
            selector: 'button[md-button], button[mat-button], a[md-button], a[mat-button]',
            host: {
                '[class.mat-button]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonCssMatStyler);
    return MdButtonCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdRaisedButtonCssMatStyler = (function () {
    function MdRaisedButtonCssMatStyler() {
    }
    MdRaisedButtonCssMatStyler = __decorate([
        Directive({
            selector: 'button[md-raised-button], button[mat-raised-button], ' +
                'a[md-raised-button], a[mat-raised-button]',
            host: {
                '[class.mat-raised-button]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdRaisedButtonCssMatStyler);
    return MdRaisedButtonCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdIconButtonCssMatStyler = (function () {
    function MdIconButtonCssMatStyler() {
    }
    MdIconButtonCssMatStyler = __decorate([
        Directive({
            selector: 'button[md-icon-button], button[mat-icon-button], a[md-icon-button], a[mat-icon-button]',
            host: {
                '[class.mat-icon-button]': 'true',
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdIconButtonCssMatStyler);
    return MdIconButtonCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdFabCssMatStyler = (function () {
    function MdFabCssMatStyler() {
    }
    MdFabCssMatStyler = __decorate([
        Directive({
            selector: 'button[md-fab], button[mat-fab], a[md-fab], a[mat-fab]',
            host: {
                '[class.mat-fab]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdFabCssMatStyler);
    return MdFabCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdMiniFabCssMatStyler = (function () {
    function MdMiniFabCssMatStyler() {
    }
    MdMiniFabCssMatStyler = __decorate([
        Directive({
            selector: 'button[md-mini-fab], button[mat-mini-fab], a[md-mini-fab], a[mat-mini-fab]',
            host: {
                '[class.mat-mini-fab]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdMiniFabCssMatStyler);
    return MdMiniFabCssMatStyler;
}());
/**
 * Material design button.
 */
export var MdButton = (function () {
    function MdButton(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
        this._isKeyboardFocused = false;
        /** Whether a mousedown has occurred on this element in the last 100ms. */
        this._isMouseDown = false;
        /** Whether the ripple effect on click should be disabled. */
        this._disableRipple = false;
        this._disabled = null;
    }
    Object.defineProperty(MdButton.prototype, "disableRipple", {
        /** Whether the ripple effect for this button is disabled. */
        get: function () { return this._disableRipple; },
        set: function (v) { this._disableRipple = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButton.prototype, "disabled", {
        /** Whether the button is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value) ? true : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButton.prototype, "color", {
        /** The color of the button. Can be `primary`, `accent`, or `warn`. */
        get: function () { return this._color; },
        set: function (value) { this._updateColor(value); },
        enumerable: true,
        configurable: true
    });
    MdButton.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMouseDown = true;
        setTimeout(function () { _this._isMouseDown = false; }, 100);
    };
    MdButton.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdButton.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._getHostElement(), "mat-" + color, isAdd);
        }
    };
    MdButton.prototype._setKeyboardFocus = function () {
        this._isKeyboardFocused = !this._isMouseDown;
    };
    MdButton.prototype._removeKeyboardFocus = function () {
        this._isKeyboardFocused = false;
    };
    /** Focuses the button. */
    MdButton.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._getHostElement(), 'focus');
    };
    MdButton.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    MdButton.prototype._isRoundButton = function () {
        var el = this._getHostElement();
        return el.hasAttribute('md-icon-button') ||
            el.hasAttribute('md-fab') ||
            el.hasAttribute('md-mini-fab');
    };
    MdButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdButton.prototype, "disableRipple", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdButton.prototype, "disabled", null);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdButton.prototype, "color", null);
    MdButton = __decorate([
        Component({selector: 'button[md-button], button[md-raised-button], button[md-icon-button],' +
                'button[md-fab], button[md-mini-fab],' +
                'button[mat-button], button[mat-raised-button], button[mat-icon-button],' +
                'button[mat-fab], button[mat-mini-fab]',
            host: {
                '[disabled]': 'disabled',
                '[class.mat-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
            },
            template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span><div md-ripple *ngIf=\"!_isRippleDisabled()\" class=\"mat-button-ripple\" [class.mat-button-ripple-round]=\"_isRoundButton()\" [mdRippleTrigger]=\"_getHostElement()\"></div><div class=\"mat-button-focus-overlay\" (touchstart)=\"$event.preventDefault()\"></div>",
            styles: [".mat-button-focus.mat-button .mat-button-focus-overlay,.mat-button-focus.mat-fab .mat-button-focus-overlay,.mat-button-focus.mat-icon-button .mat-button-focus-overlay,.mat-button-focus.mat-mini-fab .mat-button-focus-overlay,.mat-button-focus.mat-raised-button .mat-button-focus-overlay,.mat-button:hover .mat-button-focus-overlay,.mat-icon-button:hover .mat-button-focus-overlay{opacity:1}.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{box-sizing:border-box;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled].mat-button,[disabled].mat-fab,[disabled].mat-icon-button,[disabled].mat-mini-fab,[disabled].mat-raised-button{cursor:default}.mat-fab,.mat-mini-fab,.mat-raised-button{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-fab:not([disabled]):active,.mat-mini-fab:not([disabled]):active,.mat-raised-button:not([disabled]):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled].mat-fab,[disabled].mat-mini-fab,[disabled].mat-raised-button{box-shadow:none}.mat-button[disabled]:hover .mat-button-focus-overlay,.mat-button[disabled]:hover.mat-accent,.mat-button[disabled]:hover.mat-primary,.mat-button[disabled]:hover.mat-warn,.mat-icon-button[disabled]:hover .mat-button-focus-overlay,.mat-icon-button[disabled]:hover.mat-accent,.mat-icon-button[disabled]:hover.mat-primary,.mat-icon-button[disabled]:hover.mat-warn{background-color:transparent}.mat-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-icon-button,.mat-mini-fab{min-width:0;width:40px;height:40px;border-radius:50%}.mat-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-fab .mat-icon,.mat-fab i{padding:16px 0;line-height:24px}.mat-mini-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);padding:0;flex-shrink:0}.mat-mini-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-mini-fab .mat-icon,.mat-mini-fab i{padding:8px 0;line-height:24px}.mat-icon-button{padding:0;flex-shrink:0;line-height:40px}.mat-icon-button .mat-icon,.mat-icon-button i{line-height:24px}.mat-button,.mat-icon-button,.mat-raised-button{color:currentColor}.mat-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*{vertical-align:middle}.mat-button-focus-overlay,.mat-button-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.mat-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;pointer-events:none;opacity:0}.mat-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.mat-button-focus-overlay{background-color:rgba(255,255,255,.5)}.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{outline:solid 1px}}"],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer])
    ], MdButton);
    return MdButton;
}());
/**
 * Raised Material design button.
 */
export var MdAnchor = (function (_super) {
    __extends(MdAnchor, _super);
    function MdAnchor(elementRef, renderer) {
        _super.call(this, elementRef, renderer);
    }
    Object.defineProperty(MdAnchor.prototype, "tabIndex", {
        /** @docs-private */
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAnchor.prototype, "_isAriaDisabled", {
        get: function () {
            return this.disabled ? 'true' : 'false';
        },
        enumerable: true,
        configurable: true
    });
    MdAnchor.prototype._haltDisabledEvents = function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    __decorate([
        HostBinding('tabIndex'), 
        __metadata('design:type', Number)
    ], MdAnchor.prototype, "tabIndex", null);
    MdAnchor = __decorate([
        Component({selector: "a[md-button], a[md-raised-button], a[md-icon-button], a[md-fab], a[md-mini-fab],\n             a[mat-button], a[mat-raised-button], a[mat-icon-button], a[mat-fab], a[mat-mini-fab]",
            host: {
                '[attr.disabled]': 'disabled',
                '[attr.aria-disabled]': '_isAriaDisabled',
                '[class.mat-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
                '(click)': '_haltDisabledEvents($event)',
            },
            template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span><div md-ripple *ngIf=\"!_isRippleDisabled()\" class=\"mat-button-ripple\" [class.mat-button-ripple-round]=\"_isRoundButton()\" [mdRippleTrigger]=\"_getHostElement()\"></div><div class=\"mat-button-focus-overlay\" (touchstart)=\"$event.preventDefault()\"></div>",
            styles: [".mat-button-focus.mat-button .mat-button-focus-overlay,.mat-button-focus.mat-fab .mat-button-focus-overlay,.mat-button-focus.mat-icon-button .mat-button-focus-overlay,.mat-button-focus.mat-mini-fab .mat-button-focus-overlay,.mat-button-focus.mat-raised-button .mat-button-focus-overlay,.mat-button:hover .mat-button-focus-overlay,.mat-icon-button:hover .mat-button-focus-overlay{opacity:1}.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{box-sizing:border-box;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled].mat-button,[disabled].mat-fab,[disabled].mat-icon-button,[disabled].mat-mini-fab,[disabled].mat-raised-button{cursor:default}.mat-fab,.mat-mini-fab,.mat-raised-button{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-fab:not([disabled]):active,.mat-mini-fab:not([disabled]):active,.mat-raised-button:not([disabled]):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled].mat-fab,[disabled].mat-mini-fab,[disabled].mat-raised-button{box-shadow:none}.mat-button[disabled]:hover .mat-button-focus-overlay,.mat-button[disabled]:hover.mat-accent,.mat-button[disabled]:hover.mat-primary,.mat-button[disabled]:hover.mat-warn,.mat-icon-button[disabled]:hover .mat-button-focus-overlay,.mat-icon-button[disabled]:hover.mat-accent,.mat-icon-button[disabled]:hover.mat-primary,.mat-icon-button[disabled]:hover.mat-warn{background-color:transparent}.mat-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-icon-button,.mat-mini-fab{min-width:0;width:40px;height:40px;border-radius:50%}.mat-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-fab .mat-icon,.mat-fab i{padding:16px 0;line-height:24px}.mat-mini-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);padding:0;flex-shrink:0}.mat-mini-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-mini-fab .mat-icon,.mat-mini-fab i{padding:8px 0;line-height:24px}.mat-icon-button{padding:0;flex-shrink:0;line-height:40px}.mat-icon-button .mat-icon,.mat-icon-button i{line-height:24px}.mat-button,.mat-icon-button,.mat-raised-button{color:currentColor}.mat-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*{vertical-align:middle}.mat-button-focus-overlay,.mat-button-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.mat-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;pointer-events:none;opacity:0}.mat-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.mat-button-focus-overlay{background-color:rgba(255,255,255,.5)}.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{outline:solid 1px}}"],
            encapsulation: ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer])
    ], MdAnchor);
    return MdAnchor;
}(MdButton));
export var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    /** @deprecated */
    MdButtonModule.forRoot = function () {
        return {
            ngModule: MdButtonModule,
            providers: []
        };
    };
    MdButtonModule = __decorate([
        NgModule({
            imports: [CommonModule, MdRippleModule, CompatibilityModule],
            exports: [
                MdButton, MdAnchor,
                CompatibilityModule,
                MdButtonCssMatStyler,
                MdRaisedButtonCssMatStyler,
                MdIconButtonCssMatStyler,
                MdFabCssMatStyler,
                MdMiniFabCssMatStyler
            ],
            declarations: [
                MdButton,
                MdAnchor,
                MdButtonCssMatStyler,
                MdRaisedButtonCssMatStyler,
                MdIconButtonCssMatStyler,
                MdFabCssMatStyler,
                MdMiniFabCssMatStyler
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonModule);
    return MdButtonModule;
}());
//# sourceMappingURL=button.js.map