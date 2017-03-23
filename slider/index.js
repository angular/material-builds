var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompatibilityModule, GestureConfig, StyleModule } from '../core';
import { MdSlider } from './slider';
import { RtlModule } from '../core/rtl/dir';
var MdSliderModule = MdSliderModule_1 = (function () {
    function MdSliderModule() {
    }
    /** @deprecated */
    MdSliderModule.forRoot = function () {
        return {
            ngModule: MdSliderModule_1,
            providers: []
        };
    };
    return MdSliderModule;
}());
MdSliderModule = MdSliderModule_1 = __decorate([
    NgModule({
        imports: [CommonModule, FormsModule, CompatibilityModule, StyleModule, RtlModule],
        exports: [MdSlider, CompatibilityModule],
        declarations: [MdSlider],
        providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
    })
], MdSliderModule);
export { MdSliderModule };
export * from './slider';
var MdSliderModule_1;
//# sourceMappingURL=index.js.map