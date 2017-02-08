// TODO(kara): prevent-close functionality
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
import { Attribute, Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdMenuInvalidPositionX, MdMenuInvalidPositionY } from './menu-errors';
import { MdMenuItem } from './menu-item';
import { FocusKeyManager } from '../core/a11y/focus-key-manager';
import { transformMenu, fadeInItems } from './menu-animations';
export var MdMenu = (function () {
    function MdMenu(posX, posY) {
        /** Config object to be passed into the menu's ngClass */
        this._classList = {};
        /** Position of the menu in the X axis. */
        this.positionX = 'after';
        /** Position of the menu in the Y axis. */
        this.positionY = 'below';
        this.overlapTrigger = true;
        /** Event emitted when the menu is closed. */
        this.close = new EventEmitter();
        if (posX) {
            this._setPositionX(posX);
        }
        if (posY) {
            this._setPositionY(posY);
        }
        this.setPositionClasses(this.positionX, this.positionY);
    }
    MdMenu.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.items).withWrap();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () {
            _this._emitCloseEvent();
        });
    };
    MdMenu.prototype.ngOnDestroy = function () {
        this._tabSubscription.unsubscribe();
    };
    Object.defineProperty(MdMenu.prototype, "classList", {
        /**
         * This method takes classes set on the host md-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param classes list of class names
         */
        set: function (classes) {
            this._classList = classes.split(' ').reduce(function (obj, className) {
                obj[className] = true;
                return obj;
            }, {});
            this.setPositionClasses(this.positionX, this.positionY);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     */
    MdMenu.prototype.focusFirstItem = function () {
        this._keyManager.setFirstItemActive();
    };
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the menu.
     */
    MdMenu.prototype._emitCloseEvent = function () {
        this.close.emit();
    };
    MdMenu.prototype._setPositionX = function (pos) {
        if (pos !== 'before' && pos !== 'after') {
            throw new MdMenuInvalidPositionX();
        }
        this.positionX = pos;
    };
    MdMenu.prototype._setPositionY = function (pos) {
        if (pos !== 'above' && pos !== 'below') {
            throw new MdMenuInvalidPositionY();
        }
        this.positionY = pos;
    };
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     */
    MdMenu.prototype.setPositionClasses = function (posX, posY) {
        this._classList['mat-menu-before'] = posX == 'before';
        this._classList['mat-menu-after'] = posX == 'after';
        this._classList['mat-menu-above'] = posY == 'above';
        this._classList['mat-menu-below'] = posY == 'below';
    };
    __decorate([
        ViewChild(TemplateRef), 
        __metadata('design:type', TemplateRef)
    ], MdMenu.prototype, "templateRef", void 0);
    __decorate([
        ContentChildren(MdMenuItem), 
        __metadata('design:type', QueryList)
    ], MdMenu.prototype, "items", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdMenu.prototype, "overlapTrigger", void 0);
    __decorate([
        Input('class'), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], MdMenu.prototype, "classList", null);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MdMenu.prototype, "close", void 0);
    MdMenu = __decorate([
        Component({selector: 'md-menu, mat-menu',
            host: { 'role': 'menu' },
            template: "<template><div class=\"mat-menu-panel\" [ngClass]=\"_classList\" (keydown)=\"_keyManager.onKeydown($event)\" (click)=\"_emitCloseEvent()\" [@transformMenu]=\"'showing'\"><div class=\"mat-menu-content\" [@fadeInItems]=\"'showing'\"><ng-content></ng-content></div></div></template>",
            styles: [".mat-menu-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh + 48px)}.mat-menu-panel.mat-menu-after.mat-menu-below{transform-origin:left top}.mat-menu-panel.mat-menu-after.mat-menu-above{transform-origin:left bottom}.mat-menu-panel.mat-menu-before.mat-menu-below{transform-origin:right top}.mat-menu-panel.mat-menu-before.mat-menu-above{transform-origin:right bottom}[dir=rtl] .mat-menu-panel.mat-menu-after.mat-menu-below{transform-origin:right top}[dir=rtl] .mat-menu-panel.mat-menu-after.mat-menu-above{transform-origin:right bottom}[dir=rtl] .mat-menu-panel.mat-menu-before.mat-menu-below{transform-origin:left top}[dir=rtl] .mat-menu-panel.mat-menu-before.mat-menu-above{transform-origin:left bottom}@media screen and (-ms-high-contrast:active){.mat-menu-panel{outline:solid 1px}}.mat-menu-content{padding-top:8px;padding-bottom:8px}.mat-menu-item{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,\"Helvetica Neue\",sans-serif;text-align:start;text-decoration:none;position:relative}.mat-menu-item[disabled]{cursor:default}.mat-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-menu-item .mat-icon{margin-left:16px}button.mat-menu-item{width:100%}.mat-menu-ripple{position:absolute;top:0;left:0;bottom:0;right:0}"],
            encapsulation: ViewEncapsulation.None,
            animations: [
                transformMenu,
                fadeInItems
            ],
            exportAs: 'mdMenu'
        }),
        __param(0, Attribute('x-position')),
        __param(1, Attribute('y-position')), 
        __metadata('design:paramtypes', [String, String])
    ], MdMenu);
    return MdMenu;
}());
//# sourceMappingURL=menu-directive.js.map