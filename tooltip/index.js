var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { OverlayModule, CompatibilityModule } from '../core';
import { PlatformModule } from '../core/platform/index';
import { MdTooltip, TooltipComponent } from './tooltip';
var MdTooltipModule = MdTooltipModule_1 = (function () {
    function MdTooltipModule() {
    }
    /** @deprecated */
    MdTooltipModule.forRoot = function () {
        return {
            ngModule: MdTooltipModule_1,
            providers: []
        };
    };
    return MdTooltipModule;
}());
MdTooltipModule = MdTooltipModule_1 = __decorate([
    NgModule({
        imports: [OverlayModule, CompatibilityModule, PlatformModule],
        exports: [MdTooltip, TooltipComponent, CompatibilityModule],
        declarations: [MdTooltip, TooltipComponent],
        entryComponents: [TooltipComponent],
    })
], MdTooltipModule);
export { MdTooltipModule };
export * from './tooltip';
var MdTooltipModule_1;
//# sourceMappingURL=index.js.map