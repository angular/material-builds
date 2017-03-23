var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, CompatibilityModule } from '../core';
import { MdMenu } from './menu-directive';
import { MdMenuItem } from './menu-item';
import { MdMenuTrigger } from './menu-trigger';
import { MdRippleModule } from '../core/ripple/index';
var MdMenuModule = MdMenuModule_1 = (function () {
    function MdMenuModule() {
    }
    /** @deprecated */
    MdMenuModule.forRoot = function () {
        return {
            ngModule: MdMenuModule_1,
            providers: [],
        };
    };
    return MdMenuModule;
}());
MdMenuModule = MdMenuModule_1 = __decorate([
    NgModule({
        imports: [
            OverlayModule,
            CommonModule,
            MdRippleModule,
            CompatibilityModule,
        ],
        exports: [MdMenu, MdMenuItem, MdMenuTrigger, CompatibilityModule],
        declarations: [MdMenu, MdMenuItem, MdMenuTrigger],
    })
], MdMenuModule);
export { MdMenuModule };
export * from './menu';
export { MdMenuTrigger } from './menu-trigger';
export { fadeInItems, transformMenu } from './menu-animations';
export { MdMenu } from './menu-directive';
export { MdMenuItem } from './menu-item';
var MdMenuModule_1;
//# sourceMappingURL=index.js.map