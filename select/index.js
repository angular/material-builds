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
import { MdSelect } from './select';
import { MdOption } from './option';
import { DefaultStyleCompatibilityModeModule, OVERLAY_PROVIDERS, MdRippleModule, OverlayModule } from '../core';
export * from './select';
export { MdOption } from './option';
export { fadeInContent, transformPanel, transformPlaceholder } from './select-animations';
export var MdSelectModule = (function () {
    function MdSelectModule() {
    }
    MdSelectModule.forRoot = function () {
        return {
            ngModule: MdSelectModule,
            providers: [OVERLAY_PROVIDERS]
        };
    };
    MdSelectModule = __decorate([
        NgModule({
            imports: [CommonModule, OverlayModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSelect, MdOption, DefaultStyleCompatibilityModeModule],
            declarations: [MdSelect, MdOption],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSelectModule);
    return MdSelectModule;
}());

//# sourceMappingURL=index.js.map
