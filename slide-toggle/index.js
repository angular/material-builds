var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig, CompatibilityModule } from '../core';
import { MdSlideToggle } from './slide-toggle';
import { MdRippleModule } from '../core/ripple/index';
var MdSlideToggleModule = MdSlideToggleModule_1 = (function () {
    function MdSlideToggleModule() {
    }
    /** @deprecated */
    MdSlideToggleModule.forRoot = function () {
        return {
            ngModule: MdSlideToggleModule_1,
            providers: []
        };
    };
    return MdSlideToggleModule;
}());
MdSlideToggleModule = MdSlideToggleModule_1 = __decorate([
    NgModule({
        imports: [FormsModule, MdRippleModule, CompatibilityModule],
        exports: [MdSlideToggle, CompatibilityModule],
        declarations: [MdSlideToggle],
        providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }],
    })
], MdSlideToggleModule);
export { MdSlideToggleModule };
export * from './slide-toggle';
var MdSlideToggleModule_1;
//# sourceMappingURL=index.js.map