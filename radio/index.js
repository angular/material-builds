var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VIEWPORT_RULER_PROVIDER } from '../core/overlay/position/viewport-ruler';
import { MdRippleModule, CompatibilityModule, UNIQUE_SELECTION_DISPATCHER_PROVIDER, FocusOriginMonitor, } from '../core';
import { MdRadioGroup, MdRadioButton } from './radio';
var MdRadioModule = MdRadioModule_1 = (function () {
    function MdRadioModule() {
    }
    /** @deprecated */
    MdRadioModule.forRoot = function () {
        return {
            ngModule: MdRadioModule_1,
            providers: [],
        };
    };
    return MdRadioModule;
}());
MdRadioModule = MdRadioModule_1 = __decorate([
    NgModule({
        imports: [CommonModule, MdRippleModule, CompatibilityModule],
        exports: [MdRadioGroup, MdRadioButton, CompatibilityModule],
        providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER, VIEWPORT_RULER_PROVIDER, FocusOriginMonitor],
        declarations: [MdRadioGroup, MdRadioButton],
    })
], MdRadioModule);
export { MdRadioModule };
export * from './radio';
var MdRadioModule_1;
//# sourceMappingURL=index.js.map