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
import { MdLineModule, CompatibilityModule } from '../core';
import { MdGridTile, MdGridTileText, MdGridTileFooterCssMatStyler, MdGridTileHeaderCssMatStyler, MdGridAvatarCssMatStyler } from './grid-tile';
import { MdGridList } from './grid-list';
export var MdGridListModule = (function () {
    function MdGridListModule() {
    }
    /** @deprecated */
    MdGridListModule.forRoot = function () {
        return {
            ngModule: MdGridListModule,
            providers: []
        };
    };
    MdGridListModule = __decorate([
        NgModule({
            imports: [MdLineModule, CompatibilityModule],
            exports: [
                MdGridList,
                MdGridTile,
                MdGridTileText,
                MdLineModule,
                CompatibilityModule,
                MdGridTileHeaderCssMatStyler,
                MdGridTileFooterCssMatStyler,
                MdGridAvatarCssMatStyler
            ],
            declarations: [
                MdGridList,
                MdGridTile,
                MdGridTileText,
                MdGridTileHeaderCssMatStyler,
                MdGridTileFooterCssMatStyler,
                MdGridAvatarCssMatStyler
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdGridListModule);
    return MdGridListModule;
}());
export * from './grid-list';
//# sourceMappingURL=index.js.map