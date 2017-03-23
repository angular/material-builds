var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSelect } from './select';
import { MdOptionModule } from '../core/option/option';
import { CompatibilityModule, OverlayModule } from '../core';
var MdSelectModule = MdSelectModule_1 = (function () {
    function MdSelectModule() {
    }
    /** @deprecated */
    MdSelectModule.forRoot = function () {
        return {
            ngModule: MdSelectModule_1,
            providers: []
        };
    };
    return MdSelectModule;
}());
MdSelectModule = MdSelectModule_1 = __decorate([
    NgModule({
        imports: [
            CommonModule,
            OverlayModule,
            MdOptionModule,
            CompatibilityModule,
        ],
        exports: [MdSelect, MdOptionModule, CompatibilityModule],
        declarations: [MdSelect],
    })
], MdSelectModule);
export { MdSelectModule };
export * from './select';
export { fadeInContent, transformPanel, transformPlaceholder } from './select-animations';
var MdSelectModule_1;
//# sourceMappingURL=index.js.map