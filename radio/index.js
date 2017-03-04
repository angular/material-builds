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
import { VIEWPORT_RULER_PROVIDER } from '../core/overlay/position/viewport-ruler';
import { MdRippleModule, CompatibilityModule, UNIQUE_SELECTION_DISPATCHER_PROVIDER, FocusOriginMonitor } from '../core';
import { MdRadioGroup, MdRadioButton } from './radio';
export var MdRadioModule = (function () {
    function MdRadioModule() {
    }
    /** @deprecated */
    MdRadioModule.forRoot = function () {
        return {
            ngModule: MdRadioModule,
            providers: [],
        };
    };
    MdRadioModule = __decorate([
        NgModule({
            imports: [CommonModule, MdRippleModule, CompatibilityModule],
            exports: [MdRadioGroup, MdRadioButton, CompatibilityModule],
            providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER, VIEWPORT_RULER_PROVIDER, FocusOriginMonitor],
            declarations: [MdRadioGroup, MdRadioButton],
        }), 
        __metadata('design:paramtypes', [])
    ], MdRadioModule);
    return MdRadioModule;
}());
export * from './radio';
//# sourceMappingURL=index.js.map