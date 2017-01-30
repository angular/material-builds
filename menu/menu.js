var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, CompatibilityModule } from '../core';
import { MdMenu } from './menu-directive';
import { MdMenuItem } from './menu-item';
import { MdMenuTrigger } from './menu-trigger';
import { MdRippleModule } from '../core/ripple/ripple';
export { MdMenu } from './menu-directive';
export { MdMenuItem } from './menu-item';
export { MdMenuTrigger } from './menu-trigger';
export var MdMenuModule = (function () {
    function MdMenuModule() {
    }
    /** @deprecated */
    MdMenuModule.forRoot = function () {
        return {
            ngModule: MdMenuModule,
            providers: [],
        };
    };
    MdMenuModule = __decorate([
        NgModule({
            imports: [OverlayModule, CommonModule, MdRippleModule, CompatibilityModule],
            exports: [MdMenu, MdMenuItem, MdMenuTrigger, CompatibilityModule],
            declarations: [MdMenu, MdMenuItem, MdMenuTrigger],
        }), 
        __metadata('design:paramtypes', [])
    ], MdMenuModule);
    return MdMenuModule;
}());
//# sourceMappingURL=menu.js.map