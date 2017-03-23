var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CompatibilityModule } from '../core';
import { MdIcon, ICON_REGISTRY_PROVIDER } from './icon';
var MdIconModule = MdIconModule_1 = (function () {
    function MdIconModule() {
    }
    /** @deprecated */
    MdIconModule.forRoot = function () {
        return {
            ngModule: MdIconModule_1,
            providers: [],
        };
    };
    return MdIconModule;
}());
MdIconModule = MdIconModule_1 = __decorate([
    NgModule({
        imports: [HttpModule, CompatibilityModule],
        exports: [MdIcon, CompatibilityModule],
        declarations: [MdIcon],
        providers: [ICON_REGISTRY_PROVIDER],
    })
], MdIconModule);
export { MdIconModule };
export * from './icon';
export { MdIconRegistry } from './icon-registry';
var MdIconModule_1;
//# sourceMappingURL=index.js.map