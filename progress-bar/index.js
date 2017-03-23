var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompatibilityModule } from '../core/compatibility/compatibility';
import { MdProgressBar } from './progress-bar';
var MdProgressBarModule = MdProgressBarModule_1 = (function () {
    function MdProgressBarModule() {
    }
    /** @deprecated */
    MdProgressBarModule.forRoot = function () {
        return {
            ngModule: MdProgressBarModule_1,
            providers: []
        };
    };
    return MdProgressBarModule;
}());
MdProgressBarModule = MdProgressBarModule_1 = __decorate([
    NgModule({
        imports: [CommonModule, CompatibilityModule],
        exports: [MdProgressBar, CompatibilityModule],
        declarations: [MdProgressBar],
    })
], MdProgressBarModule);
export { MdProgressBarModule };
export * from './progress-bar';
var MdProgressBarModule_1;
//# sourceMappingURL=index.js.map