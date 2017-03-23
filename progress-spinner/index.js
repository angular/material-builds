var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CompatibilityModule } from '../core';
import { MdProgressSpinner, MdSpinner, MdProgressSpinnerCssMatStyler, MdProgressCircleCssMatStyler } from './progress-spinner';
var MdProgressSpinnerModule = MdProgressSpinnerModule_1 = (function () {
    function MdProgressSpinnerModule() {
    }
    /** @deprecated */
    MdProgressSpinnerModule.forRoot = function () {
        return {
            ngModule: MdProgressSpinnerModule_1,
            providers: []
        };
    };
    return MdProgressSpinnerModule;
}());
MdProgressSpinnerModule = MdProgressSpinnerModule_1 = __decorate([
    NgModule({
        imports: [CompatibilityModule],
        exports: [
            MdProgressSpinner,
            MdSpinner,
            CompatibilityModule,
            MdProgressSpinnerCssMatStyler,
            MdProgressCircleCssMatStyler
        ],
        declarations: [
            MdProgressSpinner,
            MdSpinner,
            MdProgressSpinnerCssMatStyler,
            MdProgressCircleCssMatStyler
        ],
    })
], MdProgressSpinnerModule);
export { MdProgressSpinnerModule };
export * from './progress-spinner';
/** @deprecated */
export { MdProgressSpinnerModule as MdProgressCircleModule };
export { MdProgressSpinner as MdProgressCircle };
var MdProgressSpinnerModule_1;
//# sourceMappingURL=index.js.map