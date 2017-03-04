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
import { CompatibilityModule } from '../core';
import { A11yModule } from '../core/a11y/index';
import { OverlayModule } from '../core/overlay/overlay-directives';
import { MdSidenav, MdSidenavContainer } from './sidenav';
export var MdSidenavModule = (function () {
    function MdSidenavModule() {
    }
    /** @deprecated */
    MdSidenavModule.forRoot = function () {
        return {
            ngModule: MdSidenavModule,
            providers: []
        };
    };
    MdSidenavModule = __decorate([
        NgModule({
            imports: [CommonModule, CompatibilityModule, A11yModule, OverlayModule],
            exports: [MdSidenavContainer, MdSidenav, CompatibilityModule],
            declarations: [MdSidenavContainer, MdSidenav],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSidenavModule);
    return MdSidenavModule;
}());
export * from './sidenav';
//# sourceMappingURL=index.js.map