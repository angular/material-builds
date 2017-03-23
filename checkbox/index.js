var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdRippleModule, CompatibilityModule, FocusOriginMonitor } from '../core';
import { MdCheckbox } from './checkbox';
var MdCheckboxModule = MdCheckboxModule_1 = (function () {
    function MdCheckboxModule() {
    }
    /** @deprecated */
    MdCheckboxModule.forRoot = function () {
        return {
            ngModule: MdCheckboxModule_1,
            providers: []
        };
    };
    return MdCheckboxModule;
}());
MdCheckboxModule = MdCheckboxModule_1 = __decorate([
    NgModule({
        imports: [CommonModule, MdRippleModule, CompatibilityModule],
        exports: [MdCheckbox, CompatibilityModule],
        declarations: [MdCheckbox],
        providers: [FocusOriginMonitor]
    })
], MdCheckboxModule);
export { MdCheckboxModule };
export * from './checkbox';
var MdCheckboxModule_1;
//# sourceMappingURL=index.js.map