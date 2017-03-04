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
import { FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig, CompatibilityModule } from '../core';
import { MdSlideToggle } from './slide-toggle';
import { MdRippleModule } from '../core/ripple/index';
export var MdSlideToggleModule = (function () {
    function MdSlideToggleModule() {
    }
    /** @deprecated */
    MdSlideToggleModule.forRoot = function () {
        return {
            ngModule: MdSlideToggleModule,
            providers: []
        };
    };
    MdSlideToggleModule = __decorate([
        NgModule({
            imports: [FormsModule, MdRippleModule, CompatibilityModule],
            exports: [MdSlideToggle, CompatibilityModule],
            declarations: [MdSlideToggle],
            providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSlideToggleModule);
    return MdSlideToggleModule;
}());
export * from './slide-toggle';
//# sourceMappingURL=index.js.map