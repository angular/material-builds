var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompatibilityModule } from '../core';
import { A11yModule } from '../core/a11y/index';
import { OverlayModule } from '../core/overlay/overlay-directives';
import { MdSidenav, MdSidenavContainer } from './sidenav';
var MdSidenavModule = MdSidenavModule_1 = (function () {
    function MdSidenavModule() {
    }
    /** @deprecated */
    MdSidenavModule.forRoot = function () {
        return {
            ngModule: MdSidenavModule_1,
            providers: []
        };
    };
    return MdSidenavModule;
}());
MdSidenavModule = MdSidenavModule_1 = __decorate([
    NgModule({
        imports: [CommonModule, CompatibilityModule, A11yModule, OverlayModule],
        exports: [MdSidenavContainer, MdSidenav, CompatibilityModule],
        declarations: [MdSidenavContainer, MdSidenav],
    })
], MdSidenavModule);
export { MdSidenavModule };
export * from './sidenav';
var MdSidenavModule_1;
//# sourceMappingURL=index.js.map