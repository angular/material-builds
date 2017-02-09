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
import { OverlayModule, PortalModule, CompatibilityModule, LIVE_ANNOUNCER_PROVIDER } from '../core';
import { CommonModule } from '@angular/common';
import { MdSnackBar } from './snack-bar';
import { MdSnackBarContainer } from './snack-bar-container';
import { SimpleSnackBar } from './simple-snack-bar';
export var MdSnackBarModule = (function () {
    function MdSnackBarModule() {
    }
    /** @deprecated */
    MdSnackBarModule.forRoot = function () {
        return {
            ngModule: MdSnackBarModule,
            providers: []
        };
    };
    MdSnackBarModule = __decorate([
        NgModule({
            imports: [OverlayModule, PortalModule, CommonModule, CompatibilityModule],
            exports: [MdSnackBarContainer, CompatibilityModule],
            declarations: [MdSnackBarContainer, SimpleSnackBar],
            entryComponents: [MdSnackBarContainer, SimpleSnackBar],
            providers: [MdSnackBar, LIVE_ANNOUNCER_PROVIDER]
        }), 
        __metadata('design:paramtypes', [])
    ], MdSnackBarModule);
    return MdSnackBarModule;
}());
export * from './snack-bar';
export * from './snack-bar-container';
export * from './snack-bar-config';
export * from './snack-bar-ref';
export * from './simple-snack-bar';
//# sourceMappingURL=index.js.map