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
import { HttpModule } from '@angular/http';
import { CompatibilityModule } from '../core';
import { MdIcon, ICON_REGISTRY_PROVIDER } from './icon';
export var MdIconModule = (function () {
    function MdIconModule() {
    }
    /** @deprecated */
    MdIconModule.forRoot = function () {
        return {
            ngModule: MdIconModule,
            providers: [],
        };
    };
    MdIconModule = __decorate([
        NgModule({
            imports: [HttpModule, CompatibilityModule],
            exports: [MdIcon, CompatibilityModule],
            declarations: [MdIcon],
            providers: [ICON_REGISTRY_PROVIDER],
        }), 
        __metadata('design:paramtypes', [])
    ], MdIconModule);
    return MdIconModule;
}());
export * from './icon';
export { MdIconRegistry } from './icon-registry';
//# sourceMappingURL=index.js.map