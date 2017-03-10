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
import { CompatibilityModule, MdRippleModule, StyleModule } from '../core';
import { MdAnchor, MdButton, MdButtonCssMatStyler, MdFabCssMatStyler, MdIconButtonCssMatStyler, MdMiniFabCssMatStyler, MdRaisedButtonCssMatStyler } from './button';
export * from './button';
export var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    /** @deprecated */
    MdButtonModule.forRoot = function () {
        return {
            ngModule: MdButtonModule,
            providers: []
        };
    };
    MdButtonModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                MdRippleModule,
                CompatibilityModule,
                StyleModule,
            ],
            exports: [
                MdButton,
                MdAnchor,
                CompatibilityModule,
                MdButtonCssMatStyler,
                MdRaisedButtonCssMatStyler,
                MdIconButtonCssMatStyler,
                MdFabCssMatStyler,
                MdMiniFabCssMatStyler,
            ],
            declarations: [
                MdButton,
                MdAnchor,
                MdButtonCssMatStyler,
                MdRaisedButtonCssMatStyler,
                MdIconButtonCssMatStyler,
                MdFabCssMatStyler,
                MdMiniFabCssMatStyler,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonModule);
    return MdButtonModule;
}());
//# sourceMappingURL=index.js.map