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
import { OverlayModule, CompatibilityModule } from '../core';
import { PlatformModule } from '../core/platform/index';
import { MdTooltip, TooltipComponent } from './tooltip';
export var MdTooltipModule = (function () {
    function MdTooltipModule() {
    }
    /** @deprecated */
    MdTooltipModule.forRoot = function () {
        return {
            ngModule: MdTooltipModule,
            providers: []
        };
    };
    MdTooltipModule = __decorate([
        NgModule({
            imports: [OverlayModule, CompatibilityModule, PlatformModule],
            exports: [MdTooltip, TooltipComponent, CompatibilityModule],
            declarations: [MdTooltip, TooltipComponent],
            entryComponents: [TooltipComponent],
        }), 
        __metadata('design:paramtypes', [])
    ], MdTooltipModule);
    return MdTooltipModule;
}());
export * from './tooltip';
//# sourceMappingURL=index.js.map