var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CompatibilityModule } from '../core';
import { MdToolbar, MdToolbarRow } from './toolbar';
var MdToolbarModule = MdToolbarModule_1 = (function () {
    function MdToolbarModule() {
    }
    /** @deprecated */
    MdToolbarModule.forRoot = function () {
        return {
            ngModule: MdToolbarModule_1,
            providers: []
        };
    };
    return MdToolbarModule;
}());
MdToolbarModule = MdToolbarModule_1 = __decorate([
    NgModule({
        imports: [CompatibilityModule],
        exports: [MdToolbar, MdToolbarRow, CompatibilityModule],
        declarations: [MdToolbar, MdToolbarRow],
    })
], MdToolbarModule);
export { MdToolbarModule };
export * from './toolbar';
var MdToolbarModule_1;
//# sourceMappingURL=index.js.map